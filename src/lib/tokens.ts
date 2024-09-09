import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { redis } from '@/lib/redis'; // Adjusted import based on your setup
import { getPasswordResetTokenByEmail, getVerificationTokenByEmail, getTwoFactorTokenByEmail } from '@/services/services'

const VERIFICATION_PREFIX = 'verification:';
const PASSWORD_RESET_PREFIX = 'password_reset:';
const TWO_FACTOR_PREFIX = 'two_factor:';

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000).toISOString(); // Convert to ISO string for Redis

    // Remove existing token if any
    const existingToken = await getVerificationTokenByEmail(email);
    if (existingToken) {
        await redis.del(`${VERIFICATION_PREFIX}${existingToken.token}`);
    }

    // Store new token
    await redis.set(`${VERIFICATION_PREFIX}${token}`, JSON.stringify({ email, token, expires }));

    return { email, token, expires };
};

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000).toISOString(); // Convert to ISO string for Redis

    // Remove existing token if any
    const existingToken = await getPasswordResetTokenByEmail(email);
    if (existingToken) {
        await redis.del(`${PASSWORD_RESET_PREFIX}${existingToken.token}`);
    }

    // Store new token
    await redis.set(`${PASSWORD_RESET_PREFIX}${token}`, JSON.stringify({ email, token, expires }));

    return { email, token, expires };
};

export const generateTwoFactorToken = async (email: string) => {
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 3600 * 1000).toISOString(); // Convert to ISO string for Redis

    // Remove existing token if any
    const existingToken = await getTwoFactorTokenByEmail(email);
    if (existingToken) {
        await redis.del(`${TWO_FACTOR_PREFIX}${existingToken.token}`);
    }

    // Store new token
    await redis.set(`${TWO_FACTOR_PREFIX}${token}`, JSON.stringify({ email, token, expires }));

    return { email, token, expires };
};
