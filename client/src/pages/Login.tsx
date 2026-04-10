import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ChefHat, Mail, Lock, User, ArrowLeft, TrendingUp, Brain, Shield, Clock, CheckCircle2, Users, Store, Eye, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { checkFirstUser } from '../services/api';
import { useTranslation } from '../hooks/useTranslation';
import { useToast } from '../hooks/useToast';
import { trackEvent } from '../utils/analytics';

export default function Login() {
  const { t } = useTranslation();
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [isRegisterMode, setIsRegisterMode] = useState(searchParams.get('mode') === 'register');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
  const [verifiedSuccess, setVerifiedSuccess] = useState('');
  const [isFirstUser, setIsFirstUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [acceptCgu, setAcceptCgu] = useState(false);
  const [referralCode] = useState(searchParams.get('ref') || '');

  useEffect(() => {
    document.title = 'Connexion \u2014 RestauMargin';
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    checkFirstUser().then((first) => {
      setIsFirstUser(first);
      if (first) setIsRegisterMode(true);
    });
    // Auto-switch to register mode if referral code present
    if (searchParams.get('ref')) setIsRegisterMode(true);
  }, []);

  // Handle Google OAuth token from URL → auto-login
  useEffect(() => {
    const oauthToken = searchParams.get('token');
    if (oauthToken) {
      // Store token and let AuthProvider pick it up → triggers isAuthenticated redirect
      localStorage.setItem('token', oauthToken);
      trackEvent('login', { method: 'google' });
      // Force page reload so AuthProvider re-checks token from localStorage
      window.location.replace('/dashboard');
      return;
    }
    // Handle Google OAuth errors
    const oauthError = searchParams.get('error');
    if (oauthError) {
      const errorMessages: Record<string, string> = {
        google_no_code: 'Connexion Google annulee.',
        google_not_configured: 'Connexion Google non disponible pour le moment.',
        google_token_failed: 'Erreur de connexion Google. Veuillez reessayer.',
        google_no_email: 'Impossible de recuperer votre email Google.',
        google_failed: 'Erreur lors de la connexion Google.',
      };
      setError(errorMessages[oauthError] || 'Erreur de connexion Google.');
    }
  }, [searchParams]);

  // Handle email verification token from URL
  useEffect(() => {
    const verifyToken = searchParams.get('verify');
    if (verifyToken) {
      fetch(`/api/auth/verify-email?token=${verifyToken}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setVerifiedSuccess(t('login.emailVerified'));
          } else {
            setError(data.error || t('login.invalidToken'));
          }
        })
        .catch(() => setError(t('login.verificationError')));
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (isRegisterMode && !acceptCgu) {
      setError(t('login.mustAcceptCgu'));
      return;
    }

    setLoading(true);
    try {
      if (isRegisterMode) {
        await register({ email, password, name: restaurantName || name || email.split('@')[0], restaurantName: restaurantName || undefined });
        trackEvent('sign_up');
        // Google Ads conversion tracking
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'sign_up', { method: 'email' });
        }
        // Meta Pixel conversion tracking
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Lead');
        }
        // Apply referral code if present
        if (referralCode) {
          try {
            const token = localStorage.getItem('token');
            await fetch('/api/referrals/apply', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ referralCode }),
            });
          } catch (err) {
            // Referral system not yet available — silently ignore
            console.warn('Referral apply failed (non-blocking):', err);
          }
        }
        showToast('Bienvenue ! Votre essai gratuit de 7 jours commence maintenant.', 'success');
      } else {
        await login({ email, password });
        trackEvent('login');
      }
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('login.connectionError');
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setForgotPasswordSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur');
      }
      setForgotPasswordSuccess(t('login.resetEmailSent'));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('login.requestError');
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#000000] flex">
      {/* Left panel - hidden on mobile, visible md+ */}
      <div className="hidden md:flex md:w-1/2 lg:w-[55%] bg-[#000000] border-r border-[#222222] flex-col justify-center items-center p-12">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-[#000000]" />
            </div>
            <h1 className="text-4xl font-bold text-white">RestauMargin</h1>
          </div>
          <p className="text-xl text-white/60 mb-12">{t('login.tagline')}</p>

          {/* 3 value props */}
          <div className="space-y-6 text-left">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{t('login.feature1Title')}</h3>
                <p className="text-white/40 text-sm">{t('login.feature1Desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{t('login.feature2Title')}</h3>
                <p className="text-white/40 text-sm">{t('login.feature2Desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{t('login.feature3Title')}</h3>
                <p className="text-white/40 text-sm">{t('login.feature3Desc')}</p>
              </div>
            </div>
          </div>

          {/* Social proof */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
              <Users className="w-4 h-4" />
              <span>150+ restaurants nous font confiance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-[#000000]">
        {/* Large logo at top - always visible */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-[#000000]" />
          </div>
          <span className="text-2xl font-bold text-white">RestauMargin</span>
        </div>

        <div className="w-full max-w-md">
          {/* Prominent badges - always visible */}
          {!isForgotPassword && (
            <div className="mb-6 text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#000000] text-sm font-bold">
                <Clock className="w-4 h-4" />
                Essai gratuit 7 jours
              </div>
              <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
                <Users className="w-4 h-4" />
                <span>150+ restaurants nous font confiance</span>
              </div>
            </div>
          )}

          {/* Form card */}
          <div className="bg-[#111111] border border-[#222222] rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">
              {isForgotPassword ? t('login.forgotPassword') : isRegisterMode ? t('login.createAccount') : t('login.title')}
            </h2>

            {error && (
              <div className="bg-[#1a0000] border border-[#441111] rounded-lg p-3 mb-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {forgotPasswordSuccess && (
              <div className="bg-[#001a00] border border-[#114411] rounded-lg p-3 mb-4 text-sm text-green-400">
                {forgotPasswordSuccess}
              </div>
            )}

            {verifiedSuccess && (
              <div className="bg-[#001a00] border border-[#114411] rounded-lg p-3 mb-4 text-sm text-green-400">
                {verifiedSuccess}
              </div>
            )}

            {isForgotPassword ? (
              <>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">{t('login.email')}</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#000000] border border-[#333333] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white hover:bg-white/90 text-[#000000] font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? t('common.loading') : t('login.sendResetLink')}
                  </button>
                </form>
                <div className="mt-4 text-center">
                  <button
                    onClick={() => { setIsForgotPassword(false); setError(''); setForgotPasswordSuccess(''); }}
                    className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-white hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    {t('login.backToLogin')}
                  </button>
                </div>
              </>
            ) : (
              <>
                {isFirstUser && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-4 text-sm text-white/70">
                    {t('login.firstUserMessage')}
                  </div>
                )}

                {referralCode && isRegisterMode && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-4 text-sm text-white/70 flex items-center gap-2">
                    <span className="text-lg">*</span>
                    Vous avez ete parraine ! Le code <strong className="font-mono">{referralCode}</strong> sera applique a votre compte.
                  </div>
                )}

                {/* OAuth buttons */}
                <div className="space-y-3 mb-2">
                  <a
                    href="/api/auth/google"
                    className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white hover:bg-white/95 text-[#111111] font-semibold text-sm rounded-xl border border-[#E5E7EB] transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continuer avec Google
                  </a>
                  <button
                    type="button"
                    onClick={() => showToast('Connexion Apple bientot disponible — utilisez votre email pour l\'instant', 'info')}
                    className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-[#000000] hover:bg-[#1a1a1a] text-white font-semibold text-sm rounded-xl border border-[#333333] transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    Continuer avec Apple
                  </button>
                </div>

                {/* Separator */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-[#333333]" />
                  <span className="text-xs text-white/30 font-medium uppercase tracking-wider">ou</span>
                  <div className="flex-1 h-px bg-[#333333]" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="login-email" className="block text-sm font-medium text-white/70 mb-1">{t('login.email')}</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        id="login-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-label="Adresse email"
                        className="w-full bg-[#000000] border border-[#333333] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="login-password" className="block text-sm font-medium text-white/70 mb-1">{t('login.password')}</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        id="login-password"
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-label="Mot de passe"
                        className="w-full bg-[#000000] border border-[#333333] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                        placeholder="........"
                      />
                    </div>
                    {!isRegisterMode && (
                      <div className="text-right mt-1">
                        <button
                          type="button"
                          onClick={() => { setIsForgotPassword(true); setError(''); }}
                          className="text-xs text-white/50 hover:text-white hover:underline"
                        >
                          {t('login.forgotPasswordLink')}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Restaurant name — only in register mode */}
                  {isRegisterMode && (
                    <div>
                      <label htmlFor="register-restaurant" className="block text-sm font-medium text-white/70 mb-1">Nom du restaurant</label>
                      <div className="relative">
                        <Store className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                          id="register-restaurant"
                          type="text"
                          required
                          value={restaurantName}
                          onChange={(e) => setRestaurantName(e.target.value)}
                          aria-label="Nom du restaurant"
                          className="w-full bg-[#000000] border border-[#333333] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                          placeholder="Le Bistrot de Marie"
                        />
                      </div>
                    </div>
                  )}

                  {/* CGU checkbox - only in register mode */}
                  {isRegisterMode && (
                    <label className="flex items-start gap-3 text-sm text-white/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptCgu}
                        onChange={(e) => setAcceptCgu(e.target.checked)}
                        className="mt-0.5 rounded border-[#333333] bg-[#000000] text-white focus:ring-white/50"
                      />
                      <span>
                        {t('login.acceptCgu1')}{' '}
                        <a href="/cgu" target="_blank" className="text-white/70 hover:text-white underline">
                          {t('login.cguLink')}
                        </a>{' '}
                        {t('login.acceptCgu2')}{' '}
                        <a href="/politique-confidentialite" target="_blank" className="text-white/70 hover:text-white underline">
                          {t('login.privacyLink')}
                        </a>
                      </span>
                    </label>
                  )}

                  <button
                    type="submit"
                    disabled={loading || (isRegisterMode && !acceptCgu)}
                    className="w-full bg-white hover:bg-white/90 text-[#000000] font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? t('common.loading') : isRegisterMode ? t('login.register') : t('login.signIn')}
                  </button>
                </form>

                {/* Trust badges - only in register mode */}
                {isRegisterMode && !isFirstUser && (
                  <div className="mt-5 pt-5 border-t border-[#222222]">
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/40">
                      <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Sans carte bancaire</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Sans engagement</span>
                      <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Annulez quand vous voulez</span>
                    </div>
                  </div>
                )}

                {!isFirstUser && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => {
                        setIsRegisterMode(!isRegisterMode);
                        setError('');
                        setAcceptCgu(false);
                      }}
                      className="text-sm text-white/50 hover:text-white hover:underline"
                    >
                      {isRegisterMode ? t('login.alreadyHaveAccount') : t('login.noAccount')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Demo CTA */}
          <div className="mt-5">
            <Link
              to="/demo"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#333333] text-white/70 hover:text-white hover:border-white/40 font-medium text-sm transition-all"
            >
              <Eye className="w-4 h-4" />
              Voir la demo sans compte
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Footer links */}
          <div className="mt-6 text-center text-sm text-white/30">
            <a href="/cgu" className="hover:text-white/60">{t('login.cgu')}</a>
            <span className="mx-2">&middot;</span>
            <a href="/politique-confidentialite" className="hover:text-white/60">{t('login.privacy')}</a>
            <span className="mx-2">&middot;</span>
            <a href="/mentions-legales" className="hover:text-white/60">{t('login.legalNotice')}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
