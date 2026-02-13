const express = require('express');
const router = express.Router();
const Developer = require('../models/Developer');
const Project = require('../models/Project');
const Assignment = require('../models/Assignment');

// GET dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Total developers
    const totalDevelopers = await Developer.countDocuments();
    
    // Available developers
    const availableDevelopers = await Developer.countDocuments({ 
      availability: 'Available' 
    });
    
    // Developers on project
    const onProjectDevelopers = await Developer.countDocuments({ 
      availability: 'On Project' 
    });
    
    // Developers on leave
    const onLeaveDevelopers = await Developer.countDocuments({ 
      availability: 'On Leave' 
    });
    
    // Total projects
    const totalProjects = await Project.countDocuments();
    
    // Active projects
    const activeProjects = await Project.countDocuments({ 
      status: 'In Progress' 
    });
    
    // Open projects
    const openProjects = await Project.countDocuments({ 
      status: 'Open' 
    });
    
    // Completed projects
    const completedProjects = await Project.countDocuments({ 
      status: 'Completed' 
    });
    
    // Active assignments
    const activeAssignments = await Assignment.countDocuments({ 
      status: 'Active' 
    });
    
    // Recent assignments (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentAssignments = await Assignment.find({
      assignedDate: { $gte: sevenDaysAgo }
    })
    .populate('developer', 'name')
    .populate('project', 'projectName clientName')
    .sort({ assignedDate: -1 })
    .limit(5);
    
    res.json({
      success: true,
      data: {
        developers: {
          total: totalDevelopers,
          available: availableDevelopers,
          onProject: onProjectDevelopers,
          onLeave: onLeaveDevelopers
        },
        projects: {
          total: totalProjects,
          active: activeProjects,
          open: openProjects,
          completed: completedProjects
        },
        assignments: {
          active: activeAssignments,
          recent: recentAssignments
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
});

// GET skill distribution
router.get('/skills', async (req, res) => {
  try {
    const developers = await Developer.find();
    
    // Count skill occurrences
    const skillCount = {};
    developers.forEach(dev => {
      dev.skills.forEach(skill => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
    });
    
    // Convert to array and sort
    const skillsArray = Object.entries(skillCount)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count);
    
    res.json({
      success: true,
      data: skillsArray
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching skill distribution',
      error: error.message
    });
  }
});

module.exports = router;
