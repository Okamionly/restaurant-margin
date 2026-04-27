import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, TrendingUp, CloudRain, Calendar, BarChart3, Target, ArrowRight } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogPrevisionVentes() {
  const faqSchema = buildFAQSchema([
    {
      question: "Combien d'historique faut-il pour des prévisions fiables ?",
      answer: "3 mois pour démarrer (moyennes mobiles), 12 mois pour intégrer la saisonnalité, 24 mois pour calibrer un modèle de régression précis."
    },
    {
      question: "Quelle météo consulter ?",
      answer: "Météo France, à 4-5 jours d'horizon. Au-delà, la précision baisse fortement. Privilégiez les API gratuites (Open-Meteo) pour automatiser."
    },
    {
      question: "Faut-il prévoir par plat ou par couvert ?",
      answer: "Les deux. Au niveau global : couverts. Au niveau commande matières : par plat, en utilisant le mix-vente moyen des 4 dernières semaines équivalentes."
    },
    {
      question: "Mon restaurant ouvre depuis 1 mois, comment prévoir ?",
      answer: "Utilisez les ratios sectoriels (ticket moyen, taux remplissage) de votre format. Au bout de 4 semaines, basculez en moyennes mobiles. Au bout de 12 semaines, vous aurez vos propres patterns."
    }
  ]);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Prévision des ventes restaurant", url: "https://www.restaumargin.fr/blog/prevision-ventes-restaurant" }
  ]);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Prévision des ventes en restauration : méthodes et outils pour anticiper votre CA"
        description="3 méthodes pour prévoir vos ventes : historique N-1, moyennes mobiles, facteurs externes. Commander juste et staffer juste."
        path="/blog/prevision-ventes-restaurant"
        type="article"
        schema={[faqSchema, breadcrumbSchema]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Prévision des ventes en restauration : méthodes et outils pour anticiper votre CA",
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
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/prevision-ventes-restaurant"
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
        title="Prévision des ventes en restauration : méthodes et outils pour anticiper votre CA"
        accentWord="prévision"
        subtitle="Combien de couverts vendredi prochain ? Si la réponse est &quot;ça dépend&quot;, vous perdez de l'argent chaque semaine."
      />

      {/* Body */}
      <main className="max-w-[720px] mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          Trop de stock le mardi, trop peu d'équipe le samedi, ruptures de plats du jour le dimanche midi : tout vient d'une absence de prévision. Pourtant, les restaurants qui pratiquent un forecast hebdomadaire structuré atteignent une précision de 92 % au bout de six mois. Cet article détaille les trois méthodes éprouvées, les facteurs à intégrer, et un modèle hebdomadaire à dupliquer.
        </p>

        {/* Table des matières */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#enjeu" className="hover:text-teal-600 transition-colors">1. L'enjeu : commander juste, staffer juste</a></li>
            <li><a href="#methodes" className="hover:text-teal-600 transition-colors">2. Les 3 méthodes de prévision</a></li>
            <li><a href="#facteurs" className="hover:text-teal-600 transition-colors">3. Facteurs qui influencent les ventes</a></li>
            <li><a href="#exemple" className="hover:text-teal-600 transition-colors">4. Exemple : vendredi soleil vs pluie</a></li>
            <li><a href="#tableau" className="hover:text-teal-600 transition-colors">5. Modèle de tableau hebdomadaire</a></li>
            <li><a href="#ecart" className="hover:text-teal-600 transition-colors">6. Calculer l'écart prévision/réel (MAPE)</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="enjeu" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">1. L'enjeu : commander et staffer juste</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Une mauvaise prévision coûte sur trois fronts simultanément :
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>Matières</strong> : trop = pertes (4-8 % du food cost). Pas assez = ruptures et clients déçus.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>Main-d'œuvre</strong> : extra appelé pour un service à 50 couverts au lieu de 80 = 110 € jetés.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>Trésorerie</strong> : un stock qui dort 10 jours immobilise du cash.</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Pour un restaurant de 50 couverts à 580 000 € de CA, +5 points de précision = 8 000 à 14 000 € de marge récupérée par an.
          </p>
        </section>

        {/* Section 2 */}
        <section id="methodes" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">2. Les 3 méthodes de prévision</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Méthode 1 : Historique N-1 ajusté.</strong> La plus simple avec 18 mois d'historique.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            Prévision = CA jour N-1 × (1 + inflation) × (1 + croissance)
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Ex : vendredi 15 mai 2025 = 4 200 €. Inflation +3 %, croissance +5 %. Prévision = 4 200 × 1,03 × 1,05 = <strong>4 542 €</strong>.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Méthode 2 : Moyennes mobiles.</strong> Idéale sans 12 mois d'historique.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            Prévision = moyenne (CA des 4 derniers vendredis)
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Méthode 3 : Régression par facteurs.</strong> La plus puissante mais complexe.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            CA prévu = CA base × coef météo × coef saison × coef événement
          </div>
          <p className="text-[#374151] leading-relaxed">
            Ex : 3 800 × 1,15 (soleil) × 1,05 (mai) × 1,08 (concert) = <strong>4 957 €</strong>.
          </p>
        </section>

        {/* Section 3 */}
        <section id="facteurs" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">3. Facteurs qui influencent les ventes</h2>
          </div>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Météo (terrasse été)</strong> : -25 % à +20 %</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Jour de la semaine</strong> : -50 % (lundi) à +60 % (samedi)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Vacances scolaires</strong> : +15 % zone touristique, -10 % zone bureau</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Jours fériés</strong> : +30 % (fête mères) à -40 % (1er mai)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Événements locaux</strong> : +10 % à +50 %</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Grèves transport</strong> : -30 % zones bureau</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Erreur classique : se fier uniquement aux réservations. Sur un restaurant moyen, elles représentent 40-60 % des couverts. Le reste est en walk-in et dépend des facteurs externes.
          </p>
        </section>

        {/* Section 4 */}
        <section id="exemple" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <CloudRain className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">4. Vendredi soleil vs vendredi pluie</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Restaurant urbain avec terrasse 30 places + salle 60 places.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 text-sm text-[#111111] space-y-2">
            <div className="font-bold text-emerald-700">Scénario A — Soleil 24 °C</div>
            <div>Prévision : 180 couverts (terrasse + salle 90 %)</div>
            <div>Planning : 1 chef + 2 commis + 1 plongeur, 1 chef de rang + 3 serveurs</div>
            <div className="font-bold text-blue-700 pt-2 border-t border-[#E5E7EB]">Scénario B — Pluie</div>
            <div>Prévision : 120 couverts (salle 70 %)</div>
            <div>Planning : -1 serveur</div>
          </div>
          <div className="border-l-4 border-emerald-400 bg-emerald-50 rounded-r-xl p-4 mb-4">
            <p className="text-sm font-semibold text-emerald-700">Économie</p>
            <p className="text-sm text-emerald-600">350 € sur un seul service. Sur 2 vendredis pluvieux/mois × 12 = <strong>8 400 € par an</strong>, juste en consultant la météo à 4 jours.</p>
          </div>
        </section>

        {/* Section 5 */}
        <section id="tableau" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">5. Tableau hebdomadaire</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            À remplir tous les dimanches soir pour la semaine suivante.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-xs text-[#111111] space-y-1 overflow-x-auto">
            <div>Lun 19 : 18° nuageux | 60 cv | 1 680 € | -1 commis</div>
            <div>Mar 20 : 20° beau | 80 cv | 2 240 € | Standard</div>
            <div>Mer 21 : 22° marché | 100 cv | 2 800 € | +1 serveur</div>
            <div>Jeu 22 : 23° soleil | 120 cv | 3 360 € | +1 serveur</div>
            <div>Ven 23 : 24° concert | 180 cv | 5 040 € | +1 serv +1 commis</div>
            <div>Sam 24 : 25° soleil | 200 cv | 5 600 € | Maxi</div>
            <div>Dim 25 : 26° orage soir | 110 cv | 3 080 € | -1 serveur soir</div>
            <div className="pt-2 font-bold border-t border-[#E5E7EB]">TOTAL : 850 cv, 23 800 €</div>
          </div>
        </section>

        {/* Section 6 */}
        <section id="ecart" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">6. Calculer l'écart MAPE</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Indicateur de précision : <strong>MAPE</strong> (Mean Absolute Percentage Error).
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            MAPE = moyenne des écarts absolus en %
          </div>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Objectifs réalistes :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span>Mois 1 : 20 % d'erreur</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span>Mois 6 : 12 % d'erreur</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span>Mois 12 : 8 % d'erreur</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Chaque écart {'>'} 15 % doit être analysé : événement raté, météo mal lue, facteur oublié ? L'apprentissage est progressif.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "Combien d'historique faut-il pour des prévisions fiables ?",
                a: "3 mois pour démarrer (moyennes mobiles), 12 mois pour intégrer la saisonnalité, 24 mois pour calibrer un modèle de régression précis."
              },
              {
                q: "Quelle météo consulter ?",
                a: "Météo France, à 4-5 jours d'horizon. Au-delà, la précision baisse fortement. Privilégiez les API gratuites (Open-Meteo) pour automatiser."
              },
              {
                q: "Faut-il prévoir par plat ou par couvert ?",
                a: "Les deux. Au niveau global : couverts. Au niveau commande matières : par plat, en utilisant le mix-vente moyen des 4 dernières semaines équivalentes."
              },
              {
                q: "Mon restaurant ouvre depuis 1 mois, comment prévoir ?",
                a: "Utilisez les ratios sectoriels (ticket moyen, taux remplissage) de votre format. Au bout de 4 semaines, basculez en moyennes mobiles. Au bout de 12 semaines, vous aurez vos propres patterns."
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
          <h2 className="text-2xl font-bold mb-3">Prévoir, c'est 50 % du job</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            RestauMargin centralise vos prévisions, vos commandes et vos marges dans un seul outil pour piloter en temps réel.
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
          <Link to="/blog/budget-previsionnel-restaurant" className="text-sm text-teal-600 hover:underline">Budget prévisionnel →</Link>
        </div>
      </main>
    </div>
  );
}
