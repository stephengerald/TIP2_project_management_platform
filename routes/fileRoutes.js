const express = require("express");
const validateToken = require("../middleware/validateAuth");
const { uploadFile, getFile } = require("../controllers/fileController");
const router = express.Router();

// Define routes for file upload and retrieval
router.post("/upload", validateToken, uploadFile);
router.get("/files/:filename", validateToken, getFile);

module.exports = router;