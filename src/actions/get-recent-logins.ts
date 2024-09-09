// utils/getRecentLogins.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({ url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL!, token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN! });

export async function getRecentLogins(email: string) {
    const logs = await redis.zrange(`user:login:logs:${email}`, 0, 4, { withScores: true, rev: true });
    console.log(logs);

    const formattedLogs = [];

    for (let i = 0; i < logs.length; i += 2) {
        const logEntry = logs[i]; // Object
        const timestamp = Number(logs[i + 1]); // Timestamp (score)

        // Ensure logEntry is an object
        const logData = typeof logEntry === 'string' ? JSON.parse(logEntry) : logEntry;

        formattedLogs.push({
            ...logData,
            timestamp: new Date(timestamp).toISOString(), // Convert score to timestamp
        });
    }

    return formattedLogs;
}

