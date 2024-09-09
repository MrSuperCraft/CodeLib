'use client';

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React from 'react'
import "./styles.css"
import { useTranslations } from 'next-intl'


const TermsOfService = () => {
    const t = useTranslations();
    return (
        <div className='dark:bg-neutral-900'>
            <Header />
            <article className='prose prose-base max-sm:prose-p:text-xs max-sm:prose-li:text-xs px-2 md:px-0 dark:prose-invert md:prose-sm py-32 mx-auto lg:prose-lg xl:prose-xl prose-a:underline prose-a:text-blue-500'>
                <div dangerouslySetInnerHTML={{ __html: t.raw('TermsOfService') }} />

            </article>
            <Footer />
        </div >
    )
}

export default TermsOfService
