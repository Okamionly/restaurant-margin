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
     /guide-marge/cafe-coffee-shop
     /guide-marge/sushi-restaurant
     /guide-marge/burger-restaurant
     /guide-marge/kebab-fast-food
     /guide-marge/boulangerie-patisserie
     /guide-marge/creperie
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
  'sushi-restaurant': {
    slug: 'sushi-restaurant',
    title: 'Calcul de marge restaurant sushi : guide complet 2026',
    h1: 'Optimisez la marge de votre restaurant sushi',
    tagline: 'Logiciel de gestion specialise pour restaurants sushi et japonais',
    description: 'Guide et outil pour calculer les marges de votre restaurant sushi. Food cost poisson cru, riz a sushi, formules plateau, gestion FIFO fraicheur et optimisation carte japonaise.',
    heroSubtitle: "Saumon, thon, crevettes : des matieres premieres nobles dont le prix fluctue chaque semaine au marche de Rungis. Chaque gramme de poisson compte. RestauMargin vous donne la precision pour proteger votre marge plateau apres plateau.",
    avgMargin: '62-70%',
    avgFoodCost: '30-38%',
    avgCoef: '3 a 3,5',
    challenges: [
      'Prix du saumon et du thon : volatils selon cours Rungis et importations Norvege/Atlantique',
      'Fraicheur absolue obligatoire : pertes importantes si mauvaise prevision de couverts',
      'Formules plateau tout-inclus : impossible de calculer la marge par convive sans fiche technique',
      'Riz a sushi : dosage precis (15-18g par piece) et cuisson standardisee indispensables',
      'Livraison : emballage sushi rigide + suremballer augmentent le cout matiere de 8 a 12%',
    ],
    stats: [
      { label: 'Food cost moyen', value: '34%', color: 'teal' },
      { label: 'Marge brute cible', value: '66%', color: 'emerald' },
      { label: 'Coefficient type', value: '3,2x', color: 'amber' },
      { label: 'Ticket moyen', value: '18-35€', color: 'rose' },
    ],
    testimonial: {
      quote: "Le prix du saumon m'a grignote ma marge pendant 3 mois sans que je m'en rende compte. RestauMargin m'a montre que ma California roll principale avait un food cost de 47%. J'ai recalibre le grammage saumon de 25g a 20g et ajuste le prix de vente : 11 points de marge recuperes en 6 semaines.",
      author: 'Minh',
      role: 'Patron de restaurant sushi, Nantes',
    },
    faqs: [
      {
        q: 'Quelle est la marge moyenne d\'un restaurant sushi ?',
        a: 'La marge brute d\'un restaurant sushi se situe entre 62% et 70%, ce qui est inferieur a la moyenne de la restauration (68-75%) en raison du cout eleve des matieres premieres : le saumon Atlantique oscille entre 12 et 18€/kg selon les periodes, le thon rouge 25-45€/kg, les crevettes 9-14€/kg. Les restaurants sushi qui atteignent 68-70% de marge brute sont ceux qui maitrisent leurs grammages au gramme pres (18g de riz par piece, 15-20g de poisson selon la reference), negocient leurs volumes avec un grossiste en produits de la mer, et proposent une carte equilibree melant references nobles (saumon, thon) et references plus abordables (surimi, avocat, concombre). La marge nette apres charges tourne entre 4% et 9% selon la densite de couverts et le format (self-service conveyor belt vs service a table).',
      },
      {
        q: 'Comment calculer le food cost d\'un maki, d\'un nigiri ou d\'un plateau ?',
        a: 'Pour un maki california (8 pieces) : riz 130g (0,18€) + nori 1/2 feuille (0,08€) + surimi 40g (0,20€) + avocat 30g (0,12€) + concombre 20g (0,04€) + mayonnaise 10g (0,03€) = 0,65€ de cout matiere. Vendu 6,50€, le food cost est de 10% — excellent. Pour un nigiri saumon : riz 18g (0,025€) + saumon frais 20g (0,30€ au prix de 15€/kg) = 0,325€. Vendu 2,80€, food cost de 11,6%. Pour un plateau 30 pieces mix saumon/thon/crevettes, le cout matiere peut atteindre 8-10€ pour un prix de vente de 25-30€, soit un food cost de 30-40% selon la composition. RestauMargin automatise ce calcul : renseignez une fois vos prix fournisseurs poissons et le systeme recalcule instantanement le food cost de toutes vos pieces et plateaux quand le prix du saumon change.',
      },
      {
        q: 'Comment gerer les pertes liees a la fraicheur du poisson cru ?',
        a: 'La gestion de la fraicheur est le nerf de la guerre en sushis. Le poisson cru ne se conserve que 24-48h apres reception. Les bonnes pratiques : (1) commander chaque matin en fonction des reservations du jour et des previsions historiques (evitez le stock tampon), (2) tracker chaque lot par date de reception avec methode FIFO stricte, (3) valoriser les restes du soir en tartares ou bowls au menu du lendemain midi avant peremption. RestauMargin integre un module de gestion des pertes : vous saisissez les quantites non utilisees en fin de service, le logiciel calcule automatiquement le cout reel des pertes et l\'impact sur votre food cost journalier. Apres 30 jours, l\'IA identifie les references avec le taux de perte le plus eleve et recommande d\'ajuster les quantites commandees ou de repenser la composition des plateaux pour limiter le gaspillage poisson.',
      },
      {
        q: 'RestauMargin convient-il aux restaurants avec formules tout-inclus ou conveyor belt ?',
        a: 'Oui, RestauMargin est adapte aux formats sushi all-you-can-eat (AYCE) et aux restaurants conveyor belt (kaiten sushi). Pour les formules tout-inclus, vous creez une "fiche technique composite" avec la composition moyenne consommee par convive (estimee sur 30 jours de service), ce qui vous donne le cout reel par tete et la marge par couvert. Pour les kaiten, chaque assiette tourne avec un code couleur de prix : RestauMargin vous permet de creer une fiche technique par couleur d\'assiette et de suivre les ventes par reference en temps reel via votre caisse. Le dashboard multi-format montre le food cost global, la marge par categorie (nigiri/maki/temaki/sashimi), et les references qui sous-performent. Les restaurants AYCE a forte rotation peuvent ainsi ajuster la composition de leurs plateaux formule sans impacter l\'experience client tout en recuperant 4 a 8 points de marge brute.',
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
  'kebab-fast-food': {
    slug: 'kebab-fast-food',
    title: 'Calcul de marge kebab et fast-food : guide complet 2026',
    h1: 'Optimisez la marge de votre kebab et fast-food',
    tagline: 'Logiciel de gestion specialise pour kebabs, sandwicheries et fast-foods',
    description: 'Guide et outil pour calculer les marges de votre kebab ou fast-food. Food cost viande grille, pain, sauces et garnitures. Gestion formules midi, livraison et optimisation marge par commande.',
    heroSubtitle: "Le kebab : produit emblematique du fast-food francais avec un potentiel de marge eleve quand les grammages sont maitrise. Viande de broche, pain, sauces, crudites — chaque composant compte. RestauMargin vous donne la precision pour atteindre 68% de marge brute.",
    avgMargin: '62-70%',
    avgFoodCost: '30-38%',
    avgCoef: '3 a 3,5',
    challenges: [
      'Prix de la viande de veau/agneau : volatil selon cours et saison',
      'Grammages non standardises : 120g vs 180g de viande change tout au food cost',
      'Plateformes de livraison : commission 25-30% qui efface la marge sur les commandes en ligne',
      'Sauces maison vs industrielles : food cost difficile a maitriser sans fiche technique',
      'Volume eleve et service rapide : pas le temps pour des calculs manuels entre les commandes',
    ],
    stats: [
      { label: 'Food cost moyen', value: '34%', color: 'teal' },
      { label: 'Marge brute cible', value: '66%', color: 'emerald' },
      { label: 'Coefficient type', value: '3,2x', color: 'amber' },
      { label: 'Ticket moyen', value: '9-15€', color: 'rose' },
    ],
    testimonial: {
      quote: "Je ne savais pas que mes grandes assiettes perdaient de l'argent. RestauMargin m'a montre que le kebab XXL avec frites avait un food cost de 48% a cause du grammage viande non controle. J'ai standardise a 160g et ajuste le prix : 12 points de marge recuperes en 1 mois.",
      author: 'Rachid',
      role: 'Patron de kebab, Marseille',
    },
    faqs: [
      {
        q: 'Quelle est la marge moyenne d\'un kebab ou fast-food ?',
        a: 'La marge brute d\'un kebab se situe entre 62% et 70%, avec un food cost de 30% a 38%. La viande de broche (veau, agneau ou melange) est le poste de cout principal : elle represente 50 a 60% du food cost total d\'un kebab standard. Les kebabs les mieux geres atteignent 68-70% de marge brute grace a trois leviers : (1) standardisation des grammages de viande au gramme pres (120 a 180g selon la taille), (2) fabrication maison des sauces signature (sauce blanche, harissa) avec un food cost de 8-12% vs 15-20% pour les sauces industrielles de qualite equivalente, (3) equilibre de la carte entre kebabs classiques et formules avec boisson et frites qui diluent le food cost eleve de la viande. La marge nette apres charges (loyer, personnel, energie) se situe entre 6% et 14%, ce qui est superieur a la moyenne de la restauration grace aux charges de personnel reduites et au volume de commandes eleve.',
      },
      {
        q: 'Comment calculer le food cost d\'un kebab ?',
        a: 'Le calcul se fait composant par composant. Pour un kebab standard (taille M) : viande de broche 140g (1,40€ a 10€/kg), pain pita ou baguette (0,25€), salade 40g (0,08€), tomates 60g (0,12€), oignons 30g (0,04€), sauce blanche 30ml (0,06€), harissa 10g (0,03€). Total cout matiere : 1,98€. Vendu 7,50€, le food cost est de 26,4% — excellent. En formule avec frites 150g (0,40€) et boisson 33cl (0,25€), le cout total est de 2,63€ pour un prix de vente de 10,50€, soit 25% de food cost. Le food cost monte a 38-42% quand le grammage viande n\'est pas controle (200g au lieu de 140g) ou quand la boisson est une canette vendue a prix coutant. RestauMargin automatise ce calcul : renseignez une fois vos prix fournisseurs viande, pain et condiments, et toutes vos fiches techniques se mettent a jour en temps reel quand le cours de la viande change.',
      },
      {
        q: 'Comment preserver sa marge sur les commandes Uber Eats et Deliveroo ?',
        a: 'Les plateformes de livraison prennent 25 a 30% de commission sur le prix TTC, ce qui peut transformer un kebab rentable en article a perte. La strategie en 4 points : (1) appliquer une majoration de 15-20% sur les plateformes par rapport aux prix comptoir — les clients livraison acceptent ce surprice car ils valorisent la commodite, (2) creer un menu livraison simplifie avec les references les plus rentables (kebab M, kebab L, formules) et supprimer les assiettes XXL et les extras qui alourdissent le food cost, (3) calculer la marge nette par canal (comptoir, click & collect, Uber Eats, Deliveroo) pour identifier lesquels sont reellement profitables, (4) pousser le click & collect en direct via QR code en vitrine — zero commission, fidelite client. RestauMargin vous permet de definir deux grilles tarifaires (comptoir / livraison) par produit et affiche la marge reelle apres commission de plateforme pour chaque reference, en temps reel.',
      },
      {
        q: 'RestauMargin convient-il aux kebabs avec forte rotation et service rapide ?',
        a: 'Oui, RestauMargin est concu pour les environnements a forte cadence. La saisie d\'une fiche technique kebab prend moins de 2 minutes : vous definissez une fois les composants et les grammages standards, et le logiciel calcule automatiquement le food cost de chaque variante (S, M, L, XXL) et de chaque formule. En service, vous n\'avez rien a faire : RestauMargin travaille en arriere-plan. Le tableau de bord quotidien vous montre le food cost de la journee, l\'alerte si le cout matiere depasse votre seuil cible, et la marge par produit. Les patrons de kebabs qui gerent aussi la livraison beneficient du module multi-canal qui compare automatiquement la rentabilite comptoir vs plateformes. Le plan Basic gratuit (50 ingredients, 10 recettes) suffit pour un kebab avec une carte de 15 a 20 references ; le plan Pro a 29€/mois est recommande si vous avez une carte complete avec formules, assiettes et options personnalisation.',
      },
    ],
  },
  'boulangerie-patisserie': {
    slug: 'boulangerie-patisserie',
    title: 'Calcul de marge boulangerie-patisserie : guide complet 2026',
    h1: 'Optimisez la marge de votre boulangerie-patisserie',
    tagline: 'Logiciel de gestion specialise pour boulangeries, patisseries et viennoiseries',
    description: "Guide et outil pour calculer les marges de votre boulangerie-patisserie. Food cost farine, beurre, oeufs, gestion des fournees, prix de revient par piece et optimisation carte viennoiseries et gateaux.",
    heroSubtitle: "Un croissant beurre a 0,28€ de matiere vendu 1,40€ : 80% de marge brute theorie. Mais sans fiche technique au gramme pres et sans suivi du cout des matieres grasses, la realite est souvent bien differente. RestauMargin vous donne la maitrise totale de votre marge par piece.",
    avgMargin: '55-68%',
    avgFoodCost: '32-45%',
    avgCoef: '2,5 a 3,5',
    challenges: [
      "Prix du beurre et des oeufs : tres volatils, +40% sur 18 mois — impact direct sur la marge viennoiseries",
      "Cuissons multiples par jour : gestion des invendus en fin de journee qui alourdissent le food cost reel",
      "Pieces vendues a l'unite : food cost difficile a calculer sans peser chaque composant par fournee",
      "Gamme large : 40 a 80 references differentes (pains, viennoiseries, sandwichs, patisseries) avec des marges tres differentes",
      "Main-d'oeuvre elevee : les charges de personnel (30-40% du CA) mangent la marge nette meme avec un bon food cost",
    ],
    stats: [
      { label: 'Food cost moyen', value: '38%', color: 'teal' },
      { label: 'Marge brute cible', value: '62%', color: 'emerald' },
      { label: 'Coefficient type', value: '3x', color: 'amber' },
      { label: 'Ticket moyen', value: '5-14€', color: 'rose' },
    ],
    testimonial: {
      quote: "Je produisais 120 croissants par jour sans savoir exactement ce qu'ils me coutaient. RestauMargin m'a permis de faire la fiche technique complete — beurre de tourage, farine T45, oeufs, sel, sucre — et j'ai decouvert que mon food cost croissant etait a 44% a cause du beurre qui avait augmente. J'ai recalibre le grammage et reajuste le prix de vente. Resultat : 9 points de marge retrouves en 3 semaines.",
      author: 'Jerome',
      role: 'Artisan boulanger-patissier, Rennes',
    },
    faqs: [
      {
        q: "Quelle est la marge moyenne d'une boulangerie-patisserie ?",
        a: "La marge brute d'une boulangerie-patisserie se situe entre 55% et 68%, ce qui est inferieur a la moyenne de la restauration (68-75%), principalement en raison d'un food cost eleve (32-45%) tire par le beurre, les oeufs, la farine et les garnitures patisserie. Les boulangeries qui atteignent 65-68% de marge brute sont celles qui maitrisent trois leviers : (1) les fiches techniques precises par piece avec grammages au gramme pres, (2) la tracabilite des fournees pour calculer le cout reel selon le taux de perte et les invendus, (3) l'equilibre de la gamme entre les produits phares a forte marge (macarons, entremets, croissants au beurre) et les pains de base a marge plus etroite. La marge nette apres charges (loyer, personnel, energie — fours boulangers tres energy-intensifs) oscille entre 3% et 8% selon le format et l'emplacement. Les boulangeries en centre-ville avec fort passage pedestre atteignent 6-8% grace au volume ; les boulangeries de quartier ou rurales maintiennent 3-5% avec des charges fixes plus legeres.",
      },
      {
        q: "Comment calculer le food cost d'un croissant, d'une baguette ou d'une patisserie ?",
        a: "Le calcul se fait par fournee, puis ramene a la piece. Pour 20 croissants au beurre : farine T45 500g (0,65€), beurre de tourage 250g (2,50€ a 10€/kg), lait 150ml (0,12€), oeufs 2 (0,36€), sucre 40g (0,05€), sel 8g (0,01€), levure 10g (0,05€) = cout fournee de 3,74€. Divise par 20 pieces : 0,187€ par croissant. Vendu 1,40€, le food cost est de 13,4% — excellent en theorie. Mais en reel, il faut integrer le taux de perte a la cuisson (5-8%), les invendus en fin de journee (10-15% si mauvaise prevision) et l'energie four (amortissement + electrique). Une fois ces couts integres, le food cost reel d'un croissant monte a 20-25%. Pour une tarte aux fraises (250g de fruits a 4€/kg, 80g de creme patissiere, 100g de pate sablee) : food cost de 1,20-1,50€ pour un prix de vente de 4,50€, soit 27-33%. RestauMargin automatise ce calcul par fournee : vous saisissez les ingredientsune fois, definissez le nombre de pieces par fournee, et le logiciel calcule le food cost unitaire et met a jour automatiquement toutes vos fiches si le prix du beurre ou de la farine change chez votre fournisseur.",
      },
      {
        q: "Comment gerer les invendus et pertes en fin de journee ?",
        a: "Les invendus sont le principal poste de perte occulte en boulangerie. Un croissant non vendu en fin de journee n'est pas \"perdu\" dans les stocks, mais son cout est bien reel et alourdit le food cost de tous les croissants vendus. La bonne methode en 4 etapes : (1) tracker systematiquement les invendus par reference chaque soir (quantite non vendue vs quantite produite) — RestauMargin integre un module de saisie des pertes journalieres en 30 secondes, (2) calculer le taux de perte hebdomadaire par reference et ajuster les quantites produites par fournee, (3) valoriser les invendus de la veille : pain de la veille pour les croutons et sandwichs du midi, viennoiseries en pain perdu ou dans les preparations patisserie, (4) proposer un panier fin de journee a prix reduit (50-60% de remise) pour eviter le gaspillage total. L'IA RestauMargin analyse vos donnees de ventes sur 30 jours et predit les quantites optimales a produire par jour de la semaine et par saison, reduisant les invendus de 25 a 40% en moyenne sans impact sur la disponibilite produit en debut de journee.",
      },
      {
        q: "RestauMargin convient-il aux boulangeries-patisseries avec espace snacking et salon de the ?",
        a: "Oui, RestauMargin est particulierement adapte aux boulangeries-patisseries qui ont developpe une activite snacking (sandwichs, quiches, formules midi) ou salon de the. Ces formats hybrides ont des contraintes specifiques : gerer simultanément des matieres premieres brutes (farine, beurre, oeufs pour la production) et des produits semitransformes (jambon, fromages, legumes pour le snacking), avec des marges tres differentes selon le segment. Le dashboard multi-categorie vous montre cote a cote la marge de vos pains et viennoiseries (production artisanale), vos patisseries (haute valeur ajoutee), vos sandwichs et formules (marge elevee, food cost 30-35%), et vos boissons en salon (marge >70%). Vous identifiez immediatement les categories qui tirent le resultat vers le bas. Le plan Pro a 29€/mois couvre une boulangerie avec jusqu'a 150 references et 3 utilisateurs — suffisant pour une boulangerie-patisserie standard avec un patron et deux vendeurs. Les boulangeries multi-sites ou franchises beneficient du plan Business avec dashboard consolide et gestion des transferts inter-boutiques.",
      },
    ],
  },
  'bar-pub': {
    slug: 'bar-pub',
    title: 'Calcul de marge bar et pub : guide complet 2026',
    h1: 'Optimisez la marge de votre bar ou pub',
    tagline: 'Logiciel de gestion specialise pour bars, pubs et etablissements de nuit',
    description: "Guide et outil pour calculer les marges de votre bar ou pub. Food cost boissons alcoolisees, marge cocktails, gestion snacking, happy hour et optimisation de la carte des boissons.",
    heroSubtitle: "Un cocktail a 1,80€ de matiere vendu 10€ : une marge brute de 82%. Mais sans fiche technique sur chaque recette, le gaspillage au comptoir et les doses non controlees rongent votre rentabilite chaque soir. RestauMargin vous donne la maitrise totale de votre marge verre par verre.",
    avgMargin: '72-82%',
    avgFoodCost: '18-28%',
    avgCoef: '5 a 7',
    challenges: [
      "Gaspillage au comptoir : surdosage des spiritueux sans jigger — 10 a 20cl de plus par soir representent 50-100€ de perte hebdomadaire",
      "Happy hour : reduction de 30-50% sur les boissons — difficile de calculer la marge reelle sans simulation par tranche horaire",
      "Carte cocktails saisonniere : ingredients frais (fruits, herbes) avec des prix tres volatils qui impactent le food cost des signatures",
      "Snacking et planches : food cost eleve (35-45%) sur la nourriture qui tire la marge globale du bar vers le bas",
      "TVA boissons alcoolisees a 20% : calcul marge HT vs TTC source d'erreurs frequentes sur la tarification",
    ],
    stats: [
      { label: 'Food cost boissons', value: '22%', color: 'teal' },
      { label: 'Marge brute cible', value: '78%', color: 'emerald' },
      { label: 'Coefficient cocktail', value: '6x', color: 'amber' },
      { label: 'Ticket moyen soir', value: '20-35€', color: 'rose' },
    ],
    testimonial: {
      quote: "Je savais que mes cocktails etaient rentables, mais je ne savais pas a quel point le gaspillage me coutait. RestauMargin m'a montre que mes bartenders surdosaient en moyenne de 15%. En standardisant les doses avec jigger et en creant les fiches techniques de chaque cocktail, j'ai recupere 11 points de marge en 5 semaines.",
      author: 'Sebastien',
      role: 'Patron de bar cocktails, Bordeaux',
    },
    faqs: [
      {
        q: "Quelle est la marge moyenne d'un bar ou pub ?",
        a: "La marge brute d'un bar ou pub se situe entre 72% et 82%, ce qui en fait l'un des segments les plus rentables de la restauration. Les boissons sont le moteur : un spiritueux (whisky, gin, rhum) affiche un food cost de 18-22% selon le positionnement, une biere pression 15-20%, un cocktail signature 18-25% si les doses sont controlees. La marge brute descend a 72-75% dans les etablissements qui proposent une carte snacking significative (planches, burgers, tapas), car le food cost alimentaire (35-45%) tire la moyenne vers le bas. Les pubs avec forte consommation de bieres pression atteignent 78-80% grace a un food cost biere parmi les plus faibles de la restauration. La marge nette apres charges — loyer (souvent eleve en centre-ville), personnel de soir (majoration nuit +25%), licences IV et musique SACEM/SPRE — oscille entre 8% et 16% selon la frequentation et le format. Les bars cocktails en centre-ville avec programmation soirees atteignent 12-16% ; les pubs de quartier 8-11%.",
      },
      {
        q: "Comment calculer le food cost d'un cocktail, d'une biere et d'un spiritueux ?",
        a: "Pour un cocktail Mojito : rhum blanc 4cl (0,52€ a 13€/litre), sucre de canne 2cl (0,06€), citron vert 1/2 (0,20€), menthe 4-5 feuilles (0,08€), eau gazeuse 10cl (0,04€), glagons (0,05€) = 0,95€ de cout matiere. Vendu 9€, le food cost est de 10,6% — excellent. Pour un whisky sec : 4cl de whisky standard (0,60€ a 15€/litre) vendu 6€, food cost de 10%. Pour une biere pression 25cl : cout matiere 0,35€ (fût 30L a 42€) vendue 3,50€, food cost de 10%. Les boissons sans alcool et soft drinks ont un food cost de 12-18%. Le danger pour la marge cocktails : le surdosage sans jigger (4cl deviennent 5,5cl) ou les ingredients frais dont le prix varie (jus de passion frais vs sirop). RestauMargin automatise ce calcul : renseignez vos prix fournisseurs spiritueux une fois, et le food cost de tous vos cocktails se met a jour en temps reel quand le prix d'un spiritueux change chez votre grossiste.",
      },
      {
        q: "Comment optimiser la marge pendant le happy hour sans sacrifier la rentabilite ?",
        a: "Le happy hour est un formidable outil de remplissage aux heures creuses, mais mal structure il peut transformer une promotion commerciale en gouffre financier. La methode en 4 etapes : (1) calculer la marge reelle de chaque produit en happy hour AVANT de lancer la promotion — une biere a -1€ reste rentable (food cost 20%), un cocktail signature a -30% peut passer sous le seuil de rentabilite si les ingredients sont chers, (2) construire le happy hour sur les produits a fort coefficient naturel : bieres pression, softs, cocktails simples (gin tonic, vodka orange) plutot que sur les cocktails a ingredients frais et multiples, (3) fixer une plage horaire stricte (17h-19h30 en semaine) et la respecter — le happy hour permanent est un suicide commercial, (4) mesurer l'impact en volume : +30% de couverts compensent largement la reduction de marge par verre. RestauMargin vous permet de creer des grilles tarifaires happy hour distinctes par produit et calcule la marge reelle par scenario (avec et sans promotion) pour chaque tranche horaire.",
      },
      {
        q: "RestauMargin convient-il aux bars avec carte snacking, cocktails signatures et evenements prives ?",
        a: "Oui, RestauMargin est particulierement adapte aux bars hybrides qui mixent boissons, snacking et evenementiel. Ces etablissements ont trois centres de marge a gerer en parallele : les boissons (cocktails, bieres, vins au verre — food cost 15-25%), le snacking (planches, tapas, burgers — food cost 35-45%), et les evenements prives (open bar, formule cocktail dinatoire — tarification au forfait par tete). Le dashboard multi-categorie vous montre la marge par segment et identifie quelles planches ou quels cocktails tirent le resultat vers le bas. Pour les soirees privees en open bar, la fonctionnalite de simulation vous permet de calculer le cout matiere reel par convive sur un menu de boissons donne et de fixer le prix du forfait avec une marge garantie. Les bars qui organisent des evenements reguliers (concerts, quiz, soirees a theme) peuvent creer des fiches techniques par type d'evenement et suivre la rentabilite par date. Le plan Pro a 29€/mois est suffisant pour un bar avec 60 a 80 references boissons et une carte snacking ; le plan Business est recommande pour les bars multi-sites ou les groupes avec plusieurs licences.",
      },
    ],
  },
  'creperie': {
    slug: 'creperie',
    title: 'Calcul de marge creperie : guide complet 2026',
    h1: 'Optimisez la marge de votre creperie',
    tagline: 'Logiciel de gestion specialise pour creperies et comptoirs galettes-crepes',
    description: "Guide et outil pour calculer les marges de votre creperie. Food cost sarrasin, beurre breton AOP, gestion garnitures, cidre et optimisation prix par galette et crepe.",
    heroSubtitle: "Une galette complete au beurre breton a 0,90€ de matiere vendue 12€ : theoriquement 92% de marge. Mais sans fiche technique precise, le beurre AOP, les garnitures et la pate perdue diluent tout. RestauMargin vous donne la maitrise totale de votre marge galette par galette.",
    avgMargin: '68-76%',
    avgFoodCost: '24-32%',
    avgCoef: '4 a 4,5',
    challenges: [
      "Prix du beurre breton AOP : 2 a 3 fois plus cher que le beurre standard, et tres volatil (jusqu'a +35% sur 18 mois)",
      "Galettes sarrasin vs crepes froment : food cost et marges tres differents — la carte melanges les deux sans distinction",
      "Garnitures premium (comte vieux, jambon artisanal, oeuf fermier) : grammages non controles = food cost qui explose",
      "Pate perdue : premières galettes de cuisson non vendables, taux de perte difficile a quantifier sans suivi",
      "Cidre : stock important, TVA alcool a 20%, marges boissons alcoolisees distinctes des crepes",
    ],
    stats: [
      { label: 'Food cost moyen', value: '28%', color: 'teal' },
      { label: 'Marge brute cible', value: '72%', color: 'emerald' },
      { label: 'Coefficient type', value: '4,2x', color: 'amber' },
      { label: 'Ticket moyen', value: '14-22€', color: 'rose' },
    ],
    testimonial: {
      quote: "Je pensais que mes galettes completes etaient tres rentables. RestauMargin m'a montre que le comte vieux AOP et le jambon artisanal pesaient 46% de food cost sur cette reference. En ajustant les grammages et en reequilibrant la carte avec des crepes dessert a forte marge, j'ai retrouve 11 points en 6 semaines.",
      author: 'Nolwenn',
      role: 'Crepiere, Quimper',
    },
    faqs: [
      {
        q: "Quelle est la marge moyenne d'une creperie ?",
        a: "La marge brute d'une creperie se situe entre 68% et 76%, ce qui en fait l'un des meilleurs segments de la restauration rapide. Le food cost moyen oscille entre 24% et 32% selon la gamme : une galette sarrasin simple (beurre, jambon, oeuf) affiche un food cost de 20-25%, tandis qu'une galette garnie de produits nobles (homard breton, st-jacques, foie gras de canard) peut atteindre 38-42%. Les creperies qui atteignent 74-76% de marge brute maitrisent trois leviers : (1) fiches techniques precises par galette et crepe avec grammages au gramme pres, (2) equilibre de la carte entre references simples a forte marge et references premium qui valorisent l'image mais doivent etre tarifees en consequence, (3) gestion du taux de perte sur la pate (premières pieces non vendables en debut de service, restes en fin). La marge nette apres charges (loyer, personnel, energie des biligs) tourne entre 6% et 12% selon l'emplacement et le format — les creperies en zone touristique ou en bretagne avec forte affluence saisonniere atteignent 10-12% en haute saison.",
      },
      {
        q: "Comment calculer le food cost d'une galette ou d'une crepe ?",
        a: "Le calcul se fait composant par composant. Pour une galette complete (jambon-oeuf-fromage) : pate sarrasin 120g (0,22€ au cout de 1,80€/kg), beurre de cuisson 10g (0,15€), jambon artisanal 40g (0,56€ a 14€/kg), oeuf fermier (0,35€), emmental rape 30g (0,24€) = 1,52€ de cout matiere. Vendue 11,50€, le food cost est de 13,2% — excellent. En version garniture premium avec comte vieux 18 mois et jambon de la Ferme : pate 120g (0,22€) + beurre 10g (0,15€) + comte vieux 40g (0,72€ a 18€/kg) + jambon artisanal 60g (0,90€) + oeuf fermier (0,35€) = 2,34€. Vendue 14,50€, le food cost monte a 16,1%. Pour une crepe dessert (beurre-sucre-citron) : pate froment 80g (0,10€) + beurre breton AOP 15g (0,20€) + sucre 10g (0,02€) = 0,32€ vendue 5,50€, food cost de 5,8% — le meilleur ratio de la carte. RestauMargin automatise ce calcul : renseignez une fois vos prix fournisseurs sarrasin, beurre et garnitures, et toutes vos fiches techniques se mettent a jour en temps reel quand le cours du beurre change.",
      },
      {
        q: "Comment maitriser le food cost du beurre breton AOP en creperie ?",
        a: "Le beurre breton AOP est l'ingredient identitaire d'une creperie de qualite, mais c'est aussi le plus volatile des couts matieres : son prix peut varier de 8€ a 14€/kg en fonction de la production laitiere bretonne et de la demande internationale. Quatre strategies pour maitriser son impact : (1) standardiser les grammages de beurre de cuisson (8 a 10g par galette sur le bilig, pas au bol) et de beurre de service (portion individuelle 10g predecoupee) — RestauMargin alerte quand le food cost beurre depasse votre seuil cible, (2) negocier un contrat volume avec votre cremier ou groupement d'achat breton pour fixer le prix sur 3 a 6 mois, (3) utiliser le beurre de tourage (moins cher) pour l'incorporation dans la pate et reserver le beurre AOP au service, (4) recalculer immediatement vos prix de vente si le cours du beurre depasse un seuil critique — RestauMargin simule l'impact d'une hausse de 15% sur votre marge et suggere le nouveau prix de vente optimal pour maintenir votre objectif de food cost.",
      },
      {
        q: "RestauMargin convient-il aux creperies avec formules, services du soir et carte cidre ?",
        a: "Oui, RestauMargin est particulierement adapte aux creperies qui proposent des formules (galette + crepe + boisson a prix fixe), car ces formats melangent des produits aux marges tres differentes : la galette garnie (food cost 20-30%), la crepe dessert (food cost 6-10%) et la boisson (cidre artisanal a 22% de food cost, jus de pomme a 30%, cidre grande surface a 12%). Le dashboard multi-categorie vous montre la marge de chaque reference separement et la marge reelle de la formule une fois composee — indispensable pour tarifer vos formules sans sacrifier la rentabilite. Pour les services du soir avec carte plus elaboree (plateaux fruits de mer, galettes gastronomiques), RestauMargin gere les recettes multi-composants et calcule la marge plat par plat. Les creperies qui gèrent aussi un espace epicerie (produits bretons, confits, biscuits) beneficient du module stock separant produits de fabrication et produits de revente avec des logiques de marge differentes. Le plan Pro a 29€/mois couvre une creperie avec jusqu'a 80 references et 2 utilisateurs.",
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
