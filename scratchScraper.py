import requests
from bs4 import BeautifulSoup
import sys

headers = headers = { 
    'User-Agent'      : 'Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36', 
    'Accept'          : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 
    'Accept-Language' : 'en-US,en;q=0.5',
    'DNT'             : '1', # Do Not Track Request Header 
    'Connection'      : 'close'
}
SNPURL = "https://ycharts.com/indicators/sp_500_dividend_yield"
genericURL = 'https://finance.yahoo.com/quote/'

def getSoupParsers(company):
    companyURL = genericURL + company
    mainURL = companyURL + "?p=" + company + "&.tsrc=fin-srch"
    page = requests.get(mainURL, headers=headers, timeout=5)
    companyWorks = page.status_code
    # print("Connected Status Main: ", companyWorks, " | URL: ", mainURL) #for debugging
    if(companyWorks != 200):
        return None
    soup = BeautifulSoup(page.text, 'html.parser')
    companyFinancialsURL = companyURL + "/key-statistics?p=" + company + "&.tsrc=fin-srch"
    statisticsPage = requests.get(companyFinancialsURL, headers=headers, timeout=5)
    # print("Connected Status Statistics: ", statisticsPage.status_code, " | URL: ", companyFinancialsURL) # for debugging
    statisticsSoup = BeautifulSoup(statisticsPage.text, 'html.parser')
    return [soup, statisticsSoup]



#general price info:
def getPrice(soup, company): #returns price + general if needed
    price = soup.find('fin-streamer', {"class" : "Fw(b) Fz(36px) Mb(-4px) D(ib)","data-field":"regularMarketPrice"}).text
    # print(company + "'s price: ", price)
    return price

#portion 1
#first get company in question
#get the financial data of that company
#scrape for competitors from Hoovers
#compare financial information from the stock index of the company, the competitors of the stock, and the stock itself

def getEPS(soup, company): #returns earnings per share
    #eps ->
    eps = soup.find('td', {'data-test': "EPS_RATIO-value"}).text
    # print(company + "'s earnings per share: ", eps)
    # print("Typically you want a higher EPS than competitors because that means company has high profits relative to stock price.")
    return eps

def getDividend(statisticsSoup): #returns dividend
    #dividend->
    allStatsItems = statisticsSoup.find_all('td', {'class': "Fw(500) Ta(end) Pstart(10px) Miw(60px)"})
    annualDividendRate = allStatsItems[-30].text
    annualDividendYield = allStatsItems[-29].text
    # print("Annual Dividend Rate (Trailing) [Money you will get per share of company owned]: ", annualDividendRate)
    # print("Annual Dividend Yield (Trailing) [Percentage of Company Given back to Investors in Dividends]: ", annualDividendYield)
    # print("Yield Percentage is volatile based on company share price change, but gives good indication of percentage of your money you are earning back each dividend.")
    return [annualDividendRate, annualDividendYield]

def getPERatio(soup, company): #returns pe ratio
    #pe ratio ->
    peRatio = soup.find("td", {'data-test': "PE_RATIO-value"}).text
    # print(company + "'s P/E Ratio: ", peRatio)
    # print("If PE is high, that can mean that the company is expected to grow very fast by investors, the company is overvalued, or both")
    return peRatio

def getPriceRatios(statisticsSoup): #returns price ratios (pricetosales, pricetobook, and pricetoearningsgrowth)
    #price ratios ->
    # priceToSalesRatio = statisticsSoup.find_all("td", {'class': "Ta(c) Pstart(10px) Miw(60px) Miw(80px)--pnclg Bgc($lv1BgColor) fi-row:h_Bgc($hoverBgColor)"})
    priceToSalesRatio = statisticsSoup.find(string='Price/Sales').findParent().findParent().findNextSibling().text
    # print("priceToSalesRatio: ", priceToSalesRatio)
    # print("Amount paid for each dollar company brings in as revenue. Low value could mean undervalued because less money is paid per revenue. However, it doesn't account for debt in a company with high debt. Typically For early stage companies like biotech firms that lose money without PE ratio")
    priceToBookRatio = statisticsSoup.find(string='Price/Book').findParent().findParent().findNextSibling().text
    # print("priceToBookRatio: ", priceToBookRatio)
    # print("Price per sales but includes debt. Low ratio of 1 or lower might mean it is undervalued. [Book value = what it owns - what it owes]")
    #   , string="Trailing Annual Dividend Rate")
    # .find_next_sibling("td").text
    priceToEarningsGrowthRatio = statisticsSoup.find(string="PEG Ratio (5 yr expected)").findParent().findParent().findNextSibling().text
    # print("Price to Earnings Growth Ratio: ", priceToEarningsGrowthRatio)
    # print("How much you are paying for company's expected growth. As forecasted by Yahoo Finance Analysts. Value of 2 or higher can indicate overvalued or that the stock is expected to grow rapidly.")
    return [priceToSalesRatio, priceToBookRatio, priceToEarningsGrowthRatio]

def analyzeCompany(company): #returns all stats [price, earnings per share, dividend, pe ratio, and price ratios]
    #generic soup = main company page on yahoo finance, statistics soup = statistics page
    soups = getSoupParsers(company)
    if(soups == None):
        return "Cannot Get Stats"
    else:
        genericSoup, statisticsSoup = soups
    price = getPrice(genericSoup, company)
    eps = getEPS(genericSoup, company)
    dividend = getDividend(statisticsSoup)
    peRatio = getPERatio(genericSoup, company)
    priceRatios = getPriceRatios(statisticsSoup)
    return [price, eps, dividend, peRatio, priceRatios]
 
#Portion 1.5 Stats of Index Sector
def indexStats(): #returns dividend yield, earnings per share, pe ratoi, and book val per share for the index (s&p 500)
    SNP500Page = requests.get(SNPURL, headers = headers, timeout=5)
    SNP500Soup = BeautifulSoup(SNP500Page.text, 'html.parser')
    # print("Connected Status S&P 500 Page: ", SNP500Page.status_code) # for debugging
    if(SNP500Page.status_code == 503 or SNP500Page.status_code == 404):
        return "SNP Page is Down"
    # print("S&P 500 Average Dividend Yield: ", SNPDividendYield)
    # SNPearningsPerShare = SNP500Soup.find("a", {'href': "/indicators/sp_500_eps"}).findParent().findNextSibling().findNextSibling().text
    # print("S&P 500 Earnings Per Share: ", SNPearningsPerShare)
    SNPPERatio = SNP500Soup.find_all("a", {'href': "/indicators/sp_500_pe_ratio"})[-1].findParent().findNextSibling().text.strip()
    # print("S&P 500 P/E Ratio: ", SNPPERatio)
    SNPBookValPerShare = SNP500Soup.find_all("a", {'href': "/indicators/sp_500_price_to_book_ratio"})[-1].findParent().findNextSibling().text.strip()
    # print("S&P 500 Book per Share: ", SNPBookValPerShare)
    return [SNPPERatio, SNPBookValPerShare]

#portion 2 get competitors
def getCompetitors(company):
    companyURL = genericURL + company 
    companyInsightsPage = companyURL + "/company-insights?p=" + company
    insightsPage = requests.get(companyInsightsPage, headers=headers, timeout=5)
    # print("Connected Status : ", insightsPage.status_code) # for debugging
    insightsSoup = BeautifulSoup(insightsPage.text, 'html.parser')
    relatedCompaniesTable = insightsSoup.find(string="Companies related to " + company).findParent().findParent().findParent().findNextSibling()
    companies = relatedCompaniesTable.findChild()
    count = 0
    competitors = []
    for i in companies.children:
        if(count >=4 ):
            break
        i = i.findChild().findChild().text
        competitors.append(i)
        # print(i)
        count+=1
    return competitors

def compareCompetitorStatistics(competitors):
    print("[price, earnings per share, dividend, pe ratio, and price ratios]")
    for i in range(len(competitors)):
        print(competitors[i] + ":")
        stuff = analyzeCompany(competitors[i])
        print(stuff)
        
#portion 3
#somehow get new s about company from news websites and also get analysis from professionals about the company.



#portion 5
#list of good resources for research

def mainHelper(inp_list, fullString):
    for i in inp_list:
        if(type(i) == list):
            for x in i:
                fullString+= x + ","
        else:
            fullString+= i + ","
    return fullString

def main(inputCompany):
    fullList = ""
    # inputCompany = input("Input Company Sticker: ").upper()
    companyStats = analyzeCompany(inputCompany)
    fullList = mainHelper(companyStats, fullList)
    # print(inputCompany)
    # print(companyStats)
    indexStatistics = indexStats()
    fullList = mainHelper(indexStatistics, fullList)
    # print("Index S%P: ")
    # print(indexStatistics)
    competitors = getCompetitors(inputCompany)
    fullList = mainHelper(competitors, fullList)
    # print("Competitors: ")
    # print(competitors)
    # compareCompetitorStatistics(competitors)
    return fullList
    #[price, eps, divdiend rate, dividend yield, pe Ratio, priceToSalesRatio, priceToBookRatio, priceToEarningsGrowthRatio, snpdividendyield, snp earnings per share, snp PE ratio, snp book val per share, 4 X competitors ]
    #[price, eps, [dividend rate and yield vals], peRatio, [priceRatio list]], [SNPDividendYield, SNPearningsPerShare, SNPPERatio, SNPBookValPerShare], [competitors]


if __name__ == "__main__":
    # inp = sys.argv[1]
    inp = "AAPL"
    vals = main(inp)
    print(vals[0:-1])
    sys.stdout.flush()


