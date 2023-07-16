var express = require('express')
var hero_source = express();
let https = require('https');
const sqlite3 = require('sqlite3').verbose();

// for req.body parsing 
hero_source.use(express.json());
hero_source.use(express.urlencoded({ extended: true }));

// for ejs engine
hero_source.set('view engine','ejs')

//COOKIE setup
const cookieSessionModule = require('cookie-session');
const cookieInitializationParams = {
  name: 'hero_visit_cookie',
  keys: ['encryptionkey'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}
const cookieSessionMiddleware = cookieSessionModule(cookieInitializationParams)
hero_source.use(cookieSessionMiddleware)
hero_source.use( (req,res,next) =>{
    let {visits} = req.session;
    visits ||= 0;
    req.session.visits = visits;
    next();
})

function openDatabase(){
  return new Promise( (resolve, reject) =>{
    let db = new sqlite3.Database('database.db', (err) =>{
      if(err){
          return reject(err.message)
      }
      resolve(db);
    });
  })
}

//SQL setup
var sql_params = {
  connectionLimit : 10,
  user            : process.env.DIRECTOR_DATABASE_USERNAME,
  password        : process.env.DIRECTOR_DATABASE_PASSWORD,
  host            : process.env.DIRECTOR_DATABASE_HOST,
  port            : process.env.DIRECTOR_DATABASE_PORT,
  database        : process.env.DIRECTOR_DATABASE_NAME
}
// let pool  = mysql.createPool(sql_params);   
// let pool = await openDatabase()


// DEFINE ROUTES
hero_source.get('/classform', (req, res) => {
    const toSend = {
        message: "",
        message2: ""
    };
    res.render('mySQLClassLab/originalclassform', toSend)
}) 

hero_source.get('/character/characterFailed/', (req, res) => {
    const toSend = {
        message: "username is taken",
        message2: ""
    };
    res.render('mySQLClassLab/classform', toSend)
}) 

hero_source.get('/characterLog/characterFailed/', (req, res) => {
    const toSend = {
        message: "",
        message2: "username does not exist"
    };
    res.render('mySQLClassLab/classform', toSend)
}) 

hero_source.get('/character/', async (req,res, next) => {
    let pool = await openDatabase()
    req.session.visits +=1
    res.cookie("herovisits", req.session.visits, {maxAge: 360000})
    const {class_type} = req.query; // DESTRUCTURING ASSIGNMENT
    const {user_name} = req.query;
    res.locals.user_name = user_name
    res.locals.class_type = class_type
    
    //functions area
    function getUsedNames() {
        return new Promise( (resolve, reject) => {
            const sql = "SELECT p_username FROM players"
            pool.all(sql, function(error, results){
            if (error) throw error;
            resolve(results)
            })
      });
    }
    function pushData(data) {
            return new Promise( (resolve, reject) => {
                const sql = "INSERT INTO players(p_username, p_level, p_classID, p_className, p_str, p_intel, p_def, p_vit, p_special, p_spd, xp, statPts) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)" 
                const params = data;
                console.log("params: " + params)
                pool.run(sql, params, function(error, results){
                if (error) throw error;
                resolve(results)
                })
          });
        }
    //const {hero} = req.query; // (app.get version)
    function heroPromise(input_class) {
        return new Promise( (resolve, reject) => {
            const sql = "SELECT * FROM classes WHERE c_name=?"
            const params = [input_class];
            pool.all(sql, params, function(error, results){
            if (error) throw error;
            resolve(results)
            })
      });
    }
    
    //main function
    let used_names = await getUsedNames()
    console.log("usedNamesList: ", used_names)
    let used_names_list = []
    if(used_names != undefined){
        for(let i = 0; i < used_names.length; i++){
            used_names_list.push(used_names[i].p_username)
        }
    }
    console.log(used_names_list)
    if(used_names_list.includes(user_name)){
        res.redirect("characterFailed")
    }
    else{
        let char_data = await heroPromise(class_type)
        console.log(class_type)
        tempList = JSON.parse(JSON.stringify(char_data[0]))
        let playerInfo = []
        playerInfo.push(user_name)
        playerInfo.push(0)
        for(const [key, value] of Object.entries(tempList)){
           playerInfo.push(value)
        }
        playerInfo.push(0)
        playerInfo.push(2)
        console.log(playerInfo)
        await pushData(playerInfo);
        next()
    }
}, async (req, res) => {
    let pool = await openDatabase()
    function getCharData(input_class) {
        return new Promise( (resolve, reject) => {
            const sql = "SELECT * FROM players WHERE p_username=?"
            const params = [input_class];
            pool.all(sql, params, function(error, results){
            if (error) throw error;
            resolve(results)
            })
      });
    }
    console.log(res.locals.user_name)
    name_data = await getCharData(res.locals.user_name)
    console.log("namedata", name_data)
    const output_dictionary = {
      'results' : name_data[0],
      'class_name' : res.locals.class_type,
      'username': res.locals.user_name,
    };
    res.render('mySQLClassLab/userPage', output_dictionary);
})


hero_source.get('/characterLog/', async (req,res, next) => {
    let pool = await openDatabase()
    req.session.visits+=1
    res.cookie("herovisits", req.session.visits, {maxAge: 360000})
    const {class_type} = req.query; // DESTRUCTURING ASSIGNMENT
    const {user_name} = req.query;
    res.locals.user_name = user_name
    res.locals.class_type = class_type
    
    //functions area
    function getUsedNames() {
        return new Promise( (resolve, reject) => {
            const sql = "SELECT p_username FROM players"
            pool.all(sql, function(error, results){
            if (error) throw error;
            resolve(results)
            })
      });
    }
    
    //main function
    let used_names = await getUsedNames()
    // console.log("usedNamesList: ", used_names)
    let used_names_list = []
    for(let i = 0; i < used_names.length; i++){
        used_names_list.push(used_names[i].p_username)
    }
    console.log(used_names_list)
    if(used_names_list.includes(user_name) == false){
        res.redirect("characterFailed")
    }
    else{
        next()
    }
}, async (req, res) => {
    let pool = await openDatabase()
    function getCharData(input_class) {
        return new Promise( (resolve, reject) => {
            const sql = "SELECT * FROM players WHERE p_username=?"
            const params = [input_class];
            pool.all(sql, params, function(error, results){
            if (error) throw error;
            resolve(results)
            })
      });
    }
    console.log(res.locals.user_name)
    name_data = await getCharData(res.locals.user_name)
    console.log("namedata", name_data[0])
    const output_dictionary = {
      'results' : name_data[0],
      'class_name' : name_data[0].p_className,
      'username': res.locals.user_name,
    };
    res.render('mySQLClassLab/userPage', output_dictionary);
})

hero_source.get("/xpReq", (req, res) => {
    kitchen  = {
	  "zero": 500,
	  "one": 1000,
      "two": 2000,
      "three": 4000,
	  "four": 7000,
	  "five": 13000,
	  "six": 26000,
	  "seven": 52000,
	  "eight": 104000,
	  "nine": 208000,
	  "ten": 416000
	}
	return res.json(kitchen)
	
})

hero_source.get("/heroProcessing", async (req, res) =>{
    let pool = await openDatabase()
    kitchen  = {
	  "ok": true,
    }
    function pushData(sqlstring) {
        return new Promise( (resolve, reject) => {
            const sql = sqlstring
            const params = [];
            pool.all(sql, params, function(error, results){
            if (error) throw error;
            resolve(results)
            })
      });
    }
    console.log(req.query)
    let str = "UPDATE players SET ";
    for (const key in req.query) {
        if(key != "p_username"){
            str = str + key + "=" + req.query[key] + ", "
        }
        if(key == "statPts"){
            str = str + key + "=" + req.query[key]
        }
    }
    str = str + " WHERE " + "p_username=" + "'" + req.query.p_username+ "'" + ";"
    console.log(str)
    await pushData(str);
    return res.json(kitchen)
})


module.exports = hero_source;