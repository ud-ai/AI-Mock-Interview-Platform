import Redis from 'ioredis';

let redisClient: Redis | null = null;
const memoryStore = new Map<string, string>();

if (process.env.REDIS_URL) {
  try {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      retryStrategy(times) {
        if (times > 3) {
          console.warn('Redis connection failed. Falling back to in-memory store.');
          return null; // Stop retrying
        }
        return Math.min(times * 100, 2000);
      },
    });

    redisClient.on('error', (err) => {
      console.warn('Redis error, fallback to memory cache:', err.message);
    });
  } catch (err) {
    console.warn('Could not initialize Redis. Falling back to in-memory store.');
  }
} else {
  console.log('No REDIS_URL found. Using in-memory store for session states.');
}

export const sessionStore = {
  async get(key: string): Promise<string | null> {
    if (redisClient && redisClient.status === 'ready') {
      try {
        return await redisClient.get(key);
      } catch (err) {
        console.warn('Redis GET failed, falling back to memory store:', err);
      }
    }
    return memoryStore.get(key) || null;
  },

  async set(key: string, value: string, expireSeconds?: number): Promise<void> {
    if (redisClient && redisClient.status === 'ready') {
      try {
        if (expireSeconds) {
          await redisClient.set(key, value, 'EX', expireSeconds);
        } else {
          await redisClient.set(key, value);
        }
        return;
      } catch (err) {
        console.warn('Redis SET failed, falling back to memory store:', err);
      }
    }
    memoryStore.set(key, value);
    if (expireSeconds) {
      setTimeout(() => {
        memoryStore.delete(key);
      }, expireSeconds * 1000);
    }
  },

  async del(key: string): Promise<void> {
    if (redisClient && redisClient.status === 'ready') {
      try {
        await redisClient.del(key);
        return;
      } catch (err) {
        console.warn('Redis DEL failed, falling back to memory store:', err);
      }
    }
    memoryStore.delete(key);
  }
};
