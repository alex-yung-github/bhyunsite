const express = require('express');
const app = express.Router();


const cookieSessionModule = require('cookie-session');

const cookieInitializationParams = {
  name: 'local_page_counter_cookie',
  keys: ['encryptionkey'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}

const cookieSessionMiddleware = cookieSessionModule(cookieInitializationParams)
app.use(cookieSessionMiddleware)

app.use( (req,res,next) =>{
    let {visits} = req.session;
    visits ||= 0;
    req.session.visits = visits;
    next();
})

app.get('/cookiepage', async (req,res) =>{

	let cookie_name = 'worst girl scout cookie'
	let cookie_value = "Toffee-tastic"
	
	req.session.visits += 1

	res.cookie(cookie_name, cookie_value, {maxAge: 360000})
	res.cookie("best girl scout cookie", "Samoas", {maxAge: 360000})
	let sendDict = {
	    visits: req.session.visits
	};
	
	res.render("cookieEx/cookiePage.ejs", sendDict)
})

module.exports = app
