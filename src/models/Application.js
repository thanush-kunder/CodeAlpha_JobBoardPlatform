const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true,
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'interview', 'offered', 'rejected', 'withdrawn'],
    default: 'pending',
  },
  coverLetter: {
    type: String,
    default: '',
  },
  resume: {
    type: String,
    required: [true, 'Resume is required'],
  },
  expectedSalary: {
    type: Number,
    default: 0,
  },
  notes: [
    {
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
      },
      note: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure one candidate can only apply once for a job
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

// Update timestamp on save
applicationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
