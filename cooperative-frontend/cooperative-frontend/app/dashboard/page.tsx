'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  useGetFinancialReportQuery,
  useGetLoanPortfolioReportQuery,
  useGetMembershipReportQuery,
} from '@/features/reports/reportsApi';
import {
  useGetPendingApplicationsQuery,
  useGetPendingAppealsQuery,
  useGetPendingRestructuringsQuery,
} from '@/features/loans/loansApi';

const f = (n?: number | null) => {
  if (n == null || isNaN(n)) return '—';
  if (Math.abs(n) >= 1_000_000) return `ETB ${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `ETB ${(n / 1_000).toFixed(1)}K`;
  return `ETB ${n.toLocaleString()}`;
};
const p = (n?: number | null) => (n == null ? '—' : `${(n * 100).toFixed(1)}%`);
const hi = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

function KPICard({ title, value, subtitle, trend, icon, color = 'blue' }: {
  title: string;
  value: string;
  subtitle?: string;
  trend?: { value: number; isPositive: boolean };
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'orange';
}) {
  const colorGradients = {
    blue: 'from-[#0A2E5C] to-[#1A4A8A]',
    green: 'from-[#00C853] to-[#009624]',
    red: 'from-[#DC2626] to-[#991B1B]',
    purple: 'from-[#7C3AED] to-[#5B21B6]',
    orange: 'from-[#EA580C] to-[#C2410C]',
  };

  return (
    <div className="group relative p-6 rounded-2xl bg-white border border-gray-100/60 hover:border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorGradients[color]} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
            trend.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={trend.isPositive ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
            </svg>
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Poppins' }}>{value}</h3>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
  );
}

function StatCard({ label, value, accent, warn, bold }: {
  label: string; value: string; accent?: boolean; warn?: boolean; bold?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100/60 last:border-0">
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <span className={`text-xs font-semibold ${warn ? 'text-red-500' : accent ? 'text-emerald-600' : bold ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
        {value}
      </span>
    </div>
  );
}

function QuickAction({ count, label, href, icon, color = 'blue' }: { 
  count: number; label: string; href: string; icon: React.ReactNode; color?: 'blue' | 'red' | 'green' | 'orange' 
}) {
  if (!count) return null;
  
  const bgColors = {
    blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300',
    red: 'bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-300',
    green: 'bg-green-50 hover:bg-green-100 border-green-200 hover:border-green-300',
    orange: 'bg-orange-50 hover:bg-orange-100 border-orange-200 hover:border-orange-300',
  };

  const textColors = {
    blue: 'text-blue-700 group-hover:text-blue-800',
    red: 'text-red-700 group-hover:text-red-800',
    green: 'text-green-700 group-hover:text-green-800',
    orange: 'text-orange-700 group-hover:text-orange-800',
  };

  return (
    <Link href={href} className={`group flex items-center gap-3 py-3 px-4 rounded-xl border ${bgColors[color]} transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${textColors[color]}`}>
        {icon}
      </div>
      <span className={`text-sm font-medium flex-1 ${textColors[color]}`}>{label}</span>
      <span className="text-sm font-bold text-gray-800 bg-white px-2 py-1 rounded-full border border-gray-200">
        {count}
      </span>
      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

function NavTile({ label, href, icon, sub }: { label: string; href: string; icon: React.ReactNode; sub: string }) {
  return (
    <Link href={href} className="group flex flex-col gap-3 p-5 rounded-2xl border border-gray-200/60 bg-white hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-blue-100 group-hover:border-blue-200 group-hover:text-blue-600 transition-all flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors leading-tight" style={{ fontFamily: 'Poppins' }}>{label}</p>
        <p className="text-xs text-gray-400 mt-1 leading-tight">{sub}</p>
      </div>
    </Link>
  );
}

const Icons = {
  Members: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  NewMember: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>,
  Accounts: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  Transactions: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  Loans: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Shares: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Payroll: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Reports: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Documents: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Audit: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Config: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
};

const NAV_ITEMS = [
  { label: 'Members', href: '/dashboard/members', icon: Icons.Members, sub: 'Member directory', roles: ['MANAGER', 'MEMBER_OFFICER'] },
  { label: 'New Member', href: '/dashboard/members/new', icon: Icons.NewMember, sub: 'Add member', roles: ['MANAGER', 'MEMBER_OFFICER'] },
  { label: 'Accounts', href: '/dashboard/accounts', icon: Icons.Accounts, sub: 'Savings accounts', roles: ['MANAGER', 'MEMBER_OFFICER', 'ACCOUNTANT'] },
  { label: 'Transactions', href: '/dashboard/transactions', icon: Icons.Transactions, sub: 'Deposit & withdraw', roles: ['MANAGER', 'ACCOUNTANT'] },
  { label: 'Loans', href: '/dashboard/loans', icon: Icons.Loans, sub: 'Applications & loans', roles: ['MANAGER', 'LOAN_OFFICER', 'ACCOUNTANT'] },
  { label: 'Share Capital', href: '/dashboard/share-capital', icon: Icons.Shares, sub: 'Shares & transfers', roles: ['MANAGER', 'MEMBER_OFFICER', 'ACCOUNTANT'] },
  { label: 'Payroll', href: '/dashboard/payroll', icon: Icons.Payroll, sub: 'Monthly deductions', roles: ['MANAGER', 'ACCOUNTANT'] },
  { label: 'Reports', href: '/dashboard/reports/financial', icon: Icons.Reports, sub: 'Analytics', roles: ['MANAGER', 'ACCOUNTANT', 'AUDITOR'] },
  { label: 'Documents', href: '/dashboard/documents', icon: Icons.Documents, sub: 'File management', roles: ['MANAGER', 'LOAN_OFFICER', 'MEMBER_OFFICER', 'ACCOUNTANT'] },
  { label: 'Audit', href: '/dashboard/audit', icon: Icons.Audit, sub: 'Activity trail', roles: ['MANAGER', 'AUDITOR'] },
  { label: 'Configuration', href: '/dashboard/config', icon: Icons.Config, sub: 'System settings', roles: ['ADMINISTRATOR'] },
  { label: 'Users', href: '/dashboard/users', icon: Icons.Users, sub: 'Access control', roles: ['ADMINISTRATOR'] },
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const { user } = useAuth();
  const roles = mounted ? (user?.roles ?? []) : [];
  const canFin = roles.some(r => ['MANAGER', 'ACCOUNTANT', 'AUDITOR'].includes(r));
  const canLoans = roles.some(r => ['MANAGER', 'LOAN_OFFICER', 'ACCOUNTANT', 'AUDITOR'].includes(r));
  const canMembers = roles.some(r => ['MANAGER', 'MEMBER_OFFICER', 'AUDITOR'].includes(r));

  const { data: fin } = useGetFinancialReportQuery(undefined, { skip: !mounted || !canFin });
  const { data: loans } = useGetLoanPortfolioReportQuery(undefined, { skip: !mounted || !canLoans });
  const { data: members } = useGetMembershipReportQuery(undefined, { skip: !mounted || !canMembers });
  const { data: pendingApps } = useGetPendingApplicationsQuery(undefined, { skip: !mounted || !canLoans });
  const { data: pendingAppeals } = useGetPendingAppealsQuery(undefined, { skip: !mounted || !canLoans });
  const { data: pendingRestructurings } = useGetPendingRestructuringsQuery(undefined, { skip: !mounted || !canLoans });

  const pendingCount = pendingApps?.length ?? 0;
  const appealCount = pendingAppeals?.length ?? 0;
  const restructCount = pendingRestructurings?.length ?? 0;

  const visibleNav = NAV_ITEMS.filter(n => n.roles.some(r => roles.includes(r)));

  return (
    <div className="space-y-8 animate-fade-in-up">

      {/* Header Section */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-200">
              Operations Dashboard
            </span>
            {fin && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                fin.withinLendingLimit
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${fin.withinLendingLimit ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                {fin.withinLendingLimit ? 'Compliant' : 'Limit Exceeded'}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>
            {hi()}, {mounted && user?.fullName ? user.fullName.split(' ')[0] : 'User'}!
          </h1>
          <p className="text-gray-500">
            Welcome to your Ma'ed Cooperative dashboard
          </p>
        </div>
        <Link 
          href="/dashboard/reports/financial" 
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0A2E5C] to-[#1A4A8A] text-white font-semibold hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Full Report
        </Link>
      </div>

      {/* KPI Cards */}
      {canFin && fin && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Savings"
            value={f(fin.totalSavings)}
            subtitle={`Regular: ${f(fin.totalRegularSavings)}`}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
            color="blue"
            trend={{ value: 12.5, isPositive: true }}
          />
          <KPICard
            title="Share Capital"
            value={f(fin.totalShareCapital)}
            subtitle={`${fin.totalShares.toLocaleString()} shares`}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
            color="green"
            trend={{ value: 8.2, isPositive: true }}
          />
          <KPICard
            title="Loan Portfolio"
            value={f(fin.totalOutstandingLoans)}
            subtitle={`${fin.activeLoanCount} active loans`}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
            color="purple"
            trend={{ value: 3.1, isPositive: false }}
          />
          <KPICard
            title="Lending Capacity"
            value={f(fin.remainingLendingCapacity)}
            subtitle={`${p(fin.lendingLimitPercentage)} of limit`}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 13.5h16.5M12 3.75v16.5" /></svg>}
            color="orange"
          />
        </div>
      )}

      {/* Quick Actions & Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>Quick Actions</h2>
            <span className="text-xs text-gray-400">Priority tasks</span>
          </div>
          
          <div className="space-y-3">
            <QuickAction 
              count={pendingCount} 
              label="Pending Loan Applications" 
              href="/dashboard/loans?status=PENDING"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
              color="orange"
            />
            <QuickAction 
              count={appealCount} 
              label="Loan Appeals" 
              href="/dashboard/loans?status=APPEALED"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" /></svg>}
              color="red"
            />
            <QuickAction 
              count={restructCount} 
              label="Loan Restructuring" 
              href="/dashboard/loans?status=RESTRUCTURING"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
              color="blue"
            />
          </div>
        </div>

        {/* Navigation Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>Navigation</h2>
            <span className="text-xs text-gray-400">Quick access</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {visibleNav.slice(0, 6).map((item) => (
              <NavTile key={item.href} label={item.label} href={item.href} icon={item.icon} sub={item.sub} />
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      {canLoans && loans && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-gray-100/60">
            <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>Loan Portfolio</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide mb-1">Repayment Rate</p>
                <p className="text-2xl font-bold text-emerald-700">{p(loans.repaymentRate)}</p>
              </div>
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <p className="text-xs text-red-600 font-semibold uppercase tracking-wide mb-1">Default Rate</p>
                <p className={`text-2xl font-bold ${loans.defaultRate > 0.05 ? 'text-red-700' : 'text-gray-700'}`}>{p(loans.defaultRate)}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">By Status</p>
              {Object.entries(loans.loansByStatus || {}).sort((a, b) => b[1] - a[1]).map(([status, count]) => (
                <StatCard key={status} label={status.replace('_', ' ')} value={count.toString()} />
              ))}
            </div>
          </div>

          {canMembers && members && (
            <div className="p-6 rounded-2xl bg-white border border-gray-100/60">
              <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>Membership Overview</h3>
              <div className="space-y-1">
                <StatCard label="Total Members" value={members.totalMembers.toString()} bold />
                <StatCard label="Active Members" value={members.activeMembers.toString()} accent />
                <StatCard label="New This Month" value={members.newMembersThisMonth.toString()} accent />
                <StatCard label="Suspended" value={members.suspendedMembers.toString()} warn />
              </div>
              
              {members.suspensionsByReason && Object.keys(members.suspensionsByReason).length > 0 && (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Suspension Reasons</p>
                  <div className="space-y-1">
                    {Object.entries(members.suspensionsByReason)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3)
                      .map(([reason, count]) => (
                        <StatCard key={reason} label={reason.replace('_', ' ')} value={count.toString()} />
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

