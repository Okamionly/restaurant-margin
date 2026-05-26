import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Calculator, TrendingUp, BarChart3, Sun, Users, Clock, Smartphone, Calendar, ArrowRight, CheckCircle, Target, Percent, Zap, Award, Sparkles, Lightbulb } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Taux d'occupation restaurant : calcul, RevPASH et optimisation"
   Mots-clés principaux : taux occupation restaurant, RevPASH
   ~3 200 mots — mode clair, fond blanc, typo lisible, theme W&B + teal-600
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Quelle est la difference entre taux d'occupation et taux de remplissage ?",
    answer: "Stricto sensu, le taux de remplissage se rapporte a un service donne (le dejeuner du mardi par exemple), alors que le taux d'occupation s'apprecie sur une periode plus longue (semaine, mois). Dans la pratique professionnelle, les deux termes sont utilises de maniere interchangeable et designent la meme mesure : le ratio entre couverts servis et capacite theorique."
  },
  {
    question: "Quel taux d'occupation viser pour un restaurant bistrot ?",
    answer: "Un bistrot traditionnel doit viser 60-75 % en moyenne hebdomadaire, avec des pointes a 85-90 % le weekend. En dessous de 55 %, la rentabilite est tres compromise. Au-dela de 90 %, le service se degrade et le NPS chute, ce qui ramene mecaniquement le taux dans 6-12 mois."
  },
  {
    question: "Quelle est la difference entre taux d'occupation et rotation des tables ?",
    answer: "Le taux d'occupation mesure le remplissage de la salle. La rotation mesure combien de fois une table est utilisee dans un service. Une rotation de 2 signifie que chaque table accueille deux groupes successifs. Les deux indicateurs se combinent : un restaurant peut etre plein (90 %) avec une rotation faible (1,2) ou moyennement rempli (60 %) avec une rotation elevee (2,5)."
  },
  {
    question: "Comment calculer le RevPASH d'un restaurant ?",
    answer: "RevPASH = CA / (Nombre de places assises x Heures d'ouverture). Exemple : un bistrot de 50 places ouvert 7 heures qui fait 4 200 EUR de CA un mercredi a un RevPASH de 12 EUR/place/heure. Cet indicateur, issu du yield management hotelier, est plus pertinent que le taux d'occupation seul car il integre la valeur generee."
  },
  {
    question: "Comment calculer pour un restaurant a plusieurs salles ?",
    answer: "Calculez la capacite totale (somme des places de toutes les salles) puis appliquez la formule globale. Pour un pilotage fin, suivez aussi le taux par salle individuellement. Il est frequent que la salle principale soit a 85 % pendant que la mezzanine plafonne a 30 %, ce qui pose la question de la rentabilite de la seconde salle."
  },
  {
    question: "Mon restaurant a un fort take-away, comment l'integrer ?",
    answer: "Le take-away n'utilise pas de places assises et ne doit pas etre integre au calcul du taux d'occupation, sinon vous biaiseriez l'indicateur. Suivez-le distinctement (CA take-away, panier moyen, nombre de commandes), mais il influe naturellement sur la rentabilite globale puisqu'il absorbe vos charges fixes de cuisine."
  },
  {
    question: "Quel taux d'occupation viser le premier mois d'ouverture ?",
    answer: "35-50 % le premier mois est un excellent resultat pour un concept nouveau. La montee en charge prend generalement 3 a 6 mois. Chercher 80 % des le mois 1 n'arrive que sur des ouvertures medias exceptionnelles. Pendant cette phase, focalisez-vous sur la qualite de l'experience plutot que sur le volume — le bouche-a-oreille fera le reste."
  },
  {
    question: "Faut-il prendre en compte les annulations dans le taux ?",
    answer: "Non. Le taux se calcule sur les couverts effectivement servis, pas sur les reservations passees. Mais suivez separement le taux de no-show (reservations non honorees) car il impacte directement votre capacite a optimiser le remplissage : un taux de no-show de 20 % signifie que 1 reservation sur 5 ne se presente pas."
  },
  {
    question: "Comment ameliorer son taux d'occupation rapidement ?",
    answer: "Les trois leviers les plus rapides : (1) inscription sur TheFork ou Resy (impact 10-25 % de couverts en 30 jours), (2) confirmation SMS J-1 des reservations (reduit le no-show de 20 a 8 %), (3) optimisation de la grille de seating avec premier seating a 12h00 et second a 13h45 pour augmenter la rotation. Ces trois actions peuvent generer +15 a +25 points de taux en 60 jours."
  },
  {
    question: "Le RevPASH ou le taux d'occupation : lequel privilegier ?",
    answer: "Les deux sont complementaires. Le taux d'occupation mesure le volume, le RevPASH mesure la valeur. Un restaurant peut avoir un excellent taux (85 %) mais un RevPASH mediocre s'il bracket trop bas. A l'inverse, un gastronomique peut avoir un taux moyen (55 %) mais un RevPASH eleve grace au ticket moyen. En pratique, pilotez les deux ensemble et arbitrez selon votre strategie de positionnement."
  }
];

export default function BlogTauxOccupation() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Taux d'occupation restaurant : calcul, RevPASH et 8 leviers (2026)"
        description="Calculez votre taux d'occupation et RevPASH. Benchmarks par type, ratios cibles par service, yield management et cas chiffre 50% vers 75%. Guide complet 2026."
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
            description: "Methode pas-a-pas pour mesurer le remplissage de votre restaurant et la valeur generee par place assise.",
            totalTime: 'PT10M',
            tool: ['Carnet de reservations', 'Calculatrice ou tableur', 'Logiciel RestauMargin'],
            step: [
              { '@type': 'HowToStep', name: 'Compter la capacite theorique', text: 'Multipliez le nombre de places assises par la rotation moyenne et le nombre de services dans la periode etudiee.' },
              { '@type': 'HowToStep', name: 'Compter les couverts servis', text: 'Releve precis des couverts effectivement servis sur la meme periode, en excluant les take-away et livraisons.' },
              { '@type': 'HowToStep', name: 'Calculer le taux', text: "Taux d'occupation = (Couverts servis / Couverts disponibles) x 100." },
              { '@type': 'HowToStep', name: 'Calculer le RevPASH', text: "RevPASH = CA HT / (Nombre de places x Heures d'ouverture). Exprime en EUR par place et par heure." },
              { '@type': 'HowToStep', name: 'Comparer aux benchmarks', text: 'Confrontez vos resultats aux fourchettes cibles de votre type d\'etablissement et identifiez les leviers d\'amelioration prioritaires.' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: "Taux d'occupation restaurant : calcul, RevPASH et 8 leviers pour l'ameliorer",
            description: "Guide complet du taux d'occupation et du RevPASH : formules, benchmarks par service, yield management, cas chiffre 50% vers 75%, FAQ 10 questions.",
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
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/signup"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Mesurer mon taux
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors"
            >
              Connexion
            </Link>
          </div>
        </div>
      </nav>

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
        subtitle="Une salle vide a 13h coute autant qu'une salle pleine. Maitrisez le taux d'occupation, le RevPASH et les benchmarks par service pour transformer chaque place assise en machine a rentabilite."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        {/* ── Encadre formule rapide (featured snippet) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Formules essentielles</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les 4 formules a retenir
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
            Loyer, salaires, energie, amortissements : ces charges fixes tombent que vous serviez 20 ou 80 couverts. C'est precisement pour cette raison que le taux d'occupation est l'un des indicateurs les plus rentables a optimiser dans un restaurant. Le chiffre d'affaires additionnel a une marge incrementale extremement elevee puisqu'il absorbe des charges deja payees.
          </p>
          <p className="text-[#374151] leading-relaxed">
            En pratique, passer de 55 % a 65 % de remplissage peut generer 60 000 a 90 000 EUR de CA additionnel par an pour un bistrot de 50 places, dont 60 a 70 % tombe en marge brute. Ce guide complet vous donne toutes les formules, les benchmarks par type d'etablissement et par service, les leviers concrets et un cas chiffre detaille pour passer de 50 % a 75 % d'occupation en 12 mois.
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
              { href: '#definition', label: "Definition et formule du taux d'occupation" },
              { href: '#rotation', label: 'Taux d\'occupation vs rotation des tables : la confusion classique' },
              { href: '#ratios-service', label: 'Ratios cibles par service (dejeuner, diner, weekend)' },
              { href: '#revpash', label: 'Le RevPASH : indicateur cle du yield management' },
              { href: '#mesurer', label: 'Mesurer et tracker au quotidien' },
              { href: '#optimisation', label: 'Optimisation : reservations, no-show et walk-in' },
              { href: '#yield', label: 'Yield management applique au restaurant' },
              { href: '#cas', label: 'Cas chiffre : passer de 50 % a 75 % d\'occupation' },
              { href: '#benchmarks', label: 'Tableau benchmarks par type de restaurant' },
              { href: '#leviers', label: 'Les 8 leviers prioritaires pour ameliorer le taux' },
              { href: '#rentabilite', label: 'Taux d\'occupation et rentabilite : la courbe en S' },
              { href: '#faq', label: 'FAQ : 10 questions frequentes' },
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
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">1. Definition et formule du taux d'occupation</h2>
          </div>

          <p className="text-[#374151] leading-relaxed mb-4">
            Le <strong>taux d'occupation restaurant</strong> mesure le ratio entre les couverts effectivement servis et la capacite maximale theorique sur une periode donnee. C'est un indicateur de performance directement issu du monde hotelier (ou il mesure le remplissage des chambres) adapte au contexte de la restauration.
          </p>

          <div className="bg-mono-975 rounded-xl p-5 mb-6 font-mono text-sm text-mono-100 border-l-4 border-teal-500">
            <strong className="text-teal-300">Formule simple :</strong><br />
            Taux d'occupation = (Couverts servis / Couverts disponibles) x 100
          </div>

          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>L'approche professionnelle</strong> integre la notion de rotation. Une table de 4 utilisee deux fois dans un service represente 8 couverts disponibles, pas 4. La formule professionnelle devient donc :
          </p>

          <div className="bg-mono-975 rounded-xl p-5 mb-6 font-mono text-sm text-mono-100 border-l-4 border-purple-500">
            <strong className="text-purple-300">Formule professionnelle :</strong><br />
            Couverts disponibles = Places assises x Rotation moyenne x Nombre de services<br /><br />
            <span className="text-mono-400">Exemple : 50 places x 1,5 rotation x 2 services x 6 jours = <strong className="text-white">900 couverts disponibles/semaine</strong></span>
          </div>

          <p className="text-[#374151] leading-relaxed mb-4">
            Si ce restaurant sert 612 couverts dans la semaine, son taux d'occupation est de <strong>612 / 900 = 68 %</strong>. Si une partie de ces couverts vient du take-away ou de la livraison, ils doivent etre exclus du numerateur car ils n'utilisent pas de places assises.
          </p>

          <div className="border-l-4 border-blue-400 bg-blue-50 rounded-r-xl p-5 mt-6">
            <p className="text-sm font-semibold text-blue-900 mb-1">Points d'attention</p>
            <ul className="text-sm text-blue-800 space-y-1 leading-relaxed">
              <li>- Les jours feries et fermetures hebdomadaires sont exclus du calcul</li>
              <li>- Les terrasses saisonnieres ne sont comptees que les mois operationnels</li>
              <li>- Une table de 4 occupee par 2 personnes compte 2 couverts au numerateur, mais 4 places au denominateur (sauf si vous bloquez la table)</li>
              <li>- Les enfants en bas age (chaises hautes) ne sont generalement pas integres dans les couverts disponibles</li>
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
            C'est la confusion la plus repandue chez les restaurateurs debutants. <strong>Le taux d'occupation et la rotation des tables sont deux indicateurs differents mais complementaires</strong>. Confondre les deux conduit a des decisions de gestion erronees.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Taux d'occupation</h3>
              </div>
              <p className="text-sm text-emerald-800 leading-relaxed mb-3">
                <strong>Mesure :</strong> le ratio de remplissage de votre salle sur une periode.
              </p>
              <p className="text-sm text-emerald-800 leading-relaxed mb-3">
                <strong>Unite :</strong> pourcentage (%)
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
                <strong>Mesure :</strong> combien de fois une table est utilisee dans un service.
              </p>
              <p className="text-sm text-purple-800 leading-relaxed mb-3">
                <strong>Unite :</strong> nombre decimal (1,2 ; 1,8 ; 2,5...)
              </p>
              <p className="text-sm text-purple-800 leading-relaxed">
                <strong>Question :</strong> combien de groupes successifs par table dans un service ?
              </p>
            </div>
          </div>

          <p className="text-[#374151] leading-relaxed mt-8 mb-4">
            <strong>Exemple concret pour bien comprendre :</strong> un restaurant de 40 places sert 96 couverts au dejeuner. Le taux d'occupation du service (en supposant un seul service au dejeuner) est de <strong>96 / 40 = 240 %</strong>... ce qui ne veut rien dire. En realite, ce restaurant a fait une rotation de 2,4 : chaque table a accueilli 2,4 groupes en moyenne sur la duree du service.
          </p>

          <div className="bg-mono-975 rounded-xl p-5 mb-6 font-mono text-sm text-mono-100">
            <strong className="text-teal-300">Formule rotation :</strong><br />
            Rotation = Couverts servis / Nombre de places assises<br /><br />
            <span className="text-mono-400">Exemple : 96 couverts / 40 places = <strong className="text-white">rotation de 2,4</strong></span>
          </div>

          <p className="text-[#374151] leading-relaxed mb-4">
            La rotation est l'indicateur cle pour piloter l'intensite d'un service. Plus elle est elevee, plus vous generez de couverts (donc de CA) sur la meme fenetre temporelle, avec la meme equipe et la meme cuisine. C'est l'effet de levier le plus puissant en restauration.
          </p>

          <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl p-5">
            <p className="text-sm font-semibold text-amber-900 mb-1">Benchmarks rotation par type</p>
            <ul className="text-sm text-amber-800 space-y-1 leading-relaxed">
              <li>- <strong>Gastronomique :</strong> 1,0 a 1,2 (un seul seating, longue duree)</li>
              <li>- <strong>Bistrot :</strong> 1,4 a 1,8 (un seating principal + walk-in)</li>
              <li>- <strong>Brasserie :</strong> 1,6 a 2,2 (double seating possible)</li>
              <li>- <strong>Pizzeria :</strong> 2,0 a 2,5 (rotation rapide intrinseque)</li>
              <li>- <strong>Fast casual :</strong> 2,5 a 4,0 (service continu, pas de reservations)</li>
              <li>- <strong>Coffee shop :</strong> 3,0 a 6,0 (consommation rapide, beaucoup de turn over)</li>
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
            Le taux d'occupation moyen masque souvent des realites tres heterogenes selon les services. Un bistrot a 65 % d'occupation hebdomadaire peut tres bien etre a 90 % le vendredi soir et a 30 % le mardi midi. Voici les ratios cibles a viser <strong>service par service</strong> pour piloter finement votre rentabilite.
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
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Dejeuner semaine</td><td className="py-3 px-4 text-center">55 %</td><td className="py-3 px-4 text-center text-teal-700 font-semibold">70-90 %</td><td className="py-3 px-4 text-center font-bold text-emerald-700">95 %+</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Diner semaine</td><td className="py-3 px-4 text-center">45 %</td><td className="py-3 px-4 text-center text-teal-700 font-semibold">60-80 %</td><td className="py-3 px-4 text-center font-bold text-emerald-700">85 %+</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Dejeuner weekend</td><td className="py-3 px-4 text-center">60 %</td><td className="py-3 px-4 text-center text-teal-700 font-semibold">75-90 %</td><td className="py-3 px-4 text-center font-bold text-emerald-700">100 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Diner weekend</td><td className="py-3 px-4 text-center">65 %</td><td className="py-3 px-4 text-center text-teal-700 font-semibold">85-95 %</td><td className="py-3 px-4 text-center font-bold text-emerald-700">100 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Brunch dominical</td><td className="py-3 px-4 text-center">70 %</td><td className="py-3 px-4 text-center text-teal-700 font-semibold">90-100 %</td><td className="py-3 px-4 text-center font-bold text-emerald-700">100 % + file</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Petit-dej / cafe</td><td className="py-3 px-4 text-center">40 %</td><td className="py-3 px-4 text-center text-teal-700 font-semibold">55-70 %</td><td className="py-3 px-4 text-center font-bold text-emerald-700">80 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Apres-midi / gouter</td><td className="py-3 px-4 text-center">25 %</td><td className="py-3 px-4 text-center text-teal-700 font-semibold">40-55 %</td><td className="py-3 px-4 text-center font-bold text-emerald-700">70 %</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Le dejeuner semaine : le service le plus rentable</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Le service du midi en semaine offre la meilleure marge incrementale de tous : duree courte (1h30 max), rotation rapide possible (jusqu'a 2,2), ticket moyen plus eleve qu'au cafe, charges deja amorties par le diner du soir. C'est mathematiquement le service ou chaque point de taux gagne rapporte le plus.
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              <strong>Cible imperative :</strong> 70-90 % au dejeuner en semaine. En dessous de 55 %, posez-vous serieusement la question d'une politique commerciale : menu express, formule a prix attractif, partenariats entreprises locales, accord avec une plateforme de tickets restaurant.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Le diner semaine : le defi de la frequentation</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Le diner en semaine (mardi-mercredi-jeudi) est le service le plus fragile pour la plupart des restaurants traditionnels. Les clients privilegient le diner a la maison ou la livraison. Cible realiste : 60-80 %. Les leviers sont differents : evenementiel (soirees a theme), partenariats cultures (avant/apres spectacle), abonnement bistronomique mensuel.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Le weekend : maximiser l'absorption</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Vendredi soir, samedi midi/soir, dimanche midi : ces 4 services concentrent souvent 50-60 % du chiffre d'affaires hebdomadaire d'un restaurant traditionnel. Cible imperative : 85-95 %. La question n'est plus de remplir mais d'optimiser la rotation et le ticket moyen. Refuser des clients par manque de place est un signal de prosperite, mais aussi une opportunite perdue qui se chiffre rapidement en milliers d'euros.
            </p>
          </div>

          <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl p-5 mt-6">
            <p className="text-sm font-semibold text-amber-900 mb-1">Le piege du trop plein</p>
            <p className="text-sm text-amber-800 leading-relaxed">
              Depasser systematiquement 95 % nuit a la rentabilite : files d'attente, service degrade, mauvaises notes Google et TheFork, turnover equipe en hausse, casse de vaisselle. L'objectif n'est jamais le maximum theorique, c'est le <strong>maximum soutenable</strong> dans la duree.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 4 : RevPASH ═════════════ */}
        <section id="revpash" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">4. RevPASH : indicateur cle du yield management</h2>
          </div>

          <p className="text-[#374151] leading-relaxed mb-4">
            Le taux d'occupation seul ne tient pas compte de la valeur generee. Un restaurant peut etre plein avec un ticket moyen tres bas et un autre moyennement rempli avec un ticket eleve : les deux peuvent generer le meme CA, mais leur rentabilite reelle est tres differente. Le <strong>RevPASH (Revenue Per Available Seat Hour)</strong> resout ce probleme.
          </p>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Definition du RevPASH
            </h3>
            <p className="text-sm text-purple-800 leading-relaxed mb-3">
              Indicateur issu directement du yield management hotelier (le fameux RevPAR), adapte au restaurant par l'ecole hoteliere de Cornell University dans les annees 1990. Il mesure le chiffre d'affaires genere par place assise et par heure d'ouverture. C'est l'indicateur ultime qui combine taux d'occupation, rotation et ticket moyen en une seule valeur.
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
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Cafe / brunch</td><td className="py-3 px-4 text-center">2-4 EUR</td><td className="py-3 px-4 text-center">4-7 EUR</td><td className="py-3 px-4 text-center font-bold text-emerald-700">9-12 EUR</td></tr>
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
              <strong>Pourquoi cet indicateur est si puissant :</strong> il permet de comparer la performance economique de creneaux horaires tres differents. Un dejeuner a 13h peut avoir un RevPASH de 22 EUR/place/heure pendant qu'un service de 15h-17h tombe a 3 EUR/place/heure. Cette analyse temporelle indique exactement quels creneaux meritent un investissement marketing et lesquels ne sont pas rentables.
            </p>
          </div>

          <div className="border-l-4 border-purple-400 bg-purple-50 rounded-r-xl p-5">
            <p className="text-sm font-semibold text-purple-900 mb-1">Cas d'usage strategique du RevPASH</p>
            <p className="text-sm text-purple-800 leading-relaxed">
              Si votre RevPASH moyen est de 8 EUR et que vous ouvrez 7 jours sur 7, calculez le RevPASH de chaque jour separement. Souvent, le mardi ou le mercredi tombe en dessous de 4 EUR. Question a se poser : est-il rentable de rester ouvert ce jour-la, ou serait-il preferable de fermer (et faire un service ailleurs, comme du traiteur ou de la prive) ? Le RevPASH donne la reponse chiffree, pas l'intuition.
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
            Un indicateur qui n'est pas mesure ne s'ameliore pas. Voici le tableau de bord minimum a tenir, soit dans un tableur Excel/Google Sheets, soit dans un outil specialise comme RestauMargin.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mb-4">Tableau de bord quotidien</h3>

          <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 mb-6">
            <ul className="space-y-3 text-[#374151]">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div><strong>Couverts servis</strong> par service (dejeuner / diner) — releve directement depuis la caisse en fin de service</div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div><strong>Capacite du jour</strong> — places assises ouvertes (terrasse comprise selon meteo)</div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div><strong>Taux d'occupation, rotation, RevPASH</strong> par service</div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div><strong>No-shows</strong> (reservations passees - arrivees effectives) — indispensable pour ajuster l'over-booking</div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div><strong>Walk-in</strong> (clients sans reservation acceptes vs refuses) — donnee cle pour dimensionner la politique de reservation</div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div><strong>Refus pour cause de salle pleine</strong> — chaque refus est un manque a gagner direct</div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div><strong>Ticket moyen</strong> par service — pour croiser avec le RevPASH</div>
              </li>
            </ul>
          </div>

          <h3 className="text-xl font-bold text-mono-100 mb-4 mt-8">La regle des 13 semaines glissantes</h3>
          <p className="text-[#374151] leading-relaxed mb-4">
            Comparez toujours sur <strong>13 semaines glissantes</strong> (l'equivalent d'un trimestre). Cette approche presente trois avantages : elle lisse les variations saisonnieres (semaines de vacances, ferias, evenements), elle detecte les tendances de fond (croissance progressive ou erosion lente), elle facilite la communication interne (chiffre stable, pas de paniques injustifiees sur une mauvaise semaine).
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">
            En complement, gardez un <strong>comparatif annee N-1</strong> sur les memes semaines pour mesurer la saisonnalite et detecter les changements structurels. Si vous etes en baisse de 8 % par rapport a l'annee derniere a la meme date, c'est un signal d'alerte qui merite investigation (concurrent, evenement local, qualite service, prix).
          </p>

          <div className="border-l-4 border-indigo-400 bg-indigo-50 rounded-r-xl p-5">
            <p className="text-sm font-semibold text-indigo-900 mb-1">Frequence de pilotage</p>
            <ul className="text-sm text-indigo-800 space-y-1 leading-relaxed">
              <li>- <strong>Quotidien :</strong> couverts, taux du jour, no-shows</li>
              <li>- <strong>Hebdomadaire :</strong> taux moyen par service, rotation, RevPASH</li>
              <li>- <strong>Mensuel :</strong> 13 semaines glissantes, comparatif N-1, analyse trends</li>
              <li>- <strong>Trimestriel :</strong> revue strategique, ajustement de la politique commerciale</li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Optimisation reservations ═════════════ */}
        <section id="optimisation" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-teal-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">6. Optimisation : reservations, no-show et walk-in</h2>
          </div>

          <p className="text-[#374151] leading-relaxed mb-6">
            La gestion intelligente du trio reservations + no-show + walk-in peut a elle seule generer +10 a +20 points de taux d'occupation. Voici les trois piliers a maitriser.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mb-4">Pilier 1 : un systeme de reservation en ligne</h3>
          <p className="text-[#374151] leading-relaxed mb-4">
            Si vous ne proposez pas la reservation en ligne, vous perdez automatiquement 15 a 25 % de clients potentiels. Les solutions principales en France :
          </p>
          <ul className="space-y-2 text-[#374151] mb-6 list-disc list-inside">
            <li><strong>TheFork (ex LaFourchette) :</strong> leader, jusqu'a 30 % des couverts urbains, commission 2 EUR/couvert + abonnement</li>
            <li><strong>Resy / OpenTable :</strong> positionnement haut de gamme, audience CSP+, frais variables</li>
            <li><strong>Sevenrooms / Zenchef :</strong> CRM integre, parfait pour les groupes d'etablissements</li>
            <li><strong>Widget natif sur votre site :</strong> Bookline, RestoConnection, Yelp, Reservio — 0 commission mais necessite trafic web</li>
          </ul>

          <h3 className="text-xl font-bold text-mono-100 mb-4 mt-8">Pilier 2 : reduire les no-show</h3>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le no-show (reservation non honoree sans previsance) est un fleau qui ampute les meilleurs restaurants de 5 a 25 % de leurs couverts. <strong>Les leviers prouves :</strong>
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Action</th>
                  <th className="text-center py-3 px-4 font-semibold">Cout</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Impact no-show</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Confirmation SMS J-1 (14h)</td><td className="py-3 px-4 text-center">0,06 EUR/SMS</td><td className="py-3 px-4 text-center font-bold text-emerald-700">-50 a -60 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Empreinte CB a la reservation</td><td className="py-3 px-4 text-center">0 EUR</td><td className="py-3 px-4 text-center font-bold text-emerald-700">-60 a -80 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Penalite annulation tardive (20 EUR/couvert)</td><td className="py-3 px-4 text-center">0 EUR</td><td className="py-3 px-4 text-center font-bold text-emerald-700">-70 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Rappel WhatsApp personnalise</td><td className="py-3 px-4 text-center">0,02 EUR/msg</td><td className="py-3 px-4 text-center font-bold text-emerald-700">-30 a -40 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Politique "no-show 2 fois = blacklist"</td><td className="py-3 px-4 text-center">0 EUR</td><td className="py-3 px-4 text-center font-bold text-emerald-700">-20 %</td></tr>
              </tbody>
            </table>
          </div>

          <p className="text-[#374151] leading-relaxed mt-6 mb-4">
            <strong>Strategie recommandee :</strong> SMS J-1 systematique pour tout le monde + empreinte CB pour les groupes 6 personnes et plus, et pour les services tres demandes (vendredi/samedi soir). Cette combinaison ramene typiquement le taux de no-show de 20 % a 6-8 %.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mb-4 mt-8">Pilier 3 : exploiter le walk-in</h3>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le walk-in (clients sans reservation) est une variable strategique. Trop de walk-in signifie que vous ne capturez pas la demande en amont. Pas assez de walk-in signifie que votre vitrine, votre signaletique ou votre attractivite spontanee est faible. <strong>Le bon equilibre :</strong> 20-35 % de walk-in dans les services demandes, 50-70 % en services creux.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Bonnes pratiques walk-in :</strong> tenir toujours 2-3 tables disponibles meme en service complet (pour capter les passages), proposer le bar comme zone d'attente avec une boisson, ne jamais refuser sans donner une alternative (rappel d'une heure plus tard, suggestion d'un restaurant partenaire en echange d'un retour ulterieur).
          </p>
        </section>

        {/* ═════════════ SECTION 7 : Yield management ═════════════ */}
        <section id="yield" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-cyan-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">7. Yield management applique au restaurant</h2>
          </div>

          <p className="text-[#374151] leading-relaxed mb-4">
            Importe directement de l'hotellerie et de l'aerien, le <strong>yield management</strong> (ou revenue management) consiste a ajuster dynamiquement vos prix et votre allocation de capacite en fonction de la demande prevue. Longtemps reserve aux chaines hotelieres, il devient progressivement standard en restauration grace aux plateformes de reservation.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mb-4 mt-8">Les 4 leviers du yield management resto</h3>

          <div className="grid sm:grid-cols-2 gap-5 mt-6">
            <div className="bg-white border border-mono-900 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="w-5 h-5 text-cyan-600" />
                <h4 className="font-bold text-mono-100">1. Tarification differenciee par creneau</h4>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">
                Menu midi a 19 EUR (forte demande), happy hour 18h-19h a -30 %, dimanche midi a tarif premium. Lisse la demande sur des creneaux moins frequentes.
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-cyan-600" />
                <h4 className="font-bold text-mono-100">2. Limitation de duree de table</h4>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">
                "Reservation valable 1h30" pour le dejeuner, 2h pour le diner. Indispensable pour passer d'une rotation 1,3 a 1,8 sans degrader l'experience.
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-cyan-600" />
                <h4 className="font-bold text-mono-100">3. Reservation par creneau fixe</h4>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">
                Premier seating 19h00, second seating 21h30. Permet de doubler la rotation soir en bistrot/brasserie. Standard sur les gros restaurants new-yorkais.
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-cyan-600" />
                <h4 className="font-bold text-mono-100">4. Allocation strategique de la capacite</h4>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">
                Reserver 60 % de la capacite a la reservation en ligne, 25 % aux walk-in, 15 % aux clients VIP / habitues. Ajustable selon le jour.
              </p>
            </div>
          </div>

          <div className="border-l-4 border-cyan-400 bg-cyan-50 rounded-r-xl p-5 mt-8">
            <p className="text-sm font-semibold text-cyan-900 mb-1">Indicateur a suivre absolument</p>
            <p className="text-sm text-cyan-800 leading-relaxed">
              Le <strong>"taux de remplissage residuel apres reservations"</strong> = combien de places restent disponibles 24h avant le service. Si ce chiffre est superieur a 20 % chaque jour, vous avez un probleme d'attractivite. Si inferieur a 5 %, vous laissez tourner le restaurant sans pricing power, c'est l'occasion d'augmenter vos prix.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 8 : Cas chiffre 50% vers 75% ═════════════ */}
        <section id="cas" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">8. Cas chiffre : passer de 50 % a 75 % d'occupation</h2>
          </div>

          <p className="text-[#374151] leading-relaxed mb-6">
            Pour rendre concrete la puissance du levier "taux d'occupation", voici un cas chiffre detaille issu d'un bistrot reel suivi sur 12 mois.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mb-4">Profil du restaurant</h3>
          <ul className="space-y-2 text-[#374151] mb-6 list-disc list-inside">
            <li><strong>Type :</strong> bistrot traditionnel parisien, 11e arrondissement</li>
            <li><strong>Capacite :</strong> 48 places en salle + 12 places terrasse (avril-octobre)</li>
            <li><strong>Services :</strong> dejeuner + diner, 6 jours sur 7 (ferme lundi)</li>
            <li><strong>Rotation moyenne initiale :</strong> 1,2</li>
            <li><strong>Ticket moyen :</strong> 32 EUR HT</li>
            <li><strong>Charges fixes annuelles :</strong> 285 000 EUR (loyer + 4 salaires + assurances + amortissement)</li>
            <li><strong>Food cost :</strong> 30 %</li>
          </ul>

          <h3 className="text-xl font-bold text-mono-100 mb-4 mt-8">Etat initial (annee N-1)</h3>

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
            <li><strong>Mois 1-2 :</strong> inscription TheFork + Resy, photos pro Google, refonte site avec widget reservation natif</li>
            <li><strong>Mois 3-4 :</strong> implementation SMS J-1 systematique, politique empreinte CB pour groupes 6+, formation equipe a l'upsell entrees + desserts</li>
            <li><strong>Mois 5-6 :</strong> menu express dejeuner 18 EUR (entree + plat + cafe) pour booster taux midi semaine, brunch dominical lance</li>
            <li><strong>Mois 7-8 :</strong> partenariat 2 entreprises voisines (tickets restaurant + remise -10 % equipes), evenementiel mensuel (degustation vin, soirees a theme)</li>
            <li><strong>Mois 9-10 :</strong> seconde seating soir le vendredi/samedi (19h-20h45 et 21h-23h), tarification differenciee creneaux</li>
            <li><strong>Mois 11-12 :</strong> click & collect + livraison via plateforme tierce avec menu specifique, optimisation continue</li>
          </ul>

          <h3 className="text-xl font-bold text-mono-100 mb-4 mt-8">Etat final (annee N)</h3>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Indicateur</th>
                  <th className="text-right py-3 px-4 font-semibold">Valeur N</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Evolution</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Taux d'occupation moyen</td><td className="py-3 px-4 text-right font-bold text-emerald-700">75 %</td><td className="py-3 px-4 text-right text-emerald-700">+25 pts</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4">Rotation moyenne</td><td className="py-3 px-4 text-right">1,6</td><td className="py-3 px-4 text-right text-emerald-700">+0,4</td></tr>
                <tr className="bg-white"><td className="py-3 px-4">Couverts servis / semaine</td><td className="py-3 px-4 text-right">691</td><td className="py-3 px-4 text-right text-emerald-700">+346</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4">CA HT hebdomadaire</td><td className="py-3 px-4 text-right">22 112 EUR</td><td className="py-3 px-4 text-right text-emerald-700">+11 072 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4">CA HT annuel</td><td className="py-3 px-4 text-right">1 105 600 EUR</td><td className="py-3 px-4 text-right text-emerald-700">+553 600 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4">Marge brute (70 %)</td><td className="py-3 px-4 text-right">773 920 EUR</td><td className="py-3 px-4 text-right">+387 520</td></tr>
                <tr className="bg-white"><td className="py-3 px-4">Charges fixes ajustees (1 CDD)</td><td className="py-3 px-4 text-right">-345 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-60 000</td></tr>
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
              Passer de 50 % a 75 % d'occupation (+25 points) sur ce bistrot a genere <strong>+283 296 EUR de marge nette additionnelle annuelle</strong>, malgre un CDD supplementaire (+60 000 EUR de charges) et les commissions des plateformes (-44 224 EUR). C'est l'equivalent de 2,8 SMIC chargees gagnees chaque annee, juste en optimisant un seul indicateur. Le ROI des outils mis en place (TheFork, SMS, formation equipe) est de l'ordre de 20-30x sur 12 mois.
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
            Tableau complet des benchmarks observes en France en 2026 sur 8 types d'etablissement. Ces fourchettes sont issues des donnees agregees de la GIRA Conseil, du Synhorcat, et de notre base de donnees RestauMargin.
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
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Brunch / cafe</td><td className="py-3 px-4 text-center">80-95 %</td><td className="py-3 px-4 text-center">100 % + file</td><td className="py-3 px-4 text-center">3,0-6,0</td><td className="py-3 px-4 text-center">9-15 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Pizzeria</td><td className="py-3 px-4 text-center">65-80 %</td><td className="py-3 px-4 text-center">88 %+</td><td className="py-3 px-4 text-center">2,0-2,5</td><td className="py-3 px-4 text-center">12-20 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Food truck</td><td className="py-3 px-4 text-center">N/A (sans places)</td><td className="py-3 px-4 text-center">N/A</td><td className="py-3 px-4 text-center">N/A</td><td className="py-3 px-4 text-center">N/A</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Dark kitchen</td><td className="py-3 px-4 text-center">N/A (sans places)</td><td className="py-3 px-4 text-center">N/A</td><td className="py-3 px-4 text-center">N/A</td><td className="py-3 px-4 text-center">N/A</td></tr>
              </tbody>
            </table>
          </div>

          <div className="border-l-4 border-emerald-400 bg-emerald-50 rounded-r-xl p-5 mt-6">
            <p className="text-sm font-semibold text-emerald-900 mb-1">Lecture du tableau</p>
            <p className="text-sm text-emerald-800 leading-relaxed">
              Les fourchettes "moyen" representent la realite operationnelle d'un restaurant correct. La colonne "excellent" est ce que visent les top 10 % des etablissements. Si vous etes systematiquement en dessous de la fourchette moyenne, il y a urgence a actionner les leviers de la section 10.
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
            Synthese des 8 leviers les plus puissants pour ameliorer durablement le taux d'occupation d'un restaurant. Classement par rapport impact/effort.
          </p>

          <ol className="space-y-4 mt-8">
            {[
              {
                num: 1,
                title: 'Optimiser les reservations en ligne',
                impact: '+10 a +25 % de couverts en 60 jours',
                desc: "Inscription TheFork, Resy ou OpenTable. Profil complet avec 15+ photos professionnelles. Reponses systematiques aux avis sous 48h (objectif 4,4/5 minimum). Confirmation SMS J-1 obligatoire. Bien implementee, cette action transforme un restaurant en quelques mois."
              },
              {
                num: 2,
                title: 'Reduire le no-show',
                impact: '-50 a -70 % de no-show',
                desc: "Confirmation SMS J-1 (impact -50 %), empreinte CB pour groupes 6+ et services premium (impact -70 %), politique de blacklist apres 2 no-show (impact -20 %). Le combo de ces 3 actions ramene typiquement le no-show de 20 % a 6-8 %."
              },
              {
                num: 3,
                title: 'Maitriser la rotation des tables',
                impact: '+30 a +50 % de couverts par service',
                desc: "Premier seating dejeuner a 12h00, second a 13h45. Dressage de table sous 4 minutes. Carte courte permettant un envoi rapide. Passer d'une rotation 1,2 a 1,6 represente +33 % de couverts avec le meme nombre de places et les memes equipes."
              },
              {
                num: 4,
                title: 'Exploiter les terrasses (avril-octobre)',
                impact: '+20 a +50 % de capacite saisonniere',
                desc: "Demande municipale a faire 3-6 mois a l'avance. Mobilier durable (resistance soleil, pluie, vent). Eclairage et chauffage pour prolonger en intersaison. Une terrasse bien geree peut representer 25-40 % du CA estival."
              },
              {
                num: 5,
                title: 'Investir les creneaux delaisses',
                impact: '+12 a +18 % de CA hebdomadaire',
                desc: "Brunch dominical (12-18 % du CA), petit-dejeuner pro pour entreprises voisines, tea time / gouter pour familles, happy hour pour creer un trafic en fin d'apres-midi, late night pour le post-spectacle. Chaque creneau active des charges fixes deja payees."
              },
              {
                num: 6,
                title: 'Cibler les groupes et privatisations',
                impact: '+6 a +12 % de CA additionnel',
                desc: "Page dediee groupes sur le site. Menus de groupe a 3 prix (entree + plat ou entree + plat + dessert). Devis sous 4h. Partenariats events corporate (apero d'entreprise, depart en retraite, anniversaire). 2 privatisations/mois suffisent a creer un complement de CA significatif."
              },
              {
                num: 7,
                title: 'Click & collect / livraison',
                impact: '+10 a +25 % de CA pur',
                desc: "Cuisine deuxieme cuisine sans utiliser de places assises. Plateformes (Uber Eats, Deliveroo) mais avec menu specifique adapte (plats supportant le transport, packaging cohenrent). Click & collect direct depuis le site pour eviter les commissions plateforme."
              },
              {
                num: 8,
                title: 'Reseaux sociaux et SEO local',
                impact: '+15 a +25 % de reservations spontanees',
                desc: "3 publications Instagram/semaine minimum, 1 TikTok/semaine pour generation Z, reponses Google Business sous 48h, photos du moment chaque service. Le SEO local (Google Maps) genere souvent 30-40 % des reservations entrantes pour un restaurant urbain bien reference."
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
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">11. Taux d'occupation et rentabilite : la courbe en S</h2>
          </div>

          <p className="text-[#374151] leading-relaxed mb-6">
            La relation entre taux d'occupation et rentabilite n'est pas lineaire. Elle suit une <strong>courbe en S</strong> caracteristique qu'il est crucial de comprendre pour eviter les decisions de gestion contre-productives.
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
                <div><strong>40-55 % :</strong> seuil de rentabilite atteint. Marge nette nulle ou tres faible (0-3 %). Aucune marge de manoeuvre pour investir.</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                <div><strong>55-70 % :</strong> rentabilite progressive. Marge nette 4-10 %. Capacite d'investissement modeste. Zone confortable.</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div><strong>70-85 % :</strong> zone optimale. Marge nette 10-18 %. Equilibre parfait entre remplissage et qualite de service. C'est l'objectif a viser.</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div><strong>85-95 % :</strong> rendement decroissant. La marge augmente moins vite que le taux, car la qualite commence a se degrader (turnover equipe, casse, mauvaises notes).</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-red-600 mt-1.5 shrink-0" />
                <div><strong>95 %+ :</strong> zone de risque. Saturation operationnelle, NPS en chute, attrition de l'equipe. La marge peut paradoxalement reculer.</div>
              </li>
            </ul>
          </div>

          <h3 className="text-xl font-bold text-mono-100 mb-4">Calculer son taux d'occupation minimum</h3>
          <p className="text-[#374151] leading-relaxed mb-4">
            Tout restaurateur devrait connaitre par coeur son <strong>seuil de rentabilite en taux d'occupation</strong>. C'est le pourcentage en dessous duquel le restaurant perd de l'argent. La formule :
          </p>

          <div className="bg-mono-975 rounded-xl p-5 mb-6 font-mono text-sm text-mono-100 border-l-4 border-rose-500">
            <strong className="text-rose-300">Seuil de rentabilite occupation :</strong><br />
            Taux min = Charges fixes / (Couverts dispo x Marge unitaire)<br />
            Marge unitaire = Ticket moyen x (1 - Food cost %)<br /><br />
            <span className="text-mono-400">Exemple : charges fixes 22 000 EUR/mois<br />
            Couverts disponibles : 2 600/mois<br />
            Ticket 28 EUR, food cost 32 %<br />
            Marge unitaire = 28 x (1 - 0,32) = 19,04 EUR<br />
            <strong className="text-white">Taux minimum = 22 000 / (2 600 x 19,04) = 44,5 %</strong></span>
          </div>

          <p className="text-[#374151] leading-relaxed mb-4">
            Sous 44,5 % de taux, ce restaurant perd de l'argent. Au-dessus, chaque point gagne en taux d'occupation rapporte <strong>environ 495 EUR de marge brute mensuelle</strong> (1 % x 2 600 x 19,04). Sur l'annee, cela represente 5 940 EUR par point. Passer de 50 % a 70 % rapporte donc 20 x 5 940 = <strong>118 800 EUR de marge nette annuelle additionnelle</strong>.
          </p>
        </section>

        {/* ═════════════ FAQ ═════════════ */}
        <section id="faq" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-mono-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">12. FAQ : 10 questions frequentes</h2>
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Mesurez et ameliorez votre taux d'occupation</h2>
            <p className="text-teal-100 mb-6 text-sm sm:text-base leading-relaxed max-w-[560px] mx-auto">
              RestauMargin calcule automatiquement votre taux d'occupation, votre RevPASH par service, votre rotation, et identifie les creneaux a fort potentiel. Tableau de bord temps reel, alertes intelligentes, simulateur d'impact financier.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-teal-50 transition-colors text-sm sm:text-base"
            >
              Essayer gratuitement <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-teal-200 mt-4">Sans CB, sans engagement. 14 jours d'essai complet.</p>
          </div>
        </section>

        {/* ═════════════ Articles connexes ═════════════ */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-mono-100 mb-6">Articles a lire ensuite</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/blog/chiffre-affaires-restaurant-comment-calculer" className="block bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-md transition-all">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">Gestion</p>
              <p className="font-bold text-mono-100 mb-1">Chiffre d'affaires restaurant : comment calculer</p>
              <p className="text-sm text-mono-400">Formules, projections et benchmarks par type d'etablissement.</p>
            </Link>
            <Link to="/blog/augmenter-ticket-moyen-restaurant" className="block bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-md transition-all">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">Strategies</p>
              <p className="font-bold text-mono-100 mb-1">Augmenter le ticket moyen restaurant</p>
              <p className="text-sm text-mono-400">12 techniques d'upsell pour booster la valeur de chaque couvert.</p>
            </Link>
            <Link to="/blog/prevision-ventes-restaurant" className="block bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-md transition-all">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">Pilotage</p>
              <p className="font-bold text-mono-100 mb-1">Prevision des ventes restaurant</p>
              <p className="text-sm text-mono-400">Methodes pour anticiper l'affluence et dimensionner les achats.</p>
            </Link>
            <Link to="/blog/kpi-restaurateur" className="block bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-md transition-all">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">Performance</p>
              <p className="font-bold text-mono-100 mb-1">KPI restaurateur : les indicateurs essentiels</p>
              <p className="text-sm text-mono-400">15 KPI a suivre pour piloter votre etablissement.</p>
            </Link>
          </div>
        </section>

        </article>

        {/* ── Nav bas de page ── */}
        <div className="mt-12 pt-8 border-t border-mono-900 flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">&larr; Tous les articles</Link>
          <Link to="/blog/augmenter-ticket-moyen-restaurant" className="text-sm text-teal-600 hover:underline">Augmenter le ticket moyen &rarr;</Link>
        </div>
      </main>
    </div>
  );
}
