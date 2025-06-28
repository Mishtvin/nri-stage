'use client';

import { useState } from 'react';
import { Skull } from 'lucide-react';
import { useBestiary } from './hooks/useBestiary';
import { MonsterFilters } from './components/MonsterFilters';
import { MonsterGrid } from './components/MonsterGrid';
import { MonsterDetailDialog } from './components/MonsterDetailDialog';

interface BestiaryContainerProps {
  className?: string;
}

/**
 * BestiaryContainer - Main container component for the bestiary section
 * Manages state and coordinates between filter, grid, and detail components
 */
export const BestiaryContainer = ({ className }: BestiaryContainerProps) => {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  const {
    filteredMonsters,
    filters,
    selectedMonster,
    isLoading,
    error,
    sortBy,
    sortOrder,
    totalCount,
    filteredCount,
    setSelectedMonster,
    updateFilter,
    clearFilters,
    updateSort
  } = useBestiary({ autoLoad: true });

  const handleMonsterClick = (monster: any) => {
    setSelectedMonster(monster);
    setIsDetailDialogOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailDialogOpen(false);
    setSelectedMonster(null);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <Skull className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="font-cinzel font-semibold text-lg mb-2">Ошибка загрузки</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Skull className="h-8 w-8 text-primary" />
          <h1 className="text-4xl md:text-5xl font-cinzel font-bold">
            <span className="fantasy-text-gradient">Бестиарий</span>
          </h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Исследуйте мир монстров и существ различных игровых систем
        </p>
      </div>

      {/* Filters */}
      <MonsterFilters
        filters={filters}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={updateSort}
        resultCount={filteredCount}
        totalCount={totalCount}
      />

      {/* Monster Grid */}
      <MonsterGrid
        monsters={filteredMonsters}
        onMonsterClick={handleMonsterClick}
        isLoading={isLoading}
      />

      {/* Detail Dialog */}
      <MonsterDetailDialog
        monster={selectedMonster}
        isOpen={isDetailDialogOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
};