const { Worker } = require("bullmq");
const { connection } = require("./blur-worker");
const dotenv = require('dotenv');
const { connectDb } = require("./connectDb");
const uploadFile = require("../upload.js");
const Image = require("../Schema/imageSchema");
const { blurQueue, faceIdQueue } = require("./blur-queue.js");


dotenv.config({ path: '../config.env' });

(async () => {
  try {
    await connectDb();
    console.log("Database Connected");

    const worker = new Worker(
      'UploadQueue',
      async (job) => {
        const { image, meta,   } = job.data;
        console.log(image, meta);
        try {
          if (!image || !image.mimetype || !image.buffer) {
            throw new Error("Invalid image data");
          }

          const extension = image.mimetype.split('/')[1];
          const originalName = `Rachit2833-${Date.now()}.${extension}`;
          const fileBuffer = Buffer.from(image.buffer.data);
          const { data, error } = await uploadFile(originalName, fileBuffer, image.mimetype);

          if (error) throw new Error("Failed to upload to Supabase");
          console.log(data);
          const imageUrl = `https://hwhyqxktgvimgzmlhecg.supabase.co/storage/v1/object/public/Images2.0/${originalName}`;

          // Construct MongoDB document
          const newImageDoc = new Image({
            ImageUrl: imageUrl,
            Country: meta.country || '',
            Favourite: meta.favourite || false,
            Location: {
              name: meta.location || 'Unknown',
              coordinates: [77.1025, 28.7041], // Default Delhi, replace with actual if available
            },
            Description: meta.description?.slice(0, 15) || 'No description',
            People: meta.people || [],
            sharedBy: meta.sharedBy || undefined, // Only if passed in meta
            blurredImage: '', // Set later if needed
          });
          console.log(`saving Image ${job.id}...`);
          await newImageDoc.save();
           if(meta.detection){
            faceIdQueue.add("Detection",{
            _id: newImageDoc._id,
            ImageUrl:newImageDoc.ImageUrl
          })
          }
          blurQueue.add("Blur Generator", {
            type: "Image",
            _id: newImageDoc._id,
            ImageUrl: newImageDoc.ImageUrl
          })
         
          console.log(`✅ Saved Image: ${newImageDoc._id}`);

        } catch (error) {
          console.error("❌ Job error:", error.message);
        }
      },
      { connection }
    );

    worker.on('completed', (job) => {
      console.log(`🎉 Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
      console.error(`🔥 Job ${job.id} failed:`, err.message);
    });

  } catch (err) {
    console.error("🚫 Failed to initialize worker:", err.message);
  }
})();
