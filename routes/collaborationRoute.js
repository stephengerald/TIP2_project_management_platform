const express = require("express");
const validateToken = require("../middleware/validateAuth");
const { newCollaborationFn, allCollaborationFn, singleCollaborationFn, updateCollaborationFn, deleteCollaborationFn, generateCollaborationReportFn } = require("../controllers/collaborationCtrl");
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

//Route for generating collaboration report PDF
router.get("/collaboration/:id/report", validateToken, generateCollaborationReportFn)

module.exports = router;