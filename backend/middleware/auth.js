const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Assume Bearer token
        const actualToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET || 'secret_token_123');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
