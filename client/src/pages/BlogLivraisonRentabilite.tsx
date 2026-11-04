import { Link } from 'react-router-dom';
import {
  ChefHat,
  Calculator,
  ArrowRight,
  BookOpen,
  Truck,
  Euro,
  AlertTriangle,
  Zap,
  Percent,
  Award,
  ListChecks,
  Lightbulb,
  Package,
  Store,
  ShoppingBag,
  BarChart3,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Rentabilite livraison restaurant : commissions, marges, dark kitchen"
   Mots-cles principaux : rentabilite livraison restaurant, commissions uber eats deliveroo,
   marge plateforme livraison, click and collect rentabilite, delivery only restaurant
   ~3 200 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Quelle est la commission moyenne d'Uber Eats en 2026 ?",
    answer: "Uber Eats applique une commission marketplace standard de 28 à 30 % HT en 2026, plus 2 EUR de frais de livraison facturés au client. En mode Self-Delivery (vous livrez vous-même), la commission tombe à 13-15 %. Les commissions sont négociables après 6 mois d'ancienneté et selon le volume mensuel.",
  },
  {
    question: "Quelle est la commission de Deliveroo en 2026 ?",
    answer: "Deliveroo facture entre 25 et 32 % de commission HT selon la zone et le type de restaurant. La formule Deliveroo Plus (visibilité premium) ajoute 3 à 5 points. Les zones tendues (Paris intramuros, grandes métropoles) sont au plafond, la province négocie plus facilement.",
  },
  {
    question: "Peut-on appliquer un prix livraison différent du prix salle ?",
    answer: "Oui, c'est même recommandé. Les CGV des plateformes l'autorisent depuis 2022 (assouplissement post-Covid). Majoration recommandée : +8 à +15 % sur les prix livraison pour absorber la commission sans tuer la marge. Cette pratique est légale et largement utilisée.",
  },
  {
    question: "Le click and collect est-il vraiment rentable ?",
    answer: "Le click and collect a une rentabilité imbattable : 0 % de commission (vous gérez tout), zéro frais livreur, le client vient chercher la commande. La marge nette est identique à celle de la salle, avec en plus un gain de temps service. Investissement initial : un site web (30-100 EUR/mois) et une signalétique en salle.",
  },
  {
    question: "Combien coûte un site web de commande directe ?",
    answer: "Entre 30 et 100 EUR par mois selon la solution. Wix Restaurants : 35 EUR/mois. Square Online : 0 EUR + 2,9 % par transaction. Zelty : 60 EUR/mois. Custom (Shopify Food, Lightspeed) : 80-150 EUR/mois. Pour un développement sur-mesure : 200-500 EUR/mois. ROI rapide dès 100 commandes directes mensuelles.",
  },
  {
    question: "La TVA livraison est-elle la même que sur place ?",
    answer: "Oui pour les plats : 10 % en France. La TVA réduite à 5,5 % s'applique uniquement aux produits non transformés (eau, bouteille de vin scellée non consommée sur place). L'alcool en livraison est à 20 % (comme en vente à emporter). À noter : la TVA s'applique sur le prix de vente final, commission plateforme incluse.",
  },
  {
    question: "Qu'est-ce qu'une dark kitchen et est-ce rentable ?",
    answer: "Une dark kitchen (cuisine fantôme) est une cuisine sans salle de restaurant, dédiée à la livraison uniquement. Loyer réduit (1 500-3 000 EUR/mois vs 8 000-15 000 EUR pour un restaurant), pas de personnel salle, focus 100 % production. Rentable si volume supérieur à 150 commandes/jour avec ticket moyen > 18 EUR. Risque : dépendance totale aux plateformes.",
  },
  {
    question: "Quels emballages choisir pour la livraison ?",
    answer: "Privilégier le carton kraft compostable (loi AGEC 2026 interdit le plastique à usage unique), prévoir des compartiments séparés (frites séparées du burger pour ne pas ramollir), tester en livraison réelle (parcours 25 min) avant de commander en gros. Coût moyen emballage : 0,80 à 1,50 EUR par commande. Répercuter dans le prix livraison.",
  },
  {
    question: "Comment négocier sa commission Uber Eats ou Deliveroo ?",
    answer: "Trois leviers : (1) ancienneté (après 6 mois, demander un point en moins), (2) volume (plus de 200 commandes/mois ouvre des paliers), (3) exclusivité plateforme (interdire la concurrence en échange de 2-3 points). Conseil : ne jamais signer une exclusivité. Garder au moins 2 plateformes + canal direct pour rester en position de force.",
  },
  {
    question: "Quels plats voyagent bien en livraison ?",
    answer: "Burgers (tenue 30 min), bowls, plats en sauce (curry, mijotés), pâtes non al-denté, pizzas (à livrer en moins de 20 min), salades (sauce à part), desserts froids. À éviter absolument : tartare, carpaccio, poisson grillé minute, soufflés, frites après 15 min, glaces sans pochette isotherme. Adapter la carte est clé pour préserver la qualité et le taux de re-commande.",
  },
];

export default function BlogLivraisonRentabilite() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Rentabilité livraison restaurant : commissions, marges, dark kitchen 2026"
        description="Uber Eats 28-30 %, Deliveroo 25-32 %, JustEat 14-30 % : calculs de marge réels par plateforme, stratégies anti-commission, click and collect, dark kitchen, prix différenciés. Guide chiffré 2026."
        path="/blog/livraison-restaurant-rentabilite"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Livraison restaurant rentabilité', url: 'https://www.restaumargin.fr/blog/livraison-restaurant-rentabilite' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Comment calculer le ROI réel de la livraison restaurant en 5 étapes',
            description: 'Méthode pas-à-pas pour évaluer la rentabilité d\'un canal livraison (Uber Eats, Deliveroo, click and collect, dark kitchen).',
            totalTime: 'PT20M',
            tool: ['Calculatrice', 'Tableur ou logiciel RestauMargin', 'Relevés plateformes'],
            step: [
              { '@type': 'HowToStep', name: 'Lister les revenus bruts par plateforme', text: 'Récupérez le CA HT mensuel par canal (Uber Eats, Deliveroo, JustEat, click and collect, propre site). Toujours raisonner en HT, jamais TTC.' },
              { '@type': 'HowToStep', name: 'Déduire les commissions réelles', text: 'Appliquez le taux de commission de chaque plateforme (25-32 %), ajoutez les frais fixes (abonnement, visibilité premium). Vous obtenez le revenu net plateforme.' },
              { '@type': 'HowToStep', name: 'Calculer les coûts directs livraison', text: 'Food cost (32 % en moyenne), main d\'oeuvre cuisine (8 min × taux horaire), packaging (0,80-1,50 EUR), commission bancaire (1,2-1,8 %), pertes et erreurs (3-5 %).' },
              { '@type': 'HowToStep', name: 'Déterminer la marge nette par plateforme', text: 'Marge nette = Revenu net - Coûts directs. Comparez ce ratio entre plateformes pour identifier les canaux rentables et ceux qui vous coûtent de l\'argent.' },
              { '@type': 'HowToStep', name: 'Ajuster stratégie et carte', text: 'Si une plateforme a une marge nette inférieure à 8 %, soit vous renégociez la commission, soit vous majorez les prix de 10-15 %, soit vous quittez le canal. Ne gardez que les canaux rentables.' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Rentabilité livraison restaurant : commissions, marges, dark kitchen en 2026',
            description: 'Guide complet 2026 sur la rentabilité de la livraison restaurant : commissions plateformes, calcul marge réelle, stratégies anti-commission, dark kitchen, click and collect.',
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-05-05',
            dateModified: '2026-05-26',
            wordCount: 3200,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/livraison-restaurant-rentabilite' },
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
          <span className="text-mono-100 font-medium">Rentabilité livraison restaurant</span>
        </div>
      </div>

      <BlogArticleHero
        category="Stratégie"
        readTime="15 min"
        date="Mai 2026"
        title="Rentabilité livraison restaurant : commissions, marges, dark kitchen en 2026"
        accentWord="Rentabilité"
        subtitle="Commissions Uber Eats 28-30 %, Deliveroo 25-32 %, JustEat 14-30 % : la lecture comptable rigoureuse pour transformer la livraison en canal rentable, pas en piège à marge."
      />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-05-05" readTime="15 min" variant="header" />

        {/* ── Encadre formule rapide (featured snippet) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Formule rapide rentabilité livraison</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">La formule essentielle à retenir</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Revenu net plateforme</strong> = Prix vente HT - Commission (25-32 %)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Coûts directs livraison</strong> = Food cost + MO cuisine + Packaging + CB + Pertes</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Marge nette livraison</strong> = Revenu net - Coûts directs</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Seuil de rentabilité</strong> : marge nette &ge; 8 % sinon le canal vous coûte</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Objectif standard : marge nette livraison &ge; 10 %. En dessous de 5 %, vous travaillez à perte une fois les imprévus intégrés.
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
              { href: '#enjeu', label: 'Pourquoi la livraison est un piège à marge sans méthode' },
              { href: '#commissions', label: 'Commissions 2026 : tableau comparatif des plateformes' },
              { href: '#calcul', label: 'Calcul de marge réelle : exemple chiffré plat 15 EUR' },
              { href: '#howto', label: 'Comment calculer le ROI livraison en 5 étapes' },
              { href: '#strat-prix', label: 'Stratégie 1 : prix différenciés plateformes vs salle' },
              { href: '#strat-menu', label: 'Stratégie 2 : menu spécifique livraison (plats qui voyagent)' },
              { href: '#strat-cc', label: 'Stratégie 3 : click and collect, le canal à 0 % commission' },
              { href: '#strat-logistique', label: 'Stratégie 4 : logistique propre (scooter, robot, Stuart)' },
              { href: '#strat-nego', label: 'Stratégie 5 : négocier les commissions plateformes' },
              { href: '#couts-caches', label: 'Les 7 coûts cachés que personne ne compte' },
              { href: '#dark-kitchen', label: 'Dark kitchen et delivery only : pour qui, pour quoi ?' },
              { href: '#scenarios', label: 'Scénarios comparatifs : 3 modèles testés' },
              { href: '#faq', label: 'Questions fréquentes' },
              { href: '#cta', label: 'Piloter votre marge livraison avec RestauMargin' },
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

        {/* ═════════════ SECTION 1 : Enjeu ═════════════ */}
        <section id="enjeu" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="1">
            Pourquoi la livraison est un piège à marge sans méthode
          </SectionHeading>

          <div className="prose-content">
            <p>
              La livraison a été vendue comme la planche de salut des restaurateurs pendant le Covid. Cinq ans
              plus tard, beaucoup déchantent : commissions à 30 %, plats abîmés à l'arrivée, notes 1 étoile sur
              les plateformes, équipes saturées à 13 h sans un client en salle. Pourtant, des établissements
              continuent à rentabiliser ce canal et le transforment même en moteur de croissance. La différence ?
              Une <strong>lecture comptable rigoureuse</strong> plutôt qu'une posture émotionnelle.
            </p>
            <p>
              Le malentendu de base : quand un restaurateur regarde son chiffre d'affaires livraison de
              50 000 EUR/mois, il pense "j'ai 50 000 EUR de plus dans le tiroir-caisse". En réalité, Uber Eats
              ou Deliveroo prennent 25 à 32 % de commission. Sur ces 50 000 EUR, 15 000 EUR partent direct chez
              la plateforme. Reste 35 000 EUR. Après food cost (32 %), main d'oeuvre cuisine, packaging et
              commission bancaire, la marge nette tombe à 2-5 %, parfois négative.
            </p>
            <p>
              En 2026, le contexte est encore plus tendu. Les commissions plateformes ne baissent pas, les coûts
              matières ont augmenté de 20 % sur trois ans, le SMIC a été revalorisé quatre fois, le packaging
              écoresponsable (loi AGEC) coûte 30-40 % plus cher que le plastique. Faire de la livraison sans
              calcul précis équivaut à brader sa marge brute en payant pour avoir le droit de travailler.
            </p>

            <Callout type="warning">
              <strong>Le saviez-vous ?</strong> Selon une étude GIRA Conseil de janvier 2026, 47 % des
              restaurants traditionnels qui ont intégré Uber Eats ou Deliveroo déclarent une <strong>marge nette
              livraison inférieure à 3 %</strong>. 18 % travaillent même à perte sur ce canal sans le savoir.
            </Callout>

            <p>
              Ce guide vous donne les chiffres réels 2026 (commissions par plateforme), les formules de calcul,
              les stratégies validées pour transformer la livraison en canal rentable, et les modèles alternatifs
              (click and collect, dark kitchen). Objectif : que vous puissiez décider sur des bases comptables,
              pas sur l'intuition ou la peur de manquer.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Commissions plateformes ═════════════ */}
        <section id="commissions" className="mb-16">
          <SectionHeading icon={<Percent className="w-6 h-6" />} number="2">
            Commissions 2026 : tableau comparatif des plateformes
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici les commissions appliquées par les principales plateformes de livraison en France au
              printemps 2026, données vérifiées auprès de restaurateurs partenaires et confirmées par les CGV
              en vigueur. Attention : ces taux sont <strong>HT et négociables</strong> après ancienneté ou
              volume significatif.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Plateforme</th>
                  <th className="text-center py-3 px-4 font-semibold">Commission HT</th>
                  <th className="text-center py-3 px-4 font-semibold">Frais fixes</th>
                  <th className="text-center py-3 px-4 font-semibold">Mode Self-Delivery</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Négociable après</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white">
                  <td className="py-3 px-4 font-medium text-mono-100">Uber Eats</td>
                  <td className="py-3 px-4 text-center"><strong>28 - 30 %</strong></td>
                  <td className="py-3 px-4 text-center">+ 2 EUR client</td>
                  <td className="py-3 px-4 text-center">13 - 15 %</td>
                  <td className="py-3 px-4 text-center">6 mois</td>
                </tr>
                <tr className="bg-mono-1000">
                  <td className="py-3 px-4 font-medium text-mono-100">Deliveroo</td>
                  <td className="py-3 px-4 text-center"><strong>25 - 32 %</strong></td>
                  <td className="py-3 px-4 text-center">+ Plus 3-5 pts</td>
                  <td className="py-3 px-4 text-center">12 - 17 %</td>
                  <td className="py-3 px-4 text-center">3-6 mois</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 font-medium text-mono-100">JustEat / Lieferando</td>
                  <td className="py-3 px-4 text-center"><strong>14 - 30 %</strong></td>
                  <td className="py-3 px-4 text-center">0,99 EUR / cmd</td>
                  <td className="py-3 px-4 text-center">10 - 14 %</td>
                  <td className="py-3 px-4 text-center">Immédiat (province)</td>
                </tr>
                <tr className="bg-mono-1000">
                  <td className="py-3 px-4 font-medium text-mono-100">TheFork Pay (retrait)</td>
                  <td className="py-3 px-4 text-center"><strong>5 %</strong></td>
                  <td className="py-3 px-4 text-center">0 EUR</td>
                  <td className="py-3 px-4 text-center">N/A</td>
                  <td className="py-3 px-4 text-center">Tarif fixe</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 font-medium text-mono-100">Stuart (B2B course)</td>
                  <td className="py-3 px-4 text-center"><strong>5 - 9 EUR / course</strong></td>
                  <td className="py-3 px-4 text-center">Compte pro</td>
                  <td className="py-3 px-4 text-center">Vous gérez la cmd</td>
                  <td className="py-3 px-4 text-center">Volume</td>
                </tr>
                <tr className="bg-mono-1000">
                  <td className="py-3 px-4 font-medium text-mono-100">Click and collect direct</td>
                  <td className="py-3 px-4 text-center"><strong>0 %</strong></td>
                  <td className="py-3 px-4 text-center">Site 30-100 EUR/mois</td>
                  <td className="py-3 px-4 text-center">Vous gérez tout</td>
                  <td className="py-3 px-4 text-center">N/A</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 font-medium text-mono-100">Site propre + Stuart</td>
                  <td className="py-3 px-4 text-center"><strong>0 % + 5-9 EUR</strong></td>
                  <td className="py-3 px-4 text-center">Site 30-100 EUR/mois</td>
                  <td className="py-3 px-4 text-center">Vous gérez cmd</td>
                  <td className="py-3 px-4 text-center">Volume Stuart</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Lecture du tableau : ce qu'il faut retenir</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Uber Eats et Deliveroo</strong> dominent en volume et visibilité mais facturent
                25-32 %. Acceptables si votre marge brute est supérieure à 70 %.
              </li>
              <li>
                <strong>JustEat / Lieferando</strong> est plus négociable en province (jusqu'à 14 %)
                mais à moins de volume hors zones urbaines tendues.
              </li>
              <li>
                <strong>TheFork Pay</strong> ne concerne que le retrait avec réservation, à 5 %. Excellent
                ratio mais peu de volume livraison.
              </li>
              <li>
                <strong>Stuart (et Coursier.fr, Ola)</strong> sont des coursiers B2B sans commission :
                vous gérez la commande sur votre canal, ils livrent pour 5-9 EUR. Très rentable dès 30 commandes/jour.
              </li>
              <li>
                <strong>Click and collect</strong> reste le canal le plus rentable : 0 % de commission, le
                client vient chercher sa commande. Combiné site web + signalétique en salle pour scaler.
              </li>
            </ul>
          </div>

          <Callout type="info">
            <strong>Astuce stratégique :</strong> ne jamais signer une exclusivité avec une seule plateforme.
            Garder au moins deux plateformes + un canal direct vous maintient en position de force pour
            renégocier annuellement.
          </Callout>
        </section>

        {/* ═════════════ SECTION 3 : Calcul marge reelle plat 15 EUR ═════════════ */}
        <section id="calcul" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="3">
            Calcul de marge réelle : exemple chiffré plat 15 EUR
          </SectionHeading>

          <div className="prose-content">
            <p>
              Prenons un plat vedette d'un bistrot parisien vendu <strong>15 EUR TTC sur Uber Eats</strong>
              (soit 13,64 EUR HT après TVA 10 %). Food cost réel 32 %, main d'oeuvre cuisine 8 minutes,
              commission Uber Eats 28 %. Voici la décomposition ligne par ligne.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Décomposition complète (plat 15 EUR TTC / 13,64 EUR HT)</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Poste</th>
                  <th className="text-right py-2 px-3 font-semibold">Montant</th>
                  <th className="text-right py-2 px-3 font-semibold">% du HT</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr><td className="py-2 px-3 font-medium text-mono-100">Prix vente TTC client</td><td className="py-2 px-3 text-right">15,00 EUR</td><td className="py-2 px-3 text-right">110 %</td></tr>
                <tr><td className="py-2 px-3 font-medium text-mono-100">Prix vente HT (TVA 10 %)</td><td className="py-2 px-3 text-right">13,64 EUR</td><td className="py-2 px-3 text-right">100 %</td></tr>
                <tr className="bg-red-50"><td className="py-2 px-3 text-red-700">- Commission Uber Eats (28 %)</td><td className="py-2 px-3 text-right text-red-700">-3,82 EUR</td><td className="py-2 px-3 text-right text-red-700">-28 %</td></tr>
                <tr><td className="py-2 px-3 text-red-700">- Food cost (32 %)</td><td className="py-2 px-3 text-right text-red-700">-4,36 EUR</td><td className="py-2 px-3 text-right text-red-700">-32 %</td></tr>
                <tr className="bg-red-50"><td className="py-2 px-3 text-red-700">- Main d'oeuvre cuisine (8 min × 18 EUR/h)</td><td className="py-2 px-3 text-right text-red-700">-2,40 EUR</td><td className="py-2 px-3 text-right text-red-700">-17,6 %</td></tr>
                <tr><td className="py-2 px-3 text-red-700">- Packaging écoresponsable</td><td className="py-2 px-3 text-right text-red-700">-1,10 EUR</td><td className="py-2 px-3 text-right text-red-700">-8,1 %</td></tr>
                <tr className="bg-red-50"><td className="py-2 px-3 text-red-700">- Commission CB (1,5 %)</td><td className="py-2 px-3 text-right text-red-700">-0,20 EUR</td><td className="py-2 px-3 text-right text-red-700">-1,5 %</td></tr>
                <tr><td className="py-2 px-3 text-red-700">- Pertes / erreurs / remboursements (4 %)</td><td className="py-2 px-3 text-right text-red-700">-0,55 EUR</td><td className="py-2 px-3 text-right text-red-700">-4 %</td></tr>
                <tr className="border-t-2 border-mono-900 bg-emerald-50">
                  <td className="py-3 px-3 font-bold text-emerald-900">= Marge nette réelle</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-900">+1,21 EUR</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-900">+8,9 %</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Verdict :</strong> sur ce plat à 15 EUR TTC en livraison Uber Eats, il ne reste réellement
              que <strong>1,21 EUR de marge nette par commande</strong>, soit 8,9 % du prix HT. Comparons au
              même plat vendu en salle (sans commission, sans packaging) : marge nette ~5,50 EUR (40 %).
              Vous travaillez 4 fois moins rentablement en livraison qu'en salle pour le même plat.
            </p>
            <p>
              <strong>Levier d'optimisation immédiat :</strong> en passant le prix livraison à
              <strong> 17 EUR TTC</strong> (au lieu de 15 EUR), soit +13 %, la marge nette grimpe à 2,87 EUR
              soit 18,8 %. C'est la justification de la <strong>stratégie prix différenciés</strong>
              détaillée plus bas.
            </p>
          </div>

          <Callout type="info">
            <strong>Pour automatiser ce calcul</strong> sur tous vos plats et toutes vos plateformes,
            utilisez le <Link to="/blog/calcul-marge-restaurant" className="underline font-semibold hover:text-teal-700">guide de calcul de marge</Link>
            {' '}ou directement le{' '}
            <Link to="/outils/calculateur-food-cost" className="underline font-semibold hover:text-teal-700">calculateur de food cost RestauMargin</Link>.
          </Callout>
        </section>

        {/* ═════════════ SECTION HOWTO : 5 etapes ═════════════ */}
        <section id="howto" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="4">
            Comment calculer le ROI livraison en 5 étapes
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la méthode pas-à-pas pour évaluer la rentabilité réelle de votre canal livraison,
              applicable mensuellement. Comptez 20 minutes la première fois, 5 minutes une fois le pli pris.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Lister les revenus bruts par plateforme',
                body: "Récupérez le CA HT mensuel par canal : Uber Eats, Deliveroo, JustEat, click and collect, propre site. Données disponibles dans les espaces partenaires de chaque plateforme. Toujours raisonner en HT, jamais en TTC, sinon vous biaisez les ratios.",
              },
              {
                title: 'Déduire les commissions réelles',
                body: "Appliquez le taux de commission de chaque plateforme (25-32 %), ajoutez les frais fixes (abonnement, visibilité premium type Deliveroo Plus, photos pro). Vous obtenez le revenu net plateforme. Vérifiez sur les relevés : certaines plateformes facturent des frais cachés (assurance, support, retraits anticipés).",
              },
              {
                title: 'Calculer les coûts directs livraison',
                body: "Food cost (32 % en moyenne, parfois 38 % si plats premium), main d'oeuvre cuisine (8-12 min par commande × taux horaire), packaging écoresponsable (0,80-1,50 EUR par sac), commission bancaire (1,2-1,8 %), pertes et erreurs (3-5 % de remboursements). N'oubliez pas le coursier interne si vous livrez vous-même (véhicule, carburant, assurance).",
              },
              {
                title: 'Déterminer la marge nette par plateforme',
                body: "Marge nette = Revenu net plateforme - Coûts directs livraison. Comparez ce ratio entre plateformes pour identifier les canaux rentables et ceux qui vous coûtent de l'argent. Un canal sous 8 % de marge nette est marginal, sous 5 % il est déficitaire une fois les imprévus intégrés.",
              },
              {
                title: 'Ajuster stratégie et carte',
                body: "Si une plateforme a une marge nette inférieure à 8 %, trois options : (1) renégocier la commission, (2) majorer les prix de 10-15 % sur cette plateforme, (3) quitter le canal et réorienter le volume vers click and collect ou propre site. Ne gardez que les canaux rentables. Recalculez chaque mois après ajustement.",
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
        </section>

        {/* ═════════════ SECTION 5 : Strategie 1 - prix differencies ═════════════ */}
        <section id="strat-prix" className="mb-16">
          <SectionHeading icon={<Euro className="w-6 h-6" />} number="5">
            Stratégie 1 : prix différenciés plateformes vs salle
          </SectionHeading>

          <div className="prose-content">
            <p>
              La première stratégie, la plus simple et la plus rentable : appliquer des prix différents
              sur les plateformes par rapport à la salle. <strong>C'est légal depuis 2022</strong> (les CGV
              d'Uber Eats, Deliveroo et JustEat l'autorisent explicitement). C'est même recommandé pour
              absorber la commission sans tuer la marge.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">La règle de majoration recommandée</h3>
            <p>
              Majorer de <strong>+8 à +15 %</strong> les prix sur les plateformes par rapport à la carte
              salle. Exemple : un plat à 14 EUR en salle passe à 16 EUR sur Uber Eats, 15,50 EUR sur Deliveroo
              (moins cher pour favoriser cette plateforme), et 14 EUR en click and collect (incite au retrait).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Canal</th>
                  <th className="text-center py-3 px-4 font-semibold">Prix conseillé</th>
                  <th className="text-center py-3 px-4 font-semibold">Marge nette estimée</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Logique</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Salle</td><td className="py-3 px-4 text-center">14,00 EUR</td><td className="py-3 px-4 text-center"><strong>40 %</strong></td><td className="py-3 px-4 text-center">Référence (sans commission)</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Click and collect</td><td className="py-3 px-4 text-center">14,00 EUR</td><td className="py-3 px-4 text-center"><strong>38 %</strong></td><td className="py-3 px-4 text-center">Inciter au retrait, pas de commission</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Site propre + Stuart</td><td className="py-3 px-4 text-center">15,00 EUR</td><td className="py-3 px-4 text-center"><strong>30 %</strong></td><td className="py-3 px-4 text-center">+1 EUR pour absorber Stuart 5-9 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Deliveroo</td><td className="py-3 px-4 text-center">15,50 EUR</td><td className="py-3 px-4 text-center"><strong>15 %</strong></td><td className="py-3 px-4 text-center">+10 % pour absorber 27-32 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Uber Eats</td><td className="py-3 px-4 text-center">16,00 EUR</td><td className="py-3 px-4 text-center"><strong>12 %</strong></td><td className="py-3 px-4 text-center">+14 % pour absorber 28-30 %</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Implementation pratique :</strong> dans l'espace partenaire Uber Eats et Deliveroo,
              vous pouvez créer un menu avec des prix dédiés. La saisie prend 30 minutes pour une carte
              complète. Pas besoin de prévenir les clients : ils comparent rarement avec les prix salle, et
              les plateformes appliquent la même stratégie sur les chaînes (Big Mac McDo est 10-20 % plus cher
              sur les apps que en restaurant).
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Strategie 2 - menu specifique livraison ═════════════ */}
        <section id="strat-menu" className="mb-16">
          <SectionHeading icon={<Truck className="w-6 h-6" />} number="6">
            Stratégie 2 : menu spécifique livraison (plats qui voyagent)
          </SectionHeading>

          <div className="prose-content">
            <p>
              La deuxième stratégie consiste à <strong>adapter la carte spécifiquement à la livraison</strong>
              {' '}: sortir les plats qui voyagent mal (perdent en qualité après 20 minutes de transport)
              et mettre en avant ceux qui se transportent bien. Cela améliore les notes (4,5+ étoiles boostent
              le ranking algorithmique) et réduit les remboursements.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Plats qui voyagent bien (à privilégier)</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li><strong>Burgers</strong> : tenue 30 min, robustes, panier moyen élevé avec frites + boisson</li>
              <li><strong>Bowls</strong> (poke, buddha, chicken) : composition stable, esthétique à l'arrivée</li>
              <li><strong>Plats en sauce</strong> : curry, mijotés, blanquette, joue de boeuf, paella</li>
              <li><strong>Pâtes non al-denté</strong> : penne, fusilli, rigatoni (éviter spaghetti et tagliatelles)</li>
              <li><strong>Pizzas</strong> : si livraison sous 20 min en sac chauffant</li>
              <li><strong>Salades composées</strong> : sauce à part impérative</li>
              <li><strong>Desserts froids</strong> : tiramisu, cheesecake, mousse</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Plats à sortir de la carte livraison (à éviter)</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li><strong>Tartare, carpaccio</strong> : risque sanitaire + perte de fraîcheur</li>
              <li><strong>Poisson grillé minute</strong> : sèche en 15 min, devient caoutchouteux</li>
              <li><strong>Frites après 15 min</strong> : ramollissent (sauf double cuisson + sachet kraft perforé)</li>
              <li><strong>Soufflés, gratins légers</strong> : retombent au transport</li>
              <li><strong>Glaces sans pochette isotherme</strong> : fondent rapidement</li>
              <li><strong>Tartes fines</strong> : ramollissent sous la sauce de garniture</li>
            </ul>
          </div>

          <Callout type="info">
            <strong>Cas pratique :</strong> un bistrot lyonnais a sorti son carpaccio (note moyenne 3,1)
            et son cabillaud grillé (note 2,8) de la carte Uber Eats. Note globale du restaurant passée
            de 4,1 à 4,7 en 3 mois. Volume commandes +35 % grâce au boost algorithmique du ranking.
          </Callout>
        </section>

        {/* ═════════════ SECTION 7 : Strategie 3 - click and collect ═════════════ */}
        <section id="strat-cc" className="mb-16">
          <SectionHeading icon={<ShoppingBag className="w-6 h-6" />} number="7">
            Stratégie 3 : click and collect, le canal à 0 % commission
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le click and collect (commande en ligne + retrait sur place) est le canal de loin le plus
              rentable pour un restaurant. <strong>0 % de commission, zéro frais livreur, le client se
              déplacé</strong>. La marge nette est quasi identique à celle de la salle, avec en plus un
              gain de temps en service.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Comment lancer un click and collect en 7 jours</h3>
            <ol className="list-decimal list-inside space-y-2 text-mono-350">
              <li><strong>Choisir une plateforme</strong> : Wix Restaurants (35 EUR/mois), Square Online (gratuit + 2,9 % par paiement), Zelty (60 EUR/mois), Shopify Food (29 EUR/mois)</li>
              <li><strong>Saisir la carte</strong> : photos pro de chaque plat (300-500 EUR pour shooter 30 plats), descriptions optimisées, prix différenciés si besoin</li>
              <li><strong>Configurer les créneaux</strong> : 15 min entre chaque retrait pour ne pas saturer la cuisine, fenêtres ouvertes selon horaires</li>
              <li><strong>Communiquer</strong> : QR code sur les tables salle, flyer dans chaque sac livraison plateforme, panneau à l'entrée, post Instagram</li>
              <li><strong>Programme fidélité</strong> : la 10ème commande offerte, points cumulatifs, récompenses anniversaire</li>
              <li><strong>Cross-sell intelligent</strong> : "+1 EUR pour ajouter un dessert", "+2 EUR pour la boisson"</li>
              <li><strong>Suivi reviews Google</strong> : inciter les clients click and collect à noter le retrait (compte différemment dans l'algo Google Maps)</li>
            </ol>
          </div>

          <Callout type="info">
            <strong>Objectif réaliste :</strong> capter 30 à 40 % du volume livraison en click and collect
            sur 6-12 mois. Un restaurant à 50 000 EUR de CA livraison qui transfère 35 % vers le click and
            collect économise <strong>50 000 × 0,35 × 0,28 = 4 900 EUR / mois</strong> de commission.
            Soit 58 800 EUR/an. ROI immédiat sur n'importe quelle plateforme.
          </Callout>
        </section>

        {/* ═════════════ SECTION 8 : Strategie 4 - logistique propre ═════════════ */}
        <section id="strat-logistique" className="mb-16">
          <SectionHeading icon={<Package className="w-6 h-6" />} number="8">
            Stratégie 4 : logistique propre (scooter, robot, Stuart)
          </SectionHeading>

          <div className="prose-content">
            <p>
              La quatrième stratégie consiste à <strong>internaliser ou semi-internaliser la livraison</strong>
              pour court-circuiter les commissions plateformes. Trois modes possibles selon votre volume.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Option A : Stuart, Coursier.fr, Ola (B2B)</h3>
            <p>
              Vous gérez la commande sur votre canal direct (site, téléphone, walk-in), un coursier
              indépendant (Stuart, Coursier.fr, Ola) livre pour 5 à 9 EUR par course. Pas de commission,
              pas de visibilité plateforme. À intégrer dans le prix de vente ou facturer en sus au client.
            </p>
            <ul className="list-disc list-inside space-y-1 text-mono-350">
              <li><strong>Rentable dès 30 commandes/jour direct</strong></li>
              <li><strong>Coût livraison fixe</strong> (vs commission variable), donc prévisible</li>
              <li><strong>Image contrôlée</strong> (livreur en uniforme propre, pas Uber)</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Option B : scooter électrique propre (50-100 cmd/jour)</h3>
            <p>
              Acheter ou louer un scooter électrique (3 000-5 000 EUR achat, 200 EUR/mois en LOA),
              embaucher un livreur en CDI temps partiel (1 500 EUR/mois charges incluses). Rentable des
              50 commandes/jour avec rayon &lt; 4 km.
            </p>
            <ul className="list-disc list-inside space-y-1 text-mono-350">
              <li><strong>Coût par course :</strong> ~ 2,5 EUR (vs 5-9 EUR Stuart, 4-9 EUR commission Uber)</li>
              <li><strong>Image premium</strong> (véhicule personnalisé, livreur stable)</li>
              <li><strong>Bilan carbone</strong> : argument marketing (loi AGEC)</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Option C : robot livreur (expérimentation 2026)</h3>
            <p>
              Les robots livreurs (Starship, Cartken, Refraction) sont en déploiement pilote dans
              quelques villes françaises (Lyon, Toulouse, Bordeaux) en 2026. Coût : 0,80 à 1,50 EUR par
              course, autonomie 6 km. Pertinent pour zones résidentielles denses, pas encore mature pour
              centre-ville parisien.
            </p>
          </div>

          <Callout type="warning">
            <strong>Attention réglementation :</strong> un livreur salarié en CDI cuisine ne peut pas
            être requalifié en coursier sans avenant. Le statut "polyvalent" doit être prévu au contrat
            initial. URSSAF très vigilante depuis 2024 sur les livraisons restaurant.
          </Callout>
        </section>

        {/* ═════════════ SECTION 9 : Strategie 5 - negocier ═════════════ */}
        <section id="strat-nego" className="mb-16">
          <SectionHeading icon={<Award className="w-6 h-6" />} number="9">
            Stratégie 5 : négocier les commissions plateformes
          </SectionHeading>

          <div className="prose-content">
            <p>
              Les commissions Uber Eats et Deliveroo sont <strong>négociables</strong>, contrairement à
              l'idée reçue. Voici les trois leviers éprouvés pour gagner 2 à 5 points de commission.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Levier 1 : l'ancienneté</h3>
            <p>
              Après 6 mois de présence et un historique propre (note &gt; 4,3, taux annulation &lt; 3 %),
              vous pouvez demander à votre Account Manager une remise commerciale. Argument : "j'ai reçu
              une offre de [concurrent] à 26 %, je reste si vous alignez". Gain typique : 1 à 2 points.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Levier 2 : le volume</h3>
            <p>
              Au-delà de 200 commandes/mois, Uber Eats et Deliveroo ouvrent des paliers de commission
              dégressifs. Au-delà de 500 commandes/mois, vous accédez au programme "Restaurants
              Stratégiques" avec commission descendant jusqu'à 22 %. Demander un audit comptable annuel.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Levier 3 : l'exclusivité (à manier avec prudence)</h3>
            <p>
              Certaines plateformes proposent jusqu'à 5 points de commission en moins en échange d'une
              exclusivité (vous quittez les autres plateformes). <strong>Conseil : ne jamais signer</strong>.
              La perte de visibilité sur les autres plateformes annule largement le gain commission, et vous
              êtes à la merci d'une hausse unilatérale au renouvellement.
            </p>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Template email négociation commission</h3>
            <div className="bg-white border border-mono-900 rounded-xl p-5 text-sm text-mono-400 leading-relaxed font-mono">
              Bonjour [Account Manager],<br /><br />
              Nous sommes partenaires depuis [X] mois et avons réalisé [Y] commandes le mois dernier
              avec une note moyenne de [Z]/5. Notre canal Uber Eats représente [N] % de notre CA livraison.<br /><br />
              Nous évaluons actuellement notre mix plateformes pour 2026. [Concurrent] nous propose
              une commission à [X] % avec maintien de la visibilité. Avant de prendre notre décision,
              nous souhaitons connaître votre meilleure offre pour reconduire notre engagement.<br /><br />
              Disponible pour un rendez-vous cette semaine.<br /><br />
              Cordialement, [Nom]
            </div>
          </div>
        </section>

        {/* ═════════════ SECTION 10 : Couts caches ═════════════ */}
        <section id="couts-caches" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="10">
            Les 7 coûts cachés que personne ne compte
          </SectionHeading>

          <div className="prose-content">
            <p>
              Au-delà des commissions visibles, la livraison génère une série de coûts invisibles qui
              érodent silencieusement la marge. Les identifier permet de les chiffrer et soit les absorber
              correctement, soit les supprimer.
            </p>
          </div>

          <div className="space-y-6 mt-8">
            <ErreurCard
              number={1}
              title="Packaging écoresponsable (loi AGEC)"
              desc="Depuis janvier 2024, le plastique à usage unique est interdit pour la livraison restaurant. Carton kraft compostable : 0,80 à 1,50 EUR par commande, soit 30-40 % plus cher que le plastique. Tester en livraison réelle (parcours 25 min) avant commande en gros."
            />
            <ErreurCard
              number={2}
              title="Perte de qualité / remboursements"
              desc="3 à 5 % des commandes plateformes font l'objet d'une réclamation : article manquant, allergène oublié, plat froid, casse. Compensation client + remboursement plateforme = 5 à 10 EUR perdus par incident. Cumulé, c'est 4 à 6 points de marge en moins."
            />
            <ErreurCard
              number={3}
              title="Ressources cuisine partagées"
              desc="Pendant qu'une commande Uber est préparée, un client salle attend. Une commande livraison mobilise 8-12 minutes de main d'oeuvre cuisine. Si vous saturez le pass à 13 h, vous perdez des couverts salle (plus rentables). À intégrer dans le calcul de marge nette globale."
            />
            <ErreurCard
              number={4}
              title="Commission bancaire et frais financiers"
              desc="Les plateformes encaissent puis vous reversent (délai 7-15 jours). Pendant ce délai, vous financez la TVA et les coûts directs. Commission CB Uber Eats : 1,5 à 1,8 % à déduire en plus de la commission plateforme. Frais de retrait anticipé (Instant Pay Uber) : 0,50 EUR par retrait."
            />
            <ErreurCard
              number={5}
              title="Matériel dédié livraison"
              desc="Tablette par plateforme (Uber tablet, Deliveroo terminal, JustEat console), imprimante ticket dédiée, sac chauffant homologué, support comptoir. Investissement initial : 800 à 1 500 EUR. Cumulé sur 3 plateformes : 2 500-4 500 EUR amortis sur 24 mois."
            />
            <ErreurCard
              number={6}
              title="Photos pro et visibilité premium"
              desc="Photos professionnelles obligatoires pour rester compétitif (Uber Eats refuse les photos amateur depuis 2024) : 300 à 800 EUR pour shooter une carte. Visibilité premium Deliveroo Plus : 3 à 5 points de commission supplémentaires. Boost saisonniers Uber Eats : 50 à 200 EUR/mois selon la zone."
            />
            <ErreurCard
              number={7}
              title="Notes 1 étoile et impact algorithmique"
              desc="Chaque note 1 ou 2 étoiles plombe votre ranking algorithmique de la plateforme. Le ranking détermine votre visibilité (top 10 vs page 5). Une mauvaise période peut coûter 30-50 % de volume sur 2-3 semaines. Investir en qualité emballage / temps livraison est moins cher que perdre du volume."
            />
          </div>

          <Callout type="warning">
            <strong>Impact cumulé :</strong> ces sept coûts cachés combinés représentent en moyenne
            <strong>6 à 12 points de marge brute en moins</strong> que ce que le restaurateur calcule
            initialement. Sur un canal livraison à 100 000 EUR/an de CA, c'est 6 000 à 12 000 EUR
            de marge en moins. Crucial de les intégrer dans le calcul.
          </Callout>
        </section>

        {/* ═════════════ SECTION 11 : Dark kitchen ═════════════ */}
        <section id="dark-kitchen" className="mb-16">
          <SectionHeading icon={<Store className="w-6 h-6" />} number="11">
            Dark kitchen et delivery only : pour qui, pour quoi ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le modèle dark kitchen (cuisine fantôme, ghost kitchen, virtual restaurant) consiste à
              <strong>produire uniquement pour la livraison</strong>, sans salle de restaurant. Apparu en
              2017-2018, ce modèle a explosé pendant le Covid et continue de se développer en 2026,
              notamment à Paris, Lyon, Marseille et Toulouse.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Trois modèles de dark kitchen</h3>
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-bold text-blue-900 mb-2">Modèle indépendant</h4>
                <p className="text-sm text-blue-800">Vous louez une cuisine professionnelle dédiée (40-80 m2) en zone péri-urbaine. Loyer 1 500-3 000 EUR/mois. Équipement complet 30-80 K EUR. ROI 12-18 mois si volume &gt; 150 cmd/jour.</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h4 className="font-bold text-emerald-900 mb-2">Cuisine partagée</h4>
                <p className="text-sm text-emerald-800">Vous louez un emplacement dans une cuisine collective (Karavel, Refektory, Taster). 1 000-1 800 EUR/mois clés en main. Équipement mutualise. Démarrage rapide. Idéal pour tester un concept.</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="font-bold text-amber-900 mb-2">Marque virtuelle</h4>
                <p className="text-sm text-amber-800">Vous lancez une marque "delivery only" depuis votre restaurant existant. Aucun investissement supplémentaire. Test concept rapide. Risque de cannibalisation marque mère.</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Pour qui c'est rentable ?</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li><strong>Concepts standardisés</strong> (burgers, poke bowls, pâtes, asiatique) avec carte courte</li>
              <li><strong>Volume cible &gt; 150 commandes/jour</strong> avec ticket moyen &gt; 18 EUR</li>
              <li><strong>Zone urbaine dense</strong> (rayon livraison &lt; 4 km couvre 100 000+ habitants)</li>
              <li><strong>Entrepreneur tech-savvy</strong> capable de gérer 3-4 plateformes simultanées</li>
              <li><strong>Budget marketing dédié</strong> (la visibilité ne se fait pas seule sans salle)</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Pour qui ce n'est PAS rentable ?</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li><strong>Cuisine gastronomique</strong> : ne supporte pas le transport, ticket moyen trop bas</li>
              <li><strong>Zone moyenne ou rurale</strong> : volume insuffisant pour amortir le loyer</li>
              <li><strong>Restaurateur sans compétence digitale</strong> : 80 % du business se passe sur les apps</li>
              <li><strong>Stratégie premium image</strong> : le client veut vivre l'expérience en salle</li>
            </ul>
          </div>

          <Callout type="info">
            <strong>Modèle économique type dark kitchen rentable :</strong> 200 commandes/jour × 22 EUR
            ticket moyen × 30 jours = <strong>132 000 EUR/mois CA</strong>. Commissions plateformes 28 %
            = 36 960 EUR. Food cost 32 % = 30 426 EUR (sur HT). Loyer 2 500 EUR. Personnel cuisine 4 ETP
            = 12 000 EUR. Packaging 6 000 EUR. Marketing 3 000 EUR. <strong>Marge nette ~ 6-8 %</strong>.
            Rentable mais marge fragile.
          </Callout>
        </section>

        {/* ═════════════ SECTION 12 : Scenarios comparatifs ═════════════ */}
        <section id="scenarios" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="12">
            Scénarios comparatifs : 3 modèles testés
          </SectionHeading>

          <div className="prose-content">
            <p>
              Comparons trois scénarios réels sur un restaurant qui réalise 25 000 EUR/mois en CA livraison.
              Hypothèses constantes : 1 000 commandes/mois, ticket moyen 25 EUR HT, food cost 32 %, main
              d'oeuvre cuisine 8 min/commande, packaging 1,10 EUR.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Poste</th>
                  <th className="text-center py-3 px-4 font-semibold">100 % Uber Eats</th>
                  <th className="text-center py-3 px-4 font-semibold">Mix 50 % Uber + 50 % C&C</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">100 % Click and Collect</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">CA HT mensuel</td><td className="py-3 px-4 text-center">25 000 EUR</td><td className="py-3 px-4 text-center">25 000 EUR</td><td className="py-3 px-4 text-center">25 000 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Commission plateforme</td><td className="py-3 px-4 text-center text-red-700">-7 000 EUR (28 %)</td><td className="py-3 px-4 text-center text-red-700">-3 500 EUR (14 %)</td><td className="py-3 px-4 text-center text-red-700">0 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-red-700">- Food cost</td><td className="py-3 px-4 text-center text-red-700">-8 000 EUR</td><td className="py-3 px-4 text-center text-red-700">-8 000 EUR</td><td className="py-3 px-4 text-center text-red-700">-8 000 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Main d'oeuvre cuisine</td><td className="py-3 px-4 text-center text-red-700">-2 400 EUR</td><td className="py-3 px-4 text-center text-red-700">-2 400 EUR</td><td className="py-3 px-4 text-center text-red-700">-2 400 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-red-700">- Packaging</td><td className="py-3 px-4 text-center text-red-700">-1 100 EUR</td><td className="py-3 px-4 text-center text-red-700">-1 100 EUR</td><td className="py-3 px-4 text-center text-red-700">-1 100 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Commission CB et pertes</td><td className="py-3 px-4 text-center text-red-700">-1 250 EUR</td><td className="py-3 px-4 text-center text-red-700">-700 EUR</td><td className="py-3 px-4 text-center text-red-700">-380 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-red-700">- Coût site web / app</td><td className="py-3 px-4 text-center text-red-700">0 EUR</td><td className="py-3 px-4 text-center text-red-700">-60 EUR</td><td className="py-3 px-4 text-center text-red-700">-60 EUR</td></tr>
                <tr className="border-t-2 border-mono-900 bg-emerald-50">
                  <td className="py-3 px-4 font-bold text-emerald-900">= Marge nette</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-900">5 250 EUR (21 %)</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-900">9 240 EUR (37 %)</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-900">13 060 EUR (52 %)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Verdict comparatif :</strong> à CA identique de 25 000 EUR, le scénario 100 % click
              and collect rapporte <strong>2,5 fois plus de marge nette</strong> que le 100 % Uber Eats
              (13 060 EUR vs 5 250 EUR). Le mix 50/50 reste très rentable à 9 240 EUR.
            </p>
            <p>
              <strong>Limite du modèle 100 % click and collect :</strong> en pratique, vous ne capterez
              pas 25 000 EUR de volume sans la visibilité des plateformes. Le scénario réaliste de transition
              est de <strong>migrer progressivement</strong> : commencer 100 % Uber Eats, communiquer
              massivement sur le click and collect avec flyers dans les sacs et QR codes, atteindre 30 %
              click and collect à 12 mois, 50 % à 24 mois.
            </p>
          </div>

          <Callout type="info">
            <strong>Pour aller plus loin sur la stratégie digitale globale</strong> (site web, SEO local,
            email marketing, réseaux sociaux), consultez notre{' '}
            <Link to="/blog/strategie-digitale-restaurant" className="underline font-semibold hover:text-teal-700">
              guide complet de la stratégie digitale en restauration
            </Link>.
          </Callout>
        </section>

        <BlogAuthor publishedDate="2026-05-05" readTime="15 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes</h2>
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
              Pilotez votre marge livraison avec RestauMargin
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Calcul de marge plat par plat, plateforme par plateforme, en temps réel. Détectez automatiquement
              les plats qui vous coûtent de l'argent en livraison.
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

        {/* ═════════════ Articles complementaires ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/fixer-prix-carte-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Fixer le prix de la carte</h3>
              <p className="text-xs text-mono-500">Méthode complète pour fixer les prix de votre carte restaurant.</p>
            </Link>
            <Link to="/blog/prix-de-vente-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calculer le prix de vente d'un plat</h3>
              <p className="text-xs text-mono-500">Méthodes coefficient, marge cible, pricing psychologique.</p>
            </Link>
            <Link to="/blog/strategie-digitale-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Stratégie digitale restaurant</h3>
              <p className="text-xs text-mono-500">Site, SEO local, réseaux sociaux et email marketing.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calcul marge restaurant</h3>
              <p className="text-xs text-mono-500">Guide complet food cost, marge brute et marge nette.</p>
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
