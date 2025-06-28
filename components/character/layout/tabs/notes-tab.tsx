'use client';

import { TextareaField } from '@/components/ui/form-fields/textarea-field';
import { FileText, ExternalLink } from 'lucide-react';

interface Character {
  personality: {
    notes: string;
  };
}

interface NotesTabProps {
  character: Character;
  onChange: (character: Character) => void;
}

export function NotesTab({ character, onChange }: NotesTabProps) {
  const updateNotes = (value: string) => {
    const newCharacter = { ...character };
    newCharacter.personality.notes = value;
    onChange(newCharacter);
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
          className="text-[#5F7ADB] hover:text-[#4C6EF5] underline inline-flex items-center gap-1"
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
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold text-white">Заметки</h3>

      {character.personality.notes ? (
        <div className="space-y-4">
          <TextareaField
            label=""
            value={character.personality.notes}
            onChange={updateNotes}
            placeholder="Дополнительная информация, ссылки на источники, связи с другими персонажами...&#10;&#10;Поддерживаются ссылки в формате [текст](URL), например:&#10;[Морденкайнен](https://dnd.su/spells/mordenkainens_magnificent_mansion/)"
            rows={12}
          />
          
          {character.personality.notes && (
            <div className="p-4 bg-[#23262D] rounded-lg">
              <h4 className="font-semibold mb-2 text-white">Предварительный просмотр:</h4>
              <div className="text-sm whitespace-pre-wrap text-gray-300">
                {renderNotesWithLinks(character.personality.notes)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>В этом разделе пока нет данных</p>
          <div className="mt-4">
            <TextareaField
              label=""
              value=""
              onChange={updateNotes}
              placeholder="Начните писать заметки..."
              rows={4}
            />
          </div>
        </div>
      )}
    </div>
  );
}