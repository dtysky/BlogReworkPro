# T_T coding=utf-8 T_T

import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), "../"))


from pymongo import MongoClient
from copy import deepcopy as copy
from urllib import quote as url_encode
from parser import Parser
from wrapper import Wrapper
from writer import Writer
from utils import print_database, clear_database


if __name__ == "__main__":
    client = MongoClient()
    database = client.get_database("test")
    client.close()
    def write_with_get(file_path, mode, page):
        try:
            writer.write(file_path, mode, page)
        except:
            clear_database(database)
            raise
        print_database(database)
        print "\n"

    parser = Parser()
    wrapper = Wrapper()
    test_page = parser.parse("Skill/test.md")
    test_page["metadata"] = wrapper.wrap(test_page["metadata"])
    writer = Writer(database)
    page = copy(test_page)
    print "Insert: "
    write_with_get("Skill/test.md", "update", page)
    print "Update Tags: "
    page["metadata"]["tags"] = [{'slug': 'FPGA', 'view': 'FPGA'}, {'slug': 'tag_test', 'view': 'tag_test'}]
    write_with_get("Skill/test.md", "update", page)
    print "Update Authors: "
    page["metadata"]["authors"] = [{"slug": "命月天宇", "view": url_encode("命月天宇")}]
    write_with_get("Skill/test.md", "update", page)
    print "Update Title: "
    page["metadata"]["title"] = {"slug": "Skill-test", "view": "title_test"}
    write_with_get("Skill/test.md", "update", page)
    print "Update Data adn Summary: "
    page["metadata"]["date"] = "2015.05.30 12:00"
    page["metadata"]["summary"] = "summary_test"
    write_with_get("Skill/test.md", "update", page)
    print "Delete: "
    write_with_get("Skill/test.md", "delete", page)
    print "Insert 1: "
    write_with_get("Skill/test.md", "update", test_page)
    print "Insert 2: "
    page = parser.parse("Art/test.md")
    page["metadata"] = wrapper.wrap(page["metadata"])
    write_with_get("Art/test.md", "update", page)
    clear_database()