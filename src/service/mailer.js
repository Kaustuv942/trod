
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    maxConnections: 3, 
    pool: true,       
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: 'techstark942@outlook.com',
        pass: 'password@techStark'
    }
});

async function sendMail(params){
    transporter.sendMail({
        from: "techstark942@outlook.com",
        to: params.to,
        // cc: newMail.cc,
        // bcc: newMail.bcc,
        subject: params.subject,
        text: params.text,
        // auth: {
        //     user: user.email,
        //     accessToken: user.accessToken,
        // },
    });
}
module.exports = {
    sendMail
}