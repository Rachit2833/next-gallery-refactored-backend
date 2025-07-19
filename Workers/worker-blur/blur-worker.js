import { Worker } from "bullmq";
import dotenv from "dotenv";
import { connectDb } from "./lib/connectDb.js";
import connection from "./lib/redis-clinet.js";
import { createClient } from "redis";

import Image from "./Schemas/imageSchema.js";
import Label from "./Schemas/labelSchema.js";
import Album from "./Schemas/albumSchema.js";
import { getImageBlurred } from "./lib/util.mjs"
dotenv.config({ path: "../config.env" });

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
      "BlurQueue",
      async (job) => {
        const { ImageUrl, type, _id } = job.data;
        console.log(`📥 Blur job ${job.id} received — Type: ${type}, ID: ${_id}`);

        try {
    
          const blurredImage = await getImageBlurred(ImageUrl);

          let updatedDoc;
          if (type === "Image") {
            updatedDoc = await Image.updateOne({ _id }, { $set: { blurredImage } });
          } else if (type === "People") {
            updatedDoc = await Label.updateOne({ _id }, { $set: { blurredImage } });
          } else if (type === "Album") {
            updatedDoc = await Album.updateOne({ _id }, { $set: { blurredImage } });
          } else {
            throw new Error("Unsupported type for blur processing");
          }

          console.log(`✅ Blur saved for ${type}: ${_id}`);
          await pub.publish("upload-response", JSON.stringify({ status: "blurred", _id, type }));
        } catch (err) {
          console.error("❌ Blur processing failed:", err.message);
          throw err;
        }
      },
      {
        connection,
        concurrency: 10,
        autorun: false,
        lockDuration: 60000, // 60 seconds before a job is considered stalled
        stalledInterval: 3000000, // Check for stalled jobs every 30 seconds (default)
      }
    );

    worker.run();

    worker.on("active", (job) => {
      activeJobs++;
      console.log(`⚙️ Job ${job.id} started. Active jobs: ${activeJobs}`);
    });

    const checkPause = async () => {
      if (activeJobs === 0 && isRunning) {
        console.log("⏸️ Pausing blur worker — idle");
        await worker.pause();
        isRunning = false;
      }
    };

    worker.on("completed", async (job) => {
      activeJobs--;
      console.log(`🎉 Job ${job.id} completed. Remaining: ${activeJobs}`);
      setTimeout(checkPause, 1000);
    });

    worker.on("failed", async (job, err) => {
      activeJobs--;
      console.error(`🔥 Job ${job.id} failed: ${err.message}`);
      setTimeout(checkPause, 1000);
    });

    await sub.subscribe("trigger-blur-worker", async () => {
      if (isRunning) return;
      console.log("📡 Trigger received — resuming blur worker...");
      await worker.resume();
      isRunning = true;
      await pub.publish("worker-status", JSON.stringify({ status: "resumed", worker: "blur-worker" }));
      console.log("▶️ BlurWorker resumed and active");
    });

    console.log("🟣 BlurWorker ready and paused");
    await worker.pause();
  } catch (err) {
    console.error("🚫 Blur worker init failed:", err.message);
  }
})();
