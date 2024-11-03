// routes/taskRoutes.js  
const express = require('express');  
const dotenv = require(`dotenv`).config()
const bcrypt = require('bcrypt')

  
const Task = require("./models/Task");
const Comment = require('./models/Comment');
const connectToDatabase = require('./config/db');
//const Users = require('./models/User');
//const sendUserEmail = require('./sendEmail');
const router = express.Router();  

const app = express()
app.use(express.json()); // Middleware to parse JSON bodies  

const PORT = process.env.PORT || 5000; 


// Connect to Database  
connectToDatabase();  

app.listen(PORT, () => {  
    console.log(`Server running at http://localhost:${PORT}`);  
});  



// Create a task  
app.post('/createTask', async (req, res) => {  
    // Input validation  
    const { title, description, assigned_to, priority, due_date, status, dependencies, comments, project_id } = req.body;  
    const errors = [];  

    // Validate title  
    if (!title) {  
        errors.push("Title is required.");  
    }  
    if(!description){
        errors.push("Description is required")
    }

// Validate priority  
if (priority && !['low', 'medium', 'high'].includes(priority)) {  
    errors.push("Priority must be 'low', 'medium', or 'high'.");  
}

    if (status && !['not started', 'in progress', 'completed'].includes(status)) {  
        errors.push("Status must be 'not started', 'in progress', or 'completed'.");  
    }
    if(!comments){
        errors.push(`Comments are required`)
    } 

    if (errors.length > 0) {  
        return res.status(400).json({ message: "Validation errors", errors: errors });  
    }  

    try {  
        const task = new Task(req.body);  
        await task.save();  
        
        // Count the total number of tasks  
        const count = await Task.countDocuments();   
        
        res.status(201).json({  
            message: "Successful",  
            task,  
            count  
        });  
    } catch (error) {  
        res.status(400).json({ message: error.message });  
    }  
});  

// Get all tasks  
app.get('/tasks', async (req, res) => {  
    try {  
        const tasks = await Task.find().populate('assigned_to').populate('comments');  
        res.json(tasks);  
    } catch (error) {  
        res.status(500).json({ message: error.message });  
    }  
});  

// Update a task  
//app.patch('/:id', async (req, res) => {  
    //try {  
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });  
        //if (!task) return res.status(404).send('Task not found.');  
        //res.json(task);  
   // } catch (error) {  
        //res.status(400).json({ message: error.message });  
    //}  
//});  


// PUT request to update a task  
app.put(`/tasks/:id`, async (req, res) => {  
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
});  

app.delete('/tasks/:id', async (req, res) => {  
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
});  


// Create a comment  
app.post('/:taskId/comments', async (req, res) => {  
    try {  
        const comment = new Comment({ ...req.body, task_id: req.params.taskId });  
        await comment.save();  

        // Add the comment ID to the task  
        await Task.findByIdAndUpdate(req.params.taskId, { $push: { comments: comment._id } });  

        res.status(201).json(comment);  
    } catch (error) {  
        res.status(400).json({ message: error.message });  
    }  
});  

// Create a comment for a specific task  
app.post('/:taskId/comments', async (req, res) => {  
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
        await comment.save();  

        // Update the task to include the new comment ID  
        await Task.findByIdAndUpdate(taskId, { $push: { comments: comment._id } });  

        res.status(201).json(comment); // Return the created comment  
    } catch (error) {  
        console.error(error); // Log the error for debugging  
        res.status(500).json({ message: "Internal server error." }); // General server error response  
    }  
});  

// Get comments for a task  
// app.get('/:taskId/comments', async (req, res) => {  
//     try {  
//         const comments = await Comment.find({ task_id: req.params.taskId });  
//         res.json(comments);  
//    } catch (error) {  
//        res.status(500).json({ message: error.message });  
//     }  
// });  



// Route: GET /:taskId/comments  
app.get('/:taskId/comments', async (req, res) => {  
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
        res.status(200).json(comments);  
    } catch (error) {  
        console.error(error); 
        res.status(500).json({ message: "Internal server error." }); // Handle server errors  
    }  
});  

// Route: PUT /comments/:commentId  
app.put('/:commentId', async (req, res) => {  
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
        res.status(200).json(comment);  
    } catch (error) {  
        console.error(error); // Log the error for debugging  
        res.status(500).json({ message: "Internal server error." }); // Handle server errors  
    }  
});  

// Route: DELETE /comments/:commentId  
app.delete('/:commentId', async (req, res) => {  
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
        res.status(200).json({ message: "Comment deleted successfully." });  
    } catch (error) {  
        console.error(error); // Log the error for debugging  
        res.status(500).json({ message: "Internal server error." }); // Handle server errors  
    }  
});
