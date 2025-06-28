'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
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
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Save,
  BookUser
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
import { toast } from 'sonner';
import { backgroundStore } from '@/lib/data-store';
import { Background } from '@/components/shared/types';
import { GAME_SYSTEMS } from '@/components/shared/constants';

export default function AdminBackgroundsPage() {
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);
  const [filteredBackgrounds, setFilteredBackgrounds] = useState<Background[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('all');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [editingBackground, setEditingBackground] = useState<Background | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Background | null>(null);

  const initialForm: Omit<Background, 'id'> = {
    name: '',
    description: '',
    system: 'dnd5e' as const,
    source: '',
    sourceUrl: '',
    skillProficiencies: '',
    toolProficiencies: '',
    equipment: '',
    startingGold: 10
  };
  const [form, setForm] = useState(initialForm);
  
  useEffect(() => {
    const unsubscribe = backgroundStore.onChange(setBackgrounds);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = backgrounds.filter(b => 
      (b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSystem === 'all' || b.system === selectedSystem)
    );
    setFilteredBackgrounds(filtered);
  }, [backgrounds, searchTerm, selectedSystem]);

  const handleAdd = () => {
    setEditingBackground(null);
    setForm(initialForm);
    setIsDialogOpen(true);
  };
  
  const handleEdit = (background: Background) => {
    setEditingBackground(background);
    setForm(background);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingBackground) {
        const { id, ...dataToUpdate } = form as Background;
        await backgroundStore.update(editingBackground.id, dataToUpdate);
        toast.success('Предыстория обновлена');
      } else {
        await backgroundStore.add(form);
        toast.success('Предыстория добавлена');
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save background:", error);
      toast.error('Ошибка сохранения');
    }
  };
  
  const handleDelete = (item: Background) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await backgroundStore.delete(itemToDelete.id);
      toast.success('Предыстория удалена');
    } catch (error) {
      console.error("Failed to delete background:", error);
      toast.error('Ошибка удаления');
    } finally {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Управление предысториями</h1>
          <p className="text-muted-foreground">Редактирование предысторий для персонажей</p>
        </div>
        <Button onClick={handleAdd}><Plus className="mr-2 h-4 w-4" /> Добавить предысторию</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Поиск..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={selectedSystem} onValueChange={setSelectedSystem}>
              <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все системы</SelectItem>
                {GAME_SYSTEMS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Система</TableHead>
                  <TableHead>Источник</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBackgrounds.map(bg => (
                  <TableRow key={bg.id}>
                    <TableCell className="font-medium">{bg.name}</TableCell>
                    <TableCell><Badge variant="outline">{GAME_SYSTEMS.find(s => s.value === bg.system)?.label}</Badge></TableCell>
                    <TableCell>{bg.source}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEdit(bg)}><Edit className="mr-2 h-4 w-4" />Редактировать</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(bg)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Удалить</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingBackground ? 'Редактировать' : 'Добавить'} предысторию</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <InputField label="Название" value={form.name} onChange={v => setForm(f => ({...f, name: v}))} />
            <TextareaField label="Описание" value={form.description} onChange={v => setForm(f => ({...f, description: v}))} rows={4} />
            <div className="grid grid-cols-2 gap-4">
                <SelectField label="Система" value={form.system} onChange={v => setForm(f => ({...f, system: v as any}))} options={GAME_SYSTEMS} />
                <InputField label="Источник" value={form.source} onChange={v => setForm(f => ({...f, source: v}))} />
            </div>
            <InputField label="URL источника" value={form.sourceUrl || ''} onChange={v => setForm(f => ({...f, sourceUrl: v}))} />
            <TextareaField label="Владение навыками" value={form.skillProficiencies} onChange={v => setForm(f => ({...f, skillProficiencies: v}))} rows={2} />
            <TextareaField label="Владение инструментами" value={form.toolProficiencies} onChange={v => setForm(f => ({...f, toolProficiencies: v}))} rows={2} />
            <TextareaField label="Снаряжение" value={form.equipment} onChange={v => setForm(f => ({...f, equipment: v}))} rows={3} />
            <div className="space-y-2">
                <Label>Начальный капитал (зм)</Label>
                <Input type="number" value={form.startingGold} onChange={e => setForm(f => ({...f, startingGold: parseInt(e.target.value) || 0}))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Удалить предысторию?</DialogTitle></DialogHeader>
          <DialogDescription>Вы уверены, что хотите удалить "{itemToDelete?.name}"? Это действие необратимо.</DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Отмена</Button>
            <Button variant="destructive" onClick={confirmDelete}>Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const InputField = ({ label, value, onChange, ...props }: { label: string, value: string, onChange: (v: string) => void, [key: string]: any }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Input value={value} onChange={e => onChange(e.target.value)} {...props} />
  </div>
);

const TextareaField = ({ label, value, onChange, rows }: { label: string, value: string, onChange: (v: string) => void, rows?: number }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} />
  </div>
);

const SelectField = ({ label, value, onChange, options }: { label: string, value: string, onChange: (v: string) => void, options: readonly {value: string, label: string}[] }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent>
        {options.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>
);
