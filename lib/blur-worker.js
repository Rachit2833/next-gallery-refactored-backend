const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' }); // must be FIRST

const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const { connectDb } = require('../lib/connectDb.js'); // adjust path if needed
const Image = require('../Schema/imageSchema.js');
const Label = require('../Schema/labelSchema.js');
const Album = require('../Schema/albumSchema.js');


const connection = new IORedis({ maxRetriesPerRequest: null });


(async () => {
  try {
    await connectDb();
    console.log("Database Connected");

    const worker = new Worker(
      'BlurQueue',
      async (job) => {
        console.log("Job received:", job.id,job.data._id);
        const { ImageUrl, type, _id } = job.data;
        const { getImageBlurred } = await import("../lib/util.mjs");
        if (type === "Image" && _id) {
          const blurredImage = await getImageBlurred(ImageUrl);
          const updateResult = await Image.updateOne(
            { _id },
            { $set: { blurredImage } }
          );
          console.log(updateResult);
        } else if (type === "People" && _id) {
          const blurredImage = await getImageBlurred(ImageUrl);
          const updateResult = await Label.updateOne(
            { _id },
            { $set: { blurredImage } }
          );
          console.log(updateResult,_id);
        }else if (type === "Album" && _id) {
          const blurredImage = await getImageBlurred(ImageUrl);
          const updateResult = await Album.updateOne(
            { _id },
            { $set: { blurredImage } }
          );
          console.log(updateResult,_id);
        }
      },
      { connection }
    );

    worker.on('completed', job => {
      console.log(`Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
      console.error(`Job ${job.id} failed:`, err.message);
    });

  } catch (err) {
    console.error("Failed to initialize worker:", err.message);
  }
})();
module.exports = { connection }
