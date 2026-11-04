import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calculator, AlertTriangle, CheckCircle, ArrowRight, BarChart3, DollarSign, Percent, Target, BookOpen, Lightbulb, Users, Zap, ListChecks, Sparkles, Heart, XCircle, Activity, Brain, Compass } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — PAA "Pourquoi mon restaurant ne rapporte-t-il pas d'argent ?"
   Mot-cle principal : pourquoi mon restaurant ne rapporte pas d'argent
   ~3 200 mots — mode clair, fond blanc, theme W&B teal-600
   Ton : empathique, direct, pas culpabilisant
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Pourquoi mon restaurant ne rapporte-t-il pas d'argent malgré du monde ?",
    answer: "Avoir du monde ne suffit pas. Si votre food cost dépasse 35 %, votre masse salariale 40 %, ou votre loyer 12 % du CA, votre marge nette s'évapore même avec un restaurant plein. Le problème est mathématique : un restaurant très fréquenté avec des ratios détériorés perd de l'argent plus vite qu'un restaurant à moitié vide. Refaire vos fiches techniques et auditer vos charges résout 80 % des cas.",
  },
  {
    question: 'Combien de temps faut-il pour redresser un restaurant non rentable ?',
    answer: "Entre 90 et 180 jours pour voir un effet net sur la marge. Mois 1 : diagnostic + quick wins (food cost, gaspillage). Mois 2-3 : refonte de la carte + renégociation fournisseurs + optimisation planning. Mois 4-6 : repositionnement marketing + fidélisation. Un restaurant qui passe d'une marge nette de 0 % à 8-10 % en 6 mois est réaliste si les actions sont disciplinées.",
  },
  {
    question: 'Mon restaurant fait du chiffre mais ne dégage pas de marge nette : pourquoi ?',
    answer: "Vous confondez chiffre d'affaires et bénéfice. Un restaurant peut afficher 800 000 EUR de CA et 0 EUR de marge nette si la totalité part en matières premières (240 000 EUR), salaires (320 000 EUR), loyer (80 000 EUR), énergie (40 000 EUR) et charges diverses (120 000 EUR). Le CA ne paie pas vos factures, c'est la marge nette. Auditer poste par poste est la première étape.",
  },
  {
    question: 'À partir de quel pourcentage de marge nette un restaurant est-il rentable ?',
    answer: "Un restaurant est viable au-delà de 5 % de marge nette, sain à 8-10 %, performant au-delà de 12 %. En dessous de 5 %, vous travaillez pour vos fournisseurs et vos employés. Un restaurant qui ferme l'année à 2 % de marge nette n'a pas de quoi investir, ni absorber un imprévu (panne, contrôle, conflit). C'est une zone fragile.",
  },
  {
    question: "Faut-il fermer un restaurant qui ne rapporte rien depuis 1 an ?",
    answer: "Pas forcément. Si la marge brute (CA - matières) est supérieure à 60 %, le potentiel existe et l'audit révélera le levier (souvent personnel ou pricing). Si la marge brute est inférieure à 50 %, le concept lui-même est défaillant : carte mal construite, mauvais ratio prix-coût, fournisseurs trop chers. Dans ce cas, soit pivot radical, soit fermeture proprement organisée pour limiter les pertes.",
  },
  {
    question: 'Comment savoir si le problème vient du food cost, du personnel ou de l\'occupation ?',
    answer: "Comparez vos 3 ratios clés aux benchmarks : food cost (cible 28-32 %), masse salariale (cible 30-38 %), taux d'occupation (cible 55-65 %). Le poste le plus éloigné du benchmark est votre problème principal. Un food cost à 38 % avec une masse salariale à 35 % et une occupation à 60 % indique clairement le matières premières comme priorité numéro 1.",
  },
  {
    question: 'Augmenter mes prix va-t-il faire fuir mes clients ?',
    answer: "Non, dans 80 % des cas. Une hausse de 5 à 8 % est rarement détectée par les clients fidèles. La peur d'augmenter les prix est psychologique chez le restaurateur, pas réelle chez le client. Sur 50 000 EUR de CA mensuel, une hausse de 7 % apporte 3 500 EUR de marge brute supplémentaire sans toucher au food cost. C'est souvent le levier le plus rapide et le plus sous-utilisé.",
  },
  {
    question: 'Quels sont les 3 chiffres à regarder chaque jour pour piloter la rentabilité ?',
    answer: "1) Le ticket moyen (le multiplier indirectement par l'upsell). 2) Le nombre de couverts servis (pour le revenu et la productivité). 3) Le food cost du jour (achats / ventes). Ces 3 indicateurs prennent 5 minutes à regarder et vous évitent 95 % des dérives. Toute autre métrique est secondaire.",
  },
  {
    question: 'Quel est le piège psychologique du restaurateur en difficulté ?',
    answer: "Le déni opérationnel. Le restaurateur épuisé compense en travaillant plus d'heures au lieu de regarder ses chiffres. 80 h/semaine sans data ne résout rien : on confond activité et productivité. La première étape de tout redressement est d'arrêter de courir pendant 4 heures, ouvrir un tableur, et calculer ses vrais ratios. C'est inconfortable mais salvateur.",
  },
  {
    question: 'RestauMargin peut-il vraiment aider un restaurant qui perd de l\'argent ?',
    answer: "Oui, en industrialisant le diagnostic. Au lieu de passer 30 heures sur un tableur, vous saisissez vos plats et vos ventes : food cost, marge par plat, alertes de dérive, identification des plats poids morts. L'outil ne corrige rien à votre place : il rend visibles les écarts, et ce sont les actions (fiches techniques, prix, achats, planning) qui font remonter la marge. Essai gratuit 7 jours sans carte.",
  },
];

export default function BlogPourquoiPasRentable() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Pourquoi mon restaurant ne rapporte-t-il pas d'argent ? 10 causes + solutions 2026"
        description="Votre restaurant tourne mais ne rapporte rien ? Diagnostic complet des 10 causes principales : food cost dérive, masse salariale, gaspillage, mauvaise carte, fournisseurs trop chers. Plan d'action concret."
        path="/blog/pourquoi-mon-restaurant-ne-rapporte-pas"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Pourquoi mon restaurant ne rapporte pas d\'argent', url: 'https://www.restaumargin.fr/blog/pourquoi-mon-restaurant-ne-rapporte-pas' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Diagnostic en 5 étapes pour identifier pourquoi votre restaurant ne rapporte pas',
            description: 'Méthode pas-à-pas pour identifier les causes de non-rentabilité d\'un restaurant en 5 minutes.',
            totalTime: 'PT5M',
            tool: ['Calculatrice', 'Compte de résultat', 'Relevé de banque', 'Factures fournisseurs', 'Plannings'],
            step: [
              { '@type': 'HowToStep', name: 'Calculer son food cost réel', text: 'Divisez vos achats matières premières du mois par votre CA HT du mois, multipliez par 100. Si supérieur à 35 %, c\'est le problème numéro 1.' },
              { '@type': 'HowToStep', name: 'Mesurer la masse salariale', text: 'Total salaires bruts + charges patronales du mois divisé par CA HT. Au-delà de 40 %, votre productivité est insuffisante.' },
              { '@type': 'HowToStep', name: 'Calculer le taux d\'occupation', text: 'Nombre de couverts servis / nombre de couverts théoriques sur la période. En dessous de 50 %, votre fixe (loyer, personnel base) est dilué.' },
              { '@type': 'HowToStep', name: 'Auditer la carte plat par plat', text: 'Pour chaque plat : food cost et popularité. Identifier les poids morts (impopulaires + peu rentables) à supprimer immédiatement.' },
              { '@type': 'HowToStep', name: 'Comparer aux benchmarks et prioriser', text: 'Le ratio le plus éloigné du benchmark est votre priorité numéro 1. Plan d\'action 30 jours sur ce seul levier.' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: "Pourquoi mon restaurant ne rapporte-t-il pas d'argent ? 10 causes + solutions 2026",
            description: 'Diagnostic complet des 10 causes principales de non-rentabilité en restauration : food cost, masse salariale, gaspillage, carte, fournisseurs. Plan d\'action concret 90 jours.',
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
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/pourquoi-mon-restaurant-ne-rapporte-pas' },
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
          <span className="text-mono-100 font-medium">Pourquoi mon restaurant ne rapporte pas</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <BlogArticleHero
        category="Rentabilité"
        readTime="15 min"
        date="Mai 2026"
        title="Pourquoi mon restaurant ne rapporte-t-il pas d'argent ? 10 causes + solutions"
        accentWord="Pourquoi"
        subtitle="Vous travaillez 70 heures par semaine, votre salle se remplit, et pourtant en fin de mois il ne reste rien. Vous n'êtes pas seul : 38 % des restaurants français ferment dans les 3 premières années pour les mêmes raisons. Voici le diagnostic complet et le plan d'action."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="15 min" variant="header" />

        {/* ── Featured snippet ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Réponse synthétique</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Pourquoi mon restaurant ne rapporte-t-il pas d'argent ?
          </h2>
          <p className="text-teal-50 text-base sm:text-lg leading-relaxed">
            Un restaurant ne rapporte pas d'argent généralement à cause de 4 facteurs principaux : un
            <strong className="text-white"> food cost trop élevé (&gt; 35 %)</strong>, une
            <strong className="text-white"> masse salariale qui dépasse 40 % du CA</strong>, un
            <strong className="text-white"> taux d'occupation insuffisant (&lt; 50 %)</strong>, ou une
            <strong className="text-white"> carte non optimisée</strong> (trop large, mauvais coefficient
            multiplicateur). <strong className="text-white">38 % des restaurants français ferment dans les
            3 premières années</strong> pour ces raisons. Un diagnostic data précis identifie le frein en
            moins de 7 jours.
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
              { href: '#introduction', label: "Pourquoi mon restaurant ne rapporte-t-il pas d'argent ?" },
              { href: '#savoir-rentable', label: 'Comment savoir si votre restaurant est rentable ou pas' },
              { href: '#causes', label: 'Les 10 causes principales d\'un restaurant non rentable' },
              { href: '#diagnostic', label: 'Diagnostic en 5 minutes : les questions à se poser' },
              { href: '#plan-action', label: 'Plan d\'action 90 jours pour redresser' },
              { href: '#cas-concret', label: 'Exemple illustratif : un bistrot de 0 % à 12 % de marge nette' },
              { href: '#fermer-ou-pas', label: 'Quand fermer vs persévérer ?' },
              { href: '#erreurs-psy', label: 'Erreurs psychologiques du restaurateur épuisé' },
              { href: '#faq', label: 'Questions fréquentes' },
              { href: '#cta', label: 'Faire le diagnostic gratuitement' },
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

        {/* ═════════════ SECTION 1 : Introduction ═════════════ */}
        <section id="introduction" className="mb-16">
          <SectionHeading icon={<Heart className="w-6 h-6" />} number="1">
            Pourquoi mon restaurant ne rapporte-t-il pas d'argent ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              Avant tout : si vous lisez cette page, vous êtes déjà en avance sur 60 % des restaurateurs
              en difficulté. Beaucoup compensent l'absence de rentabilité par plus d'heures travaillées,
              plus de stress, plus d'imprévus gérés en urgence. Vous avez choisi de poser le problème
              et de chercher des réponses. C'est exactement la bonne démarche.
            </p>
            <p>
              La vérité, c'est que la plupart des restaurants qui ne rapportent pas d'argent ne sont
              pas victimes d'une seule grande erreur. Ils accumulent <strong>4 à 6 petites dérives</strong> sur
              des ratios clés, et chacune grignote 1 à 3 points de marge nette. Cumulé, le restaurant
              passe de 10 % de marge à 0 % en l'espace de 12 à 18 mois, souvent sans que le propriétaire
              ne s'en rende compte.
            </p>
            <p>
              Selon les chiffres de l'INSEE et de la GIRA Conseil, <strong>38 % des restaurants français
              ferment dans les 3 premières années</strong>. La cause numéro 1 n'est ni le manque de talent
              culinaire, ni le manque de passion, ni même l'emplacement. C'est l'absence de pilotage
              financier au quotidien. Les restaurateurs qui survivent ne sont pas nécessairement les
              meilleurs cuisiniers : ce sont ceux qui regardent leurs chiffres.
            </p>

            <Callout type="info">
              <strong>Une bonne nouvelle :</strong> une dérive de ratios se corrige souvent en 90 à 180 jours
              sans changer de concept, sans changer d'équipe, et sans fermer. Il faut identifier le bon
              levier et agir avec discipline.
            </Callout>

            <p>
              Cet article vous donne les 10 causes principales de non-rentabilité, une méthode de
              diagnostic en 5 minutes, un plan d'action 90 jours, et un exemple illustratif chiffré
              de redressement. L'objectif : que vous puissiez fermer cet onglet en sachant exactement quoi faire
              demain matin.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Savoir si rentable ═════════════ */}
        <section id="savoir-rentable" className="mb-16">
          <SectionHeading icon={<Activity className="w-6 h-6" />} number="2">
            Comment savoir si votre restaurant est rentable ou pas
          </SectionHeading>

          <div className="prose-content">
            <p>
              Première étape, et probablement la plus inconfortable : <strong>regarder les vrais chiffres,
              sans filtre.</strong> Beaucoup de restaurateurs confondent "chiffre d'affaires qui rentre" et
              "argent qui reste". Voici la formule simple à appliquer.
            </p>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Formule de rentabilité</h3>
            <div className="bg-white border border-teal-200 rounded-xl p-5 font-mono text-sm sm:text-base space-y-2">
              <div className="text-mono-100"><strong>Marge nette (EUR)</strong> = CA HT - Matières - Personnel - Loyer - Énergie - Charges diverses - Amortissements - Impôts</div>
              <div className="text-mono-100"><strong>Marge nette (%)</strong> = Marge nette (EUR) / CA HT x 100</div>
            </div>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Auto-diagnostic en 4 questions</h3>
            <p>
              Répondez honnêtement à ces 4 questions. Si vous avez plus de 2 "non", votre restaurant
              n'est pas rentable au sens économique du terme :
            </p>
            <ul className="list-none space-y-3 mt-4">
              <DiagItem question="Pouvez-vous vous verser un salaire normal (au moins 2 500 EUR net/mois) en plus de vos charges sociales personnelles ?" />
              <DiagItem question="Avez-vous mis de côté au moins 5 000 EUR de trésorerie en plus du dépôt de garantie loyer cette année ?" />
              <DiagItem question="Pouvez-vous prendre 3 semaines de vacances sans que la trésorerie ne plonge dans le rouge ?" />
              <DiagItem question="Si une grosse panne survient demain (chambre froide, hotte, plonge), pouvez-vous la payer sans crédit ?" />
            </ul>
            <p className="mt-6">
              Si vous répondez "non" à au moins 2 questions, votre restaurant fonctionne mais ne dégage
              pas de vraie marge. C'est exactement le profil de la majorité des restaurants qui ferment
              au bout de 3 ans : ils tournent jusqu'à ce qu'un imprévu les fasse basculer.
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <MargeStatusCard
              status="Critique"
              range="< 2 %"
              color="red"
              desc="Zone de fermeture imminente. Toute hausse de coût (énergie, fournisseur) précipite le dépôt de bilan. Agir cette semaine."
            />
            <MargeStatusCard
              status="Fragile"
              range="2 - 5 %"
              color="amber"
              desc="Vous survivez. Pas de marge pour investir, pour vous payer correctement, ni pour absorber un imprévu. 90 jours pour améliorer."
            />
            <MargeStatusCard
              status="Sain"
              range="5 - 12 %"
              color="emerald"
              desc="Restaurant viable et bankable. Vous pouvez investir, vous rémunérer, encaisser des coups durs. Maintenir et optimiser."
            />
          </div>
        </section>

        {/* ═════════════ SECTION 3 : 10 causes ═════════════ */}
        <section id="causes" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="3">
            Les 10 causes principales d'un restaurant non rentable
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici, dans l'ordre de fréquence dans le secteur,
              les 10 causes principales d'un restaurant qui ne rapporte pas d'argent. Lisez attentivement
              chaque cause : votre problème principal est probablement dans les 3 premières.
            </p>
          </div>

          <div className="space-y-6 mt-10">
            <CauseCard
              number={1}
              title="Food cost &gt; 35 % : la cause numéro 1"
              benchmark="Cible : 25-32 % selon le type"
              desc="Le food cost (coût matières / CA) est le premier tueur de marge. Au-delà de 35 %, votre restaurant est mathématiquement condamné à souffrir. Causes typiques : portions non pesées (chefs trop généreux de 10-20 %), prix fournisseurs jamais actualisés, gaspillage non mesuré (5-10 % des achats partent à la poubelle), erreurs de cuisson, vols invisibles. La bonne nouvelle : c'est aussi le levier le plus rapide à redresser. Refaire 20 fiches techniques précises avec grammages exacts ramène généralement le food cost de 38 % à 30 % en 6 à 8 semaines. C'est 8 points de marge brute, soit 48 000 EUR/an sur un CA de 600 000 EUR."
              link={{ to: '/blog/reduire-food-cost', label: 'Lire : 10 stratégies pour réduire le food cost' }}
            />

            <CauseCard
              number={2}
              title="Masse salariale &gt; 40 % du CA"
              benchmark="Cible : 30-38 % selon le type"
              desc="Deuxième tueur de marge : trop d'heures de personnel pour pas assez de revenu. Causes : planning sur-staffé en heures creuses, productivité faible (couverts/heure/personne), turnover élevé qui force à re-former en permanence, répartition floue des tâches. Solution : timer chaque service pendant 1 semaine, identifier les créneaux où 1 personne suffit au lieu de 2, automatiser les tâches répétitives (caisse, prise de commande tablette). Passer de 42 % à 36 % de masse salariale = 36 000 EUR de marge supplémentaire sur un CA de 600 000 EUR."
              link={{ to: '/blog/reduire-cout-personnel-restaurant', label: 'Lire : comment réduire le coût du personnel' }}
            />

            <CauseCard
              number={3}
              title="Loyer trop cher (&gt; 10 % du CA)"
              benchmark="Cible : 6-9 % du CA HT"
              desc="Une erreur de bail signée il y a 5 ans peut couler un restaurant en 2026. Si votre loyer dépasse 10 % de votre CA HT, vous travaillez en grande partie pour votre bailleur. Solutions : renégocier le bail (un bailleur préfère un locataire qui paie 8 % plutôt que zéro), demander une révision à la baisse en cas de difficultés prouvées, envisager le declochement (vente du fonds et relocation ailleurs). Si vous êtes en pleine zone touristique à 14 % de loyer, soit vous augmentez vos prix de 15 %, soit vous bougez."
            />

            <CauseCard
              number={4}
              title="Gaspillage &gt; 5 % du stock"
              benchmark="Cible : moins de 2 % du CA"
              desc="Le gaspillage invisible est le voleur silencieux de votre marge. Causes : mauvais FIFO (premier entre, premier sorti), commandes mal calibrées, dates de péremption non suivies, parures et épluchures non intégrées aux fiches techniques. Si vous jetez 5 % de vos achats, c'est 5 % de food cost supplémentaire qui n'apparaît nulle part dans vos comptes. Solution : peser une fois par semaine ce qui part à la poubelle pendant 1 mois. Le simple fait de mesurer réduit le gaspillage de 30 à 50 %."
              link={{ to: '/blog/methode-fifo-gestion-stocks-restaurant', label: 'Lire : méthode FIFO pour réduire les pertes' }}
            />

            <CauseCard
              number={5}
              title="Carte trop large (cuisine inefficace)"
              benchmark="Cible : 20-30 plats max selon le type"
              desc="Une carte de 60 plats vend l'illusion du choix mais détruit votre rentabilité. Plus de stocks dormants, plus de gaspillage, plus de compétences à former, cuisine plus lente. La carte idéale : 3-4 entrées, 6-8 plats, 4-5 desserts, soit 15-17 lignes. Au-delà de 30 lignes, votre cuisine perd en efficacité. Solution : faire le menu engineering. Classer chaque plat en Star (forte marge + populaire), Cheval de labour (faible marge + populaire), Énigme (forte marge + impopulaire), Poids mort (faible marge + impopulaire). Supprimer les poids morts. Promouvoir les Stars. Re-fixer les prix des Chevaux. Une carte réduite de 40 à 22 plats peut faire gagner 4 à 6 points de marge nette."
            />

            <CauseCard
              number={6}
              title="Prix trop bas (peur d'augmenter)"
              benchmark="Coefficient cible : 3,0 - 4,0 selon le type"
              desc="C'est la cause psychologique numéro 1. Le restaurateur a peur de perdre des clients en augmentant ses prix de 1 ou 2 EUR. Réalité : dans 80 % des cas, une hausse de 5 à 8 % n'est pas détectée par les clients fidèles. Un plat à 16 EUR qui passe à 17 EUR (+6,3 %) avec un food cost de 5 EUR améliore votre marge brute de 11 EUR à 12 EUR (+9 %). Sur 30 000 plats vendus par an, c'est 30 000 EUR de marge brute supplémentaire. Cette peur coûte plus cher que la réalité."
              link={{ to: '/blog/fixer-prix-carte-restaurant', label: 'Lire : comment fixer les prix de sa carte' }}
            />

            <CauseCard
              number={7}
              title="Couverts trop bas (taux d'occupation &lt; 50 %)"
              benchmark="Cible : 55-65 % d'occupation moyenne"
              desc="Vos charges fixes (loyer, salaires de base, énergie minimum) sont les mêmes que la salle soit pleine ou à moitié vide. Si vous tournez à 35 % d'occupation, vous diluez votre fixe sur trop peu de couverts. Solutions : ouvrir un service supplémentaire si la demande existe (brunch, snacking entre 14h et 17h), créer des formules attractives midi/soir, améliorer la visibilité Google Business Profile et les avis, lancer un programme de fidélité, partenariats locaux. Passer de 40 % à 55 % d'occupation, c'est +37 % de chiffre d'affaires sans changer la salle."
              link={{ to: '/blog/taux-occupation-restaurant', label: 'Lire : taux d\'occupation restaurant' }}
            />

            <CauseCard
              number={8}
              title="Marketing inexistant (pas de fidélisation)"
              benchmark="Cible : 40 % de clients fidèles minimum"
              desc="Un client fidélisé coûte 5 à 10 fois moins cher qu'un nouveau client. Si vous n'avez pas de programme de fidélisation (carte tampon, CRM, newsletter, anniversaires), vous dépensez de l'énergie en acquisition pour combler une fuite. Solutions concrètes : récolter les emails (offre dessert offert contre email), envoyer 1 newsletter/mois avec un mot personnel, fidélité numérique simple (10 cafés = 1 offert), Google Business optimisé avec photos pro et réponses aux avis. Une base de 500 clients fidèles transforme une salle vide en service plein."
            />

            <CauseCard
              number={9}
              title="Pas de pilotage data (naviguer au pif)"
              benchmark="Cible : 3 KPI consultés / jour, 8 / semaine"
              desc="Beaucoup de restaurateurs découvrent leur food cost en fin d'année chez l'expert-comptable. C'est 12 mois trop tard. Pilotage minimum : ticket moyen quotidien, nombre de couverts, food cost mensuel, marge brute par plat. Sans data, vous gérez par intuition - et l'intuition est très mauvaise sur les chiffres financiers. C'est exactement la raison d'être d'un outil comme RestauMargin : automatiser le calcul et l'alerte, pour que vous voyiez les dérives au moment où elles surviennent et non 9 mois plus tard."
            />

            <CauseCard
              number={10}
              title="Concept flou (positionnement faible)"
              benchmark="Cible : 1 phrase qui résume tout"
              desc="Si vous ne savez pas résumer votre restaurant en une phrase, vos clients ne le savent pas non plus. Un bistrot qui essaie d'être à la fois traditionnel, italien, healthy et brunch n'attire personne spécifiquement. Le concept flou est souvent le symptôme d'une carte trop large et d'un manque de stratégie. Test simple : demandez à 10 clients fidèles 'pourquoi vous venez chez moi ?'. Si les réponses sont incohérentes, votre positionnement est faible. Résoudre cela = repenser la carte autour d'une promesse claire (ex: 'la meilleure bavette de Paris', 'le seul restaurant 100 % locavore du quartier', 'cuisine italienne authentique et abordable')."
            />
          </div>

          <Callout type="warning">
            <strong>Impact cumulé :</strong> ces 10 causes additionnées représentent souvent 15 à 25 points
            de marge nette envolés. C'est exactement la différence entre un restaurant qui ferme et un
            restaurant qui prospère. La bonne nouvelle : vous n'avez pas à tout corriger d'un coup. Une
            cause à la fois, 30 jours par cause, et 6 mois plus tard votre situation est transformée.
          </Callout>
        </section>

        {/* ═════════════ SECTION 4 : Diagnostic 5 min ═════════════ */}
        <section id="diagnostic" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="4">
            Diagnostic en 5 minutes : les questions à se poser
          </SectionHeading>

          <div className="prose-content">
            <p>
              Avant de mettre en place un plan d'action, identifiez précisément votre cause numéro 1.
              Le piège classique : essayer de tout faire en même temps et ne rien terminer. Répondez
              honnêtement aux 7 questions ci-dessous, en chiffrant.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Quel est mon food cost réel sur les 3 derniers mois ?',
                body: "Achats matières premières / CA HT x 100. Si vous ne pouvez pas répondre en chiffres, c'est déjà un symptôme. Sortir les factures fournisseurs et les Z de caisse des 3 derniers mois, calculer. Au-delà de 33 % en bistrot ou 38 % en gastro, action prioritaire.",
              },
              {
                title: 'Quelle est ma masse salariale en % du CA ?',
                body: "Salaires bruts + charges patronales / CA HT x 100, sur les 3 derniers mois. Au-delà de 40 % en bistrot ou 45 % en gastro, action prioritaire. Si vous êtes le seul à travailler et ne vous payez pas, n'oubliez pas d'intégrer un salaire virtuel pour avoir une vraie photo.",
              },
              {
                title: 'Quel est mon taux d\'occupation moyen ?',
                body: "Couverts servis / couverts théoriques disponibles (places x services x jours d'ouverture). En dessous de 50 %, le fixe est dilué. Au-dessus de 70 %, vous avez peut-être besoin d'agrandir ou d'ajouter un service.",
              },
              {
                title: 'Combien de plats sur ma carte rapportent vraiment ?',
                body: "Refaites le calcul de marge brute pour vos 10 plats les plus vendus. Vous serez surpris : souvent 2-3 plats portent toute la rentabilité, 4-5 sont neutres, et 2-3 détruisent de la marge. Ces derniers doivent disparaître.",
              },
              {
                title: 'Quand ai-je revu mes prix fournisseurs pour la dernière fois ?',
                body: "Si la réponse est 'il y a plus de 6 mois' ou 'je ne sais plus', c'est un problème. Les prix fournisseurs évoluent constamment. Mettre à jour 1 fois par trimestre minimum, idéalement en temps réel via OCR factures.",
              },
              {
                title: 'Quel pourcentage de mon stock part à la poubelle ?',
                body: "Si vous ne mesurez pas, supposez 5-8 %. Peser pendant 1 semaine ce qui finit en poubelle (déchets, parures, périmés). Vous découvrirez probablement 3 à 5 ingrédients qui représentent 80 % du gaspillage.",
              },
              {
                title: 'Combien de clients fidèles ai-je ? (qui viennent au moins 1 fois/mois)',
                body: "Estimer en regardant les visages familiers, les programmes de fidélité, les réservations récurrentes. Moins de 30 % de clients fidèles = problème de rétention. C'est très souvent lié au concept flou ou à l'expérience client incohérente.",
              },
            ].map((step, i) => (
              <li key={i} className="bg-white border border-mono-900 rounded-2xl p-6 sm:p-7 flex gap-5">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0 font-extrabold text-lg shadow-md">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-mono-100 text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-mono-400 leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <Callout type="info">
            <strong>Sortez votre carnet :</strong> notez vos 7 réponses. Le poste le plus éloigné du
            benchmark est votre priorité numéro 1. Pendant 30 jours, vous ne vous occuperez que de cette
            seule cause. Pas de saupoudrage, pas de tout-en-même-temps : 1 sujet, 30 jours, 100 % de
            l'attention.
          </Callout>
        </section>

        {/* ═════════════ SECTION 5 : Plan d'action 90j ═════════════ */}
        <section id="plan-action" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="5">
            Plan d'action 90 jours pour redresser
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici un plan d'action concret, semaine par semaine, applicable demain matin. Il est conçu
              pour un restaurant en zone fragile (marge nette 0-5 %) qui veut passer en zone saine
              (8-12 %) en 90 jours.
            </p>
          </div>

          <div className="mt-10 space-y-8">
            <PhaseCard
              phase="Mois 1"
              title="Diagnostic + quick wins"
              objective="Identifier la cause numéro 1 et obtenir +2 points de marge brute"
              actions={[
                "Semaine 1 : Audit complet (food cost, masse salariale, occupation, loyer, gaspillage)",
                "Semaine 2 : Refaire les 10 fiches techniques des plats les plus vendus",
                "Semaine 3 : Mesurer le gaspillage chaque jour, identifier les 3 ingrédients principaux",
                "Semaine 4 : Première passe de renégociation fournisseurs (3 fournisseurs prioritaires)",
              ]}
              expected="+2 à +3 points de marge brute sur la fin du mois 1"
              color="teal"
            />

            <PhaseCard
              phase="Mois 2"
              title="Refonte carte + optimisation opérationnelle"
              objective="Réduire la carte aux plats rentables et adapter les plannings"
              actions={[
                "Semaine 5 : Menu engineering complet (classifier les plats en 4 catégories)",
                "Semaine 6 : Nouvelle carte (suppression poids morts, mise en avant Stars)",
                "Semaine 7 : Timing précis du service, rédaction d'un nouveau planning optimisé",
                "Semaine 8 : Mise en place du suivi quotidien (3 KPI : ticket moyen, couverts, food cost)",
              ]}
              expected="+2 à +4 points de marge brute, -1 à -2 points de masse salariale"
              color="amber"
            />

            <PhaseCard
              phase="Mois 3"
              title="Repositionnement + fidélisation"
              objective="Augmenter le ticket moyen et le taux de retour client"
              actions={[
                "Semaine 9 : Hausse de prix maîtrisée (+5 à +8 % sur les Stars et Chevaux de labour)",
                "Semaine 10 : Programme de fidélisation simple (carte tampon ou CRM email)",
                "Semaine 11 : Optimisation Google Business Profile (photos pro, réponses aux avis)",
                "Semaine 12 : Bilan à 90 jours, mesure des KPI vs départ",
              ]}
              expected="+5 à +8 points de marge nette cumulés depuis le départ"
              color="emerald"
            />
          </div>

          <Callout type="warning">
            <strong>Discipline avant tout :</strong> ce plan ne fonctionne que si vous l'exécutez sans
            chercher à tout faire en même temps. Chaque semaine a UN objectif. Mieux vaut accomplir 1
            action à 100 % que 4 actions à 30 %. Bloquez 1 demi-journée par semaine pour les sujets de
            pilotage. Sans ce temps protégé, rien ne changera.
          </Callout>
        </section>

        {/* ═════════════ SECTION 6 : Cas concret ═════════════ */}
        <section id="cas-concret" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="6">
            Exemple illustratif : un bistrot de 0 % à 12 % de marge nette
          </SectionHeading>

          <div className="prose-content">
            <p>
              <strong>Exemple fictif, à titre d'illustration :</strong> un bistrot de 38 couverts, CA annuel
              580 000 EUR, ouvert depuis 4 ans. Marge nette de départ : 0,3 %, et le gérant ne se verse
              plus de salaire. Voici ce que les leviers décrits plus haut peuvent donner sur 6 mois.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Indicateur</th>
                  <th className="text-center py-3 px-4 font-semibold">Avant</th>
                  <th className="text-center py-3 px-4 font-semibold">Après 6 mois</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Gain</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white">
                  <td className="py-3 px-4 font-medium text-mono-100">Food cost</td>
                  <td className="py-3 px-4 text-center text-red-700">37 %</td>
                  <td className="py-3 px-4 text-center text-emerald-700">29 %</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-700">-8 pts</td>
                </tr>
                <tr className="bg-mono-1000">
                  <td className="py-3 px-4 font-medium text-mono-100">Masse salariale</td>
                  <td className="py-3 px-4 text-center text-red-700">42 %</td>
                  <td className="py-3 px-4 text-center text-emerald-700">36 %</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-700">-6 pts</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 font-medium text-mono-100">Taux d'occupation</td>
                  <td className="py-3 px-4 text-center text-red-700">43 %</td>
                  <td className="py-3 px-4 text-center text-emerald-700">58 %</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-700">+15 pts</td>
                </tr>
                <tr className="bg-mono-1000">
                  <td className="py-3 px-4 font-medium text-mono-100">Ticket moyen</td>
                  <td className="py-3 px-4 text-center">22,50 EUR</td>
                  <td className="py-3 px-4 text-center">26,80 EUR</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-700">+19 %</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 font-medium text-mono-100">Nombre de plats sur carte</td>
                  <td className="py-3 px-4 text-center">38</td>
                  <td className="py-3 px-4 text-center">22</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-700">-42 %</td>
                </tr>
                <tr className="bg-emerald-50">
                  <td className="py-3 px-4 font-bold text-emerald-900">Marge nette</td>
                  <td className="py-3 px-4 text-center font-bold text-red-700">0,3 %</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-900">12,1 %</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-900">+11,8 pts</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Les 5 actions de l'exemple</h3>
            <ol className="list-decimal list-inside space-y-3 text-mono-350">
              <li>
                <strong>Refonte de la carte de 38 à 22 plats :</strong> suppression des plats poids morts
                (steack-frites à la carte avec un food cost à 48 %, salade nicoise sous-vendue). Mise en
                avant des plats Stars (souris d'agneau, magret laqué).
              </li>
              <li>
                <strong>Hausse de prix de +8 % sur les Stars :</strong> bavette 19,50 EUR -&gt; 21 EUR.
                Si la fréquentation tient, c'est environ +2 800 EUR/mois de marge brute supplémentaire.
              </li>
              <li>
                <strong>Renégociation des 3 fournisseurs principaux :</strong> boucher (-7 %), maraîcher
                (-4 %), épicier (-6 %). Tonalité : "on est en difficulté, aidez-nous à tenir et on restera
                fidèles".
              </li>
              <li>
                <strong>Mise en place d'un service brunch le dimanche :</strong> 40 couverts à 26 EUR
                en moyenne pendant 4 heures avec 1 cuisinier + 2 service.
              </li>
              <li>
                <strong>CRM email simple :</strong> récolte d'email (offre dessert offert), envoi 1
                newsletter/mois pour faire revenir les clients.
              </li>
            </ol>
            <p className="mt-6">
              <strong>Ce que montre l'exemple :</strong> cumulés, ces leviers peuvent faire passer un
              établissement de ce profil de 0,3 % à environ 12 % de marge nette, soit de quoi rémunérer
              à nouveau le gérant. Sans fermeture, sans licenciement, sans changement de concept majeur :
              de la discipline sur les chiffres. Les résultats réels dépendent de chaque établissement.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : Fermer ou continuer ═════════════ */}
        <section id="fermer-ou-pas" className="mb-16">
          <SectionHeading icon={<Compass className="w-6 h-6" />} number="7">
            Quand fermer vs persévérer ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              C'est la question la plus dure. Tout le monde n'a pas vocation à se battre 6 mois pour
              redresser. Voici les critères factuels qui plaident pour la continuation, et ceux qui
              plaident pour la fermeture organisée.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Persévérer si...</h3>
              </div>
              <ul className="list-disc list-inside text-sm text-emerald-800 space-y-2">
                <li>Marge brute supérieure à 60 % (le concept est viable)</li>
                <li>Vous avez des clients fidèles (au moins 30 %)</li>
                <li>L'emplacement est bon (passage, visibilité)</li>
                <li>Le bail a moins de 5 ans restants</li>
                <li>Vous avez encore l'énergie pour 6 mois de discipline</li>
                <li>L'expert-comptable identifie 2-3 leviers clairs</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-red-700" />
                <h3 className="font-bold text-red-900">Fermer si...</h3>
              </div>
              <ul className="list-disc list-inside text-sm text-red-800 space-y-2">
                <li>Marge brute inférieure à 50 % (concept défaillant)</li>
                <li>Loyer supérieur à 15 % et bail bloqué</li>
                <li>Plus de 3 mois de loyer impayés en retard</li>
                <li>Burn-out sévère du propriétaire (santé prioritaire)</li>
                <li>Aucun client fidèle après 3 ans</li>
                <li>Zone en déclin (commerces qui ferment autour)</li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>Fermer n'est pas un échec.</strong> C'est parfois la décision la plus intelligente pour
            limiter les pertes financières et psychologiques. Une fermeture organisée avec un expert-
            comptable et un avocat permet de protéger votre patrimoine personnel et de rebondir. Beaucoup
            de restaurateurs ferment, prennent 6 mois pour digérer, et ouvrent un nouveau projet plus solide
            avec les leçons apprises.
          </Callout>
        </section>

        {/* ═════════════ SECTION 8 : Erreurs psy ═════════════ */}
        <section id="erreurs-psy" className="mb-16">
          <SectionHeading icon={<Brain className="w-6 h-6" />} number="8">
            Erreurs psychologiques du restaurateur épuisé
          </SectionHeading>

          <div className="prose-content">
            <p>
              Au-delà des chiffres, il y a des biais psychologiques qui maintiennent les restaurateurs
              dans la non-rentabilité. Les identifier est le premier pas pour les corriger.
            </p>
          </div>

          <div className="space-y-5 mt-8">
            <ErreurPsyCard
              title="Le déni opérationnel"
              desc="Travailler 80 heures par semaine pour compenser l'absence de pilotage. On confond activité et productivité. La première action de tout redressement n'est PAS de travailler plus, c'est de s'asseoir 4 heures et regarder ses chiffres en face."
            />
            <ErreurPsyCard
              title="La peur d'augmenter les prix"
              desc="Vous imaginez que tous vos clients vont fuir si vous passez la bavette de 18,50 EUR à 19,80 EUR. La réalité : 95 % ne le verront même pas. Cette peur coûte 30 000 EUR/an de marge non encaissée."
            />
            <ErreurPsyCard
              title="L'attachement aux plats du chef"
              desc="Vous gardez sur la carte un plat qui ne se vend pas parce qu'il vous tient à coeur. Chaque plat poids mort coûte 1 à 2 points de marge globale. Le menu n'est pas un musée : c'est un outil de vente."
            />
            <ErreurPsyCard
              title="La générosité mal calibrée"
              desc="Ajouter 30 g de viande supplémentaire sur chaque assiette par générosité représente 1 point de food cost. Sur 30 000 assiettes/an, c'est 6 000 EUR. La générosité se montre dans la qualité, l'accueil, le sourire, le service - pas dans les grammages."
            />
            <ErreurPsyCard
              title="L'évitement des chiffres"
              desc="Beaucoup de restaurateurs n'ouvrent leur expert-comptable qu'en fin d'année parce que c'est anxiogène. Résultat : les dérives ne sont vues que 6 à 9 mois trop tard. Regarder ses chiffres chaque semaine pendant 30 minutes évite 80 % des catastrophes."
            />
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="15 min" variant="footer" />

        {/* ═════════════ FAQ ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* ═════════════ CTA ═════════════ */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Faire le diagnostic de votre restaurant gratuitement
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Au lieu de calculer pendant 30 heures sur un tableur, RestauMargin automatise le food cost,
              la marge par plat, le menu engineering et les alertes de dérive.
            </p>
            <p className="text-teal-50 text-base max-w-xl mx-auto mb-8">
              <strong>29 EUR/mois</strong> &mdash; essai gratuit 7 jours, sans engagement, sans carte
              bancaire.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login?mode=register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 font-bold rounded-full hover:bg-teal-50 transition-colors text-lg shadow-lg"
              >
                Essai gratuit 7 jours
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/outils/calculateur-marge-restaurant"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
              >
                <Calculator className="w-5 h-5" />
                Calculateur gratuit
              </Link>
            </div>
          </div>
        </section>

        {/* ═════════════ Articles complementaires ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calcul marge restaurant</h3>
              <p className="text-xs text-mono-500">Guide complet : formules, food cost, marge brute et nette, benchmarks.</p>
            </Link>
            <Link to="/blog/seuil-rentabilite-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Seuil de rentabilité restaurant</h3>
              <p className="text-xs text-mono-500">Point mort, couverts nécessaires, formules et leviers pour réduire le seuil.</p>
            </Link>
            <Link to="/blog/prime-cost-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Prime cost restaurant</h3>
              <p className="text-xs text-mono-500">L'indicateur n1 : food cost + masse salariale, plan d'action pour le réduire.</p>
            </Link>
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Réduire le food cost</h3>
              <p className="text-xs text-mono-500">10 stratégies : fiches techniques, négociation, gaspillage, menu engineering.</p>
            </Link>
            <Link to="/blog/reduire-cout-personnel-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Réduire le coût du personnel</h3>
              <p className="text-xs text-mono-500">Planning optimisé, turnover, formation : 5 leviers pour réduire la masse salariale.</p>
            </Link>
            <Link to="/blog/taux-occupation-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Taux d'occupation restaurant</h3>
              <p className="text-xs text-mono-500">RevPASH, taux de remplissage, rotation des tables : 8 leviers concrets.</p>
            </Link>
          </div>
        </section>

        </article>

      </main>

      {/* ── Footer ── */}
      <PublicFooter />
    </div>
  );
}

/* ═══════════════ Sous-composants ═══════════════ */

function SectionHeading({ icon, number, children }: { icon: React.ReactNode; number: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-mono-100">
        <span className="text-teal-600 mr-2">{number}.</span>
        {children}
      </h2>
    </div>
  );
}

function DiagItem({ question }: { question: string }) {
  return (
    <li className="bg-white border border-mono-900 rounded-xl p-4 flex gap-3 items-start">
      <div className="w-6 h-6 bg-teal-100 text-teal-700 rounded-md flex items-center justify-center shrink-0 mt-0.5">
        <CheckCircle className="w-4 h-4" />
      </div>
      <p className="text-sm text-mono-350 leading-relaxed">{question}</p>
    </li>
  );
}

function MargeStatusCard({ status, range, color, desc }: { status: string; range: string; color: string; desc: string }) {
  const colors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
    red: { bg: 'bg-red-50', text: 'text-red-900', border: 'border-red-200', badge: 'bg-red-100 text-red-800' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-800' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-900', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-800' },
  };
  const c = colors[color];
  return (
    <div className={`${c.bg} ${c.border} border rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`font-bold ${c.text}`}>{status}</h3>
        <span className={`text-xs ${c.badge} px-2 py-0.5 rounded-full font-semibold`}>{range}</span>
      </div>
      <p className={`text-sm ${c.text} leading-relaxed opacity-90`}>{desc}</p>
    </div>
  );
}

function CauseCard({ number, title, benchmark, desc, link }: { number: number; title: string; benchmark: string; desc: string; link?: { to: string; label: string } }) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-6 sm:p-7 flex gap-5">
      <div className="w-12 h-12 bg-red-50 text-red-700 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-lg shadow-sm">
        {number}
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h3 className="font-bold text-mono-100 text-lg">{title}</h3>
          <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold">{benchmark}</span>
        </div>
        <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
        {link && (
          <Link to={link.to} className="inline-flex items-center gap-1 text-sm text-teal-700 font-semibold hover:text-teal-800 mt-3">
            {link.label}
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
}

function PhaseCard({ phase, title, objective, actions, expected, color }: { phase: string; title: string; objective: string; actions: string[]; expected: string; color: string }) {
  const colors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
    teal: { bg: 'bg-teal-50', text: 'text-teal-900', border: 'border-teal-200', badge: 'bg-teal-600 text-white' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-200', badge: 'bg-amber-600 text-white' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-900', border: 'border-emerald-200', badge: 'bg-emerald-600 text-white' },
  };
  const c = colors[color];
  return (
    <div className={`${c.bg} ${c.border} border rounded-2xl p-6 sm:p-8`}>
      <div className="flex items-center gap-3 mb-3">
        <span className={`${c.badge} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider`}>{phase}</span>
        <h3 className={`font-bold ${c.text} text-lg`}>{title}</h3>
      </div>
      <p className={`text-sm ${c.text} mb-4 opacity-90`}>
        <strong>Objectif :</strong> {objective}
      </p>
      <ul className={`space-y-2 text-sm ${c.text}`}>
        {actions.map((action, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
            <span className="opacity-90">{action}</span>
          </li>
        ))}
      </ul>
      <div className={`mt-4 pt-4 border-t border-current opacity-60`}>
        <p className={`text-sm ${c.text} font-semibold`}>
          Résultat attendu : <span className="font-bold">{expected}</span>
        </p>
      </div>
    </div>
  );
}

function ErreurPsyCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5 sm:p-6 flex gap-4">
      <div className="w-10 h-10 bg-purple-50 text-purple-700 rounded-xl flex items-center justify-center shrink-0">
        <Brain className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-semibold text-mono-100 mb-1.5">{title}</h3>
        <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function Callout({ type, children }: { type: 'info' | 'warning'; children: React.ReactNode }) {
  const styles = type === 'info'
    ? 'bg-blue-50 border-blue-200 text-blue-800'
    : 'bg-amber-50 border-amber-200 text-amber-800';
  const Icon = type === 'info' ? Lightbulb : AlertTriangle;
  return (
    <div className={`${styles} border rounded-xl p-5 my-6 flex gap-3 text-sm leading-relaxed`}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="bg-mono-1000 border border-mono-900 rounded-xl group">
      <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors">
        {q}
        <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform" />
      </summary>
      <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{a}</p>
    </details>
  );
}
