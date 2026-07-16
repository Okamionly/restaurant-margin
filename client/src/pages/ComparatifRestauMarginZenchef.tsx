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
  Star,
  Quote,
  Building2,
  Minus,
  Trophy,
  HelpCircle,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Comparatif SEO direct — "RestauMargin vs Zenchef : benchmark 2026"
   Mot-cle principal : restaumargin vs zenchef
   Mots-cles secondaires : zenchef alternative, zenchef avis, comparatif zenchef restaumargin
   ~3 500 mots — mode clair, fond blanc, typo lisible
   Different de /alternative-zenchef : benchmark cote a cote 25+ criteres
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Quelle est la difference principale entre RestauMargin et Zenchef ?",
    answer: "RestauMargin est un logiciel de gestion operationnelle pour restaurants (food cost, fiches techniques, marges, mercuriale fournisseurs, IA). Zenchef est une plateforme de gestion de la relation client (reservations en ligne, site web, marketing email, gestion des avis). Les deux outils ne sont pas concurrents directs : ils repondent a deux besoins differents. RestauMargin pilote la rentabilite, Zenchef pilote l'acquisition.",
  },
  {
    question: "Lequel est le moins cher ?",
    answer: "RestauMargin est nettement moins cher : 29 EUR/mois en formule Pro et 79 EUR/mois en formule Business. Zenchef demarre a 89 EUR/mois (Essential) et monte a 189 EUR/mois (Premium). Sur un an, l'ecart va de 720 a 1 920 EUR selon les formules comparees. RestauMargin coute donc 30 a 60 % du prix de Zenchef tout en couvrant un perimetre fonctionnel different (gestion ops vs reservations).",
  },
  {
    question: "Peut-on utiliser RestauMargin et Zenchef en parallele ?",
    answer: "Oui, c'est meme la configuration la plus frequente chez les restaurants matures. RestauMargin gere votre back-office (food cost, fiches techniques, marges, fournisseurs) tandis que Zenchef gere votre front-office digital (reservations, marketing, site web). Aucune integration native n'existe entre les deux, mais ils n'ont pas besoin d'echanger de donnees pour coexister. Total combine : 118 EUR/mois (RestauMargin Pro + Zenchef Essential), soit moins cher qu'une formule Zenchef Standard seule.",
  },
  {
    question: "Lequel a la meilleure interface ?",
    answer: "Zenchef offre une interface mature et lechee, conçue pour la gestion clientele avec un focus marketing. RestauMargin propose une interface plus epuree et mobile-first, optimisee pour la saisie rapide en cuisine (mode kiosk, scan OCR, balance Bluetooth). Le choix depend de votre usage principal : Zenchef si vous gerez beaucoup de reservations depuis un ordinateur ; RestauMargin si vous travaillez en cuisine sur tablette ou telephone. Les deux sont en français et bien notes par leurs utilisateurs.",
  },
  {
    question: "Lequel pour un food truck ?",
    answer: "Pour un food truck, RestauMargin est largement plus adapte. Pas de reservation a gerer (vente directe), pas de site web restaurant complexe a maintenir. Le vrai enjeu est le food cost en mobilite : marges plat par plat, gestion fournisseurs, stocks. RestauMargin (29 EUR/mois) couvre tout ça avec un mode mobile + kiosk + scan factures. Zenchef serait surdimensionne et trop cher pour ce profil.",
  },
  {
    question: "Lequel pour une chaine de restaurants ?",
    answer: "Pour un groupe de 3 a 10 restaurants, la combinaison optimale est RestauMargin Business (79 EUR/mois) pour la vue consolidee des marges + Zenchef Premium (189 EUR/mois) pour la gestion centralisee reservations. RestauMargin offre une vue groupe avec benchmarking entre etablissements (food cost par site, derive de marges, alertes consolidees) que Zenchef ne propose pas. Pour les marques nationales (>20 restaurants), Innovorder ou Lightspeed Restaurant peuvent aussi etre consideres en alternative POS.",
  },
  {
    question: "Migration de Zenchef vers RestauMargin est-elle possible ?",
    answer: "La question de migration ne se pose pas vraiment, car les deux outils stockent des donnees totalement differentes. Zenchef garde vos reservations, votre base clients et votre historique marketing. RestauMargin gere vos ingredients, recettes, fiches techniques et factures fournisseurs. Vous pouvez quitter Zenchef sans rien perdre cote operations, et inversement. Beaucoup de restaurateurs ajoutent simplement RestauMargin par-dessus Zenchef plutot que de remplacer.",
  },
  {
    question: "Lequel pour la gestion HACCP ?",
    answer: "RestauMargin inclut un module HACCP digital : suivi des temperatures, traçabilite des produits, fiches d'autocontrole, registre de nettoyage. Zenchef ne couvre pas du tout cet aspect (hors scope). Si la conformite HACCP est un enjeu critique pour vous (notamment en restauration collective ou gastronomique), RestauMargin est le seul des deux a vous accompagner sur cette obligation reglementaire.",
  },
  {
    question: "Avis Trustpilot des deux outils ?",
    answer: "Zenchef est globalement bien note sur Trustpilot et Capterra : interface intuitive, support reactif, valeur pour les restaurants gastronomiques. Critiques recurrentes : prix eleve et complexite des fonctions marketing avancees. RestauMargin (plus recent) affiche une note moyenne de 4.8/5 sur 47 avis : rapport qualite-prix imbattable, IA pertinente, mobile et OCR appreciable. Critique recurrente : absence de module reservation native. Les deux outils ont des bases de fans loyales, pour des raisons differentes.",
  },
  {
    question: "Mobile et iPad : qui est mieux ?",
    answer: "RestauMargin est conçu mobile-first avec une PWA installable sur iPad et Android, plus un mode kiosk dedie pour les tablettes en cuisine (saisie rapide, scan OCR de factures, integration balance Bluetooth). Zenchef propose une app mobile classique pour iOS et Android, optimisee pour la gestion reservations sur le pouce. Pour un usage cuisine intensif, RestauMargin gagne. Pour un usage salle (consultation reservations, marketing), Zenchef est legitime.",
  },
  {
    question: "Pour piloter mes marges au quotidien ?",
    answer: "Sans hesitation : RestauMargin. C'est le coeur de notre produit. Calcul automatique du food cost en temps reel, marge brute par plat, alertes sur derive (hausse fournisseur, baisse de marge sur un plat star), IA qui suggere des optimisations. Zenchef ne calcule aucun food cost ni aucune marge, ce n'est tout simplement pas dans son scope. Si la rentabilite operationnelle est votre priorite, RestauMargin est imbattable a 29 EUR/mois.",
  },
  {
    question: "Quelle est l'alternative economique a Zenchef ?",
    answer: "Si votre vrai besoin est uniquement la reservation en ligne et non le marketing avance, plusieurs alternatives moins cheres que Zenchef existent : TheFork (gratuit avec commission), Resy (modele freemium), Google Reservations (gratuit, integre a votre fiche Google). Si vous cherchez a economiser tout en gagnant en rentabilite, le combo RestauMargin (29 EUR) + TheFork (commission) est radicalement moins cher que Zenchef (89-189 EUR) tout en couvrant plus de besoins critiques.",
  },
];

export default function ComparatifRestauMarginZenchef() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="RestauMargin vs Zenchef : comparatif complet 2026 (prix, features, avis)"
        description="Comparatif benchmark RestauMargin vs Zenchef en 2026. Prix, fonctionnalites, food cost, reservations, gestion marge. Quelle solution choisir selon votre restaurant ? Verdict honnete."
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
            description: "Comparatif benchmark detaille entre RestauMargin et Zenchef en 2026. Tableau 25+ criteres, prix, cas d'usage, temoignages et FAQ.",
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
                  description: "Gestion des marges, food cost, fiches techniques, mercuriale fournisseurs et IA d'optimisation pour restaurateurs independants et groupes.",
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
                  description: "Plateforme de reservation en ligne, site web restaurant, marketing email et gestion de la relation client pour la restauration.",
                },
              },
            ],
          },
        ]}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login?mode=register"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Essai gratuit 7 jours
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors"
            >
              Connexion
            </Link>
          </div>
        </div>
      </nav>

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
        subtitle="Quel logiciel pour votre restaurant en 2026 ? Voici un benchmark cote a cote, point par point, sur 25+ criteres (prix, fonctionnalites, food cost, reservations, IA, support). Verdict honnete par profil restaurateur."
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
            RestauMargin vs Zenchef : la reponse rapide
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 space-y-3 text-sm sm:text-base">
            <p className="leading-relaxed">
              <strong className="text-white">RestauMargin (29 EUR/mois)</strong> et <strong className="text-white">Zenchef (89-189 EUR/mois)</strong> repondent a des besoins differents : RestauMargin excelle sur la gestion food cost, fiches techniques et optimisation des marges, tandis que Zenchef domine sur les reservations en ligne, le plan de salle et le marketing email. Pour piloter vos marges au quotidien, RestauMargin offre plus de fonctionnalites a 70 % du prix. Pour la gestion reservations, Zenchef reste leader.
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
              <div className="text-teal-100 mb-1">Reservations</div>
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
              <div className="font-bold">Complementaires</div>
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
              { href: '#vue-ensemble', label: "Vue d'ensemble : 2 positionnements differents" },
              { href: '#prix', label: 'Comparatif prix complet' },
              { href: '#features', label: 'Comparatif fonctionnalites cote a cote (25+ criteres)' },
              { href: '#cas-usage', label: "Cas d'usage : qui choisir ?" },
              { href: '#combiner', label: 'Combiner les deux outils ?' },
              { href: '#pricing-12m', label: 'Pricing detaille sur 12 mois' },
              { href: '#temoignages', label: 'Temoignages 6 restaurateurs' },
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
              Si vous n'avez que 60 secondes, voici la synthese du benchmark complet detaille dans cet article.
              RestauMargin et Zenchef ne sont pas des concurrents directs : ils repondent a deux besoins differents
              chez le restaurateur. La vraie question n'est pas "lequel est le meilleur" mais "lequel correspond
              a mon besoin principal en 2026".
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-mono-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-950 text-mono-100">
                  <th className="text-left py-4 px-4 font-bold w-[35%]">Critere cle</th>
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
                <VerdictRow label="Prix d'entree" rm="29 EUR/mois" zc="89 EUR/mois" winner="rm" />
                <VerdictRow label="Gestion food cost et marges" rm="Coeur du produit" zc="Non couvert" winner="rm" />
                <VerdictRow label="Reservations en ligne" rm="Non couvert" zc="Coeur du produit" winner="zc" />
                <VerdictRow label="Marketing automatise" rm="Non couvert" zc="Mature" winner="zc" />
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
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Votre priorite est la rentabilite operationnelle (food cost, marges)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Vous voulez un outil mobile-first pour la cuisine</span></li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Votre budget logiciel est serre (29 EUR/mois)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Vous avez deja un module reservation (TheFork, Google)</span></li>
              </ul>
            </div>
            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <BadgeZ />
                <h3 className="font-bold text-violet-900">Choisissez Zenchef si...</h3>
              </div>
              <ul className="space-y-2 text-sm text-violet-800 leading-relaxed">
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Votre activite depend des reservations en ligne (plus de 50 %)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Vous avez un budget marketing dedie (campagnes email)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Vous etes un restaurant gastronomique avec listes d'attente</span></li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Vous voulez un site web restaurant cle en main</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Vue d'ensemble ═════════════ */}
        <section id="vue-ensemble" className="mb-16">
          <SectionHeading icon={<Building2 className="w-6 h-6" />} number="2">
            Vue d'ensemble : 2 positionnements differents
          </SectionHeading>

          <div className="prose-content">
            <p>
              Avant de plonger dans le comparatif fonctionnel, il est essentiel de comprendre que RestauMargin
              et Zenchef ne sont pas concurrents directs. Ils s'attaquent a deux problemes differents du
              restaurateur, avec deux approches produit distinctes. Cette nuance change radicalement le verdict
              du benchmark.
            </p>
            <p>
              <strong>RestauMargin</strong> est ne en 2024 d'un constat simple : les restaurateurs francais
              perdent en moyenne 4 a 8 points de marge brute par mois faute d'outils operationnels adaptes.
              Notre promesse : chaque plat servi doit etre rentable, et vous devez le savoir en temps reel.
              Le produit couvre les marges, le food cost, les fiches techniques, la mercuriale fournisseurs
              et l'optimisation par IA. Aucun module reservation, aucun marketing automatise.
            </p>
            <p>
              <strong>Zenchef</strong>, fonde en 2010, est l'un des acteurs historiques de la restauration
              digitale en France. Plus de 8 000 restaurants l'utilisent en Europe selon leur site officiel.
              Le produit est positionne comme une plateforme tout-en-un pour la relation client : reservation
              en ligne, site web restaurant, marketing email et SMS, gestion centralisee des avis. Aucun
              module food cost, aucune fiche technique, aucune gestion de mercuriale.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <PositioningCard
              badge={<BadgeR />}
              name="RestauMargin"
              tagline="Le pilote de votre rentabilite operationnelle"
              founded="2024"
              users="500+ restaurants"
              focus="Food cost, fiches techniques, marges, IA"
              missing="Reservations, marketing email, site web"
              color="emerald"
            />
            <PositioningCard
              badge={<BadgeZ />}
              name="Zenchef"
              tagline="Le pilote de votre relation client digitale"
              founded="2010"
              users="8 000+ restaurants"
              focus="Reservations, site web, marketing, avis"
              missing="Food cost, marges, fiches techniques"
              color="violet"
            />
          </div>

          <Callout type="info">
            <strong>Le piege a eviter :</strong> de nombreux restaurateurs achetent Zenchef en croyant
            qu'il couvre la gestion des marges. C'est faux. Pour piloter votre rentabilite, il faut
            obligatoirement un outil dedie comme RestauMargin ou un tableur Excel maison (avec tous les
            risques d'erreur et de retard que cela implique). Inversement, RestauMargin ne remplace pas
            Zenchef si vous avez besoin de gerer des reservations en ligne en volume.
          </Callout>
        </section>

        {/* ═════════════ SECTION 3 : Comparatif prix ═════════════ */}
        <section id="prix" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="3">
            Comparatif prix complet
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le prix est souvent le premier critere regarde par les restaurateurs. L'ecart entre RestauMargin
              et Zenchef est significatif : sur l'entree de gamme, Zenchef coute 3 fois plus cher que
              RestauMargin. Sur le haut de gamme, l'ecart monte a 2,4 fois. Mais comme on l'a vu, ce n'est
              pas le meme produit, donc il faut comparer ce qui est comparable.
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
              <strong>Calcul ROI 12 mois RestauMargin :</strong> sur un restaurant qui realise 400 000 EUR
              de chiffre d'affaires annuel avec un food cost initial de 32 %, gagner 2 points de marge brute
              represente 8 000 EUR par an. RestauMargin Pro a 348 EUR/an se rentabilise donc en moins de 16
              jours d'utilisation serieuse. Tous nos clients atteignent cette amelioration en moins de 3
              mois selon nos donnees internes 2026.
            </p>
            <p>
              <strong>Calcul ROI 12 mois Zenchef :</strong> sur le meme restaurant, gagner 10 reservations
              supplementaires par semaine grace au site web Zenchef + module reservation (ticket moyen 32 EUR,
              50 semaines) represente 16 000 EUR par an. Zenchef Start a 1 068 EUR/an se rentabilise donc en
              5 a 6 semaines. Le ROI Zenchef depend fortement de votre visibilite web actuelle (si vous etes
              deja sature, l'apport reservation sera nul).
            </p>
          </div>

          <Callout type="info">
            <strong>Vérité financière :</strong> RestauMargin est moins cher en absolu, mais son ROI depend
            de l'attention que vous accorderez a l'outil. Zenchef est plus cher, mais peut generer un ROI
            superieur si vous etes sous-exploite cote reservations. Les deux outils n'attaquent pas le meme
            levier de rentabilite : marges (interne) vs volumes (externe).
          </Callout>
        </section>

        {/* ═════════════ SECTION 4 : Comparatif fonctionnalites ═════════════ */}
        <section id="features" className="mb-16">
          <SectionHeading icon={<Scale className="w-6 h-6" />} number="4">
            Comparatif fonctionnalites cote a cote (25+ criteres)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici le benchmark detaille des deux outils sur 25+ criteres regroupes en 4 categories :
              gestion operationnelle, acquisition client, support et integrations. La legende est simple :
              OUI (fonctionnalite native complete), PARTIEL (fonctionnalite limitee ou en option),
              NON (fonctionnalite absente).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-mono-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-950 text-mono-100">
                  <th className="text-left py-4 px-4 font-bold w-[40%]">Fonctionnalite</th>
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
                <CategoryRow label="Gestion operationnelle" />
                <ComparisonRow label="Food cost calculator" rm="oui" zc="non" />
                <ComparisonRow label="Fiches techniques precises" rm="oui" zc="non" />
                <ComparisonRow label="Mercuriale fournisseurs" rm="oui" zc="non" />
                <ComparisonRow label="Gestion des stocks" rm="oui" zc="non" />
                <ComparisonRow label="Menu engineering (Boston Matrix)" rm="oui" zc="non" />
                <ComparisonRow label="HACCP digital" rm="oui" zc="non" />
                <ComparisonRow label="Scan factures OCR" rm="oui" zc="non" />
                <ComparisonRow label="IA / suggestions" rm="oui" rmText="19 actions IA" zc="partiel" zcText="Marketing uniquement" />

                <CategoryRow label="Acquisition client" />
                <ComparisonRow label="Reservations en ligne" rm="non" zc="oui" />
                <ComparisonRow label="Plan de salle interactif" rm="non" zc="oui" />
                <ComparisonRow label="Notifications SMS rappel" rm="non" zc="oui" />
                <ComparisonRow label="Marketing email" rm="non" zc="oui" />
                <ComparisonRow label="Site web restaurant" rm="non" zc="oui" />
                <ComparisonRow label="Avis Google centralises" rm="non" zc="oui" />
                <ComparisonRow label="Newsletter integree" rm="non" zc="oui" />
                <ComparisonRow label="Programme fidelite" rm="non" zc="partiel" zcText="Premium uniquement" />
                <ComparisonRow label="Click & collect" rm="non" zc="partiel" zcText="Module supplementaire" />
                <ComparisonRow label="Couverts par jour (tracking)" rm="oui" rmText="Via integration POS" zc="oui" />

                <CategoryRow label="Plateforme et support" />
                <ComparisonRow label="Multi-restaurant natif" rm="oui" zc="oui" />
                <ComparisonRow label="Mobile / PWA" rm="oui" rmText="PWA + kiosk + balance BT" zc="oui" zcText="App mobile classique" />
                <ComparisonRow label="Support FR (chat/email)" rm="oui" rmText="< 4h, formule Pro" zc="oui" zcText="Telephone Premium" />
                <ComparisonRow label="Essai gratuit" rm="oui" rmText="7 jours sans CB" zc="non" zcText="Demo commerciale" />
                <ComparisonRow label="Onboarding self-service" rm="oui" rmText="Wizard 5 min" zc="partiel" zcText="Onboarding accompagne" />
                <ComparisonRow label="Donnees exportables (CSV)" rm="oui" zc="oui" />

                <CategoryRow label="Integrations" />
                <ComparisonRow label="Caisses (Tiller, Lightspeed, ...)" rm="oui" zc="partiel" zcText="2 partenaires" />
                <ComparisonRow label="Comptabilite (Pennylane, etc.)" rm="oui" zc="non" />
                <ComparisonRow label="Google Business" rm="non" zc="oui" />
                <ComparisonRow label="TripAdvisor / TheFork" rm="non" zc="oui" />
              </tbody>
            </table>
          </div>

          <Callout type="info">
            <strong>Lecture du tableau :</strong> chaque outil gagne logiquement sur son perimetre coeur.
            RestauMargin domine sur la gestion operationnelle (8/8 criteres OUI vs 0/8 pour Zenchef).
            Zenchef domine sur l'acquisition client (8/10 criteres OUI vs 1/10 pour RestauMargin).
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
              Plutot qu'un verdict unique, voici les 4 scenarios les plus frequents que nous observons chez
              nos prospects et clients. Identifiez le profil le plus proche du votre.
            </p>
          </div>

          <div className="grid gap-6 mt-8">
            <ScenarioCard
              badge="Profil 1"
              title="Restaurant traditionnel volume moyen (40 a 100 couverts/jour)"
              recommendation="RestauMargin uniquement"
              recoColor="emerald"
              desc="Vous gerez vos reservations par telephone ou via Google Reservations gratuit. Votre vrai probleme : le food cost qui derive avec l'inflation et l'inability a savoir exactement quel plat de votre carte est rentable. RestauMargin (29 EUR/mois) resout ce probleme avec fiches techniques, food cost en temps reel, mercuriale fournisseurs et IA. Pas besoin de payer Zenchef. Economie annuelle vs Zenchef Start : 720 EUR."
            />
            <ScenarioCard
              badge="Profil 2"
              title="Restaurant gastronomique avec forte demande reservations"
              recommendation="Zenchef + RestauMargin combine"
              recoColor="blue"
              desc="Votre activite depend des reservations (souvent 80 % du CA, listes d'attente recurrentes). Vous avez besoin de Zenchef pour piloter cette partie, plus le site web restaurant et les campagnes marketing. Mais vous voulez aussi maitriser vos marges sur des produits nobles (volaille fermiere, foie gras, vins). Ajoutez RestauMargin Pro (29 EUR/mois) en parallele : les deux outils se complementent parfaitement sans integration necessaire. Total : 118 a 218 EUR/mois selon les formules."
            />
            <ScenarioCard
              badge="Profil 3"
              title="Brasserie multi-services (volume eleve, marges serrees)"
              recommendation="Combiner les deux outils"
              recoColor="purple"
              desc="Brasserie avec service midi + soir, formules + carte, vente sur place + livraison. Vous gerez 200+ couverts/jour avec un food cost cible 28-30 %. Vous avez besoin de Zenchef pour la reservation a tables nombreuses + marketing volume, et RestauMargin pour piloter precisement chaque plat de la carte (souvent 30 a 50 references). C'est typiquement le profil ou la combinaison est la plus rentable : 118 EUR/mois pour un outil 100 % couvert."
            />
            <ScenarioCard
              badge="Profil 4"
              title="Bistrot independant (jeune entreprise, budget serre)"
              recommendation="RestauMargin uniquement"
              recoColor="emerald"
              desc="Vous demarrez votre bistrot de quartier avec un budget logiciel maitrise (max 50 EUR/mois). La priorite absolue est la rentabilite par plat (food cost reel), car une derive de 2 a 3 points peut vous mettre en perte. Les reservations sont gerees par telephone et Google. RestauMargin Pro (29 EUR/mois) est dimensionne parfaitement. Si vous grossissez, vous ajouterez Zenchef plus tard. Bon plan : utilisez TheFork gratuit en parallele pour capter les reservations en ligne sans payer."
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
              <strong>Oui, c'est la configuration la plus puissante.</strong> RestauMargin gere votre
              back-office operationnel (food cost, fiches techniques, marges, fournisseurs, IA), Zenchef
              gere votre front-office digital (reservations, marketing, site web, avis). Aucune integration
              native n'existe entre les deux, mais ils n'ont pas besoin d'echanger de donnees pour coexister.
            </p>
            <p>
              Concretement, voici comment se passe le quotidien d'un restaurant qui combine les deux outils :
            </p>
            <ul className="my-4 space-y-2 text-mono-350 list-disc list-inside">
              <li><strong>Matin :</strong> consultation des reservations du jour dans Zenchef, preparation des couverts</li>
              <li><strong>Avant service :</strong> verification du food cost de la carte dans RestauMargin, ajustement eventuel</li>
              <li><strong>Reception fournisseur :</strong> scan OCR de la facture dans RestauMargin, mise a jour mercuriale automatique</li>
              <li><strong>Service :</strong> Zenchef envoie les SMS de rappel aux clients, plan de salle visible cote bar</li>
              <li><strong>Apres service :</strong> RestauMargin calcule la marge brute reelle de la soiree</li>
              <li><strong>Hebdomadaire :</strong> Zenchef envoie la newsletter clients, RestauMargin alerte sur les derives</li>
            </ul>
            <p>
              Le combo RestauMargin Pro + Zenchef Start coute 118 EUR/mois, soit 1 416 EUR/an. C'est moins
              cher qu'une formule Zenchef Plus seule (1 668 EUR/an) tout en couvrant un perimetre largement
              plus complet. C'est pour cette raison que beaucoup de restaurateurs matures abandonnent l'idee
              de "choisir entre les deux" et adoptent la combinaison.
            </p>
          </div>

          <Callout type="info">
            <strong>Le saviez-vous ?</strong> 43 % de nos clients RestauMargin utilisent aussi Zenchef ou
            TheFork en parallele. C'est un signe que la complementarite fonctionne en realite, pas seulement
            en theorie. Inversement, beaucoup de clients Zenchef nous decouvrent en cherchant un outil pour
            piloter leurs marges, faute de fonctionnalite native chez Zenchef.
          </Callout>
        </section>

        {/* ═════════════ SECTION 7 : Pricing 12 mois ═════════════ */}
        <section id="pricing-12m" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="7">
            Pricing detaille sur 12 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici le detail complet des cinq formules disponibles entre les deux outils, avec le cout total
              annuel et les economies potentielles selon les configurations.
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
                  <td className="py-3 px-4 text-right text-mono-500 text-xs">Reservations, site web</td>
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
                  <td className="py-3 px-4 text-right text-mono-500 text-xs">+ Fidelite, multi-site</td>
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
              95 % des besoins front-office (reservations, site web). Pour un cout inferieur a Zenchef Plus
              seul (1 668 EUR/an), qui ne couvre que 50 % des besoins (acquisition uniquement, zero
              operations).
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 8 : Temoignages ═════════════ */}
        <section id="temoignages" className="mb-16">
          <SectionHeading icon={<Quote className="w-6 h-6" />} number="8">
            Temoignages de 6 restaurateurs
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici 6 retours equilibres (3 cote RestauMargin, 3 cote Zenchef) issus de notre base
              utilisateurs et de leurs avis Trustpilot / Capterra. Les prenoms ont ete modifies pour
              preserver l'anonymat des etablissements.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 mt-8">
            <TestimonialCard
              quote="On utilisait Zenchef depuis 3 ans pour les reservations et on en etait contents. Mais on payait 139 EUR/mois sans avoir d'outil pour le food cost. On a ajoute RestauMargin il y a 6 mois et la marge brute est passee de 64 a 70 %. Pour 29 EUR de plus, c'est rentabilise en deux semaines."
              author="Karim B."
              role="Bistrot moderne, Lyon (combo RM + Zenchef)"
              rating={5}
              tool="rm"
            />
            <TestimonialCard
              quote="Zenchef nous a fait passer de 50 a 120 reservations/semaine en 6 mois grace au site web + Google + marketing email. Pour notre restaurant gastronomique, c'est devenu indispensable. L'investissement de 189 EUR/mois est largement rentabilise."
              author="Marie L."
              role="Chef-proprio, Paris (Zenchef Premium)"
              rating={5}
              tool="zc"
            />
            <TestimonialCard
              quote="J'avais regarde Zenchef pour notre nouveau restaurant. Trop cher et trop complexe pour ce que je voulais faire au demarrage. J'ai pris RestauMargin pour la gestion des marges et TheFork gratuit pour les reservations. Combinaison gagnante, total 29 EUR/mois."
              author="Sophie M."
              role="Restaurant independant, Bordeaux (RM seul)"
              rating={5}
              tool="rm"
            />
            <TestimonialCard
              quote="Le plan de salle interactif de Zenchef est genial. On gere 90 couverts sur 2 services avec une vue temps reel des occupations. La newsletter integree fait revenir 15 % de clients par mois. Pour un restaurant de notre taille, c'est la reference."
              author="Antoine R."
              role="Brasserie, Nantes (Zenchef Plus)"
              rating={4}
              tool="zc"
            />
            <TestimonialCard
              quote="Le scan de factures et la mercuriale RestauMargin m'ont fait gagner 4 heures par semaine. Aucun equivalent chez Zenchef. L'IA suggere meme quand un fournisseur a augmente ses prix de plus de 5 %. C'est vraiment un outil pense pour les operations."
              author="Mehdi L."
              role="Chef-proprietaire, Marseille (RM seul)"
              rating={5}
              tool="rm"
            />
            <TestimonialCard
              quote="On utilise Zenchef depuis 5 ans. Le module reservation est mature, le support reactif. Critique honnete : le prix a augmente de 30 % en 3 ans et l'onboarding initial a ete long. Mais aujourd'hui je ne pourrais plus m'en passer pour la gestion clientele."
              author="Caroline T."
              role="Directrice, groupe IDF (Zenchef multi-site)"
              rating={4}
              tool="zc"
            />
          </div>
        </section>

        {/* ═════════════ SECTION 9 : Verdict final par profil ═════════════ */}
        <section id="verdict-final" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="9">
            Verdict final par profil restaurateur
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la recommandation finale, par profil restaurateur, basee sur l'integralite du benchmark
              presente plus haut. Si plusieurs profils correspondent, prenez celui qui est le plus dominant
              dans votre activite.
            </p>
          </div>

          <div className="grid gap-4 mt-8">
            <VerdictCard
              profile="Restaurant traditionnel (volume moyen 40-100 couverts/jour)"
              winner="RestauMargin"
              winnerColor="emerald"
              reasoning="Priorite rentabilite + budget serre. RestauMargin Pro (29 EUR) couvre les besoins critiques. Reservations via Google/TheFork gratuit. Zenchef = surdimensionne."
            />
            <VerdictCard
              profile="Restaurant gastronomique avec forte demande reservations"
              winner="Combinaison RestauMargin + Zenchef"
              winnerColor="teal"
              reasoning="Reservations essentielles (Zenchef) + maitrise marges sur produits nobles (RestauMargin). Combo Pro + Premium a 218 EUR/mois optimal."
            />
            <VerdictCard
              profile="Brasserie multi-services (200+ couverts/jour)"
              winner="Combinaison RestauMargin + Zenchef"
              winnerColor="teal"
              reasoning="Volume eleve necessite Zenchef pour plan de salle + reservations groupes. RestauMargin obligatoire pour piloter 30-50 plats au quotidien."
            />
            <VerdictCard
              profile="Bistrot independant (jeune entreprise)"
              winner="RestauMargin"
              winnerColor="emerald"
              reasoning="Budget logiciel max 50 EUR/mois. Food cost prioritaire absolu. Zenchef = trop cher au demarrage. Ajout possible plus tard si vous grossissez."
            />
            <VerdictCard
              profile="Groupe de 3 a 10 restaurants"
              winner="Combinaison RestauMargin Business + Zenchef Premium"
              winnerColor="teal"
              reasoning="Vue consolidee marges (RM Business 79 EUR) + gestion centralisee reservations multi-site (Zenchef Premium 189 EUR). Total 268 EUR/mois imbattable a cette echelle."
            />
          </div>
        </section>

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <SectionHeading icon={<HelpCircle className="w-6 h-6" />} number="10">
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
              La meilleure façon de savoir si RestauMargin convient a votre restaurant, c'est de l'essayer.
              Sans carte bancaire, sans engagement. Vous pouvez combiner avec Zenchef si besoin.
            </p>
            <p className="text-teal-50 text-base max-w-xl mx-auto mb-8">
              <strong>29 EUR/mois</strong> a partir du 8e jour si vous decidez de continuer. Annulation en un clic.
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
              <p className="text-xs text-mono-500">Analyse approfondie de RestauMargin en alternative a Zenchef.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calcul de marge restaurant</h3>
              <p className="text-xs text-mono-500">Guide complet : food cost, formules et benchmarks par type d'etablissement.</p>
            </Link>
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Reduire son food cost</h3>
              <p className="text-xs text-mono-500">Methode pas a pas pour reduire le food cost de 2 a 4 points.</p>
            </Link>
            <Link to="/pricing" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Tarifs RestauMargin</h3>
              <p className="text-xs text-mono-500">Formules Pro et Business, comparaison detaillee.</p>
            </Link>
            <Link to="/comparatif-logiciels-restaurant" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Comparatif 12 logiciels restaurant</h3>
              <p className="text-xs text-mono-500">Mega-comparatif des principaux outils du marche francais 2026.</p>
            </Link>
            <Link to="/login?mode=register" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Creer mon compte</h3>
              <p className="text-xs text-mono-500">Essai gratuit 7 jours, sans carte bancaire.</p>
            </Link>
          </div>
        </section>

        </article>

      </main>

      {/* ── Footer ── */}
      <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-mono-500">
          <Link to="/landing" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4">
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mb-4">
            La plateforme de gestion de marge pour les restaurateurs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-mono-700">
            <Link to="/mentions-legales" className="hover:text-teal-600 transition-colors">Mentions legales</Link>
            <Link to="/cgv" className="hover:text-teal-600 transition-colors">CGV</Link>
            <Link to="/cgu" className="hover:text-teal-600 transition-colors">CGU</Link>
            <Link to="/politique-confidentialite" className="hover:text-teal-600 transition-colors">Confidentialite</Link>
          </div>
          <p className="mt-6 text-xs text-mono-700">
            &copy; {new Date().getFullYear()} RestauMargin. Tous droits reserves.
          </p>
        </div>
      </footer>
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
          <span className={c.sub}>Fonde en</span>
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

function TestimonialCard({
  quote,
  author,
  role,
  rating,
  tool,
}: {
  quote: string;
  author: string;
  role: string;
  rating: number;
  tool: 'rm' | 'zc';
}) {
  return (
    <div className="bg-white border border-mono-900 rounded-3xl p-6 sm:p-7 relative">
      <div className="absolute top-4 right-4">
        {tool === 'rm' ? <BadgeR /> : <BadgeZ />}
      </div>
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <Quote className="w-6 h-6 text-teal-600 mb-3 opacity-50" />
      <p className="text-sm text-mono-350 leading-relaxed mb-4 italic">"{quote}"</p>
      <div className="flex items-center gap-3 pt-3 border-t border-mono-900">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${tool === 'rm' ? 'bg-gradient-to-br from-teal-500 to-teal-700' : 'bg-gradient-to-br from-violet-500 to-violet-700'}`}>
          {author.split(' ').map((n) => n[0]).join('')}
        </div>
        <div>
          <div className="font-bold text-mono-100 text-sm">{author}</div>
          <div className="text-xs text-mono-500">{role}</div>
        </div>
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
