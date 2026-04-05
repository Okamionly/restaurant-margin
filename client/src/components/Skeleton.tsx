/**
 * Skeleton loading components with pulse animation.
 * Used as fallback during data loading.
 */

interface SkeletonProps {
  className?: string;
}

/** Base skeleton bar */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[#E5E7EB] dark:bg-[#1A1A1A] rounded-lg ${className}`}
    />
  );
}

/** Skeleton card — mimics a stats/metric card */
export function SkeletonCard({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  );
}

/** Skeleton table — mimics a data table with rows */
export function SkeletonTable({ rows = 5, className = '' }: SkeletonProps & { rows?: number }) {
  return (
    <div
      className={`bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden ${className}`}
    >
      {/* Header row */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/5" />
        <Skeleton className="h-4 w-1/6" />
        <Skeleton className="h-4 w-1/6" />
        <Skeleton className="h-4 w-1/6" />
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-6 py-3.5 border-b border-[#F3F4F6] dark:border-[#171717] last:border-b-0"
        >
          <Skeleton className="h-3.5 w-1/4" />
          <Skeleton className="h-3.5 w-1/5" />
          <Skeleton className="h-3.5 w-1/6" />
          <Skeleton className="h-3.5 w-1/6" />
          <Skeleton className="h-3.5 w-1/6" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton text block — mimics a paragraph of text */
export function SkeletonText({ lines = 3, className = '' }: SkeletonProps & { lines?: number }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export default Skeleton;
