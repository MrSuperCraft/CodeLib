import React from 'react'
import ServicesPage from './ServicesPage'
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: "Services - CodeLib",
    description: "Explore the services offered by CodeLib, designed to help developers manage and organize their code snippets efficiently.",
    keywords: ["CodeLib", "Developer Services", "Code Snippet Management", "Programming Tools"],
    openGraph: {
        title: "Services - CodeLib",
        description: "Discover CodeLib's services for developers, enabling better snippet management and productivity.",
        url: "https://codelib-mrsupercraft.vercel.app/services",
        images: [
            {
                url: "https://codelib-mrsupercraft.vercel.app/codelib-opengraph.png",
                alt: "CodeLib Services",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Services - CodeLib",
        description: "Learn more about the services CodeLib provides to help developers streamline their workflow.",
    },
};



const page = () => {
    return (
        <div>
            <ServicesPage />
        </div>
    )
}

export default page
