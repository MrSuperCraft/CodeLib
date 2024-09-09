import { FaJs, FaPython, FaHtml5, FaCss3Alt, FaFileCode } from 'react-icons/fa';
import { SiTypescript } from 'react-icons/si';
import { IconContext } from 'react-icons';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const getSnippetConfig = (language: string = 'unknown') => { // Default value to avoid undefined
    return {
        className: getSnippetClass(language),
        icon: (
            <IconContext.Provider value={{ className: "mr-2 size-5 md:size-6" }}>
                {getSnippetIcon(language)}
            </IconContext.Provider>
        ),
    };
};

const getSnippetClass = (language: string) => {
    switch (language.toLowerCase()) {
        case 'javascript':
            return 'bg-yellow-300 text-yellow-900';
        case 'python':
            return 'bg-blue-500 text-blue-100';
        case 'html':
            return 'bg-orange-500 text-orange-100';
        case 'css':
            return 'bg-blue-700 text-blue-100';
        case 'typescript':
            return 'bg-blue-600 text-blue-100';
        default:
            return 'bg-gray-300 text-gray-900';
    }
};

const getSnippetIcon = (language: string) => {
    const lang = language.toLowerCase();
    switch (lang) {
        case 'javascript':
            return <FaJs />;
        case 'python':
            return <FaPython />;
        case 'html':
            return <FaHtml5 />;
        case 'css':
            return <FaCss3Alt />;
        case 'typescript':
            return <SiTypescript />;
        default:
            return <FaFileCode />;
    }
};

const SnippetDisplay = ({ name, language = 'unknown', className }: { name: string, language?: string, className?: string }) => {
    const { className: snippetClass, icon } = getSnippetConfig(language);

    return (
        <div className={cn(`${snippetClass} py-4 px-4 md:px-6 mb-3 rounded-lg flex flex-row justify-between items-center hover:-translate-y-1 duration-300 transition-transform shadow-md border-black/10`, className)}>
            <div className="flex items-center">
                {icon}
                <span className="text-sm md:text-base">{name.substring(0, 15).trim().concat('...')}</span>
            </div>
            {/* In future updates -> <Button variant={"default"} size={"sm"} className="whitespace-nowrap">View</Button>*/}
        </div>
    );
};

export default SnippetDisplay;
