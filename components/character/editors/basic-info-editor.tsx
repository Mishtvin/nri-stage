'use client';

import { InputField } from '@/components/ui/form-fields/input-field';
import { SelectField } from '@/components/ui/form-fields/select-field';
import { NumberField } from '@/components/ui/form-fields/number-field';
import { TextareaField } from '@/components/ui/form-fields/textarea-field';
import { AddButton } from '@/components/ui/form-fields/add-button';
import { ListItem } from '@/components/ui/form-fields/list-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, BookOpen, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CharacterClass {
  name: string;
  level: number;
  subclass?: string;
}

interface BasicInfoData {
  name: string;
  playerName: string;
  campaign: string;
  source: string;
  classes: CharacterClass[];
  experience: number;
  race: string;
  subrace?: string;
  background: string;
  alignment: string;
  deity?: string;
  plane?: string;
  inspiration: number;
}

interface BasicInfoEditorProps {
  data: BasicInfoData;
  onChange: (data: BasicInfoData) => void;
}

const ALIGNMENTS = [
  { value: 'LG', label: 'Законно-добрый' },
  { value: 'NG', label: 'Нейтрально-добрый' },
  { value: 'CG', label: 'Хаотично-добрый' },
  { value: 'LN', label: 'Законно-нейтральный' },
  { value: 'TN', label: 'Истинно нейтральный' },
  { value: 'CN', label: 'Хаотично-нейтральный' },
  { value: 'LE', label: 'Законно-злой' },
  { value: 'NE', label: 'Нейтрально-злой' },
  { value: 'CE', label: 'Хаотично-злой' }
];

const COMMON_RACES = [
  { value: 'Human', label: 'Человек' },
  { value: 'Elf', label: 'Эльф' },
  { value: 'Dwarf', label: 'Дварф' },
  { value: 'Halfling', label: 'Полурослик' },
  { value: 'Dragonborn', label: 'Драконорождённый' },
  { value: 'Gnome', label: 'Гном' },
  { value: 'Half-Elf', label: 'Полуэльф' },
  { value: 'Half-Orc', label: 'Полуорк' },
  { value: 'Tiefling', label: 'Тифлинг' }
];

const COMMON_CLASSES = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
  'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
];

export function BasicInfoEditor({ data, onChange }: BasicInfoEditorProps) {
  const updateField = (field: keyof BasicInfoData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateClass = (index: number, field: keyof CharacterClass, value: any) => {
    const newClasses = [...data.classes];
    newClasses[index] = { ...newClasses[index], [field]: value };
    updateField('classes', newClasses);
  };

  const addClass = () => {
    updateField('classes', [...data.classes, { name: 'Fighter', level: 1 }]);
  };

  const removeClass = (index: number) => {
    const newClasses = data.classes.filter((_, i) => i !== index);
    updateField('classes', newClasses);
  };

  const totalLevel = data.classes.reduce((sum, cls) => sum + cls.level, 0);

  return (
    <div className="space-y-6">
      {/* Основная информация */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <span>Основная информация</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Имя персонажа"
            value={data.name}
            onChange={(value) => updateField('name', value)}
            placeholder="Введите имя персонажа"
            required
          />
          <InputField
            label="Имя игрока"
            value={data.playerName}
            onChange={(value) => updateField('playerName', value)}
            placeholder="Введите имя игрока"
            required
          />
          <InputField
            label="Кампания"
            value={data.campaign}
            onChange={(value) => updateField('campaign', value)}
            placeholder="Название кампании"
          />
          <InputField
            label="Источник"
            value={data.source}
            onChange={(value) => updateField('source', value)}
            placeholder="Player's Handbook, DMG..."
          />
        </CardContent>
      </Card>

      {/* Раса и происхождение */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Раса и происхождение</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Раса"
            value={data.race}
            onChange={(value) => updateField('race', value)}
            options={COMMON_RACES}
            required
          />
          <InputField
            label="Подраса"
            value={data.subrace || ''}
            onChange={(value) => updateField('subrace', value)}
            placeholder="Высший эльф, Горный дварф..."
          />
          <InputField
            label="Предыстория"
            value={data.background}
            onChange={(value) => updateField('background', value)}
            placeholder="Народный герой, Мудрец..."
          />
          <SelectField
            label="Мировоззрение"
            value={data.alignment}
            onChange={(value) => updateField('alignment', value)}
            options={ALIGNMENTS}
            required
          />
          <InputField
            label="Божество"
            value={data.deity || ''}
            onChange={(value) => updateField('deity', value)}
            placeholder="Торм, Мистра..."
          />
          <InputField
            label="Родной план"
            value={data.plane || ''}
            onChange={(value) => updateField('plane', value)}
            placeholder="Материальный план..."
          />
        </CardContent>
      </Card>

      {/* Классы */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" />
              <span>Классы (Общий уровень: {totalLevel})</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.classes.map((cls, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-border/50 rounded-lg">
              <SelectField
                label="Класс"
                value={cls.name}
                onChange={(value) => updateClass(index, 'name', value)}
                options={COMMON_CLASSES.map(c => ({ value: c, label: c }))}
              />
              <NumberField
                label="Уровень"
                value={cls.level}
                onChange={(value) => updateClass(index, 'level', value)}
                min={1}
                max={20}
              />
              <InputField
                label="Подкласс"
                value={cls.subclass || ''}
                onChange={(value) => updateClass(index, 'subclass', value)}
                placeholder="Школа Воплощения..."
              />
              <div className="flex items-end">
                {data.classes.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeClass(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    Удалить
                  </Button>
                )}
              </div>
            </div>
          ))}
          <AddButton
            onClick={addClass}
            label="Добавить класс"
          />
        </CardContent>
      </Card>

      {/* Прогрессия */}
      <Card>
        <CardHeader>
          <CardTitle>Прогрессия</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberField
            label="Опыт"
            value={data.experience}
            onChange={(value) => updateField('experience', value)}
            min={0}
            max={355000}
            showControls={false}
          />
          <NumberField
            label="Вдохновение"
            value={data.inspiration}
            onChange={(value) => updateField('inspiration', value)}
            min={0}
            max={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}
