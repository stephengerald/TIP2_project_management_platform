const mongoose = require('mongoose');
 
const projectSchema = new mongoose.Schema({  
  name: { type: String, required: true }, // Make name required  
  description: { type: String }, // description of the project 
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], 
  status: {  
    type: String,  
    enum: ['not_started', 'in_progress', 'completed', 'on_hold'], // Define valid statuses  
    default: 'not_started' // Set a default status  
  },  
  isAvailable: { type: Boolean, default: true },  
}, {  
  timestamps: true // Automatically add createdAt and updatedAt  
});  

const Project = mongoose.model("Project", projectSchema);  

module.exports = Project; 

