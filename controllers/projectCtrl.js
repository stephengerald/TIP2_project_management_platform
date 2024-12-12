const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const User = require("../models/userModel");
const { assign } = require('nodemailer/lib/shared');
const { pagination } = require('../utility/pagenation');
const { sendEmailNotification } = require('../utility/sendNotification');

// Create a new project  
const newProject = (io) => async (req, res) => {  
  const { projectTitle, projectType, projectDescription, startDate, endDate, projectRoles } = req.body;
  
  console.log(req.body); // Log request body to verify data is received  

  // Validate required fields  
  if (!projectTitle) {  
    return res.status(400).json({ message: 'Please add project Title' });  
  }  
  if (!projectType) {  
    return res.status(400).json({ message: 'Project type is not included' });  
  }  
  if (!projectDescription) {  
    return res.status(400).json({ message: 'Please add the description of this project' });  
  }  
  if (!startDate) {  
    return res.status(400).json({ message: 'Please add your starting date' });  
  }  
  if (!endDate) {  
    return res.status(400).json({ message: 'Input your Project End time target' });  
  }  
  if (!projectRoles || projectRoles.length === 0) {  
    return res.status(400).json({ message: 'Project Role is not included' });  
  }  

  try {  
    // Prepare project roles with emails directly from the request  
    const roles = projectRoles.map(role => ({  
      role: role.role,  
      assignedTo: role.assignedTo // Directly assign the email  
    }));  

    // Check if the user is authenticated  
    if (!req.user || !req.user._id) {  
      return res.status(401).json({ message: 'User not authenticated' });  
    }  

    // Create the new project  
    const newProject = new Project({  
      projectTitle,  
      projectType,  
      projectDescription,  
      startDate,  
      endDate,  
      projectRoles: roles,  
      createdBy: req.user._id  // Ensure createdBy is set to the current user  
    });  

      await newProject.save();  

      // Emit event for new project to all assigned users
      roles.forEach(role => { 
        io.to(role.assignedTo).emit('newProject', newProject); 
      });

      return res.status(201).json(newProject);  
  } catch (error) {  
    return res.status(500).json({ message: error.message });  
  }  
};  



















const getAllProject = async (req, res) => {  
  try {  

    const{page, limit,skip}= pagination(req)
      
    const projects = await Project.find().limit(limit).skip(skip).sort({created_at: -1})  
      .populate('createdBy', 'fullname email')    

    const totalProjects = await Project.countDocuments();  
    return res.status(200).json({ total: totalProjects, page, projects });  
  } catch (error) {  
    console.error(error);  
    return res.status(500).json({ message: 'An error occurred while fetching projects.' });  
  }  
};

// Get a project by ID  
 
const getProjectById = async (req, res) => {  
  try {  
      const project = await Project.findById(req.params.id);  
      if (!project) {  
          return res.status(404).json({ message: 'Project not found' });  
      }  
      return res.json(project);  
  } catch (error) {  
      return res.status(500).json({ message: error.message });  
  }  
};  

// Update a project   
const updateProject = (io) => async (req, res) => {  
  const { id } = req.params
  const { projectTitle, projectType, projectDescription, startDate, endDate, projectRoles } = req.body;  

  try {  
    const roles = await Promise.all(projectRoles.map(async (role) => { 
      const user = await User.findOne({ email: role.assignedTo }); 
      if (!user) { 
        throw new Error(`User with email ${role.assignedTo} not found`); 
      } 
      return { 
        role: role.role, 
        assignedTo: user._id 
      };
    }));

    const updatedProject = await Project.findByIdAndUpdate(  
          id,  
          {  
              projectTitle,  
              projectType,  
              projectDescription,  
              startDate,  
              endDate,  
              projectRoles: roles  
          },  
          { new: true }  
      );  

      if (!updatedProject) {  
          return res.status(404).json({ message: 'Project not found' });  
      }  

      // Emit event for project update to all assigned users
      roles.forEach(role => { 
        io.to(role.assignedTo).emit('updateProject', updatedProject); 
      });

      return res.status(200).json(updatedProject);  
  } catch (error) {  
      return res.status(500).json({ message: error.message });  
  }  
};  

// Delete a project   
const deleteProject =async (req, res) => {  
  const { id } = req.params;

  try {  
      const deletedProject = await Project.findByIdAndDelete(id);

      if (!deletedProject) {  
          return res.status(404).json({ message: 'Project not found' });  
      }  
      return res.status(200).json({ message: 'Project deleted successfully' });  
  } catch (error) {  
      return res.status(500).json({ message: error.message });  
  }  
};  

// Search projects  
const searchProjects = async (req, res) => {  
  const { projectTitle, projectType } = req.query;  

  const query = {};  

  // Build the search query based on provided parameters  
  if (projectTitle) {  
      query.projectTitle = { $regex: projectTitle, $options: 'i' }; // i is Case-insensitive search, while regex is regular expression
  }  
  if (projectType) {  
      query.projectType = projectType;  
  }  

  try {  
      const projects = await Project.find(query);  
      return res.status(200).json(projects);  
  } catch (error) {  
      return res.status(500).json({ message: error.message });  
  }  
}; 




module.exports = {
    getProjectById,
    getAllProject,
    newProject,
    updateProject,
    deleteProject,
    searchProjects
}
// ...
