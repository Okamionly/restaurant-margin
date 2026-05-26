import { Link } from 'react-router-dom';
import {
  ChefHat,
  TrendingUp,
  Calculator,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  BarChart3,
  DollarSign,
  Target,
  BookOpen,
  Lightbulb,
  Users,
  Zap,
  Truck,
  Plug,
  Sparkles,
  Receipt,
  Network,
  Building2,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Alternative a Hubrise — Page comparative SEO
   Mots-cles : alternative hubrise, hubrise vs, integration plateformes livraison
   ~2 800 mots — theme W&B, blanc/noir, focus comparatif et complementarite
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Hubrise et RestauMargin sont-ils en concurrence directe ?",
    answer:
      "Non, ils servent des besoins differents et sont meme complementaires. Hubrise est un hub d'integrations qui connecte votre caisse a UberEats, Deliveroo, JustEat, Click&Collect, etc. RestauMargin pilote votre food cost, vos fiches techniques et votre marge brute. Beaucoup de restaurants multi-canaux utilisent les deux : Hubrise pour la connectivite commandes, RestauMargin pour la rentabilite reelle.",
  },
  {
    question: "Quel est le prix de Hubrise compare a RestauMargin ?",
    answer:
      "Hubrise se positionne entre 50 EUR et 200 EUR par mois selon le nombre d'integrations actives et le volume de commandes. RestauMargin est a 29 EUR par mois avec acces complet a la gestion de marge, fiches techniques, scanner de factures, menu engineering et IA. L'investissement n'a pas le meme objectif : Hubrise vous fait gagner du temps operationnel, RestauMargin vous fait gagner de la marge.",
  },
  {
    question: "Puis-je remplacer Hubrise par RestauMargin pour la livraison ?",
    answer:
      "Pas directement. RestauMargin n'est pas un middleware d'integration de commandes : nous ne synchronisons pas votre menu sur UberEats ou Deliveroo. Notre force est ailleurs : nous integrons les commissions des plateformes dans votre calcul de marge reel pour vous dire combien chaque plat vendu en livraison rapporte vraiment. Si vous avez besoin de la connectivite operationnelle, Hubrise reste pertinent.",
  },
  {
    question: "RestauMargin se connecte-t-il a UberEats, Deliveroo ou JustEat ?",
    answer:
      "Nous proposons l'import des rapports financiers UberEats, Deliveroo et JustEat (CSV ou via le scanner OCR de releves) pour reconcilier vos ventes livraison avec vos marges reelles. Pour la synchronisation en temps reel du menu, nous laissons cela aux specialistes comme Hubrise, Deliverect ou Otter, qui sont concus pour ce cas d'usage.",
  },
  {
    question: "Combien coute une commande UberEats apres commissions ?",
    answer:
      "Les plateformes prelevent generalement 25 a 35 % de commission (parfois plus pour les nouveaux restaurants). Sur un plat vendu 18 EUR TTC, vous touchez en realite 11 a 12 EUR HT. Si votre food cost est de 30 % (5,40 EUR), votre marge brute reelle tombe a environ 5,60 a 6,60 EUR au lieu de 11 EUR en vente directe. RestauMargin calcule automatiquement cette marge ajustee pour chaque canal.",
  },
  {
    question: "Hubrise gere-t-il le food cost ou les fiches techniques ?",
    answer:
      "Non. Hubrise est un hub d'integration : il route les commandes, synchronise les menus, met a jour les stocks via API. Il ne gere ni les fiches techniques, ni le calcul du cout matiere, ni la marge plat par plat. C'est exactement la lacune que RestauMargin comble. Les deux outils sont donc parfaitement complementaires dans un stack restaurant moderne.",
  },
  {
    question: "Pour un mono-restaurant qui ne fait pas de livraison, lequel choisir ?",
    answer:
      "Si vous ne faites ni livraison ni click&collect ni vente sur les marketplaces, Hubrise n'a pas grand interet pour vous. RestauMargin reste pertinent : meme sans livraison, vous avez besoin de calculer vos marges, gerer vos fiches techniques, scanner vos factures fournisseurs et optimiser votre carte. Notre essai gratuit 7 jours sans CB vous permet de tester sans risque.",
  },
  {
    question: "Quelles plateformes Hubrise integre-t-il ?",
    answer:
      "Hubrise se connecte a un large ecosysteme : UberEats, Deliveroo, JustEat, Stuart, Yper pour la livraison ; Lightspeed, Tiller, Cashpad, Sumup, JDC pour la caisse ; Square, Wix, Shopify pour les sites web ; ainsi que de nombreux outils metiers (KDS, fidelite, paiement). C'est son point fort : la profondeur du catalogue d'integrations.",
  },
  {
    question: "Quelle est la duree d'implementation de chaque outil ?",
    answer:
      "Hubrise demande generalement 1 a 4 semaines selon le nombre d'integrations a parametrer (mapping menus, tests commandes, formation equipe). RestauMargin est operationnel en 30 minutes : creez un compte, importez vos premieres recettes, le calcul de marge se fait automatiquement. C'est volontaire : nous voulons que la prise en main soit immediate.",
  },
  {
    question: "Y a-t-il un engagement avec RestauMargin ?",
    answer:
      "Aucun. RestauMargin est sans engagement, sans carte bancaire requise pour l'essai 7 jours, et vous pouvez resilier en un clic depuis votre espace abonnement. C'est une difference notable avec certains hubs d'integration qui demandent souvent un engagement annuel ou des frais de setup. 29 EUR/mois flat, sans surprise.",
  },
];

export default function AlternativeHubrise() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Alternative Hubrise | RestauMargin food cost | Comparatif 2026"
        description="Hubrise = hub d'integrations livraison (UberEats, Deliveroo). RestauMargin = pilotage de marge (food cost, fiches techniques). Comparatif complet 2026, prix, cas d'usage et complementarite."
        path="/alternative-hubrise"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Comparatifs', url: 'https://www.restaumargin.fr/' },
            { name: 'Alternative a Hubrise', url: 'https://www.restaumargin.fr/alternative-hubrise' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Alternative a Hubrise : RestauMargin pour la gestion de marge',
            description:
              "Comparatif Hubrise vs RestauMargin : positionnement, prix, fonctionnalites, cas d'usage et complementarite pour les restaurants modernes.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-05-26',
            dateModified: '2026-05-26',
            wordCount: 2800,
            inLanguage: 'fr-FR',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://www.restaumargin.fr/alternative-hubrise',
            },
          },
        ]}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-[#111111] font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login?mode=register"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Essai 7 jours gratuit
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-[#737373] hover:text-teal-600 transition-colors"
            >
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Breadcrumbs visibles ── */}
      <div className="bg-[#F5F5F5] border-b border-[#E5E7EB] py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-[#737373] flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <span className="hover:text-teal-600">Comparatifs</span>
          <span>/</span>
          <span className="text-[#111111] font-medium">Alternative a Hubrise</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Comparatif"
        readTime="12 min"
        date="Mai 2026"
        title="Alternative a Hubrise : RestauMargin pour la gestion de marge"
        accentWord="marge"
        subtitle="Hubrise connecte vos plateformes de livraison. RestauMargin pilote votre rentabilite reelle. Decouvrez les differences, les complementarites, les prix et le bon choix pour votre restaurant en 2026."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-05-26" readTime="12 min" variant="header" />

        {/* ── Resume executif ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">
              Resume en 30 secondes
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Hubrise vs RestauMargin : le verdict rapide
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold flex-shrink-0">1.</span>
              <span>
                <strong className="text-white">Hubrise</strong> = hub d'integration (caisse, UberEats,
                Deliveroo, JustEat, KDS, site web). Connecte tout, ne calcule rien.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold flex-shrink-0">2.</span>
              <span>
                <strong className="text-white">RestauMargin</strong> = pilote de marge (food cost,
                fiches techniques, scanner factures, menu engineering). Calcule la rentabilite reelle.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold flex-shrink-0">3.</span>
              <span>
                <strong className="text-white">Complementaires</strong>, pas concurrents. Beaucoup de
                restaurants multi-canaux utilisent les deux : Hubrise pour l'operationnel, RestauMargin pour la marge.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold flex-shrink-0">4.</span>
              <span>
                <strong className="text-white">Prix</strong> : Hubrise 50 a 200 EUR/mois (selon integrations).
                RestauMargin 29 EUR/mois flat.
              </span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Vous ne faites pas de livraison ? Hubrise n'est pas pour vous. Vous voulez connaitre la
            marge reelle de chaque plat vendu sur chaque canal ? RestauMargin est indispensable.
          </p>
        </div>

        {/* ── Table des matieres ── */}
        <nav className="my-12 bg-[#F5F5F5] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#111111] mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-[#404040]">
            {[
              { href: '#positionnement', label: "Positionnement : pourquoi ces 2 outils ne font pas la meme chose" },
              { href: '#hubrise', label: "Hubrise en detail : ce qu'il fait (et ce qu'il ne fait pas)" },
              { href: '#restaumargin', label: 'RestauMargin en detail : pilote de marge restaurant' },
              { href: '#comparatif', label: 'Tableau comparatif : 15 criteres face-a-face' },
              { href: '#cas-usage', label: 'Cas d\'usage : qui choisir, ou combiner les 2' },
              { href: '#livraison', label: "Couts livraison et commissions : l'impact reel sur votre marge" },
              { href: '#pricing', label: 'Pricing 1 an : combien ca coute reellement' },
              { href: '#faq', label: 'Questions frequentes' },
              { href: '#cta', label: 'Tester RestauMargin gratuitement' },
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

        {/* ═════════════ SECTION 1 : Positionnement ═════════════ */}
        <section id="positionnement" className="mb-16">
          <SectionHeading icon={<Network className="w-6 h-6" />} number="1">
            Positionnement : pourquoi ces 2 outils ne font pas la meme chose
          </SectionHeading>

          <div className="prose-content space-y-4">
            <p className="text-[#404040] leading-relaxed">
              Avant de comparer les fonctionnalites, il faut comprendre que Hubrise et RestauMargin appartiennent
              a deux familles d'outils completement differentes. Les confondre, c'est se priver de la valeur de
              chacun. Voici le decoupage de l'ecosysteme tech restauration en 2026.
            </p>

            <p className="text-[#404040] leading-relaxed">
              D'un cote, vous avez les <strong>hubs d'integration</strong> (Hubrise, Deliverect, Otter, Cuboh).
              Leur job : rendre vos differents canaux de vente compatibles entre eux. Vous mettez a jour un plat
              dans votre caisse Lightspeed ? Le menu UberEats, Deliveroo, JustEat et votre site web se mettent
              automatiquement a jour. Vous recevez une commande UberEats ? Elle arrive directement dans votre caisse
              et votre KDS, sans ressaisie. Sans ce middleware, votre equipe passe son temps a faire du copier-coller
              entre plateformes — et a faire des erreurs.
            </p>

            <p className="text-[#404040] leading-relaxed">
              De l'autre cote, vous avez les <strong>pilotes de marge</strong> (RestauMargin, MarginEdge aux US,
              certains modules Cegid Restauration). Leur job : transformer vos donnees brutes (factures fournisseurs,
              ventes par plat, fiches techniques) en decisions actionnables : ce plat vous fait perdre de l'argent
              en livraison, ce fournisseur a augmente ses prix sans vous prevenir, votre food cost a derive de 3 points
              depuis le mois dernier. Sans cet outil, vous pilotez a l'aveugle.
            </p>

            <Callout type="info">
              <strong>L'analogie qui clarifie tout :</strong> Hubrise est a votre restaurant ce que Zapier est a un
              SaaS — un connecteur qui fait parler vos outils entre eux. RestauMargin est ce que serait Stripe Radar
              pour la marge — une intelligence qui analyse vos flux financiers pour vous proteger des fuites.
            </Callout>

            <p className="text-[#404040] leading-relaxed">
              Beaucoup de restaurateurs cherchent une "alternative a Hubrise" en pensant qu'un seul outil va tout faire.
              La realite du marche 2026 est plus nuancee : aucun outil generaliste ne fait correctement les deux jobs.
              Les hubs sont concus pour la connectivite (et c'est tres complexe : chaque plateforme a sa propre API,
              ses propres mises a jour, ses propres bugs). Les pilotes de marge sont concus pour la finance operationnelle
              (calcul de cout matiere, scoring, alertes). Mieux vaut deux excellents outils specialises qu'un outil
              moyen sur les deux fronts.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Hubrise en detail ═════════════ */}
        <section id="hubrise" className="mb-16">
          <SectionHeading icon={<Plug className="w-6 h-6" />} number="2">
            Hubrise en detail : ce qu'il fait (et ce qu'il ne fait pas)
          </SectionHeading>

          <div className="prose-content space-y-4">
            <p className="text-[#404040] leading-relaxed">
              Hubrise est une startup francaise (basee a Lille) fondee en 2017, qui s'est positionnee tres tot sur
              le creneau du middleware pour la restauration. Aujourd'hui, c'est l'un des hubs les plus reconnus en
              France, avec un catalogue d'integrations particulierement profond cote francophone.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Ce que Hubrise fait tres bien</h3>
              </div>
              <ul className="space-y-2 text-sm text-emerald-900 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">+</span>
                  Synchronisation de menu entre caisse et plateformes de livraison
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">+</span>
                  Routing des commandes UberEats / Deliveroo / JustEat vers la caisse + KDS
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">+</span>
                  Gestion du Click & Collect via site web ou marketplace
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">+</span>
                  Connexion a un large ecosysteme : Lightspeed, Tiller, Cashpad, Sumup, JDC
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">+</span>
                  Stock partage entre tous les canaux (rupture instantanee)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">+</span>
                  Support B2B solide, contrat SLA, accompagnement entreprise
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">Ce que Hubrise ne fait pas</h3>
              </div>
              <ul className="space-y-2 text-sm text-amber-900 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">-</span>
                  Calcul du food cost ou de la marge brute par plat
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">-</span>
                  Fiches techniques avec grammages et couts ingredients
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">-</span>
                  Scanner de factures fournisseurs avec OCR
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">-</span>
                  Menu engineering (matrice popularite x marge)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">-</span>
                  Alertes de derive de prix fournisseurs
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">-</span>
                  Suivi inventaire et gaspillage avec valorisation
                </li>
              </ul>
            </div>
          </div>

          <div className="prose-content mt-8 space-y-4">
            <p className="text-[#404040] leading-relaxed">
              Le modele economique Hubrise est base sur le volume : plus vous avez d'integrations actives et plus
              vos commandes mensuelles sont nombreuses, plus la facture monte. En entree de gamme, comptez 50 EUR
              par mois pour un setup minimal (caisse + 1 plateforme). Pour un restaurant multi-canaux mature
              (caisse + 3 plateformes livraison + site web Click & Collect + KDS), la facture peut grimper a
              150-200 EUR par mois, parfois davantage selon les volumes.
            </p>

            <p className="text-[#404040] leading-relaxed">
              Le ROI est evident pour qui souffrait de double saisie : moins d'erreurs de commande, plus de temps
              en cuisine, menus toujours a jour. En revanche, Hubrise ne vous dira jamais qu'un plat vendu en
              livraison vous fait perdre 3 EUR a cause des commissions UberEats. Cette analyse, c'est le job de RestauMargin.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : RestauMargin en detail ═════════════ */}
        <section id="restaumargin" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="3">
            RestauMargin en detail : pilote de marge restaurant
          </SectionHeading>

          <div className="prose-content space-y-4">
            <p className="text-[#404040] leading-relaxed">
              RestauMargin est ne d'un constat simple : la grande majorite des outils de gestion restaurant
              s'arretent au pointage des commandes et a la sortie de caisse, sans jamais repondre a la question
              vitale : <em>est-ce que ce plat me rapporte vraiment de l'argent, sur ce canal de vente, ce mois-ci ?</em>
            </p>

            <p className="text-[#404040] leading-relaxed">
              Notre positionnement est clair : <strong>nous sommes le pilote de marge, pas le hub d'integration</strong>.
              Nous nous concentrons sur la partie financiere et operationnelle qui transforme un restaurant qui survit
              en un restaurant qui prospere. La connectivite operationnelle, nous la laissons aux specialistes
              comme Hubrise — et nous nous interface avec eux quand c'est pertinent.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <FeatureCard
              icon={<Calculator className="w-5 h-5" />}
              title="Fiches techniques precises"
              desc="Saisissez les grammages exacts de chaque ingredient. Le food cost et la marge brute se calculent automatiquement avec les prix fournisseurs en temps reel."
            />
            <FeatureCard
              icon={<Receipt className="w-5 h-5" />}
              title="Scanner de factures OCR"
              desc="Photographiez vos factures fournisseurs. Les prix sont extraits automatiquement et vos fiches techniques mises a jour. Plus de saisie manuelle."
            />
            <FeatureCard
              icon={<TrendingUp className="w-5 h-5" />}
              title="Suivi marge en temps reel"
              desc="Visualisez marge brute, food cost et marge nette au jour le jour, par plat, par categorie, par canal de vente (sur place, livraison, takeaway)."
            />
            <FeatureCard
              icon={<Target className="w-5 h-5" />}
              title="Menu engineering"
              desc="Matrice Boston (popularite x rentabilite). Identifiez vos stars, chevaux de labour, enigmes et poids morts pour optimiser votre carte."
            />
            <FeatureCard
              icon={<AlertTriangle className="w-5 h-5" />}
              title="Alertes derive"
              desc="Recevez une notification quand un prix fournisseur augmente, quand un food cost depasse votre seuil, ou quand un plat passe en perte sur un canal."
            />
            <FeatureCard
              icon={<Sparkles className="w-5 h-5" />}
              title="Assistant IA integre"
              desc="19 actions IA : suggestions de recettes, optimisation marges, detection d'anomalies, analyse des derives de prix, commande vocale, generation de fiches."
            />
          </div>

          <div className="prose-content mt-8">
            <p className="text-[#404040] leading-relaxed">
              Le tarif est volontairement simple : 29 EUR par mois flat, essai gratuit 7 jours sans carte bancaire,
              resiliation en 1 clic. Pas de paliers compliques par volume de commandes, pas de surfacturation par
              integration ajoutee. C'est le compromis que nous avons fait : un produit puissant, un tarif lisible.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 4 : Tableau comparatif ═════════════ */}
        <section id="comparatif" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="4">
            Tableau comparatif : 15 criteres face-a-face
          </SectionHeading>

          <div className="prose-content">
            <p className="text-[#404040] leading-relaxed">
              Comparaison objective Hubrise vs RestauMargin sur les criteres qui comptent pour un restaurateur en 2026.
              Tout est public et verifiable sur les sites respectifs.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#F5F5F5] text-[#111111]">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Critere</th>
                  <th className="text-center py-3 px-4 font-semibold">Hubrise</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl bg-teal-50 text-teal-900">
                    RestauMargin
                  </th>
                </tr>
              </thead>
              <tbody className="text-[#404040]">
                {[
                  { critere: 'Categorie outil', h: 'Hub d\'integration', r: 'Pilote de marge' },
                  { critere: 'Prix entree de gamme', h: '50 EUR/mois', r: '29 EUR/mois' },
                  { critere: 'Prix haut de gamme', h: '150-200 EUR/mois', r: '29 EUR/mois (flat)' },
                  { critere: 'Engagement', h: 'Souvent annuel', r: 'Aucun, resiliable 1 clic' },
                  { critere: 'Essai gratuit', h: 'Demo commerciale', r: '7 jours sans CB' },
                  { critere: 'Temps mise en place', h: '1 a 4 semaines', r: '30 minutes' },
                  { critere: 'Synchro menus livraison', h: 'Oui (forte)', r: 'Non' },
                  { critere: 'Routing commandes UberEats / Deliveroo', h: 'Oui', r: 'Non' },
                  { critere: 'Fiches techniques avec grammages', h: 'Non', r: 'Oui' },
                  { critere: 'Calcul food cost automatique', h: 'Non', r: 'Oui' },
                  { critere: 'Scanner factures OCR', h: 'Non', r: 'Oui' },
                  { critere: 'Menu engineering (matrice Boston)', h: 'Non', r: 'Oui' },
                  { critere: 'Suivi marge par canal de vente', h: 'Non', r: 'Oui' },
                  { critere: 'Alertes derive prix fournisseur', h: 'Non', r: 'Oui' },
                  { critere: 'Assistant IA integre', h: 'Non', r: 'Oui (19 actions)' },
                  { critere: 'Mode offline / PWA', h: 'Non', r: 'Oui (installable)' },
                  { critere: 'Multi-restaurants', h: 'Oui', r: 'Oui (plan business)' },
                  { critere: 'Support francais', h: 'Oui', r: 'Oui' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'}>
                    <td className="py-3 px-4 font-medium text-[#111111]">{row.critere}</td>
                    <td className="py-3 px-4 text-center">{row.h}</td>
                    <td className="py-3 px-4 text-center bg-teal-50/40 font-medium">{row.r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8 space-y-4">
            <p className="text-[#404040] leading-relaxed">
              Le tableau parle de lui-meme : ce sont deux outils orthogonaux. Sur la moitie des criteres, les deux
              repondent positivement mais pour des raisons differentes (ex : "multi-restaurants"). Sur l'autre moitie,
              chacun excelle dans son domaine et n'empiete pas sur celui de l'autre.
            </p>
            <p className="text-[#404040] leading-relaxed">
              La question n'est donc pas <em>Hubrise OU RestauMargin</em>, mais <em>quel mix pour mon restaurant</em> :
              suis-je un mono-restaurant 100 % sur place qui n'a besoin que de piloter sa marge (RestauMargin seul) ?
              Suis-je un dark kitchen avec 4 marques virtuelles sur UberEats, Deliveroo et JustEat qui a besoin des deux
              (Hubrise + RestauMargin) ? La reponse depend de votre modele.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Cas d'usage ═════════════ */}
        <section id="cas-usage" className="mb-16">
          <SectionHeading icon={<Users className="w-6 h-6" />} number="5">
            Cas d'usage : qui choisir, ou combiner les 2
          </SectionHeading>

          <div className="space-y-6 mt-8">
            <UsecaseCard
              title="Bistrot 100 % sur place, 1 etablissement"
              recommendation="RestauMargin seul"
              detail="Pas de livraison, pas de takeaway via plateformes : Hubrise n'a pas d'usage. RestauMargin couvre l'integralite de votre besoin : fiches techniques, food cost, scanner factures, menu engineering. 29 EUR/mois suffisent largement."
              color="emerald"
            />
            <UsecaseCard
              title="Restaurant traditionnel multi-canaux (sur place + 2 plateformes livraison)"
              recommendation="RestauMargin + Hubrise (ou Deliverect)"
              detail="L'addition tient la route : 29 + 80 EUR = environ 110 EUR/mois pour un setup complet. Hubrise gere la connectivite operationnelle (menus synchros, commandes routees), RestauMargin gere la marge reelle ajustee des commissions plateformes. Combinaison gagnante."
              color="teal"
            />
            <UsecaseCard
              title="Dark kitchen avec 3-5 marques virtuelles"
              recommendation="Hubrise indispensable + RestauMargin critique"
              detail="Sans Hubrise (ou equivalent), votre equipe va passer ses journees a saisir manuellement les commandes entre 4 plateformes. Sans RestauMargin, vous ne saurez jamais quelle marque virtuelle est rentable et laquelle vous fait perdre de l'argent. Les deux sont mandatory."
              color="amber"
            />
            <UsecaseCard
              title="Chaine multi-restaurants (5+ etablissements)"
              recommendation="Hubrise + RestauMargin business + outil BI"
              detail="A cette echelle, il vous faut Hubrise pour normaliser l'operationnel sur tous les sites, RestauMargin pour avoir un pilotage de marge consolide multi-restaurants, et idealement un outil BI (Metabase, Tableau) connecte aux deux pour reporting consolide."
              color="blue"
            />
            <UsecaseCard
              title="Food truck / mono-canal Click&Collect"
              recommendation="RestauMargin + integrateur leger (Sumup, Square)"
              detail="Si vous n'avez qu'un canal de vente (votre propre site Click&Collect ou un POS portable), Hubrise est surdimensionne. RestauMargin couvre la marge, le POS gere les ventes, votre site fait les commandes. Stack minimal et efficace."
              color="emerald"
            />
          </div>

          <Callout type="info">
            <strong>Methode de decision rapide :</strong> Si plus de 30 % de votre chiffre d'affaires passe par
            des plateformes externes (UberEats, Deliveroo, JustEat, Click&Collect via site web), Hubrise se rentabilise
            via le gain de temps operationnel. Si moins de 30 %, l'investissement est discutable. Dans tous les cas,
            RestauMargin se rentabilise des le premier mois via la simple identification des plats en perte.
          </Callout>
        </section>

        {/* ═════════════ SECTION 6 : Couts livraison et commissions ═════════════ */}
        <section id="livraison" className="mb-16">
          <SectionHeading icon={<Truck className="w-6 h-6" />} number="6">
            Couts livraison et commissions : l'impact reel sur votre marge
          </SectionHeading>

          <div className="prose-content space-y-4">
            <p className="text-[#404040] leading-relaxed">
              Voici le sujet que Hubrise ne traitera jamais et qui justifie a lui seul l'usage d'un outil comme
              RestauMargin : <strong>les commissions des plateformes detruisent votre marge a un niveau que vous
              sous-estimez.</strong> Faisons les chiffres ensemble.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#F5F5F5] text-[#111111]">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Canal de vente</th>
                  <th className="text-center py-3 px-4 font-semibold">Commission moyenne</th>
                  <th className="text-center py-3 px-4 font-semibold">Prix vente HT pour 18 EUR TTC</th>
                  <th className="text-center py-3 px-4 font-semibold">Net restaurateur</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Marge brute reelle (FC 30 %)</th>
                </tr>
              </thead>
              <tbody className="text-[#404040]">
                {[
                  { canal: 'Vente sur place', commission: '0 %', ht: '16,36 EUR', net: '16,36 EUR', marge: '10,96 EUR (67 %)' },
                  { canal: 'Click & Collect direct (votre site)', commission: '0-2 % (Stripe)', ht: '16,36 EUR', net: '16,03 EUR', marge: '10,63 EUR (66 %)' },
                  { canal: 'UberEats', commission: '30 %', ht: '16,36 EUR', net: '11,45 EUR', marge: '6,05 EUR (53 %)' },
                  { canal: 'Deliveroo', commission: '30-35 %', ht: '16,36 EUR', net: '10,64 EUR', marge: '5,24 EUR (49 %)' },
                  { canal: 'JustEat', commission: '14-30 %', ht: '16,36 EUR', net: '11,45-14,07 EUR', marge: '6-9 EUR' },
                  { canal: 'UberEats + livraison incluse', commission: '35 %', ht: '16,36 EUR', net: '10,63 EUR', marge: '5,23 EUR (49 %)' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'}>
                    <td className="py-3 px-4 font-medium text-[#111111]">{row.canal}</td>
                    <td className="py-3 px-4 text-center">{row.commission}</td>
                    <td className="py-3 px-4 text-center">{row.ht}</td>
                    <td className="py-3 px-4 text-center font-semibold">{row.net}</td>
                    <td className="py-3 px-4 text-center text-teal-700 font-semibold">{row.marge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8 space-y-4">
            <p className="text-[#404040] leading-relaxed">
              Le constat est brutal : <strong>un plat qui vous rapporte 11 EUR de marge brute sur place ne vous
              rapporte plus que 5-6 EUR via les plateformes</strong>. Cela ne veut pas dire qu'il faut quitter les
              plateformes — elles apportent du volume et de l'acquisition client. Mais cela signifie que vous devez
              piloter ces canaux avec une vision financiere differenciee.
            </p>

            <p className="text-[#404040] leading-relaxed">
              RestauMargin permet exactement cela : pour chaque plat de votre carte, vous voyez la marge brute
              consolidee (toutes ventes confondues) ET la marge brute par canal. Vous decouvrez par exemple que
              votre burger signature est tres rentable sur place (72 % de marge) mais perdant sur Deliveroo
              (38 % apres commission). Decisions possibles : majorer le prix sur Deliveroo de 15 a 20 % (pratique
              autorisee), reduire la portion pour le canal livraison, ou retirer ce plat de la carte digitale.
            </p>

            <p className="text-[#404040] leading-relaxed">
              Hubrise vous permet de mettre a jour rapidement ces prix differencies sur chaque plateforme. RestauMargin
              vous dit lesquels modifier. C'est la combinaison parfaite : un outil pour decider, un outil pour executer.
            </p>

            <Callout type="warning">
              <strong>Piege a eviter :</strong> beaucoup de restaurateurs croient que le service "+10 %" UberEats
              compense la commission. C'est faux. Si vous vendez un plat 20 EUR (au lieu de 18 EUR), UberEats prend
              30 % de 20 EUR = 6 EUR de commission, et non 30 % de 18 EUR. Vous touchez 14 EUR au lieu de 12,60 EUR.
              Le gain net est de 1,40 EUR, pas de 2 EUR comme on pourrait le croire. Surtout, vos clients reguliers
              detectent cette pratique et la sanctionnent.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : Pricing 1 an ═════════════ */}
        <section id="pricing" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="7">
            Pricing 1 an : combien ca coute reellement
          </SectionHeading>

          <div className="prose-content space-y-4">
            <p className="text-[#404040] leading-relaxed">
              Projection annuelle pour les 4 profils types de restaurant. Les chiffres Hubrise sont des estimations
              moyennes : la facture reelle depend de votre nombre d'integrations et de votre volume de commandes,
              et nous recommandons un devis personnalise.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <PricingCard
              title="Bistrot mono-site sur place"
              hubrise="0 EUR (inutile)"
              restaumargin="348 EUR/an (29 EUR/mois)"
              total="348 EUR/an"
              note="RestauMargin seul suffit. Le ROI sur la marge depasse de loin l'investissement."
            />
            <PricingCard
              title="Restaurant multi-canaux"
              hubrise="960 EUR/an (80 EUR/mois)"
              restaumargin="348 EUR/an (29 EUR/mois)"
              total="1 308 EUR/an"
              note="Stack equilibre. Le couple Hubrise + RestauMargin est l'option la plus frequente pour ce profil."
            />
            <PricingCard
              title="Dark kitchen 3-5 marques"
              hubrise="1 800 EUR/an (150 EUR/mois)"
              restaumargin="348 EUR/an (29 EUR/mois)"
              total="2 148 EUR/an"
              note="Indispensable pour piloter le complexe. Le ROI vient du gain de temps + identification marques perdantes."
            />
            <PricingCard
              title="Chaine 5+ etablissements"
              hubrise="3 000+ EUR/an (250 EUR/mois)"
              restaumargin="588 EUR/an (49 EUR/mois business)"
              total="3 588+ EUR/an"
              note="Stack mature. Ajoutez un outil BI (Metabase gratuit) pour les rapports consolides multi-sites."
            />
          </div>

          <div className="prose-content mt-8">
            <p className="text-[#404040] leading-relaxed">
              Sur les 4 profils, RestauMargin represente entre 8 % et 100 % du budget total (selon que Hubrise est
              necessaire ou non). Dans tous les cas, c'est l'investissement le plus rentable : la simple identification
              d'un plat en perte sur la livraison rembourse l'abonnement annuel en quelques semaines.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="12 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions frequentes</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* ═════════════ SECTION CTA ═════════════ */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Testez RestauMargin gratuitement
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Que vous utilisiez Hubrise ou non, le pilotage de marge est indispensable. Decouvrez en 30 minutes
              comment chaque plat de votre carte performe, par canal de vente.
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
                Calculateur food cost gratuit
              </Link>
            </div>
          </div>
        </section>

        {/* ═════════════ Articles complementaires ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/blog/livraison-restaurant-rentabilite"
              className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-[#111111] mb-1.5 group-hover:text-teal-700 transition-colors">
                Livraison restaurant : la rentabilite reelle
              </h3>
              <p className="text-xs text-[#737373]">
                Commissions plateformes, marge differenciee, strategies de pricing.
              </p>
            </Link>
            <Link
              to="/blog/reduire-food-cost"
              className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-[#111111] mb-1.5 group-hover:text-teal-700 transition-colors">
                Reduire le food cost en 10 strategies
              </h3>
              <p className="text-xs text-[#737373]">
                Fiches techniques, negociation, gaspillage, menu engineering.
              </p>
            </Link>
            <Link
              to="/blog/logiciel-gestion-restaurant"
              className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-[#111111] mb-1.5 group-hover:text-teal-700 transition-colors">
                Logiciel de gestion restaurant
              </h3>
              <p className="text-xs text-[#737373]">
                Comparatif des solutions de gestion en 2026, criteres de choix.
              </p>
            </Link>
            <Link
              to="/blog/calcul-marge-restaurant"
              className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-[#111111] mb-1.5 group-hover:text-teal-700 transition-colors">
                Calculer la marge de votre restaurant
              </h3>
              <p className="text-xs text-[#737373]">
                Guide complet : formules, benchmarks, cas pratiques chiffres.
              </p>
            </Link>
          </div>
        </section>

        </article>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-[#F9FAFB] border-t border-[#E5E7EB] py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-[#737373]">
          <Link to="/landing" className="flex items-center justify-center gap-2 text-[#111111] font-bold text-lg mb-4">
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mb-4">La plateforme de gestion de marge pour les restaurateurs.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#9CA3AF]">
            <Link to="/mentions-legales" className="hover:text-teal-600 transition-colors">Mentions legales</Link>
            <Link to="/cgv" className="hover:text-teal-600 transition-colors">CGV</Link>
            <Link to="/cgu" className="hover:text-teal-600 transition-colors">CGU</Link>
            <Link to="/politique-confidentialite" className="hover:text-teal-600 transition-colors">Confidentialite</Link>
          </div>
          <p className="mt-6 text-xs text-[#9CA3AF]">
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
      <h2 className="text-2xl font-bold text-[#111111]">
        <span className="text-teal-600 mr-2">{number}.</span>
        {children}
      </h2>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all">
      <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-[#111111] mb-1.5">{title}</h3>
      <p className="text-sm text-[#404040] leading-relaxed">{desc}</p>
    </div>
  );
}

function UsecaseCard({
  title,
  recommendation,
  detail,
  color,
}: {
  title: string;
  recommendation: string;
  detail: string;
  color: 'emerald' | 'teal' | 'amber' | 'blue';
}) {
  const colors: Record<string, { border: string; badgeBg: string; badgeText: string; iconBg: string; iconText: string }> = {
    emerald: {
      border: 'border-emerald-200',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      iconBg: 'bg-emerald-50',
      iconText: 'text-emerald-700',
    },
    teal: {
      border: 'border-teal-200',
      badgeBg: 'bg-teal-100',
      badgeText: 'text-teal-800',
      iconBg: 'bg-teal-50',
      iconText: 'text-teal-700',
    },
    amber: {
      border: 'border-amber-200',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      iconBg: 'bg-amber-50',
      iconText: 'text-amber-700',
    },
    blue: {
      border: 'border-blue-200',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-800',
      iconBg: 'bg-blue-50',
      iconText: 'text-blue-700',
    },
  };
  const c = colors[color];
  return (
    <div className={`bg-white border ${c.border} rounded-xl p-5 sm:p-6 flex gap-4`}>
      <div className={`w-10 h-10 ${c.iconBg} ${c.iconText} rounded-xl flex items-center justify-center shrink-0`}>
        <Building2 className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-[#111111] mb-2">{title}</h3>
        <div className="mb-3">
          <span className={`inline-block ${c.badgeBg} ${c.badgeText} px-3 py-1 rounded-full text-xs font-bold`}>
            Recommandation : {recommendation}
          </span>
        </div>
        <p className="text-sm text-[#404040] leading-relaxed">{detail}</p>
      </div>
    </div>
  );
}

function PricingCard({
  title,
  hubrise,
  restaumargin,
  total,
  note,
}: {
  title: string;
  hubrise: string;
  restaumargin: string;
  total: string;
  note: string;
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all">
      <h3 className="font-bold text-[#111111] mb-4">{title}</h3>
      <div className="space-y-2 text-sm mb-4">
        <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-2">
          <span className="text-[#737373]">Hubrise</span>
          <span className="font-medium text-[#111111]">{hubrise}</span>
        </div>
        <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-2">
          <span className="text-teal-700">RestauMargin</span>
          <span className="font-medium text-teal-700">{restaumargin}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="font-bold text-[#111111]">Total</span>
          <span className="font-extrabold text-[#111111] text-base">{total}</span>
        </div>
      </div>
      <p className="text-xs text-[#737373] leading-relaxed">{note}</p>
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
    <details className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl group">
      <summary className="px-5 py-4 font-semibold text-[#111111] cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors">
        {q}
        <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-open:rotate-90 transition-transform" />
      </summary>
      <p className="px-5 pb-4 text-sm text-[#404040] leading-relaxed">{a}</p>
    </details>
  );
}
