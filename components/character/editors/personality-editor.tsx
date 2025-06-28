'use client';

import { TextareaField } from '@/components/ui/form-fields/textarea-field';
import { ListItem } from '@/components/ui/form-fields/list-item';
import { AddButton } from '@/components/ui/form-fields/add-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Star, Link as LinkIcon, Users, Frown, ExternalLink } from 'lucide-react';

interface PersonalityData {
  traits: string[];
  ideals: string[];
  bonds: string[];
  flaws: string[];
  backstory: string;
  notes: string;
}

interface PersonalityEditorProps {
  data: PersonalityData;
  onChange: (data: PersonalityData) => void;
}

export function PersonalityEditor({ data, onChange }: PersonalityEditorProps) {
  const updateField = (field: keyof PersonalityData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateListItem = (field: 'traits' | 'ideals' | 'bonds' | 'flaws', index: number, value: string) => {
    const newList = [...data[field]];
    newList[index] = value;
    updateField(field, newList);
  };

  const addListItem = (field: 'traits' | 'ideals' | 'bonds' | 'flaws') => {
    updateField(field, [...data[field], '']);
  };

  const removeListItem = (field: 'traits' | 'ideals' | 'bonds' | 'flaws', index: number) => {
    const newList = data[field].filter((_, i) => i !== index);
    updateField(field, newList);
  };

  const renderNotesWithLinks = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline inline-flex items-center gap-1"
        >
          {match[1]}
          <ExternalLink className="h-3 w-3" />
        </a>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="space-y-6">
      {/* Черты характера */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-primary" />
              <span>Черты характера</span>
            </div>
            <AddButton onClick={() => addListItem('traits')} label="Добавить черту" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.traits.map((trait, index) => (
            <ListItem
              key={index}
              value={trait}
              onChange={(value) => updateListItem('traits', index, value)}
              onDelete={() => removeListItem('traits', index)}
              placeholder="Описание черты характера..."
              multiline
            />
          ))}
          {data.traits.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Черты характера не добавлены</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Идеалы */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" />
              <span>Идеалы</span>
            </div>
            <AddButton onClick={() => addListItem('ideals')} label="Добавить идеал" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.ideals.map((ideal, index) => (
            <ListItem
              key={index}
              value={ideal}
              onChange={(value) => updateListItem('ideals', index, value)}
              onDelete={() => removeListItem('ideals', index)}
              placeholder="Что движет вашим персонажем..."
              multiline
            />
          ))}
          {data.ideals.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Идеалы не добавлены</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Привязанности */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <LinkIcon className="h-5 w-5 text-primary" />
              <span>Привязанности</span>
            </div>
            <AddButton onClick={() => addListItem('bonds')} label="Добавить привязанность" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.bonds.map((bond, index) => (
            <ListItem
              key={index}
              value={bond}
              onChange={(value) => updateListItem('bonds', index, value)}
              onDelete={() => removeListItem('bonds', index)}
              placeholder="Кто или что важно для персонажа..."
              multiline
            />
          ))}
          {data.bonds.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <LinkIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Привязанности не добавлены</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Недостатки */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Frown className="h-5 w-5 text-primary" />
              <span>Недостатки</span>
            </div>
            <AddButton onClick={() => addListItem('flaws')} label="Добавить недостаток" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.flaws.map((flaw, index) => (
            <ListItem
              key={index}
              value={flaw}
              onChange={(value) => updateListItem('flaws', index, value)}
              onDelete={() => removeListItem('flaws', index)}
              placeholder="Слабости и недостатки персонажа..."
              multiline
            />
          ))}
          {data.flaws.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <Frown className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Недостатки не добавлены</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Предыстория */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Предыстория персонажа</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TextareaField
            label="История персонажа"
            value={data.backstory}
            onChange={(value) => updateField('backstory', value)}
            placeholder="Расскажите историю вашего персонажа: откуда он, что его привело к приключениям, какие важные события произошли в его жизни..."
            rows={8}
          />
        </CardContent>
      </Card>

      {/* Заметки */}
      <Card>
        <CardHeader>
          <CardTitle>Заметки</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TextareaField
            label="Дополнительные заметки"
            value={data.notes}
            onChange={(value) => updateField('notes', value)}
            placeholder="Дополнительная информация, ссылки на источники, связи с другими персонажами...&#10;&#10;Поддерживаются ссылки в формате [текст](URL), например:&#10;[Морденкайнен](https://dnd.su/spells/mordenkainens_magnificent_mansion/)"
            rows={6}
          />
          
          {data.notes && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Предварительный просмотр:</h4>
              <div className="text-sm whitespace-pre-wrap">
                {renderNotesWithLinks(data.notes)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}