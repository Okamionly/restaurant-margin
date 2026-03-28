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
  'Quelle marge pour un plat a 15\u20ac ?',
  "Conseils pour ma carte d'ete",
  'Analyser mes ingredients les plus chers',
  'Comment optimiser mes achats fournisseurs ?',
];

function getMockResponse(question: string): string {
  const q = question.toLowerCase();

  if (q.includes('marge') || q.includes('cout') || q.includes('co\u00fbt')) {
    return `Excellent sujet ! Voici mes conseils pour optimiser vos marges :

**Objectif : ratio cout matiere a 30%**

1. **Analysez chaque fiche technique** - Verifiez que le cout matiere de chaque plat ne depasse pas 30% du prix de vente TTC.

2. **Identifiez les plats a faible marge** - Utilisez le Menu Engineering de RestauMargin pour reperer les plats qui coutent trop cher par rapport a leur prix.

3. **Negociez avec vos fournisseurs** - Comparez les prix dans la Mercuriale et lancez des appels d'offres pour les produits cles.

4. **Reduisez le gaspillage** - Suivez vos pertes dans le module Gaspillage. Chaque kilo jete impacte directement votre marge.

5. **Ajustez vos portions** - Utilisez la Station Balance pour standardiser les grammages et eviter le surdosage.

Conseil : commencez par vos 5 plats les plus vendus, c'est la que l'impact sera le plus fort !`;
  }

  if (q.includes('carte') || q.includes('menu')) {
    return `Voici mes recommandations pour optimiser votre carte :

**Les regles d'or du Menu Engineering**

1. **Limitez le nombre de plats** - Idealement 7 a 10 plats par categorie. Trop de choix paralyse le client et complique votre gestion des stocks.

2. **Classez vos plats en 4 categories** :
   - Stars (populaires + rentables) : mettez-les en avant
   - Vaches a lait (populaires mais faible marge) : augmentez legerement le prix
   - Enigmes (rentables mais peu vendus) : ameliorez leur visibilite
   - Poids morts (peu vendus + faible marge) : a remplacer

3. **Positionnement strategique** - Placez vos plats a forte marge en haut a droite de la carte, c'est la zone la plus regardee.

4. **Carte saisonniere** - Adaptez votre offre aux produits de saison pour reduire les couts et proposer de la fraicheur.

5. **Descriptions appetissantes** - Un bon intitule peut augmenter les ventes d'un plat de 27%.

Utilisez le module Menu Engineering de RestauMargin pour analyser la performance de chaque plat !`;
  }

  if (q.includes('fournisseur') || q.includes('achat')) {
    return `Voici comment optimiser vos achats fournisseurs :

**Strategie d'achat intelligente**

1. **Diversifiez vos fournisseurs** - Ne dependez jamais d'un seul fournisseur. Ayez au moins 2-3 alternatives par categorie de produit.

2. **Comparez regulierement les prix** - Utilisez la Mercuriale RestauMargin pour suivre l'evolution des prix et detecter les hausses anormales.

3. **Groupez vos commandes** - Commandez en volume pour negocier de meilleurs tarifs. Le module Commandes Automatiques peut vous aider.

4. **Lancez des appels d'offres** - Pour les gros volumes (viande, poisson, produits laitiers), utilisez le module RFQ pour mettre en concurrence vos fournisseurs.

5. **Respectez la saisonnalite** - Les produits de saison sont moins chers et de meilleure qualite.

6. **Verifiez vos factures** - Scannez chaque facture avec le module Factures pour detecter les ecarts de prix automatiquement.

7. **Negociez les conditions** - Delais de paiement, franco de port, remises de fin d'annee... tout se negocie !

Astuce : dans RestauMargin, activez les alertes de prix pour etre notifie quand un ingredient depasse votre seuil.`;
  }

  if (q.includes('ingredient') || q.includes('cher') || q.includes('co\u00fbteux')) {
    return `Pour analyser et reduire le cout de vos ingredients :

**Analyse des ingredients les plus chers**

1. **Identifiez votre Top 10** - Dans le module Ingredients de RestauMargin, triez par prix au kilo pour voir vos produits les plus couteux.

2. **Calculez l'impact reel** - Un ingredient cher n'est pas forcement un probleme s'il est utilise en petite quantite. Regardez le cout par portion.

3. **Trouvez des alternatives** :
   - Beurre AOP -> beurre classique pour les cuissons
   - Vanille en gousse -> extrait de vanille pour certaines preparations
   - Saumon frais -> truite pour certains plats

4. **Optimisez l'utilisation** - Utilisez les parures et chutes dans d'autres preparations (bouillons, farces, garnitures).

5. **Ajustez les grammages** - Pesez systematiquement avec la Station Balance. 10g de trop par assiette sur 100 couverts, ca chiffre vite !

6. **Stockage optimal** - Un mauvais stockage = du gaspillage = de l'argent perdu. Respectez la chaine du froid et le FIFO.

Rendez-vous dans Ingredients > Trier par cout pour commencer votre analyse !`;
  }

  return `Merci pour votre question ! Voici quelques conseils generaux pour ameliorer la gestion de votre restaurant :

**Bonnes pratiques de gestion**

1. **Suivez vos indicateurs cles** - Consultez votre Tableau de Bord RestauMargin chaque matin : chiffre d'affaires, marge brute, ratio cout matiere.

2. **Maitrisez votre food cost** - L'objectif est de rester sous les 30% de cout matiere. Chaque point gagne, c'est de la marge en plus.

3. **Formez votre equipe** - Un personnel forme aux bonnes pratiques de dosage et de stockage peut vous faire economiser 5 a 10% sur les matieres premieres.

4. **Digitalisez vos process** - Fiches techniques, inventaires, commandes... RestauMargin centralise tout pour vous faire gagner du temps.

5. **Anticipez** - Utilisez le Planning pour prevoir vos besoins et eviter les ruptures comme le surstockage.

N'hesitez pas a me poser une question plus precise, je suis la pour vous aider !`;
}

// TODO: Replace with real Claude API call
async function getAIResponse(message: string): Promise<string> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800));
  // For now, mock responses
  return getMockResponse(message);
  // Future: POST /api/ai/chat with { message, context }
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Bonjour ! Je suis votre assistant IA RestauMargin. Je peux vous aider a optimiser vos marges, ameliorer votre carte, analyser vos couts et bien plus encore. Posez-moi une question ou selectionnez une suggestion ci-dessous !",
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
    // Simple markdown-like rendering for bold and line breaks
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
            <p className="text-sm text-slate-400">Votre conseiller cuisine & marges</p>
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
              {/* Avatar */}
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

              {/* Bubble */}
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
                    msg.role === 'user' ? 'text-blue-200' : 'text-slate-500'
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

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1.5 items-center h-5">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
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
              <span className="text-xs text-slate-500 font-medium">Suggestions</span>
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
                <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
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
          <p className="text-[10px] text-slate-600 mt-2 text-center">
            Assistant IA en version beta - Les reponses sont generees localement pour le moment
          </p>
        </div>
      </div>
    </div>
  );
}
