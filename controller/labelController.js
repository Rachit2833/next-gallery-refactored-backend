const fs = require("fs");

const { mongoose } = require("mongoose");
const Label = require("../Schema/labelSchema")
async function getAllLabels(req, res) {
  try {
    const userID = req.user._id ; // Use req.body.userId or default to "rachit28"
    const labels = await Label.find({ userID });
    res.status(200).json(labels);
  } catch (error) {
    console.error("Error fetching labels:", error);
    res.status(500).json({
      error: "Failed to fetch labels",
    });
  }
}
async function addNewLabel(req, res) {
  try {
    const newData = req.body;
    const newLabel = new Label(newData);
    const doc = await newLabel.save();
    res.status(201).json({ message: "Label created successfully", label: doc });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error creating label", error: e });
  }
}

function deleteLabel (req, res){
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
}
async function getLabelByName(req, res) {
  try {
    // Access the name parameter from the request
    let label = req.params.name;
    label= String(label)

    // Use req.body.userId or default to "rachit28"
    const userID = req.user._id

    // Find labels with matching userId and the name parameter
    const labels = await Label.find({ userID, label}); // Modify the query if needed
    res.status(200).json(labels);
  } catch (error) {
    console.error("Error fetching labels:", error);
    res.status(500).json({
      error: "Failed to fetch labels",
    });
  }
}
async function getLabelById(req, res) {
  try {
    // Access the name parameter from the request
    let _id = req.params.id;


    // Use req.body.userId or default to "rachit28"
    const userID = req.user._id

    // Find labels with matching userID and the name parameter
    const labels = await Label.find({ userID, _id }); // Modify the query if needed
    res.status(200).json(labels);
  } catch (error) {
    console.error("Error fetching labels:", error);
    res.status(500).json({
      error: "Failed to fetch labels",
    });
  }
}
async function updateLabel(req, res) {
  try {
      if(req.body.label===""){
        res.status(400).json({
          message:"Name Should Be there"
        })
      }
      let id = req.params.id;
     const resData = await Label.findByIdAndUpdate(id, req.body,{new:true});
    res.status(200).json({
      message: "Success",
      resData
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getAllLabels, addNewLabel, deleteLabel, getLabelByName,updateLabel,getLabelById };
