import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface AddItemDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (parentFolderName: string, name: string, type: 'file' | 'folder') => void;
    parentFolderName: string; // Add this prop
}

const AddItemDialog: React.FC<AddItemDialogProps> = ({ isOpen, onClose, onAdd, parentFolderName }) => {
    const [itemName, setItemName] = useState('');
    const [itemType, setItemType] = useState<'file' | 'folder'>('file');

    const handleAdd = () => {
        if (itemName) {
            onAdd(parentFolderName, itemName, itemType);
            setItemName('');
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Item</DialogTitle>
                    <DialogDescription>
                        Choose the type of item to add and enter its name.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="itemType">Item Type</Label>
                        <Select
                            value={itemType}
                            onValueChange={(value) => setItemType(value as 'file' | 'folder')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="file">File</SelectItem>
                                <SelectItem value="folder">Folder</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="itemName">Item Name</Label>
                        <Input
                            id="itemName"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            placeholder="Enter name"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={onClose}>Cancel</Button>
                    <Button type="button" onClick={handleAdd}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddItemDialog;
