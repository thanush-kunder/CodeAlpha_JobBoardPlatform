const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  applyForJob,
  getCandidateApplications,
  getEmployerApplications,
  getApplicationById,
  updateApplicationStatus,
  addNote,
  withdrawApplication,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

// Validation middleware
const applicationValidation = [
  body('jobId')
    .notEmpty()
    .withMessage('Job ID is required')
    .isMongoId()
    .withMessage('Invalid job ID'),
  body('resume').notEmpty().withMessage('Resume is required'),
];

const statusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'reviewed', 'interview', 'offered', 'rejected', 'withdrawn'])
    .withMessage('Invalid status'),
];

const noteValidation = [
  body('note').notEmpty().withMessage('Note is required'),
];

// Routes
router.post('/', protect, authorize('Candidate'), applicationValidation, applyForJob);
router.get('/candidate/my-applications', protect, authorize('Candidate'), getCandidateApplications);
router.get('/employer/received', protect, authorize('Employer'), getEmployerApplications);
router.get('/:id', protect, getApplicationById);
router.put('/:id/status', protect, authorize('Employer'), statusValidation, updateApplicationStatus);
router.post('/:id/notes', protect, authorize('Employer'), noteValidation, addNote);
router.delete('/:id', protect, authorize('Candidate'), withdrawApplication);

module.exports = router;
