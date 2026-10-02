const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  requirements: {
    type: String,
    required: [true, 'Job requirements are required'],
  },
  responsibilities: {
    type: String,
    required: [true, 'Job responsibilities are required'],
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer',
    required: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    required: [true, 'Job type is required'],
  },
  salary: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    isNegotiable: {
      type: Boolean,
      default: false,
    },
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
    default: 'entry',
  },
  skills: [
    {
      type: String,
    },
  ],
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  applicationDeadline: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  applicationCount: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster searches
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobSchema.index({ location: 1, jobType: 1 });
jobSchema.index({ category: 1 });

// Update timestamp on save
jobSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Job', jobSchema);
