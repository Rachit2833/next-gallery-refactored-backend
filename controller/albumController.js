const  mongoose  = require("mongoose");
const Album = require("../Schema/albumSchema");
const SharedLink = require("../Schema/sharedLink");


async function getAllAlbum(req, res) {
  const query = { ...req.query };
  const reservedNames = ["sort", "page", "limit", "fields",];
  reservedNames.forEach((el) => {
    delete query[el];
  });
  try {
    if (query.year.toLowerCase() === "all" || query.year === undefined) {
      const albums = await Album.find();
      return res.status(200).json({ albums });
    }
    if (query.year) {
      const year = parseInt(query.year, 10);
      const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`); 
      const endOfYear = new Date(`${year + 1}-01-01T00:00:00.000Z`);
      query.Date = { $gte: startOfYear, $lt: endOfYear };
      delete query.year;
    }
    const albums = await Album.find(query);

    return res.status(200).json({ albums });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
async function addNewAlbum(req, res) {

  try {
    const newAlbum = new Album(req.body); // Use req.body instead of req.data
    const album = await newAlbum.save();
    res.status(200).json({
      message: "Album Saved",
      data: album,
    });
  } catch (error) {
    res.status(400).json({
      message: "Something Went Wrong",
      error: error.message,
    });
  }
}

async function addImageToAlbum(req, res) {
  try {
    console.log(1);
    const albumId = new mongoose.Types.ObjectId(req.params.id);
    const { photoArray } = req.body;
    console.log(2);

    if (!photoArray || !Array.isArray(photoArray) || photoArray.length === 0) {
      console.log(3);
      return res.status(400).json({ message: "Invalid or empty image array" });
    }
    console.log(4);

    const album = await Album.findById(albumId);
    console.log(5);
    if (!album) {
      console.log(6);
      return res.status(404).json({ message: "Album not found" });
    }
    console.log(7);

    const existingImages = new Set(album.Images.map((id) => id.toString())); // Convert existing images to Set for quick lookup
    const newImages = [];
    const duplicateImages = [];
    console.log(8);
    console.log("Received photoArray:", photoArray);

    // Filter out invalid and duplicate images
    photoArray.forEach((photoId) => {
      console.log("Processing:", photoId);
      const photoStr = String(photoId);

      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(photoStr)) {
        console.log("Invalid ObjectId:", photoStr);
        return;
      }

      if (existingImages.has(photoStr)) {
        console.log("Duplicate image found:", photoStr);
        duplicateImages.push(photoStr);
      } else {
        console.log("Adding new image:", photoStr);
        newImages.push(new mongoose.Types.ObjectId(photoStr));
      }
    });

    console.log(9);

    // If no new images, return early with a duplicate warning
    if (newImages.length === 0) {
      console.log(10);
      return res.status(200).json({
        message: "No new images added. All were duplicates or invalid.",
        addedImages: 0,
        duplicateImages,
        data: album,
      });
    }

    // Update album with only new images
    const data = await Album.updateOne(
      { _id: albumId },
      {
        $push: { Images: { $each: newImages } },
        updatedAt: new Date(),
      }
    );
    console.log("Update response:", data);

    const updatedAlbum = await Album.findById(albumId);
    res.status(200).json({
      message: "Album updated successfully",
      addedImages: newImages.map((id) => id.toString()),
      duplicateImages,
      data: updatedAlbum,
    });
  } catch (error) {
    console.error("Error in addImageToAlbum:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function getAlbumById(req,res) {
  let _id = new mongoose.Types.ObjectId(String(req.params.id));

 try {
  let data = await Album.find(_id)
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
async function deleteAlbum(req, res) {
  const id = new mongoose.Types.ObjectId(String(req.params.id));
  const data = await Album.findById(id).deleteOne();
  res.status(200).json({
    message: "Album Deleted",
    data: data,
  });
}
async function getAlbumImages(req, res) {
  const id = new mongoose.Types.ObjectId(String(req.params.id));
  const yearFilter = req.query.year;

  try {
    let data;

    // Use aggregation pipeline for both year-specific and "all" cases
    const aggregationPipeline = [
      {
        $match: { _id: id },
      },
      {
        $project: {
          Images: 1,
          _id: 0,
        },
      },
      { $unwind: "$Images" },
      {
        $lookup: {
          from: "Images",
          localField: "Images",
          foreignField: "_id",
          as: "imageDetails",
        },
      },
      { $unwind: "$imageDetails" },
      {
        $addFields: {
          year: { $year: { $toDate: "$imageDetails.Date" } },
        },
      },
    ];

    // Apply year filtering if a specific year is provided
    if (yearFilter && yearFilter !== "all") {
      aggregationPipeline.push({
        $match: { year: parseInt(yearFilter) },
      });
    }

    // Group images by year
    aggregationPipeline.push({
      $group: {
        _id: "$year",
        Images: {
          $push: {
            _id: "$imageDetails._id",
            ImageUrl: "$imageDetails.ImageUrl",
            Location: "$imageDetails.Location",
            Description: "$imageDetails.Description",
            Date: "$imageDetails.Date",
            People: "$imageDetails.People",
          },
        },
      },
    });

    // Sort by year
    aggregationPipeline.push({
      $sort: { _id: 1 },
    });

    // Execute aggregation
    data = await Album.aggregate(aggregationPipeline);

    // If no yearFilter or "all" is used, include images from all years
    if (!yearFilter || yearFilter === "all") {
      // Flatten all images across years into a single array
      const allImages = data.flatMap((yearGroup) => yearGroup.Images);
      data = { _id: "all", Images: allImages };
    } else {
      // Use the grouped data from aggregation
      data = data[0] || { _id: yearFilter, Images: [] };
    }

    res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({
      message: "Something Went Wrong",
      error: error.message,
    });
  }
}
async function generateLinkAlbum(req, res) {
  try {
    console.log(1);

    if (!req.body.shareById || !req.body.albumId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const sharedById = new mongoose.Types.ObjectId(req.body.shareById);
    const albumId = new mongoose.Types.ObjectId(req.body.albumId);
    const newLink = new SharedLink({ albumId, sharedById });
    const data = await newLink.save();
    res.status(200).json({
      message: "Link Generated",
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Something Went Wrong",
      error: error.message,
    });
  }
}

module.exports = {
  generateLinkAlbum,
  getAlbumImages,
  getAllAlbum,
  addNewAlbum,
  addImageToAlbum,
  getAlbumById,
  deleteAlbum,
};
