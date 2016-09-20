# T_T coding=utf-8 T_T

"""
Generating feeds(RSS).
For:
    All articles(all.rss)
    Categories(<category>.rss)
    Authors(<author>.rss)
"""

__author__ = "Tianyu Dai (dtysky)"
__email__ = "dtysky@outlook.com"
__name__ = "FeedsGenerator"


import json
import os
from datetime import datetime
from utils import logger
from config import config
from utils import format_date


template = {
    "begin": """<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>{0}</title>
<link>{1}</link><description>{2}</description><atom:link href="{3}" rel="self"></atom:link>
<lastBuildDate>{4}</lastBuildDate>

""",
    "content": """<item>
<title>{0}</title>
<link>{1}</link>
<description>{2}</description>
{3}<pubDate>{4}</pubDate>
<guid>tag:{5},{6}:{7}</guid>
{8}</item>

""",
    "end": """</channel>
</rss>""",
    "creator": """<dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">{0}</dc:creator>
""",
    "tag": """<category>{0}</category>
"""
}


entity_ref = {
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;"
}


class FeedsGenerator(object):
    """
    Generating feeds.
    Depend on collection "article".
    """

    def __init__(self, database, debug=False):
        self._collection = database.get_collection("article")
        self._debug = debug
        self._files = {}

    def _add_one(self, article):
        result = template["content"].format(
            article["title"]["view"],
            "%s/article/%s" % (
                config["site_url"],
                article["title"]["slug"]
            ),
            self._format_content(article["content"]),
            "".join(
                [
                    template["creator"].format(
                        author["view"]
                    )
                    for author in article["authors"]
                ]
            ),
            format_date(
                datetime.strptime(article["date"], "%Y.%m.%d %H:%M"),
                "feeds"
            ),
            config["site_url"],
            article["date"],
            "article/%s" % article["title"]["slug"],
            "".join(
                [
                    template["tag"].format(
                        tag["view"]
                    )
                    for tag in article["tags"]
                ]
            )
        )
        if self._debug:
            print result
        return result

    def _format_article(self, article):
        return (
            article,
            article["authors"] + [
                article["category"],
                {
                    "view": "all",
                    "slug": "all"
                }
            ]
        )

    def _update_files(self, file_names, time):
        if not os.path.exists(config["feeds_dir_path"]):
            os.mkdir(config["feeds_dir_path"])
        for name_pair in file_names:
            name, view = name_pair["slug"].encode("utf-8"), name_pair["view"].encode("utf-8")
            if name not in self._files:
                file_name = "%s/%s.rss.xml" % (
                    config["feeds_dir_path"],
                    name
                    )
                self._files[name] = open(file_name, "w")
                self._files[name].write(
                    template["begin"].format(
                        config["site_title"],
                        config["site_url"],
                        config["site_description"],
                        "%s/%s/%s" % (
                            config["site_url"],
                            config["feeds_slug"],
                            file_name
                        ),
                        time
                    )
                )
                logger.info("Feeds: Writing %s..." % view)

    def _format_content(self, content):
        result = content
        for k, v in entity_ref.items():
            result = result.replace(k, v)
        return result

    def generate(self):
        logger.info("Feeds: Writing start...")
        self._files = {}
        time = format_date(datetime.now(), "feeds")
        articles = list(self._collection.find({}))
        articles.sort(
            key=lambda article: article["date"],reverse=True
        )
        for article in articles:
            content, file_names = self._format_article(article)
            self._update_files(file_names, time)
            for name in file_names:
                self._files[name["slug"].encode("utf-8")].write(
                    self._add_one(content)
                )
        indexes = {}
        for file_name, file_obj in self._files.items():
            file_obj.write(
                template["end"]
            )
            file_obj.close()
            indexes[file_name] = "%s.rss.xml" % file_name
            logger.info("Feeds: Done %s..." % file_name)
        with open(
            "%s/%s" % (
                        config["feeds_dir_path"],
                    "indexes.json"
                ),
            "w"
        ) as f:
            json.dump(indexes ,f)
        logger.info("Feeds: Writing done...")

    def _error(self, message):
        logger.error(message)
        raise