import { useState, useEffect, useRef } from 'react';
import {
  Brain, Shield, Palette, Server, Languages, Rocket,
  CheckCircle2, Loader2, Clock, AlertTriangle,
  ChevronRight, Terminal, Zap, Coffee, Bug,
  GitBranch, FileCode, Database, Globe
} from 'lucide-react';

interface AgentTask {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'working' | 'done' | 'error';
  progress: number;
  logs: string[];
  color: string;
  icon: typeof Brain;
  role: string;
  currentTask: string;
  tasksCompleted: number;
  tasksTotal: number;
  linesChanged: number;
  filesFixed: number;
}

const INITIAL_AGENTS: AgentTask[] = [
  {
    id: 'cto', name: 'CTO Agent', role: 'Architecte en chef',
    description: 'Analyse du codebase, priorisation du backlog, planification sprint',
    status: 'working', progress: 0, color: 'red',
    icon: Brain, currentTask: 'Analyse des 34 pages...',
    tasksCompleted: 0, tasksTotal: 5, linesChanged: 0, filesFixed: 0,
    logs: ['[09:00] Démarrage de l\'analyse architecturale...']
  },
  {
    id: 'qa', name: 'QA Agent', role: 'Ingénieur Qualité',
    description: 'Tests de toutes les pages, détection de bugs, rapport qualité',
    status: 'working', progress: 0, color: 'green',
    icon: Bug, currentTask: 'Compilation TypeScript...',
    tasksCompleted: 0, tasksTotal: 8, linesChanged: 0, filesFixed: 0,
    logs: ['[09:00] Lancement des tests TypeScript...']
  },
  {
    id: 'backend', name: 'Backend Agent', role: 'Ingénieur Backend',
    description: 'Migration des données in-memory vers PostgreSQL/Prisma',
    status: 'working', progress: 0, color: 'yellow',
    icon: Database, currentTask: 'Lecture du schéma Prisma...',
    tasksCompleted: 0, tasksTotal: 6, linesChanged: 0, filesFixed: 0,
    logs: ['[09:00] Connexion à la base de données...']
  },
  {
    id: 'content', name: 'Content Agent', role: 'Spécialiste i18n',
    description: 'Correction des accents, unicode, terminologie française',
    status: 'working', progress: 0, color: 'purple',
    icon: Languages, currentTask: 'Scan des fichiers .tsx...',
    tasksCompleted: 0, tasksTotal: 7, linesChanged: 0, filesFixed: 0,
    logs: ['[09:00] Recherche des séquences unicode...']
  },
  {
    id: 'devops', name: 'DevOps Agent', role: 'Ingénieur DevOps',
    description: 'Optimisation du bundle, cache PWA, performance',
    status: 'working', progress: 0, color: 'orange',
    icon: Rocket, currentTask: 'Analyse du bundle Vite...',
    tasksCompleted: 0, tasksTotal: 5, linesChanged: 0, filesFixed: 0,
    logs: ['[09:00] Build de production en cours...']
  }
];

const CTO_STEPS = [
  { task: 'Scan des 34 pages du frontend', log: 'Trouvé 34 pages, 28 composants, 12 hooks' },
  { task: 'Analyse des routes serveur', log: '44 endpoints API identifiés (4 public + 40 protégés)' },
  { task: 'Détection des features mock vs réelles', log: '4 routes in-memory détectées (invoices, messages, menuSales, priceHistory)' },
  { task: 'Évaluation de la dette technique', log: 'Score: 7.2/10 — Principaux points: persistance, sécurité, tests' },
  { task: 'Rédaction du sprint backlog', log: 'Sprint "Production Ready" créé — 10 tâches priorisées' }
];

const QA_STEPS = [
  { task: 'Compilation TypeScript (tsc --noEmit)', log: '2 265 modules compilés, 0 erreurs critiques' },
  { task: 'Build de production (vite build)', log: 'Build réussi en 6.2s — 87 chunks générés' },
  { task: 'Scan des unicode escapes', log: '0 séquences \\u00xx restantes dans les pages' },
  { task: 'Vérification des imports manquants', log: 'Tous les imports résolus correctement' },
  { task: 'Détection des catch vides', log: '3 catch blocks vides trouvés (Settings, RecipeDetail)' },
  { task: 'Scan des console.log', log: '12 console.log trouvés — à nettoyer' },
  { task: 'Vérification des URLs hardcodées', log: '0 localhost URL en production' },
  { task: 'Génération du rapport QA', log: 'Rapport créé: 2 critiques, 5 high, 8 medium, 12 low' }
];

const BACKEND_STEPS = [
  { task: 'Lecture du schéma Prisma actuel', log: '6 modèles existants: User, Supplier, Ingredient, Recipe, RecipeIngredient, InventoryItem' },
  { task: 'Création du modèle Invoice + InvoiceItem', log: 'Modèle créé avec FK vers Supplier et Ingredient' },
  { task: 'Création du modèle PriceHistory', log: 'Modèle créé avec index sur [ingredientId, date]' },
  { task: 'Création du modèle MenuSale', log: 'Modèle créé avec FK vers Recipe' },
  { task: 'Création des modèles Conversation + Message', log: 'Modèles créés avec cascade delete' },
  { task: 'Migration Prisma (db push)', log: 'prisma db push — 5 nouveaux modèles synchronisés' }
];

const CONTENT_STEPS = [
  { task: 'Scan complet des fichiers .tsx', log: '34 fichiers scannés dans client/src/pages/' },
  { task: 'Remplacement unicode Devis.tsx', log: '127 séquences remplacées par des caractères français' },
  { task: 'Correction accents Settings.tsx', log: '12 accents manquants corrigés (paramètres, sauvegardé, succès)' },
  { task: 'Traduction textes anglais', log: '"Upgrade" → "Passer au Pro", "Debug" → "Débogage"' },
  { task: 'Standardisation terminologie', log: '"recette" / "fiche technique" / "plat" harmonisés' },
  { task: 'Vérification espaces insécables', log: 'Espaces insécables ajoutés avant : ; ? !' },
  { task: 'Validation finale', log: 'grep -r "\\u00" → 0 résultat. Codebase 100% clean.' }
];

const DEVOPS_STEPS = [
  { task: 'Analyse du bundle (vite build)', log: 'Bundle principal: 420KB gzipped, 87 chunks lazy-loaded' },
  { task: 'Suppression imports inutilisés', log: '5 imports lucide-react supprimés (Download, Upload, WifiOff, Loader2)' },
  { task: 'Optimisation chargement catalogue', log: 'catalog.json: chargement différé, suppression du doublon Suppliers.tsx' },
  { task: 'Correction cache PWA', log: 'Service worker: versioning ajouté, skipWaiting activé' },
  { task: 'Scan fuites mémoire', log: '1 listener BLE non nettoyé corrigé dans useScale.ts' }
];

const ALL_STEPS = [CTO_STEPS, QA_STEPS, BACKEND_STEPS, CONTENT_STEPS, DEVOPS_STEPS];

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  red: { bg: 'bg-red-500', text: 'text-red-400', border: 'border-red-500/30', glow: 'shadow-red-500/20' },
  green: { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' },
  yellow: { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/30', glow: 'shadow-amber-500/20' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500/30', glow: 'shadow-purple-500/20' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500/30', glow: 'shadow-orange-500/20' }
};

export default function DevCorp() {
  const [agents, setAgents] = useState<AgentTask[]>(INITIAL_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [totalLines, setTotalLines] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Simulate agent progress
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));

      setAgents(prev => {
        const updated = prev.map((agent, idx) => {
          if (agent.status === 'done') return agent;

          const steps = ALL_STEPS[idx];
          const stepDuration = 2500 + Math.random() * 2000; // 2.5-4.5s per step
          const expectedStep = Math.min(
            Math.floor((Date.now() - startTime) / stepDuration),
            steps.length
          );

          if (expectedStep >= steps.length) {
            return {
              ...agent,
              status: 'done' as const,
              progress: 100,
              tasksCompleted: agent.tasksTotal,
              currentTask: 'Terminé !',
              linesChanged: Math.floor(Math.random() * 500) + 100,
              filesFixed: Math.floor(Math.random() * 20) + 5,
              logs: [
                ...steps.map((s, i) => `[${String(9).padStart(2, '0')}:${String(i * 2).padStart(2, '0')}] ${s.log}`),
                `[${String(9).padStart(2, '0')}:${String(steps.length * 2).padStart(2, '0')}] ✅ Mission terminée !`
              ]
            };
          }

          const progress = Math.floor((expectedStep / steps.length) * 100);
          const currentStep = steps[Math.min(expectedStep, steps.length - 1)];

          return {
            ...agent,
            progress,
            tasksCompleted: expectedStep,
            currentTask: currentStep.task,
            linesChanged: Math.floor(Math.random() * 50 * expectedStep),
            filesFixed: Math.floor(Math.random() * 3 * expectedStep),
            logs: steps.slice(0, expectedStep + 1).map((s, i) =>
              `[${String(9).padStart(2, '0')}:${String(i * 2).padStart(2, '0')}] ${s.log}`
            )
          };
        });

        const gp = Math.floor(updated.reduce((sum, a) => sum + a.progress, 0) / updated.length);
        setGlobalProgress(gp);
        setTotalLines(updated.reduce((sum, a) => sum + a.linesChanged, 0));
        setTotalFiles(updated.reduce((sum, a) => sum + a.filesFixed, 0));

        return updated;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [startTime]);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agents, selectedAgent]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const allDone = agents.every(a => a.status === 'done');
  const selected = agents.find(a => a.id === selectedAgent);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">RestauMargin Dev Corp</h1>
            <p className="text-slate-400 text-sm">Équipe d'agents autonomes — Sprint "Production Ready"</p>
          </div>
          <div className="ml-auto flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="font-mono text-slate-300">{formatTime(elapsed)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-slate-500" />
              <span className="text-slate-300">{totalFiles} fichiers</span>
            </div>
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-slate-500" />
              <span className="text-slate-300">{totalLines} lignes</span>
            </div>
          </div>
        </div>

        {/* Global progress */}
        <div className="mb-8 bg-slate-900 rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-300">Progression globale</span>
            <span className="text-sm font-mono text-blue-400">{globalProgress}%</span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out relative"
              style={{
                width: `${globalProgress}%`,
                background: allDone
                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)'
              }}
            >
              {!allDone && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              )}
            </div>
          </div>
          {allDone && (
            <div className="mt-3 flex items-center gap-2 text-emerald-400 text-sm animate-bounce">
              <CheckCircle2 className="w-4 h-4" />
              Sprint terminé ! Tous les agents ont complété leurs missions.
            </div>
          )}
        </div>

        {/* Agent grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
          {agents.map(agent => {
            const colors = colorMap[agent.color];
            const Icon = agent.icon;
            const isSelected = selectedAgent === agent.id;

            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(isSelected ? null : agent.id)}
                className={`relative text-left p-4 rounded-xl border transition-all duration-300 ${
                  isSelected
                    ? `${colors.border} bg-slate-800/80 shadow-lg ${colors.glow} scale-[1.02]`
                    : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                {/* Status indicator */}
                <div className="absolute top-3 right-3">
                  {agent.status === 'working' && (
                    <Loader2 className={`w-4 h-4 ${colors.text} animate-spin`} />
                  )}
                  {agent.status === 'done' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  {agent.status === 'error' && (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  )}
                </div>

                {/* Agent icon + name */}
                <div className={`w-10 h-10 rounded-lg ${colors.bg}/20 flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <h3 className="font-semibold text-sm mb-0.5">{agent.name}</h3>
                <p className="text-[10px] text-slate-500 mb-3">{agent.role}</p>

                {/* Progress bar */}
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full ${colors.bg} transition-all duration-700 ease-out`}
                    style={{ width: `${agent.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">{agent.tasksCompleted}/{agent.tasksTotal} tâches</span>
                  <span className={colors.text}>{agent.progress}%</span>
                </div>

                {/* Current task */}
                <div className="mt-3 pt-3 border-t border-slate-800">
                  <div className="flex items-start gap-1.5">
                    {agent.status === 'working' && (
                      <ChevronRight className={`w-3 h-3 mt-0.5 ${colors.text} flex-shrink-0`} />
                    )}
                    <p className="text-[11px] text-slate-400 leading-tight line-clamp-2">
                      {agent.currentTask}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected agent detail + logs */}
        {selected && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden animate-in">
            <div className="p-5 border-b border-slate-800 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg ${colorMap[selected.color].bg}/20 flex items-center justify-center`}>
                <selected.icon className={`w-5 h-5 ${colorMap[selected.color].text}`} />
              </div>
              <div>
                <h3 className="font-semibold">{selected.name} — {selected.role}</h3>
                <p className="text-sm text-slate-400">{selected.description}</p>
              </div>
              <div className="ml-auto flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="font-mono font-bold text-white">{selected.filesFixed}</div>
                  <div className="text-[10px] text-slate-500">fichiers</div>
                </div>
                <div className="text-center">
                  <div className="font-mono font-bold text-white">{selected.linesChanged}</div>
                  <div className="text-[10px] text-slate-500">lignes</div>
                </div>
              </div>
            </div>

            {/* Terminal logs */}
            <div className="bg-black/50 p-4 font-mono text-xs max-h-[300px] overflow-y-auto">
              <div className="text-slate-600 mb-2">$ restaumargin-dev-corp --agent={selected.id}</div>
              {selected.logs.map((log, i) => (
                <div
                  key={i}
                  className={`py-0.5 ${
                    log.includes('✅') ? 'text-emerald-400' :
                    log.includes('❌') ? 'text-red-400' :
                    'text-slate-300'
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {log}
                </div>
              ))}
              {selected.status === 'working' && (
                <div className="text-slate-500 animate-pulse mt-1">
                  <span className="inline-block w-2 h-3 bg-slate-500 animate-blink" /> En cours...
                </div>
              )}
              <div ref={logEndRef} />
            </div>
          </div>
        )}

        {/* Stats footer */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Globe, label: 'Pages', value: '34', color: 'text-blue-400' },
            { icon: Server, label: 'Endpoints API', value: '44', color: 'text-emerald-400' },
            { icon: Database, label: 'Modèles DB', value: '11', color: 'text-amber-400' },
            { icon: Zap, label: 'Temps de build', value: '6.2s', color: 'text-purple-400' }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <div className="font-mono font-bold text-lg">{stat.value}</div>
                <div className="text-[10px] text-slate-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Coffee break */}
        <div className="mt-8 text-center text-slate-600 text-xs flex items-center justify-center gap-2">
          <Coffee className="w-3 h-3" />
          Les agents travaillent pendant que vous prenez un café
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink { animation: blink 1s infinite; }
        .animate-in { animation: slideUp 0.3s ease-out; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
