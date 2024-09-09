import { Redis } from '@upstash/redis';
import bcrypt from 'bcrypt';

// Initialize the Upstash Redis client with your endpoint and token
const redis = new Redis({ url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL!, token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN! });

/**
 * Fetch a user by email from the Upstash Redis database and verify the password.
 *
 * @param {string} email - The email of the user to fetch.
 * @param {string} passwordHash - The hash of the password to verify.
 * @returns {Promise<Object|null>} The user object if the email and password match, or null if not.
 */
async function getUserFromDB(email: string, passwordHash: string) {
    try {
        // Construct the Redis key for the user (e.g., "user:<email>")
        const userKey = `user:${email}`;

        // Fetch the user data from Redis
        const user = await redis.get<string | null>(userKey);

        // If user is not found or not a string, return null
        if (!user || typeof user !== 'string') {
            return null;
        }

        // Parse the user data
        const userData = JSON.parse(user);

        // Check if the provided password hash matches the stored hash
        const isPasswordValid = await bcrypt.compare(passwordHash, userData.passwordHash);

        // If password is not valid, return null
        if (!isPasswordValid) {
            return null;
        }

        // Return the user data (excluding the password hash)
        const { passwordHash: _, ...userWithoutPassword } = userData;
        return userWithoutPassword;
    } catch (error) {
        console.error('Error fetching user from Redis:', error);
        throw new Error('Failed to fetch user from database');
    }
}

export { getUserFromDB };
