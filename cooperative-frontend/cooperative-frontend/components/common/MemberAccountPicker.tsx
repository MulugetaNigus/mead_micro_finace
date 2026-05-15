'use client';

import { useState, useCallback } from 'react';
import { useLazySearchMembersQuery } from '@/features/members/membersApi';
import { useGetAccountsByMemberQuery } from '@/features/accounts/accountsApi';
import { Modal } from '@/components/common/Modal';
import type { AccountDto } from '@/features/accounts/accountsApi';

interface Props {
  onAccountSelected: (accountId: string, account: AccountDto) => void;
  accountTypeFilter?: 'REGULAR_SAVING' | 'NON_REGULAR_SAVING';
  label?: string;
  /** Text shown on the trigger button when nothing is selected */
  placeholder?: string;
}

export function MemberAccountPicker({
  onAccountSelected,
  accountTypeFilter,
  label = 'Member & Account',
  placeholder = 'Select member & account…',
}: Props) {
  const [open, setOpen] = useState(false);

  // Selection state (inside modal)
  const [query, setQuery] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedMemberName, setSelectedMemberName] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');

  // Display state (outside modal — confirmed selection)
  const [confirmedMemberName, setConfirmedMemberName] = useState('');
  const [confirmedAccountType, setConfirmedAccountType] = useState('');

  const [searchMembers, { data: members = [], isFetching }] = useLazySearchMembersQuery();
  const { data: accounts = [] } = useGetAccountsByMemberQuery(selectedMemberId, { skip: !selectedMemberId });

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (value.length >= 2) searchMembers(value);
  }, [searchMembers]);

  const handleSelectMember = (id: string, name: string) => {
    setSelectedMemberId(id);
    setSelectedMemberName(name);
    setSelectedAccountId('');
    setQuery('');
  };

  const handleSelectAccount = (acc: AccountDto) => {
    setSelectedAccountId(acc.id);
    // Confirm and close
    setConfirmedMemberName(selectedMemberName);
    setConfirmedAccountType(acc.accountType.replace(/_/g, ' '));
    onAccountSelected(acc.id, acc);
    setOpen(false);
  };

  const handleOpen = () => {
    // Reset inner state when reopening
    setQuery('');
    setSelectedMemberId('');
    setSelectedMemberName('');
    setSelectedAccountId('');
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const filteredAccounts = accountTypeFilter
    ? accounts.filter((a: AccountDto) => a.accountType === accountTypeFilter)
    : accounts;

  const hasSelection = !!confirmedMemberName;

  return (
    <>
      {/* Trigger */}
      <div>
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
        )}
        <button
          type="button"
          onClick={handleOpen}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm transition-colors ${
            hasSelection
              ? 'border-blue-500 bg-blue-50 text-blue-800'
              : 'border-dashed border-gray-300 bg-white text-gray-500 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {hasSelection ? (
              <span>
                <span className="font-semibold">{confirmedMemberName}</span>
                <span className="ml-2 text-xs text-blue-600 font-medium bg-blue-100 px-2 py-0.5 rounded-full">
                  {confirmedAccountType}
                </span>
              </span>
            ) : (
              <span>{placeholder}</span>
            )}
          </span>
          <span className="text-xs font-medium text-blue-600 ml-2">
            {hasSelection ? 'Change' : 'Select'}
          </span>
        </button>
      </div>

      {/* Modal */}
      <Modal open={open} onClose={handleClose} title="Select Member & Account" width="max-w-md">
        <div className="space-y-4">
          {/* Step 1: Member search */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Step 1 — Search Member
            </p>
            {selectedMemberId ? (
              <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {selectedMemberName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-blue-800">{selectedMemberName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedMemberId(''); setSelectedMemberName(''); setSelectedAccountId(''); }}
                  className="text-xs text-blue-500 hover:text-blue-700 font-medium"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search by name, national ID, or phone…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                {isFetching && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    Searching…
                  </span>
                )}
                {members.length > 0 && query.length >= 2 && (
                  <div className="mt-1 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden max-h-44 overflow-y-auto">
                    {members.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectMember(m.id, `${m.firstName} ${m.lastName}`)}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 border-b border-gray-100 last:border-0 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{m.firstName} {m.lastName}</span>
                        <span className="ml-2 text-xs text-gray-500">{m.nationalId}</span>
                      </button>
                    ))}
                  </div>
                )}
                {query.length >= 2 && !isFetching && members.length === 0 && (
                  <p className="mt-2 text-sm text-gray-400 text-center py-2">No members found</p>
                )}
              </div>
            )}
          </div>

          {/* Step 2: Account selection */}
          {selectedMemberId && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Step 2 — Select Account
              </p>
              {filteredAccounts.length === 0 ? (
                <p className="text-sm text-gray-500 italic text-center py-4">
                  No accounts found for this member.
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredAccounts.map((acc: AccountDto) => {
                    const isSelected = acc.id === selectedAccountId;
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => handleSelectAccount(acc)}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-colors ${
                              isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'
                            }`} />
                            <div>
                              <p className={`text-sm font-semibold ${isSelected ? 'text-blue-800' : 'text-gray-800'}`}>
                                {acc.accountType.replace(/_/g, ' ')}
                              </p>
                              <p className="text-xs text-gray-400 font-mono">{acc.id.slice(0, 16)}…</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-bold ${isSelected ? 'text-blue-700' : 'text-green-700'}`}>
                              ETB {Number(acc.balance).toLocaleString()}
                            </p>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                              acc.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {acc.status}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Cancel */}
          <div className="pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
