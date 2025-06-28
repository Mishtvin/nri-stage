'use client';

import { Monster } from '../types';
import { MonsterCard } from './MonsterCard';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Skull } from 'lucide-react';

interface MonsterGridProps {
  monsters: Monster[];
  onMonsterClick?: (monster: Monster) => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * MonsterGrid - Grid layout for displaying monster cards
 */
export const MonsterGrid = ({ 
  monsters, 
  onMonsterClick, 
  isLoading = false,
  className 
}: MonsterGridProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (monsters.length === 0) {
    return (
      <div className="text-center py-12">
        <Skull className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-cinzel font-semibold text-lg mb-2">Монстры не найдены</h3>
        <p className="text-muted-foreground">
          Попробуйте изменить фильтры поиска
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {monsters.map((monster) => (
        <MonsterCard
          key={monster.id}
          monster={monster}
          onClick={onMonsterClick}
        />
      ))}
    </div>
  );
};