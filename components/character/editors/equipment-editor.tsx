'use client';

import { InputField } from '@/components/ui/form-fields/input-field';
import { NumberField } from '@/components/ui/form-fields/number-field';
import { SelectField } from '@/components/ui/form-fields/select-field';
import { AddButton } from '@/components/ui/form-fields/add-button';
import { DeleteButton } from '@/components/ui/form-fields/delete-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Package, Sword, Shield, Sparkles } from 'lucide-react';

interface EquipmentItem {
  name: string;
  category: string;
  quantity: number;
  weight: number;
  description: string;
  active: boolean;
}

interface EquipmentData {
  items: EquipmentItem[];
  carryingCapacity: number;
}

interface EquipmentEditorProps {
  data: EquipmentData;
  onChange: (data: EquipmentData) => void;
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

export function EquipmentEditor({ data, onChange }: EquipmentEditorProps) {
  const updateField = (field: keyof EquipmentData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateItem = (index: number, field: keyof EquipmentItem, value: any) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateField('items', newItems);
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
    updateField('items', [...data.items, newItem]);
  };

  const removeItem = (index: number) => {
    const newItems = data.items.filter((_, i) => i !== index);
    updateField('items', newItems);
  };

  const getTotalWeight = (): number => {
    return data.items.reduce((total, item) => total + (item.weight * item.quantity), 0);
  };

  const getWeightStatus = (): { color: string; label: string } => {
    const totalWeight = getTotalWeight();
    const capacity = data.carryingCapacity;
    
    if (totalWeight <= capacity) {
      return { color: 'text-green-500', label: 'Норма' };
    } else if (totalWeight <= capacity * 2) {
      return { color: 'text-yellow-500', label: 'Перегруз' };
    } else {
      return { color: 'text-red-500', label: 'Критический перегруз' };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weapon': return Sword;
      case 'armor':
      case 'shield': return Shield;
      case 'magic': return Sparkles;
      default: return Package;
    }
  };

  const weightStatus = getWeightStatus();

  return (
    <div className="space-y-6">
      {/* Информация о весе */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-primary" />
              <span>Переносимый вес</span>
            </div>
            <Badge className={weightStatus.color}>
              {getTotalWeight().toFixed(1)} / {data.carryingCapacity} фунтов ({weightStatus.label})
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NumberField
            label="Максимальная грузоподъёмность"
            value={data.carryingCapacity}
            onChange={(value) => updateField('carryingCapacity', value)}
            min={1}
            max={1000}
            showControls={false}
          />
        </CardContent>
      </Card>

      {/* Снаряжение */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Снаряжение</span>
            <AddButton onClick={addItem} label="Добавить предмет" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.items.map((item, index) => {
            const CategoryIcon = getCategoryIcon(item.category);
            
            return (
              <div key={index} className="p-4 border border-border/50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={item.active}
                      onCheckedChange={(checked) => updateItem(index, 'active', checked)}
                    />
                    <CategoryIcon className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">
                      {item.name || 'Новый предмет'}
                    </h4>
                    {item.active && (
                      <Badge variant="outline" className="text-green-500 border-green-500">
                        Экипировано
                      </Badge>
                    )}
                  </div>
                  <DeleteButton onClick={() => removeItem(index)} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InputField
                    label="Название"
                    value={item.name}
                    onChange={(value) => updateItem(index, 'name', value)}
                    placeholder="Длинный меч"
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
                
                <div className="text-sm text-muted-foreground">
                  Общий вес: {(item.weight * item.quantity).toFixed(1)} фунтов
                </div>
              </div>
            );
          })}
          
          {data.items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Снаряжение не добавлено</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}