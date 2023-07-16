const express = require('express');
const madlib_router = express.Router();
let page_counter = 0;

madlib_router.get('/madlib', (req, res) => { //renders input page to create artificial certificate
    res.render('madlib/madlib')
})

madlib_router.post('/madlib_handler', (req, res)=>{ //loads the certificate page based off of inputs
    //checks if the person has changed any of the default inputs
    let realPerson = true 
    if (req.body.name === "" && req.body.type === "default" && req.body.association === "Default Daniel" && req.body.inp_color === "#000000" && req.body.stampCost === "0") {
      realPerson = false;
    }
    
    //loads the page all the terms
    res.render('madlib/certificate_page', {
      'realPerson' : realPerson,
      'n': req.body.name,
      't': req.body.type,
      'a': req.body.association,
      'c': req.body.inp_color,
      'stampCost': req.body.stampCost
    });
})

//testing page that counts number of times the user reloads/visits the page. gives a certain message
//based off the number of times the page is visited
madlib_router.get('/placeholderPage', (req,res) =>{ 
    page_counter++
    value = "keep cooking"
    if(page_counter > 20 && page_counter < 40){ value = "you're gassin now"}
    if(page_counter == 42){ value = "not bad"}
    if(page_counter == 69){ value = "you're special"}
    if(page_counter >= 100 && page_counter < 200){ value = "I would recommend stopping"}
    if(page_counter >= 200 && page_counter < 300){ value = "im being serious. stop."}
    if(page_counter == 420){ value = "you're built different. I respect you"}
    if(page_counter >= 500 && page_counter < 1000){ value = "get help"}
    if(page_counter >= 1000 && page_counter < 1500){ value = "bro. go touch grass"}
    if(page_counter >= 2000 && page_counter < 5000){ value = "no more. this page shouldn't have this much traffic"}
    if(page_counter == 10000){ value = "why have you gone this far"}
    if(page_counter == 69420){ value = "your abiity to do nothing is remarkable... but also, nice"}
    if(page_counter > 69420){ value = "there is seriously no status higher than this."}
    const render_dictionary = {
    'placeholder' : value,
    'count' : page_counter,
    }
    res.render("placeholderEx.ejs", render_dictionary)
})


module.exports = madlib_router