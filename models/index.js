const Sequelize = require("sequelize");
const dbConfig = require("../config/db.config.js");
const { UsersModel } = require("./user.model");
const { Emailverification } = require("./emailVerification.model");
const { ForgetPassword } = require("./forgetPassword.model");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = UsersModel(sequelize, Sequelize);
db.ForgetPassword = ForgetPassword(sequelize, Sequelize);
db.Emailverification = Emailverification(sequelize, Sequelize);

module.exports = db;
