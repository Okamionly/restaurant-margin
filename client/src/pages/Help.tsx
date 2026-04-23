import { useState } from 'react';
import { Search, ChevronRight, ChevronLeft, BookOpen, CreditCard, User, HelpCircle, Utensils, Truck, MessageSquare, Mail } from 'lucide-react';

// ---------- Data ----------

interface Article {
  id: string;
  category: string;
  title: string;
  summary: string;
  steps: string[];
  tags?: string[];
}

interface Category {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const CATEGORIES: Category[] = [
  { id: 'recettes', label: 'Fiches techniques', icon: Utensils, color: 'teal', description: 'Creer et gerer vos fiches techniques et food cost' },
  { id: 'fournisseurs', label: 'Fournisseurs', icon: Truck, color: 'orange', description: 'Gerer votre mercuriale et vos commandes fournisseurs' },
  { id: 'marges', label: 'Marges & analytics', icon: BookOpen, color: 'blue', description: 'Comprendre vos marges, food cost et tableaux de bord' },
  { id: 'facturation', label: 'Abonnement & facturation', icon: CreditCard, color: 'purple', description: 'Gerer votre plan, vos factures et votre abonnement' },
  { id: 'compte', label: 'Mon compte', icon: User, color: 'gray', description: 'Profil, equipe, mot de passe et parametres' },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  teal:   { bg: 'bg-teal-50 dark:bg-teal-950/20',   text: 'text-teal-700 dark:text-teal-400',   border: 'border-teal-200 dark:border-teal-800',   icon: 'text-teal-600' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-950/20', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800', icon: 'text-orange-600' },
  blue:   { bg: 'bg-blue-50 dark:bg-blue-950/20',   text: 'text-blue-700 dark:text-blue-400',   border: 'border-blue-200 dark:border-blue-800',   icon: 'text-blue-600' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-950/20', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800', icon: 'text-purple-600' },
  gray:   { bg: 'bg-[#F5F5F5] dark:bg-[#1A1A1A]',   text: 'text-[#525252] dark:text-[#A3A3A3]',   border: 'border-[#E5E7EB] dark:border-[#262626]',   icon: 'text-[#737373]' },
};

const ARTICLES: Article[] = [
  // Fiches techniques
  {
    id: 'ft-creer',
    category: 'recettes',
    title: 'Comment creer une fiche technique ?',
    summary: 'Ajoutez vos plats et laissez l\'IA calculer automatiquement le food cost et la marge.',
    steps: [
      'Allez dans **Fiches techniques** dans le menu lateral',
      'Cliquez sur **+ Nouvelle fiche**',
      'Saisissez le nom du plat — l\'IA peut proposer des ingredients automatiquement',
      'Ajoutez chaque ingredient avec sa quantite et son unite (g, kg, L...)',
      'Definissez le **prix de vente** et le nombre de **portions**',
      'Le food cost (%) et la marge (€) sont calcules en temps reel',
      'Cliquez **Sauvegarder** — la fiche est accessible depuis partout',
    ],
    tags: ['fiche', 'recette', 'food cost', 'IA'],
  },
  {
    id: 'ft-ia',
    category: 'recettes',
    title: 'Generer une recette avec l\'IA',
    summary: 'RestauMargin peut proposer ingredients et quantites depuis le nom du plat.',
    steps: [
      'Creez une nouvelle fiche technique (menu > + Nouvelle fiche)',
      'Saisissez le nom du plat dans le champ titre',
      'Cliquez sur l\'icone **etoile IA** a cote du champ titre',
      'L\'IA genere une liste d\'ingredients avec quantites standard',
      'Ajustez les quantites selon votre recette reelle',
      'Les prix sont pris depuis votre mercuriale (si configuree) ou en saisie manuelle',
    ],
    tags: ['IA', 'generation', 'ingredients'],
  },
  {
    id: 'ft-modifier',
    category: 'recettes',
    title: 'Modifier ou supprimer une fiche technique',
    summary: 'Mettez a jour vos fiches quand les prix changent ou que la recette evolue.',
    steps: [
      'Ouvrez la fiche technique a modifier depuis la liste',
      'Cliquez sur **Modifier** (icone crayon)',
      'Changez ingredients, quantites ou prix de vente selon vos besoins',
      'Le food cost est recalcule instantanement',
      'Sauvegardez — l\'historique des modifications est conserve',
      'Pour supprimer : cliquez sur les trois points **...** puis **Supprimer**',
    ],
    tags: ['modifier', 'supprimer', 'mettre a jour'],
  },
  // Fournisseurs
  {
    id: 'four-ajouter',
    category: 'fournisseurs',
    title: 'Ajouter un fournisseur',
    summary: 'Centralisez tous vos fournisseurs et leurs tarifs dans RestauMargin.',
    steps: [
      'Allez dans **Fournisseurs** dans le menu',
      'Cliquez sur **+ Ajouter un fournisseur**',
      'Renseignez le nom, la categorie (boucherie, epicerie...) et les coordonnees',
      'Ajoutez les produits que vous achetez chez lui avec leurs prix',
      'Ces prix alimentent automatiquement le calcul de food cost dans vos fiches',
      'Vous pouvez mettre a jour les prix depuis la mercuriale',
    ],
    tags: ['fournisseur', 'ajout', 'mercuriale'],
  },
  {
    id: 'four-mercuriale',
    category: 'fournisseurs',
    title: 'Mettre a jour les prix via la mercuriale',
    summary: 'La mercuriale suit l\'evolution des prix dans le temps et impacte vos marges.',
    steps: [
      'Allez dans **Mercuriale** (menu Intelligence)',
      'Selectionnez le produit dont le prix a change',
      'Saisissez le nouveau prix et la date',
      'RestauMargin recalcule automatiquement le food cost de toutes les fiches utilisant ce produit',
      'Vous pouvez voir l\'historique des prix et identifier les derives',
      'Une alerte apparait si un prix monte de plus de 10% en un mois',
    ],
    tags: ['mercuriale', 'prix', 'historique'],
  },
  // Marges
  {
    id: 'marges-food-cost',
    category: 'marges',
    title: 'Comprendre le food cost',
    summary: 'Le food cost est le pourcentage du cout des ingredients par rapport au prix de vente.',
    steps: [
      'Food cost (%) = (Cout ingredients / Prix de vente) x 100',
      'Exemple : un plat a 12€ avec 3,60€ d\'ingredients = 30% de food cost',
      'La cible standard en restauration : **entre 28% et 35%**',
      'Au-dela de 35% : vos ingredients coutent trop cher ou votre prix est trop bas',
      'En-dessous de 20% : verifiez les quantites — une erreur de saisie est possible',
      'Le tableau de bord affiche le food cost moyen de toute votre carte',
    ],
    tags: ['food cost', 'marge', 'calcul'],
  },
  {
    id: 'marges-dashboard',
    category: 'marges',
    title: 'Lire le tableau de bord',
    summary: 'Le dashboard centralise vos indicateurs cles : food cost moyen, marge, top plats.',
    steps: [
      'Allez sur **Tableau de bord** — accessible des la page d\'accueil apres connexion',
      'Le **food cost moyen** en haut indique la sante globale de votre carte',
      'La liste **Top marges** montre vos plats les plus rentables',
      'La liste **Alertes food cost** signale les plats au-dela de 35%',
      'Le graphique d\'evolution suit vos marges dans le temps',
      'Cliquez sur un plat pour ouvrir directement sa fiche technique',
    ],
    tags: ['dashboard', 'indicateurs', 'analyse'],
  },
  // Facturation
  {
    id: 'fact-abonnement',
    category: 'facturation',
    title: 'Gerer mon abonnement',
    summary: 'Changez de plan, telechargez vos factures ou annulez depuis le portail Stripe.',
    steps: [
      'Allez dans **Parametres > Abonnement** ou directement sur **/abonnement**',
      'Cliquez sur **Gerer mon abonnement** — le portail Stripe s\'ouvre',
      'Dans le portail Stripe vous pouvez : changer de plan, mettre a jour la carte, telecharger les factures',
      'Pour annuler : dans le portail Stripe, cliquez **Annuler l\'abonnement**',
      'Vous conservez l\'acces jusqu\'a la fin de la periode deja payee',
      'Un email de confirmation vous est envoye apres chaque action',
    ],
    tags: ['abonnement', 'facture', 'Stripe', 'annuler'],
  },
  // Compte
  {
    id: 'compte-mdp',
    category: 'compte',
    title: 'Reinitialiser mon mot de passe',
    summary: 'Vous avez oublie votre mot de passe ? Suivez ces etapes.',
    steps: [
      'Allez sur **restaumargin.fr/login**',
      'Cliquez sur **Mot de passe oublie ?**',
      'Saisissez votre adresse email',
      'Verifiez votre boite mail — pensez aux **spams**',
      'Cliquez le lien de reinitialisation (valable 1 heure)',
      'Choisissez un nouveau mot de passe et confirmez',
    ],
    tags: ['mot de passe', 'connexion', 'reinitialiser'],
  },
  {
    id: 'compte-equipe',
    category: 'compte',
    title: 'Inviter un membre de mon equipe',
    summary: 'Donnez acces a votre chef ou manager en quelques secondes.',
    steps: [
      'Allez dans **Parametres > Equipe**',
      'Cliquez sur **Inviter un membre**',
      'Saisissez l\'email de la personne',
      'Choisissez le role : **Admin** (acces complet) ou **Membre** (lecture + edition)',
      'Un email d\'invitation est envoye automatiquement',
      'La personne doit creer son compte avec le meme email pour acceder au restaurant',
    ],
    tags: ['equipe', 'inviter', 'collaborer'],
  },
];

// ---------- Bold markdown renderer ----------
function renderBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="font-semibold text-[#111111] dark:text-white">{part}</strong>
      : <span key={i}>{part}</span>
  );
}

// ---------- Component ----------

export default function Help() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  // Search + filter logic
  const q = query.toLowerCase().trim();
  const filtered = ARTICLES.filter(a => {
    const matchCat = !activeCategory || a.category === activeCategory;
    const matchQuery = !q ||
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      (a.tags || []).some(t => t.toLowerCase().includes(q));
    return matchCat && matchQuery;
  });

  const catForArticle = (a: Article) => CATEGORIES.find(c => c.id === a.category);

  if (activeArticle) {
    const cat = catForArticle(activeArticle);
    const colors = COLOR_MAP[cat?.color || 'gray'];
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => setActiveArticle(null)}
          className="flex items-center gap-2 text-sm text-[#737373] dark:text-[#A3A3A3] hover:text-teal-600 dark:hover:text-teal-400 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Retour au centre d'aide
        </button>

        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4 ${colors.bg} ${colors.text} border ${colors.border}`}>
          {cat && <cat.icon className={`w-3.5 h-3.5 ${colors.icon}`} />}
          {cat?.label}
        </div>

        <h1 className="text-2xl font-bold text-[#111111] dark:text-white mb-3">{activeArticle.title}</h1>
        <p className="text-[#737373] dark:text-[#A3A3A3] mb-8 leading-relaxed">{activeArticle.summary}</p>

        <div className="space-y-4">
          {activeArticle.steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold mt-0.5">
                {i + 1}
              </div>
              <p className="text-[#111111] dark:text-white leading-relaxed pt-0.5">
                {renderBold(step)}
              </p>
            </div>
          ))}
        </div>

        {/* Still need help block */}
        <div className="mt-10 p-5 rounded-2xl bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#111111] dark:text-white mb-1">Toujours bloque ?</p>
              <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mb-3">
                Notre equipe repond sous 24h en semaine. Ecrivez-nous ou utilisez le chat en bas a droite.
              </p>
              <a
                href="mailto:contact@restaumargin.fr"
                className="inline-flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-500 font-medium"
              >
                <Mail className="w-4 h-4" />
                contact@restaumargin.fr
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 mb-4">
          <HelpCircle className="w-7 h-7 text-teal-600" />
        </div>
        <h1 className="text-3xl font-bold text-[#111111] dark:text-white mb-2">Centre d'aide</h1>
        <p className="text-[#737373] dark:text-[#A3A3A3]">Reponse humaine sous 24h en semaine</p>
      </div>

      {/* Search bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setActiveCategory(null); }}
          placeholder="Rechercher : food cost, mot de passe, fournisseur..."
          className="w-full pl-12 pr-4 py-3.5 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-[#111111] dark:text-white placeholder-[#9CA3AF] text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Categories (shown when no query) */}
      {!q && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {CATEGORIES.map(cat => {
            const colors = COLOR_MAP[cat.color];
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(isActive ? null : cat.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isActive
                    ? `${colors.bg} ${colors.border}`
                    : 'bg-white dark:bg-[#0A0A0A] border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-teal-300 dark:hover:border-teal-700'
                }`}
              >
                <cat.icon className={`w-5 h-5 mb-2 ${isActive ? colors.icon : 'text-[#737373] dark:text-[#A3A3A3]'}`} />
                <p className={`text-sm font-semibold mb-0.5 ${isActive ? colors.text : 'text-[#111111] dark:text-white'}`}>
                  {cat.label}
                </p>
                <p className="text-xs text-[#9CA3AF] dark:text-[#737373] leading-snug">{cat.description}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* Active category label */}
      {activeCategory && !q && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-[#111111] dark:text-white">
            {CATEGORIES.find(c => c.id === activeCategory)?.label}
          </span>
          <button
            onClick={() => setActiveCategory(null)}
            className="text-xs text-[#737373] hover:text-teal-600 underline"
          >
            Toutes les categories
          </button>
        </div>
      )}

      {/* Articles list */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map(article => {
            const cat = catForArticle(article);
            const colors = COLOR_MAP[cat?.color || 'gray'];
            return (
              <button
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className="w-full flex items-center gap-4 p-4 bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl hover:border-teal-300 dark:hover:border-teal-700 transition-all text-left group"
              >
                <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${colors.bg} border ${colors.border}`}>
                  {cat && <cat.icon className={`w-4.5 h-4.5 ${colors.icon}`} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111111] dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {article.title}
                  </p>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3] truncate mt-0.5">{article.summary}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-teal-500 flex-shrink-0 transition-colors" />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-[#F5F5F5] dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <HelpCircle className="w-10 h-10 text-[#D4D4D4] dark:text-[#404040] mx-auto mb-3" />
          <p className="font-medium text-[#111111] dark:text-white mb-1">Aucun article trouve pour "{query}"</p>
          <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mb-4">
            Notre equipe peut vous aider directement.
          </p>
          <a
            href="mailto:contact@restaumargin.fr"
            className="inline-flex items-center gap-2 text-sm bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Mail className="w-4 h-4" />
            Envoyer un message
          </a>
        </div>
      )}

      {/* Video tutos placeholder */}
      <div className="mt-10 p-5 rounded-2xl bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF] dark:text-[#737373] mb-2">Bientot disponible</p>
        <p className="text-sm font-semibold text-[#111111] dark:text-white mb-1">Tutoriels video</p>
        <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
          Des videos de 2-3 minutes pour maitriser chaque fonctionnalite. Rejoignez la liste d'attente en nous ecrivant a{' '}
          <a href="mailto:contact@restaumargin.fr" className="text-teal-600 dark:text-teal-400 hover:underline">
            contact@restaumargin.fr
          </a>.
        </p>
      </div>

      {/* Contact block */}
      <div className="mt-4 p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800">
        <div className="flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-teal-700 dark:text-teal-400 mb-1">Besoin d'aide personnalisee ?</p>
            <p className="text-sm text-teal-600/80 dark:text-teal-500 mb-3">
              Chat disponible en bas a droite &mdash; reponse sous quelques heures en semaine (lun-ven 9h-18h).
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:contact@restaumargin.fr"
                className="inline-flex items-center gap-2 text-sm bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                <Mail className="w-4 h-4" />
                contact@restaumargin.fr
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
