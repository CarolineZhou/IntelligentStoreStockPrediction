import pandas as pd

if __name__ == "__main__":
    # Load file
    ## TODO: NEED TO CHANGE RELATIVE PATH TO ./python/orders_for_db.csv
    df = pd.read_csv("./python/orders_for_db.csv", nrows=1)
    print(df['timestamp'].iloc[0])