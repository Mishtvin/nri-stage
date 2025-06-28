'use client';

import { InputField } from '@/components/ui/form-fields/input-field';
import { NumberField } from '@/components/ui/form-fields/number-field';
import { SelectField } from '@/components/ui/form-fields/select-field';
import { TextareaField } from '@/components/ui/form-fields/textarea-field';
import { AddButton } from '@/components/ui/form-fields/add-button';
import { DeleteButton } from '@/components/ui/form-fields/delete-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Heart, Zap, Shield } from 'lucide-react';

interface Mount {
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
}

interface MountsData {
  mounts: Mount[];
}

interface MountsEditorProps {
  data: MountsData;
  onChange: (data: MountsData) => void;
}

const MOUNT_TYPES = [
  { value: 'horse', label: 'Лошадь' },
  { value: 'warhorse', label: 'Боевой конь' },
  { value: 'pony', label: 'Пони' },
  { value: 'mule', label: 'Мул' },
  { value: 'camel', label: 'Верблюд' },
  { value: 'elephant', label: 'Слон' },
  { value: 'mastiff', label: 'Мастиф' },
  { value: 'wolf', label: 'Волк' },
  { value: 'bear', label: 'Медведь' },
  { value: 'griffin', label: 'Грифон' },
  { value: 'pegasus', label: 'Пегас' },
  { value: 'dragon', label: 'Дракон' },
  { value: 'other', label: 'Другое' }
];

const CREATURE_SIZES = [
  { value: 'tiny', label: 'Крошечный' },
  { value: 'small', label: 'Маленький' },
  { value: 'medium', label: 'Средний' },
  { value: 'large', label: 'Большой' },
  { value: 'huge', label: 'Огромный' },
  { value: 'gargantuan', label: 'Гигантский' }
];

export function MountsEditor({ data, onChange }: MountsEditorProps) {
  const updateMount = (index: number, field: keyof Mount, value: any) => {
    const newMounts = [...data.mounts];
    newMounts[index] = { ...newMounts[index], [field]: value };
    onChange({ mounts: newMounts });
  };

  const updateMountStat = (index: number, stat: keyof Mount['stats'], value: number) => {
    const newMounts = [...data.mounts];
    newMounts[index] = {
      ...newMounts[index],
      stats: { ...newMounts[index].stats, [stat]: value }
    };
    onChange({ mounts: newMounts });
  };

  const updateMountHP = (index: number, field: 'current' | 'max', value: number) => {
    const newMounts = [...data.mounts];
    newMounts[index] = {
      ...newMounts[index],
      hitPoints: { ...newMounts[index].hitPoints, [field]: value }
    };
    onChange({ mounts: newMounts });
  };

  const addMount = () => {
    const newMount: Mount = {
      name: 'Новый питомец',
      type: 'horse',
      size: 'large',
      armorClass: 11,
      hitPoints: { current: 19, max: 19 },
      speed: 60,
      stats: { str: 16, dex: 10, con: 13, int: 2, wis: 11, cha: 7 },
      abilities: [],
      description: ''
    };
    onChange({ mounts: [...data.mounts, newMount] });
  };

  const removeMount = (index: number) => {
    const newMounts = data.mounts.filter((_, i) => i !== index);
    onChange({ mounts: newMounts });
  };

  const addAbility = (mountIndex: number) => {
    const newMounts = [...data.mounts];
    newMounts[mountIndex] = {
      ...newMounts[mountIndex],
      abilities: [...newMounts[mountIndex].abilities, '']
    };
    onChange({ mounts: newMounts });
  };

  const updateAbility = (mountIndex: number, abilityIndex: number, value: string) => {
    const newMounts = [...data.mounts];
    const newAbilities = [...newMounts[mountIndex].abilities];
    newAbilities[abilityIndex] = value;
    newMounts[mountIndex] = { ...newMounts[mountIndex], abilities: newAbilities };
    onChange({ mounts: newMounts });
  };

  const removeAbility = (mountIndex: number, abilityIndex: number) => {
    const newMounts = [...data.mounts];
    const newAbilities = newMounts[mountIndex].abilities.filter((_, i) => i !== abilityIndex);
    newMounts[mountIndex] = { ...newMounts[mountIndex], abilities: newAbilities };
    onChange({ mounts: newMounts });
  };

  const getStatModifier = (stat: number): number => {
    return Math.floor((stat - 10) / 2);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-primary" />
              <span>Питомцы и маунты</span>
            </div>
            <AddButton onClick={addMount} label="Добавить питомца" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.mounts.map((mount, index) => (
            <div key={index} className="p-6 border border-border/50 rounded-lg space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-primary" />
                  <span>{mount.name || 'Новый питомец'}</span>
                </h3>
                <DeleteButton onClick={() => removeMount(index)} />
              </div>

              {/* Основная информация */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Имя"
                  value={mount.name}
                  onChange={(value) => updateMount(index, 'name', value)}
                  placeholder="Кличка питомца"
                />
                <SelectField
                  label="Тип"
                  value={mount.type}
                  onChange={(value) => updateMount(index, 'type', value)}
                  options={MOUNT_TYPES}
                />
                <SelectField
                  label="Размер"
                  value={mount.size}
                  onChange={(value) => updateMount(index, 'size', value)}
                  options={CREATURE_SIZES}
                />
              </div>

              {/* Боевые характеристики */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <NumberField
                  label="Класс доспеха"
                  value={mount.armorClass}
                  onChange={(value) => updateMount(index, 'armorClass', value)}
                  min={1}
                  max={30}
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Хиты</label>
                  <div className="grid grid-cols-2 gap-2">
                    <NumberField
                      label="Текущие"
                      value={mount.hitPoints.current}
                      onChange={(value) => updateMountHP(index, 'current', value)}
                      min={0}
                      max={mount.hitPoints.max}
                    />
                    <NumberField
                      label="Максимум"
                      value={mount.hitPoints.max}
                      onChange={(value) => updateMountHP(index, 'max', value)}
                      min={1}
                      max={999}
                    />
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all"
                      style={{ width: `${(mount.hitPoints.current / mount.hitPoints.max) * 100}%` }}
                    />
                  </div>
                </div>
                <NumberField
                  label="Скорость (футы)"
                  value={mount.speed}
                  onChange={(value) => updateMount(index, 'speed', value)}
                  min={0}
                  max={120}
                />
              </div>

              {/* Характеристики */}
              <div>
                <h4 className="font-semibold mb-3">Характеристики</h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {Object.entries(mount.stats).map(([stat, value]) => (
                    <div key={stat} className="space-y-2">
                      <NumberField
                        label={stat.toUpperCase()}
                        value={value}
                        onChange={(newValue) => updateMountStat(index, stat as keyof Mount['stats'], newValue)}
                        min={1}
                        max={30}
                        showControls={true}
                      />
                      <div className="text-center text-xs text-muted-foreground">
                        {getStatModifier(value) >= 0 ? '+' : ''}{getStatModifier(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Способности */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Способности</h4>
                  <AddButton
                    onClick={() => addAbility(index)}
                    label="Добавить способность"
                    size="sm"
                  />
                </div>
                <div className="space-y-2">
                  {mount.abilities.map((ability, abilityIndex) => (
                    <div key={abilityIndex} className="flex items-center space-x-2">
                      <InputField
                        label=""
                        value={ability}
                        onChange={(value) => updateAbility(index, abilityIndex, value)}
                        placeholder="Название способности"
                        className="flex-1"
                      />
                      <DeleteButton
                        onClick={() => removeAbility(index, abilityIndex)}
                        size="sm"
                      />
                    </div>
                  ))}
                  {mount.abilities.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      Способности не добавлены
                    </div>
                  )}
                </div>
              </div>

              {/* Описание */}
              <TextareaField
                label="Описание"
                value={mount.description}
                onChange={(value) => updateMount(index, 'description', value)}
                placeholder="Описание внешности, характера, особенностей питомца..."
                rows={3}
              />
            </div>
          ))}

          {data.mounts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Crown className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Питомцы не добавлены</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}