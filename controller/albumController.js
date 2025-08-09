const  mongoose  = require("mongoose");
const Album = require("../Schema/albumSchema");
const SharedLink = require("../Schema/sharedLink");
const { albumQueue } = require("../lib/blur-queue");
const { createClient } = require("redis");
const pub = createClient({ url: process.env.REDIS_URL });
pub.connect(); // Ideally move this outside for global reuse
async function getAllAlbum(req, res) {
  const query = { ...req.query };
  const reservedNames = ["sort", "page", "limit", "fields"];
  reservedNames.forEach((el) => delete query[el]);

  try {
    // Ensure only user's albums are fetched
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Always filter by userID
    query.userID = req.user._id;

    // Handle 'year' filter
    if (query.year?.toLowerCase() === "all" || query.year === undefined) {
      let albumsQuery = Album.find({ userID: req.user._id });

      // Apply sort
      albumsQuery = req.query.sort
        ? albumsQuery.sort(req.query.sort)
        : albumsQuery.sort({ _id: -1 });

      const albums = await albumsQuery;
      return res.status(200).json({ albums });
    }

    // Apply year range filter
    if (query.year) {
      const year = parseInt(query.year, 10);
      const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
      const endOfYear = new Date(`${year + 1}-01-01T00:00:00.000Z`);
      query.Date = { $gte: startOfYear, $lt: endOfYear };
      delete query.year;
    }

    let albumsQuery = Album.find(query);

    // Apply sort
    albumsQuery = req.query.sort
      ? albumsQuery.sort(req.query.sort)
      : albumsQuery.sort({ _id: -1 });

    const albums = await albumsQuery;
    return res.status(200).json({ albums });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


async function addNewAlbum(req, res) {
  try {
    const Name = req.body.Name || "";
    const Description = req.body.Description || "";
    const image = req.files?.[0]; // Safe optional chaining
    if (image && image.mimetype.startsWith("image/")) {
      // Queue image album creation for processing
      albumQueue.add("Add-Album", {
        image,
        meta: {
          Name,
          Description,
          userID: req.user._id,
        },
      });
      await pub.publish("trigger-album-worker", "go");
      return res.status(200).json({
        message: "Album queued for processing",
      });
    } else {
      // No image — create album immediately with fallback
      const randomFallbackImage = Math.floor(Math.random() * 25); // Adjust logic if needed
      const albumDoc = new Album({
        userID: req.user._id,
        ImageUrl: randomFallbackImage.toString(),
        Name,
        Description,
        blurredImage:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/AAwNOwENPwEAMQQDNwD+///L2eTO2ub+//8A/v395ejt5enu/v39Q/QXhr/juNAAAAAASUVORK5CYII=",
      });

      const album = await albumDoc.save();

      return res.status(200).json({
        message: "Album saved ",
        data: album,
      });
    }
  } catch (error) {
    console.error("Error in addNewAlbum:", error);

    return res.status(400).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}


async function addImageToAlbum(req, res) {
  try {
    const albumId = new mongoose.Types.ObjectId(req.params.id);
    const { photoArray } = req.body;
    if (!photoArray || !Array.isArray(photoArray) || photoArray.length === 0) {

      return res.status(400).json({ message: "Invalid or empty image array" });
    }
    const album = await Album.findOne({ _id: albumId, userID: req.user._id });
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    const existingImages = new Set(album.Images.map((id) => id.toString())); // Convert existing images to Set for quick lookup
    const newImages = [];
    const duplicateImages = [];

    // Filter out invalid and duplicate images
    photoArray.forEach((photo) => {
      const photoStr = String(photo.id);

      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(photoStr)) {
        return;
      }

      if (existingImages.has(photoStr)) {
        duplicateImages.push(photoStr);
      } else {
        newImages.push(new mongoose.Types.ObjectId(photoStr));
      }
    });


    // If no new images, return early with a duplicate warning
    if (newImages.length === 0) {
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

async function getAlbumById(req, res) {
  const _id = new mongoose.Types.ObjectId(String(req.params.id));

  try {
    const data = await Album.findOne({
      _id,
      userID: req.user._id,
    });

    if (!data) {
      return res.status(404).json({ message: "Album not found or unauthorized" });
    }

    res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

async function deleteAlbum(req, res) {
  try {
    const id = new mongoose.Types.ObjectId(String(req.params.id));

    // Ensure album belongs to the user and delete it
    const data = await Album.findOneAndDelete({
      _id: id,
      userID: req.user._id,
    });

    if (!data) {
      return res.status(404).json({ message: "Album not found or unauthorized" });
    }

    res.status(200).json({
      message: "Album Deleted",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

async function getAlbumImages(req, res) {
  try {
    const albumId = new mongoose.Types.ObjectId(String(req.params.id));
    const yearFilter = req.query.year;

    // ✅ Ownership check
    const album = await Album.findOne({ _id: albumId, userID: req.user._id });
    if (!album) {
      return res.status(403).json({ message: "Unauthorized or album not found" });
    }

    // 🎯 Aggregation pipeline
    const aggregationPipeline = [
      {
        $match: {
          _id: albumId,
          userID: req.user._id,
        },
      },
      {
        $project: {
          Images: 1,
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
            blurredImage: "$imageDetails.blurredImage",
          },
        },
      },
    });

    // Sort by year
    aggregationPipeline.push({
      $sort: { _id: 1 },
    });

    // Execute aggregation
    let data = await Album.aggregate(aggregationPipeline);

    // Flatten or keep grouped
    if (!yearFilter || yearFilter === "all") {
      const allImages = data.flatMap((yearGroup) => yearGroup.Images);
      data = { _id: "all", Images: allImages };
    } else {
      data = data[0] || { _id: yearFilter, Images: [] };
    }

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error in getAlbumImages:", error);
    res.status(400).json({
      message: "Something Went Wrong",
      error: error.message,
    });
  }
}

async function generateLinkAlbum(req, res) {
  try {
    const { shareById, albumId } = req.body;
    if (!shareById || !albumId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const sharedById = new mongoose.Types.ObjectId(shareById);
    const albumObjectId = new mongoose.Types.ObjectId(albumId);
    const album = await Album.findOne({
      _id: albumObjectId,
      userID: req.user._id,
    });

    if (!album) {
      return res.status(403).json({ message: "Not authorized to share this album" });
    }

    // ✅ Create share link
    const newLink = new SharedLink({ albumId: albumObjectId, sharedById });
    const data = await newLink.save();

    res.status(200).json({
      message: "Link generated successfully",
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Something went wrong",
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
