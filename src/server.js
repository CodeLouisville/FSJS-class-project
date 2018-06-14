// src/server.js

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const router = require('./routes');

const app = express();
const publicPath = path.resolve(__dirname, '../public');

app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use('/api', router);

app.listen(config.port, function() {
  console.log(`${config.appName} is listening on port ${config.port}`);
});