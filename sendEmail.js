const nodemailer = require("nodemailer")


const sendUserEmail = async (userEmail, firstName, password  )=>{
    
    try {

        // Login Details
    
        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: `${process.env.EMAIL}`,
                pass: `${process.env.EMAIL_PASSWORD}`
            }
        })
        // Details to send
    
        const detailsToSend = {
            from: process.env.EMAIL,
            to: userEmail,
            subject: "WELCOME TO STAN PASTRIES",
            html: `<div>
            <h1>Hello! ${firstName}</h1>  
            <h2>This is a confirmation Email</h2>  
            <h4>Dear ${firstName},</h4> <p> your email address is ${userEmail} and your password is ${password}, you are welcomed</p>  
            <p style="color: blue;">Thanks! We wish to inform you that you have successfully registered on our website.</p>
            </div>`
        }
        const result = await mailTransporter.sendMail(detailsToSend)
    
        
    } catch (error) {
        console.log(error)
    }
}




module.exports = sendUserEmail