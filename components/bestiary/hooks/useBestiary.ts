'use client';

import { useState, useEffect, useCallback } from 'react';
import { Monster, BestiaryFilters } from '../types';
import { filterMonsters, sortMonsters } from '../utils/monster-utils';

interface UseBestiaryOptions {
  initialFilters?: Partial<BestiaryFilters>;
  autoLoad?: boolean;
}

export const useBestiary = (options: UseBestiaryOptions = {}) => {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [filteredMonsters, setFilteredMonsters] = useState<Monster[]>([]);
  const [filters, setFilters] = useState<BestiaryFilters>({
    searchTerm: '',
    system: 'all',
    type: 'all',
    challengeRating: 'all',
    environment: 'all',
    size: 'all',
    ...options.initialFilters
  });
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'cr' | 'type' | 'size'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Load monsters data
  const loadMonsters = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock data for now - replace with actual API call
      const mockMonsters: Monster[] = [
        {
          id: '1',
          name: 'Древний красный дракон',
          type: 'Dragon',
          size: 'Gargantuan',
          alignment: 'Chaotic Evil',
          challengeRating: '24',
          armorClass: 22,
          hitPoints: '546 (28d20 + 252)',
          speed: '40 ft., climb 40 ft., fly 80 ft.',
          stats: { str: 30, dex: 10, con: 29, int: 18, wis: 15, cha: 23 },
          savingThrows: 'Dex +7, Con +16, Wis +9, Cha +13',
          skills: 'Perception +16, Stealth +7',
          damageImmunities: 'Fire',
          senses: 'Blindsight 60 ft., Darkvision 120 ft., Passive Perception 26',
          languages: 'Common, Draconic',
          abilities: [
            {
              name: 'Legendary Resistance',
              description: 'If the dragon fails a saving throw, it can choose to succeed instead (3/Day).'
            }
          ],
          actions: [
            {
              name: 'Multiattack',
              description: 'The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.'
            }
          ],
          system: 'dnd5e',
          environment: ['Mountain', 'Volcanic'],
          source: 'Monster Manual',
          sourceUrl: 'https://dnd.su/bestiary/1-ancient_red_dragon/',
          imageUrl: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg'
        },
        {
          id: '2',
          name: 'Гоблин',
          type: 'Humanoid',
          size: 'Small',
          alignment: 'Neutral Evil',
          challengeRating: '1/4',
          armorClass: 15,
          hitPoints: '7 (2d6)',
          speed: '30 ft.',
          stats: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
          skills: 'Stealth +6',
          senses: 'Darkvision 60 ft., Passive Perception 9',
          languages: 'Common, Goblin',
          abilities: [
            {
              name: 'Nimble Escape',
              description: 'The goblin can take the Disengage or Hide action as a bonus action on each of its turns.'
            }
          ],
          actions: [
            {
              name: 'Scimitar',
              description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage.'
            }
          ],
          system: 'dnd5e',
          environment: ['Forest', 'Hills', 'Underdark'],
          source: 'Monster Manual',
          sourceUrl: 'https://dnd.su/bestiary/1-goblin/',
          imageUrl: 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg'
        }
      ];
      
      setMonsters(mockMonsters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load monsters');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = filterMonsters(monsters, filters);
    filtered = sortMonsters(filtered, sortBy, sortOrder);
    setFilteredMonsters(filtered);
  }, [monsters, filters, sortBy, sortOrder]);

  // Auto-load on mount if enabled
  useEffect(() => {
    if (options.autoLoad !== false) {
      loadMonsters();
    }
  }, [loadMonsters, options.autoLoad]);

  // Filter update functions
  const updateFilter = useCallback((key: keyof BestiaryFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<BestiaryFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      system: 'all',
      type: 'all',
      challengeRating: 'all',
      environment: 'all',
      size: 'all'
    });
  }, []);

  // Sorting functions
  const updateSort = useCallback((newSortBy: typeof sortBy, newSortOrder?: typeof sortOrder) => {
    setSortBy(newSortBy);
    if (newSortOrder) {
      setSortOrder(newSortOrder);
    } else {
      // Toggle order if same sort field
      setSortOrder(prev => newSortBy === sortBy ? (prev === 'asc' ? 'desc' : 'asc') : 'asc');
    }
  }, [sortBy]);

  return {
    // State
    monsters,
    filteredMonsters,
    filters,
    selectedMonster,
    isLoading,
    error,
    sortBy,
    sortOrder,
    
    // Actions
    loadMonsters,
    setSelectedMonster,
    updateFilter,
    updateFilters,
    clearFilters,
    updateSort,
    
    // Computed
    totalCount: monsters.length,
    filteredCount: filteredMonsters.length
  };
};