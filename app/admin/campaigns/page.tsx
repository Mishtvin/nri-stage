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
  FileText, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Filter,
  Save,
  Eye
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
import { campaignStore, userStore } from '@/lib/data-store';
import { Campaign, User } from '@/components/shared/types';
import { GAME_SYSTEMS, CAMPAIGN_STATUSES } from '@/components/shared/constants';
import { CampaignDetailDialog } from '@/components/campaigns/components/CampaignDetailDialog';

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const [campaignToEdit, setCampaignToEdit] = useState<Campaign | null>(null);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [campaignToView, setCampaignToView] = useState<Campaign | null>(null);

  const initialFormData = {
    name: '',
    description: '',
    system: 'dnd5e' as Campaign['system'],
    status: 'planning' as Campaign['status'],
    maxPlayers: 4,
    currentLevel: '1-3',
    setting: '',
    masterNotes: '',
    nextSession: {
        date: '',
        time: '',
        location: '',
    }
  };
  
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    setIsLoading(true);
    let campaignsLoaded = false;
    let usersLoaded = false;

    const checkDoneLoading = () => {
        if (campaignsLoaded && usersLoaded) {
            setIsLoading(false);
        }
    };

    const unsubscribeCampaigns = campaignStore.onChange((data) => {
        setCampaigns(data);
        campaignsLoaded = true;
        checkDoneLoading();
    });

    const unsubscribeUsers = userStore.onChange((data) => {
        setUsers(data);
        usersLoaded = true;
        checkDoneLoading();
    });

    return () => {
        unsubscribeCampaigns();
        unsubscribeUsers();
    };
  }, []);

  useEffect(() => {
    let filtered = campaigns;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(campaign => 
        campaign.name.toLowerCase().includes(searchLower) ||
        users.find(u => u.id === campaign.masterId)?.name.toLowerCase().includes(searchLower)
      );
    }
    
    if (selectedSystem !== 'all') {
      filtered = filtered.filter(campaign => campaign.system === selectedSystem);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === selectedStatus);
    }
    
    setFilteredCampaigns(filtered);
  }, [campaigns, users, searchTerm, selectedSystem, selectedStatus]);

  const handleEdit = (campaign: Campaign) => {
    setCampaignToEdit(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description || '',
      system: campaign.system,
      status: campaign.status,
      maxPlayers: campaign.maxPlayers,
      currentLevel: campaign.currentLevel,
      setting: campaign.setting || '',
      masterNotes: campaign.masterNotes || '',
      nextSession: campaign.nextSession || { date: '', time: '', location: '' },
    });
    setIsEditModalOpen(true);
  };

  const handleView = (campaign: Campaign) => {
    setCampaignToView(campaign);
    setIsViewModalOpen(true);
  };

  const handleSave = async () => {
    if (!campaignToEdit) return;

    try {
      const updates: Partial<Campaign> = { ...formData };

      if (
        updates.nextSession &&
        !updates.nextSession.date &&
        !updates.nextSession.time &&
        !updates.nextSession.location
      ) {
        updates.nextSession = undefined;
      }

      await campaignStore.update(campaignToEdit.id, updates);
      toast.success('Кампания обновлена');
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error('Ошибка обновления');
      console.error(error);
    }
  };

  const handleDelete = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!campaignToDelete) return;
    try {
      await campaignStore.delete(campaignToDelete.id);
      toast.success('Кампания удалена');
    } catch (error) {
      toast.error('Ошибка удаления');
    } finally {
      setIsDeleteModalOpen(false);
      setCampaignToDelete(null);
    }
  };

  const getMasterName = (masterId: string) => {
    return users.find(u => u.id === masterId)?.name || 'Неизвестен';
  };

  const getStatusConfig = (status: Campaign['status']) => {
    return CAMPAIGN_STATUSES.find(s => s.value === status);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Управление кампаниями</h1>
          <p className="text-muted-foreground">
            Просмотр и управление всеми кампаниями в системе
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Кампании</CardTitle>
          <CardDescription>
            Всего кампаний: {campaigns.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по названию или мастеру..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Система" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все системы</SelectItem>
                    {GAME_SYSTEMS.map(sys => (
                      <SelectItem key={sys.value} value={sys.value}>{sys.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    {CAMPAIGN_STATUSES.map(stat => (
                      <SelectItem key={stat.value} value={stat.value}>{stat.label}</SelectItem>
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
                    <TableHead>Мастер</TableHead>
                    <TableHead>Система</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Игроки</TableHead>
                    <TableHead>Создана</TableHead>
                    <TableHead>Обновлена</TableHead>
                    <TableHead>Сессий</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <FileText className="h-8 w-8 text-muted-foreground animate-pulse mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : filteredCampaigns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">Кампании не найдены</TableCell>
                    </TableRow>
                  ) : (
                    filteredCampaigns.map((campaign) => {
                      const statusConfig = getStatusConfig(campaign.status);
                      return (
                        <TableRow key={campaign.id}>
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell>{getMasterName(campaign.masterId)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{GAME_SYSTEMS.find(s => s.value === campaign.system)?.label}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusConfig?.color}>{statusConfig?.label}</Badge>
                          </TableCell>
                          <TableCell>{campaign.players?.length || 0} / {campaign.maxPlayers}</TableCell>
                          <TableCell>{new Date(campaign.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(campaign.updatedAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-center">{campaign.sessions?.length || 0}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleView(campaign)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Просмотреть
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(campaign)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Редактировать
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(campaign)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Удалить
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать кампанию</DialogTitle>
            <DialogDescription>Изменение данных кампании "{campaignToEdit?.name}"</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData(f => ({...f, name: e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData(f => ({...f, description: e.target.value}))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="system">Система</Label>
                <Select value={formData.system} onValueChange={(v) => setFormData(f => ({...f, system: v as any}))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {GAME_SYSTEMS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Статус</Label>
                 <Select value={formData.status} onValueChange={(v) => setFormData(f => ({...f, status: v as any}))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CAMPAIGN_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxPlayers">Макс. игроков</Label>
                <Input id="maxPlayers" type="number" value={formData.maxPlayers} onChange={(e) => setFormData(f => ({...f, maxPlayers: parseInt(e.target.value) || 0}))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentLevel">Текущий уровень</Label>
                <Input id="currentLevel" value={formData.currentLevel} onChange={(e) => setFormData(f => ({...f, currentLevel: e.target.value}))} />
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="setting">Сеттинг</Label>
                <Input id="setting" value={formData.setting} onChange={(e) => setFormData(f => ({...f, setting: e.target.value}))} />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="masterNotes">Заметки мастера</Label>
                  <Textarea id="masterNotes" value={formData.masterNotes} onChange={(e) => setFormData(f => ({...f, masterNotes: e.target.value}))} placeholder="Видны только вам..." />
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Следующая сессия</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="nextSessionDate">Дата</Label>
                        <Input id="nextSessionDate" type="date" value={formData.nextSession.date} onChange={(e) => setFormData(f => ({...f, nextSession: { ...f.nextSession, date: e.target.value}}))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nextSessionTime">Время</Label>
                        <Input id="nextSessionTime" type="time" value={formData.nextSession.time} onChange={(e) => setFormData(f => ({...f, nextSession: { ...f.nextSession, time: e.target.value}}))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nextSessionLocation">Место/Ссылка</Label>
                        <Input id="nextSessionLocation" value={formData.nextSession.location} onChange={(e) => setFormData(f => ({...f, nextSession: { ...f.nextSession, location: e.target.value}}))} />
                    </div>
                </div>
              </div>
              <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Статистика сессий</h4>
                  <p className="text-sm text-muted-foreground">Всего сессий: {campaignToEdit?.sessions?.length || 0}</p>
              </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Отмена</Button>
            <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <CampaignDetailDialog
        campaign={campaignToView}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        masterName={campaignToView ? getMasterName(campaignToView.masterId) : ''}
      />

      {/* Delete Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить кампанию?</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Вы уверены, что хотите удалить кампанию "{campaignToDelete?.name}"? Это действие необратимо.
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Отмена</Button>
            <Button variant="destructive" onClick={confirmDelete}>Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
