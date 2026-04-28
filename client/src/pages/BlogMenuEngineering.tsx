import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Star, TrendingUp, Puzzle, AlertCircle, Layout, ArrowRight } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogMenuEngineering() {
  const faqSchema = buildFAQSchema([
    {
      question: "Combien de plats Stars devrais-je avoir sur ma carte ?",
      answer: "Idéalement 4 à 7 Stars sur une carte de 20-25 plats. Au-delà de 8, vos serveurs ne pourront pas tous les valoriser. En dessous de 3, vous manquez de différenciation."
    },
    {
      question: "Faut-il vraiment supprimer tous les Chiens ?",
      answer: "Non. Conservez 1 ou 2 plats signature à valeur émotionnelle (le plat de la grand-mère du chef) et les options nécessaires (végé, sans gluten). Mais supprimez tout le reste."
    },
    {
      question: "À quelle fréquence faire le menu engineering ?",
      answer: "Trimestriellement pour une analyse approfondie, mensuellement pour un suivi rapide. Si vous changez de fournisseur ou que vos coûts évoluent de plus de 5 %, refaites un calcul immédiatement."
    },
    {
      question: "Comment tester une augmentation de prix sans risque ?",
      answer: "Augmentez 1 ou 2 plats à la fois, de 0,50 à 1 €, et mesurez les ventes sur 4 semaines. Si la baisse de volume est inférieure à 10 %, l'augmentation est rentable."
    },
    {
      question: "Est-ce que ça fonctionne aussi pour les boissons ?",
      answer: "Oui, et c'est même très puissant. Les boissons (vins au verre, cocktails, softs) ont souvent les plus belles marges contribution (12-22 €/cocktail) et méritent leur propre matrice."
    }
  ]);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Accueil', url: 'https://www.restaumargin.fr' },
    { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
    { name: 'Menu engineering', url: 'https://www.restaumargin.fr/blog/menu-engineering-boston-matrix-restaurant' },
  ]);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Menu engineering : la méthode Boston Matrix pour optimiser votre carte"
        description="Classez vos plats en Stars, Vaches à lait, Puzzles et Chiens. La matrice Boston appliquée à la restauration pour maximiser vos marges."
        path="/blog/menu-engineering-boston-matrix-restaurant"
        type="article"
        schema={[faqSchema, breadcrumbSchema]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Menu engineering : la méthode Boston Matrix pour optimiser votre carte",
            "datePublished": "2026-04-27",
            "dateModified": "2026-04-27",
            "author": {
              "@type": "Organization",
              "name": "La rédaction RestauMargin",
              "url": "https://www.restaumargin.fr/a-propos"
            },
            "publisher": {
              "@type": "Organization",
              "name": "RestauMargin",
              "logo": { "@type": "ImageObject", "url": "https://www.restaumargin.fr/icon-512.png" }
            },
            "image": "https://www.restaumargin.fr/og-image.png",
            "inLanguage": "fr-FR",
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/menu-engineering-boston-matrix-restaurant"
          })
        }}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <Link to="/login" className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">
            Connexion
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <BlogArticleHero
        category="Carte & Prix"
        readTime="12 min"
        date="Avril 2026"
        title="Menu engineering : la méthode Boston Matrix"
        accentWord="Menu Engineering"
        subtitle="Sur une carte typique de 25 plats, seuls 4 à 6 génèrent 80 % de la marge brute. Voici comment identifier vos Stars et transformer votre carte en levier de rentabilité."
      />

      {/* Body */}
      <main className="max-w-[720px] mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          <strong>Sur une carte typique de 25 plats, seuls 4 à 6 plats génèrent 80 % de la marge brute totale.</strong> Le menu engineering, formalisé par Donald Smith et Michael Kasavana à l'Université du Michigan en 1982, est la science qui permet d'identifier ces dynamiques et de transformer chaque plat en levier de rentabilité.
        </p>

        {/* Sommaire */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#definition" className="hover:text-teal-600 transition-colors">1. Qu'est-ce que le menu engineering</a></li>
            <li><a href="#quadrants" className="hover:text-teal-600 transition-colors">2. Les 4 quadrants Boston Matrix</a></li>
            <li><a href="#methode" className="hover:text-teal-600 transition-colors">3. Méthode pas-à-pas pour classer ses plats</a></li>
            <li><a href="#exemple" className="hover:text-teal-600 transition-colors">4. Exemple chiffré : 20 plats analysés</a></li>
            <li><a href="#actions" className="hover:text-teal-600 transition-colors">5. Actions concrètes par quadrant</a></li>
            <li><a href="#design-carte" className="hover:text-teal-600 transition-colors">6. Design de la carte : où placer les Stars</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="definition" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-violet-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">1. Qu'est-ce que le menu engineering</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le menu engineering est l'analyse systématique de la rentabilité et de la popularité de chaque plat, dans le but de prendre des décisions éclairées sur : quels plats mettre en avant, lesquels reformuler, lesquels supprimer, quels prix ajuster.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Pourquoi c'est révolutionnaire :</strong> la plupart des restaurateurs raisonnent en food cost % (le coût matières en pourcentage du prix de vente). C'est trompeur.
          </p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100 space-y-1">
            <div>Plat A : 25 % food cost, vendu 12 € → marge 9 €</div>
            <div>Plat B : 35 % food cost, vendu 28 € → marge 18,20 €</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Le plat B est <strong>2× plus rentable</strong>, malgré un food cost % moins bon. Le menu engineering raisonne donc en marge contribution euros par plat × volume vendu.
          </p>
        </section>

        {/* Section 2 */}
        <section id="quadrants" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Layout className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">2. Les 4 quadrants Boston Matrix</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            La matrice BCG croise <strong>popularité (volume)</strong> et <strong>marge contribution (€)</strong> sur 4 quadrants.
          </p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100 space-y-1">
            <div>           Forte marge   |   Forte marge</div>
            <div>           Faible vol.   |   Forte vol.</div>
            <div>            PUZZLES      |    STARS</div>
            <div>           ───────────────┼───────────────</div>
            <div>            CHIENS       |  VACHES À LAIT</div>
            <div>           Faible marge  |   Faible marge</div>
            <div>           Faible vol.   |   Forte vol.</div>
          </div>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span><strong>STARS</strong> — Forte popularité + Forte marge. Vos plats champions. 15-25 % de la carte mais 40-50 % de la marge.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>VACHES À LAIT</strong> — Forte popularité + Faible marge. Les clients les attendent mais ils diluent la rentabilité.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <span><strong>PUZZLES</strong> — Faible popularité + Forte marge. Mauvais positionnement carte ou nom peu attractif.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>CHIENS</strong> — Faible popularité + Faible marge. À supprimer dans 90 % des cas.</span>
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section id="methode" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Puzzle className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">3. Méthode pas-à-pas</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Étape 1 — Récupérer les données sur 30 jours :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Quantité vendue (logiciel de caisse)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Prix de vente HT</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Coût matières HT (fiche technique)</li>
          </ul>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Étape 2 — Calculer la marge contribution :</strong></p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100 space-y-1">
            <div>Marge €/plat = PV HT - Coût matières HT</div>
            <div>Marge totale = Marge × Quantité vendue</div>
          </div>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Étape 3 — Calculer les seuils :</strong></p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100 space-y-1">
            <div>Seuil pop. = (Total ventes / Nb plats) × 0,7</div>
            <div>Seuil marge = Marge moyenne pondérée</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Le coefficient 0,7 corrige la sur-pondération des plats moyens. Chaque plat est ensuite classé selon son positionnement par rapport aux deux seuils.
          </p>
        </section>

        {/* Section 4 */}
        <section id="exemple" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">4. Exemple chiffré : 20 plats</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Restaurant "Le Comptoir" — 28 600 € de CA HT, 1 000 plats vendus sur 30 jours, 20 plats à la carte.
          </p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100 space-y-1">
            <div>Seuil popularité : (1000/20) × 0,7 = 35 ventes</div>
            <div>Marge contribution moyenne : 15,80 €</div>
          </div>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Synthèse de la matrice :</strong></p>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span><strong>STARS (4 plats)</strong> — Filet de bœuf, Risotto truffe, Magret, Saint-Jacques. Marge totale : 4 138 € (27 %)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>VACHES À LAIT (10 plats)</strong> — Tartare, Burger, César, Crème brûlée… Marge : 7 632 € (49 %)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <span><strong>PUZZLES (1 plat)</strong> — Côte de bœuf 1 kg. Marge : 1 120 € (7 %)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>CHIENS (5 plats)</strong> — Cabillaud, Risotto champignons, Soupe oignon… Marge : 1 455 € (9 %)</span>
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section id="actions" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">5. Actions concrètes par quadrant</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>STARS :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Mettre en gras ou avec encadré sur la carte</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Position en haut à droite (zone de regard naturel)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Recommandation systématique par les serveurs</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Surveillance étroite des coûts matières</li>
          </ul>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>VACHES À LAIT :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Reformulation discrète (parmesan → pecorino moins cher)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Test d'augmentation +0,50 € à +1 €</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Conservation : ne pas supprimer, base de la fréquentation</li>
          </ul>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>PUZZLES :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Renommer pour valoriser ("Black Angus 280g, jus à la moelle")</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Description riche : provenance, méthode</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Position centrale, suggestion serveurs</li>
          </ul>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>CHIENS :</strong></p>
          <p className="text-[#374151] leading-relaxed">
            Supprimer dans 90 % des cas. Conserver uniquement : plat signature historique, option végé/sans gluten, plat absorbant un produit en stock.
          </p>
        </section>

        {/* Section 6 */}
        <section id="design-carte" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Layout className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">6. Design de la carte : où placer les Stars</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Des études d'eye-tracking ont identifié les <strong>zones de focus</strong> sur une carte de restaurant.
          </p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100 space-y-1">
            <div>┌────────────────────────┐</div>
            <div>│ HOT ZONE  │ SWEET SPOT │</div>
            <div>│ haut G    │ haut D     │</div>
            <div>│           │ ★ Star n°1 │</div>
            <div>├───────────┼────────────┤</div>
            <div>│ Neutre    │ HOT ZONE   │</div>
            <div>│ centre    │            │</div>
            <div>├───────────┼────────────┤</div>
            <div>│ FROIDE    │ Neutre     │</div>
            <div>│ bas G     │ bas D      │</div>
            <div>└────────────────────────┘</div>
          </div>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Techniques de mise en valeur :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Encadré ou couleur différente (max 3-5 Stars)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Pas de symbole € ("22" au lieu de "22 €", +12 % ventes)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Pas d'alignement vertical des prix</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Format court (max 25 plats, sinon paralysie du choix)</li>
          </ul>
          <div className="border-l-4 border-red-400 bg-red-50 rounded-r-xl p-4">
            <p className="text-sm font-semibold text-red-700">À éviter</p>
            <p className="text-sm text-red-600">Soulignement de tous les prix · Plus de 30 plats · Photos pour tous les plats (effet fast-food) · Pas de rotation saisonnière.</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "Combien de plats Stars devrais-je avoir sur ma carte ?",
                a: "Idéalement 4 à 7 Stars sur une carte de 20-25 plats. Au-delà de 8, vos serveurs ne pourront pas tous les valoriser. En dessous de 3, vous manquez de différenciation."
              },
              {
                q: "Faut-il vraiment supprimer tous les Chiens ?",
                a: "Non. Conservez 1 ou 2 plats signature à valeur émotionnelle (le plat de la grand-mère du chef) et les options nécessaires (végé, sans gluten). Mais supprimez tout le reste."
              },
              {
                q: "À quelle fréquence faire le menu engineering ?",
                a: "Trimestriellement pour une analyse approfondie, mensuellement pour un suivi rapide. Si vous changez de fournisseur ou que vos coûts évoluent de plus de 5 %, refaites un calcul immédiatement."
              },
              {
                q: "Comment tester une augmentation de prix sans risque ?",
                a: "Augmentez 1 ou 2 plats à la fois, de 0,50 à 1 €, et mesurez les ventes sur 4 semaines. Si la baisse de volume est inférieure à 10 %, l'augmentation est rentable."
              },
              {
                q: "Est-ce que ça fonctionne aussi pour les boissons ?",
                a: "Oui, et c'est même très puissant. Les boissons (vins au verre, cocktails, softs) ont souvent les plus belles marges contribution (12-22 €/cocktail) et méritent leur propre matrice."
              }
            ].map(({ q, a }) => (
              <div key={q} className="border border-mono-900 rounded-xl p-5">
                <p className="font-semibold text-mono-100 mb-2">{q}</p>
                <p className="text-mono-400 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Identifiez vos Stars en un clic</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            RestauMargin calcule automatiquement la marge contribution par plat et génère votre matrice Boston en temps réel à partir de votre caisse + fiches techniques.
          </p>
          <a
            href="https://www.restaumargin.fr/pricing"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors text-sm"
          >
            Essayer gratuitement <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Nav bas */}
        <div className="mt-12 pt-8 border-t border-mono-900 flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">← Tous les articles</Link>
          <Link to="/outils/calculateur-food-cost" className="text-sm text-teal-600 hover:underline">Calculateur food cost gratuit →</Link>
        </div>
      </main>
    </div>
  );
}
