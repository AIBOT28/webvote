const User = require('../models/User');
const Department = require('../models/Department');
const Subject = require('../models/Subject');
const Teacher = require('../models/Teacher');
const Review = require('../models/Review');
const mongoose = require('mongoose');
const { cache } = require('../utils/cache');


// @desc    Get overview stats
// @route   GET /api/stats/overview
const getOverview = async (req, res) => {
  try {
    const cacheKey = 'stats_overview';
    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.json(cachedData);

    const [departments, subjects, teachers, students, reviews] = await Promise.all([
      Department.countDocuments(),
      Subject.countDocuments(),
      Teacher.countDocuments(),
      User.countDocuments({ role: 'student' }),
      Review.countDocuments()
    ]);
    
    const response = { success: true, data: { departments, subjects, teachers, students, reviews } };
    cache.set(cacheKey, response, 600); // Stats can be cached longer (10 mins)
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Get teacher ranking (school-wide or by department)
// @route   GET /api/stats/ranking?department=xxx&limit=20
const getRanking = async (req, res) => {
  try {
    const { department, limit = 20 } = req.query;
    const cacheKey = `stats_ranking_${department || 'all'}_${limit}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.json(cachedData);

    const query = { totalReviews: { $gt: 0 } };
    if (department) query.department = department;

    const teachers = await Teacher.find(query)
      .populate('department', 'name')
      .sort({ averageRating: -1, totalReviews: -1 })
      .limit(parseInt(limit));

    const response = { success: true, data: teachers };
    cache.set(cacheKey, response);
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Get rating distribution for a teacher
// @route   GET /api/stats/teacher/:teacherId
const getTeacherStats = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const cacheKey = `stats_teacher_${teacherId}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.json(cachedData);

    const tId = new mongoose.Types.ObjectId(teacherId);

    const distribution = await Review.aggregate([
      { $match: { teacher: tId } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Fill in missing ratings (1-5) with count 0
    const ratingDist = [1, 2, 3, 4, 5].map(r => {
      const found = distribution.find(d => d._id === r);
      return { rating: r, count: found ? found.count : 0 };
    });

    const response = { success: true, data: { distribution: ratingDist } };
    cache.set(cacheKey, response);

    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = { getOverview, getRanking, getTeacherStats };
