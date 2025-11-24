import React from 'react';
import { cn } from "../../lib/utils";

export const GlassCard = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string 
}) => (
  <div className={cn(
    "backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl relative overflow-hidden",
    className
  )}>
    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    {children}
  </div>
);