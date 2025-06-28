'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CharacterSheetLayout } from './character-sheet-layout';
import { Download, Save } from 'lucide-react';

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

interface CharacterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (characterData: Partial<Character>) => void;
  character: Character | null;
  isEditing: boolean;
}

export function CharacterDialog({
  isOpen,
  onClose,
  onSave,
  character,
  isEditing
}: CharacterDialogProps) {
  const [characterData, setCharacterData] = useState<Character>(() => {
    if (character) return character;
    
    // Значения по умолчанию для нового персонажа (как Тарен из референса)
    return {
      id: '',
      name: 'Тарен',
      playerName: 'Игрок',
      campaign: 'Новая кампания',
      source: 'Player\'s Handbook',
      classes: [{ name: 'Barbarian', level: 7 }],
      totalLevel: 7,
      experience: 25150,
      race: 'Human',
      background: 'Folk Hero',
      alignment: 'CN',
      inspiration: 0,
      exhaustion: 0,
      conditions: [],
      proficiencyBonus: 3,
      stats: {
        str: { base: 20, modifier: 5, temp: 0 },
        dex: { base: 18, modifier: 4, temp: 0 },
        con: { base: 16, modifier: 3, temp: 0 },
        int: { base: 14, modifier: 2, temp: 0 },
        wis: { base: 11, modifier: 0, temp: 0 },
        cha: { base: 11, modifier: 0, temp: 0 }
      },
      savingThrows: {
        str: { proficient: true },
        dex: { proficient: false },
        con: { proficient: true },
        int: { proficient: false },
        wis: { proficient: false },
        cha: { proficient: false }
      },
      skills: {
        acrobatics: { proficient: false, expertise: false },
        animalHandling: { proficient: false, expertise: false },
        arcana: { proficient: false, expertise: false },
        athletics: { proficient: true, expertise: false },
        deception: { proficient: false, expertise: false },
        history: { proficient: false, expertise: false },
        insight: { proficient: false, expertise: false },
        intimidation: { proficient: true, expertise: false },
        investigation: { proficient: false, expertise: false },
        medicine: { proficient: false, expertise: false },
        nature: { proficient: false, expertise: false },
        perception: { proficient: true, expertise: false },
        performance: { proficient: true, expertise: false },
        persuasion: { proficient: true, expertise: false },
        religion: { proficient: false, expertise: false },
        sleightOfHand: { proficient: false, expertise: false },
        stealth: { proficient: false, expertise: false },
        survival: { proficient: true, expertise: false }
      },
      combat: {
        armorClass: 19,
        initiative: 4,
        speed: { walk: 40, fly: 0, swim: 40, climb: 20, burrow: 0 },
        hitPoints: { current: 80, max: 93, temp: 0 },
        hitDice: { total: '7d12', used: 0 },
        deathSaves: { successes: 0, failures: 0 },
        attacks: [
          {
            name: 'Копье дракона',
            type: 'melee',
            attackBonus: 10,
            damage: '1d12+5+2',
            damageType: 'piercing',
            notes: ''
          },
          {
            name: 'Рука',
            type: 'melee',
            attackBonus: 8,
            damage: '1d4+5',
            damageType: 'bludgeoning',
            notes: ''
          },
          {
            name: 'Скилл бросок/удар копья',
            type: 'ranged',
            attackBonus: 8,
            damage: '1d12+5+1d6',
            damageType: 'piercing',
            notes: ''
          }
        ]
      },
      spells: {
        spellcastingAbility: 'cha',
        spellSaveDC: 8,
        spellAttackBonus: 0,
        knownSpells: 0,
        preparedSpells: 0,
        spellSlots: {
          level1: { total: 0, used: 0 },
          level2: { total: 0, used: 0 },
          level3: { total: 0, used: 0 },
          level4: { total: 0, used: 0 },
          level5: { total: 0, used: 0 },
          level6: { total: 0, used: 0 },
          level7: { total: 0, used: 0 },
          level8: { total: 0, used: 0 },
          level9: { total: 0, used: 0 }
        },
        spells: []
      },
      equipment: {
        items: [],
        carryingCapacity: 300
      },
      traits: [],
      appearance: {
        gender: 'male',
        age: 25,
        height: '6\'2"',
        weight: '200 lbs',
        eyeColor: 'brown',
        skinColor: 'fair',
        hairColor: 'brown',
        appearance: '',
        additionalImages: []
      },
      personality: {
        traits: [],
        ideals: [],
        bonds: [],
        flaws: [],
        backstory: '',
        notes: ''
      },
      currency: { cp: 0, sp: 0, ep: 0, gp: 70, pp: 0 },
      mounts: []
    };
  });

  const handleSave = () => {
    onSave(characterData);
    onClose();
  };

  const handleDownloadPDF = () => {
    // Создаём текстовый файл с данными персонажа
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col p-0 bg-[#181A1F]">
        <DialogHeader className="px-6 py-4 border-b border-[#23262D]">
          <DialogTitle className="font-cinzel text-2xl text-white">
            {isEditing ? `${characterData.name || 'Персонаж'}` : 'Создать персонажа'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isEditing ? 'Лист персонажа' : 'Создайте нового персонажа для ваших приключений'}
          </DialogDescription>
        </DialogHeader>

        {/* ОСНОВНОЙ КОНТЕНТ - СРАЗУ ЛИСТ ПЕРСОНАЖА БЕЗ ВКЛАДОК! */}
        <div className="flex-1 overflow-hidden">
          <CharacterSheetLayout
            character={characterData}
            onChange={setCharacterData}
          />
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#23262D] bg-[#1F2128]">
          <Button variant="outline" onClick={handleDownloadPDF} className="border-[#5F7ADB] text-[#5F7ADB] hover:bg-[#5F7ADB]/10">
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onClose} className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Отмена
            </Button>
            <Button onClick={handleSave} className="bg-[#5F7ADB] hover:bg-[#4C6EF5] text-white">
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Сохранить изменения' : 'Создать персонажа'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}