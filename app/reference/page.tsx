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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  Eye, 
  BookOpen, 
  Sparkles, 
  AlertTriangle,
  Clock,
  Zap,
  Shield,
  Heart,
  ExternalLink,
  Star,
  Target,
  ChevronLeft,
  BookUser,
  Gem
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { Spell, Condition, ReferenceItem, RuleCategory, Background, ClassFeature, Feat } from '@/components/shared/types';
import { SPELL_LEVELS, SPELL_SCHOOLS, DND_CLASSES } from '@/components/shared/constants/spells';
import { GAME_SYSTEMS } from '@/components/shared/constants';
import { spellStore, conditionStore, referenceItemStore, ruleCategoryStore, backgroundStore, classFeatureStore, featStore } from '@/lib/data-store';

export default function ReferencePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [spells, setSpells] = useState<Spell[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [referenceItems, setReferenceItems] = useState<ReferenceItem[]>([]);
  const [categories, setCategories] = useState<RuleCategory[]>([]);
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);
  const [features, setFeatures] = useState<ClassFeature[]>([]);
  const [feats, setFeats] = useState<Feat[]>([]);
  
  const [filteredSpells, setFilteredSpells] = useState<Spell[]>([]);
  const [filteredConditions, setFilteredConditions] = useState<Condition[]>([]);
  const [filteredReference, setFilteredReference] = useState<ReferenceItem[]>([]);
  const [filteredBackgrounds, setFilteredBackgrounds] = useState<Background[]>([]);
  const [filteredFeatures, setFilteredFeatures] = useState<ClassFeature[]>([]);
  const [filteredFeats, setFilteredFeats] = useState<Feat[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<RuleCategory | null>(null);
  
  const [selectedItem, setSelectedItem] = useState<Spell | Condition | ReferenceItem | Background | ClassFeature | Feat | null>(null);
  const [dialogType, setDialogType] = useState<'spell' | 'condition' | 'reference' | 'background' | 'feature' | 'feat' | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    setLoading(true);

    const unsubscribers = [
      spellStore.onChange(setSpells),
      conditionStore.onChange(setConditions),
      referenceItemStore.onChange(setReferenceItems),
      ruleCategoryStore.onChange(setCategories),
      backgroundStore.onChange(setBackgrounds),
      classFeatureStore.onChange(setFeatures),
      featStore.onChange(setFeats)
    ];
    
    // We assume that onSnapshot fires quickly with initial data.
    // A more robust solution might wait for all initial loads.
    setLoading(false);

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  useEffect(() => {
    const searchLower = searchTerm.toLowerCase();

    // Filter spells
    let currentSpells = spells.filter(spell => 
      (selectedSystem === 'all' || spell.system === selectedSystem) &&
      (selectedSchool === 'all' || spell.school === selectedSchool) &&
      (selectedLevel === 'all' || spell.level.toString() === selectedLevel) &&
      (selectedClass === 'all' || spell.classes.includes(selectedClass)) &&
      (!searchTerm || spell.name.toLowerCase().includes(searchLower) || spell.description.toLowerCase().includes(searchLower))
    );
    setFilteredSpells(currentSpells);

    // Filter conditions
    let currentConditions = conditions.filter(condition => 
      (selectedSystem === 'all' || condition.system === selectedSystem) &&
      (!searchTerm || condition.name.toLowerCase().includes(searchLower) || condition.description.toLowerCase().includes(searchLower))
    );
    setFilteredConditions(currentConditions);

    // Filter reference items
    let currentReference = referenceItems.filter(item => 
      (selectedSystem === 'all' || item.system === selectedSystem) &&
      (!searchTerm || item.name.toLowerCase().includes(searchLower) || item.description.toLowerCase().includes(searchLower))
    );
    setFilteredReference(currentReference);

    // Filter backgrounds
    let currentBackgrounds = backgrounds.filter(bg => 
      (selectedSystem === 'all' || bg.system === selectedSystem) &&
      (!searchTerm || bg.name.toLowerCase().includes(searchLower) || bg.description.toLowerCase().includes(searchLower))
    );
    setFilteredBackgrounds(currentBackgrounds);
    
    // Filter class features
    let currentFeatures = features.filter(f => 
      (selectedSystem === 'all' || f.system === selectedSystem) &&
      (selectedClass === 'all' || f.className === selectedClass) &&
      (!searchTerm || f.name.toLowerCase().includes(searchLower) || f.description.toLowerCase().includes(searchLower))
    );
    setFilteredFeatures(currentFeatures);
    
    // Filter feats
    let currentFeats = feats.filter(f => 
      (selectedSystem === 'all' || f.system === selectedSystem) &&
      (!searchTerm || f.name.toLowerCase().includes(searchLower) || f.description.toLowerCase().includes(searchLower))
    );
    setFilteredFeats(currentFeats);

  }, [spells, conditions, referenceItems, backgrounds, features, feats, searchTerm, selectedSystem, selectedSchool, selectedLevel, selectedClass]);

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

  const getSpellLevelText = (level: number) => {
    if (level === 0) return 'Заговор';
    return `${level} уровень`;
  };

  const getSchoolIcon = (school: string) => {
    const icons = {
      'Abjuration': Shield,
      'Conjuration': Star,
      'Divination': Eye,
      'Enchantment': Heart,
      'Evocation': Zap,
      'Illusion': Sparkles,
      'Necromancy': AlertTriangle,
      'Transmutation': Target
    };
    return icons[school as keyof typeof icons] || Sparkles;
  };

  const handleSpellClick = (spell: Spell) => {
    setSelectedItem(spell);
    setDialogType('spell');
    setIsDialogOpen(true);
  };

  const handleConditionClick = (condition: Condition) => {
    setSelectedItem(condition);
    setDialogType('condition');
    setIsDialogOpen(true);
  };

  const handleReferenceClick = (item: ReferenceItem) => {
    setSelectedItem(item);
    setDialogType('reference');
    setIsDialogOpen(true);
  };

  const handleBackgroundClick = (background: Background) => {
    setSelectedItem(background);
    setDialogType('background');
    setIsDialogOpen(true);
  };

  const handleFeatureClick = (feature: ClassFeature) => {
    setSelectedItem(feature);
    setDialogType('feature');
    setIsDialogOpen(true);
  };
  
  const handleFeatClick = (feat: Feat) => {
    setSelectedItem(feat);
    setDialogType('feat');
    setIsDialogOpen(true);
  };

  const renderDialogContent = () => {
    if (!selectedItem) return null;
    
    if (dialogType === 'spell') {
      const spell = selectedItem as Spell;
      return (
        <>
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="font-cinzel text-2xl">{spell.name}</DialogTitle>
                <DialogDescription className="text-lg">
                  {getSpellLevelText(spell.level)} {spell.school}
                </DialogDescription>
              </div>
              <Badge variant="outline">
                {GAME_SYSTEMS.find(s => s.value === spell.system)?.label}
              </Badge>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-semibold">Время накладывания:</span> {spell.castingTime}</div>
              <div><span className="font-semibold">Дистанция:</span> {spell.range}</div>
              <div><span className="font-semibold">Компоненты:</span> {spell.components}</div>
              <div><span className="font-semibold">Длительность:</span> {spell.duration}</div>
            </div>
            <Separator />
            <div>
              <p className="text-sm">{spell.description}</p>
              {spell.higherLevels && (
                <div className="mt-3">
                  <span className="font-semibold">На больших уровнях: </span>
                  <span className="text-sm">{spell.higherLevels}</span>
                </div>
              )}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm">Классы: </span>
                <span className="text-sm">{spell.classes.join(', ')}</span>
              </div>
              {spell.sourceUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={spell.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Источник
                  </a>
                </Button>
              )}
            </div>
          </div>
        </>
      );
    }
    
    if (dialogType === 'condition') {
      const condition = selectedItem as Condition;
      return (
        <>
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="font-cinzel text-2xl">{condition.name}</DialogTitle>
                <DialogDescription>Состояние</DialogDescription>
              </div>
              <Badge variant="outline">
                {GAME_SYSTEMS.find(s => s.value === condition.system)?.label}
              </Badge>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">{condition.description}</p>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Источник: {condition.source}
              </div>
              {condition.sourceUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={condition.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Источник
                  </a>
                </Button>
              )}
            </div>
          </div>
        </>
      );
    }
    
    if (dialogType === 'reference') {
      const item = selectedItem as ReferenceItem;
      const category = categories.find(c => c.id === item.categoryId);
      return (
        <>
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="font-cinzel text-2xl">{item.name}</DialogTitle>
                <DialogDescription>{category?.name || 'Правило'}</DialogDescription>
              </div>
              <Badge variant="outline">
                {GAME_SYSTEMS.find(s => s.value === item.system)?.label}
              </Badge>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">{item.description}</p>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Источник: {item.source}
              </div>
              {item.sourceUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Источник
                  </a>
                </Button>
              )}
            </div>
          </div>
        </>
      );
    }
    
    if (dialogType === 'background') {
        const background = selectedItem as Background;
        return (
            <>
            <DialogHeader>
                <div className="flex items-start justify-between">
                <div>
                    <DialogTitle className="font-cinzel text-2xl">{background.name}</DialogTitle>
                    <DialogDescription>Предыстория</DialogDescription>
                </div>
                <Badge variant="outline">
                    {GAME_SYSTEMS.find(s => s.value === background.system)?.label}
                </Badge>
                </div>
            </DialogHeader>
            <div className="space-y-4">
                <p className="text-sm">{background.description}</p>
                <Separator />
                <div className="space-y-2 text-sm">
                    <div><span className="font-semibold">Владение навыками:</span> {background.skillProficiencies}</div>
                    <div><span className="font-semibold">Владение инструментами:</span> {background.toolProficiencies}</div>
                    <div><span className="font-semibold">Снаряжение:</span> {background.equipment}</div>
                    <div><span className="font-semibold">Начальный капитал:</span> {background.startingGold} зм</div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Источник: {background.source}
                </div>
                {background.sourceUrl && (
                    <Button variant="outline" size="sm" asChild>
                    <a href={background.sourceUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Источник
                    </a>
                    </Button>
                )}
                </div>
            </div>
            </>
        );
    }

    if (dialogType === 'feature') {
      const feature = selectedItem as ClassFeature;
      return (
        <>
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="font-cinzel text-2xl">{feature.name}</DialogTitle>
                <DialogDescription>{feature.className} - Уровень {feature.level}</DialogDescription>
              </div>
              <Badge variant="outline">
                {GAME_SYSTEMS.find(s => s.value === feature.system)?.label}
              </Badge>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">{feature.description}</p>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Источник: {feature.source}
              </div>
              {feature.sourceUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={feature.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Источник
                  </a>
                </Button>
              )}
            </div>
          </div>
        </>
      );
    }
    
    if (dialogType === 'feat') {
      const feat = selectedItem as Feat;
      return (
        <>
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="font-cinzel text-2xl">{feat.name}</DialogTitle>
                <DialogDescription>
                  Требование: {feat.prerequisite || 'Нет'}
                </DialogDescription>
              </div>
              <Badge variant="outline">
                {GAME_SYSTEMS.find(s => s.value === feat.system)?.label}
              </Badge>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">{feat.description}</p>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Источник: {feat.source}
              </div>
              {feat.sourceUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={feat.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Источник
                  </a>
                </Button>
              )}
            </div>
          </div>
        </>
      );
    }

    return null;
  }

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
                <BookOpen className="h-8 w-8 text-primary" />
                <h1 className="text-4xl md:text-5xl font-cinzel font-bold">
                  <span className="fantasy-text-gradient">Справочник</span>
                </h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Полный справочник заклинаний, состояний и правил для различных игровых систем
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск..."
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все системы</SelectItem>
                    {GAME_SYSTEMS.map(system => (
                      <SelectItem key={system.value} value={system.value}>
                        {system.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="spells" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="spells">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Заклинания
                </TabsTrigger>
                <TabsTrigger value="conditions">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Состояния
                </TabsTrigger>
                <TabsTrigger value="reference">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Правила
                </TabsTrigger>
                <TabsTrigger value="backgrounds">
                  <BookUser className="h-4 w-4 mr-2" />
                  Предыстории
                </TabsTrigger>
                <TabsTrigger value="features">
                  <Star className="h-4 w-4 mr-2" />
                  Особенности
                </TabsTrigger>
                <TabsTrigger value="feats">
                  <Gem className="h-4 w-4 mr-2" />
                  Черты
                </TabsTrigger>
              </TabsList>

              <TabsContent value="spells" className="space-y-6">
                {/* Spell Filters */}
                <div className="flex flex-wrap gap-2">
                  <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Школа магии" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все школы</SelectItem>
                      {SPELL_SCHOOLS.map(school => (
                        <SelectItem key={school} value={school}>
                          {school}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Уровень" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все уровни</SelectItem>
                      {SPELL_LEVELS.map(level => (
                        <SelectItem key={level} value={level}>
                          {level === '0' ? 'Заговор' : `${level} ур.`}
                        </SelectItem>
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
                        <SelectItem key={cls} value={cls}>
                          {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Spells Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSpells.map((spell) => {
                    const SchoolIcon = getSchoolIcon(spell.school);
                    return (
                      <Card 
                        key={spell.id} 
                        className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group cursor-pointer"
                        onClick={() => handleSpellClick(spell)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <SchoolIcon className="h-5 w-5 text-primary" />
                              <div>
                                <CardTitle className="font-cinzel text-lg group-hover:text-primary transition-colors line-clamp-1">
                                  {spell.name}
                                </CardTitle>
                                <CardDescription>
                                  {getSpellLevelText(spell.level)} • {spell.school}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <Badge variant="outline" className="border-primary/50">
                                {GAME_SYSTEMS.find(s => s.value === spell.system)?.label}
                              </Badge>
                              {spell.concentration && (
                                <Badge variant="secondary" className="text-xs">
                                  Концентрация
                                </Badge>
                              )}
                              {spell.ritual && (
                                <Badge variant="secondary" className="text-xs">
                                  Ритуал
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>{spell.castingTime}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Target className="h-3 w-3 text-muted-foreground" />
                              <span>{spell.range}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {spell.description}
                          </p>

                          <div className="flex items-center justify-between pt-2 border-t border-border/50">
                            <div className="text-xs text-muted-foreground">
                              {spell.classes.slice(0, 2).join(', ')}
                              {spell.classes.length > 2 && ` +${spell.classes.length - 2}`}
                            </div>
                            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="conditions" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredConditions.map((condition) => (
                    <Card 
                      key={condition.id} 
                      className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group cursor-pointer"
                      onClick={() => handleConditionClick(condition)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            <CardTitle className="font-cinzel text-lg group-hover:text-primary transition-colors">
                              {condition.name}
                            </CardTitle>
                          </div>
                          <Badge variant="outline" className="border-primary/50">
                            {GAME_SYSTEMS.find(s => s.value === condition.system)?.label}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {condition.description}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          <div className="text-xs text-muted-foreground">
                            {condition.source}
                          </div>
                          <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reference" className="space-y-6">
                {selectedCategory ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Назад к категориям
                      </Button>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold font-cinzel">{selectedCategory.name}</h2>
                        <p className="text-muted-foreground">{selectedCategory.description}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {filteredReference.filter(rule => rule.categoryId === selectedCategory.id).length > 0 ? (
                          filteredReference.filter(rule => rule.categoryId === selectedCategory.id).map(item => (
                              <Card 
                                key={item.id} 
                                className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group cursor-pointer"
                                onClick={() => handleReferenceClick(item)}
                              >
                                <CardHeader>
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-2">
                                      <BookOpen className="h-5 w-5 text-blue-500" />
                                      <div>
                                        <CardTitle className="font-cinzel text-lg group-hover:text-primary transition-colors">
                                          {item.name}
                                        </CardTitle>
                                        <CardDescription>
                                          {item.source}
                                        </CardDescription>
                                      </div>
                                    </div>
                                    <Badge variant="outline" className="border-primary/50">
                                      {GAME_SYSTEMS.find(s => s.value === item.system)?.label}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {item.description}
                                  </p>
                                  <div className="flex justify-end pt-2 mt-2 border-t border-border/50">
                                    <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                          ))
                      ) : (
                          <div className="text-center py-12 text-muted-foreground">
                              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p>В этой категории пока нет правил.</p>
                          </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.filter(cat => selectedSystem === 'all' || cat.system === selectedSystem).map((category) => (
                      <Card 
                        key={category.id} 
                        className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group cursor-pointer overflow-hidden"
                        onClick={() => setSelectedCategory(category)}
                      >
                        <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${category.imageUrl || 'https://placehold.co/400x200.png'})` }} />
                        <CardHeader>
                          <CardTitle className="font-cinzel text-lg group-hover:text-primary transition-colors">
                            {category.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {category.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Badge variant="outline" className="border-primary/50">
                            {GAME_SYSTEMS.find(s => s.value === category.system)?.label}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="backgrounds" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBackgrounds.map((background) => (
                    <Card 
                      key={background.id} 
                      className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group cursor-pointer"
                      onClick={() => handleBackgroundClick(background)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <BookUser className="h-5 w-5 text-green-500" />
                            <CardTitle className="font-cinzel text-lg group-hover:text-primary transition-colors">
                              {background.name}
                            </CardTitle>
                          </div>
                          <Badge variant="outline" className="border-primary/50">
                            {GAME_SYSTEMS.find(s => s.value === background.system)?.label}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {background.description}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          <div className="text-xs text-muted-foreground">
                            {background.source}
                          </div>
                          <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="w-40">
                          <SelectValue placeholder="Класс" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">Все классы</SelectItem>
                          {DND_CLASSES.map(cls => (
                              <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFeatures.map((feature) => (
                    <Card 
                      key={feature.id} 
                      className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group cursor-pointer"
                      onClick={() => handleFeatureClick(feature)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            <CardTitle className="font-cinzel text-lg group-hover:text-primary transition-colors">
                              {feature.name}
                            </CardTitle>
                          </div>
                          <Badge variant="outline" className="border-primary/50">
                            {GAME_SYSTEMS.find(s => s.value === feature.system)?.label}
                          </Badge>
                        </div>
                        <CardDescription>{feature.className} (Уровень {feature.level})</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {feature.description}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          <div className="text-xs text-muted-foreground">
                            {feature.source}
                          </div>
                          <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="feats" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFeats.map((feat) => (
                    <Card 
                      key={feat.id} 
                      className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group cursor-pointer"
                      onClick={() => handleFeatClick(feat)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <Gem className="h-5 w-5 text-green-500" />
                            <CardTitle className="font-cinzel text-lg group-hover:text-primary transition-colors">
                              {feat.name}
                            </CardTitle>
                          </div>
                          <Badge variant="outline" className="border-primary/50">
                            {GAME_SYSTEMS.find(s => s.value === feat.system)?.label}
                          </Badge>
                        </div>
                        <CardDescription>Требование: {feat.prerequisite || 'Нет'}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {feat.description}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          <div className="text-xs text-muted-foreground">
                            {feat.source}
                          </div>
                          <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
