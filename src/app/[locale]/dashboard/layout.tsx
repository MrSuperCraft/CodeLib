import React from 'react';
import { Metadata } from 'next';
import RootLayout from './RootLayout';

export const metadata: Metadata = {
    title: 'Dashboard | CodeLib',
    description: 'Your dashboard on CodeLib',
    openGraph: {
        title: 'Dashboard | CodeLib',
        description: 'Manage your projects and snippets from your dashboard on CodeLib.',
        url: 'https://codelib-mrsupercraft.vercel.app/dashboard',
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
        title: 'Dashboard | CodeLib',
        description: 'Manage your projects and snippets from your dashboard on CodeLib.',
        images: ['https://codelib-mrsupercraft.vercel.app/codelib-opengraph.png'],
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <RootLayout>
            {children}
        </RootLayout>
    );
}
