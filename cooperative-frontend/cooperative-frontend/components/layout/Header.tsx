'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="relative h-12 flex items-center justify-between px-4 flex-shrink-0">
      {/* Background */}
      <div className="absolute inset-0 bg-white border-b border-gray-200"></div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-between w-full">
        {/* Left: empty or breadcrumb placeholder */}
        <div />

        {/* Right: User + Logout */}
        <div className="flex items-center gap-2">
          {/* User Info */}
          <div
            onClick={() => router.push('/dashboard/profile')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-gray-900 leading-tight">
                {mounted ? (user?.fullName || user?.username) : ''}
              </p>
              <p className="text-xs text-gray-500 leading-tight">
                {mounted ? (user?.roles?.[0] || 'User') : ''}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
