'use client';

import { CampaignsContainer } from '@/components/campaigns';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/components/auth-provider';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MasterCampaignsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <PageLayout showNavbar={true}>
      <CampaignsContainer />
    </PageLayout>
  );
}
