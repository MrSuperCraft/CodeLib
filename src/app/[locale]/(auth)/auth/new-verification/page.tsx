import React from 'react';
import { Metadata } from 'next';
import NewVerificationPage from './NewVerificationPage';

export const metadata: Metadata = {
    title: 'Verify Your Account | CodeLib',
    description: 'Verify your account with the link sent to your email to start using CodeLib.',
    keywords: ['Account Verification', 'Email Verification', 'CodeLib'],
    authors: [{ name: 'CodeLib', url: 'https://codelib-mrsupercraft.vercel.app' }],
    openGraph: {
        title: 'Verify Your Account | CodeLib',
        description: 'Click the verification link sent to your email to activate your account on CodeLib.',
        url: 'https://codelib-mrsupercraft.vercel.app/verify-account',
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
        title: 'Verify Your Account | CodeLib',
        description: 'Activate your CodeLib account by verifying your email.',
        images: ['https://codelib-mrsupercraft.vercel.app/codelib-opengraph.png'],
    },
    robots: {
        index: false,  // This ensures the page is not indexed by search engines.
        follow: false, // Also prevents search engines from following links on this page.
    },
    viewport: 'width=device-width, initial-scale=1.0',
    alternates: {
        canonical: 'https://codelib-mrsupercraft.vercel.app/verify-account',
    },
};

const Page = () => {
    return (
        <div>
            <NewVerificationPage />
        </div>
    );
}

export default Page;
