const express = require('express')
const app = express.Router();
let https = require('https')
let url = "https://ion.tjhsst.edu/api/schedule"

app.get('/schedule', (req,res) => {  
    https.get(url, function(response){
      let aggregated_response_string = ""
      
      response.on('data', function(chunk){
        aggregated_response_string+= chunk;
      })
    
      response.on('end', function(){
        const response_object = JSON.parse(aggregated_response_string)
        res.render('schedule_viewer', response_object);
        // console.log(response_object)
      })
    })
})

module.exports = app


