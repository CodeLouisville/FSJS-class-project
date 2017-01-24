// src/server.js
const express = require('express');

const app = express();

app.use(function(req, res, next) {
  res.end("Documentation http://expressjs.com/");
});

app.listen(8080, function() {
  console.log("I AM LISTENING!!!");
});
