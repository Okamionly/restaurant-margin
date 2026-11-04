import { useEffect, useCallback } from 'react';
import { X, Check, Lock } from 'lucide-react';

interface PaywallModalProps {
  feature: string;
  onClose: () => void;
  onUpgrade: () => void;
}

const planFeatures = [
  'Ingrédients et fiches techniques illimités',
  'Tableau de bord et suivi des marges',
  'Commandes fournisseurs',
  'Mercuriale et alertes de prix',
  'Multi-restaurant',
  'Assistant IA (500 requêtes par mois)',
];

export default function PaywallModal({ feature, onClose, onUpgrade }: PaywallModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Card */}
      <div
        className="relative bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-300/80 rounded-2xl shadow-2xl w-full max-w-lg animate-modal-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-mono-975 dark:from-mono-300 to-white dark:to-mono-50 border-b border-mono-900 dark:border-mono-300/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-mono-100 dark:text-white">
                Abonnement RestauMargin requis
              </h3>
              <p className="text-sm text-mono-700 mt-0.5">
                <span className="text-amber-400 font-medium">{feature}</span> est inclus dans l'abonnement RestauMargin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-mono-900 dark:hover:bg-mono-350 transition-colors"
          >
            <X className="w-5 h-5 text-mono-700" />
          </button>
        </div>

        {/* Offre unique */}
        <div className="p-6">
          <div className="rounded-xl border-2 border-teal-500/40 bg-gradient-to-b from-teal-100 dark:from-teal-900/20 to-mono-975 dark:to-mono-300/50 p-4 mb-6">
            <div className="text-center mb-4">
              <h4 className="text-xl font-bold text-mono-100 dark:text-white">RestauMargin</h4>
              <p className="text-2xl font-bold text-teal-400 mt-1">19 €<span className="text-sm font-normal text-teal-400/70"> par mois</span></p>
              <p className="text-xs text-mono-500 mt-1">Toutes les fonctionnalités, sans engagement</p>
            </div>
            <div className="space-y-2.5">
              {planFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span className="text-sm text-mono-700">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={onUpgrade}
              className="w-full py-3.5 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-base transition-colors shadow-lg shadow-teal-500/20"
            >
              S'abonner — 19 € par mois
            </button>
            <button
              onClick={onClose}
              className="text-sm text-mono-500 hover:text-mono-800 transition-colors py-1"
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
