'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dice6, Menu, X, Shield, Sword, ScrollText, Users, BookOpen, Skull, Crown, Map, User as UserIcon, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth-provider';

export function Navbar() {
  const { user, isLoading, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Campaigns', href: '/campaigns', icon: ScrollText },
    { name: 'Characters', href: '/characters', icon: Users },
    { name: 'Bestiary', href: '/bestiary', icon: Skull },
    { name: 'Items', href: '/items', icon: Package },
    { name: 'Reference', href: '/reference', icon: BookOpen },
    { name: 'Map', href: '/map', icon: Map },
  ];

  const masterItems = [
    { name: 'My Campaigns', href: '/master/campaigns', icon: Crown },
    { name: 'Characters Hub', href: '/master/characters', icon: Users },
    { name: 'Quests Hub', href: '/master/quests', icon: ScrollText },
  ];

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled 
        ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg' 
        : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Dice6 className="h-8 w-8 text-primary transition-transform group-hover:rotate-12" />
              <div className="absolute inset-0 bg-primary/20 rounded blur-md group-hover:bg-primary/30 transition-colors" />
            </div>
            <span className="font-cinzel font-bold text-xl fantasy-text-gradient">
              NRI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Auth Section */}
            {isLoading ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/50">
                      <AvatarImage src={user.avatar || ''} alt={user.name || ''} />
                      <AvatarFallback className="bg-primary/10">
                        <UserIcon className="h-5 w-5"/>
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <DropdownMenuItem key={item.name} asChild>
                            <Link href={item.href} className="flex items-center">
                                <Icon className="mr-2 h-4 w-4" />
                                <span>{item.name}</span>
                            </Link>
                        </DropdownMenuItem>
                    )
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                    Master Tools
                  </DropdownMenuLabel>
                  {masterItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link href={item.href} className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild className="fantasy-gradient hover:opacity-90 transition-opacity">
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-50"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/50">
                      <AvatarImage src={user.avatar || ''} alt={user.name || ''} />
                      <AvatarFallback className="bg-primary/10">
                        <UserIcon className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
                    </Button>
                     <div className="border-t border-border pt-4 mt-4 space-y-2">
                        {navItems.map((item) => {
                             const Icon = item.icon;
                             return (
                                 <Link key={item.name} href={item.href} className="flex items-center space-x-3 p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                                     <Icon className="h-5 w-5" />
                                     <span>{item.name}</span>
                                 </Link>
                             )
                         })}
                    </div>
                    <div className="border-t border-border pt-4 mt-4 space-y-2">
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Master Tools</div>
                        {masterItems.map((item) => {
                             const Icon = item.icon;
                             return (
                                 <Link key={item.name} href={item.href} className="flex items-center space-x-3 p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                                     <Icon className="h-5 w-5" />
                                     <span>{item.name}</span>
                                 </Link>
                             )
                         })}
                    </div>
                    <div className="border-t border-border pt-4 mt-4">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-500/10" 
                          onClick={() => signOut()}
                        >
                          Sign out
                        </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/login" onClick={() => setIsOpen(false)}>Log In</Link>
                  </Button>
                  <Button className="w-full fantasy-gradient hover:opacity-90 transition-opacity" asChild>
                    <Link href="/register" onClick={() => setIsOpen(false)}>Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
