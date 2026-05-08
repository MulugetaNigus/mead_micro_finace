'use client';

import React, { useState, useMemo } from 'react';
import { CircularProgress } from '@mui/material';
import { useGetAllLoansQuery, useDisburseLoanMutation } from '../loansApi';
import { toastSuccess, toastError } from '@/components/common/Toast';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Pagination } from '@/components/common/Pagination';
import { LoanStatus, Loan } from '@/types';

type SortField = 'principalAmount' | 'interestRate' | 'durationMonths';

export function LoanDisbursementPanel() {
  const { data, isLoading } = useGetAllLoansQuery({ page: 0, size: 200, status: LoanStatus.APPROVED });
  const [disburse, { isLoading: disbursing }] = useDisburseLoanMutation();
  const [target, setTarget] = useState<Loan | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [sortField, setSortField] = useState<SortField>('principalAmount');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const pageSize = 5;

  const allLoans = data?.content ?? [];

  const sorted = useMemo(() => {
    return [...allLoans].sort((a, b) => {
      const av = Number((a as any)[sortField] ?? 0);
      const bv = Number((b as any)[sortField] ?? 0);
      return sortDir === 'asc' ? av - bv : bv - av;
    });
  }, [allLoans, sortField, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (field: SortField) => {
    if (field === sortField) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
    setPage(0);
  };

  const sortIcon = (field: SortField) => {
    if (field !== sortField) return <span className="ml-0.5 text-gray-300 text-xs">↕</span>;
    return <span className="ml-0.5 text-blue-500 text-xs">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  const handleDisburse = async () => {
    if (!target) return;
    try {
      await disburse(target.id).unwrap();
      toastSuccess('Loan disbursed successfully');
      setTarget(null);
      setExpandedId(null);
    } catch (e: any) {
      toastError(e?.data?.message ?? 'Failed to disburse loan');
      setTarget(null);
    }
  };

  const principal = (loan: Loan) => typeof loan.principalAmount === 'object'
    ? (loan.principalAmount as any).amount
    : loan.principalAmount;

  const outstanding = (loan: Loan) => typeof loan.outstandingPrincipal === 'object'
    ? (loan.outstandingPrincipal as any).amount
    : loan.outstandingPrincipal;

  if (isLoading) return <div className="flex justify-center py-8"><CircularProgress size={24} /></div>;

  if (allLoans.length === 0) {
    return <div className="text-center py-8 text-gray-400 text-sm">No approved loans awaiting disbursement</div>;
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Loan ID</th>
              <th
                className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 cursor-pointer select-none hover:text-gray-700"
                onClick={() => handleSort('principalAmount')}
              >
                Principal {sortIcon('principalAmount')}
              </th>
              <th
                className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 cursor-pointer select-none hover:text-gray-700"
                onClick={() => handleSort('interestRate')}
              >
                Rate {sortIcon('interestRate')}
              </th>
              <th
                className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 cursor-pointer select-none hover:text-gray-700"
                onClick={() => handleSort('durationMonths')}
              >
                Duration {sortIcon('durationMonths')}
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paged.map((loan: Loan) => (
              <React.Fragment key={loan.id}>
                <tr
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setExpandedId(expandedId === loan.id ? null : loan.id)}
                >
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-400">{loan.id.slice(0, 8)}…</td>
                  <td className="px-4 py-2.5 font-semibold text-gray-800">ETB {Number(principal(loan)).toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-gray-600">{(Number(loan.interestRate) * 100).toFixed(1)}%</td>
                  <td className="px-4 py-2.5 text-gray-600">{loan.durationMonths}mo</td>
                  <td className="px-4 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => { setTarget(loan); setExpandedId(loan.id); }}
                      disabled={disbursing}
                      className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      Disburse
                    </button>
                  </td>
                </tr>

                {expandedId === loan.id && (
                  <tr key={`${loan.id}-detail`}>
                    <td colSpan={5} className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                      {/* Disburse confirmation inline */}
                      {target?.id === loan.id && (
                        <div className="mb-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                          <p className="text-xs font-semibold text-amber-800 mb-2">
                            Confirm disbursement of ETB {Number(principal(loan)).toLocaleString()} for {loan.durationMonths} months?
                            This will activate the loan and cannot be undone.
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={handleDisburse}
                              disabled={disbursing}
                              className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                            >
                              {disbursing && <CircularProgress size={10} color="inherit" />}
                              {disbursing ? 'Disbursing...' : 'Confirm Disburse'}
                            </button>
                            <button onClick={() => { setTarget(null); }} className="px-3 py-1.5 rounded-md border border-gray-200 text-xs text-gray-600 hover:bg-white">
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Loan details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <p className="text-gray-400">Member ID</p>
                          <p className="font-mono text-gray-700">{loan.memberId?.slice(0, 8)}…</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Application ID</p>
                          <p className="font-mono text-gray-700">{loan.applicationId?.slice(0, 8)}…</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Outstanding Principal</p>
                          <p className="font-semibold text-gray-800">ETB {Number(outstanding(loan)).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Interest Rate</p>
                          <p className="font-semibold text-gray-800">{(Number(loan.interestRate) * 100).toFixed(1)}% p.a.</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Duration</p>
                          <p className="font-semibold text-gray-800">{loan.durationMonths} months</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Status</p>
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                            {loan.status}
                          </span>
                        </div>
                        {loan.approvalDate && (
                          <div>
                            <p className="text-gray-400">Approved</p>
                            <p className="text-gray-700">{new Date(loan.approvalDate).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <Pagination
          page={page}
          totalPages={totalPages}
          totalElements={sorted.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={() => {}}
          pageSizeOptions={[5, 10, 20]}
        />
      </div>
    </>
  );
}
