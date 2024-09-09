import { redis } from '@/app/auth';
import bcrypt from 'bcrypt'


/**
 * Changes the user's password.
 * @param id - The ID of the user.
 * @param newPassword - The new password.
 * @returns A promise that resolves when the password change is complete.
 * @throws An error if the user is not eligible to change their password.
 */
export async function changePassword(id: string, newPassword: string): Promise<void> {
    // Define the key to look up the user
    const userKey = `user:${id}`;

    // Fetch the user from Redis
    const user = await redis.get(userKey) as any;

    // Check if the user exists and has a password property
    if (user && user.password) {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update the user's password in Redis
        await redis.set(userKey, JSON.stringify({ ...JSON.parse(user), password: hashedPassword }));

        console.log('Password updated successfully');
    } else {
        // Throw an error if the user is not eligible to change their password
        throw new Error('User is not eligible to change their password');
    }
}