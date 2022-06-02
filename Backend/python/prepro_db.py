import pandas as pd
import numpy as np
from datetime import datetime, timedelta

if __name__ == "__main__":
    ### PREPARE ROWS FOR TIMESTAMP ###
    # order_df = pd.read_csv(".\order_products__prior.csv", encoding="utf-8", usecols=["order_id", "product_id"], sep='\s*,\s*', engine='python')
    # order_df["product_id"] = order_df["product_id"].astype(str)
    # order_df.groupby("order_id").product_id.apply(" ".join).reset_index().to_csv("orders_for_db.csv")

    ### Please ignore the next 3 lines, testing purpose only
    # print(order_df.tail(20))
    # order_df.groupby("order_id").agg(lambda x: x.tolist()).to_csv("orders_for_db.csv")

    # ### ADD TIMESTAMP ###
    # order_df = pd.read_csv(".\orders_for_db.csv", encoding="utf-8", usecols=["order_id", "product_id"])
    # start_ts = 1546326000
    # order_df["timestamp"] = datetime.fromtimestamp(start_ts)
    # #print(increment)
    # ts = 1546326000
    # for i, row in order_df.iterrows():
    #     ts = ts + 17
    #     order_df.at[i, "timestamp"] = datetime.fromtimestamp(ts)
    # print(order_df.head(20))
    # print(order_df.tail(20))
    # order_df.to_csv("orders_for_db.csv")

    # ### ADD USER ID BY JOIN ###
    # order_df = pd.read_csv(".\orders_for_db.csv", encoding="utf-8")
    # user_df = pd.read_csv(".\orders.csv", encoding="utf-8", usecols=["order_id", "user_id"])
    # result_df = pd.merge(left=order_df, right=user_df, left_on="order_id", right_on="order_id")
    # result_df.to_csv("orders_for_db.csv")
    # print(result_df.head(40))

    # ### FILTER ### 
    # order_df = pd.read_csv(".\orders_for_db.csv", encoding="utf-8", usecols=["order_id", "product_id", "timestamp", "user_id"])
    # order_df.to_csv("orders_for_db.csv", index=False, sep=",")

    ### EXPLODE DATA COLUMN PRODUCT ID ###
    ### IGNORE FOR NOW ###
    # lst_col="product_id"
    # df = pd.read_csv(".\orders_for_db.csv", encoding="utf-8", usecols=["order_id", "product_id", "timestamp", "user_id"])
    # print(type(df["product_id"]))
    # df = df["product_id"].explode()
    # print(df.head(20))

    # order_df = pd.read_csv(".\\aisles.csv", encoding="utf-8")
    # print(type(order_df.aisle))

    order_df = pd.read_csv(".\orders_for_db.csv")
    print(len(order_df.index))

    