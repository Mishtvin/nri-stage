'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Scroll, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Wand2,
  Crown,
  Sword,
  Shield,
  Skull,
  Heart,
  Sparkles,
  MapPin,
  Users,
  Clock,
  Star,
  Dice6
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';

interface Quest {
  id: string;
  title: string;
  description: string;
  genre: 'fantasy' | 'horror' | 'mystery' | 'adventure' | 'political' | 'exploration';
  setting: 'urban' | 'wilderness' | 'dungeon' | 'planar' | 'underwater' | 'aerial';
  difficulty: 'easy' | 'medium' | 'hard' | 'deadly';
  level: string;
  duration: string;
  objectives: string[];
  rewards: string[];
  npcs: string[];
  locations: string[];
  hooks: string[];
  complications: string[];
  campaign: string;
  status: 'draft' | 'active' | 'completed';
  createdAt: string;
  generatedBy: 'manual' | 'ai';
  imageUrl?: string;
}

const genres = [
  { value: 'fantasy', label: 'Фэнтези', icon: Sparkles },
  { value: 'horror', label: 'Хоррор', icon: Skull },
  { value: 'mystery', label: 'Детектив', icon: Search },
  { value: 'adventure', label: 'Приключения', icon: Sword },
  { value: 'political', label: 'Политика', icon: Crown },
  { value: 'exploration', label: 'Исследования', icon: MapPin }
];

const settings = [
  { value: 'urban', label: 'Городской', icon: Crown },
  { value: 'wilderness', label: 'Дикая природа', icon: MapPin },
  { value: 'dungeon', label: 'Подземелье', icon: Shield },
  { value: 'planar', label: 'Планарный', icon: Sparkles },
  { value: 'underwater', label: 'Подводный', icon: Heart },
  { value: 'aerial', label: 'Воздушный', icon: Wand2 }
];

const difficulties = [
  { value: 'easy', label: 'Лёгкий', color: 'text-green-500' },
  { value: 'medium', label: 'Средний', color: 'text-yellow-500' },
  { value: 'hard', label: 'Сложный', color: 'text-orange-500' },
  { value: 'deadly', label: 'Смертельный', color: 'text-red-500' }
];

export default function MasterQuestsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [filteredQuests, setFilteredQuests] = useState<Quest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedSetting, setSelectedSetting] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);

  const [generatorForm, setGeneratorForm] = useState({
    genre: 'fantasy' as Quest['genre'],
    setting: 'urban' as Quest['setting'],
    difficulty: 'medium' as Quest['difficulty'],
    level: '1-3',
    theme: '',
    elements: ''
  });

  const [manualForm, setManualForm] = useState({
    title: '',
    description: '',
    genre: 'fantasy' as Quest['genre'],
    setting: 'urban' as Quest['setting'],
    difficulty: 'medium' as Quest['difficulty'],
    level: '1-3',
    duration: '2-4 часа',
    objectives: '',
    rewards: '',
    npcs: '',
    locations: '',
    hooks: '',
    complications: '',
    campaign: ''
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    // Load mock quests
    const mockQuests: Quest[] = [
      {
        id: '1',
        title: 'Тайна исчезнувшего торговца',
        description: 'Влиятельный торговец пропал без вести в городе Невервинтер. Его семья предлагает щедрую награду за информацию о его местонахождении.',
        genre: 'mystery',
        setting: 'urban',
        difficulty: 'medium',
        level: '3-5',
        duration: '3-4 часа',
        objectives: [
          'Найти следы торговца в последнем известном месте',
          'Допросить свидетелей и подозреваемых',
          'Раскрыть заговор гильдии воров',
          'Спасти торговца из подземного логова'
        ],
        rewards: ['500 золотых монет', 'Редкий магический предмет', 'Связи в торговой гильдии'],
        npcs: ['Леди Сильвана (жена торговца)', 'Капитан стражи Маркус', 'Информатор Крысолов'],
        locations: ['Таверна "Золотой кубок"', 'Торговый квартал', 'Канализация города'],
        hooks: [
          'Персонажи становятся свидетелями похищения',
          'Семья торговца нанимает группу',
          'Стража просит о помощи в расследовании'
        ],
        complications: [
          'Торговец замешан в незаконной торговле',
          'Похитители требуют выкуп',
          'В деле замешаны коррумпированные стражники'
        ],
        campaign: 'Dragon Heist',
        status: 'active',
        createdAt: '2024-01-10',
        generatedBy: 'ai',
        imageUrl: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg'
      },
      {
        id: '2',
        title: 'Проклятый лес Шепчущих Теней',
        description: 'Древний лес охвачен тёмной магией. Деревья шепчут проклятия, а тени оживают по ночам.',
        genre: 'horror',
        setting: 'wilderness',
        difficulty: 'hard',
        level: '5-7',
        duration: '4-6 часов',
        objectives: [
          'Исследовать источник проклятия',
          'Найти древний алтарь в центре леса',
          'Противостоять духу-хранителю',
          'Очистить лес от тёмной магии'
        ],
        rewards: ['Благословение природы', 'Древний друидский посох', '1000 опыта'],
        npcs: ['Друид Элдрик', 'Дух леса Мелания', 'Лесные звери'],
        locations: ['Край проклятого леса', 'Древний алтарь', 'Логово теневых существ'],
        hooks: [
          'Деревня просит очистить лес',
          'Друид нуждается в помощи',
          'Персонажи заблудились в лесу'
        ],
        complications: [
          'Проклятие влияет на разум',
          'Лес постоянно меняется',
          'Теневые существа преследуют группу'
        ],
        campaign: 'Curse of Strahd',
        status: 'draft',
        createdAt: '2024-01-12',
        generatedBy: 'ai',
        imageUrl: 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg'
      },
      {
        id: '3',
        title: 'Восстание в королевском дворце',
        description: 'Группа заговорщиков планирует свергнуть короля. Персонажи должны раскрыть заговор и защитить трон.',
        genre: 'political',
        setting: 'urban',
        difficulty: 'hard',
        level: '7-9',
        duration: '5-7 часов',
        objectives: [
          'Infiltrate the noble circles',
          'Gather evidence of the conspiracy',
          'Protect key witnesses',
          'Confront the conspiracy leaders'
        ],
        rewards: ['Королевская награда', 'Дворянский титул', 'Политическое влияние'],
        npcs: ['Король Алариус', 'Лорд Валентин (заговорщик)', 'Шпионка Изабелла'],
        locations: ['Королевский дворец', 'Дворянские особняки', 'Тайные встречи'],
        hooks: [
          'Персонажи узнают о заговоре случайно',
          'Король лично просит о помощи',
          'Один из заговорщиков хочет выйти из игры'
        ],
        complications: [
          'Заговорщики знают о расследовании',
          'Некоторые стражники на стороне мятежников',
          'Доказательства могут быть подделаны'
        ],
        campaign: 'Homebrew Campaign',
        status: 'completed',
        createdAt: '2024-01-08',
        generatedBy: 'manual'
      }
    ];
    setQuests(mockQuests);
    setFilteredQuests(mockQuests);
  }, []);

  useEffect(() => {
    let filtered = quests;

    if (searchTerm) {
      filtered = filtered.filter(quest => 
        quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quest.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre !== 'all') {
      filtered = filtered.filter(quest => quest.genre === selectedGenre);
    }

    if (selectedSetting !== 'all') {
      filtered = filtered.filter(quest => quest.setting === selectedSetting);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(quest => quest.difficulty === selectedDifficulty);
    }

    setFilteredQuests(filtered);
  }, [quests, searchTerm, selectedGenre, selectedSetting, selectedDifficulty]);

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

  const getGenreIcon = (genre: string) => {
    const genreData = genres.find(g => g.value === genre);
    return genreData ? genreData.icon : Scroll;
  };

  const getDifficultyColor = (difficulty: string) => {
    const difficultyData = difficulties.find(d => d.value === difficulty);
    return difficultyData ? difficultyData.color : 'text-gray-500';
  };

  const getDifficultyLabel = (difficulty: string) => {
    const difficultyData = difficulties.find(d => d.value === difficulty);
    return difficultyData ? difficultyData.label : difficulty;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500';
      case 'completed': return 'bg-blue-500/10 text-blue-500';
      case 'draft': return 'bg-gray-500/10 text-gray-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активный';
      case 'completed': return 'Завершён';
      case 'draft': return 'Черновик';
      default: return status;
    }
  };

  const handleGenerateQuest = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const generatedQuest: Quest = {
      id: Date.now().toString(),
      title: `Сгенерированный квест: ${generatorForm.theme || 'Приключение'}`,
      description: `Увлекательное приключение в стиле ${genres.find(g => g.value === generatorForm.genre)?.label.toLowerCase()} с элементами ${generatorForm.elements}. Идеально подходит для группы ${generatorForm.level} уровня.`,
      genre: generatorForm.genre,
      setting: generatorForm.setting,
      difficulty: generatorForm.difficulty,
      level: generatorForm.level,
      duration: '3-5 часов',
      objectives: [
        'Исследовать загадочную локацию',
        'Встретиться с ключевыми NPC',
        'Преодолеть основное препятствие',
        'Получить награду за выполнение'
      ],
      rewards: ['Опыт и золото', 'Магический предмет', 'Новые связи'],
      npcs: ['Квестодатель', 'Союзник', 'Антагонист'],
      locations: ['Стартовая локация', 'Основная локация', 'Финальная локация'],
      hooks: ['Прямое обращение', 'Случайная встреча', 'Слухи в таверне'],
      complications: ['Неожиданный поворот', 'Дополнительные враги', 'Моральная дилемма'],
      campaign: 'Новая кампания',
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      generatedBy: 'ai',
      imageUrl: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg'
    };

    setQuests(prev => [generatedQuest, ...prev]);
    setIsGenerating(false);
    setIsDialogOpen(false);
  };

  const handleSaveManualQuest = () => {
    const newQuest: Quest = {
      id: editingQuest ? editingQuest.id : Date.now().toString(),
      title: manualForm.title,
      description: manualForm.description,
      genre: manualForm.genre,
      setting: manualForm.setting,
      difficulty: manualForm.difficulty,
      level: manualForm.level,
      duration: manualForm.duration,
      objectives: manualForm.objectives.split('\n').filter(o => o.trim()),
      rewards: manualForm.rewards.split('\n').filter(r => r.trim()),
      npcs: manualForm.npcs.split('\n').filter(n => n.trim()),
      locations: manualForm.locations.split('\n').filter(l => l.trim()),
      hooks: manualForm.hooks.split('\n').filter(h => h.trim()),
      complications: manualForm.complications.split('\n').filter(c => c.trim()),
      campaign: manualForm.campaign,
      status: 'draft',
      createdAt: editingQuest ? editingQuest.createdAt : new Date().toISOString().split('T')[0],
      generatedBy: 'manual'
    };

    if (editingQuest) {
      setQuests(prev => prev.map(quest => quest.id === editingQuest.id ? newQuest : quest));
    } else {
      setQuests(prev => [newQuest, ...prev]);
    }

    setIsDialogOpen(false);
  };

  const handleEditQuest = (quest: Quest) => {
    setEditingQuest(quest);
    setManualForm({
      title: quest.title,
      description: quest.description,
      genre: quest.genre,
      setting: quest.setting,
      difficulty: quest.difficulty,
      level: quest.level,
      duration: quest.duration,
      objectives: quest.objectives.join('\n'),
      rewards: quest.rewards.join('\n'),
      npcs: quest.npcs.join('\n'),
      locations: quest.locations.join('\n'),
      hooks: quest.hooks.join('\n'),
      complications: quest.complications.join('\n'),
      campaign: quest.campaign
    });
    setIsDialogOpen(true);
  };

  const handleDeleteQuest = (questId: string) => {
    setQuests(prev => prev.filter(quest => quest.id !== questId));
  };

  const toggleQuestStatus = (questId: string) => {
    setQuests(prev => prev.map(quest => {
      if (quest.id === questId) {
        const statusOrder = ['draft', 'active', 'completed'];
        const currentIndex = statusOrder.indexOf(quest.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        return { ...quest, status: statusOrder[nextIndex] as Quest['status'] };
      }
      return quest;
    }));
  };

  return (
    <div className="min-h-screen bg-background dice-pattern">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/50 to-primary/5" />
      <Navbar />
      
      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Scroll className="h-8 w-8 text-primary" />
                  <h1 className="text-4xl md:text-5xl font-cinzel font-bold">
                    <span className="fantasy-text-gradient">Хаб квестов</span>
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground">
                  Создавайте и управляйте квестами с помощью ИИ или вручную
                </p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setEditingQuest(null);
                      setManualForm({
                        title: '',
                        description: '',
                        genre: 'fantasy',
                        setting: 'urban',
                        difficulty: 'medium',
                        level: '1-3',
                        duration: '2-4 часа',
                        objectives: '',
                        rewards: '',
                        npcs: '',
                        locations: '',
                        hooks: '',
                        complications: '',
                        campaign: ''
                      });
                    }}
                    className="fantasy-gradient hover:opacity-90 transition-opacity"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Создать квест
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-cinzel text-2xl">
                      {editingQuest ? 'Редактировать квест' : 'Создать новый квест'}
                    </DialogTitle>
                    <DialogDescription>
                      Используйте ИИ-генератор для быстрого создания или создайте квест вручную
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue={editingQuest ? "manual" : "generator"} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="generator" disabled={editingQuest !== null}>
                        <Wand2 className="h-4 w-4 mr-2" />
                        ИИ Генератор
                      </TabsTrigger>
                      <TabsTrigger value="manual">
                        <Edit className="h-4 w-4 mr-2" />
                        Ручное создание
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="generator" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Жанр</Label>
                          <Select
                            value={generatorForm.genre}
                            onValueChange={(value) => setGeneratorForm(prev => ({ ...prev, genre: value as Quest['genre'] }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {genres.map(genre => (
                                <SelectItem key={genre.value} value={genre.value}>
                                  {genre.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Сеттинг</Label>
                          <Select
                            value={generatorForm.setting}
                            onValueChange={(value) => setGeneratorForm(prev => ({ ...prev, setting: value as Quest['setting'] }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {settings.map(setting => (
                                <SelectItem key={setting.value} value={setting.value}>
                                  {setting.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Сложность</Label>
                          <Select
                            value={generatorForm.difficulty}
                            onValueChange={(value) => setGeneratorForm(prev => ({ ...prev, difficulty: value as Quest['difficulty'] }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {difficulties.map(difficulty => (
                                <SelectItem key={difficulty.value} value={difficulty.value}>
                                  <span className={difficulty.color}>{difficulty.label}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Уровень группы</Label>
                          <Select
                            value={generatorForm.level}
                            onValueChange={(value) => setGeneratorForm(prev => ({ ...prev, level: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-3">1-3 уровень</SelectItem>
                              <SelectItem value="4-6">4-6 уровень</SelectItem>
                              <SelectItem value="7-9">7-9 уровень</SelectItem>
                              <SelectItem value="10-12">10-12 уровень</SelectItem>
                              <SelectItem value="13-15">13-15 уровень</SelectItem>
                              <SelectItem value="16-20">16-20 уровень</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Тема квеста (опционально)</Label>
                        <Input
                          value={generatorForm.theme}
                          onChange={(e) => setGeneratorForm(prev => ({ ...prev, theme: e.target.value }))}
                          placeholder="Например: поиск артефакта, спасение принцессы, расследование убийства..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Дополнительные элементы</Label>
                        <Textarea
                          value={generatorForm.elements}
                          onChange={(e) => setGeneratorForm(prev => ({ ...prev, elements: e.target.value }))}
                          placeholder="Опишите специфические элементы, которые хотите включить: драконы, нежить, политические интриги, древние руины..."
                          rows={3}
                        />
                      </div>

                      <Button 
                        onClick={handleGenerateQuest}
                        disabled={isGenerating}
                        className="w-full fantasy-gradient"
                      >
                        {isGenerating ? (
                          <>
                            <Dice6 className="h-4 w-4 mr-2 animate-spin" />
                            Генерация квеста...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-4 w-4 mr-2" />
                            Сгенерировать квест
                          </>
                        )}
                      </Button>
                    </TabsContent>

                    <TabsContent value="manual" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Название квеста</Label>
                          <Input
                            value={manualForm.title}
                            onChange={(e) => setManualForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Введите название квеста"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Кампания</Label>
                          <Input
                            value={manualForm.campaign}
                            onChange={(e) => setManualForm(prev => ({ ...prev, campaign: e.target.value }))}
                            placeholder="Название кампании"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Описание</Label>
                        <Textarea
                          value={manualForm.description}
                          onChange={(e) => setManualForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Опишите основную идею и сюжет квеста..."
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Жанр</Label>
                          <Select
                            value={manualForm.genre}
                            onValueChange={(value) => setManualForm(prev => ({ ...prev, genre: value as Quest['genre'] }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {genres.map(genre => (
                                <SelectItem key={genre.value} value={genre.value}>
                                  {genre.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Сеттинг</Label>
                          <Select
                            value={manualForm.setting}
                            onValueChange={(value) => setManualForm(prev => ({ ...prev, setting: value as Quest['setting'] }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {settings.map(setting => (
                                <SelectItem key={setting.value} value={setting.value}>
                                  {setting.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Сложность</Label>
                          <Select
                            value={manualForm.difficulty}
                            onValueChange={(value) => setManualForm(prev => ({ ...prev, difficulty: value as Quest['difficulty'] }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {difficulties.map(difficulty => (
                                <SelectItem key={difficulty.value} value={difficulty.value}>
                                  <span className={difficulty.color}>{difficulty.label}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Уровень группы</Label>
                          <Input
                            value={manualForm.level}
                            onChange={(e) => setManualForm(prev => ({ ...prev, level: e.target.value }))}
                            placeholder="1-3, 4-6, etc."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Продолжительность</Label>
                          <Input
                            value={manualForm.duration}
                            onChange={(e) => setManualForm(prev => ({ ...prev, duration: e.target.value }))}
                            placeholder="2-4 часа"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Цели (каждая с новой строки)</Label>
                          <Textarea
                            value={manualForm.objectives}
                            onChange={(e) => setManualForm(prev => ({ ...prev, objectives: e.target.value }))}
                            placeholder="Найти артефакт&#10;Победить босса&#10;Спасти NPC"
                            rows={4}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Награды (каждая с новой строки)</Label>
                          <Textarea
                            value={manualForm.rewards}
                            onChange={(e) => setManualForm(prev => ({ ...prev, rewards: e.target.value }))}
                            placeholder="1000 золота&#10;Магический меч&#10;Опыт"
                            rows={4}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>NPC (каждый с новой строки)</Label>
                          <Textarea
                            value={manualForm.npcs}
                            onChange={(e) => setManualForm(prev => ({ ...prev, npcs: e.target.value }))}
                            placeholder="Квестодатель&#10;Союзник&#10;Антагонист"
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Локации (каждая с новой строки)</Label>
                          <Textarea
                            value={manualForm.locations}
                            onChange={(e) => setManualForm(prev => ({ ...prev, locations: e.target.value }))}
                            placeholder="Таверна&#10;Подземелье&#10;Замок"
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Зацепки (каждая с новой строки)</Label>
                          <Textarea
                            value={manualForm.hooks}
                            onChange={(e) => setManualForm(prev => ({ ...prev, hooks: e.target.value }))}
                            placeholder="Прямое обращение&#10;Слухи в таверне&#10;Случайная встреча"
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Осложнения (каждое с новой строки)</Label>
                          <Textarea
                            value={manualForm.complications}
                            onChange={(e) => setManualForm(prev => ({ ...prev, complications: e.target.value }))}
                            placeholder="Предательство союзника&#10;Дополнительные враги&#10;Моральная дилемма"
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-4">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Отмена
                        </Button>
                        <Button onClick={handleSaveManualQuest} className="fantasy-gradient">
                          {editingQuest ? 'Сохранить изменения' : 'Создать квест'}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск квестов..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все жанры</SelectItem>
                    {genres.map(genre => (
                      <SelectItem key={genre.value} value={genre.value}>
                        {genre.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedSetting} onValueChange={setSelectedSetting}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все сеттинги</SelectItem>
                    {settings.map(setting => (
                      <SelectItem key={setting.value} value={setting.value}>
                        {setting.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все сложности</SelectItem>
                    {difficulties.map(difficulty => (
                      <SelectItem key={difficulty.value} value={difficulty.value}>
                        <span className={difficulty.color}>{difficulty.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quests Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredQuests.map((quest) => {
                const GenreIcon = getGenreIcon(quest.genre);
                return (
                  <Card key={quest.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
                    {quest.imageUrl && (
                      <div className="h-48 bg-cover bg-center rounded-t-lg" style={{ backgroundImage: `url(${quest.imageUrl})` }}>
                        <div className="h-full bg-gradient-to-t from-black/60 to-transparent rounded-t-lg flex items-end p-4">
                          <Badge className={getStatusColor(quest.status)}>
                            {getStatusText(quest.status)}
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <GenreIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="font-cinzel text-lg group-hover:text-primary transition-colors line-clamp-2">
                              {quest.title}
                            </CardTitle>
                            <CardDescription>
                              {genres.find(g => g.value === quest.genre)?.label} • {settings.find(s => s.value === quest.setting)?.label}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getDifficultyColor(quest.difficulty)}>
                            {getDifficultyLabel(quest.difficulty)}
                          </Badge>
                          {quest.generatedBy === 'ai' && (
                            <Badge variant="outline" className="border-primary/50">
                              <Wand2 className="h-3 w-3 mr-1" />
                              ИИ
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {quest.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-primary" />
                          <span>Уровень {quest.level}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{quest.duration}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          Кампания: {quest.campaign}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Создан: {new Date(quest.createdAt).toLocaleDateString('ru-RU')}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditQuest(quest)}
                            className="hover:bg-primary/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteQuest(quest.id)}
                            className="hover:bg-destructive/10 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleQuestStatus(quest.id)}
                          className="border-primary/50 hover:bg-primary/10"
                        >
                          <Star className="h-4 w-4 mr-2" />
                          {quest.status === 'draft' ? 'Активировать' : 
                           quest.status === 'active' ? 'Завершить' : 'В черновики'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredQuests.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Scroll className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-cinzel font-semibold text-lg mb-2">Квесты не найдены</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedGenre !== 'all' || selectedSetting !== 'all' || selectedDifficulty !== 'all'
                      ? 'Попробуйте изменить фильтры поиска'
                      : 'Создайте свой первый квест с помощью ИИ или вручную'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}