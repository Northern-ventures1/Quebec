'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GoldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variantClasses = {
  primary: 'bg-gold-primary text-leather-dark hover:bg-gold-secondary',
  secondary: 'bg-leather-primary text-gold-primary hover:bg-leather-dark',
  outline: 'border-2 border-gold-primary text-gold-primary hover:bg-gold-primary hover:text-leather-dark',
};

const sizeClasses = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function GoldButton({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className,
  disabled,
  ...props
}: GoldButtonProps) {
  return (
    <button
      className={cn(
        'font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? '...' : children}
    </button>
  );
}
