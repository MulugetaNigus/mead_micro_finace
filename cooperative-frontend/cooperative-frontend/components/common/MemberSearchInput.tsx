'use client';

import { useState, useCallback, useRef } from 'react';
import { useLazySearchMembersQuery } from '@/features/members/membersApi';
import { Modal } from '@/components/common/Modal';
import type { Member } from '@/types';

interface Props {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange: (memberId: string, member: Member | null) => void;
  className?: string;
  error?: string;
}

export function MemberSearchInput({
  label,
  placeholder = 'Search by name or member number…',
  value,
  onChange,
  className = '',
  error,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [searchMembers, { data: results = [], isFetching }] = useLazySearchMembersQuery();

  const handleInput = useCallback((val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.length >= 2) {
      debounceRef.current = setTimeout(() => searchMembers(val), 300);
    }
  }, [searchMembers]);

  const handleSelect = (member: Member) => {
    setSelectedMember(member);
    setQuery('');
    setOpen(false);
    onChange(member.id, member);
  };

  const handleClear = () => {
    setSelectedMember(null);
    setQuery('');
    onChange('', null);
  };

  const handleOpen = () => {
    setQuery('');
    setOpen(true);
  };

  return (
    <>
      <div className={className}>
        {label && (
          <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
        )}

        {/* Trigger button */}
        {selectedMember ? (
          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-purple-50 border border-purple-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">
                  {selectedMember.firstName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <span className="text-sm font-semibold text-purple-900">
                  {selectedMember.firstName} {selectedMember.lastName}
                </span>
                <span className="ml-2 text-xs text-purple-500">{selectedMember.nationalId}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-purple-400 hover:text-purple-700 font-medium ml-2"
            >
              Change
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleOpen}
            className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed text-sm transition-colors ${
              error
                ? 'border-red-400 bg-red-50 text-red-500'
                : 'border-gray-300 bg-white text-gray-500 hover:border-purple-400 hover:bg-purple-50'
            }`}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>{placeholder}</span>
          </button>
        )}

        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Search Member" width="max-w-md">
        <div className="space-y-3">
          {/* Search input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => handleInput(e.target.value)}
              placeholder="Type name, national ID, or phone…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
            {isFetching && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                Searching…
              </span>
            )}
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
              {results.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelect(m)}
                  className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-700 text-xs font-bold">
                      {m.firstName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{m.firstName} {m.lastName}</p>
                    <p className="text-xs text-gray-500">{m.nationalId}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {query.length >= 2 && !isFetching && results.length === 0 && (
            <div className="text-center py-6 text-sm text-gray-400">
              No members found for "{query}"
            </div>
          )}

          {query.length < 2 && (
            <p className="text-center text-xs text-gray-400 py-4">
              Type at least 2 characters to search
            </p>
          )}

          {/* Cancel */}
          <div className="pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setOpen(false)}
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
