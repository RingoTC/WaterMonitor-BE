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

router.post('/change/:username', async (req, res) => {
    const username = req.params.username;
    const updatedUserInfo = req.body.newSkill;
    // console.log(req.body);
    try {
        const updatedUser = await User.findOne({ username: username });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found for updating' });
        }

        if (updatedUserInfo) {
            // console.log("Updated user info is " + updatedUserInfo);

            const skillDocument = {
                name: updatedUserInfo.name,
                proficiency: updatedUserInfo.proficiency,
                certified: updatedUserInfo.certified,
                certificationIssueDate: updatedUserInfo.issueDate || null,
                certificationExpiryDate: updatedUserInfo.expirationDate || null,
            };
            updatedUser.skills.push(skillDocument);
            // console.log("Updated skill is " + updatedUser.skills);

        }

        const savedUser = await updatedUser.save();

        // console.log("Saved user skill is " + savedUser.skills);

        return res.json(savedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.delete('/change/:username/skills/:skillId', async (req, res) => {
    const { username, skillId } = req.params;
    try {

        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.skills = user.skills.filter(skill => skill._id.toString() !== skillId);

        const updatedUser = await user.save();

        return res.json(updatedUser);
    } catch (error) {
        console.error('Error deleting skill:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put('/change/:username/skills/:skillId', async (req, res) => {
    const { username, skillId } = req.params;
    const updatedSkillData = {
        ...req.body,
        certificationIssueDate: req.body.issueDate ? new Date(req.body.issueDate ) : null,
        certificationExpiryDate: req.body.expirationDate ? new Date(req.body.expirationDate) : null,
    };

    // console.log(updatedSkillData);
    try {
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const skillIndex = user.skills.findIndex(skill => skill._id.toString() === skillId);

        if (skillIndex === -1) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        user.skills[skillIndex].set(updatedSkillData);
        user.markModified('skills');

        const updatedUser = await user.save();

        return res.json(updatedUser);
    } catch (error) {
        console.error('Error updating skill:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});



module.exports = router;
