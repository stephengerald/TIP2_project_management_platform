const express = require("express");
const { logout, updateUser, registerUser, welcome, loginUser, deleteUser, verifyOtp, getAllUsers, getUserById, resendOtp } = require("../controllers/userCtrl");
const { validateLogin, validateRegistration, validEmail, 
    //validateRegistration 
    } = require("../middleware/validations");
const validateToken = require("../middleware/validateAuth");
const strongPassword = require("../middleware/strongPassword");

const router = express.Router();

//Welcome
router.get("/", welcome);

// login router
router.post("/login", validateLogin, loginUser);

//logout route
router.post("/logout", validateToken, logout);

//user registration router
router.post("/register", strongPassword, validateRegistration, registerUser);

//verify Otp
router.post("/verifyOtp", verifyOtp );

//resend OTP
router.post('/resend-otp', resendOtp);

// find user by Id
router.get("/user/:id", validateToken, getUserById);

// Get all users
router.get("/allusers", validateToken, getAllUsers);

//Update user
router.put("/update-user/:id", validateToken, updateUser);

//delete user
router.delete("/delete-users/:id", validateToken, deleteUser);


module.exports = router;