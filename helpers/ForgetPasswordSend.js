const moment = require('moment');
const {v4: uuid} = require('uuid')
const winston = require('winston');
const scheduler = require('node-schedule');
const config = require('config');
const db = require('../models');
const emailModule = require('../email/nodemailer');

const forgetPassword = db.ForgetPassword;

module.exports = function (url, req, res, id, email, name) {

    let start_time = moment().format('h:mm a');

    let endingformate = moment(start_time, 'h:mm a');
    let end_time = endingformate
        .add(1, 'hour')
        .format('h:mm a');

    let UUID = uuid();

    let forgetPasswordobj = {
        userId: id,
        token: UUID,
        start_time: start_time,
        end_time: end_time
    };

    forgetPassword
        .create(forgetPasswordobj)
        .then(result => res.send({message:"Forget Password email sent"}))

    const mailOptions = {
        from: config.get('Email_env.email'),
        to: email,
        subject: 'Password Reset',
        html: ` <h1>Password Reset Email</h1>
        <br/>
        <h2> Hey, ${name} </h2>
        <p>Forget Password Email : <a href="${config.get("origin")}/api/auth/dynamic_gen_token_key/template/${UUID}">CLICK HERE</a></p>
        <p>If you can't click the link : <a href="${config.get("origin")}/api/auth/dynamic_gen_token_key/template/${UUID}">${config.get("origin")}/api/auth/dynamic_gen_token_key/template/${UUID}</a></p>`
    };

    console.log(mailOptions);

    emailModule
        .sendMail(mailOptions)
        .then(function (response) {
            
            scheduler.scheduleJob("59 * * * *", async () => {
                forgetPassword
                .update({isExpired : true},{where : {token : UUID}})
                .then(result => res.send(result) )
                .catch(err => winston.error(err));
            })
            res.send({message : "Reset password email has been sent"});

        })
        .catch(function (error) {
            winston.error(error)
        });

}