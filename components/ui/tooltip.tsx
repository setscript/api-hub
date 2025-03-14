"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const Tooltip: React.FC<TooltipProps> = ({ children, content, className }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          className={cn(
            "absolute z-50 p-2 bg-popover text-popover-foreground text-sm rounded shadow-lg border border-border",
            "top-full left-1/2 transform -translate-x-1/2 mt-1",
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};

const TooltipTrigger: React.FC<{ 
  children: React.ReactNode; 
  asChild?: boolean;
  className?: string;
}> = ({ children, className }) => {
  return (
    <span className={cn("cursor-default", className)}>
      {children}
    </span>
  );
};

const TooltipContent: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn("max-w-xs", className)}>
      {children}
    </div>
  );
};

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } 