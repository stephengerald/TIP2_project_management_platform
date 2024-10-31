
// models/Task.js  
const mongoose = require('mongoose');  

const taskSchema = new mongoose.Schema({  
    title: { type: String, required: true },  
    description: { type: String },  
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }, // Change to 'Users'  
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },  
    due_date: { type: Date },  
    status: { type: String, enum: ['not started', 'in progress', 'completed'], default: 'not started' },
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],  
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],    
    created_at: { type: Date, default: Date.now },  
    updated_at: { type: Date, default: Date.now },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }    
});  

module.exports = mongoose.model('Task', taskSchema);