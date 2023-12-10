exports.dashboard = (req, res) => {
    res.send(`Welcome, ${req.user.username}!`);
};
