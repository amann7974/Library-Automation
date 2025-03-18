var pg = require("pg");

require("dotenv").config();

var conString = process.env.pg_conString;

var connection = new pg.Client(conString);
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});


 

module.exports = connection;