import { Medal, Award, Crown, Sparkles } from 'lucide-react';
import { useLevelStats, LEVELS } from '../hooks/useLevelStats';

// Lightweight sidebar badge. Reads cached score + minimal API call,
// avoids pulling the full Gamification page (~80 KB) into the main bundle.
export default function SidebarLevelBadge() {
  const { score, loading, level, levelIndex } = useLevelStats();

  if (loading || score === 0) return null;

  const isMaxLevel = levelIndex === LEVELS.length - 1;
  const progress = level.max > level.min ? (score - level.min) / (level.max - level.min) : 1;

  return (
    <div className={`mx-3 mb-3 px-3 py-2.5 rounded-lg border ${level.borderClass} ${level.bgClass} transition-all duration-300`}>
      <div className="flex items-center gap-2.5">
        <div className="relative">
          {levelIndex === 0 && <Medal className={`w-5 h-5 ${level.textClass}`} />}
          {levelIndex === 1 && <Medal className={`w-5 h-5 ${level.textClass}`} />}
          {levelIndex === 2 && <Award className={`w-5 h-5 ${level.textClass}`} />}
          {levelIndex === 3 && <Crown className={`w-5 h-5 ${level.textClass}`} />}
          {isMaxLevel && (
            <>
              <Crown className={`w-5 h-5 ${level.textClass}`} />
              <Sparkles className="w-3 h-3 text-cyan-400 absolute -top-1 -right-1 animate-pulse" />
            </>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-xs font-semibold ${level.textClass} truncate sidebar-label`}>{level.name}</div>
          <div className="w-full h-1 rounded-full bg-mono-900 dark:bg-mono-200 mt-1 sidebar-label">
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
