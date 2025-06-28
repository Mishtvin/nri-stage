'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  Eye, 
  Skull, 
  Shield, 
  Sword, 
  Heart, 
  Zap, 
  Brain,
  Star,
  Crown,
  ExternalLink,
  Book,
  Dice6
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { monsterStore } from '@/lib/data-store';
import { Monster } from '@/components/bestiary/types';

const systems = [
  { value: 'dnd5e', label: 'D&D 5e' },
  { value: 'pathfinder', label: 'Pathfinder' },
  { value: 'dnd35', label: 'D&D 3.5e' },
  { value: 'other', label: 'Другие системы' }
];

const monsterTypes = [
  'Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon', 'Elemental',
  'Fey', 'Fiend', 'Giant', 'Humanoid', 'Monstrosity', 'Ooze', 'Plant', 'Undead'
];

const challengeRatings = [
  '0', '1/8', '1/4', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'
];

export default function BestiaryPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [filteredMonsters, setFilteredMonsters] = useState<Monster[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCR, setSelectedCR] = useState<string>('all');
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = monsterStore.onChange((newMonsters) => {
      setMonsters(newMonsters);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = monsters;

    if (searchTerm) {
      filtered = filtered.filter(monster => 
        monster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        monster.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSystem !== 'all') {
      filtered = filtered.filter(monster => monster.system === selectedSystem);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(monster => monster.type === selectedType);
    }

    if (selectedCR !== 'all') {
      filtered = filtered.filter(monster => monster.challengeRating === selectedCR);
    }

    setFilteredMonsters(filtered);
  }, [monsters, searchTerm, selectedSystem, selectedType, selectedCR]);

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

  const getCRColor = (cr: string) => {
    const crNum = cr.includes('/') ? parseFloat(cr.split('/')[0]) / parseFloat(cr.split('/')[1]) : parseFloat(cr);
    if (crNum < 1) return 'text-green-500';
    if (crNum < 5) return 'text-yellow-500';
    if (crNum < 10) return 'text-orange-500';
    if (crNum < 20) return 'text-red-500';
    return 'text-purple-500';
  };

  const getStatModifier = (stat: number) => {
    const modifier = Math.floor((stat - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const handleMonsterClick = (monster: Monster) => {
    setSelectedMonster(monster);
    setIsDialogOpen(true);
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
                <Skull className="h-8 w-8 text-primary" />
                <h1 className="text-4xl md:text-5xl font-cinzel font-bold">
                  <span className="fantasy-text-gradient">Бестиарий</span>
                </h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Исследуйте мир монстров и существ различных игровых систем
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск монстров..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Система" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все системы</SelectItem>
                    {systems.map(system => (
                      <SelectItem key={system.value} value={system.value}>
                        {system.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    {monsterTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedCR} onValueChange={setSelectedCR}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="CR" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все CR</SelectItem>
                    {challengeRatings.map(cr => (
                      <SelectItem key={cr} value={cr}>
                        CR {cr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Monsters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMonsters.map((monster) => (
                <Card 
                  key={monster.id} 
                  className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group cursor-pointer"
                  onClick={() => handleMonsterClick(monster)}
                >
                  {monster.imageUrl && (
                    <div className="h-32 bg-cover bg-center rounded-t-lg" style={{ backgroundImage: `url(${monster.imageUrl})` }}>
                      <div className="h-full bg-gradient-to-t from-black/60 to-transparent rounded-t-lg flex items-end p-3">
                        <Badge className={getCRColor(monster.challengeRating)}>
                          CR {monster.challengeRating}
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="font-cinzel text-lg group-hover:text-primary transition-colors line-clamp-1">
                          {monster.name}
                        </CardTitle>
                        <CardDescription>
                          {monster.size} {monster.type}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="border-primary/50">
                        {systems.find(s => s.value === monster.system)?.label}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-1">
                        <Shield className="h-3 w-3 text-blue-500" />
                        <span>AC {monster.armorClass}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3 text-red-500" />
                        <span>{monster.hitPoints.split(' ')[0]} HP</span>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {monster.alignment}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="text-xs text-muted-foreground">
                        {monster.source}
                      </div>
                      <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredMonsters.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Skull className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-cinzel font-semibold text-lg mb-2">Монстры не найдены</h3>
                  <p className="text-muted-foreground">
                    Попробуйте изменить фильтры поиска
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Monster Detail Dialog */}
      {selectedMonster && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="font-cinzel text-2xl">{selectedMonster.name}</DialogTitle>
                  <DialogDescription className="text-lg">
                    {selectedMonster.size} {selectedMonster.type}, {selectedMonster.alignment}
                  </DialogDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getCRColor(selectedMonster.challengeRating)}>
                    CR {selectedMonster.challengeRating}
                  </Badge>
                  <Badge variant="outline">
                    {systems.find(s => s.value === selectedMonster.system)?.label}
                  </Badge>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold">Armor Class:</span>
                    <span>{selectedMonster.armorClass}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="font-semibold">Hit Points:</span>
                    <span>{selectedMonster.hitPoints}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold">Speed:</span>
                    <span>{selectedMonster.speed}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Ability Scores */}
              <div>
                <h3 className="font-cinzel font-semibold text-lg mb-3">Характеристики</h3>
                <div className="grid grid-cols-6 gap-4">
                  {Object.entries(selectedMonster.stats).map(([stat, value]) => (
                    <div key={stat} className="text-center">
                      <div className="font-semibold uppercase text-sm">{stat}</div>
                      <div className="text-lg font-bold">{value}</div>
                      <div className="text-sm text-muted-foreground">({getStatModifier(value as number)})</div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Additional Stats */}
              <div className="space-y-2 text-sm">
                {selectedMonster.savingThrows && (
                  <div><span className="font-semibold">Saving Throws:</span> {selectedMonster.savingThrows}</div>
                )}
                {selectedMonster.skills && (
                  <div><span className="font-semibold">Skills:</span> {selectedMonster.skills}</div>
                )}
                {selectedMonster.damageResistances && (
                  <div><span className="font-semibold">Damage Resistances:</span> {selectedMonster.damageResistances}</div>
                )}
                {selectedMonster.damageImmunities && (
                  <div><span className="font-semibold">Damage Immunities:</span> {selectedMonster.damageImmunities}</div>
                )}
                {selectedMonster.conditionImmunities && (
                  <div><span className="font-semibold">Condition Immunities:</span> {selectedMonster.conditionImmunities}</div>
                )}
                <div><span className="font-semibold">Senses:</span> {selectedMonster.senses}</div>
                <div><span className="font-semibold">Languages:</span> {selectedMonster.languages}</div>
              </div>

              <Separator />

              {/* Abilities */}
              {selectedMonster.abilities && selectedMonster.abilities.length > 0 && (
                <div>
                  <h3 className="font-cinzel font-semibold text-lg mb-3">Способности</h3>
                  <div className="space-y-3">
                    {selectedMonster.abilities.map((ability, index) => (
                      <div key={index}>
                        <h4 className="font-semibold">{ability.name}</h4>
                        <p className="text-sm text-muted-foreground">{ability.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Actions */}
              <div>
                <h3 className="font-cinzel font-semibold text-lg mb-3">Действия</h3>
                <div className="space-y-3">
                  {selectedMonster.actions.map((action, index) => (
                    <div key={index}>
                      <h4 className="font-semibold">{action.name}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legendary Actions */}
              {selectedMonster.legendaryActions && selectedMonster.legendaryActions.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-cinzel font-semibold text-lg mb-3">Легендарные действия</h3>
                    <div className="space-y-3">
                      {selectedMonster.legendaryActions.map((action, index) => (
                        <div key={index}>
                          <h4 className="font-semibold">{action.name}</h4>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Source */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Источник: {selectedMonster.source}
                </div>
                {selectedMonster.sourceUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedMonster.sourceUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Открыть источник
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
