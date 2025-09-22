import { cn } from '@/lib/utils';
import React from 'react'

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    message?: string;
    className?: string;
    showMessage?: boolean;
}

const LoadingSpinner = ({
    size = "md",
    message = "Loading...",
    className,
    showMessage = true,
}: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: "w-4 h-4 border-2",
        md: "w-6 h-6 border-2",
        lg: "w-8 h-8 border-[3px]",
    };

    const containerPaddings = {
        sm: "min-h-[60px]",
        md: "min-h-[80px]",
        lg: "min-h-[100px]",
    };
  return (
    <div
        className={cn(
            "flex flex-col items-center justify-center",
            containerPaddings[size],
            className,
        )}
        role="status"
        aria-label="Loading"
    >
        <div 
            className={cn(
                "border-muted-foreground/20 border-t-primary rounded-full animate-spin",
                sizeClasses[size],
            )}
            role='status'
            aria-label='Loading'
        />
        {showMessage && (
            <p className='mt-3 text-sm text-muted-foreground animate-pulse'>
                {message}
            </p>
        )}
    </div>
  )
}

export default LoadingSpinner 

export function InlineSpinner({
    size = "sm",
    className,
}: {
    size?: "sm" | "md" | "lg";
    className?: string;
}) {
    const sizeClasses = {
        sm: "w-4 h-4 border-2",
        md: "w-5 h-5 border-2",
        lg: "w-6 h-6 border-2",
    };

    return (
        <div 
            className={cn(
                "border-muted-foreground/20 border-t-primary rounded-full animate-spin",
                sizeClasses[size],
                className,
            )}
            role='status'
            aria-label='Loading'
        />
    )
}