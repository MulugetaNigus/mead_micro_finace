'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CircularProgress } from '@mui/material';
import { useSubmitAppealMutation } from '../loansApi';
import { toastSuccess, toastError } from '@/components/common/Toast';

const schema = z.object({
  appealReason: z.string().min(10, 'Please provide a detailed reason (min 10 characters)'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  applicationId: string;
  memberId: string;
  onSuccess?: () => void;
}

export function LoanAppealForm({ applicationId, memberId, onSuccess }: Props) {
  const [submitAppeal, { isLoading }] = useSubmitAppealMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await submitAppeal({ applicationId, memberId, appealReason: data.appealReason }).unwrap();
      reset();
      toastSuccess('Appeal submitted');
      onSuccess?.();
    } catch (err: any) {
      toastError(err?.data?.message ?? 'Failed to submit appeal');
    }
  };

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all';
  const labelCls = 'block text-xs font-semibold text-gray-600 mb-1';
  const errCls = 'text-xs text-red-500 mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelCls}>Appeal Reason</label>
        <textarea
          {...register('appealReason')}
          rows={4}
          className={inputCls}
          placeholder="Explain why this loan application should be reconsidered..."
        />
        {errors.appealReason && <p className={errCls}>{errors.appealReason.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? <CircularProgress size={16} color="inherit" /> : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        )}
        {isLoading ? 'Submitting...' : 'Submit Appeal'}
      </button>
    </form>
  );
}
