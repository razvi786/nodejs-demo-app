const mysql = require("mysql2");

var db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  port: process.env.DB_PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

module.exports = Object.assign({ db });
