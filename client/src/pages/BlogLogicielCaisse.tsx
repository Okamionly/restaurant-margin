import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Cpu, ShieldCheck, Layers, Zap, BarChart3, ArrowRight } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogLogicielCaisse() {
  const faqSchema = buildFAQSchema([
    {
      question: "Faut-il acheter ou louer son matériel de caisse ?",
      answer: "La location-financement (LOA) est dominante : 50 à 100 €/mois pour un kit complet (terminal + tiroir + imprimante + douchette). Achat direct possible chez SumUp/Zettle (250-450 €)."
    },
    {
      question: "Une caisse iPad est-elle aussi fiable qu'un terminal dédié ?",
      answer: "Oui, en 2026. La majorité des leaders (Zelty, L'Addition, Lightspeed) tournent sur iPad ou Android avec une fiabilité équivalente, à condition d'avoir une connexion internet stable et une box de secours 4G."
    },
    {
      question: "Combien de temps pour migrer d'une caisse à une autre ?",
      answer: "Comptez 2 à 4 semaines : import du catalogue, formation des équipes, période de test parallèle, bascule définitive. La première semaine de fermeture estivale est un classique."
    },
    {
      question: "Mon expert-comptable peut-il imposer un logiciel précis ?",
      answer: "Non, mais il peut facturer plus cher si votre caisse n'exporte pas un FEC propre. Vérifiez la compatibilité avant de signer."
    },
    {
      question: "Quelle caisse pour un restaurant qui ouvre en 2026 ?",
      answer: "Pour un restaurant indépendant traditionnel ou bistronomie : Zelty offre le meilleur compromis prix/fonctionnalités/écosystème français. Pour un food truck ou snack : SumUp POS. Pour une chaîne : Innovorder ou Lightspeed."
    }
  ]);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Accueil', url: 'https://www.restaumargin.fr' },
    { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
    { name: 'Logiciel de caisse', url: 'https://www.restaumargin.fr/blog/logiciel-caisse-enregistreuse-restaurant' },
  ]);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Logiciel de caisse restaurant : comparatif 2026 (Lightspeed, Zelty, L'Addition...)"
        description="Comparatif des meilleurs logiciels de caisse enregistreuse pour restaurant en 2026. Prix, fonctionnalités, avantages et inconvénients."
        path="/blog/logiciel-caisse-enregistreuse-restaurant"
        type="article"
        schema={[faqSchema, breadcrumbSchema]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Logiciel de caisse enregistreuse pour restaurant : comparatif 2026",
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
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/logiciel-caisse-enregistreuse-restaurant"
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
        category="Outils"
        readTime="13 min"
        date="Avril 2026"
        title="Logiciel de caisse restaurant : comparatif 2026"
        accentWord="logiciel de caisse"
        subtitle="Lightspeed, Zelty, L'Addition, Innovorder, SumUp, Zettle… Le comparatif complet des 7 solutions les plus utilisées en France."
      />

      {/* Body */}
      <main className="max-w-[720px] mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          <strong>90 % des décisions de pilotage d'un restaurant se prennent à partir de données issues de la caisse.</strong> Et pourtant, plus d'un restaurateur sur trois utilise encore un système qui n'exporte pas ses données ou ne se synchronise pas avec sa comptabilité. Ce comparatif passe au crible les 7 solutions les plus utilisées en France.
        </p>

        {/* Sommaire */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#strategique" className="hover:text-teal-600 transition-colors">1. Pourquoi la caisse est stratégique en 2026</a></li>
            <li><a href="#leaders" className="hover:text-teal-600 transition-colors">2. Les leaders : Lightspeed, Zelty, L'Addition</a></li>
            <li><a href="#chaines" className="hover:text-teal-600 transition-colors">3. Solutions chaînes : Innovorder</a></li>
            <li><a href="#nomades" className="hover:text-teal-600 transition-colors">4. Solutions nomades : SumUp, Zettle</a></li>
            <li><a href="#fonctionnalites" className="hover:text-teal-600 transition-colors">5. Fonctionnalités indispensables 2026</a></li>
            <li><a href="#integration" className="hover:text-teal-600 transition-colors">6. Intégrer la caisse à la marge</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="strategique" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">1. Pourquoi la caisse est stratégique en 2026</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            La loi anti-fraude TVA (article 88 LFI 2016, renforcée 2024) impose une <strong>caisse certifiée NF525 ou attestée éditeur</strong>. Mais au-delà de la conformité, votre logiciel est :
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> La source unique de vos ventes (par plat, serveur, service)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Le déclencheur de votre comptabilité (FEC/CSV)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Le cœur de votre pilotage (food cost, marge brute par plat)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Le hub de vos canaux (sur place, click & collect, livraison, QR)</li>
          </ul>
          <div className="border-l-4 border-red-400 bg-red-50 rounded-r-xl p-4">
            <p className="text-sm font-semibold text-red-700">Sans certification NF525</p>
            <p className="text-sm text-red-600">Risque de 7 500 € d'amende par caisse non conforme.</p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="leaders" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">2. Les leaders : Lightspeed, Zelty, L'Addition</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Lightspeed Restaurant — 69 à 189 €/mois</strong></p>
          <p className="text-[#374151] leading-relaxed mb-4">
            La Rolls des caisses pour restaurant établi. Cloud natif, multi-établissements, module stocks solide, reporting avancé (cohortes, ventes par heure). Idéal pour groupes premium. Coût élevé pour un indépendant.
          </p>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Zelty — 49 à 89 €/mois</strong></p>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Le meilleur compromis pour 80 % des restaurants français indépendants en 2026.</strong> Solution française, support FR réactif, click & collect natif inclus, connecteurs Deliveroo/Uber Eats/JustEat. Hardware imposé (iPad).
          </p>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>L'Addition — à partir de 39 €/mois</strong></p>
          <p className="text-[#374151] leading-relaxed">
            Très simple à prendre en main, tarif d'entrée attractif. Racheté par Zelty en 2023, l'avenir produit converge avec Zelty. Bon choix pour démarrer simple.
          </p>
        </section>

        {/* Section 3 */}
        <section id="chaines" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Layers className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">3. Solutions chaînes : Innovorder</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Innovorder — 89 à 249 €/mois</strong>
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">
            Spécialiste de la restauration multi-canaux et omnicanal. Bornes de commande, kiosks, click & collect très matures. Excellent pour la restauration rapide ou les chaînes franchisées. Module KDS (Kitchen Display System) puissant.
          </p>
          <p className="text-[#374151] leading-relaxed">
            <strong>Verdict :</strong> la solution de référence pour les chaînes et le fast casual qui industrialise. Surdimensionné pour un indépendant traditionnel.
          </p>
        </section>

        {/* Section 4 */}
        <section id="nomades" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">4. Solutions nomades : SumUp, Zettle</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>SumUp POS (ex-Tiller) — 39 €+/mois + commissions 1,49-2,75 %</strong></p>
          <p className="text-[#374151] leading-relaxed mb-4">
            Hardware tout-en-un (terminal de paiement + caisse), mise en route en 1 journée, pas d'engagement long. Parfait pour démarrer ou pour un food truck. À l'étroit dès qu'on dépasse 60 couverts/service.
          </p>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Zettle by PayPal — 29 €/mois Pro + 1,75 %</strong></p>
          <p className="text-[#374151] leading-relaxed">
            Coût d'entrée le plus bas du marché. Hardware compact, intégration PayPal/Stripe natives. Excellent pour activités saisonnières. Pas pour un restaurant traditionnel à 200 couverts/service.
          </p>
        </section>

        {/* Section 5 */}
        <section id="fonctionnalites" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">5. Fonctionnalités indispensables 2026</h2>
          </div>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Conformité NF525</strong> ou attestation éditeur (non négociable)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Export FEC</strong> compatible expert-comptable (format DGFiP)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Export CSV/Excel</strong> détaillé par plat, jour, service</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Gestion stocks</strong> ou intégration avec module dédié</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Intégrations livraison</strong> Deliveroo, Uber Eats, Just Eat</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Plan de salle dynamique</strong> et KDS pour la cuisine</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Multi-utilisateurs</strong> avec droits différenciés</span></li>
          </ul>
        </section>

        {/* Section 6 */}
        <section id="integration" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">6. Intégrer la caisse à votre marge</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Posséder une excellente caisse ne suffit pas. La caisse vous dit combien vous vendez ; elle ne vous dit <strong>pas</strong> combien vous gagnez. Pour passer du CA à la marge nette, il faut croiser les ventes avec :
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> Les fiches techniques (composition exacte de chaque plat)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> Les coûts d'achat actualisés</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> Les pertes (gaspillage, casse, offerts)</li>
          </ul>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Workflow type avec RestauMargin :</strong></p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100 space-y-1">
            <div>1. Soir → caisse exporte CSV ventes</div>
            <div>2. RestauMargin importe + croise fiches techniques</div>
            <div>3. Matin → dashboard food cost veille + alertes</div>
            <div>4. Décisions opérationnelles sur données fiables</div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "Faut-il acheter ou louer son matériel de caisse ?",
                a: "La location-financement (LOA) est dominante : 50 à 100 €/mois pour un kit complet (terminal + tiroir + imprimante + douchette). Achat direct possible chez SumUp/Zettle (250-450 €)."
              },
              {
                q: "Une caisse iPad est-elle aussi fiable qu'un terminal dédié ?",
                a: "Oui, en 2026. La majorité des leaders (Zelty, L'Addition, Lightspeed) tournent sur iPad ou Android avec une fiabilité équivalente, à condition d'avoir une connexion internet stable et une box de secours 4G."
              },
              {
                q: "Combien de temps pour migrer d'une caisse à une autre ?",
                a: "Comptez 2 à 4 semaines : import du catalogue, formation des équipes, période de test parallèle, bascule définitive. La première semaine de fermeture estivale est un classique."
              },
              {
                q: "Mon expert-comptable peut-il imposer un logiciel précis ?",
                a: "Non, mais il peut facturer plus cher si votre caisse n'exporte pas un FEC propre. Vérifiez la compatibilité avant de signer."
              },
              {
                q: "Quelle caisse pour un restaurant qui ouvre en 2026 ?",
                a: "Pour un restaurant indépendant traditionnel ou bistronomie : Zelty offre le meilleur compromis prix/fonctionnalités/écosystème français. Pour un food truck ou snack : SumUp POS. Pour une chaîne : Innovorder ou Lightspeed."
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
          <h2 className="text-2xl font-bold mb-3">Vos données de caisse méritent un outil qui les transforme en marge</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            RestauMargin s'intègre avec votre logiciel de caisse pour calculer automatiquement food cost, marge brute par plat et alertes en temps réel.
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
