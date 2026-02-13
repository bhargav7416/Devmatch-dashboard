const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  requiredSkills: {
    type: [String],
    required: [true, 'Required skills must be specified'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one skill is required'
    }
  },
  experienceRequired: {
    type: String,
    enum: ['Junior', 'Mid', 'Senior'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Completed'],
    default: 'Open'
  },
  assignedDevelopers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Developer'
  }],
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Validate that end date is after start date
projectSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
