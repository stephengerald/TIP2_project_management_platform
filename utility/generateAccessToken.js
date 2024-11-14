const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign(
        { email: user.email, id: user._id },
        process.env.ACCESS_TOKEN,
        { expiresIn: '1h' }
    );
};

module.exports = generateAccessToken