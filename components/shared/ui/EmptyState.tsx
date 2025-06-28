'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * Универсальный компонент пустого состояния
 */
export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className 
}: EmptyStateProps) => {
  return (
    <div className={cn('text-center py-12', className)}>
      <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
      <h3 className="font-cinzel font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="fantasy-gradient">
          {action.label}
        </Button>
      )}
    </div>
  );
};
