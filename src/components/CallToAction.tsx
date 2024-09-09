'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl'; // Import the hook

const CallToActionSection = () => {
    const t = useTranslations('callToAction'); // Get the translation for the 'callToAction' namespace

    return (
        <section className="py-32 bg-neutral-200 text-dark dark:bg-gray-900 dark:text-gray-200">
            <motion.div
                className="max-w-2xl mx-auto text-center px-6 md:px-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {t('title')}
                </h2>
                <p className="text-lg mb-6 md:text-xl">
                    {t('description')}
                </p>
                <Button variant="default" className="transition-transform transform hover:scale-105">
                    {t('button')}
                </Button>
                <p className="mt-6 text-sm text-gray-500 dark:text-gray-300">
                    {t('note')}
                </p>
            </motion.div>
        </section>
    );
};

export default CallToActionSection;
