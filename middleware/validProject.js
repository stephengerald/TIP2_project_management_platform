const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const Project = require("../models/project")





const validateProjectAdmin =  (accessToken)=>{
    //check if the user is loged in
    return async (req, res, next) =>{
        const accessToken = req.cookies.accessToken
        if (!accessToken) {
            res.status(401).json({
              message: 'Access Denied! please login first!.'
            });
            // check if the accessToken is valid
          } else {
            const decoded = await jwt.verify(accessToken, process.env.ACCESS_TOKEN, function (error, payload) {
              if (error) {
                res.status(401).json({
                  message: 'Invalid Token'
                });
                //check if the user ia an admin
              } else {
                if (payload.role.includes('Admin' || 'admin')) {
                  next();
                } else {
                  res.status(403).json({
                    message: 'You are not Authorisez!.'
                  })
                }
              }
            
            });
          };
        
    }

}

module.exports ={
    validateProjectAdmin
}