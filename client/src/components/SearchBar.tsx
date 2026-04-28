import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, X, Clock, ArrowRight } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

// ── Search history helpers ──────────────────────────────────────────────
const MAX_HISTORY = 5;

function getSearchHistory(pageKey: string): string[] {
  try {
    const raw = localStorage.getItem(`rm-search-history-${pageKey}`);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function addSearchHistory(pageKey: string, query: string) {
  if (!query.trim()) return;
  const current = getSearchHistory(pageKey).filter((h) => h !== query);
  current.unshift(query);
  localStorage.setItem(
    `rm-search-history-${pageKey}`,
    JSON.stringify(current.slice(0, MAX_HISTORY))
  );
}

function clearSearchHistory(pageKey: string) {
  localStorage.removeItem(`rm-search-history-${pageKey}`);
}

// ── Suggestion types ────────────────────────────────────────────────────
export interface SearchSuggestion {
  id: string;
  label: string;
  category: string;
  icon?: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
}

// ── Props ───────────────────────────────────────────────────────────────
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  pageKey?: string;
  suggestions?: SearchSuggestion[];
  debounceMs?: number;
  showShortcutHint?: boolean;
}

// ── Highlight match helper ──────────────────────────────────────────────
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="bg-teal-500/20 text-teal-700 dark:text-teal-300 font-semibold rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function SearchBar({
  value,
  onChange,
  onDebouncedChange,
  placeholder = 'Rechercher...',
  className = '',
  pageKey = 'global',
  suggestions = [],
  debounceMs = 300,
  showShortcutHint = true,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debouncedValue = useDebounce(value, debounceMs);

  // Notify parent of debounced value
  useEffect(() => {
    onDebouncedChange?.(debouncedValue);
  }, [debouncedValue, onDebouncedChange]);

  // Load history on focus
  useEffect(() => {
    if (isFocused) {
      setHistory(getSearchHistory(pageKey));
    }
  }, [isFocused, pageKey]);

  // Global "/" shortcut to focus
  useEffect(() => {
    function handleSlash(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if ((e.target as HTMLElement)?.isContentEditable) return;
      if (e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleSlash);
    return () => window.removeEventListener('keydown', handleSlash);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Group suggestions by category
  const groupedSuggestions = useMemo(() => {
    if (!value.trim() || suggestions.length === 0) return [];
    const groups = new Map<string, SearchSuggestion[]>();
    for (const s of suggestions) {
      const list = groups.get(s.category) || [];
      list.push(s);
      groups.set(s.category, list);
    }
    return Array.from(groups.entries()).map(([category, items]) => ({ category, items }));
  }, [suggestions, value]);

  // Show recent history when focused with empty query
  const showHistory = isFocused && !value.trim() && history.length > 0;
  const showSuggestions = isFocused && value.trim() && groupedSuggestions.length > 0;
  const showDropdown = showHistory || showSuggestions;

  // Flat list for keyboard nav
  const flatItems = useMemo(() => {
    if (showHistory) return history.map((h, i) => ({ type: 'history' as const, value: h, id: `h-${i}` }));
    if (showSuggestions) return groupedSuggestions.flatMap((g) => g.items.map((s) => ({ type: 'suggestion' as const, value: s.label, id: s.id, suggestion: s })));
    return [];
  }, [showHistory, showSuggestions, history, groupedSuggestions]);

  // Reset active index when list changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [flatItems.length, value]);

  const handleSubmit = useCallback(() => {
    if (value.trim()) {
      addSearchHistory(pageKey, value.trim());
    }
    setIsFocused(false);
  }, [value, pageKey]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown) {
        if (e.key === 'Enter') handleSubmit();
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((i) => Math.min(i + 1, flatItems.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((i) => Math.max(i - 1, -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < flatItems.length) {
            const item = flatItems[activeIndex];
            if (item.type === 'history') {
              onChange(item.value);
            } else if (item.type === 'suggestion' && 'suggestion' in item) {
              item.suggestion!.onSelect();
              setIsFocused(false);
            }
          } else {
            handleSubmit();
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsFocused(false);
          inputRef.current?.blur();
          break;
      }
    },
    [showDropdown, flatItems, activeIndex, onChange, handleSubmit]
  );

  const handleClearHistory = useCallback(() => {
    clearSearchHistory(pageKey);
    setHistory([]);
  }, [pageKey]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-mono-500 pointer-events-none z-10" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        spellCheck={false}
        className={`
          w-full pl-10 pr-20 py-2.5 text-sm
          bg-[#F9FAFB] dark:bg-mono-50
          border border-mono-900 dark:border-mono-200 rounded-xl
          text-mono-100 dark:text-white
          placeholder-[#9CA3AF] dark:placeholder-mono-400
          outline-none
          transition-all duration-200
          ${isFocused
            ? 'ring-2 ring-mono-100 dark:ring-white border-transparent shadow-sm'
            : 'hover:border-[#D1D5DB] dark:hover:border-[#2A2A2A]'
          }
        `}
      />

      {/* Right side: clear button + shortcut hint */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            className="p-1 rounded-lg hover:bg-mono-900 dark:hover:bg-mono-200 text-[#9CA3AF] dark:text-mono-500 hover:text-mono-100 dark:hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {showShortcutHint && !isFocused && !value && (
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-[#9CA3AF] dark:text-mono-400 bg-mono-950 dark:bg-[#171717] border border-mono-900 dark:border-mono-300 rounded-md">
            /
          </kbd>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-xl shadow-xl shadow-black/5 dark:shadow-black/30 overflow-hidden animate-[sbSlideDown_150ms_ease-out]">
          {/* Recent searches */}
          {showHistory && (
            <>
              <div className="flex items-center justify-between px-3.5 py-2 border-b border-mono-950 dark:border-mono-200">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#9CA3AF] dark:text-mono-400">
                  Recherches recentes
                </span>
                <button
                  onClick={handleClearHistory}
                  className="text-[10px] text-[#9CA3AF] dark:text-mono-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  Effacer
                </button>
              </div>
              {history.map((h, i) => {
                const isActive = activeIndex === i;
                return (
                  <button
                    key={`h-${i}`}
                    onClick={() => {
                      onChange(h);
                      setIsFocused(false);
                    }}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors ${
                      isActive
                        ? 'bg-mono-950 dark:bg-[#171717]'
                        : 'hover:bg-[#F9FAFB] dark:hover:bg-mono-100'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-mono-400 flex-shrink-0" />
                    <span className="text-[#374151] dark:text-mono-700 truncate">{h}</span>
                    <ArrowRight className={`w-3 h-3 ml-auto flex-shrink-0 transition-opacity ${isActive ? 'opacity-100 text-mono-100 dark:text-white' : 'opacity-0'}`} />
                  </button>
                );
              })}
            </>
          )}

          {/* Suggestions */}
          {showSuggestions && (
            <>
              {groupedSuggestions.map((group) => (
                <div key={group.category}>
                  <div className="px-3.5 py-2 border-b border-mono-950 dark:border-mono-200">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-[#9CA3AF] dark:text-mono-400">
                      {group.category}
                    </span>
                  </div>
                  {group.items.map((item) => {
                    const flatIdx = flatItems.findIndex((f) => f.id === item.id);
                    const isActive = flatIdx === activeIndex;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          item.onSelect();
                          setIsFocused(false);
                        }}
                        onMouseEnter={() => setActiveIndex(flatIdx)}
                        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors ${
                          isActive
                            ? 'bg-mono-950 dark:bg-[#171717]'
                            : 'hover:bg-[#F9FAFB] dark:hover:bg-mono-100'
                        }`}
                      >
                        {Icon && <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-[#9CA3AF] dark:text-mono-400'}`} />}
                        <span className="text-[#374151] dark:text-mono-700 truncate">
                          <HighlightMatch text={item.label} query={value} />
                        </span>
                        {isActive && <ArrowRight className="w-3 h-3 ml-auto flex-shrink-0 text-mono-100 dark:text-white" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes sbSlideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
