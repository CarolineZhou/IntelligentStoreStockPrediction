import mysql.connector
from mysql.connector import Error
import pandas as pd
import numpy as np
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import fpgrowth, association_rules
import json
import sys
import time

if __name__ == "__main__":
    # start = time.time()
    start_ts = sys.argv[1].strip()
    end_ts = sys.argv[2].strip()
    # start_ts = "2019-01-01 00:00:00"
    # end_ts = "2019-01-02 00:00:00"
    dataset = []
    # print("start_ts", sys.argv[1])
    # print("end_ts", sys.argv[2])

    df = pd.read_csv("./python/orders_for_db.csv", usecols=["product_id", "timestamp", "user_id"])
    df.timestamp = pd.to_datetime(df.timestamp)
    df = df.set_index(["timestamp"])
    df = df.loc[start_ts:end_ts]
    df.reset_index(drop=True, inplace=True)

    # df = pd.DataFrame(sql_query, columns=["user_id", "product_ids"])
    df["product_id"] = df["product_id"].str.strip().str.split(" ")
    # df["product_ids"] = [[int(idx) for idx in x.split(" ")] for x in df["product_ids"]]

    df = df.astype({'user_id': 'str'})
    df = df.explode("product_id")

    # print(df)

    df = df.groupby("product_id")["user_id"].agg(lambda x: x.tolist())
    dataset = df.values.tolist()

    te = TransactionEncoder()
    te_ary = te.fit(dataset).transform(dataset)
    df = pd.DataFrame(te_ary, columns=te.columns_) 
    # fpgrowth is much faster       
    df = fpgrowth(df, min_support=0.0005, max_len=5)
    df = df.drop(columns=["support"])
    df1 = [list(x) for x in df["itemsets"]]
    more_than_one = [x for x in df1 if len(x) > 1]
    top_100 = more_than_one[:100]
    update_top_100 = []
    for i in range(len(top_100)):
        converted_to_int = []
        for j in range(len(top_100[i])):
            converted_value = np.int32(top_100[i][j]).item()
            converted_to_int.append(converted_value)
        update_top_100.append(converted_to_int)
    json_top_100 = json.dumps(update_top_100)
    print(json_top_100)


    # end = time.time()
    # print(end-start)
