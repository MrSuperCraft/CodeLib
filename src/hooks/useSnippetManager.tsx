// hooks/useSnippetManager.ts

import { useState } from 'react';
import { toast } from 'sonner'; // Import Sonner for notifications
import { saveSnippetsToRedis, getSnippetsFromRedis } from '@/actions/snippets';

const useSnippetManager = (email: string) => {
    const [snippets, setSnippets] = useState<any>(null);

    const fetchSnippets = async () => {
        try {
            const data = await getSnippetsFromRedis(email);
            setSnippets(data || { name: 'Root', children: [] });
        } catch (error) {
            toast.error('Error fetching snippets.');
            setSnippets(null);
        }
    };

    const handleAddSnippet = (folderName: string, fileName: string) => {
        const newSnippet = { name: fileName, content: '' };

        const searchFolder = (folder: any, targetFolderName: string): any => {
            if (folder.name === targetFolderName) return folder;
            if (folder.children) {
                for (const child of folder.children) {
                    const result = searchFolder(child, targetFolderName);
                    if (result) return result;
                }
            }
            return null;
        };

        const addSnippetToFolder = (folder: any, newSnippet: any) => {
            const targetFolder = searchFolder(folder, folderName);
            if (targetFolder) {
                targetFolder.children.push(newSnippet);
                return true;
            }
            return false;
        };

        if (!snippets || (snippets.name === 'Root' && snippets.children.length === 0)) {
            const newRoot = { name: 'Root', children: [newSnippet] };
            setSnippets(newRoot);
            saveSnippetsToRedis(email, newRoot);
            toast.success('Snippet added successfully!');
        } else {
            if (addSnippetToFolder(snippets, newSnippet)) {
                setSnippets({ ...snippets });
                saveSnippetsToRedis(email, snippets);
                toast.success('Snippet added successfully!');
            } else {
                toast.error('Folder not found.');
            }
        }
    };

    return {
        snippets,
        fetchSnippets,
        handleAddSnippet,
    };
};

export default useSnippetManager;
