-- ============================================================
-- Mercuriale Editoriale — Tables pour les prix marché publiés
-- par l'admin RestauMargin (RNM, Rungis, Metro, etc.)
-- A exécuter manuellement sur Supabase
-- ============================================================

-- Table des publications mercuriale hebdomadaires
CREATE TABLE IF NOT EXISTS mercuriale_publications (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  week_date DATE NOT NULL,
  sources TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des prix par ingrédient dans chaque publication
CREATE TABLE IF NOT EXISTS mercuriale_prices (
  id SERIAL PRIMARY KEY,
  publication_id INTEGER REFERENCES mercuriale_publications(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  ingredient_name TEXT NOT NULL,
  supplier TEXT,
  price_min DECIMAL(10,2),
  price_max DECIMAL(10,2),
  unit TEXT DEFAULT 'kg',
  trend TEXT,
  trend_detail TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table des alertes mercuriale
CREATE TABLE IF NOT EXISTS mercuriale_alerts (
  id SERIAL PRIMARY KEY,
  publication_id INTEGER REFERENCES mercuriale_publications(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  ingredient_name TEXT NOT NULL,
  variation TEXT,
  action_text TEXT,
  saving TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table des alternatives
CREATE TABLE IF NOT EXISTS mercuriale_alternatives (
  id SERIAL PRIMARY KEY,
  publication_id INTEGER REFERENCES mercuriale_publications(id) ON DELETE CASCADE,
  product TEXT NOT NULL,
  alternative TEXT NOT NULL,
  saving_per_kg TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_mercuriale_prices_pub ON mercuriale_prices(publication_id);
CREATE INDEX IF NOT EXISTS idx_mercuriale_alerts_pub ON mercuriale_alerts(publication_id);
CREATE INDEX IF NOT EXISTS idx_mercuriale_alternatives_pub ON mercuriale_alternatives(publication_id);
CREATE INDEX IF NOT EXISTS idx_mercuriale_publications_date ON mercuriale_publications(week_date DESC);
