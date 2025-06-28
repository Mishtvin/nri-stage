
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
  Package, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  Upload, 
  Filter,
  Save,
  Coins,
  Shield,
  Sword,
  Gem,
  Sparkles
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
import { itemStore } from '@/lib/data-store';
import { Item } from '@/components/shared/types';
import { ITEM_RARITIES, ITEM_TYPES } from '@/components/shared/constants/items';

export default function AdminItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);

  const initialFormData = {
    name: '',
    type: 'weapon' as Item['type'],
    rarity: 'common' as Item['rarity'],
    description: '',
    properties: [] as string[],
    value: 0,
    weight: 0,
    source: '',
    sourceUrl: '',
    campaign: '',
    isAvailable: true,
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = itemStore.onChange((newItems) => {
      setItems(newItems);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = items;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    if (selectedRarity !== 'all') {
      filtered = filtered.filter(item => item.rarity === selectedRarity);
    }
    
    setFilteredItems(filtered);
  }, [items, searchTerm, selectedType, selectedRarity]);

  const handleAddItem = () => {
    setFormData(initialFormData);
    setIsAddItemDialogOpen(true);
  };

  const handleEditItem = (item: Item) => {
    setItemToEdit(item);
    setFormData({
      name: item.name,
      type: item.type,
      rarity: item.rarity,
      description: item.description,
      properties: item.properties,
      value: item.value,
      weight: item.weight,
      source: item.source,
      sourceUrl: item.sourceUrl || '',
      campaign: item.campaign,
      isAvailable: item.isAvailable,
    });
    setIsEditItemDialogOpen(true);
  };

  const handleSaveItem = async (isEdit: boolean) => {
    const itemData: Partial<Omit<Item, 'id'>> = {
      ...formData,
    };
    
    try {
      if (isEdit && itemToEdit) {
        await itemStore.update(itemToEdit.id, itemData);
        setIsEditItemDialogOpen(false);
        toast.success("Предмет обновлен", {
          description: `${formData.name} был успешно обновлен.`,
        });
      } else {
        const newItemData: Omit<Item, 'id'> = {
          ...itemData as any, // Cast to avoid issues with missing optional fields
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          addedBy: 'admin',
        };
        await itemStore.add(newItemData);
        setIsAddItemDialogOpen(false);
        toast.success("Предмет добавлен", {
          description: `${formData.name} был успешно добавлен.`,
        });
      }
    } catch (error) {
       console.error("Error saving item:", error);
       toast.error("Ошибка сохранения");
    }
  };

  const handleDeleteItem = (item: Item) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteItem = async () => {
    if (itemToDelete) {
      try {
        await itemStore.delete(itemToDelete.id);
        setIsDeleteDialogOpen(false);
        setItemToDelete(null);
        
        toast.success("Предмет удален", {
          description: `${itemToDelete.name} был успешно удален.`,
        });
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("Ошибка удаления");
      }
    }
  };

  const handleExportItems = () => {
    const dataToExport = JSON.stringify(items, null, 2);
    const blob = new Blob([dataToExport], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'items-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.info("Экспорт завершен", {
      description: "Файл items-export.json был успешно скачан.",
    });
  };

  const handleImportItems = () => {
    toast.info("Импорт предметов", {
      description: "Функция импорта находится в разработке.",
    });
  };

  const getRarityColor = (rarity: string) => {
    return ITEM_RARITIES.find(r => r.value === rarity)?.color || 'text-gray-500';
  };

  const getRarityLabel = (rarity: string) => {
    return ITEM_RARITIES.find(r => r.value === rarity)?.label || rarity;
  };
  
  const getTypeLabel = (type: string) => {
    return ITEM_TYPES.find(t => t.value === type)?.label || type;
  };

  const getTypeIcon = (type: string) => {
    const Icon = ITEM_TYPES.find(t => t.value === type)?.icon;
    return Icon ? <Icon className="h-4 w-4" /> : <Package className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Управление предметами</h1>
          <p className="text-muted-foreground">
            Просмотр и управление всеми предметами в системе
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить предмет
          </Button>
          <Button variant="outline" onClick={handleExportItems}>
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
          <Button variant="outline" onClick={handleImportItems}>
            <Upload className="h-4 w-4 mr-2" />
            Импорт
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Предметы</CardTitle>
          <CardDescription>
            Всего предметов: {items.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск предметов..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    {ITEM_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Редкость" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все редкости</SelectItem>
                    {ITEM_RARITIES.map(rarity => (
                      <SelectItem key={rarity.value} value={rarity.value}>
                        <span className={rarity.color}>{rarity.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Редкость</TableHead>
                    <TableHead>Добавил</TableHead>
                    <TableHead>Кампания</TableHead>
                    <TableHead>Доступность</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground animate-pulse mb-2" />
                          <p className="text-muted-foreground">Загрузка предметов...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">Предметы не найдены</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(item.type)}
                            {getTypeLabel(item.type)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getRarityColor(item.rarity)}>
                            {getRarityLabel(item.rarity)}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.addedBy}</TableCell>
                        <TableCell>{item.campaign}</TableCell>
                        <TableCell>
                          <Badge variant={item.isAvailable ? 'default' : 'secondary'}>
                            {item.isAvailable ? 'Доступен' : 'Скрыт'}
                          </Badge>
                        </TableCell>
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
                              <DropdownMenuItem onClick={() => handleEditItem(item)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteItem(item)}
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

      <Dialog open={isAddItemDialogOpen || isEditItemDialogOpen} onOpenChange={isEditItemDialogOpen ? setIsEditItemDialogOpen : setIsAddItemDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditItemDialogOpen ? 'Редактировать' : 'Добавить'} предмет</DialogTitle>
            <DialogDescription>
              {isEditItemDialogOpen ? 'Измените данные предмета' : 'Создайте новый предмет для ваших кампаний'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название</Label>
                <Input 
                  id="name" 
                  placeholder="Название предмета" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign">Кампания</Label>
                <Input 
                  id="campaign" 
                  placeholder="Для какой кампании" 
                  value={formData.campaign}
                  onChange={(e) => setFormData({...formData, campaign: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Тип</Label>
                <Select 
                  value={formData.type}
                  onValueChange={(value: Item['type']) => setFormData({...formData, type: value})}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEM_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rarity">Редкость</Label>
                <Select 
                  value={formData.rarity}
                  onValueChange={(value: Item['rarity']) => setFormData({...formData, rarity: value})}
                >
                  <SelectTrigger id="rarity">
                    <SelectValue placeholder="Выберите редкость" />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEM_RARITIES.map(rarity => (
                      <SelectItem key={rarity.value} value={rarity.value}>
                        <span className={rarity.color}>{rarity.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea 
                id="description" 
                placeholder="Описание предмета..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="properties">Свойства (каждое с новой строки)</Label>
              <Textarea 
                id="properties" 
                placeholder="Например: +1 к атаке и урону"
                rows={3}
                value={formData.properties.join('\n')}
                onChange={(e) => setFormData({...formData, properties: e.target.value.split('\n')})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Стоимость (зм)</Label>
                <Input 
                  id="value" 
                  type="number"
                  placeholder="50" 
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Вес (фунты)</Label>
                <Input 
                  id="weight" 
                  type="number"
                  step="0.1"
                  placeholder="1.5" 
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Источник</Label>
                <Input 
                  id="source" 
                  placeholder="DMG, PHB..." 
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sourceUrl">URL источника</Label>
                <Input 
                  id="sourceUrl" 
                  placeholder="https://example.com/item" 
                  value={formData.sourceUrl}
                  onChange={(e) => setFormData({...formData, sourceUrl: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="isAvailable"
                checked={formData.isAvailable}
                onCheckedChange={(checked) => setFormData({...formData, isAvailable: checked})}
              />
              <Label htmlFor="isAvailable">Доступен для игроков</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => isEditItemDialogOpen ? setIsEditItemDialogOpen(false) : setIsAddItemDialogOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" onClick={() => handleSaveItem(isEditItemDialogOpen)}>
              <Save className="h-4 w-4 mr-2" />
              {isEditItemDialogOpen ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Удалить предмет</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить предмет {itemToDelete?.name}?
              Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={confirmDeleteItem}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
