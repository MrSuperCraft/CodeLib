import { cn } from "@/lib/utils";
import React from "react";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(12rem, auto)] lg:auto-rows-[minmax(18rem, auto)] max-w-7xl mx-auto",
                className
            )}
        >
            {children}
        </div>
    );
};



export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
    size = "medium", // Default size is medium
    colSpan,
    rowSpan,
    bottom,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
    size?: "small" | "medium" | "large";
    colSpan?: string;
    rowSpan?: string;
    bottom?: React.ReactNode;
}) => {
    const sizeClasses = {
        small: "p-2 text-sm",
        medium: "p-4 text-base",
        large: "p-6 text-lg",
    };

    return (
        <div
            className={cn(
                `rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none bg-white dark:bg-black border border-black/[0.2] dark:border-white/[0.2] flex flex-col justify-between space-y-4 ${sizeClasses[size]}`,
                colSpan && `col-span-${colSpan}`,
                rowSpan && `row-span-${rowSpan}`,
                className
            )}
        >
            {header}
            <div className="group-hover/bento:translate-x-2 transition duration-200">
                {icon}
                <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
                    {title}
                </div>
                <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
                    {description}
                </div>
            </div>
            {bottom}
        </div>
    );
};
