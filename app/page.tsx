import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';

export default function HomePage() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
    </main>
  );
}