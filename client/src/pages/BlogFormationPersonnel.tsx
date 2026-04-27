import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Users, GraduationCap, Euro, Calendar, ClipboardCheck, ArrowRight } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';

export default function BlogFormationPersonnel() {
  const faqSchema = buildFAQSchema([
    {
      question: "Faut-il payer une formation pendant les heures de travail ?",
      answer: "Si la formation est dans le plan de développement des compétences de l'employeur, oui : c'est du temps de travail rémunéré. Si c'est sur CPF en dehors des heures, non, mais l'employeur peut décider de financer sur le temps de travail."
    },
    {
      question: "Mon employé refuse une formation, puis-je l'imposer ?",
      answer: "Oui pour les formations obligatoires (HACCP, sécurité, adaptation au poste). Non pour celles de développement personnel hors temps de travail. Si refus de formation obligatoire, c'est un motif disciplinaire."
    },
    {
      question: "L'OPCO finance-t-il à 100 % en 2026 ?",
      answer: "Pour les TPE/PME (< 50 salariés) HCR : oui, dans la limite de 25 €/heure et selon les enveloppes annuelles. Faire la demande dès janvier car les enveloppes s'épuisent."
    },
    {
      question: "Combien de jours de formation par an et par salarié ?",
      answer: "Pas d'obligation chiffrée mais bon ratio : 3 à 5 jours par an et par salarié, soit 21 à 35 heures."
    }
  ]);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Formation personnel restauration", url: "https://www.restaumargin.fr/blog/formation-personnel-restauration" }
  ]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Formation du personnel en restauration : obligations, aides et meilleures pratiques 2026"
        description="Financez la formation de vos équipes grâce à l'OPCO et au CPF. Formations prioritaires en 2026 et ROI concret de la montée en compétences."
        path="/blog/formation-personnel-restauration"
        type="article"
        schema={[faqSchema, breadcrumbSchema]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Formation du personnel en restauration : obligations, aides et meilleures pratiques 2026",
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
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/formation-personnel-restauration"
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
          <span className="inline-flex items-center gap-1.5 text-orange-700 bg-orange-100 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            RH
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight mb-4">
            Formation du personnel en restauration : obligations, aides et meilleures pratiques 2026
          </h1>
          <p className="text-lg text-[#525252] max-w-[600px] mx-auto mb-8">
            La formation n'est pas un coût, c'est un investissement qui se rentabilise sur 6 à 12 mois.
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
          Le coût d'un départ en restauration s'élève à 6-8 mois de salaire chargé, soit 18 000 à 25 000 € pour un commis. Pourtant, 62 % des restaurants français ne consacrent aucun budget formel à la formation. Cette équation absurde s'explique par une méconnaissance des dispositifs : OPCO Mobilités, CPF, POEI, AIF. Les financements existent et couvrent 80 à 100 % des coûts.
        </p>

        {/* Table des matières */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#turnover" className="hover:text-teal-600 transition-colors">1. Pourquoi la formation réduit le turnover</a></li>
            <li><a href="#obligations" className="hover:text-teal-600 transition-colors">2. Obligations légales 2026</a></li>
            <li><a href="#financements" className="hover:text-teal-600 transition-colors">3. Financements disponibles</a></li>
            <li><a href="#prioritaires" className="hover:text-teal-600 transition-colors">4. Formations prioritaires en 2026</a></li>
            <li><a href="#roi" className="hover:text-teal-600 transition-colors">5. ROI mesuré : étude de cas</a></li>
            <li><a href="#onboarding" className="hover:text-teal-600 transition-colors">6. Onboarding : les 30 premiers jours</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="turnover" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">1. Réduire le turnover</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Turnover en restauration française : 65 %/an pour la salle, 45 % pour la cuisine, contre 15 % toutes industries. Chaque départ coûte :
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>Recrutement</strong> : 800 à 2 500 € (annonces, intérim)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>Onboarding</strong> : 4-8 semaines à pleine productivité</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>Productivité équipe</strong> : -10 à -20 % pendant la transition</span></li>
          </ul>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            Coût total moyen d'un départ : 14 000 à 22 000 €
          </div>
          <p className="text-[#374151] leading-relaxed">
            Études INSEE 2025 : un salarié formé reste 2,4 fois plus longtemps qu'un non-formé.
          </p>
        </section>

        {/* Section 2 */}
        <section id="obligations" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">2. Obligations légales 2026</h2>
          </div>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" /><span><strong>Adaptation au poste</strong> (L6321-1) : former à tout nouveau matériel et procédure</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" /><span><strong>Entretien pro</strong> tous les 2 ans, état des lieux à 6 ans (sanction : 3 000 € abondement CPF)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" /><span><strong>HACCP</strong> (L233-4) : 14h obligatoires, 200-400 €/personne, finançable OPCO</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" /><span><strong>Sécurité</strong> : incendie, premiers secours, chimiques. SST recommandé en ERP</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" /><span><strong>Plan développement compétences</strong> obligatoire {'>'} 50 salariés</span></li>
          </ul>
        </section>

        {/* Section 3 */}
        <section id="financements" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Euro className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">3. Financements disponibles</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>OPCO Mobilités (ex-AKTO/FAFIH HCR).</strong>
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>TPE/PME ({'<'}50) : 100 % dans la limite de 25 €/h</div>
            <div>Forfait alternance : 8 000-12 000 €/an</div>
            <div>Pro-A : jusqu'à 10 000 € de formation</div>
            <div>CléA : 100 % financé</div>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>CPF</strong> : 500 €/an/salarié (800 € non-qualifiés), plafond 5 000-8 000 €. Astuce employeur : abondement pour orienter vers une formation utile (anglais, sommellerie). Triple effet de levier CPF + OPCO + employeur.
          </p>
          <p className="text-[#374151] leading-relaxed">
            <strong>France Travail</strong> : POEI (pré-embauche, 8 €/h), AFPR (contrats {'<'}12 mois), AIF (reliquat).
          </p>
        </section>

        {/* Section 4 */}
        <section id="prioritaires" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">4. Formations prioritaires 2026</h2>
          </div>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>HACCP (obligatoire)</strong> : 14h, 200-400 €. À renouveler tous les 5 ans.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>Service salle / sommellerie</strong> : 2-5 j, 600-1 200 €. ROI : ticket vin +18-25 %.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>Gestion coûts pour chefs</strong> : 2-3 j, 800-1 500 €. ROI : 3-5 points food cost.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>Accueil et upselling</strong> : 1-2 j, 400-800 €. ROI : +5-12 % ticket moyen.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>Outils digitaux</strong> : 1 j, 200-500 €. ROI : 3-5 h/sem gagnées.</span></li>
          </ul>
        </section>

        {/* Section 5 */}
        <section id="roi" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Euro className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">5. ROI : étude de cas chiffrée</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Restaurant 60 cv, 580 000 € CA, 8 salariés. Plan formation 2026 :
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-xs text-[#111111] space-y-1">
            <div>HACCP recyclage : 700 € → 100 % pris en charge</div>
            <div>Sommellerie 2 serveurs : 1 800 € → 100 %</div>
            <div>Food cost chef : 1 200 € → 100 %</div>
            <div>Upselling 3 serveurs : 2 100 € → 100 %</div>
            <div>Caisse manager : 400 € → 100 %</div>
            <div>Anglais 4 pers : 4 800 € → CPF 3 200 €</div>
            <div className="pt-2 font-bold border-t border-[#E5E7EB]">Total : 11 000 € brut, reste 1 600 €</div>
          </div>
          <div className="border-l-4 border-emerald-400 bg-emerald-50 rounded-r-xl p-4 mb-4">
            <p className="text-sm font-semibold text-emerald-700">Bénéfices 12 mois</p>
            <p className="text-sm text-emerald-600">Turnover 4→2 départs : 28 000 € · Ticket +1,80 € × 18 000 cv : 32 400 € · Food cost -2 pts : 3 480 € · <strong>Total 63 880 €. ROI : 39× le reste à charge. Payback : 3 semaines.</strong></p>
          </div>
        </section>

        {/* Section 6 */}
        <section id="onboarding" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">6. Onboarding 30 jours</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Étude Cornell 2024 : un onboarding structuré multiplie par 2,5 la rétention à 1 an.
          </p>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>Jour 1 — Accueil</strong> : visite, livret, fiche poste, démo matériel, repas équipe</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>Sem 1 — Immersion</strong> : shadowing référent, dégustation plats, HACCP express</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>Sem 2 — Autonomie supervisée</strong> : feedback quotidien (5 min)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>Sem 3 — Intégration</strong> : service complet, premier mini-objectif</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>Sem 4 — Validation</strong> : bilan formel, plan progression 3 mois</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Coût : 200-400 €. Économie potentielle si évite un départ : 14 000-22 000 €.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "Faut-il payer une formation pendant les heures de travail ?",
                a: "Si la formation est dans le plan de développement des compétences de l'employeur, oui : c'est du temps de travail rémunéré. Si c'est sur CPF en dehors des heures, non, mais l'employeur peut décider de financer sur le temps de travail."
              },
              {
                q: "Mon employé refuse une formation, puis-je l'imposer ?",
                a: "Oui pour les formations obligatoires (HACCP, sécurité, adaptation au poste). Non pour celles de développement personnel hors temps de travail. Si refus de formation obligatoire, c'est un motif disciplinaire."
              },
              {
                q: "L'OPCO finance-t-il à 100 % en 2026 ?",
                a: "Pour les TPE/PME (< 50 salariés) HCR : oui, dans la limite de 25 €/heure et selon les enveloppes annuelles. Faire la demande dès janvier car les enveloppes s'épuisent."
              },
              {
                q: "Combien de jours de formation par an et par salarié ?",
                a: "Pas d'obligation chiffrée mais bon ratio : 3 à 5 jours par an et par salarié, soit 21 à 35 heures."
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
          <h2 className="text-2xl font-bold mb-3">Donnez les bons outils à vos équipes</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            RestauMargin équipe vos chefs et managers d'un dashboard simple pour piloter food cost, marges et stocks au quotidien.
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
          <Link to="/blog/strategie-digitale-restaurant" className="text-sm text-teal-600 hover:underline">Stratégie digitale →</Link>
        </div>
      </main>
    </div>
  );
}
