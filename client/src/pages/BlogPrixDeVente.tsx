import { Link } from 'react-router-dom';
import { ChefHat, Calculator, ArrowRight, BookOpen, Users, Zap, AlertTriangle, Lightbulb, ListChecks, Target, TrendingUp, Sparkles, Pizza, Tag, Brain, Award, BarChart3, DollarSign, Coffee, Beef } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Comment calculer le prix de vente d'un plat"
   Mot-clé principal : prix de vente restaurant
   ~3 100 mots — KD 30, ~400/mois search volume
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Comment calculer le prix de vente d'un plat de restaurant ?",
    answer: "Multipliez le coût matières (food cost) par votre coefficient multiplicateur cible. Pour un food cost de 30 % visé, le coefficient est 3,33. Exemple : un plat avec 5 EUR de coût matières vaut 5 x 3,33 = 16,65 EUR HT, soit environ 18,30 EUR TTC en restauration sur place.",
  },
  {
    question: 'Quel coefficient multiplicateur appliquer en restauration ?',
    answer: "Le coefficient varie selon le type d'établissement : 3,0 à 3,3 pour un restaurant traditionnel, 3,3 à 4,0 pour une brasserie, 3,6 à 4,5 pour une pizzeria, 2,5 à 3,3 pour un gastronomique. Le coefficient est l'inverse du food cost cible (1 / FC).",
  },
  {
    question: "Faut-il calculer le prix de vente en HT ou en TTC ?",
    answer: "Calculez toujours votre prix HT en interne (c'est sur lui que portent vos calculs de marge), puis convertissez en TTC pour l'affichage client. En France : Prix TTC = Prix HT x 1,10 pour la restauration sur place (TVA 10 %), x 1,055 pour certains produits à emporter froids, x 1,20 sur les boissons alcoolisées.",
  },
  {
    question: "Comment fixer un prix sans se brader ni faire fuir les clients ?",
    answer: "Équilibrez 3 contraintes : votre coût (vous voulez 65-75 % de marge brute), le marché (regardez les prix concurrents pour un plat équivalent dans votre zone), la perception client (votre clientèle cible accepte-t-elle 22 ou 28 EUR pour ce plat ?). Le bon prix est l'intersection des trois.",
  },
  {
    question: "C'est quoi le pricing psychologique en restauration ?",
    answer: "Le pricing psychologique exploite les biais cognitifs : prix de charme (19,90 plutôt que 20), suppression du symbole EUR sur le menu (augmente la dépense moyenne de 8 à 12 % selon Cornell), effet d'ancrage (placer un plat très cher pour faire paraître les autres abordables), effet decoy (un plat leurre qui n'est jamais commandé mais augmente la valeur perçue des autres).",
  },
  {
    question: "Comment ajuster les prix face à l'inflation ?",
    answer: "Trois leviers : (1) augmentation directe progressive (+2-5 % par an, pas plus pour ne pas perdre de clients), (2) shrinkflation (réduction discrète des portions de 5-10 %), (3) substitution d'ingrédients (remplacer une variété chère par une moins coûteuse à qualité équivalente). RestauMargin alerte automatiquement quand un plat passe sous votre marge cible.",
  },
  {
    question: "Combien doit coûter un plat par rapport à son prix de vente ?",
    answer: "La règle de l'industrie : le coût matières ne doit pas dépasser 30-35 % du prix de vente HT. Sur un plat à 20 EUR HT, vous pouvez investir entre 6 et 7 EUR de matières premières maximum, sans quoi votre marge brute tombe sous 65 % et la viabilité économique du plat est compromise.",
  },
  {
    question: "Comment justifier un prix élevé à sa clientèle ?",
    answer: "Travaillez la perception de valeur : storytelling produit (origine, producteur, méthode), présentation (dressage, vaisselle, salle), service (accueil personnalisé, conseil), exclusivité (produits rares, édition limitée). Un steak frites à 30 EUR doit raconter une histoire que celui à 18 EUR ne raconte pas.",
  },
  {
    question: "Quel est l'impact du temps de préparation sur le prix de vente ?",
    answer: "Un plat avec 1 heure de mise en place mobilise 22-28 EUR/h de coût cuisinier en 2026. Pour les plats complexes, calculez un 'prime cost' (food cost + coût main d'oeuvre direct). Si le prime cost dépasse 60 % du PV HT, le plat n'est pas viable. Soit vous le simplifiez, soit vous augmentez le prix.",
  },
  {
    question: "Comment fixer le prix d'une formule (entrée + plat + dessert) ?",
    answer: "Calculez la somme des 3 prix individuels HT, puis appliquez une remise de 8 à 15 % pour créer l'effet bundle. Exemple : entrée 8 EUR + plat 18 EUR + dessert 7 EUR = 33 EUR cumulés, formule à 29 EUR (remise 12 %). Vous perdez sur l'unitaire mais gagnez en panier moyen : 65-80 % des clients prennent la formule complète plutôt qu'un seul plat.",
  },
  {
    question: "Faut-il afficher les prix sans le symbole euro ?",
    answer: "Oui, idéalement. Étude Cornell University (2009, Yang, Kimes, Sessarego) sur 200 menus : retirer le symbole EUR augmente le panier moyen de 8,15 % en moyenne. Si vous voulez un compromis : symbole très discret, même typo que le prix, taille réduite de 30 %. Jamais en gras, jamais en rouge.",
  },
  {
    question: "Quelle est la différence entre prix de vente, prix carte et prix HT ?",
    answer: "Prix HT (hors taxes) : prix interne pour vos calculs de marge. Prix de vente TTC : prix HT + TVA. Prix carte : prix TTC affiché au client, généralement arrondi selon le pricing psychologique. Exemple : food cost 5 EUR x coef 3,33 = 16,65 EUR HT = 18,32 EUR TTC = 18,50 EUR sur la carte.",
  },
];

export default function BlogPrixDeVente() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Calculer le prix de vente d'un plat de restaurant en 2026"
        description="Méthodes éprouvées pour fixer le prix de vente de vos plats : coefficient multiplicateur, marge cible, pricing psychologique. Cas pratiques chiffrés et outils gratuits."
        path="/blog/prix-de-vente-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Prix de vente restaurant', url: 'https://www.restaumargin.fr/blog/prix-de-vente-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: "Comment calculer le prix de vente d'un plat de restaurant",
            description: 'Méthode pas-à-pas pour fixer le prix de vente HT et TTC d\'un plat avec la méthode du coefficient multiplicateur.',
            totalTime: 'PT10M',
            tool: ['Fiche technique', 'Calculatrice', 'Étude de la concurrence'],
            step: [
              { '@type': 'HowToStep', name: 'Calculer le coût matières total', text: 'À partir de la fiche technique, additionnez le coût de chaque ingrédient pour obtenir le coût matières total du plat.' },
              { '@type': 'HowToStep', name: 'Déterminer le food cost cible', text: 'Choisissez votre food cost cible selon votre type de restaurant (entre 25 % et 35 %).' },
              { '@type': 'HowToStep', name: 'Calculer le coefficient multiplicateur', text: 'Coefficient = 1 / Food cost cible. Pour 30 %, coefficient = 3,33.' },
              { '@type': 'HowToStep', name: 'Appliquer le coefficient', text: 'Prix de vente HT = Coût matières x Coefficient.' },
              { '@type': 'HowToStep', name: 'Convertir en TTC et ajuster', text: 'Prix TTC = Prix HT x 1,10 (TVA 10 % en restauration sur place). Arrondissez selon le pricing psychologique de votre zone.' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: "Comment calculer le prix de vente d'un plat de restaurant en 2026",
            description: 'Guide complet pour fixer le prix de vente d\'un plat : coefficient multiplicateur, marge cible, pricing psychologique, cas pratiques.',
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-04-27',
            dateModified: '2026-05-26',
            wordCount: 3300,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/prix-de-vente-restaurant' },
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
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Prix de vente d'un plat</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Pricing"
        readTime="15 min"
        date="Mai 2026"
        title="Comment calculer le prix de vente d'un plat de restaurant ?"
        accentWord="prix de vente"
        subtitle="Trois méthodes éprouvées pour fixer le prix de vos plats : coefficient multiplicateur, marge cible, pricing psychologique. Cas pratiques chiffrés et formules prêtes à l'emploi."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-27" readTime="15 min" variant="header" />

        {/* ── Encadre formule rapide ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Formule prix de vente</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            La formule à retenir
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Prix de vente HT</strong> = Coût matières x Coefficient multiplicateur</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Coefficient</strong> = 1 / Food cost cible</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Prix de vente TTC</strong> = Prix HT x 1,10 (TVA restauration sur place)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Variante marge cible</strong> = Coût matières / (1 - Marge cible)</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Exemple express : 5 EUR de coût matières x coefficient 3,33 = 16,65 EUR HT, soit environ 18,30 EUR TTC.
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
              { href: '#pourquoi', label: "Pourquoi le bon prix change tout" },
              { href: '#coefficient', label: 'Méthode du coefficient multiplicateur' },
              { href: '#marge-cible', label: 'Méthode de la marge cible' },
              { href: '#psychological', label: 'Méthode du pricing psychologique' },
              { href: '#cas-pratique', label: 'Cas pratique : plat à 5 EUR de food cost' },
              { href: '#par-type', label: 'Variation par type de restaurant' },
              { href: '#exemples-detail', label: 'Exemples détaillés par catégorie (pizza, viande, dessert)' },
              { href: '#tva', label: 'TVA en restauration et impact sur le prix' },
              { href: '#inflation', label: 'Gérer l\'inflation et augmenter les prix' },
              { href: '#erreurs', label: 'Les 5 erreurs de pricing à éviter' },
              { href: '#outils', label: 'Outils gratuits pour calculer' },
              { href: '#faq', label: 'Questions fréquentes' },
              { href: '#cta', label: 'Automatiser le calcul avec RestauMargin' },
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
        <section id="pourquoi" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="1">
            Pourquoi le bon prix change tout
          </SectionHeading>

          <div className="prose-content">
            <p>
              Fixer le prix de vente d'un plat est l'une des décisions les plus impactantes pour
              votre restaurant. Un prix trop bas et vous brûlez votre marge sur chaque vente. Un prix
              trop haut et vos couverts s'effondrent. Le bon prix est celui qui maximise votre marge
              totale, pas votre marge unitaire.
            </p>
            <p>
              Beaucoup de restaurateurs se contentent d'aligner leurs prix sur la concurrence du quartier.
              C'est une erreur. Vos coûts ne sont pas ceux du voisin, votre clientèle cible non plus,
              votre positionnement encore moins. Un bon calcul de prix de vente part de vos coûts réels,
              s'ajuste avec le marché, et se peaufine avec la psychologie du consommateur.
            </p>
            <p>
              Dans ce guide, nous décortiquons les trois méthodes qui marchent réellement en 2026 :
              le coefficient multiplicateur (la plus utilisée), la marge cible (la plus précise),
              et le pricing psychologique (la plus rentable). Vous repartirez avec une grille de décision
              claire pour fixer chaque prix de votre carte.
            </p>

            <Callout type="info">
              <strong>Chiffre clé :</strong> selon une étude Fevad-CHD 2025, +5 % sur le ticket moyen
              augmente le résultat net d'environ 30 % dans un restaurant traditionnel. Inversement,
              -5 % sur le ticket moyen peut transformer une marge nette positive en déficit.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : COEFFICIENT ═════════════ */}
        <section id="coefficient" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="2">
            Méthode du coefficient multiplicateur
          </SectionHeading>

          <div className="prose-content">
            <p>
              C'est la méthode la plus répandue en France, parce qu'elle est rapide. Vous prenez le coût
              matières d'un plat, vous le multipliez par un coefficient, vous obtenez le prix HT.
              Tout l'enjeu est de choisir le bon coefficient.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Formule</h3>
            <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-4 font-mono text-sm">
              Prix de vente HT = Coût matières x Coefficient<br />
              Coefficient = 1 / Food cost cible
            </div>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Coefficients de référence</h3>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Type d'établissement</th>
                  <th className="text-center py-3 px-4 font-semibold">Coefficient</th>
                  <th className="text-center py-3 px-4 font-semibold">Food cost</th>
                  <th className="text-left py-3 px-4 font-semibold rounded-tr-xl">Quand l'utiliser</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { type: 'Pizzeria / Coffee shop', coef: '4,5 - 6,5', fc: '15 - 22 %', use: 'Ingrédients très peu coûteux, ticket moyen bas' },
                  { type: 'Brasserie / Restaurant rapide', coef: '3,3 - 4,0', fc: '25 - 30 %', use: 'Carte large, volume élevé, prix accessibles' },
                  { type: 'Bistrot / Restaurant traditionnel', coef: '3,0 - 3,3', fc: '30 - 33 %', use: 'Cuisine soignée, ticket moyen 25-40 EUR' },
                  { type: 'Restaurant gastronomique', coef: '2,5 - 3,3', fc: '30 - 40 %', use: 'Produits premium, marge unitaire élevée' },
                  { type: 'Boissons (vin, alcool)', coef: '3,5 - 5,0', fc: '20 - 28 %', use: 'Coefficient plus élevé sur les liquides' },
                  { type: 'Café / Boisson chaude', coef: '6,0 - 10,0', fc: '10 - 17 %', use: 'Coût matière dérisoire (café, thé, infusion)' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.type}</td>
                    <td className="py-3 px-4 text-center font-bold">{row.coef}</td>
                    <td className="py-3 px-4 text-center">{row.fc}</td>
                    <td className="py-3 px-4 text-sm">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Avantages de la méthode</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li><strong>Rapidité :</strong> applicable en 30 secondes par plat.</li>
              <li><strong>Simplicité :</strong> une seule formule, tout le monde la comprend.</li>
              <li><strong>Cohérence :</strong> garantit un food cost régulier sur l'ensemble de la carte.</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Limites de la méthode</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li>Ignore le temps de préparation : un plat avec 2 minutes de cuisson et un plat avec 1h de mijotage ont la même rentabilité apparente alors que la réalité est très différente.</li>
              <li>Ne tient pas compte du marché : un coefficient mécanique peut produire un prix décalé par rapport à la concurrence.</li>
              <li>Ignore la psychologie : 19,90 et 19,50 ont le même coefficient mais pas le même impact commercial.</li>
            </ul>

            <p className="mt-4">
              Pour aller plus loin sur cette méthode, lisez notre <Link to="/blog/coefficient-multiplicateur" className="text-teal-700 underline hover:text-teal-800">guide complet du coefficient multiplicateur</Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : MARGE CIBLE ═════════════ */}
        <section id="marge-cible" className="mb-16">
          <SectionHeading icon={<Award className="w-6 h-6" />} number="3">
            Méthode de la marge cible
          </SectionHeading>

          <div className="prose-content">
            <p>
              Méthode plus précise, utilisée dans les enseignes structurées et les chaînes. Au lieu de
              partir d'un coefficient, vous partez de la marge brute en EUR que vous voulez générer
              par plat. Cette méthode permet d'intégrer des contraintes que le coefficient ignore :
              temps de préparation, complexité, positionnement.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Formule</h3>
            <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-4 font-mono text-sm">
              Prix de vente HT = Coût matières / (1 - Marge cible en %)<br />
              <br />
              Si marge brute cible = 70 %, alors :<br />
              Prix de vente HT = Coût matières / 0,30
            </div>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Exemple chiffré</h3>
            <p>
              Vous voulez une marge brute de 72 % sur votre nouveau plat. Le coût matières est de 6,30 EUR.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350 mt-3">
              <li>Prix HT = 6,30 / (1 - 0,72) = 6,30 / 0,28 = <strong>22,50 EUR HT</strong></li>
              <li>Prix TTC (TVA 10 %) = 22,50 x 1,10 = <strong>24,75 EUR TTC</strong></li>
              <li>Marge brute en EUR = 22,50 - 6,30 = <strong>16,20 EUR par plat</strong></li>
              <li>Coefficient effectif = 22,50 / 6,30 = <strong>3,57</strong></li>
            </ul>
          </div>

          <Callout type="info">
            <strong>Quand utiliser cette méthode :</strong> sur les plats à forte valeur ajoutée
            (gastronomique, viande noble, poisson cher) ou les plats demandant beaucoup de temps de
            travail. La marge cible vous garantit la marge en valeur absolue, alors que le coefficient
            multiplicateur ne contrôle que le ratio.
          </Callout>

          <div className="prose-content mt-6">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Combiner les deux méthodes</h3>
            <p>
              En pratique, les restaurateurs expérimentés combinent les deux : ils utilisent le coefficient
              multiplicateur comme référence, puis ajustent vers la marge cible sur certains plats
              particuliers. C'est cette flexibilité qui distingue un menu engineering professionnel
              d'un calcul mécanique.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 4 : PSYCHOLOGICAL PRICING ═════════════ */}
        <section id="psychological" className="mb-16">
          <SectionHeading icon={<Brain className="w-6 h-6" />} number="4">
            Méthode du pricing psychologique
          </SectionHeading>

          <div className="prose-content">
            <p>
              Une fois le prix mathématique établi, vous devez encore l'habiller. Le pricing psychologique
              consiste à manipuler la présentation des prix pour augmenter la probabilité d'achat et le
              ticket moyen, sans changer la rentabilité unitaire. Voici les techniques éprouvées, utilisées
              par les chaînes comme par les restaurants étoilés.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            <PricingTechnique
              icon={<Tag className="w-5 h-5" />}
              title="Prix de charme"
              desc="Privilégiez 19,80 plutôt que 20,00. La perception du chiffre des dizaines (1 vs 2) crée une différence psychologique disproportionnée. En revanche, les chiffres ronds (20,00) sont perçus comme plus haut de gamme : à utiliser dans le gastronomique."
            />
            <PricingTechnique
              icon={<Calculator className="w-5 h-5" />}
              title="Suppression du symbole EUR"
              desc="Une étude Cornell University a démontré que retirer le symbole EUR (et le mot 'euro') du menu augmente la dépense moyenne de 8 à 12 %. Le client se concentre sur le plat, pas sur le coût. Adoptez : 'Entrecôte 24' au lieu de 'Entrecôte 24,00 EUR'."
            />
            <PricingTechnique
              icon={<TrendingUp className="w-5 h-5" />}
              title="Effet d'ancrage"
              desc="Placez en tête de carte un plat très cher (35-50 EUR) qui n'a pas vocation à être le plus vendu. Sa fonction est de faire paraître les autres plats raisonnables par comparaison. Un plat à 22 EUR semble normal à côté d'un plat à 38 EUR."
            />
            <PricingTechnique
              icon={<Sparkles className="w-5 h-5" />}
              title="Effet decoy"
              desc="Proposez 3 versions d'un même plat : petit (12 EUR), moyen (16 EUR), grand (17 EUR). Le moyen est le decoy : il sert à rendre le grand attractif. Résultat : 60-70 % des clients choisissent le grand au lieu du petit, alors qu'avec seulement 2 options ils choisiraient le petit à 50 %."
            />
            <PricingTechnique
              icon={<Award className="w-5 h-5" />}
              title="Bundle (formule)"
              desc="Plat + dessert + café à 26 EUR au lieu de 28 EUR à la carte. Le client a l'impression d'économiser 2 EUR mais consomme 30 % de plus en valeur. Bundle bien construit = +15-25 % de ticket moyen."
            />
            <PricingTechnique
              icon={<ListChecks className="w-5 h-5" />}
              title="Hiérarchisation visuelle"
              desc="Mettez en valeur les plats à forte marge (encadré, pictogramme, position en haut à droite — la zone la plus regardée). Les plats avec emoji ou pictogramme sont commandés 12-18 % plus souvent."
            />
          </div>
        </section>

        {/* ═════════════ SECTION 5 : CAS PRATIQUE ═════════════ */}
        <section id="cas-pratique" className="mb-16">
          <SectionHeading icon={<Pizza className="w-6 h-6" />} number="5">
            Cas pratique : plat à 5 EUR de food cost
          </SectionHeading>

          <div className="prose-content">
            <p>
              Vous lancez un nouveau plat. Après calcul de la fiche technique, le coût matières est de
              5,00 EUR. Vous devez fixer le prix de vente. Voici la démarche complète, étape par étape.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Étape 1 : prix mathématique selon votre coefficient</h3>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Coefficient appliqué</th>
                  <th className="text-center py-3 px-4 font-semibold">Food cost</th>
                  <th className="text-center py-3 px-4 font-semibold">Prix HT</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Prix TTC</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium">3,0 (gastronomique)</td><td className="py-3 px-4 text-center">33 %</td><td className="py-3 px-4 text-center">15,00 EUR</td><td className="py-3 px-4 text-center">16,50 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium">3,33 (bistrot)</td><td className="py-3 px-4 text-center">30 %</td><td className="py-3 px-4 text-center">16,65 EUR</td><td className="py-3 px-4 text-center">18,32 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium">3,5 (brasserie)</td><td className="py-3 px-4 text-center">28,5 %</td><td className="py-3 px-4 text-center">17,50 EUR</td><td className="py-3 px-4 text-center">19,25 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium">4,0 (rapide)</td><td className="py-3 px-4 text-center">25 %</td><td className="py-3 px-4 text-center">20,00 EUR</td><td className="py-3 px-4 text-center">22,00 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium">5,0 (pizzeria)</td><td className="py-3 px-4 text-center">20 %</td><td className="py-3 px-4 text-center">25,00 EUR</td><td className="py-3 px-4 text-center">27,50 EUR</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Étape 2 : vérification marché</h3>
            <p>
              Vous êtes une brasserie. Coefficient cible : 3,33 à 3,5. Prix mathématique : 16,65 à 17,50 EUR HT.
              Vérifiez maintenant que ce prix est cohérent avec votre marché. Regardez 5 à 10 restaurants
              comparables dans votre zone : si leurs plats équivalents sont à 17-20 EUR, vous êtes dans
              la cible. Si vous êtes à 22 EUR alors qu'ils sont tous à 16, vous prenez un risque.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Étape 3 : ajustement psychologique</h3>
            <p>
              Vous avez calculé 16,65 EUR HT, soit 18,32 EUR TTC. Vous l'arrondissez à <strong>18,50 EUR TTC</strong>
              (prix de charme : ne pas afficher 18,30, qui semble bizarre, mais 18,50 ou 18,90).
              Vérifiez votre marge réelle :
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350 mt-3">
              <li>Prix TTC affiché : 18,50 EUR</li>
              <li>Prix HT recalculé : 18,50 / 1,10 = 16,82 EUR</li>
              <li>Marge brute (EUR) : 16,82 - 5,00 = <strong>11,82 EUR</strong></li>
              <li>Marge brute (%) : 11,82 / 16,82 = <strong>70,3 %</strong></li>
              <li>Coefficient effectif : 16,82 / 5,00 = <strong>3,36</strong></li>
            </ul>
            <p className="mt-4">
              Résultat : prix de 18,50 EUR TTC, marge brute de 70 %, coefficient 3,36. Conforme aux
              benchmarks brasserie, et l'arrondi psychologique passe inaperçu pour le client tout en
              vous offrant 0,18 EUR de marge supplémentaire par plat. Sur 50 ventes par jour, c'est
              9 EUR/jour x 365 = 3 285 EUR de marge supplémentaire annuelle, sans rien faire.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : PAR TYPE ═════════════ */}
        <section id="par-type" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="6">
            Variation par type de restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le bon prix de vente dépend du positionnement. Un même plat (par exemple un steak-frites
              avec 6 EUR de coût matières) ne se vendra pas du tout au même prix dans une cantine
              d'entreprise et dans un restaurant gastronomique parisien. Voici les fourchettes typiques.
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            {[
              { type: 'Pizzeria', coef: '4,5 - 6,5', exemple: 'Margherita : 1,50 EUR coût -> 9,90 EUR TTC', conseil: 'Coefficient élevé sur les pizzas de base, plus bas (3,5) sur les pizzas premium pour rester compétitif.' },
              { type: 'Brasserie', coef: '3,3 - 4,0', exemple: 'Steak-frites : 6 EUR coût -> 22 EUR TTC', conseil: 'Coefficient stable. Surcharger les boissons (coef 4,5+) pour booster la marge globale.' },
              { type: 'Bistrot moderne', coef: '3,0 - 3,5', exemple: 'Plat du jour : 4,50 EUR coût -> 16 EUR TTC', conseil: 'Plat du jour à coefficient bas pour fidéliser, plats de carte à coefficient plus élevé.' },
              { type: 'Restaurant gastronomique', coef: '2,5 - 3,3', exemple: 'Bar de ligne : 14 EUR coût -> 42 EUR TTC', conseil: 'Coefficient bas sur le coût matière mais coefficient élevé sur les vins et accompagnements.' },
              { type: 'Food truck', coef: '3,5 - 5,0', exemple: 'Burger maison : 3 EUR coût -> 12 EUR TTC', conseil: 'Coefficient élevé pour compenser les volumes limités et la mobilité.' },
              { type: 'Coffee shop', coef: '5,0 - 10,0', exemple: 'Cappuccino : 0,40 EUR coût -> 4,50 EUR TTC', conseil: 'Coefficient extrême sur les boissons, coefficient bas (3-3,5) sur les snacks pour équilibrer.' },
            ].map((row, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-mono-100">{row.type}</h3>
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold">{row.coef}</span>
                </div>
                <p className="text-xs text-mono-500 mb-2"><strong>Exemple :</strong> {row.exemple}</p>
                <p className="text-sm text-mono-400 leading-relaxed">{row.conseil}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════════ NEW : EXEMPLES DETAIL PAR CATEGORIE ═════════════ */}
        <section id="exemples-detail" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="6b">
            Exemples détaillés par catégorie de plat
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici 5 exemples chiffrés complets, couvrant les principales catégories d'une carte
              standard. Pour chaque cas : décomposition du coût matière, application du coefficient,
              prix final, et analyse de marge.
            </p>
          </div>

          <div className="space-y-6 mt-8">
            <ExempleDetail
              icon={<Pizza className="w-6 h-6" />}
              title="Pizza Quatre Fromages (pizzeria)"
              costs={[
                { item: 'Pâte 230g (farine, levure, sel, huile)', cost: '0,28 EUR' },
                { item: 'Sauce tomate 80g', cost: '0,28 EUR' },
                { item: 'Mozzarella 80g + Gorgonzola 30g + Parmesan 15g + Chèvre 25g', cost: '1,82 EUR' },
                { item: 'Huile d\'olive + origan', cost: '0,07 EUR' },
              ]}
              totalCost="2,45 EUR"
              coef="x 5,3"
              priceHT="13,00 EUR"
              priceTTC="14,30 EUR"
              priceCarte="13,90 EUR"
              marginBrute="10,55 EUR"
              foodCost="18,8 %"
              note="Coefficient élevé typique de la pizzeria. Marge brute 81 %. Volume 60 pizzas/jour = 633 EUR de marge brute quotidienne."
            />
            <ExempleDetail
              icon={<Beef className="w-6 h-6" />}
              title="Magret de canard (bistronomie)"
              costs={[
                { item: 'Magret de canard 200g (race AOP)', cost: '5,80 EUR' },
                { item: 'Pommes grenailles 180g', cost: '0,72 EUR' },
                { item: 'Sauce orange-miel (jus, miel, orange, vinaigre)', cost: '0,42 EUR' },
                { item: 'Garniture haricots verts + ail fumé', cost: '0,38 EUR' },
                { item: 'Beurre cuisson + fleur de sel + poivre', cost: '0,18 EUR' },
              ]}
              totalCost="7,50 EUR"
              coef="x 3,15"
              priceHT="23,64 EUR"
              priceTTC="26,00 EUR"
              priceCarte="25,90 EUR"
              marginBrute="16,05 EUR"
              foodCost="31,8 %"
              note="Coefficient bas car coût matière noble. Marge brute 68 % mais marge en EUR supérieure à la pizza."
            />
            <ExempleDetail
              icon={<Award className="w-6 h-6" />}
              title="Risotto aux champignons (végétarien)"
              costs={[
                { item: 'Riz arborio 80g', cost: '0,32 EUR' },
                { item: 'Cèpes sèches 8g + champignons frais 100g', cost: '1,40 EUR' },
                { item: 'Bouillon + vin blanc + crème', cost: '0,55 EUR' },
                { item: 'Parmesan 25g', cost: '0,60 EUR' },
                { item: 'Beurre + huile truffe + herbes', cost: '0,33 EUR' },
              ]}
              totalCost="3,20 EUR"
              coef="x 4,5"
              priceHT="14,40 EUR"
              priceTTC="15,84 EUR"
              priceCarte="15,90 EUR"
              marginBrute="11,25 EUR"
              foodCost="22,2 %"
              note="Végétarien avec valeur perçue forte (cèpes, parmesan). Coefficient 4,5 sans plaintes clients."
            />
            <ExempleDetail
              icon={<Sparkles className="w-6 h-6" />}
              title="Tarte tatin (dessert)"
              costs={[
                { item: 'Pommes 180g', cost: '0,45 EUR' },
                { item: 'Pâte brisée 60g', cost: '0,18 EUR' },
                { item: 'Beurre + sucre roux + calvados', cost: '0,42 EUR' },
                { item: 'Glace vanille bourbon 50g', cost: '0,75 EUR' },
              ]}
              totalCost="1,80 EUR"
              coef="x 4,9"
              priceHT="8,82 EUR"
              priceTTC="9,70 EUR"
              priceCarte="9,50 EUR"
              marginBrute="6,84 EUR"
              foodCost="20,4 %"
              note="Dessert maison : coefficient élevé x 4,9. Marge brute 80 %. Catégorie clé pour booster le ticket moyen."
            />
            <ExempleDetail
              icon={<Coffee className="w-6 h-6" />}
              title="Verre de Bourgogne (vin)"
              costs={[
                { item: 'Vin (bouteille 25 EUR HT achat / 5 verres)', cost: '5,00 EUR' },
                { item: 'Coût sommellerie + casse + perte', cost: '0,30 EUR' },
              ]}
              totalCost="5,30 EUR"
              coef="x 2,4"
              priceHT="12,72 EUR"
              priceTTC="15,26 EUR"
              priceCarte="14,90 EUR"
              marginBrute="7,12 EUR"
              foodCost="41,7 %"
              note="Vin au verre : coefficient bas (x 2,4) mais marge en EUR conséquente. La TVA est 20 % sur l'alcool, attention au calcul TTC."
            />
          </div>
        </section>

        {/* ═════════════ NEW : TVA EN RESTAURATION ═════════════ */}
        <section id="tva" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="6c">
            TVA en restauration et impact sur le prix de vente
          </SectionHeading>

          <div className="prose-content">
            <p>
              La TVA est un point souvent mal maîtrisé par les restaurateurs débutants. Pourtant, mal la
              prendre en compte fausse tous les calculs de prix de vente. Voici les 3 taux applicables
              en France en 2026 et comment les intégrer.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Taux TVA</th>
                  <th className="text-left py-3 px-4 font-semibold">Application</th>
                  <th className="text-center py-3 px-4 font-semibold">Coefficient TTC</th>
                  <th className="text-left py-3 px-4 font-semibold rounded-tr-xl">Exemple typique</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white">
                  <td className="py-3 px-4 font-bold text-teal-700">10 %</td>
                  <td className="py-3 px-4">Restauration sur place et à emporter chaude</td>
                  <td className="py-3 px-4 text-center font-mono">x 1,10</td>
                  <td className="py-3 px-4 text-sm">Plat servi en salle, burger emporté chaud, pizza</td>
                </tr>
                <tr className="bg-mono-1000">
                  <td className="py-3 px-4 font-bold text-teal-700">5,5 %</td>
                  <td className="py-3 px-4">Produits alimentaires froids à emporter</td>
                  <td className="py-3 px-4 text-center font-mono">x 1,055</td>
                  <td className="py-3 px-4 text-sm">Sandwich froid emporté, salade en bocal, smoothie</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 font-bold text-teal-700">20 %</td>
                  <td className="py-3 px-4">Boissons alcoolisées (toujours)</td>
                  <td className="py-3 px-4 text-center font-mono">x 1,20</td>
                  <td className="py-3 px-4 text-sm">Verre de vin, bière, cocktail, champagne</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Callout type="warning">
            <strong>Erreur classique :</strong> calculer son food cost sur le prix TTC sous-estime le
            food cost réel de 10 %. Toujours calculer en HT, puis convertir en TTC pour l'affichage
            client uniquement. Pour les boissons alcoolisées à TVA 20 %, l'erreur est encore plus grande :
            le food cost calculé en TTC est sous-estimé de 20 %.
          </Callout>
        </section>

        {/* ═════════════ NEW : INFLATION ═════════════ */}
        <section id="inflation" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="6d">
            Gérer l'inflation et augmenter les prix sans perdre de clients
          </SectionHeading>

          <div className="prose-content">
            <p>
              L'inflation alimentaire cumulée sur 3 ans (2023-2025) atteint 22,4 % selon l'INSEE. Un
              restaurant qui n'a pas augmenté ses prix en proportion a perdu mécaniquement 6 à 8 points
              de marge brute. Voici les 5 leviers pour augmenter les prix correctement.
            </p>
          </div>

          <div className="space-y-5 mt-8">
            <LevierCard
              number={1}
              title="Augmentation directe progressive"
              desc="+0,50 EUR tous les 6 mois plutôt que +2 EUR d'un coup. Les clients toleret mal les sauts de prix supérieurs à +5 % en une fois. Étalez les hausses dans le temps."
            />
            <LevierCard
              number={2}
              title="Shrinkflation (réduction discrète des portions)"
              desc="-10 % grammage compense souvent +5 % de prix sans plainte client. Une assiette de 200g à 230g passe à 200g, le client ne le voit pas. Limite : ne pas franchir le seuil de satiété (180g pour viande, 200g pour pâtes)."
            />
            <LevierCard
              number={3}
              title="Substitution d'ingrédients"
              desc="Remplacez une variété chère par une moins coûteuse à qualité équivalente. Exemple : bavette d'aloyau (28 EUR/kg) remplacée par onglet (22 EUR/kg). Différence de goût faible, marge sauvée."
            />
            <LevierCard
              number={4}
              title="Renouvellement de carte"
              desc="Nouveaux noms = pas de comparaison directe avec l'ancien prix. Renommez 'Steak frites' en 'Pavé de boeuf maturée aux frites maison', augmentez le prix de 2-3 EUR, le client accepte parce qu'il perçoit un produit nouveau."
            />
            <LevierCard
              number={5}
              title="Storytelling produit"
              desc="Communiquez sur la qualité (origine, label AOP, fournisseur premium, méthode artisanale) plutôt que sur la hausse des coûts. La perception de valeur monte avant le prix : le client accepte alors la hausse comme légitime."
            />
          </div>

          <Callout type="info">
            <strong>Exemple illustratif :</strong> un bistrot qui vend son plat du jour à
            12,50 EUR (food cost 41 %, marge insuffisante) le passe à 14,90 EUR (food cost 33 %).
            Même avec 8 % de couverts en moins, la marge brute totale peut progresser d'environ 22 %.
            La hausse passe mieux si elle s'accompagne d'une refonte de la présentation (assiette
            ronde 28 cm au lieu de carrée), d'un changement de nom (Plat du chef au lieu de Plat du
            jour) et d'une mise en avant de l'origine des produits.
          </Callout>
        </section>

        {/* ═════════════ SECTION 7 : ERREURS ═════════════ */}
        <section id="erreurs" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="7">
            Les 5 erreurs de pricing à éviter
          </SectionHeading>

          <div className="space-y-6 mt-8">
            <ErreurCard number={1} title="S'aligner aveuglément sur la concurrence" desc="Vos coûts ne sont pas les leurs. Si votre voisin vend la pizza margherita à 11 EUR mais a un loyer 30 % plus bas que le votre, vous devez la vendre à 12 ou 13 EUR. Inversement, si vous avez un emplacement premium, vous pouvez aller au-dessus du marché local." />
            <ErreurCard number={2} title="Ignorer le temps de préparation" desc="Un plat avec 10 minutes de mise en place et un plat avec 1 heure de préparation ont la même rentabilité apparente avec la méthode du coefficient. En réalité, le second mobilise 6 fois plus de temps cuisinier. Intégrez le coût main d'oeuvre dans votre prix sur les plats complexes." />
            <ErreurCard number={3} title="Ne jamais réviser les prix" desc="Les prix matières montent constamment. Si vous fixez un prix de vente en 2024 et que vous ne le modifiez pas en 2026 alors que vos coûts ont augmenté de 15 %, votre marge brute fond. Réglez vos prix au minimum 2 fois par an, idéal 4 fois par an." />
            <ErreurCard number={4} title="Mettre tous les plats au même coefficient" desc="Le coefficient doit varier selon la catégorie : entrées à coefficient élevé (clients moins sensibles), plats principaux à coefficient moyen, desserts à coefficient élevé, boissons à coefficient très élevé. Un coefficient uniforme laisse de la marge sur la table." />
            <ErreurCard number={5} title="Faire des prix trop ronds" desc="Un menu plein de prix à 12, 18, 24, 30 EUR donne une impression d'amateurisme et active les radars psychologiques du client. Variez : 11,80 ; 17,90 ; 23,50 ; 29,80. Plus naturel, plus accepté." />
          </div>
        </section>

        {/* ═════════════ SECTION 8 : OUTILS ═════════════ */}
        <section id="outils" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="8">
            Outils gratuits pour calculer
          </SectionHeading>

          <div className="prose-content">
            <p>
              Plusieurs outils permettent de calculer rapidement vos prix de vente sans avoir à sortir
              une calculatrice ou un tableur. Voici nos recommandations.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            <Link to="/outils/calculateur-food-cost" className="bg-gradient-to-br from-teal-50 to-white border border-teal-200 rounded-2xl p-6 hover:border-teal-400 hover:shadow-md transition-all group">
              <div className="w-10 h-10 bg-teal-600 text-white rounded-lg flex items-center justify-center mb-3">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-mono-100 mb-2 group-hover:text-teal-700 transition-colors">Calculateur food cost RestauMargin</h3>
              <p className="text-sm text-mono-400 leading-relaxed mb-3">
                Outil en ligne gratuit. Entrez vos ingrédients, grammages et prix : food cost,
                marge brute et coefficient s'affichent instantanément. Pas d'inscription requise.
              </p>
              <div className="text-sm font-semibold text-teal-600 group-hover:gap-3 flex items-center gap-2 transition-all">
                Essayer maintenant
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <div className="w-10 h-10 bg-mono-100 text-white rounded-lg flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-mono-100 mb-2">Tableur Excel ou Google Sheets</h3>
              <p className="text-sm text-mono-400 leading-relaxed">
                Pour ceux qui aiment garder le contrôle. Solution gratuite mais chronophage : il faut
                tout saisir manuellement et mettre à jour les prix à chaque variation fournisseur.
                Adapté aux petites cartes (moins de 30 plats).
              </p>
            </div>
          </div>

          <div className="prose-content mt-8">
            <p>
              Au-delà de ces outils, vous pouvez automatiser entièrement le calcul de prix avec un
              logiciel SaaS comme RestauMargin : fiches techniques connectées aux factures fournisseurs,
              alertes en temps réel quand un prix matière dépasse votre seuil, simulateur de marge
              intégré. <Link to="/logiciel-marge-restaurant" className="text-teal-700 underline hover:text-teal-800">Voir le comparatif des logiciels de marge restaurant</Link>.
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
              Automatiser le calcul de prix avec RestauMargin
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Stop au tableur. RestauMargin calcule vos prix de vente, votre marge cible et votre
              coefficient en temps réel, sur tous vos plats, automatiquement.
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
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calcul marge restaurant</h3>
              <p className="text-xs text-mono-500">Marge brute, marge nette, food cost et formules expliquées.</p>
            </Link>
            <Link to="/blog/coefficient-multiplicateur" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Coefficient multiplicateur</h3>
              <p className="text-xs text-mono-500">Tableaux par catégorie, erreurs courantes et cas pratiques.</p>
            </Link>
            <Link to="/blog/fixer-prix-carte-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Fixer les prix de sa carte</h3>
              <p className="text-xs text-mono-500">Méthode complète pour construire une carte de restaurant rentable.</p>
            </Link>
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Réduire le food cost</h3>
              <p className="text-xs text-mono-500">10 stratégies éprouvées pour baisser le food cost.</p>
            </Link>
          </div>
        </section>

        {/* ═════════════ Sources ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Sources et références</h2>
          <ul className="space-y-2 text-sm text-mono-500">
            <li><strong>Fiducial Observatoire de la Restauration 2025</strong> &mdash; <a href="https://www.fiducial.fr/Observatoire-de-la-restauration" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline hover:text-teal-800">https://www.fiducial.fr/Observatoire-de-la-restauration</a></li>
            <li><strong>INSEE : indices de prix à la consommation alimentaire 2023-2025</strong> &mdash; <a href="https://www.insee.fr/fr/statistiques/serie/010540933" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline hover:text-teal-800">https://www.insee.fr</a></li>
            <li><strong>GIRA Conseil : Études de marché restauration 2024-2025</strong> &mdash; <a href="https://www.gira-conseil.com/" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline hover:text-teal-800">https://www.gira-conseil.com</a></li>
            <li><strong>KPMG Hospitality Benchmark 2025</strong> &mdash; rapport sectoriel sur les marges et ratios de la restauration en Europe</li>
            <li><strong>Yang, Kimes, Sessarego (2009)</strong> &mdash; "The Mathematics of $20 vs Twenty Dollars on a Restaurant Menu", Cornell School of Hotel Administration</li>
            <li><strong>FEVAD-CHD 2025</strong> &mdash; étude annuelle ticket moyen en restauration commerciale</li>
            <li><strong>Code général des impôts, articles 279 et 296</strong> &mdash; taux de TVA applicables à la restauration en France</li>
          </ul>
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

function ExempleDetail({ icon, title, costs, totalCost, coef, priceHT, priceTTC, priceCarte, marginBrute, foodCost, note }: {
  icon: React.ReactNode;
  title: string;
  costs: { item: string; cost: string }[];
  totalCost: string;
  coef: string;
  priceHT: string;
  priceTTC: string;
  priceCarte: string;
  marginBrute: string;
  foodCost: string;
  note: string;
}) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-bold text-mono-100 text-lg">{title}</h3>
      </div>

      <div className="bg-mono-1000 rounded-xl p-4 mb-4">
        <p className="text-xs font-semibold text-mono-500 uppercase tracking-wider mb-2">Coût matières</p>
        <div className="space-y-1.5 text-sm">
          {costs.map((c, i) => (
            <div key={i} className="flex justify-between text-mono-350">
              <span className="text-mono-400">{c.item}</span>
              <span className="font-medium text-mono-100">{c.cost}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 border-t border-mono-900 mt-2">
            <span className="font-bold text-mono-100">Total</span>
            <span className="font-bold text-amber-700">{totalCost}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
        <div className="bg-teal-50 rounded-lg p-3">
          <p className="text-xs text-teal-700 font-semibold mb-1">Coefficient</p>
          <p className="text-lg font-bold text-teal-900">{coef}</p>
        </div>
        <div className="bg-mono-1000 rounded-lg p-3">
          <p className="text-xs text-mono-500 font-semibold mb-1">Prix HT</p>
          <p className="text-lg font-bold text-mono-100">{priceHT}</p>
        </div>
        <div className="bg-mono-1000 rounded-lg p-3">
          <p className="text-xs text-mono-500 font-semibold mb-1">Prix TTC</p>
          <p className="text-lg font-bold text-mono-100">{priceTTC}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-blue-700 font-semibold mb-1">Prix carte</p>
          <p className="text-lg font-bold text-blue-900">{priceCarte}</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-3">
          <p className="text-xs text-emerald-700 font-semibold mb-1">Marge brute</p>
          <p className="text-lg font-bold text-emerald-900">{marginBrute}</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3">
          <p className="text-xs text-amber-700 font-semibold mb-1">Food cost</p>
          <p className="text-lg font-bold text-amber-900">{foodCost}</p>
        </div>
      </div>

      <p className="text-xs text-mono-500 italic leading-relaxed bg-mono-1000 rounded-lg p-3 mt-3">{note}</p>
    </div>
  );
}

function LevierCard({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5 sm:p-6 flex gap-4">
      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-mono-100 mb-1.5">{title}</h3>
        <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
