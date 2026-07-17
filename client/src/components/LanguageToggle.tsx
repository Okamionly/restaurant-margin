import { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { useTranslation, AVAILABLE_LOCALES } from '../hooks/useTranslation';

/**
 * Sélecteur de langue compact pour le header.
 *
 * Usage :
 * ```tsx
 * import LanguageToggle from './components/LanguageToggle';
 * <LanguageToggle />
 * ```
 *
 * Auto-detect navigator language au 1er load (cf useTranslation.detectInitialLocale).
 *
 * Variantes :
 * - `compact` (default) : icône Globe + dropdown au clic — pour header avec peu de place
 * - `full` : flag visible + label langue — pour Settings / footer
 *
 * Style : respecte le thème W&B (zéro slate, hex directs, dark mode parity).
 */
type LanguageToggleProps = {
  variant?: 'compact' | 'full';
  className?: string;
};

export default function LanguageToggle({ variant = 'compact', className = '' }: LanguageToggleProps) {
  const { locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [open]);

  const current = AVAILABLE_LOCALES.find(l => l.code === locale) ?? AVAILABLE_LOCALES[0];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-[#737373] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${variant === 'full' ? '' : 'min-w-[44px]'}`}
        aria-label={`Change language (current: ${current.label})`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {variant === 'compact' ? (
          <>
            <Globe className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs uppercase tracking-wide">{current.code}</span>
          </>
        ) : (
          <>
            <span className="text-base leading-none" aria-hidden="true">{current.flag}</span>
            <span>{current.label}</span>
          </>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 min-w-[180px] bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl shadow-lg z-50 overflow-hidden"
          role="listbox"
        >
          {AVAILABLE_LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLocale(l.code); setOpen(false); }}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] transition-colors ${l.code === locale ? 'text-teal-600 dark:text-teal-400 font-medium' : 'text-[#111111] dark:text-white'}`}
              role="option"
              aria-selected={l.code === locale}
            >
              <span className="flex items-center gap-2.5">
                <span className="text-base leading-none" aria-hidden="true">{l.flag}</span>
                <span>{l.label}</span>
              </span>
              {l.code === locale && <Check className="w-4 h-4 text-teal-600" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
