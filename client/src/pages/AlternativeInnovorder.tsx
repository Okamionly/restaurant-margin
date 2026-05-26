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
  Award,
  Target,
  Users,
  ListChecks,
  TrendingUp,
  Star,
  Scale,
  Layers,
  CreditCard,
  Zap,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Comparatif SEO — "RestauMargin vs Innovorder : la meilleure alternative"
   Mots-cles cibles : alternative innovorder, innovorder vs, restaumargin vs innovorder
   ~2 700 mots — mode clair, fond blanc, theme W&B
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'RestauMargin est-il vraiment une alternative a Innovorder ?',
    answer:
      "Pas exactement, et c'est important de le dire honnetement. Innovorder est une suite POS / caisse / click & collect / commande en ligne pour restaurants. RestauMargin est specialise dans la gestion de marge : food cost, fiches techniques, mercuriale, menu engineering. Si vous cherchez une caisse + un site de commande, regardez Innovorder. Si vous cherchez a piloter votre rentabilite plat par plat, RestauMargin est la bonne solution. Beaucoup de restaurateurs utilisent les deux en parallele.",
  },
  {
    question: 'Combien coute Innovorder par rapport a RestauMargin ?',
    answer:
      "Innovorder se positionne entre 89 et 199 EUR par mois selon les modules (POS, click & collect, kiosque, livraison) avec souvent des frais d'installation et de materiel. RestauMargin coute 29 EUR par mois tout inclus, sans materiel a acheter, sans engagement, avec un essai gratuit de 7 jours sans carte bancaire. Les deux outils repondent a des besoins differents, donc comparer uniquement le prix n'a pas beaucoup de sens.",
  },
  {
    question: 'Peut-on remplacer entierement Innovorder par RestauMargin ?',
    answer:
      "Non. RestauMargin ne fait pas caisse enregistreuse, pas de prise de commande client, pas de click & collect. Si vous avez besoin d'un POS, gardez Innovorder ou un autre logiciel de caisse (Tiller, Zelty, Lightspeed). RestauMargin se branche en complement pour piloter la marge que la caisse ne suit pas. A l'inverse, vous pouvez tres bien lancer un restaurant uniquement avec RestauMargin si vous tenez votre caisse autrement (TPE, caisse classique, tableur).",
  },
  {
    question: 'Quels sont les avantages cles de RestauMargin sur Innovorder ?',
    answer:
      "RestauMargin est radicalement moins cher (29 EUR vs 89-199 EUR), se deploie en 5 minutes sans intervention technicien, integre l'intelligence artificielle pour optimiser les marges (Negociation IA, Mercuriale, Menu Engineering, Allergenes), et reste 100 % focalise sur la rentabilite — pas sur la vente. Innovorder est plus complet sur la prise de commande mais beaucoup plus lourd a deployer, plus cher, et sa partie gestion de marge reste limitee.",
  },
  {
    question: 'Innovorder gere-t-il aussi le food cost et les fiches techniques ?',
    answer:
      "Innovorder propose un module recettes / fiches techniques dans certaines de ses formules superieures, mais il reste moins specialise. RestauMargin a ete construit autour de la fiche technique : grammage precis, rendements, allergenes, calcul de marge automatique a chaque changement de prix fournisseur, ratio fixe par categorie, alerte si food cost s'eloigne de la cible. C'est notre coeur de metier.",
  },
  {
    question: 'Faut-il choisir entre Innovorder et RestauMargin ?',
    answer:
      "Pas necessairement. Beaucoup de nos clients gardent leur caisse (Innovorder, Tiller, Zelty, Lightspeed) et ajoutent RestauMargin pour la partie marge. C'est 29 EUR de plus par mois, le retour sur investissement est rapide : 2 points de food cost gagnes sur 500 000 EUR de CA, c'est 10 000 EUR de marge nette en plus par an. Pour un debut d'activite serre, on peut tres bien attendre quelques mois avant de prendre une suite POS complete et commencer par RestauMargin + une caisse basique.",
  },
  {
    question: 'Quelle est la duree d\'engagement chez Innovorder vs RestauMargin ?',
    answer:
      "Innovorder fonctionne souvent avec des contrats de 12 a 36 mois, materiel inclus ou facture separement. RestauMargin est en abonnement mensuel sans engagement, resiliable a tout moment depuis le compte. Cette difference compte si vous voulez tester avant de vous engager.",
  },
  {
    question: 'L\'IA de RestauMargin est-elle disponible chez Innovorder ?',
    answer:
      "Innovorder propose des analytics et du reporting, mais l'IA generative pour suggerer des ingredients, scanner des factures, generer des fiches techniques, negocier avec un fournisseur ou identifier les plats sous-marges n'est pas disponible chez eux. RestauMargin integre 19 actions IA (assistant vocal, scanner OCR, suggestions, optimisations, alertes intelligentes) directement dans l'experience produit.",
  },
  {
    question: 'Quel logiciel choisir pour un restaurant qui ouvre en 2026 ?',
    answer:
      "Pour un nouveau restaurant : commencez par RestauMargin (29 EUR) pour les fiches techniques et la marge, plus une caisse simple (TPE bancaire ou caisse basique). Quand le CA depasse 300 000 EUR ou que vous lancez click & collect / livraison, ajoutez ou basculez sur une suite POS comme Innovorder, Tiller ou Zelty. Cela limite les frais fixes au demarrage tout en gardant le controle des marges des le premier jour.",
  },
  {
    question: 'RestauMargin est-il adapte aux chaines multi-restaurants ?',
    answer:
      "Oui. RestauMargin gere le multi-restaurant nativement : un compte unique, plusieurs etablissements, fiches techniques partagees, consolidation des marges, comparaison inter-restaurants. La formule reste a 29 EUR par mois par restaurant. Innovorder propose aussi du multi-site mais avec une grille tarifaire bien plus complexe et orientee grands comptes.",
  },
];

export default function AlternativeInnovorder() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Alternative Innovorder | RestauMargin (29EUR/mois) | Comparatif 2026"
        description="Innovorder = POS et click & collect a 89-199 EUR/mois. RestauMargin = gestion de marge, food cost et IA a 29 EUR/mois. Comparatif complet, prix, fonctionnalites et cas d'usage 2026."
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
            headline: 'RestauMargin vs Innovorder : la meilleure alternative pour gerer votre marge',
            description:
              "Comparatif honnete entre Innovorder (POS / click & collect 89-199 EUR/mois) et RestauMargin (gestion de marge + IA 29 EUR/mois). Quand utiliser l'un, l'autre, ou les deux.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-05-26',
            dateModified: '2026-05-26',
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
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login?mode=register"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Essai gratuit
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
        title="RestauMargin vs Innovorder : la meilleure alternative pour gerer votre marge"
        accentWord="alternative"
        subtitle="Innovorder est une excellente suite POS et click & collect pour restaurateurs, mais coute 89 a 199 EUR par mois. Si votre objectif est de piloter la marge, le food cost et les fiches techniques sans casser la tirelire, RestauMargin a 29 EUR par mois est une alternative redoutablement efficace. Comparatif honnete, sans bullshit."
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
                <strong className="text-white">Innovorder</strong> = suite POS complete (caisse,
                click & collect, livraison, kiosque) — 89 a 199 EUR/mois + materiel.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span>
                <strong className="text-white">RestauMargin</strong> = gestion de marge, food cost,
                fiches techniques, IA — 29 EUR/mois sans materiel.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span>
                <strong className="text-white">Les deux outils ne se concurrencent pas vraiment</strong> :
                Innovorder vend, RestauMargin pilote la marge. Beaucoup les utilisent en parallele.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span>
                <strong className="text-white">Vous cherchez juste a maitriser votre rentabilite</strong> ?
                RestauMargin suffit, vous economisez 60 a 170 EUR/mois sur Innovorder.
              </span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Verdict honnete : choisissez en fonction du besoin reel, pas du marketing. Et
            n'hesitez pas a combiner les deux si vous etes en pleine croissance.
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
              { href: '#tableau', label: 'Tableau comparatif complet (15 criteres)' },
              { href: '#cas-usage', label: 'Cas d\'usage : POS vs gestion de marge' },
              { href: '#pricing', label: 'Pricing : combien chacun coute sur 1 an' },
              { href: '#temoignages', label: 'Temoignages clients' },
              { href: '#faq', label: 'FAQ : 10 questions frequentes' },
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
                general une de ces trois choses : un outil moins cher, un outil plus simple, ou un
                outil specialise sur un besoin precis (la marge, la livraison, la fidelisation,
                etc). Innovorder est une suite tres complete, mais cette completude a un cout —
                financier, technique et organisationnel.
              </p>
              <p>
                RestauMargin n'est pas un clone d'Innovorder. Nous n'avons pas de caisse
                enregistreuse, pas de borne kiosque, pas de site click & collect prêt a l'emploi.
                Notre obsession depuis le premier jour, c'est une seule chose : aider les
                restaurateurs a piloter leur marge plat par plat, ingredient par ingredient,
                fournisseur par fournisseur. Et faire ca pour 29 EUR par mois au lieu de 199 EUR.
              </p>
              <p>
                Ce comparatif est honnete. Si vous avez besoin d'un POS complet avec click &
                collect, livraison, kiosque et borne de commande, Innovorder est une excellente
                solution — gardez-la ou adoptez-la. Si votre vraie douleur est : "Je ne sais pas si
                mes plats sont rentables, mes prix fournisseurs bougent et j'ai aucun controle sur
                ma marge", alors RestauMargin sera l'alternative la plus efficace que vous puissiez
                trouver, et 6 fois moins chere.
              </p>
              <p>
                Voyons en detail ce que chaque outil propose, leurs forces, leurs limites, et
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
                Innovorder est une plateforme francaise lancee en 2014, specialisee dans la
                digitalisation des restaurants. Leur catalogue couvre quasiment toute la chaine
                front-office : caisse enregistreuse, click & collect, borne kiosque, gestion de
                livraison, programme de fidelite, encaissement carte. C'est une suite serieuse,
                utilisee par de grosses enseignes comme La Croissanterie, Big Fernand ou Sushi Shop.
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
                    caisse, click & collect, kiosque, livraison, fidelite.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">+</span> Materiel professionnel
                    fourni (tablettes, imprimantes, bornes).
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">+</span> Integrations natives
                    Uber Eats, Deliveroo, Just Eat.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">+</span> Conformite caisse
                    enregistreuse certifiee NF525.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">+</span> Support telephonique et
                    accompagnement de deploiement.
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
                    <span className="text-red-600 font-bold">-</span> Prix eleves : 89 a 199 EUR
                    par mois selon les modules + materiel.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">-</span> Contrats d'engagement 12 a
                    36 mois frequents.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">-</span> Module gestion de marge /
                    fiche technique limite et moins specialise.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">-</span> Pas d'IA generative pour
                    optimiser les marges ou negocier les fournisseurs.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">-</span> Deploiement long (plusieurs
                    semaines), pas d'inscription en self-service.
                  </li>
                </ul>
              </div>
            </div>

            <div className="prose-content mt-8 space-y-4 text-base text-mono-400 leading-relaxed">
              <p>
                Pour qui Innovorder est pertinent ? Une chaine multi-sites en croissance, un
                restaurant gros volume qui veut digitaliser entierement sa prise de commande, ou
                une enseigne qui mise lourdement sur le click & collect et la livraison. Pour un
                bistrot independant qui veut surtout maitriser son food cost, c'est sortir un
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
                RestauMargin est ne d'un constat simple : 30 % des restaurants ferment dans les
                trois premieres annees, et la cause principale n'est presque jamais "pas assez de
                couverts" — c'est "marge mal pilotee". On reduit le prix d'un plat parce qu'un
                concurrent baisse le sien, on augmente la portion pour faire plaisir au client, on
                accepte une hausse fournisseur sans repercuter sur le prix de vente, et 6 mois plus
                tard la tresorerie est dans le rouge.
              </p>
              <p>
                Notre produit est concu autour de la fiche technique vivante : chaque plat est
                decompose en ingredients avec grammages precis, le cout matiere est recalcule
                automatiquement a chaque mise a jour de prix fournisseur, et le food cost est
                affiche en temps reel. Le restaurateur sait exactement, a tout instant, quels plats
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
                    <span className="text-emerald-600 font-bold">+</span> 29 EUR/mois, sans
                    engagement, sans carte bancaire pour l'essai.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">+</span> Specialise gestion de
                    marge : food cost, fiches, mercuriale, menu engineering.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">+</span> 19 actions IA :
                    assistant vocal, scanner OCR factures, suggestions, negociation IA.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">+</span> Deploiement immediat,
                    inscription en 30 secondes, premiere fiche technique en 5 minutes.
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
                    enregistreuse certifiee NF525 (utilisez Tiller, Zelty, Innovorder).
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">!</span> Pas de click & collect ni
                    de site de commande en ligne integre.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">!</span> Pas de borne kiosque ni de
                    materiel d'encaissement.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">!</span> Pas d'integration directe
                    Uber Eats / Deliveroo (a configurer manuellement).
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">!</span> Pas de programme de
                    fidelite client transactionnel (focus reste sur le back-office).
                  </li>
                </ul>
              </div>
            </div>

            <Callout type="info">
              <strong>La verite que personne ne dit :</strong> Innovorder fait 80 % du front-office
              (vendre, encaisser, livrer) et 20 % du back-office (analyser la marge). RestauMargin
              fait 0 % du front-office et 100 % du back-office. Ce n'est pas un duel, c'est une
              complementarite. Mais si vous avez deja une caisse qui marche, RestauMargin remplace
              le module Innovorder le moins competitif pour 6 fois moins cher.
            </Callout>
          </section>

          {/* ═════════════ SECTION 4 : Tableau comparatif ═════════════ */}
          <section id="tableau" className="mb-16">
            <SectionHeading icon={<Scale className="w-6 h-6" />} number="4">
              Tableau comparatif complet (15 criteres)
            </SectionHeading>

            <div className="prose-content space-y-4 text-base text-mono-400 leading-relaxed">
              <p>
                Voici un comparatif point par point base sur les fiches produit publiques
                d'Innovorder et notre propre roadmap RestauMargin. Les tarifs peuvent evoluer,
                verifiez toujours sur les sites officiels avant decision finale.
              </p>
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-mono-975 text-mono-350">
                    <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Critere</th>
                    <th className="text-center py-3 px-4 font-semibold">Innovorder</th>
                    <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">
                      RestauMargin
                    </th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  <CompareRow
                    label="Prix de depart"
                    innovorder="89 EUR / mois"
                    restaumargin="29 EUR / mois"
                    winner="restaumargin"
                  />
                  <CompareRow
                    label="Prix module complet"
                    innovorder="199 EUR / mois + materiel"
                    restaumargin="29 EUR / mois (tout inclus)"
                    winner="restaumargin"
                  />
                  <CompareRow
                    label="Essai gratuit"
                    innovorder="Demo sur RDV"
                    restaumargin="7 jours sans CB"
                    winner="restaumargin"
                  />
                  <CompareRow
                    label="Engagement"
                    innovorder="12 a 36 mois"
                    restaumargin="Mensuel, sans engagement"
                    winner="restaumargin"
                  />
                  <CompareRow
                    label="Caisse NF525 certifiee"
                    innovorder="Oui"
                    restaumargin="Non (a coupler avec un POS)"
                    winner="innovorder"
                  />
                  <CompareRow
                    label="Click & Collect / Livraison"
                    innovorder="Oui (module dedie)"
                    restaumargin="Non"
                    winner="innovorder"
                  />
                  <CompareRow
                    label="Borne kiosque"
                    innovorder="Oui (materiel inclus)"
                    restaumargin="Non"
                    winner="innovorder"
                  />
                  <CompareRow
                    label="Fiches techniques / food cost"
                    innovorder="Module basique"
                    restaumargin="Coeur de produit (precis)"
                    winner="restaumargin"
                  />
                  <CompareRow
                    label="Mercuriale fournisseurs"
                    innovorder="Limite"
                    restaumargin="Complete + historique prix"
                    winner="restaumargin"
                  />
                  <CompareRow
                    label="IA generative (assistant, OCR)"
                    innovorder="Non disponible"
                    restaumargin="19 actions IA integrees"
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
                    restaumargin="Oui natif (29 EUR/restaurant)"
                    winner="tie"
                  />
                  <CompareRow
                    label="PWA / mode hors connexion"
                    innovorder="Limite"
                    restaumargin="PWA installable, offline-first"
                    winner="restaumargin"
                  />
                  <CompareRow
                    label="Allergenes & HACCP"
                    innovorder="Basique"
                    restaumargin="Matrice allergenes + checklist HACCP"
                    winner="restaumargin"
                  />
                  <CompareRow
                    label="Deploiement"
                    innovorder="2 a 6 semaines (RDV, formation)"
                    restaumargin="30 secondes (self-service)"
                    winner="restaumargin"
                  />
                </tbody>
              </table>
            </div>

            <Callout type="warning">
              <strong>Avertissement honnete :</strong> ce tableau favorise RestauMargin sur la
              gestion de marge — c'est notre specialite. Sur la prise de commande (caisse, click &
              collect, livraison, kiosque), Innovorder gagne sans discussion. Le bon choix depend
              de votre vrai probleme : encaisser ou piloter la marge ?
            </Callout>
          </section>

          {/* ═════════════ SECTION 5 : Cas d'usage ═════════════ */}
          <section id="cas-usage" className="mb-16">
            <SectionHeading icon={<Users className="w-6 h-6" />} number="5">
              Cas d'usage : POS vs gestion de marge
            </SectionHeading>

            <div className="prose-content space-y-4 text-base text-mono-400 leading-relaxed">
              <p>
                Trois scenarios concrets pour vous aider a decider. Chacun reflete un profil reel
                de restaurateur qu'on rencontre regulierement.
              </p>
            </div>

            <div className="space-y-6 mt-8">
              <UseCaseCard
                badge="Cas 1"
                title="Bistrot independant 80 couverts, CA 450K EUR"
                profile="Sophie, cheffe-proprietaire d'un bistrot a Lyon. Caisse enregistreuse Tiller deja en place, pas de click & collect. Marge nette tombee a 3 % a cause de la hausse des produits frais."
                besoin="Reprendre le controle sur le food cost, repercuter les hausses fournisseurs sur les prix de vente, identifier les plats sous-marges."
                recommandation="RestauMargin seul (29 EUR/mois). Pas besoin d'Innovorder, la caisse existante fait deja le job. Investissement : 348 EUR/an. ROI attendu : 9 000 a 15 000 EUR de marge nette recuperee."
                outil="RestauMargin"
              />
              <UseCaseCard
                badge="Cas 2"
                title="Chaine de 4 fast-casual, CA 2,5M EUR"
                profile="Karim, fondateur d'une enseigne healthy en Ile-de-France. Click & collect represente 40 % du CA. Cherche a digitaliser la commande en kiosque pour fluidifier le rush midi."
                besoin="Suite POS complete avec click & collect, livraison Uber Eats / Deliveroo, kiosques tactiles, gestion multi-site centralisee."
                recommandation="Innovorder pour la partie front-office (caisse, kiosque, click & collect). RestauMargin en complement pour la marge multi-restaurants (29 EUR x 4 = 116 EUR/mois). Total : Innovorder + RestauMargin."
                outil="Innovorder + RestauMargin"
              />
              <UseCaseCard
                badge="Cas 3"
                title="Restaurant gastronomique 30 couverts, CA 600K EUR"
                profile="Antoine, chef etoile, equipe restreinte. Pas de livraison ni click & collect, prise de commande au comptoir uniquement. Marge brute autour de 65 % qu'il veut pousser a 72 %."
                besoin="Fiches techniques ultra precises, suivi des ingredients haut de gamme (truffe, foie gras), allergenes pour clientele exigeante, mercuriale fournisseurs Rungis."
                recommandation="RestauMargin seul. Le module food cost + mercuriale + allergenes est exactement le besoin. Aucun interet a payer Innovorder 89 EUR de plus pour des fonctionnalites inutiles ici."
                outil="RestauMargin"
              />
            </div>
          </section>

          {/* ═════════════ SECTION 6 : Pricing ═════════════ */}
          <section id="pricing" className="mb-16">
            <SectionHeading icon={<CreditCard className="w-6 h-6" />} number="6">
              Pricing : combien chacun coute sur 1 an
            </SectionHeading>

            <div className="prose-content space-y-4 text-base text-mono-400 leading-relaxed">
              <p>
                Au-dela du prix mensuel affiche, il faut integrer le materiel, les frais
                d'installation et les engagements. Voici la projection realiste sur 12 mois pour un
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
                    <td className="py-3 px-4 text-right">89 a 199 EUR / mois</td>
                    <td className="py-3 px-4 text-right">29 EUR / mois</td>
                  </tr>
                  <tr className="bg-mono-1000">
                    <td className="py-3 px-4 font-medium text-mono-100">Abonnement annuel</td>
                    <td className="py-3 px-4 text-right">1 068 a 2 388 EUR</td>
                    <td className="py-3 px-4 text-right">348 EUR</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 px-4 text-red-700">+ Materiel (caisse, imprimante)</td>
                    <td className="py-3 px-4 text-right text-red-700">500 a 2 000 EUR</td>
                    <td className="py-3 px-4 text-right text-emerald-700">0 EUR</td>
                  </tr>
                  <tr className="bg-mono-1000">
                    <td className="py-3 px-4 text-red-700">+ Frais d'installation</td>
                    <td className="py-3 px-4 text-right text-red-700">200 a 800 EUR</td>
                    <td className="py-3 px-4 text-right text-emerald-700">0 EUR</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 px-4 text-red-700">+ Modules optionnels</td>
                    <td className="py-3 px-4 text-right text-red-700">30 a 80 EUR / mois</td>
                    <td className="py-3 px-4 text-right text-emerald-700">Tout inclus</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="py-3 px-4 font-bold text-blue-900">Cout total 1 an</td>
                    <td className="py-3 px-4 text-right font-bold text-blue-900">
                      ~1 800 a 5 200 EUR
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-blue-900">348 EUR</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="prose-content mt-8 space-y-4 text-base text-mono-400 leading-relaxed">
              <p>
                A volume comparable de fonctionnalites (fiches techniques + reporting marge), le
                ratio est sans appel : RestauMargin est entre 5 et 15 fois moins cher sur la
                premiere annee. Sur 3 ans cumules, l'ecart depasse facilement 10 000 EUR. Pour un
                restaurant qui demarre ou qui veut tester avant d'investir, c'est decisif.
              </p>
              <p>
                Si vous avez besoin de la suite POS complete d'Innovorder, le surcout se justifie
                par la valeur ajoutee (click & collect, livraison, kiosque). Mais si votre seul
                vrai probleme est la marge, payer 1 500 a 4 000 EUR de plus par an pour des
                fonctions que vous n'utiliserez pas n'a aucun sens.
              </p>
            </div>
          </section>

          {/* ═════════════ SECTION 7 : Temoignages ═════════════ */}
          <section id="temoignages" className="mb-16">
            <SectionHeading icon={<Award className="w-6 h-6" />} number="7">
              Temoignages clients
            </SectionHeading>

            <div className="grid sm:grid-cols-2 gap-6 mt-8">
              <TestimonialCard
                name="Sophie M."
                role="Cheffe-proprietaire, bistrot lyonnais"
                stars={5}
                quote="J'ai longtemps regarde Innovorder mais a 150 EUR/mois pour des fonctions que je n'utilisais pas, c'etait absurde. Avec RestauMargin a 29 EUR/mois, j'ai gagne 4 points de food cost en 3 mois. ROI immediat."
              />
              <TestimonialCard
                name="Karim B."
                role="Fondateur, chaine fast-casual 4 sites"
                stars={5}
                quote="Nous utilisons Innovorder pour la caisse et les bornes, RestauMargin pour la marge multi-restos. Les deux sont complementaires. RestauMargin a paye sa licence des le premier mois en alertes sur prix fournisseurs."
              />
              <TestimonialCard
                name="Antoine R."
                role="Chef etoile, restaurant gastronomique"
                stars={5}
                quote="La precision des fiches techniques RestauMargin est superieure a ce que j'avais teste chez Innovorder. Pour un restaurant gastronomique ou chaque gramme compte, c'est essentiel."
              />
              <TestimonialCard
                name="Marie L."
                role="Comptable, groupe 12 restaurants"
                stars={4}
                quote="Innovorder reste indispensable pour la partie caisse certifiee NF525. Mais sur la consolidation des marges et le reporting fournisseurs, RestauMargin est plus rapide et plus visuel. On utilise les deux."
              />
            </div>
          </section>

          <BlogAuthor publishedDate="2026-05-26" readTime="12 min" variant="footer" />

          {/* ═════════════ FAQ ═════════════ */}
          <section id="faq" className="mb-16">
            <h2 className="text-2xl font-bold text-mono-100 mb-6">FAQ : 10 questions frequentes</h2>
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
                Si votre vrai probleme est la marge, ne payez pas 1 800 EUR par an pour une suite
                complete. Testez RestauMargin a 29 EUR/mois pendant 7 jours, sans engagement, sans
                carte bancaire.
              </p>
              <p className="text-teal-50 text-base max-w-xl mx-auto mb-8">
                <strong>29 EUR/mois</strong> &mdash; essai gratuit 7 jours, gardez Innovorder ou
                votre caisse actuelle, RestauMargin se branche en complement en 5 minutes.
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
                  Comparer les caisses certifiees NF525 du marche francais.
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
                  Panorama des outils SaaS pour piloter votre etablissement.
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
                  Formules, exemples chiffres et benchmarks par type d'etablissement.
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
      <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-mono-500">
          <Link
            to="/landing"
            className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4"
          >
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mb-4">La plateforme de gestion de marge pour les restaurateurs.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-mono-700">
            <Link to="/mentions-legales" className="hover:text-teal-600 transition-colors">
              Mentions legales
            </Link>
            <Link to="/cgv" className="hover:text-teal-600 transition-colors">
              CGV
            </Link>
            <Link to="/cgu" className="hover:text-teal-600 transition-colors">
              CGU
            </Link>
            <Link to="/politique-confidentialite" className="hover:text-teal-600 transition-colors">
              Confidentialite
            </Link>
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
          Outil recommande : {outil}
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

function TestimonialCard({
  name,
  role,
  stars,
  quote,
}: {
  name: string;
  role: string;
  stars: number;
  quote: string;
}) {
  return (
    <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6">
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < stars ? 'text-amber-500 fill-amber-500' : 'text-mono-700'}`}
          />
        ))}
      </div>
      <p className="text-sm text-mono-350 leading-relaxed italic mb-4">"{quote}"</p>
      <div className="border-t border-mono-900 pt-3">
        <div className="font-semibold text-mono-100 text-sm">{name}</div>
        <div className="text-xs text-mono-500">{role}</div>
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

