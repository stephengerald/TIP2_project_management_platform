const Forum = require("../models/forumModel");

const createForum = async (req, res) => {
    try {
        const forum = new Forum(req.body);
        await forum.save();
        return res.status(201).json({ message: "Created successfully", new_forum: forum });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const getForums = async (req, res) => {
    try {
        const forums = await Forum.find();
        return res.status(200).json({ message: "Successful", all_forums: forums });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createForum,
    getForums
};
