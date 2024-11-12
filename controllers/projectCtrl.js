const express = require('express');
const router = express.Router();
const Project = require('../models/project');

//create a project
const newProject =  async (req, res) => {  
  const { name, description, tasks, status, isAvailable } = req.body;  

  // Validate required fields  
  if (!name) {  
    return res.status(400).json({ msg: "Project name is required" });  
  }  
  if(!description){
    return res.status(400).json({msg: "Please add project description"})
  }
  if (!task){
    return res.status(400).json({msg: "Please input Task ID"})
  }

  try {  
    const project = new Project({ name, description, tasks, status, isAvailable });  
    await project.save();  
    return res.status(201).json(project);  
  } catch (err) {  
    return res.status(500).json({ msg: "Error creating project", error: err.message });  
  }  
};  

// Get a project by ID  
const getProjectById = async (req, res) => {  
  try {  
      const project = await Project.findById(req.params.id).populate('tasks').populate('milestones');; 
      if (!project) {  
          return res.status(404).json({ msg: "Project not found" });  
      }  
      return res.status(200).json(project);  
  } catch (err) {  
      return res.status(500).json({ msg: "Error fetching project", error: err.message });  
  }  
};

// Update a project by ID  
const updateProject = async (req, res) => {  
  const { name, description, tasks, status, isAvailable } = req.body;  

  // Validate required fields  
  if (!name) {  
      return res.status(400).json({ msg: "Project name is required" });  
  }  
  if (!description) {  
      return res.status(400).json({ msg: "Please add project description" });  
  }  

  try {  
      const project = await Project.findByIdAndUpdate(  
          req.params.id,  
          { name, description, tasks, status, isAvailable },  
          { new: true } // Return the updated document  
      );  

      if (!project) {  
          return res.status(404).json({ msg: "Project not found" });  
      }  

      return res.status(200).json(project);  
  } catch (err) {  
      return res.status(500).json({ msg: "Error updating project", error: err.message });  
  }  
};

// Delete a project by ID  
const deleteProject = async (req, res) => {  
  try {  
      const project = await Project.findByIdAndDelete(req.params.id);  

      if (!project) {  
          return res.status(404).json({ msg: "Project not found" });  
      }  

      return res.status(204).send(); // No content response  
  } catch (err) {  
      return res.status(500).json({ msg: "Error deleting project", error: err.message });  
  }  
};

// Search projects  
const searchProjects = async (req, res) => {  
  const { name, status } = req.query; // Destructure the query parameters  

  // Create an object to hold the search criteria  
  const searchConditions = {};  

  // Check and add search criteria based on provided query parameters  
  if (name) {  
      searchConditions.name = new RegExp(name, 'i'); // Case-insensitive search  
  }  
  if (status) {  
      searchConditions.status = status; // validate status value  
  }  

  try {  
      const projects = await Project.find(searchConditions).populate('tasks'); 
      return res.status(200).json(projects);  
  } catch (err) {  
      return res.status(500).json({ msg: "Error searching projects", error: err.message });  
  }  
};


module.exports = {
    getProjectById,
    newProject,
    updateProject,
    deleteProject,
    searchProjects
}
// ...
