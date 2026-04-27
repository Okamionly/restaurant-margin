import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Calculator, FileSpreadsheet, TrendingDown, Target, AlertTriangle, ArrowRight } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';

export default function BlogBudgetPrevisionnel() {
  const faqSchema = buildFAQSchema([
    {
      question: "Quand commencer son budget prévisionnel ?",
      answer: "Pour une création, 3 à 6 mois avant l'ouverture avec révision dans les 30 jours après le démarrage. Pour un existant, idéalement en novembre pour l'année suivante avec validation en décembre."
    },
    {
      question: "Combien de temps pour construire un budget prévisionnel ?",
      answer: "2 à 3 jours pleins la première fois, dont 1 journée d'étude (loyers, salaires, ratios sectoriels). Les années suivantes, une journée suffit en partant du précédent."
    },
    {
      question: "Mon comptable peut-il faire mon budget à ma place ?",
      answer: "Il peut vous aider à le mettre en forme, mais il ne peut pas prévoir vos couverts, votre ticket moyen, votre saisonnalité. Le budget doit être co-construit : vous apportez la connaissance terrain, le comptable apporte la rigueur des chiffres."
    },
    {
      question: "Que faire si le réel dévie de 15 % du budget pendant 2 mois ?",
      answer: "Reforecast complet immédiat. Soit le budget était irréaliste (à corriger pour les 10 mois suivants), soit la réalité a changé (nouveau concurrent, perte d'un service midi entreprise) et il faut un plan d'action en 30 jours."
    }
  ]);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Budget prévisionnel restaurant", url: "https://www.restaumargin.fr/blog/budget-previsionnel-restaurant" }
  ]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Budget prévisionnel restaurant : comment le construire et le respecter"
        description="Construisez votre budget prévisionnel restaurant étape par étape : structure, méthode, tableau 12 mois et pilotage mensuel."
        path="/blog/budget-previsionnel-restaurant"
        type="article"
        schema={[faqSchema, breadcrumbSchema]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Budget prévisionnel restaurant : comment le construire et le respecter",
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
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/budget-previsionnel-restaurant"
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
          <span className="inline-flex items-center gap-1.5 text-teal-700 bg-teal-100 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            Gestion financière
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight mb-4">
            Budget prévisionnel restaurant : comment le construire et le respecter
          </h1>
          <p className="text-lg text-[#525252] max-w-[600px] mx-auto mb-8">
            L'outil de pilotage qui transforme l'intuition en décision et l'incertitude en marge de manœuvre.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-[#737373]">
            <span>27 avril 2026</span>
            <span>·</span>
            <span>12 min de lecture</span>
            <span>·</span>
            <span>La rédaction RestauMargin</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-[720px] mx-auto px-4 sm:px-6 pb-24">

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          Sept restaurants sur dix qui ferment dans les trois premières années n'ont jamais construit de budget prévisionnel digne de ce nom. Ils se sont lancés avec un business plan poli pour la banque, puis ont navigué à vue. Le budget prévisionnel n'est pas un document mort : c'est l'outil qui transforme l'intuition en décision et l'incertitude en marge de manœuvre.
        </p>

        {/* Table des matières */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#pourquoi" className="hover:text-teal-600 transition-colors">1. Pourquoi le budget prévisionnel est la base du pilotage</a></li>
            <li><a href="#difference" className="hover:text-teal-600 transition-colors">2. Business plan vs budget prévisionnel</a></li>
            <li><a href="#structure" className="hover:text-teal-600 transition-colors">3. Structure d'un budget prévisionnel</a></li>
            <li><a href="#methode" className="hover:text-teal-600 transition-colors">4. Méthode top-down vs bottom-up</a></li>
            <li><a href="#exemple" className="hover:text-teal-600 transition-colors">5. Exemple complet sur 12 mois</a></li>
            <li><a href="#pilotage" className="hover:text-teal-600 transition-colors">6. Pilotage budget vs réel</a></li>
            <li><a href="#derives" className="hover:text-teal-600 transition-colors">7. Les 5 postes qui dérivent</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="pourquoi" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">1. Pourquoi le budget prévisionnel est la base</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Un restaurant brûle du cash en permanence : loyer, salaires, matières, énergie. Sans projection, vous découvrez les problèmes avec deux mois de retard, quand le tableau de bord comptable arrive. À ce moment-là, la perte est consommée. Le budget prévisionnel inverse cette logique : vous décidez à l'avance ce que doit être le mois prochain, puis vérifiez que la réalité s'y conforme.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Trois bénéfices concrets :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block mt-2 flex-shrink-0" /><span><strong>Anticipation de trésorerie</strong> : voir venir un mois faible (janvier, août) trois semaines avant.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block mt-2 flex-shrink-0" /><span><strong>Discipline d'équipe</strong> : un chef qui sait qu'il a 12 000 € pour le mois ne commande pas comme s'il y avait 15 000 €.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block mt-2 flex-shrink-0" /><span><strong>Crédibilité bancaire</strong> : présenter un suivi budget vs réel double la probabilité d'obtenir un découvert.</span></li>
          </ul>
        </section>

        {/* Section 2 */}
        <section id="difference" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">2. Business plan vs budget prévisionnel</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le <strong>business plan</strong> est un document de vente : il convainc une banque, couvre 3 à 5 ans, n'est jamais réactualisé. Le <strong>budget prévisionnel</strong> est un outil de pilotage : 12 mois glissants, révisé chaque mois, arbitre les décisions du quotidien.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 text-sm text-[#111111] space-y-2">
            <div className="grid grid-cols-3 gap-2 font-bold pb-2 border-b border-[#E5E7EB]">
              <span>Critère</span><span>Business plan</span><span>Budget prévisionnel</span>
            </div>
            <div className="grid grid-cols-3 gap-2"><span>Horizon</span><span>3-5 ans</span><span>12 mois glissants</span></div>
            <div className="grid grid-cols-3 gap-2"><span>Objectif</span><span>Convaincre</span><span>Piloter</span></div>
            <div className="grid grid-cols-3 gap-2"><span>Détail</span><span>Annuel</span><span>Mensuel</span></div>
            <div className="grid grid-cols-3 gap-2"><span>Mise à jour</span><span>Une fois</span><span>Chaque mois</span></div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="structure" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">3. Structure d'un budget prévisionnel</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Un budget prévisionnel restaurant tient en cinq blocs, suivant la logique du compte de résultat.
          </p>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>1. Recettes prévisionnelles</strong> : CA salle midi, salle soir, livraison, événements</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>2. Achats matières</strong> : food cost 28-32 % CA, beverage 28-35 %, spiritueux 18-22 %</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>3. Masse salariale</strong> : bruts + 42 % charges patronales, 30-38 % du CA HT</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>4. Charges fixes</strong> : loyer, énergie, eau, assurances, abonnements, comptable</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>5. Résultat et indicateurs</strong> : EBE, résultat net, marge brute, trésorerie</span></li>
          </ul>
        </section>

        {/* Section 4 */}
        <section id="methode" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">4. Top-down vs bottom-up</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Bottom-up :</strong> partir de la capacité physique et estimer les couverts.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>60 couverts × 2 services × 26 jours = 3 120 capacité</div>
            <div>Taux 55 % = 1 716 couverts × 28 € = 48 048 € HT</div>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Top-down :</strong> partir des charges fixes et de l'objectif de marge.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Charges fixes 18 000 + Salaires 14 000 + EBE 5 000 = 37 000</div>
            <div>CA mini = 37 000 / 0,70 = 52 857 € HT</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Si les deux méthodes convergent à 10 % près, votre budget est crédible. Sinon, soit le ticket est trop ambitieux, soit les charges fixes sont trop lourdes.
          </p>
        </section>

        {/* Section 5 */}
        <section id="exemple" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">5. Exemple sur 12 mois</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Restaurant 60 couverts, urbain, bistronomie, ticket 28 €. Lecture : ce restaurant est juste à l'équilibre sur 12 mois. Janvier, février et août sont structurellement déficitaires. La trésorerie de juin et décembre doit financer ces creux.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-xs text-[#111111] space-y-1 overflow-x-auto">
            <div>Jan: 38 000 CA, EBE -4 700</div>
            <div>Fév: 42 000 CA, EBE -3 300</div>
            <div>Mar: 48 000 CA, EBE -1 200</div>
            <div>Avr: 52 000 CA, EBE +200</div>
            <div>Mai: 56 000 CA, EBE +1 600</div>
            <div>Juin: 58 000 CA, EBE +2 300</div>
            <div>Juil: 54 000 CA, EBE +900</div>
            <div>Août: 36 000 CA, EBE -5 400</div>
            <div>Sept: 52 000 CA, EBE +200</div>
            <div>Oct: 56 000 CA, EBE +1 600</div>
            <div>Nov: 54 000 CA, EBE +900</div>
            <div>Déc: 64 000 CA, EBE +4 400</div>
            <div className="pt-2 font-bold border-t border-[#E5E7EB]">TOTAL: 610 000 CA, EBE -2 500</div>
          </div>
        </section>

        {/* Section 6 */}
        <section id="pilotage" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">6. Pilotage budget vs réel</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Rythme idéal :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>Hebdo</strong> : CA réel vs budget + variance food cost</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>Mensuel</strong> : revue complète ligne par ligne dans les 10 jours</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>Trimestriel</strong> : reforecast complet des 9 mois suivants</span></li>
          </ul>
          <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl p-4 mb-4">
            <p className="text-sm font-semibold text-amber-700">Seuils d'action</p>
            <p className="text-sm text-amber-600">Écart {'>'} 5 % = analyse. Écart {'>'} 10 % = décision. Écart {'>'} 15 % deux mois = reforecast immédiat.</p>
          </div>
        </section>

        {/* Section 7 */}
        <section id="derives" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">7. Les 5 postes qui dérivent</h2>
          </div>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" /><span><strong>Énergie</strong> : 4-6 % du CA en saison. Audit énergétique avant ouverture.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" /><span><strong>Salaires extras</strong> : enveloppe explicite 3-5 % du CA, suivi hebdo.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" /><span><strong>Pertes matières</strong> : inventaire mensuel + écart food cost théorique vs réel.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" /><span><strong>Réparations</strong> : provision 1-2 % du CA en compte épargne dédié.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" /><span><strong>Marketing</strong> : budget annuel + mensuel, ROI mesuré sur chaque action.</span></li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "Quand commencer son budget prévisionnel ?",
                a: "Pour une création, 3 à 6 mois avant l'ouverture avec révision dans les 30 jours après le démarrage. Pour un existant, idéalement en novembre pour l'année suivante avec validation en décembre."
              },
              {
                q: "Combien de temps pour construire un budget prévisionnel ?",
                a: "2 à 3 jours pleins la première fois, dont 1 journée d'étude (loyers, salaires, ratios sectoriels). Les années suivantes, une journée suffit en partant du précédent."
              },
              {
                q: "Mon comptable peut-il faire mon budget à ma place ?",
                a: "Il peut vous aider à le mettre en forme, mais il ne peut pas prévoir vos couverts, votre ticket moyen, votre saisonnalité. Le budget doit être co-construit : vous apportez la connaissance terrain, le comptable apporte la rigueur des chiffres."
              },
              {
                q: "Que faire si le réel dévie de 15 % du budget pendant 2 mois ?",
                a: "Reforecast complet immédiat. Soit le budget était irréaliste (à corriger pour les 10 mois suivants), soit la réalité a changé (nouveau concurrent, perte d'un service midi entreprise) et il faut un plan d'action en 30 jours."
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
          <h2 className="text-2xl font-bold mb-3">Pilotez votre budget en temps réel</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            RestauMargin centralise vos achats, votre food cost et vos marges pour comparer chaque jour le réel au prévu, sans ressaisie.
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
          <Link to="/blog/prevision-ventes-restaurant" className="text-sm text-teal-600 hover:underline">Prévoir ses ventes →</Link>
        </div>
      </main>
    </div>
  );
}
