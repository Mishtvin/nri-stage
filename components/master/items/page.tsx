
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
import { Package, Plus, Search, Filter, Edit, Trash2, ExternalLink, Sword, Shield, Sparkles, Crown, Gem, Coins } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { itemStore } from '@/lib/data-store';
import { Item } from '@/components/shared/types';
import { ITEM_TYPES, ITEM_RARITIES } from '@/components/shared/constants/items';

export default function MasterItemsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'weapon' as Item['type'],
    rarity: 'common' as Item['rarity'],
    description: '',
    properties: '',
    value: 0,
    weight: 0,
    source: '',
    sourceUrl: '',
    campaign: ''
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const loadItems = () => {
      const storedItems = itemStore.getItems();
      setItems(storedItems);
    };

    loadItems();
    
    const unsubscribe = itemStore.onItemsChange((newItems) => {
      setItems(newItems);
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

    if (selectedCampaign !== 'all') {
      filtered = filtered.filter(item => item.campaign === selectedCampaign);
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, selectedType, selectedRarity, selectedCampaign]);

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

  const campaigns = [...new Set(items.map(item => item.campaign).filter(Boolean))];

  const getTypeIcon = (type: string) => {
    const typeData = ITEM_TYPES.find(t => t.value === type);
    return typeData ? typeData.icon : Package;
  };

  const getRarityColor = (rarity: string) => {
    const rarityData = ITEM_RARITIES.find(r => r.value === rarity);
    return rarityData ? rarityData.color : 'text-gray-500';
  };

  const getRarityLabel = (rarity: string) => {
    const rarityData = ITEM_RARITIES.find(r => r.value === rarity);
    return rarityData ? rarityData.label : rarity;
  };

  const handleCreateItem = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      type: 'weapon',
      rarity: 'common',
      description: '',
      properties: '',
      value: 0,
      weight: 0,
      source: '',
      sourceUrl: '',
      campaign: ''
    });
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      type: item.type,
      rarity: item.rarity,
      description: item.description,
      properties: item.properties.join('\n'),
      value: item.value,
      weight: item.weight,
      source: item.source,
      sourceUrl: item.sourceUrl || '',
      campaign: item.campaign
    });
    setIsDialogOpen(true);
  };

  const handleSaveItem = () => {
    const itemData: Omit<Item, 'id' | 'createdAt' | 'addedBy' | 'isAvailable'> = {
      name: formData.name,
      type: formData.type,
      rarity: formData.rarity,
      description: formData.description,
      properties: formData.properties.split('\n').filter(p => p.trim()),
      value: formData.value,
      weight: formData.weight,
      source: formData.source,
      sourceUrl: formData.sourceUrl,
      campaign: formData.campaign,
    };
    
    if (editingItem) {
      itemStore.updateItem(editingItem.id, itemData);
    } else {
      const newItem: Item = {
        id: `item-${Date.now()}`,
        ...itemData,
        isAvailable: true,
        createdAt: new Date().toISOString().split('T')[0],
        addedBy: user?.name || 'Мастер',
      };
      itemStore.addItem(newItem);
    }

    setIsDialogOpen(false);
  };

  const handleDeleteItem = (itemId: string) => {
    itemStore.deleteItem(itemId);
  };

  const toggleItemAvailability = (item: Item) => {
    itemStore.updateItem(item.id, { isAvailable: !item.isAvailable });
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
                  <Package className="h-8 w-8 text-primary" />
                  <h1 className="text-4xl md:text-5xl font-cinzel font-bold">
                    <span className="fantasy-text-gradient">Хаб предметов</span>
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground">
                  Управляйте магическими предметами и сокровищами для ваших кампаний
                </p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={handleCreateItem}
                    className="fantasy-gradient hover:opacity-90 transition-opacity"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить предмет
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-cinzel text-2xl">
                      {editingItem ? 'Редактировать предмет' : 'Добавить предмет'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingItem ? 'Измените характеристики предмета' : 'Создайте новый предмет для ваших кампаний'}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Название предмета</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Введите название предмета"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="campaign">Кампания</Label>
                        <Input
                          id="campaign"
                          value={formData.campaign}
                          onChange={(e) => setFormData(prev => ({ ...prev, campaign: e.target.value }))}
                          placeholder="Название кампании"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Тип предмета</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Item['type'] }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ITEM_TYPES.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rarity">Редкость</Label>
                        <Select
                          value={formData.rarity}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, rarity: value as Item['rarity'] }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
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
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Опишите предмет и его эффекты..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="properties">Свойства (каждое с новой строки)</Label>
                      <Textarea
                        id="properties"
                        value={formData.properties}
                        onChange={(e) => setFormData(prev => ({ ...prev, properties: e.target.value }))}
                        placeholder="+1 к атаке и урону&#10;1d6 урона огнём&#10;Освещение 10 футов"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="value">Стоимость (золото)</Label>
                        <Input
                          id="value"
                          type="number"
                          min="0"
                          value={formData.value}
                          onChange={(e) => setFormData(prev => ({ ...prev, value: parseInt(e.target.value) || 0 }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="weight">Вес (фунты)</Label>
                        <Input
                          id="weight"
                          type="number"
                          min="0"
                          step="0.1"
                          value={formData.weight}
                          onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="source">Источник</Label>
                        <Input
                          id="source"
                          value={formData.source}
                          onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                          placeholder="Player's Handbook, DMG, etc."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sourceUrl">Ссылка на источник (опционально)</Label>
                        <Input
                          id="sourceUrl"
                          value={formData.sourceUrl}
                          onChange={(e) => setFormData(prev => ({ ...prev, sourceUrl: e.target.value }))}
                          placeholder="https://dnd.su/items/..."
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Отмена
                      </Button>
                      <Button onClick={handleSaveItem} className="fantasy-gradient">
                        {editingItem ? 'Сохранить изменения' : 'Добавить предмет'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск предметов..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    {ITEM_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
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
                <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все кампании</SelectItem>
                    {campaigns.map(campaign => (
                      <SelectItem key={campaign} value={campaign}>
                        {campaign}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const TypeIcon = getTypeIcon(item.type);
                return (
                  <Card key={item.id} className={`bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group ${!item.isAvailable ? 'opacity-60' : ''}`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <TypeIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="font-cinzel text-lg group-hover:text-primary transition-colors">
                              {item.name}
                            </CardTitle>
                            <CardDescription>
                              {ITEM_TYPES.find(t => t.value === item.type)?.label}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getRarityColor(item.rarity)}>
                            {getRarityLabel(item.rarity)}
                          </Badge>
                          {!item.isAvailable && (
                            <Badge variant="secondary">Недоступен</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {item.description}
                      </p>

                      {item.properties.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">Свойства:</h4>
                          <div className="space-y-1">
                            {item.properties.slice(0, 3).map((property, index) => (
                              <div key={index} className="text-xs text-muted-foreground flex items-center space-x-1">
                                <Sparkles className="h-3 w-3 text-primary" />
                                <span>{property}</span>
                              </div>
                            ))}
                            {item.properties.length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{item.properties.length - 3} ещё...
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Coins className="h-4 w-4 text-yellow-500" />
                          <span>{item.value} зм</span>
                        </div>
                        <div className="text-muted-foreground">
                          {item.weight} фунт.
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          Кампания: {item.campaign}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Источник: {item.source}</span>
                          {item.sourceUrl && (
                            <a
                              href={item.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditItem(item)}
                            className="hover:bg-primary/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                            className="hover:bg-destructive/10 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant={item.isAvailable ? "outline" : "default"}
                          size="sm"
                          onClick={() => toggleItemAvailability(item)}
                          className={item.isAvailable ? "border-primary/50 hover:bg-primary/10" : "fantasy-gradient"}
                        >
                          {item.isAvailable ? 'Скрыть' : 'Показать'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredItems.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-cinzel font-semibold text-lg mb-2">Предметы не найдены</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedType !== 'all' || selectedRarity !== 'all' || selectedCampaign !== 'all'
                      ? 'Попробуйте изменить фильтры поиска'
                      : 'Добавьте первый предмет для ваших кампаний'
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
