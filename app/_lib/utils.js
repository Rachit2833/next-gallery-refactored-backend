// fileUtils.js
const fs = require("fs");
const path = require("path");

const saveImage = (folderName, imageName, imageData) => {
  // Define the path where the image will be saved
  const dir = path.join(__dirname, "public", "labels", folderName);

  // Create the directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Define the full path for the new image
  const filePath = path.join(dir, imageName);

  // Convert the base64 image data to binary buffer
  const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  // Write the buffer to the file
  fs.writeFileSync(filePath, buffer);
  console.log(`Image saved: ${filePath}`);
};

module.exports = { saveImage };
