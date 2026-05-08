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
  useGetAllLoansQuery,
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

function Bar({ v, max, color }: { v: number; max: number; color: string }) {
  const w = max > 0 ? Math.min(100, (v / max) * 100) : 0;
  return (
    <div className="h-1 w-full rounded-full bg-gray-100">
      <div className="h-1 rounded-full transition-all" style={{ width: `${w}%`, background: color }} />
    </div>
  );
}

function SH({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">{title}</p>
      {href && <Link href={href} className="text-xs text-blue-600 hover:text-blue-800 font-medium">View →</Link>}
    </div>
  );
}

function SR({ label, value, accent, warn, bold }: {
  label: string; value: string; accent?: boolean; warn?: boolean; bold?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`text-xs font-semibold ${warn ? 'text-red-500' : accent ? 'text-emerald-600' : bold ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
        {value}
      </span>
    </div>
  );
}

function PA({ count, label, href, dot }: { count: number; label: string; href: string; dot: string }) {
  if (!count) return null;
  return (
    <Link href={href} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-4 px-4 transition-colors group">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
      <span className="text-xs text-gray-700 flex-1 group-hover:text-blue-600 transition-colors">{label}</span>
      <span className="text-xs font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-full">{count}</span>
      <svg className="w-3 h-3 text-gray-300 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

function NavTile({ label, href, icon, sub }: { label: string; href: string; icon: React.ReactNode; sub: string }) {
  return (
    <Link href={href} className="group flex flex-col gap-2 p-3.5 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all">
      <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600 transition-all flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-700 transition-colors leading-tight">{label}</p>
        <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{sub}</p>
      </div>
    </Link>
  );
}

const I = {
  Members: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  NewMember: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>,
  Accounts: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  Transactions: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  Loans: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Shares: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Payroll: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Reports: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Documents: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Audit: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Config: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Users: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
};

const NAV = [
  { label: 'Members', href: '/dashboard/members', icon: I.Members, sub: 'Directory', roles: ['MANAGER', 'MEMBER_OFFICER'] },
  { label: 'New Member', href: '/dashboard/members/new', icon: I.NewMember, sub: 'Register', roles: ['MANAGER', 'MEMBER_OFFICER'] },
  { label: 'Accounts', href: '/dashboard/accounts', icon: I.Accounts, sub: 'Savings accounts', roles: ['MANAGER', 'MEMBER_OFFICER', 'ACCOUNTANT'] },
  { label: 'Transactions', href: '/dashboard/transactions', icon: I.Transactions, sub: 'Deposit & withdraw', roles: ['MANAGER', 'ACCOUNTANT'] },
  { label: 'Loans', href: '/dashboard/loans', icon: I.Loans, sub: 'Applications & loans', roles: ['MANAGER', 'LOAN_OFFICER', 'ACCOUNTANT'] },
  { label: 'Share Capital', href: '/dashboard/share-capital', icon: I.Shares, sub: 'Shares & transfers', roles: ['MANAGER', 'MEMBER_OFFICER', 'ACCOUNTANT'] },
  { label: 'Payroll', href: '/dashboard/payroll', icon: I.Payroll, sub: 'Monthly deductions', roles: ['MANAGER', 'ACCOUNTANT'] },
  { label: 'Reports', href: '/dashboard/reports/financial', icon: I.Reports, sub: 'Analytics', roles: ['MANAGER', 'ACCOUNTANT', 'AUDITOR'] },
  { label: 'Documents', href: '/dashboard/documents', icon: I.Documents, sub: 'Files', roles: ['MANAGER', 'LOAN_OFFICER', 'MEMBER_OFFICER', 'ACCOUNTANT'] },
  { label: 'Audit', href: '/dashboard/audit', icon: I.Audit, sub: 'Activity trail', roles: ['MANAGER', 'AUDITOR'] },
  { label: 'Configuration', href: '/dashboard/config', icon: I.Config, sub: 'Settings', roles: ['ADMINISTRATOR'] },
  { label: 'Users', href: '/dashboard/users', icon: I.Users, sub: 'Access control', roles: ['ADMINISTRATOR'] },
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
  const { data: approvedLoans } = useGetAllLoansQuery({ page: 0, size: 100, status: 'APPROVED' }, { skip: !mounted || !canLoans });
  const { data: pendingAppeals } = useGetPendingAppealsQuery(undefined, { skip: !mounted || !canLoans });
  const { data: pendingRestructurings } = useGetPendingRestructuringsQuery(undefined, { skip: !mounted || !canLoans });

  const pendingCount = pendingApps?.length ?? 0;
  const disbCount = approvedLoans?.content?.length ?? 0;
  const appealCount = pendingAppeals?.length ?? 0;
  const restructCount = pendingRestructurings?.length ?? 0;

  const growthEntries = members?.memberGrowthByMonth
    ? Object.entries(members.memberGrowthByMonth).sort((a, b) => a[0].localeCompare(b[0])).slice(-6)
    : [];
  const maxGrowth = growthEntries.length > 0 ? Math.max(...growthEntries.map(([, v]) => v), 1) : 1;

  const loanStatusEntries = loans?.loansByStatus
    ? Object.entries(loans.loansByStatus).sort((a, b) => b[1] - a[1])
    : [];

  const suspensionReasons = members?.suspensionsByReason
    ? Object.entries(members.suspensionsByReason).sort((a, b) => b[1] - a[1]).slice(0, 4)
    : [];

  const visibleNav = NAV.filter(n => n.roles.some(r => roles.includes(r)));

  return (
    <div className="space-y-6 pb-8">

      {/* Header */}
      <div className="flex items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-0.5">
            Ma'ed Cooperative · Operations
          </p>
          <h1 className="text-lg font-bold text-gray-900">
            {hi()}{mounted && user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            {mounted && user?.roles?.[0] && (
              <span className="ml-2 bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-semibold">
                {user.roles[0].replace(/_/g, ' ')}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {fin && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
              fin.withinLendingLimit
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${fin.withinLendingLimit ? 'bg-emerald-500' : 'bg-red-500'}`} />
              {fin.withinLendingLimit ? 'Compliant' : 'Limit Exceeded'}
            </span>
          )}
          <Link href="/dashboard/reports/financial" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            Full report →
          </Link>
        </div>
      </div>

      {/* Financial KPIs */}
      {canFin && fin && (
        <div>
          <SH title="Financial Overview" />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 pb-4 border-b border-gray-100">
            {[
              { label: 'Total Savings', value: f(fin.totalSavings), sub: `Reg ${f(fin.totalRegularSavings)}` },
              { label: 'Share Capital', value: f(fin.totalShareCapital), sub: `${fin.totalShares.toLocaleString()} shares` },
              { label: 'Loan Book', value: f(fin.totalOutstandingLoans), sub: `${fin.activeLoanCount} active` },
              { label: 'Total Disbursed', value: f(fin.totalLoansDisbursed), sub: `Repaid ${f(fin.totalLoanRepayments)}` },
              { label: 'Interest Earned', value: f(fin.totalInterestEarned), sub: `Paid out ${f(fin.totalInterestPaid)}` },
              { label: 'Lending Capacity', value: f(fin.remainingLendingCapacity), sub: `Limit ${p(fin.lendingLimitPercentage)}` },
            ].map(({ label, value, sub }) => (
              <div key={label}>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">{label}</p>
                <p className="text-sm font-bold text-gray-900 leading-tight">{value}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>Lending utilisation</span>
              <span>{p(fin.liquidityRatio)} of {p(fin.lendingLimitPercentage)} · {f(fin.availableLiquidity)} available</span>
            </div>
            <Bar v={fin.liquidityRatio * 100} max={fin.lendingLimitPercentage * 100}
              color={fin.withinLendingLimit ? '#10b981' : '#ef4444'} />
          </div>
        </div>
      )}

      {/* Main 3-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Loan Portfolio */}
        {canLoans && loans && (
          <div>
            <SH title="Loan Portfolio" href="/dashboard/loans" />
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Repayment Rate</p>
                <p className="text-base font-bold text-emerald-600">{p(loans.repaymentRate)}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Default Rate</p>
                <p className={`text-base font-bold ${loans.defaultRate > 0.05 ? 'text-red-500' : 'text-gray-700'}`}>{p(loans.defaultRate)}</p>
              </div>
            </div>

            {loanStatusEntries.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-2">By Status</p>
                <div className="space-y-2">
                  {loanStatusEntries.map(([status, count]) => (
                    <div key={status}>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-gray-500">{status.replace(/_/g, ' ')}</span>
                        <span className="font-semibold text-gray-700">{count}</span>
                      </div>
                      <Bar v={count} max={loans.totalLoans} color={
                        status === 'ACTIVE' || status === 'DISBURSED' ? '#3b82f6' :
                        status === 'PAID_OFF' || status === 'COMPLETED' ? '#10b981' :
                        status === 'DEFAULTED' ? '#ef4444' :
                        status === 'RESTRUCTURED' ? '#8b5cf6' : '#94a3b8'
                      } />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-0">
              <SR label="Total Loans" value={loans.totalLoans.toLocaleString()} />
              <SR label="Outstanding" value={f(loans.totalOutstanding)} bold />
              <SR label="Total Repaid" value={f(loans.totalRepaid)} accent />
              <SR label="Avg Loan Size" value={f(loans.averageLoanAmount)} />
              <SR label="Avg Interest Rate" value={p(loans.averageInterestRate)} />
              {loans.delinquentLoans > 0 && (
                <SR label="Delinquent" value={`${loans.delinquentLoans} · ${f(loans.delinquentAmount)}`} warn />
              )}
            </div>

            {loans.loansByDuration && Object.keys(loans.loansByDuration).length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-2">By Duration</p>
                <div className="space-y-1.5">
                  {Object.entries(loans.loansByDuration).sort((a, b) => b[1] - a[1]).map(([dur, cnt]) => (
                    <div key={dur} className="flex justify-between text-[10px]">
                      <span className="text-gray-500">{dur}</span>
                      <span className="font-semibold text-gray-700">{cnt} loans</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Membership */}
        {canMembers && members && (
          <div>
            <SH title="Membership" href="/dashboard/members" />
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Active</p>
                <p className="text-base font-bold text-blue-600">{members.activeMembers.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">of {members.totalMembers} total</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">New This Month</p>
                <p className="text-base font-bold text-emerald-600">+{members.newMembersThisMonth}</p>
                <p className="text-[10px] text-gray-400">+{members.newMembersThisYear} this year</p>
              </div>
            </div>

            {growthEntries.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-2">Growth (last 6 months)</p>
                <div className="flex items-end gap-1 h-12">
                  {growthEntries.map(([month, count]) => (
                    <div key={month} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-sm bg-blue-400 transition-all"
                        style={{ height: `${Math.max(4, (count / maxGrowth) * 40)}px` }}
                        title={`${month}: ${count}`}
                      />
                      <span className="text-[8px] text-gray-400">{month.slice(5)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-0">
              <SR label="Regular Members" value={members.regularMembers.toLocaleString()} />
              <SR label="External Cooperative" value={members.externalCooperativeMembers.toLocaleString()} />
              <SR label="Suspended" value={members.suspendedMembers.toLocaleString()} warn={members.suspendedMembers > 0} />
              <SR label="Withdrawn" value={members.withdrawnMembers.toLocaleString()} />
              <SR label="Voluntary Withdrawals" value={members.voluntaryWithdrawals.toLocaleString()} />
            </div>

            {suspensionReasons.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-2">Suspension Reasons</p>
                <div className="space-y-1.5">
                  {suspensionReasons.map(([reason, count]) => (
                    <div key={reason} className="flex justify-between text-[10px]">
                      <span className="text-gray-500 truncate max-w-[160px]">{reason}</span>
                      <span className="font-semibold text-gray-700">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
                  )}

        {/* Col 3: Pending Actions + Compliance */}
        <div className="space-y-6">

          {/* Pending Actions */}
          {canLoans && (
            <div>
              <SH title="Requires Action" href="/dashboard/loans" />
              {(pendingCount + disbCount + appealCount + restructCount) === 0 ? (
                <p className="text-xs text-gray-400 py-2">No pending actions.</p>
              ) : (
                <div>
                  <PA count={pendingCount} label="Loan applications pending approval" href="/dashboard/loans" dot="bg-amber-500" />
                  <PA count={disbCount} label="Approved loans awaiting disbursement" href="/dashboard/loans" dot="bg-blue-500" />
                  <PA count={appealCount} label="Loan appeals pending decision" href="/dashboard/loans" dot="bg-purple-500" />
                  <PA count={restructCount} label="Restructuring requests pending" href="/dashboard/loans" dot="bg-orange-500" />
                </div>
              )}
            </div>
          )}

          {/* Compliance */}
          {canFin && fin && (
            <div>
              <SH title="Compliance" href="/dashboard/reports/financial" />
              <div className="space-y-0">
                <SR label="Lending Limit" value={p(fin.lendingLimitPercentage)} />
                <SR label="Current Utilisation" value={p(fin.liquidityRatio)} accent={fin.withinLendingLimit} warn={!fin.withinLendingLimit} />
                <SR label="Remaining Capacity" value={f(fin.remainingLendingCapacity)} bold />
                <SR label="Available Liquidity" value={f(fin.availableLiquidity)} />
                <SR label="Status" value={fin.complianceStatus ?? (fin.withinLendingLimit ? 'Compliant' : 'Exceeded')} accent={fin.withinLendingLimit} warn={!fin.withinLendingLimit} />
              </div>
            </div>
          )}

          {/* Membership terminations breakdown */}
          {canMembers && members && (
            <div>
              <SH title="Member Exits" />
              <div className="space-y-0">
                <SR label="Voluntary Withdrawals" value={members.voluntaryWithdrawals.toLocaleString()} />
                <SR label="Involuntary Terminations" value={members.involuntaryTerminations.toLocaleString()} warn={members.involuntaryTerminations > 0} />
                <SR label="Death Exits" value={members.deathExits.toLocaleString()} />
                <SR label="Total Suspensions (all time)" value={members.totalSuspensions.toLocaleString()} />
                <SR label="Active Suspensions" value={members.activeSuspensions.toLocaleString()} warn={members.activeSuspensions > 0} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation grid */}
      {visibleNav.length > 0 && (
        <div className="border-t border-gray-100 pt-5">
          <SH title="Modules" />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {visibleNav.map(n => (
              <NavTile key={n.label} label={n.label} href={n.href} icon={n.icon} sub={n.sub} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

