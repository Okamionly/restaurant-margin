// =============================================================================
// Catalogue de produits alimentaires pro — Prix de référence wholesale France
// Sources: prix moyens Rungis, Metro, Transgourmet, Pomona (2024-2026)
// =============================================================================

export interface CatalogProduct {
  name: string;
  category: string;
  unit: string;
  prixMin: number;
  prixMoy: number;
  prixMax: number;
  fournisseurs: string[];
  conditionnement?: string;
}

export const PRODUCT_CATALOG: CatalogProduct[] = [
  // ===================== VIANDES — BOEUF =====================
  { name: "Entrecôte de boeuf", category: "Viandes", unit: "kg", prixMin: 18, prixMoy: 22, prixMax: 28, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Faux-filet de boeuf", category: "Viandes", unit: "kg", prixMin: 16, prixMoy: 20, prixMax: 26, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Filet de boeuf", category: "Viandes", unit: "kg", prixMin: 35, prixMoy: 42, prixMax: 55, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Bavette de boeuf", category: "Viandes", unit: "kg", prixMin: 12, prixMoy: 15, prixMax: 19, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Onglet de boeuf", category: "Viandes", unit: "kg", prixMin: 14, prixMoy: 18, prixMax: 22, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Rumsteck de boeuf", category: "Viandes", unit: "kg", prixMin: 13, prixMoy: 16, prixMax: 20, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Paleron de boeuf", category: "Viandes", unit: "kg", prixMin: 9, prixMoy: 12, prixMax: 15, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Joue de boeuf", category: "Viandes", unit: "kg", prixMin: 10, prixMoy: 13, prixMax: 16, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Queue de boeuf", category: "Viandes", unit: "kg", prixMin: 8, prixMoy: 11, prixMax: 14, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Bourguignon (viande)", category: "Viandes", unit: "kg", prixMin: 10, prixMoy: 13, prixMax: 16, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Côte de boeuf", category: "Viandes", unit: "kg", prixMin: 20, prixMoy: 25, prixMax: 32, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Steak haché pur boeuf", category: "Viandes", unit: "kg", prixMin: 8, prixMoy: 11, prixMax: 14, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Carpaccio de boeuf", category: "Viandes", unit: "kg", prixMin: 18, prixMoy: 22, prixMax: 28, fournisseurs: ["Metro"] },
  { name: "Tartare de boeuf", category: "Viandes", unit: "kg", prixMin: 16, prixMoy: 20, prixMax: 25, fournisseurs: ["Metro"] },
  { name: "Os à moelle", category: "Viandes", unit: "kg", prixMin: 3, prixMoy: 5, prixMax: 7, fournisseurs: ["Metro", "Transgourmet"] },

  // ===================== VIANDES — VEAU =====================
  { name: "Escalope de veau", category: "Viandes", unit: "kg", prixMin: 22, prixMoy: 28, prixMax: 35, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Rôti de veau", category: "Viandes", unit: "kg", prixMin: 18, prixMoy: 23, prixMax: 28, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Blanquette de veau (morceaux)", category: "Viandes", unit: "kg", prixMin: 12, prixMoy: 15, prixMax: 19, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Ris de veau", category: "Viandes", unit: "kg", prixMin: 30, prixMoy: 40, prixMax: 55, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Foie de veau", category: "Viandes", unit: "kg", prixMin: 15, prixMoy: 20, prixMax: 26, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Jarret de veau", category: "Viandes", unit: "kg", prixMin: 10, prixMoy: 14, prixMax: 18, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Osso buco", category: "Viandes", unit: "kg", prixMin: 12, prixMoy: 15, prixMax: 19, fournisseurs: ["Metro"] },

  // ===================== VIANDES — AGNEAU =====================
  { name: "Carré d'agneau", category: "Viandes", unit: "kg", prixMin: 18, prixMoy: 24, prixMax: 30, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Gigot d'agneau", category: "Viandes", unit: "kg", prixMin: 14, prixMoy: 18, prixMax: 23, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Épaule d'agneau", category: "Viandes", unit: "kg", prixMin: 10, prixMoy: 14, prixMax: 18, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Souris d'agneau", category: "Viandes", unit: "kg", prixMin: 12, prixMoy: 16, prixMax: 20, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Côtelettes d'agneau", category: "Viandes", unit: "kg", prixMin: 16, prixMoy: 22, prixMax: 28, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Merguez", category: "Viandes", unit: "kg", prixMin: 6, prixMoy: 9, prixMax: 12, fournisseurs: ["Metro", "Transgourmet"] },

  // ===================== VIANDES — PORC =====================
  { name: "Filet mignon de porc", category: "Viandes", unit: "kg", prixMin: 8, prixMoy: 11, prixMax: 14, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Côte de porc", category: "Viandes", unit: "kg", prixMin: 5, prixMoy: 7, prixMax: 10, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Travers de porc", category: "Viandes", unit: "kg", prixMin: 5, prixMoy: 8, prixMax: 11, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Épaule de porc", category: "Viandes", unit: "kg", prixMin: 4, prixMoy: 6, prixMax: 9, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Poitrine de porc", category: "Viandes", unit: "kg", prixMin: 5, prixMoy: 7, prixMax: 10, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Lardons fumés", category: "Viandes", unit: "kg", prixMin: 5, prixMoy: 8, prixMax: 11, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Lardons nature", category: "Viandes", unit: "kg", prixMin: 5, prixMoy: 7, prixMax: 10, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Jambon blanc", category: "Viandes", unit: "kg", prixMin: 6, prixMoy: 9, prixMax: 13, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Jambon cru", category: "Viandes", unit: "kg", prixMin: 12, prixMoy: 18, prixMax: 25, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Saucisse de Toulouse", category: "Viandes", unit: "kg", prixMin: 6, prixMoy: 9, prixMax: 12, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Chipolatas", category: "Viandes", unit: "kg", prixMin: 5, prixMoy: 8, prixMax: 11, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Boudin noir", category: "Viandes", unit: "kg", prixMin: 5, prixMoy: 8, prixMax: 11, fournisseurs: ["Metro"] },
  { name: "Andouillette", category: "Viandes", unit: "kg", prixMin: 7, prixMoy: 10, prixMax: 14, fournisseurs: ["Metro"] },

  // ===================== VIANDES — VOLAILLE =====================
  { name: "Blanc de poulet", category: "Viandes", unit: "kg", prixMin: 6, prixMoy: 9, prixMax: 13, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Cuisse de poulet", category: "Viandes", unit: "kg", prixMin: 3, prixMoy: 5, prixMax: 7, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Poulet entier", category: "Viandes", unit: "kg", prixMin: 4, prixMoy: 6, prixMax: 9, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Poulet fermier Label Rouge", category: "Viandes", unit: "kg", prixMin: 7, prixMoy: 10, prixMax: 14, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Magret de canard", category: "Viandes", unit: "kg", prixMin: 14, prixMoy: 18, prixMax: 24, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Confit de canard", category: "Viandes", unit: "kg", prixMin: 12, prixMoy: 16, prixMax: 22, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Foie gras de canard cru", category: "Viandes", unit: "kg", prixMin: 35, prixMoy: 45, prixMax: 60, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Cuisses de canard", category: "Viandes", unit: "kg", prixMin: 6, prixMoy: 9, prixMax: 12, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Dinde (escalope)", category: "Viandes", unit: "kg", prixMin: 6, prixMoy: 9, prixMax: 12, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Pintade", category: "Viandes", unit: "kg", prixMin: 8, prixMoy: 12, prixMax: 16, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Caille", category: "Viandes", unit: "pièce", prixMin: 2.5, prixMoy: 3.5, prixMax: 5, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Pigeon", category: "Viandes", unit: "pièce", prixMin: 5, prixMoy: 8, prixMax: 12, fournisseurs: ["Metro"] },
  { name: "Lapin entier", category: "Viandes", unit: "kg", prixMin: 7, prixMoy: 10, prixMax: 14, fournisseurs: ["Metro", "Transgourmet"] },

  // ===================== POISSONS & FRUITS DE MER =====================
  { name: "Saumon frais (filet)", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 14, prixMoy: 19, prixMax: 26, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Saumon fumé", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 22, prixMoy: 30, prixMax: 45, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Cabillaud (filet)", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 14, prixMoy: 18, prixMax: 24, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Bar (filet)", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 18, prixMoy: 25, prixMax: 35, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Dorade (filet)", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 16, prixMoy: 22, prixMax: 30, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Sole (entière)", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 20, prixMoy: 28, prixMax: 40, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Thon rouge (filet)", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 30, prixMoy: 42, prixMax: 60, fournisseurs: ["Metro"] },
  { name: "Thon albacore", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 16, prixMoy: 22, prixMax: 30, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Truite (filet)", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 10, prixMoy: 14, prixMax: 18, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Lieu noir (filet)", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 8, prixMoy: 12, prixMax: 16, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Merlu (filet)", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 10, prixMoy: 14, prixMax: 18, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Sardines fraîches", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 4, prixMoy: 7, prixMax: 10, fournisseurs: ["Metro"] },
  { name: "Maquereau", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 4, prixMoy: 6, prixMax: 9, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Anchois frais", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 6, prixMoy: 9, prixMax: 14, fournisseurs: ["Metro"] },
  { name: "Crevettes roses cuites", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 10, prixMoy: 15, prixMax: 22, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Crevettes crues (gambas)", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 12, prixMoy: 18, prixMax: 28, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Langoustines", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 20, prixMoy: 30, prixMax: 45, fournisseurs: ["Metro"] },
  { name: "Homard", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 25, prixMoy: 35, prixMax: 50, fournisseurs: ["Metro"] },
  { name: "Moules de bouchot", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 3, prixMoy: 5, prixMax: 8, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Huîtres n°3", category: "Poissons & Fruits de mer", unit: "douzaine", prixMin: 6, prixMoy: 9, prixMax: 14, fournisseurs: ["Metro"] },
  { name: "Saint-Jacques (noix)", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 25, prixMoy: 35, prixMax: 50, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Poulpe", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 8, prixMoy: 12, prixMax: 18, fournisseurs: ["Metro"] },
  { name: "Calamars", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 6, prixMoy: 10, prixMax: 15, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Bulots", category: "Poissons & Fruits de mer", unit: "kg", prixMin: 6, prixMoy: 9, prixMax: 13, fournisseurs: ["Metro"] },

  // ===================== LÉGUMES =====================
  { name: "Tomate grappe", category: "Légumes", unit: "kg", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Tomate cerise", category: "Légumes", unit: "kg", prixMin: 3, prixMoy: 5, prixMax: 8, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Tomate coeur de boeuf", category: "Légumes", unit: "kg", prixMin: 3, prixMoy: 5, prixMax: 7, fournisseurs: ["Metro", "Pomona"] },
  { name: "Pomme de terre", category: "Légumes", unit: "kg", prixMin: 0.6, prixMoy: 1, prixMax: 1.5, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Pomme de terre grenaille", category: "Légumes", unit: "kg", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro", "Pomona"] },
  { name: "Pomme de terre Ratte", category: "Légumes", unit: "kg", prixMin: 2.5, prixMoy: 4, prixMax: 6, fournisseurs: ["Metro", "Pomona"] },
  { name: "Oignon jaune", category: "Légumes", unit: "kg", prixMin: 0.6, prixMoy: 1, prixMax: 1.5, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Oignon rouge", category: "Légumes", unit: "kg", prixMin: 1, prixMoy: 1.5, prixMax: 2.5, fournisseurs: ["Metro", "Pomona"] },
  { name: "Échalote", category: "Légumes", unit: "kg", prixMin: 2, prixMoy: 3.5, prixMax: 5, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Ail", category: "Légumes", unit: "kg", prixMin: 4, prixMoy: 6, prixMax: 9, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Carotte", category: "Légumes", unit: "kg", prixMin: 0.6, prixMoy: 1, prixMax: 1.8, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Carotte fane", category: "Légumes", unit: "botte", prixMin: 1.5, prixMoy: 2.5, prixMax: 3.5, fournisseurs: ["Metro", "Pomona"] },
  { name: "Poireau", category: "Légumes", unit: "kg", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Céleri branche", category: "Légumes", unit: "kg", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro", "Pomona"] },
  { name: "Céleri rave", category: "Légumes", unit: "kg", prixMin: 1.5, prixMoy: 2.5, prixMax: 3.5, fournisseurs: ["Metro", "Pomona"] },
  { name: "Navet", category: "Légumes", unit: "kg", prixMin: 1, prixMoy: 1.8, prixMax: 3, fournisseurs: ["Metro", "Pomona"] },
  { name: "Courgette", category: "Légumes", unit: "kg", prixMin: 1, prixMoy: 2, prixMax: 3.5, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Aubergine", category: "Légumes", unit: "kg", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Poivron rouge", category: "Légumes", unit: "kg", prixMin: 2, prixMoy: 3.5, prixMax: 5, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Poivron vert", category: "Légumes", unit: "kg", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro", "Pomona"] },
  { name: "Poivron jaune", category: "Légumes", unit: "kg", prixMin: 2, prixMoy: 3.5, prixMax: 5, fournisseurs: ["Metro", "Pomona"] },
  { name: "Concombre", category: "Légumes", unit: "pièce", prixMin: 0.5, prixMoy: 0.8, prixMax: 1.2, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Salade laitue", category: "Légumes", unit: "pièce", prixMin: 0.5, prixMoy: 0.9, prixMax: 1.5, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Mesclun", category: "Légumes", unit: "kg", prixMin: 8, prixMoy: 12, prixMax: 18, fournisseurs: ["Metro", "Pomona"] },
  { name: "Roquette", category: "Légumes", unit: "kg", prixMin: 8, prixMoy: 12, prixMax: 16, fournisseurs: ["Metro", "Pomona"] },
  { name: "Mâche", category: "Légumes", unit: "kg", prixMin: 10, prixMoy: 14, prixMax: 20, fournisseurs: ["Metro", "Pomona"] },
  { name: "Épinards frais", category: "Légumes", unit: "kg", prixMin: 3, prixMoy: 5, prixMax: 8, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Haricots verts", category: "Légumes", unit: "kg", prixMin: 3, prixMoy: 5, prixMax: 8, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Petits pois frais", category: "Légumes", unit: "kg", prixMin: 4, prixMoy: 6, prixMax: 9, fournisseurs: ["Metro", "Pomona"] },
  { name: "Brocoli", category: "Légumes", unit: "kg", prixMin: 2, prixMoy: 3, prixMax: 5, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Chou-fleur", category: "Légumes", unit: "pièce", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Chou rouge", category: "Légumes", unit: "kg", prixMin: 1, prixMoy: 1.5, prixMax: 2.5, fournisseurs: ["Metro", "Pomona"] },
  { name: "Chou vert", category: "Légumes", unit: "kg", prixMin: 0.8, prixMoy: 1.2, prixMax: 2, fournisseurs: ["Metro", "Pomona"] },
  { name: "Fenouil", category: "Légumes", unit: "kg", prixMin: 2, prixMoy: 3, prixMax: 5, fournisseurs: ["Metro", "Pomona"] },
  { name: "Artichaut", category: "Légumes", unit: "pièce", prixMin: 1, prixMoy: 1.8, prixMax: 3, fournisseurs: ["Metro", "Pomona"] },
  { name: "Asperges vertes", category: "Légumes", unit: "botte", prixMin: 3, prixMoy: 5, prixMax: 8, fournisseurs: ["Metro", "Pomona"] },
  { name: "Asperges blanches", category: "Légumes", unit: "kg", prixMin: 8, prixMoy: 12, prixMax: 18, fournisseurs: ["Metro", "Pomona"] },
  { name: "Champignon de Paris", category: "Légumes", unit: "kg", prixMin: 2, prixMoy: 3.5, prixMax: 5, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Cèpes frais", category: "Légumes", unit: "kg", prixMin: 25, prixMoy: 40, prixMax: 60, fournisseurs: ["Metro"] },
  { name: "Girolles", category: "Légumes", unit: "kg", prixMin: 20, prixMoy: 30, prixMax: 45, fournisseurs: ["Metro"] },
  { name: "Pleurotes", category: "Légumes", unit: "kg", prixMin: 5, prixMoy: 8, prixMax: 12, fournisseurs: ["Metro", "Pomona"] },
  { name: "Shiitake", category: "Légumes", unit: "kg", prixMin: 8, prixMoy: 12, prixMax: 18, fournisseurs: ["Metro"] },
  { name: "Avocat", category: "Légumes", unit: "pièce", prixMin: 0.8, prixMoy: 1.2, prixMax: 2, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Betterave cuite", category: "Légumes", unit: "kg", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Radis", category: "Légumes", unit: "botte", prixMin: 0.5, prixMoy: 1, prixMax: 1.5, fournisseurs: ["Metro", "Pomona"] },
  { name: "Patate douce", category: "Légumes", unit: "kg", prixMin: 2, prixMoy: 3, prixMax: 5, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Panais", category: "Légumes", unit: "kg", prixMin: 2, prixMoy: 3.5, prixMax: 5, fournisseurs: ["Metro", "Pomona"] },
  { name: "Topinambour", category: "Légumes", unit: "kg", prixMin: 3, prixMoy: 5, prixMax: 8, fournisseurs: ["Metro", "Pomona"] },
  { name: "Maïs (épi)", category: "Légumes", unit: "pièce", prixMin: 0.5, prixMoy: 0.8, prixMax: 1.2, fournisseurs: ["Metro", "Pomona"] },
  { name: "Gingembre frais", category: "Légumes", unit: "kg", prixMin: 4, prixMoy: 6, prixMax: 9, fournisseurs: ["Metro", "Transgourmet"] },

  // ===================== FRUITS =====================
  { name: "Citron jaune", category: "Fruits", unit: "kg", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Citron vert (lime)", category: "Fruits", unit: "kg", prixMin: 3, prixMoy: 5, prixMax: 7, fournisseurs: ["Metro", "Pomona"] },
  { name: "Orange", category: "Fruits", unit: "kg", prixMin: 1, prixMoy: 1.8, prixMax: 3, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Orange (jus)", category: "Fruits", unit: "kg", prixMin: 0.8, prixMoy: 1.2, prixMax: 2, fournisseurs: ["Metro", "Pomona"] },
  { name: "Pomme Golden", category: "Fruits", unit: "kg", prixMin: 1, prixMoy: 1.8, prixMax: 3, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Pomme Granny Smith", category: "Fruits", unit: "kg", prixMin: 1, prixMoy: 1.8, prixMax: 3, fournisseurs: ["Metro", "Pomona"] },
  { name: "Poire Williams", category: "Fruits", unit: "kg", prixMin: 2, prixMoy: 3, prixMax: 5, fournisseurs: ["Metro", "Pomona"] },
  { name: "Banane", category: "Fruits", unit: "kg", prixMin: 1, prixMoy: 1.5, prixMax: 2.5, fournisseurs: ["Metro", "Transgourmet", "Pomona"] },
  { name: "Fraise (barquette)", category: "Fruits", unit: "kg", prixMin: 5, prixMoy: 8, prixMax: 14, fournisseurs: ["Metro", "Pomona"] },
  { name: "Framboise", category: "Fruits", unit: "kg", prixMin: 12, prixMoy: 18, prixMax: 28, fournisseurs: ["Metro", "Pomona"] },
  { name: "Myrtille", category: "Fruits", unit: "kg", prixMin: 10, prixMoy: 16, prixMax: 24, fournisseurs: ["Metro", "Pomona"] },
  { name: "Mangue", category: "Fruits", unit: "pièce", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro", "Pomona"] },
  { name: "Ananas", category: "Fruits", unit: "pièce", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro", "Pomona"] },
  { name: "Melon", category: "Fruits", unit: "pièce", prixMin: 2, prixMoy: 3.5, prixMax: 6, fournisseurs: ["Metro", "Pomona"] },
  { name: "Pastèque", category: "Fruits", unit: "kg", prixMin: 0.8, prixMoy: 1.5, prixMax: 2.5, fournisseurs: ["Metro", "Pomona"] },
  { name: "Raisin", category: "Fruits", unit: "kg", prixMin: 2, prixMoy: 3.5, prixMax: 6, fournisseurs: ["Metro", "Pomona"] },
  { name: "Pêche", category: "Fruits", unit: "kg", prixMin: 2, prixMoy: 3.5, prixMax: 6, fournisseurs: ["Metro", "Pomona"] },
  { name: "Abricot", category: "Fruits", unit: "kg", prixMin: 3, prixMoy: 5, prixMax: 8, fournisseurs: ["Metro", "Pomona"] },
  { name: "Figue fraîche", category: "Fruits", unit: "kg", prixMin: 6, prixMoy: 10, prixMax: 16, fournisseurs: ["Metro", "Pomona"] },
  { name: "Fruit de la passion", category: "Fruits", unit: "kg", prixMin: 8, prixMoy: 14, prixMax: 22, fournisseurs: ["Metro"] },
  { name: "Noix de coco", category: "Fruits", unit: "pièce", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro"] },

  // ===================== PRODUITS LAITIERS =====================
  { name: "Beurre doux", category: "Produits laitiers", unit: "kg", prixMin: 5, prixMoy: 8, prixMax: 12, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Beurre demi-sel", category: "Produits laitiers", unit: "kg", prixMin: 5, prixMoy: 8, prixMax: 12, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Crème fraîche épaisse 30%", category: "Produits laitiers", unit: "L", prixMin: 2.5, prixMoy: 4, prixMax: 6, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Crème liquide 35%", category: "Produits laitiers", unit: "L", prixMin: 2.5, prixMoy: 4, prixMax: 5.5, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Lait entier", category: "Produits laitiers", unit: "L", prixMin: 0.7, prixMoy: 1, prixMax: 1.4, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Lait demi-écrémé", category: "Produits laitiers", unit: "L", prixMin: 0.6, prixMoy: 0.9, prixMax: 1.2, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Fromage râpé emmental", category: "Produits laitiers", unit: "kg", prixMin: 5, prixMoy: 8, prixMax: 12, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Gruyère IGP", category: "Produits laitiers", unit: "kg", prixMin: 10, prixMoy: 14, prixMax: 20, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Comté AOP", category: "Produits laitiers", unit: "kg", prixMin: 14, prixMoy: 18, prixMax: 25, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Parmesan Reggiano", category: "Produits laitiers", unit: "kg", prixMin: 16, prixMoy: 22, prixMax: 30, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Mozzarella (boule)", category: "Produits laitiers", unit: "kg", prixMin: 5, prixMoy: 8, prixMax: 12, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Mozzarella di Bufala", category: "Produits laitiers", unit: "kg", prixMin: 12, prixMoy: 16, prixMax: 22, fournisseurs: ["Metro"] },
  { name: "Burrata", category: "Produits laitiers", unit: "pièce", prixMin: 2, prixMoy: 3.5, prixMax: 5, fournisseurs: ["Metro"] },
  { name: "Chèvre frais (bûche)", category: "Produits laitiers", unit: "kg", prixMin: 6, prixMoy: 10, prixMax: 14, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Roquefort AOP", category: "Produits laitiers", unit: "kg", prixMin: 14, prixMoy: 18, prixMax: 24, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Camembert", category: "Produits laitiers", unit: "pièce", prixMin: 1.5, prixMoy: 3, prixMax: 5, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Brie de Meaux", category: "Produits laitiers", unit: "kg", prixMin: 8, prixMoy: 12, prixMax: 16, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Mascarpone", category: "Produits laitiers", unit: "kg", prixMin: 4, prixMoy: 6, prixMax: 9, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Ricotta", category: "Produits laitiers", unit: "kg", prixMin: 4, prixMoy: 6, prixMax: 9, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Crème de marrons", category: "Produits laitiers", unit: "kg", prixMin: 5, prixMoy: 8, prixMax: 12, fournisseurs: ["Metro"] },
  { name: "Yaourt nature", category: "Produits laitiers", unit: "kg", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Oeufs frais (calibre M)", category: "Produits laitiers", unit: "pièce", prixMin: 0.15, prixMoy: 0.22, prixMax: 0.35, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Oeufs plein air", category: "Produits laitiers", unit: "pièce", prixMin: 0.2, prixMoy: 0.3, prixMax: 0.45, fournisseurs: ["Metro", "Transgourmet"] },

  // ===================== ÉPICERIE SÈCHE =====================
  { name: "Huile d'olive extra vierge", category: "Épicerie", unit: "L", prixMin: 4, prixMoy: 7, prixMax: 12, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Huile de tournesol", category: "Épicerie", unit: "L", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Huile de colza", category: "Épicerie", unit: "L", prixMin: 2, prixMoy: 3, prixMax: 5, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Vinaigre balsamique", category: "Épicerie", unit: "L", prixMin: 4, prixMoy: 8, prixMax: 15, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Vinaigre de vin rouge", category: "Épicerie", unit: "L", prixMin: 1.5, prixMoy: 3, prixMax: 5, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Moutarde de Dijon", category: "Épicerie", unit: "kg", prixMin: 3, prixMoy: 5, prixMax: 8, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Sel fin", category: "Épicerie", unit: "kg", prixMin: 0.3, prixMoy: 0.5, prixMax: 1, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Sel de Guérande", category: "Épicerie", unit: "kg", prixMin: 2, prixMoy: 4, prixMax: 7, fournisseurs: ["Metro"] },
  { name: "Poivre noir (grains)", category: "Épicerie", unit: "kg", prixMin: 10, prixMoy: 16, prixMax: 25, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Farine de blé T55", category: "Épicerie", unit: "kg", prixMin: 0.5, prixMoy: 0.8, prixMax: 1.2, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Farine de blé T45", category: "Épicerie", unit: "kg", prixMin: 0.6, prixMoy: 0.9, prixMax: 1.4, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Sucre en poudre", category: "Épicerie", unit: "kg", prixMin: 0.7, prixMoy: 1, prixMax: 1.5, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Sucre glace", category: "Épicerie", unit: "kg", prixMin: 1, prixMoy: 1.5, prixMax: 2.5, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Cassonade", category: "Épicerie", unit: "kg", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Riz basmati", category: "Épicerie", unit: "kg", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Riz arborio (risotto)", category: "Épicerie", unit: "kg", prixMin: 2, prixMoy: 3.5, prixMax: 5, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Pâtes spaghetti", category: "Épicerie", unit: "kg", prixMin: 1, prixMoy: 1.8, prixMax: 3, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Pâtes penne", category: "Épicerie", unit: "kg", prixMin: 1, prixMoy: 1.8, prixMax: 3, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Pâtes tagliatelles fraîches", category: "Épicerie", unit: "kg", prixMin: 3, prixMoy: 5, prixMax: 8, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Couscous (semoule)", category: "Épicerie", unit: "kg", prixMin: 1, prixMoy: 1.5, prixMax: 2.5, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Lentilles vertes", category: "Épicerie", unit: "kg", prixMin: 2, prixMoy: 3.5, prixMax: 5, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Pois chiches secs", category: "Épicerie", unit: "kg", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Haricots blancs secs", category: "Épicerie", unit: "kg", prixMin: 2, prixMoy: 3, prixMax: 5, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Tomates concassées (conserve)", category: "Épicerie", unit: "kg", prixMin: 0.8, prixMoy: 1.2, prixMax: 2, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Concentré de tomate", category: "Épicerie", unit: "kg", prixMin: 2, prixMoy: 3.5, prixMax: 5, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Coulis de tomate", category: "Épicerie", unit: "L", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Olives noires", category: "Épicerie", unit: "kg", prixMin: 4, prixMoy: 6, prixMax: 10, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Câpres", category: "Épicerie", unit: "kg", prixMin: 8, prixMoy: 12, prixMax: 18, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Cornichons", category: "Épicerie", unit: "kg", prixMin: 3, prixMoy: 5, prixMax: 8, fournisseurs: ["Metro", "Transgourmet"] },

  // ===================== ÉPICES & CONDIMENTS =====================
  { name: "Cumin moulu", category: "Épices & Condiments", unit: "kg", prixMin: 8, prixMoy: 14, prixMax: 22, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Paprika doux", category: "Épices & Condiments", unit: "kg", prixMin: 6, prixMoy: 10, prixMax: 16, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Curry", category: "Épices & Condiments", unit: "kg", prixMin: 8, prixMoy: 14, prixMax: 22, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Safran", category: "Épices & Condiments", unit: "g", prixMin: 5, prixMoy: 8, prixMax: 15, fournisseurs: ["Metro"], conditionnement: "1g" },
  { name: "Cannelle moulue", category: "Épices & Condiments", unit: "kg", prixMin: 8, prixMoy: 14, prixMax: 22, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Muscade moulue", category: "Épices & Condiments", unit: "kg", prixMin: 15, prixMoy: 22, prixMax: 35, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Thym frais", category: "Épices & Condiments", unit: "botte", prixMin: 0.8, prixMoy: 1.5, prixMax: 2.5, fournisseurs: ["Metro", "Pomona"] },
  { name: "Romarin frais", category: "Épices & Condiments", unit: "botte", prixMin: 0.8, prixMoy: 1.5, prixMax: 2.5, fournisseurs: ["Metro", "Pomona"] },
  { name: "Basilic frais", category: "Épices & Condiments", unit: "botte", prixMin: 1, prixMoy: 1.8, prixMax: 3, fournisseurs: ["Metro", "Pomona"] },
  { name: "Persil plat", category: "Épices & Condiments", unit: "botte", prixMin: 0.5, prixMoy: 1, prixMax: 1.8, fournisseurs: ["Metro", "Pomona"] },
  { name: "Ciboulette", category: "Épices & Condiments", unit: "botte", prixMin: 0.8, prixMoy: 1.5, prixMax: 2.5, fournisseurs: ["Metro", "Pomona"] },
  { name: "Menthe fraîche", category: "Épices & Condiments", unit: "botte", prixMin: 0.8, prixMoy: 1.5, prixMax: 2.5, fournisseurs: ["Metro", "Pomona"] },
  { name: "Coriandre fraîche", category: "Épices & Condiments", unit: "botte", prixMin: 0.8, prixMoy: 1.5, prixMax: 2.5, fournisseurs: ["Metro", "Pomona"] },
  { name: "Laurier (feuilles)", category: "Épices & Condiments", unit: "kg", prixMin: 12, prixMoy: 18, prixMax: 28, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Sauce soja", category: "Épices & Condiments", unit: "L", prixMin: 2, prixMoy: 4, prixMax: 7, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Tabasco", category: "Épices & Condiments", unit: "L", prixMin: 15, prixMoy: 22, prixMax: 30, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Worcestershire sauce", category: "Épices & Condiments", unit: "L", prixMin: 5, prixMoy: 8, prixMax: 12, fournisseurs: ["Metro", "Transgourmet"] },

  // ===================== FRUITS SECS & NOIX =====================
  { name: "Amandes entières", category: "Fruits secs & Noix", unit: "kg", prixMin: 8, prixMoy: 12, prixMax: 18, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Amandes effilées", category: "Fruits secs & Noix", unit: "kg", prixMin: 10, prixMoy: 14, prixMax: 20, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Amandes en poudre", category: "Fruits secs & Noix", unit: "kg", prixMin: 8, prixMoy: 12, prixMax: 18, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Noix de cajou", category: "Fruits secs & Noix", unit: "kg", prixMin: 10, prixMoy: 14, prixMax: 20, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Noisettes", category: "Fruits secs & Noix", unit: "kg", prixMin: 10, prixMoy: 14, prixMax: 20, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Noix", category: "Fruits secs & Noix", unit: "kg", prixMin: 8, prixMoy: 12, prixMax: 18, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Pistaches", category: "Fruits secs & Noix", unit: "kg", prixMin: 14, prixMoy: 20, prixMax: 30, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Pignons de pin", category: "Fruits secs & Noix", unit: "kg", prixMin: 30, prixMoy: 45, prixMax: 65, fournisseurs: ["Metro"] },
  { name: "Raisins secs", category: "Fruits secs & Noix", unit: "kg", prixMin: 3, prixMoy: 5, prixMax: 8, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Abricots secs", category: "Fruits secs & Noix", unit: "kg", prixMin: 5, prixMoy: 8, prixMax: 12, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Pruneaux d'Agen", category: "Fruits secs & Noix", unit: "kg", prixMin: 5, prixMoy: 8, prixMax: 12, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Noix de coco râpée", category: "Fruits secs & Noix", unit: "kg", prixMin: 4, prixMoy: 6, prixMax: 10, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Graines de sésame", category: "Fruits secs & Noix", unit: "kg", prixMin: 4, prixMoy: 7, prixMax: 11, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Graines de lin", category: "Fruits secs & Noix", unit: "kg", prixMin: 3, prixMoy: 5, prixMax: 8, fournisseurs: ["Metro", "Transgourmet"] },

  // ===================== FONDS & BOUILLONS =====================
  { name: "Fond de veau", category: "Fonds & Bouillons", unit: "L", prixMin: 3, prixMoy: 5, prixMax: 8, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Fond de volaille", category: "Fonds & Bouillons", unit: "L", prixMin: 2.5, prixMoy: 4, prixMax: 7, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Fumet de poisson", category: "Fonds & Bouillons", unit: "L", prixMin: 3, prixMoy: 5, prixMax: 8, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Bouillon de légumes", category: "Fonds & Bouillons", unit: "L", prixMin: 1.5, prixMoy: 3, prixMax: 5, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Demi-glace", category: "Fonds & Bouillons", unit: "L", prixMin: 5, prixMoy: 8, prixMax: 14, fournisseurs: ["Metro", "Transgourmet"] },

  // ===================== CHOCOLAT & PÂTISSERIE =====================
  { name: "Chocolat noir 70% (couverture)", category: "Pâtisserie", unit: "kg", prixMin: 8, prixMoy: 14, prixMax: 22, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Chocolat au lait (couverture)", category: "Pâtisserie", unit: "kg", prixMin: 8, prixMoy: 12, prixMax: 18, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Chocolat blanc (couverture)", category: "Pâtisserie", unit: "kg", prixMin: 8, prixMoy: 12, prixMax: 18, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Cacao en poudre", category: "Pâtisserie", unit: "kg", prixMin: 6, prixMoy: 10, prixMax: 16, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Gélatine (feuilles)", category: "Pâtisserie", unit: "kg", prixMin: 20, prixMoy: 30, prixMax: 45, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Agar-agar", category: "Pâtisserie", unit: "kg", prixMin: 40, prixMoy: 60, prixMax: 90, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Levure chimique", category: "Pâtisserie", unit: "kg", prixMin: 3, prixMoy: 5, prixMax: 8, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Levure boulangère fraîche", category: "Pâtisserie", unit: "kg", prixMin: 3, prixMoy: 5, prixMax: 8, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Vanille (gousse)", category: "Pâtisserie", unit: "pièce", prixMin: 3, prixMoy: 5, prixMax: 9, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Extrait de vanille", category: "Pâtisserie", unit: "L", prixMin: 15, prixMoy: 25, prixMax: 40, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Pâte feuilletée", category: "Pâtisserie", unit: "kg", prixMin: 3, prixMoy: 5, prixMax: 8, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Pâte brisée", category: "Pâtisserie", unit: "kg", prixMin: 2.5, prixMoy: 4, prixMax: 6, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Pâte sablée", category: "Pâtisserie", unit: "kg", prixMin: 3, prixMoy: 5, prixMax: 8, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Miel", category: "Pâtisserie", unit: "kg", prixMin: 5, prixMoy: 9, prixMax: 15, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Confiture (abricot)", category: "Pâtisserie", unit: "kg", prixMin: 3, prixMoy: 5, prixMax: 8, fournisseurs: ["Metro", "Transgourmet"] },

  // ===================== BOISSONS =====================
  { name: "Vin rouge (côtes du Rhône)", category: "Boissons", unit: "L", prixMin: 3, prixMoy: 5, prixMax: 9, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Vin blanc sec (cuisine)", category: "Boissons", unit: "L", prixMin: 3, prixMoy: 5, prixMax: 8, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Vin rosé", category: "Boissons", unit: "L", prixMin: 3, prixMoy: 5, prixMax: 9, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Bière blonde", category: "Boissons", unit: "L", prixMin: 1.5, prixMoy: 3, prixMax: 5, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Cidre brut", category: "Boissons", unit: "L", prixMin: 2, prixMoy: 3.5, prixMax: 6, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Porto", category: "Boissons", unit: "L", prixMin: 6, prixMoy: 10, prixMax: 18, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Cognac (cuisine)", category: "Boissons", unit: "L", prixMin: 15, prixMoy: 25, prixMax: 40, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Grand Marnier", category: "Boissons", unit: "L", prixMin: 20, prixMoy: 28, prixMax: 38, fournisseurs: ["Metro"] },
  { name: "Eau minérale", category: "Boissons", unit: "L", prixMin: 0.2, prixMoy: 0.4, prixMax: 0.7, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Jus d'orange (pur jus)", category: "Boissons", unit: "L", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Coca-Cola (fontaine)", category: "Boissons", unit: "L", prixMin: 1, prixMoy: 2, prixMax: 3, fournisseurs: ["Metro", "Transgourmet"] },

  // ===================== BOULANGERIE =====================
  { name: "Baguette tradition", category: "Boulangerie", unit: "pièce", prixMin: 0.3, prixMoy: 0.5, prixMax: 0.8, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Pain de campagne", category: "Boulangerie", unit: "kg", prixMin: 2, prixMoy: 3.5, prixMax: 5, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Pain de mie", category: "Boulangerie", unit: "kg", prixMin: 2, prixMoy: 3, prixMax: 5, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Brioche", category: "Boulangerie", unit: "kg", prixMin: 4, prixMoy: 6, prixMax: 10, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Croissant (cru surgelé)", category: "Boulangerie", unit: "pièce", prixMin: 0.2, prixMoy: 0.35, prixMax: 0.5, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Pain burger", category: "Boulangerie", unit: "pièce", prixMin: 0.2, prixMoy: 0.35, prixMax: 0.5, fournisseurs: ["Metro", "Transgourmet"] },

  // ===================== SURGELÉS =====================
  { name: "Frites surgelées", category: "Surgelés", unit: "kg", prixMin: 1, prixMoy: 1.8, prixMax: 3, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Légumes surgelés (mix)", category: "Surgelés", unit: "kg", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Petits pois surgelés", category: "Surgelés", unit: "kg", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Épinards surgelés", category: "Surgelés", unit: "kg", prixMin: 1.5, prixMoy: 2.5, prixMax: 4, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Framboises surgelées", category: "Surgelés", unit: "kg", prixMin: 5, prixMoy: 8, prixMax: 12, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Fruits rouges surgelés (mix)", category: "Surgelés", unit: "kg", prixMin: 4, prixMoy: 7, prixMax: 11, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Pâte à pizza surgelée", category: "Surgelés", unit: "kg", prixMin: 2, prixMoy: 3.5, prixMax: 5, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Glace vanille (bac)", category: "Surgelés", unit: "L", prixMin: 3, prixMoy: 5, prixMax: 9, fournisseurs: ["Metro", "Transgourmet"] },
  { name: "Sorbet citron (bac)", category: "Surgelés", unit: "L", prixMin: 3, prixMoy: 5, prixMax: 9, fournisseurs: ["Metro", "Transgourmet"] },
];

// Helpers — PRODUCT_CATALOG has ~280 curated products with accurate prices
export const CATALOG_CATEGORIES = [...new Set(PRODUCT_CATALOG.map(p => p.category))].sort();

// Full Transgourmet catalog (6000+ products) — lazy loaded
let _fullCatalog: CatalogProduct[] | null = null;
let _loadingPromise: Promise<CatalogProduct[]> | null = null;

export async function loadFullCatalog(): Promise<CatalogProduct[]> {
  if (_fullCatalog) return _fullCatalog;
  if (_loadingPromise) return _loadingPromise;
  _loadingPromise = fetch('/catalog.json')
    .then(r => r.json())
    .then((data: CatalogProduct[]) => {
      _fullCatalog = data;
      return data;
    })
    .catch(() => {
      _fullCatalog = [];
      return [];
    });
  return _loadingPromise;
}

// Catalog is loaded on first search call — no eager preload

export function searchCatalog(query: string, limit = 15): CatalogProduct[] {
  // Trigger lazy load on first search (non-blocking)
  if (!_fullCatalog && !_loadingPromise) loadFullCatalog();

  const q = query.toLowerCase().trim();
  if (!q) return [];

  // Search curated catalog first (instant, accurate prices)
  const curated = PRODUCT_CATALOG
    .filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    .slice(0, Math.min(limit, 5));

  // Then search full Transgourmet catalog
  const full = (_fullCatalog || [])
    .filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    .filter(p => !curated.find(c => c.name.toLowerCase() === p.name.toLowerCase()))
    .slice(0, limit - curated.length);

  return [...curated, ...full];
}

export function getCatalogByCategory(category: string): CatalogProduct[] {
  const curated = PRODUCT_CATALOG.filter(p => p.category === category);
  const full = (_fullCatalog || []).filter(p =>
    p.category === category && !curated.find(c => c.name.toLowerCase() === p.name.toLowerCase())
  );
  return [...curated, ...full];
}

export function getCatalogSize(): { curated: number; full: number } {
  return { curated: PRODUCT_CATALOG.length, full: _fullCatalog?.length ?? 0 };
}
