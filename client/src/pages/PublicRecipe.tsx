import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, ChefHat, Users, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { fetchPublicRecipe } from '../services/api';

const CATEGORY_EMOJI: Record<string, string> = {
  'Viandes': '\u{1F969}',
  'Poissons & Fruits de mer': '\u{1F41F}',
  'L\u00e9gumes': '\u{1F96C}',
  'Fruits': '\u{1F34E}',
  'Produits laitiers': '\u{1F9C0}',
  '\u00c9pices & Condiments': '\u{1F336}\uFE0F',
  'F\u00e9culents & C\u00e9r\u00e9ales': '\u{1F33E}',
  'F\u00e9culents': '\u{1F33E}',
  'Huiles & Mati\u00e8res grasses': '\u{1FAD2}',
  'Boissons': '\u{1F377}',
  'Boulangerie': '\u{1F35E}',
  'Surgel\u00e9s': '\u2744\uFE0F',
  'Autres': '\u{1F4E6}',
};

interface PublicRecipeData {
  name: string;
  category: string;
  description: string | null;
  nbPortions: number;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  photos: string[];
  restaurantName: string;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
    category: string;
  }[];
}

export default function PublicRecipe() {
  const { token } = useParams();
  const [recipe, setRecipe] = useState<PublicRecipeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    if (!token) { setError(true); setLoading(false); return; }
    fetchPublicRecipe(token)
      .then(setRecipe)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-mono-100" />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <ChefHat className="w-16 h-16 text-[#D1D5DB] mb-4" />
        <h1 className="text-2xl font-bold text-mono-100 mb-2">Recette introuvable</h1>
        <p className="text-[#9CA3AF] text-center max-w-md">
          Ce lien ne correspond a aucune recette ou a ete desactive.
        </p>
      </div>
    );
  }

  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);
  const hasPhotos = recipe.photos.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Hero / Photo ─── */}
      {hasPhotos ? (
        <div className="relative w-full max-w-3xl mx-auto">
          <div className="aspect-[16/9] bg-mono-950">
            <img
              src={recipe.photos[photoIndex]}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          </div>
          {recipe.photos.length > 1 && (
            <>
              <button
                onClick={() => setPhotoIndex((photoIndex - 1 + recipe.photos.length) % recipe.photos.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setPhotoIndex((photoIndex + 1) % recipe.photos.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {recipe.photos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPhotoIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${idx === photoIndex ? 'bg-white' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto bg-mono-950 flex items-center justify-center py-16">
          <ChefHat className="w-16 h-16 text-[#D1D5DB]" />
        </div>
      )}

      {/* ─── Content ─── */}
      <div className="max-w-3xl mx-auto px-5 py-8">
        {/* Restaurant branding */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-mono-100 flex items-center justify-center text-white text-sm font-bold">
            {recipe.restaurantName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-bold text-mono-100">{recipe.restaurantName}</div>
            <div className="text-xs text-[#9CA3AF]">Fiche recette</div>
          </div>
        </div>

        {/* Title + meta */}
        <h1 className="text-3xl font-black text-mono-100 leading-tight mb-3">{recipe.name}</h1>
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <span className="inline-flex items-center gap-1 text-sm font-medium bg-mono-950 text-[#6B7280] px-3 py-1 rounded-full">
            {CATEGORY_EMOJI[recipe.category] || '\u{1F4E6}'} {recipe.category}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-[#9CA3AF]">
            <Users className="w-4 h-4" /> {recipe.nbPortions} portion{recipe.nbPortions > 1 ? 's' : ''}
          </span>
          {totalTime > 0 && (
            <span className="inline-flex items-center gap-1 text-sm text-[#9CA3AF]">
              <Clock className="w-4 h-4" /> {totalTime} min
            </span>
          )}
        </div>

        {/* Description */}
        {recipe.description && (
          <p className="text-[#6B7280] leading-relaxed mb-8 text-base">{recipe.description}</p>
        )}

        {/* Timing breakdown */}
        {totalTime > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            {recipe.prepTimeMinutes && recipe.prepTimeMinutes > 0 && (
              <div className="text-center py-3 rounded-xl border border-mono-900">
                <div className="text-xs text-[#9CA3AF] uppercase font-semibold mb-1">Preparation</div>
                <div className="text-xl font-black text-mono-100">{recipe.prepTimeMinutes}<span className="text-sm font-normal ml-0.5">min</span></div>
              </div>
            )}
            {recipe.cookTimeMinutes && recipe.cookTimeMinutes > 0 && (
              <div className="text-center py-3 rounded-xl border border-mono-900">
                <div className="text-xs text-[#9CA3AF] uppercase font-semibold mb-1">Cuisson</div>
                <div className="text-xl font-black text-mono-100">{recipe.cookTimeMinutes}<span className="text-sm font-normal ml-0.5">min</span></div>
              </div>
            )}
            <div className="text-center py-3 rounded-xl bg-mono-100 text-white">
              <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Total</div>
              <div className="text-xl font-black">{totalTime}<span className="text-sm font-normal ml-0.5">min</span></div>
            </div>
          </div>
        )}

        {/* ─── Ingredients ─── */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-mono-100 text-white flex items-center justify-center text-sm font-bold">1</span>
            Ingredients
          </h2>
          <div className="space-y-0">
            {recipe.ingredients.map((ing, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between py-3 px-4 ${idx !== recipe.ingredients.length - 1 ? 'border-b border-mono-950' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{CATEGORY_EMOJI[ing.category] || '\u{1F4E6}'}</span>
                  <span className="text-mono-100 font-medium">{ing.name}</span>
                </div>
                <span className="text-[#9CA3AF] font-mono text-sm">
                  {ing.quantity} {ing.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Preparation Steps placeholder ─── */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-mono-100 text-white flex items-center justify-center text-sm font-bold">2</span>
            Preparation
          </h2>
          {recipe.description ? (
            <div className="bg-mono-1000 rounded-xl p-5 text-[#6B7280] leading-relaxed whitespace-pre-line">
              {recipe.description}
            </div>
          ) : (
            <p className="text-[#9CA3AF] italic">Instructions de preparation non disponibles.</p>
          )}
        </div>

        {/* ─── Divider ─── */}
        <div className="border-t border-mono-900 pt-8">
          {/* CTA */}
          <div className="text-center">
            <p className="text-xs text-[#D1D5DB] uppercase tracking-widest font-semibold mb-2">Powered by</p>
            <Link to="/" className="inline-flex items-center gap-2 group">
              <ChefHat className="w-5 h-5 text-mono-100" />
              <span className="text-lg font-black text-mono-100 group-hover:text-teal-600 transition-colors">RestauMargin</span>
            </Link>
            <p className="text-sm text-[#9CA3AF] mt-2 max-w-sm mx-auto">
              Calculez vos marges, optimisez vos recettes et gerez votre restaurant.
            </p>
            <Link
              to="/landing"
              className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-xl bg-mono-100 text-white text-sm font-semibold hover:bg-[#333333] transition-colors"
            >
              Decouvrir RestauMargin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
