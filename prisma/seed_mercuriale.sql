-- ============================================================
-- Seed Mercuriale — Données initiales : 30 mars 2026
-- A exécuter après mercuriale_editorial.sql
-- ============================================================

-- Publication
INSERT INTO mercuriale_publications (title, week_date, sources, published)
VALUES (
  'Mercuriale Prix Fournisseurs — 30 mars 2026',
  '2026-03-30',
  'RNM/FranceAgriMer · Rungis · Metro · Transgourmet · PassionFroid · Agidra · Davigel',
  true
);

-- Récupérer l'ID de la publication
-- (on utilise currval car on vient d'insérer)

-- ===================== PRIX =====================

-- Viandes
INSERT INTO mercuriale_prices (publication_id, category, ingredient_name, supplier, price_min, price_max, unit, trend, trend_detail) VALUES
((SELECT currval('mercuriale_publications_id_seq')), 'Viandes', 'Boeuf entrecôte', 'Metro / Transgourmet', 22.00, 25.00, 'kg', 'hausse', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Viandes', 'Boeuf filet', 'Metro / Transgourmet', 38.00, 44.00, 'kg', 'hausse', '+8 à +15%'),
((SELECT currval('mercuriale_publications_id_seq')), 'Viandes', 'Boeuf rôti épaule', 'Metro / Transgourmet', 14.00, 18.00, 'kg', 'stable', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Viandes', 'Poulet entier', 'Metro / Transgourmet', 3.50, 5.00, 'kg', 'stable', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Viandes', 'Filets de poulet', 'Metro / Transgourmet', 6.50, 8.50, 'kg', 'stable', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Viandes', 'Porc échine', 'Metro / Transgourmet', 5.00, 7.00, 'kg', 'stable', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Viandes', 'Porc filet', 'Metro / Transgourmet', 7.00, 9.00, 'kg', 'stable', NULL);

-- Poissons
INSERT INTO mercuriale_prices (publication_id, category, ingredient_name, supplier, price_min, price_max, unit, trend, trend_detail) VALUES
((SELECT currval('mercuriale_publications_id_seq')), 'Poissons', 'Saumon', 'Rungis / PassionFroid', 12.00, 16.00, 'kg', 'baisse', '-21%'),
((SELECT currval('mercuriale_publications_id_seq')), 'Poissons', 'Cabillaud', 'Rungis / PassionFroid', 14.00, 18.00, 'kg', 'stable', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Poissons', 'Dorade', 'Rungis / PassionFroid', 8.00, 12.00, 'kg', 'stable', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Poissons', 'Bar', 'Rungis / PassionFroid', 10.00, 14.00, 'kg', 'stable', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Poissons', 'Lieu jaune', 'Rungis / PassionFroid', 9.00, 12.00, 'kg', 'baisse', NULL);

-- Légumes
INSERT INTO mercuriale_prices (publication_id, category, ingredient_name, supplier, price_min, price_max, unit, trend, trend_detail) VALUES
((SELECT currval('mercuriale_publications_id_seq')), 'Légumes', 'Tomate', 'Rungis / Metro', 1.50, 2.50, 'kg', 'hausse', '+20-30%, hors saison'),
((SELECT currval('mercuriale_publications_id_seq')), 'Légumes', 'Carotte', 'Rungis / Metro', 0.60, 1.00, 'kg', 'stable', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Légumes', 'Pomme de terre', 'Rungis / Metro', 0.35, 0.60, 'kg', 'stable', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Légumes', 'Oignon', 'Rungis / Metro', 0.50, 0.80, 'kg', 'stable', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Légumes', 'Courgette', 'Rungis / Metro', 1.20, 2.00, 'kg', 'hausse', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Légumes', 'Salade', 'Rungis / Metro', 0.80, 1.20, 'kg', 'stable', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Légumes', 'Champignons', 'Rungis / Metro', 2.00, 3.00, 'kg', 'stable', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Légumes', 'Poivron', 'Rungis / Metro', 1.50, 2.50, 'kg', 'hausse', NULL);

-- Produits laitiers
INSERT INTO mercuriale_prices (publication_id, category, ingredient_name, supplier, price_min, price_max, unit, trend, trend_detail) VALUES
((SELECT currval('mercuriale_publications_id_seq')), 'Produits laitiers', 'Beurre', 'Metro / Transgourmet', 5.50, 6.00, 'kg', 'baisse', '-17%'),
((SELECT currval('mercuriale_publications_id_seq')), 'Produits laitiers', 'Crème fraîche', 'Metro / Transgourmet', 2.50, 3.50, 'kg', 'baisse', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Produits laitiers', 'Crème liquide', 'Metro / Transgourmet', 3.00, 4.00, 'kg', 'baisse', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Produits laitiers', 'Emmental', 'Metro / Transgourmet', 6.00, 8.00, 'kg', 'stable', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Produits laitiers', 'Gruyère', 'Metro / Transgourmet', 9.00, 12.00, 'kg', 'stable', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Produits laitiers', 'Oeufs', 'Metro / Transgourmet', 0.18, 0.25, 'unité', 'hausse', '+7%');

-- Épicerie
INSERT INTO mercuriale_prices (publication_id, category, ingredient_name, supplier, price_min, price_max, unit, trend, trend_detail) VALUES
((SELECT currval('mercuriale_publications_id_seq')), 'Épicerie', 'Farine', 'Metro / Transgourmet', 0.55, 0.65, 'kg', 'stable', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Épicerie', 'Sucre', 'Metro / Transgourmet', 0.80, 1.00, 'kg', 'stable', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Épicerie', 'Huile tournesol', 'Metro / Transgourmet', 1.50, 2.00, 'litre', 'stable', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Épicerie', 'Huile olive', 'Metro / Transgourmet', 5.00, 7.50, 'litre', 'hausse', '+10-20%'),
((SELECT currval('mercuriale_publications_id_seq')), 'Épicerie', 'Sel', 'Metro / Transgourmet', 0.30, 0.50, 'kg', 'stable', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Épicerie', 'Pâtes', 'Metro / Transgourmet', 0.90, 1.40, 'kg', 'stable', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'Épicerie', 'Riz', 'Metro / Transgourmet', 0.90, 1.20, 'kg', 'stable', NULL);

-- ===================== ALERTES =====================

-- Hausses (type = 'alert')
INSERT INTO mercuriale_alerts (publication_id, type, ingredient_name, variation, action_text, saving) VALUES
((SELECT currval('mercuriale_publications_id_seq')), 'alert', 'Boeuf filet', '+8 à +15%', 'Réduire portions ou plat du jour uniquement', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'alert', 'Huile olive', '+10 à +20%', 'Basculer huile tournesol pour cuissons (économie 60-70%)', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'alert', 'Tomate hors saison', '+20 à +30%', 'Attendre mi-mai (saison française)', NULL),
((SELECT currval('mercuriale_publications_id_seq')), 'alert', 'Oeufs', '+7%', 'Surveiller — tendance haussière', NULL);

-- Opportunités (type = 'opportunity')
INSERT INTO mercuriale_alerts (publication_id, type, ingredient_name, variation, action_text, saving) VALUES
((SELECT currval('mercuriale_publications_id_seq')), 'opportunity', 'Saumon', '-21%', 'Mettre à la carte, commander en volume', 'Significative'),
((SELECT currval('mercuriale_publications_id_seq')), 'opportunity', 'Beurre', '-17%', 'Renégocier contrats annuels', 'Significative'),
((SELECT currval('mercuriale_publications_id_seq')), 'opportunity', 'Crème fraîche', '-5 à -17%', 'Négocier les volumes', 'Modérée');

-- ===================== ALTERNATIVES =====================

INSERT INTO mercuriale_alternatives (publication_id, product, alternative, saving_per_kg) VALUES
((SELECT currval('mercuriale_publications_id_seq')), 'Boeuf entrecôte', 'Porc filet', '~15€/kg'),
((SELECT currval('mercuriale_publications_id_seq')), 'Boeuf filet', 'Boeuf épaule braisée', '~25€/kg'),
((SELECT currval('mercuriale_publications_id_seq')), 'Cabillaud', 'Lieu jaune', '~5€/kg'),
((SELECT currval('mercuriale_publications_id_seq')), 'Huile olive', 'Huile colza', '-60-70%'),
((SELECT currval('mercuriale_publications_id_seq')), 'Gruyère AOP', 'Emmental râpé', '~3€/kg');
