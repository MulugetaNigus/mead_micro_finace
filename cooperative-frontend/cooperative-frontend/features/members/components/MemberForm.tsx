'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateMemberMutation } from '@/features/members/membersApi';
import { useGetCurrentConfigQuery } from '@/features/config/configApi';
import { useGetActiveCategoriesQuery } from '@/features/memberTypeCategories/memberTypeCategoriesApi';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { CurrencyInput } from '@/components/common/CurrencyInput';
import { toastSuccess, toastError } from '@/components/common/Toast';

const inputCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500';
const labelCls = 'block text-xs font-semibold text-gray-700 mb-1';
const errCls = 'text-xs text-red-500 mt-1';

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {error && <p className={errCls}>{error}</p>}
    </div>
  );
}

interface Props { onSuccess?: () => void; }

export function MemberForm({ onSuccess }: Props) {
  const router = useRouter();
  const [createMember, { isLoading, error }] = useCreateMemberMutation();
  const { data: config } = useGetCurrentConfigQuery();
  const { data: memberTypeCategories = [] } = useGetActiveCategoriesQuery();

  const minShares = config?.minimumSharesRequired ?? 3;
  const minDeduction = config?.minimumMonthlyDeduction ?? 0;

  const schema = z.object({
    memberType: z.string().min(1, 'Member type is required'),
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be at most 50 characters')
      .regex(/^[A-Za-z\s'-]+$/, 'First name must contain letters only'),
    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be at most 50 characters')
      .regex(/^[A-Za-z\s'-]+$/, 'Last name must contain letters only'),
    dateOfBirth: z.string().min(1, 'Date of birth is required').refine((val) => {
      if (!val) return false;
      const dob = new Date(val);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear() -
        (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
      return age >= 18;
    }, 'Member must be at least 18 years old'),
    nationalId: z
      .string()
      .min(3, 'National ID must be at least 3 characters')
      .max(30, 'National ID must be at most 30 characters')
      .regex(/^[A-Za-z0-9/-]+$/, 'National ID must contain only letters, numbers, hyphens, or slashes'),
    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^\+?[0-9]{7,15}$/, 'Enter a valid phone number (e.g. +251912345678)'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    address: z
      .string()
      .max(200, 'Address must be at most 200 characters')
      .optional(),
    employmentStatus: z.string().min(1, 'Employment status is required'),
    committedDeduction: z.number()
      .positive('Committed deduction must be a positive number')
      .min(500, 'Minimum deduction is ETB 500')
      .min(minDeduction, `Minimum deduction is ETB ${Math.max(500, minDeduction)}`),
    shareCount: z.number().int('Share count must be a whole number')
      .min(minShares, `Minimum ${minShares} shares required`)
      .optional(),
    externalCooperativeName: z
      .string()
      .max(100, 'Cooperative name must be at most 100 characters')
      .optional(),
    externalCooperativeMemberId: z
      .string()
      .max(50, 'Cooperative member ID must be at most 50 characters')
      .optional(),
  });

  type FormData = z.infer<typeof schema>;

  const { register, handleSubmit, watch, control, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { memberType: 'REGULAR', shareCount: minShares },
  });

  const memberType = watch('memberType');

  const onSubmit = async (data: FormData) => {
    try {
      const result = await createMember({
        ...data,
        email: data.email || undefined,
      }).unwrap();
      toastSuccess('Member created successfully');
      reset({ memberType: 'REGULAR', shareCount: minShares });
      setTimeout(() => {
        onSuccess ? onSuccess() : router.push(`/dashboard/members/${result.id}`);
      }, 500);
    } catch (err: any) {
      console.error('Failed to create member — status:', err?.status, 'data:', err?.data);
      toastError(err?.data?.message ?? err?.data?.error ?? 'Failed to create member');
    }
  };

  const errorMessage = (() => {
    if (!error) return null;
    const e = error as any;
    // Spring Boot validation error: { errors: { fieldName: "message", ... } }
    if (e?.data?.errors && typeof e.data.errors === 'object') {
      return Object.values(e.data.errors).join(', ');
    }
    // Spring Boot business error: { message: "..." }
    if (e?.data?.message) return e.data.message;
    // Spring Boot default error body: { error: "...", path: "..." }
    if (e?.data?.error) return e.data.error;
    // Plain string body
    if (typeof e?.data === 'string' && e.data.length > 0) return e.data;
    // HTTP status fallback
    if (e?.status === 403) return 'You do not have permission to create members.';
    if (e?.status === 401) return 'Your session has expired. Please log in again.';
    if (e?.status === 409) return 'A member with this National ID already exists.';
    if (e?.status === 400) return 'Invalid data submitted. Please check all fields.';
    return 'Failed to create member. Please check your input and try again.';
  })();

  return (
    <div className="space-y-4">
      {errorMessage && <ErrorAlert message={errorMessage} />}

      {/* Config hints */}
      {config && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-xs text-blue-700 flex gap-4 flex-wrap">
          <span>Min. shares: <strong>{minShares}</strong></span>
          <span>Min. deduction: <strong>ETB {Math.max(500, minDeduction)}</strong></span>
          <span>Share price: <strong>ETB {config.sharePricePerShare}</strong></span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Personal Info */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Member Type *" error={errors.memberType?.message}>
              <select {...register('memberType')} className={inputCls}>
                <option value="">Select member type...</option>
                {/* Static default options always shown */}
                <option value="REGULAR">Regular</option>
                <option value="EXTERNAL_COOPERATIVE">Other Cooperative</option>
                {/* Dynamic options from API, skip any that duplicate the static ones */}
                {memberTypeCategories
                  .filter((cat) => cat.name !== 'REGULAR' && cat.name !== 'EXTERNAL_COOPERATIVE')
                  .map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
              </select>
            </Field>
            <Field label="First Name *" error={errors.firstName?.message}>
              <input {...register('firstName')} className={inputCls} />
            </Field>
            <Field label="Last Name *" error={errors.lastName?.message}>
              <input {...register('lastName')} className={inputCls} />
            </Field>
            <Field label="Date of Birth *" error={errors.dateOfBirth?.message}>
              <input
                type="date"
                {...register('dateOfBirth')}
                max={new Date().toISOString().split('T')[0]}
                className={inputCls}
              />
            </Field>
            <Field label="National ID *" error={errors.nationalId?.message}>
              <input {...register('nationalId')} className={inputCls} />
            </Field>
            <Field label="Phone Number *" error={errors.phoneNumber?.message}>
              <input {...register('phoneNumber')} placeholder="+251912345678" className={inputCls} />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <input type="email" {...register('email')} className={inputCls} />
            </Field>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Address</h2>
          <Field label="Address">
            <input {...register('address')} className={inputCls} placeholder="Street, City, Region" />
          </Field>
        </div>

        {/* Employment */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Employment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Employment Status *" error={errors.employmentStatus?.message}>
              <select {...register('employmentStatus')} className={inputCls}>
                <option value="">Select...</option>
                <option value="PERMANENT">Permanent</option>
                <option value="CONTRACT">Contract</option>
                <option value="PART_TIME">Part Time</option>
              </select>
            </Field>
            <Field label={`Committed Monthly Deduction (ETB, min. ${Math.max(500, minDeduction)}) *`} error={errors.committedDeduction?.message}>
              <Controller
                name="committedDeduction"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    value={field.value}
                    onChange={(v) => field.onChange(v ?? 0)}
                    className={inputCls}
                    placeholder={`min. ${Math.max(500, minDeduction).toLocaleString()}`}
                  />
                )}
              />
            </Field>
            {memberType === 'REGULAR' && (
              <Field label={`Initial Share Count (min. ${minShares})`} error={errors.shareCount?.message}>
                <input type="number"
                  {...register('shareCount', { valueAsNumber: true, setValueAs: v => v === '' || isNaN(v) ? undefined : Number(v) })}
                  className={inputCls} />
              </Field>
            )}
          </div>
        </div>

        {/* External Cooperative */}
        {memberType === 'EXTERNAL_COOPERATIVE' && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">External Cooperative</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Cooperative Name">
                <input {...register('externalCooperativeName')} className={inputCls} />
              </Field>
              <Field label="Cooperative Member ID">
                <input {...register('externalCooperativeMemberId')} className={inputCls} />
              </Field>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => router.back()}
            className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
            disabled={isLoading}>
            Cancel
          </button>
          <button type="submit" disabled={isLoading}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
            {isLoading && <LoadingSpinner size="sm" />}
            {isLoading ? 'Creating...' : 'Create Member'}
          </button>
        </div>
      </form>
    </div>
  );
}
