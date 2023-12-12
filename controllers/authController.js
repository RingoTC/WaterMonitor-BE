// controllers/authController.js

const bcrypt = require('bcryptjs');
const User = require('../models/user');
const passport = require('passport');

exports.register = (req, res) => {
    const {
        username,
        password,
        firstName,
        lastName,
        email,
        role,
        company,
        cellphone,
        city,
        country,
        like
    } = req.body;

    // Check if the username already exists in the database
    User.findOne({ username: username })
        .then(existingUser => {
            if (existingUser) {
                // If username already exists, send an error response
                return res.status(400).send('Username already exists');
            }

            // If username doesn't exist, hash the password and save the new user
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).send('Error hashing password');
                }

                const newUser = new User({
                    username: username,
                    password: hashedPassword,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    role: role,
                    company: company,
                    cellphone: cellphone,
                    city: city,
                    country: country,
                    like: like
                });

                newUser.save()
                    .then((user) => {
                        res.send('User registered successfully');
                    })
                    .catch((err) => {
                        res.status(500).send('Error saving user');
                    });
            });
        })
        .catch(err => {
            res.status(500).send('Error checking for existing user');
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