#!/usr/bin/nodejs

// -------------- load packages -------------- //
// INITIALIZATION STUFF

//express engine import
var express = require('express')
var app = express();
app.set('view engine', 'ejs')
//for static method
const static_files_router = express.static('static')
app.use( static_files_router )
// for post method
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
// for mini module imports
const madlib_router = require('./routes/madlibSource')
const coinflip_router = require('./routes/coinFlipSource')
const numberForm_router = require('./routes/numberForm') 
const weatherForm_router = require('./routes/weatherForm')
const sprint1_router = require('./routes/sprint1')
const class_router = require('./routes/heroesSource')
const cookie_router = require("./routes/cookieSource")
const mday_router = require("./routes/mdaySource")
const verification_router = require("./routes/oAuthLab.js")
app.use(madlib_router);
app.use(coinflip_router);
app.use(numberForm_router);
app.use(weatherForm_router);
app.use(sprint1_router);
app.use(class_router);
app.use(cookie_router);
app.use(mday_router);
app.use(verification_router)

app.get('/', (req, res) => {
    res.render('index')
})


app.get('/labs', (req, res) =>{
    const logged_in = true
    let x = ["Boba", "Ramen", "Tacos", "Shrimp Chips", "Apples"]
    const render_dictionary = {
        'logged_in': logged_in,
        'foods_array': x,
    }
    res.render('labs', render_dictionary)
})

app.get('/boatSite', (req, res) => {
    res.render('bootstrapTest')
})

app.get('/tictactoe', function(req,res){
    res.render('tttGame')
})




// -------------- listener -------------- //
// // The listener is what keeps node 'alive.' 

var listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0", function() {
    console.log("Express server started");
});