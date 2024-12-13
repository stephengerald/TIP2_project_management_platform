// models/User.js  
/*
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
*/

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({  
    fullname: { type: String, required: true },  
    email: { type: String, required: true, unique: true },  
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },  
    otp: { type: String },  
    otpExpiration: { type: Date },  
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Add role field with default value 
   
});


const User = mongoose.model('User', userSchema);

module.exports = User;
