'use client';

import { useState, useMemo } from 'react';
import {
  useGenerateDeductionListMutation,
  useGetDeductionListQuery,
  useProcessConfirmationMutation,
  useReconcileDeductionsMutation,
  type ReconciliationReport,
} from '@/features/payroll/payrollApi';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { exportToCsv } from '@/lib/exportCsv';

function toYearMonth(year: number, month: number) {
  return `${year}-${String(month).padStart(2, '0')}`;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 border border-amber-200',
  CONFIRMED: 'bg-green-100 text-green-700 border border-green-200',
  FAILED: 'bg-red-100 text-red-700 border border-red-200',
};

type SortField = 'memberName' | 'deductionAmount' | 'status';
type SortOrder = 'asc' | 'desc';
type GroupBy = 'none' | 'status' | 'amount';

export default function PayrollPage() {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [reconcileResult, setReconcileResult] = useState<ReconciliationReport | null>(null);
  const [showReconcileConfirm, setShowReconcileConfirm] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirmAmounts, setConfirmAmounts] = useState<Record<string, string>>({});
  
  // New state for enhanced features
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('memberName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkConfirmAmount, setBulkConfirmAmount] = useState('');

  const selectedPeriod = toYearMonth(selectedYear, selectedMonth);
  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  const { data: deductionList = [], isLoading: listLoading, refetch: refetchList } =
    useGetDeductionListQuery(selectedPeriod);
  const [generateList, { isLoading: generating }] = useGenerateDeductionListMutation();
  const [processConfirmation] = useProcessConfirmationMutation();
  const [reconcile, { isLoading: reconciling }] = useReconcileDeductionsMutation();

  // Filter, sort, and group deductions
  const processedDeductions = useMemo(() => {
    let filtered = [...(deductionList as any[])];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d => 
        (d.memberName ?? '').toLowerCase().includes(query) ||
        (d.memberId ?? '').toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(d => d.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortField) {
        case 'memberName':
          aVal = (a.memberName ?? a.memberId ?? '').toLowerCase();
          bVal = (b.memberName ?? b.memberId ?? '').toLowerCase();
          break;
        case 'deductionAmount':
          aVal = Number(a.deductionAmount ?? 0);
          bVal = Number(b.deductionAmount ?? 0);
          break;
        case 'status':
          aVal = a.status ?? '';
          bVal = b.status ?? '';
          break;
        default:
          return 0;
      }
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [deductionList, searchQuery, filterStatus, sortField, sortOrder]);

  // Group deductions
  const groupedDeductions = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Deductions': processedDeductions };
    }

    const groups: Record<string, any[]> = {};
    
    processedDeductions.forEach(d => {
      let key: string;
      if (groupBy === 'status') {
        key = d.status ?? 'Unknown';
      } else if (groupBy === 'amount') {
        const amount = Number(d.deductionAmount ?? 0);
        if (amount < 1000) key = 'Under ETB 1,000';
        else if (amount < 5000) key = 'ETB 1,000 - 5,000';
        else if (amount < 10000) key = 'ETB 5,000 - 10,000';
        else key = 'Over ETB 10,000';
      } else {
        key = 'Other';
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(d);
    });

    return groups;
  }, [processedDeductions, groupBy]);

  // Selection handlers
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === processedDeductions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(processedDeductions.map(d => d.id)));
    }
  };

  const selectedDeductions = processedDeductions.filter(d => selectedIds.has(d.id));
  const pendingSelected = selectedDeductions.filter(d => d.status === 'PENDING');

  const handleGenerate = async () => {
    try { await generateList(selectedPeriod).unwrap(); refetchList(); } catch {}
  };

  const handleConfirm = async (d: any) => {
    const amount = parseFloat(confirmAmounts[d.id] ?? String(d.deductionAmount ?? 0));
    if (!amount || isNaN(amount)) return;
    setConfirmingId(d.id);
    try {
      await processConfirmation({ memberId: d.memberId, deductionMonth: selectedPeriod, amount }).unwrap();
      refetchList();
    } catch {}
    setConfirmingId(null);
  };

  const handleBulkConfirm = async () => {
    const amount = parseFloat(bulkConfirmAmount);
    if (!amount || isNaN(amount) || pendingSelected.length === 0) return;

    setShowBulkConfirm(false);
    
    for (const d of pendingSelected) {
      try {
        await processConfirmation({ 
          memberId: d.memberId, 
          deductionMonth: selectedPeriod, 
          amount: amount 
        }).unwrap();
      } catch {}
    }
    
    refetchList();
    setSelectedIds(new Set());
    setBulkConfirmAmount('');
  };

  const handleReconcile = async () => {
    try {
      const result = await reconcile(selectedPeriod).unwrap();
      setReconcileResult(result);
      setShowReconcileConfirm(false);
    } catch {}
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <RoleGuard allowedRoles={['MANAGER', 'ACCOUNTANT']}>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Deductions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Generate and reconcile monthly salary deductions</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Monthly Payroll Processing</h2>
          <div className="flex items-center gap-3 flex-wrap mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Month</label>
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Year</label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleGenerate} disabled={generating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                {generating ? 'Generating...' : 'Generate List'}
              </button>
              <button onClick={() => setShowReconcileConfirm(true)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">
                Reconcile
              </button>
            </div>
          </div>

          {/* Filters and Controls - Moved to top */}
          {(deductionList as any[]).length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-3 items-center">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search by member name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="FAILED">Failed</option>
                </select>

                {/* Group By */}
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as GroupBy)}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">No Grouping</option>
                  <option value="status">Group by Status</option>
                  <option value="amount">Group by Amount</option>
                </select>

                {/* Bulk Actions */}
                {selectedIds.size > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-xs font-medium text-blue-700">
                      {selectedIds.size} selected
                    </span>
                    {pendingSelected.length > 0 && (
                      <button
                        onClick={() => setShowBulkConfirm(true)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
                      >
                        Bulk Confirm ({pendingSelected.length})
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedIds(new Set())}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">
                Deductions - {MONTHS[selectedMonth - 1]} {selectedYear}
              </h2>
              <div className="flex items-center gap-3">
                {(deductionList as any[]).length > 0 && (
                  <>
                    <span className="text-xs text-gray-400">{processedDeductions.length} of {(deductionList as any[]).length} records</span>
                    <button
                      onClick={() => exportToCsv(
                        processedDeductions as unknown as Record<string, unknown>[],
                        `payroll_${selectedPeriod}`,
                        [
                          { key: 'id', label: 'ID' },
                          { key: 'memberId', label: 'Member ID' },
                          { key: 'memberName', label: 'Member Name' },
                          { key: 'deductionAmount', label: 'Expected Amount' },
                          { key: 'confirmedAmount', label: 'Confirmed Amount' },
                          { key: 'deductionMonth', label: 'Month' },
                          { key: 'status', label: 'Status' },
                        ]
                      )}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Export CSV
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {listLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600" />
            </div>
          ) : processedDeductions.length > 0 ? (
            <div className="overflow-x-auto">
              {Object.entries(groupedDeductions).map(([groupName, items]) => (
                <div key={groupName}>
                  {groupBy !== 'none' && (
                    <div className="px-5 py-2 bg-gray-50 border-b border-gray-200">
                      <h3 className="text-xs font-semibold text-gray-700">
                        {groupName} ({items.length})
                      </h3>
                    </div>
                  )}
                  <table className="w-full text-sm">
                    {groupBy === 'none' && (
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-5 py-3 text-left">
                            <input
                              type="checkbox"
                              checked={selectedIds.size === processedDeductions.length && processedDeductions.length > 0}
                              onChange={toggleSelectAll}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </th>
                          <th 
                            className="text-left px-5 py-3 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('memberName')}
                          >
                            <div className="flex items-center gap-1">
                              Member
                              {sortField === 'memberName' && (
                                <span className="text-blue-600">
                                  {sortOrder === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </div>
                          </th>
                          <th 
                            className="text-right px-5 py-3 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('deductionAmount')}
                          >
                            <div className="flex items-center justify-end gap-1">
                              Expected
                              {sortField === 'deductionAmount' && (
                                <span className="text-blue-600">
                                  {sortOrder === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </div>
                          </th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-600">Month</th>
                          <th 
                            className="text-left px-5 py-3 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('status')}
                          >
                            <div className="flex items-center gap-1">
                              Status
                              {sortField === 'status' && (
                                <span className="text-blue-600">
                                  {sortOrder === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </div>
                          </th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-600">Action</th>
                        </tr>
                      </thead>
                    )}
                    <tbody className="divide-y divide-gray-100">
                      {items.map((d) => (
                        <tr key={d.id} className={`hover:bg-gray-50 ${selectedIds.has(d.id) ? 'bg-blue-50' : ''}`}>
                          <td className="px-5 py-3">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(d.id)}
                              onChange={() => toggleSelection(d.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-5 py-3 font-medium text-gray-900">{d.memberName ?? d.memberId}</td>
                          <td className="px-5 py-3 text-right font-semibold text-gray-900">
                            ETB {Number(d.deductionAmount ?? 0).toLocaleString()}
                          </td>
                          <td className="px-5 py-3 text-gray-500">{d.deductionMonth ?? selectedPeriod}</td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[d.status] ?? 'bg-gray-100 text-gray-600'}`}>
                              {d.status}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            {d.status === 'PENDING' && (
                              <div className="flex items-center gap-2">
                                <input type="number"
                                  placeholder={String(d.deductionAmount ?? '')}
                                  value={confirmAmounts[d.id] ?? ''}
                                  onChange={(e) => setConfirmAmounts(prev => ({ ...prev, [d.id]: e.target.value }))}
                                  className="w-24 px-2 py-1 rounded border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                                <button onClick={() => handleConfirm(d)} disabled={confirmingId === d.id}
                                  className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 disabled:opacity-50">
                                  {confirmingId === d.id ? '...' : 'Confirm'}
                                </button>
                              </div>
                            )}
                            {d.status === 'CONFIRMED' && (
                              <span className="text-xs text-gray-400">
                                ETB {Number(d.confirmedAmount ?? 0).toLocaleString()}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-400 text-sm">
              {searchQuery || filterStatus !== 'all' 
                ? 'No deductions match your filters'
                : `No deduction list for ${MONTHS[selectedMonth - 1]} ${selectedYear}. Click Generate List to create one.`
              }
            </div>
          )}
        </div>

        {reconcileResult && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Reconciliation - {String(reconcileResult.month)}</h2>
              <button onClick={() => setReconcileResult(null)} className="text-xs text-gray-400 hover:text-gray-600">Dismiss</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Expected', value: reconcileResult.expectedDeductions, color: 'text-gray-900' },
                { label: 'Confirmed', value: reconcileResult.confirmedDeductions, color: 'text-green-600' },
                { label: 'Failed', value: reconcileResult.failedDeductions, color: 'text-red-600' },
                { label: 'Discrepancy', value: `ETB ${Number(reconcileResult.discrepancyAmount).toLocaleString()}`, color: 'text-orange-600' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <p className={`text-base font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {showReconcileConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Confirm Reconciliation</h3>
              <p className="text-sm text-gray-600 mb-5">
                Reconcile deductions for <strong>{MONTHS[selectedMonth - 1]} {selectedYear}</strong>?
              </p>
              <div className="flex gap-3">
                <button onClick={handleReconcile} disabled={reconciling}
                  className="flex-1 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50">
                  {reconciling ? 'Reconciling...' : 'Confirm'}
                </button>
                <button onClick={() => setShowReconcileConfirm(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showBulkConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Bulk Confirm Deductions</h3>
              <p className="text-sm text-gray-600 mb-4">
                Confirm <strong>{pendingSelected.length}</strong> pending deduction{pendingSelected.length !== 1 ? 's' : ''} with the same amount.
              </p>
              
              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Confirmed Amount (ETB)
                </label>
                <input
                  type="number"
                  value={bulkConfirmAmount}
                  onChange={(e) => setBulkConfirmAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  This amount will be applied to all selected pending deductions
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-5 max-h-40 overflow-y-auto">
                <p className="text-xs font-medium text-gray-700 mb-2">Selected Members:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {pendingSelected.map(d => (
                    <li key={d.id} className="flex justify-between">
                      <span>{d.memberName ?? d.memberId}</span>
                      <span className="text-gray-400">ETB {Number(d.deductionAmount ?? 0).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleBulkConfirm} 
                  disabled={!bulkConfirmAmount || isNaN(parseFloat(bulkConfirmAmount))}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  Confirm All
                </button>
                <button onClick={() => {
                  setShowBulkConfirm(false);
                  setBulkConfirmAmount('');
                }}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
