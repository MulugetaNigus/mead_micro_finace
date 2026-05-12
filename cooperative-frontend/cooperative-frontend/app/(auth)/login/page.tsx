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
import Link from 'next/link';

// Validation schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function FloatingOrb({ delay = 0, style }: { delay?: number; style?: React.CSSProperties }) {
  return (
    <div
      className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-blue-400/10 to-cyan-400/5 floating-orb"
      style={{ animationDelay: `${delay}s`, ...style }}
    />
  );
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

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
      console.error('Login error:', error);
      setErrorMessage(
        error?.data?.message || 'Invalid username or password. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Background decorations */}
      <FloatingOrb delay={0} style={{ top: '10%', left: '15%' }} />
      <FloatingOrb delay={2} style={{ top: '60%', right: '10%', width: '20rem', height: '20rem' }} />
      <FloatingOrb delay={4} style={{ bottom: '20%', left: '60%', width: '16rem', height: '16rem' }} />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230A2E5C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-lg px-4">
        {/* Logo/Title */}
        <div className="text-center mb-8 animate-fade-in-up">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#0A2E5C] to-[#1A4A8A] shadow-lg shadow-blue-900/20 group-hover:shadow-blue-900/30 transition-shadow duration-300">
              <span className="text-white font-bold text-2xl" style={{ fontFamily: 'Poppins' }}>M</span>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>
                Ma'ed Cooperative
              </h1>
              <p className="text-sm text-gray-500 font-medium">Management System</p>
            </div>
          </Link>

          <h2 className="text-xl font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Poppins' }}>
            Welcome back!
          </h2>
          <p className="text-sm text-gray-500">
            Sign in to access your cooperative management dashboard
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-900/5 border border-gray-200/60 p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50/80 border border-red-200/60 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-shake">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errorMessage}
              </div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  {...register('username')}
                  id="username"
                  type="text"
                  autoComplete="username"
                  className={`w-full pl-11 pr-4 py-3 text-sm bg-gray-50/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 placeholder-gray-400 ${
                    errors.username ? 'border-red-300 bg-red-50/30' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`w-full pl-11 pr-12 py-3 text-sm bg-gray-50/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 placeholder-gray-400 ${
                    errors.password ? 'border-red-300 bg-red-50/30' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[#0A2E5C] to-[#1A4A8A] rounded-xl hover:shadow-xl hover:shadow-blue-900/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-sm text-gray-500 mb-1">
            Don't have an account?{' '}
            <Link href="/" className="text-[#0A2E5C] font-semibold hover:text-[#1A4A8A] transition-colors">
              Contact your administrator
            </Link>
          </p>
          <p className="text-xs text-gray-400 mt-3">
            &copy; {new Date().getFullYear()} Ma'ed Cooperative. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

