const { Worker } = require("bullmq");
const dotenv = require("dotenv");
const { connectDb } = require("./lib/connectDb.js");
const Label = require("./Schemas/labelSchema.js");
const SchemaImage = require("./Schemas/imageSchema.js");
const { blurQueue } = require("./lib/blur-queue.js");
const canvas = require("canvas");
const faceapi = require("@vladmandic/face-api");
const chalk = require("chalk");
const { createClient } = require("redis");
const connection = require("./lib/redis-clinet.js");
const { default: mongoose } = require("mongoose");

dotenv.config({ path: "../config.env" });

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

let activeJobs = 0;
let isRunning = false;
let modelsLoaded = false;

async function loadModels(modelPath = './public/weights') {
  if (modelsLoaded) return;
  await faceapi.nets.tinyFaceDetector.loadFromDisk(modelPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
  modelsLoaded = true;
}

(async () => {
  try {
    await connectDb();
    console.log(chalk.green.bold("✅ Database connected"));

    const pub = createClient({ url: process.env.REDIS_URL });
    const sub = pub.duplicate();
    await pub.connect();
    await sub.connect();

    const worker = new Worker(
      "FaceIdQueue",
      async (job) => {
        console.log(chalk.blue(`📥 Job ${job.id} received`));
        const { blurredImage, ImageUrl, userID, _id } = job.data;

        await loadModels('./public/weights');

        const labeledDocs = await Label.find();
        const labeledFaceDescriptors = labeledDocs.map(entry => {
          const descriptors = entry.descriptors.map(d => new Float32Array(d));
          return new faceapi.LabeledFaceDescriptors(`${entry.label}/${entry._id}`, descriptors);
        });

        const hasLabels = labeledFaceDescriptors.length > 0;
        const faceMatcher = hasLabels ? new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6) : null;

        const img = await canvas.loadImage(ImageUrl);
        const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        const results = [];
        const newlyCreatedIds = [];

        for (const fd of detections) {
          let match = null;
          let isNewLabel = false;

          if (faceMatcher) {
            match = faceMatcher.findBestMatch(fd.descriptor);
            const matchedId = match.label.split("/")[1];
            const isNewlyCreated = newlyCreatedIds.includes(matchedId);

            if (match.label === 'unknown' || isNewlyCreated || match.distance > 0.6) {
              isNewLabel = true;
            }

            if (!isNewLabel) {
              results.push({
                _id: matchedId,
                label: match.label.split("/")[0],
                distance: match.distance,
                box: fd.detection.box,
              });
              continue; // Skip new label creation
            }
          } else {
            isNewLabel = true;
          }

          // Create new label if no match or no matcher exists
          const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, '');
          const generatedLabel = `User-${timestamp}`;

          const newLabel = new Label({
            label: generatedLabel,
            descriptors: [Array.from(fd.descriptor)],
            userID: new  mongoose.Types.ObjectId(userID),
            blurredImage: blurredImage || 'N/A',
            ImageUrl: ImageUrl || 'N/A',
          });

          const saved = await newLabel.save();
          newlyCreatedIds.push(saved._id.toString());

          await blurQueue.add("Blur Generator", {
            type: "People",
            _id: saved._id,
            ImageUrl,
          });

          results.push({
            _id: saved._id,
            label: saved.label,
            distance: match?.distance ?? null,
            box: fd.detection.box,
          });
        }

        await SchemaImage.updateOne(
          { _id },
          { $push: { People: { $each: results.map(r => r._id) } } }
        );

        console.log(chalk.magenta("👥 Final Matched Results:"), results);
      },
      {
        connection,
        concurrency: 10,
        autorun: false,
      }
    );

    worker.on("active", (job) => {
      activeJobs++;
      console.log(`⚙️ FaceId Job ${job.id} started. Active jobs: ${activeJobs}`);
    });

    worker.on("completed", async (job) => {
      activeJobs--;
      console.log(`✅ FaceId Job ${job.id} completed. Remaining: ${activeJobs}`);
      if (activeJobs === 0) {
        setTimeout(async () => {
          if (activeJobs === 0) {
            console.log("⏸️ Pausing FaceId worker — idle");
            await worker.pause();
            isRunning = false;
          }
        }, 1000);
      }
    });

    worker.on("failed", async (job, err) => {
      activeJobs--;
      console.error(`🔥 FaceId Job ${job.id} failed: ${err.message}`);
      if (activeJobs === 0) {
        setTimeout(async () => {
          if (activeJobs === 0) {
            console.log("⏸️ Pausing FaceId worker (after failure)");
            await worker.pause();
            isRunning = false;
          }
        }, 1000);
      }
    });

    await sub.subscribe("trigger-detection-worker", async () => {
      if (isRunning) return;
      isRunning = true;

      console.log("📡 Trigger received — resuming FaceId worker...");
      await worker.resume();
    });

    console.log("🟢 FaceIdWorker ready and paused");
    await worker.pause();
  } catch (err) {
    console.error(chalk.red.bold("❌ FaceId Worker init failed:"), err.message);
  }
})();
