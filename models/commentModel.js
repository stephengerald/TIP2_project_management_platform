// models/Comment.js  
const mongoose = require('mongoose');  

const commentSchema = new mongoose.Schema({  
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },  
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },  
    content: { type: String, required: true },  
    created_at: { type: Date, default: Date.now }  
});  

module.exports = mongoose.model('Comment', commentSchema);