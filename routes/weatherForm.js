const express = require('express'); //allows for the use of express app
const weatherForm_router = express.Router(); //initializes router object to be exported in this module
let https = require('https');  //object that lets us pull data from a json
let url = "https://api.weather.gov/points/"
var moment = require('moment'); //object that converts 24:00 time to 12:00 time 

var options = {  //when sending a request, allows for application to see who is requesting info
	headers : {
		'User-Agent': '(weather app) (realironfist123@gmail.com)'
	}
} 

weatherForm_router.get('/weatherForm/', (req, res) =>{ 
    //initializes page that asks user for desired coordinates of weather
    res.render('weatherLab/weatherForm');
})

weatherForm_router.get("/weatherForm/weather", async (req, res, next) => { //first middleware --------------------------
    //creates url for the https request based on user's given latitude and longitude (lat and long)
    var newUrl = url + req.query.lat + "," + req.query.long;
    // console.log(newUrl)] //for debugging
    
    //creates a promise that asynchronously performs the request that return with an error or information 
    function downloadPromise(given_url) {
        return new Promise( (resolve, reject) => {
            https.get(given_url, options, function(response){ //uses the url and options from earlier for https request
              let aggregated_response_string = ""
              
              response.on('data', function(chunk){ //gets the data from the url
                aggregated_response_string+= chunk;
              })
            
              response.on('end', function(){ //after data is gotten we parse data
              //parses the json into a readable dictionary object
                const response_object = JSON.parse(aggregated_response_string)
               //checks if the request has returned unwanted information; if so, return failed page to user
               //otherwise, returns the information required to launch the information page
                if(response_object.hasOwnProperty('detail')){
                    //fail page case, returns failed page; this fail case is when the api fails
                    return res.render('weatherLab/failed', {item: response_object});
                }
                else if(response_object.hasOwnProperty('properties') && response_object.properties.hasOwnProperty('forecast') && response_object.properties.forecast === null){
                    //another fail case which occurs when the point is not in the US
                    return res.render('weatherLab/failed', {item: {detail: "point is in the US, but no forecast exists"}})
                }
                else{ 
                    //if no failure, it returns the parsed information
                    resolve(response_object)
                }
              })
            }).on('error', function(err) {
                //another error case when the https request gets nothing
                reject(err)
            	res.render('weatherLab/failed', {item: {detail: "api.weather.gov did not respond"}});
            })
        })
    }
    //here, we run the function that requests information from the desired URL,
    let toSend = await downloadPromise(newUrl)
    //after receiving data, we send it to the next middleware via res.locals
    res.locals.data = toSend
    console.log(res.locals.data)
    next();
}, async (req, res, next) => { //next middleware func --------------------------
    //we parse the chainURL from the data sent to this middleware
    chainUrl = res.locals.data.properties.forecastHourly
    console.log(chainUrl)
    //again, this function grabs the data from the given URL and either returns information or a failure
    function downloadPromise(given_url){
        return new Promise( (resolve, reject) => { //the promise performs asynchronously and gets data
            https.get(given_url, options, function(response){
              let aggregated_response_string = ""
              
              response.on('data', function(chunk){ //gets chunk of data from the URL
                aggregated_response_string+= chunk;
              })
            
              response.on('end', function(){ //after getting data, post proccessing occurs
                  //uses JSON to parse data into readable object
                const response_object = JSON.parse(aggregated_response_string)
                if(response_object.hasOwnProperty('detail')){
                    //fail case; if so return failed site
                    return res.render('weatherLab/failed', {item: response_object});
                }
                else{
                    //otherwise, return information
                    resolve(response_object)
                }
              })
            }).on('error', function(err) {
                //another fail case 
                reject(err)
            	res.render('weatherLab/failed', {item: {detail: "api.weather.gov forecast link failed"}}); //description of errors
            })
        })
    }
    //runs function that performs the https request
    let toSend = await downloadPromise(chainUrl)
    res.locals.weatherData = toSend
    console.log(res.locals.weatherData)
    //saves data for website in res.locals and sends it to the final middleware
    next()
    
}, function(req, res){ //final middleware --------------------------
    //gets all the data needed for the weather page into one dictionary and sends it to the weatherPage
    //moment allows for processing of military time (24:00) into the 12:00 time type
    render_dictionary = {
        lat: req.query.lat, //latitude
        long: req.query.long, //longitude
        weatherData : res.locals.weatherData, //the entire dictionary retrieved from https request
        moment: moment //time converter
    }
    res.render('weatherLab/weatherPage', render_dictionary); //renders the html page
})

//MOST IMPORTANT: exports all the code from this router into the main app (index.js)
module.exports = weatherForm_router