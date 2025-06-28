'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Calendar, Users, Star, Crown, Clock } from 'lucide-react';
import { Campaign } from '../types';
import { GAME_SYSTEMS, CAMPAIGN_STATUSES } from '@/components/shared/constants';

interface CampaignDetailDialogProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  masterName: string;
}

export function CampaignDetailDialog({ campaign, isOpen, onClose, masterName }: CampaignDetailDialogProps) {
  if (!campaign) {
    return null;
  }

  const system = GAME_SYSTEMS.find(s => s.value === campaign.system);
  const status = CAMPAIGN_STATUSES.find(s => s.value === campaign.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <DialogTitle className="font-cinzel text-2xl">{campaign.name}</DialogTitle>
              <div className="flex items-center space-x-2">
                {status && <Badge className={status.color}>{status.label}</Badge>}
                {system && <Badge variant="outline">{system.label}</Badge>}
              </div>
            </div>
            <DialogDescription>{campaign.setting || 'Сеттинг не указан'}</DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h4 className="font-semibold mb-2">Описание</h4>
            <p className="text-sm text-muted-foreground">{campaign.description || 'Описание отсутствует.'}</p>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Crown className="h-4 w-4 text-primary" />
              <div>
                <div className="text-muted-foreground">Мастер</div>
                <div className="font-medium">{masterName}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <div className="text-muted-foreground">Игроки</div>
                <div className="font-medium">{campaign.players.length} / {campaign.maxPlayers}</div>
              </div>
            </div>
             <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-primary" />
              <div>
                <div className="text-muted-foreground">Уровень</div>
                <div className="font-medium">{campaign.currentLevel}</div>
              </div>
            </div>
          </div>
          
          {campaign.nextSession?.date && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Следующая сессия</h4>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(campaign.nextSession.date).toLocaleDateString('ru-RU')}</span>
                  {campaign.nextSession.time && (
                    <>
                      <Clock className="h-4 w-4 ml-4" />
                      <span>{campaign.nextSession.time}</span>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />
          
          <div>
            <h4 className="font-semibold mb-3">Участники ({campaign.players.length})</h4>
            {campaign.players.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {campaign.players.map(player => (
                  <div key={player.id} className="flex items-center space-x-3 p-2 bg-muted/50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={player.avatar} />
                      <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <div className="font-medium">{player.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Присоединился {new Date(player.joinedAt).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">В этой кампании пока нет игроков.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
