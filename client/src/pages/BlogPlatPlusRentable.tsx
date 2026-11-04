import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calculator, AlertTriangle, CheckCircle, ArrowRight, BarChart3, DollarSign, Target, BookOpen, Lightbulb, Award, ListChecks, Sparkles, Soup, Pizza, Salad, Coffee, Wine, Beef, IceCream, Utensils, Cake, Sandwich } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Quel est le plat le plus rentable dans un restaurant en 2026 ?"
   Cible PAA (People Also Ask) Google
   Mot-cle principal : plat le plus rentable restaurant
   ~3 200 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quel est le plat le plus rentable dans un restaurant ?',
    answer: "La soupe maison est le plat le plus rentable dans un restaurant : food cost de 8 à 12 %, marge brute de 88 à 92 %. Viennent ensuite les pâtes (food cost 12-18 %), les desserts faits maison (12-18 %), les pizzas (22-26 %) et les salades composées (15-22 %). Ces plats combinent un coût matière faible, une préparation rapide et une perception de valeur élevée par le client.",
  },
  {
    question: 'Quelle est la marge brute moyenne d\'un plat de restaurant ?',
    answer: 'La marge brute moyenne d\'un plat de restaurant se situe entre 65 % et 75 %. Les plats les plus rentables (soupes, pâtes, café) dépassent 80 % de marge brute. Les plats nobles (viande de qualité, poisson frais) descendent à 60-70 %. La cible varie selon le type d\'établissement : pizzerias 75-85 %, brasseries 67-72 %, gastronomique 60-70 %.',
  },
  {
    question: 'Pourquoi la soupe est-elle le plat le plus rentable ?',
    answer: 'La soupe est le plat le plus rentable pour 4 raisons : (1) ingrédients très bon marché (légumes de saison, parures, bouillon maison) ; (2) préparation en grande quantité avec économies d\'échelle ; (3) cuisson lente sans surveillance constante ; (4) perception client élevée (entrée réconfortante, valorisation cuisine maison). Une soupe vendue 7 EUR avec 0,70 EUR de coût matière génère 90 % de marge brute.',
  },
  {
    question: 'Quel plat éviter pour ne pas perdre d\'argent ?',
    answer: 'Évitez les plats à faible marge ET faible volume : produits nobles peu commandés (homard, foie gras frais), poissons rares, plats très techniques peu populaires. Le danger principal : un plat avec 35 % de food cost vendu seulement 3 fois par semaine immobilise des stocks (pertes), monopolise du temps de prep (perte de productivité) et ne contribue presque rien à la marge globale. La règle : retirer tout plat dans le quadrant Chien du menu engineering.',
  },
  {
    question: 'Comment calculer la rentabilité d\'un plat ?',
    answer: 'Rentabilité plat = (Prix de vente HT - Coût matières) x Nombre de ventes mensuel. Exemple : pizza margherita a 8,42 EUR de marge brute x 200 ventes/mois = 1 684 EUR de marge mensuelle. Comparez ce montant entre tous vos plats pour identifier vos vraies stars. Un plat à 90 % de marge brute mais vendu 5 fois/mois rapporte moins qu\'un plat à 65 % vendu 200 fois.',
  },
  {
    question: 'Quel est le food cost idéal pour un plat rentable ?',
    answer: 'Le food cost idéal d\'un plat rentable se situe entre 15 % et 30 %. En dessous de 15 %, vous êtes dans le très rentable (soupes, café, certaines pâtes). De 15 à 25 % : excellent (pizzas, desserts maison). De 25 à 35 % : standard restauration. Au-dessus de 35 % : la marge nette devient fragile. Quel que soit le ratio, valorisez toujours un plat selon la marge brute en euros, pas seulement le pourcentage.',
  },
  {
    question: 'Faut-il mettre les plats les plus rentables en avant sur la carte ?',
    answer: 'Oui, c\'est exactement la méthode du menu engineering. Identifiez vos Stars (forte marge + forte popularité) et mettez-les en haut à droite du menu (zone Golden Triangle), avec un encadré, en bold ou avec une photo. Vos Plowhorses (popularité haute, marge moyenne) doivent être légèrement réorientés vers la rentabilité via upselling de side dishes à forte marge (frites maison, salade).',
  },
  {
    question: 'Quel est le coefficient multiplicateur des plats les plus rentables ?',
    answer: 'Les plats les plus rentables ont un coefficient multiplicateur élevé : soupe 8 à 12, café 8 à 15, pâtes 5 à 8, pizza 4 à 6, dessert maison 5 à 8. Un coefficient élevé indique que le prix de vente est très supérieur au coût matière. Mais attention : un coefficient élevé sur un produit à bas prix unitaire (café à 2,50 EUR) ne génère pas autant de marge en euros qu\'un coefficient bas sur un produit cher (entrecôte à 25 EUR).',
  },
];

// Les 15 plats les plus rentables (pour schema ItemList)
const platsRentables = [
  { rank: 1, name: 'Soupe maison', fc: '8-12 %', mb: '88-92 %', coef: '8-12', desc: 'Le champion absolu. Légumes bon marché, cuisson lente, perception client élevée.' },
  { rank: 2, name: 'Pâtes (carbonara, bolognaise)', fc: '12-18 %', mb: '82-88 %', coef: '5-8', desc: 'Ingrédients basiques (pâtes, oeufs, lard), préparation rapide, ticket moyen attractif.' },
  { rank: 3, name: 'Pizza margherita', fc: '22-26 %', mb: '74-78 %', coef: '3,8-4,5', desc: 'Coût matière maîtrisé, productivité élevée, marché stable.' },
  { rank: 4, name: 'Salade nicoise / césar', fc: '15-22 %', mb: '78-85 %', coef: '4,5-6,5', desc: 'Marché fort en été, image healthy, marge brute confortable.' },
  { rank: 5, name: 'Risotto', fc: '18-22 %', mb: '78-82 %', coef: '4,5-5,5', desc: 'Riz arborio peu cher, image premium, signature italienne.' },
  { rank: 6, name: 'Burger maison', fc: '25-30 %', mb: '70-75 %', coef: '3,3-4,0', desc: 'Forte popularité, side dishes (frites) très rentables, formule complète.' },
  { rank: 7, name: 'Dessert fait maison', fc: '12-18 %', mb: '82-88 %', coef: '5,5-8', desc: 'Tiramisu, mousse chocolat, tarte saison. Upsell post-repas très rentable.' },
  { rank: 8, name: 'Cocktails signature', fc: '15-22 %', mb: '78-85 %', coef: '4,5-6,5', desc: 'Spiritueux + sirops + décoration. Ticket moyen élevé, marge solide.' },
  { rank: 9, name: 'Café / Expresso', fc: '8-12 %', mb: '88-92 %', coef: '8-12', desc: 'Le roi de la marge unitaire en pourcentage. Idée : push post-repas.' },
  { rank: 10, name: 'Wine pairing premium', fc: '25-33 %', mb: '67-75 %', coef: '3,0-4,0', desc: 'Verre vin à 6-9 EUR avec achat 1,50-2,50 EUR/bouteille pro. Up-sell.' },
  { rank: 11, name: 'Tartare de boeuf', fc: '28-32 %', mb: '68-72 %', coef: '3,1-3,6', desc: 'Pas de cuisson (gain énergie + temps), prix de vente élevé, image premium.' },
  { rank: 12, name: 'Frites maison', fc: '12-18 %', mb: '82-88 %', coef: '5,5-8', desc: 'Pomme de terre bon marché, side ultra-marge, accompagnement quasi systématique.' },
  { rank: 13, name: 'Tapas / Petits plats', fc: '15-22 %', mb: '78-85 %', coef: '4,5-6,5', desc: 'Portions réduites, multi-commandes par table, très rentable cumulé.' },
  { rank: 14, name: 'Bowls healthy', fc: '20-28 %', mb: '72-80 %', coef: '3,6-5,0', desc: 'Tendance forte, ingrédients optimisables, ticket midi attractif.' },
  { rank: 15, name: 'Plat du jour', fc: '20-28 %', mb: '72-80 %', coef: '3,6-5,0', desc: 'Permet d\'utiliser invendus et produits saison. Marge optimisable avec bonne prévision.' },
];

export default function BlogPlatPlusRentable() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Quel est le plat le plus rentable dans un restaurant en 2026 ? (top 15)"
        description="Découvrez les plats les plus rentables d'un restaurant en 2026 : pâtes, pizza, salade, soupe, dessert maison. Top 15 avec marge brute, food cost et coefficient. Comment construire une carte ultra-rentable."
        path="/blog/plat-le-plus-rentable-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Plat le plus rentable restaurant', url: 'https://www.restaumargin.fr/blog/plat-le-plus-rentable-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Top 15 des plats les plus rentables en restaurant 2026',
            description: 'Classement des plats les plus rentables à mettre à la carte d\'un restaurant, avec food cost, marge brute et coefficient multiplicateur.',
            numberOfItems: 15,
            itemListElement: platsRentables.map(p => ({
              '@type': 'ListItem',
              position: p.rank,
              name: p.name,
              description: `${p.desc} Food cost ${p.fc}, marge brute ${p.mb}, coefficient ${p.coef}.`,
            })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Quel est le plat le plus rentable dans un restaurant en 2026 ?',
            description: 'Top 15 des plats les plus rentables à mettre à la carte d\'un restaurant : food cost, marge brute, coefficient multiplicateur et méthode pour construire une carte ultra-rentable.',
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
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/plat-le-plus-rentable-restaurant' },
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
          <span className="text-mono-100 font-medium">Plat le plus rentable restaurant</span>
        </div>
      </div>

      {/* ── Hero / H1 — BlogArticleHero ── */}
      <BlogArticleHero
        category="Rentabilité"
        readTime="15 min"
        date="Mai 2026"
        title="Quel est le plat le plus rentable dans un restaurant en 2026 ? (top 15)"
        accentWord="rentable"
        subtitle="Soupe, pâtes, pizza, salade, dessert maison : découvrez les 15 plats les plus rentables avec leur food cost, leur marge brute et leur coefficient multiplicateur. Méthode pour construire une carte ultra-rentable et éviter les pièges classiques."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="15 min" variant="header" />

        {/* ── Encadre reponse rapide (featured snippet) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Réponse rapide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Le top 5 des plats les plus rentables
          </h2>
          <p className="text-teal-50 text-base leading-relaxed">
            Les plats les plus rentables en restaurant en 2026 sont les <strong className="text-white">soupes maison</strong> (food cost 8-12 %, marge brute 88-92 %), les <strong className="text-white">pâtes</strong> (12-18 % food cost), les <strong className="text-white">pizzas</strong> (22-26 %), les <strong className="text-white">salades composées</strong> (15-22 %), et les <strong className="text-white">desserts faits maison</strong> (12-18 %). Ces plats combinent un coût matière bas, une préparation rapide et une perception de valeur élevée par le client. Un <strong className="text-white">café simple</strong> a même un food cost de 8 %.
          </p>
        </div>

        <p className="mt-6 text-sm text-mono-400 leading-relaxed">
          Pour aller plus loin, consultez notre guide du{' '}
          <Link to="/blog/reduire-food-cost" className="text-teal-700 underline hover:text-teal-800 font-medium">food cost en restauration</Link>{' '}
          (formule, calcul et benchmarks par type d'établissement) et la méthode du{' '}
          <Link to="/blog/coefficient-multiplicateur" className="text-teal-700 underline hover:text-teal-800 font-medium">coefficient multiplicateur</Link>{' '}
          pour fixer le prix de vente de chaque plat avec la bonne marge.
        </p>

        {/* ── Table des matieres ── */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#reponse', label: 'Quel est le plat le plus rentable dans un restaurant en 2026 ?' },
              { href: '#criteres', label: 'Les critères de rentabilité d\'un plat' },
              { href: '#top15', label: 'Top 15 des plats les plus rentables' },
              { href: '#tableau', label: 'Tableau recap : plat + food cost + prix vente + marge' },
              { href: '#piege', label: 'Le piège : forte marge mais faible volume' },
              { href: '#menu-engineering', label: 'La méthode Menu Engineering (Stars / Plowhorses / Puzzles / Dogs)' },
              { href: '#ajouter', label: 'Comment ajouter 1-2 plats ultra-rentables à votre carte ce mois' },
              { href: '#eviter', label: 'Les plats à éviter (faible marge ET faible volume)' },
              { href: '#faq', label: 'Questions fréquentes' },
              { href: '#cta', label: 'Calculez la rentabilité de vos plats gratuitement' },
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

        {/* ═════════════ SECTION 1 : Reponse directe PAA ═════════════ */}
        <section id="reponse" className="mb-16">
          <SectionHeading icon={<Award className="w-6 h-6" />} number="1">
            Quel est le plat le plus rentable dans un restaurant en 2026 ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              C'est probablement la question la plus posée par les restaurateurs qui revoient leur carte.
              Et la réponse est sans ambiguïté : <strong>les soupes maison sont les plats les plus rentables
              dans un restaurant</strong>. Avec un food cost compris entre 8 % et 12 %, soit une marge brute
              de 88 à 92 %, elles surclassent largement les autres catégories.
            </p>
            <p>
              Pourquoi un tel écart ? Parce que la soupe combine quatre facteurs gagnants : des ingrédients
              bon marché (légumes de saison, parures, bouillons maison), une préparation en grande quantité,
              une cuisson lente sans surveillance constante, et une perception client très positive ("c'est
              fait maison, c'est généreux, c'est réconfortant").
            </p>
            <p>
              Mais la soupe n'est qu'un exemple. Les <strong>15 plats les plus rentables</strong> que nous
              détaillons dans cet article ont tous un point commun : <strong>un coût matière maîtrisé sous
              les 30 %</strong>, une <strong>préparation rapide ou industrialisable</strong>, et une
              <strong> perception de valeur</strong> qui justifie le prix de vente.
            </p>

            <Callout type="info">
              <strong>Attention au piège du pourcentage :</strong> un plat à 90 % de marge brute vendu
              5 fois par semaine rapporte moins qu'un plat à 65 % vendu 200 fois. La rentabilité réelle
              se mesure en <strong>marge brute en euros multipliée par le volume de ventes</strong>.
              Nous y revenons en détail dans la section 5.
            </Callout>

            <p>
              Ce guide vous donne le classement complet, les benchmarks chiffrés, la méthode Menu
              Engineering pour piloter votre carte, et les pièges courants à éviter. À la fin, vous
              saurez exactement quels plats <strong>ajouter</strong>, lesquels <strong>booster</strong>,
              et lesquels <strong>retirer</strong>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Criteres de rentabilite ═════════════ */}
        <section id="criteres" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="2">
            Les critères de rentabilité d'un plat
          </SectionHeading>

          <div className="prose-content">
            <p>
              Avant de classer les plats, définissons les 4 critères qui rendent un plat rentable.
              Vous ne pouvez pas analyser un plat sur un seul indicateur. La vraie rentabilité,
              c'est l'intersection de quatre dimensions.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 mt-8">
            <CritereCard
              icon={<DollarSign className="w-6 h-6" />}
              title="1. Le food cost"
              color="emerald"
              desc="Le ratio entre le coût matière et le prix de vente HT. C'est le KPI numéro un. Un food cost sous 25 % indique un excellent ratio. Au-dessus de 35 %, vous comprimez vos charges."
              metric="Cible < 30 %"
            />
            <CritereCard
              icon={<Target className="w-6 h-6" />}
              title="2. La marge brute en euros"
              color="amber"
              desc="Prix de vente HT moins coût matières. Critique : un café à 88 % de marge brute ne représente que 2 EUR de marge unitaire, vs 17 EUR pour une entrecôte. Toujours raisonner en euros, pas seulement en %."
              metric="À maximiser"
            />
            <CritereCard
              icon={<ListChecks className="w-6 h-6" />}
              title="3. Le temps de préparation"
              color="blue"
              desc="Un plat rentable doit être rapide ou industrialisable. La main d'oeuvre est votre 2ème poste de charge après les matières. Un plat qui prend 25 minutes à dresser en plein coup de feu casse votre productivité."
              metric="< 8 min en service"
            />
            <CritereCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="4. La popularité"
              color="purple"
              desc="Un plat à 80 % de marge brute commandé 10 fois/mois ne contribue presque rien à votre chiffre d'affaires. Croisez TOUJOURS rentabilité et popularité (c'est le principe du Menu Engineering)."
              metric="> 5 % des ventes"
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>La formule de la rentabilité réelle :</strong>
            </p>
            <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-4 font-mono text-sm text-mono-100">
              Rentabilité mensuelle plat (EUR) = Marge brute unitaire (EUR) x Nombre de ventes mensuel
            </div>
            <p>
              Exemple chiffré : une pizza margherita avec 8,42 EUR de marge unitaire et 200 ventes par mois
              = <strong>1 684 EUR</strong> de contribution mensuelle. Une entrecôte a 17,40 EUR de marge
              mais seulement 30 ventes par mois = <strong>522 EUR</strong>. La pizza est plus de 3x plus
              rentable en valeur absolue. Pourtant en pourcentage, l'entrecôte a une marge plus élevée
              en valeur unitaire.
            </p>
            <p>
              Cette analyse croisée est la base du <Link to="/blog/menu-engineering-boston-matrix" className="text-teal-700 underline hover:text-teal-800">Menu Engineering Boston Matrix</Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Top 15 des plats ═════════════ */}
        <section id="top15" className="mb-16">
          <SectionHeading icon={<Award className="w-6 h-6" />} number="3">
            Top 15 des plats les plus rentables
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici notre classement détaillé des 15 plats les plus rentables à mettre à la carte
              d'un restaurant en France en 2026. Fourchettes indicatives établies à partir des
              benchmarks GIRA Conseil et SNRC et d'exemples de fiches techniques types.
            </p>
          </div>

          <div className="space-y-6 mt-8">
            <PlatCard
              rank={1}
              icon={<Soup className="w-7 h-7" />}
              name="Soupe maison"
              fc="8-12 %"
              mb="88-92 %"
              coef="8-12"
              tag="LE CHAMPION"
              tagColor="emerald"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> ingrédients très bon marché (carottes 1,20 EUR/kg, oignons,
                céleri, parures de légumes récupérées), bouillon maison gratuit (carcasses de volaille, paures de
                viande), cuisson lente sans surveillance, perception élevée ("fait maison"), portion 250 mL = 25 cl.
              </p>
              <p className="mt-2">
                <strong>Exemple chiffré :</strong> vélo de potiron vendu 7 EUR. Coût matière : 0,65 EUR (1,40 g
                potiron + 30 g oignon + crème + bouillon). Food cost = 9,3 %, marge brute = 6,35 EUR.
              </p>
              <p className="mt-2 text-sm text-mono-500">
                <strong>Astuce pro :</strong> proposez une soupe en entrée du jour qui change chaque jour selon
                vos invendus. Vous valorisez vos parures et réduisez votre gaspillage.
              </p>
            </PlatCard>

            <PlatCard
              rank={2}
              icon={<Utensils className="w-7 h-7" />}
              name="Pâtes (carbonara, bolognaise, pesto)"
              fc="12-18 %"
              mb="82-88 %"
              coef="5-8"
              tag="MEGA RENTABLE"
              tagColor="emerald"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> pâtes sèches 1,80 EUR/kg, sauce maison préparée en
                amont (mise en place rapide en service), portion 140 g = 25 centimes de pâtes. Lard, oeuf,
                fromage râpé : ingrédients standards à faible coût.
              </p>
              <p className="mt-2">
                <strong>Exemple chiffré :</strong> carbonara vendue 14 EUR (12,72 EUR HT). Coût matière : 1,80 EUR
                (pâtes + lard 50g + 1 jaune oeuf + parmesan + crème). Food cost = 14,1 %, marge brute = 10,92 EUR.
              </p>
              <p className="mt-2 text-sm text-mono-500">
                <strong>Astuce pro :</strong> 3-4 références de pâtes à la carte couvrent 80 % des envies. Pâtes
                fraîches sur 1-2 plats premium permet de monter en gamme avec marge encore meilleure (15 % FC).
              </p>
            </PlatCard>

            <PlatCard
              rank={3}
              icon={<Pizza className="w-7 h-7" />}
              name="Pizza margherita"
              fc="22-26 %"
              mb="74-78 %"
              coef="3,8-4,5"
              tag="TRÈS RENTABLE"
              tagColor="amber"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> pâte maison (farine, eau, levure, sel) coût ridicule,
                sauce tomate 0,30 EUR par pizza, mozzarella et garniture maîtrisées. La pizzeria est l'un des
                modèles les plus rentables car coût matière stable, productivité élevée (50-80 pizzas/heure).
              </p>
              <p className="mt-2">
                <strong>Exemple chiffré :</strong> margherita 11 EUR (10 EUR HT). Coût matière : 1,58 EUR
                (détail dans <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 underline">notre cas pratique pizza</Link>). Food cost = 15,8 %, marge brute = 8,42 EUR.
              </p>
              <p className="mt-2 text-sm text-mono-500">
                <strong>Astuce pro :</strong> 60 % de votre marge pizza vient des ajouts (jambon, champignons,
                supplément fromage). Travaillez vos pizzas avec 6-7 ingrédients en moyenne, pas 3.
              </p>
            </PlatCard>

            <PlatCard
              rank={4}
              icon={<Salad className="w-7 h-7" />}
              name="Salade composée (nicoise, césar, italienne)"
              fc="15-22 %"
              mb="78-85 %"
              coef="4,5-6,5"
              tag="TRÈS RENTABLE"
              tagColor="amber"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> base de salade 5 EUR/kg, garnitures variables à maîtriser
                (oeufs, thon en conserve, poulet froid). Forte demande midi et été. Image healthy = perception valeur.
              </p>
              <p className="mt-2">
                <strong>Exemple chiffré :</strong> salade césar 13 EUR (11,82 EUR HT). Coût matière : 2,15 EUR
                (laitue, poulet 80g, parmesan, croûtons, sauce). Food cost = 18,2 %, marge brute = 9,67 EUR.
              </p>
              <p className="mt-2 text-sm text-mono-500">
                <strong>Astuce pro :</strong> proposez une formule midi "salade + boisson" à 15 EUR pour booster
                le ticket moyen sans dégrader la marge.
              </p>
            </PlatCard>

            <PlatCard
              rank={5}
              icon={<Utensils className="w-7 h-7" />}
              name="Risotto"
              fc="18-22 %"
              mb="78-82 %"
              coef="4,5-5,5"
              tag="TRÈS RENTABLE"
              tagColor="amber"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> riz arborio 3,80 EUR/kg, portion 80 g = 30 centimes.
                Bouillon maison, parmesan râpé, beurre, vin blanc. Image italienne signature, marge solide.
              </p>
              <p className="mt-2">
                <strong>Exemple chiffré :</strong> risotto champignons 16 EUR (14,55 EUR HT). Coût matière :
                2,90 EUR (riz + champignons + parmesan + vin blanc). Food cost = 19,9 %, marge brute = 11,65 EUR.
              </p>
            </PlatCard>

            <PlatCard
              rank={6}
              icon={<Sandwich className="w-7 h-7" />}
              name="Burger maison"
              fc="25-30 %"
              mb="70-75 %"
              coef="3,3-4,0"
              tag="RENTABLE"
              tagColor="teal"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> steak haché 8-12 EUR/kg (140g portion = 1,12 à 1,68 EUR),
                pain artisan 0,50 EUR, cheddar, salade, sauce maison. Marge légère mais volume très élevé, side
                frites ultra-rentable, formule complète optimise le ticket.
              </p>
              <p className="mt-2">
                <strong>Exemple chiffré :</strong> burger classique 14 EUR (12,72 EUR HT). Coût matière : 3,50 EUR
                (steak 150g + pain + cheddar + salade + tomate + sauce). Food cost = 27,5 %, marge brute = 9,22 EUR.
              </p>
            </PlatCard>

            <PlatCard
              rank={7}
              icon={<Cake className="w-7 h-7" />}
              name="Dessert fait maison"
              fc="12-18 %"
              mb="82-88 %"
              coef="5,5-8"
              tag="MEGA RENTABLE"
              tagColor="emerald"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> tiramisu, mousse chocolat, tarte saison, crème brûlée.
                Ingrédients bon marché (oeufs, sucre, mascarpone, chocolat) et upsell post-repas très simple.
                75 % des clients qui voient un dessert en commandent un.
              </p>
              <p className="mt-2">
                <strong>Exemple chiffré :</strong> tiramisu 7,50 EUR (6,82 EUR HT). Coût matière : 0,95 EUR
                (mascarpone + oeufs + biscuits + café + cacao). Food cost = 13,9 %, marge brute = 5,87 EUR.
              </p>
              <p className="mt-2 text-sm text-mono-500">
                <strong>Astuce pro :</strong> 4-5 desserts à la carte avec rotation saison (tarte fruits rouges
                été, fondant chocolat hiver). Photo desserts sur table = +20 % de prise.
              </p>
            </PlatCard>

            <PlatCard
              rank={8}
              icon={<Wine className="w-7 h-7" />}
              name="Cocktails signature"
              fc="15-22 %"
              mb="78-85 %"
              coef="4,5-6,5"
              tag="TRÈS RENTABLE"
              tagColor="amber"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> spiritueux 35-50 EUR/L (4 cl = 1,40 à 2 EUR),
                sirops maison, décoration. Ticket élevé et perception haut de gamme. Marge boissons toujours
                supérieure à marge food.
              </p>
              <p className="mt-2">
                <strong>Exemple chiffré :</strong> mojito signature 12 EUR (10,91 EUR HT). Coût matière :
                1,90 EUR (rhum 4cl + sucre canne + citron vert + menthe + eau gazeuse). Food cost = 17,4 %,
                marge brute = 9,01 EUR.
              </p>
            </PlatCard>

            <PlatCard
              rank={9}
              icon={<Coffee className="w-7 h-7" />}
              name="Café / Expresso"
              fc="8-12 %"
              mb="88-92 %"
              coef="8-12"
              tag="LE CHAMPION %"
              tagColor="emerald"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> 7g de café par tasse à 18 EUR/kg = 0,12 EUR. Vendu
                2,50 EUR = 95 % de marge brute. Le ratio le plus élevé de la restauration. <strong>Mais</strong>
                marge unitaire en euros très faible (2,38 EUR).
              </p>
              <p className="mt-2">
                <strong>Astuce pro :</strong> push systématique en fin de repas. Café gourmand à 6 EUR (café +
                3 mignardises) = marge brute 4,80 EUR = +50 % de marge vs café seul.
              </p>
            </PlatCard>

            <PlatCard
              rank={10}
              icon={<Wine className="w-7 h-7" />}
              name="Wine pairing premium"
              fc="25-33 %"
              mb="67-75 %"
              coef="3,0-4,0"
              tag="RENTABLE"
              tagColor="teal"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> bouteille fournisseur 6-10 EUR pour un vin à 30-40 EUR
                vendu. Verre 12 cl à 6-9 EUR = marge unitaire 4-7 EUR avec coefficient 3,5-4. Volume élevé si
                bonne carte.
              </p>
              <p className="mt-2 text-sm text-mono-500">
                <strong>Astuce pro :</strong> créer 2-3 accords mets-vins suggérés (steak + cabernet, poisson +
                chardonnay) pour upsell automatique. Consultez notre <Link to="/blog/construire-carte-vins-restaurant" className="text-teal-700 underline">guide carte des vins</Link>.
              </p>
            </PlatCard>

            <PlatCard
              rank={11}
              icon={<Beef className="w-7 h-7" />}
              name="Tartare de boeuf"
              fc="28-32 %"
              mb="68-72 %"
              coef="3,1-3,6"
              tag="RENTABLE"
              tagColor="teal"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> boeuf rumsteck à 16-20 EUR/kg (180g = 2,88-3,60 EUR),
                pas de cuisson (gain énergie + temps), prix de vente élevé (22-26 EUR). Image premium, perception
                cuisine technique.
              </p>
              <p className="mt-2">
                <strong>Exemple chiffré :</strong> tartare classique 24 EUR (21,82 EUR HT). Coût matière : 6,60 EUR
                (rumsteck 180g + condiments + frites). Food cost = 30,2 %, marge brute = 15,22 EUR.
              </p>
            </PlatCard>

            <PlatCard
              rank={12}
              icon={<Utensils className="w-7 h-7" />}
              name="Frites maison"
              fc="12-18 %"
              mb="82-88 %"
              coef="5,5-8"
              tag="MEGA RENTABLE"
              tagColor="emerald"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> pomme de terre Bintje 1,20-1,80 EUR/kg, 200g = 0,30 EUR.
                Side accompagnement quasi systématique (80 % des burgers, 60 % des grillades, formules midi).
                Vendu 5-6 EUR en supplément ou comprise dans plat = marge brute 4,50-5 EUR par portion.
              </p>
              <p className="mt-2 text-sm text-mono-500">
                <strong>Astuce pro :</strong> proposer frites maison vs frites surgelées premium. Storytelling
                "double cuisson maison" justifie supplément 1 EUR.
              </p>
            </PlatCard>

            <PlatCard
              rank={13}
              icon={<Utensils className="w-7 h-7" />}
              name="Tapas / Petits plats"
              fc="15-22 %"
              mb="78-85 %"
              coef="4,5-6,5"
              tag="TRÈS RENTABLE"
              tagColor="amber"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> portions réduites = coût matière ridicule (1-2 EUR),
                multi-commandes par table (3-5 tapas par couvert). Ticket moyen très élevé cumulé, ambiance
                conviviale.
              </p>
              <p className="mt-2">
                <strong>Exemple chiffré :</strong> 3 tapas à 7,50 EUR = 22,50 EUR. Coût matière total : 3,50 EUR.
                Food cost = 17,1 %, marge brute = 16,95 EUR par client.
              </p>
            </PlatCard>

            <PlatCard
              rank={14}
              icon={<Salad className="w-7 h-7" />}
              name="Bowls healthy (poke, buddha, acai)"
              fc="20-28 %"
              mb="72-80 %"
              coef="3,6-5,0"
              tag="RENTABLE"
              tagColor="teal"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> tendance forte 2024-2026, ingrédients optimisables
                (riz, quinoa, légumes, protéines variés), composition modulable. Ticket midi attractif (12-16 EUR).
                Image premium et génération Z.
              </p>
              <p className="mt-2">
                <strong>Exemple chiffré :</strong> bowl poke saumon 14 EUR (12,72 EUR HT). Coût matière : 3,20 EUR
                (riz + saumon 80g + edamame + avocat + sauce). Food cost = 25,2 %, marge brute = 9,52 EUR.
              </p>
            </PlatCard>

            <PlatCard
              rank={15}
              icon={<Utensils className="w-7 h-7" />}
              name="Plat du jour"
              fc="20-28 %"
              mb="72-80 %"
              coef="3,6-5,0"
              tag="RENTABLE"
              tagColor="teal"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> permet d'utiliser invendus, produits saison
                (-30 % vs hors saison), ajuster coût matière à la baisse. Très demandé midi (rapidité client).
                Si bonne prévision = food cost optimisé.
              </p>
              <p className="mt-2 text-sm text-mono-500">
                <strong>Astuce pro :</strong> annoncez le plat du jour la veille sur réseaux sociaux + tableau
                extérieur = clients sains à venir. <Link to="/blog/fiche-technique-restaurant" className="text-teal-700 underline">Bien standardiser la fiche technique</Link>.
              </p>
            </PlatCard>
          </div>
        </section>

        {/* ═════════════ SECTION 4 : Tableau recap ═════════════ */}
        <section id="tableau" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="4">
            Tableau recap : plat + food cost + prix vente + marge
          </SectionHeading>

          <div className="prose-content">
            <p>
              Vue d'ensemble synthétique des 15 plats avec exemple de prix de vente moyen TTC,
              coût matière et marge brute en euros. Valeurs indicatives, calculées sur les exemples de fiches techniques ci-dessus.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">#</th>
                  <th className="text-left py-3 px-4 font-semibold">Plat</th>
                  <th className="text-center py-3 px-4 font-semibold">Food cost</th>
                  <th className="text-center py-3 px-4 font-semibold">Marge brute</th>
                  <th className="text-center py-3 px-4 font-semibold">Coefficient</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Marge EUR moyenne</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { rank: 1, name: 'Soupe maison', fc: '8-12 %', mb: '88-92 %', coef: '8-12', euros: '5,80 EUR' },
                  { rank: 2, name: 'Pâtes', fc: '12-18 %', mb: '82-88 %', coef: '5-8', euros: '10,90 EUR' },
                  { rank: 3, name: 'Pizza margherita', fc: '22-26 %', mb: '74-78 %', coef: '3,8-4,5', euros: '8,40 EUR' },
                  { rank: 4, name: 'Salade composée', fc: '15-22 %', mb: '78-85 %', coef: '4,5-6,5', euros: '9,70 EUR' },
                  { rank: 5, name: 'Risotto', fc: '18-22 %', mb: '78-82 %', coef: '4,5-5,5', euros: '11,65 EUR' },
                  { rank: 6, name: 'Burger maison', fc: '25-30 %', mb: '70-75 %', coef: '3,3-4,0', euros: '9,20 EUR' },
                  { rank: 7, name: 'Dessert maison', fc: '12-18 %', mb: '82-88 %', coef: '5,5-8', euros: '5,90 EUR' },
                  { rank: 8, name: 'Cocktail signature', fc: '15-22 %', mb: '78-85 %', coef: '4,5-6,5', euros: '9,00 EUR' },
                  { rank: 9, name: 'Café', fc: '8-12 %', mb: '88-92 %', coef: '8-12', euros: '2,40 EUR' },
                  { rank: 10, name: 'Wine pairing', fc: '25-33 %', mb: '67-75 %', coef: '3,0-4,0', euros: '5,50 EUR' },
                  { rank: 11, name: 'Tartare boeuf', fc: '28-32 %', mb: '68-72 %', coef: '3,1-3,6', euros: '15,20 EUR' },
                  { rank: 12, name: 'Frites maison', fc: '12-18 %', mb: '82-88 %', coef: '5,5-8', euros: '4,70 EUR' },
                  { rank: 13, name: 'Tapas (3)', fc: '15-22 %', mb: '78-85 %', coef: '4,5-6,5', euros: '17,00 EUR' },
                  { rank: 14, name: 'Bowl healthy', fc: '20-28 %', mb: '72-80 %', coef: '3,6-5,0', euros: '9,50 EUR' },
                  { rank: 15, name: 'Plat du jour', fc: '20-28 %', mb: '72-80 %', coef: '3,6-5,0', euros: '10,00 EUR' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-bold text-teal-600">{row.rank}</td>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.name}</td>
                    <td className="py-3 px-4 text-center">{row.fc}</td>
                    <td className="py-3 px-4 text-center font-semibold text-emerald-700">{row.mb}</td>
                    <td className="py-3 px-4 text-center">{row.coef}</td>
                    <td className="py-3 px-4 text-center font-bold text-mono-100">{row.euros}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Lecture du tableau :</strong> le café a la meilleure marge en pourcentage (88-92 %)
              mais la plus faible marge en euros (2,40 EUR). Le tartare de boeuf a une marge en pourcentage
              moyenne (68-72 %) mais la plus forte marge en euros (15,20 EUR). C'est pourquoi votre carte
              doit mélanger les deux profils.
            </p>
            <p>
              Pour mesurer la rentabilité réelle, multipliez la marge euros par votre volume mensuel. Utilisez
              notre <Link to="/outils/calculateur-marge-restaurant" className="text-teal-700 underline">calculateur marge restaurant</Link> ou le calculateur de <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline">food cost</Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Le piege ═════════════ */}
        <section id="piege" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="5">
            Le piège : forte marge MAIS faible volume
          </SectionHeading>

          <div className="prose-content">
            <p>
              C'est l'erreur classique : un restaurateur identifie un plat ultra-rentable (90 % de marge brute),
              le met en avant, et constate que sa marge globale n'augmente pas. Pourquoi ? Parce qu'il
              <strong> ignore la dimension volume</strong>.
            </p>
            <p>
              Imaginons deux plats sur votre carte :
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Beef className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">Plat A : Filet de Saint-Pierre</h3>
              </div>
              <ul className="text-sm text-amber-800 space-y-1.5">
                <li><strong>Prix vente :</strong> 32 EUR</li>
                <li><strong>Food cost :</strong> 32 %</li>
                <li><strong>Marge brute :</strong> 21,76 EUR / unité</li>
                <li><strong>Ventes/mois :</strong> 12</li>
                <li className="border-t border-amber-300 mt-2 pt-2"><strong>Marge mensuelle :</strong> 261 EUR</li>
              </ul>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Pizza className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Plat B : Pizza margherita</h3>
              </div>
              <ul className="text-sm text-emerald-800 space-y-1.5">
                <li><strong>Prix vente :</strong> 11 EUR</li>
                <li><strong>Food cost :</strong> 16 %</li>
                <li><strong>Marge brute :</strong> 8,42 EUR / unité</li>
                <li><strong>Ventes/mois :</strong> 220</li>
                <li className="border-t border-emerald-300 mt-2 pt-2"><strong>Marge mensuelle :</strong> 1 852 EUR</li>
              </ul>
            </div>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Le constat est sans appel :</strong> la pizza margherita rapporte 7x plus de marge en
              euros que le filet de Saint-Pierre. Pourtant, la marge unitaire de Saint-Pierre est presque
              3x supérieure. La popularité (volume) est le multiplicateur absolu.
            </p>

            <Callout type="warning">
              <strong>Trois erreurs courantes :</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Mettre en avant un plat à 90 % de marge brute mais commandé 5 fois/mois.</li>
                <li>Supprimer un plat à 65 % de marge brute mais commandé 200 fois/mois.</li>
                <li>Calibrer toute sa carte sur le pourcentage, sans regarder le volume réel.</li>
              </ul>
            </Callout>

            <p>
              La méthode pour ne plus tomber dans ce piège : analyser systématiquement vos plats avec le
              <strong> Menu Engineering Boston Matrix</strong> (section suivante). Cette grille croisée
              rentabilité x popularité classe vos plats en 4 catégories d'action.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Menu Engineering ═════════════ */}
        <section id="menu-engineering" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="6">
            La méthode Menu Engineering (Stars / Plowhorses / Puzzles / Dogs)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le <strong>Menu Engineering</strong> est la méthode professionnelle pour piloter votre carte.
              Elle croise deux axes : <strong>rentabilité</strong> (marge brute en euros) et <strong>popularité</strong>
              (% des ventes). Cela donne 4 catégories de plats, chacune avec un plan d'action spécifique.
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-300 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-6 h-6 text-emerald-700" />
                <h3 className="text-lg font-bold text-emerald-900">STARS</h3>
              </div>
              <p className="text-xs uppercase tracking-wider text-emerald-800 font-semibold mb-2">Forte marge + forte popularité</p>
              <p className="text-sm text-emerald-900 mb-3">
                Vos plats champions. Ils génèrent l'essentiel de votre marge. <strong>Action :</strong>
                protéger leur position (qualité constante, peu de changement). Mettre en haut à droite du menu
                (Golden Triangle). Photo ou encadré. C'est la zone où le client regarde en premier.
              </p>
              <p className="text-xs text-emerald-700 italic">
                Typiquement : pizzas signature, burger maison, plat phare du chef.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-6 h-6 text-blue-700" />
                <h3 className="text-lg font-bold text-blue-900">PLOWHORSES</h3>
              </div>
              <p className="text-xs uppercase tracking-wider text-blue-800 font-semibold mb-2">Faible marge + forte popularité</p>
              <p className="text-sm text-blue-900 mb-3">
                Les chevaux de labour. Très demandés mais marge moyenne. <strong>Action :</strong> augmenter
                la marge sans casser la popularité. Réduire portions de 10 %, augmenter prix de 0,50 EUR,
                proposer side dishes à forte marge en accompagnement.
              </p>
              <p className="text-xs text-blue-700 italic">
                Typiquement : steak frites traditionnel, poulet rôti, salade du chef.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-300 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-6 h-6 text-purple-700" />
                <h3 className="text-lg font-bold text-purple-900">PUZZLES</h3>
              </div>
              <p className="text-xs uppercase tracking-wider text-purple-800 font-semibold mb-2">Forte marge + faible popularité</p>
              <p className="text-sm text-purple-900 mb-3">
                Le potentiel non exploité. Très rentables mais peu commandés. <strong>Action :</strong>
                augmenter la visibilité. Mettre une description plus séduisante, ajouter photo, encadrer,
                former les serveurs à les suggérer activement, descriptions détaillées.
              </p>
              <p className="text-xs text-purple-700 italic">
                Typiquement : risotto signature, tartare de boeuf, soupe maison du jour.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-300 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-6 h-6 text-red-700" />
                <h3 className="text-lg font-bold text-red-900">DOGS</h3>
              </div>
              <p className="text-xs uppercase tracking-wider text-red-800 font-semibold mb-2">Faible marge + faible popularité</p>
              <p className="text-sm text-red-900 mb-3">
                Les poids morts. Peu rentables ET peu demandés. <strong>Action :</strong> les retirer purement
                et simplement. Ils immobilisent du stock, alourdissent la carte, monopolisent du temps de prep.
                Remplacez par un plat de la catégorie Puzzle.
              </p>
              <p className="text-xs text-red-700 italic">
                Typiquement : plats complexes peu connus, produits chers peu commandés.
              </p>
            </div>
          </div>

          <div className="prose-content mt-8">
            <p>
              Pour aller plus loin, consultez notre guide complet <Link to="/blog/menu-engineering-boston-matrix" className="text-teal-700 underline hover:text-teal-800">Menu Engineering Boston Matrix</Link>
              {' '}avec un exemple chiffré sur une carte de 20 plats.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : Comment ajouter ═════════════ */}
        <section id="ajouter" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="7">
            Comment ajouter 1-2 plats ultra-rentables à votre carte ce mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici une méthode concrète en 5 étapes pour ajouter immédiatement 1 ou 2 plats parmi le top 15
              à votre carte, sans casser votre identité culinaire.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Identifier les manques de votre carte actuelle',
                body: "Regardez votre carte : avez-vous une soupe ? Une salade composée ? Un dessert maison ? Un café gourmand ? Si l'un des 4 grands rentables (soupe / pâtes / dessert / café) manque, vous laissez de l'argent sur la table chaque jour.",
              },
              {
                title: 'Choisir 1-2 plats cohérents avec votre identité',
                body: "Une brasserie classique : ajoutez une soupe du jour (entrée) et un tiramisu maison (dessert). Une pizzeria : ajoutez une salade italienne et un tiramisu. Un bistrot : un café gourmand 4 mignardises maison.",
              },
              {
                title: 'Construire la fiche technique précise',
                body: "Listez chaque ingrédient, le grammage, le prix au kg. Calculez le coût matière total et le food cost. Validez que vous êtes dans la cible (sous 25 % idéalement). Utilisez notre calculateur food cost gratuit.",
              },
              {
                title: 'Tester le plat 1-2 semaines en plat du jour',
                body: "Avant de l'ajouter définitivement, proposez-le en plat du jour ou dessert du jour. Comptez le nombre de prises sur 10 services. Si > 30 % de prise = succès, intégrer à la carte. Si < 15 % = abandonner ou retravailler.",
              },
              {
                title: 'Optimiser le positionnement sur la carte',
                body: "Une fois adopté, placez le plat dans le Golden Triangle (haut à droite). Ajoutez une description détaillée, un encadré, voire une photo. Formez vos serveurs à le suggérer activement (\"je vous conseille notre soupe maison du jour, c'est notre spécialité\").",
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
            <strong>Calcul concret :</strong> ajouter une soupe maison à 7 EUR avec 8 prises par jour
            (vs 0 avant) = 8 * 6,35 EUR de marge brute = 50,80 EUR par jour, soit <strong>~1 524 EUR
            par mois de marge brute additionnelle</strong>. Sans aucun investissement, juste en optimisant
            votre carte.
          </Callout>
        </section>

        {/* ═════════════ SECTION 8 : Plats a eviter ═════════════ */}
        <section id="eviter" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="8">
            Les plats à éviter (faible marge ET faible volume)
          </SectionHeading>

          <div className="prose-content">
            <p>
              À l'inverse des stars, certains plats détruisent silencieusement votre marge. Ils combinent
              faible rentabilité ET faible popularité. <strong>Le retrait immédiat est la meilleure décision.</strong>
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <PlatEviterCard
              name="Plats nobles rares (homard, langouste, foie gras frais)"
              raison="Produits chers achetés en faibles quantités (forte volatilité stock = pertes), commande rare, food cost 35-45 %. Acceptez-les UNIQUEMENT en plat saisonnier limité (vacances) ou supprimez-les."
            />
            <PlatEviterCard
              name="Poissons rares peu connus (Saint-Pierre, lotte mais frais quotidien)"
              raison="Si vous ne vendez pas 5 portions par jour, le stock périt. Achat en gros bocal congelé ou retrait pur."
            />
            <PlatEviterCard
              name="Plats très techniques peu populaires (soufflé, poire belle helene)"
              raison="Temps de prep élevé, peu de prises, charge cuisinier. Sauf si plat signature différenciant."
            />
            <PlatEviterCard
              name="Trop de variantes végétariennes / vegan compliquées"
              raison="Une carte avec 5 plats vegan peu commandés = stocks dédiés, fiche techniques complexes. Mieux : 1-2 options végétariennes solides."
            />
            <PlatEviterCard
              name="Cocktails complexes à 8+ ingrédients"
              raison="Temps de préparation 4 min en service, marge dégradée, peu de demande. Concentrez-vous sur 5-6 cocktails signature."
            />
            <PlatEviterCard
              name="Desserts industriels (crème brûlée surgelée, mousse en sachet)"
              raison="Food cost certes maîtrisé mais perception client très négative. Marge brute en pourcentage trompeuse car volume bas."
            />
          </div>

          <Callout type="warning">
            <strong>Comment identifier vos Dogs :</strong> regardez votre POS sur 90 jours. Tout plat
            sous 2 % des ventes (donc moins de 1 prise par jour si vous faites 50 couverts) avec un
            food cost supérieur à 30 % est candidat au retrait. Une carte raccourcie de 30 % augmente généralement
            la marge globale de 5-10 points.
          </Callout>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="15 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* ═════════════ SECTION CTA ═════════════ */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Identifier vos plats les plus rentables en 2 minutes
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              RestauMargin analyse vos fiches techniques, classe vos plats en Stars / Plowhorses /
              Puzzles / Dogs et vous indique exactement quoi mettre en avant, quoi optimiser, quoi retirer.
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
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Food cost en restauration : guide complet</h3>
              <p className="text-xs text-mono-500">Calcul, benchmarks, optimisation. Tout sur le food cost en 2026.</p>
            </Link>
            <Link to="/blog/menu-engineering-boston-matrix" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Menu Engineering Boston Matrix</h3>
              <p className="text-xs text-mono-500">Stars, Plowhorses, Puzzles, Dogs : classez vos plats.</p>
            </Link>
            <Link to="/blog/fiche-technique-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Fiche technique restaurant</h3>
              <p className="text-xs text-mono-500">Modèle, grammages, allergènes : tout pour bien construire vos recettes.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calcul marge restaurant</h3>
              <p className="text-xs text-mono-500">Méthodes, formules, benchmarks. Le guide complet de la marge.</p>
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

function CritereCard({ icon, title, color, desc, metric }: {
  icon: React.ReactNode; title: string; color: string; desc: string; metric: string;
}) {
  const colors: Record<string, { bg: string; badge: string }> = {
    emerald: { bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700' },
    amber: { bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700' },
    blue: { bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
    purple: { bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-700' },
  };
  const c = colors[color] || colors.emerald;

  return (
    <div className={`${c.bg} rounded-2xl p-6 border border-mono-975`}>
      <div className={`w-10 h-10 ${c.badge} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <h3 className="font-bold text-mono-100 mb-2">{title}</h3>
      <p className="text-sm text-mono-400 leading-relaxed mb-4">{desc}</p>
      <div className="text-xs">
        <span className={`${c.badge} px-2 py-0.5 rounded font-semibold`}>{metric}</span>
      </div>
    </div>
  );
}

function PlatCard({ rank, icon, name, fc, mb, coef, tag, tagColor, children }: {
  rank: number; icon: React.ReactNode; name: string; fc: string; mb: string; coef: string;
  tag: string; tagColor: string; children: React.ReactNode;
}) {
  const tagColors: Record<string, string> = {
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    teal: 'bg-teal-100 text-teal-700',
  };
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 transition-colors">
      <div className="flex flex-wrap items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0 font-extrabold text-lg shadow-md">
          {rank}
        </div>
        <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-[200px]">
          <h3 className="font-bold text-mono-100 text-lg mb-1">{name}</h3>
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`text-xs ${tagColors[tagColor]} px-2 py-0.5 rounded-full font-bold uppercase tracking-wider`}>{tag}</span>
            <span className="text-xs text-mono-500"><strong>Food cost :</strong> {fc}</span>
            <span className="text-xs text-mono-500"><strong>Marge :</strong> {mb}</span>
            <span className="text-xs text-mono-500"><strong>Coef :</strong> {coef}</span>
          </div>
        </div>
      </div>
      <div className="text-sm text-mono-400 leading-relaxed pl-2 border-l-2 border-teal-100">
        {children}
      </div>
    </div>
  );
}

function PlatEviterCard({ name, raison }: { name: string; raison: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex gap-4">
      <div className="w-10 h-10 bg-red-100 text-red-700 rounded-lg flex items-center justify-center shrink-0 font-bold">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-semibold text-red-900 mb-1">{name}</h3>
        <p className="text-sm text-red-800 leading-relaxed">{raison}</p>
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
