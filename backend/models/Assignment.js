const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  developer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Developer',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  assignedDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Completed'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Index for faster queries
assignmentSchema.index({ developer: 1, status: 1 });
assignmentSchema.index({ project: 1, status: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);
