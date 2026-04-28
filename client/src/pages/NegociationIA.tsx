import { formatCurrency } from '../utils/currency';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Handshake, TrendingDown, DollarSign, Copy, Mail, MessageCircle,
  ChevronDown, ChevronUp, Loader2, Target, BarChart3, Check,
  Sparkles, ArrowRight, Calendar, Phone, AlertTriangle,
  Award, FileText, RefreshCw, Search, Filter, X, Info,
  Package, Truck, Percent, ChevronRight, Clock, Star,
  PiggyBank, CircleDollarSign, ShoppingBasket, Lightbulb, ClipboardList,
} from 'lucide-react';
import type { Ingredient, Supplier } from '../types';
import { fetchIngredients, fetchSuppliers } from '../services/api';

// ── Helpers ──

function fmt(n: number): string {
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

function fmtDec(n: number, d = 2): string {
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
}

function fmtEur(n: number): string {
  return formatCurrency(n);
}

// ── Types ──

type NegotiationStatus = 'identifie' | 'contacte' | 'en_negociation' | 'accepte' | 'refuse';

interface NegotiationOpportunity {
  ingredientId: number;
  ingredientName: string;
  category: string;
  unit: string;
  currentPrice: number;
  marketAvgPrice: number;
  targetPrice: number;
  savingsPerUnit: number;
  savingsPerMonth: number;
  supplierName: string;
  supplierId: number | null;
  supplierEmail: string | null;
  supplierWhatsapp: string | null;
  confidence: number; // 0-100
  dataPoints: number;
}

interface NegotiationRecord {
  id: string;
  ingredientId: number;
  ingredientName: string;
  supplierName: string;
  status: NegotiationStatus;
  originalPrice: number;
  targetPrice: number;
  acceptedPrice: number | null;
  logs: { date: string; action: string; result: string }[];
  createdAt: string;
}

interface AIRecommendation {
  type: 'regroup' | 'substitute' | 'volume';
  icon: typeof Package;
  title: string;
  description: string;
  potentialSavings: number;
  priority: 'haute' | 'moyenne' | 'basse';
}

// ── Status helpers ──

const STATUS_CONFIG: Record<NegotiationStatus, { label: string; color: string; bgColor: string }> = {
  identifie: { label: 'Identifie', color: 'text-[#9CA3AF]', bgColor: 'bg-[#F3F4F6] dark:bg-[#171717]' },
  contacte: { label: 'Contacte', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-950/30' },
  en_negociation: { label: 'En negociation', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-950/30' },
  accepte: { label: 'Accepte', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30' },
  refuse: { label: 'Refuse', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-950/30' },
};

const STATUS_ORDER: NegotiationStatus[] = ['identifie', 'contacte', 'en_negociation', 'accepte', 'refuse'];

// ── Negotiation storage (localStorage) ──

function loadNegotiations(): NegotiationRecord[] {
  try {
    const raw = localStorage.getItem('negociations-ia');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveNegotiations(records: NegotiationRecord[]) {
  localStorage.setItem('negociations-ia', JSON.stringify(records));
}

// ── Price benchmark engine ──

function computeOpportunities(
  ingredients: Ingredient[],
  suppliers: Supplier[],
): NegotiationOpportunity[] {
  // Group ingredients by category to compute market averages
  const categoryPrices: Record<string, { prices: number[]; unit: string }> = {};

  for (const ing of ingredients) {
    if (!ing.category || ing.pricePerUnit <= 0) continue;
    const key = `${ing.category}::${ing.name.toLowerCase().trim()}`;
    if (!categoryPrices[key]) categoryPrices[key] = { prices: [], unit: ing.unit };
    categoryPrices[key].prices.push(ing.pricePerUnit);
  }

  // Also group by generic category
  const genericCategoryPrices: Record<string, number[]> = {};
  for (const ing of ingredients) {
    if (!ing.category || ing.pricePerUnit <= 0) continue;
    if (!genericCategoryPrices[ing.category]) genericCategoryPrices[ing.category] = [];
    genericCategoryPrices[ing.category].push(ing.pricePerUnit);
  }

  const supplierMap = new Map(suppliers.map(s => [s.id, s]));

  const opportunities: NegotiationOpportunity[] = [];

  for (const ing of ingredients) {
    if (ing.pricePerUnit <= 0) continue;
    const key = `${ing.category}::${ing.name.toLowerCase().trim()}`;
    const sameNamePrices = categoryPrices[key]?.prices || [];
    const catPrices = genericCategoryPrices[ing.category] || [];

    // Use same-name prices if available (3+ data points), otherwise category prices
    let refPrices = sameNamePrices.length >= 2 ? sameNamePrices : catPrices;
    if (refPrices.length < 2) continue;

    const avg = refPrices.reduce((a, b) => a + b, 0) / refPrices.length;
    const min = Math.min(...refPrices);
    const marketAvg = avg;

    // Compute how much this ingredient deviates above market average
    const overPayPercent = ((ing.pricePerUnit - marketAvg) / marketAvg) * 100;

    // Only flag if overpaying by >5%
    if (overPayPercent <= 5) continue;

    const targetPrice = Math.round((marketAvg * 0.98) * 100) / 100; // target 2% below market avg
    const savingsPerUnit = ing.pricePerUnit - targetPrice;

    // Estimate monthly volume (rough: assume 20kg/month for common ingredients)
    const estimatedMonthlyVolume = ing.category === 'Viande' ? 30
      : ing.category === 'Poisson' ? 15
      : ing.category === 'Produits laitiers' ? 25
      : ing.category === 'Fruits et legumes' ? 40
      : ing.category === 'Epicerie' ? 20
      : 15;

    const savingsPerMonth = savingsPerUnit * estimatedMonthlyVolume;

    const supplier = ing.supplierId ? supplierMap.get(ing.supplierId) : null;

    const confidence = Math.min(
      Math.round((sameNamePrices.length / 5) * 60 + (catPrices.length / 10) * 40),
      100
    );

    opportunities.push({
      ingredientId: ing.id,
      ingredientName: ing.name,
      category: ing.category,
      unit: ing.unit,
      currentPrice: ing.pricePerUnit,
      marketAvgPrice: Math.round(marketAvg * 100) / 100,
      targetPrice,
      savingsPerUnit: Math.round(savingsPerUnit * 100) / 100,
      savingsPerMonth: Math.round(savingsPerMonth * 100) / 100,
      supplierName: supplier?.name || ing.supplier || 'Non renseigne',
      supplierId: ing.supplierId,
      supplierEmail: supplier?.email || null,
      supplierWhatsapp: supplier?.whatsappPhone || supplier?.phone || null,
      confidence,
      dataPoints: sameNamePrices.length + catPrices.length,
    });
  }

  // Sort by monthly savings (highest first)
  return opportunities.sort((a, b) => b.savingsPerMonth - a.savingsPerMonth);
}

// ── AI recommendations engine ──

function computeRecommendations(
  ingredients: Ingredient[],
  suppliers: Supplier[],
  opportunities: NegotiationOpportunity[],
): AIRecommendation[] {
  const recs: AIRecommendation[] = [];

  // 1. Regroup orders by supplier (if multiple suppliers for same category)
  const supplierCategories: Record<string, Set<string>> = {};
  for (const ing of ingredients) {
    const sName = ing.supplier || 'Inconnu';
    if (!supplierCategories[sName]) supplierCategories[sName] = new Set();
    supplierCategories[sName].add(ing.category);
  }

  // Find suppliers with overlap
  const supplierNames = Object.keys(supplierCategories);
  for (let i = 0; i < supplierNames.length; i++) {
    const s1 = supplierNames[i];
    const cats1 = supplierCategories[s1];
    const ingCount1 = ingredients.filter(ing => (ing.supplier || 'Inconnu') === s1).length;

    for (let j = i + 1; j < supplierNames.length; j++) {
      const s2 = supplierNames[j];
      const cats2 = supplierCategories[s2];
      const overlap = [...cats1].filter(c => cats2.has(c));

      if (overlap.length > 0 && ingCount1 >= 3) {
        const totalSpend = ingredients
          .filter(ing => (ing.supplier || 'Inconnu') === s1 || (ing.supplier || 'Inconnu') === s2)
          .reduce((sum, ing) => sum + ing.pricePerUnit * 15, 0);

        recs.push({
          type: 'regroup',
          icon: Package,
          title: `Regroupez vos commandes chez ${s1}`,
          description: `Vous commandez des ${overlap.join(', ')} chez ${s1} et ${s2}. Regrouper pourrait vous donner un meilleur tarif.`,
          potentialSavings: Math.round(totalSpend * 0.05),
          priority: totalSpend > 500 ? 'haute' : 'moyenne',
        });
        break;
      }
    }
    if (recs.filter(r => r.type === 'regroup').length >= 2) break;
  }

  // 2. Substitution suggestions (same category, cheaper alternatives)
  const categoryIngredients: Record<string, Ingredient[]> = {};
  for (const ing of ingredients) {
    if (!categoryIngredients[ing.category]) categoryIngredients[ing.category] = [];
    categoryIngredients[ing.category].push(ing);
  }

  for (const [cat, ings] of Object.entries(categoryIngredients)) {
    if (ings.length < 2) continue;
    const sorted = [...ings].sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    const cheapest = sorted[0];
    const mostExpensive = sorted[sorted.length - 1];

    if (mostExpensive.pricePerUnit > cheapest.pricePerUnit * 1.3) {
      const savingPercent = Math.round(((mostExpensive.pricePerUnit - cheapest.pricePerUnit) / mostExpensive.pricePerUnit) * 100);
      recs.push({
        type: 'substitute',
        icon: RefreshCw,
        title: `Changez de ${mostExpensive.name} a ${cheapest.name}`,
        description: `Meme categorie (${cat}), -${savingPercent}% de cout. ${fmtEur(cheapest.pricePerUnit)}/${cheapest.unit} vs ${fmtEur(mostExpensive.pricePerUnit)}/${mostExpensive.unit}.`,
        potentialSavings: Math.round((mostExpensive.pricePerUnit - cheapest.pricePerUnit) * 20),
        priority: savingPercent > 30 ? 'haute' : 'moyenne',
      });
    }
    if (recs.filter(r => r.type === 'substitute').length >= 3) break;
  }

  // 3. Volume discount opportunities
  for (const opp of opportunities.slice(0, 5)) {
    if (opp.savingsPerMonth > 30) {
      recs.push({
        type: 'volume',
        icon: TrendingDown,
        title: `Votre volume de ${opp.ingredientName} justifie une remise de 10%`,
        description: `Vous payez ${fmtEur(opp.currentPrice)}/${opp.unit} alors que le marche est a ${fmtEur(opp.marketAvgPrice)}. Negociez une remise volume.`,
        potentialSavings: Math.round(opp.savingsPerMonth),
        priority: opp.savingsPerMonth > 50 ? 'haute' : 'moyenne',
      });
    }
    if (recs.filter(r => r.type === 'volume').length >= 3) break;
  }

  return recs.sort((a, b) => b.potentialSavings - a.potentialSavings);
}

// ── Script generator ──

function generateNegotiationScript(opp: NegotiationOpportunity): string {
  return `Bonjour${opp.supplierName !== 'Non renseigne' ? ` ${opp.supplierName}` : ''},

Nous commandons regulierement des ${opp.ingredientName} (environ ${opp.category === 'Viande' ? '30' : opp.category === 'Poisson' ? '15' : '20'} ${opp.unit}/mois) et nous valorisons beaucoup notre partenariat.

Apres une analyse de marche, nous avons constate que le prix moyen pour ce produit se situe actuellement autour de ${fmtEur(opp.marketAvgPrice)}/${opp.unit}.

Notre tarif actuel de ${fmtEur(opp.currentPrice)}/${opp.unit} represente un ecart significatif par rapport au marche. Serait-il possible de revoir notre tarif vers ${fmtEur(opp.targetPrice)}/${opp.unit} ?

Cela nous permettrait de continuer a travailler ensemble dans les meilleures conditions et potentiellement d'augmenter nos volumes de commande.

Nous sommes bien entendu ouverts a la discussion et a trouver un accord mutuellement benefique.

Cordialement,
[Votre nom]
[Votre restaurant]`;
}

function generateCallScript(opp: NegotiationOpportunity): string {
  return `--- SCRIPT D'APPEL ---

1. INTRODUCTION
"Bonjour, c'est [votre nom] du restaurant [nom]. J'espere que tout va bien de votre cote."

2. CONTEXTE
"Je vous appelle car nous faisons le point sur nos couts ingredients. Nous sommes un client fidele et nous commandons regulierement ${opp.ingredientName} chez vous."

3. LA DEMANDE
"Nous avons remarque que le prix du marche pour ${opp.ingredientName} est actuellement autour de ${fmtEur(opp.marketAvgPrice)}/${opp.unit}, et nous payons actuellement ${fmtEur(opp.currentPrice)}/${opp.unit}. Est-ce qu'il serait possible d'ajuster ce tarif ?"

4. OBJECTIF
Prix cible : ${fmtEur(opp.targetPrice)}/${opp.unit}
Economie visee : ${fmtEur(opp.savingsPerMonth)}/mois

5. ARGUMENTS
- Fidelite : client regulier
- Volume : commandes mensuelles stables
- Engagement : pret a augmenter les volumes si le prix est ajuste
- Marche : d'autres fournisseurs proposent des tarifs competitifs

6. CONCLUSION
"Merci d'y reflechir. On peut se rappeler en fin de semaine pour en discuter ?"`;
}

// ── Confidence Badge ──

function ConfidenceBadge({ level, dataPoints }: { level: number; dataPoints: number }) {
  const color = level >= 70 ? 'text-emerald-600 dark:text-emerald-400' :
    level >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-[#9CA3AF] dark:text-[#737373]';
  const label = level >= 70 ? 'Haute' : level >= 40 ? 'Moyenne' : 'Faible';

  return (
    <div className="flex items-center gap-1.5" title={`${dataPoints} points de donnees`}>
      <div className="flex gap-0.5">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className={`w-1.5 h-${i + 2} rounded-full ${
              i <= (level >= 70 ? 3 : level >= 40 ? 2 : 1)
                ? (level >= 70 ? 'bg-emerald-500' : level >= 40 ? 'bg-amber-500' : 'bg-[#D1D5DB] dark:bg-[#404040]')
                : 'bg-[#E5E7EB] dark:bg-[#262626]'
            }`}
            style={{ height: `${(i + 1) * 4}px` }}
          />
        ))}
      </div>
      <span className={`text-xs font-medium ${color}`}>{label}</span>
    </div>
  );
}

// ── Tab type ──

type TabId = 'dashboard' | 'tracker' | 'savings' | 'recommendations';

// ═══════════════════════════════════════════════════════════════════════════════
// ██  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function NegociationIA() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [negotiations, setNegotiations] = useState<NegotiationRecord[]>(loadNegotiations);
  const [expandedOpp, setExpandedOpp] = useState<number | null>(null);
  const [scriptType, setScriptType] = useState<'email' | 'call'>('email');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copied, setCopied] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Load data
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [ings, supps] = await Promise.all([fetchIngredients(), fetchSuppliers()]);
        if (!cancelled) {
          setIngredients(ings);
          setSuppliers(supps);
        }
      } catch (err) {
        console.error('Error loading negotiation data:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Compute opportunities
  const opportunities = useMemo(
    () => computeOpportunities(ingredients, suppliers),
    [ingredients, suppliers],
  );

  // Compute recommendations
  const recommendations = useMemo(
    () => computeRecommendations(ingredients, suppliers, opportunities),
    [ingredients, suppliers, opportunities],
  );

  // Total potential savings
  const totalPotentialSavings = useMemo(
    () => opportunities.reduce((sum, o) => sum + o.savingsPerMonth, 0),
    [opportunities],
  );

  // Annual savings from accepted negotiations
  const annualSavingsRealized = useMemo(() => {
    return negotiations
      .filter(n => n.status === 'accepte' && n.acceptedPrice !== null)
      .reduce((sum, n) => {
        const saved = (n.originalPrice - (n.acceptedPrice || n.originalPrice)) * 20 * 12;
        return sum + Math.max(saved, 0);
      }, 0);
  }, [negotiations]);

  // Categories for filter
  const categories = useMemo(
    () => [...new Set(opportunities.map(o => o.category))].sort(),
    [opportunities],
  );

  // Filtered opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(o => {
      if (categoryFilter !== 'all' && o.category !== categoryFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return o.ingredientName.toLowerCase().includes(q) || o.supplierName.toLowerCase().includes(q);
      }
      return true;
    });
  }, [opportunities, categoryFilter, searchQuery]);

  // Negotiation actions
  const startNegotiation = useCallback((opp: NegotiationOpportunity) => {
    const existing = negotiations.find(n => n.ingredientId === opp.ingredientId && n.status !== 'refuse');
    if (existing) return;

    const record: NegotiationRecord = {
      id: `neg-${Date.now()}`,
      ingredientId: opp.ingredientId,
      ingredientName: opp.ingredientName,
      supplierName: opp.supplierName,
      status: 'identifie',
      originalPrice: opp.currentPrice,
      targetPrice: opp.targetPrice,
      acceptedPrice: null,
      logs: [{ date: new Date().toISOString(), action: 'Opportunite identifiee', result: `Ecart de ${fmtEur(opp.savingsPerUnit)}/${opp.unit} vs marche` }],
      createdAt: new Date().toISOString(),
    };
    const updated = [record, ...negotiations];
    setNegotiations(updated);
    saveNegotiations(updated);
  }, [negotiations]);

  const updateNegotiationStatus = useCallback((id: string, newStatus: NegotiationStatus, note?: string, acceptedPrice?: number) => {
    const updated = negotiations.map(n => {
      if (n.id !== id) return n;
      const log = {
        date: new Date().toISOString(),
        action: `Statut: ${STATUS_CONFIG[newStatus].label}`,
        result: note || '',
      };
      return {
        ...n,
        status: newStatus,
        acceptedPrice: acceptedPrice ?? n.acceptedPrice,
        logs: [...n.logs, log],
      };
    });
    setNegotiations(updated);
    saveNegotiations(updated);
  }, [negotiations]);

  // Copy to clipboard
  const handleCopy = useCallback(async (text: string, oppId: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(oppId);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(oppId);
      setTimeout(() => setCopied(null), 2000);
    }
  }, []);

  // Open WhatsApp
  const openWhatsApp = useCallback((opp: NegotiationOpportunity, message: string) => {
    const phone = (opp.supplierWhatsapp || '').replace(/[^0-9+]/g, '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }, []);

  // Open mailto
  const openEmail = useCallback((opp: NegotiationOpportunity, message: string) => {
    const email = opp.supplierEmail || '';
    const subject = `Revision tarif - ${opp.ingredientName}`;
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = url;
  }, []);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#111111] dark:text-white" />
        <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-3">Analyse des prix en cours...</p>
      </div>
    );
  }

  // ── Savings Report stats ──
  const acceptedCount = negotiations.filter(n => n.status === 'accepte').length;
  const activeCount = negotiations.filter(n => !['accepte', 'refuse'].includes(n.status)).length;
  const refusedCount = negotiations.filter(n => n.status === 'refuse').length;

  // Per-supplier savings
  const savingsBySupplier = negotiations
    .filter(n => n.status === 'accepte' && n.acceptedPrice !== null)
    .reduce<Record<string, number>>((acc, n) => {
      const saved = (n.originalPrice - (n.acceptedPrice || 0)) * 20 * 12;
      acc[n.supplierName] = (acc[n.supplierName] || 0) + saved;
      return acc;
    }, {});

  // Per-ingredient savings
  const savingsByIngredient = negotiations
    .filter(n => n.status === 'accepte' && n.acceptedPrice !== null)
    .reduce<Record<string, number>>((acc, n) => {
      const saved = (n.originalPrice - (n.acceptedPrice || 0)) * 20 * 12;
      acc[n.ingredientName] = (acc[n.ingredientName] || 0) + saved;
      return acc;
    }, {});

  // ── TABS ──

  const tabs: { id: TabId; label: string; icon: typeof Handshake; count?: number }[] = [
    { id: 'dashboard', label: 'Opportunites', icon: Target, count: filteredOpportunities.length },
    { id: 'tracker', label: 'Suivi', icon: ClipboardList, count: negotiations.length },
    { id: 'savings', label: 'Economies', icon: PiggyBank },
    { id: 'recommendations', label: 'Conseils IA', icon: Sparkles, count: recommendations.length },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // ██  RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111111] dark:text-white font-satoshi tracking-tight flex items-center gap-3">
            <Handshake className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            Negociation IA
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3] mt-1">
            Assistant intelligent pour negocier avec vos fournisseurs
          </p>
        </div>

        {/* Big savings KPI */}
        <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl px-6 py-4 text-white shadow-lg">
          <div className="text-xs font-medium uppercase tracking-wider opacity-80">Potentiel d'economie</div>
          <div className="text-3xl font-bold font-satoshi mt-1">
            {formatCurrency(Math.round(totalPotentialSavings))}<span className="text-lg font-normal opacity-80">/mois</span>
          </div>
          <div className="text-xs mt-1 opacity-70">
            {formatCurrency(Math.round(totalPotentialSavings * 12))}/an sur {opportunities.length} ingredient{opportunities.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
          <div className="flex items-center gap-2 text-[#6B7280] dark:text-[#A3A3A3] text-xs font-medium mb-2">
            <Target className="w-4 h-4" />
            Opportunites
          </div>
          <div className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">{opportunities.length}</div>
          <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">ingredients surpayes</div>
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
          <div className="flex items-center gap-2 text-[#6B7280] dark:text-[#A3A3A3] text-xs font-medium mb-2">
            <Clock className="w-4 h-4" />
            En cours
          </div>
          <div className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">{activeCount}</div>
          <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">negociations actives</div>
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-medium mb-2">
            <Check className="w-4 h-4" />
            Acceptees
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-satoshi">{acceptedCount}</div>
          <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">negociations reussies</div>
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-medium mb-2">
            <CircleDollarSign className="w-4 h-4" />
            Economies realisees
          </div>
          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 font-satoshi">{formatCurrency(Math.round(annualSavingsRealized))}</div>
          <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">cette annee</div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-[#F3F4F6] dark:bg-[#171717] rounded-xl p-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#111111] dark:bg-white text-white dark:text-[#000000] shadow-sm'
                : 'text-[#6B7280] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-white/20 dark:bg-black/20' : 'bg-[#E5E7EB] dark:bg-[#262626]'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ██  TAB: DASHBOARD (Opportunities) */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          {/* Search & filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Rechercher un ingredient ou fournisseur..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] text-sm text-[#111111] dark:text-white placeholder:text-[#9CA3AF] dark:placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                showFilters || categoryFilter !== 'all'
                  ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-transparent'
                  : 'bg-white dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#A3A3A3] border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#111111] dark:hover:border-white'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtrer
              {categoryFilter !== 'all' && <span className="w-2 h-2 rounded-full bg-teal-400" />}
            </button>
          </div>

          {/* Category filter chips */}
          {showFilters && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  categoryFilter === 'all'
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                    : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                Toutes
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    categoryFilter === cat
                      ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                      : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Opportunities list */}
          {filteredOpportunities.length === 0 ? (
            <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-12 text-center">
              <Handshake className="w-12 h-12 text-[#D1D5DB] dark:text-[#404040] mx-auto mb-4" />
              <p className="text-lg font-semibold text-[#111111] dark:text-white">Aucune opportunite detectee</p>
              <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-2">
                {ingredients.length < 5
                  ? 'Ajoutez plus d\'ingredients pour que l\'IA detecte des opportunites de negociation.'
                  : 'Tous vos prix sont competitifs ! Continuez a surveiller le marche.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOpportunities.map((opp) => {
                const isExpanded = expandedOpp === opp.ingredientId;
                const existingNeg = negotiations.find(n => n.ingredientId === opp.ingredientId && n.status !== 'refuse');
                const script = scriptType === 'email' ? generateNegotiationScript(opp) : generateCallScript(opp);
                const overPayPercent = Math.round(((opp.currentPrice - opp.marketAvgPrice) / opp.marketAvgPrice) * 100);

                return (
                  <div
                    key={opp.ingredientId}
                    className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden transition-all"
                  >
                    {/* Opportunity header */}
                    <button
                      onClick={() => setExpandedOpp(isExpanded ? null : opp.ingredientId)}
                      className="w-full flex items-center gap-4 p-4 md:p-5 text-left hover:bg-[#FAFAFA] dark:hover:bg-[#0D0D0D] transition-colors"
                    >
                      {/* Ingredient avatar */}
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <ShoppingBasket className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-[#111111] dark:text-white text-sm">{opp.ingredientName}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3]">
                            {opp.category}
                          </span>
                          {existingNeg && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_CONFIG[existingNeg.status].bgColor} ${STATUS_CONFIG[existingNeg.status].color}`}>
                              {STATUS_CONFIG[existingNeg.status].label}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5 flex items-center gap-2">
                          <Truck className="w-3 h-3" />
                          {opp.supplierName}
                        </div>
                      </div>

                      {/* Prices */}
                      <div className="hidden sm:flex items-center gap-6 flex-shrink-0">
                        <div className="text-right">
                          <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">Votre prix</div>
                          <div className="text-sm font-semibold text-red-600 dark:text-red-400">{fmtEur(opp.currentPrice)}/{opp.unit}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#D1D5DB] dark:text-[#404040]" />
                        <div className="text-right">
                          <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">Marche</div>
                          <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{fmtEur(opp.marketAvgPrice)}/{opp.unit}</div>
                        </div>
                      </div>

                      {/* Savings badge */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded-lg">
                          +{overPayPercent}%
                        </span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          -{fmtEur(opp.savingsPerMonth)}/mois
                        </span>
                      </div>

                      {/* Expand icon */}
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-[#9CA3AF]" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[#9CA3AF]" />
                        )}
                      </div>
                    </button>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] p-4 md:p-5 space-y-5">
                        {/* Price comparison bar */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-[#FAFAFA] dark:bg-[#0D0D0D] rounded-xl p-4">
                            <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">Votre prix actuel</div>
                            <div className="text-xl font-bold text-red-600 dark:text-red-400 font-satoshi">{fmtEur(opp.currentPrice)}<span className="text-sm font-normal">/{opp.unit}</span></div>
                          </div>
                          <div className="bg-[#FAFAFA] dark:bg-[#0D0D0D] rounded-xl p-4">
                            <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">Moyenne marche</div>
                            <div className="text-xl font-bold text-[#111111] dark:text-white font-satoshi">{fmtEur(opp.marketAvgPrice)}<span className="text-sm font-normal">/{opp.unit}</span></div>
                            <ConfidenceBadge level={opp.confidence} dataPoints={opp.dataPoints} />
                          </div>
                          <div className="bg-[#FAFAFA] dark:bg-[#0D0D0D] rounded-xl p-4">
                            <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">Prix cible</div>
                            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-satoshi">{fmtEur(opp.targetPrice)}<span className="text-sm font-normal">/{opp.unit}</span></div>
                          </div>
                        </div>

                        {/* Script generator */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-[#111111] dark:text-white flex items-center gap-2">
                              <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                              Script de negociation
                            </h3>
                            <div className="flex gap-1 bg-[#F3F4F6] dark:bg-[#171717] rounded-lg p-0.5">
                              <button
                                onClick={() => setScriptType('email')}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                  scriptType === 'email'
                                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                                    : 'text-[#6B7280] dark:text-[#A3A3A3]'
                                }`}
                              >
                                Email
                              </button>
                              <button
                                onClick={() => setScriptType('call')}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                  scriptType === 'call'
                                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                                    : 'text-[#6B7280] dark:text-[#A3A3A3]'
                                }`}
                              >
                                Appel
                              </button>
                            </div>
                          </div>

                          <div className="bg-[#FAFAFA] dark:bg-[#0D0D0D] rounded-xl p-4 text-sm text-[#374151] dark:text-[#D4D4D4] whitespace-pre-wrap font-mono leading-relaxed max-h-64 overflow-y-auto">
                            {script}
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            <button
                              onClick={() => handleCopy(script, opp.ingredientId)}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-[#333333] dark:hover:bg-[#E5E5E5] transition-colors"
                            >
                              {copied === opp.ingredientId ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              {copied === opp.ingredientId ? 'Copie !' : 'Copier'}
                            </button>
                            {opp.supplierEmail && (
                              <button
                                onClick={() => openEmail(opp, script)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                              >
                                <Mail className="w-4 h-4" />
                                Envoyer par email
                              </button>
                            )}
                            {opp.supplierWhatsapp && (
                              <button
                                onClick={() => openWhatsApp(opp, generateNegotiationScript(opp))}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                              >
                                <MessageCircle className="w-4 h-4" />
                                WhatsApp
                              </button>
                            )}
                            {!existingNeg && (
                              <button
                                onClick={() => {
                                  startNegotiation(opp);
                                  setActiveTab('tracker');
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-teal-600 text-white hover:bg-teal-500 transition-colors"
                              >
                                <Handshake className="w-4 h-4" />
                                Lancer la negociation
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ██  TAB: TRACKER */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}

      {activeTab === 'tracker' && (
        <div className="space-y-4">
          {negotiations.length === 0 ? (
            <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-12 text-center">
              <Handshake className="w-12 h-12 text-[#D1D5DB] dark:text-[#404040] mx-auto mb-4" />
              <p className="text-lg font-semibold text-[#111111] dark:text-white">Aucune negociation en cours</p>
              <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-2">
                Allez dans l'onglet "Opportunites" pour identifier des negociations a lancer.
              </p>
            </div>
          ) : (
            negotiations.map(neg => {
              const currentStepIndex = STATUS_ORDER.indexOf(neg.status);

              return (
                <div key={neg.id} className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#111111] dark:text-white text-sm">{neg.ingredientName}</h3>
                      <p className="text-xs text-[#9CA3AF] dark:text-[#737373] flex items-center gap-1 mt-0.5">
                        <Truck className="w-3 h-3" /> {neg.supplierName}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">{fmtEur(neg.originalPrice)} → {fmtEur(neg.targetPrice)}</div>
                        {neg.acceptedPrice !== null && (
                          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Accepte: {fmtEur(neg.acceptedPrice)}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status pipeline */}
                  <div className="flex items-center gap-1">
                    {STATUS_ORDER.filter(s => s !== 'refuse').map((status, i) => {
                      const stepIndex = STATUS_ORDER.indexOf(status);
                      const isActive = status === neg.status;
                      const isPast = stepIndex < currentStepIndex && neg.status !== 'refuse';
                      const config = STATUS_CONFIG[status];

                      return (
                        <div key={status} className="flex-1 flex items-center gap-1">
                          <button
                            onClick={() => {
                              if (status === 'accepte') {
                                const price = prompt('Prix accepte (EUR) :');
                                if (price) {
                                  updateNegotiationStatus(neg.id, status, '', parseFloat(price));
                                }
                              } else {
                                updateNegotiationStatus(neg.id, status, `Passage a: ${config.label}`);
                              }
                            }}
                            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all text-center ${
                              isActive
                                ? 'bg-[#111111] dark:bg-white text-white dark:text-black shadow-sm'
                                : isPast
                                  ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                                  : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] hover:bg-[#E5E7EB] dark:hover:bg-[#1A1A1A]'
                            }`}
                          >
                            {config.label}
                          </button>
                          {i < 3 && <ChevronRight className="w-3 h-3 text-[#D1D5DB] dark:text-[#404040] flex-shrink-0" />}
                        </div>
                      );
                    })}
                    {/* Refuse button */}
                    <button
                      onClick={() => updateNegotiationStatus(neg.id, 'refuse', 'Negociation refusee')}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        neg.status === 'refuse'
                          ? 'bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                          : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Logs */}
                  {neg.logs.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Historique
                      </div>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {neg.logs.slice().reverse().map((log, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs">
                            <span className="text-[#9CA3AF] dark:text-[#737373] whitespace-nowrap flex-shrink-0">
                              {new Date(log.date).toLocaleDateString('fr-FR')}
                            </span>
                            <span className="text-[#374151] dark:text-[#D4D4D4] font-medium">{log.action}</span>
                            {log.result && <span className="text-[#9CA3AF] dark:text-[#737373]">— {log.result}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ██  TAB: SAVINGS REPORT */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}

      {activeTab === 'savings' && (
        <div className="space-y-6">
          {/* Annual savings hero */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 md:p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 opacity-80" />
              <div>
                <h2 className="text-lg font-bold font-satoshi">Rapport d'economies annuel</h2>
                <p className="text-sm opacity-80">{new Date().getFullYear()}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
              <div>
                <div className="text-sm opacity-70">Economies realisees</div>
                <div className="text-3xl font-bold font-satoshi mt-1">{formatCurrency(Math.round(annualSavingsRealized))}</div>
              </div>
              <div>
                <div className="text-sm opacity-70">Potentiel restant</div>
                <div className="text-3xl font-bold font-satoshi mt-1">{formatCurrency(Math.round(totalPotentialSavings * 12))}</div>
              </div>
              <div>
                <div className="text-sm opacity-70">ROI de RestauMargin</div>
                <div className="text-3xl font-bold font-satoshi mt-1">
                  {annualSavingsRealized > 0 ? `x${fmtDec(annualSavingsRealized / 468, 0)}` : '--'}
                </div>
                <div className="text-xs opacity-60 mt-0.5">(base abonnement 39 EUR/mois)</div>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Per supplier */}
            <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                Economies par fournisseur
              </h3>
              {Object.keys(savingsBySupplier).length === 0 ? (
                <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Aucune negociation reussie pour le moment.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(savingsBySupplier)
                    .sort(([, a], [, b]) => b - a)
                    .map(([name, saved]) => (
                      <div key={name} className="flex items-center justify-between">
                        <span className="text-sm text-[#374151] dark:text-[#D4D4D4]">{name}</span>
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{fmtEur(saved)}/an</span>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>

            {/* Per ingredient */}
            <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
                <ShoppingBasket className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                Economies par ingredient
              </h3>
              {Object.keys(savingsByIngredient).length === 0 ? (
                <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Aucune negociation reussie pour le moment.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(savingsByIngredient)
                    .sort(([, a], [, b]) => b - a)
                    .map(([name, saved]) => (
                      <div key={name} className="flex items-center justify-between">
                        <span className="text-sm text-[#374151] dark:text-[#D4D4D4]">{name}</span>
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{fmtEur(saved)}/an</span>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>

          {/* Negotiation summary */}
          <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#111111] dark:text-white mb-4">Resume des negociations</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">{negotiations.length}</div>
                <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-satoshi">{acceptedCount}</div>
                <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">Acceptees</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-satoshi">{activeCount}</div>
                <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">En cours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400 font-satoshi">{refusedCount}</div>
                <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">Refusees</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ██  TAB: AI RECOMMENDATIONS */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}

      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-12 text-center">
              <Lightbulb className="w-12 h-12 text-[#D1D5DB] dark:text-[#404040] mx-auto mb-4" />
              <p className="text-lg font-semibold text-[#111111] dark:text-white">Pas encore de recommandations</p>
              <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-2">
                Ajoutez plus d'ingredients et de fournisseurs pour recevoir des conseils personnalises.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs text-[#6B7280] dark:text-[#A3A3A3]">
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{recommendations.length} recommandation{recommendations.length > 1 ? 's' : ''} generee{recommendations.length > 1 ? 's' : ''} a partir de vos donnees</span>
              </div>

              {recommendations.map((rec, i) => {
                const priorityColors = {
                  haute: 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30',
                  moyenne: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30',
                  basse: 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] border-[#E5E7EB] dark:border-[#1A1A1A]',
                };

                return (
                  <div
                    key={i}
                    className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <rec.icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-sm font-semibold text-[#111111] dark:text-white">{rec.title}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide border ${priorityColors[rec.priority]}`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">{rec.description}</p>
                      <div className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <PiggyBank className="w-3.5 h-3.5" />
                        Economie potentielle: ~{fmtEur(rec.potentialSavings)}/mois
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}
