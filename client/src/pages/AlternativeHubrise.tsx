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
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Alternative a Hubrise — Page comparative SEO
   Mots-cles : alternative hubrise, hubrise vs, integration plateformes livraison
   ~2 800 mots — theme W&B, blanc/noir, focus comparatif et complementarite
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Hubrise et RestauMargin sont-ils en concurrence directe ?",
    answer:
      "Non, ils servent des besoins différents et sont même complémentaires. Hubrise est un hub d'intégrations qui connecte votre caisse à UberEats, Deliveroo, JustEat, Click&Collect, etc. RestauMargin pilote votre food cost, vos fiches techniques et votre marge brute. Un restaurant multi-canaux peut tout à fait utiliser les deux : Hubrise pour la connectivité commandes, RestauMargin pour la rentabilité réelle.",
  },
  {
    question: "Quel est le prix de Hubrise comparé à RestauMargin ?",
    answer:
      "Hubrise se positionne entre 50 EUR et 200 EUR par mois selon le nombre d'intégrations actives et le volume de commandes. RestauMargin est à 19 EUR par mois (offre unique) avec accès complet à la gestion de marge, fiches techniques, scanner de factures, menu engineering et IA. L'investissement n'a pas le même objectif : Hubrise vous fait gagner du temps opérationnel, RestauMargin vous fait gagner de la marge.",
  },
  {
    question: "Puis-je remplacer Hubrise par RestauMargin pour la livraison ?",
    answer:
      "Pas directement. RestauMargin n'est pas un middleware d'intégration de commandes : nous ne synchronisons pas votre menu sur UberEats ou Deliveroo. Notre force est ailleurs : nous intégrons les commissions des plateformes dans votre calcul de marge réel pour vous dire combien chaque plat vendu en livraison rapporte vraiment. Si vous avez besoin de la connectivité opérationnelle, Hubrise reste pertinent.",
  },
  {
    question: "RestauMargin se connecte-t-il à UberEats, Deliveroo ou JustEat ?",
    answer:
      "Nous proposons l'import des rapports financiers UberEats, Deliveroo et JustEat (CSV ou via le scanner OCR de relevés) pour réconcilier vos ventes livraison avec vos marges réelles. Pour la synchronisation en temps réel du menu, nous laissons cela aux spécialistes comme Hubrise, Deliverect ou Otter, qui sont conçus pour ce cas d'usage.",
  },
  {
    question: "Combien coûte une commande UberEats après commissions ?",
    answer:
      "Les plateformes prélèvent généralement 25 à 35 % de commission (parfois plus pour les nouveaux restaurants). Sur un plat vendu 18 EUR TTC, vous touchez en réalité 11 à 12 EUR HT. Si votre food cost est de 30 % (5,40 EUR), votre marge brute réelle tombe à environ 5,60 à 6,60 EUR au lieu de 11 EUR en vente directe. RestauMargin calcule automatiquement cette marge ajustée pour chaque canal.",
  },
  {
    question: "Hubrise gère-t-il le food cost ou les fiches techniques ?",
    answer:
      "Non. Hubrise est un hub d'intégration : il route les commandes, synchronise les menus, met à jour les stocks via API. Il ne gère ni les fiches techniques, ni le calcul du coût matière, ni la marge plat par plat. C'est exactement la lacune que RestauMargin comble. Les deux outils sont donc parfaitement complémentaires dans un stack restaurant moderne.",
  },
  {
    question: "Pour un mono-restaurant qui ne fait pas de livraison, lequel choisir ?",
    answer:
      "Si vous ne faites ni livraison ni click&collect ni vente sur les marketplaces, Hubrise n'a pas grand intérêt pour vous. RestauMargin reste pertinent : même sans livraison, vous avez besoin de calculer vos marges, gérer vos fiches techniques, scanner vos factures fournisseurs et optimiser votre carte. Notre essai gratuit 7 jours sans CB vous permet de tester sans risque.",
  },
  {
    question: "Quelles plateformes Hubrise intègre-t-il ?",
    answer:
      "Hubrise se connecte à un large écosystème : UberEats, Deliveroo, JustEat, Stuart, Yper pour la livraison ; Lightspeed, Tiller, Cashpad, Sumup, JDC pour la caisse ; Square, Wix, Shopify pour les sites web ; ainsi que de nombreux outils métiers (KDS, fidélité, paiement). C'est son point fort : la profondeur du catalogue d'intégrations.",
  },
  {
    question: "Quelle est la durée d'implementation de chaque outil ?",
    answer:
      "Hubrise demande généralement 1 à 4 semaines selon le nombre d'intégrations à paramétrer (mapping menus, tests commandes, formation équipe). RestauMargin est opérationnel en 30 minutes : créez un compte, importez vos premières recettes, le calcul de marge se fait automatiquement. C'est volontaire : nous voulons que la prise en main soit immédiate.",
  },
  {
    question: "Y a-t-il un engagement avec RestauMargin ?",
    answer:
      "Aucun. RestauMargin est sans engagement, sans carte bancaire requise pour l'essai 7 jours, et vous pouvez résilier en un clic depuis votre espace abonnement. C'est une différence notable avec certains hubs d'intégration qui demandent souvent un engagement annuel ou des frais de setup. 19 EUR/mois flat, sans surprise.",
  },
];

export default function AlternativeHubrise() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Alternative Hubrise | RestauMargin food cost | Comparatif 2026"
        description="Hubrise = hub d'intégrations livraison (UberEats, Deliveroo). RestauMargin = pilotage de marge (food cost, fiches techniques). Comparatif complet 2026, prix, cas d'usage et complémentarité."
        path="/alternative-hubrise"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Comparatifs', url: 'https://www.restaumargin.fr/' },
            { name: 'Alternative à Hubrise', url: 'https://www.restaumargin.fr/alternative-hubrise' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Alternative à Hubrise : RestauMargin pour la gestion de marge',
            description:
              "Comparatif Hubrise vs RestauMargin : positionnement, prix, fonctionnalités, cas d'usage et complémentarité pour les restaurants modernes.",
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
      <PublicHeader />

      {/* ── Breadcrumbs visibles ── */}
      <div className="bg-[#F5F5F5] border-b border-[#E5E7EB] py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-[#737373] flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <span className="hover:text-teal-600">Comparatifs</span>
          <span>/</span>
          <span className="text-[#111111] font-medium">Alternative à Hubrise</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Comparatif"
        readTime="12 min"
        date="Mai 2026"
        title="Alternative à Hubrise : RestauMargin pour la gestion de marge"
        accentWord="marge"
        subtitle="Hubrise connecte vos plateformes de livraison. RestauMargin pilote votre rentabilité réelle. Découvrez les différences, les complémentarités, les prix et le bon choix pour votre restaurant en 2026."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-05-26" readTime="12 min" variant="header" />

        {/* ── Resume executif ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">
              Résumé en 30 secondes
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Hubrise vs RestauMargin : le verdict rapide
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold flex-shrink-0">1.</span>
              <span>
                <strong className="text-white">Hubrise</strong> = hub d'intégration (caisse, UberEats,
                Deliveroo, JustEat, KDS, site web). Connecte tout, ne calcule rien.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold flex-shrink-0">2.</span>
              <span>
                <strong className="text-white">RestauMargin</strong> = pilote de marge (food cost,
                fiches techniques, scanner factures, menu engineering). Calcule la rentabilité réelle.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold flex-shrink-0">3.</span>
              <span>
                <strong className="text-white">Complémentaires</strong>, pas concurrents. Un
                restaurant multi-canaux peut utiliser les deux : Hubrise pour l'opérationnel, RestauMargin pour la marge.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold flex-shrink-0">4.</span>
              <span>
                <strong className="text-white">Prix</strong> : Hubrise 50 à 200 EUR/mois (selon intégrations).
                RestauMargin 19 EUR/mois flat.
              </span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Vous ne faites pas de livraison ? Hubrise n'est pas pour vous. Vous voulez connaître la
            marge réelle de chaque plat vendu sur chaque canal ? RestauMargin est indispensable.
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
              { href: '#positionnement', label: "Positionnement : pourquoi ces 2 outils ne font pas la même chose" },
              { href: '#hubrise', label: "Hubrise en détail : ce qu'il fait (et ce qu'il ne fait pas)" },
              { href: '#restaumargin', label: 'RestauMargin en détail : pilote de marge restaurant' },
              { href: '#comparatif', label: 'Tableau comparatif : 15 critères face-à-face' },
              { href: '#cas-usage', label: 'Cas d\'usage : qui choisir, ou combiner les 2' },
              { href: '#livraison', label: "Coûts livraison et commissions : l'impact réel sur votre marge" },
              { href: '#pricing', label: 'Pricing 1 an : combien ça coûte réellement' },
              { href: '#faq', label: 'Questions fréquentes' },
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
            Positionnement : pourquoi ces 2 outils ne font pas la même chose
          </SectionHeading>

          <div className="prose-content space-y-4">
            <p className="text-[#404040] leading-relaxed">
              Avant de comparer les fonctionnalités, il faut comprendre que Hubrise et RestauMargin appartiennent
              a deux familles d'outils complètement différentes. Les confondre, c'est se priver de la valeur de
              chacun. Voici le découpage de l'écosystème tech restauration en 2026.
            </p>

            <p className="text-[#404040] leading-relaxed">
              D'un côté, vous avez les <strong>hubs d'intégration</strong> (Hubrise, Deliverect, Otter, Cuboh).
              Leur job : rendre vos différents canaux de vente compatibles entre eux. Vous mettez à jour un plat
              dans votre caisse Lightspeed ? Le menu UberEats, Deliveroo, JustEat et votre site web se mettent
              automatiquement à jour. Vous recevez une commande UberEats ? Elle arrive directement dans votre caisse
              et votre KDS, sans ressaisie. Sans ce middleware, votre équipe passe son temps à faire du copier-coller
              entre plateformes — et à faire des erreurs.
            </p>

            <p className="text-[#404040] leading-relaxed">
              De l'autre côté, vous avez les <strong>pilotes de marge</strong> (RestauMargin, MarginEdge aux US,
              certains modules Cegid Restauration). Leur job : transformer vos données brutes (factures fournisseurs,
              ventes par plat, fiches techniques) en décisions actionnables : ce plat vous fait perdre de l'argent
              en livraison, ce fournisseur a augmenté ses prix sans vous prévenir, votre food cost a dérivé de 3 points
              depuis le mois dernier. Sans cet outil, vous pilotez à l'aveugle.
            </p>

            <Callout type="info">
              <strong>L'analogie qui clarifie tout :</strong> Hubrise est à votre restaurant ce que Zapier est à un
              SaaS — un connecteur qui fait parler vos outils entre eux. RestauMargin est ce que serait Stripe Radar
              pour la marge — une intelligence qui analyse vos flux financiers pour vous protéger des fuites.
            </Callout>

            <p className="text-[#404040] leading-relaxed">
              Beaucoup de restaurateurs cherchent une "alternative à Hubrise" en pensant qu'un seul outil va tout faire.
              La réalité du marché 2026 est plus nuancée : aucun outil généraliste ne fait correctement les deux jobs.
              Les hubs sont conçus pour la connectivité (et c'est très complexe : chaque plateforme a sa propre API,
              ses propres mises à jour, ses propres bugs). Les pilotes de marge sont conçus pour la finance opérationnelle
              (calcul de coût matière, scoring, alertes). Mieux vaut deux excellents outils spécialisés qu'un outil
              moyen sur les deux fronts.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Hubrise en detail ═════════════ */}
        <section id="hubrise" className="mb-16">
          <SectionHeading icon={<Plug className="w-6 h-6" />} number="2">
            Hubrise en détail : ce qu'il fait (et ce qu'il ne fait pas)
          </SectionHeading>

          <div className="prose-content space-y-4">
            <p className="text-[#404040] leading-relaxed">
              Hubrise est une startup française (basée à Lille) fondée en 2017, qui s'est positionnée très tôt sur
              le créneau du middleware pour la restauration. Aujourd'hui, c'est l'un des hubs les plus reconnus en
              France, avec un catalogue d'intégrations particulièrement profond côté francophone.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Ce que Hubrise fait très bien</h3>
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
                  Connexion à un large écosystème : Lightspeed, Tiller, Cashpad, Sumup, JDC
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">+</span>
                  Stock partagé entre tous les canaux (rupture instantanée)
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
                  Fiches techniques avec grammages et coûts ingrédients
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">-</span>
                  Scanner de factures fournisseurs avec OCR
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">-</span>
                  Menu engineering (matrice popularité x marge)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">-</span>
                  Alertes de dérive de prix fournisseurs
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
              Le modèle économique Hubrise est basé sur le volume : plus vous avez d'intégrations actives et plus
              vos commandes mensuelles sont nombreuses, plus la facture monte. En entrée de gamme, comptez 50 EUR
              par mois pour un setup minimal (caisse + 1 plateforme). Pour un restaurant multi-canaux mature
              (caisse + 3 plateformes livraison + site web Click & Collect + KDS), la facture peut grimper à
              150-200 EUR par mois, parfois davantage selon les volumes.
            </p>

            <p className="text-[#404040] leading-relaxed">
              Le ROI est évident pour qui souffrait de double saisie : moins d'erreurs de commande, plus de temps
              en cuisine, menus toujours à jour. En revanche, Hubrise ne vous dira jamais qu'un plat vendu en
              livraison vous fait perdre 3 EUR à cause des commissions UberEats. Cette analyse, c'est le job de RestauMargin.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : RestauMargin en detail ═════════════ */}
        <section id="restaumargin" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="3">
            RestauMargin en détail : pilote de marge restaurant
          </SectionHeading>

          <div className="prose-content space-y-4">
            <p className="text-[#404040] leading-relaxed">
              RestauMargin est né d'un constat simple : la grande majorité des outils de gestion restaurant
              s'arrêtent au pointage des commandes et à la sortie de caisse, sans jamais répondre à la question
              vitale : <em>est-ce que ce plat me rapporte vraiment de l'argent, sur ce canal de vente, ce mois-ci ?</em>
            </p>

            <p className="text-[#404040] leading-relaxed">
              Notre positionnement est clair : <strong>nous sommes le pilote de marge, pas le hub d'intégration</strong>.
              Nous nous concentrons sur la partie financière et opérationnelle qui transforme un restaurant qui survit
              en un restaurant qui prospère. La connectivité opérationnelle, nous la laissons aux spécialistes
              comme Hubrise — et nous nous interface avec eux quand c'est pertinent.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <FeatureCard
              icon={<Calculator className="w-5 h-5" />}
              title="Fiches techniques précises"
              desc="Saisissez les grammages exacts de chaque ingrédient. Le food cost et la marge brute se calculent automatiquement avec les prix fournisseurs en temps réel."
            />
            <FeatureCard
              icon={<Receipt className="w-5 h-5" />}
              title="Scanner de factures OCR"
              desc="Photographiez vos factures fournisseurs. Les prix sont extraits automatiquement et vos fiches techniques mises à jour. Plus de saisie manuelle."
            />
            <FeatureCard
              icon={<TrendingUp className="w-5 h-5" />}
              title="Suivi marge en temps réel"
              desc="Visualisez marge brute, food cost et marge nette au jour le jour, par plat, par catégorie, par canal de vente (sur place, livraison, takeaway)."
            />
            <FeatureCard
              icon={<Target className="w-5 h-5" />}
              title="Menu engineering"
              desc="Matrice Boston (popularité x rentabilité). Identifiez vos stars, chevaux de labour, énigmes et poids morts pour optimiser votre carte."
            />
            <FeatureCard
              icon={<AlertTriangle className="w-5 h-5" />}
              title="Alertes dérive"
              desc="Recevez une notification quand un prix fournisseur augmente, quand un food cost dépasse votre seuil, ou quand un plat passe en perte sur un canal."
            />
            <FeatureCard
              icon={<Sparkles className="w-5 h-5" />}
              title="Assistant IA intégré"
              desc="19 actions IA : suggestions de recettes, optimisation marges, détection d'anomalies, analyse des dérives de prix, commande vocale, génération de fiches."
            />
          </div>

          <div className="prose-content mt-8">
            <p className="text-[#404040] leading-relaxed">
              Le tarif est volontairement simple : 19 EUR par mois flat, une seule offre, essai gratuit 7 jours sans carte bancaire,
              résiliation en 1 clic. Pas de paliers compliqués par volume de commandes, pas de surfacturation par
              intégration ajoutée. C'est le compromis que nous avons fait : un produit puissant, un tarif lisible.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 4 : Tableau comparatif ═════════════ */}
        <section id="comparatif" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="4">
            Tableau comparatif : 15 critères face-à-face
          </SectionHeading>

          <div className="prose-content">
            <p className="text-[#404040] leading-relaxed">
              Comparaison objective Hubrise vs RestauMargin sur les critères qui comptent pour un restaurateur en 2026.
              Tout est public et vérifiable sur les sites respectifs.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#F5F5F5] text-[#111111]">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Critère</th>
                  <th className="text-center py-3 px-4 font-semibold">Hubrise</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl bg-teal-50 text-teal-900">
                    RestauMargin
                  </th>
                </tr>
              </thead>
              <tbody className="text-[#404040]">
                {[
                  { critere: 'Catégorie outil', h: 'Hub d\'intégration', r: 'Pilote de marge' },
                  { critere: 'Prix entrée de gamme', h: '50 EUR/mois', r: '19 EUR/mois' },
                  { critere: 'Prix haut de gamme', h: '150-200 EUR/mois', r: '19 EUR/mois (flat)' },
                  { critere: 'Engagement', h: 'Souvent annuel', r: 'Aucun, résiliable 1 clic' },
                  { critere: 'Essai gratuit', h: 'Démo commerciale', r: '7 jours sans CB' },
                  { critere: 'Temps mise en place', h: '1 à 4 semaines', r: '30 minutes' },
                  { critere: 'Synchro menus livraison', h: 'Oui (forte)', r: 'Non' },
                  { critere: 'Routing commandes UberEats / Deliveroo', h: 'Oui', r: 'Non' },
                  { critere: 'Fiches techniques avec grammages', h: 'Non', r: 'Oui' },
                  { critere: 'Calcul food cost automatique', h: 'Non', r: 'Oui' },
                  { critere: 'Scanner factures OCR', h: 'Non', r: 'Oui' },
                  { critere: 'Menu engineering (matrice Boston)', h: 'Non', r: 'Oui' },
                  { critere: 'Suivi marge par canal de vente', h: 'Non', r: 'Oui' },
                  { critere: 'Alertes dérive prix fournisseur', h: 'Non', r: 'Oui' },
                  { critere: 'Assistant IA intégré', h: 'Non', r: 'Oui (19 actions)' },
                  { critere: 'Mode offline / PWA', h: 'Non', r: 'Oui (installable)' },
                  { critere: 'Multi-restaurants', h: 'Oui', r: 'Oui (plan business)' },
                  { critere: 'Support français', h: 'Oui', r: 'Oui' },
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
              Le tableau parle de lui-même : ce sont deux outils orthogonaux. Sur la moitié des critères, les deux
              répondent positivement mais pour des raisons différentes (ex : "multi-restaurants"). Sur l'autre moitié,
              chacun excelle dans son domaine et n'empiète pas sur celui de l'autre.
            </p>
            <p className="text-[#404040] leading-relaxed">
              La question n'est donc pas <em>Hubrise OU RestauMargin</em>, mais <em>quel mix pour mon restaurant</em> :
              suis-je un mono-restaurant 100 % sur place qui n'a besoin que de piloter sa marge (RestauMargin seul) ?
              Suis-je un dark kitchen avec 4 marques virtuelles sur UberEats, Deliveroo et JustEat qui a besoin des deux
              (Hubrise + RestauMargin) ? La réponse dépend de votre modèle.
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
              title="Bistrot 100 % sur place, 1 établissement"
              recommendation="RestauMargin seul"
              detail="Pas de livraison, pas de takeaway via plateformes : Hubrise n'a pas d'usage. RestauMargin couvre l'intégralité de votre besoin : fiches techniques, food cost, scanner factures, menu engineering. 19 EUR/mois suffisent largement."
              color="emerald"
            />
            <UsecaseCard
              title="Restaurant traditionnel multi-canaux (sur place + 2 plateformes livraison)"
              recommendation="RestauMargin + Hubrise (ou Deliverect)"
              detail="L'addition tient la route : 19 + 80 EUR = environ 100 EUR/mois pour un setup complet. Hubrise gère la connectivité opérationnelle (menus synchros, commandes routées), RestauMargin gère la marge réelle ajustée des commissions plateformes. Combinaison gagnante."
              color="teal"
            />
            <UsecaseCard
              title="Dark kitchen avec 3-5 marques virtuelles"
              recommendation="Hubrise indispensable + RestauMargin critique"
              detail="Sans Hubrise (ou équivalent), votre équipe va passer ses journées à saisir manuellement les commandes entre 4 plateformes. Sans RestauMargin, vous ne saurez jamais quelle marque virtuelle est rentable et laquelle vous fait perdre de l'argent. Les deux sont mandatory."
              color="amber"
            />
            <UsecaseCard
              title="Chaîne multi-restaurants (des établissements)"
              recommendation="Hubrise + RestauMargin business + outil BI"
              detail="À cette échelle, il vous faut Hubrise pour normaliser l'opérationnel sur tous les sites, RestauMargin pour avoir un pilotage de marge consolidé multi-restaurants, et idéalement un outil BI (Metabase, Tableau) connecté aux deux pour reporting consolidé."
              color="blue"
            />
            <UsecaseCard
              title="Food truck / mono-canal Click&Collect"
              recommendation="RestauMargin + intégrateur léger (Sumup, Square)"
              detail="Si vous n'avez qu'un canal de vente (votre propre site Click&Collect ou un POS portable), Hubrise est surdimensionné. RestauMargin couvre la marge, le POS gère les ventes, votre site fait les commandes. Stack minimal et efficace."
              color="emerald"
            />
          </div>

          <Callout type="info">
            <strong>Méthode de décision rapide :</strong> Si plus de 30 % de votre chiffre d'affaires passe par
            des plateformes externes (UberEats, Deliveroo, JustEat, Click&Collect via site web), Hubrise se rentabilise
            via le gain de temps opérationnel. Si moins de 30 %, l'investissement est discutable. Dans tous les cas,
            RestauMargin peut se rentabiliser rapidement via la simple identification des plats en perte.
          </Callout>
        </section>

        {/* ═════════════ SECTION 6 : Couts livraison et commissions ═════════════ */}
        <section id="livraison" className="mb-16">
          <SectionHeading icon={<Truck className="w-6 h-6" />} number="6">
            Coûts livraison et commissions : l'impact réel sur votre marge
          </SectionHeading>

          <div className="prose-content space-y-4">
            <p className="text-[#404040] leading-relaxed">
              Voici le sujet que Hubrise ne traitera jamais et qui justifie à lui seul l'usage d'un outil comme
              RestauMargin : <strong>les commissions des plateformes détruisent votre marge à un niveau que vous
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
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Marge brute réelle (FC 30 %)</th>
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
              piloter ces canaux avec une vision financière différenciée.
            </p>

            <p className="text-[#404040] leading-relaxed">
              RestauMargin permet exactement cela : pour chaque plat de votre carte, vous voyez la marge brute
              consolidée (toutes ventes confondues) ET la marge brute par canal. Vous découvrez par exemple que
              votre burger signature est très rentable sur place (72 % de marge) mais perdant sur Deliveroo
              (38 % après commission). Décisions possibles : majorer le prix sur Deliveroo de 15 à 20 % (pratique
              autorisée), réduire la portion pour le canal livraison, ou retirer ce plat de la carte digitale.
            </p>

            <p className="text-[#404040] leading-relaxed">
              Hubrise vous permet de mettre à jour rapidement ces prix différenciés sur chaque plateforme. RestauMargin
              vous dit lesquels modifier. C'est la combinaison parfaite : un outil pour décider, un outil pour exécuter.
            </p>

            <Callout type="warning">
              <strong>Piège à éviter :</strong> beaucoup de restaurateurs croient que le service "+10 %" UberEats
              compense la commission. C'est faux. Si vous vendez un plat 20 EUR (au lieu de 18 EUR), UberEats prend
              30 % de 20 EUR = 6 EUR de commission, et non 30 % de 18 EUR. Vous touchez 14 EUR au lieu de 12,60 EUR.
              Le gain net est de 1,40 EUR, pas de 2 EUR comme on pourrait le croire. Surtout, vos clients réguliers
              détectent cette pratique et la sanctionnent.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : Pricing 1 an ═════════════ */}
        <section id="pricing" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="7">
            Pricing 1 an : combien ça coûte réellement
          </SectionHeading>

          <div className="prose-content space-y-4">
            <p className="text-[#404040] leading-relaxed">
              Projection annuelle pour les 4 profils types de restaurant. Les chiffres Hubrise sont des estimations
              moyennes : la facture réelle dépend de votre nombre d'intégrations et de votre volume de commandes,
              et nous recommandons un devis personnalisé.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <PricingCard
              title="Bistrot mono-site sur place"
              hubrise="0 EUR (inutile)"
              restaumargin="228 EUR/an (19 EUR/mois)"
              total="228 EUR/an"
              note="RestauMargin seul suffit. Le ROI sur la marge dépasse de loin l'investissement."
            />
            <PricingCard
              title="Restaurant multi-canaux"
              hubrise="960 EUR/an (80 EUR/mois)"
              restaumargin="228 EUR/an (19 EUR/mois)"
              total="1 188 EUR/an"
              note="Stack équilibré. Le couple Hubrise + RestauMargin couvre les deux besoins de ce profil."
            />
            <PricingCard
              title="Dark kitchen 3-5 marques"
              hubrise="1 800 EUR/an (150 EUR/mois)"
              restaumargin="228 EUR/an (19 EUR/mois)"
              total="2 028 EUR/an"
              note="Indispensable pour piloter le complexe. Le ROI vient du gain de temps + identification marques perdantes."
            />
            <PricingCard
              title="Chaîne des établissements"
              hubrise="3 000+ EUR/an (250 EUR/mois)"
              restaumargin="228 EUR/an (19 EUR/mois, multi-sites inclus)"
              total="3 228+ EUR/an"
              note="Stack mature. Ajoutez un outil BI (Metabase gratuit) pour les rapports consolidés multi-sites."
            />
          </div>

          <div className="prose-content mt-8">
            <p className="text-[#404040] leading-relaxed">
              Sur les 4 profils, RestauMargin représente entre 8 % et 100 % du budget total (selon que Hubrise est
              nécessaire ou non). Dans tous les cas, c'est l'investissement le plus rentable : la simple identification
              d'un plat en perte sur la livraison rembourse l'abonnement annuel en quelques semaines.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="12 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
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
              Que vous utilisiez Hubrise ou non, le pilotage de marge est indispensable. Découvrez en 30 minutes
              comment chaque plat de votre carte performe, par canal de vente.
            </p>
            <p className="text-teal-50 text-base max-w-xl mx-auto mb-8">
              <strong>19 EUR/mois</strong> &mdash; essai gratuit 7 jours, sans engagement, sans carte bancaire.
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
                Livraison restaurant : la rentabilité réelle
              </h3>
              <p className="text-xs text-[#737373]">
                Commissions plateformes, marge différenciée, stratégies de pricing.
              </p>
            </Link>
            <Link
              to="/blog/reduire-food-cost"
              className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-[#111111] mb-1.5 group-hover:text-teal-700 transition-colors">
                Réduire le food cost en 10 stratégies
              </h3>
              <p className="text-xs text-[#737373]">
                Fiches techniques, négociation, gaspillage, menu engineering.
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
                Comparatif des solutions de gestion en 2026, critères de choix.
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
                Guide complet : formules, benchmarks, cas pratiques chiffrés.
              </p>
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
