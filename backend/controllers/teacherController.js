const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');

// @desc    Get all teachers (with pagination, search, filter)
// @route   GET /api/teachers
const getTeachers = async (req, res) => {
  try {
    const { department, search, status, sort = '-averageRating', page = 1, limit = 12 } = req.query;
    const query = {};

    if (department) query.department = department;
    if (search) query.name = { $regex: search, $options: 'i' };
    
    // Support multiple statuses (comma-separated) for admins
    if (status && ['admin', 'manager'].includes(req.user?.role)) {
      query.status = { $in: status.split(',') };
    } else {
      query.status = 'active';
    }

    const total = await Teacher.countDocuments(query);
    const teachers = await Teacher.find(query)
      .populate('department', 'name')
      .populate('subjects', 'name code')
      .populate('requestedBy', 'name email')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: teachers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single teacher
// @route   GET /api/teachers/:id
const getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('department', 'name')
      .populate('subjects', 'name code');
    
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy giảng viên' });
    }

    if (teacher.status !== 'active' && !['admin', 'manager'].includes(req.user?.role)) {
      return res.status(403).json({ success: false, message: 'Giảng viên này đang chờ xét duyệt' });
    }

    res.json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create teacher
// @route   POST /api/teachers
const createTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);
    const populated = await teacher.populate([
      { path: 'department', select: 'name' },
      { path: 'subjects', select: 'name code' }
    ]);
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update teacher
// @route   PUT /api/teachers/:id
const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('department', 'name')
      .populate('subjects', 'name code');
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy giảng viên' });
    }
    res.json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request new teacher (for students)
// @route   POST /api/teachers/request
const requestTeacher = async (req, res) => {
  try {
    const { name, department, subjects, newSubjects } = req.body;
    
    const subjectIds = [...(subjects || [])];
    
    // Process new subjects from comma-separated string
    if (newSubjects) {
      const subjectNames = newSubjects.split(',').map(s => s.trim()).filter(s => s);
      for (const sName of subjectNames) {
        let subject = await Subject.findOne({ name: { $regex: `^${sName}$`, $options: 'i' } });
        if (!subject) {
          subject = await Subject.create({ 
            name: sName, 
            department,
            code: sName.split(' ').map(w => w[0]).join('').toUpperCase() + Math.floor(Math.random() * 1000)
          });
        }
        if (!subjectIds.includes(subject._id.toString())) {
          subjectIds.push(subject._id);
        }
      }
    }

    const teacher = await Teacher.create({
      name,
      department,
      subjects: subjectIds,
      status: 'pending',
      requestedBy: req.user._id
    });

    res.status(201).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete teacher
// @route   DELETE /api/teachers/:id
const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy giảng viên' });
    }
    res.json({ success: true, message: 'Đã xóa giảng viên' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTeachers, getTeacher, createTeacher, updateTeacher, deleteTeacher, requestTeacher };
