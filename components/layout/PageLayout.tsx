'use client';

import { ReactNode } from 'react';
import { Navbar } from '@/components/navbar';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  showNavbar?: boolean;
}

/**
 * Универсальный layout для страниц
 */
export const PageLayout = ({ 
  children, 
  title, 
  description, 
  className,
  showNavbar = true 
}: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background dice-pattern">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/50 to-primary/5" />
      
      {showNavbar && <Navbar />}
      
      <div className={cn(
        "relative z-10",
        showNavbar ? "pt-24 pb-12" : "py-12",
        className
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(title || description) && (
            <div className="space-y-4 mb-8">
              {title && (
                <h1 className="text-4xl md:text-5xl font-cinzel font-bold">
                  <span className="fantasy-text-gradient">{title}</span>
                </h1>
              )}
              {description && (
                <p className="text-xl text-muted-foreground">{description}</p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};
