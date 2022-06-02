import pandas as pd
import numpy as np
import matplotlib
import matplotlib.pyplot as plt
import datetime as dt
import itertools
import statsmodels.api as sm
import sys
import json
import warnings
from statsmodels.tools.sm_exceptions import ConvergenceWarning
import calendar
from datetime import timezone
import time
import mysql.connector
from mysql.connector import Error

def calQuantity(product_id, expected_sale, order_quantity):
    quantity_difference = expected_sale - order_quantity
    # max_storage_space = current in_stock amount * number of product in stock
    max_storage_space = 10000000
    # if there is no storage space to purchase item, no warning, simply decrement the amount
    try:
        connection = mysql.connector.connect(
            host="localhost",
            database="571project",
            user="root")
        sql = """   SELECT SUM(current_stock)
                    FROM products;  """
        cursor = connection.cursor()
        cursor.execute(sql,)    
        current_storage_sum = cursor.fetchone()[0]
        print(current_storage_sum)
        
        # when we don't have the storage space
        storage_diff = max_storage_space - current_storage_sum
        if(storage_diff) < int(0.0001 * max_storage_space):
            print("not enough storage space")
            # simply order the minimum amount of that product 
            sql = """   SELECT min_amount
                        FROM aisles
                        WHERE id = (SELECT aisle_id
                                    FROM products
                                    WHERE id = %s);  """
            cursor = connection.cursor()
            cursor.execute(sql,(int(product_id),))    
            minimum_amount = cursor.fetchone()[0]
            print(minimum_amount)

            sql = """   INSERT into warn (id, quantity)
                        VALUES (%s, %s);  """
            cursor = connection.cursor()
            cursor.execute(sql, (int(product_id), minimum_amount))      
            connection.commit()
            
        else:
            # if we do have enough space
            # if we will empty the stock with this week's order
            sql = """   SELECT storage_days
                        FROM departments
                        WHERE id = (SELECT department_id
                                    FROM products
                                    WHERE id = %s);  """
            cursor = connection.cursor()
            cursor.execute(sql,(int(product_id),))    
            storage_days = cursor.fetchone()[0]
            print("storage_days ", storage_days)
            order_amount = 0
            # if the department storage days is <= 7 days, then we don't want to order that much extra for the next order
            if int(storage_days) <= 7:
                # we simply want to order the ceiling (expected_sale * 1.05)
                order_amount = int(int(expected_sale) * 1.05)
            # else if the department storage days is > 7 days and <= 21 days, then we want to order slightly more
            elif int(storage_days) <= 21:
                # we want to order 1 + (7-days of the week)/7 * expected_sale
                weekday = dt.datetime.today().weekday() + 1
                order_amount = int(expected_sale * (1 + ((7-weekday)/7)))
            # otherwise, we can order more generously.
            else:
                # we want to order 2 * expected_sale 
                order_amount = int(2 * int(expected_sale))
            print("order_amount ", order_amount)
            
            sql = """   INSERT into warn (id, quantity)
                        VALUES (%s, %s);  """
            cursor = connection.cursor()
            cursor.execute(sql, (int(product_id), order_amount))      
            connection.commit()
    except Error as e:
        print("Error: ", e)
    finally:
        if(connection.is_connected()):
            connection.close()
            cursor.close()



def getNextMondayTS(d, weekday):
    days_ahead = weekday - d.weekday()
    if days_ahead <= 0: # Target day already happened this week
        days_ahead += 7
    return d + dt.timedelta(days_ahead)

def getOptimalQuantity(id, order_quantity):
    product_id = id.item()
    pd.options.mode.chained_assignment = None
    warnings.simplefilter('ignore', ConvergenceWarning)
    #warnings.filterwarnings("ignore")


    df = pd.read_csv("./time_series_data.csv")
    # print(df.head())
    df["sales"] = 1
    product_df = df.loc[df["product_id"] == product_id]
    # print(product_df)
    product_df["timestamp"] = pd.to_datetime(product_df["timestamp"].str.strip(), format="%Y-%m-%d")
    # print(product_df)
    product_df = product_df.groupby("timestamp")["sales"].sum().reset_index().set_index("timestamp")
    y = product_df["sales"].resample("W-MON").mean()
    y = y.fillna(0)
    # print(y["2020":])

    p = d = q = range(0, 2)
    pdq = list(itertools.product(p, d, q))
    seasonal_pdq = [(x[0], x[1], x[2], 12) for x in list(itertools.product(p, d, q))]

    order = (1, 1, 1)
    seasonal_order = (1, 1, 0, 12)
    aic_value = 1000

    for param in pdq:
        for param_seasonal in seasonal_pdq:
            try:
                mod = sm.tsa.statespace.SARIMAX(y,
                                                order=param,
                                                seasonal_order=param_seasonal,
                                                enforce_stationarity=False,
                                                enforce_invertibility=False)
                results = mod.fit(disp=False)
                if results.aic < aic_value: 
                    aic_value = results.aic
                    order = param
                    seasonal_order = param_seasonal
            except:
                continue
    
    try:
        mod = sm.tsa.statespace.SARIMAX(y,
                                    order=order,
                                    seasonal_order=seasonal_order,
                                    enforce_stationarity=False,
                                    enforce_invertibility=False)
        results = mod.fit(disp=False)
        # print(results.summary().tables[1])

        # print(y)
        pred_uc = results.get_forecast(steps=20)
        pred_ci = pred_uc.conf_int()
        ax = y.plot(label='observed', figsize=(14, 7))
        output = pred_uc.predicted_mean.to_json(orient="index")
        
        print(output)
        if output:
            output_dict = json.loads(output)
            today_date = dt.date.today()
            next_monday = getNextMondayTS(today_date, 0) # 0 = Monday, 1=Tuesday, 2=Wednesday...
            next_monday = dt.datetime.combine(next_monday, dt.datetime.min.time())
            # print(next_monday)
            next_monday_ts = str(int(next_monday.replace(tzinfo=timezone.utc).timestamp() * 1000))
            # print(next_monday_ts)
            # print(type(next_monday_ts))
            # print("next monday's value: ", output_dict[next_monday_ts])
            calQuantity(id, output_dict[next_monday_ts], order_quantity)
    except:
        return



if __name__ == "__main__":
    df = pd.read_csv("./new_orders.csv")
    df = df[(df['quantity'] >= 150)]
    df = df.drop(columns=["Unnamed: 0"])
    # print(df)
    # print(df.dtypes)

    for index, row in df.iterrows():
        getOptimalQuantity(row["product_id"], row["quantity"])        