import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedTutorial from './AnimatedTutorial';
import {
  Plus, X, Mic, Timer, HelpCircle, Brain, Scale, FileText,
  ShoppingCart, BarChart3, Keyboard, MessageSquare, Play
} from 'lucide-react';

const ACTIONS = [
  { id: 'voice', icon: Mic, label: 'Assistant vocal', color: 'bg-red-500 hover:bg-red-400', action: 'voice' },
  { id: 'ai', icon: Brain, label: 'Assistant IA', color: 'bg-purple-500 hover:bg-purple-400', route: '/assistant' },
  { id: 'weigh', icon: Scale, label: 'Nouvelle pesee', color: 'bg-emerald-500 hover:bg-emerald-400', route: '/station' },
  { id: 'recipe', icon: FileText, label: 'Nouvelle recette', color: 'bg-teal-500 hover:bg-teal-400', route: '/recipes?action=new' },
  { id: 'order', icon: ShoppingCart, label: 'Commande', color: 'bg-blue-500 hover:bg-blue-400', route: '/commandes' },
  { id: 'report', icon: BarChart3, label: 'Rapport IA', color: 'bg-amber-500 hover:bg-amber-400', route: '/analytics' },
  { id: 'help', icon: HelpCircle, label: 'Aide', color: 'bg-[#6B7280] hover:bg-[#525252]', action: 'help' },
  { id: 'shortcuts', icon: Keyboard, label: 'Ctrl+K', color: 'bg-[#111111] dark:bg-white dark:text-black hover:bg-[#333]', action: 'palette' },
];

export default function FloatingActionBubble() {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [activeTutorial, setActiveTutorial] = useState<string | null>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (bubbleRef.current && !bubbleRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowHelp(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') { setOpen(false); setShowHelp(false); stopListening(); }
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  function startListening() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Navigateur non supporte. Utilisez Chrome.'); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      setTranscript(t);
    };
    recognition.onend = () => { setListening(false); };
    recognition.onerror = () => { setListening(false); };
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
    setTranscript('');
  }

  function stopListening() {
    if (recognitionRef.current) { recognitionRef.current.stop(); }
    setListening(false);
  }

  function handleAction(action: typeof ACTIONS[0]) {
    if (action.route) {
      navigate(action.route);
      setOpen(false);
    } else if (action.action === 'voice') {
      if (listening) stopListening(); else startListening();
    } else if (action.action === 'help') {
      setShowHelp(!showHelp);
    } else if (action.action === 'palette') {
      setOpen(false);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    }
  }

  return (
    <div ref={bubbleRef} className="fixed bottom-[5.5rem] md:bottom-20 right-4 z-[90] no-print">

      {/* Help panel */}
      {showHelp && (
        <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-[#0A0A0A] rounded-2xl shadow-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden mb-2">
          <div className="px-4 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#111111] dark:text-white">Aide & Tutoriels</h3>
            <button onClick={() => setShowHelp(false)} className="p-1 hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-lg">
              <X className="w-4 h-4 text-[#9CA3AF]" />
            </button>
          </div>
          <div className="p-3 space-y-2 max-h-[50vh] overflow-y-auto">
            {/* Animated CSS tutorial cards */}
            {[
              { title: 'Creer une fiche technique', desc: 'Ajoutez ingredients + prix = marge auto', emoji: '📋', tutorialId: 'fiche-technique', route: '/recipes?action=new' },
              { title: 'Peser un ingredient', desc: 'Bluetooth ou simulation', emoji: '⚖️', tutorialId: 'pesee', route: '/station' },
              { title: 'Commander un fournisseur', desc: 'En 1 clic ou via WhatsApp', emoji: '🛒', tutorialId: 'commande', route: '/commandes' },
              { title: 'Analyser vos marges', desc: 'Dashboard + IA predictive', emoji: '📊', route: '/dashboard' },
              { title: 'Scanner une facture', desc: 'L\'IA extrait tout', emoji: '🧾', route: '/scanner-factures' },
              { title: 'Gerer le stock', desc: 'Alertes et restock rapide', emoji: '📦', route: '/inventaire' },
            ].map((tuto) => (
              <div key={tuto.title} className="flex items-center gap-2">
                <button
                  onClick={() => { navigate(tuto.route); setOpen(false); setShowHelp(false); }}
                  className="flex-1 text-left p-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#F9FAFB] dark:hover:bg-[#171717] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-purple-500/20 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {tuto.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#111111] dark:text-white">{tuto.title}</p>
                      <p className="text-[11px] text-[#9CA3AF] dark:text-[#737373]">{tuto.desc}</p>
                    </div>
                  </div>
                </button>
                {tuto.tutorialId && (
                  <button
                    onClick={() => { setActiveTutorial(tuto.tutorialId!); setShowHelp(false); setOpen(false); }}
                    className="w-10 h-10 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 flex items-center justify-center flex-shrink-0 transition-colors"
                    title="Voir la demo animee"
                  >
                    <Play className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </button>
                )}
              </div>
            ))}
            {/* Contact support */}
            <button
              onClick={() => { if ((window as any).$crisp) (window as any).$crisp.push(['do', 'chat:open']); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/30 hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <div className="text-left">
                <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">Chat en direct</p>
                <p className="text-[11px] text-teal-600/70 dark:text-teal-400/70">Parlez a l'equipe RestauMargin</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Voice listening card */}
      {listening && (
        <div className="absolute bottom-16 right-0 w-72 bg-white dark:bg-[#0A0A0A] rounded-2xl shadow-2xl border border-red-200 dark:border-red-800/30 p-4 mb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#111111] dark:text-white">Ecoute en cours...</p>
              <p className="text-[11px] text-[#9CA3AF]">Parlez maintenant</p>
            </div>
          </div>
          {transcript && (
            <p className="text-sm text-[#111111] dark:text-white bg-[#F3F4F6] dark:bg-[#171717] rounded-lg p-2 italic">"{transcript}"</p>
          )}
          <button onClick={stopListening} className="mt-2 w-full py-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
            Arreter
          </button>
        </div>
      )}

      {/* Action buttons - fan out */}
      {open && (
        <div className="absolute bottom-16 right-0 flex flex-col items-end gap-2 mb-2">
          {ACTIONS.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleAction(action)}
                className={`flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ${action.color}`}
                style={{ animationDelay: `${i * 30}ms`, animation: 'fadeSlideIn 0.2s ease-out both' }}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-semibold whitespace-nowrap">{action.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main FAB button */}
      <button
        onClick={() => { setOpen(!open); if (open) { setShowHelp(false); stopListening(); } }}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
          open
            ? 'bg-[#111111] dark:bg-white text-white dark:text-black rotate-45 scale-95'
            : 'bg-teal-600 hover:bg-teal-500 text-white hover:scale-110 hover:shadow-2xl'
        }`}
      >
        {open ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>

      {/* Animated tutorial overlay */}
      {activeTutorial && (
        <AnimatedTutorial tutorialId={activeTutorial} onClose={() => setActiveTutorial(null)} />
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
