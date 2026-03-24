import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Début du seeding...');

  // ============================================
  // FOURNISSEURS & INGRÉDIENTS
  // ============================================

  const ingredientsData = [
    // === VIANDES === (Fournisseur: Boucherie Dupont)
    { name: 'Filet de boeuf', unit: 'kg', pricePerUnit: 42.00, supplier: 'Boucherie Dupont', category: 'Viandes', allergens: [] },
    { name: 'Entrecôte de boeuf', unit: 'kg', pricePerUnit: 32.00, supplier: 'Boucherie Dupont', category: 'Viandes', allergens: [] },
    { name: 'Bavette de boeuf', unit: 'kg', pricePerUnit: 22.00, supplier: 'Boucherie Dupont', category: 'Viandes', allergens: [] },
    { name: 'Blanc de poulet', unit: 'kg', pricePerUnit: 9.50, supplier: 'Boucherie Dupont', category: 'Viandes', allergens: [] },
    { name: 'Cuisse de poulet', unit: 'kg', pricePerUnit: 6.80, supplier: 'Boucherie Dupont', category: 'Viandes', allergens: [] },
    { name: 'Cuisse de canard confite', unit: 'pièce', pricePerUnit: 3.50, supplier: 'Boucherie Dupont', category: 'Viandes', allergens: [] },
    { name: 'Magret de canard', unit: 'kg', pricePerUnit: 28.00, supplier: 'Boucherie Dupont', category: 'Viandes', allergens: [] },
    { name: 'Côte de porc', unit: 'kg', pricePerUnit: 10.50, supplier: 'Boucherie Dupont', category: 'Viandes', allergens: [] },
    { name: 'Épaule d\'agneau', unit: 'kg', pricePerUnit: 18.00, supplier: 'Boucherie Dupont', category: 'Viandes', allergens: [] },
    { name: 'Souris d\'agneau', unit: 'pièce', pricePerUnit: 5.50, supplier: 'Boucherie Dupont', category: 'Viandes', allergens: [] },
    { name: 'Lardons fumés', unit: 'kg', pricePerUnit: 8.50, supplier: 'Boucherie Dupont', category: 'Viandes', allergens: [] },
    { name: 'Jambon blanc', unit: 'kg', pricePerUnit: 12.00, supplier: 'Boucherie Dupont', category: 'Viandes', allergens: [] },
    { name: 'Saucisse de Toulouse', unit: 'kg', pricePerUnit: 9.00, supplier: 'Boucherie Dupont', category: 'Viandes', allergens: [] },
    { name: 'Veau (escalope)', unit: 'kg', pricePerUnit: 28.00, supplier: 'Boucherie Dupont', category: 'Viandes', allergens: [] },
    { name: 'Steak haché 15%', unit: 'kg', pricePerUnit: 11.00, supplier: 'Boucherie Dupont', category: 'Viandes', allergens: [] },

    // === POISSONS & FRUITS DE MER === (Fournisseur: Marée Fraîche)
    { name: 'Saumon frais (filet)', unit: 'kg', pricePerUnit: 22.00, supplier: 'Marée Fraîche', category: 'Poissons & Fruits de mer', allergens: ['Poissons'] },
    { name: 'Cabillaud (dos)', unit: 'kg', pricePerUnit: 18.00, supplier: 'Marée Fraîche', category: 'Poissons & Fruits de mer', allergens: ['Poissons'] },
    { name: 'Bar (filet)', unit: 'kg', pricePerUnit: 28.00, supplier: 'Marée Fraîche', category: 'Poissons & Fruits de mer', allergens: ['Poissons'] },
    { name: 'Sole (filet)', unit: 'kg', pricePerUnit: 35.00, supplier: 'Marée Fraîche', category: 'Poissons & Fruits de mer', allergens: ['Poissons'] },
    { name: 'Thon frais', unit: 'kg', pricePerUnit: 32.00, supplier: 'Marée Fraîche', category: 'Poissons & Fruits de mer', allergens: ['Poissons'] },
    { name: 'Crevettes roses', unit: 'kg', pricePerUnit: 16.00, supplier: 'Marée Fraîche', category: 'Poissons & Fruits de mer', allergens: ['Crustacés'] },
    { name: 'Moules de bouchot', unit: 'kg', pricePerUnit: 5.50, supplier: 'Marée Fraîche', category: 'Poissons & Fruits de mer', allergens: ['Mollusques'] },
    { name: 'Saint-Jacques (noix)', unit: 'kg', pricePerUnit: 45.00, supplier: 'Marée Fraîche', category: 'Poissons & Fruits de mer', allergens: ['Mollusques'] },
    { name: 'Gambas', unit: 'kg', pricePerUnit: 22.00, supplier: 'Marée Fraîche', category: 'Poissons & Fruits de mer', allergens: ['Crustacés'] },

    // === LÉGUMES === (Fournisseur: Jardins du Terroir)
    { name: 'Pomme de terre', unit: 'kg', pricePerUnit: 1.20, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Carotte', unit: 'kg', pricePerUnit: 1.50, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Oignon jaune', unit: 'kg', pricePerUnit: 1.30, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Échalote', unit: 'kg', pricePerUnit: 4.50, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Ail', unit: 'kg', pricePerUnit: 8.00, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Tomate', unit: 'kg', pricePerUnit: 3.00, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Courgette', unit: 'kg', pricePerUnit: 2.50, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Aubergine', unit: 'kg', pricePerUnit: 3.00, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Poivron rouge', unit: 'kg', pricePerUnit: 4.00, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Poivron vert', unit: 'kg', pricePerUnit: 3.50, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Haricots verts', unit: 'kg', pricePerUnit: 4.50, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Épinards frais', unit: 'kg', pricePerUnit: 5.00, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Champignons de Paris', unit: 'kg', pricePerUnit: 4.00, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Cèpes', unit: 'kg', pricePerUnit: 35.00, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Salade verte (batavia)', unit: 'pièce', pricePerUnit: 1.20, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Roquette', unit: 'kg', pricePerUnit: 12.00, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Mâche', unit: 'kg', pricePerUnit: 14.00, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Poireau', unit: 'kg', pricePerUnit: 2.50, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Céleri branche', unit: 'kg', pricePerUnit: 3.00, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: ['Céleri'] },
    { name: 'Brocoli', unit: 'kg', pricePerUnit: 3.50, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Chou-fleur', unit: 'pièce', pricePerUnit: 2.50, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Asperges vertes', unit: 'botte', pricePerUnit: 4.50, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Avocat', unit: 'pièce', pricePerUnit: 1.50, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Concombre', unit: 'pièce', pricePerUnit: 1.00, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },
    { name: 'Betterave cuite', unit: 'kg', pricePerUnit: 3.50, supplier: 'Jardins du Terroir', category: 'Légumes', allergens: [] },

    // === FRUITS === (Fournisseur: Vergers de Provence)
    { name: 'Citron', unit: 'kg', pricePerUnit: 3.00, supplier: 'Vergers de Provence', category: 'Fruits', allergens: [] },
    { name: 'Citron vert (lime)', unit: 'kg', pricePerUnit: 5.00, supplier: 'Vergers de Provence', category: 'Fruits', allergens: [] },
    { name: 'Orange', unit: 'kg', pricePerUnit: 2.50, supplier: 'Vergers de Provence', category: 'Fruits', allergens: [] },
    { name: 'Pomme Golden', unit: 'kg', pricePerUnit: 2.80, supplier: 'Vergers de Provence', category: 'Fruits', allergens: [] },
    { name: 'Poire', unit: 'kg', pricePerUnit: 3.50, supplier: 'Vergers de Provence', category: 'Fruits', allergens: [] },
    { name: 'Fraise', unit: 'kg', pricePerUnit: 8.00, supplier: 'Vergers de Provence', category: 'Fruits', allergens: [] },
    { name: 'Framboise', unit: 'kg', pricePerUnit: 16.00, supplier: 'Vergers de Provence', category: 'Fruits', allergens: [] },
    { name: 'Banane', unit: 'kg', pricePerUnit: 1.80, supplier: 'Vergers de Provence', category: 'Fruits', allergens: [] },
    { name: 'Mangue', unit: 'pièce', pricePerUnit: 3.00, supplier: 'Vergers de Provence', category: 'Fruits', allergens: [] },

    // === PRODUITS LAITIERS === (Fournisseur: Laiterie Centrale)
    { name: 'Lait entier', unit: 'L', pricePerUnit: 1.10, supplier: 'Laiterie Centrale', category: 'Produits laitiers', allergens: ['Lait'] },
    { name: 'Crème fraîche épaisse 30%', unit: 'L', pricePerUnit: 4.50, supplier: 'Laiterie Centrale', category: 'Produits laitiers', allergens: ['Lait'] },
    { name: 'Crème liquide 35%', unit: 'L', pricePerUnit: 3.80, supplier: 'Laiterie Centrale', category: 'Produits laitiers', allergens: ['Lait'] },
    { name: 'Beurre doux', unit: 'kg', pricePerUnit: 8.50, supplier: 'Laiterie Centrale', category: 'Produits laitiers', allergens: ['Lait'] },
    { name: 'Beurre demi-sel', unit: 'kg', pricePerUnit: 9.00, supplier: 'Laiterie Centrale', category: 'Produits laitiers', allergens: ['Lait'] },
    { name: 'Fromage râpé (emmental)', unit: 'kg', pricePerUnit: 7.50, supplier: 'Laiterie Centrale', category: 'Produits laitiers', allergens: ['Lait'] },
    { name: 'Parmesan AOP', unit: 'kg', pricePerUnit: 22.00, supplier: 'Laiterie Centrale', category: 'Produits laitiers', allergens: ['Lait'] },
    { name: 'Mozzarella', unit: 'kg', pricePerUnit: 8.00, supplier: 'Laiterie Centrale', category: 'Produits laitiers', allergens: ['Lait'] },
    { name: 'Chèvre frais', unit: 'kg', pricePerUnit: 12.00, supplier: 'Laiterie Centrale', category: 'Produits laitiers', allergens: ['Lait'] },
    { name: 'Roquefort', unit: 'kg', pricePerUnit: 18.00, supplier: 'Laiterie Centrale', category: 'Produits laitiers', allergens: ['Lait'] },
    { name: 'Mascarpone', unit: 'kg', pricePerUnit: 6.50, supplier: 'Laiterie Centrale', category: 'Produits laitiers', allergens: ['Lait'] },
    { name: 'Oeufs (calibre M)', unit: 'pièce', pricePerUnit: 0.25, supplier: 'Laiterie Centrale', category: 'Produits laitiers', allergens: ['Oeufs'] },
    { name: 'Oeufs (calibre L)', unit: 'pièce', pricePerUnit: 0.30, supplier: 'Laiterie Centrale', category: 'Produits laitiers', allergens: ['Oeufs'] },
    { name: 'Yaourt nature', unit: 'kg', pricePerUnit: 2.50, supplier: 'Laiterie Centrale', category: 'Produits laitiers', allergens: ['Lait'] },
    { name: 'Fromage blanc', unit: 'kg', pricePerUnit: 3.00, supplier: 'Laiterie Centrale', category: 'Produits laitiers', allergens: ['Lait'] },

    // === ÉPICES & CONDIMENTS === (Fournisseur: Épices du Monde)
    { name: 'Sel fin', unit: 'kg', pricePerUnit: 0.80, supplier: 'Épices du Monde', category: 'Épices & Condiments', allergens: [] },
    { name: 'Poivre noir moulu', unit: 'kg', pricePerUnit: 18.00, supplier: 'Épices du Monde', category: 'Épices & Condiments', allergens: [] },
    { name: 'Fleur de sel', unit: 'kg', pricePerUnit: 12.00, supplier: 'Épices du Monde', category: 'Épices & Condiments', allergens: [] },
    { name: 'Paprika', unit: 'kg', pricePerUnit: 14.00, supplier: 'Épices du Monde', category: 'Épices & Condiments', allergens: [] },
    { name: 'Cumin moulu', unit: 'kg', pricePerUnit: 16.00, supplier: 'Épices du Monde', category: 'Épices & Condiments', allergens: [] },
    { name: 'Curry', unit: 'kg', pricePerUnit: 15.00, supplier: 'Épices du Monde', category: 'Épices & Condiments', allergens: [] },
    { name: 'Herbes de Provence', unit: 'kg', pricePerUnit: 20.00, supplier: 'Épices du Monde', category: 'Épices & Condiments', allergens: [] },
    { name: 'Thym frais', unit: 'botte', pricePerUnit: 1.50, supplier: 'Épices du Monde', category: 'Épices & Condiments', allergens: [] },
    { name: 'Persil frais', unit: 'botte', pricePerUnit: 1.00, supplier: 'Épices du Monde', category: 'Épices & Condiments', allergens: [] },
    { name: 'Ciboulette', unit: 'botte', pricePerUnit: 1.50, supplier: 'Épices du Monde', category: 'Épices & Condiments', allergens: [] },
    { name: 'Basilic frais', unit: 'botte', pricePerUnit: 1.50, supplier: 'Épices du Monde', category: 'Épices & Condiments', allergens: [] },
    { name: 'Moutarde de Dijon', unit: 'kg', pricePerUnit: 5.00, supplier: 'Épices du Monde', category: 'Épices & Condiments', allergens: ['Moutarde'] },
    { name: 'Vinaigre balsamique', unit: 'L', pricePerUnit: 8.00, supplier: 'Épices du Monde', category: 'Épices & Condiments', allergens: ['Sulfites'] },
    { name: 'Vinaigre de vin rouge', unit: 'L', pricePerUnit: 3.50, supplier: 'Épices du Monde', category: 'Épices & Condiments', allergens: ['Sulfites'] },
    { name: 'Sauce soja', unit: 'L', pricePerUnit: 5.00, supplier: 'Épices du Monde', category: 'Épices & Condiments', allergens: ['Soja', 'Gluten'] },
    { name: 'Noix de muscade', unit: 'kg', pricePerUnit: 45.00, supplier: 'Épices du Monde', category: 'Épices & Condiments', allergens: [] },
    { name: 'Concentré de tomate', unit: 'kg', pricePerUnit: 3.50, supplier: 'Épices du Monde', category: 'Épices & Condiments', allergens: [] },
    { name: 'Coulis de tomate', unit: 'L', pricePerUnit: 2.50, supplier: 'Épices du Monde', category: 'Épices & Condiments', allergens: [] },

    // === FÉCULENTS & CÉRÉALES === (Fournisseur: Moulin de France)
    { name: 'Farine T55', unit: 'kg', pricePerUnit: 1.00, supplier: 'Moulin de France', category: 'Féculents & Céréales', allergens: ['Gluten'] },
    { name: 'Farine T45', unit: 'kg', pricePerUnit: 1.20, supplier: 'Moulin de France', category: 'Féculents & Céréales', allergens: ['Gluten'] },
    { name: 'Spaghetti', unit: 'kg', pricePerUnit: 1.80, supplier: 'Moulin de France', category: 'Féculents & Céréales', allergens: ['Gluten'] },
    { name: 'Penne rigate', unit: 'kg', pricePerUnit: 1.80, supplier: 'Moulin de France', category: 'Féculents & Céréales', allergens: ['Gluten'] },
    { name: 'Tagliatelles fraîches', unit: 'kg', pricePerUnit: 4.50, supplier: 'Moulin de France', category: 'Féculents & Céréales', allergens: ['Gluten', 'Oeufs'] },
    { name: 'Riz basmati', unit: 'kg', pricePerUnit: 2.50, supplier: 'Moulin de France', category: 'Féculents & Céréales', allergens: [] },
    { name: 'Riz arborio (risotto)', unit: 'kg', pricePerUnit: 3.50, supplier: 'Moulin de France', category: 'Féculents & Céréales', allergens: [] },
    { name: 'Pâte feuilletée', unit: 'pièce', pricePerUnit: 1.80, supplier: 'Moulin de France', category: 'Féculents & Céréales', allergens: ['Gluten', 'Lait'] },
    { name: 'Pâte brisée', unit: 'pièce', pricePerUnit: 1.50, supplier: 'Moulin de France', category: 'Féculents & Céréales', allergens: ['Gluten', 'Lait'] },
    { name: 'Pain de mie', unit: 'pièce', pricePerUnit: 1.80, supplier: 'Moulin de France', category: 'Féculents & Céréales', allergens: ['Gluten', 'Lait'] },
    { name: 'Chapelure', unit: 'kg', pricePerUnit: 2.50, supplier: 'Moulin de France', category: 'Féculents & Céréales', allergens: ['Gluten'] },
    { name: 'Semoule de blé', unit: 'kg', pricePerUnit: 1.50, supplier: 'Moulin de France', category: 'Féculents & Céréales', allergens: ['Gluten'] },
    { name: 'Lentilles vertes', unit: 'kg', pricePerUnit: 3.50, supplier: 'Moulin de France', category: 'Féculents & Céréales', allergens: [] },
    { name: 'Maïzena', unit: 'kg', pricePerUnit: 4.00, supplier: 'Moulin de France', category: 'Féculents & Céréales', allergens: [] },
    { name: 'Pois chiches (conserve)', unit: 'kg', pricePerUnit: 2.50, supplier: 'Moulin de France', category: 'Féculents & Céréales', allergens: [] },

    // === HUILES & MATIÈRES GRASSES === (Fournisseur: Huilerie du Sud)
    { name: 'Huile d\'olive extra vierge', unit: 'L', pricePerUnit: 8.00, supplier: 'Huilerie du Sud', category: 'Huiles & Matières grasses', allergens: [] },
    { name: 'Huile de tournesol', unit: 'L', pricePerUnit: 2.50, supplier: 'Huilerie du Sud', category: 'Huiles & Matières grasses', allergens: [] },
    { name: 'Huile de sésame', unit: 'L', pricePerUnit: 12.00, supplier: 'Huilerie du Sud', category: 'Huiles & Matières grasses', allergens: ['Sésame'] },
    { name: 'Huile de noix', unit: 'L', pricePerUnit: 18.00, supplier: 'Huilerie du Sud', category: 'Huiles & Matières grasses', allergens: ['Fruits à coque'] },

    // === AUTRES === (Fournisseurs divers)
    { name: 'Sucre en poudre', unit: 'kg', pricePerUnit: 1.20, supplier: 'Moulin de France', category: 'Autres', allergens: [] },
    { name: 'Sucre glace', unit: 'kg', pricePerUnit: 2.00, supplier: 'Moulin de France', category: 'Autres', allergens: [] },
    { name: 'Cassonade', unit: 'kg', pricePerUnit: 2.50, supplier: 'Moulin de France', category: 'Autres', allergens: [] },
    { name: 'Miel', unit: 'kg', pricePerUnit: 12.00, supplier: 'Vergers de Provence', category: 'Autres', allergens: [] },
    { name: 'Chocolat noir 70%', unit: 'kg', pricePerUnit: 12.00, supplier: 'Moulin de France', category: 'Autres', allergens: ['Lait', 'Soja'] },
    { name: 'Chocolat au lait', unit: 'kg', pricePerUnit: 10.00, supplier: 'Moulin de France', category: 'Autres', allergens: ['Lait', 'Soja'] },
    { name: 'Cacao en poudre', unit: 'kg', pricePerUnit: 8.00, supplier: 'Moulin de France', category: 'Autres', allergens: [] },
    { name: 'Vanille (gousse)', unit: 'pièce', pricePerUnit: 4.00, supplier: 'Épices du Monde', category: 'Autres', allergens: [] },
    { name: 'Gélatine (feuille)', unit: 'pièce', pricePerUnit: 0.15, supplier: 'Moulin de France', category: 'Autres', allergens: [] },
    { name: 'Levure chimique', unit: 'kg', pricePerUnit: 6.00, supplier: 'Moulin de France', category: 'Autres', allergens: [] },
    { name: 'Amandes effilées', unit: 'kg', pricePerUnit: 14.00, supplier: 'Moulin de France', category: 'Autres', allergens: ['Fruits à coque'] },
    { name: 'Noisettes', unit: 'kg', pricePerUnit: 16.00, supplier: 'Moulin de France', category: 'Autres', allergens: ['Fruits à coque'] },
    { name: 'Noix', unit: 'kg', pricePerUnit: 14.00, supplier: 'Moulin de France', category: 'Autres', allergens: ['Fruits à coque'] },
    { name: 'Pignons de pin', unit: 'kg', pricePerUnit: 45.00, supplier: 'Moulin de France', category: 'Autres', allergens: ['Fruits à coque'] },
    { name: 'Fond de veau', unit: 'L', pricePerUnit: 6.00, supplier: 'Boucherie Dupont', category: 'Autres', allergens: [] },
    { name: 'Bouillon de volaille', unit: 'L', pricePerUnit: 3.00, supplier: 'Boucherie Dupont', category: 'Autres', allergens: [] },
    { name: 'Vin blanc (cuisine)', unit: 'L', pricePerUnit: 4.00, supplier: 'Huilerie du Sud', category: 'Boissons', allergens: ['Sulfites'] },
    { name: 'Vin rouge (cuisine)', unit: 'L', pricePerUnit: 4.00, supplier: 'Huilerie du Sud', category: 'Boissons', allergens: ['Sulfites'] },
    { name: 'Porto', unit: 'L', pricePerUnit: 12.00, supplier: 'Huilerie du Sud', category: 'Boissons', allergens: ['Sulfites'] },
    { name: 'Cognac', unit: 'L', pricePerUnit: 25.00, supplier: 'Huilerie du Sud', category: 'Boissons', allergens: ['Sulfites'] },
    { name: 'Olives noires', unit: 'kg', pricePerUnit: 6.00, supplier: 'Huilerie du Sud', category: 'Autres', allergens: [] },
    { name: 'Câpres', unit: 'kg', pricePerUnit: 12.00, supplier: 'Épices du Monde', category: 'Autres', allergens: [] },
    { name: 'Cornichons', unit: 'kg', pricePerUnit: 5.00, supplier: 'Épices du Monde', category: 'Autres', allergens: [] },
    { name: 'Tomates séchées', unit: 'kg', pricePerUnit: 15.00, supplier: 'Huilerie du Sud', category: 'Autres', allergens: [] },
  ];

  // Create all ingredients
  console.log(`📦 Création de ${ingredientsData.length} ingrédients...`);
  const createdIngredients: Record<string, number> = {};

  for (const ing of ingredientsData) {
    const existing = await prisma.ingredient.findFirst({ where: { name: ing.name } });
    if (existing) {
      createdIngredients[ing.name] = existing.id;
      continue;
    }
    const created = await prisma.ingredient.create({ data: ing });
    createdIngredients[ing.name] = created.id;
  }
  console.log(`✅ Ingrédients créés/trouvés: ${Object.keys(createdIngredients).length}`);

  // ============================================
  // RECETTES COMPLÈTES
  // ============================================
  const recipesData = [
    // --- ENTRÉES ---
    {
      name: 'Quiche Lorraine',
      category: 'Entrée',
      sellingPrice: 12.00,
      nbPortions: 6,
      description: 'Quiche traditionnelle aux lardons et fromage, pâte brisée maison',
      prepTimeMinutes: 25,
      cookTimeMinutes: 35,
      laborCostPerHour: 15,
      ingredients: [
        { name: 'Pâte brisée', quantity: 1, wastePercent: 0 },
        { name: 'Lardons fumés', quantity: 0.200, wastePercent: 0 },
        { name: 'Oeufs (calibre L)', quantity: 4, wastePercent: 0 },
        { name: 'Crème fraîche épaisse 30%', quantity: 0.25, wastePercent: 0 },
        { name: 'Lait entier', quantity: 0.15, wastePercent: 0 },
        { name: 'Fromage râpé (emmental)', quantity: 0.100, wastePercent: 0 },
        { name: 'Noix de muscade', quantity: 0.002, wastePercent: 0 },
        { name: 'Sel fin', quantity: 0.005, wastePercent: 0 },
        { name: 'Poivre noir moulu', quantity: 0.002, wastePercent: 0 },
      ],
    },
    {
      name: 'Salade César',
      category: 'Entrée',
      sellingPrice: 14.00,
      nbPortions: 4,
      description: 'Salade romaine, poulet grillé, croûtons, parmesan et sauce César maison',
      prepTimeMinutes: 20,
      cookTimeMinutes: 10,
      laborCostPerHour: 15,
      ingredients: [
        { name: 'Salade verte (batavia)', quantity: 2, wastePercent: 15 },
        { name: 'Blanc de poulet', quantity: 0.400, wastePercent: 5 },
        { name: 'Parmesan AOP', quantity: 0.080, wastePercent: 0 },
        { name: 'Pain de mie', quantity: 0.5, wastePercent: 0 },
        { name: 'Oeufs (calibre L)', quantity: 2, wastePercent: 0 },
        { name: 'Moutarde de Dijon', quantity: 0.020, wastePercent: 0 },
        { name: 'Huile d\'olive extra vierge', quantity: 0.05, wastePercent: 0 },
        { name: 'Ail', quantity: 0.010, wastePercent: 10 },
        { name: 'Citron', quantity: 0.050, wastePercent: 20 },
      ],
    },
    {
      name: 'Velouté de champignons',
      category: 'Entrée',
      sellingPrice: 10.00,
      nbPortions: 6,
      description: 'Velouté crémeux aux champignons de Paris et cèpes',
      prepTimeMinutes: 15,
      cookTimeMinutes: 30,
      laborCostPerHour: 15,
      ingredients: [
        { name: 'Champignons de Paris', quantity: 0.500, wastePercent: 10 },
        { name: 'Cèpes', quantity: 0.050, wastePercent: 5 },
        { name: 'Oignon jaune', quantity: 0.150, wastePercent: 10 },
        { name: 'Beurre doux', quantity: 0.040, wastePercent: 0 },
        { name: 'Crème liquide 35%', quantity: 0.200, wastePercent: 0 },
        { name: 'Bouillon de volaille', quantity: 0.800, wastePercent: 0 },
        { name: 'Persil frais', quantity: 0.5, wastePercent: 20 },
        { name: 'Sel fin', quantity: 0.005, wastePercent: 0 },
        { name: 'Poivre noir moulu', quantity: 0.002, wastePercent: 0 },
      ],
    },
    {
      name: 'Tartare de saumon',
      category: 'Entrée',
      sellingPrice: 16.00,
      nbPortions: 4,
      description: 'Tartare de saumon frais, avocat, citron vert et ciboulette',
      prepTimeMinutes: 20,
      cookTimeMinutes: 0,
      laborCostPerHour: 15,
      ingredients: [
        { name: 'Saumon frais (filet)', quantity: 0.400, wastePercent: 10 },
        { name: 'Avocat', quantity: 2, wastePercent: 30 },
        { name: 'Citron vert (lime)', quantity: 0.060, wastePercent: 30 },
        { name: 'Échalote', quantity: 0.040, wastePercent: 10 },
        { name: 'Ciboulette', quantity: 1, wastePercent: 10 },
        { name: 'Huile d\'olive extra vierge', quantity: 0.030, wastePercent: 0 },
        { name: 'Sauce soja', quantity: 0.020, wastePercent: 0 },
        { name: 'Huile de sésame', quantity: 0.010, wastePercent: 0 },
        { name: 'Sel fin', quantity: 0.003, wastePercent: 0 },
      ],
    },
    {
      name: 'Bruschetta tomates-mozzarella',
      category: 'Entrée',
      sellingPrice: 11.00,
      nbPortions: 4,
      description: 'Bruschetta au pain grillé, tomates fraîches, mozzarella et basilic',
      prepTimeMinutes: 15,
      cookTimeMinutes: 5,
      laborCostPerHour: 15,
      ingredients: [
        { name: 'Pain de mie', quantity: 1, wastePercent: 0 },
        { name: 'Tomate', quantity: 0.400, wastePercent: 10 },
        { name: 'Mozzarella', quantity: 0.250, wastePercent: 0 },
        { name: 'Basilic frais', quantity: 1, wastePercent: 15 },
        { name: 'Huile d\'olive extra vierge', quantity: 0.040, wastePercent: 0 },
        { name: 'Vinaigre balsamique', quantity: 0.020, wastePercent: 0 },
        { name: 'Ail', quantity: 0.005, wastePercent: 10 },
        { name: 'Sel fin', quantity: 0.003, wastePercent: 0 },
      ],
    },

    // --- PLATS ---
    {
      name: 'Magret de canard, sauce au miel',
      category: 'Plat',
      sellingPrice: 26.00,
      nbPortions: 4,
      description: 'Magret de canard rôti, sauce miel et vinaigre balsamique, pommes de terre sautées',
      prepTimeMinutes: 15,
      cookTimeMinutes: 25,
      laborCostPerHour: 15,
      ingredients: [
        { name: 'Magret de canard', quantity: 0.800, wastePercent: 5 },
        { name: 'Miel', quantity: 0.060, wastePercent: 0 },
        { name: 'Vinaigre balsamique', quantity: 0.040, wastePercent: 0 },
        { name: 'Pomme de terre', quantity: 0.800, wastePercent: 15 },
        { name: 'Beurre doux', quantity: 0.040, wastePercent: 0 },
        { name: 'Thym frais', quantity: 0.5, wastePercent: 10 },
        { name: 'Fleur de sel', quantity: 0.005, wastePercent: 0 },
        { name: 'Poivre noir moulu', quantity: 0.003, wastePercent: 0 },
      ],
    },
    {
      name: 'Risotto aux cèpes',
      category: 'Plat',
      sellingPrice: 22.00,
      nbPortions: 4,
      description: 'Risotto crémeux aux cèpes et parmesan, finition au beurre',
      prepTimeMinutes: 10,
      cookTimeMinutes: 25,
      laborCostPerHour: 15,
      ingredients: [
        { name: 'Riz arborio (risotto)', quantity: 0.350, wastePercent: 0 },
        { name: 'Cèpes', quantity: 0.200, wastePercent: 5 },
        { name: 'Champignons de Paris', quantity: 0.200, wastePercent: 10 },
        { name: 'Oignon jaune', quantity: 0.100, wastePercent: 10 },
        { name: 'Vin blanc (cuisine)', quantity: 0.150, wastePercent: 0 },
        { name: 'Bouillon de volaille', quantity: 0.800, wastePercent: 0 },
        { name: 'Parmesan AOP', quantity: 0.080, wastePercent: 0 },
        { name: 'Beurre doux', quantity: 0.050, wastePercent: 0 },
        { name: 'Huile d\'olive extra vierge', quantity: 0.030, wastePercent: 0 },
        { name: 'Persil frais', quantity: 0.5, wastePercent: 20 },
      ],
    },
    {
      name: 'Pavé de saumon grillé',
      category: 'Plat',
      sellingPrice: 24.00,
      nbPortions: 4,
      description: 'Pavé de saumon grillé, purée de brocoli et sauce au citron',
      prepTimeMinutes: 15,
      cookTimeMinutes: 15,
      laborCostPerHour: 15,
      ingredients: [
        { name: 'Saumon frais (filet)', quantity: 0.700, wastePercent: 10 },
        { name: 'Brocoli', quantity: 0.500, wastePercent: 20 },
        { name: 'Citron', quantity: 0.100, wastePercent: 30 },
        { name: 'Crème liquide 35%', quantity: 0.100, wastePercent: 0 },
        { name: 'Beurre doux', quantity: 0.040, wastePercent: 0 },
        { name: 'Huile d\'olive extra vierge', quantity: 0.030, wastePercent: 0 },
        { name: 'Sel fin', quantity: 0.005, wastePercent: 0 },
        { name: 'Poivre noir moulu', quantity: 0.003, wastePercent: 0 },
      ],
    },
    {
      name: 'Confit de canard, pommes sarladaises',
      category: 'Plat',
      sellingPrice: 22.00,
      nbPortions: 4,
      description: 'Cuisse de canard confite traditionnelle avec pommes sarladaises à l\'ail et persil',
      prepTimeMinutes: 10,
      cookTimeMinutes: 40,
      laborCostPerHour: 15,
      ingredients: [
        { name: 'Cuisse de canard confite', quantity: 4, wastePercent: 0 },
        { name: 'Pomme de terre', quantity: 1.000, wastePercent: 15 },
        { name: 'Ail', quantity: 0.020, wastePercent: 10 },
        { name: 'Persil frais', quantity: 1, wastePercent: 20 },
        { name: 'Sel fin', quantity: 0.005, wastePercent: 0 },
        { name: 'Poivre noir moulu', quantity: 0.003, wastePercent: 0 },
      ],
    },
    {
      name: 'Filet de bar, beurre blanc',
      category: 'Plat',
      sellingPrice: 28.00,
      nbPortions: 4,
      description: 'Filet de bar poêlé, beurre blanc au vin blanc, légumes de saison',
      prepTimeMinutes: 15,
      cookTimeMinutes: 15,
      laborCostPerHour: 15,
      ingredients: [
        { name: 'Bar (filet)', quantity: 0.700, wastePercent: 10 },
        { name: 'Beurre doux', quantity: 0.120, wastePercent: 0 },
        { name: 'Échalote', quantity: 0.060, wastePercent: 10 },
        { name: 'Vin blanc (cuisine)', quantity: 0.200, wastePercent: 0 },
        { name: 'Crème liquide 35%', quantity: 0.050, wastePercent: 0 },
        { name: 'Haricots verts', quantity: 0.400, wastePercent: 10 },
        { name: 'Citron', quantity: 0.050, wastePercent: 30 },
        { name: 'Sel fin', quantity: 0.005, wastePercent: 0 },
        { name: 'Poivre noir moulu', quantity: 0.002, wastePercent: 0 },
      ],
    },
    {
      name: 'Entrecôte grillée, sauce au poivre',
      category: 'Plat',
      sellingPrice: 30.00,
      nbPortions: 4,
      description: 'Entrecôte de boeuf grillée, sauce au poivre vert, frites maison',
      prepTimeMinutes: 15,
      cookTimeMinutes: 20,
      laborCostPerHour: 15,
      ingredients: [
        { name: 'Entrecôte de boeuf', quantity: 1.000, wastePercent: 5 },
        { name: 'Pomme de terre', quantity: 1.000, wastePercent: 15 },
        { name: 'Crème liquide 35%', quantity: 0.150, wastePercent: 0 },
        { name: 'Cognac', quantity: 0.040, wastePercent: 0 },
        { name: 'Fond de veau', quantity: 0.100, wastePercent: 0 },
        { name: 'Poivre noir moulu', quantity: 0.010, wastePercent: 0 },
        { name: 'Beurre doux', quantity: 0.030, wastePercent: 0 },
        { name: 'Huile de tournesol', quantity: 0.500, wastePercent: 0 },
        { name: 'Sel fin', quantity: 0.005, wastePercent: 0 },
      ],
    },
    {
      name: 'Poulet rôti aux herbes',
      category: 'Plat',
      sellingPrice: 18.00,
      nbPortions: 4,
      description: 'Suprême de poulet rôti aux herbes de Provence, légumes grillés',
      prepTimeMinutes: 15,
      cookTimeMinutes: 35,
      laborCostPerHour: 15,
      ingredients: [
        { name: 'Blanc de poulet', quantity: 0.800, wastePercent: 5 },
        { name: 'Herbes de Provence', quantity: 0.010, wastePercent: 0 },
        { name: 'Courgette', quantity: 0.300, wastePercent: 10 },
        { name: 'Poivron rouge', quantity: 0.200, wastePercent: 15 },
        { name: 'Aubergine', quantity: 0.200, wastePercent: 10 },
        { name: 'Huile d\'olive extra vierge', quantity: 0.050, wastePercent: 0 },
        { name: 'Ail', quantity: 0.010, wastePercent: 10 },
        { name: 'Thym frais', quantity: 0.5, wastePercent: 10 },
        { name: 'Sel fin', quantity: 0.005, wastePercent: 0 },
        { name: 'Poivre noir moulu', quantity: 0.003, wastePercent: 0 },
      ],
    },
    {
      name: 'Moules marinières frites',
      category: 'Plat',
      sellingPrice: 18.00,
      nbPortions: 4,
      description: 'Moules de bouchot marinières au vin blanc, frites maison',
      prepTimeMinutes: 15,
      cookTimeMinutes: 15,
      laborCostPerHour: 15,
      ingredients: [
        { name: 'Moules de bouchot', quantity: 2.000, wastePercent: 20 },
        { name: 'Pomme de terre', quantity: 1.000, wastePercent: 15 },
        { name: 'Vin blanc (cuisine)', quantity: 0.300, wastePercent: 0 },
        { name: 'Échalote', quantity: 0.080, wastePercent: 10 },
        { name: 'Ail', quantity: 0.010, wastePercent: 10 },
        { name: 'Persil frais', quantity: 1, wastePercent: 20 },
        { name: 'Crème liquide 35%', quantity: 0.100, wastePercent: 0 },
        { name: 'Beurre doux', quantity: 0.030, wastePercent: 0 },
        { name: 'Huile de tournesol', quantity: 0.500, wastePercent: 0 },
        { name: 'Sel fin', quantity: 0.005, wastePercent: 0 },
        { name: 'Poivre noir moulu', quantity: 0.003, wastePercent: 0 },
      ],
    },
    {
      name: 'Ratatouille provençale',
      category: 'Plat',
      sellingPrice: 15.00,
      nbPortions: 6,
      description: 'Ratatouille traditionnelle aux légumes du soleil, servie avec riz basmati',
      prepTimeMinutes: 20,
      cookTimeMinutes: 45,
      laborCostPerHour: 15,
      ingredients: [
        { name: 'Courgette', quantity: 0.400, wastePercent: 10 },
        { name: 'Aubergine', quantity: 0.400, wastePercent: 10 },
        { name: 'Poivron rouge', quantity: 0.200, wastePercent: 15 },
        { name: 'Poivron vert', quantity: 0.200, wastePercent: 15 },
        { name: 'Tomate', quantity: 0.500, wastePercent: 10 },
        { name: 'Oignon jaune', quantity: 0.200, wastePercent: 10 },
        { name: 'Ail', quantity: 0.015, wastePercent: 10 },
        { name: 'Huile d\'olive extra vierge', quantity: 0.060, wastePercent: 0 },
        { name: 'Herbes de Provence', quantity: 0.010, wastePercent: 0 },
        { name: 'Basilic frais', quantity: 1, wastePercent: 15 },
        { name: 'Riz basmati', quantity: 0.350, wastePercent: 0 },
        { name: 'Sel fin', quantity: 0.008, wastePercent: 0 },
      ],
    },
    {
      name: 'Carbonara authentique',
      category: 'Plat',
      sellingPrice: 16.00,
      nbPortions: 4,
      description: 'Spaghetti à la carbonara, guanciale, pecorino et parmesan, jaunes d\'oeufs',
      prepTimeMinutes: 10,
      cookTimeMinutes: 15,
      laborCostPerHour: 15,
      ingredients: [
        { name: 'Spaghetti', quantity: 0.400, wastePercent: 0 },
        { name: 'Lardons fumés', quantity: 0.200, wastePercent: 0 },
        { name: 'Parmesan AOP', quantity: 0.100, wastePercent: 0 },
        { name: 'Oeufs (calibre L)', quantity: 6, wastePercent: 0 },
        { name: 'Poivre noir moulu', quantity: 0.005, wastePercent: 0 },
        { name: 'Sel fin', quantity: 0.005, wastePercent: 0 },
      ],
    },

    // --- DESSERTS ---
    {
      name: 'Moelleux au chocolat',
      category: 'Dessert',
      sellingPrice: 12.00,
      nbPortions: 6,
      description: 'Moelleux au chocolat noir 70% au coeur coulant, crème anglaise',
      prepTimeMinutes: 20,
      cookTimeMinutes: 12,
      laborCostPerHour: 15,
      ingredients: [
        { name: 'Chocolat noir 70%', quantity: 0.200, wastePercent: 0 },
        { name: 'Beurre doux', quantity: 0.120, wastePercent: 0 },
        { name: 'Oeufs (calibre L)', quantity: 4, wastePercent: 0 },
        { name: 'Sucre en poudre', quantity: 0.080, wastePercent: 0 },
        { name: 'Farine T45', quantity: 0.040, wastePercent: 0 },
        { name: 'Crème liquide 35%', quantity: 0.200, wastePercent: 0 },
        { name: 'Lait entier', quantity: 0.200, wastePercent: 0 },
        { name: 'Vanille (gousse)', quantity: 1, wastePercent: 0 },
      ],
    },
    {
      name: 'Crème brûlée',
      category: 'Dessert',
      sellingPrice: 10.00,
      nbPortions: 6,
      description: 'Crème brûlée traditionnelle à la vanille de Madagascar',
      prepTimeMinutes: 15,
      cookTimeMinutes: 50,
      laborCostPerHour: 15,
      ingredients: [
        { name: 'Crème liquide 35%', quantity: 0.500, wastePercent: 0 },
        { name: 'Oeufs (calibre L)', quantity: 6, wastePercent: 0 },
        { name: 'Sucre en poudre', quantity: 0.120, wastePercent: 0 },
        { name: 'Vanille (gousse)', quantity: 2, wastePercent: 0 },
        { name: 'Cassonade', quantity: 0.060, wastePercent: 0 },
      ],
    },
    {
      name: 'Tarte Tatin',
      category: 'Dessert',
      sellingPrice: 11.00,
      nbPortions: 6,
      description: 'Tarte Tatin aux pommes caramélisées, pâte feuilletée, crème fraîche',
      prepTimeMinutes: 25,
      cookTimeMinutes: 35,
      laborCostPerHour: 15,
      ingredients: [
        { name: 'Pâte feuilletée', quantity: 1, wastePercent: 0 },
        { name: 'Pomme Golden', quantity: 1.200, wastePercent: 20 },
        { name: 'Sucre en poudre', quantity: 0.150, wastePercent: 0 },
        { name: 'Beurre doux', quantity: 0.080, wastePercent: 0 },
        { name: 'Crème fraîche épaisse 30%', quantity: 0.200, wastePercent: 0 },
        { name: 'Vanille (gousse)', quantity: 1, wastePercent: 0 },
      ],
    },
    {
      name: 'Tiramisu',
      category: 'Dessert',
      sellingPrice: 11.00,
      nbPortions: 6,
      description: 'Tiramisu italien traditionnel au mascarpone et café',
      prepTimeMinutes: 25,
      cookTimeMinutes: 0,
      laborCostPerHour: 15,
      ingredients: [
        { name: 'Mascarpone', quantity: 0.500, wastePercent: 0 },
        { name: 'Oeufs (calibre L)', quantity: 4, wastePercent: 0 },
        { name: 'Sucre en poudre', quantity: 0.100, wastePercent: 0 },
        { name: 'Cacao en poudre', quantity: 0.030, wastePercent: 0 },
        { name: 'Farine T45', quantity: 0.020, wastePercent: 0 },
      ],
    },

    // --- ACCOMPAGNEMENTS ---
    {
      name: 'Purée de pommes de terre',
      category: 'Accompagnement',
      sellingPrice: 6.00,
      nbPortions: 6,
      description: 'Purée de pommes de terre onctueuse au beurre et lait chaud',
      prepTimeMinutes: 10,
      cookTimeMinutes: 25,
      laborCostPerHour: 15,
      ingredients: [
        { name: 'Pomme de terre', quantity: 1.200, wastePercent: 15 },
        { name: 'Beurre doux', quantity: 0.100, wastePercent: 0 },
        { name: 'Lait entier', quantity: 0.200, wastePercent: 0 },
        { name: 'Noix de muscade', quantity: 0.002, wastePercent: 0 },
        { name: 'Sel fin', quantity: 0.008, wastePercent: 0 },
        { name: 'Poivre noir moulu', quantity: 0.002, wastePercent: 0 },
      ],
    },
    {
      name: 'Gratin dauphinois',
      category: 'Accompagnement',
      sellingPrice: 8.00,
      nbPortions: 6,
      description: 'Gratin dauphinois traditionnel à la crème et à l\'ail',
      prepTimeMinutes: 15,
      cookTimeMinutes: 50,
      laborCostPerHour: 15,
      ingredients: [
        { name: 'Pomme de terre', quantity: 1.500, wastePercent: 15 },
        { name: 'Crème liquide 35%', quantity: 0.400, wastePercent: 0 },
        { name: 'Lait entier', quantity: 0.300, wastePercent: 0 },
        { name: 'Ail', quantity: 0.015, wastePercent: 10 },
        { name: 'Fromage râpé (emmental)', quantity: 0.100, wastePercent: 0 },
        { name: 'Noix de muscade', quantity: 0.003, wastePercent: 0 },
        { name: 'Beurre doux', quantity: 0.030, wastePercent: 0 },
        { name: 'Sel fin', quantity: 0.008, wastePercent: 0 },
        { name: 'Poivre noir moulu', quantity: 0.003, wastePercent: 0 },
      ],
    },
  ];

  console.log(`🍽️ Création de ${recipesData.length} recettes...`);

  for (const recipe of recipesData) {
    const existing = await prisma.recipe.findFirst({ where: { name: recipe.name } });
    if (existing) {
      console.log(`  ⏩ "${recipe.name}" existe déjà, skip`);
      continue;
    }

    const ingredientLinks = recipe.ingredients
      .filter((ing) => createdIngredients[ing.name])
      .map((ing) => ({
        ingredientId: createdIngredients[ing.name],
        quantity: ing.quantity,
        wastePercent: ing.wastePercent,
      }));

    if (ingredientLinks.length === 0) {
      console.log(`  ⚠️ Pas d'ingrédients trouvés pour "${recipe.name}", skip`);
      continue;
    }

    await prisma.recipe.create({
      data: {
        name: recipe.name,
        category: recipe.category,
        sellingPrice: recipe.sellingPrice,
        nbPortions: recipe.nbPortions,
        description: recipe.description,
        prepTimeMinutes: recipe.prepTimeMinutes,
        cookTimeMinutes: recipe.cookTimeMinutes,
        laborCostPerHour: recipe.laborCostPerHour,
        ingredients: {
          create: ingredientLinks,
        },
      },
    });
    console.log(`  ✅ "${recipe.name}" créé (${ingredientLinks.length} ingrédients)`);
  }

  console.log('\n🎉 Seeding terminé !');
}

seed()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
