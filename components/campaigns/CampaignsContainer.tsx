'use client';

import { useState } from 'react';
import { Crown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCampaigns } from './hooks/useCampaigns';
import { CampaignFiltersComponent } from './components/CampaignFilters';
import { CampaignGrid } from './components/CampaignGrid';
import { ErrorState } from '@/components/shared/ui/ErrorState';
import { Campaign, CampaignFormData } from './types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InputField } from '@/components/ui/form-fields/input-field';
import { SelectField } from '@/components/ui/form-fields/select-field';
import { TextareaField } from '@/components/ui/form-fields/textarea-field';
import { NumberField } from '@/components/ui/form-fields/number-field';
import { GAME_SYSTEMS } from '@/components/shared/constants';
import { InvitePlayerDialog } from './components/InvitePlayerDialog';

export const CampaignsContainer = () => {
  const {
    filteredCampaigns,
    filters,
    isLoading,
    error,
    totalCount,
    filteredCount,
    updateFilter,
    clearFilters,
    createCampaign,
    updateCampaign,
    deleteCampaign
  } = useCampaigns({ autoLoad: true });

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [inviteDialogCampaign, setInviteDialogCampaign] = useState<Campaign | null>(null);

  const initialFormData: CampaignFormData = {
    name: '',
    description: '',
    system: 'dnd5e',
    maxPlayers: 4,
    currentLevel: '1-3',
    setting: '',
    masterNotes: ''
  };

  const [formData, setFormData] = useState<CampaignFormData>(initialFormData);

  const handleCreateCampaign = () => {
    setEditingCampaign(null);
    setFormData(initialFormData);
    setIsFormDialogOpen(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description || '',
      system: campaign.system,
      maxPlayers: campaign.maxPlayers,
      currentLevel: campaign.currentLevel,
      setting: campaign.setting || '',
      masterNotes: campaign.masterNotes || ''
    });
    setIsFormDialogOpen(true);
  };

  const handleSaveCampaign = async () => {
    if (editingCampaign) {
      await updateCampaign(editingCampaign.id, formData);
    } else {
      await createCampaign(formData);
    }
    setIsFormDialogOpen(false);
  };

  const handleViewCampaign = (campaign: Campaign) => {
    console.log('View campaign:', campaign);
    // Future implementation: router.push(`/master/campaigns/${campaign.id}`);
  };

  const handleDelete = (campaign: Campaign) => {
    if (window.confirm(`Вы уверены, что хотите удалить кампанию "${campaign.name}"?`)) {
      deleteCampaign(campaign.id);
    }
  };

  const handleOpenInviteDialog = (campaign: Campaign) => {
    setInviteDialogCampaign(campaign);
  };

  if (error) {
    return <ErrorState message={error} onRetry={clearFilters} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <Crown className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold">
              <span className="fantasy-text-gradient">Мои кампании</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Создавайте и управляйте своими эпическими приключениями
          </p>
        </div>

        <Button 
          onClick={handleCreateCampaign}
          className="fantasy-gradient hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4 mr-2" />
          Создать кампанию
        </Button>
      </div>

      <CampaignFiltersComponent
        filters={filters}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
        resultCount={filteredCount}
        totalCount={totalCount}
      />

      <CampaignGrid
        campaigns={filteredCampaigns}
        onView={handleViewCampaign}
        onEdit={handleEditCampaign}
        onDelete={handleDelete}
        onInvite={handleOpenInviteDialog}
        isLoading={isLoading}
      />

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-cinzel text-2xl">
              {editingCampaign ? 'Редактировать кампанию' : 'Создать новую кампанию'}
            </DialogTitle>
            <DialogDescription>
              {editingCampaign ? 'Измените настройки кампании' : 'Настройте новую кампанию для ваших игроков'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <InputField
              label="Название кампании"
              value={formData.name}
              onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
              placeholder="Введите название кампании"
              required
            />
            <SelectField
              label="Игровая система"
              value={formData.system}
              onChange={(value) => setFormData(prev => ({ ...prev, system: value as Campaign['system'] }))}
              options={GAME_SYSTEMS}
            />
            <TextareaField
              label="Описание"
              value={formData.description}
              onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
              placeholder="Опишите сюжет и атмосферу кампании..."
              rows={3}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberField
                label="Максимум игроков"
                value={formData.maxPlayers}
                onChange={(value) => setFormData(prev => ({ ...prev, maxPlayers: value }))}
                min={1} max={8}
              />
              <InputField
                label="Уровень группы"
                value={formData.currentLevel}
                onChange={(value) => setFormData(prev => ({ ...prev, currentLevel: value }))}
                placeholder="1-3, 4-6, etc."
              />
            </div>
             <InputField
              label="Сеттинг"
              value={formData.setting}
              onChange={(value) => setFormData(prev => ({ ...prev, setting: value }))}
              placeholder="Забытые королевства, Равенлофт..."
            />
            <TextareaField
              label="Заметки мастера"
              value={formData.masterNotes}
              onChange={(value) => setFormData(prev => ({ ...prev, masterNotes: value }))}
              placeholder="Личные заметки о кампании, планы, идеи..."
              rows={3}
            />
            <div className="flex items-center justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={() => setIsFormDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleSaveCampaign} className="fantasy-gradient">
                {editingCampaign ? 'Сохранить изменения' : 'Создать кампанию'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <InvitePlayerDialog
        campaign={inviteDialogCampaign}
        isOpen={!!inviteDialogCampaign}
        onClose={() => setInviteDialogCampaign(null)}
      />
    </div>
  );
};
