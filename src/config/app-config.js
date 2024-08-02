const express = require("express");
const parser = require("body-parser");

const app = express();
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server Started on ${PORT}`);
    });
  } catch (err) {
    console.log("Error in starting the Server: ", err);
  }
};

module.exports = Object.assign({ app, startServer });
