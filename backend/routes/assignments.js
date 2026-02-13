const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Developer = require('../models/Developer');
const Project = require('../models/Project');

// GET all assignments
router.get('/', async (req, res) => {
  try {
    const { status, developerId, projectId } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (developerId) query.developer = developerId;
    if (projectId) query.project = projectId;
    
    const assignments = await Assignment.find(query)
      .populate('developer', 'name email skills')
      .populate('project', 'projectName clientName')
      .sort({ assignedDate: -1 });
      
    res.json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching assignments',
      error: error.message
    });
  }
});

// POST create new assignment (assign developer to project)
router.post('/', async (req, res) => {
  try {
    const { developerId, projectId, endDate } = req.body;
    
    // Check if developer exists and is available
    const developer = await Developer.findById(developerId);
    if (!developer) {
      return res.status(404).json({
        success: false,
        message: 'Developer not found'
      });
    }
    
    if (developer.availability !== 'Available') {
      return res.status(400).json({
        success: false,
        message: 'Developer is not available'
      });
    }
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Create assignment
    const assignment = await Assignment.create({
      developer: developerId,
      project: projectId,
      endDate,
      status: 'Active'
    });
    
    // Update developer status
    developer.availability = 'On Project';
    developer.currentProject = projectId;
    await developer.save();
    
    // Update project status and add developer
    if (project.status === 'Open') {
      project.status = 'In Progress';
    }
    project.assignedDevelopers.push(developerId);
    await project.save();
    
    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('developer', 'name email skills')
      .populate('project', 'projectName clientName');
    
    res.status(201).json({
      success: true,
      message: 'Developer assigned successfully',
      data: populatedAssignment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating assignment',
      error: error.message
    });
  }
});

// PUT complete assignment
router.put('/:id/complete', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }
    
    // Update assignment status
    assignment.status = 'Completed';
    await assignment.save();
    
    // Update developer availability
    const developer = await Developer.findById(assignment.developer);
    developer.availability = 'Available';
    developer.currentProject = null;
    await developer.save();
    
    res.json({
      success: true,
      message: 'Assignment completed successfully',
      data: assignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing assignment',
      error: error.message
    });
  }
});

// DELETE assignment
router.delete('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting assignment',
      error: error.message
    });
  }
});

module.exports = router;
