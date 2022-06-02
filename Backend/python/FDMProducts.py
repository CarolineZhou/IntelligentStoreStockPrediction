import mysql.connector
from mysql.connector import Error
import pandas as pd
import numpy as np
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import fpgrowth, association_rules
import time
import sys
import json


def getProductName(product_list):
    product_name_dict = {}
    try:
        connection = mysql.connector.connect(
            host="localhost",
            database="571project",
            user="root")
        sql = "select id, name from products where id in ({})".format(",".join([str(i) for i in product_list]))
        cursor = connection.cursor()
        cursor.execute(sql)
        product_names = cursor.fetchall()
        # print("Total number: ", cursor.rowcount)

        for row in product_names:
            # form a list for each row
            # insert this list to the dataset
            product_name_dict[row[0]] = row[1]
        return product_name_dict
    except Error as e:
        print("Error: ", e)
    finally:
        if(connection.is_connected()):
            connection.close()
            cursor.close()
            # print("MySQL connection is closed")


def get_named_list(outer_list, product_name_dict):
    final_list = []
    for inner_list in outer_list:
        named_inner_list = []
        for item in inner_list:
            named_inner_list.append(product_name_dict[item])
        final_list.append(named_inner_list)
    
    return final_list



if __name__ == "__main__":
    # start = time.time()
    start_ts = sys.argv[1].strip()
    end_ts = sys.argv[2].strip()
    # start_ts = "2019-01-01 00:07:17"
    # end_ts = "2019-01-01 11:00:30"
    dataset = []

    df = pd.read_csv("./python/orders_for_db.csv", usecols=["product_id", "timestamp", "user_id"])
    df.timestamp = pd.to_datetime(df.timestamp)
    df = df.set_index(["timestamp"])
    df = df.loc[start_ts:end_ts]
    df.reset_index(drop=True, inplace=True)

    df["product_id"] = df["product_id"].str.strip().str.split(" ")

    df = df.astype({'user_id': 'str'})
    df = df.explode("product_id")
    
    df = df.groupby("user_id")["product_id"].agg(lambda x: x.tolist())
    dataset = df.values.tolist()

    te = TransactionEncoder()
    te_ary = te.fit(dataset).transform(dataset)
    df = pd.DataFrame(te_ary, columns=te.columns_)
    # fpgrowth is much faster       
    df = fpgrowth(df, min_support=0.01)  
    df = association_rules(df, metric="confidence", min_threshold=0.2) 
    df = df[["antecedents", "consequents"]]
    df = df.head(100)

    # print(df)
    df["antecedents"] = df["antecedents"].apply(set)
    df["consequents"] = df["consequents"].apply(set)

    # print(df)
    # print(df.dtypes)

    product_list = []
    outer_list = []

    for index, row in df.iterrows():
        sublist = []
        for item in row["antecedents"]:
            sublist.append(item.item())
        for item in row["consequents"]:
            sublist.append(item.item())

        outer_list.append(sublist)
        product_list.extend(sublist)

    product_name_dict = getProductName(product_list)

    # print(outer_list)
    final_list = get_named_list(outer_list, product_name_dict)
    json_final_list = json.dumps(final_list)
    print(json_final_list)

    # end = time.time()
    # print(end-start)

