import NextAuth, { CredentialsSignin } from "next-auth";
import Google from 'next-auth/providers/google';
import Github from 'next-auth/providers/github';
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { Redis } from "@upstash/redis";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from '@/app/schemas/index';
import bcrypt from 'bcrypt';
import { getUserByEmail, getUserById, getAccountByUserId, getTwoFactorConfirmationByUserId } from '@/services/services';

export const redis = new Redis({ url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL!, token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN! });

// Custom Auth Error to extend for different custom codes
export class CustomAuthError extends CredentialsSignin {
    code: string;

    constructor(code: string, message: string) {
        super(message);
        this.code = code;
    }
}
export class InvalidCredentialsError extends CustomAuthError {
    constructor() {
        super('invalid_credentials', 'The email or password is incorrect.');
    }
}

export class UserNotFoundError extends CustomAuthError {
    constructor() {
        super('user_not_found', 'No user found with this email address.');
    }
}

export class IncorrectPasswordError extends CustomAuthError {
    constructor() {
        super('incorrect_password', 'The password you entered is incorrect.');
    }
}

export class EmailNotVerifiedError extends CustomAuthError {
    constructor() {
        super('email_not_verified', 'Your email is not verified. Please verify your email and try again.');
    }
}

export class TwoFactorRequiredError extends CustomAuthError {
    constructor() {
        super('two_factor_required', 'Two-factor authentication is required. Please complete the two-factor authentication.');
    }
}

export class EmailAlreadyInUseError extends CustomAuthError {
    constructor() {
        super('email_already_in_use', 'The provided email is already in use.');
    }
}




export const { handlers, signIn, signOut, auth } = NextAuth({
    pages: {
        signIn: "/get-started",
        error: "/auth/error",
    },
    adapter: UpstashRedisAdapter(redis),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Github({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        Credentials({
            async authorize(credentials) {
                // Validate the incoming credentials against the schema
                const validatedFields = LoginSchema.safeParse(credentials);
                if (!validatedFields.success) {
                    console.error("Validation failed:", validatedFields.error.errors);
                    throw new InvalidCredentialsError()
                }

                const { email, password } = validatedFields.data;
                const user = await getUserByEmail(email);

                if (!user || !user.password) {
                    console.warn("User not found or password not set for email:", email);
                    throw new UserNotFoundError()
                }

                const passwordsMatch = await bcrypt.compare(password, user.password);
                if (!passwordsMatch) {
                    console.warn("Password mismatch for email:", email);
                    throw new IncorrectPasswordError()
                }

                // If everything is fine, return the user object
                return user;
            },
        })

    ],
    callbacks: {
        async session({ session, token, user }) {
            if (session.user && user?.id) {
                session.user.id = user.id;
            } else if (session.user && token?.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
        async signIn({ user, account }: { user: any; account: any }) {
            if (account?.provider !== "credentials") {
                return true
            };

            // Fetch user by ID
            const existingUser = await getUserByEmail(user.email);

            if (!existingUser) {
                throw new UserNotFoundError();
            }

            const id = existingUser.id;

            // Check email verification status
            const emailVerified = await redis.hget(`user:${id}`, 'emailVerified');
            if (!emailVerified) {
                console.log(`Email not verified for user ID ${existingUser.id}`);
                throw new EmailNotVerifiedError();
            }

            // Handle two-factor authentication
            if (existingUser.isTwoFactorEnabled) {
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

                if (!twoFactorConfirmation) {
                    console.log(`Two-factor confirmation not found for user ID ${existingUser.id}`);
                    throw new TwoFactorRequiredError();
                }

                // Example of setting two-factor authentication data in Redis
                const twoFactorData = {
                    token: existingUser.id, // Adjust based on your two-factor implementation
                    expires: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
                };

                await redis.set(`two_factor:${id}`, JSON.stringify(twoFactorData));
            }

            return true;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
        async jwt({ token }) {

            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);
            if (!existingUser) return token;

            const existingAccount = await getAccountByUserId(existingUser.id);

            token.isOAuth = !!existingAccount;
            token.name = existingUser.name;
            token.email = existingUser.email;

            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
            return token;
        },
    },
    session: { strategy: "jwt" },
});
