import { useState, useCallback, useEffect } from 'react';
import fr from '../locales/fr.json';
import en from '../locales/en.json';
import ar from '../locales/ar.json';
import es from '../locales/es.json';
import de from '../locales/de.json';

const locales: Record<string, Record<string, unknown>> = { fr, en, ar, es, de };

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
    return localStorage.getItem('locale') || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
    // Set RTL direction for Arabic
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const t = useCallback(
    (key: string): string => {
      const dict = locales[locale] || locales.fr;
      return getNestedValue(dict as Record<string, unknown>, key);
    },
    [locale]
  );

  return { t, locale, setLocale };
}
