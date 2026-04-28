import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Save, Trash2, Bookmark, Tag } from 'lucide-react';

// ── Filter type definitions ─────────────────────────────────────────────

export type FilterType = 'text' | 'select' | 'range' | 'date-range' | 'checkbox-group' | 'tags';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterDef {
  key: string;
  label: string;
  type: FilterType;
  placeholder?: string;
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export type FilterValues = Record<string, any>;

export interface FilterPreset {
  name: string;
  values: FilterValues;
}

// ── Preset localStorage helpers ─────────────────────────────────────────

function getPresets(presetKey: string): FilterPreset[] {
  try {
    const raw = localStorage.getItem(`rm-filter-presets-${presetKey}`);
    return raw ? (JSON.parse(raw) as FilterPreset[]) : [];
  } catch {
    return [];
  }
}

function savePreset(presetKey: string, preset: FilterPreset) {
  const current = getPresets(presetKey).filter((p) => p.name !== preset.name);
  current.unshift(preset);
  localStorage.setItem(`rm-filter-presets-${presetKey}`, JSON.stringify(current.slice(0, 10)));
}

function deletePreset(presetKey: string, name: string) {
  const current = getPresets(presetKey).filter((p) => p.name !== name);
  localStorage.setItem(`rm-filter-presets-${presetKey}`, JSON.stringify(current));
}

// ── Count active filters ────────────────────────────────────────────────

function countActiveFilters(values: FilterValues, filters: FilterDef[]): number {
  let count = 0;
  for (const f of filters) {
    const v = values[f.key];
    if (v === undefined || v === null || v === '') continue;
    if (f.type === 'range') {
      if (v?.min || v?.max) count++;
    } else if (f.type === 'date-range') {
      if (v?.from || v?.to) count++;
    } else if (f.type === 'checkbox-group' || f.type === 'tags') {
      if (Array.isArray(v) && v.length > 0) count++;
    } else if (f.type === 'select' && v) {
      count++;
    } else if (f.type === 'text' && v.trim()) {
      count++;
    }
  }
  return count;
}

// ── Props ───────────────────────────────────────────────────────────────

interface FilterPanelProps {
  filters: FilterDef[];
  values: FilterValues;
  onFilterChange: (values: FilterValues) => void;
  presetKey: string;
  className?: string;
}

// ── Single filter renderer ──────────────────────────────────────────────

function FilterField({
  filter,
  value,
  onChange,
}: {
  filter: FilterDef;
  value: any;
  onChange: (val: any) => void;
}) {
  switch (filter.type) {
    case 'text':
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={filter.placeholder || filter.label}
          className="w-full px-3 py-2 text-sm rounded-lg border border-mono-900 dark:border-mono-200 bg-[#F9FAFB] dark:bg-black text-mono-100 dark:text-white placeholder-[#9CA3AF] dark:placeholder-mono-400 outline-none focus:ring-2 focus:ring-mono-100 dark:focus:ring-white focus:border-transparent transition-all"
        />
      );

    case 'select':
      return (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-mono-900 dark:border-mono-200 bg-[#F9FAFB] dark:bg-black text-mono-100 dark:text-white outline-none focus:ring-2 focus:ring-mono-100 dark:focus:ring-white focus:border-transparent transition-all appearance-none"
        >
          <option value="">{filter.placeholder || `Tous`}</option>
          {filter.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case 'range': {
      const rangeVal = value || { min: '', max: '' };
      return (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={rangeVal.min}
            onChange={(e) => onChange({ ...rangeVal, min: e.target.value })}
            placeholder="Min"
            step={filter.step || 0.01}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-mono-900 dark:border-mono-200 bg-[#F9FAFB] dark:bg-black text-mono-100 dark:text-white placeholder-[#9CA3AF] dark:placeholder-mono-400 outline-none focus:ring-2 focus:ring-mono-100 dark:focus:ring-white focus:border-transparent transition-all"
          />
          <span className="text-[#9CA3AF] dark:text-mono-400 text-xs">-</span>
          <input
            type="number"
            value={rangeVal.max}
            onChange={(e) => onChange({ ...rangeVal, max: e.target.value })}
            placeholder="Max"
            step={filter.step || 0.01}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-mono-900 dark:border-mono-200 bg-[#F9FAFB] dark:bg-black text-mono-100 dark:text-white placeholder-[#9CA3AF] dark:placeholder-mono-400 outline-none focus:ring-2 focus:ring-mono-100 dark:focus:ring-white focus:border-transparent transition-all"
          />
          {filter.unit && (
            <span className="text-[#9CA3AF] dark:text-mono-400 text-xs whitespace-nowrap">{filter.unit}</span>
          )}
        </div>
      );
    }

    case 'date-range': {
      const dateVal = value || { from: '', to: '' };
      return (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateVal.from}
            onChange={(e) => onChange({ ...dateVal, from: e.target.value })}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-mono-900 dark:border-mono-200 bg-[#F9FAFB] dark:bg-black text-mono-100 dark:text-white outline-none focus:ring-2 focus:ring-mono-100 dark:focus:ring-white focus:border-transparent transition-all"
          />
          <span className="text-[#9CA3AF] dark:text-mono-400 text-xs">au</span>
          <input
            type="date"
            value={dateVal.to}
            onChange={(e) => onChange({ ...dateVal, to: e.target.value })}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-mono-900 dark:border-mono-200 bg-[#F9FAFB] dark:bg-black text-mono-100 dark:text-white outline-none focus:ring-2 focus:ring-mono-100 dark:focus:ring-white focus:border-transparent transition-all"
          />
        </div>
      );
    }

    case 'checkbox-group': {
      const selected: string[] = Array.isArray(value) ? value : [];
      return (
        <div className="flex flex-wrap gap-1.5">
          {filter.options?.map((opt) => {
            const isChecked = selected.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  if (isChecked) {
                    onChange(selected.filter((v) => v !== opt.value));
                  } else {
                    onChange([...selected, opt.value]);
                  }
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                  isChecked
                    ? 'bg-mono-100 dark:bg-white text-white dark:text-black border-mono-100 dark:border-white'
                    : 'bg-[#F9FAFB] dark:bg-black text-[#6B7280] dark:text-mono-500 border-mono-900 dark:border-mono-200 hover:bg-mono-950 dark:hover:bg-[#171717]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      );
    }

    case 'tags': {
      const selectedTags: string[] = Array.isArray(value) ? value : [];
      return (
        <div className="flex flex-wrap gap-1.5">
          {filter.options?.map((opt) => {
            const isChecked = selectedTags.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  if (isChecked) {
                    onChange(selectedTags.filter((v) => v !== opt.value));
                  } else {
                    onChange([...selectedTags, opt.value]);
                  }
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${
                  isChecked
                    ? 'bg-teal-600 dark:bg-teal-500 text-white border-teal-600 dark:border-teal-500'
                    : 'bg-[#F9FAFB] dark:bg-black text-[#6B7280] dark:text-mono-500 border-mono-900 dark:border-mono-200 hover:bg-mono-950 dark:hover:bg-[#171717]'
                }`}
              >
                <Tag className="w-3 h-3" />
                {opt.label}
              </button>
            );
          })}
        </div>
      );
    }

    default:
      return null;
  }
}

// ── Main FilterPanel component ──────────────────────────────────────────

export default function FilterPanel({
  filters,
  values,
  onFilterChange,
  presetKey,
  className = '',
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);
  const presetDropdownRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const activeCount = useMemo(() => countActiveFilters(values, filters), [values, filters]);

  // Load presets
  useEffect(() => {
    setPresets(getPresets(presetKey));
  }, [presetKey]);

  // Close preset dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (presetDropdownRef.current && !presetDropdownRef.current.contains(e.target as Node)) {
        setShowPresetDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFieldChange = useCallback(
    (key: string, val: any) => {
      onFilterChange({ ...values, [key]: val });
    },
    [values, onFilterChange]
  );

  const handleClearAll = useCallback(() => {
    const cleared: FilterValues = {};
    for (const f of filters) {
      if (f.type === 'range') cleared[f.key] = { min: '', max: '' };
      else if (f.type === 'date-range') cleared[f.key] = { from: '', to: '' };
      else if (f.type === 'checkbox-group' || f.type === 'tags') cleared[f.key] = [];
      else cleared[f.key] = '';
    }
    onFilterChange(cleared);
  }, [filters, onFilterChange]);

  const handleSavePreset = useCallback(() => {
    if (!presetName.trim()) return;
    const preset: FilterPreset = { name: presetName.trim(), values: { ...values } };
    savePreset(presetKey, preset);
    setPresets(getPresets(presetKey));
    setPresetName('');
    setShowSaveDialog(false);
  }, [presetName, values, presetKey]);

  const handleLoadPreset = useCallback(
    (preset: FilterPreset) => {
      onFilterChange({ ...preset.values });
      setShowPresetDropdown(false);
      if (!isOpen) setIsOpen(true);
    },
    [onFilterChange, isOpen]
  );

  const handleDeletePreset = useCallback(
    (name: string) => {
      deletePreset(presetKey, name);
      setPresets(getPresets(presetKey));
    },
    [presetKey]
  );

  return (
    <div className={className}>
      {/* Toggle button row */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
            isOpen || activeCount > 0
              ? 'bg-mono-100 dark:bg-white text-white dark:text-black border-mono-100 dark:border-white shadow-sm'
              : 'bg-white dark:bg-mono-50 text-[#6B7280] dark:text-mono-700 border-mono-900 dark:border-mono-200 hover:bg-mono-950 dark:hover:bg-[#171717]'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filtres</span>
          {activeCount > 0 && (
            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
              isOpen || activeCount > 0
                ? 'bg-white dark:bg-black text-mono-100 dark:text-white'
                : 'bg-red-500 text-white'
            }`}>
              {activeCount}
            </span>
          )}
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Preset buttons */}
        {presets.length > 0 && (
          <div ref={presetDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setShowPresetDropdown(!showPresetDropdown)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-mono-900 dark:border-mono-200 bg-white dark:bg-mono-50 text-[#6B7280] dark:text-mono-700 text-sm font-medium hover:bg-mono-950 dark:hover:bg-[#171717] transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Presets</span>
            </button>
            {showPresetDropdown && (
              <div className="absolute top-full left-0 mt-1.5 z-40 w-64 bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-xl shadow-xl overflow-hidden animate-[fpSlideDown_150ms_ease-out]">
                <div className="px-3 py-2 border-b border-mono-950 dark:border-mono-200">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#9CA3AF] dark:text-mono-400">
                    Filtres sauvegardes
                  </span>
                </div>
                {presets.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-2 px-3 py-2.5 hover:bg-[#F9FAFB] dark:hover:bg-mono-100 transition-colors group"
                  >
                    <button
                      onClick={() => handleLoadPreset(p)}
                      className="flex-1 text-left text-sm text-[#374151] dark:text-mono-700 truncate"
                    >
                      {p.name}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePreset(p.name);
                      }}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active count + clear */}
        {activeCount > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Effacer les filtres
          </button>
        )}
      </div>

      {/* Collapsible filter panel */}
      <div
        ref={panelRef}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[800px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
        }`}
      >
        <div className="bg-white dark:bg-mono-50 rounded-2xl border border-mono-900 dark:border-mono-200 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-[#6B7280] dark:text-mono-500 mb-1.5 uppercase tracking-wide">
                  {f.label}
                </label>
                <FilterField
                  filter={f}
                  value={values[f.key]}
                  onChange={(val) => handleFieldChange(f.key, val)}
                />
              </div>
            ))}
          </div>

          {/* Bottom bar: save preset */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-mono-950 dark:border-mono-200">
            {!showSaveDialog ? (
              <button
                type="button"
                onClick={() => setShowSaveDialog(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9CA3AF] dark:text-mono-400 hover:text-mono-100 dark:hover:text-white transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                Sauvegarder ce filtre
              </button>
            ) : (
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
                  placeholder="Nom du preset..."
                  autoFocus
                  className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-mono-900 dark:border-mono-200 bg-[#F9FAFB] dark:bg-black text-mono-100 dark:text-white placeholder-[#9CA3AF] dark:placeholder-mono-400 outline-none focus:ring-2 focus:ring-mono-100 dark:focus:ring-white"
                />
                <button
                  type="button"
                  onClick={handleSavePreset}
                  disabled={!presetName.trim()}
                  className="px-3 py-1.5 text-xs font-semibold bg-mono-100 dark:bg-white text-white dark:text-black rounded-lg hover:bg-[#333333] dark:hover:bg-mono-900 disabled:opacity-40 transition-colors"
                >
                  Sauvegarder
                </button>
                <button
                  type="button"
                  onClick={() => { setShowSaveDialog(false); setPresetName(''); }}
                  className="p-1.5 rounded-lg text-[#9CA3AF] hover:bg-mono-950 dark:hover:bg-[#171717] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="text-[11px] text-[#9CA3AF] dark:text-mono-400">
              {activeCount > 0 ? `${activeCount} filtre${activeCount > 1 ? 's' : ''} actif${activeCount > 1 ? 's' : ''}` : 'Aucun filtre actif'}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: full-screen overlay when open on small screens */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-mono-50 sm:hidden overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white dark:bg-mono-50 border-b border-mono-900 dark:border-mono-200">
            <h3 className="text-base font-semibold text-mono-100 dark:text-white">Filtres avances</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl hover:bg-mono-950 dark:hover:bg-[#171717] transition-colors"
            >
              <X className="w-5 h-5 text-mono-100 dark:text-white" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            {filters.map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-[#6B7280] dark:text-mono-500 mb-2 uppercase tracking-wide">
                  {f.label}
                </label>
                <FilterField
                  filter={f}
                  value={values[f.key]}
                  onChange={(val) => handleFieldChange(f.key, val)}
                />
              </div>
            ))}
          </div>
          <div className="sticky bottom-0 p-4 bg-white dark:bg-mono-50 border-t border-mono-900 dark:border-mono-200 flex gap-3">
            <button
              onClick={handleClearAll}
              className="flex-1 py-3 text-sm font-medium text-[#6B7280] dark:text-mono-700 rounded-xl border border-mono-900 dark:border-mono-200"
            >
              Effacer tout
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 text-sm font-semibold bg-mono-100 dark:bg-white text-white dark:text-black rounded-xl"
            >
              Appliquer ({activeCount})
            </button>
          </div>
        </div>
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes fpSlideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── Re-export types for convenience ─────────────────────────────────────
export { countActiveFilters };
