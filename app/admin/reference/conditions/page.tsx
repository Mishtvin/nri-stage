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
import { toast } from 'sonner';
import { conditionStore } from '@/lib/data-store';
import { Condition } from '@/components/shared/types';
import { GAME_SYSTEMS } from '@/components/shared/constants';

export default function AdminConditionsPage() {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [filteredConditions, setFilteredConditions] = useState<Condition[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('all');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [editingCondition, setEditingCondition] = useState<Condition | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Condition | null>(null);

  const initialConditionForm: Omit<Condition, 'id'> = { name: '', description: '', system: 'dnd5e' as const, source: '', sourceUrl: '' };
  const [conditionForm, setConditionForm] = useState(initialConditionForm);
  
  useEffect(() => {
    const unsubscribeConditions = conditionStore.onChange(setConditions);
    return () => unsubscribeConditions();
  }, []);

  useEffect(() => {
    let filtered = conditions.filter(c => 
      (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSystem === 'all' || c.system === selectedSystem)
    );
    setFilteredConditions(filtered);
  }, [conditions, searchTerm, selectedSystem]);

  const handleAddCondition = () => {
    setEditingCondition(null);
    setConditionForm(initialConditionForm);
    setIsDialogOpen(true);
  };
  
  const handleEditCondition = (condition: Condition) => {
    setEditingCondition(condition);
    setConditionForm(condition);
    setIsDialogOpen(true);
  };

  const handleSaveCondition = async () => {
    try {
      if (editingCondition) {
        const { id, ...dataToUpdate } = conditionForm as Condition;
        await conditionStore.update(editingCondition.id, dataToUpdate);
        toast.success('Состояние обновлено');
      } else {
        await conditionStore.add(conditionForm);
        toast.success('Состояние добавлено');
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save condition:", error);
      toast.error('Ошибка сохранения');
    }
  };
  
  const handleDelete = (item: Condition) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await conditionStore.delete(itemToDelete.id);
      toast.success('Состояние удалено');
    } catch (error) {
       console.error("Failed to delete condition:", error);
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
          <h1 className="text-3xl font-bold tracking-tight">Управление состояниями</h1>
          <p className="text-muted-foreground">Редактирование состояний персонажей и существ</p>
        </div>
        <Button onClick={handleAddCondition}><Plus className="mr-2 h-4 w-4" /> Добавить состояние</Button>
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
                {filteredConditions.map(condition => (
                  <TableRow key={condition.id}>
                    <TableCell className="font-medium">{condition.name}</TableCell>
                    <TableCell><Badge variant="outline">{GAME_SYSTEMS.find(s => s.value === condition.system)?.label}</Badge></TableCell>
                    <TableCell>{condition.source}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEditCondition(condition)}><Edit className="mr-2 h-4 w-4" />Редактировать</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(condition)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Удалить</DropdownMenuItem>
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
        <DialogContent>
          <DialogHeader><DialogTitle>{editingCondition ? 'Редактировать' : 'Добавить'} состояние</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <InputField label="Название" value={conditionForm.name} onChange={v => setConditionForm(f => ({...f, name: v}))} />
            <TextareaField label="Описание" value={conditionForm.description} onChange={v => setConditionForm(f => ({...f, description: v}))} rows={5} />
            <SelectField label="Система" value={conditionForm.system} onChange={v => setConditionForm(f => ({...f, system: v as any}))} options={GAME_SYSTEMS} />
            <InputField label="Источник" value={conditionForm.source} onChange={v => setConditionForm(f => ({...f, source: v}))} />
            <InputField label="URL источника" value={conditionForm.sourceUrl || ''} onChange={v => setConditionForm(f => ({...f, sourceUrl: v}))} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleSaveCondition}><Save className="mr-2 h-4 w-4" />Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Удалить состояние?</DialogTitle></DialogHeader>
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

const InputField = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Input value={value} onChange={e => onChange(e.target.value)} />
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
