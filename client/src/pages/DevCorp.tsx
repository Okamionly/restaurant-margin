import { useState, useEffect, useCallback } from 'react';

// ── Types ──────────────────────────────────────────────
interface Agent {
  id: string;
  name: string;
  role: string;
  color: string;
  skinColor: string;
  deskX: number;
  deskY: number;
  status: 'coding' | 'thinking' | 'coffee' | 'meeting' | 'done';
  progress: number;
  currentTask: string;
  mood: number; // 0-100
  linesWritten: number;
  bugsFixed: number;
  messages: string[];
  bubbleText: string;
  bubbleTimer: number;
}

interface ChatMessage {
  from: string;
  text: string;
  time: string;
  isUser: boolean;
}

// ── Constants ──────────────────────────────────────────
const AGENTS_INIT: Agent[] = [
  {
    id: 'cto', name: 'Alex', role: 'CTO — Architecte', color: '#ef4444',
    skinColor: '#d4a574', deskX: 80, deskY: 100,
    status: 'coding', progress: 72, currentTask: 'Sprint backlog', mood: 85,
    linesWritten: 342, bugsFixed: 0, messages: [],
    bubbleText: '', bubbleTimer: 0
  },
  {
    id: 'qa', name: 'Sarah', role: 'QA — Qualité', color: '#10b981',
    skinColor: '#c4956a', deskX: 380, deskY: 100,
    status: 'thinking', progress: 88, currentTask: 'Test des 34 pages', mood: 92,
    linesWritten: 0, bugsFixed: 27, messages: [],
    bubbleText: '', bubbleTimer: 0
  },
  {
    id: 'backend', name: 'Omar', role: 'Backend — DB', color: '#f59e0b',
    skinColor: '#b8865a', deskX: 680, deskY: 100,
    status: 'coding', progress: 45, currentTask: 'Migration Prisma', mood: 78,
    linesWritten: 890, bugsFixed: 3, messages: [],
    bubbleText: '', bubbleTimer: 0
  },
  {
    id: 'content', name: 'Marie', role: 'Content — i18n', color: '#8b5cf6',
    skinColor: '#e8c4a0', deskX: 230, deskY: 340,
    status: 'coding', progress: 95, currentTask: 'Accents français', mood: 97,
    linesWritten: 163, bugsFixed: 30, messages: [],
    bubbleText: '', bubbleTimer: 0
  },
  {
    id: 'devops', name: 'Karim', role: 'DevOps — Perf', color: '#f97316',
    skinColor: '#c9a07a', deskX: 530, deskY: 340,
    status: 'coffee', progress: 60, currentTask: 'Bundle optimization', mood: 88,
    linesWritten: 45, bugsFixed: 5, messages: [],
    bubbleText: '', bubbleTimer: 0
  }
];

const BUBBLES: Record<string, string[]> = {
  coding: ['...', 'function()', 'if (margin > 30)', 'commit!', 'const API =', 'await fetch()', '// TODO', 'npm run build', 'git push', '.tsx'],
  thinking: ['hmm...', '🤔', 'peut-être...', 'j\'ai une idée!', 'vérifions...', 'analysons...', 'intéressant...', 'eurêka!'],
  coffee: ['☕', '☕☕', 'pause café!', 'mmm...', '5 min...', 'je reviens!'],
  meeting: ['📊', 'slide 3...', 'questions?', 'next sprint', 'deadline?'],
  done: ['✅ Terminé!', '🎉', 'prêt!', 'mergé!', 'déployé!']
};

const TASKS = {
  cto: ['Analyse architecture', 'Priorisation backlog', 'Review PR #42', 'Sprint planning', 'Code review'],
  qa: ['Test Dashboard', 'Test Messagerie', 'Test Devis', 'Rapport bugs', 'Test mobile'],
  backend: ['Schema Prisma', 'Migration invoices', 'Migration messages', 'API endpoints', 'Index DB'],
  content: ['Fix unicode Devis', 'Accents Settings', 'Traduction EN→FR', 'Terminologie', 'Vérification finale'],
  devops: ['Analyse bundle', 'Lazy loading', 'PWA cache', 'Cleanup imports', 'Build prod']
};

export default function DevCorp() {
  const [agents, setAgents] = useState<Agent[]>(AGENTS_INIT);
  const [chat, setChat] = useState<ChatMessage[]>([
    { from: 'Système', text: 'Bienvenue au bureau RestauMargin Dev Corp !', time: '09:00', isUser: false },
    { from: 'Alex (CTO)', text: 'Bonjour chef ! L\'équipe est au complet.', time: '09:01', isUser: false }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [time, setTime] = useState(540); // 9:00 AM in minutes

  // Clock + agent simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => (t + 1) % 1440);

      setAgents(prev => prev.map(a => {
        // Random status changes
        const rand = Math.random();
        let newStatus = a.status;
        if (rand < 0.03) newStatus = 'coffee';
        else if (rand < 0.06) newStatus = 'thinking';
        else if (rand < 0.15) newStatus = 'coding';
        if (a.progress >= 100) newStatus = 'done';

        // Progress
        const progressInc = newStatus === 'coding' ? 0.3 + Math.random() * 0.5 :
                           newStatus === 'thinking' ? 0.1 : 0;
        const newProgress = Math.min(100, a.progress + progressInc);

        // Bubble
        let bubbleText = a.bubbleText;
        let bubbleTimer = a.bubbleTimer - 1;
        if (bubbleTimer <= 0 && Math.random() < 0.15) {
          const pool = BUBBLES[newStatus] || BUBBLES.coding;
          bubbleText = pool[Math.floor(Math.random() * pool.length)];
          bubbleTimer = 20 + Math.floor(Math.random() * 30);
        }
        if (bubbleTimer <= 0) bubbleText = '';

        // Lines & bugs
        const linesInc = newStatus === 'coding' ? Math.floor(Math.random() * 3) : 0;
        const bugsInc = newStatus === 'coding' && Math.random() < 0.02 ? 1 : 0;

        // Task rotation
        const taskList = TASKS[a.id as keyof typeof TASKS] || [];
        const taskIdx = Math.floor((newProgress / 100) * taskList.length);
        const currentTask = taskList[Math.min(taskIdx, taskList.length - 1)] || a.currentTask;

        return {
          ...a,
          status: newStatus,
          progress: newProgress,
          bubbleText, bubbleTimer,
          linesWritten: a.linesWritten + linesInc,
          bugsFixed: a.bugsFixed + bugsInc,
          currentTask,
          mood: Math.max(60, Math.min(100, a.mood + (Math.random() - 0.48) * 2))
        };
      }));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

  const sendChat = useCallback(() => {
    if (!chatInput.trim()) return;
    const now = formatTime(time);
    const newChat: ChatMessage = { from: 'Vous', text: chatInput, time: now, isUser: true };
    setChat(prev => [...prev, newChat]);

    // Agent responds
    const input = chatInput.toLowerCase();
    setTimeout(() => {
      let responder = 'Alex (CTO)';
      let response = 'Bien reçu chef ! Je transmets à l\'équipe.';

      if (input.includes('bug') || input.includes('erreur') || input.includes('test')) {
        responder = 'Sarah (QA)';
        response = 'Je vérifie immédiatement ! Rapport en cours...';
      } else if (input.includes('base') || input.includes('prisma') || input.includes('api')) {
        responder = 'Omar (Backend)';
        response = 'La migration avance bien, 3 modèles sur 4 sont faits !';
      } else if (input.includes('french') || input.includes('accent') || input.includes('texte')) {
        responder = 'Marie (Content)';
        response = 'Presque fini ! Plus que 3 fichiers à corriger.';
      } else if (input.includes('deploy') || input.includes('build') || input.includes('perf')) {
        responder = 'Karim (DevOps)';
        response = 'Le bundle est passé de 1.2MB à 420KB gzipped ! 🚀';
      } else if (input.includes('status') || input.includes('avancement')) {
        responder = 'Alex (CTO)';
        const done = agents.filter(a => a.progress >= 100).length;
        response = `Sprint en cours : ${done}/5 agents ont terminé. Progression moyenne : ${Math.floor(agents.reduce((s, a) => s + a.progress, 0) / 5)}%`;
      } else if (input.includes('bravo') || input.includes('merci') || input.includes('bien')) {
        responder = 'Alex (CTO)';
        response = 'Merci chef ! L\'équipe est motivée ! 💪';
      } else if (input.includes('café') || input.includes('pause')) {
        responder = 'Karim (DevOps)';
        response = 'Bonne idée ! ☕ 5 minutes de pause pour tout le monde !';
      }

      setChat(prev => [...prev, { from: responder, text: response, time: formatTime(time + 1), isUser: false }]);
    }, 800 + Math.random() * 1200);

    setChatInput('');
  }, [chatInput, time, agents]);

  const globalProgress = Math.floor(agents.reduce((s, a) => s + a.progress, 0) / agents.length);

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
      {/* Top bar */}
      <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-4 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">DC</div>
        <span className="font-semibold text-sm">RestauMargin Dev Corp</span>
        <span className="text-slate-500 text-xs">Bureau virtuel</span>
        <div className="ml-auto flex items-center gap-4 text-xs">
          <span className="font-mono text-blue-400">{formatTime(time)}</span>
          <span className="text-slate-500">Sprint: {globalProgress}%</span>
          <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500" style={{ width: `${globalProgress}%` }} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Office View (left) ── */}
        <div className="flex-1 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #1a1f2e 0%, #151a27 100%)' }}>
          {/* Floor grid */}
          <svg className="absolute inset-0 w-full h-full opacity-5">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Office furniture & agents */}
          <svg viewBox="0 0 900 550" className="w-full h-full">
            {/* Room walls */}
            <rect x="20" y="20" width="860" height="510" rx="8" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 2" />

            {/* Company sign */}
            <rect x="300" y="30" width="300" height="35" rx="6" fill="#1e293b" stroke="#334155" />
            <text x="450" y="53" textAnchor="middle" fill="#60a5fa" fontSize="14" fontWeight="bold">🏢 RestauMargin Dev Corp</text>

            {/* Each agent desk + character */}
            {agents.map((agent) => {
              const isSelected = selectedAgent === agent.id;
              const bobY = agent.status === 'coding' ? Math.sin(Date.now() / 300 + agents.indexOf(agent)) * 2 : 0;

              return (
                <g key={agent.id} onClick={() => setSelectedAgent(isSelected ? null : agent.id)} style={{ cursor: 'pointer' }}>
                  {/* Desk */}
                  <rect x={agent.deskX} y={agent.deskY + 40} width="120" height="50" rx="4"
                    fill="#1e293b" stroke={isSelected ? agent.color : '#334155'} strokeWidth={isSelected ? 2 : 1} />

                  {/* Monitor */}
                  <rect x={agent.deskX + 35} y={agent.deskY + 20} width="50" height="35" rx="3"
                    fill={agent.status === 'coding' ? '#0f172a' : '#1a1a2e'} stroke="#475569" strokeWidth="0.5" />
                  {agent.status === 'coding' && (
                    <>
                      <line x1={agent.deskX + 40} y1={agent.deskY + 28} x2={agent.deskX + 75} y2={agent.deskY + 28} stroke="#4ade80" strokeWidth="1" opacity="0.6" />
                      <line x1={agent.deskX + 40} y1={agent.deskY + 33} x2={agent.deskX + 65} y2={agent.deskY + 33} stroke="#60a5fa" strokeWidth="1" opacity="0.5" />
                      <line x1={agent.deskX + 40} y1={agent.deskY + 38} x2={agent.deskX + 70} y2={agent.deskY + 38} stroke="#c084fc" strokeWidth="1" opacity="0.4" />
                      <line x1={agent.deskX + 40} y1={agent.deskY + 43} x2={agent.deskX + 60} y2={agent.deskY + 43} stroke="#fbbf24" strokeWidth="1" opacity="0.3" />
                    </>
                  )}

                  {/* Coffee mug (if on break) */}
                  {agent.status === 'coffee' && (
                    <g transform={`translate(${agent.deskX + 95}, ${agent.deskY + 42})`}>
                      <rect x="0" y="0" width="12" height="14" rx="2" fill="#78350f" />
                      <path d="M 12 3 Q 18 3 18 8 Q 18 13 12 13" fill="none" stroke="#78350f" strokeWidth="1.5" />
                      <path d={`M 3 -2 Q 6 ${-6 + Math.sin(Date.now() / 500) * 2} 9 -2`} fill="none" stroke="#94a3b8" strokeWidth="0.8" opacity="0.4" />
                    </g>
                  )}

                  {/* Chair */}
                  <ellipse cx={agent.deskX + 60} cy={agent.deskY + 110} rx="18" ry="8" fill="#334155" />

                  {/* Character body */}
                  <g transform={`translate(${agent.deskX + 60}, ${agent.deskY + 85 + bobY})`}>
                    {/* Body */}
                    <rect x="-12" y="0" width="24" height="25" rx="6" fill={agent.color} />
                    {/* Head */}
                    <circle cx="0" cy="-12" r="12" fill={agent.skinColor} />
                    {/* Eyes */}
                    {agent.status === 'thinking' ? (
                      <>
                        <circle cx="-4" cy="-14" r="1.5" fill="#1e293b" />
                        <circle cx="4" cy="-14" r="1.5" fill="#1e293b" />
                        <ellipse cx="-4" cy="-14" rx="1.5" ry="2" fill="#1e293b">
                          <animate attributeName="ry" values="2;0.5;2" dur="3s" repeatCount="indefinite" />
                        </ellipse>
                      </>
                    ) : agent.status === 'coffee' ? (
                      <>
                        <path d="M -6 -14 Q -4 -16 -2 -14" fill="none" stroke="#1e293b" strokeWidth="1.2" />
                        <path d="M 2 -14 Q 4 -16 6 -14" fill="none" stroke="#1e293b" strokeWidth="1.2" />
                      </>
                    ) : (
                      <>
                        <circle cx="-4" cy="-14" r="1.5" fill="#1e293b" />
                        <circle cx="4" cy="-14" r="1.5" fill="#1e293b" />
                      </>
                    )}
                    {/* Mouth */}
                    {agent.status === 'done' ? (
                      <path d="M -4 -8 Q 0 -5 4 -8" fill="none" stroke="#1e293b" strokeWidth="1" />
                    ) : (
                      <line x1="-3" y1="-8" x2="3" y2="-8" stroke="#1e293b" strokeWidth="1" />
                    )}
                    {/* Arms typing */}
                    {agent.status === 'coding' && (
                      <>
                        <line x1="-12" y1="8" x2="-20" y2={15 + Math.sin(Date.now() / 200) * 3} stroke={agent.skinColor} strokeWidth="3" strokeLinecap="round" />
                        <line x1="12" y1="8" x2="20" y2={15 + Math.cos(Date.now() / 200) * 3} stroke={agent.skinColor} strokeWidth="3" strokeLinecap="round" />
                      </>
                    )}
                  </g>

                  {/* Speech bubble */}
                  {agent.bubbleText && (
                    <g>
                      <rect x={agent.deskX + 30} y={agent.deskY - 15} width={agent.bubbleText.length * 8 + 16} height="22" rx="10" fill="white" />
                      <polygon points={`${agent.deskX + 55},${agent.deskY + 7} ${agent.deskX + 50},${agent.deskY + 15} ${agent.deskX + 60},${agent.deskY + 7}`} fill="white" />
                      <text x={agent.deskX + 38 + agent.bubbleText.length * 4} y={agent.deskY} textAnchor="middle" fill="#1e293b" fontSize="10">{agent.bubbleText}</text>
                    </g>
                  )}

                  {/* Name tag */}
                  <rect x={agent.deskX + 20} y={agent.deskY + 120} width="80" height="30" rx="4" fill={isSelected ? agent.color + '30' : '#0f172a'} stroke={agent.color} strokeWidth="0.5" />
                  <text x={agent.deskX + 60} y={agent.deskY + 133} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{agent.name}</text>
                  <text x={agent.deskX + 60} y={agent.deskY + 144} textAnchor="middle" fill="#94a3b8" fontSize="7">{agent.role}</text>

                  {/* Progress bar under name */}
                  <rect x={agent.deskX + 25} y={agent.deskY + 152} width="70" height="3" rx="1.5" fill="#1e293b" />
                  <rect x={agent.deskX + 25} y={agent.deskY + 152} width={70 * agent.progress / 100} height="3" rx="1.5" fill={agent.color} />

                  {/* Status indicator */}
                  <circle cx={agent.deskX + 105} cy={agent.deskY + 130} r="4"
                    fill={agent.status === 'done' ? '#10b981' : agent.status === 'coding' ? '#3b82f6' : agent.status === 'coffee' ? '#f59e0b' : '#8b5cf6'}>
                    {agent.status !== 'done' && <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />}
                  </circle>
                </g>
              );
            })}

            {/* Decorations */}
            {/* Plant */}
            <g transform="translate(50, 280)">
              <rect x="0" y="15" width="16" height="18" rx="3" fill="#78350f" />
              <circle cx="8" cy="10" r="12" fill="#22c55e" opacity="0.7" />
              <circle cx="4" cy="5" r="8" fill="#16a34a" opacity="0.6" />
            </g>

            {/* Whiteboard */}
            <rect x="750" y="80" width="100" height="70" rx="4" fill="#f8fafc" stroke="#e2e8f0" />
            <text x="800" y="100" textAnchor="middle" fill="#475569" fontSize="8">SPRINT</text>
            <line x1="760" y1="110" x2="840" y2="110" stroke="#60a5fa" strokeWidth="2" />
            <line x1="760" y1="120" x2="820" y2="120" stroke="#10b981" strokeWidth="2" />
            <line x1="760" y1="130" x2="800" y2="130" stroke="#f59e0b" strokeWidth="2" />

            {/* Water cooler */}
            <g transform="translate(820, 300)">
              <rect x="0" y="0" width="20" height="30" rx="3" fill="#dbeafe" stroke="#93c5fd" />
              <rect x="3" y="30" width="14" height="15" rx="2" fill="#e2e8f0" />
              <circle cx="10" cy="12" r="6" fill="#60a5fa" opacity="0.5" />
            </g>
          </svg>
        </div>

        {/* ── Chat Panel (right) ── */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
          {/* Agent info or chat header */}
          <div className="p-3 border-b border-slate-800">
            {selectedAgent ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: agents.find(a => a.id === selectedAgent)?.color }}>
                  {agents.find(a => a.id === selectedAgent)?.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold">{agents.find(a => a.id === selectedAgent)?.name}</div>
                  <div className="text-[10px] text-slate-400">{agents.find(a => a.id === selectedAgent)?.currentTask}</div>
                </div>
              </div>
            ) : (
              <div className="text-sm font-semibold">💬 Chat d'équipe</div>
            )}
          </div>

          {/* Stats bar */}
          <div className="px-3 py-2 border-b border-slate-800 flex gap-3 text-[10px]">
            {agents.map(a => (
              <div key={a.id} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }} />
                <span className="text-slate-400">{Math.floor(a.progress)}%</span>
              </div>
            ))}
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {chat.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-[9px] text-slate-500">{msg.time}</span>
                  <span className={`text-[10px] font-medium ${msg.isUser ? 'text-blue-400' : 'text-slate-300'}`}>{msg.from}</span>
                </div>
                <div className={`px-3 py-1.5 rounded-xl text-xs max-w-[220px] ${
                  msg.isUser ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-slate-800 text-slate-200 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat input */}
          <div className="p-3 border-t border-slate-800">
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
                placeholder="Parler à l'équipe..."
                className="flex-1 bg-slate-800 text-white text-xs rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-500"
              />
              <button onClick={sendChat} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-2 rounded-lg transition-colors">
                ➤
              </button>
            </div>
            <div className="mt-2 flex gap-1 flex-wrap">
              {['status', 'bravo!', 'pause café', 'bugs?', 'deploy!'].map(q => (
                <button key={q} onClick={() => { setChatInput(q); }}
                  className="text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full transition-colors">
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
