import { create } from 'zustand';
import { saveSnippetsToRedis, getSnippetsFromRedis } from '@/actions/snippets'; // Adjust import path

interface Snippet {
    name: string;
    content: string;
    isFavorite?: boolean;
    dateAdded?: Date;
    lastEdited?: Date;
}

interface Folder {
    name: string;
    children: (Snippet | Folder)[];
}

interface SnippetStore {
    snippets: Folder | null;
    fetchSnippets: (email: string) => Promise<void>;
    addSnippet: (folderPath: string, fileName: string, email: string) => Promise<void>;
    updateSnippet: (fileName: string, updates: Partial<Snippet>, email: string) => Promise<void>;
    setSnippets: (snippets: Folder | null) => void;
    addFileToFolder: (parentFolderName: string, fileName: string, email: string) => Promise<void>;
    addFolderToFolder: (parentFolderName: string, folderName: string, email: string) => Promise<void>;
    renameFolder: (oldName: string, newName: string, email: string) => Promise<void>;
    deleteFolder: (folderName: string, email: string) => Promise<void>;
    renameFile: (fileName: string, newName: string, email: string) => Promise<void>;
    deleteFile: (fileName: string, email: string) => Promise<void>;
    favoriteItems: Set<string>;
    addFavorite: (itemName: string) => void;
    removeFavorite: (itemName: string) => void;
    isFavorite: (itemName: string) => boolean;
    fetchFavorites: (email: string) => Promise<Snippet[]>;
    getTotalSnippets: () => number;
    getCategories: () => string[];
    getRecentSnippets: (limit?: number) => Snippet[];
    getRecentEdits: (limit?: number) => Snippet[];
}

const flattenSnippets = (folder: Folder | null): Snippet[] => {
    let snippets: Snippet[] = [];
    if (folder === null) return snippets;
    for (const child of folder.children) {
        if ('content' in child) {
            snippets.push(child);
        } else {
            snippets = snippets.concat(flattenSnippets(child as Folder));
        }
    }
    return snippets;
};

export const useSnippetStore = create<SnippetStore>((set, get) => ({
    snippets: null,

    fetchSnippets: async (email: string) => {
        try {
            const data = await getSnippetsFromRedis(email);
            set({ snippets: data as Folder | null });
        } catch (error) {
            console.error("Error fetching snippets from Redis:", error);
        }
    },

    addSnippet: async (folderPath: string, fileName: string, email: string) => {
        const newSnippet: Snippet = { name: fileName, content: '' };

        const findAndAddSnippet = (folder: Folder, pathSegments: string[]): Folder => {
            if (pathSegments.length === 0) {
                return { ...folder, children: [...folder.children, newSnippet] };
            }

            const [currentSegment, ...remainingSegments] = pathSegments;

            if (folder.name === currentSegment) {
                return findAndAddSnippet(folder, remainingSegments);
            }

            return {
                ...folder,
                children: folder.children.map(child =>
                    'children' in child && child.name === currentSegment
                        ? findAndAddSnippet(child as Folder, remainingSegments)
                        : child
                ),
            };
        };

        set((state) => {
            if (!state.snippets) {
                return { snippets: { name: 'Root', children: [newSnippet] } };
            }

            const pathSegments = folderPath.split('/').filter(Boolean);
            const updatedSnippets = findAndAddSnippet(state.snippets, pathSegments);

            saveSnippetsToRedis(email, updatedSnippets)
                .then(() => console.log("Snippet saved to Redis"))
                .catch((error) => console.error("Error saving snippet to Redis:", error));

            return { snippets: updatedSnippets };
        });
    },

    updateSnippet: async (fileName: string, updates: Partial<Snippet>, email: string) => {
        set((state) => {
            if (!state.snippets) return state;

            const updateSnippetInFolder = (folder: Folder): Folder => {
                return {
                    ...folder,
                    children: folder.children.map(child =>
                        'children' in child
                            ? updateSnippetInFolder(child as Folder)
                            : (child as Snippet).name === fileName
                                ? { ...child, ...updates } as Snippet
                                : child
                    ),
                };
            };

            const updatedSnippets = updateSnippetInFolder(state.snippets);
            saveSnippetsToRedis(email, updatedSnippets)
                .then(() => console.log("Snippet updated in Redis"))
                .catch((error) => console.error("Error updating snippet in Redis:", error));

            return { snippets: updatedSnippets };
        });
    },

    setSnippets: (newSnippets) => set(() => ({
        snippets: newSnippets || { name: 'Root', children: [] },
    })),

    addFileToFolder: async (parentFolderName: string, fileName: string, email: string) => {
        const addFile = (folder: Folder): Folder => {
            if (folder.name === parentFolderName) {
                return { ...folder, children: [...folder.children, { name: fileName, content: '' }] };
            }
            return {
                ...folder,
                children: folder.children.map(child =>
                    'children' in child ? addFile(child as Folder) : child
                ),
            };
        };

        set((state) => {
            if (!state.snippets) return state;

            const updatedSnippets = addFile(state.snippets);
            saveSnippetsToRedis(email, updatedSnippets)
                .then(() => console.log("File added to folder in Redis"))
                .catch((error) => console.error("Error adding file to folder in Redis:", error));

            return { snippets: updatedSnippets };
        });
    },

    addFolderToFolder: async (parentFolderName: string, folderNameToAdd: string, email: string) => {
        const addFolder = (folder: Folder): Folder => {
            if (folder.name === parentFolderName) {
                return {
                    ...folder,
                    children: [...folder.children, { name: folderNameToAdd, children: [] }],
                };
            }
            return {
                ...folder,
                children: folder.children.map(child =>
                    'children' in child ? addFolder(child as Folder) : child
                ),
            };
        };

        set((state) => {
            if (!state.snippets) return state;

            const updatedSnippets = addFolder(state.snippets);
            saveSnippetsToRedis(email, updatedSnippets)
                .then(() => console.log("Folder added to folder in Redis"))
                .catch((error) => console.error("Error adding folder to folder in Redis:", error));

            return { snippets: updatedSnippets };
        });
    },

    renameFolder: async (oldName: string, newName: string, email: string) => {
        const rename = (folder: Folder): Folder => {
            if (folder.name === oldName) {
                return { ...folder, name: newName };
            }
            return {
                ...folder,
                children: folder.children.map(child =>
                    'children' in child ? rename(child as Folder) : child
                ),
            };
        };

        set((state) => {
            if (!state.snippets) return state;

            const updatedSnippets = rename(state.snippets);
            saveSnippetsToRedis(email, updatedSnippets)
                .then(() => console.log("Folder renamed in Redis"))
                .catch((error) => console.error("Error renaming folder in Redis:", error));

            return { snippets: updatedSnippets };
        });
    },

    deleteFolder: async (folderName: string, email: string) => {
        const deleteFolder = (folder: Folder): Folder => {
            return {
                ...folder,
                children: folder.children
                    .filter(child => 'name' in child && (child as Snippet).name !== folderName)
                    .map(child => 'children' in child ? deleteFolder(child as Folder) : child),
            };
        };

        set((state) => {
            if (!state.snippets || folderName === 'Root') return state;

            const updatedSnippets = deleteFolder(state.snippets);
            saveSnippetsToRedis(email, updatedSnippets)
                .then(() => console.log("Folder deleted in Redis"))
                .catch((error) => console.error("Error deleting folder in Redis:", error));

            return { snippets: updatedSnippets };
        });
    },

    renameFile: async (fileName: string, newName: string, email: string) => {
        const rename = (folder: Folder): Folder => {
            return {
                ...folder,
                children: folder.children.map(child =>
                    'children' in child
                        ? rename(child as Folder)
                        : (child as Snippet).name === fileName
                            ? { ...child, name: newName }
                            : child
                ),
            };
        };

        set((state) => {
            if (!state.snippets) return state;

            const updatedSnippets = rename(state.snippets);
            saveSnippetsToRedis(email, updatedSnippets)
                .then(() => console.log("File renamed in Redis"))
                .catch((error) => console.error("Error renaming file in Redis:", error));

            return { snippets: updatedSnippets };
        });
    },

    deleteFile: async (fileName: string, email: string) => {
        const deleteFile = (folder: Folder): Folder => {
            return {
                ...folder,
                children: folder.children
                    .filter(child => 'name' in child && (child as Snippet).name !== fileName)
                    .map(child => 'children' in child ? deleteFile(child as Folder) : child),
            };
        };

        set((state) => {
            if (!state.snippets) return state;

            const updatedSnippets = deleteFile(state.snippets);
            saveSnippetsToRedis(email, updatedSnippets)
                .then(() => console.log("File deleted in Redis"))
                .catch((error) => console.error("Error deleting file in Redis:", error));

            return { snippets: updatedSnippets };
        });
    },

    favoriteItems: new Set(),

    addFavorite: (itemName: string) => {
        set((state) => {
            state.favoriteItems.add(itemName);
            return { favoriteItems: new Set(state.favoriteItems) };
        });
    },

    removeFavorite: (itemName: string) => {
        set((state) => {
            state.favoriteItems.delete(itemName);
            return { favoriteItems: new Set(state.favoriteItems) };
        });
    },

    isFavorite: (itemName: string) => get().favoriteItems.has(itemName),

    fetchFavorites: async (email: string): Promise<Snippet[]> => {
        try {
            // Fetch all snippets from Redis
            const snippets = await getSnippetsFromRedis(email);

            // If no snippets or error, return an empty array
            if (!snippets) return [];

            // Function to recursively filter favorite snippets
            const filterFavorites = (folder: Folder): Snippet[] => {
                // Filter snippets in the current folder
                const favoritesInCurrentFolder = folder.children.filter(child =>
                    'isFavorite' in child && (child as Snippet).isFavorite
                ) as Snippet[];

                // Recursively filter children folders
                const favoritesInChildren = folder.children
                    .filter(child => 'children' in child) // Only folders
                    .map(child => filterFavorites(child as Folder))
                    .flat();

                // Combine the results
                return [...favoritesInCurrentFolder, ...favoritesInChildren];
            };

            // Apply filtering starting from the root
            return filterFavorites(snippets as Folder);
        } catch (error) {
            console.error("Error fetching favorites from Redis:", error);
            return [];
        }
    },
    getTotalSnippets: () => {
        const snippets = get().snippets;
        return snippets ? flattenSnippets(snippets).length : 0;
    },

    getCategories: () => {
        const snippets = get().snippets;
        if (!snippets) return [];
        const categories = new Set<string>();
        const extractCategories = (folder: Folder) => {
            folder.children.forEach(child => {
                if ('children' in child) {
                    extractCategories(child as Folder);
                } else {
                    categories.add((child as Snippet).name); // Adjust if you have specific categories
                }
            });
        };
        extractCategories(snippets);
        return Array.from(categories);
    },

    getRecentSnippets: (limit = 5) => {
        const snippets = flattenSnippets(get().snippets);
        return snippets
            .sort((a, b) => (b.lastEdited?.getTime() ?? 0) - (a.lastEdited?.getTime() ?? 0))
            .slice(0, limit);
    },

    getRecentEdits: (limit = 5) => {
        const snippets = flattenSnippets(get().snippets);
        return snippets
            .sort((a, b) => (b.dateAdded?.getTime() ?? 0) - (a.dateAdded?.getTime() ?? 0))
            .slice(0, limit);
    },
}));
