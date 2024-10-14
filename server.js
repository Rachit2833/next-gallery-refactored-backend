const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 2833;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json({ limit: "10mb" })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// POST route to save image data
app.post("/", (req, res) => {
  let { imageData } = req.body;
  if (!imageData) {
    console.error("No image data provided");
    return res.status(400).send("No image data provided");
  }
  const base64Prefix = /^data:image\/\w+;base64,/;
  imageData = imageData.replace(base64Prefix, "");
  const frontendPath = path.join(
    __dirname,
    "../next-gallery/public/labels",
    new Date().toISOString()
  );

  try {
    fs.mkdirSync(frontendPath, { recursive: true });
    const imageFilename = path.join(frontendPath, `1.png`);
    const buffer = Buffer.from(imageData, "base64");

    fs.writeFile(imageFilename, buffer, (err) => {
      if (err) {
        console.error("Error saving the image:", err);
        return res.status(500).send("Failed to save image");
      }
      res.send("Directory created and image saved successfully!");
    });
  } catch (error) {
    console.error("Error creating directory or saving image:", error);
    res.status(500).send("Error creating directory or saving image");
  }
});

app.get("/loadLabels",(req,res)=>{
     fs.readFile("../next-gallery/public/abc.json","utf8",
    (readErr, fileData) => {
      if (readErr) {
        console.error("Error reading file:", readErr);
        return res.status(500).send("Error reading file");
      }
      return res.send(fileData);
    })
      
})
app.post("/test", (req, res) => {
  const newData = req.body;
  console.log(req.body);
  fs.readFile(
    "../next-gallery/public/abc.json",
    "utf8",
    (readErr, fileData) => {
      if (readErr) {
        console.error("Error reading file:", readErr);
        return res.status(500).send("Error reading file");
      }

      let jsonArray;
      try {
        // Parse existing data as an array; if empty, start with an empty array
        jsonArray = fileData ? JSON.parse(fileData) : [];
      } catch (parseErr) {
        console.error("Error parsing JSON:", parseErr);
        return res.status(500).send("Error parsing JSON data");
      }

      // Add the new data to the array
      jsonArray.push(newData);

      // Write the updated array back to abc.json
      fs.writeFile(
        "../next-gallery/public/abc.json",
        JSON.stringify(jsonArray, null, 2),
        (writeErr) => {
          if (writeErr) {
            console.error("Error writing file:", writeErr);
            return res.status(500).send("Error writing file");
          }
          res.send("File updated successfully with new entry");
        }
      );
    }
  );
});


app.delete("/test", (req, res) => {
  const labelName = req.body.label; // Ensure labelName is directly used

  // Read the JSON file
  fs.readFile("../next-gallery/public/abc.json", "utf8", (readErr, fileData) => {
    if (readErr) {
      console.error("Error reading file:", readErr);
      return res.status(500).send("Error reading file");
    }

    let jsonArray;
    try {
      jsonArray = fileData ? JSON.parse(fileData) : [];
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      return res.status(500).send("Error parsing JSON data");
    }

    // Filter out the labelName
    jsonArray = jsonArray.filter((data) => data.label !== labelName);
    console.log(jsonArray);
    // Write the updated data back to the JSON file
    fs.writeFile(
      "../next-gallery/public/abc.json",
      JSON.stringify(jsonArray, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing file:", writeErr);
          return res.status(500).send("Error writing file");
        }
        res.send("File updated successfully with new entry");
      }
    );
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
