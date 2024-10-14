const fs = require("fs");

function getAllLabels(req, res) {
  fs.readFile(
    "../next-gallery/public/abc.json",
    "utf8",
    (readErr, fileData) => {
      if (readErr) {
        console.error("Error reading file:", readErr);
        return res.status(500).send("Error reading file");
      }
      res.send(fileData);
    }
  );
}
function addNewLabel(req, res){
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
}

module.exports = { getAllLabels,addNewLabel,deleteLabel };
