const express = require('express');

const router = express.Router();

const authenticate = require('../../middleware/authenticate');

const authorizeRole = require('../../middleware/authorizeRole');

const {
    getImpactStats
} = require('./impact.controller');

router.get(
    '/stats',
    authenticate,
    authorizeRole('customer'),
    getImpactStats
);

module.exports = router;