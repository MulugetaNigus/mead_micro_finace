'use client';

import { useEffect, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

// Global singleton — components call these directly without hooks
let _addToast: ((msg: string, type: ToastType) => void) | null = null;

export const toastSuccess = (msg: string) => _addToast?.(msg, 'success');
export const toastError   = (msg: string) => _addToast?.(msg, 'error');
export const toastWarning = (msg: string) => _addToast?.(msg, 'warning');
export const toastInfo    = (msg: string) => _addToast?.(msg, 'info');

// Legacy alias
export const toast = (msg: string, type: ToastType = 'info') => _addToast?.(msg, type);

// ─── Styles ────────────────────────────────────────────────────────────────

const STYLES: Record<ToastType, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  success: {
    bg: 'bg-white',
    border: 'border-green-400',
    text: 'text-gray-800',
    icon: (
      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    progress: 'bg-green-400',
  },
  error: {
    bg: 'bg-white',
    border: 'border-red-400',
    text: 'text-gray-800',
    icon: (
      <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    progress: 'bg-red-400',
  },
  warning: {
    bg: 'bg-white',
    border: 'border-amber-400',
    text: 'text-gray-800',
    icon: (
      <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    progress: 'bg-amber-400',
  },
  info: {
    bg: 'bg-white',
    border: 'border-blue-400',
    text: 'text-gray-800',
    icon: (
      <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    progress: 'bg-blue-400',
  },
} as any;

const DURATION = 4000; // ms

// ─── Single Toast ──────────────────────────────────────────────────────────

function ToastItem({ item, onRemove }: { item: ToastItem; onRemove: (id: number) => void }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const s = STYLES[item.type];

  // Slide in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Progress bar countdown
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Auto-dismiss
  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(item.id), 300);
    }, DURATION);
    return () => clearTimeout(t);
  }, [item.id, onRemove]);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border shadow-lg min-w-[280px] max-w-sm transition-all duration-300 ${s.bg} ${s.border} ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}
    >
      {/* Content */}
      <div className="flex items-start gap-3 px-4 py-3">
        {s.icon}
        <p className={`text-sm font-medium flex-1 leading-snug ${s.text}`}>{item.message}</p>
        <button
          onClick={() => { setVisible(false); setTimeout(() => onRemove(item.id), 300); }}
          className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0 mt-0.5"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-gray-100">
        <div
          className={`h-full transition-none ${(s as any).progress}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ─── Container ─────────────────────────────────────────────────────────────

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    _addToast = addToast;
    return () => { _addToast = null; };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem item={t} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
}
