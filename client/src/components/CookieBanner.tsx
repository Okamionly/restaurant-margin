import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  }

  function handleRefuse() {
    localStorage.setItem('cookie-consent', 'refused');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 animate-slide-up">
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Icon + text */}
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium mb-1">Ce site utilise des cookies</p>
              <p className="text-slate-400 text-xs leading-relaxed">
                Nous utilisons des cookies essentiels pour le fonctionnement du site et des cookies
                analytiques pour ameliorer votre experience. Consultez notre{' '}
                <a
                  href="/politique-confidentialite"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  politique de confidentialite
                </a>{' '}
                pour en savoir plus.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={handleRefuse}
              className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition-colors"
            >
              Refuser
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
            >
              Accepter
            </button>
          </div>

          {/* Close button (mobile alternative) */}
          <button
            onClick={handleRefuse}
            className="absolute top-3 right-3 sm:hidden p-1 text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
