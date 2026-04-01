import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChefHat, Mail, Lock, User, KeyRound, Shield, ArrowLeft, TrendingUp, Brain } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { checkFirstUser } from '../services/api';

export default function Login() {
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
  const [role, setRole] = useState('chef');
  const [activationCode, setInvitationCode] = useState('');
  const [acceptCgu, setAcceptCgu] = useState(false);

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
  }, []);

  // Handle email verification token from URL
  useEffect(() => {
    const verifyToken = searchParams.get('verify');
    if (verifyToken) {
      fetch(`/api/auth/verify-email?token=${verifyToken}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setVerifiedSuccess('Email verifie avec succes ! Vous pouvez vous connecter.');
          } else {
            setError(data.error || 'Token de verification invalide');
          }
        })
        .catch(() => setError('Erreur lors de la verification'));
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (isRegisterMode && !acceptCgu) {
      setError('Vous devez accepter les Conditions Generales d\'Utilisation pour vous inscrire.');
      return;
    }

    setLoading(true);
    try {
      if (isRegisterMode) {
        await register({
          email,
          password,
          name,
          ...(isFirstUser ? {} : { activationCode, role }),
        });
      } else {
        await login({ email, password });
      }
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur de connexion';
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
      setForgotPasswordSuccess(`Un email de reinitialisation a ete envoye a ${email}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la demande';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left panel - hidden on mobile, visible md+ */}
      <div className="hidden md:flex md:w-1/2 lg:w-[55%] bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 flex-col justify-center items-center p-12">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <ChefHat className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">RestauMargin</h1>
          </div>
          <p className="text-xl text-blue-200 mb-12">La plateforme intelligente pour optimiser vos marges</p>

          {/* 3 value props */}
          <div className="space-y-6 text-left">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Calcul de marge en temps reel</h3>
                <p className="text-slate-400 text-sm">Suivez vos couts et marges sur chaque recette instantanement</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Conformite HACCP integree</h3>
                <p className="text-slate-400 text-sm">Gerez vos controles qualite et tracabilite en un clic</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Assistant IA dedie</h3>
                <p className="text-slate-400 text-sm">Optimisez vos achats et menus grace a l'intelligence artificielle</p>
              </div>
            </div>
          </div>

          {/* Social proof */}
          <div className="mt-12 pt-8 border-t border-slate-700/50">
            <p className="text-slate-400 text-sm">Utilise par des restaurateurs en France</p>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
        {/* Mobile logo */}
        <div className="md:hidden flex items-center gap-2 mb-8">
          <ChefHat className="w-8 h-8 text-blue-400" />
          <span className="text-2xl font-bold text-white">RestauMargin</span>
        </div>

        <div className="w-full max-w-md">
          {/* Form card */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">
              {isForgotPassword ? 'Mot de passe oublie' : isRegisterMode ? 'Creer un compte' : 'Connexion'}
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
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Chargement...' : 'Envoyer le lien de reinitialisation'}
                  </button>
                </form>
                <div className="mt-4 text-center">
                  <button
                    onClick={() => { setIsForgotPassword(false); setError(''); setForgotPasswordSuccess(''); }}
                    className="inline-flex items-center gap-1 text-sm text-blue-400 hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Retour a la connexion
                  </button>
                </div>
              </>
            ) : (
              <>
                {isFirstUser && (
                  <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-3 mb-4 text-sm text-blue-300">
                    Premier utilisateur : creez un compte administrateur.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isRegisterMode && (
                    <div>
                      <label htmlFor="register-name" className="block text-sm font-medium text-slate-300 mb-1">Nom</label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          id="register-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          aria-label="Nom complet"
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Votre nom"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="login-email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        id="login-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-label="Adresse email"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="login-password" className="block text-sm font-medium text-slate-300 mb-1">Mot de passe</label>
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
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="........"
                      />
                    </div>
                    {!isRegisterMode && (
                      <div className="text-right mt-1">
                        <button
                          type="button"
                          onClick={() => { setIsForgotPassword(true); setError(''); }}
                          className="text-xs text-blue-400 hover:underline"
                        >
                          Mot de passe oublie ?
                        </button>
                      </div>
                    )}
                  </div>

                  {isRegisterMode && !isFirstUser && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                        <div className="relative">
                          <Shield className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="chef">Chef de cuisine</option>
                            <option value="admin">Directeur</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Code d'activation</label>
                        <div className="relative">
                          <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={activationCode}
                            onChange={(e) => setInvitationCode(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Code d'activation"
                          />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Abonnez-vous sur la page Tarifs pour recevoir votre code
                        </p>
                      </div>
                    </>
                  )}

                  {/* CGU checkbox - only in register mode */}
                  {isRegisterMode && (
                    <label className="flex items-start gap-3 text-sm text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptCgu}
                        onChange={(e) => setAcceptCgu(e.target.checked)}
                        className="mt-0.5 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
                      />
                      <span>
                        J'accepte les{' '}
                        <a href="/cgu" target="_blank" className="text-blue-400 hover:text-blue-300 underline">
                          Conditions Generales d'Utilisation
                        </a>{' '}
                        et la{' '}
                        <a href="/politique-confidentialite" target="_blank" className="text-blue-400 hover:text-blue-300 underline">
                          Politique de confidentialite
                        </a>
                      </span>
                    </label>
                  )}

                  <button
                    type="submit"
                    disabled={loading || (isRegisterMode && !acceptCgu)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Chargement...' : isRegisterMode ? "S'inscrire" : 'Se connecter'}
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
                      className="text-sm text-blue-400 hover:underline"
                    >
                      {isRegisterMode ? 'Deja un compte ? Se connecter' : "Pas de compte ? S'inscrire"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer links */}
          <div className="mt-6 text-center text-sm text-slate-400">
            <a href="/cgu" className="hover:text-slate-400">CGU</a>
            <span className="mx-2">&middot;</span>
            <a href="/politique-confidentialite" className="hover:text-slate-400">Confidentialite</a>
            <span className="mx-2">&middot;</span>
            <a href="/mentions-legales" className="hover:text-slate-400">Mentions legales</a>
          </div>
        </div>
      </div>
    </div>
  );
}
