const mongoose = require ("mongoose")
const Comment = require('../models/commentModel');
const Task = require("../models/Task");
const { validEmail } = require("../middleware/validations");
const User = require("../models/userModel");
const { pagination } = require("../utility/pagenation");
const sendTaskEmail = require("../emails/taskmail");
//const { startTimeTracking } = require("./timeTracking");
const nodemailer = ("nodemailer")


const createTask = (io) => async (req, res) => {
    console.log("Request body:", req.body);
    const { title, type, description, assigned_to_email, priority, start_date, end_date, status, comments } = req.body;

    console.log("Assigned to email:", assigned_to_email); // Log the assigned_to_email

    // Input validation
    const errors = [];
    if (!title) errors.push("Title is required.");
    if (!type) errors.push("Task type is required.");
    if (!start_date) errors.push("Please input start date.");
    if (!end_date) errors.push("Please input the end date.");
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
        errors.push("Priority must be 'low', 'medium', or 'high'.");
    }
    if (status && !['pending', 'in progress', 'completed', 'on hold'].includes(status)) {
        errors.push("Status must be 'pending', 'in progress', 'completed, or 'on hold'.");
    }
    if (errors.length > 0) {
        return res.status(400).json({ message: "Validation errors", errors });
    }

    try {
        let user = await User.findOne({ email: assigned_to_email });
        let task = null;

        if (user) {
            // User exists, assign task
            task = new Task({
                title,
                type,
                description,
                assigned_to: user._id,
                priority,
                start_date,
                end_date,
                status,
                created_by: req.user._id
            });

            await task.save();

            // Send notification email to the user
            sendTaskEmail(assigned_to_email, `You have been assigned a new task: ${title}`, `You have been assigned a new task. Please log in to check the details.`);

            // Emit real-time event
            io.to(user._id).emit('newTask', task);
        } else {
            // User does not exist, create task without assigned user
            task = new Task({
                title,
                type,
                description,
                priority,
                start_date,
                end_date,
                status,
                created_by: req.user._id
            });

            await task.save();

            // Send invitation email to the user
            sendTaskEmail(assigned_to_email, `You have been invited to collaborate on a new task: ${title}`, `You have been invited to collaborate on a new task. Please register to view the details.`);
        }

        // Handle comments
        if (comments && comments.length > 0) {
            const commentDocs = await Promise.all(comments.map(async (commentContent) => {
                const comment = new Comment({ text: commentContent, author: req.user._id, task: task._id });
                await comment.save();
                return comment._id;
            }));
            task.comments = commentDocs;
            await task.save();
        }

        // Count the total number of tasks
        const count = await Task.countDocuments();

        return res.status(201).json({
            message: "Task created successfully.",
            task,
            count
        });
    } catch (error) {
        console.error("Error creating task:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const getTasks = async (req, res) => {
    try {
        const{page, limit,skip} = pagination(req)

        const tasks = await Task.find().limit(limit).skip(skip).sort({created_at: -1})
        .populate('assigned_to', 'fullname email');
        const totalTasks = await Task.countDocuments();
        return res.status(200).json({total: totalTasks, tasks, page });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const updateTask = (io) => async (req, res) => {
    const { id } = req.params;
    const { title, type, description, assigned_to, priority, start_date, end_date, status } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(
            id,
            {
                title,
                type,
                description,
                assigned_to,
                priority,
                start_date,
                end_date,
                status
            },
            { new: true }
        );

        if (!task) return res.status(404).json({ message: 'Task not found' });

        io.to(task.assigned_to).emit('updateTask', task);

        return res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        console.error("Error updating task:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByIdAndDelete(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error("Error deleting task:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};
