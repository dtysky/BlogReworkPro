# T_T coding=utf-8 T_T

"""
Classes for writing data to database.
"""

__author__ = "Tianyu Dai (dtysky)"
__email__ = "dtysky@outlook.com"
__name__ = "DatabaseWriters"


from utils import convert_to_underline
from utils import logger
from config import config
from json import dumps as to_json


class DatabaseWriter(object):
    """
    Base class for writing data.
    """

    def __init__(self, database, cache):
        self._collection = self._get_collection(database)
        self._cache = cache.get(self.flag)

    @property
    def flag(self):
        return convert_to_underline(
            self.__class__.__name__.replace('Writer', '')
        )

    @property
    def collection_name(self):
        return self.flag

    def _get_collection(self, database):
        collection_name = self.collection_name
        if collection_name not in database.collection_names():
            self._error("No collection named '%s' in database !" % collection_name)
        return database.get_collection(collection_name)

    def _get_slug_key(self):
        return "title"

    def _format_page(self, page):
        key = self._get_slug_key()
        result = page["metadata"]
        del result["file"]
        result["slug"] = result["title"]["slug"]
        result["name"] = result[key]["slug"]
        return result

    def _modify_cache(self, mode, params):
        cache = self._cache
        if cache == None:
            return
        if not cache.has(params):
            return
        if mode == "delete":
            return cache.delete(params)
        if mode == "modify":
            if cache.has(params):
                cache.modifyState(params)

    def insert(self, new_page):
        page = self._format_page(new_page)
        self._collection.insert_one(page)
        self._modify_cache("modify", page["name"])

    def update(self, new_page, old_page):
        page = self._format_page(new_page)
        self._collection.replace_one(
            {
                "name": page["name"],
                "slug": page["slug"]
            },
            page
        )
        self._modify_cache("modify", page["name"])

    def delete(self, old_page):
        page = self._format_page(old_page)
        self._collection.delete_one(
            {
                "name": page["name"],
                "slug": page["slug"]
            }
        )
        self._modify_cache("delete", page["name"])

    def _error(self, message):
        logger.error(message)
        raise


class ArticleWriter(DatabaseWriter):
    """
    Writing "article" collection.
    """

    def _format_page(self, page):
        result = page["metadata"]
        result["content"] = page["content"]
        result["name"] = result[self._get_slug_key()]["slug"]
        result["slug"] = result["title"]["slug"]
        return result


class ArchivesWriter(DatabaseWriter):
    """
    Writing "archives" collection.
    """

    def _modify_cache(self, mode, params):
        super(ArchivesWriter, self)._modify_cache(mode, "all")

    pass


class WriterWithList(object):
    """
    Base class for writing data which type is list.
    """

    def _format_page(self, page):
        key = self._get_slug_key()
        tmp = page["metadata"]
        del tmp["file"]
        tmp["slug"] = tmp["title"]["slug"]
        result = []
        for e in tmp[key]:
            tmp["name"] = e["slug"]
            result.append(tmp.copy())
        return result

    def insert(self, new_page):
        for page in self._format_page(new_page):
            self._collection.insert_one(page)
            self._modify_cache("modify", page["name"])

    def update(self, new_page, old_page):
        new_pages, old_pages = self._format_page(new_page), self._format_page(old_page)
        old_metas = map(lambda meta: meta["slug"], old_page['metadata'][self._get_slug_key()])
        new_metas = map(lambda meta: meta["slug"], new_page['metadata'][self._get_slug_key()])
        for page in new_pages:
            if page["name"] in old_metas:
                self._collection.replace_one(
                    {
                        "name": page["name"],
                        "slug": page["slug"]
                    },
                    page
                )
            else:
                self._collection.insert_one(page)
            self._modify_cache("modify", page["name"])
        for page in old_pages:
            if page["name"] not in new_metas:
                self._collection.delete_one(
                    {
                        "name": page["name"],
                        "slug": page["slug"]
                    }
                )
                self._modify_cache("delete", page["name"])

    def delete(self, old_page):
        for page in self._format_page(old_page):
            self._collection.delete_one(
                {
                    "name": page["name"],
                    "slug": page["slug"]
                }
            )
            self._modify_cache("delete", page["name"])


class TagWriter(WriterWithList, DatabaseWriter):
    """
    Writing "tag" collection.
    """

    def _get_slug_key(self):
        return "tags"


class AuthorWriter(WriterWithList, DatabaseWriter):
    """
    Writing "author" collection.
    """

    def _get_slug_key(self):
        return "authors"


class CategoryWriter(DatabaseWriter):
    """
    Writing "category" collection.
    Only one category can one article have.
    """

    def _get_slug_key(self):
        return "category"


class WriterWithCount(object):
    """
    A special class for writing tags and authors.
    """

    def _format_page(self, page):
        key = self._get_slug_key()
        return page["metadata"][key]

    def _new(self, item):
        self._collection.insert_one(
            {
                "view": item["view"],
                "slug": item["slug"],
                "count": 0
            }
        )

    def _inc(self, item):
        if not self._collection.find_one(
                {
                    "slug": item["slug"]
                }
            ):
                self._new(item)
        self._collection.update_one(
            {
                "slug": item["slug"]
            },
            {
                "$inc": {
                    "count": 1
                }
            }
        )

    def _dec(self, item):
        self._collection.update_one(
            {
                "slug": item["slug"]
            },
            {
                "$inc": {
                    "count": -1
                }
            }
        )
        if self._collection.find_one(
            {
                "slug": item["slug"]
            }
        )["count"] <= 0:
            self._collection.delete_one(
                {
                    "slug": item["slug"]
                }
            )

    def insert(self, new_page):
        for item in self._format_page(new_page):
            self._inc(item)
        self._modify_cache("modify", item["slug"])

    def update(self, new_page, old_page):
        new_items, old_items = self._format_page(new_page), self._format_page(old_page)
        new_slugs = [item["slug"] for item in new_items]
        old_slugs = [item["slug"] for item in old_items]
        for item in new_items:
            if item["slug"] not in old_slugs:
                self._inc(item)
        for item in old_items:
            if item["slug"] not in new_slugs:
                self._dec(item)
        self._modify_cache("modify", item["slug"])

    def delete(self, old_page):
        for item in self._format_page(old_page):
            self._dec(item)
        self._modify_cache("modify", item["slug"])


class TagsWriter(WriterWithCount, DatabaseWriter):
    """
    Writing "tags" collection.
    """

    def _get_slug_key(self):
        return "tags"

    def _modify_cache(self, mode, params):
        super(TagsWriter, self)._modify_cache(mode, "all")


class AuthorsWriter(WriterWithCount, DatabaseWriter):
    """
    Writing "authors" collection.
    """

    def _get_slug_key(self):
        return "authors"

    def _modify_cache(self, mode, params):
        super(AuthorsWriter, self)._modify_cache(mode, "all")


class CategoriesWriter(WriterWithCount, DatabaseWriter):
    """
    Writing "categories" collection.
    """

    def _get_slug_key(self):
        return "category"

    def _format_page(self, page):
        key = self._get_slug_key()
        return [page["metadata"][key]]

    def _modify_cache(self, mode, params):
        super(CategoriesWriter, self)._modify_cache(mode, "all")
