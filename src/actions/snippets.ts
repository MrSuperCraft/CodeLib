import { Redis } from '@upstash/redis';

const redis = new Redis({ url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL!, token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN! });


export const saveSnippetsToRedis = async (email: string, snippets: any) => {
    const key = `snippets:${email}`;
    await redis.set(key, JSON.stringify(snippets));
};

export const getSnippetsFromRedis = async (email: string) => {
    const key = `snippets:${email}`;
    const data = await redis.get(key);
    return data;
};

