import { useEffect, useCallback, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Extra classes on the modal panel (the white card) */
  className?: string;
  /** Extra classes on the scrollable content area */
  contentClassName?: string;
}

export default function Modal({ isOpen, onClose, title, children, className = '', contentClassName = '' }: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={onClose}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      <div
        className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl my-8 animate-modal-in ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-700/80">
          <h3 id="modal-title" className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">{title}</h3>
          <button onClick={onClose} aria-label="Fermer" className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>
        <div className={`p-6 max-h-[70vh] overflow-y-auto ${contentClassName}`}>{children}</div>
      </div>
    </div>
  );
}
