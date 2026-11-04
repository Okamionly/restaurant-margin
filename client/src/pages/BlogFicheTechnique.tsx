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
    question: "À quoi sert une fiche technique en restauration ?",
    answer: "La fiche technique est un document de gestion qui standardise une recette : grammages exacts, coût matières, procédure, allergènes, photo de dressage. Elle garantit la constance qualitative indépendamment du cuisinier qui prépare le plat et permet de calculer précisément le food cost. Sans fiche technique, votre marge dérive d'un service à l'autre.",
  },
  {
    question: "Quelle est la différence entre quantité brute et quantité nette ?",
    answer: "La quantité brute est ce que vous achetez (un kilo de carottes entières). La quantité nette est ce qui se retrouve dans l'assiette après épluchage, parage, cuisson (800 g de carottes épluchées). Le ratio net/brut est appelé coefficient de rendement et doit figurer sur chaque fiche technique pour ne pas sous-estimer le coût réel.",
  },
  {
    question: "Quel food cost viser pour un restaurant traditionnel ?",
    answer: "En restauration traditionnelle, le food cost idéal se situe entre 28 % et 35 % du prix de vente HT. Un bistrot vise 28-33 %, une brasserie 28-35 %, un gastronomique peut accepter jusqu'à 40 % (produits premium). En dessous de 25 %, les portions sont souvent trop réduites et nuisent à la satisfaction client.",
  },
  {
    question: "À quelle fréquence mettre à jour les prix dans ses fiches techniques ?",
    answer: "Les prix doivent être mis à jour tous les trimestres minimum, ou après chaque changement tarifaire significatif d'un fournisseur. Pour les produits frais volatils (poisson, viande), idéalement chaque mois. Des prix obsolètes donnent un food cost erroné : un beurre passe de 4 à 6 EUR/kg fausse votre marge de 50 % sur cet ingrédient.",
  },
  {
    question: "Quels logiciels pour créer des fiches techniques restaurant ?",
    answer: "Plusieurs options : tableurs Excel/Google Sheets (gratuit mais manuel), logiciels métiers comme RestauMargin, MarketMan, Inpulse. Un outil spécialisé automatise les mises à jour de prix, calcule le food cost en temps réel, lie les fiches aux stocks et génère les listes de courses. Un tableur reste viable pour moins de 30 plats, au-delà il faut un outil dédié.",
  },
  {
    question: "Combien de fiches techniques faut-il dans un restaurant ?",
    answer: "Une fiche par plat proposé à la carte, y compris les variantes (steak frites, steak salade), les amuses-bouches, les sauces mères, les préparations de base (fond brun, jus de viande, mayonnaise maison). Un restaurant traditionnel de 25 plats génère typiquement 40-60 fiches techniques au total avec les préparations annexes.",
  },
  {
    question: "Comment intégrer les pertes à la cuisson dans une fiche technique ?",
    answer: "Une viande perd 15-30 % de son poids à la cuisson, un poisson 10-15 %. Pour calculer juste : indiquez la quantité brute achetée (200 g de filet cru), le rendement post-cuisson (75 % = 150 g servis), et le coût réel basé sur la quantité brute. Si vous comptez 150 g à 30 EUR/kg, vous oubliez les 50 g qui ont disparu à la cuisson.",
  },
  {
    question: "Les fiches techniques sont-elles obligatoires en France ?",
    answer: "Aucune obligation légale stricto sensu, mais elles sont fortement recommandées par la DGCCRF dans le cadre du suivi de la traceabilite alimentaire et indispensables pour respecter le règlement INCO (information sur les allergènes). En cas de contrôle sanitaire, des fiches techniques structurées démontrent une bonne maîtrise HACCP de l'établissement.",
  },
  {
    question: "Quelle différence entre fiche technique et fiche recette ?",
    answer: "Une fiche recette décrit comment cuisiner le plat (proportions, étapes). Une fiche technique va plus loin : elle intègre les coûts, les rendements, le food cost, le prix de vente conseillé, les allergènes, la durée de conservation, le matériel nécessaire. La fiche recette est culinaire, la fiche technique est un outil de gestion.",
  },
  {
    question: "Comment former mon équipe à utiliser les fiches techniques ?",
    answer: "Trois leviers : (1) intégrer la lecture des fiches dans l'onboarding chaque nouveau commis, (2) plastifier et afficher les fiches au poste de travail (jamais dans un classeur fermé), (3) faire un audit hebdomadaire en cuisine pour vérifier que les grammages sont respectés. Une fiche que personne ne consulte vaut zéro, formez activement.",
  },
];

export default function BlogFicheTechnique() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Fiche technique restaurant : guide complet + exemple recette 2026"
        description="Tout sur la fiche technique restaurant : éléments obligatoires, calcul coût matières, exemple magret de canard chiffré, modèle gratuit, erreurs à éviter."
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
            name: 'Comment créer une fiche technique restaurant en 7 étapes',
            description: 'Méthode pas-à-pas pour créer une fiche technique professionnelle, avec calcul du coût matières, des rendements et du food cost.',
            totalTime: 'PT30M',
            tool: ['Balance de cuisine de précision', 'Calculatrice', 'Tableur ou logiciel RestauMargin', 'Appareil photo (smartphone)'],
            step: [
              { '@type': 'HowToStep', name: "Lister les ingrédients et grammages bruts", text: "Notez chaque ingrédient avec sa quantité brute (poids à l'achat). Sans omettre les petits ingrédients (sel, huile, herbes) qui cumulent 3-5 % du food cost." },
              { '@type': 'HowToStep', name: 'Mesurer les coefficients de rendement', text: 'Pesez chaque ingrédient avant et après préparation (épluchage, parage). Un kilo de carottes brutes = 820 g épluchées, un filet de boeuf 200 g = 180 g paré. Ne vous fiez pas aux chiffres génériques.' },
              { '@type': 'HowToStep', name: 'Relever les prix d\'achat réels', text: "Utilisez vos dernières factures fournisseurs, jamais des prix de tête. Prévoyez une révision trimestrielle des prix dans toutes vos fiches." },
              { '@type': 'HowToStep', name: 'Calculer le coût matières total', text: 'Pour chaque ligne : (quantité brute x prix au kg/litre). Additionnez. Ajoutez un forfait de 3 à 5 % pour les matières sèches (sel, poivre, herbes, huiles). C\'est votre coût matières par portion.' },
              { '@type': 'HowToStep', name: 'Intégrer les pertes à la cuisson', text: 'Mesurez la perte cuisson de chaque ingrédient sensible (viande, poisson). Une volaille perd 20-25 %, un boeuf 15-20 %. La quantité servie sera inférieure à la quantité brute payée.' },
              { '@type': 'HowToStep', name: 'Calculer le food cost et le prix de vente', text: 'Food cost (%) = (Coût matières / Prix de vente HT) x 100. Visez 28-35 % en restauration traditionnelle. Déterminez le prix de vente en multipliant le coût matières par votre coefficient cible (3,0 à 3,5).' },
              { '@type': 'HowToStep', name: 'Documenter procédure, allergènes, photo', text: 'Décrivez la mise en place et la procédure dans l\'ordre chronologique. Listez les 14 allergènes obligatoires INCO. Photographiez le dressage final en référence pour l\'équipe.' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Fiche technique restaurant : guide complet + exemple recette 2026',
            description: "Guide exhaustif pour créer et exploiter des fiches techniques restaurant : structure, calcul du coût matières, exemple chiffré magret de canard, modèle gratuit, bonnes pratiques.",
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
          <Link to="/" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
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
        date="Avril 2026 - Mise à jour mai 2026"
        title="Fiche technique restaurant : le guide complet 2026"
        accentWord="fiche technique"
        subtitle="La fiche technique est le document le plus sous-estime de la cuisine professionnelle. Bien construite, elle élimine les dérives de coûts, garantit la constance de vos plats et devient le fondement de votre rentabilité. Guide complet avec exemple chiffré magret de canard."
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
            intégrant : ingrédients avec grammages brut et net, coefficients de rendement, prix unitaires,
            coût matières calculé, procédure de préparation, allergènes INCO et photo de dressage.
            Elle remplit trois fonctions : <strong>garantir la constance qualitative</strong>,
            <strong> maîtriser le food cost</strong> et <strong>former les équipes</strong>.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 font-mono text-sm">
            <div><strong>Food cost</strong> = (Coût matières / Prix de vente HT) x 100</div>
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
              { href: '#elements', label: "Les 8 éléments essentiels d'une fiche technique" },
              { href: '#howto', label: "Comment créer une fiche technique en 7 étapes" },
              { href: '#cout', label: 'Comment calculer précisément le coût de revient' },
              { href: '#exemple-magret', label: 'Exemple complet : fiche technique magret de canard' },
              { href: '#modele', label: 'Modèle de fiche technique gratuit (template)' },
              { href: '#types-restaurants', label: 'Fiches techniques par type de restaurant' },
              { href: '#bonnes-pratiques', label: 'Bonnes pratiques pour des fiches réellement utilisées' },
              { href: '#erreurs', label: 'Les 5 erreurs à éviter absolument' },
              { href: '#digital', label: 'Fiches techniques digitales avec RestauMargin' },
              { href: '#faq', label: 'Questions fréquentes' },
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
            Imaginez deux cuisiniers qui préparent le même plat. L'un utilise 180 g de filet de
            boeuf, l'autre 220 g. L'écart semble anodin — 40 grammes seulement. Multipliez par
            30 couverts par soir, 25 jours par mois : vous perdez <strong>3 kg de filet chaque mois</strong>,
            soit plus de 100 EUR envolés sur un seul plat. Sur l'ensemble d'une carte de 25 références,
            ces dérives invisibles cumulées représentent entre 8 000 et 15 000 EUR de marge perdue par an
            dans un bistrot moyen.
          </p>
          <p>
            La <strong>fiche technique restaurant</strong> est l'outil qui élimine ces dérives silencieuses.
            C'est votre document de référence : il standardise chaque recette, fixe les grammages,
            calcule le coût matières et garantit que votre plat a exactement le même goût et le même coût,
            que vous soyez en cuisine ou non. Selon une étude Fiducial 2025, les établissements équipés
            de fiches techniques structurées affichent un food cost inférieur de 4 à 7 points par rapport
            à ceux qui n'en ont pas — l'équivalent de 24 000 à 42 000 EUR de marge supplémentaire sur
            un CA de 600 000 EUR.
          </p>
          <p>
            Dans ce guide, vous trouverez la définition complète, les 8 éléments obligatoires,
            la méthode pas-à-pas pour calculer le coût de revient, un <strong>exemple chiffré détaillé
            pour un magret de canard</strong>, un modèle gratuit à dupliquer, et les erreurs qui plombent
            la rentabilité. Pour aller plus loin sur les calculs, consultez notre guide complet du
            <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">calcul de marge restaurant</Link>
            et notre article sur le
            <Link to="/blog/reduire-food-cost" className="text-teal-700 underline hover:text-teal-800 ml-1">food cost en restauration</Link>.
          </p>
        </div>

        {/* ═════════════ SECTION 1 : Definition ═════════════ */}
        <section id="definition" className="mb-16">
          <SectionHeading icon={<FileText className="w-6 h-6" />} number="1">
            Qu'est-ce qu'une fiche technique de cuisine ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              Une <strong>fiche technique</strong> (ou fiche recette) est un document structure qui décrit avec
              précision les ingrédients nécessaires à la confection d'un plat (et leurs quantités exactes
              en brut et en net), la procédure de préparation étape par étape, le temps de préparation et
              de cuisson, le nombre de portions produites, le coût matières détaillé, le food cost, le prix
              de vente HT et TTC conseillé, les allergènes INCO et une photo de référence du dressage final.
            </p>
            <p>
              En restauration professionnelle, la fiche technique est bien plus qu'une simple
              recette — c'est un <strong>outil de gestion financière</strong>, un
              <strong> garant de la constance qualitative</strong> et un
              <strong> support de formation des équipes</strong>. Elle constitue la brique de base
              de tout système de pilotage de marges. Sans elle, le calcul du food cost devient
              une approximation grossière et le menu engineering est impossible.
            </p>
            <p>
              Historiquement, la fiche technique vient des cuisines de palaces et brigades d'Escoffier
              au début du XXe siècle. À l'époque, il s'agissait de garantir la reproductibilité des plats
              malgré les rotations de cuisiniers. Aujourd'hui, avec la complexification des réglementations
              (INCO sur les allergènes, traceabilite HACCP) et la pression sur les marges, elle est devenue
              indispensable dans tous les segments de la restauration commerciale.
            </p>
          </div>

          {/* 4 benefices */}
          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            {[
              {
                icon: <TrendingDown className="w-5 h-5 text-teal-600" />,
                title: 'Maîtrise financière',
                desc: 'Sans fiche technique, votre food cost fluctue à chaque service. Avec elle, vous savez exactement ce que vous coûte chaque plat et pouvez piloter vos marges au jour le jour. Gain typique : 3-5 points de marge brute.',
              },
              {
                icon: <CheckCircle className="w-5 h-5 text-teal-600" />,
                title: 'Constance qualitative',
                desc: 'Un client qui revient doit retrouver exactement le même plat. La fiche technique est votre assurance qualité : même grammages, même dressage, même cuisson. Critique pour la fidélisation.',
              },
              {
                icon: <Users className="w-5 h-5 text-teal-600" />,
                title: 'Formation du personnel',
                desc: 'Un nouveau commis peut reproduire un plat fidèlement grâce à la fiche technique, même sans la présence du chef. Réduction du temps d\'onboarding de 50 % en moyenne, selon les retours terrain.',
              },
              {
                icon: <ClipboardList className="w-5 h-5 text-teal-600" />,
                title: 'Gestion des stocks',
                desc: 'En croisant fiches techniques et couverts servis, vous prévoyez vos commandes avec précision et réduisez les pertes. Base indispensable pour la prévision des achats et le calcul des inventaires théoriques.',
              },
              {
                icon: <Award className="w-5 h-5 text-teal-600" />,
                title: 'Conformité réglementaire',
                desc: 'Le règlement INCO impose l\'affichage des allergènes présents dans chaque plat. La fiche technique structurée centralise ces informations et facilite les contrôles DGCCRF et HACCP.',
              },
              {
                icon: <BarChart3 className="w-5 h-5 text-teal-600" />,
                title: 'Menu engineering',
                desc: 'Identifier vos Stars (rentables + populaires), Puzzles, Plowhorses et Dogs nécessite des données de coût fiables. Les fiches techniques sont l\'input numéro un de toute stratégie d\'optimisation de carte.',
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
            Les 8 éléments essentiels d'une fiche technique
          </SectionHeading>

          <div className="prose-content">
            <p>
              Une fiche technique professionnelle comprend huit sections incontournables.
              Voici ce qu'elle doit absolument contenir pour être exploitable au quotidien
              et conforme aux exigences réglementaires.
            </p>
          </div>

          <div className="space-y-4 mt-6">
            <ElementCard
              number={1}
              title="L'en-tête d'identification"
              items={[
                "Nom du plat (avec éventuellement le numéro de carte)",
                "Catégorie (entrée, plat, dessert, amuse-bouche, accompagnement, sauce)",
                "Nombre de portions pour lesquelles la fiche est calculée (souvent 1 ou 10)",
                "Date de création et version (car les recettes évoluent : v1.0, v1.2, v2.0)",
                "Auteur / Chef responsable et éventuel valideur",
              ]}
            />
            <ElementCard
              number={2}
              title="La liste des ingrédients avec grammages bruts et nets"
              items={[
                "Quantité brute : ce que vous achetez (avant épluchage/parage)",
                "Coefficient de rendement : ratio net/brut (ex : carotte épluchée = 0,82, filet de boeuf paré = 0,90)",
                "Quantité nette : ce qui se retrouve dans l'assiette après préparation",
                "Prix unitaire par kg/L (mis à jour trimestriellement minimum)",
                "Coût total par ingrédient pour le calcul du food cost",
              ]}
            />
            <ElementCard
              number={3}
              title="La procédure de préparation"
              items={[
                "Mise en place : marinades, réductions, préparations préalables (la veille si nécessaire)",
                "Déroulement de la recette dans l'ordre chronologique (numéroté)",
                "Points critiques : températures de cuisson, durées, textures attendues, points de coloration",
                "Matériel spécifique requis (four basse température, thermomètre sonde, bain-marie)",
                "Dressage : description détaillée et photo de référence du rendu final",
              ]}
            />
            <ElementCard
              number={4}
              title="Les informations de production"
              items={[
                "Temps de préparation (mise en place), temps de cuisson, temps de dressage",
                "Matériel nécessaire (fours spécifiques, ustensiles, bains-marie)",
                "Consignes de conservation et durée de vie de la préparation (jours, sous vide, réfrigération)",
                "Procédure de remise en température pour les préparations à l'avance",
              ]}
            />
            <ElementCard
              number={5}
              title="Les coûts et indicateurs financiers"
              items={[
                "Coût matières total par portion (somme des coûts ingrédients + matières sèches)",
                "Forfait matières sèches : 3 à 5 % du coût matières (sel, poivre, huiles, herbes)",
                "Prix de vente HT et TTC conseillé (avec coefficient multiplicateur appliqué)",
                "Food cost en pourcentage et marge brute en euros et pourcentage",
                "Coefficient multiplicateur appliqué et coefficient cible",
              ]}
            />
            <ElementCard
              number={6}
              title="Les allergènes (obligation INCO)"
              items={[
                "Les 14 allergènes obligatoires : gluten, crustacés, oeufs, poissons, arachides, soja, lait, fruits à coque, céleri, moutarde, sésame, sulfites, lupin, mollusques",
                "Indication claire et lisible pour chaque allergène présent",
                "Mention des contaminations croisées possibles (traces)",
                "Compatible avec la procédure d'information du client (carte, panneau, support digital)",
              ]}
            />
            <ElementCard
              number={7}
              title="Les valeurs nutritionnelles (optionnel mais recommandé)"
              items={[
                "Calories par portion (kcal)",
                "Macronutriments : protéines, glucides, lipides (g et %)",
                "Information utile pour les clients soucieux de leur alimentation",
                "Obligatoire pour la restauration collective et utile en restaurant commercial",
              ]}
            />
            <ElementCard
              number={8}
              title="La photo de dressage de référence"
              items={[
                "Photo prise en conditions réelles, éclairage neutre",
                "Idéalement vue en plongée 45 degrés et plongée verticale (top shot)",
                "Indication du type d'assiette ou de contenant (ronde 28 cm, ardoise rectangulaire, bol)",
                "Référence visuelle indispensable pour la constance entre services",
              ]}
            />
          </div>

          <div className="mt-8">
            <Callout type="info">
              <strong>Coefficients de rendement courants (sources Fiducial 2025) :</strong> Carotte entière
              épluchée (~82 % net), filet de boeuf paré (~90 % net), poisson entier en filets (45-55 % net),
              herbes fraîches effeuillées (~60 % net), oignon émincé (~85 % net), pomme de terre épluchée
              (~78 % net). Ne vous fiez pas à ces chiffres génériques : mesurez dans votre cuisine avec
              vos produits et votre personnel. Les variations peuvent atteindre 5-8 points selon la
              qualité d'origine.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION HOWTO : 7 etapes ═════════════ */}
        <section id="howto" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="3">
            Comment créer une fiche technique en 7 étapes
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la méthode pas-à-pas pour créer une fiche technique professionnelle. Comptez 30 à 45
              minutes par recette la première fois, puis 10-15 minutes une fois le pli pris. Le retour sur
              investissement est immédiat : chaque fiche correctement faite économise des dizaines d'euros
              par mois en dérives évitées.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Lister tous les ingrédients et leurs grammages bruts',
                body: "Pour chaque plat, listez chaque ingrédient avec sa quantité exacte en grammes ou en millilitres. N'oubliez pas les ingrédients de garniture, les sauces, les huiles de cuisson, les épices, les herbes, les décors. Plus la fiche est complète, plus le calcul est juste. Pesez systématiquement plutôt que d'estimer à l'oeil. Une différence de 10 g par ingrédient sur 5 ingrédients = 50 g d'écart cumulé, soit 8-12 % de dérive.",
              },
              {
                title: 'Mesurer les coefficients de rendement réels',
                body: "Pour chaque ingrédient transformé, pesez avant et après préparation (épluchage, parage, désossage). Un kilo de carottes brutes ne donne pas 1 kg de carottes à cuisiner : compter 800-820 g. Un filet de boeuf de 2 kg paré donne 1,8 kg. Ne vous contentez pas des chiffres génériques : votre rendement dépend de la qualité du produit, de la dextérité de votre équipe et de votre matériel. Mesurez sur 5-10 essais et faites la moyenne.",
              },
              {
                title: 'Relever les prix d\'achat réels depuis vos factures',
                body: "Consultez vos dernières factures fournisseurs (mois courant). Ne jamais utiliser des prix \"de tête\" ou de l'année dernière. Les prix varient selon les saisons et les fournisseurs : la tomate passe de 1,80 EUR/kg en août à 3,20 EUR/kg en janvier. Prévoyez une révision trimestrielle minimum, idéalement mensuelle pour les produits volatils (poisson, fruits, légumes). Un outil comme RestauMargin connecte aux factures automatise cette mise à jour.",
              },
              {
                title: 'Calculer le coût matières total avec matières sèches',
                body: "Pour chaque ligne, multipliez la quantité brute (et non la quantité nette, car vous payez la quantité brute) par le prix au gramme ou millilitre. Exemple : 220 g de magret à 18 EUR/kg = 0,220 x 18 = 3,96 EUR. Additionnez toutes les lignes. Ajoutez un forfait de 3 à 5 % du sous-total pour les matières sèches (sel fin, poivre, huile cuisson, vinaigre, herbes sèches) qui sont impossibles à chiffrer ligne par ligne.",
              },
              {
                title: 'Intégrer les pertes à la cuisson',
                body: "Une viande perd 15-30 % de son poids à la cuisson selon le type et le degré de cuisson. Un filet de volaille de 200 g cru pèse 150-160 g à la sortie du four. Un poisson 10-15 %. Votre portion servie sera donc plus petite que la quantité brute payée. Cette perte ne change pas votre coût matières (vous avez payé la quantité brute) mais affecte la perception client du grammage. Indiquez sur la fiche : quantité brute, perte cuisson en %, quantité servie.",
              },
              {
                title: "Calculer le food cost et déterminer le prix de vente",
                body: "Food cost (%) = (Coût matières / Prix de vente HT) x 100. Si vous fixez le prix : food cost = coût / prix. Si vous calculez le prix : prix = coût x coefficient multiplicateur (typiquement 3,0 à 3,5 en restauration traditionnelle pour un food cost de 28-33 %). Vérifiez la cohérence avec le marché local : un magret à 32 EUR dans une brasserie est dans le marché, à 45 EUR vous risquez de plomber le menu mix.",
              },
              {
                title: "Documenter procédure, allergènes et photographier le dressage",
                body: "Décrivez la mise en place et la procédure de préparation dans l'ordre chronologique, en numérotant chaque étape. Indiquez les températures de cuisson, les durées, les textures attendues, les points critiques. Listez les 14 allergènes obligatoires INCO présents. Photographiez le dressage final avec un éclairage neutre (vue plongée 45 degrés idéale) : cette photo devient la référence de l'équipe pour reproduire le plat fidèlement.",
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
            <strong>Astuce gain de temps :</strong> au lieu de refaire ce calcul à la main pour chaque plat,
            utilisez le <Link to="/outils/calculateur-food-cost" className="underline font-semibold hover:text-teal-700">calculateur de food cost gratuit RestauMargin</Link>.
            Vous saisissez ingrédients, grammages et prix : le food cost et la marge brute s'affichent instantanément.
            Vous pouvez ensuite exporter le résultat au format PDF ou Excel pour archivage.
          </Callout>
        </section>

        {/* ═════════════ SECTION 4 : Calcul cout ═════════════ */}
        <section id="cout" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="4">
            Comment calculer précisément le coût de revient
          </SectionHeading>

          <div className="prose-content">
            <p>
              C'est la partie la plus importante de la fiche technique. Voici la méthode
              étape par étape, avec les pièges à éviter pour ne pas sous-estimer votre coût réel.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4 mt-6">
            {[
              {
                step: '1',
                title: 'Relevez vos prix d\'achat réels',
                desc: 'Consultez vos dernières factures fournisseurs. Les prix varient selon les saisons et les fournisseurs — prévoyez une révision trimestrielle. Ne jamais utiliser des prix "de tête". La précision à +/- 5 % suffit pour le food cost, +/- 2 % pour le menu engineering.',
              },
              {
                step: '2',
                title: 'Mesurez les pertes réelles',
                desc: 'Pesez vos produits avant et après préparation. Ne vous fiez pas aux coefficients génériques — mesurez dans votre cuisine, avec votre personnel, sur vos produits spécifiques. Refaites les mesures 1 à 2 fois par an pour suivre les évolutions (qualité fournisseur, changement équipe).',
              },
              {
                step: '3',
                title: 'Additionnez tous les coûts, même les petits',
                desc: 'Sel, poivre, huile, fonds de cuisine, garnitures, décors... Comptez-les en ajoutant un forfait de 3 à 5 % du coût total. Ces "matières sèches" s\'accumulent sur l\'ensemble de votre carte. Sur un coût matières de 6 EUR, le forfait représente 18-30 centimes, soit 0,5-1 point de food cost.',
              },
              {
                step: '4',
                title: 'Intégrez les pertes à la cuisson',
                desc: 'Un filet de volaille de 200 g (cru) peut perdre 20 à 25 % de son poids à la cuisson. Votre portion servie sera de 150 à 160 g — mais vous avez payé 200 g. Cette perte doit figurer dans la fiche pour deux raisons : (1) communiquer la portion réelle au client, (2) ajuster le grammage acheté si vous voulez une portion servie précise.',
              },
              {
                step: '5',
                title: 'Vérifiez la cohérence avec l\'inventaire réel',
                desc: 'Croisez vos calculs théoriques avec l\'inventaire mensuel. Si votre théorique dit "j\'ai utilisé 50 kg de magret" et que l\'inventaire montre 58 kg sortis, vous avez 16 % de dérive. Identifiez la source : portions trop généreuses, pertes à la cuisson sous-estimées, vols, casse. C\'est le test de vérité de vos fiches techniques.',
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
              Food cost (%) = (Coût matières par portion / Prix de vente HT) x 100
            </div>
            <div className="text-sm text-mono-400 space-y-1">
              <p><strong>Exemple :</strong> Coût matières = 4,63 EUR / Portion vendue HT = 28 EUR -- Food cost = <strong>16,5 %</strong></p>
              <p>En restauration traditionnelle, visez un food cost entre <strong>28 % et 35 %</strong>.</p>
              <p>En dessous de 25 %, vos portions sont peut-être trop réduites et nuisent à la satisfaction client.</p>
              <p>Au-delà de 38 %, votre marge nette devient critique sauf compensation par un fort volume.</p>
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
              Passons à un cas concret et chiffré. Voici la fiche technique complète d'un
              <strong> magret de canard rôtis, sauce au miel, pommes grenailles et légumes de saison</strong>,
              servi dans une brasserie de centre-ville à 28 EUR TTC (soit 25,45 EUR HT, TVA 10 %).
              Cette fiche est calibrée pour <strong>1 portion</strong>. Multipliez les quantités pour
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
                <p className="font-bold text-mono-100 text-lg">Magret de canard rôti, sauce miel</p>
                <p className="text-xs text-mono-500 mt-1">Catégorie : Plat principal | 1 portion | Brasserie</p>
              </div>
            </div>

            {/* Tableau ingredients */}
            <h4 className="text-sm font-bold uppercase tracking-wider text-mono-500 mb-3">Ingrédients et coûts</h4>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-mono-975 text-mono-100">
                    <th className="text-left py-2 px-3 font-semibold">Ingrédient</th>
                    <th className="text-right py-2 px-3 font-semibold">Qté brute</th>
                    <th className="text-right py-2 px-3 font-semibold">Rendement</th>
                    <th className="text-right py-2 px-3 font-semibold">Qté nette</th>
                    <th className="text-right py-2 px-3 font-semibold">Prix kg/L</th>
                    <th className="text-right py-2 px-3 font-semibold">Coût</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  <tr className="bg-white"><td className="py-2 px-3 font-medium text-mono-100">Magret de canard IGP Sud-Ouest</td><td className="py-2 px-3 text-right">220 g</td><td className="py-2 px-3 text-right">95 %</td><td className="py-2 px-3 text-right">209 g</td><td className="py-2 px-3 text-right">18,50 EUR</td><td className="py-2 px-3 text-right font-semibold">4,07 EUR</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3">Pommes grenailles</td><td className="py-2 px-3 text-right">180 g</td><td className="py-2 px-3 text-right">88 %</td><td className="py-2 px-3 text-right">158 g</td><td className="py-2 px-3 text-right">2,40 EUR</td><td className="py-2 px-3 text-right font-semibold">0,43 EUR</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3">Haricots verts frais</td><td className="py-2 px-3 text-right">120 g</td><td className="py-2 px-3 text-right">85 %</td><td className="py-2 px-3 text-right">102 g</td><td className="py-2 px-3 text-right">4,80 EUR</td><td className="py-2 px-3 text-right font-semibold">0,58 EUR</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3">Carottes des sables</td><td className="py-2 px-3 text-right">100 g</td><td className="py-2 px-3 text-right">82 %</td><td className="py-2 px-3 text-right">82 g</td><td className="py-2 px-3 text-right">1,90 EUR</td><td className="py-2 px-3 text-right font-semibold">0,19 EUR</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3">Miel de châtaignier</td><td className="py-2 px-3 text-right">15 g</td><td className="py-2 px-3 text-right">100 %</td><td className="py-2 px-3 text-right">15 g</td><td className="py-2 px-3 text-right">14,00 EUR</td><td className="py-2 px-3 text-right font-semibold">0,21 EUR</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3">Échalotes</td><td className="py-2 px-3 text-right">30 g</td><td className="py-2 px-3 text-right">88 %</td><td className="py-2 px-3 text-right">26 g</td><td className="py-2 px-3 text-right">5,80 EUR</td><td className="py-2 px-3 text-right font-semibold">0,17 EUR</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3">Vinaigre balsamique</td><td className="py-2 px-3 text-right">10 ml</td><td className="py-2 px-3 text-right">100 %</td><td className="py-2 px-3 text-right">10 ml</td><td className="py-2 px-3 text-right">8,50 EUR</td><td className="py-2 px-3 text-right font-semibold">0,09 EUR</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3">Bouillon de volaille</td><td className="py-2 px-3 text-right">40 ml</td><td className="py-2 px-3 text-right">100 %</td><td className="py-2 px-3 text-right">40 ml</td><td className="py-2 px-3 text-right">2,00 EUR</td><td className="py-2 px-3 text-right font-semibold">0,08 EUR</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3">Beurre demi-sel AOP</td><td className="py-2 px-3 text-right">20 g</td><td className="py-2 px-3 text-right">100 %</td><td className="py-2 px-3 text-right">20 g</td><td className="py-2 px-3 text-right">8,80 EUR</td><td className="py-2 px-3 text-right font-semibold">0,18 EUR</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3">Thym frais</td><td className="py-2 px-3 text-right">2 g</td><td className="py-2 px-3 text-right">60 %</td><td className="py-2 px-3 text-right">1,2 g</td><td className="py-2 px-3 text-right">35,00 EUR</td><td className="py-2 px-3 text-right font-semibold">0,07 EUR</td></tr>
                  <tr className="border-t-2 border-mono-900 bg-amber-50">
                    <td className="py-3 px-3 font-bold text-mono-100" colSpan={5}>Sous-total ingrédients</td>
                    <td className="py-3 px-3 text-right font-bold text-amber-900">6,07 EUR</td>
                  </tr>
                  <tr className="bg-amber-50">
                    <td className="py-2 px-3 italic text-mono-400" colSpan={5}>+ Forfait matières sèches (4 %) : sel, poivre, fleur de sel, huile</td>
                    <td className="py-2 px-3 text-right font-medium text-amber-900">0,24 EUR</td>
                  </tr>
                  <tr className="bg-teal-100">
                    <td className="py-3 px-3 font-extrabold text-mono-100" colSpan={5}>TOTAL COÛT MATIÈRES</td>
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
            <h4 className="text-sm font-bold uppercase tracking-wider text-mono-500 mb-3">Procédure (45 min total)</h4>
            <ol className="space-y-2 text-sm text-mono-400 mb-6">
              <li className="bg-white rounded-lg px-3 py-2"><strong>1. Mise en place (15 min) :</strong> Quadriller le gras du magret en croisillons (sans entamer la chair). Éplucher les pommes grenailles, les couper en deux. Équeuter les haricots verts. Tailler les carottes en sifflets. Hacher finement les échalotes.</li>
              <li className="bg-white rounded-lg px-3 py-2"><strong>2. Cuisson magret (12 min) :</strong> Saisir le magret côté peau à froid dans une poêle sans matière grasse. Cuire 8 min côté peau (feu moyen, dorer), retourner 4 min côté chair. Réserver au repos sous papier alu 5 min. Cuisson recommandée : rosé (62 degrés à coeur).</li>
              <li className="bg-white rounded-lg px-3 py-2"><strong>3. Sauce miel (8 min) :</strong> Faire suer les échalotes dans 1 cuillère du gras de canard. Déglacer au vinaigre balsamique, ajouter le miel, le bouillon de volaille. Réduire de moitié. Monter au beurre froid en fouettant. Saler, poivrer.</li>
              <li className="bg-white rounded-lg px-3 py-2"><strong>4. Garnitures (10 min) :</strong> Rôtir les pommes grenailles 12 min au four 200 degrés avec thym, fleur de sel. Cuire les haricots verts 4 min à l'anglaise, refraichir, sauter au beurre 1 min. Glacer les carottes à brun 6 min (eau, beurre, sucre).</li>
              <li className="bg-white rounded-lg px-3 py-2"><strong>5. Dressage :</strong> Trancher le magret en 5 tranches de 1 cm dans le sens contraire des fibres. Disposer en éventail au centre. Pommes grenailles à droite, haricots verts en fagot, carottes en sifflets. Napper de sauce miel autour. Fleur de thym frais en décor.</li>
            </ol>

            {/* Allergenes + conservation */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-mono-900">
                <h5 className="text-xs font-bold uppercase text-mono-500 mb-2">Allergènes INCO</h5>
                <p className="text-sm text-mono-100">Lait (beurre), sulfites (vinaigre balsamique)</p>
                <p className="text-xs text-mono-500 mt-1">Possible traces de gluten, moutarde</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-mono-900">
                <h5 className="text-xs font-bold uppercase text-mono-500 mb-2">Conservation</h5>
                <p className="text-sm text-mono-100">Magret cru : 5 jours +3 degrés</p>
                <p className="text-xs text-mono-500 mt-1">Sauce miel : 48 h réfrigérées, réduire avant service</p>
              </div>
            </div>
          </div>

          <div className="prose-content mt-8">
            <p><strong>Analyse de cette fiche technique :</strong></p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350">
              <li>Coût matières : <strong>6,31 EUR</strong> par portion (avec matières sèches)</li>
              <li>Prix de vente HT : 25,45 EUR (28 EUR TTC, TVA 10 %)</li>
              <li>Food cost : <strong>24,8 %</strong> — excellent ratio, en-dessous du benchmark brasserie (28-33 %)</li>
              <li>Marge brute : <strong>19,14 EUR</strong> par couvert, soit <strong>75,2 %</strong></li>
              <li>Coefficient multiplicateur : 25,45 / 6,31 = <strong>4,03</strong></li>
            </ul>
            <p className="mt-4">
              Ce magret est un excellent générateur de marge brute en valeur absolue (19,14 EUR par
              couvert). Sur 30 ventes par jour, il rapporte 574 EUR de marge brute quotidienne. C'est
              typiquement le type de plat à positionner comme "Star" en menu engineering : populaire et
              très rentable. La sauce miel maison apporte un différenciateur perceptible vs concurrence,
              ce qui justifie le prix premium.
            </p>
          </div>

          <Callout type="info">
            <strong>Astuce production :</strong> les fiches techniques peuvent être dupliquées pour
            calculer des productions plus grandes (10, 20, 50 portions). Pour un service de 30 magrets,
            multipliez toutes les quantités par 30 : 6,6 kg de magret brut, 5,4 kg de pommes grenailles,
            3,6 kg de haricots verts, etc. Cela facilite les commandes fournisseurs et la mise en place.
            RestauMargin génère automatiquement la liste de courses à partir d'une prévision de couverts.
          </Callout>
        </section>

        {/* ═════════════ SECTION 6 : Modele ═════════════ */}
        <section id="modele" className="mb-16">
          <SectionHeading icon={<FileText className="w-6 h-6" />} number="6">
            Modèle de fiche technique gratuit (template à dupliquer)
          </SectionHeading>

          <div className="prose-content mb-6">
            <p>
              Voici la structure d'une fiche technique vierge que vous pouvez reproduire ou adapter
              à votre établissement. Elle couvre tous les éléments essentiels en restant
              lisible sur une page A4 et exploitable en cuisine.
            </p>
            <p>
              <strong>Format conseillé :</strong> A4 recto-verso, police 11pt minimum (lisible
              sous éclairage de cuisine), tableau d'ingrédients en haut, procédure au milieu,
              photo et allergènes en bas. À imprimer, plastifier, et fixer au poste de travail
              concerné (pas dans un classeur fermé).
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
                { label: 'Catégorie', value: 'Plat / Entrée / Dessert' },
                { label: 'Nb. de portions', value: 'X portions' },
                { label: 'Tps. préparation', value: 'XX min' },
                { label: 'Tps. de cuisson', value: 'XX min' },
                { label: 'Coût / portion', value: 'X,XX EUR' },
                { label: 'Food cost', value: 'XX %' },
              ].map((f, i) => (
                <div key={i} className="bg-mono-1000 rounded-xl p-3 text-sm">
                  <p className="text-mono-500 text-xs mb-1">{f.label}</p>
                  <p className="font-semibold text-mono-100">{f.value}</p>
                </div>
              ))}
            </div>

            {/* Ingredients table */}
            <p className="text-xs font-bold uppercase tracking-wider text-mono-500 mb-2">Ingrédients</p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-mono-975">
                    {['Ingrédient', 'Qté brute', 'Coeff. perte', 'Qté nette', 'Prix/kg', 'Coût'].map((h) => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-mono-100 border-b border-mono-900">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Filet de boeuf', '220 g', '0,90', '198 g', '32 EUR/kg', '7,04 EUR'],
                    ['Échalotes', '60 g', '0,85', '51 g', '4 EUR/kg', '0,24 EUR'],
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
                <p className="text-xs font-bold uppercase tracking-wider text-mono-500 mb-2">Procédure</p>
                <div className="space-y-1 text-sm text-mono-400">
                  {['1. Mise en place...', '2. Cuisson...', '3. Dressage...'].map((s, i) => (
                    <p key={i} className="bg-mono-1000 rounded-lg px-3 py-2">{s}</p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-mono-500 mb-2">Allergènes &amp; Conservation</p>
                <div className="space-y-1 text-sm text-mono-400">
                  <p className="bg-mono-1000 rounded-lg px-3 py-2">Allergènes : gluten, lait, oeuf...</p>
                  <p className="bg-mono-1000 rounded-lg px-3 py-2">Conservation : 48h sous vide à +3 degrés</p>
                </div>
              </div>
            </div>
          </div>

          <Callout type="info">
            <strong>Template Excel à télécharger :</strong> RestauMargin propose un modèle Excel
            pré-formate avec formules de calcul automatiques (food cost, marge brute, coefficient
            multiplicateur, conversion HT/TTC). Ce template inclut 5 onglets : fiche vierge, exemple
            magret, table des coefficients de rendement, liste des 14 allergènes INCO, tableau de
            conversion HT/TTC pour les 3 taux de TVA restauration (5,5 %, 10 %, 20 %). Disponible
            après création d'un compte gratuit.
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
              (food cost, coefficient multiplicateur) varient selon le type d'établissement.
              Voici les benchmarks 2026 issus de notre base de données de des restaurants.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Type d'établissement</th>
                  <th className="text-center py-3 px-4 font-semibold">Food cost cible</th>
                  <th className="text-center py-3 px-4 font-semibold">Coefficient</th>
                  <th className="text-center py-3 px-4 font-semibold">Nb fiches typique</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Spécificité</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { type: 'Bistrot', fc: '28-33 %', coef: '3,0-3,6', nb: '30-50', spec: 'Carte courte, plats du jour, fiches simples' },
                  { type: 'Brasserie', fc: '28-35 %', coef: '2,9-3,6', nb: '60-100', spec: 'Carte large, beaucoup de variantes' },
                  { type: 'Pizzeria', fc: '15-28 %', coef: '3,6-6,5', nb: '20-40', spec: 'Garnitures multiples, base pâte standardisée' },
                  { type: 'Gastronomique', fc: '30-40 %', coef: '2,5-3,3', nb: '20-40', spec: 'Fiches ultra-détaillées, photos obligatoires' },
                  { type: 'Coffee shop', fc: '12-22 %', coef: '4,5-8,0', nb: '40-80', spec: 'Boissons + snacking, modulaires' },
                  { type: 'Food truck', fc: '22-30 %', coef: '3,3-4,5', nb: '10-20', spec: 'Carte courte, production rapide' },
                  { type: 'Restauration collective', fc: '35-45 %', coef: '2,2-2,9', nb: '100-300', spec: 'Valeurs nutritionnelles obligatoires' },
                  { type: 'Dark kitchen', fc: '28-35 %', coef: '2,9-3,6', nb: '20-40', spec: 'Optimisées pour livraison (tenue dans le pack)' },
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
              <strong>Quelques observations clés :</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                Les <strong>pizzerias et coffee shops</strong> ont les plus hauts coefficients
                multiplicateurs (4,5-8,0) car leurs ingrédients de base coûtent peu (farine, lait, café)
                et le client est habitué à un certain prix. Leurs fiches sont en général plus simples,
                avec des bases standardisées (pâte à pizza, lait vapeur) réutilisées sur de nombreuses
                recettes.
              </li>
              <li>
                Le <strong>gastronomique</strong> a un food cost plus élevé (30-40 %) du fait des produits
                premium (truffe, foie gras, poisson noble), mais ses fiches sont ultra-détaillées avec
                souvent 15-25 ingrédients par plat et des temps de préparation longs (cuissons basse
                température, marinades de 24-48 h, sauces mères).
              </li>
              <li>
                La <strong>restauration collective</strong> à des fiches obligatoirement enrichies des
                valeurs nutritionnelles (calories, macronutriments) pour le respect du PNNS (Programme
                National Nutrition Santé). Les coefficients sont plus faibles car la marge se fait sur
                le volume.
              </li>
              <li>
                Les <strong>dark kitchens</strong> ont des fiches spécifiques optimisées pour la
                livraison : ingrédients qui ne se délitent pas (sauces à part), pack désigné en fonction,
                conservation 30-45 min après préparation.
              </li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 8 : Bonnes pratiques ═════════════ */}
        <section id="bonnes-pratiques" className="mb-16">
          <SectionHeading icon={<Lightbulb className="w-6 h-6" />} number="8">
            Bonnes pratiques pour des fiches réellement utilisées
          </SectionHeading>

          <div className="prose-content">
            <p>
              Créer des fiches techniques est une chose. S'assurer qu'elles sont effectivement
              utilisées en est une autre. Voici comment passer de la théorie à la pratique
              et faire de la fiche technique un outil vivant en cuisine.
            </p>
          </div>

          <div className="space-y-3 mt-6">
            {[
              {
                title: 'Simplifiez le format',
                desc: 'Une fiche technique de 15 pages que personne ne lit est inutile. Visez une page recto-verso maximum. Priorisez grammages, coûts et photo. Texte minimum, tableaux maximum. Lisibilité police 11pt minimum.',
              },
              {
                title: 'Plastifiez et affichez en cuisine',
                desc: 'Imprimez, plastifiez (épaisseur 80 microns minimum pour résister), et accrochez aux postes concernés : entremets pour les plats, pâtisserie pour les desserts, garde-manger pour les entrées. La fiche doit être sous la main du cuisinier, pas dans le bureau du chef.',
              },
              {
                title: 'Formez votre équipe',
                desc: 'Lors de l\'intégration d\'un nouveau membre, prenez 30 minutes pour expliquer pourquoi les fiches existent et comment les utiliser. Faites une démonstration de pesée. Repassez en revue les 5 plats les plus vendus.',
              },
              {
                title: 'Mettez-les à jour régulièrement',
                desc: 'Prix : tous les trimestres minimum, mensuels pour produits volatils. Recettes : à chaque évolution du plat (même mineure). Photos : à chaque changement de dressage. Une fiche obsolète est trompeuse et perd toute crédibilité auprès de l\'équipe.',
              },
              {
                title: 'Liez fiches techniques et commandes',
                desc: 'En croisant le nombre de couverts prévus avec les quantités par portion, vous passez des commandes précises et réduisez les pertes de stock. Un outil comme RestauMargin génère automatiquement la liste de courses à partir d\'une prévision de service.',
              },
              {
                title: 'Auditez le respect des grammages',
                desc: 'Une fois par semaine, faites un audit surprise : pesez 5 portions du même plat servies par l\'équipe. Comparez aux grammages de la fiche. Une dérive de plus de 5 % doit être corrigée par un brief équipe. Sans audit, les portions augmentent insidieusement.',
              },
              {
                title: 'Versionnez vos fiches',
                desc: 'Indiquez le numéro de version (v1.0, v1.1, v2.0) et la date de dernière mise à jour sur chaque fiche. Archivez les versions précédentes pour suivre l\'historique. En cas de problème client, vous pouvez retracer ce qui a changé.',
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
            Les 5 erreurs à éviter absolument
          </SectionHeading>

          <div className="space-y-4 mt-2">
            {[
              {
                n: '01',
                title: 'Ne pas mesurer les pertes réelles',
                desc: 'Utiliser des coefficients théoriques sans les vérifier dans votre contexte est risqué. Les pertes varient selon la qualité des produits, les compétences de vos équipes, le matériel utilisé. Une carotte achetée en bio peut perdre 25 % à l\'épluchage, en conventionnel seulement 18 %. Mesurez chez vous.',
              },
              {
                n: '02',
                title: 'Oublier les petites quantités',
                desc: 'Huile d\'olive, fleur de sel, herbes fraîches, micro-pousses, décors floraux... Individuellement négligeables, cumulés ils représentent 3 à 5 points de food cost. Chiffrez-les via un forfait matières sèches en pourcentage du sous-total ingrédients.',
              },
              {
                n: '03',
                title: 'Calculer sur des prix anciens',
                desc: 'Un coût matières calculé avec les prix d\'il y a 18 mois n\'a aucune valeur décisionnelle. L\'inflation alimentaire cumulée depuis 2022 atteint 21 % en France. La révision des prix est un travail régulier, non optionnel. Réservez 2-3 heures par trimestre pour cette tâche.',
              },
              {
                n: '04',
                title: 'Créer des fiches que personne ne lit',
                desc: 'La plus belle fiche technique du monde ne sert à rien si elle est rangée dans un tiroir. L\'implementation opérationnelle est aussi importante que la création : plastification, affichage au poste, formation de l\'équipe, audit hebdomadaire des grammages.',
              },
              {
                n: '05',
                title: 'Ne pas inclure les pertes à la cuisson',
                desc: 'Une perte de 20 % à la cuisson sur un produit à 30 EUR/kg, c\'est 6 EUR perdus par kilo. Sur 10 kg/semaine, c\'est 60 EUR non comptabilisés chaque semaine, soit 3 120 EUR/an. La quantité à indiquer dans la fiche est la quantité brute (payée), pas la quantité servie.',
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
            <strong>Impact cumulé :</strong> ces cinq erreurs combinées peuvent représenter
            une perte de 6 à 10 points de food cost, soit l'équivalent de 4-7 points de marge brute.
            Sur un restaurant qui fait 600 000 EUR de CA annuel, c'est entre 24 000 EUR et 42 000 EUR
            de bénéfice potentiel qui disparaît silencieusement chaque année. La création et le suivi
            rigoureux des fiches techniques est l'investissement temporel le plus rentable en restauration.
          </Callout>

          <div className="prose-content mt-6">
            <p>
              Pour aller plus loin sur la réduction du food cost et l'optimisation des marges,
              consultez nos guides complémentaires :
            </p>
            <ul className="list-disc list-inside space-y-1 text-mono-350 mt-3">
              <li>
                <Link to="/blog/reduire-food-cost" className="text-teal-700 underline hover:text-teal-800">
                  Food cost en restauration : guide complet et benchmarks
                </Link>
              </li>
              <li>
                <Link to="/blog/coefficient-multiplicateur" className="text-teal-700 underline hover:text-teal-800">
                  Le coefficient multiplicateur expliquée
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
              La fiche technique papier a ses limites : elle devient vite obsolète, difficile à
              dupliquer en cas de changement de prix, et ne se met pas à jour automatiquement
              quand votre fournisseur modifie ses tarifs. La digitalisation résout ces problèmes
              et ajoute des fonctionnalités impossibles sur papier.
            </p>
            <p>
              Quand les prix de votre beurre augmentent de 15 %, RestauMargin recalcule
              instantanément le food cost de <em>tous les plats</em> qui l'utilisent (parfois 30-40
              recettes interconnectées) et vous alerte sur ceux dont la marge est devenue insuffisante.
              Le temps de mise à jour passe de 4-6 heures (révision manuelle de chaque fiche papier)
              à 30 secondes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            {[
              { icon: <FileText className="w-5 h-5 text-teal-600" />, label: 'Création et stockage des fiches en quelques minutes', desc: 'Interface intuitive, autocomplétion intelligente des ingrédients, suggestion de grammages standard.' },
              { icon: <TrendingDown className="w-5 h-5 text-teal-600" />, label: 'Mise à jour des prix en masse', desc: 'Connectez vos fournisseurs, scannez vos factures (OCR), prix mis à jour automatiquement sur toutes les fiches concernées.' },
              { icon: <Calculator className="w-5 h-5 text-teal-600" />, label: 'Calcul automatique du food cost', desc: 'Pour chaque plat, en temps réel, avec alerte si dépassement du seuil cible que vous avez défini (ex : 32 % max).' },
              { icon: <ClipboardList className="w-5 h-5 text-teal-600" />, label: 'Génération des listes de courses', desc: 'À partir d\'une prévision de service (X couverts du plat A, Y couverts du plat B), génère automatiquement la liste consolidée à commander.' },
              { icon: <BarChart3 className="w-5 h-5 text-teal-600" />, label: 'Analyse de rentabilité de votre carte', desc: 'Menu engineering intégré : identification des Stars, Puzzles, Plowhorses, Dogs avec recommandations de pricing et de positionnement.' },
              { icon: <AlertTriangle className="w-5 h-5 text-teal-600" />, label: 'Alertes automatiques en cas de dérive', desc: 'Notifications push ou email quand un food cost dépasse votre seuil, quand un prix fournisseur augmente fortement, quand un plat devient non rentable.' },
              { icon: <Percent className="w-5 h-5 text-teal-600" />, label: 'Versioning automatique des fiches', desc: 'Historique complet de chaque modification : qui, quand, quoi. Possibilité de revenir à une version antérieure si nécessaire.' },
              { icon: <DollarSign className="w-5 h-5 text-teal-600" />, label: 'Export PDF et impression optimisée', desc: 'Export PDF prêt a imprimer et plastifier (format À4 recto-verso), avec photo, allergènes et tableau ingrédients lisibles.' },
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
              Plus de 500 restaurants en France utilisent déjà RestauMargin pour digitaliser leurs
              fiches techniques. Le gain moyen constaté est de <strong>3 à 5 points de food cost dans
              les 6 premiers mois</strong> d'utilisation, grâce à une meilleure maîtrise des portions,
              des achats et de la construction du menu. Découvrez nos
              <Link to="/pricing" className="text-teal-700 underline hover:text-teal-800 ml-1">tarifs RestauMargin</Link>
              ou commencez tout de suite avec le
              <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline hover:text-teal-800 ml-1">calculateur de food cost gratuit</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-04-14" updatedDate="2026-05-26" readTime="15 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes sur la fiche technique restaurant</h2>
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
            Sources et références
          </h3>
          <ul className="space-y-2 text-sm text-mono-400">
            <li>Fiducial Restauration - Étude annuelle des marges en restauration commerciale (2025)</li>
            <li>INSEE - Indices des prix alimentaires (2022-2025)</li>
            <li>Règlement (UE) n degrés 1169/2011 - INCO (information du consommateur sur les denrées alimentaires)</li>
            <li>GIRA Conseil - Benchmarks opérationnels restauration 2025</li>
            <li>SNRC - Syndicat National de la Restauration Collective - guides nutritionnels</li>
            <li>DGCCRF - Recommandations sur la traceabilite et les fiches techniques HACCP</li>
            <li> : établissements du secteur, 12 000+ fiches techniques analysées</li>
          </ul>
        </section>

        {/* ── CTA ── */}
        <section className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-center text-white mb-16">
          <ChefHat className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Digitalisez vos fiches techniques
          </h2>
          <p className="text-teal-100 max-w-xl mx-auto mb-8 text-base leading-relaxed">
            Créés, mises à jour automatiquement et analysées en temps réel. Vos fiches techniques
            deviennent un véritable tableau de bord de votre rentabilité.
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
            <Link to="/blog/reduire-food-cost" className="group bg-white border border-mono-900 hover:border-teal-300 rounded-2xl p-5 transition-colors">
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
          <Link to="/" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4">
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mb-4">La plateforme de gestion de marge pour les restaurateurs.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-mono-700">
            <Link to="/mentions-legales" className="hover:text-teal-600 transition-colors">Mentions légales</Link>
            <Link to="/cgv" className="hover:text-teal-600 transition-colors">CGV</Link>
            <Link to="/cgu" className="hover:text-teal-600 transition-colors">CGU</Link>
            <Link to="/politique-confidentialite" className="hover:text-teal-600 transition-colors">Confidentialité</Link>
          </div>
          <p className="mt-6 text-xs text-mono-700">
            &copy; {new Date().getFullYear()} RestauMargin. Tous droits réservés.
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
