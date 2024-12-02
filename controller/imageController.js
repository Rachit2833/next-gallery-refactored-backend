const mongoose  = require("mongoose");
const Image = require("../Schema/imageSchema");

async function getAllImages(req, res) {
  try {
    // Extract the query parameters and remove reserved ones like sort, page, limit, and fields
    const query = { ...req.query };
    const reservedNames = ["sort", "page", "limit", "fields"];
    reservedNames.forEach((param) => delete query[param]);
    const filter = {};
    // Handle the 'year' filter
    if (query.year && query.year.toLowerCase() !== "all") {
      const year = parseInt(query.year, 10);
      if (!isNaN(year)) {
        const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
        const endOfYear = new Date(`${year + 1}-01-01T00:00:00.000Z`);
        filter.Date = { $gte: startOfYear, $lt: endOfYear };
      }
      delete query.year;
    }
    if (query.cod) {
      filter.Location = { $regex: query.cod, $options: "i" };
      delete query.cod;
    }
    if (query.friendId){
       let id = new mongoose.Types.ObjectId(String(req.query.friendId)); 
       filter.People={ $eq:id}
       delete query.friendId;
    } 
    const images = await Image.find(filter).populate("People");
    return res.status(200).json({ images });
  } catch (error) {
    // Handle errors and respond with a message
    return res.status(500).json({
      error: "Failed to fetch images",
      details: error.message,
    });
  }
}

async function addNewImage(req, res) {
  try {
    const newImage = new Image(req.body); // Use req.body instead of req.data
    const image = await newImage.save();
    console.log(image);
    res.status(200).json({
      message: "Image Saved",
      data: image, 
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Something Went Wrong",
      error: error.message, 
    });
  }
}
async function getAllImagesForLocation(req, res) {
  // Copy query parameters, except reserved ones
  const query = { ...req.query };
  const reservedNames = ["sort", "page", "limit", "fields"];
  reservedNames.forEach((el) => {
    delete query[el];
  });

  try {
    // Check if Location is part of the query and filter by it
    const filter = query.cod
      ? { "Location.name": { $regex: query.cod, $options: "i" } }
      : {};

    // Find images that match the Location filter
    const data = await Image.find(filter);

    res.status(200).json({
      message: "Images",
      images: data,
    });
  } catch (error) {
      res.status(500).json({ message: "Error retrieving images" });
  }
}
async function getAllLocations(req,res) {
  const timeRange = req.query.yearRange;
  const year=  new Date().getFullYear()
console.log(timeRange,year);
  try {
   const data = await Image.aggregate([
     {
       $match: {
         Date: {
           $gte: new Date(`${timeRange==="All"?1800:year-timeRange }-01-01`),
           $lte: new Date(`${year}-12-31`),
         },
       },
     },
     {
       $group: {
         _id: null,
         Location: { $addToSet: "$Location" },
       },
     },
   ]);
    res.status(200).json({
      message: "Images",
      data: data,
    });
  } catch (error) {
     res.status(500).json({ message: "Error retrieving images" });
  }
}
async function test(req, res) {
  const { friendId } = req.query;

  var id = new mongoose.Types.ObjectId(String(req.query.friendId));
  console.log("Received friendId:", id, );
   
  try {
    const images = await Image.find({
      People: id, 
    });

    if (images.length === 0) {
      return res
        .status(404)
        .json({ message: "No images found for this friend" });
    }

    // Return the matching images
    res.json(images);
  } catch (error) {
    console.error("Error in fetching images:", error);
    res.status(500).json({ error: "An error occurred while fetching images" });
  }
}
async function getImageById(req, res) {
  let _id = req.params.id;
  try {
    const data = await Image.findById(_id);
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: "Something Went Wrong",
      error: error.message,
    });
  }
}
async function deleteImage(req,res){
  const id = req.query.img_id;
 try {
   const data = await Image.findById(id).deleteOne()
   res.status(200).json({
     data
   });
 } catch (error) {
    res.status(400).json({
      message:"Something Went Wrong"
    })
 }
}
async function setAndUnsetFavourite(req,res) {
   const id = new mongoose.Types.ObjectId(String(req.params.id));
  const favValue=req.body.Favourite;
  console.log(favValue,"kbjn");
  try {
    const data = await Image.findByIdAndUpdate(id,{ Favourite: favValue },{ new: true });
    res.status(200).json({
      message:"Success",
      data:data
    });
  } catch (error) {
    res.status(400).json({
      message: "Something Went Wrong",
    });
  }
}



module.exports = { setAndUnsetFavourite,addNewImage,deleteImage, getAllImages,getImageById, test, getAllImagesForLocation , getAllLocations };

