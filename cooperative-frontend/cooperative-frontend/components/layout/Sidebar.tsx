'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES, ROLES } from '@/constants/app';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    roles: [ROLES.ADMINISTRATOR, ROLES.MANAGER, ROLES.LOAN_OFFICER, ROLES.MEMBER_OFFICER, ROLES.ACCOUNTANT, ROLES.TELLER, ROLES.AUDITOR, ROLES.MEMBER],
  },
  {
    label: 'Members',
    href: ROUTES.MEMBERS,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    roles: [ROLES.MANAGER, ROLES.MEMBER_OFFICER],
  },
  {
    label: 'Accounts',
    href: ROUTES.ACCOUNTS,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    roles: [ROLES.MANAGER, ROLES.MEMBER_OFFICER, ROLES.ACCOUNTANT],
  },
  {
    label: 'Transactions',
    href: ROUTES.TRANSACTIONS,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    roles: [ROLES.MANAGER, ROLES.ACCOUNTANT],
  },
  {
    label: 'Loans',
    href: ROUTES.LOANS,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    roles: [ROLES.MANAGER, ROLES.LOAN_OFFICER, ROLES.ACCOUNTANT],
  },
  {
    label: 'Share Capital',
    href: ROUTES.SHARE_CAPITAL,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    roles: [ROLES.MANAGER, ROLES.MEMBER_OFFICER, ROLES.ACCOUNTANT],
  },
  {
    label: 'Payroll',
    href: ROUTES.PAYROLL,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    roles: [ROLES.MANAGER, ROLES.ACCOUNTANT],
  },
  {
    label: 'Reports',
    href: ROUTES.REPORTS,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    roles: [ROLES.MANAGER, ROLES.ACCOUNTANT, ROLES.AUDITOR],
  },
  {
    label: 'Audit',
    href: ROUTES.AUDIT,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    roles: [ROLES.MANAGER, ROLES.AUDITOR],
  },
  {
    label: 'Configuration',
    href: ROUTES.CONFIGURATION,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    roles: [ROLES.ADMINISTRATOR],
  },
  {
    label: 'Users',
    href: ROUTES.USERS,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    roles: [ROLES.ADMINISTRATOR],
  },
  {
    label: 'Documents',
    href: ROUTES.DOCUMENTS,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    roles: [ROLES.MANAGER, ROLES.LOAN_OFFICER, ROLES.MEMBER_OFFICER, ROLES.ACCOUNTANT],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { hasAnyRole } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter nav items based on user roles - only after mount to avoid hydration mismatch
  const visibleNavItems = mounted ? navItems.filter((item) => hasAnyRole(item.roles)) : navItems;

  return (
    <aside className="w-52 relative flex flex-col h-full flex-shrink-0">
      {/* Background */}
      <div className="absolute inset-0 bg-white border-r border-gray-200"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Logo */}
        <div className="h-12 flex items-center px-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-sm font-bold text-gray-900">Coop System</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          <ul className="space-y-0.5">
            {visibleNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                      {item.icon}
                    </div>
                    <span className="font-medium truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Status */}
        <div className="px-3 py-2 border-t border-gray-200">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <p className="text-xs text-gray-400">Online</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
