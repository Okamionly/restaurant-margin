import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import Toast, { type ToastType, type ToastAction } from '../components/Toast';
import { onApiToast } from '../services/api';

export type { ToastType };

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  action?: ToastAction;
  duration?: number;
}

interface ShowToastOptions {
  action?: ToastAction;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, options?: ShowToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [successFlash, setSuccessFlash] = useState(false);

  const showToast = useCallback((message: string, type: ToastType = 'info', options?: ShowToastOptions) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type, action: options?.action, duration: options?.duration }]);
    // Trigger success celebration flash
    if (type === 'success') {
      setSuccessFlash(true);
      setTimeout(() => setSuccessFlash(false), 800);
    }
    const dismissMs = (options?.duration ?? 3000) + 1000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, dismissMs);
  }, []);

  // Bridge: listen to API-level toast events (from services/api.ts)
  const showToastRef = useRef(showToast);
  showToastRef.current = showToast;
  useEffect(() => {
    return onApiToast(({ message, type }) => {
      showToastRef.current(message, type);
    });
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {/* Success celebration flash overlay */}
      {successFlash && (
        <div className="fixed inset-0 z-[99] pointer-events-none animate-success-flash" />
      )}
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
            action={toast.action}
            duration={toast.duration}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast doit être utilisé dans un ToastProvider');
  }
  return context;
}
