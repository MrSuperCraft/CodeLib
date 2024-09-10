import React from 'react';
import { Metadata } from 'next';
import GetStartedPage from './GetStartedPage';

export const metadata: Metadata = {
    title: 'Get Started - Login or Sign Up | CodeLib',
    description: 'Login or sign up to CodeLib to access and manage your code snippets efficiently. Get started now for free!',
    keywords: ['Login', 'Sign Up', 'CodeLib', 'Code Snippets', 'User Authentication'],
    authors: [{ name: 'CodeLib', url: 'https://codelib-mrsupercraft.vercel.app' }],
    openGraph: {
        title: 'Get Started - Login or Sign Up | CodeLib',
        description: 'Access CodeLib by logging in or signing up. Manage your code snippets and projects easily.',
        url: 'https://codelib-mrsupercraft.vercel.app/get-started',
        siteName: 'CodeLib',
        images: [
            {
                url: 'https://codelib-mrsupercraft.vercel.app/codelib-opengraph.png',
                alt: 'CodeLib Logo',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Get Started - Login or Sign Up | CodeLib',
        description: 'Join CodeLib and start managing your code snippets. Login or create an account today.',
        images: ['https://codelib-mrsupercraft.vercel.app/codelib-opengraph.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
    viewport: 'width=device-width, initial-scale=1.0',
    alternates: {
        canonical: 'https://codelib-mrsupercraft.vercel.app/get-started',
    },
};

const Page = () => {
    return (
        <div>
            <GetStartedPage />
        </div>
    );
}

export default Page;
