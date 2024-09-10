import React from 'react'
import AboutPage from './AboutPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "About CodeLib - Snippet Management for Developers",
    description: "Learn more about CodeLib, the ultimate tool for managing and organizing your code snippets with ease. Discover our mission, values, and team.",
    keywords: ["CodeLib", "About CodeLib", "Snippet Manager", "Developer Tools", "Programming", "Coding"],
    openGraph: {
        title: "About CodeLib - The Snippet Manager for Developers",
        description: "Discover CodeLib's mission to provide developers with an efficient platform to manage code snippets.",
        url: "https://codelib-mrsupercraft.vercel.app/about",
        images: [
            {
                url: "https://codelib-mrsupercraft.vercel.app/codelib-opengraph.png",
                alt: "About CodeLib",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "About CodeLib - Organize Your Snippets Efficiently",
        description: "Get to know the CodeLib team and our mission to help developers streamline their coding workflow.",
    },
};



const page = () => {
    return (
        <div>
            <AboutPage />
        </div>
    )
}

export default page
