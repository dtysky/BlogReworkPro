# T_T coding=utf-8 T_T

"""
Generating sitemap.
"""

__author__ = "Tianyu Dai (dtysky)"
__email__ = "dtysky@outlook.com"
__name__ = "SitemapGenerator"


from datetime import datetime
from utils import logger
from config import config
from utils import format_date


template = {
    "begin": """<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

""",
    "content": """<url>
<loc>{0}/{1}</loc>
<lastmod>{2}</lastmod>
<changefreq>{3}</changefreq>
<priority>{4}</priority>
</url>

""",
    "end": "</urlset>"
}



class SitemapGenerator(object):
    """
    Generating sitemap.
    Depend on collection "archives", "tags", "authors", "categories".
    """

    def __init__(self, database, debug=False):
        self._collections = {}
        for pair in [
            ("archives", "article"),
            ("tags", "tag"),
            ("authors", "author"),
            ("categories", "category")
        ]:
            name, url = pair
            if name not in database.collection_names():
                self._error("Sitemap: collection 'archives' is necessary !")
            self._collections[url] = database.get_collection(name)
        self._static = [
            "tags",
            "authors",
            "categories",
            ""
        ]
        self._debug = debug

    def _add_one(self, url, time):
        result = template["content"].format(
            config["site_url"],
            url,
            format_date(time, "sitemap"),
            config["sitemap_freq"],
            config["sitemap_priority"]
        )
        if self._debug:
            print result
        return result

    def _add_collection(self, url, collection):
        logger.info("Sitemap: Writing %s..." % url)
        result = ""
        for item in list(collection.find({})):
            result += self._add_one(
                    "%s/%s" % (url, item["slug"]),
                    datetime.now()
                )
            for index in xrange(item["count"] / config["articles_per_page"] + 1):
                result += self._add_one(
                    "%s/%s/%d" % (url, item["slug"], index),
                    datetime.now()
                )
        return result

    def _add_archives(self, collection):
        logger.info("Sitemap: Writing %s..." % "article")
        result = ""
        archives = list(collection.find({}))
        page_count = len(archives) / 10 + 1
        result += self._add_one(
                "archives",
                datetime.now()
            )
        for index in xrange(page_count):
            result += self._add_one(
                "%s/%d" % ("archives", index),
                datetime.now()
            )
        for article in archives:
            result += self._add_one(
                "%s/%s" % ("article", article["slug"]),
                datetime.strptime(article["date"], "%Y.%m.%d %H:%M")
            )
        return result

    def _add_static(self):
        return "".join([
            self._add_one(
                url,
                datetime.now()
            )
            for url in self._static
        ])

    def generate(self):
        logger.info("Sitemap: Writing start...")
        with open(config["sitemap_path"], "w") as f:
            f.write(template["begin"])
            f.write(self._add_static())
            for url in ["tag", "author", "category"]:
                f.write(
                    self._add_collection(url, self._collections[url])
                )
            f.write(
                self._add_archives(self._collections["article"])
            )
            f.write(template["end"])
            f.close()
        logger.info("Sitemap: Writing done...")

    def _error(self, message):
        logger.error(message)
        raise