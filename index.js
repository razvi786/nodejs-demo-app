const application = require("./config/app-config.js");

// Importing CRUD scripts
require("./crud/general.js");
require("./crud/names-crud.js");
require("./crud/zikrs-crud.js");
require("./crud/labels-crud.js");

// Starting the Server
application.startServer();
