const path = require('path');
const dotenv = require('dotenv');
const IORedis = require('ioredis');

// Load environment variables BEFORE using them
dotenv.config({ path: path.resolve(__dirname, '../config.env') });

// Build Redis connection config
const redisConfig = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
};

// Optional TLS (e.g., for Redis Cloud or Upstash)
if (process.env.REDIS_USE_TLS === 'true') {
  redisConfig.tls = {};
}

// Create Redis connection
const connection = new IORedis(redisConfig);

// Logging connection events
connection.on('connect', () => {
  console.log('✅ Connected to Redis');
});

connection.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message);
});

module.exports = connection;
