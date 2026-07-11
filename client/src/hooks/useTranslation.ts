import { useState, useCallback, useEffect } from 'react';
import fr from '../locales/fr.json';

// Site FR-first (marché français) : seul le dictionnaire français est embarqué dans le
// bundle critique — il sert au rendu immédiat ET de fallback universel. Les autres langues
// (~158 KB de JSON : en/es/de/ar) sont code-splittées et chargées À LA DEMANDE, uniquement
// quand setLocale() bascule dessus (sélecteur exposé dans Settings, page authentifiée lazy).
// Ça sort ce poids du chunk `index` que CHAQUE page publique/SEO télécharge → gros gain
// LCP/TBT sur les pages de contenu qu'on cherche à faire ranker, sans perte de fonctionnalité.
const FR = fr as Record<string, unknown>;

/** Chargeurs dynamiques des dictionnaires non-FR (import() → chunks séparés Vite). */
const localeLoaders: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
  en: () => import('../locales/en.json'),
  es: () => import('../locales/es.json'),
  de: () => import('../locales/de.json'),
  ar: () => import('../locales/ar.json'),
};

/** Cache des dictionnaires déjà résolus (fr est toujours présent d'entrée). */
const loadedLocales: Record<string, Record<string, unknown>> = { fr: FR };

/** Langues disponibles (pour un futur sélecteur de langue — non exposé publiquement pour l'instant). */
export const AVAILABLE_LOCALES: { code: string; label: string; flag: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // Return key as fallback
    }
  }
  return typeof current === 'string' ? current : path;
}

export function useTranslation() {
  const [locale, setLocale] = useState<string>(() => {
    // Site FR-first (marche francais) : on force 'fr' par defaut.
    // Aucun selecteur de langue n'est expose publiquement pour l'instant, donc on
    // ignore toute locale periimee (ex: 'en' residuel des tests i18n) qui bloquerait
    // les visiteurs francais sur une UI anglaise. Migration auto via le useEffect ci-dessous.
    const stored = localStorage.getItem('locale');
    return stored === 'fr' ? 'fr' : 'fr';
  });

  // Incrémenté quand un dictionnaire chargé à la demande devient disponible → force un re-render
  // pour que t() reprenne les traductions fraîches (jusque-là on affiche le fallback FR).
  const [, setLoadedTick] = useState(0);

  useEffect(() => {
    localStorage.setItem('locale', locale);
    // Set RTL direction for Arabic
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';

    // Charge le dictionnaire non-FR à la demande (une seule fois, puis mis en cache).
    if (locale !== 'fr' && !loadedLocales[locale] && localeLoaders[locale]) {
      localeLoaders[locale]()
        .then((mod) => {
          loadedLocales[locale] = (mod.default ?? mod) as Record<string, unknown>;
          setLoadedTick((n) => n + 1);
        })
        .catch(() => {
          /* échec réseau : on garde le fallback FR, pas de crash */
        });
    }
  }, [locale]);

  const t = useCallback(
    (key: string): string => {
      // Dictionnaire courant s'il est chargé, sinon fallback FR (toujours disponible).
      const dict = loadedLocales[locale] || FR;
      const value = getNestedValue(dict, key);
      if (value === key && locale !== 'fr') {
        return getNestedValue(FR, key);
      }
      return value;
    },
    [locale]
  );

  return { t, locale, setLocale };
}
