const express = require('express');
const router = express.Router();
const lectureController = require('../controllers/lectureController');
router.get('/', lectureController.getAllLectures);
module.exports = router;
