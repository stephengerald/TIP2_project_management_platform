const mongoose = require('mongoose')

const Task = require("../models/Task");


const startTimeTracking = async (req, res) => {  
    const { id } = req.params;  
    try {  
        const task = await Task.findById(id);  
        if (!task) {  
            return res.status(404).json({ message: "Task not found." });  
        }  

        // Start time tracking  
        const startTime = new Date();  
        task.time_entries.push({ start_time: startTime });  
        await task.save();  

        return res.status(200).json({ message: "Time tracking started.", task });  
    } catch (error) {  
        console.error(error);  
        return res.status(500).json({ message: "Internal server error." });  
    }  
};

const stopTimeTracking = async (req, res) => {  
    const { id } = req.params;  
    try {  
        const task = await Task.findById(id);  
        if (!task) {  
            return res.status(404).json({ message: "Task not found." });  
        }  

        // Stop time tracking  
        const lastEntry = task.time_entries[task.time_entries.length - 1];  
        if (!lastEntry || lastEntry.end_time) {  
            return res.status(400).json({ message: "No active time tracking session." });  
        }  

        const endTime = new Date();  
        lastEntry.end_time = endTime;  
        lastEntry.duration = Math.round((endTime - lastEntry.start_time) / 60000); // Duration in minutes  
        task.total_time += lastEntry.duration; // Update total time  
        await task.save();  

        return res.status(200).json({ message: "Time tracking stopped.", task });  
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