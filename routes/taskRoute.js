const express = require('express');
const validateToken = require('../middleware/validateAuth');
const { updateTask, deleteTask, getTasks, createTask } = require('../controllers/taskCtrl');
const requireAdmin = require('../middleware/adminRoles');

const router = express.Router();

router.post('/createtasks', validateToken, requireAdmin, createTask);
router.put('/updatetasks/:id', validateToken, requireAdmin, updateTask);
router.delete('/deletetasks/', validateToken, requireAdmin, deleteTask);
router.get('/getAllTask',  getTasks);

module.exports = router;
