const application = require("../config/app-config.js");
var utils = require("../config/app-utils.js");

// SEARCH API
application.app.get("/search", async (req, res) => {
  try {
    console.log("Received GET /search request: ", req.query);
    const query = req.query.key;

    var SQL =
      "SELECT * FROM names WHERE name LIKE ? OR arabic_name LIKE ? OR adad = ?";

    const results = await utils.queryPromise(SQL, [
      `%${query}%`,
      `%${query}%`,
      query,
    ]);

    if (results.length === 0) {
      res
        .status(200)
        .json({ length: results.length, message: "No matching records found" });
    } else {
      res.status(200).json(results);
    }
  } catch (err) {
    console.log("Error in executing query in GET /search", err);
    res.status(500).json({ error: "Failed to fetch the names record" });
  }
});
