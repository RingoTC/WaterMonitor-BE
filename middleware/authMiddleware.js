// middleware/authMiddleware.js

exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log("isAuthenticated");
        return next();
    } else {
        console.log("isAuthenticated error");
        return res.status(401).json({ status: 'error', code: 'Authentication required' });
    }
};

exports.isAuthorizedUser = (req, res, next) => {
    const requestedUsername = req.params.username;
    if (req.user && req.user.username === requestedUsername) {
        console.log("isAuthorizedUser");
        return next();
    } else {
        console.log("isAuthorizedUser error");
        return res.status(403).json({ status: 'error', code: 'Forbidden' });
    }
};

exports.isAdmin = (req, res, next) => {
    // 检查用户是否是管理员
    if (req.isAuthenticated() && req.user.role === 'ADMIN') {
        return next();
    } else {
        return res.status(403).json({ status: 'error', code: 'Forbidden' });
    }
};
