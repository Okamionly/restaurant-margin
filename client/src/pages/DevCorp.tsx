import { useState, useEffect, useCallback, useRef } from 'react';

// ── Types ──────────────────────────────────────────────
interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  color: string;
  skinColor: string;
  gridCol: number; // 0,1,2
  gridRow: number; // 0,1,2
  status: 'coding' | 'thinking' | 'coffee' | 'meeting' | 'done';
  progress: number;
  currentTask: string;
  taskIndex: number;
  tasks: string[];
  mood: number;
  energy: number;
  history: string[];
  bubbleText: string;
  bubbleTimer: number;
  keywords: string[];
}

interface ChatMessage {
  from: string;
  text: string;
  time: string;
  color: string;
  isUser: boolean;
}

interface Alert {
  id: number;
  agent: string;
  text: string;
  color: string;
  time: number;
}

// ── Agent definitions ──────────────────────────────────
const AGENTS_INIT: Agent[] = [
  {
    id: 'ceo', name: 'CEO', role: 'Directeur', description: 'Supervise tout, rapport quotidien, sprint planning',
    color: '#3b82f6', skinColor: '#c4956a', gridCol: 1, gridRow: 0,
    status: 'meeting', progress: 15, currentTask: 'Sprint planning', taskIndex: 0, mood: 95, energy: 90,
    tasks: ['Sprint planning', 'Priorisation', 'Review agents', 'Rapport quotidien', 'Decisions'],
    history: ['A lance le sprint du jour', 'Review avec Sarah'], bubbleText: '', bubbleTimer: 0,
    keywords: ['status', 'rapport', 'director', 'equipe', 'sprint global', 'resume']
  },
  {
    id: 'sarah', name: 'Sarah', role: 'Marketing', description: 'Emails restaurants, prospection, newsletters',
    color: '#ec4899', skinColor: '#e8c4a0', gridCol: 0, gridRow: 0,
    status: 'coding', progress: 22, currentTask: 'Campagne email', taskIndex: 0, mood: 92, energy: 85,
    tasks: ['Campagne email', 'Recherche leads', 'Newsletter', 'SEO', 'Reseaux sociaux'],
    history: ['Envoye 45 emails', 'Mis a jour la liste leads'], bubbleText: '', bubbleTimer: 0,
    keywords: ['marketing', 'restaurant', 'prospection', 'newsletter', 'seo', 'pub']
  },
  {
    id: 'omar', name: 'Omar', role: 'Securite', description: 'Audit code, vulnerabilites, scan XSS',
    color: '#ef4444', skinColor: '#b8865a', gridCol: 2, gridRow: 0,
    status: 'coding', progress: 10, currentTask: 'Audit npm', taskIndex: 0, mood: 88, energy: 92,
    tasks: ['Audit npm', 'Scan XSS', 'Check tokens', 'CORS', 'Rapport securite'],
    history: ['2 failles npm corrigees', 'Scan XSS en cours'], bubbleText: '', bubbleTimer: 0,
    keywords: ['securite', 'hack', 'faille', 'vulnerability', 'xss', 'audit']
  },
  {
    id: 'karim', name: 'Karim', role: 'Testeur', description: 'Test site, detection bugs, rapports',
    color: '#f59e0b', skinColor: '#c9a07a', gridCol: 0, gridRow: 1,
    status: 'coding', progress: 18, currentTask: 'Test TypeScript', taskIndex: 0, mood: 90, energy: 88,
    tasks: ['Test TypeScript', 'Test pages', 'Test mobile', 'Test API', 'Rapport bugs'],
    history: ['3 bugs trouves sur Dashboard', 'Tests mobile OK'], bubbleText: '', bubbleTimer: 0,
    keywords: ['bug', 'erreur', 'test', 'crash', 'broken', 'fix']
  },
  {
    id: 'hassan', name: 'Hassan', role: 'Planification', description: 'Sprint semaine, roadmap, KPIs',
    color: '#6366f1', skinColor: '#b8865a', gridCol: 1, gridRow: 1,
    status: 'thinking', progress: 12, currentTask: 'Sprint lundi', taskIndex: 0, mood: 93, energy: 87,
    tasks: ['Sprint lundi', 'Taches jour', 'Suivi KPI', 'Roadmap', 'Retrospective'],
    history: ['Roadmap Q2 mise a jour', 'KPIs calcules'], bubbleText: '', bubbleTimer: 0,
    keywords: ['planning', 'sprint', 'tache', 'roadmap', 'kpi', 'semaine']
  },
  {
    id: 'marie', name: 'Marie', role: 'Prix Fournisseurs', description: 'Recherche prix, mercuriale, comparaisons',
    color: '#8b5cf6', skinColor: '#e8c4a0', gridCol: 2, gridRow: 1,
    status: 'coding', progress: 8, currentTask: 'Metro prix', taskIndex: 0, mood: 97, energy: 82,
    tasks: ['Metro prix', 'Transgourmet', 'Pomona', 'Comparaison', 'Mercuriale update'],
    history: ['Prix Metro mis a jour', '120 ingredients compares'], bubbleText: '', bubbleTimer: 0,
    keywords: ['prix', 'fournisseur', 'ingredient', 'mercuriale', 'metro', 'cout']
  },
  {
    id: 'alex', name: 'Alex', role: 'Data/Prisma', description: 'Enrichissement BDD, recettes, migrations',
    color: '#10b981', skinColor: '#d4a574', gridCol: 0, gridRow: 2,
    status: 'coding', progress: 20, currentTask: 'Schema Prisma', taskIndex: 0, mood: 91, energy: 86,
    tasks: ['Schema Prisma', 'Seed ingredients', 'Fiches recettes', 'Relations', 'Migration'],
    history: ['Schema v3 migre', '500 ingredients seeded'], bubbleText: '', bubbleTimer: 0,
    keywords: ['recette', 'prisma', 'data', 'base', 'schema', 'migration', 'seed']
  },
  {
    id: 'luna', name: 'Luna', role: 'IA Client', description: 'Chatbot abonnes, assistance, conseils',
    color: '#06b6d4', skinColor: '#f0d0b0', gridCol: 1, gridRow: 2,
    status: 'thinking', progress: 14, currentTask: 'Repondre clients', taskIndex: 0, mood: 96, energy: 90,
    tasks: ['Repondre clients', 'Conseils recettes', 'Calcul marges', 'Support', 'FAQ'],
    history: ['12 tickets resolus', 'FAQ mise a jour'], bubbleText: '', bubbleTimer: 0,
    keywords: ['aide', 'question', 'chatbot', 'client', 'support', 'faq']
  },
  {
    id: 'nadia', name: 'Nadia', role: 'Email/CRM', description: 'Devis, RDV, relances, templates',
    color: '#f97316', skinColor: '#c4956a', gridCol: 2, gridRow: 2,
    status: 'coding', progress: 16, currentTask: 'Check emails', taskIndex: 0, mood: 89, energy: 84,
    tasks: ['Check emails', 'Rediger devis', 'Planifier RDV', 'Relances', 'Templates'],
    history: ['5 devis envoyes', '3 RDV planifies'], bubbleText: '', bubbleTimer: 0,
    keywords: ['email', 'devis', 'rdv', 'relance', 'crm', 'client mail']
  },
];

const BUBBLES: Record<string, string[]> = {
  coding: ['if (margin > 30)...', 'git push', 'SELECT * FROM...', 'npm run build', 'prisma migrate', 'fetch("/api/...")', 'deploy OK!', '.map(r => ...)', 'import { ... }', 'console.log()'],
  thinking: ['hmm...', 'interessant...', 'j\'ai une idee!', 'voyons voir...', 'ca devrait marcher', 'eureka!', 'laisse-moi reflechir'],
  coffee: ['pause cafe!', 'mmm...', '5 min...', 'je reviens!', 'bonne pause', 'un expresso'],
  meeting: ['questions?', 'bonne idee!', 'on valide', 'next step...', 'OK equipe!', 'en resume...'],
  done: ['termine!', 'pret!', 'merge!', 'deploye!', 'valide!']
};

const AGENT_BUBBLES: Record<string, string[]> = {
  youssef: ['Sprint a jour!', 'Review OK', 'Bonne equipe!', 'On avance bien', 'Prochaine prio?'],
  sarah: ['Email envoye!', '12 leads trouves', 'Newsletter prete', 'SEO +15%', 'Post LinkedIn!'],
  omar: ['0 failles XSS', 'npm audit clean', 'Tokens OK', 'CORS securise', 'Scan termine'],
  karim: ['0 bugs!', 'Test passe!', 'Page mobile OK', 'API 200 OK', 'Coverage 87%'],
  hassan: ['Sprint planifie', 'KPIs en hausse', 'Roadmap Q2 OK', 'Retro terminee', 'Taches assignees'],
  marie: ['Prix Metro OK', 'Pomona -12%', 'Mercuriale a jour', 'Transgourmet check', 'Comparaison faite'],
  alex: ['Schema migre!', '500 seeds OK', 'Relation ajoutee', 'Fiche recette OK', 'Index cree'],
  luna: ['Client satisfait', 'Marge: 32%', 'Ticket resolu!', 'FAQ mise a jour', 'Conseil donne'],
  nadia: ['Devis envoye!', 'RDV confirme', 'Relance faite', 'Template cree', 'Email lu'],
};

const STATUS_LABELS: Record<string, string> = {
  coding: 'En action', thinking: 'Reflexion', coffee: 'Pause cafe', meeting: 'Reunion', done: 'Termine'
};
const STATUS_ICONS: Record<string, string> = {
  coding: '>', thinking: '?', coffee: 'C', meeting: 'M', done: 'V'
};

// ── Responses to user chat ─────────────────────────────
const AGENT_RESPONSES: Record<string, string[]> = {
  youssef: [
    'Equipe au complet ! Voici le status global du sprint.',
    'Je fais le point avec chaque agent et je te reviens.',
    'Rapport du jour : tout avance bien, quelques alertes chez Omar.',
  ],
  sarah: [
    'Campagne email en cours ! 45 restaurants contactes ce matin.',
    'La newsletter de cette semaine est prete, j\'envoie a 14h.',
    'SEO : on a gagne 12 positions sur "logiciel marge restaurant".',
  ],
  omar: [
    'Audit npm : 2 vulnerabilites corrigees, 0 critique restante.',
    'Scan XSS termine, aucune injection detectee sur les formulaires.',
    'Tokens JWT renouveles, duree de vie reduite a 1h. Plus securise.',
  ],
  karim: [
    'Tests en cours : 87% de coverage, 3 bugs mineurs trouves.',
    'La page Dashboard crashait sur mobile, c\'est corrige !',
    'API endpoints testes : 42/42 passent, temps moyen 120ms.',
  ],
  hassan: [
    'Sprint de la semaine planifie : 14 taches reparties sur 9 agents.',
    'KPIs du jour : +18% d\'efficacite vs semaine derniere.',
    'Roadmap Q2 mise a jour, on est en avance sur le planning !',
  ],
  marie: [
    'Prix Metro : tomates -8%, poulet +3%, huile d\'olive stable.',
    'Comparaison Transgourmet vs Pomona terminee, 23 produits moins chers.',
    'Mercuriale mise a jour avec 847 prix fournisseurs.',
  ],
  alex: [
    'Schema Prisma migre avec succes, 3 nouvelles relations ajoutees.',
    'Seed termine : 500 ingredients avec prix et categories.',
    'Fiches recettes enrichies avec les couts ingredients en temps reel.',
  ],
  luna: [
    'J\'ai repondu a 12 tickets clients aujourd\'hui, tous resolus !',
    'Conseil du jour : une marge de 30% minimum sur les plats phares.',
    'FAQ mise a jour avec les 5 questions les plus frequentes.',
  ],
  nadia: [
    'Devis envoye au restaurant La Belle Epoque, attente retour.',
    'RDV planifie avec Le Bistrot Parisien pour mardi 14h.',
    '3 relances effectuees, 1 reponse positive du Cafe Central.',
  ],
};

export default function DevCorp() {
  const [agents, setAgents] = useState<Agent[]>(AGENTS_INIT);
  const [chat, setChat] = useState<ChatMessage[]>([
    { from: 'Systeme', text: 'Sprint du jour demarre ! 9 agents en ligne.', time: '09:00', color: '#3b82f6', isUser: false },
    { from: 'CEO', text: 'Equipe au complet. On attaque les objectifs du jour !', time: '09:01', color: '#3b82f6', isUser: false },
    { from: 'Hassan', text: 'Taches distribuees. Chacun sait quoi faire.', time: '09:02', color: '#6366f1', isUser: false },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [time, setTime] = useState(540);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [tick, setTick] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  // Main simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
      setTime(t => (t + 1) % 1440);

      setAgents(prev => prev.map(a => {
        const rand = Math.random();
        let newStatus = a.status;
        if (a.progress >= 100) {
          newStatus = 'done';
        } else if (rand < 0.02) {
          newStatus = 'coffee';
        } else if (rand < 0.05) {
          newStatus = 'thinking';
        } else if (rand < 0.07) {
          newStatus = 'meeting';
        } else if (rand < 0.20) {
          newStatus = 'coding';
        }

        const progressInc = newStatus === 'coding' ? 0.2 + Math.random() * 0.4
          : newStatus === 'thinking' ? 0.1 + Math.random() * 0.1
          : newStatus === 'meeting' ? 0.05 : 0;
        const newProgress = Math.min(100, a.progress + progressInc);

        // Bubble logic
        let bubbleText = a.bubbleText;
        let bubbleTimer = a.bubbleTimer - 1;
        if (bubbleTimer <= 0 && Math.random() < 0.12) {
          const agentPool = AGENT_BUBBLES[a.id] || [];
          const statusPool = BUBBLES[newStatus] || BUBBLES.coding;
          const pool = Math.random() < 0.5 ? agentPool : statusPool;
          if (pool.length > 0) {
            bubbleText = pool[Math.floor(Math.random() * pool.length)];
            bubbleTimer = 25 + Math.floor(Math.random() * 35);
          }
        }
        if (bubbleTimer <= 0) bubbleText = '';

        // Task rotation
        const newTaskIdx = Math.min(a.tasks.length - 1, Math.floor((newProgress / 100) * a.tasks.length));
        const currentTask = a.tasks[newTaskIdx] || a.currentTask;

        // History
        const history = [...a.history];
        if (newTaskIdx > a.taskIndex && a.tasks[a.taskIndex]) {
          history.push(`Termine: ${a.tasks[a.taskIndex]}`);
          if (history.length > 8) history.shift();
        }

        // Mood & energy
        const moodDelta = newStatus === 'coffee' ? 0.5 : newStatus === 'done' ? 0.3 : (Math.random() - 0.48) * 1.5;
        const energyDelta = newStatus === 'coffee' ? 0.8 : newStatus === 'coding' ? -0.15 : (Math.random() - 0.45) * 1;

        return {
          ...a, status: newStatus, progress: newProgress,
          bubbleText, bubbleTimer, currentTask, taskIndex: newTaskIdx, history,
          mood: Math.max(50, Math.min(100, a.mood + moodDelta)),
          energy: Math.max(30, Math.min(100, a.energy + energyDelta)),
        };
      }));

      // Random alerts
      if (Math.random() < 0.008) {
        const alertAgents = [
          { id: 'omar', texts: ['Faille npm detectee !', 'Token expire detecte', 'Tentative XSS bloquee'] },
          { id: 'karim', texts: ['Bug trouve sur MenuPage', 'Test mobile echoue', 'API timeout detecte'] },
          { id: 'marie', texts: ['Prix Metro mis a jour', 'Nouveau fournisseur trouve', 'Alerte prix: huile +15%'] },
        ];
        const pick = alertAgents[Math.floor(Math.random() * alertAgents.length)];
        const ag = AGENTS_INIT.find(a => a.id === pick.id);
        if (ag) {
          setAlerts(prev => [...prev.slice(-4), {
            id: Date.now(), agent: ag.name, text: pick.texts[Math.floor(Math.random() * pick.texts.length)],
            color: ag.color, time: Date.now()
          }]);
        }
      }

      // Remove old alerts
      setAlerts(prev => prev.filter(a => Date.now() - a.time < 8000));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

  const sendChat = useCallback(() => {
    if (!chatInput.trim()) return;
    const now = formatTime(time);
    setChat(prev => [...prev, { from: 'Vous', text: chatInput, time: now, color: '#ffffff', isUser: true }]);

    const input = chatInput.toLowerCase();
    setChatInput('');

    setTimeout(() => {
      // Find best matching agent
      let bestAgent = agents.find(a => a.id === 'youssef')!;
      let bestScore = 0;

      for (const a of agents) {
        let score = 0;
        for (const kw of a.keywords) {
          if (input.includes(kw)) score += 2;
        }
        if (score > bestScore) {
          bestScore = score;
          bestAgent = a;
        }
      }

      // If status/rapport, CEO gives summary
      let responseText: string;
      if (bestAgent.id === 'ceo' && (input.includes('status') || input.includes('rapport'))) {
        const active = agents.filter(a => a.status !== 'done').length;
        const avg = Math.floor(agents.reduce((s, a) => s + a.progress, 0) / agents.length);
        responseText = `Rapport: ${active}/9 agents actifs. Progression sprint: ${avg}%. ` +
          agents.map(a => `${a.name}(${Math.floor(a.progress)}%)`).join(', ');
      } else {
        const pool = AGENT_RESPONSES[bestAgent.id] || AGENT_RESPONSES.youssef;
        responseText = pool[Math.floor(Math.random() * pool.length)];
      }

      setChat(prev => [...prev, {
        from: bestAgent.name, text: responseText, time: formatTime(time + 1),
        color: bestAgent.color, isUser: false
      }]);
    }, 600 + Math.random() * 800);
  }, [chatInput, time, agents]);

  const globalProgress = Math.floor(agents.reduce((s, a) => s + a.progress, 0) / agents.length);
  const activeCount = agents.filter(a => a.status !== 'done' && a.status !== 'coffee').length;
  const selected = selectedAgent ? agents.find(a => a.id === selectedAgent) : null;

  // Desk positions in SVG viewBox 960x600
  const deskPos = (col: number, row: number) => ({
    x: 60 + col * 300,
    y: 50 + row * 180,
  });

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-black text-mono-100 dark:text-white overflow-hidden">
      {/* ── Top Bar ── */}
      <div className="h-12 bg-mono-1000 dark:bg-mono-50 border-b border-mono-900 dark:border-mono-200 flex items-center px-4 gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">DC</div>
        <span className="font-semibold text-sm hidden sm:inline">RestauMargin Dev Corp</span>
        <span className="text-mono-500 dark:text-mono-700 text-xs hidden md:inline">Bureau virtuel</span>

        <div className="ml-auto flex items-center gap-3 text-xs">
          {/* Alerts */}
          {alerts.map(a => (
            <div key={a.id} className="flex items-center gap-1 px-2 py-0.5 rounded-full animate-pulse"
              style={{ backgroundColor: a.color + '25', border: `1px solid ${a.color}50` }}>
              <span style={{ color: a.color }} className="font-semibold">{a.agent}</span>
              <span className="text-mono-400 dark:text-mono-800">{a.text}</span>
            </div>
          ))}

          <div className="flex items-center gap-1 text-mono-500 dark:text-mono-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{activeCount} actifs</span>
          </div>

          <span className="font-mono text-blue-400">{formatTime(time)}</span>

          <div className="flex items-center gap-1.5">
            <span className="text-mono-500 dark:text-mono-700">Sprint:</span>
            <div className="w-20 h-1.5 bg-mono-900 dark:bg-mono-300 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${globalProgress}%` }} />
            </div>
            <span className="text-mono-500 dark:text-mono-700">{globalProgress}%</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Office SVG ── */}
        <div className="flex-1 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #1a1f2e 0%, #151a27 100%)' }}>
          {/* Grid floor */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          <svg viewBox="0 0 960 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Room outline */}
            <rect x="15" y="10" width="930" height="580" rx="8" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="6 3" />

            {/* Logo sign */}
            <rect x="340" y="16" width="280" height="28" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
            <text x="480" y="35" textAnchor="middle" fill="#60a5fa" fontSize="12" fontWeight="bold">RestauMargin Dev Corp</text>

            {/* Whiteboard top-right */}
            <rect x="830" y="18" width="90" height="55" rx="3" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.5" />
            <text x="875" y="32" textAnchor="middle" fill="#475569" fontSize="7" fontWeight="bold">SPRINT</text>
            <rect x="840" y="37" width={60 * globalProgress / 100} height="4" rx="2" fill="#3b82f6" />
            <rect x="840" y="37" width="60" height="4" rx="2" fill="none" stroke="#94a3b8" strokeWidth="0.3" />
            <rect x="840" y="45" width="40" height="3" rx="1.5" fill="#10b981" opacity="0.6" />
            <rect x="840" y="52" width="50" height="3" rx="1.5" fill="#f59e0b" opacity="0.6" />
            <rect x="840" y="59" width="30" height="3" rx="1.5" fill="#8b5cf6" opacity="0.6" />

            {/* Plant bottom-left */}
            <g transform="translate(25, 530)">
              <rect x="2" y="18" width="18" height="22" rx="4" fill="#78350f" />
              <ellipse cx="11" cy="14" rx="14" ry="16" fill="#22c55e" opacity="0.5" />
              <ellipse cx="7" cy="8" rx="9" ry="11" fill="#16a34a" opacity="0.45" />
              <ellipse cx="16" cy="10" rx="7" ry="9" fill="#15803d" opacity="0.4" />
            </g>

            {/* Coffee machine */}
            <g transform="translate(870, 530)">
              <rect x="0" y="5" width="28" height="30" rx="4" fill="#374151" stroke="#4b5563" strokeWidth="0.5" />
              <rect x="4" y="8" width="20" height="12" rx="2" fill="#1f2937" />
              <circle cx="14" cy="14" r="3" fill="#ef4444" opacity="0.5">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
              <rect x="8" y="25" width="12" height="8" rx="1" fill="#78350f" />
              <text x="14" y="42" textAnchor="middle" fill="#94a3b8" fontSize="5">CAFE</text>
            </g>

            {/* Wall clock */}
            <g transform="translate(480, 555)">
              <circle cx="0" cy="0" r="16" fill="#1e293b" stroke="#475569" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="1.5" fill="#94a3b8" />
              {/* Hour hand */}
              <line x1="0" y1="0" x2={Math.sin((time / 720) * Math.PI * 2) * 7} y2={-Math.cos((time / 720) * Math.PI * 2) * 7} stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />
              {/* Minute hand */}
              <line x1="0" y1="0" x2={Math.sin((time / 60) * Math.PI * 2) * 11} y2={-Math.cos((time / 60) * Math.PI * 2) * 11} stroke="#94a3b8" strokeWidth="0.8" strokeLinecap="round" />
            </g>

            {/* ── Agents ── */}
            {agents.map((agent) => {
              const pos = deskPos(agent.gridCol, agent.gridRow);
              const isSelected = selectedAgent === agent.id;
              const bobAmount = agent.status === 'coding' ? Math.sin(tick * 0.3 + agents.indexOf(agent) * 1.5) * 2 : 0;
              const blinkPhase = (tick + agents.indexOf(agent) * 7) % 40;
              const isBlinking = blinkPhase < 2;

              return (
                <g key={agent.id} onClick={() => setSelectedAgent(isSelected ? null : agent.id)} style={{ cursor: 'pointer' }}>
                  {/* Desk surface */}
                  <rect x={pos.x} y={pos.y + 55} width="200" height="50" rx="5"
                    fill="#1e293b" stroke={isSelected ? agent.color : '#334155'} strokeWidth={isSelected ? 2 : 0.8} />

                  {/* Desk legs */}
                  <line x1={pos.x + 15} y1={pos.y + 105} x2={pos.x + 15} y2={pos.y + 115} stroke="#475569" strokeWidth="2" />
                  <line x1={pos.x + 185} y1={pos.y + 105} x2={pos.x + 185} y2={pos.y + 115} stroke="#475569" strokeWidth="2" />

                  {/* Monitor */}
                  <rect x={pos.x + 60} y={pos.y + 25} width="80" height="45" rx="3"
                    fill={agent.status === 'coding' ? '#0f172a' : '#1a1a2e'} stroke="#475569" strokeWidth="0.5" />
                  {/* Monitor stand */}
                  <rect x={pos.x + 93} y={pos.y + 70} width="14" height="6" rx="1" fill="#475569" />
                  <rect x={pos.x + 85} y={pos.y + 75} width="30" height="3" rx="1" fill="#475569" />

                  {/* Screen content */}
                  {agent.status === 'coding' && (
                    <>
                      <line x1={pos.x + 67} y1={pos.y + 34} x2={pos.x + 125} y2={pos.y + 34} stroke="#4ade80" strokeWidth="1" opacity="0.5" />
                      <line x1={pos.x + 67} y1={pos.y + 39} x2={pos.x + 110} y2={pos.y + 39} stroke="#60a5fa" strokeWidth="1" opacity="0.4" />
                      <line x1={pos.x + 72} y1={pos.y + 44} x2={pos.x + 120} y2={pos.y + 44} stroke="#c084fc" strokeWidth="1" opacity="0.35" />
                      <line x1={pos.x + 72} y1={pos.y + 49} x2={pos.x + 100} y2={pos.y + 49} stroke="#fbbf24" strokeWidth="1" opacity="0.3" />
                      <line x1={pos.x + 67} y1={pos.y + 54} x2={pos.x + 115} y2={pos.y + 54} stroke="#4ade80" strokeWidth="1" opacity="0.25" />
                    </>
                  )}
                  {agent.status === 'thinking' && (
                    <text x={pos.x + 100} y={pos.y + 50} textAnchor="middle" fill="#94a3b8" fontSize="16" opacity="0.5">?</text>
                  )}
                  {agent.status === 'meeting' && (
                    <>
                      <rect x={pos.x + 70} y={pos.y + 33} width="60" height="6" rx="1" fill="#3b82f6" opacity="0.3" />
                      <rect x={pos.x + 70} y={pos.y + 42} width="45" height="6" rx="1" fill="#10b981" opacity="0.3" />
                      <rect x={pos.x + 70} y={pos.y + 51} width="55" height="6" rx="1" fill="#f59e0b" opacity="0.3" />
                    </>
                  )}
                  {agent.status === 'done' && (
                    <text x={pos.x + 100} y={pos.y + 52} textAnchor="middle" fill="#10b981" fontSize="18">V</text>
                  )}

                  {/* Keyboard on desk */}
                  <rect x={pos.x + 70} y={pos.y + 80} width="60" height="12" rx="2" fill="#374151" stroke="#4b5563" strokeWidth="0.3" />

                  {/* Coffee mug on desk */}
                  {agent.status === 'coffee' && (
                    <g transform={`translate(${pos.x + 160}, ${pos.y + 62})`}>
                      <rect x="0" y="0" width="14" height="16" rx="3" fill="#78350f" stroke="#92400e" strokeWidth="0.5" />
                      <path d="M 14 3 Q 20 3 20 9 Q 20 15 14 15" fill="none" stroke="#78350f" strokeWidth="1.5" />
                      {/* Steam */}
                      <path d={`M 4 -3 Q 7 ${-8 + Math.sin(tick * 0.2) * 2} 10 -3`} fill="none" stroke="#94a3b8" strokeWidth="0.6" opacity="0.4" />
                      <path d={`M 2 -5 Q 5 ${-10 + Math.cos(tick * 0.15) * 2} 8 -5`} fill="none" stroke="#94a3b8" strokeWidth="0.5" opacity="0.3" />
                    </g>
                  )}

                  {/* Notepad on desk */}
                  <rect x={pos.x + 15} y={pos.y + 62} width="30" height="36" rx="2" fill="#fef3c7" opacity="0.7" />
                  <line x1={pos.x + 19} y1={pos.y + 70} x2={pos.x + 41} y2={pos.y + 70} stroke="#d97706" strokeWidth="0.4" opacity="0.4" />
                  <line x1={pos.x + 19} y1={pos.y + 76} x2={pos.x + 38} y2={pos.y + 76} stroke="#d97706" strokeWidth="0.4" opacity="0.4" />
                  <line x1={pos.x + 19} y1={pos.y + 82} x2={pos.x + 35} y2={pos.y + 82} stroke="#d97706" strokeWidth="0.4" opacity="0.4" />

                  {/* Chair */}
                  <ellipse cx={pos.x + 100} cy={pos.y + 130} rx="22" ry="8" fill="#334155" opacity="0.7" />
                  <rect x={pos.x + 82} y={pos.y + 118} width="36" height="10" rx="4" fill="#475569" />

                  {/* ── Character ── */}
                  <g transform={`translate(${pos.x + 100}, ${pos.y + 95 + bobAmount})`}>
                    {/* Body / shirt */}
                    <rect x="-14" y="2" width="28" height="28" rx="8" fill={agent.color} />
                    {/* Collar detail */}
                    <path d="M -5 2 L 0 8 L 5 2" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />

                    {/* Head */}
                    <circle cx="0" cy="-12" r="14" fill={agent.skinColor} />

                    {/* Hair */}
                    <ellipse cx="0" cy="-22" rx="13" ry="6" fill={
                      ['youssef', 'omar', 'hassan', 'alex'].includes(agent.id) ? '#1a1a2e' :
                      agent.id === 'sarah' ? '#d4a574' :
                      agent.id === 'marie' ? '#92400e' :
                      agent.id === 'luna' ? '#1e1b4b' :
                      agent.id === 'nadia' ? '#1a1a2e' :
                      '#374151'
                    } />

                    {/* Eyes */}
                    {isBlinking ? (
                      <>
                        <line x1="-6" y1="-13" x2="-2" y2="-13" stroke="#1e293b" strokeWidth="1" strokeLinecap="round" />
                        <line x1="2" y1="-13" x2="6" y2="-13" stroke="#1e293b" strokeWidth="1" strokeLinecap="round" />
                      </>
                    ) : agent.status === 'coffee' ? (
                      <>
                        <path d="M -7 -13 Q -4 -16 -1 -13" fill="none" stroke="#1e293b" strokeWidth="1" />
                        <path d="M 1 -13 Q 4 -16 7 -13" fill="none" stroke="#1e293b" strokeWidth="1" />
                      </>
                    ) : (
                      <>
                        <circle cx="-4" cy="-13" r="2" fill="#1e293b" />
                        <circle cx="4" cy="-13" r="2" fill="#1e293b" />
                        <circle cx="-3.2" cy="-13.5" r="0.6" fill="white" />
                        <circle cx="4.8" cy="-13.5" r="0.6" fill="white" />
                      </>
                    )}

                    {/* Mouth */}
                    {agent.status === 'done' || agent.mood > 90 ? (
                      <path d="M -4 -6 Q 0 -2 4 -6" fill="none" stroke="#1e293b" strokeWidth="1" />
                    ) : agent.status === 'thinking' ? (
                      <circle cx="2" cy="-6" r="2" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                    ) : (
                      <line x1="-3" y1="-6" x2="3" y2="-6" stroke="#1e293b" strokeWidth="0.8" />
                    )}

                    {/* Arms */}
                    {agent.status === 'coding' ? (
                      <>
                        <line x1="-14" y1="10" x2={-24 + Math.sin(tick * 0.5 + agents.indexOf(agent)) * 3} y2={18}
                          stroke={agent.skinColor} strokeWidth="3.5" strokeLinecap="round" />
                        <line x1="14" y1="10" x2={24 + Math.cos(tick * 0.5 + agents.indexOf(agent)) * 3} y2={18}
                          stroke={agent.skinColor} strokeWidth="3.5" strokeLinecap="round" />
                      </>
                    ) : agent.status === 'coffee' ? (
                      <>
                        <line x1="-14" y1="10" x2="-20" y2="20" stroke={agent.skinColor} strokeWidth="3.5" strokeLinecap="round" />
                        <line x1="14" y1="10" x2="25" y2="5" stroke={agent.skinColor} strokeWidth="3.5" strokeLinecap="round" />
                      </>
                    ) : (
                      <>
                        <line x1="-14" y1="10" x2="-22" y2="20" stroke={agent.skinColor} strokeWidth="3.5" strokeLinecap="round" />
                        <line x1="14" y1="10" x2="22" y2="20" stroke={agent.skinColor} strokeWidth="3.5" strokeLinecap="round" />
                      </>
                    )}
                  </g>

                  {/* Speech bubble */}
                  {agent.bubbleText && (
                    <g>
                      <rect x={pos.x + 50} y={pos.y - 8} width={Math.max(agent.bubbleText.length * 6.5 + 14, 60)} height="20" rx="10" fill="white" opacity="0.95" />
                      <polygon points={`${pos.x + 90},${pos.y + 12} ${pos.x + 85},${pos.y + 20} ${pos.x + 100},${pos.y + 12}`} fill="white" opacity="0.95" />
                      <text x={pos.x + 50 + Math.max(agent.bubbleText.length * 6.5 + 14, 60) / 2} y={pos.y + 6}
                        textAnchor="middle" fill="#1e293b" fontSize="9" fontWeight="500">{agent.bubbleText}</text>
                    </g>
                  )}

                  {/* Name plate */}
                  <rect x={pos.x + 50} y={pos.y + 140} width="100" height="28" rx="5"
                    fill={isSelected ? agent.color + '30' : '#0f172a80'} stroke={agent.color} strokeWidth={isSelected ? 1.5 : 0.5} />
                  <text x={pos.x + 100} y={pos.y + 152} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{agent.name}</text>
                  <text x={pos.x + 100} y={pos.y + 162} textAnchor="middle" fill="#94a3b8" fontSize="7">{agent.role}</text>

                  {/* Mini progress bar */}
                  <rect x={pos.x + 55} y={pos.y + 169} width="90" height="2.5" rx="1.25" fill="#1e293b" />
                  <rect x={pos.x + 55} y={pos.y + 169} width={90 * agent.progress / 100} height="2.5" rx="1.25" fill={agent.color}>
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
                  </rect>

                  {/* Status dot */}
                  <circle cx={pos.x + 155} cy={pos.y + 148} r="4"
                    fill={agent.status === 'done' ? '#10b981' : agent.status === 'coding' ? '#3b82f6' : agent.status === 'coffee' ? '#f59e0b' : agent.status === 'meeting' ? '#8b5cf6' : '#94a3b8'}>
                    {agent.status !== 'done' && <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />}
                  </circle>
                </g>
              );
            })}
          </svg>
        </div>

        {/* ── Right Panel ── */}
        <div className="w-80 bg-mono-1000 dark:bg-mono-50 border-l border-mono-900 dark:border-mono-200 flex flex-col shrink-0">

          {/* Agent Detail Panel (when selected) */}
          {selected ? (
            <div className="border-b border-mono-900 dark:border-mono-200 p-3 max-h-[45%] overflow-y-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                  style={{ backgroundColor: selected.color }}>
                  {selected.name[0]}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">{selected.name}</div>
                  <div className="text-[10px] text-mono-500 dark:text-mono-700">{selected.role} — {selected.description}</div>
                </div>
                <button onClick={() => setSelectedAgent(null)} className="text-mono-500 dark:text-mono-700 hover:text-mono-100 dark:hover:text-white text-xs">X</button>
              </div>

              {/* Status + mood + energy */}
              <div className="flex gap-2 mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: selected.color + '25', color: selected.color }}>
                  {STATUS_ICONS[selected.status]} {STATUS_LABELS[selected.status]}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-mono-975 dark:bg-mono-300 text-mono-400 dark:text-mono-800">
                  Moral: {Math.floor(selected.mood)}%
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-mono-975 dark:bg-mono-300 text-mono-400 dark:text-mono-800">
                  Energie: {Math.floor(selected.energy)}%
                </span>
              </div>

              {/* Current task */}
              <div className="bg-mono-975 dark:bg-mono-300/50 rounded-lg p-2 mb-2">
                <div className="text-[10px] text-mono-500 dark:text-mono-700 mb-1">Tache en cours</div>
                <div className="text-xs font-semibold" style={{ color: selected.color }}>{selected.currentTask}</div>
                <div className="w-full h-1.5 bg-mono-350 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${selected.progress}%`, backgroundColor: selected.color }} />
                </div>
                <div className="text-[9px] text-mono-500 dark:text-mono-700 mt-0.5 text-right">{Math.floor(selected.progress)}%</div>
              </div>

              {/* All tasks */}
              <div className="mb-2">
                <div className="text-[10px] text-mono-500 dark:text-mono-700 mb-1">Taches du sprint</div>
                {selected.tasks.map((t, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px] py-0.5">
                    <span className={`w-3 h-3 rounded-full flex items-center justify-center text-[7px] ${
                      i < selected.taskIndex ? 'bg-emerald-500/20 text-emerald-400' :
                      i === selected.taskIndex ? 'text-mono-100 dark:text-white' : 'bg-mono-975 dark:bg-mono-300 text-mono-400 dark:text-mono-800'
                    }`} style={i === selected.taskIndex ? { backgroundColor: selected.color + '30', color: selected.color } : {}}>
                      {i < selected.taskIndex ? 'V' : i === selected.taskIndex ? '>' : '-'}
                    </span>
                    <span className={i < selected.taskIndex ? 'text-mono-500 dark:text-mono-700 line-through' : i === selected.taskIndex ? 'text-mono-100 dark:text-white font-medium' : 'text-mono-500 dark:text-mono-700'}>{t}</span>
                  </div>
                ))}
              </div>

              {/* History */}
              <div className="mb-2">
                <div className="text-[10px] text-mono-500 dark:text-mono-700 mb-1">Historique</div>
                {selected.history.slice(-4).map((h, i) => (
                  <div key={i} className="text-[10px] text-mono-500 dark:text-mono-700 py-0.5 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-mono-400" />
                    {h}
                  </div>
                ))}
              </div>

              {/* Assign task button */}
              <button onClick={() => {
                setChatInput(`@${selected.name} `);
              }} className="w-full text-[10px] py-1.5 rounded-lg font-medium transition-colors"
                style={{ backgroundColor: selected.color + '20', color: selected.color, border: `1px solid ${selected.color}40` }}>
                Assigner une tache
              </button>
            </div>
          ) : (
            /* Status overview when no agent selected */
            <div className="border-b border-mono-900 dark:border-mono-200 p-3">
              <div className="text-xs font-semibold mb-2">Centre de controle</div>
              <div className="grid grid-cols-3 gap-1.5">
                {agents.map(a => (
                  <button key={a.id} onClick={() => setSelectedAgent(a.id)}
                    className="flex items-center gap-1 p-1.5 rounded-lg bg-mono-975 dark:bg-mono-300/50 hover:bg-mono-900 dark:hover:bg-mono-300 transition-colors text-left">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                      style={{ backgroundColor: a.color }}>
                      {a.name[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[8px] font-medium truncate">{a.name}</div>
                      <div className="text-[7px] text-mono-500 dark:text-mono-700">{Math.floor(a.progress)}%</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat header */}
          <div className="px-3 py-2 border-b border-mono-900 dark:border-mono-200 flex items-center justify-between">
            <span className="text-xs font-semibold">Chat d'equipe</span>
            <span className="text-[9px] text-mono-500 dark:text-mono-700">{chat.length} messages</span>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {chat.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-[8px] text-mono-400 dark:text-mono-800">{msg.time}</span>
                  <span className="text-[10px] font-medium" style={{ color: msg.isUser ? '#60a5fa' : msg.color }}>{msg.from}</span>
                </div>
                <div className={`px-3 py-1.5 rounded-xl text-[11px] max-w-[230px] leading-relaxed ${
                  msg.isUser ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-mono-975 dark:bg-mono-300 text-mono-100 dark:text-mono-900 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat input */}
          <div className="p-3 border-t border-mono-900 dark:border-mono-200">
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
                placeholder="Parler a l'equipe..."
                className="flex-1 bg-mono-975 dark:bg-mono-300 text-mono-100 dark:text-white text-xs rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 placeholder-mono-700 dark:placeholder-mono-500 border border-mono-900 dark:border-mono-300"
              />
              <button onClick={sendChat} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-2 rounded-lg transition-colors font-bold">
                &gt;
              </button>
            </div>
            <div className="mt-2 flex gap-1 flex-wrap">
              {['status', 'bugs?', 'securite', 'prix', 'planning', 'emails'].map(q => (
                <button key={q} onClick={() => setChatInput(q)}
                  className="text-[9px] bg-mono-975 dark:bg-mono-300 hover:bg-mono-900 dark:hover:bg-mono-350 text-mono-500 dark:text-mono-700 px-2 py-0.5 rounded-full transition-colors border border-mono-900 dark:border-mono-300/50">
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
