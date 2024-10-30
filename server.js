const express = require("express");
const connectToDatabase = require("./configuration/DB")
const Users = require("./models/userModel");
const Project = require("./models/project")
const dotenv = require("dotenv").config();
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const sendUserEmail = require("./sendEmail");
const cors = require("cors");
const morgan = require("morgan");
const userRouter = require("./routes/userRoute")
const projectRoute = require("./routes/projectRoute")


const projectPlatform = express();

projectPlatform.use(express.json());
projectPlatform.use(cors());
projectPlatform.use(morgan("combined"));

const PORT = process.env.PORT || 9000;

// ConnectTo DATABASE

connectToDatabase();



projectPlatform.use("/api", userRouter);
projectPlatform.use("/api", projectRoute)


projectPlatform.use((req, res) => {
    return res.status(404).json({ message: "This endpoint does not exist yet" });
});

projectPlatform.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});