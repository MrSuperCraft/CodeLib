import React from 'react';

// Utility function to highlight parts of the text
const Highlight = ({ text, searchTerm }: { text: string; searchTerm?: string }) => {
    if (!searchTerm?.trim()) return <>{text}</>;

    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return (
        <>
            {parts.map((part, index) =>
                part.toLowerCase() === searchTerm.toLowerCase() ? (
                    <span key={index} className="bg-yellow-300">{part}</span>
                ) : (
                    part
                )
            )}
        </>
    );
};

export default Highlight;
