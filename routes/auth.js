const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    //console.log("Headers received:", req.headers); // Debugging
    const authHeader = req.headers['authorization'];
    //console.log("Authorization Header:", authHeader); // Debugging

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: 'Authentication token required' });
    }

    const token = authHeader.split(' ')[1]; // Extract token

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user; // Attach user data
        next();
    });
};

module.exports = authenticateToken;
