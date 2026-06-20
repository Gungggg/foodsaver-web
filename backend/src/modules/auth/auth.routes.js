const express = require('express');

const router = express.Router();

const authenticate = require('../../middleware/authenticate');

const {
    register,
    login,
    profile,
    updateProfile
} = require('./auth.controller');

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authenticate, profile);
router.put('/profile', authenticate, updateProfile);

module.exports = router;