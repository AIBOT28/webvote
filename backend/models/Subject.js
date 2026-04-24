const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên môn học'],
    trim: true,
    maxlength: [200, 'Tên môn học không được quá 200 ký tự']
  },
  code: {
    type: String,
    required: [true, 'Vui lòng nhập mã môn học'],
    unique: true,
    uppercase: true,
    trim: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Vui lòng chọn khoa']
  },
  description: {
    type: String,
    default: '',
    maxlength: [1000, 'Mô tả không được quá 1000 ký tự']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subject', subjectSchema);
