// lib/blur-queue.js
const { Queue } = require("bullmq");

const blurQueue = new Queue("BlurQueue");
const uploadQueue = new Queue("UploadQueue");
const faceIdQueue = new Queue("FaceIdQueue");
const albumQueue = new Queue("AlbumQueue");

// setup inside a function
async function initQueue() {
  console.log("Queue Initiated");
  await blurQueue.setGlobalConcurrency(10);
  await uploadQueue.setGlobalConcurrency(10);
  await faceIdQueue.setGlobalConcurrency(10);
}

initQueue(); // run setup when module is loaded


module.exports = {
  blurQueue,
  uploadQueue,
  faceIdQueue,
  albumQueue 

};
