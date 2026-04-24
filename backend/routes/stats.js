const express = require('express');
const { getOverview, getRanking, getTeacherStats } = require('../controllers/statsController');

const router = express.Router();

router.get('/overview', getOverview);
router.get('/ranking', getRanking);
router.get('/teacher/:teacherId', getTeacherStats);

module.exports = router;
