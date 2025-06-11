const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    

    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Access denied' });

    const token = authHeader.split(' ')[1]; 
    if (!token) return res.status(401).json({ message: 'Access denied' });
console.log('Authorization Header:', authHeader);
console.log('Extracted Token:', token);
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token' });
    }
}

function verifyAdmin(req, res, next) {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
}

module.exports = {
    authMiddleware,
    verifyAdmin
};
