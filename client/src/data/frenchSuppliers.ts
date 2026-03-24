// =============================================================================
// French Food Supplier Database for RestauMargin
// Base de données des fournisseurs alimentaires français
// =============================================================================

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
// BASE DE DONNÉES DES FOURNISSEURS
// =============================================================================

export const FRENCH_SUPPLIERS: FrenchSupplier[] = [

  // ===========================================================================
  // GROSSISTES NATIONAUX (Cash & Carry / Distributeurs foodservice)
  // ===========================================================================

  {
    name: 'METRO Cash & Carry',
    type: 'national',
    categories: ['Viandes', 'Poissons', 'Légumes', 'Fruits', 'Produits laitiers', 'Épices', 'Féculents', 'Huiles', 'Boissons', 'Surgelés', 'Boulangerie', 'Épicerie fine'],
    regions: [...FRENCH_REGIONS],
    description: 'Leader du cash & carry en France avec 98 entrepôts. Carte METRO obligatoire pour les professionnels. Offre complète alimentaire et non-alimentaire pour la restauration.',
    website: 'https://www.metro.fr',
    delivery: true,
    minOrder: '100€ HT minimum pour la livraison',
    speciality: 'Cash & carry généraliste, gamme complète CHR',
  },
  {
    name: 'Promocash',
    type: 'national',
    categories: ['Viandes', 'Poissons', 'Légumes', 'Fruits', 'Produits laitiers', 'Épices', 'Féculents', 'Huiles', 'Boissons', 'Surgelés', 'Boulangerie'],
    regions: [...FRENCH_REGIONS],
    description: 'Réseau de cash & carry du groupe Carrefour, destiné aux professionnels de la restauration et de l\'alimentation. Plus de 130 points de vente en France.',
    website: 'https://www.promocash.com',
    delivery: true,
    minOrder: '150€ HT minimum pour la livraison',
    speciality: 'Cash & carry, réseau Carrefour Pro',
  },
  {
    name: 'Transgourmet France',
    type: 'national',
    categories: ['Viandes', 'Poissons', 'Légumes', 'Fruits', 'Produits laitiers', 'Épices', 'Féculents', 'Huiles', 'Boissons', 'Surgelés', 'Boulangerie', 'Épicerie fine'],
    regions: [...FRENCH_REGIONS],
    description: 'Distributeur alimentaire pour les professionnels de la restauration. Filiale du groupe suisse Coop. Propose Transgourmet Plus (livraison) et Transgourmet Origine (produits premium).',
    website: 'https://www.transgourmet.fr',
    delivery: true,
    minOrder: '200€ HT minimum',
    speciality: 'Distribution foodservice, gamme Transgourmet Origine (terroir)',
  },
  {
    name: 'Brake France',
    type: 'national',
    categories: ['Viandes', 'Poissons', 'Légumes', 'Fruits', 'Produits laitiers', 'Féculents', 'Surgelés', 'Boulangerie', 'Épicerie fine'],
    regions: [...FRENCH_REGIONS],
    description: 'Distributeur alimentaire pour la restauration hors domicile. Filiale du groupe Sysco. Livraison en multi-température (frais, surgelé, sec).',
    website: 'https://www.brake.fr',
    delivery: true,
    minOrder: '150€ HT minimum',
    speciality: 'Livraison multi-température, restauration collective et commerciale',
  },
  {
    name: 'Sysco France',
    type: 'national',
    categories: ['Viandes', 'Poissons', 'Légumes', 'Fruits', 'Produits laitiers', 'Féculents', 'Huiles', 'Surgelés', 'Boulangerie'],
    regions: [...FRENCH_REGIONS],
    description: 'Leader mondial de la distribution alimentaire pour la restauration. Présent en France via ses filiales dont Brake France et Davigel.',
    website: 'https://www.sysco.fr',
    delivery: true,
    minOrder: '200€ HT minimum',
    speciality: 'Distribution foodservice intégrée, solutions clé en main',
  },

  // ===========================================================================
  // POMONA GROUP (spécialiste multi-métiers)
  // ===========================================================================

  {
    name: 'Pomona Group - TerreAzur',
    type: 'national',
    categories: ['Légumes', 'Fruits'],
    regions: [...FRENCH_REGIONS],
    description: 'Branche fruits et légumes du groupe Pomona. Premier distributeur de fruits et légumes frais pour la restauration en France. Approvisionnement direct producteurs.',
    website: 'https://www.pomona.fr',
    delivery: true,
    minOrder: '100€ HT minimum',
    speciality: 'Fruits et légumes frais, circuits courts, produits de saison',
  },
  {
    name: 'Pomona Group - PassionFroid',
    type: 'national',
    categories: ['Produits laitiers', 'Surgelés', 'Charcuterie', 'Fromages'],
    regions: [...FRENCH_REGIONS],
    description: 'Branche produits laitiers et surgelés du groupe Pomona. Spécialiste de la distribution de produits frais et surgelés pour la restauration.',
    website: 'https://www.pomona.fr',
    delivery: true,
    minOrder: '100€ HT minimum',
    speciality: 'Produits laitiers, surgelés, fromages, charcuterie',
  },
  {
    name: 'Pomona Group - EpiSaveurs',
    type: 'national',
    categories: ['Épices', 'Féculents', 'Huiles', 'Épicerie fine'],
    regions: [...FRENCH_REGIONS],
    description: 'Branche épicerie et boissons du groupe Pomona. Gamme complète de produits d\'épicerie sèche et de boissons pour la restauration.',
    website: 'https://www.pomona.fr',
    delivery: true,
    minOrder: '100€ HT minimum',
    speciality: 'Épicerie sèche, condiments, huiles, produits du monde',
  },

  // ===========================================================================
  // SURGELÉS
  // ===========================================================================

  {
    name: 'Davigel',
    type: 'national',
    categories: ['Surgelés', 'Poissons', 'Légumes', 'Boulangerie'],
    regions: [...FRENCH_REGIONS],
    description: 'Spécialiste de la distribution de produits surgelés pour la restauration. Filiale du groupe Sysco. Large gamme de produits élaborés surgelés.',
    website: 'https://www.davigel.fr',
    delivery: true,
    minOrder: '150€ HT minimum',
    speciality: 'Surgelés professionnels, produits élaborés, pâtisserie surgelée',
  },
  {
    name: 'Thiriet Professionnel',
    type: 'national',
    categories: ['Surgelés', 'Légumes', 'Viandes', 'Poissons', 'Boulangerie'],
    regions: [...FRENCH_REGIONS],
    description: 'Spécialiste français du surgelé, gamme professionnelle pour la restauration. Entreprise familiale lorraine fondée en 1973.',
    website: 'https://www.thiriet.com',
    delivery: true,
    speciality: 'Surgelés haut de gamme, produits élaborés français',
  },
  {
    name: 'Picard Surgelés Professionnels',
    type: 'national',
    categories: ['Surgelés', 'Légumes', 'Poissons', 'Boulangerie'],
    regions: [...FRENCH_REGIONS],
    description: 'Offre professionnelle du leader français du surgelé. Produits élaborés et matières premières surgelées de qualité.',
    website: 'https://www.picard.fr',
    delivery: true,
    speciality: 'Surgelés premium, produits élaborés, pâtisserie',
  },

  // ===========================================================================
  // GROSSISTES VIANDES
  // ===========================================================================

  {
    name: 'Bigard',
    type: 'national',
    categories: ['Viandes', 'Charcuterie'],
    regions: [...FRENCH_REGIONS],
    description: 'Premier groupe français de transformation de viande bovine et porcine. Fournisseur majeur de la restauration avec des marques comme Charal et Socopa.',
    website: 'https://www.groupe-bigard.com',
    delivery: true,
    minOrder: '300€ HT minimum',
    speciality: 'Viande bovine et porcine, découpe sur mesure pour la restauration',
  },
  {
    name: 'Charal',
    type: 'national',
    categories: ['Viandes'],
    regions: [...FRENCH_REGIONS],
    description: 'Marque du groupe Bigard, leader de la viande bovine en France. Gamme professionnelle de steaks, pièces de boucherie et viande hachée pour la restauration.',
    website: 'https://www.charal.fr',
    delivery: true,
    minOrder: '250€ HT minimum',
    speciality: 'Viande bovine française, steaks, viande hachée fraîche',
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
  },
  {
    name: 'Socopa',
    type: 'national',
    categories: ['Viandes', 'Charcuterie'],
    regions: [...FRENCH_REGIONS],
    description: 'Filiale du groupe Bigard, spécialisée dans la viande bovine et porcine. Réseau d\'abattoirs et d\'ateliers de découpe sur tout le territoire.',
    website: 'https://www.socopa.fr',
    delivery: true,
    speciality: 'Viande bovine, porcine, PAD (prêt à découper)',
  },
  {
    name: 'Duc',
    type: 'national',
    categories: ['Viandes'],
    regions: [...FRENCH_REGIONS],
    description: 'Spécialiste de la volaille française pour la restauration. Gamme complète : poulet, dinde, canard, pintade.',
    website: 'https://www.duc.fr',
    delivery: true,
    speciality: 'Volaille française, poulet Label Rouge',
  },
  {
    name: 'LDC Groupe (Le Gaulois, Maître Coq)',
    type: 'national',
    categories: ['Viandes'],
    regions: [...FRENCH_REGIONS],
    description: 'Leader français de la volaille avec les marques Le Gaulois et Maître Coq. Gamme professionnelle complète pour la restauration.',
    website: 'https://www.ldc.fr',
    delivery: true,
    speciality: 'Volaille, traiteur, produits élaborés à base de volaille',
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
    delivery: true,
    minOrder: '150€ HT minimum',
    speciality: 'Poissons frais, fruits de mer, crustacés, marée',
  },
  {
    name: 'Capitaine Houat',
    type: 'national',
    categories: ['Poissons', 'Surgelés'],
    regions: [...FRENCH_REGIONS],
    description: 'Spécialiste des produits de la mer surgelés et frais pour la restauration. Gamme de poissons, crustacés et coquillages.',
    delivery: true,
    speciality: 'Produits de la mer surgelés et frais, filets portionnés',
  },
  {
    name: 'Terre et Mer Distribution',
    type: 'grossiste',
    categories: ['Poissons', 'Légumes', 'Fruits'],
    regions: ['Île-de-France', 'Hauts-de-France', 'Normandie'],
    description: 'Grossiste en produits de la mer et fruits/légumes pour la restauration en Île-de-France et Nord de la France.',
    delivery: true,
    minOrder: '200€ HT minimum',
    speciality: 'Marée fraîche, arrivages quotidiens',
  },
  {
    name: 'Sapmer',
    type: 'national',
    categories: ['Poissons', 'Surgelés'],
    regions: [...FRENCH_REGIONS],
    description: 'Armateur et distributeur de produits de la mer. Spécialiste de la légine et du thon. Pêche responsable et durable.',
    website: 'https://www.sapmer.com',
    delivery: true,
    speciality: 'Poissons d\'exception, légine australe, thon, pêche durable',
  },

  // ===========================================================================
  // GROSSISTES FRUITS & LÉGUMES
  // ===========================================================================

  {
    name: 'Marché International de Rungis',
    type: 'grossiste',
    categories: ['Viandes', 'Poissons', 'Légumes', 'Fruits', 'Produits laitiers', 'Fromages', 'Épicerie fine'],
    regions: ['Île-de-France'],
    departments: ['94'],
    cities: ['Rungis'],
    description: 'Le plus grand marché de produits frais au monde. Accès réservé aux professionnels (carte d\'acheteur obligatoire). Plus de 1 200 entreprises sur 234 hectares.',
    website: 'https://www.rungisinternational.com',
    delivery: false,
    speciality: 'Tous produits frais, marché de gros, meilleurs prix sur volumes',
  },
  {
    name: 'Grand Frais Pro',
    type: 'national',
    categories: ['Légumes', 'Fruits', 'Produits laitiers', 'Fromages', 'Épicerie fine'],
    regions: ['Île-de-France', 'Auvergne-Rhône-Alpes', 'Provence-Alpes-Côte d\'Azur', 'Occitanie', 'Nouvelle-Aquitaine'],
    description: 'Service professionnel du réseau Grand Frais. Fruits et légumes frais, crémerie et épicerie fine sélectionnés pour leur qualité.',
    website: 'https://www.grandfrais.com',
    delivery: true,
    speciality: 'Fruits et légumes frais, produits de qualité, circuits courts',
  },
  {
    name: 'Pronatura',
    type: 'national',
    categories: ['Légumes', 'Fruits', 'Bio'],
    regions: [...FRENCH_REGIONS],
    description: 'Distributeur de fruits et légumes bio et conventionnels pour la restauration. Approvisionnement direct producteurs, filières courtes.',
    website: 'https://www.pronatura.com',
    delivery: true,
    minOrder: '100€ HT minimum',
    speciality: 'Fruits et légumes bio et conventionnels, circuits courts',
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
    delivery: true,
    speciality: 'Fromages, beurre, crème, lait, produits laitiers professionnels',
  },
  {
    name: 'Président Professionnel',
    type: 'national',
    categories: ['Produits laitiers', 'Fromages'],
    regions: [...FRENCH_REGIONS],
    description: 'Gamme professionnelle de la marque Président (groupe Lactalis). Beurre, crème, fromages en formats restauration.',
    website: 'https://www.president-professionnel.fr',
    delivery: true,
    speciality: 'Beurre gastronomique, crème, fromages en portions CHR',
  },
  {
    name: 'Isigny Sainte-Mère',
    type: 'specialiste',
    categories: ['Produits laitiers', 'Fromages'],
    regions: [...FRENCH_REGIONS],
    departments: ['14'],
    cities: ['Isigny-sur-Mer'],
    description: 'Coopérative laitière normande, AOP Isigny. Beurre et crème d\'Isigny AOP, camembert de Normandie AOP. Gamme professionnelle disponible.',
    website: 'https://www.isigny-ste-mere.com',
    delivery: true,
    speciality: 'Beurre AOP Isigny, crème AOP, camembert de Normandie AOP',
  },
  {
    name: 'Savencia Fromage & Dairy (Caprice des Dieux, Tartare)',
    type: 'national',
    categories: ['Produits laitiers', 'Fromages'],
    regions: [...FRENCH_REGIONS],
    description: 'Groupe fromager français, marques : Caprice des Dieux, Tartare, Saint Albray, Elle & Vire. Gamme professionnelle pour la restauration.',
    website: 'https://www.savencia-fd.com',
    delivery: true,
    speciality: 'Fromages de spécialité, crème Elle & Vire professionnelle',
  },
  {
    name: 'Elle & Vire Professionnel',
    type: 'national',
    categories: ['Produits laitiers'],
    regions: [...FRENCH_REGIONS],
    description: 'Gamme professionnelle de crèmes, beurres et produits laitiers pour la restauration et la pâtisserie. Marque du groupe Savencia.',
    website: 'https://www.elle-et-vire.com/fr/professionnel',
    delivery: true,
    speciality: 'Crème professionnelle, beurre de tourage, produits pâtisserie',
  },

  // ===========================================================================
  // BOULANGERIE / PÂTISSERIE
  // ===========================================================================

  {
    name: 'Bridor',
    type: 'national',
    categories: ['Boulangerie', 'Surgelés'],
    regions: [...FRENCH_REGIONS],
    description: 'Leader mondial du pain et de la viennoiserie surgelés pour les professionnels. Filiale du groupe Le Duff. Produits crus et précuits surgelés.',
    website: 'https://www.bridor.com',
    delivery: true,
    minOrder: '200€ HT minimum',
    speciality: 'Pains surgelés, viennoiseries, pâtisseries pour la restauration',
  },
  {
    name: 'Coup de Pates',
    type: 'national',
    categories: ['Boulangerie', 'Surgelés'],
    regions: [...FRENCH_REGIONS],
    description: 'Fabricant français de produits de boulangerie-viennoiserie surgelés pour la restauration. Gamme de pâtes feuilletées, brisées et produits traiteur.',
    website: 'https://www.coupdepates.com',
    delivery: true,
    speciality: 'Pâtes feuilletées, brisées, viennoiseries crues surgelées',
  },
  {
    name: 'Délifrance',
    type: 'national',
    categories: ['Boulangerie', 'Surgelés'],
    regions: [...FRENCH_REGIONS],
    description: 'Spécialiste de la boulangerie-viennoiserie surgelée pour les professionnels. Présent dans plus de 100 pays. Gamme de pains, viennoiseries et pâtisseries.',
    website: 'https://www.delifrance.com',
    delivery: true,
    speciality: 'Boulangerie surgelée premium, viennoiseries, mini-pâtisseries',
  },
  {
    name: 'Patisfrance (Puratos)',
    type: 'national',
    categories: ['Boulangerie', 'Épicerie fine'],
    regions: [...FRENCH_REGIONS],
    description: 'Fournisseur d\'ingrédients et de solutions pour la boulangerie, pâtisserie et chocolaterie. Filiale de Puratos.',
    website: 'https://www.puratos.fr',
    delivery: true,
    speciality: 'Ingrédients pâtisserie, chocolat de couverture, préparations',
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
    delivery: true,
    minOrder: '100€ HT minimum',
    speciality: 'Chocolat de couverture grand cru, cacao, ingrédients pâtisserie',
  },

  // ===========================================================================
  // BOISSONS
  // ===========================================================================

  {
    name: 'France Boissons',
    type: 'national',
    categories: ['Boissons'],
    regions: [...FRENCH_REGIONS],
    description: 'Premier distributeur de boissons pour les CHR (Cafés, Hôtels, Restaurants) en France. Filiale du groupe Heineken. Bières, vins, spiritueux, soft drinks.',
    website: 'https://www.franceboissons.fr',
    delivery: true,
    minOrder: '150€ HT minimum',
    speciality: 'Bières, vins, spiritueux, softs, matériel de service',
  },
  {
    name: 'C10 - Les Comptoirs du CHR',
    type: 'national',
    categories: ['Boissons'],
    regions: [...FRENCH_REGIONS],
    description: 'Réseau de distribution de boissons pour les professionnels CHR. Groupement coopératif de distributeurs indépendants. Large catalogue vins, bières et spiritueux.',
    website: 'https://www.c10.fr',
    delivery: true,
    minOrder: '100€ HT minimum',
    speciality: 'Distribution boissons CHR, conseil en carte des vins',
  },
  {
    name: 'Distriboissons',
    type: 'national',
    categories: ['Boissons'],
    regions: [...FRENCH_REGIONS],
    description: 'Réseau de distributeurs de boissons pour les professionnels CHR. Groupement d\'indépendants couvrant tout le territoire français.',
    website: 'https://www.distriboissons.com',
    delivery: true,
    speciality: 'Boissons CHR, offre locale et nationale',
  },
  {
    name: 'Elidis',
    type: 'national',
    categories: ['Boissons'],
    regions: [...FRENCH_REGIONS],
    description: 'Filiale de distribution boissons du groupe Pernod Ricard pour les professionnels CHR. Spiritueux, vins, champagnes.',
    delivery: true,
    speciality: 'Spiritueux premium, vins, champagnes pour CHR',
  },

  // ===========================================================================
  // ÉPICERIE FINE / BIO / SPÉCIALITÉS
  // ===========================================================================

  {
    name: 'Biocoop Pro',
    type: 'national',
    categories: ['Bio', 'Légumes', 'Fruits', 'Épicerie fine', 'Produits laitiers'],
    regions: [...FRENCH_REGIONS],
    description: 'Offre professionnelle du réseau Biocoop, premier réseau de magasins bio en France. Produits biologiques certifiés pour la restauration.',
    website: 'https://www.biocoop.fr',
    delivery: true,
    minOrder: '200€ HT minimum',
    speciality: 'Produits 100% bio, commerce équitable, local',
  },
  {
    name: 'Relais Vert',
    type: 'national',
    categories: ['Bio', 'Légumes', 'Fruits', 'Épicerie fine', 'Féculents'],
    regions: [...FRENCH_REGIONS],
    description: 'Grossiste et distributeur de produits biologiques pour les professionnels. Large gamme d\'épicerie sèche, fruits et légumes bio.',
    website: 'https://www.relais-vert.com',
    delivery: true,
    minOrder: '150€ HT minimum',
    speciality: 'Grossiste bio, épicerie sèche bio, fruits et légumes bio',
  },
  {
    name: 'Biodis',
    type: 'national',
    categories: ['Bio', 'Épicerie fine', 'Féculents', 'Huiles'],
    regions: [...FRENCH_REGIONS],
    description: 'Distributeur de produits biologiques et naturels pour les professionnels. Gamme complète d\'épicerie bio.',
    delivery: true,
    speciality: 'Épicerie bio, produits naturels, compléments alimentaires',
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
    delivery: true,
    speciality: 'Épices, herbes, mélanges, poivres, condiments professionnels',
  },
  {
    name: 'Terre Exotique',
    type: 'specialiste',
    categories: ['Épices', 'Épicerie fine'],
    regions: [...FRENCH_REGIONS],
    description: 'Maison française d\'épices d\'exception. Sélection d\'épices rares et de poivres du monde entier. Fournisseur de chefs étoilés.',
    website: 'https://www.terreexotique.fr',
    delivery: true,
    minOrder: '80€ HT minimum',
    speciality: 'Épices rares, poivres d\'exception, vanille, safran',
  },
  {
    name: 'Albert Ménès',
    type: 'specialiste',
    categories: ['Épices', 'Épicerie fine', 'Huiles'],
    regions: [...FRENCH_REGIONS],
    description: 'Maison d\'épicerie fine française depuis 1921. Épices, condiments, huiles, vinaigres et produits fins pour la restauration.',
    website: 'https://www.albertmenes.fr',
    delivery: true,
    speciality: 'Épicerie fine, épices premium, huiles et vinaigres de qualité',
  },

  // ===========================================================================
  // HUILES & CONDIMENTS
  // ===========================================================================

  {
    name: 'Lesieur Professionnel',
    type: 'national',
    categories: ['Huiles', 'Épicerie fine'],
    regions: [...FRENCH_REGIONS],
    description: 'Gamme professionnelle de Lesieur : huiles de friture, huiles de cuisson, vinaigrettes, sauces et mayonnaises en formats restauration.',
    website: 'https://www.lesieur-foodservice.fr',
    delivery: true,
    speciality: 'Huiles professionnelles, huiles de friture, sauces, vinaigrettes',
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
  },

  // ===========================================================================
  // FÉCULENTS & PÂTES
  // ===========================================================================

  {
    name: 'Panzani Foodservice',
    type: 'national',
    categories: ['Féculents'],
    regions: [...FRENCH_REGIONS],
    description: 'Gamme professionnelle de Panzani : pâtes, riz, semoule, sauces en formats restauration. Leader des pâtes en France.',
    website: 'https://www.panzani-foodservice.fr',
    delivery: true,
    speciality: 'Pâtes, riz, semoule, sauces tomate en formats professionnels',
  },
  {
    name: 'Tipiak Foodservice',
    type: 'national',
    categories: ['Féculents', 'Surgelés'],
    regions: [...FRENCH_REGIONS],
    description: 'Solutions culinaires pour la restauration : couscous, taboulé, spécialités surgelées, produits traiteur.',
    website: 'https://www.tipiak.fr',
    delivery: true,
    speciality: 'Couscous, céréales, spécialités traiteur, mini-bouchées surgelées',
  },

  // ===========================================================================
  // FOURNISSEURS RÉGIONAUX - ÎLE-DE-FRANCE
  // ===========================================================================

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
  },

  // ===========================================================================
  // FOURNISSEURS RÉGIONAUX - PROVENCE-ALPES-CÔTE D'AZUR
  // ===========================================================================

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
  },

  // ===========================================================================
  // FOURNISSEURS RÉGIONAUX - AUVERGNE-RHÔNE-ALPES
  // ===========================================================================

  {
    name: 'Marché de gros de Lyon (MIN de Corbas)',
    type: 'grossiste',
    categories: ['Légumes', 'Fruits', 'Viandes', 'Fromages'],
    regions: ['Auvergne-Rhône-Alpes'],
    departments: ['69', '38', '42', '01'],
    cities: ['Lyon', 'Corbas'],
    description: 'Marché d\'intérêt national de Lyon-Corbas. Deuxième marché de gros de France. Grossistes en produits frais.',
    delivery: false,
    speciality: 'Produits lyonnais, fromages régionaux, charcuterie',
  },

  // ===========================================================================
  // FOURNISSEURS RÉGIONAUX - BRETAGNE
  // ===========================================================================

  {
    name: 'Marché de gros de Rennes (MIN)',
    type: 'grossiste',
    categories: ['Légumes', 'Fruits', 'Poissons'],
    regions: ['Bretagne'],
    departments: ['35', '22', '56', '29'],
    cities: ['Rennes'],
    description: 'Marché d\'intérêt national de Rennes. Spécialiste des produits bretons : légumes de plein champ, artichaut, chou-fleur, poissons.',
    delivery: false,
    speciality: 'Légumes bretons, produits de la mer, artichaut de Bretagne',
  },

  // ===========================================================================
  // FOURNISSEURS RÉGIONAUX - OCCITANIE
  // ===========================================================================

  {
    name: 'Marché de gros de Toulouse (MIN)',
    type: 'grossiste',
    categories: ['Légumes', 'Fruits', 'Viandes'],
    regions: ['Occitanie'],
    departments: ['31', '32', '81', '82'],
    cities: ['Toulouse'],
    description: 'Marché d\'intérêt national de Toulouse. Produits du Sud-Ouest : foie gras, canard, fruits et légumes.',
    delivery: false,
    speciality: 'Canard, foie gras, produits du Sud-Ouest',
  },

  // ===========================================================================
  // SPÉCIALISTES CHARCUTERIE / TRAITEUR
  // ===========================================================================

  {
    name: 'Fleury Michon Foodservice',
    type: 'national',
    categories: ['Charcuterie', 'Viandes', 'Surgelés'],
    regions: [...FRENCH_REGIONS],
    description: 'Gamme professionnelle Fleury Michon : charcuterie, plats cuisinés, surimi. Solutions pour la restauration collective et commerciale.',
    website: 'https://www.fleurymichon.fr',
    delivery: true,
    speciality: 'Charcuterie, jambon, plats cuisinés, surimi professionnel',
  },
  {
    name: 'Madrange',
    type: 'national',
    categories: ['Charcuterie', 'Viandes'],
    regions: [...FRENCH_REGIONS],
    description: 'Charcutier français spécialisé dans le jambon et les produits de charcuterie pour la restauration.',
    website: 'https://www.madrange.fr',
    delivery: true,
    speciality: 'Jambon supérieur, charcuterie premium, produits tranchés',
  },

  // ===========================================================================
  // MATÉRIEL & INGRÉDIENTS SPÉCIALISÉS
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
  },
  {
    name: 'Cacao Barry (Barry Callebaut)',
    type: 'national',
    categories: ['Épicerie fine', 'Boulangerie'],
    regions: [...FRENCH_REGIONS],
    description: 'Fournisseur mondial de chocolat de couverture et d\'ingrédients pour les professionnels de la pâtisserie et de la chocolaterie.',
    website: 'https://www.cacao-barry.com',
    delivery: true,
    speciality: 'Chocolat de couverture, cacao, pralinés, décors chocolat',
  },

  // ===========================================================================
  // TRAITEUR / PRODUITS ÉLABORÉS
  // ===========================================================================

  {
    name: 'Bonduelle Foodservice',
    type: 'national',
    categories: ['Légumes', 'Surgelés'],
    regions: [...FRENCH_REGIONS],
    description: 'Gamme professionnelle de Bonduelle : légumes en conserve, surgelés et frais prêts à l\'emploi pour la restauration.',
    website: 'https://www.bonduelle-foodservice.fr',
    delivery: true,
    speciality: 'Légumes prêts à l\'emploi, conserves, surgelés, vapeur',
  },
  {
    name: 'D\'aucy Foodservice',
    type: 'national',
    categories: ['Légumes', 'Surgelés', 'Féculents'],
    regions: [...FRENCH_REGIONS],
    description: 'Gamme professionnelle de la coopérative d\'Aucy. Légumes en conserve et surgelés, légumineuses pour la restauration.',
    website: 'https://www.daucy-foodservice.fr',
    delivery: true,
    speciality: 'Légumes bretons, conserves, surgelés, légumineuses',
  },
];

// =============================================================================
// FONCTIONS DE RECHERCHE
// =============================================================================

/**
 * Recherche de fournisseurs avec filtres multiples
 * @param query - Texte libre (recherche dans nom, description, spécialité)
 * @param region - Filtrer par région
 * @param department - Filtrer par département
 * @param category - Filtrer par catégorie de produits
 * @returns Liste de fournisseurs correspondants
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
      const searchableText = [
        supplier.name,
        supplier.description,
        supplier.speciality || '',
        ...supplier.categories,
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
 * @param region - Nom de la région française
 * @returns Liste de fournisseurs de la région
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
 * @param category - Catégorie de produits (Viandes, Poissons, Légumes, etc.)
 * @returns Liste de fournisseurs de la catégorie
 */
export function getSuppliersByCategory(category: string): FrenchSupplier[] {
  const lowerCategory = category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return FRENCH_SUPPLIERS.filter((supplier) =>
    supplier.categories.some(
      (c) =>
        c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === lowerCategory
    )
  );
}

/**
 * Récupère les fournisseurs par type
 * @param type - Type de fournisseur (grossiste, specialiste, local, national)
 * @returns Liste de fournisseurs du type demandé
 */
export function getSuppliersByType(type: FrenchSupplier['type']): FrenchSupplier[] {
  return FRENCH_SUPPLIERS.filter((supplier) => supplier.type === type);
}

/**
 * Récupère les fournisseurs qui livrent
 * @returns Liste de fournisseurs avec livraison
 */
export function getSuppliersWithDelivery(): FrenchSupplier[] {
  return FRENCH_SUPPLIERS.filter((supplier) => supplier.delivery);
}

/**
 * Récupère les fournisseurs par département
 * @param department - Numéro de département (ex: '75', '13', '69')
 * @returns Liste de fournisseurs du département (inclut les nationaux)
 */
export function getSuppliersByDepartment(department: string): FrenchSupplier[] {
  return FRENCH_SUPPLIERS.filter(
    (supplier) =>
      (supplier.departments && supplier.departments.includes(department)) ||
      supplier.regions.length === FRENCH_REGIONS.length // national = available everywhere
  );
}
