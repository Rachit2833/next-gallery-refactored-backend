const  mongoose  = require("mongoose");
const Album = require("../Schema/albumSchema");


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
async function addImageToAlbum(req,res) {
  const id = req.body.id
  const photoIds =req.body.photoArray
  const data = await Album.updateOne(
    { _id: id },
    { $push: { Images: { $each: photoIds } }, updatedAt: new Date() }
  );
  res.status(200).json({
    message: "Album Saved",
    data: data,
  });
}
async function getAlbumById(req,res) {
  let _id = new mongoose.Types.ObjectId(String(req.params.id));

 try {
  let data = await Album.findById(_id)
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

module.exports = {getAlbumImages, getAllAlbum,addNewAlbum,addImageToAlbum,getAlbumById,deleteAlbum };
