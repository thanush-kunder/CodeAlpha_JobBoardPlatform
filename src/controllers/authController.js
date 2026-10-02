const Employer = require('../models/Employer');
const Candidate = require('../models/Candidate');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register employer
// @route   POST /api/auth/employer/register
// @access  Public
exports.registerEmployer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      companyName,
      email,
      password,
      industry,
      companySize,
      website,
      location,
      description,
    } = req.body;

    // Check if employer exists
    const employerExists = await Employer.findOne({ email });
    if (employerExists) {
      return res.status(400).json({
        success: false,
        message: 'Employer already exists',
      });
    }

    // Create employer
    const employer = await Employer.create({
      companyName,
      email,
      password,
      industry,
      companySize,
      website,
      location,
      description,
    });

    // Generate token
    const token = generateToken(employer._id);

    res.status(201).json({
      success: true,
      token,
      userType: 'employer',
      user: {
        id: employer._id,
        companyName: employer.companyName,
        email: employer.email,
        industry: employer.industry,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register candidate
// @route   POST /api/auth/candidate/register
// @access  Public
exports.registerCandidate = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      location,
      skills,
      experience,
    } = req.body;

    // Check if candidate exists
    const candidateExists = await Candidate.findOne({ email });
    if (candidateExists) {
      return res.status(400).json({
        success: false,
        message: 'Candidate already exists',
      });
    }

    // Create candidate
    const candidate = await Candidate.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      location,
      skills,
      experience,
    });

    // Generate token
    const token = generateToken(candidate._id);

    res.status(201).json({
      success: true,
      token,
      userType: 'candidate',
      user: {
        id: candidate._id,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        location: candidate.location,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login employer
// @route   POST /api/auth/employer/login
// @access  Public
exports.loginEmployer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if employer exists
    const employer = await Employer.findOne({ email }).select('+password');
    if (!employer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await employer.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(employer._id);

    res.status(200).json({
      success: true,
      token,
      userType: 'employer',
      user: {
        id: employer._id,
        companyName: employer.companyName,
        email: employer.email,
        industry: employer.industry,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login candidate
// @route   POST /api/auth/candidate/login
// @access  Public
exports.loginCandidate = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if candidate exists
    const candidate = await Candidate.findOne({ email }).select('+password');
    if (!candidate) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await candidate.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(candidate._id);

    res.status(200).json({
      success: true,
      token,
      userType: 'candidate',
      user: {
        id: candidate._id,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        location: candidate.location,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await req.user.constructor.findById(req.user.id);

    res.status(200).json({
      success: true,
      userType: req.userType,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
