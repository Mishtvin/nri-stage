'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showControls?: boolean;
  className?: string;
  disabled?: boolean;
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  showControls = false,
  className,
  disabled = false
}: NumberFieldProps) {
  const handleIncrement = () => {
    const newValue = value + step;
    if (max === undefined || newValue <= max) {
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    const newValue = value - step;
    if (min === undefined || newValue >= min) {
      onChange(newValue);
    }
  };

  const handleInputChange = (inputValue: string) => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      let clampedValue = numValue;
      if (min !== undefined && clampedValue < min) clampedValue = min;
      if (max !== undefined && clampedValue > max) clampedValue = max;
      onChange(clampedValue);
    } else if (inputValue === '') {
      onChange(min || 0);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={label} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <div className="flex items-center space-x-1">
        {showControls && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDecrement}
            disabled={disabled || (min !== undefined && value <= min)}
            className="h-9 w-9 p-0"
          >
            <Minus className="h-3 w-3" />
          </Button>
        )}
        <Input
          id={label}
          type="number"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={cn('text-center', showControls ? 'flex-1' : 'w-full')}
        />
        {showControls && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleIncrement}
            disabled={disabled || (max !== undefined && value >= max)}
            className="h-9 w-9 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}