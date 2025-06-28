'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dice6, Lock, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminAuth } from '@/components/admin/AdminAuthProvider';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAdminAuth();
  const router = useRouter();

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/admin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        toast.success("Успешный вход", {
          description: "Добро пожаловать в панель администратора",
        });
        router.push('/admin');
      } else {
        toast.error("Ошибка входа", {
          description: "Неверное имя пользователя или пароль",
        });
      }
    } catch (error) {
      toast.error("Ошибка", {
        description: "Произошла ошибка при входе",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dice-pattern">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/50 to-primary/5" />
      
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 group">
            <div className="relative">
              <Dice6 className="h-12 w-12 text-primary transition-transform group-hover:rotate-12" />
              <div className="absolute inset-0 bg-primary/20 rounded blur-md group-hover:bg-primary/30 transition-colors" />
            </div>
            <span className="font-cinzel font-bold text-2xl fantasy-text-gradient">
              NRI
            </span>
          </div>
        </div>
        
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl font-cinzel text-center">Вход в админ-панель</CardTitle>
            <CardDescription className="text-center">
              Введите учетные данные администратора для доступа к панели управления
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Имя пользователя</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full fantasy-gradient hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Для демо-доступа используйте:</p>
          <p className="font-medium">Логин: admin / Пароль: admin</p>
        </div>
      </div>
    </div>
  );
}
