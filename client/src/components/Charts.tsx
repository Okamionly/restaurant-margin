import { formatCurrency } from '../utils/currency';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// Premium Chart Components — CSS-only / SVG — No external chart libraries
// W&B theme: pure white / pure black, teal accents
// ═══════════════════════════════════════════════════════════════════════════

// ── Shared animated counter hook ──────────────────────────────────────────
function useAnimatedValue(target: number, duration = 800, enabled = true) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!enabled) { setValue(target); return; }
    const start = value;
    const diff = target - start;
    if (Math.abs(diff) < 0.01) { setValue(target); return; }
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(start + diff * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, enabled]);

  return value;
}

// ── Intersection Observer for mount animation ─────────────────────────────
function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.2) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. AnimatedDonut — CSS conic-gradient donut chart
// ═══════════════════════════════════════════════════════════════════════════
export interface DonutDataItem {
  label: string;
  value: number;
  color: string;
}

interface AnimatedDonutProps {
  data: DonutDataItem[];
  size?: number;
  showLegend?: boolean;
  animated?: boolean;
  centerLabel?: string;
  centerValue?: number;
  centerSuffix?: string;
  formatValue?: (v: number) => string;
}

export function AnimatedDonut({
  data,
  size = 200,
  showLegend = true,
  animated = true,
  centerLabel,
  centerValue,
  centerSuffix = '',
  formatValue = (v) => v.toFixed(0),
}: AnimatedDonutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [animProgress, setAnimProgress] = useState(0);

  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);
  const animatedCenter = useAnimatedValue(centerValue ?? total, 1000, animated && inView);

  // Entrance animation
  useEffect(() => {
    if (!animated || !inView) { setAnimProgress(1); return; }
    setAnimProgress(0);
    const startTime = performance.now();
    const dur = 900;
    let raf: number;
    const step = (now: number) => {
      const p = Math.min((now - startTime) / dur, 1);
      setAnimProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [animated, inView]);

  // Build conic-gradient
  const gradient = useMemo(() => {
    if (total === 0) return 'conic-gradient(#E5E7EB 0deg 360deg)';
    const effectiveTotal = total / animProgress || total;
    let acc = 0;
    const stops: string[] = [];
    data.forEach((d) => {
      const startDeg = (acc / effectiveTotal) * 360 * animProgress;
      acc += d.value;
      const endDeg = (acc / effectiveTotal) * 360 * animProgress;
      stops.push(`${d.color} ${startDeg}deg ${endDeg}deg`);
    });
    // Fill remaining with transparent if animating
    if (animProgress < 1) {
      const endDeg = 360 * animProgress;
      stops.push(`#E5E7EB33 ${endDeg}deg 360deg`);
    }
    return `conic-gradient(${stops.join(', ')})`;
  }, [data, total, animProgress]);

  // Compute segment angles for hover detection
  const segments = useMemo(() => {
    let acc = 0;
    return data.map((d) => {
      const start = total > 0 ? (acc / total) * 360 : 0;
      acc += d.value;
      const end = total > 0 ? (acc / total) * 360 : 0;
      return { ...d, startDeg: start, endDeg: end };
    });
  }, [data, total]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const x = e.clientX - rect.left - cx;
    const y = e.clientY - rect.top - cy;
    const dist = Math.sqrt(x * x + y * y);
    const outerR = size / 2;
    const innerR = outerR * 0.6;

    if (dist < innerR || dist > outerR) {
      setHoveredIndex(null);
      return;
    }

    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    const idx = segments.findIndex(s => angle >= s.startDeg && angle < s.endDeg);
    setHoveredIndex(idx >= 0 ? idx : null);
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, [segments, size]);

  const holeSize = size * 0.6;

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-4">
      {/* Donut ring */}
      <div
        className="relative cursor-pointer"
        style={{ width: size, height: size }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full transition-transform duration-300"
          style={{
            background: gradient,
            transform: hoveredIndex !== null ? 'scale(1.03)' : 'scale(1)',
          }}
        />
        {/* Inner hole */}
        <div
          className="absolute rounded-full bg-white dark:bg-mono-50 flex flex-col items-center justify-center"
          style={{
            width: holeSize,
            height: holeSize,
            top: (size - holeSize) / 2,
            left: (size - holeSize) / 2,
          }}
        >
          <span className="text-2xl font-black font-satoshi text-mono-100 dark:text-white tabular-nums">
            {animated ? animatedCenter.toFixed(0) : formatValue(centerValue ?? total)}{centerSuffix}
          </span>
          {centerLabel && (
            <span className="text-xs text-[#9CA3AF] dark:text-mono-500 font-general-sans">{centerLabel}</span>
          )}
        </div>

        {/* Hover tooltip */}
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div
            className="absolute z-50 pointer-events-none bg-white dark:bg-mono-50 shadow-xl rounded-lg px-3 py-2 border border-mono-900 dark:border-mono-200 text-sm whitespace-nowrap"
            style={{
              left: tooltipPos.x + 12,
              top: tooltipPos.y - 8,
              transform: 'translateY(-100%)',
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: data[hoveredIndex].color }} />
              <span className="font-semibold text-mono-100 dark:text-white">{data[hoveredIndex].label}</span>
            </div>
            <div className="text-[#6B7280] dark:text-mono-700 mt-0.5">
              {formatValue(data[hoveredIndex].value)} ({total > 0 ? ((data[hoveredIndex].value / total) * 100).toFixed(1) : 0}%)
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
          {data.map((d, i) => (
            <div
              key={i}
              className={`flex items-center gap-1.5 text-xs transition-opacity duration-200 ${
                hoveredIndex !== null && hoveredIndex !== i ? 'opacity-40' : 'opacity-100'
              }`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-[#6B7280] dark:text-mono-700 font-general-sans">{d.label}</span>
              <span className="font-semibold text-mono-100 dark:text-white tabular-nums">{formatValue(d.value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. SparklineChart — tiny inline SVG sparkline
// ═══════════════════════════════════════════════════════════════════════════
interface SparklineChartProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  showTooltip?: boolean;
}

export function SparklineChart({
  data,
  color,
  width = 80,
  height = 24,
  showTooltip = true,
}: SparklineChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  if (!data.length) return null;

  const isUp = data.length >= 2 && data[data.length - 1] >= data[0];
  const lineColor = color || (isUp ? '#16a34a' : '#dc2626');
  const fillColor = color || (isUp ? '#16a34a' : '#dc2626');

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = padding + (1 - (v - min) / range) * (height - padding * 2);
    return { x, y, value: v };
  });

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPath = `M${points[0].x},${height} ` +
    points.map(p => `L${p.x},${p.y}`).join(' ') +
    ` L${points[points.length - 1].x},${height} Z`;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!showTooltip || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const idx = Math.round(((mx - padding) / (width - padding * 2)) * (data.length - 1));
    setHoverIdx(Math.max(0, Math.min(data.length - 1, idx)));
  };

  return (
    <div className="relative inline-block">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        {/* Gradient fill */}
        <defs>
          <linearGradient id={`spark-grad-${lineColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColor} stopOpacity={0.3} />
            <stop offset="100%" stopColor={fillColor} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#spark-grad-${lineColor.replace('#', '')})`} />
        <polyline
          points={polyline}
          fill="none"
          stroke={lineColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Hover dot */}
        {hoverIdx !== null && points[hoverIdx] && (
          <circle
            cx={points[hoverIdx].x}
            cy={points[hoverIdx].y}
            r={3}
            fill={lineColor}
            stroke="white"
            strokeWidth={1.5}
          />
        )}
      </svg>
      {/* Tooltip */}
      {showTooltip && hoverIdx !== null && points[hoverIdx] && (
        <div
          className="absolute z-50 pointer-events-none bg-white dark:bg-mono-50 shadow-lg rounded px-2 py-1 border border-mono-900 dark:border-mono-200 text-[10px] font-semibold tabular-nums whitespace-nowrap"
          style={{
            left: points[hoverIdx].x,
            top: points[hoverIdx].y - 28,
            transform: 'translateX(-50%)',
            color: lineColor,
          }}
        >
          {data[hoverIdx].toFixed(1)}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. ProgressRing — circular progress with animated stroke
// ═══════════════════════════════════════════════════════════════════════════
interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  animated?: boolean;
  showPercent?: boolean;
  formatValue?: (pct: number) => string;
}

function getProgressColor(pct: number): string {
  if (pct < 25) return '#dc2626';  // red
  if (pct < 50) return '#f59e0b';  // amber
  if (pct < 75) return '#eab308';  // yellow
  return '#16a34a';                 // green
}

export function ProgressRing({
  value,
  max = 100,
  size = 64,
  strokeWidth = 5,
  label,
  animated = true,
  showPercent = true,
  formatValue,
}: ProgressRingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef);
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const animatedPct = useAnimatedValue(pct, 800, animated && inView);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPct / 100) * circumference;
  const color = getProgressColor(animatedPct);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            className="dark:stroke-mono-300"
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: animated ? 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1), stroke 0.3s' : 'none' }}
          />
        </svg>
        {/* Center text */}
        {showPercent && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-bold tabular-nums font-satoshi"
              style={{
                fontSize: size < 48 ? 10 : size < 72 ? 12 : 14,
                color,
              }}
            >
              {formatValue ? formatValue(animatedPct) : `${Math.round(animatedPct)}%`}
            </span>
          </div>
        )}
      </div>
      {label && (
        <span className="text-[10px] text-[#9CA3AF] dark:text-mono-500 font-general-sans text-center leading-tight max-w-[80px] truncate">
          {label}
        </span>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. BarChart (CSS-only) — horizontal animated bars
// ═══════════════════════════════════════════════════════════════════════════
export interface BarDataItem {
  label: string;
  value: number;
  color?: string;
  suffix?: string;
}

interface BarChartProps {
  data: BarDataItem[];
  maxWidth?: number;
  animated?: boolean;
  sorted?: boolean;
  showValues?: boolean;
  formatValue?: (v: number) => string;
  barHeight?: number;
}

export function CSSBarChart({
  data,
  animated = true,
  sorted = true,
  showValues = true,
  formatValue = (v) => v.toFixed(1),
  barHeight = 28,
}: BarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const sortedData = useMemo(() => {
    const d = data.map((item, i) => ({ ...item, _origIdx: i }));
    if (sorted) d.sort((a, b) => b.value - a.value);
    return d;
  }, [data, sorted]);

  const maxVal = useMemo(() => Math.max(...data.map(d => d.value), 1), [data]);

  const defaultColors = ['#0d9488', '#2563eb', '#7c3aed', '#d97706', '#dc2626', '#059669', '#e11d48', '#0891b2'];

  return (
    <div ref={containerRef} className="space-y-2">
      {sortedData.map((item, i) => {
        const pct = (item.value / maxVal) * 100;
        const barColor = item.color || defaultColors[i % defaultColors.length];
        const isHovered = hoveredIdx === i;

        return (
          <div
            key={item.label}
            className="group cursor-pointer"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-medium transition-colors duration-200 ${
                isHovered ? 'text-mono-100 dark:text-white' : 'text-[#6B7280] dark:text-mono-700'
              } font-general-sans truncate max-w-[60%]`}>
                {item.label}
              </span>
              {showValues && (
                <span
                  className="text-xs font-bold tabular-nums transition-colors duration-200"
                  style={{ color: isHovered ? barColor : '#9CA3AF' }}
                >
                  {formatValue(item.value)}{item.suffix || ''}
                </span>
              )}
            </div>
            <div
              className="w-full rounded-full overflow-hidden bg-mono-950 dark:bg-[#171717]"
              style={{ height: barHeight > 20 ? 8 : 6 }}
            >
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: animated && inView ? `${pct}%` : '0%',
                  backgroundColor: barColor,
                  opacity: isHovered ? 1 : 0.8,
                  transitionDelay: animated ? `${i * 60}ms` : '0ms',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. TrendIndicator — compact trend with arrow + sparkline
// ═══════════════════════════════════════════════════════════════════════════
interface TrendIndicatorProps {
  current: number;
  previous: number;
  format?: 'percent' | 'currency' | 'number';
  label?: string;
  sparkData?: number[];
  invertColors?: boolean; // true = lower is better (e.g., costs)
}

export function TrendIndicator({
  current,
  previous,
  format = 'number',
  label,
  sparkData,
  invertColors = false,
}: TrendIndicatorProps) {
  const changePct = previous !== 0 ? ((current - previous) / Math.abs(previous)) * 100 : 0;
  const isUp = changePct > 0;
  const isPositive = invertColors ? !isUp : isUp;
  const colorClass = Math.abs(changePct) < 0.5
    ? 'text-[#9CA3AF]'
    : isPositive
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-red-600 dark:text-red-400';

  const formatVal = (v: number) => {
    if (format === 'percent') return `${v.toFixed(1)}%`;
    if (format === 'currency') return formatCurrency(v);
    return v.toFixed(1);
  };

  return (
    <div className="flex items-center gap-2">
      {sparkData && sparkData.length > 2 && (
        <SparklineChart
          data={sparkData}
          width={48}
          height={18}
          color={isPositive ? '#16a34a' : '#dc2626'}
          showTooltip={false}
        />
      )}
      <div className="flex flex-col">
        {label && <span className="text-[10px] text-[#9CA3AF] dark:text-mono-500 font-general-sans">{label}</span>}
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-mono-100 dark:text-white tabular-nums font-satoshi">
            {formatVal(current)}
          </span>
          <div className={`flex items-center gap-0.5 text-xs font-semibold ${colorClass}`}>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className={`transition-transform ${isUp ? '' : 'rotate-180'}`}
            >
              <path d="M5 1L9 6H1L5 1Z" fill="currentColor" />
            </svg>
            <span className="tabular-nums">{Math.abs(changePct).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. HeatmapGrid — calendar-style heatmap
// ═══════════════════════════════════════════════════════════════════════════
export interface HeatmapDataPoint {
  date: string; // YYYY-MM-DD
  value: number;
}

interface HeatmapGridProps {
  data: HeatmapDataPoint[];
  colorScale?: [string, string, string, string, string]; // 5 intensity levels
  cellSize?: number;
  cellGap?: number;
  showLabels?: boolean;
  formatTooltip?: (date: string, value: number) => string;
  onCellClick?: (date: string) => void;
  selectedDate?: string | null;
}

function getHeatLevel(value: number, maxVal: number): number {
  if (value <= 0) return 0;
  if (maxVal <= 0) return 0;
  const ratio = value / maxVal;
  if (ratio < 0.2) return 1;
  if (ratio < 0.4) return 2;
  if (ratio < 0.7) return 3;
  return 4;
}

export function HeatmapGrid({
  data,
  colorScale = ['#16a34a11', '#16a34a44', '#eab30866', '#f97316aa', '#dc2626cc'],
  cellSize = 44,
  cellGap = 4,
  showLabels = true,
  formatTooltip,
  onCellClick,
  selectedDate,
}: HeatmapGridProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Build lookup
  const dataMap = useMemo(() => {
    const m: Record<string, number> = {};
    data.forEach(d => { m[d.date] = (m[d.date] || 0) + d.value; });
    return m;
  }, [data]);

  const maxVal = useMemo(() => Math.max(...Object.values(dataMap), 1), [dataMap]);

  // Generate grid: last 35 days organized by day of week
  const grid = useMemo(() => {
    const days: { date: string; dayOfWeek: number; dayNum: number; weekday: string; value: number }[] = [];
    const today = new Date();
    for (let i = 34; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        dayOfWeek: d.getDay(),
        dayNum: d.getDate(),
        weekday: d.toLocaleDateString('fr-FR', { weekday: 'short' }).slice(0, 2),
        value: dataMap[dateStr] || 0,
      });
    }
    return days;
  }, [dataMap]);

  const handleMouseEnter = (e: React.MouseEvent, date: string) => {
    setHoveredDate(date);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const defaultFormatTooltip = (date: string, value: number) => {
    const d = new Date(date);
    return `${d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}: ${formatCurrency(value)}`;
  };

  const tooltipFn = formatTooltip || defaultFormatTooltip;

  return (
    <div ref={containerRef} className="relative">
      {/* Grid */}
      <div
        className="grid gap-[var(--gap)]"
        style={{
          '--gap': `${cellGap}px`,
          gridTemplateColumns: `repeat(auto-fill, ${cellSize}px)`,
        } as React.CSSProperties}
      >
        {grid.map((day) => {
          const level = getHeatLevel(day.value, maxVal);
          const isSelected = selectedDate === day.date;
          const isToday = day.date === todayStr;
          const isHovered = hoveredDate === day.date;

          return (
            <button
              key={day.date}
              onClick={() => onCellClick?.(day.date)}
              onMouseEnter={(e) => handleMouseEnter(e, day.date)}
              onMouseLeave={() => setHoveredDate(null)}
              className={`relative flex flex-col items-center justify-center rounded-lg transition-all duration-200 ${
                isSelected ? 'ring-2 ring-mono-100 dark:ring-white scale-110 z-10' :
                isHovered ? 'scale-105 z-10' : ''
              }`}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: colorScale[level],
              }}
            >
              {showLabels && (
                <>
                  <span
                    className="text-[9px] font-medium leading-none"
                    style={{ color: level >= 3 ? '#FFFFFF' : level >= 2 ? '#78350F' : '#6B7280' }}
                  >
                    {day.weekday}
                  </span>
                  <span
                    className="text-sm font-bold leading-none"
                    style={{ color: level >= 3 ? '#FFFFFF' : level >= 2 ? '#78350F' : level === 0 ? '#9CA3AF' : '#374151' }}
                  >
                    {day.dayNum}
                  </span>
                </>
              )}
              {isToday && (
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-mono-100 dark:bg-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tooltip */}
      {hoveredDate && (
        <div
          className="absolute z-50 pointer-events-none bg-white dark:bg-mono-50 shadow-xl rounded-lg px-3 py-2 border border-mono-900 dark:border-mono-200 text-xs whitespace-nowrap"
          style={{
            left: tooltipPos.x + 12,
            top: tooltipPos.y - 8,
            transform: 'translateY(-100%)',
          }}
        >
          <span className="text-mono-100 dark:text-white font-medium">
            {tooltipFn(hoveredDate, dataMap[hoveredDate] || 0)}
          </span>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-3 mt-3 text-xs text-[#9CA3AF] dark:text-mono-500">
        <span>Intensite :</span>
        {['0', 'Bas', 'Moyen', 'Eleve', 'Critique'].map((label, i) => (
          <div key={label} className="flex items-center gap-1">
            <div
              className="w-3.5 h-3.5 rounded"
              style={{ backgroundColor: colorScale[i] }}
            />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
