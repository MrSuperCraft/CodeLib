'use client';

import React, { useState, useEffect } from 'react';
import Folder from '@/components/snippets/Folder';
import File from '@/components/snippets/File';
import CodeEditor from '@/components/snippets/CodeHighlighter';
import { toast } from 'sonner'; // Import Sonner for notifications
import { SiJavascript, SiPython, SiHtml5, SiCss3, SiCplusplus, SiCsharp, SiLess, SiSass, SiTypescript } from 'react-icons/si';
import { FaMarkdown, FaFile, FaJava, FaFileCode } from 'react-icons/fa';
import { TbFileTypeXml } from 'react-icons/tb';
import { saveSnippetsToRedis } from '@/actions/snippets'; // Import utility functions
import { useSession } from 'next-auth/react';
import { FadeLoader } from 'react-spinners';
import AddSnippetDialog from '@/components/snippets/AddSnippetDialog';
import { useSnippetStore } from '@/app/store/SnippetStore';
import { TbFileTypeJsx, TbFileTypeTsx } from "react-icons/tb";
import { Button } from '@/components/ui/button';
import KeybindsDialog from '@/components/snippets/KeybindsDialog';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetClose, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { FileIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const fileIcons: { [key: string]: React.ReactNode } = {
    js: <SiJavascript />,
    jsx: <TbFileTypeJsx />,
    ts: <SiTypescript />,
    tsx: <TbFileTypeTsx />,
    py: <SiPython />,
    html: <SiHtml5 />,
    css: <SiCss3 />,
    md: <FaMarkdown />,
    java: <FaJava />,
    cpp: <SiCplusplus />,
    json: <FaFile />,
    php: <FaFileCode />,
    rust: <FaFile />,
    sql: <FaFile />,
    xml: <TbFileTypeXml />,
    less: <SiLess />,
    sass: <SiSass />,
    csharp: <SiCsharp />,
    // Add more mappings as needed
};

const sortItems = (items: any[]): any[] => {
    return items
        .sort((a, b) => {
            if (a.children && !b.children) return -1; // Folders before files
            if (!a.children && b.children) return 1;  // Files after folders
            return a.name.localeCompare(b.name); // Alphabetical order
        })
        .map(item => ({
            ...item,
            children: item.children ? sortItems(item.children) : undefined,
        }));
};

const renderTree = (item: any, onSelect: (name: string, fileType: string) => void, email: string) => {
    if (item.children) {
        const sortedChildren = sortItems(item.children); // Sort children
        return (
            <Folder name={item.name} key={item.name} email={email}>
                {sortedChildren.map((child: any) => renderTree(child, onSelect, email))}
            </Folder>
        );
    }
    const fileType = item.name.split('.').pop() || ''; // Get the file extension
    const icon = fileIcons[fileType] || <FaFile />; // Default icon for unknown file types
    return (
        <File key={item.name} name={item.name} onClick={() => onSelect(item.name, fileType)} icon={icon} email={email} favorite={item.isFavorite}>
            <span>{item.name}</span>
        </File>
    );
};


const findPathToSnippet = (item: any, path: string[]): any[] => {
    if (item.name === path[0]) {
        if (path.length === 1) return [item]; // Path found
        if (item.children) {
            for (const child of item.children) {
                const result = findPathToSnippet(child, path.slice(1));
                if (result.length > 0) return [item, ...result]; // Found in children
            }
        }
    }
    return []; // Not found
};


const Page: React.FC = () => {
    const ref = React.useRef<ReactCodeMirrorRef>({});
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [content, setContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true); // State for loading

    const { data: session } = useSession();
    const email = session?.user?.email || '';
    const { snippets, setSnippets, fetchSnippets } = useSnippetStore(state => ({
        snippets: state.snippets,
        fetchSnippets: state.fetchSnippets,
        setSnippets: state.setSnippets,
    }));
    const searchParams = useSearchParams();
    const callback_snippet = searchParams.get('callback_snippet')

    useEffect(() => {
        const loadSnippets = async () => {
            setIsLoading(true);
            await fetchSnippets(email);
            if (snippets) {
                const sortedSnippets = sortItems(snippets.children || []);
                setSnippets({ ...snippets, children: sortedSnippets });

                // Handle callback_snippet
                const path = callback_snippet ? callback_snippet.split('/') : [];
                if (path.length > 0) {
                    const snippetPath = findPathToSnippet(snippets, path);
                    if (snippetPath.length > 0) {
                        const lastNode = snippetPath[snippetPath.length - 1];
                        setSelectedFile(lastNode.name);
                        setContent(lastNode.content || '');
                    }
                }
            }
            setIsLoading(false);
        };

        loadSnippets();
    }, [fetchSnippets, email, callback_snippet]);


    const findItemByName = (item: any, name: string) => {
        if (item.name === name) return item;
        if (item.children) {
            for (const child of item.children) {
                const result: any = findItemByName(child, name);
                if (result) return result;
            }
        }
        return null;
    };

    const handleSelectFile = (fileName: string) => {
        if (snippets) {
            const item = findItemByName(snippets, fileName);
            if (item) {
                setSelectedFile(fileName);
                setContent(item.content);
            }
        }
    };


    const handleSave = async (filename: string, content: string) => {
        if (snippets) {
            const updateFileContent = (item: any, filename: string, content: string) => {
                if (item.name === filename) {
                    item.content = content;
                    return true;
                }
                if (item.children) {
                    for (const child of item.children) {
                        if (updateFileContent(child, filename, content)) {
                            return true;
                        }
                    }
                }
                return false;
            };

            if (updateFileContent(snippets, filename, content)) {
                await saveSnippetsToRedis(email, snippets);
                toast.success('File saved successfully!');
            } else {
                toast.error('Error saving file. File not found.');
            }
        }
    };


    return (
        <div className="flex flex-col md:flex-row dark:bg-neutral-950 dark:text-gray-100">
            {/* Folder Sidebar */}
            <div className="hidden md:block w-1/3 p-2 mt-4 border-r rounded-md border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-neutral-900">
                <div className="bg-white p-4 border-b border-gray-300 mb-4 dark:bg-neutral-900 dark:border-gray-700 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Snippet Manager</h1>
                </div>
                <div className="space-y-2 flex flex-col justify-between h-full">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <FadeLoader />
                        </div>
                    ) : snippets ? (
                        <div className="flex flex-col h-[85%]">
                            {/* Snippet Tree - Flexible container with flex-grow */}
                            <div className="flex-grow overflow-y-auto">
                                {renderTree(snippets, handleSelectFile, email)}
                            </div>
                            {/* Keybinds button fixed at the bottom */}
                            <KeybindsDialog className="mt-auto" />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8">
                            <svg
                                className="w-12 h-12 mb-4 text-gray-400 dark:text-gray-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 12l2 2 4-4 4 4 4-4 4 4"
                                />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                No Snippets Available
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                You don't have any snippets saved yet. Start by adding some snippets.
                            </p>

                            <AddSnippetDialog email={email} />
                        </div>
                    )}
                </div>
            </div>

            {/* File Editor */}
            <div className="w-full md:w-2/3 p-4">
                {selectedFile ? (
                    <div className="bg-white p-4 mt-2 border rounded-lg shadow-md dark:bg-neutral-900 dark:border-gray-700">
                        <div className="flex flex-row items-center gap-3">
                            {/* Mobile view: File system in Sheet */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button className="md:hidden -mt-1"><FileIcon /></Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Snippet Manager</SheetTitle>
                                        <SheetDescription>Browse and edit your snippets.</SheetDescription>
                                    </SheetHeader>
                                    <div className="space-y-2">
                                        {isLoading ? (
                                            <div className="flex items-center justify-center h-full">
                                                <FadeLoader />
                                            </div>
                                        ) : snippets ? (
                                            renderTree(snippets, handleSelectFile, email)
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8">
                                                <AddSnippetDialog email={email} />
                                            </div>
                                        )}
                                    </div>
                                    <SheetFooter>
                                        <SheetClose asChild>
                                            <Button variant="outline">Close</Button>
                                        </SheetClose>
                                    </SheetFooter>
                                </SheetContent>
                            </Sheet>
                            <h2 className="text-xl font-semibold mb-4">{selectedFile}</h2>
                        </div>
                        <CodeEditor filename={selectedFile} content={content} onSave={handleSave} editorRef={ref} />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8">
                        <svg
                            className="w-12 h-12 mb-4 text-gray-400 dark:text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 12l5 5 5-5-5-5-5 5z"
                            />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                            No File Selected
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Select a file from the sidebar to edit it.
                        </p>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button className="md:hidden mt-4">Open Snippet Menu</Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Snippet Manager</SheetTitle>
                                    <SheetDescription>Browse and edit your snippets.</SheetDescription>
                                </SheetHeader>
                                <div className="space-y-2">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center h-full">
                                            <FadeLoader />
                                        </div>
                                    ) : snippets ? (
                                        renderTree(snippets, handleSelectFile, email)
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8">
                                            <AddSnippetDialog email={email} />
                                        </div>
                                    )}
                                </div>
                                <SheetFooter>
                                    <SheetClose asChild>
                                        <Button variant="outline">Close</Button>
                                    </SheetClose>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
