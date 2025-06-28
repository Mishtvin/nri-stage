'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader,
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Save,
  FolderPlus
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
import { referenceItemStore, ruleCategoryStore } from '@/lib/data-store';
import { ReferenceItem, RuleCategory } from '@/components/shared/types';
import { GAME_SYSTEMS } from '@/components/shared/constants';

export default function AdminRulesPage() {
  const [categories, setCategories] = useState<RuleCategory[]>([]);
  const [rules, setRules] = useState<ReferenceItem[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<RuleCategory[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('all');

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState<RuleCategory | null>(null);
  const [editingRule, setEditingRule] = useState<ReferenceItem | null>(null);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string; type: 'rule' | 'category' } | null>(null);

  const initialCategoryForm: Omit<RuleCategory, 'id'> = { name: '', description: '', system: 'dnd5e' as const, imageUrl: '' };
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);
  
  const initialRuleForm: Omit<ReferenceItem, 'id'| 'categoryId'> = { name: '', description: '', system: 'dnd5e' as const, source: '', sourceUrl: '' };
  const [ruleForm, setRuleForm] = useState(initialRuleForm);
  
  useEffect(() => {
    const unsubscribeCategories = ruleCategoryStore.onChange(setCategories);
    const unsubscribeRules = referenceItemStore.onChange(setRules);
    
    return () => {
      unsubscribeCategories();
      unsubscribeRules();
    };
  }, []);

  useEffect(() => {
    let filtered = categories;
    if (selectedSystem !== 'all') {
      filtered = filtered.filter(cat => cat.system === selectedSystem);
    }
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(cat => 
        cat.name.toLowerCase().includes(searchLower) || 
        cat.description.toLowerCase().includes(searchLower) ||
        rules.some(rule => rule.categoryId === cat.id && rule.name.toLowerCase().includes(searchLower))
      );
    }
    setFilteredCategories(filtered);
  }, [categories, rules, searchTerm, selectedSystem]);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm(initialCategoryForm);
    setIsCategoryDialogOpen(true);
  };
  
  const handleEditCategory = (category: RuleCategory) => {
    setEditingCategory(category);
    setCategoryForm(category);
    setIsCategoryDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        const { id, ...dataToUpdate } = categoryForm as RuleCategory;
        await ruleCategoryStore.update(editingCategory.id, dataToUpdate);
        toast.success('Категория обновлена');
      } else {
        await ruleCategoryStore.add(categoryForm);
        toast.success('Категория добавлена');
      }
      setIsCategoryDialogOpen(false);
    } catch(e) {
      console.error(e);
      toast.error('Ошибка сохранения категории');
    }
  };

  const handleAddRule = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    setEditingRule(null);
    setCurrentCategoryId(categoryId);
    setRuleForm({ ...initialRuleForm, system: category.system });
    setIsRuleDialogOpen(true);
  };

  const handleEditRule = (rule: ReferenceItem) => {
    setEditingRule(rule);
    setRuleForm(rule);
    setCurrentCategoryId(rule.categoryId);
    setIsRuleDialogOpen(true);
  };

  const handleSaveRule = async () => {
    try {
      if (editingRule) {
        const { id, ...dataToUpdate } = ruleForm as ReferenceItem;
        await referenceItemStore.update(editingRule.id, dataToUpdate);
        toast.success('Правило обновлено');
      } else if (currentCategoryId) {
        const dataToAdd = { ...ruleForm, categoryId: currentCategoryId };
        await referenceItemStore.add(dataToAdd);
        toast.success('Правило добавлено');
      }
      setIsRuleDialogOpen(false);
    } catch(e) {
      console.error(e);
      toast.error('Ошибка сохранения правила');
    }
  };
  
  const handleDelete = (item: { id: string; name: string; type: 'rule' | 'category' }) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === 'rule') {
        await referenceItemStore.delete(itemToDelete.id);
        toast.success('Правило удалено');
      } else {
        await ruleCategoryStore.delete(itemToDelete.id);
        toast.success('Категория и все её правила удалены');
      }
    } catch(e) {
      console.error(e);
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
          <h1 className="text-3xl font-bold tracking-tight">Управление правилами</h1>
          <p className="text-muted-foreground">Редактирование категорий и правил</p>
        </div>
        <Button onClick={handleAddCategory}><FolderPlus className="mr-2 h-4 w-4" /> Добавить категорию</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Поиск по категориям и правилам..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={selectedSystem} onValueChange={setSelectedSystem}>
              <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Все системы" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все системы</SelectItem>
                {GAME_SYSTEMS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full space-y-2">
            {filteredCategories.map(category => (
              <AccordionItem key={category.id} value={category.id} className="border bg-card rounded-md">
                <AccordionTrigger className="p-4 hover:no-underline">
                  <div className="flex items-center gap-4 flex-1">
                    {category.imageUrl && <img src={category.imageUrl} alt={category.name} className="w-16 h-16 object-cover rounded-md" />}
                    <div className="text-left">
                      <h3 className="font-bold text-lg">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                      <Badge variant="outline" className="mt-2">{GAME_SYSTEMS.find(s => s.value === category.system)?.label}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEditCategory(category); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete({ id: category.id, name: category.name, type: 'category' }); }} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 border-t">
                  <Button onClick={() => handleAddRule(category.id)} size="sm" className="mb-4">
                    <Plus className="mr-2 h-4 w-4" />Добавить правило
                  </Button>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Название</TableHead>
                          <TableHead>Источник</TableHead>
                          <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rules.filter(r => r.categoryId === category.id).map(rule => (
                          <TableRow key={rule.id}>
                            <TableCell className="font-medium">{rule.name}</TableCell>
                            <TableCell>{rule.source}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleEditRule(rule)}><Edit className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete({ id: rule.id, name: rule.name, type: 'rule' })} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Редактировать' : 'Добавить'} категорию</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <InputField label="Название категории" value={categoryForm.name} onChange={v => setCategoryForm(f => ({...f, name: v}))} />
            <TextareaField label="Описание категории" value={categoryForm.description} onChange={v => setCategoryForm(f => ({...f, description: v}))} />
            <SelectField label="Система" value={categoryForm.system} onChange={v => setCategoryForm(f => ({...f, system: v as any}))} options={GAME_SYSTEMS} />
            <InputField label="URL изображения" value={categoryForm.imageUrl || ''} onChange={v => setCategoryForm(f => ({...f, imageUrl: v}))} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleSaveCategory}><Save className="mr-2 h-4 w-4" />Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRule ? 'Редактировать' : 'Добавить'} правило</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <InputField label="Название правила" value={ruleForm.name} onChange={v => setRuleForm(f => ({...f, name: v}))} />
            <TextareaField label="Описание" value={ruleForm.description} onChange={v => setRuleForm(f => ({...f, description: v}))} rows={5} />
            <InputField label="Источник" value={ruleForm.source} onChange={v => setRuleForm(f => ({...f, source: v}))} />
            <InputField label="URL источника" value={ruleForm.sourceUrl || ''} onChange={v => setRuleForm(f => ({...f, sourceUrl: v}))} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRuleDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleSaveRule}><Save className="mr-2 h-4 w-4" />Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить {itemToDelete?.type === 'rule' ? 'правило' : 'категорию'}?</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Вы уверены, что хотите удалить "{itemToDelete?.name}"? 
            {itemToDelete?.type === 'category' && " Все правила в этой категории также будут удалены."}
            Это действие необратимо.
          </DialogDescription>
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
