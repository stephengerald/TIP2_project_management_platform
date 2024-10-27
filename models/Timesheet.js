
const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dateRange: { start: Date, end: Date },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});

module.exports = mongoose.model('Timesheet', timesheetSchema);
