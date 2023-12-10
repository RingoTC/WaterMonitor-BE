// controllers/authController.js

const bcrypt = require('bcryptjs');
const User = require('../models/user');
const passport = require('passport');

exports.register = (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        const newUser = new User({
            username: username,
            password: hashedPassword,
        });
        newUser.save()
            .then((user) => {
                res.send('User registered successfully');
            })
            .catch((err) => {
                res.status(500).send('Error saving user');
            });

    });
};

exports.login = (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        try {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(401).json({ status: 'error', code: 'Authentication failed' });
            }

            // Log in the user
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }

                return res.json({ status: 'success', message: 'Authentication successful', user: user });
            });
        } catch (error) {
            next(error);
        }
    })(req, res, next);
};


exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
    });
    res.send('Logged out successfully');
};

exports.checkAuth = (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Authenticated');
    } else {
        res.send('Not authenticated');
    }
};