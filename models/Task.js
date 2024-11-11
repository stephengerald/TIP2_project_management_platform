
// models/Task.js  
const mongoose = require('mongoose');  

const taskSchema = new mongoose.Schema({  
    title: { type: String, required: true },  
    description: { type: String },  
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },  
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },  
    due_date: { type: Date },  
    status: { type: String, enum: ['not started', 'in progress', 'completed'], default: 'not started' },
    //dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],  
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],  
    created_at: { type: Date, default: Date.now },  
    updated_at: { type: Date, default: Date.now },
    //project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },   
    time_tracking: [{  
        start_time: { type: Date },  
        end_time: { type: Date },  
        duration: { type: Number }, // Duration in minutes  
        description: { type: String } // Optional description for the time entry  
    }],  
    total_time: { type: Number, default: 0 } // Total time spent in minutes  
});  

// Update the updated_at field before saving  
taskSchema.pre('save', function(next) {  
    this.updated_at = Date.now();  
    next();  
});  

const Task = mongoose.model('Task', taskSchema); 
