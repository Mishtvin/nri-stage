'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Chrome, Mail, Lock, Dice6 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await authService.signInWithEmail(email, password);
      if (user) {
        if (!user.emailVerified) {
            toast.error('Email не подтвержден', { description: 'Пожалуйста, проверьте свою почту и перейдите по ссылке для верификации.' });
            await authService.signOut(); // Выход, чтобы заставить пользователя подтвердить
        } else {
            toast.success('Добро пожаловать!');
            router.push('/profile');
        }
      }
    } catch (error: any) {
      toast.error('Ошибка входа', { description: 'Неверный email или пароль.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
      await authService.signIn();
      // onAuthStateChange в AuthProvider обработает редирект
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dice-pattern">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/50 to-primary/5" />
      <Card className="w-full max-w-md relative z-10 bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 group justify-center mb-4">
             <Dice6 className="h-8 w-8 text-primary transition-transform group-hover:rotate-12" />
             <span className="font-cinzel font-bold text-2xl fantasy-text-gradient">Вход в NRI</span>
          </Link>
          <CardDescription>Введите свои данные для доступа в ваш мир.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10"/>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
               <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" />
               </div>
            </div>
            <Button type="submit" className="w-full fantasy-gradient" disabled={isLoading}>
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Или продолжить с</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            <Chrome className="mr-2 h-4 w-4" />
            Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <p className="text-muted-foreground">
            Нет аккаунта?&nbsp;
            <Link href="/register" className="text-primary hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
