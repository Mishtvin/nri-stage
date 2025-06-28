
import { Sword, Shield, Gem, Package, Sparkles, Crown } from 'lucide-react';

export const ITEM_TYPES = [
  { value: 'weapon', label: 'Оружие', icon: Sword },
  { value: 'armor', label: 'Броня', icon: Shield },
  { value: 'accessory', label: 'Аксессуар', icon: Crown },
  { value: 'consumable', label: 'Расходник', icon: Sparkles },
  { value: 'tool', label: 'Инструмент', icon: Package },
  { value: 'treasure', label: 'Сокровище', icon: Gem }
] as const;

export const ITEM_RARITIES = [
  { value: 'common', label: 'Обычный', color: 'text-gray-400' },
  { value: 'uncommon', label: 'Необычный', color: 'text-green-400' },
  { value: 'rare', label: 'Редкий', color: 'text-blue-400' },
  { value: 'very_rare', label: 'Очень редкий', color: 'text-purple-400' },
  { value: 'legendary', label: 'Легендарный', color: 'text-orange-400' },
  { value: 'artifact', label: 'Артефакт', color: 'text-red-400' }
] as const;
