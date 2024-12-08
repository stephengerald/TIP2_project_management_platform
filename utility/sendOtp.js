const nodemailer = require('nodemailer');  
const crypto = require('crypto');  

// Generate a 6-digit (or 3-byte) OTP  
const generateOtp = () => {  
    return crypto.randomBytes(3).toString('hex');  // Creates a 6-character hex string  
};  

// Send OTP to the user via email  
const sendOtp = async (user) => {  
    const otp = generateOtp(); // Generate an OTP using the separate function  
    const otpExpiration = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes  

    user.otp = otp;  
    user.otpExpiration = otpExpiration;  
    await user.save();  

    const transporter = nodemailer.createTransport({  
        service: 'Gmail',  
        auth: {  
            user: process.env.EMAIL,  
            pass: process.env.EMAIL_PASSWORD, 
        },  
    });  

    const mailOptions = {  
        from: process.env.EMAIL,  
        to: user.email,  
        subject: 'Confirmation Code',  
        html: `<html>  
            <body>  
                <h2>Your new OTP is <span style="color: blue; font-weight: bold;">${otp}</span>.</h2>  
                <p>It expires in 10 minutes.</p>  
            </body>  
        </html>`,  
    };  

    await transporter.sendMail(mailOptions);  
    console.log(`OTP has been sent to ${user.email}`);  
};  

module.exports = { generateOtp, sendOtp };


