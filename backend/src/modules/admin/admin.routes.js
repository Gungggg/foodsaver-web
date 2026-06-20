const express = require('express');

const router = express.Router();

const authenticate = require('../../middleware/authenticate');

const authorizeRole = require('../../middleware/authorizeRole');

const {
    getAllMerchants,
    verifyMerchant,
    getDashboardAnalytics
} = require('./admin.controller');

router.get(
    '/merchants',
    authenticate,
    authorizeRole('admin'),
    getAllMerchants
);

router.get(
    '/dashboard',
    authenticate,
    authorizeRole('admin'),
    getDashboardAnalytics
);

router.patch(
    '/merchants/:id/verify',
    authenticate,
    authorizeRole('admin'),
    verifyMerchant
);

module.exports = router;