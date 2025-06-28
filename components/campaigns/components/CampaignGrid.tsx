'use client';

import { Campaign } from '../types';
import { CampaignCard } from './CampaignCard';
import { LoadingState } from '@/components/shared/ui/LoadingState';
import { EmptyState } from '@/components/shared/ui/EmptyState';
import { Crown } from 'lucide-react';

interface CampaignGridProps {
  campaigns: Campaign[];
  onView?: (campaign: Campaign) => void;
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (campaign: Campaign) => void;
  onInvite?: (campaign: Campaign) => void;
  isLoading?: boolean;
  className?: string;
}

export const CampaignGrid = ({ 
  campaigns, 
  onView,
  onEdit,
  onDelete,
  onInvite,
  isLoading = false,
  className 
}: CampaignGridProps) => {
  if (isLoading) {
    return <LoadingState text="Загрузка кампаний..." />;
  }

  if (campaigns.length === 0) {
    return (
      <EmptyState
        icon={Crown}
        title="Кампании не найдены"
        description="Создайте свою первую кампанию и начните эпическое приключение"
      />
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 ${className}`}>
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onInvite={onInvite}
        />
      ))}
    </div>
  );
};
