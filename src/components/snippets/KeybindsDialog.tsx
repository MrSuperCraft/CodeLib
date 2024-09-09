import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogTrigger, DialogHeader, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';


const KeybindsDialog = ({ className }: { className?: string }) => {
    return (
        <Dialog>
            <DialogTrigger asChild className={cn(className)}>
                <Button variant="outline">Keybinds ⌘</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Keybinds</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <ul>
                        <li><kbd>Ctrl + K</kbd>: Open file search</li>
                        <li><kbd>Ctrl + S</kbd>: Save file</li>
                        <li><kbd>Ctrl + C</kbd>: Copy selected snippet</li>
                        {/* Add more keybinds as needed */}
                    </ul>
                </DialogDescription>
                <DialogFooter>
                    <Button variant="outline">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default KeybindsDialog;