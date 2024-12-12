const Notification = require('../models/notificationModel');

// Create a new notification
const createNotification = (io) => async (req, res) => {
    const { user, message, link } = req.body;

    try {
        const notification = new Notification({ user, message, link });
        await notification.save();

        // Emit notification to the user
        io.to(user).emit('notification', notification);

        return res.status(201).json({ message: 'Notification created successfully', notification });
    } catch (error) {
        console.error("Error creating notification:", error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get notifications for a user
const getNotifications = async (req, res) => {
    const { userId } = req.params;

    try {
        const notifications = await Notification.find({ user: userId });
        return res.status(200).json({ notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
    const { notificationId } = req.params;

    try {
        const notification = await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
        return res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    markNotificationAsRead
};
