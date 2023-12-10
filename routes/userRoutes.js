// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { default: axios } = require('axios');

router.get('/all', async (req, res) => {
    try {
        const users = await User.find();
        return res.json(users);
    } catch (error) {
        console.error('Error querying MongoDB:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json(user);
    } catch (error) {
        console.error('Error querying MongoDB:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/add', async (req, res) => {
    // different from auth.register, its only for admin to add user
    const { username, password, first_name, last_name, email, role } = req.body;

    try {
        const existingUser = await User.findOne({ username: username });

        if (existingUser) {
            return res.status(400).json({ message: 'User with the same username already exists' });
        }

        const newUser = new User({ username, password, first_name, last_name, email, role });
        await newUser.save();

        return res.json({ message: 'User added successfully' });
    } catch (error) {
        console.error('Error adding user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.delete('/delete/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const deletedUser = await User.findOneAndDelete({ username: username });

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found for deletion' });
        }

        return res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put('/change/:username', async (req, res) => {
    const username = req.params.username;
    const updatedUserInfo = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate({ username: username }, updatedUserInfo, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found for updating' });
        }

        return res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
