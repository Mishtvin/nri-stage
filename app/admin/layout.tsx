'use client';

import { AdminAuthProvider } from '@/components/admin/AdminAuthProvider';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Toaster } from '@/components/ui/sonner';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminLayout>
        {children}
        <Toaster />
      </AdminLayout>
    </AdminAuthProvider>
  );
}
