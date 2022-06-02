import mysql.connector
from mysql.connector import Error
import json
import sys

if __name__ == "__main__":
    try:
        connection = mysql.connector.connect(
            host="localhost",
            database="571project",
            user="root")
        sql = """   UPDATE products 
                    SET current_stock = 20 
                    WHERE true;  """
        cursor = connection.cursor()
        cursor.execute(sql)      
        connection.commit()
    
    except Error as e:
        print("Error: ", e)
    finally:
        if(connection.is_connected()):
            connection.close()
            cursor.close()
