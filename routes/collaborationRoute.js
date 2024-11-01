const express = require("express");
const validateToken = require("../middleware/validateAuth");
const { newCollaborationFn, allCollaborationFn, singleCollaborationFn, updateCollaborationFn, deleteCollaborationFn } = require("../controllers/collaborationCtrl");
const router = express.Router();

//To create new collaboration
router.post("/create-collaboration", validateToken, newCollaborationFn);

//To get all collaboration
router.get("/all-collaboration", validateToken, allCollaborationFn);

//To get single collaboration 
router.get("/single-collaboration", validateToken, singleCollaborationFn);

//To update collaboration
router.put("/update-collaboration", validateToken, updateCollaborationFn);

//To delete collaboration 
router.delete("/delete-collaboration", validateToken, deleteCollaborationFn);


module.exports = router;