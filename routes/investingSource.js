const { render } = require('ejs');
const express = require('express');
const bodyParser = require("body-parser");
const {spawn} = require('child_process');
const i_router = express.Router();
let https = require('https');
let URL = "https://finnhub.io/api/v1"
var moment = require('moment');
let apiKey = "cgsa1a1r01qkrsgj5gqgcgsa1a1r01qkrsgj5gr0"
i_router.use(bodyParser.urlencoded({ extended:true}));
i_router.use(bodyParser.json());

//get current date for news
function padNum(num) {
    if(num < 9){
        temp = "0" + num
    }
    else{
        temp = num
    }
    return temp
}

const date_object = new Date()
let year = date_object.getFullYear()
let month = date_object.getMonth() + 1
let day = date_object.getDate()
// &from=2023-04-13&to=2023-04-13
month = padNum(month)
day = padNum(day)
let date = year + '-' + month + '-' + day
console.log("Date: ", date)

var unix_time = Math.floor(Date.now() / 1000);console.log(unix_time)
let unix_time_yr_earlier = unix_time - 31536000
console.log("UNIX range: ", unix_time_yr_earlier, " - ", unix_time)

//create user agent and secret to access finnhub api
var options = { 
	headers : {
		'User-Agent': '(weather app) (realironfist123@gmail.com)',
        "X-Finnhub-Secret": "cgsa1a1r01qkrsgj5gs0",
	}
}

i_router.get('/stockAnalysis/', (req, res) => { //renders input page to create artificial certificate
    res.render('stockAnalysis/main')
})

i_router.get('/stockAnalysis/inputForm/', (req, res) => { //renders input page to create artificial certificate
    res.render('stockAnalysis/inputForm')
})

i_router.get('/stockAnalysis/stockFormHandler/', (req, res) => {
    let temp = req.query.stock
    let url = temp.toString()
    res.redirect(url)
})

//get stock info based on user input
i_router.get('/stockAnalysis/:stock', async (req, res, next) => {
    //first midware = get news dadta
    let stockVal = req.params.stock
    res.locals.stock = req.params.stock
    let news_url = URL + "/company-news?symbol=" + stockVal + "&from=" + date + "&to=" + date + "&token=" + apiKey
    console.log("news_url: ", news_url)
    //news information
    function getNewsDataPromise(){
        return new Promise( (resolve, reject) => {
            https.get(news_url, options, function(response){
                let aggregated_response_string = ""
                
                response.on('data', function(chunk){
                aggregated_response_string+= chunk;
                //   console.log(aggregated_response_string)
                })
            
                response.on('end', function(){
                const response_object = JSON.parse(aggregated_response_string)
                if(response_object.hasOwnProperty("error")){
                    return res.render('stockAnalysis/failed', {item: response_object});
                }
                else{
                    resolve(response_object)
                }
                })
            }).on('error', function(e) {
                res.render('weatherLab/failed', {item: {detail: "api finnhub.io failed to respond"}});
            })
        })
    }
    let news_data = await getNewsDataPromise()
    res.locals.newsData = news_data
    next()

    
}, async (req, res, next) => {
    //second midware = get chart data
    //https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=1&from=1679476980&to=1679649780&token=cgsa1a1r01qkrsgj5gqgcgsa1a1r01qkrsgj5gr0
    let chart_url = URL + "/stock/candle?symbol=" + res.locals.stock + "&from=" + unix_time_yr_earlier + "&to=" + unix_time + "&resolution=D" + "&token=" + apiKey
    console.log("chart url: ", chart_url)
    function getChartDataPromise(){
        return new Promise( (resolve, reject) => {
            https.get(chart_url, options, function(response){
                let chart_response = "";

                response.on("data", function(chunk){
                     chart_response += chunk;
                })

                response.on('end', function(){
                    const chart_converted_obj = JSON.parse(chart_response);
                    if(chart_converted_obj.hasOwnProperty("error")){
                        return res.render('stockAnalysis/failed', {item: chart_converted_obj});
                    }
                    else{
                        resolve(chart_converted_obj)
                    }
                })
            })
        })
    }

    chart_data = await getChartDataPromise()
    res.locals.chart_data = chart_data
    next()



}, (req, res, next) => {
    // third midware = get stock data

    //TEMP STUFF FOR TESTING, COMMENT OUT WHEN DONE
    res.locals.stock_data = "165.02,5.88,0.91,0.55%,28.06,6.72,44.85,2.72,1.66% ,39.61 USD,22.23 ,996.29 USD,SSNLF,SONY,VZIO,PCRFY"
    next()
    //END OF TEMP STUF FOR TESTING

    // var stock_data;
    // const python = spawn('python', ["scratchScraper.py", res.locals.stock]);

    // python.stdout.on('data', function(data) {
    //     stock_data = data.toString();
    //     res.locals.stock_data = stock_data
    // });

    // python.on('data', data => {
    //     console.error(`stderr: ${data}`)
    // })

    // python.on('exit', (code) => {
    //     console.log(`child process exited with code ${code} ${stock_data} \n`);
    //     next()
    // })

}, (req, res) => {

    let stockToSend = res.locals.newsData
    // console.log(stockToSend)
    let stock_data_toSend = res.locals.stock_data
    console.log("stockkk: ", stock_data_toSend)
    // console.log("candddles: ", res.locals.chart_data)
    const render_dictionary = {
        'newsData' : stockToSend,
        'analysisData' : stock_data_toSend,
        'chartData' : res.locals.chart_data,
        'stock_name' : res.locals.stock
    }
    res.render('stockAnalysis/analysisPage', render_dictionary)
})

module.exports = i_router
