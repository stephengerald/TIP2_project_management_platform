const express = require('express');
const validateToken = require('../middleware/validateAuth');
const { newTask, updateTask, deleteTask, getTasks } = require('../controllers/taskCtrl');
const requireAdmin = require('../middleware/adminRoles');

const router = express.Router();

router.post('/createtasks', validateToken, requireAdmin, newTask);
router.put('/updatetasks/:id', validateToken, requireAdmin, updateTask);
router.delete('/deletetasks/', validateToken, requireAdmin, deleteTask);
router.get('/getAllTask',  getTasks);

module.exports = router;
