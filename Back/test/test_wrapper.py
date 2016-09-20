import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), "../"))

from parser import Parser
from wrapper import Wrapper

if __name__ == "__main__":
    parser = Parser()
    wrapper = Wrapper()
    for k, v in wrapper.wrap(parser.parse("Skill/test.md")["metadata"]).items():
        print k, ":", v