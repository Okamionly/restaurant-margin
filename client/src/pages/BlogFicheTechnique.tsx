import { Link } from 'react-router-dom';
import { ChefHat, Calculator, ArrowRight, BookOpen, Users, FileText, ClipboardList, CheckCircle, Lightbulb, AlertTriangle, TrendingDown, BarChart3, Beef, Sparkles, Award, ListChecks, Percent, DollarSign } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Fiche technique restaurant : le guide complet 2026"
   Mots-cles principaux : fiche technique restaurant, fiche technique exemple recette
   ~3 200 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "A quoi sert une fiche technique en restauration ?",
    answer: "La fiche technique est un document de gestion qui standardise une recette : grammages exacts, cout matieres, procedure, allergenes, photo de dressage. Elle garantit la constance qualitative independamment du cuisinier qui prepare le plat et permet de calculer precisement le food cost. Sans fiche technique, votre marge derive d'un service a l'autre.",
  },
  {
    question: "Quelle est la difference entre quantite brute et quantite nette ?",
    answer: "La quantite brute est ce que vous achetez (un kilo de carottes entieres). La quantite nette est ce qui se retrouve dans l'assiette apres epluchage, parage, cuisson (800 g de carottes epluchees). Le ratio net/brut est appele coefficient de rendement et doit figurer sur chaque fiche technique pour ne pas sous-estimer le cout reel.",
  },
  {
    question: "Quel food cost viser pour un restaurant traditionnel ?",
    answer: "En restauration traditionnelle, le food cost ideal se situe entre 28 % et 35 % du prix de vente HT. Un bistrot vise 28-33 %, une brasserie 28-35 %, un gastronomique peut accepter jusqu'a 40 % (produits premium). En dessous de 25 %, les portions sont souvent trop reduites et nuisent a la satisfaction client.",
  },
  {
    question: "A quelle frequence mettre a jour les prix dans ses fiches techniques ?",
    answer: "Les prix doivent etre mis a jour tous les trimestres minimum, ou apres chaque changement tarifaire significatif d'un fournisseur. Pour les produits frais volatils (poisson, viande), idealement chaque mois. Des prix obsoletes donnent un food cost errone : un beurre passe de 4 a 6 EUR/kg fausse votre marge de 50 % sur cet ingredient.",
  },
  {
    question: "Quels logiciels pour creer des fiches techniques restaurant ?",
    answer: "Plusieurs options : tableurs Excel/Google Sheets (gratuit mais manuel), logiciels metiers comme RestauMargin, MarketMan, Inpulse. Un outil specialise automatise les mises a jour de prix, calcule le food cost en temps reel, lie les fiches aux stocks et genere les listes de courses. Un tableur reste viable pour moins de 30 plats, au-dela il faut un outil dedie.",
  },
  {
    question: "Combien de fiches techniques faut-il dans un restaurant ?",
    answer: "Une fiche par plat propose a la carte, y compris les variantes (steak frites, steak salade), les amuses-bouches, les sauces meres, les preparations de base (fond brun, jus de viande, mayonnaise maison). Un restaurant traditionnel de 25 plats genere typiquement 40-60 fiches techniques au total avec les preparations annexes.",
  },
  {
    question: "Comment integrer les pertes a la cuisson dans une fiche technique ?",
    answer: "Une viande perd 15-30 % de son poids a la cuisson, un poisson 10-15 %. Pour calculer juste : indiquez la quantite brute achetee (200 g de filet cru), le rendement post-cuisson (75 % = 150 g servis), et le cout reel base sur la quantite brute. Si vous comptez 150 g a 30 EUR/kg, vous oubliez les 50 g qui ont disparu a la cuisson.",
  },
  {
    question: "Les fiches techniques sont-elles obligatoires en France ?",
    answer: "Aucune obligation legale stricto sensu, mais elles sont fortement recommandees par la DGCCRF dans le cadre du suivi de la traceabilite alimentaire et indispensables pour respecter le reglement INCO (information sur les allergenes). En cas de controle sanitaire, des fiches techniques structurees demontrent une bonne maitrise HACCP de l'etablissement.",
  },
  {
    question: "Quelle difference entre fiche technique et fiche recette ?",
    answer: "Une fiche recette decrit comment cuisiner le plat (proportions, etapes). Une fiche technique va plus loin : elle integre les couts, les rendements, le food cost, le prix de vente conseille, les allergenes, la duree de conservation, le materiel necessaire. La fiche recette est culinaire, la fiche technique est un outil de gestion.",
  },
  {
    question: "Comment former mon equipe a utiliser les fiches techniques ?",
    answer: "Trois leviers : (1) integrer la lecture des fiches dans l'onboarding chaque nouveau commis, (2) plastifier et afficher les fiches au poste de travail (jamais dans un classeur ferme), (3) faire un audit hebdomadaire en cuisine pour verifier que les grammages sont respectes. Une fiche que personne ne consulte vaut zero, formez activement.",
  },
];

export default function BlogFicheTechnique() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Fiche technique restaurant : guide complet + exemple recette 2026"
        description="Tout sur la fiche technique restaurant : elements obligatoires, calcul cout matieres, exemple magret de canard chiffre, modele gratuit, erreurs a eviter."
        path="/blog/fiche-technique-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Fiche technique restaurant', url: 'https://www.restaumargin.fr/blog/fiche-technique-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Comment creer une fiche technique restaurant en 7 etapes',
            description: 'Methode pas-a-pas pour creer une fiche technique professionnelle, avec calcul du cout matieres, des rendements et du food cost.',
            totalTime: 'PT30M',
            tool: ['Balance de cuisine de precision', 'Calculatrice', 'Tableur ou logiciel RestauMargin', 'Appareil photo (smartphone)'],
            step: [
              { '@type': 'HowToStep', name: "Lister les ingredients et grammages bruts", text: "Notez chaque ingredient avec sa quantite brute (poids a l'achat). Sans omettre les petits ingredients (sel, huile, herbes) qui cumulent 3-5 % du food cost." },
              { '@type': 'HowToStep', name: 'Mesurer les coefficients de rendement', text: 'Pesez chaque ingredient avant et apres preparation (epluchage, parage). Un kilo de carottes brutes = 820 g epluchees, un filet de boeuf 200 g = 180 g pare. Ne vous fiez pas aux chiffres generiques.' },
              { '@type': 'HowToStep', name: 'Relever les prix d\'achat reels', text: "Utilisez vos dernieres factures fournisseurs, jamais des prix de tete. Prevoyez une revision trimestrielle des prix dans toutes vos fiches." },
              { '@type': 'HowToStep', name: 'Calculer le cout matieres total', text: 'Pour chaque ligne : (quantite brute x prix au kg/litre). Additionnez. Ajoutez un forfait de 3 a 5 % pour les matieres seches (sel, poivre, herbes, huiles). C\'est votre cout matieres par portion.' },
              { '@type': 'HowToStep', name: 'Integrer les pertes a la cuisson', text: 'Mesurez la perte cuisson de chaque ingredient sensible (viande, poisson). Une volaille perd 20-25 %, un boeuf 15-20 %. La quantite servie sera inferieure a la quantite brute payee.' },
              { '@type': 'HowToStep', name: 'Calculer le food cost et le prix de vente', text: 'Food cost (%) = (Cout matieres / Prix de vente HT) x 100. Visez 28-35 % en restauration traditionnelle. Determinez le prix de vente en multipliant le cout matieres par votre coefficient cible (3,0 a 3,5).' },
              { '@type': 'HowToStep', name: 'Documenter procedure, allergenes, photo', text: 'Decrivez la mise en place et la procedure dans l\'ordre chronologique. Listez les 14 allergenes obligatoires INCO. Photographiez le dressage final en reference pour l\'equipe.' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Fiche technique restaurant : guide complet + exemple recette 2026',
            description: "Guide exhaustif pour creer et exploiter des fiches techniques restaurant : structure, calcul du cout matieres, exemple chiffre magret de canard, modele gratuit, bonnes pratiques.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-04-14',
            dateModified: '2026-05-26',
            wordCount: 3200,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/fiche-technique-restaurant' },
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
              to="/outils/calculateur-food-cost"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Calculer mon food cost
            </Link>
            <Link to="/login" className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">
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
          <span className="text-mono-100 font-medium">Fiche technique restaurant</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Fiches techniques"
        readTime="15 min"
        date="Avril 2026 - Mise a jour mai 2026"
        title="Fiche technique restaurant : le guide complet 2026"
        accentWord="fiche technique"
        subtitle="La fiche technique est le document le plus sous-estime de la cuisine professionnelle. Bien construite, elle elimine les derives de couts, garantit la constance de vos plats et devient le fondement de votre rentabilite. Guide complet avec exemple chiffre magret de canard."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-14" updatedDate="2026-05-26" readTime="15 min" variant="header" />

        {/* ── Encadre formule rapide (featured snippet) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Fiche technique en 1 minute</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Qu'est-ce qu'une fiche technique restaurant ?
          </h2>
          <p className="text-teal-50 leading-relaxed mb-4">
            Une <strong className="text-white">fiche technique restaurant</strong> est un document de gestion qui standardise une recette en
            integrant : ingredients avec grammages brut et net, coefficients de rendement, prix unitaires,
            cout matieres calcule, procedure de preparation, allergenes INCO et photo de dressage.
            Elle remplit trois fonctions : <strong>garantir la constance qualitative</strong>,
            <strong> maitriser le food cost</strong> et <strong>former les equipes</strong>.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 font-mono text-sm">
            <div><strong>Food cost</strong> = (Cout matieres / Prix de vente HT) x 100</div>
            <div className="mt-1"><strong>Cible</strong> : 28-35 % en restauration traditionnelle</div>
          </div>
        </div>

        {/* ── Sommaire ── */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#definition', label: "Qu'est-ce qu'une fiche technique de cuisine ?" },
              { href: '#elements', label: "Les 8 elements essentiels d'une fiche technique" },
              { href: '#howto', label: "Comment creer une fiche technique en 7 etapes" },
              { href: '#cout', label: 'Comment calculer precisement le cout de revient' },
              { href: '#exemple-magret', label: 'Exemple complet : fiche technique magret de canard' },
              { href: '#modele', label: 'Modele de fiche technique gratuit (template)' },
              { href: '#types-restaurants', label: 'Fiches techniques par type de restaurant' },
              { href: '#bonnes-pratiques', label: 'Bonnes pratiques pour des fiches reellement utilisees' },
              { href: '#erreurs', label: 'Les 5 erreurs a eviter absolument' },
              { href: '#digital', label: 'Fiches techniques digitales avec RestauMargin' },
              { href: '#faq', label: 'Questions frequentes' },
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

        {/* ── Intro ── */}
        <div className="prose-content mb-14">
          <p>
            Imaginez deux cuisiniers qui preparent le meme plat. L'un utilise 180 g de filet de
            boeuf, l'autre 220 g. L'ecart semble anodin — 40 grammes seulement. Multipliez par
            30 couverts par soir, 25 jours par mois : vous perdez <strong>3 kg de filet chaque mois</strong>,
            soit plus de 100 EUR envoles sur un seul plat. Sur l'ensemble d'une carte de 25 references,
            ces derives invisibles cumulees representent entre 8 000 et 15 000 EUR de marge perdue par an
            dans un bistrot moyen.
          </p>
          <p>
            La <strong>fiche technique restaurant</strong> est l'outil qui elimine ces derives silencieuses.
            C'est votre document de reference : il standardise chaque recette, fixe les grammages,
            calcule le cout matieres et garantit que votre plat a exactement le meme gout et le meme cout,
            que vous soyez en cuisine ou non. Selon une etude Fiducial 2025, les etablissements equipes
            de fiches techniques structurees affichent un food cost inferieur de 4 a 7 points par rapport
            a ceux qui n'en ont pas — l'equivalent de 24 000 a 42 000 EUR de marge supplementaire sur
            un CA de 600 000 EUR.
          </p>
          <p>
            Dans ce guide, vous trouverez la definition complete, les 8 elements obligatoires,
            la methode pas-a-pas pour calculer le cout de revient, un <strong>exemple chiffre detaille
            pour un magret de canard</strong>, un modele gratuit a dupliquer, et les erreurs qui plombent
            la rentabilite. Pour aller plus loin sur les calculs, consultez notre guide complet du
            <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">calcul de marge restaurant</Link>
            et notre article sur le
            <Link to="/blog/food-cost" className="text-teal-700 underline hover:text-teal-800 ml-1">food cost en restauration</Link>.
          </p>
        </div>

        {/* ═════════════ SECTION 1 : Definition ═════════════ */}
        <section id="definition" className="mb-16">
          <SectionHeading icon={<FileText className="w-6 h-6" />} number="1">
            Qu'est-ce qu'une fiche technique de cuisine ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              Une <strong>fiche technique</strong> (ou fiche recette) est un document structure qui decrit avec
              precision les ingredients necessaires a la confection d'un plat (et leurs quantites exactes
              en brut et en net), la procedure de preparation etape par etape, le temps de preparation et
              de cuisson, le nombre de portions produites, le cout matieres detaille, le food cost, le prix
              de vente HT et TTC conseille, les allergenes INCO et une photo de reference du dressage final.
            </p>
            <p>
              En restauration professionnelle, la fiche technique est bien plus qu'une simple
              recette — c'est un <strong>outil de gestion financiere</strong>, un
              <strong> garant de la constance qualitative</strong> et un
              <strong> support de formation des equipes</strong>. Elle constitue la brique de base
              de tout systeme de pilotage de marges. Sans elle, le calcul du food cost devient
              une approximation grossiere et le menu engineering est impossible.
            </p>
            <p>
              Historiquement, la fiche technique vient des cuisines de palaces et brigades d'Escoffier
              au debut du XXe siecle. A l'epoque, il s'agissait de garantir la reproductibilite des plats
              malgre les rotations de cuisiniers. Aujourd'hui, avec la complexification des reglementations
              (INCO sur les allergenes, traceabilite HACCP) et la pression sur les marges, elle est devenue
              indispensable dans tous les segments de la restauration commerciale.
            </p>
          </div>

          {/* 4 benefices */}
          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            {[
              {
                icon: <TrendingDown className="w-5 h-5 text-teal-600" />,
                title: 'Maitrise financiere',
                desc: 'Sans fiche technique, votre food cost fluctue a chaque service. Avec elle, vous savez exactement ce que vous coute chaque plat et pouvez piloter vos marges au jour le jour. Gain typique : 3-5 points de marge brute.',
              },
              {
                icon: <CheckCircle className="w-5 h-5 text-teal-600" />,
                title: 'Constance qualitative',
                desc: 'Un client qui revient doit retrouver exactement le meme plat. La fiche technique est votre assurance qualite : meme grammages, meme dressage, meme cuisson. Critique pour la fidelisation.',
              },
              {
                icon: <Users className="w-5 h-5 text-teal-600" />,
                title: 'Formation du personnel',
                desc: 'Un nouveau commis peut reproduire un plat fidelement grace a la fiche technique, meme sans la presence du chef. Reduction du temps d\'onboarding de 50 % en moyenne, selon les retours terrain.',
              },
              {
                icon: <ClipboardList className="w-5 h-5 text-teal-600" />,
                title: 'Gestion des stocks',
                desc: 'En croisant fiches techniques et couverts servis, vous prevoyez vos commandes avec precision et reduisez les pertes. Base indispensable pour la prevision des achats et le calcul des inventaires theoriques.',
              },
              {
                icon: <Award className="w-5 h-5 text-teal-600" />,
                title: 'Conformite reglementaire',
                desc: 'Le reglement INCO impose l\'affichage des allergenes presents dans chaque plat. La fiche technique structuree centralise ces informations et facilite les controles DGCCRF et HACCP.',
              },
              {
                icon: <BarChart3 className="w-5 h-5 text-teal-600" />,
                title: 'Menu engineering',
                desc: 'Identifier vos Stars (rentables + populaires), Puzzles, Plowhorses et Dogs necessite des donnees de cout fiables. Les fiches techniques sont l\'input numero un de toute strategie d\'optimisation de carte.',
              },
            ].map((b, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  {b.icon}
                  <span className="font-bold text-mono-100">{b.title}</span>
                </div>
                <p className="text-sm text-mono-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Elements ═════════════ */}
        <section id="elements" className="mb-16">
          <SectionHeading icon={<ClipboardList className="w-6 h-6" />} number="2">
            Les 8 elements essentiels d'une fiche technique
          </SectionHeading>

          <div className="prose-content">
            <p>
              Une fiche technique professionnelle comprend huit sections incontournables.
              Voici ce qu'elle doit absolument contenir pour etre exploitable au quotidien
              et conforme aux exigences reglementaires.
            </p>
          </div>

          <div className="space-y-4 mt-6">
            <ElementCard
              number={1}
              title="L'en-tete d'identification"
              items={[
                "Nom du plat (avec eventuellement le numero de carte)",
                "Categorie (entree, plat, dessert, amuse-bouche, accompagnement, sauce)",
                "Nombre de portions pour lesquelles la fiche est calculee (souvent 1 ou 10)",
                "Date de creation et version (car les recettes evoluent : v1.0, v1.2, v2.0)",
                "Auteur / Chef responsable et eventuel valideur",
              ]}
            />
            <ElementCard
              number={2}
              title="La liste des ingredients avec grammages bruts et nets"
              items={[
                "Quantite brute : ce que vous achetez (avant epluchage/parage)",
                "Coefficient de rendement : ratio net/brut (ex : carotte epluchee = 0,82, filet de boeuf pare = 0,90)",
                "Quantite nette : ce qui se retrouve dans l'assiette apres preparation",
                "Prix unitaire par kg/L (mis a jour trimestriellement minimum)",
                "Cout total par ingredient pour le calcul du food cost",
              ]}
            />
            <ElementCard
              number={3}
              title="La procedure de preparation"
              items={[
                "Mise en place : marinades, reductions, preparations prealables (la veille si necessaire)",
                "Deroulement de la recette dans l'ordre chronologique (numerote)",
                "Points critiques : temperatures de cuisson, durees, textures attendues, points de coloration",
                "Materiel specifique requis (four basse temperature, thermometre sonde, bain-marie)",
                "Dressage : description detaillee et photo de reference du rendu final",
              ]}
            />
            <ElementCard
              number={4}
              title="Les informations de production"
              items={[
                "Temps de preparation (mise en place), temps de cuisson, temps de dressage",
                "Materiel necessaire (fours specifiques, ustensiles, bains-marie)",
                "Consignes de conservation et duree de vie de la preparation (jours, sous vide, refrigeration)",
                "Procedure de remise en temperature pour les preparations a l'avance",
              ]}
            />
            <ElementCard
              number={5}
              title="Les couts et indicateurs financiers"
              items={[
                "Cout matieres total par portion (somme des couts ingredients + matieres seches)",
                "Forfait matieres seches : 3 a 5 % du cout matieres (sel, poivre, huiles, herbes)",
                "Prix de vente HT et TTC conseille (avec coefficient multiplicateur applique)",
                "Food cost en pourcentage et marge brute en euros et pourcentage",
                "Coefficient multiplicateur applique et coefficient cible",
              ]}
            />
            <ElementCard
              number={6}
              title="Les allergenes (obligation INCO)"
              items={[
                "Les 14 allergenes obligatoires : gluten, crustaces, oeufs, poissons, arachides, soja, lait, fruits a coque, celeri, moutarde, sesame, sulfites, lupin, mollusques",
                "Indication claire et lisible pour chaque allergene present",
                "Mention des contaminations croisees possibles (traces)",
                "Compatible avec la procedure d'information du client (carte, panneau, support digital)",
              ]}
            />
            <ElementCard
              number={7}
              title="Les valeurs nutritionnelles (optionnel mais recommande)"
              items={[
                "Calories par portion (kcal)",
                "Macronutriments : proteines, glucides, lipides (g et %)",
                "Information utile pour les clients soucieux de leur alimentation",
                "Obligatoire pour la restauration collective et utile en restaurant commercial",
              ]}
            />
            <ElementCard
              number={8}
              title="La photo de dressage de reference"
              items={[
                "Photo prise en conditions reelles, eclairage neutre",
                "Idealement vue en plongee 45 degres et plongee verticale (top shot)",
                "Indication du type d'assiette ou de contenant (ronde 28 cm, ardoise rectangulaire, bol)",
                "Reference visuelle indispensable pour la constance entre services",
              ]}
            />
          </div>

          <div className="mt-8">
            <Callout type="info">
              <strong>Coefficients de rendement courants (sources Fiducial 2025) :</strong> Carotte entiere
              epluchee (~82 % net), filet de boeuf pare (~90 % net), poisson entier en filets (45-55 % net),
              herbes fraiches effeuillees (~60 % net), oignon emince (~85 % net), pomme de terre epluchee
              (~78 % net). Ne vous fiez pas a ces chiffres generiques : mesurez dans votre cuisine avec
              vos produits et votre personnel. Les variations peuvent atteindre 5-8 points selon la
              qualite d'origine.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION HOWTO : 7 etapes ═════════════ */}
        <section id="howto" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="3">
            Comment creer une fiche technique en 7 etapes
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la methode pas-a-pas pour creer une fiche technique professionnelle. Comptez 30 a 45
              minutes par recette la premiere fois, puis 10-15 minutes une fois le pli pris. Le retour sur
              investissement est immediat : chaque fiche correctement faite economise des dizaines d'euros
              par mois en derives evitees.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Lister tous les ingredients et leurs grammages bruts',
                body: "Pour chaque plat, listez chaque ingredient avec sa quantite exacte en grammes ou en millilitres. N'oubliez pas les ingredients de garniture, les sauces, les huiles de cuisson, les epices, les herbes, les decors. Plus la fiche est complete, plus le calcul est juste. Pesez systematiquement plutot que d'estimer a l'oeil. Une difference de 10 g par ingredient sur 5 ingredients = 50 g d'ecart cumule, soit 8-12 % de derive.",
              },
              {
                title: 'Mesurer les coefficients de rendement reels',
                body: "Pour chaque ingredient transforme, pesez avant et apres preparation (epluchage, parage, desossage). Un kilo de carottes brutes ne donne pas 1 kg de carottes a cuisiner : compter 800-820 g. Un filet de boeuf de 2 kg pare donne 1,8 kg. Ne vous contentez pas des chiffres generiques : votre rendement depend de la qualite du produit, de la dexterite de votre equipe et de votre materiel. Mesurez sur 5-10 essais et faites la moyenne.",
              },
              {
                title: 'Relever les prix d\'achat reels depuis vos factures',
                body: "Consultez vos dernieres factures fournisseurs (mois courant). Ne jamais utiliser des prix \"de tete\" ou de l'annee derniere. Les prix varient selon les saisons et les fournisseurs : la tomate passe de 1,80 EUR/kg en aout a 3,20 EUR/kg en janvier. Prevoyez une revision trimestrielle minimum, idealement mensuelle pour les produits volatils (poisson, fruits, legumes). Un outil comme RestauMargin connecte aux factures automatise cette mise a jour.",
              },
              {
                title: 'Calculer le cout matieres total avec matieres seches',
                body: "Pour chaque ligne, multipliez la quantite brute (et non la quantite nette, car vous payez la quantite brute) par le prix au gramme ou millilitre. Exemple : 220 g de magret a 18 EUR/kg = 0,220 x 18 = 3,96 EUR. Additionnez toutes les lignes. Ajoutez un forfait de 3 a 5 % du sous-total pour les matieres seches (sel fin, poivre, huile cuisson, vinaigre, herbes seches) qui sont impossibles a chiffrer ligne par ligne.",
              },
              {
                title: 'Integrer les pertes a la cuisson',
                body: "Une viande perd 15-30 % de son poids a la cuisson selon le type et le degre de cuisson. Un filet de volaille de 200 g cru pese 150-160 g a la sortie du four. Un poisson 10-15 %. Votre portion servie sera donc plus petite que la quantite brute payee. Cette perte ne change pas votre cout matieres (vous avez paye la quantite brute) mais affecte la perception client du grammage. Indiquez sur la fiche : quantite brute, perte cuisson en %, quantite servie.",
              },
              {
                title: "Calculer le food cost et determiner le prix de vente",
                body: "Food cost (%) = (Cout matieres / Prix de vente HT) x 100. Si vous fixez le prix : food cost = cout / prix. Si vous calculez le prix : prix = cout x coefficient multiplicateur (typiquement 3,0 a 3,5 en restauration traditionnelle pour un food cost de 28-33 %). Verifiez la coherence avec le marche local : un magret a 32 EUR dans une brasserie est dans le marche, a 45 EUR vous risquez de plomber le menu mix.",
              },
              {
                title: "Documenter procedure, allergenes et photographier le dressage",
                body: "Decrivez la mise en place et la procedure de preparation dans l'ordre chronologique, en numerotant chaque etape. Indiquez les temperatures de cuisson, les durees, les textures attendues, les points critiques. Listez les 14 allergenes obligatoires INCO presents. Photographiez le dressage final avec un eclairage neutre (vue plongee 45 degres ideale) : cette photo devient la reference de l'equipe pour reproduire le plat fidelement.",
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
            <strong>Astuce gain de temps :</strong> au lieu de refaire ce calcul a la main pour chaque plat,
            utilisez le <Link to="/outils/calculateur-food-cost" className="underline font-semibold hover:text-teal-700">calculateur de food cost gratuit RestauMargin</Link>.
            Vous saisissez ingredients, grammages et prix : le food cost et la marge brute s'affichent instantanement.
            Vous pouvez ensuite exporter le resultat au format PDF ou Excel pour archivage.
          </Callout>
        </section>

        {/* ═════════════ SECTION 4 : Calcul cout ═════════════ */}
        <section id="cout" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="4">
            Comment calculer precisement le cout de revient
          </SectionHeading>

          <div className="prose-content">
            <p>
              C'est la partie la plus importante de la fiche technique. Voici la methode
              etape par etape, avec les pieges a eviter pour ne pas sous-estimer votre cout reel.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4 mt-6">
            {[
              {
                step: '1',
                title: 'Relevez vos prix d\'achat reels',
                desc: 'Consultez vos dernieres factures fournisseurs. Les prix varient selon les saisons et les fournisseurs — prevoyez une revision trimestrielle. Ne jamais utiliser des prix "de tete". La precision a +/- 5 % suffit pour le food cost, +/- 2 % pour le menu engineering.',
              },
              {
                step: '2',
                title: 'Mesurez les pertes reelles',
                desc: 'Pesez vos produits avant et apres preparation. Ne vous fiez pas aux coefficients generiques — mesurez dans votre cuisine, avec votre personnel, sur vos produits specifiques. Refaites les mesures 1 a 2 fois par an pour suivre les evolutions (qualite fournisseur, changement equipe).',
              },
              {
                step: '3',
                title: 'Additionnez tous les couts, meme les petits',
                desc: 'Sel, poivre, huile, fonds de cuisine, garnitures, decors... Comptez-les en ajoutant un forfait de 3 a 5 % du cout total. Ces "matieres seches" s\'accumulent sur l\'ensemble de votre carte. Sur un cout matieres de 6 EUR, le forfait represente 18-30 centimes, soit 0,5-1 point de food cost.',
              },
              {
                step: '4',
                title: 'Integrez les pertes a la cuisson',
                desc: 'Un filet de volaille de 200 g (cru) peut perdre 20 a 25 % de son poids a la cuisson. Votre portion servie sera de 150 a 160 g — mais vous avez paye 200 g. Cette perte doit figurer dans la fiche pour deux raisons : (1) communiquer la portion reelle au client, (2) ajuster le grammage achete si vous voulez une portion servie precise.',
              },
              {
                step: '5',
                title: 'Verifiez la coherence avec l\'inventaire reel',
                desc: 'Croisez vos calculs theoriques avec l\'inventaire mensuel. Si votre theorique dit "j\'ai utilise 50 kg de magret" et que l\'inventaire montre 58 kg sortis, vous avez 16 % de derive. Identifiez la source : portions trop genereuses, pertes a la cuisson sous-estimees, vols, casse. C\'est le test de verite de vos fiches techniques.',
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 bg-white border border-mono-900 rounded-2xl p-5">
                <div className="w-9 h-9 bg-teal-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                  {s.step}
                </div>
                <div>
                  <p className="font-bold text-mono-100 mb-1">{s.title}</p>
                  <p className="text-sm text-mono-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Formule */}
          <div className="mt-8 bg-teal-50 border border-teal-200 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-600" />
              Formule du food cost
            </h3>
            <div className="bg-white rounded-xl p-4 text-center font-mono text-base sm:text-lg font-semibold text-teal-700 border border-teal-100 mb-4">
              Food cost (%) = (Cout matieres par portion / Prix de vente HT) x 100
            </div>
            <div className="text-sm text-mono-400 space-y-1">
              <p><strong>Exemple :</strong> Cout matieres = 4,63 EUR / Portion vendue HT = 28 EUR -- Food cost = <strong>16,5 %</strong></p>
              <p>En restauration traditionnelle, visez un food cost entre <strong>28 % et 35 %</strong>.</p>
              <p>En dessous de 25 %, vos portions sont peut-etre trop reduites et nuisent a la satisfaction client.</p>
              <p>Au-dela de 38 %, votre marge nette devient critique sauf compensation par un fort volume.</p>
            </div>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Exemple Magret de canard ═════════════ */}
        <section id="exemple-magret" className="mb-16">
          <SectionHeading icon={<Beef className="w-6 h-6" />} number="5">
            Exemple complet : fiche technique magret de canard
          </SectionHeading>

          <div className="prose-content">
            <p>
              Passons a un cas concret et chiffre. Voici la fiche technique complete d'un
              <strong> magret de canard rotis, sauce au miel, pommes grenailles et legumes de saison</strong>,
              servi dans une brasserie de centre-ville a 28 EUR TTC (soit 25,45 EUR HT, TVA 10 %).
              Cette fiche est calibree pour <strong>1 portion</strong>. Multipliez les quantites pour
              calculer une production de 10, 20 ou 50 portions.
            </p>
          </div>

          {/* Fiche technique magret */}
          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-mono-900">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-mono-500 font-medium">Fiche Technique - v1.0</p>
                <p className="font-bold text-mono-100 text-lg">Magret de canard roti, sauce miel</p>
                <p className="text-xs text-mono-500 mt-1">Categorie : Plat principal | 1 portion | Brasserie</p>
              </div>
            </div>

            {/* Tableau ingredients */}
            <h4 className="text-sm font-bold uppercase tracking-wider text-mono-500 mb-3">Ingredients et couts</h4>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-mono-975 text-mono-100">
                    <th className="text-left py-2 px-3 font-semibold">Ingredient</th>
                    <th className="text-right py-2 px-3 font-semibold">Qte brute</th>
                    <th className="text-right py-2 px-3 font-semibold">Rendement</th>
                    <th className="text-right py-2 px-3 font-semibold">Qte nette</th>
                    <th className="text-right py-2 px-3 font-semibold">Prix kg/L</th>
                    <th className="text-right py-2 px-3 font-semibold">Cout</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  <tr className="bg-white"><td className="py-2 px-3 font-medium text-mono-100">Magret de canard IGP Sud-Ouest</td><td className="py-2 px-3 text-right">220 g</td><td className="py-2 px-3 text-right">95 %</td><td className="py-2 px-3 text-right">209 g</td><td className="py-2 px-3 text-right">18,50 EUR</td><td className="py-2 px-3 text-right font-semibold">4,07 EUR</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3">Pommes grenailles</td><td className="py-2 px-3 text-right">180 g</td><td className="py-2 px-3 text-right">88 %</td><td className="py-2 px-3 text-right">158 g</td><td className="py-2 px-3 text-right">2,40 EUR</td><td className="py-2 px-3 text-right font-semibold">0,43 EUR</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3">Haricots verts frais</td><td className="py-2 px-3 text-right">120 g</td><td className="py-2 px-3 text-right">85 %</td><td className="py-2 px-3 text-right">102 g</td><td className="py-2 px-3 text-right">4,80 EUR</td><td className="py-2 px-3 text-right font-semibold">0,58 EUR</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3">Carottes des sables</td><td className="py-2 px-3 text-right">100 g</td><td className="py-2 px-3 text-right">82 %</td><td className="py-2 px-3 text-right">82 g</td><td className="py-2 px-3 text-right">1,90 EUR</td><td className="py-2 px-3 text-right font-semibold">0,19 EUR</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3">Miel de chataignier</td><td className="py-2 px-3 text-right">15 g</td><td className="py-2 px-3 text-right">100 %</td><td className="py-2 px-3 text-right">15 g</td><td className="py-2 px-3 text-right">14,00 EUR</td><td className="py-2 px-3 text-right font-semibold">0,21 EUR</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3">Echalotes</td><td className="py-2 px-3 text-right">30 g</td><td className="py-2 px-3 text-right">88 %</td><td className="py-2 px-3 text-right">26 g</td><td className="py-2 px-3 text-right">5,80 EUR</td><td className="py-2 px-3 text-right font-semibold">0,17 EUR</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3">Vinaigre balsamique</td><td className="py-2 px-3 text-right">10 ml</td><td className="py-2 px-3 text-right">100 %</td><td className="py-2 px-3 text-right">10 ml</td><td className="py-2 px-3 text-right">8,50 EUR</td><td className="py-2 px-3 text-right font-semibold">0,09 EUR</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3">Bouillon de volaille</td><td className="py-2 px-3 text-right">40 ml</td><td className="py-2 px-3 text-right">100 %</td><td className="py-2 px-3 text-right">40 ml</td><td className="py-2 px-3 text-right">2,00 EUR</td><td className="py-2 px-3 text-right font-semibold">0,08 EUR</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3">Beurre demi-sel AOP</td><td className="py-2 px-3 text-right">20 g</td><td className="py-2 px-3 text-right">100 %</td><td className="py-2 px-3 text-right">20 g</td><td className="py-2 px-3 text-right">8,80 EUR</td><td className="py-2 px-3 text-right font-semibold">0,18 EUR</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3">Thym frais</td><td className="py-2 px-3 text-right">2 g</td><td className="py-2 px-3 text-right">60 %</td><td className="py-2 px-3 text-right">1,2 g</td><td className="py-2 px-3 text-right">35,00 EUR</td><td className="py-2 px-3 text-right font-semibold">0,07 EUR</td></tr>
                  <tr className="border-t-2 border-mono-900 bg-amber-50">
                    <td className="py-3 px-3 font-bold text-mono-100" colSpan={5}>Sous-total ingredients</td>
                    <td className="py-3 px-3 text-right font-bold text-amber-900">6,07 EUR</td>
                  </tr>
                  <tr className="bg-amber-50">
                    <td className="py-2 px-3 italic text-mono-400" colSpan={5}>+ Forfait matieres seches (4 %) : sel, poivre, fleur de sel, huile</td>
                    <td className="py-2 px-3 text-right font-medium text-amber-900">0,24 EUR</td>
                  </tr>
                  <tr className="bg-teal-100">
                    <td className="py-3 px-3 font-extrabold text-mono-100" colSpan={5}>TOTAL COUT MATIERES</td>
                    <td className="py-3 px-3 text-right font-extrabold text-teal-800 text-base">6,31 EUR</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Indicateurs financiers */}
            <h4 className="text-sm font-bold uppercase tracking-wider text-mono-500 mb-3">Indicateurs financiers</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-white rounded-xl p-3 border border-mono-900">
                <p className="text-xs text-mono-500 mb-1">Prix vente TTC</p>
                <p className="font-bold text-mono-100 text-lg">28,00 EUR</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-mono-900">
                <p className="text-xs text-mono-500 mb-1">Prix vente HT (TVA 10%)</p>
                <p className="font-bold text-mono-100 text-lg">25,45 EUR</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                <p className="text-xs text-emerald-700 mb-1">Food cost</p>
                <p className="font-bold text-emerald-900 text-lg">24,8 %</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                <p className="text-xs text-emerald-700 mb-1">Marge brute</p>
                <p className="font-bold text-emerald-900 text-lg">19,14 EUR</p>
              </div>
            </div>

            {/* Procedure */}
            <h4 className="text-sm font-bold uppercase tracking-wider text-mono-500 mb-3">Procedure (45 min total)</h4>
            <ol className="space-y-2 text-sm text-mono-400 mb-6">
              <li className="bg-white rounded-lg px-3 py-2"><strong>1. Mise en place (15 min) :</strong> Quadriller le gras du magret en croisillons (sans entamer la chair). Eplucher les pommes grenailles, les couper en deux. Equeuter les haricots verts. Tailler les carottes en sifflets. Hacher finement les echalotes.</li>
              <li className="bg-white rounded-lg px-3 py-2"><strong>2. Cuisson magret (12 min) :</strong> Saisir le magret cote peau a froid dans une poele sans matiere grasse. Cuire 8 min cote peau (feu moyen, dorer), retourner 4 min cote chair. Reserver au repos sous papier alu 5 min. Cuisson recommandee : rose (62 degres a coeur).</li>
              <li className="bg-white rounded-lg px-3 py-2"><strong>3. Sauce miel (8 min) :</strong> Faire suer les echalotes dans 1 cuillere du gras de canard. Deglacer au vinaigre balsamique, ajouter le miel, le bouillon de volaille. Reduire de moitie. Monter au beurre froid en fouettant. Saler, poivrer.</li>
              <li className="bg-white rounded-lg px-3 py-2"><strong>4. Garnitures (10 min) :</strong> Rotir les pommes grenailles 12 min au four 200 degres avec thym, fleur de sel. Cuire les haricots verts 4 min a l'anglaise, refraichir, sauter au beurre 1 min. Glacer les carottes a brun 6 min (eau, beurre, sucre).</li>
              <li className="bg-white rounded-lg px-3 py-2"><strong>5. Dressage :</strong> Trancher le magret en 5 tranches de 1 cm dans le sens contraire des fibres. Disposer en eventail au centre. Pommes grenailles a droite, haricots verts en fagot, carottes en sifflets. Napper de sauce miel autour. Fleur de thym frais en decor.</li>
            </ol>

            {/* Allergenes + conservation */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-mono-900">
                <h5 className="text-xs font-bold uppercase text-mono-500 mb-2">Allergenes INCO</h5>
                <p className="text-sm text-mono-100">Lait (beurre), sulfites (vinaigre balsamique)</p>
                <p className="text-xs text-mono-500 mt-1">Possible traces de gluten, moutarde</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-mono-900">
                <h5 className="text-xs font-bold uppercase text-mono-500 mb-2">Conservation</h5>
                <p className="text-sm text-mono-100">Magret cru : 5 jours +3 degres</p>
                <p className="text-xs text-mono-500 mt-1">Sauce miel : 48 h refrigerees, reduire avant service</p>
              </div>
            </div>
          </div>

          <div className="prose-content mt-8">
            <p><strong>Analyse de cette fiche technique :</strong></p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350">
              <li>Cout matieres : <strong>6,31 EUR</strong> par portion (avec matieres seches)</li>
              <li>Prix de vente HT : 25,45 EUR (28 EUR TTC, TVA 10 %)</li>
              <li>Food cost : <strong>24,8 %</strong> — excellent ratio, en-dessous du benchmark brasserie (28-33 %)</li>
              <li>Marge brute : <strong>19,14 EUR</strong> par couvert, soit <strong>75,2 %</strong></li>
              <li>Coefficient multiplicateur : 25,45 / 6,31 = <strong>4,03</strong></li>
            </ul>
            <p className="mt-4">
              Ce magret est un excellent generateur de marge brute en valeur absolue (19,14 EUR par
              couvert). Sur 30 ventes par jour, il rapporte 574 EUR de marge brute quotidienne. C'est
              typiquement le type de plat a positionner comme "Star" en menu engineering : populaire et
              tres rentable. La sauce miel maison apporte un differenciateur perceptible vs concurrence,
              ce qui justifie le prix premium.
            </p>
          </div>

          <Callout type="info">
            <strong>Astuce production :</strong> les fiches techniques peuvent etre dupliquees pour
            calculer des productions plus grandes (10, 20, 50 portions). Pour un service de 30 magrets,
            multipliez toutes les quantites par 30 : 6,6 kg de magret brut, 5,4 kg de pommes grenailles,
            3,6 kg de haricots verts, etc. Cela facilite les commandes fournisseurs et la mise en place.
            RestauMargin genere automatiquement la liste de courses a partir d'une prevision de couverts.
          </Callout>
        </section>

        {/* ═════════════ SECTION 6 : Modele ═════════════ */}
        <section id="modele" className="mb-16">
          <SectionHeading icon={<FileText className="w-6 h-6" />} number="6">
            Modele de fiche technique gratuit (template a dupliquer)
          </SectionHeading>

          <div className="prose-content mb-6">
            <p>
              Voici la structure d'une fiche technique vierge que vous pouvez reproduire ou adapter
              a votre etablissement. Elle couvre tous les elements essentiels en restant
              lisible sur une page A4 et exploitable en cuisine.
            </p>
            <p>
              <strong>Format conseille :</strong> A4 recto-verso, police 11pt minimum (lisible
              sous eclairage de cuisine), tableau d'ingredients en haut, procedure au milieu,
              photo et allergenes en bas. A imprimer, plastifier, et fixer au poste de travail
              concerne (pas dans un classeur ferme).
            </p>
          </div>

          <div className="border-2 border-dashed border-mono-900 rounded-2xl p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-mono-900">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-mono-500 font-medium">Fiche Technique</p>
                <p className="font-bold text-mono-100">[NOM DU PLAT]</p>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Categorie', value: 'Plat / Entree / Dessert' },
                { label: 'Nb. de portions', value: 'X portions' },
                { label: 'Tps. preparation', value: 'XX min' },
                { label: 'Tps. de cuisson', value: 'XX min' },
                { label: 'Cout / portion', value: 'X,XX EUR' },
                { label: 'Food cost', value: 'XX %' },
              ].map((f, i) => (
                <div key={i} className="bg-mono-1000 rounded-xl p-3 text-sm">
                  <p className="text-mono-500 text-xs mb-1">{f.label}</p>
                  <p className="font-semibold text-mono-100">{f.value}</p>
                </div>
              ))}
            </div>

            {/* Ingredients table */}
            <p className="text-xs font-bold uppercase tracking-wider text-mono-500 mb-2">Ingredients</p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-mono-975">
                    {['Ingredient', 'Qte brute', 'Coeff. perte', 'Qte nette', 'Prix/kg', 'Cout'].map((h) => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-mono-100 border-b border-mono-900">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Filet de boeuf', '220 g', '0,90', '198 g', '32 EUR/kg', '7,04 EUR'],
                    ['Echalotes', '60 g', '0,85', '51 g', '4 EUR/kg', '0,24 EUR'],
                    ['Beurre', '30 g', '1,00', '30 g', '8 EUR/kg', '0,24 EUR'],
                    ['...', '...', '...', '...', '...', '...'],
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                      {row.map((cell, j) => (
                        <td key={j} className="px-3 py-2 text-mono-350 border-b border-[#F0F0F0]">{cell}</td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-teal-50">
                    <td colSpan={5} className="px-3 py-2 font-bold text-right text-mono-100">TOTAL</td>
                    <td className="px-3 py-2 font-bold text-teal-700">X,XX EUR</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Other sections */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-mono-500 mb-2">Procedure</p>
                <div className="space-y-1 text-sm text-mono-400">
                  {['1. Mise en place...', '2. Cuisson...', '3. Dressage...'].map((s, i) => (
                    <p key={i} className="bg-mono-1000 rounded-lg px-3 py-2">{s}</p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-mono-500 mb-2">Allergenes &amp; Conservation</p>
                <div className="space-y-1 text-sm text-mono-400">
                  <p className="bg-mono-1000 rounded-lg px-3 py-2">Allergenes : gluten, lait, oeuf...</p>
                  <p className="bg-mono-1000 rounded-lg px-3 py-2">Conservation : 48h sous vide a +3 degres</p>
                </div>
              </div>
            </div>
          </div>

          <Callout type="info">
            <strong>Template Excel a telecharger :</strong> RestauMargin propose un modele Excel
            pre-formate avec formules de calcul automatiques (food cost, marge brute, coefficient
            multiplicateur, conversion HT/TTC). Ce template inclut 5 onglets : fiche vierge, exemple
            magret, table des coefficients de rendement, liste des 14 allergenes INCO, tableau de
            conversion HT/TTC pour les 3 taux de TVA restauration (5,5 %, 10 %, 20 %). Disponible
            apres creation d'un compte gratuit.
          </Callout>
        </section>

        {/* ═════════════ SECTION 7 : Fiches par type de restaurant ═════════════ */}
        <section id="types-restaurants" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="7">
            Fiches techniques par type de restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              La structure d'une fiche technique est universelle, mais les ratios cibles
              (food cost, coefficient multiplicateur) varient selon le type d'etablissement.
              Voici les benchmarks 2026 issus de notre base de donnees de 500+ restaurants.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Type d'etablissement</th>
                  <th className="text-center py-3 px-4 font-semibold">Food cost cible</th>
                  <th className="text-center py-3 px-4 font-semibold">Coefficient</th>
                  <th className="text-center py-3 px-4 font-semibold">Nb fiches typique</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Specificite</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { type: 'Bistrot', fc: '28-33 %', coef: '3,0-3,6', nb: '30-50', spec: 'Carte courte, plats du jour, fiches simples' },
                  { type: 'Brasserie', fc: '28-35 %', coef: '2,9-3,6', nb: '60-100', spec: 'Carte large, beaucoup de variantes' },
                  { type: 'Pizzeria', fc: '15-28 %', coef: '3,6-6,5', nb: '20-40', spec: 'Garnitures multiples, base pate standardisee' },
                  { type: 'Gastronomique', fc: '30-40 %', coef: '2,5-3,3', nb: '20-40', spec: 'Fiches ultra-detaillees, photos obligatoires' },
                  { type: 'Coffee shop', fc: '12-22 %', coef: '4,5-8,0', nb: '40-80', spec: 'Boissons + snacking, modulaires' },
                  { type: 'Food truck', fc: '22-30 %', coef: '3,3-4,5', nb: '10-20', spec: 'Carte courte, production rapide' },
                  { type: 'Restauration collective', fc: '35-45 %', coef: '2,2-2,9', nb: '100-300', spec: 'Valeurs nutritionnelles obligatoires' },
                  { type: 'Dark kitchen', fc: '28-35 %', coef: '2,9-3,6', nb: '20-40', spec: 'Optimisees pour livraison (tenue dans le pack)' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.type}</td>
                    <td className="py-3 px-4 text-center">{row.fc}</td>
                    <td className="py-3 px-4 text-center">{row.coef}</td>
                    <td className="py-3 px-4 text-center">{row.nb}</td>
                    <td className="py-3 px-4 text-xs">{row.spec}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Quelques observations cles :</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                Les <strong>pizzerias et coffee shops</strong> ont les plus hauts coefficients
                multiplicateurs (4,5-8,0) car leurs ingredients de base coutent peu (farine, lait, cafe)
                et le client est habitue a un certain prix. Leurs fiches sont en general plus simples,
                avec des bases standardisees (pate a pizza, lait vapeur) reutilisees sur de nombreuses
                recettes.
              </li>
              <li>
                Le <strong>gastronomique</strong> a un food cost plus eleve (30-40 %) du fait des produits
                premium (truffe, foie gras, poisson noble), mais ses fiches sont ultra-detaillees avec
                souvent 15-25 ingredients par plat et des temps de preparation longs (cuissons basse
                temperature, marinades de 24-48 h, sauces meres).
              </li>
              <li>
                La <strong>restauration collective</strong> a des fiches obligatoirement enrichies des
                valeurs nutritionnelles (calories, macronutriments) pour le respect du PNNS (Programme
                National Nutrition Sante). Les coefficients sont plus faibles car la marge se fait sur
                le volume.
              </li>
              <li>
                Les <strong>dark kitchens</strong> ont des fiches specifiques optimisees pour la
                livraison : ingredients qui ne se delitent pas (sauces a part), pack designe en fonction,
                conservation 30-45 min apres preparation.
              </li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 8 : Bonnes pratiques ═════════════ */}
        <section id="bonnes-pratiques" className="mb-16">
          <SectionHeading icon={<Lightbulb className="w-6 h-6" />} number="8">
            Bonnes pratiques pour des fiches reellement utilisees
          </SectionHeading>

          <div className="prose-content">
            <p>
              Creer des fiches techniques est une chose. S'assurer qu'elles sont effectivement
              utilisees en est une autre. Voici comment passer de la theorie a la pratique
              et faire de la fiche technique un outil vivant en cuisine.
            </p>
          </div>

          <div className="space-y-3 mt-6">
            {[
              {
                title: 'Simplifiez le format',
                desc: 'Une fiche technique de 15 pages que personne ne lit est inutile. Visez une page recto-verso maximum. Priorisez grammages, couts et photo. Texte minimum, tableaux maximum. Lisibilite police 11pt minimum.',
              },
              {
                title: 'Plastifiez et affichez en cuisine',
                desc: 'Imprimez, plastifiez (epaisseur 80 microns minimum pour resister), et accrochez aux postes concernes : entremets pour les plats, patisserie pour les desserts, garde-manger pour les entrees. La fiche doit etre sous la main du cuisinier, pas dans le bureau du chef.',
              },
              {
                title: 'Formez votre equipe',
                desc: 'Lors de l\'integration d\'un nouveau membre, prenez 30 minutes pour expliquer pourquoi les fiches existent et comment les utiliser. Faites une demonstration de pesee. Repassez en revue les 5 plats les plus vendus.',
              },
              {
                title: 'Mettez-les a jour regulierement',
                desc: 'Prix : tous les trimestres minimum, mensuels pour produits volatils. Recettes : a chaque evolution du plat (meme mineure). Photos : a chaque changement de dressage. Une fiche obsolete est trompeuse et perd toute credibilite aupres de l\'equipe.',
              },
              {
                title: 'Liez fiches techniques et commandes',
                desc: 'En croisant le nombre de couverts prevus avec les quantites par portion, vous passez des commandes precises et reduisez les pertes de stock. Un outil comme RestauMargin genere automatiquement la liste de courses a partir d\'une prevision de service.',
              },
              {
                title: 'Auditez le respect des grammages',
                desc: 'Une fois par semaine, faites un audit surprise : pesez 5 portions du meme plat servies par l\'equipe. Comparez aux grammages de la fiche. Une derive de plus de 5 % doit etre corrigee par un brief equipe. Sans audit, les portions augmentent insidieusement.',
              },
              {
                title: 'Versionnez vos fiches',
                desc: 'Indiquez le numero de version (v1.0, v1.1, v2.0) et la date de derniere mise a jour sur chaque fiche. Archivez les versions precedentes pour suivre l\'historique. En cas de probleme client, vous pouvez retracer ce qui a change.',
              },
            ].map((bp, i) => (
              <div key={i} className="flex gap-3 bg-white border border-mono-900 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-mono-100 mb-0.5">{bp.title}</p>
                  <p className="text-sm text-mono-400 leading-relaxed">{bp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════════ SECTION 9 : Erreurs ═════════════ */}
        <section id="erreurs" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="9">
            Les 5 erreurs a eviter absolument
          </SectionHeading>

          <div className="space-y-4 mt-2">
            {[
              {
                n: '01',
                title: 'Ne pas mesurer les pertes reelles',
                desc: 'Utiliser des coefficients theoriques sans les verifier dans votre contexte est risque. Les pertes varient selon la qualite des produits, les competences de vos equipes, le materiel utilise. Une carotte achetee en bio peut perdre 25 % a l\'epluchage, en conventionnel seulement 18 %. Mesurez chez vous.',
              },
              {
                n: '02',
                title: 'Oublier les petites quantites',
                desc: 'Huile d\'olive, fleur de sel, herbes fraiches, micro-pousses, decors floraux... Individuellement negligeables, cumules ils representent 3 a 5 points de food cost. Chiffrez-les via un forfait matieres seches en pourcentage du sous-total ingredients.',
              },
              {
                n: '03',
                title: 'Calculer sur des prix anciens',
                desc: 'Un cout matieres calcule avec les prix d\'il y a 18 mois n\'a aucune valeur decisionnelle. L\'inflation alimentaire cumulee depuis 2022 atteint 21 % en France. La revision des prix est un travail regulier, non optionnel. Reservez 2-3 heures par trimestre pour cette tache.',
              },
              {
                n: '04',
                title: 'Creer des fiches que personne ne lit',
                desc: 'La plus belle fiche technique du monde ne sert a rien si elle est rangee dans un tiroir. L\'implementation operationnelle est aussi importante que la creation : plastification, affichage au poste, formation de l\'equipe, audit hebdomadaire des grammages.',
              },
              {
                n: '05',
                title: 'Ne pas inclure les pertes a la cuisson',
                desc: 'Une perte de 20 % a la cuisson sur un produit a 30 EUR/kg, c\'est 6 EUR perdus par kilo. Sur 10 kg/semaine, c\'est 60 EUR non comptabilises chaque semaine, soit 3 120 EUR/an. La quantite a indiquer dans la fiche est la quantite brute (payee), pas la quantite servie.',
              },
            ].map((err) => (
              <div key={err.n} className="flex gap-4 bg-red-50 border border-red-100 rounded-2xl p-5">
                <span className="text-2xl font-extrabold text-red-200 min-w-[40px]">{err.n}</span>
                <div>
                  <p className="font-bold text-mono-100 mb-1">{err.title}</p>
                  <p className="text-sm text-mono-400 leading-relaxed">{err.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Callout type="warning">
            <strong>Impact cumule :</strong> ces cinq erreurs combinees peuvent representer
            une perte de 6 a 10 points de food cost, soit l'equivalent de 4-7 points de marge brute.
            Sur un restaurant qui fait 600 000 EUR de CA annuel, c'est entre 24 000 EUR et 42 000 EUR
            de benefice potentiel qui disparait silencieusement chaque annee. La creation et le suivi
            rigoureux des fiches techniques est l'investissement temporel le plus rentable en restauration.
          </Callout>

          <div className="prose-content mt-6">
            <p>
              Pour aller plus loin sur la reduction du food cost et l'optimisation des marges,
              consultez nos guides complementaires :
            </p>
            <ul className="list-disc list-inside space-y-1 text-mono-350 mt-3">
              <li>
                <Link to="/blog/food-cost" className="text-teal-700 underline hover:text-teal-800">
                  Food cost en restauration : guide complet et benchmarks
                </Link>
              </li>
              <li>
                <Link to="/blog/coefficient-multiplicateur" className="text-teal-700 underline hover:text-teal-800">
                  Le coefficient multiplicateur expliquee
                </Link>
              </li>
              <li>
                <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 underline hover:text-teal-800">
                  Comment calculer la marge de votre restaurant
                </Link>
              </li>
              <li>
                <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline hover:text-teal-800">
                  Calculateur de food cost gratuit en ligne
                </Link>
              </li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 10 : Digital ═════════════ */}
        <section id="digital" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="10">
            Fiches techniques digitales avec RestauMargin
          </SectionHeading>

          <div className="prose-content">
            <p>
              La fiche technique papier a ses limites : elle devient vite obsolete, difficile a
              dupliquer en cas de changement de prix, et ne se met pas a jour automatiquement
              quand votre fournisseur modifie ses tarifs. La digitalisation resout ces problemes
              et ajoute des fonctionnalites impossibles sur papier.
            </p>
            <p>
              Quand les prix de votre beurre augmentent de 15 %, RestauMargin recalcule
              instantanement le food cost de <em>tous les plats</em> qui l'utilisent (parfois 30-40
              recettes interconnectees) et vous alerte sur ceux dont la marge est devenue insuffisante.
              Le temps de mise a jour passe de 4-6 heures (revision manuelle de chaque fiche papier)
              a 30 secondes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            {[
              { icon: <FileText className="w-5 h-5 text-teal-600" />, label: 'Creation et stockage des fiches en quelques minutes', desc: 'Interface intuitive, autocompletion intelligente des ingredients, suggestion de grammages standard.' },
              { icon: <TrendingDown className="w-5 h-5 text-teal-600" />, label: 'Mise a jour des prix en masse', desc: 'Connectez vos fournisseurs, scannez vos factures (OCR), prix mis a jour automatiquement sur toutes les fiches concernees.' },
              { icon: <Calculator className="w-5 h-5 text-teal-600" />, label: 'Calcul automatique du food cost', desc: 'Pour chaque plat, en temps reel, avec alerte si depassement du seuil cible que vous avez defini (ex : 32 % max).' },
              { icon: <ClipboardList className="w-5 h-5 text-teal-600" />, label: 'Generation des listes de courses', desc: 'A partir d\'une prevision de service (X couverts du plat A, Y couverts du plat B), genere automatiquement la liste consolidee a commander.' },
              { icon: <BarChart3 className="w-5 h-5 text-teal-600" />, label: 'Analyse de rentabilite de votre carte', desc: 'Menu engineering integre : identification des Stars, Puzzles, Plowhorses, Dogs avec recommandations de pricing et de positionnement.' },
              { icon: <AlertTriangle className="w-5 h-5 text-teal-600" />, label: 'Alertes automatiques en cas de derive', desc: 'Notifications push ou email quand un food cost depasse votre seuil, quand un prix fournisseur augmente fortement, quand un plat devient non rentable.' },
              { icon: <Percent className="w-5 h-5 text-teal-600" />, label: 'Versioning automatique des fiches', desc: 'Historique complet de chaque modification : qui, quand, quoi. Possibilite de revenir a une version anterieure si necessaire.' },
              { icon: <DollarSign className="w-5 h-5 text-teal-600" />, label: 'Export PDF et impression optimisee', desc: 'Export PDF pret a imprimer et plastifier (format A4 recto-verso), avec photo, allergenes et tableau ingredients lisibles.' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-white border border-mono-900 rounded-xl p-4">
                <div className="shrink-0 mt-0.5">{f.icon}</div>
                <div>
                  <p className="text-mono-100 font-semibold text-sm mb-1">{f.label}</p>
                  <p className="text-xs text-mono-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="prose-content mt-8">
            <p>
              Plus de 500 restaurants en France utilisent deja RestauMargin pour digitaliser leurs
              fiches techniques. Le gain moyen constate est de <strong>3 a 5 points de food cost dans
              les 6 premiers mois</strong> d'utilisation, grace a une meilleure maitrise des portions,
              des achats et de la construction du menu. Decouvrez nos
              <Link to="/pricing" className="text-teal-700 underline hover:text-teal-800 ml-1">tarifs RestauMargin</Link>
              ou commencez tout de suite avec le
              <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline hover:text-teal-800 ml-1">calculateur de food cost gratuit</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-04-14" updatedDate="2026-05-26" readTime="15 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes sur la fiche technique restaurant</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* ── Sources ── */}
        <section className="mb-16 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h3 className="text-base font-bold text-mono-100 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sources et references
          </h3>
          <ul className="space-y-2 text-sm text-mono-400">
            <li>Fiducial Restauration - Etude annuelle des marges en restauration commerciale (2025)</li>
            <li>INSEE - Indices des prix alimentaires (2022-2025)</li>
            <li>Reglement (UE) n degres 1169/2011 - INCO (information du consommateur sur les denrees alimentaires)</li>
            <li>GIRA Conseil - Benchmarks operationnels restauration 2025</li>
            <li>SNRC - Syndicat National de la Restauration Collective - guides nutritionnels</li>
            <li>DGCCRF - Recommandations sur la traceabilite et les fiches techniques HACCP</li>
            <li>Base interne RestauMargin : 500+ restaurants connectes, 12 000+ fiches techniques analysees</li>
          </ul>
        </section>

        {/* ── CTA ── */}
        <section className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-center text-white mb-16">
          <ChefHat className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Digitalisez vos fiches techniques
          </h2>
          <p className="text-teal-100 max-w-xl mx-auto mb-8 text-base leading-relaxed">
            Crees, mises a jour automatiquement et analysees en temps reel. Vos fiches techniques
            deviennent un veritable tableau de bord de votre rentabilite.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold px-8 py-3.5 rounded-full hover:bg-teal-50 transition-colors text-base"
            >
              Essayer gratuitement 7 jours
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/outils/calculateur-food-cost"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              <Calculator className="w-5 h-5" />
              Calculateur gratuit
            </Link>
          </div>
          <p className="text-teal-200 text-sm mt-4">Sans carte bancaire - Configuration en 5 minutes</p>
        </section>

        {/* ── Articles lies ── */}
        <section>
          <h2 className="text-xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/calcul-marge-restaurant" className="group bg-white border border-mono-900 hover:border-teal-300 rounded-2xl p-5 transition-colors">
              <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Marges</span>
              <p className="font-semibold text-mono-100 mt-1 group-hover:text-teal-600 transition-colors text-sm">
                Calculer la marge de son restaurant
              </p>
            </Link>
            <Link to="/blog/food-cost" className="group bg-white border border-mono-900 hover:border-teal-300 rounded-2xl p-5 transition-colors">
              <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Food cost</span>
              <p className="font-semibold text-mono-100 mt-1 group-hover:text-teal-600 transition-colors text-sm">
                Food cost en restauration : guide
              </p>
            </Link>
            <Link to="/blog/coefficient-multiplicateur" className="group bg-white border border-mono-900 hover:border-teal-300 rounded-2xl p-5 transition-colors">
              <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Pricing</span>
              <p className="font-semibold text-mono-100 mt-1 group-hover:text-teal-600 transition-colors text-sm">
                Le coefficient multiplicateur
              </p>
            </Link>
            <Link to="/outils/calculateur-food-cost" className="group bg-white border border-mono-900 hover:border-teal-300 rounded-2xl p-5 transition-colors">
              <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Outil gratuit</span>
              <p className="font-semibold text-mono-100 mt-1 group-hover:text-teal-600 transition-colors text-sm">
                Calculateur food cost gratuit
              </p>
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
          <p className="mb-4">La plateforme de gestion de marge pour les restaurateurs.</p>
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

function ElementCard({ number, title, items }: { number: number; title: string; items: string[] }) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-7 h-7 bg-teal-600 text-white rounded-lg flex items-center justify-center text-sm font-bold shrink-0">{number}</span>
        <h3 className="font-bold text-mono-100">{title}</h3>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-mono-400">
            <CheckCircle className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>
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
