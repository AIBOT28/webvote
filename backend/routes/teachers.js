const express = require('express');
const { getTeachers, getTeacher, createTeacher, updateTeacher, deleteTeacher, requestTeacher } = require('../controllers/teacherController');
const { protect, optionalProtect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalProtect, getTeachers);
router.get('/:id', optionalProtect, getTeacher);
router.post('/request', protect, requestTeacher);
router.post('/', protect, authorize('admin', 'manager'), createTeacher);
router.put('/:id', protect, authorize('admin', 'manager'), updateTeacher);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteTeacher);

module.exports = router;
