# T_T coding=utf-8 T_T

"""
Converting metadata to slug.
"""

__author__ = "Tianyu Dai (dtysky)"
__email__ = "dtysky@outlook.com"
__name__ = "Wrapper"


from copy import deepcopy as copy
from slug_wrappers import SlugWrapper
from utils import get_all_classes
from utils import logger


class Wrapper(object):
    """
    Converting metadata to slug.
    """

    def __init__(self):
        self._slug_wrappers = {}
        for c in get_all_classes(["slug_wrappers.py"], SlugWrapper):
            obj = c()
            self._slug_wrappers[obj.flag] = obj

    def _slug_wrap(self, metadata):
        tmp = copy(metadata)
        for wrapper_name, wrapper_obj in self._slug_wrappers.items():
            tmp[wrapper_name] = wrapper_obj.wrap(copy(metadata))
        return tmp

    def wrap(self, metadata):
        logger.info("Wrapping start")
        return self._slug_wrap(metadata)