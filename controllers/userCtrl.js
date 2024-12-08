const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const sendOtp = require("../utility/sendOtp");
const sendUserEmail = require("../sendEmail");
const mongoose = require("mongoose");
const express = require("express");
const nodemailer = require("nodemailer");
const pdfkit = require("pdfkit");
const fs = require('fs');
const cookieParser = require("cookie-parser");
const transporter = require('../configuration/smtpConfig');    
const generateAccessToken = require("../utility/generateAccessToken");
const generateRefreshToken = require("../utility/generateRefreshToken");
const { generateOtp, sendOtp } = require("../utility/sendOtp")

const welcome = async(req, res) => {
    try {
        return res.status(200).json({ message: "Welcome to project management platform!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};  

// Register user  
const registerUser = async (req, res) => {  
    const { fullname, email, password, role } = req.body;  

    try {  
        // Check if the user already exists  
        const userExists = await User.findOne({ email });  

        if (userExists) {  
            return res.status(400).json({ message: 'User already exists' });  
        }  

        // Validate the role  
        if (role && role !== 'user' && role !== 'admin') {  
            return res.status(400).json({ message: 'Invalid role' });  
        }  

        // Hash the user's password  
        const hashedPassword = await bcrypt.hash(password, 10);  

        // Create the user object without OTP initially  
        const user = new User({  
            fullname,  
            email,  
            password: hashedPassword,  
            role: role || 'user', // default to 'user'  
        });  

        // Save the user to the database  
        await user.save(); // Now save the user before generating/sending OTP  

        // Generate OTP and set expiration  
        const otp = generateOtp(); // Call the function to generate a new OTP  
        const otpExpiration = Date.now() + 300000; // OTP valid for 5 minutes   

        // Update user with OTP and its expiration  
        user.otp = otp;  
        user.otpExpiration = otpExpiration;  
        await user.save(); // Save user again to update with OTP and expiration  

        // Send OTP to the user  
        await sendOtp(user); // Pass the user object  

        return res.status(201).json({ message: `Registration successful, OTP has been sent to ${email}` });  
    } catch (error) {  
        return res.status(400).json({ message: error.message });  
    }  
};   

//verify otp
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });  
        if (!user) return res.status(400).send('User not found.');  

        // Check if OTP is correct and hasn't expired  
        if (user.otp !== otp || Date.now() > user.otpExpiration) {  
            return res.status(400).send('Invalid or expired OTP.');  
        }  
        user.verified = true;
        user.otp = undefined;
        user.otpExpiration = undefined;
        await user.save();

        // Generate JWT tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return res.status(200).json({ message: 'OTP verified successfully, account activated', accessToken, refreshToken });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
//resend otp
const resendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Send new OTP
        await generateOtp()
        await sendOtp(user);

        return res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
//update users information
const updateUser = async (req, res) => {
    const { fullname, email, password, role } = req.body;

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
        const user = await User.find().select('-password'); // Exclude password field
        console.log(`Users found: ${user.length}`);
        return res.status(200).json({
            message: "successful",
            count: user.length,
            all_users: user,
        });
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

//login users
const loginUser = async (req, res) => {  
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });  
        if (!user) return res.status(400).send('Invalid credentials.');  

        // Check verification  
        if (!user.verified) {  
            return res.status(403).send('Please verify your account.');  
        }  

        // Check password  
        const isMatch = await bcrypt.compare(password, user.password);  
        if (!isMatch) return res.status(400).send('Invalid password.');  

        const accessToken = generateAccessToken(user)  
        const refreshToken = generateRefreshToken(user);
        
        // Login successful  
        res.send({message: 'Login successful', access_token: accessToken, refresh_token: refreshToken} );
    } catch (error) {
        res.status(400).send(error.message);
    } 
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

//logout users
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