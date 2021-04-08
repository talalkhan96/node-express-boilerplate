const scheduler = require('node-schedule');
const moment = require('moment');
const config = require('config');
const { v4: uuid } = require('uuid')
const db = require('../models');
const emailverification = db.Emailverification;
const emailModule = require('../email/nodemailer');

module.exports = async function (req, res, id, email, name) {
    let start_time = moment().format('h:mm a');

    let endingformate = moment(start_time, 'h:mm a');
    let end_time = endingformate
        .add(1, 'hour')
        .format('h:mm a');

    let UUID = uuid();

    let emailverificationobj = {
        userId: id,
        token: UUID,
        start_time: start_time,
        end_time: end_time
    };

    let emailsend = await emailverification
        .create(emailverificationobj)

    if (emailsend) {
        console.log("Email Sent");
    } else {
        console.log("Not Sent");
    }

    const mailOptions = {
        from: config.get('Email_env.email'),
        to: email,
        subject: 'Email Verifiction',
        html: ` <h1>Confirm Your Email</h1>
        <br/>
        <h2> Hey, ${name} </h2>
        <p>Confirm Your Email :  <a href="${config.get("origin")}/api/user/verifyEmail/${UUID}">CLICK HERE</a></p>
        <p>If you can't click the link: <a href="${config.get("origin")}/api/user/verifyEmail/${UUID}">${config.get("origin")}/api/user/verifyEmail/${UUID}</a></p>`
    };

    let sendEmail = await emailModule
        .sendMail(mailOptions)

    if (sendEmail) {

        scheduler.scheduleJob("1 * * * *", async () => {
            try {
                await emailverification
                    .update({ isExpired: true }, { where: { token: UUID } })
            } catch (error) {
                console.log(error);
            }
        });

    } else {
        console.log("Error");
    }

}