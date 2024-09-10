'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from 'next-auth/react';
import { FaGithub as GitHub, FaGoogle as Google } from 'react-icons/fa';
import { IconContext, IconType } from 'react-icons';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { register } from '@/actions/register';
import ErrorBox from '@/components/form/ErrorBox';
import { login } from '@/actions/login';
import { useTranslations } from 'next-intl';


const Icon = ({ icon: IconComponent, className }: { icon: IconType; className?: string }) => {
    return (
        <IconContext.Provider value={{ className }}>
            <IconComponent />
        </IconContext.Provider>
    );
};

const schema = z.object({
    email: z.string().email({
        message: 'Email is required',
    }),
    password: z.string().min(1, {
        message: 'Password is required',
    }),
});

type FormValues = z.infer<typeof schema>;

export default function GetStartedPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [generalError, setGeneralError] = useState<string | null>(null);
    const router = useRouter();

    const t = useTranslations('get_started');

    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    // Function to get the user-agent
    const getUserAgent = () => {
        return typeof window !== "undefined" ? navigator.userAgent : "unknown";
    };

    // Function to handle form submission
    const onSubmit = async (data: FormValues) => {
        const userAgent = getUserAgent();

        try {
            if (isLogin) {
                // Login logic
                const result = await login(data, userAgent);


                if (result?.error) {
                    setGeneralError(result.error);
                    setTimeout(() => setGeneralError(null), 5000);
                } else if (result?.twoFactor) {
                    // Handle two-factor authentication required
                    setGeneralError("Two-factor authentication is required.");
                } else {
                    // Redirect to the dashboard on successful login
                    router.push('/dashboard');
                }
            } else {
                // Registration logic
                const response = await register(data);

                console.log("register response:", response); // Log the response for debugging

                if (response.code) {
                    let errorMessage = 'Registration failed: ';

                    switch (response.code) {
                        case 'email_already_in_use':
                            errorMessage += 'This email is already registered. Please use a different email or log in.';
                            break;
                        case 'weak_password':
                            errorMessage += 'Your password is too weak. Please choose a stronger password.';
                            break;
                        case 'invalid_email':
                            errorMessage += 'The email address is not valid. Please check the format and try again.';
                            break;
                        default:
                            errorMessage += 'An unexpected error occurred. Please try again later.';
                    }

                    setGeneralError(errorMessage);
                    setTimeout(() => setGeneralError(null), 5000);
                } else {
                    router.push('/get-started'); // Redirect to login or any other appropriate page
                }
            }
        } catch (error) {
            console.error("Caught error:", error); // Log the caught error for debugging
            setGeneralError("Unexpected error: " + (error as Error).message);
            setTimeout(() => setGeneralError(null), 5000);
        }
    };




    return (
        <div className="flex min-h-screen" suppressHydrationWarning>
            {/* Left Side - Visual */}
            <div className="w-1/2 hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-10">
                <div className="relative">
                    <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                        {t('title')}
                    </h1>
                    <p className="text-2xl mt-4 text-gray-300">
                        {t('description')}
                    </p>
                </div>
                <div className="absolute bottom-10 text-center">
                    <p className="text-sm text-gray-400">
                        {t('join_text')}
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
                <h1 className="block lg:hidden text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                    {t('title')}
                </h1>
                <div className="w-full max-w-lg p-10 space-y-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{isLogin ? 'Login' : 'Sign Up'}</h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {generalError && <ErrorBox message={generalError} />}
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="email"
                                        id="email"
                                        className="mt-1"
                                        placeholder={t('email_placeholder')}
                                    />
                                )}
                            />
                            {errors.email && <ErrorBox message={errors.email.message} />}
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="password"
                                        id="password"
                                        className="mt-1"
                                        placeholder={t('password_placeholder')}
                                    />
                                )}
                            />
                            {errors.password && <ErrorBox message={errors.password.message} />}
                        </div>
                        <Button type="submit" className="w-full bg-blue-500 dark:bg-blue-600 dark:text-white text-white dark:hover:text-black" disabled={isSubmitting}>
                            {isLogin ? `${t('login')}` : `${t('signup')}`}
                        </Button>
                    </form>

                    <div className="relative flex items-center justify-center my-6">
                        <div className="absolute inset-0 flex items-center">
                            <hr className="w-full border-gray-300 dark:border-gray-600" />
                        </div>
                        <span className="relative px-4 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
                            {t('or')}
                        </span>
                    </div>

                    <motion.div
                        className="flex flex-col gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Button
                            type="button"
                            className="w-full flex items-center justify-center space-x-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
                            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
                        >
                            <Icon icon={GitHub} className="w-5 h-5" />
                            <span>{t('github_signin')}</span>
                        </Button>
                        <Button
                            type="button"
                            className="w-full flex items-center justify-center space-x-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
                            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                        >
                            <Icon icon={Google} className="w-5 h-5" />
                            <span>{t('google_signin')}</span>
                        </Button>
                    </motion.div>

                    <div className="text-center mt-6">
                        <Button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            variant="link"
                            className="text-blue-500 dark:text-blue-400 hover:underline"
                        >
                            {isLogin ? `${t('toggle_login_signup.login')}` : `${t('toggle_login_signup.signup')}`}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
