const mongoose = require('mongoose');
require('dotenv').config();

const updateData = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/teacher-evaluation';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const Teacher = require('./models/Teacher');
    const Review = require('./models/Review');

    const tResult = await Teacher.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'active' } }
    );
    console.log(`Updated ${tResult.modifiedCount} teachers`);

    const rResult = await Review.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'approved' } }
    );
    console.log(`Updated ${rResult.modifiedCount} reviews`);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

updateData();
