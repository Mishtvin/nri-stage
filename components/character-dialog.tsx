
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Save } from 'lucide-react';
import { SidebarNavigation } from './character/sidebar-navigation';
import { Character } from '@/components/shared/types';

// Import all editor components
import { BasicInfoEditor } from './character/editors/basic-info-editor';
import { AbilitiesEditor } from './character/editors/abilities-editor';
import { SkillsSavingThrowsEditor } from './character/editors/skills-saving-throws-editor';
import { CombatEditor } from './character/editors/combat-editor';
import { SpellsEditor } from './character/editors/spells-editor';
import { EquipmentEditor } from './character/editors/equipment-editor';
import { TraitsEditor } from './character/editors/traits-editor';
import { AppearanceEditor } from './character/editors/appearance-editor';
import { PersonalityEditor } from './character/editors/personality-editor';
import { CurrencyEditor } from './character/editors/currency-editor';
import { MountsEditor } from './character/editors/mounts-editor';

interface CharacterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (characterData: Partial<Character>) => void;
  character: Character | null;
  isEditing: boolean;
}

// Function to create a default new character
const createDefaultCharacter = (): Character => ({
  id: '',
  name: 'Новый персонаж',
  playerName: 'Игрок',
  campaign: '',
  source: "Player's Handbook",
  classes: [{ name: 'Fighter', level: 1 }],
  totalLevel: 1,
  experience: 0,
  race: 'Human',
  background: 'Folk Hero',
  alignment: 'TN',
  inspiration: 0,
  exhaustion: 0,
  conditions: [],
  proficiencyBonus: 2,
  stats: {
    str: { base: 10, modifier: 0, temp: 0 },
    dex: { base: 10, modifier: 0, temp: 0 },
    con: { base: 10, modifier: 0, temp: 0 },
    int: { base: 10, modifier: 0, temp: 0 },
    wis: { base: 10, modifier: 0, temp: 0 },
    cha: { base: 10, modifier: 0, temp: 0 }
  },
  savingThrows: {
    str: { proficient: false }, dex: { proficient: false }, con: { proficient: false },
    int: { proficient: false }, wis: { proficient: false }, cha: { proficient: false }
  },
  skills: {
    acrobatics: { proficient: false, expertise: false }, animalHandling: { proficient: false, expertise: false },
    arcana: { proficient: false, expertise: false }, athletics: { proficient: false, expertise: false },
    deception: { proficient: false, expertise: false }, history: { proficient: false, expertise: false },
    insight: { proficient: false, expertise: false }, intimidation: { proficient: false, expertise: false },
    investigation: { proficient: false, expertise: false }, medicine: { proficient: false, expertise: false },
    nature: { proficient: false, expertise: false }, perception: { proficient: false, expertise: false },
    performance: { proficient: false, expertise: false }, persuasion: { proficient: false, expertise: false },
    religion: { proficient: false, expertise: false }, sleightOfHand: { proficient: false, expertise: false },
    stealth: { proficient: false, expertise: false }, survival: { proficient: false, expertise: false }
  },
  combat: {
    armorClass: 10, initiative: 0, speed: { walk: 30, fly: 0, swim: 0, climb: 0, burrow: 0 },
    hitPoints: { current: 10, max: 10, temp: 0 },
    hitDice: { total: '1d10', used: 0 },
    deathSaves: { successes: 0, failures: 0 },
    attacks: []
  },
  spellcasting: {
    spellcastingAbility: 'wis', spellSaveDC: 8, spellAttackBonus: 0, knownSpells: 0, preparedSpells: 0,
    spellSlots: {
      level1: { total: 0, used: 0 }, level2: { total: 0, used: 0 }, level3: { total: 0, used: 0 },
      level4: { total: 0, used: 0 }, level5: { total: 0, used: 0 }, level6: { total: 0, used: 0 },
      level7: { total: 0, used: 0 }, level8: { total: 0, used: 0 }, level9: { total: 0, used: 0 }
    },
    spells: []
  },
  equipment: { items: [], carryingCapacity: 150 },
  traits: [],
  appearance: { gender: 'male', age: 25, height: '6\'0"', weight: '180 lbs', eyeColor: 'brown', skinColor: 'fair', hairColor: 'black', appearance: '', additionalImages: [] },
  personality: { traits: [], ideals: [], bonds: [], flaws: [], backstory: '', notes: '' },
  currency: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 },
  mounts: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});


export function CharacterDialog({ isOpen, onClose, onSave, character, isEditing }: CharacterDialogProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [characterData, setCharacterData] = useState<Character>(createDefaultCharacter());

  useEffect(() => {
    if (isOpen) {
      if (isEditing && character) {
        // Deep merge the character prop with the default structure
        // to ensure all properties exist.
        const defaultChar = createDefaultCharacter();
        const mergedData = {
          ...defaultChar,
          ...character,
          stats: {
            ...defaultChar.stats,
            ...(character.stats || {}),
          },
          savingThrows: {
            ...defaultChar.savingThrows,
            ...(character.savingThrows || {}),
          },
          skills: {
            ...defaultChar.skills,
            ...(character.skills || {}),
          },
          combat: {
            ...defaultChar.combat,
            ...(character.combat || {}),
          },
          spellcasting: {
            ...defaultChar.spellcasting,
            ...(character.spellcasting || {}),
          },
          equipment: {
            ...defaultChar.equipment,
            ...(character.equipment || {}),
          },
          appearance: {
            ...defaultChar.appearance,
            ...(character.appearance || {}),
          },
          personality: {
            ...defaultChar.personality,
            ...(character.personality || {}),
          },
          currency: {
            ...defaultChar.currency,
            ...(character.currency || {}),
          },
        };
        setCharacterData(mergedData as Character);
      } else {
        setCharacterData(createDefaultCharacter());
      }
      setActiveTab('basic'); // Reset to the first tab when opening
    }
  }, [isOpen, isEditing, character]);


  const handleSave = () => {
    onSave(characterData);
    onClose();
  };

  const handleDownloadPDF = () => {
    const characterSheet = `
ЛИСТ ПЕРСОНАЖА D&D 5E

=== ОСНОВНАЯ ИНФОРМАЦИЯ ===
Имя персонажа: ${characterData.name}
Имя игрока: ${characterData.playerName}
Кампания: ${characterData.campaign}
Источник: ${characterData.source}

=== РАСА И КЛАСС ===
Раса: ${characterData.race}${characterData.subrace ? ` (${characterData.subrace})` : ''}
Предыстория: ${characterData.background}
Мировоззрение: ${characterData.alignment}
Классы: ${characterData.classes.map(c => `${c.name} ${c.level}${c.subclass ? ` (${c.subclass})` : ''}`).join(', ')}
Общий уровень: ${characterData.totalLevel}
Опыт: ${characterData.experience}

=== ХАРАКТЕРИСТИКИ ===
Сила: ${characterData.stats.str.base + characterData.stats.str.temp} (${characterData.stats.str.modifier >= 0 ? '+' : ''}${characterData.stats.str.modifier})
Ловкость: ${characterData.stats.dex.base + characterData.stats.dex.temp} (${characterData.stats.dex.modifier >= 0 ? '+' : ''}${characterData.stats.dex.modifier})
Телосложение: ${characterData.stats.con.base + characterData.stats.con.temp} (${characterData.stats.con.modifier >= 0 ? '+' : ''}${characterData.stats.con.modifier})
Интеллект: ${characterData.stats.int.base + characterData.stats.int.temp} (${characterData.stats.int.modifier >= 0 ? '+' : ''}${characterData.stats.int.modifier})
Мудрость: ${characterData.stats.wis.base + characterData.stats.wis.temp} (${characterData.stats.wis.modifier >= 0 ? '+' : ''}${characterData.stats.wis.modifier})
Харизма: ${characterData.stats.cha.base + characterData.stats.cha.temp} (${characterData.stats.cha.modifier >= 0 ? '+' : ''}${characterData.stats.cha.modifier})

=== ЗДОРОВЬЕ И РЕСУРСЫ ===
Хиты: ${characterData.combat.hitPoints.current}/${characterData.combat.hitPoints.max}${characterData.combat.hitPoints.temp > 0 ? ` (+${characterData.combat.hitPoints.temp} врем.)` : ''}
КД: ${characterData.combat.armorClass}
Инициатива: ${characterData.combat.initiative >= 0 ? '+' : ''}${characterData.combat.initiative}
Скорость: ${characterData.combat.speed.walk} футов

=== ВАЛЮТА ===
Платиновые: ${characterData.currency.pp}
Золотые: ${characterData.currency.gp}
Электрумовые: ${characterData.currency.ep}
Серебряные: ${characterData.currency.sp}
Медные: ${characterData.currency.cp}

=== СНАРЯЖЕНИЕ ===
${characterData.equipment.items.map(item => `${item.name} (${item.quantity}x) - ${item.description}`).join('\n')}

=== ЧЕРТЫ И ОСОБЕННОСТИ ===
${characterData.traits.map(trait => `${trait.name} (${trait.source}): ${trait.description}`).join('\n')}

=== ЛИЧНОСТЬ ===
Черты характера: ${characterData.personality.traits.join(', ')}
Идеалы: ${characterData.personality.ideals.join(', ')}
Привязанности: ${characterData.personality.bonds.join(', ')}
Недостатки: ${characterData.personality.flaws.join(', ')}

Предыстория:
${characterData.personality.backstory}

Заметки:
${characterData.personality.notes}
    `;

    const element = document.createElement('a');
    const file = new Blob([characterSheet], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${characterData.name || 'character'}_sheet.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const handleDataChange = (updates: Partial<Character>) => {
    setCharacterData(prev => ({...prev, ...updates}));
  };
  
  const handleNestedChange = (key: keyof Character) => (value: any) => {
    handleDataChange({ [key]: value });
  };
  
  const renderActiveTab = () => {
    const abilityModifiers = characterData.stats ? Object.entries(characterData.stats).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value.modifier }),
      {} as Record<string, number>
    ) : {};

    switch (activeTab) {
      case 'basic':
        return <BasicInfoEditor data={characterData} onChange={handleDataChange} />;
      case 'abilities':
        return <AbilitiesEditor data={characterData.stats} onChange={handleNestedChange('stats')} />;
      case 'skills':
        return (
          <SkillsSavingThrowsEditor
            data={{
              proficiencyBonus: characterData.proficiencyBonus,
              savingThrows: characterData.savingThrows,
              skills: characterData.skills,
            }}
            abilityModifiers={abilityModifiers}
            onChange={(d) => handleDataChange({
              proficiencyBonus: d.proficiencyBonus,
              savingThrows: d.savingThrows,
              skills: d.skills,
            })}
          />
        );
      case 'combat':
        return (
          <CombatEditor
            data={{ ...characterData.combat, proficiencyBonus: characterData.proficiencyBonus }}
            onChange={(d) => handleDataChange({
              combat: {
                armorClass: d.armorClass,
                initiative: d.initiative,
                speed: d.speed,
                hitPoints: d.hitPoints,
                hitDice: d.hitDice,
                deathSaves: d.deathSaves,
                attacks: d.attacks,
              },
              proficiencyBonus: d.proficiencyBonus,
            })}
          />
        );
      case 'spells':
        return <SpellsEditor data={characterData.spellcasting || createDefaultCharacter().spellcasting} onChange={handleNestedChange('spellcasting')} />;
      case 'equipment':
        return <EquipmentEditor data={characterData.equipment} onChange={handleNestedChange('equipment')} />;
      case 'traits':
        return <TraitsEditor data={{ traits: characterData.traits }} onChange={(d) => handleDataChange({ traits: d.traits })} />;
      case 'appearance':
        return <AppearanceEditor data={characterData.appearance} onChange={handleNestedChange('appearance')} />;
      case 'personality':
        return <PersonalityEditor data={characterData.personality} onChange={handleNestedChange('personality')} />;
      case 'currency':
        return <CurrencyEditor data={characterData.currency} onChange={handleNestedChange('currency')} />;
      case 'mounts':
        return <MountsEditor data={{ mounts: characterData.mounts || [] }} onChange={(d) => handleDataChange({ mounts: d.mounts })} />;
      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="font-cinzel text-2xl">
            {isEditing ? `Редактирование: ${characterData.name}` : 'Создать персонажа'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Измените данные вашего персонажа' : 'Создайте нового персонажа для ваших приключений'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 border-r p-2">
            <ScrollArea className="h-full">
              <SidebarNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </ScrollArea>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-6">
              {renderActiveTab()}
            </ScrollArea>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t">
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button onClick={handleSave} className="fantasy-gradient">
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Сохранить изменения' : 'Создать персонажа'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
