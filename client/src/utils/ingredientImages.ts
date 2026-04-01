// Mapping nom d'ingrédient -> image Spoonacular
// URL pattern: https://spoonacular.com/cdn/ingredients_100x100/{filename}

const INGREDIENT_IMAGE_MAP: Record<string, string> = {
  // Viandes
  'boeuf': 'beef-cubes.jpg',
  'filet de boeuf': 'beef-tenderloin.jpg',
  'entrecote': 'ribeye-raw.jpg',
  'poulet': 'whole-chicken.jpg',
  'blanc de poulet': 'chicken-breasts.png',
  'canard': 'duck-breasts.jpg',
  'magret': 'duck-breasts.jpg',
  'agneau': 'lamb-loin.jpg',
  'porc': 'pork-tenderloin.jpg',
  'veau': 'veal-scallopini.jpg',
  'lardons': 'bacon-bits.jpg',
  'jambon': 'ham-whole.jpg',
  'saucisse': 'sausage-links.jpg',

  // Poissons & fruits de mer
  'saumon': 'salmon.png',
  'bar': 'sea-bass.jpg',
  'cabillaud': 'cod-fillet.jpg',
  'thon': 'fresh-tuna.jpg',
  'crevettes': 'shrimp.png',
  'gambas': 'shrimp.png',
  'moules': 'mussels.jpg',
  'homard': 'lobster.jpg',
  'sole': 'sole-fillet.jpg',

  // Fruits & Légumes
  'tomate': 'tomato.png',
  'tomates': 'tomato.png',
  'oignon': 'brown-onion.png',
  'oignons': 'brown-onion.png',
  'ail': 'garlic.png',
  'carotte': 'carrots.jpg',
  'carottes': 'carrots.jpg',
  'pomme de terre': 'potatoes-yukon.png',
  'courgette': 'zucchini.jpg',
  'aubergine': 'eggplant.png',
  'poivron': 'bell-pepper-orange.png',
  'champignon': 'mushrooms.png',
  'champignons': 'mushrooms.png',
  'salade': 'mixed-greens.jpg',
  'laitue': 'iceberg-lettuce.png',
  'epinard': 'spinach.jpg',
  'epinards': 'spinach.jpg',
  'haricots verts': 'string-beans.jpg',
  'brocoli': 'broccoli.jpg',
  'chou-fleur': 'cauliflower.jpg',
  'avocat': 'avocado.jpg',
  'citron': 'lemon.png',
  'citrons': 'lemon.png',
  'orange': 'orange.png',
  'pomme': 'apple.jpg',
  'mangue': 'mango.jpg',
  'fraise': 'strawberries.jpg',
  'fraises': 'strawberries.jpg',
  'framboise': 'raspberries.jpg',
  'framboises': 'raspberries.jpg',
  'banane': 'bananas.jpg',
  'persil': 'parsley.jpg',
  'basilic': 'basil.jpg',
  'ciboulette': 'chives.jpg',
  'thym': 'thyme.jpg',
  'romarin': 'rosemary.jpg',

  // Epicerie
  'farine': 'flour.png',
  'sucre': 'sugar-in-a-bowl.png',
  'sel': 'salt.jpg',
  'poivre': 'pepper.jpg',
  'huile olive': 'olive-oil.jpg',
  "huile d'olive": 'olive-oil.jpg',
  'vinaigre': 'vinegar-(white).jpg',
  'vinaigre balsamique': 'balsamic-vinegar.jpg',
  'riz': 'uncooked-white-rice.png',
  'pates': 'penne.jpg',
  'sauce soja': 'soy-sauce.jpg',
  'moutarde': 'dijon-mustard.jpg',
  'mayonnaise': 'mayonnaise.png',
  'ketchup': 'ketchup.png',
  'miel': 'honey.png',
  'chocolat': 'dark-chocolate-bar.jpg',
  'vanille': 'vanilla-extract.jpg',
  'levure': 'yeast.jpg',
  'cornichons': 'dill-pickles.jpg',
  'olives': 'olives.png',
  'capres': 'capers.jpg',

  // Produits laitiers
  'beurre': 'butter-sliced.jpg',
  'creme': 'fluid-cream.jpg',
  'creme fraiche': 'creme-fraiche.jpg',
  'lait': 'milk.png',
  'fromage': 'cheddar-cheese.png',
  'parmesan': 'parmesan.jpg',
  'mozzarella': 'mozzarella.png',
  'gruyere': 'gruyere.jpg',
  'oeuf': 'egg.png',
  'oeufs': 'egg.png',
  'yaourt': 'plain-yogurt.jpg',
  'mascarpone': 'mascarpone.png',

  // Boissons
  'eau': 'water.png',
  'vin rouge': 'red-wine.jpg',
  'vin blanc': 'white-wine.jpg',
  'biere': 'beer.jpg',
  'cafe': 'brewed-coffee.jpg',
  'the': 'tea-bags.jpg',
  'jus orange': 'orange-juice.jpg',
  'coca': 'coca-cola.png',

  // Surgeles
  'frites': 'frozen-french-fries.jpg',
  'glace': 'ice-cream.png',

  // Pain
  'pain': 'bread-loaf.jpg',
  'baguette': 'french-bread.jpg',
  'brioche': 'brioche.jpg',
  'croissant': 'croissants.jpg',
};

const SPOONACULAR_CDN = 'https://spoonacular.com/cdn/ingredients_100x100';

// Categorie -> emoji fallback
const CATEGORY_EMOJI: Record<string, string> = {
  'Viandes': '\u{1F969}',
  'Poissons': '\u{1F41F}',
  'Fruits & Légumes': '\u{1F96C}',
  'Légumes': '\u{1F966}',
  'Fruits': '\u{1F34E}',
  'Épicerie': '\u{1FAD2}',
  'Epicerie': '\u{1FAD2}',
  'Produits laitiers': '\u{1F9C0}',
  'Laitier': '\u{1F9C0}',
  'Boissons': '\u{1F377}',
  'Surgelés': '\u{1F9CA}',
  'Boulangerie': '\u{1F956}',
  'Condiments': '\u{1F9C2}',
  'Herbes': '\u{1F33F}',
};

export function getIngredientImageUrl(name: string): string | null {
  const lower = name.toLowerCase().trim();
  // Exact match
  if (INGREDIENT_IMAGE_MAP[lower]) {
    return `${SPOONACULAR_CDN}/${INGREDIENT_IMAGE_MAP[lower]}`;
  }
  // Partial match (name contains a key or key contains name)
  for (const [key, filename] of Object.entries(INGREDIENT_IMAGE_MAP)) {
    if (lower.includes(key) || key.includes(lower)) {
      return `${SPOONACULAR_CDN}/${filename}`;
    }
  }
  return null;
}

export function getCategoryEmoji(category?: string): string {
  if (!category) return '\u{1F37D}\u{FE0F}';
  return CATEGORY_EMOJI[category] || '\u{1F37D}\u{FE0F}';
}

export function getIngredientDisplay(name: string, category?: string): { imageUrl: string | null; emoji: string } {
  return {
    imageUrl: getIngredientImageUrl(name),
    emoji: getCategoryEmoji(category),
  };
}
