const path = require('path');
const dotenv = require('dotenv');
const IORedis = require('ioredis');

dotenv.config({ path: path.resolve(__dirname, '../config.env') });

// ✅ Create Redis connection with required options
const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null
});

connection.on('connect', () => {
  console.log('✅ Connected to Redis');
});

connection.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message);
});

module.exports = connection;
