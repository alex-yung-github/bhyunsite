// -------------- load packages -------------- //
const passport =require("passport")
const express = require('express');
const router = express.Router()
let https = require('https');
// var mysql = require('mysql');
const sqlite3 = require('sqlite3').verbose();
const filepath = "database.db"
const cookieSession = require('cookie-session')
require('./passport-setup')


//https get options setup:
var options = { 
	headers : {
		'User-Agent': '(weather app) (realironfist123@gmail.com)'
	}
}

//sql setup
var sql_params = {
  connectionLimit : 10,
  user            : process.env.DIRECTOR_DATABASE_USERNAME,
  password        : process.env.DIRECTOR_DATABASE_PASSWORD,
  host            : process.env.DIRECTOR_DATABASE_HOST,
  port            : process.env.DIRECTOR_DATABASE_PORT,
  database        : process.env.DIRECTOR_DATABASE_NAME
}
// let pool  = mysql(sql_params);  
let pool = new sqlite3.Database(filepath)



// -- oauth package
const {  AuthorizationCode } = require('simple-oauth2');

// -------------- variable initialization -------------- //

// These are parameters provided by the authenticating server when
// we register our OAUTH client.
// -- The client ID is going to be public
// -- The client secret is super top secret. Don't make this visible

//  YOU GET THESE PARAMETERS BY REGISTERING AN APP HERE: https://ion.tjhsst.edu/oauth/applications/    

const ion_client_id = 'qY3JDrcMunHNWMrFYubkrtL4N1K5A3UfNIGgDHAG';
const ion_client_secret = 'qAlAw5bbZUnlFPvGrtaZIfnbtjgetMbU8ZGGZHfrHsf8blGVukIUY9jmVlmTH4r4pXhzRVxycMLMme19cWHdBV7sF5NeGVHIjmQUlVJVAqaVRqSVPj9W9Lmb8ZCCsPyQ';

const ion_redirect_uri = 'https://user.tjhsst.edu/2023ayung/verified_page';    //    <<== you choose this one
// const ion_redirect_uri = 'https//127.0.0.1/logger_inner';    //    <<== you choose this one


// Here we create an oauth2 variable that we will use to manage out OAUTH operations

//ION OAUTH LOGIN ITEMS
// const oauth_params = {
//   client: {
//     id: google_client_id,
//     secret: google_client_secret,
//   }
//   ,
//   auth: {
//     tokenHost: 'https://ion.tjhsst.edu/oauth/',
//     authorizePath: 'https://ion.tjhsst.edu/oauth/authorize',
//     tokenPath: 'https://ion.tjhsst.edu/oauth/token/'
//   }
// }

// THE CLASS OBJECT THAT HANDLES OAUTH!!!!
// const client = new AuthorizationCode(oauth_params);
//END OF ION ITEMs


// const authorizationUri = client.authorizeURL({
//     scope: "read",
//     redirect_uri: google_redirect_url
// });

router.use(cookieSession({
  name: "cookieClicker",
  keys: ['key1', 'key2']
}))
router.use(passport.initialize());
router.use(passport.session())
//google handlers
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  });


router.get("/failed", (req, res) =>{
  res.send("You did not successfully login")
})

router.get("/good", (req, res, next) => {
  console.log("user dictionary: ", req.user)
  if(req.user){
    next()
  }
  else{
    res.sendStatus(401)
  }
}, (req, res) => {
  res.send("You have successfully logged in ${req.user.displayName}!")
})

router.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/labs')
})

// -------------- express 'get' handlers -------------- //

router.get('/verificationPage', function (req, res) {
    
  res.redirect("/google")
    // res.render('verificationLab1/unverified', {'login_link' : "./google"})

});
// -------------- intermediary login_worker helper -------------- //

router.get('/verified_page', async function(req, res) { 
    //functions for sequel and etc
    function downloadPromise(given_url) {
        return new Promise( (resolve, reject) => {
            https.get(given_url, options, function(response){
              let aggregated_response_string = ""
              
              response.on('data', function(chunk){
                aggregated_response_string+= chunk;
              })
            
              response.on('end', function(){
                const response_object = JSON.parse(aggregated_response_string)
               
                // res.locals.data = response_object
                // console.log(aggregated_response_string)
                // console.log(response_object)
              resolve(response_object)
              })
            }).on('error', function(err) {
                reject(err)
            	res.render('verificationLab1/unverified', {'login_link': "did not respond"});
            })
        })
    }
    function getIDs() {
        return new Promise( (resolve, reject) => {
            const sql = "SELECT id FROM cookiePlayers"
            pool.query(sql, function(error, results){
            if (error) throw error;
            resolve(results)
            })
      });
    }
    function pushData(data) {
        return new Promise( (resolve, reject) => {
            const sql = "INSERT INTO cookiePlayers(id, clicks, upgrade, ascensions) VALUES (?)" 
            const params = [data];
            pool.query(sql, params, function(error, results){
            if (error) throw error;
            resolve(results)
            })
      });
    }
    function pullData(idData){
        return new Promise( (resolve, reject) => {
            const sql = "SELECT * FROM cookiePlayers WHERE id = " + idData
            console.log("cookie game log 3", sql)
            const params = [];
            pool.query(sql, params, function(error, results){
            if (error) throw error;
            resolve(results)
            })
      });
    }

    //code for oAuth -------------------
    const {code} = req.query;
    console.log(code)
    const options = {
      'code': code,
      'redirect_uri': ion_redirect_uri,
      'scope': 'read'
    };
    let token = "";
    // needs to be in try/catch
    try {
      token = await client.getToken(options);      // await serializes asyncronous fcn call
    } 
    catch (error) {
      console.log('Log Token Error', error.message);
       res.send(502); // bad stuff, man
    }
    
    console.log(token)
    
    const access_token = token.token.access_token;
    console.log(access_token)
    const authenticated_link = `https://ion.tjhsst.edu/api/profile?format=json&access_token=` + access_token;
    console.log(authenticated_link)
    //end of oAuth -------------------
    
    let data = await downloadPromise(authenticated_link)
    console.log(data)
    console.log("id: ", data.id)
    let tempIDS = await getIDs()
    let idList = []
    for(let i = 0; i < tempIDS.length; i++){
        idList.push(tempIDS[i].id)
    }
    console.log(idList)
    let playerInfo = []
    if(idList.includes(data.id) == false){
        playerInfo.push(data.id)
        playerInfo.push(0)
        playerInfo.push(0)
        playerInfo.push(0)
        await pushData(playerInfo)
    }
    else{
        let temp = await pullData(data.id)
        playerInfo.push(temp[0].clicks)
        playerInfo.push(temp[0].upgrade)
        playerInfo.push(temp[0].ascensions)
    }
    console.log("player information: ", playerInfo)
    const sendData = {
        "clicks": playerInfo[0],
        "upgrades": playerInfo[1],
        "ascensions": playerInfo[2],
        "full_name": data.full_name,
        "playerClass": data.grade.name,
        "picture": data.picture,
        "id": data.id
    };
    console.log("player list:", idList)
    
  res.render('verificationLab1/land_page', sendData)

});

router.get("/clickProcessing", async (req, res) =>{
    kitchen  = {
	  "ok": true,
    }
    function pushData(sqlstring) {
        return new Promise( (resolve, reject) => {
            const sql = sqlstring
            const params = [];
            pool.query(sql, params, function(error, results){
            if (error) throw error;
            resolve(results)
            })
      });
    }
    console.log(req.query)
    let str = "UPDATE cookiePlayers SET ";
    for (const key in req.query) {
        if(key == "ascensions"){
            str = str + key + "=" + req.query[key]
        }
        else if(key != "id"){
            str = str + key + "=" + req.query[key] + ", "
        }
    }
    str = str + " WHERE " + "id=" + "'" + req.query.id+ "'" + ";"
    console.log(str)
    await pushData(str);
    return res.json(kitchen)
})


// -------------- export the router -------------- //

module.exports = router