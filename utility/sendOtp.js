const nodemailer = require('nodemailer');
const crypto = require('crypto');

const sendOtp = async (user) => {
    const otp = crypto.randomBytes(3).toString('hex');
    const otpExpiration = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.Email_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Confirmation Code',  
        text: `Your OTP is ${otp}. It expires in 5 minutes`
    };

    await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully');
};

module.exports = sendOtp;
