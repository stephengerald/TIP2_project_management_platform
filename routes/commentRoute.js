const express = require('express');
const { createComment, getComments, updateComment, deleteComment } = require('../controllers/commentCtrl');
const validateToken = require('../middleware/validateAuth');




const router = express.Router()

// Create a comment for a specific task 
router.post('/createcomments', validateToken, createComment);
// Get comments for a task 
router.get('/getcomments', getComments);
// Route: updatecomments/
router.put('/updatecomment/:id', updateComment);
// Route: deletecomments
router.delete('/deletecomment/:id', deleteComment);

module.exports = router