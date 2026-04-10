import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Trash2, Search, Pencil, Copy, Sparkles, Loader2, Check, AlertTriangle, TrendingUp, X, UtensilsCrossed, LayoutGrid, List, ChevronUp, ChevronDown, ChevronsUpDown, Trophy, ShieldAlert, CheckSquare, Tag, BookOpen, Clock, Users, Star, ArrowUpDown, Scale, Zap, SlidersHorizontal, GitCompareArrows, ClipboardList, Package, Download, Leaf, BarChart3, ArrowRight, RefreshCw, TrendingDown, Sun, Snowflake, Flower2, CloudRain, Printer, FileText, StickyNote } from 'lucide-react';
import SearchBar, { type SearchSuggestion } from '../components/SearchBar';
import FilterPanel, { type FilterDef, type FilterValues } from '../components/FilterPanel';
import { fetchRecipes, fetchIngredients, createRecipe, updateRecipe, deleteRecipe, cloneRecipe, createIngredient, suggestMercurialeIngredients } from '../services/api';
import type { MercurialeSuggestedIngredient } from '../services/api';
import type { Recipe, Ingredient } from '../types';
import { RECIPE_CATEGORIES, INGREDIENT_CATEGORIES, UNITS } from '../types';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';
import { useRestaurant } from '../hooks/useRestaurant';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { searchTemplates, getTemplatesByCategory, TEMPLATE_CATEGORY_ORDER, type RecipeTemplate, recipePacks, type RecipePack } from '../data/recipeTemplates';
import { trackEvent } from '../utils/analytics';
import { formatCurrency, currencySuffix, getCurrencySymbol } from '../utils/currency';
import RecipePlaceholder from '../components/RecipePlaceholder';
import FoodIllustration from '../components/FoodIllustration';
import { updateOnboardingStep } from '../components/OnboardingWizard';
import { useScale } from '../hooks/useScale';
import { InlineWeighPanel, ModePeseeBar, BatchWeighingPanel, QuickWeighAdd } from '../components/RecipeWeighingPanel';

// ── Unit conversion divisor ─────────────────────────────────────────────
// pricePerUnit is ALWAYS per the bulk unit (kg for weight, L for volume).
// If ingredient.unit is "g", quantity is in grams but price is per kg → divide by 1000.
// If ingredient.unit is "cl", quantity is in cl but price is per L → divide by 100.
// Returns the divisor to convert quantity to the bulk pricing unit.
function getUnitDivisor(unit: string): number {
  const u = (unit || '').toLowerCase().trim();
  if (u === 'g') return 1000;
  if (u === 'mg') return 1000000;
  if (u === 'cl') return 100;
  if (u === 'ml') return 1000;
  if (u === 'dl') return 10;
  return 1; // kg, L, pièce, piece, unité, etc.
}

// Legacy wrapper: convert quantity from inputUnit to priceUnit for form preview.
// When inputUnit === priceUnit, uses getUnitDivisor to handle sub-unit pricing.
function convertToBaseUnit(quantity: number, inputUnit: string, priceUnit: string): number {
  const u = inputUnit.toLowerCase().trim();
  const p = priceUnit.toLowerCase().trim();

  // If units differ, do explicit cross-unit conversion
  if (u !== p) {
    // Weight conversions → to kg
    if (p === 'kg') {
      if (u === 'g') return quantity / 1000;
      if (u === 'mg') return quantity / 1000000;
    }
    if (p === 'g') {
      if (u === 'kg') return quantity * 1000;
    }
    // Volume conversions → to L
    if (p === 'l' || p === 'litre' || p === 'litres') {
      if (u === 'cl') return quantity / 100;
      if (u === 'ml') return quantity / 1000;
      if (u === 'dl') return quantity / 10;
    }
    if (p === 'cl') {
      if (u === 'l' || u === 'litre') return quantity * 100;
      if (u === 'ml') return quantity / 10;
    }
  }

  // Same unit or piece units: apply divisor (price is per bulk unit)
  return quantity / getUnitDivisor(u);
}

function MarginBadge({ percent }: { percent: number }) {
  const color = percent >= 70 ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : percent >= 60 ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300';
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{percent.toFixed(1)}%</span>;
}

// ── Margin Alert Badge ──────────────────────────────────────────────────
function MarginAlertBadge({ percent }: { percent: number }) {
  if (percent < 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/30">
        <AlertTriangle className="w-3 h-3" /> PERTE
      </span>
    );
  }
  if (percent > 0 && percent < 50) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500 text-white shadow-lg shadow-red-500/20">
        <AlertTriangle className="w-3 h-3" /> ATTENTION
      </span>
    );
  }
  if (percent > 80) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
        <Star className="w-3 h-3" /> STAR
      </span>
    );
  }
  return null;
}

// ── Category color mapping ─────────────────────────────────────────────
function getCategoryBadgeColor(category: string): string {
  switch (category) {
    case 'Entree':
    case 'Entrée':
      return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
    case 'Plat':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    case 'Dessert':
      return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
    case 'Boisson':
      return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300';
    case 'Accompagnement':
      return 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300';
    default:
      return 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3]';
  }
}

// ── Print Fiche Technique ──────────────────────────────────────────────
function printFicheTechnique(recipe: Recipe, restaurantName: string) {
  const ingredientRows = recipe.ingredients.map((ri) => {
    const ing = ri.ingredient;
    const name = ing?.name || 'Ingredient';
    const qty = ri.quantity;
    const unit = ing?.unit || '';
    const unitPrice = ing?.pricePerUnit || 0;
    const waste = ri.wastePercent || 0;
    const divisor = (() => {
      const u = (unit || '').toLowerCase().trim();
      if (u === 'g') return 1000;
      if (u === 'mg') return 1000000;
      if (u === 'cl') return 100;
      if (u === 'ml') return 1000;
      if (u === 'dl') return 10;
      return 1;
    })();
    const rawCost = (qty / divisor) * unitPrice;
    const costWithWaste = rawCost * (1 + waste / 100);
    return `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #ddd;text-align:left">${name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #ddd;text-align:center">${qty} ${unit}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #ddd;text-align:center">${unitPrice.toFixed(2)} / ${unit === 'g' || unit === 'mg' ? 'kg' : unit === 'cl' || unit === 'ml' || unit === 'dl' ? 'L' : unit}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #ddd;text-align:center">${waste}%</td>
      <td style="padding:8px 12px;border-bottom:1px solid #ddd;text-align:right;font-weight:600">${formatCurrency(costWithWaste)}</td>
    </tr>`;
  }).join('');

  const totalCost = recipe.margin?.costPerPortion ? recipe.margin.costPerPortion * recipe.nbPortions : 0;
  const costPerPortion = recipe.margin?.costPerPortion || 0;
  const marginPct = recipe.margin?.marginPercent || 0;
  const marginPerPortion = recipe.sellingPrice - costPerPortion;

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Fiche Technique - ${recipe.name}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111; padding: 40px; max-width: 800px; margin: 0 auto; }
  h1 { font-size: 28px; margin-bottom: 4px; }
  h2 { font-size: 16px; font-weight: 400; color: #666; margin-bottom: 24px; }
  .header { border-bottom: 2px solid #111; padding-bottom: 16px; margin-bottom: 24px; }
  .restaurant { font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .meta { display: flex; gap: 32px; margin-bottom: 24px; }
  .meta-item { }
  .meta-label { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; }
  .meta-value { font-size: 16px; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  thead th { padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #666; border-bottom: 2px solid #111; }
  thead th:nth-child(n+2) { text-align: center; }
  thead th:last-child { text-align: right; }
  .totals { border-top: 2px solid #111; padding-top: 16px; }
  .totals-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px; }
  .totals-row.highlight { font-size: 16px; font-weight: 700; padding: 8px 0; border-top: 1px solid #ddd; margin-top: 8px; }
  .notes { margin-top: 24px; padding: 16px; border: 1px solid #ddd; border-radius: 4px; }
  .notes-title { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
  .notes-text { font-size: 14px; color: #333; white-space: pre-wrap; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 11px; color: #999; text-align: center; }
  @media print { body { padding: 20px; } @page { margin: 15mm; } }
</style></head><body>
<div class="header">
  <div class="restaurant">${restaurantName || 'Mon Restaurant'}</div>
  <h1>${recipe.name}</h1>
  <h2>${recipe.category}${recipe.description ? ' — ' + recipe.description : ''}</h2>
</div>
<div class="meta">
  <div class="meta-item"><div class="meta-label">Portions</div><div class="meta-value">${recipe.nbPortions}</div></div>
  <div class="meta-item"><div class="meta-label">Prix de vente</div><div class="meta-value">${formatCurrency(recipe.sellingPrice)}</div></div>
  <div class="meta-item"><div class="meta-label">Marge</div><div class="meta-value">${marginPct.toFixed(1)}%</div></div>
  ${recipe.prepTimeMinutes ? `<div class="meta-item"><div class="meta-label">Prep.</div><div class="meta-value">${recipe.prepTimeMinutes} min</div></div>` : ''}
  ${recipe.cookTimeMinutes ? `<div class="meta-item"><div class="meta-label">Cuisson</div><div class="meta-value">${recipe.cookTimeMinutes} min</div></div>` : ''}
</div>
<table>
  <thead><tr>
    <th>Ingredient</th><th>Quantite</th><th>Prix unitaire</th><th>Perte</th><th style="text-align:right">Cout</th>
  </tr></thead>
  <tbody>${ingredientRows}</tbody>
</table>
<div class="totals">
  <div class="totals-row"><span>Cout matieres total</span><strong>${formatCurrency(totalCost)}</strong></div>
  <div class="totals-row"><span>Cout par portion</span><strong>${formatCurrency(costPerPortion)}</strong></div>
  <div class="totals-row"><span>Prix de vente</span><strong>${formatCurrency(recipe.sellingPrice)}</strong></div>
  <div class="totals-row highlight"><span>Marge par portion</span><strong>${formatCurrency(marginPerPortion)} (${marginPct.toFixed(1)}%)</strong></div>
</div>
${recipe.description ? `<div class="notes"><div class="notes-title">Notes du chef</div><div class="notes-text">${recipe.description}</div></div>` : ''}
<div class="footer">Fiche technique generee par RestauMargin &mdash; ${new Date().toLocaleDateString('fr-FR')}</div>
</body></html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
  }
}

// ── Cost Breakdown Donut (pure CSS) ─────────────────────────────────────
function CostDonut({ costPercent, marginPercent }: { costPercent: number; marginPercent: number }) {
  const clampedCost = Math.max(0, Math.min(100, costPercent));
  const clampedMargin = Math.max(0, 100 - clampedCost);
  const costColor = clampedCost > 50 ? '#EF4444' : clampedCost > 30 ? '#F59E0B' : '#10B981';
  const marginColor = clampedMargin >= 70 ? '#10B981' : clampedMargin >= 50 ? '#F59E0B' : '#EF4444';
  const deg = (clampedCost / 100) * 360;

  return (
    <div className="relative" title={`Cout: ${clampedCost.toFixed(0)}% | Marge: ${clampedMargin.toFixed(0)}%`}>
      <div
        className="w-12 h-12 rounded-full"
        style={{
          background: `conic-gradient(${costColor} 0deg, ${costColor} ${deg}deg, ${marginColor} ${deg}deg, ${marginColor} 360deg)`,
        }}
      >
        <div className="absolute inset-[3px] rounded-full bg-white dark:bg-[#0A0A0A] flex items-center justify-center">
          <span className="text-[9px] font-bold text-[#111111] dark:text-white leading-none">{marginPercent.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}

// ── Margin Health Bar ───────────────────────────────────────────────────
function MarginHealthBar({ recipes }: { recipes: Recipe[] }) {
  if (recipes.length === 0) return null;
  const good = recipes.filter(r => (r.margin?.marginPercent || 0) > 70).length;
  const medium = recipes.filter(r => { const m = r.margin?.marginPercent || 0; return m >= 50 && m <= 70; }).length;
  const bad = recipes.filter(r => (r.margin?.marginPercent || 0) < 50).length;
  const total = recipes.length;
  const goodPct = (good / total) * 100;
  const mediumPct = (medium / total) * 100;
  const badPct = (bad / total) * 100;

  return (
    <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4 mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-[#111111] dark:text-white" />
          <span className="text-sm font-semibold text-[#111111] dark:text-white">Sante du portefeuille</span>
        </div>
        <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{total} recettes</span>
      </div>
      {/* Bar */}
      <div className="w-full h-5 rounded-full overflow-hidden flex bg-[#F3F4F6] dark:bg-[#171717]">
        {goodPct > 0 && (
          <div
            className="h-full bg-emerald-500 flex items-center justify-center transition-all duration-500"
            style={{ width: `${goodPct}%` }}
          >
            {goodPct > 12 && <span className="text-[10px] font-bold text-white">{good}</span>}
          </div>
        )}
        {mediumPct > 0 && (
          <div
            className="h-full bg-amber-500 flex items-center justify-center transition-all duration-500"
            style={{ width: `${mediumPct}%` }}
          >
            {mediumPct > 12 && <span className="text-[10px] font-bold text-white">{medium}</span>}
          </div>
        )}
        {badPct > 0 && (
          <div
            className="h-full bg-red-500 flex items-center justify-center transition-all duration-500"
            style={{ width: `${badPct}%` }}
          >
            {badPct > 12 && <span className="text-[10px] font-bold text-white">{bad}</span>}
          </div>
        )}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-2.5">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Bonne marge &gt;70% ({good})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Moyenne 50-70% ({medium})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Critique &lt;50% ({bad})</span>
        </div>
      </div>
    </div>
  );
}

// ── Quick Price Simulator ───────────────────────────────────────────────
function PriceSimulator({ recipe }: { recipe: Recipe }) {
  const [simPrice, setSimPrice] = useState(recipe.sellingPrice);
  const [open, setOpen] = useState(false);
  const cost = recipe.margin?.costPerPortion || 0;
  const simMargin = simPrice > 0 ? ((simPrice - cost) / simPrice) * 100 : 0;
  const diff = simPrice - recipe.sellingPrice;

  if (!open) {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className="flex items-center gap-1 text-[10px] text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors"
        title="Simuler un nouveau prix"
      >
        <SlidersHorizontal className="w-3 h-3" /> Simuler prix
      </button>
    );
  }

  return (
    <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-lg p-2.5 mt-2 border border-[#E5E7EB] dark:border-[#1A1A1A] space-y-2" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase text-[#9CA3AF] dark:text-[#737373]">Simulateur de prix</span>
        <button onClick={() => { setSimPrice(recipe.sellingPrice); setOpen(false); }} className="p-0.5 text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white">
          <X className="w-3 h-3" />
        </button>
      </div>
      <input
        type="range"
        min={Math.max(0, cost)}
        max={Math.max(cost * 5, recipe.sellingPrice * 2)}
        step="0.5"
        value={simPrice}
        onChange={(e) => setSimPrice(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-[#E5E7EB] dark:bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-[#111111] dark:accent-white"
      />
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-[#111111] dark:text-white font-bold">{simPrice.toFixed(2)}{getCurrencySymbol()}</span>
        {diff !== 0 && (
          <span className={`font-mono text-[10px] ${diff > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {diff > 0 ? '+' : ''}{diff.toFixed(2)}
          </span>
        )}
        <span className={`font-bold ${simMargin >= 70 ? 'text-emerald-500' : simMargin >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
          {simMargin.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

// ── Recipe Comparison Modal ─────────────────────────────────────────────
function RecipeComparisonPanel({ recipes, onClose }: { recipes: [Recipe, Recipe]; onClose: () => void }) {
  const [a, b] = recipes;

  const getIngCost = (recipe: Recipe) => {
    return recipe.ingredients.map(ri => {
      const ing = ri.ingredient;
      if (!ing) return { name: '?', cost: 0, qty: ri.quantity, unit: '' };
      const inputUnit = ing.unit || 'kg';
      const effectiveQty = ri.quantity * (1 + (ri.wastePercent || 0) / 100);
      const convertedQty = effectiveQty / getUnitDivisor(inputUnit);
      return { name: ing.name, cost: ing.pricePerUnit * convertedQty, qty: ri.quantity, unit: ing.unit };
    });
  };

  const aIngs = getIngCost(a);
  const bIngs = getIngCost(b);
  const winnerIdx = a.margin.marginPercent >= b.margin.marginPercent ? 0 : 1;

  const marginColor = (m: number) => m >= 70 ? 'text-emerald-500' : m >= 50 ? 'text-amber-500' : 'text-red-500';
  const marginBg = (m: number) => m >= 70 ? 'bg-emerald-500' : m >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#111111] dark:bg-white flex items-center justify-center">
              <GitCompareArrows className="w-4.5 h-4.5 text-white dark:text-black" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111111] dark:text-white">Comparaison de recettes</h3>
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Analyse cote a cote</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-0 divide-x divide-[#E5E7EB] dark:divide-[#1A1A1A]">
          {/* Recipe headers with Gagnant badge */}
          {[a, b].map((r, i) => (
            <div key={i} className="p-5 pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-[#111111] dark:text-white text-base leading-tight">{r.name}</h4>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3]">{r.category}</span>
                </div>
                {i === winnerIdx && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/30 animate-pulse">
                    <Trophy className="w-3 h-3" /> Gagnant
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Key Metrics with visual bars */}
          {[a, b].map((r, i) => (
            <div key={`m-${i}`} className="px-5 pb-4 space-y-3">
              {/* Selling Price */}
              <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373]">Prix de vente</span>
                  <span className="text-sm font-bold font-mono text-[#111111] dark:text-white">{r.sellingPrice.toFixed(2)}{getCurrencySymbol()}</span>
                </div>
              </div>

              {/* Cost per portion */}
              <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373]">Cout / portion</span>
                  <span className="text-sm font-bold font-mono text-[#111111] dark:text-white">{r.margin.costPerPortion.toFixed(2)}{getCurrencySymbol()}</span>
                </div>
              </div>

              {/* Margin with visual bar */}
              <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373]">Marge</span>
                  <span className={`text-base font-bold ${marginColor(r.margin.marginPercent)}`}>
                    {r.margin.marginPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-[#E5E7EB] dark:bg-[#1A1A1A] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${marginBg(r.margin.marginPercent)}`} style={{ width: `${Math.min(r.margin.marginPercent, 100)}%` }} />
                </div>
              </div>

              {/* Ingredient count */}
              <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373]">Ingredients</span>
                  <span className="text-sm font-bold text-[#111111] dark:text-white">{r.ingredients.length}</span>
                </div>
              </div>

              {/* Coefficient */}
              <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373]">Coefficient</span>
                  <span className="text-sm font-bold font-mono text-[#111111] dark:text-white">x{r.margin.coefficient.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Ingredients detail */}
          {[{ ings: aIngs, r: a }, { ings: bIngs, r: b }].map(({ ings, r }, i) => (
            <div key={`ing-${i}`} className="px-5 pb-5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] mb-2">
                Detail ingredients ({r.ingredients.length})
              </div>
              <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
                {ings.map((ing, j) => (
                  <div key={j} className="flex items-center justify-between text-xs py-1 border-b border-[#F3F4F6] dark:border-[#1A1A1A] last:border-0">
                    <span className="text-[#6B7280] dark:text-[#A3A3A3] truncate mr-2">{ing.name}</span>
                    <span className="font-mono text-[#111111] dark:text-white whitespace-nowrap">{ing.cost.toFixed(2)}{getCurrencySymbol()}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Winner footer */}
        <div className="p-5 border-t border-[#E5E7EB] dark:border-[#1A1A1A] bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-amber-950/20 dark:to-emerald-950/20 rounded-b-2xl">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div className="text-center">
              <div className="text-xs text-[#6B7280] dark:text-[#A3A3A3] font-medium">Plus rentable</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-bold text-[#111111] dark:text-white text-sm">
                  {winnerIdx === 0 ? a.name : b.name}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  {Math.max(a.margin.marginPercent, b.margin.marginPercent).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Category gradients (kept for backwards compat, new component imported) ──

// ── SVG allergen icons ───────────────────────────────────────────────────
const ALLERGEN_ICONS: Record<string, { svg: React.ReactNode; label: string }> = {
  Gluten: {
    label: 'Gluten',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M12 2v20M9 5c0 2 3 3 3 5s-3 3-3 5M15 5c0 2-3 3-3 5s3 3 3 5" />
        <path d="M7 3c1 1 2 2 2 4M17 3c-1 1-2 2-2 4" />
      </svg>
    ),
  },
  Lait: {
    label: 'Lait',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M8 2h8l1 5v13a2 2 0 01-2 2H9a2 2 0 01-2-2V7l1-5z" />
        <path d="M6 7h12" />
      </svg>
    ),
  },
  Oeufs: {
    label: 'Oeufs',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <ellipse cx="12" cy="14" rx="7" ry="8" />
        <ellipse cx="12" cy="14" rx="3" ry="3.5" />
      </svg>
    ),
  },
  Poissons: {
    label: 'Poissons',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" />
        <path d="M22 12l-3-3v6l3-3z" />
        <circle cx="8" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
  'Crustacés': {
    label: 'Crustacés',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M5 8c0-3 3-5 7-5s7 2 7 5" />
        <path d="M4 12c0 4 4 8 8 8s8-4 8-8" />
        <path d="M8 12v3M16 12v3M12 8v4" />
        <path d="M3 8l2 4M21 8l-2 4" />
      </svg>
    ),
  },
  'Fruits à coque': {
    label: 'Fruits à coque',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <ellipse cx="12" cy="14" rx="6" ry="7" />
        <path d="M8 7c0-3 2-5 4-5s4 2 4 5" />
        <path d="M12 7v7" />
      </svg>
    ),
  },
  Soja: {
    label: 'Soja',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <ellipse cx="9" cy="14" rx="4" ry="6" />
        <ellipse cx="15" cy="14" rx="4" ry="6" />
        <path d="M12 2v6" />
        <path d="M10 4l2 2 2-2" />
      </svg>
    ),
  },
  'Céleri': {
    label: 'Céleri',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M12 22V8M8 22V10c0-4 2-7 4-8M16 22V10c0-4-2-7-4-8" />
        <path d="M8 6c-2-1-3 1-3 3M16 6c2-1 3 1 3 3" />
      </svg>
    ),
  },
  Moutarde: {
    label: 'Moutarde',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <rect x="7" y="8" width="10" height="13" rx="1" />
        <path d="M9 8V5a3 3 0 016 0v3" />
        <path d="M12 2v3M7 14h10" />
      </svg>
    ),
  },
  'Sésame': {
    label: 'Sésame',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <ellipse cx="8" cy="10" rx="2.5" ry="4" transform="rotate(-15 8 10)" />
        <ellipse cx="16" cy="10" rx="2.5" ry="4" transform="rotate(15 16 10)" />
        <ellipse cx="12" cy="16" rx="2.5" ry="4" />
      </svg>
    ),
  },
  Sulfites: {
    label: 'Sulfites',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-3.5 h-3.5">
        <text x="4" y="17" fontSize="11" fontWeight="bold" fill="currentColor" stroke="none" fontFamily="sans-serif">SO₂</text>
      </svg>
    ),
  },
  Lupin: {
    label: 'Lupin',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M12 22V10" />
        <path d="M12 10c-2-4-6-5-6-8 0 5 4 6 6 8z" />
        <path d="M12 10c2-4 6-5 6-8 0 5-4 6-6 8z" />
        <path d="M12 14c-3-2-6-1-7 0 3-1 5 0 7 0z" />
        <path d="M12 14c3-2 6-1 7 0-3-1-5 0-7 0z" />
      </svg>
    ),
  },
  Mollusques: {
    label: 'Mollusques',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M4 18c0-6 4-12 8-14 4 2 8 8 8 14" />
        <path d="M4 18h16" />
        <path d="M8 18c0-3 2-7 4-9 2 2 4 6 4 9" />
      </svg>
    ),
  },
  Arachides: {
    label: 'Arachides',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <ellipse cx="10" cy="9" rx="4" ry="5" />
        <ellipse cx="14" cy="16" rx="4" ry="5" />
        <path d="M12 12c1-1 1-2 2-3" />
      </svg>
    ),
  },
};

function AllergenIcon({ name }: { name: string }) {
  const icon = ALLERGEN_ICONS[name];
  if (!icon) {
    return (
      <span
        title={name}
        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-[9px] font-bold cursor-help border border-red-200 dark:border-red-800"
      >
        {name.slice(0, 2)}
      </span>
    );
  }
  return (
    <span
      title={icon.label}
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 cursor-help border border-red-200 dark:border-red-800 hover:scale-110 transition-transform"
    >
      {icon.svg}
    </span>
  );
}

/** Collect unique allergens from a recipe's ingredients */
function getRecipeAllergens(recipe: Recipe): string[] {
  const set = new Set<string>();
  recipe.ingredients.forEach((ri) => {
    ri.ingredient?.allergens?.forEach((a) => set.add(a));
  });
  return Array.from(set).sort();
}

/** Combobox for ingredient selection — allows free text or selecting from DB */
function IngredientCombobox({
  ingredients,
  selectedId,
  newName,
  onSelect,
  onNewName,
}: {
  ingredients: Ingredient[];
  selectedId: number | null;
  newName: string;
  onSelect: (id: number) => void;
  onNewName: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Derive display value
  const displayValue = selectedId
    ? ingredients.find((i) => i.id === selectedId)?.name || ''
    : newName;

  // Filter suggestions based on typed text
  const filtered = inputValue.trim()
    ? ingredients.filter((i) => i.name.toLowerCase().includes(inputValue.toLowerCase()))
    : ingredients;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative flex-1 min-w-[180px]">
      <input
        type="text"
        className="input w-full text-sm"
        placeholder="Tapez un nom ou choisissez..."
        value={open ? inputValue : displayValue}
        onFocus={() => {
          setInputValue(displayValue);
          setOpen(true);
        }}
        onChange={(e) => {
          setInputValue(e.target.value);
          setOpen(true);
          // If typing, treat it as a new ingredient unless it exactly matches
          onNewName(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
        }}
      />
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg shadow-lg">
          {filtered.length > 0 ? (
            filtered.slice(0, 30).map((i) => (
              <button
                key={i.id}
                type="button"
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-[#F3F4F6] dark:hover:bg-[#171717] flex justify-between items-center"
                onClick={() => {
                  onSelect(i.id);
                  setInputValue(i.name);
                  setOpen(false);
                }}
              >
                <span className="text-[#111111] dark:text-white">{i.name}</span>
                <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{i.pricePerUnit.toFixed(2)}{getCurrencySymbol()}/{i.unit}</span>
              </button>
            ))
          ) : null}
          {inputValue.trim() && !ingredients.some((i) => i.name.toLowerCase() === inputValue.toLowerCase()) && (
            <button
              type="button"
              className="w-full text-left px-3 py-2 text-sm bg-[#F3F4F6] dark:bg-[#171717] text-[#111111] dark:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#1A1A1A] font-medium border-t border-[#E5E7EB] dark:border-[#1A1A1A]"
              onClick={() => {
                onNewName(inputValue.trim());
                setOpen(false);
              }}
            >
              + Creer &laquo; {inputValue.trim()} &raquo;
            </button>
          )}
          {!inputValue.trim() && filtered.length === 0 && (
            <div className="px-3 py-2 text-sm text-[#9CA3AF] dark:text-[#737373]">Tapez un nom d&apos;ingredient</div>
          )}
        </div>
      )}
    </div>
  );
}

/** Category-based photo placeholder — now uses CSS art food illustration */
function RecipePhotoPlaceholder({ category, name }: { category: string; name?: string }) {
  return (
    <div className="relative h-36 bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] dark:from-[#0A0A0A] dark:to-[#171717] flex items-center justify-center overflow-hidden group/photo">
      <FoodIllustration recipeName={name} category={category} size="lg" animated />
      {name && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent px-4 py-2">
          <p className="text-white font-bold text-sm leading-tight drop-shadow-md truncate">{name}</p>
        </div>
      )}
    </div>
  );
}

// ── Category coefficients (shared with Settings) ──────────────────────
const DEFAULT_COEFFICIENTS: Record<string, number> = { 'Entrée': 3.0, 'Plat': 3.5, 'Dessert': 4.0, 'Boisson': 4.0, 'Accompagnement': 3.0 };

function loadCoefficients(): Record<string, number> {
  try {
    const stored = localStorage.getItem('coefficients');
    if (stored) return { ...DEFAULT_COEFFICIENTS, ...JSON.parse(stored) };
  } catch {}
  return { ...DEFAULT_COEFFICIENTS };
}

function getCoefficient(category: string, coeffs: Record<string, number>): number {
  return coeffs[category] || DEFAULT_COEFFICIENTS[category] || 3.5;
}

// ══════════════════════════════════════════════════════════════════════════
// ── AI RECIPE COST OPTIMIZER — DATA & HELPERS ──────────────────────────
// ══════════════════════════════════════════════════════════════════════════

/** Seasonal ingredient calendar — maps month (0-11) to ingredient name patterns + discount */
const SEASONAL_CALENDAR: Record<number, { patterns: string[]; discount: number; label: string }[]> = {
  0: [ // Janvier
    { patterns: ['poireau', 'chou', 'navet', 'endive', 'celeri', 'mache', 'topinambour'], discount: 25, label: 'Legumes d\'hiver' },
    { patterns: ['pomme', 'poire', 'clementine', 'orange', 'kiwi', 'mandarine'], discount: 20, label: 'Fruits d\'hiver' },
  ],
  1: [ // Fevrier
    { patterns: ['poireau', 'chou', 'navet', 'endive', 'betterave', 'carotte'], discount: 20, label: 'Legumes d\'hiver' },
    { patterns: ['pomme', 'poire', 'citron', 'orange', 'pamplemousse'], discount: 20, label: 'Agrumes' },
  ],
  2: [ // Mars
    { patterns: ['radis', 'asperge', 'epinard', 'cresson', 'chou-fleur'], discount: 15, label: 'Primeurs de printemps' },
    { patterns: ['citron', 'pomme', 'kiwi'], discount: 15, label: 'Derniers fruits d\'hiver' },
  ],
  3: [ // Avril
    { patterns: ['asperge', 'artichaut', 'radis', 'epinard', 'petit pois', 'feve', 'ail'], discount: 25, label: 'Legumes de printemps' },
    { patterns: ['fraise', 'rhubarbe'], discount: 20, label: 'Premieres fraises' },
  ],
  4: [ // Mai
    { patterns: ['asperge', 'artichaut', 'petit pois', 'feve', 'courgette', 'concombre', 'laitue'], discount: 25, label: 'Legumes de printemps' },
    { patterns: ['fraise', 'cerise'], discount: 30, label: 'Fruits de printemps' },
  ],
  5: [ // Juin
    { patterns: ['tomate', 'courgette', 'aubergine', 'poivron', 'haricot vert', 'concombre', 'fenouil'], discount: 30, label: 'Legumes d\'ete' },
    { patterns: ['fraise', 'cerise', 'abricot', 'peche', 'framboise', 'melon'], discount: 30, label: 'Fruits d\'ete' },
  ],
  6: [ // Juillet
    { patterns: ['tomate', 'courgette', 'aubergine', 'poivron', 'haricot vert', 'mais', 'fenouil'], discount: 35, label: 'Plein ete' },
    { patterns: ['peche', 'nectarine', 'abricot', 'melon', 'pasteque', 'figue', 'myrtille', 'framboise', 'mure'], discount: 35, label: 'Fruits d\'ete' },
  ],
  7: [ // Aout
    { patterns: ['tomate', 'courgette', 'aubergine', 'poivron', 'mais', 'basilic'], discount: 35, label: 'Plein ete' },
    { patterns: ['peche', 'melon', 'pasteque', 'figue', 'prune', 'mirabelle', 'raisin', 'mure'], discount: 35, label: 'Fruits d\'ete' },
  ],
  8: [ // Septembre
    { patterns: ['tomate', 'courgette', 'potiron', 'champignon', 'poivron', 'chou'], discount: 25, label: 'Fin d\'ete' },
    { patterns: ['raisin', 'figue', 'prune', 'pomme', 'poire', 'noix'], discount: 25, label: 'Fruits d\'automne' },
  ],
  9: [ // Octobre
    { patterns: ['potiron', 'courge', 'butternut', 'champignon', 'chou', 'brocoli', 'poireau', 'celeri'], discount: 25, label: 'Legumes d\'automne' },
    { patterns: ['pomme', 'poire', 'chataigne', 'noix', 'coing', 'raisin'], discount: 25, label: 'Fruits d\'automne' },
  ],
  10: [ // Novembre
    { patterns: ['potiron', 'courge', 'butternut', 'poireau', 'chou', 'endive', 'topinambour', 'panais'], discount: 20, label: 'Legumes d\'automne/hiver' },
    { patterns: ['pomme', 'poire', 'clementine', 'kiwi', 'chataigne', 'mandarine'], discount: 20, label: 'Premiers agrumes' },
  ],
  11: [ // Decembre
    { patterns: ['poireau', 'chou', 'endive', 'topinambour', 'panais', 'navet', 'mache', 'truffe'], discount: 20, label: 'Legumes d\'hiver' },
    { patterns: ['pomme', 'poire', 'clementine', 'orange', 'mandarine', 'litchi'], discount: 20, label: 'Fruits d\'hiver / fetes' },
  ],
};

/** Common substitution rules: maps ingredient name patterns to cheaper alternatives */
const SUBSTITUTION_RULES: { pattern: string; alternatives: { name: string; savingsPercent: number; quality: 'aucun' | 'minimal' | 'modere' }[] }[] = [
  { pattern: 'beurre', alternatives: [
    { name: 'margarine', savingsPercent: 40, quality: 'minimal' },
    { name: 'huile olive', savingsPercent: 20, quality: 'minimal' },
  ]},
  { pattern: 'creme fraiche', alternatives: [
    { name: 'creme liquide', savingsPercent: 25, quality: 'aucun' },
    { name: 'fromage blanc', savingsPercent: 30, quality: 'minimal' },
    { name: 'yaourt grec', savingsPercent: 35, quality: 'minimal' },
  ]},
  { pattern: 'parmesan', alternatives: [
    { name: 'grana padano', savingsPercent: 30, quality: 'aucun' },
    { name: 'pecorino', savingsPercent: 20, quality: 'minimal' },
  ]},
  { pattern: 'saumon', alternatives: [
    { name: 'truite', savingsPercent: 35, quality: 'minimal' },
    { name: 'cabillaud', savingsPercent: 25, quality: 'modere' },
  ]},
  { pattern: 'filet de boeuf', alternatives: [
    { name: 'bavette', savingsPercent: 45, quality: 'minimal' },
    { name: 'onglet', savingsPercent: 40, quality: 'minimal' },
    { name: 'paleron', savingsPercent: 55, quality: 'modere' },
  ]},
  { pattern: 'entrecote', alternatives: [
    { name: 'bavette', savingsPercent: 35, quality: 'minimal' },
    { name: 'faux-filet', savingsPercent: 15, quality: 'aucun' },
  ]},
  { pattern: 'crevette', alternatives: [
    { name: 'gambas congelees', savingsPercent: 30, quality: 'minimal' },
    { name: 'calamars', savingsPercent: 40, quality: 'modere' },
  ]},
  { pattern: 'huile olive extra', alternatives: [
    { name: 'huile olive vierge', savingsPercent: 25, quality: 'aucun' },
    { name: 'huile tournesol', savingsPercent: 60, quality: 'modere' },
  ]},
  { pattern: 'mascarpone', alternatives: [
    { name: 'ricotta', savingsPercent: 30, quality: 'minimal' },
    { name: 'fromage frais', savingsPercent: 40, quality: 'minimal' },
  ]},
  { pattern: 'mozzarella di bufala', alternatives: [
    { name: 'mozzarella', savingsPercent: 50, quality: 'minimal' },
    { name: 'burrata', savingsPercent: -20, quality: 'aucun' },
  ]},
  { pattern: 'vanille gousse', alternatives: [
    { name: 'extrait vanille', savingsPercent: 70, quality: 'minimal' },
    { name: 'vanille poudre', savingsPercent: 50, quality: 'aucun' },
  ]},
  { pattern: 'chocolat noir', alternatives: [
    { name: 'cacao poudre', savingsPercent: 40, quality: 'minimal' },
    { name: 'chocolat patissier', savingsPercent: 30, quality: 'aucun' },
  ]},
  { pattern: 'amande', alternatives: [
    { name: 'noisette', savingsPercent: 15, quality: 'aucun' },
    { name: 'noix', savingsPercent: 10, quality: 'aucun' },
  ]},
  { pattern: 'pignon', alternatives: [
    { name: 'graines tournesol', savingsPercent: 70, quality: 'minimal' },
    { name: 'noix de cajou', savingsPercent: 30, quality: 'minimal' },
  ]},
  { pattern: 'safran', alternatives: [
    { name: 'curcuma', savingsPercent: 95, quality: 'modere' },
    { name: 'paprika', savingsPercent: 90, quality: 'modere' },
  ]},
  { pattern: 'foie gras', alternatives: [
    { name: 'mousse de canard', savingsPercent: 60, quality: 'modere' },
    { name: 'rillettes de canard', savingsPercent: 70, quality: 'modere' },
  ]},
  { pattern: 'agneau', alternatives: [
    { name: 'epaule agneau', savingsPercent: 30, quality: 'minimal' },
    { name: 'porc', savingsPercent: 50, quality: 'modere' },
  ]},
  { pattern: 'veau', alternatives: [
    { name: 'dinde', savingsPercent: 45, quality: 'modere' },
    { name: 'poulet', savingsPercent: 55, quality: 'modere' },
  ]},
  { pattern: 'magret', alternatives: [
    { name: 'cuisse de canard', savingsPercent: 40, quality: 'minimal' },
    { name: 'filet de poulet', savingsPercent: 50, quality: 'modere' },
  ]},
];

/** Get the seasonal month icon */
function SeasonIcon({ month }: { month: number }) {
  if (month >= 2 && month <= 4) return <Flower2 className="w-3.5 h-3.5 text-pink-500" />;
  if (month >= 5 && month <= 7) return <Sun className="w-3.5 h-3.5 text-amber-500" />;
  if (month >= 8 && month <= 10) return <CloudRain className="w-3.5 h-3.5 text-orange-500" />;
  return <Snowflake className="w-3.5 h-3.5 text-blue-400" />;
}

/** Check if an ingredient name matches a seasonal pattern for the given month */
function isIngredientSeasonal(name: string, month: number): { seasonal: boolean; discount: number; label: string } {
  const n = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const groups = SEASONAL_CALENDAR[month] || [];
  for (const group of groups) {
    for (const pattern of group.patterns) {
      const p = pattern.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (n.includes(p)) return { seasonal: true, discount: group.discount, label: group.label };
    }
  }
  return { seasonal: false, discount: 0, label: '' };
}

/** Find substitution alternatives from the DB for a given ingredient */
function findAlternatives(ingredientName: string, allIngredients: Ingredient[]): {
  ruleName: string;
  alternatives: { ingredient: Ingredient; savingsPercent: number; quality: 'aucun' | 'minimal' | 'modere' }[];
} | null {
  const nameLower = ingredientName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  for (const rule of SUBSTITUTION_RULES) {
    const patternNorm = rule.pattern.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (nameLower.includes(patternNorm)) {
      const found: { ingredient: Ingredient; savingsPercent: number; quality: 'aucun' | 'minimal' | 'modere' }[] = [];
      for (const alt of rule.alternatives) {
        const altNorm = alt.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const match = allIngredients.find(ing => {
          const ingNorm = ing.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          return ingNorm.includes(altNorm);
        });
        if (match) {
          found.push({ ingredient: match, savingsPercent: alt.savingsPercent, quality: alt.quality });
        }
      }
      // Also look for same-category ingredients that are cheaper
      const currentIng = allIngredients.find(ing => ing.name.toLowerCase().includes(nameLower));
      if (currentIng) {
        const sameCatCheaper = allIngredients
          .filter(ing => ing.category === currentIng.category && ing.id !== currentIng.id && ing.pricePerUnit < currentIng.pricePerUnit)
          .sort((a, b) => a.pricePerUnit - b.pricePerUnit)
          .slice(0, 2);
        for (const cheap of sameCatCheaper) {
          if (!found.some(f => f.ingredient.id === cheap.id)) {
            const savings = ((currentIng.pricePerUnit - cheap.pricePerUnit) / currentIng.pricePerUnit) * 100;
            found.push({ ingredient: cheap, savingsPercent: savings, quality: 'minimal' });
          }
        }
      }
      if (found.length > 0) return { ruleName: rule.pattern, alternatives: found };
    }
  }

  // Fallback: look for same-category cheaper options even without rule match
  const currentIng = allIngredients.find(ing => ing.name.toLowerCase() === nameLower || ing.name.toLowerCase().includes(nameLower));
  if (currentIng) {
    const sameCatCheaper = allIngredients
      .filter(ing => ing.category === currentIng.category && ing.id !== currentIng.id && ing.pricePerUnit < currentIng.pricePerUnit * 0.85)
      .sort((a, b) => a.pricePerUnit - b.pricePerUnit)
      .slice(0, 3);
    if (sameCatCheaper.length > 0) {
      return {
        ruleName: currentIng.name,
        alternatives: sameCatCheaper.map(cheap => ({
          ingredient: cheap,
          savingsPercent: ((currentIng.pricePerUnit - cheap.pricePerUnit) / currentIng.pricePerUnit) * 100,
          quality: 'modere' as const,
        })),
      };
    }
  }
  return null;
}

/** Compute ingredient cost for a recipe ingredient */
function computeIngredientCost(ri: { quantity: number; wastePercent: number; ingredient: Ingredient }): number {
  const effectiveQty = ri.quantity * (1 + (ri.wastePercent || 0) / 100);
  const divisor = getUnitDivisor(ri.ingredient.unit || 'kg');
  return ri.ingredient.pricePerUnit * (effectiveQty / divisor);
}

// ── Single Recipe Cost Optimizer Panel ──────────────────────────────────
function CostOptimizerPanel({
  recipe,
  allIngredients,
  onClose,
}: {
  recipe: Recipe;
  allIngredients: Ingredient[];
  onClose: () => void;
}) {
  const currentMonth = new Date().getMonth();
  const monthNames = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'];

  // Compute per-ingredient costs
  const ingredientCosts = recipe.ingredients.map((ri) => {
    const cost = computeIngredientCost(ri);
    const seasonal = isIngredientSeasonal(ri.ingredient.name, currentMonth);
    const alternatives = findAlternatives(ri.ingredient.name, allIngredients);
    return { ri, cost, seasonal, alternatives };
  }).sort((a, b) => b.cost - a.cost);

  const totalCost = ingredientCosts.reduce((s, ic) => s + ic.cost, 0);
  const top3 = ingredientCosts.slice(0, 3);

  // Seasonal ingredients in this recipe
  const seasonalIngredients = ingredientCosts.filter(ic => ic.seasonal.seasonal);

  // Price alert: detect if any ingredient increased >10% recently (simulated by checking if pricePerUnit is above median for its category)
  const priceAlerts = ingredientCosts.filter(ic => {
    const sameCat = allIngredients.filter(ing => ing.category === ic.ri.ingredient.category);
    if (sameCat.length < 3) return false;
    const avgPrice = sameCat.reduce((s, ing) => s + ing.pricePerUnit, 0) / sameCat.length;
    return ic.ri.ingredient.pricePerUnit > avgPrice * 1.15; // 15% above category average
  });

  // Compute potential savings
  const totalPotentialSavings = top3.reduce((s, ic) => {
    if (!ic.alternatives || ic.alternatives.alternatives.length === 0) return s;
    const bestAlt = ic.alternatives.alternatives.reduce((best, a) => a.savingsPercent > best.savingsPercent ? a : best);
    return s + (ic.cost * bestAlt.savingsPercent / 100);
  }, 0);

  const optimizedCost = totalCost - totalPotentialSavings;
  const currentMargin = recipe.sellingPrice > 0 ? ((recipe.sellingPrice - (totalCost / recipe.nbPortions)) / recipe.sellingPrice) * 100 : 0;
  const optimizedMargin = recipe.sellingPrice > 0 ? ((recipe.sellingPrice - (optimizedCost / recipe.nbPortions)) / recipe.sellingPrice) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111111] dark:text-white">Optimisation : {recipe.name}</h3>
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Analyse du cout et suggestions d'economies</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors">
            <X className="w-5 h-5 text-[#9CA3AF] dark:text-[#737373]" />
          </button>
        </div>

        {/* Margin Impact Summary */}
        <div className="p-5 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#FAFAFA] dark:bg-[#111111] rounded-xl p-3 text-center">
              <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] mb-1">Cout actuel</div>
              <div className="text-lg font-bold font-mono text-[#111111] dark:text-white">{(totalCost / recipe.nbPortions).toFixed(2)}{getCurrencySymbol()}</div>
            </div>
            <div className="bg-[#FAFAFA] dark:bg-[#111111] rounded-xl p-3 text-center">
              <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] mb-1">Cout optimise</div>
              <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">{(optimizedCost / recipe.nbPortions).toFixed(2)}{getCurrencySymbol()}</div>
            </div>
            <div className="bg-[#FAFAFA] dark:bg-[#111111] rounded-xl p-3 text-center">
              <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] mb-1">Marge actuelle</div>
              <div className={`text-lg font-bold ${currentMargin >= 70 ? 'text-emerald-500' : currentMargin >= 50 ? 'text-amber-500' : 'text-red-500'}`}>{currentMargin.toFixed(1)}%</div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 text-center border border-emerald-200 dark:border-emerald-800">
              <div className="text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-300 mb-1">Marge optimisee</div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{optimizedMargin.toFixed(1)}%</div>
            </div>
          </div>
          {totalPotentialSavings > 0 && (
            <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingDown className="w-4 h-4" />
              Economie potentielle : {(totalPotentialSavings / recipe.nbPortions).toFixed(2)}{getCurrencySymbol()} / portion ({((totalPotentialSavings / totalCost) * 100).toFixed(0)}%)
            </div>
          )}
        </div>

        {/* Cost Breakdown Bar Chart */}
        <div className="p-5 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-[#111111] dark:text-white" />
            <h4 className="text-sm font-semibold text-[#111111] dark:text-white">Repartition du cout par ingredient</h4>
          </div>
          <div className="space-y-2">
            {ingredientCosts.map((ic, idx) => {
              const pct = totalCost > 0 ? (ic.cost / totalCost) * 100 : 0;
              const isTop3 = idx < 3;
              return (
                <div key={ic.ri.id} className="group/bar">
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      {isTop3 && <span className="text-[9px] font-bold text-white bg-red-500 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">{idx + 1}</span>}
                      <span className={`truncate ${isTop3 ? 'font-semibold text-[#111111] dark:text-white' : 'text-[#6B7280] dark:text-[#A3A3A3]'}`}>
                        {ic.ri.ingredient.name}
                      </span>
                      {ic.seasonal.seasonal && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex-shrink-0">
                          <Leaf className="w-2.5 h-2.5" /> Saison
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[#111111] dark:text-white ml-2 flex-shrink-0">{ic.cost.toFixed(2)}{getCurrencySymbol()} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#F3F4F6] dark:bg-[#171717] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isTop3 ? 'bg-red-500' : 'bg-[#111111] dark:bg-white'}`}
                      style={{ width: `${Math.max(pct, 1)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 3 Expensive — Substitution Suggestions */}
        <div className="p-5 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw className="w-4 h-4 text-[#111111] dark:text-white" />
            <h4 className="text-sm font-semibold text-[#111111] dark:text-white">Suggestions de substitution</h4>
          </div>
          {top3.map((ic) => {
            if (!ic.alternatives || ic.alternatives.alternatives.length === 0) {
              return (
                <div key={ic.ri.id} className="mb-3 p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#111111] border border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <div className="text-sm font-medium text-[#111111] dark:text-white">{ic.ri.ingredient.name}</div>
                  <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">Aucune alternative moins chere trouvee en base</div>
                </div>
              );
            }
            return (
              <div key={ic.ri.id} className="mb-3 p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#111111] border border-[#E5E7EB] dark:border-[#1A1A1A]">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-[#111111] dark:text-white">{ic.ri.ingredient.name}</div>
                  <span className="text-xs font-mono text-red-500">{ic.cost.toFixed(2)}{getCurrencySymbol()}</span>
                </div>
                <div className="space-y-2">
                  {ic.alternatives.alternatives.slice(0, 3).map((alt, aIdx) => {
                    const savings = ic.cost * alt.savingsPercent / 100;
                    const newCostPerPortion = (totalCost - savings) / recipe.nbPortions;
                    const newMargin = recipe.sellingPrice > 0 ? ((recipe.sellingPrice - newCostPerPortion) / recipe.sellingPrice) * 100 : 0;
                    return (
                      <div key={aIdx} className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A]">
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-[#111111] dark:text-white">
                            Si vous remplacez <strong>{ic.ri.ingredient.name}</strong> par <strong>{alt.ingredient.name}</strong>, vous economisez <strong className="text-emerald-500">{(savings / recipe.nbPortions).toFixed(2)}{getCurrencySymbol()}</strong>/portion
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[10px]">
                            <span className="text-[#9CA3AF] dark:text-[#737373]">{alt.ingredient.pricePerUnit.toFixed(2)}{getCurrencySymbol()}/{alt.ingredient.unit}</span>
                            <span className={`font-medium ${newMargin >= 70 ? 'text-emerald-500' : newMargin >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                              Marge → {newMargin.toFixed(1)}%
                            </span>
                            <span className={`px-1.5 py-0.5 rounded-full font-medium ${alt.quality === 'aucun' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : alt.quality === 'minimal' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
                              Impact: {alt.quality}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Seasonal Suggestions */}
        <div className="p-5 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-center gap-2 mb-3">
            <SeasonIcon month={currentMonth} />
            <h4 className="text-sm font-semibold text-[#111111] dark:text-white">Ingredients de saison — {monthNames[currentMonth]}</h4>
          </div>
          {seasonalIngredients.length > 0 ? (
            <div className="space-y-2">
              {seasonalIngredients.map((ic) => (
                <div key={ic.ri.id} className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/50">
                  <Leaf className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-[#111111] dark:text-white font-medium">{ic.ri.ingredient.name}</span>
                    <span className="text-[10px] text-green-600 dark:text-green-400 ml-2">De saison — potentiellement {ic.seasonal.discount}% moins cher</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">{ic.seasonal.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Aucun ingredient de saison dans cette recette. Suggestions :</p>
              {(SEASONAL_CALENDAR[currentMonth] || []).slice(0, 2).map((group, gIdx) => (
                <div key={gIdx} className="p-2 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/50">
                  <div className="text-[10px] font-semibold text-green-700 dark:text-green-300 mb-1">{group.label} (-{group.discount}% ce mois)</div>
                  <div className="flex flex-wrap gap-1">
                    {group.patterns.slice(0, 6).map((p, pIdx) => (
                      <span key={pIdx} className="px-1.5 py-0.5 rounded text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">{p}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Alerts */}
        {priceAlerts.length > 0 && (
          <div className="p-5 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h4 className="text-sm font-semibold text-red-600 dark:text-red-400">Alertes prix</h4>
            </div>
            <div className="space-y-2">
              {priceAlerts.map((ic) => {
                const sameCat = allIngredients.filter(ing => ing.category === ic.ri.ingredient.category);
                const avgPrice = sameCat.reduce((s, ing) => s + ing.pricePerUnit, 0) / sameCat.length;
                const pctAbove = ((ic.ri.ingredient.pricePerUnit - avgPrice) / avgPrice) * 100;
                return (
                  <div key={ic.ri.id} className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#111111] dark:text-white">{ic.ri.ingredient.name}</span>
                      <span className="text-xs font-mono text-red-500">+{pctAbove.toFixed(0)}% vs moyenne categorie</span>
                    </div>
                    <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373] mt-1">
                      Prix: {ic.ri.ingredient.pricePerUnit.toFixed(2)}{getCurrencySymbol()}/{ic.ri.ingredient.unit} | Moyenne: {avgPrice.toFixed(2)}{getCurrencySymbol()}/{ic.ri.ingredient.unit}
                    </div>
                    {ic.alternatives && ic.alternatives.alternatives.length > 0 && (
                      <div className="mt-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Action : remplacer par {ic.alternatives.alternatives[0].ingredient.name} ({ic.alternatives.alternatives[0].ingredient.pricePerUnit.toFixed(2)}{getCurrencySymbol()}/{ic.alternatives.alternatives[0].ingredient.unit})
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-5 bg-[#FAFAFA] dark:bg-[#111111] rounded-b-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">Calcule a partir de vos donnees reelles — aucun appel IA</span>
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-lg hover:opacity-90 transition-opacity">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Batch Optimizer Panel ───────────────────────────────────────────────
function BatchOptimizerPanel({
  recipes,
  allIngredients,
  onClose,
}: {
  recipes: Recipe[];
  allIngredients: Ingredient[];
  onClose: () => void;
}) {
  const currentMonth = new Date().getMonth();
  const monthNames = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'];

  // Collect all ingredient costs across selected recipes
  const ingredientAgg: Record<string, { name: string; totalCost: number; recipeCount: number; ingredient: Ingredient; alternatives: ReturnType<typeof findAlternatives> }> = {};

  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ri => {
      const cost = computeIngredientCost(ri);
      const key = ri.ingredient.name.toLowerCase();
      if (!ingredientAgg[key]) {
        ingredientAgg[key] = {
          name: ri.ingredient.name,
          totalCost: 0,
          recipeCount: 0,
          ingredient: ri.ingredient,
          alternatives: findAlternatives(ri.ingredient.name, allIngredients),
        };
      }
      ingredientAgg[key].totalCost += cost;
      ingredientAgg[key].recipeCount += 1;
    });
  });

  // Sort by total cost (most expensive common ingredients first)
  const sortedIngredients = Object.values(ingredientAgg)
    .sort((a, b) => b.totalCost - a.totalCost);

  // Common expensive (appear in 2+ recipes)
  const commonExpensive = sortedIngredients.filter(ing => ing.recipeCount >= 2);

  // Total cost across all selected recipes
  const totalCostAll = sortedIngredients.reduce((s, ing) => s + ing.totalCost, 0);

  // Compute total savings for common substitutions
  const savingsBreakdown = commonExpensive
    .filter(ing => ing.alternatives && ing.alternatives.alternatives.length > 0)
    .map(ing => {
      const bestAlt = ing.alternatives!.alternatives.reduce((best, a) => a.savingsPercent > best.savingsPercent ? a : best);
      const savings = ing.totalCost * bestAlt.savingsPercent / 100;
      return { ...ing, bestAlt, savings };
    })
    .sort((a, b) => b.savings - a.savings);

  const totalMonthlyServings = recipes.reduce((s, r) => s + (r.nbPortions || 1) * 30, 0); // Assume ~30x/month
  const totalMonthlySavings = savingsBreakdown.reduce((s, item) => s + item.savings, 0) * 30; // Rough monthly multiplier

  // Seasonal suggestions for this month
  const seasonalGroups = SEASONAL_CALENDAR[currentMonth] || [];

  // Current total margins
  const avgMarginBefore = recipes.reduce((s, r) => s + (r.margin?.marginPercent || 0), 0) / recipes.length;
  const totalSavingsPerServing = savingsBreakdown.reduce((s, item) => s + item.savings, 0);
  const avgSellingPrice = recipes.reduce((s, r) => s + r.sellingPrice, 0) / recipes.length;
  const avgCostBefore = recipes.reduce((s, r) => s + (r.margin?.costPerPortion || 0), 0) / recipes.length;
  const avgCostAfter = avgCostBefore - (totalSavingsPerServing / recipes.length);
  const avgMarginAfter = avgSellingPrice > 0 ? ((avgSellingPrice - avgCostAfter) / avgSellingPrice) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#111111] dark:bg-white flex items-center justify-center">
              <Zap className="w-5 h-5 text-white dark:text-[#111111]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111111] dark:text-white">Optimiser la carte ({recipes.length} recettes)</h3>
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Analyse croisee et substitutions groupees</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors">
            <X className="w-5 h-5 text-[#9CA3AF] dark:text-[#737373]" />
          </button>
        </div>

        {/* Summary KPIs */}
        <div className="p-5 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#FAFAFA] dark:bg-[#111111] rounded-xl p-3 text-center">
              <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] mb-1">Recettes</div>
              <div className="text-xl font-bold text-[#111111] dark:text-white">{recipes.length}</div>
            </div>
            <div className="bg-[#FAFAFA] dark:bg-[#111111] rounded-xl p-3 text-center">
              <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] mb-1">Marge moy. actuelle</div>
              <div className={`text-xl font-bold ${avgMarginBefore >= 70 ? 'text-emerald-500' : avgMarginBefore >= 50 ? 'text-amber-500' : 'text-red-500'}`}>{avgMarginBefore.toFixed(1)}%</div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 text-center border border-emerald-200 dark:border-emerald-800">
              <div className="text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-300 mb-1">Marge moy. optimisee</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{avgMarginAfter.toFixed(1)}%</div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 text-center border border-emerald-200 dark:border-emerald-800">
              <div className="text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-300 mb-1">Eco. mensuelle est.</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{totalMonthlySavings.toFixed(0)}{getCurrencySymbol()}</div>
            </div>
          </div>
        </div>

        {/* Common Expensive Ingredients */}
        {commonExpensive.length > 0 && (
          <div className="p-5 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-[#111111] dark:text-white" />
              <h4 className="text-sm font-semibold text-[#111111] dark:text-white">Ingredients couteux communs ({commonExpensive.length})</h4>
            </div>
            <div className="space-y-2">
              {commonExpensive.slice(0, 8).map((ing, idx) => {
                const pct = totalCostAll > 0 ? (ing.totalCost / totalCostAll) * 100 : 0;
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-[#111111] dark:text-white">{ing.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF] dark:text-[#737373]">
                          {ing.recipeCount} recettes
                        </span>
                      </div>
                      <span className="font-mono text-[#111111] dark:text-white">{ing.totalCost.toFixed(2)}{getCurrencySymbol()}</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#F3F4F6] dark:bg-[#171717] overflow-hidden">
                      <div className="h-full rounded-full bg-red-500 transition-all duration-500" style={{ width: `${Math.max(pct, 1)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bulk Substitution Suggestions */}
        {savingsBreakdown.length > 0 && (
          <div className="p-5 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-sm font-semibold text-[#111111] dark:text-white">Substitutions groupees recommandees</h4>
            </div>
            <div className="space-y-3">
              {savingsBreakdown.slice(0, 6).map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#111111] border border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#111111] dark:text-white">{item.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{item.bestAlt.ingredient.name}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-500">-{item.savings.toFixed(2)}{getCurrencySymbol()}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-[#9CA3AF] dark:text-[#737373]">
                    <span>Affecte {item.recipeCount} recettes</span>
                    <span>{item.ingredient.pricePerUnit.toFixed(2)} → {item.bestAlt.ingredient.pricePerUnit.toFixed(2)}{getCurrencySymbol()}/{item.ingredient.unit}</span>
                    <span className={`px-1.5 py-0.5 rounded-full font-medium ${item.bestAlt.quality === 'aucun' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : item.bestAlt.quality === 'minimal' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
                      Impact: {item.bestAlt.quality}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seasonal Suggestions */}
        <div className="p-5 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-center gap-2 mb-3">
            <SeasonIcon month={currentMonth} />
            <h4 className="text-sm font-semibold text-[#111111] dark:text-white">Suggestions saisonnieres — {monthNames[currentMonth]}</h4>
          </div>
          <div className="space-y-2">
            {seasonalGroups.map((group, gIdx) => (
              <div key={gIdx} className="p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/50">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-green-700 dark:text-green-300">{group.label}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium">-{group.discount}% ce mois</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {group.patterns.map((p, pIdx) => (
                    <span key={pIdx} className="px-1.5 py-0.5 rounded text-[10px] bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white border border-green-200 dark:border-green-800/50">{p}</span>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373] italic">
              Ce mois-ci, privilegiez les ingredients de saison pour reduire les couts et ameliorer la fraicheur.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-[#FAFAFA] dark:bg-[#111111] rounded-b-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">Analyse basee sur {sortedIngredients.length} ingredients — {recipes.length} recettes</span>
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-lg hover:opacity-90 transition-opacity">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Recipes() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { selectedRestaurant, loading: restaurantLoading } = useRestaurant();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Category coefficients
  const [coefficients, setCoefficients] = useState<Record<string, number>>(loadCoefficients);
  const [editingCoeff, setEditingCoeff] = useState(false);
  const [tempCoeff, setTempCoeff] = useState<number>(3.5);

  // View & filter state
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [activeTab, setActiveTab] = useState<'recipes' | 'templates' | 'modeles'>('recipes');
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<string>('all');
  const [templateSearch, setTemplateSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Advanced filters (via FilterPanel)
  const [recipeFilters, setRecipeFilters] = useState<FilterValues>({
    category: '',
    margin: { min: '', max: '' },
    cost: { min: '', max: '' },
    ingredientCount: { min: '', max: '' },
  });

  const [form, setForm] = useState({
    name: '',
    category: 'Plat',
    sellingPrice: '',
    nbPortions: '1',
    description: '',
    prepTimeMinutes: '',
    cookTimeMinutes: '',
    laborCostPerHour: '',
  });
  const [formIngredients, setFormIngredients] = useState<{
    ingredientId: number | null;
    quantity: string;
    wastePercent: string;
    unit?: string;
    // For new (free-text) ingredients:
    newName: string;
    newUnit: string;
    newPrice: string;
    newCategory: string;
  }[]>([]);

  // Suggestion system (template-based)
  const [suggestions, setSuggestions] = useState<RecipeTemplate[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // AI Mercuriale suggestion system
  const [aiSuggestions, setAiSuggestions] = useState<MercurialeSuggestedIngredient[]>([]);
  const [aiSuggestionsLoading, setAiSuggestionsLoading] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [aiSuggestionsChecked, setAiSuggestionsChecked] = useState<boolean[]>([]);

  // Bulk selection
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<Set<number>>(new Set());
  const [bulkRecipeCategoryOpen, setBulkRecipeCategoryOpen] = useState(false);

  // Sort for grid view
  const [gridSort, setGridSort] = useState<'margin-asc' | 'margin-desc' | 'cost-desc' | 'cost-asc' | 'price-desc' | 'price-asc' | 'name-asc' | 'name-desc'>('margin-asc');

  // Batch margin fixer
  const [showBatchFixer, setShowBatchFixer] = useState(false);
  const [batchTargetMargin, setBatchTargetMargin] = useState(70);

  // Recipe comparison
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Cost Optimizer
  const [optimizingRecipe, setOptimizingRecipe] = useState<Recipe | null>(null);
  const [showBatchOptimizer, setShowBatchOptimizer] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [variantTarget, setVariantTarget] = useState<Recipe | null>(null);
  const [variantName, setVariantName] = useState('');
  const [variantCategory, setVariantCategory] = useState('');
  const [variantPortions, setVariantPortions] = useState('');
  const [variantLoading, setVariantLoading] = useState(false);
  const navigate = useNavigate();

  // New: form enhancements state
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [templateApplyInfo, setTemplateApplyInfo] = useState<{ found: number; total: number; missing: string[] } | null>(null);

  // ── Weighing state ─────────────────────────────────────────────────────
  const scaleHook = useScale();
  const [modePesee, setModePesee] = useState(false);
  const [weighingLineIdx, setWeighingLineIdx] = useState<number | null>(null);
  const [showBatchWeighing, setShowBatchWeighing] = useState(false);
  const [showQuickWeighAdd, setShowQuickWeighAdd] = useState(false);
  const [useSimulation, setUseSimulation] = useState(false);
  const [simWeight, setSimWeight] = useState(0);
  const [weighedLines, setWeighedLines] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (restaurantLoading || !selectedRestaurant) return;
    loadData();
  }, [selectedRestaurant, restaurantLoading]);

  async function loadData() {
    try {
      const [r, i] = await Promise.all([fetchRecipes(), fetchIngredients()]);
      setRecipes(r);
      setIngredients(i);
    } catch {
      showToast(t("recipes.errorLoading"), 'error');
    } finally {
      setLoading(false);
    }
  }

  // ── KPI Summary ──────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    if (recipes.length === 0) return { total: 0, avgMargin: 0, bestName: '-', bestMargin: 0, dangerCount: 0 };
    const avgMargin = recipes.reduce((s, r) => s + (r.margin?.marginPercent || 0), 0) / recipes.length;
    const best = recipes.reduce((a, b) => (a.margin?.marginPercent || 0) >= (b.margin?.marginPercent || 0) ? a : b);
    const dangerCount = recipes.filter((r) => (r.margin?.marginPercent || 0) < 60).length;
    return { total: recipes.length, avgMargin, bestName: best.name, bestMargin: best.margin?.marginPercent || 0, dangerCount };
  }, [recipes]);

  // ── Category pills ──────────────────────────────────────────────────
  const categoryPills = useMemo(() => {
    const counts: Record<string, number> = {};
    recipes.forEach((r) => { counts[r.category] = (counts[r.category] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
  }, [recipes]);

  // ── Templates library data ───────────────────────────────────────
  const templatesByCategory = useMemo(() => getTemplatesByCategory(), []);
  const filteredTemplates = useMemo(() => {
    let templates: RecipeTemplate[] = [];
    if (templateCategoryFilter === 'all') {
      for (const cat of TEMPLATE_CATEGORY_ORDER) {
        if (templatesByCategory[cat]) templates.push(...templatesByCategory[cat]);
      }
    } else {
      templates = templatesByCategory[templateCategoryFilter] || [];
    }
    if (templateSearch.trim()) {
      const q = templateSearch.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      templates = templates.filter((t) => {
        const name = t.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return name.includes(q);
      });
    }
    return templates;
  }, [templatesByCategory, templateCategoryFilter, templateSearch]);

  // Smart search suggestions for recipes
  const recipeSearchSuggestions = useMemo<SearchSuggestion[]>(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return recipes
      .filter((r) => r.name.toLowerCase().includes(q))
      .slice(0, 8)
      .map((r) => ({
        id: `rec-${r.id}`,
        label: r.name,
        category: 'Recettes',
        icon: ClipboardList,
        onSelect: () => setSearch(r.name),
      }));
  }, [search, recipes]);

  // Filter definitions for FilterPanel
  const recipeFilterDefs = useMemo<FilterDef[]>(() => [
    {
      key: 'category',
      label: 'Categorie',
      type: 'select',
      placeholder: 'Toutes les categories',
      options: RECIPE_CATEGORIES.map((c) => ({ value: c, label: c })),
    },
    {
      key: 'margin',
      label: 'Marge (%)',
      type: 'range',
      step: 1,
      unit: '%',
    },
    {
      key: 'cost',
      label: 'Cout portion',
      type: 'range',
      step: 0.1,
      unit: '\u20AC',
    },
    {
      key: 'ingredientCount',
      label: 'Nombre d\'ingredients',
      type: 'range',
      step: 1,
    },
  ], []);

  const filtered = recipes.filter((r) => {
    const q = search.toLowerCase();
    const matchesName = r.name.toLowerCase().includes(q);
    const matchesCat = r.category.toLowerCase().includes(q);
    const matchesIngredient = r.ingredients?.some(
      (ri) => ri.ingredient?.name?.toLowerCase().includes(q)
    );
    const matchesSearch = !q || matchesName || matchesCat || matchesIngredient;
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;

    // Advanced filters
    const fCat = recipeFilters.category;
    const fMargin = recipeFilters.margin || { min: '', max: '' };
    const fCost = recipeFilters.cost || { min: '', max: '' };
    const fIngCount = recipeFilters.ingredientCount || { min: '', max: '' };
    const matchFilterCat = !fCat || r.category === fCat;
    const matchMarginMin = !fMargin.min || (r.margin?.marginPercent || 0) >= parseFloat(fMargin.min);
    const matchMarginMax = !fMargin.max || (r.margin?.marginPercent || 0) <= parseFloat(fMargin.max);
    const matchCostMin = !fCost.min || (r.margin?.costPerPortion || 0) >= parseFloat(fCost.min);
    const matchCostMax = !fCost.max || (r.margin?.costPerPortion || 0) <= parseFloat(fCost.max);
    const ingCount = r.ingredients?.length || 0;
    const matchIngMin = !fIngCount.min || ingCount >= parseFloat(fIngCount.min);
    const matchIngMax = !fIngCount.max || ingCount <= parseFloat(fIngCount.max);

    return matchesSearch && matchesCategory && matchFilterCat && matchMarginMin && matchMarginMax && matchCostMin && matchCostMax && matchIngMin && matchIngMax;
  });

  // ── Table sort logic ────────────────────────────────────────────────
  const sortedFiltered = useMemo(() => {
    if (viewMode !== 'table') return filtered;
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      let va: string | number, vb: string | number;
      switch (sortColumn) {
        case 'name': va = a.name.toLowerCase(); vb = b.name.toLowerCase(); break;
        case 'category': va = a.category; vb = b.category; break;
        case 'sellingPrice': va = a.sellingPrice; vb = b.sellingPrice; break;
        case 'cost': va = a.margin.costPerPortion; vb = b.margin.costPerPortion; break;
        case 'margin': va = a.margin.marginPercent; vb = b.margin.marginPercent; break;
        case 'coefficient': va = a.margin.coefficient; vb = b.margin.coefficient; break;
        default: va = a.name; vb = b.name;
      }
      if (va < vb) return sortDirection === 'asc' ? -1 : 1;
      if (va > vb) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filtered, sortColumn, sortDirection, viewMode]);

  // ── Grid sort logic ─────────────────────────────────────────────────
  const gridSortedFiltered = useMemo(() => {
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      switch (gridSort) {
        case 'margin-asc': return (a.margin?.marginPercent || 0) - (b.margin?.marginPercent || 0);
        case 'margin-desc': return (b.margin?.marginPercent || 0) - (a.margin?.marginPercent || 0);
        case 'cost-desc': return (b.margin?.costPerPortion || 0) - (a.margin?.costPerPortion || 0);
        case 'cost-asc': return (a.margin?.costPerPortion || 0) - (b.margin?.costPerPortion || 0);
        case 'price-desc': return b.sellingPrice - a.sellingPrice;
        case 'price-asc': return a.sellingPrice - b.sellingPrice;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });
    return sorted;
  }, [filtered, gridSort]);

  // ── Comparison helpers ─────────────────────────────────────────────
  function toggleCompare(id: number) {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  }

  // ── Batch margin fixer: compute optimal prices ─────────────────────
  const batchFixerResults = useMemo(() => {
    if (!showBatchFixer) return [];
    const ids = Array.from(selectedRecipeIds);
    return ids.map(id => {
      const recipe = recipes.find(r => r.id === id);
      if (!recipe) return null;
      const cost = recipe.margin?.costPerPortion || 0;
      const targetPrice = cost / (1 - batchTargetMargin / 100);
      const currentMargin = recipe.margin?.marginPercent || 0;
      return {
        id: recipe.id,
        name: recipe.name,
        currentPrice: recipe.sellingPrice,
        currentMargin,
        suggestedPrice: Math.ceil(targetPrice * 2) / 2, // round to nearest 0.50
        cost,
      };
    }).filter(Boolean) as { id: number; name: string; currentPrice: number; currentMargin: number; suggestedPrice: number; cost: number }[];
  }, [showBatchFixer, selectedRecipeIds, recipes, batchTargetMargin]);

  // ── Bulk selection helpers (recipes) ────────────────────────────────
  function toggleSelectRecipe(id: number) {
    setSelectedRecipeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAllRecipes() {
    if (selectedRecipeIds.size === filtered.length) {
      setSelectedRecipeIds(new Set());
    } else {
      setSelectedRecipeIds(new Set(filtered.map((r) => r.id)));
    }
  }

  async function bulkDeleteRecipes() {
    const ids = Array.from(selectedRecipeIds);
    try {
      await Promise.all(ids.map((id) => deleteRecipe(id)));
      showToast(`${ids.length} recette(s) supprimee(s)`, 'success');
      setSelectedRecipeIds(new Set());
      loadData();
    } catch {
      showToast(t("recipes.errorDeleting"), 'error');
    }
  }

  async function bulkChangeRecipeCategory(category: string) {
    const ids = Array.from(selectedRecipeIds);
    try {
      for (const id of ids) {
        const recipe = recipes.find((r) => r.id === id);
        if (recipe) {
          await updateRecipe(id, {
            name: recipe.name,
            category,
            sellingPrice: recipe.sellingPrice,
            nbPortions: recipe.nbPortions,
            description: recipe.description || undefined,
            prepTimeMinutes: recipe.prepTimeMinutes ?? undefined,
            cookTimeMinutes: recipe.cookTimeMinutes ?? undefined,
            laborCostPerHour: recipe.laborCostPerHour ?? undefined,
            ingredients: recipe.ingredients.map((ri) => ({
              ingredientId: ri.ingredientId,
              quantity: ri.quantity,
              wastePercent: ri.wastePercent,
            })),
          });
        }
      }
      showToast(`Categorie changee pour ${ids.length} recette(s)`, 'success');
      setSelectedRecipeIds(new Set());
      setBulkRecipeCategoryOpen(false);
      loadData();
    } catch {
      showToast(t("recipes.errorSaving"), 'error');
    }
  }

  function handleSort(col: string) {
    if (sortColumn === col) {
      setSortDirection((d) => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(col);
      setSortDirection('asc');
    }
  }

  function SortIcon({ col }: { col: string }) {
    if (sortColumn !== col) return <ChevronsUpDown className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-[#737373]" />;
    return sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />;
  }

  // Filtered ingredients for the add-ingredient dropdown search
  const filteredIngredients = useMemo(() => {
    if (!ingredientSearch.trim()) return ingredients;
    const q = ingredientSearch.toLowerCase();
    return ingredients.filter((i) =>
      i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
    );
  }, [ingredients, ingredientSearch]);

  function openNew() {
    setForm({ name: '', category: 'Plat', sellingPrice: '', nbPortions: '1', description: '', prepTimeMinutes: '', cookTimeMinutes: '', laborCostPerHour: '' });
    setFormIngredients([]);
    setEditingId(null);
    setTemplateApplyInfo(null);
    setIngredientSearch('');
    setWeighingLineIdx(null); setShowBatchWeighing(false); setShowQuickWeighAdd(false); setWeighedLines(new Set()); setSimWeight(0);
    setShowForm(true);
  }

  function openEdit(recipe: Recipe) {
    setForm({
      name: recipe.name,
      category: recipe.category,
      sellingPrice: String(recipe.sellingPrice),
      nbPortions: String(recipe.nbPortions),
      description: recipe.description || '',
      prepTimeMinutes: recipe.prepTimeMinutes ? String(recipe.prepTimeMinutes) : '',
      cookTimeMinutes: recipe.cookTimeMinutes ? String(recipe.cookTimeMinutes) : '',
      laborCostPerHour: recipe.laborCostPerHour ? String(recipe.laborCostPerHour) : '',
    });
    setFormIngredients(
      recipe.ingredients.map((ri) => ({
        ingredientId: ri.ingredientId,
        quantity: String(ri.quantity),
        wastePercent: ri.wastePercent ? String(ri.wastePercent) : '0',
        newName: '',
        newUnit: '',
        newPrice: '',
        newCategory: '',
      }))
    );
    setEditingId(recipe.id);
    setTemplateApplyInfo(null);
    setIngredientSearch('');
    setWeighingLineIdx(null); setShowBatchWeighing(false); setShowQuickWeighAdd(false); setWeighedLines(new Set()); setSimWeight(0);
    setShowForm(true);
  }

  // Handle recipe name change - search for templates
  function handleNameChange(value: string) {
    setForm({ ...form, name: value });
    if (!editingId && value.length >= 2) {
      const results = searchTemplates(value);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  // Apply a template suggestion - with enhanced feedback
  function applyTemplate(template: RecipeTemplate) {
    setForm({
      name: template.name,
      category: template.category,
      sellingPrice: String(template.suggestedSellingPrice),
      nbPortions: String(template.nbPortions),
      description: template.description,
      prepTimeMinutes: String(template.suggestedPrepTime),
      cookTimeMinutes: String(template.suggestedCookTime),
      laborCostPerHour: '',
    });

    // Map template ingredients to actual ingredients in DB
    const missing: string[] = [];
    const mapped = template.suggestedIngredients
      .map((ti: { name: string; quantity: number; wastePercent: number }) => {
        const found = ingredients.find((i) => i.name === ti.name);
        if (!found) {
          missing.push(ti.name);
          return null;
        }
        return {
          ingredientId: found.id,
          quantity: String(ti.quantity),
          wastePercent: String(ti.wastePercent),
          newName: '',
          newUnit: '',
          newPrice: '',
          newCategory: '',
        };
      })
      .filter(Boolean) as typeof formIngredients;

    setFormIngredients(mapped);
    setTemplateApplyInfo({
      found: mapped.length,
      total: template.suggestedIngredients.length,
      missing,
    });
    setShowSuggestions(false);
    setSuggestions([]);
  }

  // Use a template from the library tab — opens the creation form pre-filled
  function useTemplate(template: RecipeTemplate) {
    applyTemplate(template);
    setActiveTab('recipes');
    setShowForm(true);
  }

  // ── Import a full recipe pack (creates ingredients + recipes) ──────
  const [importingPack, setImportingPack] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{ packName: string; created: number; total: number } | null>(null);

  async function importPack(pack: RecipePack) {
    setImportingPack(pack.id);
    setImportResult(null);
    let created = 0;

    try {
      for (const recipe of pack.recipes) {
        // Resolve each ingredient: find in DB or create
        const resolvedIngredients: { ingredientId: number; quantity: number; wastePercent: number }[] = [];

        for (const ing of recipe.ingredients) {
          // Try to find by exact name (case-insensitive)
          let found = ingredients.find(
            (i) => i.name.toLowerCase() === ing.name.toLowerCase()
          );

          if (!found) {
            // Create the ingredient
            const newIng = await createIngredient({
              name: ing.name,
              unit: ing.unit,
              pricePerUnit: ing.pricePerUnit,
              category: ing.category,
              supplier: null,
              supplierId: null,
              allergens: [],
            });
            found = newIng;
            // Update local state so subsequent recipes can find it
            setIngredients((prev) => {
              // Avoid duplicates if another recipe in the pack uses the same ingredient
              if (prev.find((p) => p.id === newIng.id)) return prev;
              return [...prev, newIng];
            });
            // Also update the local reference for the current loop
            ingredients.push(newIng);
          }

          resolvedIngredients.push({
            ingredientId: found.id,
            quantity: ing.quantity,
            wastePercent: ing.wastePercent,
          });
        }

        // Check if recipe already exists by name
        const existingRecipe = recipes.find(
          (r) => r.name.toLowerCase() === recipe.name.toLowerCase()
        );
        if (existingRecipe) continue; // Skip duplicates

        // Create the recipe
        await createRecipe({
          name: recipe.name,
          category: recipe.category,
          sellingPrice: recipe.sellingPrice,
          nbPortions: recipe.nbPortions,
          description: recipe.description,
          prepTimeMinutes: recipe.prepTimeMinutes,
          cookTimeMinutes: recipe.cookTimeMinutes,
          ingredients: resolvedIngredients,
        });
        created++;
        trackEvent('recipe_created');
      }

      setImportResult({ packName: pack.name, created, total: pack.recipes.length });
      showToast(`Pack "${pack.name}" importe : ${created} recette(s) creee(s)`, 'success');
      updateOnboardingStep('recipeCreated', true);
      loadData();
    } catch (err) {
      showToast(`Erreur lors de l'import du pack "${pack.name}"`, 'error');
    } finally {
      setImportingPack(null);
    }
  }

  // AI Mercuriale: suggest ingredients for recipe
  async function handleAiSuggest() {
    if (!form.name.trim() || form.name.trim().length < 2) {
      showToast('Entrez un nom de recette (min 2 caracteres)', 'error');
      return;
    }
    setAiSuggestionsLoading(true);
    setShowAiSuggestions(false);
    try {
      const res = await fetch(`/api/mercuriale/suggest?q=${encodeURIComponent(form.name.trim())}`, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`, 'X-Restaurant-Id': localStorage.getItem('activeRestaurantId') || '1' } });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: `Erreur ${res.status}` }));
        showToast(errData.error || `Erreur ${res.status}`, 'error');
        return;
      }
      const data = await res.json();
      if (data.ingredients && data.ingredients.length > 0) {
        setAiSuggestions(data.ingredients);
        setAiSuggestionsChecked(data.ingredients.map(() => true));
        setShowAiSuggestions(true);
        showToast(`${data.ingredients.length} ingredients suggeres par l'IA`, 'success');
      } else {
        showToast('L\'IA n\'a pas pu generer de suggestions. Verifiez que le nom de recette est clair (ex: "Risotto aux cepes").', 'info');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur connexion serveur';
      showToast(`Erreur IA: ${msg}`, 'error');
    } finally {
      setAiSuggestionsLoading(false);
    }
  }

  // Add selected AI suggestions to the recipe form
  function applyAiSuggestions() {
    const selected = aiSuggestions.filter((_, i) => aiSuggestionsChecked[i]);
    const newLines = selected.map((s) => {
      // Try to match to an existing ingredient in DB
      const existing = ingredients.find(
        (i) => i.name.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(i.name.toLowerCase())
      );
      return {
        ingredientId: existing?.id ?? null,
        quantity: String(s.quantity),
        wastePercent: '0',
        newName: existing ? '' : s.name,
        newUnit: existing ? '' : s.unit,
        newPrice: existing ? '' : (s.marketPrice != null ? String(s.marketPrice.toFixed(2)) : ''),
        newCategory: existing ? '' : 'Autres',
      };
    });
    setFormIngredients([...formIngredients, ...newLines]);
    setShowAiSuggestions(false);
    setAiSuggestions([]);
    showToast(`${selected.length} ingredient(s) ajoute(s)`, 'success');
  }

  function addIngredientLine() {
    // Always allow adding — user can type a new ingredient name if DB is empty
    const defaultIng = filteredIngredients.length > 0 ? filteredIngredients[0] : ingredients[0];
    setFormIngredients([...formIngredients, {
      ingredientId: defaultIng?.id ?? null,
      quantity: '',
      wastePercent: '0',
      newName: '',
      newUnit: 'kg',
      newPrice: '',
      newCategory: 'Autres',
    }]);
  }

  function removeIngredientLine(index: number) {
    setFormIngredients(formIngredients.filter((_, i) => i !== index));
    setWeighedLines(prev => { const next = new Set(prev); next.delete(index); return next; });
  }

  function handleWeighComplete(lineIdx: number, quantity: number) {
    const updated = [...formIngredients]; updated[lineIdx] = { ...updated[lineIdx], quantity: String(quantity) }; setFormIngredients(updated); setWeighedLines(prev => new Set(prev).add(lineIdx)); setSimWeight(0);
    if (modePesee) { const nextIdx = formIngredients.findIndex((_, i) => i > lineIdx && !weighedLines.has(i)); if (nextIdx >= 0) { setWeighingLineIdx(nextIdx); } else { setWeighingLineIdx(null); } } else { setWeighingLineIdx(null); }
  }
  function handleBatchWeighComplete(lineIdx: number, quantity: number) {
    const updated = [...formIngredients]; updated[lineIdx] = { ...updated[lineIdx], quantity: String(quantity) }; setFormIngredients(updated); setWeighedLines(prev => new Set(prev).add(lineIdx)); setSimWeight(0);
  }
  function handleQuickWeighAdd(ingredientId: number, quantity: number) {
    const ing = ingredients.find(i => i.id === ingredientId); if (!ing) return;
    setFormIngredients(prev => [...prev, { ingredientId, quantity: String(quantity), wastePercent: '0', newName: '', newUnit: ing.unit || 'kg', newPrice: '', newCategory: '' }]);
    setWeighedLines(prev => new Set(prev).add(formIngredients.length)); setSimWeight(0);
  }

  // Real-time cost calculation with unit conversion
  const liveCost = formIngredients.reduce((total, fi) => {
    const qty = parseFloat(fi.quantity) || 0;
    const waste = parseFloat(fi.wastePercent) || 0;
    const effectiveQty = qty * (1 + waste / 100);
    if (fi.ingredientId) {
      const ing = ingredients.find((i) => i.id === fi.ingredientId);
      if (!ing) return total;
      const inputUnit = fi.unit || ing.unit || 'kg';
      const priceUnit = ing.unit || 'kg';
      const convertedQty = convertToBaseUnit(effectiveQty, inputUnit, priceUnit);
      return total + ing.pricePerUnit * convertedQty;
    }
    // New ingredient: use the price typed by user (price is per newUnit)
    const newPrice = parseFloat(fi.newPrice) || 0;
    const inputUnit = fi.unit || fi.newUnit || 'kg';
    const priceUnit = fi.newUnit || 'kg';
    const convertedQty = convertToBaseUnit(effectiveQty, inputUnit, priceUnit);
    return total + newPrice * convertedQty;
  }, 0);

  const livePortions = parseInt(form.nbPortions) || 1;
  const liveCostPerPortion = liveCost / livePortions;

  // Labor cost calculation
  const livePrepTime = parseFloat(form.prepTimeMinutes) || 0;
  const liveCookTime = parseFloat(form.cookTimeMinutes) || 0;
  const liveLaborRate = parseFloat(form.laborCostPerHour) || 0;
  const liveLaborCost = ((livePrepTime + liveCookTime) / 60) * liveLaborRate;
  const liveLaborPerPortion = liveLaborCost / livePortions;
  const liveTotalPerPortion = liveCostPerPortion + liveLaborPerPortion;

  const liveSellingPrice = parseFloat(form.sellingPrice) || 0;
  const liveMargin = liveSellingPrice > 0 ? ((liveSellingPrice - liveTotalPerPortion) / liveSellingPrice) * 100 : 0;

  // Suggested price based on category coefficient
  const liveCoeff = getCoefficient(form.category, coefficients);
  const liveSuggestedPrice = liveTotalPerPortion * liveCoeff;

  // Keyboard shortcut: Ctrl+Enter to save
  const handleFormKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      const formEl = (e.target as HTMLElement).closest('form');
      if (formEl) formEl.requestSubmit();
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      // First, create any new ingredients that were typed as free text
      const resolvedIngredients: { ingredientId: number; quantity: number; wastePercent: number }[] = [];

      for (const fi of formIngredients) {
        if (parseFloat(fi.quantity) <= 0) continue;

        let ingredientId = fi.ingredientId;

        if (!ingredientId && fi.newName.trim()) {
          // Check if ingredient already exists by name (case-insensitive)
          const existingByName = ingredients.find(
            (i) => i.name.toLowerCase() === fi.newName.trim().toLowerCase()
          );
          if (existingByName) {
            ingredientId = existingByName.id;
          } else {
            // Create the new ingredient
            const newIng = await createIngredient({
              name: fi.newName.trim(),
              unit: fi.newUnit || 'kg',
              pricePerUnit: parseFloat(fi.newPrice) || 0,
              category: fi.newCategory || 'Autres',
              supplier: null,
              supplierId: null,
              allergens: [],
            });
            ingredientId = newIng.id;
            // Add to local state so it shows up immediately
            setIngredients((prev) => [...prev, newIng]);
          }
        }

        if (ingredientId) {
          resolvedIngredients.push({
            ingredientId,
            quantity: parseFloat(fi.quantity),
            wastePercent: parseFloat(fi.wastePercent) || 0,
          });
        }
      }

      const data = {
        name: form.name,
        category: form.category,
        sellingPrice: parseFloat(form.sellingPrice),
        nbPortions: parseInt(form.nbPortions) || 1,
        description: form.description || undefined,
        prepTimeMinutes: form.prepTimeMinutes ? parseFloat(form.prepTimeMinutes) : undefined,
        cookTimeMinutes: form.cookTimeMinutes ? parseFloat(form.cookTimeMinutes) : undefined,
        laborCostPerHour: form.laborCostPerHour ? parseFloat(form.laborCostPerHour) : undefined,
        ingredients: resolvedIngredients,
      };

      if (editingId) {
        await updateRecipe(editingId, data);
      } else {
        await createRecipe(data);
        trackEvent('recipe_created');
        updateOnboardingStep('recipeCreated', true);
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowForm(false);
        showToast(editingId ? t("recipes.recipeUpdated") : t("recipes.recipeCreated"), 'success');
        loadData();
      }, 600);
    } catch {
      showToast(t("recipes.errorSaving"), 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await deleteRecipe(deleteTarget);
      showToast(t("recipes.recipeDeleted"), 'success');
      loadData();
    } catch {
      showToast(t("recipes.errorDeleting"), 'error');
    } finally {
      setDeleteTarget(null);
    }
  }

  async function handleClone(recipeId: number) {
    try {
      await cloneRecipe(recipeId);
      showToast(t("recipes.recipeCloned"), 'success');
      loadData();
    } catch {
      showToast(t("recipes.errorCloning"), 'error');
    }
  }

  // Quick duplicate: pre-fills form with "Copie de [original]" and opens edit form
  function handleQuickDuplicate(recipe: Recipe) {
    setForm({
      name: `Copie de ${recipe.name}`,
      category: recipe.category,
      sellingPrice: String(recipe.sellingPrice),
      nbPortions: String(recipe.nbPortions),
      description: recipe.description || '',
      prepTimeMinutes: recipe.prepTimeMinutes ? String(recipe.prepTimeMinutes) : '',
      cookTimeMinutes: recipe.cookTimeMinutes ? String(recipe.cookTimeMinutes) : '',
      laborCostPerHour: recipe.laborCostPerHour ? String(recipe.laborCostPerHour) : '',
    });
    setFormIngredients(
      recipe.ingredients.map((ri) => ({
        ingredientId: ri.ingredientId,
        quantity: String(ri.quantity),
        wastePercent: ri.wastePercent ? String(ri.wastePercent) : '0',
        newName: '',
        newUnit: '',
        newPrice: '',
        newCategory: '',
      }))
    );
    setEditingId(null); // New recipe, not editing
    setTemplateApplyInfo(null);
    setIngredientSearch('');
    setWeighingLineIdx(null); setShowBatchWeighing(false); setShowQuickWeighAdd(false); setWeighedLines(new Set()); setSimWeight(0);
    setShowForm(true);
    showToast('Formulaire pre-rempli avec les ingredients', 'success');
  }

  function openVariantModal(recipe: Recipe) {
    setVariantTarget(recipe);
    setVariantName(`${recipe.name} \u2014 Variante`);
    setVariantCategory(recipe.category);
    setVariantPortions(String(recipe.nbPortions));
    setVariantLoading(false);
  }

  async function handleVariantCreate() {
    if (!variantTarget || !variantName.trim()) return;
    setVariantLoading(true);
    try {
      // 1) Clone via existing API
      const cloned = await cloneRecipe(variantTarget.id);
      // 2) Update with user's chosen name, category, portions
      const updatedIngredients = cloned.ingredients.map((ri) => ({
        ingredientId: ri.ingredientId,
        quantity: ri.quantity,
        wastePercent: ri.wastePercent,
      }));
      await updateRecipe(cloned.id, {
        name: variantName.trim(),
        category: variantCategory,
        sellingPrice: cloned.sellingPrice,
        nbPortions: parseInt(variantPortions) || cloned.nbPortions,
        description: cloned.description || undefined,
        prepTimeMinutes: cloned.prepTimeMinutes ?? undefined,
        cookTimeMinutes: cloned.cookTimeMinutes ?? undefined,
        laborCostPerHour: cloned.laborCostPerHour ?? undefined,
        ingredients: updatedIngredients,
      });
      showToast(t("recipes.recipeCloned"), 'success');
      setVariantTarget(null);
      navigate(`/recipes/${cloned.id}`);
    } catch {
      showToast(t("recipes.errorCloning"), 'error');
    } finally {
      setVariantLoading(false);
    }
  }

  // Compute template preview data
  function getTemplatePreview(tpl: RecipeTemplate) {
    let estimatedCost = 0;
    let foundCount = 0;
    tpl.suggestedIngredients.forEach((ti) => {
      const found = ingredients.find((i) => i.name === ti.name);
      if (found) {
        foundCount++;
        const effectiveQty = ti.quantity * (1 + ti.wastePercent / 100);
        const convertedQty = convertToBaseUnit(effectiveQty, ti.unit || found.unit || 'kg', found.unit || 'kg');
        estimatedCost += found.pricePerUnit * convertedQty;
      }
    });
    const costPerPortion = estimatedCost / tpl.nbPortions;
    const margin = tpl.suggestedSellingPrice > 0
      ? ((tpl.suggestedSellingPrice - costPerPortion) / tpl.suggestedSellingPrice) * 100
      : 0;
    return { estimatedCost, costPerPortion, margin, foundCount };
  }

  if (loading) return <div className="text-center py-12 text-[#9CA3AF] dark:text-[#737373]">{t("recipes.loading")}</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold font-satoshi text-[#111111] dark:text-white">{t("recipes.title")}</h2>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
          <Plus className="w-4 h-4" /> {t("recipes.newRecipe")}
        </button>
      </div>

      {/* ── KPI Summary Cards ──────────────────────────────────────────── */}
      {recipes.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5 sm:p-6">
            <div className="text-xs font-general-sans text-[#737373] dark:text-[#A3A3A3] mb-1">{t("recipes.kpiTotal")}</div>
            <div className="text-2xl font-bold font-satoshi tabular-nums text-[#111111] dark:text-white">{kpis.total}</div>
          </div>
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5 sm:p-6">
            <div className="text-xs font-general-sans text-[#737373] dark:text-[#A3A3A3] mb-1">{t("recipes.kpiAvgMargin")}</div>
            <div className={`text-2xl font-bold font-satoshi tabular-nums ${kpis.avgMargin >= 70 ? 'text-emerald-600 dark:text-emerald-400' : kpis.avgMargin >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>{kpis.avgMargin.toFixed(1)}%</div>
          </div>
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5 sm:p-6">
            <div className="flex items-center gap-1 text-xs font-general-sans text-[#737373] dark:text-[#A3A3A3] mb-1">
              <Trophy className="w-3 h-3" /> {t("recipes.kpiBestMargin")}
            </div>
            <div className="text-sm font-bold font-satoshi text-emerald-600 dark:text-emerald-400 truncate" title={kpis.bestName}>{kpis.bestName}</div>
            <div className="text-xs font-general-sans tabular-nums text-[#737373] dark:text-[#A3A3A3]">{kpis.bestMargin.toFixed(1)}%</div>
          </div>
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5 sm:p-6">
            <div className="flex items-center gap-1 text-xs font-general-sans text-[#737373] dark:text-[#A3A3A3] mb-1">
              <ShieldAlert className="w-3 h-3" /> {t("recipes.kpiDanger")}
            </div>
            <div className={`text-2xl font-bold font-satoshi tabular-nums ${kpis.dangerCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{kpis.dangerCount}</div>
          </div>
        </div>
      )}

      {/* ── Margin Health Bar ─────────────────────────────────────────── */}
      {recipes.length > 0 && <MarginHealthBar recipes={recipes} />}

      {/* ── Tabs: Mes recettes / Templates ──────────────────────────────── */}
      <div className="flex items-center gap-1 mb-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A] overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
        <button
          onClick={() => setActiveTab('recipes')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap shrink-0 ${activeTab === 'recipes' ? 'border-[#111111] dark:border-white text-[#111111] dark:text-white' : 'border-transparent text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white'}`}
        >
          <UtensilsCrossed className="w-4 h-4 shrink-0" />
          Mes recettes
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap shrink-0 ${activeTab === 'templates' ? 'border-[#111111] dark:border-white text-[#111111] dark:text-white' : 'border-transparent text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white'}`}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          Templates
        </button>
        <button
          onClick={() => setActiveTab('modeles')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap shrink-0 ${activeTab === 'modeles' ? 'border-[#111111] dark:border-white text-[#111111] dark:text-white' : 'border-transparent text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white'}`}
        >
          <Package className="w-4 h-4 shrink-0" />
          Modeles
        </button>
      </div>

      {activeTab === 'recipes' && (
      <>
      {/* ── Search bar + Sort + View toggle ─────────────────────────────── */}
      <div className="space-y-2 mb-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={t("recipes.searchPlaceholder")}
          pageKey="recipes"
          suggestions={recipeSearchSuggestions}
          className="flex-1 sm:max-w-md"
        />

        {/* Sort dropdown for grid view */}
        {viewMode === 'grid' && (
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-[#737373]" />
            <select
              value={gridSort}
              onChange={(e) => setGridSort(e.target.value as typeof gridSort)}
              className="input text-xs py-1.5 pr-8"
            >
              <option value="margin-asc">Marge (pire d'abord)</option>
              <option value="margin-desc">Marge (meilleure d'abord)</option>
              <option value="cost-desc">Cout (plus cher d'abord)</option>
              <option value="cost-asc">Cout (moins cher d'abord)</option>
              <option value="price-desc">Prix vente (decroissant)</option>
              <option value="price-asc">Prix vente (croissant)</option>
              <option value="name-asc">Nom (A-Z)</option>
              <option value="name-desc">Nom (Z-A)</option>
            </select>
          </div>
        )}

        {/* Compare mode toggle */}
        {compareIds.length > 0 && (
          <button
            onClick={() => {
              if (compareIds.length === 2) {
                setShowComparison(true);
              }
            }}
            disabled={compareIds.length < 2}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${compareIds.length === 2 ? 'bg-[#111111] dark:bg-white text-white dark:text-black' : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF] dark:text-[#737373]'}`}
          >
            <GitCompareArrows className="w-3.5 h-3.5" />
            Comparer ({compareIds.length}/2)
            <button
              onClick={(e) => { e.stopPropagation(); setCompareIds([]); }}
              className="ml-1 p-0.5 hover:bg-white/20 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </button>
        )}

        <div className="flex items-center gap-1 bg-[#F3F4F6] dark:bg-[#171717] rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-[#171717] shadow-sm text-[#111111] dark:text-white' : 'text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white'}`}
            title={t("recipes.gridView")}
            aria-label="Vue grille"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-[#171717] shadow-sm text-[#111111] dark:text-white' : 'text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white'}`}
            title={t("recipes.tableView")}
            aria-label="Vue tableau"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
      <FilterPanel
        filters={recipeFilterDefs}
        values={recipeFilters}
        onFilterChange={setRecipeFilters}
        presetKey="recipes"
      />
      </div>

      {/* ── Category filter pills ──────────────────────────────────────── */}
      {categoryPills.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-[#111111] dark:bg-white text-white dark:text-black' : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#E5E7EB] dark:hover:bg-[#171717]'}`}
          >
            {t("recipes.allCategories")} ({recipes.length})
          </button>
          {categoryPills.map(([cat, count]) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-[#111111] dark:bg-white text-white dark:text-black' : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#E5E7EB] dark:hover:bg-[#171717]'}`}
            >
              {cat} ({count})
            </button>
          ))}
        </div>
      )}

      {/* ── Table View ─────────────────────────────────────────────────── */}
      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedRecipeIds.size === filtered.length}
                    onChange={toggleSelectAllRecipes}
                    className="w-4 h-4 rounded accent-[#111111] dark:accent-white cursor-pointer"
                    aria-label="Tout selectionner"
                  />
                </th>
                {[
                  { key: 'name', label: t("recipes.colName") },
                  { key: 'category', label: t("recipes.colCategory") },
                  { key: 'sellingPrice', label: t("recipes.colSellingPrice") },
                  { key: 'cost', label: t("recipes.colCost") },
                  { key: 'margin', label: t("recipes.colMargin") },
                  { key: 'coefficient', label: t("recipes.colCoefficient") },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-3 text-left text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider cursor-pointer hover:text-[#111111] dark:hover:text-white select-none"
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      <SortIcon col={col.key} />
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
              {sortedFiltered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-[#9CA3AF] dark:text-[#737373]">{recipes.length === 0 ? t("recipes.noRecipes") : t("recipes.noResults")}</td></tr>
              ) : sortedFiltered.map((recipe) => (
                <tr key={recipe.id} className={`hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] transition-colors ${selectedRecipeIds.has(recipe.id) ? 'bg-[#F3F4F6] dark:bg-[#171717]' : ''}`}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRecipeIds.has(recipe.id)}
                      onChange={() => toggleSelectRecipe(recipe.id)}
                      className="w-4 h-4 rounded accent-[#111111] dark:accent-white cursor-pointer"
                      aria-label={`Selectionner ${recipe.name}`}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-[#111111] dark:text-white">
                    <span className="inline-flex items-center gap-2">
                      <FoodIllustration recipeName={recipe.name} category={recipe.category} size="sm" animated={false} />
                      {recipe.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] dark:text-[#A3A3A3]">{recipe.category}</td>
                  <td className="px-4 py-3 font-mono text-[#6B7280] dark:text-[#A3A3A3]">{recipe.sellingPrice.toFixed(2)}{getCurrencySymbol()}</td>
                  <td className="px-4 py-3 font-mono text-[#6B7280] dark:text-[#A3A3A3]">{recipe.margin.costPerPortion.toFixed(2)}{getCurrencySymbol()}</td>
                  <td className="px-4 py-3"><MarginBadge percent={recipe.margin.marginPercent} /></td>
                  <td className="px-4 py-3 font-mono text-[#6B7280] dark:text-[#A3A3A3]">
                    {recipe.margin.coefficient.toFixed(2)}
                    <span className="text-[10px] ml-1 text-[#6B7280] dark:text-[#A3A3A3]" title={`Coeff. catégorie ${recipe.category}`}>
                      (obj. ×{getCoefficient(recipe.category, coefficients).toFixed(1)})
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end">
                      <Link to={`/recipes/${recipe.id}`} className="p-1.5 rounded hover:bg-[#F3F4F6] dark:hover:bg-[#171717]" title={t("recipes.view")}>
                        <Eye className="w-4 h-4 text-[#111111] dark:text-white" />
                      </Link>
                      <button onClick={() => openEdit(recipe)} className="p-1.5 rounded hover:bg-[#F3F4F6] dark:hover:bg-[#171717]" title={t("recipes.editTooltip")} aria-label="Modifier la recette">
                        <Pencil className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
                      </button>
                      <button onClick={() => handleQuickDuplicate(recipe)} className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20" title="Dupliquer avec ingredients" aria-label="Dupliquer la recette">
                        <Copy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </button>
                      <button onClick={() => printFicheTechnique(recipe, selectedRestaurant?.name || '')} className="p-1.5 rounded hover:bg-[#F3F4F6] dark:hover:bg-[#171717]" title="Imprimer fiche technique" aria-label="Imprimer fiche technique">
                        <Printer className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
                      </button>
                      <button onClick={() => setOptimizingRecipe(recipe)} className="p-1.5 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/30" title="Optimiser les couts" aria-label="Optimiser la recette">
                        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </button>
                      <button onClick={() => setDeleteTarget(recipe.id)} className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30" title={t("recipes.deleteTooltip")} aria-label="Supprimer la recette">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
      /* ── Grid View (enhanced cards) ──────────────────────────────────── */
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {gridSortedFiltered.length === 0 ? (
          <p className="text-[#9CA3AF] dark:text-[#737373] col-span-full text-center py-8">
            {recipes.length === 0 ? t("recipes.noRecipes") : t("recipes.noResults")}
          </p>
        ) : (
          gridSortedFiltered.map((recipe) => {
            const allergens = getRecipeAllergens(recipe);
            const costPct = recipe.sellingPrice > 0 ? (recipe.margin.costPerPortion / recipe.sellingPrice) * 100 : 100;
            const isComparing = compareIds.includes(recipe.id);
            return (
            <div key={recipe.id} className={`bg-white dark:bg-[#0A0A0A] rounded-2xl shadow hover:shadow-lg sm:hover:-translate-y-1 transition-all duration-200 overflow-hidden group relative ${selectedRecipeIds.has(recipe.id) ? 'ring-2 ring-[#111111] dark:ring-white' : ''} ${isComparing ? 'ring-2 ring-blue-500' : ''}`}>
              {/* Bulk select checkbox */}
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={selectedRecipeIds.has(recipe.id)}
                  onChange={() => toggleSelectRecipe(recipe.id)}
                  className="w-4 h-4 rounded accent-[#111111] dark:accent-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity data-[checked]:opacity-100"
                  style={selectedRecipeIds.has(recipe.id) ? { opacity: 1 } : undefined}
                  aria-label={`Selectionner ${recipe.name}`}
                />
              </div>

              {/* Compare toggle button */}
              <button
                onClick={() => toggleCompare(recipe.id)}
                className={`absolute top-2 right-2 z-10 p-1.5 rounded-lg transition-all ${isComparing ? 'bg-blue-500 text-white shadow-lg' : 'bg-black/30 text-white opacity-0 group-hover:opacity-100 hover:bg-black/50'}`}
                title={isComparing ? 'Retirer de la comparaison' : 'Ajouter a la comparaison'}
              >
                <GitCompareArrows className="w-3.5 h-3.5" />
              </button>

              {/* Margin Alert Badge */}
              {(recipe.margin.marginPercent < 50 || recipe.margin.marginPercent > 80) && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
                  <MarginAlertBadge percent={recipe.margin.marginPercent} />
                </div>
              )}

              {/* Photo placeholder with name overlay */}
              <RecipePhotoPlaceholder category={recipe.category} name={recipe.name} />

              <div className="p-4">
                {/* Header: name + category badge + price/margin line */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0 mr-2">
                    <h3 className="font-bold text-lg text-[#111111] dark:text-white leading-tight">{recipe.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getCategoryBadgeColor(recipe.category)}`}>
                        <Tag className="w-2.5 h-2.5" /> {recipe.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-sm font-semibold text-[#111111] dark:text-white">{recipe.sellingPrice.toFixed(2)}{getCurrencySymbol()}</span>
                      <span className="text-[#9CA3AF] dark:text-[#737373]">/</span>
                      <MarginBadge percent={recipe.margin.marginPercent} />
                    </div>
                  </div>
                  {/* Cost Breakdown Donut */}
                  <CostDonut costPercent={costPct} marginPercent={recipe.margin.marginPercent} />
                </div>

                {/* Key stats row */}
                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-lg py-2 px-1">
                    <div className="text-[11px] text-[#9CA3AF] dark:text-[#737373]">{t("recipes.sale")}</div>
                    <div className="text-sm font-bold text-[#111111] dark:text-white">{recipe.sellingPrice.toFixed(2)}{getCurrencySymbol()}</div>
                  </div>
                  <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-lg py-2 px-1">
                    <div className="text-[11px] text-[#9CA3AF] dark:text-[#737373]">{t("recipes.cost")}</div>
                    <div className="text-sm font-bold text-[#111111] dark:text-white">{recipe.margin.costPerPortion.toFixed(2)}{getCurrencySymbol()}</div>
                  </div>
                  <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-lg py-2 px-1">
                    <div className="text-[11px] text-[#9CA3AF] dark:text-[#737373]">{t("recipes.margin")}</div>
                    <div className={`text-sm font-bold tabular-nums ${recipe.margin.marginPercent >= 70 ? 'text-emerald-600 dark:text-emerald-400' : recipe.margin.marginPercent >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                      {recipe.margin.marginPercent.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Coefficient info */}
                <div className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] font-mono mb-2">
                  Coeff. x{recipe.margin.coefficient.toFixed(2)} (obj. x{getCoefficient(recipe.category, coefficients).toFixed(1)} {recipe.category})
                </div>

                {/* Allergen icons row */}
                {allergens.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {allergens.map((a) => (
                      <AllergenIcon key={a} name={a} />
                    ))}
                  </div>
                )}

                {/* Seasonal Badges */}
                {(() => {
                  const month = new Date().getMonth();
                  const seasonalIngs = recipe.ingredients.filter(ri => isIngredientSeasonal(ri.ingredient?.name || '', month).seasonal);
                  const priceAlertIngs = recipe.ingredients.filter(ri => {
                    if (!ri.ingredient) return false;
                    const sameCat = ingredients.filter(ing => ing.category === ri.ingredient.category);
                    if (sameCat.length < 3) return false;
                    const avgPrice = sameCat.reduce((s, ing) => s + ing.pricePerUnit, 0) / sameCat.length;
                    return ri.ingredient.pricePerUnit > avgPrice * 1.15;
                  });
                  return (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {seasonalIngs.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          <Leaf className="w-3 h-3" /> {seasonalIngs.length} ingredient{seasonalIngs.length > 1 ? 's' : ''} de saison
                        </span>
                      )}
                      {priceAlertIngs.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                          <AlertTriangle className="w-3 h-3" /> {priceAlertIngs.length} alerte{priceAlertIngs.length > 1 ? 's' : ''} prix
                        </span>
                      )}
                    </div>
                  );
                })()}

                {/* Quick Price Simulator */}
                <PriceSimulator recipe={recipe} />

                {/* Description/Notes preview */}
                {recipe.description && (
                  <div className="flex items-start gap-1.5 mb-2 px-1">
                    <StickyNote className="w-3 h-3 text-[#9CA3AF] dark:text-[#737373] mt-0.5 shrink-0" />
                    <p className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] line-clamp-2 leading-relaxed italic">{recipe.description}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-1.5 pt-3 border-t border-[#E5E7EB] dark:border-[#1A1A1A] mt-2">
                  <Link to={`/recipes/${recipe.id}`} className="btn-secondary text-sm flex items-center gap-1 flex-1 justify-center">
                    <Eye className="w-4 h-4" /> {t("recipes.view")}
                  </Link>
                  <button onClick={() => openEdit(recipe)} className="p-2 rounded hover:bg-[#F3F4F6] dark:hover:bg-[#171717]" title={t("recipes.editTooltip")} aria-label="Modifier la recette">
                    <Pencil className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
                  </button>
                  <button onClick={() => handleQuickDuplicate(recipe)} className="p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20" title="Dupliquer avec ingredients" aria-label="Dupliquer la recette">
                    <Copy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </button>
                  <button onClick={() => printFicheTechnique(recipe, selectedRestaurant?.name || '')} className="p-2 rounded hover:bg-[#F3F4F6] dark:hover:bg-[#171717]" title="Imprimer fiche technique" aria-label="Imprimer fiche technique">
                    <Printer className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
                  </button>
                  <button onClick={() => setOptimizingRecipe(recipe)} className="p-2 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/30" title="Optimiser les couts" aria-label="Optimiser la recette">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </button>
                  <button onClick={() => setDeleteTarget(recipe.id)} className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/30" title={t("recipes.deleteTooltip")} aria-label="Supprimer la recette">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>
      )}

      {/* ── Bulk Actions Floating Bar (Recipes) ──────────────────────── */}
      {selectedRecipeIds.size > 0 && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 bg-[#111111] dark:bg-white text-white dark:text-black rounded-2xl shadow-2xl px-4 sm:px-6 py-3 flex flex-wrap items-center gap-2 sm:gap-4 justify-center">
          <span className="text-sm font-medium flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            {selectedRecipeIds.size} selectionne{selectedRecipeIds.size > 1 ? 's' : ''}
          </span>
          <div className="w-px h-6 bg-white/20 dark:bg-black/20" />

          {/* Batch margin fixer */}
          <button
            onClick={() => setShowBatchFixer(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            <Zap className="w-4 h-4" />
            Optimiser les prix
          </button>

          {/* Batch Cost Optimizer */}
          <button
            onClick={() => setShowBatchOptimizer(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-teal-600 hover:bg-teal-500 text-white transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Optimiser la carte
          </button>

          {/* Bulk delete */}
          <button
            onClick={bulkDeleteRecipes}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-500 text-white transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer ({selectedRecipeIds.size})
          </button>

          {/* Bulk change category */}
          <div className="relative">
            <button
              onClick={() => setBulkRecipeCategoryOpen(!bulkRecipeCategoryOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
            >
              <Tag className="w-4 h-4" />
              Changer categorie
              <ChevronDown className="w-3 h-3" />
            </button>
            {bulkRecipeCategoryOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-[#0A0A0A] rounded-lg shadow-xl border border-[#E5E7EB] dark:border-[#1A1A1A] max-h-56 overflow-y-auto">
                {RECIPE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => bulkChangeRecipeCategory(cat)}
                    className="w-full text-left px-3 py-2 text-sm text-[#111111] dark:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Close selection */}
          <button
            onClick={() => { setSelectedRecipeIds(new Set()); setBulkRecipeCategoryOpen(false); }}
            className="p-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 transition-colors ml-1"
            aria-label="Fermer la selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      </>
      )}

      {activeTab === 'templates' && (
      /* ── Templates Library Tab ──────────────────────────────────────── */
      <div>
        {/* Template search + category filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#737373]" />
            <input
              type="text"
              placeholder="Rechercher un template..."
              value={templateSearch}
              onChange={(e) => setTemplateSearch(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setTemplateCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${templateCategoryFilter === 'all' ? 'bg-[#111111] dark:bg-white text-white dark:text-black' : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#E5E7EB] dark:hover:bg-[#1A1A1A]'}`}
          >
            Toutes ({Object.values(templatesByCategory).reduce((s, arr) => s + arr.length, 0)})
          </button>
          {TEMPLATE_CATEGORY_ORDER.map((cat) => {
            const count = templatesByCategory[cat]?.length || 0;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setTemplateCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${templateCategoryFilter === cat ? 'bg-[#111111] dark:bg-white text-white dark:text-black' : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#E5E7EB] dark:hover:bg-[#1A1A1A]'}`}
              >
                {cat === 'Entrée' ? 'Entrees' : cat === 'Plat' ? 'Plats' : cat === 'Dessert' ? 'Desserts' : cat === 'Accompagnement' ? 'Accompagnements' : cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Template cards grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12 text-[#9CA3AF] dark:text-[#737373]">
            Aucun template ne correspond a votre recherche.
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((tpl, idx) => {
              const preview = getTemplatePreview(tpl);
              const catLabel = tpl.category === 'Entrée' ? 'Entree' : tpl.category;
              return (
                <div
                  key={`${tpl.name}-${idx}`}
                  className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden hover:border-[#111111] dark:hover:border-white transition-colors group"
                >
                  {/* Header */}
                  <div className="p-4 pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#111111] dark:text-white truncate">{tpl.name}</h3>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3]">
                          {catLabel}
                        </span>
                      </div>
                      <span className="text-lg font-bold font-mono text-[#111111] dark:text-white ml-2 flex-shrink-0">
                        {tpl.suggestedSellingPrice}{getCurrencySymbol()}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] line-clamp-2">{tpl.description}</p>
                  </div>

                  {/* Stats */}
                  <div className="px-4 pb-3">
                    <div className="flex items-center gap-3 text-xs text-[#9CA3AF] dark:text-[#737373]">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {tpl.nbPortions} portion{tpl.nbPortions > 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {tpl.suggestedPrepTime + tpl.suggestedCookTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        {tpl.suggestedIngredients.length} ingredients
                      </span>
                    </div>

                    {/* Cost estimation from DB ingredients */}
                    {preview.foundCount > 0 && (
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="text-[#6B7280] dark:text-[#A3A3A3]">
                          Cout estime : <strong className="font-mono">{preview.costPerPortion.toFixed(2)}{getCurrencySymbol()}</strong>
                        </span>
                        <span className={`font-medium ${preview.margin >= 70 ? 'text-green-600 dark:text-green-400' : preview.margin >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                          Marge : {preview.margin.toFixed(0)}%
                        </span>
                        {preview.foundCount < tpl.suggestedIngredients.length && (
                          <span className="text-amber-500">
                            ({preview.foundCount}/{tpl.suggestedIngredients.length} en base)
                          </span>
                        )}
                      </div>
                    )}

                    {/* Ingredients preview */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {tpl.suggestedIngredients.slice(0, 4).map((ing, i) => (
                        <span key={i} className="px-1.5 py-0.5 text-[10px] rounded bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3]">
                          {ing.name}
                        </span>
                      ))}
                      {tpl.suggestedIngredients.length > 4 && (
                        <span className="px-1.5 py-0.5 text-[10px] rounded bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF] dark:text-[#737373]">
                          +{tpl.suggestedIngredients.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="px-4 py-3 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <button
                      onClick={() => useTemplate(tpl)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-[#111111] dark:bg-white text-white dark:text-black rounded-lg hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Utiliser ce template
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}

      {/* ── Modeles (Recipe Packs) Tab ─────────────────────────────────── */}
      {activeTab === 'modeles' && (
      <div>
        {/* Import result banner */}
        {importResult && (
          <div className="mb-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Pack "{importResult.packName}" importe avec succes
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {importResult.created} recette(s) creee(s) sur {importResult.total}
                  {importResult.created < importResult.total && ' (les doublons ont ete ignores)'}
                </p>
              </div>
            </div>
            <button
              onClick={() => { setImportResult(null); setActiveTab('recipes'); }}
              className="px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
            >
              Voir mes recettes
            </button>
          </div>
        )}

        {/* Pack description */}
        <div className="mb-6">
          <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
            Importez un pack complet de recettes en un clic. Chaque pack cree automatiquement les ingredients et les recettes avec des quantites et prix realistes.
          </p>
        </div>

        {/* Pack cards grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {recipePacks.map((pack) => {
            const isImporting = importingPack === pack.id;
            const totalIngredients = new Set(pack.recipes.flatMap((r) => r.ingredients.map((i) => i.name))).size;
            const estimatedCost = pack.recipes.reduce((sum, r) => {
              const recipeCost = r.ingredients.reduce((s, ing) => {
                const effectiveQty = ing.quantity * (1 + ing.wastePercent / 100);
                if (ing.unit === 'piece') return s + ing.pricePerUnit * effectiveQty;
                return s + ing.pricePerUnit * effectiveQty;
              }, 0);
              return sum + recipeCost;
            }, 0);
            const totalRevenue = pack.recipes.reduce((sum, r) => sum + r.sellingPrice, 0);
            const avgMargin = totalRevenue > 0 ? ((totalRevenue - estimatedCost) / totalRevenue) * 100 : 0;

            return (
              <div
                key={pack.id}
                className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden hover:border-[#111111] dark:hover:border-white transition-all hover:shadow-lg group"
              >
                {/* Pack Header */}
                <div className="p-5 pb-4">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-4xl">{pack.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-[#111111] dark:text-white">{pack.name}</h3>
                      <span className="inline-block mt-0.5 px-2 py-0.5 text-xs font-medium rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300">
                        Cuisine {pack.cuisine}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3] line-clamp-2">{pack.description}</p>
                </div>

                {/* Stats row */}
                <div className="px-5 pb-3">
                  <div className="flex items-center gap-4 text-xs text-[#9CA3AF] dark:text-[#737373]">
                    <span className="flex items-center gap-1">
                      <UtensilsCrossed className="w-3 h-3" /> {pack.recipes.length} recettes
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {totalIngredients} ingredients
                    </span>
                    <span className={`flex items-center gap-1 font-medium ${avgMargin >= 70 ? 'text-green-600 dark:text-green-400' : avgMargin >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                      ~{avgMargin.toFixed(0)}% marge
                    </span>
                  </div>
                </div>

                {/* Recipe list */}
                <div className="px-5 pb-4">
                  <div className="space-y-2">
                    {pack.recipes.map((recipe, idx) => {
                      const alreadyExists = recipes.find((r) => r.name.toLowerCase() === recipe.name.toLowerCase());
                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg text-sm ${alreadyExists ? 'bg-green-50 dark:bg-green-900/10' : 'bg-[#F5F5F5] dark:bg-[#171717]'}`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[#6B7280] dark:text-[#A3A3A3] text-xs font-mono w-5 flex-shrink-0">{recipe.category === 'Entrée' ? 'E' : recipe.category === 'Plat' ? 'P' : recipe.category === 'Dessert' ? 'D' : recipe.category === 'Accompagnement' ? 'A' : 'B'}</span>
                            <span className={`truncate ${alreadyExists ? 'text-green-700 dark:text-green-400' : 'text-[#111111] dark:text-white'}`}>
                              {recipe.name}
                            </span>
                            {alreadyExists && <Check className="w-3 h-3 text-green-500 flex-shrink-0" />}
                          </div>
                          <span className="text-xs font-mono text-[#9CA3AF] dark:text-[#737373] flex-shrink-0 ml-2">
                            {recipe.sellingPrice}{getCurrencySymbol()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Import action */}
                <div className="px-5 py-4 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <button
                    onClick={() => importPack(pack)}
                    disabled={isImporting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-[#111111] dark:bg-white text-white dark:text-black rounded-xl hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Import en cours...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Importer ce pack
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Recipe Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? t("recipes.editRecipeTitle") : t("recipes.newRecipeTitle")}>
        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className={`space-y-4 transition-colors duration-500 ${saveSuccess ? 'bg-green-50 dark:bg-green-900/20 rounded-lg p-2 -m-2' : ''}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-2 relative">
              <div className="flex items-center justify-between mb-1">
                <label className="label mb-0">{t("recipes.dishName")}</label>
                {!editingId && (
                  <button
                    type="button"
                    onClick={handleAiSuggest}
                    disabled={aiSuggestionsLoading || form.name.trim().length < 2}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-black rounded-lg transition-colors"
                  >
                    {aiSuggestionsLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    Suggerer les ingredients
                  </button>
                )}
              </div>
              <input
                required
                className="input w-full"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                placeholder={t("recipes.dishNamePlaceholder")}
                autoComplete="off"
              />
              {/* Enhanced Suggestions dropdown with preview cards */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-[#171717] rounded-lg shadow-xl border border-[#E5E7EB] dark:border-[#1A1A1A] max-h-80 overflow-y-auto">
                  <div className="px-3 py-2 text-xs font-medium text-[#111111] dark:text-white border-b border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {t("recipes.recipeSuggestions")}
                  </div>
                  {suggestions.slice(0, 8).map((tpl, idx) => {
                    const preview = getTemplatePreview(tpl);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyTemplate(tpl)}
                        className="w-full text-left px-3 py-3 hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors border-b border-[#E5E7EB] dark:border-[#1A1A1A] last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-[#111111] dark:text-white">{tpl.name}</span>
                            <span className="ml-2 text-xs text-[#9CA3AF] dark:text-[#737373]">{tpl.category}</span>
                          </div>
                          <span className="text-sm font-mono text-[#9CA3AF] dark:text-[#737373]">{tpl.suggestedSellingPrice} {getCurrencySymbol()}</span>
                        </div>
                        <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5">{tpl.description}</div>
                        {/* Preview card with cost/margin estimates */}
                        <div className="flex items-center gap-3 mt-1.5 text-xs">
                          <span className="px-1.5 py-0.5 rounded bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3]">
                            {tpl.suggestedIngredients.length} {t("recipes.ingredients")}
                          </span>
                          {preview.foundCount > 0 && (
                            <>
                              <span className="text-[#9CA3AF] dark:text-[#737373]">
                                {t("recipes.estimatedCost")} : {preview.costPerPortion.toFixed(2)}{getCurrencySymbol()}
                              </span>
                              <span className={`font-medium ${preview.margin >= 70 ? 'text-green-600' : preview.margin >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                {t("recipes.estimatedMargin")} : {preview.margin.toFixed(0)}%
                              </span>
                            </>
                          )}
                          {preview.foundCount < tpl.suggestedIngredients.length && (
                            <span className="text-amber-500">
                              {preview.foundCount}/{tpl.suggestedIngredients.length} {t("recipes.inDatabase")}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setShowSuggestions(false)}
                    className="w-full text-center px-3 py-2 text-xs text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white"
                  >
                    {t("recipes.closeSuggestions")}
                  </button>
                </div>
              )}
            </div>

            {/* AI Mercuriale Suggestions Panel */}
            {showAiSuggestions && aiSuggestions.length > 0 && (
              <div className="col-span-2">
                <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-[#F3F4F6] dark:bg-[#171717] border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#111111] dark:text-white" />
                      <span className="text-sm font-semibold text-[#111111] dark:text-white">
                        Ingredients suggeres par l'IA
                      </span>
                      <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3] bg-[#F3F4F6] dark:bg-[#171717] px-2 py-0.5 rounded-full">
                        {aiSuggestionsChecked.filter(Boolean).length}/{aiSuggestions.length} selectionnes
                      </span>
                    </div>
                    <button type="button" onClick={() => setShowAiSuggestions(false)} aria-label="Fermer les suggestions IA" className="p-1 text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {/* List */}
                  <div className="max-h-64 overflow-y-auto divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
                    {aiSuggestions.map((s, idx) => (
                      <label key={idx} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={aiSuggestionsChecked[idx]}
                          onChange={() => {
                            const updated = [...aiSuggestionsChecked];
                            updated[idx] = !updated[idx];
                            setAiSuggestionsChecked(updated);
                          }}
                          className="w-4 h-4 rounded border-[#E5E7EB] dark:border-[#1A1A1A] text-[#111111] dark:text-white focus:ring-[#111111]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-[#111111] dark:text-white font-medium">{s.name}</span>
                            <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{s.quantity} {s.unit}</span>
                          </div>
                          {s.priceMin != null && s.priceMax != null ? (
                            <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">
                              {'📊'} Marche : {s.priceMin.toFixed(2)}-{s.priceMax.toFixed(2)}{getCurrencySymbol()}/{s.unit}
                              {s.supplier && ` (${s.supplier})`}
                              {s.trend === 'baisse' && <span className="text-emerald-400 ml-1">{'↘'} {s.trendDetail}</span>}
                              {s.trend === 'hausse' && <span className="text-red-400 ml-1">{'↗'} {s.trendDetail}</span>}
                              {s.trend === 'stable' && <span className="text-[#9CA3AF] dark:text-[#737373] ml-1">{'→'} {s.trendDetail}</span>}
                            </span>
                          ) : (
                            <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">Prix marche non disponible</span>
                          )}
                        </div>
                        {s.marketPrice != null && (
                          <span className="text-sm text-[#111111] dark:text-white font-semibold flex-shrink-0">
                            {s.marketPrice.toFixed(2)}{getCurrencySymbol()}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                  {/* Footer actions */}
                  <div className="flex items-center justify-between px-4 py-3 bg-[#F3F4F6] dark:bg-[#0A0A0A] border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <button
                      type="button"
                      onClick={() => {
                        const allChecked = aiSuggestionsChecked.every(Boolean);
                        setAiSuggestionsChecked(aiSuggestions.map(() => !allChecked));
                      }}
                      className="text-xs text-[#111111] dark:text-white hover:text-[#333] dark:hover:text-[#E5E5E5]"
                    >
                      {aiSuggestionsChecked.every(Boolean) ? 'Tout decocher' : 'Tout cocher'}
                    </button>
                    <button
                      type="button"
                      onClick={applyAiSuggestions}
                      disabled={!aiSuggestionsChecked.some(Boolean)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-black text-sm font-semibold rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter ({aiSuggestionsChecked.filter(Boolean).length})
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Template apply info banner */}
            {templateApplyInfo && (
              <div className="col-span-2">
                <div className={`rounded-lg p-3 text-sm flex items-start gap-2 ${templateApplyInfo.missing.length > 0 ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'}`}>
                  {templateApplyInfo.missing.length > 0 ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className={templateApplyInfo.missing.length > 0 ? 'text-amber-700 dark:text-amber-300' : 'text-green-700 dark:text-green-300'}>
                      {t("recipes.ingredientsFoundOf").replace("{found}", String(templateApplyInfo.found)).replace("{total}", String(templateApplyInfo.total))}
                    </p>
                    {templateApplyInfo.missing.length > 0 && (
                      <div className="mt-1.5 space-y-1">
                        {templateApplyInfo.missing.map((name) => (
                          <div key={name} className="flex items-center gap-2">
                            <span className="text-amber-600 dark:text-amber-400 text-xs">{name}</span>
                            <Link
                              to="/ingredients"
                              className="text-xs text-[#111111] dark:text-white hover:underline font-medium"
                              onClick={() => setShowForm(false)}
                            >
                              {t("recipes.addMissing")}
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setTemplateApplyInfo(null)}
                    className="ml-auto p-0.5 text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="label">{t("recipes.category")}</label>
              <select required className="input w-full" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {RECIPE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">{t("recipes.nbPortions")}</label>
              <input required type="number" min="1" className="input w-full" value={form.nbPortions} onChange={(e) => setForm({ ...form, nbPortions: e.target.value })} />
            </div>
            <div>
              <label className="label">{t("recipes.sellingPrice")}</label>
              <input required type="number" step="0.01" min="0" className="input w-full" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="label flex items-center gap-1.5">
                <StickyNote className="w-3.5 h-3.5" />
                Notes du chef
              </label>
              <textarea
                className="input w-full resize-none"
                rows={3}
                placeholder="Astuces, variantes, conseils de dressage..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373] mt-1">Visible sur la fiche technique imprimee</p>
            </div>
          </div>

          {/* Timing and labor */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">{t("recipes.prepTime")}</label>
              <input type="number" min="0" className="input w-full" value={form.prepTimeMinutes} onChange={(e) => setForm({ ...form, prepTimeMinutes: e.target.value })} />
            </div>
            <div>
              <label className="label">{t("recipes.cookTime")}</label>
              <input type="number" min="0" className="input w-full" value={form.cookTimeMinutes} onChange={(e) => setForm({ ...form, cookTimeMinutes: e.target.value })} />
            </div>
            <div>
              <label className="label">{t("recipes.laborCostPerHour")}</label>
              <input type="number" step="0.01" min="0" className="input w-full" value={form.laborCostPerHour} onChange={(e) => setForm({ ...form, laborCostPerHour: e.target.value })} />
            </div>
          </div>

          {/* Live cost/margin preview - always visible */}
          <div className="bg-gradient-to-r from-[#FAFAFA] to-[#F3F4F6] dark:from-[#0A0A0A] dark:to-[#0A0A0A] rounded-lg p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#111111] dark:text-white" />
              <span className="text-sm font-semibold text-[#111111] dark:text-white">{t("recipes.livePreview")}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
              <div className="flex justify-between text-[#6B7280] dark:text-[#A3A3A3]">
                <span>{t("recipes.materialCost")}</span>
                <strong className="font-mono">{liveCost.toFixed(2)} {getCurrencySymbol()}</strong>
              </div>
              <div className="flex justify-between text-[#6B7280] dark:text-[#A3A3A3]">
                <span>{t("recipes.costPerPortion")}</span>
                <strong className="font-mono">{liveCostPerPortion.toFixed(2)} {getCurrencySymbol()}</strong>
              </div>
              {liveLaborPerPortion > 0 && (
                <div className="flex justify-between text-[#6B7280] dark:text-[#A3A3A3]">
                  <span>{t("recipes.laborPerPortion")}</span>
                  <strong className="font-mono">{liveLaborPerPortion.toFixed(2)} {getCurrencySymbol()}</strong>
                </div>
              )}
              <div className="flex justify-between text-[#6B7280] dark:text-[#A3A3A3]">
                <span>{t("recipes.totalPerPortion")}</span>
                <strong className="font-mono">{liveTotalPerPortion.toFixed(2)} {getCurrencySymbol()}</strong>
              </div>
            </div>
            {/* Suggested price based on coefficient */}
            {liveTotalPerPortion > 0 && (
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">Prix suggéré</span>
                  {editingCoeff ? (
                    <span className="flex items-center gap-1">
                      <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">×</span>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="20"
                        className="input w-16 text-center text-xs py-0.5 font-mono"
                        value={tempCoeff}
                        autoFocus
                        onChange={(e) => setTempCoeff(parseFloat(e.target.value) || 1)}
                        onBlur={() => {
                          const updated = { ...coefficients, [form.category]: tempCoeff };
                          setCoefficients(updated);
                          localStorage.setItem('coefficients', JSON.stringify(updated));
                          setEditingCoeff(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const updated = { ...coefficients, [form.category]: tempCoeff };
                            setCoefficients(updated);
                            localStorage.setItem('coefficients', JSON.stringify(updated));
                            setEditingCoeff(false);
                          } else if (e.key === 'Escape') {
                            setEditingCoeff(false);
                          }
                        }}
                      />
                      <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">({form.category})</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="flex items-center gap-1 text-xs text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white transition-colors"
                      onClick={() => { setTempCoeff(liveCoeff); setEditingCoeff(true); }}
                      title="Modifier le coefficient"
                    >
                      <span className="font-mono">×{liveCoeff.toFixed(1)}</span>
                      <span>({form.category})</span>
                      <Pencil className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  className="text-sm font-bold font-mono text-[#111111] dark:text-white hover:text-[#333] dark:hover:text-[#E5E5E5] transition-colors cursor-pointer"
                  onClick={() => setForm(prev => ({ ...prev, sellingPrice: liveSuggestedPrice.toFixed(2) }))}
                  title="Appliquer comme prix de vente"
                >
                  {liveSuggestedPrice.toFixed(2)} {getCurrencySymbol()}
                </button>
              </div>
            )}
            {liveSellingPrice > 0 && (
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
                <span className="text-sm font-semibold text-[#6B7280] dark:text-[#A3A3A3]">{t("recipes.estimatedMarginLabel")}</span>
                <span className={`text-lg font-bold ${liveMargin >= 70 ? 'text-green-600' : liveMargin >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                  {liveMargin.toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          {/* Mode Pesee Bar */}
          <ModePeseeBar
            enabled={modePesee}
            onToggle={() => { setModePesee(p => !p); if (!modePesee) setUseSimulation(true); }}
            scaleStatus={scaleHook.status}
            reading={scaleHook.reading}
            connect={scaleHook.connect}
            disconnect={scaleHook.disconnect}
            useSimulation={useSimulation}
            onToggleSimulation={() => setUseSimulation(s => !s)}
          />

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">{t("recipes.ingredientsLabel")}</label>
              <div className="flex items-center gap-2">
                {formIngredients.length > 0 && (
                  <button type="button" onClick={() => { setShowBatchWeighing(true); setShowQuickWeighAdd(false); }} className="flex items-center gap-1 text-xs text-[#111111] dark:text-white hover:text-[#333] dark:hover:text-[#E5E5E5] font-medium px-2 py-1 rounded-lg bg-[#F3F4F6] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <Scale className="w-3 h-3" /> Peser tous
                  </button>
                )}
                <button type="button" onClick={() => { setShowQuickWeighAdd(true); setShowBatchWeighing(false); }} className="flex items-center gap-1 text-xs text-[#111111] dark:text-white hover:text-[#333] dark:hover:text-[#E5E5E5] font-medium px-2 py-1 rounded-lg bg-[#F3F4F6] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <Scale className="w-3 h-3" /> <Plus className="w-3 h-3" /> Peser et ajouter
                </button>
                <button type="button" onClick={addIngredientLine} className="text-sm text-[#111111] dark:text-white hover:text-[#333] dark:hover:text-[#E5E5E5] font-medium">
                  {t("recipes.addIngredient")}
                </button>
              </div>
            </div>

            {/* Quick Weigh Add Panel */}
            {showQuickWeighAdd && (
              <div className="mb-3">
                <QuickWeighAdd
                  ingredients={ingredients}
                  onAddIngredient={handleQuickWeighAdd}
                  onClose={() => setShowQuickWeighAdd(false)}
                  scaleStatus={scaleHook.status}
                  reading={scaleHook.reading}
                  scaleError={scaleHook.error}
                  connect={scaleHook.connect}
                  disconnect={scaleHook.disconnect}
                  useSimulation={useSimulation}
                  simWeight={simWeight}
                  setSimWeight={setSimWeight}
                />
              </div>
            )}

            {/* Batch Weighing Panel */}
            {showBatchWeighing && formIngredients.length > 0 && (
              <div className="mb-3">
                <BatchWeighingPanel
                  ingredientItems={formIngredients.map((fi, idx) => {
                    const ing = fi.ingredientId ? ingredients.find(i => i.id === fi.ingredientId) : null;
                    return { index: idx, name: ing?.name || fi.newName || `Ingredient ${idx + 1}`, unit: fi.unit || ing?.unit || fi.newUnit || 'kg', targetQty: parseFloat(fi.quantity) || undefined, done: weighedLines.has(idx) };
                  })}
                  onWeighComplete={handleBatchWeighComplete}
                  onClose={() => setShowBatchWeighing(false)}
                  scaleStatus={scaleHook.status}
                  reading={scaleHook.reading}
                  scaleError={scaleHook.error}
                  connect={scaleHook.connect}
                  disconnect={scaleHook.disconnect}
                  useSimulation={useSimulation}
                  simWeight={simWeight}
                  setSimWeight={setSimWeight}
                />
              </div>
            )}

            {formIngredients.length === 0 ? (
              <p className="text-sm text-[#9CA3AF] dark:text-[#737373] py-2">{t("recipes.noIngredients")}</p>
            ) : (
              <div className="space-y-3">
                {formIngredients.map((fi, idx) => {
                  const ing = fi.ingredientId ? ingredients.find((i) => i.id === fi.ingredientId) : null;
                  const isNewIngredient = !fi.ingredientId;
                  const unitPrice = isNewIngredient ? (parseFloat(fi.newPrice) || 0) : (ing?.pricePerUnit || 0);
                  const unitLabel = isNewIngredient ? fi.newUnit : (ing?.unit || '');
                  const inputUnit = fi.unit || unitLabel || 'kg';
                  const priceUnit = unitLabel || 'kg';
                  const qty = parseFloat(fi.quantity) || 0;
                  const waste = parseFloat(fi.wastePercent) || 0;
                  const effectiveQty = qty * (1 + waste / 100);
                  const convertedQty = convertToBaseUnit(effectiveQty, inputUnit, priceUnit);
                  const lineTotal = unitPrice * convertedQty;
                  return (
                    <div key={idx} className="border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg p-3 space-y-2">
                      {/* Row 1: Ingredient name combobox */}
                      <div className="flex items-center gap-2">
                        <IngredientCombobox
                          ingredients={ingredientSearch ? filteredIngredients : ingredients}
                          selectedId={fi.ingredientId}
                          newName={fi.newName}
                          onSelect={(id) => {
                            const updated = [...formIngredients];
                            updated[idx] = { ...updated[idx], ingredientId: id, newName: '', newUnit: '', newPrice: '', newCategory: '' };
                            setFormIngredients(updated);
                          }}
                          onNewName={(name) => {
                            const updated = [...formIngredients];
                            updated[idx] = { ...updated[idx], ingredientId: null, newName: name };
                            setFormIngredients(updated);
                          }}
                        />
                        <button type="button" onClick={() => removeIngredientLine(idx)} aria-label="Retirer l'ingrédient" className="p-1 text-red-400 hover:text-red-600 flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Row 2: New ingredient details (only shown when typing a new name) */}
                      {isNewIngredient && fi.newName.trim() && (
                        <div className="grid grid-cols-3 gap-2 pl-1">
                          <div>
                            <label className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase">Prix unitaire</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              className="input w-full text-sm"
                              value={fi.newPrice}
                              onChange={(e) => {
                                const updated = [...formIngredients];
                                updated[idx].newPrice = e.target.value;
                                setFormIngredients(updated);
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase">Unite</label>
                            <select
                              className="input w-full text-sm"
                              value={fi.newUnit}
                              onChange={(e) => {
                                const updated = [...formIngredients];
                                updated[idx].newUnit = e.target.value;
                                setFormIngredients(updated);
                              }}
                            >
                              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase">Categorie</label>
                            <select
                              className="input w-full text-sm"
                              value={fi.newCategory}
                              onChange={(e) => {
                                const updated = [...formIngredients];
                                updated[idx].newCategory = e.target.value;
                                setFormIngredients(updated);
                              }}
                            >
                              {INGREDIENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Row 3: Quantity, waste %, line total + Peser button */}
                      <div className="flex items-center gap-2">
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            step="0.001"
                            min="0"
                            placeholder={t("recipes.qtyPlaceholder")}
                            className={`input w-24 ${weighedLines.has(idx) ? 'border-green-400 dark:border-green-600' : ''}`}
                            value={fi.quantity}
                            onChange={(e) => {
                              const updated = [...formIngredients];
                              updated[idx].quantity = e.target.value;
                              setFormIngredients(updated);
                            }}
                          />
                          {weighedLines.has(idx) && (
                            <Check className="absolute right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-green-500" />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => { setWeighingLineIdx(weighingLineIdx === idx ? null : idx); setSimWeight(0); }}
                          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex-shrink-0 ${
                            weighingLineIdx === idx
                              ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                              : weighedLines.has(idx)
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                              : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#E5E7EB] dark:hover:bg-[#262626]'
                          }`}
                          title="Peser cet ingredient"
                        >
                          <Scale className="w-3 h-3" />
                          {weighedLines.has(idx) ? <Check className="w-3 h-3" /> : 'Peser'}
                        </button>
                        <span className="text-xs text-[#9CA3AF] dark:text-[#737373] w-10">{unitLabel}</span>
                        <input
                          type="number"
                          step="1"
                          min="0"
                          max="100"
                          placeholder={t("recipes.wastePlaceholder")}
                          className="input w-20"
                          value={fi.wastePercent}
                          onChange={(e) => {
                            const updated = [...formIngredients];
                            updated[idx].wastePercent = e.target.value;
                            setFormIngredients(updated);
                          }}
                          title={t("recipes.wasteTooltip")}
                        />
                        <span className="text-xs text-[#9CA3AF] dark:text-[#737373] w-4">%</span>
                        <span className="text-xs text-[#9CA3AF] dark:text-[#737373] ml-auto">
                          {unitPrice > 0 && <>{unitPrice.toFixed(2)}{getCurrencySymbol()}/{unitLabel}</>}
                        </span>
                        <span className={`text-sm font-mono w-20 text-right font-bold ${lineTotal > 0 ? 'text-[#111111] dark:text-white' : 'text-[#9CA3AF] dark:text-[#737373]'}`}>{lineTotal.toFixed(2)} {getCurrencySymbol()}</span>
                      </div>

                      {/* Inline Weighing Panel */}
                      {weighingLineIdx === idx && (
                        <InlineWeighPanel
                          ingredientName={ing?.name || fi.newName || `Ingredient ${idx + 1}`}
                          ingredientUnit={unitLabel || 'kg'}
                          onWeighComplete={(qty) => handleWeighComplete(idx, qty)}
                          onClose={() => setWeighingLineIdx(null)}
                          scaleStatus={scaleHook.status}
                          reading={scaleHook.reading}
                          scaleError={scaleHook.error}
                          connect={scaleHook.connect}
                          disconnect={scaleHook.disconnect}
                          useSimulation={useSimulation}
                          simWeight={simWeight}
                          setSimWeight={setSimWeight}
                        />
                      )}
                    </div>
                  );
                })}

                {/* Running total of food cost */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <span className="text-sm text-[#9CA3AF] dark:text-[#737373]">{t("recipes.materialTotal")}</span>
                  <span className="text-sm font-bold font-mono text-[#111111] dark:text-white">{liveCost.toFixed(2)} {getCurrencySymbol()}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{t("recipes.ctrlEnterSave")}</span>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">{t("recipes.cancel")}</button>
              <button
                type="submit"
                className={`btn-primary flex items-center gap-2 min-w-[140px] justify-center transition-all ${saveSuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
                disabled={saving}
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {t("recipes.saving")}</>
                ) : saveSuccess ? (
                  <><Check className="w-4 h-4" /> {t("recipes.saved")}</>
                ) : (
                  editingId ? t("recipes.edit") : t("recipes.createRecipe")
                )}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* ── Batch Margin Fixer Modal ──────────────────────────────────── */}
      {showBatchFixer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowBatchFixer(false)}>
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg font-bold text-[#111111] dark:text-white">Optimiser les prix</h3>
              </div>
              <button onClick={() => setShowBatchFixer(false)} className="p-1 text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Target margin slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-[#111111] dark:text-white">Marge cible</label>
                  <span className="text-lg font-bold text-emerald-500">{batchTargetMargin}%</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={90}
                  step={5}
                  value={batchTargetMargin}
                  onChange={(e) => setBatchTargetMargin(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#E5E7EB] dark:bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-[#9CA3AF] dark:text-[#737373] mt-1">
                  <span>30%</span>
                  <span>60%</span>
                  <span>90%</span>
                </div>
              </div>

              {/* Results table */}
              <div className="space-y-2">
                {batchFixerResults.map((r) => {
                  const priceDiff = r.suggestedPrice - r.currentPrice;
                  const needsChange = Math.abs(priceDiff) > 0.01;
                  return (
                    <div key={r.id} className={`rounded-xl p-3 border ${needsChange ? 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10' : 'border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#FAFAFA] dark:bg-[#0A0A0A]'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-[#111111] dark:text-white truncate">{r.name}</span>
                        <span className={`text-xs font-bold ${r.currentMargin >= batchTargetMargin ? 'text-emerald-500' : 'text-red-500'}`}>
                          {r.currentMargin.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#6B7280] dark:text-[#A3A3A3]">
                        <span>Cout: {r.cost.toFixed(2)}{getCurrencySymbol()}</span>
                        <span className="text-[#9CA3AF] dark:text-[#737373]">|</span>
                        <span>Actuel: {r.currentPrice.toFixed(2)}{getCurrencySymbol()}</span>
                        {needsChange && (
                          <>
                            <span className="text-[#111111] dark:text-white font-bold">
                              &rarr; {r.suggestedPrice.toFixed(2)}{getCurrencySymbol()}
                            </span>
                            <span className={`font-mono text-[10px] ${priceDiff > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                              ({priceDiff > 0 ? '+' : ''}{priceDiff.toFixed(2)})
                            </span>
                          </>
                        )}
                        {!needsChange && (
                          <span className="text-emerald-500 font-medium flex items-center gap-1">
                            <Check className="w-3 h-3" /> OK
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Apply button */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
                <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                  {batchFixerResults.filter(r => Math.abs(r.suggestedPrice - r.currentPrice) > 0.01).length} recette(s) a ajuster
                </span>
                <button
                  onClick={async () => {
                    const toUpdate = batchFixerResults.filter(r => Math.abs(r.suggestedPrice - r.currentPrice) > 0.01);
                    try {
                      for (const r of toUpdate) {
                        const recipe = recipes.find(rec => rec.id === r.id);
                        if (recipe) {
                          await updateRecipe(r.id, {
                            name: recipe.name,
                            category: recipe.category,
                            sellingPrice: r.suggestedPrice,
                            nbPortions: recipe.nbPortions,
                            description: recipe.description || undefined,
                            prepTimeMinutes: recipe.prepTimeMinutes ?? undefined,
                            cookTimeMinutes: recipe.cookTimeMinutes ?? undefined,
                            laborCostPerHour: recipe.laborCostPerHour ?? undefined,
                            ingredients: recipe.ingredients.map(ri => ({
                              ingredientId: ri.ingredientId,
                              quantity: ri.quantity,
                              wastePercent: ri.wastePercent,
                            })),
                          });
                        }
                      }
                      showToast(`${toUpdate.length} prix mis a jour`, 'success');
                      setShowBatchFixer(false);
                      setSelectedRecipeIds(new Set());
                      loadData();
                    } catch {
                      showToast('Erreur lors de la mise a jour des prix', 'error');
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  Appliquer les prix
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Recipe Comparison Panel ────────────────────────────────────── */}
      {showComparison && compareIds.length === 2 && (() => {
        const recA = recipes.find(r => r.id === compareIds[0]);
        const recB = recipes.find(r => r.id === compareIds[1]);
        if (!recA || !recB) return null;
        return (
          <RecipeComparisonPanel
            recipes={[recA, recB]}
            onClose={() => { setShowComparison(false); setCompareIds([]); }}
          />
        );
      })()}

      {/* ── Single Recipe Cost Optimizer ──────────────────────────────── */}
      {optimizingRecipe && (
        <CostOptimizerPanel
          recipe={optimizingRecipe}
          allIngredients={ingredients}
          onClose={() => setOptimizingRecipe(null)}
        />
      )}

      {/* ── Batch Cost Optimizer ────────────────────────────────────────── */}
      {showBatchOptimizer && (() => {
        const selectedRecipes = recipes.filter(r => selectedRecipeIds.has(r.id));
        if (selectedRecipes.length === 0) return null;
        return (
          <BatchOptimizerPanel
            recipes={selectedRecipes}
            allIngredients={ingredients}
            onClose={() => setShowBatchOptimizer(false)}
          />
        );
      })()}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        title={t("recipes.deleteTitle")}
        message={t("recipes.deleteMessage")}
      />
    </div>
  );
}
