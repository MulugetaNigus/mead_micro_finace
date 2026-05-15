'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateRegularAccountMutation, useCreateNonRegularAccountMutation, useDepositMutation } from '@/features/accounts/accountsApi';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { CurrencyInput } from '@/components/common/CurrencyInput';
import { MemberSearchInput } from '@/components/common/MemberSearchInput';
import { toastSuccess, toastError } from '@/components/common/Toast';
import type { Member } from '@/types';

export default function NewAccountPage() {
  const router = useRouter();
  const [memberId, setMemberId] = useState('');
  const [memberName, setMemberName] = useState('');
  const [accountType, setAccountType] = useState<'regular' | 'non-regular'>('regular');
  const [initialDeposit, setInitialDeposit] = useState<number | undefined>(undefined);
  const [submitError, setSubmitError] = useState('');
  const [depositError, setDepositError] = useState('');

  const [createRegular, { isLoading: creatingRegular }] = useCreateRegularAccountMutation();
  const [createNonRegular, { isLoading: creatingNonRegular }] = useCreateNonRegularAccountMutation();
  const [deposit] = useDepositMutation();

  const isLoading = creatingRegular || creatingNonRegular;

  const handleMemberSelect = (id: string, member: Member | null) => {
    setMemberId(id);
    setMemberName(member ? `${member.firstName} ${member.lastName}` : '');
    setSubmitError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) { setSubmitError('Please select a member.'); return; }
    if (accountType === 'non-regular' && initialDeposit !== undefined) {
      if (initialDeposit < 0) { setDepositError('Initial deposit must be a non-negative number'); return; }
      if (initialDeposit > 10_000_000) { setDepositError('Initial deposit cannot exceed ETB 10,000,000'); return; }
    }
    setDepositError('');
    setSubmitError('');
    try {
      const result = accountType === 'regular'
        ? await createRegular(memberId).unwrap()
        : await createNonRegular(memberId).unwrap();

      if (accountType === 'non-regular' && initialDeposit && initialDeposit > 0) {
        await deposit({ accountId: result.id, data: { amount: initialDeposit, notes: 'Initial deposit' } }).unwrap();
      }

      toastSuccess('Account created successfully');
      setTimeout(() => router.push(`/dashboard/accounts/${result.id}`), 800);
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to create account');
      setSubmitError(err?.data?.message || 'Failed to create account.');
    }
  };

  return (
    <RoleGuard allowedRoles={['MANAGER', 'MEMBER_OFFICER']}>
      <div className="p-4 max-w-lg mx-auto space-y-4">
        <div>
          <button onClick={() => router.back()} className="text-sm text-blue-600 hover:underline mb-1 block">
            &larr; Back
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Create Account</h1>
        </div>

        {submitError && <ErrorAlert message={submitError} />}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-4 space-y-4">
          {/* Member — modal picker */}
          <MemberSearchInput
            label="Member *"
            placeholder="Click to search and select a member…"
            value={memberId}
            onChange={handleMemberSelect}
            error={!memberId && submitError ? 'Please select a member' : undefined}
          />

          {/* Account type */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Account Type *</label>
            <div className="grid grid-cols-2 gap-3">
              {(['regular', 'non-regular'] as const).map((type) => (
                <label key={type}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    accountType === type ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <input type="radio" name="accountType" value={type} checked={accountType === type}
                    onChange={() => setAccountType(type)} className="sr-only" />
                  <span className="text-sm font-medium text-gray-800">
                    {type === 'regular' ? 'Regular Savings' : 'Non-Regular Savings'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Regular savings info */}
          {accountType === 'regular' && (
            <div className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              Monthly deduction is set on the member profile. The committed deduction will be collected via payroll.
            </div>
          )}

          {/* Non-regular initial deposit */}
          {accountType === 'non-regular' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Initial Deposit (ETB)</label>
              <CurrencyInput
                value={initialDeposit}
                onChange={(v) => { setInitialDeposit(v); setDepositError(''); }}
                placeholder="0 (optional)"
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  depositError ? 'border-red-400 bg-red-50' : 'border-gray-200'
                }`}
              />
              {depositError && <p className="text-xs text-red-500 mt-1">{depositError}</p>}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.back()}
              className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50" disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
              {isLoading && <LoadingSpinner size="sm" />}
              {isLoading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>

      </div>
    </RoleGuard>
  );
}
