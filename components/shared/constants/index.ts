import { Play, Pause, CheckCircle, Clock } from 'lucide-react';

export const GAME_SYSTEMS = [
  { value: 'dnd5e', label: 'D&D 5e' },
  { value: 'pathfinder', label: 'Pathfinder' },
  { value: 'dnd35', label: 'D&D 3.5e' },
  { value: 'other', label: 'Другие системы' }
] as const;

export const ALIGNMENTS = [
  { value: 'LG', label: 'Законно-добрый' },
  { value: 'NG', label: 'Нейтрально-добрый' },
  { value: 'CG', label: 'Хаотично-добрый' },
  { value: 'LN', label: 'Законно-нейтральный' },
  { value: 'TN', label: 'Истинно нейтральный' },
  { value: 'CN', label: 'Хаотично-нейтральный' },
  { value: 'LE', label: 'Законно-злой' },
  { value: 'NE', label: 'Нейтрально-злой' },
  { value: 'CE', label: 'Хаотично-злой' }
] as const;

export const CHARACTER_CLASSES = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
  'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
] as const;

export const RACES = [
  { value: 'Human', label: 'Человек' },
  { value: 'Elf', label: 'Эльф' },
  { value: 'Dwarf', label: 'Дварф' },
  { value: 'Halfling', label: 'Полурослик' },
  { value: 'Dragonborn', label: 'Драконорождённый' },
  { value: 'Gnome', label: 'Гном' },
  { value: 'Half-Elf', label: 'Полуэльф' },
  { value: 'Half-Orc', label: 'Полуорк' },
  { value: 'Tiefling', label: 'Тифлинг' }
] as const;

export const CAMPAIGN_STATUSES = [
  { value: 'planning', label: 'Планирование', color: 'bg-blue-500/10 text-blue-500', icon: Clock },
  { value: 'active', label: 'Активная', color: 'bg-green-500/10 text-green-500', icon: Play },
  { value: 'paused', label: 'Приостановлена', color: 'bg-yellow-500/10 text-yellow-500', icon: Pause },
  { value: 'completed', label: 'Завершена', color: 'bg-gray-500/10 text-gray-500', icon: CheckCircle }
] as const;

export const QUEST_DIFFICULTIES = [
  { value: 'easy', label: 'Лёгкий', color: 'text-green-500' },
  { value: 'medium', label: 'Средний', color: 'text-yellow-500' },
  { value: 'hard', label: 'Сложный', color: 'text-orange-500' },
  { value: 'deadly', label: 'Смертельный', color: 'text-red-500' }
] as const;

export const ITEM_RARITIES = [
  { value: 'common', label: 'Обычный', color: 'text-gray-500' },
  { value: 'uncommon', label: 'Необычный', color: 'text-green-500' },
  { value: 'rare', label: 'Редкий', color: 'text-blue-500' },
  { value: 'very_rare', label: 'Очень редкий', color: 'text-purple-500' },
  { value: 'legendary', label: 'Легендарный', color: 'text-orange-500' },
  { value: 'artifact', label: 'Артефакт', color: 'text-red-500' }
] as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500
} as const;
