import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Calculator, TrendingDown, BarChart3, AlertTriangle, Target, ArrowRight } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogSeuilRentabilite() {
  const faqSchema = buildFAQSchema([
    {
      question: "Quelle est la différence entre seuil de rentabilité et point mort ?",
      answer: "Ces deux termes désignent la même réalité : le niveau de CA à partir duquel vous ne perdez plus d'argent. \"Seuil de rentabilité\" est la terminologie comptable, \"point mort\" est l'expression courante. Dans certains pays francophones, le point mort désigne la date à partir de laquelle l'entreprise devient rentable."
    },
    {
      question: "Quel est le seuil de rentabilité moyen d'un restaurant en France ?",
      answer: "Selon les études sectorielles 2024-2025, les restaurants français atteignent leur point mort en moyenne vers le 7ème ou 8ème mois de l'année. Les plus rentables le franchissent dès le 5ème mois, les plus fragiles ne l'atteignent jamais."
    },
    {
      question: "Mon food cost est à 35 %, est-ce trop élevé ?",
      answer: "35 % est dans la fourchette haute mais acceptable pour un gastronomique. Pour un fast casual ou pizzeria, c'est trop élevé — visez 25-30 %. La règle : food cost + masse salariale ne doivent pas dépasser 65-70 % du CA."
    },
    {
      question: "Comment le seuil change-t-il avec la livraison ?",
      answer: "La livraison crée un deuxième seuil de rentabilité avec son propre taux de charges variables. Les commissions plateforme (25-30 %) s'ajoutent aux coûts matières. Calculez le seuil de votre activité livraison séparément."
    },
    {
      question: "Puis-je calculer mon seuil sans comptable ?",
      answer: "Oui. La formule ne nécessite pas de formation comptable — il faut classer correctement vos charges en fixes et variables. Un outil comme RestauMargin fait ce calcul automatiquement à partir de vos données réelles."
    }
  ]);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Accueil', url: 'https://www.restaumargin.fr' },
    { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
    { name: 'Seuil de rentabilité', url: 'https://www.restaumargin.fr/blog/seuil-rentabilite-restaurant' },
  ]);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Comment calculer le seuil de rentabilité d'un restaurant (2026)"
        description="Guide complet pour calculer le seuil de rentabilité de votre restaurant : formules, exemples chiffrés et stratégies pour atteindre la rentabilité plus vite."
        path="/blog/seuil-rentabilite-restaurant"
        type="article"
        schema={[faqSchema, breadcrumbSchema]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Comment calculer le seuil de rentabilité d'un restaurant (2026)",
            "datePublished": "2026-04-25",
            "dateModified": "2026-04-25",
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
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/seuil-rentabilite-restaurant"
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
        category="Gestion financière"
        readTime="12 min"
        date="Avril 2026"
        title="Comment calculer le seuil de rentabilité d'un restaurant (2026)"
        accentWord="seuil de rentabilité"
        subtitle="60 % des restaurants ferment dans les trois premières années. La cause principale ? Ne pas connaître son point mort. Voici la méthode complète."
      />

      {/* Body */}
      <main className="max-w-[720px] mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          Saviez-vous que <strong>60 % des restaurants ferment dans les trois premières années</strong> ? L'une des causes principales n'est pas le manque de clients — c'est de ne pas savoir combien de couverts il faut servir chaque jour pour ne pas perdre d'argent. Ce chiffre s'appelle le <strong>seuil de rentabilité</strong>, et le connaître change tout.
        </p>

        {/* Sommaire */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#definition" className="hover:text-teal-600 transition-colors">1. Qu'est-ce que le seuil de rentabilité ?</a></li>
            <li><a href="#composantes" className="hover:text-teal-600 transition-colors">2. Charges fixes vs charges variables</a></li>
            <li><a href="#formule" className="hover:text-teal-600 transition-colors">3. La formule du seuil de rentabilité</a></li>
            <li><a href="#exemple" className="hover:text-teal-600 transition-colors">4. Exemple : un bistrot parisien de 40 couverts</a></li>
            <li><a href="#reduire" className="hover:text-teal-600 transition-colors">5. Comment réduire son seuil de rentabilité ?</a></li>
            <li><a href="#erreurs" className="hover:text-teal-600 transition-colors">6. Erreurs fréquentes à éviter</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="definition" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">1. Qu'est-ce que le seuil de rentabilité ?</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le <strong>seuil de rentabilité</strong> (aussi appelé <strong>point mort</strong> ou <strong>break-even point</strong>) est le chiffre d'affaires minimum que votre restaurant doit réaliser pour couvrir l'ensemble de ses charges — ni bénéfice, ni perte.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">
            En dessous de ce seuil : vous perdez de l'argent. Au-dessus : vous commencez à dégager un bénéfice. C'est l'indicateur financier le plus fondamental pour un restaurateur, bien plus utile que le chiffre d'affaires brut ou le nombre de couverts servis.
          </p>
          <div className="border-l-4 border-teal-400 bg-teal-50 rounded-r-xl p-4 mb-4">
            <p className="text-sm font-semibold text-teal-700">Exemple concret</p>
            <p className="text-sm text-teal-600">Un restaurant qui réalise 15 000 € de CA mensuel peut très bien perdre de l'argent si son seuil de rentabilité est à 18 000 €. Sans ce calcul, le gérant navigue à l'aveugle.</p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="composantes" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">2. Charges fixes vs charges variables</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Avant d'appliquer la formule, vous devez classer vos charges en deux catégories.
          </p>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Charges fixes (CF)</strong> — indépendantes du volume d'activité :</p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Loyer + charges locatives : 2 000 € – 8 000 €</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Salaires fixes (CDI) : 5 000 € – 20 000 €</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Assurances : 300 € – 800 €</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Leasing équipements : 400 € – 2 000 €</li>
          </ul>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Charges variables (CV)</strong> — proportionnelles au CA :</p>
          <ul className="space-y-2 text-[#374151]">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Matières premières (food cost) : 28 % – 35 %</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Boissons : 20 % – 30 %</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Énergie variable : 3 % – 5 %</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Commissions plateformes : 15 % – 30 %</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section id="formule" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">3. La formule du seuil de rentabilité</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Étape 1 : Calculer la Marge sur Coût Variable (MCV)</strong>
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>MCV = Chiffre d'affaires - Charges variables</div>
            <div>Taux de MCV = MCV / CA × 100</div>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Étape 2 : Calculer le Seuil de Rentabilité</strong>
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            Seuil de rentabilité (€) = Charges fixes / Taux de MCV
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Étape 3 : Calculer le Point Mort en jours</strong>
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            Point mort (jours) = Seuil de rentabilité / (CA annuel / 365)
          </div>
          <p className="text-[#374151] leading-relaxed">
            Le <strong>point mort en jours</strong> vous dit à partir de quel jour de l'année votre restaurant commence à être rentable. Si votre point mort est au 220ème jour, vous ne faites des bénéfices que sur les 145 derniers jours — une situation risquée.
          </p>
        </section>

        {/* Section 4 */}
        <section id="exemple" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">4. Exemple : un bistrot parisien</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Prenons le cas du <strong>"Comptoir des Halles"</strong>, un bistrot parisien de 40 couverts ouvert 6 jours sur 7.
          </p>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Données :</strong> CA mensuel 45 000 €, food cost + boissons 14 000 € (31 %), énergie 1 800 €, emballages 450 €.</p>
          <p className="text-[#374151] leading-relaxed mb-3">Total charges variables : <strong>16 250 € → 36,1 % du CA</strong></p>
          <p className="text-[#374151] leading-relaxed mb-3">Charges fixes (loyer 4 500 €, salaires 9 800 €, assurances 420 €, leasing 680 €, comptable 350 €, abonnements 180 €) : <strong>15 930 €</strong></p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Taux de MCV = (45 000 - 16 250) / 45 000 = 63,9 %</div>
            <div>Seuil de rentabilité = 15 930 / 0,639 = 24 929 €</div>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le bistrot doit réaliser au minimum <strong>24 929 € de CA mensuel</strong> pour ne pas perdre d'argent. Avec un ticket moyen à 28 €, cela représente 890 couverts/mois, soit <strong>34 couverts/jour</strong> — un taux d'occupation de 85 %.
          </p>
          <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl p-4">
            <p className="text-sm font-semibold text-amber-700">Point mort calendaire</p>
            <p className="text-sm text-amber-600">Avec ces données, le bistrot devient rentable le <strong>21 juillet</strong>, au 202ème jour de l'année. Les 6 mois restants génèrent le bénéfice annuel.</p>
          </div>
        </section>

        {/* Section 5 */}
        <section id="reduire" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">5. Comment réduire son seuil ?</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Deux leviers : <strong>diminuer les charges fixes</strong> ou <strong>augmenter le taux de MCV</strong>.
          </p>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Levier 1 — Réduire les charges fixes :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Renégocier le bail commercial (-500 €/mois = baisse du seuil de 783 €)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Optimiser les plannings selon les périodes creuses</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Mutualiser les abonnements (caisse + gestion + compta)</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Levier 2 — Augmenter le taux de MCV :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Passer de 32 % à 28 % de food cost = +1 800 €/mois</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Augmenter le ticket moyen de 2 € sur 900 couverts = +1 800 €</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Réduire les pertes matières (objectif &lt; 2 %)</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Une optimisation combinée (food cost -3 pts + loyer -500 € + ticket moyen +2 €) peut réduire le seuil de rentabilité de <strong>12 %</strong>. Sur notre exemple : passer de 24 929 € à 21 938 €.
          </p>
        </section>

        {/* Section 6 */}
        <section id="erreurs" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">6. Erreurs fréquentes à éviter</h2>
          </div>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
              <span><strong>Confondre CA et trésorerie</strong> — un restaurant peut atteindre son seuil mais manquer de trésorerie si les délais fournisseurs sont mauvais.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
              <span><strong>Oublier les charges saisonnières</strong> — primes, congés payés, taxe foncière doivent être lissés sur 12 mois.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
              <span><strong>Ne pas recalculer après changement majeur</strong> — embauche, hausse de loyer, changement fournisseur.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
              <span><strong>Ignorer les commissions livraison</strong> — Uber Eats à 25-30 % décale massivement le seuil pour cette activité.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
              <span><strong>Calculer une seule fois à l'ouverture</strong> — recalculez au minimum chaque trimestre.</span>
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "Quelle est la différence entre seuil de rentabilité et point mort ?",
                a: "Ces deux termes désignent la même réalité : le niveau de CA à partir duquel vous ne perdez plus d'argent. \"Seuil de rentabilité\" est la terminologie comptable, \"point mort\" est l'expression courante. Dans certains pays francophones, le point mort désigne la date à partir de laquelle l'entreprise devient rentable."
              },
              {
                q: "Quel est le seuil de rentabilité moyen d'un restaurant en France ?",
                a: "Selon les études sectorielles 2024-2025, les restaurants français atteignent leur point mort en moyenne vers le 7ème ou 8ème mois de l'année. Les plus rentables le franchissent dès le 5ème mois, les plus fragiles ne l'atteignent jamais."
              },
              {
                q: "Mon food cost est à 35 %, est-ce trop élevé ?",
                a: "35 % est dans la fourchette haute mais acceptable pour un gastronomique. Pour un fast casual ou pizzeria, c'est trop élevé — visez 25-30 %. La règle : food cost + masse salariale ne doivent pas dépasser 65-70 % du CA."
              },
              {
                q: "Comment le seuil change-t-il avec la livraison ?",
                a: "La livraison crée un deuxième seuil de rentabilité avec son propre taux de charges variables. Les commissions plateforme (25-30 %) s'ajoutent aux coûts matières. Calculez le seuil de votre activité livraison séparément."
              },
              {
                q: "Puis-je calculer mon seuil sans comptable ?",
                a: "Oui. La formule ne nécessite pas de formation comptable — il faut classer correctement vos charges en fixes et variables. Un outil comme RestauMargin fait ce calcul automatiquement à partir de vos données réelles."
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
          <h2 className="text-2xl font-bold mb-3">Calculez votre seuil de rentabilité en 5 minutes</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            RestauMargin intègre le calcul automatique du seuil de rentabilité dans votre tableau de bord : seuil mensuel, couverts quotidiens nécessaires, point mort en jours et alertes en temps réel.
          </p>
          <a
            href="https://www.restaumargin.fr/pricing"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors text-sm"
          >
            Essayer gratuitement <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Nav bas */}
        <div className="mt-12 pt-8 border-t border-[#E5E7EB] flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">← Tous les articles</Link>
          <Link to="/outils/calculateur-food-cost" className="text-sm text-teal-600 hover:underline">Calculateur food cost gratuit →</Link>
        </div>
      </main>
    </div>
  );
}
