'use client';

import React, { useState, useMemo } from 'react';
import { CircularProgress } from '@mui/material';
import {
  useGetPendingRestructuringsQuery,
  useApproveRestructuringMutation,
  useDenyRestructuringMutation,
} from '../loansApi';
import { toastSuccess, toastError } from '@/components/common/Toast';
import { Modal } from '@/components/common/Modal';
import { Pagination } from '@/components/common/Pagination';
import type { LoanRestructuring } from '@/types';

type SortField = 'requestedAt' | 'newDurationMonths' | 'newInterestRate';

export function RestructuringQueuePanel() {
  const { data: pending = [], isLoading, refetch } = useGetPendingRestructuringsQuery();
  const [approveRestructuring] = useApproveRestructuringMutation();
  const [denyRestructuring] = useDenyRestructuringMutation();

  const [selectedItem, setSelectedItem] = useState<LoanRestructuring | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [denyMode, setDenyMode] = useState(false);
  const [denyReason, setDenyReason] = useState('');

  const [sortField, setSortField] = useState<SortField>('requestedAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const pageSize = 5;

  const sorted = useMemo(() => {
    return [...pending].sort((a, b) => {
      if (sortField === 'requestedAt') {
        const av = new Date(a.requestedAt ?? a.requestDate ?? 0).getTime();
        const bv = new Date(b.requestedAt ?? b.requestDate ?? 0).getTime();
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      const av = Number((a as any)[sortField] ?? 0);
      const bv = Number((b as any)[sortField] ?? 0);
      return sortDir === 'asc' ? av - bv : bv - av;
    });
  }, [pending, sortField, sortDir]);

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

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await approveRestructuring(id).unwrap();
      toastSuccess('Restructuring approved');
      setSelectedItem(null);
      refetch();
    } catch (e: any) {
      toastError(e?.data?.message ?? 'Failed to approve restructuring');
    } finally { setProcessingId(null); }
  };

  const handleDeny = async () => {
    if (!selectedItem || !denyReason.trim()) return;
    setProcessingId(selectedItem.id);
    try {
      await denyRestructuring({ id: selectedItem.id, reason: denyReason }).unwrap();
      toastSuccess('Restructuring denied');
      setSelectedItem(null);
      setDenyMode(false);
      setDenyReason('');
      refetch();
    } catch (e: any) {
      toastError(e?.data?.message ?? 'Failed to deny restructuring');
    } finally { setProcessingId(null); }
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setDenyMode(false);
    setDenyReason('');
  };

  if (isLoading) return <div className="flex justify-center py-8"><CircularProgress size={24} /></div>;

  if (pending.length === 0) {
    return <div className="text-center py-8 text-gray-400 text-sm">No pending restructuring requests</div>;
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Loan ID</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Reason</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 cursor-pointer select-none hover:text-gray-700" onClick={() => handleSort('newDurationMonths')}>
                New Duration {sortIcon('newDurationMonths')}
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 cursor-pointer select-none hover:text-gray-700" onClick={() => handleSort('newInterestRate')}>
                New Rate {sortIcon('newInterestRate')}
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 cursor-pointer select-none hover:text-gray-700" onClick={() => handleSort('requestedAt')}>
                Requested {sortIcon('requestedAt')}
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paged.map((r: LoanRestructuring) => (
              <tr
                key={r.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => { setSelectedItem(r); setDenyMode(false); setDenyReason(''); }}
              >
                <td className="px-4 py-2.5 font-mono text-xs text-gray-400">{(r.originalLoanId ?? r.loanId)?.slice(0, 8)}…</td>
                <td className="px-4 py-2.5 text-gray-700 max-w-[160px] truncate text-xs">{r.restructuringReason}</td>
                <td className="px-4 py-2.5 text-gray-600">{r.newDurationMonths}mo</td>
                <td className="px-4 py-2.5 text-gray-600">{(Number(r.newInterestRate) * 100).toFixed(1)}%</td>
                <td className="px-4 py-2.5 text-gray-500 text-xs whitespace-nowrap">
                  {(r.requestedAt ?? r.requestDate) ? new Date(r.requestedAt ?? r.requestDate!).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-1.5 justify-end">
                    <button
                      onClick={() => handleApprove(r.id)}
                      disabled={processingId === r.id}
                      className="px-2.5 py-1 rounded-md bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                    >
                      {processingId === r.id ? '…' : 'Approve'}
                    </button>
                    <button
                      onClick={() => { setSelectedItem(r); setDenyMode(true); setDenyReason(''); }}
                      className="px-2.5 py-1 rounded-md border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50"
                    >
                      Deny
                    </button>
                  </div>
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

      {/* Detail Modal */}
      <Modal
        open={!!selectedItem}
        onClose={handleCloseModal}
        title={`Restructuring Request — Loan ${(selectedItem?.originalLoanId ?? selectedItem?.loanId)?.slice(0, 8)}…`}
        width="max-w-md"
      >
        {selectedItem && (
          <div className="space-y-4">
            {/* Details */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'New Duration', value: `${selectedItem.newDurationMonths} months` },
                { label: 'New Rate', value: `${(Number(selectedItem.newInterestRate) * 100).toFixed(1)}%` },
                { label: 'Requested By', value: selectedItem.requestedBy ?? '—' },
                { label: 'Requested', value: (selectedItem.requestedAt ?? selectedItem.requestDate) ? new Date(selectedItem.requestedAt ?? selectedItem.requestDate!).toLocaleDateString() : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Reason</p>
              <p className="text-sm text-gray-700">{selectedItem.restructuringReason}</p>
            </div>

            {(selectedItem as any).outstandingAtRestructure && (
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-400 mb-0.5">Outstanding at Restructure</p>
                <p className="text-sm font-semibold text-gray-800">
                  ETB {Number((selectedItem as any).outstandingAtRestructure?.amount ?? 0).toLocaleString()}
                </p>
              </div>
            )}

            {/* Deny form */}
            {denyMode ? (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <p className="text-sm font-semibold text-red-800 mb-2">Denial reason *</p>
                <textarea
                  value={denyReason}
                  onChange={(e) => setDenyReason(e.target.value)}
                  placeholder="Reason for denial…"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-red-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none bg-white"
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleDeny}
                    disabled={!denyReason.trim() || processingId === selectedItem.id}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
                  >
                    Confirm Denial
                  </button>
                  <button onClick={() => { setDenyMode(false); setDenyReason(''); }} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleApprove(selectedItem.id)}
                  disabled={processingId === selectedItem.id}
                  className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processingId === selectedItem.id && <CircularProgress size={14} color="inherit" />}
                  Approve
                </button>
                <button
                  onClick={() => setDenyMode(true)}
                  className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50"
                >
                  Deny
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
