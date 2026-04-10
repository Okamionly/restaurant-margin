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
    <div className="fixed inset-0 z-50 flex items-start justify-center p-0 sm:p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={onClose}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      <div
        className={`relative bg-white dark:bg-[#262626] sm:rounded-2xl shadow-2xl w-full max-w-2xl sm:my-8 min-h-screen sm:min-h-0 animate-modal-in ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#E5E7EB]/80 dark:border-[#262626]/80 sticky top-0 bg-white dark:bg-[#262626] z-10">
          <h3 id="modal-title" className="text-lg font-bold tracking-tight text-[#111111] dark:text-white">{title}</h3>
          <button onClick={onClose} aria-label="Fermer" className="p-1.5 rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#262626] transition-colors">
            <X className="w-5 h-5 text-[#737373] dark:text-[#A3A3A3]" />
          </button>
        </div>
        <div className={`p-4 sm:p-6 max-h-[calc(100vh-4rem)] sm:max-h-[70vh] overflow-y-auto ${contentClassName}`}>{children}</div>
      </div>
    </div>
  );
}
