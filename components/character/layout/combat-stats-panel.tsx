'use client';

import { NumberField } from '@/components/ui/form-fields/number-field';
import { Badge } from '@/components/ui/badge';
import { Shield, Coins, Clock } from 'lucide-react';

interface Character {
  combat: {
    armorClass: number;
    initiative: number;
    speed: { walk: number; fly: number; swim: number; climb: number; burrow: number };
    hitPoints: { current: number; max: number; temp: number };
    hitDice: { total: string; used: number };
    deathSaves: { successes: number; failures: number };
  };
  inspiration: number;
  exhaustion: number;
  conditions: string[];
  currency: {
    cp: number;
    sp: number;
    ep: number;
    gp: number;
    pp: number;
  };
  proficiencyBonus: number;
}

interface CombatStatsPanelProps {
  character: Character;
  onChange: (character: Character) => void;
}

export function CombatStatsPanel({ character, onChange }: CombatStatsPanelProps) {
  const updateCombat = (field: string, value: any) => {
    const newCharacter = { ...character };
    (newCharacter.combat as any)[field] = value;
    onChange(newCharacter);
  };

  const updateNestedCombat = (parent: string, field: string, value: any) => {
    const newCharacter = { ...character };
    (newCharacter.combat as any)[parent][field] = value;
    onChange(newCharacter);
  };

  const updateField = (field: string, value: any) => {
    const newCharacter = { ...character };
    (newCharacter as any)[field] = value;
    onChange(newCharacter);
  };

  const getTotalGold = (): number => {
    return character.currency.pp * 10 + character.currency.gp + character.currency.ep * 0.5 + 
           character.currency.sp * 0.1 + character.currency.cp * 0.01;
  };

  return (
    <div className="p-2">
      {/* Верхняя строка - AC, Скорость, Владение, Золото */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-4">
          {/* AC */}
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-white" />
            <div className="text-center">
              <div className="text-xl font-bold text-white">{character.combat.armorClass}</div>
            </div>
          </div>
          
          {/* Скорость */}
          <div className="text-center">
            <div className="text-xs text-gray-400">СКОРОСТЬ</div>
            <div className="text-sm font-bold text-white">{character.combat.speed.walk}</div>
          </div>
          
          {/* Владение */}
          <div className="text-center">
            <div className="text-xs text-gray-400">ВЛАДЕНИЕ</div>
            <div className="text-sm font-bold text-white">+{character.proficiencyBonus}</div>
          </div>
        </div>
        
        {/* Золото */}
        <div className="flex items-center space-x-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          <div className="text-lg font-bold text-yellow-500">{Math.round(getTotalGold())}</div>
        </div>
      </div>

      {/* Вторая строка - Инициатива, Вдохновение, Истощение, Состояния */}
      <div className="grid grid-cols-4 gap-2 mb-2">
        <div className="bg-[#23262D] rounded p-2 text-center">
          <div className="text-xs text-gray-400 mb-1">ИНИЦИАТИВА</div>
          <div className="text-lg font-bold text-white">
            {character.combat.initiative >= 0 ? '+' : ''}{character.combat.initiative}
          </div>
        </div>
        
        <div className="bg-[#23262D] rounded p-2 text-center">
          <div className="text-xs text-gray-400 mb-1">ВДОХНОВЕНИЕ</div>
          <div className="text-lg font-bold text-white">{character.inspiration}</div>
        </div>
        
        <div className="bg-[#23262D] rounded p-2 text-center">
          <div className="text-xs text-gray-400 mb-1">ИСТОЩЕНИЕ</div>
          <div className="text-lg font-bold text-white">{character.exhaustion}</div>
        </div>
        
        <div className="bg-[#23262D] rounded p-2 text-center">
          <div className="text-xs text-gray-400 mb-1">СОСТОЯНИЯ</div>
          <div className="text-sm text-white">—</div>
        </div>
      </div>

      {/* HP с прогресс-баром */}
      <div className="bg-[#23262D] rounded p-2 mb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs text-gray-400">ХИТЫ</div>
          <div className="text-sm font-bold text-white">
            {character.combat.hitPoints.current}/{character.combat.hitPoints.max}
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${(character.combat.hitPoints.current / character.combat.hitPoints.max) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}