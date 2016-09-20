# T_T coding=utf-8 T_T

"""
Classes for parsing metadata.
"""

__author__ = "Tianyu Dai (dtysky)"
__email__ = "dtysky@outlook.com"
__name__ = "MetaDataParser"


from utils import convert_to_underline


class MetaDataParser(object):
    """
    Parent class for parsing meta data.
    """

    def __init__(self):
        pass

    @property
    def flag(self):
        return convert_to_underline(
            self.__class__.__name__.replace('Parser', '')
        )

    def is_necessary(self):
        return True

    def parse(self, content):
        return content


class TagsParser(MetaDataParser):
    """
    Parsing "tag" metadata.
    """

    def parse(self, content):
        import re
        return re.split(",\s*", content.strip().replace("，", ","))


class AuthorsParser(MetaDataParser):
    """
    Parsing "author" metadata.
    """

    def parse(self, content):
        import re
        return re.split(",\s*", content.strip().replace("，", ","))


class TitleParser(MetaDataParser):
    """
    Parsing "title" metadata.
    """
    pass


class CategoryParser(MetaDataParser):
    """
    Parsing "category" metadata.
    Only one category can one article have.
    """
    pass


class DateParser(MetaDataParser):
    """
    Parsing "date" metadata.
    Format: YYYY.mm.DD,HH:MM:SS
    """
    def parse(self, content):
        from datetime import datetime
        try:
            date = datetime.strptime(content, "%Y.%m.%d,%H:%M:%S")
        except:
            date = datetime.strptime(content, "%Y.%m.%d,%H:%M")
        return date.strftime("%Y.%m.%d %H:%M")


class SummaryParser(MetaDataParser):
    """
    Parsing "summary" metadata.
    """
    pass


class MusicParser(MetaDataParser):
    """
    Parsing "music" metadata.
    """
    def is_necessary(self):
        return False

    def parse(self, content):
        import re
        return re.split(",\s*", content.strip().replace("，", ","))