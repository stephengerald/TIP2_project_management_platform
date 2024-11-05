const express = require('express');
const { createForum, getForums, getForumById, updateForum, deleteForum } = require('../controllers/forumController');
const validateToken = require('../middleware/validateAuth');
const router = express.Router();

router.post("/create_forums", validateToken, createForum);
router.get("/all_forums", validateToken, getForums);
router.get("/single_forums/:id", validateToken, getForumById);
router.put("/update_forums/:id", validateToken, updateForum);
router.delete("/delete_forums/:id", validateToken, deleteForum);

module.exports = router;
