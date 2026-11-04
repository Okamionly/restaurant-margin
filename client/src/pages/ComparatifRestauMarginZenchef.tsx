import { Link } from 'react-router-dom';
import {
  ChefHat,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Target,
  BookOpen,
  Lightbulb,
  Users,
  Zap,
  Sparkles,
  Scale,
  XCircle,
  Building2,
  Minus,
  Trophy,
  HelpCircle,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Comparatif SEO direct — "RestauMargin vs Zenchef : benchmark 2026"
   Mot-cle principal : restaumargin vs zenchef
   Mots-cles secondaires : zenchef alternative, zenchef avis, comparatif zenchef restaumargin
   ~3 500 mots — mode clair, fond blanc, typo lisible
   Different de /alternative-zenchef : benchmark cote a cote 25+ criteres
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Quelle est la différence principale entre RestauMargin et Zenchef ?",
    answer: "RestauMargin est un logiciel de gestion opérationnelle pour restaurants (food cost, fiches techniques, marges, mercuriale fournisseurs, IA). Zenchef est une plateforme de gestion de la relation client (réservations en ligne, site web, marketing email, gestion des avis). Les deux outils ne sont pas concurrents directs : ils répondent à deux besoins différents. RestauMargin pilote la rentabilité, Zenchef pilote l'acquisition.",
  },
  {
    question: "Lequel est le moins cher ?",
    answer: "RestauMargin est nettement moins cher : 29 EUR/mois en formule Pro et 79 EUR/mois en formule Business. Zenchef démarre à 89 EUR/mois (Essential) et monte à 189 EUR/mois (Premium). Sur un an, l'écart va de 720 à 1 920 EUR selon les formules comparées. RestauMargin coûte donc 30 à 60 % du prix de Zenchef tout en couvrant un périmètre fonctionnel différent (gestion ops vs réservations).",
  },
  {
    question: "Peut-on utiliser RestauMargin et Zenchef en parallèle ?",
    answer: "Oui, c'est une configuration courante. RestauMargin gère votre back-office (food cost, fiches techniques, marges, fournisseurs) tandis que Zenchef gère votre front-office digital (réservations, marketing, site web). Aucune intégration native n'existe entre les deux, mais ils n'ont pas besoin d'échanger de données pour coexister. Total combiné : 118 EUR/mois (RestauMargin Pro + Zenchef Essential), soit moins cher qu'une formule Zenchef Standard seule.",
  },
  {
    question: "Lequel a la meilleure interface ?",
    answer: "Zenchef offre une interface mature et léchée, conçue pour la gestion clientèle avec un focus marketing. RestauMargin propose une interface plus épurée et mobile-first, optimisée pour la saisie rapide en cuisine (mode kiosk, scan OCR, balance Bluetooth). Le choix dépend de votre usage principal : Zenchef si vous gérez beaucoup de réservations depuis un ordinateur ; RestauMargin si vous travaillez en cuisine sur tablette ou téléphone. Les deux sont en français.",
  },
  {
    question: "Lequel pour un food truck ?",
    answer: "Pour un food truck, RestauMargin est largement plus adapté. Pas de réservation à gérer (vente directe), pas de site web restaurant complexe à maintenir. Le vrai enjeu est le food cost en mobilité : marges plat par plat, gestion fournisseurs, stocks. RestauMargin (29 EUR/mois) couvre tout ça avec un mode mobile + kiosk + scan factures. Zenchef serait surdimensionné et trop cher pour ce profil.",
  },
  {
    question: "Lequel pour une chaîne de restaurants ?",
    answer: "Pour un groupe de 3 à 10 restaurants, la combinaison optimale est RestauMargin Business (79 EUR/mois) pour la vue consolidée des marges + Zenchef Premium (189 EUR/mois) pour la gestion centralisée réservations. RestauMargin offre une vue groupe avec benchmarking entre établissements (food cost par site, dérive de marges, alertes consolidées) que Zenchef ne propose pas. Pour les marques nationales (>20 restaurants), Innovorder ou Lightspeed Restaurant peuvent aussi être considérés en alternative POS.",
  },
  {
    question: "Migration de Zenchef vers RestauMargin est-elle possible ?",
    answer: "La question de migration ne se pose pas vraiment, car les deux outils stockent des données totalement différentes. Zenchef garde vos réservations, votre base clients et votre historique marketing. RestauMargin gère vos ingrédients, recettes, fiches techniques et factures fournisseurs. Vous pouvez quitter Zenchef sans rien perdre côté opérations, et inversement. Il est possible d'ajouter simplement RestauMargin par-dessus Zenchef plutôt que de remplacer l'un par l'autre.",
  },
  {
    question: "Lequel pour la gestion HACCP ?",
    answer: "RestauMargin inclut un module HACCP digital : suivi des températures, traçabilité des produits, fiches d'autocontrôle, registre de nettoyage. Zenchef ne couvre pas du tout cet aspect (hors scope). Si la conformité HACCP est un enjeu critique pour vous (notamment en restauration collective ou gastronomique), RestauMargin est le seul des deux à vous accompagner sur cette obligation réglementaire.",
  },
  {
    question: "Avis Trustpilot des deux outils ?",
    // FIX 2026-09-24 : cette reponse attribuait a RestauMargin "une note moyenne
    // de 4.8/5 sur 47 avis". Ces 47 avis n'existent pas : aucun avis client n'a
    // jamais ete collecte. Inventer des avis de consommateurs est une pratique
    // commerciale trompeuse (Code de la consommation, art. L121-2 et suivants),
    // et c'est d'autant plus expose ici que la page compare nommement un
    // concurrent. On dit ce qui est vrai : le produit est jeune et sans historique
    // d'avis — ce qui reste un argument utilisable, a condition d'etre assume.
    answer: "Zenchef est globalement bien noté sur Trustpilot et Capterra : interface intuitive, support réactif, valeur pour les restaurants gastronomiques. Critiques récurrentes : prix élevé et complexité des fonctions marketing avancées. RestauMargin est un outil récent : il n'a pas encore d'historique d'avis publiés, et nous préférons le dire plutôt que d'afficher une note. Ce qui est vérifiable dès aujourd'hui : un tarif unique à 29 EUR, un essai de 7 jours sans carte bancaire, et un périmètre centré sur le food cost et les marges — pas de module de réservation native, contrairement à Zenchef.",
  },
  {
    question: "Mobile et iPad : qui est mieux ?",
    answer: "RestauMargin est conçu mobile-first avec une PWA installable sur iPad et Android, plus un mode kiosk dédié pour les tablettes en cuisine (saisie rapide, scan OCR de factures, intégration balance Bluetooth). Zenchef propose une app mobile classique pour iOS et Android, optimisée pour la gestion réservations sur le pouce. Pour un usage cuisine intensif, RestauMargin gagne. Pour un usage salle (consultation réservations, marketing), Zenchef est légitime.",
  },
  {
    question: "Pour piloter mes marges au quotidien ?",
    answer: "Sans hésitation : RestauMargin. C'est le coeur de notre produit. Calcul automatique du food cost en temps réel, marge brute par plat, alertes sur dérive (hausse fournisseur, baisse de marge sur un plat star), IA qui suggère des optimisations. Zenchef ne calcule aucun food cost ni aucune marge, ce n'est tout simplement pas dans son scope. Si la rentabilité opérationnelle est votre priorité, RestauMargin est imbattable à 29 EUR/mois.",
  },
  {
    question: "Quelle est l'alternative économique à Zenchef ?",
    answer: "Si votre vrai besoin est uniquement la réservation en ligne et non le marketing avancé, plusieurs alternatives moins chères que Zenchef existent : TheFork (gratuit avec commission), Resy (modèle freemium), Google Reservations (gratuit, intégré à votre fiche Google). Si vous cherchez à économiser tout en gagnant en rentabilité, le combo RestauMargin (29 EUR) + TheFork (commission) est radicalement moins cher que Zenchef (89-189 EUR) tout en couvrant plus de besoins critiques.",
  },
];

export default function ComparatifRestauMarginZenchef() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="RestauMargin vs Zenchef : comparatif complet 2026 (prix, features, avis)"
        description="Comparatif benchmarks publics du secteurZenchef en 2026. Prix, fonctionnalités, food cost, réservations, gestion marge. Quelle solution choisir selon votre restaurant ? Verdict honnête."
        path="/comparatif-restaumargin-vs-zenchef"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Comparatifs', url: 'https://www.restaumargin.fr/blog' },
            { name: 'RestauMargin vs Zenchef', url: 'https://www.restaumargin.fr/comparatif-restaumargin-vs-zenchef' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'RestauMargin vs Zenchef : comparatif complet 2026',
            description: "Comparatif benchmark détaillé entre RestauMargin et Zenchef en 2026. Tableau 25+ critères, prix, cas d'usage et FAQ.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-05-27',
            dateModified: '2026-05-27',
            wordCount: 3500,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/comparatif-restaumargin-vs-zenchef' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'RestauMargin vs Zenchef benchmark',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                item: {
                  '@type': 'SoftwareApplication',
                  name: 'RestauMargin',
                  applicationCategory: 'BusinessApplication',
                  operatingSystem: 'Web, iOS, Android (PWA)',
                  offers: {
                    '@type': 'Offer',
                    price: '29',
                    priceCurrency: 'EUR',
                    priceSpecification: {
                      '@type': 'UnitPriceSpecification',
                      price: '29',
                      priceCurrency: 'EUR',
                      unitText: 'MONTH',
                    },
                  },
                  description: "Gestion des marges, food cost, fiches techniques, mercuriale fournisseurs et IA d'optimisation pour restaurateurs indépendants et groupes.",
                },
              },
              {
                '@type': 'ListItem',
                position: 2,
                item: {
                  '@type': 'SoftwareApplication',
                  name: 'Zenchef',
                  applicationCategory: 'BusinessApplication',
                  operatingSystem: 'Web, iOS, Android',
                  offers: {
                    '@type': 'Offer',
                    price: '89',
                    priceCurrency: 'EUR',
                    priceSpecification: {
                      '@type': 'UnitPriceSpecification',
                      price: '89',
                      priceCurrency: 'EUR',
                      unitText: 'MONTH',
                    },
                  },
                  description: "Plateforme de réservation en ligne, site web restaurant, marketing email et gestion de la relation client pour la restauration.",
                },
              },
            ],
          },
        ]}
      />

      {/* ── Navbar ── */}
      <PublicHeader />

      {/* ── Breadcrumbs visibles ── */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">Comparatifs</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">RestauMargin vs Zenchef</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Benchmark"
        readTime="14 min"
        date="Mai 2026"
        title="RestauMargin vs Zenchef : comparatif complet 2026"
        accentWord="RestauMargin vs Zenchef"
        subtitle="Quel logiciel pour votre restaurant en 2026 ? Voici un benchmark côté à côté, point par point, sur 25+ critères (prix, fonctionnalités, food cost, réservations, IA, support). Verdict honnête par profil restaurateur."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-27" readTime="14 min" variant="header" />

        {/* ── Featured snippet (60 mots) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Verdict en 60 secondes</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            RestauMargin vs Zenchef : la réponse rapide
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 space-y-3 text-sm sm:text-base">
            <p className="leading-relaxed">
              <strong className="text-white">RestauMargin (29 EUR/mois)</strong> et <strong className="text-white">Zenchef (89-189 EUR/mois)</strong> répondent à des besoins différents : RestauMargin excelle sur la gestion food cost, fiches techniques et optimisation des marges, tandis que Zenchef domine sur les réservations en ligne, le plan de salle et le marketing email. Pour piloter vos marges au quotidien, RestauMargin offre plus de fonctionnalités à 70 % du prix. Pour la gestion réservations, Zenchef reste leader.
            </p>
          </div>
          {/* Mini-tableau verdict 5 criteres */}
          <div className="mt-5 grid grid-cols-3 gap-2 text-xs sm:text-sm">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-teal-100 mb-1">Prix</div>
              <div className="font-bold flex items-center gap-1.5"><BadgeR /> Gagne</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-teal-100 mb-1">Food cost</div>
              <div className="font-bold flex items-center gap-1.5"><BadgeR /> Gagne</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-teal-100 mb-1">Réservations</div>
              <div className="font-bold flex items-center gap-1.5"><BadgeZ /> Gagne</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-teal-100 mb-1">Marketing</div>
              <div className="font-bold flex items-center gap-1.5"><BadgeZ /> Gagne</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-teal-100 mb-1">IA / Mobile</div>
              <div className="font-bold flex items-center gap-1.5"><BadgeR /> Gagne</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-teal-100 mb-1">Verdict</div>
              <div className="font-bold">Complémentaires</div>
            </div>
          </div>
        </div>

        {/* ── Table des matieres ── */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#verdict', label: "Verdict en 60 secondes" },
              { href: '#vue-ensemble', label: "Vue d'ensemble : 2 positionnements différents" },
              { href: '#prix', label: 'Comparatif prix complet' },
              { href: '#features', label: 'Comparatif fonctionnalités côté à côté (25+ critères)' },
              { href: '#cas-usage', label: "Cas d'usage : qui choisir ?" },
              { href: '#combiner', label: 'Combiner les deux outils ?' },
              { href: '#pricing-12m', label: 'Pricing détaillé sur 12 mois' },
              { href: '#verdict-final', label: 'Verdict final par profil' },
              { href: '#faq', label: 'FAQ 12 questions' },
              { href: '#cta', label: 'Tester RestauMargin gratuitement' },
            ].map((item, i) => (
              <li key={i}>
                <a href={item.href} className="hover:text-teal-600 transition-colors flex items-start gap-2">
                  <span className="text-teal-600 font-semibold min-w-[24px]">{i + 1}.</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article>

        {/* ═════════════ SECTION 1 : Verdict 60s ═════════════ */}
        <section id="verdict" className="mb-16">
          <SectionHeading icon={<Trophy className="w-6 h-6" />} number="1">
            RestauMargin vs Zenchef : verdict en 60 secondes
          </SectionHeading>

          <div className="prose-content">
            <p>
              Si vous n'avez que 60 secondes, voici la synthèse du benchmark complet détaillé dans cet article.
              RestauMargin et Zenchef ne sont pas des concurrents directs : ils répondent à deux besoins différents
              chez le restaurateur. La vraie question n'est pas "lequel est le meilleur" mais "lequel correspond
              à mon besoin principal en 2026".
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-mono-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-950 text-mono-100">
                  <th className="text-left py-4 px-4 font-bold w-[35%]">Critère clé</th>
                  <th className="text-center py-4 px-4 font-bold w-[32.5%]">
                    <div className="flex items-center justify-center gap-2">
                      <BadgeR />
                      RestauMargin
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 font-bold w-[32.5%]">
                    <div className="flex items-center justify-center gap-2">
                      <BadgeZ />
                      Zenchef
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <VerdictRow label="Prix d'entrée" rm="29 EUR/mois" zc="89 EUR/mois" winner="rm" />
                <VerdictRow label="Gestion food cost et marges" rm="Coeur du produit" zc="Non couvert" winner="rm" />
                <VerdictRow label="Réservations en ligne" rm="Non couvert" zc="Coeur du produit" winner="zc" />
                <VerdictRow label="Marketing automatisé" rm="Non couvert" zc="Mature" winner="zc" />
                <VerdictRow label="IA + mobile + kiosk" rm="19 actions IA + PWA" zc="App mobile classique" winner="rm" />
              </tbody>
            </table>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <BadgeR />
                <h3 className="font-bold text-emerald-900">Choisissez RestauMargin si...</h3>
              </div>
              <ul className="space-y-2 text-sm text-emerald-800 leading-relaxed">
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Votre priorité est la rentabilité opérationnelle (food cost, marges)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Vous voulez un outil mobile-first pour la cuisine</span></li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Votre budget logiciel est serré (29 EUR/mois)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Vous avez déjà un module réservation (TheFork, Google)</span></li>
              </ul>
            </div>
            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <BadgeZ />
                <h3 className="font-bold text-violet-900">Choisissez Zenchef si...</h3>
              </div>
              <ul className="space-y-2 text-sm text-violet-800 leading-relaxed">
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Votre activité dépend des réservations en ligne (plus de 50 %)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Vous avez un budget marketing dédié (campagnes email)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Vous êtes un restaurant gastronomique avec listes d'attente</span></li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Vous voulez un site web restaurant clé en main</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Vue d'ensemble ═════════════ */}
        <section id="vue-ensemble" className="mb-16">
          <SectionHeading icon={<Building2 className="w-6 h-6" />} number="2">
            Vue d'ensemble : 2 positionnements différents
          </SectionHeading>

          <div className="prose-content">
            <p>
              Avant de plonger dans le comparatif fonctionnel, il est essentiel de comprendre que RestauMargin
              et Zenchef ne sont pas concurrents directs. Ils s'attaquent à deux problèmes différents du
              restaurateur, avec deux approches produit distinctes. Cette nuance change radicalement le verdict
              du benchmark.
            </p>
            <p>
              <strong>RestauMargin</strong> est né en 2024 d'un constat simple : les restaurateurs français
              perdent en moyenne 4 à 8 points de marge brute par mois faute d'outils opérationnels adaptés.
              Notre promesse : chaque plat servi doit être rentable, et vous devez le savoir en temps réel.
              Le produit couvre les marges, le food cost, les fiches techniques, la mercuriale fournisseurs
              et l'optimisation par IA. Aucun module réservation, aucun marketing automatisé.
            </p>
            <p>
              <strong>Zenchef</strong>, fondé en 2010, est l'un des acteurs historiques de la restauration
              digitale en France. Plus de 8 000 restaurants l'utilisent en Europe selon leur site officiel.
              Le produit est positionné comme une plateforme tout-en-un pour la relation client : réservation
              en ligne, site web restaurant, marketing email et SMS, gestion centralisée des avis. Aucun
              module food cost, aucune fiche technique, aucune gestion de mercuriale.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <PositioningCard
              badge={<BadgeR />}
              name="RestauMargin"
              tagline="Le pilote de votre rentabilité opérationnelle"
              founded="2024"
              users="Outil récent"
              focus="Food cost, fiches techniques, marges, IA"
              missing="Réservations, marketing email, site web"
              color="emerald"
            />
            <PositioningCard
              badge={<BadgeZ />}
              name="Zenchef"
              tagline="Le pilote de votre relation client digitale"
              founded="2010"
              users="8 000+ restaurants"
              focus="Réservations, site web, marketing, avis"
              missing="Food cost, marges, fiches techniques"
              color="violet"
            />
          </div>

          <Callout type="info">
            <strong>Le piège à éviter :</strong> de nombreux restaurateurs achètent Zenchef en croyant
            qu'il couvre la gestion des marges. C'est faux. Pour piloter votre rentabilité, il faut
            obligatoirement un outil dédié comme RestauMargin ou un tableur Excel maison (avec tous les
            risques d'erreur et de retard que cela implique). Inversement, RestauMargin ne remplace pas
            Zenchef si vous avez besoin de gérer des réservations en ligne en volume.
          </Callout>
        </section>

        {/* ═════════════ SECTION 3 : Comparatif prix ═════════════ */}
        <section id="prix" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="3">
            Comparatif prix complet
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le prix est souvent le premier critère regardé par les restaurateurs. L'écart entre RestauMargin
              et Zenchef est significatif : sur l'entrée de gamme, Zenchef coûte 3 fois plus cher que
              RestauMargin. Sur le haut de gamme, l'écart monte à 2,4 fois. Mais comme on l'a vu, ce n'est
              pas le même produit, donc il faut comparer ce qui est comparable.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-mono-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-950 text-mono-100">
                  <th className="text-left py-4 px-4 font-bold">Formule</th>
                  <th className="text-right py-4 px-4 font-bold">Prix mensuel</th>
                  <th className="text-right py-4 px-4 font-bold">Prix annuel</th>
                  <th className="text-right py-4 px-4 font-bold">Engagement</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-emerald-50 border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-emerald-900 flex items-center gap-2"><BadgeR /> RestauMargin Pro</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">29 EUR</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">348 EUR</td>
                  <td className="py-3 px-4 text-right text-emerald-700">Aucun</td>
                </tr>
                <tr className="bg-emerald-50/40 border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-emerald-900 flex items-center gap-2"><BadgeR /> RestauMargin Business</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">79 EUR</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">948 EUR</td>
                  <td className="py-3 px-4 text-right text-emerald-700">Aucun</td>
                </tr>
                <tr className="bg-white border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-mono-100 flex items-center gap-2"><BadgeZ /> Zenchef Start</td>
                  <td className="py-3 px-4 text-right">89 EUR</td>
                  <td className="py-3 px-4 text-right">1 068 EUR</td>
                  <td className="py-3 px-4 text-right text-mono-500">12 mois</td>
                </tr>
                <tr className="bg-mono-1000 border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-mono-100 flex items-center gap-2"><BadgeZ /> Zenchef Plus</td>
                  <td className="py-3 px-4 text-right">139 EUR</td>
                  <td className="py-3 px-4 text-right">1 668 EUR</td>
                  <td className="py-3 px-4 text-right text-mono-500">12 mois</td>
                </tr>
                <tr className="bg-white border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-mono-100 flex items-center gap-2"><BadgeZ /> Zenchef Premium</td>
                  <td className="py-3 px-4 text-right">189 EUR</td>
                  <td className="py-3 px-4 text-right">2 268 EUR</td>
                  <td className="py-3 px-4 text-right text-mono-500">12 mois</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Calcul ROI 12 mois RestauMargin :</strong> sur un restaurant qui réalise 400 000 EUR
              de chiffre d'affaires annuel avec un food cost initial de 32 %, gagner 2 points de marge brute
              représente 8 000 EUR par an. RestauMargin Pro à 348 EUR/an se rentabiliserait donc en moins de 16
              jours si ce gain est atteint (exemple illustratif, le résultat dépend de votre situation).
            </p>
            <p>
              <strong>Calcul ROI 12 mois Zenchef :</strong> sur le même restaurant, gagner 10 réservations
              supplémentaires par semaine grâce au site web Zenchef + module réservation (ticket moyen 32 EUR,
              50 semaines) représente 16 000 EUR par an. Zenchef Start à 1 068 EUR/an se rentabilise donc en
              5 à 6 semaines. Le ROI Zenchef dépend fortement de votre visibilité web actuelle (si vous êtes
              déjà saturé, l'apport réservation sera nul).
            </p>
          </div>

          <Callout type="info">
            <strong>Vérité financière :</strong> RestauMargin est moins cher en absolu, mais son ROI dépend
            de l'attention que vous accorderez à l'outil. Zenchef est plus cher, mais peut générer un ROI
            supérieur si vous êtes sous-exploité côté réservations. Les deux outils n'attaquent pas le même
            levier de rentabilité : marges (interne) vs volumes (externe).
          </Callout>
        </section>

        {/* ═════════════ SECTION 4 : Comparatif fonctionnalites ═════════════ */}
        <section id="features" className="mb-16">
          <SectionHeading icon={<Scale className="w-6 h-6" />} number="4">
            Comparatif fonctionnalités côté à côté (25+ critères)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici le benchmark détaillé des deux outils sur 25+ critères regroupés en 4 catégories :
              gestion opérationnelle, acquisition client, support et intégrations. La légende est simple :
              OUI (fonctionnalité native complète), PARTIEL (fonctionnalité limitée ou en option),
              NON (fonctionnalité absente).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-mono-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-950 text-mono-100">
                  <th className="text-left py-4 px-4 font-bold w-[40%]">Fonctionnalité</th>
                  <th className="text-center py-4 px-4 font-bold w-[30%]">
                    <div className="flex items-center justify-center gap-2">
                      <BadgeR />
                      RestauMargin
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 font-bold w-[30%]">
                    <div className="flex items-center justify-center gap-2">
                      <BadgeZ />
                      Zenchef
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <CategoryRow label="Gestion opérationnelle" />
                <ComparisonRow label="Food cost calculator" rm="oui" zc="non" />
                <ComparisonRow label="Fiches techniques précises" rm="oui" zc="non" />
                <ComparisonRow label="Mercuriale fournisseurs" rm="oui" zc="non" />
                <ComparisonRow label="Gestion des stocks" rm="oui" zc="non" />
                <ComparisonRow label="Menu engineering (Boston Matrix)" rm="oui" zc="non" />
                <ComparisonRow label="HACCP digital" rm="oui" zc="non" />
                <ComparisonRow label="Scan factures OCR" rm="oui" zc="non" />
                <ComparisonRow label="IA / suggestions" rm="oui" rmText="19 actions IA" zc="partiel" zcText="Marketing uniquement" />

                <CategoryRow label="Acquisition client" />
                <ComparisonRow label="Réservations en ligne" rm="non" zc="oui" />
                <ComparisonRow label="Plan de salle interactif" rm="non" zc="oui" />
                <ComparisonRow label="Notifications SMS rappel" rm="non" zc="oui" />
                <ComparisonRow label="Marketing email" rm="non" zc="oui" />
                <ComparisonRow label="Site web restaurant" rm="non" zc="oui" />
                <ComparisonRow label="Avis Google centralisés" rm="non" zc="oui" />
                <ComparisonRow label="Newsletter intégrée" rm="non" zc="oui" />
                <ComparisonRow label="Programme fidélité" rm="non" zc="partiel" zcText="Premium uniquement" />
                <ComparisonRow label="Click & collect" rm="non" zc="partiel" zcText="Module supplémentaire" />
                <ComparisonRow label="Couverts par jour (tracking)" rm="oui" rmText="Via intégration POS" zc="oui" />

                <CategoryRow label="Plateforme et support" />
                <ComparisonRow label="Multi-restaurant natif" rm="oui" zc="oui" />
                <ComparisonRow label="Mobile / PWA" rm="oui" rmText="PWA + kiosk + balance BT" zc="oui" zcText="App mobile classique" />
                <ComparisonRow label="Support FR (chat/email)" rm="oui" rmText="email et chat" zc="oui" zcText="Téléphone Premium" />
                <ComparisonRow label="Essai gratuit" rm="oui" rmText="7 jours sans CB" zc="non" zcText="Démo commerciale" />
                <ComparisonRow label="Onboarding self-service" rm="oui" rmText="Wizard 5 min" zc="partiel" zcText="Onboarding accompagné" />
                <ComparisonRow label="Données exportables (CSV)" rm="oui" zc="oui" />

                <CategoryRow label="Intégrations" />
                <ComparisonRow label="Caisses (Tiller, Lightspeed, ...)" rm="oui" zc="partiel" zcText="2 partenaires" />
                <ComparisonRow label="Comptabilité (Pennylane, etc.)" rm="oui" zc="non" />
                <ComparisonRow label="Google Business" rm="non" zc="oui" />
                <ComparisonRow label="TripAdvisor / TheFork" rm="non" zc="oui" />
              </tbody>
            </table>
          </div>

          <Callout type="info">
            <strong>Lecture du tableau :</strong> chaque outil gagne logiquement sur son périmètre coeur.
            RestauMargin domine sur la gestion opérationnelle (8/8 critères OUI vs 0/8 pour Zenchef).
            Zenchef domine sur l'acquisition client (8/10 critères OUI vs 1/10 pour RestauMargin).
            Les deux sont matures sur la plateforme et le support. Conclusion : combinaison naturelle.
          </Callout>
        </section>

        {/* ═════════════ SECTION 5 : Cas d'usage ═════════════ */}
        <section id="cas-usage" className="mb-16">
          <SectionHeading icon={<Users className="w-6 h-6" />} number="5">
            Cas d'usage : qui choisir ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              Plutôt qu'un verdict unique, voici 4 profils types de
              restaurants. Identifiez le profil le plus proche du vôtre.
            </p>
          </div>

          <div className="grid gap-6 mt-8">
            <ScenarioCard
              badge="Profil 1"
              title="Restaurant traditionnel volume moyen (40 à 100 couverts/jour)"
              recommendation="RestauMargin uniquement"
              recoColor="emerald"
              desc="Vous gérez vos réservations par téléphone ou via Google Reservations gratuit. Votre vrai problème : le food cost qui dérive avec l'inflation et l'inability à savoir exactement quel plat de votre carte est rentable. RestauMargin (29 EUR/mois) résout ce problème avec fiches techniques, food cost en temps réel, mercuriale fournisseurs et IA. Pas besoin de payer Zenchef. Économie annuelle vs Zenchef Start : 720 EUR."
            />
            <ScenarioCard
              badge="Profil 2"
              title="Restaurant gastronomique avec forte demande réservations"
              recommendation="Zenchef + RestauMargin combiné"
              recoColor="blue"
              desc="Votre activité dépend des réservations (souvent 80 % du CA, listes d'attente récurrentes). Vous avez besoin de Zenchef pour piloter cette partie, plus le site web restaurant et les campagnes marketing. Mais vous voulez aussi maîtriser vos marges sur des produits nobles (volaille fermière, foie gras, vins). Ajoutez RestauMargin Pro (29 EUR/mois) en parallèle : les deux outils se complémentent parfaitement sans intégration nécessaire. Total : 118 à 218 EUR/mois selon les formules."
            />
            <ScenarioCard
              badge="Profil 3"
              title="Brasserie multi-services (volume élevé, marges serrées)"
              recommendation="Combiner les deux outils"
              recoColor="purple"
              desc="Brasserie avec service midi + soir, formules + carte, vente sur place + livraison. Vous gérez 200+ couverts/jour avec un food cost cible 28-30 %. Vous avez besoin de Zenchef pour la réservation à tables nombreuses + marketing volume, et RestauMargin pour piloter précisément chaque plat de la carte (souvent 30 à 50 références). C'est typiquement le profil où la combinaison est la plus rentable : 118 EUR/mois pour un outil 100 % couvert."
            />
            <ScenarioCard
              badge="Profil 4"
              title="Bistrot indépendant (jeune entreprise, budget serré)"
              recommendation="RestauMargin uniquement"
              recoColor="emerald"
              desc="Vous démarrez votre bistrot de quartier avec un budget logiciel maîtrisé (max 50 EUR/mois). La priorité absolue est la rentabilité par plat (food cost réel), car une dérive de 2 à 3 points peut vous mettre en perte. Les réservations sont gérées par téléphone et Google. RestauMargin Pro (29 EUR/mois) est dimensionné parfaitement. Si vous grossissez, vous ajouterez Zenchef plus tard. Bon plan : utilisez TheFork gratuit en parallèle pour capter les réservations en ligne sans payer."
            />
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Combiner les deux ═════════════ */}
        <section id="combiner" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="6">
            Combiner les deux outils ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              <strong>Oui, c'est la configuration la plus puissante.</strong> RestauMargin gère votre
              back-office opérationnel (food cost, fiches techniques, marges, fournisseurs, IA), Zenchef
              gère votre front-office digital (réservations, marketing, site web, avis). Aucune intégration
              native n'existe entre les deux, mais ils n'ont pas besoin d'échanger de données pour coexister.
            </p>
            <p>
              Concrètement, voici comment se passe le quotidien d'un restaurant qui combine les deux outils :
            </p>
            <ul className="my-4 space-y-2 text-mono-350 list-disc list-inside">
              <li><strong>Matin :</strong> consultation des réservations du jour dans Zenchef, préparation des couverts</li>
              <li><strong>Avant service :</strong> vérification du food cost de la carte dans RestauMargin, ajustement éventuel</li>
              <li><strong>Réception fournisseur :</strong> scan OCR de la facture dans RestauMargin, mise à jour mercuriale automatique</li>
              <li><strong>Service :</strong> Zenchef envoie les SMS de rappel aux clients, plan de salle visible côté bar</li>
              <li><strong>Après service :</strong> RestauMargin calcule la marge brute réelle de la soirée</li>
              <li><strong>Hebdomadaire :</strong> Zenchef envoie la newsletter clients, RestauMargin alerte sur les dérives</li>
            </ul>
            <p>
              Le combo RestauMargin Pro + Zenchef Start coûte 118 EUR/mois, soit 1 416 EUR/an. C'est moins
              cher qu'une formule Zenchef Plus seule (1 668 EUR/an) tout en couvrant un périmètre largement
              plus complet. C'est pour cette raison qu'il est souvent plus pertinent de ne pas
              "choisir entre les deux" et d'adopter la combinaison.
            </p>
          </div>

          <Callout type="info">
            <strong>À retenir :</strong> RestauMargin et Zenchef ne se chevauchent sur aucune fonctionnalité
            coeur : l'un pilote les marges, l'autre les réservations. Les utiliser ensemble n'entraîne aucun
            doublon de données.
          </Callout>
        </section>

        {/* ═════════════ SECTION 7 : Pricing 12 mois ═════════════ */}
        <section id="pricing-12m" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="7">
            Pricing détaillé sur 12 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici le détail complet des cinq formules disponibles entre les deux outils, avec le coût total
              annuel et les économies potentielles selon les configurations.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-mono-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-950 text-mono-100">
                  <th className="text-left py-4 px-4 font-bold">Formule</th>
                  <th className="text-right py-4 px-4 font-bold">Mensuel</th>
                  <th className="text-right py-4 px-4 font-bold">Annuel</th>
                  <th className="text-right py-4 px-4 font-bold">Inclus</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-emerald-50 border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-emerald-900">RestauMargin Pro</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">29 EUR</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">348 EUR</td>
                  <td className="py-3 px-4 text-right text-emerald-700 text-xs">1 restaurant, IA, OCR</td>
                </tr>
                <tr className="bg-emerald-50/40 border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-emerald-900">RestauMargin Business</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">79 EUR</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">948 EUR</td>
                  <td className="py-3 px-4 text-right text-emerald-700 text-xs">Multi-resto, API, support prio</td>
                </tr>
                <tr className="bg-white border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-mono-100">Zenchef Start</td>
                  <td className="py-3 px-4 text-right">89 EUR</td>
                  <td className="py-3 px-4 text-right">1 068 EUR</td>
                  <td className="py-3 px-4 text-right text-mono-500 text-xs">Réservations, site web</td>
                </tr>
                <tr className="bg-mono-1000 border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-mono-100">Zenchef Plus</td>
                  <td className="py-3 px-4 text-right">139 EUR</td>
                  <td className="py-3 px-4 text-right">1 668 EUR</td>
                  <td className="py-3 px-4 text-right text-mono-500 text-xs">+ Marketing email/SMS</td>
                </tr>
                <tr className="bg-white border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-mono-100">Zenchef Premium</td>
                  <td className="py-3 px-4 text-right">189 EUR</td>
                  <td className="py-3 px-4 text-right">2 268 EUR</td>
                  <td className="py-3 px-4 text-right text-mono-500 text-xs">+ Fidélité, multi-site</td>
                </tr>
                <tr className="bg-teal-50 border-t-2 border-teal-200">
                  <td className="py-3 px-4 font-bold text-teal-900">Combo RM Pro + Zenchef Start</td>
                  <td className="py-3 px-4 text-right font-bold text-teal-900">118 EUR</td>
                  <td className="py-3 px-4 text-right font-bold text-teal-900">1 416 EUR</td>
                  <td className="py-3 px-4 text-right text-teal-700 text-xs">Tout-en-un best value</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Lecture rapide :</strong> si vous prenez le combo RestauMargin Pro + Zenchef Start
              (1 416 EUR/an), vous couvrez 100 % des besoins back-office (food cost, marges, mercuriale) et
              95 % des besoins front-office (réservations, site web). Pour un coût inférieur à Zenchef Plus
              seul (1 668 EUR/an), qui ne couvre que 50 % des besoins (acquisition uniquement, zéro
              opérations).
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 8 : Verdict final par profil ═════════════ */}
        <section id="verdict-final" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="8">
            Verdict final par profil restaurateur
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la recommandation finale, par profil restaurateur, basée sur l'intégralité du benchmark
              présenté plus haut. Si plusieurs profils correspondent, prenez celui qui est le plus dominant
              dans votre activité.
            </p>
          </div>

          <div className="grid gap-4 mt-8">
            <VerdictCard
              profile="Restaurant traditionnel (volume moyen 40-100 couverts/jour)"
              winner="RestauMargin"
              winnerColor="emerald"
              reasoning="Priorité rentabilité + budget serré. RestauMargin Pro (29 EUR) couvre les besoins critiques. Réservations via Google/TheFork gratuit. Zenchef = surdimensionné."
            />
            <VerdictCard
              profile="Restaurant gastronomique avec forte demande réservations"
              winner="Combinaison RestauMargin + Zenchef"
              winnerColor="teal"
              reasoning="Réservations essentielles (Zenchef) + maîtrise marges sur produits nobles (RestauMargin). Combo Pro + Premium à 218 EUR/mois optimal."
            />
            <VerdictCard
              profile="Brasserie multi-services (200+ couverts/jour)"
              winner="Combinaison RestauMargin + Zenchef"
              winnerColor="teal"
              reasoning="Volume élevé nécessite Zenchef pour plan de salle + réservations groupes. RestauMargin obligatoire pour piloter 30-50 plats au quotidien."
            />
            <VerdictCard
              profile="Bistrot indépendant (jeune entreprise)"
              winner="RestauMargin"
              winnerColor="emerald"
              reasoning="Budget logiciel max 50 EUR/mois. Food cost prioritaire absolu. Zenchef = trop cher au démarrage. Ajout possible plus tard si vous grossissez."
            />
            <VerdictCard
              profile="Groupe de 3 à 10 restaurants"
              winner="Combinaison RestauMargin Business + Zenchef Premium"
              winnerColor="teal"
              reasoning="Vue consolidée marges (RM Business 79 EUR) + gestion centralisée réservations multi-site (Zenchef Premium 189 EUR). Total 268 EUR/mois imbattable à cette échelle."
            />
          </div>
        </section>

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <SectionHeading icon={<HelpCircle className="w-6 h-6" />} number="9">
            FAQ 12 questions
          </SectionHeading>

          <div className="space-y-4 mt-8">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-27" readTime="14 min" variant="footer" />

        {/* ═════════════ SECTION CTA ═════════════ */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Testez RestauMargin gratuitement pendant 7 jours
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              La meilleure façon de savoir si RestauMargin convient à votre restaurant, c'est de l'essayer.
              Sans carte bancaire, sans engagement. Vous pouvez combiner avec Zenchef si besoin.
            </p>
            <p className="text-teal-50 text-base max-w-xl mx-auto mb-8">
              <strong>29 EUR/mois</strong> à partir du 8e jour si vous décidez de continuer. Annulation en un clic.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login?mode=register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 font-bold rounded-full hover:bg-teal-50 transition-colors text-lg shadow-lg"
              >
                Essai gratuit 7 jours
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/alternative-zenchef"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                Lire l'analyse Alternative Zenchef
              </Link>
            </div>
          </div>
        </section>

        {/* ═════════════ Articles complementaires ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/alternative-zenchef" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Alternative Zenchef</h3>
              <p className="text-xs text-mono-500">Analyse approfondie de RestauMargin en alternative à Zenchef.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calcul de marge restaurant</h3>
              <p className="text-xs text-mono-500">Guide complet : food cost, formules et benchmarks par type d'établissement.</p>
            </Link>
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Réduire son food cost</h3>
              <p className="text-xs text-mono-500">Méthode pas à pas pour réduire le food cost de 2 à 4 points.</p>
            </Link>
            <Link to="/pricing" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Tarifs RestauMargin</h3>
              <p className="text-xs text-mono-500">Formules Pro et Business, comparaison détaillée.</p>
            </Link>
            <Link to="/comparatif-logiciels-restaurant" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Comparatif 12 logiciels restaurant</h3>
              <p className="text-xs text-mono-500">Mega-comparatif des principaux outils du marché français 2026.</p>
            </Link>
            <Link to="/login?mode=register" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Créer mon compte</h3>
              <p className="text-xs text-mono-500">Essai gratuit 7 jours, sans carte bancaire.</p>
            </Link>
          </div>
        </section>

        </article>

      </main>

      {/* ── Footer ── */}
      <PublicFooter />
    </div>
  );
}

/* ═══════════════ Sous-composants ═══════════════ */

function SectionHeading({ icon, number, children }: { icon: React.ReactNode; number: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-mono-100">
        <span className="text-teal-600 mr-2">{number}.</span>
        {children}
      </h2>
    </div>
  );
}

function BadgeR() {
  return (
    <div className="w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">R</div>
  );
}

function BadgeZ() {
  return (
    <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">Z</div>
  );
}

function CategoryRow({ label }: { label: string }) {
  return (
    <tr className="bg-mono-1000 border-t border-mono-900">
      <td colSpan={3} className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-mono-500">
        {label}
      </td>
    </tr>
  );
}

function ComparisonRow({
  label,
  rm,
  rmText,
  zc,
  zcText,
}: {
  label: string;
  rm: 'oui' | 'non' | 'partiel';
  rmText?: string;
  zc: 'oui' | 'non' | 'partiel';
  zcText?: string;
}) {
  const renderCell = (val: 'oui' | 'non' | 'partiel', text?: string) => {
    if (val === 'oui') {
      return (
        <div className="flex flex-col items-center gap-0.5">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          {text && <span className="text-[11px] text-emerald-700 font-medium">{text}</span>}
        </div>
      );
    }
    if (val === 'partiel') {
      return (
        <div className="flex flex-col items-center gap-0.5">
          <Minus className="w-5 h-5 text-amber-600" />
          {text && <span className="text-[11px] text-amber-700 font-medium">{text}</span>}
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center gap-0.5">
        <XCircle className="w-5 h-5 text-mono-700" />
        {text && <span className="text-[11px] text-mono-500">{text}</span>}
      </div>
    );
  };

  return (
    <tr className="border-t border-mono-900 hover:bg-mono-1000/50 transition-colors">
      <td className="py-3.5 px-4 text-mono-100 font-medium">{label}</td>
      <td className={`py-3.5 px-4 text-center ${rm === 'oui' && zc !== 'oui' ? 'bg-emerald-50/50' : ''}`}>
        {renderCell(rm, rmText)}
      </td>
      <td className={`py-3.5 px-4 text-center ${zc === 'oui' && rm !== 'oui' ? 'bg-violet-50/50' : ''}`}>
        {renderCell(zc, zcText)}
      </td>
    </tr>
  );
}

function VerdictRow({ label, rm, zc, winner }: { label: string; rm: string; zc: string; winner: 'rm' | 'zc' | 'tie' }) {
  return (
    <tr className="border-t border-mono-900 hover:bg-mono-1000/50 transition-colors">
      <td className="py-3.5 px-4 text-mono-100 font-medium">{label}</td>
      <td className={`py-3.5 px-4 text-center text-sm ${winner === 'rm' ? 'bg-emerald-50 font-bold text-emerald-900' : 'text-mono-400'}`}>
        {rm}
      </td>
      <td className={`py-3.5 px-4 text-center text-sm ${winner === 'zc' ? 'bg-violet-50 font-bold text-violet-900' : 'text-mono-400'}`}>
        {zc}
      </td>
    </tr>
  );
}

function PositioningCard({
  badge,
  name,
  tagline,
  founded,
  users,
  focus,
  missing,
  color,
}: {
  badge: React.ReactNode;
  name: string;
  tagline: string;
  founded: string;
  users: string;
  focus: string;
  missing: string;
  color: 'emerald' | 'violet';
}) {
  const colors = {
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', sub: 'text-emerald-700' },
    violet: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-900', sub: 'text-violet-700' },
  };
  const c = colors[color];

  return (
    <div className={`${c.bg} border ${c.border} rounded-3xl p-6`}>
      <div className="flex items-center gap-2 mb-3">
        {badge}
        <h3 className={`font-bold text-xl ${c.text}`}>{name}</h3>
      </div>
      <p className={`text-sm italic ${c.sub} mb-4`}>"{tagline}"</p>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between border-b border-white/40 pb-1.5">
          <span className={c.sub}>Fondé en</span>
          <span className={`font-semibold ${c.text}`}>{founded}</span>
        </div>
        <div className="flex justify-between border-b border-white/40 pb-1.5">
          <span className={c.sub}>Utilisateurs</span>
          <span className={`font-semibold ${c.text}`}>{users}</span>
        </div>
        <div className="border-b border-white/40 pb-1.5">
          <div className={`${c.sub} mb-1`}>Focus produit</div>
          <div className={`font-semibold ${c.text} text-sm`}>{focus}</div>
        </div>
        <div className="pt-1">
          <div className={`${c.sub} mb-1`}>Pas couvert</div>
          <div className={`text-sm ${c.text} opacity-80`}>{missing}</div>
        </div>
      </div>
    </div>
  );
}

function ScenarioCard({
  badge,
  title,
  recommendation,
  recoColor,
  desc,
}: {
  badge: string;
  title: string;
  recommendation: string;
  recoColor: 'emerald' | 'blue' | 'purple';
  desc: string;
}) {
  const colors = {
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', badge: 'bg-emerald-600' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', badge: 'bg-blue-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', badge: 'bg-purple-600' },
  };
  const c = colors[recoColor];

  return (
    <div className={`${c.bg} border ${c.border} rounded-3xl p-6 sm:p-8`}>
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className={`${c.badge} text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full`}>
          {badge}
        </span>
        <span className={`${c.text} text-xs font-semibold flex items-center gap-1.5`}>
          <Target className="w-3.5 h-3.5" />
          Reco : {recommendation}
        </span>
      </div>
      <h3 className={`font-bold text-lg ${c.text} mb-3`}>{title}</h3>
      <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function VerdictCard({
  profile,
  winner,
  winnerColor,
  reasoning,
}: {
  profile: string;
  winner: string;
  winnerColor: 'emerald' | 'teal' | 'violet';
  reasoning: string;
}) {
  const colors = {
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', sub: 'text-emerald-700' },
    teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-900', sub: 'text-teal-700' },
    violet: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-900', sub: 'text-violet-700' },
  };
  const c = colors[winnerColor];

  return (
    <div className={`${c.bg} border ${c.border} rounded-2xl p-5 flex gap-4 items-start`}>
      <Trophy className={`w-6 h-6 ${c.sub} shrink-0 mt-0.5`} />
      <div className="flex-1">
        <div className="text-xs font-semibold text-mono-400 uppercase tracking-wider mb-1">Profil</div>
        <h3 className={`font-bold text-base ${c.text} mb-2`}>{profile}</h3>
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${c.bg} border ${c.border} ${c.text} mb-2`}>
          Reco : {winner}
        </div>
        <p className="text-sm text-mono-400 leading-relaxed">{reasoning}</p>
      </div>
    </div>
  );
}

function Callout({ type, children }: { type: 'info' | 'warning'; children: React.ReactNode }) {
  const styles = type === 'info'
    ? 'bg-blue-50 border-blue-200 text-blue-800'
    : 'bg-amber-50 border-amber-200 text-amber-800';
  const Icon = type === 'info' ? Lightbulb : AlertTriangle;
  return (
    <div className={`${styles} border rounded-xl p-5 my-6 flex gap-3 text-sm leading-relaxed`}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="bg-mono-1000 border border-mono-900 rounded-2xl group">
      <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors">
        {q}
        <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform" />
      </summary>
      <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{a}</p>
    </details>
  );
}
