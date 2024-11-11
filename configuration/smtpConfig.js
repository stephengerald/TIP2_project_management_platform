const nodemailer = require('nodemailer');  
const dotenv = require('dotenv');  

dotenv.config();  

const transporter = nodemailer.createTransport({  
    service: 'gmail',  
    auth: {  
        user: process.env.Email,
        pass: process.env.Email_PASSWORD
    },  
});  


module.exports = transporter;