const express = require ('express')
const { newTask, getTasks, updateTask, deleteTask } = require("../controllers/taskCtrl");



const router = express.Router()


//create a comment
router.post('/createTask',newTask)
//get comments
router.get('/tasks',getTasks);
//update comments
router.put(`/tasks/:id`,updateTask);
//delete comments
router.delete('/tasks/:id',deleteTask);

module.exports = router