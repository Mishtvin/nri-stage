
'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Shield, 
  Mail, 
  Palette, 
  Globe, 
  Database, 
  FileText, 
  Bell, 
  Cloud, 
  HardDrive,
  Check,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { settingsStore, SystemSettings } from '@/lib/data-store';

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Состояния для настроек
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'NRI',
      siteDescription: 'Платформа для управления кампаниями D&D и других настольных ролевых игр',
      contactEmail: 'support@NRI.com',
      maxCampaignsPerUser: 10,
      maxCharactersPerUser: 20,
      defaultUserRole: 'player',
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: true
    },
    appearance: {
      primaryColor: '#8B5CF6',
      accentColor: '#F59E0B',
      fontPrimary: 'Cinzel',
      fontSecondary: 'Inter',
      darkMode: true,
      customCss: '',
      logoUrl: '/logo.png',
      faviconUrl: '/favicon.ico'
    },
    email: {
      smtpServer: 'smtp.example.com',
      smtpPort: '587',
      smtpUsername: 'noreply@NRI.com',
      smtpPassword: '••••••••••••',
      senderName: 'NRI',
      senderEmail: 'noreply@NRI.com',
      enableEmailNotifications: true
    },
    security: {
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireStrongPasswords: true,
      enableTwoFactor: false,
      allowSocialLogin: true,
      enableCaptcha: true
    }
  });

  // Загрузка настроек при монтировании
  useEffect(() => {
    const storedSettings = settingsStore.getSettings();
    if (storedSettings) {
        setSettings(storedSettings);
    }
    
    // Подписываемся на изменения настроек
    const unsubscribe = settingsStore.onSettingsChange((newSettings) => {
      if (newSettings) {
        setSettings(newSettings);
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Обработчик изменения общих настроек
  const handleGeneralSettingChange = (key: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        [key]: value
      }
    }));
  };

  // Обработчик изменения настроек внешнего вида
  const handleAppearanceSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: value
      }
    }));
  };

  // Обработчик изменения настроек email
  const handleEmailSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      email: {
        ...prev.email,
        [key]: value
      }
    }));
  };

  // Обработчик изменения настроек безопасности
  const handleSecuritySettingChange = (key: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value
      }
    }));
  };

  // Обработчик сохранения настроек
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Сохраняем настройки в хранилище
    settingsStore.saveSettings(settings);
    
    // Имитация задержки сети
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Сбрасываем индикатор успеха через 3 секунды
      setTimeout(() => setSaveSuccess(false), 3000);
      
      toast.success("Настройки сохранены", {
        description: "Изменения успешно применены",
      });
    }, 1000);
  };

  // Обработчик тестирования email
  const handleTestEmail = () => {
    toast.info("Тестовый email отправлен", {
      description: "Проверьте вашу почту для подтверждения",
    });
  };

  // Обработчик очистки кэша
  const handleClearCache = () => {
    toast.info("Кэш очищен", {
      description: "Кэш системы был успешно очищен",
    });
  };

  // Обработчик создания бэкапа
  const handleCreateBackup = () => {
    toast.info("Бэкап создан", {
      description: "Резервная копия базы данных успешно создана",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Настройки системы</h1>
          <p className="text-muted-foreground">
            Управление глобальными настройками приложения
          </p>
        </div>
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Сохранение...
            </>
          ) : saveSuccess ? (
            <>
              <Check className="h-4 w-4 mr-2 text-green-500" />
              Сохранено!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Сохранить изменения
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Общие</TabsTrigger>
          <TabsTrigger value="appearance">Внешний вид</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Безопасность</TabsTrigger>
          <TabsTrigger value="database">База данных</TabsTrigger>
          <TabsTrigger value="integrations">Интеграции</TabsTrigger>
        </TabsList>
        
        {/* Общие настройки */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Общие настройки
              </CardTitle>
              <CardDescription>
                Основные параметры работы приложения
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Название сайта</Label>
                  <Input 
                    id="siteName" 
                    value={settings.general.siteName}
                    onChange={(e) => handleGeneralSettingChange('siteName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Контактный email</Label>
                  <Input 
                    id="contactEmail" 
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => handleGeneralSettingChange('contactEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="siteDescription">Описание сайта</Label>
                  <Textarea 
                    id="siteDescription" 
                    value={settings.general.siteDescription}
                    onChange={(e) => handleGeneralSettingChange('siteDescription', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxCampaignsPerUser">Макс. кампаний на пользователя</Label>
                  <Input 
                    id="maxCampaignsPerUser" 
                    type="number"
                    value={settings.general.maxCampaignsPerUser}
                    onChange={(e) => handleGeneralSettingChange('maxCampaignsPerUser', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxCharactersPerUser">Макс. персонажей на пользователя</Label>
                  <Input 
                    id="maxCharactersPerUser" 
                    type="number"
                    value={settings.general.maxCharactersPerUser}
                    onChange={(e) => handleGeneralSettingChange('maxCharactersPerUser', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultUserRole">Роль по умолчанию</Label>
                  <Select 
                    value={settings.general.defaultUserRole}
                    onValueChange={(value) => handleGeneralSettingChange('defaultUserRole', value)}
                  >
                    <SelectTrigger id="defaultUserRole">
                      <SelectValue placeholder="Выберите роль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="player">Игрок</SelectItem>
                      <SelectItem value="master">Мастер</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenanceMode">Режим обслуживания</Label>
                    <p className="text-sm text-muted-foreground">
                      Временно закрыть доступ к сайту для всех, кроме администраторов
                    </p>
                  </div>
                  <Switch 
                    id="maintenanceMode"
                    checked={settings.general.maintenanceMode}
                    onCheckedChange={(checked) => handleGeneralSettingChange('maintenanceMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowRegistration">Разрешить регистрацию</Label>
                    <p className="text-sm text-muted-foreground">
                      Позволить новым пользователям регистрироваться на сайте
                    </p>
                  </div>
                  <Switch 
                    id="allowRegistration"
                    checked={settings.general.allowRegistration}
                    onCheckedChange={(checked) => handleGeneralSettingChange('allowRegistration', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireEmailVerification">Требовать подтверждение email</Label>
                    <p className="text-sm text-muted-foreground">
                      Пользователи должны подтвердить свой email перед использованием сайта
                    </p>
                  </div>
                  <Switch 
                    id="requireEmailVerification"
                    checked={settings.general.requireEmailVerification}
                    onCheckedChange={(checked) => handleGeneralSettingChange('requireEmailVerification', checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Настройки внешнего вида */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Настройки внешнего вида
              </CardTitle>
              <CardDescription>
                Настройте внешний вид и стиль приложения
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Основной цвет</Label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: settings.appearance.primaryColor }}
                    />
                    <Input 
                      id="primaryColor" 
                      type="text"
                      value={settings.appearance.primaryColor}
                      onChange={(e) => handleAppearanceSettingChange('primaryColor', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Акцентный цвет</Label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: settings.appearance.accentColor }}
                    />
                    <Input 
                      id="accentColor" 
                      type="text"
                      value={settings.appearance.accentColor}
                      onChange={(e) => handleAppearanceSettingChange('accentColor', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fontPrimary">Основной шрифт</Label>
                  <Select 
                    value={settings.appearance.fontPrimary}
                    onValueChange={(value) => handleAppearanceSettingChange('fontPrimary', value)}
                  >
                    <SelectTrigger id="fontPrimary">
                      <SelectValue placeholder="Выберите шрифт" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cinzel">Cinzel</SelectItem>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fontSecondary">Дополнительный шрифт</Label>
                  <Select 
                    value={settings.appearance.fontSecondary}
                    onValueChange={(value) => handleAppearanceSettingChange('fontSecondary', value)}
                  >
                    <SelectTrigger id="fontSecondary">
                      <SelectValue placeholder="Выберите шрифт" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Lato">Lato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">URL логотипа</Label>
                  <Input 
                    id="logoUrl" 
                    value={settings.appearance.logoUrl}
                    onChange={(e) => handleAppearanceSettingChange('logoUrl', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faviconUrl">URL favicon</Label>
                  <Input 
                    id="faviconUrl" 
                    value={settings.appearance.faviconUrl}
                    onChange={(e) => handleAppearanceSettingChange('faviconUrl', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customCss">Пользовательский CSS</Label>
                <Textarea 
                  id="customCss" 
                  value={settings.appearance.customCss}
                  onChange={(e) => handleAppearanceSettingChange('customCss', e.target.value)}
                  rows={5}
                  placeholder="/* Добавьте свои CSS стили здесь */"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="darkMode">Темная тема по умолчанию</Label>
                  <p className="text-sm text-muted-foreground">
                    Использовать темную тему как основную
                  </p>
                </div>
                <Switch 
                  id="darkMode"
                  checked={settings.appearance.darkMode}
                  onCheckedChange={(checked) => handleAppearanceSettingChange('darkMode', checked)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Настройки Email */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Настройки Email
              </CardTitle>
              <CardDescription>
                Настройте параметры отправки электронной почты
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpServer">SMTP сервер</Label>
                  <Input 
                    id="smtpServer" 
                    value={settings.email.smtpServer}
                    onChange={(e) => handleEmailSettingChange('smtpServer', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP порт</Label>
                  <Input 
                    id="smtpPort" 
                    value={settings.email.smtpPort}
                    onChange={(e) => handleEmailSettingChange('smtpPort', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP имя пользователя</Label>
                  <Input 
                    id="smtpUsername" 
                    value={settings.email.smtpUsername}
                    onChange={(e) => handleEmailSettingChange('smtpUsername', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP пароль</Label>
                  <Input 
                    id="smtpPassword" 
                    type="password"
                    value={settings.email.smtpPassword}
                    onChange={(e) => handleEmailSettingChange('smtpPassword', e.target.value)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="senderName">Имя отправителя</Label>
                  <Input 
                    id="senderName" 
                    value={settings.email.senderName}
                    onChange={(e) => handleEmailSettingChange('senderName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderEmail">Email отправителя</Label>
                  <Input 
                    id="senderEmail" 
                    type="email"
                    value={settings.email.senderEmail}
                    onChange={(e) => handleEmailSettingChange('senderEmail', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableEmailNotifications">Включить уведомления по email</Label>
                  <p className="text-sm text-muted-foreground">
                    Отправлять пользователям уведомления по email
                  </p>
                </div>
                <Switch 
                  id="enableEmailNotifications"
                  checked={settings.email.enableEmailNotifications}
                  onCheckedChange={(checked) => handleEmailSettingChange('enableEmailNotifications', checked)}
                />
              </div>
              
              <div className="p-4 bg-muted/20 rounded-md">
                <h4 className="text-sm font-medium mb-2">Тестирование настроек</h4>
                <div className="flex items-center space-x-2">
                  <Input placeholder="Введите email для теста" />
                  <Button variant="outline" onClick={handleTestEmail}>Отправить тест</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Настройки безопасности */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Настройки безопасности
              </CardTitle>
              <CardDescription>
                Настройте параметры безопасности и аутентификации
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Время сессии (часы)</Label>
                  <Input 
                    id="sessionTimeout" 
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSecuritySettingChange('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Макс. попыток входа</Label>
                  <Input 
                    id="maxLoginAttempts" 
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => handleSecuritySettingChange('maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Мин. длина пароля</Label>
                  <Input 
                    id="passwordMinLength" 
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => handleSecuritySettingChange('passwordMinLength', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireStrongPasswords">Требовать сложные пароли</Label>
                    <p className="text-sm text-muted-foreground">
                      Пароли должны содержать буквы, цифры и специальные символы
                    </p>
                  </div>
                  <Switch 
                    id="requireStrongPasswords"
                    checked={settings.security.requireStrongPasswords}
                    onCheckedChange={(checked) => handleSecuritySettingChange('requireStrongPasswords', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableTwoFactor">Двухфакторная аутентификация</Label>
                    <p className="text-sm text-muted-foreground">
                      Разрешить пользователям включать 2FA для своих аккаунтов
                    </p>
                  </div>
                  <Switch 
                    id="enableTwoFactor"
                    checked={settings.security.enableTwoFactor}
                    onCheckedChange={(checked) => handleSecuritySettingChange('enableTwoFactor', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowSocialLogin">Вход через соцсети</Label>
                    <p className="text-sm text-muted-foreground">
                      Разрешить вход через Google, Facebook и другие соцсети
                    </p>
                  </div>
                  <Switch 
                    id="allowSocialLogin"
                    checked={settings.security.allowSocialLogin}
                    onCheckedChange={(checked) => handleSecuritySettingChange('allowSocialLogin', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableCaptcha">Включить CAPTCHA</Label>
                    <p className="text-sm text-muted-foreground">
                      Защита от ботов при регистрации и входе
                    </p>
                  </div>
                  <Switch 
                    id="enableCaptcha"
                    checked={settings.security.enableCaptcha}
                    onCheckedChange={(checked) => handleSecuritySettingChange('enableCaptcha', checked)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="p-4 bg-muted/20 rounded-md">
                <h4 className="text-sm font-medium mb-2">Дополнительные действия</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button variant="outline">Сбросить все пароли</Button>
                  <Button variant="outline">Заблокировать подозрительные аккаунты</Button>
                  <Button variant="outline">Просмотр журнала безопасности</Button>
                  <Button variant="outline">Настройка брандмауэра</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Настройки базы данных */}
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Настройки базы данных
              </CardTitle>
              <CardDescription>
                Управление базой данных и резервным копированием
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <HardDrive className="h-5 w-5 mr-2 text-primary" />
                    Локальная база данных
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Управление локальной базой данных
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={handleClearCache}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Оптимизировать базу данных
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Экспорт данных
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Импорт данных
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Cloud className="h-5 w-5 mr-2 text-primary" />
                    Резервное копирование
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Управление резервными копиями
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={handleCreateBackup}>
                      <FileText className="h-4 w-4 mr-2" />
                      Создать резервную копию
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Восстановить из копии
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Настройки автоматического резервирования
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Статистика базы данных</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/20 rounded-md">
                    <h4 className="text-sm font-medium mb-1">Размер базы данных</h4>
                    <p className="text-2xl font-bold">1.2 GB</p>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-md">
                    <h4 className="text-sm font-medium mb-1">Количество таблиц</h4>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-md">
                    <h4 className="text-sm font-medium mb-1">Последний бэкап</h4>
                    <p className="text-2xl font-bold">2024-06-21</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-muted/20 rounded-md">
                <h4 className="text-sm font-medium mb-2">Очистка данных</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Удалить неактивных пользователей (>1 год)</span>
                    <Button variant="outline" size="sm">Очистить</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Удалить завершенные кампании (>1 год)</span>
                    <Button variant="outline" size="sm">Очистить</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Очистить журналы (>3 месяца)</span>
                    <Button variant="outline" size="sm">Очистить</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Настройки интеграций */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Интеграции
              </CardTitle>
              <CardDescription>
                Настройка интеграций с внешними сервисами
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#4285F4] flex items-center justify-center text-white mr-3">
                        G
                      </div>
                      <div>
                        <h3 className="font-medium">Google</h3>
                        <p className="text-xs text-muted-foreground">Авторизация через Google</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="googleClientId">Client ID</Label>
                      <Input id="googleClientId" placeholder="Введите Client ID" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="googleClientSecret">Client Secret</Label>
                      <Input id="googleClientSecret" type="password" placeholder="Введите Client Secret" />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white mr-3">
                        F
                      </div>
                      <div>
                        <h3 className="font-medium">Facebook</h3>
                        <p className="text-xs text-muted-foreground">Авторизация через Facebook</p>
                      </div>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="facebookAppId">App ID</Label>
                      <Input id="facebookAppId" placeholder="Введите App ID" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="facebookAppSecret">App Secret</Label>
                      <Input id="facebookAppSecret" type="password" placeholder="Введите App Secret" />
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#6441A4] flex items-center justify-center text-white mr-3">
                        D
                      </div>
                      <div>
                        <h3 className="font-medium">Discord</h3>
                        <p className="text-xs text-muted-foreground">Интеграция с Discord</p>
                      </div>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="discordClientId">Client ID</Label>
                      <Input id="discordClientId" placeholder="Введите Client ID" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="discordClientSecret">Client Secret</Label>
                      <Input id="discordClientSecret" type="password" placeholder="Введите Client Secret" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="discordWebhook">Webhook URL</Label>
                      <Input id="discordWebhook" placeholder="Введите Webhook URL" />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#000000] flex items-center justify-center text-white mr-3">
                        A
                      </div>
                      <div>
                        <h3 className="font-medium">API</h3>
                        <p className="text-xs text-muted-foreground">Настройки API</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="apiKey">API Key</Label>
                      <div className="flex">
                        <Input id="apiKey" value="sk_test_123456789abcdef" readOnly className="rounded-r-none" />
                        <Button variant="outline" className="rounded-l-none">
                          Обновить
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enablePublicApi">Публичный API</Label>
                        <p className="text-xs text-muted-foreground">
                          Разрешить доступ к API без аутентификации
                        </p>
                      </div>
                      <Switch id="enablePublicApi" defaultChecked={false} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-muted/20 rounded-md">
                <h4 className="text-sm font-medium mb-2">Другие интеграции</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Button variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    Push-уведомления
                  </Button>
                  <Button variant="outline">
                    <Globe className="h-4 w-4 mr-2" />
                    Интеграция с Roll20
                  </Button>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить новую
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
