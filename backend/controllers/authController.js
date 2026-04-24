const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// @desc    Google OAuth login/register
// @route   POST /api/auth/google
const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    const ADMIN_EMAIL = 'nguyenledangkhoa146205@gmail.com';

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Sync Google info
      let updated = false;
      if (!user.googleId) { user.googleId = googleId; updated = true; }
      if (email === ADMIN_EMAIL && user.role !== 'admin') { user.role = 'admin'; updated = true; }
      if (updated) await user.save();
    } else {
      // Create new account
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture || '',
        role: email === ADMIN_EMAIL ? 'admin' : 'student'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token
      }
    });
  } catch (error) {
    console.error('Google auth error:', error.message || error);
    res.status(401).json({ 
      success: false, 
      message: 'Xác thực Google thất bại: ' + (error.message || 'Lỗi không xác định') 
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { googleAuth, getMe, updateProfile };
