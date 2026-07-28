import React from 'react';

/**
 * DineSpotIcon Component
 * Classic Fork & Knife Cutlery Icon for DineSpot
 */
export const DineSpotIcon = ({ className = "h-6 w-6 text-white" }) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        {/* Fork */}
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        {/* Knife */}
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
);

export default DineSpotIcon;
