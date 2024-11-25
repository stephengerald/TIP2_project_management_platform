const express = require("express");
const { logout, updateUser, welcome, registerUser, loginUser, deleteUser, verifyOtp, getAllUsers, getUserById, resendOtp } = require("../controllers/userCtrl");
const { validateLogin, validateRegistration, 
    //validateRegistration 
    } = require("../middleware/validations");
const validateToken = require("../middleware/validateAuth");

const router = express.Router();

//Welcome
router.get("/", welcome);
// login router
router.post("/login", validateLogin, loginUser);

//logout route
router.post("/logout", logout);

//user registration router
router.post("/register", validateRegistration, registerUser);

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