// models/User.js  

const mongoose = require('mongoose');  

const userSchema = new mongoose.Schema({  
    email: { type: String, unique: true, required: true },  
    fullname: { type: String, required: true },  
    password: { type: String, required: true },  
    otp: { type: String },  
    otpExpires: { type: Date },  
});  

const User = mongoose.model('User', userSchema);  
 

  
module.exports = User