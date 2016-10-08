# T_T coding=utf-8 T_T

"""
Classes for handling http requests.
"""

__author__ = "Tianyu Dai (dtysky)"
__email__ = "dtysky@outlook.com"
__name__ = "WebHandler"


from flask.views import View
from json import dumps as to_json
from utils import convert_to_underline
from utils import logger
from config import config
from flask import Response, request


class WebHandler(View):
    """
    Base class for handling http requests.
    """

    def __init__(self, database, cache):
        self._collection = self._get_collection(database)
        self._cache = cache.get(self.flag)

    @property
    def flag(self):
        return convert_to_underline(
            self.__class__.__name__.replace('Handler', '')
        )

    @property
    def url(self):
        return self.flag

    @property
    def collection_name(self):
        return self.flag

    @property
    def allowed_params(self):
        return None

    def _get_collection(self, database):
        collection_name = self.collection_name
        if collection_name not in database.collection_names():
            self._error("No collection named '%s' in database !" % collection_name)
        return database.get_collection(collection_name)

    def _find_data(self, parameters):
        if self.allowed_params != None and parameters not in self.allowed_params:
            return None
        return list(self._collection.find(
            {},
            {"_id": 0}
        ))

    def _parse_parameters(self, parameters):
        return parameters

    def _format_data(self, code, data, url, parameters):
        return to_json(
            {
                "view": url,
                "content": data,
                "code": code
            }
        )

    def _handle(self, parameters=None):
        hasOrigin = "origin" in request.headers
        logger.info("Request: %s\nFrom: %s\nUrl: %s" % (
            self.url,
            request.headers["Referer"] if hasOrigin else request.remote_addr,
            request.url
        ))
        if hasOrigin and (request.headers["origin"] not in config["allow-origin"]):
            return self._403(parameters)
        if not (request.remote_addr in config["allow-ip"]):
            return self._403(parameters)
        params = self._parse_parameters(parameters)

        cache = self._cache

        if cache != None and cache.has(params) and not cache.is_modified(params):
            return self._304(params, cache.get(params))

        data = self._find_data(params)
        if not data:
            return self._404(parameters)

        logger.info("Data found: %s\nParameters: %s" % (
            self.url, parameters
        ))

        if cache != None:
            cache.updateContent(params, data)

        return self._response(
            self._format_data(200, data, self.url, params),
            200
        )

    def _response(self, data, status):
        response = Response(
            data,
            status=status,
            mimetype='application/json'
        )
        response.headers.add(
            'Access-Control-Allow-Origin', '*'
        )
        return response

    def dispatch_request(self, parameters=None):
        return self._handle(parameters)

    # Custom code 304
    def _304(self, parameters, data):
        logger.info("304: %s\nParameters: %s" % (
            self.url, parameters
        ))
        return self._response(
            self._format_data(304, data, self.url, parameters),
            200
        )

    def _403(self, parameters):
        logger.warning("403: %s\nParameters: %s" % (
            self.url, parameters
        ))
        return self._response(to_json({"message": "Not allowed!"}), 403)

    def _404(self, parameters):
        logger.warning("404: %s\nParameters: %s" % (
            self.url, parameters
        ))
        return self._response(to_json({"message": "Not found!"}), 404)

    def _error(self, message):
        line = "Web: %s" % message
        logger.error(line)
        raise


class ArchivesHandler(WebHandler):
    """
    Handling "archives" request.
    """

    @property
    def allowed_params(self):
        return "all"

    pass


class TagsHandler(WebHandler):
    """
    Handling "tags" request.
    """

    @property
    def allowed_params(self):
        return "all"

    pass


class AuthorsHandler(WebHandler):
    """
    Handling "authors" request.
    """

    @property
    def allowed_params(self):
        return "all"

    pass


class HandlerWithOneParameter(object):
    """
    A special class for handling request which has one parameter.
    """

    def _get_parameter_name(self):
        return "name"

    @property
    def view_flag(self):
        return self.flag

    def _find_data(self, parameter=None):
        return list(self._collection.find(
            {
                self._get_parameter_name(): parameter
            },
            {"_id": 0}
        ))

    def _format_data(self, code, data, url, parameters):
        return to_json(
            {
                "view":
                    data[0][self.view_flag]["view"] if
                    type(data[0][self.view_flag]) != list else
                    filter(lambda item: item['slug'] == parameters, data[0][self.view_flag])[0]["view"],
                "content": data,
                "code": code
            }
        )


class TagHandler(HandlerWithOneParameter, WebHandler):
    """
    Handling "tag" request.
    """

    @property
    def view_flag(self):
        return "tags"


class AuthorHandler(HandlerWithOneParameter, WebHandler):
    """
    Handling "author" request.
    """

    @property
    def view_flag(self):
        return "authors"


class CategoryHandler(HandlerWithOneParameter, WebHandler):
    """
    Handling "category" request.
    Only one category can one article have.
    """

    @property
    def view_flag(self):
        return "category"


class ArticleHandler(WebHandler):
    """
    Handling "article" request.
    """

    def _get_parameter_name(self):
        return "name"

    def _find_data(self, parameter=None):
        data = self._collection.find_one(
            {
                self._get_parameter_name(): parameter
            },
            {
                "_id": 0,
                "file": 0
            }
        )
        return data

    def _format_data(self, code, data, url, parameters):
        return to_json(
            {
                "view": data["title"]["view"],
                "content": data,
                "code": code
            }
        )



class SitemapHandler(WebHandler):
    """
    Handling "sitemap" request.
    """

    def _get_collection(self, database):
        return None

    def _find_data(self, parameters):
        with open(config["sitemap_path"]) as f:
            result = f.read()
        return result

    def _parse_parameters(self, parameters):
        return parameters

    def _format_data(self, code, data, url, parameters):
        return data

    def _response(self, data, status):
        response = Response(
            data,
            status=status,
            mimetype='text/xml'
        )
        response.headers.add(
            'Access-Control-Allow-Origin', '*'
        )
        return response


class FeedsHandler(WebHandler):
    """
    Handling "feeds" request.
    """

    def _get_collection(self, database):
        return None

    def _find_data(self, parameters):
        import json
        with open(
                "%s/indexes.json" % config["feeds_dir_path"]
        ) as f:
            indexes = json.load(f)
        if parameters not in indexes:
            return None
        with open(
            config["feeds_dir_path"].encode("utf-8") + "/" + indexes[parameters].encode("utf-8")
        ) as f:
            result = f.read()
        return result

    def _parse_parameters(self, parameters):
        return parameters

    def _format_data(self, code, data, url, parameters):
        return data

    def _response(self, data, status):
        response = Response(
            data,
            status=status,
            mimetype='text/xml'
        )
        response.headers.add(
            'Access-Control-Allow-Origin', '*'
        )
        return response
