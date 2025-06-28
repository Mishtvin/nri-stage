export interface Monster {
  id: string;
  name: string;
  type: string;
  size: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan';
  alignment: string;
  challengeRating: string;
  armorClass: number;
  hitPoints: string;
  speed: string;
  stats: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  savingThrows?: string;
  skills?: string;
  damageResistances?: string;
  damageImmunities?: string;
  conditionImmunities?: string;
  senses: string;
  languages: string;
  abilities: Array<{
    name: string;
    description: string;
  }>;
  actions: Array<{
    name: string;
    description: string;
  }>;
  legendaryActions?: Array<{
    name: string;
    description: string;
  }>;
  system: 'dnd5e' | 'pathfinder' | 'dnd35' | 'other';
  environment: string[];
  source: string;
  sourceUrl?: string;
  imageUrl?: string;
}

export interface BestiaryFilters {
  searchTerm: string;
  system: string;
  type: string;
  challengeRating: string;
  environment?: string;
  size?: string;
}

export interface BestiaryState {
  monsters: Monster[];
  filteredMonsters: Monster[];
  filters: BestiaryFilters;
  selectedMonster: Monster | null;
  isLoading: boolean;
  error: string | null;
}