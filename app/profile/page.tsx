'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Sword, Users, Calendar, Trophy, Dice6, Shield, BookOpen, Settings, Star, Target, Zap, Heart, Brain, MessageSquare, Clock, MapPin, KeyRound, User as UserIcon, Trash2, Bell, Check, RefreshCw } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { User, Invitation, Campaign, CampaignPlayer } from '@/components/shared/types';
import { authService } from '@/lib/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { invitationStore, campaignStore } from '@/lib/data-store';
import { toast } from "sonner"


type UserRole = 'player' | 'master';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [activeRole, setActiveRole] = useState<UserRole>('player');
  const [isPasswordAccount, setIsPasswordAccount] = useState(false);
  
  // Dialog states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  
  // Form states
  const [settingsData, setSettingsData] = useState({
    name: '',
    avatar: '',
    notifications: {
      email: {
        campaignInvites: true,
        sessionReminders: true,
        newsletters: false,
      },
    },
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Loading/Error states
  const [passwordError, setPasswordError] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
    if (user) {
      setIsPasswordAccount(authService.isPasswordProvider());
      setSettingsData({
        name: user.name || '',
        avatar: user.avatar || '',
        notifications: {
          email: {
            campaignInvites: user.notifications?.email?.campaignInvites ?? true,
            sessionReminders: user.notifications?.email?.sessionReminders ?? true,
            newsletters: user.notifications?.email?.newsletters ?? false,
          },
        },
      });

      const unsubscribe = invitationStore.onChange((allInvitations) => {
        const userInvites = allInvitations.filter(
            inv => inv.inviteeId === user.id && inv.status === 'pending'
        );
        setInvitations(userInvites);
      });
      return () => unsubscribe();
    }
  }, [user, isLoading, router]);
  
  const handlePasswordAction = async () => {
    if (newPassword.length < 6) {
      setPasswordError('Пароль должен содержать не менее 6 символов.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Пароли не совпадают.');
      return;
    }
    
    setPasswordError('');
    setIsUpdatingPassword(true);
    
    try {
      if (isPasswordAccount) {
        await authService.updateUserPassword(newPassword);
        toast.success('Успех', { description: 'Ваш пароль был успешно обновлен.' });
      } else {
        await authService.addPasswordToAccount(newPassword);
        toast.success('Успех', { description: 'Пароль был успешно установлен для вашего аккаунта.' });
        setIsPasswordAccount(true);
      }
      setIsPasswordDialogOpen(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        setPasswordError('Эта операция требует недавней аутентификации. Пожалуйста, выйдите и войдите снова.');
      } else {
        setPasswordError(error.message);
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };
  
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await authService.updateUserProfile({ name: settingsData.name, avatar: settingsData.avatar });
      toast.success('Профиль сохранен', { description: 'Ваши данные профиля были успешно обновлены.' });
    } catch (error: any) {
      toast.error('Ошибка', { description: error.message });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      await authService.updateUserSettings({ notifications: settingsData.notifications });
      toast.success('Уведомления сохранены', { description: 'Ваши настройки уведомлений были обновлены.' });
    } catch (error: any) {
      toast.error('Ошибка', { description: error.message });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    try {
      await authService.deleteUserAccount();
      toast.success('Аккаунт удален', { description: 'Ваш аккаунт был успешно удален.' });
      // The onAuthStateChange listener will handle redirection
    } catch (error: any) {
      toast.error('Ошибка', { description: 'Не удалось удалить аккаунт. Возможно, вам потребуется войти в систему заново.' });
    }
  };

  const handleSettingsFieldChange = (field: keyof typeof settingsData, value: any) => {
    setSettingsData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: keyof typeof settingsData.notifications.email, value: boolean) => {
    setSettingsData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        email: {
          ...prev.notifications.email,
          [field]: value
        }
      }
    }));
  };
  
  const handleAcceptInvite = async (invitation: Invitation) => {
    if (!user) return;
    try {
      const campaign = await campaignStore.get(invitation.campaignId);
      if (campaign && !campaign.players.some(p => p.id === user.id)) {
        const newPlayer: CampaignPlayer = {
          id: user.id,
          name: user.name,
          avatar: user.avatar || '',
          joinedAt: new Date().toISOString(),
        };
        await campaignStore.update(invitation.campaignId, {
          players: [...campaign.players, newPlayer],
        });
      }
      await invitationStore.update(invitation.id, { status: 'accepted' });
      toast.success('Приглашение принято!', { description: `Вы присоединились к кампании "${invitation.campaignName}"` });
    } catch(e) {
      toast.error('Не удалось принять приглашение.');
    }
  };

  const handleDeclineInvite = async (invitationId: string) => {
    await invitationStore.update(invitationId, { status: 'declined' });
    toast.info('Приглашение отклонено.');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Mock data
  const userStats = {
    campaignsPlayed: 8,
    campaignsMastered: 3,
    totalSessions: 45,
    favoriteClass: 'Wizard',
    achievements: 12,
    experience: 12450,
    nextLevelExp: 15000,
    level: 15,
  };

  const playerStats = [
    { label: 'Уровень', value: userStats.level, icon: Star },
    { label: 'Опыт', value: `${userStats.experience}/${userStats.nextLevelExp}`, icon: Target },
    { label: 'Кампании', value: userStats.campaignsPlayed, icon: BookOpen },
    { label: 'Сессии', value: userStats.totalSessions, icon: Clock }
  ];

  const masterStats = [
    { label: 'Кампании ведёт', value: userStats.campaignsMastered, icon: Crown },
    { label: 'Игроков обучил', value: 24, icon: Users },
    { label: 'Часов мастерства', value: 156, icon: Clock },
    { label: 'Рейтинг мастера', value: '4.8/5', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-background dice-pattern">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/50 to-primary/5" />
      <Navbar />
      
      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Header with Role Switcher */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20 ring-4 ring-primary/50">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary/10 text-2xl font-cinzel">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h1 className="text-3xl font-cinzel font-bold fantasy-text-gradient">
                    {user.name}
                  </h1>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-primary/50">
                      Участник с {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Role Switcher */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm rounded-lg p-1 border border-border/50">
                  <Button
                    variant={activeRole === 'player' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveRole('player')}
                    className={activeRole === 'player' ? 'fantasy-gradient' : 'hover:bg-primary/10'}
                  >
                    <Sword className="h-4 w-4 mr-2" />
                    Игрок
                  </Button>
                  <Button
                    variant={activeRole === 'master' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveRole('master')}
                    className={activeRole === 'master' ? 'fantasy-gradient' : 'hover:bg-primary/10'}
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Мастер
                  </Button>
                </div>
                
                <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="border-primary/50 hover:bg-primary/10 relative">
                      <Settings className="h-5 w-5" />
                      {invitations.length > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-xs items-center justify-center text-white">{invitations.length}</span>
                        </span>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                      <DialogHeader>
                          <DialogTitle>Настройки аккаунта</DialogTitle>
                          <DialogDescription>
                              Управляйте настройками вашего профиля, уведомлений и безопасности.
                          </DialogDescription>
                      </DialogHeader>
                      <Tabs defaultValue="profile" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="profile">Профиль</TabsTrigger>
                              <TabsTrigger value="notifications">
                                  Уведомления
                                  {invitations.length > 0 && <Badge className="ml-2 bg-red-500">{invitations.length}</Badge>}
                              </TabsTrigger>
                              <TabsTrigger value="security">Безопасность</TabsTrigger>
                          </TabsList>
                          <TabsContent value="profile" className="space-y-6 pt-4">
                              <div className="space-y-2">
                                  <Label htmlFor="name">Имя</Label>
                                  <Input id="name" value={settingsData.name} onChange={e => handleSettingsFieldChange('name', e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                  <Label htmlFor="avatar">URL аватара</Label>
                                  <Input id="avatar" value={settingsData.avatar} onChange={e => handleSettingsFieldChange('avatar', e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                  <Label>Email</Label>
                                  <Input value={user.email} disabled />
                                  <p className="text-xs text-muted-foreground">Email изменить нельзя.</p>
                              </div>
                              <DialogFooter>
                                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                                    {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Сохранить'}
                                  </Button>
                              </DialogFooter>
                          </TabsContent>
                          <TabsContent value="notifications" className="space-y-6 pt-4">
                            <h4 className="font-medium">Приглашения в кампании</h4>
                            {invitations.length > 0 ? (
                                <div className="space-y-3">
                                  {invitations.map(invite => (
                                    <div key={invite.id} className="flex items-center justify-between p-3 border rounded-lg">
                                      <div className="space-y-0.5">
                                        <p className="text-sm font-medium">Вас пригласили в кампанию "{invite.campaignName}"</p>
                                        <p className="text-xs text-muted-foreground">Мастер: {invite.masterName}</p>
                                      </div>
                                      <div className="flex space-x-2">
                                        <Button size="sm" onClick={() => handleAcceptInvite(invite)}><Check className="h-4 w-4 mr-2"/>Принять</Button>
                                        <Button size="sm" variant="outline" onClick={() => handleDeclineInvite(invite.id)}>Отклонить</Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">У вас нет новых приглашений.</p>
                            )}
                            <h4 className="font-medium">Email Уведомления</h4>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                  <Label>Приглашения в кампанию</Label>
                                  <p className="text-xs text-muted-foreground">Получать email при приглашении в новую кампанию.</p>
                                </div>
                                <Switch checked={settingsData.notifications.email.campaignInvites} onCheckedChange={v => handleNotificationChange('campaignInvites', v)} />
                              </div>
                              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                  <Label>Напоминания о сессиях</Label>
                                  <p className="text-xs text-muted-foreground">Получать напоминания о предстоящих игровых сессиях.</p>
                                </div>
                                <Switch checked={settingsData.notifications.email.sessionReminders} onCheckedChange={v => handleNotificationChange('sessionReminders', v)} />
                              </div>
                              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                  <Label>Новости и обновления</Label>
                                  <p className="text-xs text-muted-foreground">Получать новости о платформе NRI.</p>
                                </div>
                                <Switch checked={settingsData.notifications.email.newsletters} onCheckedChange={v => handleNotificationChange('newsletters', v)} />
                              </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleSaveNotifications} disabled={isSaving}>
                                    {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Сохранить'}
                                </Button>
                            </DialogFooter>
                          </TabsContent>
                          <TabsContent value="security" className="space-y-6 pt-4">
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center text-base"><KeyRound className="h-4 w-4 mr-2" /> Пароль</CardTitle>
                              </CardHeader>
                              <CardContent className="flex items-center justify-between">
                                  <p className="text-sm text-muted-foreground">
                                    {isPasswordAccount ? 'Измените ваш текущий пароль.' : 'Установите пароль для входа по email.'}
                                  </p>
                                  <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)}>
                                    {isPasswordAccount ? 'Сменить пароль' : 'Установить пароль'}
                                  </Button>
                              </CardContent>
                            </Card>
                            <Card className="border-destructive">
                               <CardHeader>
                                <CardTitle className="flex items-center text-base text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Опасная зона</CardTitle>
                              </CardHeader>
                              <CardContent className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                  Это действие необратимо. Все ваши данные будут удалены.
                                </p>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive">Удалить аккаунт</Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Это действие нельзя отменить. Ваш аккаунт и все связанные с ним данные (персонажи, кампании и т.д.) будут навсегда удалены.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                                      <AlertDialogAction onClick={handleDeleteAccount}>Да, удалить аккаунт</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </CardContent>
                            </Card>
                          </TabsContent>
                      </Tabs>
                  </DialogContent>
                </Dialog>
                
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(activeRole === 'player' ? playerStats : masterStats).map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardContent className="p-4 text-center">
                      <div className="flex justify-center mb-2">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold font-cinzel">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <p className="text-center text-muted-foreground text-sm">Данные статистики пока что являются демонстрационными.</p>

          </div>
        </div>
      </div>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>{isPasswordAccount ? 'Сменить пароль' : 'Установить пароль'}</DialogTitle>
                  <DialogDescription>
                    {isPasswordAccount ? 'Введите новый пароль для вашего аккаунта.' : 'Установите пароль, чтобы иметь возможность входить по email и паролю.'}
                  </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                  <div className="space-y-2">
                      <Label htmlFor="newPassword">Новый пароль</Label>
                      <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                      />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                      <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                      />
                  </div>
                  {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
              </div>
              <DialogFooter>
                  <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>Отмена</Button>
                  <Button onClick={handlePasswordAction} disabled={isUpdatingPassword}>
                      {isUpdatingPassword ? <RefreshCw className="h-4 w-4 animate-spin" /> : (isPasswordAccount ? 'Сменить пароль' : 'Установить пароль')}
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}
