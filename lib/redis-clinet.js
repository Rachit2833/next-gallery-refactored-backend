const {createClient} = require("redis")

const client = createClient({
  url: process.env.REDIS_URL, // uses env var if present
});
client.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});
await client.connect()
console.log('✅ Redis connected successfully');

export default client;