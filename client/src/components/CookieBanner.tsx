import { useState, useEffect, useRef } from 'react';
import { Cookie, X } from 'lucide-react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  // FIX 2026-09-24 : ce bandeau est fixed bottom-0 sur toute la largeur en z-[9999],
  // et la bulle de l'assistant est fixed bottom-4 right-4 en z-50 : mesure faite a
  // 375 px, les deux tombaient a y=739 et y=740, le bandeau recouvrant entierement
  // la bulle. On publie donc la hauteur REELLE du bandeau dans une variable CSS, que
  // l'assistant ajoute a son decalage bas. Mesuree, pas devinee : la hauteur depend
  // du texte, de la langue et de la largeur d'ecran.
  useEffect(() => {
    const root = document.documentElement;
    if (!visible) {
      root.style.setProperty('--cookie-banner-h', '0px');
      return;
    }
    const publier = () => {
      const h = boxRef.current?.getBoundingClientRect().height ?? 0;
      root.style.setProperty('--cookie-banner-h', `${Math.round(h)}px`);
    };
    publier();
    const ro = new ResizeObserver(publier);
    if (boxRef.current) ro.observe(boxRef.current);
    window.addEventListener('resize', publier);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', publier);
      // Au demontage le bandeau ne masque plus rien : la bulle doit redescendre.
      root.style.setProperty('--cookie-banner-h', '0px');
    };
  }, [visible]);

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
    <div ref={boxRef} className="fixed bottom-0 left-0 right-0 z-[9999] p-3 sm:p-4 animate-slide-up">
      <div className="relative max-w-4xl mx-auto bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-300 rounded-2xl shadow-2xl shadow-black/20 dark:shadow-black/50 p-4 sm:p-6">
        {/* Close button mobile - absolute top-right */}
        <button
          onClick={handleRefuse}
          aria-label="Fermer"
          className="absolute top-2 right-2 sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-full text-mono-500 hover:text-mono-100 dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {/* Icon + text */}
          <div className="flex items-start gap-3 flex-1 min-w-0 pr-8 sm:pr-0">
            <Cookie className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-mono-100 dark:text-white text-sm font-medium mb-1">Ce site utilise des cookies</p>
              <p className="text-mono-500 dark:text-mono-700 text-xs leading-relaxed">
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
              className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 text-sm font-medium text-mono-400 dark:text-mono-800 bg-mono-975 dark:bg-mono-300 hover:bg-mono-900 dark:hover:bg-mono-350 border border-mono-900 dark:border-mono-350 rounded-xl transition-colors"
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
