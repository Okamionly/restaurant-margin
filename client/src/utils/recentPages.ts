// Lightweight recently-visited pages tracker — safe to import from main bundle
// without pulling the full CommandPalette (~40 KB) in.
const RECENT_PAGES_KEY = 'rm-recent-pages';
const MAX_RECENT_PAGES = 5;

export function trackPageVisit(path: string): void {
  try {
    const raw = localStorage.getItem(RECENT_PAGES_KEY);
    const current: string[] = raw ? JSON.parse(raw) : [];
    const updated = [path, ...current.filter((p) => p !== path)].slice(0, MAX_RECENT_PAGES);
    localStorage.setItem(RECENT_PAGES_KEY, JSON.stringify(updated));
  } catch {
    /* ignore */
  }
}

export function getRecentPages(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_PAGES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}
