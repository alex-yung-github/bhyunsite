import pandas as pd
import string
import yfinance
import yahoo_fin.stock_info as si
import yahoo_fin.options as oi

#portion 1
#first get company in question
#get the financial data of that company
#scrape for competitors from Hoovers
#compare financial information from the stock index of the company, the competitors of the stock, and the stock itself
company = input("Input Company Sticker: ")
yFinNode = yfinance.Ticker(company)
fastInfoDict = yFinNode.fast_info
print(fastInfoDict)
stockPrice = fastInfoDict['lastPrice']

#eps ->
earnings = si.get_earnings(company)
shares = fastInfoDict['shares']
print(earnings)

#dividend->
quarterlyDividends = yFinNode.dividends[-4:]
yearDividend = round(sum(quarterlyDividends), 2)
annualDividend = round(((yearDividend/stockPrice) * 100), 2)
print(annualDividend)



#portion 2
#somehow get new s about company from news websites and also get analysis from professionals about the company.

#portion3


#portion 5
#list of good resources for research

