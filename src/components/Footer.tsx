'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FolderCodeIcon } from 'lucide-react';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import LocaleSwitcher from './LocaleSwitcher';

const Footer = () => {
    const t = useTranslations(); // Initialize translations



    return (
        <footer className="bg-neutral-100 dark:bg-gray-950 text-black dark:text-white py-8 border-t-2 border-black/30">
            <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center">

                {/* Brand Logo */}
                <div className="flex flex-col items-center mb-6 md:mb-0">
                    <div className="flex items-center">
                        <FolderCodeIcon className="w-12 h-12 text-blue-500 dark:text-blue-400" />
                        <span className="text-2xl font-bold ml-2">{t('footer.brand')}</span>
                    </div>
                    <LocaleSwitcher />
                </div>

                {/* Important Links */}
                <div className="flex flex-col md:flex-row md:space-x-8 mb-6 md:mb-0 text-center md:text-left">
                    <Link href={`/contact`} className="mb-2 md:mb-0 hover:text-blue-500 dark:hover:text-blue-400">
                        {t('footer.links.contact')}
                    </Link>
                    <Link href={`/privacy-policy`} className="mb-2 md:mb-0 hover:text-blue-500 dark:hover:text-blue-400">
                        {t('footer.links.privacy')}
                    </Link>
                    <Link href={`/terms-of-service`} className="mb-2 md:mb-0 hover:text-blue-500 dark:hover:text-blue-400">
                        {t('footer.links.terms')}
                    </Link>
                </div>

                {/* Social Media Links */}
                <div className="flex space-x-4">
                    <Link href="https://x.com/@ItamarHanan" className="hover:text-blue-500 dark:hover:text-blue-400">
                        <IconContext.Provider value={{ className: "w-8 h-8" }}>
                            <FaTwitter />
                        </IconContext.Provider>
                    </Link>
                    <Link href="https://linkedin.com/itamar-hanan" className="hover:text-blue-500 dark:hover:text-blue-400">
                        <IconContext.Provider value={{ className: "w-8 h-8" }}>
                            <FaLinkedin />
                        </IconContext.Provider>
                    </Link>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="container mx-auto px-6 md:px-12 mt-6 text-center text-sm">
                <p>{t('footer.copyright')} <Link href='https://itamar-hanan.web.app' className='text-blue-500 dark:text-blue-400 hover:underline'>{t('footer.developer')}</Link>.</p>
            </div>
        </footer>
    );
};

export default Footer;
