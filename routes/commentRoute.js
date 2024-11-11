const express = require('express')
const { createComt, getComt, updateComt, deleteComt } = require("../controllers/commentCtrl");



const router = express.Router()

// Create a comment for a specific task 
router.post('/:taskId/comments',createComt);
// Get comments for a task 
router.get('/:taskId/comments',getComt);
// Route: PUT /comments/:commentId 
router.put('/:commentId',updateComt);
// Route: DELETE /comments/:commentId 
router.delete('/:commentId', deleteComt);

module.exports = router