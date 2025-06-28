'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dice6, 
  Shield, 
  Sword, 
  Crown, 
  Users, 
  BookOpen, 
  Sparkles,
  ArrowRight,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';

export function HeroSection() {
  const { user } = useAuth();

  const features = [
    {
      icon: Crown,
      title: 'Campaign Management',
      description: 'Organize epic adventures with powerful tools for world-building and story tracking.'
    },
    {
      icon: Users,
      title: 'Player Management',
      description: 'Manage character sheets, track progression, and coordinate your party seamlessly.'
    },
    {
      icon: BookOpen,
      title: 'Rich Content Library',
      description: 'Access comprehensive rules, monsters, spells, and items at your fingertips.'
    },
    {
      icon: Dice6,
      title: 'Digital Dice & Tools',
      description: 'Built-in dice roller, initiative tracker, and combat management tools.'
    }
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 dice-pattern opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/50 to-primary/5" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-pulse">
        <Dice6 className="h-8 w-8 text-primary/30 rotate-12" />
      </div>
      <div className="absolute top-40 right-20 animate-pulse delay-1000">
        <Shield className="h-6 w-6 text-accent/40 -rotate-12" />
      </div>
      <div className="absolute bottom-40 left-20 animate-pulse delay-2000">
        <Sword className="h-7 w-7 text-primary/25 rotate-45" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-12">
          {/* Main Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-cinzel font-bold leading-tight">
                <span className="fantasy-text-gradient">Epic Adventures</span>
                <br />
                <span className="text-foreground">Await</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Transform your D&D campaigns with NRI's comprehensive suite of tools. 
                Create unforgettable stories, manage complex campaigns, and bring your fantasy worlds to life.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Button asChild size="lg" className="fantasy-gradient hover:opacity-90 transition-all duration-300 glow-effect text-lg px-8 py-6">
                  <Link href="/profile" className="flex items-center space-x-2">
                    <Crown className="h-5 w-5" />
                    <span>Enter Your Realm</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="fantasy-gradient hover:opacity-90 transition-all duration-300 glow-effect text-lg px-8 py-6">
                    <Link href="/register" className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5" />
                      <span>Sign Up</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-primary/50 hover:bg-primary/10">
                    <Link href="/login" className="flex items-center space-x-2">
                      <UserIcon className="h-5 w-5" />
                      <span>Log In</span>
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.title}
                  className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
                  style={{
                    animationDelay: `${index * 150}ms`
                  }}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <h3 className="font-cinzel font-semibold text-lg">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="mt-20 pt-12 border-t border-border/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Active Campaigns', value: '10K+' },
                { label: 'Registered Players', value: '50K+' },
                { label: 'Adventures Created', value: '25K+' },
                { label: 'Hours Played', value: '500K+' }
              ].map((stat, index) => (
                <div key={stat.label} className="text-center space-y-2">
                  <div className="text-3xl font-bold fantasy-text-gradient font-cinzel">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
