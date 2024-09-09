import { Redis } from '@upstash/redis';
import argon2 from 'argon2';


const redis = new Redis({ url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL!, token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN! });



export async function deleteAccount(userId: string, email: string) {
    try {
        // Collecting keys to delete
        const keysToDelete = [
            `snippets:${email}`, // User snippets
            `user:${userId}`, // General user data
            `user:email:${email}`, // Email to user ID relation
            `user:login:logs:${email}`, // Login logs
        ];

        // Fetch and add account-specific keys
        const accountKeys = await redis.keys(`user:account:by-user-id:${userId}:*`);
        keysToDelete.push(...accountKeys);

        // Fetch provider-specific keys for each account key
        const providerKeys = await Promise.all(
            accountKeys.map(async (accountKey) => {
                return redis.keys(`${accountKey}:*`);
            })
        );
        providerKeys.flat().forEach((key) => keysToDelete.push(key));

        // Fetch provider-specific keys directly using known patterns
        const additionalProviderKeys = await redis.keys(`user:account:*`);
        keysToDelete.push(...additionalProviderKeys);

        // Delete all collected keys
        await Promise.all(keysToDelete.map(key => redis.del(key)));
        console.log('User account deleted successfully.');
    } catch (error) {
        console.error('Error deleting account:', error);
    }
}

