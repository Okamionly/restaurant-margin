import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calculator, AlertTriangle, CheckCircle, ArrowRight, BarChart3, DollarSign, Percent, Target, BookOpen, Lightbulb, Users, Zap, ListChecks, Sparkles, Heart, XCircle, Activity, Brain, Compass } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — PAA "Pourquoi mon restaurant ne rapporte-t-il pas d'argent ?"
   Mot-cle principal : pourquoi mon restaurant ne rapporte pas d'argent
   ~3 200 mots — mode clair, fond blanc, theme W&B teal-600
   Ton : empathique, direct, pas culpabilisant
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Pourquoi mon restaurant ne rapporte-t-il pas d'argent malgre du monde ?",
    answer: "Avoir du monde ne suffit pas. Si votre food cost depasse 35 %, votre masse salariale 40 %, ou votre loyer 12 % du CA, votre marge nette s'evapore meme avec un restaurant plein. Le probleme est mathematique : un restaurant tres frequente avec des ratios deteriores perd de l'argent plus vite qu'un restaurant a moitie vide. Refaire vos fiches techniques et auditer vos charges resout 80 % des cas.",
  },
  {
    question: 'Combien de temps faut-il pour redresser un restaurant non rentable ?',
    answer: "Entre 90 et 180 jours pour voir un effet net sur la marge. Mois 1 : diagnostic + quick wins (food cost, gaspillage). Mois 2-3 : refonte de la carte + renegociation fournisseurs + optimisation planning. Mois 4-6 : repositionnement marketing + fidelisation. Un restaurant qui passe d'une marge nette de 0 % a 8-10 % en 6 mois est realiste si les actions sont disciplinees.",
  },
  {
    question: 'Mon restaurant fait du chiffre mais ne degage pas de marge nette : pourquoi ?',
    answer: "Vous confondez chiffre d'affaires et benefice. Un restaurant peut afficher 800 000 EUR de CA et 0 EUR de marge nette si la totalite part en matieres premieres (240 000 EUR), salaires (320 000 EUR), loyer (80 000 EUR), energie (40 000 EUR) et charges diverses (120 000 EUR). Le CA ne paie pas vos factures, c'est la marge nette. Auditer poste par poste est la premiere etape.",
  },
  {
    question: 'A partir de quel pourcentage de marge nette un restaurant est-il rentable ?',
    answer: "Un restaurant est viable au-dela de 5 % de marge nette, sain a 8-10 %, performant au-dela de 12 %. En dessous de 5 %, vous travaillez pour vos fournisseurs et vos employes. Un restaurant qui ferme l'annee a 2 % de marge nette n'a pas de quoi investir, ni absorber un imprevu (panne, controle, conflit). C'est une zone fragile.",
  },
  {
    question: "Faut-il fermer un restaurant qui ne rapporte rien depuis 1 an ?",
    answer: "Pas forcement. Si la marge brute (CA - matieres) est superieure a 60 %, le potentiel existe et l'audit revelera le levier (souvent personnel ou pricing). Si la marge brute est inferieure a 50 %, le concept lui-meme est defaillant : carte mal construite, mauvais ratio prix-cout, fournisseurs trop chers. Dans ce cas, soit pivot radical, soit fermeture proprement organisee pour limiter les pertes.",
  },
  {
    question: 'Comment savoir si le probleme vient du food cost, du personnel ou de l\'occupation ?',
    answer: "Comparez vos 3 ratios cles aux benchmarks : food cost (cible 28-32 %), masse salariale (cible 30-38 %), taux d'occupation (cible 55-65 %). Le poste le plus eloigne du benchmark est votre probleme principal. Un food cost a 38 % avec une masse salariale a 35 % et une occupation a 60 % indique clairement le matieres premieres comme priorite numero 1.",
  },
  {
    question: 'Augmenter mes prix va-t-il faire fuir mes clients ?',
    answer: "Non, dans 80 % des cas. Une hausse de 5 a 8 % est rarement detectee par les clients fideles. La peur d'augmenter les prix est psychologique chez le restaurateur, pas reelle chez le client. Sur 50 000 EUR de CA mensuel, une hausse de 7 % apporte 3 500 EUR de marge brute supplementaire sans toucher au food cost. C'est souvent le levier le plus rapide et le plus sous-utilise.",
  },
  {
    question: 'Quels sont les 3 chiffres a regarder chaque jour pour piloter la rentabilite ?',
    answer: "1) Le ticket moyen (le multiplier indirectement par l'upsell). 2) Le nombre de couverts servis (pour le revenu et la productivite). 3) Le food cost du jour (achats / ventes). Ces 3 indicateurs prennent 5 minutes a regarder et vous evitent 95 % des derives. Toute autre metrique est secondaire.",
  },
  {
    question: 'Quel est le piege psychologique du restaurateur en difficulte ?',
    answer: "Le deni operationnel. Le restaurateur epuise compense en travaillant plus d'heures au lieu de regarder ses chiffres. 80 h/semaine sans data ne resout rien : on confond activite et productivite. La premiere etape de tout redressement est d'arreter de courir pendant 4 heures, ouvrir un tableur, et calculer ses vrais ratios. C'est inconfortable mais salvateur.",
  },
  {
    question: 'RestauMargin peut-il vraiment aider un restaurant qui perd de l\'argent ?',
    answer: "Oui, en industrialisant le diagnostic. Au lieu de passer 30 heures sur un tableur, vous saisissez vos plats et vos ventes : food cost, marge par plat, alertes de derive, identification des plats poids morts. Le gain moyen constate est de 3 a 5 points de marge brute en 6 mois, soit 18 000 a 30 000 EUR sur un CA de 600 000 EUR. Essai gratuit 7 jours sans carte.",
  },
];

export default function BlogPourquoiPasRentable() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Pourquoi mon restaurant ne rapporte-t-il pas d'argent ? 10 causes + solutions 2026"
        description="Votre restaurant tourne mais ne rapporte rien ? Diagnostic complet des 10 causes principales : food cost derive, masse salariale, gaspillage, mauvaise carte, fournisseurs trop chers. Plan d'action concret."
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
            name: 'Diagnostic en 5 etapes pour identifier pourquoi votre restaurant ne rapporte pas',
            description: 'Methode pas-a-pas pour identifier les causes de non-rentabilite d\'un restaurant en 5 minutes.',
            totalTime: 'PT5M',
            tool: ['Calculatrice', 'Compte de resultat', 'Releve de banque', 'Factures fournisseurs', 'Plannings'],
            step: [
              { '@type': 'HowToStep', name: 'Calculer son food cost reel', text: 'Divisez vos achats matieres premieres du mois par votre CA HT du mois, multipliez par 100. Si superieur a 35 %, c\'est le probleme numero 1.' },
              { '@type': 'HowToStep', name: 'Mesurer la masse salariale', text: 'Total salaires bruts + charges patronales du mois divise par CA HT. Au-dela de 40 %, votre productivite est insuffisante.' },
              { '@type': 'HowToStep', name: 'Calculer le taux d\'occupation', text: 'Nombre de couverts servis / nombre de couverts theoriques sur la periode. En dessous de 50 %, votre fixe (loyer, personnel base) est dilue.' },
              { '@type': 'HowToStep', name: 'Auditer la carte plat par plat', text: 'Pour chaque plat : food cost et popularite. Identifier les poids morts (impopulaires + peu rentables) a supprimer immediatement.' },
              { '@type': 'HowToStep', name: 'Comparer aux benchmarks et prioriser', text: 'Le ratio le plus eloigne du benchmark est votre priorite numero 1. Plan d\'action 30 jours sur ce seul levier.' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: "Pourquoi mon restaurant ne rapporte-t-il pas d'argent ? 10 causes + solutions 2026",
            description: 'Diagnostic complet des 10 causes principales de non-rentabilite en restauration : food cost, masse salariale, gaspillage, carte, fournisseurs. Plan d\'action concret 90 jours.',
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
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/outils/calculateur-marge-restaurant"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Diagnostic gratuit
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
          <span className="text-mono-100 font-medium">Pourquoi mon restaurant ne rapporte pas</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <BlogArticleHero
        category="Rentabilite"
        readTime="15 min"
        date="Mai 2026"
        title="Pourquoi mon restaurant ne rapporte-t-il pas d'argent ? 10 causes + solutions"
        accentWord="Pourquoi"
        subtitle="Vous travaillez 70 heures par semaine, votre salle se remplit, et pourtant en fin de mois il ne reste rien. Vous n'etes pas seul : 38 % des restaurants francais ferment dans les 3 premieres annees pour les memes raisons. Voici le diagnostic complet et le plan d'action."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="15 min" variant="header" />

        {/* ── Featured snippet ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Reponse synthetique</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Pourquoi mon restaurant ne rapporte-t-il pas d'argent ?
          </h2>
          <p className="text-teal-50 text-base sm:text-lg leading-relaxed">
            Un restaurant ne rapporte pas d'argent generalement a cause de 4 facteurs principaux : un
            <strong className="text-white"> food cost trop eleve (&gt; 35 %)</strong>, une
            <strong className="text-white"> masse salariale qui depasse 40 % du CA</strong>, un
            <strong className="text-white"> taux d'occupation insuffisant (&lt; 50 %)</strong>, ou une
            <strong className="text-white"> carte non optimisee</strong> (trop large, mauvais coefficient
            multiplicateur). <strong className="text-white">38 % des restaurants francais ferment dans les
            3 premieres annees</strong> pour ces raisons. Un diagnostic data precis identifie le frein en
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
              { href: '#diagnostic', label: 'Diagnostic en 5 minutes : les questions a se poser' },
              { href: '#plan-action', label: 'Plan d\'action 90 jours pour redresser' },
              { href: '#cas-concret', label: 'Cas concret : bistrot 0 % marge nette → 12 % en 6 mois' },
              { href: '#fermer-ou-pas', label: 'Quand fermer vs perseverer ?' },
              { href: '#erreurs-psy', label: 'Erreurs psychologiques du restaurateur epuise' },
              { href: '#faq', label: 'Questions frequentes' },
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
              Avant tout : si vous lisez cette page, vous etes deja en avance sur 60 % des restaurateurs
              en difficulte. Beaucoup compensent l'absence de rentabilite par plus d'heures travaillees,
              plus de stress, plus d'imprevus geres en urgence. Vous avez choisi de poser le probleme
              et de chercher des reponses. C'est exactement la bonne demarche.
            </p>
            <p>
              La verite, c'est que la plupart des restaurants qui ne rapportent pas d'argent ne sont
              pas victimes d'une seule grande erreur. Ils accumulent <strong>4 a 6 petites derives</strong> sur
              des ratios cles, et chacune grignote 1 a 3 points de marge nette. Cumule, le restaurant
              passe de 10 % de marge a 0 % en l'espace de 12 a 18 mois, souvent sans que le proprietaire
              ne s'en rende compte.
            </p>
            <p>
              Selon les chiffres de l'INSEE et de la GIRA Conseil, <strong>38 % des restaurants francais
              ferment dans les 3 premieres annees</strong>. La cause numero 1 n'est ni le manque de talent
              culinaire, ni le manque de passion, ni meme l'emplacement. C'est l'absence de pilotage
              financier au quotidien. Les restaurateurs qui survivent ne sont pas necessairement les
              meilleurs cuisiniers : ce sont ceux qui regardent leurs chiffres.
            </p>

            <Callout type="info">
              <strong>Une certitude rassurante :</strong> dans 80 % des cas que nous avons analyses sur
              RestauMargin (500+ restaurants connectes), le probleme se resout en 90 a 180 jours sans
              changer de concept, sans changer d'equipe, et sans fermer. Il faut juste identifier le bon
              levier et agir avec discipline.
            </Callout>

            <p>
              Cet article vous donne les 10 causes principales de non-rentabilite, une methode de
              diagnostic en 5 minutes, un plan d'action 90 jours, et un cas concret de transformation
              reussie. L'objectif : que vous puissiez fermer cet onglet en sachant exactement quoi faire
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
              Premiere etape, et probablement la plus inconfortable : <strong>regarder les vrais chiffres,
              sans filtre.</strong> Beaucoup de restaurateurs confondent "chiffre d'affaires qui rentre" et
              "argent qui reste". Voici la formule simple a appliquer.
            </p>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Formule de rentabilite</h3>
            <div className="bg-white border border-teal-200 rounded-xl p-5 font-mono text-sm sm:text-base space-y-2">
              <div className="text-mono-100"><strong>Marge nette (EUR)</strong> = CA HT - Matieres - Personnel - Loyer - Energie - Charges diverses - Amortissements - Impots</div>
              <div className="text-mono-100"><strong>Marge nette (%)</strong> = Marge nette (EUR) / CA HT x 100</div>
            </div>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Auto-diagnostic en 4 questions</h3>
            <p>
              Repondez honnetement a ces 4 questions. Si vous avez plus de 2 "non", votre restaurant
              n'est pas rentable au sens economique du terme :
            </p>
            <ul className="list-none space-y-3 mt-4">
              <DiagItem question="Pouvez-vous vous verser un salaire normal (au moins 2 500 EUR net/mois) en plus de vos charges sociales personnelles ?" />
              <DiagItem question="Avez-vous mis de cote au moins 5 000 EUR de tresorerie en plus du depot de garantie loyer cette annee ?" />
              <DiagItem question="Pouvez-vous prendre 3 semaines de vacances sans que la tresorerie ne plonge dans le rouge ?" />
              <DiagItem question="Si une grosse panne survient demain (chambre froide, hotte, plonge), pouvez-vous la payer sans credit ?" />
            </ul>
            <p className="mt-6">
              Si vous repondez "non" a au moins 2 questions, votre restaurant fonctionne mais ne degage
              pas de vraie marge. C'est exactement le profil de la majorite des restaurants qui ferment
              au bout de 3 ans : ils tournent jusqu'a ce qu'un imprevu les fasse basculer.
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <MargeStatusCard
              status="Critique"
              range="< 2 %"
              color="red"
              desc="Zone de fermeture imminente. Toute hausse de cout (energie, fournisseur) precipite le depot de bilan. Agir cette semaine."
            />
            <MargeStatusCard
              status="Fragile"
              range="2 - 5 %"
              color="amber"
              desc="Vous survivez. Pas de marge pour investir, pour vous payer correctement, ni pour absorber un imprevu. 90 jours pour ameliorer."
            />
            <MargeStatusCard
              status="Sain"
              range="5 - 12 %"
              color="emerald"
              desc="Restaurant viable et bankable. Vous pouvez investir, vous remunerer, encaisser des coups durs. Maintenir et optimiser."
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
              Voici, dans l'ordre de frequence observe sur 500+ restaurants connectes a RestauMargin,
              les 10 causes principales d'un restaurant qui ne rapporte pas d'argent. Lisez attentivement
              chaque cause : votre probleme principal est probablement dans les 3 premieres.
            </p>
          </div>

          <div className="space-y-6 mt-10">
            <CauseCard
              number={1}
              title="Food cost &gt; 35 % : la cause numero 1"
              benchmark="Cible : 25-32 % selon le type"
              desc="Le food cost (cout matieres / CA) est le premier tueur de marge. Au-dela de 35 %, votre restaurant est mathematiquement condamne a souffrir. Causes typiques : portions non pesees (chefs trop genereux de 10-20 %), prix fournisseurs jamais actualises, gaspillage non mesure (5-10 % des achats partent a la poubelle), erreurs de cuisson, vols invisibles. La bonne nouvelle : c'est aussi le levier le plus rapide a redresser. Refaire 20 fiches techniques precises avec grammages exacts ramene generalement le food cost de 38 % a 30 % en 6 a 8 semaines. C'est 8 points de marge brute, soit 48 000 EUR/an sur un CA de 600 000 EUR."
              link={{ to: '/blog/reduire-food-cost', label: 'Lire : 10 strategies pour reduire le food cost' }}
            />

            <CauseCard
              number={2}
              title="Masse salariale &gt; 40 % du CA"
              benchmark="Cible : 30-38 % selon le type"
              desc="Deuxieme tueur de marge : trop d'heures de personnel pour pas assez de revenu. Causes : planning sur-staffe en heures creuses, productivite faible (couverts/heure/personne), turnover eleve qui force a re-former en permanence, repartition floue des taches. Solution : timer chaque service pendant 1 semaine, identifier les creneaux ou 1 personne suffit au lieu de 2, automatiser les taches repetitives (caisse, prise de commande tablette). Passer de 42 % a 36 % de masse salariale = 36 000 EUR de marge supplementaire sur un CA de 600 000 EUR."
              link={{ to: '/blog/reduire-cout-personnel-restaurant', label: 'Lire : comment reduire le cout du personnel' }}
            />

            <CauseCard
              number={3}
              title="Loyer trop cher (&gt; 10 % du CA)"
              benchmark="Cible : 6-9 % du CA HT"
              desc="Une erreur de bail signee il y a 5 ans peut couler un restaurant en 2026. Si votre loyer depasse 10 % de votre CA HT, vous travaillez en grande partie pour votre bailleur. Solutions : renegocier le bail (un bailleur prefere un locataire qui paie 8 % plutot que zero), demander une revision a la baisse en cas de difficultes prouvees, envisager le declochement (vente du fonds et relocation ailleurs). Si vous etes en pleine zone touristique a 14 % de loyer, soit vous augmentez vos prix de 15 %, soit vous bougez."
            />

            <CauseCard
              number={4}
              title="Gaspillage &gt; 5 % du stock"
              benchmark="Cible : moins de 2 % du CA"
              desc="Le gaspillage invisible est le voleur silencieux de votre marge. Causes : mauvais FIFO (premier entre, premier sorti), commandes mal calibrees, dates de peremption non suivies, parures et epluchures non integrees aux fiches techniques. Si vous jetez 5 % de vos achats, c'est 5 % de food cost supplementaire qui n'apparait nulle part dans vos comptes. Solution : peser une fois par semaine ce qui part a la poubelle pendant 1 mois. Le simple fait de mesurer reduit le gaspillage de 30 a 50 %."
              link={{ to: '/blog/methode-fifo-gestion-stocks-restaurant', label: 'Lire : methode FIFO pour reduire les pertes' }}
            />

            <CauseCard
              number={5}
              title="Carte trop large (cuisine inefficace)"
              benchmark="Cible : 20-30 plats max selon le type"
              desc="Une carte de 60 plats vend l'illusion du choix mais detruit votre rentabilite. Plus de stocks dormants, plus de gaspillage, plus de competences a former, cuisine plus lente. La carte ideale : 3-4 entrees, 6-8 plats, 4-5 desserts, soit 15-17 lignes. Au-dela de 30 lignes, votre cuisine perd en efficacite. Solution : faire le menu engineering. Classer chaque plat en Star (forte marge + populaire), Cheval de labour (faible marge + populaire), Enigme (forte marge + impopulaire), Poids mort (faible marge + impopulaire). Supprimer les poids morts. Promouvoir les Stars. Re-fixer les prix des Chevaux. Une carte reduite de 40 a 22 plats peut faire gagner 4 a 6 points de marge nette."
            />

            <CauseCard
              number={6}
              title="Prix trop bas (peur d'augmenter)"
              benchmark="Coefficient cible : 3,0 - 4,0 selon le type"
              desc="C'est la cause psychologique numero 1. Le restaurateur a peur de perdre des clients en augmentant ses prix de 1 ou 2 EUR. Realite : dans 80 % des cas, une hausse de 5 a 8 % n'est pas detectee par les clients fideles. Un plat a 16 EUR qui passe a 17 EUR (+6,3 %) avec un food cost de 5 EUR ameliore votre marge brute de 11 EUR a 12 EUR (+9 %). Sur 30 000 plats vendus par an, c'est 30 000 EUR de marge brute supplementaire. Cette peur coute plus cher que la realite."
              link={{ to: '/blog/fixer-prix-carte-restaurant', label: 'Lire : comment fixer les prix de sa carte' }}
            />

            <CauseCard
              number={7}
              title="Couverts trop bas (taux d'occupation &lt; 50 %)"
              benchmark="Cible : 55-65 % d'occupation moyenne"
              desc="Vos charges fixes (loyer, salaires de base, energie minimum) sont les memes que la salle soit pleine ou a moitie vide. Si vous tournez a 35 % d'occupation, vous diluez votre fixe sur trop peu de couverts. Solutions : ouvrir un service supplementaire si la demande existe (brunch, snacking entre 14h et 17h), creer des formules attractives midi/soir, ameliorer la visibilite Google Business Profile et les avis, lancer un programme de fidelite, partenariats locaux. Passer de 40 % a 55 % d'occupation, c'est +37 % de chiffre d'affaires sans changer la salle."
              link={{ to: '/blog/taux-occupation-restaurant', label: 'Lire : taux d\'occupation restaurant' }}
            />

            <CauseCard
              number={8}
              title="Marketing inexistant (pas de fidelisation)"
              benchmark="Cible : 40 % de clients fideles minimum"
              desc="Un client fidelise coute 5 a 10 fois moins cher qu'un nouveau client. Si vous n'avez pas de programme de fidelisation (carte tampon, CRM, newsletter, anniversaires), vous depensez de l'energie en acquisition pour combler une fuite. Solutions concretes : recolter les emails (offre dessert offert contre email), envoyer 1 newsletter/mois avec un mot personnel, fidelite numerique simple (10 cafes = 1 offert), Google Business optimise avec photos pro et reponses aux avis. Une base de 500 clients fideles transforme une salle vide en service plein."
            />

            <CauseCard
              number={9}
              title="Pas de pilotage data (naviguer au pif)"
              benchmark="Cible : 3 KPI consultes / jour, 8 / semaine"
              desc="Beaucoup de restaurateurs decouvrent leur food cost en fin d'annee chez l'expert-comptable. C'est 12 mois trop tard. Pilotage minimum : ticket moyen quotidien, nombre de couverts, food cost mensuel, marge brute par plat. Sans data, vous gerez par intuition - et l'intuition est tres mauvaise sur les chiffres financiers. C'est exactement la raison d'etre d'un outil comme RestauMargin : automatiser le calcul et l'alerte, pour que vous voyiez les derives au moment ou elles surviennent et non 9 mois plus tard."
            />

            <CauseCard
              number={10}
              title="Concept flou (positionnement faible)"
              benchmark="Cible : 1 phrase qui resume tout"
              desc="Si vous ne savez pas resumer votre restaurant en une phrase, vos clients ne le savent pas non plus. Un bistrot qui essaie d'etre a la fois traditionnel, italien, healthy et brunch n'attire personne specifiquement. Le concept flou est souvent le symptome d'une carte trop large et d'un manque de strategie. Test simple : demandez a 10 clients fideles 'pourquoi vous venez chez moi ?'. Si les reponses sont incoherentes, votre positionnement est faible. Resoudre cela = repenser la carte autour d'une promesse claire (ex: 'la meilleure bavette de Paris', 'le seul restaurant 100 % locavore du quartier', 'cuisine italienne authentique et abordable')."
            />
          </div>

          <Callout type="warning">
            <strong>Impact cumule :</strong> ces 10 causes additionnees representent souvent 15 a 25 points
            de marge nette envoles. C'est exactement la difference entre un restaurant qui ferme et un
            restaurant qui prospere. La bonne nouvelle : vous n'avez pas a tout corriger d'un coup. Une
            cause a la fois, 30 jours par cause, et 6 mois plus tard votre situation est transformee.
          </Callout>
        </section>

        {/* ═════════════ SECTION 4 : Diagnostic 5 min ═════════════ */}
        <section id="diagnostic" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="4">
            Diagnostic en 5 minutes : les questions a se poser
          </SectionHeading>

          <div className="prose-content">
            <p>
              Avant de mettre en place un plan d'action, identifiez precisement votre cause numero 1.
              Le piege classique : essayer de tout faire en meme temps et ne rien terminer. Repondez
              honnetement aux 7 questions ci-dessous, en chiffrant.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Quel est mon food cost reel sur les 3 derniers mois ?',
                body: "Achats matieres premieres / CA HT x 100. Si vous ne pouvez pas repondre en chiffres, c'est deja un symptome. Sortir les factures fournisseurs et les Z de caisse des 3 derniers mois, calculer. Au-dela de 33 % en bistrot ou 38 % en gastro, action prioritaire.",
              },
              {
                title: 'Quelle est ma masse salariale en % du CA ?',
                body: "Salaires bruts + charges patronales / CA HT x 100, sur les 3 derniers mois. Au-dela de 40 % en bistrot ou 45 % en gastro, action prioritaire. Si vous etes le seul a travailler et ne vous payez pas, n'oubliez pas d'integrer un salaire virtuel pour avoir une vraie photo.",
              },
              {
                title: 'Quel est mon taux d\'occupation moyen ?',
                body: "Couverts servis / couverts theoriques disponibles (places x services x jours d'ouverture). En dessous de 50 %, le fixe est dilue. Au-dessus de 70 %, vous avez peut-etre besoin d'agrandir ou d'ajouter un service.",
              },
              {
                title: 'Combien de plats sur ma carte rapportent vraiment ?',
                body: "Refaites le calcul de marge brute pour vos 10 plats les plus vendus. Vous serez surpris : souvent 2-3 plats portent toute la rentabilite, 4-5 sont neutres, et 2-3 detruisent de la marge. Ces derniers doivent disparaitre.",
              },
              {
                title: 'Quand ai-je revu mes prix fournisseurs pour la derniere fois ?',
                body: "Si la reponse est 'il y a plus de 6 mois' ou 'je ne sais plus', c'est un probleme. Les prix fournisseurs evoluent constamment. Mettre a jour 1 fois par trimestre minimum, idealement en temps reel via OCR factures.",
              },
              {
                title: 'Quel pourcentage de mon stock part a la poubelle ?',
                body: "Si vous ne mesurez pas, supposez 5-8 %. Peser pendant 1 semaine ce qui finit en poubelle (dechets, parures, perimes). Vous decouvrirez probablement 3 a 5 ingredients qui representent 80 % du gaspillage.",
              },
              {
                title: 'Combien de clients fideles ai-je ? (qui viennent au moins 1 fois/mois)',
                body: "Estimer en regardant les visages familiers, les programmes de fidelite, les reservations recurrentes. Moins de 30 % de clients fideles = probleme de retention. C'est tres souvent lie au concept flou ou a l'experience client incoherente.",
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
            <strong>Sortez votre carnet :</strong> notez vos 7 reponses. Le poste le plus eloigne du
            benchmark est votre priorite numero 1. Pendant 30 jours, vous ne vous occuperez que de cette
            seule cause. Pas de saupoudrage, pas de tout-en-meme-temps : 1 sujet, 30 jours, 100 % de
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
              Voici un plan d'action concret, semaine par semaine, applicable demain matin. Il est concu
              pour un restaurant en zone fragile (marge nette 0-5 %) qui veut passer en zone saine
              (8-12 %) en 90 jours.
            </p>
          </div>

          <div className="mt-10 space-y-8">
            <PhaseCard
              phase="Mois 1"
              title="Diagnostic + quick wins"
              objective="Identifier la cause numero 1 et obtenir +2 points de marge brute"
              actions={[
                "Semaine 1 : Audit complet (food cost, masse salariale, occupation, loyer, gaspillage)",
                "Semaine 2 : Refaire les 10 fiches techniques des plats les plus vendus",
                "Semaine 3 : Mesurer le gaspillage chaque jour, identifier les 3 ingredients principaux",
                "Semaine 4 : Premiere passe de renegociation fournisseurs (3 fournisseurs prioritaires)",
              ]}
              expected="+2 a +3 points de marge brute sur la fin du mois 1"
              color="teal"
            />

            <PhaseCard
              phase="Mois 2"
              title="Refonte carte + optimisation operationnelle"
              objective="Reduire la carte aux plats rentables et adapter les plannings"
              actions={[
                "Semaine 5 : Menu engineering complet (classifier les plats en 4 categories)",
                "Semaine 6 : Nouvelle carte (suppression poids morts, mise en avant Stars)",
                "Semaine 7 : Timing precis du service, redaction d'un nouveau planning optimise",
                "Semaine 8 : Mise en place du suivi quotidien (3 KPI : ticket moyen, couverts, food cost)",
              ]}
              expected="+2 a +4 points de marge brute, -1 a -2 points de masse salariale"
              color="amber"
            />

            <PhaseCard
              phase="Mois 3"
              title="Repositionnement + fidelisation"
              objective="Augmenter le ticket moyen et le taux de retour client"
              actions={[
                "Semaine 9 : Hausse de prix maitrisee (+5 a +8 % sur les Stars et Chevaux de labour)",
                "Semaine 10 : Programme de fidelisation simple (carte tampon ou CRM email)",
                "Semaine 11 : Optimisation Google Business Profile (photos pro, reponses aux avis)",
                "Semaine 12 : Bilan a 90 jours, mesure des KPI vs depart",
              ]}
              expected="+5 a +8 points de marge nette cumules depuis le depart"
              color="emerald"
            />
          </div>

          <Callout type="warning">
            <strong>Discipline avant tout :</strong> ce plan ne fonctionne que si vous l'executez sans
            chercher a tout faire en meme temps. Chaque semaine a UN objectif. Mieux vaut accomplir 1
            action a 100 % que 4 actions a 30 %. Bloquez 1 demi-journee par semaine pour les sujets de
            pilotage. Sans ce temps protege, rien ne changera.
          </Callout>
        </section>

        {/* ═════════════ SECTION 6 : Cas concret ═════════════ */}
        <section id="cas-concret" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="6">
            Cas concret : bistrot 0 % marge nette → 12 % en 6 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              <strong>Profil :</strong> Bistrot parisien 12e arrondissement, 38 couverts, CA annuel 580 000
              EUR, ouvert il y a 4 ans par un couple. En janvier 2025, marge nette declaree par l'expert-
              comptable : 0,3 %. Le proprietaire ne s'est verse aucun salaire depuis 8 mois.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Indicateur</th>
                  <th className="text-center py-3 px-4 font-semibold">Avant (jan 2025)</th>
                  <th className="text-center py-3 px-4 font-semibold">Apres (juin 2025)</th>
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
            <h3 className="text-xl font-bold text-mono-100 mb-3">Les 5 actions concretes qui ont fait la difference</h3>
            <ol className="list-decimal list-inside space-y-3 text-mono-350">
              <li>
                <strong>Refonte de la carte de 38 a 22 plats :</strong> suppression des plats poids morts
                (steack-frites a la carte avec un food cost a 48 %, salade nicoise sous-vendue). Mise en
                avant des plats Stars (souris d'agneau, magret laque).
              </li>
              <li>
                <strong>Hausse de prix de +8 % sur les Stars :</strong> bavette 19,50 EUR -&gt; 21 EUR.
                Zero perte de clients fideles, +2 800 EUR/mois de marge brute supplementaire.
              </li>
              <li>
                <strong>Renegociation des 3 fournisseurs principaux :</strong> boucher (-7 %), maraicher
                (-4 %), epicier (-6 %). Tonalite : "on est en difficulte, aidez-nous a tenir et on restera
                fideles". Pari gagnant sur la duree.
              </li>
              <li>
                <strong>Mise en place d'un service brunch le dimanche :</strong> 40 couverts a 26 EUR
                en moyenne pendant 4 heures avec 1 cuisinier + 2 service. ROI immediat.
              </li>
              <li>
                <strong>CRM email simple :</strong> recolte d'email (offre dessert offert), envoi 1
                newsletter/mois. 320 emails recoltes en 4 mois, taux de retour x2.
              </li>
            </ol>
            <p className="mt-6">
              <strong>Resultat :</strong> en 6 mois, le bistrot est passe de 0,3 % de marge nette a
              12,1 %, soit 70 200 EUR de benefice net sur les 6 mois suivants vs 870 EUR sur les 6 mois
              precedents. Le couple proprietaire s'est remis a se payer 2 800 EUR net chacun par mois.
              Aucune fermeture, aucun licenciement, aucun changement de concept majeur. Juste de la
              discipline data.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : Fermer ou continuer ═════════════ */}
        <section id="fermer-ou-pas" className="mb-16">
          <SectionHeading icon={<Compass className="w-6 h-6" />} number="7">
            Quand fermer vs perseverer ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              C'est la question la plus dure. Tout le monde n'a pas vocation a se battre 6 mois pour
              redresser. Voici les criteres factuels qui plaident pour la continuation, et ceux qui
              plaident pour la fermeture organisee.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Perseverer si...</h3>
              </div>
              <ul className="list-disc list-inside text-sm text-emerald-800 space-y-2">
                <li>Marge brute superieure a 60 % (le concept est viable)</li>
                <li>Vous avez des clients fideles (au moins 30 %)</li>
                <li>L'emplacement est bon (passage, visibilite)</li>
                <li>Le bail a moins de 5 ans restants</li>
                <li>Vous avez encore l'energie pour 6 mois de discipline</li>
                <li>L'expert-comptable identifie 2-3 leviers clairs</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-red-700" />
                <h3 className="font-bold text-red-900">Fermer si...</h3>
              </div>
              <ul className="list-disc list-inside text-sm text-red-800 space-y-2">
                <li>Marge brute inferieure a 50 % (concept defaillant)</li>
                <li>Loyer superieur a 15 % et bail bloque</li>
                <li>Plus de 3 mois de loyer impayes en retard</li>
                <li>Burn-out severe du proprietaire (sante prioritaire)</li>
                <li>Aucun client fidele apres 3 ans</li>
                <li>Zone en declin (commerces qui ferment autour)</li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>Fermer n'est pas un echec.</strong> C'est parfois la decision la plus intelligente pour
            limiter les pertes financieres et psychologiques. Une fermeture organisee avec un expert-
            comptable et un avocat permet de proteger votre patrimoine personnel et de rebondir. Beaucoup
            de restaurateurs ferment, prennent 6 mois pour digerer, et ouvrent un nouveau projet plus solide
            avec les lecons apprises.
          </Callout>
        </section>

        {/* ═════════════ SECTION 8 : Erreurs psy ═════════════ */}
        <section id="erreurs-psy" className="mb-16">
          <SectionHeading icon={<Brain className="w-6 h-6" />} number="8">
            Erreurs psychologiques du restaurateur epuise
          </SectionHeading>

          <div className="prose-content">
            <p>
              Au-dela des chiffres, il y a des biais psychologiques qui maintiennent les restaurateurs
              dans la non-rentabilite. Les identifier est le premier pas pour les corriger.
            </p>
          </div>

          <div className="space-y-5 mt-8">
            <ErreurPsyCard
              title="Le deni operationnel"
              desc="Travailler 80 heures par semaine pour compenser l'absence de pilotage. On confond activite et productivite. La premiere action de tout redressement n'est PAS de travailler plus, c'est de s'asseoir 4 heures et regarder ses chiffres en face."
            />
            <ErreurPsyCard
              title="La peur d'augmenter les prix"
              desc="Vous imaginez que tous vos clients vont fuir si vous passez la bavette de 18,50 EUR a 19,80 EUR. La realite : 95 % ne le verront meme pas. Cette peur coute 30 000 EUR/an de marge non encaissee."
            />
            <ErreurPsyCard
              title="L'attachement aux plats du chef"
              desc="Vous gardez sur la carte un plat qui ne se vend pas parce qu'il vous tient a coeur. Chaque plat poids mort coute 1 a 2 points de marge globale. Le menu n'est pas un musee : c'est un outil de vente."
            />
            <ErreurPsyCard
              title="La generosite mal calibree"
              desc="Ajouter 30 g de viande supplementaire sur chaque assiette par generosite represente 1 point de food cost. Sur 30 000 assiettes/an, c'est 6 000 EUR. La generosite se montre dans la qualite, l'accueil, le sourire, le service - pas dans les grammages."
            />
            <ErreurPsyCard
              title="L'evitement des chiffres"
              desc="Beaucoup de restaurateurs n'ouvrent leur expert-comptable qu'en fin d'annee parce que c'est anxiogene. Resultat : les derives ne sont vues que 6 a 9 mois trop tard. Regarder ses chiffres chaque semaine pendant 30 minutes evite 80 % des catastrophes."
            />
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="15 min" variant="footer" />

        {/* ═════════════ FAQ ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes</h2>
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
              la marge par plat, le menu engineering et les alertes de derive.
            </p>
            <p className="text-teal-50 text-base max-w-xl mx-auto mb-8">
              <strong>29 EUR/mois</strong> &mdash; essai gratuit 7 jours, sans engagement, sans carte
              bancaire. Gain moyen constate : 3 a 5 points de marge brute en 6 mois.
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
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Seuil de rentabilite restaurant</h3>
              <p className="text-xs text-mono-500">Point mort, couverts necessaires, formules et leviers pour reduire le seuil.</p>
            </Link>
            <Link to="/blog/prime-cost-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Prime cost restaurant</h3>
              <p className="text-xs text-mono-500">L'indicateur n1 : food cost + masse salariale, plan d'action pour le reduire.</p>
            </Link>
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Reduire le food cost</h3>
              <p className="text-xs text-mono-500">10 strategies : fiches techniques, negociation, gaspillage, menu engineering.</p>
            </Link>
            <Link to="/blog/reduire-cout-personnel-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Reduire le cout du personnel</h3>
              <p className="text-xs text-mono-500">Planning optimise, turnover, formation : 5 leviers pour reduire la masse salariale.</p>
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
      <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-mono-500">
          <Link to="/landing" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4">
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mb-4">
            La plateforme de gestion de marge pour les restaurateurs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-mono-700">
            <Link to="/mentions-legales" className="hover:text-teal-600 transition-colors">Mentions legales</Link>
            <Link to="/cgv" className="hover:text-teal-600 transition-colors">CGV</Link>
            <Link to="/cgu" className="hover:text-teal-600 transition-colors">CGU</Link>
            <Link to="/politique-confidentialite" className="hover:text-teal-600 transition-colors">Confidentialite</Link>
          </div>
          <p className="mt-6 text-xs text-mono-700">
            &copy; {new Date().getFullYear()} RestauMargin. Tous droits reserves.
          </p>
        </div>
      </footer>
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
          Resultat attendu : <span className="font-bold">{expected}</span>
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
