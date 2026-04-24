const Review = require('../models/Review');
const { checkContent } = require('../utils/moderation');

// @desc    Get reviews for a teacher
// @route   GET /api/reviews?teacher=xxx
const getReviews = async (req, res) => {
  try {
    const { teacher, student, status, all, page = 1, limit = 10 } = req.query;
    const query = {};

    if (teacher) query.teacher = teacher;
    if (student) query.student = student;
    
    // Only admins/managers can see non-approved reviews
    if (req.user && ['admin', 'manager'].includes(req.user.role)) {
      if (status) {
        query.status = status;
      } else if (!all) {
        query.status = 'approved';
      }
      // if all is true, don't filter by status
    } else {
      query.status = 'approved';
    }

    console.log('Reviews Filter Query:', query);

    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .populate('student', 'name avatar')
      .populate('teacher', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: reviews,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create review
// @route   POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { teacher, rating, comment } = req.body;
    console.log('Create Review Request:', { teacher, rating, comment, userId: req.user?._id });

    if (!teacher || !rating) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin giảng viên hoặc điểm đánh giá' });
    }

    let review = await Review.findOne({ student: req.user._id, teacher });
    
    const { isFlagged, keywords } = await checkContent(comment);

    if (review) {
      // Update existing
      review.rating = rating;
      review.comment = comment;
      review.status = isFlagged ? 'flagged' : 'approved';
      review.flaggedReason = isFlagged ? 'Chứa từ ngữ nhạy cảm' : '';
      review.flaggedKeywords = keywords;
      await review.save();
    } else {
      // Create new
      review = await Review.create({ 
        student: req.user._id, 
        teacher, 
        rating, 
        comment,
        status: isFlagged ? 'flagged' : 'approved',
        flaggedReason: isFlagged ? 'Chứa từ ngữ nhạy cảm' : '',
        flaggedKeywords: keywords
      });
    }
    
    const populated = await review.populate([
      { path: 'student', select: 'name avatar' },
      { path: 'teacher', select: 'name' }
    ]);
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('Create Review Error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
const updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá' });

    if (review.student.toString() !== req.user._id.toString() && !['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Không có quyền sửa đánh giá này' });
    }

    const { rating, comment } = req.body;
    
    if (comment !== undefined) {
      const { isFlagged, keywords } = await checkContent(comment);
      review.comment = comment;
      review.status = isFlagged ? 'flagged' : 'approved';
      review.flaggedReason = isFlagged ? 'Chứa từ ngữ nhạy cảm' : '';
      review.flaggedKeywords = keywords;
    }
    
    review.rating = rating || review.rating;
    await review.save();

    const populated = await review.populate([
      { path: 'student', select: 'name avatar' },
      { path: 'teacher', select: 'name' }
    ]);
    res.json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá' });

    if (review.student.toString() !== req.user._id.toString() && !['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Không có quyền xóa đánh giá này' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Đã xóa đánh giá' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getReviews, createReview, updateReview, deleteReview };
