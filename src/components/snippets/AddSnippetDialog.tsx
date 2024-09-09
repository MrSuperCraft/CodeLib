import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSnippetStore } from "@/app/store/SnippetStore"; // Your Zustand store path

interface AddSnippetDialogProps {
    email: string;
}

const AddSnippetDialog: React.FC<AddSnippetDialogProps> = ({ email }) => {
    const { snippets, addSnippet, fetchSnippets } = useSnippetStore(); // Access Zustand store

    const [fileName, setFileName] = useState('');
    const [selectedFolder, setSelectedFolder] = useState('Root'); // Default to 'Root' folder
    const [folders, setFolders] = useState<string[]>([]);

    // Helper function to extract folder names recursively
    const extractFolderPaths = (node: any, path: string = ''): string[] => {
        const folderPaths: string[] = [];

        if (!node) return [];

        if ('children' in node) {
            const currentPath = path ? `${path}/${node.name}` : node.name;
            folderPaths.push(currentPath);

            if (Array.isArray(node.children)) {
                node.children.forEach((child: any) => {
                    folderPaths.push(...extractFolderPaths(child, currentPath));
                });
            }
        }

        return folderPaths;
    };



    useEffect(() => {
        fetchSnippets(email); // Fetch snippets on component mount
    }, [fetchSnippets, email]);

    useEffect(() => {
        if (snippets) {
            const folderNames = extractFolderPaths(snippets);
            setFolders(folderNames);
        }
    }, [snippets]);


    const handleSave = () => {
        if (!fileName) {
            toast.error("Please enter a file name.");
            return;
        }

        // Call Zustand store to add snippet with the selected folder path
        addSnippet(selectedFolder, fileName, email);
        setFileName(''); // Clear input after adding
        toast.success("Snippet added successfully!");
    };


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Add New Snippet</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a New Snippet</DialogTitle>
                    <DialogDescription>Enter the file name and select its location in the folder structure.</DialogDescription>
                </DialogHeader>

                {/* Input for file name */}
                <div className="mt-4">
                    <label htmlFor="file-name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        File Name
                    </label>
                    <Input
                        id="file-name"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="Enter file name (e.g., snippet.js)"
                    />
                </div>

                {/* Folder location dropdown using Select component */}
                <div className="mt-4">
                    <label htmlFor="folder-location" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Select Folder
                    </label>
                    <Select
                        name="folder-location"
                        value={selectedFolder}
                        onValueChange={(value) => setSelectedFolder(value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select folder" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {folders.map((folder) => (
                                    <SelectItem key={folder} value={folder}>
                                        {folder}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Save button */}
                <div className="mt-6">
                    <Button onClick={handleSave} className="bg-blue-500 text-white">Save Snippet</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddSnippetDialog;
