'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { SearchInput } from '@/components/shared/ui/SearchInput';
import { CampaignFilters } from '../types';
import { GAME_SYSTEMS, CAMPAIGN_STATUSES } from '@/components/shared/constants';

interface CampaignFiltersProps {
  filters: CampaignFilters;
  onFilterChange: (key: keyof CampaignFilters, value: string) => void;
  onClearFilters: () => void;
  resultCount: number;
  totalCount: number;
  className?: string;
}

export const CampaignFiltersComponent = ({
  filters,
  onFilterChange,
  onClearFilters,
  resultCount,
  totalCount,
  className
}: CampaignFiltersProps) => {
  const hasActiveFilters = Object.values(filters).some(value => value !== 'all' && value !== '');

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4">
        <SearchInput
          value={filters.searchTerm}
          onChange={(value) => onFilterChange('searchTerm', value)}
          placeholder="Поиск кампаний..."
          className="flex-1"
        />
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Показано {resultCount} из {totalCount}</span>
          {hasActiveFilters && (
            <Button
              variant="ghost" size="sm" onClick={onClearFilters}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Очистить
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center space-x-1">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Фильтры:</span>
        </div>

        <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            {CAMPAIGN_STATUSES.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
      </div>
    </div>
  );
};
