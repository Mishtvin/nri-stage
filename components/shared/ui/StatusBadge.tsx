'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  colorMap?: Record<string, string>;
  className?: string;
}

/**
 * Универсальный компонент для отображения статусов
 */
export const StatusBadge = ({ 
  status, 
  variant = 'default', 
  colorMap,
  className 
}: StatusBadgeProps) => {
  const colorClass = colorMap?.[status];

  return (
    <Badge 
      variant={variant} 
      className={cn(colorClass, className)}
    >
      {status}
    </Badge>
  );
};
