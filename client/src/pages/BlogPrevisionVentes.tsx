import { Link } from 'react-router-dom';
import {
  ChefHat,
  TrendingUp,
  CloudRain,
  Calendar,
  BarChart3,
  Target,
  ArrowRight,
  Calculator,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Brain,
  Database,
  Lightbulb,
  ListChecks,
  Zap,
  Users,
  Activity,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import BlogAuthor from '../components/BlogAuthor';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Prevision des ventes restaurant : forecast couverts 2026"
   Mots-cles principaux : prevision ventes restaurant + forecast couverts
   ~3 200 mots — W&B, teal-600, alignement BlogCalcMarge.tsx
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Combien d'historique faut-il pour des previsions de ventes fiables en restaurant ?",
    answer:
      "Comptez 3 mois minimum pour demarrer avec une moyenne mobile, 12 mois pour integrer la saisonnalite annuelle (vacances, jours feries, saisons), et 24 mois pour calibrer un modele de regression precis ou un algorithme de machine learning. Sans 12 mois de donnees, votre forecast couverts ne capturera ni le pic de la fete des meres, ni le creux d'aout, ni l'effet rentree de septembre.",
  },
  {
    question: "Quelle est la difference entre prevision des ventes et forecast couverts ?",
    answer:
      "La prevision des ventes restaurant calcule le chiffre d'affaires futur en euros. Le forecast couverts predit le nombre de clients servis. Les deux sont lies par le ticket moyen : Prevision CA = Forecast couverts x Ticket moyen. On pilote la prevision CA pour la tresorerie et le forecast couverts pour le staffing et les commandes matieres.",
  },
  {
    question: "Quelle precision attendre d'une prevision de ventes restaurant ?",
    answer:
      "Une precision de plus ou moins 10 % est consideree comme bonne, plus ou moins 20 % comme acceptable au demarrage. Les chaines avec algorithmes ML atteignent plus ou moins 5 %. L'indicateur de mesure standard est le MAPE (Mean Absolute Percentage Error). Visez 15 % au mois 3, 10 % au mois 12, 8 % apres 24 mois de pratique reguliere.",
  },
  {
    question: "Quels outils utiliser pour prevoir les ventes d'un restaurant ?",
    answer:
      "Pour demarrer : Excel ou Google Sheets avec une moyenne mobile. Au-dela : RestauMargin integre forecast + commandes + marges, Lightspeed Restaurant fournit un module previsions natif, Square for Restaurants propose des reports avec saisonnalite. Pour le ML avance : Prophet (Facebook), scikit-learn, ou les plateformes cloud (AWS Forecast, Google Vertex AI).",
  },
  {
    question: "Quels facteurs externes influencent le plus les ventes d'un restaurant ?",
    answer:
      "Par ordre d'impact decroissant : jour de la semaine (variation de -50 a +60 pourcent), meteo si terrasse (-25 a +20 pourcent), vacances scolaires (-30 a +25 pourcent selon zone), jours feries (-40 a +35 pourcent), evenements locaux concert ou match (+10 a +50 pourcent), greves transport (-30 pourcent en zone bureau), campagnes marketing (+5 a +20 pourcent), concurrence ouverture proche (-10 a -15 pourcent les 3 premiers mois).",
  },
  {
    question: "Comment integrer la meteo dans une prevision de ventes restaurant ?",
    answer:
      "Recuperez les previsions Meteo France ou Open-Meteo a 4-5 jours d'horizon. Calculez un coefficient meteo a partir de l'historique : pour chaque tranche de temperature et type de ciel, mesurez l'ecart moyen vs jour normal. Exemple : terrasse + soleil + 22 a 26 degres = +18 pourcent. Pluie forte = -22 pourcent. Stockez ces coefficients dans un tableur et appliquez-les a votre forecast de base.",
  },
  {
    question: "Faut-il prevoir par plat ou par couvert ?",
    answer:
      "Les deux, a des niveaux differents. Au niveau global, prevoyez en couverts pour piloter la salle et le staffing. Au niveau commandes matieres, deduisez la prevision par plat via le mix-vente moyen des 4 dernieres semaines equivalentes. Exemple : 200 couverts prevus, mix entrecote 18 pourcent = 36 entrecotes a commander, mix pizza margherita 12 pourcent = 24 pizzas, etc.",
  },
  {
    question: "Quelle est la meilleure methode de prevision pour un restaurant qui ouvre ?",
    answer:
      "Sans historique, utilisez 3 approches combinees : 1) Ratios sectoriels INSEE et GIRA Conseil pour votre format et zone, 2) Etude de concurrence (compter les couverts chez vos voisins sur 2-3 semaines), 3) Reservations + walk-in estime. A partir de 4 semaines de donnees, basculez en moyennes mobiles ponderees. A 12 semaines, vos propres patterns suffisent.",
  },
  {
    question: "Le machine learning vaut-il vraiment le coup pour un restaurant independant ?",
    answer:
      "En dessous de 2 ans de donnees ou 1 million d'euros de CA, le ML apporte rarement plus de 2-3 points de precision vs une bonne moyenne ponderee. Au-dela, les modeles type Prophet, ARIMA ou XGBoost peuvent gagner 5-8 points de MAPE en captant les interactions complexes (meteo x evenement x saison). Les chaines avec 20+ restaurants tirent le plus grand benefice du ML grace au mutualisation des donnees.",
  },
  {
    question: "Comment expliquer un ecart prevision/realise important ?",
    answer:
      "Tout ecart superieur a 15 pourcent doit etre analyse en post-mortem. Checklist : 1) Evenement non pris en compte (manifestation, match, concert) ? 2) Meteo mal lue ou changement de derniere minute ? 3) Probleme operationnel (rupture, service lent, equipe reduite) ? 4) Concurrence (ouverture, promotion) ? 5) Saisonnalite atypique (pont, ramadan, championnat) ? Documentez chaque ecart dans un journal pour enrichir le modele.",
  },
];

export default function BlogPrevisionVentes() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Prevision ventes restaurant 2026 : forecast couverts, methodes et IA"
        description="Guide complet du forecast couverts et prevision des ventes restaurant : moyenne mobile, regression, ML, saisonnalite, meteo. Methodes, outils, cas concret 4 semaines."
        path="/blog/prevision-ventes-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Prevision ventes restaurant', url: 'https://www.restaumargin.fr/blog/prevision-ventes-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Comment etablir une prevision des ventes restaurant en 7 etapes',
            description: 'Methode pas-a-pas pour calculer un forecast couverts hebdomadaire fiable, integrant meteo, saisonnalite et evenements.',
            totalTime: 'PT45M',
            tool: ['Excel ou Google Sheets', 'Historique caisse 3 mois minimum', 'Calendrier evenements locaux', 'Meteo a 4-5 jours', 'RestauMargin (optionnel)'],
            step: [
              { '@type': 'HowToStep', name: 'Extraire historique caisse', text: 'Exportez les couverts et le CA HT par jour sur 3 a 12 mois depuis votre caisse (Lightspeed, Square, Tiller, Zelty).' },
              { '@type': 'HowToStep', name: 'Calculer la moyenne mobile par jour de semaine', text: 'Pour chaque jour de la semaine, calculez la moyenne des 4 dernieres occurrences (ex: moyenne des 4 derniers vendredis).' },
              { '@type': 'HowToStep', name: 'Appliquer les coefficients saisonniers', text: 'Multipliez par le coefficient mensuel issu de votre historique N-1 (ex: mai = 1.08, aout = 0.65).' },
              { '@type': 'HowToStep', name: 'Integrer la meteo', text: 'Consultez Meteo France a 4-5 jours et appliquez le coefficient meteo (terrasse + soleil = +15 a +20 pourcent).' },
              { '@type': 'HowToStep', name: 'Ajouter les evenements et jours feries', text: 'Verifiez le calendrier local : concerts, matchs, marche, manifestations, jours feries. Appliquez les coefficients correspondants.' },
              { '@type': 'HowToStep', name: 'Deduire les commandes matieres par plat', text: 'Multipliez le forecast couverts par le mix-vente moyen pour obtenir la quantite par plat, puis par les grammages pour les matieres premieres.' },
              { '@type': 'HowToStep', name: 'Mesurer le MAPE et ajuster', text: 'En fin de semaine, calculez le MAPE (Mean Absolute Percentage Error) et documentez les ecarts pour ameliorer la semaine suivante.' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Prevision ventes restaurant 2026 : forecast couverts, methodes et IA',
            description: 'Guide complet 3200 mots : methodes de prevision (moyenne mobile, regression, ML), variables externes (meteo, evenements, saisonnalite), outils (Excel, RestauMargin, Lightspeed, Square), cas concret 4 semaines, FAQ 10 questions.',
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-05-26',
            dateModified: '2026-05-26',
            wordCount: 3200,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/prevision-ventes-restaurant' },
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
              Essayer gratuitement
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
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Prevision ventes restaurant</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <BlogArticleHero
        category="Pilotage"
        readTime="16 min"
        date="Mai 2026"
        title="Prevision des ventes restaurant : forecast couverts, methodes et IA"
        accentWord="prevision"
        subtitle="Combien de couverts vendredi prochain ? Si la reponse est &quot;ca depend&quot;, vous perdez de l'argent chaque semaine. Methodes, outils, cas concret 4 semaines de data."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="16 min" variant="header" />

        {/* ── Encadre formule rapide ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Formules essentielles</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les 4 equations du forecast couverts
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Moyenne mobile</strong> = Somme (N derniers jours equivalents) / N</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Moyenne ponderee</strong> = Sigma (poids_i x valeur_i) / Sigma (poids_i)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Forecast multi-facteurs</strong> = Base x C_meteo x C_saison x C_evenement</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">MAPE</strong> = (1/N) x Sigma |Reel - Prevu| / Reel x 100</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Objectif standard : MAPE inferieur a 10 pourcent (bon), inferieur a 20 pourcent (acceptable). Les chaines avec ML atteignent 5 pourcent.
          </p>
        </div>

        {/* ── Table des matieres ── */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#definition', label: 'Definition et utilite : pourquoi prevoir ses ventes' },
              { href: '#methodes', label: 'Les 5 methodes de prevision des ventes restaurant' },
              { href: '#tableau-methodes', label: 'Tableau comparatif des methodes' },
              { href: '#variables', label: 'Variables externes : meteo, evenements, saisonnalite' },
              { href: '#outils', label: 'Outils : Excel, RestauMargin, Lightspeed, Square' },
              { href: '#precision', label: 'Precision attendue : MAPE et benchmarks' },
              { href: '#cas-concret', label: 'Cas concret : 4 semaines de data, forecast complet' },
              { href: '#ia', label: 'IA et machine learning : Prophet, ARIMA, XGBoost' },
              { href: '#erreurs', label: 'Les 6 erreurs qui ruinent votre forecast couverts' },
              { href: '#workflow', label: 'Workflow hebdomadaire : checklist du dimanche soir' },
              { href: '#faq', label: 'Questions frequentes' },
              { href: '#cta', label: 'Automatiser avec RestauMargin' },
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

          {/* ═════════════ SECTION 1 : Definition ═════════════ */}
          <section id="definition" className="mb-16">
            <SectionHeading icon={<Target className="w-6 h-6" />} number="1">
              Definition et utilite : pourquoi prevoir ses ventes
            </SectionHeading>

            <div className="prose-content">
              <p>
                La <strong>prevision des ventes en restauration</strong> est l'exercice qui consiste a estimer
                le chiffre d'affaires et le nombre de couverts d'une periode future (jour, semaine, mois),
                a partir de l'historique et des variables externes connues. On parle aussi de <strong>forecast
                couverts</strong> quand l'unite est le nombre de clients servis plutot que les euros.
              </p>
              <p>
                Cette pratique n'a rien d'esoterique : c'est la base operationnelle de toute restauration
                professionnelle. Pourtant, selon une etude GIRA Conseil 2025, seulement 38 pourcent des
                restaurants independants francais pratiquent une prevision structuree hebdomadaire. Les 62 pourcent
                restants improvisent leurs commandes et leur planning RH, avec les consequences que l'on imagine.
              </p>
              <p>
                Une bonne prevision des ventes restaurant impacte directement trois leviers cles :
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-3 mt-8">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
                  <ChefHat className="w-5 h-5 text-emerald-700" />
                </div>
                <h3 className="font-bold text-emerald-900 mb-2">Commandes matieres</h3>
                <p className="text-sm text-emerald-800 leading-relaxed">
                  Une prevision precise reduit les pertes alimentaires de 4 a 8 pourcent du food cost. Sur 180 000 EUR
                  d'achats annuels, cela represente entre 7 200 et 14 400 EUR economises.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-blue-700" />
                </div>
                <h3 className="font-bold text-blue-900 mb-2">Planning RH</h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Un extra appele pour 50 couverts au lieu de 80 = 110 EUR jetes. Sur 1 erreur de staffing par
                  semaine, c'est plus de 5 500 EUR par an de masse salariale gaspillee.
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                  <Activity className="w-5 h-5 text-purple-700" />
                </div>
                <h3 className="font-bold text-purple-900 mb-2">Cash flow</h3>
                <p className="text-sm text-purple-800 leading-relaxed">
                  Un stock qui dort 10 jours immobilise du cash. La rotation des stocks (ratio CA / stock moyen)
                  doit etre superieure a 26 fois par an, soit moins de 14 jours de stock.
                </p>
              </div>
            </div>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> Pour un restaurant de 50 couverts realisant 580 000 EUR de CA,
              gagner 5 points de precision sur ses previsions represente entre 8 000 et 14 000 EUR de marge
              brute recuperee par an, simplement en ajustant les commandes et le staffing.
            </Callout>
          </section>

          {/* ═════════════ SECTION 2 : Les 5 methodes ═════════════ */}
          <section id="methodes" className="mb-16">
            <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="2">
              Les 5 methodes de prevision des ventes restaurant
            </SectionHeading>

            <div className="prose-content">
              <p>
                Il existe cinq grandes familles de methodes pour etablir une prevision des ventes en
                restauration, de la plus simple a la plus sophistiquee. Le choix depend de votre volume
                d'historique, du temps disponible, et du niveau de precision recherche.
              </p>
            </div>

            {/* Methode 1 - Moyenne mobile */}
            <div className="mt-8 bg-white border border-mono-900 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-teal-700 font-bold">1</div>
                <h3 className="font-bold text-mono-100 text-lg">Moyenne mobile (Simple Moving Average)</h3>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed mb-4">
                Vous calculez la moyenne des N dernieres occurrences du meme jour de la semaine. Methode la
                plus simple, ideale pour demarrer avec moins de 6 mois d'historique.
              </p>
              <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100">
                Prevision vendredi = (CA 4 derniers vendredis) / 4
              </div>
              <p className="text-sm text-mono-400 leading-relaxed mb-2">
                <strong className="text-mono-100">Exemple :</strong> CA des 4 derniers vendredis = 3 800 / 4 100 / 3 950 / 4 250 EUR.
                Prevision vendredi prochain = (3 800 + 4 100 + 3 950 + 4 250) / 4 = <strong>4 025 EUR</strong>.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs">
                  <p className="font-bold text-emerald-900 mb-1">Avantages</p>
                  <p className="text-emerald-800">Simple, rapide, transparent, marche des 3 mois d'historique.</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
                  <p className="font-bold text-amber-900 mb-1">Limites</p>
                  <p className="text-amber-800">Ne capture ni saisonnalite annuelle, ni meteo, ni evenements. MAPE typique 15-22 pourcent.</p>
                </div>
              </div>
            </div>

            {/* Methode 2 - Moyenne ponderee */}
            <div className="mt-6 bg-white border border-mono-900 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-teal-700 font-bold">2</div>
                <h3 className="font-bold text-mono-100 text-lg">Moyenne ponderee (Weighted Moving Average)</h3>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed mb-4">
                Variante de la moyenne mobile ou les jours les plus recents pesent plus lourd. Utile car les
                tendances recentes refletent mieux l'etat actuel (nouvelle carte, nouveau concurrent, evolution
                de la zone).
              </p>
              <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100">
                Prevision = (4 x J-1 + 3 x J-2 + 2 x J-3 + 1 x J-4) / 10
              </div>
              <p className="text-sm text-mono-400 leading-relaxed mb-2">
                <strong className="text-mono-100">Exemple :</strong> CA J-1 = 4 250, J-2 = 3 950, J-3 = 4 100, J-4 = 3 800.
                Prevision = (4 x 4250 + 3 x 3950 + 2 x 4100 + 1 x 3800) / 10 = (17000 + 11850 + 8200 + 3800) / 10 = <strong>4 085 EUR</strong>.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs">
                  <p className="font-bold text-emerald-900 mb-1">Avantages</p>
                  <p className="text-emerald-800">Capte mieux les tendances recentes, reactivite accrue, MAPE 12-18 pourcent.</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
                  <p className="font-bold text-amber-900 mb-1">Limites</p>
                  <p className="text-amber-800">Toujours pas de saisonnalite ni de meteo. Choix des poids arbitraire.</p>
                </div>
              </div>
            </div>

            {/* Methode 3 - Regression */}
            <div className="mt-6 bg-white border border-mono-900 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-teal-700 font-bold">3</div>
                <h3 className="font-bold text-mono-100 text-lg">Regression multi-facteurs</h3>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed mb-4">
                Vous appliquez des coefficients multiplicatifs sur une base, pour chaque facteur identifie :
                meteo, saisonnalite, evenement, jour ferie, vacances. Methode puissante des 12 mois d'historique.
              </p>
              <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100">
                CA prevu = CA base x C_meteo x C_saison x C_evenement x C_marketing
              </div>
              <p className="text-sm text-mono-400 leading-relaxed mb-2">
                <strong className="text-mono-100">Exemple :</strong> base 3 800 EUR x 1.15 (soleil 23 degres) x 1.05 (mai)
                x 1.08 (concert local) = <strong>4 957 EUR</strong>.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs">
                  <p className="font-bold text-emerald-900 mb-1">Avantages</p>
                  <p className="text-emerald-800">Integre tous les facteurs explicatifs, MAPE 8-14 pourcent, pedagogique.</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
                  <p className="font-bold text-amber-900 mb-1">Limites</p>
                  <p className="text-amber-800">Necessite calibration initiale (3-5 jours de travail), 12 mois d'historique mini.</p>
                </div>
              </div>
            </div>

            {/* Methode 4 - Saisonnalite */}
            <div className="mt-6 bg-white border border-mono-900 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-teal-700 font-bold">4</div>
                <h3 className="font-bold text-mono-100 text-lg">Decomposition saisonniere (Holt-Winters)</h3>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed mb-4">
                Vous decomposez la serie en 3 composantes : tendance (croissance/decroissance long terme),
                saisonnalite (cycles hebdomadaires et annuels), residu (alea). Methode statistique classique
                utilisee dans Excel via le module Analysis ToolPak.
              </p>
              <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100">
                Prevision = Tendance x Saisonnalite + Erreur lissee
              </div>
              <p className="text-sm text-mono-400 leading-relaxed mb-2">
                <strong className="text-mono-100">Exemple :</strong> tendance +2 pourcent/an, saisonnalite mai = 1.08,
                hebdomadaire vendredi = 1.32. Base annee = 3 600. Prevision = 3 600 x 1.02 x 1.08 x 1.32 = <strong>5 235 EUR</strong>.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs">
                  <p className="font-bold text-emerald-900 mb-1">Avantages</p>
                  <p className="text-emerald-800">Capture automatiquement tendance + saisons, robuste statistiquement, MAPE 7-12 pourcent.</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
                  <p className="font-bold text-amber-900 mb-1">Limites</p>
                  <p className="text-amber-800">Necessite 24 mois minimum, ne capture pas les facteurs externes (meteo, evenements).</p>
                </div>
              </div>
            </div>

            {/* Methode 5 - ML */}
            <div className="mt-6 bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold">5</div>
                <h3 className="font-bold text-mono-100 text-lg">Machine Learning (Prophet, ARIMA, XGBoost)</h3>
                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold ml-auto">Avance</span>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed mb-4">
                Algorithmes auto-apprenants capables de capturer toutes les interactions complexes
                (meteo x evenement x saison x tendance). Prophet (Facebook/Meta) est le plus accessible.
                XGBoost et ARIMA sont les standards academiques.
              </p>
              <div className="bg-white border border-mono-900 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100">
                {`from prophet import Prophet`}<br />
                {`model = Prophet(seasonality_mode='multiplicative')`}<br />
                {`model.add_regressor('temperature')`}<br />
                {`model.add_regressor('is_event')`}<br />
                {`model.fit(df_historique)`}<br />
                {`forecast = model.predict(df_futur)`}
              </div>
              <p className="text-sm text-mono-400 leading-relaxed mb-2">
                <strong className="text-mono-100">Resultat :</strong> sur 24+ mois d'historique avec variables externes,
                MAPE de 4 a 8 pourcent. Detection automatique des changepoints et des outliers.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs">
                  <p className="font-bold text-emerald-900 mb-1">Avantages</p>
                  <p className="text-emerald-800">Precision maximale, auto-apprentissage, capture interactions complexes.</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
                  <p className="font-bold text-amber-900 mb-1">Limites</p>
                  <p className="text-amber-800">Necessite competences Python/data, 24+ mois de donnees, infrastructure cloud.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ═════════════ SECTION 3 : Tableau comparatif methodes ═════════════ */}
          <section id="tableau-methodes" className="mb-16">
            <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="3">
              Tableau comparatif des methodes
            </SectionHeading>

            <div className="prose-content">
              <p>
                Pour choisir la methode adaptee a votre contexte, voici un tableau de synthese
                qui croise complexite, historique requis, precision attendue et type d'etablissement
                recommande.
              </p>
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-mono-975 text-mono-350">
                    <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Methode</th>
                    <th className="text-center py-3 px-4 font-semibold">Historique mini</th>
                    <th className="text-center py-3 px-4 font-semibold">MAPE typique</th>
                    <th className="text-center py-3 px-4 font-semibold">Complexite</th>
                    <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Profil cible</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  {[
                    { m: 'Moyenne mobile', h: '3 mois', mape: '15-22 %', c: 'Tres faible', p: 'Restaurant qui ouvre' },
                    { m: 'Moyenne ponderee', h: '3 mois', mape: '12-18 %', c: 'Faible', p: 'Independant solo' },
                    { m: 'Regression multi-facteurs', h: '12 mois', mape: '8-14 %', c: 'Moyenne', p: 'Bistrot / brasserie' },
                    { m: 'Holt-Winters', h: '24 mois', mape: '7-12 %', c: 'Moyenne', p: 'Restaurant mature' },
                    { m: 'ML (Prophet, ARIMA)', h: '24 mois', mape: '4-8 %', c: 'Elevee', p: 'Chaine 5+ etablissements' },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                      <td className="py-3 px-4 font-medium text-mono-100">{row.m}</td>
                      <td className="py-3 px-4 text-center">{row.h}</td>
                      <td className="py-3 px-4 text-center">{row.mape}</td>
                      <td className="py-3 px-4 text-center">{row.c}</td>
                      <td className="py-3 px-4 text-center">{row.p}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Callout type="info">
              <strong>Recommandation :</strong> commencez par la moyenne ponderee a la main dans un tableur.
              Apres 6 mois de pratique, passez a la regression multi-facteurs. Le ML n'est rentable qu'au-dela
              de 1.5 million EUR de CA ou pour les chaines.
            </Callout>
          </section>

          {/* ═════════════ SECTION 4 : Variables externes ═════════════ */}
          <section id="variables" className="mb-16">
            <SectionHeading icon={<CloudRain className="w-6 h-6" />} number="4">
              Variables externes : meteo, evenements, saisonnalite
            </SectionHeading>

            <div className="prose-content">
              <p>
                La force d'une prevision de ventes restaurant ne tient pas a la sophistication de l'algorithme,
                mais a la qualite des variables externes integrees. Voici les 7 facteurs externes les plus
                impactants, classes par ordre d'effet decroissant.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {[
                {
                  icon: <Calendar className="w-5 h-5" />,
                  title: 'Jour de la semaine',
                  impact: '-50 % a +60 %',
                  desc: "Le facteur n°1. Variation enorme entre lundi (souvent ferme ou -50 pourcent) et samedi soir (+60 pourcent). Doit toujours etre traite par jour de semaine separement.",
                },
                {
                  icon: <CloudRain className="w-5 h-5" />,
                  title: 'Meteo (terrasse ou centre-ville)',
                  impact: '-25 % a +20 %',
                  desc: "Soleil + 22-26 degres = +18 pourcent pour une terrasse. Pluie forte = -22 pourcent. Vent fort = -10 a -15 pourcent. Recuperez les previsions Meteo France ou Open-Meteo a 4-5 jours.",
                },
                {
                  icon: <Calendar className="w-5 h-5" />,
                  title: 'Vacances scolaires',
                  impact: '-30 % a +25 %',
                  desc: "Effet inverse selon zone : +15-25 pourcent en zone touristique (Annecy, Cote d'Azur), -10 a -30 pourcent en zone bureau (La Defense, Lyon Part-Dieu).",
                },
                {
                  icon: <Calendar className="w-5 h-5" />,
                  title: 'Jours feries',
                  impact: '-40 % a +35 %',
                  desc: "Fete des meres = +35 pourcent service du midi. 1er mai = -40 pourcent (commerce ferme). 14 juillet veille = +25 pourcent. Verifiez aussi le pont qui suit.",
                },
                {
                  icon: <Sparkles className="w-5 h-5" />,
                  title: 'Evenements locaux',
                  impact: '+10 % a +50 %',
                  desc: "Concert salle voisine = +15-25 pourcent. Match football stade proche = +30-50 pourcent. Marche du dimanche matin = +10-15 pourcent. Consultez l'agenda mairie + Facebook events.",
                },
                {
                  icon: <AlertTriangle className="w-5 h-5" />,
                  title: 'Greves transport',
                  impact: '-30 % zone bureau',
                  desc: "Greve SNCF ou metro = -30 pourcent en zone bureau (clientele teletravail). Inverse en zone residentielle : -5 pourcent seulement.",
                },
                {
                  icon: <Sparkles className="w-5 h-5" />,
                  title: 'Marketing et concurrence',
                  impact: '+5 % a +20 % / -10 % a -15 %',
                  desc: "Campagne Instagram +5-10 pourcent. Promo plat du jour +15-20 pourcent. Ouverture concurrent direct dans un rayon de 500 m = -10 a -15 pourcent les 3 premiers mois.",
                },
              ].map((v, i) => (
                <div key={i} className="bg-white border border-mono-900 rounded-xl p-5 flex gap-4">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 shrink-0">
                    {v.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-mono-100">{v.title}</h3>
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold font-mono">{v.impact}</span>
                    </div>
                    <p className="text-sm text-mono-400 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Callout type="warning">
              <strong>Erreur classique :</strong> se fier uniquement aux reservations. Sur un restaurant moyen,
              elles representent 40-60 pourcent des couverts. Le reste est en walk-in et depend entierement
              des facteurs externes ci-dessus.
            </Callout>
          </section>

          {/* ═════════════ SECTION 5 : Outils ═════════════ */}
          <section id="outils" className="mb-16">
            <SectionHeading icon={<Database className="w-6 h-6" />} number="5">
              Outils : Excel, RestauMargin, Lightspeed, Square
            </SectionHeading>

            <div className="prose-content">
              <p>
                Le choix de l'outil doit etre proportionne a votre maturite analytique et a votre budget.
                Voici un panorama des solutions du marche, de la plus accessible a la plus avancee.
              </p>
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-5">
              {[
                {
                  name: 'Excel / Google Sheets',
                  price: 'Gratuit / 6 EUR/mois',
                  pros: 'Universel, flexible, formules visibles, partage facile, Analysis ToolPak inclus.',
                  cons: 'Manuel, erreurs frequentes, pas de mise a jour temps reel, pas de meteo automatique.',
                  ideal: 'Demarrage, restaurants de moins de 500 K EUR de CA.',
                },
                {
                  name: 'RestauMargin',
                  price: '29 EUR/mois',
                  pros: 'Forecast integre + commandes + marges, alertes ecarts, mix-vente auto, meteo integree, IA Claude.',
                  cons: 'Pas (encore) de ML avance type Prophet. Roadmap Q4 2026 : module forecast IA.',
                  ideal: 'Independants 500 K - 2 M EUR de CA cherchant l\'all-in-one.',
                },
                {
                  name: 'Lightspeed Restaurant',
                  price: '69 EUR/mois',
                  pros: 'Module forecast natif, integration caisse parfaite, KPI dashboard, multi-etablissements.',
                  cons: 'Cher, courbe d\'apprentissage, forecast moins fin que solutions specialisees.',
                  ideal: 'Brasseries et chaines 1-10 etablissements.',
                },
                {
                  name: 'Square for Restaurants',
                  price: '60 EUR/mois',
                  pros: 'Reports saisonnalite, integration paiement, ouvert API, app mobile.',
                  cons: 'Forecast basique (moyenne mobile uniquement), peu de variables externes.',
                  ideal: 'Coffee shops, food trucks, fast-casual.',
                },
                {
                  name: 'Prophet (Meta) + Python',
                  price: 'Gratuit',
                  pros: 'Open source, ML state-of-the-art, regresseurs externes, detection changepoints auto.',
                  cons: 'Necessite competences Python/data, infrastructure cloud, pas d\'UI.',
                  ideal: 'Chaines 10+ etablissements avec equipe data.',
                },
                {
                  name: 'AWS Forecast / Vertex AI',
                  price: '50-500 EUR/mois',
                  pros: 'Cloud managed, ML automatique, scalable, integration ERP, MAPE 3-6 pourcent.',
                  cons: 'Cout variable, configuration complexe, vendor lock-in.',
                  ideal: 'Grandes chaines 50+ etablissements.',
                },
              ].map((o, i) => (
                <div key={i} className="bg-white border border-mono-900 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-mono-100">{o.name}</h3>
                    <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold">{o.price}</span>
                  </div>
                  <p className="text-xs text-emerald-700 mb-2"><strong>+</strong> {o.pros}</p>
                  <p className="text-xs text-amber-700 mb-2"><strong>-</strong> {o.cons}</p>
                  <p className="text-xs text-mono-500 italic"><strong>Pour :</strong> {o.ideal}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ═════════════ SECTION 6 : Precision MAPE ═════════════ */}
          <section id="precision" className="mb-16">
            <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="6">
              Precision attendue : MAPE et benchmarks
            </SectionHeading>

            <div className="prose-content">
              <p>
                L'indicateur standard de precision d'une prevision est le <strong>MAPE</strong> (Mean
                Absolute Percentage Error), qui mesure l'ecart moyen entre prevu et realise, en pourcentage.
                Plus le MAPE est bas, plus la prevision est fiable.
              </p>
            </div>

            <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
              <h3 className="font-bold text-mono-100 mb-4 text-lg">Formule MAPE</h3>
              <div className="bg-white border border-mono-900 rounded-xl p-4 font-mono text-sm text-mono-100 mb-4">
                MAPE = (1 / N) x Sigma | Reel_i - Prevu_i | / Reel_i x 100
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">
                Exemple : sur 7 jours, ecarts en valeur absolue = 8 %, 12 %, 5 %, 18 %, 3 %, 9 %, 15 %.
                MAPE = (8 + 12 + 5 + 18 + 3 + 9 + 15) / 7 = <strong>10 pourcent</strong>. Resultat : bonne precision.
              </p>
            </div>

            <div className="mt-8 grid sm:grid-cols-3 gap-5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                <div className="text-3xl font-extrabold text-emerald-900 mb-2">{'<'} 10 %</div>
                <p className="font-bold text-emerald-900 mb-1">Bonne precision</p>
                <p className="text-xs text-emerald-800">Restaurant mature avec methode robuste. Permet un staffing fin et des commandes justes.</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="text-3xl font-extrabold text-amber-900 mb-2">10-20 %</div>
                <p className="font-bold text-amber-900 mb-1">Acceptable</p>
                <p className="text-xs text-amber-800">Niveau de demarrage. Suffisant pour eviter les ruptures majeures, perfectible.</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <div className="text-3xl font-extrabold text-red-900 mb-2">{'>'} 20 %</div>
                <p className="font-bold text-red-900 mb-1">A ameliorer</p>
                <p className="text-xs text-red-800">Methode trop simpliste ou variables manquantes. Revoyez votre approche.</p>
              </div>
            </div>

            <div className="prose-content mt-8">
              <h3 className="text-xl font-bold text-mono-100 mb-3">Objectifs realistes par anciennete</h3>
              <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
                <li><strong>Mois 1-3 :</strong> MAPE de 18-22 pourcent. Vous apprenez vos patterns.</li>
                <li><strong>Mois 4-6 :</strong> MAPE de 12-15 pourcent. Vous integrez la meteo et les evenements.</li>
                <li><strong>Mois 7-12 :</strong> MAPE de 9-12 pourcent. Vous avez vu un cycle complet.</li>
                <li><strong>An 2 :</strong> MAPE de 6-9 pourcent. Coefficients calibres, automatismes installes.</li>
                <li><strong>An 3+ :</strong> MAPE de 4-7 pourcent si vous ajoutez du ML. Plateau atteint sans ML : 8 pourcent.</li>
              </ul>
            </div>
          </section>

          {/* ═════════════ SECTION 7 : Cas concret 4 semaines ═════════════ */}
          <section id="cas-concret" className="mb-16">
            <SectionHeading icon={<Calculator className="w-6 h-6" />} number="7">
              Cas concret : 4 semaines de data, forecast complet
            </SectionHeading>

            <div className="prose-content">
              <p>
                Mettons en pratique tout ce que nous avons vu sur un cas reel : <strong>Bistrot Le Marais</strong>,
                50 couverts a Paris 4e, ouvert du mardi au dimanche, terrasse 20 places, ticket moyen 32 EUR HT.
                Voici 4 semaines de data (avril 2026) puis le forecast pour la semaine suivante.
              </p>
            </div>

            <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
              <h3 className="font-bold text-mono-100 mb-4 text-lg">Historique 4 semaines (avril 2026)</h3>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-white text-mono-350 border-b border-mono-900">
                    <th className="text-left py-2 px-3 font-semibold">Jour</th>
                    <th className="text-center py-2 px-3 font-semibold">S1 (1-7)</th>
                    <th className="text-center py-2 px-3 font-semibold">S2 (8-14)</th>
                    <th className="text-center py-2 px-3 font-semibold">S3 (15-21)</th>
                    <th className="text-center py-2 px-3 font-semibold">S4 (22-28)</th>
                    <th className="text-center py-2 px-3 font-semibold">Moy. pond.</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  {[
                    { j: 'Mardi midi', s1: 38, s2: 42, s3: 35, s4: 45, moy: 41 },
                    { j: 'Mardi soir', s1: 52, s2: 58, s3: 48, s4: 62, moy: 57 },
                    { j: 'Mercredi midi', s1: 45, s2: 48, s3: 52, s4: 50, moy: 49 },
                    { j: 'Mercredi soir', s1: 65, s2: 68, s3: 70, s4: 72, moy: 70 },
                    { j: 'Jeudi midi', s1: 55, s2: 58, s3: 62, s4: 60, moy: 60 },
                    { j: 'Jeudi soir', s1: 78, s2: 82, s3: 75, s4: 88, moy: 83 },
                    { j: 'Vendredi midi', s1: 68, s2: 72, s3: 75, s4: 70, moy: 71 },
                    { j: 'Vendredi soir', s1: 95, s2: 102, s3: 88, s4: 110, moy: 102 },
                    { j: 'Samedi midi', s1: 72, s2: 75, s3: 70, s4: 80, moy: 76 },
                    { j: 'Samedi soir', s1: 118, s2: 125, s3: 110, s4: 132, moy: 124 },
                    { j: 'Dimanche midi', s1: 85, s2: 90, s3: 78, s4: 95, moy: 88 },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                      <td className="py-2 px-3 font-medium text-mono-100">{row.j}</td>
                      <td className="py-2 px-3 text-center">{row.s1}</td>
                      <td className="py-2 px-3 text-center">{row.s2}</td>
                      <td className="py-2 px-3 text-center">{row.s3}</td>
                      <td className="py-2 px-3 text-center">{row.s4}</td>
                      <td className="py-2 px-3 text-center font-bold text-teal-700">{row.moy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="prose-content mt-8">
              <h3 className="text-xl font-bold text-mono-100 mb-3">Calcul moyenne ponderee semaine 5</h3>
              <p>
                Pour chaque jour, on applique : Prevision = (4 x S4 + 3 x S3 + 2 x S2 + 1 x S1) / 10.
                Exemple vendredi soir : (4 x 110 + 3 x 88 + 2 x 102 + 1 x 95) / 10 = (440 + 264 + 204 + 95) / 10 = <strong>100 couverts</strong>.
              </p>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-mono-975 text-mono-350">
                    <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Service</th>
                    <th className="text-center py-3 px-4 font-semibold">Base ponderee</th>
                    <th className="text-center py-3 px-4 font-semibold">Coef meteo</th>
                    <th className="text-center py-3 px-4 font-semibold">Coef evenement</th>
                    <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Prevision finale</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  {[
                    { s: 'Mardi midi', b: 41, m: '0.95 (pluie)', e: '1.00', p: 39 },
                    { s: 'Mardi soir', b: 57, m: '0.95', e: '1.00', p: 54 },
                    { s: 'Mercredi midi', b: 49, m: '1.10 (soleil)', e: '1.00', p: 54 },
                    { s: 'Mercredi soir', b: 70, m: '1.15', e: '1.00', p: 81 },
                    { s: 'Jeudi midi', b: 60, m: '1.15', e: '1.05 (ferie veille)', p: 72 },
                    { s: 'Jeudi soir', b: 83, m: '1.20 (terrasse)', e: '1.10', p: 110 },
                    { s: 'Vendredi midi (ferie)', b: 71, m: '1.10', e: '0.70 (1er mai)', p: 55 },
                    { s: 'Vendredi soir', b: 100, m: '1.15', e: '1.05', p: 121 },
                    { s: 'Samedi midi', b: 76, m: '1.20', e: '1.00', p: 91 },
                    { s: 'Samedi soir', b: 124, m: '1.18', e: '1.15 (concert)', p: 168 },
                    { s: 'Dimanche midi (fete meres)', b: 88, m: '1.10', e: '1.35', p: 131 },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                      <td className="py-3 px-4 font-medium text-mono-100">{row.s}</td>
                      <td className="py-3 px-4 text-center">{row.b}</td>
                      <td className="py-3 px-4 text-center">{row.m}</td>
                      <td className="py-3 px-4 text-center">{row.e}</td>
                      <td className="py-3 px-4 text-center font-bold text-teal-700">{row.p}</td>
                    </tr>
                  ))}
                  <tr className="bg-teal-50 border-t-2 border-teal-200">
                    <td className="py-3 px-4 font-bold text-teal-900">TOTAL semaine</td>
                    <td className="py-3 px-4 text-center font-bold text-teal-900">819</td>
                    <td className="py-3 px-4"></td>
                    <td className="py-3 px-4"></td>
                    <td className="py-3 px-4 text-center font-bold text-teal-900">976 couverts</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="prose-content mt-8">
              <p>
                <strong>Conversion en CA :</strong> 976 couverts x 32 EUR ticket moyen = <strong>31 232 EUR de CA HT prevu</strong>.
                <br />
                <strong>Commandes matieres :</strong> 976 couverts x food cost cible 30 pourcent x 32 EUR = <strong>9 370 EUR d'achats matieres</strong> pour la semaine.
                <br />
                <strong>Staffing :</strong> avec un ratio de 1 cuisinier + 1 commis pour 50 couverts/service et 1 serveur pour 25 couverts/service.
              </p>
            </div>

            <Callout type="info">
              <strong>Lecon du cas :</strong> sans les coefficients meteo + evenements, la prevision aurait
              ete de 819 couverts (base ponderee). Avec, on monte a 976. L'ecart de 157 couverts representerait
              5 024 EUR de CA non anticipe et probablement 30-40 ruptures ou clients perdus.
            </Callout>
          </section>

          {/* ═════════════ SECTION 8 : IA / ML ═════════════ */}
          <section id="ia" className="mb-16">
            <SectionHeading icon={<Brain className="w-6 h-6" />} number="8">
              IA et machine learning : Prophet, ARIMA, XGBoost
            </SectionHeading>

            <div className="prose-content">
              <p>
                Le machine learning a transforme la prevision dans la restauration ces 5 dernieres annees.
                Les chaines (McDonald's, Starbucks, Burger King) utilisent depuis longtemps des modeles ML
                pour optimiser le staffing au quart d'heure pres. Pour un independant, l'IA devient pertinente
                au-dela de 1.5 million EUR de CA ou pour les groupes multi-etablissements. Pour aller plus
                loin sur l'usage de l'intelligence artificielle en restauration, consultez notre dossier
                <Link to="/blog/ia-restauration" className="text-teal-700 underline hover:text-teal-800 ml-1">IA restauration</Link>.
              </p>
            </div>

            <div className="mt-8 grid sm:grid-cols-3 gap-5">
              <div className="bg-white border border-mono-900 rounded-2xl p-5">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700 mb-3">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-mono-100 mb-2">Prophet (Meta)</h3>
                <p className="text-xs text-mono-400 leading-relaxed mb-3">
                  Le plus accessible. Open source Python/R. Gere automatiquement saisonnalite, jours feries,
                  regresseurs externes. MAPE typique 5-8 pourcent.
                </p>
                <p className="text-xs text-emerald-700 font-semibold">+ Facile a installer, doc abondante</p>
                <p className="text-xs text-amber-700 font-semibold">- Moins flexible que XGBoost</p>
              </div>
              <div className="bg-white border border-mono-900 rounded-2xl p-5">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 mb-3">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-mono-100 mb-2">ARIMA / SARIMA</h3>
                <p className="text-xs text-mono-400 leading-relaxed mb-3">
                  Le standard statistique academique. Capture autoregression + moyenne mobile + saisonnalite.
                  Adapte aux series stationnaires. MAPE 6-10 pourcent.
                </p>
                <p className="text-xs text-emerald-700 font-semibold">+ Theoriquement robuste, interpretable</p>
                <p className="text-xs text-amber-700 font-semibold">- Manuel sur identification ordres</p>
              </div>
              <div className="bg-white border border-mono-900 rounded-2xl p-5">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 mb-3">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-mono-100 mb-2">XGBoost / LightGBM</h3>
                <p className="text-xs text-mono-400 leading-relaxed mb-3">
                  Gradient boosting tree-based. Champion des competitions Kaggle. Excellent avec beaucoup
                  de features. MAPE 4-7 pourcent.
                </p>
                <p className="text-xs text-emerald-700 font-semibold">+ Precision maximale, feature engineering riche</p>
                <p className="text-xs text-amber-700 font-semibold">- Boite noire, plus difficile a debugger</p>
              </div>
            </div>

            <div className="prose-content mt-8">
              <h3 className="text-xl font-bold text-mono-100 mb-3">Quand l'IA devient rentable ?</h3>
              <p>
                Le ROI du machine learning depend de votre volume et de votre variabilite. Voici les seuils
                observes en pratique :
              </p>
              <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
                <li><strong>Moins de 500 K EUR de CA :</strong> ML non rentable, methode ponderee suffit.</li>
                <li><strong>500 K - 1.5 M EUR de CA :</strong> Regression multi-facteurs Excel sufisante.</li>
                <li><strong>1.5 - 5 M EUR de CA :</strong> Prophet recommande, ROI rapide (-2-3 points MAPE).</li>
                <li><strong>5 M+ EUR de CA ou chaines :</strong> XGBoost ou plateforme cloud (AWS Forecast, Vertex AI).</li>
              </ul>
            </div>
          </section>

          {/* ═════════════ SECTION 9 : Erreurs courantes ═════════════ */}
          <section id="erreurs" className="mb-16">
            <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="9">
              Les 6 erreurs qui ruinent votre forecast couverts
            </SectionHeading>

            <div className="space-y-6 mt-8">
              <ErreurCard
                number={1}
                title="Confondre prevision et reservations"
                desc="Les reservations representent 40-60 pourcent des couverts d'un restaurant moyen. Si vous prevoyez uniquement sur la base des resas, vous sous-estimez systematiquement de 40-50 pourcent. Toujours appliquer un ratio resa/total issu de votre historique."
              />
              <ErreurCard
                number={2}
                title="Ignorer la meteo a 4-5 jours"
                desc="Pour un restaurant avec terrasse, ne pas integrer la meteo vous fait perdre 15-20 pourcent de precision en moyenne sur la saison chaude. Configurez une alerte Open-Meteo gratuite et appliquez vos coefficients meteo systematiquement."
              />
              <ErreurCard
                number={3}
                title="Refaire la prevision a la main chaque semaine"
                desc="Si chaque dimanche soir vous passez 2h sur Excel a refaire manuellement le calcul, vous tiendrez 3 mois maximum avant d'abandonner. Automatisez avec des formules ou un outil comme RestauMargin. L'objectif : 15 minutes maximum par semaine."
              />
              <ErreurCard
                number={4}
                title="Oublier le post-mortem des ecarts"
                desc="Sans analyse hebdomadaire des ecarts prevision/realise (le MAPE), votre modele ne s'ameliore jamais. Documentez chaque ecart superieur a 15 pourcent dans un journal avec hypothese de cause. Cette boucle d'apprentissage est ce qui fait baisser le MAPE annee apres annee."
              />
              <ErreurCard
                number={5}
                title="Sous-estimer les evenements locaux"
                desc="Un concert a 500 m peut vous amener +30 pourcent de couverts ou -20 pourcent si vos clients y vont. Sans veille active sur l'agenda local (mairie, Facebook events, Songkick, salle de sport, eglise), vous ratez 60 pourcent des evenements impactants."
              />
              <ErreurCard
                number={6}
                title="Vouloir trop de precision trop tot"
                desc="Au mois 3, viser un MAPE de 5 pourcent est irrealiste et demotivant. Acceptez 18-22 pourcent au demarrage et focalisez-vous sur la regularite (faire la prevision chaque semaine sans exception). La precision viendra naturellement avec l'historique."
              />
            </div>

            <Callout type="warning">
              <strong>Impact cumule :</strong> ces 6 erreurs combinees representent souvent 10-15 points de
              MAPE supplementaires. Sur un restaurant a 600 000 EUR de CA, cela equivaut a 8-15 K EUR de
              marge brute perdue par an (commandes excedentaires + staffing mal calibre + clients perdus).
            </Callout>
          </section>

          {/* ═════════════ SECTION 10 : Workflow hebdo ═════════════ */}
          <section id="workflow" className="mb-16">
            <SectionHeading icon={<CheckCircle className="w-6 h-6" />} number="10">
              Workflow hebdomadaire : checklist du dimanche soir
            </SectionHeading>

            <div className="prose-content">
              <p>
                Pour transformer la theorie en pratique, voici le rituel hebdomadaire d'un restaurateur
                qui pratique la prevision depuis 2 ans. Duree totale : 30-45 minutes le dimanche soir.
              </p>
            </div>

            <ol className="mt-8 space-y-5">
              {[
                {
                  title: 'Extraire les ventes de la semaine ecoulee (5 min)',
                  body: 'Exportez le rapport ventes depuis votre caisse (Lightspeed, Square, Tiller, Zelty). Filtrez par service midi/soir et par jour.',
                },
                {
                  title: 'Calculer le MAPE de la semaine (5 min)',
                  body: 'Pour chaque service, calculez |Reel - Prevu| / Reel x 100. Faites la moyenne. Reportez dans votre journal de bord.',
                },
                {
                  title: 'Documenter les ecarts > 15 % (10 min)',
                  body: 'Pour chaque service avec ecart important, notez la cause hypothetique : meteo ratee, evenement non vu, probleme operationnel, etc.',
                },
                {
                  title: 'Recuperer la meteo a 5 jours (3 min)',
                  body: 'Consultez Meteo France ou Open-Meteo. Notez temperature et type de ciel pour chaque jour de la semaine suivante.',
                },
                {
                  title: 'Verifier l\'agenda local (5 min)',
                  body: 'Site mairie, Facebook events, salle de concert voisine, stade, ecoles (fetes). Identifiez tout evenement dans un rayon de 1 km.',
                },
                {
                  title: 'Calculer la prevision semaine suivante (10 min)',
                  body: 'Pour chaque service : base ponderee x coef meteo x coef evenement x coef saison. Reportez dans le tableau hebdomadaire.',
                },
                {
                  title: 'Deduire commandes matieres et planning RH (10 min)',
                  body: 'Multipliez le forecast couverts par le mix-vente pour les quantites par plat. Calez le planning sur les ratios cibles (1 cuisinier / 50 couverts).',
                },
              ].map((step, i) => (
                <li key={i} className="bg-white border border-mono-900 rounded-2xl p-6 sm:p-7 flex gap-5">
                  <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0 font-extrabold text-lg shadow-md">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-mono-100 text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-mono-400 leading-relaxed">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <Callout type="info">
              <strong>Astuce :</strong> creez un template Notion ou Excel reutilisable chaque semaine. Apres
              3 semaines, vous tiendrez le rythme en 20 minutes au lieu de 45. C'est l'investissement
              hebdomadaire le plus rentable de votre gestion.
            </Callout>
          </section>

          {/* ═════════════ FAQ ═════════════ */}
          <section id="faq" className="mb-16">
            <SectionHeading icon={<Lightbulb className="w-6 h-6" />} number="11">
              Questions frequentes
            </SectionHeading>

            <div className="space-y-4 mt-8">
              {faqItems.map((item, i) => (
                <details key={i} className="bg-white border border-mono-900 rounded-xl p-5 group">
                  <summary className="font-semibold text-mono-100 cursor-pointer flex items-center justify-between gap-4 list-none">
                    <span>{item.question}</span>
                    <span className="text-teal-600 group-open:rotate-180 transition-transform shrink-0">
                      <ArrowRight className="w-4 h-4 rotate-90" />
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-mono-400 leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* ═════════════ Articles connexes ═════════════ */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-mono-100 mb-6">Articles connexes</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <Link to="/blog/chiffre-affaires-restaurant-comment-calculer" className="bg-white border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                <div className="text-xs text-teal-600 font-semibold mb-2">Pilotage</div>
                <h3 className="font-bold text-mono-100 mb-2">Chiffre d'affaires restaurant : comment le calculer</h3>
                <p className="text-sm text-mono-400">Methode pas-a-pas pour calculer le CA HT/TTC, ticket moyen, taux de remplissage.</p>
              </Link>
              <Link to="/blog/taux-occupation-restaurant" className="bg-white border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                <div className="text-xs text-teal-600 font-semibold mb-2">Operations</div>
                <h3 className="font-bold text-mono-100 mb-2">Taux d'occupation restaurant : le KPI cle</h3>
                <p className="text-sm text-mono-400">Mesurer et optimiser le taux de remplissage de votre salle, service par service.</p>
              </Link>
              <Link to="/blog/augmenter-ticket-moyen-restaurant" className="bg-white border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                <div className="text-xs text-teal-600 font-semibold mb-2">Revenue</div>
                <h3 className="font-bold text-mono-100 mb-2">Augmenter le ticket moyen de votre restaurant</h3>
                <p className="text-sm text-mono-400">7 leviers concrets pour faire passer le ticket moyen de 28 a 35 EUR.</p>
              </Link>
              <Link to="/blog/ia-restauration" className="bg-white border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                <div className="text-xs text-teal-600 font-semibold mb-2">Innovation</div>
                <h3 className="font-bold text-mono-100 mb-2">IA en restauration : use cases 2026</h3>
                <p className="text-sm text-mono-400">Forecast, menu engineering, OCR factures, voice ordering : panorama complet.</p>
              </Link>
            </div>
          </section>

          {/* ═════════════ CTA ═════════════ */}
          <section id="cta">
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-10 text-center text-white shadow-xl">
              <Sparkles className="w-10 h-10 mx-auto mb-4 text-teal-100" />
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
                Automatisez vos previsions de ventes
              </h2>
              <p className="text-teal-100 mb-6 text-sm sm:text-base leading-relaxed max-w-[560px] mx-auto">
                RestauMargin integre forecast couverts, commandes matieres, marges et alertes ecarts dans
                un seul outil. Connecte a votre caisse, integre la meteo, propulse par l'IA Claude.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link
                  to="/login?mode=register"
                  className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors text-sm shadow-md"
                >
                  Essayer gratuitement <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/outils/calculateur-food-cost"
                  className="inline-flex items-center gap-2 bg-teal-800/40 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal-800/60 transition-colors text-sm border border-teal-500/40"
                >
                  <Calculator className="w-4 h-4" /> Calculateur food cost
                </Link>
              </div>
              <p className="text-xs text-teal-200 mt-4">Sans CB, sans engagement. 14 jours d'essai complet.</p>
            </div>
          </section>

        </article>

        {/* ── Nav bas de page ── */}
        <div className="mt-12 pt-8 border-t border-mono-900 flex justify-between items-center flex-wrap gap-3">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">{'<-'} Tous les articles</Link>
          <Link to="/blog/budget-previsionnel-restaurant" className="text-sm text-teal-600 hover:underline">Budget previsionnel {'->'}</Link>
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Composants internes (alignes avec BlogCalcMarge.tsx)
   ═══════════════════════════════════════════════════════════════ */

function SectionHeading({ icon, number, children }: { icon: React.ReactNode; number: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
        {icon}
      </div>
      <div>
        <div className="text-xs text-teal-600 font-bold uppercase tracking-wider">Section {number}</div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100">{children}</h2>
      </div>
    </div>
  );
}

function Callout({ type, children }: { type: 'info' | 'warning'; children: React.ReactNode }) {
  const styles = type === 'info'
    ? 'bg-teal-50 border-l-4 border-teal-500 text-teal-900'
    : 'bg-amber-50 border-l-4 border-amber-500 text-amber-900';
  const Icon = type === 'info' ? Lightbulb : AlertTriangle;
  return (
    <div className={`my-6 rounded-r-xl p-5 ${styles}`}>
      <div className="flex gap-3">
        <Icon className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function ErreurCard({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-6 sm:p-7 flex gap-5">
      <div className="w-12 h-12 bg-red-100 text-red-700 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-lg">
        {number}
      </div>
      <div>
        <h3 className="font-bold text-mono-100 text-lg mb-2">{title}</h3>
        <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
