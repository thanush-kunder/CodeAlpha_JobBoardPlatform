const Candidate = require('../models/Candidate');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/resumes/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX are allowed.'));
    }
  },
});

// @desc    Upload resume
// @route   POST /api/resumes/upload
// @access  Private/Candidate
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const candidate = await Candidate.findById(req.user.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
    }

    candidate.resume = req.file.path;
    await candidate.save();

    res.status(200).json({
      success: true,
      data: {
        resume: candidate.resume,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update candidate profile
// @route   PUT /api/resumes/profile
// @access  Private/Candidate
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      location,
      skills,
      experience,
      education,
      linkedin,
      github,
      portfolio,
      bio,
    } = req.body;

    const candidate = await Candidate.findById(req.user.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
    }

    // Update fields
    if (firstName) candidate.firstName = firstName;
    if (lastName) candidate.lastName = lastName;
    if (phone !== undefined) candidate.phone = phone;
    if (location) candidate.location = location;
    if (skills) candidate.skills = skills;
    if (experience !== undefined) candidate.experience = experience;
    if (education) candidate.education = education;
    if (linkedin !== undefined) candidate.linkedin = linkedin;
    if (github !== undefined) candidate.github = github;
    if (portfolio !== undefined) candidate.portfolio = portfolio;
    if (bio !== undefined) candidate.bio = bio;

    await candidate.save();

    res.status(200).json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate profile
// @route   GET /api/resumes/profile
// @access  Private/Candidate
exports.getProfile = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.user.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
    }

    res.status(200).json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.upload = upload;
