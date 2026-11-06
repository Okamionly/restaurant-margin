import { Link } from 'react-router-dom';
import {
  ChefHat,
  Calculator,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
  Lightbulb,
  AlertTriangle,
  Target,
  Users,
  ListChecks,
  TrendingUp,
  Scale,
  Layers,
  CreditCard,
  Zap,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Comparatif SEO — "RestauMargin vs Innovorder : la meilleure alternative"
   Mots-cles cibles : alternative innovorder, innovorder vs, restaumargin vs innovorder
   ~2 700 mots — mode clair, fond blanc, theme W&B
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'RestauMargin est-il vraiment une alternative à Innovorder ?',
    answer:
      "Pas exactement, et c'est important de le dire honnêtement. Innovorder est une suite POS / caisse / click & collect / commande en ligne pour restaurants. RestauMargin est spécialisé dans la gestion de marge : food cost, fiches techniques, mercuriale, menu engineering. Si vous cherchez une caisse + un site de commande, regardez Innovorder. Si vous cherchez à piloter votre rentabilité plat par plat, RestauMargin est la bonne solution. Rien n'empêche d'utiliser les deux en parallèle.",
  },
  {
    question: 'Combien coûte Innovorder par rapport à RestauMargin ?',
    answer:
      "Innovorder se positionne entre 89 et 199 EUR par mois selon les modules (POS, click & collect, kiosque, livraison) avec souvent des frais d'installation et de matériel. RestauMargin coûte 19 EUR par mois tout inclus, sans matériel à acheter, sans engagement, avec un essai gratuit de 7 jours sans carte bancaire. Les deux outils répondent à des besoins différents, donc comparer uniquement le prix n'a pas beaucoup de sens.",
  },
  {
    question: 'Peut-on remplacer entièrement Innovorder par RestauMargin ?',
    answer:
      "Non. RestauMargin ne fait pas caisse enregistreuse, pas de prise de commande client, pas de click & collect. Si vous avez besoin d'un POS, gardez Innovorder ou un autre logiciel de caisse (Tiller, Zelty, Lightspeed). RestauMargin s'utilise en complément, sans connexion directe à la caisse, pour piloter la marge qu'elle ne suit pas. À l'inverse, vous pouvez très bien lancer un restaurant uniquement avec RestauMargin si vous tenez votre caisse autrement (TPE, caisse classique, tableur).",
  },
  {
    question: 'Quels sont les avantages clés de RestauMargin sur Innovorder ?',
    answer:
      "RestauMargin est radicalement moins cher (19 EUR vs 89-199 EUR), se déploie en 5 minutes sans intervention technicien, intègre l'intelligence artificielle pour optimiser les marges (Négociation IA, Mercuriale, Menu Engineering, Allergènes), et reste 100 % focalisé sur la rentabilité — pas sur la vente. Innovorder est plus complet sur la prise de commande mais beaucoup plus lourd à déployer, plus cher, et sa partie gestion de marge reste limitée.",
  },
  {
    question: 'Innovorder gère-t-il aussi le food cost et les fiches techniques ?',
    answer:
      "Innovorder propose un module recettes / fiches techniques dans certaines de ses formules supérieures, mais il reste moins spécialisé. RestauMargin a été construit autour de la fiche technique : grammage précis, rendements, allergènes, calcul de marge automatique à chaque changement de prix fournisseur, ratio fixe par catégorie, alerte si food cost s'éloigne de la cible. C'est notre coeur de métier.",
  },
  {
    question: 'Faut-il choisir entre Innovorder et RestauMargin ?',
    answer:
      "Pas nécessairement. Vous pouvez très bien garder votre caisse (Innovorder, Tiller, Zelty, Lightspeed) et ajouter RestauMargin pour la partie marge. C'est 19 EUR de plus par mois ; à titre d'illustration, 2 points de food cost gagnés sur 500 000 EUR de CA représentent 10 000 EUR de marge en plus par an. Pour un début d'activité serré, on peut très bien attendre quelques mois avant de prendre une suite POS complète et commencer par RestauMargin + une caisse basique.",
  },
  {
    question: 'Quelle est la durée d\'engagement chez Innovorder vs RestauMargin ?',
    answer:
      "Innovorder fonctionne souvent avec des contrats de 12 à 36 mois, matériel inclus ou facturé séparément. RestauMargin est en abonnement mensuel sans engagement, résiliable à tout moment depuis le compte. Cette différence compte si vous voulez tester avant de vous engager.",
  },
  {
    question: 'L\'IA de RestauMargin est-elle disponible chez Innovorder ?',
    answer:
      "Innovorder propose des analytics et du reporting, mais l'IA générative pour suggérer des ingrédients, scanner des factures, générer des fiches techniques, négocier avec un fournisseur ou identifier les plats sous-marges n'est pas disponible chez eux. RestauMargin intègre 19 actions IA (assistant vocal, scanner OCR, suggestions, optimisations, alertes intelligentes) directement dans l'expérience produit.",
  },
  {
    question: 'Quel logiciel choisir pour un restaurant qui ouvre en 2026 ?',
    answer:
      "Pour un nouveau restaurant : commencez par RestauMargin (19 EUR) pour les fiches techniques et la marge, plus une caisse simple (TPE bancaire ou caisse basique). Quand le CA dépasse 300 000 EUR ou que vous lancez click & collect / livraison, ajoutez ou basculez sur une suite POS comme Innovorder, Tiller ou Zelty. Cela limite les frais fixes au démarrage tout en gardant le contrôle des marges dès le premier jour.",
  },
  {
    question: 'RestauMargin est-il adapté aux chaînes multi-restaurants ?',
    answer:
      "Oui. RestauMargin gère le multi-restaurant nativement : un compte unique, plusieurs établissements, fiches techniques partagées, consolidation des marges, comparaison inter-restaurants. L'offre unique reste à 19 EUR par mois, plusieurs établissements compris. Innovorder propose aussi du multi-site mais avec une grille tarifaire bien plus complexe et orientée grands comptes.",
  },
];

export default function AlternativeInnovorder() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Alternative Innovorder | RestauMargin (19 EUR/mois) | Comparatif 2026"
        description="Innovorder = POS et click & collect à 89-199 EUR/mois. RestauMargin = gestion de marge, food cost et IA à 19 EUR/mois. Comparatif complet, prix, fonctionnalités et cas d'usage 2026."
        path="/alternative-innovorder"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Comparatifs', url: 'https://www.restaumargin.fr/alternative-innovorder' },
            { name: 'Alternative Innovorder', url: 'https://www.restaumargin.fr/alternative-innovorder' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'RestauMargin vs Innovorder : la meilleure alternative pour gérer votre marge',
            description:
              "Comparatif honnête entre Innovorder (POS / click & collect 89-199 EUR/mois) et RestauMargin (gestion de marge + IA 19 EUR/mois). Quand utiliser l'un, l'autre, ou les deux.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-05-26',
            dateModified: '2026-11-06',
            wordCount: 2700,
            inLanguage: 'fr-FR',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://www.restaumargin.fr/alternative-innovorder',
            },
          },
        ]}
      />

      {/* ── Navbar ── */}
      <PublicHeader />

      {/* ── Breadcrumbs ── */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">
            Accueil
          </Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">
            Comparatifs
          </Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Alternative Innovorder</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Comparatif"
        readTime="12 min"
        date="Mai 2026"
        title="RestauMargin vs Innovorder : la meilleure alternative pour gérer votre marge"
        accentWord="alternative"
        subtitle="Innovorder est une excellente suite POS et click & collect pour restaurateurs, mais coûte 89 à 199 EUR par mois. Si votre objectif est de piloter la marge, le food cost et les fiches techniques sans casser la tirelire, RestauMargin à 19 EUR par mois est une alternative redoutablement efficace. Comparatif honnête, sans bullshit."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-05-26" readTime="12 min" variant="header" />

        {/* ── TL;DR honnete (featured snippet) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">
              TL;DR — 30 secondes
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Quelle alternative choisir entre Innovorder et RestauMargin ?
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span>
                <strong className="text-white">Innovorder</strong> = suite POS complète (caisse,
                click & collect, livraison, kiosque) — 89 à 199 EUR/mois + matériel.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span>
                <strong className="text-white">RestauMargin</strong> = gestion de marge, food cost,
                fiches techniques, IA — 19 EUR/mois sans matériel.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span>
                <strong className="text-white">Les deux outils ne se concurrencent pas vraiment</strong> :
                Innovorder vend, RestauMargin pilote la marge. Rien n'empêche de les utiliser en parallèle.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span>
                <strong className="text-white">Vous cherchez juste à maîtriser votre rentabilité</strong> ?
                RestauMargin suffit, vous économisez 60 à 170 EUR/mois sur Innovorder.
              </span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Verdict honnête : choisissez en fonction du besoin réel, pas du marketing. Et
            n'hésitez pas à combiner les deux si vous êtes en pleine croissance.
          </p>
        </div>

        {/* ── Sommaire ── */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#intro', label: 'Pourquoi comparer Innovorder et RestauMargin' },
              { href: '#innovorder', label: 'Innovorder en bref : forces et limites' },
              { href: '#restaumargin', label: 'RestauMargin en bref : positionnement et IA' },
              { href: '#tableau', label: 'Tableau comparatif complet (15 critères)' },
              { href: '#cas-usage', label: 'Cas d\'usage : POS vs gestion de marge' },
              { href: '#pricing', label: 'Pricing : combien chacun coûte sur 1 an' },
              { href: '#faq', label: 'FAQ : 10 questions fréquentes' },
              { href: '#cta', label: 'Tester RestauMargin gratuitement' },
            ].map((item, i) => (
              <li key={i}>
                <a
                  href={item.href}
                  className="hover:text-teal-600 transition-colors flex items-start gap-2"
                >
                  <span className="text-teal-600 font-semibold min-w-[24px]">{i + 1}.</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article>
          {/* ═════════════ SECTION 1 : Intro ═════════════ */}
          <section id="intro" className="mb-16">
            <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="1">
              Pourquoi comparer Innovorder et RestauMargin
            </SectionHeading>

            <div className="prose-content space-y-4 text-base text-mono-400 leading-relaxed">
              <p>
                Quand un restaurateur tape "alternative Innovorder" dans Google, il cherche en
                général une de ces trois choses : un outil moins cher, un outil plus simple, ou un
                outil spécialisé sur un besoin précis (la marge, la livraison, la fidélisation,
                etc). Innovorder est une suite très complète, mais cette complétude a un coût —
                financier, technique et organisationnel.
              </p>
              <p>
                RestauMargin n'est pas un clone d'Innovorder. Nous n'avons pas de caisse
                enregistreuse, pas de borne kiosque, pas de site click & collect prêt à l'emploi.
                Notre obsession depuis le premier jour, c'est une seule chose : aider les
                restaurateurs à piloter leur marge plat par plat, ingrédient par ingrédient,
                fournisseur par fournisseur. Et faire ça pour 19 EUR par mois au lieu de 199 EUR.
              </p>
              <p>
                Ce comparatif est honnête. Si vous avez besoin d'un POS complet avec click &
                collect, livraison, kiosque et borne de commande, Innovorder est une excellente
                solution — gardez-la ou adoptez-la. Si votre vraie douleur est : "Je ne sais pas si
                mes plats sont rentables, mes prix fournisseurs bougent et j'ai aucun contrôle sur
                ma marge", alors RestauMargin sera l'alternative la plus efficace que vous puissiez
                trouver, et 6 fois moins chère.
              </p>
              <p>
                Voyons en détail ce que chaque outil propose, leurs forces, leurs limites, et
                surtout : quand utiliser l'un, l'autre, ou les deux ensemble.
              </p>
            </div>
          </section>

          {/* ═════════════ SECTION 2 : Innovorder ═════════════ */}
          <section id="innovorder" className="mb-16">
            <SectionHeading icon={<Layers className="w-6 h-6" />} number="2">
              Innovorder en bref : forces et limites
            </SectionHeading>

            <div className="prose-content space-y-4 text-base text-mono-400 leading-relaxed">
              <p>
                Innovorder est une plateforme française lancée en 2014, spécialisée dans la
                digitalisation des restaurants. Leur catalogue couvre quasiment toute la chaîne
                front-office : caisse enregistreuse, click & collect, borne kiosque, gestion de
                livraison, programme de fidélité, encaissement carte. C'est une suite sérieuse,
                utilisée par de grosses enseignes comme La Croissanterie, Big Fernand ou Sushi Shop.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mt-8">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-emerald-900">Les forces d'Innovorder</h3>
                </div>
                <ul className="space-y-2 text-sm text-emerald-900 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">+</span> Suite tout-en-un :
                    caisse, click & collect, kiosque, livraison, fidélité.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">+</span> Matériel professionnel
                    fourni (tablettes, imprimantes, bornes).
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">+</span> Intégrations natives
                    Uber Eats, Deliveroo, Just Eat.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">+</span> Conformité caisse
                    enregistreuse certifiée NF525.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">+</span> Support téléphonique et
                    accompagnement de déploiement.
                  </li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-5 h-5 text-red-700" />
                  <h3 className="font-bold text-red-900">Les limites d'Innovorder</h3>
                </div>
                <ul className="space-y-2 text-sm text-red-900 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">-</span> Prix élevés : 89 à 199 EUR
                    par mois selon les modules + matériel.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">-</span> Contrats d'engagement 12 à
                    36 mois fréquents.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">-</span> Module gestion de marge /
                    fiche technique limité et moins spécialisé.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">-</span> Pas d'IA générative pour
                    optimiser les marges ou négocier les fournisseurs.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">-</span> Déploiement long (plusieurs
                    semaines), pas d'inscription en self-service.
                  </li>
                </ul>
              </div>
            </div>

            <div className="prose-content mt-8 space-y-4 text-base text-mono-400 leading-relaxed">
              <p>
                Pour qui Innovorder est pertinent ? Une chaîne multi-sites en croissance, un
                restaurant gros volume qui veut digitaliser entièrement sa prise de commande, ou
                une enseigne qui mise lourdement sur le click & collect et la livraison. Pour un
                bistrot indépendant qui veut surtout maîtriser son food cost, c'est sortir un
                bazooka pour tuer une mouche.
              </p>
            </div>
          </section>

          {/* ═════════════ SECTION 3 : RestauMargin ═════════════ */}
          <section id="restaumargin" className="mb-16">
            <SectionHeading icon={<Target className="w-6 h-6" />} number="3">
              RestauMargin en bref : positionnement et IA
            </SectionHeading>

            <div className="prose-content space-y-4 text-base text-mono-400 leading-relaxed">
              <p>
                RestauMargin est né d'un constat simple : 30 % des restaurants ferment dans les
                trois premières années, et la cause principale n'est presque jamais "pas assez de
                couverts" — c'est "marge mal pilotée". On réduit le prix d'un plat parce qu'un
                concurrent baisse le sien, on augmente la portion pour faire plaisir au client, on
                accepte une hausse fournisseur sans répercuter sur le prix de vente, et 6 mois plus
                tard la trésorerie est dans le rouge.
              </p>
              <p>
                Notre produit est conçu autour de la fiche technique vivante : chaque plat est
                décomposé en ingrédients avec grammages précis, le coût matière est recalculé
                automatiquement à chaque mise à jour de prix fournisseur, et le food cost est
                affiché en temps réel. Le restaurateur sait exactement, à tout instant, quels plats
                sont rentables et lesquels grignotent sa marge.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mt-8">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-emerald-900">Les forces de RestauMargin</h3>
                </div>
                <ul className="space-y-2 text-sm text-emerald-900 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">+</span> 19 EUR/mois, sans
                    engagement, sans carte bancaire pour l'essai.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">+</span> Spécialisé gestion de
                    marge : food cost, fiches, mercuriale, menu engineering.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">+</span> 19 actions IA :
                    assistant vocal, scanner OCR factures, suggestions, négociation IA.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">+</span> Déploiement immédiat,
                    inscription en 30 secondes, première fiche technique en 5 minutes.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">+</span> Multi-restaurant natif,
                    PWA installable sur tablette, fonctionne hors connexion.
                  </li>
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-700" />
                  <h3 className="font-bold text-amber-900">Ce que RestauMargin ne fait pas</h3>
                </div>
                <ul className="space-y-2 text-sm text-amber-900 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">!</span> Pas de caisse
                    enregistreuse certifiée NF525 (utilisez Tiller, Zelty, Innovorder).
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">!</span> Pas de click & collect ni
                    de site de commande en ligne intégré.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">!</span> Pas de borne kiosque ni de
                    matériel d'encaissement.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">!</span> Pas d'intégration directe
                    Uber Eats / Deliveroo (à configurer manuellement).
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">!</span> Pas de programme de
                    fidélité client transactionnel (focus reste sur le back-office).
                  </li>
                </ul>
              </div>
            </div>

            <Callout type="info">
              <strong>La vérité que personne ne dit :</strong> Innovorder fait 80 % du front-office
              (vendre, encaisser, livrer) et 20 % du back-office (analyser la marge). RestauMargin
              fait 0 % du front-office et 100 % du back-office. Ce n'est pas un duel, c'est une
              complémentarité. Mais si vous avez déjà une caisse qui marche, RestauMargin remplace
              le module Innovorder le moins compétitif pour 6 fois moins cher.
            </Callout>
          </section>

          {/* ═════════════ SECTION 4 : Tableau comparatif ═════════════ */}
          <section id="tableau" className="mb-16">
            <SectionHeading icon={<Scale className="w-6 h-6" />} number="4">
              Tableau comparatif complet (15 critères)
            </SectionHeading>

            <div className="prose-content space-y-4 text-base text-mono-400 leading-relaxed">
              <p>
                Voici un comparatif point par point basé sur les fiches produit publiques
                d'Innovorder et notre propre roadmap RestauMargin. Les tarifs peuvent évoluer,
                vérifiez toujours sur les sites officiels avant décision finale.
              </p>
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-mono-975 text-mono-350">
                    <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Critère</th>
                    <th className="text-center py-3 px-4 font-semibold">Innovorder</th>
                    <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">
                      RestauMargin
                    </th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  <CompareRow
                    label="Prix de départ"
                    innovorder="89 EUR / mois"
                    restaumargin="19 EUR / mois"
                    winner="restaumargin"
                  />
                  <CompareRow
                    label="Prix module complet"
                    innovorder="199 EUR / mois + matériel"
                    restaumargin="19 EUR / mois (tout inclus)"
                    winner="restaumargin"
                  />
                  <CompareRow
                    label="Essai gratuit"
                    innovorder="Démo sur RDV"
                    restaumargin="7 jours sans CB"
                    winner="restaumargin"
                  />
                  <CompareRow
                    label="Engagement"
                    innovorder="12 à 36 mois"
                    restaumargin="Mensuel, sans engagement"
                    winner="restaumargin"
                  />
                  <CompareRow
                    label="Caisse NF525 certifiée"
                    innovorder="Oui"
                    restaumargin="Non (à coupler avec un POS)"
                    winner="innovorder"
                  />
                  <CompareRow
                    label="Click & Collect / Livraison"
                    innovorder="Oui (module dédié)"
                    restaumargin="Non"
                    winner="innovorder"
                  />
                  <CompareRow
                    label="Borne kiosque"
                    innovorder="Oui (matériel inclus)"
                    restaumargin="Non"
                    winner="innovorder"
                  />
                  <CompareRow
                    label="Fiches techniques / food cost"
                    innovorder="Module basique"
                    restaumargin="Coeur de produit (précis)"
                    winner="restaumargin"
                  />
                  <CompareRow
                    label="Mercuriale fournisseurs"
                    innovorder="Limité"
                    restaumargin="Complète + historique prix"
                    winner="restaumargin"
                  />
                  <CompareRow
                    label="IA générative (assistant, OCR)"
                    innovorder="Non disponible"
                    restaumargin="19 actions IA intégrées"
                    winner="restaumargin"
                  />
                  <CompareRow
                    label="Menu Engineering Boston Matrix"
                    innovorder="Non"
                    restaumargin="Oui (Stars / Plowhorses / Puzzles / Dogs)"
                    winner="restaumargin"
                  />
                  <CompareRow
                    label="Multi-restaurant"
                    innovorder="Oui (offre Enterprise)"
                    restaumargin="Oui natif (inclus dans les 19 EUR/mois)"
                    winner="tie"
                  />
                  <CompareRow
                    label="PWA / mode hors connexion"
                    innovorder="Limité"
                    restaumargin="PWA installable, offline-first"
                    winner="restaumargin"
                  />
                  <CompareRow
                    label="Allergènes & HACCP"
                    innovorder="Basique"
                    restaumargin="Matrice allergènes + checklist HACCP"
                    winner="restaumargin"
                  />
                  <CompareRow
                    label="Déploiement"
                    innovorder="2 à 6 semaines (RDV, formation)"
                    restaumargin="30 secondes (self-service)"
                    winner="restaumargin"
                  />
                </tbody>
              </table>
            </div>

            <Callout type="warning">
              <strong>Avertissement honnête :</strong> ce tableau favorise RestauMargin sur la
              gestion de marge — c'est notre spécialité. Sur la prise de commande (caisse, click &
              collect, livraison, kiosque), Innovorder gagne sans discussion. Le bon choix dépend
              de votre vrai problème : encaisser ou piloter la marge ?
            </Callout>
          </section>

          {/* ═════════════ SECTION 5 : Cas d'usage ═════════════ */}
          <section id="cas-usage" className="mb-16">
            <SectionHeading icon={<Users className="w-6 h-6" />} number="5">
              Cas d'usage : POS vs gestion de marge
            </SectionHeading>

            <div className="prose-content space-y-4 text-base text-mono-400 leading-relaxed">
              <p>
                Trois exemples illustratifs (profils fictifs) pour vous aider à décider.
              </p>
            </div>

            <div className="space-y-6 mt-8">
              <UseCaseCard
                badge="Cas 1"
                title="Bistrot indépendant 80 couverts, CA 450K EUR"
                profile="Un bistrot indépendant. Caisse enregistreuse Tiller déjà en place, pas de click & collect. Marge nette tombée à 3 % à cause de la hausse des produits frais."
                besoin="Reprendre le contrôle sur le food cost, répercuter les hausses fournisseurs sur les prix de vente, identifier les plats sous-marges."
                recommandation="RestauMargin seul (19 EUR/mois). Pas besoin d'Innovorder, la caisse existante fait déjà le job. Investissement : 228 EUR/an. Ordre de grandeur : sur 450K EUR de CA, chaque point de food cost regagné représente environ 4 500 EUR de marge."
                outil="RestauMargin"
              />
              <UseCaseCard
                badge="Cas 2"
                title="Chaîne de 4 fast-casual, CA 2,5M EUR"
                profile="Une enseigne healthy de 4 restaurants. Click & collect représente 40 % du CA. Cherche à digitaliser la commande en kiosque pour fluidifier le rush midi."
                besoin="Suite POS complète avec click & collect, livraison Uber Eats / Deliveroo, kiosques tactiles, gestion multi-site centralisée."
                recommandation="Innovorder pour la partie front-office (caisse, kiosque, click & collect). RestauMargin en complément pour la marge multi-restaurants (19 EUR/mois, les 4 restaurants compris). Total : Innovorder + RestauMargin."
                outil="Innovorder + RestauMargin"
              />
              <UseCaseCard
                badge="Cas 3"
                title="Restaurant gastronomique 30 couverts, CA 600K EUR"
                profile="Un restaurant gastronomique, équipe restreinte. Pas de livraison ni click & collect, prise de commande au comptoir uniquement. Marge brute autour de 65 %, objectif 72 %."
                besoin="Fiches techniques ultra précises, suivi des ingrédients haut de gamme (truffe, foie gras), allergènes pour clientèle exigeante, mercuriale fournisseurs Rungis."
                recommandation="RestauMargin seul. Le module food cost + mercuriale + allergènes est exactement le besoin. Aucun intérêt à payer Innovorder 89 EUR de plus pour des fonctionnalités inutiles ici."
                outil="RestauMargin"
              />
            </div>
          </section>

          {/* ═════════════ SECTION 6 : Pricing ═════════════ */}
          <section id="pricing" className="mb-16">
            <SectionHeading icon={<CreditCard className="w-6 h-6" />} number="6">
              Pricing : combien chacun coûte sur 1 an
            </SectionHeading>

            <div className="prose-content space-y-4 text-base text-mono-400 leading-relaxed">
              <p>
                Au-delà du prix mensuel affiché, il faut intégrer le matériel, les frais
                d'installation et les engagements. Voici la projection réaliste sur 12 mois pour un
                restaurant mono-site.
              </p>
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-mono-975 text-mono-350">
                    <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Poste</th>
                    <th className="text-right py-3 px-4 font-semibold">Innovorder (estimation)</th>
                    <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">
                      RestauMargin
                    </th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  <tr className="bg-white">
                    <td className="py-3 px-4 font-medium text-mono-100">Abonnement mensuel</td>
                    <td className="py-3 px-4 text-right">89 à 199 EUR / mois</td>
                    <td className="py-3 px-4 text-right">19 EUR / mois</td>
                  </tr>
                  <tr className="bg-mono-1000">
                    <td className="py-3 px-4 font-medium text-mono-100">Abonnement annuel</td>
                    <td className="py-3 px-4 text-right">1 068 à 2 388 EUR</td>
                    <td className="py-3 px-4 text-right">228 EUR</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 px-4 text-red-700">+ Matériel (caisse, imprimante)</td>
                    <td className="py-3 px-4 text-right text-red-700">500 à 2 000 EUR</td>
                    <td className="py-3 px-4 text-right text-emerald-700">0 EUR</td>
                  </tr>
                  <tr className="bg-mono-1000">
                    <td className="py-3 px-4 text-red-700">+ Frais d'installation</td>
                    <td className="py-3 px-4 text-right text-red-700">200 à 800 EUR</td>
                    <td className="py-3 px-4 text-right text-emerald-700">0 EUR</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 px-4 text-red-700">+ Modules optionnels</td>
                    <td className="py-3 px-4 text-right text-red-700">30 à 80 EUR / mois</td>
                    <td className="py-3 px-4 text-right text-emerald-700">Tout inclus</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="py-3 px-4 font-bold text-blue-900">Coût total 1 an</td>
                    <td className="py-3 px-4 text-right font-bold text-blue-900">
                      ~1 800 à 5 200 EUR
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-blue-900">228 EUR</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="prose-content mt-8 space-y-4 text-base text-mono-400 leading-relaxed">
              <p>
                À volume comparable de fonctionnalités (fiches techniques + reporting marge), le
                ratio est sans appel : RestauMargin est entre 8 et 22 fois moins cher sur la
                première année. Sur 3 ans cumulés, l'écart dépasse facilement 10 000 EUR. Pour un
                restaurant qui démarre ou qui veut tester avant d'investir, c'est décisif.
              </p>
              <p>
                Si vous avez besoin de la suite POS complète d'Innovorder, le surcoût se justifie
                par la valeur ajoutée (click & collect, livraison, kiosque). Mais si votre seul
                vrai problème est la marge, payer 1 500 à 4 000 EUR de plus par an pour des
                fonctions que vous n'utiliserez pas n'a aucun sens.
              </p>
            </div>
          </section>


          <BlogAuthor publishedDate="2026-05-26" readTime="12 min" variant="footer" />

          {/* ═════════════ FAQ ═════════════ */}
          <section id="faq" className="mb-16">
            <h2 className="text-2xl font-bold text-mono-100 mb-6">FAQ : 10 questions fréquentes</h2>
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
                Testez RestauMargin gratuitement
              </h2>
              <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
                Si votre vrai problème est la marge, ne payez pas 1 800 EUR par an pour une suite
                complète. Testez RestauMargin à 19 EUR/mois pendant 7 jours, sans engagement, sans
                carte bancaire.
              </p>
              <p className="text-teal-50 text-base max-w-xl mx-auto mb-8">
                <strong>19 EUR/mois</strong> &mdash; essai gratuit 7 jours, gardez Innovorder ou
                votre caisse actuelle, RestauMargin s'utilise en complément.
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

          {/* ═════════════ Articles complementaires ═════════════ */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/blog/logiciel-caisse-enregistreuse-restaurant"
                className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
              >
                <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">
                  Logiciel de caisse : guide complet
                </h3>
                <p className="text-xs text-mono-500">
                  Comparer les caisses certifiées NF525 du marché français.
                </p>
              </Link>
              <Link
                to="/blog/logiciel-gestion-restaurant"
                className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
              >
                <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">
                  Logiciel de gestion restaurant
                </h3>
                <p className="text-xs text-mono-500">
                  Panorama des outils SaaS pour piloter votre établissement.
                </p>
              </Link>
              <Link
                to="/blog/calcul-marge-restaurant"
                className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
              >
                <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">
                  Calculer la marge d'un restaurant
                </h3>
                <p className="text-xs text-mono-500">
                  Formules, exemples chiffrés et benchmarks par type d'établissement.
                </p>
              </Link>
              <Link
                to="/outils/calculateur-food-cost"
                className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
              >
                <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">
                  Calculateur food cost gratuit
                </h3>
                <p className="text-xs text-mono-500">Outil en ligne sans inscription.</p>
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

function SectionHeading({
  icon,
  number,
  children,
}: {
  icon: React.ReactNode;
  number: string;
  children: React.ReactNode;
}) {
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

function CompareRow({
  label,
  innovorder,
  restaumargin,
  winner,
}: {
  label: string;
  innovorder: string;
  restaumargin: string;
  winner: 'innovorder' | 'restaumargin' | 'tie';
}) {
  const innovorderCell =
    winner === 'innovorder'
      ? 'text-emerald-700 font-semibold'
      : winner === 'restaumargin'
        ? 'text-mono-500'
        : 'text-mono-350';
  const restaumarginCell =
    winner === 'restaumargin'
      ? 'text-emerald-700 font-semibold'
      : winner === 'innovorder'
        ? 'text-mono-500'
        : 'text-mono-350';

  return (
    <tr className="border-t border-mono-975 bg-white">
      <td className="py-3 px-4 font-medium text-mono-100">{label}</td>
      <td className={`py-3 px-4 text-center ${innovorderCell}`}>{innovorder}</td>
      <td className={`py-3 px-4 text-center ${restaumarginCell}`}>{restaumargin}</td>
    </tr>
  );
}

function UseCaseCard({
  badge,
  title,
  profile,
  besoin,
  recommandation,
  outil,
}: {
  badge: string;
  title: string;
  profile: string;
  besoin: string;
  recommandation: string;
  outil: string;
}) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-6 sm:p-7">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-700 px-3 py-1 rounded-full">
          {badge}
        </span>
        <span className="text-xs font-semibold bg-mono-1000 text-mono-350 px-3 py-1 rounded-full border border-mono-900">
          Outil recommandé : {outil}
        </span>
      </div>
      <h3 className="text-lg font-bold text-mono-100 mb-3">{title}</h3>
      <div className="space-y-3 text-sm text-mono-400 leading-relaxed">
        <p>
          <strong className="text-mono-100">Profil :</strong> {profile}
        </p>
        <p>
          <strong className="text-mono-100">Besoin :</strong> {besoin}
        </p>
        <p className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-teal-900">
          <strong>Recommandation :</strong> {recommandation}
        </p>
      </div>
    </div>
  );
}

function Callout({ type, children }: { type: 'info' | 'warning'; children: React.ReactNode }) {
  const styles =
    type === 'info'
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

