'use client';

import { InputField } from '@/components/ui/form-fields/input-field';
import { NumberField } from '@/components/ui/form-fields/number-field';
import { TextareaField } from '@/components/ui/form-fields/textarea-field';
import { SelectField } from '@/components/ui/form-fields/select-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Palette, Upload, User } from 'lucide-react';

interface AppearanceData {
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
}

interface AppearanceEditorProps {
  data: AppearanceData;
  onChange: (data: AppearanceData) => void;
}

const GENDER_OPTIONS = [
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
  { value: 'non-binary', label: 'Небинарный' },
  { value: 'other', label: 'Другой' }
];

const EYE_COLORS = [
  { value: 'brown', label: 'Карие' },
  { value: 'blue', label: 'Голубые' },
  { value: 'green', label: 'Зелёные' },
  { value: 'hazel', label: 'Ореховые' },
  { value: 'gray', label: 'Серые' },
  { value: 'amber', label: 'Янтарные' },
  { value: 'violet', label: 'Фиолетовые' },
  { value: 'red', label: 'Красные' },
  { value: 'black', label: 'Чёрные' },
  { value: 'white', label: 'Белые' },
  { value: 'gold', label: 'Золотые' },
  { value: 'silver', label: 'Серебряные' }
];

const HAIR_COLORS = [
  { value: 'black', label: 'Чёрные' },
  { value: 'brown', label: 'Каштановые' },
  { value: 'blonde', label: 'Светлые' },
  { value: 'red', label: 'Рыжие' },
  { value: 'gray', label: 'Седые' },
  { value: 'white', label: 'Белые' },
  { value: 'auburn', label: 'Тёмно-рыжие' },
  { value: 'strawberry', label: 'Клубничные' },
  { value: 'silver', label: 'Серебряные' },
  { value: 'blue', label: 'Синие' },
  { value: 'green', label: 'Зелёные' },
  { value: 'purple', label: 'Фиолетовые' }
];

const SKIN_COLORS = [
  { value: 'pale', label: 'Бледная' },
  { value: 'fair', label: 'Светлая' },
  { value: 'medium', label: 'Средняя' },
  { value: 'olive', label: 'Оливковая' },
  { value: 'tan', label: 'Загорелая' },
  { value: 'brown', label: 'Коричневая' },
  { value: 'dark', label: 'Тёмная' },
  { value: 'ebony', label: 'Чёрная' },
  { value: 'blue', label: 'Синяя' },
  { value: 'green', label: 'Зелёная' },
  { value: 'red', label: 'Красная' },
  { value: 'golden', label: 'Золотая' }
];

export function AppearanceEditor({ data, onChange }: AppearanceEditorProps) {
  const updateField = (field: keyof AppearanceData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleAvatarUpload = () => {
    // В реальном приложении здесь была бы логика загрузки файла
    console.log('Avatar upload clicked');
  };

  return (
    <div className="space-y-6">
      {/* Аватар */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <span>Портрет персонажа</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Avatar className="h-32 w-32 ring-4 ring-primary/50">
            <AvatarImage src={data.avatar} alt={`Портрет персонажа`} />
            <AvatarFallback className="bg-primary/10 text-2xl">
              <User className="h-16 w-16" />
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" onClick={handleAvatarUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Загрузить портрет
          </Button>
          <InputField
            label="URL изображения"
            value={data.avatar || ''}
            onChange={(value) => updateField('avatar', value)}
            placeholder="https://example.com/avatar.jpg"
            type="url"
          />
        </CardContent>
      </Card>

      {/* Основные параметры */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5 text-primary" />
            <span>Основные параметры</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Пол"
            value={data.gender}
            onChange={(value) => updateField('gender', value)}
            options={GENDER_OPTIONS}
          />
          <NumberField
            label="Возраст"
            value={data.age}
            onChange={(value) => updateField('age', value)}
            min={1}
            max={10000}
            showControls={false}
          />
          <InputField
            label="Рост"
            value={data.height}
            onChange={(value) => updateField('height', value)}
            placeholder="5'8&quot; или 173 см"
          />
          <InputField
            label="Вес"
            value={data.weight}
            onChange={(value) => updateField('weight', value)}
            placeholder="150 фунтов или 68 кг"
          />
        </CardContent>
      </Card>

      {/* Цвета */}
      <Card>
        <CardHeader>
          <CardTitle>Цвета</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectField
            label="Цвет глаз"
            value={data.eyeColor}
            onChange={(value) => updateField('eyeColor', value)}
            options={EYE_COLORS}
          />
          <SelectField
            label="Цвет кожи"
            value={data.skinColor}
            onChange={(value) => updateField('skinColor', value)}
            options={SKIN_COLORS}
          />
          <SelectField
            label="Цвет волос"
            value={data.hairColor}
            onChange={(value) => updateField('hairColor', value)}
            options={HAIR_COLORS}
          />
        </CardContent>
      </Card>

      {/* Описание внешности */}
      <Card>
        <CardHeader>
          <CardTitle>Описание внешности</CardTitle>
        </CardHeader>
        <CardContent>
          <TextareaField
            label="Детальное описание"
            value={data.appearance}
            onChange={(value) => updateField('appearance', value)}
            placeholder="Опишите особенности внешности персонажа: телосложение, особые приметы, стиль одежды, манеру держаться..."
            rows={6}
          />
        </CardContent>
      </Card>
    </div>
  );
}