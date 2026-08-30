import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { MessageCircle, X, Send, Loader2, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// Même limite que le serveur : POST /api/assistant/ask renvoie 400 au-delà.
const MAX_QUESTION_LENGTH = 1000;

// Nombre de réponses IA après lequel on propose (une seule fois) la capture email.
const EMAIL_PROMPT_AFTER_ANSWERS = 2;

type ChatRole = 'assistant' | 'user' | 'error';

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

interface AskResponse {
  answer?: string;
  provider?: string;
  error?: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Bonjour ! Posez-moi vos questions sur RestauMargin : fonctionnalités, tarif, essai gratuit…',
};

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function bubbleClasses(role: ChatRole): string {
  if (role === 'user') {
    return 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]';
  }
  if (role === 'error') {
    return 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3] border border-[#E5E7EB] dark:border-[#262626]';
  }
  return 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#111111] dark:text-white';
}

// Ton neutre. On reprend le message du serveur quand il est utile,
// sinon copie dédiée pour les cas 429 / 503.
function errorMessageFor(status: number, serverError?: string): string {
  if (status === 429) return "Un peu trop de questions d'un coup, réessayez dans une minute.";
  if (status === 503) {
    return "L'assistant est momentanément indisponible — écrivez-nous à contact@restaumargin.fr.";
  }
  return serverError || "La question n'a pas pu être envoyée. Réessayez dans un instant.";
}

export default function AssistantWidget() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [answerCount, setAnswerCount] = useState<number>(0);
  const [email, setEmail] = useState<string>('');
  const [emailDraft, setEmailDraft] = useState<string>('');
  const [emailPromptClosed, setEmailPromptClosed] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll vers le bas à chaque nouveau message.
  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, sending, open]);

  // Échap ferme le panneau.
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  // Focus sur le textarea à l'ouverture.
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => textareaRef.current?.focus(), 60);
    return () => window.clearTimeout(timer);
  }, [open]);

  async function send(): Promise<void> {
    const question = input.trim();
    if (!question || sending) return;

    setMessages((prev) => [...prev, { id: newId(), role: 'user', content: question }]);
    setInput('');
    setSending(true);

    try {
      const res = await fetch('/api/assistant/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(email ? { question, email } : { question }),
      });

      let data: AskResponse | null = null;
      try {
        data = (await res.json()) as AskResponse;
      } catch {
        data = null;
      }

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { id: newId(), role: 'error', content: errorMessageFor(res.status, data?.error) },
        ]);
      } else if (data?.answer) {
        const answer = data.answer;
        setMessages((prev) => [...prev, { id: newId(), role: 'assistant', content: answer }]);
        setAnswerCount((c) => c + 1);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: newId(), role: 'error', content: errorMessageFor(0) },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: 'error',
          content: 'Connexion impossible. Vérifiez votre réseau et réessayez.',
        },
      ]);
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    void send();
  }

  // Entrée envoie, Maj+Entrée saute une ligne.
  function handleKeyDown(e: ReactKeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  function handleEmailSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const value = emailDraft.trim();
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return;
    setEmail(value);
    setEmailDraft('');
    setMessages((prev) => [
      ...prev,
      {
        id: newId(),
        role: 'assistant',
        content: `Merci, c'est noté : ${value}. On vous répond personnellement dès que possible.`,
      },
    ]);
  }

  // Le widget cible les visiteurs à convertir. Masqué pour un compte connecté :
  // l'app connectée a déjà son assistant IA et sa bottom-nav mobile en bas d'écran.
  if (authLoading || isAuthenticated) return null;

  const showEmailPrompt =
    answerCount >= EMAIL_PROMPT_AFTER_ANSWERS && !email && !emailPromptClosed;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3 no-print">
      {open && (
        <div
          role="dialog"
          aria-label="Assistant RestauMargin"
          className="w-[calc(100vw-2rem)] sm:w-96 max-h-[70vh] flex flex-col overflow-hidden bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl shadow-xl"
        >
          {/* En-tête */}
          <div className="flex items-start justify-between gap-2 px-4 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#111111] dark:text-white truncate">
                Assistant RestauMargin
              </p>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] truncate">
                Une question sur l'outil ?
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer l'assistant"
              className="shrink-0 -mr-2 -mt-1 h-11 w-11 flex items-center justify-center rounded-xl text-[#737373] dark:text-[#A3A3A3] hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Fil de discussion */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" aria-live="polite">
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words ${bubbleClasses(m.role)}`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-[#F5F5F5] dark:bg-[#1A1A1A] px-3 py-3 flex items-center gap-1">
                  <span className="sr-only">L'assistant rédige une réponse</span>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#737373] dark:bg-[#A3A3A3] animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Capture de contact — proposée une seule fois */}
          {showEmailPrompt && (
            <form
              onSubmit={handleEmailSubmit}
              className="mx-4 mb-3 rounded-xl border border-[#E5E7EB] dark:border-[#262626] bg-[#F5F5F5] dark:bg-[#1A1A1A] p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                  Vous voulez qu'on vous réponde personnellement ? Laissez votre email.
                </p>
                <button
                  type="button"
                  onClick={() => setEmailPromptClosed(true)}
                  aria-label="Masquer la demande d'email"
                  className="shrink-0 -mt-2 -mr-2 h-11 w-11 flex items-center justify-center rounded-xl text-[#737373] dark:text-[#A3A3A3] hover:bg-white dark:hover:bg-[#262626] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="email"
                  value={emailDraft}
                  onChange={(e) => setEmailDraft(e.target.value)}
                  placeholder="vous@restaurant.fr"
                  aria-label="Votre email"
                  className="flex-1 min-w-0 h-11 px-3 text-sm rounded-lg bg-white dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] text-[#111111] dark:text-white placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
                <button
                  type="submit"
                  aria-label="Envoyer mon email"
                  className="shrink-0 h-11 px-3 flex items-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span className="hidden sm:inline">Envoyer</span>
                </button>
              </div>
            </form>
          )}

          {/* Saisie */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] p-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_QUESTION_LENGTH))}
                onKeyDown={handleKeyDown}
                rows={2}
                maxLength={MAX_QUESTION_LENGTH}
                disabled={sending}
                placeholder="Votre question…"
                aria-label="Votre question"
                className="flex-1 min-w-0 resize-none px-3 py-2.5 text-sm rounded-lg bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] text-[#111111] dark:text-white placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-teal-600 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={sending || input.trim().length === 0}
                aria-label="Envoyer la question"
                className="shrink-0 h-11 w-11 flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            {input.length > MAX_QUESTION_LENGTH - 200 && (
              <p className="mt-1 text-right text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                {input.length} / {MAX_QUESTION_LENGTH}
              </p>
            )}
          </form>
        </div>
      )}

      {/* Bouton flottant */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Fermer l'assistant RestauMargin" : "Ouvrir l'assistant RestauMargin"}
        aria-expanded={open}
        className="h-14 w-14 flex items-center justify-center rounded-2xl bg-teal-600 hover:bg-teal-500 text-white shadow-xl transition-colors"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
