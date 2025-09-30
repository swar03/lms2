const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');

router.get('/', moduleController.getAllModules); // no parentheses!

module.exports = router;
