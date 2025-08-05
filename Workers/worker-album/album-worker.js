import dotenv from "dotenv";
dotenv.config({ path: "../config.env" });

import { Worker } from "bullmq";
import { connectDb } from "./lib/connectDb.js";
import connection from "./lib/redis-clinet.js";
import { createClient } from "redis";

import Album from "./Schemas/albumSchema.js";
import uploadFile from "./lib/upload.js";
import { blurQueue } from "./lib/blur-queue.js";

let activeJobs = 0;
let isRunning = false;

(async () => {
  try {
    await connectDb();
    console.log("✅ Database connected");

    const pub = createClient({ url: process.env.REDIS_URL });
    const sub = pub.duplicate();

    await pub.connect();
    await sub.connect();
    console.log("✅ Redis pub/sub connected");

    const worker = new Worker(
      "AlbumQueue",
      async (job) => {
        const { image, meta, } = job.data;
        console.log("📥 Album job received:", job.id);

        try {
          if (!image || !image.mimetype || !image.buffer) {
            throw new Error("Invalid image data");
          }

          const extension = image.mimetype.split("/")[1];
          const originalName = `Rachit2833-${Date.now()}.${extension}`;
          const fileBuffer = Buffer.from(image.buffer.data);

          const { data, error } = await uploadFile(originalName, fileBuffer, image.mimetype);
          if (error) throw new Error("Failed to upload to Supabase");

          const imageUrl = `https://hwhyqxktgvimgzmlhecg.supabase.co/storage/v1/object/public/Images2.0/${originalName}`;

          const albumDoc = new Album({
            userID: meta.userID,
            ImageUrl: imageUrl,
            Name: meta.Name,
            Description: meta.Description,
            blurredImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/AAwNOwENPwEAMQQDNwD+///L2eTO2ub+//8A/v395ejt5enu/v39Q/QXhr/juNAAAAAASUVORK5CYII="
          });

          await albumDoc.save();

          // Add to BlurQueue
          await blurQueue.add("Blur Generator", {
            type: "Album",
            _id: albumDoc._id,
            ImageUrl: albumDoc.ImageUrl,
          });

          console.log(`✅ Album saved and blur job queued: ${albumDoc._id}`);

        } catch (error) {
          console.error("❌ Album job error:", error.message);
          throw error;
        }
      },
      {
        connection,
        concurrency: 5,
        autorun: false,
        lockDuration: 60000,
        stalledInterval: 30000,
      }
    );

    worker.run();

    const checkPause = async () => {
      if (activeJobs === 0 && isRunning) {
        console.log("⏸️ Pausing Album worker — idle");
        await worker.pause();
        isRunning = false;
      }
    };

    worker.on("active", (job) => {
      activeJobs++;
      console.log(`⚙️ Album job ${job.id} started. Active jobs: ${activeJobs}`);
    });

    worker.on("completed", async (job) => {
      activeJobs--;
      console.log(`🎉 Album job ${job.id} completed. Remaining: ${activeJobs}`);
      setTimeout(checkPause, 1000);
    });

    worker.on("failed", async (job, err) => {
      activeJobs--;
      console.error(`🔥 Album job ${job.id} failed: ${err.message}`);
      setTimeout(checkPause, 1000);
    });

    // Subscribe to trigger
    await sub.subscribe("trigger-album-worker", async () => {
      if (isRunning) return;
      console.log("📡 Trigger received — resuming album worker...");
      await worker.resume();
      isRunning = true;
      await pub.publish("worker-status", JSON.stringify({ status: "resumed", worker: "album-worker" }));
      console.log("▶️ AlbumWorker resumed and active");
    });

    console.log("🟣 AlbumWorker ready and paused");
    await worker.pause();

    // Optional: Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("🛑 Shutting down AlbumWorker...");
      await worker.close();
      await pub.quit();
      await sub.quit();
      process.exit(0);
    });

  } catch (err) {
    console.error("🚫 Album worker init failed:", err.message);
  }
})();
