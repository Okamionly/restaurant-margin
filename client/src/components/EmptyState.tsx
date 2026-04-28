import { type ReactNode } from 'react';
import { Plus, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  illustration?: 'ingredients' | 'recipes' | 'suppliers' | 'inventory' | 'menu' | 'invoices' | 'default';
}

// ── SVG Illustrations (CSS-only art for each page) ───────────────────────────
function EmptyIllustration({ type }: { type: string }) {
  const illustrations: Record<string, { emoji: string; bg: string; shapes: { color: string; size: string; pos: string }[] }> = {
    ingredients: {
      emoji: '🧅',
      bg: 'from-[#F0FDF4] to-[#ECFDF5] dark:from-[#052e16]/20 dark:to-[#022c22]/20',
      shapes: [
        { color: 'bg-green-200/50 dark:bg-green-900/30', size: 'w-16 h-16', pos: 'top-2 left-4' },
        { color: 'bg-emerald-200/40 dark:bg-emerald-900/20', size: 'w-10 h-10', pos: 'bottom-4 right-6' },
        { color: 'bg-teal-200/30 dark:bg-teal-900/20', size: 'w-8 h-8', pos: 'top-8 right-12' },
      ],
    },
    recipes: {
      emoji: '📋',
      bg: 'from-[#EFF6FF] to-[#DBEAFE] dark:from-[#172554]/20 dark:to-[#1e3a5f]/20',
      shapes: [
        { color: 'bg-blue-200/50 dark:bg-blue-900/30', size: 'w-14 h-14', pos: 'top-3 right-8' },
        { color: 'bg-sky-200/40 dark:bg-sky-900/20', size: 'w-12 h-12', pos: 'bottom-2 left-6' },
        { color: 'bg-indigo-200/30 dark:bg-indigo-900/20', size: 'w-6 h-6', pos: 'top-10 left-14' },
      ],
    },
    suppliers: {
      emoji: '🚛',
      bg: 'from-[#FFF7ED] to-[#FFEDD5] dark:from-[#431407]/20 dark:to-[#451a03]/20',
      shapes: [
        { color: 'bg-orange-200/50 dark:bg-orange-900/30', size: 'w-14 h-14', pos: 'top-2 left-6' },
        { color: 'bg-amber-200/40 dark:bg-amber-900/20', size: 'w-10 h-10', pos: 'bottom-3 right-8' },
        { color: 'bg-yellow-200/30 dark:bg-yellow-900/20', size: 'w-8 h-8', pos: 'top-8 right-4' },
      ],
    },
    inventory: {
      emoji: '📦',
      bg: 'from-[#F5F3FF] to-[#EDE9FE] dark:from-[#2e1065]/20 dark:to-[#1e1b4b]/20',
      shapes: [
        { color: 'bg-purple-200/50 dark:bg-purple-900/30', size: 'w-16 h-16', pos: 'top-1 right-6' },
        { color: 'bg-violet-200/40 dark:bg-violet-900/20', size: 'w-10 h-10', pos: 'bottom-4 left-8' },
        { color: 'bg-fuchsia-200/30 dark:bg-fuchsia-900/20', size: 'w-6 h-6', pos: 'top-12 left-4' },
      ],
    },
    menu: {
      emoji: '📖',
      bg: 'from-[#FDF2F8] to-[#FCE7F3] dark:from-[#500724]/20 dark:to-[#4a044e]/20',
      shapes: [
        { color: 'bg-pink-200/50 dark:bg-pink-900/30', size: 'w-14 h-14', pos: 'top-3 left-8' },
        { color: 'bg-rose-200/40 dark:bg-rose-900/20', size: 'w-12 h-12', pos: 'bottom-2 right-4' },
        { color: 'bg-red-200/30 dark:bg-red-900/20', size: 'w-8 h-8', pos: 'top-6 right-12' },
      ],
    },
    invoices: {
      emoji: '🧾',
      bg: 'from-[#ECFEFF] to-[#CFFAFE] dark:from-[#083344]/20 dark:to-[#164e63]/20',
      shapes: [
        { color: 'bg-cyan-200/50 dark:bg-cyan-900/30', size: 'w-14 h-14', pos: 'top-2 right-6' },
        { color: 'bg-teal-200/40 dark:bg-teal-900/20', size: 'w-10 h-10', pos: 'bottom-4 left-4' },
        { color: 'bg-sky-200/30 dark:bg-sky-900/20', size: 'w-8 h-8', pos: 'top-10 left-10' },
      ],
    },
    default: {
      emoji: '✨',
      bg: 'from-[#F9FAFB] to-mono-950 dark:from-mono-100/40 dark:to-[#171717]/40',
      shapes: [
        { color: 'bg-gray-200/50 dark:bg-gray-800/30', size: 'w-14 h-14', pos: 'top-3 left-6' },
        { color: 'bg-mono-900/40 dark:bg-mono-300/20', size: 'w-10 h-10', pos: 'bottom-2 right-8' },
        { color: 'bg-zinc-200/30 dark:bg-zinc-800/20', size: 'w-6 h-6', pos: 'top-8 right-4' },
      ],
    },
  };

  const config = illustrations[type] || illustrations.default;

  return (
    <div className={`relative w-36 h-36 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${config.bg} overflow-hidden`}>
      {/* Decorative shapes */}
      {config.shapes.map((shape, i) => (
        <div
          key={i}
          className={`absolute ${shape.color} ${shape.size} ${shape.pos} rounded-full`}
          style={{
            animation: `empty-float ${3 + i * 0.5}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
      {/* Main emoji */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-5xl" style={{ animation: 'empty-bounce 2s ease-in-out infinite' }}>
          {config.emoji}
        </span>
      </div>
    </div>
  );
}

export default function EmptyState({ icon, title, description, action, secondaryAction, illustration }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center">
      {illustration ? (
        <div aria-hidden="true">
          <EmptyIllustration type={illustration} />
        </div>
      ) : (
        <div aria-hidden="true" className="w-16 h-16 rounded-2xl bg-mono-950 dark:bg-[#171717] flex items-center justify-center mb-4 text-[#9CA3AF] dark:text-mono-500">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-bold text-mono-100 dark:text-white mb-2 font-satoshi">
        {title}
      </h3>
      <p className="text-sm text-[#6B7280] dark:text-mono-700 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center gap-3">
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="inline-flex items-center gap-2 py-2.5 px-5 text-sm font-semibold bg-mono-100 dark:bg-white text-white dark:text-mono-100 rounded-xl hover:bg-[#333333] dark:hover:bg-mono-900 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-mono-50"
          >
            <Plus className="w-4 h-4" />
            {action.label}
          </button>
        )}
        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction.onClick}
            className="inline-flex items-center gap-2 py-2.5 px-5 text-sm font-medium text-[#6B7280] dark:text-mono-700 border border-mono-900 dark:border-[#333333] rounded-xl hover:bg-mono-950 dark:hover:bg-[#171717] hover:text-mono-100 dark:hover:text-white transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-mono-50"
          >
            {secondaryAction.label}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes empty-float {
          0% { transform: translateY(0); }
          100% { transform: translateY(-6px); }
        }
        @keyframes empty-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
