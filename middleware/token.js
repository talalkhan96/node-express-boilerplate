'use strict';
const jwt = require("jsonwebtoken");
const config = require("config");
const moment = require('moment')
var compose = require("composable-middleware");
const fs = require("fs");
var publicKEY = fs.readFileSync("config/cert/public.key", "utf8");
var { getUserStateToken, updateUserStateToken, setUserStateToken } = require('../cache/redis.service')

function isAuthenticated() {
  return (
    compose()
      // Attach user to request
      .use(function (req, res, next) {
        const token = req.header("x-auth-token");
        if (!token)
          return res
            .status(401)
            .send({ message: "Forbidden Access Denied. No Token Found" });

        try {
          var i = "XYZ";
          var s = "xyz@gmail.com";
          var verifyOptions = {
            issuer: i,
            subject: s,
            algorithm: ["RS256"],
          };
          let JWTSPLIT = token.split(".");
          var decodedJWTHeader = JSON.parse(
            Buffer.from(JWTSPLIT[0], "base64").toString()
          );
          if (decodedJWTHeader.alg != "RS256") {
            res.status(401).send({
              success: false,
              message: "Access Denied. Compromised Authorized Token.",
              code: 401,
            });
            return;
          }
          var decoded = jwt.verify(token, publicKEY, verifyOptions);
          req.user = decoded;
          req.auth = token;
          next();
        } catch (error) {
          res.status(401).send({ message: error.message || "Token is not valid!" });
        }
      })
      .use(function (req, res, next) {
        // This middleware will verify if the jwt is not compromised after user logged out
        getUserStateToken(req.auth).then(data => {
          if (data == null) {
            console.log("Compromised Token!")
            res.status(401).send({  
              success: false,
              message: "Access Denied. Compromised Authorized Token.",
              code: 401,
            });
            return;
          } else {
            console.log("Safe zone!")

            setUserStateToken(req.auth, moment(moment().add(48, 'hours')).fromNow_seconds()).then((success) => {
              if (success) {
                console.log("Refresh Token Record Updated")
              }
            })
              .catch((error) => res.json(error));
            next();
          }
        })
      })
  )
}

function isValid() {
  return (
    compose()
      // Attach user to request
      .use(function (req, res, next) {
        const token = req.header("x-auth-token");
        if (!token)
          return res
            .status(401)
            .send({ message: "Forbidden Access Denied. No Token Found" });

        try {
          var i = "XYZ";
          var s = "xyz@gmail.com";
          var verifyOptions = {
            issuer: i,
            subject: s,
            algorithm: ["RS256"],
          };
          let JWTSPLIT = token.split(".");
          var decodedJWTHeader = JSON.parse(
            Buffer.from(JWTSPLIT[0], "base64").toString()
          );
          if (decodedJWTHeader.alg != "RS256") {
            res.status(401).send({
              success: false,
              message: "Access Denied. Compromised Authorized Token.",
              code: 401,
            });
            return;
          }
          var decoded = jwt.verify(token, publicKEY, verifyOptions);
          req.user = decoded;
          req.auth = token;
          next();
        } catch (error) {
          res.status(401).send({ message: error.message || "Token is not valid!" });
        }
      })
  )
}

exports.isAuthenticated = isAuthenticated;
exports.isValid = isValid;