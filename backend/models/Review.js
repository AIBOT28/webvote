const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vui lòng cung cấp thông tin sinh viên']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: [true, 'Vui lòng chọn giảng viên']
  },
  rating: {
    type: Number,
    required: [true, 'Vui lòng đánh giá từ 1 đến 5 sao'],
    min: [1, 'Đánh giá tối thiểu 1 sao'],
    max: [5, 'Đánh giá tối đa 5 sao']
  },
  comment: {
    type: String,
    default: '',
    maxlength: [2000, 'Nhận xét không được quá 2000 ký tự']
  },
  status: {
    type: String,
    enum: ['approved', 'flagged', 'hidden'],
    default: 'approved'
  },
  flaggedReason: String,
  flaggedKeywords: [String]
}, {
  timestamps: true
});

// Each student can only review a teacher once
reviewSchema.index({ student: 1, teacher: 1 }, { unique: true });

// After save/remove, recalculate teacher's average rating
reviewSchema.statics.calcAverageRating = async function(teacherId) {
  const stats = await this.aggregate([
    { $match: { teacher: teacherId, status: 'approved' } },
    {
      $group: {
        _id: '$teacher',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  const Teacher = mongoose.model('Teacher');
  if (stats.length > 0) {
    await Teacher.findByIdAndUpdate(teacherId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews
    });
  } else {
    await Teacher.findByIdAndUpdate(teacherId, {
      averageRating: 0,
      totalReviews: 0
    });
  }
};

reviewSchema.post('save', async function() {
  await this.constructor.calcAverageRating(this.teacher);
});

reviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await doc.constructor.calcAverageRating(doc.teacher);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
