const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

// Validation middleware
const jobValidation = [
  body('title').notEmpty().withMessage('Job title is required'),
  body('description').notEmpty().withMessage('Job description is required'),
  body('requirements').notEmpty().withMessage('Job requirements are required'),
  body('responsibilities').notEmpty().withMessage('Job responsibilities are required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('jobType')
    .notEmpty()
    .withMessage('Job type is required')
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'remote'])
    .withMessage('Invalid job type'),
  body('category').notEmpty().withMessage('Category is required'),
  body('experienceLevel')
    .optional()
    .isIn(['entry', 'mid', 'senior', 'lead', 'executive'])
    .withMessage('Invalid experience level'),
];

// Routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorize('Employer'), jobValidation, createJob);
router.put('/:id', protect, authorize('Employer'), jobValidation, updateJob);
router.delete('/:id', protect, authorize('Employer'), deleteJob);
router.get('/employer/my-jobs', protect, authorize('Employer'), getEmployerJobs);

module.exports = router;
