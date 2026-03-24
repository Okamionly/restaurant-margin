import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import type { ToastType } from '../hooks/useToast';

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

  return (
    <div className={`${bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] max-w-sm animate-toast-in`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm flex-1">{message}</span>
      <button onClick={onClose} className="p-0.5 rounded hover:bg-white/20 flex-shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
