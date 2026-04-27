import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Scale, Calculator, Users, AlertTriangle, FileText, TrendingUp, ArrowRight } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';

export default function BlogChargesSociales() {
  const faqSchema = buildFAQSchema([
    {
      question: "Le repas du salarié est-il obligatoire en restauration ?",
      answer: "Oui en CCN HCR. L'employeur doit fournir le repas ou verser une indemnité compensatrice. La valeur 2026 est de 4,22 € par repas, à intégrer dans l'avantage en nature."
    },
    {
      question: "La mutuelle HCR est-elle obligatoire ?",
      answer: "Oui, depuis 2016. L'employeur doit prendre en charge au moins 50 % de la cotisation. La mutuelle HCR (HCR Prévoyance) est l'organisme par défaut, mais l'employeur peut choisir un autre organisme avec garanties au moins équivalentes."
    },
    {
      question: "Combien coûte un apprenti par mois en restauration ?",
      answer: "Apprenti 18-20 ans, 1ère année : salaire ~795 €/mois (43 % SMIC) + charges quasi nulles = coût employeur ~830 €/mois. À comparer à un CDI à 2 540 €. Plus aide à l'apprentissage de 6 000 € la première année."
    },
    {
      question: "La réduction Fillon est-elle automatique ?",
      answer: "Elle est automatique via la DSN si votre logiciel de paie est paramétré. Vérifiez chaque mois sur le bulletin URSSAF qu'elle est bien appliquée — ce n'est pas toujours le cas en cas de changement d'effectif ou de statut."
    },
    {
      question: "Que se passe-t-il en cas de contrôle URSSAF ?",
      answer: "Le contrôleur peut remonter sur 3 ans (5 ans si travail dissimulé). Redressements moyens en restauration : 15 000 à 80 000 €. Préparez : DPAE, contrats, fiches de paie, plannings, livre de caisse, déclarations TVA."
    }
  ]);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Charges sociales en restauration", url: "https://www.restaumargin.fr/blog/charges-sociales-restauration" }
  ]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Charges sociales en restauration : guide 2026 (taux, exonérations, URSSAF)"
        description="Maîtrisez vos cotisations sociales en restauration : taux 2026 CCN HCR, réduction Fillon, comparatif CDI/CDD/extras/apprentis."
        path="/blog/charges-sociales-restauration"
        type="article"
        schema={[faqSchema, breadcrumbSchema]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Charges sociales en restauration : guide 2026 (taux, exonérations, URSSAF)",
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
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/charges-sociales-restauration"
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
      <header className="bg-gradient-to-b from-teal-50 to-white pt-16 pb-12 px-4">
        <div className="max-w-[720px] mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-100 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            Juridique
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight mb-4">
            Charges sociales en restauration : guide 2026 (taux, exonérations, URSSAF)
          </h1>
          <p className="text-lg text-[#525252] max-w-[600px] mx-auto mb-8">
            Embaucher au SMIC vous coûte 2 460 € par mois. Taux 2026 CCN HCR, réduction Fillon, fiche de paie détaillée et pièges à éviter.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-[#737373]">
            <span>27 avril 2026</span>
            <span>·</span>
            <span>11 min de lecture</span>
            <span>·</span>
            <span>La rédaction RestauMargin</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-[720px] mx-auto px-4 sm:px-6 pb-24">

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          En restauration, embaucher un cuisinier au SMIC à 1 801,80 € brut vous coûte en réalité <strong>2 460 €</strong> par mois côté employeur. Soit <strong>36,5 % de charges sociales patronales nettes</strong>, après allégements. Sans optimisation, ce ratio peut atteindre 45 %. Quand on sait que la masse salariale représente 32-40 % du chiffre d'affaires, mal piloter ses charges sociales c'est perdre 2 à 3 points de marge nette.
        </p>

        {/* Sommaire */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#vue-densemble" className="hover:text-teal-600 transition-colors">1. Vue d'ensemble : 40-45 % du brut</a></li>
            <li><a href="#cotisations" className="hover:text-teal-600 transition-colors">2. Décomposition des cotisations patronales</a></li>
            <li><a href="#allegements" className="hover:text-teal-600 transition-colors">3. Allégements et exonérations (Fillon)</a></li>
            <li><a href="#fiche-paie" className="hover:text-teal-600 transition-colors">4. Exemple de fiche de paie : cuisinier SMIC</a></li>
            <li><a href="#statuts" className="hover:text-teal-600 transition-colors">5. CDI vs CDD vs extras vs apprentis</a></li>
            <li><a href="#pieges" className="hover:text-teal-600 transition-colors">6. Pièges juridiques à éviter</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="vue-densemble" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <Scale className="w-5 h-5 text-rose-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">1. Vue d'ensemble : 40-45 % du brut</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Pour 100 € de salaire brut versé en restauration :
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Net salarié reçu : ~78 € (après 22 % charges salariales)</div>
            <div>Coût employeur avant Fillon : 140-145 €</div>
            <div>Coût employeur après Fillon : 128-137 €</div>
            <div>Coefficient employeur : 1,28 à 1,45</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            <strong>Spécificités restauration</strong> : CCN HCR avec mutuelle obligatoire, beaucoup de salaires proches du SMIC = forts allégements possibles, recours aux extras/saisonniers, avantages en nature repas, statut spécifique pourboires depuis 2022.
          </p>
        </section>

        {/* Section 2 */}
        <section id="cotisations" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">2. Décomposition des cotisations patronales</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Les <strong>9 grandes familles</strong> de cotisations payées par l'employeur en 2026 :
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Sécu maladie ≤ 2,5 SMIC : 7,00 % | {'>'} 2,5 SMIC : 13,00 %</div>
            <div>Vieillesse plafonnée : 8,55 % (tranche A)</div>
            <div>Vieillesse déplafonnée : 2,02 %</div>
            <div>Agirc-Arrco T1 : 4,72 % + CEG 1,29 %</div>
            <div>Allocations familiales : 3,45 % ou 5,25 %</div>
            <div>AT/MP restauration trad. : ~2,10 %</div>
            <div>Chômage UNEDIC : 4,05 %</div>
            <div>FNAL + CSA + Formation : ~1,6 %</div>
            <div>Prévoyance HCR : 0,38 % + Mutuelle ~25 €/mois</div>
            <div>TOTAL avant allégements : ~42 à 45 %</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Ces taux peuvent évoluer en cours d'année. Vérifiez toujours sur le bulletin officiel URSSAF ou via votre expert-comptable.
          </p>
        </section>

        {/* Section 3 */}
        <section id="allegements" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">3. Allégements et exonérations (Fillon)</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            La <strong>réduction générale des cotisations patronales (ex-Fillon)</strong> est l'allégement le plus puissant. Elle s'applique automatiquement aux salaires inférieurs à <strong>1,6 SMIC</strong> (~2 882 € brut/mois en 2026).
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            Réduction = (T / 0,6) × ((1,6 × SMIC × heures) / brut – 1)
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Avec T = 0,3194 (entreprise {'<'} 50 salariés en 2026). Au niveau du SMIC, la réduction efface ~28-32 % du brut. <strong>Un salarié au SMIC coûte ~37 % de charges au lieu de 45 %.</strong>
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> <strong>Bandeau maladie</strong> : 7 % au lieu de 13 % si rémunération ≤ 2,5 SMIC</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> <strong>Bandeau famille</strong> : 3,45 % au lieu de 5,25 % si ≤ 3,5 SMIC</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> <strong>ZFU-TE</strong> : exonérations larges sur 5 ans en zone franche</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> <strong>Apprentis</strong> : exonérations massives Sécu + chômage + retraite</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> <strong>Pourboires volontaires</strong> exonérés jusqu'au 31/12/2026 (≤ 1,6 SMIC)</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section id="fiche-paie" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">4. Exemple de fiche de paie : cuisinier SMIC</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Cas concret : cuisinier SMIC HCR, 35h/semaine, 169h mensuelles, 2026.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Salaire brut base (169h × 11,88 €) : 2 008 €</div>
            <div>Avantage repas (2 × 4,22 € × 22 j) : 185,68 €</div>
            <div>Brut total : 2 193,68 €</div>
            <div>Cotisations salariales (~22 %) : -481,16 €</div>
            <div>Net imposable : 1 712,52 €</div>
            <div>Net à payer : ~1 627 €</div>
            <div>Charges patronales avant Fillon : +797,97 €</div>
            <div>Réduction Fillon : -540 €</div>
            <div>Charges patronales nettes : +257,97 €</div>
            <div>COÛT EMPLOYEUR TOTAL : 2 451,65 €</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            <strong>Ratio coût/brut = 1,12 fois le brut</strong> au niveau du SMIC après allégements. C'est le plus bas du marché grâce à la réduction Fillon — ce qui rend les recrutements à proximité du SMIC bien plus rentables.
          </p>
        </section>

        {/* Section 5 */}
        <section id="statuts" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">5. CDI vs CDD vs extras vs apprentis</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Pour un même brut de <strong>2 000 €</strong> mensuel :
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>CDI plein temps : ~25-28 % charges → 2 540 €</div>
            <div>CDD {'<'} 3 mois : ~30 % + prime précarité 10 % → 2 800 €</div>
            <div>Extra (CDD usage HCR) : ~28 % → 2 560 €</div>
            <div>Apprenti {'<'} 26 ans : ~5-7 % (exos massives) → 1 250 €</div>
            <div>Contrat pro alternance : ~15 % → 2 100 €</div>
            <div>Stagiaire (gratification) : 0 % si {'<'} 4,35 €/h → 600 €</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Un apprenti coûte <strong>2 fois moins cher</strong> qu'un CDI en équivalent productif. C'est un levier sous-utilisé en restauration. Attention : encadrement, formation, productivité moindre la première année.
          </p>
        </section>

        {/* Section 6 */}
        <section id="pieges" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">6. Pièges juridiques à éviter</h2>
          </div>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Travail dissimulé</strong> : pas de fiche de paie = délit, jusqu'à 3 ans + 45 000 € + redressement URSSAF. Nouveau dispositif 2025 : DPAE temps réel + croisement données de caisse.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Auto-entrepreneur déguisé</strong> : un seul client, horaire imposé, local imposé = requalification CDI + redressement 3 ans + indemnités licenciement abusif.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Heures sup CCN HCR</strong> : 36e-39e +10 %, 40e-43e +20 %, au-delà +50 %. Ne pas majorer = travail dissimulé partiel.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Repas non déclarés</strong> : forfait 2026 = 4,22 € par repas. 2 repas/jour × 22 jours = 185,68 € à intégrer dans le brut.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Pourboires obligatoires</strong> : "service compris" = salaire, pas pourboire. Doivent être déclarés. Seuls les pourboires volontaires sont exonérés.</span>
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "Le repas du salarié est-il obligatoire en restauration ?",
                a: "Oui en CCN HCR. L'employeur doit fournir le repas ou verser une indemnité compensatrice. La valeur 2026 est de 4,22 € par repas, à intégrer dans l'avantage en nature."
              },
              {
                q: "La mutuelle HCR est-elle obligatoire ?",
                a: "Oui, depuis 2016. L'employeur doit prendre en charge au moins 50 % de la cotisation. La mutuelle HCR (HCR Prévoyance) est l'organisme par défaut, mais l'employeur peut choisir un autre organisme avec garanties au moins équivalentes."
              },
              {
                q: "Combien coûte un apprenti par mois en restauration ?",
                a: "Apprenti 18-20 ans, 1ère année : salaire ~795 €/mois (43 % SMIC) + charges quasi nulles = coût employeur ~830 €/mois. À comparer à un CDI à 2 540 €. Plus aide à l'apprentissage de 6 000 € la première année."
              },
              {
                q: "La réduction Fillon est-elle automatique ?",
                a: "Elle est automatique via la DSN si votre logiciel de paie est paramétré. Vérifiez chaque mois sur le bulletin URSSAF qu'elle est bien appliquée — ce n'est pas toujours le cas en cas de changement d'effectif ou de statut."
              },
              {
                q: "Que se passe-t-il en cas de contrôle URSSAF ?",
                a: "Le contrôleur peut remonter sur 3 ans (5 ans si travail dissimulé). Redressements moyens en restauration : 15 000 à 80 000 €. Préparez : DPAE, contrats, fiches de paie, plannings, livre de caisse, déclarations TVA."
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
          <h2 className="text-2xl font-bold mb-3">Pilotez votre masse salariale et votre prime cost</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            RestauMargin intègre vos charges sociales par statut, calcule votre prime cost en temps réel, simule le coût total d'une embauche avec et sans réduction Fillon.
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
