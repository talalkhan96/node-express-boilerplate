const _ = require("lodash");
const fs = require("fs");
const bcrypt = require("bcrypt");
const config = require("config");
const randomstring = require("crypto-random-string");
const db = require("../../models");
const { validateUser } = require("../../models/user.model");
const Emailverification = require("../../helpers/Emailverification");
const sendVerificationEmail = require("../../helpers/EmailverificationSend");

const Users = db.users;

class User {
  create = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.send(error.details[0].message);
    Users.findOne({
      where: [
        {
          email: req.body.email,
        },
        {
          emailVerified: true,
        },
      ],
    })
      .then(async (result) => {
        if (result && result.dataValues.emailVerified) {
          res.status(200).send({ message: "User Already Exist!." });
        }
        else {
          const customUser = _.pick(req.body, [
            "userName",
            "email",
            "password"
          ]);
          const foundUserName = await Users.findOne({
            where: { userName: customUser.userName },
          });
          if (
            foundUserName &&
            foundUserName.dataValues.userName == customUser.userName
            )
            return res
            .status(400)
            .send({ message: "This username is already taken." });
            
            const salt = await bcrypt.genSalt(10);
            customUser.password = await bcrypt.hash(customUser.password, salt);

          Users.create(customUser)
            .then((data) => {
              res.send({ message: "Created Successfully", data });
              sendVerificationEmail(
                req,
                res,
                data.dataValues.id,
                data.dataValues.email,
                data.dataValues.userName
              );
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while creating the User.",
              });
            });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User.",
        });
      });
  };

  getAllCustomer = async (req, res) => {
    try {
      let users = await Users.findAll({
        raw: true
      });
      return res.send({ data: users });
    } catch (err) {
      return res
        .status(500)
        .send({ message: err.message || "Something Went Wrong!" });
    }
  };

  verifyEmail = (req, res) => {
    const token = req.params.token;
    Emailverification(token, res)
      .then((res) => res)
      .catch((err) => console.log(err));
    console.log(token);
  };
}

module.exports = User;
