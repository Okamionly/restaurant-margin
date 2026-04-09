import { useEffect, useRef, useState } from 'react';
import { X, Activity } from 'lucide-react';
import { useCollaboration, formatAuditMessage } from '../hooks/useCollaboration';

/**
 * CollaborationToast — shows brief toasts when teammates perform actions.
 * Auto-dismisses after 5s. Renders floating bottom-right, above the standard toast area.
 */
export default function CollaborationToast() {
  const { recentAudit, dismissAudit } = useCollaboration();
  const [visibleIds, setVisibleIds] = useState<Set<number>>(new Set());
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  // Show new entries
  useEffect(() => {
    for (const entry of recentAudit) {
      if (!visibleIds.has(entry.id)) {
        setVisibleIds(prev => new Set(prev).add(entry.id));

        // Auto-dismiss after 5s
        const timer = setTimeout(() => {
          setVisibleIds(prev => {
            const next = new Set(prev);
            next.delete(entry.id);
            return next;
          });
          dismissAudit(entry.id);
        }, 5000);
        timersRef.current.set(entry.id, timer);
      }
    }

    return () => {
      // Cleanup timers
      for (const timer of timersRef.current.values()) {
        clearTimeout(timer);
      }
    };
  }, [recentAudit, dismissAudit]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDismiss = (id: number) => {
    const timer = timersRef.current.get(id);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(id);
    setVisibleIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    dismissAudit(id);
  };

  const visibleEntries = recentAudit.filter(e => visibleIds.has(e.id)).slice(-3);

  if (visibleEntries.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 z-[95] flex flex-col gap-2 max-w-sm">
      {visibleEntries.map(entry => (
        <div
          key={entry.id}
          className="flex items-center gap-3 px-3 py-2.5 bg-white dark:bg-[#111111] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl shadow-lg animate-toast-in"
        >
          <div className="w-7 h-7 rounded-full bg-[#F3F4F6] dark:bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
            <Activity className="w-3.5 h-3.5 text-[#6B7280] dark:text-[#A3A3A3]" />
          </div>
          <span className="text-[12px] text-[#374151] dark:text-[#D4D4D4] flex-1 min-w-0 truncate">
            {formatAuditMessage(entry)}
          </span>
          <button
            onClick={() => handleDismiss(entry.id)}
            className="p-0.5 rounded hover:bg-[#F3F4F6] dark:hover:bg-[#1A1A1A] text-[#9CA3AF] dark:text-[#737373] flex-shrink-0 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
