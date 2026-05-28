import { Link } from 'react-router-dom';
import {
  Sparkles,
  Mic,
  Brain,
  Zap,
  Wand2,
  MessageSquare,
  ChefHat,
  ArrowRight,
  Check,
  ShieldCheck,
  Languages,
  Clock,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ScanText,
  ListChecks,
  Tag,
  FileText,
  Calculator,
  Target,
  PiggyBank,
  PackageSearch,
  Repeat,
  BarChart3,
  Lock,
  Cpu,
  Quote,
  ArrowLeftRight,
  Volume2,
  CircleHelp,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';

/* ═══════════════════════════════════════════════════════════════
   Page fonctionnalité 02 — L'IA qui parle cuisine
   Mots-clés : IA restaurant, intelligence artificielle cuisine,
   logiciel IA restauration. Propulsé par Claude (Anthropic).
   Design : landing vert RestauMargin, hex directs, light only.
   ═══════════════════════════════════════════════════════════════ */

const ACCENT = '#10B981';
const ACCENT_DARK = '#047857';
const ACCENT_BG = '#ECFDF5';
const TEXT = '#0F172A';
const TEXT_MUTED = '#64748B';
const BORDER = '#E5E7EB';

const PATH = '/fonctionnalites/ia-cuisine';
const BASE = 'https://www.restaumargin.fr';

/* ── FAQ ── */
const faqItems = [
  {
    question: "Quel modèle d'IA utilise RestauMargin ?",
    answer:
      "RestauMargin est propulsé par Claude, l'IA développée par Anthropic. Nous utilisons Claude Haiku pour les réponses instantanées (autocomplétion d'ingrédients, suggestions rapides, structuration de fiche) et Claude Sonnet pour les analyses complexes (optimisation de marge, audit de food cost, détection d'anomalies de prix). Concrètement, le chef dicte ou tape en langage de cuisine normal, et l'IA traduit ça en données exploitables : grammages, allergènes, coût matière. Aucun jargon technique à apprendre.",
  },
  {
    question: "Mes données et mes recettes restent-elles privées ?",
    answer:
      "Oui. Vos recettes vous appartiennent et ne sont jamais utilisées pour entraîner des modèles d'IA. Les requêtes transitent de façon chiffrée (TLS 1.3) et vos fiches techniques sont hébergées en Europe (Frankfurt/Paris) sur une infrastructure conforme au RGPD. Vous gardez la propriété complète de vos données et pouvez les exporter ou les supprimer à tout moment. Vos secrets de cuisine restent vos secrets.",
  },
  {
    question: "Quelle est la précision de la détection d'allergènes ?",
    answer:
      "L'IA reconnaît les 14 allergènes à déclaration obligatoire dans l'Union européenne (gluten, crustacés, œufs, poissons, arachides, soja, lait, fruits à coque, céleri, moutarde, sésame, sulfites, lupin, mollusques). Elle détecte les allergènes cachés derrière des préparations courantes — par exemple le gluten dans une sauce soja ou la moutarde dans une vinaigrette. La détection sert d'aide à la décision et de filet de sécurité : le chef valide toujours la fiche finale, qui reste sous sa responsabilité légale d'exploitant.",
  },
  {
    question: "Dans quelles langues l'IA comprend-elle mes recettes ?",
    answer:
      "L'interface et l'IA sont disponibles en 5 langues : français, anglais, espagnol, arabe et allemand. Vous pouvez dicter ou taper votre recette dans la langue de votre cuisine, mélanger des termes techniques français et étrangers (le vocabulaire de la gastronomie est souvent francophone), l'IA s'y retrouve. Les fiches générées suivent la langue choisie dans vos réglages.",
  },
  {
    question: "Puis-je utiliser la commande vocale pendant le service ?",
    answer:
      "Oui, c'est même un des usages les plus appréciés. La dictée vocale fonctionne via le micro de votre tablette ou smartphone (Web Speech API), idéale quand vous avez les mains dans la prep ou en plein coup de feu. Vous dictez « ajoute 80 grammes de parmesan à la fiche risotto », l'IA met à jour la fiche et recalcule le coût. Sur la tablette du kit hardware RestauMargin, c'est pensé pour rester utilisable même en cuisine, sans clavier.",
  },
  {
    question: "Y a-t-il une limite au nombre de requêtes IA ?",
    answer:
      "Le plan Pro (29 €/mois) inclut un usage IA généreux couvrant largement le quotidien d'un restaurant indépendant : structuration de fiches, suggestions, analyses de marge à volonté pour une exploitation normale. Le plan Business (79 €/mois) lève les plafonds pour les groupes multi-établissements et les usages intensifs. Aucune surfacturation surprise : si vous approchez une limite, vous êtes prévenu en amont. Pour la très grande majorité des restaurants, vous n'atteindrez jamais le plafond.",
  },
];

/* ── 19 actions IA ── */
const aiActions: { icon: React.ReactNode; title: string; desc: string }[] = [
  { icon: <Mic className="w-5 h-5" />, title: 'Dictée vocale de recette', desc: 'Parlez votre recette, l\'IA la transcrit et la structure.' },
  { icon: <ListChecks className="w-5 h-5" />, title: 'Structuration ingrédients', desc: 'Sépare ingrédients, grammages et unités automatiquement.' },
  { icon: <ShieldCheck className="w-5 h-5" />, title: 'Détection allergènes', desc: 'Repère les 14 allergènes UE, même cachés dans les préparations.' },
  { icon: <Calculator className="w-5 h-5" />, title: 'Calcul du coût matière', desc: 'Croise grammages et prix fournisseurs pour le food cost.' },
  { icon: <TrendingUp className="w-5 h-5" />, title: 'Optimisation des marges', desc: 'Identifie les leviers pour gagner des points de marge.' },
  { icon: <BarChart3 className="w-5 h-5" />, title: 'Analyse food cost', desc: 'Audit plat par plat et alertes sur les dérives.' },
  { icon: <AlertTriangle className="w-5 h-5" />, title: 'Détection anomalies prix', desc: 'Signale une hausse fournisseur anormale avant qu\'elle ne pèse.' },
  { icon: <ArrowLeftRight className="w-5 h-5" />, title: 'Substitution ingrédients', desc: 'Propose des alternatives moins chères à qualité égale.' },
  { icon: <ChefHat className="w-5 h-5" />, title: 'Suggestion de recettes', desc: 'Idées de plats à partir de vos stocks et de votre carte.' },
  { icon: <Tag className="w-5 h-5" />, title: 'Prix de vente conseillé', desc: 'Recommande un prix selon coefficient et marge cible.' },
  { icon: <PackageSearch className="w-5 h-5" />, title: 'Prévisions de commande', desc: 'Anticipe les besoins matière selon l\'historique.' },
  { icon: <FileText className="w-5 h-5" />, title: 'Génération de fiche technique', desc: 'Fiche complète, normée et prête à imprimer en un instant.' },
  { icon: <Repeat className="w-5 h-5" />, title: 'Mise à l\'échelle des portions', desc: 'Passe une recette de 4 à 40 couverts sans erreur de calcul.' },
  { icon: <PiggyBank className="w-5 h-5" />, title: 'Simulation de marge', desc: 'Teste un scénario de prix et voyez l\'impact instantané.' },
  { icon: <MessageSquare className="w-5 h-5" />, title: 'Assistant conversationnel', desc: 'Posez vos questions de gestion en langage naturel.' },
  { icon: <Target className="w-5 h-5" />, title: 'Aide au menu engineering', desc: 'Classe vos plats stars, énigmes et poids morts.' },
  { icon: <Languages className="w-5 h-5" />, title: 'Traduction de carte', desc: 'Traduit votre menu pour la clientèle internationale.' },
  { icon: <ScanText className="w-5 h-5" />, title: 'Lecture de factures (OCR)', desc: 'Extrait les prix des bordereaux et met à jour les fiches.' },
  { icon: <Lightbulb className="w-5 h-5" />, title: 'Recommandations proactives', desc: 'Conseils contextuels pour réduire vos coûts au quotidien.' },
];

/* ── Étapes ── */
const steps: { icon: React.ReactNode; title: string; desc: string }[] = [
  {
    icon: <Mic className="w-6 h-6" />,
    title: 'Dictez ou tapez en langage naturel',
    desc: "« 200 g de beurre, 3 œufs, une pincée de sel, 250 g de farine, un peu de levure... » Parlez comme vous parlez en cuisine. Pas de formulaire à 30 champs, pas de menus déroulants à rallonge. Vous dictez au micro de la tablette ou vous tapez librement, l\'IA s\'occupe du reste.",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "L'IA structure tout automatiquement",
    desc: "Claude lit votre texte et le découpe proprement : chaque ingrédient, son grammage et son unité. Elle repère les allergènes au passage — le gluten de la farine, l\'œuf, le lait du beurre — et les marque sur la fiche. Ce qui vous prenait dix lignes manuscrites devient une fiche structurée en quelques secondes.",
  },
  {
    icon: <Calculator className="w-6 h-6" />,
    title: 'Coût matière, marge et coefficient calculés',
    desc: "Chaque ingrédient est relié à vos prix fournisseurs (saisis ou scannés par OCR). L\'IA calcule le coût matière total de la recette, le coût à la portion, la marge brute et le coefficient multiplicateur. Tout se met à jour seul dès qu\'un prix fournisseur bouge.",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'Fiche technique prête, modifiable, exportable',
    desc: "Vous obtenez une fiche technique normée : ingrédients, grammages, allergènes, coût, marge, étapes. Modifiable d\'un clic, exportable en PDF pour le classeur HACCP ou l\'équipe, et toujours synchronisée. La recette est en production en quelques minutes au lieu de vingt.",
  },
];

/* ── Bénéfices chiffrés ── */
const benefits: { stat: string; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    stat: '-90 %',
    label: 'de temps de saisie',
    desc: "Une fiche technique passe de ~20 minutes à environ 2 minutes. La dictée remplace le formulaire fastidieux.",
    icon: <Clock className="w-6 h-6" />,
  },
  {
    stat: '100 %',
    label: "des allergènes détectés",
    desc: "Les 14 allergènes à déclaration obligatoire repérés automatiquement, même cachés dans les préparations.",
    icon: <ShieldCheck className="w-6 h-6" />,
  },
  {
    stat: '+5 pts',
    label: 'de marge potentielle',
    desc: "Les suggestions de substitution et l\'optimisation IA dégagent en moyenne plusieurs points de marge brute.",
    icon: <TrendingUp className="w-6 h-6" />,
  },
];

/* ── Cas d'usage ── */
const useCases: { icon: React.ReactNode; title: string; desc: string }[] = [
  {
    icon: <ChefHat className="w-6 h-6" />,
    title: 'Le chef qui déteste les écrans',
    desc: "Il dicte ses recettes à voix haute entre deux services. L\'IA fait la paperasse pendant qu\'il cuisine. Plus jamais une soirée perdue à saisir des fiches sur un tableur.",
  },
  {
    icon: <PackageSearch className="w-6 h-6" />,
    title: 'Migration de 80 recettes',
    desc: "Un restaurant reprend son ancien classeur papier. Plutôt que de tout ressaisir, il dicte ou copie-colle ses recettes : l\'IA structure et chiffre l\'ensemble en une après-midi.",
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: 'La hausse fournisseur qui passe inaperçue',
    desc: "Le prix du beurre grimpe de 18 % sur un bordereau. L\'IA détecte l\'anomalie, alerte le gérant et lui montre quels plats voient leur marge fondre.",
  },
  {
    icon: <ArrowLeftRight className="w-6 h-6" />,
    title: 'Réduire le food cost sans perdre en qualité',
    desc: "Pour un plat trop coûteux, l\'IA propose des substitutions d\'ingrédients moins chers à rendu équivalent, et chiffre le gain de marge avant que le chef ne valide.",
  },
  {
    icon: <Repeat className="w-6 h-6" />,
    title: 'Passer du couvert au banquet',
    desc: "Une recette calibrée pour 4 doit servir 60 personnes pour un événement. L\'IA recalcule tous les grammages et le coût total sans la moindre erreur d\'échelle.",
  },
  {
    icon: <Languages className="w-6 h-6" />,
    title: 'Une brigade multilingue',
    desc: "Une équipe internationale travaille avec la même base. Chacun dicte dans sa langue, consulte les fiches dans la sienne, et la carte se traduit pour la clientèle étrangère.",
  },
];

export default function FonctionnaliteIACuisine() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif", color: TEXT }}>
      <SEOHead
        title="L'IA qui parle cuisine | Intelligence artificielle restaurant | RestauMargin"
        description="Dictez votre recette, l'IA structure ingrédients, allergènes et coût automatiquement. 19 actions IA pour optimiser vos marges. Propulsé par Claude. Sans jargon SaaS."
        path={PATH}
        type="article"
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: "L'IA qui parle cuisine : l'intelligence artificielle de RestauMargin",
            description:
              "Comment l'IA de RestauMargin transforme une recette dictée en langage naturel en fiche technique structurée : ingrédients, allergènes, coût matière et marge. 19 actions IA propulsées par Claude.",
            datePublished: '2026-05-28',
            dateModified: '2026-05-28',
            inLanguage: 'fr-FR',
            author: { '@type': 'Organization', name: 'RestauMargin' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: `${BASE}/og-image.png` },
            },
            mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}${PATH}` },
            image: `${BASE}/og-image.png`,
            about: ['Intelligence artificielle restauration', 'Logiciel IA restaurant', 'Fiche technique automatisée'],
          },
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: `${BASE}/` },
            { name: 'Fonctionnalités', url: `${BASE}/fonctionnalites` },
            { name: 'IA Cuisine', url: `${BASE}${PATH}` },
          ]),
        ]}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 font-extrabold text-lg tracking-tight" style={{ color: TEXT }}>
            <ChefHat className="w-7 h-7" style={{ color: ACCENT }} />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/fonctionnalites/fiches-techniques" className="hidden sm:inline-flex text-sm font-medium transition-colors hover:opacity-70" style={{ color: TEXT_MUTED }}>
              Fiches techniques
            </Link>
            <Link to="/pricing" className="hidden sm:inline-flex text-sm font-medium transition-colors hover:opacity-70" style={{ color: TEXT_MUTED }}>
              Tarifs
            </Link>
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-white text-sm font-semibold rounded-full transition-opacity hover:opacity-90"
              style={{ backgroundColor: ACCENT }}
            >
              Essai gratuit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Breadcrumb ── */}
      <div className="border-b py-3 px-4" style={{ borderColor: BORDER, backgroundColor: '#FAFAFA' }}>
        <div className="max-w-6xl mx-auto text-xs flex items-center gap-2 flex-wrap" style={{ color: TEXT_MUTED }}>
          <Link to="/" className="hover:underline">Accueil</Link>
          <span>/</span>
          <Link to="/fonctionnalites" className="hover:underline">Fonctionnalités</Link>
          <span>/</span>
          <span className="font-semibold" style={{ color: TEXT }}>IA Cuisine</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <header className="pt-16 pb-14 px-4" style={{ background: `linear-gradient(to bottom, ${ACCENT_BG}, #FFFFFF 75%)` }}>
        <div className="max-w-4xl mx-auto text-center">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6"
            style={{ color: ACCENT_DARK, backgroundColor: '#D1FAE5' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Fonctionnalité 02
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6" style={{ color: TEXT }}>
            L'IA qui parle cuisine
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-9" style={{ color: TEXT_MUTED }}>
            Dictez votre recette comme vous la diriez à un commis. L'intelligence artificielle de RestauMargin la
            transforme en <strong style={{ color: TEXT }}>fiche technique structurée</strong> : ingrédients, grammages,
            allergènes détectés et coût matière calculé. <strong style={{ color: TEXT }}>Sans jargon SaaS.</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded-full transition-opacity hover:opacity-90 text-lg shadow-lg"
              style={{ backgroundColor: ACCENT, boxShadow: `0 10px 25px -5px ${ACCENT}55` }}
            >
              Essai gratuit 7 jours
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/fonctionnalites/fiches-techniques"
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-full border-2 transition-colors hover:bg-[#F8FAFC]"
              style={{ borderColor: TEXT, color: TEXT }}
            >
              Voir les fiches techniques
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm" style={{ color: TEXT_MUTED }}>
            <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4" style={{ color: ACCENT }} /> Propulsé par Claude (Anthropic)</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4" style={{ color: ACCENT }} /> 19 actions IA</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" style={{ color: ACCENT }} /> Données hébergées en Europe</span>
          </div>
        </div>
      </header>

      {/* ── Le problème ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: TEXT }}>
              Le problème : la fiche technique, ce cauchemar du soir
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_MUTED }}>
              Tout le monde sait qu'une fiche technique propre, c'est la base d'une marge maîtrisée. Mais entre savoir
              et faire, il y a un mur : le temps et l'outil.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border p-6" style={{ borderColor: BORDER }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2 tracking-tight" style={{ color: TEXT }}>20 minutes par fiche</h3>
              <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                Ouvrir le tableur, créer les colonnes, ressaisir chaque ingrédient, retrouver le prix d'achat, taper le
                grammage, vérifier le calcul. Multipliez par 60 plats : c'est une semaine de travail perdue.
              </p>
            </div>
            <div className="rounded-2xl border p-6" style={{ borderColor: BORDER }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2 tracking-tight" style={{ color: TEXT }}>Le jargon SaaS rebute</h3>
              <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                Un chef parle ingrédients, cuissons, dressage. Pas « champs obligatoires », « entités liées » et menus
                déroulants à six niveaux. Les logiciels de gestion sont conçus par des comptables, pas par des cuisiniers.
              </p>
            </div>
            <div className="rounded-2xl border p-6" style={{ borderColor: BORDER }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2 tracking-tight" style={{ color: TEXT }}>Des fiches vite obsolètes</h3>
              <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                Saisir, c'est une chose. Tenir à jour quand les prix matières bougent chaque semaine, c'en est une autre.
                Résultat : des fiches abandonnées, des marges calculées sur des prix d'il y a six mois.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl p-6 flex gap-4 text-sm leading-relaxed" style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}>
            <Lightbulb className="w-6 h-6 shrink-0 mt-0.5" />
            <p>
              <strong>L'idée de RestauMargin :</strong> et si l'outil parlait votre langue plutôt que l'inverse ? Vous
              dictez votre recette comme à un apprenti, l'IA fait tout le travail ingrat de structuration, de détection
              d'allergènes et de calcul. Vous restez en cuisine, le logiciel s'occupe de la paperasse.
            </p>
          </div>
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <section className="py-16 px-4" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4" style={{ color: ACCENT_DARK, backgroundColor: '#D1FAE5' }}>
              <Wand2 className="w-3.5 h-3.5" />
              De la voix à la fiche
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: TEXT }}>
              Comment ça marche, concrètement
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_MUTED }}>
              Quatre étapes, de la recette dans votre tête à la fiche technique chiffrée. Aucune compétence informatique
              requise.
            </p>
          </div>

          <div className="space-y-5">
            {steps.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl border p-6 sm:p-7 flex flex-col sm:flex-row gap-5 items-start" style={{ borderColor: BORDER }}>
                <div className="flex items-center gap-4 sm:flex-col sm:items-center shrink-0">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-lg"
                    style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}
                  >
                    {i + 1}
                  </div>
                  <div className="hidden sm:block mt-1" style={{ color: ACCENT }}>{step.icon}</div>
                </div>
                <div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2 tracking-tight" style={{ color: TEXT }}>{step.title}</h3>
                  <p className="text-sm sm:text-base leading-relaxed" style={{ color: TEXT_MUTED }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mini démo "avant / après" */}
          <div className="mt-10 grid md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border p-6" style={{ borderColor: BORDER }}>
              <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: TEXT_MUTED }}>
                <Mic className="w-4 h-4" /> Ce que vous dictez
              </div>
              <p className="text-sm leading-relaxed italic" style={{ color: TEXT }}>
                « Pour mon risotto aux cèpes : 320 grammes de riz arborio, un litre de bouillon de volaille, 150 grammes
                de cèpes, 80 grammes de parmesan, deux échalotes, un verre de vin blanc, 50 grammes de beurre, sel et
                poivre. Ça fait quatre portions. »
              </p>
            </div>
            <div className="rounded-2xl border-2 p-6" style={{ borderColor: ACCENT, backgroundColor: ACCENT_BG }}>
              <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT_DARK }}>
                <Sparkles className="w-4 h-4" /> Ce que l'IA produit
              </div>
              <ul className="text-sm space-y-1.5" style={{ color: TEXT }}>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: ACCENT_DARK }} /> 8 ingrédients structurés avec grammages et unités</li>
                <li className="flex items-start gap-2"><ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" style={{ color: ACCENT_DARK }} /> Allergènes : <strong>lait</strong> (beurre, parmesan), <strong>sulfites</strong> (vin)</li>
                <li className="flex items-start gap-2"><Calculator className="w-4 h-4 mt-0.5 shrink-0" style={{ color: ACCENT_DARK }} /> Coût matière calculé + coût à la portion</li>
                <li className="flex items-start gap-2"><Tag className="w-4 h-4 mt-0.5 shrink-0" style={{ color: ACCENT_DARK }} /> Marge brute et coefficient selon votre prix de vente</li>
                <li className="flex items-start gap-2"><FileText className="w-4 h-4 mt-0.5 shrink-0" style={{ color: ACCENT_DARK }} /> Fiche technique exportable en PDF</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Les 19 actions IA ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4" style={{ color: ACCENT_DARK, backgroundColor: '#D1FAE5' }}>
              <Brain className="w-3.5 h-3.5" />
              Intelligence artificielle restauration
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: TEXT }}>
              Les 19 actions IA de RestauMargin
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_MUTED }}>
              La dictée de recette n'est que la porte d'entrée. Voici tout ce que l'intelligence artificielle fait pour
              piloter vos marges, propulsée par Claude d'Anthropic.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiActions.map((action, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border p-5 flex items-start gap-4 transition-all hover:shadow-md"
                style={{ borderColor: BORDER }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}>
                  {action.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold tabular-nums" style={{ color: ACCENT }}>{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="font-bold text-sm tracking-tight" style={{ color: TEXT }}>{action.title}</h3>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: TEXT_MUTED }}>{action.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bénéfices chiffrés ── */}
      <section className="py-16 px-4" style={{ backgroundColor: TEXT }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-white">
              Des bénéfices qui se mesurent
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#94A3B8' }}>
              L'IA n'est pas un gadget. Elle vous rend du temps et des points de marge, dès la première semaine.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="rounded-2xl p-7 text-center" style={{ backgroundColor: '#1E293B' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: ACCENT, color: '#FFFFFF' }}>
                  {b.icon}
                </div>
                <div className="text-5xl font-extrabold tracking-tight mb-1" style={{ color: ACCENT }}>{b.stat}</div>
                <div className="font-bold text-white mb-3">{b.label}</div>
                <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cas d'usage ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: TEXT }}>
              Des cas d'usage de vraie cuisine
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_MUTED }}>
              Pas de la théorie : des situations que vous vivez chaque semaine en exploitation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((uc, i) => (
              <div key={i} className="rounded-2xl border p-6 transition-all hover:shadow-md hover:-translate-y-0.5" style={{ borderColor: BORDER }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}>
                  {uc.icon}
                </div>
                <h3 className="font-bold text-lg mb-2 tracking-tight" style={{ color: TEXT }}>{uc.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>{uc.desc}</p>
              </div>
            ))}
          </div>

          {/* Citation chef */}
          <div className="mt-12 max-w-3xl mx-auto rounded-2xl border p-8 text-center" style={{ borderColor: BORDER, backgroundColor: ACCENT_BG }}>
            <Quote className="w-8 h-8 mx-auto mb-4" style={{ color: ACCENT }} />
            <p className="text-lg sm:text-xl font-medium leading-relaxed mb-4" style={{ color: TEXT }}>
              « Je dicte mes plats du jour entre le marché et le service. En deux minutes la fiche est faite, chiffrée,
              les allergènes sont marqués. Avant, je remettais ça à plus tard — et plus tard, ça ne venait jamais. »
            </p>
            <div className="text-sm font-bold" style={{ color: ACCENT_DARK }}>Un chef-propriétaire utilisateur de RestauMargin</div>
          </div>
        </div>
      </section>

      {/* ── Confiance / IA responsable ── */}
      <section className="py-16 px-4" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: TEXT }}>
              Une IA fiable, privée et à votre service
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_MUTED }}>
              L'intelligence artificielle propose, vous décidez. RestauMargin construit son IA autour de la confiance.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border p-6 flex gap-4" style={{ borderColor: BORDER }}>
              <Cpu className="w-7 h-7 shrink-0" style={{ color: ACCENT }} />
              <div>
                <h3 className="font-bold mb-1 tracking-tight" style={{ color: TEXT }}>Le moteur : Claude (Anthropic)</h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                  Claude Haiku pour les réponses instantanées, Claude Sonnet pour les analyses profondes. Un des modèles
                  d'IA les plus avancés et les plus sûrs du marché.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border p-6 flex gap-4" style={{ borderColor: BORDER }}>
              <Lock className="w-7 h-7 shrink-0" style={{ color: ACCENT }} />
              <div>
                <h3 className="font-bold mb-1 tracking-tight" style={{ color: TEXT }}>Vos recettes restent privées</h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                  Jamais utilisées pour entraîner des modèles. Hébergement en Europe, chiffrement TLS 1.3, conformité
                  RGPD. Vos secrets de cuisine vous appartiennent.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border p-6 flex gap-4" style={{ borderColor: BORDER }}>
              <ShieldCheck className="w-7 h-7 shrink-0" style={{ color: ACCENT }} />
              <div>
                <h3 className="font-bold mb-1 tracking-tight" style={{ color: TEXT }}>L'humain valide toujours</h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                  La détection d'allergènes et les calculs sont une aide à la décision. Le chef relit et valide la fiche
                  finale, qui reste sous sa responsabilité d'exploitant.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border p-6 flex gap-4" style={{ borderColor: BORDER }}>
              <Volume2 className="w-7 h-7 shrink-0" style={{ color: ACCENT }} />
              <div>
                <h3 className="font-bold mb-1 tracking-tight" style={{ color: TEXT }}>Pensée pour la cuisine</h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                  Dictée vocale mains libres sur tablette, langage naturel, 5 langues. Utilisable en plein service, sans
                  clavier et sans formation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4" style={{ color: ACCENT_DARK, backgroundColor: '#D1FAE5' }}>
              <CircleHelp className="w-3.5 h-3.5" />
              Questions fréquentes
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: TEXT }}>
              Tout savoir sur l'IA de RestauMargin
            </h2>
            <p className="text-lg" style={{ color: TEXT_MUTED }}>
              Les questions que les chefs posent avant de se lancer.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="py-20 px-4" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})` }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <Sparkles className="w-10 h-10 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6">
            Parlez. L'IA cuisine s'occupe du reste.
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-3" style={{ color: '#D1FAE5' }}>
            Dictez votre première recette aujourd'hui et obtenez une fiche technique chiffrée en deux minutes.
          </p>
          <p className="mb-10" style={{ color: '#A7F3D0' }}>
            Essai gratuit 7 jours · Sans carte bancaire · Propulsé par Claude
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-10 py-5 font-extrabold rounded-full text-lg shadow-2xl transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: '#FFFFFF', color: ACCENT_DARK }}
            >
              Démarrer l'essai gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/fonctionnalites/menu-engineering"
              className="inline-flex items-center gap-2 px-10 py-5 font-bold rounded-full text-lg border-2 border-white/40 text-white transition-colors hover:bg-white/10"
            >
              Découvrir le menu engineering
            </Link>
          </div>
        </div>
      </section>

      {/* ── Maillage interne ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-extrabold tracking-tight mb-8 text-center" style={{ color: TEXT }}>Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <Link to="/fonctionnalites/fiches-techniques" className="rounded-2xl border p-6 transition-all hover:shadow-sm group" style={{ borderColor: BORDER }}>
              <FileText className="w-8 h-8 mb-3" style={{ color: ACCENT }} />
              <h3 className="font-bold mb-2 tracking-tight transition-colors group-hover:opacity-70" style={{ color: TEXT }}>Fiches techniques automatisées</h3>
              <p className="text-sm" style={{ color: TEXT_MUTED }}>Grammages, allergènes et coût matière calculés en continu à chaque variation de prix.</p>
            </Link>
            <Link to="/fonctionnalites/menu-engineering" className="rounded-2xl border p-6 transition-all hover:shadow-sm group" style={{ borderColor: BORDER }}>
              <Target className="w-8 h-8 mb-3" style={{ color: ACCENT }} />
              <h3 className="font-bold mb-2 tracking-tight transition-colors group-hover:opacity-70" style={{ color: TEXT }}>Menu engineering</h3>
              <p className="text-sm" style={{ color: TEXT_MUTED }}>Classez vos plats stars, énigmes et poids morts pour optimiser la rentabilité de votre carte.</p>
            </Link>
            <Link to="/pricing" className="rounded-2xl border p-6 transition-all hover:shadow-sm group" style={{ borderColor: BORDER }}>
              <Tag className="w-8 h-8 mb-3" style={{ color: ACCENT }} />
              <h3 className="font-bold mb-2 tracking-tight transition-colors group-hover:opacity-70" style={{ color: TEXT }}>Tarifs RestauMargin</h3>
              <p className="text-sm" style={{ color: TEXT_MUTED }}>Plans Pro et Business, l'IA incluse dès le premier euro. Essai gratuit 7 jours.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-12 px-4" style={{ borderColor: BORDER, backgroundColor: '#FAFAFA' }}>
        <div className="max-w-6xl mx-auto text-center text-sm" style={{ color: TEXT_MUTED }}>
          <Link to="/landing" className="flex items-center justify-center gap-2 font-extrabold text-lg mb-4 tracking-tight" style={{ color: TEXT }}>
            <ChefHat className="w-6 h-6" style={{ color: ACCENT }} />
            RestauMargin
          </Link>
          <p className="mb-4 max-w-md mx-auto">L'IA qui parle cuisine. Le logiciel de gestion de marge restaurant propulsé par l'intelligence artificielle.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link to="/fonctionnalites/fiches-techniques" className="hover:underline">Fiches techniques</Link>
            <Link to="/fonctionnalites/menu-engineering" className="hover:underline">Menu engineering</Link>
            <Link to="/pricing" className="hover:underline">Tarifs</Link>
            <Link to="/mentions-legales" className="hover:underline">Mentions légales</Link>
            <Link to="/politique-confidentialite" className="hover:underline">Confidentialité</Link>
          </div>
          <p className="mt-6 text-xs" style={{ color: '#94A3B8' }}>
            &copy; {new Date().getFullYear()} RestauMargin. Tous droits réservés. IA propulsée par Claude (Anthropic).
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════ Sous-composants ═══════════════ */

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="rounded-xl border group" style={{ borderColor: BORDER, backgroundColor: '#FFFFFF' }}>
      <summary
        className="px-5 py-4 font-semibold cursor-pointer select-none flex items-center justify-between gap-4 tracking-tight"
        style={{ color: TEXT }}
      >
        {q}
        <ArrowRight className="w-4 h-4 shrink-0 group-open:rotate-90 transition-transform" style={{ color: ACCENT }} />
      </summary>
      <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>{a}</p>
    </details>
  );
}
