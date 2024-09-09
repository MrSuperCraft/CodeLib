import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CopyIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';

const CopyButton = ({ editorRef, className }: { editorRef: React.RefObject<ReactCodeMirrorRef>, className?: string }) => {
    const handleCopyClick = () => {
        // Accessing editorRef.current.view.state.doc.toString() correctly
        if (editorRef.current && editorRef.current.view) {
            const content = editorRef.current.view.state.doc.toString();
            console.log(content);

            navigator.clipboard.writeText(content || '')
                .then(() => {
                    toast.success('Snippet copied to clipboard!');
                })
                .catch(() => {
                    toast.error('Failed to copy snippet.');
                });
        }
    };

    return (
        <Button onClick={handleCopyClick} variant="outline" className={cn(className)}>
            <CopyIcon className='mr-2' /> Copy
        </Button>
    );
};

export default CopyButton;
