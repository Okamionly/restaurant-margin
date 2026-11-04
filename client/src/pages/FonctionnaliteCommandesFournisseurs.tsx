import { Link } from 'react-router-dom';
import {
  ChefHat,
  ArrowRight,
  Check,
  ChevronRight,
  Send,
  Truck,
  Clock,
  CheckCircle,
  MessageSquare,
  FileText,
  PhoneOff,
  PackageX,
  PencilLine,
  AlertTriangle,
  Sparkles,
  Brain,
  ClipboardList,
  Mail,
  Smartphone,
  Store,
  Building2,
  Layers,
  TrendingDown,
  ShieldCheck,
  Timer,
  History,
  Lightbulb,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Page fonctionnalité — Commandes fournisseurs en 1 clic
   Mot-clé principal : logiciel commande fournisseur restaurant
   Intent : conversion + SEO informationnel/commercial
   ═══════════════════════════════════════════════════════════════ */

const ACCENT = '#10B981';
const ACCENT_DARK = '#047857';
const ACCENT_BG = '#ECFDF5';
const TEXT = '#0F172A';
const TEXT_MUTED = '#64748B';
const BORDER = '#E5E7EB';

const FONT = "'Inter', system-ui, -apple-system, sans-serif";

const faqItems = [
  {
    question: 'Est-ce compatible avec mes fournisseurs actuels ?',
    answer:
      "Oui. RestauMargin ne vous oblige à changer de fournisseur. Vous ajoutez vos fournisseurs habituels (Metro, Transgourmet, Sysco, votre primeur, votre boucher, votre caviste local) avec leur email et leur numéro WhatsApp. La commande part directement chez eux dans le format qu'ils connaissent : un bon de commande clair avec références, quantités et unités. Aucune intégration technique n'est demandée à votre fournisseur.",
  },
  {
    question: 'Le fournisseur reçoit la commande par WhatsApp ou par email ?',
    answer:
      "Les deux, au choix, fournisseur par fournisseur. Votre primeur préfère WhatsApp ? Vous lui envoyez la commande sur WhatsApp en un clic. Votre grossiste veut un bon de commande PDF par email ? Vous lui envoyez un email avec le PDF en pièce jointe. Vous pouvez même combiner les deux pour un même fournisseur. Le restaurateur reste maître du canal pour chaque partenaire.",
  },
  {
    question: 'Puis-je modifier une commande avant de l\'envoyer ?',
    answer:
      "Toujours. L'IA propose des quantités (par exemple 12 kg de beurre, 8 caisses de tomates), mais rien ne part sans votre validation. Vous ajustez chaque ligne à la hausse ou à la baisse, vous ajoutez ou supprimez des produits, vous écrivez une note libre au fournisseur (livraison avant 7h, quai arrière, etc.). Le bon de commande se recalcule en direct avant l'envoi.",
  },
  {
    question: 'Où retrouve-t-on l\'historique des commandes passées ?',
    answer:
      "Chaque commande envoyée est archivée automatiquement avec sa date, son fournisseur, son canal d'envoi (email ou WhatsApp), le détail des lignes et le montant total estimé. Vous retrouvez en deux clics ce que vous aviez commandé la semaine dernière, vous dupliquez une ancienne commande pour gagner du temps, et vous suivez vos volumes par fournisseur sur le mois.",
  },
  {
    question: 'Puis-je commander chez plusieurs fournisseurs en même temps ?',
    answer:
      "Oui, c'est même l'intérêt principal. RestauMargin regroupe vos besoins du jour et prépare une commande par fournisseur en parallèle : la viande chez votre boucher, les légumes chez votre primeur, l'épicerie chez Metro. Vous validez et envoyez chaque bon de commande au bon partenaire en quelques secondes, sans rien ressaisir.",
  },
  {
    question: 'Comment ça s\'intègre avec la mercuriale et les prix fournisseurs ?',
    answer:
      "La commande s'appuie directement sur votre mercuriale RestauMargin : chaque produit connaît son fournisseur, son conditionnement, son unité et son dernier prix connu. Le montant estimé de la commande s'affiche donc en temps réel, et toute variation de prix détectée par la mercuriale est visible au moment de commander. C'est la suite logique du scan de factures OCR qui alimente vos prix.",
  },
];

const painPoints = [
  {
    icon: <PhoneOff className="w-6 h-6" />,
    title: 'Le coup de fil de 18h',
    desc:
      "Vous appelez le primeur entre deux services, on vous met en attente, vous dictez la commande de tête. Une caisse de tomates oubliée et c'est la rupture du lendemain midi.",
  },
  {
    icon: <PencilLine className="w-6 h-6" />,
    title: 'Le bout de papier perdu',
    desc:
      "La liste griffonnée sur un bon de bloc traîne sur le passe. Personne ne sait si la commande est partie, ni ce qui a été commandé exactement. Zéro trace.",
  },
  {
    icon: <PackageX className="w-6 h-6" />,
    title: 'Les erreurs de quantité',
    desc:
      "12 au lieu de 2, des kilos pris pour des pièces, une unité mal comprise au téléphone. Résultat : du gaspillage d'un côté, des ruptures de l'autre, et de la marge qui part.",
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: 'Pas de visibilité sur la dépense',
    desc:
      "Vous découvrez le montant à la réception de la facture, parfois 3 semaines plus tard. Impossible de piloter le food cost si vous ne savez pas ce que vous engagez en commandant.",
  },
];

const steps = [
  {
    n: '01',
    icon: <ClipboardList className="w-6 h-6" />,
    title: 'La mercuriale connaît vos fournisseurs et produits',
    desc:
      "Vos fournisseurs sont enregistrés une fois pour toutes : primeur, boucher, grossiste, caviste. Chaque produit est rattaché à son fournisseur avec son conditionnement (caisse de 6 kg, carton de 12, pièce) et son dernier prix connu. Plus besoin de retrouver qui livre quoi : RestauMargin le sait déjà.",
  },
  {
    n: '02',
    icon: <Brain className="w-6 h-6" />,
    title: "L'IA suggère les quantités selon vos stocks et vos ventes",
    desc:
      "En fonction de votre niveau de stock, de vos ventes récentes et de vos commandes habituelles, l'IA propose une liste prête : 12 kg de beurre, 8 caisses de tomates, 20 kg de pommes de terre. Vous partez d'une proposition intelligente, pas d'une feuille blanche à 18h.",
  },
  {
    n: '03',
    icon: <FileText className="w-6 h-6" />,
    title: 'Vous validez, le bon de commande est pré-rempli',
    desc:
      "Vous ajustez les quantités en deux clics, vous ajoutez une note (livraison avant 7h, quai arrière). Le bon de commande se génère automatiquement, propre et lisible, avec références, quantités, unités et montant total estimé. Rien à remettre au propre.",
  },
  {
    n: '04',
    icon: <Send className="w-6 h-6" />,
    title: 'Envoi Email ou WhatsApp en 1 clic, historique tracé',
    desc:
      "Un clic et la commande part chez le bon fournisseur, sur son canal préféré : WhatsApp pour le primeur, email avec PDF pour le grossiste. La commande est archivée avec sa date et son détail. Vous savez exactement ce qui a été commandé, à qui, et pour combien.",
  },
];

const benefits = [
  {
    icon: <Timer className="w-6 h-6" />,
    stat: '-80 %',
    label: 'de temps de commande',
    desc:
      "De 30 minutes de coups de fil à moins de 5 minutes pour boucler toutes vos commandes du soir.",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    stat: '0',
    label: 'erreur de saisie',
    desc:
      "Plus de quantités dictées à l'oreille : le bon de commande est généré depuis vos données, sans ressaisie.",
  },
  {
    icon: <TrendingDown className="w-6 h-6" />,
    stat: 'Moins',
    label: 'de ruptures de stock',
    desc:
      "Les suggestions IA basées sur vos ventes évitent les oublis et les commandes trop justes.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    stat: '100 %',
    label: 'de traçabilité',
    desc:
      "Chaque commande est horodatée et archivée : qui a commandé quoi, quand, et à quel fournisseur.",
  },
];

const useCases = [
  {
    icon: <Store className="w-7 h-7" />,
    tag: 'Bistrot de quartier',
    title: 'Le chef-propriétaire qui fait tout',
    desc:
      "Vous êtes en cuisine du matin au soir et vous commandez chez 4 fournisseurs locaux. Le soir, vous validez les suggestions de l'IA et vous envoyez tout par WhatsApp en 3 minutes, sans quitter le piano. Fini les appels ratés et les ardoises griffonnées.",
  },
  {
    icon: <Building2 className="w-7 h-7" />,
    tag: 'Restaurant à volume',
    title: 'Le second qui gère les achats',
    desc:
      "Avec 80 à 150 couverts par service, vous commandez gros et souvent. Les commandes récurrentes sont dupliquées en un clic, les quantités s'ajustent selon les ventes, et le montant estimé vous permet de tenir votre food cost à la journée, pas à la facture.",
  },
  {
    icon: <Layers className="w-7 h-7" />,
    tag: 'Groupe multi-sites',
    title: "Le responsable d'exploitation",
    desc:
      "Vous pilotez plusieurs établissements et vous voulez harmoniser les achats. Chaque site commande chez ses fournisseurs référencés, vous consolidez les volumes et l'historique reste centralisé pour négocier vos tarifs en position de force.",
  },
];

export default function FonctionnaliteCommandesFournisseurs() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: FONT, color: TEXT }}>
      <SEOHead
        title="Commandes fournisseurs en 1 clic | Logiciel restaurant RestauMargin"
        description="Automatisez vos commandes fournisseurs : l'IA suggère les quantités, le bon de livraison est pré-rempli, envoi Email ou WhatsApp en 1 clic. Fini les oublis et erreurs de saisie."
        path="/fonctionnalites/commandes-fournisseurs"
        type="article"
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Commandes fournisseurs en 1 clic pour restaurant',
            description:
              "Automatisez vos commandes fournisseurs : l'IA suggère les quantités selon vos stocks et vos ventes, le bon de commande est pré-rempli, envoi par Email ou WhatsApp en 1 clic.",
            datePublished: '2026-05-28',
            dateModified: '2026-05-28',
            author: { '@type': 'Organization', name: 'RestauMargin' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.restaumargin.fr/og-image.png',
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://www.restaumargin.fr/fonctionnalites/commandes-fournisseurs',
            },
          },
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Fonctionnalités', url: 'https://www.restaumargin.fr/fonctionnalites' },
            {
              name: 'Commandes fournisseurs',
              url: 'https://www.restaumargin.fr/fonctionnalites/commandes-fournisseurs',
            },
          ]),
        ]}
      />

      {/* ── Navbar ── */}
      <PublicHeader />

      {/* ── Breadcrumbs ── */}
      <div className="border-b py-3 px-4" style={{ backgroundColor: '#FAFAFA', borderColor: BORDER }}>
        <div
          className="max-w-6xl mx-auto text-xs flex items-center gap-1.5 flex-wrap"
          style={{ color: TEXT_MUTED }}
        >
          <Link to="/" className="transition-colors hover:opacity-70" style={{ color: TEXT_MUTED }}>
            Accueil
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            to="/logiciel-marge-restaurant"
            className="transition-colors hover:opacity-70"
            style={{ color: TEXT_MUTED }}
          >
            Fonctionnalités
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-semibold" style={{ color: TEXT }}>
            Commandes fournisseurs
          </span>
        </div>
      </div>

      {/* ── Hero ── */}
      <header
        className="pt-16 pb-14 px-4"
        style={{ background: `linear-gradient(to bottom, ${ACCENT_BG}, #FFFFFF 70%)` }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6"
            style={{ color: ACCENT_DARK, backgroundColor: '#D1FAE5' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Fonctionnalité 01
          </span>
          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6"
            style={{ color: TEXT }}
          >
            Commandes fournisseurs en 1 clic
          </h1>
          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8"
            style={{ color: TEXT_MUTED }}
          >
            Fini le coup de fil de 18h et les listes griffonnées. L'IA suggère vos quantités, le bon
            de commande se pré-remplit tout seul, et vous l'envoyez par{' '}
            <strong style={{ color: TEXT }}>email ou WhatsApp en un clic</strong>. Chaque commande est
            tracée.
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
              to="/demo"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 font-semibold rounded-full transition-colors hover:bg-black/5"
              style={{ borderColor: TEXT, color: TEXT }}
            >
              Voir la démo
            </Link>
          </div>

          <div
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
            style={{ color: TEXT_MUTED }}
          >
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" style={{ color: ACCENT }} /> Sans carte bancaire
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" style={{ color: ACCENT }} /> Compatible avec vos fournisseurs
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" style={{ color: ACCENT }} /> Email et WhatsApp
            </span>
          </div>
        </div>
      </header>

      {/* ── Le probleme ── */}
      <section className="py-16 px-4" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
              style={{ color: TEXT }}
            >
              La galère des commandes à la main
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_MUTED }}>
              Téléphone, papier, mémoire. Chaque soir, la commande fournisseur grignote votre temps
              et votre marge sans que vous le voyiez.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {painPoints.map((p, i) => (
              <div
                key={i}
                className="bg-white border rounded-2xl p-6 transition-colors"
                style={{ borderColor: BORDER }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = ACCENT)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
                >
                  {p.icon}
                </div>
                <h3 className="font-bold mb-2 text-lg" style={{ color: TEXT }}>
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comment ca marche ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
              style={{ color: TEXT }}
            >
              Comment ça marche
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_MUTED }}>
              Quatre étapes, de la suggestion intelligente à l'envoi tracé. Vous gardez la main à
              chaque étape.
            </p>
          </div>

          <div className="space-y-5">
            {steps.map((s, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row gap-5 sm:gap-8 bg-white border rounded-2xl p-6 sm:p-8 transition-colors"
                style={{ borderColor: BORDER }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = ACCENT)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}
              >
                <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-3 shrink-0">
                  <span
                    className="text-4xl sm:text-5xl font-extrabold tracking-tight"
                    style={{ color: ACCENT }}
                  >
                    {s.n}
                  </span>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}
                  >
                    {s.icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2" style={{ color: TEXT }}>
                    {s.title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed" style={{ color: TEXT_MUTED }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-full transition-opacity hover:opacity-90"
              style={{ backgroundColor: TEXT }}
            >
              Voir une commande en démo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Benefices chiffres ── */}
      <section className="py-16 px-4" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
              style={{ color: TEXT }}
            >
              Ce que vous gagnez concrètement
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_MUTED }}>
              Moins de temps perdu, plus de marge protégée. Des ordres de grandeur indicatifs,
              pas des résultats mesurés chez des clients.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="bg-white border rounded-2xl p-6 transition-colors"
                style={{ borderColor: BORDER }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = ACCENT)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}
                >
                  {b.icon}
                </div>
                <div className="text-3xl font-extrabold tracking-tight mb-1" style={{ color: ACCENT_DARK }}>
                  {b.stat}
                </div>
                <div className="font-semibold mb-2" style={{ color: TEXT }}>
                  {b.label}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cas d'usage ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
              style={{ color: TEXT }}
            >
              Pour chaque type de cuisine
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_MUTED }}>
              Du bistrot de quartier au groupe multi-sites, les commandes fournisseurs s'adaptent à
              votre organisation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((c, i) => (
              <div
                key={i}
                className="border rounded-2xl p-7 transition-colors flex flex-col"
                style={{ borderColor: BORDER }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = ACCENT)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}
                >
                  {c.icon}
                </div>
                <span
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: ACCENT_DARK }}
                >
                  {c.tag}
                </span>
                <h3 className="font-bold text-lg mb-3" style={{ color: TEXT }}>
                  {c.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Canaux d'envoi (highlight Email / WhatsApp) ── */}
      <section className="py-16 px-4" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
              style={{ color: TEXT }}
            >
              Le bon canal pour chaque fournisseur
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_MUTED }}>
              Vos fournisseurs n'ont rien à installer. La commande part dans le format qu'ils
              connaissent déjà.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white border rounded-2xl p-7" style={{ borderColor: BORDER }}>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}
              >
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: TEXT }}>
                WhatsApp
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: TEXT_MUTED }}>
                Idéal pour le primeur, le boucher ou le poissonnier du coin qui répond plus vite sur
                son téléphone. Le message reprend chaque ligne (8 caisses de tomates, 12 kg de
                beurre) et part directement sur leur numéro.
              </p>
              <ul className="space-y-1.5 text-sm" style={{ color: TEXT }}>
                {['Envoi instantané', 'Lu et confirmé par le fournisseur', 'Message clair et structure'].map(
                  (f, k) => (
                    <li key={k} className="flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" style={{ color: ACCENT }} />
                      {f}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="bg-white border rounded-2xl p-7" style={{ borderColor: BORDER }}>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}
              >
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: TEXT }}>
                Email avec bon de commande PDF
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: TEXT_MUTED }}>
                Parfait pour les grossistes type Metro, Transgourmet ou Sysco qui traitent des bons
                de commande formels. Un PDF propre, avec références, quantités, unités et montant
                estimé, en pièce jointe.
              </p>
              <ul className="space-y-1.5 text-sm" style={{ color: TEXT }}>
                {['Bon de commande PDF pré-rempli', 'Trace écrite pour la compta', 'Format pro et lisible'].map(
                  (f, k) => (
                    <li key={k} className="flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" style={{ color: ACCENT }} />
                      {f}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          <div
            className="mt-8 rounded-2xl border p-5 flex gap-3 text-sm leading-relaxed"
            style={{ backgroundColor: '#FFFFFF', borderColor: BORDER, color: TEXT }}
          >
            <Truck className="w-5 h-5 shrink-0 mt-0.5" style={{ color: ACCENT_DARK }} />
            <div>
              <strong>Exemple concret.</strong> Lundi 18h : RestauMargin propose 12 kg de beurre et 6
              caisses d'oeufs chez Metro, 8 caisses de tomates et 20 kg de pommes de terre chez votre
              primeur. Vous ajustez à 10 kg de beurre, vous validez, et les deux commandes partent en
              30 secondes, l'une par email, l'autre par WhatsApp.
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
              style={{ color: TEXT }}
            >
              Questions fréquentes
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: TEXT_MUTED }}>
              Tout ce que les restaurateurs demandent avant d'automatiser leurs commandes.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>

          <div
            className="rounded-xl border p-5 mt-8 flex gap-3 text-sm leading-relaxed"
            style={{ backgroundColor: ACCENT_BG, borderColor: '#A7F3D0', color: ACCENT_DARK }}
          >
            <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <strong>Une question spécifique ?</strong> Découvrez la fonctionnalité en conditions
              réelles depuis la{' '}
              <Link to="/demo" className="underline font-semibold">
                page démo
              </Link>{' '}
              ou écrivez à contact@restaumargin.fr.
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section
        className="py-20 px-4"
        style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})` }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6">
            Automatisez vos commandes dès aujourd'hui
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-3" style={{ color: '#D1FAE5' }}>
            Rendez vos soirées à la cuisine, pas au téléphone. Suggestions IA, bon de commande
            pré-rempli, envoi en un clic.
          </p>
          <p className="mb-10" style={{ color: '#ECFDF5' }}>
            Essai gratuit 7 jours - Sans carte bancaire - Sans engagement
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-10 py-5 font-extrabold rounded-full transition-colors text-lg shadow-2xl bg-white hover:bg-emerald-50"
              style={{ color: ACCENT_DARK }}
            >
              Essai gratuit 7 jours
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-10 py-5 border-2 border-white/40 text-white font-bold rounded-full hover:bg-white/10 transition-colors text-lg"
            >
              Voir la démo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Maillage interne ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-8 text-center" style={{ color: TEXT }}>
            Autres fonctionnalités
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <Link
              to="/fonctionnalites/mercuriale-alertes-prix"
              className="border rounded-2xl p-6 transition-colors group block"
              style={{ borderColor: BORDER }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = ACCENT)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}
            >
              <History className="w-8 h-8 mb-3" style={{ color: ACCENT }} />
              <h3 className="font-bold mb-2" style={{ color: TEXT }}>
                Mercuriale et alertes prix
              </h3>
              <p className="text-sm" style={{ color: TEXT_MUTED }}>
                Suivez l'historique des prix fournisseurs et soyez alerté dès qu'une hausse impacte
                votre marge.
              </p>
            </Link>
            <Link
              to="/fonctionnalites/ocr-factures"
              className="border rounded-2xl p-6 transition-colors group block"
              style={{ borderColor: BORDER }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = ACCENT)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}
            >
              <FileText className="w-8 h-8 mb-3" style={{ color: ACCENT }} />
              <h3 className="font-bold mb-2" style={{ color: TEXT }}>
                Scan de factures OCR
              </h3>
              <p className="text-sm" style={{ color: TEXT_MUTED }}>
                Photographiez vos bordereaux : les prix se mettent à jour automatiquement dans votre
                mercuriale.
              </p>
            </Link>
            <Link
              to="/pricing"
              className="border rounded-2xl p-6 transition-colors group block"
              style={{ borderColor: BORDER }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = ACCENT)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}
            >
              <Clock className="w-8 h-8 mb-3" style={{ color: ACCENT }} />
              <h3 className="font-bold mb-2" style={{ color: TEXT }}>
                Tarifs RestauMargin
              </h3>
              <p className="text-sm" style={{ color: TEXT_MUTED }}>
                Une seule offre à 19 €/mois, sans engagement. Démarrez avec l'essai gratuit 7 jours.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <PublicFooter />
    </div>
  );
}

/* ═══════════════ Sous-composants ═══════════════ */

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="bg-white border rounded-xl group" style={{ borderColor: BORDER }}>
      <summary className="px-5 py-4 font-semibold cursor-pointer select-none flex items-center justify-between gap-4" style={{ color: TEXT }}>
        {q}
        <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform shrink-0" style={{ color: ACCENT }} />
      </summary>
      <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
        {a}
      </p>
    </details>
  );
}
