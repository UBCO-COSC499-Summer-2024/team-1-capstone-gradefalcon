const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure the destination directory exists
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  }
};

const createUploadMiddleware = (destinationDir) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      ensureDirExists(destinationDir); // Ensure the directory exists
      try {
        cb(null, destinationDir);
      } catch (error) {
        console.error("Error in callback:", error);
      }
    },
    filename: function (req, file, cb) {
      const imgName = file.originalname;
      cb(null, imgName);
    },
  });

  return multer({
    storage: storage,
  });
};

module.exports = { createUploadMiddleware };
