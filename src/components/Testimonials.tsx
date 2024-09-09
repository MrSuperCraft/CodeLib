'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl'; // Import the hook

const getRandomTestimonials = (num: number) => {
    // Generate a random selection of testimonial keys
    const allTestimonials = Array.from({ length: 10 }, (_, i) => `testimonial${i + 1}`);
    const shuffled = allTestimonials.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
};

const TestimonialsSection = () => {
    const t = useTranslations('testimonials'); // Get the translation for the 'testimonials' namespace
    const selectedTestimonialsKeys = getRandomTestimonials(6);

    return (
        <section className="py-32 bg-neutral-50 text-black dark:text-white dark:bg-neutral-900">
            <div className="container mx-auto text-center px-6 md:px-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-12">{t('title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {selectedTestimonialsKeys.map((key, index) => (
                        <motion.div
                            key={index}
                            className="p-6 bg-neutral-100 rounded-lg shadow-lg dark:bg-gray-700 flex flex-col justify-center text-left"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <article className="prose dark:prose-invert prose-blockquote:border-l-2 prose-blockquote:border-l-blue-500">
                                <blockquote className="text-lg md:text-xl mb-4">
                                    <span className="font-bold">&quot;{t(`${key}.quote`)}&quot;</span>
                                    <br />
                                    <br />
                                    <span className="text-black/90 dark:text-white/95">- {t(`${key}.name`)}, {t(`${key}.position`)}</span>
                                </blockquote>
                            </article>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
