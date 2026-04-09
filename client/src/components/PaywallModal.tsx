import { useEffect, useCallback } from 'react';
import { X, Check, Lock, Crown, Zap, Building2, Mic, BarChart3, ShieldCheck, Headphones } from 'lucide-react';

interface PaywallModalProps {
  feature: string;
  onClose: () => void;
  onUpgrade: () => void;
}

const businessAdvantages = [
  { icon: Building2, label: 'Multi-restaurant illimite' },
  { icon: Mic, label: 'Commande vocale IA' },
  { icon: BarChart3, label: 'Mercuriale avancee + alertes prix' },
  { icon: Zap, label: 'Automatisations & workflows' },
  { icon: ShieldCheck, label: 'HACCP complet + audit trail' },
  { icon: Headphones, label: 'Support prioritaire 24/7' },
];

const planFeatures = [
  { name: 'Ingredients & recettes', pro: true, business: true },
  { name: 'Fiches techniques', pro: true, business: true },
  { name: 'Tableau de bord', pro: true, business: true },
  { name: 'Commandes fournisseurs', pro: true, business: true },
  { name: 'Multi-restaurant', pro: false, business: true },
  { name: 'Commande vocale IA', pro: false, business: true },
  { name: 'Mercuriale avancee', pro: false, business: true },
  { name: 'Automatisations', pro: false, business: true },
  { name: 'HACCP complet', pro: false, business: true },
  { name: 'Support prioritaire', pro: false, business: true },
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
        className="relative bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#262626]/80 rounded-2xl shadow-2xl w-full max-w-3xl animate-modal-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-[#F5F5F5] dark:from-[#262626] to-white dark:to-[#0A0A0A] border-b border-[#E5E7EB] dark:border-[#262626]/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111111] dark:text-white">
                Fonctionnalite Business requise
              </h3>
              <p className="text-sm text-[#A3A3A3] mt-0.5">
                <span className="text-amber-400 font-medium">{feature}</span> n'est pas disponible dans votre plan Pro
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#E5E7EB] dark:hover:bg-[#404040] transition-colors"
          >
            <X className="w-5 h-5 text-[#A3A3A3]" />
          </button>
        </div>

        {/* Comparison */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Pro column */}
            <div className="rounded-xl border border-[#E5E7EB] dark:border-[#262626]/60 bg-[#F5F5F5] dark:bg-[#262626]/50 p-4">
              <div className="text-center mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#737373]">Votre plan</span>
                <h4 className="text-xl font-bold text-[#111111] dark:text-white mt-1">Pro</h4>
                <p className="text-2xl font-bold text-[#A3A3A3] mt-1">29<span className="text-sm font-normal">/mois</span></p>
              </div>
              <div className="space-y-2.5">
                {planFeatures.map((f) => (
                  <div key={f.name} className="flex items-center gap-2.5">
                    {f.pro ? (
                      <Check className="w-4 h-4 text-[#737373] flex-shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-red-400/60 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        f.pro
                          ? 'text-[#A3A3A3]'
                          : f.name === feature
                            ? 'text-red-400 font-medium line-through'
                            : 'text-[#525252] line-through'
                      }`}
                    >
                      {f.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Business column */}
            <div className="rounded-xl border-2 border-teal-500/40 bg-gradient-to-b from-teal-100 dark:from-teal-900/20 to-[#F5F5F5] dark:to-[#262626]/50 p-4 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 rounded-full bg-teal-500 text-xs font-bold text-white uppercase tracking-wider">
                  Recommande
                </span>
              </div>
              <div className="text-center mb-4 mt-1">
                <div className="flex items-center justify-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">Upgrade</span>
                </div>
                <h4 className="text-xl font-bold text-[#111111] dark:text-white mt-1">Business</h4>
                <p className="text-2xl font-bold text-teal-400 mt-1">79<span className="text-sm font-normal text-teal-400/70">/mois</span></p>
              </div>
              <div className="space-y-2.5">
                {planFeatures.map((f) => (
                  <div key={f.name} className="flex items-center gap-2.5">
                    <Check
                      className={`w-4 h-4 flex-shrink-0 ${
                        f.business && !f.pro ? 'text-teal-400' : 'text-[#737373]'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        f.business && !f.pro
                          ? f.name === feature
                            ? 'text-teal-300 font-semibold'
                            : 'text-teal-400 font-medium'
                          : 'text-[#A3A3A3]'
                      }`}
                    >
                      {f.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Business advantages */}
          <div className="bg-[#262626]/40 rounded-xl p-4 mb-6 border border-[#262626]/40">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#737373] mb-3">
              Tout ce que Business inclut en plus
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {businessAdvantages.map((adv) => (
                <div key={adv.label} className="flex items-center gap-2.5">
                  <adv.icon className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span className="text-sm text-[#D4D4D4]">{adv.label}</span>
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
              Passer a Business — 79/mois
            </button>
            <button
              onClick={onClose}
              className="text-sm text-[#737373] hover:text-[#D4D4D4] transition-colors py-1"
            >
              Rester en Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
