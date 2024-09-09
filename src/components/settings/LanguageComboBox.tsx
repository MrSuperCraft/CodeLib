'use client';

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRouter, usePathname, Locale } from '@/i18n/routing'; // Adjust import if necessary

const languages = [
    { label: "English", value: "en" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
    { label: "Spanish", value: "es" },
    { label: "Portuguese", value: "pt" },
    { label: "Russian", value: "ru" },
    { label: "Japanese", value: "ja" },
    { label: "Korean", value: "ko" },
    { label: "Chinese", value: "zh" },
] as const;

type Language = (typeof languages)[number]; // Extract type from languages array
type LanguageComboboxProps = {
    currentLanguage: string;
    onLanguageChange: (language: string) => void;
};

export function LanguageCombobox({
    currentLanguage,
    onLanguageChange,
}: LanguageComboboxProps) {
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(currentLanguage);
    const router = useRouter();
    const pathname = usePathname(); // Get the current path

    const handleSelect = (value: string) => {
        const locale = value as Locale; // Ensure value is of type Locale
        setSelectedLanguage(value);
        onLanguageChange(value);
        // Redirect to apply locale change
        router.replace(pathname, { locale }); // Update URL with locale
    };

    return (
        <div className="w-full">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            "w-full justify-between",
                            !selectedLanguage && "text-muted-foreground"
                        )}
                    >
                        {selectedLanguage
                            ? languages.find((lang) => lang.value === selectedLanguage)?.label
                            : "Select language"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search language..." />
                        <CommandList>
                            <CommandEmpty>No language found.</CommandEmpty>
                            <CommandGroup>
                                {languages.map((language) => (
                                    <CommandItem
                                        value={language.label}
                                        key={language.value}
                                        onSelect={() => handleSelect(language.value)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                language.value === selectedLanguage
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {language.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
