import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChefHat,
  Search,
  BookOpen,
  ArrowRight,
  Calculator,
  CheckCircle,
  Sparkles,
  Download,
  Lightbulb,
  TrendingUp,
  Star,
  ListChecks,
} from 'lucide-react';
import SEOHead, { buildBreadcrumbSchema } from '../components/SEOHead';

/* ═══════════════════════════════════════════════════════════════
   GlossaireRestauration — Glossaire 60+ termes restauration
   Mots-clés long-tail : "définition food cost", "qu'est-ce que le
   prime cost", "qu'est-ce qu'une fiche technique restaurant", etc.
   ~5500 mots — fond blanc, theme W&B teal-600
   ═══════════════════════════════════════════════════════════════ */

type Term = {
  letter: string;
  name: string;
  shortDef: string;
  long: string;
  link?: { to: string; label: string };
};

const TERMS: Term[] = [
  // A
  {
    letter: 'A',
    name: 'Affichage des allergènes',
    shortDef: "Obligation légale d'indiquer en cuisine et sur la carte les 14 allergènes majeurs.",
    long: "Depuis le règlement européen INCO 1169/2011, tout restaurant doit afficher la présence éventuelle des 14 allergènes majeurs (gluten, crustacés, œufs, poisson, arachides, soja, lait, fruits à coque, céleri, moutarde, sésame, sulfites, lupin, mollusques) sur l'ensemble de ses plats. Un défaut d'affichage expose à 1 500 EUR d'amende par infraction. Une matrice allergènes par plat est aujourd'hui la pratique standard.",
    link: { to: '/blog/allergenes-restaurant-obligations-legales', label: 'Allergenes en restauration : guide complet' },
  },
  {
    letter: 'A',
    name: 'AGEC (loi)',
    shortDef: "Loi anti-gaspillage pour une économie circulaire (2020) : doggy bag, vrac, fin du plastique à usage unique.",
    long: "La loi AGEC oblige les restaurants à proposer un contenant pour emporter les restes (doggy bag), interdit le polystyrène, impose la vaisselle réutilisable pour la consommation sur place dans les chaînes de plus de 20 couverts et impose un diagnostic anti-gaspillage. Non-respect : jusqu'à 75 000 EUR d'amende pour une personne morale.",
    link: { to: '/blog/gaspillage-alimentaire', label: 'Reduire le gaspillage alimentaire' },
  },
  {
    letter: 'A',
    name: 'AOP / IGP',
    shortDef: "Appellation d'Origine Protégée / Indication Géographique Protégée — labels d'origine européens.",
    long: "L'AOP garantit que toutes les étapes de fabrication (production, transformation, élaboration) sont réalisées dans la zone géographique d'origine, avec un savoir-faire reconnu. L'IGP demande qu'au moins une étape soit liée à la zone. En restauration, mentionner ces labels sur la carte augmente le prix perçu de 10 à 20 % et justifie un coefficient multiplicateur plus élevé.",
  },
  {
    letter: 'A',
    name: 'Apéritif',
    shortDef: "Phase de service avant le repas — boissons et amuse-bouches.",
    long: "L'apéritif représente 15 à 25 % du ticket moyen en restauration traditionnelle. Sa marge brute dépasse souvent 80 % (cocktails, vins au verre). Le proposer systématiquement et avec un suggestive selling clair (3 propositions max) est un des leviers les plus puissants pour augmenter le ticket moyen sans toucher aux prix de la carte.",
    link: { to: '/blog/augmenter-ticket-moyen-restaurant', label: 'Augmenter son ticket moyen restaurant' },
  },

  // B
  {
    letter: 'B',
    name: 'Benchmark',
    shortDef: 'Comparaison de ses ratios (food cost, marge, ticket moyen) à la moyenne de son segment.',
    long: "Un food cost à 33 % n'a pas la même signification pour une pizzeria (objectif 22-25 %) ou un restaurant gastronomique (objectif 35-40 %). Le benchmarking consiste à comparer ses indicateurs aux fourchettes cibles de son segment précis. C'est un préalable à toute décision de pricing ou de réduction de coûts.",
    link: { to: '/blog/kpi-essentiels-restaurateur', label: 'KPI essentiels du restaurateur' },
  },
  {
    letter: 'B',
    name: 'Brigade',
    shortDef: 'Organisation hiérarchique de la cuisine (chef, second, chef de partie, commis, etc.).',
    long: "Le système de brigade codifié par Auguste Escoffier reste la base de l'organisation des cuisines : chef de cuisine → second de cuisine → chefs de partie (sauces, poissons, garde-manger, pâtisserie) → demi-chef de partie → commis → apprentis. En restauration moderne, la brigade est souvent simplifiée à 3-4 postes pour réduire le ratio personnel.",
  },
  {
    letter: 'B',
    name: 'Brunch',
    shortDef: "Service hybride petit-déjeuner / déjeuner, généralement le week-end.",
    long: "Le brunch est devenu un format incontournable : ticket moyen 25 à 45 EUR, food cost maîtrisé (œufs, pancakes, viennoiseries — matières premières peu chères), service rapide. Il permet d'occuper un créneau (11h-15h le week-end) souvent creux pour la restauration traditionnelle.",
  },
  {
    letter: 'B',
    name: 'Buffet',
    shortDef: 'Service en libre-service à volonté ou à prix fixe.',
    long: "Le buffet impose une gestion stricte du gaspillage : il faut viser un food cost de 28 à 33 % en intégrant la perte (5 à 10 %). Les buffets à thème (asiatique, brésilien) permettent un ticket moyen plus élevé. La rotation rapide (60-90 min) est essentielle pour la rentabilité.",
  },

  // C
  {
    letter: 'C',
    name: 'CA HT / TTC',
    shortDef: 'Chiffre d\'affaires Hors Taxes / Toutes Taxes Comprises.',
    long: "Le CA HT est le seul indicateur pertinent pour calculer marges, food cost et ratios. En restauration en France, la TVA sur place est de 10 % (5,5 % pour la vente à emporter de plats préparés froids, 20 % sur les boissons alcoolisées). Calculer son food cost sur le CA TTC fausse tout le ratio.",
    link: { to: '/blog/chiffre-affaires-restaurant-comment-calculer', label: 'Calculer son chiffre d\'affaires restaurant' },
  },
  {
    letter: 'C',
    name: 'Cave (sommelier)',
    shortDef: "Stock de vins, gestion par un sommelier ou un cellier maître.",
    long: "Une cave bien gérée représente 15 à 30 % du CA d'un restaurant traditionnel et offre une marge brute de 65 à 75 %. Une rotation des stocks adaptée (FIFO sur les blancs, repos sur les rouges de garde) et une carte cohérente avec les plats sont les deux piliers d'une cave rentable.",
    link: { to: '/blog/construire-carte-vins-restaurant', label: 'Construire une carte des vins' },
  },
  {
    letter: 'C',
    name: 'Charges sociales',
    shortDef: 'Cotisations patronales et salariales sur les salaires (env. 42 % côté employeur en HCR).',
    long: "En convention HCR, les charges patronales représentent 38 à 42 % du salaire brut. Pour 1 EUR de salaire net versé, l'employeur paie environ 1,80 à 2 EUR. C'est pourquoi le ratio personnel doit être calculé sur le coût total (brut + charges) et non sur le brut seul.",
    link: { to: '/blog/charges-sociales-restauration', label: 'Charges sociales en restauration' },
  },
  {
    letter: 'C',
    name: 'Chef de partie',
    shortDef: "Cuisinier responsable d'une partie spécifique (sauces, garnitures, viandes, etc.).",
    long: "Le chef de partie supervise une station de cuisine. Salaire moyen : 2 200 à 2 800 EUR brut. La spécialisation (saucier, poissonnier, garde-manger) permet une montée en gamme du restaurant et un meilleur food cost par maîtrise technique des produits nobles.",
  },
  {
    letter: 'C',
    name: 'Coefficient multiplicateur',
    shortDef: "Rapport entre le prix de vente HT et le coût matières (PV / CM).",
    long: "Pour un food cost cible de 30 %, le coefficient multiplicateur est de 1 / 0,30 = 3,33. On multiplie donc le coût matières d'un plat par 3,33 pour obtenir le prix de vente HT. Coefficient typique : 3 (pizzeria), 3,5 à 4 (restaurant traditionnel), 4 à 5 (gastronomique).",
    link: { to: '/blog/coefficient-multiplicateur', label: 'Coefficient multiplicateur restaurant' },
  },
  {
    letter: 'C',
    name: 'Convention HCR',
    shortDef: "Convention Collective Nationale des Hôtels, Cafés, Restaurants (IDCC 1979).",
    long: "La convention HCR régit les contrats de travail, salaires minimums, durée du travail (39h sur 4 semaines en moyenne) et avantages (2 jours de repos consécutifs, prime de coupure, indemnité repas) pour la majorité des restaurants. Tout établissement de restauration commerciale y est soumis automatiquement.",
    link: { to: '/blog/contrat-travail-restauration-guide', label: 'Contrat de travail restauration' },
  },
  {
    letter: 'C',
    name: 'Couvert',
    shortDef: 'Unité de mesure : 1 client = 1 couvert servi.',
    long: "Le nombre de couverts est l'unité de base pour calculer le ticket moyen (CA / couverts), la productivité (couverts par heure travaillée) et le taux d'occupation (couverts servis / capacité maximale). Un service midi de 40 couverts avec un ticket moyen de 22 EUR génère 880 EUR de CA.",
  },
  {
    letter: 'C',
    name: 'Coût de revient',
    shortDef: 'Somme de tous les coûts directs et indirects nécessaires à la production d\'un plat.',
    long: "Le coût de revient intègre : matières premières + part de main-d'œuvre productive + part des charges fixes (loyer, énergie, amortissement). Il est différent et plus complet que le simple coût matières. Pour un plat à 18 EUR de PV : coût matières 5,40 + main-d'œuvre 2 + charges 3 = coût de revient 10,40 EUR.",
    link: { to: '/blog/cout-revient-plat-restaurant', label: 'Calcul du cout de revient d\'un plat' },
  },
  {
    letter: 'C',
    name: 'Coût matières premières',
    shortDef: "Coût des ingrédients d'un plat (food cost en valeur).",
    long: "Le coût matières inclut tous les ingrédients d'une recette : produits principaux, garniture, sauce, huile de cuisson, épices, herbes. Il faut intégrer les rendements (1 kg de carottes brutes = 800 g utiles) pour ne pas sous-estimer. C'est la base du calcul du food cost (%).",
    link: { to: '/blog/calcul-marge-restaurant', label: 'Calcul de la marge restaurant' },
  },
  {
    letter: 'C',
    name: 'Couverts servis',
    shortDef: "Nombre total de clients sur une période donnée (jour, semaine, mois).",
    long: "Suivre les couverts servis par jour, par service et par catégorie (sur place, livraison, emporter) permet de mesurer l'occupation, identifier les services creux et planifier le staffing. Un restaurant de 60 places assises devrait viser 1,5 à 2 rotations par service pour être rentable.",
    link: { to: '/blog/taux-occupation-restaurant', label: 'Taux d\'occupation restaurant' },
  },

  // D
  {
    letter: 'D',
    name: 'Dark kitchen',
    shortDef: "Restaurant sans salle, dédié à la livraison via plateformes (UberEats, Deliveroo).",
    long: "La dark kitchen (ou ghost kitchen, virtual restaurant) réduit drastiquement les coûts fixes : pas de salle, pas de service, loyer 60 % moins cher. Mais les commissions plateformes (25 à 35 %) écrasent la marge. Il faut viser un food cost à 25 % et un ticket moyen supérieur à 18 EUR pour rester rentable.",
    link: { to: '/logiciel-marge-dark-kitchen', label: 'Logiciel marge dark kitchen' },
  },
  {
    letter: 'D',
    name: 'DLC / DDM',
    shortDef: "Date Limite de Consommation / Date de Durabilité Minimale.",
    long: "La DLC (mention 'à consommer jusqu'au...') est impérative — au-delà, le produit ne doit pas être servi (risque sanitaire). La DDM (mention 'à consommer de préférence avant le...') est indicative — le produit reste consommable au-delà s'il n'est pas altéré. La DLC concerne les produits sensibles (viandes, poissons, produits laitiers).",
    link: { to: '/blog/haccp-restaurant', label: 'HACCP en restauration' },
  },
  {
    letter: 'D',
    name: 'Drive',
    shortDef: "Service où le client commande et récupère son repas en voiture, sans descendre.",
    long: "Le drive représente 30 à 50 % du CA des fast-foods. Il maximise la productivité (1 client = 2 à 3 minutes) et permet d'augmenter les couverts servis sans agrandir la salle. Le ticket moyen drive est généralement 10 % inférieur au sur place mais le volume compense largement.",
  },

  // E
  {
    letter: 'E',
    name: 'Économies d\'échelle',
    shortDef: "Réduction du coût unitaire grâce à un volume d'achat ou de production supérieur.",
    long: "Acheter 50 kg de bavette à la fois plutôt que 5 kg permet d'obtenir un meilleur prix au kilo (15 % moins cher en moyenne). De même, mutualiser les commandes entre plusieurs restaurants d'un même groupe peut faire baisser le food cost de 2 à 4 points. À combiner avec la conservation sous vide pour ne pas accroître la perte.",
  },
  {
    letter: 'E',
    name: 'EBE (Excédent Brut d\'Exploitation)',
    shortDef: "Indicateur de rentabilité : CA - coûts d'exploitation (hors amortissements et financiers).",
    long: "L'EBE est le bénéfice généré par l'activité elle-même, avant amortissements et frais financiers. Formule : EBE = Valeur ajoutée + subventions - impôts et taxes - charges de personnel. Un EBE/CA inférieur à 10 % en restauration indique une rentabilité fragile.",
  },
  {
    letter: 'E',
    name: 'EBITDA',
    shortDef: "Earnings Before Interest, Taxes, Depreciation, and Amortization — proche de l'EBE.",
    long: "L'EBITDA est l'équivalent anglo-saxon de l'EBE, utilisé pour comparer des entreprises de pays différents ou évaluer la valorisation lors d'une revente. Multiple EBITDA typique en restauration : 4x à 8x selon la taille et la marque. C'est l'indicateur clé en M&A.",
  },
  {
    letter: 'E',
    name: 'EPI',
    shortDef: 'Équipement de Protection Individuelle (gants, charlotte, chaussures de sécurité).',
    long: "L'employeur doit fournir gratuitement les EPI : gants jetables pour la manipulation des denrées, charlotte pour les cheveux, tablier, chaussures antidérapantes en cuisine, blouse pour la pâtisserie. C'est une obligation HACCP et une protection contre les contaminations croisées.",
  },

  // F
  {
    letter: 'F',
    name: 'FIFO',
    shortDef: 'First In, First Out — premier entré, premier sorti. Méthode de rotation des stocks.',
    long: "Le FIFO consiste à consommer les produits les plus anciens en premier, évitant le gaspillage par péremption. Pour l'appliquer : rangement chronologique (anciens devant, nouveaux derrière), étiquetage systématique des dates de réception, contrôle quotidien des DLC.",
    link: { to: '/blog/methode-fifo-gestion-stocks-restaurant', label: 'Méthode FIFO en restaurant' },
  },
  {
    letter: 'F',
    name: 'Fiche technique',
    shortDef: 'Document détaillant ingrédients, grammages, coûts, temps et procédé d\'un plat.',
    long: "La fiche technique est la colonne vertébrale de la rentabilité d'un restaurant. Elle contient : liste des ingrédients avec grammages précis, prix unitaires, coût matières total, prix de vente HT/TTC, food cost, marge brute, photo, temps de préparation. Sans fiche technique, impossible de calculer la marge ni de standardiser la production.",
    link: { to: '/blog/fiche-technique-restaurant', label: 'Créer une fiche technique restaurant' },
  },
  {
    letter: 'F',
    name: 'Food cost',
    shortDef: 'Coût matières exprimé en % du prix de vente HT.',
    long: "Le food cost est l'indicateur le plus utilisé en restauration. Formule : Food cost (%) = (Coût matières / Prix de vente HT) × 100. Fourchettes cibles : pizzeria 22-25 %, restaurant traditionnel 28-33 %, gastronomique 35-40 %, fast food 30-32 %. Un food cost qui dérive de 2 points peut faire disparaître toute la marge nette.",
    link: { to: '/blog/reduire-food-cost', label: 'Reduire son food cost' },
  },
  {
    letter: 'F',
    name: 'Food truck',
    shortDef: 'Camion-restaurant mobile servant des plats sur la voie publique ou en événementiel.',
    long: "Le food truck a un investissement initial réduit (40 à 80 K EUR) mais nécessite une licence d'occupation du domaine public. Food cost cible : 30 à 35 %. Modèle économique : zones de bureau le midi, marchés le week-end, événementiel. Marge nette réelle : 8 à 15 % après amortissement du véhicule.",
    link: { to: '/blog/ouvrir-food-truck-france-guide', label: 'Ouvrir un food truck' },
  },
  {
    letter: 'F',
    name: 'Fournisseur',
    shortDef: 'Entreprise qui livre les produits alimentaires, boissons, équipements ou consommables.',
    long: "Un restaurant traite avec 8 à 15 fournisseurs en moyenne : grossiste alimentaire (Metro, Promocash), boucher, primeur, poissonnier, fournisseur de vins, brasseur, fournisseur de produits d'entretien. La négociation annuelle des conditions (remises de volume, délais de paiement) peut faire gagner 3 à 5 points de food cost.",
  },

  // G
  {
    letter: 'G',
    name: 'Gaspillage alimentaire',
    shortDef: 'Pertes de matières premières (péremption, surproduction, déchets de préparation).',
    long: "Le gaspillage représente en moyenne 6 à 9 % du coût matières d'un restaurant, soit 1,5 à 3 points de food cost. Trois sources principales : préparation (épluchures, parures), production (surproduction), service (assiettes non finies). Pesée hebdomadaire des poubelles + analyse FIFO + ajustement des portions = -50 % de gaspillage en 3 mois.",
    link: { to: '/blog/gaspillage-alimentaire', label: 'Reduire le gaspillage alimentaire' },
  },
  {
    letter: 'G',
    name: 'GMP (Good Manufacturing Practice)',
    shortDef: 'Bonnes Pratiques de Fabrication — référentiel de qualité et sécurité alimentaire.',
    long: "Les GMP couvrent l'hygiène du personnel, la propreté des locaux, la maintenance des équipements, la traçabilité des matières premières, le contrôle des températures. En restauration, le GMP est complémentaire de l'HACCP et constitue le socle du Plan de Maîtrise Sanitaire (PMS).",
  },
  {
    letter: 'G',
    name: 'Grammage',
    shortDef: "Quantité précise d'un ingrédient dans une recette (en grammes ou millilitres).",
    long: "Le grammage est la donnée centrale d'une fiche technique. Pesage systématique au gramme près : 150 g de protéine, 250 g de garniture, 80 g de sauce. Sans grammage strict, le food cost dérive en quelques semaines de 4 à 8 points. Investir dans une balance de cuisine et standardiser la production est ROI immédiat.",
  },

  // H
  {
    letter: 'H',
    name: 'HACCP',
    shortDef: 'Hazard Analysis Critical Control Point — méthode d\'analyse des risques alimentaires.',
    long: "L'HACCP identifie les points critiques de la chaîne alimentaire (réception, stockage, préparation, cuisson, refroidissement, service) et définit des contrôles obligatoires : températures (frais < 4 °C, surgelés < -18 °C, cuisson > 75 °C), traçabilité, formation du personnel. Une inspection DDPP non conforme peut entraîner fermeture administrative.",
    link: { to: '/blog/haccp-restaurant', label: 'HACCP en restauration' },
  },
  {
    letter: 'H',
    name: 'Happy hour',
    shortDef: 'Plage horaire à prix réduit sur les boissons (et parfois la nourriture).',
    long: "L'happy hour (typiquement 17h-19h) vise à remplir le restaurant dans un créneau creux. Réduction typique : -30 à -50 % sur les boissons. Même si la marge unitaire baisse, le volume augmenté et l'effet d'entraînement (boissons → repas) génèrent un CA supplémentaire net. Très efficace pour les bars et bistros.",
  },

  // I
  {
    letter: 'I',
    name: 'IGP (Indication Géographique Protégée)',
    shortDef: "Label européen liant un produit à une zone géographique (au moins une étape).",
    long: "Voir aussi AOP. L'IGP est plus souple que l'AOP (au moins une étape liée à la zone, pas toutes). Exemples : Jambon de Bayonne IGP, Pomme du Limousin IGP. Mentionner ces labels sur la carte signale la qualité au client et justifie un coefficient multiplicateur supérieur.",
  },
  {
    letter: 'I',
    name: 'INCO (information consommateur)',
    shortDef: "Règlement européen 1169/2011 sur l'information du consommateur (allergènes, origine).",
    long: "Le règlement INCO oblige à informer le consommateur : allergènes, présence d'OGM, traçabilité des viandes (origine, abattage, découpe), informations nutritionnelles pour les produits préemballés. Sanctions jusqu'à 1 500 EUR par infraction. Une matrice allergènes et une politique de traçabilité documentée sont obligatoires.",
  },
  {
    letter: 'I',
    name: 'Inventaire',
    shortDef: "Comptage physique périodique des stocks (matières premières, boissons, consommables).",
    long: "L'inventaire mensuel est obligatoire pour calculer le food cost réel : Food cost (%) = ((Stock début + Achats - Stock fin) / CA) × 100. Sans inventaire, on ne mesure pas la perte ni les écarts entre théorique et réel. Un écart > 2 % indique soit du gaspillage, soit du vol, soit des erreurs de fiches techniques.",
    link: { to: '/blog/inventaire-restaurant-guide', label: 'Guide de l\'inventaire restaurant' },
  },

  // K
  {
    letter: 'K',
    name: 'KPI (Key Performance Indicator)',
    shortDef: 'Indicateur clé de performance — chiffre suivi pour piloter le restaurant.',
    long: "Les 10 KPI essentiels en restauration : food cost (%), prime cost (%), ratio personnel (%), marge brute (%), marge nette (%), ticket moyen, couverts servis, taux d'occupation, RevPASH, NPS. Suivre ces KPI hebdomadairement permet de détecter une dérive avant qu'elle ne devienne critique.",
    link: { to: '/blog/kpi-essentiels-restaurateur', label: 'KPI essentiels du restaurateur' },
  },
  {
    letter: 'K',
    name: 'Kebab',
    shortDef: 'Spécialité turque grillée à la broche — segment forte croissance en France (1,8 Md EUR).',
    long: "Le kebab est l'un des segments de restauration rapide les plus rentables : food cost 22 à 26 %, ticket moyen 8 à 12 EUR, rotation très élevée. Le marché français compte plus de 21 000 établissements. Modèle économique : volume, ticket moyen modeste, food cost serré, équipe réduite (2 personnes).",
  },

  // L
  {
    letter: 'L',
    name: 'Labour cost (coût du personnel)',
    shortDef: 'Masse salariale chargée — typiquement 30 à 40 % du CA HT en restauration.',
    long: "Le labour cost inclut salaires bruts + charges patronales + avantages (nourriture du personnel, mutuelle, primes). C'est le second poste de dépense après le food cost. Combiné au food cost, il forme le prime cost qui doit rester sous 65 % du CA pour préserver la marge nette.",
    link: { to: '/blog/reduire-cout-personnel-restaurant', label: 'Reduire le cout du personnel' },
  },
  {
    letter: 'L',
    name: 'LIFO',
    shortDef: 'Last In, First Out — dernier entré, premier sorti. Méthode déconseillée en restauration.',
    long: "Contrairement au FIFO, le LIFO consomme d'abord les produits les plus récents. En restauration, cette méthode est à éviter car elle entraîne du gaspillage par péremption des anciens produits. Seul cas d'usage : produits de longue conservation et calcul comptable du stock (méthode CMP préférable).",
    link: { to: '/blog/fifo-lifo-stocks-restaurant', label: 'FIFO vs LIFO en restaurant' },
  },
  {
    letter: 'L',
    name: 'Livraison',
    shortDef: 'Service de portage à domicile (par plateforme ou en propre).',
    long: "La livraison via plateformes (UberEats, Deliveroo) prélève 25 à 35 % de commission. Pour rester rentable : food cost cible 25 %, ticket moyen > 22 EUR, emballage optimisé, plats qui tiennent la route 20 minutes. La livraison en propre (10 % de coût de portage) est plus rentable mais demande un investissement organisationnel.",
    link: { to: '/blog/livraison-restaurant-rentabilite', label: 'Rentabilité de la livraison restaurant' },
  },

  // M
  {
    letter: 'M',
    name: 'Marge brute',
    shortDef: "Différence entre prix de vente HT et coût matières (en EUR ou en %).",
    long: "Marge brute (EUR) = Prix de vente HT - Coût matières. Marge brute (%) = 100 - Food cost. Objectif standard : 65 à 75 %. C'est la marge avant prise en compte des autres charges (personnel, loyer, énergie). Une bonne marge brute est la condition nécessaire mais non suffisante de la rentabilité.",
    link: { to: '/blog/calcul-marge-restaurant', label: 'Calcul de la marge restaurant' },
  },
  {
    letter: 'M',
    name: 'Marge nette',
    shortDef: 'Bénéfice après toutes les charges (matières, personnel, loyer, énergie, taxes).',
    long: "Marge nette (%) = (Résultat net / CA) × 100. Fourchette typique en restauration : 5 à 15 %. C'est la mesure ultime de rentabilité globale. Un restaurant peut avoir une bonne marge brute (70 %) mais une marge nette catastrophique (2 %) si ses charges fixes sont disproportionnées.",
  },
  {
    letter: 'M',
    name: 'Marquage CE',
    shortDef: "Conformité européenne des équipements (four, friteuse, hotte, etc.).",
    long: "Tout équipement de cuisine professionnelle doit porter le marquage CE attestant sa conformité aux normes européennes de sécurité, santé et environnement. Acheter du matériel sans marquage CE expose à des sanctions et à une exclusion d'assurance en cas d'incident.",
  },
  {
    letter: 'M',
    name: 'Menu engineering',
    shortDef: 'Analyse stratégique de la carte par popularité et rentabilité (matrice Boston).',
    long: "La matrice Menu Engineering classe les plats en 4 catégories : Stars (forte marge + forte popularité = mettre en avant), Plowhorses (faible marge + forte popularité = augmenter le prix ou réduire les coûts), Puzzles (forte marge + faible popularité = repositionner), Dogs (faible marge + faible popularité = retirer). Outil-clé pour optimiser la carte.",
    link: { to: '/blog/menu-engineering-boston-matrix', label: 'Menu engineering matrice Boston' },
  },
  {
    letter: 'M',
    name: 'Mercuriale',
    shortDef: 'Liste périodique des prix d\'achat des matières premières.',
    long: "La mercuriale (souvent hebdomadaire) recense les prix d'achat actualisés des fournisseurs pour chaque produit. Elle permet de recalculer instantanément le food cost des plats touchés par une variation et d'arbitrer entre fournisseurs. Une mercuriale digitale connectée aux fiches techniques détecte les dérives en temps réel.",
  },
  {
    letter: 'M',
    name: 'MEP (Mise en Place)',
    shortDef: "Préparation des ingrédients avant le service (épluchage, découpage, dressage).",
    long: "La MEP est la clef d'un service fluide : un plat doit être assemblé en moins de 6 minutes pour respecter le rythme de service. Une MEP bien organisée réduit le stress en service, garantit la régularité des portions et limite le gaspillage par erreur. Temps de MEP typique : 2 à 4 heures avant chaque service.",
  },

  // N
  {
    letter: 'N',
    name: 'Net price (prix net)',
    shortDef: 'Prix après remises, avant TVA — base de calcul du food cost.',
    long: "Le net price est le prix réellement encaissé HT, après remises, codes promo et happy hour. C'est sur cette base que doivent être calculés les ratios. Beaucoup de restaurants commettent l'erreur de calculer leur food cost sur le prix affiché — l'écart peut atteindre 5 points pendant les promotions.",
  },
  {
    letter: 'N',
    name: 'NPS (Net Promoter Score)',
    shortDef: 'Indicateur de satisfaction client (% promoteurs - % détracteurs).',
    long: "Le NPS demande au client : « Sur une échelle de 0 à 10, recommanderiez-vous notre restaurant ? ». Promoteurs (9-10), Passifs (7-8), Détracteurs (0-6). NPS = % Promoteurs - % Détracteurs. Un NPS > 50 en restauration est excellent. C'est le meilleur prédicteur de la croissance organique (bouche-à-oreille).",
    link: { to: '/blog/fideliser-clients-restaurant-strategies', label: 'Fideliser les clients restaurant' },
  },

  // O
  {
    letter: 'O',
    name: 'Omakase',
    shortDef: 'Mode de service japonais où le chef choisit le menu (« je vous fais confiance »).',
    long: "L'omakase libère le chef du menu fixe et permet d'utiliser les produits du jour les plus frais, optimisant la marge et limitant le gaspillage. Format premium : ticket moyen 80 à 250 EUR. Le client paie pour l'expérience et la créativité du chef. Food cost paradoxalement maîtrisé (28-32 %) car pas de stock à pousser.",
  },

  // P
  {
    letter: 'P',
    name: 'Pasteurisation',
    shortDef: 'Traitement thermique pour détruire les micro-organismes pathogènes.',
    long: "La pasteurisation chauffe un produit entre 62 et 88 °C pour éliminer la majorité des bactéries pathogènes (Salmonella, E. coli, Listeria) tout en préservant les qualités gustatives. Indispensable pour les produits laitiers, jus de fruits, plats préparés sous vide. Différent de la stérilisation (au-dessus de 100 °C).",
  },
  {
    letter: 'P',
    name: 'PEPS',
    shortDef: 'Premier Entré, Premier Sorti — version française de FIFO.',
    long: "Voir FIFO. Le PEPS est obligatoire pour la rotation des stocks alimentaires en restauration : produits anciens devant, nouveaux derrière, étiquetage systématique des dates de réception. Méthode incompatible avec les emplacements aléatoires de stockage (chaos induit la perte).",
  },
  {
    letter: 'P',
    name: 'Plan de maîtrise sanitaire (PMS)',
    shortDef: "Document obligatoire regroupant procédures HACCP, GMP et traçabilité.",
    long: "Le PMS est obligatoire pour tout établissement de restauration. Il regroupe : plan de nettoyage et désinfection, plan de lutte contre les nuisibles, plan HACCP, plan de formation, plan de traçabilité, plan de gestion des non-conformités. À tenir à jour et à présenter en cas de contrôle DDPP.",
  },
  {
    letter: 'P',
    name: 'Plat du jour',
    shortDef: 'Plat spécial proposé pour une journée ou une semaine, à prix accessible.',
    long: "Le plat du jour est un excellent outil de pilotage : il permet d'écouler les stocks à risque (FIFO), tester de nouvelles recettes, fidéliser la clientèle de midi, augmenter la rotation. Ticket moyen midi grâce au plat du jour : 14 à 22 EUR. Marge brute généralement supérieure à la carte car coût matière optimisé.",
  },
  {
    letter: 'P',
    name: 'Portion',
    shortDef: 'Quantité de produit servie par client (en grammes ou unités).',
    long: "Standardiser les portions est essentiel pour la régularité et la marge. Variations de 10 g sur 200 portions/jour = 2 kg de produit gaspillé. Outils : balances en cuisine, louches calibrées, bols étalons. Une réduction de portion de 5 % bien équilibrée (souvent garniture) peut faire baisser le food cost de 1,5 point sans impact perçu.",
  },
  {
    letter: 'P',
    name: 'Prime cost',
    shortDef: 'Somme du coût matières et du coût du personnel (food cost + labour cost).',
    long: "Prime cost = Food cost + Labour cost. C'est l'indicateur de rentabilité le plus important en restauration. Objectif : moins de 60 % du CA pour un restaurant traditionnel, moins de 65 % pour un gastronomique. Au-delà, la marge nette devient difficile à dégager. C'est le KPI quotidien à suivre.",
    link: { to: '/blog/prime-cost-restaurant', label: 'Prime cost restaurant : guide complet' },
  },
  {
    letter: 'P',
    name: 'Productivité',
    shortDef: "Ratio CA / temps de travail (en EUR par heure ou par personne).",
    long: "Productivité = CA HT / heures travaillées. Benchmark restaurant traditionnel : 90 à 120 EUR/h. Brasserie : 110 à 160 EUR/h. Fast food : 60 à 90 EUR/h. Améliorer la productivité passe par : optimisation du planning, réduction des heures creuses, suggestive selling, automatisation (kiosques, paiement à table).",
  },
  {
    letter: 'P',
    name: 'PV (Prix de vente)',
    shortDef: 'Prix facturé au client (HT ou TTC).',
    long: "Le prix de vente HT est la base de tous les calculs de marge. Pour le fixer : partir du coût matières, appliquer le coefficient multiplicateur cible (3 à 5 selon segment), vérifier le positionnement par rapport à la concurrence, tester le psychological pricing (9,90 vs 10 EUR). À ajuster trimestriellement selon mercuriale.",
    link: { to: '/blog/fixer-prix-carte-restaurant', label: 'Fixer le prix de sa carte' },
  },

  // Q
  {
    letter: 'Q',
    name: 'Qualité (perception)',
    shortDef: "Perception subjective du client basée sur produit, service, ambiance, prix.",
    long: "La qualité perçue résulte de : qualité produit (fraîcheur, présentation), qualité de service (accueil, attention, timing), qualité du cadre (décor, propreté, musique), rapport qualité/prix. Mesurable par NPS, Google Reviews, TripAdvisor. Investir dans la qualité perçue augmente le ticket moyen tolérable et la fidélité.",
  },
  {
    letter: 'Q',
    name: 'Quenelle',
    shortDef: 'Préparation moulée à la cuillère (poisson, viande, dessert).',
    long: "Technique de dressage classique consistant à mouler une préparation crémeuse entre deux cuillères. Utilisée pour le dressage de purées, mousses, sorbets. Augmente la perception de qualité et permet une mise en valeur visuelle d'un produit modeste. Compétence chef de partie à standardiser dans les fiches techniques.",
  },

  // R
  {
    letter: 'R',
    name: 'Ratio',
    shortDef: "Rapport entre deux grandeurs (food cost, marge, personnel) exprimé en %.",
    long: "En restauration, on raisonne quasi exclusivement en ratios pour comparer dans le temps et entre établissements. Principaux ratios : food cost (%), prime cost (%), marge brute (%), marge nette (%), ratio personnel (%), ticket moyen, taux d'occupation. La cohérence des ratios entre eux est aussi importante que leur niveau absolu.",
  },
  {
    letter: 'R',
    name: 'Rendement',
    shortDef: "Quantité utilisable obtenue à partir d'une quantité brute (en %).",
    long: "Rendement = quantité après préparation / quantité brute. Exemples : carottes 80 %, courgettes 85 %, bavette 90 %, saumon entier 60 %. Ignorer le rendement sous-estime le food cost de 10 à 20 %. Une fiche technique précise intègre toujours le rendement pour chaque ingrédient brut.",
  },
  {
    letter: 'R',
    name: 'RevPASH',
    shortDef: 'Revenue Per Available Seat Hour — CA par siège disponible et par heure.',
    long: "RevPASH = CA HT / (Nombre de sièges × Heures de service). C'est l'indicateur de référence en hôtellerie-restauration premium pour mesurer la performance globale (occupation × ticket moyen × rotation). Benchmark : 10 à 25 EUR/siège/heure pour un restaurant traditionnel. Permet de comparer des restaurants de tailles différentes.",
  },
  {
    letter: 'R',
    name: 'Rotation des stocks',
    shortDef: "Vitesse à laquelle les stocks sont consommés (jours de couverture).",
    long: "Rotation = Coût matières mensuel / Stock moyen. Une rotation rapide (< 7 jours) limite le risque de perte et libère du cash. Pour les produits frais : viser 2-3 jours. Pour les boissons : 15-30 jours. Pour les épicerie : 30-60 jours. Une rotation trop lente indique un sur-stockage à corriger.",
    link: { to: '/blog/rotation-stocks-restaurant', label: 'Rotation des stocks restaurant' },
  },

  // S
  {
    letter: 'S',
    name: 'Saisonnalité',
    shortDef: 'Variation de l\'activité selon les périodes (jours, mois, saisons).',
    long: "Très marquée en restauration : différences de CA jusqu'à 50 % entre saison haute et basse. Anticipation : planning flexible (CDD saisonniers), prévision des stocks (réduction matières en basse saison), animation marketing pour lisser. Connaître son indice de saisonnalité par mois est la base d'un budget prévisionnel sérieux.",
    link: { to: '/blog/budget-previsionnel-restaurant', label: 'Budget previsionnel restaurant' },
  },
  {
    letter: 'S',
    name: 'Service',
    shortDef: "Unité de temps en restauration (midi, soir) — typiquement 2-3 heures.",
    long: "Le service est l'unité de pilotage opérationnel : on planifie, on prend les commandes, on mesure la performance par service. Service midi : 12h-15h. Service soir : 19h-23h. Suivre les KPI par service (couverts, ticket moyen, food cost) permet d'identifier les leviers d'optimisation (le midi marche bien, le soir non = pourquoi ?).",
  },
  {
    letter: 'S',
    name: 'SIRH',
    shortDef: 'Système d\'Information Ressources Humaines — logiciel de gestion RH.',
    long: "Un SIRH adapté à la restauration gère : contrats HCR, plannings avec coupures, pointage, paie chargée, congés payés, déclarations Urssaf, soldes de tout compte. Solutions courantes : Combo, Snapshift, Skello. ROI typique : 1 à 2 % du CA en gain de productivité administrative.",
  },
  {
    letter: 'S',
    name: 'Sourcing',
    shortDef: "Recherche et sélection des fournisseurs.",
    long: "Un sourcing rigoureux est la base d'un food cost maîtrisé. Critères : prix, qualité, régularité, conditions de paiement (30 à 60 jours), service après-vente, certifications (Bio, Label Rouge, MSC, ASC). Diversifier les fournisseurs (3 sur les produits stratégiques) limite la dépendance et favorise la négociation.",
  },
  {
    letter: 'S',
    name: 'Sourcing local',
    shortDef: 'Approvisionnement en produits de la région (circuit court).',
    long: "Le sourcing local est un atout marketing puissant (15 à 25 % de prix tolérable supplémentaire) et un argument écologique. Cible 30 à 50 % de produits régionaux. Travailler avec producteurs locaux nécessite une organisation logistique adaptée (livraisons hebdomadaires, paiement direct) et une cuisine flexible (carte courte saisonnière).",
  },

  // T
  {
    letter: 'T',
    name: 'Ticket moyen',
    shortDef: 'CA HT divisé par le nombre de couverts servis.',
    long: "Ticket moyen = CA HT / Couverts. Indicateur clé : si CA stagne mais ticket moyen baisse, c'est un signal de perte de qualité perçue. Leviers d'augmentation : suggestive selling, entrées + desserts systématiques, montée en gamme des boissons, refonte des plats. +1 EUR de ticket moyen sur 60 couverts/jour = 21 900 EUR/an.",
    link: { to: '/blog/augmenter-ticket-moyen-restaurant', label: 'Augmenter le ticket moyen' },
  },
  {
    letter: 'T',
    name: 'Tournant',
    shortDef: 'Cuisinier polyvalent capable de remplacer un chef de partie absent.',
    long: "Le tournant assure la flexibilité de la brigade en remplaçant chaque poste selon les besoins (congés, absences, pics d'activité). Salaire généralement supérieur à un chef de partie classique. Son existence permet de réduire le sur-staffing et limiter la dépendance à un poste unique.",
  },
  {
    letter: 'T',
    name: 'Traçabilité',
    shortDef: 'Capacité à retracer l\'origine et le parcours d\'une matière première.',
    long: "Obligatoire depuis 2005 (règlement européen 178/2002). Pour chaque lot : nom du fournisseur, date de réception, numéro de lot, DLC/DDM. En cas de retrait sanitaire, le restaurant doit pouvoir identifier en 4 heures les lots concernés. Logiciels dédiés ou cahier papier daté : les deux sont conformes si bien tenus.",
  },
  {
    letter: 'T',
    name: 'TVA réduite restauration',
    shortDef: 'Taux de 10 % sur la restauration sur place (5,5 % à emporter froid, 20 % alcools).',
    long: "En France : 10 % pour les plats consommés sur place ou à emporter chaud, 5,5 % pour les plats à emporter froids (sandwichs, salades) et plats préparés froids. 20 % pour les boissons alcoolisées (sur place ou à emporter). Une caisse doit ventiler automatiquement les ventes par taux pour la déclaration de TVA mensuelle.",
    link: { to: '/calculateur-tva', label: 'Calculateur TVA restauration' },
  },

  // U
  {
    letter: 'U',
    name: 'UVC (Unité de Vente Consommateur)',
    shortDef: 'Unité minimale vendue au client final (plat, boisson, dessert).',
    long: "L'UVC est l'unité de référence pour la fiche technique : 1 pizza, 1 cocktail, 1 portion de dessert. Chaque UVC a son propre food cost, sa marge et son poids dans le menu mix. C'est la granularité de base pour le menu engineering et le pilotage de la rentabilité par plat.",
  },

  // V
  {
    letter: 'V',
    name: 'Vacherin',
    shortDef: "Fromage AOP ou dessert glacé classique (meringue, glace, chantilly).",
    long: "Le vacherin (Mont d'Or AOP, octobre à mars) est un produit saisonnier qui justifie une mise en avant sur la carte d'hiver (carte courte). Le vacherin glacé est un dessert classique à forte marge (food cost 12-15 %). Les deux usages permettent de varier la carte selon la saison sans complexifier la mise en place.",
  },
  {
    letter: 'V',
    name: 'Vegan',
    shortDef: 'Cuisine 100 % végétale (sans viande, poisson, œufs, lait, miel).',
    long: "Segment en forte croissance (+10 %/an en France). Proposer au moins une option vegan élargit la clientèle de 8 à 12 %. Avantages : food cost très bas (légumes, légumineuses), différenciation, valeur écologique. Limite : nécessite une carte distincte et de la créativité pour éviter le simple plat sans viande.",
  },
  {
    letter: 'V',
    name: 'Veille concurrentielle',
    shortDef: "Suivi régulier des concurrents (prix, carte, communication).",
    long: "Outils : Google Reviews, TripAdvisor, Instagram, sites des concurrents, visites mystères trimestrielles. À surveiller : prix d'un plat équivalent, ticket moyen affiché, animations promotionnelles, nouveauté de carte. Une veille structurée permet d'anticiper et de se positionner avec un avantage compétitif clair.",
  },
  {
    letter: 'V',
    name: 'Variabilité saisonnière',
    shortDef: 'Écart de CA entre saison haute et saison basse.',
    long: "Voir Saisonnalité. En zone touristique, écart pouvant atteindre 1 à 5 entre janvier et juillet. Adaptation : carte saisonnière, contrats saisonniers (CDD HCR), gestion de trésorerie anticipée (provisions des mois creux), animation marketing hors saison (menus thématiques, événements).",
  },

  // Y
  {
    letter: 'Y',
    name: 'Yield management',
    shortDef: "Pricing dynamique selon la demande (heure, jour, saison).",
    long: "Importé de l'aérien et de l'hôtellerie : adapter le prix à la demande. En restauration : tarifs différenciés midi/soir, prix happy hour, menu fixe vs carte, supplément week-end, prix réduit le mardi (jour creux), surcoût Saint-Valentin. Augmente le CA total de 5 à 15 % en moyenne quand bien exécuté.",
  },

  // Z
  {
    letter: 'Z',
    name: 'Zone de chalandise',
    shortDef: "Zone géographique d'où provient la clientèle (souvent 800 m à 5 km).",
    long: "Connaître sa zone de chalandise oriente : choix de localisation, ciblage publicitaire (radius Google Ads, Instagram), partenariats locaux, types de prestations (livraison vs sur place). Outils : Google Analytics, sondages clients, géolocalisation des réservations. Une zone bien définie est la base d'un marketing local efficace.",
  },
];

const ALL_LETTERS = Array.from(new Set(TERMS.map((t) => t.letter))).sort();

const TOP_TERMS = ['Food cost', 'Prime cost', 'Marge brute', 'Marge nette', 'Coefficient multiplicateur', 'Fiche technique', 'Ticket moyen', 'HACCP', 'Menu engineering', 'RevPASH'];

export default function GlossaireRestauration() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TERMS;
    return TERMS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.shortDef.toLowerCase().includes(q) ||
        t.long.toLowerCase().includes(q)
    );
  }, [query]);

  const byLetter = useMemo(() => {
    const map: Record<string, Term[]> = {};
    for (const t of filtered) {
      if (!map[t.letter]) map[t.letter] = [];
      map[t.letter].push(t);
    }
    return map;
  }, [filtered]);

  const definedTermSetSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Glossaire de la restauration RestauMargin',
    description: 'Glossaire complet de la restauration : 60+ termes définis (food cost, marge, prime cost, fiche technique, HACCP, GMP, RevPASH).',
    inLanguage: 'fr-FR',
    hasDefinedTerm: TERMS.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.name,
      description: t.shortDef,
      inDefinedTermSet: 'https://www.restaumargin.fr/glossaire-restauration',
    })),
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Glossaire complet de la restauration : 50+ termes définis (2026)',
    description: 'Glossaire complet de la restauration. 50+ termes définis : food cost, marge, prime cost, fiche technique, HACCP, GMP, RevPASH. Guide de référence 2026.',
    image: 'https://www.restaumargin.fr/og-image.png',
    author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
    publisher: {
      '@type': 'Organization',
      name: 'RestauMargin',
      logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
    },
    datePublished: '2026-05-26',
    dateModified: '2026-05-26',
    wordCount: 5500,
    inLanguage: 'fr-FR',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/glossaire-restauration' },
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Glossaire restauration 2026',
    url: 'https://www.restaumargin.fr/glossaire-restauration',
    inLanguage: 'fr-FR',
    mentions: TERMS.filter((t) => t.link).map((t) => ({
      '@type': 'WebPage',
      name: t.link!.label,
      url: `https://www.restaumargin.fr${t.link!.to}`,
    })),
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Glossaire restauration 2026 | 50+ définitions food cost, marge, KPI"
        description="Glossaire complet de la restauration. 50+ termes définis : food cost, marge, prime cost, fiche technique, HACCP, GMP, RevPASH. Guide de référence 2026."
        path="/glossaire-restauration"
        type="article"
        schema={[
          definedTermSetSchema,
          articleSchema,
          webPageSchema,
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Glossaire restauration', url: 'https://www.restaumargin.fr/glossaire-restauration' },
          ]),
        ]}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[#111111] font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/outils/calculateur-marge-restaurant"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Calculer ma marge
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-[#737373] hover:text-teal-600 transition-colors"
            >
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Breadcrumbs ── */}
      <div className="bg-[#FAFAFA] border-b border-[#E5E7EB] py-3 px-4">
        <div className="max-w-6xl mx-auto text-xs text-[#737373] flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-[#111111] font-medium">Glossaire restauration</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-[#FAFAFA] via-white to-teal-50/40 border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Glossaire de référence</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111111] tracking-tight leading-tight">
            Glossaire complet de la <span className="text-teal-600">restauration</span> : 50+ termes définis (2026)
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[#525252] max-w-3xl leading-relaxed">
            Toutes les définitions essentielles de la restauration française : food cost, marge brute, prime cost, fiche technique, HACCP, RevPASH, menu engineering, coefficient multiplicateur. Mis à jour mai 2026.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-[#525252]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E5E7EB]">
              <CheckCircle className="w-4 h-4 text-teal-600" />
              {TERMS.length} termes définis
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E5E7EB]">
              <Search className="w-4 h-4 text-teal-600" />
              Recherche instantanée
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E5E7EB]">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Mis à jour 05/2026
            </span>
          </div>
        </div>
      </section>

      {/* ── Layout 2 colonnes ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
        {/* ── Sidebar A-Z sticky (desktop) ── */}
        <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#737373] mb-3">
              Navigation alphabétique
            </div>
            <div className="grid grid-cols-6 lg:grid-cols-4 gap-1.5">
              {ALL_LETTERS.map((l) => (
                <a
                  key={l}
                  href={`#letter-${l}`}
                  className="text-center py-2 rounded-lg border border-[#E5E7EB] bg-white hover:bg-teal-600 hover:text-white hover:border-teal-600 text-[#111111] text-sm font-semibold transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-[#E5E7EB]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#737373] mb-3">
                Top 10 termes
              </div>
              <ul className="space-y-1.5 text-sm">
                {TOP_TERMS.map((name) => {
                  const t = TERMS.find((x) => x.name === name);
                  if (!t) return null;
                  return (
                    <li key={name}>
                      <a
                        href={`#term-${slugify(t.name)}`}
                        className="text-[#525252] hover:text-teal-600 transition-colors flex items-center gap-1.5"
                      >
                        <Star className="w-3 h-3 text-teal-600 shrink-0" />
                        {t.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-6 pt-5 border-t border-[#E5E7EB]">
              <Link
                to="/login?mode=register"
                className="block w-full text-center px-4 py-2.5 rounded-xl bg-[#111111] hover:bg-black text-white text-sm font-semibold transition-colors"
              >
                Essai gratuit 14 jours
              </Link>
            </div>
          </div>
        </aside>

        {/* ── Contenu principal ── */}
        <main>
          {/* ── Recherche live ── */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 mb-10">
            <label htmlFor="glossaire-search" className="block text-sm font-semibold text-[#111111] mb-2">
              Rechercher un terme
            </label>
            <div className="relative">
              <Search className="w-5 h-5 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="glossaire-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex : food cost, marge brute, HACCP..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] focus:border-teal-600 focus:bg-white outline-none text-[#111111] placeholder-[#9CA3AF]"
              />
            </div>
            <div className="mt-2 text-xs text-[#737373]">
              {filtered.length} terme{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''} sur {TERMS.length}
            </div>
          </div>

          {/* ── Encart : Top 10 termes les plus importants ── */}
          <section className="mb-12 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-100">À retenir en priorité</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
              Les 10 termes les plus importants à connaître
            </h2>
            <ol className="grid sm:grid-cols-2 gap-3 text-sm">
              {TOP_TERMS.map((name, i) => {
                const t = TERMS.find((x) => x.name === name);
                if (!t) return null;
                return (
                  <li key={name} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                    <span className="text-teal-200 font-bold min-w-[24px]">{i + 1}.</span>
                    <div>
                      <a href={`#term-${slugify(t.name)}`} className="font-semibold text-white hover:underline">
                        {t.name}
                      </a>
                      <div className="text-teal-100 text-xs mt-0.5">{t.shortDef}</div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* ── Quiz interactif ── */}
          <Quiz />

          {/* ── Liste alphabétique ── */}
          {ALL_LETTERS.map((letter) => {
            const list = byLetter[letter];
            if (!list || list.length === 0) return null;
            return (
              <section key={letter} id={`letter-${letter}`} className="mb-12">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#E5E7EB]">
                  <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-600 text-white text-2xl font-extrabold">
                    {letter}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
                    Termes en {letter}
                  </h2>
                </div>
                <div className="grid gap-4">
                  {list.map((term) => (
                    <article
                      key={term.name}
                      id={`term-${slugify(term.name)}`}
                      className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 hover:border-teal-600/40 hover:shadow-sm transition-all"
                    >
                      <h3 className="text-lg sm:text-xl font-bold text-[#111111] mb-2">
                        {term.name}
                      </h3>
                      <p className="text-[#525252] text-sm sm:text-base mb-3">
                        <span className="font-semibold text-[#111111]">Définition : </span>
                        {term.shortDef}
                      </p>
                      <p className="text-[#525252] text-sm sm:text-base leading-relaxed">
                        {term.long}
                      </p>
                      {term.link && (
                        <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
                          <Link
                            to={term.link.to}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                          >
                            <BookOpen className="w-4 h-4" />
                            {term.link.label}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            );
          })}

          {filtered.length === 0 && (
            <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl p-10 text-center">
              <Search className="w-10 h-10 text-[#9CA3AF] mx-auto mb-3" />
              <p className="text-[#525252] font-medium">
                Aucun terme ne correspond à votre recherche.
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-4 text-sm font-semibold text-teal-600 hover:underline"
              >
                Effacer la recherche
              </button>
            </div>
          )}

          {/* ── CTA téléchargement PDF ── */}
          <section className="mt-16 bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center">
              <Download className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-[#111111]">
                Recevez le glossaire complet en PDF (gratuit)
              </h2>
              <p className="text-sm text-[#525252] mt-1">
                60+ termes définis dans un PDF imprimable pour votre cuisine, bureau ou formation d'équipe.
              </p>
            </div>
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              Télécharger le PDF
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

          {/* ── CTA final ── */}
          <section className="mt-12 bg-[#111111] rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 via-transparent to-transparent" aria-hidden />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-teal-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                  Passer à la pratique
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-tight">
                Maîtriser ces termes, c'est bien.<br />
                Les appliquer en automatique, c'est mieux.
              </h2>
              <p className="text-white/70 text-base sm:text-lg max-w-2xl mb-6">
                RestauMargin calcule votre food cost, votre marge brute, votre prime cost et tous vos KPI en temps réel à partir de vos fiches techniques et de votre mercuriale. Essai gratuit 14 jours sans CB.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/login?mode=register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-[#F5F5F5] text-[#111111] font-semibold transition-colors"
                >
                  Commencer gratuitement
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/blog"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Voir tous les guides
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* ─────────── Mini quiz interactif ─────────── */
function Quiz() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const questions = [
    {
      q: "Quel est le food cost cible d'un restaurant traditionnel ?",
      options: ['10-15 %', '28-33 %', '45-50 %', '60-70 %'],
      answer: 1,
    },
    {
      q: 'Le prime cost est la somme de :',
      options: [
        'Food cost + loyer',
        'Food cost + cout du personnel',
        'Marge brute + marge nette',
        'CA HT + charges sociales',
      ],
      answer: 1,
    },
    {
      q: 'FIFO signifie :',
      options: [
        'First In, First Out',
        'Fast In, Fast Out',
        'Food In, Food Out',
        'Final Inventory Food Output',
      ],
      answer: 0,
    },
    {
      q: "Quelle est la TVA sur la restauration sur place en France ?",
      options: ['5,5 %', '10 %', '20 %', '0 %'],
      answer: 1,
    },
    {
      q: 'Le coefficient multiplicateur pour un food cost de 30 % est :',
      options: ['1,30', '2,00', '3,33', '5,00'],
      answer: 2,
    },
  ];

  function pick(i: number) {
    if (i === questions[step].answer) setScore((s) => s + 1);
    if (step + 1 < questions.length) setStep(step + 1);
    else setDone(true);
  }

  function reset() {
    setStep(0);
    setScore(0);
    setDone(false);
  }

  return (
    <section className="mb-12 bg-white border-2 border-teal-600/20 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-3">
        <ListChecks className="w-5 h-5 text-teal-600" />
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Quiz interactif</span>
      </div>
      <h2 className="text-xl sm:text-2xl font-extrabold text-[#111111] mb-4">
        Testez vos connaissances en 5 questions
      </h2>

      {!done ? (
        <div>
          <div className="text-xs text-[#737373] mb-2">
            Question {step + 1} sur {questions.length}
          </div>
          <div className="w-full h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden mb-5">
            <div
              className="h-full bg-teal-600 transition-all"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>
          <p className="text-base sm:text-lg font-semibold text-[#111111] mb-4">
            {questions[step].q}
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {questions[step].options.map((opt, i) => (
              <button
                key={opt}
                type="button"
                onClick={() => pick(i)}
                className="text-left px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] hover:border-teal-600 hover:bg-white text-[#111111] font-medium transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="text-5xl font-extrabold text-teal-600 mb-2">
            {score} / {questions.length}
          </div>
          <p className="text-[#525252] mb-5">
            {score === questions.length
              ? 'Score parfait. Vous maîtrisez les fondamentaux.'
              : score >= 3
              ? "Bon score. Continuez la lecture du glossaire pour combler les lacunes."
              : 'Bon début. Le glossaire ci-dessous va vous aider à progresser.'}
          </p>
          <button
            type="button"
            onClick={reset}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors"
          >
            Recommencer le quiz
          </button>
        </div>
      )}
    </section>
  );
}

/* ─────────── Helpers ─────────── */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
