import { useEffect, useCallback } from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

interface ShortcutEntry {
  keys: string[];
  description: string;
}

const shortcuts: ShortcutEntry[] = [
  { keys: ['Ctrl', 'K'], description: 'Recherche rapide / Palette de commandes' },
  { keys: ['?'], description: 'Afficher les raccourcis clavier' },
  { keys: ['Ctrl', 'N'], description: 'Nouvelle recette' },
  { keys: ['Ctrl', 'I'], description: 'Nouvel ingredient' },
  { keys: ['Ctrl', 'P'], description: 'Imprimer la page' },
  { keys: ['G', 'D'], description: 'Aller au Dashboard' },
  { keys: ['G', 'R'], description: 'Aller aux Recettes' },
  { keys: ['G', 'I'], description: 'Aller aux Ingredients' },
  { keys: ['G', 'F'], description: 'Aller aux Fournisseurs' },
  { keys: ['G', 'P'], description: 'Aller au Planning' },
  { keys: ['N'], description: 'Nouveau (dans la page active)' },
  { keys: ['ESC'], description: 'Fermer modal / panneau' },
];

export default function ShortcutsModal({ open, onClose }: ShortcutsModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md mx-4 bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <Keyboard className="w-5 h-5 text-[#111111] dark:text-white" />
            <h2 className="text-base font-semibold text-[#111111] dark:text-white font-satoshi">
              Raccourcis clavier
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#6B7280] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="px-6 py-4 space-y-1">
          {shortcuts.map((shortcut, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2.5 border-b border-[#F3F4F6] dark:border-[#171717] last:border-b-0"
            >
              <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                {shortcut.description}
              </span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, ki) => (
                  <kbd
                    key={ki}
                    className="inline-flex items-center justify-center min-w-[28px] px-2 py-1 text-xs font-medium text-[#111111] dark:text-white bg-[#F3F4F6] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#262626] rounded-md"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E5E7EB] dark:border-[#1A1A1A] text-center">
          <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">
            Appuyez sur <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-[#F3F4F6] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#262626] rounded">ESC</kbd> pour fermer
          </p>
        </div>
      </div>
    </div>
  );
}
