const jwt = require("jsonwebtoken")
const User = require("../models/userModel")


const validateToken = async(req, res, next)=>{

    try {

        const tk = req.header("Authorization")

        if(!tk){
            return res.status(401).json({message: "Access Denied!"})
        }

        const tkk = tk.split(" ")
    
        const token = tkk[1]
    
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)

        console.log({decoded})

        if(!decoded){
            return res.status(401).json({message: "Invalid Login details"})
        }

        const user = await User.findOne({email: decoded.email})

        if(!user){
            return res.status(404).json({message: "User account not found!"})
        }
    
        req.user = user

        next()

        
    } catch (error) {
        return res.status(500).json({message: "Session expired"})
    }



}

module.exports = validateToken;