'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DeleteButton } from './delete-button';
import { cn } from '@/lib/utils';

interface ListItemProps {
  value: string;
  onChange: (value: string) => void;
  onDelete: () => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  disabled?: boolean;
}

export function ListItem({
  value,
  onChange,
  onDelete,
  placeholder,
  multiline = false,
  className,
  disabled = false
}: ListItemProps) {
  return (
    <div className={cn('flex items-start space-x-2', className)}>
      {multiline ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={2}
          className="flex-1 resize-none"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1"
        />
      )}
      <DeleteButton onClick={onDelete} disabled={disabled} />
    </div>
  );
}