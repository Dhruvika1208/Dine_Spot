import React from 'react';

export const Skeleton = ({ className = '', variant = 'text', width, height }) => {
    const baseStyle = "bg-slate-200 dark:bg-slate-800 animate-pulse";
    
    let variantStyle = "";
    if (variant === 'circle') {
        variantStyle = "rounded-full";
    } else if (variant === 'rect') {
        variantStyle = "rounded-3xl";
    } else {
        // text
        variantStyle = "rounded-lg h-4 w-full";
    }

    const inlineStyle = {
        width: width || undefined,
        height: height || undefined
    };

    return (
        <div 
            className={`${baseStyle} ${variantStyle} ${className}`} 
            style={inlineStyle}
        />
    );
};

export const RestaurantCardSkeleton = () => (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-5 border border-slate-100 dark:border-slate-800/80 flex flex-col h-full space-y-5">
        <Skeleton variant="rect" className="h-52 w-full rounded-[2rem]" />
        <div className="px-2 space-y-4 flex-grow flex flex-col">
            <div className="space-y-2">
                <Skeleton variant="text" width="40%" className="h-3" />
                <Skeleton variant="text" width="80%" className="h-6" />
            </div>
            <Skeleton variant="text" width="60%" className="h-3.5" />
            <div className="space-y-2">
                <Skeleton variant="text" width="100%" className="h-3" />
                <Skeleton variant="text" width="90%" className="h-3" />
            </div>
            <div className="pt-6 mt-auto">
                <Skeleton variant="rect" className="h-12 w-full rounded-xl" />
            </div>
        </div>
    </div>
);

export const DashboardStatsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between h-48">
                <div className="flex justify-between items-start">
                    <Skeleton variant="circle" className="h-12 w-12" />
                    <Skeleton variant="rect" className="h-6 w-16 rounded-xl" />
                </div>
                <div className="space-y-3 mt-6">
                    <Skeleton variant="text" width="30%" className="h-3" />
                    <Skeleton variant="text" width="60%" className="h-8" />
                </div>
            </div>
        ))}
    </div>
);
