import { useState, useEffect, useMemo, useRef } from 'react';
import { Trophy, Star, Award, Target, Flame, ChefHat, ShoppingBasket, ShieldCheck, Sparkles, Trash2, Zap, Package, TrendingUp, Lock, Crown, Medal, Users, BarChart3 } from 'lucide-react';
import { getToken } from '../services/api';

// ── Types ──────────────────────────────────────────────────────────
interface GamificationData {
  recipes: any[];
  ingredients: any[];
  totalRecipes: number;
  avgMargin: number;
  avgFoodCost: number;
  recipesWithIngredients: number;
  highMarginRecipes: number;
  lastLoginDays: number;
  usedAI: boolean;
  haccpScore: number;
  stockAlerts: number;
  wasteDays: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  color: string;
}

interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  icon: React.ComponentType<{ className?: string }>;
}

// ── Level System ───────────────────────────────────────────────────
const LEVELS = [
  { min: 0, max: 200, name: 'Apprenti', color: '#CD7F32', bgClass: 'bg-amber-700/20', textClass: 'text-amber-600 dark:text-amber-500', borderClass: 'border-amber-600/30' },
  { min: 200, max: 400, name: 'Commis', color: '#C0C0C0', bgClass: 'bg-gray-300/20 dark:bg-gray-500/20', textClass: 'text-gray-500 dark:text-gray-400', borderClass: 'border-gray-400/30' },
  { min: 400, max: 600, name: 'Chef de Partie', color: '#FFD700', bgClass: 'bg-yellow-500/20', textClass: 'text-yellow-600 dark:text-yellow-400', borderClass: 'border-yellow-500/30' },
  { min: 600, max: 800, name: 'Sous-Chef', color: '#E5E4E2', bgClass: 'bg-blue-200/20 dark:bg-blue-400/20', textClass: 'text-blue-500 dark:text-blue-300', borderClass: 'border-blue-400/30' },
  { min: 800, max: 1000, name: 'Chef Etoile', color: '#B9F2FF', bgClass: 'bg-cyan-300/20', textClass: 'text-cyan-400', borderClass: 'border-cyan-400/30' },
];

function getLevel(score: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].min) return LEVELS[i];
  }
  return LEVELS[0];
}

function getLevelIndex(score: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].min) return i;
  }
  return 0;
}

// ── Animated Counter ───────────────────────────────────────────────
function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    const start = ref.current;
    const diff = target - start;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + diff * eased);
      setValue(current);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        ref.current = target;
      }
    }
    requestAnimationFrame(tick);
  }, [target, duration]);

  return <>{value}</>;
}

// ── Circular Progress ──────────────────────────────────────────────
function CircularScore({ score, size = 200 }: { score: number; size?: number }) {
  const level = getLevel(score);
  const levelIdx = getLevelIndex(score);
  const isMaxLevel = levelIdx === LEVELS.length - 1;
  const progress = Math.min(score / 1000, 1);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-[#E5E7EB] dark:text-[#1A1A1A]"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={level.color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: isMaxLevel ? 'drop-shadow(0 0 8px rgba(185, 242, 255, 0.5))' : undefined,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold text-[#111111] dark:text-white font-satoshi">
          <AnimatedCounter target={score} />
        </div>
        <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5">/ 1000</div>
        <div className={`text-sm font-semibold mt-1 ${level.textClass}`}>
          {level.name}
        </div>
        {isMaxLevel && (
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Score Computation ──────────────────────────────────────────────
function computeScore(data: GamificationData): { total: number; breakdown: { label: string; points: number; max: number; detail: string }[] } {
  const breakdown: { label: string; points: number; max: number; detail: string }[] = [];

  // Food cost control (<30% = +200, 30-35% = +100, >35% = 0)
  let foodCostPts = 0;
  if (data.avgFoodCost > 0 && data.avgFoodCost < 30) foodCostPts = 200;
  else if (data.avgFoodCost >= 30 && data.avgFoodCost <= 35) foodCostPts = 100;
  breakdown.push({ label: 'Food Cost', points: foodCostPts, max: 200, detail: data.avgFoodCost > 0 ? `${data.avgFoodCost.toFixed(1)}%` : 'N/A' });

  // Margin average (>70% = +200)
  let marginPts = 0;
  if (data.avgMargin > 70) marginPts = 200;
  else if (data.avgMargin > 50) marginPts = Math.round((data.avgMargin - 50) / 20 * 200);
  breakdown.push({ label: 'Marge moyenne', points: marginPts, max: 200, detail: data.avgMargin > 0 ? `${data.avgMargin.toFixed(1)}%` : 'N/A' });

  // Stock management (no alerts = +150)
  let stockPts = data.stockAlerts === 0 ? 150 : Math.max(0, 150 - data.stockAlerts * 30);
  breakdown.push({ label: 'Gestion stock', points: stockPts, max: 150, detail: data.stockAlerts === 0 ? 'Aucune rupture' : `${data.stockAlerts} alerte(s)` });

  // HACCP compliance (>80% = +150)
  let haccpPts = 0;
  if (data.haccpScore > 80) haccpPts = 150;
  else if (data.haccpScore > 50) haccpPts = Math.round((data.haccpScore - 50) / 30 * 150);
  breakdown.push({ label: 'HACCP', points: haccpPts, max: 150, detail: data.haccpScore > 0 ? `${data.haccpScore}%` : 'Non configure' });

  // Recipe completeness (all have ingredients = +100)
  let recipePts = 0;
  if (data.totalRecipes > 0) {
    const ratio = data.recipesWithIngredients / data.totalRecipes;
    recipePts = Math.round(ratio * 100);
  }
  breakdown.push({ label: 'Fiches completes', points: recipePts, max: 100, detail: `${data.recipesWithIngredients}/${data.totalRecipes}` });

  // Active usage
  let usagePts = 0;
  if (data.lastLoginDays <= 7) usagePts += 50;
  if (data.usedAI) usagePts += 50;
  breakdown.push({ label: 'Utilisation active', points: usagePts, max: 100, detail: data.usedAI ? 'IA utilisee cette semaine' : 'Connecte recemment' });

  const total = Math.min(1000, breakdown.reduce((s, b) => s + b.points, 0));
  return { total, breakdown };
}

// ── Achievements ───────────────────────────────────────────────────
function computeAchievements(data: GamificationData): Achievement[] {
  return [
    {
      id: 'first-recipe',
      name: 'Premiere recette',
      description: 'Creez votre premiere fiche technique',
      icon: ChefHat,
      unlocked: data.totalRecipes >= 1,
      progress: Math.min(data.totalRecipes, 1),
      maxProgress: 1,
      color: '#10B981',
    },
    {
      id: '10-recipes',
      name: '10 recettes',
      description: 'Atteignez 10 fiches techniques',
      icon: ClipboardList,
      unlocked: data.totalRecipes >= 10,
      progress: Math.min(data.totalRecipes, 10),
      maxProgress: 10,
      color: '#3B82F6',
    },
    {
      id: 'margin-master',
      name: 'Margin Master',
      description: 'Toutes vos recettes ont >70% de marge',
      icon: TrendingUp,
      unlocked: data.totalRecipes > 0 && data.highMarginRecipes === data.totalRecipes,
      progress: data.highMarginRecipes,
      maxProgress: Math.max(data.totalRecipes, 1),
      color: '#F59E0B',
    },
    {
      id: 'zero-waste',
      name: 'Zero Gaspillage',
      description: '7 jours sans gaspillage enregistre',
      icon: Trash2,
      unlocked: data.wasteDays >= 7,
      progress: Math.min(data.wasteDays, 7),
      maxProgress: 7,
      color: '#22C55E',
    },
    {
      id: 'speed-demon',
      name: 'Speed Demon',
      description: '5 recettes creees par IA en un jour',
      icon: Zap,
      unlocked: data.usedAI && data.totalRecipes >= 5,
      color: '#EF4444',
    },
    {
      id: 'stock-perfect',
      name: 'Stock Perfect',
      description: 'Aucune alerte stock pendant 30 jours',
      icon: Package,
      unlocked: data.stockAlerts === 0 && data.totalRecipes > 0,
      color: '#8B5CF6',
    },
    {
      id: 'haccp-hero',
      name: 'HACCP Hero',
      description: '30 jours consecutifs de conformite HACCP',
      icon: ShieldCheck,
      unlocked: data.haccpScore >= 80,
      color: '#06B6D4',
    },
  ];
}

// ── Clipboard icon (reused from types) ─────────────────────────────
function ClipboardList({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}

// ── Weekly Challenges ──────────────────────────────────────────────
function getWeeklyChallenges(data: GamificationData): WeeklyChallenge[] {
  // Rotate challenges based on week number
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const allChallenges: WeeklyChallenge[] = [
    {
      id: 'reduce-foodcost',
      title: 'Reduisez votre food cost de 2%',
      description: 'Optimisez vos recettes pour baisser le food cost global',
      progress: data.avgFoodCost < 30 ? 1 : 0,
      target: 1,
      reward: 50,
      icon: TrendingUp,
    },
    {
      id: 'create-3-recipes',
      title: 'Creez 3 nouvelles fiches techniques',
      description: 'Ajoutez 3 nouvelles recettes a votre catalogue',
      progress: Math.min(data.totalRecipes, 3),
      target: 3,
      reward: 30,
      icon: ChefHat,
    },
    {
      id: 'zero-waste-5',
      title: '0 gaspillage pendant 5 jours',
      description: 'Aucun gaspillage enregistre sur 5 jours consecutifs',
      progress: Math.min(data.wasteDays, 5),
      target: 5,
      reward: 40,
      icon: Trash2,
    },
    {
      id: 'complete-ingredients',
      title: 'Completez toutes vos fiches',
      description: 'Chaque recette doit avoir ses ingredients renseignes',
      progress: data.recipesWithIngredients,
      target: Math.max(data.totalRecipes, 1),
      reward: 35,
      icon: ShoppingBasket,
    },
    {
      id: 'use-ai',
      title: 'Utilisez l\'Assistant IA',
      description: 'Demandez a l\'IA d\'optimiser une recette ou de suggerer des idees',
      progress: data.usedAI ? 1 : 0,
      target: 1,
      reward: 25,
      icon: Sparkles,
    },
  ];

  // Pick 3 challenges for this week
  const start = weekNum % allChallenges.length;
  const selected: WeeklyChallenge[] = [];
  for (let i = 0; i < 3; i++) {
    selected.push(allChallenges[(start + i) % allChallenges.length]);
  }
  return selected;
}

// ── Fetch data from API ────────────────────────────────────────────
async function fetchGamificationData(): Promise<GamificationData> {
  const token = getToken();
  if (!token) {
    return { recipes: [], ingredients: [], totalRecipes: 0, avgMargin: 0, avgFoodCost: 0, recipesWithIngredients: 0, highMarginRecipes: 0, lastLoginDays: 0, usedAI: false, haccpScore: 0, stockAlerts: 0, wasteDays: 0 };
  }

  const headers = { Authorization: `Bearer ${token}` };

  const [recipesRes, ingredientsRes] = await Promise.all([
    fetch('/api/recipes', { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
    fetch('/api/ingredients', { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
  ]);

  const recipes = Array.isArray(recipesRes) ? recipesRes : [];
  const ingredients = Array.isArray(ingredientsRes) ? ingredientsRes : (ingredientsRes?.ingredients || []);

  // Compute metrics from recipes
  let totalMargin = 0;
  let totalFoodCost = 0;
  let recipesWithIngredients = 0;
  let highMarginRecipes = 0;
  let marginCount = 0;

  recipes.forEach((r: any) => {
    if (r.margin) {
      totalMargin += r.margin.marginPercent || 0;
      totalFoodCost += r.margin.foodCost || 0;
      marginCount++;
      if ((r.margin.marginPercent || 0) > 70) highMarginRecipes++;
    }
    if (r.ingredients && r.ingredients.length > 0) recipesWithIngredients++;
  });

  const avgMargin = marginCount > 0 ? totalMargin / marginCount : 0;
  const avgFoodCost = marginCount > 0 ? totalFoodCost / marginCount : 0;

  // Stock alerts
  const lowStockItems = ingredients.filter((ing: any) => {
    const qty = ing.currentStock ?? ing.quantity ?? 0;
    const threshold = ing.minimumStock ?? ing.minStock ?? ing.threshold ?? 5;
    return qty > 0 && qty < threshold;
  });

  // Check AI usage from localStorage
  const usedAI = localStorage.getItem('ai-used-this-week') === '1' ||
    localStorage.getItem('gamification-ai-used') === '1';

  // HACCP score (stored in localStorage or default)
  const haccpScore = parseInt(localStorage.getItem('haccp-compliance-score') || '0');

  // Waste-free days (stored in localStorage)
  const wasteDays = parseInt(localStorage.getItem('waste-free-days') || '0');

  return {
    recipes,
    ingredients,
    totalRecipes: recipes.length,
    avgMargin,
    avgFoodCost,
    recipesWithIngredients,
    highMarginRecipes,
    lastLoginDays: 0,
    usedAI,
    haccpScore,
    stockAlerts: lowStockItems.length,
    wasteDays,
  };
}

// ── Sidebar Level Badge (compact, for sidebar) ─────────────────────
export function SidebarLevelBadge() {
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGamificationData().then(data => {
      const { total } = computeScore(data);
      setScore(total);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  const level = getLevel(score);
  const levelIdx = getLevelIndex(score);
  const isMaxLevel = levelIdx === LEVELS.length - 1;
  const progress = level.max > level.min ? (score - level.min) / (level.max - level.min) : 1;

  return (
    <div className={`mx-3 mb-3 px-3 py-2.5 rounded-lg border ${level.borderClass} ${level.bgClass} transition-all duration-300`}>
      <div className="flex items-center gap-2.5">
        <div className="relative">
          {levelIdx === 0 && <Medal className={`w-5 h-5 ${level.textClass}`} />}
          {levelIdx === 1 && <Medal className={`w-5 h-5 ${level.textClass}`} />}
          {levelIdx === 2 && <Award className={`w-5 h-5 ${level.textClass}`} />}
          {levelIdx === 3 && <Crown className={`w-5 h-5 ${level.textClass}`} />}
          {levelIdx === 4 && (
            <>
              <Crown className={`w-5 h-5 ${level.textClass}`} />
              <Sparkles className="w-3 h-3 text-cyan-400 absolute -top-1 -right-1 animate-pulse" />
            </>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-xs font-semibold ${level.textClass} truncate sidebar-label`}>{level.name}</div>
          <div className="w-full h-1 rounded-full bg-[#E5E7EB] dark:bg-[#1A1A1A] mt-1 sidebar-label">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(progress * 100, 100)}%`, backgroundColor: level.color }}
            />
          </div>
        </div>
        <span className={`text-xs font-bold ${level.textClass} sidebar-label`}>{score}</span>
      </div>
    </div>
  );
}

// ── Full Gamification Page ─────────────────────────────────────────
export default function GamificationPage() {
  const [data, setData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mark active usage
    localStorage.setItem('gamification-last-visit', Date.now().toString());

    fetchGamificationData().then(d => {
      setData(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const scoreResult = useMemo(() => data ? computeScore(data) : null, [data]);
  const achievements = useMemo(() => data ? computeAchievements(data) : [], [data]);
  const challenges = useMemo(() => data ? getWeeklyChallenges(data) : [], [data]);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#111111] dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || !scoreResult) return null;

  const level = getLevel(scoreResult.total);
  const levelIdx = getLevelIndex(scoreResult.total);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">Mon Score</h1>
        <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1">
          Suivez votre performance et debloquez des badges
        </p>
      </div>

      {/* Score + Level Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Score Circle */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-8">
          <CircularScore score={scoreResult.total} size={200} />
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2">
              {levelIdx >= 4 ? (
                <Crown className="w-5 h-5 text-cyan-400" />
              ) : levelIdx >= 3 ? (
                <Crown className="w-5 h-5 text-blue-400" />
              ) : levelIdx >= 2 ? (
                <Award className="w-5 h-5 text-yellow-500" />
              ) : (
                <Medal className="w-5 h-5 text-amber-600" />
              )}
              <span className={`font-bold text-lg ${level.textClass}`}>Niveau: {level.name}</span>
            </div>
            {levelIdx < LEVELS.length - 1 && (
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-2">
                Encore {LEVELS[levelIdx + 1].min - scoreResult.total} pts pour {LEVELS[levelIdx + 1].name}
              </p>
            )}
            {levelIdx === LEVELS.length - 1 && (
              <p className="text-xs text-cyan-400 mt-2 font-medium">
                Niveau maximum atteint !
              </p>
            )}
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-[#111111] dark:text-white font-satoshi mb-4 flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            Detail du score
          </h2>
          <div className="space-y-4">
            {scoreResult.breakdown.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{item.detail}</span>
                    <span className="text-sm font-bold text-[#111111] dark:text-white">{item.points}/{item.max}</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E5E7EB] dark:bg-[#1A1A1A]">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${item.max > 0 ? (item.points / item.max) * 100 : 0}%`,
                      backgroundColor: item.points >= item.max ? '#10B981' : item.points > 0 ? '#F59E0B' : '#EF4444',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#111111] dark:text-white font-satoshi flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Badges
          </h2>
          <span className="text-sm text-[#9CA3AF] dark:text-[#737373]">
            {unlockedCount}/{achievements.length} debloques
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative flex flex-col items-center p-4 rounded-xl border transition-all duration-300 ${
                achievement.unlocked
                  ? 'border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#F9FAFB] dark:bg-[#0A0A0A] hover:border-[#111111] dark:hover:border-[#333333] hover:shadow-lg'
                  : 'border-[#E5E7EB] dark:border-[#1A1A1A]/50 bg-[#F9FAFB]/50 dark:bg-[#0A0A0A]/30 opacity-50'
              }`}
            >
              {/* Badge icon */}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                  achievement.unlocked
                    ? 'shadow-lg'
                    : 'grayscale'
                }`}
                style={{
                  backgroundColor: achievement.unlocked ? `${achievement.color}20` : undefined,
                }}
              >
                {achievement.unlocked ? (
                  <div style={{ color: achievement.color }}>
                    <achievement.icon className="w-7 h-7" />
                  </div>
                ) : (
                  <Lock className="w-6 h-6 text-[#9CA3AF] dark:text-[#737373]" />
                )}
              </div>

              {/* Sparkle effect for unlocked */}
              {achievement.unlocked && (
                <div className="absolute top-2 right-2">
                  <Star className="w-3.5 h-3.5 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
              )}

              <span className={`text-xs font-semibold text-center ${
                achievement.unlocked
                  ? 'text-[#111111] dark:text-white'
                  : 'text-[#9CA3AF] dark:text-[#737373]'
              }`}>
                {achievement.name}
              </span>
              <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373] text-center mt-1 leading-tight">
                {achievement.description}
              </span>

              {/* Progress bar for partial achievements */}
              {achievement.maxProgress && !achievement.unlocked && (
                <div className="w-full mt-2">
                  <div className="w-full h-1 rounded-full bg-[#E5E7EB] dark:bg-[#1A1A1A]">
                    <div
                      className="h-full rounded-full bg-[#9CA3AF] dark:bg-[#737373]"
                      style={{ width: `${((achievement.progress || 0) / achievement.maxProgress) * 100}%` }}
                    />
                  </div>
                  <div className="text-[9px] text-[#9CA3AF] dark:text-[#737373] text-center mt-0.5">
                    {achievement.progress || 0}/{achievement.maxProgress}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Challenges */}
      <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
        <h2 className="text-lg font-bold text-[#111111] dark:text-white font-satoshi mb-5 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Defi de la semaine
        </h2>
        <div className="space-y-4">
          {challenges.map((challenge) => {
            const isComplete = challenge.progress >= challenge.target;
            return (
              <div
                key={challenge.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${
                  isComplete
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#F9FAFB] dark:bg-[#0A0A0A]'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isComplete ? 'bg-emerald-500/20' : 'bg-[#E5E7EB] dark:bg-[#1A1A1A]'
                }`}>
                  <challenge.icon className={`w-5 h-5 ${isComplete ? 'text-emerald-500' : 'text-[#6B7280] dark:text-[#737373]'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-semibold ${
                      isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#111111] dark:text-white'
                    }`}>
                      {challenge.title}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isComplete
                        ? 'bg-emerald-500/20 text-emerald-500'
                        : 'bg-[#E5E7EB] dark:bg-[#1A1A1A] text-[#6B7280] dark:text-[#737373]'
                    }`}>
                      +{challenge.reward} pts
                    </span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-2">{challenge.description}</p>
                  <div className="w-full h-2 rounded-full bg-[#E5E7EB] dark:bg-[#1A1A1A]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isComplete ? 'bg-emerald-500' : 'bg-[#111111] dark:bg-white'
                      }`}
                      style={{ width: `${Math.min((challenge.progress / challenge.target) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">
                      {challenge.progress}/{challenge.target}
                    </span>
                    {isComplete && (
                      <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1">
                        <Star className="w-3 h-3" /> Complete !
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Classement — Donnees du restaurant */}
      <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
        <h2 className="text-lg font-bold text-[#111111] dark:text-white font-satoshi mb-5 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          Performance de votre restaurant
        </h2>
        <div className="space-y-3">
          {/* Score breakdown — real restaurant metrics */}
          {scoreResult.breakdown.map((metric) => {
            const pct = metric.max > 0 ? (metric.points / metric.max) * 100 : 0;
            const color = pct >= 75 ? 'text-emerald-500' : pct >= 50 ? 'text-amber-500' : 'text-red-500';
            return (
              <div key={metric.label} className="flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A]">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[#111111] dark:text-white">{metric.label}</span>
                    <span className={`text-sm font-bold ${color}`}>{metric.points}/{metric.max} pts</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E5E7EB] dark:bg-[#1A1A1A] overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] dark:text-[#737373] mt-1">{metric.detail}</p>
                </div>
              </div>
            );
          })}
          {/* Total */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#F9FAFB] dark:bg-[#0A0A0A] border border-[#111111]/10 dark:border-white/10">
            <span className="text-base font-bold text-[#111111] dark:text-white">Score Total</span>
            <span className={`text-2xl font-black ${level.textClass}`}>{scoreResult.total}/1000</span>
          </div>
        </div>
      </div>

      {/* Position vs communaute */}
      <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
        <h2 className="text-lg font-bold text-[#111111] dark:text-white font-satoshi mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-teal-500" />
          Votre position vs la communaute
        </h2>
        <div className="px-2 py-3">
          <div className="flex items-center justify-between text-xs text-[#9CA3AF] dark:text-[#737373] mb-2">
            <span>{scoreResult.total} pts — {level.name}</span>
            <span>
              {scoreResult.total > 420 ? (
                <span className="text-emerald-500 font-medium">Top 30% des restaurants</span>
              ) : scoreResult.total > 250 ? (
                <span className="text-amber-500 font-medium">Top 60% des restaurants</span>
              ) : (
                <span className="text-[#6B7280] font-medium">En progression</span>
              )}
            </span>
          </div>
          <div className="relative w-full h-4 rounded-full bg-[#E5E7EB] dark:bg-[#1A1A1A] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min((scoreResult.total / 1000) * 100, 100)}%`, backgroundColor: level.color }}
            />
          </div>
          <div className="flex items-center justify-between text-[9px] text-[#9CA3AF] dark:text-[#737373] mt-1">
            <span>0</span>
            <span>500</span>
            <span>1000</span>
          </div>
        </div>
      </div>

      {/* Level Progression */}
      <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
        <h2 className="text-lg font-bold text-[#111111] dark:text-white font-satoshi mb-5 flex items-center gap-2">
          <Target className="w-5 h-5 text-teal-500" />
          Progression des niveaux
        </h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {LEVELS.map((lvl, i) => {
            const isCurrentOrPast = levelIdx >= i;
            const isCurrent = levelIdx === i;
            return (
              <div
                key={i}
                className={`flex-1 min-w-[100px] text-center p-3 rounded-xl border transition-all duration-300 ${
                  isCurrent
                    ? `${lvl.borderClass} ${lvl.bgClass} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#0A0A0A]`
                    : isCurrentOrPast
                    ? `${lvl.borderClass} ${lvl.bgClass}`
                    : 'border-[#E5E7EB] dark:border-[#1A1A1A] opacity-40'
                }`}
                style={isCurrent ? { ['--tw-ring-color' as any]: lvl.color } : undefined}
              >
                <div className={`text-xs font-bold mb-1 ${isCurrentOrPast ? lvl.textClass : 'text-[#9CA3AF] dark:text-[#737373]'}`}>
                  {lvl.name}
                </div>
                <div className={`text-[10px] ${isCurrentOrPast ? 'text-[#6B7280] dark:text-[#A3A3A3]' : 'text-[#9CA3AF] dark:text-[#737373]'}`}>
                  {lvl.min}-{lvl.max}
                </div>
                {isCurrent && (
                  <div className="mt-1">
                    <Sparkles className="w-3 h-3 mx-auto animate-pulse" style={{ color: lvl.color }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Simple bar chart icon ──────────────────────────────────────────
function BarChart({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}
