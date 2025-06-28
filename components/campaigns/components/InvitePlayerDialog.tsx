'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { userStore, invitationStore } from '@/lib/data-store';
import { Campaign, Invitation } from '@/components/shared/types';
import { useAuth } from '@/components/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/loading-spinner';
import { User, Mail, Send, Clock } from 'lucide-react';

interface InvitePlayerDialogProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvitePlayerDialog({ campaign, isOpen, onClose }: InvitePlayerDialogProps) {
  const { user: masterUser } = useAuth();
  const [email, setEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<Invitation[]>([]);

  useEffect(() => {
    if (isOpen && campaign) {
      const unsubscribe = invitationStore.onChange((allInvites) => {
        const campaignInvites = allInvites.filter(
          inv => inv.campaignId === campaign.id && inv.status === 'pending'
        );
        setPendingInvites(campaignInvites);
      });
      return () => unsubscribe();
    }
  }, [isOpen, campaign]);
  
  const handleInvite = async () => {
    if (!email || !campaign || !masterUser) return;
    
    setIsInviting(true);
    try {
      const allUsers = await userStore.getAll();
      const invitee = allUsers.find(u => u.email === email);

      if (!invitee) {
        toast.error("Пользователь не найден", { description: "Пользователь с таким email не зарегистрирован." });
        return;
      }
      
      if (invitee.id === masterUser.id) {
        toast.error("Нельзя пригласить себя");
        return;
      }
      
      const isAlreadyPlayer = campaign.players.some(p => p.id === invitee.id);
      if (isAlreadyPlayer) {
        toast.error("Пользователь уже в кампании");
        return;
      }

      const hasPendingInvite = pendingInvites.some(inv => inv.inviteeId === invitee.id);
      if (hasPendingInvite) {
        toast.error("Приглашение уже отправлено");
        return;
      }

      const newInvitation: Omit<Invitation, 'id'> = {
        campaignId: campaign.id,
        campaignName: campaign.name,
        masterId: masterUser.id,
        masterName: masterUser.name,
        inviteeId: invitee.id,
        inviteeEmail: invitee.email,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      await invitationStore.add(newInvitation);
      
      toast.success("Приглашение отправлено", { description: `Приглашение было отправлено пользователю ${invitee.name}.` });
      setEmail('');

    } catch (error) {
      toast.error("Ошибка", { description: "Не удалось отправить приглашение." });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Пригласить игроков в "{campaign?.name}"</DialogTitle>
          <DialogDescription>
            Отправьте приглашение пользователям, чтобы они присоединились к вашей кампании.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {/* Форма приглашения */}
          <div className="space-y-3">
            <h4 className="font-semibold">Отправить новое приглашение</h4>
            <div className="flex items-center space-x-2">
              <Input
                type="email"
                placeholder="Email пользователя"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isInviting}
              />
              <Button onClick={handleInvite} disabled={isInviting || !email}>
                {isInviting ? <LoadingSpinner size="sm"/> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <Separator />
          
          {/* Текущие игроки */}
          <div className="space-y-3">
            <h4 className="font-semibold">Текущие игроки ({campaign?.players.length})</h4>
            {campaign && campaign.players.length > 0 ? (
              <div className="space-y-2">
                {campaign.players.map(player => (
                  <div key={player.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                     <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={player.avatar} />
                            <AvatarFallback>{player.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{player.name}</span>
                     </div>
                  </div>
                ))}
              </div>
            ) : (
               <p className="text-sm text-muted-foreground">В кампании пока нет игроков.</p>
            )}
          </div>
          
          <Separator />

          {/* Ожидающие приглашения */}
          <div className="space-y-3">
            <h4 className="font-semibold">Ожидающие приглашения ({pendingInvites.length})</h4>
             {pendingInvites.length > 0 ? (
              <div className="space-y-2">
                {pendingInvites.map(invite => (
                  <div key={invite.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                     <div className="flex items-center space-x-3">
                        <User className="h-6 w-6 text-muted-foreground"/>
                        <span>{invite.inviteeEmail}</span>
                     </div>
                     <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Ожидание</span>
                     </div>
                  </div>
                ))}
              </div>
            ) : (
               <p className="text-sm text-muted-foreground">Нет ожидающих приглашений.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
