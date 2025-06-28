'use client';

import { InputField } from '@/components/ui/form-fields/input-field';
import { TextareaField } from '@/components/ui/form-fields/textarea-field';
import { SelectField } from '@/components/ui/form-fields/select-field';
import { AddButton } from '@/components/ui/form-fields/add-button';
import { DeleteButton } from '@/components/ui/form-fields/delete-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Crown, BookOpen, User, Sparkles } from 'lucide-react';

interface Trait {
  name: string;
  source: string;
  description: string;
  type: 'racial' | 'class' | 'feat' | 'background' | 'other';
}

interface TraitsData {
  traits: Trait[];
}

interface TraitsEditorProps {
  data: TraitsData;
  onChange: (data: TraitsData) => void;
}

const TRAIT_TYPES = [
  { value: 'racial', label: 'Расовая черта', icon: User },
  { value: 'class', label: 'Черта класса', icon: Crown },
  { value: 'feat', label: 'Умение', icon: Star },
  { value: 'background', label: 'Черта предыстории', icon: BookOpen },
  { value: 'other', label: 'Прочее', icon: Sparkles }
];

export function TraitsEditor({ data, onChange }: TraitsEditorProps) {
  const updateTrait = (index: number, field: keyof Trait, value: any) => {
    const newTraits = [...data.traits];
    newTraits[index] = { ...newTraits[index], [field]: value };
    onChange({ traits: newTraits });
  };

  const addTrait = () => {
    const newTrait: Trait = {
      name: 'Новая черта',
      source: 'Player\'s Handbook',
      description: '',
      type: 'other'
    };
    onChange({ traits: [...data.traits, newTrait] });
  };

  const removeTrait = (index: number) => {
    const newTraits = data.traits.filter((_, i) => i !== index);
    onChange({ traits: newTraits });
  };

  const getTraitsByType = (type: string) => {
    return data.traits.filter(trait => trait.type === type);
  };

  const getTypeIcon = (type: string) => {
    const config = TRAIT_TYPES.find(t => t.value === type);
    return config ? config.icon : Sparkles;
  };

  const getTypeLabel = (type: string) => {
    const config = TRAIT_TYPES.find(t => t.value === type);
    return config ? config.label : 'Прочее';
  };

  return (
    <div className="space-y-6">
      {/* Добавление новой черты */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" />
              <span>Черты и особенности</span>
            </div>
            <AddButton onClick={addTrait} label="Добавить черту" />
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Группировка черт по типам */}
      {TRAIT_TYPES.map(({ value: type, label, icon: TypeIcon }) => {
        const traitsOfType = getTraitsByType(type);
        
        if (traitsOfType.length === 0) return null;
        
        return (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TypeIcon className="h-5 w-5 text-primary" />
                <span>{label}</span>
                <Badge variant="outline">{traitsOfType.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.traits.map((trait, index) => {
                if (trait.type !== type) return null;
                
                const TraitIcon = getTypeIcon(trait.type);
                
                return (
                  <div key={index} className="p-4 border border-border/50 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <TraitIcon className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">
                          {trait.name || 'Новая черта'}
                        </h4>
                        <Badge variant="outline">
                          {getTypeLabel(trait.type)}
                        </Badge>
                      </div>
                      <DeleteButton onClick={() => removeTrait(index)} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InputField
                        label="Название"
                        value={trait.name}
                        onChange={(value) => updateTrait(index, 'name', value)}
                        placeholder="Название черты"
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
                      placeholder="Описание эффекта черты..."
                      rows={3}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}

      {/* Все черты (если нет группировки) */}
      {data.traits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Все черты</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.traits.map((trait, index) => {
              const TraitIcon = getTypeIcon(trait.type);
              
              return (
                <div key={index} className="p-4 border border-border/50 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <TraitIcon className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">
                        {trait.name || 'Новая черта'}
                      </h4>
                      <Badge variant="outline">
                        {getTypeLabel(trait.type)}
                      </Badge>
                    </div>
                    <DeleteButton onClick={() => removeTrait(index)} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField
                      label="Название"
                      value={trait.name}
                      onChange={(value) => updateTrait(index, 'name', value)}
                      placeholder="Название черты"
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
                    placeholder="Описание эффекта черты..."
                    rows={3}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {data.traits.length === 0 && (
        <Card>
          <CardContent className="text-center py-8 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Черты не добавлены</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}