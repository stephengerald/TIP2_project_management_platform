const express = require("express")
const {newProject,updateProject, deleteProject, getProjectById, searchProjects, getAllProject} = require("../controllers/projectCtrl")
const {validateProjectAdmin} = require("../middleware/validProject")


const router = express.Router()


// to get a project by Id
router.get("/getProject/:id", getProjectById);

router.get("/getAllProjects/:id", getAllProject,)
//create a new project
router.post("/newProject", validateProjectAdmin, newProject)

//find project and update by Id
router.put("/updateProject/:id", validateProjectAdmin, updateProject);

// find project and delete by Id
router.delete("/deleteProject/:id", validateProjectAdmin, deleteProject);

//search to get all available project
router.get("/searchProject", searchProjects)



module.exports = router;
