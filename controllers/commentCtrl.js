const Comment = require('../models/commentModel');
const Task = require('../models/taskModel');

// Create a new comment
const createComment = async (req, res) => {
    const { text, taskId } = req.body;

    if (!text) {
        return res.status(400).json({ message: "Comment text is required." });
    }

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const comment = new Comment({
            text,
            author: req.user._id,
            task: task._id
        });

        await comment.save();

        task.comments.push(comment._id);
        await task.save();

        return res.status(201).json({ message: 'Comment created successfully', comment });
    } catch (error) {
        console.error("Error creating comment:", error);
        return res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

// Get comments for a task
const getComments = async (req, res) => {
    const { taskId } = req.params;

    try {
        const comments = await Comment.find({ task: taskId }).populate('author', 'fullname email');
        return res.status(200).json({ comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

// Update a comment
const updateComment = async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: "Comment text is required." });
    }

    try {
        const comment = await Comment.findByIdAndUpdate(id, { text }, { new: true });
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        return res.status(200).json({ message: 'Comment updated successfully', comment });
    } catch (error) {
        console.error("Error updating comment:", error);
        return res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    const { id } = req.params;

    try {
        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const task = await Task.findById(comment.task);
        if (task) {
            task.comments.pull(comment._id);
            await task.save();
        }

        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

module.exports = {
    createComment,
    getComments,
    updateComment,
    deleteComment
};
