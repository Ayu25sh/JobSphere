import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  skills: [{
    type: String,
    required: [true, 'At least one skill is required'],
  }],
  salary: {
    type: String,
    required: [true, 'Salary information is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
  },
  applicationDeadline: {
    type: Date,
    required: [true, 'Application deadline is required'],
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active',
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);