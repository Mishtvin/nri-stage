
'use client';

import { InputField } from '@/components/ui/form-fields/input-field';
import { TextareaField } from '@/components/ui/form-fields/textarea-field';
import { SelectField } from '@/components/ui/form-fields/select-field';
import { AddButton } from '@/components/ui/form-fields/add-button';
import { DeleteButton } from '@/components/ui/form-fields/delete-button';
import { Badge } from '@/components/ui/badge';
import { Star, Crown, BookOpen, User, Sparkles } from 'lucide-react';
import { Character, Trait } from '@/components/shared/types';

interface AbilitiesTabProps {
  character: Character;
  onChange: (character: Character) => void;
}

const TRAIT_TYPES = [
  { value: 'racial', label: 'Расовая', icon: User },
  { value: 'class', label: 'Класса', icon: Crown },
  { value: 'feat', label: 'Умение', icon: Star },
  { value: 'background', label: 'Предыстории', icon: BookOpen },
  { value: 'other', label: 'Прочее', icon: Sparkles }
];

export function AbilitiesTab({ character, onChange }: AbilitiesTabProps) {
  const updateTrait = (index: number, field: keyof Trait, value: any) => {
    const newCharacter = { ...character };
    newCharacter.traits[index] = { ...newCharacter.traits[index], [field]: value };
    onChange(newCharacter);
  };

  const addTrait = () => {
    const newTrait: Trait = {
      name: 'Новая способность',
      source: 'Player\'s Handbook',
      description: '',
      type: 'other'
    };
    const newCharacter = { ...character };
    newCharacter.traits = [...newCharacter.traits, newTrait];
    onChange(newCharacter);
  };

  const removeTrait = (index: number) => {
    const newCharacter = { ...character };
    newCharacter.traits = newCharacter.traits.filter((_, i) => i !== index);
    onChange(newCharacter);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'racial': return 'bg-blue-500/20 text-blue-400';
      case 'class': return 'bg-green-500/20 text-green-400';
      case 'feat': return 'bg-purple-500/20 text-purple-400';
      case 'background': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Способности</h3>
        <AddButton onClick={addTrait} label="Добавить способность" />
      </div>

      {character.traits.length > 0 ? (
        <div className="space-y-3">
          {character.traits.map((trait, index) => (
            <div key={index} className="p-4 bg-[#23262D] rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h4 className="font-semibold text-white">{trait.name || 'Новая способность'}</h4>
                  <Badge className={getTypeColor(trait.type)}>
                    {TRAIT_TYPES.find(t => t.value === trait.type)?.label}
                  </Badge>
                </div>
                <DeleteButton onClick={() => removeTrait(index)} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <InputField
                  label="Название"
                  value={trait.name}
                  onChange={(value) => updateTrait(index, 'name', value)}
                  placeholder="Название способности"
                />
                <SelectField
                  label="Тип"
                  value={trait.type}
                  onChange={(value) => updateTrait(index, 'type', value as Trait['type'])}
                  options={TRAIT_TYPES}
                />
                <InputField
                  label="Источник"
                  value={trait.source}
                  onChange={(value) => updateTrait(index, 'source', value)}
                  placeholder="Player's Handbook"
                />
              </div>
              
              <TextareaField
                label="Описание"
                value={trait.description}
                onChange={(value) => updateTrait(index, 'description', value)}
                placeholder="Описание эффекта способности..."
                rows={3}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>В этом разделе пока нет данных</p>
          <AddButton onClick={addTrait} label="Добавить способность" className="mt-4" />
        </div>
      )}
    </div>
  );
}
