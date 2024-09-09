'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import CopyButton from '@/components/snippets/CopyButton'
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { markdown } from '@codemirror/lang-markdown';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { json } from '@codemirror/lang-json';
import { php } from '@codemirror/lang-php';
import { rust } from '@codemirror/lang-rust';
import { sql } from '@codemirror/lang-sql';
import { xml } from '@codemirror/lang-xml';
import { less } from '@codemirror/lang-less';
import { sass } from '@codemirror/lang-sass';
import { clojure } from '@nextjournal/lang-clojure';
import { csharp } from '@replit/codemirror-lang-csharp';
// Add more language imports as needed

// Import for ref
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';


const languageExtensions: { [key: string]: any } = {
    js: javascript({ jsx: true }),
    jsx: javascript({ jsx: true }),
    ts: javascript({ typescript: true }),
    tsx: javascript({ typescript: true, jsx: true }),
    py: python(),
    html: html(),
    css: css(),
    md: markdown(),
    java: java(),
    cpp: cpp(),
    json: json(),
    php: php(),
    rust: rust(),
    sql: sql(),
    xml: xml(),
    less: less(),
    sass: sass(),
    clojure: clojure(),
    csharp: csharp(),
    // Add more mappings for other languages
};

const getLanguageExtension = (filename: string) => {
    const extension = filename.split('.').pop();
    return languageExtensions[extension || ''] || javascript(); // Default to JavaScript if the language is not supported
};

const CodeEditor = ({
    filename = "example.js",
    content,
    onSave,
    onContentChange,
    editorRef
}: {
    filename?: string,
    content: string,
    onSave: (filename: string, content: string) => void,
    onContentChange?: (content: string) => void,
    editorRef: React.RefObject<ReactCodeMirrorRef>
}) => {
    const [value, setValue] = useState(content);

    useEffect(() => {
        // Check for editorRef.current.view before accessing it
        if (editorRef.current?.view) {
            const currentValue = editorRef.current.view.state.doc.toString();
            if (currentValue !== content) {
                console.log("Content Prop Change Detected, Updating Editor:", content);
                console.log("Current CodeMirror Doc State:", currentValue);

                setValue(content);
                editorRef.current.view.dispatch({
                    changes: { from: 0, to: currentValue.length, insert: content },
                });
            }
        }
    }, [content, editorRef]);

    const handleChange = useCallback((val: string) => {
        setValue(val);
        if (onContentChange) {
            onContentChange(val);
        }
    }, [onContentChange]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault(); // Prevent default save behavior
            onSave(filename, value); // Call the save function with current content
        }
    }, [filename, value, onSave]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    const languageExtension = useMemo(() => getLanguageExtension(filename), [filename]);

    return (
        <div>
            <CodeMirror
                ref={editorRef}
                value={value}
                height="600px"
                extensions={[languageExtension]}
                theme="dark"
                onChange={handleChange}
                style={{
                    lineHeight: '1.6',
                }}
                className='max-w-full text-sm md:text-lg'
            />
            <div className='flex flex-row gap-4 items-center mt-4'>
                <Button onClick={() => onSave(filename, value)} className="mt-4">
                    Save
                </Button>
                <CopyButton editorRef={editorRef} className="mt-4" />
            </div>
        </div>
    );
};

export default CodeEditor;
