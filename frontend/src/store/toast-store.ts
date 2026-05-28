import { create } from 'zustand';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface ToastState {
  toasts: Toast[];
  addToast: (messageOrToast: string | Omit<Toast, 'id'>, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (messageOrToast, type) => {
    const id = Math.random().toString(36).slice(2);
    let toast: Omit<Toast, 'id'>;

    if (typeof messageOrToast === 'string') {
      toast = { message: messageOrToast, type: type || 'info' };
    } else {
      toast = messageOrToast;
    }

    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
