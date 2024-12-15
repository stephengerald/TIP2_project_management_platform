const express = require('express');
const validateToken = require('../middleware/validateAuth');
const { updateTask, deleteTask, getTasks, createTask } = require('../controllers/taskCtrl');
const requireAdmin = require('../middleware/adminRoles');

module.exports = (io) => {
    const router = express.Router();

router.post('/createtasks', validateToken, requireAdmin, createTask(io));
router.put('/updatetasks/:id', validateToken, requireAdmin, updateTask(io));
router.delete('/deletetasks/:id', validateToken, requireAdmin, deleteTask);
router.get('/getAllTask', getTasks);

    return router;
};
