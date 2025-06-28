'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Map, 
  MapPin, 
  Crown, 
  Sword, 
  Shield, 
  Scroll, 
  Users, 
  Eye,
  Plus,
  Search,
  Filter,
  Layers,
  Navigation,
  Compass
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';

interface MapLocation {
  id: string;
  name: string;
  type: 'campaign' | 'quest' | 'location' | 'city' | 'dungeon' | 'landmark';
  x: number;
  y: number;
  campaign?: string;
  description: string;
  status: 'active' | 'completed' | 'locked' | 'discovered';
  level?: string;
  connectedTo: string[];
}

interface Campaign {
  id: string;
  name: string;
  color: string;
  isVisible: boolean;
}

export default function GlobalMapPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [visibleCampaigns, setVisibleCampaigns] = useState<Set<string>>(new Set());
  const [mapScale, setMapScale] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    // Load mock data
    const mockCampaigns: Campaign[] = [
      { id: 'curse-of-strahd', name: 'Curse of Strahd', color: '#8B0000', isVisible: true },
      { id: 'dragon-heist', name: 'Dragon Heist', color: '#FFD700', isVisible: true },
      { id: 'lost-mines', name: 'Lost Mines of Phandelver', color: '#228B22', isVisible: true },
      { id: 'homebrew', name: 'Homebrew Campaign', color: '#4B0082', isVisible: false }
    ];

    const mockLocations: MapLocation[] = [
      {
        id: '1',
        name: 'Баровия',
        type: 'campaign',
        x: 200,
        y: 150,
        campaign: 'curse-of-strahd',
        description: 'Проклятая земля, окутанная туманом и управляемая вампиром Страдом.',
        status: 'active',
        level: '1-10',
        connectedTo: ['2', '3']
      },
      {
        id: '2',
        name: 'Замок Равенлофт',
        type: 'dungeon',
        x: 180,
        y: 120,
        campaign: 'curse-of-strahd',
        description: 'Древний замок вампира Страда фон Заровича.',
        status: 'locked',
        level: '8-10',
        connectedTo: ['1']
      },
      {
        id: '3',
        name: 'Деревня Баровия',
        type: 'location',
        x: 220,
        y: 180,
        campaign: 'curse-of-strahd',
        description: 'Мрачная деревня у подножия замка.',
        status: 'discovered',
        level: '1-3',
        connectedTo: ['1', '4']
      },
      {
        id: '4',
        name: 'Уотердип',
        type: 'city',
        x: 400,
        y: 300,
        campaign: 'dragon-heist',
        description: 'Город великолепия, центр торговли и интриг.',
        status: 'active',
        level: '1-5',
        connectedTo: ['3', '5', '6']
      },
      {
        id: '5',
        name: 'Таверна "Тролль и Жаба"',
        type: 'location',
        x: 380,
        y: 280,
        campaign: 'dragon-heist',
        description: 'Популярная таверна в доках Уотердипа.',
        status: 'discovered',
        level: '1-2',
        connectedTo: ['4']
      },
      {
        id: '6',
        name: 'Фандалин',
        type: 'city',
        x: 500,
        y: 400,
        campaign: 'lost-mines',
        description: 'Небольшой пограничный городок.',
        status: 'active',
        level: '1-5',
        connectedTo: ['4', '7']
      },
      {
        id: '7',
        name: 'Потерянные шахты Фанделвера',
        type: 'dungeon',
        x: 520,
        y: 420,
        campaign: 'lost-mines',
        description: 'Заброшенные шахты, полные опасностей и сокровищ.',
        status: 'locked',
        level: '3-5',
        connectedTo: ['6']
      },
      {
        id: '8',
        name: 'Древний храм',
        type: 'landmark',
        x: 300,
        y: 250,
        campaign: 'homebrew',
        description: 'Загадочные руины древней цивилизации.',
        status: 'locked',
        level: '5-8',
        connectedTo: []
      }
    ];

    setLocations(mockLocations);
    setCampaigns(mockCampaigns);
    setVisibleCampaigns(new Set(mockCampaigns.filter(c => c.isVisible).map(c => c.id)));
  }, []);

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

  const getLocationIcon = (type: string) => {
    const icons = {
      campaign: Crown,
      quest: Scroll,
      location: MapPin,
      city: Shield,
      dungeon: Sword,
      landmark: Compass
    };
    return icons[type as keyof typeof icons] || MapPin;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 border-green-500';
      case 'completed': return 'text-blue-500 border-blue-500';
      case 'locked': return 'text-gray-500 border-gray-500';
      case 'discovered': return 'text-yellow-500 border-yellow-500';
      default: return 'text-gray-500 border-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активно';
      case 'completed': return 'Завершено';
      case 'locked': return 'Заблокировано';
      case 'discovered': return 'Обнаружено';
      default: return status;
    }
  };

  const getCampaignColor = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign ? campaign.color : '#666666';
  };

  const filteredLocations = locations.filter(location => 
    !location.campaign || visibleCampaigns.has(location.campaign)
  );

  const toggleCampaignVisibility = (campaignId: string) => {
    setVisibleCampaigns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId);
      } else {
        newSet.add(campaignId);
      }
      return newSet;
    });
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
                  <Map className="h-8 w-8 text-primary" />
                  <h1 className="text-4xl md:text-5xl font-cinzel font-bold">
                    <span className="fantasy-text-gradient">Глобальная карта</span>
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground">
                  Исследуйте мир ваших кампаний, квестов и локаций
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
                  <Search className="h-4 w-4 mr-2" />
                  Поиск
                </Button>
                <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
                  <Filter className="h-4 w-4 mr-2" />
                  Фильтры
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Campaign Controls */}
              <div className="lg:col-span-1 space-y-4">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="font-cinzel flex items-center space-x-2">
                      <Layers className="h-5 w-5 text-primary" />
                      <span>Кампании</span>
                    </CardTitle>
                    <CardDescription>
                      Управляйте видимостью кампаний на карте
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {campaigns.map(campaign => (
                      <div key={campaign.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full border-2"
                            style={{ 
                              backgroundColor: visibleCampaigns.has(campaign.id) ? campaign.color : 'transparent',
                              borderColor: campaign.color 
                            }}
                          />
                          <span className="text-sm">{campaign.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCampaignVisibility(campaign.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Eye className={`h-4 w-4 ${visibleCampaigns.has(campaign.id) ? 'text-primary' : 'text-muted-foreground'}`} />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Map Controls */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="font-cinzel flex items-center space-x-2">
                      <Navigation className="h-5 w-5 text-primary" />
                      <span>Управление</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Масштаб</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setMapScale(prev => Math.max(0.5, prev - 0.1))}
                        >
                          -
                        </Button>
                        <span className="text-sm w-12 text-center">{Math.round(mapScale * 100)}%</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setMapScale(prev => Math.min(2, prev + 0.1))}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-primary/50 hover:bg-primary/10"
                      onClick={() => {
                        setMapScale(1);
                        setMapOffset({ x: 0, y: 0 });
                      }}
                    >
                      Сбросить вид
                    </Button>
                  </CardContent>
                </Card>

                {/* Location Details */}
                {selectedLocation && (
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader>
                      <CardTitle className="font-cinzel text-lg">
                        {selectedLocation.name}
                      </CardTitle>
                      <CardDescription>
                        {selectedLocation.campaign && campaigns.find(c => c.id === selectedLocation.campaign)?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {selectedLocation.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Тип:</span>
                          <Badge variant="outline">
                            {selectedLocation.type}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Статус:</span>
                          <Badge className={getStatusColor(selectedLocation.status)}>
                            {getStatusText(selectedLocation.status)}
                          </Badge>
                        </div>
                        {selectedLocation.level && (
                          <div className="flex items-center justify-between text-sm">
                            <span>Уровень:</span>
                            <span>{selectedLocation.level}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-primary/50 hover:bg-primary/10"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Подробнее
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLocation(null)}
                        >
                          ✕
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Map Area */}
              <div className="lg:col-span-3">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-[600px] overflow-hidden">
                  <CardContent className="p-0 h-full relative">
                    <div 
                      className="w-full h-full relative bg-gradient-to-br from-green-900/20 via-brown-800/20 to-blue-900/20"
                      style={{
                        transform: `scale(${mapScale}) translate(${mapOffset.x}px, ${mapOffset.y}px)`,
                        transformOrigin: 'center center'
                      }}
                    >
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <svg width="100%" height="100%">
                          <defs>
                            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1"/>
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                      </div>

                      {/* Connection Lines */}
                      {filteredLocations.map(location => 
                        location.connectedTo.map(targetId => {
                          const target = filteredLocations.find(l => l.id === targetId);
                          if (!target) return null;
                          
                          return (
                            <svg
                              key={`${location.id}-${targetId}`}
                              className="absolute inset-0 pointer-events-none"
                              style={{ zIndex: 1 }}
                            >
                              <line
                                x1={location.x}
                                y1={location.y}
                                x2={target.x}
                                y2={target.y}
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeDasharray="5,5"
                                className="text-muted-foreground/30"
                              />
                            </svg>
                          );
                        })
                      )}

                      {/* Locations */}
                      {filteredLocations.map(location => {
                        const LocationIcon = getLocationIcon(location.type);
                        const campaignColor = location.campaign ? getCampaignColor(location.campaign) : '#666666';
                        
                        return (
                          <div
                            key={location.id}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110 ${
                              selectedLocation?.id === location.id ? 'scale-125 z-20' : 'z-10'
                            }`}
                            style={{
                              left: location.x,
                              top: location.y
                            }}
                            onClick={() => setSelectedLocation(location)}
                          >
                            <div 
                              className={`p-3 rounded-full border-2 shadow-lg ${getStatusColor(location.status)} ${
                                selectedLocation?.id === location.id 
                                  ? 'bg-primary/20 border-primary' 
                                  : 'bg-background/80 backdrop-blur-sm'
                              }`}
                              style={{
                                borderColor: selectedLocation?.id === location.id ? undefined : campaignColor
                              }}
                            >
                              <LocationIcon className="h-6 w-6" />
                            </div>
                            
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center">
                              <div className="bg-background/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-medium border border-border/50 whitespace-nowrap">
                                {location.name}
                              </div>
                              {location.level && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  Ур. {location.level}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Map Legend */}
                    <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                      <h4 className="font-cinzel font-semibold mb-3">Легенда</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center space-x-2">
                          <Crown className="h-4 w-4 text-primary" />
                          <span>Кампания</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <span>Город</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Sword className="h-4 w-4 text-primary" />
                          <span>Подземелье</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>Локация</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Compass className="h-4 w-4 text-primary" />
                          <span>Достопримечательность</span>
                        </div>
                      </div>
                    </div>

                    {/* Zoom Controls */}
                    <div className="absolute top-4 right-4 flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMapScale(prev => Math.min(2, prev + 0.2))}
                        className="bg-background/90 backdrop-blur-sm"
                      >
                        +
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMapScale(prev => Math.max(0.5, prev - 0.2))}
                        className="bg-background/90 backdrop-blur-sm"
                      >
                        -
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}