'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  Shield, 
  Package, 
  Layers, 
  BarChart, 
  Activity, 
  Calendar, 
  ArrowUpRight, 
  Dice6,
  RefreshCw,
  Database
} from 'lucide-react';
import { useAdminAuth } from '@/components/admin/AdminAuthProvider';

// Типы для статистики
interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalCampaigns: number;
  activeCampaigns: number;
  totalCharacters: number;
  totalMonsters: number;
  totalItems: number;
  totalSpells: number;
  recentLogins: number;
  newUsersToday: number;
  newCampaignsToday: number;
  serverLoad: number;
  databaseSize: string;
  lastBackup: string;
}

export default function AdminDashboardPage() {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalCharacters: 0,
    totalMonsters: 0,
    totalItems: 0,
    totalSpells: 0,
    recentLogins: 0,
    newUsersToday: 0,
    newCampaignsToday: 0,
    serverLoad: 0,
    databaseSize: '',
    lastBackup: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки данных
    const loadStats = () => {
      setIsLoading(true);
      
      // Имитация задержки сети
      setTimeout(() => {
        // Мок-данные для статистики
        setStats({
          totalUsers: 1250,
          activeUsers: 487,
          totalCampaigns: 342,
          activeCampaigns: 215,
          totalCharacters: 3782,
          totalMonsters: 856,
          totalItems: 1243,
          totalSpells: 358,
          recentLogins: 78,
          newUsersToday: 12,
          newCampaignsToday: 5,
          serverLoad: 23,
          databaseSize: '1.2 GB',
          lastBackup: '2024-06-21 03:00 AM'
        });
        setIsLoading(false);
      }, 1000);
    };
    
    loadStats();
  }, []);

  const refreshStats = () => {
    // Перезагрузка статистики
    setIsLoading(true);
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        activeUsers: Math.floor(Math.random() * 100) + 450,
        recentLogins: Math.floor(Math.random() * 20) + 70,
        serverLoad: Math.floor(Math.random() * 10) + 20
      }));
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Панель управления</h1>
          <p className="text-muted-foreground">
            Добро пожаловать, {user?.username}! Здесь вы можете управлять всеми аспектами приложения.
          </p>
        </div>
        <Button onClick={refreshStats} variant="outline" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Обновить данные
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="content">Контент</TabsTrigger>
          <TabsTrigger value="system">Система</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.newUsersToday} сегодня
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Активные кампании</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeCampaigns.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.activeCampaigns / stats.totalCampaigns) * 100)}% от общего числа
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Персонажи</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCharacters.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  ~{Math.round(stats.totalCharacters / stats.totalUsers)} на пользователя
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Активные пользователи</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% от общего числа
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Активность пользователей</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-muted-foreground">График активности пользователей</p>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Недавние события</CardTitle>
                <CardDescription>
                  Последние действия в системе
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { user: 'Александр Д.', action: 'создал новую кампанию', time: '12 минут назад' },
                    { user: 'Мария П.', action: 'обновила персонажа', time: '43 минуты назад' },
                    { user: 'Дмитрий В.', action: 'присоединился к кампании', time: '2 часа назад' },
                    { user: 'Елена М.', action: 'добавила монстра в бестиарий', time: '3 часа назад' }
                  ].map((event, i) => (
                    <div key={i} className="flex items-center">
                      <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <Dice6 className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          <span className="font-semibold">{event.user}</span> {event.action}
                        </p>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <div className="flex items-center justify-between mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/admin/users">
                      Управление пользователями
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Активные пользователи</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.recentLogins} входов за последние 24 часа
                </p>
                <div className="h-[80px] mt-4 bg-muted/20 rounded-md flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">График активности</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Новые пользователи</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.newUsersToday}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  сегодня
                </p>
                <div className="space-y-2 mt-4">
                  <div className="text-xs">За последние 7 дней: <span className="font-medium">87</span></div>
                  <div className="text-xs">За последние 30 дней: <span className="font-medium">342</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Распределение пользователей по ролям</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">График распределения ролей</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Кампании</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCampaigns.toLocaleString()}</div>
                <div className="flex items-center justify-between mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/admin/campaigns">
                      Управление
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Монстры</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMonsters.toLocaleString()}</div>
                <div className="flex items-center justify-between mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/admin/bestiary">
                      Управление
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Предметы</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalItems.toLocaleString()}</div>
                <div className="flex items-center justify-between mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/admin/items">
                      Управление
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Заклинания</CardTitle>
                <Layers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSpells.toLocaleString()}</div>
                <div className="flex items-center justify-between mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/admin/spells">
                      Управление
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Популярность контента</CardTitle>
              <CardDescription>
                Наиболее используемые элементы в кампаниях
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">График популярности контента</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Нагрузка сервера</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.serverLoad}%</div>
                <div className="h-2 bg-muted mt-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${stats.serverLoad > 80 ? 'bg-red-500' : stats.serverLoad > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${stats.serverLoad}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Среднее за последний час
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">База данных</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.databaseSize}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Последний бэкап: {stats.lastBackup}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <Button variant="outline" size="sm">
                    Создать бэкап
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Статистика API</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2M</div>
                <p className="text-xs text-muted-foreground mt-1">
                  запросов за последние 24 часа
                </p>
                <div className="h-[80px] mt-4 bg-muted/20 rounded-md flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">График запросов</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Системные настройки</CardTitle>
              <CardDescription>
                Управление основными параметрами системы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline">Очистить кэш</Button>
                  <Button variant="outline">Перезапустить сервисы</Button>
                  <Button variant="outline">Проверить обновления</Button>
                  <Button variant="outline">Настройки безопасности</Button>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Системная информация</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Версия:</span>
                      <span>1.5.2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Среда:</span>
                      <span>Production</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Последнее обновление:</span>
                      <span>2024-06-15</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}