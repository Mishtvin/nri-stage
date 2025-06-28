
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
  Filter,
  Save,
  Coins,
  Sparkles,
  Eye,
  ExternalLink
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { itemStore } from '@/lib/data-store';
import { Item } from '@/components/shared/types';
import { ITEM_RARITIES, ITEM_TYPES } from '@/components/shared/constants/items';
import { LoadingSpinner } from '@/components/loading-spinner';

export default function ItemsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [itemToView, setItemToView] = useState<Item | null>(null);

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
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/');
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    const unsubscribe = itemStore.onChange((newItems) => {
      setItems(newItems);
      if (isLoading) setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [isLoading]);

  useEffect(() => {
    if (!user || isLoading) return;
    
    let userVisibleItems = items.filter(item => item.isAvailable || item.addedBy === user.id);
    
    let filtered = userVisibleItems;
    
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
  }, [items, searchTerm, selectedType, selectedRarity, user, isLoading]);

  const handleAddItem = () => {
    setFormData(initialFormData);
    setIsAddItemDialogOpen(true);
  };

  const handleEditItem = (item: Item) => {
    setItemToEdit(item);
    setFormData({
      ...item,
    });
    setIsEditItemDialogOpen(true);
  };
  
  const handleViewItem = (item: Item) => {
    setItemToView(item);
    setIsDetailDialogOpen(true);
  };

  const handleSaveItem = async (isEdit: boolean) => {
    if (!user) return;
    
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
          ...formData,
          isAvailable: false,
          addedBy: user.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await itemStore.add(newItemData);
        setIsAddItemDialogOpen(false);
        toast.success("Предмет добавлен", {
          description: `${formData.name} был успешно добавлен.`,
        });
      }
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error("Ошибка сохранения", {
        description: "Не удалось сохранить предмет.",
      });
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
        console.error('Error deleting item:', error);
        toast.error("Ошибка удаления", {
          description: "Не удалось удалить предмет.",
        });
      }
    }
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

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background dice-pattern">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/50 to-primary/5" />
      <Navbar />
      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                 <div className="flex items-center space-x-3">
                  <Package className="h-8 w-8 text-primary" />
                  <h1 className="text-4xl md:text-5xl font-cinzel font-bold">
                    <span className="fantasy-text-gradient">Предметы</span>
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground">
                  Просмотр и управление предметами
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleAddItem} className="fantasy-gradient hover:opacity-90 transition-opacity">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить предмет
                </Button>
              </div>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
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
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => {
                const TypeIcon = ITEM_TYPES.find(t => t.value === item.type)?.icon || Package;
                return (
                  <Card key={item.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <TypeIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="font-cinzel text-lg group-hover:text-primary transition-colors line-clamp-1">
                              {item.name}
                            </CardTitle>
                            <CardDescription>
                              {getTypeLabel(item.type)}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className={getRarityColor(item.rarity)}>
                          {getRarityLabel(item.rarity)}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 flex-grow">
                       <p className="text-sm text-muted-foreground line-clamp-3 h-[60px]">
                        {item.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-border/50">
                        <div className="flex items-center space-x-1">
                          <Coins className="h-4 w-4 text-yellow-500" />
                          <span>{item.value} зм</span>
                        </div>
                        <div className="text-muted-foreground">
                          {item.weight} фунт.
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                       <Button variant="outline" size="sm" className="border-primary/50 hover:bg-primary/10" onClick={() => handleViewItem(item)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Подробнее
                      </Button>
                      {item.addedBy === user.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
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
                      )}
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
            
            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-cinzel font-semibold text-lg mb-2">Предметы не найдены</h3>
                <p className="text-muted-foreground">
                  Попробуйте изменить фильтры или добавьте свой первый предмет
                </p>
              </div>
            )}

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
            
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                <DialogContent className="max-w-2xl">
                    {itemToView && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="font-cinzel text-2xl">{itemToView.name}</DialogTitle>
                                <DialogDescription className="flex items-center space-x-4">
                                    <Badge variant="outline" className={getRarityColor(itemToView.rarity)}>
                                        {getRarityLabel(itemToView.rarity)}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">{getTypeLabel(itemToView.type)}</span>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <p className="text-muted-foreground">{itemToView.description}</p>
                                <Separator />
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Свойства</h4>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                        {itemToView.properties.map((prop, index) => (
                                            <li key={index} className="flex items-start">
                                                <Sparkles className="h-4 w-4 mr-2 mt-1 text-primary flex-shrink-0" />
                                                <span>{prop}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="font-semibold">Стоимость:</span> {itemToView.value} зм</div>
                                    <div><span className="font-semibold">Вес:</span> {itemToView.weight} фунтов</div>
                                    <div><span className="font-semibold">Источник:</span> {itemToView.source}</div>
                                    <div><span className="font-semibold">Добавил:</span> {itemToView.addedBy}</div>
                                </div>
                                {itemToView.sourceUrl && (
                                     <Button variant="outline" size="sm" asChild>
                                        <a href={itemToView.sourceUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            Открыть источник
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
