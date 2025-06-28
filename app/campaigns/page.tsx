'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { Users, Search } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { campaignStore, userStore } from '@/lib/data-store';
import { Campaign, User } from '@/components/shared/types';
import { CampaignCard } from '@/components/campaigns/components/CampaignCard';
import { Input } from '@/components/ui/input';
import { CampaignDetailDialog } from '@/components/campaigns/components/CampaignDetailDialog';

export default function CampaignsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    setIsLoading(true);
    let campaignsLoaded = false;
    let usersLoaded = false;

    const checkDoneLoading = () => {
        if (campaignsLoaded && usersLoaded) {
            setIsLoading(false);
        }
    };

    const unsubscribeCampaigns = campaignStore.onChange((allCampaigns) => {
      setCampaigns(allCampaigns);
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
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.description?.toLowerCase().includes(searchLower)
      );
    }
    setFilteredCampaigns(filtered);
  }, [searchTerm, campaigns]);
  
  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDetailDialogOpen(true);
  };
  
  const getMasterName = (masterId: string) => {
    return users.find(u => u.id === masterId)?.name || 'Неизвестный мастер';
  };

  if (authLoading || isLoading) {
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
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-cinzel font-bold">
                <span className="fantasy-text-gradient">Доступные кампании</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Исследуйте миры, созданные другими мастерами, и присоединяйтесь к приключениям!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <div className="relative flex-1 max-w-lg mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск кампаний..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
                <Users className="h-4 w-4 mr-2" />
                Присоединиться по коду
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard 
                  key={campaign.id} 
                  campaign={campaign} 
                  onView={handleViewCampaign} 
                  masterName={getMasterName(campaign.masterId)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <CampaignDetailDialog 
        campaign={selectedCampaign}
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        masterName={selectedCampaign ? getMasterName(selectedCampaign.masterId) : ''}
      />
    </div>
  );
}
