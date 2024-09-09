import React, { useState, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { FileIcon, FolderClosedIcon, SearchIcon } from 'lucide-react';
import { CommandDialog, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from '@/components/ui/command';
import { useSession } from 'next-auth/react';
import { FadeLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';
import { useSnippetStore } from '@/app/store/SnippetStore';
import Highlight from './Highlight';

const Spinner = () => <FadeLoader className="size-5" />;

interface Snippet {
    name: string;
    content: string;
}

interface Folder {
    name: string;
    children: (Snippet | Folder)[];
}

// Type for categorized results
interface CategorizedResult {
    item: Snippet | Folder;
    path: string;
}

interface CategorizedResults {
    snippets: CategorizedResult[];
    folders: CategorizedResult[];
}

// Categorize results and keep track of paths
const categorizeResults = (folder: Folder | null, parentPath: string = ''): CategorizedResults => {
    const categories: CategorizedResults = {
        snippets: [],
        folders: [],
    };

    if (folder) {
        const currentFolderPath = parentPath ? `${parentPath}/${folder.name}` : folder.name;

        folder.children.forEach((item) => {
            if ('content' in item) {
                categories.snippets.push({
                    item: item as Snippet,
                    path: `${currentFolderPath}/${(item as Snippet).name}`,
                });
            } else if ('children' in item) {
                categories.folders.push({
                    item: item as Folder,
                    path: currentFolderPath,
                });
                const subCategories = categorizeResults(item as Folder, currentFolderPath); // Recursively categorize subfolders
                categories.snippets.push(...subCategories.snippets);
                categories.folders.push(...subCategories.folders);
            }
        });
    }

    return categories;
};

const SearchDialog = () => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [allResults, setAllResults] = useState<CategorizedResults>({ snippets: [], folders: [] });
    const [filteredResults, setFilteredResults] = useState<CategorizedResults>({ snippets: [], folders: [] });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();
    const { snippets, fetchSnippets } = useSnippetStore((state) => ({
        snippets: state.snippets,
        fetchSnippets: state.fetchSnippets,
    }));

    const email = session?.user?.email || '';

    useHotkeys('ctrl+k', (e: Event) => {
        e.preventDefault();
        setOpen(true);
    });

    useEffect(() => {
        if (!snippets) {
            setLoading(true);
            fetchSnippets(email)
                .then(() => setLoading(false))
                .catch((error) => {
                    console.error('Error fetching snippets:', error);
                    setLoading(false);
                });
        }
    }, [snippets, fetchSnippets, email]);

    useEffect(() => {
        if (snippets) {
            const categorizedResults = categorizeResults(snippets);
            setAllResults(categorizedResults);
            setFilteredResults(categorizedResults); // Initially show all results
        }
    }, [snippets]);

    useEffect(() => {
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            const filtered: CategorizedResults = {
                snippets: allResults.snippets.filter(result => result.item.name.toLowerCase().includes(term)),
                folders: allResults.folders.filter(result => result.item.name.toLowerCase().includes(term)),
            };
            setFilteredResults(filtered);
        } else {
            setFilteredResults(allResults);
        }
    }, [searchTerm, allResults]);

    const handleSelectResult = (result: CategorizedResult) => {
        const path = result.path;
        router.push(`/dashboard/snippets?callback_snippet=${encodeURIComponent(path)}`);
        setOpen(false);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.currentTarget.value.toLowerCase());
    };

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Button className="hidden md:flex items-center justify-center" size="icon" onClick={() => setOpen(true)}>
                            <SearchIcon />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Search for snippets</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {open && (
                <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput
                        placeholder="Search snippets, settings, statistics..."
                        value={searchTerm}
                        onInput={handleSearch}
                    />
                    <CommandList>
                        {loading ? (
                            <div className="flex justify-center p-4">
                                <Spinner />
                            </div>
                        ) : (
                            <>
                                {filteredResults.snippets.length === 0 && filteredResults.folders.length === 0 ? (
                                    <CommandEmpty>No results found.</CommandEmpty>
                                ) : (
                                    <>
                                        {filteredResults.snippets.length > 0 && (
                                            <CommandGroup heading="Snippets">
                                                {filteredResults.snippets.map((result, index) => (
                                                    <CommandItem
                                                        key={index}
                                                        onSelect={() => handleSelectResult(result)}
                                                    >
                                                        <div className="flex justify-between items-center w-full">
                                                            {/* Left side: Icon and name */}
                                                            <div className="flex flex-row items-center">
                                                                <FileIcon className="mr-2" />
                                                                <Highlight text={result.item.name} searchTerm={searchTerm} />
                                                            </div>

                                                            {/* Right side: Snippet path */}
                                                            <div className="text-xs ml-auto text-gray-500">
                                                                {result.path}
                                                            </div>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        )}
                                        {filteredResults.folders.length > 0 && (
                                            <CommandGroup heading="Folders">
                                                {filteredResults.folders.map((result, index) => (
                                                    <CommandItem
                                                        key={index}
                                                        onSelect={() => handleSelectResult(result)}
                                                    >
                                                        <div className="flex justify-between items-center w-full">
                                                            {/* Left side: Icon and name */}
                                                            <div className="flex flex-row items-center">
                                                                <FolderClosedIcon className="mr-2" />
                                                                <Highlight text={result.item.name} searchTerm={searchTerm} />
                                                            </div>

                                                            {/* Right side: Folder path */}
                                                            <div className="text-xs ml-auto text-gray-500">
                                                                {result.path}
                                                            </div>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </CommandList>
                </CommandDialog>
            )}
        </>
    );
};

export default SearchDialog;
