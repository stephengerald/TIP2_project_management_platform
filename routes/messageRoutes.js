const express = require('express');
const validateToken = require('../middleware/validateAuth');
const { sendMessage, getMessages, markMessageAsRead } = require('../controllers/messageController');

module.exports = (io) => {
    const router = express.Router();

    router.post("/sendmessages", validateToken, sendMessage(io));
    router.get("/getmessages/:userId", validateToken, getMessages);
    router.put("/markMessages", validateToken, markMessageAsRead);

    return router;
};
