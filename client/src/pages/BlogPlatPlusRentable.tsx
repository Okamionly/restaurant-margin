import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calculator, AlertTriangle, CheckCircle, ArrowRight, BarChart3, DollarSign, Target, BookOpen, Lightbulb, Award, ListChecks, Sparkles, Soup, Pizza, Salad, Coffee, Wine, Beef, IceCream, Utensils, Cake, Sandwich } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Quel est le plat le plus rentable dans un restaurant en 2026 ?"
   Cible PAA (People Also Ask) Google
   Mot-cle principal : plat le plus rentable restaurant
   ~3 200 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quel est le plat le plus rentable dans un restaurant ?',
    answer: "La soupe maison est le plat le plus rentable dans un restaurant : food cost de 8 a 12 %, marge brute de 88 a 92 %. Viennent ensuite les pates (food cost 12-18 %), les desserts faits maison (12-18 %), les pizzas (22-26 %) et les salades composees (15-22 %). Ces plats combinent un cout matiere faible, une preparation rapide et une perception de valeur elevee par le client.",
  },
  {
    question: 'Quelle est la marge brute moyenne d\'un plat de restaurant ?',
    answer: 'La marge brute moyenne d\'un plat de restaurant se situe entre 65 % et 75 %. Les plats les plus rentables (soupes, pates, cafe) depassent 80 % de marge brute. Les plats nobles (viande de qualite, poisson frais) descendent a 60-70 %. La cible varie selon le type d\'etablissement : pizzerias 75-85 %, brasseries 67-72 %, gastronomique 60-70 %.',
  },
  {
    question: 'Pourquoi la soupe est-elle le plat le plus rentable ?',
    answer: 'La soupe est le plat le plus rentable pour 4 raisons : (1) ingredients tres bon marche (legumes de saison, parures, bouillon maison) ; (2) preparation en grande quantite avec economies d\'echelle ; (3) cuisson lente sans surveillance constante ; (4) perception client elevee (entree reconfortante, valorisation cuisine maison). Une soupe vendue 7 EUR avec 0,70 EUR de cout matiere genere 90 % de marge brute.',
  },
  {
    question: 'Quel plat eviter pour ne pas perdre d\'argent ?',
    answer: 'Evitez les plats a faible marge ET faible volume : produits nobles peu commandes (homard, foie gras frais), poissons rares, plats tres techniques peu populaires. Le danger principal : un plat avec 35 % de food cost vendu seulement 3 fois par semaine immobilise des stocks (pertes), monopolise du temps de prep (perte de productivite) et ne contribue presque rien a la marge globale. La regle : retirer tout plat dans le quadrant Chien du menu engineering.',
  },
  {
    question: 'Comment calculer la rentabilite d\'un plat ?',
    answer: 'Rentabilite plat = (Prix de vente HT - Cout matieres) x Nombre de ventes mensuel. Exemple : pizza margherita a 8,42 EUR de marge brute x 200 ventes/mois = 1 684 EUR de marge mensuelle. Comparez ce montant entre tous vos plats pour identifier vos vraies stars. Un plat a 90 % de marge brute mais vendu 5 fois/mois rapporte moins qu\'un plat a 65 % vendu 200 fois.',
  },
  {
    question: 'Quel est le food cost ideal pour un plat rentable ?',
    answer: 'Le food cost ideal d\'un plat rentable se situe entre 15 % et 30 %. En dessous de 15 %, vous etes dans le tres rentable (soupes, cafe, certaines pates). De 15 a 25 % : excellent (pizzas, desserts maison). De 25 a 35 % : standard restauration. Au-dessus de 35 % : la marge nette devient fragile. Quel que soit le ratio, valorisez toujours un plat selon la marge brute en euros, pas seulement le pourcentage.',
  },
  {
    question: 'Faut-il mettre les plats les plus rentables en avant sur la carte ?',
    answer: 'Oui, c\'est exactement la methode du menu engineering. Identifiez vos Stars (forte marge + forte popularite) et mettez-les en haut a droite du menu (zone Golden Triangle), avec un encadre, en bold ou avec une photo. Vos Plowhorses (popularite haute, marge moyenne) doivent etre legerement reorientes vers la rentabilite via upselling de side dishes a forte marge (frites maison, salade).',
  },
  {
    question: 'Quel est le coefficient multiplicateur des plats les plus rentables ?',
    answer: 'Les plats les plus rentables ont un coefficient multiplicateur eleve : soupe 8 a 12, cafe 8 a 15, pates 5 a 8, pizza 4 a 6, dessert maison 5 a 8. Un coefficient eleve indique que le prix de vente est tres superieur au cout matiere. Mais attention : un coefficient eleve sur un produit a bas prix unitaire (cafe a 2,50 EUR) ne genere pas autant de marge en euros qu\'un coefficient bas sur un produit cher (entrecote a 25 EUR).',
  },
];

// Les 15 plats les plus rentables (pour schema ItemList)
const platsRentables = [
  { rank: 1, name: 'Soupe maison', fc: '8-12 %', mb: '88-92 %', coef: '8-12', desc: 'Le champion absolu. Legumes bon marche, cuisson lente, perception client elevee.' },
  { rank: 2, name: 'Pates (carbonara, bolognaise)', fc: '12-18 %', mb: '82-88 %', coef: '5-8', desc: 'Ingredients basiques (pates, oeufs, lard), preparation rapide, ticket moyen attractif.' },
  { rank: 3, name: 'Pizza margherita', fc: '22-26 %', mb: '74-78 %', coef: '3,8-4,5', desc: 'Cout matiere maitrise, productivite elevee, marche stable.' },
  { rank: 4, name: 'Salade nicoise / cesar', fc: '15-22 %', mb: '78-85 %', coef: '4,5-6,5', desc: 'Marche fort en ete, image healthy, marge brute confortable.' },
  { rank: 5, name: 'Risotto', fc: '18-22 %', mb: '78-82 %', coef: '4,5-5,5', desc: 'Riz arborio peu cher, image premium, signature italienne.' },
  { rank: 6, name: 'Burger maison', fc: '25-30 %', mb: '70-75 %', coef: '3,3-4,0', desc: 'Forte popularite, side dishes (frites) tres rentables, formule complete.' },
  { rank: 7, name: 'Dessert fait maison', fc: '12-18 %', mb: '82-88 %', coef: '5,5-8', desc: 'Tiramisu, mousse chocolat, tarte saison. Upsell post-repas tres rentable.' },
  { rank: 8, name: 'Cocktails signature', fc: '15-22 %', mb: '78-85 %', coef: '4,5-6,5', desc: 'Spiritueux + sirops + decoration. Ticket moyen eleve, marge solide.' },
  { rank: 9, name: 'Cafe / Expresso', fc: '8-12 %', mb: '88-92 %', coef: '8-12', desc: 'Le roi de la marge unitaire en pourcentage. Idee : push post-repas.' },
  { rank: 10, name: 'Wine pairing premium', fc: '25-33 %', mb: '67-75 %', coef: '3,0-4,0', desc: 'Verre vin a 6-9 EUR avec achat 1,50-2,50 EUR/bouteille pro. Up-sell.' },
  { rank: 11, name: 'Tartare de boeuf', fc: '28-32 %', mb: '68-72 %', coef: '3,1-3,6', desc: 'Pas de cuisson (gain energie + temps), prix de vente eleve, image premium.' },
  { rank: 12, name: 'Frites maison', fc: '12-18 %', mb: '82-88 %', coef: '5,5-8', desc: 'Pomme de terre bon marche, side ultra-marge, accompagnement quasi systematique.' },
  { rank: 13, name: 'Tapas / Petits plats', fc: '15-22 %', mb: '78-85 %', coef: '4,5-6,5', desc: 'Portions reduites, multi-commandes par table, tres rentable cumule.' },
  { rank: 14, name: 'Bowls healthy', fc: '20-28 %', mb: '72-80 %', coef: '3,6-5,0', desc: 'Tendance forte, ingredients optimisables, ticket midi attractif.' },
  { rank: 15, name: 'Plat du jour', fc: '20-28 %', mb: '72-80 %', coef: '3,6-5,0', desc: 'Permet d\'utiliser invendus et produits saison. Marge optimisable avec bonne prevision.' },
];

export default function BlogPlatPlusRentable() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Quel est le plat le plus rentable dans un restaurant en 2026 ? (top 15)"
        description="Decouvrez les plats les plus rentables d'un restaurant en 2026 : pates, pizza, salade, soupe, dessert maison. Top 15 avec marge brute, food cost et coefficient. Comment construire une carte ultra-rentable."
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
            description: 'Classement des plats les plus rentables a mettre a la carte d\'un restaurant, avec food cost, marge brute et coefficient multiplicateur.',
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
            description: 'Top 15 des plats les plus rentables a mettre a la carte d\'un restaurant : food cost, marge brute, coefficient multiplicateur et methode pour construire une carte ultra-rentable.',
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
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/outils/calculateur-marge-restaurant"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Calculer ma marge
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
          <span className="text-mono-100 font-medium">Plat le plus rentable restaurant</span>
        </div>
      </div>

      {/* ── Hero / H1 — BlogArticleHero ── */}
      <BlogArticleHero
        category="Rentabilite"
        readTime="15 min"
        date="Mai 2026"
        title="Quel est le plat le plus rentable dans un restaurant en 2026 ? (top 15)"
        accentWord="rentable"
        subtitle="Soupe, pates, pizza, salade, dessert maison : decouvrez les 15 plats les plus rentables avec leur food cost, leur marge brute et leur coefficient multiplicateur. Methode pour construire une carte ultra-rentable et eviter les pieges classiques."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="15 min" variant="header" />

        {/* ── Encadre reponse rapide (featured snippet) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Reponse rapide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Le top 5 des plats les plus rentables
          </h2>
          <p className="text-teal-50 text-base leading-relaxed">
            Les plats les plus rentables en restaurant en 2026 sont les <strong className="text-white">soupes maison</strong> (food cost 8-12 %, marge brute 88-92 %), les <strong className="text-white">pates</strong> (12-18 % food cost), les <strong className="text-white">pizzas</strong> (22-26 %), les <strong className="text-white">salades composees</strong> (15-22 %), et les <strong className="text-white">desserts faits maison</strong> (12-18 %). Ces plats combinent un cout matiere bas, une preparation rapide et une perception de valeur elevee par le client. Un <strong className="text-white">cafe simple</strong> a meme un food cost de 8 %.
          </p>
        </div>

        <p className="mt-6 text-sm text-mono-400 leading-relaxed">
          Pour aller plus loin, consultez notre guide du{' '}
          <Link to="/blog/reduire-food-cost" className="text-teal-700 underline hover:text-teal-800 font-medium">food cost en restauration</Link>{' '}
          (formule, calcul et benchmarks par type d'etablissement) et la methode du{' '}
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
              { href: '#criteres', label: 'Les criteres de rentabilite d\'un plat' },
              { href: '#top15', label: 'Top 15 des plats les plus rentables' },
              { href: '#tableau', label: 'Tableau recap : plat + food cost + prix vente + marge' },
              { href: '#piege', label: 'Le piege : forte marge mais faible volume' },
              { href: '#menu-engineering', label: 'La methode Menu Engineering (Stars / Plowhorses / Puzzles / Dogs)' },
              { href: '#ajouter', label: 'Comment ajouter 1-2 plats ultra-rentables a votre carte ce mois' },
              { href: '#eviter', label: 'Les plats a eviter (faible marge ET faible volume)' },
              { href: '#faq', label: 'Questions frequentes' },
              { href: '#cta', label: 'Calculez la rentabilite de vos plats gratuitement' },
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
              C'est probablement la question la plus posee par les restaurateurs qui revoient leur carte.
              Et la reponse est sans ambiguite : <strong>les soupes maison sont les plats les plus rentables
              dans un restaurant</strong>. Avec un food cost compris entre 8 % et 12 %, soit une marge brute
              de 88 a 92 %, elles surclassent largement les autres categories.
            </p>
            <p>
              Pourquoi un tel ecart ? Parce que la soupe combine quatre facteurs gagnants : des ingredients
              bon marche (legumes de saison, parures, bouillons maison), une preparation en grande quantite,
              une cuisson lente sans surveillance constante, et une perception client tres positive ("c'est
              fait maison, c'est genereux, c'est reconfortant").
            </p>
            <p>
              Mais la soupe n'est qu'un exemple. Les <strong>15 plats les plus rentables</strong> que nous
              detaillons dans cet article ont tous un point commun : <strong>un cout matiere maitrise sous
              les 30 %</strong>, une <strong>preparation rapide ou industrialisable</strong>, et une
              <strong> perception de valeur</strong> qui justifie le prix de vente.
            </p>

            <Callout type="info">
              <strong>Attention au piege du pourcentage :</strong> un plat a 90 % de marge brute vendu
              5 fois par semaine rapporte moins qu'un plat a 65 % vendu 200 fois. La rentabilite reelle
              se mesure en <strong>marge brute en euros multipliee par le volume de ventes</strong>.
              Nous y revenons en detail dans la section 5.
            </Callout>

            <p>
              Ce guide vous donne le classement complet, les benchmarks chiffres, la methode Menu
              Engineering pour piloter votre carte, et les pieges courants a eviter. A la fin, vous
              saurez exactement quels plats <strong>ajouter</strong>, lesquels <strong>booster</strong>,
              et lesquels <strong>retirer</strong>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Criteres de rentabilite ═════════════ */}
        <section id="criteres" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="2">
            Les criteres de rentabilite d'un plat
          </SectionHeading>

          <div className="prose-content">
            <p>
              Avant de classer les plats, definissons les 4 criteres qui rendent un plat rentable.
              Vous ne pouvez pas analyser un plat sur un seul indicateur. La vraie rentabilite,
              c'est l'intersection de quatre dimensions.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 mt-8">
            <CritereCard
              icon={<DollarSign className="w-6 h-6" />}
              title="1. Le food cost"
              color="emerald"
              desc="Le ratio entre le cout matiere et le prix de vente HT. C'est le KPI numero un. Un food cost sous 25 % indique un excellent ratio. Au-dessus de 35 %, vous comprimez vos charges."
              metric="Cible < 30 %"
            />
            <CritereCard
              icon={<Target className="w-6 h-6" />}
              title="2. La marge brute en euros"
              color="amber"
              desc="Prix de vente HT moins cout matieres. Critique : un cafe a 88 % de marge brute ne represente que 2 EUR de marge unitaire, vs 17 EUR pour une entrecote. Toujours raisonner en euros, pas seulement en %."
              metric="A maximiser"
            />
            <CritereCard
              icon={<ListChecks className="w-6 h-6" />}
              title="3. Le temps de preparation"
              color="blue"
              desc="Un plat rentable doit etre rapide ou industrialisable. La main d'oeuvre est votre 2eme poste de charge apres les matieres. Un plat qui prend 25 minutes a dresser en plein coup de feu casse votre productivite."
              metric="< 8 min en service"
            />
            <CritereCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="4. La popularite"
              color="purple"
              desc="Un plat a 80 % de marge brute commande 10 fois/mois ne contribue presque rien a votre chiffre d'affaires. Croisez TOUJOURS rentabilite et popularite (c'est le principe du Menu Engineering)."
              metric="> 5 % des ventes"
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>La formule de la rentabilite reelle :</strong>
            </p>
            <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-4 font-mono text-sm text-mono-100">
              Rentabilite mensuelle plat (EUR) = Marge brute unitaire (EUR) x Nombre de ventes mensuel
            </div>
            <p>
              Exemple chiffre : une pizza margherita avec 8,42 EUR de marge unitaire et 200 ventes par mois
              = <strong>1 684 EUR</strong> de contribution mensuelle. Une entrecote a 17,40 EUR de marge
              mais seulement 30 ventes par mois = <strong>522 EUR</strong>. La pizza est plus de 3x plus
              rentable en valeur absolue. Pourtant en pourcentage, l'entrecote a une marge plus elevee
              en valeur unitaire.
            </p>
            <p>
              Cette analyse croisee est la base du <Link to="/blog/menu-engineering-boston-matrix" className="text-teal-700 underline hover:text-teal-800">Menu Engineering Boston Matrix</Link>.
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
              Voici notre classement detaille des 15 plats les plus rentables a mettre a la carte
              d'un restaurant en France en 2026. Donnees issues de notre base de 500+ restaurants
              utilisant RestauMargin, croisees avec les benchmarks GIRA Conseil et SNRC.
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
                <strong>Pourquoi c'est rentable :</strong> ingredients tres bon marche (carottes 1,20 EUR/kg, oignons,
                celeri, parures de legumes recuperees), bouillon maison gratuit (carcasses de volaille, paures de
                viande), cuisson lente sans surveillance, perception elevee ("fait maison"), portion 250 mL = 25 cl.
              </p>
              <p className="mt-2">
                <strong>Exemple chiffre :</strong> velo de potiron vendu 7 EUR. Cout matiere : 0,65 EUR (1,40 g
                potiron + 30 g oignon + creme + bouillon). Food cost = 9,3 %, marge brute = 6,35 EUR.
              </p>
              <p className="mt-2 text-sm text-mono-500">
                <strong>Astuce pro :</strong> proposez une soupe en entree du jour qui change chaque jour selon
                vos invendus. Vous valorisez vos parures et reduisez votre gaspillage.
              </p>
            </PlatCard>

            <PlatCard
              rank={2}
              icon={<Utensils className="w-7 h-7" />}
              name="Pates (carbonara, bolognaise, pesto)"
              fc="12-18 %"
              mb="82-88 %"
              coef="5-8"
              tag="MEGA RENTABLE"
              tagColor="emerald"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> pates seches 1,80 EUR/kg, sauce maison preparee en
                amont (mise en place rapide en service), portion 140 g = 25 centimes de pates. Lard, oeuf,
                fromage rape : ingredients standards a faible cout.
              </p>
              <p className="mt-2">
                <strong>Exemple chiffre :</strong> carbonara vendue 14 EUR (12,72 EUR HT). Cout matiere : 1,80 EUR
                (pates + lard 50g + 1 jaune oeuf + parmesan + creme). Food cost = 14,1 %, marge brute = 10,92 EUR.
              </p>
              <p className="mt-2 text-sm text-mono-500">
                <strong>Astuce pro :</strong> 3-4 references de pates a la carte couvrent 80 % des envies. Pates
                fraiches sur 1-2 plats premium permet de monter en gamme avec marge encore meilleure (15 % FC).
              </p>
            </PlatCard>

            <PlatCard
              rank={3}
              icon={<Pizza className="w-7 h-7" />}
              name="Pizza margherita"
              fc="22-26 %"
              mb="74-78 %"
              coef="3,8-4,5"
              tag="TRES RENTABLE"
              tagColor="amber"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> pate maison (farine, eau, levure, sel) cout ridicule,
                sauce tomate 0,30 EUR par pizza, mozzarella et garniture maitrisees. La pizzeria est l'un des
                modeles les plus rentables car cout matiere stable, productivite elevee (50-80 pizzas/heure).
              </p>
              <p className="mt-2">
                <strong>Exemple chiffre :</strong> margherita 11 EUR (10 EUR HT). Cout matiere : 1,58 EUR
                (detail dans <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 underline">notre cas pratique pizza</Link>). Food cost = 15,8 %, marge brute = 8,42 EUR.
              </p>
              <p className="mt-2 text-sm text-mono-500">
                <strong>Astuce pro :</strong> 60 % de votre marge pizza vient des ajouts (jambon, champignons,
                supplement fromage). Travaillez vos pizzas avec 6-7 ingredients en moyenne, pas 3.
              </p>
            </PlatCard>

            <PlatCard
              rank={4}
              icon={<Salad className="w-7 h-7" />}
              name="Salade composee (nicoise, cesar, italienne)"
              fc="15-22 %"
              mb="78-85 %"
              coef="4,5-6,5"
              tag="TRES RENTABLE"
              tagColor="amber"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> base de salade 5 EUR/kg, garnitures variables a maitriser
                (oeufs, thon en conserve, poulet froid). Forte demande midi et ete. Image healthy = perception valeur.
              </p>
              <p className="mt-2">
                <strong>Exemple chiffre :</strong> salade cesar 13 EUR (11,82 EUR HT). Cout matiere : 2,15 EUR
                (laitue, poulet 80g, parmesan, croutons, sauce). Food cost = 18,2 %, marge brute = 9,67 EUR.
              </p>
              <p className="mt-2 text-sm text-mono-500">
                <strong>Astuce pro :</strong> proposez une formule midi "salade + boisson" a 15 EUR pour booster
                le ticket moyen sans degrader la marge.
              </p>
            </PlatCard>

            <PlatCard
              rank={5}
              icon={<Utensils className="w-7 h-7" />}
              name="Risotto"
              fc="18-22 %"
              mb="78-82 %"
              coef="4,5-5,5"
              tag="TRES RENTABLE"
              tagColor="amber"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> riz arborio 3,80 EUR/kg, portion 80 g = 30 centimes.
                Bouillon maison, parmesan rape, beurre, vin blanc. Image italienne signature, marge solide.
              </p>
              <p className="mt-2">
                <strong>Exemple chiffre :</strong> risotto champignons 16 EUR (14,55 EUR HT). Cout matiere :
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
                <strong>Pourquoi c'est rentable :</strong> steak hache 8-12 EUR/kg (140g portion = 1,12 a 1,68 EUR),
                pain artisan 0,50 EUR, cheddar, salade, sauce maison. Marge legere mais volume tres eleve, side
                frites ultra-rentable, formule complete optimise le ticket.
              </p>
              <p className="mt-2">
                <strong>Exemple chiffre :</strong> burger classique 14 EUR (12,72 EUR HT). Cout matiere : 3,50 EUR
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
                <strong>Pourquoi c'est rentable :</strong> tiramisu, mousse chocolat, tarte saison, creme brulee.
                Ingredients bon marche (oeufs, sucre, mascarpone, chocolat) et upsell post-repas tres simple.
                75 % des clients qui voient un dessert en commandent un.
              </p>
              <p className="mt-2">
                <strong>Exemple chiffre :</strong> tiramisu 7,50 EUR (6,82 EUR HT). Cout matiere : 0,95 EUR
                (mascarpone + oeufs + biscuits + cafe + cacao). Food cost = 13,9 %, marge brute = 5,87 EUR.
              </p>
              <p className="mt-2 text-sm text-mono-500">
                <strong>Astuce pro :</strong> 4-5 desserts a la carte avec rotation saison (tarte fruits rouges
                ete, fondant chocolat hiver). Photo desserts sur table = +20 % de prise.
              </p>
            </PlatCard>

            <PlatCard
              rank={8}
              icon={<Wine className="w-7 h-7" />}
              name="Cocktails signature"
              fc="15-22 %"
              mb="78-85 %"
              coef="4,5-6,5"
              tag="TRES RENTABLE"
              tagColor="amber"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> spiritueux 35-50 EUR/L (4 cl = 1,40 a 2 EUR),
                sirops maison, decoration. Ticket eleve et perception haut de gamme. Marge boissons toujours
                superieure a marge food.
              </p>
              <p className="mt-2">
                <strong>Exemple chiffre :</strong> mojito signature 12 EUR (10,91 EUR HT). Cout matiere :
                1,90 EUR (rhum 4cl + sucre canne + citron vert + menthe + eau gazeuse). Food cost = 17,4 %,
                marge brute = 9,01 EUR.
              </p>
            </PlatCard>

            <PlatCard
              rank={9}
              icon={<Coffee className="w-7 h-7" />}
              name="Cafe / Expresso"
              fc="8-12 %"
              mb="88-92 %"
              coef="8-12"
              tag="LE CHAMPION %"
              tagColor="emerald"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> 7g de cafe par tasse a 18 EUR/kg = 0,12 EUR. Vendu
                2,50 EUR = 95 % de marge brute. Le ratio le plus eleve de la restauration. <strong>Mais</strong>
                marge unitaire en euros tres faible (2,38 EUR).
              </p>
              <p className="mt-2">
                <strong>Astuce pro :</strong> push systematique en fin de repas. Cafe gourmand a 6 EUR (cafe +
                3 mignardises) = marge brute 4,80 EUR = +50 % de marge vs cafe seul.
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
                <strong>Pourquoi c'est rentable :</strong> bouteille fournisseur 6-10 EUR pour un vin a 30-40 EUR
                vendu. Verre 12 cl a 6-9 EUR = marge unitaire 4-7 EUR avec coefficient 3,5-4. Volume eleve si
                bonne carte.
              </p>
              <p className="mt-2 text-sm text-mono-500">
                <strong>Astuce pro :</strong> creer 2-3 accords mets-vins suggeres (steak + cabernet, poisson +
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
                <strong>Pourquoi c'est rentable :</strong> boeuf rumsteck a 16-20 EUR/kg (180g = 2,88-3,60 EUR),
                pas de cuisson (gain energie + temps), prix de vente eleve (22-26 EUR). Image premium, perception
                cuisine technique.
              </p>
              <p className="mt-2">
                <strong>Exemple chiffre :</strong> tartare classique 24 EUR (21,82 EUR HT). Cout matiere : 6,60 EUR
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
                Side accompagnement quasi systematique (80 % des burgers, 60 % des grillades, formules midi).
                Vendu 5-6 EUR en supplement ou comprise dans plat = marge brute 4,50-5 EUR par portion.
              </p>
              <p className="mt-2 text-sm text-mono-500">
                <strong>Astuce pro :</strong> proposer frites maison vs frites surgelees premium. Storytelling
                "double cuisson maison" justifie supplement 1 EUR.
              </p>
            </PlatCard>

            <PlatCard
              rank={13}
              icon={<Utensils className="w-7 h-7" />}
              name="Tapas / Petits plats"
              fc="15-22 %"
              mb="78-85 %"
              coef="4,5-6,5"
              tag="TRES RENTABLE"
              tagColor="amber"
            >
              <p>
                <strong>Pourquoi c'est rentable :</strong> portions reduites = cout matiere ridicule (1-2 EUR),
                multi-commandes par table (3-5 tapas par couvert). Ticket moyen tres eleve cumule, ambiance
                conviviale.
              </p>
              <p className="mt-2">
                <strong>Exemple chiffre :</strong> 3 tapas a 7,50 EUR = 22,50 EUR. Cout matiere total : 3,50 EUR.
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
                <strong>Pourquoi c'est rentable :</strong> tendance forte 2024-2026, ingredients optimisables
                (riz, quinoa, legumes, proteines varies), composition modulable. Ticket midi attractif (12-16 EUR).
                Image premium et generation Z.
              </p>
              <p className="mt-2">
                <strong>Exemple chiffre :</strong> bowl poke saumon 14 EUR (12,72 EUR HT). Cout matiere : 3,20 EUR
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
                (-30 % vs hors saison), ajuster cout matiere a la baisse. Tres demande midi (rapidite client).
                Si bonne prevision = food cost optimise.
              </p>
              <p className="mt-2 text-sm text-mono-500">
                <strong>Astuce pro :</strong> annoncez le plat du jour la veille sur reseaux sociaux + tableau
                exterieur = clients sains a venir. <Link to="/blog/fiche-technique-restaurant" className="text-teal-700 underline">Bien standardiser la fiche technique</Link>.
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
              Vue d'ensemble synthetique des 15 plats avec exemple de prix de vente moyen TTC,
              cout matiere et marge brute en euros. Donnees observees en restaurant standard parisien 2026.
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
                  { rank: 2, name: 'Pates', fc: '12-18 %', mb: '82-88 %', coef: '5-8', euros: '10,90 EUR' },
                  { rank: 3, name: 'Pizza margherita', fc: '22-26 %', mb: '74-78 %', coef: '3,8-4,5', euros: '8,40 EUR' },
                  { rank: 4, name: 'Salade composee', fc: '15-22 %', mb: '78-85 %', coef: '4,5-6,5', euros: '9,70 EUR' },
                  { rank: 5, name: 'Risotto', fc: '18-22 %', mb: '78-82 %', coef: '4,5-5,5', euros: '11,65 EUR' },
                  { rank: 6, name: 'Burger maison', fc: '25-30 %', mb: '70-75 %', coef: '3,3-4,0', euros: '9,20 EUR' },
                  { rank: 7, name: 'Dessert maison', fc: '12-18 %', mb: '82-88 %', coef: '5,5-8', euros: '5,90 EUR' },
                  { rank: 8, name: 'Cocktail signature', fc: '15-22 %', mb: '78-85 %', coef: '4,5-6,5', euros: '9,00 EUR' },
                  { rank: 9, name: 'Cafe', fc: '8-12 %', mb: '88-92 %', coef: '8-12', euros: '2,40 EUR' },
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
              <strong>Lecture du tableau :</strong> le cafe a la meilleure marge en pourcentage (88-92 %)
              mais la plus faible marge en euros (2,40 EUR). Le tartare de boeuf a une marge en pourcentage
              moyenne (68-72 %) mais la plus forte marge en euros (15,20 EUR). C'est pourquoi votre carte
              doit melanger les deux profils.
            </p>
            <p>
              Pour mesurer la rentabilite reelle, multipliez la marge euros par votre volume mensuel. Utilisez
              notre <Link to="/outils/calculateur-marge-restaurant" className="text-teal-700 underline">calculateur marge restaurant</Link> ou le calculateur de <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline">food cost</Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Le piege ═════════════ */}
        <section id="piege" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="5">
            Le piege : forte marge MAIS faible volume
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
                <li><strong>Marge brute :</strong> 21,76 EUR / unite</li>
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
                <li><strong>Marge brute :</strong> 8,42 EUR / unite</li>
                <li><strong>Ventes/mois :</strong> 220</li>
                <li className="border-t border-emerald-300 mt-2 pt-2"><strong>Marge mensuelle :</strong> 1 852 EUR</li>
              </ul>
            </div>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Le constat est sans appel :</strong> la pizza margherita rapporte 7x plus de marge en
              euros que le filet de Saint-Pierre. Pourtant, la marge unitaire de Saint-Pierre est presque
              3x superieure. La popularite (volume) est le multiplicateur absolu.
            </p>

            <Callout type="warning">
              <strong>Trois erreurs courantes :</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Mettre en avant un plat a 90 % de marge brute mais commande 5 fois/mois.</li>
                <li>Supprimer un plat a 65 % de marge brute mais commande 200 fois/mois.</li>
                <li>Calibrer toute sa carte sur le pourcentage, sans regarder le volume reel.</li>
              </ul>
            </Callout>

            <p>
              La methode pour ne plus tomber dans ce piege : analyser systematiquement vos plats avec le
              <strong> Menu Engineering Boston Matrix</strong> (section suivante). Cette grille croisee
              rentabilite x popularite classe vos plats en 4 categories d'action.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Menu Engineering ═════════════ */}
        <section id="menu-engineering" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="6">
            La methode Menu Engineering (Stars / Plowhorses / Puzzles / Dogs)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le <strong>Menu Engineering</strong> est la methode professionnelle pour piloter votre carte.
              Elle croise deux axes : <strong>rentabilite</strong> (marge brute en euros) et <strong>popularite</strong>
              (% des ventes). Cela donne 4 categories de plats, chacune avec un plan d'action specifique.
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-300 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-6 h-6 text-emerald-700" />
                <h3 className="text-lg font-bold text-emerald-900">STARS</h3>
              </div>
              <p className="text-xs uppercase tracking-wider text-emerald-800 font-semibold mb-2">Forte marge + forte popularite</p>
              <p className="text-sm text-emerald-900 mb-3">
                Vos plats champions. Ils generent l'essentiel de votre marge. <strong>Action :</strong>
                proteger leur position (qualite constante, peu de changement). Mettre en haut a droite du menu
                (Golden Triangle). Photo ou encadre. C'est la zone ou le client regarde en premier.
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
              <p className="text-xs uppercase tracking-wider text-blue-800 font-semibold mb-2">Faible marge + forte popularite</p>
              <p className="text-sm text-blue-900 mb-3">
                Les chevaux de labour. Tres demandes mais marge moyenne. <strong>Action :</strong> augmenter
                la marge sans casser la popularite. Reduire portions de 10 %, augmenter prix de 0,50 EUR,
                proposer side dishes a forte marge en accompagnement.
              </p>
              <p className="text-xs text-blue-700 italic">
                Typiquement : steak frites traditionnel, poulet roti, salade du chef.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-300 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-6 h-6 text-purple-700" />
                <h3 className="text-lg font-bold text-purple-900">PUZZLES</h3>
              </div>
              <p className="text-xs uppercase tracking-wider text-purple-800 font-semibold mb-2">Forte marge + faible popularite</p>
              <p className="text-sm text-purple-900 mb-3">
                Le potentiel non exploite. Tres rentables mais peu commandes. <strong>Action :</strong>
                augmenter la visibilite. Mettre une description plus seduisante, ajouter photo, encadrer,
                former les serveurs a les suggerer activement, descriptions detaillees.
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
              <p className="text-xs uppercase tracking-wider text-red-800 font-semibold mb-2">Faible marge + faible popularite</p>
              <p className="text-sm text-red-900 mb-3">
                Les poids morts. Peu rentables ET peu demandes. <strong>Action :</strong> les retirer purement
                et simplement. Ils immobilisent du stock, alourdissent la carte, monopolisent du temps de prep.
                Remplacez par un plat de la categorie Puzzle.
              </p>
              <p className="text-xs text-red-700 italic">
                Typiquement : plats complexes peu connus, produits chers peu commandes.
              </p>
            </div>
          </div>

          <div className="prose-content mt-8">
            <p>
              Pour aller plus loin, consultez notre guide complet <Link to="/blog/menu-engineering-boston-matrix" className="text-teal-700 underline hover:text-teal-800">Menu Engineering Boston Matrix</Link>
              {' '}avec un exemple chiffre sur une carte de 20 plats.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : Comment ajouter ═════════════ */}
        <section id="ajouter" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="7">
            Comment ajouter 1-2 plats ultra-rentables a votre carte ce mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici une methode concrete en 5 etapes pour ajouter immediatement 1 ou 2 plats parmi le top 15
              a votre carte, sans casser votre identite culinaire.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Identifier les manques de votre carte actuelle',
                body: "Regardez votre carte : avez-vous une soupe ? Une salade composee ? Un dessert maison ? Un cafe gourmand ? Si l'un des 4 grands rentables (soupe / pates / dessert / cafe) manque, vous laissez de l'argent sur la table chaque jour.",
              },
              {
                title: 'Choisir 1-2 plats coherents avec votre identite',
                body: "Une brasserie classique : ajoutez une soupe du jour (entree) et un tiramisu maison (dessert). Une pizzeria : ajoutez une salade italienne et un tiramisu. Un bistrot : un cafe gourmand 4 mignardises maison.",
              },
              {
                title: 'Construire la fiche technique precise',
                body: "Listez chaque ingredient, le grammage, le prix au kg. Calculez le cout matiere total et le food cost. Validez que vous etes dans la cible (sous 25 % idealement). Utilisez notre calculateur food cost gratuit.",
              },
              {
                title: 'Tester le plat 1-2 semaines en plat du jour',
                body: "Avant de l'ajouter definitivement, proposez-le en plat du jour ou dessert du jour. Comptez le nombre de prises sur 10 services. Si > 30 % de prise = succes, integrer a la carte. Si < 15 % = abandonner ou retravailler.",
              },
              {
                title: 'Optimiser le positionnement sur la carte',
                body: "Une fois adopte, placez le plat dans le Golden Triangle (haut a droite). Ajoutez une description detaillee, un encadre, voire une photo. Formez vos serveurs a le suggerer activement (\"je vous conseille notre soupe maison du jour, c'est notre specialite\").",
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
            <strong>Calcul concret :</strong> ajouter une soupe maison a 7 EUR avec 8 prises par jour
            (vs 0 avant) = 8 * 6,35 EUR de marge brute = 50,80 EUR par jour, soit <strong>~1 524 EUR
            par mois de marge brute additionnelle</strong>. Sans aucun investissement, juste en optimisant
            votre carte.
          </Callout>
        </section>

        {/* ═════════════ SECTION 8 : Plats a eviter ═════════════ */}
        <section id="eviter" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="8">
            Les plats a eviter (faible marge ET faible volume)
          </SectionHeading>

          <div className="prose-content">
            <p>
              A l'inverse des stars, certains plats detruisent silencieusement votre marge. Ils combinent
              faible rentabilite ET faible popularite. <strong>Le retrait immediat est la meilleure decision.</strong>
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <PlatEviterCard
              name="Plats nobles rares (homard, langouste, foie gras frais)"
              raison="Produits chers achetes en faibles quantites (forte volatilite stock = pertes), commande rare, food cost 35-45 %. Acceptez-les UNIQUEMENT en plat saisonnier limite (vacances) ou supprimez-les."
            />
            <PlatEviterCard
              name="Poissons rares peu connus (Saint-Pierre, lotte mais frais quotidien)"
              raison="Si vous ne vendez pas 5 portions par jour, le stock perit. Achat en gros bocal congele ou retrait pur."
            />
            <PlatEviterCard
              name="Plats tres techniques peu populaires (souffle, poire belle helene)"
              raison="Temps de prep eleve, peu de prises, charge cuisinier. Sauf si plat signature differenciant."
            />
            <PlatEviterCard
              name="Trop de variantes vegetariennes / vegan compliques"
              raison="Une carte avec 5 plats vegan peu commandes = stocks dedies, fiche techniques complexes. Mieux : 1-2 options vegetariennes solides."
            />
            <PlatEviterCard
              name="Cocktails complexes a 8+ ingredients"
              raison="Temps de preparation 4 min en service, marge degradee, peu de demande. Concentrez-vous sur 5-6 cocktails signature."
            />
            <PlatEviterCard
              name="Desserts industriels (creme brulee surgelee, mousse en sachet)"
              raison="Food cost certes maitrise mais perception client tres negative. Marge brute en pourcentage trompeuse car volume bas."
            />
          </div>

          <Callout type="warning">
            <strong>Comment identifier vos Dogs :</strong> regardez votre POS sur 90 jours. Tout plat
            sous 2 % des ventes (donc moins de 1 prise par jour si vous faites 50 couverts) avec un
            food cost superieur a 30 % est candidat au retrait. Une carte raccourcie de 30 % augmente generalement
            la marge globale de 5-10 points.
          </Callout>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="15 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes</h2>
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
              <p className="text-xs text-mono-500">Modele, grammages, allergenes : tout pour bien construire vos recettes.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calcul marge restaurant</h3>
              <p className="text-xs text-mono-500">Methodes, formules, benchmarks. Le guide complet de la marge.</p>
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
