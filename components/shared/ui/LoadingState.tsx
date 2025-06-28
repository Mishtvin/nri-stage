'use client';

import { LoadingSpinner } from '@/components/loading-spinner';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

/**
 * Универсальный компонент состояния загрузки
 */
export const LoadingState = ({ size = 'md', text, className }: LoadingStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <LoadingSpinner size={size} />
      {text && (
        <p className="mt-4 text-muted-foreground text-center">{text}</p>
      )}
    </div>
  );
};
