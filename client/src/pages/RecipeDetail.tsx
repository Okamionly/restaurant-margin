import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Clock, AlertTriangle, ChefHat, SlidersHorizontal, Users, Edit } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { fetchRecipe } from '../services/api';
import type { Recipe } from '../types';

// ─── Category emoji map ───
const CATEGORY_EMOJI: Record<string, string> = {
  'Viandes': '\u{1F969}',
  'Poissons & Fruits de mer': '\u{1F41F}',
  'Légumes': '\u{1F96C}',
  'Fruits': '\u{1F34E}',
  'Produits laitiers': '\u{1F9C0}',
  'Épices & Condiments': '\u{1F336}️',
  'Féculents & Céréales': '\u{1F33E}',
  'Féculents': '\u{1F33E}',
  'Huiles & Matières grasses': '\u{1FAD2}',
  'Boissons': '\u{1F377}',
  'Boulangerie': '\u{1F35E}',
  'Surgelés': '❄️',
  'Autres': '\u{1F4E6}',
};

// ─── Allergen badge styles ───
const ALLERGEN_COLORS: Record<string, string> = {
  Gluten: 'bg-yellow-300 text-yellow-900 border border-yellow-400',
  'Crustacés': 'bg-orange-300 text-orange-900 border border-orange-400',
  Oeufs: 'bg-amber-200 text-amber-900 border border-amber-300',
  Poissons: 'bg-teal-300 text-teal-900 border border-teal-400',
  Arachides: 'bg-red-400 text-white border border-red-500',
  Soja: 'bg-green-300 text-green-900 border border-green-400',
  Lait: 'bg-white text-slate-800 border-2 border-slate-300',
  'Fruits à coque': 'bg-amber-700 text-white border border-amber-800',
  'Céleri': 'bg-lime-300 text-lime-900 border border-lime-400',
  Moutarde: 'bg-yellow-500 text-yellow-950 border border-yellow-600',
  'Sésame': 'bg-stone-300 text-stone-800 border border-stone-400',
  Sulfites: 'bg-purple-300 text-purple-900 border border-purple-400',
  Lupin: 'bg-pink-300 text-pink-900 border border-pink-400',
  Mollusques: 'bg-cyan-300 text-cyan-900 border border-cyan-400',
};

const DONUT_COLORS = ['#ef4444', '#f59e0b', '#22c55e'];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatDateShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category] || '\u{1F4E6}';
}

function getRestaurantName(): string {
  try {
    const settings = localStorage.getItem('restaurant-settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      return parsed.name || parsed.restaurantName || 'Restaurant';
    }
  } catch { /* ignore */ }
  return 'Restaurant';
}

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [simPrice, setSimPrice] = useState<number | null>(null);
  const [portions, setPortions] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchRecipe(parseInt(id))
        .then((r) => {
          setRecipe(r);
          setSimPrice(r.sellingPrice);
          setPortions(r.nbPortions);
        })
        .catch(() => console.error('Erreur'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const simData = useMemo(() => {
    if (!recipe || simPrice === null) return null;
    const totalCost = recipe.margin.totalCostPerPortion;
    const margin = simPrice - totalCost;
    const marginPct = simPrice > 0 ? (margin / simPrice) * 100 : 0;
    const coeff = totalCost > 0 ? simPrice / totalCost : 0;
    return { margin, marginPct, coeff };
  }, [recipe, simPrice]);

  const portionMultiplier = useMemo(() => {
    if (!recipe || portions === null) return 1;
    return portions / recipe.nbPortions;
  }, [recipe, portions]);

  if (loading) return <div className="text-center py-12 text-slate-400 dark:text-slate-400">Chargement...</div>;
  if (!recipe) return <div className="text-center py-12 text-red-500">Recette non trouvée</div>;

  const m = recipe.margin;
  const marginColor = m.marginPercent >= 70 ? 'text-green-600' : m.marginPercent >= 60 ? 'text-amber-600' : 'text-red-600';

  const allAllergens = Array.from(
    new Set(recipe.ingredients.flatMap((ri) => ri.ingredient.allergens || []))
  ).sort();

  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

  const donutData = [
    { name: 'Matière', value: Math.round(m.costPerPortion * 100) / 100 },
    ...(m.laborCostPerPortion > 0 ? [{ name: 'Main-d\'oeuvre', value: Math.round(m.laborCostPerPortion * 100) / 100 }] : []),
    { name: 'Marge', value: Math.round(m.marginAmount * 100) / 100 },
  ];

  const foodCostPct = recipe.sellingPrice > 0 ? (m.costPerPortion / recipe.sellingPrice) * 100 : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-0">
      {/* ─── Screen toolbar (hidden on print) ─── */}
      <div className="flex items-center justify-between mb-4 no-print">
        <Link
          to="/recipes"
          className="flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux recettes
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to={`/recipes/${recipe.id}/edit`}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Edit className="w-4 h-4" /> Modifier
          </Link>
          <button
            onClick={() => window.print()}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Printer className="w-4 h-4" /> {"Imprimer / PDF"}
          </button>
        </div>
      </div>

      {/* ─── Interactive tools (hidden on print) ─── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md mb-4 overflow-hidden no-print">
        {/* Portions calculator */}
        <div className="px-5 py-3 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-3 flex-wrap">
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <span className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">Calculer pour</span>
            <input
              type="number"
              min={1}
              max={500}
              value={portions ?? ''}
              onChange={(e) => setPortions(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 px-2 py-1 text-sm border border-indigo-300 dark:border-indigo-600 rounded-lg text-center bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            <span className="text-sm text-indigo-700 dark:text-indigo-300">
              portions {portionMultiplier !== 1 && <span className="text-xs text-indigo-500">(x{portionMultiplier.toFixed(2)})</span>}
            </span>
            {portionMultiplier !== 1 && (
              <button
                onClick={() => setPortions(recipe.nbPortions)}
                className="text-xs text-indigo-600 dark:text-indigo-400 underline hover:no-underline ml-auto"
              >
                Réinitialiser ({recipe.nbPortions})
              </button>
            )}
          </div>
        </div>
        {/* Price Simulator */}
        <div className="px-5 py-3">
          <div className="flex items-center gap-3 mb-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 dark:text-slate-400" />
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-300">Simulateur de prix</span>
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 ml-auto">{(simPrice ?? 0).toFixed(2)} &euro;</span>
          </div>
          <input
            type="range"
            min={Math.max(0, m.totalCostPerPortion).toFixed(2)}
            max={(recipe.sellingPrice * 2.5).toFixed(2)}
            step="0.10"
            value={simPrice ?? recipe.sellingPrice}
            onChange={(e) => setSimPrice(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Coût : {m.totalCostPerPortion.toFixed(2)} &euro;</span>
            <span>Actuel : {recipe.sellingPrice.toFixed(2)} &euro;</span>
            <span>Max : {(recipe.sellingPrice * 2.5).toFixed(2)} &euro;</span>
          </div>
          {simData && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <SimCard label="Marge" value={`${simData.margin.toFixed(2)} €`} highlight={simData.margin >= m.marginAmount} />
              <SimCard label="Marge %" value={`${simData.marginPct.toFixed(1)}%`} highlight={simData.marginPct >= 70} warn={simData.marginPct < 60} />
              <SimCard label="Coefficient" value={simData.coeff.toFixed(2)} highlight={simData.coeff >= m.coefficient} />
            </div>
          )}
          {simPrice !== recipe.sellingPrice && (
            <button onClick={() => setSimPrice(recipe.sellingPrice)} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline mt-2">
              Réinitialiser au prix actuel
            </button>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
           FICHE TECHNIQUE - A4 PRINTABLE SHEET
         ═══════════════════════════════════════════════════════ */}
      <div id="fiche-technique" className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden print:shadow-none print:rounded-none fiche-container">

        {/* ─── HEADER ─── */}
        <div className="fiche-header bg-slate-800 text-white px-5 py-3 print:bg-slate-800 print:text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChefHat className="w-6 h-6 opacity-80" />
              <div>
                <div className="text-sm font-bold uppercase tracking-widest">{getRestaurantName()}</div>
                <div className="text-[10px] text-slate-300 uppercase tracking-wider">Fiche Technique</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-300">N&deg;<span className="text-white font-bold text-sm">{String(recipe.id).padStart(3, '0')}</span></div>
              <div className="text-[10px] text-slate-400">{formatDateShort(recipe.updatedAt)}</div>
            </div>
          </div>
        </div>

        {/* ─── TITLE BAR ─── */}
        <div className="px-5 py-2.5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{recipe.name}</h1>
              <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400 dark:text-slate-400">
                <span className="font-medium text-slate-400 dark:text-slate-300 bg-slate-200 dark:bg-slate-600 px-2 py-0.5 rounded">{recipe.category}</span>
                <span>{portions ?? recipe.nbPortions} portion{(portions ?? recipe.nbPortions) > 1 ? 's' : ''}</span>
                {totalTime > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {totalTime} min
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-slate-900 dark:text-white">{recipe.sellingPrice.toFixed(2)}<span className="text-sm font-medium ml-0.5">&euro;</span></div>
              <div className="text-[10px] text-slate-400 uppercase">Prix de vente</div>
            </div>
          </div>
          {recipe.description && (
            <p className="text-xs text-slate-400 dark:text-slate-400 mt-1.5 italic leading-snug">{recipe.description}</p>
          )}
        </div>

        {/* ─── BODY: 2-column layout ─── */}
        <div className="flex fiche-body">
          {/* ──── LEFT COLUMN (60%) ──── */}
          <div className="fiche-left flex-[3] border-r border-slate-200 dark:border-slate-700 p-4">
            <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-2">Composition</h2>

            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-400">
                  <th className="text-left pb-1.5 font-semibold pl-1">Ingrédient</th>
                  <th className="text-center pb-1.5 font-semibold w-16">Qté</th>
                  <th className="text-center pb-1.5 font-semibold w-12">Unité</th>
                  <th className="text-center pb-1.5 font-semibold w-12">Perte</th>
                  <th className="text-right pb-1.5 font-semibold w-14">P.U.</th>
                  <th className="text-right pb-1.5 font-semibold pr-1 w-16">Total</th>
                </tr>
              </thead>
              <tbody>
                {recipe.ingredients.map((ri, idx) => {
                  const waste = ri.wastePercent || 0;
                  const baseQty = ri.quantity * portionMultiplier;
                  const effectiveQty = baseQty * (1 + waste / 100);
                  const lineTotal = effectiveQty * ri.ingredient.pricePerUnit;
                  const emoji = getCategoryEmoji(ri.ingredient.category);
                  const rowBg = idx % 2 === 0 ? '' : 'bg-slate-50 dark:bg-slate-800/50';
                  return (
                    <tr key={ri.id} className={`${rowBg} border-b border-slate-100 dark:border-slate-700/50 print:even:bg-slate-50`}>
                      <td className="py-1 pl-1 text-slate-800 dark:text-slate-200 font-medium whitespace-nowrap">
                        <span className="mr-1" title={ri.ingredient.category}>{emoji}</span>
                        {ri.ingredient.name}
                        {(ri.ingredient.allergens || []).length > 0 && (
                          <span className="ml-1 text-amber-500 text-[9px] font-bold align-super" title={ri.ingredient.allergens.join(', ')}>*</span>
                        )}
                      </td>
                      <td className="py-1 text-center font-mono text-slate-400 dark:text-slate-300">
                        {portionMultiplier !== 1 ? baseQty.toFixed(2) : ri.quantity}
                      </td>
                      <td className="py-1 text-center text-slate-400 dark:text-slate-400">{ri.ingredient.unit}</td>
                      <td className="py-1 text-center font-mono text-slate-400">{waste > 0 ? `${waste}%` : '—'}</td>
                      <td className="py-1 text-right font-mono text-slate-500 dark:text-slate-400">{ri.ingredient.pricePerUnit.toFixed(2)}</td>
                      <td className="py-1 text-right font-mono font-bold text-slate-800 dark:text-slate-200 pr-1">{lineTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-400 dark:border-slate-500 font-bold text-slate-900 dark:text-white">
                  <td colSpan={5} className="py-2 pl-1 text-xs uppercase tracking-wide">Coût matière total</td>
                  <td className="py-2 text-right font-mono pr-1 text-sm">{(m.foodCost * portionMultiplier).toFixed(2)} &euro;</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* ──── RIGHT COLUMN (40%) ──── */}
          <div className="fiche-right flex-[2] p-4 space-y-3 bg-slate-50/50 dark:bg-slate-800/30">

            {/* Key metrics box */}
            <div>
              <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-2">Indicateurs clés</h2>
              <div className="border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden text-[11px]">
                <MetricRow label="Prix de vente" value={`${recipe.sellingPrice.toFixed(2)} €`} />
                <MetricRow label="Coût matière / portion" value={`${m.costPerPortion.toFixed(2)} €`} sub={`(${foodCostPct.toFixed(1)}%)`} />
                {m.laborCostPerPortion > 0 && (
                  <MetricRow label="Coût M.O. / portion" value={`${m.laborCostPerPortion.toFixed(2)} €`} />
                )}
                <MetricRow label="Coût total / portion" value={`${m.totalCostPerPortion.toFixed(2)} €`} bold />
                <MetricRow label="Marge brute" value={`${m.marginAmount.toFixed(2)} €`} valueClass={marginColor} />
                <MetricRow label="Marge %" value={`${m.marginPercent.toFixed(1)}%`} valueClass={marginColor} bold />
                <MetricRow label="Coefficient" value={m.coefficient.toFixed(2)} last />
              </div>
            </div>

            {/* Donut chart */}
            <div>
              <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1">Répartition du prix</h2>
              <div className="flex items-center gap-2">
                <div className="w-24 h-24 flex-shrink-0 no-print">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={42}
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {donutData.map((_entry, index) => (
                          <Cell key={index} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: unknown) => `${Number(value).toFixed(2)} €`}
                        contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: '11px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Print fallback for donut */}
                <div className="hidden print:block w-20 flex-shrink-0">
                  <svg viewBox="0 0 80 80" className="w-full h-auto">
                    {(() => {
                      const total = donutData.reduce((s, d) => s + d.value, 0);
                      let cumAngle = -90;
                      return donutData.map((d, i) => {
                        const angle = total > 0 ? (d.value / total) * 360 : 0;
                        const startAngle = cumAngle;
                        cumAngle += angle;
                        const endAngle = cumAngle;
                        const startRad = (startAngle * Math.PI) / 180;
                        const endRad = (endAngle * Math.PI) / 180;
                        const cx = 40, cy = 40, r1 = 20, r2 = 36;
                        const largeArc = angle > 180 ? 1 : 0;
                        const path = [
                          `M ${cx + r1 * Math.cos(startRad)} ${cy + r1 * Math.sin(startRad)}`,
                          `L ${cx + r2 * Math.cos(startRad)} ${cy + r2 * Math.sin(startRad)}`,
                          `A ${r2} ${r2} 0 ${largeArc} 1 ${cx + r2 * Math.cos(endRad)} ${cy + r2 * Math.sin(endRad)}`,
                          `L ${cx + r1 * Math.cos(endRad)} ${cy + r1 * Math.sin(endRad)}`,
                          `A ${r1} ${r1} 0 ${largeArc} 0 ${cx + r1 * Math.cos(startRad)} ${cy + r1 * Math.sin(startRad)}`,
                          'Z',
                        ].join(' ');
                        return <path key={i} d={path} fill={DONUT_COLORS[i]} />;
                      });
                    })()}
                  </svg>
                </div>
                <div className="flex-1 space-y-1 text-[10px]">
                  {donutData.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm inline-block flex-shrink-0" style={{ backgroundColor: DONUT_COLORS[i] }} />
                      <span className="text-slate-500 dark:text-slate-400 flex-1">{d.name}</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{d.value.toFixed(2)} &euro;</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Allergens */}
            {allAllergens.length > 0 && (
              <div>
                <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  Allergènes
                </h2>
                <div className="flex flex-wrap gap-1">
                  {allAllergens.map((a) => (
                    <span
                      key={a}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold leading-tight ${ALLERGEN_COLORS[a] || 'bg-amber-200 text-amber-800 border border-amber-300'}`}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Timing */}
            {totalTime > 0 && (
              <div>
                <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1.5">Temps de production</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-center text-[10px]">
                  {recipe.prepTimeMinutes > 0 && (
                    <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-2 py-1.5">
                      <div className="text-slate-400 uppercase text-[8px] font-semibold">Prép.</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{recipe.prepTimeMinutes}<span className="text-[9px] font-normal ml-0.5">min</span></div>
                    </div>
                  )}
                  {recipe.cookTimeMinutes > 0 && (
                    <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-2 py-1.5">
                      <div className="text-slate-400 uppercase text-[8px] font-semibold">Cuisson</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{recipe.cookTimeMinutes}<span className="text-[9px] font-normal ml-0.5">min</span></div>
                    </div>
                  )}
                  <div className="bg-slate-800 dark:bg-slate-600 text-white rounded px-2 py-1.5">
                    <div className="text-slate-300 uppercase text-[8px] font-semibold">Total</div>
                    <div className="font-bold text-sm">{totalTime}<span className="text-[9px] font-normal ml-0.5">min</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── FOOTER ─── */}
        <div className="fiche-footer px-5 py-1.5 border-t border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 flex items-center justify-between text-[9px] text-slate-400">
          <span>Mise à jour le {formatDate(recipe.updatedAt)}</span>
          <span>{getRestaurantName()} &mdash; Fiche Technique N&deg;{String(recipe.id).padStart(3, '0')}</span>
          <span>Page 1/1</span>
        </div>
      </div>

      {/* ─── Print-specific stylesheet ─── */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }

          /* Hide everything except fiche technique */
          body * {
            visibility: hidden;
          }
          #fiche-technique,
          #fiche-technique * {
            visibility: visible;
          }
          #fiche-technique {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          .no-print {
            display: none !important;
          }

          /* Compact print typography */
          #fiche-technique {
            font-size: 9pt;
            border: 1px solid #cbd5e1;
            border-radius: 0;
            box-shadow: none;
            background: white !important;
            color: black !important;
          }

          #fiche-technique .fiche-header {
            background-color: #1e293b !important;
            color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          #fiche-technique .fiche-body {
            display: flex !important;
          }

          #fiche-technique .fiche-left {
            flex: 3 !important;
          }

          #fiche-technique .fiche-right {
            flex: 2 !important;
            background-color: #f8fafc !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          #fiche-technique table {
            border-collapse: collapse;
            font-size: 8.5pt;
          }

          #fiche-technique th,
          #fiche-technique td {
            border: none;
            padding: 2px 4px;
          }

          #fiche-technique thead tr {
            border-bottom: 2px solid #94a3b8 !important;
          }

          #fiche-technique tbody tr {
            border-bottom: 1px solid #e2e8f0;
          }

          #fiche-technique tfoot tr {
            border-top: 2px solid #64748b !important;
          }

          /* Force colored backgrounds on allergen badges */
          #fiche-technique span[class*="bg-"] {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Force background colors for timing boxes */
          #fiche-technique .bg-slate-800 {
            background-color: #1e293b !important;
            color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          #fiche-technique .bg-slate-50\\/50,
          #fiche-technique .bg-slate-50 {
            background-color: #f8fafc !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          #fiche-technique .bg-slate-100 {
            background-color: #f1f5f9 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Metric rows */
          #fiche-technique .metric-row:nth-child(even) {
            background-color: #f8fafc !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Category badge */
          #fiche-technique .bg-slate-200 {
            background-color: #e2e8f0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Ensure the whole fiche fits on one page */
          #fiche-technique {
            page-break-inside: avoid;
            max-height: 277mm; /* A4 height minus margins */
            overflow: hidden;
          }

          /* Footer */
          #fiche-technique .fiche-footer {
            background-color: #f1f5f9 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Dark mode overrides for print */
          .dark #fiche-technique,
          .dark #fiche-technique * {
            color: black !important;
          }
          .dark #fiche-technique .fiche-header,
          .dark #fiche-technique .fiche-header * {
            color: white !important;
          }
          .dark #fiche-technique .bg-slate-800.text-white,
          .dark #fiche-technique .bg-slate-800.text-white * {
            color: white !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ─── Sub-components ─── */

function MetricRow({
  label,
  value,
  sub,
  valueClass,
  bold,
  last,
}: {
  label: string;
  value: string;
  sub?: string;
  valueClass?: string;
  bold?: boolean;
  last?: boolean;
}) {
  return (
    <div className={`metric-row flex items-center justify-between px-3 py-1.5 ${!last ? 'border-b border-slate-200 dark:border-slate-700' : ''} ${bold ? 'bg-slate-50 dark:bg-slate-700/50' : ''}`}>
      <span className={`text-slate-500 dark:text-slate-400 ${bold ? 'font-semibold text-slate-600 dark:text-slate-300' : ''}`}>{label}</span>
      <div className="text-right">
        <span className={`font-mono font-bold ${valueClass || 'text-slate-800 dark:text-slate-200'}`}>{value}</span>
        {sub && <span className="text-slate-400 dark:text-slate-500 ml-1 text-[9px]">{sub}</span>}
      </div>
    </div>
  );
}

function SimCard({ label, value, highlight, warn }: { label: string; value: string; highlight?: boolean; warn?: boolean }) {
  const border = warn
    ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
    : highlight
      ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800';
  const textColor = warn
    ? 'text-red-700 dark:text-red-300'
    : highlight
      ? 'text-green-700 dark:text-green-300'
      : 'text-slate-800 dark:text-slate-100';
  return (
    <div className={`rounded-lg border-2 p-2.5 text-center transition-colors ${border}`}>
      <div className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">{label}</div>
      <div className={`text-lg font-bold mt-0.5 ${textColor}`}>{value}</div>
    </div>
  );
}
