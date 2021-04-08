"use strict";
global.ROOTPATH = __dirname;
const http = require("http");
var moment = require("moment");
const express = require('express');

const swaggerUi = require("swagger-ui-express"),
    swaggerDocument = require("./swagger.json");
const { connect_cache } = require("./cache/redis.service");
const db = require("./models");

const app = express();
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "views"));
app.use(express.static("public"));

db.sequelize
    .sync({
        force: false, // To create table if exists , so make it false
    })
    .then(async () => {
        console.info(`✔️ Database Connected`);

        connect_cache()
            .then(() => {
                console.info("✔️ Redis Cache Connected");
                /**
                 * Listen on provided port, on all network interfaces.
                 */
                server.listen(PORT, async function () {
                    console.info(`✔️ Server Started (listening on PORT : ${PORT})`);
                    if (process.env.NODE_ENV) {
                        console.info(`✔️ (${process.env.NODE_ENV}) ENV Loaded`);
                    }
                    console.info(`⌚`, moment().format("DD-MM-YYYY hh:mm:ss a"));
                });
            })
            .catch((err) => {
                console.error(`❌ Server Stopped (listening on PORT : ${PORT})`);
                console.info(`⌚ `, moment().format("DD-MM-YYYY hh:mm:ss a"));
                console.error("❗️ Could not connect to redis database...", err.message);
                process.exit();
            });
    })
    .catch((err) => {
        console.error(`❌ Server Stopped (listening on PORT : ${PORT})`);
        console.info(`⌚`, moment().format("DD-MM-YYYY hh:mm:ss a"));
        console.error("❗️ Could not connect to database...", err.message);
        process.exit();
    });

app.use("/api", require("./startup/api"));
app.use("/cache", require("./cache"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", require("./startup/web"));

// Exceptions Handling
require("./startup/exceptions")();

module.exports = server;