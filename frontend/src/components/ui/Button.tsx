import React from 'react';
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "icon";
}

export const Button = ({ 
  className, 
  variant = "default", 
  size = "default", 
  ...props 
}: ButtonProps) => {
  const variants = {
    default: "bg-white text-black hover:bg-white/90 shadow-sm",
    outline: "border border-white/20 bg-transparent hover:bg-white/10 text-white",
    ghost: "hover:bg-white/10 text-white/70 hover:text-white",
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    icon: "h-10 w-10",
  };

  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50", 
        variants[variant], 
        sizes[size], 
        className
      )}
      {...props}
    />
  );
};