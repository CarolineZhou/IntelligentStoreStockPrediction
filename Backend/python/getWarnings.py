import mysql.connector
from mysql.connector import Error
import json
import sys

if __name__ == "__main__":
    dataset = []
    try:
        connection = mysql.connector.connect(
            host="localhost",
            database="571project",
            user="root")
        sql = """   SELECT products.id, name, w.quantity
                    FROM products, warn as w
                    WHERE products.id IN (SELECT id 
                                FROM warn) 
                    AND products.id = w.id;  """
        cursor = connection.cursor()
        cursor.execute(sql)    
        
        records = cursor.fetchall()
        #print(records)

        for row in records:
            # form a list for each row
            # insert this list to the dataset
            dataset.append(row) 

        print(dataset)
    
    except Error as e:
        print("Error: ", e)
    finally:
        if(connection.is_connected()):
            connection.close()
            cursor.close()