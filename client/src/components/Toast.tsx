import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  action?: ToastAction;
  duration?: number;
}

const config: Record<ToastType, { bg: string; icon: typeof CheckCircle }> = {
  success: { bg: 'bg-green-600', icon: CheckCircle },
  error: { bg: 'bg-red-600', icon: AlertCircle },
  info: { bg: 'bg-blue-600', icon: Info },
};

export default function Toast({ message, type, onClose, action, duration }: ToastProps) {
  const { bg, icon: Icon } = config[type];
  const [exiting, setExiting] = useState(false);
  const autoDismissMs = duration ?? 3000;

  // Auto-dismiss with slide-out
  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), autoDismissMs);
    const removeTimer = setTimeout(onClose, autoDismissMs + 250);
    return () => { clearTimeout(exitTimer); clearTimeout(removeTimer); };
  }, [onClose, autoDismissMs]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(onClose, 250);
  };

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
      className={`${bg} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[280px] max-w-sm ${exiting ? 'animate-toast-slide-out' : 'animate-toast-slide-in'}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
      <span className="text-sm flex-1">{message}</span>
      {action && (
        <button
          onClick={() => {
            action.onClick();
            handleClose();
          }}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/20 hover:bg-white/30 active:scale-95 transition-all flex-shrink-0"
        >
          {action.label}
        </button>
      )}
      <button
        onClick={handleClose}
        aria-label="Fermer la notification"
        className="p-0.5 rounded hover:bg-white/20 flex-shrink-0 active:scale-90 transition-transform"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}
