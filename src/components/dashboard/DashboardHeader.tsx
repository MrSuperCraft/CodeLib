'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LucideMenu, SearchIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { HomeIcon, CodeIcon, StarIcon, SettingsIcon, UserIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { IconContext } from 'react-icons';
import { FiLogOut } from 'react-icons/fi';
import { ModeToggle } from '@/components/ModeToggle';
import SearchDialog from './SearchDialog';
import AddSnippetDialog from '../snippets/AddSnippetDialog';

export function DashboardHeader({ username, email }: { username: string, email: string }) {
    const getMessageForTime = (hours: number): string => {
        if (hours >= 5 && hours < 12) {
            return "Good morning";
        } else if (hours >= 12 && hours < 18) {
            return "Welcome back";
        } else if (hours >= 18 && hours < 24) {
            return "Good evening";
        } else {
            return "Good night";
        }
    };


    const [message, setMessage] = useState<string>(getMessageForTime(new Date().getHours()));

    useEffect(() => {
        const intervalId = setInterval(() => {
            const currentHours = new Date().getHours();
            setMessage(getMessageForTime(currentHours));
        }, 3600000); // Update every hour

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, []);




    return (
        <header className="bg-transparent shadow-md p-4 flex justify-between items-center dark:bg-neutral-950">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-neutral-100">
                {message}, <span className='font-black'>{username ?? 'User'}</span>
            </h1>
            <Sheet>
                <SheetTrigger>
                    <Button variant="default" className="flex justify-center items-center md:hidden">
                        <LucideMenu className='text-white' />
                    </Button>
                </SheetTrigger>
                <SheetContent className="p-4">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center px-4 py-4 mb-4">
                            <img
                                src={`https://ui-avatars.com/api/?name=${username}&background=random`}
                                alt={username || 'User Avatar'}
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold">{username}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
                            </div>
                        </div>

                        <nav className="flex flex-col mt-4 space-y-2">
                            <NavItem
                                icon={<HomeIcon />}
                                label="Dashboard"
                            />
                            <NavItem
                                icon={<CodeIcon />}
                                label="My Snippets"
                            />
                            <NavItem
                                icon={<StarIcon />}
                                label="Favorites"
                            />
                            <NavItem
                                icon={<UserIcon />}
                                label="Profile"
                            />
                            <NavItem
                                icon={<SettingsIcon />}
                                label="Settings"
                            />
                        </nav>

                        <div className="mt-auto flex flex-col items-center py-4">
                            <button
                                onClick={() => signOut()}
                                className="flex items-center text-red-400 hover:text-red-600 transition-colors mb-4"
                            >
                                <IconContext.Provider value={{ className: 'size-5' }}>
                                    <FiLogOut />
                                </IconContext.Provider>
                                <span className="ml-2">Log Out</span>
                            </button>
                            <ModeToggle className='shadow-lg' />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
            <div className='space-x-4 hidden md:flex'>
                <SearchDialog />
                <AddSnippetDialog email={email} />

            </div>
        </header>
    );
}

const NavItem = ({ icon, label }: { icon: JSX.Element, label: string }) => {
    return (
        <div className="flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-neutral-700 duration-300 transition-colors cursor-pointer">
            <div className="flex items-center">
                <span className="text-xl">{icon}</span>
            </div>
            <span className="ml-4">{label}</span>
        </div>
    );
};
