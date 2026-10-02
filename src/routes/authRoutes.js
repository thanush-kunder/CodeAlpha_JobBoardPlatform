const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  registerEmployer,
  registerCandidate,
  loginEmployer,
  loginCandidate,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Validation middleware
const employerRegisterValidation = [
  body('companyName').notEmpty().withMessage('Company name is required'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('industry').notEmpty().withMessage('Industry is required'),
  body('location').notEmpty().withMessage('Location is required'),
];

const candidateRegisterValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('location').notEmpty().withMessage('Location is required'),
];

const loginValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/employer/register', employerRegisterValidation, registerEmployer);
router.post('/candidate/register', candidateRegisterValidation, registerCandidate);
router.post('/employer/login', loginValidation, loginEmployer);
router.post('/candidate/login', loginValidation, loginCandidate);
router.get('/me', protect, getMe);

module.exports = router;
