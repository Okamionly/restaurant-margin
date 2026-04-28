import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Calculator, TrendingUp, BarChart3, Sun, Users, Clock, Smartphone, Calendar, ArrowRight } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogTauxOccupation() {
  const faqSchema = buildFAQSchema([
    {
      question: "Différence entre taux d'occupation et taux de remplissage ?",
      answer: "Stricto sensu, taux de remplissage se rapporte à un service donné, taux d'occupation à une période plus longue. Dans la pratique, ils désignent la même mesure."
    },
    {
      question: "Comment calculer pour un restaurant à plusieurs salles ?",
      answer: "Calculez la capacité totale (somme des places) puis appliquez la formule globale. Pour un pilotage fin, suivez aussi le taux par salle (la principale est souvent à 80% pendant que la mezzanine est à 30%)."
    },
    {
      question: "Mon restaurant a un fort take-away, comment l'intégrer ?",
      answer: "Le take-away n'utilise pas de places assises et ne doit pas être intégré au calcul du taux d'occupation. Suivi distinct (CA take-away, panier moyen, commandes), mais il influe sur la rentabilité globale."
    },
    {
      question: "Quel taux viser le premier mois d'ouverture ?",
      answer: "35-50% le premier mois est un bon résultat. La montée en charge prend 3 à 6 mois pour un concept nouveau. Chercher 80% dès le mois 1 ne se voit que sur les buzz médiatiques exceptionnels."
    },
    {
      question: "Faut-il prendre en compte les annulations dans le taux ?",
      answer: "Non. Le taux se calcule sur les couverts effectivement servis, pas sur les réservations. Mais suivez séparément le taux de no-show pour optimiser la politique de réservation."
    }
  ]);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Taux d'occupation restaurant", url: "https://www.restaumargin.fr/blog/taux-occupation-restaurant" }
  ]);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Taux d'occupation restaurant : calcul, benchmarks et 8 leviers pour l'améliorer"
        description="Calculez votre taux d'occupation et RevPASH. Stratégies concrètes pour remplir votre salle et maximiser votre chiffre d'affaires."
        path="/blog/taux-occupation-restaurant"
        type="article"
        schema={[faqSchema, breadcrumbSchema]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Taux d'occupation restaurant : calcul, benchmarks et 8 leviers pour l'améliorer",
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
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/taux-occupation-restaurant"
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
        category="Performance"
        readTime="11 min"
        date="Avril 2026"
        title="Taux d'occupation restaurant : calcul, benchmarks et 8 leviers"
        accentWord="taux d'occupation"
        subtitle="Une salle vide à 13h coûte autant qu'une salle pleine. Passer de 55% à 65% de remplissage peut générer 60 000 à 90 000€ de CA additionnel par an."
      />

      {/* Body */}
      <main className="max-w-[720px] mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          Loyer, salaires, énergie, amortissements : ces charges fixes tombent que vous serviez 20 ou 80 couverts. C'est pour cela que le taux d'occupation est l'un des indicateurs les plus rentables à optimiser. Le CA additionnel a une marge incrémentale très élevée puisqu'il absorbe des charges déjà payées.
        </p>

        {/* Table des matières */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#definition" className="hover:text-teal-600 transition-colors">1. Définition du taux d'occupation</a></li>
            <li><a href="#revpash" className="hover:text-teal-600 transition-colors">2. La formule RevPASH</a></li>
            <li><a href="#benchmarks" className="hover:text-teal-600 transition-colors">3. Benchmarks par type de restaurant</a></li>
            <li><a href="#leviers" className="hover:text-teal-600 transition-colors">4. Les 8 leviers pour améliorer le taux</a></li>
            <li><a href="#cas" className="hover:text-teal-600 transition-colors">5. Cas chiffré : impact d'une hausse de 10%</a></li>
            <li><a href="#rentabilite" className="hover:text-teal-600 transition-colors">6. Taux d'occupation et rentabilité</a></li>
            <li><a href="#suivi" className="hover:text-teal-600 transition-colors">7. Suivre son taux au quotidien</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="definition" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">1. Définition du taux d'occupation</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le taux d'occupation mesure le ratio entre les couverts effectivement servis et la capacité maximale théorique sur une période donnée.
          </p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100">
            Taux d'occupation = (Couverts servis / Couverts disponibles) × 100
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>L'approche professionnelle</strong> intègre la rotation : Couverts disponibles = Places × Rotation moyenne × Services. Exemple : 50 places × 1,5 rotation × 2 services × 6 jours = 900 couverts/semaine.
          </p>
          <p className="text-[#374151] leading-relaxed">
            Les jours fériés et fermetures hebdomadaires sont exclus du calcul. Les terrasses saisonnières ne sont comptées que les mois opérationnels.
          </p>
        </section>

        {/* Section 2 */}
        <section id="revpash" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">2. La formule RevPASH</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le taux d'occupation seul ne tient pas compte de la valeur générée. Le <strong>RevPASH</strong> (Revenue Per Available Seat Hour) le complète.
          </p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100">
            RevPASH = CA / (Nombre de places × Heures d'ouverture)
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Exemple : 50 places, 7h d'ouverture, 4 200€ de CA → RevPASH = 12€/place/heure.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Benchmarks RevPASH :</strong></p>
          <ul className="space-y-2 text-[#374151]">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Café / brunch : 4-7€ moyen, 9-12€ excellent</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Bistrot : 8-12€ moyen, 14-18€ excellent</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Brasserie : 10-15€ moyen, 16-22€ excellent</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Gastronomique : 15-25€ moyen, 28-45€ excellent</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section id="benchmarks" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">3. Benchmarks par type de restaurant</h2>
          </div>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Gastronomique : moyen 45-55%, excellent 65%+</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Bistrot traditionnel : moyen 60-75%, excellent 85%+</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Brasserie : moyen 55-70%, excellent 80%+</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Fast casual : moyen 70-85%, excellent 90%+</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Brunch / café : moyen 80-95%, excellent 100%+ (file)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Pizzeria : moyen 65-80%, excellent 88%+</li>
          </ul>
          <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl p-4">
            <p className="text-sm font-semibold text-amber-700">Le piège du trop plein</p>
            <p className="text-sm text-amber-700">Dépasser 95% nuit à la rentabilité : files, service dégradé, mauvaises notes, turnover en hausse, casse. L'objectif n'est pas le maximum théorique, c'est le maximum soutenable.</p>
          </div>
        </section>

        {/* Section 4 */}
        <section id="leviers" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">4. Les 8 leviers pour améliorer le taux</h2>
          </div>
          <ol className="space-y-3 text-[#374151] list-decimal pl-5 mb-4">
            <li><strong>Optimiser les réservations.</strong> Système en ligne (TheFork, Resy) + confirmation SMS J-1 → no-shows de 20% à 8%. Impact : +5 à +15%.</li>
            <li><strong>Maîtriser le turn over des tables.</strong> Premier seating à 12h00, second à 13h45. Dressage sous 4 minutes. Passer de 1,2 à 1,6 rotation = +33% de couverts.</li>
            <li><strong>Exploiter les terrasses.</strong> +20 à 50% de capacité d'avril à octobre. Demande municipale 3-6 mois à l'avance.</li>
            <li><strong>Investir les créneaux délaissés.</strong> Brunch dominical = 12-18% du CA. Petit-déj, tea time, happy hour, late night.</li>
            <li><strong>Cibler les groupes et privatisations.</strong> 2 privatisations/mois = +6 à 12% de CA. Page dédiée, menus de groupe à 3 prix.</li>
            <li><strong>Plateformes de réservation.</strong> 20-40% des couverts en zone urbaine. Profil complet 15+ photos, réponse aux avis {'>'}90%.</li>
            <li><strong>Click & collect / livraison.</strong> Cuisine "deuxième cuisine" sans place. +10 à 25% de CA pur.</li>
            <li><strong>Réseaux sociaux.</strong> 3 publis Instagram/semaine, 1 TikTok/semaine, réponses Google sous 48h. +15 à 25% de réservations spontanées.</li>
          </ol>
        </section>

        {/* Section 5 */}
        <section id="cas" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <Sun className="w-5 h-5 text-rose-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">5. Cas chiffré : impact d'une hausse de 10%</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Bistrot 50 places, 9 services/semaine, rotation 1,4, ticket 32€. Taux actuel 60% → 378 couverts/semaine, CA 605 000€/an.
          </p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100 space-y-2">
            <div>Hausse à 70% → 441 couverts/semaine</div>
            <div>CA additionnel : +100 800€/an</div>
            <div>Coûts incrémentaux (food cost + extras) : -42 336€</div>
            <div><strong>Marge nette additionnelle : +58 464€/an</strong></div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Une hausse de 10% du taux d'occupation génère 58 000€ de marge nette additionnelle par an. C'est l'équivalent du salaire chargé d'un employé à temps plein, gagné chaque année.
          </p>
        </section>

        {/* Section 6 */}
        <section id="rentabilite" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">6. Taux d'occupation et rentabilité</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>La courbe en S :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> 0-40% : restaurant en perte</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> 40-55% : seuil de rentabilité atteint</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" /> 55-70% : rentabilité progressive</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> 70-85% : zone optimale</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> 85-95% : rendement décroissant</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> 95%+ : risque qualité</li>
          </ul>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100">
            Taux occupation min = Charges fixes / (Couverts dispo × Marge unitaire)<br />
            Marge unitaire = Ticket × (1 - Food cost %)
          </div>
          <p className="text-[#374151] leading-relaxed">
            Exemple : charges fixes 22 000€, 2 600 couverts/mois, ticket 28€, food cost 32% → taux minimum 44,5%. Sous ce seuil, le restaurant perd de l'argent.
          </p>
        </section>

        {/* Section 7 */}
        <section id="suivi" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">7. Suivre son taux au quotidien</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Tableau de bord minimum (quotidien) :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" /> Couverts servis (déj/dîner)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" /> Capacité du jour</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" /> Taux d'occupation, rotation, RevPASH</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" /> No-shows (réservations - arrivées)</li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            <strong>La règle des 13 semaines :</strong> comparez toujours sur 13 semaines glissantes. Lisse les variations saisonnières et détecte les tendances de fond.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "Différence entre taux d'occupation et taux de remplissage ?",
                a: "Stricto sensu, taux de remplissage se rapporte à un service donné, taux d'occupation à une période plus longue. Dans la pratique, ils désignent la même mesure."
              },
              {
                q: "Comment calculer pour un restaurant à plusieurs salles ?",
                a: "Calculez la capacité totale (somme des places) puis appliquez la formule globale. Pour un pilotage fin, suivez aussi le taux par salle (la principale est souvent à 80% pendant que la mezzanine est à 30%)."
              },
              {
                q: "Mon restaurant a un fort take-away, comment l'intégrer ?",
                a: "Le take-away n'utilise pas de places assises et ne doit pas être intégré au calcul du taux d'occupation. Suivi distinct (CA take-away, panier moyen, commandes), mais il influe sur la rentabilité globale."
              },
              {
                q: "Quel taux viser le premier mois d'ouverture ?",
                a: "35-50% le premier mois est un bon résultat. La montée en charge prend 3 à 6 mois pour un concept nouveau. Chercher 80% dès le mois 1 ne se voit que sur les buzz médiatiques exceptionnels."
              },
              {
                q: "Faut-il prendre en compte les annulations dans le taux ?",
                a: "Non. Le taux se calcule sur les couverts effectivement servis, pas sur les réservations. Mais suivez séparément le taux de no-show pour optimiser la politique de réservation."
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
          <h2 className="text-2xl font-bold mb-3">Mesurez et améliorez votre taux d'occupation</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            Tableau de bord automatique du taux d'occupation, RevPASH par service, heatmap des créneaux à fort potentiel et calcul de l'impact financier de chaque amélioration.
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
          <Link to="/blog/augmenter-ticket-moyen-restaurant" className="text-sm text-teal-600 hover:underline">Augmenter le ticket moyen →</Link>
        </div>
      </main>
    </div>
  );
}
