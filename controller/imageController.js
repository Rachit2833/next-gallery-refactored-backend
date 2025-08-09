const sharp = require("sharp");
const mongoose = require("mongoose");
const Image = require("../Schema/imageSchema");
const Label = require("../Schema/labelSchema");
const SharedLink = require("../Schema/sharedLink")
const multer = require("multer");
const uploadFile = require("../upload");
const { json } = require("body-parser");
const { blurQueue, uploadQueue } = require("../lib/blur-queue");
const { createClient } = require("redis");



const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed!"), false); // Reject the file
  }
};
const upload = multer({
  storage,
  fileFilter: fileFilter
})
const upFun = upload.single("photo");
async function test2(req, res, next) {
  console.log(req.body, "sdssas");
  next()
}
async function uploadToStorage(req, res, next) {
  try {
    if (!req.file) {
      throw new Error("No File upload failed");
    }
    console.log(req.body, " bmnm");
    const extension = req.file.mimetype.split('/')[1]
    const fileBuffer = req.file.buffer;
    const originalName = `Rachit2833-${Date.now()}.${extension}`
    console.log(fileBuffer);
    const { data, error } = await uploadFile(
      originalName,
      fileBuffer,
      req.file.mimetype
    );

    (req.body.ImageUrl = `https://hwhyqxktgvimgzmlhecg.supabase.co/storage/v1/object/public/Images2.0/${originalName}`),
      next();
  } catch (error) {
    next(error);
  }
}


async function uploadToStorage(req, res, next) {
  try {
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    console.log(req.body, "📦 Incoming file metadata");

    const inputBuffer = req.file.buffer;
    const originalName = `Rachit2833-${Date.now()}.webp`;

    // Convert image to WebP using sharp
    const webpBuffer = await sharp(inputBuffer)
      .resize({ width: 1280 }) // Optional: resize to reduce payload
      .webp({ quality: 80 })   // Tune quality as needed
      .toBuffer();

    // Upload the WebP image to Supabase
    const { data, error } = await uploadFile(
      originalName,
      webpBuffer,
      "image/webp"
    );

    if (error) throw new Error("Failed to upload to Supabase");

    // Attach URL to request for further processing
    req.body.ImageUrl = `https://hwhyqxktgvimgzmlhecg.supabase.co/storage/v1/object/public/Images2.0/${originalName}`;

    next();
  } catch (error) {
    console.error("❌ Upload failed:", error.message);
    next(error);
  }
}
async function getAllImages(req, res) {
  try {
    const query = { ...req.query };
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 27;
    const favourite = parseInt(req.query.favourite) || false;

    let sort = -1;
    if (req.query.sort === "_id") sort = 1;
    if (req.query.sort === "-_id") sort = -1;

    const reservedNames = ["sort", "page", "limit", "fields", "pdt"];
    reservedNames.forEach((param) => delete query[param]);

    const filter = {};

    if (query.year && query.year?.toLowerCase() !== "all") {
      const year = parseInt(query.year, 10);
      if (!isNaN(year)) {
        const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
        const endOfYear = new Date(`${year + 1}-01-01T00:00:00.000Z`);
        filter.Date = { $gte: startOfYear, $lt: endOfYear };
      }
      delete query.year;
    }

    if (query.favourite) {
      filter["Favourite"] = true;
      delete query.favourite;
    }

    if (query.cod?.toLowerCase() !== "all" && query.cod) {
      filter["Location.name"] = { $regex: query.cod, $options: "i" };
      delete query.cod;
    }

    if (query.frId) {
      const id = new mongoose.Types.ObjectId(query.frId);
      filter["People"] = id;
      delete query.frId;
    }
    filter["userID"] = new mongoose.Types.ObjectId(req.user._id);

    const baseQuery = Image.find(filter)
      .sort({ _id: sort })
      .skip((page - 1) * limit)
      .limit(limit);

    // Conditionally populate People
    if (req.query.pdt === "true") {
      baseQuery.populate("People");
    }

    const images = await baseQuery.populate("sharedBy");

    const count = await Image.countDocuments(filter);
    const leftPage = count - page * limit;

    return res.status(200).json({ images, leftPage });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch images",
      details: error.message,
    });
  }
}



const pub = createClient({ url: process.env.REDIS_URL });
pub.connect(); // Ideally move this outside for global reuse



async function massUpload(req, res) {
  try {
    console.log("📦 Uploaded Files:", req.files);
    console.log("📝 Form Fields:", req.body);

    const location = req.body.LocationName || "";
    const description = req.body.Description || "";
    const country = req.body.Country || "";
    const favourite = req.body.Favourite === "true";
    const people = JSON.parse(req.body.People || "[]");
    const detection = req.body.detection;
    const userID = req.user._id;
    console.log(userID,"hello world");
    const name = "UploadJob";

    if (!Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    let jobCount = 0;

    for (const file of req.files) {
      // 🔧 Compress image using sharp
      const compressedBuffer = await sharp(file.buffer)
        .resize({ width: 1024 }) // Optional: resize to reduce size
        .jpeg({ quality: 75 }) // You can adjust quality
        .toBuffer();

      console.log(`📏 Original: ${file.buffer.length} → Compressed: ${compressedBuffer.length} bytes`);

      await uploadQueue.add(name, {
        image: {
          originalname: file.originalname,
          mimetype: "image/jpeg", // update mimetype if converted
          buffer: compressedBuffer,
        },
        meta: {
          location,
          description,
          country,
          favourite,
          people,
          detection,
          userID,
        },
      });

      jobCount++;
    }

    // 🔔 Trigger worker
    await pub.publish("trigger-upload-worker", "run");
    console.log("📡 Worker triggered");

    return res.status(200).json({
      message: "Images uploaded successfully",
      filesReceived: req.files.length,
      location,
      description,
      country,
      favourite,
      peopleCount: people.length,
      jobCount,
    });
  } catch (error) {
    console.error("❌ Error in /image/mass:", error);
    return res.status(500).json({ error: "Failed to process upload" });
  }
}





async function addNewImage(req, res) {
  try {
    req.body.Location = JSON.parse(req.body.Location);
    req.body.userID = new mongoose.Types.ObjectId(req.user._id);
    console.log(req.body, "req.body in addNewImage");
    const newImage = new Image(req.body);
    const image = await newImage.save();

    blurQueue.add("Blur Generator", {
      type: "Image",
      _id: image._id,
      ImageUrl: image.ImageUrl
    })
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
      filter["userID"] = new mongoose.Types.ObjectId(req.user._id);

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
async function getAllLocations(req, res) {
  const timeRange = req.query.yearRange;
  const year = new Date().getFullYear()
  console.log(timeRange, year);
  try {
    const data = await Image.aggregate([
      {
        $match: {
          userID: req.user._id,
          Date: {
            $gte: new Date(`${timeRange === "All" ? 1800 : year - timeRange}-01-01`),
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
  console.log("Received friendId:", id,);

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
async function deleteImage(req, res) {
    let  ids = req.body.idArray;
    ids = ids.map((id)=>id.id)
  console.log(id);
  try {
    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Assuming image.userID is the field that stores the owner's ID
    if (image.userID?.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const data = await image.deleteOne();

    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Something Went Wrong" });
  }
}


async function deleteAllImages(req, res) {
  try {
    const ids = req.body.idArray;

    // Filter out invalid ObjectIds
    const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
    console.log(validIds, "validIds");
    // Find all images with the given IDs
    const images = await Image.find({ _id: { $in: validIds } });

    // Filter only those images that belong to the logged-in user
    const userOwnedImageIds = images
      .filter((img) => img.userID?.toString() === req.user._id?.toString())
      .map((img) => img._id);

    if (userOwnedImageIds.length === 0) {
      return res.status(403).json({ message: "No authorized images to delete" });
    }

    // Delete only images that the user owns
    const data = await Image.deleteMany({ _id: { $in: userOwnedImageIds } });

    res.status(200).json({
      message: "Your images were deleted successfully",
      deletedCount: data.deletedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Something went wrong",
    });
  }
}



async function setAndUnsetFavourite(req, res) {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const favValue = req.body.Favourite;
  const userId = new mongoose.Types.ObjectId(req.user._id);
  console.log(userId, "userId in setAndUnsetFavourite");
  console.log(id, "id in setAndUnsetFavourite");
  try {
    const data = await Image.findOneAndUpdate(
      { _id: id, userID: userId }, // Ensure user owns the image
      { Favourite: favValue },
      { new: true }
    );
    console.log(data, "data in setAndUnsetFavourite");

    if (!data) {
      return res.status(403).json({
        message: "Unauthorized or Image not found",
      });
    }

    res.status(200).json({
      message: "Success",
      data: data,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({
      message: "Something Went Wrong",
    });
  }
}

async function searchImages(req, res) {
  const query = req.query.query;

  try {

    const userId = new mongoose.Types.ObjectId(req.user._id); // ensure it's ObjectId
console.log(userId);
    const LocationData = await Image.aggregate([
      {
        $search: {
          index: "default3",
          compound: {
            must: [
              {
                autocomplete: {
                  query: query,
                  path: "Location.name",
                },
              },
            ],
            filter: [
              {
                equals: {
                  path: "userID",
                  value: userId,
                },
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          Location: { $addToSet: "$Location.name" },
          data: {
            $push: {
              _id: "$_id",
              ImageUrl: "$ImageUrl",
              Country: "$Country",
              Favourite: "$Favourite",
              Location: "$Location",
              Description: "$Description",
              People: "$People",
              Date: "$Date",
              __v: "$__v",
            },
          },
        },
      },
    ]);

    // Description search
    const DesData = await Image.aggregate([
      {
        $search: {
          index: "Description",
          compound: {
            must: [
              {
                autocomplete: {
                  query,
                  path: "Description",
                },
              },
            ],
            filter: [
              {
                equals: {
                  path: "userID",
                  value: userId,
                },
              },
            ],
          },
        },
      },
    ]);

    // People label search
    const peopleData = await Label.aggregate([
      {
        $search: {
          index: "People",
          compound: {
            must: [
              {
                autocomplete: {
                  query,
                  path: "label",
                },
              },
            ],
            filter: [
              {
                equals: {
                  path: "userID",
                  value: userId,
                },
              },
            ],
          },
        },
      },
      {
        $project: {
          descriptors: 0,
        },
      },
    ]);

    res.status(200).json({
      message: "Success",
      LocationData,
      DesData,
      peopleData,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(400).json({
      message: "Something Went Wrong",
    });
  }
}
async function generateLink(req, res) {
  try {
    const sharedById = req.user._id;
    const uniqueIdStrings = [...new Set(req.body.imgIds)]; // deduplicate strings
    const ids = uniqueIdStrings.map((id) => new mongoose.Types.ObjectId(id));
    console.log(ids, "ids");
    const images = await Image.find({
      _id: { $in: ids },
      userID: sharedById
    });
    if (images.length !== ids.length) {
      return res.status(403).json({
        message: "You can only share images that you own.",
      });
    }

    const newLink = new SharedLink({ imageIds: ids, sharedById });
    const data = await newLink.save();
    const url = `http://localhost:3000/share?id=${data._id}&sharedId=${sharedById}`;
    res.status(200).json({
      message: "Link Generated",
      link: url,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Something Went Wrong",
    });
  }
}
async function getLinkData(req, res) {
  try {
    const id = req.user._id
    if (!id) {
      res.status(400).json({
        message: "Something Went Wrong",
      });
    }
    const data = await SharedLink.findById(id)
      .populate("imageIds")
      .populate("albumId");
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: "Something Went Wrong",
    });
  }
}
async function duplicateImages(req, res) {
  try {
    const images = await Image.find({ _id: { $in: req.body.ids } });
    const newImages = images.map((item) => {
      const abc = item.toObject();
      delete abc._id;
      delete abc.__v;
      abc.Favourite = false;
      abc.sharedBy = new mongoose.Types.ObjectId(req.body.sharedById);
      return abc;
    })
    const data = await Image.insertMany(newImages);
    console.log(data);
    res.status(200).json({
      message: "Images Saved To user",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to duplicate images" });
  }
}
async function getAllFavouriteImages(req, res) {
  try {
    const images = await Image.find({ Favourite: true })
    console.log(images, "images")
    res.status(200).json({
      images
    })
  } catch (error) {
    res.status(400).json({
      message: "Something Went Wrong",
    });
  }
}




module.exports = {
  upload,
  getAllFavouriteImages,
  duplicateImages,
  upFun,
  uploadToStorage,
  searchImages,
  setAndUnsetFavourite,
  addNewImage,
  deleteImage,
  getAllImages,
  getImageById,
  test2,
  test,
  getAllImagesForLocation,
  getAllLocations,
  deleteAllImages,
  generateLink,
  getLinkData,
  massUpload

};

