# T_T coding=utf-8 T_T

"""
Some useful tools.
"""


__author__ = "Tianyu Dai (dtysky)"
__email__ = "dtysky@outlook.com"
__name__ = "Utils"


import os
from os.path import splitext
from datetime import datetime
from config import config


def init_database(database):
    """
    Creating collections.
    """
    now_collection_names = database.collection_names()
    collection_names = [
        "archives",
        "article",
        "author",
        "authors",
        "categories",
        "category",
        "tag",
        "tags"
    ]
    for name in collection_names:
        if name not in now_collection_names:
            database.create_collection(name)


def convert_to_underline(name):
    """
    Convert upper camel case to underline.
    """
    s = name
    tmp = ""
    for _s_ in s:
        tmp += _s_ if _s_.islower() else "-" + _s_.lower()
    return tmp[1:]


def get_all_classes(files, parent_class):
    """
    Return a list contents all classes
    """
    def is_class(d):
        return type(d) == type(parent_class)
    def is_sub_of_parent(d):
        return issubclass(d, parent_class) and d != parent_class

    modules = []
    classes = []

    #Import all modules from TagSorce dir
    for f in files:
        n, e = os.path.splitext(f)
        if e == '.py':
            modules.append(__import__(n))

    #Get all classes which are children of Path
    for m in modules:
        for d in dir(m):
            d = getattr(m, d)
            if is_class(d) and is_sub_of_parent(d):
                classes.append(d)
    return classes


def print_database(database):
    """
    Print all items in database.
    """
    collection_names = database.collection_names()
    collection_names.remove("system.indexes")
    collection_names.remove("article")
    for name in collection_names:
        collection = database.get_collection(name)
        print name, ":"
        for item in collection.find({}):
            print item


def clear_database(database):
    """
    Clear database.
    """
    collection_names = database.collection_names()
    collection_names.remove("system.indexes")
    for name in collection_names:
        collection = database.get_collection(name)
        collection.delete_many({})


def is_markdown_file(file_path):
    """
    Judging file is markdown file.
    """
    return splitext(file_path)[1] == ".md"


def format_date(date, mode):
    if date.tzinfo:
        tz = date.strftime('%z')
        tz = tz[:-2] + ':' + tz[-2:]
    else:
        tz = "-00:00"
    if mode == "sitemap":
        return date.strftime("%Y-%m-%dT%H:%M:%S") + tz
    elif mode == "feeds":
        return date.strftime("%A, %d %b %Y %H:%M:%S ") + tz


class Logger(object):
    """
    A monitor for printing and storing server state.
    """

    def __init__(self, log_dir_path):
        self._log_dir_path = log_dir_path
        self._time = ""
        self._file = None
        self._new_with_check()

    def _new_with_check(self):
        if not os.path.exists(self._log_dir_path):
            os.mkdir(self._log_dir_path)
        now = datetime.now().strftime("%Y-%m-%d")
        if now != self._time:
            self._time = now
            if self._file:
                self._file.close()
            self._file = open(
                "%s/%s.log" %
                (self._log_dir_path, now),
                "a"
            )

    def _log(self, message, color):
        self._new_with_check()
        line = "%s: %s\n" % (
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            message
        )
        print "%s%s" % (color, line)
        self._file.write(line)

    def info(self, message):
        self._log(
            "Info:\n%s" % message,
            "\033[1;32m"
        )

    def warning(self, message):
        self._log(
            "Warning:\n%s" % message,
            "\033[1;35m"
        )

    def error(self, message):
        self._log(
            "Error:\n%s" % message,
            "\033[1;31m"
        )

# Singleton
logger = Logger(config["log_path"])