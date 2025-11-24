import React from 'react';
import { cn } from "../../lib/utils";

export const Logo = ({ className, size = 32 }: { className?: string; size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-white", className)}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" /> {/* Blue-400 */}
          <stop offset="1" stopColor="#A78BFA" /> {/* Purple-400 */}
        </linearGradient>
        <filter id="glow" x="-4" y="-4" width="40" height="40" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Document Outline */}
      <path 
        d="M6 4C6 2.89543 6.89543 2 8 2H20L28 10V28C28 29.1046 27.1046 30 26 30H8C6.89543 30 6 29.1046 6 28V4Z" 
        stroke="url(#logo-gradient)" 
        strokeWidth="2" 
        fill="rgba(255,255,255,0.05)"
      />
      
      {/* Folded Corner */}
      <path 
        d="M20 2V10H28" 
        stroke="url(#logo-gradient)" 
        strokeWidth="2" 
        strokeLinejoin="round"
      />
      
      {/* Digital Data Nodes (The "Intelligence" part) */}
      <circle cx="13" cy="14" r="2" fill="white" filter="url(#glow)" />
      <circle cx="21" cy="18" r="2" fill="#60A5FA" filter="url(#glow)" />
      <circle cx="13" cy="22" r="2" fill="#A78BFA" filter="url(#glow)" />
      
      {/* Connection Lines */}
      <path 
        d="M13 14L21 18L13 22" 
        stroke="white" 
        strokeWidth="1.5" 
        strokeOpacity="0.5" 
      />
    </svg>
  );
};