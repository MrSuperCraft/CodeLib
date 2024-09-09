'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BentoGridItem } from '@/components/dashboard/BentoGrid';
import { CardContent } from '@/components/ui/card';
import SnippetDisplay from '@/components/dashboard/SnippetDisplay';
import CodeActivity from '@/components/dashboard/CodeActivity';
import { useSnippetStore } from '@/app/store/SnippetStore';
import { useEffect, useState } from 'react';
import { FolderIcon, PlusIcon, SaveIcon, UserIcon } from 'lucide-react';

const Page = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const { categories, recentSnippets, totalSnippets, recentEdits, fetchSnippets } = useSnippetStore((state) => ({
        categories: state.getCategories(),
        recentSnippets: state.getRecentSnippets(),
        totalSnippets: state.getTotalSnippets(),
        recentEdits: state.getRecentEdits(),
        fetchSnippets: state.fetchSnippets,
    }));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (session) {
            // Simulate data loading
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        } else {
            router.push('/get-started');
        }
    }, [session, router]);

    if (!session || isLoading) {
        return <div>Loading...</div>; // Add a loading state
    }

    return (
        <div className="mt-2 bg-transparent">
            <div className="grid grid-cols-1 gap-2 mb-0 md:grid-cols-2 lg:grid-cols-3 grid-rows-3 max-h-full">

                {/* Total Snippets */}
                <div className="rounded-lg shadow-md">
                    <BentoGridItem
                        className="w-full h-full"
                        title="Total Snippets"
                        description={`You've created ${totalSnippets} snippets.`}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>}
                    />
                </div>

                {/* Snippet Categories */}
                <div className="rounded-lg shadow-lg col-span-1 md:col-span-1 lg:col-span-2">
                    <BentoGridItem
                        className="w-full h-full"
                        title="Folders"
                        description="Organized by folders."
                        header={
                            <CardContent>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Folder Categories</h3>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m0 0l3-3m-3 3l-3-3" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {categories.map((category: string) => (
                                            <div key={category} className="px-4 py-2 bg-gray-100 rounded-lg shadow-sm dark:bg-neutral-700 dark:text-white text-gray-700">
                                                <FolderIcon /> {category}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        }
                    />
                </div>


                {/* Recently Added */}
                <div className="rounded-lg shadow-md">
                    <BentoGridItem
                        className="w-full h-full"
                        title="Recently Added"
                        description="Your recently added snippets. *For demonstrational purposes only."
                        header={
                            <CardContent>
                                <div className="space-y-2">
                                    <SnippetDisplay name="LeetCode problem No. 12" language="Javascript" />
                                    <SnippetDisplay name="Type Fixes For My Project" language="TypeScript" />
                                </div>
                            </CardContent>
                        }
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                    />
                </div>

                {/* Recently Edited */}
                <div className="rounded-lg shadow-md">
                    <BentoGridItem
                        className="w-full h-full"
                        title="Recently Edited"
                        description="Snippets you’ve edited recently."
                        header={
                            <CardContent>
                                <div className="space-y-2">
                                    {recentEdits.slice(0, 3).map((snippet: any) => (
                                        <SnippetDisplay
                                            key={snippet.id}
                                            name={snippet.name}
                                            language={snippet.language}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        }
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                    />
                </div>

                {/* Additional Info */}
                <div className="rounded-lg shadow-md col-span-1 row-span-1 lg:row-span-2">
                    <BentoGridItem
                        className="w-full h-full"
                        title="Recent Activity"
                        description="Updates and activities from the past week. * Currently used for demonstrational purposes only."
                        header={
                            <CardContent>
                                <div className="flex flex-col gap-4 p-4">
                                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Activity Feed</h3>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m0 0l3-3m-3 3l-3-3" />
                                        </svg>
                                    </div>
                                    <ul className="space-y-2">
                                        <li className="flex items-center justify-between text-sm text-gray-700 dark:text-white">
                                            <div className="flex items-center space-x-2">
                                                <PlusIcon className="h-5 w-5 text-green-500" />
                                                <span>Added new snippet</span>
                                            </div>
                                            <span className="text-gray-500">10 min ago</span>
                                        </li>
                                        <li className="flex items-center justify-between text-sm text-gray-700 dark:text-white">
                                            <div className="flex items-center space-x-2">
                                                <UserIcon className="h-5 w-5 text-blue-500" />
                                                <span>Updated profile</span>
                                            </div>
                                            <span className="text-gray-500">1 hour ago</span>
                                        </li>

                                        <li className="flex items-center justify-between text-sm text-gray-700 dark:text-white">
                                            <div className="flex items-center space-x-2">
                                                <SaveIcon className="h-5 w-5 text-red-500" />
                                                <span>Saved changes</span>
                                            </div>
                                            <span className="text-gray-500">5 hours ago</span>
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        }
                    />
                </div>


                {/* User Statistics */}
                <div className="rounded-lg shadow-md col-span-1 lg:col-span-2 xl:col-span-2">
                    <BentoGridItem
                        className="w-full h-full"
                        title="Statistics"
                        description="Delve into statistics and learn more about your usage. * Currently used for demonstrational purposes only."
                        header={
                            <CardContent>
                                <CodeActivity />
                            </CardContent>
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default Page;
