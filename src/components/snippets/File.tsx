'use client';

import React, { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import RenameDialog from '@/components/snippets/RenameDialog';
import DeleteConfirmationDialog from '@/components/snippets/DeleteDialog';
import { toast } from 'sonner';
import { useSnippetStore } from '@/app/store/SnippetStore';
import { Edit3, LucideTrash } from 'lucide-react';

interface FileProps {
    name: string;
    onClick: () => void;
    icon?: React.ReactNode;
    isSelected?: boolean;
    email: string;
    children: React.ReactNode
    favorite?: boolean
}

const File: React.FC<FileProps> = ({ name, onClick, icon, isSelected = false, children, email, favorite }) => {
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { addFavorite, removeFavorite, updateSnippet } = useSnippetStore();

    const handleFavoriteToggle = async () => {
        console.log('Toggling favorite:', name, favorite);
        try {
            if (favorite) {
                await removeFavorite(name);
                await updateSnippet(name, { isFavorite: false }, email);
                toast.success('Removed from favorites');
            } else {
                await addFavorite(name);
                await updateSnippet(name, { isFavorite: true }, email);
                toast.success('Added to favorites');
            }
        } catch (error) {
            console.error('Error updating favorite:', error);
            toast.error('Failed to update favorites');
        }
    };


    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div
                        className={`flex items-center cursor-pointer p-2 rounded-md transition-colors duration-200 
                            hover:bg-neutral-200 dark:hover:bg-neutral-600 
                            ${isSelected ? 'bg-gray-200 text-blue-600' : 'hover:bg-gray-100'}`}
                        onClick={onClick}
                    >
                        <span className="mr-2">{icon}</span>
                        {children}
                        <span className="ml-auto cursor-pointer" onClick={handleFavoriteToggle}>
                            {favorite ? <FaStar /> : <FaRegStar />}
                        </span>

                    </div>
                </ContextMenuTrigger>
                {name !== 'Root' && (
                    <ContextMenuContent>
                        <ContextMenuItem onClick={() => setIsRenameDialogOpen(true)}>
                            <Edit3 className="size-6 mr-2" /> Rename File
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                            <LucideTrash className="size-6 mr-2" /> Delete File
                        </ContextMenuItem>
                    </ContextMenuContent>
                )}
            </ContextMenu>

            <RenameDialog
                isOpen={isRenameDialogOpen}
                onClose={() => setIsRenameDialogOpen(false)}
                currentName={name}
                onRename={async (newName: string) => {
                    try {
                        await useSnippetStore.getState().renameFile(name, newName, email);
                        toast.success('File renamed successfully');
                    } catch (error) {
                        toast.error('Failed to rename file');
                    }
                    setIsRenameDialogOpen(false);
                }}
            />

            <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={async () => {
                    try {
                        await useSnippetStore.getState().deleteFile(name, email);
                        toast.success('File deleted successfully');
                    } catch (error) {
                        toast.error('Failed to delete file');
                    }
                    setIsDeleteDialogOpen(false);
                }}
                itemName={name}
            />
        </>
    );
};

export default File;
