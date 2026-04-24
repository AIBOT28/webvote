const User = require('../models/User');
const Department = require('../models/Department');
const Subject = require('../models/Subject');
const Teacher = require('../models/Teacher');
const Review = require('../models/Review');
const mongoose = require('mongoose');

// @desc    Get overview stats
// @route   GET /api/stats/overview
const getOverview = async (req, res) => {
  try {
    const [departments, subjects, teachers, students, reviews] = await Promise.all([
      Department.countDocuments(),
      Subject.countDocuments(),
      Teacher.countDocuments(),
      User.countDocuments({ role: 'student' }),
      Review.countDocuments()
    ]);
    res.json({ success: true, data: { departments, subjects, teachers, students, reviews } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get teacher ranking (school-wide or by department)
// @route   GET /api/stats/ranking?department=xxx&limit=20
const getRanking = async (req, res) => {
  try {
    const { department, limit = 20 } = req.query;
    const query = { totalReviews: { $gt: 0 } };
    if (department) query.department = department;

    const teachers = await Teacher.find(query)
      .populate('department', 'name')
      .sort({ averageRating: -1, totalReviews: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, data: teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get rating distribution for a teacher
// @route   GET /api/stats/teacher/:teacherId
const getTeacherStats = async (req, res) => {
  try {
    const teacherId = new mongoose.Types.ObjectId(req.params.teacherId);

    const distribution = await Review.aggregate([
      { $match: { teacher: teacherId } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Fill in missing ratings (1-5) with count 0
    const ratingDist = [1, 2, 3, 4, 5].map(r => {
      const found = distribution.find(d => d._id === r);
      return { rating: r, count: found ? found.count : 0 };
    });

    res.json({ success: true, data: { distribution: ratingDist } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getOverview, getRanking, getTeacherStats };
