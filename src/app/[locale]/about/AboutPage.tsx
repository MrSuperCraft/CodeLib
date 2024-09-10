'use client';

import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useTranslations } from 'next-intl';


// Reusable Collapsible Component
const CollapsibleFAQ = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-b border-gray-200 py-4">
            <CollapsibleTrigger
                className="flex justify-between items-center w-full text-left focus:outline-none"
            >
                <span className="font-semibold">{question}</span>
                <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: '100px' }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="mt-2"
                >
                    <p>{answer}</p>
                </motion.div>
            </CollapsibleContent>
        </Collapsible>
    );
};

const AboutPage = () => {
    const scrollToContent = () => {
        document.getElementById('about-content')?.scrollIntoView({ behavior: 'smooth' });
    };

    const t = useTranslations('about-page.about')
    const t2 = useTranslations('about-page')


    return (
        <>
            <Header />
            <main className="relative overflow-hidden">
                {/* Hero Section with Unique Background */}
                <section className="relative h-screen flex items-center justify-center text-black dark:text-white">
                    {/* Unique Background */}
                    <div className="absolute inset-0 -z-10" style={{
                        backgroundImage: `radial-gradient(at 27% 37%, #3a8bfd 0, transparent 50%), radial-gradient(at 97% 21%, #9772fe 0, transparent 50%), radial-gradient(at 52% 99%, #fd3a4e 0, transparent 50%), radial-gradient(at 10% 29%, #5afc7d 0, transparent 50%), radial-gradient(at 97% 96%, #e4c795 0, transparent 50%), radial-gradient(at 33% 50%, #8ca8e8 0, transparent 50%), radial-gradient(at 79% 53%, #eea5ba 0, transparent 50%)`,
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        filter: 'blur(100px) saturate(150%)',
                        opacity: 0.2,
                        top: '80px',
                        zIndex: -1,
                        transform: 'translateZ(0)',
                    }}></div>
                    <motion.div
                        className="relative z-10 text-center"
                        initial={{ y: '0%' }}
                        animate={{ y: ['0%', '10%'] }}
                        transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
                    >
                        <h1 className="text-5xl font-black dark:text-white mb-4">{t('heroTitle')}</h1>
                        <p className="text-xl mb-6 dark:text-white">{t('heroSubtitle')}</p>
                        <Button className="bg-white text-blue-500 hover:bg-blue-100 mt-4" onClick={scrollToContent}>{t('heroButton')}</Button>
                    </motion.div>
                </section>

                {/* Description Content Section */}
                <div className="mx-auto px-4 py-20" id='about-content'>
                    <article className="mx-auto prose prose-base prose-headings:font-black md:prose-sm lg:prose-xl dark:prose-invert">
                        <h2 className="text-center text-xl md:text-2xl lg:text-3xl">{t('storyTitle')}</h2>
                        <p>
                            {t('p1')}
                        </p>
                        <p>
                            {t('p2')}
                        </p>
                        <p>
                            {t('p3')}
                        </p>
                        <p>
                            {t('p4')}
                        </p>
                    </article>
                </div>
                {/* Key Features */}
                <div className="container mx-auto px-4 py-12">
                    <article className="prose prose-base prose-headings:font-black dark:prose-invert mx-auto md:prose-sm lg:prose-xl">
                        <h2 className="text-center text-xl md:text-2xl lg:text-3xl">{t('featuresTitle')}</h2>
                        <ul className="list-disc pl-6 space-y-4">
                            <li>
                                <strong>{t('features.feature1.title')}</strong>: {t('features.feature1.description')}
                            </li>
                            <li>
                                <strong>{t('features.feature2.title')}</strong>: {t('features.feature2.description')}
                            </li>
                            <li>
                                <strong>{t('features.feature3.title')}</strong>: {t('features.feature3.description')}
                            </li>
                            <li>
                                <strong>{t('features.feature4.title')}</strong>: {t('features.feature4.description')}
                            </li>
                            <li>
                                <strong>{t('features.feature5.title')}</strong>: {t('features.feature5.description')}
                            </li>
                            <li>
                                <strong>{t('features.feature6.title')}</strong>: {t('features.feature6.description')}
                            </li>
                            <li>
                                <strong>{t('features.feature7.title')}</strong>: {t('features.feature7.description')}
                            </li>
                        </ul>
                    </article>
                </div>
                {/* FAQs */}
                <div className="container mx-auto px-4 py-12 mb-32">
                    <article className="prose prose-base prose-headings:font-black dark:prose-invert mx-auto md:prose-sm lg:prose-xl">
                        <h2 className="text-center text-xl md:text-2xl lg:text-3xl">{t2('faqTitle')}</h2>
                        <div className="space-y-6">
                            <CollapsibleFAQ
                                question={t2('faq.question1')}
                                answer={t2('faq.answer1')}
                            />
                            <CollapsibleFAQ
                                question={t2('faq.question2')}
                                answer={t2('faq.answer2')}
                            />
                            <CollapsibleFAQ
                                question={t2('faq.question3')}
                                answer={t2('faq.answer3')}
                            />
                            <CollapsibleFAQ
                                question={t2('faq.question4')}
                                answer={t2('faq.answer4')}
                            />
                        </div>
                    </article>
                </div>

            </main>
            <Footer />
        </>
    );
};

export default AboutPage;
