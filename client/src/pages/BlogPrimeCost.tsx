import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Calculator, TrendingUp, BarChart3, Target, AlertTriangle, LineChart, Zap, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function BlogPrimeCost() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Prime cost en restauration : l'indicateur n°1 de rentabilité (guide 2026)"
        description="Comprenez et maîtrisez le prime cost de votre restaurant. Formule, benchmarks sectoriels et plan d'action pour passer sous les 65%."
        path="/blog/prime-cost-restaurant"
        type="article"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Prime cost en restauration : l'indicateur n°1 de rentabilité (guide 2026)",
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
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/prime-cost-restaurant"
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
            Prime cost en restauration : l'indicateur n°1 de rentabilité
          </h1>
          <p className="text-lg text-[#525252] max-w-[600px] mx-auto mb-8">
            Si vous ne deviez suivre qu'un seul indicateur dans votre restaurant, ce serait celui-ci. Voici comment le calculer, le benchmarker et le faire passer sous 65%.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-[#737373]">
            <span>27 avril 2026</span>
            <span>·</span>
            <span>10 min de lecture</span>
            <span>·</span>
            <span>La rédaction RestauMargin</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-[720px] mx-auto px-4 sm:px-6 pb-24">

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          La National Restaurant Association américaine considère le <strong>prime cost</strong> comme l'indicateur le plus prédictif de la santé d'un restaurant. Plus que le chiffre d'affaires, plus que le nombre de couverts, plus même que la marge brute. Pourquoi ? Parce qu'il agrège les deux postes qui représentent 60 à 70% de vos coûts : le food cost et la masse salariale. Quand le prime cost dépasse 65%, le restaurant est en zone rouge.
        </p>

        {/* Table des matières */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#definition" className="hover:text-teal-600 transition-colors">1. Définition du prime cost</a></li>
            <li><a href="#pourquoi" className="hover:text-teal-600 transition-colors">2. Pourquoi c'est l'indicateur n°1</a></li>
            <li><a href="#formule" className="hover:text-teal-600 transition-colors">3. La formule détaillée avec exemple</a></li>
            <li><a href="#benchmarks" className="hover:text-teal-600 transition-colors">4. Benchmarks par type de restaurant</a></li>
            <li><a href="#leviers" className="hover:text-teal-600 transition-colors">5. Les 2 leviers : food cost et labour cost</a></li>
            <li><a href="#cas-pratique" className="hover:text-teal-600 transition-colors">6. Cas pratique : passer de 72% à 62%</a></li>
            <li><a href="#suivi" className="hover:text-teal-600 transition-colors">7. Suivi mensuel vs annuel</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="definition" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">1. Définition du prime cost</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le prime cost est la somme du coût des matières premières et de la masse salariale, exprimée en pourcentage du chiffre d'affaires.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            Prime Cost = (Food Cost + Labour Cost) / CA × 100
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Food cost</strong> : matières solides + liquides + boissons + épicerie. Hors consommables et produits d'entretien.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Labour cost</strong> : salaires bruts + charges patronales + mutuelle + indemnités. Le coût employeur réel est environ <strong>1,42 fois le brut</strong>.
          </p>
          <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl p-4">
            <p className="text-sm font-semibold text-amber-700">L'erreur classique</p>
            <p className="text-sm text-amber-700">Calculer le labour cost sur le brut uniquement. Un employé à 2 000€ brut coûte 2 840€ à l'entreprise. Sous-estimer ce ratio fait artificiellement baisser le prime cost — jusqu'à la mauvaise surprise du bilan.</p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="pourquoi" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">2. Pourquoi c'est l'indicateur n°1</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">Trois raisons font du prime cost la référence absolue :</p>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
              <span><strong>Il représente 60 à 70% de vos coûts.</strong> Le résultat net visé est de 8-15%, donc le prime cost détermine directement la marge restante.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
              <span><strong>Il est actionnable au quotidien.</strong> Contrairement au loyer (fixe), food cost et labour cost peuvent être optimisés chaque semaine.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
              <span><strong>Il intègre la productivité.</strong> Servir 80 couverts avec 4 personnes vs 7 personnes change tout.</span>
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section id="formule" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">3. La formule détaillée avec exemple</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Cas du Bistrot Léon : CA 65 000€, achats 20 800€, stock initial 4 200€, stock final 3 900€, masse salariale 15 600€ + 6 552€ de charges (42%).
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-2">
            <div>Food cost = 4 200 + 20 800 - 3 900 = 21 100€ → 32,5%</div>
            <div>Labour cost = 15 600 + 6 552 = 22 152€ → 34,1%</div>
            <div>Prime cost = 43 252€ → <strong>66,5%</strong></div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Diagnostic : 66,5%, légèrement au-dessus du seuil critique de 65%. Le restaurant est rentable mais à la marge faible. Une dérive de 2 points et il passe en zone rouge.
          </p>
        </section>

        {/* Section 4 */}
        <section id="benchmarks" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">4. Benchmarks par type de restaurant</h2>
          </div>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Fast-food : prime cost optimal 52-58%, zone rouge {'>'}62%</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Pizzeria / Pasta : 53-60%, zone rouge {'>'}65%</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Bistrot traditionnel : 60-65%, zone rouge {'>'}68%</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Brasserie : 60-67%, zone rouge {'>'}70%</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Gastronomique : 67-78%, zone rouge {'>'}82%</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Café / Coffee shop : 50-60%, zone rouge {'>'}65%</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Food truck : 48-55%, zone rouge {'>'}60%</li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Le gastronomique tolère un prime cost plus haut grâce au ticket moyen (120-300€) et aux marges sur boissons. À l'inverse, un fast-food doit absolument rester sous 58% car ses marges nettes sont faibles (3-7%).
          </p>
        </section>

        {/* Section 5 */}
        <section id="leviers" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">5. Les 2 leviers : food cost et labour cost</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Réduire le food cost :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /> Renégocier les 5 plus gros fournisseurs : -2 à -4%</li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /> Supprimer les plats à marge brute {'<'}65%</li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /> Standardiser les fiches techniques (élimine surdosages)</li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /> Inventaire hebdomadaire (détecte casse, vol, gaspillage)</li>
          </ul>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Réduire le labour cost :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /> Polyvalence cuisine-salle</li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /> Plannings au quart d'heure près</li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /> Préparation à J-1 (moins de monde au coup de feu)</li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /> Réduction des amplitudes (fermer 14h30-18h)</li>
          </ul>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            CA par heure travaillée : Bistrot 45-55€/h · Fast casual 60-80€/h · Gastronomique 80-120€/h
          </div>
        </section>

        {/* Section 6 */}
        <section id="cas-pratique" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">6. Cas pratique : passer de 72% à 62%</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Bistrot Léon en perte (-1 200€/mois). Plan sur 90 jours pour gagner 10 points de prime cost.
          </p>
          <p className="text-[#374151] leading-relaxed mb-2"><strong>Mois 1 — Audit + renégociation</strong></p>
          <p className="text-[#374151] leading-relaxed mb-4">Identification des 8 plats à marge faible. Renégociation viande -3%, fruits/légumes -5%, vin -2%. Inventaire hebdomadaire en place.</p>
          <p className="text-[#374151] leading-relaxed mb-2"><strong>Mois 2 — Refonte carte + plannings</strong></p>
          <p className="text-[#374151] leading-relaxed mb-4">Carte réduite de 30 à 18 plats. Suppression d'un poste de plonge (lave-vaisselle plus performant + polyvalence). Économie : 2 200€/mois.</p>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Mois 3 — Mesure</strong> : food cost à 31%, labour cost à 31%, prime cost à 62%. Résultat : +5 300€/mois (gain net : <strong>+78 000€/an</strong>).</p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 font-mono text-sm text-[#111111]">
            Avant : Prime cost 72%, résultat -1 200€/mois<br />
            Après : Prime cost 62%, résultat +5 300€/mois
          </div>
        </section>

        {/* Section 7 */}
        <section id="suivi" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
              <LineChart className="w-5 h-5 text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">7. Suivi mensuel vs annuel</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Calculer le prime cost une fois par an, c'est trop tard. Si vous découvrez en janvier que votre prime cost de l'année dernière était à 71%, vous avez perdu 12 mois et 30 000 à 60 000€ de marge.
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> <strong>Quotidien</strong> : CA, couverts, ticket moyen</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> <strong>Hebdomadaire</strong> : food cost réel, labour cost prévisionnel</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> <strong>Mensuel</strong> : prime cost complet, marge nette</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> <strong>Trimestriel</strong> : tendances 13 semaines, comparaison N-1</li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Le suivi hebdomadaire permet de détecter une dérive en 2 semaines maximum. C'est exactement ce que propose RestauMargin : la donnée fraîche, à la semaine, pour piloter avant qu'il ne soit trop tard.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "Différence entre prime cost et marge brute ?",
                a: "La marge brute ne tient compte que du food cost. Le prime cost ajoute la masse salariale. Marge brute = (CA - food cost) / CA. Prime cost = (food cost + labour cost) / CA. Le prime cost est plus complet et plus prédictif de la rentabilité."
              },
              {
                q: "Peut-on calculer le prime cost d'un seul plat ?",
                a: "Non, en pratique. Le labour cost est rarement attribuable à un plat précis. On calcule le prime cost à l'échelle du restaurant ou d'un service. Pour un plat, on utilise la marge brute."
              },
              {
                q: "Le prime cost inclut-il les pourboires ?",
                a: "Si les pourboires sont déclarés et reversés via la fiche de paie, ils alourdissent le labour cost. S'ils sont remis en main propre, ils n'apparaissent pas dans la comptabilité et n'impactent pas le prime cost."
              },
              {
                q: "Mon restaurant est saisonnier, quel prime cost viser ?",
                a: "Raisonnez en annuel et non mensuel. En basse saison, le ratio peut grimper à 80% sans drame, à condition que la haute saison descende à 50-55%. La moyenne annuelle reste l'indicateur clé."
              },
              {
                q: "Faut-il intégrer le salaire du dirigeant ?",
                a: "Si le dirigeant se rémunère en salaire (gérant majoritaire EURL ou SASU), oui. S'il se rémunère en dividendes ou TNS forfait, non — mais ajoutez une rémunération de gérant théorique pour comparer avec d'autres restaurants."
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
          <h2 className="text-2xl font-bold mb-3">Pilotez votre prime cost en temps réel</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            Calcul automatique de votre food cost, labour cost et prime cost, comparaison aux benchmarks, alertes en cas de dérive. Le copilote financier qui transforme un restaurant tendu en restaurant rentable.
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
          <Link to="/blog/taux-occupation-restaurant" className="text-sm text-teal-600 hover:underline">Optimiser le taux d'occupation →</Link>
        </div>
      </main>
    </div>
  );
}
