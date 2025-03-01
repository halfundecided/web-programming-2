const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const configRoutes = require("./routes");

/**
 * What does body-parser do?
 * To handle HTTP POST request in Express.js, you need to install middleware module called body-parser.
 * body-parser extract the entire body portion of an incoming request stream and exposes it on req.body.
 * From: https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express
 */

// support parsing of application/json type post data
app.use(bodyParser.json());
// support parsing of application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Middleware
 */
const accessed = {};
app.use(function(req, res, next) {
  if (!accessed[req.path]) {
    accessed[req.path] = 0;
  }
  accessed[req.path]++;
  console.log("====================== REQUEST ======================");
  console.log("HTTP: " + req.method);
  console.log("PATH: " + req.originalUrl);
  console.log("BODY: " + JSON.stringify(req.body));
  console.log("TOTAL ACCESSES: " + accessed[req.path]);

  next();
});

configRoutes(app);
app.listen(3000, function() {
  console.log("We've now got a server!🔥");
  console.log("Your routes will be running on http://localhost:3000");
});
