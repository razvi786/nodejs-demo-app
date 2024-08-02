var connection = require("./db-connection.js");

// Generic method which handles queries
var queryPromise = function queryPromise(sql, values = []) {
  return new Promise((resolve, reject) => {
    connection.db.getConnection(function (err, conn) {
      if (err) throw err;

      conn.query(sql, values, (err, results) => {
        if (!err) {
          console.log("SQL Query executed successfully");
          resolve(results);
          conn.release();
        } else {
          throw err;
        }
      });
    });
  });
};

module.exports = Object.assign({ queryPromise });
