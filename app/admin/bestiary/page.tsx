'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Skull, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  Upload, 
  Filter,
  FileText,
  Save
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { monsterStore } from '@/lib/data-store';
import { Monster } from '@/components/bestiary/types';

export default function AdminBestiaryPage() {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [filteredMonsters, setFilteredMonsters] = useState<Monster[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSystem, setSelectedSystem] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddMonsterDialogOpen, setIsAddMonsterDialogOpen] = useState(false);
  const [isEditMonsterDialogOpen, setIsEditMonsterDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [monsterToDelete, setMonsterToDelete] = useState<Monster | null>(null);
  const [monsterToEdit, setMonsterToEdit] = useState<Monster | null>(null);
  const [currentTab, setCurrentTab] = useState('all');
  const [activeFormTab, setActiveFormTab] = useState('basic');

  // Форма для добавления/редактирования монстра
  const [formData, setFormData] = useState({
    name: '',
    type: 'Humanoid',
    size: 'Medium',
    alignment: 'Neutral',
    challengeRating: '1',
    armorClass: 10,
    hitPoints: '10 (1d8+2)',
    speed: '30 ft.',
    environment: [] as string[],
    source: 'Monster Manual',
    system: 'dnd5e',
    description: '',
    imageUrl: '',
    // Добавляем поля для характеристик
    stats: {
      str: 10,
      dex: 10,
      con: 10,
      int: 10,
      wis: 10,
      cha: 10
    },
    // Добавляем поля для способностей
    abilities: [] as {name: string, description: string}[],
    actions: [] as {name: string, description: string}[],
    legendaryActions: [] as {name: string, description: string}[],
    // Дополнительные поля
    savingThrows: '',
    skills: '',
    damageResistances: '',
    damageImmunities: '',
    conditionImmunities: '',
    senses: 'Passive Perception 10',
    languages: 'Common'
  });

  // Загрузка монстров
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = monsterStore.onChange((newMonsters) => {
      setMonsters(newMonsters);
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Фильтрация монстров
  useEffect(() => {
    let filtered = monsters;
    
    // Фильтр по вкладке
    if (currentTab === 'dnd5e') {
      filtered = filtered.filter(monster => monster.system === 'dnd5e');
    } else if (currentTab === 'pathfinder') {
      filtered = filtered.filter(monster => monster.system === 'pathfinder');
    } else if (currentTab === 'dnd35') {
      filtered = filtered.filter(monster => monster.system === 'dnd35');
    } else if (currentTab === 'other') {
      filtered = filtered.filter(monster => monster.system === 'other');
    }
    
    // Фильтр по поиску
    if (searchTerm) {
      filtered = filtered.filter(monster => 
        monster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        monster.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Фильтр по типу
    if (selectedType !== 'all') {
      filtered = filtered.filter(monster => monster.type === selectedType);
    }
    
    // Фильтр по системе
    if (selectedSystem !== 'all') {
      filtered = filtered.filter(monster => monster.system === selectedSystem);
    }
    
    setFilteredMonsters(filtered);
  }, [monsters, searchTerm, selectedType, selectedSystem, currentTab]);

  // Обработчики действий
  const handleAddMonster = () => {
    setFormData({
      name: '',
      type: 'Humanoid',
      size: 'Medium',
      alignment: 'Neutral',
      challengeRating: '1',
      armorClass: 10,
      hitPoints: '10 (1d8+2)',
      speed: '30 ft.',
      environment: [],
      source: 'Monster Manual',
      system: 'dnd5e',
      description: '',
      imageUrl: '',
      stats: {
        str: 10,
        dex: 10,
        con: 10,
        int: 10,
        wis: 10,
        cha: 10
      },
      abilities: [],
      actions: [],
      legendaryActions: [],
      savingThrows: '',
      skills: '',
      damageResistances: '',
      damageImmunities: '',
      conditionImmunities: '',
      senses: 'Passive Perception 10',
      languages: 'Common'
    });
    setActiveFormTab('basic');
    setIsAddMonsterDialogOpen(true);
  };

  const handleEditMonster = (monster: Monster) => {
    setMonsterToEdit(monster);
    setFormData({
      name: monster.name,
      type: monster.type,
      size: monster.size,
      alignment: monster.alignment,
      challengeRating: monster.challengeRating,
      armorClass: monster.armorClass,
      hitPoints: monster.hitPoints,
      speed: monster.speed,
      environment: monster.environment,
      source: monster.source,
      system: monster.system,
      description: monster.description || '',
      imageUrl: monster.imageUrl || '',
      stats: monster.stats,
      abilities: monster.abilities || [],
      actions: monster.actions || [],
      legendaryActions: monster.legendaryActions || [],
      savingThrows: monster.savingThrows || '',
      skills: monster.skills || '',
      damageResistances: monster.damageResistances || '',
      damageImmunities: monster.damageImmunities || '',
      conditionImmunities: monster.conditionImmunities || '',
      senses: monster.senses || 'Passive Perception 10',
      languages: monster.languages || 'Common'
    });
    setActiveFormTab('basic');
    setIsEditMonsterDialogOpen(true);
  };

  const handleSaveMonster = (isEdit: boolean) => {
    // Базовые данные для монстра
    const monsterData: Partial<Monster> = {
      name: formData.name,
      type: formData.type,
      size: formData.size as Monster['size'],
      alignment: formData.alignment,
      challengeRating: formData.challengeRating,
      armorClass: formData.armorClass,
      hitPoints: formData.hitPoints,
      speed: formData.speed,
      environment: formData.environment,
      source: formData.source,
      system: formData.system as Monster['system'],
      imageUrl: formData.imageUrl,
      stats: formData.stats,
      abilities: formData.abilities,
      actions: formData.actions,
      legendaryActions: formData.legendaryActions,
      savingThrows: formData.savingThrows,
      skills: formData.skills,
      damageResistances: formData.damageResistances,
      damageImmunities: formData.damageImmunities,
      conditionImmunities: formData.conditionImmunities,
      senses: formData.senses,
      languages: formData.languages
    };
    
    if (isEdit && monsterToEdit) {
      // Обновляем существующего монстра
      monsterStore.update(monsterToEdit.id, monsterData);
      setIsEditMonsterDialogOpen(false);
      
      toast.success("Монстр обновлен", {
        description: `${formData.name} был успешно обновлен`,
      });
    } else {
      // Добавляем нового монстра
      const newMonster: Omit<Monster, 'id'> = {
        ...monsterData as any,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      
      monsterStore.add(newMonster);
      setIsAddMonsterDialogOpen(false);
      
      toast.success("Монстр добавлен", {
        description: `${formData.name} был успешно добавлен в бестиарий`,
      });
    }
  };

  const handleDeleteMonster = (monster: Monster) => {
    setMonsterToDelete(monster);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteMonster = () => {
    if (monsterToDelete) {
      // Удаляем монстра из списка
      monsterStore.delete(monsterToDelete.id);
      setIsDeleteDialogOpen(false);
      setMonsterToDelete(null);
      
      toast.success("Монстр удален", {
        description: `${monsterToDelete.name} был успешно удален`,
      });
    }
  };

  const handleExportMonsters = () => {
    // Подготовка данных для экспорта
    const dataToExport = JSON.stringify(monsters, null, 2);
    
    // Создание и скачивание файла
    const blob = new Blob([dataToExport], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'monsters-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.info("Экспорт завершен", {
      description: "Файл monsters-export.json был успешно скачан",
    });
  };

  const handleImportMonsters = () => {
    // В реальном приложении здесь была бы логика импорта
    toast.info("Импорт монстров", {
      description: "Функция импорта находится в разработке",
    });
  };

  // Обработчики для способностей
  const handleAddAbility = () => {
    setFormData({
      ...formData,
      abilities: [...formData.abilities, { name: 'Новая способность', description: '' }]
    });
  };

  const handleUpdateAbility = (index: number, field: string, value: string) => {
    const newAbilities = [...formData.abilities];
    newAbilities[index] = { ...newAbilities[index], [field]: value };
    setFormData({ ...formData, abilities: newAbilities });
  };

  const handleRemoveAbility = (index: number) => {
    const newAbilities = formData.abilities.filter((_, i) => i !== index);
    setFormData({ ...formData, abilities: newAbilities });
  };

  // Обработчики для действий
  const handleAddAction = () => {
    setFormData({
      ...formData,
      actions: [...formData.actions, { name: 'Новое действие', description: '' }]
    });
  };

  const handleUpdateAction = (index: number, field: string, value: string) => {
    const newActions = [...formData.actions];
    newActions[index] = { ...newActions[index], [field]: value };
    setFormData({ ...formData, actions: newActions });
  };

  const handleRemoveAction = (index: number) => {
    const newActions = formData.actions.filter((_, i) => i !== index);
    setFormData({ ...formData, actions: newActions });
  };

  // Обработчики для легендарных действий
  const handleAddLegendaryAction = () => {
    setFormData({
      ...formData,
      legendaryActions: [...formData.legendaryActions, { name: 'Новое легендарное действие', description: '' }]
    });
  };

  const handleUpdateLegendaryAction = (index: number, field: string, value: string) => {
    const newLegendaryActions = [...formData.legendaryActions];
    newLegendaryActions[index] = { ...newLegendaryActions[index], [field]: value };
    setFormData({ ...formData, legendaryActions: newLegendaryActions });
  };

  const handleRemoveLegendaryAction = (index: number) => {
    const newLegendaryActions = formData.legendaryActions.filter((_, i) => i !== index);
    setFormData({ ...formData, legendaryActions: newLegendaryActions });
  };

  // Получение цвета для CR
  const getCRColor = (cr: string) => {
    const crNum = cr.includes('/') ? parseFloat(cr.split('/')[0]) / parseFloat(cr.split('/')[1]) : parseFloat(cr);
    if (crNum < 1) return 'bg-green-500/10 text-green-500';
    if (crNum < 5) return 'bg-yellow-500/10 text-yellow-500';
    if (crNum < 10) return 'bg-orange-500/10 text-orange-500';
    if (crNum < 20) return 'bg-red-500/10 text-red-500';
    return 'bg-purple-500/10 text-purple-500';
  };

  // Получение цвета для системы
  const getSystemColor = (system: string) => {
    switch (system) {
      case 'dnd5e': return 'bg-blue-500/10 text-blue-500';
      case 'pathfinder': return 'bg-green-500/10 text-green-500';
      case 'dnd35': return 'bg-purple-500/10 text-purple-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  // Получение названия системы
  const getSystemName = (system: string) => {
    switch (system) {
      case 'dnd5e': return 'D&D 5e';
      case 'pathfinder': return 'Pathfinder';
      case 'dnd35': return 'D&D 3.5e';
      default: return 'Другая';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Управление бестиарием</h1>
          <p className="text-muted-foreground">
            Просмотр и управление монстрами и существами
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleAddMonster}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить монстра
          </Button>
          <Button variant="outline" onClick={handleExportMonsters}>
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
          <Button variant="outline" onClick={handleImportMonsters}>
            <Upload className="h-4 w-4 mr-2" />
            Импорт
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Бестиарий</CardTitle>
          <CardDescription>
            Всего монстров: {monsters.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Фильтры и поиск */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск монстров..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    <SelectItem value="Dragon">Dragon</SelectItem>
                    <SelectItem value="Humanoid">Humanoid</SelectItem>
                    <SelectItem value="Beast">Beast</SelectItem>
                    <SelectItem value="Undead">Undead</SelectItem>
                    <SelectItem value="Fiend">Fiend</SelectItem>
                    <SelectItem value="Celestial">Celestial</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Система" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все системы</SelectItem>
                    <SelectItem value="dnd5e">D&D 5e</SelectItem>
                    <SelectItem value="pathfinder">Pathfinder</SelectItem>
                    <SelectItem value="dnd35">D&D 3.5e</SelectItem>
                    <SelectItem value="other">Другие</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Вкладки */}
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList>
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="dnd5e">D&D 5e</TabsTrigger>
                <TabsTrigger value="pathfinder">Pathfinder</TabsTrigger>
                <TabsTrigger value="dnd35">D&D 3.5e</TabsTrigger>
                <TabsTrigger value="other">Другие</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Таблица монстров */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Имя</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Размер</TableHead>
                    <TableHead>CR</TableHead>
                    <TableHead>AC</TableHead>
                    <TableHead>HP</TableHead>
                    <TableHead>Система</TableHead>
                    <TableHead>Источник</TableHead>
                    <TableHead>Дата создания</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center">
                          <Skull className="h-8 w-8 text-muted-foreground animate-pulse mb-2" />
                          <p className="text-muted-foreground">Загрузка монстров...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredMonsters.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center">
                          <Skull className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">Монстры не найдены</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMonsters.map((monster) => (
                      <TableRow key={monster.id}>
                        <TableCell className="font-medium">{monster.name}</TableCell>
                        <TableCell>{monster.type}</TableCell>
                        <TableCell>{monster.size}</TableCell>
                        <TableCell>
                          <Badge className={getCRColor(monster.challengeRating)}>
                            {monster.challengeRating}
                          </Badge>
                        </TableCell>
                        <TableCell>{monster.armorClass}</TableCell>
                        <TableCell>{monster.hitPoints.split(' ')[0]}</TableCell>
                        <TableCell>
                          <Badge className={getSystemColor(monster.system)}>
                            {getSystemName(monster.system)}
                          </Badge>
                        </TableCell>
                        <TableCell>{monster.source}</TableCell>
                        <TableCell>{monster.createdAt || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Действия</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEditMonster(monster)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log('View monster', monster.name)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Просмотреть
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log('Duplicate monster', monster.name)}>
                                <FileText className="h-4 w-4 mr-2" />
                                Дублировать
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteMonster(monster)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Диалог добавления монстра */}
      <Dialog open={isAddMonsterDialogOpen} onOpenChange={setIsAddMonsterDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Добавить монстра</DialogTitle>
            <DialogDescription>
              Создайте нового монстра для бестиария
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Tabs value={activeFormTab} onValueChange={setActiveFormTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="basic">Основное</TabsTrigger>
                <TabsTrigger value="stats">Характеристики</TabsTrigger>
                <TabsTrigger value="abilities">Способности</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя</Label>
                    <Input 
                      id="name" 
                      placeholder="Имя монстра" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Тип</Label>
                    <Select 
                      value={formData.type}
                      onValueChange={(value) => setFormData({...formData, type: value})}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dragon">Dragon</SelectItem>
                        <SelectItem value="Humanoid">Humanoid</SelectItem>
                        <SelectItem value="Beast">Beast</SelectItem>
                        <SelectItem value="Undead">Undead</SelectItem>
                        <SelectItem value="Fiend">Fiend</SelectItem>
                        <SelectItem value="Celestial">Celestial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="size">Размер</Label>
                    <Select 
                      value={formData.size}
                      onValueChange={(value) => setFormData({...formData, size: value})}
                    >
                      <SelectTrigger id="size">
                        <SelectValue placeholder="Выберите размер" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tiny">Tiny</SelectItem>
                        <SelectItem value="Small">Small</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Large">Large</SelectItem>
                        <SelectItem value="Huge">Huge</SelectItem>
                        <SelectItem value="Gargantuan">Gargantuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alignment">Мировоззрение</Label>
                    <Select 
                      value={formData.alignment}
                      onValueChange={(value) => setFormData({...formData, alignment: value})}
                    >
                      <SelectTrigger id="alignment">
                        <SelectValue placeholder="Выберите мировоззрение" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lawful Good">Lawful Good</SelectItem>
                        <SelectItem value="Neutral Good">Neutral Good</SelectItem>
                        <SelectItem value="Chaotic Good">Chaotic Good</SelectItem>
                        <SelectItem value="Lawful Neutral">Lawful Neutral</SelectItem>
                        <SelectItem value="True Neutral">True Neutral</SelectItem>
                        <SelectItem value="Chaotic Neutral">Chaotic Neutral</SelectItem>
                        <SelectItem value="Lawful Evil">Lawful Evil</SelectItem>
                        <SelectItem value="Neutral Evil">Neutral Evil</SelectItem>
                        <SelectItem value="Chaotic Evil">Chaotic Evil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="challengeRating">Challenge Rating</Label>
                    <Select 
                      value={formData.challengeRating}
                      onValueChange={(value) => setFormData({...formData, challengeRating: value})}
                    >
                      <SelectTrigger id="challengeRating">
                        <SelectValue placeholder="Выберите CR" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="1/8">1/8</SelectItem>
                        <SelectItem value="1/4">1/4</SelectItem>
                        <SelectItem value="1/2">1/2</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="system">Игровая система</Label>
                    <Select 
                      value={formData.system}
                      onValueChange={(value) => setFormData({...formData, system: value})}
                    >
                      <SelectTrigger id="system">
                        <SelectValue placeholder="Выберите систему" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dnd5e">D&D 5e</SelectItem>
                        <SelectItem value="pathfinder">Pathfinder</SelectItem>
                        <SelectItem value="dnd35">D&D 3.5e</SelectItem>
                        <SelectItem value="other">Другая</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Описание монстра..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="source">Источник</Label>
                    <Input 
                      id="source" 
                      placeholder="Например: Monster Manual" 
                      value={formData.source}
                      onChange={(e) => setFormData({...formData, source: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">URL изображения</Label>
                    <Input 
                      id="imageUrl" 
                      placeholder="https://example.com/image.jpg" 
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="stats" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="armorClass">Класс доспеха (AC)</Label>
                    <Input 
                      id="armorClass" 
                      type="number" 
                      placeholder="15" 
                      value={formData.armorClass}
                      onChange={(e) => setFormData({...formData, armorClass: parseInt(e.target.value) || 10})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hitPoints">Хиты (HP)</Label>
                    <Input 
                      id="hitPoints" 
                      placeholder="45 (6d8 + 18)" 
                      value={formData.hitPoints}
                      onChange={(e) => setFormData({...formData, hitPoints: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="speed">Скорость</Label>
                  <Input 
                    id="speed" 
                    placeholder="30 ft., fly 60 ft." 
                    value={formData.speed}
                    onChange={(e) => setFormData({...formData, speed: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-6 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="str">STR</Label>
                    <Input 
                      id="str" 
                      type="number" 
                      placeholder="10" 
                      value={formData.stats.str}
                      onChange={(e) => setFormData({
                        ...formData, 
                        stats: {...formData.stats, str: parseInt(e.target.value) || 10}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dex">DEX</Label>
                    <Input 
                      id="dex" 
                      type="number" 
                      placeholder="10" 
                      value={formData.stats.dex}
                      onChange={(e) => setFormData({
                        ...formData, 
                        stats: {...formData.stats, dex: parseInt(e.target.value) || 10}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="con">CON</Label>
                    <Input 
                      id="con" 
                      type="number" 
                      placeholder="10" 
                      value={formData.stats.con}
                      onChange={(e) => setFormData({
                        ...formData, 
                        stats: {...formData.stats, con: parseInt(e.target.value) || 10}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="int">INT</Label>
                    <Input 
                      id="int" 
                      type="number" 
                      placeholder="10" 
                      value={formData.stats.int}
                      onChange={(e) => setFormData({
                        ...formData, 
                        stats: {...formData.stats, int: parseInt(e.target.value) || 10}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wis">WIS</Label>
                    <Input 
                      id="wis" 
                      type="number" 
                      placeholder="10" 
                      value={formData.stats.wis}
                      onChange={(e) => setFormData({
                        ...formData, 
                        stats: {...formData.stats, wis: parseInt(e.target.value) || 10}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cha">CHA</Label>
                    <Input 
                      id="cha" 
                      type="number" 
                      placeholder="10" 
                      value={formData.stats.cha}
                      onChange={(e) => setFormData({
                        ...formData, 
                        stats: {...formData.stats, cha: parseInt(e.target.value) || 10}
                      })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="savingThrows">Спасброски</Label>
                    <Input 
                      id="savingThrows" 
                      placeholder="Dex +3, Con +5, Wis +2" 
                      value={formData.savingThrows}
                      onChange={(e) => setFormData({...formData, savingThrows: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Навыки</Label>
                    <Input 
                      id="skills" 
                      placeholder="Perception +5, Stealth +3" 
                      value={formData.skills}
                      onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="damageResistances">Сопротивление урону</Label>
                    <Input 
                      id="damageResistances" 
                      placeholder="Cold, Fire" 
                      value={formData.damageResistances}
                      onChange={(e) => setFormData({...formData, damageResistances: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="damageImmunities">Иммунитет к урону</Label>
                    <Input 
                      id="damageImmunities" 
                      placeholder="Poison, Psychic" 
                      value={formData.damageImmunities}
                      onChange={(e) => setFormData({...formData, damageImmunities: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="conditionImmunities">Иммунитет к состояниям</Label>
                    <Input 
                      id="conditionImmunities" 
                      placeholder="Poisoned, Frightened" 
                      value={formData.conditionImmunities}
                      onChange={(e) => setFormData({...formData, conditionImmunities: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senses">Чувства</Label>
                    <Input 
                      id="senses" 
                      placeholder="Darkvision 60 ft., passive Perception 15" 
                      value={formData.senses}
                      onChange={(e) => setFormData({...formData, senses: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="languages">Языки</Label>
                  <Input 
                    id="languages" 
                    placeholder="Common, Draconic" 
                    value={formData.languages}
                    onChange={(e) => setFormData({...formData, languages: e.target.value})}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="abilities" className="space-y-4">
                {/* Особые способности */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="abilities">Особые способности</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddAbility}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить способность
                    </Button>
                  </div>
                  
                  {formData.abilities.length > 0 ? (
                    <div className="space-y-3">
                      {formData.abilities.map((ability, index) => (
                        <div key={index} className="p-3 border rounded-md space-y-2">
                          <div className="flex items-center justify-between">
                            <Input 
                              placeholder="Название способности" 
                              value={ability.name}
                              onChange={(e) => handleUpdateAbility(index, 'name', e.target.value)}
                              className="mb-2"
                            />
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveAbility(index)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Textarea 
                            placeholder="Описание способности..." 
                            value={ability.description}
                            onChange={(e) => handleUpdateAbility(index, 'description', e.target.value)}
                            rows={2}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 border rounded-md text-muted-foreground">
                      У этого монстра нет особых способностей. Нажмите "Добавить способность", чтобы создать новую.
                    </div>
                  )}
                </div>
                
                {/* Действия */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="actions">Действия</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddAction}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить действие
                    </Button>
                  </div>
                  
                  {formData.actions.length > 0 ? (
                    <div className="space-y-3">
                      {formData.actions.map((action, index) => (
                        <div key={index} className="p-3 border rounded-md space-y-2">
                          <div className="flex items-center justify-between">
                            <Input 
                              placeholder="Название действия" 
                              value={action.name}
                              onChange={(e) => handleUpdateAction(index, 'name', e.target.value)}
                              className="mb-2"
                            />
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveAction(index)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Textarea 
                            placeholder="Описание действия..." 
                            value={action.description}
                            onChange={(e) => handleUpdateAction(index, 'description', e.target.value)}
                            rows={2}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 border rounded-md text-muted-foreground">
                      У этого монстра нет действий. Нажмите "Добавить действие", чтобы создать новое.
                    </div>
                  )}
                </div>
                
                {/* Легендарные действия */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="legendaryActions">Легендарные действия</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddLegendaryAction}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить легендарное действие
                    </Button>
                  </div>
                  
                  {formData.legendaryActions.length > 0 ? (
                    <div className="space-y-3">
                      {formData.legendaryActions.map((action, index) => (
                        <div key={index} className="p-3 border rounded-md space-y-2">
                          <div className="flex items-center justify-between">
                            <Input 
                              placeholder="Название легендарного действия" 
                              value={action.name}
                              onChange={(e) => handleUpdateLegendaryAction(index, 'name', e.target.value)}
                              className="mb-2"
                            />
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveLegendaryAction(index)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Textarea 
                            placeholder="Описание легендарного действия..." 
                            value={action.description}
                            onChange={(e) => handleUpdateLegendaryAction(index, 'description', e.target.value)}
                            rows={2}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 border rounded-md text-muted-foreground">
                      У этого монстра нет легендарных действий. Нажмите "Добавить легендарное действие", чтобы создать новое.
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => isAddMonsterDialogOpen ? setIsAddMonsterDialogOpen(false) : setIsEditMonsterDialogOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" onClick={() => handleSaveMonster(isEditMonsterDialogOpen)}>
              <Save className="h-4 w-4 mr-2" />
              {isEditMonsterDialogOpen ? 'Сохранить изменения' : 'Создать'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования монстра */}
      <Dialog open={isEditMonsterDialogOpen} onOpenChange={setIsEditMonsterDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать монстра</DialogTitle>
            <DialogDescription>
              Измените данные монстра
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Tabs value={activeFormTab} onValueChange={setActiveFormTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="basic">Основное</TabsTrigger>
                <TabsTrigger value="stats">Характеристики</TabsTrigger>
                <TabsTrigger value="abilities">Способности</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Имя</Label>
                    <Input 
                      id="edit-name" 
                      placeholder="Имя монстра" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-type">Тип</Label>
                    <Select 
                      value={formData.type}
                      onValueChange={(value) => setFormData({...formData, type: value})}
                    >
                      <SelectTrigger id="edit-type">
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dragon">Dragon</SelectItem>
                        <SelectItem value="Humanoid">Humanoid</SelectItem>
                        <SelectItem value="Beast">Beast</SelectItem>
                        <SelectItem value="Undead">Undead</SelectItem>
                        <SelectItem value="Fiend">Fiend</SelectItem>
                        <SelectItem value="Celestial">Celestial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-size">Размер</Label>
                    <Select 
                      value={formData.size}
                      onValueChange={(value) => setFormData({...formData, size: value})}
                    >
                      <SelectTrigger id="edit-size">
                        <SelectValue placeholder="Выберите размер" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tiny">Tiny</SelectItem>
                        <SelectItem value="Small">Small</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Large">Large</SelectItem>
                        <SelectItem value="Huge">Huge</SelectItem>
                        <SelectItem value="Gargantuan">Gargantuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-alignment">Мировоззрение</Label>
                    <Select 
                      value={formData.alignment}
                      onValueChange={(value) => setFormData({...formData, alignment: value})}
                    >
                      <SelectTrigger id="edit-alignment">
                        <SelectValue placeholder="Выберите мировоззрение" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lawful Good">Lawful Good</SelectItem>
                        <SelectItem value="Neutral Good">Neutral Good</SelectItem>
                        <SelectItem value="Chaotic Good">Chaotic Good</SelectItem>
                        <SelectItem value="Lawful Neutral">Lawful Neutral</SelectItem>
                        <SelectItem value="True Neutral">True Neutral</SelectItem>
                        <SelectItem value="Chaotic Neutral">Chaotic Neutral</SelectItem>
                        <SelectItem value="Lawful Evil">Lawful Evil</SelectItem>
                        <SelectItem value="Neutral Evil">Neutral Evil</SelectItem>
                        <SelectItem value="Chaotic Evil">Chaotic Evil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-challengeRating">Challenge Rating</Label>
                    <Select 
                      value={formData.challengeRating}
                      onValueChange={(value) => setFormData({...formData, challengeRating: value})}
                    >
                      <SelectTrigger id="edit-challengeRating">
                        <SelectValue placeholder="Выберите CR" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="1/8">1/8</SelectItem>
                        <SelectItem value="1/4">1/4</SelectItem>
                        <SelectItem value="1/2">1/2</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-system">Игровая система</Label>
                    <Select 
                      value={formData.system}
                      onValueChange={(value) => setFormData({...formData, system: value})}
                    >
                      <SelectTrigger id="edit-system">
                        <SelectValue placeholder="Выберите систему" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dnd5e">D&D 5e</SelectItem>
                        <SelectItem value="pathfinder">Pathfinder</SelectItem>
                        <SelectItem value="dnd35">D&D 3.5e</SelectItem>
                        <SelectItem value="other">Другая</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Описание</Label>
                  <Textarea 
                    id="edit-description" 
                    placeholder="Описание монстра..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-source">Источник</Label>
                    <Input 
                      id="edit-source" 
                      placeholder="Например: Monster Manual" 
                      value={formData.source}
                      onChange={(e) => setFormData({...formData, source: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-imageUrl">URL изображения</Label>
                    <Input 
                      id="edit-imageUrl" 
                      placeholder="https://example.com/image.jpg" 
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="stats" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-armorClass">Класс доспеха (AC)</Label>
                    <Input 
                      id="edit-armorClass" 
                      type="number" 
                      placeholder="15" 
                      value={formData.armorClass}
                      onChange={(e) => setFormData({...formData, armorClass: parseInt(e.target.value) || 10})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-hitPoints">Хиты (HP)</Label>
                    <Input 
                      id="edit-hitPoints" 
                      placeholder="45 (6d8 + 18)" 
                      value={formData.hitPoints}
                      onChange={(e) => setFormData({...formData, hitPoints: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-speed">Скорость</Label>
                  <Input 
                    id="edit-speed" 
                    placeholder="30 ft., fly 60 ft." 
                    value={formData.speed}
                    onChange={(e) => setFormData({...formData, speed: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-6 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-str">STR</Label>
                    <Input 
                      id="edit-str" 
                      type="number" 
                      placeholder="10" 
                      value={formData.stats.str}
                      onChange={(e) => setFormData({
                        ...formData, 
                        stats: {...formData.stats, str: parseInt(e.target.value) || 10}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-dex">DEX</Label>
                    <Input 
                      id="edit-dex" 
                      type="number" 
                      placeholder="10" 
                      value={formData.stats.dex}
                      onChange={(e) => setFormData({
                        ...formData, 
                        stats: {...formData.stats, dex: parseInt(e.target.value) || 10}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-con">CON</Label>
                    <Input 
                      id="edit-con" 
                      type="number" 
                      placeholder="10" 
                      value={formData.stats.con}
                      onChange={(e) => setFormData({
                        ...formData, 
                        stats: {...formData.stats, con: parseInt(e.target.value) || 10}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-int">INT</Label>
                    <Input 
                      id="edit-int" 
                      type="number" 
                      placeholder="10" 
                      value={formData.stats.int}
                      onChange={(e) => setFormData({
                        ...formData, 
                        stats: {...formData.stats, int: parseInt(e.target.value) || 10}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-wis">WIS</Label>
                    <Input 
                      id="edit-wis" 
                      type="number" 
                      placeholder="10" 
                      value={formData.stats.wis}
                      onChange={(e) => setFormData({
                        ...formData, 
                        stats: {...formData.stats, wis: parseInt(e.target.value) || 10}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-cha">CHA</Label>
                    <Input 
                      id="edit-cha" 
                      type="number" 
                      placeholder="10" 
                      value={formData.stats.cha}
                      onChange={(e) => setFormData({
                        ...formData, 
                        stats: {...formData.stats, cha: parseInt(e.target.value) || 10}
                      })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-savingThrows">Спасброски</Label>
                    <Input 
                      id="edit-savingThrows" 
                      placeholder="Dex +3, Con +5, Wis +2" 
                      value={formData.savingThrows}
                      onChange={(e) => setFormData({...formData, savingThrows: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-skills">Навыки</Label>
                    <Input 
                      id="edit-skills" 
                      placeholder="Perception +5, Stealth +3" 
                      value={formData.skills}
                      onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-damageResistances">Сопротивление урону</Label>
                    <Input 
                      id="edit-damageResistances" 
                      placeholder="Cold, Fire" 
                      value={formData.damageResistances}
                      onChange={(e) => setFormData({...formData, damageResistances: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-damageImmunities">Иммунитет к урону</Label>
                    <Input 
                      id="edit-damageImmunities" 
                      placeholder="Poison, Psychic" 
                      value={formData.damageImmunities}
                      onChange={(e) => setFormData({...formData, damageImmunities: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-conditionImmunities">Иммунитет к состояниям</Label>
                    <Input 
                      id="edit-conditionImmunities" 
                      placeholder="Poisoned, Frightened" 
                      value={formData.conditionImmunities}
                      onChange={(e) => setFormData({...formData, conditionImmunities: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-senses">Чувства</Label>
                    <Input 
                      id="edit-senses" 
                      placeholder="Darkvision 60 ft., passive Perception 15" 
                      value={formData.senses}
                      onChange={(e) => setFormData({...formData, senses: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-languages">Языки</Label>
                  <Input 
                    id="edit-languages" 
                    placeholder="Common, Draconic" 
                    value={formData.languages}
                    onChange={(e) => setFormData({...formData, languages: e.target.value})}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="abilities" className="space-y-4">
                {/* Особые способности */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-abilities">Особые способности</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddAbility}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить способность
                    </Button>
                  </div>
                  
                  {formData.abilities.length > 0 ? (
                    <div className="space-y-3">
                      {formData.abilities.map((ability, index) => (
                        <div key={index} className="p-3 border rounded-md space-y-2">
                          <div className="flex items-center justify-between">
                            <Input 
                              placeholder="Название способности" 
                              value={ability.name}
                              onChange={(e) => handleUpdateAbility(index, 'name', e.target.value)}
                              className="mb-2"
                            />
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveAbility(index)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Textarea 
                            placeholder="Описание способности..." 
                            value={ability.description}
                            onChange={(e) => handleUpdateAbility(index, 'description', e.target.value)}
                            rows={2}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 border rounded-md text-muted-foreground">
                      У этого монстра нет особых способностей. Нажмите "Добавить способность", чтобы создать новую.
                    </div>
                  )}
                </div>
                
                {/* Действия */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-actions">Действия</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddAction}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить действие
                    </Button>
                  </div>
                  
                  {formData.actions.length > 0 ? (
                    <div className="space-y-3">
                      {formData.actions.map((action, index) => (
                        <div key={index} className="p-3 border rounded-md space-y-2">
                          <div className="flex items-center justify-between">
                            <Input 
                              placeholder="Название действия" 
                              value={action.name}
                              onChange={(e) => handleUpdateAction(index, 'name', e.target.value)}
                              className="mb-2"
                            />
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveAction(index)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Textarea 
                            placeholder="Описание действия..." 
                            value={action.description}
                            onChange={(e) => handleUpdateAction(index, 'description', e.target.value)}
                            rows={2}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 border rounded-md text-muted-foreground">
                      У этого монстра нет действий. Нажмите "Добавить действие", чтобы создать новое.
                    </div>
                  )}
                </div>
                
                {/* Легендарные действия */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-legendaryActions">Легендарные действия</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddLegendaryAction}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить легендарное действие
                    </Button>
                  </div>
                  
                  {formData.legendaryActions.length > 0 ? (
                    <div className="space-y-3">
                      {formData.legendaryActions.map((action, index) => (
                        <div key={index} className="p-3 border rounded-md space-y-2">
                          <div className="flex items-center justify-between">
                            <Input 
                              placeholder="Название легендарного действия" 
                              value={action.name}
                              onChange={(e) => handleUpdateLegendaryAction(index, 'name', e.target.value)}
                              className="mb-2"
                            />
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveLegendaryAction(index)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Textarea 
                            placeholder="Описание легендарного действия..." 
                            value={action.description}
                            onChange={(e) => handleUpdateLegendaryAction(index, 'description', e.target.value)}
                            rows={2}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 border rounded-md text-muted-foreground">
                      У этого монстра нет легендарных действий. Нажмите "Добавить легендарное действие", чтобы создать новое.
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditMonsterDialogOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" onClick={() => handleSaveMonster(true)}>
              <Save className="h-4 w-4 mr-2" />
              Сохранить изменения
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог удаления монстра */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Удалить монстра</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить монстра {monsterToDelete?.name}?
              Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={confirmDeleteMonster}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
