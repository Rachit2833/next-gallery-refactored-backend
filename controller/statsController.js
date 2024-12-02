const Image = require("../Schema/imageSchema");

async function getImageStats(req,res) {
   const year = req.query.year
  try {
   const data = await Image.aggregate([
     {
       $match: {
         Date: {
           $gte: new Date(`${year}-01-01`),
           $lte: new Date(`${year}-12-31`),
         },
       },
     },
     {
       $group: {
         _id: { $month: "$Date" },
         Images: { $push: "$_id" },
         numImages: { $sum: 1 },
         Location: { $addToSet: "$Location" },
       },
     },
     {
       $addFields: {
         Month: "$_id",
       },
     },
     {
       $project: {
         _id: 0,
       },
     },
   ]);
   res.status(200).json({
     data,
   });
  } catch (error) {
     res.status(400).json({
       message:"Something Went Wrong",
       mes:error
     });
  }
}
async function getAllCountries(req, res) {
  const timeRange = req.query.year - 1;
  const year = new Date().getFullYear();

  try {
    const favouriteCountry = await Image.aggregate([
      {
        $match: {
          Date: {
            $gte: new Date(`${year - timeRange}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: {
            country: "$Country",
            locationName: "$Location.name",
          },
          numImages: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.country",
          numImages: { $sum: "$numImages" },
          Location: {
            $addToSet: {
              name: "$_id.locationName",
              totalImages: "$numImages",
            },
          },
        },
      },
      {
        $sort: { numImages: -1 },
      },{$project:{
        Location:0
      }},{
        $limit:3
      }
    ]);
    const favouriteLocation = await Image.aggregate([
      {
        $match: {
          Date: {
            $gte: new Date(`${year - timeRange}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: {
            country: "$Country",
            locationName: "$Location.name",
          },
          numImages: { $sum: 1 },
        },
      },
      {
        $sort: { numImages: -1 },
      },
      {
        $limit: 3,
      },
    ]);
     const AllCountries = await Image.aggregate([
       {
         $match: {
           Date: {
             $gte: new Date(`${year - timeRange}-01-01`),
             $lte: new Date(`${year}-12-31`),
           },
         },
       },
       {
         $group: {
           _id: null,
           countries: {
             $addToSet: "$Country",
           },
         },
       },
       {
         $project: {
           _id: 0,
           countries: {
             $sortArray: {
               input: "$countries",
               sortBy: 1, // 1 for ascending, -1 for descending
             },
           },
         },
       },
     ]);

    res.status(200).json({ favouriteCountry,favouriteLocation,AllCountries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports={ getImageStats,getAllCountries }