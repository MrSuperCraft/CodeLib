import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface RenameDialogProps {
    isOpen: boolean;
    onClose: () => void;
    currentName: string;
    onRename: (newName: string) => void;
}

const RenameDialog: React.FC<RenameDialogProps> = ({ isOpen, onClose, currentName, onRename }) => {
    const [newName, setNewName] = useState(currentName);

    const handleRename = () => {
        onRename(newName);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rename Item</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <Label htmlFor="new-name" className="block mb-2">New Name</Label>
                    <Input
                        id="new-name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Enter new name"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleRename} className="bg-blue-500 text-white">Rename</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RenameDialog;
