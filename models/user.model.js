const Joi = require("joi");

function UsersModel(sequelize, Sequelize) {
  const Userschema = {
    userName: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    emailVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  };

  const Users = sequelize.define("users", Userschema);
  return Users;
}

exports.UsersModel = UsersModel;

function validateUser(User) {
  const schema = {
    userName: Joi.string().required(),
    email: Joi.string().required().min(10).max(255).email(),
    password: Joi.string().required().min(6).max(255)
  };
  return Joi.validate(User, schema);
}

exports.validateUser = validateUser;