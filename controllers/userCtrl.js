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
const generateAccessToken = require("../utility/generateAccessToken");
const generateRefreshToken = require("../utility/generateRefreshToken");


const welcome = async(req, res) => {
    try {
        return res.status(200).json({ message: "Welcome to project management platform!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};  
//register user
const registerUser = async (req, res) => {  
    const { fullname, email, password, role } = req.body; // Include role in the request body  

    try {  
        const userExists = await User.findOne({ email });  
    try {  
        const userExists = await User.findOne({ email });  

        if (userExists) {  
            return res.status(400).json({ message: 'User already exists' });  
        }  

        // Check if the role is valid   
        if (role && role !== 'user' && role !== 'admin') {  
            return res.status(400).json({ message: 'Invalid role' });  
        }  
        if (userExists) {  
            return res.status(400).json({ message: 'User already exists' });  
        }  

        // Check if the role is valid   
        if (role && role !== 'user' && role !== 'admin') {  
            return res.status(400).json({ message: 'Invalid role' });  
        }  

        // Hash the user's password  
        // Hash the user's password  
        const hashedPassword = await bcrypt.hash(password, 10);  

        // Create the user object  
        const user = new User({  
            fullname,  
            email,  
            password: hashedPassword,  
            role: role || 'user', // default to 'user'  
        });  


        await user.save();  
        await sendOtp(user);  
        await user.save();  
        await sendOtp(user);  

        return res.status(201).json({ message: `Registration successful, OTP has been sent to ${email}` });  
    } catch (error) {  
        return res.status(400).json({ message: error.message });  
    }  
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

    const user = await User.findOne({ email });  
    if (!user) {  
        return res.status(400).json({ message: 'Invalid credentials' });  
    }  

    const isPasswordValid = await bcrypt.compare(password, user.password);  
    if (!isPasswordValid) {  
        return res.status(400).json({ message: 'Invalid credentials' });  
    }  

    const accessToken = generateAccessToken(user)  
    const refreshToken = generateRefreshToken(user);  

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




