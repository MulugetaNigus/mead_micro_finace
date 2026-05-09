'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLoginMutation } from '@/features/auth/authApi';
import { useAppDispatch } from '@/lib/store/hooks';
import { setCredentials } from '@/features/auth/authSlice';
import { ROUTES } from '@/constants/app';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMessage('');
      const response = await login(data).unwrap();
      const user = {
        id: '',
        username: response.username,
        fullName: response.username,
        email: '',
        roles: response.roles,
        active: true,
      };
      dispatch(setCredentials({ user, token: response.token }));
      document.cookie = `auth_token=${response.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
      router.push(ROUTES.DASHBOARD);
    } catch (error: any) {
      setErrorMessage(error?.data?.message || 'Invalid username or password.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      {/* Modal panel with professional design */}
      <div
        className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 20px 60px rgba(10, 46, 92, 0.15)',
        }}
      >
        {/* Header with brand color */}
        <div
          className="px-8 pt-8 pb-6"
          style={{
            backgroundColor: '#0A2E5C',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div>
            <h2
              className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: 'Poppins' }}
            >
              Member Login
            </h2>
            <p className="text-white/70 text-sm">
              Access your Ma&apos;ed Cooperative account
            </p>
          </div>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-8 space-y-6">
          {/* Error message */}
          {errorMessage && (
            <div
              className="p-4 rounded-lg text-sm font-medium border"
              style={{
                backgroundColor: 'rgba(218, 41, 28, 0.05)',
                borderColor: '#DA291C',
                color: '#DA291C',
              }}
            >
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Username field */}
          <div>
            <label htmlFor="modal-username" className="block text-sm font-semibold text-gray-900 mb-2">
              Username
            </label>
            <input
              {...register('username')}
              id="modal-username"
              type="text"
              autoComplete="username"
              className={`w-full px-4 py-2.5 text-sm border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                errors.username
                  ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-50'
              }`}
              style={{
                backgroundColor: '#FFFFFF',
              }}
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-xs font-medium mt-1.5" style={{ color: '#DA291C' }}>
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="modal-password" className="block text-sm font-semibold text-gray-900 mb-2">
              Password
            </label>
            <input
              {...register('password')}
              id="modal-password"
              type="password"
              autoComplete="current-password"
              className={`w-full px-4 py-2.5 text-sm border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                errors.password
                  ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-50'
              }`}
              style={{
                backgroundColor: '#FFFFFF',
              }}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-xs font-medium mt-1.5" style={{ color: '#DA291C' }}>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Sign in button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-sm font-semibold text-white rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: '#0A2E5C',
              focusRingColor: '#0A2E5C',
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#1A4A8A';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#0A2E5C';
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Footer */}
        <div
          className="px-8 py-6 border-t"
          style={{
            backgroundColor: '#F8F9FA',
            borderTopColor: '#E5E7EB',
          }}
        >
          <p className="text-center text-xs text-gray-600">
            Don&apos;t have access?{' '}
            <a
              href="mailto:info@maedcoop.et"
              className="font-semibold transition-colors duration-200"
              style={{ color: '#0A2E5C' }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
