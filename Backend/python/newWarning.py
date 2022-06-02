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
        sql = """   INSERT into warn (id, date)
                    VALUES (%s, %s);  """
        cursor = connection.cursor()
        cursor.execute(sql, (sys.argv[1],sys.argv[2]))      
        connection.commit()
    
    except Error as e:
        print("Error: ", e)
    finally:
        if(connection.is_connected()):
            connection.close()
            cursor.close()