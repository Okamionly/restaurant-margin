import { useEffect, useState } from 'react';
import { getToken } from '../services/api';

// Minimal gamification stats used by SidebarLevelBadge.
// This hook hits the same API endpoints as Gamification.tsx but avoids
// pulling the entire Gamification page (~80 KB) into the main bundle.

export interface LevelInfo {
  min: number;
  max: number;
  name: string;
  color: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

export const LEVELS: LevelInfo[] = [
  { min: 0, max: 200, name: 'Apprenti', color: '#CD7F32', bgClass: 'bg-amber-700/20', textClass: 'text-amber-600 dark:text-amber-500', borderClass: 'border-amber-600/30' },
  { min: 200, max: 400, name: 'Commis', color: '#C0C0C0', bgClass: 'bg-gray-300/20 dark:bg-gray-500/20', textClass: 'text-gray-500 dark:text-gray-400', borderClass: 'border-gray-400/30' },
  { min: 400, max: 600, name: 'Chef de Partie', color: '#FFD700', bgClass: 'bg-yellow-500/20', textClass: 'text-yellow-600 dark:text-yellow-400', borderClass: 'border-yellow-500/30' },
  { min: 600, max: 800, name: 'Sous-Chef', color: '#E5E4E2', bgClass: 'bg-blue-200/20 dark:bg-blue-400/20', textClass: 'text-blue-500 dark:text-blue-300', borderClass: 'border-blue-400/30' },
  { min: 800, max: 1000, name: 'Chef Etoile', color: '#B9F2FF', bgClass: 'bg-cyan-300/20', textClass: 'text-cyan-400', borderClass: 'border-cyan-400/30' },
];

export function getLevel(score: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].min) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getLevelIndex(score: number): number {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].min) return i;
  }
  return 0;
}

interface MinimalData {
  totalRecipes: number;
  recipesWithIngredients: number;
  avgMargin: number;
  avgFoodCost: number;
  highMarginRecipes: number;
  haccpScore: number;
  stockAlerts: number;
  wasteDays: number;
  usedAI: boolean;
}

function computeScore(d: MinimalData): number {
  let total = 0;
  if (d.avgFoodCost > 0 && d.avgFoodCost < 30) total += 200;
  else if (d.avgFoodCost >= 30 && d.avgFoodCost <= 35) total += 100;
  if (d.avgMargin > 70) total += 200;
  else if (d.avgMargin > 50) total += Math.round((d.avgMargin - 50) / 20 * 200);
  total += d.stockAlerts === 0 ? 150 : Math.max(0, 150 - d.stockAlerts * 30);
  if (d.haccpScore > 80) total += 150;
  else if (d.haccpScore > 50) total += Math.round((d.haccpScore - 50) / 30 * 150);
  if (d.totalRecipes > 0) total += Math.round((d.recipesWithIngredients / d.totalRecipes) * 100);
  total += 50;
  if (d.usedAI) total += 50;
  return Math.min(1000, total);
}

const CACHE_KEY = 'level-stats-cache-v1';
const CACHE_TTL_MS = 5 * 60 * 1000;

export function useLevelStats() {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { score: number; ts: number };
        if (Date.now() - parsed.ts < CACHE_TTL_MS) {
          setScore(parsed.score);
          setLoading(false);
          return;
        }
      }
    } catch { /* ignore */ }

    const headers = { Authorization: `Bearer ${token}` };
    let cancelled = false;

    (async () => {
      try {
        const [recipesRes, ingredientsRes] = await Promise.all([
          fetch('/api/recipes', { headers }).catch(() => null),
          fetch('/api/ingredients', { headers }).catch(() => null),
        ]);

        const recipes = recipesRes && recipesRes.ok ? await recipesRes.json() : [];
        const ingredients = ingredientsRes && ingredientsRes.ok ? await ingredientsRes.json() : [];

        const totalRecipes = Array.isArray(recipes) ? recipes.length : 0;
        let recipesWithIngredients = 0;
        let marginSum = 0;
        let marginCount = 0;
        let foodCostSum = 0;
        let foodCostCount = 0;
        let highMarginRecipes = 0;

        if (Array.isArray(recipes)) {
          for (const r of recipes) {
            const ings = r?.ingredients || r?.ingredientsJson || [];
            if (Array.isArray(ings) && ings.length > 0) recipesWithIngredients++;
            if (typeof r?.margin === 'number') { marginSum += r.margin; marginCount++; if (r.margin > 70) highMarginRecipes++; }
            if (typeof r?.foodCost === 'number') { foodCostSum += r.foodCost; foodCostCount++; }
          }
        }

        const avgMargin = marginCount > 0 ? marginSum / marginCount : 0;
        const avgFoodCost = foodCostCount > 0 ? foodCostSum / foodCostCount : 0;
        const stockAlerts = Array.isArray(ingredients)
          ? ingredients.filter((i: any) => typeof i?.minStock === 'number' && typeof i?.stock === 'number' && i.stock <= i.minStock).length
          : 0;

        const total = computeScore({
          totalRecipes,
          recipesWithIngredients,
          avgMargin,
          avgFoodCost,
          highMarginRecipes,
          haccpScore: 0,
          stockAlerts,
          wasteDays: 0,
          usedAI: false,
        });

        if (cancelled) return;
        setScore(total);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ score: total, ts: Date.now() }));
        } catch { /* ignore */ }
      } catch {
        // silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return { score: score ?? 0, loading, level: getLevel(score ?? 0), levelIndex: getLevelIndex(score ?? 0) };
}
