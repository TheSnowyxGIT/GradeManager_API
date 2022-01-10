const mysql = require('mysql2');

const config = require("../../config.json");

const serverip = config.DDB.host;
const username = config.DDB.username;
const password = config.DDB.password;
const database = config.DDB.database;


const connection = mysql.createConnection({
   host: serverip,
   user: username,
   password: password,
   database: database
 });

 
var pool  = mysql.createPool({
  host: serverip,
  user: username,
  password: password,
  database: database
});

module.exports = pool;
