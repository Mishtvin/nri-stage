'use client';

import { InputField } from '@/components/ui/form-fields/input-field';
import { NumberField } from '@/components/ui/form-fields/number-field';
import { SelectField } from '@/components/ui/form-fields/select-field';
import { TextareaField } from '@/components/ui/form-fields/textarea-field';
import { AddButton } from '@/components/ui/form-fields/add-button';
import { DeleteButton } from '@/components/ui/form-fields/delete-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Zap, Brain, Target } from 'lucide-react';

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

interface SpellSlots {
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

interface SpellsData {
  spellcastingAbility: string;
  spellSaveDC: number;
  spellAttackBonus: number;
  knownSpells: number;
  preparedSpells: number;
  spellSlots: SpellSlots;
  spells: Spell[];
}

interface SpellsEditorProps {
  data: SpellsData;
  onChange: (data: SpellsData) => void;
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

export function SpellsEditor({ data, onChange }: SpellsEditorProps) {
  const updateField = (field: keyof SpellsData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateSpellSlot = (level: keyof SpellSlots, field: 'total' | 'used', value: number) => {
    const newSlots = { ...data.spellSlots };
    newSlots[level] = { ...newSlots[level], [field]: value };
    updateField('spellSlots', newSlots);
  };

  const updateSpell = (index: number, field: keyof Spell, value: any) => {
    const newSpells = [...data.spells];
    newSpells[index] = { ...newSpells[index], [field]: value };
    updateField('spells', newSpells);
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
    updateField('spells', [...data.spells, newSpell]);
  };

  const removeSpell = (index: number) => {
    const newSpells = data.spells.filter((_, i) => i !== index);
    updateField('spells', newSpells);
  };

  const getSpellsByLevel = (level: number) => {
    return data.spells.filter(spell => spell.level === level);
  };

  const getPreparedSpellsCount = () => {
    return data.spells.filter(spell => spell.prepared).length;
  };

  return (
    <div className="space-y-6">
      {/* Основные параметры заклинаний */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Параметры заклинаний</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <SelectField
            label="Характеристика"
            value={data.spellcastingAbility}
            onChange={(value) => updateField('spellcastingAbility', value)}
            options={SPELLCASTING_ABILITIES}
          />
          <NumberField
            label="Сл заклинания"
            value={data.spellSaveDC}
            onChange={(value) => updateField('spellSaveDC', value)}
            min={8}
            max={30}
            showControls={false}
          />
          <NumberField
            label="Бонус атаки"
            value={data.spellAttackBonus}
            onChange={(value) => updateField('spellAttackBonus', value)}
            min={0}
            max={20}
            showControls={false}
          />
          <NumberField
            label="Известно заклинаний"
            value={data.knownSpells}
            onChange={(value) => updateField('knownSpells', value)}
            min={0}
            max={100}
            showControls={false}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Подготовлено</label>
            <div className="text-center p-2 bg-muted/50 rounded">
              <Badge variant="outline">
                {getPreparedSpellsCount()} / {data.preparedSpells}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ячейки заклинаний */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>Ячейки заклинаний</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-9 gap-4">
            {Object.entries(data.spellSlots).map(([key, slot]) => {
              const level = parseInt(key.replace('level', ''));
              return (
                <div key={key} className="space-y-2">
                  <div className="text-center">
                    <div className="text-sm font-medium">{level} уровень</div>
                    <Badge variant="outline" className="text-xs">
                      {slot.used} / {slot.total}
                    </Badge>
                  </div>
                  <NumberField
                    label="Всего"
                    value={slot.total}
                    onChange={(value) => updateSpellSlot(key as keyof SpellSlots, 'total', value)}
                    min={0}
                    max={10}
                    showControls={true}
                  />
                  <NumberField
                    label="Использовано"
                    value={slot.used}
                    onChange={(value) => updateSpellSlot(key as keyof SpellSlots, 'used', value)}
                    min={0}
                    max={slot.total}
                    showControls={true}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Заклинания */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>Заклинания</span>
            </div>
            <AddButton onClick={addSpell} label="Добавить заклинание" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Группировка по уровням */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => {
            const spellsOfLevel = getSpellsByLevel(level);
            if (spellsOfLevel.length === 0) return null;

            return (
              <div key={level} className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>{level === 0 ? 'Заговоры' : `${level} уровень`}</span>
                  <Badge variant="outline">{spellsOfLevel.length}</Badge>
                </h3>
                
                <div className="space-y-4">
                  {data.spells.map((spell, index) => {
                    if (spell.level !== level) return null;
                    
                    return (
                      <div key={index} className="p-4 border border-border/50 rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={spell.prepared}
                              onCheckedChange={(checked) => updateSpell(index, 'prepared', checked)}
                            />
                            <h4 className="font-semibold">
                              {spell.name || 'Новое заклинание'}
                            </h4>
                            <Badge variant="outline">
                              {SPELL_SCHOOLS.find(s => s.value === spell.school)?.label}
                            </Badge>
                          </div>
                          <DeleteButton onClick={() => removeSpell(index)} />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                          />
                          <SelectField
                            label="Школа магии"
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
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <InputField
                            label="Время накладывания"
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
                    );
                  })}
                </div>
              </div>
            );
          })}

          {data.spells.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Заклинания не добавлены</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}