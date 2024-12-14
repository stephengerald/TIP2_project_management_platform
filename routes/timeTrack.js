const express = require("express");
const { startTimeTracking, stopTimeTracking, getTimesheet } = require("../controllers/timeTracking");
const requireAdminRole = require("../middleware/adminRoles");
const validateToken = require("../middleware/validateAuth");

const router = express.Router();

router.post('/trackTime/:id', validateToken, requireAdminRole, startTimeTracking);
router.post('/stopTimeTrack/:id', validateToken, requireAdminRole, stopTimeTracking);
router.get('/getTimeSheet/:id', validateToken, requireAdminRole, getTimesheet);

module.exports = router