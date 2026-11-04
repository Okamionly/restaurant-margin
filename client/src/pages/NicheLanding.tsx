import { Link, useParams, Navigate } from 'react-router-dom';
import {
  ChefHat, Calculator, ArrowRight, CheckCircle2, Clock, Sparkles,
  TrendingUp, Scale, BarChart3, Star, Quote, Shield, Euro,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

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
     /guide-marge/restaurant-traiteur
     /guide-marge/dark-kitchen
     /guide-marge/restaurant-vegan
     /guide-marge/restaurant-halal
     /guide-marge/bistro-gastronomique
     /guide-marge/restaurant-seminaire-groupe
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
  // FIX 2026-09-25 : les 18 niches portaient chacune un temoignage INVENTE (« Marco,
  // Pizzaiolo, Montpellier : j'ai recupere 8 % de marge en 2 mois »), affiche avec
  // cinq etoiles. Ils avaient echappe a la garde anti-preuve-sociale : un prenom,
  // une ville et un gain ne ressemblent a aucun chiffre d'adoption, et les etoiles
  // etaient DESSINEES par une boucle, jamais ecrites « 5/5 ». Tous retires.
  // Champ optionnel : a ne remplir qu'avec un temoignage reel et autorise.
  testimonial?: { quote: string; author: string; role: string };
  faqs: Array<{ q: string; a: string }>;
}

const NICHES: Record<string, NicheConfig> = {
  'pizzeria': {
    slug: 'pizzeria',
    title: 'Calcul de marge pizzeria : guide complet 2026',
    h1: 'Optimisez la marge de votre pizzeria',
    tagline: 'Logiciel de gestion spécialisé pour pizzerias',
    description: 'Guide et outil pour calculer les marges de votre pizzeria. Food cost, coefficient multiplicateur, rentabilité par pizza, gestion pâte, garnitures, et optimisation prix de vente.',
    heroSubtitle: "Calculez précisément le coût de chaque pizza, optimisez vos garnitures et pilotez votre marge plat par plat avec RestauMargin.",
    avgMargin: '65-75%',
    avgFoodCost: '28-32%',
    avgCoef: '3,5 à 4',
    challenges: [
      'Variations de prix farine, mozzarella, tomates',
      'Garnitures multiples : difficile de standardiser',
      'Pizzas au menu fixe vs pizzas du jour : marges différentes',
      'Gaspillage pâte si mauvaise prévision',
      'Livraison : commission plateformes mange la marge',
    ],
    stats: [
      { label: 'Food cost moyen', value: '30%', color: 'teal' },
      { label: 'Marge brute cible', value: '70%', color: 'emerald' },
      { label: 'Coefficient type', value: '3,8x', color: 'amber' },
      { label: 'Fiches techniques', value: 'Illimitées', color: 'rose' },
    ],
    faqs: [
      { q: 'Quelle est la marge moyenne d\'une pizzeria ?', a: 'La marge brute d\'une pizzeria tourne autour de 65-75%. Les pizzerias bien gérées atteignent 72-75% grâce à un food cost maîtrisé (28-32%) et des garnitures standardisées.' },
      { q: 'Comment calculer le coût d\'une pizza ?', a: 'Coût matière = pâte (farine, eau, huile, levure, sel) + base tomate + mozzarella + garnitures. Pesez chaque composant pour une fiche technique précise. RestauMargin automatise ce calcul pour chaque pizza.' },
      { q: 'Quel coefficient multiplicateur appliquer en pizzeria ?', a: 'Le coefficient multiplicateur standard en pizzeria est de 3,5 à 4. Exemple : pizza à 3,50€ de coût matière → prix de vente entre 12 et 14€ selon positionnement.' },
      { q: 'Comment RestauMargin aide une pizzeria ?', a: 'Fiches techniques par pizza, gestion stock farine/mozzarella/garnitures, alertes prix fournisseurs, calcul marge par plat en temps réel, et suggestions IA pour optimiser les pizzas non rentables.' },
    ],
  },
  'brasserie': {
    slug: 'brasserie',
    title: 'Calcul de marge brasserie : guide complet 2026',
    h1: 'Optimisez la marge de votre brasserie',
    tagline: 'Logiciel de gestion pour brasseries et restaurants traditionnels',
    description: 'Guide et outil pour calculer les marges de votre brasserie. Gestion carte, plat du jour, menu entrée-plat-dessert, boissons, et optimisation food cost.',
    heroSubtitle: "Maîtrisez vos marges solides ET boissons, optimisez votre carte et augmentez votre rentabilité avec une vraie gestion professionnelle.",
    avgMargin: '70-75%',
    avgFoodCost: '25-30%',
    avgCoef: '4 à 4,5',
    challenges: [
      'Carte variée : nombreuses fiches techniques à gérer',
      'Menu du jour change : mise à jour manuelle chronophage',
      'Marges solides vs boissons très différentes',
      'Produits saisonniers : prix fluctuent',
      'Service midi rapide, service soir gastronomique : rotations différentes',
    ],
    stats: [
      { label: 'Food cost solides', value: '28%', color: 'teal' },
      { label: 'Marge brute cible', value: '72%', color: 'emerald' },
      { label: 'Coefficient type', value: '4,2x', color: 'amber' },
      { label: 'Marge boissons', value: '80%+', color: 'rose' },
    ],
    faqs: [
      { q: 'Quelle marge moyenne pour une brasserie ?', a: 'La marge brute d\'une brasserie se situe entre 70% et 75% sur les solides, et atteint 80%+ sur les boissons. La marge globale moyenne après charges est de 4% à 8% selon la gestion.' },
      { q: 'Comment gérer le menu du jour ?', a: 'Le menu du jour doit être créé chaque matin avec fiche technique validée avant service. RestauMargin permet de générer la fiche en 2 minutes avec ingrédients + grammages + calcul marge automatique.' },
      { q: 'Food cost boissons vs solides ?', a: 'Boissons : 20-25% de food cost. Solides : 28-32%. C\'est pour cela qu\'une brasserie doit équilibrer ses ventes : un menu qui vend beaucoup de boissons est plus rentable.' },
      { q: 'RestauMargin gère-t-il la carte complète ?', a: 'Oui, recettes illimitées dans l\'offre unique à 19 €/mois. Import CSV possible depuis votre carte actuelle. Catégorisation entrées/plats/desserts/boissons automatique.' },
    ],
  },
  'bistro': {
    slug: 'bistro',
    title: 'Calcul de marge bistrot : guide complet 2026',
    h1: 'Optimisez la marge de votre bistrot',
    tagline: 'Logiciel de gestion simple pour bistrots et cafés-restaurants',
    description: 'Guide et outil pour calculer les marges de votre bistrot. Gestion simple, ardoise du jour, rotation rapide et optimisation du food cost au quotidien.',
    heroSubtitle: "L'outil pensé pour les bistrots : simple, rapide, efficace. Calcul marges à l'ardoise du jour, en 30 secondes.",
    avgMargin: '68-73%',
    avgFoodCost: '27-32%',
    avgCoef: '3,8 à 4,2',
    challenges: [
      'Ardoise qui change chaque jour : fiches techniques à la volée',
      'Petite équipe : pas le temps de faire des calculs manuels',
      'Budget logiciel limité : besoin d\'un outil pas cher',
      'Approvisionnement de proximité : prix variables',
      'Menu rapide midi, plus élaboré soir',
    ],
    stats: [
      { label: 'Food cost moyen', value: '29%', color: 'teal' },
      { label: 'Marge brute cible', value: '70%', color: 'emerald' },
      { label: 'Coefficient type', value: '4x', color: 'amber' },
      { label: 'Ticket moyen', value: '18-25€', color: 'rose' },
    ],
    faqs: [
      { q: 'Quelle marge moyenne pour un bistrot ?', a: 'La marge brute d\'un bistrot est généralement de 68-73% sur les plats et 80%+ sur les boissons. La marge nette après charges tourne autour de 3% à 6%.' },
      { q: 'Comment gérer l\'ardoise du jour ?', a: 'RestauMargin permet de créer une fiche technique en 1 minute : ingrédients + grammages + prix automatiques depuis votre base. Vous imprimez directement l\'ardoise avec prix optimal.' },
      { q: 'RestauMargin convient-il aux petits bistrots ?', a: 'Oui. L\'essai gratuit de 7 jours, sans carte bancaire, permet de tester. Ensuite, RestauMargin (19 €/mois, offre unique) couvre tous les besoins d\'un bistrot classique.' },
      { q: 'Import de ma carte actuelle ?', a: 'Oui, import CSV ou Excel. Nous pouvons aussi reprendre vos fiches techniques papier via l\'assistant IA qui les numérise en quelques secondes.' },
    ],
  },
  'food-truck': {
    slug: 'food-truck',
    title: 'Calcul de marge food truck : guide complet 2026',
    h1: 'Optimisez la marge de votre food truck',
    tagline: 'Logiciel de gestion mobile pour food trucks et street food',
    description: 'Guide et outil pour calculer les marges de votre food truck. Gestion offline, fiches techniques rapides, rotation ingrédients et optimisation par site.',
    heroSubtitle: "Calculez vos marges partout où vous êtes, même hors ligne. L'outil pensé pour le street food rapide et nomade.",
    avgMargin: '60-70%',
    avgFoodCost: '30-35%',
    avgCoef: '3 à 3,5',
    challenges: [
      'Connexion internet pas toujours disponible',
      'Menu court mais volume élevé',
      'Ingrédients péris vite : gestion FIFO critique',
      'Variations de fréquentation selon site et météo',
      'Équipe réduite : pas de temps pour de la compta',
    ],
    stats: [
      { label: 'Food cost moyen', value: '32%', color: 'teal' },
      { label: 'Marge brute cible', value: '68%', color: 'emerald' },
      { label: 'Coefficient type', value: '3,2x', color: 'amber' },
      { label: 'Ticket moyen', value: '10-15€', color: 'rose' },
    ],
    faqs: [
      { q: 'Quelle marge moyenne pour un food truck ?', a: 'La marge brute d\'un food truck se situe entre 60% et 70%, avec un ticket moyen de 10-15€ et un food cost de 30-35%. La marge nette est souvent supérieure à un restaurant classique grâce aux charges réduites.' },
      { q: 'RestauMargin fonctionne hors ligne ?', a: 'Oui, le mode PWA permet de continuer à saisir ventes et gérer stocks même sans connexion. Les données se syncent automatiquement quand le réseau revient.' },
      { q: 'Comment gérer plusieurs food trucks ?', a: 'RestauMargin (19 €/mois, offre unique) permet de gérer plusieurs établissements depuis un dashboard unique. Vous voyez les marges de chaque truck en temps réel et comparez les performances.' },
      { q: 'Gestion FIFO pour ingrédients péris ?', a: 'Oui, l\'inventaire inclut date de péremption, lot fournisseur et méthode FIFO automatique. Alertes si ingrédient approche expiration.' },
    ],
  },
  'restaurant-gastronomique': {
    slug: 'restaurant-gastronomique',
    title: 'Calcul de marge restaurant gastronomique : guide 2026',
    h1: 'Maîtrisez la marge de votre restaurant gastronomique',
    tagline: 'Logiciel de gestion pour restaurants gastronomiques et étoilés',
    description: 'Guide et outil pour calculer les marges d\'un restaurant gastronomique. Fiches techniques précises, produits nobles, traçabilité HACCP et gestion menu dégustation.',
    heroSubtitle: "Précision au milligramme près. Traçabilité HACCP intégrée. Fiches techniques professionnelles pour menus dégustation et à la carte.",
    avgMargin: '65-75%',
    avgFoodCost: '25-35%',
    avgCoef: '3 à 4',
    challenges: [
      'Produits nobles à tracer précisément (homard, truffe, caviar)',
      'Fiches techniques au milligramme (sauces, réductions)',
      'Menu dégustation : rentabilité plat par plat',
      'HACCP strict : traçabilité obligatoire',
      'Saisonnalité : adaptation carte chaque mois',
    ],
    stats: [
      { label: 'Food cost moyen', value: '30%', color: 'teal' },
      { label: 'Marge brute cible', value: '70%', color: 'emerald' },
      { label: 'Coefficient type', value: '3,5x', color: 'amber' },
      { label: 'Ticket moyen', value: '80-250€', color: 'rose' },
    ],
    faqs: [
      { q: 'Quelle marge moyenne pour un restaurant gastronomique ?', a: 'La marge brute d\'un restaurant gastronomique tourne autour de 65-75%, avec un food cost plus élevé (25-35%) à cause des produits nobles. La marge nette est impactée par le coût de la brigade (plus élevée qu\'un restaurant classique).' },
      { q: 'Précision des fiches techniques ?', a: 'RestauMargin permet de travailler au milligramme. Idéalement avec une balance Bluetooth connectée, vous saisissez les grammages en direct lors de la préparation.' },
      { q: 'Gestion HACCP ?', a: 'Module HACCP complet : relevés de températures, plan de maîtrise sanitaire, traçabilité lots fournisseurs, registre températures frigos/conges automatique.' },
      { q: 'Menu dégustation plat par plat ?', a: 'Oui, vous créez chaque plat séparément avec sa marge. Le menu dégustation est la somme des plats avec son coefficient global. Vous voyez la rentabilité globale ET plat par plat.' },
    ],
  },
  'cafe-coffee-shop': {
    slug: 'cafe-coffee-shop',
    title: 'Calcul de marge café et coffee shop : guide complet 2026',
    h1: 'Optimisez la marge de votre café et coffee shop',
    tagline: 'Logiciel de gestion spécialisé pour cafés et coffee shops',
    description: 'Guide et outil pour calculer les marges de votre café ou coffee shop. Food cost café, coefficient boissons, marge pâtisserie, gestion takeaway et optimisation recettes signature.',
    heroSubtitle: "Le café à 0,20€ de matière vendu 3,50€ : un des meilleurs coefficients de la restauration. Mais mal géré, le food cost explose. RestauMargin vous donne la maîtrise totale.",
    avgMargin: '70-78%',
    avgFoodCost: '22-28%',
    avgCoef: '4,5 à 6',
    challenges: [
      'Cafés specialty : grain, torréfaction, recette — chaque paramètre impacte le coût',
      'Accompagnements pâtisserie : food cost élevé (35-40%) qui tire la marge vers le bas',
      'Takeaway vs sur place : TVA différente, tarification à adapter',
      'Machines espresso et broyeurs : amortissement à intégrer dans le prix de revient',
      'Saisonnalité des boissons chaudes vs froides : gestion des pertes en été',
    ],
    stats: [
      { label: 'Food cost boissons', value: '18%', color: 'teal' },
      { label: 'Marge brute cible', value: '74%', color: 'emerald' },
      { label: 'Coefficient espresso', value: '12-15x', color: 'amber' },
      { label: 'Ticket moyen', value: '6-12€', color: 'rose' },
    ],
    faqs: [
      {
        q: 'Quelle est la marge moyenne d\'un café ou coffee shop ?',
        a: 'La marge brute d\'un café ou coffee shop se situe entre 70% et 78%, ce qui en fait l\'un des segments les plus rentables de la restauration. La boisson chaude (espresso, cappuccino, latte) affiche un food cost de 15 à 20%, la boisson froide 20 à 25%, et la pâtisserie 30 à 40%. La clé est d\'équilibrer les ventes : plus vous vendez de cafés simples par rapport aux préparations complexes ou aux accompagnements sucrés, meilleure est votre marge globale. La marge nette après charges (loyer, équipement, masse salariale) oscille entre 5% et 12% selon l\'emplacement et le positionnement specialty vs traditionnel.',
      },
      {
        q: 'Comment calculer le food cost d\'un espresso ou d\'un cappuccino ?',
        a: 'Pour un espresso : dose de café (7 à 9g selon recette) x prix du kg de grain. Exemple : 8g d\'un grain specialty à 25€/kg = 0,20€ de matière. Vendu 2,80€, le food cost est de 7%. Pour un cappuccino : dose café (0,20€) + 120ml de lait (0,12€) = 0,32€. Vendu 3,80€, food cost de 8,4%. RestauMargin calcule automatiquement ces coûts dès que vous renseignez vos prix fournisseurs grains et lait, et met à jour toutes vos recettes en temps réel si le prix du grain change.',
      },
      {
        q: 'Comment gérer la TVA takeaway vs consommation sur place ?',
        a: 'En France, la TVA sur les boissons et aliments est de 10% en consommation sur place et de 5,5% à emporter (sauf boissons alcoolisées à 20%). Cela signifie que le prix TTC peut être le même mais votre marge HT diffère selon le mode de consommation. RestauMargin vous permet de définir deux prix de vente par produit (sur place / emporter) et calcule la marge réelle HT dans les deux cas. Indispensable si votre chiffre d\'affaires takeaway dépasse 30% du total.',
      },
      {
        q: 'RestauMargin convient-il aux coffee shops avec carte food ?',
        a: 'Oui, RestauMargin gère aussi bien les boissons (cafés, thés, smoothies, jus) que les solides (brunchs, toasts avocado, bowls, pâtisseries maison). Vous créez une fiche technique par produit avec grammages précis. Le tableau de bord vous montre côte à côte la marge de chaque référence : vous identifiez immédiatement quelles recettes signature tirent la moyenne vers le bas et pouvez ajuster le prix ou les proportions. RestauMargin (19 €/mois, offre unique) est suffisant pour un coffee shop avec une carte de 30 à 60 références.',
      },
    ],
  },
  'sushi-restaurant': {
    slug: 'sushi-restaurant',
    title: 'Calcul de marge restaurant sushi : guide complet 2026',
    h1: 'Optimisez la marge de votre restaurant sushi',
    tagline: 'Logiciel de gestion spécialisé pour restaurants sushi et japonais',
    description: 'Guide et outil pour calculer les marges de votre restaurant sushi. Food cost poisson cru, riz à sushi, formules plateau, gestion FIFO fraîcheur et optimisation carte japonaise.',
    heroSubtitle: "Saumon, thon, crevettes : des matières premières nobles dont le prix fluctue chaque semaine au marché de Rungis. Chaque gramme de poisson compte. RestauMargin vous donne la précision pour protéger votre marge plateau après plateau.",
    avgMargin: '62-70%',
    avgFoodCost: '30-38%',
    avgCoef: '3 à 3,5',
    challenges: [
      'Prix du saumon et du thon : volatils selon cours Rungis et importations Norvège/Atlantique',
      'Fraîcheur absolue obligatoire : pertes importantes si mauvaise prévision de couverts',
      'Formules plateau tout-inclus : impossible de calculer la marge par convive sans fiche technique',
      'Riz à sushi : dosage précis (15-18g par pièce) et cuisson standardisée indispensables',
      'Livraison : emballage sushi rigide + suremballer augmentent le coût matière de 8 à 12%',
    ],
    stats: [
      { label: 'Food cost moyen', value: '34%', color: 'teal' },
      { label: 'Marge brute cible', value: '66%', color: 'emerald' },
      { label: 'Coefficient type', value: '3,2x', color: 'amber' },
      { label: 'Ticket moyen', value: '18-35€', color: 'rose' },
    ],
    faqs: [
      {
        q: 'Quelle est la marge moyenne d\'un restaurant sushi ?',
        a: 'La marge brute d\'un restaurant sushi se situe entre 62% et 70%, ce qui est inférieur à la moyenne de la restauration (68-75%) en raison du coût élevé des matières premières : le saumon Atlantique oscille entre 12 et 18€/kg selon les périodes, le thon rouge 25-45€/kg, les crevettes 9-14€/kg. Les restaurants sushi qui atteignent 68-70% de marge brute sont ceux qui maîtrisent leurs grammages au gramme près (18g de riz par pièce, 15-20g de poisson selon la référence), négocient leurs volumes avec un grossiste en produits de la mer, et proposent une carte équilibrée mêlant références nobles (saumon, thon) et références plus abordables (surimi, avocat, concombre). La marge nette après charges tourne entre 4% et 9% selon la densité de couverts et le format (self-service conveyor belt vs service à table).',
      },
      {
        q: 'Comment calculer le food cost d\'un maki, d\'un nigiri ou d\'un plateau ?',
        a: 'Pour un maki california (8 pièces) : riz 130g (0,18€) + nori 1/2 feuille (0,08€) + surimi 40g (0,20€) + avocat 30g (0,12€) + concombre 20g (0,04€) + mayonnaise 10g (0,03€) = 0,65€ de coût matière. Vendu 6,50€, le food cost est de 10% — excellent. Pour un nigiri saumon : riz 18g (0,025€) + saumon frais 20g (0,30€ au prix de 15€/kg) = 0,325€. Vendu 2,80€, food cost de 11,6%. Pour un plateau 30 pièces mix saumon/thon/crevettes, le coût matière peut atteindre 8-10€ pour un prix de vente de 25-30€, soit un food cost de 30-40% selon la composition. RestauMargin automatise ce calcul : renseignez une fois vos prix fournisseurs poissons et le système recalcule instantanément le food cost de toutes vos pièces et plateaux quand le prix du saumon change.',
      },
      {
        q: 'Comment gérer les pertes liées à la fraîcheur du poisson cru ?',
        a: 'La gestion de la fraîcheur est le nerf de la guerre en sushis. Le poisson cru ne se conserve que 24-48h après réception. Les bonnes pratiques : (1) commander chaque matin en fonction des réservations du jour et des prévisions historiques (évitez le stock tampon), (2) tracker chaque lot par date de réception avec méthode FIFO stricte, (3) valoriser les restes du soir en tartares ou bowls au menu du lendemain midi avant péremption. RestauMargin intègre un module de gestion des pertes : vous saisissez les quantités non utilisées en fin de service, le logiciel calcule automatiquement le coût réel des pertes et l\'impact sur votre food cost journalier. Après 30 jours, l\'IA identifie les références avec le taux de perte le plus élevé et recommande d\'ajuster les quantités commandées ou de repenser la composition des plateaux pour limiter le gaspillage poisson.',
      },
      {
        q: 'RestauMargin convient-il aux restaurants avec formules tout-inclus ou conveyor belt ?',
        a: 'Oui, RestauMargin est adapté aux formats sushi all-you-can-eat (AYCE) et aux restaurants conveyor belt (kaiten sushi). Pour les formules tout-inclus, vous créez une "fiche technique composite" avec la composition moyenne consommée par convive (estimée sur 30 jours de service), ce qui vous donne le coût réel par tête et la marge par couvert. Pour les kaiten, chaque assiette tourne avec un code couleur de prix : RestauMargin vous permet de créer une fiche technique par couleur d\'assiette et de suivre les ventes par référence en temps réel via votre caisse. Le dashboard multi-format montre le food cost global, la marge par catégorie (nigiri/maki/temaki/sashimi), et les références qui sous-performent. Les restaurants AYCE à forte rotation peuvent ainsi ajuster la composition de leurs plateaux formule sans impacter l\'expérience client tout en récupérant 4 à 8 points de marge brute.',
      },
    ],
  },
  'burger-restaurant': {
    slug: 'burger-restaurant',
    title: 'Calcul de marge burger restaurant : guide complet 2026',
    h1: 'Optimisez la marge de votre burger restaurant',
    tagline: 'Logiciel de gestion pour burger restaurants et smash burgers',
    description: 'Guide et outil pour calculer les marges de votre burger restaurant. Food cost steak haché, optimisation assemblage, gestion frites et boissons, rentabilité par formule.',
    heroSubtitle: "Le burger : produit à fort potentiel de marge quand les grammages sont maîtrisé. Steak haché, bun, sauces, frites — chaque composant compte. RestauMargin vous donne la précision pour atteindre 70% de marge brute.",
    avgMargin: '65-72%',
    avgFoodCost: '28-35%',
    avgCoef: '3 à 3,8',
    challenges: [
      'Prix de la viande hachée : volatile selon le cours du boeuf',
      'Formules burger + frites + boisson : équilibre marge solide vs accompagnement',
      'Livraison Uber Eats / Deliveroo : commission 25-30% qui efface la marge',
      'Grammages non standardisés : 100g vs 150g de steak change tout au food cost',
      'Sauces maison vs industrielles : food cost difficile à calculer sans fiche technique',
    ],
    stats: [
      { label: 'Food cost moyen', value: '32%', color: 'teal' },
      { label: 'Marge brute cible', value: '68%', color: 'emerald' },
      { label: 'Coefficient type', value: '3,5x', color: 'amber' },
      { label: 'Ticket moyen', value: '14-20€', color: 'rose' },
    ],
    faqs: [
      {
        q: 'Quelle est la marge moyenne d\'un burger restaurant ?',
        a: 'La marge brute d\'un burger restaurant se situe entre 65% et 72%. Le food cost oscille entre 28% et 35%, principalement tiré par le steak haché (coût matière 6-9€/kg selon qualité), le bun (0,25-0,40€), les garnitures (cheddar, bacon, légumes) et les sauces. Les restaurants qui atteignent 70%+ de marge brute sont ceux qui maîtrisent leurs grammages au gramme près et qui vendent des formules équilibrées : le burger seul est moins rentable que la formule burger + frites + boisson, car les frites (food cost ~15%) et la boisson (food cost ~10-12%) compensent le food cost élevé de la viande. La marge nette après charges (loyer, personnel, énergie) oscille entre 5% et 10% selon l\'emplacement et le format (service à table vs comptoir).',
      },
      {
        q: 'Comment calculer le food cost d\'un burger ?',
        a: 'Le calcul se fait ingrédient par ingrédient : steak haché 150g (1,20-1,80€ selon qualité), bun (0,30€), cheddar 2 tranches (0,25€), salade + tomate + oignon (0,20€), sauce maison (0,10€). Total burger seul : 2,05-2,65€. Vendu 12€, le food cost est de 21%. En formule avec frites 150g (0,50€) et boisson (0,30€), le food cost total de la formule est de ~3,05€ pour un prix de vente de 14-16€, soit 19-22% — nettement meilleur. RestauMargin automatise ce calcul : renseignez une fois vos prix fournisseurs viande, buns et condiments, et toutes les fiches techniques se mettent à jour en temps réel si le prix du boeuf change.',
      },
      {
        q: 'Comment préserver sa marge sur les livraisons Uber Eats et Deliveroo ?',
        a: 'Les plateformes de livraison prennent 25 à 30% de commission sur le prix TTC, ce qui peut effacer toute la marge brute d\'un burger. La solution est triple : (1) appliquer une majoration de 12-15% sur les plateformes par rapport aux prix salle, (2) proposer des formules spécifiques livraison avec un steak plus fin (smash burger 80g vs 150g en salle), (3) calculer la marge nette par canal de vente. RestauMargin vous permet de créer des fiches techniques avec deux prix distincts — prix salle et prix livraison — et calcule la marge réelle après commission pour chaque plat sur chaque canal. Vous identifiez quels produits sont rentables en livraison et lesquels doivent être exclus de votre menu plateforme.',
      },
      {
        q: 'RestauMargin convient-il aux dark kitchens et smash burger ?',
        a: 'Oui, RestauMargin est particulièrement adapté aux dark kitchens et smash burgers. Ces formats ont des caractéristiques spécifiques : volume élevé sur un menu court (5-15 références), forte dépendance aux plateformes de livraison, besoin de contrôle précis des grammages pour protéger la marge. La fonctionnalité multi-canal vous permet de définir des marges cibles différentes selon le canal (click & collect, Uber Eats, Deliveroo) et de détecter automatiquement les articles sous le seuil de rentabilité par plateforme. Les dark kitchens qui gèrent plusieurs marques depuis une même cuisine peuvent créer autant de "restaurants virtuels" que nécessaire dans un seul compte, avec fiches techniques et marges indépendantes par marque.',
      },
    ],
  },
  'kebab-fast-food': {
    slug: 'kebab-fast-food',
    title: 'Calcul de marge kebab et fast-food : guide complet 2026',
    h1: 'Optimisez la marge de votre kebab et fast-food',
    tagline: 'Logiciel de gestion spécialisé pour kebabs, sandwicheries et fast-foods',
    description: 'Guide et outil pour calculer les marges de votre kebab ou fast-food. Food cost viande grillé, pain, sauces et garnitures. Gestion formules midi, livraison et optimisation marge par commande.',
    heroSubtitle: "Le kebab : produit emblématique du fast-food français avec un potentiel de marge élevé quand les grammages sont maîtrisé. Viande de broche, pain, sauces, crudités — chaque composant compte. RestauMargin vous donne la précision pour atteindre 68% de marge brute.",
    avgMargin: '62-70%',
    avgFoodCost: '30-38%',
    avgCoef: '3 à 3,5',
    challenges: [
      'Prix de la viande de veau/agneau : volatil selon cours et saison',
      'Grammages non standardisés : 120g vs 180g de viande change tout au food cost',
      'Plateformes de livraison : commission 25-30% qui efface la marge sur les commandes en ligne',
      'Sauces maison vs industrielles : food cost difficile à maîtriser sans fiche technique',
      'Volume élevé et service rapide : pas le temps pour des calculs manuels entre les commandes',
    ],
    stats: [
      { label: 'Food cost moyen', value: '34%', color: 'teal' },
      { label: 'Marge brute cible', value: '66%', color: 'emerald' },
      { label: 'Coefficient type', value: '3,2x', color: 'amber' },
      { label: 'Ticket moyen', value: '9-15€', color: 'rose' },
    ],
    faqs: [
      {
        q: 'Quelle est la marge moyenne d\'un kebab ou fast-food ?',
        a: 'La marge brute d\'un kebab se situe entre 62% et 70%, avec un food cost de 30% à 38%. La viande de broche (veau, agneau ou mélange) est le poste de coût principal : elle représente 50 à 60% du food cost total d\'un kebab standard. Les kebabs les mieux gérés atteignent 68-70% de marge brute grâce à trois leviers : (1) standardisation des grammages de viande au gramme près (120 à 180g selon la taille), (2) fabrication maison des sauces signature (sauce blanche, harissa) avec un food cost de 8-12% vs 15-20% pour les sauces industrielles de qualité équivalente, (3) équilibre de la carte entre kebabs classiques et formules avec boisson et frites qui diluent le food cost élevé de la viande. La marge nette après charges (loyer, personnel, énergie) se situe entre 6% et 14%, ce qui est supérieur à la moyenne de la restauration grâce aux charges de personnel réduites et au volume de commandes élevé.',
      },
      {
        q: 'Comment calculer le food cost d\'un kebab ?',
        a: 'Le calcul se fait composant par composant. Pour un kebab standard (taille M) : viande de broche 140g (1,40€ à 10€/kg), pain pita ou baguette (0,25€), salade 40g (0,08€), tomates 60g (0,12€), oignons 30g (0,04€), sauce blanche 30ml (0,06€), harissa 10g (0,03€). Total coût matière : 1,98€. Vendu 7,50€, le food cost est de 26,4% — excellent. En formule avec frites 150g (0,40€) et boisson 33cl (0,25€), le coût total est de 2,63€ pour un prix de vente de 10,50€, soit 25% de food cost. Le food cost monte à 38-42% quand le grammage viande n\'est pas contrôlé (200g au lieu de 140g) ou quand la boisson est une canette vendue à prix coûtant. RestauMargin automatise ce calcul : renseignez une fois vos prix fournisseurs viande, pain et condiments, et toutes vos fiches techniques se mettent à jour en temps réel quand le cours de la viande change.',
      },
      {
        q: 'Comment préserver sa marge sur les commandes Uber Eats et Deliveroo ?',
        a: 'Les plateformes de livraison prennent 25 à 30% de commission sur le prix TTC, ce qui peut transformer un kebab rentable en article à perte. La stratégie en 4 points : (1) appliquer une majoration de 15-20% sur les plateformes par rapport aux prix comptoir — les clients livraison acceptent ce surprice car ils valorisent la commodité, (2) créer un menu livraison simplifié avec les références les plus rentables (kebab M, kebab L, formules) et supprimer les assiettes XXL et les extras qui alourdissent le food cost, (3) calculer la marge nette par canal (comptoir, click & collect, Uber Eats, Deliveroo) pour identifier lesquels sont réellement profitables, (4) pousser le click & collect en direct via QR code en vitrine — zéro commission, fidélité client. RestauMargin vous permet de définir deux grilles tarifaires (comptoir / livraison) par produit et affiche la marge réelle après commission de plateforme pour chaque référence, en temps réel.',
      },
      {
        q: 'RestauMargin convient-il aux kebabs avec forte rotation et service rapide ?',
        a: 'Oui, RestauMargin est conçu pour les environnements à forte cadence. La saisie d\'une fiche technique kebab prend moins de 2 minutes : vous définissez une fois les composants et les grammages standards, et le logiciel calcule automatiquement le food cost de chaque variante (S, M, L, XXL) et de chaque formule. En service, vous n\'avez rien à faire : RestauMargin travaille en arrière-plan. Le tableau de bord quotidien vous montre le food cost de la journée, l\'alerte si le coût matière dépasse votre seuil cible, et la marge par produit. Les patrons de kebabs qui gèrent aussi la livraison bénéficient du module multi-canal qui compare automatiquement la rentabilité comptoir vs plateformes. RestauMargin (19 €/mois, offre unique) convient aussi bien à un kebab avec une carte de 15 à 20 références qu\'à une carte complète avec formules, assiettes et options de personnalisation.',
      },
    ],
  },
  'boulangerie-patisserie': {
    slug: 'boulangerie-patisserie',
    title: 'Calcul de marge boulangerie-pâtisserie : guide complet 2026',
    h1: 'Optimisez la marge de votre boulangerie-pâtisserie',
    tagline: 'Logiciel de gestion spécialisé pour boulangeries, pâtisseries et viennoiseries',
    description: "Guide et outil pour calculer les marges de votre boulangerie-pâtisserie. Food cost farine, beurre, oeufs, gestion des fournées, prix de revient par pièce et optimisation carte viennoiseries et gâteaux.",
    heroSubtitle: "Un croissant beurre à 0,28€ de matière vendu 1,40€ : 80% de marge brute théorie. Mais sans fiche technique au gramme près et sans suivi du coût des matières grasses, la réalité est souvent bien différente. RestauMargin vous donne la maîtrise totale de votre marge par pièce.",
    avgMargin: '55-68%',
    avgFoodCost: '32-45%',
    avgCoef: '2,5 à 3,5',
    challenges: [
      "Prix du beurre et des oeufs : très volatils, +40% sur 18 mois — impact direct sur la marge viennoiseries",
      "Cuissons multiples par jour : gestion des invendus en fin de journée qui alourdissent le food cost réel",
      "Pièces vendues à l'unité : food cost difficile à calculer sans peser chaque composant par fournée",
      "Gamme large : 40 à 80 références différentes (pains, viennoiseries, sandwichs, pâtisseries) avec des marges très différentes",
      "Main-d'oeuvre élevée : les charges de personnel (30-40% du CA) mangent la marge nette même avec un bon food cost",
    ],
    stats: [
      { label: 'Food cost moyen', value: '38%', color: 'teal' },
      { label: 'Marge brute cible', value: '62%', color: 'emerald' },
      { label: 'Coefficient type', value: '3x', color: 'amber' },
      { label: 'Ticket moyen', value: '5-14€', color: 'rose' },
    ],
    faqs: [
      {
        q: "Quelle est la marge moyenne d'une boulangerie-pâtisserie ?",
        a: "La marge brute d'une boulangerie-pâtisserie se situe entre 55% et 68%, ce qui est inférieur à la moyenne de la restauration (68-75%), principalement en raison d'un food cost élevé (32-45%) tiré par le beurre, les oeufs, la farine et les garnitures pâtisserie. Les boulangeries qui atteignent 65-68% de marge brute sont celles qui maîtrisent trois leviers : (1) les fiches techniques précises par pièce avec grammages au gramme près, (2) la traçabilité des fournées pour calculer le coût réel selon le taux de perte et les invendus, (3) l'équilibre de la gamme entre les produits phares à forte marge (macarons, entremets, croissants au beurre) et les pains de base à marge plus étroite. La marge nette après charges (loyer, personnel, énergie — fours boulangers très energy-intensifs) oscille entre 3% et 8% selon le format et l'emplacement. Les boulangeries en centre-ville avec fort passage pédestre atteignent 6-8% grâce au volume ; les boulangeries de quartier ou rurales maintiennent 3-5% avec des charges fixes plus légères.",
      },
      {
        q: "Comment calculer le food cost d'un croissant, d'une baguette ou d'une pâtisserie ?",
        a: "Le calcul se fait par fournée, puis ramené à la pièce. Pour 20 croissants au beurre : farine T45 500g (0,65€), beurre de tourage 250g (2,50€ à 10€/kg), lait 150ml (0,12€), oeufs 2 (0,36€), sucre 40g (0,05€), sel 8g (0,01€), levure 10g (0,05€) = coût fournée de 3,74€. Divise par 20 pièces : 0,187€ par croissant. Vendu 1,40€, le food cost est de 13,4% — excellent en théorie. Mais en réel, il faut intégrer le taux de perte à la cuisson (5-8%), les invendus en fin de journée (10-15% si mauvaise prévision) et l'énergie four (amortissement + électrique). Une fois ces coûts intégrés, le food cost réel d'un croissant monte à 20-25%. Pour une tarte aux fraises (250g de fruits à 4€/kg, 80g de crème pâtissière, 100g de pâte sablée) : food cost de 1,20-1,50€ pour un prix de vente de 4,50€, soit 27-33%. RestauMargin automatise ce calcul par fournée : vous saisissez les ingredientsune fois, définissez le nombre de pièces par fournée, et le logiciel calcule le food cost unitaire et met à jour automatiquement toutes vos fiches si le prix du beurre ou de la farine change chez votre fournisseur.",
      },
      {
        q: "Comment gérer les invendus et pertes en fin de journée ?",
        a: "Les invendus sont le principal poste de perte occulte en boulangerie. Un croissant non vendu en fin de journée n'est pas \"perdu\" dans les stocks, mais son coût est bien réel et alourdit le food cost de tous les croissants vendus. La bonne méthode en 4 étapes : (1) tracker systématiquement les invendus par référence chaque soir (quantité non vendue vs quantité produite) — RestauMargin intègre un module de saisie des pertes journalières en 30 secondes, (2) calculer le taux de perte hebdomadaire par référence et ajuster les quantités produites par fournée, (3) valoriser les invendus de la veille : pain de la veille pour les croûtons et sandwichs du midi, viennoiseries en pain perdu ou dans les préparations pâtisserie, (4) proposer un panier fin de journée à prix réduit (50-60% de remise) pour éviter le gaspillage total. L'IA RestauMargin analyse vos données de ventes sur 30 jours et prédit les quantités optimales à produire par jour de la semaine et par saison, pour vous aider à réduire les invendus sans manquer de produit en début de journée.",
      },
      {
        q: "RestauMargin convient-il aux boulangeries-pâtisseries avec espace snacking et salon de thé ?",
        a: "Oui, RestauMargin est particulièrement adapté aux boulangeries-pâtisseries qui ont développé une activité snacking (sandwichs, quiches, formules midi) ou salon de thé. Ces formats hybrides ont des contraintes spécifiques : gérer simultanément des matières premières brutes (farine, beurre, oeufs pour la production) et des produits semitransformés (jambon, fromages, légumes pour le snacking), avec des marges très différentes selon le segment. Le dashboard multi-catégorie vous montre côte à côte la marge de vos pains et viennoiseries (production artisanale), vos pâtisseries (haute valeur ajoutée), vos sandwichs et formules (marge élevée, food cost 30-35%), et vos boissons en salon (marge >70%). Vous identifiez immédiatement les catégories qui tirent le résultat vers le bas. RestauMargin (19 €/mois, offre unique) couvre une boulangerie avec jusqu'à 150 références et 3 utilisateurs — suffisant pour une boulangerie-pâtisserie standard avec un patron et deux vendeurs. Les boulangeries multi-sites ou franchises ont, dans la même offre et sans supplément, un dashboard consolidé et la gestion des transferts inter-boutiques.",
      },
    ],
  },
  'bar-pub': {
    slug: 'bar-pub',
    title: 'Calcul de marge bar et pub : guide complet 2026',
    h1: 'Optimisez la marge de votre bar ou pub',
    tagline: 'Logiciel de gestion spécialisé pour bars, pubs et établissements de nuit',
    description: "Guide et outil pour calculer les marges de votre bar ou pub. Food cost boissons alcoolisées, marge cocktails, gestion snacking, happy hour et optimisation de la carte des boissons.",
    heroSubtitle: "Un cocktail à 1,80€ de matière vendu 10€ : une marge brute de 82%. Mais sans fiche technique sur chaque recette, le gaspillage au comptoir et les doses non contrôlées rongent votre rentabilité chaque soir. RestauMargin vous donne la maîtrise totale de votre marge verre par verre.",
    avgMargin: '72-82%',
    avgFoodCost: '18-28%',
    avgCoef: '5 à 7',
    challenges: [
      "Gaspillage au comptoir : surdosage des spiritueux sans jigger — 10 à 20cl de plus par soir représentent 50-100€ de perte hebdomadaire",
      "Happy hour : réduction de 30-50% sur les boissons — difficile de calculer la marge réelle sans simulation par tranche horaire",
      "Carte cocktails saisonnière : ingrédients frais (fruits, herbes) avec des prix très volatils qui impactent le food cost des signatures",
      "Snacking et planches : food cost élevé (35-45%) sur la nourriture qui tire la marge globale du bar vers le bas",
      "TVA boissons alcoolisées à 20% : calcul marge HT vs TTC source d'erreurs fréquentes sur la tarification",
    ],
    stats: [
      { label: 'Food cost boissons', value: '22%', color: 'teal' },
      { label: 'Marge brute cible', value: '78%', color: 'emerald' },
      { label: 'Coefficient cocktail', value: '6x', color: 'amber' },
      { label: 'Ticket moyen soir', value: '20-35€', color: 'rose' },
    ],
    faqs: [
      {
        q: "Quelle est la marge moyenne d'un bar ou pub ?",
        a: "La marge brute d'un bar ou pub se situe entre 72% et 82%, ce qui en fait l'un des segments les plus rentables de la restauration. Les boissons sont le moteur : un spiritueux (whisky, gin, rhum) affiche un food cost de 18-22% selon le positionnement, une bière pression 15-20%, un cocktail signature 18-25% si les doses sont contrôlées. La marge brute descend à 72-75% dans les établissements qui proposent une carte snacking significative (planches, burgers, tapas), car le food cost alimentaire (35-45%) tire la moyenne vers le bas. Les pubs avec forte consommation de bières pression atteignent 78-80% grâce à un food cost bière parmi les plus faibles de la restauration. La marge nette après charges — loyer (souvent élevé en centre-ville), personnel de soir (majoration nuit +25%), licences IV et musique SACEM/SPRE — oscille entre 8% et 16% selon la fréquentation et le format. Les bars cocktails en centre-ville avec programmation soirées atteignent 12-16% ; les pubs de quartier 8-11%.",
      },
      {
        q: "Comment calculer le food cost d'un cocktail, d'une bière et d'un spiritueux ?",
        a: "Pour un cocktail Mojito : rhum blanc 4cl (0,52€ à 13€/litre), sucre de canne 2cl (0,06€), citron vert 1/2 (0,20€), menthe 4-5 feuilles (0,08€), eau gazeuse 10cl (0,04€), glagons (0,05€) = 0,95€ de coût matière. Vendu 9€, le food cost est de 10,6% — excellent. Pour un whisky sec : 4cl de whisky standard (0,60€ à 15€/litre) vendu 6€, food cost de 10%. Pour une bière pression 25cl : coût matière 0,35€ (fût 30L à 42€) vendue 3,50€, food cost de 10%. Les boissons sans alcool et soft drinks ont un food cost de 12-18%. Le danger pour la marge cocktails : le surdosage sans jigger (4cl deviennent 5,5cl) ou les ingrédients frais dont le prix varie (jus de passion frais vs sirop). RestauMargin automatise ce calcul : renseignez vos prix fournisseurs spiritueux une fois, et le food cost de tous vos cocktails se met à jour en temps réel quand le prix d'un spiritueux change chez votre grossiste.",
      },
      {
        q: "Comment optimiser la marge pendant le happy hour sans sacrifier la rentabilité ?",
        a: "Le happy hour est un formidable outil de remplissage aux heures creuses, mais mal structuré il peut transformer une promotion commerciale en gouffre financier. La méthode en 4 étapes : (1) calculer la marge réelle de chaque produit en happy hour AVANT de lancer la promotion — une bière à -1€ reste rentable (food cost 20%), un cocktail signature à -30% peut passer sous le seuil de rentabilité si les ingrédients sont chers, (2) construire le happy hour sur les produits à fort coefficient naturel : bières pression, softs, cocktails simples (gin tonic, vodka orange) plutôt que sur les cocktails à ingrédients frais et multiples, (3) fixer une plage horaire stricte (17h-19h30 en semaine) et la respecter — le happy hour permanent est un suicide commercial, (4) mesurer l'impact en volume : +30% de couverts compensent largement la réduction de marge par verre. RestauMargin vous permet de créer des grilles tarifaires happy hour distinctes par produit et calcule la marge réelle par scénario (avec et sans promotion) pour chaque tranche horaire.",
      },
      {
        q: "RestauMargin convient-il aux bars avec carte snacking, cocktails signatures et événements privés ?",
        a: "Oui, RestauMargin est particulièrement adapté aux bars hybrides qui mixent boissons, snacking et événementiel. Ces établissements ont trois centres de marge à gérer en parallèle : les boissons (cocktails, bières, vins au verre — food cost 15-25%), le snacking (planches, tapas, burgers — food cost 35-45%), et les événements privés (open bar, formule cocktail dînatoire — tarification au forfait par tête). Le dashboard multi-catégorie vous montre la marge par segment et identifie quelles planches ou quels cocktails tirent le résultat vers le bas. Pour les soirées privées en open bar, la fonctionnalité de simulation vous permet de calculer le coût matière réel par convive sur un menu de boissons donné et de fixer le prix du forfait avec une marge garantie. Les bars qui organisent des événements réguliers (concerts, quiz, soirées à thème) peuvent créer des fiches techniques par type d'événement et suivre la rentabilité par date. RestauMargin (19 €/mois, offre unique) est suffisant pour un bar avec 60 à 80 références boissons et une carte snacking ; la même offre, sans supplément, convient aussi pour les bars multi-sites ou les groupes avec plusieurs licences.",
      },
    ],
  },
  'creperie': {
    slug: 'creperie',
    title: 'Calcul de marge crêperie : guide complet 2026',
    h1: 'Optimisez la marge de votre crêperie',
    tagline: 'Logiciel de gestion spécialisé pour crêperies et comptoirs galettes-crêpes',
    description: "Guide et outil pour calculer les marges de votre crêperie. Food cost sarrasin, beurre breton AOP, gestion garnitures, cidre et optimisation prix par galette et crêpe.",
    heroSubtitle: "Une galette complète au beurre breton à 0,90€ de matière vendue 12€ : théoriquement 92% de marge. Mais sans fiche technique précise, le beurre AOP, les garnitures et la pâte perdue diluent tout. RestauMargin vous donne la maîtrise totale de votre marge galette par galette.",
    avgMargin: '68-76%',
    avgFoodCost: '24-32%',
    avgCoef: '4 à 4,5',
    challenges: [
      "Prix du beurre breton AOP : 2 à 3 fois plus cher que le beurre standard, et très volatil (jusqu'à +35% sur 18 mois)",
      "Galettes sarrasin vs crêpes froment : food cost et marges très différents — la carte mélanges les deux sans distinction",
      "Garnitures premium (comté vieux, jambon artisanal, oeuf fermier) : grammages non contrôlés = food cost qui explose",
      "Pâte perdue : premières galettes de cuisson non vendables, taux de perte difficile à quantifier sans suivi",
      "Cidre : stock important, TVA alcool à 20%, marges boissons alcoolisées distinctes des crêpes",
    ],
    stats: [
      { label: 'Food cost moyen', value: '28%', color: 'teal' },
      { label: 'Marge brute cible', value: '72%', color: 'emerald' },
      { label: 'Coefficient type', value: '4,2x', color: 'amber' },
      { label: 'Ticket moyen', value: '14-22€', color: 'rose' },
    ],
    faqs: [
      {
        q: "Quelle est la marge moyenne d'une crêperie ?",
        a: "La marge brute d'une crêperie se situe entre 68% et 76%, ce qui en fait l'un des meilleurs segments de la restauration rapide. Le food cost moyen oscille entre 24% et 32% selon la gamme : une galette sarrasin simple (beurre, jambon, oeuf) affiche un food cost de 20-25%, tandis qu'une galette garnie de produits nobles (homard breton, st-jacques, foie gras de canard) peut atteindre 38-42%. Les crêperies qui atteignent 74-76% de marge brute maîtrisent trois leviers : (1) fiches techniques précises par galette et crêpe avec grammages au gramme près, (2) équilibre de la carte entre références simples à forte marge et références premium qui valorisent l'image mais doivent être tarifées en conséquence, (3) gestion du taux de perte sur la pâte (premières pièces non vendables en début de service, restes en fin). La marge nette après charges (loyer, personnel, énergie des biligs) tourne entre 6% et 12% selon l'emplacement et le format — les crêperies en zone touristique ou en bretagne avec forte affluence saisonnière atteignent 10-12% en haute saison.",
      },
      {
        q: "Comment calculer le food cost d'une galette ou d'une crêpe ?",
        a: "Le calcul se fait composant par composant. Pour une galette complète (jambon-oeuf-fromage) : pâte sarrasin 120g (0,22€ au coût de 1,80€/kg), beurre de cuisson 10g (0,15€), jambon artisanal 40g (0,56€ à 14€/kg), oeuf fermier (0,35€), emmental râpé 30g (0,24€) = 1,52€ de coût matière. Vendue 11,50€, le food cost est de 13,2% — excellent. En version garniture premium avec comté vieux 18 mois et jambon de la Ferme : pâte 120g (0,22€) + beurre 10g (0,15€) + comté vieux 40g (0,72€ à 18€/kg) + jambon artisanal 60g (0,90€) + oeuf fermier (0,35€) = 2,34€. Vendue 14,50€, le food cost monte à 16,1%. Pour une crêpe dessert (beurre-sucre-citron) : pâte froment 80g (0,10€) + beurre breton AOP 15g (0,20€) + sucre 10g (0,02€) = 0,32€ vendue 5,50€, food cost de 5,8% — le meilleur ratio de la carte. RestauMargin automatise ce calcul : renseignez une fois vos prix fournisseurs sarrasin, beurre et garnitures, et toutes vos fiches techniques se mettent à jour en temps réel quand le cours du beurre change.",
      },
      {
        q: "Comment maîtriser le food cost du beurre breton AOP en crêperie ?",
        a: "Le beurre breton AOP est l'ingrédient identitaire d'une crêperie de qualité, mais c'est aussi le plus volatile des coûts matières : son prix peut varier de 8€ à 14€/kg en fonction de la production laitière bretonne et de la demande internationale. Quatre stratégies pour maîtriser son impact : (1) standardiser les grammages de beurre de cuisson (8 à 10g par galette sur le bilig, pas au bol) et de beurre de service (portion individuelle 10g prédécoupée) — RestauMargin alerte quand le food cost beurre dépasse votre seuil cible, (2) négocier un contrat volume avec votre crémier ou groupement d'achat breton pour fixer le prix sur 3 à 6 mois, (3) utiliser le beurre de tourage (moins cher) pour l'incorporation dans la pâte et réserver le beurre AOP au service, (4) recalculer immédiatement vos prix de vente si le cours du beurre dépasse un seuil critique — RestauMargin simule l'impact d'une hausse de 15% sur votre marge et suggère le nouveau prix de vente optimal pour maintenir votre objectif de food cost.",
      },
      {
        q: "RestauMargin convient-il aux crêperies avec formules, services du soir et carte cidre ?",
        a: "Oui, RestauMargin est particulièrement adapté aux crêperies qui proposent des formules (galette + crêpe + boisson à prix fixe), car ces formats mélangent des produits aux marges très différentes : la galette garnie (food cost 20-30%), la crêpe dessert (food cost 6-10%) et la boisson (cidre artisanal à 22% de food cost, jus de pomme à 30%, cidre grande surface à 12%). Le dashboard multi-catégorie vous montre la marge de chaque référence séparément et la marge réelle de la formule une fois composée — indispensable pour tarifer vos formules sans sacrifier la rentabilité. Pour les services du soir avec carte plus élaborée (plateaux fruits de mer, galettes gastronomiques), RestauMargin gère les recettes multi-composants et calcule la marge plat par plat. Les crêperies qui gèrent aussi un espace épicerie (produits bretons, confits, biscuits) bénéficient du module stock séparant produits de fabrication et produits de revente avec des logiques de marge différentes. RestauMargin (19 €/mois, offre unique) couvre une crêperie avec jusqu'à 80 références et 2 utilisateurs.",
      },
    ],
  },
  'restaurant-traiteur': {
    slug: 'restaurant-traiteur',
    title: 'Calcul de marge restaurant traiteur : guide complet 2026',
    h1: 'Optimisez la marge de votre restaurant traiteur',
    tagline: 'Logiciel de gestion spécialisé pour traiteurs, buffets et restauration événementielle',
    description: "Guide et outil pour calculer les marges de votre restaurant traiteur. Food cost par convive, gestion devis événements, marge buffets, plateaux repas et optimisation de la rentabilité par prestation.",
    heroSubtitle: "Un buffet à 4,80€ de matière par convive facturé 28€ tête : une marge brute de 83% en théorie. Mais sans fiche technique par prestation et sans suivi du gaspillage post-événement, la rentabilité s'envole avec les restes. RestauMargin vous donne la maîtrise totale de votre marge prestation par prestation.",
    avgMargin: '65-78%',
    avgFoodCost: '22-35%',
    avgCoef: '3,5 à 5',
    challenges: [
      "Tarification par devis : chaque prestation est unique, impossible de standardiser sans fiche technique par type d'événement",
      "Gaspillage post-buffet : 15 à 25% des matières préparées non consommées — perte directe et invisible sur la marge",
      "Sous-traitants et extras : coordination logistique (vaisselle, personnel renforcé, transport) qui alourdit le coût réel de la prestation",
      "Saisonnalité forte : mariages en juin-septembre, cocktails d'entreprise en novembre-décembre — gestion des flux de trésorerie entre creux et pics",
      "Devis perdants : sans calcul précis du coût de revient par convive, on sous-tarife et on travaille à perte sans le savoir",
    ],
    stats: [
      { label: 'Food cost moyen', value: '28%', color: 'teal' },
      { label: 'Marge brute cible', value: '72%', color: 'emerald' },
      { label: 'Coefficient type', value: '4x', color: 'amber' },
      { label: 'Ticket moyen convive', value: '25-65€', color: 'rose' },
    ],
    faqs: [
      {
        q: "Quelle est la marge moyenne d'un restaurant traiteur ?",
        a: "La marge brute d'un restaurant traiteur se situe entre 65% et 78%, avec une grande disparité selon le type de prestation. Les cocktails debout (food cost 22-26%) et les buffets de mariage haut de gamme (food cost 28-32%) sont les plus rentables grâce à un rapport valeur perçue / coût matière très favorable. Les plateaux repas d'entreprise affichent un food cost plus élevé (30-35%) à cause du packaging individuel et des portions standardisées. Les traiteurs qui atteignent 75-78% de marge brute sur leurs prestations événementielles maîtrisent trois leviers : (1) fiches techniques précises par type de prestation et par convive avec zéro estimation au feeling, (2) suivi systématique des pertes post-événement (quantités préparées vs consommées) pour affiner les ratios de commande, (3) tarification par couche séparant food cost, coût de personnel renforcé, location matériel et marge nette cible. La marge nette après charges fixes (cuisine de production, véhicules réfrigérés, stockage, personnel permanent) oscille entre 8% et 18% selon le positionnement et le volume de prestations annuelles.",
      },
      {
        q: "Comment calculer le food cost d'un buffet ou d'un cocktail dînatoire ?",
        a: "Le calcul se fait par convive, en décomposant chaque pièce ou composant du buffet. Pour un cocktail dînatoire 40 pièces par personne (2 heures) : mini-quiches x6 (0,45€), verrines x4 (0,60€), brochettes poulet x4 (0,72€), mini-sandwichs x4 (0,48€), velouté en shot x2 (0,20€), assortiment fromages 60g (0,54€), desserts pièces x6 (0,42€), pain et beurre (0,08€) = 3,49€ de coût matière brute par convive, auquel on ajoute 15% de marge de sécurité pour les pertes et les extras (sel, huile, herbes) = 4,01€ réel. Facturé 22€ HT par convive, le food cost est de 18,2% — excellent. Pour un buffet assis 3 services (entrée-plat-dessert), le coût matière monte à 7-12€ par convive selon le standing, pour un prix de vente de 28-55€. RestauMargin permet de créer une fiche technique de prestation composite : vous définissez la liste des pièces, les quantités par convive et les ratios de perte, et le logiciel calcule automatiquement le coût total par prestation et par tête selon l'effectif du devis.",
      },
      {
        q: "Comment éviter les devis perdants et sécuriser la rentabilité de chaque prestation ?",
        a: "Le devis perdant est le principal risque du métier de traiteur : on accepte une prestation en sous-estimant le coût réel (personnel, transport, pertes, sous-traitants) et on travaille parfois à perte sans s'en rendre compte jusqu'au bilan de fin d'année. La méthode en 5 étapes pour sécuriser chaque devis : (1) créer un template de fiche technique par type de prestation (cocktail debout, buffet assis, box déjeuner, plateau cadeau) avec le food cost cible, les ratios de pièces par convive et les postes de coût hors-matière, (2) ajouter systématiquement au devis le coût du personnel renforcé (extras, serveurs, cuisinier) en euros par heure, le transport et la logistique, la location de matériel si non-propriétaire, (3) définir un taux de marge nette cible par type de prestation (ex : 20% net sur les cocktails, 15% sur les buffets complexes) et ne jamais accepter un devis sous ce seuil, (4) établir un bilan post-prestation dans les 48h : coût réel vs devis — les écarts récurrents sur un même type de prestation signalent un problème de fiche technique ou de sous-estimation chronique, (5) indexer vos tarifs annuellement sur l'évolution des prix fournisseurs. RestauMargin intègre un module de devis avec simulation de marge nette en temps réel : vous saisissez l'effectif, le type de prestation et les options, et le logiciel calcule instantanément le prix de vente minimal pour atteindre votre objectif de marge.",
      },
      {
        q: "RestauMargin convient-il aux traiteurs qui gèrent à la fois un espace de vente, des plateaux repas et des événements ?",
        a: "Oui, RestauMargin est particulièrement adapté aux traiteurs multi-activités qui cumulent une boutique de vente directe (plats cuisinés, entrées préparées, plateaux fromages), une activité plateaux repas d'entreprise (livraison récurrente, facturation mensuelle) et une activité événementielle (mariages, cocktails, séminaires). Ces trois segments ont des logiques de marge très différentes : la boutique affiche un food cost de 35-42% mais une forte valeur perçue sur les produits artisanaux, les plateaux repas 28-35% avec un volume prévisible et des coûts de logistique à intégrer, et l'événementiel 22-32% avec une tarification premium qui permet les meilleures marges nettes si bien structuré. Le dashboard multi-catégorie RestauMargin vous montre la marge par segment en temps réel : vous identifiez immédiatement lequel est le moteur de votre rentabilité et lequel sous-performe. La fonctionnalité de devis événementiel avec calcul de marge nette intégré remplace les spreadsheets maison souvent sources d'erreurs. Les traiteurs avec une cuisine centrale qui gère plusieurs points de vente ou plusieurs équipes terrain ont, dans la même offre et sans supplément, la gestion multi-sites et le suivi des coûts de production en cuisine centrale. RestauMargin (19 €/mois, offre unique) est suffisant pour un traiteur indépendant avec une activité événementielle de 20 à 50 prestations par an.",
      },
    ],
  },
  'restaurant-vegan': {
    slug: 'restaurant-vegan',
    title: 'Calcul de marge restaurant vegan : guide complet 2026',
    h1: 'Optimisez la marge de votre restaurant vegan',
    tagline: 'Logiciel de gestion spécialisé pour restaurants vegans et végétariens',
    description: "Guide et outil pour calculer les marges de votre restaurant vegan ou végétarien. Food cost ingrédients végétaux, protéines alternatives, gestion bio et optimisation de la rentabilité par plat.",
    heroSubtitle: "Un bowl vegan à 2,80€ de matière vendu 16€ : théoriquement 82% de marge. Mais sans fiche technique précise, les fromages de cajou, le tempeh bio et les superaliments font exploser le food cost. RestauMargin vous donne la maîtrise totale de votre marge plat par plat.",
    avgMargin: '68-76%',
    avgFoodCost: '24-32%',
    avgCoef: '3,5 à 4,5',
    challenges: [
      "Ingrédients alternatifs premium (fromage cajou maison, tempeh artisanal, seitan) : food cost 2 à 3 fois supérieur aux produits classiques équivalents",
      "Saisonnalité forte des légumes frais : le food cost d'un même plat peut varier de 8 à 15 points entre l'été et l'hiver selon le sourcing local",
      "Perception prix client : les convives vegan associent souvent végétal à moins cher et résistent à des prix reflétant le coût réel des ingrédients premium et du travail de transformation",
      "Labels et certifications (bio, vegan certifié, sans gluten) : surcoût matière de 20-40% sur les références labélisées qui tire le food cost global vers le haut",
      "Carte saisonnière qui change tous les 2-3 mois : nombreuses fiches techniques à recréer en permanence sans système de gestion dédié",
    ],
    stats: [
      { label: 'Food cost moyen', value: '28%', color: 'teal' },
      { label: 'Marge brute cible', value: '72%', color: 'emerald' },
      { label: 'Coefficient type', value: '3,8x', color: 'amber' },
      { label: 'Ticket moyen', value: '15-25€', color: 'rose' },
    ],
    faqs: [
      {
        q: "Quelle est la marge moyenne d'un restaurant vegan ?",
        a: "La marge brute d'un restaurant vegan se situe entre 68% et 76%, ce qui est comparable ou supérieur à la restauration classique quand les fiches techniques sont bien construites. Contrairement à une idée reçue, les restaurants vegans ne sont pas systématiquement plus rentables parce qu'ils n'utilisent pas de viande : les protéines végétales premium (tempeh bio 18-22€/kg, seitan artisanal 14-18€/kg, cashew pour les fromages 12-16€/kg) ont un coût matière équivalent voire supérieur à la viande de boeuf standard. Les restaurants vegans qui atteignent 74-76% de marge brute sont ceux qui équilibrent leur carte entre des préparations simples à fort coefficient (bowls légumes rôtis, soupes, wraps) et des plats élaborés qui justifient un positionnement premium. La marge nette après charges (loyer, personnel, énergie) oscille entre 6% et 13% selon l'emplacement et le positionnement — les restaurants vegans en centre-ville avec une clientèle CSP+ atteignent 10-13% grâce à un ticket moyen élevé (20-28€) sur une carte courte bien maîtrisée.",
      },
      {
        q: "Comment calculer le food cost d'un bowl vegan, d'un burger vegan ou d'un plat protéines végétales ?",
        a: "Pour un bowl vegan complet (base + protéines + toppings) : riz complet ou quinoa 150g (0,45€), tempeh mariné 100g (1,90€ à 19€/kg bio), épinards et légumes rôtis 200g (0,60€), sauce tahini 30g (0,24€), graines et superaliments (0,35€), sauce vinaigrette maison (0,10€) = 3,64€ de coût matière. Vendu 16€, le food cost est de 22,8% — excellent. Pour un burger vegan : steak végétal maison (champignons + lentilles + flocons avoine) 120g (0,85€), bun complet (0,35€), fromage cajou maison 40g (0,52€), légumes et sauce (0,40€) = 2,12€. Vendu 14€, food cost de 15,1%. En revanche, un plat avec protéines nobles véganes : escalope de seitan artisanal 180g (3,24€ à 18€/kg) + sauce forestière et légumes (1,20€) = 4,44€. Vendu 17€, food cost de 26,1% — correct si c'est le plat signature. RestauMargin automatise ce calcul : renseignez une fois vos prix fournisseurs tempeh, seitan, fromages vegans et superaliments, et toutes vos fiches techniques se mettent à jour en temps réel quand le prix d'un ingrédient change.",
      },
      {
        q: "Comment fixer des prix de vente reflétant la vraie valeur d'une cuisine vegan de qualité ?",
        a: "La tarification est le principal défi marketing d'un restaurant vegan : la cuisine végétale de qualité coûte cher à produire (ingrédients bio, transformation élaborée, main-d'oeuvre qualifiée) mais une partie des clients associe encore végétal à bon marché. La méthode en 4 étapes pour sortir de ce piège : (1) calculer systématiquement le food cost réel de chaque plat avec fiche technique précise — RestauMargin le fait en 2 minutes — pour identifier quels prix de vente garantissent votre objectif de food cost (max 30%), (2) mettre en avant la valeur perçue plutôt que l'absence de viande : ingrédients bios certifiés, sourcing local et saison, recettes élaborées maison (fromage de cajou affiné, seitan maison, pain au levain) qui justifient un positionnement premium, (3) structurer la carte avec une pyramide de prix : quelques entrées et options rapides accessibles (12-15€) pour ne pas bloquer l'entrée, des plats signatures à 18-24€ qui portent votre identité et votre marge, des formules midi à prix engagé (14-16€) qui remplissent en semaine avec un food cost maîtrisé, (4) ne jamais casser les prix sur les références premium — une réduction sur un burger vegan à 16€ qui coûte 4€ de matière reste acceptable ; sur un plat seitan truffés à 22€ qui coûte 7€, une promotion efface toute la marge. RestauMargin vous permet de simuler l'impact d'une promotion sur votre marge avant de la lancer.",
      },
      {
        q: "RestauMargin convient-il aux restaurants vegans avec carte saisonnière, brunch du dimanche et formules traiteur ?",
        a: "Oui, RestauMargin est particulièrement adapté aux restaurants vegans qui changent de carte plusieurs fois par an et qui ont des activités multiples. La cuisine vegan contemporaine est souvent saisonnière par conviction : une carte d'été aux courgettes, tomates et basilic n'a rien à voir avec une carte d'hiver aux courges, choux et légumes racines. Chaque changement de carte génère une nouvelle série de fiches techniques à construire. RestauMargin vous permet de dupliquer les fiches existantes, d'en modifier uniquement les ingrédients saisonniers, et de recalculer instantanément le food cost avec les nouveaux prix fournisseurs — ce qui prend 2 à 3 heures de travail est réduit à 20 minutes. Pour les brunchs du dimanche (formule à prix fixe avec de nombreuses préparations différentes), la fonctionnalité de fiche technique composite calcule le coût réel par convive en intégrant tous les composants du brunch. Pour l'activité traiteur ou les boxs repas, RestauMargin gère les devis avec simulation de marge nette et suivi des pertes post-événement. RestauMargin (19 €/mois, offre unique) couvre un restaurant vegan avec jusqu'à 100 références et une carte qui change chaque saison ; la même offre, sans supplément, convient aussi pour les restaurants avec plusieurs points de vente ou un espace épicerie vegan de produits transformés.",
      },
    ],
  },
  'dark-kitchen': {
    slug: 'dark-kitchen',
    title: 'Calcul de marge dark kitchen et ghost kitchen : guide complet 2026',
    h1: 'Optimisez la marge de votre dark kitchen',
    tagline: 'Logiciel de gestion spécialisé pour dark kitchens et ghost kitchens',
    description: "Guide et outil pour calculer les marges de votre dark kitchen ou ghost kitchen. Food cost multi-marques, commissions plateformes de livraison, optimisation par canal et rentabilité marque par marque.",
    heroSubtitle: "Une dark kitchen sans salle ni serveurs : théoriquement la structure de coût idéale. Mais les commissions plateformes à 27-30%, les emballages livraison et la complexité multi-marques peuvent vite dévorer vos bénéfices. RestauMargin vous donne la visibilité pour piloter votre rentabilité marque par marque, canal par canal.",
    avgMargin: '58-70%',
    avgFoodCost: '28-36%',
    avgCoef: '3 à 4',
    challenges: [
      "Commissions plateformes 25-30% sur le prix TTC : sans majoration tarifaire stratégique, chaque commande peut être à perte",
      "Multi-marques depuis une même cuisine : food costs et marges radicalement différents selon la marque — sans outil, pilotage impossible",
      "Emballages livraison : boîtes carton, sacs isothermes, inserts anti-renversement — un coût invisible qui atteint facilement 8-12% du food cost",
      "Dépendance aux algorithmes de plateforme : pas de salle, pas de clients réguliers en direct — la visibilité vient des plateformes",
      "Pas de boissons avec forte marge pour compenser : tout repose sur le food, chaque centième de food cost compte",
    ],
    stats: [
      { label: 'Food cost moyen', value: '32%', color: 'teal' },
      { label: 'Marge brute cible', value: '68%', color: 'emerald' },
      { label: 'Commission plateforme', value: '27%', color: 'amber' },
      { label: 'Ticket moyen livraison', value: '18-28€', color: 'rose' },
    ],
    faqs: [
      {
        q: "Quelle est la marge moyenne d'une dark kitchen ou ghost kitchen ?",
        a: "La marge brute d'une dark kitchen se situe entre 58% et 70%, ce qui est inférieur à la moyenne de la restauration classique (68-75%) principalement à cause de deux postes qui n'existent pas en salle : les commissions plateformes (25-30% du prix TTC, soit 15-20 points de marge brute réels) et les emballages livraison (boîtes carton, sacs isothermes, inserts — 2 à 4% du prix de vente). Les dark kitchens qui atteignent 68-70% de marge brute sont celles qui ont mis en place trois leviers : (1) une grille tarifaire plateforme 20-25% supérieure aux prix d'un restaurant classique pour absorber les commissions, (2) des fiches techniques incluant le coût de l'emballage dans le food cost de chaque référence, (3) un mix de marques équilibré — une marque burgers ou pizzas à food cost élevé compensée par une marque bowls ou saladerie à food cost plus faible. La marge nette après loyer cuisine (souvent partagé en opérateur multi-kitchen), personnel de production et frais fixes oscille entre 5% et 14% selon le volume de commandes et le nombre de marques actives. Les dark kitchens qui gèrent 5 marques ou plus depuis une cuisine partagée atteignent les meilleures marges nettes grâce à l'amortissement des charges fixes sur un chiffre d'affaires agrégé plus élevé.",
      },
      {
        q: "Comment calculer la vraie marge après commission de plateforme de livraison ?",
        a: "La marge nette plateforme se calcule en trois étapes. Exemple pour un burger à 14€ TTC vendu sur Uber Eats. Étape 1 — isoler le prix HT : 14€ TTC / 1,10 = 12,73€ HT (TVA 10% sur la nourriture). Étape 2 — déduire la commission : 12,73€ HT x (1 - 0,27) = 9,29€ encaissé réel HT. Étape 3 — soustraire le food cost : si le burger + emballage = 4,20€ de coût matière, la marge brute réelle est de 9,29 - 4,20 = 5,09€, soit 54,8% — très inférieure aux 70% théoriques calculés sans la commission. C'est pour cette raison que la grille tarifaire plateforme doit impérativement être supérieure de 20-25% au prix d'un restaurant classique : le même burger affiché à 17€ TTC donne 11,27€ encaissé, 11,27 - 4,20 = 7,07€ de marge brute, soit 62,7% — nettement plus tenable. RestauMargin calcule automatiquement la marge nette après commission pour chaque référence sur chaque plateforme (Uber Eats, Deliveroo, Just Eat) avec leur taux de commission respectif. Vous identifiez en un coup d'oeil quelles références sont réellement rentables en livraison et lesquelles doivent être retirées du menu plateforme ou retarifées.",
      },
      {
        q: "Comment gérer plusieurs marques depuis une même cuisine de production ?",
        a: "La gestion multi-marques est le principal défi opérationnel d'une dark kitchen. Sans outil dédié, il est impossible de connaître la rentabilité réelle de chaque marque : les ingrédients sont partagés, les charges de production sont mutualisées, et le food cost de chaque commande est noyé dans un coût global indifférencié. La méthode en 4 étapes pour piloter chaque marque indépendamment : (1) créer une entité indépendante par marque dans RestauMargin avec ses propres fiches techniques, sa propre grille tarifaire plateforme et ses propres objectifs de food cost — par exemple la marque burgers cible 30% de food cost, la marque tacos 28%, la marque bowls 26%, (2) intégrer les emballages dans chaque fiche technique de la marque concernée : une boîte burger rigide coûtant 0,45€ a un impact très différent sur un burger à 14€ (3,2%) et sur un bowl à 10€ (4,5%), (3) établir un budget de temps de production par marque si les cuisiniers travaillent sur plusieurs concepts en parallèle — le coût main-d'oeuvre imputable à chaque marque est un indicateur clé pour les décisions de scaling ou d'arrêt, (4) lire le dashboard marque-par-marque chaque semaine pour identifier les tendances : quelle marque monte en volume, laquelle sous-performe. RestauMargin permet de créer autant de marques virtuelles que nécessaire dans un seul compte, avec un dashboard consolidé et des vues par marque en un clic.",
      },
      {
        q: "RestauMargin convient-il aux dark kitchens en cuisine partagée et aux opérateurs multi-sites ?",
        a: "Oui, RestauMargin est particulièrement adapté aux dark kitchens en infrastructure partagée (opérateurs type Deliverect, Taster, Kitchen Club, ou cuisine centrale propre) et aux opérateurs qui gèrent plusieurs emplacements. Pour les cuisines partagées, RestauMargin gère les coûts de production partagés : vous définissez les charges fixes imputables à chaque marque (loyer prorata, énergie, personnel) et le logiciel calcule le point mort de chaque marque indépendamment — indispensable pour décider quand une nouvelle marque devient autoportante ou quand une marque sous-performante doit être arrêtée. Pour les opérateurs multi-sites (même marque dans 3 villes), la même offre permet de consolider les performances par marque et par site depuis un dashboard unique. La fonctionnalité multi-canal vous permet de comparer la rentabilité de chaque site sur Uber Eats vs Deliveroo vs commandes en direct (click & collect, site propre) et d'optimiser le mix canal pour maximiser la marge nette. Les dark kitchens qui complètent leur activité livraison par un service click & collect direct (zéro commission) ou une intégration caisse pour les commandes phone récupèrent 6 à 10 points de marge sur ces ventes. RestauMargin (19 €/mois, offre unique) couvre une dark kitchen avec jusqu'à 5 marques et 3 utilisateurs ; la même offre, sans supplément, convient aussi pour les opérateurs avec plus de 5 marques ou plusieurs sites de production.",
      },
    ],
  },
  'restaurant-halal': {
    slug: 'restaurant-halal',
    title: 'Calcul de marge restaurant halal : guide complet 2026',
    h1: 'Optimisez la marge de votre restaurant halal',
    tagline: 'Logiciel de gestion spécialisé pour restaurants halal et fast-foods halal',
    description: "Guide et outil pour calculer les marges de votre restaurant halal. Food cost viande halal certifiée, surcoût certification, gestion kebabs, grillades et tajines, et optimisation rentabilité par plat.",
    heroSubtitle: "La viande halal certifiée (agneau, boeuf, poulet) coûte 15 à 25% plus cher que son équivalent standard. Sans fiche technique précise, ce surcoût invisible ronge vos marges plat après plat. RestauMargin vous donne la maîtrise totale de votre food cost pour protéger votre rentabilité.",
    avgMargin: '62-72%',
    avgFoodCost: '28-35%',
    avgCoef: '3,2 à 4',
    challenges: [
      "Viande halal certifiée (agneau, boeuf, poulet) : 15-25% plus chère que l'équivalent standard — surcoût invisible sans fiche technique précise",
      "Traçabilité certifications fournisseurs : labels HCF, AVS, ARGML — vérification obligatoire pour maintenir la confiance client et éviter les scandales",
      "Volume élevé pour les produits phares (kebab, brochettes, tajines) : gestion FIFO viande crue critique pour limiter les pertes",
      "Livraison et plateformes : commissions 25-30% sur un food cost déjà élevé entre 28-35% — marge nette très serrée sans tarification adaptée",
      "Pression concurrentielle forte sur le segment fast-food halal : difficile d'augmenter les prix sans perdre des clients face aux concurrents",
    ],
    stats: [
      { label: 'Food cost moyen', value: '31%', color: 'teal' },
      { label: 'Marge brute cible', value: '69%', color: 'emerald' },
      { label: 'Surcoût viande halal', value: '+20%', color: 'amber' },
      { label: 'Ticket moyen', value: '12-20€', color: 'rose' },
    ],
    faqs: [
      {
        q: "Quelle est la marge moyenne d'un restaurant halal ?",
        a: "La marge brute d'un restaurant halal se situe entre 62% et 72%, selon le positionnement (fast-food, restaurant assis, grillade traditionnelle) et la maîtrise du food cost viande. Le principal défi structurel est le surcoût de la viande halal certifiée : l'agneau halal (label HCF ou AVS) s'affiche entre 14 et 22€/kg selon la coupe et l'origine, le boeuf haché halal entre 9 et 14€/kg, le poulet entier halal 5 à 8€/kg. Ces prix sont 15 à 25% supérieurs aux équivalents sans certification, ce qui tire mécaniquement le food cost vers le haut. Les restaurants halal qui atteignent 70-72% de marge brute maîtrisent trois leviers : fiches techniques précises par plat avec grammages contrôlés (notamment les pièces de viande), une carte équilibrée mêlant références nobles (agneau, boeuf) et références à fort coefficient (kefta, merguez, poulet rôti) qui compensent le food cost des plats premium, et une gestion stricte des pertes viande en fin de service. La marge nette après charges tourne entre 5% et 11% selon la taille de l'établissement, l'emplacement et le format.",
      },
      {
        q: "Comment calculer le food cost de la viande halal et de ses préparations ?",
        a: "Le calcul se fait composant par composant, en intégrant la viande, les épices maison et les accompagnements. Pour un kebab poulet sandwich : pain turc 90g (0,22€), escalope poulet halal 120g (0,78€ à 6,50€/kg), sauce blanche 30g (0,12€), crudités laitue-tomate-oignon 80g (0,14€), huile 0,06€ = 1,32€ de coût matière. Vendu 7€, food cost de 18,9% — excellent. Pour une assiette tajine agneau-pruneaux : agneau épaule halal 180g (3,42€ à 19€/kg), légumes courgettes-carottes-oignons 200g (0,40€), pruneaux 40g (0,28€), amandes 15g (0,18€), épices ras-el-hanout (0,08€), couscous 150g (0,18€) = 4,54€. Vendue 17€, food cost de 26,7%. Pour une brochette kefta 3 pièces : boeuf haché halal 240g (2,64€ à 11€/kg), épices et herbes (0,12€), pain pita (0,18€), sauce harissa (0,06€) = 3,00€. Vendue 13€, food cost de 23,1%. RestauMargin automatise ce calcul : renseignez une fois vos prix fournisseurs viande halal, et toutes vos fiches techniques se mettent à jour en temps réel quand le cours de l'agneau ou du boeuf change.",
      },
      {
        q: "Comment absorber le surcoût de la viande halal sans sacrifier la rentabilité ni perdre des clients ?",
        a: "Le surcoût de la certification halal est une réalité structurelle qui ne disparaîtra pas. Quatre stratégies pour maintenir la rentabilité sans baisser la qualité : (1) équilibrer la carte avec des plats à fort coefficient naturel — les préparations à base de kefta, merguez ou poulet aile (food cost 20-25%) compensent les plats à l'agneau noble (food cost 28-35%) ; la carte doit être construite avec une vision globale de la marge composite, (2) contrôler les grammages au gramme près et imposer un pesage systématique avant cuisson — RestauMargin permet de définir le grammage cible par pièce et d'alerter si le coût matière d'une commande dépasse le seuil, (3) valoriser la certification halal comme argument premium : un restaurateur qui affiche ses labels HCF ou AVS, sa traçabilité fournisseur et ses normes de préparation peut positionner un prix légèrement supérieur à la moyenne du quartier en le justifiant par la qualité et la confiance client, (4) négocier des volumes avec un grossiste halal spécialisé (Bahia Foods, Reghalal, Metro halal) : un contrat de volume sur le poulet ou l'agneau peut faire baisser le coût unitaire de 8 à 12% et compenser une partie du surcoût certification. RestauMargin vous permet de simuler l'impact d'une hausse de prix fournisseur sur l'ensemble de votre carte en quelques secondes.",
      },
      {
        q: "RestauMargin convient-il aux restaurants halal avec livraison, comptoir kebab rapide et événementiel ?",
        a: "Oui, RestauMargin est particulièrement adapté aux restaurants halal qui cumulent plusieurs activités : restauration sur place avec une carte de plats traditionnels (tajines, couscous, grillades), un comptoir kebab-sandwichs pour le flux rapide du midi, une activité de livraison sur plateformes (Uber Eats, Deliveroo, Just Eat) et parfois une activité traiteur pour les événements familiaux ou religieux (mariages, fêtes de l'Aid). Pour le comptoir rapide, les fiches techniques kebab avec grammages standardisés permettent d'homogénéiser la préparation entre les employés et d'éviter le surdosage. Pour la livraison, le module calcul-commission simule la marge nette après déduction des commissions plateforme (27-30%) pour chaque référence : vous identifiez quels plats sont rentables en livraison et quels prix fixer pour absorber la commission sans sacrifier la marge. Pour le traiteur événementiel (buffets de mariage halal, plateaux-repas Aid), la fonctionnalité de fiche technique composite calcule le coût par convive en intégrant viandes, accompagnements, pâtisseries orientales et packaging. RestauMargin (19 €/mois, offre unique) couvre un restaurant halal avec jusqu'à 100 références et 3 utilisateurs ; la même offre, sans supplément, convient aussi pour les établissements avec plusieurs comptoirs ou une cuisine centrale de production traiteur.",
      },
    ],
  },
  'bistro-gastronomique': {
    slug: 'bistro-gastronomique',
    title: 'Calcul de marge bistro gastronomique : guide complet 2026',
    h1: 'Optimisez la marge de votre bistro gastronomique',
    tagline: 'Logiciel de gestion pour bistronomie et restaurants bistrots gastronomiques',
    description: "Guide et outil pour calculer les marges de votre bistro gastronomique. Food cost produits du terroir, marge par menu dégustation courte, gestion de la bistronomie et optimisation prix de vente.",
    heroSubtitle: "La bistronomie : la cuisine gastronomique au prix du bistrot. Des produits nobles, une carte courte et une marge qui se joue au gramme près. RestauMargin vous donne la précision des grandes tables avec la simplicité d'un outil pensé pour les chefs indépendants.",
    avgMargin: '66-74%',
    avgFoodCost: '28-34%',
    avgCoef: '3,2 à 4',
    challenges: [
      "Produits de saison et du terroir : prix qui varient chaque semaine selon les arrivages et la météo",
      "Carte courte (4 à 8 plats par section) : chaque plat doit être rentable — pas de dilution possible avec une carte large",
      "Main-d'oeuvre qualifiée : brigade réduite mais cuisiniers expérimentés — masse salariale élevée (35-45% du CA)",
      "Menu unique ou formule courte : si un plat ne s'écoule pas, le gaspillage impacte directement le food cost journalier",
      "Positionnement délicat entre bistrot accessible et gastronomie premium : une hausse de prix peut faire fuir la clientèle fidélisée",
    ],
    stats: [
      { label: 'Food cost moyen', value: '31%', color: 'teal' },
      { label: 'Marge brute cible', value: '70%', color: 'emerald' },
      { label: 'Coefficient type', value: '3,6x', color: 'amber' },
      { label: 'Ticket moyen', value: '35-60€', color: 'rose' },
    ],
    faqs: [
      {
        q: "Quelle est la marge moyenne d'un bistro gastronomique ?",
        a: "La marge brute d'un bistro gastronomique se situe entre 66% et 74%, positionnée entre le bistrot traditionnel (68-73%) et le restaurant gastronomique étoilé (65-70%). Cette marge est obtenue grâce à un ticket moyen plus élevé (35-60€) qui permet d'absorber le food cost de produits de qualité supérieure (viandes de race, poissons nobles, légumes du maraîcher local) tout en maintenant des prix inférieurs à la grande gastronomie. Les bistros gastronomiques les plus rentables partagent trois caractéristiques : une carte très courte (12 à 18 références maximum) avec des fiches techniques maîtrisées au gramme près, une gestion rigoureuse des prévisions de couverts pour limiter les achats de produits frais non utilisés, et un approvisionnement direct producteurs qui permet de réduire le coût matière de 10 à 20% par rapport aux grossistes classiques. La marge nette après charges (loyer, brigade qualifiée, énergie) oscille entre 6% et 12% — supérieure au restaurant gastronomique traditionnel grâce à des charges de personnel proportionnellement plus faibles (brigade de 2 à 4 cuisiniers vs 8 à 15 en gastronomie).",
      },
      {
        q: "Comment calculer le food cost des plats du terroir et produits de saison ?",
        a: "Le calcul des produits de saison exige une mise à jour hebdomadaire des prix fournisseurs, car un cardon ou un saint-pierre peut varier de 30% en quelques jours selon la pêche ou la récolte. La méthode en 4 étapes : (1) créer une fiche technique de référence par plat avec grammages fixes et prix d'achat moyen sur la saison, (2) mettre à jour le prix des ingrédients volatils (poissons, champignons sauvages, légumes primeurs) chaque semaine via la mercuriale fournisseur de RestauMargin — les fiches techniques se mettent à jour automatiquement et alertent si le food cost dépasse votre seuil cible, (3) calculer un prix de vente plancher (prix de vente minimum pour conserver la marge cible) qui sert de garde-fou si les prix s'envolent en cours de saison, (4) évaluer à chaque changement de carte si le plat reste rentable au nouveau prix d'achat ou s'il faut l'ajuster ou le retirer. Exemple : un dos de cabillaud 180g vendu 24€ HT à 6,80€/kg (1,22€ de matière poisson) atteint facilement un food cost de 22% avec les légumes et la sauce. Si le cabillaud monte à 11€/kg (1,98€ de matière), le food cost grimpe à 32% — RestauMargin vous alerte instantanément et vous propose de recalculer le prix de vente optimal.",
      },
      {
        q: "Comment équilibrer la marge sur une carte courte sans augmenter les prix ?",
        a: "Une carte courte offre moins de levier de compensation entre plats : chaque référence doit porter son propre poids en marge. Trois stratégies adaptées à la bistronomie : (1) construire la carte avec un mix délibéré entre pièces nobles à fort ticket (côte de boeuf maturée, Saint-Jacques en saison, langoustines) qui ancrent le positionnement premium mais acceptent un food cost plus élevé (28-34%), et préparations à forte valeur ajoutée avec des ingrédients accessibles (terrine maison, oeuf parfait et truffe en petite quantité, risotto de la mer) qui affichent un food cost de 18-25% et équilibrent la marge globale, (2) valoriser le travail et la technique plutôt que la matière première — un tartare de légumes du jardin bien travaillé peut se vendre 16€ avec 2,80€ de coût matière (17,5% de food cost) sans que le client ne perçoive une asymétrie qualité-prix, (3) proposer une formule midi courte (entrée + plat ou plat + dessert à 22-28€) avec des preparationsreutilisant les parures et surplus du soir — cette pratique réduit le gaspillage et crée un flux de clientèle supplémentaire avec un food cost maîtrisé. RestauMargin analyse votre carte et identifie les plats qui tirent la marge globale vers le bas, avec des suggestions d'ajustement de grammage ou de prix pour atteindre votre objectif.",
      },
      {
        q: "RestauMargin convient-il aux bistros gastronomiques avec menu dégustation courte ?",
        a: "Oui, RestauMargin est particulièrement adapté au format bistronomique avec menu dégustation courte (4 à 6 plats) et carte à la carte réduite. Pour les menus dégustation, vous créez une fiche technique composite : chaque plat du menu est saisi séparément avec ses propres ingrédients et grammages, puis regroupé dans un menu global. RestauMargin calcule la marge du menu complet, le food cost par plat et le coût total par convive, en intégrant les boissons accordées si vous proposez un accord mets-vins. Vous voyez immédiatement si le menu est équilibré ou si un plat plombe la rentabilité de l'ensemble. Pour la gestion des produits nobles qui entrent dans vos préparations (truffes, homard, ris de veau), le module de suivi des pertes et des rendements vous permet de calculer le coût réel après parage — indispensable quand 30% du poids brut d'un ris de veau ou d'un homard est perdu à la préparation. RestauMargin (19 €/mois, offre unique) est adapté pour un bistro gastronomique avec une carte de 20 à 40 références et 2 utilisateurs (chef + second). La même offre, sans supplément, convient aussi si vous gérez deux établissements ou une table gastronomique avec cave à vins séparée.",
      },
    ],
  },
  'restaurant-seminaire-groupe': {
    slug: 'restaurant-seminaire-groupe',
    title: 'Calcul de marge restaurant séminaire et groupe : guide complet 2026',
    h1: 'Optimisez la marge de votre restaurant séminaire et groupe',
    tagline: 'Logiciel de gestion spécialisé pour restaurants groupes, séminaires et banquets',
    description: "Guide et outil pour calculer les marges de votre restaurant séminaire et groupe. Food cost par convive, tarification menus groupe, marge buffets et banquets, gestion des formules séminaires et optimisation de la rentabilité par prestation.",
    heroSubtitle: "Un menu groupe à 4,20€ de matière par convive facturé 38€ : théoriquement 89% de marge brute. Mais sans fiche technique par formule et sans suivi du gaspillage sur 80 couverts, la rentabilité s'évapore. RestauMargin vous donne la maîtrise totale de votre marge banquet par banquet.",
    avgMargin: '65-74%',
    avgFoodCost: '26-35%',
    avgCoef: '3,5 à 4,5',
    challenges: [
      "Tarification groupe négociée en amont : calculer la marge sans fiche technique = accepter des contrats à perte sans le savoir",
      "Volumes importants — le gaspillage sur 80 à 200 couverts est démultiplié : 5% de perte en assiettage représentent 8 à 15€ de matière par personne perdue",
      "Boissons à volonté incluses dans les formules séminaires : food cost drinks difficile à maîtriser, certains groupes consomment 3x plus que les prévisions",
      "Standards de service en banquet différents de la carte : grammages, modes de cuisson, mise en place — fiches techniques spécifiques groupe indispensables",
      "Saisonnalité prononcée des séminaires — pic janvier-juin et septembre-novembre, creux estival : gestion des coûts fixes sur les périodes creuses",
    ],
    stats: [
      { label: 'Food cost moyen', value: '30%', color: 'teal' },
      { label: 'Marge brute cible', value: '70%', color: 'emerald' },
      { label: 'Coefficient type', value: '4x', color: 'amber' },
      { label: 'Ticket moyen convive', value: '35-75€', color: 'rose' },
    ],
    faqs: [
      {
        q: "Quelle est la marge moyenne d'un restaurant spécialisé séminaires et groupes ?",
        a: "La marge brute d'un restaurant séminaire et groupe se situe entre 65% et 74%, avec une forte disparité selon le type de prestation : les cocktails debout (food cost 22-26%) et les buffets dîner de gala (food cost 24-30%) sont les formats les plus rentables, tandis que les menus servis à table avec boissons comprises (food cost 30-35%) offrent une marge plus étroite mais un ticket convive plus élevé (55-75€ vs 35-45€ pour un cocktail). Les restaurants séminaires qui atteignent 72-74% de marge brute maîtrisent trois leviers : (1) fiches techniques précises par format de prestation (formule séminaire half-day, full-day, dîner de gala, team building avec repas) avec calcul du food cost par convive intégrant les ratios de perte, (2) tarification des boissons séparée du forfait alimentaire ou plafonnement du ratio de consommation par convive, (3) système de devis avec calcul de marge nette en temps réel intégrant les coûts de main-d'oeuvre renforcé et de logistique. La marge nette après charges (brigade banquet, vaisselle, lingerie, salle) oscille entre 8% et 16% selon le taux de remplissage annuel et la capacité à alterner groupes séminaires, mariages et événements grands publics.",
      },
      {
        q: "Comment calculer le food cost d'un menu groupe ou d'une formule séminaire ?",
        a: "Le calcul se fait par convive, en décomposant chaque plat ou composant du menu. Pour une formule séminaire full-day avec déjeuner 3 services : accueil matin (café, jus, viennoiseries) 0,85€/pers, déjeuner entrée (salade composée) 1,10€/pers, plat (poulet rôtis et légumes de saison) 2,40€/pers, dessert (buffet desserts) 0,90€/pers, eau et soft à table 0,60€/pers, pause après-midi (café, thé, fruits) 0,55€/pers = 6,40€ de coût matière brute par convive. Avec un ratio de perte de 12% sur les buffets (pièces non consommées, restes) = 7,17€ réel. Facturé 38€ HT par convive (full-day hors salle), le food cost est de 18,9% — excellent. Pour un dîner de gala avec vin inclus : food cost alimentaire 8-12€ par convive + boissons (vins, champagne) 6-10€ = 14-22€ de coût matière total, pour un prix de vente de 65-90€ HT, soit 22-30% de food cost. RestauMargin permet de créer une fiche technique composite par type de prestation : vous définissez une fois les composants et les quantités par convive, le logiciel calcule automatiquement le coût total et le food cost pour n'importe quel effectif de groupe.",
      },
      {
        q: "Comment maîtriser le food cost des boissons à volonté dans les formules groupe ?",
        a: "Les boissons à volonté (open bar, boissons comprises) sont la principale variable incontrôlable dans la tarification groupe : certains séminaires consomment 1,5 verre de vin par convive, d'autres en sont à 3. Sans ratio de référence, il est impossible de calculer la marge réelle du contrat à l'avance. La méthode en 4 étapes pour reprendre le contrôle : (1) tracker systématiquement la consommation réelle de boissons par convive sur chaque prestation — RestauMargin intègre un module de saisie des consommations groupe en fin de service qui alimente votre historique, (2) définir un ratio standard de consommation par type de groupe et par formule (ex : séminaire entreprise mid-market = 0,75 bouteille vin/table de 10 + 3 softs/convive ; dîner de gala festif = 1,2 bouteille/table + champagne accueil) basé sur vos 12 derniers mois de données, (3) intégrer ce ratio directement dans vos fiches techniques de prestation pour que le food cost boissons soit capturé dans le devis, (4) proposer deux versions de formule : boissons comprises avec plafond explicite (ex : 1/3 de bouteille de vin et 1 soft par convive, champagne supplémentaire en option) et formule boissons consommées avec majoration forfait. RestauMargin vous permet de simuler l'impact d'une consommation boissons plus élevée que prévu sur la marge nette du contrat, et de fixer le prix de vente groupe avec une marge de sécurité intégrée.",
      },
      {
        q: "RestauMargin convient-il aux restaurants qui gèrent à la fois le service à la carte et les groupes ?",
        a: "Oui, RestauMargin est particulièrement adapté aux restaurants hybrides qui cumulent un service à la carte (soir ou midi individuel) et une activité groupe-séminaires. Ces établissements ont deux logiques de marge très différentes à gérer en parallèle : le service carte avec des fiches techniques recette par recette et une marge par plat, et le service groupe avec des fiches techniques par prestation et une marge par convive. Le dashboard multi-catégorie RestauMargin vous montre la marge de chaque canal séparément : service carte vs prestations groupe, avec le food cost et la marge brute pour chaque segment sur la période choisie. Vous identifiez immédiatement lequel est le moteur de votre rentabilité et pouvez arbitrer votre stratégie commerciale — certains restaurateurs découvrent que les groupes, malgré un prix convive moins élevé, sont plus rentables que le service carte grâce à la préparation en volume et à l'absence de no-shows. Pour les restaurants avec une salle modulable (banquet ou service individuel), RestauMargin gère la double fiche technique — carte et groupe — sur les mêmes ingrédients et fournisseurs, ce qui évite la double saisie. RestauMargin (19 €/mois, offre unique) couvre les besoins d'un restaurant avec 2 à 3 formules groupe et une carte de 40 à 60 références ; la même offre, sans supplément, convient aussi pour les hôtels-restaurants avec une capacité banquet supérieure à 150 couverts et plusieurs espaces séminaires indépendants.",
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
    <div className="min-h-screen bg-white">
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
      <PublicHeader />

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
          Les enjeux spécifiques de votre {config.slug.replace('-', ' ')}
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
          Comment RestauMargin répond à ces enjeux
        </h2>
        <p className="text-center text-mono-400 mb-10 max-w-2xl mx-auto">
          Un outil pensé pour les contraintes réelles du terrain, pas un ERP compliqué.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: Calculator, title: 'Calcul de marge en temps réel', text: 'Dashboard qui montre la marge de chaque plat, filtrable par service ou catégorie.' },
            { icon: Scale, title: 'Station de pesée connectée', text: 'Pesez directement vos ingrédients, grammages sauvegardés automatiquement dans la fiche technique.' },
            { icon: BarChart3, title: 'Analyses IA automatiques', text: 'Alertes anomalies (food cost trop élevé), suggestions d\'optimisation plat par plat.' },
            { icon: Shield, title: 'HACCP intégré', text: 'Traçabilité lots, températures, allergènes. Conforme aux contrôles sanitaires.' },
            { icon: TrendingUp, title: 'Menu Engineering', text: 'Classification Boston Matrix : plats vedettes, puzzles, plow-horses, dogs. Optimisez la carte.' },
            { icon: Euro, title: 'Tarifs accessibles', text: 'Une seule offre : 19 €/mois, toutes les fonctionnalités. Sans engagement. Essai gratuit 7 jours.' },
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

      {/* Testimonial — rendu seulement s'il existe un temoignage reel. */}
      {config.testimonial && (
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
      )}

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 max-w-3xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-black text-mono-100 mb-8 text-center"
         
        >
          Questions fréquentes
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
            Ne perdez plus de marge sur votre {config.slug.replace(/-/g, ' ')}
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
              {n.slug.replace(/-/g, ' ')}
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
