// models/TemporaryUser.js  

const mongoose = require('mongoose');  

const temporaryUserSchema = new mongoose.Schema({  
    email: { type: String, required: true, unique: true },  
    otp: { type: String, required: true },  
    otpExpires: { type: Date, required: true },  
}, { timestamps: true });  

const TemporaryUser = mongoose.model('TemporaryUser', temporaryUserSchema);  
module.exports = TemporaryUser; 