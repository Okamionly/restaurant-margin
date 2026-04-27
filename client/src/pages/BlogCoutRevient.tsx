import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Calculator, Scissors, Table, RefreshCw, AlertTriangle, ClipboardList, ArrowRight } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogCoutRevient() {
  const faqSchema = buildFAQSchema([
    {
      question: "Faut-il intégrer le coût de l'huile de cuisson dans la fiche technique ?",
      answer: "Oui, mais sous forme de forfait moyen (0,10 à 0,20 € par portion) car le pesage exact à chaque cuisson est irréaliste. Calculez votre consommation mensuelle d'huile et divisez par le nombre de couverts."
    },
    {
      question: "Comment gérer un plat à plusieurs garnitures interchangeables ?",
      answer: "Créez une fiche technique par variante. Le filet de bœuf avec frites, gratin dauphinois ou légumes grillés a 3 coûts différents. Calculez la moyenne pondérée selon la fréquence de chaque garniture."
    },
    {
      question: "Mon coût calculé est 8,20 € mais je ressens que ça coûte plus cher. Pourquoi ?",
      answer: "Vous oubliez probablement : sauce et fonds (0,50-1 €), pain et beurre offerts (0,30 €), pertes au dressage (5-8 %), erreurs de portionnage (10-15 % d'écart). Total réel souvent 15-20 % au-dessus du calcul théorique."
    },
    {
      question: "Faut-il intégrer le coût de la main-d'œuvre dans le coût de revient ?",
      answer: "Non, le coût de revient ne contient que les matières. La main-d'œuvre est intégrée plus haut, via le coefficient multiplicateur (méthode 1 de tarification) ou dans le prime cost global."
    },
    {
      question: "Combien de temps pour faire les fiches techniques de toute ma carte ?",
      answer: "Pour 25 plats : 8-12 heures la première fois (avec pesées et photos). Ensuite 1-2 heures de mise à jour mensuelle. Un logiciel comme RestauMargin réduit ce temps de 70 %."
    }
  ]);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Calculer le coût de revient d'un plat", url: "https://www.restaumargin.fr/blog/cout-revient-plat-restaurant" }
  ]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Calculer le coût de revient d'un plat : méthode complète pour restaurateurs"
        description="Calculez précisément le coût de revient de chaque plat de votre carte : ratio de perte, fiche technique, seuil d'alerte food cost."
        path="/blog/cout-revient-plat-restaurant"
        type="article"
        schema={[faqSchema, breadcrumbSchema]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Calculer le coût de revient d'un plat : méthode complète pour restaurateurs",
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
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/cout-revient-plat-restaurant"
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
        category="Marges"
        readTime="10 min"
        date="Avril 2026"
        title="Calculer le coût de revient d'un plat : méthode complète pour restaurateurs"
        accentWord="coût de revient"
        subtitle="Méthode pas à pas, ratios de perte par produit, exemple chiffré boeuf bourguignon et modèle de fiche technique réutilisable."
      />

      {/* Body */}
      <main className="max-w-[720px] mx-auto px-4 sm:px-6 pb-24">

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          Combien coûte réellement votre plat phare ? Si vous avez répondu à la louche, vous faites comme <strong>70 % des restaurateurs indépendants</strong> — et vous perdez probablement entre 1 500 € et 4 000 € par mois sur des plats mal calculés. Le coût de revient d'un plat n'est pas un chiffre approximatif : c'est le socle de toute votre tarification, de votre marge brute et de votre rentabilité.
        </p>

        {/* Sommaire */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#definition" className="hover:text-teal-600 transition-colors">1. Définition : coût de revient vs food cost</a></li>
            <li><a href="#methode" className="hover:text-teal-600 transition-colors">2. Méthode pas à pas en 5 étapes</a></li>
            <li><a href="#exemple" className="hover:text-teal-600 transition-colors">3. Exemple complet : boeuf bourguignon</a></li>
            <li><a href="#perte" className="hover:text-teal-600 transition-colors">4. Le ratio de perte (parage, cuisson)</a></li>
            <li><a href="#fiche" className="hover:text-teal-600 transition-colors">5. Fiche technique standardisée</a></li>
            <li><a href="#alerte" className="hover:text-teal-600 transition-colors">6. Seuils d'alerte et décisions</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="definition" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">1. Définition : coût de revient vs food cost</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le <strong>coût de revient</strong> est le coût matière brut d'une portion vendue. Le <strong>food cost</strong> est le pourcentage qu'il représente par rapport au prix de vente HT.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Coût de revient = Σ (Quantité nette × Prix d'achat ingrédient)</div>
            <div>Food cost % = (Coût de revient / Prix de vente HT) × 100</div>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Cibles food cost en restauration :</strong>
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Bistronomie : 28-32 %</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Brasserie classique : 30-35 %</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Gastronomique : 25-30 %</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Pizzeria : 22-28 %</li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Un écart {'>'} 3 points entre food cost théorique et food cost réel = signe d'un problème (vol, gaspillage, fournisseurs qui ont augmenté).
          </p>
        </section>

        {/* Section 2 */}
        <section id="methode" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">2. Méthode pas à pas en 5 étapes</h2>
          </div>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
              <span><strong>Étape 1 — Lister TOUS les ingrédients</strong> : principaux, garnitures, sauce, assaisonnements, décor. Ne pas oublier les "petits" (huile, fleur de sel, herbes) qui peuvent représenter 5-10 % du coût réel.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
              <span><strong>Étape 2 — Peser les quantités NETTES</strong> : après parage (gras, nerfs, arêtes), après dénoyautage, après cuisson si la quantité diminue. Distinguez quantité brute et quantité nette.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
              <span><strong>Étape 3 — Appliquer le prix d'achat HT</strong> : prix moyen pondéré sur 3 mois, frais de port inclus, prix négocié réel.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
              <span><strong>Étape 4 — Additionner</strong> = coût matière brut par portion.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
              <span><strong>Étape 5 — Ajouter les "à côtés"</strong> : sauce/fond (~0,80 €), pain offert (~0,15 €), beurre (~0,12 €), décor (~0,20 €). Total : 0,40 à 0,80 € par couvert, soit 3-5 points de food cost.</span>
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section id="exemple" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Table className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">3. Exemple complet : boeuf bourguignon (4 personnes)</h2>
          </div>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Bœuf paleron 1056 g net × 14,90 €/kg : 15,73 €</div>
            <div>Lardons fumés 190 g × 11,50 €/kg : 2,19 €</div>
            <div>Carottes 328 g × 1,80 €/kg : 0,59 €</div>
            <div>Champignons 276 g × 5,80 €/kg : 1,60 €</div>
            <div>Vin rouge Bourgogne 500 ml × 9,80 €/L : 4,90 €</div>
            <div>Fond de veau 300 ml × 12 €/L : 3,60 €</div>
            <div>Pommes de terre 510 g × 1,90 €/kg : 0,97 €</div>
            <div>Autres (oignons, beurre, condiments, décor) : 1,33 €</div>
            <div>SOUS-TOTAL 4 portions : 30,91 €</div>
            <div>COÛT PAR PORTION : 7,73 €</div>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Calcul du food cost selon prix de vente :</strong>
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> 22,00 € TTC → food cost 38,6 % (trop élevé)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> 24,90 € TTC → food cost 34,1 % (limite)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> 26,90 € TTC → food cost 31,6 % (acceptable)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> 28,90 € TTC → food cost 29,4 % (optimal)</li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            <strong>Décision</strong> : prix de vente entre 26,90 € et 28,90 € TTC pour rester dans la cible 28-32 %.
          </p>
        </section>

        {/* Section 4 */}
        <section id="perte" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <Scissors className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">4. Le ratio de perte (parage, cuisson, déchets)</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            On n'achète <strong>jamais</strong> la quantité finalement servie. Pertes typiques par produit :
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Filet de bœuf entier : 40-50 % perte totale</div>
            <div>Magret de canard : 25-33 %</div>
            <div>Filet de poisson entier (dorade) : 60-70 %</div>
            <div>Champignons de Paris : 35-48 % (eau)</div>
            <div>Carottes : 20-25 % (épluchage)</div>
            <div>Salade verte : 25-35 % (côtes)</div>
            <div>Poireaux : 35-45 % (vert)</div>
          </div>
          <div className="border-l-4 border-red-400 bg-red-50 rounded-r-xl p-4 mb-4">
            <p className="text-sm font-semibold text-red-700">Calcul concret</p>
            <p className="text-sm text-red-600">Filet de poisson entier acheté 18 €/kg avec 65 % de pertes → prix réel utilisable 51,40 €/kg (18 / 0,35). Beaucoup de restaurateurs facturent à 18 € — d'où des marges noyées.</p>
          </div>
          <p className="text-[#374151] leading-relaxed">
            <strong>Méthode</strong> : pesez avant (brut), pesez après préparation (net), ratio = (Brut − Net) / Brut. Refaites 3-5 fois sur 1-2 mois pour une moyenne fiable.
          </p>
        </section>

        {/* Section 5 */}
        <section id="fiche" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">5. Fiche technique standardisée</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Fréquence de mise à jour recommandée :</strong>
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Viandes / Poissons : MENSUELLE</div>
            <div>Légumes saisonniers : MENSUELLE</div>
            <div>Fromages, charcuterie : trimestrielle</div>
            <div>Épicerie / Secs : semestrielle</div>
            <div>Vins / Alcools : annuelle</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Sans cet exercice mensuel, votre food cost réel peut <strong>dériver de 28 % vers 34 % en 6 mois</strong> — soit 6 points de marge brute perdus sans s'en rendre compte. Importez vos factures fournisseurs, calculez le prix moyen pondéré 3 mois, recalculez automatiquement les fiches.
          </p>
        </section>

        {/* Section 6 */}
        <section id="alerte" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">6. Seuils d'alerte et décisions à prendre</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Matrice de décision</strong> à appliquer plat par plat :
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> {'<'} 22 % : très rentable, mettre en avant (suggestion serveurs, photo)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> 22-28 % : optimal, maintenir</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> 28-32 % : acceptable, surveiller</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> 32-35 % : limite haute, recalculer / négocier / ajuster portion</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> 35-40 % : alerte, revoir recette ou augmenter prix</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> {'>'} 40 % : critique, retirer de la carte ou refonte complète</li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            <strong>Cas concret</strong> : Filet de bar (coût 9,20 €, prix 26 € TTC, food cost 38,9 %). Options : augmenter à 29,90 € (food cost 33,8 %), réduire portion 180→150 g (food cost 32,4 %), changer fournisseur, ou retirer le plat.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "Faut-il intégrer le coût de l'huile de cuisson dans la fiche technique ?",
                a: "Oui, mais sous forme de forfait moyen (0,10 à 0,20 € par portion) car le pesage exact à chaque cuisson est irréaliste. Calculez votre consommation mensuelle d'huile et divisez par le nombre de couverts."
              },
              {
                q: "Comment gérer un plat à plusieurs garnitures interchangeables ?",
                a: "Créez une fiche technique par variante. Le filet de bœuf avec frites, gratin dauphinois ou légumes grillés a 3 coûts différents. Calculez la moyenne pondérée selon la fréquence de chaque garniture."
              },
              {
                q: "Mon coût calculé est 8,20 € mais je ressens que ça coûte plus cher. Pourquoi ?",
                a: "Vous oubliez probablement : sauce et fonds (0,50-1 €), pain et beurre offerts (0,30 €), pertes au dressage (5-8 %), erreurs de portionnage (10-15 % d'écart). Total réel souvent 15-20 % au-dessus du calcul théorique."
              },
              {
                q: "Faut-il intégrer le coût de la main-d'œuvre dans le coût de revient ?",
                a: "Non, le coût de revient ne contient que les matières. La main-d'œuvre est intégrée plus haut, via le coefficient multiplicateur (méthode 1 de tarification) ou dans le prime cost global."
              },
              {
                q: "Combien de temps pour faire les fiches techniques de toute ma carte ?",
                a: "Pour 25 plats : 8-12 heures la première fois (avec pesées et photos). Ensuite 1-2 heures de mise à jour mensuelle. Un logiciel comme RestauMargin réduit ce temps de 70 %."
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
          <h2 className="text-2xl font-bold mb-3">Calculez vos coûts de revient en quelques clics</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            RestauMargin importe vos factures fournisseurs, génère vos fiches techniques avec gestion des pertes au parage et alerte automatiquement quand un plat dérive au-dessus du seuil cible.
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
