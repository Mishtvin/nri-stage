import type { Campaign as SharedCampaign, CampaignPlayer, CampaignSession } from '@/components/shared/types';

export interface CampaignFilters {
  searchTerm: string;
  status: string;
  system: string;
}

export interface CampaignFormData {
  name: string;
  description: string;
  system: SharedCampaign['system'];
  maxPlayers: number;
  currentLevel: string;
  setting: string;
  masterNotes: string;
}

// Re-export shared types for convenience
export type Campaign = SharedCampaign;
export type CampaignPlayer = CampaignPlayer;
export type CampaignSession = CampaignSession;
