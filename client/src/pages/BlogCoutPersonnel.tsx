import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Users, Calendar, TrendingDown, Wrench, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogCoutPersonnel() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Comment réduire le coût du personnel en restauration (sans licencier)"
        description="Planning optimisé, réduction du turnover, formation, process cuisine : 5 leviers concrets pour réduire votre masse salariale de 10 à 20 % sans sacrifier la qualité."
        path="/blog/reduire-cout-personnel-restaurant"
        type="article"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Comment réduire le coût du personnel en restauration sans licencier",
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
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/reduire-cout-personnel-restaurant"
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
        category="RH & Paie"
        readTime="11 min"
        date="Avril 2026"
        title="Comment réduire le coût du personnel en restauration sans licencier"
        accentWord="coût personnel"
        subtitle="Planning, turnover, formation, process — 5 leviers pour économiser 10 à 20 % sur votre masse salariale dès ce mois-ci."
      />

      {/* Body */}
      <main className="max-w-[720px] mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          Le coût du personnel est le poste le plus difficile à maîtriser en restauration. Contrairement aux matières premières, vous ne pouvez pas simplement changer de fournisseur. Pourtant, dans la plupart des restaurants en difficulté, c'est là que se cachent les marges perdues : non pas dans un gaspillage flagrant, mais dans des heures mal planifiées, des missions mal définies et des process qui font perdre 20 minutes par service.
        </p>

        {/* Table des matières */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#structure" className="hover:text-teal-600 transition-colors">1. Comprendre la structure réelle de votre coût personnel</a></li>
            <li><a href="#planning" className="hover:text-teal-600 transition-colors">2. Optimiser le planning : la méthode par tranches</a></li>
            <li><a href="#turnover" className="hover:text-teal-600 transition-colors">3. Réduire le turnover pour économiser sur le recrutement</a></li>
            <li><a href="#formation" className="hover:text-teal-600 transition-colors">4. Former pour gagner en productivité</a></li>
            <li><a href="#outils" className="hover:text-teal-600 transition-colors">5. Les outils et process qui font gagner du temps en cuisine</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="structure" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">1. La structure réelle du coût personnel</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            La majorité des restaurateurs connaissent leur masse salariale brute — mais pas leur coût total employé, qui inclut les charges patronales (42–45 % du brut), les repas, les heures supplémentaires majorées et les coûts indirects.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-5 mb-4 text-sm text-[#374151] space-y-1">
            <div className="flex justify-between"><span>Salaire brut annuel</span><span className="font-mono font-semibold">22 000 €</span></div>
            <div className="flex justify-between"><span>Charges patronales (43 %)</span><span className="font-mono font-semibold">9 460 €</span></div>
            <div className="flex justify-between"><span>Repas (180 j × 4,15 €)</span><span className="font-mono font-semibold">747 €</span></div>
            <div className="flex justify-between"><span>Heures supp. moyennes</span><span className="font-mono font-semibold">1 200 €</span></div>
            <div className="flex justify-between border-t border-[#E5E7EB] pt-2 mt-2 font-bold text-[#111111]"><span>Coût total employé</span><span className="font-mono">≈ 33 400 €</span></div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Soit <strong>37 % de plus</strong> que le brut affiché. Un restaurant de 6 employés représente environ 200 000 € de coût réel annuel. Le ratio à surveiller : <strong>coût personnel / CA HT</strong>. Objectif : 30–35 % pour une brasserie, 28–32 % pour le fast-casual, 35–40 % pour la gastronomie.
          </p>
        </section>

        {/* Section 2 */}
        <section id="planning" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">2. Optimiser le planning par tranches</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            La plupart des restaurateurs construisent leur planning par habitude plutôt que par analyse des flux réels. Trois étapes :
          </p>
          <ol className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <span>Extrayez vos données de caisse sur 8 semaines : CA par heure, couverts par tranche de 30 minutes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <span>Identifiez les creux : tranches horaires où votre équipe est présente mais le restaurant tourne à moins de 40 % de capacité</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <span>Décalez les prises de poste : 15 min de décalage × 5 jours × 52 semaines = <strong>65 heures économisées</strong> par employé et par an (≈ 1 000 €)</span>
            </li>
          </ol>
          <div className="border-l-4 border-teal-400 bg-teal-50 rounded-r-xl p-4 mb-4">
            <p className="text-sm font-semibold text-teal-700 mb-1">Exemple concret</p>
            <p className="text-sm text-teal-600">Un bistrot de 45 couverts ajuste son planning le mardi et mercredi midi (2 serveurs au lieu de 3 jusqu'à 12h30). Résultat : 104 heures économisées par an, soit <strong>1 600 € nets</strong> sans toucher à la qualité de service.</p>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Autre levier : les <strong>extras en CDDU</strong>. En France, ce contrat permet d'embaucher un serveur pour un seul service. Utilisé intelligemment lors des pics du week-end, il évite de sur-embaucher en CDI pour 2 services hebdomadaires supplémentaires.
          </p>
        </section>

        {/* Section 3 */}
        <section id="turnover" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">3. Réduire le turnover</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            La restauration affiche un turnover de 80 à 120 % par an dans certains segments. Chaque départ coûte entre <strong>2 000 et 4 000 €</strong> (annonce, tri, entretiens, formation, ralentissements). Un restaurant de 8 employés avec 80 % de rotation dépense jusqu'à <strong>25 600 € par an</strong> en coûts de remplacement — souvent sans s'en rendre compte.
          </p>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Leviers de fidélisation les plus efficaces :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            {[
              "Plannings communiqués 2 semaines à l'avance — réduit le stress et les démissions",
              "Repas staff soignés avant le service — coût faible, impact moral fort",
              "Reconnaissance publique des bons services devant l'équipe — coût 0 €",
              "Prime de présence trimestrielle (50–100 €) — bien moins chère qu'un remplacement",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 4 */}
        <section id="formation" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">4. Former pour gagner en productivité</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Un employé bien formé accomplit la même tâche en moins de temps, fait moins d'erreurs et génère moins de gaspillage. Pourtant, la formation est souvent sacrifiée au profit de l'opérationnel immédiat — créant un cercle vicieux.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-5 mb-4">
            <p className="text-sm font-semibold text-[#111111] mb-2">Calcul du ROI d'une formation</p>
            <p className="text-sm text-[#525252]">Un commis qui passe de 8 à 5 minutes pour une garniture économise 3 min × 30 garnitures × 5 services = <strong>75 min/semaine</strong>, soit 65 heures/an ≈ <strong>700 € de valeur créée</strong> pour 30 minutes de formation.</p>
          </div>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Formations les plus rentables :</strong></p>
          <ul className="space-y-2 text-[#374151]">
            {[
              "Mise en place optimisée : organiser le poste pour minimiser les déplacements",
              "Portionnement précis : réduit simultanément le temps de dressage et le food cost",
              "Gestion des pics : protocoles clairs pour les services chargés",
              "Vente additionnelle en salle : +1,5 à 3 € de ticket moyen après 45 min de formation",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-[#374151] text-sm mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            En France, les formations peuvent être financées via les OPCO des CHR (jusqu'à 100 % de prise en charge). Renseignez-vous auprès de votre expert-comptable.
          </p>
        </section>

        {/* Section 5 */}
        <section id="outils" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">5. Outils et process qui font gagner du temps</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Des process bien conçus permettent de faire la même quantité de travail avec moins d'heures — sans toucher aux effectifs.
          </p>
          <p className="text-[#374151] font-semibold mb-2">En cuisine :</p>
          <ul className="space-y-2 text-[#374151] mb-5">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Batch cooking structuré :</strong> préparer les bases 2× par semaine économise jusqu'à 1h30 de travail cuisine par semaine</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Fiches techniques avec poids et timings :</strong> éliminent les hésitations et les erreurs qui ralentissent le service</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>HACCP intégré au planning :</strong> nettoyage pendant les creux, pas après le service</span></li>
          </ul>
          <p className="text-[#374151] font-semibold mb-2">En salle :</p>
          <ul className="space-y-2 text-[#374151] mb-5">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>QR code menu :</strong> supprime 10 à 15 minutes de gestion des menus par service</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Terminal de paiement à table :</strong> réduit le temps d'addition de 2 à 4 min par table, soit 40 à 80 min économisées sur un service de 20 tables</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            RestauMargin vous aide à identifier les plats qui consomment le plus de main-d'œuvre par rapport à leur marge — un indicateur souvent invisible qui permet de rationaliser la carte sans réduire la qualité perçue.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "Peut-on réduire le coût personnel sans licencier ?",
                a: "Oui, dans la majorité des cas. L'optimisation du planning, la réduction du turnover et l'amélioration des process permettent d'économiser 10 à 20 % sur la masse salariale sans aucune suppression de poste. Les licenciements sont le dernier recours, pas le premier."
              },
              {
                q: "Quel ratio coût personnel / CA dois-je viser ?",
                a: "Entre 30 et 35 % pour une brasserie ou un bistrot, 28–32 % pour le fast-casual, 35–40 % pour la gastronomie. Au-delà de 40 % dans un restaurant traditionnel, une restructuration du planning s'impose avant tout autre action."
              },
              {
                q: "Comment mesurer la productivité de mon équipe ?",
                a: "Le meilleur indicateur est le CA par heure travaillée. Comparez ce chiffre semaine après semaine : une hausse indique que votre équipe est plus productive ou que votre planning est mieux calé sur les flux réels."
              },
              {
                q: "Les extras coûtent-ils vraiment moins cher qu'un CDI ?",
                a: "Pas toujours. Un extra en CDDU coûte parfois plus à l'heure (majoration de précarité de 10 %). Mais il évite de payer des heures creuses. L'équilibre dépend de votre profil de fréquentation — analysez vos données avant de décider."
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
          <h2 className="text-2xl font-bold mb-3">Pilotez vos coûts avec des chiffres solides</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            RestauMargin calcule votre prime cost, identifie les plats les plus chronophages et vous alerte quand vos marges dérivent. Des centaines de restaurateurs l'utilisent chaque semaine.
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
          <Link to="/blog/kpi-essentiels-restaurateur" className="text-sm text-teal-600 hover:underline">Les KPI essentiels →</Link>
        </div>
      </main>
    </div>
  );
}
