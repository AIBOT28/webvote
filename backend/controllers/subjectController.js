const Subject = require('../models/Subject');

// @desc    Get all subjects
// @route   GET /api/subjects
const getSubjects = async (req, res) => {
  try {
    const { department, search } = req.query;
    const query = {};

    if (department) query.department = department;
    if (search) query.name = { $regex: search, $options: 'i' };

    const subjects = await Subject.find(query)
      .populate('department', 'name')
      .sort({ name: 1 });

    res.json({ success: true, data: subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single subject
// @route   GET /api/subjects/:id
const getSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('department', 'name');
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy môn học' });
    }
    res.json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create subject
// @route   POST /api/subjects
const createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    const populated = await subject.populate('department', 'name');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Mã môn học đã tồn tại' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('department', 'name');
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy môn học' });
    }
    res.json({ success: true, data: subject });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Mã môn học đã tồn tại' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy môn học' });
    }
    res.json({ success: true, message: 'Đã xóa môn học' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSubjects, getSubject, createSubject, updateSubject, deleteSubject };
