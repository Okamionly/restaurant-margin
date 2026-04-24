// Lightweight onboarding flags — safe to import from main bundle without
// pulling the full OnboardingWizard (~50 KB) in.
const STORAGE_KEY = 'onboarding-completed';

export function isOnboardingCompleted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return true; // if localStorage is unavailable, don't nag the user
  }
}
