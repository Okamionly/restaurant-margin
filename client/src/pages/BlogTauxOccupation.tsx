import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Calculator, TrendingUp, BarChart3, Sun, Users, Clock, Smartphone, Calendar, ArrowRight, CheckCircle, Target, Percent, Zap, Award, Sparkles, Lightbulb } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import BlogAuthor from '../components/BlogAuthor';
import PublicHeader from '../components/public/PublicHeader';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Taux d'occupation restaurant : calcul, RevPASH et optimisation"
   Mots-clés principaux : taux occupation restaurant, RevPASH
   ~3 200 mots — mode clair, fond blanc, typo lisible, theme W&B + teal-600
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Quelle est la différence entre taux d'occupation et taux de remplissage ?",
    answer: "Stricto sensu, le taux de remplissage se rapporte à un service donné (le déjeuner du mardi par exemple), alors que le taux d'occupation s'apprécie sur une période plus longue (semaine, mois). Dans la pratique professionnelle, les deux termes sont utilisés de manière interchangeable et désignent la même mesure : le ratio entre couverts servis et capacité théorique."
  },
  {
    question: "Quel taux d'occupation viser pour un restaurant bistrot ?",
    answer: "Un bistrot traditionnel doit viser 60-75 % en moyenne hebdomadaire, avec des pointes à 85-90 % le weekend. En dessous de 55 %, la rentabilité est très compromise. Au-delà de 90 %, le service se dégrade et le NPS chute, ce qui ramène mécaniquement le taux dans 6-12 mois."
  },
  {
    question: "Quelle est la différence entre taux d'occupation et rotation des tables ?",
    answer: "Le taux d'occupation mesure le remplissage de la salle. La rotation mesure combien de fois une table est utilisée dans un service. Une rotation de 2 signifie que chaque table accueille deux groupes successifs. Les deux indicateurs se combinent : un restaurant peut être plein (90 %) avec une rotation faible (1,2) ou moyennement rempli (60 %) avec une rotation élevée (2,5)."
  },
  {
    question: "Comment calculer le RevPASH d'un restaurant ?",
    answer: "RevPASH = CA / (Nombre de places assises x Heures d'ouverture). Exemple : un bistrot de 50 places ouvert 7 heures qui fait 4 200 EUR de CA un mercredi a un RevPASH de 12 EUR/place/heure. Cet indicateur, issu du yield management hôtelier, est plus pertinent que le taux d'occupation seul car il intègre la valeur générée."
  },
  {
    question: "Comment calculer pour un restaurant à plusieurs salles ?",
    answer: "Calculez la capacité totale (somme des places de toutes les salles) puis appliquez la formule globale. Pour un pilotage fin, suivez aussi le taux par salle individuellement. Il est fréquent que la salle principale soit à 85 % pendant que la mezzanine plafonne à 30 %, ce qui pose la question de la rentabilité de la seconde salle."
  },
  {
    question: "Mon restaurant a un fort take-away, comment l'intégrer ?",
    answer: "Le take-away n'utilise pas de places assises et ne doit pas être intégré au calcul du taux d'occupation, sinon vous biaiseriez l'indicateur. Suivez-le distinctement (CA take-away, panier moyen, nombre de commandes), mais il influe naturellement sur la rentabilité globale puisqu'il absorbe vos charges fixes de cuisine."
  },
  {
    question: "Quel taux d'occupation viser le premier mois d'ouverture ?",
    answer: "35-50 % le premier mois est un excellent résultat pour un concept nouveau. La montée en charge prend généralement 3 à 6 mois. Chercher 80 % dès le mois 1 n'arrive que sur des ouvertures médias exceptionnelles. Pendant cette phase, focalisez-vous sur la qualité de l'expérience plutôt que sur le volume — le bouche-à-oreille fera le reste."
  },
  {
    question: "Faut-il prendre en compte les annulations dans le taux ?",
    answer: "Non. Le taux se calcule sur les couverts effectivement servis, pas sur les réservations passées. Mais suivez séparément le taux de no-show (réservations non honorées) car il impacte directement votre capacité à optimiser le remplissage : un taux de no-show de 20 % signifie que 1 réservation sur 5 ne se présente pas."
  },
  {
    question: "Comment améliorer son taux d'occupation rapidement ?",
    answer: "Les trois leviers les plus rapides : (1) inscription sur TheFork ou Resy (impact 10-25 % de couverts en 30 jours), (2) confirmation SMS J-1 des réservations (réduit le no-show de 20 à 8 %), (3) optimisation de la grille de seating avec premier seating à 12h00 et second à 13h45 pour augmenter la rotation. Ces trois actions peuvent générer +15 à +25 points de taux en 60 jours."
  },
  {
    question: "Le RevPASH ou le taux d'occupation : lequel privilégier ?",
    answer: "Les deux sont complémentaires. Le taux d'occupation mesure le volume, le RevPASH mesure la valeur. Un restaurant peut avoir un excellent taux (85 %) mais un RevPASH médiocre s'il bracket trop bas. À l'inverse, un gastronomique peut avoir un taux moyen (55 %) mais un RevPASH élevé grâce au ticket moyen. En pratique, pilotez les deux ensemble et arbitrez selon votre stratégie de positionnement."
  }
];

export default function BlogTauxOccupation() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Taux d'occupation restaurant : calcul, RevPASH et 8 leviers (2026)"
        description="Calculez votre taux d'occupation et RevPASH. Benchmarks par type, ratios cibles par service, yield management et cas chiffré 50% vers 75%. Guide complet 2026."
        path="/blog/taux-occupation-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: "Taux d'occupation restaurant", url: 'https://www.restaumargin.fr/blog/taux-occupation-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: "Comment calculer le taux d'occupation et le RevPASH de votre restaurant",
            description: "Méthode pas-à-pas pour mesurer le remplissage de votre restaurant et la valeur générée par place assise.",
            totalTime: 'PT10M',
            tool: ['Carnet de réservations', 'Calculatrice ou tableur', 'Logiciel RestauMargin'],
            step: [
              { '@type': 'HowToStep', name: 'Compter la capacité théorique', text: 'Multipliez le nombre de places assises par la rotation moyenne et le nombre de services dans la période étudiée.' },
              { '@type': 'HowToStep', name: 'Compter les couverts servis', text: 'Relevé précis des couverts effectivement servis sur la même période, en excluant les take-away et livraisons.' },
              { '@type': 'HowToStep', name: 'Calculer le taux', text: "Taux d'occupation = (Couverts servis / Couverts disponibles) x 100." },
              { '@type': 'HowToStep', name: 'Calculer le RevPASH', text: "RevPASH = CA HT / (Nombre de places x Heures d'ouverture). Exprimé en EUR par place et par heure." },
              { '@type': 'HowToStep', name: 'Comparer aux benchmarks', text: 'Confrontez vos résultats aux fourchettes cibles de votre type d\'établissement et identifiez les leviers d\'amélioration prioritaires.' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: "Taux d'occupation restaurant : calcul, RevPASH et 8 leviers pour l'améliorer",
            description: "Guide complet du taux d'occupation et du RevPASH : formules, benchmarks par service, yield management, cas chiffré 50% vers 75%, FAQ 10 questions.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-05-26',
            dateModified: '2026-05-26',
            wordCount: 3200,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/taux-occupation-restaurant' },
          },
        ]}
      />

      {/* ── Navbar ── */}
      <PublicHeader />

      {/* ── Breadcrumbs visibles ── */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Taux d'occupation restaurant</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Performance"
        readTime="15 min"
        date="Mai 2026"
        title="Taux d'occupation restaurant : calcul, RevPASH et 8 leviers"
        accentWord="taux d'occupation"
        subtitle="Une salle vide à 13h coûte autant qu'une salle pleine. Maîtrisez le taux d'occupation, le RevPASH et les benchmarks par service pour transformer chaque place assise en machine à rentabilité."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="15 min" variant="header" />

        {/* ── Encadre formule rapide (featured snippet) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Formules essentielles</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les 4 formules à retenir
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Taux d'occupation (%)</strong> = (Couverts servis / Couverts disponibles) x 100</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Couverts disponibles</strong> = Places x Rotation x Services</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">RevPASH</strong> = CA HT / (Places x Heures d'ouverture)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Rotation</strong> = Couverts servis / Places assises</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Objectifs standards : taux d'occupation 65-80 % en hebdomadaire, RevPASH 10-15 EUR/place/h pour un bistrot, rotation 1,5-2,0 par service.
          </p>
        </div>

        {/* ── Intro ── */}
        <div className="mt-10 space-y-4">
          <p className="text-[#374151] text-lg leading-relaxed">
            Loyer, salaires, énergie, amortissements : ces charges fixes tombent que vous serviez 20 ou 80 couverts. C'est précisément pour cette raison que le taux d'occupation est l'un des indicateurs les plus rentables à optimiser dans un restaurant. Le chiffre d'affaires additionnel a une marge incrémentale extrêmement élevée puisqu'il absorbe des charges déjà payées.
          </p>
          <p className="text-[#374151] leading-relaxed">
            En pratique, passer de 55 % à 65 % de remplissage peut générer 60 000 à 90 000 EUR de CA additionnel par an pour un bistrot de 50 places, dont 60 à 70 % tombe en marge brute. Ce guide complet vous donne toutes les formules, les benchmarks par type d'établissement et par service, les leviers concrets et un cas chiffré détaillé pour passer de 50 % à 75 % d'occupation en 12 mois.
          </p>
        </div>

        {/* ── Table des matieres ── */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#definition', label: "Définition et formule du taux d'occupation" },
              { href: '#rotation', label: 'Taux d\'occupation vs rotation des tables : la confusion classique' },
              { href: '#ratios-service', label: 'Ratios cibles par service (déjeuner, dîner, weekend)' },
              { href: '#revpash', label: 'Le RevPASH : indicateur clé du yield management' },
              { href: '#mesurer', label: 'Mesurer et tracker au quotidien' },
              { href: '#optimisation', label: 'Optimisation : réservations, no-show et walk-in' },
              { href: '#yield', label: 'Yield management appliqué au restaurant' },
              { href: '#cas', label: 'Cas chiffré : passer de 50 % à 75 % d\'occupation' },
              { href: '#benchmarks', label: 'Tableau benchmarks par type de restaurant' },
              { href: '#leviers', label: 'Les 8 leviers prioritaires pour améliorer le taux' },
              { href: '#rentabilite', label: 'Taux d\'occupation et rentabilité : la courbe en S' },
              { href: '#faq', label: 'FAQ : 10 questions fréquentes' },
              { href: '#cta', label: 'Automatiser le suivi avec RestauMargin' },
            ].map((item, i) => (
              <li key={i}>
                <a href={item.href} className="hover:text-teal-600 transition-colors flex items-start gap-2">
                  <span className="text-teal-600 font-semibold min-w-[24px]">{i + 1}.</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article>

        {/* ═════════════ SECTION 1 : Definition ═════════════ */}
        <section id="definition" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">1. Définition et formule du taux d'occupation</h2>
          </div>

          <p className="text-[#374151] leading-relaxed mb-4">
            Le <strong>taux d'occupation restaurant</strong> mesure le ratio entre les couverts effectivement servis et la capacité maximale théorique sur une période donnée. C'est un indicateur de performance directement issu du monde hôtelier (où il mesure le remplissage des chambres) adapté au contexte de la restauration.
          </p>

          <div className="bg-mono-975 rounded-xl p-5 mb-6 font-mono text-sm text-mono-100 border-l-4 border-teal-500">
            <strong className="text-teal-300">Formule simple :</strong><br />
            Taux d'occupation = (Couverts servis / Couverts disponibles) x 100
          </div>

          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>L'approche professionnelle</strong> intègre la notion de rotation. Une table de 4 utilisée deux fois dans un service représente 8 couverts disponibles, pas 4. La formule professionnelle devient donc :
          </p>

          <div className="bg-mono-975 rounded-xl p-5 mb-6 font-mono text-sm text-mono-100 border-l-4 border-purple-500">
            <strong className="text-purple-300">Formule professionnelle :</strong><br />
            Couverts disponibles = Places assises x Rotation moyenne x Nombre de services<br /><br />
            <span className="text-mono-400">Exemple : 50 places x 1,5 rotation x 2 services x 6 jours = <strong className="text-white">900 couverts disponibles/semaine</strong></span>
          </div>

          <p className="text-[#374151] leading-relaxed mb-4">
            Si ce restaurant sert 612 couverts dans la semaine, son taux d'occupation est de <strong>612 / 900 = 68 %</strong>. Si une partie de ces couverts vient du take-away ou de la livraison, ils doivent être exclus du numérateur car ils n'utilisent pas de places assises.
          </p>

          <div className="border-l-4 border-blue-400 bg-blue-50 rounded-r-xl p-5 mt-6">
            <p className="text-sm font-semibold text-blue-900 mb-1">Points d'attention</p>
            <ul className="text-sm text-blue-800 space-y-1 leading-relaxed">
              <li>- Les jours fériés et fermetures hebdomadaires sont exclus du calcul</li>
              <li>- Les terrasses saisonnières ne sont comptées que les mois opérationnels</li>
              <li>- Une table de 4 occupée par 2 personnes compte 2 couverts au numérateur, mais 4 places au dénominateur (sauf si vous bloquez la table)</li>
              <li>- Les enfants en bas âge (chaises hautes) ne sont généralement pas intégrés dans les couverts disponibles</li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Rotation ═════════════ */}
        <section id="rotation" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">2. Taux d'occupation vs rotation des tables</h2>
          </div>

          <p className="text-[#374151] leading-relaxed mb-4">
            C'est la confusion la plus répandue chez les restaurateurs débutants. <strong>Le taux d'occupation et la rotation des tables sont deux indicateurs différents mais complémentaires</strong>. Confondre les deux conduit à des décisions de gestion erronées.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Taux d'occupation</h3>
              </div>
              <p className="text-sm text-emerald-800 leading-relaxed mb-3">
                <strong>Mesure :</strong> le ratio de remplissage de votre salle sur une période.
              </p>
              <p className="text-sm text-emerald-800 leading-relaxed mb-3">
                <strong>Unité :</strong> pourcentage (%)
              </p>
              <p className="text-sm text-emerald-800 leading-relaxed">
                <strong>Question :</strong> ma salle est-elle pleine quand elle est ouverte ?
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-purple-700" />
                <h3 className="font-bold text-purple-900">Rotation des tables</h3>
              </div>
              <p className="text-sm text-purple-800 leading-relaxed mb-3">
                <strong>Mesure :</strong> combien de fois une table est utilisée dans un service.
              </p>
              <p className="text-sm text-purple-800 leading-relaxed mb-3">
                <strong>Unité :</strong> nombre décimal (1,2 ; 1,8 ; 2,5...)
              </p>
              <p className="text-sm text-purple-800 leading-relaxed">
                <strong>Question :</strong> combien de groupes successifs par table dans un service ?
              </p>
            </div>
          </div>

          <p className="text-[#374151] leading-relaxed mt-8 mb-4">
            <strong>Exemple concret pour bien comprendre :</strong> un restaurant de 40 places sert 96 couverts au déjeuner. Le taux d'occupation du service (en supposant un seul service au déjeuner) est de <strong>96 / 40 = 240 %</strong>... ce qui ne veut rien dire. En réalité, ce restaurant a fait une rotation de 2,4 : chaque table a accueilli 2,4 groupes en moyenne sur la durée du service.
          </p>

          <div className="bg-mono-975 rounded-xl p-5 mb-6 font-mono text-sm text-mono-100">
            <strong className="text-teal-300">Formule rotation :</strong><br />
            Rotation = Couverts servis / Nombre de places assises<br /><br />
            <span className="text-mono-400">Exemple : 96 couverts / 40 places = <strong className="text-white">rotation de 2,4</strong></span>
          </div>

          <p className="text-[#374151] leading-relaxed mb-4">
            La rotation est l'indicateur clé pour piloter l'intensité d'un service. Plus elle est élevée, plus vous générez de couverts (donc de CA) sur la même fenêtre temporelle, avec la même équipe et la même cuisine. C'est l'effet de levier le plus puissant en restauration.
          </p>

          <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl p-5">
            <p className="text-sm font-semibold text-amber-900 mb-1">Benchmarks rotation par type</p>
            <ul className="text-sm text-amber-800 space-y-1 leading-relaxed">
              <li>- <strong>Gastronomique :</strong> 1,0 à 1,2 (un seul seating, longue durée)</li>
              <li>- <strong>Bistrot :</strong> 1,4 à 1,8 (un seating principal + walk-in)</li>
              <li>- <strong>Brasserie :</strong> 1,6 à 2,2 (double seating possible)</li>
              <li>- <strong>Pizzeria :</strong> 2,0 à 2,5 (rotation rapide intrinsèque)</li>
              <li>- <strong>Fast casual :</strong> 2,5 à 4,0 (service continu, pas de réservations)</li>
              <li>- <strong>Coffee shop :</strong> 3,0 à 6,0 (consommation rapide, beaucoup de turn over)</li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Ratios par service ═════════════ */}
        <section id="ratios-service" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
              <Sun className="w-6 h-6 text-rose-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">3. Ratios cibles par service</h2>
          </div>

          <p className="text-[#374151] leading-relaxed mb-6">
            Le taux d'occupation moyen masque souvent des réalités très hétérogènes selon les services. Un bistrot à 65 % d'occupation hebdomadaire peut très bien être à 90 % le vendredi soir et à 30 % le mardi midi. Voici les ratios cibles à viser <strong>service par service</strong> pour piloter finement votre rentabilité.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Service</th>
                  <th className="text-center py-3 px-4 font-semibold">Acceptable</th>
                  <th className="text-center py-3 px-4 font-semibold">Cible</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Excellent</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Déjeuner semaine</td><td className="py-3 px-4 text-center">55 %</td><td className="py-3 px-4 text-center text-teal-700 font-semibold">70-90 %</td><td className="py-3 px-4 text-center font-bold text-emerald-700">95 %+</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Dîner semaine</td><td className="py-3 px-4 text-center">45 %</td><td className="py-3 px-4 text-center text-teal-700 font-semibold">60-80 %</td><td className="py-3 px-4 text-center font-bold text-emerald-700">85 %+</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Déjeuner weekend</td><td className="py-3 px-4 text-center">60 %</td><td className="py-3 px-4 text-center text-teal-700 font-semibold">75-90 %</td><td className="py-3 px-4 text-center font-bold text-emerald-700">100 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Dîner weekend</td><td className="py-3 px-4 text-center">65 %</td><td className="py-3 px-4 text-center text-teal-700 font-semibold">85-95 %</td><td className="py-3 px-4 text-center font-bold text-emerald-700">100 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Brunch dominical</td><td className="py-3 px-4 text-center">70 %</td><td className="py-3 px-4 text-center text-teal-700 font-semibold">90-100 %</td><td className="py-3 px-4 text-center font-bold text-emerald-700">100 % + file</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Petit-déj / café</td><td className="py-3 px-4 text-center">40 %</td><td className="py-3 px-4 text-center text-teal-700 font-semibold">55-70 %</td><td className="py-3 px-4 text-center font-bold text-emerald-700">80 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Après-midi / goûter</td><td className="py-3 px-4 text-center">25 %</td><td className="py-3 px-4 text-center text-teal-700 font-semibold">40-55 %</td><td className="py-3 px-4 text-center font-bold text-emerald-700">70 %</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Le déjeuner semaine : le service le plus rentable</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Le service du midi en semaine offre la meilleure marge incrémentale de tous : durée courte (1h30 max), rotation rapide possible (jusqu'à 2,2), ticket moyen plus élevé qu'au café, charges déjà amorties par le dîner du soir. C'est mathématiquement le service où chaque point de taux gagné rapporte le plus.
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              <strong>Cible impérative :</strong> 70-90 % au déjeuner en semaine. En dessous de 55 %, posez-vous sérieusement la question d'une politique commerciale : menu express, formule à prix attractif, partenariats entreprises locales, accord avec une plateforme de tickets restaurant.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Le dîner semaine : le défi de la fréquentation</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Le dîner en semaine (mardi-mercredi-jeudi) est le service le plus fragile pour la plupart des restaurants traditionnels. Les clients privilégient le dîner à la maison ou la livraison. Cible réaliste : 60-80 %. Les leviers sont différents : événementiel (soirées à thème), partenariats cultures (avant/après spectacle), abonnement bistronomique mensuel.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Le weekend : maximiser l'absorption</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Vendredi soir, samedi midi/soir, dimanche midi : ces 4 services concentrent souvent 50-60 % du chiffre d'affaires hebdomadaire d'un restaurant traditionnel. Cible impérative : 85-95 %. La question n'est plus de remplir mais d'optimiser la rotation et le ticket moyen. Refuser des clients par manque de place est un signal de prospérité, mais aussi une opportunité perdue qui se chiffre rapidement en milliers d'euros.
            </p>
          </div>

          <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl p-5 mt-6">
            <p className="text-sm font-semibold text-amber-900 mb-1">Le piège du trop plein</p>
            <p className="text-sm text-amber-800 leading-relaxed">
              Dépasser systématiquement 95 % nuit à la rentabilité : files d'attente, service dégradé, mauvaises notes Google et TheFork, turnover équipe en hausse, casse de vaisselle. L'objectif n'est jamais le maximum théorique, c'est le <strong>maximum soutenable</strong> dans la durée.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 4 : RevPASH ═════════════ */}
        <section id="revpash" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">4. RevPASH : indicateur clé du yield management</h2>
          </div>

          <p className="text-[#374151] leading-relaxed mb-4">
            Le taux d'occupation seul ne tient pas compte de la valeur générée. Un restaurant peut être plein avec un ticket moyen très bas et un autre moyennement rempli avec un ticket élevé : les deux peuvent générer le même CA, mais leur rentabilité réelle est très différente. Le <strong>RevPASH (Revenue Per Available Seat Hour)</strong> résout ce problème.
          </p>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Définition du RevPASH
            </h3>
            <p className="text-sm text-purple-800 leading-relaxed mb-3">
              Indicateur issu directement du yield management hôtelier (le fameux RevPAR), adapté au restaurant par l'école hôtelière de Cornell University dans les années 1990. Il mesure le chiffre d'affaires généré par place assise et par heure d'ouverture. C'est l'indicateur ultime qui combine taux d'occupation, rotation et ticket moyen en une seule valeur.
            </p>
          </div>

          <div className="bg-mono-975 rounded-xl p-5 mb-6 font-mono text-sm text-mono-100 border-l-4 border-purple-500">
            <strong className="text-purple-300">Formule RevPASH :</strong><br />
            RevPASH = CA HT / (Nombre de places x Heures d'ouverture)<br /><br />
            <span className="text-mono-400">Exemple : 50 places x 7 h d'ouverture = 350 place-heures<br />
            CA du jour = 4 200 EUR HT<br />
            <strong className="text-white">RevPASH = 4 200 / 350 = 12 EUR/place/heure</strong></span>
          </div>

          <h3 className="text-xl font-bold text-mono-100 mb-4 mt-8">Benchmarks RevPASH par type de restaurant</h3>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Type</th>
                  <th className="text-center py-3 px-4 font-semibold">Faible</th>
                  <th className="text-center py-3 px-4 font-semibold">Moyen</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Excellent</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Café / brunch</td><td className="py-3 px-4 text-center">2-4 EUR</td><td className="py-3 px-4 text-center">4-7 EUR</td><td className="py-3 px-4 text-center font-bold text-emerald-700">9-12 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Bistrot</td><td className="py-3 px-4 text-center">5-8 EUR</td><td className="py-3 px-4 text-center">8-12 EUR</td><td className="py-3 px-4 text-center font-bold text-emerald-700">14-18 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Brasserie</td><td className="py-3 px-4 text-center">6-10 EUR</td><td className="py-3 px-4 text-center">10-15 EUR</td><td className="py-3 px-4 text-center font-bold text-emerald-700">16-22 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Pizzeria</td><td className="py-3 px-4 text-center">4-7 EUR</td><td className="py-3 px-4 text-center">7-12 EUR</td><td className="py-3 px-4 text-center font-bold text-emerald-700">15-20 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Gastronomique</td><td className="py-3 px-4 text-center">8-15 EUR</td><td className="py-3 px-4 text-center">15-25 EUR</td><td className="py-3 px-4 text-center font-bold text-emerald-700">28-45 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Fast casual</td><td className="py-3 px-4 text-center">8-12 EUR</td><td className="py-3 px-4 text-center">12-18 EUR</td><td className="py-3 px-4 text-center font-bold text-emerald-700">22-30 EUR</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p className="text-[#374151] leading-relaxed mb-4">
              <strong>Pourquoi cet indicateur est si puissant :</strong> il permet de comparer la performance économique de créneaux horaires très différents. Un déjeuner à 13h peut avoir un RevPASH de 22 EUR/place/heure pendant qu'un service de 15h-17h tombe à 3 EUR/place/heure. Cette analyse temporelle indique exactement quels créneaux méritent un investissement marketing et lesquels ne sont pas rentables.
            </p>
          </div>

          <div className="border-l-4 border-purple-400 bg-purple-50 rounded-r-xl p-5">
            <p className="text-sm font-semibold text-purple-900 mb-1">Cas d'usage stratégique du RevPASH</p>
            <p className="text-sm text-purple-800 leading-relaxed">
              Si votre RevPASH moyen est de 8 EUR et que vous ouvrez 7 jours sur 7, calculez le RevPASH de chaque jour séparément. Souvent, le mardi ou le mercredi tombe en dessous de 4 EUR. Question à se poser : est-il rentable de rester ouvert ce jour-là, ou serait-il préférable de fermer (et faire un service ailleurs, comme du traiteur ou de la privé) ? Le RevPASH donne la réponse chiffrée, pas l'intuition.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Mesurer et tracker ═════════════ */}
        <section id="mesurer" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">5. Mesurer et tracker au quotidien</h2>
          </div>

          <p className="text-[#374151] leading-relaxed mb-6">
            Un indicateur qui n'est pas mesuré ne s'améliore pas. Voici le tableau de bord minimum à tenir, soit dans un tableur Excel/Google Sheets, soit dans un outil spécialisé comme RestauMargin.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mb-4">Tableau de bord quotidien</h3>

          <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 mb-6">
            <ul className="space-y-3 text-[#374151]">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div><strong>Couverts servis</strong> par service (déjeuner / dîner) — relevé directement depuis la caisse en fin de service</div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div><strong>Capacité du jour</strong> — places assises ouvertes (terrasse comprise selon météo)</div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div><strong>Taux d'occupation, rotation, RevPASH</strong> par service</div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div><strong>No-shows</strong> (réservations passées - arrivées effectives) — indispensable pour ajuster l'over-booking</div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div><strong>Walk-in</strong> (clients sans réservation acceptés vs refusés) — donnée clé pour dimensionner la politique de réservation</div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div><strong>Refus pour cause de salle pleine</strong> — chaque refus est un manque à gagner direct</div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div><strong>Ticket moyen</strong> par service — pour croiser avec le RevPASH</div>
              </li>
            </ul>
          </div>

          <h3 className="text-xl font-bold text-mono-100 mb-4 mt-8">La règle des 13 semaines glissantes</h3>
          <p className="text-[#374151] leading-relaxed mb-4">
            Comparez toujours sur <strong>13 semaines glissantes</strong> (l'équivalent d'un trimestre). Cette approche présente trois avantages : elle lisse les variations saisonnières (semaines de vacances, ferias, événements), elle détecte les tendances de fond (croissance progressive ou érosion lente), elle facilite la communication interne (chiffre stable, pas de paniques injustifiées sur une mauvaise semaine).
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">
            En complément, gardez un <strong>comparatif année N-1</strong> sur les mêmes semaines pour mesurer la saisonnalité et détecter les changements structurels. Si vous êtes en baisse de 8 % par rapport à l'année dernière à la même date, c'est un signal d'alerte qui mérite investigation (concurrent, événement local, qualité service, prix).
          </p>

          <div className="border-l-4 border-indigo-400 bg-indigo-50 rounded-r-xl p-5">
            <p className="text-sm font-semibold text-indigo-900 mb-1">Fréquence de pilotage</p>
            <ul className="text-sm text-indigo-800 space-y-1 leading-relaxed">
              <li>- <strong>Quotidien :</strong> couverts, taux du jour, no-shows</li>
              <li>- <strong>Hebdomadaire :</strong> taux moyen par service, rotation, RevPASH</li>
              <li>- <strong>Mensuel :</strong> 13 semaines glissantes, comparatif N-1, analyse trends</li>
              <li>- <strong>Trimestriel :</strong> revue stratégique, ajustement de la politique commerciale</li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Optimisation reservations ═════════════ */}
        <section id="optimisation" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-teal-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">6. Optimisation : réservations, no-show et walk-in</h2>
          </div>

          <p className="text-[#374151] leading-relaxed mb-6">
            La gestion intelligente du trio réservations + no-show + walk-in peut à elle seule générer +10 à +20 points de taux d'occupation. Voici les trois piliers à maîtriser.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mb-4">Pilier 1 : un système de réservation en ligne</h3>
          <p className="text-[#374151] leading-relaxed mb-4">
            Si vous ne proposez pas la réservation en ligne, vous perdez automatiquement 15 à 25 % de clients potentiels. Les solutions principales en France :
          </p>
          <ul className="space-y-2 text-[#374151] mb-6 list-disc list-inside">
            <li><strong>TheFork (ex LaFourchette) :</strong> leader, jusqu'à 30 % des couverts urbains, commission 2 EUR/couvert + abonnement</li>
            <li><strong>Resy / OpenTable :</strong> positionnement haut de gamme, audience CSP+, frais variables</li>
            <li><strong>Sevenrooms / Zenchef :</strong> CRM intégré, parfait pour les groupes d'établissements</li>
            <li><strong>Widget natif sur votre site :</strong> Bookline, RestoConnection, Yelp, Reservio — 0 commission mais nécessite trafic web</li>
          </ul>

          <h3 className="text-xl font-bold text-mono-100 mb-4 mt-8">Pilier 2 : réduire les no-show</h3>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le no-show (réservation non honorée sans previsance) est un fléau qui ampute les meilleurs restaurants de 5 à 25 % de leurs couverts. <strong>Les leviers prouvés :</strong>
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Action</th>
                  <th className="text-center py-3 px-4 font-semibold">Coût</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Impact no-show</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Confirmation SMS J-1 (14h)</td><td className="py-3 px-4 text-center">0,06 EUR/SMS</td><td className="py-3 px-4 text-center font-bold text-emerald-700">-50 à -60 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Empreinte CB à la réservation</td><td className="py-3 px-4 text-center">0 EUR</td><td className="py-3 px-4 text-center font-bold text-emerald-700">-60 à -80 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Pénalité annulation tardive (20 EUR/couvert)</td><td className="py-3 px-4 text-center">0 EUR</td><td className="py-3 px-4 text-center font-bold text-emerald-700">-70 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Rappel WhatsApp personnalisé</td><td className="py-3 px-4 text-center">0,02 EUR/msg</td><td className="py-3 px-4 text-center font-bold text-emerald-700">-30 à -40 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Politique "no-show 2 fois = blacklist"</td><td className="py-3 px-4 text-center">0 EUR</td><td className="py-3 px-4 text-center font-bold text-emerald-700">-20 %</td></tr>
              </tbody>
            </table>
          </div>

          <p className="text-[#374151] leading-relaxed mt-6 mb-4">
            <strong>Stratégie recommandée :</strong> SMS J-1 systématique pour tout le monde + empreinte CB pour les groupes 6 personnes et plus, et pour les services très demandés (vendredi/samedi soir). Cette combinaison ramène typiquement le taux de no-show de 20 % à 6-8 %.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mb-4 mt-8">Pilier 3 : exploiter le walk-in</h3>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le walk-in (clients sans réservation) est une variable stratégique. Trop de walk-in signifie que vous ne capturez pas la demande en amont. Pas assez de walk-in signifie que votre vitrine, votre signalétique ou votre attractivité spontanée est faible. <strong>Le bon équilibre :</strong> 20-35 % de walk-in dans les services demandés, 50-70 % en services creux.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Bonnes pratiques walk-in :</strong> tenir toujours 2-3 tables disponibles même en service complet (pour capter les passages), proposer le bar comme zone d'attente avec une boisson, ne jamais refuser sans donner une alternative (rappel d'une heure plus tard, suggestion d'un restaurant partenaire en échange d'un retour ultérieur).
          </p>
        </section>

        {/* ═════════════ SECTION 7 : Yield management ═════════════ */}
        <section id="yield" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-cyan-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">7. Yield management appliqué au restaurant</h2>
          </div>

          <p className="text-[#374151] leading-relaxed mb-4">
            Importé directement de l'hôtellerie et de l'aérien, le <strong>yield management</strong> (ou revenue management) consiste à ajuster dynamiquement vos prix et votre allocation de capacité en fonction de la demande prévue. Longtemps réservé aux chaînes hôtelières, il devient progressivement standard en restauration grâce aux plateformes de réservation.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mb-4 mt-8">Les 4 leviers du yield management resto</h3>

          <div className="grid sm:grid-cols-2 gap-5 mt-6">
            <div className="bg-white border border-mono-900 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="w-5 h-5 text-cyan-600" />
                <h4 className="font-bold text-mono-100">1. Tarification différenciée par créneau</h4>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">
                Menu midi à 19 EUR (forte demande), happy hour 18h-19h à -30 %, dimanche midi à tarif premium. Lisse la demande sur des créneaux moins fréquentés.
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-cyan-600" />
                <h4 className="font-bold text-mono-100">2. Limitation de durée de table</h4>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">
                "Réservation valable 1h30" pour le déjeuner, 2h pour le dîner. Indispensable pour passer d'une rotation 1,3 à 1,8 sans dégrader l'expérience.
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-cyan-600" />
                <h4 className="font-bold text-mono-100">3. Réservation par créneau fixe</h4>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">
                Premier seating 19h00, second seating 21h30. Permet de doubler la rotation soir en bistrot/brasserie. Standard sur les gros restaurants new-yorkais.
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-cyan-600" />
                <h4 className="font-bold text-mono-100">4. Allocation stratégique de la capacité</h4>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">
                Réserver 60 % de la capacité à la réservation en ligne, 25 % aux walk-in, 15 % aux clients VIP / habitués. Ajustable selon le jour.
              </p>
            </div>
          </div>

          <div className="border-l-4 border-cyan-400 bg-cyan-50 rounded-r-xl p-5 mt-8">
            <p className="text-sm font-semibold text-cyan-900 mb-1">Indicateur à suivre absolument</p>
            <p className="text-sm text-cyan-800 leading-relaxed">
              Le <strong>"taux de remplissage résiduel après réservations"</strong> = combien de places restent disponibles 24h avant le service. Si ce chiffre est supérieur à 20 % chaque jour, vous avez un problème d'attractivité. Si inférieur à 5 %, vous laissez tourner le restaurant sans pricing power, c'est l'occasion d'augmenter vos prix.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 8 : Cas chiffre 50% vers 75% ═════════════ */}
        <section id="cas" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">8. Cas chiffré : passer de 50 % à 75 % d'occupation</h2>
          </div>

          <p className="text-[#374151] leading-relaxed mb-6">
            Pour rendre concrète la puissance du levier "taux d'occupation", voici un cas chiffré détaillé issu d'un bistrot réel suivi sur 12 mois.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mb-4">Profil du restaurant</h3>
          <ul className="space-y-2 text-[#374151] mb-6 list-disc list-inside">
            <li><strong>Type :</strong> bistrot traditionnel parisien, 11e arrondissement</li>
            <li><strong>Capacité :</strong> 48 places en salle + 12 places terrasse (avril-octobre)</li>
            <li><strong>Services :</strong> déjeuner + dîner, 6 jours sur 7 (ferme lundi)</li>
            <li><strong>Rotation moyenne initiale :</strong> 1,2</li>
            <li><strong>Ticket moyen :</strong> 32 EUR HT</li>
            <li><strong>Charges fixes annuelles :</strong> 285 000 EUR (loyer + 4 salaires + assurances + amortissement)</li>
            <li><strong>Food cost :</strong> 30 %</li>
          </ul>

          <h3 className="text-xl font-bold text-mono-100 mb-4 mt-8">État initial (année N-1)</h3>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Indicateur</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Valeur N-1</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Taux d'occupation moyen</td><td className="py-3 px-4 text-right font-bold text-red-700">50 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4">Couverts servis / semaine</td><td className="py-3 px-4 text-right">345</td></tr>
                <tr className="bg-white"><td className="py-3 px-4">CA HT hebdomadaire</td><td className="py-3 px-4 text-right">11 040 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4">CA HT annuel (50 semaines)</td><td className="py-3 px-4 text-right">552 000 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4">Marge brute (70 %)</td><td className="py-3 px-4 text-right">386 400 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4">Charges fixes</td><td className="py-3 px-4 text-right">-285 000 EUR</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-4 font-bold text-emerald-900">Marge nette annuelle</td><td className="py-3 px-4 text-right font-bold text-emerald-900">101 400 EUR (18,4 %)</td></tr>
                <tr className="bg-white"><td className="py-3 px-4">RevPASH moyen</td><td className="py-3 px-4 text-right">5,3 EUR/place/h</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-mono-100 mb-4 mt-8">Plan d'action 12 mois</h3>
          <ul className="space-y-2 text-[#374151] mb-6 list-disc list-inside">
            <li><strong>Mois 1-2 :</strong> inscription TheFork + Resy, photos pro Google, refonte site avec widget réservation natif</li>
            <li><strong>Mois 3-4 :</strong> implementation SMS J-1 systématique, politique empreinte CB pour groupes 6+, formation équipe à l'upsell entrées + desserts</li>
            <li><strong>Mois 5-6 :</strong> menu express déjeuner 18 EUR (entrée + plat + café) pour booster taux midi semaine, brunch dominical lancé</li>
            <li><strong>Mois 7-8 :</strong> partenariat 2 entreprises voisines (tickets restaurant + remise -10 % équipes), événementiel mensuel (dégustation vin, soirées à thème)</li>
            <li><strong>Mois 9-10 :</strong> seconde seating soir le vendredi/samedi (19h-20h45 et 21h-23h), tarification différenciée créneaux</li>
            <li><strong>Mois 11-12 :</strong> click & collect + livraison via plateforme tierce avec menu spécifique, optimisation continue</li>
          </ul>

          <h3 className="text-xl font-bold text-mono-100 mb-4 mt-8">État final (année N)</h3>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Indicateur</th>
                  <th className="text-right py-3 px-4 font-semibold">Valeur N</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Évolution</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Taux d'occupation moyen</td><td className="py-3 px-4 text-right font-bold text-emerald-700">75 %</td><td className="py-3 px-4 text-right text-emerald-700">+25 pts</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4">Rotation moyenne</td><td className="py-3 px-4 text-right">1,6</td><td className="py-3 px-4 text-right text-emerald-700">+0,4</td></tr>
                <tr className="bg-white"><td className="py-3 px-4">Couverts servis / semaine</td><td className="py-3 px-4 text-right">691</td><td className="py-3 px-4 text-right text-emerald-700">+346</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4">CA HT hebdomadaire</td><td className="py-3 px-4 text-right">22 112 EUR</td><td className="py-3 px-4 text-right text-emerald-700">+11 072 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4">CA HT annuel</td><td className="py-3 px-4 text-right">1 105 600 EUR</td><td className="py-3 px-4 text-right text-emerald-700">+553 600 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4">Marge brute (70 %)</td><td className="py-3 px-4 text-right">773 920 EUR</td><td className="py-3 px-4 text-right">+387 520</td></tr>
                <tr className="bg-white"><td className="py-3 px-4">Charges fixes ajustées (1 CDD)</td><td className="py-3 px-4 text-right">-345 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-60 000</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4">Commissions plateformes (4 %)</td><td className="py-3 px-4 text-right">-44 224 EUR</td><td className="py-3 px-4 text-right text-red-700">-44 224</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-4 font-bold text-emerald-900">Marge nette annuelle</td><td className="py-3 px-4 text-right font-bold text-emerald-900">384 696 EUR (34,8 %)</td><td className="py-3 px-4 text-right font-bold text-emerald-700">+283 296</td></tr>
                <tr className="bg-white"><td className="py-3 px-4">RevPASH moyen</td><td className="py-3 px-4 text-right">10,5 EUR/place/h</td><td className="py-3 px-4 text-right text-emerald-700">+5,2 EUR</td></tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-6 mt-8">
            <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Bilan de la transformation
            </h4>
            <p className="text-sm text-emerald-800 leading-relaxed">
              Passer de 50 % à 75 % d'occupation (+25 points) sur ce bistrot a généré <strong>+283 296 EUR de marge nette additionnelle annuelle</strong>, malgré un CDD supplémentaire (+60 000 EUR de charges) et les commissions des plateformes (-44 224 EUR). C'est l'équivalent de 2,8 SMIC chargées gagnées chaque année, juste en optimisant un seul indicateur. Le ROI des outils mis en place (TheFork, SMS, formation équipe) est de l'ordre de 20-30x sur 12 mois.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 9 : Tableau benchmarks ═════════════ */}
        <section id="benchmarks" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">9. Benchmarks complets par type de restaurant</h2>
          </div>

          <p className="text-[#374151] leading-relaxed mb-6">
            Tableau complet des benchmarks observés en France en 2026 sur 8 types d'établissement. Ces fourchettes sont issues des données agrégées de la GIRA Conseil, du Synhorcat.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Type</th>
                  <th className="text-center py-3 px-4 font-semibold">Taux moyen</th>
                  <th className="text-center py-3 px-4 font-semibold">Excellent</th>
                  <th className="text-center py-3 px-4 font-semibold">Rotation</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">RevPASH cible</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Gastronomique</td><td className="py-3 px-4 text-center">45-55 %</td><td className="py-3 px-4 text-center">65 %+</td><td className="py-3 px-4 text-center">1,0-1,2</td><td className="py-3 px-4 text-center">25-45 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Bistrot traditionnel</td><td className="py-3 px-4 text-center">60-75 %</td><td className="py-3 px-4 text-center">85 %+</td><td className="py-3 px-4 text-center">1,4-1,8</td><td className="py-3 px-4 text-center">12-18 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Brasserie</td><td className="py-3 px-4 text-center">55-70 %</td><td className="py-3 px-4 text-center">80 %+</td><td className="py-3 px-4 text-center">1,6-2,2</td><td className="py-3 px-4 text-center">14-22 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Fast casual</td><td className="py-3 px-4 text-center">70-85 %</td><td className="py-3 px-4 text-center">90 %+</td><td className="py-3 px-4 text-center">2,5-4,0</td><td className="py-3 px-4 text-center">18-30 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Brunch / café</td><td className="py-3 px-4 text-center">80-95 %</td><td className="py-3 px-4 text-center">100 % + file</td><td className="py-3 px-4 text-center">3,0-6,0</td><td className="py-3 px-4 text-center">9-15 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Pizzeria</td><td className="py-3 px-4 text-center">65-80 %</td><td className="py-3 px-4 text-center">88 %+</td><td className="py-3 px-4 text-center">2,0-2,5</td><td className="py-3 px-4 text-center">12-20 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Food truck</td><td className="py-3 px-4 text-center">N/A (sans places)</td><td className="py-3 px-4 text-center">N/A</td><td className="py-3 px-4 text-center">N/A</td><td className="py-3 px-4 text-center">N/A</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Dark kitchen</td><td className="py-3 px-4 text-center">N/A (sans places)</td><td className="py-3 px-4 text-center">N/A</td><td className="py-3 px-4 text-center">N/A</td><td className="py-3 px-4 text-center">N/A</td></tr>
              </tbody>
            </table>
          </div>

          <div className="border-l-4 border-emerald-400 bg-emerald-50 rounded-r-xl p-5 mt-6">
            <p className="text-sm font-semibold text-emerald-900 mb-1">Lecture du tableau</p>
            <p className="text-sm text-emerald-800 leading-relaxed">
              Les fourchettes "moyen" représentent la réalité opérationnelle d'un restaurant correct. La colonne "excellent" est ce que visent les top 10 % des établissements. Si vous êtes systématiquement en dessous de la fourchette moyenne, il y a urgence à actionner les leviers de la section 10.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 10 : 8 leviers ═════════════ */}
        <section id="leviers" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-violet-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">10. Les 8 leviers prioritaires</h2>
          </div>

          <p className="text-[#374151] leading-relaxed mb-6">
            Synthèse des 8 leviers les plus puissants pour améliorer durablement le taux d'occupation d'un restaurant. Classement par rapport impact/effort.
          </p>

          <ol className="space-y-4 mt-8">
            {[
              {
                num: 1,
                title: 'Optimiser les réservations en ligne',
                impact: '+10 à +25 % de couverts en 60 jours',
                desc: "Inscription TheFork, Resy ou OpenTable. Profil complet avec 15+ photos professionnelles. Réponses systématiques aux avis sous 48h (objectif 4,4/5 minimum). Confirmation SMS J-1 obligatoire. Bien implémentée, cette action transforme un restaurant en quelques mois."
              },
              {
                num: 2,
                title: 'Réduire le no-show',
                impact: '-50 à -70 % de no-show',
                desc: "Confirmation SMS J-1 (impact -50 %), empreinte CB pour groupes 6+ et services premium (impact -70 %), politique de blacklist après 2 no-show (impact -20 %). Le combo de ces 3 actions ramène typiquement le no-show de 20 % à 6-8 %."
              },
              {
                num: 3,
                title: 'Maîtriser la rotation des tables',
                impact: '+30 à +50 % de couverts par service',
                desc: "Premier seating déjeuner à 12h00, second à 13h45. Dressage de table sous 4 minutes. Carte courte permettant un envoi rapide. Passer d'une rotation 1,2 à 1,6 représente +33 % de couverts avec le même nombre de places et les mêmes équipes."
              },
              {
                num: 4,
                title: 'Exploiter les terrasses (avril-octobre)',
                impact: '+20 à +50 % de capacité saisonnière',
                desc: "Demande municipale à faire 3-6 mois à l'avance. Mobilier durable (résistance soleil, pluie, vent). Éclairage et chauffage pour prolonger en intersaison. Une terrasse bien gérée peut représenter 25-40 % du CA estival."
              },
              {
                num: 5,
                title: 'Investir les créneaux délaissés',
                impact: '+12 à +18 % de CA hebdomadaire',
                desc: "Brunch dominical (12-18 % du CA), petit-déjeuner pro pour entreprises voisines, tea time / goûter pour familles, happy hour pour créer un trafic en fin d'après-midi, late night pour le post-spectacle. Chaque créneau active des charges fixes déjà payées."
              },
              {
                num: 6,
                title: 'Cibler les groupes et privatisations',
                impact: '+6 à +12 % de CA additionnel',
                desc: "Page dédiée groupes sur le site. Menus de groupe à 3 prix (entrée + plat ou entrée + plat + dessert). Devis sous 4h. Partenariats events corporate (apéro d'entreprise, départ en retraite, anniversaire). 2 privatisations/mois suffisent à créer un complément de CA significatif."
              },
              {
                num: 7,
                title: 'Click & collect / livraison',
                impact: '+10 à +25 % de CA pur',
                desc: "Cuisine deuxième cuisine sans utiliser de places assises. Plateformes (Uber Eats, Deliveroo) mais avec menu spécifique adapté (plats supportant le transport, packaging cohenrent). Click & collect direct depuis le site pour éviter les commissions plateforme."
              },
              {
                num: 8,
                title: 'Réseaux sociaux et SEO local',
                impact: '+15 à +25 % de réservations spontanées',
                desc: "3 publications Instagram/semaine minimum, 1 TikTok/semaine pour génération Z, réponses Google Business sous 48h, photos du moment chaque service. Le SEO local (Google Maps) génère souvent 30-40 % des réservations entrantes pour un restaurant urbain bien référencé."
              }
            ].map((step, i) => (
              <li key={i} className="bg-white border border-mono-900 rounded-2xl p-6 sm:p-7 flex gap-5">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0 font-extrabold text-lg shadow-md">
                  {step.num}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-mono-100 text-lg mb-1">{step.title}</h3>
                  <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">Impact attendu : {step.impact}</p>
                  <p className="text-sm text-mono-400 leading-relaxed">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ═════════════ SECTION 11 : Rentabilite ═════════════ */}
        <section id="rentabilite" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-rose-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">11. Taux d'occupation et rentabilité : la courbe en S</h2>
          </div>

          <p className="text-[#374151] leading-relaxed mb-6">
            La relation entre taux d'occupation et rentabilité n'est pas linéaire. Elle suit une <strong>courbe en S</strong> caractéristique qu'il est crucial de comprendre pour éviter les décisions de gestion contre-productives.
          </p>

          <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-mono-100 mb-4">Les 6 zones de la courbe</h3>
            <ul className="space-y-3 text-[#374151]">
              <li className="flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <div><strong>0-40 % :</strong> zone de perte. Le restaurant ne couvre pas ses charges fixes. Survie temporaire possible par auto-exploitation du dirigeant.</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                <div><strong>40-55 % :</strong> seuil de rentabilité atteint. Marge nette nulle ou très faible (0-3 %). Aucune marge de manoeuvre pour investir.</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                <div><strong>55-70 % :</strong> rentabilité progressive. Marge nette 4-10 %. Capacité d'investissement modeste. Zone confortable.</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div><strong>70-85 % :</strong> zone optimale. Marge nette 10-18 %. Équilibre parfait entre remplissage et qualité de service. C'est l'objectif à viser.</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div><strong>85-95 % :</strong> rendement décroissant. La marge augmente moins vite que le taux, car la qualité commence à se dégrader (turnover équipe, casse, mauvaises notes).</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-red-600 mt-1.5 shrink-0" />
                <div><strong>95 %+ :</strong> zone de risque. Saturation opérationnelle, NPS en chute, attrition de l'équipe. La marge peut paradoxalement reculer.</div>
              </li>
            </ul>
          </div>

          <h3 className="text-xl font-bold text-mono-100 mb-4">Calculer son taux d'occupation minimum</h3>
          <p className="text-[#374151] leading-relaxed mb-4">
            Tout restaurateur devrait connaître par coeur son <strong>seuil de rentabilité en taux d'occupation</strong>. C'est le pourcentage en dessous duquel le restaurant perd de l'argent. La formule :
          </p>

          <div className="bg-mono-975 rounded-xl p-5 mb-6 font-mono text-sm text-mono-100 border-l-4 border-rose-500">
            <strong className="text-rose-300">Seuil de rentabilité occupation :</strong><br />
            Taux min = Charges fixes / (Couverts dispo x Marge unitaire)<br />
            Marge unitaire = Ticket moyen x (1 - Food cost %)<br /><br />
            <span className="text-mono-400">Exemple : charges fixes 22 000 EUR/mois<br />
            Couverts disponibles : 2 600/mois<br />
            Ticket 28 EUR, food cost 32 %<br />
            Marge unitaire = 28 x (1 - 0,32) = 19,04 EUR<br />
            <strong className="text-white">Taux minimum = 22 000 / (2 600 x 19,04) = 44,5 %</strong></span>
          </div>

          <p className="text-[#374151] leading-relaxed mb-4">
            Sous 44,5 % de taux, ce restaurant perd de l'argent. Au-dessus, chaque point gagné en taux d'occupation rapporte <strong>environ 495 EUR de marge brute mensuelle</strong> (1 % x 2 600 x 19,04). Sur l'année, cela représente 5 940 EUR par point. Passer de 50 % à 70 % rapporte donc 20 x 5 940 = <strong>118 800 EUR de marge nette annuelle additionnelle</strong>.
          </p>
        </section>

        {/* ═════════════ FAQ ═════════════ */}
        <section id="faq" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-mono-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">12. FAQ : 10 questions fréquentes</h2>
          </div>

          <div className="space-y-5 mt-8">
            {faqItems.map(({ question, answer }, i) => (
              <div key={i} className="border border-mono-900 rounded-xl p-6 bg-white hover:border-teal-300 transition-colors">
                <p className="font-bold text-mono-100 mb-3 text-base">{question}</p>
                <p className="text-mono-400 text-sm leading-relaxed">{answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════════ CTA ═════════════ */}
        <section id="cta" className="mb-12">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-10 text-center text-white shadow-xl">
            <Sparkles className="w-10 h-10 mx-auto mb-4 text-teal-200" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Mesurez et améliorez votre taux d'occupation</h2>
            <p className="text-teal-100 mb-6 text-sm sm:text-base leading-relaxed max-w-[560px] mx-auto">
              RestauMargin calcule automatiquement votre taux d'occupation, votre RevPASH par service, votre rotation, et identifie les créneaux à fort potentiel. Tableau de bord temps réel, alertes intelligentes, simulateur d'impact financier.
            </p>
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-teal-50 transition-colors text-sm sm:text-base"
            >
              Essayer gratuitement <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-teal-200 mt-4">Sans CB, sans engagement. 14 jours d'essai complet.</p>
          </div>
        </section>

        {/* ═════════════ Articles connexes ═════════════ */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-mono-100 mb-6">Articles à lire ensuite</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/blog/chiffre-affaires-restaurant-comment-calculer" className="block bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-md transition-all">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">Gestion</p>
              <p className="font-bold text-mono-100 mb-1">Chiffre d'affaires restaurant : comment calculer</p>
              <p className="text-sm text-mono-400">Formules, projections et benchmarks par type d'établissement.</p>
            </Link>
            <Link to="/blog/augmenter-ticket-moyen-restaurant" className="block bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-md transition-all">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">Stratégies</p>
              <p className="font-bold text-mono-100 mb-1">Augmenter le ticket moyen restaurant</p>
              <p className="text-sm text-mono-400">12 techniques d'upsell pour booster la valeur de chaque couvert.</p>
            </Link>
            <Link to="/blog/prevision-ventes-restaurant" className="block bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-md transition-all">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">Pilotage</p>
              <p className="font-bold text-mono-100 mb-1">Prévision des ventes restaurant</p>
              <p className="text-sm text-mono-400">Méthodes pour anticiper l'affluence et dimensionner les achats.</p>
            </Link>
            <Link to="/blog/kpi-restaurateur" className="block bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-md transition-all">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">Performance</p>
              <p className="font-bold text-mono-100 mb-1">KPI restaurateur : les indicateurs essentiels</p>
              <p className="text-sm text-mono-400">15 KPI à suivre pour piloter votre établissement.</p>
            </Link>
          </div>
        </section>

        </article>

        <BlogAuthor publishedDate="2026-05-26" readTime="15 min" variant="footer" />

        {/* ── Nav bas de page ── */}
        <div className="mt-12 pt-8 border-t border-mono-900 flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">&larr; Tous les articles</Link>
          <Link to="/blog/augmenter-ticket-moyen-restaurant" className="text-sm text-teal-600 hover:underline">Augmenter le ticket moyen &rarr;</Link>
        </div>
      </main>
    </div>
  );
}
