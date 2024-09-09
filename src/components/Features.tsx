'use client';

import { motion } from 'framer-motion';
import { Code, Cloud, Star, Search, Hash, Rocket } from 'lucide-react'; // Example icons
import { useTranslations } from 'next-intl'; // Import the hook

const icons = [
    <Code key="code" size={32} />,
    <Cloud key="cloud" size={32} />,
    <Star key="star" size={32} />,
    <Hash key="hash" size={32} />,
    <Search key="search" size={32} />,
    <Rocket key="rocket" size={32} />
];

const FeaturesSection = () => {
    const t = useTranslations('features'); // Get the translation for the 'features' namespace

    // Fetch each feature individually
    const features = [
        {
            title: t('feature1.title'),
            description: t('feature1.description')
        },
        {
            title: t('feature2.title'),
            description: t('feature2.description')
        },
        {
            title: t('feature3.title'),
            description: t('feature3.description')
        },
        {
            title: t('feature4.title'),
            description: t('feature4.description')
        },
        {
            title: t('feature5.title'),
            description: t('feature5.description')
        },
        {
            title: t('feature6.title'),
            description: t('feature6.description')
        }
    ];

    return (
        <section className="py-32 bg-neutral-200 dark:bg-gray-900 text-gray-900 dark:text-white">
            <div className="container mx-auto text-center px-6 md:px-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-8">{t('title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <div className="mb-4 text-blue-500 dark:text-blue-400">{icons[index]}</div>
                            <h3 className="text-xl md:text-2xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-base md:text-lg">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
