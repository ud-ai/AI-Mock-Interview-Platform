'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push(`/auth/login?redirect=${pathname}`);
    }
  }, [isInitialized, isAuthenticated, router, pathname]);

  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070A13] flex flex-col items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-violet-500/20 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
        <p className="mt-4 text-slate-400 font-medium text-sm animate-pulse">Initializing Session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
