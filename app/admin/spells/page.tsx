
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
  Sparkles, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Filter,
  Save,
  BookOpen,
  Clock
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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { spellStore } from '@/lib/data-store';
import { Spell } from '@/components/shared/types';
import { GAME_SYSTEMS } from '@/components/shared/constants';
import { SPELL_SCHOOLS, SPELL_LEVELS, DND_CLASSES } from '@/components/shared/constants/spells';

export default function AdminSpellsPage() {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [filteredSpells, setFilteredSpells] = useState<Spell[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [spellToDelete, setSpellToDelete] = useState<Spell | null>(null);
  const [spellToEdit, setSpellToEdit] = useState<Spell | null>(null);

  const initialFormData: Omit<Spell, 'id' | 'createdAt' | 'updatedAt'> = {
    name: '',
    level: 0,
    school: 'Evocation',
    castingTime: '1 действие',
    range: '30 футов',
    components: 'V, S',
    duration: 'Мгновенно',
    description: '',
    higherLevels: '',
    classes: [],
    system: 'dnd5e',
    source: 'Player\'s Handbook',
    sourceUrl: '',
    ritual: false,
    concentration: false,
  };

  const [formData, setFormData] = useState<Omit<Spell, 'id' | 'createdAt' | 'updatedAt'>>(initialFormData);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = spellStore.onChange((newSpells) => {
      setSpells(newSpells);
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = spells;
    
    if (searchTerm) {
      filtered = filtered.filter(spell => 
        spell.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spell.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedSystem !== 'all') {
      filtered = filtered.filter(spell => spell.system === selectedSystem);
    }
    
    if (selectedSchool !== 'all') {
      filtered = filtered.filter(spell => spell.school === selectedSchool);
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(spell => spell.level.toString() === selectedLevel);
    }
    
    setFilteredSpells(filtered);
  }, [spells, searchTerm, selectedSystem, selectedSchool, selectedLevel]);

  const handleAdd = () => {
    setSpellToEdit(null);
    setFormData(initialFormData);
    setIsAddDialogOpen(true);
  };

  const handleEdit = (spell: Spell) => {
    setSpellToEdit(spell);
    setFormData({
      ...spell,
      classes: spell.classes || [],
    });
    setIsEditDialogOpen(true);
  };

  const handleSave = async (isEdit: boolean) => {
    const spellData: Omit<Spell, 'id' | 'createdAt' | 'updatedAt'> = {
      ...formData,
    };
    
    try {
      if (isEdit && spellToEdit) {
        await spellStore.update(spellToEdit.id, spellData);
        setIsEditDialogOpen(false);
        toast.success("Заклинание обновлено", {
          description: `${formData.name} было успешно обновлено.`,
        });
      } else {
        const newSpellData: Omit<Spell, 'id'> = {
          ...spellData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await spellStore.add(newSpellData);
        setIsAddDialogOpen(false);
        toast.success("Заклинание добавлено", {
          description: `${formData.name} было успешно добавлено.`,
        });
      }
    } catch (error) {
      console.error("Error saving spell:", error);
      toast.error("Ошибка сохранения");
    }
  };

  const handleDelete = (spell: Spell) => {
    setSpellToDelete(spell);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (spellToDelete) {
      try {
        await spellStore.delete(spellToDelete.id);
        setIsDeleteDialogOpen(false);
        setSpellToDelete(null);
        
        toast.success("Заклинание удалено", {
          description: `${spellToDelete.name} было успешно удалено.`,
        });
      } catch (error) {
        console.error("Error deleting spell:", error);
        toast.error("Ошибка удаления");
      }
    }
  };

  const getSystemLabel = (systemValue: string) => {
    return GAME_SYSTEMS.find(s => s.value === systemValue)?.label || systemValue;
  }

  const renderForm = (isEdit: boolean) => (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Название</Label>
          <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="level">Уровень</Label>
          <Select value={formData.level.toString()} onValueChange={value => setFormData({...formData, level: parseInt(value)})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {SPELL_LEVELS.map(level => <SelectItem key={level} value={level}>{level === '0' ? 'Заговор' : `${level} уровень`}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="school">Школа магии</Label>
          <Select value={formData.school} onValueChange={value => setFormData({...formData, school: value})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {SPELL_SCHOOLS.map(school => <SelectItem key={school} value={school}>{school}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="system">Система</Label>
          <Select value={formData.system} onValueChange={value => setFormData({...formData, system: value as Spell['system']})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {GAME_SYSTEMS.map(system => <SelectItem key={system.value} value={system.value}>{system.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="castingTime">Время накладывания</Label>
          <Input id="castingTime" value={formData.castingTime} onChange={e => setFormData({...formData, castingTime: e.target.value})} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="range">Дистанция</Label>
          <Input id="range" value={formData.range} onChange={e => setFormData({...formData, range: e.target.value})} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Длительность</Label>
          <Input id="duration" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="components">Компоненты</Label>
        <Input id="components" value={formData.components} onChange={e => setFormData({...formData, components: e.target.value})} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Описание</Label>
        <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="higherLevels">На более высоких уровнях</Label>
        <Textarea id="higherLevels" value={formData.higherLevels || ''} onChange={e => setFormData({...formData, higherLevels: e.target.value})} rows={2} />
      </div>
      <div className="space-y-2">
        <Label>Классы</Label>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {DND_CLASSES.map(cls => (
            <div key={cls} className="flex items-center space-x-2">
              <Switch
                id={`class-${cls}`}
                checked={formData.classes.includes(cls)}
                onCheckedChange={checked => {
                  const newClasses = checked 
                    ? [...formData.classes, cls]
                    : formData.classes.filter(c => c !== cls);
                  setFormData({...formData, classes: newClasses});
                }}
              />
              <Label htmlFor={`class-${cls}`}>{cls}</Label>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="source">Источник</Label>
          <Input id="source" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sourceUrl">URL источника</Label>
          <Input id="sourceUrl" value={formData.sourceUrl || ''} onChange={e => setFormData({...formData, sourceUrl: e.target.value})} />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch id="ritual" checked={formData.ritual} onCheckedChange={checked => setFormData({...formData, ritual: checked})} />
          <Label htmlFor="ritual">Ритуал</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="concentration" checked={formData.concentration} onCheckedChange={checked => setFormData({...formData, concentration: checked})} />
          <Label htmlFor="concentration">Концентрация</Label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Управление заклинаниями</h1>
          <p className="text-muted-foreground">Просмотр и управление всеми заклинаниями в системе</p>
        </div>
        <Button onClick={handleAdd}><Plus className="h-4 w-4 mr-2" /> Добавить заклинание</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Заклинания</CardTitle>
          <CardDescription>Всего заклинаний: {spells.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Поиск заклинаний..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все системы</SelectItem>
                    {GAME_SYSTEMS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все школы</SelectItem>
                    {SPELL_SCHOOLS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все уровни</SelectItem>
                    {SPELL_LEVELS.map(l => <SelectItem key={l} value={l}>{l === '0' ? 'Заговор' : `${l} уровень`}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Уровень</TableHead>
                    <TableHead>Школа</TableHead>
                    <TableHead>Время</TableHead>
                    <TableHead>Длительность</TableHead>
                    <TableHead>Система</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-8"><Sparkles className="h-8 w-8 mx-auto text-muted-foreground animate-pulse" /></TableCell></TableRow>
                  ) : filteredSpells.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-8"><p>Заклинания не найдены</p></TableCell></TableRow>
                  ) : (
                    filteredSpells.map((spell) => (
                      <TableRow key={spell.id}>
                        <TableCell className="font-medium">{spell.name}</TableCell>
                        <TableCell>{spell.level === 0 ? 'Заговор' : spell.level}</TableCell>
                        <TableCell>{spell.school}</TableCell>
                        <TableCell>{spell.castingTime}</TableCell>
                        <TableCell>{spell.duration}</TableCell>
                        <TableCell><Badge variant="outline">{getSystemLabel(spell.system)}</Badge></TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Действия</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEdit(spell)}><Edit className="h-4 w-4 mr-2" />Редактировать</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(spell)} className="text-destructive focus:text-destructive"><Trash2 className="h-4 w-4 mr-2" />Удалить</DropdownMenuItem>
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

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader><DialogTitle>Добавить заклинание</DialogTitle></DialogHeader>
          {renderForm(false)}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Отмена</Button>
            <Button onClick={() => handleSave(false)}><Save className="h-4 w-4 mr-2" />Создать</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader><DialogTitle>Редактировать заклинание</DialogTitle></DialogHeader>
          {renderForm(true)}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Отмена</Button>
            <Button onClick={() => handleSave(true)}><Save className="h-4 w-4 mr-2" />Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить заклинание?</DialogTitle>
            <DialogDescription>Вы уверены, что хотите удалить заклинание {spellToDelete?.name}? Это действие нельзя отменить.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Отмена</Button>
            <Button variant="destructive" onClick={confirmDelete}>Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
