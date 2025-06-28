import { Monster } from '../types';

/**
 * Calculate the color class for challenge rating display
 */
export const getChallengeRatingColor = (cr: string): string => {
  const crNum = cr.includes('/') 
    ? parseFloat(cr.split('/')[0]) / parseFloat(cr.split('/')[1]) 
    : parseFloat(cr);
    
  if (crNum < 1) return 'text-green-500';
  if (crNum < 5) return 'text-yellow-500';
  if (crNum < 10) return 'text-orange-500';
  if (crNum < 20) return 'text-red-500';
  return 'text-purple-500';
};

/**
 * Calculate ability score modifier
 */
export const getAbilityModifier = (score: number): string => {
  const modifier = Math.floor((score - 10) / 2);
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
};

/**
 * Get proficiency bonus based on challenge rating
 */
export const getProficiencyBonus = (challengeRating: string): number => {
  const cr = challengeRating.includes('/') 
    ? parseFloat(challengeRating.split('/')[0]) / parseFloat(challengeRating.split('/')[1])
    : parseFloat(challengeRating);
    
  if (cr <= 4) return 2;
  if (cr <= 8) return 3;
  if (cr <= 12) return 4;
  if (cr <= 16) return 5;
  if (cr <= 20) return 6;
  if (cr <= 24) return 7;
  if (cr <= 28) return 8;
  return 9;
};

/**
 * Filter monsters based on search criteria
 */
export const filterMonsters = (
  monsters: Monster[], 
  filters: {
    searchTerm: string;
    system: string;
    type: string;
    challengeRating: string;
    environment?: string;
    size?: string;
  }
): Monster[] => {
  return monsters.filter(monster => {
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch = 
        monster.name.toLowerCase().includes(searchLower) ||
        monster.type.toLowerCase().includes(searchLower) ||
        monster.alignment.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // System filter
    if (filters.system !== 'all' && monster.system !== filters.system) {
      return false;
    }

    // Type filter
    if (filters.type !== 'all' && monster.type !== filters.type) {
      return false;
    }

    // Challenge rating filter
    if (filters.challengeRating !== 'all' && monster.challengeRating !== filters.challengeRating) {
      return false;
    }

    // Environment filter
    if (filters.environment && filters.environment !== 'all') {
      if (!monster.environment.includes(filters.environment)) {
        return false;
      }
    }

    // Size filter
    if (filters.size && filters.size !== 'all' && monster.size !== filters.size) {
      return false;
    }

    return true;
  });
};

/**
 * Sort monsters by various criteria
 */
export const sortMonsters = (
  monsters: Monster[], 
  sortBy: 'name' | 'cr' | 'type' | 'size',
  sortOrder: 'asc' | 'desc' = 'asc'
): Monster[] => {
  return [...monsters].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'cr':
        const crA = a.challengeRating.includes('/') 
          ? parseFloat(a.challengeRating.split('/')[0]) / parseFloat(a.challengeRating.split('/')[1])
          : parseFloat(a.challengeRating);
        const crB = b.challengeRating.includes('/') 
          ? parseFloat(b.challengeRating.split('/')[0]) / parseFloat(b.challengeRating.split('/')[1])
          : parseFloat(b.challengeRating);
        comparison = crA - crB;
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'size':
        const sizeOrder = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
        comparison = sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size);
        break;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });
};