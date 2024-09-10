import React from 'react'
import TermsOfServicePage from './TermsOfServicePage'
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: "Terms of Service - CodeLib",
    description: "Read the terms of service for CodeLib, outlining the rules and regulations for using our code snippet management platform.",
    keywords: ["CodeLib", "Terms of Service", "Code Snippet Manager", "Developer Tools"],
    openGraph: {
        title: "Terms of Service - CodeLib",
        description: "View the terms of service for CodeLib and understand your rights and responsibilities as a user.",
        url: "https://codelib-mrsupercraft.vercel.app/terms-of-service",
    },
    twitter: {
        card: "summary",
        title: "Terms of Service - CodeLib",
        description: "Learn more about the terms of service for using CodeLib's snippet management platform.",
    },
};



const page = () => {
    return (
        <div>
            <TermsOfServicePage />
        </div>
    )
}

export default page
