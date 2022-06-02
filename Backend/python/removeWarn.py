import mysql.connector
from mysql.connector import Error
import json
import sys

if __name__ == "__main__":
    id = sys.argv[1]
    try:
        connection = mysql.connector.connect(
            host="localhost",
            database="571project",
            user="root")
        sql = """   DELETE FROM warn
                    WHERE id = %s ; """
        cursor = connection.cursor()
        cursor.execute(sql, (id,))    
        connection.commit()

        print(cursor.rowcount, "record(s) deleted")
    
    except Error as e:
        print("Error: ", e)
    finally:
        if(connection.is_connected()):
            connection.close()
            cursor.close()