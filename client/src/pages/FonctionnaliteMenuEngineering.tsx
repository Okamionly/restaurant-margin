import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChefHat,
  TrendingUp,
  Star,
  Puzzle,
  Dog,
  BarChart3,
  Target,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  LineChart,
  AlertTriangle,
  Trash2,
  Megaphone,
  Wallet,
  Utensils,
  ClipboardList,
  Menu as MenuIcon,
  X,
  HelpCircle,
  Lightbulb,
  RefreshCw,
  ScanLine,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';

/* ═══════════════════════════════════════════════════════════════
   Page Fonctionnalité 08 — "Menu Engineering"
   Mots-clés cibles : menu engineering restaurant / matrice BCG menu /
   optimisation carte restaurant
   ~1 800 mots — landing claire, fond blanc, palette verte
   ═══════════════════════════════════════════════════════════════ */

const ACCENT = '#10B981';
const ACCENT_DARK = '#047857';
const ACCENT_BG = '#ECFDF5';
const TEXT = '#0F172A';
const TEXT_MUTED = '#64748B';
const BORDER = '#E5E7EB';

interface FaqItem {
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    question: "D'où viennent les données de vente utilisées pour le Menu Engineering ?",
    answer:
      "RestauMargin récupère les volumes vendus de deux façons. Soit par connexion à votre logiciel de caisse (POS) compatible : les ventes remontent automatiquement chaque nuit, plat par plat. Soit par saisie manuelle ou import d'un export CSV de votre caisse, ce qui prend moins de cinq minutes par mois. Côté coût, les food cost proviennent de vos fiches techniques déjà renseignées dans l'application. Le croisement coût × volume se fait ensuite tout seul, sans tableur ni calcul manuel.",
  },
  {
    question: "À quelle fréquence faut-il lancer une analyse de la matrice ?",
    answer:
      "Une analyse mensuelle suffit pour la plupart des restaurants : elle lisse les pics de week-end et capture une tendance fiable. Lancez une analyse approfondie à chaque changement de carte saisonnière (4 fois par an) et un contrôle rapide dès qu'un prix fournisseur bouge de plus de 5 %. RestauMargin garde l'historique : vous voyez si un plat glisse de Star vers Vache à lait au fil des hausses de matières premières, avant que la marge ne soit déjà perdue.",
  },
  {
    question: "Et mes plats signature à faible marge ? Faut-il vraiment les retirer ?",
    answer:
      "Non. La matrice est un outil d'aide à la décision, pas un couperet. Un plat signature à valeur émotionnelle (le plat historique du chef, le dessert qui fait votre réputation) peut rester même classé Dog, parce qu'il fait revenir les clients. RestauMargin vous laisse marquer ces plats comme « protégés » : ils restent visibles dans l'analyse mais sont exclus des recommandations de suppression. L'outil vous montre simplement combien ils vous coûtent, pour que la décision de les garder soit consciente et chiffrée.",
  },
  {
    question: "Puis-je simuler l'impact d'un changement avant de toucher à ma carte ?",
    answer:
      "Oui, c'est l'une des fonctions les plus utilisées. Avant de retirer un Dog, d'augmenter le prix d'une Vache à lait ou de repositionner un Puzzle, vous lancez une simulation. RestauMargin recalcule la marge globale projetée en supposant que le volume des plats supprimés se reporte sur les plats restants. Vous voyez immédiatement combien de points de marge vous gagnez (ou perdez) avant d'imprimer la nouvelle carte. Zéro pari à l'aveugle.",
  },
  {
    question: "Gère-t-il les cartes multiples (midi / soir, déjeuner / brunch) ?",
    answer:
      "Oui. Vous pouvez créer plusieurs cartes et lancer une analyse Menu Engineering distincte pour chacune. Un plat peut être une Star au déjeuner (formule rapide, fort volume) et un Puzzle le soir (faible volume sur une carte plus chère). Traiter chaque service séparément évite les fausses conclusions : la moyenne globale masque souvent des dynamiques opposées entre le midi et le soir.",
  },
  {
    question: "Quel est le lien avec les fiches techniques RestauMargin ?",
    answer:
      "Les fiches techniques sont le carburant du Menu Engineering. C'est elles qui donnent le food cost exact de chaque plat (coût matières par portion, à jour grâce aux prix fournisseurs scannés). Sans fiche technique, l'outil ne peut pas calculer la marge réelle et se rabat sur une estimation. Plus vos fiches sont complètes, plus la matrice est précise. Les deux fonctionnalités sont conçues pour travailler ensemble : vous renseignez une fiche une fois, le Menu Engineering s'en sert à chaque analyse.",
  },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Menu Engineering : la carte qui rapporte',
  description:
    "Menu Engineering automatique avec RestauMargin : croisez food cost et ventes pour classer vos plats dans la matrice Stars, Puzzles, Vaches à lait et Dogs, et savoir quel plat retirer.",
  image: 'https://www.restaumargin.fr/og-image.png',
  author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
  publisher: {
    '@type': 'Organization',
    name: 'RestauMargin',
    logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
  },
  datePublished: '2026-05-28',
  dateModified: '2026-05-28',
  wordCount: 1850,
  inLanguage: 'fr-FR',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://www.restaumargin.fr/fonctionnalites/menu-engineering',
  },
};

export default function FonctionnaliteMenuEngineering() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif", color: TEXT }}>
      <SEOHead
        title="Menu Engineering restaurant | Matrice Stars/Puzzles/Dogs | RestauMargin"
        description="Menu Engineering automatique : RestauMargin croise food cost et ventes pour classer vos plats (Stars, Puzzles, Plowhorses, Dogs). Savez quel plat retirer avant qu'il vous coûte cher."
        path="/fonctionnalites/menu-engineering"
        type="article"
        schema={[
          articleSchema,
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Fonctionnalités', url: 'https://www.restaumargin.fr/fonctionnalites' },
            {
              name: 'Menu Engineering',
              url: 'https://www.restaumargin.fr/fonctionnalites/menu-engineering',
            },
          ]),
        ]}
      />

      {/* ───────── Navbar sticky ───────── */}
      <nav
        className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b"
        style={{ borderColor: BORDER }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 font-extrabold text-lg tracking-tight" style={{ color: TEXT }}>
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: ACCENT_BG }}
            >
              <ChefHat className="w-5 h-5" style={{ color: ACCENT_DARK }} />
            </span>
            <span>RestauMargin</span>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-sm font-medium" style={{ color: TEXT_MUTED }}>
            <Link to="/fonctionnalites/fiches-techniques" className="hover:text-emerald-700 transition-colors">
              Fiches techniques
            </Link>
            <Link to="/blog/menu-engineering-boston-matrix" className="hover:text-emerald-700 transition-colors">
              Guide
            </Link>
            <a
              href="/login?mode=register"
              className="px-4 py-2 rounded-xl font-semibold text-white transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: ACCENT }}
            >
              Essai gratuit
            </a>
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg"
            style={{ color: TEXT }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t px-4 py-4 space-y-3 bg-white" style={{ borderColor: BORDER }}>
            <Link to="/fonctionnalites/fiches-techniques" className="block text-sm font-medium" style={{ color: TEXT_MUTED }}>
              Fiches techniques
            </Link>
            <Link to="/blog/menu-engineering-boston-matrix" className="block text-sm font-medium" style={{ color: TEXT_MUTED }}>
              Guide menu engineering
            </Link>
            <a
              href="/login?mode=register"
              className="block text-center px-4 py-2.5 rounded-xl font-semibold text-white"
              style={{ backgroundColor: ACCENT }}
            >
              Essai gratuit
            </a>
          </div>
        )}
      </nav>

      {/* ───────── Breadcrumb ───────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5">
        <nav className="text-xs sm:text-sm flex flex-wrap items-center gap-1.5" style={{ color: TEXT_MUTED }} aria-label="Fil d'ariane">
          <Link to="/landing" className="hover:text-emerald-700 transition-colors">
            Accueil
          </Link>
          <span aria-hidden>/</span>
          <Link to="/fonctionnalites/fiches-techniques" className="hover:text-emerald-700 transition-colors">
            Fonctionnalités
          </Link>
          <span aria-hidden>/</span>
          <span className="font-semibold" style={{ color: TEXT }}>
            Menu Engineering
          </span>
        </nav>
      </div>

      {/* ───────── Hero ───────── */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-14 sm:pt-14 sm:pb-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Fonctionnalité 08
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]" style={{ color: TEXT }}>
              Menu Engineering :{' '}
              <span style={{ color: ACCENT_DARK }}>la carte qui rapporte</span>
            </h1>

            <p className="mt-5 text-lg leading-relaxed" style={{ color: TEXT_MUTED }}>
              Sur une carte de 25 plats, seuls 4 à 6 génèrent l'essentiel de la marge. RestauMargin croise
              automatiquement vos food cost et vos ventes, classe chaque plat dans la matrice Stars / Puzzles /
              Vaches à lait / Dogs, et vous dit précisément quel plat mettre en avant, lequel re-prixer et lequel
              retirer.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="/login?mode=register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-white transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: ACCENT }}
              >
                Analyser ma carte gratuitement
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/blog/menu-engineering-boston-matrix"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold border transition-colors hover:bg-emerald-50"
                style={{ borderColor: BORDER, color: TEXT }}
              >
                <BarChart3 className="w-4 h-4" style={{ color: ACCENT_DARK }} />
                Comprendre la matrice BCG
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ color: TEXT_MUTED }}>
              {['Analyse automatique', 'Recommandations concrètes', 'Simulation avant impression'].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" style={{ color: ACCENT }} />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Mini matrice visuelle */}
          <div className="relative">
            <div
              className="rounded-2xl border p-5 sm:p-6 shadow-sm"
              style={{ borderColor: BORDER, backgroundColor: '#FFFFFF' }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold tracking-tight" style={{ color: TEXT }}>
                  Matrice Menu Engineering
                </span>
                <span className="text-[11px] font-medium" style={{ color: TEXT_MUTED }}>
                  marge × popularité
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { Icon: Puzzle, label: 'Puzzles', sub: 'Marge + / Vol -', bg: '#EFF6FF', fg: '#1D4ED8' },
                  { Icon: Star, label: 'Stars', sub: 'Marge + / Vol +', bg: ACCENT_BG, fg: ACCENT_DARK },
                  { Icon: Dog, label: 'Dogs', sub: 'Marge - / Vol -', bg: '#FEF2F2', fg: '#B91C1C' },
                  { Icon: TrendingUp, label: 'Vaches à lait', sub: 'Marge - / Vol +', bg: '#FFFBEB', fg: '#B45309' },
                ].map(({ Icon, label, sub, bg, fg }) => (
                  <div key={label} className="rounded-xl p-4" style={{ backgroundColor: bg }}>
                    <Icon className="w-6 h-6" style={{ color: fg }} />
                    <p className="mt-2 text-sm font-bold" style={{ color: fg }}>
                      {label}
                    </p>
                    <p className="text-[11px] font-medium" style={{ color: TEXT_MUTED }}>
                      {sub}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium" style={{ color: TEXT_MUTED }}>
                <Target className="w-4 h-4" style={{ color: ACCENT_DARK }} />
                Chaque plat positionné automatiquement
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ───────── Le problème ───────── */}
      <section className="border-t" style={{ borderColor: BORDER, backgroundColor: ACCENT_BG }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT_DARK }}>
              <AlertTriangle className="w-4 h-4" />
              Le problème
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: TEXT }}>
              Une carte trop longue, des plats qui ne rapportent rien
            </h2>
            <p className="mt-4 text-lg leading-relaxed" style={{ color: TEXT_MUTED }}>
              La plupart des restaurateurs pilotent leur carte à l'instinct. On ajoute des plats au fil des saisons,
              on en garde par habitude, et personne ne sait vraiment lesquels font gagner de l'argent. Résultat :
              une carte à rallonge, un stock dispersé, et une marge globale qu'on subit plus qu'on ne pilote.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-3 gap-5">
            {[
              {
                Icon: ClipboardList,
                title: 'Carte trop longue',
                desc: "30, 40 plats à gérer. Le choix paralyse le client, le stock se disperse et la cuisine ralentit en plein rush.",
              },
              {
                Icon: Trash2,
                title: 'Des plats fantômes',
                desc: "On garde des plats par habitude « parce qu'ils ont toujours été là ». Ils ne se vendent pas, gaspillent les matières et plombent la marge.",
              },
              {
                Icon: LineChart,
                title: 'Food cost subi',
                desc: "Le coût matières moyen est constaté en fin de mois, jamais piloté plat par plat. Impossible de savoir où l'argent fuit.",
              },
            ].map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl bg-white border p-6"
                style={{ borderColor: BORDER }}
              >
                <span className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: ACCENT_BG }}>
                  <Icon className="w-5 h-5" style={{ color: ACCENT_DARK }} />
                </span>
                <h3 className="mt-4 text-lg font-extrabold tracking-tight" style={{ color: TEXT }}>
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── La matrice : 4 catégories ───────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT_DARK }}>
            <BarChart3 className="w-4 h-4" />
            La méthode
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: TEXT }}>
            La matrice Menu Engineering
          </h2>
          <p className="mt-4 text-lg leading-relaxed" style={{ color: TEXT_MUTED }}>
            Le Menu Engineering, formalisé à l'Université du Michigan en 1982, applique la logique de la matrice BCG
            à votre carte. Il croise deux axes : la <strong style={{ color: TEXT }}>marge contribution en euros</strong>{' '}
            (et non le food cost en %, trompeur) et la <strong style={{ color: TEXT }}>popularité</strong> (le volume
            vendu). Quatre catégories en ressortent.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-5">
          {[
            {
              Icon: Star,
              label: 'Stars',
              tag: 'Forte marge · Forte popularité',
              action: 'À mettre en avant',
              bg: ACCENT_BG,
              fg: ACCENT_DARK,
              accent: ACCENT,
              desc:
                "Vos champions. Ils plaisent ET rapportent. Exemple : le burger Black Angus signature, vendu 16 € avec 11 € de marge, 180 ventes/mois. Mettez-les en tête de carte, formez les serveurs à les recommander et surveillez leur food cost de près.",
            },
            {
              Icon: TrendingUp,
              label: 'Plowhorses (Vaches à lait)',
              tag: 'Faible marge · Forte popularité',
              action: 'À optimiser / re-prixer',
              bg: '#FFFBEB',
              fg: '#B45309',
              accent: '#F59E0B',
              desc:
                "Les locomotives de la fréquentation : tout le monde les commande mais ils diluent la marge. Exemple : le steak-frites à 14,50 € avec 6 € de marge. Reformulez discrètement, testez une hausse de +0,50 à +1 €, mais ne les supprimez jamais : ils font venir le monde.",
            },
            {
              Icon: Puzzle,
              label: 'Puzzles',
              tag: 'Forte marge · Faible popularité',
              action: 'À repositionner / promouvoir',
              bg: '#EFF6FF',
              fg: '#1D4ED8',
              accent: '#3B82F6',
              desc:
                "Des pépites mal vendues. La marge est belle mais le plat ne décolle pas : mauvais nom, mauvaise place sur la carte ou description fade. Exemple : la côte de bœuf à partager, 28 € de marge mais 12 ventes/mois. Renommez, décrivez la provenance, remontez-le, mettez-le en suggestion.",
            },
            {
              Icon: Dog,
              label: 'Dogs (Chiens)',
              tag: 'Faible marge · Faible popularité',
              action: 'À retirer',
              bg: '#FEF2F2',
              fg: '#B91C1C',
              accent: '#EF4444',
              desc:
                "Ni populaires, ni rentables. Ils occupent de la place, mobilisent du stock périssable et ralentissent la cuisine. Exemple : la salade composée à 9 €, 4 € de marge, 9 ventes/mois. À retirer dans 90 % des cas — sauf rare plat signature ou option diététique nécessaire.",
            },
          ].map(({ Icon, label, tag, action, bg, fg, accent, desc }) => (
            <div key={label} className="rounded-2xl border overflow-hidden bg-white" style={{ borderColor: BORDER }}>
              <div className="p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                    <Icon className="w-6 h-6" style={{ color: fg }} />
                  </span>
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: bg, color: fg }}
                  >
                    {action}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-extrabold tracking-tight" style={{ color: TEXT }}>
                  {label}
                </h3>
                <p className="mt-0.5 text-xs font-semibold" style={{ color: fg }}>
                  {tag}
                </p>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                  {desc}
                </p>
              </div>
              <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Comment ça marche — 4 étapes ───────── */}
      <section className="border-t" style={{ borderColor: BORDER, backgroundColor: '#FAFAFA' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT_DARK }}>
              <Layers className="w-4 h-4" />
              Comment ça marche
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: TEXT }}>
              De vos données à votre décision, en 4 étapes
            </h2>
            <p className="mt-4 text-lg leading-relaxed" style={{ color: TEXT_MUTED }}>
              Aucun tableur, aucun calcul manuel. RestauMargin assemble tout seul les pièces que vous avez déjà.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: '01',
                Icon: ScanLine,
                title: 'On croise coûts et ventes',
                desc:
                  "RestauMargin récupère le food cost de chaque plat via vos fiches techniques et les volumes vendus via votre POS ou un import de caisse.",
              },
              {
                step: '02',
                Icon: BarChart3,
                title: 'On classe chaque plat',
                desc:
                  "L'algorithme calcule la marge contribution × volume, fixe les seuils de marge et de popularité, puis place chaque plat dans l'un des 4 quadrants.",
              },
              {
                step: '03',
                Icon: Lightbulb,
                title: 'On vous donne les actions',
                desc:
                  "Pour chaque plat : mettre en avant, re-prixer, renommer ou retirer. Des recommandations concrètes, pas un simple graphique à interpréter.",
              },
              {
                step: '04',
                Icon: RefreshCw,
                title: "On simule l'impact",
                desc:
                  "Avant de toucher à la carte, lancez une simulation : marge globale projetée si vous retirez un Dog ou augmentez une Vache à lait. Vous décidez en connaissance de cause.",
              },
            ].map(({ step, Icon, title, desc }) => (
              <div key={step} className="rounded-2xl bg-white border p-6 relative" style={{ borderColor: BORDER }}>
                <span className="text-4xl font-extrabold tracking-tight" style={{ color: '#A7F3D0' }}>
                  {step}
                </span>
                <span className="absolute top-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: ACCENT_BG }}>
                  <Icon className="w-5 h-5" style={{ color: ACCENT_DARK }} />
                </span>
                <h3 className="mt-3 text-base font-extrabold tracking-tight" style={{ color: TEXT }}>
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Bénéfices chiffrés ───────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT_DARK }}>
            <Wallet className="w-4 h-4" />
            Bénéfices chiffrés
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: TEXT }}>
            Ce que vous gagnez, concrètement
          </h2>
          <p className="mt-4 text-lg leading-relaxed" style={{ color: TEXT_MUTED }}>
            Le Menu Engineering n'est pas un exercice théorique. C'est le levier le plus rapide pour récupérer des
            points de marge sans toucher au nombre de couverts.
          </p>
        </div>

        <div className="mt-10 grid sm:grid-cols-3 gap-5">
          {[
            {
              Icon: TrendingUp,
              metric: '+5 à +10 pts',
              title: 'de marge globale',
              desc:
                "En rééquilibrant la carte vers les Stars et Puzzles et en re-prixant les Vaches à lait, un restaurant récupère typiquement 5 à 10 points de marge brute en quelques mois.",
            },
            {
              Icon: Trash2,
              metric: 'Dogs',
              title: 'identifiés et retirés',
              desc:
                "Vous voyez noir sur blanc les plats qui ne rapportent rien et qui mobilisent du stock. Retirer 4 ou 5 Dogs allège la carte, accélère la cuisine et réduit le gaspillage.",
            },
            {
              Icon: Star,
              metric: 'Stars',
              title: 'mises en avant',
              desc:
                "Vos plats champions sont identifiés et valorisés : tête de carte, recommandation serveurs, mise en page travaillée. Le volume des plats les plus rentables augmente mécaniquement.",
            },
          ].map(({ Icon, metric, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border p-7"
              style={{ borderColor: BORDER, backgroundColor: ACCENT_BG }}
            >
              <Icon className="w-7 h-7" style={{ color: ACCENT_DARK }} />
              <p className="mt-4 text-3xl font-extrabold tracking-tight" style={{ color: ACCENT_DARK }}>
                {metric}
              </p>
              <p className="text-sm font-bold" style={{ color: TEXT }}>
                {title}
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Cas d'usage ───────── */}
      <section className="border-t" style={{ borderColor: BORDER, backgroundColor: '#FAFAFA' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT_DARK }}>
              <Utensils className="w-4 h-4" />
              Cas d'usage
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: TEXT }}>
              Deux façons de s'en servir
            </h2>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-5">
            {[
              {
                Icon: RefreshCw,
                title: 'Refonte de carte saisonnière',
                desc:
                  "Avant de lancer votre carte de printemps, vous analysez la carte d'hiver. Les Dogs sortent, les Puzzles sont renommés, les Stars gardent leur place de choix. La simulation vous montre la marge projetée de la nouvelle carte avant même de l'imprimer. Vous arrivez en saison avec une carte calibrée, pas un pari.",
              },
              {
                Icon: LineChart,
                title: 'Optimisation continue',
                desc:
                  "Chaque mois, vous jetez un œil à la matrice. Un plat glisse de Star vers Vache à lait parce que la viande a augmenté ? Vous le voyez tout de suite et ajustez le prix avant de perdre la marge. Le Menu Engineering devient un réflexe de pilotage, pas un grand chantier annuel.",
              },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-white border p-7" style={{ borderColor: BORDER }}>
                <span className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: ACCENT_BG }}>
                  <Icon className="w-6 h-6" style={{ color: ACCENT_DARK }} />
                </span>
                <h3 className="mt-4 text-xl font-extrabold tracking-tight" style={{ color: TEXT }}>
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>

          {/* lien interne contextualisé */}
          <div
            className="mt-8 rounded-2xl border p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between bg-white"
            style={{ borderColor: BORDER }}
          >
            <div className="flex items-start gap-3">
              <Megaphone className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: ACCENT_DARK }} />
              <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                Vous voulez savoir lequel de vos plats est réellement le plus rentable ? Notre guide détaille la
                méthode complète, exemples chiffrés à l'appui.
              </p>
            </div>
            <Link
              to="/blog/plat-le-plus-rentable-restaurant"
              className="inline-flex items-center gap-2 text-sm font-semibold whitespace-nowrap hover:underline"
              style={{ color: ACCENT_DARK }}
            >
              Lire le guide
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT_DARK }}>
            <HelpCircle className="w-4 h-4" />
            Questions fréquentes
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: TEXT }}>
            Tout ce qu'il faut savoir
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {faqItems.map((item, i) => {
            const open = openFaq === i;
            return (
              <div key={item.question} className="rounded-2xl border overflow-hidden" style={{ borderColor: BORDER }}>
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  onClick={() => setOpenFaq(open ? null : i)}
                  aria-expanded={open}
                >
                  <span className="text-base font-bold tracking-tight" style={{ color: TEXT }}>
                    {item.question}
                  </span>
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform"
                    style={{ backgroundColor: ACCENT_BG, transform: open ? 'rotate(45deg)' : 'none' }}
                  >
                    <X className="w-4 h-4 rotate-45" style={{ color: ACCENT_DARK }} />
                  </span>
                </button>
                {open && (
                  <div className="px-5 pb-5 -mt-1">
                    <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ───────── CTA final ───────── */}
      <section className="px-4 sm:px-6 pb-20">
        <div
          className="max-w-6xl mx-auto rounded-3xl px-8 py-14 sm:px-14 sm:py-20 text-center text-white relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)` }}
        >
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Découvrez quel plat vous coûte de l'argent
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-emerald-50">
              RestauMargin construit votre matrice Menu Engineering en quelques minutes à partir de vos fiches
              techniques et de vos ventes. Essai gratuit, sans carte bancaire.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/login?mode=register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-semibold bg-white transition-transform hover:scale-[1.02]"
                style={{ color: ACCENT_DARK }}
              >
                Analyser ma carte gratuitement
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/fonctionnalites/fiches-techniques"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-semibold border border-white/40 text-white transition-colors hover:bg-white/10"
              >
                <Layers className="w-4 h-4" />
                Voir les fiches techniques
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Footer ───────── */}
      <footer className="border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <Link to="/landing" className="flex items-center gap-2 font-extrabold tracking-tight" style={{ color: TEXT }}>
                <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: ACCENT_BG }}>
                  <ChefHat className="w-5 h-5" style={{ color: ACCENT_DARK }} />
                </span>
                RestauMargin
              </Link>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                Le logiciel de marge et de pilotage des restaurants. Food cost, fiches techniques et Menu Engineering
                réunis.
              </p>
            </div>

            <div>
              <p className="text-sm font-bold mb-3" style={{ color: TEXT }}>
                Fonctionnalités
              </p>
              <ul className="space-y-2 text-sm" style={{ color: TEXT_MUTED }}>
                <li>
                  <Link to="/fonctionnalites/menu-engineering" className="hover:text-emerald-700 transition-colors">
                    Menu Engineering
                  </Link>
                </li>
                <li>
                  <Link to="/fonctionnalites/fiches-techniques" className="hover:text-emerald-700 transition-colors">
                    Fiches techniques
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-bold mb-3" style={{ color: TEXT }}>
                Ressources
              </p>
              <ul className="space-y-2 text-sm" style={{ color: TEXT_MUTED }}>
                <li>
                  <Link to="/blog/menu-engineering-boston-matrix" className="hover:text-emerald-700 transition-colors">
                    Guide matrice BCG
                  </Link>
                </li>
                <li>
                  <Link to="/blog/plat-le-plus-rentable-restaurant" className="hover:text-emerald-700 transition-colors">
                    Le plat le plus rentable
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-bold mb-3" style={{ color: TEXT }}>
                Commencer
              </p>
              <ul className="space-y-2 text-sm" style={{ color: TEXT_MUTED }}>
                <li>
                  <a href="/login?mode=register" className="hover:text-emerald-700 transition-colors">
                    Essai gratuit
                  </a>
                </li>
                <li>
                  <Link to="/login" className="hover:text-emerald-700 transition-colors">
                    Connexion
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t text-xs flex flex-col sm:flex-row justify-between gap-2" style={{ borderColor: BORDER, color: TEXT_MUTED }}>
            <span>© 2026 RestauMargin. Tous droits réservés.</span>
            <span>Fait pour les restaurateurs qui pilotent leur marge.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
