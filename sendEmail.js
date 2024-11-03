const nodemailer = require("nodemailer");
const Users = require("./models/userModel")

/*
const sendUserEmail =  async (email, name)=>{
    try {
        // Login Details

        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: `${process.env.Email}`,
                pass: `${process.env.Email_PASSWORD}`
            }
        });

        // Details to send

        const detailsToSend = {
            from: process.env.Email,
            to: userEmail,
            subject: "Your Login Details",
            html: `<div>
                <h1>Hello ${name}</h1>
                <h1>Password: fgjutyrujd</h1>
                <h1>Email: ${Email}</h1>
                <h1>Thanks</h1>
            </div>`
        }

        const result = await mailTransporter.sendMail(detailsToSend)

    } catch (error) {
        console.log(error)
    }
}
*/

const sendUserEmail = async (email, name) => {
    try {
        // Login Details
        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.Email,
                pass: process.env.Email_PASSWORD
            }
        });

        // Details to send
        const detailsToSend = {
            from: process.env.Email,
            to: email,
            subject: "Your Login Details",
            html: `<div>
                <h1>Hello ${name}</h1>
                <h1>Password: fgjutyrujd</h1>
                <h1>Email: ${email}</h1>
                <h1>Thanks</h1>
            </div>`
        };

        const result = await mailTransporter.sendMail(detailsToSend);
        console.log("Email sent successfully:", result);
    } catch (error) {
        console.log("Error sending email:", error);
    }
};

module.exports = sendUserEmail;