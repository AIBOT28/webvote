const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên giảng viên'],
    trim: true,
    maxlength: [200, 'Tên không được quá 200 ký tự']
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Vui lòng chọn khoa']
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  avatar: {
    type: String,
    default: ''
  },
  // Cached average rating for faster queries
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'rejected'],
    default: 'active'
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for search and sort performance
teacherSchema.index({ name: 'text' });
teacherSchema.index({ averageRating: -1 });
teacherSchema.index({ department: 1 });

module.exports = mongoose.model('Teacher', teacherSchema);
