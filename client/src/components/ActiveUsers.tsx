import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCollaboration, getPageName, getAvatarColor, getInitials } from '../hooks/useCollaboration';
import { Users } from 'lucide-react';

/**
 * ActiveUsers — shows avatar dots for connected team members.
 * Placed in the sidebar, below the restaurant selector.
 */
export default function ActiveUsers() {
  const { activeUsers, activeCount } = useCollaboration();
  const location = useLocation();
  const currentPage = location.pathname;
  const [hoveredUserId, setHoveredUserId] = useState<number | null>(null);

  if (activeUsers.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      {/* Avatar stack */}
      <div className="flex -space-x-2">
        {activeUsers.slice(0, 5).map((u) => {
          const samePage = (() => {
            const uBase = '/' + u.page.split('/').filter(Boolean)[0];
            const myBase = '/' + currentPage.split('/').filter(Boolean)[0];
            return uBase === myBase;
          })();
          const initials = getInitials(u.name);
          const pageName = getPageName(u.page);

          return (
            <div
              key={u.userId}
              className="relative"
              onMouseEnter={() => setHoveredUserId(u.userId)}
              onMouseLeave={() => setHoveredUserId(null)}
            >
              {/* Avatar */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-black cursor-default transition-transform hover:scale-110 hover:z-10"
                style={{ backgroundColor: getAvatarColor(u.userId), color: '#FFFFFF' }}
              >
                {initials}
              </div>

              {/* Online dot */}
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-black ${
                  samePage ? 'bg-emerald-500' : 'bg-[#9CA3AF] dark:bg-mono-500'
                }`}
              />

              {/* Tooltip */}
              {hoveredUserId === u.userId && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-mono-100 dark:bg-white text-white dark:text-black text-[11px] font-medium rounded-lg whitespace-nowrap z-50 shadow-lg pointer-events-none">
                  {u.name} — {pageName}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-mono-100 dark:border-t-white" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overflow count */}
      {activeUsers.length > 5 && (
        <span className="text-[11px] font-medium text-[#9CA3AF] dark:text-mono-500">
          +{activeUsers.length - 5}
        </span>
      )}

      {/* Connected count badge */}
      {activeCount > 0 && (
        <span className="ml-auto flex items-center gap-1 text-[11px] font-medium text-[#6B7280] dark:text-mono-700 bg-mono-950 dark:bg-[#171717] px-2 py-0.5 rounded-full">
          <Users className="w-3 h-3" />
          {activeCount}
        </span>
      )}
    </div>
  );
}

/**
 * ConnectedBadge — "X personnes connectees" badge for next to restaurant name.
 */
export function ConnectedBadge() {
  const { activeCount } = useCollaboration();

  if (activeCount <= 1) return null;

  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      {activeCount} connecte{activeCount > 1 ? 's' : ''}
    </span>
  );
}

/**
 * PageActivityDot — small green dot if another user is on a given page.
 * Use: <PageActivityDot path="/recipes" />
 */
export function PageActivityDot({ path }: { path: string }) {
  const { pagesWithUsers } = useCollaboration();

  // Normalize: check if anyone is on a route that starts with the same base
  const base = '/' + path.split('/').filter(Boolean)[0];

  // Check if any page in the set matches this base
  let hasUser = false;
  for (const p of pagesWithUsers) {
    const pBase = '/' + p.split('/').filter(Boolean)[0];
    if (pBase === base) {
      hasUser = true;
      break;
    }
  }

  if (!hasUser) return null;

  return (
    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
  );
}
