import { useNavigate } from 'react-router-dom';
import { Lock, Crown, CreditCard, TrendingUp, Sparkles, Handshake, Building2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface TrialPaywallGuardProps {
  feature: string;
  children: React.ReactNode;
  /** For AI Assistant: limit to N queries. If provided, guard only blocks after limit reached */
  queryLimit?: number;
  /** Current query count (for AI Assistant gating) */
  currentQueries?: number;
}

const FEATURE_ICONS: Record<string, React.ComponentType<any>> = {
  'Assistant IA': Sparkles,
  'Intelligence financiere': TrendingUp,
  'Negociation IA': Handshake,
  'Multi-restaurant': Building2,
};

const PRO_FEATURES = [
  'Ingrédients et fiches techniques illimités',
  'Tableau de bord complet',
  'Commandes fournisseurs',
  'Assistant IA (500 requêtes par mois)',
  'Intelligence financière',
  'Négociation IA',
  'Multi-restaurant',
];

/**
 * Guards premium features behind a paywall after trial expiry.
 * Shows the children normally during active trial or paid plan.
 * Shows a paywall overlay when trial has expired and user is on basic plan.
 */
export default function TrialPaywallGuard({ feature, children, queryLimit, currentQueries }: TrialPaywallGuardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Paying users always get access
  if (user?.plan === 'pro' || user?.plan === 'business') {
    return <>{children}</>;
  }

  // If trial is still active, allow access
  if (user?.trialEndsAt) {
    const trialEnd = new Date(user.trialEndsAt);
    const now = new Date();
    if (trialEnd > now) {
      // If there's a query limit (AI Assistant), check it
      if (queryLimit !== undefined && currentQueries !== undefined && currentQueries >= queryLimit) {
        // Fall through to paywall
      } else {
        return <>{children}</>;
      }
    }
  }

  // No trialEndsAt means new user without trial set — allow access (they're in onboarding)
  if (!user?.trialEndsAt && user?.plan === 'basic') {
    return <>{children}</>;
  }

  // Trial expired + basic plan = show paywall
  const FeatureIcon = FEATURE_ICONS[feature] || Lock;

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-mono-975 dark:from-[#171717] to-white dark:to-mono-50 border-b border-mono-900 dark:border-mono-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10">
              <Lock className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-mono-100 dark:text-white">
                Fonctionnalité réservée aux abonnés
              </h2>
              <p className="text-sm text-mono-500 dark:text-mono-700 mt-0.5">
                <span className="text-red-400 font-medium">{feature}</span> n'est plus disponible — votre essai est terminé
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Feature highlight */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center">
              <FeatureIcon className="w-8 h-8 text-teal-500" />
            </div>
          </div>

          {/* Offre unique */}
          <div className="rounded-xl border-2 border-teal-500/40 bg-teal-50/50 dark:bg-teal-900/10 p-4 text-center mb-6">
            <p className="text-sm font-bold text-mono-100 dark:text-white">RestauMargin</p>
            <p className="text-2xl font-bold text-teal-500 mt-1">19 €<span className="text-sm font-normal text-mono-500"> par mois</span></p>
            <p className="text-xs text-mono-500 mt-1">Toutes les fonctionnalités, sans engagement</p>
          </div>

          {/* Features list */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-mono-500 mb-3">
              Inclus dans l'abonnement RestauMargin
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {PRO_FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                  <span className="text-sm text-mono-400 dark:text-mono-700">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate('/abonnement')}
            className="w-full py-3.5 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-base transition-colors shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            S'abonner — 19 € par mois
          </button>
          <p className="text-center text-xs text-mono-500 mt-3">
            Vos données sont conservées 30 jours. Abonnez-vous pour les retrouver.
          </p>
        </div>
      </div>
    </div>
  );
}
