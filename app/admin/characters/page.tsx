
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Heart, 
  Shield, 
  Star, 
  BookOpen, 
  Sword, 
  Zap, 
  Brain, 
  MessageSquare, 
  Target, 
  Coins, 
  Crown,
  Plus,
  Dumbbell,
  HeartPulse,
  Book,
  ScrollText,
  Package,
  Sparkles,
  Link as LinkIcon,
  Frown
} from 'lucide-react';
import { characterStore } from '@/lib/data-store';
import { Character } from '@/components/shared/types';
import { DND_CLASSES } from '@/components/shared/constants/spells';
import { RACES } from '@/components/shared/constants';

const SKILLS_CONFIG = [
  { key: 'acrobatics', label: 'Акробатика', ability: 'dex' },
  { key: 'animalHandling', label: 'Уход за животными', ability: 'wis' },
  { key: 'arcana', label: 'Магия', ability: 'int' },
  { key: 'athletics', label: 'Атлетика', ability: 'str' },
  { key: 'deception', label: 'Обман', ability: 'cha' },
  { key: 'history', label: 'История', ability: 'int' },
  { key: 'insight', label: 'Проницательность', ability: 'wis' },
  { key: 'intimidation', label: 'Запугивание', ability: 'cha' },
  { key: 'investigation', label: 'Расследование', ability: 'int' },
  { key: 'medicine', label: 'Медицина', ability: 'wis' },
  { key: 'nature', label: 'Природа', ability: 'int' },
  { key: 'perception', label: 'Внимательность', ability: 'wis' },
  { key: 'performance', label: 'Выступление', ability: 'cha' },
  { key: 'persuasion', label: 'Убеждение', ability: 'cha' },
  { key: 'religion', label: 'Религия', ability: 'int' },
  { key: 'sleightOfHand', label: 'Ловкость рук', ability: 'dex' },
  { key: 'stealth', label: 'Скрытность', ability: 'dex' },
  { key: 'survival', label: 'Выживание', ability: 'wis' }
];

const SAVING_THROW_CONFIG = [
  { key: 'str', label: 'Сила' },
  { key: 'dex', label: 'Ловкость' },
  { key: 'con', label: 'Телосложение' },
  { key: 'int', label: 'Интеллект' },
  { key: 'wis', label: 'Мудрость' },
  { key: 'cha', label: 'Харизма' }
];

export default function AdminCharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedRace, setSelectedRace] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = characterStore.onChange((newCharacters) => {
      setCharacters(newCharacters);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = characters;

    if (searchTerm) {
      filtered = filtered.filter(char =>
        char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.playerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCampaign !== 'all') {
      filtered = filtered.filter(char => char.campaign === selectedCampaign);
    }
    
    if (selectedClass !== 'all') {
      filtered = filtered.filter(char => char.classes?.some(c => c.name === selectedClass));
    }
    
    if (selectedRace !== 'all') {
      filtered = filtered.filter(char => char.race === selectedRace);
    }

    setFilteredCharacters(filtered);
  }, [characters, searchTerm, selectedCampaign, selectedClass, selectedRace]);
  
  const campaigns = [...new Set(characters.map(char => char.campaign))].filter(Boolean);

  const handleViewCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setIsDetailOpen(true);
  };
  
  const getClassIcon = (className: string) => {
    const icons: { [key: string]: React.ElementType } = {
      'Wizard': BookOpen, 'Fighter': Sword, 'Rogue': Eye, 'Cleric': Shield,
      'Ranger': Target, 'Paladin': Crown, 'Barbarian': Sword, 'Bard': MessageSquare,
      'Druid': Target, 'Monk': Zap, 'Sorcerer': Star, 'Warlock': Brain
    };
    return icons[className] || Users;
  };
  
  const getStatModifier = (stat: number = 10) => {
    const modifier = Math.floor((stat - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };
  
  const getSavingThrowBonus = (character: Character, ability: keyof typeof character.stats) => {
    if (!character.stats || !character.savingThrows) return '+0';
    const modifier = character.stats[ability]?.modifier || 0;
    const isProficient = character.savingThrows[ability]?.proficient || false;
    const bonus = modifier + (isProficient ? (character.proficiencyBonus || 0) : 0);
    return bonus >= 0 ? `+${bonus}` : `${bonus}`;
  };

  const getSkillBonus = (character: Character, skillKey: keyof typeof character.skills) => {
    if (!character.skills || !character.stats) return '+0';
    const skillConfig = SKILLS_CONFIG.find(s => s.key === skillKey);
    if (!skillConfig) return '+0';
    
    const skillData = character.skills[skillKey as keyof typeof character.skills];
    const abilityMod = character.stats[skillConfig.ability as keyof typeof character.stats]?.modifier || 0;
    
    let bonus = abilityMod;
    if (skillData.proficient) bonus += character.proficiencyBonus || 0;
    if (skillData.expertise) bonus += character.proficiencyBonus || 0;

    return bonus >= 0 ? `+${bonus}` : `${bonus}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Персонажи</h1>
          <p className="text-muted-foreground">Просмотр всех персонажей игроков в системе</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список персонажей</CardTitle>
          <CardDescription>Всего персонажей: {characters.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по имени персонажа или игрока..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Кампания" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все кампании</SelectItem>
                    {campaigns.map(campaign => (
                      <SelectItem key={campaign} value={campaign}>{campaign}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Класс" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все классы</SelectItem>
                    {DND_CLASSES.map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 <Select value={selectedRace} onValueChange={setSelectedRace}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Раса" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все расы</SelectItem>
                    {RACES.map(race => (
                      <SelectItem key={race.value} value={race.value}>{race.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Персонаж</TableHead>
                    <TableHead>Игрок</TableHead>
                    <TableHead>Уровень</TableHead>
                    <TableHead>Раса</TableHead>
                    <TableHead>Кампания</TableHead>
                    <TableHead>Обновлен</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-8"><Users className="h-8 w-8 mx-auto text-muted-foreground animate-pulse" /></TableCell></TableRow>
                  ) : filteredCharacters.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-8">Персонажи не найдены</TableCell></TableRow>
                  ) : (
                    filteredCharacters.map((character) => (
                      <TableRow key={character.id}>
                        <TableCell className="font-medium">{character.name}</TableCell>
                        <TableCell>{character.playerName}</TableCell>
                        <TableCell>{character.totalLevel}</TableCell>
                        <TableCell>{character.race}</TableCell>
                        <TableCell>{character.campaign}</TableCell>
                        <TableCell>{new Date(character.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleViewCharacter(character)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Просмотреть
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Character Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedCharacter && (
            <>
              <DialogHeader>
                <div className="flex items-center space-x-4">
                   <Avatar className="h-16 w-16 ring-2 ring-primary/50">
                    <AvatarImage src={selectedCharacter.appearance?.avatar} alt={selectedCharacter.name} />
                    <AvatarFallback className="bg-primary/10">
                      {React.createElement(getClassIcon(selectedCharacter.classes?.[0]?.name || 'Users'), { className: "h-8 w-8 text-primary" })}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="font-cinzel text-2xl">{selectedCharacter.name}</DialogTitle>
                    <DialogDescription className="text-lg">
                      {selectedCharacter.race} {selectedCharacter.classes?.map(c => `${c.name} ${c.level}`).join(' / ')}
                    </DialogDescription>
                    <p className="text-sm text-muted-foreground">Игрок: {selectedCharacter.playerName}</p>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                {/* Left Column */}
                <div className="md:col-span-1 space-y-6">
                  {/* Ability Scores */}
                  <Card>
                    <CardHeader><CardTitle className="font-cinzel text-lg">Характеристики</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-3 gap-2">
                      {selectedCharacter.stats && Object.entries(selectedCharacter.stats).map(([stat, value]) => (
                        <div key={stat} className="text-center p-2 bg-muted/50 rounded-lg">
                          <div className="font-semibold uppercase text-sm">{stat}</div>
                          <div className="text-lg font-bold">{value.base}</div>
                          <div className="text-sm text-muted-foreground">({getStatModifier(value.base)})</div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Saving Throws */}
                  <Card>
                     <CardHeader><CardTitle className="font-cinzel text-lg">Спасброски</CardTitle></CardHeader>
                     <CardContent className="space-y-2">
                        {SAVING_THROW_CONFIG.map(({ key, label }) => (
                           <div key={key} className="flex justify-between items-center text-sm">
                             <div className="flex items-center space-x-2">
                               {selectedCharacter.savingThrows?.[key as keyof typeof selectedCharacter.savingThrows]?.proficient && <Star className="h-3 w-3 text-yellow-400" />}
                               <span>{label}</span>
                             </div>
                             <span className="font-mono">{getSavingThrowBonus(selectedCharacter, key as keyof typeof selectedCharacter.stats)}</span>
                           </div>
                        ))}
                     </CardContent>
                  </Card>

                   {/* Other Stats */}
                   <Card>
                     <CardHeader><CardTitle className="font-cinzel text-lg">Прочие параметры</CardTitle></CardHeader>
                     <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Бонус мастерства:</span> <span className="font-mono">+{selectedCharacter.proficiencyBonus || 0}</span></div>
                        <div className="flex justify-between"><span>Вдохновение:</span> <span className="font-mono">{selectedCharacter.inspiration || 0}</span></div>
                        <div className="flex justify-between"><span>Истощение:</span> <span className="font-mono">{selectedCharacter.exhaustion || 0}</span></div>
                        <div className="flex justify-between"><span>Пассивное восприятие:</span> <span className="font-mono">{10 + (getSkillBonus(selectedCharacter, 'perception').startsWith('+') ? parseInt(getSkillBonus(selectedCharacter, 'perception').slice(1)) : 0)}</span></div>
                     </CardContent>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="md:col-span-2 space-y-6">
                   {/* Combat Stats */}
                   <Card>
                     <CardHeader><CardTitle className="font-cinzel text-lg">Боевые параметры</CardTitle></CardHeader>
                     <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div><div className="text-2xl font-bold">{selectedCharacter.combat?.armorClass || 10}</div><div className="text-xs text-muted-foreground">КД</div></div>
                        <div><div className="text-2xl font-bold">{selectedCharacter.combat?.initiative >= 0 ? '+' : ''}{selectedCharacter.combat?.initiative || 0}</div><div className="text-xs text-muted-foreground">Инициатива</div></div>
                        <div><div className="text-2xl font-bold">{selectedCharacter.combat?.speed?.walk || 30} фт.</div><div className="text-xs text-muted-foreground">Скорость</div></div>
                        <div><div className="text-2xl font-bold">{selectedCharacter.combat?.hitPoints?.current || 0}/{selectedCharacter.combat?.hitPoints?.max || 0}</div><div className="text-xs text-muted-foreground">Хиты</div></div>
                     </CardContent>
                   </Card>

                   {/* Skills */}
                   <Card>
                     <CardHeader><CardTitle className="font-cinzel text-lg">Навыки</CardTitle></CardHeader>
                     <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {SKILLS_CONFIG.map(({key, label}) => (
                           <div key={key} className="flex justify-between items-center text-sm">
                             <div className="flex items-center space-x-2">
                               {selectedCharacter.skills?.[key as keyof typeof selectedCharacter.skills]?.proficient && <Star className="h-3 w-3 text-yellow-400" />}
                               <span>{label}</span>
                             </div>
                             <span className="font-mono">{getSkillBonus(selectedCharacter, key as keyof typeof selectedCharacter.skills)}</span>
                           </div>
                        ))}
                     </CardContent>
                   </Card>

                    {/* Attacks */}
                    {selectedCharacter.combat?.attacks && selectedCharacter.combat.attacks.length > 0 && (
                      <Card>
                        <CardHeader><CardTitle className="font-cinzel text-lg">Атаки</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                          {selectedCharacter.combat.attacks.map((attack, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-semibold">{attack.name}:</span> {attack.attackBonus >= 0 ? '+' : ''}{attack.attackBonus} к попаданию, урон {attack.damage} {attack.damageType}.
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {/* Equipment & Currency */}
                   <Card>
                     <CardHeader><CardTitle className="font-cinzel text-lg">Снаряжение и Деньги</CardTitle></CardHeader>
                     <CardContent>
                       <h4 className="font-semibold mb-2">Снаряжение:</h4>
                        {selectedCharacter.equipment?.items?.length > 0 ? (
                            <ul className="list-disc list-inside text-sm text-muted-foreground mb-4">
                                {selectedCharacter.equipment.items.map((item, index) => (
                                    <li key={index}>{item.name} (x{item.quantity})</li>
                                ))}
                            </ul>
                        ) : (<p className="text-sm text-muted-foreground mb-4">Нет снаряжения.</p>)}
                       <Separator className="my-4" />
                       <h4 className="font-semibold mb-2">Валюта:</h4>
                       <div className="flex space-x-4 text-sm">
                         <div><span className="font-mono text-yellow-500">{selectedCharacter.currency?.gp || 0}</span> зм</div>
                         <div><span className="font-mono text-gray-400">{selectedCharacter.currency?.sp || 0}</span> см</div>
                         <div><span className="font-mono text-orange-400">{selectedCharacter.currency?.cp || 0}</span> мм</div>
                       </div>
                     </CardContent>
                   </Card>

                   {/* Personality, Traits, Features */}
                    <Card>
                     <CardHeader><CardTitle className="font-cinzel text-lg">Личность и Особенности</CardTitle></CardHeader>
                     <CardContent className="space-y-4 text-sm">
                        {selectedCharacter.personality?.backstory && (
                          <div>
                            <h4 className="font-semibold mb-1">Предыстория</h4>
                            <p className="text-muted-foreground whitespace-pre-wrap">{selectedCharacter.personality.backstory}</p>
                          </div>
                        )}
                        {selectedCharacter.traits && selectedCharacter.traits.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-1">Особенности</h4>
                            <ul className="list-disc list-inside text-muted-foreground">
                              {selectedCharacter.traits.map(trait => <li key={trait.name}>{trait.name}</li>)}
                            </ul>
                          </div>
                        )}
                     </CardContent>
                   </Card>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
