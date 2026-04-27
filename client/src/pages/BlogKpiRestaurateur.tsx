import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, BarChart3, TrendingUp, Users, Star, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogKpiRestaurateur() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Les 10 KPI essentiels pour piloter votre restaurant en 2026"
        description="Food cost, prime cost, RevPASH, ticket moyen… Découvrez les indicateurs clés de performance indispensables pour gérer un restaurant rentable en 2026."
        path="/blog/kpi-essentiels-restaurateur"
        type="article"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Les 10 KPI essentiels pour piloter votre restaurant en 2026",
            "datePublished": "2026-04-24",
            "dateModified": "2026-04-24",
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
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/kpi-essentiels-restaurateur"
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
        category="Pilotage"
        readTime="11 min"
        date="Avril 2026"
        title="Les 10 KPI essentiels pour piloter votre restaurant en 2026"
        accentWord="KPI"
        subtitle="Arrêtez de gérer au feeling. Ces indicateurs transforment votre intuition en certitude — et vos pertes en marges."
      />

      {/* Body */}
      <main className="max-w-[720px] mx-auto px-4 sm:px-6 pb-24">

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          Trop de restaurateurs regardent leur compte bancaire le vendredi soir pour savoir si la semaine a été bonne. Résultat : des mauvaises surprises en fin de mois, des décisions prises trop tard et des marges qui s'évaporent. Les KPI (indicateurs clés de performance) changent la donne : ils transforment l'intuition en certitude et le réactif en proactif.
        </p>

        {/* Table des matières */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#food-cost" className="hover:text-teal-600 transition-colors">1. Food Cost Ratio : le roi des KPI restauration</a></li>
            <li><a href="#prime-cost" className="hover:text-teal-600 transition-colors">2. Prime Cost : l'indicateur global de rentabilité</a></li>
            <li><a href="#ticket-moyen" className="hover:text-teal-600 transition-colors">3. Ticket moyen et taux de couverture</a></li>
            <li><a href="#revpash" className="hover:text-teal-600 transition-colors">4. RevPASH : le chiffre que peu de restaurateurs connaissent</a></li>
            <li><a href="#fidelisation" className="hover:text-teal-600 transition-colors">5. Taux de fidélisation et satisfaction client</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="food-cost" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">1. Food Cost Ratio : le roi des KPI</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le food cost ratio mesure la part de votre chiffre d'affaires absorbée par les matières premières. C'est le premier KPI à surveiller — et le plus révélateur.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            Food Cost (%) = (Coût des matières consommées / CA HT) × 100
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Benchmarks 2026 par type de restauration :</strong>
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Gastronomique : 28–32 %</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Brasserie / Bistrot : 30–35 %</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Fast food / Snacking : 25–30 %</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Pizzeria : 22–28 %</li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Un food cost à 40 % quand votre secteur tourne à 30 % signifie que vous perdez 10 € pour 100 € encaissés avant même de payer votre personnel. Les causes classiques : fiches techniques absentes, portionnement non contrôlé, gaspillage non mesuré, prix fournisseurs jamais renégociés. Calculez ce KPI <strong>chaque semaine</strong> — pas chaque mois.
          </p>
        </section>

        {/* Section 2 */}
        <section id="prime-cost" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">2. Prime Cost : l'indicateur global</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le prime cost combine matières premières et coût du personnel (salaires bruts + charges patronales) — les deux postes les plus lourds d'un restaurant.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            Prime Cost (%) = (Food Cost + Coût Personnel) / CA HT × 100
          </div>
          <div className="border-l-4 border-red-400 bg-red-50 rounded-r-xl p-4 mb-4">
            <p className="text-sm font-semibold text-red-700">Seuil critique</p>
            <p className="text-sm text-red-600">Si votre prime cost dépasse 65 %, votre restaurant est structurellement en difficulté. Visez 55–62 %.</p>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Exemple concret : 80 000 € de CA mensuel, 26 000 € de matières, 24 000 € de personnel → prime cost de 62,5 %. Il reste 37,5 % pour le loyer, l'énergie et le bénéfice. Le levier n°1 : optimiser le planning. En restauration, 1 heure de travail inutile par jour et par employé représente 300–400 € par mois. Un planning calé sur vos heures de forte affluence peut réduire le prime cost de 3 à 5 points sans sacrifier la qualité.
          </p>
        </section>

        {/* Section 3 */}
        <section id="ticket-moyen" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">3. Ticket moyen et taux de couverture</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Ces deux KPI mesurent l'intensité d'usage de votre salle et la valeur générée par chaque client.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Ticket moyen = CA / Nombre de couverts</div>
            <div>Taux de couverture = Couverts réels / Capacité théorique × 100</div>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Ce qui compte n'est pas le niveau absolu du ticket moyen, mais la <strong>tendance</strong> : un ticket qui baisse de 3 % sur 4 semaines consécutives est un signal d'alarme. Causes typiques : abandon des entrées/desserts, menu moins premium, upselling insuffisant en salle.
          </p>
          <p className="text-[#374151] leading-relaxed">
            Le taux de couverture idéal tourne autour de 70–80 % sur les services du midi en semaine. En dessous de 50 %, votre modèle économique est sous pression. Au-delà de 90 %, vous risquez de dégrader l'expérience et de perdre des clients faute de place.
          </p>
        </section>

        {/* Section 4 */}
        <section id="revpash" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">4. RevPASH : l'indicateur méconnu</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Emprunté à l'hôtellerie (Revenue Per Available Seat Hour), le RevPASH est l'un des KPI les plus puissants et les moins utilisés en restauration.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            RevPASH = CA / (Nombre de places × Heures d'ouverture)
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Exemple : 40 couverts, 5 heures de service, 3 200 € de CA → RevPASH = <strong>16 €/place/heure</strong>.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">
            Cet indicateur révèle l'efficacité réelle de votre espace. Deux restaurants avec le même ticket moyen peuvent avoir des RevPASH très différents si l'un tourne ses tables 2,5 fois et l'autre 1,8 fois.
          </p>
          <p className="text-[#374151] leading-relaxed">
            <strong>Comment améliorer votre RevPASH :</strong> réduire le temps d'attente entre commande et service, proposer la note dès que le client semble prêt, optimiser la disposition des tables, lancer des formules « lunch rapide » en 45 minutes. Un RevPASH en hausse de 2 € peut représenter 800 à 1 500 € de CA supplémentaire par semaine — sans un seul couvert de plus.
          </p>
        </section>

        {/* Section 5 */}
        <section id="fidelisation" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">5. Fidélisation et satisfaction client</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Acquérir un nouveau client coûte en moyenne <strong>5 à 7 fois plus cher</strong> que de conserver un client existant. Pourtant, la majorité des restaurateurs investissent plus en acquisition qu'en fidélisation.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>KPI de fidélisation à suivre :</strong></p>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
              <span><strong>Taux de retour</strong> : % de clients qui reviennent dans les 90 jours. Objectif : {'>'} 30 %</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
              <span><strong>NPS</strong> : « Sur 10, recommanderiez-vous notre restaurant ? » — Score {'>'} 50 est excellent</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
              <span><strong>Note Google</strong> : chaque étoile supplémentaire peut augmenter le CA de 5 à 9 %</span>
            </li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            La règle des 48h : répondez à chaque avis Google dans les 48 heures. Les restaurateurs qui répondent systématiquement aux avis négatifs ont en moyenne une note Google 0,3 point plus haute — ce qui représente des milliers d'euros de CA annuel supplémentaire.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "Combien de KPI dois-je surveiller simultanément ?",
                a: "Pas plus de 5 à la fois. Un tableau de bord de 20 indicateurs est contre-productif. Commencez par le food cost, le prime cost et le ticket moyen, puis ajoutez les suivants une fois que vous les maîtrisez."
              },
              {
                q: "À quelle fréquence analyser mes KPI ?",
                a: "Food cost et prime cost : hebdomadairement. Ticket moyen et taux de couverture : après chaque service. RevPASH et fidélisation : mensuellement. Un rythme régulier vaut mieux qu'une analyse sporadique très détaillée."
              },
              {
                q: "Mon food cost est à 38 %, est-ce récupérable ?",
                a: "Oui, dans la grande majorité des cas. Commencez par les fiches techniques (portionnement précis), puis auditez vos 5 ingrédients les plus coûteux. Un restaurant sur deux qui optimise ces deux leviers réduit son food cost de 4 à 6 points en 8 semaines."
              },
              {
                q: "Existe-t-il un outil pour calculer ces KPI automatiquement ?",
                a: "RestauMargin centralise tous ces indicateurs : food cost par plat, prime cost, analyse des marges et alertes en temps réel. Vous saisissez vos ingrédients et vos ventes — l'outil calcule tout automatiquement, sans tableur ni erreur."
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
          <h2 className="text-2xl font-bold mb-3">Pilotez vos marges comme un chef étoilé</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            RestauMargin calcule automatiquement vos food cost, prime cost et marges par plat. Des centaines de restaurateurs l'utilisent chaque semaine pour prendre de meilleures décisions.
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
