import * as React from 'react';
import { cn } from '@/lib/utils';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="floating-label-group">
        <input
          id={inputId}
          ref={ref}
          placeholder=" "
          className={cn(
            'peer w-full px-3 py-3 pt-5 bg-background border border-input rounded-lg text-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
            'transition-all duration-200',
            error && 'border-destructive focus:ring-destructive',
            className
          )}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            'floating-label peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-primary',
            'peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75',
            error && 'text-destructive'
          )}
        >
          {label}
        </label>
        {error && (
          <p className="mt-1 text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';

interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const FloatingTextarea = React.forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="floating-label-group">
        <textarea
          id={textareaId}
          ref={ref}
          placeholder=" "
          className={cn(
            'peer w-full px-3 py-3 pt-5 bg-background border border-input rounded-lg text-foreground resize-none',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
            'transition-all duration-200 min-h-[120px]',
            error && 'border-destructive focus:ring-destructive',
            className
          )}
          {...props}
        />
        <label
          htmlFor={textareaId}
          className={cn(
            'floating-label peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-primary',
            'peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75',
            error && 'text-destructive'
          )}
        >
          {label}
        </label>
        {error && (
          <p className="mt-1 text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

FloatingTextarea.displayName = 'FloatingTextarea';
