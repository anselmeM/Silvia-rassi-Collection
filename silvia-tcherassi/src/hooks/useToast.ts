import { useCallback } from 'react';
import { useUIStore } from '@/store/uiStore';
import type { ToastMessage } from '@/types';

export function useToast() {
  const { addToast: add, removeToast, toasts } = useUIStore();

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    add(message, type);
  }, [add]);

  const success = useCallback((message: string) => {
    add(message, 'success');
  }, [add]);

  const error = useCallback((message: string) => {
    add(message, 'error');
  }, [add]);

  const info = useCallback((message: string) => {
    add(message, 'info');
  }, [add]);

  const dismiss = useCallback((id: string) => {
    removeToast(id);
  }, [removeToast]);

  return {
    toasts,
    showToast,
    success,
    error,
    info,
    dismiss,
  };
}
