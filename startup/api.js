'use strict';
var express = require("express");
var app = express();

// init Routing
app.use("/user", require("../routes/user.router"));

app.use("/auth", require("../routes/auth.router"));

module.exports = app;
