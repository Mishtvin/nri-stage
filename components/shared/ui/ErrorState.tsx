'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Универсальный компонент состояния ошибки
 */
export const ErrorState = ({ 
  title = 'Произошла ошибка', 
  message, 
  onRetry, 
  className 
}: ErrorStateProps) => {
  return (
    <div className={cn('text-center py-12', className)}>
      <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
      <h3 className="font-cinzel font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Попробовать снова
        </Button>
      )}
    </div>
  );
};
