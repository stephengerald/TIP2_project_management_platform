const express = require('express');
const router = express.Router();
const Project = require('../models/project');

const newProject = async (req, res) =>{
  try {
    const project = new Project(req.body);
    await project.save();
    res.send(project);
  } catch (err) {
    res.status(400).send(err);
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findById((req.params.id)).populate('tasks').populate('milestones');
    res.send(project);
  } catch (err) {
    res.status(404).send(err);
  }
};

const updateProject = async (req, res) => {
    const { status } = req.body;
    try {
        const Projects = await Project.findById(req.params.id);
        if (!Projects) {
            return res.status(404).json({ msg: ' request not found' });
        }
        Project.status = status;
        await Projects.save();
        res.json(Projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const deleteProject = async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Project has been removed' });

        Project.isAvailable = false;
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const searchProject = async (req, res) => {
    try {
        const Projects = await Project.find({ isAvailable: true });
        res.json(Projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


module.exports = {
    getProject,
    newProject,
    updateProject,
    deleteProject,
    searchProject
}
// ...
