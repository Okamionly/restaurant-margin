import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Bluetooth,
  Zap,
  Smartphone,
  CheckCircle,
  Timer,
  ArrowRight,
  ChefHat,
  X,
  FileText,
  Wifi,
  WifiOff,
  Gauge,
  ClipboardList,
  Package,
  Boxes,
  ShieldCheck,
  Sparkles,
  Plus,
  Minus,
  Quote,
  Layers,
  Utensils,
  ScanLine,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';

/* ═══════════════════════════════════════════════════════════════
   Page fonctionnalite — "Pesage Bluetooth"
   Balance connectee a la fiche technique en plein service.
   Mots-cles cibles : balance connectee restaurant /
   pesage cuisine bluetooth / balance bluetooth restaurant
   ~1 800 mots — mode clair uniquement, theme landing vert
   ═══════════════════════════════════════════════════════════════ */

// Palette landing verte (mode clair uniquement, hex directs)
const ACCENT = '#10B981';
const ACCENT_DARK = '#047857';
const ACCENT_BG = '#ECFDF5';
const TEXT = '#0F172A';
const TEXT_MUTED = '#64748B';
const BORDER = '#E5E7EB';

const faqItems = [
  {
    question: 'Quelles balances Bluetooth sont compatibles avec RestauMargin ?',
    answer:
      "RestauMargin se connecte aux balances Bluetooth Low Energy (BLE) qui exposent un profil de poids standard, ainsi qu'aux modeles courants de balances de cuisine connectees vendus dans le commerce (portee 0 a 5 ou 0 a 15 kg, precision 1 g). Le kit hardware officiel RestauMargin embarque une balance pre-appairee et testee, prete a l'emploi des la sortie du carton. Si vous possedez deja une balance Bluetooth, contactez-nous avec la reference exacte : nous verifions la compatibilite avant tout achat.",
  },
  {
    question: 'Faut-il obligatoirement une tablette pour utiliser le pesage Bluetooth ?',
    answer:
      "Non. Le pesage Bluetooth fonctionne sur n'importe quel appareil qui ouvre RestauMargin dans un navigateur compatible Web Bluetooth : tablette Android (Samsung Galaxy Tab A9+ recommandee en mode kiosque), smartphone Android, ou ordinateur portable Chrome/Edge. La tablette reste la solution la plus confortable en cuisine : grand ecran lisible a distance, support mural ou sur pied, et mode kiosque qui verrouille l'appareil sur l'application. Le smartphone du chef depanne tres bien pour un controle ponctuel.",
  },
  {
    question: 'Le pesage fonctionne-t-il hors-ligne, sans connexion internet ?',
    answer:
      "Oui pour la lecture du poids. La balance communique avec la tablette en Bluetooth direct, sans passer par internet : meme en plein creux de reseau, le poids s'affiche et s'inscrit dans la fiche technique. RestauMargin etant une PWA (Progressive Web App), les fiches techniques deja consultees restent disponibles en cache. La synchronisation des couts et l'enregistrement definitif se font des que la connexion revient. En clair : on continue de peser et de produire meme quand la box du restaurant fait des siennes.",
  },
  {
    question: 'Le kit hardware avec la balance est-il fourni avec l\'abonnement ?',
    answer:
      "Le logiciel RestauMargin et la fonction pesage Bluetooth sont inclus dans l'abonnement. Le materiel (balance Bluetooth + tablette Samsung + support) est proposé en option via la Station Produit : vous pouvez utiliser votre propre balance compatible, ou commander le kit clé en main pre-configure pour gagner du temps a l'installation. Decouvrez les configurations et tarifs materiel sur la page Station Produit.",
  },
  {
    question: 'Peut-on connecter plusieurs balances en meme temps ?',
    answer:
      "Oui. Un restaurant avec plusieurs postes (garde-manger, patisserie, chaud) peut equiper chaque poste de sa propre balance et de sa propre tablette : chacune se connecte independamment a son appareil. Une meme tablette peut aussi memoriser plusieurs balances et basculer de l'une a l'autre selon le poste. Chaque pesee est rattachee a la fiche technique ouverte sur l'appareil concerne, sans melange entre les postes.",
  },
  {
    question: 'Quelle est la precision du pesage et est-elle suffisante pour le food cost ?',
    answer:
      "Les balances compatibles affichent une precision de 1 gramme sur les petites portées (0 a 5 kg), largement suffisante pour la cuisine : epices, levure, sel, beurre, garnitures. Pour les grosses quantites (viandes, pates, sauces), une precision de 1 a 2 g reste négligeable face au cout reel. L'essentiel est que le poids inscrit soit le vrai poids pese, pas une estimation de memoire : c'est exactement ce que garantit la connexion directe balance vers fiche technique, et c'est ce qui rend votre food cost juste au gramme pres.",
  },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Pesage Bluetooth en plein service : la balance connectee a vos fiches techniques',
  description:
    "Connectez une balance Bluetooth a vos fiches techniques RestauMargin. Pesez un ingredient en plein service, le poids et le cout s'inscrivent tout seuls. Fini les post-it et les food cost approximatifs.",
  image: 'https://www.restaumargin.fr/og-image.png',
  author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
  publisher: {
    '@type': 'Organization',
    name: 'RestauMargin',
    logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
  },
  datePublished: '2026-05-28',
  dateModified: '2026-05-28',
  wordCount: 1900,
  inLanguage: 'fr-FR',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://www.restaumargin.fr/fonctionnalites/pesage-bluetooth',
  },
};

export default function FonctionnalitePesageBluetooth() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Inter', system-ui, sans-serif", color: TEXT }}
    >
      <SEOHead
        title="Pesage Bluetooth en cuisine | Balance connectée restaurant | RestauMargin"
        description="Balance Bluetooth connectée à vos fiches techniques. Pesez en plein service, le poids et le coût s'inscrivent tout seuls. Fini les post-it et les food cost approximatifs."
        path="/fonctionnalites/pesage-bluetooth"
        type="article"
        schema={[
          articleSchema,
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Fonctionnalités', url: 'https://www.restaumargin.fr/#fonctionnalites' },
            {
              name: 'Pesage Bluetooth',
              url: 'https://www.restaumargin.fr/fonctionnalites/pesage-bluetooth',
            },
          ]),
        ]}
      />

      {/* ───────────── Navbar sticky ───────────── */}
      <nav
        className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b"
        style={{ borderColor: BORDER }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-lg tracking-tight">
            <ChefHat className="w-7 h-7" style={{ color: ACCENT }} />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: TEXT_MUTED }}
            >
              Connexion
            </Link>
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-white text-sm font-semibold rounded-full transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: ACCENT }}
            >
              <Sparkles className="w-4 h-4" />
              Essai gratuit
            </Link>
          </div>
        </div>
      </nav>

      {/* ───────────── Breadcrumb ───────────── */}
      <div className="border-b" style={{ borderColor: BORDER, backgroundColor: '#FFFFFF' }}>
        <div
          className="max-w-5xl mx-auto px-4 sm:px-6 py-3 text-xs flex items-center gap-2 flex-wrap"
          style={{ color: TEXT_MUTED }}
        >
          <Link to="/" className="hover:opacity-70 transition-opacity">
            Accueil
          </Link>
          <span style={{ color: BORDER }}>/</span>
          <Link to="/#fonctionnalites" className="hover:opacity-70 transition-opacity">
            Fonctionnalités
          </Link>
          <span style={{ color: BORDER }}>/</span>
          <span className="font-semibold" style={{ color: TEXT }}>
            Pesage Bluetooth
          </span>
        </div>
      </div>

      {/* ───────────── Hero ───────────── */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(1100px 460px at 80% -10%, ${ACCENT_BG} 0%, #FFFFFF 60%)`,
          }}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-20">
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
            style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}
          >
            <Bluetooth className="w-3.5 h-3.5" />
            Fonctionnalité 05
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] max-w-3xl">
            Pesage Bluetooth
            <span className="block" style={{ color: ACCENT }}>
              en plein service
            </span>
          </h1>

          <p
            className="mt-6 text-lg sm:text-xl leading-relaxed max-w-2xl"
            style={{ color: TEXT_MUTED }}
          >
            Connectez une <strong style={{ color: TEXT }}>balance Bluetooth</strong> à vos fiches
            techniques. Vous posez l'ingrédient, le poids s'inscrit tout seul et le coût matière se
            calcule à l'instant. Plus de post-it gribouillé entre deux coups de feu, plus de
            ressaisie le soir. Le bon poids, le bon coût, en temps réel.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-white font-semibold rounded-2xl shadow-sm transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: ACCENT }}
            >
              Essayer gratuitement
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/station-produit"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-semibold rounded-2xl border-2 transition-colors hover:bg-white"
              style={{ borderColor: BORDER, color: TEXT, backgroundColor: '#FFFFFF' }}
            >
              <Package className="w-4 h-4" style={{ color: ACCENT }} />
              Voir le kit matériel
            </Link>
          </div>

          {/* Mini stat band */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <X className="w-4 h-4" />, value: '0', label: 'ressaisie le soir' },
              { icon: <Scale className="w-4 h-4" />, value: '1 g', label: 'de précision' },
              { icon: <Timer className="w-4 h-4" />, value: '~3 s', label: 'par pesée' },
              { icon: <WifiOff className="w-4 h-4" />, value: 'Hors-ligne', label: 'ça marche aussi' },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-2xl border p-4"
                style={{ borderColor: BORDER, backgroundColor: '#FFFFFF' }}
              >
                <div className="flex items-center gap-1.5 mb-1" style={{ color: ACCENT }}>
                  {s.icon}
                </div>
                <div className="text-2xl font-extrabold tracking-tight">{s.value}</div>
                <div className="text-xs" style={{ color: TEXT_MUTED }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ───────────── Le problème ───────────── */}
      <Section>
        <SectionLabel icon={<FileText className="w-4 h-4" />}>Le problème</SectionLabel>
        <H2>Le post-it, ennemi numéro un de votre food cost</H2>
        <Lead>
          Vous connaissez la scène. Vendredi soir, 20h30, le rush est lancé. Vous lancez une
          nouvelle sauce, vous pesez 240 g de beurre, 80 g d'échalote, un filet d'huile. Vous
          notez tout sur un coin de bon de commande, vous vous dites « je rentrerai ça dans la
          fiche demain matin ». Demain matin, le post-it a disparu sous une pile de factures, ou il
          est taché de sauce, ou les chiffres sont devenus illisibles.
        </Lead>
        <p className="mt-4 leading-relaxed" style={{ color: TEXT_MUTED }}>
          Résultat : la fiche technique reste figée sur d'anciens grammages, jamais réajustée. Vos
          coûts matière sont calculés sur des quantités « à peu près », arrondies de mémoire. Quand
          on multiplie ces approximations par des centaines de couverts par semaine, l'écart entre
          le food cost théorique et le food cost réel se creuse — et c'est exactement là que la
          marge fuit, sans qu'on sache pourquoi.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {[
            {
              t: 'La double saisie qui ne se fait jamais',
              d: "Peser, noter sur papier, puis ressaisir à froid : trois étapes pour une seule donnée. En plein service, la troisième étape saute presque toujours.",
            },
            {
              t: 'Les post-it qui disparaissent',
              d: "Tachés, froissés, perdus, jetés avec la mise en place : le support papier ne survit pas à un coup de feu en cuisine.",
            },
            {
              t: 'Les erreurs de recopie',
              d: "240 g qui deviennent 420 g, une virgule mal placée, une unité oubliée. Chaque ressaisie manuelle est une occasion de se tromper.",
            },
            {
              t: 'Un food cost « au pif »',
              d: "Sans poids réel, le coût d'une recette repose sur une estimation. On croit marger à 28 %, on marge en réalité à 34 %.",
            },
          ].map((p, i) => (
            <div
              key={i}
              className="rounded-2xl border p-5 flex gap-3"
              style={{ borderColor: BORDER, backgroundColor: '#FFFFFF' }}
            >
              <div
                className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
              >
                <X className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold tracking-tight">{p.t}</h3>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                  {p.d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ───────────── Comment ça marche ───────────── */}
      <Section tint>
        <SectionLabel icon={<Zap className="w-4 h-4" />}>Comment ça marche</SectionLabel>
        <H2>Du saladier à la fiche technique, sans toucher au clavier</H2>
        <Lead>
          Le principe tient en une phrase : la balance parle directement à la fiche technique. Vous
          n'avez plus qu'à poser l'ingrédient. Quatre étapes, et la dernière se fait toute seule.
        </Lead>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              n: '01',
              icon: <Bluetooth className="w-6 h-6" />,
              t: 'Connectez la balance',
              d: "Un appui sur « Connecter une balance » dans RestauMargin, vous sélectionnez votre balance Bluetooth. L'appairage est mémorisé : les fois suivantes, c'est instantané.",
            },
            {
              n: '02',
              icon: <Smartphone className="w-6 h-6" />,
              t: 'Ouvrez la fiche',
              d: "Sur la tablette ou le mobile, vous ouvrez la fiche technique de la recette en cours. La ligne d'ingrédient à peser attend simplement son poids.",
            },
            {
              n: '03',
              icon: <Scale className="w-6 h-6" />,
              t: "Posez l'ingrédient",
              d: "Vous posez la farine, la viande, le beurre sur la balance. Le poids se transmet en direct et s'inscrit tout seul dans la fiche — les mains restent en cuisine.",
            },
            {
              n: '04',
              icon: <Gauge className="w-6 h-6" />,
              t: 'Coût calculé',
              d: "RestauMargin multiplie le poids réel par le prix au kilo de l'ingrédient. Le coût de la ligne et le food cost de la recette se recalculent instantanément.",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="relative rounded-2xl border p-6 bg-white"
              style={{ borderColor: BORDER }}
            >
              <span
                className="absolute top-5 right-5 text-3xl font-extrabold tracking-tight opacity-15"
                style={{ color: ACCENT }}
              >
                {s.n}
              </span>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}
              >
                {s.icon}
              </div>
              <h3 className="font-extrabold tracking-tight text-lg">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                {s.d}
              </p>
            </div>
          ))}
        </div>

        <div
          className="mt-8 rounded-2xl border p-5 flex items-start gap-3 bg-white"
          style={{ borderColor: BORDER }}
        >
          <ScanLine className="w-5 h-5 shrink-0 mt-0.5" style={{ color: ACCENT }} />
          <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
            <strong style={{ color: TEXT }}>Tout est lié.</strong> Le poids pesé alimente
            directement la{' '}
            <Link
              to="/fonctionnalites/fiches-techniques"
              className="font-semibold underline decoration-2 underline-offset-2"
              style={{ color: ACCENT_DARK }}
            >
              fiche technique
            </Link>
            , qui alimente le food cost, qui alimente vos marges. Plus aucun maillon de la chaîne ne
            repose sur un chiffre noté à la va-vite.
          </p>
        </div>
      </Section>

      {/* ───────────── Le matériel ───────────── */}
      <Section>
        <SectionLabel icon={<Package className="w-4 h-4" />}>Le matériel</SectionLabel>
        <H2>Le bon poste de pesée pour une cuisine pro</H2>
        <Lead>
          Le pesage Bluetooth fonctionne avec du matériel simple et robuste. Vous pouvez partir avec
          ce que vous avez, ou commander un kit clé en main déjà configuré.
        </Lead>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {[
            {
              icon: <Scale className="w-6 h-6" />,
              t: 'Balance Bluetooth',
              d: "Une balance de cuisine connectée en Bluetooth Low Energy (BLE), précision 1 g, portée 5 ou 15 kg selon vos besoins. Surface inox facile à nettoyer, résistante aux projections.",
              tag: 'Cœur du dispositif',
            },
            {
              icon: <Smartphone className="w-6 h-6" />,
              t: 'Tablette Samsung Galaxy Tab A9+',
              d: "L'écran de référence en cuisine : grand, lisible à distance, robuste. En mode kiosque, la tablette est verrouillée sur RestauMargin — impossible d'en sortir par erreur en plein service.",
              tag: 'Recommandée',
            },
            {
              icon: <Boxes className="w-6 h-6" />,
              t: 'Kit hardware optionnel',
              d: "Balance + tablette + support, le tout pré-appairé et pré-configuré. Vous déballez, vous branchez, vous pesez. Idéal pour ne pas perdre de temps à l'installation.",
              tag: 'Clé en main',
            },
          ].map((m, i) => (
            <div
              key={i}
              className="rounded-2xl border p-6 bg-white flex flex-col"
              style={{ borderColor: BORDER }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}
              >
                {m.icon}
              </div>
              <span
                className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide mb-2"
                style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}
              >
                {m.tag}
              </span>
              <h3 className="font-extrabold tracking-tight text-lg">{m.t}</h3>
              <p className="mt-2 text-sm leading-relaxed flex-1" style={{ color: TEXT_MUTED }}>
                {m.d}
              </p>
            </div>
          ))}
        </div>

        <div
          className="mt-8 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
          style={{ backgroundColor: ACCENT_BG }}
        >
          <div className="flex items-start gap-3">
            <Wifi className="w-6 h-6 shrink-0 mt-0.5" style={{ color: ACCENT_DARK }} />
            <p className="text-sm leading-relaxed" style={{ color: ACCENT_DARK }}>
              <strong>Pas envie de chercher le bon modèle ?</strong> La Station Produit réunit les
              configurations matériel testées et validées par RestauMargin, balance Bluetooth
              incluse, prêtes pour le mode kiosque.
            </p>
          </div>
          <Link
            to="/station-produit"
            className="inline-flex shrink-0 items-center justify-center gap-2 px-5 py-3 text-white font-semibold rounded-xl transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: ACCENT_DARK }}
          >
            Station Produit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Section>

      {/* ───────────── Bénéfices chiffrés ───────────── */}
      <Section tint>
        <SectionLabel icon={<Gauge className="w-4 h-4" />}>Bénéfices chiffrés</SectionLabel>
        <H2>Ce que vous gagnez, concrètement</H2>
        <Lead>
          Connecter la balance à la fiche technique n'est pas un gadget : c'est ce qui transforme
          un food cost « estimé » en food cost « mesuré ». Voici l'effet sur votre quotidien.
        </Lead>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <X className="w-6 h-6" />,
              value: '0',
              t: 'ressaisie',
              d: 'Le poids entre une seule fois, depuis la balance. La double saisie du soir disparaît purement et simplement.',
            },
            {
              icon: <Scale className="w-6 h-6" />,
              value: 'Au gramme',
              t: 'food cost exact',
              d: "Vos coûts matière reposent sur des poids réels, pas sur des estimations de mémoire. Le théorique colle enfin au réel.",
            },
            {
              icon: <FileText className="w-6 h-6" />,
              value: '-100 %',
              t: 'de post-it',
              d: 'Plus aucun bout de papier entre la balance et la fiche. Tout est capté, daté et conservé dans RestauMargin.',
            },
            {
              icon: <Timer className="w-6 h-6" />,
              value: 'Gain de temps',
              t: 'en service',
              d: "Une pesée prend quelques secondes au lieu d'un aller-retour papier. Multiplié par chaque mise en place, le gain est réel.",
            },
          ].map((b, i) => (
            <div
              key={i}
              className="rounded-2xl border p-6 bg-white"
              style={{ borderColor: BORDER }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}
              >
                {b.icon}
              </div>
              <div className="text-2xl font-extrabold tracking-tight" style={{ color: ACCENT_DARK }}>
                {b.value}
              </div>
              <div className="font-bold tracking-tight">{b.t}</div>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                {b.d}
              </p>
            </div>
          ))}
        </div>

        <div
          className="mt-8 rounded-2xl border bg-white p-6 sm:p-8 flex gap-4"
          style={{ borderColor: BORDER }}
        >
          <Quote className="w-8 h-8 shrink-0" style={{ color: ACCENT }} />
          <div>
            <p className="text-lg leading-relaxed" style={{ color: TEXT }}>
              « Avant, je notais mes pesées sur un carnet et je passais le dimanche à tout
              ressaisir. La moitié du temps, je ne le faisais pas. Maintenant je pose sur la balance,
              c'est dans la fiche, et je vois mon coût matière bouger en direct. »
            </p>
            <p className="mt-3 text-sm font-semibold" style={{ color: TEXT_MUTED }}>
              — Chef de cuisine, bistrot 60 couverts
            </p>
          </div>
        </div>
      </Section>

      {/* ───────────── Cas d'usage ───────────── */}
      <Section>
        <SectionLabel icon={<Utensils className="w-4 h-4" />}>Cas d'usage</SectionLabel>
        <H2>Trois moments où la balance connectée change la donne</H2>
        <Lead>
          Le pesage Bluetooth n'est pas réservé à la création de recettes. Il s'invite dans toute la
          journée d'une cuisine.
        </Lead>

        <div className="mt-10 space-y-5">
          {[
            {
              icon: <Layers className="w-6 h-6" />,
              t: 'La mise en place du matin',
              d: "Vous montez vos bases : sauces mères, fonds, garnitures, pâtes. Chaque ingrédient pesé s'inscrit directement dans la fiche de production. À la fin de la mise en place, vos coûts du jour sont déjà à jour, sans une minute de saisie supplémentaire.",
            },
            {
              icon: <Gauge className="w-6 h-6" />,
              t: 'Le contrôle des portions en service',
              d: "Une assiette doit faire 180 g de protéine, pas 230. Posez la portion sur la balance avant de dresser : si l'écart est trop grand, RestauMargin le voit immédiatement. Vous standardisez vos portions et vous arrêtez de servir 30 % de viande en trop sans vous en rendre compte.",
            },
            {
              icon: <ClipboardList className="w-6 h-6" />,
              t: "L'inventaire",
              d: "Compter au kilo plutôt qu'à l'unité quand c'est pertinent : restes de viande, vrac, épices, fromages à la coupe. Vous posez, le poids remonte dans l'inventaire, la valorisation du stock se fait sur des quantités réelles. Fini les inventaires « à la louche ».",
            },
          ].map((u, i) => (
            <div
              key={i}
              className="rounded-2xl border p-6 bg-white flex flex-col sm:flex-row gap-4 sm:items-center"
              style={{ borderColor: BORDER }}
            >
              <div
                className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}
              >
                {u.icon}
              </div>
              <div>
                <h3 className="font-extrabold tracking-tight text-lg">{u.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                  {u.d}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mini checklist garanties */}
        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          {[
            { icon: <WifiOff className="w-5 h-5" />, t: 'Marche hors-ligne', d: 'Bluetooth direct, sans internet.' },
            { icon: <ShieldCheck className="w-5 h-5" />, t: 'Données conservées', d: 'Chaque pesée datée et tracée.' },
            { icon: <Boxes className="w-5 h-5" />, t: 'Multi-postes', d: 'Une balance par poste, sans mélange.' },
          ].map((c, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 flex items-center gap-3"
              style={{ backgroundColor: ACCENT_BG }}
            >
              <div style={{ color: ACCENT_DARK }}>{c.icon}</div>
              <div>
                <div className="font-bold tracking-tight text-sm" style={{ color: ACCENT_DARK }}>
                  {c.t}
                </div>
                <div className="text-xs" style={{ color: ACCENT_DARK, opacity: 0.85 }}>
                  {c.d}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ───────────── FAQ ───────────── */}
      <Section tint>
        <SectionLabel icon={<CheckCircle className="w-4 h-4" />}>Questions fréquentes</SectionLabel>
        <H2>Tout ce qu'on nous demande sur le pesage Bluetooth</H2>

        <div className="mt-8 space-y-3">
          {faqItems.map((item, i) => {
            const open = openFaq === i;
            return (
              <div
                key={i}
                className="rounded-2xl border bg-white overflow-hidden"
                style={{ borderColor: BORDER }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : i)}
                  aria-expanded={open}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-4"
                >
                  <span className="font-bold tracking-tight" style={{ color: TEXT }}>
                    {item.question}
                  </span>
                  <span
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}
                  >
                    {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                {open && (
                  <div
                    className="px-5 sm:px-6 pb-5 text-sm leading-relaxed"
                    style={{ color: TEXT_MUTED }}
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* ───────────── CTA final ───────────── */}
      <section className="px-4 sm:px-6 pb-20 pt-4">
        <div
          className="max-w-5xl mx-auto rounded-3xl px-6 sm:px-12 py-14 sm:py-16 text-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`,
          }}
        >
          <div
            className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20"
            style={{ background: 'rgba(255,255,255,0.4)' }}
          />
          <Scale className="w-10 h-10 mx-auto text-white/90" />
          <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
            Pesez juste, margez juste
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/90 max-w-xl mx-auto leading-relaxed">
            Essayez le pesage Bluetooth avec vos vraies fiches techniques. Et si vous voulez le poste
            complet, balance comprise, la Station Produit s'occupe du matériel.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-semibold rounded-2xl bg-white transition-transform hover:scale-[1.02]"
              style={{ color: ACCENT_DARK }}
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/station-produit"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-semibold rounded-2xl border-2 border-white/70 text-white transition-colors hover:bg-white/10"
            >
              <Package className="w-4 h-4" />
              Découvrir la Station Produit
            </Link>
          </div>
          <p className="mt-5 text-sm text-white/80">
            Sans carte bancaire · Compatible balance Bluetooth · Mode kiosque tablette
          </p>
        </div>
      </section>

      {/* ───────────── Footer ───────────── */}
      <footer className="border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <Link to="/" className="flex items-center gap-2 font-extrabold text-lg tracking-tight">
                <ChefHat className="w-6 h-6" style={{ color: ACCENT }} />
                <span>RestauMargin</span>
              </Link>
              <p className="mt-2 text-sm max-w-xs" style={{ color: TEXT_MUTED }}>
                Le logiciel de marge qui pèse, calcule et pilote la rentabilité de votre cuisine.
              </p>
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ color: TEXT_MUTED }}>
              <Link to="/fonctionnalites/fiches-techniques" className="hover:opacity-70 transition-opacity">
                Fiches techniques
              </Link>
              <Link to="/station-produit" className="hover:opacity-70 transition-opacity">
                Station Produit
              </Link>
              <Link to="/login?mode=register" className="hover:opacity-70 transition-opacity">
                Essai gratuit
              </Link>
              <Link to="/login" className="hover:opacity-70 transition-opacity">
                Connexion
              </Link>
            </nav>
          </div>
          <div
            className="mt-8 pt-6 border-t text-xs"
            style={{ borderColor: BORDER, color: TEXT_MUTED }}
          >
            © {new Date().getFullYear()} RestauMargin · Pesage Bluetooth, balance connectée pour
            restaurant.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Composants de présentation (locaux à la page)
   ───────────────────────────────────────────── */

function Section({ children, tint = false }: { children: React.ReactNode; tint?: boolean }) {
  return (
    <section
      className="px-4 sm:px-6 py-16 sm:py-20"
      style={{ backgroundColor: tint ? ACCENT_BG + '80' : '#FFFFFF' }}
    >
      <div className="max-w-5xl mx-auto">{children}</div>
    </section>
  );
}

function SectionLabel({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
      style={{ backgroundColor: '#FFFFFF', color: ACCENT_DARK, border: `1px solid ${BORDER}` }}
    >
      {icon}
      {children}
    </span>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight max-w-3xl"
      style={{ color: TEXT }}
    >
      {children}
    </h2>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 text-lg leading-relaxed max-w-2xl" style={{ color: TEXT_MUTED }}>
      {children}
    </p>
  );
}
