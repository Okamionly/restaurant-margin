/**
 * @file GlossaryTooltip.tsx
 *
 * Tooltip explicatif pour les termes métier qui paraissent évidents pour
 * l'équipe RestauMargin mais que les restaurateurs (notre cible) ne
 * connaissent pas forcément. Audit Karim persona 2026-04-28 a identifié
 * 5 termes critiques sans tooltip.
 *
 * Usage :
 *   <GlossaryTooltip term="foodCost">
 *     Food cost
 *   </GlossaryTooltip>
 *
 * Affiche le label + une icône (?) qui révèle un popover au hover/focus.
 */

import { type ReactNode, useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────
// Glossaire métier — single source of truth
// ─────────────────────────────────────────────────────────────────────────
export const GLOSSARY: Record<string, { term: string; definition: string; example?: string }> = {
  foodCost: {
    term: 'Food cost',
    definition: 'Pourcentage du prix de vente représenté par le coût des matières premières.',
    example: 'Pizza vendue 12€ avec ingrédients à 3€ → food cost = 25%. Cible métier : ≤ 30%.',
  },
  coefficient: {
    term: 'Coefficient multiplicateur',
    definition: 'Prix de vente divisé par le coût des ingrédients. Indique combien tu multiplies tes coûts pour obtenir ton prix.',
    example: 'Plat à 4€ de coût vendu 14€ → coefficient × 3.5. Cible bistrot : entre 3 et 4.',
  },
  margeBrute: {
    term: 'Marge brute',
    definition: 'Différence entre le prix de vente et le coût des matières premières (avant charges fixes).',
    example: 'Plat 18€ - 6€ ingrédients = 12€ marge brute (66.6%).',
  },
  ficheTechnique: {
    term: 'Fiche technique',
    definition: 'Document détaillant la composition d\'une recette : ingrédients, quantités, coûts, marge.',
    example: 'Obligatoire en restauration pro pour traçabilité allergènes + calcul food cost.',
  },
  mercuriale: {
    term: 'Mercuriale',
    definition: 'Liste éditoriale des prix fournisseurs sur une période donnée. Permet de comparer et tracker les variations.',
    example: 'Mercuriale Avril 2026 : tomate 2.40€/kg chez A vs 2.10€/kg chez B.',
  },
  primeCost: {
    term: 'Prime cost',
    definition: 'Somme du food cost + coût main d\'oeuvre. Le KPI le plus suivi en restauration américaine.',
    example: 'Cible : prime cost < 60% du CA.',
  },
};

interface GlossaryTooltipProps {
  /** Clé dans GLOSSARY (ex: 'foodCost', 'coefficient') */
  term: keyof typeof GLOSSARY;
  /** Le texte affiché à l'utilisateur (peut différer du term key) */
  children: ReactNode;
  /** Optionnel : taille de l'icône help (default 14px) */
  iconSize?: number;
  className?: string;
}

export default function GlossaryTooltip({ term, children, iconSize = 14, className = '' }: GlossaryTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const entry = GLOSSARY[term];

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  if (!entry) {
    // Fallback : affiche les enfants sans tooltip
    return <span className={className}>{children}</span>;
  }

  return (
    <span ref={ref} className={`relative inline-flex items-center gap-1 ${className}`}>
      {children}
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); setOpen(o => !o); }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex items-center justify-center text-mono-500 hover:text-emerald-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-full"
        aria-label={`Définition de ${entry.term}`}
        aria-expanded={open}
      >
        <HelpCircle width={iconSize} height={iconSize} />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-2 w-72 max-w-[90vw] p-3 bg-mono-100 dark:bg-white text-white dark:text-mono-100 text-xs rounded-xl shadow-2xl pointer-events-none"
        >
          <span className="block font-bold mb-1">{entry.term}</span>
          <span className="block opacity-90 leading-relaxed">{entry.definition}</span>
          {entry.example && (
            <span className="block mt-2 pt-2 border-t border-white/10 dark:border-mono-100/10 opacity-80 italic">
              {entry.example}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
