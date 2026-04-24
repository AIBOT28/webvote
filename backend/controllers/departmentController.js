const Department = require('../models/Department');

// @desc    Get all departments
// @route   GET /api/departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('teacherCount')
      .populate('subjectCount')
      .sort({ name: 1 });
    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single department
// @route   GET /api/departments/:id
const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('teacherCount')
      .populate('subjectCount');
    if (!department) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khoa' });
    }
    res.json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create department
// @route   POST /api/departments
const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Tên khoa đã tồn tại' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!department) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khoa' });
    }
    res.json({ success: true, data: department });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Tên khoa đã tồn tại' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khoa' });
    }
    res.json({ success: true, message: 'Đã xóa khoa' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDepartments, getDepartment, createDepartment, updateDepartment, deleteDepartment };
