import { Link } from 'react-router-dom';
import {
  Thermometer,
  ClipboardCheck,
  ShieldCheck,
  FileText,
  Sparkles,
  Calendar,
  ChefHat,
  ArrowRight,
  Check,
  X,
  Snowflake,
  Flame,
  Refrigerator,
  Truck,
  CalendarClock,
  Bell,
  Users,
  Camera,
  Archive,
  FileCheck,
  ClipboardList,
  Droplets,
  AlertTriangle,
  Lightbulb,
  ListChecks,
  Smartphone,
  Download,
  Clock,
  Timer,
  PackageCheck,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';

/* ═══════════════════════════════════════════════════════════════
   Page fonctionnalité — HACCP digital (Fonctionnalité 06)
   Mots-clés : HACCP digital restaurant, logiciel HACCP,
   plan de maîtrise sanitaire numérique
   Design : landing vert, mobile-first, sans dark mode
   ═══════════════════════════════════════════════════════════════ */

const ACCENT = '#10B981';
const ACCENT_DARK = '#047857';
const ACCENT_BG = '#ECFDF5';
const TEXT = '#0F172A';
const TEXT_MUTED = '#64748B';
const BORDER = '#E5E7EB';

const faqItems = [
  {
    question: 'Le HACCP digital de RestauMargin est-il conforme à la réglementation française ?',
    answer:
      "Oui. Le module HACCP suit le Paquet Hygiène européen (règlements CE 852/2004 et 178/2002) et la réglementation française (arrêté du 21 décembre 2009). Il couvre les relevés de température, le plan de nettoyage et désinfection, la traçabilité des produits, le contrôle des huiles de friture et l'archivage des preuves. Les documents générés correspondent à ce que demande un inspecteur de la DDPP (Direction départementale de la protection des populations) lors d'un contrôle officiel.",
  },
  {
    question: 'Les rappels de relevés sont-ils automatiques ?',
    answer:
      "Oui. Vous définissez les fréquences (température des frigos 2 fois par jour, plan de nettoyage selon votre planning, contrôle des huiles, etc.) et RestauMargin envoie une notification sur la tablette ou le smartphone de l'équipe à l'heure prévue. Un relevé manqué reste signalé en rouge tant qu'il n'est pas saisi : c'est la fin des cases vides découvertes le jour de l'inspection.",
  },
  {
    question: "Puis-je exporter un PDF prêt pour l'inspection ?",
    answer:
      "Oui, en un clic. Vous sélectionnez une période (la semaine, le mois, ou la plage exacte demandée par l'inspecteur) et RestauMargin génère un PDF horodaté regroupant tous les relevés de température, les checklists de nettoyage signées, la traçabilité des réceptions et les photos de preuve. Le document est daté, nominatif et structuré comme un classeur HACCP papier — sauf qu'il est lisible et complet.",
  },
  {
    question: 'Plusieurs membres de l’équipe peuvent-ils saisir les relevés ?',
    answer:
      "Oui. Chaque membre de l'équipe a son propre accès et chaque relevé est signé par la personne qui l'effectue (nom + horodatage). Le chef ou le responsable hygiène voit en temps réel qui a fait quoi, ce qui reste à faire et les éventuels relevés hors norme. Le travail se répartit naturellement entre le plongeur, le commis et le chef sans qu'aucune saisie ne soit perdue.",
  },
  {
    question: 'Peut-on joindre des photos comme preuve ?',
    answer:
      "Oui. Pour un relevé de température, une réception de marchandise ou une opération de nettoyage, l'équipe peut prendre une photo directement depuis la tablette (afficheur du thermomètre, étiquette DLC, bon de livraison, surface nettoyée). La photo est horodatée et attachée au relevé. En cas de litige ou de contrôle, la preuve visuelle vaut bien mieux qu'un chiffre écrit à la main.",
  },
  {
    question: 'Combien de temps l’historique est-il conservé ?',
    answer:
      "L'historique est conservé en ligne sans limite de durée tant que votre abonnement est actif, et reste exportable à tout moment. La réglementation impose de garder les enregistrements HACCP au minimum la durée de vie du produit augmentée de quelques mois (en pratique, conservez vos relevés au moins 12 mois). Avec RestauMargin, vous n'avez plus à stocker des classeurs poussiéreux : tout est archivé numériquement et retrouvable en quelques secondes.",
  },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'HACCP digital : le plan de maîtrise sanitaire numérique pour restaurant',
  datePublished: '2026-05-28',
  dateModified: '2026-05-28',
  author: {
    '@type': 'Organization',
    name: 'La rédaction RestauMargin',
    url: 'https://www.restaumargin.fr/a-propos',
  },
  publisher: {
    '@type': 'Organization',
    name: 'RestauMargin',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.restaumargin.fr/icon-512.png',
    },
  },
  image: 'https://www.restaumargin.fr/og-image.png',
  description:
    "Le HACCP digital de RestauMargin : relevés de température, checklist de nettoyage et traçabilité en 1 tap, avec génération d'un PDF prêt pour l'inspection DDPP.",
  inLanguage: 'fr-FR',
  mainEntityOfPage: 'https://www.restaumargin.fr/fonctionnalites/haccp-digital',
};

export default function FonctionnaliteHACCP() {
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Inter', system-ui, sans-serif", color: TEXT }}
    >
      <SEOHead
        title="HACCP digital restaurant | Plan de maîtrise sanitaire numérique | RestauMargin"
        description="HACCP digital : relevés température, nettoyage et traçabilité en 1 tap. Génération PDF prêt pour l'inspection DDPP. Fini le classeur papier et les relevés oubliés."
        path="/fonctionnalites/haccp-digital"
        type="article"
        schema={[
          articleSchema,
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Fonctionnalités', url: 'https://www.restaumargin.fr/fonctionnalites' },
            {
              name: 'HACCP digital',
              url: 'https://www.restaumargin.fr/fonctionnalites/haccp-digital',
            },
          ]),
        ]}
      />

      {/* ── Navbar ── */}
      <nav
        className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b"
        style={{ borderColor: BORDER }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            to="/landing"
            className="flex items-center gap-2 font-extrabold tracking-tight text-lg"
            style={{ color: TEXT }}
          >
            <ChefHat className="w-7 h-7" style={{ color: ACCENT }} />
            <span>RestauMargin</span>
          </Link>
          <Link
            to="/login?mode=register"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-white text-sm font-semibold rounded-2xl transition-colors"
            style={{ backgroundColor: ACCENT }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = ACCENT_DARK)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = ACCENT)}
          >
            Essai gratuit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* ── Breadcrumb ── */}
      <div className="border-b bg-white" style={{ borderColor: BORDER }}>
        <div
          className="max-w-6xl mx-auto px-4 sm:px-6 py-3 text-xs flex items-center gap-2 flex-wrap"
          style={{ color: TEXT_MUTED }}
        >
          <Link to="/" className="hover:underline" style={{ color: TEXT_MUTED }}>
            Accueil
          </Link>
          <span>/</span>
          <Link to="/landing" className="hover:underline" style={{ color: TEXT_MUTED }}>
            Fonctionnalités
          </Link>
          <span>/</span>
          <span className="font-semibold" style={{ color: TEXT }}>
            HACCP digital
          </span>
        </div>
      </div>

      {/* ── Hero ── */}
      <header
        className="px-4 sm:px-6 pt-16 pb-14"
        style={{ background: `linear-gradient(to bottom, ${ACCENT_BG}, #FFFFFF)` }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6"
            style={{ color: ACCENT_DARK, backgroundColor: '#D1FAE5' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Fonctionnalité 06
          </span>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6"
            style={{ color: TEXT }}
          >
            HACCP digital,
            <br className="hidden sm:block" /> fini le classeur
          </h1>
          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-9"
            style={{ color: TEXT_MUTED }}
          >
            Relevés de température, plan de nettoyage et traçabilité en <strong>1 tap</strong> sur
            tablette. RestauMargin génère votre{' '}
            <strong style={{ color: TEXT }}>PDF prêt pour l'inspection</strong> en un clic. Plus de
            cases vides, plus de panique le jour du contrôle DDPP.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded-2xl transition-colors text-lg shadow-lg"
              style={{ backgroundColor: ACCENT, boxShadow: `0 10px 25px -5px ${ACCENT}66` }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = ACCENT_DARK)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = ACCENT)}
            >
              Essai gratuit 7 jours
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/blog/haccp-restaurant"
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-2xl transition-colors text-lg border-2 bg-white"
              style={{ borderColor: BORDER, color: TEXT }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = ACCENT)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}
            >
              Comprendre le HACCP
            </Link>
          </div>

          <div
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm mt-9"
            style={{ color: TEXT_MUTED }}
          >
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" style={{ color: ACCENT }} /> Conforme Paquet Hygiène
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" style={{ color: ACCENT }} /> PDF inspection en 1 clic
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" style={{ color: ACCENT }} /> Rappels automatiques
            </span>
          </div>
        </div>
      </header>

      {/* ── Le problème ── */}
      <section className="px-4 sm:px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-center"
            style={{ color: TEXT }}
          >
            Le classeur HACCP papier vous coûte cher
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto text-center mb-12 leading-relaxed"
            style={{ color: TEXT_MUTED }}
          >
            Vous le connaissez : ce gros classeur posé sur le frigo, avec des feuilles de relevés
            cornées, des stylos qui ne marchent plus et des cases laissées vides « parce qu'on était
            dans le rush ». Le jour où l'inspecteur arrive, c'est la course.
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: <Archive className="w-6 h-6" />,
                title: 'Le classeur qui prend la poussière',
                desc: "Personne ne remplit les feuilles en temps réel. On recopie tout d'un coup en fin de semaine, de mémoire, avec des températures inventées. Aucune valeur de preuve.",
              },
              {
                icon: <X className="w-6 h-6" />,
                title: 'Les relevés oubliés',
                desc: "Un service chargé, et le relevé de 14h du frigo à desserts saute. Multiplié par tous les points de contrôle, ce sont des dizaines de trous dans votre traçabilité chaque mois.",
              },
              {
                icon: <AlertTriangle className="w-6 h-6" />,
                title: "La panique à l'inspection DDPP",
                desc: "Le contrôleur demande les relevés des 3 derniers mois. Vous fouillez dans une pile de feuilles volantes, certaines manquent, d'autres sont illisibles. Mauvaise impression assurée.",
              },
              {
                icon: <FileText className="w-6 h-6" />,
                title: 'Une traçabilité illisible',
                desc: "Étiquettes décollées, écritures rapides au feutre, dates de réception introuvables. Impossible de remonter une chaîne du froid en cas de toxi-infection alimentaire collective (TIAC).",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border bg-white"
                style={{ borderColor: BORDER }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
                >
                  {item.icon}
                </div>
                <h3 className="font-extrabold tracking-tight text-lg mb-2" style={{ color: TEXT }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Qu'est-ce que le HACCP ? ── */}
      <section className="px-4 sm:px-6 py-16" style={{ backgroundColor: ACCENT_BG }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4"
              style={{ color: ACCENT_DARK, backgroundColor: '#D1FAE5' }}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Rappel réglementaire
            </span>
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
              style={{ color: TEXT }}
            >
              Au fait, c'est quoi le HACCP ?
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_MUTED }}>
              HACCP signifie <em>Hazard Analysis Critical Control Points</em> — analyse des dangers
              et maîtrise des points critiques. C'est la méthode d'hygiène{' '}
              <strong style={{ color: TEXT }}>obligatoire</strong> pour tout établissement qui
              manipule des denrées alimentaires en France.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mb-8">
            <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: BORDER }}>
              <ListChecks className="w-8 h-8 mb-3" style={{ color: ACCENT }} />
              <h3 className="font-extrabold tracking-tight mb-2" style={{ color: TEXT }}>
                7 principes
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                Analyser les dangers, identifier les points critiques (CCP), fixer des seuils, les
                surveiller, corriger, vérifier et tout documenter.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: BORDER }}>
              <ShieldCheck className="w-8 h-8 mb-3" style={{ color: ACCENT }} />
              <h3 className="font-extrabold tracking-tight mb-2" style={{ color: TEXT }}>
                Obligation légale
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                Imposée par le Paquet Hygiène européen (CE 852/2004). Tout restaurant, food truck ou
                traiteur doit pouvoir prouver sa maîtrise sanitaire.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: BORDER }}>
              <FileCheck className="w-8 h-8 mb-3" style={{ color: ACCENT }} />
              <h3 className="font-extrabold tracking-tight mb-2" style={{ color: TEXT }}>
                Plan de maîtrise sanitaire
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                Le PMS regroupe vos bonnes pratiques d'hygiène, votre plan HACCP et la traçabilité.
                C'est le document que vérifie la DDPP en priorité.
              </p>
            </div>
          </div>

          <div
            className="rounded-2xl p-5 flex gap-3 text-sm leading-relaxed bg-white border"
            style={{ borderColor: BORDER, color: TEXT_MUTED }}
          >
            <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" style={{ color: ACCENT }} />
            <div>
              <strong style={{ color: TEXT }}>En clair :</strong> le HACCP n'impose pas un format de
              papier. Il impose de <strong style={{ color: TEXT }}>prouver</strong> que vous
              surveillez vos points critiques (températures, hygiène, traçabilité) et que vous
              réagissez en cas d'écart. Un système numérique horodaté est aussi valable — et bien
              plus solide — qu'un classeur papier. Pour aller plus loin, lisez notre{' '}
              <Link
                to="/blog/haccp-restaurant"
                className="font-semibold underline"
                style={{ color: ACCENT_DARK }}
              >
                guide complet du HACCP en restaurant
              </Link>
              .
            </div>
          </div>
        </div>
      </section>

      {/* ── Comment ça marche (4 étapes) ── */}
      <section className="px-4 sm:px-6 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
              style={{ color: TEXT }}
            >
              Comment ça marche
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_MUTED }}>
              Quatre gestes simples, intégrés dans le quotidien de la cuisine, sans formation
              compliquée.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                num: '01',
                icon: <Thermometer className="w-6 h-6" />,
                title: 'Relevé température en 1 tap',
                desc: "Vous ouvrez la tablette, vous tapez la valeur lue sur le thermomètre, c'est signé et horodaté. Une alerte rouge s'affiche immédiatement si la température sort de la zone autorisée.",
              },
              {
                num: '02',
                icon: <ClipboardCheck className="w-6 h-6" />,
                title: 'Checklist de nettoyage',
                desc: "Le plan de nettoyage du jour s'affiche sous forme de cases à cocher. Plan de travail, hotte, chambre froide, sols : chaque opération est validée par la personne qui la réalise.",
              },
              {
                num: '03',
                icon: <PackageCheck className="w-6 h-6" />,
                title: 'Traçabilité produits',
                desc: "À la réception d'une livraison, vous scannez ou photographiez le bon, notez la température du camion et la DLC. La chaîne du froid est documentée du fournisseur à l'assiette.",
              },
              {
                num: '04',
                icon: <Download className="w-6 h-6" />,
                title: 'PDF inspection-ready',
                desc: "Le jour du contrôle, vous sélectionnez la période et générez un PDF complet, horodaté et nominatif. Vous le tendez à l'inspecteur DDPP en 30 secondes.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border bg-white relative"
                style={{ borderColor: BORDER }}
              >
                <span
                  className="text-5xl font-extrabold tracking-tight block mb-3 leading-none"
                  style={{ color: '#D1FAE5' }}
                >
                  {step.num}
                </span>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}
                >
                  {step.icon}
                </div>
                <h3 className="font-extrabold tracking-tight text-lg mb-2" style={{ color: TEXT }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ce qui est tracé ── */}
      <section className="px-4 sm:px-6 py-16" style={{ backgroundColor: ACCENT_BG }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
              style={{ color: TEXT }}
            >
              Tout ce qui est tracé
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_MUTED }}>
              Chaque point critique de votre plan de maîtrise sanitaire, suivi au bon rythme et
              consigné automatiquement.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <Refrigerator className="w-6 h-6" />,
                title: 'Frigos positifs',
                desc: 'Chambres froides et armoires entre 0 et +4 °C. Relevé bi-quotidien, alerte si dépassement.',
              },
              {
                icon: <Snowflake className="w-6 h-6" />,
                title: 'Congélateurs',
                desc: 'Surgélateurs à -18 °C et en dessous. Détection immédiate des ruptures de chaîne du froid.',
              },
              {
                icon: <Flame className="w-6 h-6" />,
                title: 'Maintien au chaud',
                desc: 'Bains-marie et armoires chaudes à +63 °C minimum. Contrôle avant et pendant le service.',
              },
              {
                icon: <ClipboardList className="w-6 h-6" />,
                title: 'Plan de nettoyage',
                desc: 'Surfaces, matériel, sols, sanitaires. Fréquence, produit utilisé et signataire pour chaque zone.',
              },
              {
                icon: <Truck className="w-6 h-6" />,
                title: 'Réception marchandises',
                desc: 'Température du camion, état du colis, conformité de la livraison à chaque réception.',
              },
              {
                icon: <CalendarClock className="w-6 h-6" />,
                title: 'DLC et DLUO',
                desc: 'Suivi des dates limites de consommation, alertes anticipées avant péremption.',
              },
              {
                icon: <Droplets className="w-6 h-6" />,
                title: 'Huiles de friture',
                desc: 'Contrôle des composés polaires, date de changement du bain, suivi de la fréquence.',
              },
              {
                icon: <PackageCheck className="w-6 h-6" />,
                title: 'Refroidissement rapide',
                desc: 'Passage de +63 °C à +10 °C en moins de 2 heures, courbe documentée pour les plats préparés.',
              },
              {
                icon: <Camera className="w-6 h-6" />,
                title: 'Photos de preuve',
                desc: 'Afficheur thermomètre, étiquette, bon de livraison : une image horodatée vaut mieux qu’un chiffre.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border flex gap-4"
                style={{ borderColor: BORDER }}
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}
                >
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-extrabold tracking-tight mb-1" style={{ color: TEXT }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bénéfices chiffrés ── */}
      <section className="px-4 sm:px-6 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
              style={{ color: TEXT }}
            >
              Ce que vous y gagnez
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_MUTED }}>
              Moins de temps perdu, zéro relevé manquant et une conformité prouvable à chaque
              instant.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <Timer className="w-6 h-6" />,
                stat: '~10 s',
                label: 'par relevé',
                desc: 'Un tap sur la tablette contre 5 minutes pour retrouver la feuille, le stylo et recopier à la main.',
              },
              {
                icon: <Bell className="w-6 h-6" />,
                stat: '0',
                label: 'relevé oublié',
                desc: 'Les rappels automatiques et les indicateurs rouges garantissent qu’aucun point de contrôle ne saute.',
              },
              {
                icon: <Download className="w-6 h-6" />,
                stat: '1 clic',
                label: 'PDF inspection',
                desc: 'Génération instantanée d’un dossier complet et horodaté, prêt à présenter à la DDPP.',
              },
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                stat: '100 %',
                label: 'conformité',
                desc: 'Tous les enregistrements requis par le Paquet Hygiène, archivés et toujours accessibles.',
              },
            ].map((b, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border text-center"
                style={{ borderColor: BORDER, backgroundColor: ACCENT_BG }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 mx-auto bg-white"
                  style={{ color: ACCENT_DARK }}
                >
                  {b.icon}
                </div>
                <div
                  className="text-4xl font-extrabold tracking-tight leading-none mb-1"
                  style={{ color: ACCENT_DARK }}
                >
                  {b.stat}
                </div>
                <div className="text-sm font-semibold mb-3" style={{ color: TEXT }}>
                  {b.label}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>

          <div
            className="rounded-2xl p-5 mt-8 flex gap-3 text-sm leading-relaxed border"
            style={{ borderColor: BORDER, backgroundColor: '#FFFFFF', color: TEXT_MUTED }}
          >
            <Clock className="w-5 h-5 shrink-0 mt-0.5" style={{ color: ACCENT }} />
            <div>
              <strong style={{ color: TEXT }}>Fait le calcul :</strong> un restaurant avec 8 points
              de contrôle relevés 2 fois par jour, c'est 16 relevés quotidiens. En papier, à 5
              minutes chacun avec la recopie, c'est plus de 1 heure par jour perdue. En digital,
              quelques minutes suffisent — et tout est exploitable.
            </div>
          </div>
        </div>
      </section>

      {/* ── Cas d'usage ── */}
      <section className="px-4 sm:px-6 py-16" style={{ backgroundColor: ACCENT_BG }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
              style={{ color: TEXT }}
            >
              Sur le terrain
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_MUTED }}>
              Deux moments où le HACCP digital change vraiment la donne.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-7 border" style={{ borderColor: BORDER }}>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}
              >
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold tracking-tight text-xl mb-3" style={{ color: TEXT }}>
                La routine quotidienne de l'équipe
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: TEXT_MUTED }}>
                7h30, le commis arrive : la tablette affiche les relevés du matin à faire. Il fait le
                tour des frigos, tape les températures, prend une photo de la chambre froide nettoyée
                la veille. À midi, une notification rappelle le contrôle des bains-marie. Le chef voit
                d'un coup d'œil que tout est vert. Chaque geste est signé, daté, sans paperasse.
              </p>
              <ul className="space-y-2 text-sm" style={{ color: TEXT }}>
                {[
                  'Tâches du jour affichées automatiquement',
                  'Répartition naturelle entre les membres',
                  'Aucune saisie perdue ni recopiée de mémoire',
                ].map((li, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: ACCENT }} />
                    {li}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-7 border" style={{ borderColor: BORDER }}>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}
              >
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold tracking-tight text-xl mb-3" style={{ color: TEXT }}>
                Le contrôle DDPP surprise
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: TEXT_MUTED }}>
                Un inspecteur se présente sans prévenir et demande la traçabilité des 3 derniers mois.
                Là où d'autres fouillent dans des classeurs incomplets, vous ouvrez RestauMargin,
                sélectionnez la période et générez un PDF complet : relevés de température, plans de
                nettoyage signés, réceptions tracées, photos à l'appui. L'inspecteur repart rassuré.
              </p>
              <ul className="space-y-2 text-sm" style={{ color: TEXT }}>
                {[
                  'Dossier complet généré en 30 secondes',
                  'Historique horodaté et infalsifiable',
                  'Meilleure note d’hygiène, meilleure réputation',
                ].map((li, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: ACCENT }} />
                    {li}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 sm:px-6 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
              style={{ color: TEXT }}
            >
              Questions fréquentes
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: TEXT_MUTED }}>
              Tout ce que les restaurateurs nous demandent avant de digitaliser leur HACCP.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <details
                key={i}
                className="rounded-2xl border bg-white group"
                style={{ borderColor: BORDER }}
              >
                <summary
                  className="px-5 py-4 font-semibold cursor-pointer select-none flex items-center justify-between gap-4"
                  style={{ color: TEXT }}
                >
                  {item.question}
                  <ArrowRight
                    className="w-4 h-4 shrink-0 group-open:rotate-90 transition-transform"
                    style={{ color: ACCENT }}
                  />
                </summary>
                <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                  {item.answer}
                </p>
              </details>
            ))}
          </div>

          {/* Maillage interne */}
          <div className="grid sm:grid-cols-3 gap-4 mt-12">
            <Link
              to="/blog/haccp-restaurant"
              className="rounded-2xl p-5 border bg-white transition-colors group"
              style={{ borderColor: BORDER }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = ACCENT)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}
            >
              <ShieldCheck className="w-7 h-7 mb-3" style={{ color: ACCENT }} />
              <h3 className="font-extrabold tracking-tight mb-1 text-sm" style={{ color: TEXT }}>
                Guide HACCP restaurant
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: TEXT_MUTED }}>
                Les 7 principes, températures de référence et checklist complète.
              </p>
            </Link>
            <Link
              to="/blog/calendrier-haccp-restaurant-modele-gratuit"
              className="rounded-2xl p-5 border bg-white transition-colors group"
              style={{ borderColor: BORDER }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = ACCENT)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}
            >
              <Calendar className="w-7 h-7 mb-3" style={{ color: ACCENT }} />
              <h3 className="font-extrabold tracking-tight mb-1 text-sm" style={{ color: TEXT }}>
                Calendrier HACCP gratuit
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: TEXT_MUTED }}>
                Modèle de planning de relevés et de nettoyage à télécharger.
              </p>
            </Link>
            <Link
              to="/blog/allergenes-restaurant-obligations-legales"
              className="rounded-2xl p-5 border bg-white transition-colors group"
              style={{ borderColor: BORDER }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = ACCENT)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}
            >
              <ClipboardList className="w-7 h-7 mb-3" style={{ color: ACCENT }} />
              <h3 className="font-extrabold tracking-tight mb-1 text-sm" style={{ color: TEXT }}>
                Allergènes : obligations
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: TEXT_MUTED }}>
                Ce que la loi impose d'afficher et de tracer sur les 14 allergènes.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section
        className="px-4 sm:px-6 py-20"
        style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})` }}
      >
        <div className="max-w-3xl mx-auto text-center text-white">
          <Smartphone className="w-12 h-12 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Rangez le classeur, sortez la tablette
          </h2>
          <p className="text-lg sm:text-xl mb-3 leading-relaxed" style={{ color: '#ECFDF5' }}>
            Relevés en 1 tap, rappels automatiques, PDF d'inspection en un clic. Mettez votre HACCP
            au niveau de votre cuisine.
          </p>
          <p className="mb-10 text-sm" style={{ color: '#D1FAE5' }}>
            Essai gratuit 7 jours — Sans carte bancaire — Sans engagement
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white font-extrabold tracking-tight rounded-2xl transition-transform hover:scale-[1.02] text-lg shadow-2xl"
              style={{ color: ACCENT_DARK }}
            >
              Démarrer gratuitement
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/blog/haccp-restaurant"
              className="inline-flex items-center gap-2 px-10 py-5 border-2 border-white/40 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors text-lg"
            >
              Lire le guide HACCP
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-12 px-4 sm:px-6 bg-white" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto text-center text-sm" style={{ color: TEXT_MUTED }}>
          <Link
            to="/landing"
            className="flex items-center justify-center gap-2 font-extrabold tracking-tight text-lg mb-4"
            style={{ color: TEXT }}
          >
            <ChefHat className="w-6 h-6" style={{ color: ACCENT }} />
            RestauMargin
          </Link>
          <p className="mb-6 max-w-md mx-auto">
            Le logiciel de gestion qui aide les restaurateurs français à maîtriser leurs marges et
            leur hygiène, sans paperasse.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
            <Link to="/fonctionnalites/haccp-digital" className="hover:underline" style={{ color: TEXT_MUTED }}>
              HACCP digital
            </Link>
            <Link to="/blog/haccp-restaurant" className="hover:underline" style={{ color: TEXT_MUTED }}>
              Guide HACCP
            </Link>
            <Link to="/mentions-legales" className="hover:underline" style={{ color: TEXT_MUTED }}>
              Mentions légales
            </Link>
            <Link to="/cgv" className="hover:underline" style={{ color: TEXT_MUTED }}>
              CGV
            </Link>
            <Link
              to="/politique-confidentialite"
              className="hover:underline"
              style={{ color: TEXT_MUTED }}
            >
              Confidentialité
            </Link>
          </div>
          <p className="mt-6 text-xs" style={{ color: TEXT_MUTED }}>
            &copy; {new Date().getFullYear()} RestauMargin. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
