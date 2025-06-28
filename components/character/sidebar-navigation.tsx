'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  User,
  Zap,
  Target,
  Sword,
  Sparkles,
  Package,
  Star,
  Palette,
  Heart,
  Coins,
  Crown
} from 'lucide-react';

export interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const CHARACTER_TABS: TabConfig[] = [
  { id: 'basic', label: 'Основное', icon: User },
  { id: 'abilities', label: 'Характеристики', icon: Zap },
  { id: 'skills', label: 'Навыки и спасброски', icon: Target },
  { id: 'combat', label: 'Бой', icon: Sword },
  { id: 'spells', label: 'Заклинания', icon: Sparkles },
  { id: 'equipment', label: 'Снаряжение', icon: Package },
  { id: 'traits', label: 'Черты и особенности', icon: Star },
  { id: 'appearance', label: 'Внешность', icon: Palette },
  { id: 'personality', label: 'Личность и история', icon: Heart },
  { id: 'currency', label: 'Деньги', icon: Coins },
  { id: 'mounts', label: 'Питомцы / маунты', icon: Crown }
];

interface SidebarNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function SidebarNavigation({
  activeTab,
  onTabChange,
  className
}: SidebarNavigationProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {CHARACTER_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <Button
            key={tab.id}
            variant={isActive ? 'default' : 'ghost'}
            className={cn(
              'w-full justify-start text-left h-auto py-3 px-3',
              isActive 
                ? 'fantasy-gradient text-white shadow-md' 
                : 'hover:bg-primary/10 text-muted-foreground hover:text-foreground'
            )}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
            <span className="text-sm font-medium">{tab.label}</span>
          </Button>
        );
      })}
    </div>
  );
}