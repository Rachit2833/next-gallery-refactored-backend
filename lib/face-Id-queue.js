const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });

const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const mongoose = require('mongoose');
const canvas = require('canvas');
const faceapi = require('@vladmandic/face-api');
const tf = require('@tensorflow/tfjs-node');
const chalk = require('chalk');

const { connectDb } = require('../lib/connectDb.js');
const Label = require('../Schema/labelSchema.js');
const SchemaImage = require('../Schema/imageSchema.js');
const { blurQueue } = require('./blur-queue.js');

const connection = new IORedis({ maxRetriesPerRequest: null });

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

let modelsLoaded = false;
async function loadModels(modelPath = '../public/weights') {
  if (modelsLoaded) return;
  await faceapi.nets.tinyFaceDetector.loadFromDisk(modelPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
  modelsLoaded = true;
}

(async () => {
  try {
    await connectDb();
    console.log(chalk.green.bold("\n✅ Database connected\n"));

    const worker = new Worker(
      'FaceIdQueue',
      async (job) => {
        const { blurredImage, ImageUrl, userId, _id } = job.data;

        console.log(chalk.blueBright(`\n🖼️  Processing Image ID: ${chalk.white.bold(_id)}\n`));

        await loadModels('../public/weights');

        const labeledDocs = await Label.find();
        const labeledFaceDescriptors = labeledDocs.map(entry => {
          const descriptors = entry.descriptors.map(d => new Float32Array(d));
          return new faceapi.LabeledFaceDescriptors(`${entry.label}/${entry._id}`, descriptors);
        });

        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

        const img = await canvas.loadImage(ImageUrl);
        const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        const results = [];
        const newlyCreatedIds = [];

        for (const fd of detections) {
          const match = faceMatcher.findBestMatch(fd.descriptor);
          const matchedId = match.label.split("/")[1];
          const isNewlyCreated = newlyCreatedIds.includes(matchedId);

          console.log(chalk.gray(`🔍 Match result: ${match.label} (${match.distance.toFixed(3)})`));

          if (match.label === 'unknown' || isNewlyCreated || match.distance > 0.6) {
            console.log(chalk.yellow.bold('\n⚠️  Unknown or new user detected — saving new label...\n'));

            const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, '');
            const generatedLabel = `User-${timestamp}`;

            const newLabel = new Label({
              label: generatedLabel,
              descriptors: [Array.from(fd.descriptor)],
              userId: userId || 'unassigned',
              blurredImage: blurredImage || 'N/A',
              ImageUrl: ImageUrl || 'N/A',
            });

            const saved = await newLabel.save();
            newlyCreatedIds.push(saved._id.toString());

            console.log(chalk.green(`✅ New label saved: ${saved.label} (${saved._id})`));

            await blurQueue.add("Blur Generator", {
              type: "People",
              _id:saved._id,
              ImageUrl
            });

            console.log(chalk.cyan('📤 Pushed to Blur Queue\n'));

            results.push({
              _id: saved._id,
              label: saved.label,
              distance: match.distance,
              box: fd.detection.box
            });
          } else {
            results.push({
              _id: matchedId,
              label: match.label.split("/")[0],
              distance: match.distance,
              box: fd.detection.box
            });
          }
        }

        console.log(chalk.magenta('\n👥 Final Matched Results:'));
        console.log(results, '\n');

        const updateResult = await SchemaImage.updateOne(
          { _id },
          { $push: { People: results } }
        );

        console.log(chalk.green('✅ Image document updated successfully'));
        console.log(updateResult, '\n');

        return results;
      },
      { connection }
    );

    worker.on('completed', job => {
      console.log(chalk.bgGreen.black(`\n✅ Job ${job.id} completed successfully\n`));
    });

    worker.on('failed', (job, err) => {
      console.error(chalk.bgRed.white(`❌ Job ${job.id} failed:`), err.message);
    });

  } catch (err) {
    console.error(chalk.red.bold("❌ Failed to initialize worker:"), err.message);
  }
})();

module.exports = { connection };
