import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), "../"))


import time
from pymongo import MongoClient
from watchdog.observers import Observer
from file_monitor import FileMonitor
from utils import clear_database


if __name__ == "__main__":
    client = MongoClient()
    database = client.get_database("test")
    client.close()
    observer = Observer()
    file_monitor = FileMonitor(database, "./pages", True)
    observer.schedule(file_monitor, path="./pages", recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except:
        observer.stop()
        clear_database(database)