const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process"); // Import exec

// Destination directory
const destinationDir = path.join("/code/uploads");

// Ensure the destination directory exists
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  }
};

// Function to execute the Docker cp command
const executeDockerCp = (source, destination) => {
  const command = `docker cp ${source} ${destination}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing docker cp: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    if (stderr) console.error(`stderr: ${stderr}`);
  });
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

module.exports = { upload, executeDockerCp };
