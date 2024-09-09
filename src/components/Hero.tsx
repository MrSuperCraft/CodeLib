'use client';

import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRef, useState } from 'react';
import HeroBackground from '@/app/../../public/hero.svg';
import { useTranslations } from 'next-intl';


const HeroSection = () => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const t = useTranslations();

    const ref = useRef(null);
    const isInView = useInView(ref);

    const stats = [
        { value: '10K+', label: t('hero.stats.snippets') },
        { value: '5K+', label: t('hero.stats.users') },
        { value: '1M+', label: t('hero.stats.lines') },
    ];

    return (
        <section className="relative w-full h-screen bg-neutral-200/35 dark:bg-neutral-950 text-black dark:text-white flex items-center justify-center overflow-hidden">
            {/* Background Loading Placeholder */}
            <div
                className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'
                    }`}
                style={{ background: 'linear-gradient(135deg, #e2e8f0, #cbd5e0)' }}
            ></div>

            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src={HeroBackground}
                    alt="Hero background"
                    layout="fill"
                    objectFit="cover"
                    className={`transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                />
            </div>

            {/* Central Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75 }}
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">{t('hero.welcome')}</h1>
                    <p className="text-base md:text-lg lg:text-2xl font-bold mb-6">{t('hero.sub')}</p>
                    <Button variant="default" className='text-lg shadow-lg font-bold'>{t('hero.cta')}</Button>
                </motion.div>

                {/* Animated Statistics Boxes */}
                <div className="hidden flex-wrap justify-center items-center mt-10 space-x-4 sm:flex" ref={ref}>
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 m-2 text-center"
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-blue-500">{stat.value}</h2>
                            <p className="text-sm md:text-base lg:text-lg font-semibold">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
