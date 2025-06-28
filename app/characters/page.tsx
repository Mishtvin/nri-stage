
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Edit, 
  Download, 
  Coins, 
  Heart, 
  Star, 
  Sword, 
  Shield, 
  BookOpen,
  User,
  Crown,
  Eye,
  Trash2,
  ExternalLink,
  Zap,
  Brain,
  MessageSquare,
  Target
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { CharacterDialog } from '@/components/character-dialog';
import { Character } from '@/components/shared/types';
import { characterStore } from '@/lib/data-store';

export default function CharactersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = characterStore.onChange((newCharacters) => {
      // TODO: Filter characters by user ID when available on the character model
      setCharacters(newCharacters);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleCreateCharacter = () => {
    setSelectedCharacter(null);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSaveCharacter = (characterData: Partial<Character>) => {
    if (isEditing && selectedCharacter) {
      characterStore.update(selectedCharacter.id, characterData);
    } else {
      const newCharacterData: Omit<Character, 'id'> = {
        ...(characterData as Omit<Character, 'id'>),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      if ('id' in newCharacterData) {
        delete (newCharacterData as any).id;
      }
      characterStore.add(newCharacterData);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteCharacter = (characterId: string) => {
    characterStore.delete(characterId);
  };

  const handleDownloadPDF = (character: Character) => {
    const characterSheet = `
ЛИСТ ПЕРСОНАЖА D&D 5E
... (omitted for brevity) ...
    `;
    const element = document.createElement('a');
    const file = new Blob([characterSheet], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${character.name}_character_sheet.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getClassIcon = (className: string) => {
    const icons = {
      'Wizard': BookOpen,
      'Fighter': Sword,
      'Rogue': Eye,
      'Cleric': Shield,
      'Ranger': User,
      'Paladin': Crown,
      'Barbarian': Sword,
      'Bard': MessageSquare,
      'Druid': Target,
      'Monk': Zap,
      'Sorcerer': Star,
      'Warlock': Brain
    };
    return icons[className as keyof typeof icons] || User;
  };

  const getStatIcon = (stat: string) => {
    const icons = {
      str: Sword,
      dex: Zap,
      con: Heart,
      int: Brain,
      wis: Eye,
      cha: MessageSquare
    };
    return icons[stat as keyof typeof icons] || Star;
  };

  const renderNotesWithLinks = (text: string) => {
    const linkRegex = /\\\[([^\\]]+)\\]\\(([^)]+)\\)/g;
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

  const getTotalGold = (currency: Character['currency']) => {
    if (!currency) return 0;
    return (currency.pp || 0) * 10 + (currency.gp || 0) + (currency.ep || 0) * 0.5 + (currency.sp || 0) * 0.1 + (currency.cp || 0) * 0.01;
  };

  return (
    <div className="min-h-screen bg-background dice-pattern">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/50 to-primary/5" />
      <Navbar />
      
      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-cinzel font-bold">
                  <span className="fantasy-text-gradient">Мои персонажи</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Управляйте своими героями и их приключениями
                </p>
              </div>

              <Button 
                onClick={handleCreateCharacter}
                className="fantasy-gradient hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4 mr-2" />
                Создать персонажа
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {characters.map((character) => {
                const primaryClass = character.classes && character.classes.length > 0 ? character.classes[0] : { name: 'User', level: 1 };
                const ClassIcon = getClassIcon(primaryClass.name);
                const totalGold = getTotalGold(character.currency);
                const hp = character.combat?.hitPoints || { current: 0, max: 1 };
                const hpPercentage = hp.max > 0 ? (hp.current / hp.max) * 100 : 0;
                
                return (
                  <Card key={character.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12 ring-2 ring-primary/50">
                            <AvatarImage src={character.appearance?.avatar} alt={character.name} />
                            <AvatarFallback className="bg-primary/10">
                              <ClassIcon className="h-6 w-6 text-primary" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="font-cinzel text-lg group-hover:text-primary transition-colors">
                              {character.name}
                            </CardTitle>
                            <CardDescription>
                              {character.race} {character.classes?.map(c => `${c.name} ${c.level}`).join('/')}
                            </CardDescription>
                            <div className="text-xs text-muted-foreground mt-1">
                              {character.campaign}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge variant="outline" className="border-primary/50">
                            <Star className="h-3 w-3 mr-1" />
                            {character.totalLevel}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {character.alignment}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 text-red-500">
                            <Heart className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {hp.current}/{hp.max}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">HP</div>
                          <div className="w-full bg-secondary rounded-full h-1 mt-1">
                            <div 
                              className="bg-red-500 h-1 rounded-full transition-all"
                              style={{ width: `${hpPercentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 text-yellow-500">
                            <Coins className="h-4 w-4" />
                            <span className="text-sm font-medium">{Math.round(totalGold)}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">Золото</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 text-blue-500">
                            <Star className="h-4 w-4" />
                            <span className="text-sm font-medium">{character.experience}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">Опыт</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-6 gap-2 text-xs">
                        {character.stats && Object.entries(character.stats).map(([stat, values]) => {
                          const StatIcon = getStatIcon(stat);
                          return (
                            <div key={stat} className="text-center">
                              <StatIcon className="h-3 w-3 mx-auto mb-1 text-muted-foreground" />
                              <div className="font-semibold">{values.base + (values.temp || 0)}</div>
                              <div className="text-muted-foreground">
                                {values.modifier >= 0 ? '+' : ''}{values.modifier}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{character.equipment?.items?.length || 0} предметов</span>
                        <span>{character.traits?.length || 0} черт</span>
                        <span>{character.background}</span>
                      </div>

                      {character.personality?.notes && (
                        <div className="text-xs text-muted-foreground border-t pt-2">
                          <div className="line-clamp-2">
                            {renderNotesWithLinks(character.personality.notes)}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCharacter(character)}
                            className="hover:bg-primary/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadPDF(character)}
                            className="hover:bg-primary/10"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCharacter(character.id)}
                            className="hover:bg-destructive/10 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Обновлён: {new Date(character.updatedAt).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {characters.length === 0 && (
                <Card className="bg-card/30 backdrop-blur-sm border-dashed border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 hover:bg-card/50 group cursor-pointer col-span-full">
                  <CardContent 
                    className="flex flex-col items-center justify-center text-center space-y-4 p-12"
                    onClick={handleCreateCharacter}
                  >
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Plus className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-cinzel font-semibold text-lg">Создайте своего первого персонажа</h3>
                      <p className="text-muted-foreground text-sm max-w-md">
                        Начните своё приключение, создав уникального героя с детальной историей и характеристиками
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <CharacterDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveCharacter}
        character={selectedCharacter}
        isEditing={isEditing}
      />
    </div>
  );
}
