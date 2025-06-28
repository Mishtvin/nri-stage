'use client';

import { TextareaField } from '@/components/ui/form-fields/textarea-field';
import { ListItem } from '@/components/ui/form-fields/list-item';
import { AddButton } from '@/components/ui/form-fields/add-button';
import { Heart } from 'lucide-react';

interface Character {
  personality: {
    traits: string[];
    ideals: string[];
    bonds: string[];
    flaws: string[];
    backstory: string;
    notes: string;
  };
}

interface PersonalityTabProps {
  character: Character;
  onChange: (character: Character) => void;
}

export function PersonalityTab({ character, onChange }: PersonalityTabProps) {
  const updatePersonality = (field: keyof Character['personality'], value: any) => {
    const newCharacter = { ...character };
    newCharacter.personality = { ...newCharacter.personality, [field]: value };
    onChange(newCharacter);
  };

  const updateListItem = (field: 'traits' | 'ideals' | 'bonds' | 'flaws', index: number, value: string) => {
    const newList = [...character.personality[field]];
    newList[index] = value;
    updatePersonality(field, newList);
  };

  const addListItem = (field: 'traits' | 'ideals' | 'bonds' | 'flaws') => {
    updatePersonality(field, [...character.personality[field], '']);
  };

  const removeListItem = (field: 'traits' | 'ideals' | 'bonds' | 'flaws', index: number) => {
    const newList = character.personality[field].filter((_, i) => i !== index);
    updatePersonality(field, newList);
  };

  const hasAnyData = () => {
    return character.personality.traits.length > 0 ||
           character.personality.ideals.length > 0 ||
           character.personality.bonds.length > 0 ||
           character.personality.flaws.length > 0 ||
           character.personality.backstory ||
           character.personality.notes;
  };

  return (
    <div className="p-4 space-y-6">
      <h3 className="text-lg font-semibold text-white">Личность</h3>

      {hasAnyData() ? (
        <div className="space-y-6">
          {/* Черты характера */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white">Черты характера</h4>
              <AddButton onClick={() => addListItem('traits')} label="Добавить" size="sm" />
            </div>
            {character.personality.traits.map((trait, index) => (
              <ListItem
                key={index}
                value={trait}
                onChange={(value) => updateListItem('traits', index, value)}
                onDelete={() => removeListItem('traits', index)}
                placeholder="Описание черты характера..."
                multiline
              />
            ))}
          </div>

          {/* Идеалы */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white">Идеалы</h4>
              <AddButton onClick={() => addListItem('ideals')} label="Добавить" size="sm" />
            </div>
            {character.personality.ideals.map((ideal, index) => (
              <ListItem
                key={index}
                value={ideal}
                onChange={(value) => updateListItem('ideals', index, value)}
                onDelete={() => removeListItem('ideals', index)}
                placeholder="Что движет вашим персонажем..."
                multiline
              />
            ))}
          </div>

          {/* Привязанности */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white">Привязанности</h4>
              <AddButton onClick={() => addListItem('bonds')} label="Добавить" size="sm" />
            </div>
            {character.personality.bonds.map((bond, index) => (
              <ListItem
                key={index}
                value={bond}
                onChange={(value) => updateListItem('bonds', index, value)}
                onDelete={() => removeListItem('bonds', index)}
                placeholder="Кто или что важно для персонажа..."
                multiline
              />
            ))}
          </div>

          {/* Недостатки */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white">Недостатки</h4>
              <AddButton onClick={() => addListItem('flaws')} label="Добавить" size="sm" />
            </div>
            {character.personality.flaws.map((flaw, index) => (
              <ListItem
                key={index}
                value={flaw}
                onChange={(value) => updateListItem('flaws', index, value)}
                onDelete={() => removeListItem('flaws', index)}
                placeholder="Слабости и недостатки персонажа..."
                multiline
              />
            ))}
          </div>

          {/* Предыстория */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white">Предыстория</h4>
            <TextareaField
              label=""
              value={character.personality.backstory}
              onChange={(value) => updatePersonality('backstory', value)}
              placeholder="Расскажите историю вашего персонажа..."
              rows={6}
            />
          </div>

          {/* Заметки */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white">Заметки</h4>
            <TextareaField
              label=""
              value={character.personality.notes}
              onChange={(value) => updatePersonality('notes', value)}
              placeholder="Дополнительная информация о персонаже..."
              rows={4}
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>В этом разделе пока нет данных</p>
          <div className="mt-4 space-x-2">
            <AddButton onClick={() => addListItem('traits')} label="Добавить черту" />
            <AddButton onClick={() => addListItem('ideals')} label="Добавить идеал" />
          </div>
        </div>
      )}
    </div>
  );
}