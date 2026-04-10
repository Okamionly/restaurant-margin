/**
 * Skeleton — Reusable loading placeholder with shimmer animation.
 * W&B theme: white/black backgrounds with subtle shimmer.
 *
 * Usage:
 *   <Skeleton className="h-8 w-48" />            — single line
 *   <Skeleton variant="card" />                   — full card skeleton
 *   <Skeleton variant="table-row" cols={5} />     — table row
 *   <SkeletonDashboard />                         — full dashboard loading state
 *   <SkeletonRecipeList />                        — recipe list loading state
 *   <SkeletonInventory />                         — inventory loading state
 */

interface SkeletonProps {
  className?: string;
  variant?: 'line' | 'circle' | 'card' | 'table-row';
  cols?: number;
}

export default function Skeleton({ className = '', variant = 'line', cols = 4 }: SkeletonProps) {
  const base = 'skeleton rounded-lg';

  if (variant === 'circle') {
    return <div className={`${base} rounded-full ${className || 'w-10 h-10'}`} />;
  }

  if (variant === 'card') {
    return (
      <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
        <div className={`${base} h-4 w-24 mb-3`} />
        <div className={`${base} h-8 w-32 mb-4`} />
        <div className={`${base} h-3 w-full mb-2`} />
        <div className={`${base} h-3 w-3/4`} />
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <div className="flex items-center gap-4 py-3 px-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className={`${base} h-4 flex-1`} />
        ))}
      </div>
    );
  }

  // Default line
  return <div className={`${base} ${className || 'h-4 w-full'}`} />;
}

/** Dashboard loading skeleton */
export function SkeletonDashboard() {
  return (
    <div className="p-6 space-y-6 animate-premium-page-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="card" />
        ))}
      </div>

      {/* Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
          <Skeleton className="h-5 w-40 mb-4" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
          <Skeleton className="h-5 w-40 mb-4" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/** Recipe list loading skeleton */
export function SkeletonRecipeList() {
  return (
    <div className="p-6 space-y-4 animate-premium-page-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-40 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Search bar */}
      <Skeleton className="h-11 w-full max-w-md rounded-xl mb-4" />

      {/* Recipe cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
            <Skeleton className="h-32 w-full rounded-xl mb-4" />
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-3" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Inventory / Ingredients loading skeleton */
export function SkeletonInventory() {
  return (
    <div className="p-6 space-y-4 animate-premium-page-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* Search + filters */}
      <div className="flex gap-3 mb-4">
        <Skeleton className="h-11 flex-1 max-w-sm rounded-xl" />
        <Skeleton className="h-11 w-32 rounded-xl" />
        <Skeleton className="h-11 w-32 rounded-xl" />
      </div>

      {/* Table header */}
      <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] rounded-xl overflow-hidden">
        <Skeleton variant="table-row" cols={5} />
        {/* Table rows */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
            <Skeleton variant="table-row" cols={5} />
          </div>
        ))}
      </div>
    </div>
  );
}
