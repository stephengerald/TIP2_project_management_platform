// routes/taskRoutes.js  
const express = require('express');  
const dotenv = require(`dotenv`).config()
const bcrypt = require('bcrypt')

  
const Task = require("./models/Task");
const Comment = require('./models/Comment');
const connectToDatabase = require('./config/db');

const taskRouter = require('./routes/taskRoute')
//const Users = require('./models/User');
//const sendUserEmail = require('./sendEmail'); 

const app = express()
app.use(express.json()); // Middleware to parse JSON bodies  

const PORT = process.env.PORT || 5000; 


// Connect to Database  
connectToDatabase();  

app.listen(PORT, () => {  
    console.log(`Server running at http://localhost:${PORT}`);  
});  

app.use("/api",taskRouter)
app.use('api/')

  

  


