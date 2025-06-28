'use client';

import { useState } from 'react';
import { AbilitiesColumn } from './layout/abilities-column';
import { CombatStatsPanel } from './layout/combat-stats-panel';
import { TabsPanel } from './layout/tabs-panel';

interface Character {
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
  spells: {
    spellcastingAbility: string;
    spellSaveDC: number;
    spellAttackBonus: number;
    knownSpells: number;
    preparedSpells: number;
    spellSlots: {
      level1: { total: number; used: number };
      level2: { total: number; used: number };
      level3: { total: number; used: number };
      level4: { total: number; used: number };
      level5: { total: number; used: number };
      level6: { total: number; used: number };
      level7: { total: number; used: number };
      level8: { total: number; used: number };
      level9: { total: number; used: number };
    };
    spells: Array<{
      name: string;
      level: number;
      school: string;
      castingTime: string;
      range: string;
      components: string;
      duration: string;
      description: string;
      source: string;
      prepared: boolean;
    }>;
  };
  equipment: {
    items: Array<{
      name: string;
      category: string;
      quantity: number;
      weight: number;
      description: string;
      active: boolean;
    }>;
    carryingCapacity: number;
  };
  traits: Array<{
    name: string;
    source: string;
    description: string;
    type: 'racial' | 'class' | 'feat' | 'background' | 'other';
  }>;
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
  mounts: Array<{
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
  }>;
}

interface CharacterSheetLayoutProps {
  character: Character;
  onChange: (character: Character) => void;
}

export function CharacterSheetLayout({ character, onChange }: CharacterSheetLayoutProps) {
  const [activeTab, setActiveTab] = useState('attacks');

  return (
    <div className="h-full bg-[#181A1F] text-white flex" style={{ minHeight: '600px' }}>
      {/* ЛЕВАЯ КОЛОНКА - СТАТИЧНЫЕ ХАРАКТЕРИСТИКИ И НАВЫКИ (ВСЕГДА ВИДНЫ) */}
      <div className="w-[340px] flex-shrink-0 border-r border-[#23262D] overflow-y-auto">
        <AbilitiesColumn
          character={character}
          onChange={onChange}
        />
      </div>

      {/* ПРАВАЯ ЧАСТЬ - БОЕВЫЕ ПАРАМЕТРЫ + ВКЛАДКИ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Боевые параметры (сверху) */}
        <div className="border-b border-[#23262D] bg-[#1F2128]">
          <CombatStatsPanel
            character={character}
            onChange={onChange}
          />
        </div>

        {/* Вкладки с контентом (снизу) */}
        <div className="flex-1 overflow-hidden">
          <TabsPanel
            character={character}
            onChange={onChange}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>
    </div>
  );
}