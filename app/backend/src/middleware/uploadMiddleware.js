const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Destination directory
const destinationDir = path.join("/code/lmaooo");

// Ensure the destination directory exists
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  }
};

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

const upload = multer({
  storage: storage,
});

module.exports = upload;
