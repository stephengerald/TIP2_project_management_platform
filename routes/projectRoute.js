const express = require("express")
const {newProject, updateProject, deleteProject, getProjectById, searchProjects, getAllProject} = require("../controllers/projectCtrl")
const requireAdmin = require("../middleware/adminRoles");
const validateToken = require("../middleware/validateAuth");

module.exports = (io) => {
    const router = express.Router()

    // to get a project by Id
    router.get("/getProject/:id", validateToken, getProjectById);

    router.get("/getAllProjects", validateToken, getAllProject,)

    //create a new project
    router.post("/newProject", validateToken, requireAdmin, newProject(io));

    //find project and update by Id
    router.put("/updateProject/:id", validateToken, requireAdmin, updateProject(io));

    // find project and delete by Id
    router.delete("/deleteProject/:id", validateToken, requireAdmin, deleteProject);

    //search to get all available project
    router.get("/searchProject", validateToken, searchProjects)

    return router;
};

