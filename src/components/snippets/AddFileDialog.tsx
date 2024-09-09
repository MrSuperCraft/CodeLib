import React, { useState } from 'react';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useSnippetStore } from '@/app/store/SnippetStore';

interface AddFileDialogProps {
    isOpen: boolean;
    onClose: () => void;
    folderName: string;
    email: string;
}

const AddFileDialog: React.FC<AddFileDialogProps> = ({ isOpen, onClose, folderName, email }) => {
    const [fileName, setFileName] = useState('');
    const { addFileToFolder } = useSnippetStore();

    const handleAddFile = () => {
        addFileToFolder(folderName, fileName, email);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add File</DialogTitle>
                    <DialogDescription>Enter the file name to add to the folder.</DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    <Label htmlFor="file-name" className="block mb-2">File Name</Label>
                    <Input
                        id="file-name"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="Enter file name"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleAddFile} className="bg-blue-500 text-white">Add File</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddFileDialog;
