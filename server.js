const express = require("express");
const connectToDatabase = require("./configuration/DB")
const Users = require("./models/userModel");
const Project = require("./models/projectModel")
const dotenv = require("dotenv").config();
<<<<<<< HEAD
const bcrypt = require("bcryptjs");
=======
const bcryptjs = require("bcryptjs");
const cookieParser = require("cookie-parser")
>>>>>>> c1d360e11f773a98196f953410a0effec8f6fae1
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

projectPlatform.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

projectPlatform.use("/api", userRouter);
projectPlatform.use("/api", projectRoute)




projectPlatform.use((req, res) => {
    return res.status(404).json({ message: "This endpoint does not exist yet" });
});