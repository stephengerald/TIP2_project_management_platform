const mongoose = require ("mongoose")

const Task = require("../models/Task");
//const { startTimeTracking } = require("./timeTracking");


const newTask = async (req, res) => {  
    // Input validation  
    const { title, description, assigned_to, priority, due_date, status, comments } = req.body;  
    const errors = [];  

    // Validate required fields  
    if (!title) {  
        errors.push("Title is required.");  
    }  
    if (!description) {  
        errors.push("Description is required.");  
    }  
    if (!Array.isArray(comments) || comments.length === 0) {  
        errors.push("At least one comment is required.");  
    }  

    // Validate priority  
    if (priority && !['low', 'medium', 'high'].includes(priority)) {  
        errors.push("Priority must be 'low', 'medium', or 'high'.");  
    }  

    // Validate status  
    if (status && !['not started', 'in progress', 'completed'].includes(status)) {  
        errors.push("Status must be 'not started', 'in progress', or 'completed'.");  
    }  

    // Return validation errors if any  
    if (errors.length > 0) {  
        return res.status(400).json({ message: "Validation errors", errors });  
    }  

    try {  
        const task = new Task(req.body);  

        // Start time tracking  
        const startTime = new Date();  
        task.time_tracking.push({ start_time: startTime });  

        await task.save();  

        // Count the total number of tasks  
        const count = await Task.countDocuments();  

        res.status(201).json({  
            message: "Task created successfully.",  
            task,  
            count  
        });  
    } catch (error) {  
        console.error(error); // Log the error for debugging  
        res.status(500).json({ message: "Internal server error." });  
    }  
};  


const getTasks = async (req, res) => {  
    try {  
        const tasks = await Task.find().populate('assigned_to').populate('comments');  
        res.json(tasks);  
    } catch (error) {  
        res.status(500).json({ message: error.message });  
    }  
}

const updateTask = async (req, res) => {  
    try {  
        const { id } = req.params;  // Get ID from route parameters  
        const { title, description, priority, status } = req.body;  // Destructure the necessary fields from the request body  

        const errors = [];  

        // Validation for required fields  
        if (!title) {  
            errors.push("Please add task title");  
        }  
        if (priority && !['low', 'medium', 'high'].includes(priority)) {  
            errors.push("Priority must be 'low', 'medium', or 'high'");  
        }  

        if (!description){
            errors.push("Please add description")
        }
        if (status && !['not started', 'in progress', 'completed'].includes(status)) {  
            errors.push("Status must be 'not started', 'in progress', or 'completed'");  
        }  

        if (errors.length > 0) {  
            return res.status(400).json({ errors });  // Return validation errors  
        }  

        const updatedTask = await Task.findByIdAndUpdate(  
            id,  
            { title, description, priority, status, updated_at: Date.now() },  // Update the updated_at field  
            { new: true }  // Return the updated document  
        );  

        // Check if the task was found and updated  
        if (!updatedTask) {  
            return res.status(404).json({ message: "Task not found." });  
        }  
        
        // Return success response with the updated task  
        return res.status(200).json({ message: "Task updated successfully", task: updatedTask });  
        
    } catch (error) {  
        console.error(error);  
        return res.status(500).json({ message: "Internal server error." });  
    }  
}

const deleteTask = async (req, res) => {  
    try {  
        const { id } = req.params; // Get the task ID from the URL parameters  

        // Attempt to find and delete the task by its ID  
        const deletedTask = await Task.findByIdAndDelete(id);  

        // If no task was found, return a 404 not found response  
        if (!deletedTask) {  
            return res.status(404).json({ message: "Task not found." });  
        }  

        // Return a success response indicating the task was deleted  
        return res.status(200).json({ message: "Task deleted successfully." });  

    } catch (error) {  
        console.error(error); // Log the error to the console for debugging  
        return res.status(500).json({ message: "Internal server error." }); // Return a 500 error for any unexpected issues  
    }  
}

module.exports = {
    newTask,
    getTasks,
    updateTask,
    deleteTask
}