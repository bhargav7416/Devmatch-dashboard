const express = require('express');
const router = express.Router();
const Developer = require('../models/Developer');

// GET all developers
router.get('/', async (req, res) => {
  try {
    const { availability, skills } = req.query;
    
    let query = {};
    
    // Filter by availability
    if (availability) {
      query.availability = availability;
    }
    
    // Filter by skills (comma-separated)
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.skills = { $in: skillsArray };
    }
    
    const developers = await Developer.find(query)
      .populate('currentProject', 'projectName clientName')
      .sort({ createdAt: -1 });
      
    res.json({
      success: true,
      count: developers.length,
      data: developers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching developers',
      error: error.message
    });
  }
});

// GET single developer by ID
router.get('/:id', async (req, res) => {
  try {
    const developer = await Developer.findById(req.params.id)
      .populate('currentProject');
      
    if (!developer) {
      return res.status(404).json({
        success: false,
        message: 'Developer not found'
      });
    }
    
    res.json({
      success: true,
      data: developer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching developer',
      error: error.message
    });
  }
});

// POST create new developer
router.post('/', async (req, res) => {
  try {
    const developer = await Developer.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Developer created successfully',
      data: developer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating developer',
      error: error.message
    });
  }
});

// PUT update developer
router.put('/:id', async (req, res) => {
  try {
    const developer = await Developer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!developer) {
      return res.status(404).json({
        success: false,
        message: 'Developer not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Developer updated successfully',
      data: developer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating developer',
      error: error.message
    });
  }
});

// DELETE developer
router.delete('/:id', async (req, res) => {
  try {
    const developer = await Developer.findByIdAndDelete(req.params.id);
    
    if (!developer) {
      return res.status(404).json({
        success: false,
        message: 'Developer not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Developer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting developer',
      error: error.message
    });
  }
});

// GET available developers for a project (matching)
router.post('/match', async (req, res) => {
  try {
    const { requiredSkills, experienceRequired } = req.body;
    
    // Find available developers
    const developers = await Developer.find({
      availability: 'Available'
    });
    
    // Calculate match score for each developer
    const matchedDevelopers = developers.map(dev => {
      const matchedSkills = requiredSkills.filter(skill => 
        dev.skills.includes(skill)
      );
      const matchScore = (matchedSkills.length / requiredSkills.length) * 100;
      
      return {
        ...dev.toObject(),
        matchScore: Math.round(matchScore),
        matchedSkills
      };
    })
    .filter(dev => dev.matchScore > 0) // Only show developers with at least 1 matching skill
    .sort((a, b) => b.matchScore - a.matchScore); // Sort by match score
    
    res.json({
      success: true,
      count: matchedDevelopers.length,
      data: matchedDevelopers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error matching developers',
      error: error.message
    });
  }
});

module.exports = router;
