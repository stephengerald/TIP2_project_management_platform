const express = require("express")
const {getProject,newProject,updateProject, deleteProject, searchProject} = require("../controllers/projectCtrl")
const {validateProjectAdmin} = require("../middleware/validProject")


const router = express.Router()


// to get a project by Id
router.get("/getProject/:id",  getProject);

//create a new project
router.post("/newProject", validateProjectAdmin, newProject)

//find project and update by Id
router.put("/updateProject/:id", validateProjectAdmin, updateProject);

// find project and delete by Id
router.delete("/deleteProject/:id", validateProjectAdmin, deleteProject);

//search to get all available project
router.get("/searchProject", searchProject)



module.exports = router;
