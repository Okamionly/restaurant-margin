import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Mail, Lock, User, KeyRound, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { checkFirstUser } from '../services/api';

export default function Login() {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isFirstUser, setIsFirstUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('chef');
  const [invitationCode, setInvitationCode] = useState('');

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegisterMode) {
        await register({
          email,
          password,
          name,
          ...(isFirstUser ? {} : { invitationCode, role }),
        });
      } else {
        await login({ email, password });
      }
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Header band */}
      <div className="bg-blue-800 py-12">
        <div className="flex flex-col items-center">
          <ChefHat className="w-16 h-16 text-white mb-3" />
          <h1 className="text-3xl font-bold text-white">RestauMargin</h1>
          <p className="text-blue-200 mt-1">Calcul de marge pour la restauration</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-start justify-center px-4 -mt-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-8">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6 text-center">
            {isRegisterMode ? 'Créer un compte' : 'Connexion'}
          </h2>

          {isFirstUser && (
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4 text-sm text-blue-700 dark:text-blue-300">
              Premier utilisateur : créez un compte administrateur.
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input w-full pl-10"
                    placeholder="Votre nom"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input w-full pl-10"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isRegisterMode && !isFirstUser && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rôle</label>
                  <div className="relative">
                    <Shield className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="input w-full pl-10 appearance-none"
                    >
                      <option value="chef">Chef de cuisine</option>
                      <option value="admin">Directeur</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Code d'invitation</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={invitationCode}
                      onChange={(e) => setInvitationCode(e.target.value)}
                      className="input w-full pl-10"
                      placeholder="Code d'invitation"
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Demandez le code d'invitation à votre administrateur
                  </p>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
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
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {isRegisterMode ? 'Déjà un compte ? Se connecter' : "Pas de compte ? S'inscrire"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
