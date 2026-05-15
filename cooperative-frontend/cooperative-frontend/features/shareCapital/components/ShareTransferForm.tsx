'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CircularProgress } from '@mui/material';
import { useTransferSharesMutation } from '../shareCapitalApi';
import { MemberSearchInput } from '@/components/common/MemberSearchInput';
import { toastSuccess, toastError } from '@/components/common/Toast';

const schema = z.object({
  fromMemberId: z.string().min(1, 'Source member is required'),
  toMemberId: z.string().min(1, 'Destination member is required'),
  sharesCount: z.number().int().positive('Number of shares must be a positive integer'),
}).refine((d) => d.fromMemberId !== d.toMemberId, {
  message: 'Source and destination members must be different',
  path: ['toMemberId'],
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSuccess?: () => void;
}

export function ShareTransferForm({ onSuccess }: Props) {
  const [transferShares, { isLoading }] = useTransferSharesMutation();

  const { handleSubmit, reset, control, register, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await transferShares(data).unwrap();
      reset();
      toastSuccess('Transfer complete');
      onSuccess?.();
    } catch (err: any) {
      toastError(err?.data?.message ?? 'Failed to transfer shares');
    }
  };

  const inputCls = 'w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5';
  const errCls = 'text-xs text-red-500 mt-1';

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">Transfer Shares</h3>
          <p className="text-sm text-gray-500">Transfer shares between members</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">
        <Controller
          name="fromMemberId"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <MemberSearchInput
              label="From Member *"
              placeholder="Search source member..."
              value={field.value}
              onChange={(id) => field.onChange(id)}
              error={errors.fromMemberId?.message}
            />
          )}
        />

        <Controller
          name="toMemberId"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <MemberSearchInput
              label="To Member *"
              placeholder="Search destination member..."
              value={field.value}
              onChange={(id) => field.onChange(id)}
              error={errors.toMemberId?.message}
            />
          )}
        />

        <div>
          <label className={labelCls}>Number of Shares *</label>
          <input
            type="number"
            {...register('sharesCount', { valueAsNumber: true })}
            className={inputCls}
            placeholder="0"
            min="1"
          />
          {errors.sharesCount && <p className={errCls}>{errors.sharesCount.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-lg bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <CircularProgress size={16} color="inherit" />
              Transferring...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Transfer Shares
            </>
          )}
        </button>
      </form>
    </div>
  );
}
