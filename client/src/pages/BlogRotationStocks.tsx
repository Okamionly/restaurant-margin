import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, RefreshCw, Calculator, BarChart3, TrendingUp, Settings, AlertTriangle, ArrowRight } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogRotationStocks() {
  const faqSchema = buildFAQSchema([
    {
      question: "Faut-il faire un inventaire chaque semaine ?",
      answer: "Inventaire complet : tous les 15 jours suffit pour la plupart des restaurants. Inventaire ciblé sur les produits chers (viandes, poissons, vins) chaque lundi pour ajuster les commandes. Au mensuel minimum pour calculer la rotation officielle."
    },
    {
      question: "Mon fournisseur impose une commande minimum de 300 €. Comment faire ?",
      answer: "Trois options : grouper avec un autre restaurant voisin (achat groupé), changer de fournisseur (Frigo Magic, Pourdebon Pro, La Ruche qui dit Oui Pro), ou accepter un sur-stock partiel sur les secs uniquement (jamais sur le frais)."
    },
    {
      question: "Comment gérer la rotation pendant les saisons creuses ?",
      answer: "Adaptez immédiatement vos commandes : -30 % à -50 % sur viandes/légumes/poissons. Diminuez aussi la variété (mini-carte saison creuse). Évitez le piège de garder le même stock sans visibilité sur le CA."
    },
    {
      question: "Quelle est la rotation idéale pour les vins ?",
      answer: "Vins courants : 1-2x/mois. Vins de cave / garde : 0,3-0,5x/mois, c'est normal et même souhaitable (les vins prennent de la valeur). Stockez en moyenne 1,5x les ventes mensuelles pour les vins courants."
    },
    {
      question: "Que faire des produits qui approchent de la DLC ?",
      answer: "Trois options : suggestion du jour (mettre en avant le plat qui les utilise), prix plat du jour réduit pour écouler, dons à des associations (Restos du Cœur, ANDES) déductible fiscalement à 60 %. Jamais de jet pur, c'est un échec de planification."
    }
  ]);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Rotation des stocks en restauration", url: "https://www.restaumargin.fr/blog/rotation-stocks-restaurant" }
  ]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Rotation des stocks en restauration : calcul, benchmarks et optimisation"
        description="Calculez votre rotation des stocks par catégorie. Benchmarks, leviers d'optimisation et impact sur la trésorerie de votre restaurant."
        path="/blog/rotation-stocks-restaurant"
        type="article"
        schema={[faqSchema, breadcrumbSchema]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Rotation des stocks en restauration : calcul, benchmarks et optimisation",
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
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/rotation-stocks-restaurant"
          })
        }}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-[#111111] font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <Link to="/login" className="text-sm font-medium text-[#525252] hover:text-teal-600 transition-colors">
            Connexion
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <BlogArticleHero
        category="Stocks"
        readTime="10 min"
        date="Avril 2026"
        title="Rotation des stocks en restauration : calcul, benchmarks et optimisation"
        accentWord="rotation"
        subtitle="15 000 € de stock immobilisé = 9 000 € coincés en cuisine au lieu d'être en banque. Formule, benchmarks par catégorie et 6 leviers concrets."
      />

      {/* Body */}
      <main className="max-w-[720px] mx-auto px-4 sm:px-6 pb-24">

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          Un restaurant qui immobilise <strong>15 000 € de stock</strong> au lieu de <strong>6 000 €</strong> a 9 000 € coincés en cuisine au lieu d'être en banque. À ce niveau, ce n'est plus une question de gestion : c'est de la trésorerie qui dort, des produits qui périment et de la marge qui s'évapore. La rotation des stocks est l'indicateur <strong>le plus négligé</strong> par les restaurateurs indépendants — et pourtant, c'est celui qui distingue un restaurant qui souffre d'un restaurant qui prospère.
        </p>

        {/* Sommaire */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#definition" className="hover:text-teal-600 transition-colors">1. Définition et formule</a></li>
            <li><a href="#cruciale" className="hover:text-teal-600 transition-colors">2. Pourquoi la rotation est cruciale</a></li>
            <li><a href="#calcul" className="hover:text-teal-600 transition-colors">3. Calcul détaillé avec exemple</a></li>
            <li><a href="#benchmarks" className="hover:text-teal-600 transition-colors">4. Benchmarks par catégorie de produits</a></li>
            <li><a href="#leviers" className="hover:text-teal-600 transition-colors">5. Les 6 leviers d'optimisation</a></li>
            <li><a href="#impact" className="hover:text-teal-600 transition-colors">6. Impact d'une mauvaise rotation</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="definition" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">1. Définition et formule</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            La rotation des stocks mesure le nombre de fois où votre stock est entièrement renouvelé sur une période donnée (généralement le mois).
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Rotation = Achats de la période / Stock moyen</div>
            <div>Jours de stock = (Stock moyen / Achats) × Nb jours</div>
            <div>Stock moyen = (Stock début + Stock fin) / 2</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Bonne pratique : faire un <strong>inventaire bi-mensuel</strong> (le 1er et le 15) pour affiner sur 4 points par mois. Cible générale en restauration : <strong>3-4x/mois</strong> ou <strong>8-10 jours de stock</strong>.
          </p>
        </section>

        {/* Section 2 */}
        <section id="cruciale" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">2. Pourquoi la rotation est cruciale</h2>
          </div>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Trésorerie immobilisée</strong> : chaque euro stocké est non disponible pour salaires, loyer, fournisseurs. Un stock excessif = 1-3 mois de trésorerie immobilisée.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Risque de perte produit</strong> : DLC dépassée, qualité dégradée, casse, vol. Mauvaise rotation = 3-7 % de pertes sur le stock.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Indicateur santé général</strong> : la rotation reflète achats bien dimensionnés, recettes standardisées, carte cohérente, FIFO respecté, anticipation correcte.</span>
            </li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Exemple : restaurant 600 000 € CA, food cost 30 % = 50 000 € achats/mois. Stock moyen 12 500 € → rotation 4x (excellent). Stock 25 000 € → rotation 2x (mauvais) et <strong>12 500 € inutilement immobilisés</strong>.
          </p>
        </section>

        {/* Section 3 */}
        <section id="calcul" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">3. Calcul détaillé avec exemple</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Restaurant bistronomique, avril 2026 :
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Stock 1er avril : 4 200 €</div>
            <div>Stock 30 avril : 4 800 €</div>
            <div>Achats du mois : 13 000 €</div>
            <div>---</div>
            <div>Stock moyen = (4 200 + 4 800) / 2 = 4 500 €</div>
            <div>Rotation = 13 000 / 4 500 = 2,89x/mois</div>
            <div>Jours stock = (4 500 / 13 000) × 30 = 10,4 j</div>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Aller plus loin : rotation par catégorie.</strong> L'analyse globale masque souvent des problèmes locaux.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Viandes : 4,0x — 7,5 j ✅</div>
            <div>Poissons : 5,1x — 5,9 j ✅</div>
            <div>Légumes : 3,5x — 8,6 j ✅</div>
            <div>Crémerie : 3,2x — 9,5 j ✅</div>
            <div>Épicerie sèche : 0,88x — 34,1 j ❌</div>
            <div>Vins : 0,89x — 33,8 j ⚠️</div>
            <div>TOTAL : 2,24x — 13,4 j</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            <strong>Lecture</strong> : excellente performance sur le frais (4-5x), mauvaise rotation sur l'épicerie (0,88x). Action : réduire les commandes de secs de 30-40 %.
          </p>
        </section>

        {/* Section 4 */}
        <section id="benchmarks" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">4. Benchmarks par catégorie de produits</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Rotations cibles observées dans les restaurants performants en France :
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Poissons frais : 12-15x — 1-2 jours</div>
            <div>Viandes fraîches : 7-10x — 3-4 jours</div>
            <div>Légumes fragiles : 8-12x — 2-4 jours</div>
            <div>Légumes de garde : 4-6x — 5-7 jours</div>
            <div>Crémerie : 4-6x — 5-7 jours</div>
            <div>Fromages affinés : 2-3x — 10-15 jours</div>
            <div>Pâtes / riz / secs : 1-1,5x — 20-30 jours</div>
            <div>Vins courants : 1-2x — 15-30 jours</div>
            <div>Vins de garde : 0,3-0,5x — 60-90 jours</div>
            <div>Spiritueux : 1-2x — 15-30 jours</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            <strong>Règle empirique</strong> : si vos jours de stock sont <strong>2x supérieurs</strong> au benchmark, vous avez un problème.
          </p>
        </section>

        {/* Section 5 */}
        <section id="leviers" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">5. Les 6 leviers d'optimisation</h2>
          </div>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
              <span><strong>Commandes en flux tendus</strong> : 3-4 petites commandes/semaine plutôt que 2 grosses. Stock /2 pour le même CA, produits frais, trésorerie libérée.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
              <span><strong>Standardiser les recettes</strong> : fiches techniques précises, boules portion, bacs gastronomes calibrés, pesage systématique des protéines.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
              <span><strong>Carte alignée avec les stocks</strong> : "suggestion du jour" qui utilise les fins de stock, mini-carte 6-8 plats max. Passer de 24 à 12 plats fait passer la rotation de 2,5x à 4,8x.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
              <span><strong>FIFO strict</strong> : étiquetage daté à la réception, rangement par date, code couleur par jour. Réduit les pertes de 3-5 %.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
              <span><strong>Réduire les références</strong> : 30 % des références ne servent qu'à 5 % du CA. Cible : 80-150 références actives, pas 150-300.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
              <span><strong>Fournisseurs fréquents vs stock important</strong> : flux tendus sur le frais (viandes/poissons/légumes), stock raisonnable sur les secs.</span>
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section id="impact" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">6. Impact d'une mauvaise rotation</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Deux restaurants identiques (CA 600 000 €, food cost 30 %, achats annuels 180 000 €) avec des rotations différentes :
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>RESTAURANT A — Rotation 2x/mois</div>
            <div>Stock moyen : 7 500 €</div>
            <div>Pertes annuelles (5 %) : 9 000 €</div>
            <div>Frais financiers (8 %) : 600 €</div>
            <div>Coût total : 9 600 €/an</div>
            <div>---</div>
            <div>RESTAURANT B — Rotation 4x/mois</div>
            <div>Stock moyen : 3 750 €</div>
            <div>Pertes annuelles (2 %) : 3 600 €</div>
            <div>Trésorerie libérée : +3 750 €</div>
            <div>Coût total : 3 600 €/an</div>
            <div>---</div>
            <div>DIFFÉRENCE : ~10 000 €/an</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Près de <strong>10 000 € de marge retrouvée par an</strong>, soit +1,7 point de marge nette. C'est l'équivalent de servir 30 couverts supplémentaires par mois — sans ouvrir une chaise de plus.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "Faut-il faire un inventaire chaque semaine ?",
                a: "Inventaire complet : tous les 15 jours suffit pour la plupart des restaurants. Inventaire ciblé sur les produits chers (viandes, poissons, vins) chaque lundi pour ajuster les commandes. Au mensuel minimum pour calculer la rotation officielle."
              },
              {
                q: "Mon fournisseur impose une commande minimum de 300 €. Comment faire ?",
                a: "Trois options : grouper avec un autre restaurant voisin (achat groupé), changer de fournisseur (Frigo Magic, Pourdebon Pro, La Ruche qui dit Oui Pro), ou accepter un sur-stock partiel sur les secs uniquement (jamais sur le frais)."
              },
              {
                q: "Comment gérer la rotation pendant les saisons creuses ?",
                a: "Adaptez immédiatement vos commandes : -30 % à -50 % sur viandes/légumes/poissons. Diminuez aussi la variété (mini-carte saison creuse). Évitez le piège de garder le même stock sans visibilité sur le CA."
              },
              {
                q: "Quelle est la rotation idéale pour les vins ?",
                a: "Vins courants : 1-2x/mois. Vins de cave / garde : 0,3-0,5x/mois, c'est normal et même souhaitable (les vins prennent de la valeur). Stockez en moyenne 1,5x les ventes mensuelles pour les vins courants."
              },
              {
                q: "Que faire des produits qui approchent de la DLC ?",
                a: "Trois options : suggestion du jour (mettre en avant le plat qui les utilise), prix plat du jour réduit pour écouler, dons à des associations (Restos du Cœur, ANDES) déductible fiscalement à 60 %. Jamais de jet pur, c'est un échec de planification."
              }
            ].map(({ q, a }) => (
              <div key={q} className="border border-[#E5E7EB] rounded-xl p-5">
                <p className="font-semibold text-[#111111] mb-2">{q}</p>
                <p className="text-[#525252] text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Libérez de la trésorerie en cuisine</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            RestauMargin importe vos factures fournisseurs, calcule votre rotation des stocks par catégorie en temps réel et alerte automatiquement quand un produit dépasse son seuil de jours de stock cible.
          </p>
          <a
            href="https://www.restaumargin.fr/pricing"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors text-sm"
          >
            Essayer gratuitement <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Nav bas de page */}
        <div className="mt-12 pt-8 border-t border-[#E5E7EB] flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">← Tous les articles</Link>
          <Link to="/outils/calculateur-food-cost" className="text-sm text-teal-600 hover:underline">Calculateur food cost gratuit →</Link>
        </div>
      </main>
    </div>
  );
}
