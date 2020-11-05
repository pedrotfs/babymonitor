const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcome = (email) => {
    sgMail.send({
        to: email,
        from: "staff@babymon.com",
        subject: "Welcome!",
        text: "Welcome to the app, " + email + ". feedback is appreciated!"
    })
}

const sendGoodbye = (email) => {
    sgMail.send({
        to: email,
        from: "staff@babymon.com",
        subject: "Goodbye!",
        text: "Hey, "+ email + ", we will miss you!"
    })
}

module.exports = {
    sendWelcome,
    sendGoodbye
}