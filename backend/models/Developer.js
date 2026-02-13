const mongoose = require('mongoose');

const developerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Developer name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  skills: {
    type: [String],
    required: [true, 'At least one skill is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Developer must have at least one skill'
    }
  },
  experience: {
    type: String,
    enum: ['Junior', 'Mid', 'Senior'],
    required: true
  },
  experienceYears: {
    type: Number,
    required: true,
    min: 0
  },
  availability: {
    type: String,
    enum: ['Available', 'On Project', 'On Leave'],
    default: 'Available'
  },
  currentProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
developerSchema.index({ skills: 1, availability: 1 });

module.exports = mongoose.model('Developer', developerSchema);
