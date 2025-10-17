const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authorizeRoles } = require('../middleware/rbac');

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', authorizeRoles(['ADMIN', 'MANAGER']), courseController.createCourse);

module.exports = router;
