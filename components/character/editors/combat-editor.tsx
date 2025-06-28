'use client';

import { NumberField } from '@/components/ui/form-fields/number-field';
import { InputField } from '@/components/ui/form-fields/input-field';
import { SelectField } from '@/components/ui/form-fields/select-field';
import { AddButton } from '@/components/ui/form-fields/add-button';
import { DeleteButton } from '@/components/ui/form-fields/delete-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sword, Shield, Heart, Zap, Target } from 'lucide-react';

interface Attack {
  name: string;
  type: 'melee' | 'ranged' | 'spell';
  attackBonus: number;
  damage: string;
  damageType: string;
  notes: string;
}

interface DeathSaves {
  successes: number;
  failures: number;
}

interface CombatData {
  proficiencyBonus: number;
  armorClass: number;
  initiative: number;
  speed: {
    walk: number;
    fly: number;
    swim: number;
    climb: number;
    burrow: number;
  };
  hitPoints: {
    current: number;
    max: number;
    temp: number;
  };
  hitDice: {
    total: string;
    used: number;
  };
  deathSaves: DeathSaves;
  attacks: Attack[];
}

interface CombatEditorProps {
  data: CombatData;
  onChange: (data: CombatData) => void;
}

const ATTACK_TYPES = [
  { value: 'melee', label: 'Ближний бой' },
  { value: 'ranged', label: 'Дальний бой' },
  { value: 'spell', label: 'Заклинание' }
];

const DAMAGE_TYPES = [
  { value: 'slashing', label: 'Рубящий' },
  { value: 'piercing', label: 'Колющий' },
  { value: 'bludgeoning', label: 'Дробящий' },
  { value: 'fire', label: 'Огонь' },
  { value: 'cold', label: 'Холод' },
  { value: 'lightning', label: 'Молния' },
  { value: 'thunder', label: 'Гром' },
  { value: 'acid', label: 'Кислота' },
  { value: 'poison', label: 'Яд' },
  { value: 'psychic', label: 'Психический' },
  { value: 'necrotic', label: 'Некротический' },
  { value: 'radiant', label: 'Излучение' },
  { value: 'force', label: 'Силовое поле' }
];

export function CombatEditor({ data, onChange }: CombatEditorProps) {
  const updateField = (field: keyof CombatData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateNestedField = (parent: keyof CombatData, field: string, value: any) => {
    const newData = { ...data };
    (newData[parent] as any)[field] = value;
    onChange(newData);
  };

  const updateAttack = (index: number, field: keyof Attack, value: any) => {
    const newAttacks = [...data.attacks];
    newAttacks[index] = { ...newAttacks[index], [field]: value };
    updateField('attacks', newAttacks);
  };

  const addAttack = () => {
    const newAttack: Attack = {
      name: 'Новая атака',
      type: 'melee',
      attackBonus: 0,
      damage: '1d8',
      damageType: 'slashing',
      notes: ''
    };
    updateField('attacks', [...data.attacks, newAttack]);
  };

  const removeAttack = (index: number) => {
    const newAttacks = data.attacks.filter((_, i) => i !== index);
    updateField('attacks', newAttacks);
  };

  return (
    <div className="space-y-6">
      {/* Основные боевые параметры */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sword className="h-5 w-5 text-primary" />
            <span>Основные параметры</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NumberField
            label="Бонус мастерства"
            value={data.proficiencyBonus}
            onChange={(value) => updateField('proficiencyBonus', value)}
            min={2}
            max={6}
          />
          <NumberField
            label="Класс доспеха"
            value={data.armorClass}
            onChange={(value) => updateField('armorClass', value)}
            min={1}
            max={30}
          />
          <NumberField
            label="Инициатива"
            value={data.initiative}
            onChange={(value) => updateField('initiative', value)}
            min={-10}
            max={20}
          />
        </CardContent>
      </Card>

      {/* Скорость */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>Скорость</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <NumberField
            label="Ходьба"
            value={data.speed.walk}
            onChange={(value) => updateNestedField('speed', 'walk', value)}
            min={0}
            max={120}
          />
          <NumberField
            label="Полёт"
            value={data.speed.fly}
            onChange={(value) => updateNestedField('speed', 'fly', value)}
            min={0}
            max={120}
          />
          <NumberField
            label="Плавание"
            value={data.speed.swim}
            onChange={(value) => updateNestedField('speed', 'swim', value)}
            min={0}
            max={120}
          />
          <NumberField
            label="Лазание"
            value={data.speed.climb}
            onChange={(value) => updateNestedField('speed', 'climb', value)}
            min={0}
            max={120}
          />
          <NumberField
            label="Бурение"
            value={data.speed.burrow}
            onChange={(value) => updateNestedField('speed', 'burrow', value)}
            min={0}
            max={120}
          />
        </CardContent>
      </Card>

      {/* Хиты */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-primary" />
            <span>Хиты и выживание</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NumberField
              label="Текущие хиты"
              value={data.hitPoints.current}
              onChange={(value) => updateNestedField('hitPoints', 'current', value)}
              min={0}
              max={data.hitPoints.max + data.hitPoints.temp}
            />
            <NumberField
              label="Максимальные хиты"
              value={data.hitPoints.max}
              onChange={(value) => updateNestedField('hitPoints', 'max', value)}
              min={1}
              max={999}
            />
            <NumberField
              label="Временные хиты"
              value={data.hitPoints.temp}
              onChange={(value) => updateNestedField('hitPoints', 'temp', value)}
              min={0}
              max={100}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Кубики хитов (всего)"
              value={data.hitDice.total}
              onChange={(value) => updateNestedField('hitDice', 'total', value)}
              placeholder="8d8"
            />
            <NumberField
              label="Использовано кубиков"
              value={data.hitDice.used}
              onChange={(value) => updateNestedField('hitDice', 'used', value)}
              min={0}
              max={20}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumberField
              label="Успешные спасброски против смерти"
              value={data.deathSaves.successes}
              onChange={(value) => updateNestedField('deathSaves', 'successes', value)}
              min={0}
              max={3}
            />
            <NumberField
              label="Провальные спасброски против смерти"
              value={data.deathSaves.failures}
              onChange={(value) => updateNestedField('deathSaves', 'failures', value)}
              min={0}
              max={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Атаки */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Атаки</span>
            </div>
            <AddButton onClick={addAttack} label="Добавить атаку" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.attacks.map((attack, index) => (
            <div key={index} className="p-4 border border-border/50 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Атака #{index + 1}</h4>
                <DeleteButton onClick={() => removeAttack(index)} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="Название"
                  value={attack.name}
                  onChange={(value) => updateAttack(index, 'name', value)}
                  placeholder="Длинный меч"
                />
                <SelectField
                  label="Тип атаки"
                  value={attack.type}
                  onChange={(value) => updateAttack(index, 'type', value as Attack['type'])}
                  options={ATTACK_TYPES}
                />
                <NumberField
                  label="Бонус к атаке"
                  value={attack.attackBonus}
                  onChange={(value) => updateAttack(index, 'attackBonus', value)}
                  min={-10}
                  max={20}
                />
                <InputField
                  label="Урон"
                  value={attack.damage}
                  onChange={(value) => updateAttack(index, 'damage', value)}
                  placeholder="1d8+3"
                />
                <SelectField
                  label="Тип урона"
                  value={attack.damageType}
                  onChange={(value) => updateAttack(index, 'damageType', value)}
                  options={DAMAGE_TYPES}
                />
                <InputField
                  label="Примечания"
                  value={attack.notes}
                  onChange={(value) => updateAttack(index, 'notes', value)}
                  placeholder="Универсальное, финесс..."
                />
              </div>
            </div>
          ))}
          
          {data.attacks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Атаки не добавлены</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}