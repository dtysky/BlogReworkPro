import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), "../"))


from pymongo import MongoClient
from feeds_generator import FeedsGenerator


if __name__ == "__main__":
    client = MongoClient()
    database = client.get_database("test")
    client.close()
    fg = FeedsGenerator(database, True)
    fg.generate()