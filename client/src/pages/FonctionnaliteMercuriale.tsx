import { Link } from 'react-router-dom';
import {
  Truck,
  TrendingUp,
  Bell,
  AlertTriangle,
  LineChart,
  DollarSign,
  ChefHat,
  ArrowRight,
  Check,
  Receipt,
  ScanLine,
  History,
  BarChart3,
  Sparkles,
  Target,
  Handshake,
  GitCompare,
  ShieldCheck,
  Lightbulb,
  Clock,
  Percent,
  Package,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';

/* ═══════════════════════════════════════════════════════════════
   Fonctionnalité 04 — Mercuriale & alertes prix
   Mots-clés : mercuriale restaurant, suivi prix fournisseurs,
   logiciel mercuriale
   Design : landing vert RestauMargin (emerald)
   ═══════════════════════════════════════════════════════════════ */

const ACCENT = '#10B981';
const ACCENT_DARK = '#047857';
const ACCENT_BG = '#ECFDF5';
const TEXT = '#0F172A';
const TEXT_MUTED = '#64748B';
const BORDER = '#E5E7EB';

const faqItems = [
  {
    question: "Les prix sont-ils importés automatiquement ?",
    answer:
      "Oui. Trois options coexistent : la saisie manuelle d'un prix au catalogue, l'import d'un fichier tarifaire fournisseur (Excel ou CSV de Metro, Transgourmet, Sysco...), et surtout le scan OCR de vos factures. Vous photographiez un bordereau, l'OCR lit chaque ligne, rapproche le produit de votre catalogue et enregistre le prix daté. La mercuriale se construit toute seule, facture après facture, sans ressaisie.",
  },
  {
    question: "Puis-je suivre plusieurs fournisseurs pour le même produit ?",
    answer:
      "Absolument. Un même ingrédient (le beurre AOP, par exemple) peut être référencé chez Metro, chez votre grossiste régional et chez un crémier de proximité. RestauMargin conserve une courbe de prix distincte par couple produit/fournisseur et affiche, à tout moment, lequel propose le meilleur tarif sur la période. Aucune limite sur le nombre de fournisseurs ni de références.",
  },
  {
    question: "Comment comparer deux fournisseurs sur un même produit ?",
    answer:
      "La fiche produit superpose les courbes de tous vos fournisseurs sur le même graphique. Vous voyez immédiatement l'écart de prix, sa stabilité dans le temps et la fréquence des hausses. La vue comparative calcule aussi le coût moyen pondéré par vos volumes d'achat réels : utile pour savoir si le fournisseur le moins cher au kilo l'est encore une fois la qualité et les minimums de commande pris en compte.",
  },
  {
    question: "Les alertes de dérive sont-elles personnalisables ?",
    answer:
      "Oui, finement. Vous fixez un seuil global (par exemple +8 %) et des seuils spécifiques par produit sensible (le beurre, l'huile, la viande). Vous choisissez la fenêtre d'observation (variation sur 7, 30 ou 90 jours) et le canal de notification (in-app, e-mail). Un produit stratégique peut déclencher une alerte dès +5 %, là où un produit secondaire ne vous dérangera qu'au-delà de +15 %.",
  },
  {
    question: "La mercuriale est-elle reliée aux fiches techniques ?",
    answer:
      "C'est le cœur du système. Chaque ingrédient de la mercuriale alimente les fiches techniques qui l'utilisent. Quand un prix monte, RestauMargin recalcule instantanément le food cost et la marge de chaque plat concerné, et vous indique exactement lesquels passent sous votre seuil de rentabilité. Vous ne découvrez plus la dérive en fin de mois sur le bilan, mais le jour même, plat par plat.",
  },
  {
    question: "Puis-je exporter l'historique des prix ?",
    answer:
      "Oui. Tout l'historique est exportable en Excel ou CSV : par produit, par fournisseur ou sur l'ensemble du catalogue, sur la période de votre choix. C'est l'argument décisif en rendez-vous d'achat : vous arrivez avec la preuve datée que tel tarif a augmenté de 22 % en six mois. Les données restent votre propriété et sont récupérables à tout moment.",
  },
];

export default function FonctionnaliteMercuriale() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif", color: TEXT }}>
      <SEOHead
        title="Mercuriale & alertes prix fournisseurs | RestauMargin"
        description="Suivi automatique des prix fournisseurs dans le temps. Alerte dès qu'un prix dérive. Détectez les hausses avant qu'elles grignotent vos marges. Historique tracé pour négocier."
        path="/fonctionnalites/mercuriale-alertes-prix"
        type="article"
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Mercuriale & alertes prix fournisseurs pour restaurant',
            description:
              "Suivi automatique des prix fournisseurs dans le temps, détection des dérives et alertes en temps réel pour protéger les marges d'un restaurant.",
            datePublished: '2026-05-28',
            dateModified: '2026-05-28',
            author: { '@type': 'Organization', name: 'RestauMargin' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/og-image.png' },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://www.restaumargin.fr/fonctionnalites/mercuriale-alertes-prix',
            },
            image: 'https://www.restaumargin.fr/og-image.png',
          },
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Fonctionnalités', url: 'https://www.restaumargin.fr/fonctionnalites' },
            {
              name: 'Mercuriale & alertes prix',
              url: 'https://www.restaumargin.fr/fonctionnalites/mercuriale-alertes-prix',
            },
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
          <Link
            to="/login?mode=register"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-white text-sm font-semibold rounded-full transition-opacity hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            Essai gratuit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* ── Breadcrumb ── */}
      <div className="border-b py-3 px-4" style={{ borderColor: BORDER, backgroundColor: '#FAFAFA' }}>
        <div className="max-w-6xl mx-auto text-xs flex items-center gap-2 flex-wrap" style={{ color: TEXT_MUTED }}>
          <Link to="/" className="hover:opacity-70" style={{ color: TEXT_MUTED }}>Accueil</Link>
          <span>/</span>
          <Link to="/fonctionnalites" className="hover:opacity-70" style={{ color: TEXT_MUTED }}>Fonctionnalités</Link>
          <span>/</span>
          <span className="font-medium" style={{ color: TEXT }}>Mercuriale &amp; alertes prix</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <header className="pt-16 pb-14 px-4" style={{ background: `linear-gradient(to bottom, ${ACCENT_BG}, #FFFFFF)` }}>
        <div className="max-w-5xl mx-auto text-center">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6"
            style={{ color: ACCENT_DARK, backgroundColor: '#D1FAE5' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Fonctionnalité 04
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6 max-w-4xl mx-auto" style={{ color: TEXT }}>
            Mercuriale &amp; alertes prix
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-8" style={{ color: TEXT_MUTED }}>
            Suivez automatiquement les prix de tous vos fournisseurs dans le temps. RestauMargin vous
            <strong style={{ color: TEXT }}> alerte dès qu'un tarif dérive</strong> et calcule l'impact exact sur vos
            marges, plat par plat. Fini les hausses qui passent inaperçues.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded-2xl transition-opacity hover:opacity-90 text-lg shadow-lg"
              style={{ backgroundColor: ACCENT, boxShadow: `0 10px 25px -5px ${ACCENT}55` }}
            >
              Essayer gratuitement
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-2xl border-2 transition-colors hover:bg-gray-50"
              style={{ borderColor: TEXT, color: TEXT }}
            >
              Voir la démo
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm" style={{ color: TEXT_MUTED }}>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4" style={{ color: ACCENT }} /> Import OCR des factures</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4" style={{ color: ACCENT }} /> Multi-fournisseurs</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4" style={{ color: ACCENT }} /> Historique 100 % tracé</span>
          </div>
        </div>
      </header>

      {/* ── Le problème ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4" style={{ color: '#B91C1C', backgroundColor: '#FEF2F2' }}>
              <AlertTriangle className="w-3.5 h-3.5" />
              Le problème
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: TEXT }}>
              Vos prix montent en douce. Et personne ne le voit.
            </h2>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: TEXT_MUTED }}>
              Le danger d'un food cost ne vient presque jamais d'une hausse spectaculaire. Il vient de dizaines de
              petites augmentations de 2 ou 3 % qui s'empilent, semaine après semaine, sans jamais déclencher d'alarme.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: 'La hausse silencieuse',
                desc: "Le beurre AOP est passé de 7,90 €/kg à 10,30 €/kg en six mois, soit +30 %. Aucune facture n'a sonné l'alerte : c'était +0,40 € par-ci, +0,30 € par-là. Au total, votre plat signature au beurre blanc a perdu 4 points de marge.",
              },
              {
                icon: <LineChart className="w-6 h-6" />,
                title: 'Le food cost qui dérive',
                desc: "Vous aviez calculé un food cost à 28 % à l'ouverture. Huit mois plus tard, sans avoir touché à une seule recette, vous êtes à 33 %. Les prix matières ont glissé sous le radar pendant que vous gériez le service.",
              },
              {
                icon: <DollarSign className="w-6 h-6" />,
                title: 'La marge grignotée',
                desc: "Sur 80 couverts par jour à 5 points de marge perdus, c'est plusieurs centaines d'euros qui s'évaporent chaque semaine. Vous le découvrez sur le bilan comptable, trois mois trop tard, quand il est impossible de remonter à la cause.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white border rounded-2xl p-6" style={{ borderColor: BORDER }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
                  {item.icon}
                </div>
                <h3 className="font-extrabold mb-2 text-lg tracking-tight" style={{ color: TEXT }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-6 flex gap-3 text-sm leading-relaxed" style={{ backgroundColor: ACCENT_BG, border: `1px solid #A7F3D0`, color: ACCENT_DARK }}>
            <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <strong>La cause profonde :</strong> sans suivi structuré, le prix d'achat n'existe que sur la dernière facture
              reçue. Vous n'avez aucune mémoire de ce que vous payiez il y a trois mois, donc aucun moyen de repérer une
              dérive. La mercuriale résout exactement ce trou noir.
            </div>
          </div>
        </div>
      </section>

      {/* ── Qu'est-ce qu'une mercuriale ── */}
      <section className="py-16 px-4" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4" style={{ color: ACCENT_DARK, backgroundColor: '#D1FAE5' }}>
                <BarChart3 className="w-3.5 h-3.5" />
                Définition
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-5" style={{ color: TEXT }}>
                Qu'est-ce qu'une mercuriale ?
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: TEXT_MUTED }}>
                Une <strong style={{ color: TEXT }}>mercuriale</strong>, c'est le catalogue daté des prix de vos
                fournisseurs : pour chaque ingrédient, le prix d'achat et la manière dont il évolue dans le temps. Le mot
                vient des marchés de gros, où l'on relevait chaque mercredi le cours officiel des denrées.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: TEXT_MUTED }}>
                En cuisine, ce n'est pas un simple tarif figé : c'est une <strong style={{ color: TEXT }}>courbe de prix
                vivante</strong>. La tomate grappe à 2,10 €/kg en juin grimpe à 4,80 €/kg en décembre. Le filet de bœuf
                varie selon les arrivages. Une mercuriale enregistre chacune de ces variations pour en faire une donnée
                exploitable, et non un souvenir flou.
              </p>
              <p className="text-base leading-relaxed" style={{ color: TEXT_MUTED }}>
                Sans elle, vos fiches techniques travaillent sur des prix périmés. Avec elle, chaque coût matière est
                toujours à jour, et chaque hausse devient visible à l'instant où elle se produit.
              </p>
            </div>

            <div className="bg-white border rounded-2xl p-7" style={{ borderColor: BORDER }}>
              <h3 className="font-extrabold text-lg tracking-tight mb-5" style={{ color: TEXT }}>
                Pourquoi c'est vital pour un restaurant
              </h3>
              <ul className="space-y-4">
                {[
                  { t: "La matière, c'est 30 à 35 % du chiffre", d: "C'est le premier poste de coût après la masse salariale. Un dérapage de quelques points y suffit à effacer tout le bénéfice." },
                  { t: 'Les prix bougent en permanence', d: "Saisonnalité, inflation, tensions d'approvisionnement : un tarif fournisseur n'est jamais stable plus de quelques semaines." },
                  { t: 'La mémoire humaine ne suffit pas', d: "Personne ne retient le prix de 200 références sur 6 mois. Seul un suivi automatisé le fait sans faille." },
                  { t: "C'est votre pouvoir de négociation", d: "Arriver chez un fournisseur avec l'historique chiffré de ses hausses change radicalement le rapport de force." },
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm" style={{ color: TEXT }}>{item.t}</div>
                      <div className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>{item.d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comment ça marche (4 étapes) ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: TEXT }}>
              Comment ça marche
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: TEXT_MUTED }}>
              De la saisie du prix à l'alerte de dérive, en quatre étapes entièrement automatisées.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                icon: <ScanLine className="w-6 h-6" />,
                title: 'Import des prix',
                desc: "Saisissez un prix à la main, importez un tarif fournisseur, ou — le plus simple — photographiez vos factures. L'OCR lit chaque ligne du bordereau Metro ou Transgourmet et rapproche automatiquement les produits de votre catalogue.",
              },
              {
                step: '02',
                icon: <History className="w-6 h-6" />,
                title: 'Historique automatique',
                desc: "Chaque prix est horodaté et rangé dans la courbe du produit, par fournisseur. Au fil des factures, RestauMargin reconstitue tout seul l'évolution de chaque ingrédient, sans la moindre ressaisie de votre part.",
              },
              {
                step: '03',
                icon: <TrendingUp className="w-6 h-6" />,
                title: 'Détection de dérive',
                desc: "Le moteur compare en continu le nouveau prix à la moyenne récente et à votre seuil. Il distingue une variation saisonnière normale d'une vraie hausse de fond. Une dérive de +10 % est repérée en moins de 24 h.",
              },
              {
                step: '04',
                icon: <Bell className="w-6 h-6" />,
                title: 'Alerte ciblée',
                desc: "Vous recevez une notification claire : « Le beurre AOP a pris +12 % sur 30 jours ». L'alerte liste aussitôt les plats touchés et leur nouvelle marge, pour décider tout de suite : renégocier, changer de fournisseur ou ajuster la carte.",
              },
            ].map((item, i) => (
              <div key={i} className="relative bg-white border rounded-2xl p-6 hover:shadow-md transition-shadow" style={{ borderColor: BORDER }}>
                <span className="text-4xl font-extrabold tracking-tight" style={{ color: '#D1FAE5' }}>{item.step}</span>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mt-2" style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}>
                  {item.icon}
                </div>
                <h3 className="font-extrabold mb-2 tracking-tight" style={{ color: TEXT }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm mt-8" style={{ color: TEXT_MUTED }}>
            Le scan de factures est encore plus rapide avec le module dédié.{' '}
            <Link to="/fonctionnalites/ocr-factures" className="font-semibold underline hover:opacity-70" style={{ color: ACCENT_DARK }}>
              Découvrir l'OCR de factures
            </Link>
          </p>
        </div>
      </section>

      {/* ── Alertes intelligentes ── */}
      <section className="py-16 px-4" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4" style={{ color: ACCENT_DARK, backgroundColor: '#D1FAE5' }}>
              <Bell className="w-3.5 h-3.5" />
              Alertes intelligentes
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: TEXT }}>
              Vous fixez les règles, le logiciel surveille
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: TEXT_MUTED }}>
              Une alerte n'a de valeur que si elle est juste. RestauMargin évite le bruit inutile et ne vous prévient que
              quand ça compte vraiment.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: <Target className="w-6 h-6" />,
                title: 'Seuils personnalisés',
                desc: "Définissez un seuil global (par exemple +8 %) et des seuils sur mesure par produit sensible. Le beurre peut alerter dès +5 %, le sel attendre +20 %. Vous pilotez la sensibilité produit par produit.",
              },
              {
                icon: <Percent className="w-6 h-6" />,
                title: 'Notification au dépassement',
                desc: "Dès qu'un prix franchit votre seuil sur la fenêtre choisie (7, 30 ou 90 jours), une notification part en in-app et par e-mail. Vous savez immédiatement quel produit, chez quel fournisseur, et de combien.",
              },
              {
                icon: <Receipt className="w-6 h-6" />,
                title: 'Impact calculé sur les fiches',
                desc: "Chaque alerte affiche les fiches techniques touchées avec leur nouveau food cost et leur nouvelle marge. Vous voyez en un coup d'œil quels plats basculent sous votre seuil de rentabilité.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white border rounded-2xl p-6" style={{ borderColor: BORDER }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}>
                  {item.icon}
                </div>
                <h3 className="font-extrabold mb-2 text-lg tracking-tight" style={{ color: TEXT }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Exemple d'alerte */}
          <div className="bg-white border rounded-2xl p-6 max-w-2xl mx-auto" style={{ borderColor: '#FCA5A5' }}>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-extrabold tracking-tight" style={{ color: TEXT }}>Dérive de prix détectée</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>+12 %</span>
                </div>
                <p className="text-sm leading-relaxed mb-3" style={{ color: TEXT_MUTED }}>
                  <strong style={{ color: TEXT }}>Beurre AOP Charentes-Poitou</strong> — Metro : 9,20 €/kg &rarr; 10,30 €/kg sur 30 jours.
                </p>
                <div className="text-xs rounded-lg p-3" style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}>
                  <strong>3 plats impactés :</strong> Saint-Jacques beurre blanc (marge 68 % &rarr; 64 %), Sole meunière (72 % &rarr; 69 %),
                  Brioche perdue (61 % &rarr; <span style={{ color: '#DC2626', fontWeight: 700 }}>57 % — sous le seuil</span>).
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bénéfices chiffrés ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: TEXT }}>
              Des bénéfices chiffrés
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: TEXT_MUTED }}>
              Ce que change concrètement une mercuriale automatisée sur l'exploitation d'un restaurant.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Clock className="w-7 h-7" />,
                stat: '< 24 h',
                title: 'Dérive détectée',
                desc: "Une hausse de +10 % sur un produit est repérée et notifiée en moins d'une journée, contre plusieurs semaines — voire un trimestre — quand on s'en remet au bilan comptable.",
              },
              {
                icon: <Percent className="w-7 h-7" />,
                stat: '-8 %',
                title: 'Coût matière',
                desc: "En renégociant à partir de l'historique et en arbitrant entre fournisseurs, les restaurants équipés réduisent en moyenne leur coût matière de 8 % sur les références suivies.",
              },
              {
                icon: <ShieldCheck className="w-7 h-7" />,
                stat: '100 %',
                title: 'Historique tracé',
                desc: "Chaque prix, chaque fournisseur, chaque date : tout est conservé et exportable. Aucune donnée d'achat ne se perd, ce qui transforme chaque facture passée en levier de négociation futur.",
              },
            ].map((item, i) => (
              <div key={i} className="border rounded-2xl p-7 text-center" style={{ borderColor: BORDER, backgroundColor: ACCENT_BG }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white" style={{ backgroundColor: ACCENT }}>
                  {item.icon}
                </div>
                <div className="text-4xl font-extrabold tracking-tight mb-1" style={{ color: ACCENT_DARK }}>{item.stat}</div>
                <div className="font-bold mb-2" style={{ color: TEXT }}>{item.title}</div>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cas d'usage ── */}
      <section className="py-16 px-4" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: TEXT }}>
              Cas d'usage concrets
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: TEXT_MUTED }}>
              Au-delà de l'alerte, la mercuriale devient un véritable outil de pilotage des achats.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white border rounded-2xl p-7" style={{ borderColor: BORDER }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}>
                <Handshake className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg tracking-tight mb-3" style={{ color: TEXT }}>
                Négocier avec des preuves d'historique
              </h3>
              <p className="text-sm leading-relaxed mb-3" style={{ color: TEXT_MUTED }}>
                Votre commercial annonce une « petite hausse de saison » sur la viande. Vous sortez la courbe : +22 %
                en six mois, alors que le marché de gros n'a bougé que de 6 %. Le rapport de force s'inverse instantanément.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                Avec des chiffres datés et exportables, vous ne négociez plus au ressenti. Vous arbitrez, vous obtenez
                un geste commercial, ou vous basculez vers un fournisseur concurrent en connaissance de cause.
              </p>
            </div>

            <div className="bg-white border rounded-2xl p-7" style={{ borderColor: BORDER }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}>
                <GitCompare className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg tracking-tight mb-3" style={{ color: TEXT }}>
                Comparer les fournisseurs
              </h3>
              <p className="text-sm leading-relaxed mb-3" style={{ color: TEXT_MUTED }}>
                Vos tomates grappe coûtent 3,40 €/kg chez Metro et 2,90 €/kg chez votre primeur régional. Mais le primeur
                vous impose 15 kg minimum. La vue comparative pondère par vos volumes réels et tranche : qui est vraiment
                le moins cher pour <em>votre</em> activité ?
              </p>
              <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                Vous identifiez aussi le fournisseur le plus <strong style={{ color: TEXT }}>stable</strong> : parfois,
                payer 5 centimes de plus pour un prix qui ne bouge jamais vaut mieux qu'un tarif d'appel qui flambe l'hiver.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: TEXT }}>
              Questions fréquentes
            </h2>
            <p className="text-lg" style={{ color: TEXT_MUTED }}>
              Tout ce qu'il faut savoir sur la mercuriale et les alertes prix de RestauMargin.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>

          <div className="rounded-2xl p-5 mt-8 flex gap-3 text-sm leading-relaxed" style={{ backgroundColor: ACCENT_BG, border: '1px solid #A7F3D0', color: ACCENT_DARK }}>
            <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <strong>La mercuriale ne travaille jamais seule.</strong> Elle se nourrit de l'{' '}
              <Link to="/fonctionnalites/ocr-factures" className="underline font-semibold hover:opacity-70" style={{ color: ACCENT_DARK }}>OCR de factures</Link>,
              alimente vos{' '}
              <Link to="/fonctionnalites/fiches-techniques" className="underline font-semibold hover:opacity-70" style={{ color: ACCENT_DARK }}>fiches techniques</Link>
              {' '}et fiabilise vos{' '}
              <Link to="/fonctionnalites/commandes-fournisseurs" className="underline font-semibold hover:opacity-70" style={{ color: ACCENT_DARK }}>commandes fournisseurs</Link>.
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="py-20 px-4" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})` }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <Truck className="w-12 h-12 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6">
            Reprenez le contrôle de vos prix d'achat
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-3" style={{ color: '#D1FAE5' }}>
            Suivez automatiquement chaque fournisseur, détectez les dérives en 24 h et négociez avec des preuves.
          </p>
          <p className="mb-10" style={{ color: '#ECFDF5' }}>
            Essai gratuit 7 jours — Sans carte bancaire — Sans engagement
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-10 py-5 font-extrabold rounded-2xl transition-transform hover:scale-[1.02] text-lg shadow-2xl bg-white"
              style={{ color: ACCENT_DARK }}
            >
              Démarrer l'essai gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-10 py-5 border-2 border-white/40 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors text-lg"
            >
              Voir la démo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Maillage interne ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-extrabold tracking-tight mb-8 text-center" style={{ color: TEXT }}>
            Fonctionnalités liées
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <Link to="/fonctionnalites/ocr-factures" className="border rounded-2xl p-6 hover:shadow-sm transition-all group" style={{ borderColor: BORDER }}>
              <ScanLine className="w-8 h-8 mb-3" style={{ color: ACCENT }} />
              <h3 className="font-extrabold tracking-tight mb-2 group-hover:opacity-70 transition-opacity" style={{ color: TEXT }}>OCR de factures</h3>
              <p className="text-sm" style={{ color: TEXT_MUTED }}>Photographiez vos bordereaux : les prix alimentent la mercuriale sans ressaisie.</p>
            </Link>
            <Link to="/fonctionnalites/commandes-fournisseurs" className="border rounded-2xl p-6 hover:shadow-sm transition-all group" style={{ borderColor: BORDER }}>
              <Package className="w-8 h-8 mb-3" style={{ color: ACCENT }} />
              <h3 className="font-extrabold tracking-tight mb-2 group-hover:opacity-70 transition-opacity" style={{ color: TEXT }}>Commandes fournisseurs</h3>
              <p className="text-sm" style={{ color: TEXT_MUTED }}>Commandez au meilleur prix grâce aux tarifs suivis dans la mercuriale.</p>
            </Link>
            <Link to="/fonctionnalites/fiches-techniques" className="border rounded-2xl p-6 hover:shadow-sm transition-all group" style={{ borderColor: BORDER }}>
              <Receipt className="w-8 h-8 mb-3" style={{ color: ACCENT }} />
              <h3 className="font-extrabold tracking-tight mb-2 group-hover:opacity-70 transition-opacity" style={{ color: TEXT }}>Fiches techniques</h3>
              <p className="text-sm" style={{ color: TEXT_MUTED }}>Chaque hausse de prix recalcule instantanément le food cost de vos plats.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-12 px-4" style={{ borderColor: BORDER, backgroundColor: '#FAFAFA' }}>
        <div className="max-w-6xl mx-auto text-center text-sm" style={{ color: TEXT_MUTED }}>
          <Link to="/landing" className="flex items-center justify-center gap-2 font-extrabold text-lg tracking-tight mb-4" style={{ color: TEXT }}>
            <ChefHat className="w-6 h-6" style={{ color: ACCENT }} />
            RestauMargin
          </Link>
          <p className="mb-4">Le suivi des prix fournisseurs qui protège vos marges, facture après facture.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link to="/mentions-legales" className="hover:opacity-70" style={{ color: TEXT_MUTED }}>Mentions légales</Link>
            <Link to="/cgv" className="hover:opacity-70" style={{ color: TEXT_MUTED }}>CGV</Link>
            <Link to="/cgu" className="hover:opacity-70" style={{ color: TEXT_MUTED }}>CGU</Link>
            <Link to="/politique-confidentialite" className="hover:opacity-70" style={{ color: TEXT_MUTED }}>Confidentialité</Link>
          </div>
          <p className="mt-6 text-xs" style={{ color: TEXT_MUTED }}>
            &copy; {new Date().getFullYear()} RestauMargin. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════ Sous-composants ═══════════════ */

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="bg-white border rounded-2xl group" style={{ borderColor: BORDER }}>
      <summary className="px-5 py-4 font-bold cursor-pointer select-none flex items-center justify-between gap-3 hover:opacity-80 transition-opacity" style={{ color: TEXT }}>
        {q}
        <ArrowRight className="w-4 h-4 shrink-0 group-open:rotate-90 transition-transform" style={{ color: ACCENT }} />
      </summary>
      <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>{a}</p>
    </details>
  );
}
