const Application = require('../models/Application');
const Job = require('../models/Job');
const { validationResult } = require('express-validator');

// @desc    Apply for job
// @route   POST /api/applications
// @access  Private/Candidate
exports.applyForJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { jobId, coverLetter, expectedSalary, resume } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (!job.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Job is no longer accepting applications',
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'Already applied for this job',
      });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
      employer: job.employer,
      coverLetter,
      expectedSalary,
      resume: resume || req.user.resume,
    });

    // Update job application count
    job.applicationCount += 1;
    await job.save();

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate's applications
// @route   GET /api/applications/candidate/my-applications
// @access  Private/Candidate
exports.getCandidateApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate('job', 'title location jobType salary')
      .populate('employer', 'companyName logo')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get employer's received applications
// @route   GET /api/applications/employer/received
// @access  Private/Employer
exports.getEmployerApplications = async (req, res, next) => {
  try {
    const { status, jobId } = req.query;
    const query = { employer: req.user.id };

    if (status) query.status = status;
    if (jobId) query.job = jobId;

    const applications = await Application.find(query)
      .populate('job', 'title location')
      .populate('candidate', 'firstName lastName email location skills experience')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
exports.getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job', 'title location description requirements')
      .populate('candidate', 'firstName lastName email phone location skills experience education')
      .populate('employer', 'companyName');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check authorization
    if (
      application.candidate._id.toString() !== req.user.id &&
      application.employer._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application',
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Employer only)
// @route   PUT /api/applications/:id/status
// @access  Private/Employer
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check ownership
    if (application.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application',
      });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add note to application (Employer only)
// @route   POST /api/applications/:id/notes
// @access  Private/Employer
exports.addNote = async (req, res, next) => {
  try {
    const { note } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check ownership
    if (application.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add notes to this application',
      });
    }

    application.notes.push({
      addedBy: req.user.id,
      note,
      createdAt: Date.now(),
    });

    await application.save();

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw application (Candidate only)
// @route   DELETE /api/applications/:id
// @access  Private/Candidate
exports.withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check ownership
    if (application.candidate.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this application',
      });
    }

    application.status = 'withdrawn';
    await application.save();

    // Update job application count
    const job = await Job.findById(application.job);
    if (job && job.applicationCount > 0) {
      job.applicationCount -= 1;
      await job.save();
    }

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};
