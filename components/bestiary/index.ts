// Main exports for the bestiary module
export { BestiaryContainer } from './BestiaryContainer';
export { MonsterCard } from './components/MonsterCard';
export { MonsterFilters } from './components/MonsterFilters';
export { MonsterGrid } from './components/MonsterGrid';
export { MonsterDetailDialog } from './components/MonsterDetailDialog';
export { useBestiary } from './hooks/useBestiary';

// Types
export type { Monster, BestiaryFilters, BestiaryState } from './types';

// Constants
export { 
  GAME_SYSTEMS, 
  MONSTER_TYPES, 
  CREATURE_SIZES, 
  CHALLENGE_RATINGS, 
  ENVIRONMENTS 
} from './constants';

// Utils
export { 
  getChallengeRatingColor, 
  getAbilityModifier, 
  getProficiencyBonus,
  filterMonsters,
  sortMonsters
} from './utils/monster-utils';