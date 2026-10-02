const express = require('express');
const router = express.Router();
const {
  uploadResume,
  updateProfile,
  getProfile,
  upload,
} = require('../controllers/resumeController');
const { protect, authorize } = require('../middleware/auth');

// Routes
router.post('/upload', protect, authorize('Candidate'), upload.single('resume'), uploadResume);
router.put('/profile', protect, authorize('Candidate'), updateProfile);
router.get('/profile', protect, authorize('Candidate'), getProfile);

module.exports = router;
