const express = require('express');
const validateToken = require('../middleware/validateAuth');
const { newTask, updateTask, deleteTask, getTasks } = require('../controllers/taskCtrl');

const router = express.Router();

router.post('/createtasks', validateToken, newTask);
router.put('/updatetasks/:id', validateToken, updateTask);
router.delete('/deletetasks/', validateToken, deleteTask);
router.get('/getAllTask', validateToken, getTasks);

module.exports = router;
