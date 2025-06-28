'use client';

import { InputField } from '@/components/ui/form-fields/input-field';
import { NumberField } from '@/components/ui/form-fields/number-field';
import { SelectField } from '@/components/ui/form-fields/select-field';
import { AddButton } from '@/components/ui/form-fields/add-button';
import { DeleteButton } from '@/components/ui/form-fields/delete-button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';

interface EquipmentItem {
  name: string;
  category: string;
  quantity: number;
  weight: number;
  description: string;
  active: boolean;
}

interface Character {
  equipment: {
    items: EquipmentItem[];
    carryingCapacity: number;
  };
}

interface EquipmentTabProps {
  character: Character;
  onChange: (character: Character) => void;
}

const EQUIPMENT_CATEGORIES = [
  { value: 'weapon', label: 'Оружие' },
  { value: 'armor', label: 'Доспехи' },
  { value: 'shield', label: 'Щит' },
  { value: 'tool', label: 'Инструменты' },
  { value: 'gear', label: 'Снаряжение' },
  { value: 'consumable', label: 'Расходники' },
  { value: 'treasure', label: 'Сокровища' },
  { value: 'magic', label: 'Магические предметы' },
  { value: 'other', label: 'Прочее' }
];

export function EquipmentTab({ character, onChange }: EquipmentTabProps) {
  const updateItem = (index: number, field: keyof EquipmentItem, value: any) => {
    const newCharacter = { ...character };
    newCharacter.equipment.items[index] = { ...newCharacter.equipment.items[index], [field]: value };
    onChange(newCharacter);
  };

  const addItem = () => {
    const newItem: EquipmentItem = {
      name: 'Новый предмет',
      category: 'gear',
      quantity: 1,
      weight: 0,
      description: '',
      active: false
    };
    const newCharacter = { ...character };
    newCharacter.equipment.items = [...newCharacter.equipment.items, newItem];
    onChange(newCharacter);
  };

  const removeItem = (index: number) => {
    const newCharacter = { ...character };
    newCharacter.equipment.items = newCharacter.equipment.items.filter((_, i) => i !== index);
    onChange(newCharacter);
  };

  const getTotalWeight = (): number => {
    return character.equipment.items.reduce((total, item) => total + (item.weight * item.quantity), 0);
  };

  const getWeightStatus = (): { color: string; label: string } => {
    const totalWeight = getTotalWeight();
    const capacity = character.equipment.carryingCapacity;
    
    if (totalWeight <= capacity) {
      return { color: 'text-green-400', label: 'Норма' };
    } else if (totalWeight <= capacity * 2) {
      return { color: 'text-yellow-400', label: 'Перегруз' };
    } else {
      return { color: 'text-red-400', label: 'Критический перегруз' };
    }
  };

  const weightStatus = getWeightStatus();

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-white">Снаряжение</h3>
          <Badge className={weightStatus.color}>
            {getTotalWeight().toFixed(1)} / {character.equipment.carryingCapacity} фунтов ({weightStatus.label})
          </Badge>
        </div>
        <AddButton onClick={addItem} label="Добавить предмет" />
      </div>

      {character.equipment.items.length > 0 ? (
        <div className="space-y-3">
          {character.equipment.items.map((item, index) => (
            <div key={index} className="p-4 bg-[#23262D] rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={item.active}
                    onCheckedChange={(checked) => updateItem(index, 'active', checked)}
                    className="border-gray-500"
                  />
                  <h4 className="font-semibold text-white">{item.name || 'Новый предмет'}</h4>
                  {item.active && (
                    <Badge className="bg-green-500/20 text-green-400">Экипировано</Badge>
                  )}
                </div>
                <DeleteButton onClick={() => removeItem(index)} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <InputField
                  label="Название"
                  value={item.name}
                  onChange={(value) => updateItem(index, 'name', value)}
                  placeholder="Название предмета"
                />
                <SelectField
                  label="Категория"
                  value={item.category}
                  onChange={(value) => updateItem(index, 'category', value)}
                  options={EQUIPMENT_CATEGORIES}
                />
                <NumberField
                  label="Количество"
                  value={item.quantity}
                  onChange={(value) => updateItem(index, 'quantity', value)}
                  min={1}
                  max={999}
                  showControls={false}
                />
                <NumberField
                  label="Вес (за штуку)"
                  value={item.weight}
                  onChange={(value) => updateItem(index, 'weight', value)}
                  min={0}
                  max={100}
                  step={0.1}
                  showControls={false}
                />
              </div>
              
              <InputField
                label="Описание"
                value={item.description}
                onChange={(value) => updateItem(index, 'description', value)}
                placeholder="Описание предмета, его свойства..."
              />
              
              <div className="text-sm text-gray-400">
                Общий вес: {(item.weight * item.quantity).toFixed(1)} фунтов
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>В этом разделе пока нет данных</p>
          <AddButton onClick={addItem} label="Добавить предмет" className="mt-4" />
        </div>
      )}
    </div>
  );
}