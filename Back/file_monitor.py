# T_T coding=utf-8 T_T

"""
A monitor for listening the event while file changes.
"""

__author__ = "Tianyu Dai (dtysky)"
__email__ = "dtysky@outlook.com"
__name__ = "FileMonitor"


from watchdog.events import FileSystemEventHandler
from parser import Parser
from wrapper import Wrapper
from writer import Writer
from sitemap_generator import SitemapGenerator
from feeds_generator import FeedsGenerator
from utils import print_database
from utils import is_markdown_file
from utils import logger
from config import config


class FileMonitor(FileSystemEventHandler):
    """
    A monitor for listening the event while file changes.
    """

    def __init__(self, database, dir_path, debug=False):
        self._parser = Parser()
        self._wrapper = Wrapper()
        self._writer = Writer(database)
        self._sitemap_generator = SitemapGenerator(database)
        self._feeds_generator = FeedsGenerator(database)
        self._debug = debug
        self._dir_path = dir_path
        self._database = database
        self._file_path = ""

    def _parse(self, file_path):
        page = self._parser.parse(file_path)
        if self._debug:
            print "Parse:"
            print page
            print ""
        return page

    def _wrap(self, page):
        metadata = self._wrapper.wrap(page["metadata"])
        if self._debug:
            print "Wrap:"
            print metadata
            print ""
        page["metadata"] = metadata
        return page

    def _write(self, file_path, mode, page=None):
        self._writer.write(file_path, mode, page)
        if self._debug:
            print "Write(%s):" % mode
            print_database(self._database)
            print ""

    def _work(self, file_path, mode):
        path = file_path.replace(self._dir_path + "/", "")
        self._file_path = path
        if mode == "delete":
            try:
                self._write(path, mode)
            except:
                self._error("Writing error !")
        else:
            page = None
            try:
                page = self._parse(path)
            except:
                self._error("Parsing error !")
                return
            try:
                page = self._wrap(page)
            except:
                self._error("Wrapping error !")
                return
            try:
                self._write(path, mode, page)
            except:
                self._error("Writing error !")
        try:
            self._sitemap_generator.generate()
        except:
            self._error("Sitemap generating error !")
        try:
            self._feeds_generator.generate()
        except:
            self._error("Feeds generating error !")

    def on_created(self, event):
        path = event.src_path
        if not is_markdown_file(path):
            return
        logger.info("Create: %s" % path)
        self._work(path, "update")

    def on_deleted(self, event):
        path = event.src_path
        if not is_markdown_file(path):
            return
        logger.info("Delete: %s" % path)
        self._work(path, "delete")

    def on_modified(self, event):
        path = event.src_path
        if not is_markdown_file(path):
            return
        if not config["is_linux"]:
            logger.info("Modify(happen with create and delete on osx/windows(?), ignore...): %s" % path)
            return
        logger.info("Modify: %s" % path)
        self._work(path, "update")

    def on_moved(self, event):
        src_path = event.src_path
        dst_path = event.dest_path
        if not is_markdown_file(src_path) or not is_markdown_file(dst_path):
            return
        logger.info("Move: %s, %s" % (src_path, dst_path))
        self._work(src_path, "delete")
        self._work(dst_path, "update")

    def _error(self, message):
        line = "%s\nFile: %s" % (message, self._file_path)
        logger.error(line)
        if self._debug:
            raise