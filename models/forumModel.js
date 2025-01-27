const mongoose = require("mongoose");

const forumSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Forum = mongoose.model("Forum", forumSchema);

module.exports = Forum;
