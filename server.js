
// routes/taskRoutes.js  
const express = require("express");
const connectToDatabase = require("./configuration/DB")
const Users = require("./models/userModel");
const Project = require("./models/project")
const dotenv = require("dotenv").config();
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const sendUserEmail = require("./sendEmail");
const mongoose = require('mongoose');
const { Server } = require("socket.io");
const http = require('http');
const cors = require("cors");
const morgan = require("morgan");
const userRouter = require("./routes/userRoute")
const projectRoute = require("./routes/projectRoute")
const collaborationRoute = require("./routes/collaborationRoute")
const fileRoutes = require("./routes/fileRoutes");
const Task = require("./models/Task");
const Comment = require('./models/Comment');
const connectToDatabase = require('./config/db');
const TaskRouter = require('./routes/taskRoute')


//const Users = require('./models/User');
//const sendUserEmail = require('./sendEmail'); 

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

/*
const app = express()
app.use(express.json()); // Middleware to parse JSON bodies  

// const PORT = process.env.PORT || 5000; 
*/

// Route middleware
projectPlatform.use("/api", userRouter);
projectPlatform.use("/api", projectRoute);
projectPlatform.use("/api", collaborationRoute);
projectPlatform.use("/api", fileRoutes);

// Connect to Database  
connectToDatabase();  
/*
app.listen(PORT, () => {  
    console.log(`Server running at http://localhost:${PORT}`);  
});  

app.use("/api",TaskRouter)


    socket.on("taskUpdate", (data) => {
        io.to(data.projectId).emit("taskUpdate", data);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});
*/

projectPlatform.use((req, res) => {
    return res.status(404).json({ message: "This endpoint does not exist yet" });
});

