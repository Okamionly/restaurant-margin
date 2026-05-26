import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Package, Calendar, ListChecks, RefreshCw, AlertTriangle, Smartphone, ClipboardList, UserCheck, ArrowRight, Calculator, BarChart3, CheckCircle, Lightbulb, Target, TrendingDown, Scale, FileText, Lock, Users } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Faire l'inventaire de son restaurant en 2026"
   Mot-cle principal : inventaire restaurant
   ~3 200 mots — modele BlogCalcMarge
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Combien de temps prend un inventaire complet de restaurant ?",
    answer: "Pour un bistrot 50 couverts (~150 references), comptez 2h30 a 4h en equipe de 2 personnes. Avec logiciel d'inventaire restaurant + lecture code-barres : 1h30 a 2h30. Le premier inventaire est toujours plus long (3-5h) car il faut nommer chaque produit, fixer les unites et les emplacements. A partir du deuxieme, vous gagnez 30 a 40 % de temps."
  },
  {
    question: "Faut-il faire l'inventaire restaurant portes fermees ?",
    answer: "Ideal oui, apres le dernier service ou avant le premier. Pendant le service, les sorties non comptees rendent l'inventaire faux. Si necessaire, isolez les zones (sec, cave, congel) qui ne sont pas en flux pendant le service. La regle d'or : aucune entree, aucune sortie pendant le comptage."
  },
  {
    question: "A quelle frequence faire l'inventaire dans un restaurant ?",
    answer: "Trois niveaux : inventaire complet mensuel (obligatoire pour la comptabilite et le calcul du food cost reel), inventaire flash hebdomadaire sur les 10-15 produits les plus chers (viandes, poissons, vins premium), inventaire quotidien sur les ultra-perissables (poissons, fruits de mer, certains laitiers). Plus la frequence est elevee, plus tot vous detectez les ecarts."
  },
  {
    question: "Que faire si je detecte un grand ecart soudain ?",
    answer: "1) Recompter physiquement la zone concernee a deux personnes. 2) Verifier les bons de livraison recents (erreur de saisie ?). 3) Verifier les fiches techniques (changement de portion ou de recette ?). 4) Verifier la casse, le offert et la consommation personnel sur la periode. 5) Si l'ecart persiste, enqueter discretement sur les procedures, les acces aux reserves et les horaires de mouvement."
  },
  {
    question: "Est-il legal de tenir le personnel responsable d'un manque de stock ?",
    answer: "Non, le restaurateur reste legalement responsable de ses stocks. En cas de vol avere (preuves materielles, video), des sanctions disciplinaires sont possibles selon la convention collective HCR. Une retenue sur salaire est interdite sans accord explicite. Un reglement interieur clair sur la consommation personnelle et les vols est indispensable, et doit etre affiche conformement au Code du travail."
  },
  {
    question: "Comment gerer les produits 'consommation gratuite equipe' ?",
    answer: "Tracez-les obligatoirement dans une fiche 'consommation interne' mensuelle (en valeur ou quantites). Cette consommation s'ajoute a la sortie de stock theorique et reduit l'ecart d'inventaire apparent. Sans cette tracabilite, vos calculs sont biaises et vous risquez de suspecter votre equipe a tort. Comptez 1 a 3 % du CA en consommation interne moyenne."
  },
  {
    question: "Comment valoriser le stock lors de l'inventaire restaurant ?",
    answer: "Toujours au dernier prix d'achat HT facture (methode CMUP simplifiee) ou en FIFO (lot par lot). Tenir une base de prix centralisee a jour. Ne jamais utiliser le prix TTC (vous biaisez votre food cost) ni le prix de vente. Pour les produits volatils (poissons, certains fruits), faites une moyenne ponderee sur le dernier mois."
  },
  {
    question: "Quels outils utiliser pour l'inventaire restaurant ?",
    answer: "Trois options : papier + Excel (gratuit mais long, source d'erreurs), tablette + logiciel dedie (30-80 EUR/mois, gain de 50 % de temps), code-barres + douchette + logiciel (le plus rapide, parfait au-dela de 200 references). RestauMargin propose un module inventaire integre au food cost qui calcule automatiquement la consommation, les ecarts et la rotation des stocks."
  },
  {
    question: "Comment integrer la casse et les pertes dans l'inventaire ?",
    answer: "Tenir une fiche 'casse et pertes' journaliere ou hebdomadaire : produit, quantite, motif (casse, brule, perime, retour client, offert). En fin de mois, cette fiche s'integre au calcul d'ecart d'inventaire. Sans cette tracabilite, vous comptabilisez toutes les pertes comme du vol, ce qui fausse l'analyse et detruit la confiance."
  },
  {
    question: "Quel ecart d'inventaire est acceptable en restauration ?",
    answer: "Ecart inferieur a 1 % du CA mensuel : excellent (precision et controle). Entre 1 et 2 % : normal, marge de tolerance. Entre 2 et 3 % : alerte, investigation a lancer. Au-dela de 3 % : intervention immediate, audit complet des procedures, revue des acces et des fiches techniques. Sur 600 000 EUR de CA, 1 % d'ecart represente 6 000 EUR par an, 3 % represente 18 000 EUR."
  }
];

export default function BlogInventaire() {
  const faqSchema = buildFAQSchema(faqItems);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Inventaire restaurant", url: "https://www.restaumargin.fr/blog/inventaire-restaurant-guide" }
  ]);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Inventaire restaurant : methode complete, frequence et outils 2026"
        description="Guide complet pour faire l'inventaire de votre restaurant : methode pas a pas, frequence par type de produit, calcul de rotation, valorisation du stock et outils digitaux. Detectez les 2 000 EUR/mois perdus en ecarts."
        path="/blog/inventaire-restaurant-guide"
        type="article"
        schema={[
          faqSchema,
          breadcrumbSchema,
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: "Comment faire l'inventaire d'un restaurant en 7 etapes",
            description: "Methode pas-a-pas pour realiser un inventaire restaurant fiable, calculer la consommation reelle et detecter les ecarts.",
            totalTime: 'PT3H',
            tool: [
              'Balance de cuisine precise au gramme',
              'Tablette ou feuille d\'inventaire',
              'Stylo, feutre indelebile',
              'Etiqueteuse ou Day Dot',
              'Logiciel d\'inventaire restaurant (RestauMargin recommande)'
            ],
            step: [
              { '@type': 'HowToStep', name: 'Preparer les fiches d\'inventaire', text: 'Editer la liste des references classees par zone physique (reserve seche, cave, chambre froide, congelateur). Imprimer ou ouvrir sur tablette dans l\'ordre de rangement.' },
              { '@type': 'HowToStep', name: 'Choisir le bon moment', text: 'Portes fermees, apres le dernier service ou avant le premier. Aucune entree ni sortie de stock pendant le comptage.' },
              { '@type': 'HowToStep', name: 'Compter par zone et par famille', text: 'Ordre recommande : reserve seche, cave, chambre froide positive, negative, cellule patisserie, cuisine. Une personne compte, une autre saisit.' },
              { '@type': 'HowToStep', name: 'Mesurer precisement chaque produit', text: 'Balance pour viandes et poissons, bouteille graduee pour liquides, peseur a fluides pour les bouteilles entamees. Pesez le sac de riz a 5,4 kg, pas 1 sac.' },
              { '@type': 'HowToStep', name: 'Valoriser au prix d\'achat HT', text: 'Utiliser le dernier prix reel facture ou la moyenne ponderee. Tenir une base produit centralisee a jour pour eviter de chercher chaque prix.' },
              { '@type': 'HowToStep', name: 'Saisir et controler les anomalies', text: 'Total par zone, par famille. Toute ligne avec +200 % ou -80 % par rapport au mois precedent doit etre recomptee.' },
              { '@type': 'HowToStep', name: 'Calculer la consommation et les ecarts', text: 'Consommation = Stock initial + Achats - Stock final. Ecart = Consommation reelle - Consommation theorique (issue des fiches techniques x ventes). Analyser, expliquer, agir.' }
            ]
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: "Faire l'inventaire de son restaurant : methode complete, frequence et outils 2026",
            description: "Guide expert pour faire l'inventaire restaurant : methode HACCP-compatible, frequence par produit, calcul de rotation, valorisation et outils digitaux.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'La redaction RestauMargin', url: 'https://www.restaumargin.fr/a-propos' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' }
            },
            datePublished: '2026-04-27',
            dateModified: '2026-05-26',
            wordCount: 3200,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/inventaire-restaurant-guide' }
          }
        ]}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/outils/calculateur-food-cost"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Calculateur gratuit
            </Link>
            <Link to="/login" className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumbs visibles */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Inventaire restaurant</span>
        </div>
      </div>

      {/* Hero */}
      <BlogArticleHero
        category="Stocks"
        readTime="15 min"
        date="Mai 2026"
        title="Inventaire restaurant : methode, frequence, outils 2026"
        accentWord="Inventaire"
        subtitle="Un restaurant moyen perd 2 000 EUR a 5 000 EUR par mois en ecarts non detectes. Vol, gaspillage, casse, surdosage : voici la methode complete pour les detecter et les stopper."
      />

      {/* Body */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="15 min" variant="header" />

        {/* Encadre formule rapide */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Formules essentielles inventaire restaurant</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les 4 formules a connaitre par coeur
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Consommation reelle</strong> = Stock initial + Achats - Stock final</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Food cost reel</strong> = Consommation / CA HT x 100</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Ecart d'inventaire</strong> = Stock physique - Stock theorique</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Rotation</strong> = Achats du mois / Stock moyen</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Objectif standard : ecart inferieur a 1 % du CA mensuel, rotation entre 3 et 5x par mois selon le type d'etablissement.
          </p>
        </div>

        {/* Intro */}
        <div className="mt-12 prose-content">
          <p className="text-[#374151] text-lg leading-relaxed mb-6">
            Vol interne, gaspillage, surproduction, casse, erreurs de portionnage : autant de fuites silencieuses qui peuvent gonfler un food cost de 28 % a 33 % sans que personne ne s'en apercoive. La difference entre un restaurant bien gere et un restaurant a la derive tient souvent a un seul rituel : <strong>l'inventaire restaurant regulier, methodique, exploite</strong>.
          </p>
          <p className="text-[#374151] leading-relaxed">
            Ce guide vous donne la methode complete pour realiser un inventaire fiable, calculer la consommation reelle, detecter les ecarts et transformer cette donnee en marge supplementaire. Que vous soyez bistrot de quartier ou restaurant gastronomique, les principes restent les memes — seuls la frequence et le niveau de detail varient.
          </p>
        </div>

        {/* Table des matieres */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#pourquoi', label: 'Pourquoi l\'inventaire est fondamental en restauration' },
              { href: '#frequence', label: 'Quelle frequence d\'inventaire selon les produits' },
              { href: '#howto', label: 'Comment faire l\'inventaire : methode pas a pas (7 etapes)' },
              { href: '#valorisation', label: 'Valorisation du stock : FIFO, LIFO, CUMP' },
              { href: '#rotation', label: 'Calculer la rotation des stocks par categorie' },
              { href: '#cas-pratique', label: 'Cas chiffre : detecter 2 000 EUR d\'ecart' },
              { href: '#tableaux', label: 'Tableaux de frequences et benchmarks 2026' },
              { href: '#erreurs', label: 'Les 7 erreurs courantes a eviter absolument' },
              { href: '#checklist', label: 'Checklist inventaire mensuel imprimable' },
              { href: '#digital', label: 'Inventaire digital vs papier : ROI compare' },
              { href: '#management', label: 'L\'inventaire comme outil de management' },
              { href: '#faq', label: 'Questions frequentes' },
              { href: '#cta', label: 'Automatiser avec RestauMargin' }
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

        {/* SECTION 1 : Pourquoi */}
        <section id="pourquoi" className="mb-16">
          <SectionHeading icon={<Package className="w-6 h-6" />} number="1">
            Pourquoi l'inventaire est fondamental en restauration
          </SectionHeading>

          <div className="prose-content">
            <p>
              Dans un restaurant, l'inventaire n'est pas une contrainte comptable de plus : c'est l'outil de gestion <strong>le plus rentable a l'heure travaillee</strong>. Trois heures d'inventaire mensuel rapportent en moyenne 2 000 a 5 000 EUR de marge identifiee et recuperee. Sur l'annee, l'absence d'inventaire restaurant rigoureux coute facilement 20 000 a 40 000 EUR par etablissement — l'equivalent de 6 mois de loyer en zone urbaine.
            </p>
            <p>
              Voici les cinq raisons majeures de mettre en place un rituel d'inventaire restaurant systematique :
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">1. Calculer le vrai food cost</h3>
              </div>
              <p className="text-sm text-emerald-800 leading-relaxed">
                Sans inventaire, on confond achats et consommation. Achats / CA donne un food cost approximatif. La vraie formule : <strong>Consommation = Stock initial + Achats - Stock final</strong>. Ecart typique : 2 a 4 points de food cost cache.
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">2. Detecter le gaspillage</h3>
              </div>
              <p className="text-sm text-amber-800 leading-relaxed">
                10 g de surdose sur 150 plats par jour = 1,5 kg en trop par jour. A 10 EUR/kg de cout matiere, c'est 450 EUR par mois invisible. L'inventaire est la seule facon de mesurer ce gaspillage diffus.
              </p>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-rose-700" />
                <h3 className="font-bold text-rose-900">3. Detecter le vol</h3>
              </div>
              <p className="text-sm text-rose-800 leading-relaxed">
                3 a 7 % du CA dans les restaurants sans controle. Vol de produits chers (entrecotes, vins, foie gras, alcools premium) representent 80 % des pertes. Inventaire frequent = effet dissuasif majeur.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-blue-900">4. Verifier les fiches techniques</h3>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">
                La fiche technique dit 150 g de bavette par assiette. La cuisine en met 180 g. Sur 100 plats par jour : 3 kg en trop, soit 54 EUR par jour, 1 600 EUR par mois. L'inventaire revele ces ecarts entre theorie et pratique.
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 sm:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-purple-700" />
                <h3 className="font-bold text-purple-900">5. Optimiser les achats et la tresorerie</h3>
              </div>
              <p className="text-sm text-purple-800 leading-relaxed">
                Quels produits dorment en stock ? Quels fournisseurs sont en retard ? Quels references peuvent etre supprimees ? L'inventaire est la base d'une politique d'achat intelligente. Reduire un stock de vins de 30 % libere 1 500 a 3 000 EUR de tresorerie sans impact sur les ventes.
              </p>
            </div>
          </div>

          <Callout type="info">
            <strong>Chiffre cle :</strong> sans inventaire mensuel, le food cost reel est souvent de 33 a 36 % alors que le restaurateur croit etre a 28-30 %. Avec inventaire structure, on revient a 30-32 %. Gain : 2 a 4 points = 1 200 a 2 400 EUR par mois sur 60 000 EUR de CA.
          </Callout>
        </section>

        {/* SECTION 2 : Frequence */}
        <section id="frequence" className="mb-16">
          <SectionHeading icon={<Calendar className="w-6 h-6" />} number="2">
            Quelle frequence d'inventaire selon les produits
          </SectionHeading>

          <div className="prose-content">
            <p>
              Tous les produits ne se valent pas. Plus un produit est fragile, cher et a rotation rapide, plus l'inventaire doit etre frequent. Voici la regle d'or : <strong>la frequence d'inventaire restaurant doit etre proportionnelle au risque financier</strong>. Pour cela, on applique le principe de Pareto (80/20) aux stocks.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Categorie de produits</th>
                  <th className="text-center py-3 px-4 font-semibold">Frequence recommandee</th>
                  <th className="text-center py-3 px-4 font-semibold">Temps moyen</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Risque financier</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { cat: 'Frais ultra-perissable (poissons, fruits de mer, abats)', freq: 'Quotidien', time: '5-10 min', risk: 'Tres eleve' },
                  { cat: 'Viandes nobles (filet, entrecote, magret, gibier)', freq: 'Quotidien', time: '5-10 min', risk: 'Tres eleve' },
                  { cat: 'Vins premium et spiritueux haut de gamme', freq: 'Hebdomadaire', time: '30-45 min', risk: 'Eleve' },
                  { cat: 'Viandes standard (boeuf, porc, volaille)', freq: 'Bi-hebdo', time: '15-25 min', risk: 'Eleve' },
                  { cat: 'Charcuterie, fromages affines', freq: 'Bi-hebdo', time: '15-20 min', risk: 'Moyen-eleve' },
                  { cat: 'Legumes et fruits frais', freq: 'Hebdo', time: '20-30 min', risk: 'Moyen' },
                  { cat: 'Laitiers (beurre, creme, lait, yaourts)', freq: 'Hebdo', time: '15-20 min', risk: 'Moyen' },
                  { cat: 'Boissons softs et vins courants', freq: 'Hebdo', time: '30-45 min', risk: 'Moyen' },
                  { cat: 'Epicerie seche (pates, riz, farines, conserves)', freq: 'Bi-hebdo', time: '20-30 min', risk: 'Faible' },
                  { cat: 'Surgeles et produits longue conservation', freq: 'Mensuel', time: '30-45 min', risk: 'Faible' },
                  { cat: 'Inventaire complet (tous postes)', freq: 'Mensuel', time: '2-4 heures', risk: '-' }
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.cat}</td>
                    <td className="py-3 px-4 text-center">{row.freq}</td>
                    <td className="py-3 px-4 text-center">{row.time}</td>
                    <td className="py-3 px-4 text-center text-xs">{row.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">La regle du 80/20 appliquee aux stocks</h3>
            <p>
              Dans 95 % des restaurants, <strong>20 % des references representent 80 % de la valeur du stock</strong>. Ces produits strategiques sont generalement : les viandes nobles, les poissons frais, les vins premium, le foie gras, les fromages affines, certains alcools. Concentrez votre energie sur ces 20 % en quotidien ou bi-hebdomadaire. Pour les 80 % restants (epicerie, conserves, secs), un controle mensuel suffit.
            </p>
            <p>
              Pour identifier vos produits strategiques, classez vos references par valeur de stock decroissante. Les 20 premiers % constituent votre "stock chaud" — celui qui merite une surveillance rapprochee. Cette logique est decrite plus en detail dans notre guide complet de la <Link to="/blog/rotation-stocks-restaurant" className="text-teal-700 underline hover:text-teal-800">rotation des stocks en restauration</Link>.
            </p>
          </div>

          <Callout type="warning">
            <strong>Erreur classique :</strong> faire un inventaire complet mensuel et rien d'autre. Resultat : un mois de derive cachee avant la prochaine detection. Pendant ce mois, un produit cher peut perdre 500 EUR en surdosage ou vol sans alerte.
          </Callout>
        </section>

        {/* SECTION 3 : Methode pas a pas */}
        <section id="howto" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="3">
            Comment faire l'inventaire : methode pas a pas
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la methode complete pour realiser un inventaire restaurant fiable en 7 etapes. Cette procedure est utilisee par les chaines de restauration professionnelles et adaptee aux independants. Comptez 2h30 a 4h pour un bistrot 50 couverts en equipe de 2 personnes.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Preparer les fiches d\'inventaire avant le comptage',
                body: "Editer (ou imprimer) la liste des references classees par ordre physique de rangement (de gauche a droite, de haut en bas) dans chaque zone. Ce classement physique vous fait gagner 30 % de temps lors du comptage. Inclure : nom du produit, unite d'inventaire (kg, L, piece), emplacement attendu, prix d'achat HT a jour."
              },
              {
                title: 'Choisir le bon moment (portes fermees)',
                body: "Ideal : apres le dernier service du mois ou tres tot le matin avant la premiere reception. Aucune entree ni sortie de stock pendant le comptage. Si la cuisine doit ouvrir, isolez les zones non actives (cave, reserve seche) et comptez-les d'abord. Briefer l'equipe sur le timing exact."
              },
              {
                title: 'Compter par zone, jamais par produit',
                body: "Ordre recommande : (1) Reserve seche, (2) Cave et alcools, (3) Chambre froide positive, (4) Chambre froide negative et congelateurs, (5) Cellules patisserie et produits speciaux, (6) Cuisine et postes de service. Une personne compte a voix haute, une autre saisit en temps reel sur tablette ou feuille."
              },
              {
                title: 'Mesurer precisement chaque produit',
                body: "Balance pour viandes et poissons (precision au gramme pour les produits chers). Bouteille graduee pour liquides. Peseur a fluides pour bouteilles entamees (vins, spiritueux, vinaigres, huiles). Compter les pieces pour les conserves. Pesez le sac de riz a 5,4 kg, jamais '1 sac'. Pour les liquides, marquez les niveaux avant comptage."
              },
              {
                title: 'Valoriser au prix d\'achat HT (le bon prix)',
                body: "Utiliser le dernier prix reel facture (FIFO simplifie) ou le prix moyen pondere CUMP. Toujours en HT, jamais TTC. Pour les produits volatils (poissons, certains fruits), faire une moyenne ponderee sur le dernier mois. Tenir une base produit centralisee mise a jour des l'arrivee des factures fournisseurs."
              },
              {
                title: 'Saisir, controler les anomalies, recompter',
                body: "Total par zone, par famille, comparaison avec l'inventaire precedent. Toute ligne avec +200 % ou -80 % par rapport au mois precedent = recompter. Verifier les unites (passage de kg a g possible source d'erreur). Verifier les prix aberrants. Croiser avec la moyenne des 3 derniers mois."
              },
              {
                title: 'Calculer la consommation et analyser les ecarts',
                body: "Formule maitresse : Consommation reelle = Stock initial + Achats du mois - Stock final. Comparer avec la consommation theorique (calculee a partir des ventes x fiches techniques). L'ecart entre les deux = casse + gaspillage + vol + consommation interne + erreurs de portionnage. Plan d'action selon le niveau d'ecart (voir tableau ci-dessous)."
              }
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
            <strong>Astuce gain de temps :</strong> au lieu de gerer ce calcul a la main, le module inventaire de RestauMargin reprend automatiquement vos achats fournisseurs scannes, vos ventes (caisse) et vos fiches techniques. Vous saisissez uniquement le stock final, l'application calcule consommation, ecart et food cost reel en quelques secondes. Decouvrez le <Link to="/outils/calculateur-food-cost" className="underline font-semibold hover:text-teal-700">calculateur de food cost gratuit</Link> pour demarrer.
          </Callout>
        </section>

        {/* SECTION 4 : Valorisation */}
        <section id="valorisation" className="mb-16">
          <SectionHeading icon={<Scale className="w-6 h-6" />} number="4">
            Valorisation du stock : FIFO, LIFO, CUMP
          </SectionHeading>

          <div className="prose-content">
            <p>
              La valorisation du stock est l'etape la plus souvent baclee de l'inventaire restaurant. C'est pourtant elle qui determine la fiabilite de votre food cost et de votre marge brute. Trois methodes existent — mais une seule est legale en France pour les denrees alimentaires.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Methode</th>
                  <th className="text-left py-3 px-4 font-semibold">Principe</th>
                  <th className="text-center py-3 px-4 font-semibold">Legal France</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Usage restaurant</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white">
                  <td className="py-3 px-4 font-bold text-emerald-700">FIFO (PEPS)</td>
                  <td className="py-3 px-4 text-xs">Premier entre, premier sorti. Le stock final est valorise au prix des dernieres entrees.</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">Oui</td>
                  <td className="py-3 px-4 text-center text-xs">Recommande HACCP</td>
                </tr>
                <tr className="bg-mono-1000">
                  <td className="py-3 px-4 font-bold text-amber-700">CUMP / CMUP</td>
                  <td className="py-3 px-4 text-xs">Cout moyen unitaire pondere. Recalcule a chaque entree (achat + stock) / quantite totale.</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">Oui</td>
                  <td className="py-3 px-4 text-center text-xs">Simple, repandu</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 font-bold text-rose-700">LIFO (DEPS)</td>
                  <td className="py-3 px-4 text-xs">Dernier entre, premier sorti. Le stock final est valorise au prix des anciennes entrees.</td>
                  <td className="py-3 px-4 text-center text-rose-700 font-bold">Non (interdit 2005)</td>
                  <td className="py-3 px-4 text-center text-xs">Jamais</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Impact chiffre des trois methodes</h3>
            <p>
              Prenons un exemple concret pour comprendre l'impact. Restaurant achete du beurre :
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350 mt-3 mb-4">
              <li>1er du mois : 10 kg a 6 EUR/kg = 60 EUR</li>
              <li>15 du mois : 10 kg a 7 EUR/kg = 70 EUR</li>
              <li>Consommation du mois : 15 kg</li>
              <li>Stock final physique : 5 kg</li>
            </ul>
            <p>Valorisation du stock final de 5 kg selon la methode :</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <h4 className="font-bold text-emerald-900 mb-2">FIFO</h4>
              <p className="text-sm text-emerald-800 mb-2">5 kg au dernier prix (7 EUR/kg)</p>
              <p className="text-2xl font-extrabold text-emerald-700">35 EUR</p>
              <p className="text-xs text-emerald-700 mt-2">Reflete les prix actuels du marche</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h4 className="font-bold text-amber-900 mb-2">CUMP</h4>
              <p className="text-sm text-amber-800 mb-2">Prix moyen (6,50 EUR/kg) x 5 kg</p>
              <p className="text-2xl font-extrabold text-amber-700">32,50 EUR</p>
              <p className="text-xs text-amber-700 mt-2">Lisse les variations de prix</p>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
              <h4 className="font-bold text-rose-900 mb-2">LIFO</h4>
              <p className="text-sm text-rose-800 mb-2">5 kg au premier prix (6 EUR/kg)</p>
              <p className="text-2xl font-extrabold text-rose-700">30 EUR</p>
              <p className="text-xs text-rose-700 mt-2">Interdit en France depuis 2005</p>
            </div>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Notre recommandation :</strong> utiliser le <strong>FIFO</strong> pour la gestion physique en cuisine (rotation des denrees, securite alimentaire HACCP) et le <strong>CUMP</strong> pour la valorisation comptable mensuelle (plus simple a tenir, fiscalement accepte). Cette double pratique est la norme dans les restaurants bien geres.
            </p>
            <p>
              Pour approfondir, lisez notre guide complet sur le <Link to="/blog/fifo-lifo-stocks-restaurant" className="text-teal-700 underline hover:text-teal-800">FIFO vs LIFO en restauration</Link> et notre <Link to="/blog/methode-fifo-gestion-stocks-restaurant" className="text-teal-700 underline hover:text-teal-800">methode FIFO pratique</Link> pour la mise en place operationnelle.
            </p>
          </div>
        </section>

        {/* SECTION 5 : Rotation */}
        <section id="rotation" className="mb-16">
          <SectionHeading icon={<RefreshCw className="w-6 h-6" />} number="5">
            Calculer la rotation des stocks par categorie
          </SectionHeading>

          <div className="prose-content">
            <p>
              Une fois l'inventaire realise, le second indicateur cle est la <strong>rotation des stocks</strong>. Elle mesure le nombre de fois ou votre stock est entierement renouvele dans le mois. Une rotation trop basse signifie sur-stock (risque de pertes et tresorerie immobilisee). Une rotation trop haute signifie ruptures (perte de ventes et stress equipe).
            </p>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Formules de rotation</h3>
            <div className="space-y-3 font-mono text-sm">
              <div className="bg-white px-4 py-3 rounded-lg border border-mono-900">
                <strong>Rotation (x/mois)</strong> = Achats du mois / Stock moyen
              </div>
              <div className="bg-white px-4 py-3 rounded-lg border border-mono-900">
                <strong>Stock moyen</strong> = (Stock initial + Stock final) / 2
              </div>
              <div className="bg-white px-4 py-3 rounded-lg border border-mono-900">
                <strong>Jours de stock</strong> = (Stock moyen / Achats) x Nb jours
              </div>
            </div>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Exemple chiffre</h3>
            <p>
              Bistrot 50 couverts : stock initial 4 200 EUR, achats du mois 21 000 EUR, stock final 4 800 EUR. Stock moyen = (4 200 + 4 800) / 2 = 4 500 EUR. Rotation = 21 000 / 4 500 = <strong>4,67 x par mois</strong>, soit un renouvellement complet tous les 6,4 jours. C'est une excellente performance pour un bistrot.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Categorie</th>
                  <th className="text-center py-3 px-4 font-semibold">Rotation cible (x/mois)</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Jours de stock</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { cat: 'Poissons frais et fruits de mer', rot: '30-60', days: '0,5 - 1 jour' },
                  { cat: 'Viandes nobles fraiches', rot: '15-25', days: '1 - 2 jours' },
                  { cat: 'Volailles fraiches', rot: '12-20', days: '1,5 - 2,5 jours' },
                  { cat: 'Legumes et fruits frais', rot: '12-20', days: '1,5 - 2,5 jours' },
                  { cat: 'Laitiers et fromages frais', rot: '8-12', days: '2,5 - 4 jours' },
                  { cat: 'Charcuterie et fromages affines', rot: '4-8', days: '4 - 7 jours' },
                  { cat: 'Surgeles', rot: '2-4', days: '7 - 15 jours' },
                  { cat: 'Epicerie seche', rot: '2-4', days: '7 - 15 jours' },
                  { cat: 'Vins courants', rot: '1-3', days: '10 - 30 jours' },
                  { cat: 'Vins de garde et spiritueux premium', rot: '0,3-1', days: '30 - 90 jours' }
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.cat}</td>
                    <td className="py-3 px-4 text-center">{row.rot}</td>
                    <td className="py-3 px-4 text-center">{row.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Callout type="info">
            <strong>Reduire le stock de vins de 30 %</strong> dans un restaurant moyen libere 1 500 a 3 000 EUR de tresorerie sans impact ventes. C'est l'un des leviers les plus rapides pour respirer financierement quand on demarre une rotation des stocks rigoureuse.
          </Callout>
        </section>

        {/* SECTION 6 : Cas pratique */}
        <section id="cas-pratique" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="6">
            Cas pratique chiffre : detecter 2 000 EUR d'ecart
          </SectionHeading>

          <div className="prose-content">
            <p>
              Restaurant Le Marais (bistronomique 50 couverts, Paris 4e). CA mensuel : 65 000 EUR HT. Premier inventaire restaurant rigoureux apres 8 mois sans controle. Voici ce que la direction decouvre :
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Donnee</th>
                  <th className="text-right py-3 px-4 font-semibold">Valeur</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Commentaire</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4">Stock initial (debut mois)</td><td className="py-3 px-4 text-right font-medium">4 500 EUR</td><td className="py-3 px-4 text-right text-xs">Inventaire mois precedent</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4">Achats matieres du mois</td><td className="py-3 px-4 text-right font-medium">22 000 EUR</td><td className="py-3 px-4 text-right text-xs">Factures fournisseurs HT</td></tr>
                <tr className="bg-white"><td className="py-3 px-4">Stock final attendu (theorique)</td><td className="py-3 px-4 text-right font-medium">4 800 EUR</td><td className="py-3 px-4 text-right text-xs">Calcule via fiches techniques</td></tr>
                <tr className="bg-rose-50"><td className="py-3 px-4 font-bold text-rose-900">Stock final reel compte</td><td className="py-3 px-4 text-right font-bold text-rose-900">2 800 EUR</td><td className="py-3 px-4 text-right text-xs text-rose-700">Inventaire physique</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-bold text-rose-700">Ecart d'inventaire</td><td className="py-3 px-4 text-right font-bold text-rose-700">-2 000 EUR</td><td className="py-3 px-4 text-right text-xs text-rose-700">3,1 % du CA mensuel</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Calcul du food cost reel vs theorique</h3>
            <p>
              Food cost theorique = Achats / CA = 22 000 / 65 000 = 33,8 %. Food cost reel = Consommation reelle / CA = (4 500 + 22 000 - 2 800) / 65 000 = 23 700 / 65 000 = <strong>36,5 %</strong>. Difference : 2,7 points de food cost = 1 755 EUR de marge perdue ce mois-ci.
            </p>
            <p>
              Sur l'annee, sans intervention : 2 000 EUR x 12 = <strong>24 000 EUR de pertes annuelles</strong> non identifiees. Equivalent : 6 mois de loyer dans Paris intramuros, ou le salaire d'un commis de cuisine pendant 14 mois.
            </p>
          </div>

          <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-emerald-900 mb-4 text-lg">Plan d'action 30 jours</h3>
            <ul className="space-y-3 text-sm text-emerald-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                <span><strong>Semaine 1 :</strong> audit complet des procedures, fiche casse signee par poste, briefing equipe sur les enjeux financiers (transparence).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                <span><strong>Semaines 2-3 :</strong> inventaires bi-hebdo sur les 10 produits les plus chers, pesage systematique en cuisine, verification bons de livraison vs factures, double signature.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                <span><strong>Semaine 4 :</strong> nouvel inventaire complet, comparaison avec le mois precedent, identification des produits a ecart eleve restant.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                <span><strong>Resultat typique :</strong> -60 a -80 % de l'ecart en 1 mois, soit 1 200 a 1 600 EUR recuperes mensuellement, 14 000 a 19 000 EUR par an.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* SECTION 7 : Tableaux et benchmarks */}
        <section id="tableaux" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="7">
            Tableaux de frequences et benchmarks 2026
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici les benchmarks d'ecart d'inventaire restaurant observes en France en 2026. Ces fourchettes sont issues des donnees agregees de la GIRA Conseil et de notre base de donnees RestauMargin (500+ restaurants connectes).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Niveau d'ecart</th>
                  <th className="text-left py-3 px-4 font-semibold">Diagnostic</th>
                  <th className="text-left py-3 px-4 font-semibold rounded-tr-xl">Action recommandee</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-emerald-50">
                  <td className="py-3 px-4 font-bold text-emerald-900">&lt; 0,5 % du CA</td>
                  <td className="py-3 px-4 text-xs">Excellent. Restaurant tres bien gere.</td>
                  <td className="py-3 px-4 text-xs">Maintenir les procedures actuelles.</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 font-bold text-emerald-700">0,5 - 1 %</td>
                  <td className="py-3 px-4 text-xs">Tres bon. Marge de tolerance normale.</td>
                  <td className="py-3 px-4 text-xs">Surveillance continue.</td>
                </tr>
                <tr className="bg-amber-50">
                  <td className="py-3 px-4 font-bold text-amber-900">1 - 2 %</td>
                  <td className="py-3 px-4 text-xs">Acceptable. Gaspillage normal du secteur.</td>
                  <td className="py-3 px-4 text-xs">Identifier les categories a ecart eleve.</td>
                </tr>
                <tr className="bg-orange-50">
                  <td className="py-3 px-4 font-bold text-orange-900">2 - 3 %</td>
                  <td className="py-3 px-4 text-xs">Alerte. Probleme structurel a investiguer.</td>
                  <td className="py-3 px-4 text-xs">Audit procedures, formation equipe.</td>
                </tr>
                <tr className="bg-rose-50">
                  <td className="py-3 px-4 font-bold text-rose-900">&gt; 3 %</td>
                  <td className="py-3 px-4 text-xs">Critique. Vol probable, derives multiples.</td>
                  <td className="py-3 px-4 text-xs">Intervention immediate, audit complet.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Impact financier sur 600 000 EUR de CA annuel :</strong>
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350 mt-3">
              <li>Ecart 0,5 % = 3 000 EUR de pertes annuelles (acceptable)</li>
              <li>Ecart 1 % = 6 000 EUR (encore tolerable)</li>
              <li>Ecart 2 % = 12 000 EUR (a corriger d'urgence)</li>
              <li>Ecart 3 % = 18 000 EUR (situation critique)</li>
              <li>Ecart 5 % = 30 000 EUR (restaurant en danger)</li>
            </ul>
            <p className="mt-4">
              Pour mettre ces chiffres en perspective, lisez notre guide sur <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 underline hover:text-teal-800">le calcul de marge restaurant</Link> et notre article sur <Link to="/blog/gaspillage" className="text-teal-700 underline hover:text-teal-800">la reduction du gaspillage en cuisine</Link>.
            </p>
          </div>
        </section>

        {/* SECTION 8 : Erreurs */}
        <section id="erreurs" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="8">
            Les 7 erreurs courantes a eviter absolument
          </SectionHeading>

          <div className="space-y-5 mt-8">
            <ErreurCard
              number={1}
              title="Faire l'inventaire pendant le service"
              desc="Erreur la plus frequente chez les debutants. Pendant le service, le stock bouge en permanence : sorties cuisine, retours non valides, casses non saisies. Resultat : chiffres faux, ecart artificiel. La regle absolue : inventaire portes fermees, aucune entree ni sortie pendant le comptage."
            />
            <ErreurCard
              number={2}
              title="Ne pas peser, estimer 'a l'oeil'"
              desc="Compter '1 sac de riz a 5 kg' alors qu'il est entame a 3,2 kg. Estimer '1/2 bouteille de Cognac' alors qu'elle est au tiers. Ces approximations s'accumulent et representent 1 a 3 % d'ecart artificiel par inventaire. La balance et la bouteille graduee sont les outils n°1 de l'inventaire fiable."
            />
            <ErreurCard
              number={3}
              title="Valoriser au mauvais prix"
              desc="Utiliser le prix de vente au lieu du prix d'achat. Utiliser un prix TTC au lieu du HT. Utiliser un prix d'achat ancien (le beurre est passe de 4 a 7 EUR/kg). Toutes ces erreurs faussent le food cost. Tenir une base produit centralisee mise a jour automatiquement des l'arrivee des factures fournisseurs."
            />
            <ErreurCard
              number={4}
              title="Ne pas tracer la consommation interne"
              desc="Repas du personnel, offerts client, degustations fournisseurs, casses, brulures, retours assiettes : tout doit etre trace. Sans ces fiches, ces sorties sont comptees comme 'vol' dans l'ecart d'inventaire. La consommation interne represente typiquement 1 a 3 % du CA en valeur."
            />
            <ErreurCard
              number={5}
              title="Compter seul (sans double saisie)"
              desc="Une seule personne qui compte et qui saisit en meme temps : taux d'erreur 5 a 8 % sur les chiffres. La methode professionnelle : 2 personnes, l'une compte a voix haute, l'autre saisit. Reduit les erreurs de 70 % et accelere le travail (les deux sont concentres sur une seule tache)."
            />
            <ErreurCard
              number={6}
              title="Inventaire mensuel uniquement"
              desc="Faire UN inventaire complet en fin de mois et rien d'autre : entre 2 inventaires, 30 jours de derive possible non detectee. Sur les produits chers (viandes, vins, poissons), 30 jours c'est 500 a 2 000 EUR de pertes potentielles. Ajouter des inventaires flash hebdomadaires sur le top 10 des produits a valeur."
            />
            <ErreurCard
              number={7}
              title="Ne pas exploiter les resultats"
              desc="Faire l'inventaire et ranger les chiffres dans un tiroir. Sans plan d'action, l'inventaire est juste une corvee de 4h. Tout inventaire doit deboucher sur 3 a 5 actions concretes : revoir une fiche technique, recadrer un poste, changer un fournisseur, reduire un stock dormant, etc. Sans action, pas d'amelioration."
            />
          </div>

          <Callout type="warning">
            <strong>Impact cumule :</strong> ces 7 erreurs combinees peuvent representer 4 a 8 points d'ecart d'inventaire artificiel (mauvaise mesure) ou reel (derives non detectees). Sur un restaurant qui fait 600 000 EUR de CA, c'est entre 24 000 et 48 000 EUR de marge perdue chaque annee.
          </Callout>
        </section>

        {/* SECTION 9 : Checklist */}
        <section id="checklist" className="mb-16">
          <SectionHeading icon={<ClipboardList className="w-6 h-6" />} number="9">
            Checklist inventaire mensuel imprimable
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la checklist a imprimer et plastifier pour la coller dans votre bureau. Elle resume les 25 points cles d'un inventaire restaurant reussi.
            </p>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8 space-y-5">
            <div>
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">A</span>
                Preparation (la veille)
              </h3>
              <ul className="space-y-2 text-sm text-mono-350 ml-9">
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Editer la liste produits classes par zone physique</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Verifier base de prix d'achat HT a jour</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Briefer l'equipe sur l'horaire (portes fermees)</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Preparer balance, bouteille graduee, tablette/feuilles</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Recuperer les fiches de casse et offerts du mois</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">B</span>
                Comptage (jour J)
              </h3>
              <ul className="space-y-2 text-sm text-mono-350 ml-9">
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Travailler en binome (1 compte, 1 saisit)</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Ordre : seche, cave, froide+, froide-, cellules, cuisine</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Peser systematiquement viandes et poissons</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Mesurer les liquides (bouteilles entamees)</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Noter immediatement les anomalies (DLC, casse)</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Photographier les zones encombrees</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">C</span>
                Saisie et controle
              </h3>
              <ul className="space-y-2 text-sm text-mono-350 ml-9">
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Saisir en HT, jamais TTC</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Verifier les unites (kg vs g, L vs cL)</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Comparer avec inventaire mois precedent</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Recompter toute ligne avec ecart {'>'} 200 % ou {'<'} -80 %</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Valider total par famille et par zone</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">D</span>
                Analyse et action
              </h3>
              <ul className="space-y-2 text-sm text-mono-350 ml-9">
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Calculer consommation = stock initial + achats - stock final</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Calculer ecart vs consommation theorique</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Identifier les 3 categories a plus gros ecart</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Definir 3-5 actions concretes pour le mois suivant</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Briefer l'equipe sur les resultats et les decisions</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Archiver inventaire signe (obligation fiscale)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 10 : Digital vs Papier */}
        <section id="digital" className="mb-16">
          <SectionHeading icon={<Smartphone className="w-6 h-6" />} number="10">
            Inventaire digital vs papier : ROI compare
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le passage de l'inventaire papier au digital est l'un des investissements technologiques au ROI le plus rapide en restauration. Comparatif chiffre sur un bistrot 50 couverts (~150 references).
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
              <h3 className="font-bold text-rose-900 mb-3">Papier / Excel</h3>
              <ul className="text-sm text-rose-800 space-y-2 leading-relaxed">
                <li>+ Cout zero</li>
                <li>- Saisie manuelle (5 a 8 % d'erreurs)</li>
                <li>- Calculs lents (2-3h apres comptage)</li>
                <li>- Pas d'historique exploitable</li>
                <li>- Pas d'alertes automatiques</li>
                <li>- Photos et notes dispersees</li>
              </ul>
              <p className="text-xs text-rose-700 mt-4 font-semibold">
                Acceptable uniquement pour un tres petit etablissement (&lt; 30 couverts, &lt; 80 references).
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <h3 className="font-bold text-emerald-900 mb-3">Logiciel dedie</h3>
              <ul className="text-sm text-emerald-800 space-y-2 leading-relaxed">
                <li>+ Saisie sur tablette (gain 50 % de temps)</li>
                <li>+ Lecture code-barres (gain 70 % sur secs)</li>
                <li>+ Calculs automatiques (consommation, ecart, rotation)</li>
                <li>+ Historique complet exploitable</li>
                <li>+ Alertes seuil bas et derive food cost</li>
                <li>+ Photos integrees aux fiches</li>
                <li>- Cout 30 a 80 EUR/mois</li>
              </ul>
              <p className="text-xs text-emerald-700 mt-4 font-semibold">
                ROI atteint en moins de 2 mois pour 90 % des restaurants. Indispensable au-dela de 40 couverts.
              </p>
            </div>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Comparatif des solutions 2026</h3>
            <p>
              Voici les principales solutions d'inventaire restaurant disponibles en France en 2026 :
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Solution</th>
                  <th className="text-center py-3 px-4 font-semibold">Prix de depart</th>
                  <th className="text-left py-3 px-4 font-semibold rounded-tr-xl">Point fort</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-emerald-50"><td className="py-3 px-4 font-bold text-emerald-900">RestauMargin</td><td className="py-3 px-4 text-center">29 EUR/mois</td><td className="py-3 px-4 text-xs">Focus marges + stocks + scan factures OCR, IA integree</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-bold">Easilys</td><td className="py-3 px-4 text-center">80 EUR/mois</td><td className="py-3 px-4 text-xs">Multi-sites, robuste, oriente cuisines centrales</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-bold">Foodmeup</td><td className="py-3 px-4 text-center">50 EUR/mois</td><td className="py-3 px-4 text-xs">Patisseries et fiches techniques complexes</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-bold">Tablo</td><td className="py-3 px-4 text-center">39 EUR/mois</td><td className="py-3 px-4 text-xs">Bistrots et brasseries, interface simple</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-bold">Inpulse</td><td className="py-3 px-4 text-center">59 EUR/mois</td><td className="py-3 px-4 text-xs">Cloud, integration POS, multi-sites</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 11 : Management */}
        <section id="management" className="mb-16">
          <SectionHeading icon={<Users className="w-6 h-6" />} number="11">
            L'inventaire comme outil de management
          </SectionHeading>

          <div className="prose-content">
            <p>
              L'inventaire restaurant n'est pas seulement un outil financier. C'est aussi un puissant levier de management qui responsabilise l'equipe et cree de la rigueur collective. Voici les pratiques qui marchent dans les restaurants performants.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-mono-100">Responsable par zone</h3>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">
                Designer un referent inventaire par zone (cave = sommelier, cuisine = sous-chef, etc.). Cela responsabilise et accelere le comptage. Chaque referent connait sa zone par coeur et detecte plus vite les anomalies.
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-mono-100">Recompenser la rigueur</h3>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">
                Prime collective si l'ecart d'inventaire reste sous 1 % pendant 3 mois consecutifs. Exemple : 0,5 % du gain de food cost reverse a l'equipe. Cree un cercle vertueux et engage tout le monde.
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-mono-100">Communiquer les resultats</h3>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">
                Affichage mensuel des resultats : "Ce mois, on a gagne 800 EUR sur l'ecart d'inventaire." La transparence renforce la confiance et l'engagement. Cache les chiffres = perte d'adhesion.
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-mono-100">Rituel hebdomadaire</h3>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">
                Toujours le meme jour, a la meme heure, avec la meme equipe. La regularite cree l'habitude, l'habitude cree la rigueur, la rigueur cree la marge. C'est le secret des restaurants au food cost maitrise.
              </p>
            </div>
          </div>

          <Callout type="info">
            <strong>La regle FIFO en complement :</strong> etiqueter chaque reception avec la date, ranger les nouveaux arrivages derriere les anciens, sortir toujours du devant. Une cuisine sans FIFO genere facilement 5-10 % de pertes en plus. Decouvrez notre guide complet de la <Link to="/blog/methode-fifo-gestion-stocks-restaurant" className="text-teal-700 underline hover:text-teal-800">methode FIFO en restauration</Link>.
          </Callout>
        </section>

        {/* SECTION 12 : Automatiser */}
        <section className="mb-16">
          <SectionHeading icon={<Lightbulb className="w-6 h-6" />} number="12">
            Automatiser avec RestauMargin
          </SectionHeading>

          <div className="prose-content">
            <p>
              RestauMargin a ete concu pour simplifier radicalement l'inventaire restaurant. Voici les 6 fonctionnalites cles qui font gagner 50 a 70 % de temps tout en augmentant la fiabilite.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Smartphone className="w-5 h-5" />, title: 'Saisie tablette en temps reel', desc: 'Tablette Android ou iPad dans chaque zone. Saisie par binome, validation immediate, sauvegarde cloud.' },
              { icon: <Package className="w-5 h-5" />, title: 'Scan factures OCR', desc: 'Photographiez vos factures fournisseurs : les prix et quantites sont extraits automatiquement. Plus de saisie manuelle.' },
              { icon: <Calculator className="w-5 h-5" />, title: 'Calculs automatiques', desc: 'Consommation, ecart, food cost reel, rotation par categorie : tous calcules en temps reel apres saisie du stock final.' },
              { icon: <AlertTriangle className="w-5 h-5" />, title: 'Alertes intelligentes', desc: 'Notification si le food cost depasse votre seuil, si un produit a une rotation anormale, si un ecart depasse 2 %.' },
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Historique exploitable', desc: 'Graphiques des ecarts mois par mois, par categorie, par produit. Identification visuelle des derives.' },
              { icon: <Target className="w-5 h-5" />, title: 'Plan d\'action integre', desc: 'Suggestions IA pour reduire les ecarts : revoir une fiche technique, changer un fournisseur, ajuster une portion.' }
            ].map((feat, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-3">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-mono-100 mb-1.5">{feat.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          <div className="prose-content mt-8">
            <p>
              Plus de 500 restaurants en France utilisent deja RestauMargin pour piloter leurs stocks et leurs marges. Le gain moyen constate est de 2 a 3 points de food cost dans les 6 premiers mois d'utilisation, principalement par detection precoce des derives et automatisation de l'inventaire. Decouvrez nos <Link to="/pricing" className="text-teal-700 underline hover:text-teal-800">tarifs</Link> ou commencez par le <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline hover:text-teal-800">calculateur de food cost gratuit</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="15 min" variant="footer" />

        {/* FAQ visible */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes sur l'inventaire restaurant</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* Sources EAT */}
        <section className="mb-12">
          <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-mono-100 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              Sources et references
            </h2>
            <ul className="text-sm text-mono-400 space-y-2">
              <li>- INSEE — Statistiques sectorielles de la restauration en France (donnees 2024-2026)</li>
              <li>- GIRA Conseil — Etude annuelle de la profitabilite restaurants HCR France</li>
              <li>- Reglement (CE) n° 178/2002 — Tracabilite des denrees alimentaires (Paquet Hygiene)</li>
              <li>- Plan Comptable General — Methodes de valorisation des stocks (PEPS et CMUP autorises)</li>
              <li>- Base RestauMargin — 500+ restaurants connectes, donnees agregees 2025-2026</li>
              <li>- Convention collective nationale HCR (IDCC 1979) — Procedures de tracabilite et responsabilite</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Pilotez votre inventaire restaurant en temps reel
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Inventaire digital sur tablette, scan code-barres, calcul automatique de l'ecart et du food cost reel, alertes en cas de derive. Le copilote qui detecte les 2 000 EUR que vous perdez chaque mois sans le savoir.
            </p>
            <p className="text-teal-50 text-base max-w-xl mx-auto mb-8">
              <strong>29 EUR/mois</strong> &mdash; essai gratuit 7 jours, sans engagement, sans carte bancaire.
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
                to="/outils/calculateur-food-cost"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
              >
                <Calculator className="w-5 h-5" />
                Calculateur gratuit
              </Link>
            </div>
          </div>
        </section>

        {/* Articles complementaires */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin sur la gestion des stocks</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/methode-fifo-gestion-stocks-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Methode FIFO en restauration</h3>
              <p className="text-xs text-mono-500">Etiquetage, organisation, reduction des pertes de 6-10 %.</p>
            </Link>
            <Link to="/blog/fifo-lifo-stocks-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">FIFO vs LIFO en restauration</h3>
              <p className="text-xs text-mono-500">Comparatif complet et choix legal en France.</p>
            </Link>
            <Link to="/blog/rotation-stocks-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Rotation des stocks</h3>
              <p className="text-xs text-mono-500">Calcul, benchmarks, leviers d'optimisation.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calcul marge restaurant</h3>
              <p className="text-xs text-mono-500">Food cost, marge brute, coefficient multiplicateur.</p>
            </Link>
            <Link to="/blog/food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Food cost optimal</h3>
              <p className="text-xs text-mono-500">Benchmarks par type d'etablissement.</p>
            </Link>
            <Link to="/blog/gaspillage" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Reduire le gaspillage</h3>
              <p className="text-xs text-mono-500">10 strategies pour limiter les pertes.</p>
            </Link>
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Reduire le food cost</h3>
              <p className="text-xs text-mono-500">10 leviers concrets en 2026.</p>
            </Link>
            <Link to="/outils/calculateur-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calculateur food cost gratuit</h3>
              <p className="text-xs text-mono-500">Calculez votre marge en 30 secondes.</p>
            </Link>
          </div>
        </section>

        {/* Nav bas */}
        <div className="mt-12 pt-8 border-t border-mono-900 flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">&larr; Tous les articles</Link>
          <Link to="/blog/rotation-stocks-restaurant" className="text-sm text-teal-600 hover:underline">Rotation des stocks &rarr;</Link>
        </div>

        </article>
      </main>

      {/* Footer */}
      <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-mono-500">
          <Link to="/landing" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4">
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mb-4">La plateforme de gestion de marge pour les restaurateurs.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-mono-700">
            <Link to="/mentions-legales" className="hover:text-teal-600 transition-colors">Mentions legales</Link>
            <Link to="/cgv" className="hover:text-teal-600 transition-colors">CGV</Link>
            <Link to="/cgu" className="hover:text-teal-600 transition-colors">CGU</Link>
            <Link to="/politique-confidentialite" className="hover:text-teal-600 transition-colors">Confidentialite</Link>
          </div>
          <p className="mt-6 text-xs text-mono-700">&copy; {new Date().getFullYear()} RestauMargin. Tous droits reserves.</p>
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

function ErreurCard({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5 sm:p-6 flex gap-4">
      <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
        {number}
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
