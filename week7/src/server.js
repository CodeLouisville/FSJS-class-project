// src/server.js
const express    = require('express');
const config     = require('./config');
const router     = require('./routes');
const bodyParser = require('body-parser');
const path       = require('path');
// Load mongoose package
const mongoose   = require('mongoose');

// Connect to MongoDB and create/use database as configured
mongoose.connect(`mongodb://${config.db.host}/${config.db.dbName}`);

// Import all models
require('./models/file.model.js');


const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/node_modules',express.static(path.join(__dirname, '../node_modules')));
app.use(router);

app.listen(config.port, function() {
  console.log("I AM LISTENING ON PORT " + config.port + "!!!");
});
