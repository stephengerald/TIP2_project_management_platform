const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendOtp = require("../utility/sendOtp");
const sendUserEmail = require("../sendEmail");
const mongoose = require("mongoose");
const express = require("express");
const nodemailer = require("nodemailer");
const pdfkit = require("pdfkit");
const fs = require('fs');
const cookieParser = require("cookie-parser");
const transporter = require('../configuration/smtpConfig');
const TemporaryUser = require('../models/tempuser'); // Make sure the path is correct    

const welcome = async(req, res) => {
    try {
        return res.status(200).json({ message: "Welcome to project management platform!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// in your controller file
/* 
const generateOTP = () => {  
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP  
};  
//endpoint to register user with email first
const registerUser = async (req, res) => {  
    const { email } = req.body;  

    // Check if an OTP has already been sent  
    const existingTempUser = await TemporaryUser.findOne({ email });  
    if (existingTempUser) {  
        return res.status(400).json({ message: 'An OTP has already been sent to this email.' });  
    }  

    const otp = generateOTP();  
    const otpExpires = Date.now() + 300000; // 5 minutes expiration  

    const tempUser = new TemporaryUser({ email, otp, otpExpires });  
    await tempUser.save();  

    // Send OTP via email  
    await transporter.sendMail({  
        to: email,  
        subject: 'Confirmation Code',  
        text: `Your OTP is ${otp}. It expires in 5 minutes.`,  
    });  

    res.status(200).json({ message: `OTP has been sent to ${email}` });  
};

// Resend OTP endpoint  
const resendOTP = async (req, res) => {  
    const { email } = req.body;  

    // Check for existing temporary user  
    let existingTempUser = await TemporaryUser.findOne({ email });  

    // Generate a new OTP  
    const otp = generateOTP();  
    const otpExpires = Date.now() + 300000; // 5 minutes expiration  

    if (existingTempUser) {  
        // If user exists, update the existing user with new OTP and expiration time  
        existingTempUser.otp = otp;  
        existingTempUser.otpExpires = otpExpires;  
        await existingTempUser.save();  
    } else {  
        // If no existing user, create a new one  
        existingTempUser = new TemporaryUser({ email, otp, otpExpires });  
        await existingTempUser.save();  
    }  

    // Send OTP via email  
    try {  
        await transporter.sendMail({  
            to: email,  
            subject: 'Confirmation Code',  
            html: `  
                <html>  
                    <body>  
                        <p>Your new OTP is <span style="color: blue; font-weight: bold;">${otp}</span>.</p>  
                        <p>It expires in 5 minutes.</p>  
                    </body>  
                </html>  
            `,  
        });
        res.status(200).json({ message: `OTP has been sent to ${email}` });  
    } catch (error) {  
        console.error('Error sending email:', error);  
        return res.status(500).json({ message: 'Error sending OTP, please try again.' });  
    }  
};  
//verifyOtp endpoint
const verifyOTP = async (req, res) => {  
    const { email, otp } = req.body;  

    try {  
        // Find the user by email  
        const user = await TemporaryUser.findOne({ email });  
        
        // Check if user exists and if the OTP is valid and not expired  
        if (!user || user.otp !== otp || Date.now() > user.otpExpires) {  
            return res.status(400).json({ message: 'Invalid or expired OTP' });  
        }  

        // Optionally clear OTP to prevent reuse without clearing the requirement for expiration  
        user.otp = undefined; // Clear OTP to prevent reuse  
        
        // You could either leave otpExpires as is  
        // or set to a default value or a final expiry value if using in your process.  
        // user.otpExpires = new Date(); // Set to current time if needed, for clarity  
        await user.save();  

        res.status(200).json({ message: 'OTP verified! Please provide your full name and password' });  
    } catch (error) {  
        console.error('Error verifying OTP:', error);  
        return res.status(500).json({ message: 'Internal server error' });  
    }  
};
//endpoint to complete the registration with fullname and password
const completeRegistration = async (req, res) => {  
    const { email, fullname, password } = req.body;  

    try {  
        // Check if the user already exists  
        const existingUser = await User.findOne({ email });  
        if (existingUser) {  
            return res.status(400).json({ message: 'User already exists' });  
        }  

        // Hash the user's password  
        const hashedPassword = await bcrypt.hash(password, 10);  

        // Create a new user instance  
        const newUser = new User({  
            email,  
            fullname,  
            password: hashedPassword  
        });  

        // Save the new user  
        await newUser.save();  

        // Create access and refresh tokens  
        const accessToken = jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });  
        const refreshToken = jwt.sign({ id: newUser._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });  

        res.status(201).json({ accessToken, refreshToken });  
    } catch (error) {  
        console.error('Registration error:', error);  
        res.status(500).json({ message: 'Server error' });  
    }  
};  
*/
/*
const updateUser = async (req, res) => {  
    const { accessToken, fullname, email, password } = req.body; 
    try {    
        // Find user by ID  
        const user = await User.findById(userId);  
        if (!user) {  
            return res.status(404).json({ message: 'User not found' });  
        }  

        // Update user details  
        if (fullname) user.fullname = fullname;  
        if (email) user.email = email;  
        if (password) {  
            // Hash the new password before saving  
            const hashedPassword = await bcrypt.hash(password, 10);  
            user.password = hashedPassword;  
        }  
        
        await user.save();  

        res.status(200).json({ message: 'Successful' });  
    } catch (error) {  
        console.error(`Update user error: ${error.message}`);  
        return res.status(401).json({ message: 'Invalid or expired token' });  
    }  
};  
*/
const loginUser = async (req, res) => {  
    const { email, password } = req.body;  

    const user = await User.findOne({ email });  
    if (!user) {  
        return res.status(400).json({ message: 'Invalid credentials' });  
    }  

    const isPasswordValid = await bcrypt.compare(password, user.password);  
    if (!isPasswordValid) {  
        return res.status(400).json({ message: 'Invalid credentials' });  
    }  

    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, { expiresIn: '1h' });  
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN, { expiresIn: '7d' });  

    return res.status(200).json({ message: "Successful", access_token: accessToken, refresh_token: refreshToken });  
};

// DELETE request to delete a user by ID  
//app.delete('/user/:id', 
const deleteUser = async (req, res) => {  
    const userId = req.params.id;  // Get the user ID from the URL parameters  

    try {  
        // Find and delete the user  
        const user = await User.findByIdAndDelete(userId);  
        
        if (!user) {  
            return res.status(404).json({ message: 'User not found' });  
        }  

        res.status(200).json({ message: 'User deleted successfully' });  
    } catch (error) {  
        console.error(`Delete user error: ${error.message}`);  
        res.status(500).json({ message: 'Internal server error' });  
    }  
};  

// An array to store blacklisted refresh tokens   
let refreshTokenBlacklist = [];   

const logout = async (req, res) => {  
    const { refreshToken } = req.body;  

    try {  
        // Check if the refresh token is provided  
        if (!refreshToken) {  
            return res.status(400).json({ message: 'Refresh token is required' });  
        }  

        // Invalidate the refresh token by adding it to the blacklist  
        refreshTokenBlacklist.push(refreshToken);  

        //  remove the refresh token from the database 

        // Respond with a success message  
        return res.status(200).json({ message: 'Logged out successfully' });  
    } catch (error) {  
        // Handle unexpected errors  
        console.error(`Logout error: ${error.message}`);  
        return res.status(500).json({ message: 'Internal Server Error' });  
    }  
};
/*
module.exports = {  
        //registerUser,  
        //verifyOTP,  
        //completeRegistration,
        //generateOTP,
        //updateUser,
        loginUser,
        deleteUser,
        welcome,
        logout,
        //resendOTP
    };
*/

// // User Schema  
// const UserSchema = new mongoose.Schema({  
//     googleId: String,  
//     username: String,  
//     thumbnail: String,  
// });  

// const User = mongoose.model('User', UserSchema);  

// // Middleware for cookie session  
// app.use(cookieSession({  
//     maxAge: 24 * 60 * 60 * 1000, // 24 hours  
//     keys: [process.env.COOKIE_SECRET],
// }));  

// // Initialize Passport  
// app.use(passport.initialize());  
// app.use(passport.session());  

// // Google Strategy  
// passport.use(new GoogleStrategy({  
//     clientID: 'YOUR_GOOGLE_CLIENT_ID',  
//     clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',  
//     callbackURL: '/auth/google/callback',  
// }, async (accessToken, refreshToken, profile, done) => {  
//     const existingUser = await User.findOne({ googleId: profile.id });  
//     if (existingUser) {  
//         return done(null, existingUser); // User already exists  
//     }  

//     // If user doesn't exist, create a new one  
//     const newUser = await new User({  
//         googleId: profile.id,  
//         username: profile.displayName,  
//         thumbnail: profile._json.picture,  
//     }).save();  
//     done(null, newUser);  
// }));  

// // Serialize user to session  
// passport.serializeUser((user, done) => {  
//     done(null, user.id);  
// });  

// // Deserialize user from session  
// passport.deserializeUser((id, done) => {  
//     User.findById(id).then(user => {  
//         done(null, user);  
//     });  
// });  

// // Routes  
// app.get('/auth/google', passport.authenticate('google', {  
//     scope: ['profile', 'email'],  
// }));  

// app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {  
//     // Successful authentication; redirect to a secure area or home page  
//     res.redirect('/dashboard'); // Change to your route  
// });  

// // Dashboard Example Route  
// app.get('/dashboard', (req, res) => {  
//     if (!req.user) {  
//         return res.status(401).send('You are not authenticated');  
//     }  
//     res.send(`<h1>Welcome ${req.user.username}</h1><img src="${req.user.thumbnail}" alt="User Thumbnail"/>`);  
// });  

// // Logout Route  
// app.get('/logout', (req, res) => {  
//     req.logout();  
//     res.redirect('/'); // Change to your route  
// });  







const registerUser = async (req, res) => {
    const { fullname, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

         // Hash the user's password  
        const hashedPassword = await bcrypt.hash(password, 10);  

        // Create the user object
        const user = new User({
            fullname,
            email,
            password: hashedPassword
        });

        await user.save();
        await sendOtp(user);

        return res.status(201).json({ message: `Registration successful, OTP sent to your ${email}` });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.otp !== otp || user.otpExpiration < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.otp = undefined;
        user.otpExpiration = undefined;
        await user.save();

        // Generate JWT tokens
        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, { expiresIn: '1h' });  
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN, { expiresIn: '7d' });

        return res.status(200).json({ message: 'OTP verified successfully, account activated', accessToken, refreshToken });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const resendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Send new OTP
        await sendOtp(user);

        return res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    const { fullname, email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user details
        if (fullname) user.fullname = fullname;
        if (password) {
            // Hash the new password before saving
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(`Update user error: ${error.message}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({ message: "successful", all_users: users, count: users.length });
    } catch (error) {
        console.error(`Get all users error: ${error.message}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(`Get user by ID error: ${error.message}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
};





module.exports = {
    registerUser,
    verifyOtp,
    resendOtp,
    updateUser,
    loginUser,
    deleteUser,
    welcome,
    logout,
    getAllUsers,
    getUserById
};




