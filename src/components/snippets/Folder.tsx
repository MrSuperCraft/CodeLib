import React, { useState } from 'react';
import { ChevronDown, ChevronRight, EditIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { FaFolder } from 'react-icons/fa';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useSnippetStore } from '@/app/store/SnippetStore';
import RenameDialog from '@/components/snippets/RenameDialog';
import DeleteConfirmationDialog from '@/components/snippets/DeleteDialog';
import AddItemDialog from '@/components/snippets/AddItemDialog';
import { toast } from 'sonner';
import { Separator } from '../ui/separator';
import { FaStar, FaRegStar } from 'react-icons/fa';
interface FolderProps {
    name: string;
    email: string;
    children?: React.ReactNode;
}

const Folder: React.FC<FolderProps> = ({ name, email, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { addFileToFolder, addFolderToFolder } = useSnippetStore();

    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);

    const toggleFolder = () => setIsOpen(!isOpen);

    const handleAddItem = async (parentFolderName: string, name: string, type: 'file' | 'folder') => {
        try {
            if (type === 'file') {
                await addFileToFolder(parentFolderName, name, email);
                toast.success('File added successfully');
            } else {
                await addFolderToFolder(parentFolderName, name, email);
                toast.success('Folder added successfully');
            }
        } catch (error) {
            toast.error(`Failed to add ${type}`);
        }
    };



    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2 cursor-pointer p-2 rounded-md transition-colors duration-200 
                            hover:bg-neutral-200 dark:hover:bg-neutral-600" onClick={toggleFolder}>
                            {isOpen ? <ChevronDown className="transition-transform duration-200" /> : <ChevronRight className="transition-transform duration-200" />}
                            <div className="flex items-center space-x-2">
                                <FaFolder />
                                <span className="font-bold">{name}</span>
                            </div>
                        </div>
                        {isOpen && (
                            <div className="ml-4 transition-all duration-200 ease-in-out">
                                {children}
                            </div>
                        )}
                    </div>
                </ContextMenuTrigger>

                <ContextMenuContent className="p-2 bg-white border border-gray-200 rounded shadow-lg">
                    <ContextMenuItem
                        onClick={() => setIsAddItemDialogOpen(true)}
                        className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded"
                    >
                        <PlusIcon className="size-6 text-green-500" />
                        <span>Add Item</span>
                    </ContextMenuItem>
                    {name !== 'Root' && (
                        <Separator />
                    )}
                    {name !== 'Root' && (
                        <ContextMenuItem
                            onClick={() => setIsRenameDialogOpen(true)}
                            className="flex items-center flex-col space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded"
                        >
                            <div className="flex flex-row items-center space-x-2">
                                <EditIcon className=" size-6 text-blue-500" />
                                <span>Rename Folder</span>
                            </div>
                        </ContextMenuItem>
                    )}
                    {name !== 'Root' && (
                        <Separator />
                    )}
                    {name !== 'Root' && (
                        <ContextMenuItem
                            onClick={() => setIsDeleteDialogOpen(true)}
                            className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded"
                        >
                            <Trash2Icon className="size-6 text-red-500" />
                            <span>Delete Folder</span>
                        </ContextMenuItem>
                    )}
                </ContextMenuContent>
            </ContextMenu>

            <RenameDialog
                isOpen={isRenameDialogOpen}
                onClose={() => setIsRenameDialogOpen(false)}
                currentName={name}
                onRename={async (newName: string) => {
                    try {
                        await useSnippetStore.getState().renameFolder(name, newName, email);
                        toast.success('Folder renamed successfully');
                    } catch (error) {
                        toast.error('Failed to rename folder');
                    }
                    setIsRenameDialogOpen(false);
                }}
            />

            <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={async () => {
                    try {
                        await useSnippetStore.getState().deleteFolder(name, email);
                        toast.success('Folder deleted successfully');
                    } catch (error) {
                        toast.error('Failed to delete folder');
                    }
                    setIsDeleteDialogOpen(false);
                }}
                itemName={name}
            />

            <AddItemDialog
                isOpen={isAddItemDialogOpen}
                onClose={() => setIsAddItemDialogOpen(false)}
                onAdd={handleAddItem}
                parentFolderName={name}
            />
        </>
    );
};

export default Folder;
