'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CircularProgress } from '@mui/material';
import { useRecordRepaymentMutation } from '../loansApi';
import { CurrencyInput } from '@/components/common/CurrencyInput';
import { toastSuccess, toastError, toastWarning } from '@/components/common/Toast';

const schema = z.object({
  loanId: z.string().min(1, 'Loan ID is required'),
  amount: z.number().positive('Amount must be positive'),
});

type FormData = { loanId: string; amount: number };

interface Props {
  loanId?: string;
  suggestedAmount?: number;
  outstandingBalance?: number;
  onSuccess?: () => void;
}

export function LoanRepaymentForm({ loanId, suggestedAmount, outstandingBalance, onSuccess }: Props) {
  const [recordRepayment, { isLoading, error }] = useRecordRepaymentMutation();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { loanId: loanId ?? '', amount: suggestedAmount ?? ('' as any) },
  });

  const onSubmit = async (formData: FormData) => {
    try {
      const result = await recordRepayment({ loanId: formData.loanId, amount: formData.amount }).unwrap() as any;
      toastSuccess('Repayment recorded successfully');
      if (result?.warning) toastWarning(result.warning);
      reset({ loanId: loanId ?? '', amount: suggestedAmount ?? ('' as any) });
      onSuccess?.();
    } catch (e: any) {
      toastError(e?.data?.message ?? e?.message ?? 'Failed to record repayment');
    }
  };

  const inputCls = 'w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5';
  const errCls = 'text-xs text-red-500 mt-1';

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!loanId && (
          <div>
            <label className={labelCls}>Loan ID *</label>
            <input {...register('loanId')} className={inputCls} placeholder="Enter loan ID" />
            {errors.loanId && <p className={errCls}>{errors.loanId.message}</p>}
          </div>
        )}

        <div>
          <label className={labelCls}>Repayment Amount (ETB) *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">ETB</span>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  value={field.value}
                  onChange={(v) => field.onChange(v ?? 0)}
                  className="w-full pl-14 pr-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                  placeholder="0"
                />
              )}
            />
          </div>
          {errors.amount && <p className={errCls}>{errors.amount.message}</p>}
          {outstandingBalance !== undefined && (
            <p className="text-xs text-gray-500 mt-1">
              Outstanding balance: <span className="font-semibold text-gray-700">ETB {outstandingBalance.toFixed(2)}</span>
              {' '}— maximum accepted payment
            </p>
          )}
          {suggestedAmount && (
            <p className="text-xs text-gray-500 mt-1">
              Monthly installment: <span className="font-semibold text-green-700">ETB {suggestedAmount.toFixed(2)}</span>
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <CircularProgress size={16} color="inherit" />
              Processing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Record Repayment
            </>
          )}
        </button>
      </form>
    </div>
  );
}
