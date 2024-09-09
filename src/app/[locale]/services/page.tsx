'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { SearchIcon, SettingsIcon, SmilePlus, LayoutDashboardIcon, SquareArrowDownIcon, User2Icon, FileSearchIcon } from 'lucide-react';



const ServicesPage = () => {
    const t = useTranslations('services-page');
    const t_services = useTranslations('services-page.services');


    const servicesData = [
        {
            id: 1,
            icon: <SearchIcon />,
            title: t_services('s1.title'),
            description: t_services('s1.description'),
            details: t_services('s1.details'),
        },
        {
            id: 2,
            icon: <LayoutDashboardIcon />,
            title: t_services('s2.title'),
            description: t_services('s2.description'),
            details: t_services('s2.details'),
        },
        {
            id: 3,
            icon: <SettingsIcon />,
            title: t_services('s3.title'),
            description: t_services('s3.description'),
            details: t_services('s3.details'),
        },
        {
            id: 4,
            icon: <User2Icon />,
            title: t_services('s4.title'),
            description: t_services('s4.description'),
            details: t_services('s4.details'),
        },
        {
            id: 5,
            icon: <SmilePlus />,
            title: t_services('s5.title'),
            description: t_services('s5.description'),
            details: t_services('s5.details'),
        },
        {
            id: 6,
            icon: <FileSearchIcon />,
            title: t_services('s6.title'),
            description: t_services('s6.description'),
            details: t_services('s6.details'),
        },
    ];


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
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black dark:text-white mb-4">{t('hero.title')}</h1>
                        <p className="text-lg md:text-xl mb-6 dark:text-white">{t('hero.subtitle')}</p>
                        <SquareArrowDownIcon className="size-8 md:size-14 mx-auto" />
                    </motion.div>
                </section>

                {/* Services Section */}
                <section className="container mx-auto px-4 py-48 bg-transparent">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {servicesData.map((service) => (
                            <motion.div
                                key={service.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition duration-300 ease-in-out"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 * service.id }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center justify-center mb-4 text-blue-500 dark:text-blue-300">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                    {service.description}
                                </p>
                                <p className="text-gray-500 dark:text-gray-300">
                                    {service.details}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
};

export default ServicesPage;
