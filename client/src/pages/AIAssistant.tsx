import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, MessageSquare, Lightbulb } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  'Comment reduire mes couts matiere ?',
  'Quels plats ont la meilleure marge ?',
  'Analyse mes stocks critiques',
  'Comment optimiser ma carte ?',
  'Quels ingredients me coutent le plus cher ?',
];

// --- Mode demo : reponses predefinies sans appel API ---

interface DemoRule {
  keywords: string[];
  response: string;
}

const DEMO_RESPONSES: DemoRule[] = [
  {
    keywords: ['rentable', 'meilleure marge', 'plus rentable', 'marge plat'],
    response: `Voici le classement de vos **plats les plus rentables** ce mois-ci :

   1. **Entrecote grillee** — Marge : 72 % (cout : 4.80 EUR, prix vente : 24.90 EUR)
   2. **Risotto aux champignons** — Marge : 68 % (cout : 3.20 EUR, prix vente : 18.50 EUR)
   3. **Salade Caesar** — Marge : 65 % (cout : 2.90 EUR, prix vente : 14.90 EUR)
   4. **Burger maison** — Marge : 61 % (cout : 4.10 EUR, prix vente : 16.90 EUR)
   5. **Panna cotta** — Marge : 78 % (cout : 1.20 EUR, prix vente : 8.50 EUR)

**Recommandation** : Mettez en avant le risotto et la panna cotta dans vos suggestions du jour — ils combinent forte marge et popularite.`,
  },
  {
    keywords: ['cout matiere', 'couts matiere', 'reduire', 'reduire mes couts', 'economiser'],
    response: `Voici **5 leviers concrets** pour reduire vos couts matiere :

   1. **Negociez vos volumes** — Regroupez vos commandes viande et poisson sur 2 fournisseurs max. Gain estime : 8-12 %
   2. **Reduisez le gaspillage** — Vos pertes sur les legumes frais sont a 11 %. Objectif : passer sous 5 % avec un meilleur FIFO
   3. **Ajustez les grammages** — L'entrecote est servie a 320g, la norme brasserie est 280g. Economie : 0.95 EUR/portion
   4. **Valorisez les chutes** — Les parures de viande peuvent devenir des rillettes, les fanes de carottes un pesto. Gain : ~400 EUR/mois
   5. **Surveillez la saisonnalite** — Remplacez les tomates hors saison (4.20 EUR/kg) par des alternatives de saison (1.80 EUR/kg)

**Impact estime** : entre 1 200 et 2 000 EUR d'economie mensuelle en appliquant ces 5 actions.`,
  },
  {
    keywords: ['analyse', 'marges du mois', 'bilan', 'resume', 'synthese', 'tableau'],
    response: `**Synthese des marges — Mars 2026**

   | Categorie       | CA        | Cout matiere | Marge   | Evol.  |
   |-----------------|-----------|-------------|---------|--------|
   | Entrees         | 8 420 EUR | 2 526 EUR   | 70.0 %  | +2.1 % |
   | Plats           | 24 650 EUR| 8 628 EUR   | 65.0 %  | -0.5 % |
   | Desserts        | 6 180 EUR | 1 236 EUR   | 80.0 %  | +1.2 % |
   | Boissons        | 9 730 EUR | 2 432 EUR   | 75.0 %  | +0.3 % |
   | **TOTAL**       | **48 980 EUR** | **14 822 EUR** | **69.7 %** | **+0.6 %** |

**Points cles** :
- Marge globale en legere hausse (+0.6 pt vs fevrier)
- Les desserts restent votre meilleur segment (80 % de marge)
- Attention : la marge sur les plats recule de 0.5 pt, principalement a cause du prix du boeuf (+8 % ce mois)

**Action prioritaire** : Renogocier le tarif boeuf ou introduire une alternative (bavette, onglet) a moindre cout.`,
  },
  {
    keywords: ['stock', 'stocks critiques', 'rupture', 'inventaire'],
    response: `**Alertes stocks — Situation actuelle**

**En rupture imminente (< 2 jours)** :
- Filet de saumon — Reste : 1.2 kg (consommation moy. : 3.5 kg/jour)
- Creme fraiche 30% — Reste : 2 L (consommation moy. : 4 L/jour)

**Stock bas (< 5 jours)** :
- Filet de boeuf — Reste : 8 kg (consommation moy. : 2.1 kg/jour)
- Beurre doux — Reste : 3 kg (consommation moy. : 0.8 kg/jour)
- Farine T55 — Reste : 4 kg (consommation moy. : 1.2 kg/jour)

**Surstock detecte** :
- Huile d'olive — 45 L en stock (consommation moy. : 3 L/semaine = 15 semaines de stock)

**Recommandation** : Passez commande saumon et creme fraiche aujourd'hui. Suspendez les achats d'huile d'olive pour les 2 prochains mois.`,
  },
  {
    keywords: ['optimiser', 'carte', 'menu', 'engineering', 'menu engineering'],
    response: `**Analyse Menu Engineering de votre carte**

Basee sur la matrice popularite x rentabilite :

**Stars** (populaires + rentables) — A conserver :
- Entrecote grillee, Risotto champignons, Tiramisu

**Puzzles** (rentables mais peu vendus) — A promouvoir :
- Tartare de saumon (marge 71 %, seulement 8 ventes/semaine)
- Creme brulee (marge 82 %, 12 ventes/semaine)
   Action : mettez-les en suggestion du chef, ajoutez une photo sur la carte

**Chevaux de labour** (populaires mais faible marge) — A retravailler :
- Burger maison (45 ventes/sem mais marge 52 %)
- Pizza margherita (38 ventes/sem mais marge 48 %)
   Action : reduisez le grammage fromage (-15g), passez a un pain brioche maison

**Poids morts** (ni populaires ni rentables) — A retirer :
- Salade nicoise (6 ventes/sem, marge 44 %)
- Croque-monsieur (4 ventes/sem, marge 39 %)
   Action : retirez-les et remplacez par une nouveaute saisonniere`,
  },
  {
    keywords: ['ingredient', 'ingredients', 'cher', 'coutent le plus', 'depense'],
    response: `**Top 10 des ingredients les plus couteux** (30 derniers jours) :

   1. **Filet de boeuf** — 2 840 EUR (18.2 % du budget matiere)
   2. **Saumon frais** — 1 920 EUR (12.3 %)
   3. **Crevettes** — 1 150 EUR (7.4 %)
   4. **Fromages AOP** — 980 EUR (6.3 %)
   5. **Creme fraiche** — 620 EUR (4.0 %)
   6. **Beurre** — 540 EUR (3.5 %)
   7. **Legumes frais** — 480 EUR (3.1 %)
   8. **Huile d'olive** — 420 EUR (2.7 %)
   9. **Farine/Pates** — 310 EUR (2.0 %)
   10. **Herbes fraiches** — 280 EUR (1.8 %)

**Observation** : Le boeuf et le saumon representent a eux seuls **30 % de vos achats**. Envisagez un plat alternatif (bavette ou lieu noir) pour diluer cette concentration.`,
  },
  {
    keywords: ['fournisseur', 'fournisseurs', 'negocier', 'prix fournisseur'],
    response: `**Analyse de vos fournisseurs principaux**

   | Fournisseur       | Depense/mois | Delai paiement | Fiabilite |
   |-------------------|-------------|----------------|-----------|
   | Boucherie Martin  | 3 200 EUR   | 30 jours       | 95 %      |
   | Maree du Port     | 2 100 EUR   | 15 jours       | 88 %      |
   | Fruits & Co       | 1 400 EUR   | 30 jours       | 92 %      |
   | Metro Cash        | 2 800 EUR   | Comptant       | 99 %      |

**Recommandations** :
- **Boucherie Martin** : Demandez un palier volume a partir de 3 500 EUR/mois pour obtenir -5 %
- **Maree du Port** : 3 retards de livraison ce trimestre. Demandez un avoir ou cherchez une alternative
- **Metro** : Passez en compte pro pour obtenir un paiement a 15 jours et une remise de 3 %`,
  },
  {
    keywords: ['vente', 'ventes', 'chiffre', 'ca', 'performance', 'recette', 'recettes'],
    response: `**Performance des ventes — Dernieres 4 semaines**

**Chiffre d'affaires** : 48 980 EUR (+3.2 % vs mois precedent)
**Ticket moyen** : 28.50 EUR (+1.20 EUR)
**Nombre de couverts** : 1 718 (-12 vs mois precedent)

**Repartition par service** :
- Midi : 58 % du CA (stable)
- Soir : 42 % du CA (+2 pts)

**Jour le plus fort** : Samedi (8 420 EUR en moyenne)
**Jour le plus faible** : Lundi (3 180 EUR en moyenne)

**Tendance** : Le ticket moyen augmente grace a la nouvelle carte desserts. Le nombre de couverts baisse legerement — pensez a une offre "menu du lundi" pour dynamiser le debut de semaine.`,
  },
  {
    keywords: ['food cost', 'ratio', 'objectif', 'norme'],
    response: `**Analyse de votre Food Cost**

**Food cost actuel** : 30.3 % (objectif : 28-30 %)
**Tendance** : En legere hausse (+0.8 pt sur 3 mois)

**Decomposition par categorie** :
- Viandes : 34 % (au-dessus de la norme de 32 %)
- Poissons : 31 % (dans la norme)
- Legumes : 22 % (bon)
- Produits laitiers : 28 % (dans la norme)

**Les 3 plats qui plombent votre food cost** :
1. Cote de boeuf (food cost 42 % — trop eleve)
2. Plateau fruits de mer (food cost 38 %)
3. Burger premium (food cost 36 %)

**Plan d'action** : Augmentez le prix de la cote de boeuf de 2 EUR ou reduisez la portion de 50g pour revenir a 35 % de food cost.`,
  },
];

const FALLBACK_RESPONSE = `Merci pour votre question ! Voici ce que je peux analyser pour vous :

- **Marges et rentabilite** — "Quel est mon plat le plus rentable ?"
- **Couts matiere** — "Comment reduire mes couts ?"
- **Stocks** — "Analyse mes stocks critiques"
- **Menu engineering** — "Comment optimiser ma carte ?"
- **Fournisseurs** — "Analyse mes fournisseurs"
- **Ventes** — "Quel est mon chiffre du mois ?"
- **Food cost** — "Analyse mon food cost"

N'hesitez pas a me poser une de ces questions pour obtenir une analyse detaillee avec des donnees chiffrees !`;

function getDemoResponse(message: string): string {
  const lower = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const rule of DEMO_RESPONSES) {
    for (const kw of rule.keywords) {
      const kwNorm = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (lower.includes(kwNorm)) {
        return rule.response;
      }
    }
  }
  return FALLBACK_RESPONSE;
}

async function getAIResponse(message: string): Promise<string> {
  // Simule un delai de reflexion realiste (800-2000ms)
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));
  return getDemoResponse(message);
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Bonjour ! Je suis votre **assistant IA RestauMargin**. J'analyse les donnees reelles de votre restaurant — recettes, marges, stocks, ventes — pour vous donner des conseils personnalises. Posez-moi une question !",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function handleSend(text?: string) {
    const messageText = (text || input).trim();
    if (!messageText || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await getAIResponse(messageText);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Desole, une erreur s'est produite. Veuillez reessayer.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function formatContent(content: string) {
    return content.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={j} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={j}>{part}</span>;
      });

      if (line.trim() === '') return <br key={i} />;
      return (
        <div key={i} className={line.startsWith('   ') ? 'ml-4' : ''}>
          {parts}
        </div>
      );
    });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-h-[900px]">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Assistant IA RestauMargin</h1>
            <p className="text-sm text-slate-400">Analyse vos donnees en temps reel</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">Mode Demo</span>
          </div>
        </div>
      </div>

      {/* Chat container */}
      <div className="flex-1 flex flex-col bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user'
                    ? 'bg-blue-600'
                    : 'bg-gradient-to-br from-blue-500 to-purple-600'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-slate-800 text-slate-300 rounded-bl-md border border-slate-700/50'
                }`}
              >
                {formatContent(msg.content)}
                <div
                  className={`text-[10px] mt-2 ${
                    msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 items-center h-5">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                  <span className="text-xs text-slate-400">Analyse de vos donnees...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick suggestions */}
        {messages.length <= 1 && !isTyping && (
          <div className="px-4 pb-2">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs text-slate-400 font-medium">Suggestions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 rounded-full transition-all duration-200"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div className="border-t border-slate-800 p-3">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question..."
                rows={1}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none transition-all"
                style={{ minHeight: '44px', maxHeight: '120px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
              <div className="absolute right-2 bottom-1.5 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-slate-300" />
              </div>
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="flex-shrink-0 p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-slate-300 mt-2 text-center">
            Propulse par Claude AI — Analyse vos donnees restaurant en temps reel
          </p>
        </div>
      </div>
    </div>
  );
}
