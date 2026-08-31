import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { MessageCircle, X, Send, Mail, Sparkles, ArrowDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// Meme limite que le serveur : POST /api/assistant/ask renvoie 400 au-dela.
const MAX_QUESTION_LENGTH = 1000;

// Nombre de reponses IA apres lequel on propose (une seule fois) la capture email.
const EMAIL_PROMPT_AFTER_ANSWERS = 2;

// Hauteur max du textarea (~4 lignes de 24px).
const TEXTAREA_MAX_HEIGHT = 96;

// Distance sous laquelle on considere que l'utilisateur lit le bas du fil.
const STICK_TO_BOTTOM_PX = 56;

// Questions cliquables affichees tant que le visiteur n'a rien demande.
const SUGGESTED_QUESTIONS = [
  'Combien ça coûte ?',
  'Comment ça marche pour mes fiches techniques ?',
  'Puis-je essayer gratuitement ?',
];

type ChatRole = 'assistant' | 'user' | 'error';

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  at: number;
}

interface AskResponse {
  answer?: string;
  provider?: string;
  error?: string;
}

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createWelcomeMessage(): ChatMessage {
  return {
    id: 'welcome',
    role: 'assistant',
    content:
      'Bonjour ! Posez-moi vos questions sur RestauMargin : fonctionnalités, tarif, essai gratuit…',
    at: Date.now(),
  };
}

// Horodatage court, tolerant a une date invalide.
function formatTime(at: number): string {
  try {
    return new Date(at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
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
// sinon copie dediee pour les cas 429 / 503.
function errorMessageFor(status: number, serverError?: string): string {
  if (status === 429) return "Un peu trop de questions d'un coup, réessayez dans une minute.";
  if (status === 503) {
    return "L'assistant est momentanément indisponible — écrivez-nous à contact@restaumargin.fr.";
  }
  return serverError || "La question n'a pas pu être envoyée. Réessayez dans un instant.";
}

/* -------------------------------------------------------------------------- */
/* Mini-renderer markdown maison                                              */
/*                                                                            */
/* Le contenu vient d'un LLM : il est parse en NOEUDS REACT, jamais injecte    */
/* en HTML (aucun dangerouslySetInnerHTML ici). Tout ce qui n'est pas reconnu  */
/* comme markdown ressort en texte brut, donc rien ne peut etre interprete.    */
/* -------------------------------------------------------------------------- */

const LINK_CLASS =
  'text-teal-700 dark:text-teal-400 underline underline-offset-2 decoration-teal-700/40 dark:decoration-teal-400/40 hover:decoration-teal-700 dark:hover:decoration-teal-400 break-all transition-colors';

const CODE_CLASS =
  'px-1 py-0.5 rounded bg-white dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#333333] text-[0.85em] font-mono break-words';

// Une seule passe : la premiere alternative qui matche gagne.
// L'ordre compte — code, puis **gras** avant *italique*, liens avant emails.
// Les italiques exigent un delimiteur colle au texte (`*mot*`, pas `2 * 3`).
const INLINE_SOURCE =
  '(`[^`\\n]+`)' + // 1 code
  '|(\\*\\*[^\\n]+?\\*\\*)' + // 2 gras
  '|(\\[[^\\]\\n]+\\]\\([^\\s()]+\\))' + // 3 [texte](url)
  '|(https?:\\/\\/[^\\s<>]+)' + // 4 URL nue
  '|([A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\\.[A-Za-z]{2,})' + // 5 email
  '|(\\*[^\\s*](?:[^*\\n]*[^\\s*])?\\*)' + // 6 italique *
  '|(_[^\\s_](?:[^_\\n]*[^\\s_])?_)'; // 7 italique _

// `_` colle a un mot = snake_case, pas de l'italique.
function isWordChar(char: string | undefined): boolean {
  return char !== undefined && /[A-Za-z0-9_]/.test(char);
}

// Seuls http(s) et mailto sont acceptes : aucun javascript: ne peut passer.
function safeHref(url: string): string | null {
  const value = url.trim();
  if (/^https?:\/\//i.test(value)) return value;
  if (/^mailto:/i.test(value)) return value;
  return null;
}

function externalLink(href: string, label: ReactNode, key: string): ReactNode {
  return (
    <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
      {label}
    </a>
  );
}

// Transforme une ligne de texte en noeuds React (gras, italique, code, liens).
function renderInline(text: string, keyPrefix: string, depth = 0): ReactNode[] {
  if (depth > 2 || !text) return [text];

  const nodes: ReactNode[] = [];
  const re = new RegExp(INLINE_SOURCE, 'g');
  let cursor = 0;
  let index = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    const [full, code, bold, mdLink, bareUrl, mailAddr, emStar, emUnderscore] = match;
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    const key = `${keyPrefix}-i${index++}`;

    if (code) {
      nodes.push(
        <code key={key} className={CODE_CLASS}>
          {code.slice(1, -1)}
        </code>,
      );
    } else if (bold) {
      nodes.push(
        <strong key={key} className="font-semibold">
          {renderInline(bold.slice(2, -2), key, depth + 1)}
        </strong>,
      );
    } else if (mdLink) {
      const close = mdLink.indexOf('](');
      const label = mdLink.slice(1, close);
      const href = safeHref(mdLink.slice(close + 2, -1));
      nodes.push(href ? externalLink(href, label, key) : label);
    } else if (bareUrl) {
      // La ponctuation finale ne fait pas partie de l'URL.
      const clean = bareUrl.replace(/[.,;:!?)\]]+$/, '');
      const href = safeHref(clean);
      nodes.push(href ? externalLink(href, clean, key) : clean);
      if (clean.length < bareUrl.length) nodes.push(bareUrl.slice(clean.length));
    } else if (mailAddr) {
      nodes.push(
        <a key={key} href={`mailto:${mailAddr}`} className={LINK_CLASS}>
          {mailAddr}
        </a>,
      );
    } else if (emStar || emUnderscore) {
      const raw = (emStar || emUnderscore) as string;
      if (emUnderscore && isWordChar(text[match.index - 1])) {
        nodes.push(raw); // snake_case_ici : on laisse le texte intact
      } else {
        nodes.push(
          <em key={key} className="italic">
            {renderInline(raw.slice(1, -1), key, depth + 1)}
          </em>,
        );
      }
    }

    cursor = match.index + full.length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

type Block =
  | { kind: 'heading'; level: number; text: string }
  | { kind: 'list'; ordered: boolean; items: string[] }
  | { kind: 'para'; lines: string[] };

// Decoupe le markdown en blocs : titres, listes, paragraphes.
function parseBlocks(content: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  function flushPara(): void {
    if (para.length > 0) {
      blocks.push({ kind: 'para', lines: para });
      para = [];
    }
  }

  function flushList(): void {
    if (list && list.items.length > 0) {
      blocks.push({ kind: 'list', ordered: list.ordered, items: list.items });
    }
    list = null;
  }

  function pushItem(ordered: boolean, item: string): void {
    flushPara();
    if (!list || list.ordered !== ordered) {
      flushList();
      list = { ordered, items: [] };
    }
    list.items.push(item);
  }

  for (const raw of content.replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trimEnd();

    if (line.trim().length === 0) {
      flushPara();
      flushList();
      continue;
    }

    const heading = /^(#{1,4})\s+(.+)$/.exec(line);
    if (heading) {
      flushPara();
      flushList();
      blocks.push({ kind: 'heading', level: heading[1].length, text: heading[2] });
      continue;
    }

    // Puce : le tiret / asterisque doit etre suivi d'un espace, ce qui evite
    // de confondre une liste avec un "**gras**" en debut de ligne.
    const bullet = /^\s{0,4}[-*•]\s+(.+)$/.exec(line);
    if (bullet) {
      pushItem(false, bullet[1]);
      continue;
    }

    const numbered = /^\s{0,4}\d{1,2}[.)]\s+(.+)$/.exec(line);
    if (numbered) {
      pushItem(true, numbered[1]);
      continue;
    }

    flushList();
    para.push(line);
  }

  flushPara();
  flushList();
  return blocks;
}

// Paragraphe : les sauts de ligne simples sont conserves.
function renderParagraph(lines: string[], key: string): ReactNode {
  return (
    <p key={key} className="break-words">
      {lines.map((line, i) => (
        <span key={`${key}-l${i}`}>
          {i > 0 && <br />}
          {renderInline(line, `${key}-l${i}`)}
        </span>
      ))}
    </p>
  );
}

function renderBlock(block: Block, key: string): ReactNode {
  if (block.kind === 'heading') {
    // Pas de vrai h1 dans une bulle de chat : du gras un peu plus grand suffit.
    const size = block.level <= 2 ? 'text-[15px]' : 'text-sm';
    return (
      <p key={key} className={`${size} font-semibold break-words`}>
        {renderInline(block.text, key)}
      </p>
    );
  }

  if (block.kind === 'list') {
    const items = block.items.map((item, i) => (
      <li key={`${key}-it${i}`} className="break-words">
        {renderInline(item, `${key}-it${i}`)}
      </li>
    ));
    return block.ordered ? (
      <ol
        key={key}
        className="list-decimal pl-5 space-y-1 marker:text-[#737373] dark:marker:text-[#A3A3A3]"
      >
        {items}
      </ol>
    ) : (
      <ul key={key} className="list-disc pl-4 space-y-1 marker:text-[#A3A3A3]">
        {items}
      </ul>
    );
  }

  return renderParagraph(block.lines, key);
}

// Rendu markdown leger. Contenu mal forme : on retombe sur du texte brut.
function RichText({ content }: { content: string }): ReactNode {
  try {
    const blocks = parseBlocks(content);
    if (blocks.length === 0) {
      return <span className="whitespace-pre-wrap break-words">{content}</span>;
    }
    return <div className="space-y-2">{blocks.map((b, i) => renderBlock(b, `b${i}`))}</div>;
  } catch {
    return <span className="whitespace-pre-wrap break-words">{content}</span>;
  }
}

/* -------------------------------------------------------------------------- */
/* Petits elements de presentation                                            */
/* -------------------------------------------------------------------------- */

function AssistantAvatar(): ReactNode {
  return (
    <div
      aria-hidden="true"
      className="shrink-0 mt-0.5 h-7 w-7 flex items-center justify-center rounded-full bg-teal-600/10 dark:bg-teal-500/15 text-teal-700 dark:text-teal-400 border border-teal-600/20 dark:border-teal-500/25"
    >
      <Sparkles className="w-3.5 h-3.5" />
    </div>
  );
}

function TypingBubble(): ReactNode {
  return (
    <div className="flex gap-2 justify-start">
      <AssistantAvatar />
      <div className="rounded-2xl rounded-bl-md bg-[#F5F5F5] dark:bg-[#1A1A1A] px-3.5 py-3 flex items-center gap-1">
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
  );
}

/* -------------------------------------------------------------------------- */

export default function AssistantWidget() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [createWelcomeMessage()]);
  const [input, setInput] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [answerCount, setAnswerCount] = useState<number>(0);
  const [email, setEmail] = useState<string>('');
  const [emailDraft, setEmailDraft] = useState<string>('');
  const [emailPromptClosed, setEmailPromptClosed] = useState<boolean>(false);
  const [atBottom, setAtBottom] = useState<boolean>(true);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  // Miroir de `atBottom` : evite de relancer l'effet de scroll a chaque molette.
  const atBottomRef = useRef<boolean>(true);

  function scrollToBottom(behavior: ScrollBehavior = 'smooth'): void {
    bottomRef.current?.scrollIntoView({ behavior, block: 'end' });
  }

  // On ne force le scroll que si l'utilisateur lisait deja le bas du fil.
  function handleListScroll(): void {
    const el = listRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    const next = distance <= STICK_TO_BOTTOM_PX;
    atBottomRef.current = next;
    setAtBottom((prev) => (prev === next ? prev : next));
  }

  useEffect(() => {
    if (!open) return;
    if (!atBottomRef.current) return;
    scrollToBottom();
  }, [messages, sending, open]);

  // Echap ferme le panneau.
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  // Focus sur le textarea a l'ouverture + retour en bas du fil.
  useEffect(() => {
    if (!open) return;
    atBottomRef.current = true;
    setAtBottom(true);
    const timer = window.setTimeout(() => {
      textareaRef.current?.focus();
      scrollToBottom('auto');
    }, 60);
    return () => window.clearTimeout(timer);
  }, [open]);

  // Textarea qui grandit avec le texte, plafonne a ~4 lignes.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
  }, [input, open]);

  async function send(preset?: string): Promise<void> {
    const question = (preset ?? input).trim();
    if (!question || sending) return;

    // Envoyer, c'est vouloir voir la reponse : on recolle au bas du fil.
    atBottomRef.current = true;
    setAtBottom(true);

    setMessages((prev) => [
      ...prev,
      { id: newId(), role: 'user', content: question, at: Date.now() },
    ]);
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
          {
            id: newId(),
            role: 'error',
            content: errorMessageFor(res.status, data?.error),
            at: Date.now(),
          },
        ]);
      } else if (data?.answer) {
        const answer = data.answer;
        setMessages((prev) => [
          ...prev,
          { id: newId(), role: 'assistant', content: answer, at: Date.now() },
        ]);
        setAnswerCount((c) => c + 1);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: newId(), role: 'error', content: errorMessageFor(0), at: Date.now() },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: 'error',
          content: 'Connexion impossible. Vérifiez votre réseau et réessayez.',
          at: Date.now(),
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

  // Entree envoie, Maj+Entree saute une ligne.
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
        at: Date.now(),
      },
    ]);
  }

  // Le widget cible les visiteurs a convertir. Masque pour un compte connecte :
  // l'app connectee a deja son assistant IA et sa bottom-nav mobile en bas d'ecran.
  if (authLoading || isAuthenticated) return null;

  const showEmailPrompt =
    answerCount >= EMAIL_PROMPT_AFTER_ANSWERS && !email && !emailPromptClosed;

  // Suggestions tant que le visiteur n'a pose aucune question.
  const showSuggestions = messages.length === 1 && !sending;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3 no-print">
      {open && (
        <div
          role="dialog"
          aria-label="Assistant RestauMargin"
          className="w-[calc(100vw-2rem)] sm:w-[24rem] max-h-[75vh] sm:max-h-[32rem] flex flex-col overflow-hidden bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl shadow-xl"
        >
          {/* En-tete */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
            <div
              aria-hidden="true"
              className="shrink-0 h-9 w-9 flex items-center justify-center rounded-xl bg-teal-600 text-white"
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#111111] dark:text-white truncate">
                Assistant RestauMargin
              </p>
              <p className="flex items-center gap-1.5 text-xs text-[#737373] dark:text-[#A3A3A3]">
                <span
                  aria-hidden="true"
                  className="shrink-0 h-1.5 w-1.5 rounded-full bg-emerald-500"
                />
                <span className="truncate">En ligne · réponse immédiate</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer l'assistant"
              className="shrink-0 -mr-2 h-11 w-11 flex items-center justify-center rounded-xl text-[#111111] dark:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Fil de discussion */}
          <div className="relative flex-1 min-h-0 flex flex-col">
            <div
              ref={listRef}
              onScroll={handleListScroll}
              className="flex-1 overflow-y-auto overscroll-contain px-3 sm:px-4 py-4 space-y-4"
              aria-live="polite"
            >
              {messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <div
                    key={m.id}
                    className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && <AssistantAvatar />}
                    <div
                      className={`min-w-0 max-w-[85%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`rounded-2xl ${isUser ? 'rounded-br-md' : 'rounded-bl-md'} px-3.5 py-2.5 text-sm leading-6 break-words ${bubbleClasses(m.role)}`}
                      >
                        {isUser ? (
                          <span className="whitespace-pre-wrap break-words">{m.content}</span>
                        ) : (
                          <RichText content={m.content} />
                        )}
                      </div>
                      <span className="mt-1 px-1 text-[11px] tabular-nums text-[#737373] dark:text-[#A3A3A3]">
                        {formatTime(m.at)}
                      </span>
                    </div>
                  </div>
                );
              })}

              {showSuggestions && (
                <div className="pl-9 space-y-1.5">
                  <p className="text-[11px] uppercase tracking-wide text-[#737373] dark:text-[#A3A3A3]">
                    Questions fréquentes
                  </p>
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => void send(q)}
                      className="block w-full text-left px-3 py-2 text-sm rounded-xl border border-[#E5E7EB] dark:border-[#262626] bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white hover:border-teal-600 dark:hover:border-teal-500 hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {sending && <TypingBubble />}

              <div ref={bottomRef} />
            </div>

            {!atBottom && (
              <button
                type="button"
                onClick={() => {
                  atBottomRef.current = true;
                  setAtBottom(true);
                  scrollToBottom();
                }}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 h-8 px-3 rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-medium shadow-lg transition-colors"
              >
                <ArrowDown className="w-3.5 h-3.5" />
                Nouveaux messages
              </button>
            )}
          </div>

          {/* Capture de contact — proposee une seule fois */}
          {showEmailPrompt && (
            <form
              onSubmit={handleEmailSubmit}
              className="mx-3 sm:mx-4 mb-3 rounded-xl border border-[#E5E7EB] dark:border-[#262626] bg-[#F5F5F5] dark:bg-[#1A1A1A] p-3"
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
                rows={1}
                maxLength={MAX_QUESTION_LENGTH}
                disabled={sending}
                placeholder="Votre question…"
                aria-label="Votre question"
                className="flex-1 min-w-0 resize-none overflow-y-auto px-3 py-2.5 text-sm leading-6 rounded-xl bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] text-[#111111] dark:text-white placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-teal-600 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={sending || input.trim().length === 0}
                aria-label="Envoyer la question"
                className="shrink-0 h-11 w-11 flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-2 px-1">
              <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] truncate">
                Entrée pour envoyer · Maj+Entrée pour aller à la ligne
              </p>
              {input.length > MAX_QUESTION_LENGTH - 200 && (
                <p className="shrink-0 text-[11px] tabular-nums text-[#737373] dark:text-[#A3A3A3]">
                  {input.length} / {MAX_QUESTION_LENGTH}
                </p>
              )}
            </div>
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
