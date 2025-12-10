'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

export function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  const sizeClass = sizeClasses[size];

  if (!src) {
    return (
      <div
        className={cn(
          sizeClass,
          'rounded-full bg-gradient-to-br from-gold-primary to-gold-secondary flex items-center justify-center text-leather-dark font-semibold',
          className
        )}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className={cn('relative rounded-full overflow-hidden', sizeClass, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={size === 'sm' ? '32px' : size === 'md' ? '48px' : '64px'}
      />
    </div>
  );
}
