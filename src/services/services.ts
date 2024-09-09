import { redis } from '@/lib/redis';

const PASSWORD_RESET_PREFIX = 'password_reset:';
const TWO_FACTOR_PREFIX = 'two_factor:';
const USER_PREFIX = 'user:';
const VERIFICATION_PREFIX = 'verification:';
const ACCOUNT_PREFIX = 'account:';

// Helper function to handle different Redis return types
const parseRedisResult = (result: any) => {
    if (typeof result === 'object' && result !== null) {
        return result; // Already an object, no parsing needed
    }

    if (typeof result === 'string') {
        return JSON.parse(result); // Parse JSON string
    }

    console.error(`Unexpected result type: ${typeof result}`);
    return null;
};

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const key = `${PASSWORD_RESET_PREFIX}${token}`;
        const result = await redis.get(key);
        return parseRedisResult(result);
    } catch {
        return null;
    }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const result = await redis.hgetall(`password_reset_by_email:${email}`);
        return parseRedisResult(result?.token);
    } catch {
        return null;
    }
};

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
    try {
        const key = `${TWO_FACTOR_PREFIX}${userId}:confirmation`;
        const result = await redis.get(key);
        return parseRedisResult(result);
    } catch {
        return null;
    }
};

export const getTwoFactorTokenByToken = async (token: string) => {
    try {
        const key = `${TWO_FACTOR_PREFIX}${token}`;
        const result = await redis.get(key);
        return parseRedisResult(result);
    } catch {
        return null;
    }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        const result = await redis.hgetall(`two_factor_by_email:${email}`);
        return parseRedisResult(result?.token);
    } catch {
        return null;
    }
};

export const getUserByEmail = async (email: string) => {
    try {
        const key = `${USER_PREFIX}${email}`;
        const result = await redis.get(key);

        // Handle the result
        return parseRedisResult(result);
    } catch (error) {
        console.error(`Error retrieving user by email: ${error}`);
        return null;
    }
};

export const getUserById = async (id: string) => {
    try {
        const key = `${USER_PREFIX}${id}`;
        const result = await redis.get(key);
        return parseRedisResult(result);
    } catch {
        return null;
    }
};

export const getVerificationTokenByToken = async (token: string) => {
    try {
        const key = `${VERIFICATION_PREFIX}${token}`;
        const result = await redis.get(key);
        return parseRedisResult(result);
    } catch (error) {
        console.error(`Error retrieving token: ${error}`);
        return null;
    }
};

export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const result = await redis.hgetall(`verification_by_email:${email}`);
        return parseRedisResult(result?.token);
    } catch {
        return null;
    }
};



export const getAccountByUserId = async (userId: string): Promise<Record<string, any> | null> => {
    try {
        const key = `${ACCOUNT_PREFIX}${userId}`;
        const result = await redis.get(key);

        if (result) {
            // Parse the result if it's a JSON string
            return parseRedisResult(result);
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error retrieving account for userId ${userId}:`, error);
        return null;
    }
};