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
from flask import Response


class WebHandler(View):
    """
    Parent class for handling http requests.
    """

    def __init__(self, database):
        self._collection = self._get_collection(database)

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

    def _get_collection(self, database):
        collection_name = self.collection_name
        if collection_name not in database.collection_names():
            self._error("No collection named '%s' in database !" % collection_name)
        return database.get_collection(collection_name)

    def _find_data(self, parameters):
        return list(self._collection.find(
            {},
            {"_id": 0}
        ))

    def _parse_parameters(self, parameters):
        return parameters

    def _format_data(self, data, url, parameters):
        return to_json(
            {
                "view": url,
                "content": data
            }
        )

    def _handle(self, parameters=None):
        logger.info("Web, Request: %s\nParameters: %s" % (
            self.url, parameters
        ))
        params = self._parse_parameters(parameters)
        data = self._find_data(
            self._parse_parameters(params)
        )
        if not data:
            return self._404(parameters)
        logger.info("Web, Data found: %s\nParameters: %s" % (
            self.url, parameters
        ))
        return self._response(
            self._format_data(data, self.url, params),
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

    def _404(self, parameters):
        logger.warning("Web, 404: %s\nParameters: %s" % (
            self.url, parameters
        ))
        return self._response("Error", 404)

    def _error(self, message):
        line = "Web: %s" % message
        logger.error(line)
        raise


class ArchivesHandler(WebHandler):
    """
    Handling "archives" request.
    """

    pass


class TagsHandler(WebHandler):
    """
    Handling "tags" request.
    """

    pass


class AuthorsHandler(WebHandler):
    """
    Handling "authors" request.
    """

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

    def _format_data(self, data, url, parameters):
        return to_json(
            {
                "view":
                    data[0][self.view_flag]["view"] if
                    type(data[0][self.view_flag]) != list else
                    filter(lambda item: item['slug'] == parameters, data[0][self.view_flag])[0]["view"],
                "content": data
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

    def _format_data(self, data, url, parameters):
        return to_json(
            {
                "view": data["title"]["view"],
                "content": data
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

    def _format_data(self, data, url, parameters):
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
            "%s/%s" % (
                        config["feeds_dir_path"],
                        indexes[parameters]
                )
        ) as f:
            result = f.read()
        return result

    def _parse_parameters(self, parameters):
        return parameters

    def _format_data(self, data, url, parameters):
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