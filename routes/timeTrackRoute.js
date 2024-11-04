const express = require('express');  
const { startTimeTracking, stopTimeTracking, getTimesheet } = require('../controllers/timeTracking');
const router = express.Router();  

router.post('/tasks/:id/start-time-tracking', startTimeTracking);  
router.post('/tasks/:id/stop-time-tracking', stopTimeTracking);  
router.get('/tasks/:id/timesheet', getTimesheet);  

module.exports = router;