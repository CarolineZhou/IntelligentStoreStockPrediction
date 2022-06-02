import pandas as pd
import time
import re

if __name__ == "__main__":
    # Load file
    with open("./python/orders_for_db.csv", "r") as f:
        for line in f: pass
        regex = re.compile("^[\d]+,[\d|\s]+,(.+),[\d]+$")
        result = regex.search(line)
        print(result.group(1))
