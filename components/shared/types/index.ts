// Общие типы для всего приложения
export interface User {
  id: string; // Firebase UID
  name: string;
  email: string;
  avatar?: string;
  role: 'player' | 'master' | 'admin';
  createdAt: string;
  updatedAt: string;

  // Optional fields that might be on the admin view
  status?: 'active' | 'inactive' | 'banned';
  campaigns?: number;
  characters?: number;
  lastActive?: string;
  level?: number;
  
  // User settings
  preferences?: {
    theme?: 'dark' | 'light' | 'system';
    language?: 'en' | 'ru';
  };
  notifications?: {
    email?: {
      campaignInvites?: boolean;
      sessionReminders?: boolean;
      newsletters?: boolean;
    }
  }
}

export interface Invitation {
  id: string;
  campaignId: string;
  campaignName: string;
  masterId: string;
  masterName: string;
  inviteeId: string;
  inviteeEmail: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface Trait {
  name: string;
  source: string;
  description: string;
  type: 'racial' | 'class' | 'feat' | 'background' | 'other';
}

export interface Equipment {
  name: string;
  category: string;
  quantity: number;
  weight: number;
  description: string;
  active: boolean;
}

export interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  higherLevels?: string;
  classes: string[];
  system: 'dnd5e' | 'pathfinder' | 'dnd35' | 'other';
  source: string;
  sourceUrl?: string;
  ritual: boolean;
  concentration: boolean;
  prepared?: boolean;
  createdAt?: string;
  updatedAt?: string;
}


export interface SpellSlots {
  level1: { total: number; used: number };
  level2: { total: number; used: number };
  level3: { total: number; used: number };
  level4: { total: number; used: number };
  level5: { total: number; used: number };
  level6: { total: number; used: number };
  level7: { total: number; used: number };
  level8: { total: number; used: number };
  level9: { total: number; used: number };
}

export interface Mount {
  name: string;
  type: string;
  size: string;
  armorClass: number;
  hitPoints: { current: number; max: number };
  speed: number;
  stats: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  abilities: string[];
  description: string;
}

export interface Character {
  id: string;
  name: string;
  playerName: string;
  campaign: string;
  source: string;
  classes: Array<{ name: string; level: number; subclass?: string }>;
  totalLevel: number;
  experience: number;
  race: string;
  subrace?: string;
  background: string;
  alignment: string;
  deity?: string;
  plane?: string;
  inspiration: number;
  exhaustion: number;
  conditions: string[];
  status?: 'active' | 'inactive' | 'deceased';
  stats: {
    str: { base: number; modifier: number; temp: number };
    dex: { base: number; modifier: number; temp: number };
    con: { base: number; modifier: number; temp: number };
    int: { base: number; modifier: number; temp: number };
    wis: { base: number; modifier: number; temp: number };
    cha: { base: number; modifier: number; temp: number };
  };
  proficiencyBonus: number;
  savingThrows: {
    str: { proficient: boolean };
    dex: { proficient: boolean };
    con: { proficient: boolean };
    int: { proficient: boolean };
    wis: { proficient: boolean };
    cha: { proficient: boolean };
  };
  skills: {
    acrobatics: { proficient: boolean; expertise: boolean };
    animalHandling: { proficient: boolean; expertise: boolean };
    arcana: { proficient: boolean; expertise: boolean };
    athletics: { proficient: boolean; expertise: boolean };
    deception: { proficient: boolean; expertise: boolean };
    history: { proficient: boolean; expertise: boolean };
    insight: { proficient: boolean; expertise: boolean };
    intimidation: { proficient: boolean; expertise: boolean };
    investigation: { proficient: boolean; expertise: boolean };
    medicine: { proficient: boolean; expertise: boolean };
    nature: { proficient: boolean; expertise: boolean };
    perception: { proficient: boolean; expertise: boolean };
    performance: { proficient: boolean; expertise: boolean };
    persuasion: { proficient: boolean; expertise: boolean };
    religion: { proficient: boolean; expertise: boolean };
    sleightOfHand: { proficient: boolean; expertise: boolean };
    stealth: { proficient: boolean; expertise: boolean };
    survival: { proficient: boolean; expertise: boolean };
  };
  combat: {
    armorClass: number;
    initiative: number;
    speed: { walk: number; fly: number; swim: number; climb: number; burrow: number };
    hitPoints: { current: number; max: number; temp: number };
    hitDice: { total: string; used: number };
    deathSaves: { successes: number; failures: number };
    attacks: Array<{
      name: string;
      type: 'melee' | 'ranged' | 'spell';
      attackBonus: number;
      damage: string;
      damageType: string;
      notes: string;
    }>;
  };
  spellcasting?: {
    spellcastingAbility: string;
    spellSaveDC: number;
    spellAttackBonus: number;
    knownSpells: number;
    preparedSpells: number;
    spellSlots: SpellSlots;
    spells: Spell[];
  };
  equipment: {
    items: Equipment[];
    carryingCapacity: number;
  };
  traits: Trait[];
  appearance: {
    gender: string;
    age: number;
    height: string;
    weight: string;
    eyeColor: string;
    skinColor: string;
    hairColor: string;
    appearance: string;
    avatar?: string;
    additionalImages: string[];
  };
  personality: {
    traits: string[];
    ideals: string[];
    bonds: string[];
    flaws: string[];
    backstory: string;
    notes: string;
  };
  currency: {
    cp: number;
    sp: number;
    ep: number;
    gp: number;
    pp: number;
  };
  mounts?: Mount[];
  createdAt: string;
  updatedAt: string;
}

export interface CampaignPlayer {
  id: string;
  name: string;
  avatar?: string;
  joinedAt: string;
}

export interface CampaignSession {
  id: string;
  date: string;
  duration: number;
  notes: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  system: 'dnd5e' | 'pathfinder' | 'dnd35' | 'other';
  status: 'planning' | 'active' | 'paused' | 'completed';
  masterId: string;
  maxPlayers: number;
  currentLevel: string;
  setting?: string;
  masterNotes?: string;
  nextSession?: {
    date: string;
    time: string;
    location: string;
  };
  players: CampaignPlayer[];
  sessions: CampaignSession[];
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'consumable' | 'tool' | 'treasure';
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary' | 'artifact';
  description: string;
  properties: string[];
  value: number;
  weight: number;
  source: string;
  sourceUrl?: string;
  campaign: string;
  isAvailable: boolean;
  createdAt: string;
  addedBy: string;
  updatedAt?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  genre: 'fantasy' | 'horror' | 'mystery' | 'adventure' | 'political' | 'exploration';
  setting: 'urban' | 'wilderness' | 'dungeon' | 'planar' | 'underwater' | 'aerial';
  difficulty: 'easy' | 'medium' | 'hard' | 'deadly';
  level: string;
  duration: string;
  objectives: string[];
  rewards: string[];
  npcs: string[];
  locations: string[];
  hooks: string[];
  complications: string[];
  campaign: string;
  status: 'draft' | 'active' | 'completed';
  generatedBy: 'manual' | 'ai';
  imageUrl?: string;
  createdAt: string;
}

export interface MapLocation {
  id: string;
  name: string;
  type: 'campaign' | 'quest' | 'location' | 'city' | 'dungeon' | 'landmark';
  x: number;
  y: number;
  campaign?: string;
  description: string;
  status: 'active' | 'completed' | 'locked' | 'discovered';
  level?: string;
  connectedTo: string[];
}

export interface Condition {
  id: string;
  name: string;
  description: string;
  system: 'dnd5e' | 'pathfinder' | 'dnd35' | 'other';
  source: string;
  sourceUrl?: string;
}

export interface RuleCategory {
  id: string;
  name: string;
  description: string;
  system: 'dnd5e' | 'pathfinder' | 'dnd35' | 'other';
  imageUrl?: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  system: 'dnd5e' | 'pathfinder' | 'dnd35' | 'other';
  source: string;
  sourceUrl?: string;
}

export interface Background {
  id: string;
  name: string;
  description: string;
  system: 'dnd5e' | 'pathfinder' | 'dnd35' | 'other';
  source: string;
  sourceUrl?: string;
  skillProficiencies: string;
  toolProficiencies: string;
  equipment: string;
  startingGold: number;
}

export interface ClassFeature {
  id: string;
  name: string;
  description: string;
  className: string;
  level: number;
  source: string;
  sourceUrl?: string;
  system: 'dnd5e' | 'pathfinder' | 'dnd35' | 'other';
}

export interface Feat {
  id: string;
  name: string;
  description: string;
  prerequisite: string;
  system: 'dnd5e' | 'pathfinder' | 'dnd35' | 'other';
  source: string;
  sourceUrl?: string;
}

// Общие интерфейсы для UI компонентов
export interface FilterState {
  searchTerm: string;
  [key: string]: string | number | boolean;
}

export interface SortState {
  field: string;
  order: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}
