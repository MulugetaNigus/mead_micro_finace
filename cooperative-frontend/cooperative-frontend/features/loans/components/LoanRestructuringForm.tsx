'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CircularProgress } from '@mui/material';
import { useInitiateRestructuringMutation } from '../loansApi';
import { toastSuccess, toastError } from '@/components/common/Toast';

const schema = z.object({
  restructuringReason: z.string().min(10, 'Please provide a detailed reason (min 10 characters)'),
  newDurationMonths: z.number().int().min(1, 'Min 1 month').max(360, 'Max 360 months'),
  newInterestRate: z.number().min(13, 'Min 13%').max(19, 'Max 19%'),
});

type FormData = z.infer<typeof schema>;

const inputCls = 'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all';
const labelCls = 'block text-xs font-semibold text-gray-600 mb-1';
const errCls = 'text-xs text-red-500 mt-1';

export function LoanRestructuringForm({ loanId, onSuccess }: { loanId: string; onSuccess?: () => void }) {
  const [initiateRestructuring, { isLoading }] = useInitiateRestructuringMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await initiateRestructuring({
        loanId,
        ...data,
        newInterestRate: data.newInterestRate / 100,
      }).unwrap();
      reset();
      toastSuccess('Restructuring requested');
      onSuccess?.();
    } catch (err: any) {
      toastError(err?.data?.message ?? 'Failed to submit restructuring request');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div>
        <label className={labelCls}>Reason for Restructuring *</label>
        <textarea {...register('restructuringReason')} rows={3} className={inputCls} placeholder="Explain why restructuring is needed..." />
        {errors.restructuringReason && <p className={errCls}>{errors.restructuringReason.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>New Duration (months) *</label>
          <input type="number" min="1" max="360" {...register('newDurationMonths', { valueAsNumber: true })} className={inputCls} placeholder="24" />
          {errors.newDurationMonths && <p className={errCls}>{errors.newDurationMonths.message}</p>}
        </div>
        <div>
          <label className={labelCls}>New Interest Rate (%, 13–19) *</label>
          <input type="number" step="0.01" min="13" max="19" {...register('newInterestRate', { valueAsNumber: true })} className={inputCls} placeholder="13" />
          {errors.newInterestRate && <p className={errCls}>{errors.newInterestRate.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading && <CircularProgress size={14} color="inherit" />}
        {isLoading ? 'Submitting...' : 'Request Restructuring'}
      </button>
    </form>
  );
}
