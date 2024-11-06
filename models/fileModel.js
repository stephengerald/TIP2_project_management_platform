const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    filePath: { type: String, required: true },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    uploadDate: { type: Date, default: Date.now },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
