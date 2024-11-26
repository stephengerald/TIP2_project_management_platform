const express = require('express');
const validateToken = require('../middleware/validateAuth');
const { newTask, updateTask, deleteTask, getTasks } = require('../controllers/taskCtrl');
const requireAdminRole = require('../middleware/adminRoles');

const router = express.Router();

router.post('/createtasks', requireAdminRole, newTask);
router.put('/updatetasks/:id', validateToken, updateTask);
router.delete('/deletetasks/', validateToken, deleteTask);
router.get('/getAllTask',  getTasks);

module.exports = router;
