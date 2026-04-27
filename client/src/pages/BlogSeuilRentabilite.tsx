import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Calculator, TrendingUp, AlertTriangle, ArrowRight, BarChart3 } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function BlogSeuilRentabilite() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Calculer le seuil de rentabilité d'un restaurant : guide complet 2026"
        description="Comment calculer le seuil de rentabilité (point mort) de votre restaurant ? Formule, exemples chiffrés, tableau par type d'établissement et leviers d'optimisation."
        path="/blog/seuil-rentabilite-restaurant"
        type="article"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Comment calculer le seuil de rentabilité d'un restaurant (guide complet 2026)",
            "description": "Formule, exemples chiffrés et tableau comparatif pour calculer le seuil de rentabilité de votre restaurant.",
            "datePublished": "2026-04-25",
            "dateModified": "2026-04-27",
            "author": { "@type": "Organization", "name": "La rédaction RestauMargin", "url": "https://www.restaumargin.fr/a-propos" },
            "publisher": {
              "@type": "Organization",
              "name": "RestauMargin",
              "logo": { "@type": "ImageObject", "url": "https://www.restaumargin.fr/icon-512.png" }
            },
            "image": "https://www.restaumargin.fr/images/blog/seuil-rentabilite-restaurant.jpg",
            "inLanguage": "fr-FR",
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/seuil-rentabilite-restaurant",
            "keywords": "seuil de rentabilité restaurant, point mort restaurant, calcul rentabilité restauration, charges fixes restaurant, break-even restaurant, marge sur coût variable",
            "about": [
              { "@type": "Thing", "name": "Seuil de rentabilité" },
              { "@type": "Thing", "name": "Gestion financière restaurant" }
            ]
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
          <Link to="/login" className="text-sm font-medium text-[#525252] hover:text-teal-600 transition-colors">Connexion</Link>
        </div>
      </nav>

      {/* Hero image */}
      <div className="w-full bg-gradient-to-br from-blue-700 to-blue-900 h-56 sm:h-72 flex items-center justify-center relative overflow-hidden">
        <img
          src="/images/blog/seuil-rentabilite-restaurant.jpg"
          alt="Tableau de bord financier d'un restaurant montrant le seuil de rentabilité"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          loading="lazy"
        />
        <div className="relative z-10 text-center px-4">
          <span className="inline-flex items-center gap-1.5 text-blue-200 bg-blue-800/60 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Gestion financière
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight max-w-[620px]">
            Comment calculer le seuil de rentabilité de votre restaurant
          </h1>
        </div>
      </div>

      {/* Meta + tags */}
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center gap-4 text-sm text-[#737373] border-b border-[#E5E7EB]">
        <span>25 avril 2026</span>
        <span>·</span>
        <span>12 min de lecture</span>
        <span>·</span>
        <span>La rédaction RestauMargin</span>
        <div className="flex flex-wrap gap-2 ml-auto">
          {['Finances', 'Point mort', 'Break-even', 'Rentabilité'].map(tag => (
            <span key={tag} className="bg-[#F5F5F5] text-[#525252] text-xs px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      <main className="max-w-[720px] mx-auto px-4 sm:px-6 pb-24 pt-8">

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          <strong>60 % des restaurants ferment dans les trois premières années.</strong> L'une des causes principales n'est pas le manque de clients — c'est de ne pas savoir combien de couverts il faut servir chaque jour pour ne pas perdre d'argent. Ce chiffre s'appelle le <strong>seuil de rentabilité</strong>, et le connaître change tout.
        </p>

        {/* Sommaire */}
        <nav className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#definition" className="hover:text-blue-600 transition-colors">1. Qu'est-ce que le seuil de rentabilité (point mort) ?</a></li>
            <li><a href="#composantes" className="hover:text-blue-600 transition-colors">2. Charges fixes vs charges variables</a></li>
            <li><a href="#formule" className="hover:text-blue-600 transition-colors">3. La formule et le calcul pas à pas</a></li>
            <li><a href="#tableau" className="hover:text-blue-600 transition-colors">4. Tableau par type de restaurant</a></li>
            <li><a href="#reduire" className="hover:text-blue-600 transition-colors">5. Comment réduire votre seuil de rentabilité</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="definition" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Calculator className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">1. Qu'est-ce que le seuil de rentabilité ?</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le <strong>seuil de rentabilité</strong> (aussi appelé <strong>point mort</strong> ou <em>break-even point</em>) est le chiffre d'affaires minimum que votre restaurant doit réaliser pour couvrir l'ensemble de ses charges — ni bénéfice, ni perte.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-red-500 mb-1">En dessous</p>
              <p className="text-sm text-red-600">Vous perdez de l'argent</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-500 mb-1">Au-dessus</p>
              <p className="text-sm text-emerald-600">Vous dégagez du bénéfice</p>
            </div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Selon les études sectorielles 2024–2025, les restaurants français atteignent leur point mort en moyenne vers le <strong>7e ou 8e mois de l'année</strong>. Les plus rentables le franchissent dès le 5e mois. Les plus fragiles ne l'atteignent jamais.
          </p>
        </section>

        {/* Section 2 */}
        <section id="composantes" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">2. Charges fixes vs charges variables</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="font-semibold text-[#111111] mb-3">Charges fixes (ne varient pas)</p>
              <div className="overflow-hidden rounded-xl border border-[#E5E7EB]">
                <table className="w-full text-sm">
                  <thead><tr className="bg-[#F5F5F5]"><th className="text-left px-3 py-2 text-[#111111]">Poste</th><th className="text-right px-3 py-2 text-[#111111]">Fourchette/mois</th></tr></thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {[
                      ['Loyer + charges', '2 000–8 000 €'],
                      ['Salaires CDI', '5 000–20 000 €'],
                      ['Assurances', '300–800 €'],
                      ['Abonnements', '100–500 €'],
                      ['Leasing équipements', '400–2 000 €'],
                      ['Expert-comptable', '200–600 €'],
                    ].map(([p, v]) => (
                      <tr key={p} className="bg-white"><td className="px-3 py-2 text-[#374151]">{p}</td><td className="px-3 py-2 text-right text-[#525252]">{v}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <p className="font-semibold text-[#111111] mb-3">Charges variables (% du CA)</p>
              <div className="overflow-hidden rounded-xl border border-[#E5E7EB]">
                <table className="w-full text-sm">
                  <thead><tr className="bg-[#F5F5F5]"><th className="text-left px-3 py-2 text-[#111111]">Poste</th><th className="text-right px-3 py-2 text-[#111111]">% CA typique</th></tr></thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {[
                      ['Matières premières', '28–35 %'],
                      ['Boissons', '20–30 %'],
                      ['Emballages', '1–3 %'],
                      ['Énergie variable', '3–5 %'],
                      ['Commissions livraison', '15–30 %'],
                    ].map(([p, v]) => (
                      <tr key={p} className="bg-white"><td className="px-3 py-2 text-[#374151]">{p}</td><td className="px-3 py-2 text-right text-[#525252]">{v}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="formule" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Calculator className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">3. La formule pas à pas</h2>
          </div>
          <div className="space-y-4 mb-6">
            {[
              { step: '1', label: 'Taux de marge sur coût variable (MCV)', formula: 'Taux MCV = (CA − Charges variables) / CA × 100' },
              { step: '2', label: 'Seuil de rentabilité', formula: 'Seuil = Charges fixes / Taux MCV' },
              { step: '3', label: 'Point mort en jours', formula: 'Point mort = Seuil annuel / CA annuel × 365' },
            ].map(({ step, label, formula }) => (
              <div key={step} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{step}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#111111] mb-1">{label}</p>
                  <div className="bg-[#F5F5F5] rounded-lg px-4 py-2 font-mono text-sm text-[#374151]">{formula}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Exemple chiffré */}
          <div className="bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-100 rounded-2xl p-5">
            <p className="font-bold text-[#111111] mb-3">Exemple : bistrot parisien 40 couverts</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm mb-3">
                <tbody className="divide-y divide-blue-100">
                  {[
                    ['CA mensuel', '45 000 €'],
                    ['Charges variables (36,1 %)', '16 250 €'],
                    ['Charges fixes totales', '15 930 €'],
                    ['Taux MCV', '63,9 %'],
                  ].map(([k, v]) => (
                    <tr key={k}><td className="py-1.5 text-[#525252]">{k}</td><td className="py-1.5 text-right font-semibold text-[#111111]">{v}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-sm text-[#737373] mb-1">Seuil de rentabilité</p>
              <p className="text-3xl font-extrabold text-blue-700">24 929 €<span className="text-base font-normal text-[#737373]">/mois</span></p>
              <p className="text-xs text-[#737373] mt-1">= 34 couverts/jour sur 40 places (85 % de taux d'occupation)</p>
            </div>
            <p className="text-xs text-[#737373] mt-3 text-center">Point mort annuel : le <strong>21 juillet</strong> (202e jour de l'année)</p>
          </div>
        </section>

        {/* Section 4 — Tableau */}
        <section id="tableau" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">4. Benchmarks par type de restaurant (2026)</h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F5F5] text-[#111111]">
                  <th className="text-left px-4 py-3 font-semibold">Type</th>
                  <th className="text-center px-4 py-3 font-semibold">CA mensuel moy.</th>
                  <th className="text-center px-4 py-3 font-semibold">Charges fixes</th>
                  <th className="text-center px-4 py-3 font-semibold">Taux CV</th>
                  <th className="text-center px-4 py-3 font-semibold text-blue-700">Seuil estimé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {[
                  ['Food truck', '12 000 €', '3 500 €', '42 %', '6 034 €'],
                  ['Pizzeria 40 couverts', '35 000 €', '11 000 €', '38 %', '17 742 €'],
                  ['Bistrot / brasserie', '45 000 €', '16 000 €', '36 %', '25 000 €'],
                  ['Bistronomique', '50 000 €', '14 000 €', '36 %', '21 875 €'],
                  ['Gastronomique', '80 000 €', '35 000 €', '30 %', '50 000 €'],
                  ['Fast casual (QSR)', '60 000 €', '18 000 €', '45 %', '32 727 €'],
                  ['Avec livraison seule', '30 000 €', '10 000 €', '55 %', '22 222 €'],
                ].map(([type, ca, cf, tv, seuil]) => (
                  <tr key={type} className="bg-white hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-4 py-3 font-medium text-[#111111]">{type}</td>
                    <td className="px-4 py-3 text-center text-[#525252]">{ca}</td>
                    <td className="px-4 py-3 text-center text-[#525252]">{cf}</td>
                    <td className="px-4 py-3 text-center text-[#525252]">{tv}</td>
                    <td className="px-4 py-3 text-center font-bold text-blue-700">{seuil}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-start gap-2 mt-3 text-sm text-[#737373]">
            <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
            <span>Les restaurants avec livraison ont un taux CV bien plus élevé (commissions 25–30 %). Leur seuil est souvent sous-estimé.</span>
          </div>
        </section>

        {/* Section 5 */}
        <section id="reduire" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">5. Comment réduire votre seuil</h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB] mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F5F5]">
                  <th className="text-left px-4 py-3 font-semibold text-[#111111]">Action</th>
                  <th className="text-center px-4 py-3 font-semibold text-[#111111]">Impact taux MCV</th>
                  <th className="text-center px-4 py-3 font-semibold text-teal-700">Baisse du seuil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {[
                  ['Food cost −3 pts (32 % → 29 %)', '+3 pts', '−4,7 %'],
                  ['Loyer −500 €/mois', 'Charges fixes ↓', '−783 €'],
                  ['Ticket moyen +2 €', '+1,5 pts', '−2,3 %'],
                  ['Réduire gaspillage à < 2 %', '+1,5 pts', '−2,3 %'],
                  ['Total combiné', '+4,5 pts', '−12 % du seuil'],
                ].map(([action, mcv, baisse], i) => (
                  <tr key={action} className={`${i === 4 ? 'bg-teal-50 font-bold' : 'bg-white hover:bg-[#FAFAFA]'} transition-colors`}>
                    <td className="px-4 py-3 text-[#374151]">{action}</td>
                    <td className="px-4 py-3 text-center text-[#525252]">{mcv}</td>
                    <td className="px-4 py-3 text-center text-teal-700">{baisse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-[#737373]">
            Sur notre bistrot exemple : −12 % du seuil = passer de 24 929 € à 21 938 € requis. Il peut fermer le lundi sans générer de pertes.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
          <div className="space-y-4">
            {[
              { q: 'Quelle différence entre seuil de rentabilité et point mort ?', a: 'Ces deux termes désignent la même réalité : le CA à partir duquel vous ne perdez plus d\'argent. "Point mort" désigne parfois spécifiquement la date du calendrier à partir de laquelle vous devenez rentable.' },
              { q: 'Dois-je calculer en HT ou en TTC ?', a: 'Toujours en HT. La TVA est collectée pour le compte de l\'État — elle n\'appartient pas à votre trésorerie. Travailler en TTC fausse complètement l\'analyse.' },
              { q: 'Comment convertir le seuil en nombre de couverts ?', a: 'Divisez le seuil mensuel par votre ticket moyen. Exemple : 25 000 € ÷ 22 € = 1 136 couverts/mois, soit ≈ 38 couverts/jour sur 30 services.' },
              { q: 'À quelle fréquence recalculer le seuil ?', a: 'À chaque changement majeur (embauche CDI, hausse de loyer, nouveau fournisseur) et a minima chaque trimestre. Le seuil calculé à l\'ouverture est obsolète dès la première année.' },
              { q: 'Mon seuil est atteint : suis-je rentable ?', a: 'Pas encore. Le seuil signifie que vous ne perdez plus d\'argent comptablement. Il ne tient pas compte du remboursement du capital emprunté ni de votre propre rémunération.' },
            ].map(({ q, a }) => (
              <div key={q} className="border border-[#E5E7EB] rounded-xl p-5">
                <p className="font-semibold text-[#111111] mb-2">{q}</p>
                <p className="text-sm text-[#525252] leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Calculez votre seuil de rentabilité en 5 minutes</h2>
          <p className="text-blue-100 mb-6 text-sm max-w-[480px] mx-auto leading-relaxed">
            RestauMargin calcule automatiquement votre seuil de rentabilité, votre point mort en jours et le nombre de couverts quotidiens nécessaires — à partir de vos données réelles.
          </p>
          <a href="https://www.restaumargin.fr/pricing" className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm">
            Essayer gratuitement <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E5E7EB] flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">← Tous les articles</Link>
          <Link to="/blog/fifo-lifo-stocks-restaurant" className="text-sm text-teal-600 hover:underline">FIFO vs LIFO →</Link>
        </div>
      </main>
    </div>
  );
}
