export const GAME_SYSTEMS = [
  { value: 'dnd5e', label: 'D&D 5e' },
  { value: 'pathfinder', label: 'Pathfinder' },
  { value: 'dnd35', label: 'D&D 3.5e' },
  { value: 'other', label: 'Другие системы' }
] as const;

export const MONSTER_TYPES = [
  'Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon', 'Elemental',
  'Fey', 'Fiend', 'Giant', 'Humanoid', 'Monstrosity', 'Ooze', 'Plant', 'Undead'
] as const;

export const CREATURE_SIZES = [
  'Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'
] as const;

export const CHALLENGE_RATINGS = [
  '0', '1/8', '1/4', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'
] as const;

export const ENVIRONMENTS = [
  'Arctic', 'Coastal', 'Desert', 'Forest', 'Grassland', 'Hill', 'Mountain',
  'Swamp', 'Underdark', 'Underwater', 'Urban', 'Volcanic'
] as const;