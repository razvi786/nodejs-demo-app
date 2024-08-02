const application = require("../config/app-config.js");
var utils = require("../config/app-utils.js");

var path = "/zikrs";
var table_name = "zikrs";
var defined_columns = ["id", "names_id", "zikr"];
var defined_body = {
  id: 1,
  names_id: 2,
  zikr: "example",
};

// GET All Names API
application.app.get(path, async (req, res) => {
  try {
    console.log(`Received GET ${path} request`);
    var SQL = `SELECT * FROM ${table_name}`;
    const results = await utils.queryPromise(SQL);
    res.status(200).json(results);
  } catch (err) {
    console.log(`Error executing query in GET ${path}`, err);
    res
      .status(500)
      .json({ error: `Failed to fetch all ${table_name} records` });
  }
});

// GET Name by id API
application.app.get(`${path}/:id`, async (req, res) => {
  try {
    console.log(`Received GET ${path}/:id request: `, req.params);
    const { id } = req.params;
    var SQL = `SELECT * FROM ${table_name} WHERE id = ?`;
    const results = await utils.queryPromise(SQL, [id]);
    if (results.length === 0) {
      res.status(400).json({
        error: `Unable to find matching ${table_name} record`,
        id: id,
      });
    } else {
      res.status(200).json(results[0]);
    }
  } catch (err) {
    console.log(`Error executing query in GET ${path}/:id`, err);
    res
      .status(500)
      .json({ error: `Failed to fetch ${table_name} record by id` });
  }
});

// POST API
application.app.post(path, async (req, res) => {
  try {
    console.log(`Received POST ${path} request: `, req.body);
    var columns = Object.keys(req.body).map((key) => ({
      name: key,
      value: req.body[key],
    }));
    columns.forEach((column) => {
      if (!column.value) throw new Error(`Column ${column.name} is mandatory`);
    });
    var column_names = columns.map((key) => key.name);
    var column_values = columns.map((key) => key.value);
    let SQL = `INSERT INTO ${table_name}(`;
    column_names.forEach((column_name) => {
      SQL += column_name + ",";
    });
    SQL = SQL.substring(0, SQL.length - 1);
    SQL += ") VALUES (";
    columns.forEach((column) => {
      SQL += "?,";
    });
    SQL = SQL.substring(0, SQL.length - 1);
    SQL += ")";
    const result = await utils.queryPromise(SQL, column_values);
    var output = { id: result.insertId };
    columns.forEach((column) => {
      output[column.name] = column.value;
    });
    res.json(output);
  } catch (err) {
    console.log(`Error executing query in POST ${path}: ${err}`);
    res.status(500).json({ error: `Failed to create ${table_name} record` });
  }
});

//PUT API
application.app.put(`${path}/:id`, async (req, res) => {
  try {
    console.log(`Received PUT ${path}/:id request: `, req.params, req.body);
    const id = req.params.id;
    var columns = Object.keys(req.body).map((key) => ({
      name: key,
      value: req.body[key],
    }));
    columns.forEach((column) => {
      if (!column.value) throw new Error(`Column ${column.name} is mandatory`);
    });
    var columns = Object.keys(req.body).map((key) => ({
      name: key,
      value: req.body[key],
    }));
    columns.forEach((column) => {
      if (!column.value) throw new Error(`Column ${column.name} is mandatory`);
    });
    let SQL = `UPDATE ${table_name} SET`;
    columns.forEach((column) => {
      SQL += ` ${column.name} = ?,`;
    });
    SQL = SQL.substring(0, SQL.length - 1);
    SQL += " WHERE id = ?";
    var column_values = columns.map((key) => key.value);
    column_values.push(id);
    const results = await utils.queryPromise(SQL, column_values);
    if (results.affectedRows === 0) {
      res.status(400).json({
        error: `Unable to find matching ${table_name} record`,
        id: id,
      });
    } else {
      var output = { id: id };
      columns.forEach((column) => {
        output[column.name] = column.value;
      });
      res.status(200).json(output);
    }
  } catch (err) {
    console.log(`Error executing query in PUT ${table_name}/:id`, err);
    res.status(500).json({ error: `Failed to update ${table_name} record` });
  }
});

//DELETE API
application.app.delete(`${path}/:id`, async (req, res) => {
  try {
    console.log(`Received DELETE ${path}/:id request: `, req.params);
    const id = req.params.id;
    const SQL = `DELETE FROM ${table_name} WHERE id = ?`;
    const result = await utils.queryPromise(SQL, [id]);
    if (result.affectedRows === 0) {
      res.status(400).json({
        error: `Unable to find matching ${table_name} record`,
        id: id,
      });
    } else {
      res
        .status(200)
        .json({ message: `Successfully deleted ${table_name} record`, id: id });
    }
  } catch (err) {
    console.log(`Error executing query in DELETE ${path}/:id`, err);
    res.status(500).json({ error: `Failed to delete ${path} record` });
  }
});
