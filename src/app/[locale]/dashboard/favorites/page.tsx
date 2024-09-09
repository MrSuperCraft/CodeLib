'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSnippetStore } from '@/app/store/SnippetStore';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import {
    SiJavascript, SiPython, SiHtml5, SiCss3, SiCplusplus, SiCsharp, SiLess, SiSass, SiTypescript
} from 'react-icons/si';
import {
    FaMarkdown, FaFile, FaJava, FaFileCode
} from 'react-icons/fa';
import {
    TbFileTypeXml, TbFileTypeJsx, TbFileTypeTsx
} from 'react-icons/tb';

const fileIcons: { [key: string]: { icon: React.ReactNode, language: string } } = {
    js: { icon: <SiJavascript />, language: 'JavaScript' },
    jsx: { icon: <TbFileTypeJsx />, language: 'JSX' },
    ts: { icon: <SiTypescript />, language: 'TypeScript' },
    tsx: { icon: <TbFileTypeTsx />, language: 'TSX' },
    py: { icon: <SiPython />, language: 'Python' },
    html: { icon: <SiHtml5 />, language: 'HTML' },
    css: { icon: <SiCss3 />, language: 'CSS' },
    md: { icon: <FaMarkdown />, language: 'Markdown' },
    java: { icon: <FaJava />, language: 'Java' },
    cpp: { icon: <SiCplusplus />, language: 'C++' },
    json: { icon: <FaFile />, language: 'JSON' },
    php: { icon: <FaFileCode />, language: 'PHP' },
    rust: { icon: <FaFile />, language: 'Rust' },
    sql: { icon: <FaFile />, language: 'SQL' },
    xml: { icon: <TbFileTypeXml />, language: 'XML' },
    less: { icon: <SiLess />, language: 'Less' },
    sass: { icon: <SiSass />, language: 'Sass' },
    csharp: { icon: <SiCsharp />, language: 'C#' },
};

interface Snippet {
    name: string;
    content: string;
    isFavorite?: boolean;
    language?: string;
}

interface Folder {
    name: string;
    children: (Folder | Snippet)[];
}

const FavoritesPage: React.FC = () => {
    const [favorites, setFavorites] = useState<Snippet[]>([]);
    const { fetchFavorites, snippets } = useSnippetStore();
    const router = useRouter();
    const { data: session } = useSession();
    const email = session?.user?.email || '';

    useEffect(() => {
        const fetchAndSetFavorites = async () => {
            try {
                const fetchedFavorites = await fetchFavorites(email);
                setFavorites(fetchedFavorites);
            } catch (error) {
                toast.error('Failed to fetch favorites');
                console.error('Fetch favorites error:', error);
            }
        };

        fetchAndSetFavorites();
    }, [fetchFavorites, email]);

    // Helper function to determine if an item is a Folder
    const isFolder = (item: Folder | Snippet): item is Folder => {
        return 'children' in item;
    };

    // Helper function to find the path of a snippet
    const findFolderPath = (folder: Folder | null, folderName: string, currentPath: string = 'Root'): string | null => {
        if (!folder || !folder.children) return null;

        for (const item of folder.children) {
            const normalizedFolderName = folderName.trim().toLowerCase();
            const normalizedItemName = item.name.trim().toLowerCase();

            if (isFolder(item) && normalizedItemName === normalizedFolderName) {
                const fullPath = `${currentPath}/${item.name}`;
                return fullPath;
            }
            if (isFolder(item)) {
                const result = findFolderPath(item, folderName, `${currentPath}/${item.name}`);
                if (result) return result;
            }
        }

        return null;
    };

    const handleSnippetClick = (snippet: Snippet) => {
        if (!snippets) {
            toast.error('Snippets data is not available');
            return;
        }

        const path = findFolderPath(snippets, snippet.name);
        if (path) {
            router.push(`/dashboard/snippets?callback_snippet=${encodeURIComponent(path)}`);
        } else {
            toast.error('Snippet not found');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">Favorite Snippets</h1>
            <p className="text-gray-600 mb-3">Click any of the cards to view your snippet!</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.length === 0 ? (
                    <p className="text-center text-gray-500">No favorite snippets found.</p>
                ) : (
                    favorites.map((snippet) => {
                        const fileExtension = snippet.name.split('.').pop() || 'txt';
                        const { icon, language } = fileIcons[fileExtension] || { icon: <FaFile />, language: 'Unknown' };

                        return (
                            <div
                                key={snippet.name}
                                className="border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                onClick={() => handleSnippetClick(snippet)}
                            >
                                <div className="flex items-center p-4 bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
                                    <div className="mr-3 text-2xl">{icon}</div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{snippet.name}</h3>
                                        <p className="text-sm text-gray-600">{language}</p>
                                        <p className="text-xs text-gray-500">{findFolderPath(snippets, snippet.name)}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;