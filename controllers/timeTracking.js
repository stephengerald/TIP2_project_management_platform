const mongoose = require('mongoose')

const Task = require("../models/Task");


const startTimeTracking = async (req, res) => {  
    const { id } = req.params;  

    // Validate the ID format  
    if (!mongoose.Types.ObjectId.isValid(id)) {  
        return res.status(400).json({ message: "Invalid task ID format." });  
    }  

    try {  
        const task = await Task.findById(id);  
        if (!task) {  
            return res.status(404).json({ message: "Task not found." });  
        }  

        // Check if there is an ongoing time tracking entry  
        const ongoingTracking = task.time_tracking.find(entry => !entry.end_time);  
        if (ongoingTracking) {  
            return res.status(400).json({ message: "Time tracking is already in progress." });  
        }  

        // Start time tracking  
        const startTime = new Date();  
        task.time_tracking.push({ start_time: startTime });  
        await task.save();  

        return res.status(200).json({  
            message: "Time tracking started.",  
            taskId: task._id,  
            trackingEntry: task.time_tracking[task.time_tracking.length - 1] // Return the last tracking entry  
        });  
    } catch (error) {  
        console.error(error);  
        return res.status(500).json({ message: "Internal server error." });  
    }  
};


const stopTimeTracking = async (req, res) => {  
    const { id } = req.params;  

    // Validate the ID format  
    if (!mongoose.Types.ObjectId.isValid(id)) {  
        return res.status(400).json({ message: "Invalid task ID format." });  
    }  

    try {  
        const task = await Task.findById(id);  
        if (!task) {  
            return res.status(404).json({ message: "Task not found." });  
        }  

        // Find the latest ongoing tracking entry  
        const ongoingTracking = task.time_tracking.find(entry => !entry.end_time);  
        if (!ongoingTracking) {  
            return res.status(400).json({ message: "No ongoing time tracking found." });  
        }  

        // Stop time tracking  
        ongoingTracking.end_time = new Date();  
        ongoingTracking.duration = (ongoingTracking.end_time - ongoingTracking.start_time) / (1000 * 60); // Duration in minutes  
        task.total_time += ongoingTracking.duration; // Update total time  

        await task.save();  

        return res.status(200).json({  
            message: "Time tracking stopped.",  
            taskId: task._id,  
            trackingEntry: ongoingTracking  
        });  
    } catch (error) {  
        console.error(error);  
        return res.status(500).json({ message: "Internal server error." });  
    }  
};

const getTimesheet = async (req, res) => {  
    const { id } = req.params;  
    try {  
        const task = await Task.findById(id).populate('comments');  
        if (!task) {  
            return res.status(404).json({ message: "Task not found." });  
        }  

        return res.status(200).json({ task: { title: task.title, time_entries: task.time_entries, total_time: task.total_time } });  
    } catch (error) {  
        console.error(error);  
        return res.status(500).json({ message: "Internal server error." });  
    }  
};

module.exports = {
    startTimeTracking,
    stopTimeTracking,
    getTimesheet
}