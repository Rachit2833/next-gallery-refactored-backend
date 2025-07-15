const { Queue } = require("bullmq");
const connection = require("./redis-clinet");

const blurQueue = new Queue("BlurQueue", {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: 5
  }
});

const uploadQueue = new Queue("UploadQueue", {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: 5
  }
});

const faceIdQueue = new Queue("FaceIdQueue", {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: 5
  }
});

const albumQueue = new Queue("AlbumQueue", {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: 5
  }
});

// Optionally set global concurrency
async function initQueue() {
  console.log("✅ Queue Initiated");
  await blurQueue.setGlobalConcurrency(10);
  await uploadQueue.setGlobalConcurrency(10);
  await faceIdQueue.setGlobalConcurrency(10);
  await albumQueue.setGlobalConcurrency(10);
}

initQueue();

module.exports = {
  blurQueue,
  uploadQueue,
  faceIdQueue,
  albumQueue
};
