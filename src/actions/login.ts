"use server";

import { AuthError } from "next-auth";
import * as z from "zod";

import { signIn } from "@/app/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/app/schemas/index";

import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import {
    generateTwoFactorToken,
    generateVerificationToken,
} from "@/lib/tokens";
import { getTwoFactorTokenByEmail } from "@/services/services";
import { getUserByEmail } from "@/services/services";
import { redis } from '@/lib/redis';
import { getUserAgentDetails } from "@/lib/userAgent";
import {
    InvalidCredentialsError,
    UserNotFoundError,
} from "@/app/auth"; // Adjust import path as needed

export const login = async (
    values: z.infer<typeof LoginSchema>,
    userAgent: string, // Pass the user-agent to the login function
) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password, code } = validatedFields.data;

    // Retrieve the user from Redis
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: new UserNotFoundError().message };
    }

    const emailVerified = await redis.hget(`user:${existingUser.id}`, 'emailVerified');

    // Check if the email is verified
    if (!emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);

        await sendVerificationEmail(
            existingUser.email,
            {
                token: verificationToken.token,
                expires: verificationToken.expires,
            });

        return { success: "Confirmation email sent!" };
    }

    if (existingUser.isTwoFactorEnabled) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

            if (!twoFactorToken || twoFactorToken.token !== code) {
                return { error: "Invalid code!" };
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if (hasExpired) {
                return { error: "Code expired!" };
            }

            await redis.del(`two_factor:${twoFactorToken.token}`);
            await redis.hset(`two_factor_confirmation:${existingUser.id}`, {
                confirmed: new Date().toISOString(),
            });

        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);
            return { twoFactor: true };
        }
    }

    try {
        const key = `user:login:logs:${email}`

        // Log login details
        const { device, platform } = getUserAgentDetails(userAgent); // Utility function to parse user-agent
        await redis.zadd(key, {
            score: Date.now(),
            member: JSON.stringify({
                timestamp: new Date().toISOString(),
                device,
                platform,
                userAgent,
            }),
        });

        if (await redis.zcard(key) > 5) {
            await redis.zpopmin(key, 1);
        }
        await signIn("credentials", {
            email,
            password,
        });


    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: new InvalidCredentialsError().message };
                default:
                    return { error: "Something went wrong!" };
            }
        }

        throw error;
    }
};
