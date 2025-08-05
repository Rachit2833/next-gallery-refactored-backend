const { Worker } = require("bullmq");
const connection = require("./lib/redis-clinet.js");
const dotenv = require('dotenv');
const { connectDb } = require("./lib/connectDb.js");
const Image = require("./Schemas/imageSchema.js");
const uploadFile = require("./lib/upload.js");
const { faceIdQueue, blurQueue } = require("./lib/blur-queue.js");
const { createClient } = require('redis');

dotenv.config({ path: '../config.env' });

let activeJobs = 0;
let isRunning = false;

(async () => {
  try {
    await connectDb();
    console.log("✅ Database Connected");

    const pub = createClient({ url: process.env.REDIS_URL });
    const sub = pub.duplicate();
    await pub.connect();
    await sub.connect();

    const worker = new Worker(
      'UploadQueue',
      async (job) => {
        console.log(`📥 Job ${job.id} received`);
        const { image, meta } = job.data;

        try {
          if (!image?.mimetype || !image?.buffer) {
            throw new Error("Invalid image data");
          }

          const extension = image.mimetype.split('/')[1];
          const originalName = `Rachit2833-${Date.now()}.${extension}`;
          const fileBuffer = Buffer.from(image.buffer.data);
          const { error } = await uploadFile(originalName, fileBuffer, image.mimetype);
          if (error) throw new Error("Failed to upload to Supabase");

          const imageUrl = `https://hwhyqxktgvimgzmlhecg.supabase.co/storage/v1/object/public/Images2.0/${originalName}`;

          const newImageDoc = new Image({
            ImageUrl: imageUrl,
            Country: meta.country || '',
            Favourite: meta.favourite || false,
            Location: {
              name: meta.location || 'Unknown',
              coordinates: [77.1025, 28.7041],
            },
            Description: meta.description?.slice(0, 15) || 'No description',
            People: meta.people || [],
            sharedBy: meta.sharedBy || undefined,
            blurredImage: '',
            userID: meta.userID 
          });

          await newImageDoc.save();
          console.log(`✅ Saved Image: ${newImageDoc._id}`);

          if (meta.detection) {
            await faceIdQueue.add("FaceIdQueue", {
              _id: newImageDoc._id,
              ImageUrl: newImageDoc.ImageUrl,
              userID: meta.userID 
            });
            await pub.publish("trigger-detection-worker", "start");
          }

          await blurQueue.add("BlurQueue", {
            type: "Image",
            _id: newImageDoc._id,
            ImageUrl: newImageDoc.ImageUrl,
          });
          await pub.publish("trigger-blur-worker", "start");
        } catch (error) {
          console.error("❌ Job error:", error.message);
        }
      },
      {
        connection,
        concurrency: 10,
        autorun: false, // manual start
      }
    );

    worker.on('active', job => {
      activeJobs++;
      console.log(`⚙️ Job ${job.id} started. Active jobs: ${activeJobs}`);
    });

    worker.on('completed', async job => {
      activeJobs--;
      console.log(`🎉 Job ${job.id} completed. Remaining: ${activeJobs}`);

      if (activeJobs === 0) {
        setTimeout(async () => {
          if (activeJobs === 0) {
            console.log("⏸️ Pausing worker — queue is empty");
            await worker.pause();
            isRunning = false;
          }
        }, 1000); // small delay for any final jobs
      }
    });

    worker.on('failed', async (job, err) => {
      activeJobs--;
      console.error(`🔥 Job ${job.id} failed: ${err.message}`);
      if (activeJobs === 0) {
        setTimeout(async () => {
          if (activeJobs === 0) {
            console.log("⏸️ Pausing worker (after failure)");
            await worker.pause();
            isRunning = false;
          }
        }, 1000);
      }
    });

    // Redis trigger subscriber
    await sub.subscribe('trigger-upload-worker', async () => {
      if (isRunning) return;
      isRunning = true;

      console.log("📡 Trigger received — resuming worker...");
      await worker.resume();
    });

    console.log("🟢 UploadWorker ready and paused");
    await worker.pause(); // Start in paused mode
  } catch (err) {
    console.error("🚫 Worker init failed:", err.message);
  }
})();
