import { Redis } from '@upstash/redis';

// Initialize the Upstash Redis client with your endpoint and token
const redis = new Redis({ url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL!, token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN! });



export { redis };