"""
This module is used for web_caches.
"""

__author__ = "Tianyu Dai (dtysky)"
__email = "dtysky@outlook.com"
__name__ = "web_caches"


from utils import convert_to_underline
from utils import logger


class WebCache():
    """
    Base class for managing cache for reducing the database query.
    """

    def __init__(self):
        self._cache = {}
        self._state = {}

    @property
    def flag(self):
        return convert_to_underline(
            self.__class__.__name__.replace('Cache', '')
        )

    def updateContent(self, parameters, content):
        name = parameters
        logger.info("Cache: %s - %s\nParams: %s" % ("update", self.flag, parameters))
        self._cache[name] = content
        self._state[name] = False

    def modifyState(self, parameters):
        name = parameters
        logger.info("Cache: %s - %s\nParams: %s" % ("modify", self.flag, parameters))
        if not self.has(parameters):
            self._error("Try to modify state but '%s' is not in cache now !" % name)
        self._state[name] = True

    def get(self, parameters):
        name = parameters
        if not self.has(parameters):
            self._error("Try to get but '%s' is not in cache now !" % name)
        return self._cache[name]

    def delete(self, parameters):
        name = parameters
        logger.info("Cache: %s - %s\nParams: %s" % ("delete", self.flag, parameters))
        if not self.has(parameters):
            self._error("Try to delete but '%s' is not in cache now !" % name)
        del self._cache[name]
        del self._state[name]

    def has(self, parameters):
        name = parameters
        return name in self._cache

    def is_modified(self, parameters):
        name = parameters
        if not self.has(parameters):
            self._error("Try to check but '%s' is not in cache now !" % name)
        return self._state[name]

    def _error(self, message):
        line = "Cache: %s\n%s" % (self.flag, message)
        logger.error(line)
        raise


class ArchivesCache(WebCache):
    """
    Cache manager for "archives".
    """

    pass


class TagsCache(WebCache):
    """
    Cache manager for "tags".
    """

    pass


class AuthorsCache(WebCache):
    """
    Cache manager for "authors".
    """

    pass


class TagCache(WebCache):
    """
    Cache manager for "tag".
    """

    pass


class AuthorCache(WebCache):
    """
    Cache manager for "author".
    """

    pass


class CategoryCache(WebCache):
    """
    Cache manager for "category".
    """

    pass


class ArticleCache(WebCache):
    """
    Cache manager for "article".
    """

    pass

