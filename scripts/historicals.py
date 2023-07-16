from pandas_datareader import data as pdr
from datetime import date
import yfinance as yf
import pandas as pd
yf.pdr_override()

ticker_list=['DJIA', 'DOW', 'TSLA']

today = date.today()
# We can get data by our choice by giving days bracket
start_date= "2017-01-01"
end_date="2019-11-30"

files=[]
def getData(ticker):
    print(ticker)
    data = pdr.get_data_yahoo(ticker, start=start_date, end=today)
    dataname = ticker + "_"+str(today)
    files.append(dataname)
    saveData(data, dataname)

def saveData(df, filename):
    df.to_csv('./data/' + filename + '.csv')

for tik in ticker_list:
    getData(tik)

# for i in range(0, 11):
#     df1 = pd.read_csv('./data/' + str(files[i]) + '.csv')
#     print(df1.head())

