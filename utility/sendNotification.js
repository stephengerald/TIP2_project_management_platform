const nodemailer = require('nodemailer'); 




// Function to send email notifications  
const sendEmailNotification = async (email, projectTitle) => {  
     
    const transporter = nodemailer.createTransport({  
      service: 'Gmail', 
      auth: {  
        user: process.env.EMAIL,  
        pass: process.env.EMAIL_PASSWORD,   
      },  
    });  
  
    const mailOptions = {  
      from: process.env.EMAIL, 
      to: email,
      subject: `New Project Assigned: ${projectTitle}`,  
      html: `<html>  
            <body>  
                <h3>You have been assigned to a new project: ${projectTitle}. Please check your dashboard for details.</h3>  
            </body>  
        </html>`,  
      
    };  
  
    // Send the email  
    await transporter.sendMail(mailOptions);  
  };

  module.exports = {sendEmailNotification}