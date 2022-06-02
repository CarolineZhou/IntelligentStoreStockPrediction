import matplotlib
import matplotlib.pyplot as plt
import pandas as pd
import datetime as dt
import itertools
import statsmodels.api as sm
import sys
import json
import warnings
from statsmodels.tools.sm_exceptions import ConvergenceWarning

if __name__ == "__main__":
    product_id = int(sys.argv[1].strip())
    pd.options.mode.chained_assignment = None
    warnings.simplefilter('ignore', ConvergenceWarning)

    # USED FOR DATA PREPROCESSING
    # df = pd.read_csv("./orders_for_db.csv")
    # df = df.assign(product_id=df["product_id"].str.split(" ")).explode("product_id")
    # df = df[["product_id", "timestamp"]]
    # print(df.head())
    # df["timestamp"] = df["timestamp"].str[:10]
    # df.to_csv("time_series_data.csv", index=False, sep=",")

    df = pd.read_csv("./python/time_series_data.csv")
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
    
    mod = sm.tsa.statespace.SARIMAX(y,
                                order=order,
                                seasonal_order=seasonal_order,
                                enforce_stationarity=False,
                                enforce_invertibility=False)
    results = mod.fit(disp=False)
    # print(results.summary().tables[1])

    # print(y)
    pred_uc = results.get_forecast(steps=15)
    pred_ci = pred_uc.conf_int()
    ax = y.plot(label='observed', figsize=(14, 7))
    output = pred_uc.predicted_mean.to_json(orient="index")
    print(output)
    # pred_uc.predicted_mean.plot(ax=ax, label='Forecast')
    # ax.fill_between(pred_ci.index,
    #                 pred_ci.iloc[:, 0],
    #                 pred_ci.iloc[:, 1], color='k', alpha=.25)
    # ax.set_xlabel('Date')
    # ax.set_ylabel('Sale')
    # plt.legend()
    # plt.show()

    # print(product_df)

