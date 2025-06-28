'use client';

import { InputField } from '@/components/ui/form-fields/input-field';
import { NumberField } from '@/components/ui/form-fields/number-field';
import { SelectField } from '@/components/ui/form-fields/select-field';
import { TextareaField } from '@/components/ui/form-fields/textarea-field';
import { AddButton } from '@/components/ui/form-fields/add-button';
import { DeleteButton } from '@/components/ui/form-fields/delete-button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface Spell {
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
}

interface Character {
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
    spells: Spell[];
  };
}

interface SpellsTabProps {
  character: Character;
  onChange: (character: Character) => void;
}

const SPELLCASTING_ABILITIES = [
  { value: 'int', label: 'Интеллект' },
  { value: 'wis', label: 'Мудрость' },
  { value: 'cha', label: 'Харизма' }
];

const SPELL_SCHOOLS = [
  { value: 'abjuration', label: 'Ограждение' },
  { value: 'conjuration', label: 'Вызов' },
  { value: 'divination', label: 'Прорицание' },
  { value: 'enchantment', label: 'Очарование' },
  { value: 'evocation', label: 'Воплощение' },
  { value: 'illusion', label: 'Иллюзия' },
  { value: 'necromancy', label: 'Некромантия' },
  { value: 'transmutation', label: 'Преобразование' }
];

export function SpellsTab({ character, onChange }: SpellsTabProps) {
  const updateSpells = (field: keyof Character['spells'], value: any) => {
    const newCharacter = { ...character };
    newCharacter.spells = { ...newCharacter.spells, [field]: value };
    onChange(newCharacter);
  };

  const updateSpellSlot = (level: string, field: 'total' | 'used', value: number) => {
    const newCharacter = { ...character };
    newCharacter.spells.spellSlots = {
      ...newCharacter.spells.spellSlots,
      [level]: { ...newCharacter.spells.spellSlots[level as keyof typeof newCharacter.spells.spellSlots], [field]: value }
    };
    onChange(newCharacter);
  };

  const updateSpell = (index: number, field: keyof Spell, value: any) => {
    const newCharacter = { ...character };
    newCharacter.spells.spells[index] = { ...newCharacter.spells.spells[index], [field]: value };
    onChange(newCharacter);
  };

  const addSpell = () => {
    const newSpell: Spell = {
      name: 'Новое заклинание',
      level: 1,
      school: 'evocation',
      castingTime: '1 действие',
      range: '30 футов',
      components: 'V, S',
      duration: 'Мгновенно',
      description: '',
      source: 'Player\'s Handbook',
      prepared: false
    };
    const newCharacter = { ...character };
    newCharacter.spells.spells = [...newCharacter.spells.spells, newSpell];
    onChange(newCharacter);
  };

  const removeSpell = (index: number) => {
    const newCharacter = { ...character };
    newCharacter.spells.spells = newCharacter.spells.spells.filter((_, i) => i !== index);
    onChange(newCharacter);
  };

  const getPreparedSpellsCount = () => {
    return character.spells.spells.filter(spell => spell.prepared).length;
  };

  const hasSpellcasting = character.spells.spells.length > 0 || 
                         Object.values(character.spells.spellSlots).some(slot => slot.total > 0);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Заклинания</h3>
        <AddButton onClick={addSpell} label="Добавить заклинание" />
      </div>

      {hasSpellcasting ? (
        <div className="space-y-6">
          {/* Параметры заклинаний */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <SelectField
              label="Характеристика"
              value={character.spells.spellcastingAbility}
              onChange={(value) => updateSpells('spellcastingAbility', value)}
              options={SPELLCASTING_ABILITIES}
            />
            <NumberField
              label="Сл заклинания"
              value={character.spells.spellSaveDC}
              onChange={(value) => updateSpells('spellSaveDC', value)}
              min={8}
              max={30}
              showControls={false}
            />
            <NumberField
              label="Бонус атаки"
              value={character.spells.spellAttackBonus}
              onChange={(value) => updateSpells('spellAttackBonus', value)}
              min={0}
              max={20}
              showControls={false}
            />
            <NumberField
              label="Известно"
              value={character.spells.knownSpells}
              onChange={(value) => updateSpells('knownSpells', value)}
              min={0}
              max={100}
              showControls={false}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Подготовлено</label>
              <div className="text-center p-2 bg-[#23262D] rounded">
                <Badge variant="outline" className="text-[#5F7ADB] border-[#5F7ADB]">
                  {getPreparedSpellsCount()} / {character.spells.preparedSpells}
                </Badge>
              </div>
            </div>
          </div>

          {/* Ячейки заклинаний */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white">Ячейки заклинаний</h4>
            <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
              {Object.entries(character.spells.spellSlots).map(([key, slot]) => {
                const level = parseInt(key.replace('level', ''));
                return (
                  <div key={key} className="bg-[#23262D] rounded p-2 text-center">
                    <div className="text-xs text-gray-400 mb-1">{level} ур.</div>
                    <div className="grid grid-cols-1 gap-1">
                      <NumberField
                        label=""
                        value={slot.total}
                        onChange={(value) => updateSpellSlot(key, 'total', value)}
                        min={0}
                        max={10}
                        showControls={false}
                        className="text-center text-sm"
                      />
                      <NumberField
                        label=""
                        value={slot.used}
                        onChange={(value) => updateSpellSlot(key, 'used', value)}
                        min={0}
                        max={slot.total}
                        showControls={false}
                        className="text-center text-sm"
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {slot.used}/{slot.total}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Список заклинаний */}
          {character.spells.spells.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Список заклинаний</h4>
              {character.spells.spells.map((spell, index) => (
                <div key={index} className="p-4 bg-[#23262D] rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={spell.prepared}
                        onCheckedChange={(checked) => updateSpell(index, 'prepared', checked)}
                        className="border-gray-500"
                      />
                      <h5 className="font-semibold text-white">{spell.name || 'Новое заклинание'}</h5>
                      <Badge variant="outline" className="text-[#5F7ADB] border-[#5F7ADB]">
                        {spell.level === 0 ? 'Заговор' : `${spell.level} ур.`}
                      </Badge>
                    </div>
                    <DeleteButton onClick={() => removeSpell(index)} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <InputField
                      label="Название"
                      value={spell.name}
                      onChange={(value) => updateSpell(index, 'name', value)}
                      placeholder="Огненный шар"
                    />
                    <NumberField
                      label="Уровень"
                      value={spell.level}
                      onChange={(value) => updateSpell(index, 'level', value)}
                      min={0}
                      max={9}
                      showControls={false}
                    />
                    <SelectField
                      label="Школа"
                      value={spell.school}
                      onChange={(value) => updateSpell(index, 'school', value)}
                      options={SPELL_SCHOOLS}
                    />
                    <InputField
                      label="Источник"
                      value={spell.source}
                      onChange={(value) => updateSpell(index, 'source', value)}
                      placeholder="Player's Handbook"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <InputField
                      label="Время"
                      value={spell.castingTime}
                      onChange={(value) => updateSpell(index, 'castingTime', value)}
                      placeholder="1 действие"
                    />
                    <InputField
                      label="Дистанция"
                      value={spell.range}
                      onChange={(value) => updateSpell(index, 'range', value)}
                      placeholder="30 футов"
                    />
                    <InputField
                      label="Длительность"
                      value={spell.duration}
                      onChange={(value) => updateSpell(index, 'duration', value)}
                      placeholder="Мгновенно"
                    />
                  </div>
                  
                  <InputField
                    label="Компоненты"
                    value={spell.components}
                    onChange={(value) => updateSpell(index, 'components', value)}
                    placeholder="V, S, M (материальный компонент)"
                  />
                  
                  <TextareaField
                    label="Описание"
                    value={spell.description}
                    onChange={(value) => updateSpell(index, 'description', value)}
                    placeholder="Описание эффекта заклинания..."
                    rows={3}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>В этом разделе пока нет данных</p>
          <AddButton onClick={addSpell} label="Добавить заклинание" className="mt-4" />
        </div>
      )}
    </div>
  );
}