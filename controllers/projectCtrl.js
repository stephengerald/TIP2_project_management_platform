const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const User = require("../models/userModel")

// Create a new project  
const newProject =  async (req, res) => {  
  const { projectTitle, projectType, projectDescription, startDate, endDate, projectRoles } = req.body;
  
  console.log(req.body); // Log request body to verify data is received

  if (!projectTitle){
    return res.status(400).json({message: ' Please add project Title'})
  }
  if(!projectType){
    return res.status(400).json({message: ' Project type is not included'})
  }
  if(!projectDescription){
    return res.status(400).json({message: ' Please add the description of this project'})
  }
  if(!startDate){
    return res.status(400).json({message: ' Please add your starting date'})
  }
  if(!endDate){
    return res.status(400).json({message: ' Input your Project End time target'})
  }
  if(!projectRoles){
    return res.status(400).json({message: ' Project Role is not included'})
  }
  try {  
      const newProject = new Project({  
          projectTitle,  
          projectType,  
          projectDescription,  
          startDate,  
          endDate,  
          projectRoles,  
      });  

      await newProject.save();  
      return res.status(201).json(newProject);  
  } catch (error) {  
      return res.status(400).json({ message: error.message });  
  }  
};  

// Get all projects  
const getAllProject= async (req, res) => {  
  try {  
      const projects = await Project.find().populate('assignedTo'); 
      res.json(projects);  
  } catch (error) {  
      res.status(500).json({ message: error.message });  
  }  
};  

// Get a project by ID  
 
const getProjectById = async (req, res) => {  
  try {  
      const project = await Project.findById(req.params.id);  
      if (!project) {  
          return res.status(404).json({ message: 'Project not found' });  
      }  
      res.json(project);  
  } catch (error) {  
      res.status(500).json({ message: error.message });  
  }  
};  

// Update a project   
const updateProject = async (req, res) => {  
  const { projectTitle, projectType, projectDescription, startDate, endDate, projectRoles } = req.body;  

  try {  
      const updatedProject = await Project.findByIdAndUpdate(  
          req.params.id,  
          {  
              projectTitle,  
              projectType,  
              projectDescription,  
              startDate,  
              endDate,  
              projectRoles,  
          },  
          { new: true }  
      );  

      if (!updatedProject) {  
          return res.status(404).json({ message: 'Project not found' });  
      }  
      res.json(updatedProject);  
  } catch (error) {  
      res.status(400).json({ message: error.message });  
  }  
};  

// Delete a project   
const deleteProject =async (req, res) => {  
  try {  
      const deletedProject = await Project.findByIdAndDelete(req.params.id);

      if (!deletedProject) {  
          return res.status(404).json({ message: 'Project not found' });  
      }  
      res.json({ message: 'Project deleted successfully' });  
  } catch (error) {  
      res.status(500).json({ message: error.message });  
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
      res.json(projects);  
  } catch (error) {  
      res.status(500).json({ message: error.message });  
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
