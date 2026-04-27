/**
 * NPSModal — Net Promoter Score in-app survey
 *
 * Triggers 14 days after signup (localStorage dedup: shown once per user).
 * Score 0-10 + optional comment saved to /api/nps endpoint.
 *
 * Usage: mount once in the authenticated layout (App.tsx).
 * The component handles its own visibility logic.
 */

import { useState, useEffect } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getToken } from '../services/api';

// Days after signup before showing NPS survey
const NPS_TRIGGER_DAYS = 14;
// LocalStorage key per user: nps_shown_{userId}
const npsKey = (userId: number) => `nps_shown_${userId}`;

type Step = 'score' | 'comment' | 'thanks';

const SCORE_LABELS: Record<number, string> = {
  0: 'Pas du tout',
  1: 'Très peu',
  2: 'Peu probable',
  3: 'Peu probable',
  4: 'Peu probable',
  5: 'Neutre',
  6: 'Neutre',
  7: 'Probable',
  8: 'Probable',
  9: 'Très probable',
  10: 'Absolument !',
};

function getScoreColor(score: number): string {
  if (score <= 6) return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400';
  if (score <= 8) return 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400';
  return 'bg-teal-100 dark:bg-teal-900/30 border-teal-400 dark:border-teal-600 text-teal-700 dark:text-teal-400';
}

function getScoreActiveColor(score: number): string {
  if (score <= 6) return 'bg-red-500 border-red-500 text-white';
  if (score <= 8) return 'bg-amber-500 border-amber-500 text-white';
  return 'bg-teal-500 border-teal-500 text-white';
}

export default function NPSModal() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>('score');
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.id || !user.createdAt) return;

    // Dedup: only show once per user
    const alreadyShown = localStorage.getItem(npsKey(user.id));
    if (alreadyShown) return;

    const signupDate = new Date(user.createdAt);
    const daysSince = (Date.now() - signupDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSince >= NPS_TRIGGER_DAYS) {
      // Small delay to not appear right at page load
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const dismiss = () => {
    if (user?.id) localStorage.setItem(npsKey(user.id), 'dismissed');
    setVisible(false);
  };

  const handleScoreSelect = (value: number) => {
    setScore(value);
    setStep('comment');
  };

  const handleSubmit = async () => {
    if (score === null) return;
    setSubmitting(true);

    try {
      const token = getToken();
      await fetch('/api/nps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ score, comment: comment.trim() || null }),
      });
    } catch {
      // Silent fail — NPS should never block the user
    } finally {
      setSubmitting(false);
      if (user?.id) localStorage.setItem(npsKey(user.id), 'submitted');
      setStep('thanks');
      setTimeout(() => setVisible(false), 3000);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm">
      <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 p-5 animate-slide-up">

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4">
            {step === 'score' && (
              <>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400 mb-1">
                  Votre avis compte
                </p>
                <p className="text-sm font-semibold text-[#111111] dark:text-white leading-snug">
                  Recommanderiez-vous RestauMargin a un collegue restaurateur ?
                </p>
              </>
            )}
            {step === 'comment' && (
              <>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400 mb-1">
                  Merci pour votre note !
                </p>
                <p className="text-sm font-semibold text-[#111111] dark:text-white leading-snug">
                  {score !== null && score >= 9
                    ? "Qu'est-ce qui vous a le plus aide ?"
                    : score !== null && score >= 7
                    ? 'Que pourrait-on ameliorer pour vous ?'
                    : "Qu'est-ce qui n'a pas repondu a vos attentes ?"}
                </p>
              </>
            )}
            {step === 'thanks' && (
              <p className="text-sm font-semibold text-[#111111] dark:text-white">
                Merci pour votre retour !
              </p>
            )}
          </div>
          <button
            onClick={dismiss}
            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#111111] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step: score */}
        {step === 'score' && (
          <div>
            <div className="flex items-center justify-between text-[10px] text-[#9CA3AF] dark:text-[#737373] mb-2">
              <span>Pas du tout</span>
              <span>Absolument !</span>
            </div>
            <div className="grid grid-cols-11 gap-1">
              {Array.from({ length: 11 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handleScoreSelect(i)}
                  className={`aspect-square rounded-lg text-xs font-semibold border transition-all duration-150 hover:scale-110 ${
                    score === i
                      ? getScoreActiveColor(i)
                      : `${getScoreColor(i)} hover:border-current`
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
            {score !== null && (
              <p className="text-center text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-2">
                {SCORE_LABELS[score]}
              </p>
            )}
          </div>
        )}

        {/* Step: comment */}
        {step === 'comment' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F9FAFB] dark:bg-[#111111]">
              <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Votre note :</span>
              <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${score !== null ? getScoreActiveColor(score) : ''}`}>
                {score}/10
              </span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Votre commentaire (optionnel)..."
              rows={3}
              className="w-full text-sm px-3 py-2.5 rounded-xl bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#737373] resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400 transition-all"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setStep('score')}
                className="flex-1 py-2 text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] border border-[#E5E7EB] dark:border-[#333333] rounded-xl hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
              >
                Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-2 text-xs font-semibold bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-xl hover:bg-[#333333] dark:hover:bg-[#E5E7EB] transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {submitting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Envoyer
              </button>
            </div>
          </div>
        )}

        {/* Step: thanks */}
        {step === 'thanks' && (
          <div className="flex items-center gap-3 py-1">
            <CheckCircle className="w-8 h-8 text-teal-500 flex-shrink-0" />
            <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
              Votre avis nous aide a ameliorer RestauMargin chaque semaine.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
