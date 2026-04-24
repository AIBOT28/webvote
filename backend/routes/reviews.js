const express = require('express');
const { getReviews, createReview, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect, optionalProtect } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalProtect, getReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
