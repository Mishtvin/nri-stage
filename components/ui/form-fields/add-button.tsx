'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddButtonProps {
  onClick: () => void;
  label: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  disabled?: boolean;
}

export function AddButton({
  onClick,
  label,
  size = 'default',
  variant = 'outline',
  className,
  disabled = false
}: AddButtonProps) {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'border-primary/50 hover:bg-primary/10 text-primary hover:text-primary',
        className
      )}
    >
      <Plus className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
}