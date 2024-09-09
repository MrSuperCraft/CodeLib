'use client';

import { HomeIcon, CodeIcon, StarIcon, SettingsIcon, UserIcon } from 'lucide-react';
import { ModeToggle } from '@/components/ModeToggle';
import { FiLogOut } from 'react-icons/fi';
import { signOut } from 'next-auth/react';
import { IconContext } from 'react-icons';
import { Session } from 'next-auth';
import { cn } from '@/lib/utils';
import useSizingStore from '@/app/store/SizingStore';
import { motion } from 'framer-motion';
import Link from 'next/link';


const Sidebar = ({ session }: { session: Session }) => {
    const sidebarState = useSizingStore();
    const user = session.user;

    return (
        <motion.div
            className={`hidden md:flex flex-col h-screen transition-colors duration-300 fixed ${sidebarState.isCollapsed ? 'w-20' : 'w-64'
                } ${sidebarState.isCollapsed ? 'bg-gray-50 text-gray-900 dark:bg-neutral-900 dark:text-white' : 'bg-gray-100 text-gray-800 dark:bg-neutral-900 dark:text-gray-200'}`}
            initial={{ width: sidebarState.isCollapsed ? 80 : 256 }}
            animate={{ width: sidebarState.isCollapsed ? 80 : 256 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            {/* Avatar Display */}
            <motion.div
                className="flex items-center px-4 py-4 mx-auto"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <img
                    src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                    alt={user?.name || 'User Avatar'}
                    className="w-10 h-10 rounded-full"
                />
                {!sidebarState.isCollapsed && (
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold">{user?.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                )}
            </motion.div>

            {/* Sidebar Header */}
            <motion.div
                className="flex items-center justify-between px-4 py-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center">
                    {!sidebarState.isCollapsed && <span className="text-xl font-bold">CodeLib</span>}
                </div>
                <button
                    onClick={() => sidebarState.toggleCollapsed()}
                    className={cn(`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`, sidebarState.isCollapsed ? 'mx-auto' : '')}
                >
                    <svg
                        className={`w-6 h-6 ${sidebarState.isCollapsed ? 'transform rotate-180' : ''} transition-transform duration-300`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>
            </motion.div>

            {/* Navigation Links */}
            <motion.nav
                className={cn("flex flex-col mt-4 space-y-2", sidebarState.isCollapsed ? 'mx-auto' : '')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <NavItem
                    icon={<HomeIcon />}
                    label="Dashboard"
                    isCollapsed={sidebarState.isCollapsed}
                    href="/dashboard"
                />
                <NavItem
                    icon={<CodeIcon />}
                    label="My Snippets"
                    isCollapsed={sidebarState.isCollapsed}
                    href="/dashboard/snippets"
                />
                <NavItem
                    icon={<StarIcon />}
                    label="Favorites"
                    isCollapsed={sidebarState.isCollapsed}
                    href="/dashboard/favorites"
                />
                <NavItem
                    icon={<UserIcon />}
                    label="Profile"
                    isCollapsed={sidebarState.isCollapsed}
                    href="/dashboard/profile"
                />
                <NavItem
                    icon={<SettingsIcon />}
                    label="Settings"
                    isCollapsed={sidebarState.isCollapsed}
                    href="/dashboard/settings"
                />
            </motion.nav>

            {/* Log Out Button and Mode Toggle */}
            <motion.div
                className="mt-auto flex flex-col items-center py-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {!sidebarState.isCollapsed ? (
                    <button
                        onClick={() => signOut()}
                        className="flex items-center text-red-400 hover:text-red-600 transition-colors mb-4"
                    >
                        <IconContext.Provider value={{ className: 'size-5' }}>
                            <FiLogOut />
                        </IconContext.Provider>
                        <span className="ml-2">Log Out</span>
                    </button>
                ) :
                    <button
                        onClick={() => signOut()}
                        className="flex items-center text-red-400 hover:text-red-600 transition-colors mb-4"
                    >
                        <IconContext.Provider value={{ className: 'size-5' }}>
                            <FiLogOut />
                        </IconContext.Provider>
                    </button>
                }
                <ModeToggle className='shadow-lg' />
            </motion.div>
        </motion.div>
    );
};

const NavItem = ({ icon, label, isCollapsed, href }: { icon: JSX.Element, label: string, isCollapsed: boolean, href: string }) => {
    return (
        <Link href={href} passHref>
            <motion.div
                className="flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-neutral-700 duration-300 transition-colors cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center">
                    <span className="text-xl">{icon}</span>
                </div>
                {!isCollapsed && <span className="ml-4">{label}</span>}
            </motion.div>
        </Link>
    );
};


export default Sidebar;
