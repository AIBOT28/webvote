const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên khoa'],
    unique: true,
    trim: true,
    maxlength: [200, 'Tên khoa không được quá 200 ký tự']
  },
  description: {
    type: String,
    default: '',
    maxlength: [1000, 'Mô tả không được quá 1000 ký tự']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual: count teachers in department
departmentSchema.virtual('teacherCount', {
  ref: 'Teacher',
  localField: '_id',
  foreignField: 'department',
  count: true
});

// Virtual: count subjects in department
departmentSchema.virtual('subjectCount', {
  ref: 'Subject',
  localField: '_id',
  foreignField: 'department',
  count: true
});

module.exports = mongoose.model('Department', departmentSchema);
