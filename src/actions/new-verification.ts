"use server";

import { redis } from "@/lib/redis"; // Assuming you have a Redis client configured
import { getUserByEmail, getVerificationTokenByToken } from "@/services/services";

export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);
    if (!existingToken) {
        return { error: "Token does not exist!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
        return { error: "Token has expired!" };
    }

    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
        return { error: "Email does not exist!" };
    }

    // Update the user's email verification status
    await redis.hset(`user:${existingUser.id}`, {
        emailVerified: new Date().toISOString(),
        email: existingToken.email,
    });

    // Delete the verification token from Redis
    await redis.del(`verificationToken:${existingToken.id}`);

    return { success: "Email verified!" };
};
