const winston = require('winston');
const db = require('../models');
const emailverification = db.Emailverification;
const users = db.users;
module.exports = async function (token, res) {
    emailverification
        .findOne({
            raw: true,
            where: {
                token: token
            }
        })
        .then((result) => {
            if (result) {
                if (result.isExpired == false) {
                    emailverification
                        .update({ isExpired: true }, { where: { token: token } })
                        .then(response => res.send(response))
                        .catch(err => winston.error(err.message))
                    users
                        .update({ emailVerified: true }, { where: { id: result.userId } })
                        .then(response => res.send({ message: "Verified" }))
                        .catch(err => winston.error(err.message))

                    emailverification
                        .destroy({ where: { id: result.id } })
                        .then(response => res.send({ message: "Verified" }))
                        .catch(err => winston.error(err.message))
                } 
                else {
                    emailverification
                        .destroy({ where: { id: result.id } })
                        .then(response => res.send(response))
                        .catch(err => winston.error(err.message))
                }
            }
        })
        .catch(err => winston.error(err.message))
}