const Thread = require('../models/threadModel');

// Create a new thread
const createThread = async (req, res) => {
    try {
        const thread = new Thread(req.body);
        await thread.save();
        return res.status(201).json({ message: "Thread created successfully", new_thread: thread });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Retrieve threads by forum ID
const getThreadsByForum = async (req, res) => {
    try {
        const threads = await Thread.find({ forumId: req.params.forumId }).populate('author');
        return res.status(200).json({ message: "Successful", all_threads: threads });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Retrieve a specific thread by ID
const getThread = async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.id).populate('author');
        if (!thread) {
            return res.status(404).json({ message: 'Thread not found' });
        }
        return res.status(200).json({ message: "Successful", threads: thread });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Update a thread by ID
const updateThread = async (req, res) => {
    try {
        const thread = await Thread.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!thread) {
            return res.status(404).json({ message: 'Thread not found' });
        }
        return res.status(200).json({ message: "Thread updated successfully", updated_thread: thread });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Delete a thread by ID
const deleteThread = async (req, res) => {
    try {
        const thread = await Thread.findByIdAndDelete(req.params.id);
        if (!thread) {
            return res.status(404).json({ message: 'Thread not found' });
        }
        return res.status(200).json({ message: 'Thread deleted successfully', deleted_thread: thread });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createThread,
    getThreadsByForum,
    getThread,
    updateThread,
    deleteThread
};
