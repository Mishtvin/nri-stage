import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck, Dice6 } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background dice-pattern">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/50 to-primary/5" />
      <Card className="w-full max-w-md relative z-10 bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="text-center">
           <Link href="/" className="inline-flex items-center space-x-2 group justify-center mb-4">
             <Dice6 className="h-8 w-8 text-primary transition-transform group-hover:rotate-12" />
             <span className="font-cinzel font-bold text-2xl fantasy-text-gradient">Подтвердите ваш Email</span>
          </Link>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex justify-center">
            <MailCheck className="h-16 w-16 text-primary" />
          </div>
          <CardTitle>Проверьте ваш почтовый ящик</CardTitle>
          <CardDescription>
            Мы отправили ссылку для верификации на ваш email. Пожалуйста, перейдите по ней, чтобы активировать аккаунт.
          </CardDescription>
          <Button asChild className="w-full fantasy-gradient">
            <Link href="/login">Вернуться на страницу входа</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
