const express = require('express');
const validateToken = require('../middleware/validateAuth');
const { createNotification, getNotifications, markNotificationAsRead } = require('../controllers/notificationController');

module.exports = (io) => {
    const router = express.Router();

    router.post("/notification", validateToken, createNotification);
    router.get("/getnotification/userId", validateToken, getNotifications);
    router.put("/marknotifications/:notificationId/read", validateToken, markNotificationAsRead);

    return router;
};
