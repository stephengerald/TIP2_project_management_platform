const express = require("express");
const connectToDatabase = require("./configuration/DB");
const dotenv = require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const { Server } = require("socket.io");
const http = require('http');
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

// Initialize express app
const projectPlatform = express();
const server = http.createServer(projectPlatform);
const io = new Server(server, {
    cors: {
        origin: "*", // Configure this based on your front-end UR
    }
}); 


// Import Routes
const userRouter = require("./routes/userRoute");
const projectRoute = require("./routes/projectRoute")(io);
const collaborationRoute = require("./routes/collaborationRoute")
const fileRoutes = require("./routes/fileRoutes");
const forumRoutes = require("./routes/forumRoutes");
const threadRoutes = require("./routes/threadRoutes");
const TaskRouter = require('./routes/taskRoute')(io);
const CommentRoutes = require("./routes/commentRoute");
const notificationRoutes = require("./routes/notificationRoutes")(io);
const messageRoutes = require("./routes/messageRoutes")(io);

/*
const corsOptions = {
    origin: 'http://your-frontend-domain.com', // Adjust as necessary
    optionsSuccessStatus: 200
};
projectPlatform.use(cors(corsOptions));
*/

// Middleware
projectPlatform.use(express.json());
projectPlatform.use(cors());
projectPlatform.use(morgan("combined"));
projectPlatform.use(cookieParser());

const PORT = process.env.PORT || 9000;

// ConnectTo DATABASE
connectToDatabase();

// Route middleware
projectPlatform.use("/api", userRouter);
projectPlatform.use("/api", projectRoute);
projectPlatform.use("/api", collaborationRoute);
projectPlatform.use("/api", fileRoutes);
projectPlatform.use("/api", forumRoutes);
projectPlatform.use("/api", threadRoutes);
projectPlatform.use("/api", TaskRouter);
projectPlatform.use("/api", CommentRoutes);
projectPlatform.use("/api", messageRoutes);
projectPlatform.use("/api", notificationRoutes);

// Socket.io setup 
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join the user to a room identified by their user ID
    socket.on('join', (userId) => { 
        socket.join(userId); 
        console.log(`User ${userId} joined room ${userId}`); 
    });


    socket.on("message", (data) => {
        io.to(data.projectId).emit("message", data);
    });

    socket.on("taskUpdate", (data) => {
        io.to(data.projectId).emit("taskUpdate", data);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

// Handle 404
projectPlatform.use((req, res) => {
    return res.status(404).json({ message: "This endpoint does not exist yet" });
});


// Start server
server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});