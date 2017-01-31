// src/server.js
const express    = require('express');
const config     = require('./config');
const router     = require('./routes');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(router);

app.listen(config.port, function() {
  console.log("I AM LISTENING ON PORT " + config.port + "!!!");
});
