const multer = require("multer");

// Storage setup (memory or disk)
const storage = multer.memoryStorage(); // Use diskStorage if saving locally

// File filter to accept only PDFs, images, etc.
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type! Only PDFs and images are allowed."), false);
    }
};

// Multer instance
const upload = multer({ storage, fileFilter });

module.exports = upload;
