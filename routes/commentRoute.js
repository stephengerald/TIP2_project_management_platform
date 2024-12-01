const express = require('express');
const { createComment, getComments, updateComment } = require('../controllers/commentCtrl');




const router = express.Router()

// Create a comment for a specific task 
router.post('/createcomments',createComment);
// Get comments for a task 
router.get('/getcomments',getComments);
// Route: updatecomments/
router.put('/updatecomment/:id',updateComment);
// Route: deletecomments
router.delete('/deletecomment/:id', deleteComt);

module.exports = router