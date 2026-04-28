import { useState, useMemo } from 'react';
import {
  Search,
  ChefHat,
  Truck,
  BarChart3,
  CreditCard,
  Settings,
  MessageSquare,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Video,
  FileText,
  Lightbulb,
  Mail,
  ArrowRight,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  readTime: string;
  content: string[];
}

interface Category {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

// ── Static data ────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  {
    id: 'recettes',
    label: 'Fiches techniques & Recettes',
    icon: ChefHat,
    color: 'teal',
    description: 'Créer, gérer et analyser vos fiches techniques',
  },
  {
    id: 'fournisseurs',
    label: 'Fournisseurs & Commandes',
    icon: Truck,
    color: 'orange',
    description: 'Gérer vos fournisseurs et automatiser vos commandes',
  },
  {
    id: 'marges',
    label: 'Marges & Food Cost',
    icon: BarChart3,
    color: 'blue',
    description: 'Calculer vos coûts et optimiser votre rentabilité',
  },
  {
    id: 'facturation',
    label: 'Facturation & Abonnement',
    icon: CreditCard,
    color: 'purple',
    description: 'Gérer votre abonnement et vos factures',
  },
  {
    id: 'compte',
    label: 'Mon compte',
    icon: Settings,
    color: 'gray',
    description: 'Paramètres, équipe et sécurité',
  },
];

const ARTICLES: Article[] = [
  // ── Recettes ──
  {
    id: 'recettes-creer',
    title: 'Créer votre première fiche technique',
    summary: 'Étapes complètes pour créer une fiche technique avec calcul de food cost automatique.',
    category: 'recettes',
    tags: ['fiche technique', 'food cost', 'démarrage'],
    readTime: '4 min',
    content: [
      'Accédez à **Fiches techniques** depuis le menu latéral.',
      'Cliquez sur le bouton **+ Nouvelle fiche** en haut à droite.',
      'Saisissez le nom du plat, la catégorie et le prix de vente.',
      "Ajoutez vos ingrédients un par un — l'IA peut suggérer des quantités typiques.",
      "Le food cost s'affiche automatiquement. Cible recommandée : < 30 % pour les restaurants gastro, < 35 % pour la brasserie.",
      'Sauvegardez et partagez la fiche via QR code si besoin.',
    ],
  },
  {
    id: 'recettes-ia',
    title: "Générer une recette avec l'IA",
    summary: "L'assistant IA peut générer des fiches techniques à partir d'un nom de plat.",
    category: 'recettes',
    tags: ['IA', 'fiche technique', 'automatisation'],
    readTime: '3 min',
    content: [
      "Ouvrez l'**Assistant IA** depuis le menu (icône étoile).",
      'Tapez ou dites : *"Génère une fiche technique pour un risotto aux cèpes 4 portions"*.',
      "L'IA génère les ingrédients, quantités, et instructions en quelques secondes.",
      'Importez directement dans vos fiches techniques via le bouton **Créer la fiche**.',
      "Ajustez les quantités et vérifiez le food cost calculé avant de valider.",
    ],
  },
  {
    id: 'recettes-food-cost',
    title: 'Comprendre le food cost affiché',
    summary: "Explication du calcul food cost et des seuils d'alerte.",
    category: 'recettes',
    tags: ['food cost', 'rentabilité', 'calcul'],
    readTime: '3 min',
    content: [
      'Le **food cost** = (coût total des ingrédients) / (prix de vente HT) × 100.',
      'Seuils de référence : < 28 % excellent, 28–35 % bon, 35–40 % attention, > 40 % problématique.',
      'Le coût affiché ne prend pas en compte la main-d\'oeuvre. Pour inclure le labor cost, renseignez le **taux horaire** dans les paramètres de la recette.',
      'Un ingrédient en rouge indique une variation de prix récente chez votre fournisseur.',
      'Utilisez le filtre **rentabilité** sur la liste des fiches pour trier du plus au moins rentable.',
    ],
  },
  // ── Fournisseurs ──
  {
    id: 'fournisseurs-ajouter',
    title: 'Ajouter et gérer vos fournisseurs',
    summary: 'Comment ajouter un fournisseur, renseigner ses coordonnées et lier les ingrédients.',
    category: 'fournisseurs',
    tags: ['fournisseurs', 'gestion', 'ingrédients'],
    readTime: '3 min',
    content: [
      'Rendez-vous dans **Fournisseurs** depuis la sidebar.',
      'Cliquez **+ Nouveau fournisseur** et renseignez nom, email, téléphone et conditions de paiement.',
      "Après création, liez vos ingrédients à ce fournisseur depuis l'onglet **Ingrédients** — cela permet de suivre les variations de prix.",
      'RestauMargin envoie automatiquement des emails de commande si vous configurez un **email fournisseur**.',
      'Ajoutez un numéro WhatsApp pour déclencher des commandes directement depuis l\'application.',
    ],
  },
  {
    id: 'fournisseurs-commandes',
    title: 'Automatiser vos commandes fournisseurs',
    summary: 'Configurer les seuils de stock pour déclencher des commandes automatiques.',
    category: 'fournisseurs',
    tags: ['commandes', 'automatisation', 'stock'],
    readTime: '5 min',
    content: [
      "Dans **Inventaire**, définissez un **stock minimum** pour chaque ingrédient clé.",
      "Quand le stock descend sous ce seuil, RestauMargin génère une **suggestion de commande**.",
      "Accédez aux suggestions dans **Commandes → Auto-commandes**.",
      "Validez d'un clic : un email structuré est envoyé au fournisseur avec les quantités calculées.",
      "Les bons de commande sont archivés et accessibles depuis **Commandes → Historique**.",
    ],
  },
  // ── Marges ──
  {
    id: 'marges-dashboard',
    title: 'Lire votre tableau de bord marges',
    summary: 'Les 5 indicateurs clés du dashboard et comment les interpréter.',
    category: 'marges',
    tags: ['dashboard', 'marges', 'KPIs'],
    readTime: '4 min',
    content: [
      '**Food cost moyen** : moyenne pondérée par les ventes sur la période sélectionnée.',
      '**Marge brute** : chiffre d\'affaires - coût matière. Ne confondez pas avec la marge nette.',
      '**Top plats rentables** : vos 5 fiches avec le meilleur ratio vente × marge.',
      '**Variation prix ingrédients** : alerte si un ingrédient a varié de plus de 5 % ce mois.',
      '**Report hebdomadaire** : reçu par email chaque lundi — vérifiez votre boîte spam si absent.',
    ],
  },
  {
    id: 'marges-optimiser',
    title: 'Optimiser vos marges avec le Menu Engineering',
    summary: 'Utiliser la matrice Stars / Plowhorses / Puzzles / Dogs pour piloter votre carte.',
    category: 'marges',
    tags: ['menu engineering', 'optimisation', 'carte'],
    readTime: '5 min',
    content: [
      'Accédez à **Menu Engineering** depuis le menu Intelligence.',
      'La matrice classe vos plats selon leur popularité et leur contribution marginale.',
      '**Stars** : populaires ET rentables — mettez-les en avant, ne changez pas le prix.',
      '**Plowhorses** : populaires MAIS peu rentables — réduire les coûts ou augmenter légèrement le prix.',
      '**Puzzles** : rentables MAIS peu vendus — mettre en avant (photos, suggestions serveur).',
      '**Dogs** : ni populaires ni rentables — à retirer ou repositionner.',
    ],
  },
  // ── Facturation ──
  {
    id: 'facturation-abonnement',
    title: 'Gérer votre abonnement',
    summary: 'Changer de plan, mettre à jour le moyen de paiement, télécharger vos factures.',
    category: 'facturation',
    tags: ['abonnement', 'paiement', 'plan'],
    readTime: '3 min',
    content: [
      'Accédez à **Mon abonnement** depuis la sidebar bas.',
      'Le bouton **Gérer via Stripe** ouvre le portail Stripe sécurisé.',
      'Depuis Stripe, vous pouvez : mettre à jour la CB, télécharger les factures, résilier.',
      "Pour passer du plan Pro au plan Business, cliquez **Mettre à niveau** — l'upgrade est immédiat et la différence est calculée au prorata.",
      "En cas de problème de paiement, vous recevez un email automatique avec un lien pour régulariser.",
    ],
  },
  // ── Compte ──
  {
    id: 'compte-equipe',
    title: 'Inviter un membre de votre équipe',
    summary: 'Ajouter un chef ou manager avec accès limité à votre restaurant.',
    category: 'compte',
    tags: ['équipe', 'utilisateurs', 'rôles'],
    readTime: '3 min',
    content: [
      "Dans **Paramètres → Équipe**, cliquez **Inviter un membre**.",
      "Entrez l'email de votre collaborateur. Il recevra un email d'invitation avec un lien d'accès.",
      "Les rôles disponibles : **Chef** (accès complet aux recettes et inventaire) et **Admin** (accès complet incluant les données financières).",
      "Un membre Chef ne voit pas les marges ni les données d'abonnement.",
      "Vous pouvez retirer un accès à tout moment depuis la même page.",
    ],
  },
  {
    id: 'compte-mot-de-passe',
    title: 'Réinitialiser votre mot de passe',
    summary: 'Procédure de récupération de compte si vous avez oublié votre mot de passe.',
    category: 'compte',
    tags: ['mot de passe', 'sécurité', 'connexion'],
    readTime: '2 min',
    content: [
      'Sur la page de connexion, cliquez **Mot de passe oublié**.',
      'Entrez votre email de compte RestauMargin.',
      'Vérifiez votre boîte mail — le lien de réinitialisation est valable 1 heure.',
      "Si l'email n'arrive pas : vérifiez les spams, ou contactez contact@restaumargin.fr.",
      "Votre nouveau mot de passe doit faire au moins 6 caractères.",
    ],
  },
];

// ── Color map ──────────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-950/20',
    text: 'text-teal-700 dark:text-teal-400',
    border: 'border-teal-200 dark:border-teal-800',
    iconBg: 'bg-teal-100 dark:bg-teal-900/40',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    text: 'text-orange-700 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800',
    iconBg: 'bg-orange-100 dark:bg-orange-900/40',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
    iconBg: 'bg-purple-100 dark:bg-purple-900/40',
  },
  gray: {
    bg: 'bg-[#F9FAFB] dark:bg-mono-50',
    text: 'text-[#374151] dark:text-[#D1D5DB]',
    border: 'border-mono-900 dark:border-mono-200',
    iconBg: 'bg-mono-950 dark:bg-[#171717]',
  },
};

// ── Subcomponents ──────────────────────────────────────────────────────────────

function ArticleCard({ article, onClick }: { article: Article; onClick: () => void }) {
  const cat = CATEGORIES.find((c) => c.id === article.category);
  const colors = COLOR_MAP[cat?.color || 'gray'];

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white dark:bg-mono-50/50 border border-mono-900 dark:border-mono-200 rounded-2xl p-5 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-sm transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-sm font-semibold text-mono-100 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug">
          {article.title}
        </h3>
        <ChevronRight className="w-4 h-4 text-[#9CA3AF] dark:text-mono-500 flex-shrink-0 mt-0.5 group-hover:text-teal-500 transition-colors" />
      </div>
      <p className="text-xs text-[#6B7280] dark:text-mono-700 leading-relaxed mb-3">
        {article.summary}
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
          <FileText className="w-3 h-3" />
          {cat?.label}
        </span>
        <span className="text-[11px] text-[#9CA3AF] dark:text-mono-500">{article.readTime} de lecture</span>
      </div>
    </button>
  );
}

function ArticleDetail({ article, onBack }: { article: Article; onBack: () => void }) {
  const cat = CATEGORIES.find((c) => c.id === article.category);
  const Icon = cat?.icon || FileText;
  const colors = COLOR_MAP[cat?.color || 'gray'];

  const renderLine = (line: string) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i} className="font-semibold text-mono-100 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="bg-white dark:bg-mono-50/50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 sm:p-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] dark:text-mono-700 hover:text-teal-600 dark:hover:text-teal-400 mb-6 transition-colors"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        Retour aux articles
      </button>

      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.bg} ${colors.text} text-xs font-medium mb-4`}>
        <Icon className="w-3.5 h-3.5" />
        {cat?.label}
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-mono-100 dark:text-white mb-2 font-satoshi">
        {article.title}
      </h2>
      <p className="text-sm text-[#6B7280] dark:text-mono-700 mb-6">{article.readTime} de lecture</p>

      <div className="space-y-4">
        {article.content.map((line, i) => (
          <div key={i} className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 text-xs font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <p className="text-sm text-[#374151] dark:text-[#D1D5DB] leading-relaxed">{renderLine(line)}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-xl bg-[#F0FDF4] dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800">
        <p className="text-sm text-teal-800 dark:text-teal-300 font-medium mb-1">Besoin d'aide supplémentaire ?</p>
        <p className="text-xs text-teal-700 dark:text-teal-400">
          Notre équipe répond sous 24h.{' '}
          <a
            href="mailto:contact@restaumargin.fr"
            className="underline hover:no-underline font-medium"
          >
            Écrire à contact@restaumargin.fr
          </a>
        </p>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function Help() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openArticle, setOpenArticle] = useState<Article | null>(null);

  const filtered = useMemo(() => {
    let result = ARTICLES;
    if (selectedCategory) result = result.filter((a) => a.category === selectedCategory);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [query, selectedCategory]);

  if (openArticle) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <ArticleDetail article={openArticle} onBack={() => setOpenArticle(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* ── Header ── */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-900/40 mb-2">
          <BookOpen className="w-7 h-7 text-teal-600 dark:text-teal-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-mono-100 dark:text-white font-satoshi">
          Centre d'aide RestauMargin
        </h1>
        <p className="text-[#6B7280] dark:text-mono-700 text-sm max-w-md mx-auto">
          Trouvez les réponses à vos questions. Réponse humaine sous 24h si besoin.
        </p>
      </div>

      {/* ── Search ── */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-mono-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un article... (ex: food cost, fournisseur, mot de passe)"
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-mono-975 dark:bg-mono-300 border border-mono-900 dark:border-mono-300 text-mono-100 dark:text-white placeholder-[#9CA3AF] dark:placeholder-mono-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-mono-100 dark:hover:text-white transition-colors text-xs px-1.5 py-0.5 rounded bg-mono-900 dark:bg-[#333333]"
          >
            Effacer
          </button>
        )}
      </div>

      {/* ── Category filter ── */}
      {!query && (
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              !selectedCategory
                ? 'bg-mono-100 dark:bg-white text-white dark:text-mono-100'
                : 'bg-mono-950 dark:bg-[#171717] text-[#6B7280] dark:text-mono-700 hover:bg-mono-900 dark:hover:bg-[#222222]'
            }`}
          >
            Tous les articles
          </button>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(active ? null : cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  active
                    ? 'bg-mono-100 dark:bg-white text-white dark:text-mono-100'
                    : 'bg-mono-950 dark:bg-[#171717] text-[#6B7280] dark:text-mono-700 hover:bg-mono-900 dark:hover:bg-[#222222]'
                }`}
              >
                <Icon className="w-3 h-3" />
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Category cards (no filter active) ── */}
      {!query && !selectedCategory && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const colors = COLOR_MAP[cat.color];
            const count = ARTICLES.filter((a) => a.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-left p-5 rounded-2xl border ${colors.border} ${colors.bg} hover:shadow-sm transition-all duration-200 group`}
              >
                <div className={`w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <h3 className={`text-sm font-semibold ${colors.text} mb-1`}>{cat.label}</h3>
                <p className="text-xs text-[#6B7280] dark:text-mono-700 leading-relaxed mb-3">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-[#9CA3AF] dark:text-mono-500 group-hover:text-teal-500 transition-colors">
                  {count} article{count > 1 ? 's' : ''}
                  <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Articles list ── */}
      {(query || selectedCategory) && (
        <div>
          <p className="text-xs text-[#9CA3AF] dark:text-mono-500 mb-4">
            {filtered.length} article{filtered.length !== 1 ? 's' : ''} trouvé
            {filtered.length !== 1 ? 's' : ''}
            {query ? ` pour "${query}"` : ''}
          </p>
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-10 h-10 text-[#D1D5DB] dark:text-[#4B5563] mx-auto mb-3" />
              <p className="text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-1">
                Aucun article trouvé
              </p>
              <p className="text-xs text-[#9CA3AF] dark:text-mono-500 mb-4">
                Essayez d'autres mots-clés ou contactez-nous directement.
              </p>
              <a
                href="mailto:contact@restaumargin.fr"
                className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline"
              >
                <Mail className="w-4 h-4" />
                contact@restaumargin.fr
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => setOpenArticle(article)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Popular articles (when no filter) ── */}
      {!query && !selectedCategory && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-teal-500" />
            <h2 className="text-sm font-semibold text-mono-100 dark:text-white">
              Articles populaires
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ARTICLES.slice(0, 6).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={() => setOpenArticle(article)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Contact block ── */}
      <div className="bg-[#F9FAFB] dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-6 h-6 text-teal-600 dark:text-teal-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-mono-100 dark:text-white mb-1">
            Vous ne trouvez pas la réponse ?
          </h3>
          <p className="text-xs text-[#6B7280] dark:text-mono-700 leading-relaxed">
            Notre équipe répond sous{' '}
            <span className="font-semibold text-teal-600 dark:text-teal-400">24h en semaine</span>.
            Utilisez le chat en bas à droite ou écrivez-nous par email.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
          <a
            href="mailto:contact@restaumargin.fr"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-mono-100 dark:bg-white text-white dark:text-mono-100 rounded-xl hover:bg-[#333333] dark:hover:bg-mono-900 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            Envoyer un email
          </a>
        </div>
      </div>

      {/* ── Video tutos coming soon ── */}
      <div className="border border-dashed border-[#D1D5DB] dark:border-[#333333] rounded-2xl p-6 text-center">
        <Video className="w-8 h-8 text-[#D1D5DB] dark:text-[#4B5563] mx-auto mb-3" />
        <p className="text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-1">
          Tutoriels vidéo Loom — bientôt disponibles
        </p>
        <p className="text-xs text-[#9CA3AF] dark:text-mono-500">
          Des vidéos de 60-90 secondes par fonctionnalité seront ajoutées ici prochainement.
        </p>
      </div>
    </div>
  );
}
