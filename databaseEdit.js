const sqlite3 = require("sqlite3").verbose();
const filepath = "./database.db"

let pool = new sqlite3.Database(filepath)

//hero classes already created
function createHeroClasses() {
    return new Promise( (resolve, reject) => {
        const sql = "CREATE TABLE classes (c_id INT, c_name VARCHAR(100), c_str INT, c_intel INT, c_def INT, c_vit INT, c_special INT, c_spd INT);" 
        const params = [];
        pool.run(sql, params, function(error, results){
        if (error) throw error;
            resolve(results)
        })
  });
}

//created already
function createCookiePlayers() {
    return new Promise( (resolve, reject) => {
        const sql = "CREATE TABLE cookiePlayers (id VARCHAR(100), clicks INT, upgrade INT, ascensions INT, PRIMARY KEY (id));" 
        const params = [];
        pool.run(sql, params, function(error, results){
        if (error) throw error;
        resolve(results)
        })
  });
}

function showData(table){
    const sql = "SELECT * FROM " + table
    const params = []
    pool.all(sql, params, function(error, results){
        if(error) throw error;
        console.log(results)
    })
}
function descTable(table){
    const sql = "PRAGMA table_info(" + table + ")";
    const params = []
    pool.all(sql, params, function(error, results){
        if(error) throw error;
        console.log(results)
    })
}

function pushHeroClasses(){
    const sql = `INSERT INTO classes (c_id, c_name, c_str, c_intel, c_def, c_vit, c_special, c_spd) VALUES (0, 'Dark Mage', 3, 8, 4, 4, 7, 3),
    (1, 'Spacetime Mage', 2, 9, 2, 3, 10, 7),
    (2, 'Elemental Mage', 2, 10, 3, 5, 5, 5),
    (3, 'Paladin', 4, 5, 9, 8, 1, 4),
    (4, 'Gladiator', 7, 3, 6, 6, 2, 5),
    (5, 'Juggernaut', 8, 3, 7, 5, 0, 6),
    (6, 'Berserker', 10, 0, 0, 10, 5, 8),
    (7, 'Scout', 5, 6, 4, 7, 0, 10),
    (8, 'Shadow Assassin', 9, 6, 3, 7, 0, 8),
    (9, 'Jedi', 10, 0, 0, 10, 7, 5),
    (10, 'Necromancer', 5, 0, 5, 10, 8, 7);" `
    const params = [];
    pool.run(sql, params, function(error, results){
        if(error) throw error;
        return results
    })
}

function deletion(table){ //when yo uwant to delete a table
    const sql = 'DROP TABLE' + table
    const params = [];
    pool.run(sql, params, function(error, results){
        if(error) throw error;
        return results
    })
}

function testAddCookiePlayer(){
    const sql = 'INSERT INTO cookiePlayers (id, clicks, upgrade, ascensions) VALUES (0, 10101, 10, 10000)'
    const params = []
    pool.run(sql, params, function(error, results){
        if(error) throw error;
        return results
    })
}

//created already
function createHeroPlayersTable(){
    const sql = `CREATE TABLE players(p_username VARCHAR(100), p_level INT, p_classID INT, p_className VARCHAR(100), p_str INT, p_intel INT, p_def INT, p_vit INT, p_special INT, p_spd INT, xp INT, statPts INT)`
    const params = []
    pool.run(sql, params, function(error, results){
        if(error) throw error;
        return results
    })
}


descTable("players")