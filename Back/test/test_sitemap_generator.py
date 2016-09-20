import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), "../"))


from pymongo import MongoClient
from sitemap_generator import SitemapGenerator


if __name__ == "__main__":
    client = MongoClient()
    database = client.get_database("test")
    client.close()
    sg = SitemapGenerator(database, True)
    sg.generate()