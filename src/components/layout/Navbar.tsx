'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Resources', href: '/dashboard' },
    { name: 'Practice', href: '/interview/setup' },
    { name: 'Community', href: '/' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-[#c3c6d7]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Side branding */}
        <div className="flex items-center gap-8">
          <Link href="/" className="font-outfit text-2xl font-bold text-[#004ac6] tracking-tight">
            InterviewAI
          </Link>
          <div className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={clsx(
                    'font-medium transition-colors duration-200 text-sm pb-1 border-b-2',
                    isActive
                      ? 'text-[#004ac6] border-[#004ac6] font-bold'
                      : 'text-[#434655] border-transparent hover:text-[#004ac6]'
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Side auth items */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[#111c2d] text-sm font-semibold">
                <div className="w-8 h-8 rounded-full bg-[#dbe1ff] text-[#004ac6] flex items-center justify-center font-bold text-sm">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline">{user?.name}</span>
              </div>
              <div className="h-4 w-px bg-[#c3c6d7]" />
              <button
                onClick={logout}
                className="flex items-center gap-1 text-[#434655] hover:text-rose-600 transition text-sm font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-[#004ac6] font-bold px-4 py-2 hover:bg-[#004ac6]/5 transition-all rounded-lg text-sm"
              >
                Log In
              </Link>
              <Link
                href="/auth/register"
                className="bg-[#004ac6] text-white px-6 py-2.5 rounded-full font-bold hover:shadow-lg active:scale-95 transition-all duration-150 text-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
