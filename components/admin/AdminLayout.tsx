
'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  Settings, 
  Users, 
  Database, 
  Package, 
  Layers, 
  FileText, 
  BarChart, 
  Shield, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Home,
  Dice6,
  AlertTriangle,
  BookOpen,
  BookUser,
  Star,
  Gem,
  Crown
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthProvider';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const sidebarItems = [
  { 
    title: 'Обзор', 
    href: '/admin', 
    icon: Home,
    description: 'Общая статистика и информация'
  },
  { 
    title: 'Пользователи', 
    href: '/admin/users', 
    icon: Users,
    description: 'Управление пользователями и ролями'
  },
  { 
    title: 'Кампании', 
    href: '/admin/campaigns', 
    icon: Crown,
    description: 'Управление кампаниями'
  },
  { 
    title: 'Персонажи', 
    href: '/admin/characters', 
    icon: Users,
    description: 'Управление персонажами'
  },
  { 
    title: 'Бестиарий', 
    href: '/admin/bestiary', 
    icon: Shield,
    description: 'Управление монстрами и существами'
  },
  { 
    title: 'Предметы', 
    href: '/admin/items', 
    icon: Package,
    description: 'Управление предметами и снаряжением'
  },
  { 
    title: 'Заклинания', 
    href: '/admin/spells', 
    icon: Layers,
    description: 'Управление заклинаниями'
  },
  {
    title: 'Справочник',
    icon: BookOpen,
    description: 'Правила и состояния',
    children: [
      { 
        title: 'Состояния', 
        href: '/admin/reference/conditions', 
        icon: AlertTriangle,
        description: 'Управление состояниями'
      },
      { 
        title: 'Правила', 
        href: '/admin/reference/rules', 
        icon: BookOpen,
        description: 'Управление игровыми правилами'
      },
      { 
        title: 'Предыстории', 
        href: '/admin/reference/backgrounds', 
        icon: BookUser,
        description: 'Управление предысториями'
      },
      { 
        title: 'Особенности классов', 
        href: '/admin/reference/features', 
        icon: Star,
        description: 'Управление особенностями классов'
      },
      { 
        title: 'Черты', 
        href: '/admin/reference/feats', 
        icon: Gem,
        description: 'Управление чертами (умениями)'
      },
    ]
  },
  { 
    title: 'Статистика', 
    href: '/admin/stats', 
    icon: BarChart,
    description: 'Аналитика и статистика'
  },
  { 
    title: 'База данных', 
    href: '/admin/database', 
    icon: Database,
    description: 'Управление базой данных'
  },
  { 
    title: 'Настройки', 
    href: '/admin/settings', 
    icon: Settings,
    description: 'Настройки приложения'
  }
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAuthenticated, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null;
  }
  
  const isChildActive = (item: any) => item.children?.some((child: any) => pathname === child.href);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile navigation */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Dice6 className="h-6 w-6 text-primary" />
          <span className="font-cinzel font-bold text-lg">NRI Admin</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-card/50">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <Dice6 className="h-6 w-6 text-primary" />
            <span className="font-cinzel font-bold text-lg">NRI Admin</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Панель управления</p>
        </div>
        <ScrollArea className="flex-1 px-3 py-2">
          <div className="space-y-1">
            {sidebarItems.map((item) =>
              item.children ? (
                <Accordion key={item.title} type="single" collapsible defaultValue={isChildActive(item) ? item.title : undefined}>
                  <AccordionItem value={item.title} className="border-b-0">
                    <AccordionTrigger
                      className={cn(
                        'w-full justify-start hover:no-underline hover:bg-muted font-normal text-sm rounded-md px-3 py-2',
                        isChildActive(item) && 'bg-muted'
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="pl-4 pt-1">
                      <div className="space-y-1">
                        {item.children.map((child) => (
                          <Button
                            key={child.href}
                            variant={pathname === child.href ? 'default' : 'ghost'}
                            className={cn(
                              'w-full justify-start',
                              pathname === child.href && 'bg-primary text-primary-foreground'
                            )}
                            asChild
                          >
                            <Link href={child.href}>
                              <child.icon className="mr-2 h-4 w-4" />
                              {child.title}
                            </Link>
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    pathname === item.href && 'bg-primary text-primary-foreground'
                  )}
                  asChild
                >
                  <Link href={item.href!}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              )
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-muted-foreground">Администратор</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <Dice6 className="h-6 w-6 text-primary" />
                <span className="font-cinzel font-bold text-lg">NRI Admin</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-2">
                {sidebarItems.map((item) =>
                  item.children ? (
                     <Accordion key={item.title} type="single" collapsible defaultValue={isChildActive(item) ? item.title : undefined}>
                      <AccordionItem value={item.title} className="border-b-0">
                        <AccordionTrigger className="flex w-full items-center justify-between p-3 rounded-lg hover:no-underline hover:bg-muted">
                           <div className="flex items-center">
                              <item.icon className="mr-3 h-5 w-5" />
                              <div>
                                  <div className="font-medium text-left">{item.title}</div>
                                  <div className="text-xs text-muted-foreground text-left">{item.description}</div>
                              </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-6 pr-2 pt-2 space-y-2">
                          {item.children.map(child => (
                            <Link 
                                key={child.href} 
                                href={child.href}
                                className={cn(
                                    "flex items-center justify-between p-3 rounded-lg",
                                    pathname === child.href 
                                    ? "bg-primary text-primary-foreground" 
                                    : "hover:bg-muted"
                                )}
                            >
                                <div className="flex items-center">
                                    <child.icon className="mr-3 h-5 w-5" />
                                    <div>
                                        <div className="font-medium">{child.title}</div>
                                        <div className="text-xs text-muted-foreground">{child.description}</div>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href!}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg',
                        pathname === item.href ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-3 h-5 w-5" />
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  )
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{user?.username}</p>
                  <p className="text-xs text-muted-foreground">Администратор</p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Выйти
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-6 px-4 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
  
  function handleLogout() {
    logout();
  }
}
