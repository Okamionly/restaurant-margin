import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Send, Check, Loader2, ChefHat, AlertTriangle } from 'lucide-react';

const API = '';

export default function PublicFeedback() {
  const { id } = useParams<{ id: string }>();
  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Form
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`${API}/api/feedback/restaurant/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(data => {
        setRestaurantName(data.name);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError('Veuillez selectionner une note');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: Number(id),
          rating,
          comment: comment.trim() || null,
          source: 'public',
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur');
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-mono-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-mono-100 dark:text-white" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-white dark:bg-mono-50 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-[#D1D5DB] dark:text-mono-350 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-mono-100 dark:text-white mb-2">Restaurant introuvable</h1>
          <p className="text-sm text-[#6B7280] dark:text-mono-700">
            Ce lien ne correspond a aucun restaurant.
          </p>
        </div>
      </div>
    );
  }

  // Thank you screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-mono-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-mono-100 dark:bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white dark:text-mono-100" />
          </div>
          <h1 className="text-2xl font-bold text-mono-100 dark:text-white font-satoshi mb-3">
            Merci pour votre avis !
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-mono-700 leading-relaxed mb-6">
            Votre retour est precieux et nous aide a ameliorer nos services chez <span className="font-semibold text-mono-100 dark:text-white">{restaurantName}</span>.
          </p>
          <div className="flex items-center justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Star
                key={i}
                className={`w-8 h-8 ${i <= rating ? 'fill-mono-100 dark:fill-white text-mono-100 dark:text-white' : 'text-[#D1D5DB] dark:text-mono-350'}`}
              />
            ))}
          </div>
          <p className="text-xs text-[#9CA3AF] dark:text-mono-500">
            Propulse par RestauMargin
          </p>
        </div>
      </div>
    );
  }

  // Feedback form
  return (
    <div className="min-h-screen bg-white dark:bg-mono-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Restaurant branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-mono-100 dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-white dark:text-mono-100" />
          </div>
          <h1 className="text-2xl font-bold text-mono-100 dark:text-white font-satoshi mb-1">
            {restaurantName}
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-mono-700">
            Votre avis compte pour nous
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star rating */}
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-mono-100 dark:text-white mb-4">
              Comment evaluez-vous votre experience ?
            </p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i)}
                  onMouseEnter={() => setHoveredRating(i)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      i <= (hoveredRating || rating)
                        ? 'fill-mono-100 dark:fill-white text-mono-100 dark:text-white'
                        : 'text-[#D1D5DB] dark:text-mono-350 hover:text-[#9CA3AF] dark:hover:text-mono-500'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs text-[#6B7280] dark:text-mono-700 mt-2">
                {rating === 1 && 'Tres insatisfait'}
                {rating === 2 && 'Insatisfait'}
                {rating === 3 && 'Correct'}
                {rating === 4 && 'Satisfait'}
                {rating === 5 && 'Tres satisfait'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-mono-100 dark:text-white mb-2">
              Un commentaire ? <span className="text-[#9CA3AF] dark:text-mono-500 font-normal">(optionnel)</span>
            </label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Dites-nous ce qui vous a plu ou ce que nous pouvons ameliorer..."
              rows={4}
              maxLength={2000}
              className="w-full px-4 py-3 bg-mono-950 dark:bg-[#171717] border border-mono-900 dark:border-mono-300 rounded-xl text-sm text-mono-100 dark:text-white placeholder-[#9CA3AF] dark:placeholder-mono-500 resize-none focus:outline-none focus:ring-2 focus:ring-mono-100 dark:focus:ring-white"
            />
            <div className="flex justify-end mt-1">
              <span className="text-[10px] text-[#9CA3AF] dark:text-mono-500">
                {comment.length}/2000
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-mono-100 dark:bg-white text-white dark:text-mono-100 rounded-xl text-sm font-semibold hover:bg-[#333333] dark:hover:bg-mono-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {submitting ? 'Envoi en cours...' : 'Envoyer mon avis'}
          </button>
        </form>

        {/* Powered by */}
        <p className="text-center text-[10px] text-[#9CA3AF] dark:text-mono-500 mt-8">
          Propulse par RestauMargin
        </p>
      </div>
    </div>
  );
}
