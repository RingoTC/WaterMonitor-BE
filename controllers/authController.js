// controllers/authController.js

const bcrypt = require('bcryptjs');
const User = require('../models/user');
const passport = require('passport');

// exports.register = (req, res) => {
//     const { username, password, company, firstName, lastName, email, cellphone,
//         city, country, role, likes } = req.body;
//     bcrypt.hash(password, 10, (err, hashedPassword) => {
//         const newUser = new User({
//             username: username,
//             password: hashedPassword,
//             company:company, 
//             firstName:firstName, 
//             lastName:lastName, 
//             email:email, 
//             cellphone:cellphone,
//             city:city, 
//             country:country, 
//             role:role, 
//             likes:likes,
//         });
//         newUser.save()
//             .then((user) => {
//                 res.send(newUser);
//             })
//             .catch((err) => {
//                 res.status(500).send('Error saving user');
//             });

//     });
// };

exports.register = (req, res) => {
    const { username, password, company, firstName, lastName, email, cellphone,
        city, country, role, likes } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            // Handle the error if password hashing fails
            return res.status(500).send('Error hashing the password');
        }

        // Create a new user instance
        const newUser = new User({
            username,
            password: hashedPassword,
            company, 
            firstName, 
            lastName, 
            email, 
            cellphone,
            city, 
            country, 
            role, 
            likes,
        });

        // Save the new user to the database
        newUser.save()
            .then((user) => {
                // Send the user data back as a response (excluding sensitive data)
                res.send({ ...user._doc, password: undefined });
            })
            .catch((err) => {
                // Handle errors during user saving (like duplicate entries, validation errors, etc.)
                res.status(500).send('Error saving user. Details: ' + err.message);
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