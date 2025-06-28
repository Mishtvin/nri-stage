
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Crown, 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Heart, 
  Coins, 
  Star, 
  Sword, 
  Shield, 
  BookOpen,
  User,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';

interface PlayerCharacter {
  id: string;
  name: string;
  level: number;
  class: string;
  race: string;
  campaign: string;
  playerName: string;
  playerEmail: string;
  hp: { current: number; max: number };
  experience: number;
  gold: number;
  stats: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  description: string;
  equipment: string[];
  spells: string[];
  notes: string;
  avatar?: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'injured';
}

export default function MasterCharactersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [characters, setCharacters] = useState<PlayerCharacter[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<PlayerCharacter[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<PlayerCharacter | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    // Load mock player characters
    const mockCharacters: PlayerCharacter[] = [
      {
        id: '1',
        name: 'Эльдрин Звездочёт',
        level: 8,
        class: 'Wizard',
        race: 'High Elf',
        campaign: 'Curse of Strahd',
        playerName: 'Александр Драконов',
        playerEmail: 'alex.dragonov@example.com',
        hp: { current: 45, max: 52 },
        experience: 34000,
        gold: 250,
        stats: { str: 10, dex: 14, con: 13, int: 18, wis: 15, cha: 12 },
        description: 'Мудрый эльф-волшебник, изучающий древние тайны магии.',
        equipment: ['Посох силы', 'Мантия защиты', 'Книга заклинаний'],
        spells: ['Огненный шар', 'Щит', 'Магическая стрела', 'Полёт'],
        notes: 'Ищет артефакт для победы над Страдом.',
        lastActive: '2024-01-15',
        status: 'active'
      },
      {
        id: '2',
        name: 'Торин Железнобород',
        level: 6,
        class: 'Fighter',
        race: 'Mountain Dwarf',
        campaign: 'Lost Mines of Phandelver',
        playerName: 'Мария Петрова',
        playerEmail: 'maria.petrova@example.com',
        hp: { current: 35, max: 58 },
        experience: 14000,
        gold: 180,
        stats: { str: 16, dex: 12, con: 15, int: 10, wis: 13, cha: 14 },
        description: 'Отважный дварф-воин, защитник своего клана.',
        equipment: ['Боевой топор +1', 'Кольчуга', 'Щит'],
        spells: [],
        notes: 'Ищет пропавших родственников в шахтах.',
        lastActive: '2024-01-14',
        status: 'injured'
      },
      {
        id: '3',
        name: 'Лира Лунная Песня',
        level: 5,
        class: 'Bard',
        race: 'Half-Elf',
        campaign: 'Dragon Heist',
        playerName: 'Дмитрий Волков',
        playerEmail: 'dmitry.volkov@example.com',
        hp: { current: 32, max: 32 },
        experience: 6500,
        gold: 120,
        stats: { str: 8, dex: 16, con: 12, int: 14, wis: 11, cha: 18 },
        description: 'Харизматичная бардесса с загадочным прошлым.',
        equipment: ['Лютня мастера', 'Кожаная броня', 'Рапира'],
        spells: ['Очарование личности', 'Лечащее слово', 'Вдохновение'],
        notes: 'Связана с гильдией воров Уотердипа.',
        lastActive: '2024-01-13',
        status: 'active'
      },
      {
        id: '4',
        name: 'Гром Каменный Кулак',
        level: 7,
        class: 'Barbarian',
        race: 'Goliath',
        campaign: 'Curse of Strahd',
        playerName: 'Анна Соколова',
        playerEmail: 'anna.sokolova@example.com',
        hp: { current: 68, max: 68 },
        experience: 23000,
        gold: 95,
        stats: { str: 18, dex: 14, con: 16, int: 8, wis: 12, cha: 10 },
        description: 'Могучий варвар из горных племён.',
        equipment: ['Великий топор', 'Шкурная броня', 'Амулет силы'],
        spells: [],
        notes: 'Поклялся защищать слабых.',
        lastActive: '2024-01-12',
        status: 'active'
      }
    ];
    setCharacters(mockCharacters);
    setFilteredCharacters(mockCharacters);
  }, []);

  useEffect(() => {
    let filtered = characters;

    if (selectedCampaign !== 'all') {
      filtered = filtered.filter(char => char.campaign === selectedCampaign);
    }

    if (searchTerm) {
      filtered = filtered.filter(char => 
        char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.class.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCharacters(filtered);
  }, [characters, selectedCampaign, searchTerm]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const campaigns = [...new Set(characters.map(char => char.campaign))].filter(Boolean);

  const getClassIcon = (className: string) => {
    const icons = {
      'Wizard': BookOpen,
      'Fighter': Sword,
      'Bard': User,
      'Barbarian': Shield,
      'Rogue': Eye,
      'Cleric': Shield,
      'Ranger': User,
      'Paladin': Crown
    };
    return icons[className as keyof typeof icons] || User;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500';
      case 'injured': return 'bg-red-500/10 text-red-500';
      case 'inactive': return 'bg-gray-500/10 text-gray-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'injured': return 'Ранен';
      case 'inactive': return 'Неактивен';
      default: return 'Неизвестно';
    }
  };

  return (
    <div className="min-h-screen bg-background dice-pattern">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/50 to-primary/5" />
      <Navbar />
      
      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Crown className="h-8 w-8 text-primary" />
                <h1 className="text-4xl md:text-5xl font-cinzel font-bold">
                  <span className="fantasy-text-gradient">Хаб персонажей</span>
                </h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Управляйте персонажами ваших игроков по кампаниям
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск по имени персонажа, игрока или классу..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все кампании</SelectItem>
                    {campaigns.map(campaign => (
                      <SelectItem key={campaign} value={campaign}>
                        {campaign}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Characters Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCharacters.map((character) => {
                const ClassIcon = getClassIcon(character.class);
                return (
                  <Card key={character.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12 ring-2 ring-primary/50">
                            <AvatarImage src={character.avatar} alt={character.name} />
                            <AvatarFallback className="bg-primary/10">
                              <ClassIcon className="h-6 w-6 text-primary" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="font-cinzel text-lg group-hover:text-primary transition-colors">
                              {character.name}
                            </CardTitle>
                            <CardDescription>
                              {character.race} {character.class} • Уровень {character.level}
                            </CardDescription>
                            <div className="text-xs text-muted-foreground mt-1">
                              Игрок: {character.playerName}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge variant="outline" className="border-primary/50">
                            <Star className="h-3 w-3 mr-1" />
                            {character.level}
                          </Badge>
                          <Badge className={getStatusColor(character.status)}>
                            {getStatusText(character.status)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Campaign Info */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Кампания:</span>
                          <span className="font-medium">{character.campaign}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Последняя активность:</span>
                          <span className="font-medium">
                            {new Date(character.lastActive).toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 text-red-500">
                            <Heart className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {character.hp.current}/{character.hp.max}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">HP</div>
                          <div className="w-full bg-secondary rounded-full h-1 mt-1">
                            <div 
                              className="bg-red-500 h-1 rounded-full transition-all"
                              style={{ width: `${(character.hp.current / character.hp.max) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 text-yellow-500">
                            <Coins className="h-4 w-4" />
                            <span className="text-sm font-medium">{character.gold}</span>
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

                      {/* Character Stats Preview */}
                      <div className="grid grid-cols-6 gap-2 text-xs">
                        {Object.entries(character.stats).map(([stat, value]) => (
                          <div key={stat} className="text-center">
                            <div className="font-semibold">{value}</div>
                            <div className="text-muted-foreground uppercase">{stat}</div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="text-xs text-muted-foreground">
                          {character.equipment.length} предметов • {character.spells.length} заклинаний
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/50 hover:bg-primary/10"
                          onClick={() => setSelectedCharacter(character)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Подробнее
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredCharacters.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-cinzel font-semibold text-lg mb-2">Персонажи не найдены</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedCampaign !== 'all' 
                      ? 'Попробуйте изменить фильтры поиска'
                      : 'Пока что игроки не добавили персонажей в ваши кампании'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Character Detail Modal */}
      {selectedCharacter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 ring-2 ring-primary/50">
                    <AvatarImage src={selectedCharacter.avatar} alt={selectedCharacter.name} />
                    <AvatarFallback className="bg-primary/10">
                      {getClassIcon(selectedCharacter.class)({ className: "h-8 w-8 text-primary" })}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="font-cinzel text-2xl">{selectedCharacter.name}</CardTitle>
                    <CardDescription className="text-lg">
                      {selectedCharacter.race} {selectedCharacter.class} • Уровень {selectedCharacter.level}
                    </CardDescription>
                    <div className="text-sm text-muted-foreground mt-1">
                      Игрок: {selectedCharacter.playerName} ({selectedCharacter.playerEmail})
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCharacter(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              {selectedCharacter.description && (
                <div>
                  <h4 className="font-cinzel font-semibold mb-2">Описание</h4>
                  <p className="text-muted-foreground">{selectedCharacter.description}</p>
                </div>
              )}

              {/* Equipment */}
              {selectedCharacter.equipment.length > 0 && (
                <div>
                  <h4 className="font-cinzel font-semibold mb-2">Снаряжение</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCharacter.equipment.map((item, index) => (
                      <Badge key={index} variant="outline">{item}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Spells */}
              {selectedCharacter.spells.length > 0 && (
                <div>
                  <h4 className="font-cinzel font-semibold mb-2">Заклинания</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCharacter.spells.map((spell, index) => (
                      <Badge key={index} variant="outline" className="border-primary/50">
                        {spell}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedCharacter.notes && (
                <div>
                  <h4 className="font-cinzel font-semibold mb-2">Заметки</h4>
                  <div className="text-muted-foreground whitespace-pre-wrap">
                    {selectedCharacter.notes.split(/(\[([^\]]+)\]\(([^)]+)\))/).map((part, index) => {
                      if (part.match(/\[([^\]]+)\]\(([^)]+)\)/)) {
                        const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
                        if (match) {
                          return (
                            <a
                              key={index}
                              href={match[2]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 underline inline-flex items-center gap-1"
                            >
                              {match[1]}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          );
                        }
                      }
                      return part;
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
