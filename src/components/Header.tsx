'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FolderCodeIcon, Menu as MenuIcon, HomeIcon, InfoIcon, BriefcaseIcon, MailIcon, LockIcon, FileTextIcon, PhoneIcon } from 'lucide-react';
import { ModeToggle } from '@/components/ModeToggle';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Header = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleSheetOpen = () => setIsSheetOpen(true);
    const t = useTranslations();

    return (
        <header className="w-full fixed top-0 left-0 right-0 h-[80px] z-50 bg-transparent flex items-center justify-between px-4 py-2 md:px-6 md:py-4">
            <div className="flex items-center space-x-4 md:space-x-6">
                <Link href="/">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-black rounded-lg p-2 flex items-center space-x-2 border border-blue-500 dark:border-blue-400 shadow-lg"
                    >
                        <FolderCodeIcon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                        <span className="text-xl font-bold text-black dark:text-white hidden md:block">
                            {t('header.brand.title')}
                        </span>
                    </motion.div>
                </Link>
            </div>

            <div className="flex items-center space-x-4 md:space-x-6">
                <ModeToggle className="shadow-lg mr-3" />
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="default"
                            className="items-center space-x-2 shadow-lg"
                            onClick={handleSheetOpen}
                        >
                            <span>{t('header.main_menu')}</span>
                            <MenuIcon className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-white dark:bg-black text-black dark:text-white flex flex-col justify-between">
                        <div>
                            <SheetHeader>
                                <SheetTitle className="flex flex-col text-left">
                                    <h2 className="text-2xl font-bold">{t('header.brand.title')}</h2>
                                    <p className="text-sm">{t('header.brand.tagline')}</p>
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col space-y-4 p-4">
                                <motion.div
                                    initial={{ scale: 1, color: '#000' }}
                                    whileHover={{ scale: 1.1, color: '#007bff' }}
                                    transition={{ duration: 0.3 }}
                                    className="relative flex items-center"
                                >
                                    <Link href="/" className="relative flex items-center text-black dark:text-white hover:text-[#007bff]">
                                        <HomeIcon className="w-5 h-5 mr-2" />
                                        {t('header.home')}
                                    </Link>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 1, color: '#000' }}
                                    whileHover={{ scale: 1.1, color: '#007bff' }}
                                    transition={{ duration: 0.3 }}
                                    className="relative flex items-center"
                                >
                                    <Link href={`/about`} className="relative flex items-center text-black dark:text-white hover:text-[#007bff]">
                                        <InfoIcon className="w-5 h-5 mr-2" />
                                        {t('header.about')}
                                    </Link>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 1, color: '#000' }}
                                    whileHover={{ scale: 1.1, color: '#007bff' }}
                                    transition={{ duration: 0.3 }}
                                    className="relative flex items-center"
                                >
                                    <Link href={`/services`} className="relative flex items-center text-black dark:text-white hover:text-[#007bff]">
                                        <BriefcaseIcon className="w-5 h-5 mr-2" />
                                        {t('header.services')}
                                    </Link>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 1, color: '#000' }}
                                    whileHover={{ scale: 1.1, color: '#007bff' }}
                                    transition={{ duration: 0.3 }}
                                    className="relative flex items-center"
                                >
                                    <Link href={`/contact`} className="relative flex items-center text-black dark:text-white hover:text-[#007bff]">
                                        <MailIcon className="w-5 h-5 mr-2" />
                                        {t('header.contact')}
                                    </Link>
                                </motion.div>

                            </div>
                            <Link href="get-started">
                                <Button variant="default" className="shadow-lg">{t('header.get_started')}</Button>
                            </Link>
                        </div>

                        <article className="prose dark:prose-invert">
                            <div className="flex flex-col p-4">
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center">
                                        <LockIcon className="w-5 h-5 mr-2" />
                                        <Link href={`/privacy-policy`}>{t('header.privacy_policy')}</Link>
                                    </li>
                                    <li className="flex items-center">
                                        <FileTextIcon className="w-5 h-5 mr-2" />
                                        <Link href={`/terms-of-service`}>{t('header.terms_and_conditions')}</Link>
                                    </li>
                                    <li className="flex items-center">
                                        <PhoneIcon className="w-5 h-5 mr-2" />
                                        <Link href={`/contact`}>{t('header.phone_contact')}</Link>
                                    </li>
                                </ul>
                            </div>
                        </article>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
};

export default Header;
