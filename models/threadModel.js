const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    forumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Forum', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Thread = mongoose.model("Thread", threadSchema);

module.exports = Thread;
