const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Project = require("../models/project");

const validateProjectAdmin = () => {
  // Middleware to check if the user is logged in and an admin
  return async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({
        message: 'Access Denied! Please login first!'
      });
    }

    try {
      // Verify the token
      const decoded = await jwt.verify(accessToken, process.env.ACCESS_TOKEN);
      // Check if the user is an admin
      if (decoded.role.includes('Admin') || decoded.role.includes('admin')) {
        next();
      } else {
        return res.status(403).json({
          message: 'You are not authorized!'
        });
      }
    } catch (error) {
      return res.status(401).json({
        message: 'Invalid Token'
      });
    }
  }
}

module.exports = {
  validateProjectAdmin
};