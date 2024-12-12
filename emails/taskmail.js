const nodemailer = require('nodemailer');

const sendTaskEmail = (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service provider
        auth: {
            user: process.env.EMAIL, // Your email address
            pass: process.env.EMAIL_PASSWORD // Your email password
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = sendTaskEmail;

