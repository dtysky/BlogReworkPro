"""
This module is used for cache.
"""

__author__ = "Tianyu Dai (dtysky)"
__email = "dtysky@outlook.com"
__name__ = "cache"


from utils import get_all_classes
from web_caches import WebCache


class Cache(object):
    """
    Cache singleton.
    """

    def __init__(self):
        self._web_caches = {}
        for c in get_all_classes(["web_caches.py"], WebCache):
            obj = c()
            self._web_caches[obj.flag] = obj

    def get(self, flag):
        return self._web_caches[flag] if flag in self._web_caches else None

cache = Cache()

