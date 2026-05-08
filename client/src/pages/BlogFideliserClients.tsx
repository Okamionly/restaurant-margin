import { Link } from 'react-router-dom';
import { Heart, Users, TrendingUp, Star, Gift, BarChart2, ArrowRight, CheckCircle } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';

export default function BlogFideliserClients() {
  const faqSchema = buildFAQSchema([
    {
      question: "Quel programme de fidélité choisir pour un petit restaurant ?",
      answer: "Pour un restaurant de moins de 80 couverts, la carte tampon numérique (Fidme, Stampt) est idéale — simple, peu coûteuse (0-20 €/mois). Ajoutez un fichier client pour les anniversaires et vous couvrez 80 % des besoins."
    },
    {
      question: "Comment collecter les emails de mes clients sans les agacer ?",
      answer: "Proposez une valeur claire en échange : 10 % sur la prochaine visite, un dessert offert, ou l'accès à la newsletter événements. Le Wi-Fi conditionnel (email pour connexion) est la méthode la moins intrusive et la plus efficace."
    },
    {
      question: "La fidélisation fonctionne-t-elle pour les restaurants de passage ?",
      answer: "Moins bien qu'en restauration de quartier, mais pas inutile. Concentrez-vous sur Google My Business et les avis en ligne — les touristes consultent massivement avant de choisir. Un fort NPS est votre meilleur levier."
    },
    {
      question: "Combien de temps pour voir les résultats d'un programme de fidélité ?",
      answer: "Comptez 3 mois pour les premières données significatives, 6 mois pour un impact réel sur le CA. Les restaurants qui abandonnent à 2 mois passent à côté des bénéfices. La patience est une condition de succès."
    }
  ]);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Fidéliser ses clients restaurant", url: "https://www.restaumargin.fr/blog/fideliser-clients-restaurant-strategies" }
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Fidéliser ses clients restaurant : programmes et stratégies efficaces en 2026",
    "description": "Carte tampon, CRM, anniversaires, NPS : les stratégies concrètes pour transformer vos clients occasionnels en habitués rentables.",
    "author": { "@type": "Organization", "name": "RestauMargin" },
    "publisher": { "@type": "Organization", "name": "RestauMargin", "url": "https://www.restaumargin.fr" },
    "datePublished": "2026-05-08",
    "dateModified": "2026-05-08",
    "mainEntityOfPage": "https://www.restaumargin.fr/blog/fideliser-clients-restaurant-strategies"
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Fidéliser ses clients restaurant : programmes et stratégies 2026"
        description="Carte tampon, CRM, anniversaires, NPS : les stratégies concrètes pour transformer vos clients occasionnels en habitués rentables et réduire votre coût d'acquisition."
        path="/blog/fideliser-clients-restaurant-strategies"
        type="article"
        schema={[faqSchema, breadcrumbSchema]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Header */}
      <div className="bg-gradient-to-br from-teal-50 to-white dark:from-[#0A0A0A] dark:to-black border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          <div className="flex items-center gap-2 text-sm text-[#737373] dark:text-[#A3A3A3] mb-4">
            <Link to="/blog" className="hover:text-teal-600 transition-colors">Blog</Link>
            <span>/</span>
            <span>Gestion & Stratégie</span>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <Heart className="w-5 h-5 text-teal-600" />
            </div>
            <span className="text-sm font-medium text-teal-600 dark:text-teal-400">Fidélisation client</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#111111] dark:text-white mb-4" style={{ fontFamily: "'Satoshi', sans-serif" }}>
            Fidéliser ses clients restaurant : programmes et stratégies efficaces en 2026
          </h1>
          <p className="text-lg text-[#737373] dark:text-[#A3A3A3] mb-6">
            Acquérir un nouveau client coûte 5 à 7 fois plus cher que de fidéliser un client existant. Voici comment transformer vos clients de passage en ambassadeurs réguliers.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-[#737373] dark:text-[#A3A3A3]">
            <span>8 mai 2026</span>
            <span>·</span>
            <span>8 min de lecture</span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">

        {/* Intro */}
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-2xl p-6 mb-10">
          <p className="text-[#111111] dark:text-white font-medium mb-2">En résumé</p>
          <ul className="space-y-1 text-[#737373] dark:text-[#A3A3A3] text-sm">
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />Un client fidèle dépense 67 % de plus qu'un nouveau client</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />3 types de programmes adaptés à chaque format de restaurant</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />CRM + anniversaires = levier à ROI immédiat</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />4 KPI pour mesurer et piloter votre fidélisation</li>
          </ul>
        </div>

        {/* Table des matières */}
        <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 mb-10">
          <p className="font-semibold text-[#111111] dark:text-white mb-3">Sommaire</p>
          <ol className="space-y-2 text-sm text-teal-600 dark:text-teal-400">
            <li><a href="#pourquoi" className="hover:underline">1. Pourquoi la fidélisation est cruciale en restauration</a></li>
            <li><a href="#programmes" className="hover:underline">2. Les programmes de fidélité qui fonctionnent vraiment</a></li>
            <li><a href="#crm" className="hover:underline">3. Constituer et exploiter sa base de données clients (CRM)</a></li>
            <li><a href="#personnalisation" className="hover:underline">4. Personnalisation et occasions spéciales</a></li>
            <li><a href="#mesurer" className="hover:underline">5. Mesurer le taux de revisite et optimiser</a></li>
          </ol>
        </div>

        {/* Section 1 */}
        <section id="pourquoi" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              1. Pourquoi la fidélisation est cruciale en restauration
            </h2>
          </div>
          <p className="text-[#737373] dark:text-[#A3A3A3] mb-4">
            Un client fidèle dépense en moyenne <strong className="text-[#111111] dark:text-white">67 % de plus</strong> qu'un nouveau client, selon le National Restaurant Association. Sur une année, un habitué qui vient 12 fois à 30 € de ticket moyen représente 360 € de chiffre d'affaires, contre 45 € pour un client qui vient une seule fois.
          </p>
          <p className="text-[#737373] dark:text-[#A3A3A3] mb-4">
            Si votre restaurant fait 200 couverts par semaine et que 30 % sont des habitués, ces 60 clients fidèles génèrent autant que les 140 clients occasionnels. Convertir 10 % de vos clients de passage en habitués peut augmenter votre CA de 15 à 20 % sans dépenser un euro supplémentaire en publicité.
          </p>
          <p className="text-[#737373] dark:text-[#A3A3A3] mb-4">
            En 2026, le contexte inflationniste renforce cet enjeu. Les consommateurs arbitrent davantage leurs sorties. Ils privilégient les enseignes où ils se sentent reconnus, attendus, valorisés. La fidélisation devient un avantage concurrentiel majeur — surtout face aux plateformes de livraison qui commoditisent l'offre.
          </p>
          <div className="bg-[#F5F5F5] dark:bg-[#262626] rounded-xl p-4 border border-[#E5E7EB] dark:border-[#262626]">
            <p className="text-sm font-medium text-[#111111] dark:text-white mb-1">Le bouche-à-oreille</p>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
              30 à 40 % des nouvelles réservations en restauration indépendante viennent du bouche-à-oreille. Un client fidèle recommande 3 fois plus activement qu'un client occasionnel. Investir en fidélisation, c'est aussi investir en acquisition.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="programmes" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <Gift className="w-4 h-4 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              2. Les programmes de fidélité qui fonctionnent vraiment
            </h2>
          </div>

          <h3 className="text-lg font-semibold text-[#111111] dark:text-white mb-2">La carte tampon numérique</h3>
          <p className="text-[#737373] dark:text-[#A3A3A3] mb-4">
            Le classique « 10 cafés achetés = 1 offert » reste efficace quand il est bien calibré. La version numérique (Fidme, Stampt) élimine les cartes perdues et vous donne accès aux données clients. <strong className="text-[#111111] dark:text-white">Règle d'or :</strong> la récompense doit représenter 5 à 10 % de la valeur cumulée des achats.
          </p>

          <h3 className="text-lg font-semibold text-[#111111] dark:text-white mb-2">Le programme à points</h3>
          <p className="text-[#737373] dark:text-[#A3A3A3] mb-4">
            Modulate la valeur des points selon les plats (marge plus élevée = plus de points), les jours creux, ou les montants dépensés. Exemple : 1 point par euro dépensé, 100 points = 5 € de réduction. Un client à 30 €/visite cumule 5 € de réduction en 3 visites — ce qui l'incite à revenir rapidement.
          </p>

          <h3 className="text-lg font-semibold text-[#111111] dark:text-white mb-2">L'abonnement mensuel</h3>
          <p className="text-[#737373] dark:text-[#A3A3A3] mb-4">
            En forte croissance en 2026 : le client paye un forfait mensuel (15-25 €) et bénéficie d'avantages exclusifs (café offert, 15 % de réduction, accès prioritaire). Ce modèle crée un flux de trésorerie prévisible et une fréquentation garantie.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Carte tampon", desc: "Simple, immédiat", cost: "0-20 €/mois", forWho: "Tous restaurants" },
              { label: "Programme points", desc: "Flexible, modulable", cost: "20-80 €/mois", forWho: "Volume moyen/fort" },
              { label: "Abonnement", desc: "Récurrent, prédictible", cost: "50-150 €/mois", forWho: "Restaurants urbains" }
            ].map((item) => (
              <div key={item.label} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                <p className="font-semibold text-[#111111] dark:text-white text-sm mb-1">{item.label}</p>
                <p className="text-xs text-teal-600 mb-2">{item.desc}</p>
                <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">Coût : {item.cost}</p>
                <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">Pour : {item.forWho}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section id="crm" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <Users className="w-4 h-4 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              3. Constituer et exploiter sa base de données clients (CRM)
            </h2>
          </div>
          <p className="text-[#737373] dark:text-[#A3A3A3] mb-4">
            Sans données, pas de fidélisation intelligente. La première étape est de collecter les informations clients de façon éthique et consentie (RGPD oblige en France).
          </p>

          <h3 className="text-lg font-semibold text-[#111111] dark:text-white mb-2">Collecter les données au bon moment</h3>
          <ul className="space-y-2 mb-4">
            {[
              "À la réservation : email + téléphone via TheFork, Sevenrooms, ou votre formulaire web",
              "Au programme de fidélité : prénom, date d'anniversaire, préférences alimentaires",
              "Au paiement : QR code sur l'addition pour s'inscrire en 30 secondes",
              "Sur le Wi-Fi : connexion via email en échange du code Wi-Fi"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[#737373] dark:text-[#A3A3A3] text-sm">
                <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <p className="text-[#737373] dark:text-[#A3A3A3] mb-4">
            Même un tableur Google Sheets structuré est un début : nom, email, fréquence de visite, date de dernière visite, préférences. Avec ces données, vous identifiez vos clients à risque (pas vus depuis 45 jours) et déclenchez une relance ciblée.
          </p>

          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4">
            <p className="text-sm font-semibold text-[#111111] dark:text-white mb-1">Résultat concret</p>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
              Un restaurant parisien de 60 couverts utilisant un CRM basique a réduit son taux de churn de 35 % à 18 % en 6 mois, soit 22 clients supplémentaires par mois.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section id="personnalisation" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <Star className="w-4 h-4 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              4. Personnalisation et occasions spéciales
            </h2>
          </div>
          <p className="text-[#737373] dark:text-[#A3A3A3] mb-4">
            La personnalisation est le levier de fidélisation le plus puissant — et souvent le moins coûteux. Il ne s'agit pas de technologie, mais d'attention.
          </p>

          <h3 className="text-lg font-semibold text-[#111111] dark:text-white mb-2">Les anniversaires : un rituel à ne pas rater</h3>
          <p className="text-[#737373] dark:text-[#A3A3A3] mb-4">
            Envoyer un email ou SMS avec un bon cadeau (dessert offert, verre de vin, réduction 20 %) pour l'anniversaire de vos clients est la stratégie à ROI le plus rapide. Taux de redemption moyen : 40-60 %. Un dessert à 5 € de coût matière pour ramener un client qui va dépenser 30 €, c'est rentable à 600 %.
          </p>
          <p className="text-[#737373] dark:text-[#A3A3A3] mb-4">
            Envoyez le bon 7 jours avant l'anniversaire (pas le jour J), avec une validité de 30 jours pour maximiser la conversion.
          </p>

          <h3 className="text-lg font-semibold text-[#111111] dark:text-white mb-2">Les attentions en salle</h3>
          <p className="text-[#737373] dark:text-[#A3A3A3] mb-4">
            Former votre équipe à mémoriser les réguliers est gratuit et redoutablement efficace. Appeler un client par son prénom, se souvenir qu'il prend son café allongé, lui proposer sa table habituelle — ces micro-attentions créent une relation émotionnelle qu'aucune app ne remplace.
          </p>
          <p className="text-[#737373] dark:text-[#A3A3A3]">
            Créez un « cahier des habitués » partagé entre serveurs : nom, table préférée, boisson habituelle, allergie, dernière visite. 10 minutes de mise à jour par semaine pour un impact considérable.
          </p>
        </section>

        {/* Section 5 */}
        <section id="mesurer" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              5. Mesurer le taux de revisite et optimiser votre stratégie
            </h2>
          </div>
          <p className="text-[#737373] dark:text-[#A3A3A3] mb-6">
            On ne peut améliorer que ce qu'on mesure. Voici les 4 KPI indispensables de votre stratégie de fidélisation.
          </p>

          <div className="space-y-4 mb-6">
            {[
              {
                kpi: "Taux de revisite",
                formule: "(clients venus + d'une fois / total clients uniques) × 100",
                bench: "20-25 % standard • 35-50 % restaurant de quartier • 60 %+ avec programme actif"
              },
              {
                kpi: "Lifetime Value (LTV)",
                formule: "ticket moyen × fréquences annuelles × durée de vie (années)",
                bench: "Exemple : 28 € × 8 × 3 = 672 € de LTV par client"
              },
              {
                kpi: "Net Promoter Score (NPS)",
                formule: "«Sur 0-10, recommanderiez-vous notre restaurant ?»",
                bench: "NPS > 50 = excellent • < 30 = problème de satisfaction à régler"
              },
              {
                kpi: "Coût d'acquisition vs rétention",
                formule: "Dépenses acquisition / nouveaux clients vs dépenses rétention / clients retenus",
                bench: "La rétention est en moyenne 4-7× plus rentable que l'acquisition"
              }
            ].map((item) => (
              <div key={item.kpi} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                <p className="font-semibold text-[#111111] dark:text-white mb-1">{item.kpi}</p>
                <p className="text-sm text-teal-600 dark:text-teal-400 font-mono mb-2">{item.formule}</p>
                <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">{item.bench}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-6" style={{ fontFamily: "'Satoshi', sans-serif" }}>
            FAQ : Fidélisation client restaurant
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Quel programme de fidélité choisir pour un petit restaurant ?",
                a: "Pour un restaurant de moins de 80 couverts, la carte tampon numérique (Fidme, Stampt) est le meilleur départ — simple, peu coûteuse (0-20 €/mois). Ajoutez un fichier client pour les anniversaires et vous couvrez 80 % des besoins."
              },
              {
                q: "Comment collecter les emails de mes clients sans les agacer ?",
                a: "Proposez une valeur claire en échange : 10 % sur la prochaine visite, un dessert offert, ou l'accès aux événements exclusifs. Le Wi-Fi conditionnel est la méthode la moins intrusive et la plus efficace en restauration."
              },
              {
                q: "La fidélisation fonctionne-t-elle pour les restaurants de passage (tourisme) ?",
                a: "Moins bien qu'en restauration de quartier, mais les avis Google et Instagram restent essentiels. Concentrez-vous sur le NPS et un fort taux d'avis positifs — les touristes consultent massivement avant de choisir."
              },
              {
                q: "Combien de temps pour voir les résultats d'un programme de fidélité ?",
                a: "Comptez 3 mois pour les premières données significatives, 6 mois pour un impact réel sur le CA. Les restaurants qui abandonnent à 2 mois passent à côté des bénéfices. La patience est une condition de succès."
              }
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                <p className="font-semibold text-[#111111] dark:text-white mb-2">{item.q}</p>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Satoshi', sans-serif" }}>
            Fidélisez vos clients ET maîtrisez vos marges
          </h2>
          <p className="text-teal-100 mb-6 max-w-xl mx-auto">
            RestauMargin vous aide à suivre votre food cost, vos KPI de performance et la rentabilité de chaque plat en temps réel — pour que chaque habitué soit rentable.
          </p>
          <a
            href="https://www.restaumargin.fr/pricing"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors"
          >
            Découvrir les offres RestauMargin
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Back to blog */}
        <div className="mt-10 pt-8 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
          <Link to="/blog" className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-500 font-medium transition-colors">
            ← Retour au blog
          </Link>
        </div>
      </div>
    </div>
  );
}
