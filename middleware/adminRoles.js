//roleMiddleware

const validateToken = require('./validateAuth');  

const requireAdminRole = async (req, res, next) => {  
    try {  
        // Call the validateToken middleware to verify the token and get the user  
        //await validateToken(req, res, next);  
        
        const user = req.user; // Assuming validateToken sets req.user  

        // Check if the user exists and if they have the 'admin' role  
        if (!user || user.role !== 'admin') {  
            return res.status(403).json({ message: 'Access denied. Admins only.' });  
        }  

        next(); // Proceed to the next middleware or route handler  

    } catch (error) {  
        // You might want to differentiate between error types for better feedback.  
        return res.status(401).json({ message: 'Invalid token or unauthorized.' });  
    }  
};  

module.exports = requireAdminRole;