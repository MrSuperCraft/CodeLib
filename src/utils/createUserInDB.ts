import { Redis } from '@upstash/redis';

// Initialize the Upstash Redis client with your endpoint and token
const redis = new Redis({ url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL!, token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN! });


interface CreateUserParams {
    email: string;
    hashedPassword: string;
}

export const createUserInDB = async ({ email, hashedPassword }: CreateUserParams) => {
    // Check if the user already exists
    const existingUser = await redis.get(`user:${email}`);

    if (existingUser) {
        throw new Error('User already exists');
    }

    // Create a unique ID for the new user
    const userId = `user:${email}`;

    // Store the user data in Redis
    const user = {
        email,
        hashedPassword,
        createdAt: new Date().toISOString(),
    };

    // Save the user data in Redis
    await redis.set(userId, JSON.stringify(user));

    return user;
};
