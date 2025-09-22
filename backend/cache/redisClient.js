// backend/cache/redisClient.js
import { createClient } from 'redis';

const redis = createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',       // fallback host
    port: parseInt(process.env.REDIS_PORT) || 6379,   // fallback port
  },
  password: process.env.REDIS_PASSWORD || '',          // fallback empty password
});

redis.on('error', (err) => console.error('Redis Client Error', err));
redis.on('connect', () => console.log('Redis connected'));

await redis.connect();

export default redis;
