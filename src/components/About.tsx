'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const AboutSection = () => {
    const t = useTranslations('about');

    return (
        <section className="py-32 bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white transition-colors duration-500">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                <article className="prose dark:prose-invert mx-auto prose-p:text-sm sm:prose-p:text-lg">
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold mb-8 tracking-wide text-center"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75 }}
                    >
                        {t('title')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75, delay: 0.2 }}
                    >
                        {t('p1')}
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75, delay: 0.4 }}
                    >
                        {t('p2')}
                    </motion.p>
                </article>

                <motion.div
                    className="mt-12 flex justify-center space-x-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <Link href={`/about`}>
                        <button className="bg-blue-500 text-white px-4 py-2 text-sm md:px-6 md:py-3 md:text-lg rounded-lg shadow-lg hover:bg-blue-600 dark:hover:bg-blue-400 transition-colors">
                            {t('learn_more')}
                        </button>
                    </Link>
                    <Link href={`/about`}>
                        <button className="bg-transparent border border-black text-black dark:border-white dark:text-white px-4 py-2 text-sm md:px-6 md:py-3 md:text-lg rounded-lg shadow-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                            {t('our_mission')}
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutSection;
