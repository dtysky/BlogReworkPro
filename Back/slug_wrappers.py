# T_T coding=utf-8 T_T

"""
Classes for convert metadata to slug.
"""

__author__ = "Tianyu Dai (dtysky)"
__email__ = "dtysky@outlook.com"
__name__ = "SlugWrapper"


import os
from utils import convert_to_underline


class SlugWrapper(object):
    """
    Parent class for parsing meta data.
    """

    def __init__(self):
        pass

    @property
    def flag(self):
        return convert_to_underline(
            self.__class__.__name__.replace('Wrapper', '')
        )

    def wrap(self, metadata):
        flag = self.flag
        return {
            "view": metadata[flag],
            "slug": metadata[flag]
        }


class TitleWrapper(SlugWrapper):
    """
    Converting "title" metadata.
    """

    def wrap(self, metadata):
        category = metadata["category"]
        file_name = os.path.basename(metadata["file"]).split(".")[0]
        return {
            "view": metadata["title"],
            "slug": "%s-%s" % (category, file_name)
        }


class TagsWrapper(SlugWrapper):
    """
    Converting "tags" metadata.
    """

    def wrap(self, metadata):
        return [
            {
                "view": tag,
                "slug": tag
            }
            for tag in metadata["tags"]
        ]


class AuthorsWrapper(SlugWrapper):
    """
    Converting "authors" metadata.
    """

    def wrap(self, metadata):
        return [
            {
                "view": author,
                "slug": author
            }
            for author in metadata["authors"]
        ]


class CategoryWrapper(SlugWrapper):
    """
    Converting "category" metadata.
    Only one category can one article have.
    """
    pass