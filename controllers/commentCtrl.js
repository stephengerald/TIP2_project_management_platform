const mongoose = require ('mongoose');

const Comment = require('../models/commentModel');



const createComt = async (req, res) => {  
    try {  
        const { content } = req.body; // Destructure content from request body  
        const { taskId } = req.params; // Get taskId from route parameters  

        // Validate input  
        if (!content) {  
            return res.status(400).json({ message: "Comment content is required." });  
        }  

        // Find the task to ensure it exists  
        const task = await Task.findById(taskId);  
        if (!task) {  
            return res.status(404).json({ message: "Task not found." });  
        }  

        // Create and save the comment  
        const comment = new Comment({ content, task_id: taskId, user_id: req.user._id }); // Ensure user_id is set correctly  
        await Comment.save();  

        // Update the task to include the new comment ID  
        await Task.findByIdAndUpdate(taskId, { $push: { comments: comment._id } });  

        return res.status(201).json(comment); // Return the created comment  
    } catch (error) {  
        console.error(error); // Log the error for debugging  
        return res.status(500).json({ message: "Internal server error." }); // General server error response  
    }  
}

const getComt = async (req, res) => {  
    try {  
        const taskId = req.params.taskId; // Get taskId from route parameters  

        // Fetch comments associated with the task and populate user details  
        const comments = await Comment.find({ task_id: taskId })  
                                       .populate('user_id', 'username email') // Populate user details (username and email)  
                                       .populate('task_id', 'title description'); 

        // If no comments found, return an empty array  
        if (!comments.length) {  
            return res.status(200).json([]);  
        }  

        // Respond with the populated comments  
        return res.status(200).json(comments);  
    } catch (error) {  
        console.error(error); 
        return res.status(500).json({ message: "Internal server error." }); // Handle server errors  
    }  
}

const updateComt = async (req, res) => {  
    try {  
        const commentId = req.params.commentId; // Get commentId from route parameters  
        const { content } = req.body; // Destructure content from the request body  

        // Check if content is provided  
        if (!content) {  
            return res.status(400).json({ message: "Comment content is required." });  
        }  

        // Find the comment by ID  
        const comment = await Comment.findById(commentId);  
        
        // Check if the comment exists  
        if (!comment) {  
            return res.status(404).json({ message: "Comment not found." });  
        }  

        // Update the comment  
        comment.content = content; // Update the content of the comment  
        await comment.save(); // Save the updated comment to the database  

        // Respond with the updated comment  
        return res.status(200).json(comment);  
    } catch (error) {  
        console.error(error); // Log the error for debugging  
        return res.status(500).json({ message: "Internal server error." }); // Handle server errors  
    }  
}

const deleteComt = async (req, res) => {  
    try {  
        const commentId = req.params.commentId; // Get commentId from route parameters  

        // Find the comment by ID  
        const comment = await Comment.findById(commentId);  
        
        // Check if the comment exists  
        if (!comment) {  
            return res.status(404).json({ message: "Comment not found." });  
        }  

        // Delete the comment  
        const deletedComment = await Comment.findByIdAndDelete(commentId); // remove from the database 
        
        // Check if the deletion was successful  
        if (!deletedComment) {  
            return res.status(400).json({ message: "Unsuccessful deletion." });  
        }  

        // Respond with a success message  
        return res.status(200).json({ message: "Comment deleted successfully." });  
    } catch (error) {  
        console.error(error); // Log the error for debugging  
        return res.status(500).json({ message: "Internal server error." }); // Handle server errors  
    }  
}

module.exports = {
    createComt,
    getComt,
    updateComt,
    deleteComt
}