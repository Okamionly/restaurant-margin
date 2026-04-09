import { useState, useEffect, useRef, useCallback } from 'react';
import {
  HelpCircle, X, PlayCircle, MessageCircle, Keyboard, ChevronRight,
  BookOpen, Mail, ExternalLink, ChevronDown,
} from 'lucide-react';

// ── FAQ items ────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    question: 'Comment ajouter un ingredient ?',
    answer: 'Allez dans la page Ingredients, cliquez sur "Ajouter" et remplissez le formulaire. L\'IA peut suggerer les prix du marche.',
  },
  {
    question: 'Comment calculer ma marge ?',
    answer: 'Creez une fiche technique (recette) avec vos ingredients et un prix de vente. La marge se calcule automatiquement.',
  },
  {
    question: 'Comment scanner une facture ?',
    answer: 'Rendez-vous sur la page Factures, prenez une photo ou importez un PDF. L\'IA extrait les prix automatiquement.',
  },
  {
    question: 'Comment exporter mes fiches techniques ?',
    answer: 'Sur la page d\'une recette, cliquez sur l\'icone d\'impression ou export PDF pour generer une fiche technique professionnelle.',
  },
  {
    question: 'Comment fonctionne l\'inventaire ?',
    answer: 'Allez dans Inventaire, ajoutez vos stocks actuels. Les alertes de stock bas se declenchent automatiquement selon vos seuils.',
  },
];

// ── Video tutorials (placeholders) ───────────────────────────────────────────
const VIDEOS = [
  { title: 'Demarrer avec RestauMargin', duration: '3 min', url: '#' },
  { title: 'Creer votre premiere recette', duration: '2 min', url: '#' },
  { title: 'Scanner vos factures', duration: '2 min', url: '#' },
  { title: 'Optimiser vos marges avec l\'IA', duration: '4 min', url: '#' },
];

// ── Keyboard shortcuts ──────────────────────────────────────────────────────
const SHORTCUTS = [
  { keys: ['Ctrl', 'K'], description: 'Recherche rapide' },
  { keys: ['?'], description: 'Raccourcis clavier' },
  { keys: ['G', 'D'], description: 'Dashboard' },
  { keys: ['G', 'R'], description: 'Recettes' },
  { keys: ['G', 'I'], description: 'Ingredients' },
  { keys: ['G', 'F'], description: 'Fournisseurs' },
  { keys: ['N'], description: 'Nouveau (page active)' },
  { keys: ['ESC'], description: 'Fermer modal' },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function HelpButton() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'videos' | 'faq' | 'shortcuts' | 'contact'>('faq');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const openCrisp = useCallback(() => {
    // Open Crisp chat if available
    if ((window as any).$crisp) {
      (window as any).$crisp.push(['do', 'chat:open']);
    } else {
      window.open('mailto:support@restaumargin.fr', '_blank');
    }
  }, []);

  const tabs = [
    { id: 'faq' as const, label: 'FAQ', icon: BookOpen },
    { id: 'videos' as const, label: 'Videos', icon: PlayCircle },
    { id: 'shortcuts' as const, label: 'Raccourcis', icon: Keyboard },
    { id: 'contact' as const, label: 'Contact', icon: MessageCircle },
  ];

  return (
    <div ref={panelRef} className="relative no-print">
      {/* Help panel */}
      {open && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white dark:bg-[#0A0A0A] rounded-2xl shadow-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden animate-help-panel-in">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
            <h3 className="text-base font-bold text-[#111111] dark:text-white font-satoshi">
              Besoin d'aide ?
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center gap-1 px-2 py-2.5 text-center transition-colors ${
                    activeTab === tab.id
                      ? 'text-[#111111] dark:text-white border-b-2 border-[#111111] dark:border-white -mb-[1px]'
                      : 'text-[#9CA3AF] dark:text-[#737373] hover:text-[#6B7280] dark:hover:text-[#A3A3A3]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="max-h-[360px] overflow-y-auto">
            {/* FAQ */}
            {activeTab === 'faq' && (
              <div className="divide-y divide-[#F3F4F6] dark:divide-[#1A1A1A]">
                {FAQ_ITEMS.map((item, i) => (
                  <div key={i}>
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-[#F9FAFB] dark:hover:bg-[#171717] transition-colors"
                    >
                      <span className="text-sm font-medium text-[#111111] dark:text-white pr-4">{item.question}</span>
                      <ChevronDown className={`w-4 h-4 text-[#9CA3AF] dark:text-[#737373] flex-shrink-0 transition-transform ${
                        expandedFaq === i ? 'rotate-180' : ''
                      }`} />
                    </button>
                    {expandedFaq === i && (
                      <div className="px-5 pb-3">
                        <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Videos */}
            {activeTab === 'videos' && (
              <div className="p-4 space-y-2">
                {VIDEOS.map((video, i) => (
                  <a
                    key={i}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#F9FAFB] dark:hover:bg-[#171717] transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] dark:bg-[#171717] flex items-center justify-center flex-shrink-0 group-hover:bg-[#111111] dark:group-hover:bg-white transition-colors">
                      <PlayCircle className="w-5 h-5 text-[#6B7280] dark:text-[#A3A3A3] group-hover:text-white dark:group-hover:text-[#111111] transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#111111] dark:text-white">{video.title}</div>
                      <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">{video.duration}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#D1D5DB] dark:text-[#555555] group-hover:text-[#111111] dark:group-hover:text-white transition-colors" />
                  </a>
                ))}
                <p className="text-xs text-[#9CA3AF] dark:text-[#737373] text-center pt-2">
                  Plus de tutoriels a venir...
                </p>
              </div>
            )}

            {/* Keyboard shortcuts */}
            {activeTab === 'shortcuts' && (
              <div className="p-4 space-y-2">
                {SHORTCUTS.map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, j) => (
                        <span key={j}>
                          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium bg-[#F3F4F6] dark:bg-[#171717] border border-[#D1D5DB] dark:border-[#333333] rounded text-[#111111] dark:text-white">
                            {key}
                          </kbd>
                          {j < shortcut.keys.length - 1 && (
                            <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373] mx-0.5">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Contact */}
            {activeTab === 'contact' && (
              <div className="p-5 space-y-4">
                <button
                  onClick={openCrisp}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#F9FAFB] dark:hover:bg-[#171717] transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#111111] dark:bg-white flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-white dark:text-[#111111]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#111111] dark:text-white">Chat en direct</div>
                    <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">Reponse en moins de 5 minutes</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#D1D5DB] dark:text-[#555555]" />
                </button>

                <a
                  href="mailto:support@restaumargin.fr"
                  className="w-full flex items-center gap-3 p-4 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#F9FAFB] dark:hover:bg-[#171717] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] dark:bg-[#171717] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#6B7280] dark:text-[#A3A3A3]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#111111] dark:text-white">Email</div>
                    <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">support@restaumargin.fr</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#D1D5DB] dark:text-[#555555]" />
                </a>

                <div className="text-center pt-2">
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                    Nous sommes la pour vous aider du lundi au samedi, 9h-18h
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={`group flex items-center gap-2 w-12 h-12 justify-center rounded-full shadow-lg transition-all duration-300 ${
          open
            ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] scale-95'
            : 'bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white border border-[#E5E7EB] dark:border-[#1A1A1A] hover:shadow-xl hover:scale-105'
        }`}
        aria-label="Besoin d'aide ?"
      >
        {open ? (
          <X className="w-5 h-5" />
        ) : (
          <>
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm font-semibold hidden sm:inline">Besoin d'aide ?</span>
          </>
        )}
      </button>

      {/* Animation styles */}
      <style>{`
        @keyframes help-panel-in {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-help-panel-in {
          animation: help-panel-in 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
