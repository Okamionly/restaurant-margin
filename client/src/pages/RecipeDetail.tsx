import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Clock, AlertTriangle, ChefHat, SlidersHorizontal, Users, Edit, Sparkles, TrendingDown, Leaf, Package, ShoppingCart, Check, Loader2, X, ArrowRight, Camera, Share2, Copy, ChevronLeft, ChevronRight, Trash2, ExternalLink, Shield, Apple, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { fetchRecipe, optimizeRecipeCost, addRecipePhoto, deleteRecipePhoto, getRecipeShareLink, checkAllergens, estimateNutrition } from '../services/api';
import type { AllergenCheckResult, NutritionEstimateResult } from '../services/api';
import type { Recipe, RecipeOptimizationResult, OptimizationSuggestion } from '../types';
import { formatCurrency, currencySuffix, getCurrencySymbol } from '../utils/currency';

// ─── Category emoji map ───
// ── Unit conversion divisor (price is always per bulk unit: kg/L) ───
function getUnitDivisor(unit: string): number {
  const u = (unit || '').toLowerCase().trim();
  if (u === 'g') return 1000;
  if (u === 'mg') return 1000000;
  if (u === 'cl') return 100;
  if (u === 'ml') return 1000;
  if (u === 'dl') return 10;
  return 1;
}

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
  Lait: 'bg-white text-[#111111] border-2 border-[#D1D5DB]',
  'Fruits à coque': 'bg-amber-700 text-white border border-amber-800',
  'Céleri': 'bg-lime-300 text-lime-900 border border-lime-400',
  Moutarde: 'bg-yellow-500 text-yellow-950 border border-yellow-600',
  'Sésame': 'bg-stone-300 text-stone-800 border border-stone-400',
  Sulfites: 'bg-purple-300 text-purple-900 border border-purple-400',
  Lupin: 'bg-pink-300 text-pink-900 border border-pink-400',
  Mollusques: 'bg-cyan-300 text-cyan-900 border border-cyan-400',
};

// ─── Auto-detection: ingredient name keywords → allergen ───
const ALLERGEN_KEYWORD_MAP: { allergen: string; keywords: string[] }[] = [
  { allergen: 'Gluten', keywords: ['blé', 'ble', 'farine', 'semoule', 'orge', 'seigle', 'avoine', 'épeautre', 'epeautre', 'kamut', 'pain', 'pâte', 'pate', 'chapelure', 'couscous', 'boulgour'] },
  { allergen: 'Crustacés', keywords: ['crustacé', 'crustace', 'crevette', 'homard', 'langouste', 'langoustine', 'crabe', 'écrevisse', 'ecrevisse', 'gambas'] },
  { allergen: 'Oeufs', keywords: ['œuf', 'oeuf', 'oeufs', 'œufs', 'jaune d\'oeuf', 'blanc d\'oeuf', 'mayonnaise'] },
  { allergen: 'Poissons', keywords: ['poisson', 'saumon', 'cabillaud', 'thon', 'truite', 'sole', 'bar', 'merlu', 'colin', 'anchois', 'sardine', 'dorade', 'lotte', 'lieu', 'flétan', 'fletan', 'maquereau', 'morue'] },
  { allergen: 'Arachides', keywords: ['arachide', 'cacahuète', 'cacahuete', 'cacahouète', 'cacahouete'] },
  { allergen: 'Soja', keywords: ['soja', 'tofu', 'edamame', 'tempeh', 'miso'] },
  { allergen: 'Lait', keywords: ['lait', 'crème', 'creme', 'beurre', 'fromage', 'yaourt', 'yogourt', 'mascarpone', 'ricotta', 'mozzarella', 'parmesan', 'gruyère', 'gruyere', 'emmental', 'comté', 'comte', 'chèvre', 'chevre', 'roquefort', 'camembert', 'brie', 'reblochon', 'raclette', 'lactose', 'crème fraîche', 'creme fraiche', 'babeurre', 'petit-suisse'] },
  { allergen: 'Fruits à coque', keywords: ['amande', 'noisette', 'noix', 'cajou', 'pistache', 'pécan', 'pecan', 'macadamia', 'noix de coco', 'pignon', 'pralin'] },
  { allergen: 'Céleri', keywords: ['céleri', 'celeri'] },
  { allergen: 'Moutarde', keywords: ['moutarde'] },
  { allergen: 'Sésame', keywords: ['sésame', 'sesame', 'tahini', 'tahin'] },
  { allergen: 'Sulfites', keywords: ['sulfite', 'vin', 'vinaigre', 'vin rouge', 'vin blanc', 'porto', 'madère', 'madere', 'xérès', 'xeres'] },
  { allergen: 'Lupin', keywords: ['lupin'] },
  { allergen: 'Mollusques', keywords: ['mollusque', 'moule', 'huître', 'huitre', 'calamar', 'poulpe', 'seiche', 'escargot', 'palourde', 'coque', 'bulot', 'bigorneau', 'encornet', 'saint-jacques'] },
];

function detectAllergens(ingredientNames: string[]): string[] {
  const detected = new Set<string>();
  for (const name of ingredientNames) {
    const lower = name.toLowerCase();
    for (const { allergen, keywords } of ALLERGEN_KEYWORD_MAP) {
      if (keywords.some((kw) => lower.includes(kw))) {
        detected.add(allergen);
      }
    }
  }
  return Array.from(detected).sort();
}

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
  const [optimizing, setOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<RecipeOptimizationResult | null>(null);
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<number>>(new Set());
  const [optimizeError, setOptimizeError] = useState<string | null>(null);
  // Photo gallery state
  const [photoIndex, setPhotoIndex] = useState(0);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Sharing state
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  // AI Allergen & Nutrition state
  const [allergenResult, setAllergenResult] = useState<AllergenCheckResult | null>(null);
  const [allergenLoading, setAllergenLoading] = useState(false);
  const [allergenError, setAllergenError] = useState<string | null>(null);
  const [nutritionResult, setNutritionResult] = useState<NutritionEstimateResult | null>(null);
  const [nutritionLoading, setNutritionLoading] = useState(false);
  const [nutritionError, setNutritionError] = useState<string | null>(null);

  const handlePhotoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!recipe || !e.target.files?.length) return;
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) { alert('Image trop lourde (max 5 Mo)'); return; }
    setUploadingPhoto(true);
    try {
      const reader = new FileReader();
      const dataUri = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      // Resize to max 800px width for MVP data URI storage
      const resized = await resizeImage(dataUri, 800);
      const updated = await addRecipePhoto(recipe.id, resized);
      setRecipe(updated);
      setPhotoIndex((updated.photos?.length || 1) - 1);
    } catch (err) { console.error('Erreur upload photo', err); }
    finally { setUploadingPhoto(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  }, [recipe]);

  const handleDeletePhoto = useCallback(async (idx: number) => {
    if (!recipe) return;
    try {
      const updated = await deleteRecipePhoto(recipe.id, idx);
      setRecipe(updated);
      setPhotoIndex(Math.max(0, idx - 1));
    } catch (err) { console.error('Erreur suppression photo', err); }
  }, [recipe]);

  const handleShare = useCallback(async () => {
    if (!recipe) return;
    setShareLoading(true);
    try {
      const { url } = await getRecipeShareLink(recipe.id);
      setShareUrl(url);
      setShowShareModal(true);
    } catch (err) { console.error('Erreur partage', err); }
    finally { setShareLoading(false); }
  }, [recipe]);

  const handleCopyLink = useCallback(async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch { /* fallback */ }
  }, [shareUrl]);

  const handleOptimize = useCallback(async () => {
    if (!recipe) return;
    setOptimizing(true);
    setOptimizeError(null);
    try {
      const result = await optimizeRecipeCost(recipe.id);
      setOptimizationResult(result);
      setShowOptimizer(true);
      setAppliedSuggestions(new Set());
    } catch (err: any) {
      setOptimizeError(err.message || 'Erreur lors de l\'optimisation');
    } finally {
      setOptimizing(false);
    }
  }, [recipe]);

  const handleAllergenCheck = useCallback(async () => {
    if (!recipe) return;
    setAllergenLoading(true);
    setAllergenError(null);
    try {
      const result = await checkAllergens(recipe.id);
      setAllergenResult(result);
    } catch (err: any) {
      setAllergenError(err.message || 'Erreur lors de l\'analyse des allergenes');
    } finally {
      setAllergenLoading(false);
    }
  }, [recipe]);

  const handleNutritionEstimate = useCallback(async () => {
    if (!recipe) return;
    setNutritionLoading(true);
    setNutritionError(null);
    try {
      const result = await estimateNutrition(recipe.id);
      setNutritionResult(result);
    } catch (err: any) {
      setNutritionError(err.message || 'Erreur lors de l\'estimation nutritionnelle');
    } finally {
      setNutritionLoading(false);
    }
  }, [recipe]);

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

  if (loading) return <div className="text-center py-12 text-[#9CA3AF] dark:text-[#737373]">Chargement...</div>;
  if (!recipe) return <div className="text-center py-12 text-red-500">Recette non trouvée</div>;

  const m = recipe.margin;
  const marginColor = m.marginPercent >= 70 ? 'text-green-600' : m.marginPercent >= 60 ? 'text-amber-600' : 'text-red-600';

  const allAllergens = Array.from(
    new Set(recipe.ingredients.flatMap((ri) => ri.ingredient.allergens || []))
  ).sort();

  // Auto-detected allergens from ingredient names
  const autoDetectedAllergens = useMemo(() => {
    return detectAllergens(recipe.ingredients.map((ri) => ri.ingredient.name));
  }, [recipe]);

  // Merge DB allergens + auto-detected, deduplicated
  const mergedAllergens = useMemo(() => {
    return Array.from(new Set([...allAllergens, ...autoDetectedAllergens])).sort();
  }, [allAllergens, autoDetectedAllergens]);

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
          <button
            onClick={handleShare}
            disabled={shareLoading}
            className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors disabled:opacity-50"
          >
            {shareLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            Partager
          </button>
          <button
            onClick={handleOptimize}
            disabled={optimizing}
            className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {optimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {optimizing ? 'Analyse...' : 'Optimiser IA'}
          </button>
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

      {/* ─── Photo Gallery (hidden on print) ─── */}
      <div className="no-print mb-4">
        {(recipe.photos?.length ?? 0) > 0 ? (
          <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-md overflow-hidden">
            {/* Main photo */}
            <div className="relative aspect-[16/9] bg-[#F3F4F6] dark:bg-[#171717]">
              <img
                src={recipe.photos![photoIndex]}
                alt={`${recipe.name} - photo ${photoIndex + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Navigation arrows */}
              {recipe.photos!.length > 1 && (
                <>
                  <button
                    onClick={() => setPhotoIndex((photoIndex - 1 + recipe.photos!.length) % recipe.photos!.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPhotoIndex((photoIndex + 1) % recipe.photos!.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              {/* Delete photo */}
              <button
                onClick={() => handleDeletePhoto(photoIndex)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                title="Supprimer cette photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              {/* Photo counter */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                {photoIndex + 1} / {recipe.photos!.length}
              </div>
            </div>
            {/* Thumbnails + Add button */}
            <div className="flex items-center gap-2 p-3 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
              {recipe.photos!.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setPhotoIndex(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors ${idx === photoIndex ? 'border-[#111111] dark:border-white' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={photo} alt={`Miniature ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              {(recipe.photos?.length ?? 0) < 5 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="w-14 h-14 rounded-lg border-2 border-dashed border-[#D1D5DB] dark:border-[#1A1A1A] flex items-center justify-center text-[#9CA3AF] hover:text-[#111111] dark:hover:text-white hover:border-[#111111] dark:hover:border-white transition-colors flex-shrink-0"
                >
                  {uploadingPhoto ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPhoto}
            className="w-full py-8 rounded-xl border-2 border-dashed border-[#D1D5DB] dark:border-[#1A1A1A] bg-white dark:bg-[#0A0A0A] flex flex-col items-center gap-2 text-[#9CA3AF] hover:text-[#111111] dark:hover:text-white hover:border-[#111111] dark:hover:border-white transition-colors"
          >
            {uploadingPhoto ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
            <span className="text-sm font-medium">Ajouter une photo</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoUpload}
          className="hidden"
        />
      </div>

      {/* ─── Share Modal ─── */}
      {showShareModal && shareUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 no-print" onClick={() => setShowShareModal(false)}>
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
              <h3 className="text-lg font-bold text-[#111111] dark:text-white">Partager la recette</h3>
              <button onClick={() => setShowShareModal(false)} className="text-[#9CA3AF] hover:text-[#111111] dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Link */}
              <div>
                <label className="text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-1 block">Lien public</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#F3F4F6] dark:bg-[#171717] text-[#111111] dark:text-white font-mono"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${shareCopied ? 'bg-green-600 text-white' : 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#333333] dark:hover:bg-[#E5E5E5]'}`}
                  >
                    {shareCopied ? <><Check className="w-4 h-4" /> Copié</> : <><Copy className="w-4 h-4" /> Copier</>}
                  </button>
                </div>
              </div>
              {/* QR Code */}
              <div>
                <label className="text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-2 block">QR Code</label>
                <div className="flex justify-center p-4 bg-white rounded-xl border border-[#E5E7EB]">
                  <QRCodeSVG value={shareUrl} size={180} />
                </div>
              </div>
              {/* Preview link */}
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] text-sm font-medium text-[#111111] dark:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Voir la page publique
              </a>
              {/* Info note */}
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373] text-center">
                Cette page publique affiche la recette sans prix ni marges.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Interactive tools (hidden on print) ─── */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-md mb-4 overflow-hidden no-print">
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
              className="w-20 px-2 py-1 text-sm border border-indigo-300 dark:border-indigo-600 rounded-lg text-center bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-[#E5E5E5] focus:ring-2 focus:ring-indigo-400 outline-none"
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
            <SlidersHorizontal className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
            <span className="text-sm font-semibold text-[#9CA3AF] dark:text-[#737373]">Simulateur de prix</span>
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 ml-auto">{(simPrice ?? 0).toFixed(2)} {getCurrencySymbol()}</span>
          </div>
          <input
            type="range"
            min={Math.max(0, m.totalCostPerPortion).toFixed(2)}
            max={(recipe.sellingPrice * 2.5).toFixed(2)}
            step="0.10"
            value={simPrice ?? recipe.sellingPrice}
            onChange={(e) => setSimPrice(parseFloat(e.target.value))}
            className="w-full h-2 bg-[#E5E7EB] dark:bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">
            <span>Coût : {m.totalCostPerPortion.toFixed(2)} {getCurrencySymbol()}</span>
            <span>Actuel : {recipe.sellingPrice.toFixed(2)} {getCurrencySymbol()}</span>
            <span>Max : {(recipe.sellingPrice * 2.5).toFixed(2)} {getCurrencySymbol()}</span>
          </div>
          {simData && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <SimCard label="Marge" value={formatCurrency(simData.margin)} highlight={simData.margin >= m.marginAmount} />
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
      <div id="fiche-technique" className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-xl overflow-hidden print:shadow-none print:rounded-none fiche-container">

        {/* ─── HEADER ─── */}
        <div className="fiche-header bg-[#111111] dark:bg-[#111111] text-white px-5 py-3 print:bg-[#111111] print:text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChefHat className="w-6 h-6 opacity-80" />
              <div>
                <div className="text-sm font-bold uppercase tracking-widest">{getRestaurantName()}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Fiche Technique</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">N&deg;<span className="text-white font-bold text-sm">{String(recipe.id).padStart(3, '0')}</span></div>
              <div className="text-[10px] text-gray-500">{formatDateShort(recipe.updatedAt)}</div>
            </div>
          </div>
        </div>

        {/* ─── TITLE BAR ─── */}
        <div className="px-5 py-2.5 border-b border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#FAFAFA] dark:bg-[#0A0A0A]">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold text-[#111111] dark:text-white leading-tight">{recipe.name}</h1>
              <div className="flex items-center gap-3 mt-0.5 text-xs text-[#9CA3AF] dark:text-[#737373]">
                <span className="font-medium text-[#9CA3AF] dark:text-[#737373] bg-[#E5E7EB] dark:bg-[#1A1A1A] px-2 py-0.5 rounded">{recipe.category}</span>
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
              <div className="text-2xl font-black text-[#111111] dark:text-white">{recipe.sellingPrice.toFixed(2)}<span className="text-sm font-medium ml-0.5">{getCurrencySymbol()}</span></div>
              <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase">Prix de vente</div>
            </div>
          </div>
          {recipe.description && (
            <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1.5 italic leading-snug">{recipe.description}</p>
          )}
        </div>

        {/* ─── BODY: 2-column layout ─── */}
        <div className="flex fiche-body">
          {/* ──── LEFT COLUMN (60%) ──── */}
          <div className="fiche-left flex-[3] border-r border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
            <h2 className="text-[11px] font-bold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-2">Composition</h2>

            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="border-b-2 border-[#D1D5DB] dark:border-[#1A1A1A] text-[#9CA3AF] dark:text-[#737373]">
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
                  const lineTotal = (effectiveQty / getUnitDivisor(ri.ingredient.unit)) * ri.ingredient.pricePerUnit;
                  const emoji = getCategoryEmoji(ri.ingredient.category);
                  const rowBg = idx % 2 === 0 ? '' : 'bg-[#FAFAFA] dark:bg-[#0A0A0A]/50';
                  return (
                    <tr key={ri.id} className={`${rowBg} border-b border-[#F3F4F6] dark:border-[#1A1A1A]/50 print:even:bg-[#FAFAFA]`}>
                      <td className="py-1 pl-1 text-[#111111] dark:text-[#E5E5E5] font-medium whitespace-nowrap">
                        <span className="mr-1" title={ri.ingredient.category}>{emoji}</span>
                        {ri.ingredient.name}
                        {(ri.ingredient.allergens || []).length > 0 && (
                          <span className="ml-1 text-amber-500 text-[9px] font-bold align-super" title={ri.ingredient.allergens.join(', ')}>*</span>
                        )}
                      </td>
                      <td className="py-1 text-center font-mono text-[#9CA3AF] dark:text-[#737373]">
                        {portionMultiplier !== 1 ? baseQty.toFixed(2) : ri.quantity}
                      </td>
                      <td className="py-1 text-center text-[#9CA3AF] dark:text-[#737373]">{ri.ingredient.unit}</td>
                      <td className="py-1 text-center font-mono text-[#9CA3AF] dark:text-[#737373]">{waste > 0 ? `${waste}%` : '—'}</td>
                      <td className="py-1 text-right font-mono text-[#6B7280] dark:text-[#737373]">{ri.ingredient.pricePerUnit.toFixed(2)}</td>
                      <td className="py-1 text-right font-mono font-bold text-[#111111] dark:text-[#E5E5E5] pr-1">{lineTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#9CA3AF] dark:border-[#6B7280] font-bold text-[#111111] dark:text-white">
                  <td colSpan={5} className="py-2 pl-1 text-xs uppercase tracking-wide">Coût matière total</td>
                  <td className="py-2 text-right font-mono pr-1 text-sm">{(m.foodCost * portionMultiplier).toFixed(2)} {getCurrencySymbol()}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* ──── RIGHT COLUMN (40%) ──── */}
          <div className="fiche-right flex-[2] p-4 space-y-3 bg-[#FAFAFA]/50 dark:bg-[#0A0A0A]/30">

            {/* Key metrics box */}
            <div>
              <h2 className="text-[11px] font-bold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-2">Indicateurs clés</h2>
              <div className="border border-[#D1D5DB] dark:border-[#1A1A1A] rounded-lg overflow-hidden text-[11px]">
                <MetricRow label="Prix de vente" value={formatCurrency(recipe.sellingPrice)} />
                <MetricRow label="Coût matière / portion" value={`${m.costPerPortion.toFixed(2)} ${getCurrencySymbol()}`} sub={`(${foodCostPct.toFixed(1)}%)`} />
                {m.laborCostPerPortion > 0 && (
                  <MetricRow label="Coût M.O. / portion" value={`${m.laborCostPerPortion.toFixed(2)} ${getCurrencySymbol()}`} />
                )}
                <MetricRow label="Coût total / portion" value={`${m.totalCostPerPortion.toFixed(2)} ${getCurrencySymbol()}`} bold />
                <MetricRow label="Marge brute" value={`${m.marginAmount.toFixed(2)} ${getCurrencySymbol()}`} valueClass={marginColor} />
                <MetricRow label="Marge %" value={`${m.marginPercent.toFixed(1)}%`} valueClass={marginColor} bold />
                <MetricRow label="Coefficient" value={m.coefficient.toFixed(2)} last />
              </div>
            </div>

            {/* Donut chart */}
            <div>
              <h2 className="text-[11px] font-bold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-1">Répartition du prix</h2>
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
                        formatter={(value: unknown) => `${Number(value).toFixed(2)} ${getCurrencySymbol()}`}
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
                      <span className="text-[#6B7280] dark:text-[#737373] flex-1">{d.name}</span>
                      <span className="font-mono font-bold text-[#111111] dark:text-[#E5E5E5]">{d.value.toFixed(2)} {getCurrencySymbol()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Allergens (auto-detected + DB) */}
            <div>
              <h2 className="text-[11px] font-bold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                Allergènes
              </h2>
              {mergedAllergens.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {mergedAllergens.map((a) => (
                    <span
                      key={a}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold leading-tight ${ALLERGEN_COLORS[a] || 'bg-amber-200 text-amber-800 border border-amber-300'}`}
                    >
                      {'\u26A0\uFE0F'} {a}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-green-600 dark:text-green-400 italic">Aucun allergène majeur détecté</p>
              )}
            </div>

            {/* Timing */}
            {totalTime > 0 && (
              <div>
                <h2 className="text-[11px] font-bold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-1.5">Temps de production</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-center text-[10px]">
                  {recipe.prepTimeMinutes > 0 && (
                    <div className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded px-2 py-1.5">
                      <div className="text-[#9CA3AF] dark:text-[#737373] uppercase text-[8px] font-semibold">Prép.</div>
                      <div className="font-bold text-[#111111] dark:text-[#E5E5E5] text-sm">{recipe.prepTimeMinutes}<span className="text-[9px] font-normal ml-0.5">min</span></div>
                    </div>
                  )}
                  {recipe.cookTimeMinutes > 0 && (
                    <div className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded px-2 py-1.5">
                      <div className="text-[#9CA3AF] dark:text-[#737373] uppercase text-[8px] font-semibold">Cuisson</div>
                      <div className="font-bold text-[#111111] dark:text-[#E5E5E5] text-sm">{recipe.cookTimeMinutes}<span className="text-[9px] font-normal ml-0.5">min</span></div>
                    </div>
                  )}
                  <div className="bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded px-2 py-1.5">
                    <div className="text-gray-300 dark:text-gray-500 uppercase text-[8px] font-semibold">Total</div>
                    <div className="font-bold text-sm">{totalTime}<span className="text-[9px] font-normal ml-0.5">min</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── FOOTER ─── */}
        <div className="fiche-footer px-5 py-1.5 border-t border-[#D1D5DB] dark:border-[#1A1A1A] bg-[#F5F5F5] dark:bg-[#0A0A0A] flex items-center justify-between text-[9px] text-[#9CA3AF] dark:text-[#737373]">
          <span>Mise à jour le {formatDate(recipe.updatedAt)}</span>
          <span>{getRestaurantName()} &mdash; Fiche Technique N&deg;{String(recipe.id).padStart(3, '0')}</span>
          <span>Page 1/1</span>
        </div>
      </div>

      {/* ─── Print-specific stylesheet ─── */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
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

          /* ── Base fiche styling ── */
          #fiche-technique {
            font-size: 9pt;
            border: 1px solid #cbd5e1;
            border-radius: 0;
            box-shadow: none;
            background: white !important;
            color: #1e293b !important;
            page-break-inside: avoid;
            max-height: 277mm;
            overflow: hidden;
          }

          /* ── Header (dark bar with restaurant name) ── */
          #fiche-technique .fiche-header {
            background-color: #111111 !important;
            color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          #fiche-technique .fiche-header * {
            color: white !important;
          }

          /* ── Title bar ── */
          #fiche-technique .bg-\[\#FAFAFA\] {
            background-color: #f8fafc !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* ── Body layout ── */
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

          /* ── Table ── */
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
          #fiche-technique tbody tr:nth-child(even) {
            background-color: #f8fafc !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          #fiche-technique tfoot tr {
            border-top: 2px solid #64748b !important;
          }

          /* ── Force all text colors for readability on white ── */
          #fiche-technique h1,
          #fiche-technique .text-\[\#111111\] {
            color: #0f172a !important;
          }
          #fiche-technique .text-\[\#6B7280\],
          #fiche-technique .text-\[\#9CA3AF\] {
            color: #64748b !important;
          }
          #fiche-technique .font-mono.font-bold {
            color: #1e293b !important;
          }

          /* ── Margin color indicators (keep meaningful colors) ── */
          #fiche-technique .text-green-600 { color: #16a34a !important; }
          #fiche-technique .text-amber-600 { color: #d97706 !important; }
          #fiche-technique .text-red-600 { color: #dc2626 !important; }

          /* ── Allergen badges ── */
          #fiche-technique span[class*="bg-"] {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* ── Timing boxes ── */
          #fiche-technique .bg-white {
            background-color: white !important;
          }
          #fiche-technique .bg-\[\#111111\] {
            background-color: #111111 !important;
            color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          #fiche-technique .bg-\[\#111111\] * {
            color: white !important;
          }

          /* ── Metric rows ── */
          #fiche-technique .metric-row:nth-child(even) {
            background-color: #f8fafc !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          #fiche-technique .metric-row .text-\[\#6B7280\] {
            color: #475569 !important;
          }
          #fiche-technique .metric-row .font-mono {
            color: #1e293b !important;
          }

          /* ── Category badge ── */
          #fiche-technique .bg-\[\#E5E7EB\] {
            background-color: #e2e8f0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* ── Selling price ── */
          #fiche-technique .text-2xl {
            color: #0f172a !important;
          }

          /* ── Footer ── */
          #fiche-technique .fiche-footer {
            background-color: #f1f5f9 !important;
            border-top: 1px solid #cbd5e1 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          #fiche-technique .fiche-footer span {
            color: #64748b !important;
          }

          /* ── Borders ── */
          #fiche-technique .border-\[\#E5E7EB\],
          #fiche-technique .border-\[\#D1D5DB\] {
            border-color: #cbd5e1 !important;
          }
          #fiche-technique .border-r {
            border-right: 1px solid #cbd5e1 !important;
          }

          /* ── Donut legend text ── */
          #fiche-technique .text-\[10px\] .text-\[\#6B7280\] {
            color: #64748b !important;
          }

          /* ── Dark mode full override for print ── */
          .dark #fiche-technique {
            background: white !important;
            color: #1e293b !important;
          }
          .dark #fiche-technique * {
            color: #1e293b !important;
          }
          .dark #fiche-technique .fiche-header,
          .dark #fiche-technique .fiche-header * {
            color: white !important;
          }
          .dark #fiche-technique .bg-\[\#111111\],
          .dark #fiche-technique .bg-\[\#111111\] * {
            color: white !important;
          }
          .dark #fiche-technique .text-green-600 { color: #16a34a !important; }
          .dark #fiche-technique .text-amber-600 { color: #d97706 !important; }
          .dark #fiche-technique .text-red-600 { color: #dc2626 !important; }
          .dark #fiche-technique .bg-\[\#FAFAFA\] {
            background-color: #f8fafc !important;
          }
          .dark #fiche-technique [class*="border"] {
            border-color: #cbd5e1 !important;
          }
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════
           AI ALLERGEN ANALYSIS CARD
         ═══════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-md mt-4 overflow-hidden no-print">
        <div className="px-5 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#111111] dark:text-white" />
            <h3 className="text-sm font-bold text-[#111111] dark:text-white">Analyse allergenes IA</h3>
          </div>
          <button
            onClick={handleAllergenCheck}
            disabled={allergenLoading}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#333333] dark:hover:bg-[#E5E5E5] transition-colors disabled:opacity-50"
          >
            {allergenLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {allergenLoading ? 'Analyse...' : 'Analyser allergenes IA'}
          </button>
        </div>

        {allergenError && (
          <div className="px-5 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
            <p className="text-xs text-red-600 dark:text-red-400">{allergenError}</p>
          </div>
        )}

        {allergenResult && (
          <div className="p-5 space-y-4">
            {/* 14 EU Allergens Grid */}
            <div>
              <h4 className="text-[10px] font-bold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-2">14 allergenes majeurs UE</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {allergenResult.allergens.map((a) => {
                  const isPresent = a.status === 'present';
                  const isTrace = a.status === 'trace';
                  const isAbsent = a.status === 'absent';
                  const bgColor = isPresent
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                    : isTrace
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700'
                      : 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700';
                  const iconColor = isPresent
                    ? 'text-red-600 dark:text-red-400'
                    : isTrace
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-green-600 dark:text-green-400';
                  return (
                    <div
                      key={a.name}
                      className={`rounded-lg border p-2 text-center ${bgColor}`}
                      title={a.source ? `Source: ${a.source}` : undefined}
                    >
                      <div className={`text-lg font-bold ${iconColor}`}>
                        {isPresent ? '\u2717' : isTrace ? '?' : '\u2713'}
                      </div>
                      <div className="text-[10px] font-semibold text-[#111111] dark:text-white leading-tight">{a.name}</div>
                      {a.source && (
                        <div className="text-[9px] text-[#9CA3AF] dark:text-[#737373] mt-0.5 truncate" title={a.source}>{a.source}</div>
                      )}
                      {a.riskLevel && String(a.riskLevel) !== 'null' && (
                        <div className={`text-[8px] font-medium mt-0.5 ${iconColor}`}>{a.riskLevel}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cross-contamination warnings */}
            {allergenResult.crossContamination.length > 0 && (
              <div>
                <h4 className="text-[10px] font-bold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  Risques de contamination croisee
                </h4>
                <div className="space-y-1.5">
                  {allergenResult.crossContamination.map((cc, i) => (
                    <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">{cc.allergen}</span>
                        <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3] ml-1">({cc.source})</span>
                        <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">{cc.risk}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation */}
            {allergenResult.recommendation && (
              <div className="px-3 py-2.5 rounded-lg bg-[#F3F4F6] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A]">
                <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">{allergenResult.recommendation}</p>
              </div>
            )}

            {/* Print-friendly allergen label */}
            <div>
              <button
                onClick={() => {
                  const printWin = window.open('', '_blank');
                  if (!printWin) return;
                  const presentAllergens = allergenResult.allergens.filter(a => a.status === 'present');
                  const traceAllergens = allergenResult.allergens.filter(a => a.status === 'trace');
                  printWin.document.write(`
                    <html><head><title>Etiquette allergenes - ${recipe.name}</title>
                    <style>
                      body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; }
                      h2 { font-size: 16px; margin-bottom: 8px; border-bottom: 2px solid #000; padding-bottom: 4px; }
                      h3 { font-size: 12px; margin: 12px 0 4px; color: #666; text-transform: uppercase; }
                      .allergen { display: inline-block; padding: 2px 8px; margin: 2px; border-radius: 4px; font-size: 11px; font-weight: bold; }
                      .present { background: #fecaca; color: #991b1b; border: 1px solid #f87171; }
                      .trace { background: #fef3c7; color: #92400e; border: 1px solid #fbbf24; }
                      .footer { margin-top: 16px; font-size: 9px; color: #999; border-top: 1px solid #ddd; padding-top: 4px; }
                    </style></head><body>
                    <h2>${recipe.name}</h2>
                    ${presentAllergens.length > 0 ? `<h3>Allergenes presents</h3><div>${presentAllergens.map(a => `<span class="allergen present">${a.name}${a.source ? ' (' + a.source + ')' : ''}</span>`).join('')}</div>` : ''}
                    ${traceAllergens.length > 0 ? `<h3>Traces possibles</h3><div>${traceAllergens.map(a => `<span class="allergen trace">${a.name}${a.source ? ' (' + a.source + ')' : ''}</span>`).join('')}</div>` : ''}
                    ${presentAllergens.length === 0 && traceAllergens.length === 0 ? '<p style="color: green; font-weight: bold;">Aucun allergene majeur detecte</p>' : ''}
                    <div class="footer">Analyse IA - ${new Date().toLocaleDateString('fr-FR')} - ${getRestaurantName()}</div>
                    </body></html>
                  `);
                  printWin.document.close();
                  printWin.print();
                }}
                className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimer etiquette allergenes
              </button>
            </div>
          </div>
        )}

        {!allergenResult && !allergenLoading && !allergenError && (
          <div className="px-5 py-6 text-center">
            <Shield className="w-8 h-8 mx-auto mb-2 text-[#D1D5DB] dark:text-[#333]" />
            <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">
              Lancez l'analyse IA pour detecter les 14 allergenes majeurs UE, les sources et les risques de contamination croisee.
            </p>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════
           AI NUTRITION ESTIMATION CARD
         ═══════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-md mt-4 overflow-hidden no-print">
        <div className="px-5 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Apple className="w-4 h-4 text-[#111111] dark:text-white" />
            <h3 className="text-sm font-bold text-[#111111] dark:text-white">Estimation nutritionnelle IA</h3>
          </div>
          <button
            onClick={handleNutritionEstimate}
            disabled={nutritionLoading}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#333333] dark:hover:bg-[#E5E5E5] transition-colors disabled:opacity-50"
          >
            {nutritionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {nutritionLoading ? 'Estimation...' : 'Estimer nutrition IA'}
          </button>
        </div>

        {nutritionError && (
          <div className="px-5 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
            <p className="text-xs text-red-600 dark:text-red-400">{nutritionError}</p>
          </div>
        )}

        {nutritionResult && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Macros donut */}
              <div className="md:col-span-1">
                <h4 className="text-[10px] font-bold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-2">Macronutriments / portion</h4>
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Proteines', value: nutritionResult.perPortion.protein * 4 },
                            { name: 'Glucides', value: nutritionResult.perPortion.carbs * 4 },
                            { name: 'Lipides', value: nutritionResult.perPortion.fat * 9 },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={55}
                          paddingAngle={3}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          <Cell fill="#111111" />
                          <Cell fill="#9CA3AF" />
                          <Cell fill="#D1D5DB" />
                        </Pie>
                        <Tooltip
                          formatter={(value: unknown) => `${Math.round(Number(value))} kcal`}
                          contentStyle={{ borderRadius: '6px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: '11px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-3 mt-2 text-[10px]">
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#111111] dark:bg-white" />
                      <span className="text-[#6B7280] dark:text-[#737373]">Prot.</span>
                      <span className="font-bold text-[#111111] dark:text-white">{nutritionResult.perPortion.protein}g</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#9CA3AF]" />
                      <span className="text-[#6B7280] dark:text-[#737373]">Gluc.</span>
                      <span className="font-bold text-[#111111] dark:text-white">{nutritionResult.perPortion.carbs}g</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#D1D5DB] dark:bg-[#737373]" />
                      <span className="text-[#6B7280] dark:text-[#737373]">Lip.</span>
                      <span className="font-bold text-[#111111] dark:text-white">{nutritionResult.perPortion.fat}g</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calorie count + detail */}
              <div className="md:col-span-1">
                <h4 className="text-[10px] font-bold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-2">Calories / portion</h4>
                <div className="text-center py-3">
                  <div className="text-4xl font-black text-[#111111] dark:text-white">{nutritionResult.perPortion.calories}</div>
                  <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">kcal</div>
                </div>
                <div className="space-y-1.5 mt-2">
                  <NutritionRow label="Fibres" value={`${nutritionResult.perPortion.fiber}g`} />
                  <NutritionRow label="Sodium" value={`${nutritionResult.perPortion.sodium}mg`} />
                </div>
              </div>

              {/* Health score ring */}
              <div className="md:col-span-1">
                <h4 className="text-[10px] font-bold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-2">Score sante</h4>
                <div className="flex flex-col items-center py-2">
                  <div className="relative w-28 h-28">
                    <svg viewBox="0 0 120 120" className="w-full h-full">
                      {/* Background circle */}
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" strokeWidth="8" className="dark:stroke-[#1A1A1A]" />
                      {/* Score arc */}
                      <circle
                        cx="60" cy="60" r="50" fill="none"
                        stroke={nutritionResult.healthScore >= 70 ? '#111111' : nutritionResult.healthScore >= 40 ? '#9CA3AF' : '#EF4444'}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(nutritionResult.healthScore / 100) * 314} 314`}
                        transform="rotate(-90 60 60)"
                        className={nutritionResult.healthScore >= 70 ? 'dark:stroke-white' : ''}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-[#111111] dark:text-white">{nutritionResult.healthScore}</span>
                      <span className="text-[9px] text-[#9CA3AF] dark:text-[#737373]">/100</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium mt-1 text-[#9CA3AF] dark:text-[#737373]">
                    {nutritionResult.healthScore >= 70 ? 'Bon equilibre' : nutritionResult.healthScore >= 40 ? 'Acceptable' : 'A ameliorer'}
                  </span>
                </div>
              </div>
            </div>

            {/* Dietary labels */}
            {nutritionResult.dietaryLabels.length > 0 && (
              <div>
                <h4 className="text-[10px] font-bold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-2">Labels</h4>
                <div className="flex flex-wrap gap-1.5">
                  {nutritionResult.dietaryLabels.map((label, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#111111] dark:text-white bg-[#F3F4F6] dark:bg-[#171717]"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI Analysis */}
            {nutritionResult.analysis && (
              <div className="px-3 py-2.5 rounded-lg bg-[#F3F4F6] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A]">
                <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">{nutritionResult.analysis}</p>
              </div>
            )}
          </div>
        )}

        {!nutritionResult && !nutritionLoading && !nutritionError && (
          <div className="px-5 py-6 text-center">
            <Activity className="w-8 h-8 mx-auto mb-2 text-[#D1D5DB] dark:text-[#333]" />
            <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">
              Lancez l'estimation IA pour obtenir les calories, macronutriments, score sante et labels dietetiques.
            </p>
          </div>
        )}
      </div>

      {/* ─── Optimize error toast ─── */}
      {optimizeError && (
        <div className="fixed bottom-4 right-4 z-50 bg-red-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in no-print">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{optimizeError}</span>
          <button onClick={() => setOptimizeError(null)} className="p-1 hover:bg-red-500 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── AI Recipe Cost Optimizer Modal ─── */}
      {showOptimizer && optimizationResult && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto no-print" role="dialog" aria-modal="true" onClick={() => setShowOptimizer(false)}>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative bg-white dark:bg-black rounded-2xl shadow-2xl w-full max-w-3xl my-8 border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-white" />
                <div>
                  <h3 className="text-lg font-bold text-white">Optimisation IA des couts</h3>
                  <p className="text-teal-100 text-xs">{optimizationResult.recipe.name}</p>
                </div>
              </div>
              <button onClick={() => setShowOptimizer(false)} className="p-1.5 rounded-lg hover:bg-teal-400/30 transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Cost comparison cards */}
            <div className="px-6 py-4 bg-[#FAFAFA]/50 dark:bg-[#0A0A0A]/50 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl p-4 border border-[#E5E7EB] dark:border-[#1A1A1A] text-center">
                  <div className="text-xs text-[#9CA3AF] dark:text-[#737373] font-medium mb-1">Cout actuel</div>
                  <div className="text-2xl font-bold text-red-400">{optimizationResult.optimization.currentTotalCost.toFixed(2)} {getCurrencySymbol()}</div>
                  <div className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-0.5">{optimizationResult.costPerPortion.toFixed(2)} {getCurrencySymbol()}/portion</div>
                </div>
                <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl p-4 border border-teal-600/50 text-center relative">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">OPTIMISE</div>
                  <div className="text-xs text-[#9CA3AF] dark:text-[#737373] font-medium mb-1">Cout optimise</div>
                  <div className="text-2xl font-bold text-teal-400">{optimizationResult.optimization.optimizedTotalCost.toFixed(2)} {getCurrencySymbol()}</div>
                  <div className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-0.5">{(optimizationResult.optimization.optimizedTotalCost / (optimizationResult.recipe.nbPortions || 1)).toFixed(2)} {getCurrencySymbol()}/portion</div>
                </div>
                <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl p-4 border border-emerald-600/50 text-center">
                  <div className="text-xs text-[#9CA3AF] dark:text-[#737373] font-medium mb-1">Economies</div>
                  <div className="text-2xl font-bold text-emerald-400">-{optimizationResult.optimization.totalSavingsEuros.toFixed(2)} {getCurrencySymbol()}</div>
                  <div className="text-xs text-emerald-500 mt-0.5 font-semibold">-{optimizationResult.optimization.totalSavingsPercent.toFixed(1)}%</div>
                </div>
              </div>
            </div>

            {/* Summary */}
            {optimizationResult.optimization.summary && (
              <div className="px-6 py-3 bg-teal-900/20 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                <p className="text-sm text-teal-200">{optimizationResult.optimization.summary}</p>
              </div>
            )}

            {/* Suggestions list */}
            <div className="px-6 py-4 max-h-[50vh] overflow-y-auto">
              <h4 className="text-sm font-semibold text-[#6B7280] dark:text-[#A3A3A3] mb-3 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-teal-400" />
                Suggestions d'optimisation ({optimizationResult.optimization.suggestions.length})
              </h4>
              <div className="space-y-3">
                {optimizationResult.optimization.suggestions.map((suggestion: OptimizationSuggestion, index: number) => {
                  const isApplied = appliedSuggestions.has(index);
                  const TypeIcon = suggestion.type === 'substitution' ? Package
                    : suggestion.type === 'seasonal' ? Leaf
                    : suggestion.type === 'supplier' ? ShoppingCart
                    : TrendingDown;
                  const typeLabel = suggestion.type === 'substitution' ? 'Substitution'
                    : suggestion.type === 'seasonal' ? 'Saisonnalite'
                    : suggestion.type === 'supplier' ? 'Fournisseur'
                    : 'Quantite';
                  const typeBg = suggestion.type === 'substitution' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    : suggestion.type === 'seasonal' ? 'bg-green-500/10 text-green-400 border-green-500/30'
                    : suggestion.type === 'supplier' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                    : 'bg-purple-500/10 text-purple-400 border-purple-500/30';
                  const impactColor = suggestion.quality_impact === 'aucun' ? 'text-green-400'
                    : suggestion.quality_impact === 'minimal' ? 'text-yellow-400'
                    : 'text-orange-400';
                  const impactLabel = suggestion.quality_impact === 'aucun' ? 'Aucun impact'
                    : suggestion.quality_impact === 'minimal' ? 'Impact minimal'
                    : 'Impact modere';

                  return (
                    <div
                      key={index}
                      className={`rounded-xl border p-4 transition-all duration-300 ${
                        isApplied
                          ? 'bg-teal-900/20 border-teal-600/50'
                          : 'bg-[#FAFAFA]/80 dark:bg-[#0A0A0A]/80 border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#9CA3AF] dark:hover:border-[#333]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${typeBg}`}>
                              <TypeIcon className="w-3 h-3" />
                              {typeLabel}
                            </span>
                            <span className={`text-[10px] font-medium ${impactColor}`}>{impactLabel}</span>
                          </div>
                          <div className="text-sm font-semibold text-[#111111] dark:text-white mb-1">{suggestion.ingredientName}</div>
                          <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-2">{suggestion.suggestion}</p>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-red-400 line-through">{suggestion.currentCost.toFixed(2)} {getCurrencySymbol()}</span>
                            <ArrowRight className="w-3 h-3 text-[#6B7280] dark:text-[#A3A3A3]" />
                            <span className="text-teal-400 font-semibold">{suggestion.estimatedNewCost.toFixed(2)} {getCurrencySymbol()}</span>
                            <span className="text-emerald-400 font-bold">-{suggestion.savingsPercent.toFixed(0)}%</span>
                          </div>
                          {suggestion.reasoning && (
                            <p className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] mt-2 italic">{suggestion.reasoning}</p>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setAppliedSuggestions(prev => {
                              const next = new Set(prev);
                              if (next.has(index)) {
                                next.delete(index);
                              } else {
                                next.add(index);
                              }
                              return next;
                            });
                          }}
                          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                            isApplied
                              ? 'bg-teal-600 text-white'
                              : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] hover:bg-teal-600 hover:text-white'
                          }`}
                        >
                          {isApplied ? <Check className="w-3.5 h-3.5" /> : null}
                          {isApplied ? 'Applique' : 'Appliquer'}
                        </button>
                      </div>
                    </div>
                  );
                })}
                {optimizationResult.optimization.suggestions.length === 0 && (
                  <div className="text-center py-8 text-[#6B7280] dark:text-[#A3A3A3]">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Cette recette est deja bien optimisee !</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal footer */}
            {appliedSuggestions.size > 0 && (
              <div className="px-6 py-3 bg-[#FAFAFA] dark:bg-[#0A0A0A] border-t border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center justify-between">
                <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{appliedSuggestions.size} suggestion{appliedSuggestions.size > 1 ? 's' : ''} selectionnee{appliedSuggestions.size > 1 ? 's' : ''}</span>
                <button
                  onClick={() => setShowOptimizer(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Valider la selection
                </button>
              </div>
            )}
          </div>
        </div>
      )}
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
    <div className={`metric-row flex items-center justify-between px-3 py-1.5 ${!last ? 'border-b border-[#E5E7EB] dark:border-[#1A1A1A]' : ''} ${bold ? 'bg-[#FAFAFA] dark:bg-[#171717]/50' : ''}`}>
      <span className={`text-[#6B7280] dark:text-[#737373] ${bold ? 'font-semibold text-[#4B5563] dark:text-[#A3A3A3]' : ''}`}>{label}</span>
      <div className="text-right">
        <span className={`font-mono font-bold ${valueClass || 'text-[#111111] dark:text-[#E5E5E5]'}`}>{value}</span>
        {sub && <span className="text-[#9CA3AF] dark:text-[#737373] ml-1 text-[9px]">{sub}</span>}
      </div>
    </div>
  );
}

function SimCard({ label, value, highlight, warn }: { label: string; value: string; highlight?: boolean; warn?: boolean }) {
  const border = warn
    ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
    : highlight
      ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
      : 'border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#0A0A0A]';
  const textColor = warn
    ? 'text-red-700 dark:text-red-300'
    : highlight
      ? 'text-green-700 dark:text-green-300'
      : 'text-[#111111] dark:text-white';
  return (
    <div className={`rounded-lg border-2 p-2.5 text-center transition-colors ${border}`}>
      <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373] font-medium">{label}</div>
      <div className={`text-lg font-bold mt-0.5 ${textColor}`}>{value}</div>
    </div>
  );
}

function NutritionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-2 py-1 rounded bg-[#F3F4F6] dark:bg-[#171717]">
      <span className="text-[10px] text-[#6B7280] dark:text-[#737373]">{label}</span>
      <span className="text-[10px] font-bold text-[#111111] dark:text-white">{value}</span>
    </div>
  );
}

/* ─── Image resize utility ─── */
function resizeImage(dataUri: string, maxWidth: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = dataUri;
  });
}

/* ─── Simple QR Code SVG (no external lib) ─── */
function QRCodeSVG({ value, size = 180 }: { value: string; size?: number }) {
  // Encode text into a simple QR-like pattern using a hash-based approach
  // For production, use a real QR library — this generates a visual placeholder
  // that links via the Google Charts API for an actual QR code
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&format=svg`;
  return (
    <img
      src={qrUrl}
      alt="QR Code"
      width={size}
      height={size}
      className="mx-auto"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
