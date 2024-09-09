import { redis } from '@/lib/redis';

export async function getUserData(id: string, email: string) {
    if (!id || !email) {
        throw new Error('ID and email are required');
    }

    try {
        // Fetching data from multiple Redis keys
        const [userDataById, loginLogs, snippets, userDataByEmail] = await Promise.all([
            redis.get(`user:${id}`),              // Fetch user data by ID
            redis.zrange(`user:login:logs:${email}`, 0, -1),  // Fetch user login logs (assuming list type)
            redis.get(`snippets:${email}`),       // Fetch snippets associated with the email
            redis.get(`user:${email}`)            // Fetch user data by email (if exists)
        ]);

        // Combine the fetched data into a single object
        const combinedData = {
            userDataById: userDataById || {},               // In case no data, return empty object
            loginLogs: loginLogs || [],                    // Empty array for logs
            snippets: snippets || {},                      // Empty object for snippets
            userDataByEmail: userDataByEmail || {}          // Empty object for additional user data
        };

        // Return combined data as JSON object
        return combinedData;

    } catch (error) {
        console.error('Error fetching user data:', error);
        throw new Error('Failed to retrieve user data');
    }
}
