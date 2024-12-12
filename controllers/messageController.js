const Message = require('../models/messageModel');
const User = require('../models/userModel');

// Send a new message
const sendMessage = (io) => async (req, res) => {
    const { from, to, subject, body } = req.body;

    try {
        const sender = await User.findById(from);
        const recipient = await User.findById(to);

        if (!sender || !recipient) {
            return res.status(404).json({ message: 'Sender or recipient not found' });
        }

        const message = new Message({ from, to, subject, body });
        await message.save();

        // Emit message event to the recipient user
        io.to(to).emit('newMessage', message);

        return res.status(201).json({ message: 'Message sent successfully', message });
    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get messages for a user
const getMessages = async (req, res) => {
    const { userId } = req.params;

    try {
        const messages = await Message.find({ to: userId }).populate('from', 'fullname email');
        return res.status(200).json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Mark message as read
const markMessageAsRead = async (req, res) => {
    const { messageId } = req.params;

    try {
        const message = await Message.findByIdAndUpdate(messageId, { read: true }, { new: true });
        return res.status(200).json({ message: 'Message marked as read', message });
    } catch (error) {
        console.error("Error marking message as read:", error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    markMessageAsRead
};
