
const strongPassword = (req, res, next) => {
    const { password } = req.body;

    // Define password strength criteria
    const minLength = 8;
    const uppercasePattern = /[A-Z]/;
    const lowercasePattern = /[a-z]/;
    const numberPattern = /[0-9]/;
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;

    const errors = [];

    if (password.length < minLength) {
        errors.push(`Password must be at least ${minLength} characters long.`);
    }
    if (!uppercasePattern.test(password)) {
        errors.push("Password must contain at least one uppercase letter.");
    }
    if (!lowercasePattern.test(password)) {
        errors.push("Password must contain at least one lowercase letter.");
    }
    if (!numberPattern.test(password)) {
        errors.push("Password must contain at least one number.");
    }
    if (!specialCharPattern.test(password)) {
        errors.push("Password must contain at least one special character.");
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: "Password does not meet strength requirements.", errors });
    }

    next();
};

module.exports = strongPassword;
