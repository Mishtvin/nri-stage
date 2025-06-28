'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X, SortAsc, SortDesc } from 'lucide-react';
import { BestiaryFilters } from '../types';
import { GAME_SYSTEMS, MONSTER_TYPES, CHALLENGE_RATINGS, ENVIRONMENTS, CREATURE_SIZES } from '../constants';

interface MonsterFiltersProps {
  filters: BestiaryFilters;
  onFilterChange: (key: keyof BestiaryFilters, value: string) => void;
  onClearFilters: () => void;
  sortBy: 'name' | 'cr' | 'type' | 'size';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'name' | 'cr' | 'type' | 'size', sortOrder?: 'asc' | 'desc') => void;
  resultCount: number;
  totalCount: number;
  className?: string;
}

/**
 * MonsterFilters - Filter and sort controls for the bestiary
 */
export const MonsterFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  sortBy,
  sortOrder,
  onSortChange,
  resultCount,
  totalCount,
  className
}: MonsterFiltersProps) => {
  const hasActiveFilters = Object.values(filters).some(value => value !== 'all' && value !== '');

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Results */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск монстров..."
              value={filters.searchTerm}
              onChange={(e) => onFilterChange('searchTerm', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Показано {resultCount} из {totalCount}</span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Очистить
            </Button>
          )}
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center space-x-1">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Фильтры:</span>
        </div>

        <Select value={filters.system} onValueChange={(value) => onFilterChange('system', value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Система" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все системы</SelectItem>
            {GAME_SYSTEMS.map(system => (
              <SelectItem key={system.value} value={system.value}>
                {system.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.type} onValueChange={(value) => onFilterChange('type', value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Тип" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            {MONSTER_TYPES.map(type => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.size || 'all'} onValueChange={(value) => onFilterChange('size', value)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Размер" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все размеры</SelectItem>
            {CREATURE_SIZES.map(size => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.challengeRating} onValueChange={(value) => onFilterChange('challengeRating', value)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="CR" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все CR</SelectItem>
            {CHALLENGE_RATINGS.map(cr => (
              <SelectItem key={cr} value={cr}>
                CR {cr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.environment || 'all'} onValueChange={(value) => onFilterChange('environment', value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Среда" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все среды</SelectItem>
            {ENVIRONMENTS.map(env => (
              <SelectItem key={env} value={env}>
                {env}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">Сортировка:</span>
        
        <div className="flex items-center space-x-1">
          <Button
            variant={sortBy === 'name' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSortChange('name')}
            className="h-8"
          >
            Имя
          </Button>
          <Button
            variant={sortBy === 'cr' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSortChange('cr')}
            className="h-8"
          >
            CR
          </Button>
          <Button
            variant={sortBy === 'type' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSortChange('type')}
            className="h-8"
          >
            Тип
          </Button>
          <Button
            variant={sortBy === 'size' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSortChange('size')}
            className="h-8"
          >
            Размер
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
          className="h-8 px-2"
        >
          {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};