import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChefHat, Mail, Lock, User, ArrowLeft, TrendingUp, Brain, Shield, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { checkFirstUser } from '../services/api';
import { useTranslation } from '../hooks/useTranslation';
import { trackEvent } from '../utils/analytics';

export default function Login() {
  const { t } = useTranslation();
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
  const [acceptCgu, setAcceptCgu] = useState(false);
  const [referralCode] = useState(searchParams.get('ref') || '');

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
        await register({ email, password, name });
        trackEvent('sign_up');
        // Apply referral code if present
        if (referralCode) {
          try {
            const token = localStorage.getItem('token');
            await fetch('/api/referrals/apply', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ referralCode }),
            });
          } catch {}
        }
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
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left panel - hidden on mobile, visible md+ */}
      <div className="hidden md:flex md:w-1/2 lg:w-[55%] bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 flex-col justify-center items-center p-12">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <ChefHat className="w-12 h-12 text-teal-400" />
            <h1 className="text-4xl font-bold text-white">RestauMargin</h1>
          </div>
          <p className="text-xl text-teal-200 mb-12">{t('login.tagline')}</p>

          {/* 3 value props */}
          <div className="space-y-6 text-left">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{t('login.feature1Title')}</h3>
                <p className="text-slate-400 text-sm">{t('login.feature1Desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{t('login.feature2Title')}</h3>
                <p className="text-slate-400 text-sm">{t('login.feature2Desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{t('login.feature3Title')}</h3>
                <p className="text-slate-400 text-sm">{t('login.feature3Desc')}</p>
              </div>
            </div>
          </div>

          {/* Social proof */}
          <div className="mt-12 pt-8 border-t border-slate-700/50">
            <p className="text-slate-400 text-sm">{t('login.socialProof')}</p>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
        {/* Mobile logo */}
        <div className="md:hidden flex items-center gap-2 mb-8">
          <ChefHat className="w-8 h-8 text-teal-400" />
          <span className="text-2xl font-bold text-white">RestauMargin</span>
        </div>

        <div className="w-full max-w-md">
          {/* Form card */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">
              {isForgotPassword ? t('login.forgotPassword') : isRegisterMode ? t('login.createAccount') : t('login.title')}
            </h2>

            {error && (
              <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 mb-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {forgotPasswordSuccess && (
              <div className="bg-green-900/30 border border-green-800 rounded-lg p-3 mb-4 text-sm text-green-300">
                {forgotPasswordSuccess}
              </div>
            )}

            {verifiedSuccess && (
              <div className="bg-green-900/30 border border-green-800 rounded-lg p-3 mb-4 text-sm text-green-300">
                {verifiedSuccess}
              </div>
            )}

            {isForgotPassword ? (
              <>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">{t('login.email')}</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? t('common.loading') : t('login.sendResetLink')}
                  </button>
                </form>
                <div className="mt-4 text-center">
                  <button
                    onClick={() => { setIsForgotPassword(false); setError(''); setForgotPasswordSuccess(''); }}
                    className="inline-flex items-center gap-1 text-sm text-teal-400 hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    {t('login.backToLogin')}
                  </button>
                </div>
              </>
            ) : (
              <>
                {isFirstUser && (
                  <div className="bg-teal-900/30 border border-teal-800 rounded-lg p-3 mb-4 text-sm text-teal-300">
                    {t('login.firstUserMessage')}
                  </div>
                )}

                {referralCode && isRegisterMode && (
                  <div className="bg-amber-900/30 border border-amber-800 rounded-lg p-3 mb-4 text-sm text-amber-300 flex items-center gap-2">
                    <span className="text-amber-400 text-lg">🎁</span>
                    Vous avez ete parraine ! Le code <strong className="font-mono">{referralCode}</strong> sera applique a votre compte.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isRegisterMode && (
                    <div>
                      <label htmlFor="register-name" className="block text-sm font-medium text-slate-300 mb-1">{t('login.name')}</label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          id="register-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          aria-label="Nom complet"
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder={t('login.yourName')}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="login-email" className="block text-sm font-medium text-slate-300 mb-1">{t('login.email')}</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        id="login-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-label="Adresse email"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="login-password" className="block text-sm font-medium text-slate-300 mb-1">{t('login.password')}</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        id="login-password"
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-label="Mot de passe"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="........"
                      />
                    </div>
                    {!isRegisterMode && (
                      <div className="text-right mt-1">
                        <button
                          type="button"
                          onClick={() => { setIsForgotPassword(true); setError(''); }}
                          className="text-xs text-teal-400 hover:underline"
                        >
                          {t('login.forgotPasswordLink')}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Free trial badge */}
                  {isRegisterMode && !isFirstUser && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-900/30 border border-emerald-800">
                      <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <p className="text-sm text-emerald-300">
                        {t('login.freeTrialBadge')}
                      </p>
                    </div>
                  )}

                  {/* CGU checkbox - only in register mode */}
                  {isRegisterMode && (
                    <label className="flex items-start gap-3 text-sm text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptCgu}
                        onChange={(e) => setAcceptCgu(e.target.checked)}
                        className="mt-0.5 rounded border-slate-600 bg-slate-800 text-teal-600 focus:ring-teal-500"
                      />
                      <span>
                        {t('login.acceptCgu1')}{' '}
                        <a href="/cgu" target="_blank" className="text-teal-400 hover:text-teal-300 underline">
                          {t('login.cguLink')}
                        </a>{' '}
                        {t('login.acceptCgu2')}{' '}
                        <a href="/politique-confidentialite" target="_blank" className="text-teal-400 hover:text-teal-300 underline">
                          {t('login.privacyLink')}
                        </a>
                      </span>
                    </label>
                  )}

                  <button
                    type="submit"
                    disabled={loading || (isRegisterMode && !acceptCgu)}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? t('common.loading') : isRegisterMode ? t('login.register') : t('login.signIn')}
                  </button>
                </form>

                {!isFirstUser && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => {
                        setIsRegisterMode(!isRegisterMode);
                        setError('');
                        setAcceptCgu(false);
                      }}
                      className="text-sm text-teal-400 hover:underline"
                    >
                      {isRegisterMode ? t('login.alreadyHaveAccount') : t('login.noAccount')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer links */}
          <div className="mt-6 text-center text-sm text-slate-400">
            <a href="/cgu" className="hover:text-slate-400">{t('login.cgu')}</a>
            <span className="mx-2">&middot;</span>
            <a href="/politique-confidentialite" className="hover:text-slate-400">{t('login.privacy')}</a>
            <span className="mx-2">&middot;</span>
            <a href="/mentions-legales" className="hover:text-slate-400">{t('login.legalNotice')}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
