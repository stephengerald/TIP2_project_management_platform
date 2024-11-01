const mongoose = require("mongoose");
// const { content } = require("pdfkit/js/page");

const collaborationSchema = new mongoose.Schema({
    type: { type: String, required: true, enum: ["message", "file", "notification"] },
    content: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    projectId: {type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const Collaboration = mongoose.model("collaboration", collaborationSchema);

module.exports = Collaboration