const mongoose = require('mongoose');  

const projectSchema = new mongoose.Schema({  
  projectTitle: {  type: String,  required: true,  trim: true,  },  
  projectType: {  type: String,  required: true,  enum: ['Development', 'Design', 'Research', 'Marketing'], }, // not stated yet 
  projectDescription: {  type: String,  required: true,  trim: true,  },  
  startDate: {  type: Date,  required: true,  },  
  endDate: {  type: Date,  required: true,  },  
  projectRoles: [{  
      role: {  
          type: String,  
          enum: [  
              'Product Manager',  
              'Product Team Lead',  
              'Data Analyst',  
              'UX/UI Designer',  
              'Technical Product Manager',  
              'Product Marketing Manager',  
              'Agile Coach',  
              'Software Engineer',  
          ],  
          required: true,  
      },  
  assignedTo: {  type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true,  },  
  }],  
  created_at: {  type: Date,  default: Date.now,  
  },  
  updated_at: {  type: Date,  default: Date.now,  
  },  
});  
// Update the updated_at field before saving 
projectSchema.pre('save', function (next) {  
    this.updated_at = Date.now();  
    next();  
});  

const Project = mongoose.model('Project', projectSchema);  
module.exports = Project;
