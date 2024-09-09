import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }),
    code: z.optional(z.string()),
});



export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(6, {
        message: "Minimum 6 characters required",
    }),
});


export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
});


export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum of 6 characters required",
    }),
});


export const SettingsSchema = z.object({
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    newPassword: z.string().min(6).optional(),
    isTwoFactorEnabled: z.boolean().optional(),
}).refine(
    (data) => {
        if (data.password && !data.newPassword) {
            return false;
        }

        return true;
    },
    {
        message: "New password is required when updating the password.",
        path: ["newPassword"],
    }
).refine(
    (data) => {
        if (data.newPassword && !data.password) {
            return false;
        }

        return true;
    },
    {
        message: "Old password is required when setting a new password.",
        path: ["password"],
    }
);
