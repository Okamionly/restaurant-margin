import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const config: Record<ToastType, { bg: string; icon: typeof CheckCircle }> = {
  success: { bg: 'bg-green-600', icon: CheckCircle },
  error: { bg: 'bg-red-600', icon: AlertCircle },
  info: { bg: 'bg-blue-600', icon: Info },
};

export default function Toast({ message, type, onClose }: ToastProps) {
  const { bg, icon: Icon } = config[type];
  const [exiting, setExiting] = useState(false);

  // Auto-dismiss with slide-out after 3s
  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), 3000);
    const removeTimer = setTimeout(onClose, 3250);
    return () => { clearTimeout(exitTimer); clearTimeout(removeTimer); };
  }, [onClose]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(onClose, 250);
  };

  return (
    <div className={`${bg} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[280px] max-w-sm ${exiting ? 'animate-toast-slide-out' : 'animate-toast-slide-in'}`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm flex-1">{message}</span>
      <button onClick={handleClose} className="p-0.5 rounded hover:bg-white/20 flex-shrink-0 active:scale-90 transition-transform">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
