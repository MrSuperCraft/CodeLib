"use server";

import bcrypt from "bcrypt";
import * as z from "zod";

import { redis } from "@/lib/redis"; // Ensure you have a Redis client setup here
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { RegisterSchema } from "@/app/schemas/index";
import { v4 as uuidv4 } from 'uuid';
import { EmailAlreadyInUseError, InvalidCredentialsError } from "@/app/auth";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return new InvalidCredentialsError();
    }

    const { email, password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the user already exists
    const existingUser = await redis.get(`user:${email}`);
    if (existingUser) {
        return new EmailAlreadyInUseError();
    }

    // Generate a unique ID for the user
    const userId = uuidv4();

    // For the name, pick the prefix of the email
    const name = email.split('@')[0];


    // Store the new user with ID
    await redis.set(`user:${email}`, JSON.stringify({ id: userId, email, password: hashedPassword, name }));

    // Generate and send verification token
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(email, verificationToken);

    return { success: "Confirmation email sent!", code: "success", error: null };
};
