const moment = require('moment');
const db = require('../models');
const ForgetPassword = db.ForgetPassword;
const path = require('path');
const winston = require('winston');

module.exports = async function (token, res) {
    ForgetPassword
        .findOne({
            where: {
                token: token
            }
        }).then((result) => {

            if (result) {

                if (result.isExpired == false) {
                    return res.sendFile(path.join(__dirname, "../public/ForgetPassword.html"));
                } else {
                    res.render(path.join(ROOTPATH, "views/error/500.ejs"), { error: "ERROR: Token Expired" });
                    ForgetPassword
                        .destroy({ where: { id: result.id } })
                        .then(response => winston.info(response))
                        .catch(err => winston.error(err.message))
                }
            } else {
                res.render(path.join(ROOTPATH, "views/error/500.ejs"), { error: "ERROR: Token Expired" });
                ForgetPassword
                    .destroy({ where: { id: result.id } })
                    .then(response => winston.info(response))
                    .catch(err => winston.error(err.message))
            }
        }).catch(err => winston.error(err.message));
}