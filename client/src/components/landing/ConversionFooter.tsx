/**
 * @file client/src/components/landing/ConversionFooter.tsx
 * Final section before footer — concentrates conversion signals :
 *   1. Trust badges row (5 badges: SSL, Made in France, Support 7j/7, RGPD, Sans CB)
 *   2. Final CTA banner with email capture inline
 *   3. Footer 4 cols + RGPD line + status
 *
 * Replaces the old standalone newsletter + contact form sections.
 * Newsletter capture is now inline at the bottom of the page so visitors
 * either click the CTA OR drop their email — both fire conversions.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  MapPin,
  Headphones,
  FileCheck,
  CreditCard,
  ArrowRight,
  Mail,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

const ACCENT = '#10B981';
const ACCENT_DARK = '#047857';

const TRUST_BADGES = [
  { icon: ShieldCheck, title: 'Données sécurisées', sub: 'Chiffrement SSL/TLS' },
  { icon: MapPin, title: 'Made in France', sub: 'Hébergé en Europe' },
  { icon: Headphones, title: 'Support 7j/7', sub: 'Réponse sous 24h' },
  { icon: FileCheck, title: 'RGPD Conforme', sub: 'Vos données vous appartiennent' },
  { icon: CreditCard, title: 'Essai sans CB', sub: '14 jours gratuits' },
];

export default function ConversionFooter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Email invalide');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setStatus('success');
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur réseau');
      setStatus('error');
    }
  };

  return (
    <>
      {/* ═══════════════════════ TRUST BADGES ═══════════════════════ */}
      <section className="bg-white border-t border-[#E5E7EB] py-16 px-6" aria-label="Garanties RestauMargin">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          {TRUST_BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.title} className="text-center">
                <div
                  className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3"
                  style={{ background: '#ECFDF5', color: ACCENT_DARK }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-[#0F172A]">{badge.title}</p>
                <p className="text-xs text-[#64748B] mt-1">{badge.sub}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════ FINAL CTA BANNER ═══════════════════════ */}
      <section
        className="relative py-24 px-6 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${ACCENT_DARK} 0%, ${ACCENT} 50%, ${ACCENT_DARK} 100%)`,
        }}
      >
        {/* Subtle radial highlight */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, transparent 60%)',
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Prêt à reprendre le contrôle de vos marges ?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Essai gratuit 14 jours · Sans carte bancaire · Annulation à tout moment.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-[#0F172A] font-bold text-base shadow-2xl hover:scale-[1.03] active:scale-[0.97] transition-transform"
            >
              Commencer maintenant <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/booking-demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/40 text-white font-bold text-base hover:bg-white/10 transition-colors"
            >
              Réserver une démo
            </Link>
          </div>

          {/* Inline newsletter — last-chance capture */}
          <div className="mt-12 max-w-md mx-auto">
            <p className="text-sm text-white/70 mb-3">Pas encore prêt ? Recevez nos conseils marge :</p>
            {status === 'success' ? (
              <div className="flex items-center justify-center gap-2 text-white font-semibold py-3">
                <CheckCircle2 className="w-5 h-5" />
                Inscrit ! Vérifiez votre email.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    aria-label="Email pour newsletter"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:border-white focus:bg-white/25 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 py-3 rounded-xl bg-white text-[#0F172A] font-bold hover:bg-white/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Envoi...
                    </>
                  ) : (
                    "S'inscrire"
                  )}
                </button>
              </form>
            )}
            {status === 'error' && error && (
              <p className="text-sm text-red-100 mt-2" role="alert">
                {error}
              </p>
            )}
            <p className="text-xs text-white/50 mt-2">
              Pas de spam. Désinscription en un clic.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FOOTER 4 COLS ═══════════════════════ */}
      <footer className="bg-[#0F172A] text-white/70 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <p className="text-white font-bold text-lg">RestauMargin</p>
            <p className="text-sm text-white/50 mt-2">
              Le logiciel de marges pensé pour les restaurateurs français.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
              />
              <span className="text-white/60">Serveurs opérationnels</span>
            </div>
          </div>

          <div>
            <p className="text-white font-bold text-sm uppercase tracking-wider mb-4">Produit</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/fonctionnalites" className="hover:text-white">Fonctionnalités</Link></li>
              <li><Link to="/tarifs" className="hover:text-white">Tarifs</Link></li>
              <li><Link to="/temoignages" className="hover:text-white">Témoignages</Link></li>
              <li><Link to="/comment-ca-marche" className="hover:text-white">Comment ça marche</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-white font-bold text-sm uppercase tracking-wider mb-4">Ressources</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link to="/outils/calculateur-food-cost" className="hover:text-white">Calculateur food cost</Link></li>
              <li><Link to="/outils/generateur-qr-menu" className="hover:text-white">Générateur QR menu</Link></li>
              <li><Link to="/booking-demo" className="hover:text-white">Réserver une démo</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-white font-bold text-sm uppercase tracking-wider mb-4">Légal</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/cgu" className="hover:text-white">CGU</Link></li>
              <li><Link to="/politique-confidentialite" className="hover:text-white">Politique de confidentialité</Link></li>
              <li><Link to="/securite" className="hover:text-white">Sécurité</Link></li>
              <li><a href="mailto:contact@restaumargin.fr" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} RestauMargin · Hébergé en Europe · RGPD
          </p>
          <p className="text-xs text-white/40">
            Made with care in France 🇫🇷
          </p>
        </div>
      </footer>
    </>
  );
}
