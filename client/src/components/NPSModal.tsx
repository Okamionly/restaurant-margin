import { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// NPS modal — shows once per user after 14 days of first app usage.
// Deduplication via localStorage so it never re-appears on the same device.

const NPS_DELAY_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const SHOW_DELAY_MS = 3000; // 3-second buffer after page load

function getScoreColor(score: number | null): string {
  if (score === null) return 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3] border-[#E5E7EB] dark:border-[#262626]';
  if (score <= 6) return 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700';
  if (score <= 8) return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700';
  return 'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-700';
}

export default function NPSModal() {
  const { user, isAuthenticated } = useAuth();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<'score' | 'comment' | 'thanks'>('score');
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const userId = user.id;
    const shownKey = `nps_shown_${userId}`;
    const tsKey = `signup_ts_${userId}`;

    // Already shown on this device — never show again
    const alreadyShown = localStorage.getItem(shownKey);
    if (alreadyShown) return;

    // Record first-visit timestamp if not set
    const now = Date.now();
    if (!localStorage.getItem(tsKey)) {
      localStorage.setItem(tsKey, String(now));
    }

    const signupTs = parseInt(localStorage.getItem(tsKey) || String(now));
    const age = now - signupTs;

    if (age < NPS_DELAY_MS) return; // not 14 days yet

    // Show after a 3s buffer to avoid interrupting navigation
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user]);

  function dismiss() {
    if (user) localStorage.setItem(`nps_shown_${user.id}`, 'dismissed');
    setVisible(false);
  }

  async function submitScore() {
    if (score === null) return;
    setStep('comment');
  }

  async function submitFinal() {
    if (score === null) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/nps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ score, comment: comment.trim() || undefined }),
      });
    } catch {
      // Fail silently — never block the user
    } finally {
      setSubmitting(false);
      if (user) localStorage.setItem(`nps_shown_${user.id}`, 'submitted');
      setStep('thanks');
      setTimeout(() => setVisible(false), 3000);
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[calc(100vw-2rem)]">
      <div className="bg-white dark:bg-[#111111] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-semibold text-[#111111] dark:text-white">Votre avis compte</span>
          </div>
          <button onClick={dismiss} className="text-[#9CA3AF] hover:text-[#111111] dark:hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step: score */}
        {step === 'score' && (
          <div className="p-4">
            <p className="text-sm text-[#111111] dark:text-white font-medium mb-1">
              Recommanderiez-vous RestauMargin ?
            </p>
            <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mb-4">De 0 (pas du tout) a 10 (certainement)</p>

            <div className="grid grid-cols-6 gap-1.5 mb-3">
              {[0, 1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  onClick={() => setScore(s)}
                  className={`py-2 rounded-lg text-sm font-bold border transition-all ${
                    score === s
                      ? getScoreColor(s)
                      : 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3] border-[#E5E7EB] dark:border-[#262626] hover:border-teal-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-1.5 mb-4">
              {[6, 7, 8, 9, 10].map(s => (
                <button
                  key={s}
                  onClick={() => setScore(s)}
                  className={`py-2 rounded-lg text-sm font-bold border transition-all ${
                    score === s
                      ? getScoreColor(s)
                      : 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3] border-[#E5E7EB] dark:border-[#262626] hover:border-teal-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={submitScore}
              disabled={score === null}
              className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl py-2.5 text-sm font-semibold transition-colors"
            >
              Continuer
            </button>
          </div>
        )}

        {/* Step: comment */}
        {step === 'comment' && (
          <div className="p-4">
            <div className={`inline-block text-2xl font-black px-3 py-1 rounded-lg border mb-3 ${getScoreColor(score)}`}>
              {score}/10
            </div>
            <p className="text-sm font-medium text-[#111111] dark:text-white mb-1">
              {score !== null && score >= 9
                ? 'Super ! Qu\'est-ce qui vous plait le plus ?'
                : score !== null && score >= 7
                ? 'Qu\'est-ce qu\'on pourrait ameliorer ?'
                : 'Qu\'est-ce qui ne vous a pas convaincu ?'}
            </p>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Optionnel — votre retour aide vraiment..."
              rows={3}
              className="w-full bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#262626] rounded-xl px-3 py-2.5 text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-3"
            />
            <button
              onClick={submitFinal}
              disabled={submitting}
              className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors"
            >
              {submitting ? 'Envoi...' : 'Envoyer mon avis'}
            </button>
          </div>
        )}

        {/* Step: thanks */}
        {step === 'thanks' && (
          <div className="p-6 text-center">
            <div className="text-3xl mb-2">Merci !</div>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
              Votre retour nous aide a ameliorer RestauMargin chaque jour.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
