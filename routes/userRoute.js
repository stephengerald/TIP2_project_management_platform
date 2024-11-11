const express = require("express");
const {  logout, updateUser, welcome, registerUser, verifyOTPAndRegister, loginUser, deleteUser, verifyOTP, resendOTP, } = require("../controllers/userCtrl");
const { validateLogin, validateRegistration } = require("../middleware/validations");
const validateToken = require("../middleware/validateAuth");

const router = express.Router();

//Welcome
router.get("/", welcome);
// login router
router.post("/login", validateLogin, loginUser);

//logout route
router.post("/logout", logout);

//user registration router
router.post("/register",registerUser);

//verify Otp
router.post("/verifyOtp", verifyOTP );
//resend OTP
router.post('/resendOtp', resendOTP)

// find user by Id
router.get("/user/:id", validateToken);

// Get all users
router.get("/all-users", validateToken );

//Update user
router.put("/update-user/:id", validateToken, updateUser);

//delete user
router.delete("/delete-users/:id", validateToken, deleteUser);


module.exports = router;