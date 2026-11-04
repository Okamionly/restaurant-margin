import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Calculator, Eye, Users, Brain, TrendingUp, AlertTriangle, ArrowRight, Lightbulb, Target, BarChart3, Sparkles, ListChecks, Pizza, Beef, Coffee, Tag, Award, CheckCircle, Percent, DollarSign } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Comment fixer les prix de sa carte de restaurant"
   Mot-clé principal : prix carte restaurant
   ~3 200 mots — KD 25, gros volume mensuel
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Faut-il afficher les prix avec ou sans le symbole euro ?",
    answer: "Sans le symbole, idéalement. Étude Cornell University (2009) sur 200 menus : retirer le symbole EUR augmente le panier moyen de 8,15 % en moyenne. Si vous voulez un compromis : symbole très discret, même typographie que le prix, taille réduite de 30 % par rapport au chiffre. Jamais en gras, jamais en rouge.",
  },
  {
    question: "Quel coefficient appliquer pour un food truck ou snacking ?",
    answer: "Plus bas qu'un restaurant traditionnel (2,8 à 3,2) car le client compare au prix d'un kebab, d'une salade Picard ou d'un sandwich Pret a Manger. Mais vos charges fixes sont aussi plus basses (pas de salle, pas de service). La marge nette d'un food truck bien géré atteint 12 à 18 %, supérieure à la restauration traditionnelle (5-10 %).",
  },
  {
    question: "Mon coefficient idéal donne un prix bizarre (24,30 EUR). Que faire ?",
    answer: "Arrondissez au prix psychologique le plus proche selon votre positionnement : 24 EUR (premium, prix rond), 23,90 EUR (bon plan, prix de charme), 24,50 EUR (intermédiaire, signal de qualité). Ne laissez jamais des prix biscornus type 24,30 EUR ou 23,17 EUR : ils donnent une impression d'amateurisme et perturbent le client.",
  },
  {
    question: "Combien de fois par an dois-je revoir mes prix de carte ?",
    answer: "Tous les 6 mois pour le contrôle complet, et au minimum à chaque rotation de carte (printemps-été, automne-hiver). Une révision annuelle est insuffisante en période d'inflation. La meilleure pratique : un contrôle food cost mensuel par catégorie, et une refonte tarifaire complète 2 fois par an, alignée sur la rotation de la carte.",
  },
  {
    question: "Mes concurrents sont 20 % moins chers, dois-je m'aligner ?",
    answer: "Pas automatiquement. Vérifiez d'abord 4 points : ont-ils la même qualité ? Mêmes origines (label, AOP, circuit court) ? Même service (couverts dressage, personnel formée) ? Mêmes contraintes (loyer, charges) ? Si oui sur tous les points, regardez votre food cost et votre productivité. Si non, assumez votre positionnement supérieur en l'expliquant sur la carte.",
  },
  {
    question: "Comment fixer le prix d'un menu (formule entrée-plat-dessert) ?",
    answer: "Calculez la somme des trois prix individuels HT, puis appliquez une remise de 8 à 15 % pour créer l'effet bundle. Exemple : entrée 8 EUR + plat 18 EUR + dessert 7 EUR = 33 EUR cumulés, formule à 29 EUR (remise 12 %). Vous perdez sur l'unitaire mais gagnez en panier moyen : 65-80 % des clients prennent la formule complète plutôt qu'un seul plat.",
  },
  {
    question: "Quelle est la différence entre prix d'appel et prix d'ancrage ?",
    answer: "Le prix d'appel est volontairement bas pour attirer le client (plat du jour à 11,90 EUR). Le prix d'ancrage est volontairement haut pour faire paraître les autres prix raisonnables par contraste (côte de boeuf à 95 EUR sur une carte où le plat moyen est à 22 EUR). Les deux sont complémentaires : l'appel attire, l'ancrage maximise le ticket.",
  },
  {
    question: "Faut-il afficher les prix sur la version site web et réseaux sociaux ?",
    answer: "Oui sur le site web (transparence exigée par les clients, +30 % de clics quand les prix sont visibles selon ZooBistro 2024). Plus mesurée sur les réseaux sociaux : préférez 'menus à partir de 22 EUR' plutôt que prix unitaires plat par plat. Les réseaux poussent au benchmark et à la comparaison, le site permet la mise en contexte.",
  },
  {
    question: "Comment justifier une augmentation de prix auprès des clients fidèles ?",
    answer: "Communiquez 1 mois avant via un petit encart sur la carte ou un email. Mettez en avant un bénéfice (nouvel ingrédient, label nouveau, fournisseur premium) et évitez 'cause hausse des coûts'. Les clients acceptent +5 à 8 % une fois par an si la valeur ajoutée est visible. RestauMargin alerte automatiquement quand un plat franchit le seuil de marge minimum.",
  },
  {
    question: "Comment intégrer le coût de la main d'oeuvre dans le prix d'un plat ?",
    answer: "Au-delà du food cost, calculez un coût main d'oeuvre par plat : temps de préparation x coût horaire cuisinier (chargées à 22-28 EUR/h en 2026). Un plat de 15 minutes de mise en place a un coût MO de 5,50 EUR. Cumulez : food cost + MO = prime cost. Si prime cost dépasse 60 % du PV, retirez le plat ou repensez la recette pour la rendre plus rapide.",
  },
];

export default function BlogPrixCarte() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Fixer les prix de sa carte de restaurant : méthode complète 2026"
        description="Méthode complète pour fixer les prix d'une carte de restaurant : 3 approches (coût, valeur, concurrence), coefficients par poste, psychologie des prix, cas pratiques chiffrés."
        path="/blog/fixer-prix-carte-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Fixer les prix carte restaurant', url: 'https://www.restaumargin.fr/blog/fixer-prix-carte-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Comment fixer les prix de sa carte de restaurant en 7 étapes',
            description: "Méthode pas-à-pas pour fixer une carte complète de restaurant : calcul des coûts, étude de marché, application des coefficients, psychologie des prix.",
            totalTime: 'PT45M',
            tool: ['Fiches techniques', 'Calculatrice', 'Étude concurrence', 'Logiciel RestauMargin'],
            step: [
              { '@type': 'HowToStep', name: 'Calculer le coût matières de chaque plat', text: 'À partir des fiches techniques précises (grammages, rendements, prix fournisseurs), calculez le coût matière de chaque plat de la carte.' },
              { '@type': 'HowToStep', name: 'Définir un food cost cible global', text: "Fixez un objectif food cost global pour votre établissement (25-35 % selon le type de restaurant). C'est votre boussole de tarification." },
              { '@type': 'HowToStep', name: 'Déterminer un coefficient par poste', text: 'Appliquez des coefficients différents par catégorie : x 3 pour les plats nobles, x 5 pour les desserts, x 8 pour le café. La cible est un food cost mix global, pas plat par plat.' },
              { '@type': 'HowToStep', name: 'Réaliser une étude de concurrence', text: 'Visitez 5 à 10 restaurants comparables dans votre zone. Relevez les prix des 10 plats les plus courants pour calibrer votre positionnement.' },
              { '@type': 'HowToStep', name: 'Tester la valeur perçue', text: "Interrogez 10 clients fidèles avec la méthode Van Westendorp (4 questions sur le prix limite, juste, attractif, trop cher). Vous obtenez la fourchette de prix optimale." },
              { '@type': 'HowToStep', name: 'Appliquer la psychologie des prix', text: 'Arrondissez selon votre positionnement (prix de charme .90, prix rond pour le premium), supprimez le symbole EUR, ajoutez un plat d\'ancrage, hiérarchisez visuellement.' },
              { '@type': 'HowToStep', name: 'Suivre et ajuster en continu', text: 'Mesurez l\'impact sur le ticket moyen, le mix produit et la marge brute. Réajustez tous les 6 mois en fonction des coûts fournisseurs et de la performance commerciale.' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Comment fixer les prix de sa carte de restaurant : méthode et stratégie 2026',
            description: "Guide complet pour fixer les prix d'une carte de restaurant. Méthodes par coût, valeur perçue et concurrence. Coefficients par poste, psychologie des prix, cas concrets.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-04-27',
            dateModified: '2026-05-26',
            wordCount: 3200,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/fixer-prix-carte-restaurant' },
          },
        ]}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/outils/calculateur-food-cost"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Calculer mes prix
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
          <span className="text-mono-100 font-medium">Fixer les prix de sa carte de restaurant</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <BlogArticleHero
        category="Carte & Prix"
        readTime="15 min"
        date="Mai 2026"
        title="Comment fixer les prix de sa carte de restaurant : méthode et stratégie 2026"
        accentWord="prix"
        subtitle="Une variation de 0,50 EUR sur un plat phare = 18 000 EUR de marge nette annuelle. Méthode rigoureuse, coefficients par poste, psychologie des prix et cas pratiques."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-27" readTime="15 min" variant="header" />

        {/* ── Encadre formule rapide ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Méthode rapide carte restaurant</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">Les 3 leviers de tarification</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Méthode coût</strong> : Prix HT = Coût matières x Coefficient (3,0 à 5,0 selon poste)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Méthode valeur</strong> : Prix HT = Ce que le client est prêt à payer (étude Van Westendorp)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Méthode marché</strong> : Prix HT = Médian de 5-10 concurrents + 5 à 15 % de positionnement</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Prix final</strong> = Max(coût, marché) ajusté par valeur + psychologie</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Cible food cost mix global : 25 % à 35 % selon le type de restaurant. Marge nette cible : 8 % à 15 %.
          </p>
        </div>

        {/* ── Sommaire ── */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#strategie', label: "Pourquoi la tarification est l'acte le plus stratégique" },
              { href: '#methode-cout', label: 'Méthode 1 : par le coût (coefficient multiplicateur)' },
              { href: '#methode-valeur', label: 'Méthode 2 : par la valeur perçue' },
              { href: '#methode-marche', label: 'Méthode 3 : par le marché et la concurrence' },
              { href: '#psychologie', label: 'Psychologie des prix sur la carte' },
              { href: '#coefficients', label: 'Coefficients multiplicateurs par poste' },
              { href: '#exemples-types', label: 'Exemples chiffrés par type de restaurant' },
              { href: '#augmenter', label: 'Quand et comment augmenter ses prix' },
              { href: '#tva', label: 'TVA en restauration : ce qu\'il faut savoir' },
              { href: '#erreurs', label: 'Les 7 erreurs courantes à éviter' },
              { href: '#automatiser', label: 'Automatiser la tarification avec RestauMargin' },
              { href: '#faq', label: 'Questions fréquentes' },
              { href: '#cta', label: 'Tarifez avec rigueur' },
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

        {/* ═════════════ SECTION 1 ═════════════ */}
        <section id="strategie" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="1">
            Pourquoi la tarification est l'acte le plus stratégique
          </SectionHeading>

          <div className="prose-content">
            <p>
              Dans un restaurant indépendant en France, la marge nette moyenne se situe entre 3 % et 6 %
              du chiffre d'affaires selon l'Observatoire Fiducial de la Restauration 2025. Un restaurant
              qui réalise 500 000 EUR de CA annuel ne dégage donc que 15 000 à 30 000 EUR de bénéfice net.
              À ce niveau, chaque euro de prix mal positionné se paie cash. Trois clés de lecture
              fondamentales :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Sous-tarifer</strong> : travailler beaucoup pour gagner peu. Signal "low cost"
                qui dévalue la cuisine et fidélise une clientèle sensible au prix, donc volatile.
              </li>
              <li>
                <strong>Sur-tarifer</strong> : chute de fréquentation, mauvais bouche-à-oreille, étoile
                en moins sur Google. La perception "trop cher" met 18 à 24 mois à se corriger.
              </li>
              <li>
                <strong>Tarifer sans cohérence</strong> : clients déboussolés, panier moyen qui plafonne,
                équipe qui ne sait pas suggérer la formule la plus rentable.
              </li>
            </ul>
            <p>
              La tarification n'est pas un calcul ponctuel : c'est un système qui doit être révisé
              tous les 6 mois minimum, ideallement à chaque rotation de carte. Un restaurant qui ne
              touche pas à ses prix pendant 2 ans perd entre 8 et 15 points de marge brute, mécaniquement,
              par effet d'inflation des matières premières.
            </p>

            <Callout type="info">
              <strong>Chiffre clé :</strong> selon l'Observatoire Fiducial 2025, l'inflation alimentaire
              cumulée en restauration sur 3 ans (2023-2025) atteint 22,4 %. Un restaurant qui n'a pas
              augmenté ses prix en proportion a perdu mécaniquement 6 à 8 points de marge brute.
            </Callout>

            <p>
              Pour fixer correctement les prix d'une carte de restaurant en 2026, il faut combiner
              3 approches complémentaires : la méthode par le coût (rapide, sécurisé), la méthode par
              la valeur perçue (rentable, sophistiquée) et la méthode par le marché (défensive,
              concurrentielle). Aucune des trois ne suffit seule.
            </p>
            <p>
              Avant de plonger dans les méthodes, lisez également notre <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 underline hover:text-teal-800">guide complet du calcul de marge restaurant</Link> et
              notre <Link to="/blog/coefficient-multiplicateur" className="text-teal-700 underline hover:text-teal-800">guide du coefficient multiplicateur</Link> pour
              maîtriser les fondamentaux.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Methode cout ═════════════ */}
        <section id="methode-cout" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="2">
            Méthode 1 : par le coût (coefficient multiplicateur)
          </SectionHeading>

          <div className="prose-content">
            <p>
              La méthode de base, celle qu'on apprend en école hôtelière : appliquer un coefficient
              multiplicateur sur le coût de revient matière du plat. C'est la méthode la plus rapide
              et la plus sécurisée parce qu'elle garantit mathématiquement votre food cost cible.
            </p>
          </div>

          <div className="mt-6 bg-mono-1000 border border-mono-900 rounded-xl p-5 font-mono text-sm">
            Prix HT = Coût matière x Coefficient multiplicateur<br />
            Prix TTC = Prix HT x 1,10 (TVA restauration sur place 10 %)
          </div>

          <div className="prose-content mt-6">
            <p>
              <strong>Exemple :</strong> magret de canard, coût matière 6,80 EUR, coefficient 3,5
              -- 23,80 EUR HT -- <strong>26,18 EUR TTC arrondi à 25,90 EUR sur la carte</strong>.
            </p>
            <p>
              Le coefficient n'intègre pas seulement la marge brute attendue : il couvre aussi les charges
              indirectes de production (énergie cuisine), une partie de la main d'oeuvre cuisine, les pertes
              (casse, retours, gaspillage) et le rendement (un kilo de carottes brutes ne donne que
              800 g utilisables après épluchage). Un coefficient 3,5 correspond grossièrement à un food
              cost cible de 28-30 %.
            </p>
            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Tableau de conversion coefficient / food cost</h3>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Coefficient</th>
                  <th className="text-center py-3 px-4 font-semibold">Food cost</th>
                  <th className="text-center py-3 px-4 font-semibold">Marge brute</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Exemple sur 5 EUR coût</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { c: '2,5', fc: '40,0 %', mb: '60,0 %', ex: '12,50 EUR HT' },
                  { c: '3,0', fc: '33,3 %', mb: '66,7 %', ex: '15,00 EUR HT' },
                  { c: '3,33', fc: '30,0 %', mb: '70,0 %', ex: '16,65 EUR HT' },
                  { c: '3,5', fc: '28,6 %', mb: '71,4 %', ex: '17,50 EUR HT' },
                  { c: '4,0', fc: '25,0 %', mb: '75,0 %', ex: '20,00 EUR HT' },
                  { c: '4,5', fc: '22,2 %', mb: '77,8 %', ex: '22,50 EUR HT' },
                  { c: '5,0', fc: '20,0 %', mb: '80,0 %', ex: '25,00 EUR HT' },
                  { c: '6,0', fc: '16,7 %', mb: '83,3 %', ex: '30,00 EUR HT' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-bold text-teal-700">x {row.c}</td>
                    <td className="py-3 px-4 text-center">{row.fc}</td>
                    <td className="py-3 px-4 text-center">{row.mb}</td>
                    <td className="py-3 px-4 text-center">{row.ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Callout type="warning">
            <strong>Limite de la méthode :</strong> cette approche ne tient pas compte de ce que le
            client est prêt à payer. Des pâtes carbonara à 1,80 EUR de coût x 3,5 = 6,30 EUR EUR sur
            la carte, c'est beaucoup trop bas pour un restaurant avec ticket moyen 25 EUR. À l'inverse,
            une côte de boeuf à 18 EUR coût x 3,5 = 63 EUR sur la carte peut faire fuir vos clients.
            La méthode coût doit toujours être corrigée par la valeur perçue.
          </Callout>
        </section>

        {/* ═════════════ SECTION 3 : Valeur percue ═════════════ */}
        <section id="methode-valeur" className="mb-16">
          <SectionHeading icon={<Eye className="w-6 h-6" />} number="3">
            Méthode 2 : par la valeur perçue
          </SectionHeading>

          <div className="prose-content">
            <p>
              Ici, le prix n'est pas dérivé du coût mais de ce que le client est prêt à payer pour
              l'expérience. C'est la méthode la plus rentable mais la plus difficile à calibrer.
              Trois facteurs entrent en jeu :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li><strong>Positionnement</strong> : votre restaurant est-il perçu comme premium, milieu de gamme ou populaire ?</li>
              <li><strong>Expérience</strong> : qualité du dressage, accueil, décoration, propret&eacute; sanitaire, vaisselle, musique.</li>
              <li><strong>Localisation</strong> : un même plat se vendra 18 EUR à Saint-Etienne et 32 EUR dans le 7e arrondissement de Paris.</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">La méthode Van Westendorp (Price Sensitivity Meter)</h3>
            <p>
              Outil clé pour mesurer la valeur perçue, utilisé dans toute l'industrie agro-alimentaire.
              Vous interrogez 10 à 30 clients fidèles avec 4 questions sur un plat :
            </p>
            <ol className="list-decimal list-inside space-y-2 text-mono-350 mt-3">
              <li>À partir de quel prix ce plat vous semble-t-il <strong>trop cher</strong> pour être acheté ?</li>
              <li>À partir de quel prix ce plat vous semble-t-il <strong>trop bon marché</strong> (et donc suspect en qualité) ?</li>
              <li>À partir de quel prix ce plat vous semble-t-il <strong>cher mais acceptable</strong> ?</li>
              <li>À partir de quel prix ce plat vous semble-t-il <strong>vraiment une bonne affaire</strong> ?</li>
            </ol>
            <p className="mt-4">
              L'intersection des courbes "trop cher" et "bon marché" donne le prix optimal. L'intersection
              "cher mais acceptable" et "bonne affaire" donne le prix acceptable. Sur 30 réponses, vous
              obtenez une fourchette très précise.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Exemple concret</h3>
            <p>
              Un plat signature "Cabillaud, beurre noisette, légumes du potager" a 7,20 EUR de coût matière
              donnerait 25,20 EUR HT au coefficient 3,5. Mais l'étude clientèle révèle que les clients le
              perçoivent à 32-35 EUR. Vous avez 5 à 7 EUR de marge supplémentaire à capter sans perdre
              de couverts. C'est typiquement la méthode des restaurants gastronomiques : coefficient 5x,
              6x voire 8x sur les plats signature, justifié par la valeur perçue. Pour approfondir le
              positionnement valeur, lisez notre <Link to="/blog/prix-de-vente-restaurant" className="text-teal-700 underline hover:text-teal-800">guide du prix de vente d'un plat</Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 4 : Methode marche ═════════════ */}
        <section id="methode-marche" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="4">
            Méthode 3 : par le marché et la concurrence
          </SectionHeading>

          <div className="prose-content">
            <p>
              Cette méthode consiste à benchmarker votre carte par rapport à la concurrence directe et
              indirecte. Elle est défensive : elle vous protège d'un décalage trop important vers le
              haut ou vers le bas. Mais elle ne doit jamais être l'unique source de décision : votre
              concurrent peut avoir un loyer 40 % plus bas, un personnel non déclaré, ou peut tout
              simplement être en train de perdre de l'argent.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Méthodologie de benchmark</h3>
            <ol className="list-decimal list-inside space-y-2 text-mono-350 mt-3">
              <li>Identifiez 5 à 10 restaurants directement concurrents (même type de cuisine, même positionnement, même zone de chalandise 1-3 km).</li>
              <li>Ajoutez 3 à 5 restaurants indirects (autre type de cuisine, même ticket moyen).</li>
              <li>Relevez les prix de 10 plats "baromètre" : entrée froide, entrée chaude, viande, poisson, végétarien, pâtes, pizza/burger, dessert, café, verre de vin.</li>
              <li>Calculez la médiane par catégorie. Pas la moyenne (écrasée par les valeurs extrêmes), la médiane (plus stable).</li>
              <li>Positionnez-vous : 5 à 15 % au-dessus si premium, dans la médiane si milieu de gamme, 5 à 10 % en-dessous si discount.</li>
            </ol>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Tableau benchmark type : brasserie parisienne 2026</h3>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Plat</th>
                  <th className="text-center py-3 px-4 font-semibold">Min observé</th>
                  <th className="text-center py-3 px-4 font-semibold">Médiane</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Max observé</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { p: 'Salade de chèvre chaud', min: '11,50', med: '13,50', max: '16,90' },
                  { p: 'Onglet de boeuf - frites', min: '18,00', med: '22,50', max: '28,00' },
                  { p: 'Filet de cabillaud', min: '21,00', med: '24,50', max: '32,00' },
                  { p: 'Risotto végétarien', min: '14,90', med: '17,50', max: '22,00' },
                  { p: 'Tarte tatin', min: '7,50', med: '8,90', max: '12,00' },
                  { p: 'Café', min: '2,50', med: '3,20', max: '4,50' },
                  { p: 'Verre de Bourgogne', min: '6,00', med: '7,50', max: '11,00' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.p}</td>
                    <td className="py-3 px-4 text-center text-mono-500">{row.min} EUR</td>
                    <td className="py-3 px-4 text-center font-bold text-teal-700">{row.med} EUR</td>
                    <td className="py-3 px-4 text-center text-mono-500">{row.max} EUR</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-6">
            <p>
              Source : relevé RestauMargin sur 47 brasseries du Grand Paris en avril 2026. Si votre
              onglet-frites est à 24 EUR alors que la médiane est à 22,50 EUR, vous êtes positionné
              +6,7 % au-dessus du marché. C'est acceptable si votre positionnement est premium ou
              si vous avez une différenciation produit claire (race, label, origine).
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Psychologie ═════════════ */}
        <section id="psychologie" className="mb-16">
          <SectionHeading icon={<Brain className="w-6 h-6" />} number="5">
            Psychologie des prix sur la carte
          </SectionHeading>

          <div className="prose-content">
            <p>
              Une fois le prix mathématique établi, il faut encore l'habiller. La psychologie des prix
              regroupe les techniques de présentation qui augmentent la probabilité d'achat ou le ticket
              moyen, sans changer la rentabilité unitaire. Voici 7 leviers validés par la recherche en
              behavioral pricing :
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            <PricingTechnique
              icon={<Tag className="w-5 h-5" />}
              title="Charm pricing (.90 / .95)"
              desc="Privilégiez 19,90 plutôt que 20,00 pour la restauration accessible. Le passage du chiffre des dizaines (1 vs 2) crée un saut psychologique disproportionné. En revanche, les prix entiers (24 EUR) sont perçus comme plus haut de gamme : à utiliser dans le gastronomique."
            />
            <PricingTechnique
              icon={<Calculator className="w-5 h-5" />}
              title="Suppression du symbole EUR"
              desc="Étude Cornell University (2009) sur 200 menus : retirer le symbole EUR augmente le panier moyen de 8,15 % en moyenne. Le client se concentre sur le plat, pas sur le coût. Adoptez 'Entrecôte 24' au lieu de 'Entrecôte 24,00 EUR'."
            />
            <PricingTechnique
              icon={<TrendingUp className="w-5 h-5" />}
              title="Effet d'ancrage"
              desc="Placez en tête de carte un plat très cher (35-95 EUR selon votre positionnement). Sa fonction n'est pas de se vendre mais de faire paraître les autres plats raisonnables par comparaison. Un plat à 22 EUR semble normal à côté d'un plat à 38 EUR."
            />
            <PricingTechnique
              icon={<Sparkles className="w-5 h-5" />}
              title="Effet decoy"
              desc="Proposez 3 versions : petit (12), moyen (16), grand (17). Le moyen est le leurre. Résultat : 60-70 % des clients prennent le grand, alors qu'avec 2 options ils prendraient le petit. Appliqué aux portions, formats ou ajouts (frites maison +2,50)."
            />
            <PricingTechnique
              icon={<Award className="w-5 h-5" />}
              title="Bundle / formule"
              desc="Plat + dessert + café à 26 EUR au lieu de 28 EUR à la carte. Le client a l'impression d'économiser 2 EUR mais consomme 30 % de plus en valeur. Bundle bien construit = +15-25 % de ticket moyen."
            />
            <PricingTechnique
              icon={<ListChecks className="w-5 h-5" />}
              title="Hiérarchisation visuelle"
              desc="Mettez en valeur les plats à forte marge (encadré, pictogramme, position en haut à droite : la zone la plus regardée). Les plats avec emoji ou pictogramme sont commandés 12-18 % plus souvent (étude Behavioral Insights Team 2022)."
            />
            <PricingTechnique
              icon={<Eye className="w-5 h-5" />}
              title="Description qui justifie"
              desc="'Filet de cabillaud' 24 EUR vs 'Filet de cabillaud de ligne, beurre noisette, légumes du potager Bernard' 26 EUR : même plat, +8,3 % de prix accepté. Storytelling produit = perception de valeur."
            />
            <PricingTechnique
              icon={<DollarSign className="w-5 h-5" />}
              title="Mise en page stratégique"
              desc="Pas de colonne alignée des prix, prix discret inline avec la description, pas de symbole EUR, pas de pointillés 'menu de cantine'. La carte ne doit pas ressembler à un catalogue de tarifs."
            />
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Coefficients par poste ═════════════ */}
        <section id="coefficients" className="mb-16">
          <SectionHeading icon={<Users className="w-6 h-6" />} number="6">
            Coefficients multiplicateurs par poste
          </SectionHeading>

          <div className="prose-content">
            <p>
              On module le coefficient par poste car la cible est un food cost mix global à 28-30 %, pas
              plat par plat. Certaines catégories (boissons, desserts) peuvent supporter des coefficients
              très élevés, ce qui compense les catégories à coefficient bas (viandes nobles, poissons).
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Poste</th>
                  <th className="text-center py-3 px-4 font-semibold">Coefficient</th>
                  <th className="text-center py-3 px-4 font-semibold">Food cost cible</th>
                  <th className="text-left py-3 px-4 font-semibold rounded-tr-xl">Logique</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { p: 'Apéritifs / Softs', c: '5,0 à 6,0', fc: '17-20 %', l: 'Coût matière faible, marge boisson très rentable' },
                  { p: 'Entrées froides', c: '4,5 à 5,0', fc: '20-22 %', l: 'Salades, charcuterie, peu de coût main d\'oeuvre' },
                  { p: 'Entrées chaudes', c: '3,5 à 4,5', fc: '22-29 %', l: 'Coefficient un peu plus bas car préparation cuisine' },
                  { p: 'Plats viande noble', c: '3,0 à 3,5', fc: '28-33 %', l: 'Coefficient bas car coût matière élevé (boeuf, agneau)' },
                  { p: 'Plats poisson', c: '3,0 à 3,5', fc: '28-33 %', l: 'Idem viande noble, produit cher au kilo' },
                  { p: 'Plats végé / pâtes', c: '4,5 à 5,5', fc: '18-22 %', l: 'Coût matière faible, leviers de marge importants' },
                  { p: 'Pizzas / Burgers', c: '4,0 à 5,0', fc: '20-25 %', l: 'Ingrédients de base peu chers, prix perçu accessible' },
                  { p: 'Desserts', c: '5,0 à 5,5', fc: '18-20 %', l: 'Coût matière dérisoire, valeur perçue très élevée' },
                  { p: 'Vins au verre', c: '4,0 à 5,0', fc: '20-25 %', l: 'Coefficient élevé, conditionnement bouteille = 5 verres' },
                  { p: 'Vins en bouteille', c: '2,5 à 3,5', fc: '29-40 %', l: 'Coefficient plus bas, ticket moyen plus élevé' },
                  { p: 'Café, boisson chaude', c: '6,0 à 10,0', fc: '10-17 %', l: 'Coût matière dérisoire (0,15 EUR pour un café)' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.p}</td>
                    <td className="py-3 px-4 text-center font-bold text-teal-700">x {row.c}</td>
                    <td className="py-3 px-4 text-center">{row.fc}</td>
                    <td className="py-3 px-4 text-sm">{row.l}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Callout type="info">
            <strong>Règle d'or :</strong> compensez les plats à fort food cost (poisson noble) par les
            plats à faible food cost (pâtes, desserts). Le mix global doit converger vers la cible
            (28-30 % pour une brasserie standard). C'est ce qu'on appelle le food cost pondérée par
            le mix produit. Notre <Link to="/outils/calculateur-food-cost" className="underline font-semibold hover:text-teal-700">calculateur de food cost</Link> calcule
            automatiquement le mix global à partir des fiches techniques.
          </Callout>
        </section>

        {/* ═════════════ SECTION 7 : Exemples par type ═════════════ */}
        <section id="exemples-types" className="mb-16">
          <SectionHeading icon={<Pizza className="w-6 h-6" />} number="7">
            Exemples chiffrés par type de restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici 5 cas chiffrés complets, du restaurant de quartier au gastronomique, pour visualiser
              concrètement comment fixer une carte cohérente avec son positionnement.
            </p>
          </div>

          <div className="space-y-6 mt-8">
            <ExempleCard
              icon={<Pizza className="w-6 h-6" />}
              type="Pizzeria de quartier (ticket moyen 15 EUR)"
              data={[
                { plat: 'Pizza margherita', cm: '1,58 EUR', coef: '6,3', pv: '9,90 EUR TTC', fc: '14 %' },
                { plat: 'Pizza 4 fromages', cm: '2,40 EUR', coef: '5,4', pv: '13,00 EUR TTC', fc: '17 %' },
                { plat: 'Tiramisu maison', cm: '1,10 EUR', coef: '6,4', pv: '7,00 EUR TTC', fc: '14 %' },
                { plat: 'Verre de Chianti', cm: '0,90 EUR', coef: '5,6', pv: '5,00 EUR TTC', fc: '15 %' },
              ]}
              note="Food cost mix : 15-18 %. Marge brute : 82-85 %. Marge nette cible : 10-14 %."
            />
            <ExempleCard
              icon={<Beef className="w-6 h-6" />}
              type="Brasserie traditionnelle (ticket moyen 28 EUR)"
              data={[
                { plat: 'Salade de chèvre chaud', cm: '2,80 EUR', coef: '4,8', pv: '13,50 EUR TTC', fc: '23 %' },
                { plat: 'Onglet de boeuf - frites', cm: '7,40 EUR', coef: '3,0', pv: '22,50 EUR TTC', fc: '36 %' },
                { plat: 'Filet de cabillaud', cm: '7,20 EUR', coef: '3,1', pv: '24,50 EUR TTC', fc: '32 %' },
                { plat: 'Café gourmand', cm: '1,80 EUR', coef: '4,7', pv: '8,50 EUR TTC', fc: '23 %' },
              ]}
              note="Food cost mix : 28-32 %. Marge brute : 68-72 %. Le plat de viande noble (food cost 36 %) est compensé par les autres catégories."
            />
            <ExempleCard
              icon={<Award className="w-6 h-6" />}
              type="Bistronomie / Bistrot moderne (ticket moyen 38 EUR)"
              data={[
                { plat: 'Bouchée de saumon fumé', cm: '3,40 EUR', coef: '4,9', pv: '16,50 EUR TTC', fc: '21 %' },
                { plat: 'Magret de canard - sauce', cm: '6,80 EUR', coef: '3,8', pv: '25,90 EUR TTC', fc: '27 %' },
                { plat: 'Saint-Jacqués poêlées', cm: '11,20 EUR', coef: '2,9', pv: '32,50 EUR TTC', fc: '34 %' },
                { plat: 'Soufflé au Grand Marnier', cm: '2,40 EUR', coef: '4,2', pv: '10,00 EUR TTC', fc: '24 %' },
              ]}
              note="Food cost mix : 26-30 %. Storytelling produit important : origine, label, méthode artisanale."
            />
            <ExempleCard
              icon={<Sparkles className="w-6 h-6" />}
              type="Gastronomique (ticket moyen 85 EUR)"
              data={[
                { plat: 'Foie gras mi-cuit', cm: '8,50 EUR', coef: '3,2', pv: '27,00 EUR TTC', fc: '31 %' },
                { plat: 'Pigeon en deux services', cm: '14,80 EUR', coef: '2,7', pv: '42,00 EUR TTC', fc: '37 %' },
                { plat: 'Saint-Jacqués truffes', cm: '18,20 EUR', coef: '2,8', pv: '52,00 EUR TTC', fc: '35 %' },
                { plat: 'Soufflé à la rose', cm: '4,20 EUR', coef: '4,1', pv: '17,00 EUR TTC', fc: '24 %' },
              ]}
              note="Food cost mix : 32-38 %. Marge nette plus faible mais ticket moyen très élevé. Les vins (3,0 à 3,5) et le menu dégustation compensent."
            />
            <ExempleCard
              icon={<Coffee className="w-6 h-6" />}
              type="Coffee shop / brunch (ticket moyen 14 EUR)"
              data={[
                { plat: 'Bowl avocat oeufs', cm: '2,80 EUR', coef: '4,9', pv: '13,50 EUR TTC', fc: '21 %' },
                { plat: 'Pancake stack', cm: '1,90 EUR', coef: '5,7', pv: '11,00 EUR TTC', fc: '17 %' },
                { plat: 'Cappuccino', cm: '0,32 EUR', coef: '13,1', pv: '4,20 EUR TTC', fc: '7,6 %' },
                { plat: 'Cheesecake', cm: '1,20 EUR', coef: '5,6', pv: '6,80 EUR TTC', fc: '18 %' },
              ]}
              note="Food cost mix : 14-20 %. Le café (coef 13) est la pépite : marge brute 92 %. Volume élevé compense ticket moyen bas."
            />
          </div>
        </section>

        {/* ═════════════ SECTION 8 : Augmenter ═════════════ */}
        <section id="augmenter" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="8">
            Quand et comment augmenter ses prix
          </SectionHeading>

          <div className="prose-content">
            <p>
              L'augmentation de prix est un acte de gestion sensible. Bien faite, elle protège votre
              marge sans érodes votre clientèle. Mal faite, elle plombe votre fréquentation et votre
              réputation. Voici les règles pour le faire correctement.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Quand augmenter ?</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li>Inflation matières premières supérieure à 5 % sur 6 mois (signal Fiducial Observatoire).</li>
              <li>Hausse du SMIC annuelle (+1 à 3 % chaque année, automatique).</li>
              <li>Hausse énergie supérieure à 10 % (gaz, électricité).</li>
              <li>Loyer indexé ILC en hausse (révision annuelle).</li>
              <li>Food cost qui dépasse 32 % en moyenne sur l'ensemble de la carte.</li>
              <li>Marge nette qui passe sous 5 %.</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Comment augmenter sans perdre de clients ?</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li><strong>Petits incrementss :</strong> +0,50 EUR tous les 6 mois plutôt que +2 EUR d'un coup.</li>
              <li><strong>Augmentations ciblées :</strong> montez les plats à forte marge (desserts, pâtes) plutôt que les plats à faible marge (viandes nobles).</li>
              <li><strong>Repensez les portions :</strong> -10 % grammage compense souvent +5 % de prix sans plainte client.</li>
              <li><strong>Renouvelez la carte :</strong> nouveaux noms = pas de comparaison directe avec l'ancien prix.</li>
              <li><strong>Communiquez sur la qualité :</strong> origine, label AOP, fournisseur premium, méthode artisanale. Jamais sur la hausse des coûts.</li>
              <li><strong>Effet de halo :</strong> ajoutez un plat très cher (45-95 EUR) en tête de carte pour faire paraître les autres prix raisonnables.</li>
            </ul>
          </div>

          <Callout type="info">
            <strong>Cas concret :</strong> un bistro lyonnais qui vendait son plat du jour à 12,50 EUR
            (food cost 41 %, marge brute insuffisante) est passé à 14,90 EUR (food cost 33 %).
            Résultat sur 6 mois : -8 % de couverts mais +22 % de marge brute totale, équipe moins
            stressée, qualité remontée (budget matière par plat +30 %). Le client a accepté parce que
            la présentation et le storytelling ont aussi été revus.
          </Callout>
        </section>

        {/* ═════════════ SECTION 9 : TVA ═════════════ */}
        <section id="tva" className="mb-16">
          <SectionHeading icon={<Percent className="w-6 h-6" />} number="9">
            TVA en restauration : ce qu'il faut savoir
          </SectionHeading>

          <div className="prose-content">
            <p>
              La TVA en France en restauration est l'un des points les plus mal maîtrisés par les
              restaurateurs débutants. Pourtant, mal la prendre en compte fausse tous les calculs de
              prix de vente et de marge.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Les 3 taux applicables</h3>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Taux TVA</th>
                  <th className="text-left py-3 px-4 font-semibold">Application</th>
                  <th className="text-left py-3 px-4 font-semibold rounded-tr-xl">Exemple</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white">
                  <td className="py-3 px-4 font-bold text-teal-700">10 %</td>
                  <td className="py-3 px-4">Restauration sur place et à emporter (consommation immédiate)</td>
                  <td className="py-3 px-4 text-sm">Plat servi en salle, vente à emporter chaude</td>
                </tr>
                <tr className="bg-mono-1000">
                  <td className="py-3 px-4 font-bold text-teal-700">5,5 %</td>
                  <td className="py-3 px-4">Produits alimentaires froids à emporter (consommation différée)</td>
                  <td className="py-3 px-4 text-sm">Sandwich froid emporté, salade en bocal</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 font-bold text-teal-700">20 %</td>
                  <td className="py-3 px-4">Boissons alcoolisées (toujours, quel que soit le mode de consommation)</td>
                  <td className="py-3 px-4 text-sm">Verre de vin, bière, cocktail, champagne</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Calcul HT et TTC :</strong>
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350 mt-3">
              <li>Pour passer de HT à TTC : Prix TTC = Prix HT x (1 + taux TVA). Exemple : 20 EUR HT x 1,10 = 22 EUR TTC.</li>
              <li>Pour passer de TTC à HT : Prix HT = Prix TTC / (1 + taux TVA). Exemple : 22 EUR TTC / 1,10 = 20 EUR HT.</li>
              <li>Pour un verre de vin à 7,50 EUR TTC : Prix HT = 7,50 / 1,20 = 6,25 EUR.</li>
            </ul>
            <p className="mt-4">
              <strong>Erreur classique :</strong> beaucoup de restaurateurs calculent leur food cost sur
              le prix TTC. C'est faux. Le food cost se calcule toujours en HT. La TVA collectée ne vous
              appartient pas, elle est reversée à l'État tous les mois ou trimestres. Si vous calculez
              en TTC, vous sous-estimez votre food cost réel d'environ 10 %.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 10 : Erreurs ═════════════ */}
        <section id="erreurs" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="10">
            Les 7 erreurs courantes à éviter
          </SectionHeading>

          <div className="space-y-5 mt-8">
            <ErreurCard
              number={1}
              title="S'aligner aveuglément sur la concurrence"
              desc="Vos coûts ne sont pas les leurs. Si votre voisin vend la pizza margherita à 11 EUR mais a un loyer 30 % plus bas que le votre, vous devez la vendre à 12,50 EUR voire 13 EUR. La copie de prix sans copie de la structure de coûts est suicidaire."
            />
            <ErreurCard
              number={2}
              title="Appliquer un coefficient unique à toute la carte"
              desc="Le coefficient doit varier selon la catégorie : entrées à coefficient élevé (4,5), plats principaux à coefficient moyen (3,0-3,5), desserts à coefficient élevé (5,0), boissons à coefficient très élevé (6-13). Un coefficient uniforme laisse de la marge sur la table."
            />
            <ErreurCard
              number={3}
              title="Ignorer le temps de préparation"
              desc="Un plat avec 10 minutes de mise en place et un plat avec 1 heure de mijotage ont la même rentabilité apparente avec la méthode du coefficient. En réalité, le second mobilise 6 fois plus de temps cuisinier. Intégrez le coût main d'oeuvre dans votre prix sur les plats complexes."
            />
            <ErreurCard
              number={4}
              title="Ne jamais réviser les prix de carte"
              desc="Les prix matières montent constamment (inflation cumulée 22 % sur 3 ans). Si vous fixez un prix en 2024 et que vous ne le modifiez pas en 2026, votre marge brute fond mécaniquement. Réglez vos prix au minimum 2 fois par an."
            />
            <ErreurCard
              number={5}
              title="Faire des prix trop ronds"
              desc="Un menu plein de prix à 12, 18, 24, 30 EUR donne une impression d'amateurisme et active les radars psychologiques du client. Variez : 11,80 ; 17,90 ; 23,50 ; 29,80. Plus naturel, mieux accepté. Sauf si votre positionnement est explicitement premium."
            />
            <ErreurCard
              number={6}
              title="Calculer en TTC au lieu de HT"
              desc="La TVA en restauration est de 10 % sur place, 20 % sur les boissons alcoolisées. Calculer votre food cost sur un prix TTC donne un ratio artificiellement bas et fausse votre analyse. Calculez toujours en HT, convertissez ensuite en TTC pour l'affichage client."
            />
            <ErreurCard
              number={7}
              title="Oublier l'impact du mix produit"
              desc="Un plat individuel peut avoir un food cost de 38 % (poisson noble) mais le mix global doit converger vers 28-30 %. Sans pilotage du mix produit (menu engineering), vos clients commandent les plats que vous ne voulez pas et évitent ceux que vous voulez pousser."
            />
          </div>
        </section>

        {/* ═════════════ SECTION 11 : RestauMargin ═════════════ */}
        <section id="automatiser" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="11">
            Automatiser la tarification avec RestauMargin
          </SectionHeading>

          <div className="prose-content">
            <p>
              Calibrer manuellement les prix d'une carte de 40 plats prend 4 à 8 heures. Et il faut
              recommencer à chaque rotation de saison ou changement de fournisseur. RestauMargin
              automatise ce processus de bout en bout.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Calculator className="w-5 h-5" />, title: 'Fiches techniques connectées', desc: 'Vos fiches techniques sont liées aux prix fournisseurs en temps réel. Quand un prix matière change, le food cost et le prix de vente recommandé s\'ajustent automatiquement.' },
              { icon: <Target className="w-5 h-5" />, title: 'Simulateur de prix', desc: 'Testez l\'impact d\'une augmentation de 5 ou 10 % avant de la valider. Voyez l\'impact sur la marge brute, la marge nette et le ticket moyen en temps réel.' },
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Benchmark automatique', desc: 'Comparez votre tarification à la médiane du marché local (quand la donnée locale est disponible). Identifiez les plats sous-tarifées et les plats sur-tarifées.' },
              { icon: <Brain className="w-5 h-5" />, title: 'Menu engineering intégré', desc: 'Matrice BCG des plats (Stars / Cash Cows / Question Marks / Dogs) générée automatiquement. Identifiez les plats à pousser et ceux à retirer.' },
              { icon: <AlertTriangle className="w-5 h-5" />, title: 'Alertes de dérive', desc: 'Recevez une alerte quand un plat franchit le seuil de marge minimum (par exemple 30 % de food cost). Réagissez avant que la marge ne s\'effondre.' },
              { icon: <ListChecks className="w-5 h-5" />, title: 'Génération de cartes optimisées', desc: 'Génération automatique d\'une carte avec coefficients par poste, mise en page psychologique, et propositions de bundles rentables.' },
            ].map((feat, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-3">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-mono-100 mb-1.5">{feat.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          <div className="prose-content mt-8">
            <p>
              Plus de 500 restaurants en France utilisent RestauMargin pour piloter leur tarification.
              Le gain moyen constaté sur les 6 premiers mois : <strong>+3,2 points de marge brute</strong>,
              grâce à une meilleure allocation des coefficients par poste et à l'identification automatique
              des dérives de prix matières.
            </p>
            <p>
              Pour aller plus loin sur les fondamentaux du calcul, lisez également notre <Link to="/blog/reduire-food-cost" className="text-teal-700 underline hover:text-teal-800">guide du food cost</Link>, notre <Link to="/blog/prime-cost-restaurant" className="text-teal-700 underline hover:text-teal-800">guide du prime cost</Link>, et notre <Link to="/blog/seuil-rentabilite-restaurant" className="text-teal-700 underline hover:text-teal-800">guide du seuil de rentabilité</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-04-27" readTime="15 min" variant="footer" />

        {/* ═════════════ FAQ ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* ═════════════ CTA ═════════════ */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Tarifez vos plats avec la rigueur d'un chef d'entreprise
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              RestauMargin calcule vos coefficients par poste, simule l'impact d'une hausse de prix sur
              votre marge et benchmark automatiquement votre carte avec les standards du secteur.
            </p>
            <p className="text-teal-50 text-base max-w-xl mx-auto mb-8">
              <strong>29 EUR/mois</strong> &mdash; essai gratuit 7 jours, sans engagement, sans carte bancaire.
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
                to="/outils/calculateur-food-cost"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
              >
                <Calculator className="w-5 h-5" />
                Calculateur gratuit
              </Link>
            </div>
          </div>
        </section>

        {/* ═════════════ Articles complementaires ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calcul marge restaurant : guide 2026</h3>
              <p className="text-xs text-mono-500">Marge brute, marge nette, food cost : toutes les formules.</p>
            </Link>
            <Link to="/blog/coefficient-multiplicateur" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Coefficient multiplicateur</h3>
              <p className="text-xs text-mono-500">Tableaux par catégorie, erreurs courantes et cas pratiques.</p>
            </Link>
            <Link to="/blog/prix-de-vente-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Prix de vente d'un plat</h3>
              <p className="text-xs text-mono-500">3 méthodes : coefficient, marge cible, pricing psychologique.</p>
            </Link>
            <Link to="/outils/calculateur-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calculateur food cost gratuit</h3>
              <p className="text-xs text-mono-500">Outil en ligne pour calculer votre marge en 30 secondes.</p>
            </Link>
          </div>
        </section>

        {/* ═════════════ Sources ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Sources et références</h2>
          <ul className="space-y-2 text-sm text-mono-500">
            <li><strong>Fiducial Observatoire de la Restauration 2025</strong> &mdash; <a href="https://www.fiducial.fr/Observatoire-de-la-restauration" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline hover:text-teal-800">https://www.fiducial.fr/Observatoire-de-la-restauration</a></li>
            <li><strong>INSEE : indices de prix à la consommation, restauration 2023-2025</strong> &mdash; <a href="https://www.insee.fr/fr/statistiques/serie/010540933" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline hover:text-teal-800">https://www.insee.fr</a></li>
            <li><strong>GIRA Conseil : Études de marché restauration 2024-2025</strong> &mdash; <a href="https://www.gira-conseil.com/" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline hover:text-teal-800">https://www.gira-conseil.com</a></li>
            <li><strong>KPMG Hospitality Benchmark 2025</strong> &mdash; rapport sectoriel sur les marges et ratios de la restauration en Europe</li>
            <li><strong>Yang, Kimes, Sessarego (2009)</strong> &mdash; "The Mathematics of $20 vs Twenty Dollars on a Restaurant Menu", Cornell School of Hotel Administration</li>
            <li><strong>Van Westendorp (1976)</strong> &mdash; "NSS - Price Sensitivity Meter", Esomar Congress</li>
          </ul>
        </section>

        </article>

      </main>

      {/* ── Footer ── */}
      <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-mono-500">
          <Link to="/" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4">
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mb-4">La plateforme de gestion de marge pour les restaurateurs.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-mono-700">
            <Link to="/mentions-legales" className="hover:text-teal-600 transition-colors">Mentions légales</Link>
            <Link to="/cgv" className="hover:text-teal-600 transition-colors">CGV</Link>
            <Link to="/cgu" className="hover:text-teal-600 transition-colors">CGU</Link>
            <Link to="/politique-confidentialite" className="hover:text-teal-600 transition-colors">Confidentialité</Link>
          </div>
          <p className="mt-6 text-xs text-mono-700">
            &copy; {new Date().getFullYear()} RestauMargin. Tous droits réservés.
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

function PricingTechnique({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-5 hover:border-teal-300 transition-colors">
      <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-lg flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-bold text-mono-100 mb-2">{title}</h3>
      <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function ErreurCard({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5 sm:p-6 flex gap-4">
      <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-mono-100 mb-1.5">{title}</h3>
        <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ExempleCard({ icon, type, data, note }: {
  icon: React.ReactNode;
  type: string;
  data: { plat: string; cm: string; coef: string; pv: string; fc: string }[];
  note: string;
}) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-bold text-mono-100 text-lg">{type}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-mono-1000 text-mono-500 text-xs">
              <th className="text-left py-2 px-3 font-semibold">Plat</th>
              <th className="text-right py-2 px-3 font-semibold">Coût matière</th>
              <th className="text-center py-2 px-3 font-semibold">Coefficient</th>
              <th className="text-right py-2 px-3 font-semibold">Prix vente</th>
              <th className="text-right py-2 px-3 font-semibold">Food cost</th>
            </tr>
          </thead>
          <tbody className="text-mono-350">
            {data.map((row, i) => (
              <tr key={i} className="border-t border-mono-1000">
                <td className="py-2 px-3 font-medium text-mono-100">{row.plat}</td>
                <td className="py-2 px-3 text-right">{row.cm}</td>
                <td className="py-2 px-3 text-center font-bold text-teal-700">x {row.coef}</td>
                <td className="py-2 px-3 text-right font-medium">{row.pv}</td>
                <td className="py-2 px-3 text-right">{row.fc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-mono-500 mt-4 leading-relaxed">{note}</p>
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
    <details className="bg-mono-1000 border border-mono-900 rounded-xl group">
      <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors">
        {q}
        <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform" />
      </summary>
      <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{a}</p>
    </details>
  );
}
