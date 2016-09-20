"""
Parsing markdown files.
"""

__author__ = "Tianyu Dai (dtysky)"
__email__ = "dtysky@outlook.com"
__name__ = "MarkdownParser"


from markdown import Markdown


class MarkdownParser(object):
    """Parser for Markdown files"""


    def __init__(self):
        self._extensions = [
            'codehilite(css_class=highlight)',
            'markdown.extensions.nl2br',
            'markdown.extensions.tables'
        ]
        self._parser = Markdown(
            extensions=self._extensions
        )

    def parse(self, content):
        """Parse content and metadata of markdown files"""

        self._content = content
        return self._parser.convert(self._content)
