const Thread = require("../models/threadModel");

const createThread = async (req, res) => {
    try {
        const thread = new Thread(req.body);
        await thread.save();
        return res.status(201).json({ message: "Thread created successfully", new_thread: thread });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const getThreadsByForum = async (req, res) => {
    try {
        const threads = await Thread.find({ forumId: req.params.forumId }).populate('author');
        return res.status(200).json(threads);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const getThread = async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.id).populate('author');
        if (!thread) {
            return res.status(404).json({ message: 'Thread not found' });
        }
        return res.status(200).json(thread);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createThread,
    getThreadsByForum,
    getThread
};
