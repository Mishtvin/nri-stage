'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeleteButtonProps {
  onClick: () => void;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function DeleteButton({
  onClick,
  size = 'sm',
  className,
  disabled = false
}: DeleteButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0',
        size === 'sm' ? 'h-9 w-9 p-0' : '',
        className
      )}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}