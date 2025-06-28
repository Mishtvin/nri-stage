'use client';

import { useState, useEffect, useCallback } from 'react';
import { campaignStore } from '@/lib/data-store';
import { Campaign, CampaignFilters, CampaignFormData } from '../types';
import { useAuth } from '@/components/auth-provider';

interface UseCampaignsOptions {
  initialFilters?: Partial<CampaignFilters>;
  autoLoad?: boolean;
}

export const useCampaigns = (options: UseCampaignsOptions = {}) => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [filters, setFilters] = useState<CampaignFilters>({
    searchTerm: '',
    status: 'all',
    system: 'all',
    ...options.initialFilters
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCampaigns = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const unsubscribe = campaignStore.onChange((allCampaigns) => {
        const userCampaigns = allCampaigns.filter(c => c.masterId === user.id);
        setCampaigns(userCampaigns);
        setIsLoading(false);
      });
      return unsubscribe;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load campaigns');
      setIsLoading(false);
    }
    return () => {};
  }, [user]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (options.autoLoad && user) {
        (async () => {
            unsubscribe = await loadCampaigns();
        })();
    }
    
    return () => {
        if (unsubscribe) {
            unsubscribe();
        }
    };
  }, [loadCampaigns, options.autoLoad, user]);

  useEffect(() => {
    let filtered = campaigns;

    if (filters.searchTerm) {
      filtered = filtered.filter(campaign => 
        campaign.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === filters.status);
    }

    if (filters.system !== 'all') {
      filtered = filtered.filter(campaign => campaign.system === filters.system);
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, filters]);

  const updateFilter = useCallback((key: keyof CampaignFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      status: 'all',
      system: 'all'
    });
  }, []);

  const createCampaign = useCallback(async (campaignData: CampaignFormData) => {
    if (!user) {
      setError("Пользователь не авторизован");
      return;
    }
    const newCampaign: Omit<Campaign, 'id'> = {
      ...campaignData,
      status: 'planning',
      masterId: user.id,
      players: [],
      sessions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await campaignStore.add(newCampaign);
  }, [user]);

  const updateCampaign = useCallback(async (id: string, updates: Partial<CampaignFormData>) => {
    await campaignStore.update(id, { ...updates, updatedAt: new Date().toISOString() });
  }, []);

  const deleteCampaign = useCallback(async (id: string) => {
    await campaignStore.delete(id);
  }, []);

  return {
    campaigns,
    filteredCampaigns,
    filters,
    isLoading,
    error,
    loadCampaigns,
    updateFilter,
    clearFilters,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    totalCount: campaigns.length,
    filteredCount: filteredCampaigns.length
  };
};
