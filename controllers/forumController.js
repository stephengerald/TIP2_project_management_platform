const Forum = require('../models/forumModel');

// Create a new forum
const createForum = async (req, res) => {
    try {
        const forum = new Forum(req.body);
        await forum.save();
        return res.status(201).json({ message: "Forum created successfully", new_forum: forum });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Retrieve all forums
const getForums = async (req, res) => {
    try {
        const forums = await Forum.find();
        return res.status(200).json({ message: "Successful", All_forums: forums });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Retrieve a specific forum by ID
const getForumById = async (req, res) => {
    try {
        const forum = await Forum.findById(req.params.id);
        if (!forum) {
            return res.status(404).json({ message: 'Forum not found' });
        }
        return res.status(200).json({ message: "Successful", single_forum: forum });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Update a forum by ID
const updateForum = async (req, res) => {
    try {
        const forum = await Forum.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!forum) {
            return res.status(404).json({ message: 'Forum not found' });
        }
        return res.status(200).json({ message: "Forum updated successfully", Updated_forum: forum });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Delete a forum by ID
const deleteForum = async (req, res) => {
    try {
        const forum = await Forum.findByIdAndDelete(req.params.id);
        if (!forum) {
            return res.status(404).json({ message: 'Forum not found' });
        }
        return res.status(200).json({ message: 'Forum deleted successfully', deleted_forum: forum });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createForum,
    getForums,
    getForumById,
    updateForum,
    deleteForum
};
