// =============================================================================
// French Food Supplier Database for RestauMargin
// Base de données des fournisseurs alimentaires français
// =============================================================================

export interface SupplierProduct {
  category: string;
  examples: string[];
  priceRange?: string;
}

export interface FrenchSupplier {
  name: string;
  type: 'grossiste' | 'specialiste' | 'local' | 'national';
  categories: string[];
  regions: string[];
  departments?: string[];
  cities?: string[];
  description: string;
  website?: string;
  phone?: string;
  delivery: boolean;
  minOrder?: string;
  speciality?: string;
  products?: SupplierProduct[];
}

// =============================================================================
// RÉGIONS MÉTROPOLITAINES FRANÇAISES
// =============================================================================

export const FRENCH_REGIONS: string[] = [
  'Île-de-France',
  'Provence-Alpes-Côte d\'Azur',
  'Auvergne-Rhône-Alpes',
  'Occitanie',
  'Nouvelle-Aquitaine',
  'Hauts-de-France',
  'Grand Est',
  'Bretagne',
  'Normandie',
  'Pays de la Loire',
  'Bourgogne-Franche-Comté',
  'Centre-Val de Loire',
  'Corse',
];

// =============================================================================
// DÉPARTEMENTS FRANÇAIS (les plus courants pour la restauration)
// =============================================================================

export const FRENCH_DEPARTMENTS: Record<string, string> = {
  '75': 'Paris',
  '77': 'Seine-et-Marne',
  '78': 'Yvelines',
  '91': 'Essonne',
  '92': 'Hauts-de-Seine',
  '93': 'Seine-Saint-Denis',
  '94': 'Val-de-Marne',
  '95': 'Val-d\'Oise',
  '13': 'Bouches-du-Rhône',
  '06': 'Alpes-Maritimes',
  '83': 'Var',
  '69': 'Rhône',
  '38': 'Isère',
  '73': 'Savoie',
  '74': 'Haute-Savoie',
  '31': 'Haute-Garonne',
  '34': 'Hérault',
  '33': 'Gironde',
  '44': 'Loire-Atlantique',
  '59': 'Nord',
  '62': 'Pas-de-Calais',
  '67': 'Bas-Rhin',
  '68': 'Haut-Rhin',
  '35': 'Ille-et-Vilaine',
  '29': 'Finistère',
  '76': 'Seine-Maritime',
  '14': 'Calvados',
  '21': 'Côte-d\'Or',
  '45': 'Loiret',
  '2A': 'Corse-du-Sud',
  '2B': 'Haute-Corse',
  '63': 'Puy-de-Dôme',
  '42': 'Loire',
  '37': 'Indre-et-Loire',
};

// =============================================================================
// CATÉGORIES DE PRODUITS
// =============================================================================

export const SUPPLIER_CATEGORIES = [
  'Viandes',
  'Poissons',
  'Légumes',
  'Fruits',
  'Produits laitiers',
  'Épices',
  'Féculents',
  'Huiles',
  'Boissons',
  'Surgelés',
  'Boulangerie',
  'Épicerie fine',
  'Bio',
  'Charcuterie',
  'Fromages',
] as const;

// =============================================================================
// BASE DE DONNÉES DES FOURNISSEURS (80+ fournisseurs)
// =============================================================================

export const FRENCH_SUPPLIERS: FrenchSupplier[] = [

  // ===========================================================================
  // GROSSISTES NATIONAUX (Cash & Carry / Distributeurs foodservice)
  // ===========================================================================

  {
    name: 'METRO Cash & Carry',
    type: 'national',
    categories: ['Viandes', 'Poissons', 'Légumes', 'Fruits', 'Produits laitiers', 'Épices', 'Féculents', 'Huiles', 'Boissons', 'Surgelés', 'Boulangerie', 'Épicerie fine', 'Fromages', 'Charcuterie'],
    regions: [...FRENCH_REGIONS],
    description: 'Leader du cash & carry en France avec 98 entrepôts et plus de 40 000 références. Carte METRO obligatoire pour les professionnels. Offre complète alimentaire et non-alimentaire pour la restauration.',
    website: 'https://www.metro.fr',
    phone: '01 41 83 44 00',
    delivery: true,
    minOrder: '100€ HT minimum pour la livraison',
    speciality: 'Cash & carry généraliste, gamme complète CHR',
    products: [
      { category: 'Viandes', examples: ['Entrecôte bœuf FR', 'Filet de bœuf', 'Côte de porc', 'Cuisse de poulet', 'Veau escalope'], priceRange: '5-45€/kg' },
      { category: 'Poissons', examples: ['Saumon frais', 'Bar de ligne', 'Cabillaud', 'Crevettes', 'Noix St-Jacques'], priceRange: '8-55€/kg' },
      { category: 'Légumes', examples: ['Pommes de terre', 'Carottes', 'Tomates grappe', 'Salade', 'Courgettes'], priceRange: '0.80-6€/kg' },
      { category: 'Fruits', examples: ['Pommes', 'Oranges', 'Bananes', 'Fraises', 'Citrons'], priceRange: '1-8€/kg' },
      { category: 'Produits laitiers', examples: ['Beurre 82% MG', 'Crème 35%', 'Lait entier', 'Yaourts', 'Mascarpone'], priceRange: '1-12€/kg' },
      { category: 'Épicerie fine', examples: ['Huile olive extra vierge', 'Vinaigre balsamique', 'Moutarde Dijon', 'Sel de Guérande'], priceRange: '2-25€/L ou kg' },
      { category: 'Boissons', examples: ['Eaux minérales', 'Jus de fruits', 'Sodas', 'Bières', 'Vins en BIB'], priceRange: '0.30-8€/L' },
      { category: 'Surgelés', examples: ['Frites', 'Légumes surgelés', 'Poissons panés', 'Desserts surgelés'], priceRange: '2-15€/kg' },
    ],
  },
  {
    name: 'Promocash',
    type: 'national',
    categories: ['Viandes', 'Poissons', 'Légumes', 'Fruits', 'Produits laitiers', 'Épices', 'Féculents', 'Huiles', 'Boissons', 'Surgelés', 'Boulangerie', 'Charcuterie'],
    regions: [...FRENCH_REGIONS],
    description: 'Réseau de 138 magasins cash & carry avec 13 drives, du groupe Carrefour. Plus de 16 000 produits pour les professionnels de la restauration et de l\'alimentation.',
    website: 'https://www.promocash.com',
    phone: '0 800 865 286',
    delivery: true,
    minOrder: '150€ HT minimum pour la livraison',
    speciality: 'Cash & carry, réseau Carrefour Pro, 1200 références en ligne',
    products: [
      { category: 'Viandes', examples: ['Bavette d\'aloyau', 'Épaule d\'agneau', 'Filet mignon porc', 'Poulet fermier'], priceRange: '5-40€/kg' },
      { category: 'Poissons', examples: ['Filet de sole', 'Pavé de saumon', 'Moules', 'Thon frais'], priceRange: '7-45€/kg' },
      { category: 'Légumes', examples: ['Salade batavia', 'Poivrons', 'Aubergines', 'Champignons'], priceRange: '0.90-7€/kg' },
      { category: 'Boulangerie', examples: ['Pain tradition', 'Croissants', 'Pains spéciaux', 'Viennoiseries'], priceRange: '0.30-2€/pièce' },
      { category: 'Boissons', examples: ['Coca-Cola', 'Eaux', 'Bières pression', 'Vins régionaux'], priceRange: '0.25-10€/L' },
    ],
  },
  {
    name: 'Transgourmet France',
    type: 'national',
    categories: ['Viandes', 'Poissons', 'Légumes', 'Fruits', 'Produits laitiers', 'Épices', 'Féculents', 'Huiles', 'Boissons', 'Surgelés', 'Boulangerie', 'Épicerie fine', 'Fromages'],
    regions: [...FRENCH_REGIONS],
    description: 'Distributeur alimentaire pour les professionnels avec un catalogue de 30 000 articles. Filiale du groupe suisse Coop. Livraison 6j/7 en multi-température. Gammes Transgourmet Origine (terroir), Quality (premium) et Economy.',
    website: 'https://www.transgourmet.fr',
    phone: '01 56 70 83 00',
    delivery: true,
    minOrder: '200€ HT minimum',
    speciality: 'Distribution foodservice, 30 000 articles, gammes Origine/Quality/Economy',
    products: [
      { category: 'Viandes', examples: ['Bœuf Origine France', 'Veau de lait', 'Agneau', 'Porc fermier', 'Volaille Label Rouge'], priceRange: '6-50€/kg' },
      { category: 'Poissons', examples: ['Bar de ligne', 'Turbot', 'Langoustines', 'Homard', 'Saumon Label Rouge'], priceRange: '10-60€/kg' },
      { category: 'Fromages', examples: ['Comté AOP 12 mois', 'Brie de Meaux', 'Roquefort', 'Reblochon', 'Morbier AOP'], priceRange: '8-35€/kg' },
      { category: 'Épicerie fine', examples: ['Huile olive Kalamata', 'Truffe noire', 'Foie gras', 'Épices Transgourmet Origine'], priceRange: '3-200€/kg' },
      { category: 'Boulangerie', examples: ['Pains artisanaux', 'Viennoiseries pur beurre', 'Pâtisseries fines'], priceRange: '0.40-3€/pièce' },
    ],
  },
  {
    name: 'Sysco France',
    type: 'national',
    categories: ['Viandes', 'Poissons', 'Légumes', 'Fruits', 'Produits laitiers', 'Féculents', 'Huiles', 'Surgelés', 'Boulangerie', 'Épicerie fine'],
    regions: [...FRENCH_REGIONS],
    description: 'Leader mondial de la distribution alimentaire pour la restauration avec plus de 8 500 références. Livraison tri-température en 24h. Présent via Brake France et Davigel.',
    website: 'https://www.sysco.fr',
    phone: '02 41 36 64 64',
    delivery: true,
    minOrder: '200€ HT minimum',
    speciality: 'Distribution foodservice intégrée, 8 500 références, livraison 24h',
    products: [
      { category: 'Viandes', examples: ['Steaks hachés', 'Rôti de bœuf', 'Escalope de dinde', 'Saucisses', 'Brochettes'], priceRange: '4-35€/kg' },
      { category: 'Légumes', examples: ['Mélanges légumes surgelés', 'Pommes de terre précuites', 'Légumes grillés'], priceRange: '1.50-8€/kg' },
      { category: 'Épicerie fine', examples: ['Sauces professionnelles', 'Bases culinaires', 'Condiments', 'Fonds et jus'], priceRange: '2-20€/L ou kg' },
      { category: 'Boulangerie', examples: ['Pain précuit', 'Viennoiseries surgelées', 'Desserts portion'], priceRange: '0.20-2.50€/pièce' },
      { category: 'Surgelés', examples: ['Plats cuisinés', 'Garnitures', 'Desserts', 'Entrées élaborées'], priceRange: '3-18€/kg' },
    ],
  },
  {
    name: 'Brake France (Sysco)',
    type: 'national',
    categories: ['Viandes', 'Poissons', 'Légumes', 'Fruits', 'Produits laitiers', 'Féculents', 'Surgelés', 'Boulangerie', 'Épicerie fine'],
    regions: [...FRENCH_REGIONS],
    description: 'Distributeur alimentaire pour la restauration hors domicile. Filiale du groupe Sysco. Livraison en multi-température (frais, surgelé, sec). Catalogues restauration commerciale, collective et scolaire.',
    website: 'https://www.brake.fr',
    phone: '02 41 36 64 64',
    delivery: true,
    minOrder: '150€ HT minimum',
    speciality: 'Livraison multi-température, restauration collective et commerciale',
    products: [
      { category: 'Surgelés', examples: ['Poissons panés', 'Pizzas', 'Légumes IQF', 'Glaces', 'Pâtisseries'], priceRange: '2-15€/kg' },
      { category: 'Viandes', examples: ['Poulet rôti', 'Sauté de veau', 'Jambon', 'Steaks hachés VBF'], priceRange: '4-30€/kg' },
      { category: 'Produits laitiers', examples: ['Fromages portions', 'Yaourts', 'Desserts lactés', 'Crème'], priceRange: '0.20-3€/pièce' },
    ],
  },

  // ===========================================================================
  // POMONA GROUP (spécialiste multi-métiers)
  // ===========================================================================

  {
    name: 'Pomona Group - TerreAzur',
    type: 'national',
    categories: ['Légumes', 'Fruits', 'Poissons'],
    regions: [...FRENCH_REGIONS],
    description: 'Branche fruits, légumes et produits de la mer du groupe Pomona. Plus de 100 ans d\'expérience. 36 catalogues spécialisés. Premier distributeur de fruits et légumes frais pour la restauration.',
    website: 'https://www.terreazur.fr',
    phone: '01 56 71 24 00',
    delivery: true,
    minOrder: '100€ HT minimum',
    speciality: 'Fruits et légumes frais, produits de la mer, circuits courts',
    products: [
      { category: 'Légumes', examples: ['Pommes de terre Agata', 'Carottes', 'Tomates', 'Patates douces', 'Céleri rave', 'Choux'], priceRange: '0.80-8€/kg' },
      { category: 'Fruits', examples: ['Pommes Gala', 'Poires Conférence', 'Agrumes', 'Fruits rouges', 'Mangues'], priceRange: '1.20-12€/kg' },
      { category: 'Poissons', examples: ['Bar', 'Dorade', 'Saumon', 'Coquillages', 'Crustacés', 'Crevettes'], priceRange: '8-60€/kg' },
    ],
  },
  {
    name: 'Pomona Group - PassionFroid',
    type: 'national',
    categories: ['Produits laitiers', 'Surgelés', 'Charcuterie', 'Fromages', 'Viandes'],
    regions: [...FRENCH_REGIONS],
    description: 'Branche produits frais carnés, laitiers et surgelés du groupe Pomona. CA de 2,24 milliards d\'euros. Plus de 4 500 références, 65 000 clients. Plus de 100 nouveautés par an.',
    website: 'https://www.passionfroid.fr',
    phone: '01 56 71 24 00',
    delivery: true,
    minOrder: '100€ HT minimum',
    speciality: 'Produits laitiers, surgelés, fromages, charcuterie, viandes fraîches',
    products: [
      { category: 'Produits laitiers', examples: ['Beurre AOP', 'Crème fraîche', 'Lait', 'Mascarpone', 'Ricotta'], priceRange: '2-15€/kg' },
      { category: 'Fromages', examples: ['Comté 18 mois', 'Brie de Meaux', 'Camembert AOP', 'Roquefort', 'Mozzarella'], priceRange: '5-40€/kg' },
      { category: 'Charcuterie', examples: ['Jambon blanc', 'Saucisson sec', 'Pâté en croûte', 'Rillettes', 'Terrines'], priceRange: '6-30€/kg' },
      { category: 'Surgelés', examples: ['Glaces artisanales', 'Cocktail salé', 'Entrées surgelées', 'Desserts'], priceRange: '3-20€/kg' },
      { category: 'Viandes', examples: ['Viande de bœuf', 'Volaille', 'Porc', 'Veau', 'Agneau'], priceRange: '5-45€/kg' },
    ],
  },
  {
    name: 'Pomona Group - EpiSaveurs',
    type: 'national',
    categories: ['Épices', 'Féculents', 'Huiles', 'Épicerie fine', 'Boissons'],
    regions: [...FRENCH_REGIONS],
    description: 'Branche épicerie, boissons et hygiène du groupe Pomona. Plus de 4 700 références. 1 500 employés, 8 divisions régionales, 35 000 clients. Gamme Esprit de Chefs (150 réf. épicerie fine).',
    website: 'https://www.episaveurs.fr',
    phone: '01 56 71 24 00',
    delivery: true,
    minOrder: '100€ HT minimum',
    speciality: 'Épicerie sèche, condiments, boissons, hygiène, gamme Esprit de Chefs',
    products: [
      { category: 'Épicerie fine', examples: ['Huiles d\'olive', 'Vinaigres', 'Moutardes', 'Sauces', 'Conserves fines'], priceRange: '2-30€/L ou kg' },
      { category: 'Épices', examples: ['Poivres du monde', 'Curry', 'Paprika', 'Cumin', 'Herbes de Provence'], priceRange: '5-80€/kg' },
      { category: 'Féculents', examples: ['Pâtes italiennes', 'Riz basmati', 'Semoule', 'Quinoa', 'Lentilles'], priceRange: '1-8€/kg' },
      { category: 'Boissons', examples: ['Eaux', 'Jus', 'Sirops', 'Café', 'Thé'], priceRange: '0.50-15€/L ou kg' },
    ],
  },
  {
    name: 'Pomona Group - Relais d\'Or',
    type: 'national',
    categories: ['Surgelés', 'Produits laitiers', 'Épicerie fine', 'Boissons'],
    regions: [...FRENCH_REGIONS],
    description: 'Leader de la distribution livrée aux restaurants indépendants. 3 500 produits en tri-température. Distributeur exclusif des glaces Unilever (Carte d\'Or, Magnum, Ben & Jerry\'s).',
    website: 'https://webshop.relaisdor.fr',
    phone: '01 56 71 24 00',
    delivery: true,
    minOrder: '80€ HT minimum',
    speciality: 'Restauration indépendante, tri-température, glaces Unilever',
    products: [
      { category: 'Surgelés', examples: ['Glaces Carte d\'Or', 'Magnum', 'Ben & Jerry\'s', 'Cornetto', 'Sorbets'], priceRange: '3-12€/L' },
      { category: 'Produits laitiers', examples: ['Crème UHT', 'Beurre portions', 'Fromages portions'], priceRange: '0.15-3€/pièce' },
      { category: 'Épicerie fine', examples: ['Sauces pro', 'Condiments', 'Bases cuisine'], priceRange: '2-15€/L' },
    ],
  },
  {
    name: 'Pomona Group - Délice & Création',
    type: 'national',
    categories: ['Boulangerie', 'Épicerie fine', 'Surgelés'],
    regions: [...FRENCH_REGIONS],
    description: 'Distributeur dédié aux artisans boulangers-pâtissiers. Plus de 3 000 références. 24 agences en France. Marques DGF et Four A Idées. Formation via l\'Académie des Experts.',
    website: 'https://www.deliceetcreation.fr',
    phone: '01 56 71 24 00',
    delivery: true,
    minOrder: '100€ HT minimum',
    speciality: 'Boulangerie-pâtisserie, ingrédients, emballages, formation',
    products: [
      { category: 'Boulangerie', examples: ['Farines', 'Levures', 'Améliorants', 'Viennoiseries surgelées', 'Pâtes feuilletées'], priceRange: '0.80-6€/kg' },
      { category: 'Épicerie fine', examples: ['Chocolat couverture', 'Pralinés', 'Fruits confits', 'Nappage', 'Décors'], priceRange: '5-40€/kg' },
      { category: 'Surgelés', examples: ['Fonds de tarte', 'Mini-viennoiseries', 'Pâtisseries individuelles'], priceRange: '0.30-3€/pièce' },
    ],
  },

  // ===========================================================================
  // RÉSEAU KRILL
  // ===========================================================================

  {
    name: 'Réseau Krill',
    type: 'national',
    categories: ['Viandes', 'Surgelés', 'Épicerie fine', 'Produits laitiers', 'Poissons'],
    regions: [...FRENCH_REGIONS],
    description: '8 grossistes régionaux spécialisés depuis 30 ans : So Breizh, Achille Bertrand, FMB, Gastronomie Service et plus. Plus de 4 000 références, près de 1 000 références viande. 60 bouchers experts.',
    website: 'https://www.krill.fr',
    phone: '02 99 04 40 40',
    delivery: true,
    minOrder: '150€ HT minimum',
    speciality: 'Expert viande (1000 réf.), glaces (350 réf.), distribution multi-température',
    products: [
      { category: 'Viandes', examples: ['Bœuf VBF', 'Porc VPF', 'Veau VVF', 'Agneau', 'Volaille', 'Viande Bleu-Blanc-Cœur'], priceRange: '5-45€/kg' },
      { category: 'Surgelés', examples: ['Glaces artisanales', 'Sorbets', 'Desserts glacés', 'Légumes IQF'], priceRange: '3-15€/kg' },
      { category: 'Épicerie fine', examples: ['Sauces pro', 'Fonds', 'Épicerie traiteur', 'Snacking'], priceRange: '2-20€/kg' },
    ],
  },

  // ===========================================================================
  // SURGELÉS SPÉCIALISTES
  // ===========================================================================

  {
    name: 'Davigel (Sysco)',
    type: 'national',
    categories: ['Surgelés', 'Poissons', 'Légumes', 'Boulangerie', 'Viandes'],
    regions: [...FRENCH_REGIONS],
    description: 'Spécialiste de la distribution de produits frais et surgelés depuis 50 ans. Plus de 3 000 produits répartis dans 10 gammes. 200+ réf. produits de la mer, 100+ réf. volaille.',
    website: 'https://www.davigel.fr',
    phone: '02 41 36 64 64',
    delivery: true,
    minOrder: '150€ HT minimum',
    speciality: 'Surgelés professionnels, 3 000 produits, 10 gammes',
    products: [
      { category: 'Poissons', examples: ['Saumon', 'Merlu', 'Bar', 'Dorade', 'Colin', 'Cabillaud', 'Crevettes', 'Noix de St-Jacques'], priceRange: '8-50€/kg' },
      { category: 'Viandes', examples: ['Dinde', 'Cuisses de lapin', 'Escalope poulet', 'Pintade', 'Caille', 'Magret canard'], priceRange: '5-35€/kg' },
      { category: 'Surgelés', examples: ['Pâtisseries surgelées', 'Entrées élaborées', 'Garnitures', 'Desserts'], priceRange: '3-20€/kg' },
      { category: 'Légumes', examples: ['Légumes grillés', 'Mélanges vapeur', 'Purées surgelées', 'Potages'], priceRange: '2-8€/kg' },
    ],
  },
  {
    name: 'Thiriet Professionnel',
    type: 'national',
    categories: ['Surgelés', 'Légumes', 'Viandes', 'Poissons', 'Boulangerie'],
    regions: [...FRENCH_REGIONS],
    description: 'Spécialiste français du surgelé haut de gamme, entreprise familiale lorraine fondée en 1973. Gamme professionnelle pour la restauration.',
    website: 'https://www.thiriet.com',
    phone: '03 29 63 63 63',
    delivery: true,
    speciality: 'Surgelés haut de gamme, produits élaborés français',
    products: [
      { category: 'Surgelés', examples: ['Plats cuisinés', 'Légumes', 'Poissons', 'Viandes', 'Desserts', 'Glaces'], priceRange: '3-25€/kg' },
    ],
  },
  {
    name: 'Picard Surgelés Professionnels',
    type: 'national',
    categories: ['Surgelés', 'Légumes', 'Poissons', 'Boulangerie'],
    regions: [...FRENCH_REGIONS],
    description: 'Offre professionnelle du leader français du surgelé. Plus de 1 000 magasins. Produits élaborés et matières premières surgelées premium.',
    website: 'https://www.picard.fr',
    phone: '01 40 80 60 00',
    delivery: true,
    speciality: 'Surgelés premium, produits élaborés, pâtisserie',
    products: [
      { category: 'Surgelés', examples: ['Petits fours', 'Tartes salées', 'Desserts fins', 'Accompagnements', 'Apéritifs'], priceRange: '4-25€/kg' },
    ],
  },

  // ===========================================================================
  // GROSSISTES VIANDES
  // ===========================================================================

  {
    name: 'Bigard',
    type: 'national',
    categories: ['Viandes', 'Charcuterie'],
    regions: [...FRENCH_REGIONS],
    description: 'Premier groupe européen de viande bovine et n°3 de la viande. CA de 5,5 milliards d\'euros. 60 sites industriels, 30 abattoirs, 15 000 employés. Traite 115 000 porcs/semaine et 24 000 gros bovins/semaine.',
    website: 'https://www.groupebigard.fr',
    phone: '02 97 93 01 01',
    delivery: true,
    minOrder: '300€ HT minimum',
    speciality: 'Viande bovine et porcine, découpe sur mesure, 60 sites industriels',
    products: [
      { category: 'Viandes', examples: ['Entrecôte', 'Faux-filet', 'Bavette', 'Côte de bœuf', 'Rôti de porc', 'Filet mignon'], priceRange: '5-50€/kg' },
      { category: 'Charcuterie', examples: ['Saucisses', 'Merguez', 'Chipolatas', 'Lardons', 'Paupiettes'], priceRange: '4-15€/kg' },
    ],
  },
  {
    name: 'Charal',
    type: 'national',
    categories: ['Viandes'],
    regions: [...FRENCH_REGIONS],
    description: 'Marque du groupe Bigard, leader de la viande bovine en France. Gamme professionnelle de steaks, pièces de boucherie et viande hachée pour la restauration.',
    website: 'https://www.charal.fr',
    phone: '02 97 93 01 01',
    delivery: true,
    minOrder: '250€ HT minimum',
    speciality: 'Viande bovine française, steaks, viande hachée fraîche',
    products: [
      { category: 'Viandes', examples: ['Steak haché 15%', 'Steak haché 5%', 'Tournedos', 'Carpaccio', 'Tartare de bœuf'], priceRange: '6-35€/kg' },
    ],
  },
  {
    name: 'Socopa',
    type: 'national',
    categories: ['Viandes', 'Charcuterie'],
    regions: [...FRENCH_REGIONS],
    description: 'Filiale du groupe Bigard, spécialisée dans la viande bovine et porcine. Réseau d\'abattoirs et d\'ateliers de découpe sur tout le territoire.',
    website: 'https://www.socopa.fr',
    phone: '02 97 93 01 01',
    delivery: true,
    speciality: 'Viande bovine, porcine, PAD (prêt à découper)',
    products: [
      { category: 'Viandes', examples: ['Rumsteck', 'Paleron', 'Jarret', 'Joue de bœuf', 'Longe de porc'], priceRange: '5-40€/kg' },
    ],
  },
  {
    name: 'SVA Jean Rozé',
    type: 'national',
    categories: ['Viandes', 'Charcuterie'],
    regions: [...FRENCH_REGIONS],
    departments: ['35', '29', '44', '56'],
    description: 'Filiale du groupe Leclerc, spécialisée dans l\'abattage et la transformation de viande bovine et porcine. Forte implantation dans le Grand Ouest.',
    website: 'https://www.sva-jeanroze.com',
    delivery: true,
    speciality: 'Viande bovine et porcine, abattage et découpe',
    products: [
      { category: 'Viandes', examples: ['Bœuf Origine France', 'Porc breton', 'Veaux', 'Pièces de gros'], priceRange: '5-35€/kg' },
    ],
  },
  {
    name: 'Duc',
    type: 'national',
    categories: ['Viandes'],
    regions: [...FRENCH_REGIONS],
    description: 'Spécialiste de la volaille française pour la restauration. Gamme complète : poulet, dinde, canard, pintade.',
    website: 'https://www.duc.fr',
    phone: '03 80 47 98 98',
    delivery: true,
    speciality: 'Volaille française, poulet Label Rouge',
    products: [
      { category: 'Viandes', examples: ['Poulet entier', 'Filet de poulet', 'Cuisses de canard', 'Pintade', 'Dinde escalope'], priceRange: '4-20€/kg' },
    ],
  },
  {
    name: 'LDC Groupe (Le Gaulois, Maître Coq)',
    type: 'national',
    categories: ['Viandes'],
    regions: [...FRENCH_REGIONS],
    description: 'Leader français de la volaille avec les marques Le Gaulois et Maître Coq. Gamme professionnelle complète pour la restauration.',
    website: 'https://www.ldc.fr',
    phone: '02 43 62 70 00',
    delivery: true,
    speciality: 'Volaille, traiteur, produits élaborés à base de volaille',
    products: [
      { category: 'Viandes', examples: ['Poulet fermier', 'Dinde rôtie', 'Nuggets', 'Cordon bleu', 'Aiguillettes'], priceRange: '4-18€/kg' },
    ],
  },

  // ===========================================================================
  // GROSSISTES POISSONS & FRUITS DE MER
  // ===========================================================================

  {
    name: 'Reynaud',
    type: 'national',
    categories: ['Poissons'],
    regions: [...FRENCH_REGIONS],
    description: 'Groupe familial spécialiste de la marée et des produits de la mer pour la restauration. Réseau de plateformes logistiques sur tout le territoire.',
    website: 'https://www.reynaud.com',
    phone: '04 42 97 75 00',
    delivery: true,
    minOrder: '150€ HT minimum',
    speciality: 'Poissons frais, fruits de mer, crustacés, marée',
    products: [
      { category: 'Poissons', examples: ['Bar de ligne', 'Sole', 'Turbot', 'Lotte', 'Rouget', 'Saint-Pierre', 'Homard', 'Langoustines'], priceRange: '10-80€/kg' },
    ],
  },
  {
    name: 'Capitaine Houat',
    type: 'national',
    categories: ['Poissons', 'Surgelés'],
    regions: [...FRENCH_REGIONS],
    description: 'Spécialiste des produits de la mer surgelés et frais pour la restauration. Gamme de poissons, crustacés et coquillages.',
    website: 'https://www.capitainehouat.com',
    delivery: true,
    speciality: 'Produits de la mer surgelés et frais, filets portionnés',
    products: [
      { category: 'Poissons', examples: ['Filets de cabillaud', 'Pavés de saumon', 'Crevettes décortiquées', 'Moules', 'Calamars'], priceRange: '7-40€/kg' },
    ],
  },
  {
    name: 'Sapmer',
    type: 'national',
    categories: ['Poissons', 'Surgelés'],
    regions: [...FRENCH_REGIONS],
    description: 'Armateur et distributeur de produits de la mer. Spécialiste de la légine australe et du thon. Pêche responsable et durable.',
    website: 'https://www.sapmer.com',
    phone: '02 62 40 27 27',
    delivery: true,
    speciality: 'Poissons d\'exception, légine australe, thon, pêche durable',
    products: [
      { category: 'Poissons', examples: ['Légine australe', 'Thon albacore', 'Thon rouge', 'Espadon'], priceRange: '15-90€/kg' },
    ],
  },

  // ===========================================================================
  // MARCHÉS DE GROS (MIN)
  // ===========================================================================

  {
    name: 'Marché International de Rungis',
    type: 'grossiste',
    categories: ['Viandes', 'Poissons', 'Légumes', 'Fruits', 'Produits laitiers', 'Fromages', 'Épicerie fine'],
    regions: ['Île-de-France'],
    departments: ['94'],
    cities: ['Rungis'],
    description: 'Le plus grand marché de produits frais au monde. 234 hectares, 1 200 entreprises. Accès réservé aux professionnels (carte d\'acheteur obligatoire). Cotations prix de gros quotidiennes.',
    website: 'https://www.rungisinternational.com',
    phone: '01 45 12 28 00',
    delivery: false,
    speciality: 'Tous produits frais, marché de gros, meilleurs prix sur volumes',
    products: [
      { category: 'Viandes', examples: ['Bœuf en gros', 'Veau', 'Agneau', 'Porc', 'Volaille fermière', 'Gibier'], priceRange: '3-50€/kg' },
      { category: 'Poissons', examples: ['Arrivages quotidiens', 'Poissons de ligne', 'Crustacés vivants', 'Coquillages'], priceRange: '5-100€/kg' },
      { category: 'Légumes', examples: ['Primeurs', 'Légumes de saison', 'Herbes fraîches', 'Champignons sauvages'], priceRange: '0.50-25€/kg' },
      { category: 'Fruits', examples: ['Fruits de saison', 'Fruits exotiques', 'Agrumes', 'Petits fruits'], priceRange: '1-20€/kg' },
      { category: 'Fromages', examples: ['AOP français', 'Fromages affinés', 'Plateaux de fromages'], priceRange: '5-60€/kg' },
    ],
  },
  {
    name: 'Marché de gros de Lyon (MIN de Corbas)',
    type: 'grossiste',
    categories: ['Légumes', 'Fruits', 'Viandes', 'Fromages'],
    regions: ['Auvergne-Rhône-Alpes'],
    departments: ['69', '38', '42', '01'],
    cities: ['Lyon', 'Corbas'],
    description: 'Deuxième marché de gros de France. Grossistes en produits frais, spécialités lyonnaises.',
    delivery: false,
    speciality: 'Produits lyonnais, fromages régionaux, charcuterie',
    products: [
      { category: 'Fromages', examples: ['Saint-Marcellin', 'Beaufort', 'Reblochon', 'Tomme de Savoie'], priceRange: '6-35€/kg' },
      { category: 'Légumes', examples: ['Légumes du Rhône', 'Salades', 'Herbes', 'Champignons'], priceRange: '0.80-15€/kg' },
    ],
  },
  {
    name: 'Marché de gros de Marseille (MIN des Arnavaux)',
    type: 'grossiste',
    categories: ['Légumes', 'Fruits', 'Poissons'],
    regions: ['Provence-Alpes-Côte d\'Azur'],
    departments: ['13', '83', '84'],
    cities: ['Marseille'],
    description: 'Marché d\'intérêt national de Marseille. Grossistes en fruits, légumes et produits de la mer méditerranéens.',
    delivery: false,
    speciality: 'Produits méditerranéens, poissons de Méditerranée, primeurs',
    products: [
      { category: 'Poissons', examples: ['Rascasse', 'Loup de mer', 'Rouget', 'Poulpe', 'Sardines', 'Anchois'], priceRange: '5-60€/kg' },
      { category: 'Légumes', examples: ['Tomates provençales', 'Aubergines', 'Courgettes', 'Artichauts', 'Herbes fraîches'], priceRange: '0.80-8€/kg' },
    ],
  },
  {
    name: 'Marché de gros de Rennes (MIN)',
    type: 'grossiste',
    categories: ['Légumes', 'Fruits', 'Poissons'],
    regions: ['Bretagne'],
    departments: ['35', '22', '56', '29'],
    cities: ['Rennes'],
    description: 'Marché d\'intérêt national de Rennes. Spécialiste des produits bretons.',
    delivery: false,
    speciality: 'Légumes bretons, produits de la mer, artichaut de Bretagne',
    products: [
      { category: 'Légumes', examples: ['Artichaut', 'Chou-fleur', 'Échalotes', 'Oignons rosés', 'Pommes de terre'], priceRange: '0.60-5€/kg' },
      { category: 'Poissons', examples: ['Huîtres de Cancale', 'Homard breton', 'Bar', 'Lieu jaune', 'Coquilles St-Jacques'], priceRange: '6-50€/kg' },
    ],
  },
  {
    name: 'Marché de gros de Toulouse (MIN)',
    type: 'grossiste',
    categories: ['Légumes', 'Fruits', 'Viandes'],
    regions: ['Occitanie'],
    departments: ['31', '32', '81', '82'],
    cities: ['Toulouse'],
    description: 'Marché d\'intérêt national de Toulouse. Produits du Sud-Ouest.',
    delivery: false,
    speciality: 'Canard, foie gras, produits du Sud-Ouest',
    products: [
      { category: 'Viandes', examples: ['Canard gras', 'Foie gras frais', 'Confit de canard', 'Magret', 'Gésiers'], priceRange: '5-80€/kg' },
      { category: 'Fruits', examples: ['Pruneaux d\'Agen', 'Chasselas de Moissac', 'Melons du Quercy'], priceRange: '2-10€/kg' },
    ],
  },
  {
    name: 'Marché de gros de Nantes (MIN)',
    type: 'grossiste',
    categories: ['Légumes', 'Fruits', 'Poissons'],
    regions: ['Pays de la Loire'],
    departments: ['44', '85', '49'],
    cities: ['Nantes'],
    description: 'Marché d\'intérêt national de Nantes. Produits maraîchers nantais et produits de la mer atlantique.',
    delivery: false,
    speciality: 'Mâche nantaise, produits de la mer, maraîchage',
    products: [
      { category: 'Légumes', examples: ['Mâche nantaise', 'Muguet', 'Radis', 'Poireaux', 'Navets'], priceRange: '0.80-6€/kg' },
      { category: 'Poissons', examples: ['Sole', 'Sardine', 'Langoustine', 'Bar', 'Merlu'], priceRange: '6-45€/kg' },
    ],
  },
  {
    name: 'Marché de gros de Bordeaux (MIN de Brienne)',
    type: 'grossiste',
    categories: ['Légumes', 'Fruits', 'Poissons', 'Viandes'],
    regions: ['Nouvelle-Aquitaine'],
    departments: ['33', '40', '24', '47'],
    cities: ['Bordeaux'],
    description: 'Marché d\'intérêt national de Bordeaux. Produits du Sud-Ouest et du bassin d\'Arcachon.',
    delivery: false,
    speciality: 'Huîtres du bassin d\'Arcachon, cèpes, asperges du Blayais',
    products: [
      { category: 'Poissons', examples: ['Huîtres d\'Arcachon', 'Sole', 'Bar', 'Anguille', 'Lamproie'], priceRange: '5-40€/kg' },
      { category: 'Légumes', examples: ['Asperges', 'Cèpes', 'Tomates', 'Haricots verts'], priceRange: '1-40€/kg' },
    ],
  },
  {
    name: 'Marché de gros de Strasbourg (MIN)',
    type: 'grossiste',
    categories: ['Légumes', 'Fruits', 'Viandes', 'Charcuterie'],
    regions: ['Grand Est'],
    departments: ['67', '68'],
    cities: ['Strasbourg'],
    description: 'Marché d\'intérêt national de Strasbourg. Spécialités alsaciennes et produits frontaliers.',
    delivery: false,
    speciality: 'Charcuterie alsacienne, choucroute, produits frontaliers',
    products: [
      { category: 'Charcuterie', examples: ['Knack', 'Saucisse de Strasbourg', 'Presskopf', 'Lard fumé'], priceRange: '5-20€/kg' },
      { category: 'Légumes', examples: ['Choucroute', 'Asperges d\'Alsace', 'Navets', 'Pommes de terre'], priceRange: '0.80-8€/kg' },
    ],
  },
  {
    name: 'Marché de gros de Lille (MIN de Lomme)',
    type: 'grossiste',
    categories: ['Légumes', 'Fruits', 'Poissons'],
    regions: ['Hauts-de-France'],
    departments: ['59', '62'],
    cities: ['Lille', 'Lomme'],
    description: 'Marché d\'intérêt national de Lille. Endives, produits du Nord et produits de la mer.',
    delivery: false,
    speciality: 'Endives, produits ch\'tis, poissons de la Manche',
    products: [
      { category: 'Légumes', examples: ['Endives', 'Pommes de terre', 'Poireaux', 'Betteraves'], priceRange: '0.60-5€/kg' },
    ],
  },

  // ===========================================================================
  // PRODUITS LAITIERS & FROMAGES
  // ===========================================================================

  {
    name: 'Lactalis Foodservice',
    type: 'national',
    categories: ['Produits laitiers', 'Fromages'],
    regions: [...FRENCH_REGIONS],
    description: 'Division restauration du groupe Lactalis, premier groupe laitier mondial. Marques : Président, Société, Galbani, Bridel, Lactel.',
    website: 'https://www.lactalis-foodservice.fr',
    phone: '02 43 59 42 42',
    delivery: true,
    speciality: 'Fromages, beurre, crème, lait, produits laitiers professionnels',
    products: [
      { category: 'Fromages', examples: ['Président Emmental', 'Société Roquefort', 'Galbani Mozzarella', 'Brie Président'], priceRange: '4-30€/kg' },
      { category: 'Produits laitiers', examples: ['Beurre Président', 'Crème Bridel', 'Lait Lactel', 'Mascarpone Galbani'], priceRange: '1-12€/kg' },
    ],
  },
  {
    name: 'Président Professionnel',
    type: 'national',
    categories: ['Produits laitiers', 'Fromages'],
    regions: [...FRENCH_REGIONS],
    description: 'Gamme professionnelle de la marque Président (groupe Lactalis). Beurre, crème, fromages en formats restauration.',
    website: 'https://www.president-professionnel.fr',
    phone: '02 43 59 42 42',
    delivery: true,
    speciality: 'Beurre gastronomique, crème, fromages en portions CHR',
    products: [
      { category: 'Produits laitiers', examples: ['Beurre gastronomique 82%', 'Beurre doux micro-plaquettes', 'Crème 35%', 'Crème épaisse'], priceRange: '3-15€/kg' },
      { category: 'Fromages', examples: ['Camembert portions', 'Emmental râpé', 'Brie portion', 'Coulommiers'], priceRange: '0.20-2€/portion' },
    ],
  },
  {
    name: 'Elle & Vire Professionnel',
    type: 'national',
    categories: ['Produits laitiers'],
    regions: [...FRENCH_REGIONS],
    description: 'Gamme professionnelle de crèmes, beurres et produits laitiers pour la restauration et la pâtisserie. Marque du groupe Savencia.',
    website: 'https://www.elle-et-vire.com/fr/professionnel',
    phone: '02 33 17 60 00',
    delivery: true,
    speciality: 'Crème professionnelle, beurre de tourage, produits pâtisserie',
    products: [
      { category: 'Produits laitiers', examples: ['Crème Excellence 35%', 'Beurre de tourage', 'Beurre AOP Charentes', 'Crème Mascarpone'], priceRange: '3-18€/kg' },
    ],
  },
  {
    name: 'Savencia Fromage & Dairy',
    type: 'national',
    categories: ['Produits laitiers', 'Fromages'],
    regions: [...FRENCH_REGIONS],
    description: 'Groupe fromager français. Marques : Caprice des Dieux, Tartare, Saint Albray, Elle & Vire, Vieux Pané. Gamme professionnelle.',
    website: 'https://www.savencia-fd.com',
    phone: '01 34 58 63 00',
    delivery: true,
    speciality: 'Fromages de spécialité, crème Elle & Vire professionnelle',
    products: [
      { category: 'Fromages', examples: ['Caprice des Dieux', 'Tartare', 'Saint Albray', 'Cœur de Lion', 'Chavroux'], priceRange: '0.30-3€/portion' },
    ],
  },
  {
    name: 'Isigny Sainte-Mère',
    type: 'specialiste',
    categories: ['Produits laitiers', 'Fromages'],
    regions: [...FRENCH_REGIONS],
    departments: ['14'],
    cities: ['Isigny-sur-Mer'],
    description: 'Coopérative laitière normande. Beurre et crème d\'Isigny AOP, camembert de Normandie AOP. Gamme professionnelle disponible.',
    website: 'https://www.isigny-ste-mere.com',
    phone: '02 31 51 33 33',
    delivery: true,
    speciality: 'Beurre AOP Isigny, crème AOP, camembert de Normandie AOP',
    products: [
      { category: 'Produits laitiers', examples: ['Beurre AOP Isigny', 'Crème AOP Isigny', 'Mimolette', 'Camembert AOP'], priceRange: '5-20€/kg' },
    ],
  },

  // ===========================================================================
  // BOULANGERIE / PÂTISSERIE
  // ===========================================================================

  {
    name: 'Bridor (Le Duff)',
    type: 'national',
    categories: ['Boulangerie', 'Surgelés'],
    regions: [...FRENCH_REGIONS],
    description: 'Leader mondial du pain et de la viennoiserie surgelés. Filiale du groupe Le Duff. Produits crus et précuits surgelés pour la restauration.',
    website: 'https://www.bridor.com',
    phone: '02 41 18 18 18',
    delivery: true,
    minOrder: '200€ HT minimum',
    speciality: 'Pains surgelés, viennoiseries, pâtisseries pour la restauration',
    products: [
      { category: 'Boulangerie', examples: ['Baguette précuite', 'Pain de campagne', 'Croissant pur beurre', 'Pain au chocolat', 'Brioche'], priceRange: '0.15-1.50€/pièce' },
    ],
  },
  {
    name: 'Délifrance',
    type: 'national',
    categories: ['Boulangerie', 'Surgelés'],
    regions: [...FRENCH_REGIONS],
    description: 'Spécialiste de la boulangerie-viennoiserie surgelée. Présent dans plus de 100 pays. Pains, viennoiseries et pâtisseries.',
    website: 'https://www.delifrance.com',
    phone: '01 55 56 55 56',
    delivery: true,
    speciality: 'Boulangerie surgelée premium, viennoiseries, mini-pâtisseries',
    products: [
      { category: 'Boulangerie', examples: ['Petits pains', 'Baguettines', 'Croissants', 'Muffins', 'Cookies'], priceRange: '0.10-2€/pièce' },
    ],
  },
  {
    name: 'Coup de Pates',
    type: 'national',
    categories: ['Boulangerie', 'Surgelés'],
    regions: [...FRENCH_REGIONS],
    description: 'Fabricant français de produits de boulangerie-viennoiserie surgelés. Pâtes feuilletées, brisées et produits traiteur.',
    website: 'https://www.coupdepates.com',
    delivery: true,
    speciality: 'Pâtes feuilletées, brisées, viennoiseries crues surgelées',
    products: [
      { category: 'Boulangerie', examples: ['Pâte feuilletée', 'Pâte brisée', 'Pâte sablée', 'Fonds de tarte', 'Vol-au-vent'], priceRange: '0.50-3€/pièce' },
    ],
  },
  {
    name: 'Valrhona',
    type: 'national',
    categories: ['Épicerie fine', 'Boulangerie'],
    regions: [...FRENCH_REGIONS],
    departments: ['26'],
    cities: ['Tain-l\'Hermitage'],
    description: 'Chocolatier français de renom, fournisseur de chocolat de couverture haut de gamme pour les professionnels de la pâtisserie et de la restauration.',
    website: 'https://www.valrhona.com',
    phone: '04 75 09 28 28',
    delivery: true,
    minOrder: '100€ HT minimum',
    speciality: 'Chocolat de couverture grand cru, cacao, ingrédients pâtisserie',
    products: [
      { category: 'Épicerie fine', examples: ['Guanaja 70%', 'Jivara 40%', 'Ivoire 35%', 'Caramélia 36%', 'Cacao poudre'], priceRange: '15-50€/kg' },
    ],
  },
  {
    name: 'Cacao Barry (Barry Callebaut)',
    type: 'national',
    categories: ['Épicerie fine', 'Boulangerie'],
    regions: [...FRENCH_REGIONS],
    description: 'Fournisseur mondial de chocolat de couverture. Ingrédients pour pâtisserie et chocolaterie professionnelle.',
    website: 'https://www.cacao-barry.com',
    phone: '01 41 31 50 00',
    delivery: true,
    speciality: 'Chocolat de couverture, cacao, pralinés, décors chocolat',
    products: [
      { category: 'Épicerie fine', examples: ['Fleur de Cao 70%', 'Alunga 41%', 'Zéphyr 34%', 'Pailletés', 'Pralinés'], priceRange: '12-45€/kg' },
    ],
  },
  {
    name: 'Patisfrance (Puratos)',
    type: 'national',
    categories: ['Boulangerie', 'Épicerie fine'],
    regions: [...FRENCH_REGIONS],
    description: 'Fournisseur d\'ingrédients et de solutions pour boulangerie, pâtisserie et chocolaterie. Filiale de Puratos.',
    website: 'https://www.puratos.fr',
    phone: '01 43 11 26 00',
    delivery: true,
    speciality: 'Ingrédients pâtisserie, chocolat de couverture, préparations',
    products: [
      { category: 'Boulangerie', examples: ['Améliorants', 'Préparations', 'Fourrages', 'Garnitures', 'Glaçages'], priceRange: '3-25€/kg' },
    ],
  },

  // ===========================================================================
  // BOISSONS
  // ===========================================================================

  {
    name: 'France Boissons',
    type: 'national',
    categories: ['Boissons'],
    regions: [...FRENCH_REGIONS],
    description: 'Premier distributeur de boissons CHR en France. Filiale Heineken. 72 centres de distribution, 52 000 établissements livrés. 7 000 références, 8 catégories. Livre 1/4 des CHR français.',
    website: 'https://www.france-boissons.fr',
    phone: '01 58 10 28 28',
    delivery: true,
    minOrder: '150€ HT minimum',
    speciality: 'Bières, vins, spiritueux, softs, 7 000 références CHR',
    products: [
      { category: 'Boissons', examples: ['Heineken fût 30L', 'Desperados', 'Affligem', 'Pelforth', 'Vins sélection', 'Spiritueux', 'Sodas'], priceRange: '0.50-8€/L' },
    ],
  },
  {
    name: 'C10 - Les Comptoirs du CHR',
    type: 'national',
    categories: ['Boissons'],
    regions: [...FRENCH_REGIONS],
    description: 'Réseau de 230 entrepôts et 700 camions. Groupement coopératif de distributeurs indépendants. Plus de 40 marques propres.',
    website: 'https://www.c10.fr',
    phone: '05 57 54 23 23',
    delivery: true,
    minOrder: '100€ HT minimum',
    speciality: 'Distribution boissons CHR, 40+ marques propres, 230 entrepôts',
    products: [
      { category: 'Boissons', examples: ['Bières', 'Vins', 'Spiritueux', 'Cafés', 'Eaux', 'Softs', 'Sirops'], priceRange: '0.30-15€/L' },
    ],
  },
  {
    name: 'Distriboissons',
    type: 'national',
    categories: ['Boissons'],
    regions: [...FRENCH_REGIONS],
    description: 'Réseau de distributeurs de boissons pour les professionnels CHR. Groupement d\'indépendants couvrant tout le territoire.',
    website: 'https://www.distriboissons.com',
    delivery: true,
    speciality: 'Boissons CHR, offre locale et nationale',
    products: [
      { category: 'Boissons', examples: ['Bières artisanales', 'Vins régionaux', 'Champagnes', 'Softs', 'Eaux'], priceRange: '0.40-12€/L' },
    ],
  },
  {
    name: 'Elidis (Pernod Ricard)',
    type: 'national',
    categories: ['Boissons'],
    regions: [...FRENCH_REGIONS],
    description: 'Filiale de distribution boissons du groupe Pernod Ricard. Spiritueux premium, vins, champagnes pour CHR.',
    website: 'https://www.elidis.com',
    delivery: true,
    speciality: 'Spiritueux premium, vins, champagnes pour CHR',
    products: [
      { category: 'Boissons', examples: ['Ricard', 'Absolut', 'Jameson', 'Beefeater', 'Champagne Perrier-Jouët', 'Vins Jacob\'s Creek'], priceRange: '5-50€/L' },
    ],
  },

  // ===========================================================================
  // FRUITS & LÉGUMES SPÉCIALISTES
  // ===========================================================================

  {
    name: 'Grand Frais Pro',
    type: 'national',
    categories: ['Légumes', 'Fruits', 'Produits laitiers', 'Fromages', 'Épicerie fine'],
    regions: ['Île-de-France', 'Auvergne-Rhône-Alpes', 'Provence-Alpes-Côte d\'Azur', 'Occitanie', 'Nouvelle-Aquitaine'],
    description: 'Service professionnel du réseau Grand Frais. Fruits et légumes frais, crémerie et épicerie fine sélectionnés.',
    website: 'https://www.grandfrais.com',
    delivery: true,
    speciality: 'Fruits et légumes frais, produits de qualité, circuits courts',
    products: [
      { category: 'Fruits', examples: ['Fruits de saison premium', 'Fruits exotiques', 'Agrumes'], priceRange: '1.50-12€/kg' },
      { category: 'Légumes', examples: ['Légumes frais', 'Herbes', 'Salades', 'Champignons'], priceRange: '1-10€/kg' },
    ],
  },
  {
    name: 'Pronatura',
    type: 'national',
    categories: ['Légumes', 'Fruits', 'Bio'],
    regions: [...FRENCH_REGIONS],
    description: 'Distributeur de fruits et légumes bio et conventionnels. Approvisionnement direct producteurs, filières courtes.',
    website: 'https://www.pronatura.com',
    phone: '04 32 81 57 57',
    delivery: true,
    minOrder: '100€ HT minimum',
    speciality: 'Fruits et légumes bio et conventionnels, circuits courts',
    products: [
      { category: 'Légumes', examples: ['Tomates bio', 'Carottes bio', 'Courgettes', 'Poivrons', 'Herbes'], priceRange: '1.50-10€/kg' },
      { category: 'Fruits', examples: ['Pommes bio', 'Poires', 'Kiwis', 'Agrumes bio'], priceRange: '2-12€/kg' },
    ],
  },
  {
    name: 'Bonduelle Foodservice',
    type: 'national',
    categories: ['Légumes', 'Surgelés'],
    regions: [...FRENCH_REGIONS],
    description: 'Gamme professionnelle de Bonduelle : légumes en conserve, surgelés et frais prêts à l\'emploi pour la restauration.',
    website: 'https://www.bonduelle-foodservice.fr',
    phone: '03 20 43 60 60',
    delivery: true,
    speciality: 'Légumes prêts à l\'emploi, conserves, surgelés, vapeur',
    products: [
      { category: 'Légumes', examples: ['Haricots verts', 'Petits pois', 'Maïs', 'Mélanges vapeur', 'Purées'], priceRange: '1.50-6€/kg' },
    ],
  },
  {
    name: 'D\'aucy Foodservice',
    type: 'national',
    categories: ['Légumes', 'Surgelés', 'Féculents'],
    regions: [...FRENCH_REGIONS],
    description: 'Gamme professionnelle de la coopérative d\'Aucy. Légumes bretons en conserve et surgelés, légumineuses.',
    website: 'https://www.daucy-foodservice.fr',
    phone: '02 97 64 34 34',
    delivery: true,
    speciality: 'Légumes bretons, conserves, surgelés, légumineuses',
    products: [
      { category: 'Légumes', examples: ['Haricots verts fins', 'Petits pois', 'Flageolets', 'Lentilles', 'Pois chiches'], priceRange: '1-5€/kg' },
    ],
  },

  // ===========================================================================
  // ÉPICERIE FINE / BIO / SPÉCIALITÉS
  // ===========================================================================

  {
    name: 'Biocoop Pro',
    type: 'national',
    categories: ['Bio', 'Légumes', 'Fruits', 'Épicerie fine', 'Produits laitiers'],
    regions: [...FRENCH_REGIONS],
    description: 'Offre professionnelle du premier réseau de magasins bio en France. Produits biologiques certifiés.',
    website: 'https://www.biocoop.fr',
    phone: '01 44 11 13 60',
    delivery: true,
    minOrder: '200€ HT minimum',
    speciality: 'Produits 100% bio, commerce équitable, local',
    products: [
      { category: 'Bio', examples: ['Fruits et légumes bio', 'Épicerie bio', 'Produits laitiers bio', 'Farines bio', 'Huiles bio'], priceRange: '2-20€/kg' },
    ],
  },
  {
    name: 'Relais Vert',
    type: 'national',
    categories: ['Bio', 'Légumes', 'Fruits', 'Épicerie fine', 'Féculents'],
    regions: [...FRENCH_REGIONS],
    description: 'Grossiste et distributeur de produits biologiques. Large gamme d\'épicerie sèche, fruits et légumes bio.',
    website: 'https://www.relais-vert.com',
    phone: '04 66 77 32 32',
    delivery: true,
    minOrder: '150€ HT minimum',
    speciality: 'Grossiste bio, épicerie sèche bio, fruits et légumes bio',
    products: [
      { category: 'Bio', examples: ['Riz bio', 'Pâtes bio', 'Huiles bio', 'Conserves bio', 'Légumineuses bio'], priceRange: '2-15€/kg' },
    ],
  },
  {
    name: 'NaturDis',
    type: 'specialiste',
    categories: ['Bio', 'Épicerie fine', 'Légumes', 'Fruits'],
    regions: ['Provence-Alpes-Côte d\'Azur'],
    departments: ['06', '83'],
    description: 'Leader de la distribution de produits alimentaires BIO sur les Alpes-Maritimes et le Var. Distribution dans toute la France.',
    website: 'https://www.naturdis.fr',
    delivery: true,
    speciality: 'Produits bio, circuits courts, produits locaux PACA',
    products: [
      { category: 'Bio', examples: ['Fruits bio méditerranéens', 'Légumes bio locaux', 'Épicerie bio', 'Huiles bio'], priceRange: '2-18€/kg' },
    ],
  },

  // ===========================================================================
  // ÉPICES & CONDIMENTS
  // ===========================================================================

  {
    name: 'Ducros Professionnel (McCormick)',
    type: 'national',
    categories: ['Épices'],
    regions: [...FRENCH_REGIONS],
    description: 'Gamme professionnelle de la marque Ducros (groupe McCormick). Épices, herbes aromatiques, condiments en formats restauration.',
    website: 'https://www.ducros-foodservice.fr',
    phone: '04 90 78 39 39',
    delivery: true,
    speciality: 'Épices, herbes, mélanges, poivres, condiments professionnels',
    products: [
      { category: 'Épices', examples: ['Poivre noir moulu', 'Paprika', 'Curry', 'Thym', 'Laurier', 'Herbes de Provence'], priceRange: '8-60€/kg' },
    ],
  },
  {
    name: 'Terre Exotique',
    type: 'specialiste',
    categories: ['Épices', 'Épicerie fine'],
    regions: [...FRENCH_REGIONS],
    description: 'Maison française d\'épices d\'exception. Sélection d\'épices rares et de poivres du monde entier. Fournisseur de chefs étoilés.',
    website: 'https://www.terreexotique.fr',
    phone: '05 53 57 60 80',
    delivery: true,
    minOrder: '80€ HT minimum',
    speciality: 'Épices rares, poivres d\'exception, vanille, safran',
    products: [
      { category: 'Épices', examples: ['Poivre de Kampot', 'Vanille de Madagascar', 'Safran', 'Piment d\'Espelette', 'Curcuma'], priceRange: '15-500€/kg' },
    ],
  },
  {
    name: 'Albert Ménès',
    type: 'specialiste',
    categories: ['Épices', 'Épicerie fine', 'Huiles'],
    regions: [...FRENCH_REGIONS],
    description: 'Maison d\'épicerie fine française depuis 1921. Épices, condiments, huiles, vinaigres et produits fins.',
    website: 'https://www.albertmenes.fr',
    delivery: true,
    speciality: 'Épicerie fine, épices premium, huiles et vinaigres de qualité',
    products: [
      { category: 'Épicerie fine', examples: ['Huile d\'olive premium', 'Vinaigre balsamique', 'Moutardes fines', 'Sel de Guérande', 'Poivres'], priceRange: '5-40€/unité' },
    ],
  },

  // ===========================================================================
  // HUILES & CONDIMENTS
  // ===========================================================================

  {
    name: 'Lesieur Professionnel',
    type: 'national',
    categories: ['Huiles', 'Épicerie fine'],
    regions: [...FRENCH_REGIONS],
    description: 'Gamme professionnelle de Lesieur : huiles de friture, huiles de cuisson, vinaigrettes, sauces et mayonnaises.',
    website: 'https://www.lesieur-foodservice.fr',
    phone: '01 58 86 64 00',
    delivery: true,
    speciality: 'Huiles professionnelles, huiles de friture, sauces, vinaigrettes',
    products: [
      { category: 'Huiles', examples: ['Huile de tournesol friture', 'Huile olive', 'Huile colza', 'Mayonnaise', 'Vinaigrette'], priceRange: '2-12€/L' },
    ],
  },
  {
    name: 'Maille Professionnel',
    type: 'national',
    categories: ['Épices', 'Épicerie fine'],
    regions: [...FRENCH_REGIONS],
    description: 'Gamme professionnelle de la maison Maille. Moutardes, vinaigres, cornichons en formats restauration.',
    website: 'https://www.maille.com',
    delivery: true,
    speciality: 'Moutardes de Dijon, vinaigres, cornichons professionnels',
    products: [
      { category: 'Épicerie fine', examples: ['Moutarde de Dijon', 'Moutarde à l\'ancienne', 'Vinaigre de vin', 'Cornichons'], priceRange: '3-15€/kg ou L' },
    ],
  },

  // ===========================================================================
  // FÉCULENTS & PÂTES
  // ===========================================================================

  {
    name: 'Panzani Foodservice',
    type: 'national',
    categories: ['Féculents'],
    regions: [...FRENCH_REGIONS],
    description: 'Gamme professionnelle de Panzani : pâtes, riz, semoule, sauces. Leader des pâtes en France.',
    website: 'https://www.panzani-foodservice.fr',
    phone: '04 72 68 30 00',
    delivery: true,
    speciality: 'Pâtes, riz, semoule, sauces tomate en formats professionnels',
    products: [
      { category: 'Féculents', examples: ['Spaghetti 5kg', 'Penne', 'Fusilli', 'Coquillettes', 'Riz long grain', 'Semoule fine'], priceRange: '0.80-4€/kg' },
    ],
  },
  {
    name: 'Tipiak Foodservice',
    type: 'national',
    categories: ['Féculents', 'Surgelés'],
    regions: [...FRENCH_REGIONS],
    description: 'Solutions culinaires pour la restauration : couscous, taboulé, spécialités surgelées, produits traiteur.',
    website: 'https://www.tipiak.fr',
    phone: '02 51 45 37 37',
    delivery: true,
    speciality: 'Couscous, céréales, spécialités traiteur, mini-bouchées surgelées',
    products: [
      { category: 'Féculents', examples: ['Couscous', 'Taboulé', 'Quinoa', 'Boulgour', 'Blé précuit'], priceRange: '1.50-6€/kg' },
    ],
  },

  // ===========================================================================
  // CHARCUTERIE / TRAITEUR
  // ===========================================================================

  {
    name: 'Fleury Michon Foodservice',
    type: 'national',
    categories: ['Charcuterie', 'Viandes', 'Surgelés'],
    regions: [...FRENCH_REGIONS],
    description: 'Gamme professionnelle : charcuterie, plats cuisinés, surimi. Solutions pour restauration collective et commerciale.',
    website: 'https://www.fleurymichon.fr',
    phone: '02 51 66 32 32',
    delivery: true,
    speciality: 'Charcuterie, jambon, plats cuisinés, surimi professionnel',
    products: [
      { category: 'Charcuterie', examples: ['Jambon supérieur', 'Jambon de Bayonne', 'Surimi', 'Plats cuisinés', 'Pâté'], priceRange: '5-25€/kg' },
    ],
  },
  {
    name: 'Madrange',
    type: 'national',
    categories: ['Charcuterie', 'Viandes'],
    regions: [...FRENCH_REGIONS],
    description: 'Charcutier français spécialisé dans le jambon et les produits de charcuterie premium.',
    website: 'https://www.madrange.fr',
    phone: '05 55 50 43 43',
    delivery: true,
    speciality: 'Jambon supérieur, charcuterie premium, produits tranchés',
    products: [
      { category: 'Charcuterie', examples: ['Jambon Le Tradition', 'Rôti de porc', 'Pâté de campagne', 'Mousse de canard'], priceRange: '6-25€/kg' },
    ],
  },
  {
    name: 'Hénaff',
    type: 'specialiste',
    categories: ['Charcuterie', 'Épicerie fine'],
    regions: [...FRENCH_REGIONS],
    departments: ['29'],
    cities: ['Pouldreuzic'],
    description: 'Entreprise familiale bretonne fondée en 1907. Célèbre pour son pâté Hénaff. Gamme de charcuterie et conserves.',
    website: 'https://www.henaff.com',
    phone: '02 98 51 53 53',
    delivery: true,
    speciality: 'Pâté Hénaff, saucisses cocktail, rillettes, terrines',
    products: [
      { category: 'Charcuterie', examples: ['Pâté Hénaff', 'Saucisses cocktail', 'Rillettes de porc', 'Terrines bretonnes'], priceRange: '8-20€/kg' },
    ],
  },

  // ===========================================================================
  // SPÉCIALISTES GASTRONOMIQUES
  // ===========================================================================

  {
    name: 'Koppert Cress',
    type: 'specialiste',
    categories: ['Légumes', 'Épicerie fine'],
    regions: [...FRENCH_REGIONS],
    description: 'Producteur de micro-pousses, fleurs comestibles et cressonnettes pour la haute gastronomie. Fournisseur de restaurants étoilés.',
    website: 'https://www.koppertcress.com',
    delivery: true,
    minOrder: '50€ HT minimum',
    speciality: 'Micro-pousses, fleurs comestibles, garnitures gastronomiques',
    products: [
      { category: 'Légumes', examples: ['Shiso Purple', 'Daikon Cress', 'Tahoon Cress', 'Fleurs comestibles', 'Micro-pousses'], priceRange: '15-60€/barquette' },
    ],
  },
  {
    name: 'Plantin',
    type: 'specialiste',
    categories: ['Épicerie fine'],
    regions: [...FRENCH_REGIONS],
    departments: ['84'],
    cities: ['Puyméras'],
    description: 'Maison de la truffe depuis 1930. Truffes fraîches et produits truffés pour la restauration gastronomique.',
    website: 'https://www.plantin.com',
    phone: '04 90 46 41 45',
    delivery: true,
    minOrder: '100€ HT minimum',
    speciality: 'Truffes fraîches, brisures, huile truffée, jus de truffe',
    products: [
      { category: 'Épicerie fine', examples: ['Truffe noire Melanosporum', 'Truffe d\'été', 'Huile truffée', 'Jus de truffe', 'Brisures'], priceRange: '30-3000€/kg' },
    ],
  },
  {
    name: 'Petrossian',
    type: 'specialiste',
    categories: ['Poissons', 'Épicerie fine'],
    regions: ['Île-de-France'],
    departments: ['75'],
    cities: ['Paris'],
    description: 'Maison de caviar et produits de luxe depuis 1920. Caviar, saumon fumé, foie gras pour la haute restauration.',
    website: 'https://www.petrossian.fr',
    phone: '01 44 11 32 22',
    delivery: true,
    minOrder: '200€ HT minimum',
    speciality: 'Caviar, saumon fumé, foie gras, produits de luxe',
    products: [
      { category: 'Poissons', examples: ['Caviar Osciètre', 'Caviar Beluga', 'Saumon fumé', 'Tarama', 'Blinis'], priceRange: '30-5000€/kg' },
    ],
  },
  {
    name: 'Comtesse du Barry',
    type: 'specialiste',
    categories: ['Épicerie fine', 'Charcuterie', 'Viandes'],
    regions: [...FRENCH_REGIONS],
    description: 'Maison de gastronomie du Sud-Ouest depuis 1908. Foie gras, confits, terrines, produits fins.',
    website: 'https://www.comtessedubarry.com',
    phone: '05 62 08 16 00',
    delivery: true,
    minOrder: '100€ HT minimum',
    speciality: 'Foie gras, confits, cassoulet, produits du terroir Sud-Ouest',
    products: [
      { category: 'Épicerie fine', examples: ['Foie gras entier', 'Confit de canard', 'Cassoulet', 'Terrines fines', 'Rillettes de canard'], priceRange: '10-120€/kg' },
    ],
  },
  {
    name: 'Labeyrie',
    type: 'national',
    categories: ['Poissons', 'Épicerie fine', 'Charcuterie'],
    regions: [...FRENCH_REGIONS],
    description: 'Spécialiste du saumon fumé et du foie gras pour la restauration. Gamme professionnelle complète.',
    website: 'https://www.labeyrie.com',
    phone: '05 58 56 50 00',
    delivery: true,
    speciality: 'Saumon fumé, foie gras, produits festifs, traiteur',
    products: [
      { category: 'Poissons', examples: ['Saumon fumé', 'Truite fumée', 'Crevettes', 'Blinis'], priceRange: '15-80€/kg' },
      { category: 'Épicerie fine', examples: ['Foie gras de canard', 'Foie gras d\'oie', 'Magret fumé'], priceRange: '25-120€/kg' },
    ],
  },

  // ===========================================================================
  // DISTRIBUTEURS SPÉCIALISÉS
  // ===========================================================================

  {
    name: 'Agidra',
    type: 'grossiste',
    categories: ['Viandes', 'Poissons', 'Légumes', 'Fruits', 'Produits laitiers', 'Épicerie fine', 'Surgelés'],
    regions: ['Auvergne-Rhône-Alpes', 'Provence-Alpes-Côte d\'Azur', 'Occitanie'],
    description: 'Grossiste alimentaire pour professionnels proposant catalogue en PDF/Excel avec l\'intégralité des familles de produits.',
    website: 'https://www.agidra.com',
    delivery: true,
    speciality: 'Grossiste multi-produits, catalogue détaillé, prix professionnels',
    products: [
      { category: 'Viandes', examples: ['Bœuf', 'Porc', 'Volaille', 'Agneau'], priceRange: '5-40€/kg' },
      { category: 'Épicerie fine', examples: ['Conserves', 'Sauces', 'Condiments', 'Huiles'], priceRange: '2-20€/unité' },
    ],
  },
  {
    name: 'Distram',
    type: 'grossiste',
    categories: ['Viandes', 'Produits laitiers', 'Surgelés', 'Épicerie fine', 'Féculents'],
    regions: ['Auvergne-Rhône-Alpes'],
    departments: ['69'],
    cities: ['Saint-Priest'],
    description: 'Grossiste alimentaire importateur depuis 1993. Plus de 1 000 références pour restaurateurs, pizzerias, snacks, kebabs. Concept clé en main.',
    website: 'https://www.distram.com',
    phone: '04 72 04 68 68',
    delivery: true,
    minOrder: '100€ HT minimum',
    speciality: 'Restauration rapide, pizza, snack, kebab, 1000+ références',
    products: [
      { category: 'Produits laitiers', examples: ['Fromages à pizza', 'Mozzarella', 'Cheddar', 'Emmental râpé'], priceRange: '4-12€/kg' },
      { category: 'Viandes', examples: ['Poulet kebab', 'Merguez', 'Steaks hachés', 'Poulet pané'], priceRange: '4-15€/kg' },
      { category: 'Féculents', examples: ['Pâtes à pizza', 'Galettes wraps', 'Pain burger', 'Naans'], priceRange: '1-5€/kg' },
    ],
  },
  {
    name: 'Terre et Mer Distribution',
    type: 'grossiste',
    categories: ['Poissons', 'Légumes', 'Fruits'],
    regions: ['Île-de-France', 'Hauts-de-France', 'Normandie'],
    description: 'Grossiste en produits de la mer et fruits/légumes pour la restauration en Île-de-France et Nord.',
    delivery: true,
    minOrder: '200€ HT minimum',
    speciality: 'Marée fraîche, arrivages quotidiens',
    products: [
      { category: 'Poissons', examples: ['Arrivages quotidiens', 'Poissons de ligne', 'Fruits de mer', 'Crustacés'], priceRange: '8-60€/kg' },
    ],
  },
  {
    name: 'Les Halles de Paris - Rungis',
    type: 'grossiste',
    categories: ['Viandes', 'Poissons', 'Légumes', 'Fruits', 'Fromages'],
    regions: ['Île-de-France'],
    departments: ['75', '92', '93', '94', '77', '78', '91', '95'],
    cities: ['Paris', 'Rungis'],
    description: 'Ensemble des grossistes présents sur le Marché International de Rungis. Accès professionnel, meilleurs prix sur volume.',
    delivery: true,
    speciality: 'Tous produits frais, accès direct grossistes de Rungis',
    products: [
      { category: 'Viandes', examples: ['Viandes de gros', 'PAD', 'Volaille', 'Triperie'], priceRange: '3-50€/kg' },
      { category: 'Fromages', examples: ['Fromages AOP', 'Affinés', 'Plateaux'], priceRange: '5-50€/kg' },
    ],
  },

  // ===========================================================================
  // PRODUITS BIO ET SPÉCIALISÉS
  // ===========================================================================

  {
    name: 'Biodis',
    type: 'national',
    categories: ['Bio', 'Épicerie fine', 'Féculents', 'Huiles'],
    regions: [...FRENCH_REGIONS],
    description: 'Distributeur de produits biologiques et naturels pour les professionnels. Gamme complète d\'épicerie bio.',
    delivery: true,
    speciality: 'Épicerie bio, produits naturels, compléments alimentaires',
    products: [
      { category: 'Bio', examples: ['Céréales bio', 'Légumineuses bio', 'Huiles bio', 'Farines bio', 'Sucres bio'], priceRange: '2-12€/kg' },
    ],
  },

  // ===========================================================================
  // HYGIÈNE ET EMBALLAGES
  // ===========================================================================

  {
    name: 'Ecolab',
    type: 'national',
    categories: ['Épicerie fine'],
    regions: [...FRENCH_REGIONS],
    description: 'Leader mondial des solutions d\'hygiène et de nettoyage pour la restauration. Produits de lavage, désinfection, lutte antiparasitaire.',
    website: 'https://www.ecolab.com/fr-fr',
    phone: '01 49 92 60 00',
    delivery: true,
    speciality: 'Hygiène professionnelle, lave-vaisselle, désinfection HACCP',
    products: [
      { category: 'Épicerie fine', examples: ['Produits lave-vaisselle', 'Détergents', 'Désinfectants', 'Produits sols', 'Film alimentaire'], priceRange: '5-50€/unité' },
    ],
  },

  // ===========================================================================
  // AUTRES DISTRIBUTEURS RÉGIONAUX
  // ===========================================================================

  {
    name: 'CBS (Centrale de Boissons et Services)',
    type: 'grossiste',
    categories: ['Boissons'],
    regions: ['Île-de-France', 'Hauts-de-France', 'Grand Est'],
    description: 'Grossiste alimentaire spécialisé dans les boissons pour les professionnels CHR du nord de la France.',
    website: 'https://cbs.gral-gie.com',
    delivery: true,
    speciality: 'Boissons CHR, bières, vins, softs',
    products: [
      { category: 'Boissons', examples: ['Bières locales', 'Vins', 'Champagnes', 'Softs', 'Eaux', 'Jus'], priceRange: '0.30-15€/L' },
    ],
  },
  {
    name: 'Sobraquès Distribution (Krill)',
    type: 'grossiste',
    categories: ['Viandes', 'Surgelés', 'Épicerie fine'],
    regions: ['Occitanie', 'Provence-Alpes-Côte d\'Azur'],
    description: 'Membre du Réseau Krill, grossiste alimentaire spécialisé viande et surgelés pour le Sud de la France.',
    website: 'https://www.krill.fr',
    delivery: true,
    speciality: 'Viande origine France, surgelés, épicerie pro',
    products: [
      { category: 'Viandes', examples: ['Bœuf VBF', 'Porc VPF', 'Veau', 'Agneau'], priceRange: '5-45€/kg' },
    ],
  },
  {
    name: 'So Breizh (Krill)',
    type: 'grossiste',
    categories: ['Viandes', 'Surgelés', 'Poissons'],
    regions: ['Bretagne', 'Pays de la Loire'],
    description: 'Membre du Réseau Krill, grossiste alimentaire breton. Viandes et produits de la mer bretons.',
    website: 'https://www.krill.fr',
    delivery: true,
    speciality: 'Produits bretons, viande, poissons, glaces',
    products: [
      { category: 'Viandes', examples: ['Porc breton', 'Volaille bretonne', 'Bœuf', 'Agneau pré-salé'], priceRange: '5-40€/kg' },
      { category: 'Poissons', examples: ['Poissons bretons', 'Coquillages', 'Crustacés'], priceRange: '8-50€/kg' },
    ],
  },
  {
    name: 'FMB Gastronomie (Krill)',
    type: 'grossiste',
    categories: ['Viandes', 'Surgelés', 'Épicerie fine'],
    regions: ['Île-de-France', 'Centre-Val de Loire'],
    description: 'Membre du Réseau Krill, distributeur alimentaire en Île-de-France et Centre.',
    website: 'https://www.krill.fr',
    delivery: true,
    speciality: 'Viande, surgelés, épicerie pour restauration IDF',
    products: [
      { category: 'Viandes', examples: ['Bœuf', 'Veau', 'Porc', 'Volaille', 'Gibier'], priceRange: '5-50€/kg' },
    ],
  },
  {
    name: 'Achille Bertrand (Krill)',
    type: 'grossiste',
    categories: ['Viandes', 'Surgelés', 'Poissons'],
    regions: ['Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté'],
    description: 'Membre du Réseau Krill, grossiste alimentaire dans l\'Est de la France. Expert viande et surgelés.',
    website: 'https://www.krill.fr',
    delivery: true,
    speciality: 'Viande Charolaise, surgelés, produits régionaux',
    products: [
      { category: 'Viandes', examples: ['Charolais', 'Bresse', 'Porc du Jura', 'Agneau de Sisteron'], priceRange: '6-50€/kg' },
    ],
  },

  // ===========================================================================
  // SAUCES ET BASES CULINAIRES
  // ===========================================================================

  {
    name: 'Unilever Food Solutions',
    type: 'national',
    categories: ['Épicerie fine', 'Épices'],
    regions: [...FRENCH_REGIONS],
    description: 'Division restauration d\'Unilever. Marques : Knorr, Hellmann\'s, Maille, Amora. Bases culinaires et sauces professionnelles.',
    website: 'https://www.unileverfoodsolutions.fr',
    phone: '01 41 96 60 00',
    delivery: true,
    speciality: 'Bases culinaires Knorr, sauces Hellmann\'s, bouillons',
    products: [
      { category: 'Épicerie fine', examples: ['Fond de veau Knorr', 'Mayonnaise Hellmann\'s', 'Bouillons', 'Purées Knorr', 'Sauces déshydratées'], priceRange: '3-25€/kg' },
    ],
  },
  {
    name: 'Nestlé Professional',
    type: 'national',
    categories: ['Épicerie fine', 'Boissons'],
    regions: [...FRENCH_REGIONS],
    description: 'Division restauration de Nestlé. Marques : Maggi, Nescafé, Chef, Buitoni. Solutions culinaires professionnelles.',
    website: 'https://www.nestleprofessional.fr',
    phone: '01 60 53 40 00',
    delivery: true,
    speciality: 'Bases culinaires Maggi, café Nescafé, desserts Chef',
    products: [
      { category: 'Épicerie fine', examples: ['Fond brun Maggi', 'Fond blanc', 'Bouillons Maggi', 'Sauces', 'Soupes'], priceRange: '3-20€/kg' },
      { category: 'Boissons', examples: ['Nescafé', 'Cappuccino', 'Chocolat chaud', 'Thé'], priceRange: '5-30€/kg' },
    ],
  },

  // ===========================================================================
  // CAFÉ ET THÉ
  // ===========================================================================

  {
    name: 'Lavazza Professionnel',
    type: 'national',
    categories: ['Boissons'],
    regions: [...FRENCH_REGIONS],
    description: 'Torréfacteur italien, gamme professionnelle de cafés en grains et capsules pour la restauration CHR.',
    website: 'https://www.lavazza.fr',
    phone: '04 37 25 23 00',
    delivery: true,
    speciality: 'Café en grains, capsules, machines professionnelles',
    products: [
      { category: 'Boissons', examples: ['Super Crema grains', 'Espresso grains', 'Capsules Blue', 'Décaféiné'], priceRange: '10-30€/kg' },
    ],
  },
  {
    name: 'Illy Professionnel',
    type: 'specialiste',
    categories: ['Boissons'],
    regions: [...FRENCH_REGIONS],
    description: 'Café premium italien pour la restauration. Blend unique 100% Arabica. Machines et accessoires.',
    website: 'https://www.illy.com/fr-fr',
    delivery: true,
    speciality: 'Café premium 100% Arabica, machines espresso',
    products: [
      { category: 'Boissons', examples: ['Espresso grains', 'Capsules iperEspresso', 'Monoarabica', 'Décaféiné'], priceRange: '20-45€/kg' },
    ],
  },
  {
    name: 'Kusmi Tea Professionnel',
    type: 'specialiste',
    categories: ['Boissons'],
    regions: [...FRENCH_REGIONS],
    description: 'Maison de thé parisienne fondée en 1867. Gamme professionnelle de thés et infusions premium.',
    website: 'https://www.kusmitea.com',
    phone: '01 44 07 10 00',
    delivery: true,
    minOrder: '80€ HT minimum',
    speciality: 'Thés premium, infusions, sachets individuels CHR',
    products: [
      { category: 'Boissons', examples: ['Anastasia', 'Prince Vladimir', 'Detox', 'Earl Grey', 'Thé vert jasmin'], priceRange: '40-120€/kg' },
    ],
  },

  // ===========================================================================
  // ÉQUIPEMENT ET EMBALLAGES ALIMENTAIRES
  // ===========================================================================

  {
    name: 'Metro Équipement',
    type: 'national',
    categories: ['Épicerie fine'],
    regions: [...FRENCH_REGIONS],
    description: 'Division équipement de METRO. Matériel de cuisine professionnel, vaisselle, mobilier de salle et terrasse.',
    website: 'https://www.metro.fr',
    phone: '01 41 83 44 00',
    delivery: true,
    speciality: 'Matériel de cuisine, vaisselle, mobilier CHR, emballages',
    products: [
      { category: 'Épicerie fine', examples: ['Emballages alimentaires', 'Film étirable', 'Barquettes', 'Gobelets', 'Serviettes'], priceRange: '2-50€/lot' },
    ],
  },

  // ===========================================================================
  // FOURNISSEURS COMPLÉMENTAIRES NATIONAUX
  // ===========================================================================

  {
    name: 'Saveurs d\'Antoine (Pomona)',
    type: 'national',
    categories: ['Épicerie fine', 'Produits laitiers', 'Fromages'],
    regions: [...FRENCH_REGIONS],
    description: 'Réseau spécialisé du groupe Pomona dédié aux traiteurs et aux restaurateurs. Produits frais et gastronomiques.',
    website: 'https://www.saveursdantoine.fr',
    phone: '01 56 71 24 00',
    delivery: true,
    speciality: 'Produits traiteur, gastronomie, fromages affinés',
    products: [
      { category: 'Fromages', examples: ['Fromages affinés', 'Plateaux de fromages', 'Fromages rares'], priceRange: '8-50€/kg' },
      { category: 'Épicerie fine', examples: ['Produits traiteur', 'Foie gras', 'Terrines artisanales'], priceRange: '10-80€/kg' },
    ],
  },
  {
    name: 'Pomone (légumes cuisinés)',
    type: 'specialiste',
    categories: ['Légumes', 'Surgelés'],
    regions: [...FRENCH_REGIONS],
    description: 'Spécialiste des purées et veloutés frais de légumes pour la restauration. Recettes chef en formats professionnels.',
    website: 'https://www.pomone.fr',
    delivery: true,
    speciality: 'Purées de légumes frais, veloutés, soupes pro',
    products: [
      { category: 'Légumes', examples: ['Purée de pommes de terre', 'Velouté de champignons', 'Purée de carottes', 'Soupe de potiron'], priceRange: '3-10€/kg' },
    ],
  },
  {
    name: 'Candia Professionnel',
    type: 'national',
    categories: ['Produits laitiers'],
    regions: [...FRENCH_REGIONS],
    description: 'Gamme professionnelle de Candia (Sodiaal). Laits, crèmes et produits laitiers en formats restauration.',
    website: 'https://www.candia.fr',
    phone: '01 40 80 85 00',
    delivery: true,
    speciality: 'Laits UHT, crèmes, produits laitiers professionnels',
    products: [
      { category: 'Produits laitiers', examples: ['Lait entier', 'Lait demi-écrémé', 'Crème fleurette', 'Crème légère'], priceRange: '0.80-5€/L' },
    ],
  },
  {
    name: 'Entremont Professionnel',
    type: 'national',
    categories: ['Fromages', 'Produits laitiers'],
    regions: [...FRENCH_REGIONS],
    description: 'Fromager savoyard, gamme professionnelle. Emmental, raclette, gruyère en formats restauration.',
    website: 'https://www.entremont.com',
    phone: '04 50 33 52 52',
    delivery: true,
    speciality: 'Emmental, raclette, gruyère, fromages à fondue',
    products: [
      { category: 'Fromages', examples: ['Emmental râpé 1kg', 'Raclette tranches', 'Gruyère', 'Fondue savoyarde'], priceRange: '5-18€/kg' },
    ],
  },
];

// =============================================================================
// FONCTIONS DE RECHERCHE
// =============================================================================

/**
 * Recherche de fournisseurs avec filtres multiples
 * Recherche dans : nom, description, spécialité, catégories ET produits/examples
 */
export function searchSuppliers(
  query?: string,
  region?: string,
  department?: string,
  category?: string
): FrenchSupplier[] {
  let results = [...FRENCH_SUPPLIERS];

  if (query) {
    const lowerQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    results = results.filter((supplier) => {
      const productText = (supplier.products || [])
        .flatMap((p) => [p.category, ...p.examples, p.priceRange || ''])
        .join(' ');
      const searchableText = [
        supplier.name,
        supplier.description,
        supplier.speciality || '',
        ...supplier.categories,
        productText,
      ]
        .join(' ')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return searchableText.includes(lowerQuery);
    });
  }

  if (region) {
    results = results.filter((supplier) =>
      supplier.regions.some(
        (r) => r.toLowerCase() === region.toLowerCase()
      )
    );
  }

  if (department) {
    results = results.filter(
      (supplier) =>
        !supplier.departments || supplier.departments.includes(department) ||
        supplier.regions.length === FRENCH_REGIONS.length // national suppliers
    );
  }

  if (category) {
    const lowerCategory = category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    results = results.filter((supplier) =>
      supplier.categories.some(
        (c) =>
          c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === lowerCategory
      )
    );
  }

  return results;
}

/**
 * Récupère tous les fournisseurs disponibles dans une région
 */
export function getSuppliersByRegion(region: string): FrenchSupplier[] {
  return FRENCH_SUPPLIERS.filter((supplier) =>
    supplier.regions.some(
      (r) => r.toLowerCase() === region.toLowerCase()
    )
  );
}

/**
 * Récupère tous les fournisseurs d'une catégorie de produits
 */
export function getSuppliersByCategory(category: string): FrenchSupplier[] {
  const lower = category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return FRENCH_SUPPLIERS.filter((supplier) =>
    supplier.categories.some(
      (c) => c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === lower
    )
  );
}
