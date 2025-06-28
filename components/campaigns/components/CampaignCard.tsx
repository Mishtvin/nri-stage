'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Users, Star, Eye, Edit, Trash2, Mail, Crown, Clock } from 'lucide-react';
import { Campaign } from '../types';
import { GAME_SYSTEMS, CAMPAIGN_STATUSES } from '@/components/shared/constants';

interface CampaignCardProps {
  campaign: Campaign;
  onView?: (campaign: Campaign) => void;
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (campaign: Campaign) => void;
  onInvite?: (campaign: Campaign) => void;
  className?: string;
  masterName?: string;
}

export const CampaignCard = ({ 
  campaign, 
  onView, 
  onEdit, 
  onDelete,
  onInvite,
  className,
  masterName
}: CampaignCardProps) => {
  const systemLabel = GAME_SYSTEMS.find(s => s.value === campaign.system)?.label;
  const statusConfig = CAMPAIGN_STATUSES.find(s => s.value === campaign.status);
  
  const StatusIcon = statusConfig?.icon || Clock;

  return (
    <Card className={`bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group flex flex-col justify-between ${className}`}>
      <div>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="font-cinzel text-lg group-hover:text-primary transition-colors line-clamp-2">
                {campaign.name}
              </CardTitle>
              {masterName && (
                <CardDescription className="flex items-center text-xs mt-1">
                  <Crown className="h-3 w-3 mr-1.5" />
                  {masterName}
                </CardDescription>
              )}
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge className={statusConfig?.color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig?.label}
              </Badge>
              <Badge variant="outline" className="border-primary/50">
                {systemLabel}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-primary" />
              <span>{campaign.players.length}/{campaign.maxPlayers} игроков</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-primary" />
              <span>Уровень {campaign.currentLevel}</span>
            </div>
          </div>

          {campaign.nextSession?.date && (
            <div className="p-3 bg-background/50 rounded border border-border/50">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-green-500" />
                <span className="font-medium">Следующая сессия:</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {new Date(campaign.nextSession.date).toLocaleDateString('ru-RU')}
                {campaign.nextSession.time && ` в ${campaign.nextSession.time}`}
              </div>
            </div>
          )}

          {campaign.players && campaign.players.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Игроки:</div>
              <div className="flex -space-x-2">
                {campaign.players.slice(0, 4).map((player) => (
                  <Avatar key={player.id} className="h-8 w-8 ring-2 ring-background">
                    <AvatarImage src={player.avatar} />
                    <AvatarFallback className="bg-primary/10 text-xs">
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {campaign.players.length > 4 && (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium ring-2 ring-background">
                    +{campaign.players.length - 4}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </div>

      <div className="p-6 pt-2">
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center space-x-2">
              {onEdit && (
                <Button
                  variant="ghost" size="sm" onClick={() => onEdit(campaign)}
                  className="hover:bg-primary/10"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost" size="sm" onClick={() => onDelete(campaign)}
                  className="hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {onInvite && (
                 <Button
                    variant="outline" size="sm" onClick={() => onInvite(campaign)}
                    className="border-primary/50 hover:bg-primary/10"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Пригласить
                  </Button>
              )}
              {onView && (
                <Button
                  variant="outline" size="sm" onClick={() => onView(campaign)}
                  className="border-primary/50 hover:bg-primary/10"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Подробнее
                </Button>
              )}
            </div>
          </div>
      </div>
    </Card>
  );
};
