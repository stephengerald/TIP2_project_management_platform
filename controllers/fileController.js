const File = require("../models/fileModel");
const path = require("path");
const multer = require("multer");

// Set up storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Handle file upload
const uploadFile = (req, res) => {
    upload.single('file')(req, res, async (error) => {
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const newFile = new File({
            filename: req.file.filename,
            filePath: req.file.path,
            uploader: req.user._id,  // Assuming user info is in req.user
            projectId: req.body.projectId
        });

        await newFile.save();

        return res.status(200).json({ file: newFile });
    });
};

// Serve uploaded files
const getFile = (req, res) => {
    const filePath = path.join(__dirname, '../uploads', req.params.filename);
    return res.sendFile(filePath);
};

module.exports = {
    uploadFile,
    getFile
};
