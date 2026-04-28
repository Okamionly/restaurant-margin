import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Calculator, PieChart, TrendingUp, BarChart3, Target, Zap, ArrowRight } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogChiffreAffaires() {
  const faqSchema = buildFAQSchema([
    {
      question: "HT ou TTC pour piloter ?",
      answer: "Toujours en HT pour les marges, food cost, ratios. Le TTC est utile uniquement pour la trésorerie immédiate (encaissement) et la facturation client."
    },
    {
      question: "À partir de quel CA un restaurant est rentable ?",
      answer: "Pas de seuil universel. Le seuil de rentabilité dépend des charges fixes. Pour un restaurant urbain moyen avec 18 000 € de charges fixes/mois, il faut environ 60 000 €/mois de CA HT pour atteindre l'équilibre."
    },
    {
      question: "Comment comparer mon CA aux concurrents ?",
      answer: "Indicateurs publics utiles : Insee panorama de la restauration, GIRA Conseil, observatoire UMIH. Ratios robustes : CA/m² (3 000 à 8 000 €/m²/an), CA/employé (60 000 à 120 000 €/an)."
    },
    {
      question: "CA en croissance mais EBE qui baisse, pourquoi ?",
      answer: "Trois causes possibles : (1) inflation matières non répercutée sur les prix, (2) salaires qui dérapent (extras, heures sup), (3) charges fixes en hausse (loyer indexé, énergie). Audit poste par poste obligatoire."
    }
  ]);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Chiffre d'affaires restaurant", url: "https://www.restaumargin.fr/blog/chiffre-affaires-restaurant-comment-calculer" }
  ]);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Chiffre d'affaires restaurant : comment le calculer, l'analyser et l'augmenter"
        description="Calculez votre CA par service, analysez les créneaux faibles et appliquez les 5 leviers pour augmenter votre chiffre d'affaires de restaurant."
        path="/blog/chiffre-affaires-restaurant-comment-calculer"
        type="article"
        schema={[faqSchema, breadcrumbSchema]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Chiffre d'affaires restaurant : comment le calculer, l'analyser et l'augmenter",
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
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/chiffre-affaires-restaurant-comment-calculer"
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
        category="Pilotage"
        readTime="11 min"
        date="Avril 2026"
        title="Chiffre d'affaires restaurant : comment le calculer, l'analyser et l'augmenter"
        accentWord="chiffre d'affaires"
        subtitle="Un restaurant à 600 K€ peut perdre. Un autre à 380 K€ peut dégager 60 K€ d'EBE. Le CA n'est qu'une moitié de l'équation."
      />

      {/* Body */}
      <main className="max-w-[720px] mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          Le chiffre d'affaires n'est qu'une moitié de l'équation, mais c'est la moitié visible — celle que voit le banquier, l'équipe, et parfois trop souvent le restaurateur lui-même. Encore faut-il le calculer correctement (HT vs TTC, deux taux de TVA), l'analyser finement (midi vs soir, jour de semaine, canal) et savoir l'augmenter avec méthode.
        </p>

        {/* Table des matières */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#tva" className="hover:text-teal-600 transition-colors">1. CA HT vs CA TTC : la TVA</a></li>
            <li><a href="#composantes" className="hover:text-teal-600 transition-colors">2. Les 3 composantes du CA</a></li>
            <li><a href="#formule" className="hover:text-teal-600 transition-colors">3. La formule du CA restaurant</a></li>
            <li><a href="#exemple" className="hover:text-teal-600 transition-colors">4. Exemple complet de calcul</a></li>
            <li><a href="#analyse" className="hover:text-teal-600 transition-colors">5. Analyser : service, jour, canal</a></li>
            <li><a href="#rentabilite" className="hover:text-teal-600 transition-colors">6. Pourquoi un gros CA peut perdre</a></li>
            <li><a href="#leviers" className="hover:text-teal-600 transition-colors">7. Les 5 leviers d'augmentation</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="tva" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">1. CA HT vs CA TTC</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            En France, la restauration applique deux taux de TVA simultanément :
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0" /><span><strong>10 %</strong> sur nourriture et boissons sans alcool sur place</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0" /><span><strong>20 %</strong> sur alcool et livraison via plateforme tierce</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed mb-4">
            Exemple addition typique 49 € TTC : entrée 9 + plat 22 + dessert 8 + vin 7 + café 3.
          </p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100 space-y-1">
            <div>CA TTC = 49 €</div>
            <div>CA HT = 44,01 €</div>
            <div>TVA collectée = 4,99 €</div>
          </div>
          <div className="border-l-4 border-red-400 bg-red-50 rounded-r-xl p-4 mb-4">
            <p className="text-sm font-semibold text-red-700">Règle d'or</p>
            <p className="text-sm text-red-600">Tous les calculs de marge, food cost et KPIs se font <strong>en HT</strong>. Raisonner en TTC fausse le food cost de 10 points.</p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="composantes" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <PieChart className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">2. Les 3 composantes</h2>
          </div>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>Salle (60-85 %)</strong> : canal historique, le plus rentable (vins, desserts, cafés, pas de commission)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>Livraison (10-30 %)</strong> : Uber, Deliveroo. Marge réduite (commission 25-30 %). {'>'} 30 % = dépendance.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>Événements (5-20 %)</strong> : mariages, séminaires. Marges 30-45 % d'EBE.</span></li>
          </ul>
        </section>

        {/* Section 3 */}
        <section id="formule" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">3. La formule du CA</h2>
          </div>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100">
            CA = Couverts × Ticket moyen × Services × Jours d'ouverture
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Pour la livraison :</strong>
          </p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100">
            CA livraison = Commandes × Panier moyen × Jours d'activité
          </div>
          <p className="text-[#374151] leading-relaxed">
            Avec retraitement de la commission plateforme (25-30 %) pour passer du brut au net.
          </p>
        </section>

        {/* Section 4 */}
        <section id="exemple" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">4. Exemple complet</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Restaurant urbain 50 cv, midi + soir, 6/7. Taux remplissage 60 %, ticket 32 € TTC (28,80 € HT), 25 jours/mois.
          </p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100 space-y-1">
            <div>CA salle = 60 × 28,80 × 25 = 43 200 €/mois</div>
            <div>CA livraison net (35 cmd × 20 € × 25 j × 0,72) = 12 600 €</div>
            <div>CA événements (2 × 1 800 €) = 3 600 €/mois</div>
            <div className="pt-2 font-bold border-t border-mono-900">Total mensuel : 59 400 € HT</div>
            <div className="font-bold">Total annuel : 712 800 € HT</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Répartition : Salle 73 % · Livraison 21 % · Événements 6 %.
          </p>
        </section>

        {/* Section 5 */}
        <section id="analyse" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">5. Analyser par service et jour</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Analyse horaire</strong> (créneaux faibles à activer) :</p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-xs text-mono-100 space-y-1">
            <div>12h-13h : 28 cv, 728 € → saturé</div>
            <div>14h-15h : 4 cv, 92 € → fermer ?</div>
            <div>20h-21h : 32 cv, 1 088 € → saturé</div>
            <div>22h-23h : 4 cv, 132 € → faible (last call ?)</div>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Mix-vente Boston Matrix :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>30 % stars</strong> (forte marge + forte rotation) : à mettre en avant</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>30 % vaches à lait</strong> : à optimiser en coût</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>20 % dilemmes</strong> : à pousser</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>20 % poids morts</strong> : à supprimer</span></li>
          </ul>
        </section>

        {/* Section 6 */}
        <section id="rentabilite" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">6. Gros CA peut perdre</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Cas réel :</strong> 950 K€ CA, déficit -38 K€. Food cost à 40 %, salaires à 38 %, charges à 26 %.
          </p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-xs text-mono-100 space-y-1">
            <div className="font-bold">Restaurant A (gros CA) vs B (petit CA)</div>
            <div>CA : 950 K€ vs 380 K€</div>
            <div>Marge brute : 60 % vs 70 %</div>
            <div>Salaires : 38 % vs 32 %</div>
            <div>Charges fixes : 26 % vs 18 %</div>
            <div className="pt-2 font-bold border-t border-mono-900">EBE : -38 K€ vs +76 K€</div>
          </div>
          <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl p-4 mb-4">
            <p className="text-sm font-semibold text-amber-700">Lecture</p>
            <p className="text-sm text-amber-600">B avec 2,5× moins de CA dégage 114 K€ de plus en marge. <strong>CA n'est pas synonyme de rentabilité.</strong></p>
          </div>
        </section>

        {/* Section 7 */}
        <section id="leviers" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">7. Les 5 leviers d'augmentation</h2>
          </div>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>1. Nouveau créneau</strong> (brunch dimanche) : +12-18 % CA. Ex : 35 cv × 28 € × 50 = +49 K€/an</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>2. Ticket moyen</strong> : formation upselling (+5-12 %), apéro suggéré, café gourmand. Ex : +3,50 € × 18 000 cv = +63 K€</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>3. Taux de remplissage</strong> : Tapas Tuesday, dîner thème. Ex : 50 mardis × 10 cv × 25 € = +12,5 K€</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>4. Livraison</strong> : carte adaptée. Ex : 12 cmd × 22 € × 365 = 96 K€ brut → 69 K€ net</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>5. Privatisations</strong> : 1/mois × 2 500 € = +30 K€/an quasi-pure marge</span></li>
          </ul>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100">
            Combo 3 leviers : +151 K€ CA, +75 K€ EBE, ROI 4,7×
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "HT ou TTC pour piloter ?",
                a: "Toujours en HT pour les marges, food cost, ratios. Le TTC est utile uniquement pour la trésorerie immédiate (encaissement) et la facturation client."
              },
              {
                q: "À partir de quel CA un restaurant est rentable ?",
                a: "Pas de seuil universel. Le seuil de rentabilité dépend des charges fixes. Pour un restaurant urbain moyen avec 18 000 € de charges fixes/mois, il faut environ 60 000 €/mois de CA HT pour atteindre l'équilibre."
              },
              {
                q: "Comment comparer mon CA aux concurrents ?",
                a: "Indicateurs publics utiles : Insee panorama de la restauration, GIRA Conseil, observatoire UMIH. Ratios robustes : CA/m² (3 000 à 8 000 €/m²/an), CA/employé (60 000 à 120 000 €/an)."
              },
              {
                q: "CA en croissance mais EBE qui baisse, pourquoi ?",
                a: "Trois causes possibles : (1) inflation matières non répercutée sur les prix, (2) salaires qui dérapent (extras, heures sup), (3) charges fixes en hausse (loyer indexé, énergie). Audit poste par poste obligatoire."
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
          <h2 className="text-2xl font-bold mb-3">Du CA à la marge nette</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            Augmenter son CA est essentiel, protéger sa marge l'est encore plus. RestauMargin pilote vos food cost, marges et ratios en temps réel pour transformer chaque euro en bénéfice.
          </p>
          <a
            href="https://www.restaumargin.fr/pricing"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors text-sm"
          >
            Essayer gratuitement <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Nav bas de page */}
        <div className="mt-12 pt-8 border-t border-mono-900 flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">← Tous les articles</Link>
          <Link to="/blog/budget-previsionnel-restaurant" className="text-sm text-teal-600 hover:underline">Budget prévisionnel →</Link>
        </div>
      </main>
    </div>
  );
}
