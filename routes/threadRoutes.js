const express = require('express');
const { createThread, getThreadsByForum, getThread, updateThread, deleteThread } = require('../controllers/threadController');
const validateToken = require('../middleware/validateAuth');
const router = express.Router();

// Define routes for thread operations
router.post('/forums/:forumId/create_thread', validateToken, createThread);
router.get('/forums/:forumId/threads', validateToken, getThreadsByForum);
router.get('/threads/:id', validateToken, getThread);
router.put('/update_threads/:id', validateToken, updateThread);
router.delete('/delete_threads/:id', validateToken, deleteThread);

module.exports = router;
