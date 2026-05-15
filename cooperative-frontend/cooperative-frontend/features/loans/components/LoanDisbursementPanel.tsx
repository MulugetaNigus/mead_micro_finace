'use client';

import React, { useState, useMemo } from 'react';
import { CircularProgress } from '@mui/material';
import { useGetAllLoansQuery, useDisburseLoanMutation } from '../loansApi';
import { toastSuccess, toastError } from '@/components/common/Toast';
import { Modal } from '@/components/common/Modal';
import { Pagination } from '@/components/common/Pagination';
import { LoanStatus, Loan } from '@/types';

type SortField = 'principalAmount' | 'interestRate' | 'durationMonths';

export function LoanDisbursementPanel() {
  const { data, isLoading } = useGetAllLoansQuery({ page: 0, size: 200, status: LoanStatus.APPROVED });
  const [disburse, { isLoading: disbursing }] = useDisburseLoanMutation();
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [confirming, setConfirming] = useState(false);

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
    if (!selectedLoan) return;
    try {
      await disburse(selectedLoan.id).unwrap();
      toastSuccess('Loan disbursed successfully');
      setSelectedLoan(null);
      setConfirming(false);
    } catch (e: any) {
      toastError(e?.data?.message ?? 'Failed to disburse loan');
    }
  };

  const getPrincipal = (loan: Loan) =>
    typeof loan.principalAmount === 'object' ? (loan.principalAmount as any).amount : loan.principalAmount;

  const getOutstanding = (loan: Loan) =>
    typeof loan.outstandingPrincipal === 'object' ? (loan.outstandingPrincipal as any).amount : loan.outstandingPrincipal;

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
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 cursor-pointer select-none hover:text-gray-700" onClick={() => handleSort('principalAmount')}>
                Principal {sortIcon('principalAmount')}
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 cursor-pointer select-none hover:text-gray-700" onClick={() => handleSort('interestRate')}>
                Rate {sortIcon('interestRate')}
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 cursor-pointer select-none hover:text-gray-700" onClick={() => handleSort('durationMonths')}>
                Duration {sortIcon('durationMonths')}
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paged.map((loan: Loan) => (
              <tr
                key={loan.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => { setSelectedLoan(loan); setConfirming(false); }}
              >
                <td className="px-4 py-2.5 font-mono text-xs text-gray-400">{loan.id.slice(0, 8)}…</td>
                <td className="px-4 py-2.5 font-semibold text-gray-800">ETB {Number(getPrincipal(loan)).toLocaleString()}</td>
                <td className="px-4 py-2.5 text-gray-600">{(Number(loan.interestRate) * 100).toFixed(1)}%</td>
                <td className="px-4 py-2.5 text-gray-600">{loan.durationMonths}mo</td>
                <td className="px-4 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => { setSelectedLoan(loan); setConfirming(true); }}
                    disabled={disbursing}
                    className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    Disburse
                  </button>
                </td>
              </tr>
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

      {/* Detail / Disburse Modal */}
      <Modal
        open={!!selectedLoan}
        onClose={() => { setSelectedLoan(null); setConfirming(false); }}
        title={`Loan — ETB ${selectedLoan ? Number(getPrincipal(selectedLoan)).toLocaleString() : ''} · ${selectedLoan?.durationMonths}mo`}
        width="max-w-lg"
      >
        {selectedLoan && (
          <div className="space-y-4">
            {/* Loan details grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Principal', value: `ETB ${Number(getPrincipal(selectedLoan)).toLocaleString()}` },
                { label: 'Outstanding', value: `ETB ${Number(getOutstanding(selectedLoan)).toLocaleString()}` },
                { label: 'Interest Rate', value: `${(Number(selectedLoan.interestRate) * 100).toFixed(1)}% p.a.` },
                { label: 'Duration', value: `${selectedLoan.durationMonths} months` },
                { label: 'Member ID', value: selectedLoan.memberId?.slice(0, 8) + '…' },
                { label: 'Application ID', value: selectedLoan.applicationId?.slice(0, 8) + '…' },
                { label: 'Status', value: selectedLoan.status as string },
                ...(selectedLoan.approvalDate ? [{ label: 'Approved', value: new Date(selectedLoan.approvalDate).toLocaleDateString() }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>

            {/* Disburse confirmation */}
            {confirming ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-sm font-semibold text-amber-800 mb-1">
                  Confirm disbursement of ETB {Number(getPrincipal(selectedLoan)).toLocaleString()} for {selectedLoan.durationMonths} months?
                </p>
                <p className="text-xs text-amber-700 mb-3">This will activate the loan and cannot be undone.</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDisburse}
                    disabled={disbursing}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {disbursing && <CircularProgress size={14} color="inherit" />}
                    {disbursing ? 'Disbursing…' : 'Confirm Disburse'}
                  </button>
                  <button onClick={() => setConfirming(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Disburse This Loan
              </button>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
