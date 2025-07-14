const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' }); // must be FIRST

const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const { connectDb } = require('../lib/connectDb.js'); // adjust path if needed
const Image = require('../Schema/imageSchema.js');
const Label = require('../Schema/labelSchema.js');
const { albumQueue, blurQueue } = require('./blur-queue.js');
const Album = require('../Schema/albumSchema.js');
const uploadFile = require('../upload.js');


const connection = new IORedis({ maxRetriesPerRequest: null });


(async () => {
  try {
    await connectDb();
    console.log("Database Connected");

    const worker = new Worker(
      'AlbumQueue',
      async (job) => {
       console.log("Job received:", job.id,job.data);
         const { image, meta,   } = job.data;
        try {
          if (!image || !image.mimetype || !image.buffer) {
            throw new Error("Invalid image data");
          }

          const extension = image.mimetype.split('/')[1];
          const originalName = `Rachit2833-${Date.now()}.${extension}`;
          const fileBuffer = Buffer.from(image.buffer.data);
          const { data, error } = await uploadFile(originalName, fileBuffer, image.mimetype);

          if (error) throw new Error("Failed to upload to Supabase");
          const imageUrl = `https://hwhyqxktgvimgzmlhecg.supabase.co/storage/v1/object/public/Images2.0/${originalName}`;

          // Construct MongoDB document
          const albumDoc = new Album({
            ImageUrl: imageUrl,
            Name:meta.Name,
            Description:meta.Description,
            blurredImage:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/AAwNOwENPwEAMQQDNwD+///L2eTO2ub+//8A/v395ejt5enu/v39Q/QXhr/juNAAAAAASUVORK5CYII="
          });
          await albumDoc.save();
          blurQueue.add("Blur Generator", {
            type: "Album",
            _id: albumDoc._id,
            ImageUrl: albumDoc.ImageUrl
          })
         
          console.log(`✅ Saved Image: ${albumDoc._id}`);

        } catch (error) {
          console.error("❌ Job error:", error.message);
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
