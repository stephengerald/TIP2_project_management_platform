const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  milestones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' }],
  isAvailable: { type: Boolean, default: true },
}, {
    timestamps: true
}
);

const Project = new mongoose.model("Project", projectSchema)


module.exports = Project

