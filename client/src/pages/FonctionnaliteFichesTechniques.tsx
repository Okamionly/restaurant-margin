import { Link } from 'react-router-dom';
import {
  ClipboardList,
  FileText,
  Calculator,
  Percent,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Check,
  Sparkles,
  ScanLine,
  Mic,
  RefreshCw,
  ShieldCheck,
  Utensils,
  Wallet,
  Layers,
  TrendingUp,
  Clock,
  Quote,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';

/* ═══════════════════════════════════════════════════════════════
   Page fonctionnalité 03 — Fiches techniques en 10 secondes
   Mots-clés : "fiche technique restaurant", "logiciel fiche technique cuisine"
   Palette : Vert RestauMargin (emerald) — pas de dark mode.
   ═══════════════════════════════════════════════════════════════ */

const ACCENT = '#10B981';
const ACCENT_DARK = '#047857';
const ACCENT_BG = '#ECFDF5';
const TEXT = '#0F172A';
const TEXT_MUTED = '#64748B';
const BORDER = '#E5E7EB';

const PAGE_URL = 'https://www.restaumargin.fr/fonctionnalites/fiches-techniques';

/* ── Données FAQ (réutilisées pour le schema + l'affichage) ── */
const faqItems = [
  {
    question: 'Peut-on exporter une fiche technique en PDF ?',
    answer:
      "Oui. Chaque fiche technique s'exporte en PDF d'un clic, dans un format propre prêt à imprimer ou à archiver. Le PDF reprend les ingrédients, les grammages, les étapes de préparation, le food cost, la marge, le coefficient, le prix de vente conseillé et la liste des 14 allergènes INCO. Vous pouvez générer une fiche unique, un classeur complet de toutes vos recettes, ou un export filtré par catégorie (entrées, plats, desserts).",
  },
  {
    question: "Les fiches sont-elles conformes pour une inspection (DDPP / hygiène) ?",
    answer:
      "Le format est pensé pour être présenté lors d'un contrôle des services vétérinaires ou de la répression des fraudes. Chaque fiche affiche clairement la composition, les allergènes obligatoires (règlement INCO 1169/2011) et la traçabilité des ingrédients. Couplé au module HACCP de RestauMargin (plan de maîtrise sanitaire, relevés de températures), vous présentez un dossier complet et à jour, sans ressortir un classeur papier périmé.",
  },
  {
    question: 'Les allergènes sont-ils détectés automatiquement ?',
    answer:
      "Oui. Dès que vous ajoutez un ingrédient à une fiche, RestauMargin reconnaît s'il fait partie des 14 allergènes à déclaration obligatoire (gluten, crustacés, œufs, poisson, arachides, soja, lait, fruits à coque, céleri, moutarde, sésame, sulfites, lupin, mollusques). La liste se construit toute seule au fil de la saisie. Si vous ajoutez de la farine de blé, le gluten apparaît immédiatement ; si vous retirez l'ingrédient, l'allergène disparaît de la fiche.",
  },
  {
    question: 'Que se passe-t-il quand un prix fournisseur change ?',
    answer:
      "Toutes les fiches qui utilisent cet ingrédient se recalculent automatiquement. Si le beurre passe de 7,50 € à 8,90 € le kilo, chaque recette contenant du beurre voit son food cost, sa marge et son coefficient mis à jour en temps réel. Vous n'avez rien à ressaisir. Le changement de prix peut venir de votre mercuriale éditée à la main, d'un scan de facture par OCR, ou d'une alerte de hausse fournisseur.",
  },
  {
    question: 'Peut-on gérer des sous-recettes (préparations de base) ?',
    answer:
      "Oui. Une sauce, un fond, une pâte ou une garniture peut être créée comme une fiche à part entière, puis intégrée comme ingrédient dans d'autres recettes. Son coût se propage automatiquement. Si le prix d'un composant de votre fond de veau augmente, le coût du fond de veau monte, et toutes les fiches qui l'utilisent (bœuf bourguignon, sauces dérivées) se recalculent en cascade. C'est indispensable pour une cuisine sérieuse qui travaille avec des bases maison.",
  },
  {
    question: 'Peut-on importer mes fiches techniques Excel existantes ?',
    answer:
      "Oui. RestauMargin importe vos fiches au format Excel ou CSV. L'assistant d'import mappe vos colonnes (ingrédient, quantité, unité, prix) vers la structure RestauMargin. Une fois importées, vos fiches deviennent vivantes : elles se recalculent à chaque variation de prix, contrairement à un fichier figé. L'équipe support vous accompagne sur la migration pendant l'essai gratuit ; un lot de 50 à 100 fiches prend généralement moins de deux heures.",
  },
];

/* ── 4 étapes du HowTo (réutilisées pour le schema + l'affichage) ── */
const howToSteps = [
  {
    icon: Mic,
    name: 'Saisissez ou dictez les ingrédients',
    text: "Tapez vos ingrédients avec leurs quantités, ou dictez-les à la voix. L'autocomplétion intelligente reconnaît « 800 g de bœuf à braiser », « 200 g de lardons », « 50 cl de vin rouge » et les associe à vos prix fournisseurs.",
  },
  {
    icon: Calculator,
    name: 'Le food cost, la marge et le coefficient se calculent',
    text: 'Dès que les ingrédients sont saisis, RestauMargin calcule instantanément le coût matière de la recette, le food cost en pourcentage, la marge brute en euros et le coefficient multiplicateur. Aucun tableur, aucune formule à écrire.',
  },
  {
    icon: ShieldCheck,
    name: 'Les allergènes sont détectés',
    text: "La liste des 14 allergènes à déclaration obligatoire se construit toute seule à partir des ingrédients. Le gluten du vin de cuisson, le céleri du bouquet garni, le lait du beurre : rien n'est oublié.",
  },
  {
    icon: FileText,
    name: 'Exportez en PDF prêt pour l\'inspection',
    text: "En un clic, générez une fiche technique PDF propre : composition, grammages, étapes, food cost, marge, allergènes. Imprimable, archivable, présentable lors d'un contrôle d'hygiène.",
  },
];

export default function FonctionnaliteFichesTechniques() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif", color: TEXT }}>
      <SEOHead
        title="Fiches techniques restaurant en 10s | Food cost auto | RestauMargin"
        description="Créez vos fiches techniques en 10 secondes : food cost, marge, coefficient et allergènes calculés en temps réel. Mise à jour auto quand les prix changent. Prêt pour l'inspection."
        path="/fonctionnalites/fiches-techniques"
        type="article"
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Fiches techniques en 10 secondes : food cost, marge et allergènes en temps réel',
            description:
              "Comment créer des fiches techniques de restaurant en 10 secondes avec calcul automatique du food cost, de la marge, du coefficient et détection des allergènes INCO en temps réel.",
            datePublished: '2026-05-28',
            dateModified: '2026-05-28',
            inLanguage: 'fr-FR',
            author: { '@type': 'Organization', name: 'RestauMargin' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/og-image.png' },
            },
            mainEntityOfPage: { '@type': 'WebPage', '@id': PAGE_URL },
            image: 'https://www.restaumargin.fr/og-image.png',
          },
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Fonctionnalités', url: 'https://www.restaumargin.fr/fonctionnalites' },
            { name: 'Fiches techniques', url: PAGE_URL },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Créer une fiche technique de restaurant en 4 étapes',
            description:
              "Méthode pour créer une fiche technique avec food cost, marge, coefficient et allergènes calculés automatiquement dans RestauMargin.",
            totalTime: 'PT10S',
            inLanguage: 'fr-FR',
            step: howToSteps.map((s, i) => ({
              '@type': 'HowToStep',
              position: i + 1,
              name: s.name,
              text: s.text,
              url: `${PAGE_URL}#etape-${i + 1}`,
            })),
          },
        ]}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 font-extrabold tracking-tight text-lg" style={{ color: TEXT }}>
            <ClipboardList className="w-7 h-7" style={{ color: ACCENT }} />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/blog/calcul-marge-restaurant"
              className="hidden sm:inline-flex text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: TEXT_MUTED }}
            >
              Guides
            </Link>
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-white text-sm font-semibold rounded-2xl transition-colors"
              style={{ backgroundColor: ACCENT }}
            >
              Essai gratuit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Breadcrumb ── */}
      <div className="border-b py-3 px-4" style={{ backgroundColor: '#FAFAFA', borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto text-xs flex items-center gap-2 flex-wrap" style={{ color: TEXT_MUTED }}>
          <Link to="/" className="hover:underline" style={{ color: TEXT_MUTED }}>
            Accueil
          </Link>
          <span>/</span>
          <Link to="/logiciel-marge-restaurant" className="hover:underline" style={{ color: TEXT_MUTED }}>
            Fonctionnalités
          </Link>
          <span>/</span>
          <span className="font-semibold" style={{ color: TEXT }}>
            Fiches techniques
          </span>
        </div>
      </div>

      {/* ── Hero ── */}
      <header className="pt-16 pb-14 px-4" style={{ background: `linear-gradient(to bottom, ${ACCENT_BG}, #FFFFFF)` }}>
        <div className="max-w-4xl mx-auto text-center">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6"
            style={{ color: ACCENT_DARK, backgroundColor: '#FFFFFF', border: `1px solid ${ACCENT}` }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Fonctionnalité 03
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6" style={{ color: TEXT }}>
            Fiches techniques en 10 secondes
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-9" style={{ color: TEXT_MUTED }}>
            Food cost, marge, coefficient et allergènes calculés <strong style={{ color: TEXT }}>en temps réel</strong>.
            Saisissez vos ingrédients, RestauMargin fait le reste — et met tout à jour automatiquement quand vos prix
            fournisseurs bougent.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded-2xl transition-transform hover:scale-[1.02] text-lg shadow-lg"
              style={{ backgroundColor: ACCENT, boxShadow: `0 10px 25px -5px ${ACCENT}66` }}
            >
              Créer ma première fiche
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/blog/fiche-technique-restaurant"
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-2xl transition-colors"
              style={{ color: TEXT, border: `2px solid ${BORDER}` }}
            >
              Lire le guide complet
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm" style={{ color: TEXT_MUTED }}>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" style={{ color: ACCENT }} /> 10 secondes par fiche
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" style={{ color: ACCENT }} /> 14 allergènes INCO automatiques
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" style={{ color: ACCENT }} /> Export PDF inspection-ready
            </span>
          </div>
        </div>
      </header>

      {/* ── Le problème ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: TEXT }}>
              Le problème des fiches techniques « classiques »
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: TEXT_MUTED }}>
              Excel, classeurs papier, fichiers Word oubliés sur une clé USB. La plupart des restaurants pilotent leur
              cuisine avec des fiches qui mentent.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                title: 'Tout est sur Excel ou sur papier',
                desc: "Une fiche par onglet, des colonnes qui se chevauchent, des formules cassées dès qu'on insère une ligne. Le chef ne touche plus le fichier de peur de tout casser, et personne ne sait quelle version est la bonne.",
              },
              {
                title: 'Les fiches ne sont jamais à jour',
                desc: "Vous mettez à jour le prix du beurre dans une fiche, mais pas dans les vingt autres qui en contiennent. Au bout de trois mois, vos coûts affichés n'ont plus rien à voir avec la réalité de vos factures.",
              },
              {
                title: 'Le food cost est faux',
                desc: "Quand un fournisseur augmente le bœuf de 15 %, vous continuez à vendre votre plat au même prix avec une marge fantôme. Vous croyez gagner de l'argent sur un plat qui vous en fait perdre.",
              },
              {
                title: 'La panique avant une inspection',
                desc: "Un contrôle d'hygiène est annoncé : commence alors une nuit blanche à reconstituer les allergènes plat par plat, à imprimer des fiches bricolées. Stress maximal, conformité minimale.",
              },
            ].map((p, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 flex gap-4"
                style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}
              >
                <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
                <div>
                  <h3 className="font-bold mb-1.5 text-lg" style={{ color: TEXT }}>
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-base mt-10 max-w-3xl mx-auto" style={{ color: TEXT_MUTED }}>
            Une fiche technique n'a de valeur que si elle est <strong style={{ color: TEXT }}>vivante</strong> : reliée à
            vos prix réels, recalculée en continu, et exportable à la demande. C'est exactement ce que fait RestauMargin.
          </p>
        </div>
      </section>

      {/* ── Comment ça marche (HowTo, 4 étapes) ── */}
      <section className="py-16 px-4" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: ACCENT_DARK }}>
              Comment ça marche
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-4" style={{ color: TEXT }}>
              Une fiche complète en 4 étapes, 10 secondes
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: TEXT_MUTED }}>
              Le temps de saisir vos ingrédients, tout le reste se calcule pendant que vous tapez.
            </p>
          </div>

          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howToSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <li
                  key={i}
                  id={`etape-${i + 1}`}
                  className="bg-white rounded-2xl p-6 relative"
                  style={{ border: `1px solid ${BORDER}` }}
                >
                  <div
                    className="absolute -top-3 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-extrabold"
                    style={{ backgroundColor: ACCENT_DARK }}
                  >
                    {i + 1}
                  </div>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold mb-2 leading-snug" style={{ color: TEXT }}>
                    {step.name}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                    {step.text}
                  </p>
                </li>
              );
            })}
          </ol>

          {/* Exemple concret : bœuf bourguignon */}
          <div className="bg-white rounded-2xl mt-10 p-7 sm:p-9" style={{ border: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-2 mb-5">
              <Utensils className="w-5 h-5" style={{ color: ACCENT_DARK }} />
              <h3 className="font-extrabold tracking-tight text-xl" style={{ color: TEXT }}>
                Exemple : la fiche d'un bœuf bourguignon (4 portions)
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <p className="text-sm font-semibold mb-3" style={{ color: TEXT_MUTED }}>
                  Ingrédients saisis
                </p>
                <ul className="space-y-2 text-sm" style={{ color: TEXT }}>
                  {[
                    ['800 g de bœuf à braiser', '9,60 €'],
                    ['200 g de lardons', '2,40 €'],
                    ['50 cl de vin rouge de cuisine', '2,50 €'],
                    ['300 g de carottes', '0,75 €'],
                    ['2 oignons + bouquet garni', '0,90 €'],
                    ['Fond de veau (sous-recette maison)', '1,20 €'],
                  ].map(([ing, price], k) => (
                    <li key={k} className="flex items-center justify-between gap-4 py-2 border-b" style={{ borderColor: BORDER }}>
                      <span>{ing}</span>
                      <span className="font-semibold tabular-nums">{price}</span>
                    </li>
                  ))}
                  <li className="flex items-center justify-between gap-4 pt-3 font-bold" style={{ color: TEXT }}>
                    <span>Coût matière total</span>
                    <span className="tabular-nums">17,35 €</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl p-6" style={{ backgroundColor: ACCENT_BG }}>
                <p className="text-sm font-semibold mb-4" style={{ color: ACCENT_DARK }}>
                  Calculé automatiquement
                </p>
                <div className="space-y-3 text-sm">
                  {[
                    ['Coût portion', '4,34 €'],
                    ['Prix de vente carte', '16,00 €'],
                    ['Food cost', '27 %'],
                    ['Marge brute / portion', '11,66 €'],
                    ['Coefficient', '× 3,69'],
                  ].map(([label, val], k) => (
                    <div key={k} className="flex items-center justify-between gap-4">
                      <span style={{ color: TEXT_MUTED }}>{label}</span>
                      <span className="font-extrabold tabular-nums" style={{ color: TEXT }}>
                        {val}
                      </span>
                    </div>
                  ))}
                  <div className="pt-3 mt-1 flex items-start gap-2" style={{ borderTop: `1px solid ${ACCENT}55` }}>
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: ACCENT_DARK }} />
                    <span className="text-xs leading-relaxed" style={{ color: ACCENT_DARK }}>
                      Allergènes détectés : <strong>gluten</strong> (fond de veau), <strong>sulfites</strong> (vin),
                      <strong> céleri</strong> (bouquet garni).
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm mt-6 leading-relaxed" style={{ color: TEXT_MUTED }}>
              Un food cost de <strong style={{ color: TEXT }}>27 %</strong> est sain pour un plat traditionnel (la cible
              usuelle se situe entre 25 % et 32 %). Le coefficient de 3,69 indique que vous vendez le plat 3,69 fois son
              coût matière — RestauMargin vous signale si vous passez sous votre seuil de rentabilité.
            </p>
          </div>
        </div>
      </section>

      {/* ── Ce qui est calculé en temps réel ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: TEXT }}>
              Ce qui est calculé en temps réel
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: TEXT_MUTED }}>
              Sept indicateurs mis à jour à chaque frappe et à chaque variation de prix. Aucune formule à écrire.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Percent,
                title: 'Food cost (%)',
                desc: "Le ratio coût matière sur prix de vente, le KPI numéro un de la restauration. Vous voyez instantanément si un plat est dans la cible (25-32 %) ou s'il dérape.",
              },
              {
                icon: Wallet,
                title: 'Marge brute (€)',
                desc: "Le bénéfice en euros que rapporte chaque portion une fois la matière déduite. C'est ce qui finance vos charges fixes et votre salaire.",
              },
              {
                icon: TrendingUp,
                title: 'Marge (%)',
                desc: "La rentabilité relative du plat, exprimée en pourcentage du prix de vente. Idéale pour comparer une entrée à 7 € et un plat à 22 €.",
              },
              {
                icon: Calculator,
                title: 'Coefficient multiplicateur',
                desc: "Le multiple appliqué au coût matière pour fixer le prix carte. Un coefficient de 3 à 4 est courant ; en dessous de 2,5, la marge est trop faible.",
              },
              {
                icon: TrendingUp,
                title: 'Prix de vente conseillé',
                desc: "À partir de votre food cost cible, RestauMargin propose un prix de vente cohérent. Vous fixez votre objectif, l'app calcule le tarif.",
              },
              {
                icon: ShieldCheck,
                title: 'Allergènes (14 INCO)',
                desc: "La liste réglementaire complète, détectée automatiquement à partir des ingrédients. Gluten, lait, œufs, fruits à coque, sulfites... rien n'est oublié.",
              },
              {
                icon: Utensils,
                title: 'Coût portion',
                desc: "Le coût matière ramené à une portion individuelle, en tenant compte du nombre de couverts produits par la recette. Indispensable pour le pricing à l'assiette.",
              },
              {
                icon: Layers,
                title: 'Sous-recettes propagées',
                desc: "Le coût de vos bases maison (fonds, sauces, pâtes) remonte dans toutes les recettes qui les utilisent. Une hausse à la source se répercute partout.",
              },
              {
                icon: RefreshCw,
                title: 'Recalcul automatique',
                desc: "Chaque modification — quantité, ingrédient, prix fournisseur — déclenche un recalcul instantané de tous les indicateurs ci-dessus.",
              },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl p-6 transition-shadow hover:shadow-md"
                  style={{ border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF' }}
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold mb-2 text-lg" style={{ color: TEXT }}>
                    {c.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                    {c.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Mise à jour automatique ── */}
      <section className="py-16 px-4" style={{ backgroundColor: ACCENT_BG }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: ACCENT_DARK }}>
                Le cœur du système
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-5" style={{ color: TEXT }}>
                Un prix change, toutes les fiches se recalculent
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: TEXT_MUTED }}>
                C'est ce qui sépare une fiche technique vivante d'un tableur mort. Quand le prix d'un ingrédient évolue —
                via votre mercuriale éditée à la main, un scan de facture par OCR, ou une alerte de hausse fournisseur —
                RestauMargin met à jour <strong style={{ color: TEXT }}>chaque recette concernée</strong> en temps réel.
              </p>
              <p className="text-base leading-relaxed" style={{ color: TEXT_MUTED }}>
                Vous photographiez un bordereau Metro où le beurre passe de 7,50 € à 8,90 € le kilo : en quelques
                secondes, vos vingt fiches contenant du beurre affichent leur nouveau food cost. Plus aucune marge
                fantôme, plus aucune ressaisie manuelle.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7" style={{ border: `1px solid ${ACCENT}33` }}>
              <div className="flex items-center gap-2 mb-5">
                <ScanLine className="w-5 h-5" style={{ color: ACCENT_DARK }} />
                <span className="font-bold" style={{ color: TEXT }}>
                  Effet domino sur le beurre (+18,7 %)
                </span>
              </div>
              <div className="space-y-3">
                {[
                  ['Sauce hollandaise', '24 %', '29 %'],
                  ['Risotto crémeux', '31 %', '34 %'],
                  ['Pommes purée maison', '19 %', '23 %'],
                  ['Bœuf bourguignon', '27 %', '27 %'],
                ].map(([dish, before, after], k) => {
                  const changed = before !== after;
                  return (
                    <div
                      key={k}
                      className="flex items-center justify-between gap-3 py-2 border-b text-sm"
                      style={{ borderColor: BORDER }}
                    >
                      <span style={{ color: TEXT }}>{dish}</span>
                      <span className="flex items-center gap-2 tabular-nums">
                        <span style={{ color: TEXT_MUTED }}>{before}</span>
                        <ArrowRight className="w-3.5 h-3.5" style={{ color: TEXT_MUTED }} />
                        <span
                          className="font-extrabold"
                          style={{ color: changed ? '#DC2626' : ACCENT_DARK }}
                        >
                          {after}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs mt-4 leading-relaxed" style={{ color: TEXT_MUTED }}>
                Recalcul instantané : seules les fiches contenant du beurre bougent. Le bœuf bourguignon, sans beurre,
                reste à 27 %.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bénéfices chiffrés ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: TEXT }}>
              Des bénéfices chiffrés, pas des promesses
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: TEXT_MUTED }}>
              Ce que change concrètement le passage aux fiches techniques automatisées.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, stat: '10 s', label: 'au lieu de 20 min', desc: 'Le temps de créer une fiche complète, calculs et allergènes inclus.' },
              { icon: RefreshCw, stat: '0', label: 'fiche obsolète', desc: 'Tout se recalcule en temps réel à chaque variation de prix.' },
              { icon: ShieldCheck, stat: '100 %', label: 'conformité allergènes', desc: 'Les 14 allergènes INCO détectés automatiquement sur chaque recette.' },
              { icon: Percent, stat: '+3 à 5 pts', label: 'de marge maîtrisée', desc: 'En repérant les plats qui dérapent dès que la matière augmente.' },
            ].map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl p-7 text-center"
                  style={{ border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF' }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 mx-auto"
                    style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight" style={{ color: ACCENT_DARK }}>
                    {b.stat}
                  </div>
                  <div className="font-semibold mb-2" style={{ color: TEXT }}>
                    {b.label}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mini-témoignage */}
          <div
            className="rounded-2xl mt-10 p-7 sm:p-9 flex gap-5 max-w-3xl mx-auto"
            style={{ backgroundColor: '#FAFAFA', border: `1px solid ${BORDER}` }}
          >
            <Quote className="w-8 h-8 shrink-0" style={{ color: ACCENT }} />
            <div>
              <p className="text-base leading-relaxed italic mb-3" style={{ color: TEXT }}>
                « Avant, mes fiches techniques dormaient dans un classeur que je ressortais en panique avant les
                contrôles. Aujourd'hui, je crée une fiche pendant que je parle au commis, le food cost s'affiche tout
                seul, et j'exporte le PDF en deux secondes. J'ai arrêté de vendre à perte sur trois plats que je croyais
                rentables. »
              </p>
              <div className="text-sm font-bold" style={{ color: TEXT }}>
                Karim B. — Chef-propriétaire
              </div>
              <div className="text-xs" style={{ color: ACCENT_DARK }}>
                Bistrot de quartier, Marseille
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: TEXT }}>
              Questions fréquentes
            </h2>
            <p className="text-lg" style={{ color: TEXT_MUTED }}>
              Tout ce qu'il faut savoir sur les fiches techniques RestauMargin.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>

          <div
            className="rounded-2xl p-5 mt-8 flex gap-3 text-sm leading-relaxed"
            style={{ backgroundColor: ACCENT_BG, border: `1px solid ${ACCENT}33`, color: ACCENT_DARK }}
          >
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <strong>Une autre question ?</strong> Découvrez aussi comment l'
              <Link to="/fonctionnalites/ia-cuisine" className="underline font-semibold">
                IA cuisine
              </Link>{' '}
              suggère des recettes optimisées, et comment les{' '}
              <Link to="/fonctionnalites/mercuriale-alertes-prix" className="underline font-semibold">
                alertes prix de la mercuriale
              </Link>{' '}
              alimentent vos fiches en temps réel.
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="py-20 px-4" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})` }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6">
            Vos fiches techniques, vivantes en 10 secondes
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-3" style={{ color: '#ECFDF5' }}>
            Food cost, marge, coefficient et allergènes calculés automatiquement. Mises à jour dès qu'un prix change.
          </p>
          <p className="mb-10" style={{ color: '#D1FAE5' }}>
            Essai gratuit 7 jours — Sans carte bancaire — Sans engagement
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-10 py-5 font-extrabold rounded-2xl transition-transform hover:scale-[1.02] text-lg shadow-2xl bg-white"
              style={{ color: ACCENT_DARK }}
            >
              Créer ma première fiche
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/blog/calcul-marge-restaurant"
              className="inline-flex items-center gap-2 px-10 py-5 font-bold rounded-2xl transition-colors text-lg text-white"
              style={{ border: '2px solid rgba(255,255,255,0.4)' }}
            >
              Comprendre le calcul de marge
            </Link>
          </div>
        </div>
      </section>

      {/* ── Maillage interne ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-extrabold tracking-tight mb-8 text-center" style={{ color: TEXT }}>
            Pour aller plus loin
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                to: '/fonctionnalites/ia-cuisine',
                icon: Sparkles,
                title: 'IA cuisine',
                desc: "Suggestions de recettes, optimisation des marges et commande vocale par l'intelligence artificielle.",
              },
              {
                to: '/fonctionnalites/mercuriale-alertes-prix',
                icon: ScanLine,
                title: 'Mercuriale & alertes prix',
                desc: 'Suivi des prix fournisseurs et alertes en temps réel qui alimentent vos fiches techniques.',
              },
              {
                to: '/blog/fiche-technique-restaurant',
                icon: ClipboardList,
                title: 'Guide fiche technique',
                desc: 'Tout comprendre sur la fiche technique en restauration : structure, mentions, bonnes pratiques.',
              },
              {
                to: '/blog/calcul-marge-restaurant',
                icon: Calculator,
                title: 'Calcul de marge',
                desc: 'Formules, food cost, coefficient et benchmarks pour maîtriser la rentabilité de votre carte.',
              },
            ].map((link, i) => {
              const Icon = link.icon;
              return (
                <Link
                  key={i}
                  to={link.to}
                  className="rounded-2xl p-6 transition-all hover:shadow-md group"
                  style={{ border: `1px solid ${BORDER}`, backgroundColor: '#FAFAFA' }}
                >
                  <Icon className="w-8 h-8 mb-3" style={{ color: ACCENT }} />
                  <h3 className="font-bold mb-2 transition-colors" style={{ color: TEXT }}>
                    {link.title}
                  </h3>
                  <p className="text-sm" style={{ color: TEXT_MUTED }}>
                    {link.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-12 px-4" style={{ backgroundColor: '#FAFAFA', borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto text-center text-sm" style={{ color: TEXT_MUTED }}>
          <Link
            to="/landing"
            className="flex items-center justify-center gap-2 font-extrabold tracking-tight text-lg mb-4"
            style={{ color: TEXT }}
          >
            <ClipboardList className="w-6 h-6" style={{ color: ACCENT }} />
            RestauMargin
          </Link>
          <p className="mb-4 max-w-xl mx-auto">
            Le logiciel de fiche technique cuisine qui calcule food cost, marge et allergènes en temps réel.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link to="/mentions-legales" className="hover:underline" style={{ color: TEXT_MUTED }}>
              Mentions légales
            </Link>
            <Link to="/cgv" className="hover:underline" style={{ color: TEXT_MUTED }}>
              CGV
            </Link>
            <Link to="/cgu" className="hover:underline" style={{ color: TEXT_MUTED }}>
              CGU
            </Link>
            <Link to="/politique-confidentialite" className="hover:underline" style={{ color: TEXT_MUTED }}>
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

/* ═══════════════ Sous-composant FAQ ═══════════════ */

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="bg-white rounded-2xl group" style={{ border: `1px solid ${BORDER}` }}>
      <summary
        className="px-5 py-4 font-semibold cursor-pointer select-none flex items-center justify-between gap-4 list-none"
        style={{ color: TEXT }}
      >
        {q}
        <ArrowRight className="w-4 h-4 shrink-0 group-open:rotate-90 transition-transform" style={{ color: ACCENT }} />
      </summary>
      <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
        {a}
      </p>
    </details>
  );
}
