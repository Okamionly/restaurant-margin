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
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-3 sm:p-4 animate-slide-up">
      <div className="relative max-w-4xl mx-auto bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#262626] rounded-2xl shadow-2xl shadow-black/20 dark:shadow-black/50 p-4 sm:p-6">
        {/* Close button mobile - absolute top-right */}
        <button
          onClick={handleRefuse}
          aria-label="Fermer"
          className="absolute top-2 right-2 sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-full text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {/* Icon + text */}
          <div className="flex items-start gap-3 flex-1 min-w-0 pr-8 sm:pr-0">
            <Cookie className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-[#111111] dark:text-white text-sm font-medium mb-1">Ce site utilise des cookies</p>
              <p className="text-[#737373] dark:text-[#A3A3A3] text-xs leading-relaxed">
                Nous utilisons des cookies essentiels pour le fonctionnement du site et des cookies
                analytiques pour ameliorer votre experience. Consultez notre{' '}
                <a
                  href="/politique-confidentialite"
                  className="text-teal-400 hover:text-teal-300 underline"
                >
                  politique de confidentialite
                </a>{' '}
                pour en savoir plus.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={handleRefuse}
              className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 text-sm font-medium text-[#525252] dark:text-[#D4D4D4] bg-[#F5F5F5] dark:bg-[#262626] hover:bg-[#E5E7EB] dark:hover:bg-[#404040] border border-[#E5E7EB] dark:border-[#404040] rounded-xl transition-colors"
            >
              Refuser
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
