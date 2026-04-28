import { Link, useParams, Navigate } from 'react-router-dom';
import {
  ChefHat, Calculator, ArrowRight, CheckCircle2, Clock, Sparkles,
  TrendingUp, Scale, BarChart3, Star, Quote, Shield, Euro,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';

/* ═══════════════════════════════════════════════════════════════
   Niche Landing Pages — Programmatic SEO
   Une URL = un type de resto, chaque page est prerendue et canonical unique.
   Routes :
     /guide-marge/pizzeria
     /guide-marge/brasserie
     /guide-marge/bistro
     /guide-marge/food-truck
     /guide-marge/restaurant-gastronomique
   ═══════════════════════════════════════════════════════════════ */

interface NicheConfig {
  slug: string;
  title: string;
  h1: string;
  tagline: string;
  description: string;
  heroSubtitle: string;
  avgMargin: string;
  avgFoodCost: string;
  avgCoef: string;
  challenges: string[];
  stats: Array<{ label: string; value: string; color: 'teal' | 'emerald' | 'amber' | 'rose' }>;
  testimonial: { quote: string; author: string; role: string };
  faqs: Array<{ q: string; a: string }>;
}

const NICHES: Record<string, NicheConfig> = {
  'pizzeria': {
    slug: 'pizzeria',
    title: 'Calcul de marge pizzeria : guide complet 2026',
    h1: 'Optimisez la marge de votre pizzeria',
    tagline: 'Logiciel de gestion specialise pour pizzerias',
    description: 'Guide et outil pour calculer les marges de votre pizzeria. Food cost, coefficient multiplicateur, rentabilite par pizza, gestion pate, garnitures, et optimisation prix de vente.',
    heroSubtitle: "Calculez precisement le cout de chaque pizza, optimisez vos garnitures et augmentez votre marge de 15 a 25% avec RestauMargin.",
    avgMargin: '65-75%',
    avgFoodCost: '28-32%',
    avgCoef: '3,5 a 4',
    challenges: [
      'Variations de prix farine, mozzarella, tomates',
      'Garnitures multiples : difficile de standardiser',
      'Pizzas au menu fixe vs pizzas du jour : marges differentes',
      'Gaspillage pate si mauvaise prevision',
      'Livraison : commission plateformes mange la marge',
    ],
    stats: [
      { label: 'Food cost moyen', value: '30%', color: 'teal' },
      { label: 'Marge brute cible', value: '70%', color: 'emerald' },
      { label: 'Coefficient type', value: '3,8x', color: 'amber' },
      { label: 'Fiches techniques RestauMargin', value: '225+', color: 'rose' },
    ],
    testimonial: {
      quote: "Avec RestauMargin j'ai identifie 3 pizzas en dessous du seuil de rentabilite. En ajustant les garnitures et le prix, j'ai recupere 8% de marge en 2 mois.",
      author: 'Marco',
      role: 'Pizzaiolo, Montpellier',
    },
    faqs: [
      { q: 'Quelle est la marge moyenne d\'une pizzeria ?', a: 'La marge brute d\'une pizzeria tourne autour de 65-75%. Les pizzerias bien gerees atteignent 72-75% grace a un food cost maitrise (28-32%) et des garnitures standardisees.' },
      { q: 'Comment calculer le cout d\'une pizza ?', a: 'Cout matiere = pate (farine, eau, huile, levure, sel) + base tomate + mozzarella + garnitures. Pesez chaque composant pour une fiche technique precise. RestauMargin automatise ce calcul pour chaque pizza.' },
      { q: 'Quel coefficient multiplicateur appliquer en pizzeria ?', a: 'Le coefficient multiplicateur standard en pizzeria est de 3,5 a 4. Exemple : pizza a 3,50€ de cout matiere → prix de vente entre 12 et 14€ selon positionnement.' },
      { q: 'Comment RestauMargin aide une pizzeria ?', a: 'Fiches techniques par pizza, gestion stock farine/mozzarella/garnitures, alertes prix fournisseurs, calcul marge par plat en temps reel, et suggestions IA pour optimiser les pizzas non rentables.' },
    ],
  },
  'brasserie': {
    slug: 'brasserie',
    title: 'Calcul de marge brasserie : guide complet 2026',
    h1: 'Optimisez la marge de votre brasserie',
    tagline: 'Logiciel de gestion pour brasseries et restaurants traditionnels',
    description: 'Guide et outil pour calculer les marges de votre brasserie. Gestion carte, plat du jour, menu entree-plat-dessert, boissons, et optimisation food cost.',
    heroSubtitle: "Maitrisez vos marges solides ET boissons, optimisez votre carte et augmentez votre rentabilite avec une vraie gestion professionnelle.",
    avgMargin: '70-75%',
    avgFoodCost: '25-30%',
    avgCoef: '4 a 4,5',
    challenges: [
      'Carte variee : nombreuses fiches techniques a gerer',
      'Menu du jour change : mise a jour manuelle chronophage',
      'Marges solides vs boissons tres differentes',
      'Produits saisonniers : prix fluctuent',
      'Service midi rapide, service soir gastronomique : rotations differentes',
    ],
    stats: [
      { label: 'Food cost solides', value: '28%', color: 'teal' },
      { label: 'Marge brute cible', value: '72%', color: 'emerald' },
      { label: 'Coefficient type', value: '4,2x', color: 'amber' },
      { label: 'Marge boissons', value: '80%+', color: 'rose' },
    ],
    testimonial: {
      quote: "En 3 mois j'ai gagne 4 points de marge brute en identifiant les plats du menu qui coutaient trop cher en matiere premiere. Le dashboard RestauMargin me montre ca en temps reel.",
      author: 'Sylvie',
      role: 'Gerante de brasserie, Lyon',
    },
    faqs: [
      { q: 'Quelle marge moyenne pour une brasserie ?', a: 'La marge brute d\'une brasserie se situe entre 70% et 75% sur les solides, et atteint 80%+ sur les boissons. La marge globale moyenne apres charges est de 4% a 8% selon la gestion.' },
      { q: 'Comment gerer le menu du jour ?', a: 'Le menu du jour doit etre cree chaque matin avec fiche technique validee avant service. RestauMargin permet de generer la fiche en 2 minutes avec ingredients + grammages + calcul marge automatique.' },
      { q: 'Food cost boissons vs solides ?', a: 'Boissons : 20-25% de food cost. Solides : 28-32%. C\'est pour cela qu\'une brasserie doit equilibrer ses ventes : un menu qui vend beaucoup de boissons est plus rentable.' },
      { q: 'RestauMargin gere-t-il la carte complete ?', a: 'Oui, recettes illimitees en plan Pro. Import CSV possible depuis votre carte actuelle. Categorisation entrees/plats/desserts/boissons automatique.' },
    ],
  },
  'bistro': {
    slug: 'bistro',
    title: 'Calcul de marge bistrot : guide complet 2026',
    h1: 'Optimisez la marge de votre bistrot',
    tagline: 'Logiciel de gestion simple pour bistrots et cafes-restaurants',
    description: 'Guide et outil pour calculer les marges de votre bistrot. Gestion simple, ardoise du jour, rotation rapide et optimisation du food cost au quotidien.',
    heroSubtitle: "L'outil pense pour les bistrots : simple, rapide, efficace. Calcul marges a l'ardoise du jour, en 30 secondes.",
    avgMargin: '68-73%',
    avgFoodCost: '27-32%',
    avgCoef: '3,8 a 4,2',
    challenges: [
      'Ardoise qui change chaque jour : fiches techniques a la volee',
      'Petite equipe : pas le temps de faire des calculs manuels',
      'Budget logiciel limite : besoin d\'un outil pas cher',
      'Approvisionnement de proximite : prix variables',
      'Menu rapide midi, plus elabore soir',
    ],
    stats: [
      { label: 'Food cost moyen', value: '29%', color: 'teal' },
      { label: 'Marge brute cible', value: '70%', color: 'emerald' },
      { label: 'Coefficient type', value: '4x', color: 'amber' },
      { label: 'Ticket moyen', value: '18-25€', color: 'rose' },
    ],
    testimonial: {
      quote: "Je bossais avec Excel, je perdais 2h par semaine. Avec RestauMargin je saisis un plat en 1 minute et ma marge est calculee automatiquement.",
      author: 'Antoine',
      role: 'Patron de bistrot, Paris',
    },
    faqs: [
      { q: 'Quelle marge moyenne pour un bistrot ?', a: 'La marge brute d\'un bistrot est generalement de 68-73% sur les plats et 80%+ sur les boissons. La marge nette apres charges tourne autour de 3% a 6%.' },
      { q: 'Comment gerer l\'ardoise du jour ?', a: 'RestauMargin permet de creer une fiche technique en 1 minute : ingredients + grammages + prix automatiques depuis votre base. Vous imprimez directement l\'ardoise avec prix optimal.' },
      { q: 'RestauMargin convient-il aux petits bistrots ?', a: 'Oui. Le plan Basic est gratuit (50 ingredients, 10 recettes, 1 utilisateur) pour tester. Le plan Pro a 29€/mois couvre tous les besoins d\'un bistrot classique.' },
      { q: 'Import de ma carte actuelle ?', a: 'Oui, import CSV ou Excel. Nous pouvons aussi reprendre vos fiches techniques papier via l\'assistant IA qui les numerise en quelques secondes.' },
    ],
  },
  'food-truck': {
    slug: 'food-truck',
    title: 'Calcul de marge food truck : guide complet 2026',
    h1: 'Optimisez la marge de votre food truck',
    tagline: 'Logiciel de gestion mobile pour food trucks et street food',
    description: 'Guide et outil pour calculer les marges de votre food truck. Gestion offline, fiches techniques rapides, rotation ingredients et optimisation par site.',
    heroSubtitle: "Calculez vos marges partout ou vous etes, meme hors ligne. L'outil pense pour le street food rapide et nomade.",
    avgMargin: '60-70%',
    avgFoodCost: '30-35%',
    avgCoef: '3 a 3,5',
    challenges: [
      'Connexion internet pas toujours disponible',
      'Menu court mais volume eleve',
      'Ingredients peris vite : gestion FIFO critique',
      'Variations de frequentation selon site et meteo',
      'Equipe reduite : pas de temps pour de la compta',
    ],
    stats: [
      { label: 'Food cost moyen', value: '32%', color: 'teal' },
      { label: 'Marge brute cible', value: '68%', color: 'emerald' },
      { label: 'Coefficient type', value: '3,2x', color: 'amber' },
      { label: 'Ticket moyen', value: '10-15€', color: 'rose' },
    ],
    testimonial: {
      quote: "J'ai 4 food trucks sur Montpellier. RestauMargin me permet de voir les marges de chaque truck separement. J'ai identifie lequel sous-performait et reajuste en 1 mois.",
      author: 'Karim',
      role: 'Patron de 4 food trucks',
    },
    faqs: [
      { q: 'Quelle marge moyenne pour un food truck ?', a: 'La marge brute d\'un food truck se situe entre 60% et 70%, avec un ticket moyen de 10-15€ et un food cost de 30-35%. La marge nette est souvent superieure a un restaurant classique grace aux charges reduites.' },
      { q: 'RestauMargin fonctionne hors ligne ?', a: 'Oui, le mode PWA permet de continuer a saisir ventes et gerer stocks meme sans connexion. Les donnees se syncent automatiquement quand le reseau revient.' },
      { q: 'Comment gerer plusieurs food trucks ?', a: 'Le plan Business permet de gerer multi-etablissements depuis un dashboard unique. Vous voyez les marges de chaque truck en temps reel et comparez les performances.' },
      { q: 'Gestion FIFO pour ingredients peris ?', a: 'Oui, l\'inventaire inclut date de peremption, lot fournisseur et methode FIFO automatique. Alertes si ingredient approche expiration.' },
    ],
  },
  'restaurant-gastronomique': {
    slug: 'restaurant-gastronomique',
    title: 'Calcul de marge restaurant gastronomique : guide 2026',
    h1: 'Maitrisez la marge de votre restaurant gastronomique',
    tagline: 'Logiciel de gestion pour restaurants gastronomiques et etoiles',
    description: 'Guide et outil pour calculer les marges d\'un restaurant gastronomique. Fiches techniques precises, produits nobles, traçabilite HACCP et gestion menu degustation.',
    heroSubtitle: "Precision au milligramme pres. Tracabilite HACCP integree. Fiches techniques professionnelles pour menus degustation et a la carte.",
    avgMargin: '65-75%',
    avgFoodCost: '25-35%',
    avgCoef: '3 a 4',
    challenges: [
      'Produits nobles a tracer precisement (homard, truffe, caviar)',
      'Fiches techniques au milligramme (sauces, reductions)',
      'Menu degustation : rentabilite plat par plat',
      'HACCP strict : tracabilite obligatoire',
      'Saisonnalite : adaptation carte chaque mois',
    ],
    stats: [
      { label: 'Food cost moyen', value: '30%', color: 'teal' },
      { label: 'Marge brute cible', value: '70%', color: 'emerald' },
      { label: 'Coefficient type', value: '3,5x', color: 'amber' },
      { label: 'Ticket moyen', value: '80-250€', color: 'rose' },
    ],
    testimonial: {
      quote: "La balance connectee RestauMargin avec les fiches techniques au mg pres, c'est un gain de temps enorme pour mon equipe. Et l'HACCP est integre, plus besoin de carnets papier.",
      author: 'Chef Laurent',
      role: 'Chef etoile, Occitanie',
    },
    faqs: [
      { q: 'Quelle marge moyenne pour un restaurant gastronomique ?', a: 'La marge brute d\'un restaurant gastronomique tourne autour de 65-75%, avec un food cost plus eleve (25-35%) a cause des produits nobles. La marge nette est impactee par le cout de la brigade (plus elevee qu\'un restaurant classique).' },
      { q: 'Precision des fiches techniques ?', a: 'RestauMargin permet de travailler au milligramme. Idealement avec une balance Bluetooth connectee, vous saisissez les grammages en direct lors de la preparation.' },
      { q: 'Gestion HACCP ?', a: 'Module HACCP complet : releves de temperatures, plan de maitrise sanitaire, traçabilite lots fournisseurs, registre temperatures frigos/conges automatique.' },
      { q: 'Menu degustation plat par plat ?', a: 'Oui, vous creez chaque plat separement avec sa marge. Le menu degustation est la somme des plats avec son coefficient global. Vous voyez la rentabilite globale ET plat par plat.' },
    ],
  },
  'cafe-coffee-shop': {
    slug: 'cafe-coffee-shop',
    title: 'Calcul de marge cafe et coffee shop : guide complet 2026',
    h1: 'Optimisez la marge de votre cafe et coffee shop',
    tagline: 'Logiciel de gestion specialise pour cafes et coffee shops',
    description: 'Guide et outil pour calculer les marges de votre cafe ou coffee shop. Food cost cafe, coefficient boissons, marge patisserie, gestion takeaway et optimisation recettes signature.',
    heroSubtitle: "Le cafe a 0,20€ de matiere vendu 3,50€ : un des meilleurs coefficients de la restauration. Mais mal gere, le food cost explose. RestauMargin vous donne la maitrise totale.",
    avgMargin: '70-78%',
    avgFoodCost: '22-28%',
    avgCoef: '4,5 a 6',
    challenges: [
      'Cafes specialty : grain, torrefaction, recette — chaque parametre impacte le cout',
      'Accompagnements patisserie : food cost eleve (35-40%) qui tire la marge vers le bas',
      'Takeaway vs sur place : TVA differente, tarification a adapter',
      'Machines espresso et broyeurs : amortissement a integrer dans le prix de revient',
      'Saisonnalite des boissons chaudes vs froides : gestion des pertes en ete',
    ],
    stats: [
      { label: 'Food cost boissons', value: '18%', color: 'teal' },
      { label: 'Marge brute cible', value: '74%', color: 'emerald' },
      { label: 'Coefficient espresso', value: '12-15x', color: 'amber' },
      { label: 'Ticket moyen', value: '6-12€', color: 'rose' },
    ],
    testimonial: {
      quote: "J'avais l'impression de vendre beaucoup mais la fin du mois etait serree. RestauMargin m'a montre que mes formules petit-dej avec jus de fruit frais avaient un food cost de 42%. J'ai reajuste les grammages et le prix : +6 points de marge en 3 semaines.",
      author: 'Camille',
      role: 'Fondatrice de coffee shop, Bordeaux',
    },
    faqs: [
      {
        q: 'Quelle est la marge moyenne d\'un cafe ou coffee shop ?',
        a: 'La marge brute d\'un cafe ou coffee shop se situe entre 70% et 78%, ce qui en fait l\'un des segments les plus rentables de la restauration. La boisson chaude (espresso, cappuccino, latte) affiche un food cost de 15 a 20%, la boisson froide 20 a 25%, et la patisserie 30 a 40%. La cle est d\'equilibrer les ventes : plus vous vendez de cafes simples par rapport aux preparations complexes ou aux accompagnements sucres, meilleure est votre marge globale. La marge nette apres charges (loyer, equipement, masse salariale) oscille entre 5% et 12% selon l\'emplacement et le positionnement specialty vs traditionnel.',
      },
      {
        q: 'Comment calculer le food cost d\'un espresso ou d\'un cappuccino ?',
        a: 'Pour un espresso : dose de cafe (7 a 9g selon recette) x prix du kg de grain. Exemple : 8g d\'un grain specialty a 25€/kg = 0,20€ de matiere. Vendu 2,80€, le food cost est de 7%. Pour un cappuccino : dose cafe (0,20€) + 120ml de lait (0,12€) = 0,32€. Vendu 3,80€, food cost de 8,4%. RestauMargin calcule automatiquement ces couts des que vous renseignez vos prix fournisseurs grains et lait, et met a jour toutes vos recettes en temps reel si le prix du grain change.',
      },
      {
        q: 'Comment gerer la TVA takeaway vs consommation sur place ?',
        a: 'En France, la TVA sur les boissons et aliments est de 10% en consommation sur place et de 5,5% a emporter (sauf boissons alcoolisees a 20%). Cela signifie que le prix TTC peut etre le meme mais votre marge HT differe selon le mode de consommation. RestauMargin vous permet de definir deux prix de vente par produit (sur place / emporter) et calcule la marge reelle HT dans les deux cas. Indispensable si votre chiffre d\'affaires takeaway depasse 30% du total.',
      },
      {
        q: 'RestauMargin convient-il aux coffee shops avec carte food ?',
        a: 'Oui, RestauMargin gere aussi bien les boissons (cafes, thes, smoothies, jus) que les solides (brunchs, toasts avocado, bowls, patisseries maison). Vous creez une fiche technique par produit avec grammages precis. Le tableau de bord vous montre cote a cote la marge de chaque reference : vous identifiez immediatement quelles recettes signature tirent la moyenne vers le bas et pouvez ajuster le prix ou les proportions. Le plan Pro a 29€/mois est suffisant pour un coffee shop avec une carte de 30 a 60 references.',
      },
    ],
  },
  'burger-restaurant': {
    slug: 'burger-restaurant',
    title: 'Calcul de marge burger restaurant : guide complet 2026',
    h1: 'Optimisez la marge de votre burger restaurant',
    tagline: 'Logiciel de gestion pour burger restaurants et smash burgers',
    description: 'Guide et outil pour calculer les marges de votre burger restaurant. Food cost steak hache, optimisation assemblage, gestion frites et boissons, rentabilite par formule.',
    heroSubtitle: "Le burger : produit a fort potentiel de marge quand les grammages sont maitrise. Steak hache, bun, sauces, frites — chaque composant compte. RestauMargin vous donne la precision pour atteindre 70% de marge brute.",
    avgMargin: '65-72%',
    avgFoodCost: '28-35%',
    avgCoef: '3 a 3,8',
    challenges: [
      'Prix de la viande hachee : volatile selon le cours du boeuf',
      'Formules burger + frites + boisson : equilibre marge solide vs accompagnement',
      'Livraison Uber Eats / Deliveroo : commission 25-30% qui efface la marge',
      'Grammages non standardises : 100g vs 150g de steak change tout au food cost',
      'Sauces maison vs industrielles : food cost difficile a calculer sans fiche technique',
    ],
    stats: [
      { label: 'Food cost moyen', value: '32%', color: 'teal' },
      { label: 'Marge brute cible', value: '68%', color: 'emerald' },
      { label: 'Coefficient type', value: '3,5x', color: 'amber' },
      { label: 'Ticket moyen', value: '14-20€', color: 'rose' },
    ],
    testimonial: {
      quote: "Mes steaks haches representaient 45% du food cost global. Avec RestauMargin j'ai optimise les grammages par formule et negocie mon fournisseur viande. 9 points de marge gagnes en 6 semaines.",
      author: 'Thomas',
      role: 'Patron de burger restaurant, Toulouse',
    },
    faqs: [
      {
        q: 'Quelle est la marge moyenne d\'un burger restaurant ?',
        a: 'La marge brute d\'un burger restaurant se situe entre 65% et 72%. Le food cost oscille entre 28% et 35%, principalement tire par le steak hache (cout matiere 6-9€/kg selon qualite), le bun (0,25-0,40€), les garnitures (cheddar, bacon, legumes) et les sauces. Les restaurants qui atteignent 70%+ de marge brute sont ceux qui maitrisent leurs grammages au gramme pres et qui vendent des formules equilibrees : le burger seul est moins rentable que la formule burger + frites + boisson, car les frites (food cost ~15%) et la boisson (food cost ~10-12%) compensent le food cost eleve de la viande. La marge nette apres charges (loyer, personnel, energie) oscille entre 5% et 10% selon l\'emplacement et le format (service a table vs comptoir).',
      },
      {
        q: 'Comment calculer le food cost d\'un burger ?',
        a: 'Le calcul se fait ingredient par ingredient : steak hache 150g (1,20-1,80€ selon qualite), bun (0,30€), cheddar 2 tranches (0,25€), salade + tomate + oignon (0,20€), sauce maison (0,10€). Total burger seul : 2,05-2,65€. Vendu 12€, le food cost est de 21%. En formule avec frites 150g (0,50€) et boisson (0,30€), le food cost total de la formule est de ~3,05€ pour un prix de vente de 14-16€, soit 19-22% — nettement meilleur. RestauMargin automatise ce calcul : renseignez une fois vos prix fournisseurs viande, buns et condiments, et toutes les fiches techniques se mettent a jour en temps reel si le prix du boeuf change.',
      },
      {
        q: 'Comment preserver sa marge sur les livraisons Uber Eats et Deliveroo ?',
        a: 'Les plateformes de livraison prennent 25 a 30% de commission sur le prix TTC, ce qui peut effacer toute la marge brute d\'un burger. La solution est triple : (1) appliquer une majoration de 12-15% sur les plateformes par rapport aux prix salle, (2) proposer des formules specifiques livraison avec un steak plus fin (smash burger 80g vs 150g en salle), (3) calculer la marge nette par canal de vente. RestauMargin vous permet de creer des fiches techniques avec deux prix distincts — prix salle et prix livraison — et calcule la marge reelle apres commission pour chaque plat sur chaque canal. Vous identifiez quels produits sont rentables en livraison et lesquels doivent etre exclus de votre menu plateforme.',
      },
      {
        q: 'RestauMargin convient-il aux dark kitchens et smash burger ?',
        a: 'Oui, RestauMargin est particulierement adapte aux dark kitchens et smash burgers. Ces formats ont des caracteristiques specifiques : volume eleve sur un menu court (5-15 references), forte dependance aux plateformes de livraison, besoin de controle precis des grammages pour proteger la marge. La fonctionnalite multi-canal vous permet de definir des marges cibles differentes selon le canal (click & collect, Uber Eats, Deliveroo) et de detecter automatiquement les articles sous le seuil de rentabilite par plateforme. Les dark kitchens qui gerent plusieurs marques depuis une meme cuisine peuvent creer autant de "restaurants virtuels" que necessaire dans un seul compte, avec fiches techniques et marges independantes par marque.',
      },
    ],
  },
};

export default function NicheLanding() {
  const { slug } = useParams<{ slug: string }>();
  const config = slug ? NICHES[slug] : null;

  if (!config) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title={config.title}
        description={config.description}
        path={`/guide-marge/${config.slug}`}
      />

      {/* Article schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: config.h1,
            datePublished: '2026-04-18',
            dateModified: '2026-04-18',
            author: {
              '@type': 'Organization',
              name: 'La rédaction RestauMargin',
              url: 'https://www.restaumargin.fr/a-propos',
            },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            inLanguage: 'fr-FR',
          }),
        }}
      />

      {/* FAQ schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            inLanguage: 'fr-FR',
            mainEntity: config.faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/outils/calculateur-food-cost"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Calculer ma marge
            </Link>
            <Link to="/login" className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 pb-12 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">{config.tagline}</span>
        </div>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-black text-mono-100 mb-6 leading-tight"
         
        >
          {config.h1}
        </h1>
        <p className="text-lg text-mono-400 max-w-2xl leading-relaxed mb-8">
          {config.heroSubtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-full transition-colors"
          >
            Essai gratuit 7 jours
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/pricing"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-mono-900 hover:border-teal-500 text-mono-100 font-semibold rounded-full transition-colors"
          >
            Voir les tarifs
          </Link>
        </div>
      </section>

      {/* Key stats */}
      <section className="py-8 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {config.stats.map((s) => {
            const colors: Record<string, string> = {
              teal: 'bg-teal-50 border-teal-200 text-teal-700',
              emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
              amber: 'bg-amber-50 border-amber-200 text-amber-700',
              rose: 'bg-rose-50 border-rose-200 text-rose-700',
            };
            return (
              <div key={s.label} className={`border rounded-2xl p-5 ${colors[s.color]}`}>
                <div className="text-3xl font-black mb-1">{s.value}</div>
                <div className="text-xs font-semibold uppercase tracking-wider">{s.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Challenges */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-black text-mono-100 mb-8 text-center"
         
        >
          Les enjeux specifiques de votre {config.slug.replace('-', ' ')}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {config.challenges.map((c) => (
            <div key={c} className="flex items-start gap-3 p-5 bg-white border border-mono-900 rounded-xl">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                <span className="text-rose-600 font-bold text-sm">!</span>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">{c}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features solving those challenges */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto bg-[#f8fafb] rounded-3xl">
        <h2
          className="text-3xl sm:text-4xl font-black text-mono-100 mb-4 text-center"
         
        >
          Comment RestauMargin repond a ces enjeux
        </h2>
        <p className="text-center text-mono-400 mb-10 max-w-2xl mx-auto">
          Un outil pense pour les contraintes reelles du terrain, pas un ERP complique.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: Calculator, title: 'Calcul de marge en temps reel', text: 'Dashboard qui montre la marge de chaque plat, filtrable par service ou categorie.' },
            { icon: Scale, title: 'Station de pesee connectee', text: 'Pesez directement vos ingredients, grammages sauvegardes automatiquement dans la fiche technique.' },
            { icon: BarChart3, title: 'Analyses IA automatiques', text: 'Alertes anomalies (food cost trop eleve), suggestions d\'optimisation plat par plat.' },
            { icon: Shield, title: 'HACCP integre', text: 'Traçabilite lots, temperatures, allergenes. Conforme aux controles sanitaires.' },
            { icon: TrendingUp, title: 'Menu Engineering', text: 'Classification Boston Matrix : plats vedettes, puzzles, plow-horses, dogs. Optimisez la carte.' },
            { icon: Euro, title: 'Tarifs accessibles', text: 'Pro 29€/mois, Business 79€/mois. Sans engagement. Essai gratuit 7 jours.' },
          ].map((f) => (
            <div key={f.title} className="bg-white border border-mono-900 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center mb-3">
                <f.icon className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="font-bold text-mono-100 mb-2">{f.title}</h3>
              <p className="text-sm text-mono-400 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-4 sm:px-6 max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-mono-100 to-[#1f2937] rounded-3xl p-8 sm:p-12 text-white text-center">
          <Quote className="w-8 h-8 text-teal-400 mx-auto mb-4" />
          <blockquote className="text-xl sm:text-2xl font-medium mb-6 leading-relaxed italic">
            « {config.testimonial.quote} »
          </blockquote>
          <div className="inline-flex items-center gap-3">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div>
              <div className="font-bold">{config.testimonial.author}</div>
              <div className="text-sm text-white/70">{config.testimonial.role}</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 max-w-3xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-black text-mono-100 mb-8 text-center"
         
        >
          Questions frequentes
        </h2>
        <div className="space-y-3">
          {config.faqs.map((f) => (
            <details key={f.q} className="group border border-mono-900 rounded-xl p-4 hover:border-teal-500 transition-colors">
              <summary className="cursor-pointer font-semibold text-mono-100 flex items-center justify-between">
                {f.q}
                <span className="ml-2 text-mono-500 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-3 text-sm text-mono-400 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="bg-teal-50 border border-teal-200 rounded-3xl p-8 sm:p-12 text-center">
          <Clock className="w-8 h-8 text-teal-600 mx-auto mb-3" />
          <h2
            className="text-2xl sm:text-3xl font-bold text-mono-100 mb-3"
           
          >
            Ne perdez plus de marge sur votre {config.slug.replace('-', ' ')}
          </h2>
          <p className="text-mono-400 mb-6 max-w-xl mx-auto">
            Essayez RestauMargin gratuitement pendant 7 jours. Sans carte bancaire. Sans engagement.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-full transition-colors"
          >
            Commencer gratuitement
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Cross-links to other niches */}
      <section className="py-8 px-4 sm:px-6 max-w-4xl mx-auto border-t border-mono-900">
        <p className="text-sm text-mono-500 mb-3 text-center">Autres guides par type de restaurant :</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.values(NICHES).filter((n) => n.slug !== config.slug).map((n) => (
            <Link
              key={n.slug}
              to={`/guide-marge/${n.slug}`}
              className="px-3 py-1.5 bg-mono-975 hover:bg-teal-50 hover:text-teal-700 text-mono-400 text-sm rounded-full transition-colors capitalize"
            >
              {n.slug.replace('-', ' ')}
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-mono-900 py-8 mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-mono-500">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-teal-600" />
            <span>© 2026 RestauMargin — Tous droits reserves</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/a-propos" className="hover:text-teal-600 transition-colors">A propos</Link>
            <Link to="/blog" className="hover:text-teal-600 transition-colors">Blog</Link>
            <Link to="/pricing" className="hover:text-teal-600 transition-colors">Tarifs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
