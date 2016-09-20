# T_T coding=utf-8 T_T

"""
Main function.
"""

__author__ = "Tianyu Dai (dtysky)"
__email__ = "dtysky@outlook.com"
__name__ = "__main__"


from pymongo import MongoClient
from watchdog.observers import Observer
from file_monitor import FileMonitor
from web_server import WebServer
from config import config
from utils import init_database

if __name__ == "__main__":
    client = MongoClient()
    database = client.get_database(config["database_name"])
    client.close()
    init_database(database)
    server = WebServer(database).web_server
    observer = Observer()
    file_monitor = FileMonitor(
        database,
        config["content_path"]
    )
    observer.schedule(
        file_monitor,
        path=config["content_path"],
        recursive=True
    )
    observer.start()
    server.run(
        config["server_ip"],
        config["server_port"]
    )