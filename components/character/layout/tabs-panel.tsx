'use client';

import { AttacksTab } from './tabs/attacks-tab';
import { AbilitiesTab } from './tabs/abilities-tab';
import { EquipmentTab } from './tabs/equipment-tab';
import { PersonalityTab } from './tabs/personality-tab';
import { GoalsTab } from './tabs/goals-tab';
import { NotesTab } from './tabs/notes-tab';
import { SpellsTab } from './tabs/spells-tab';

interface Character {
  combat: {
    attacks: Array<{
      name: string;
      type: 'melee' | 'ranged' | 'spell';
      attackBonus: number;
      damage: string;
      damageType: string;
      notes: string;
    }>;
  };
  traits: Array<{
    name: string;
    source: string;
    description: string;
    type: 'racial' | 'class' | 'feat' | 'background' | 'other';
  }>;
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
  personality: {
    traits: string[];
    ideals: string[];
    bonds: string[];
    flaws: string[];
    backstory: string;
    notes: string;
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
}

interface TabsPanelProps {
  character: Character;
  onChange: (character: Character) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: 'attacks', label: 'АТАКИ' },
  { id: 'abilities', label: 'СПОСОБНОСТИ' },
  { id: 'equipment', label: 'СНАРЯЖЕНИЕ' },
  { id: 'personality', label: 'ЛИЧНОСТЬ' },
  { id: 'goals', label: 'ЦЕЛИ' },
  { id: 'notes', label: 'ЗАМЕТКИ' },
  { id: 'spells', label: 'ЗАКЛИНАНИЯ' }
];

export function TabsPanel({ character, onChange, activeTab, onTabChange }: TabsPanelProps) {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'attacks':
        return <AttacksTab character={character} onChange={onChange} />;
      case 'abilities':
        return <AbilitiesTab character={character} onChange={onChange} />;
      case 'equipment':
        return <EquipmentTab character={character} onChange={onChange} />;
      case 'personality':
        return <PersonalityTab character={character} onChange={onChange} />;
      case 'goals':
        return <GoalsTab character={character} onChange={onChange} />;
      case 'notes':
        return <NotesTab character={character} onChange={onChange} />;
      case 'spells':
        return <SpellsTab character={character} onChange={onChange} />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Выберите вкладку</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Вкладки - как на референсе */}
      <div className="flex bg-[#1F2128] border-b border-[#23262D]">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            className={`px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === id
                ? 'bg-[#5F7ADB] text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#23262D]'
            }`}
            onClick={() => onTabChange(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Содержимое вкладки */}
      <div className="flex-1 overflow-y-auto bg-[#181A1F]">
        {renderTabContent()}
      </div>
    </div>
  );
}