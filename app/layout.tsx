import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/components/auth-provider';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'NRI - Epic D&D Campaign Management',
  description: 'Create, manage, and experience unforgettable D&D campaigns with NRI. The ultimate platform for Dungeon Masters and players.',
  keywords: 'D&D, Dungeons and Dragons, Campaign Management, RPG, Tabletop Gaming',
  authors: [{ name: 'NRI Team' }],
  openGraph: {
    title: 'NRI - Epic D&D Campaign Management',
    description: 'Create, manage, and experience unforgettable D&D campaigns with NRI.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NRI - Epic D&D Campaign Management',
    description: 'Create, manage, and experience unforgettable D&D campaigns with NRI.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <AuthProvider>
            <div 
              className="min-h-screen bg-background text-foreground"
              style={{
                background: 'linear-gradient(135deg, hsl(222.2 84% 4.9%) 0%, hsl(217.2 32.6% 17.5%) 100%)'
              }}
            >
              {children}
              <Toaster />
            </div>
        </AuthProvider>
      </body>
    </html>
  );
}
