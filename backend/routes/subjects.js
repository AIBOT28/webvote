const express = require('express');
const { getSubjects, getSubject, createSubject, updateSubject, deleteSubject } = require('../controllers/subjectController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getSubjects);
router.get('/:id', getSubject);
router.post('/', protect, authorize('admin', 'manager'), createSubject);
router.put('/:id', protect, authorize('admin', 'manager'), updateSubject);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteSubject);

module.exports = router;
