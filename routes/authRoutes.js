// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require("passport");

router.post('/register', authController.register);
router.post('/login',authController.login);
router.get('/logout', authController.logout);
router.get('/checkAuth', authController.checkAuth);

module.exports = router;
