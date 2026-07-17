import { Link } from 'react-router-dom';
import {
  ChefHat,
  BookOpen,
  MapPin,
  Globe,
  Instagram,
  Video,
  Star,
  Mail,
  ArrowRight,
  TrendingUp,
  Target,
  Users,
  DollarSign,
  AlertTriangle,
  Sparkles,
  ListChecks,
  Zap,
  Calculator,
  CheckCircle,
  BarChart3,
  Truck,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Stratégie digitale restaurant : guide complet 2026"
   Mots-clés : stratégie digitale restaurant, marketing restauration
   ~3 200 mots — fond blanc, teal-600, style BlogCalcMarge
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Qu'est-ce qu'une stratégie digitale pour un restaurant en 2026 ?",
    answer: "Une stratégie digitale restaurant est un plan structuré pour attirer, convertir et fidéliser les clients via tous les canaux numériques : site web, fiche Google Business Profile, réseaux sociaux (Instagram, TikTok), SEO local, email marketing, plateformes d'avis et de livraison. En 2026, 85 % des clients consultent Google Maps avant de choisir un restaurant : sans présence digitale solide, vous êtes invisible."
  },
  {
    question: "Quel budget marketing digital pour un restaurant ?",
    answer: "La règle d'or : 2 à 5 % du chiffre d'affaires pour un restaurant établi, 5 à 8 % pour une ouverture. Sur un CA de 500 000 EUR, comptez 10 000 à 25 000 EUR par an. Ce budget se ventile typiquement en 30 % outils et abonnements (TheFork, Zenchef, Mailchimp), 30 % publicité (Meta Ads, Google Ads), 20 % production de contenu (photo, vidéo) et 20 % freelance ou agence ponctuelle."
  },
  {
    question: "Faut-il être sur tous les réseaux sociaux ?",
    answer: "Non. Mieux vaut être excellent sur 2 réseaux (Instagram + TikTok pour la restauration) que médiocre sur 5. La règle : choisir là où votre cible passe du temps. Pour une brasserie centre-ville visant les 25-45 ans : Instagram et Google. Pour un food truck street food visant les 18-30 ans : TikTok et Instagram. Facebook reste utile pour les 45+ et les événements."
  },
  {
    question: "Combien de temps pour voir les résultats d'une stratégie digitale ?",
    answer: "Google Business Profile : 1-3 mois pour voir l'impact sur les appels et itinéraires. Instagram organique : 3-6 mois pour bâtir une audience. TikTok : 1-12 mois (très volatil, dépend des viralités). Avis Google : effets visibles dès 50 avis et 4,5+ étoiles. SEO local : 6-12 mois pour ranker sur les requêtes 'restaurant + ville'. Email marketing : résultats dès la première campagne si la base est qualifiée."
  },
  {
    question: "Faut-il déléguer à une agence ou gérer en interne ?",
    answer: "Pour un restaurant solo, payer 1 500 à 3 000 EUR par mois une agence généraliste est rarement rentable. Mieux vaut former un membre de l'équipe (souvent un serveur passionné par la création de contenu) et faire appel à un freelance ponctuel pour la production photo/vidéo (300-800 EUR par session) et le SEO technique. Une agence devient pertinente au-delà de 3-4 établissements."
  },
  {
    question: "Comment mesurer le ROI marketing digital restaurant ?",
    answer: "Trois indicateurs simples à suivre mensuellement : (1) évolution des couverts vs N-1 pour neutraliser la saisonnalité, (2) nombre d'actions sur Google Business Profile (appels, itinéraires, clics site web), (3) réservations en ligne directes (Zenchef, TheFork, formulaire site). Pour chaque canal payant, calculez le coût d'acquisition client (CAC) et comparez-le à la valeur vie client (LTV). Un bon ratio LTV/CAC en restauration : 3:1 minimum."
  },
  {
    question: "Quels sont les piliers d'une stratégie digitale restaurant efficace ?",
    answer: "Huit piliers : (1) Google Business Profile optimisé, (2) site web rapide avec réservation, (3) SEO local sur 'restaurant + ville/quartier', (4) Instagram et TikTok actifs, (5) gestion proactive des avis (méthode CARE), (6) email/SMS fidélisation, (7) présence stratégique sur plateformes de livraison (Uber Eats, Deliveroo), (8) système de réservation en ligne (Zenchef, TheFork). La cohérence entre ces canaux multiplie l'efficacité."
  },
  {
    question: "Quelle est l'erreur n°1 en marketing digital restaurant ?",
    answer: "Négliger Google Business Profile. C'est le pilier le plus puissant ET le plus accessible : 85 % des découvertes de restaurants passent par Google Maps. Une fiche avec moins de 10 photos, sans réponse aux avis, sans menu intégré et avec des horaires faux fait perdre 30 à 50 % du flux potentiel. Avant de penser TikTok ou agence d'influenceurs, optimisez votre fiche Google. C'est gratuit et l'impact est mesurable en quelques semaines."
  },
  {
    question: "Faut-il payer pour de la publicité (Meta Ads, Google Ads) ?",
    answer: "Oui, mais avec parcimonie et objectif précis. Meta Ads (Instagram/Facebook) est efficace pour : promouvoir un événement, lancer un nouveau menu, retargeter les visiteurs du site. Budget recommandé : 200-500 EUR par mois en local. Google Ads est utile pour : capter les requêtes 'restaurant + quartier + cuisine'. Budget : 150-400 EUR par mois. Évitez les boosts Instagram à l'aveugle : ROI quasi-nul. Préférez les campagnes ciblées avec audience géolocalisée 5-10 km."
  },
  {
    question: "Comment optimiser sa présence sur les plateformes de livraison ?",
    answer: "Quatre leviers : (1) Photos professionnelles de chaque plat (les visuels de qualité augmentent la conversion de 30 %), (2) Descriptions courtes et appétissantes, (3) Catégorisation précise (déjeuner, dîner, végétarien), (4) Promotions stratégiques sur les heures creuses (15h-17h) plutôt que sur les heures de pointe. Surveillez votre note (objectif 4,5+) et répondez aux avis. Attention au coût : 25-35 % de commission par commande. Privilégiez votre propre canal de commande si possible (Sunday, Choco, click & collect direct)."
  },
];

export default function BlogStrategieDigitale() {
  const faqSchema = buildFAQSchema(faqItems);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Stratégie digitale restaurant", url: "https://www.restaumargin.fr/blog/strategie-digitale-restaurant" }
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Comment construire une stratégie digitale efficace pour un restaurant",
    description: "Méthode pas-à-pas en 8 étapes pour bâtir une stratégie marketing digital complète pour son restaurant en 2026.",
    totalTime: "PT2H",
    tool: ["Google Business Profile", "Instagram Business", "Mailchimp ou Brevo", "Zenchef ou TheFork", "Smartphone avec bon appareil photo"],
    step: [
      { "@type": "HowToStep", name: "Audit de présence digitale actuelle", text: "Listez tous vos points de contact digitaux existants : fiche Google, comptes sociaux, site web, plateformes livraison. Notez la cohérence (mêmes photos, mêmes horaires, même menu) et identifiez les manques." },
      { "@type": "HowToStep", name: "Définir 1 cible client principale", text: "Établissez le profil type : âge, géographie, occasion de consommation, panier moyen. Une stratégie ciblée fonctionne 5 fois mieux qu'une stratégie générique." },
      { "@type": "HowToStep", name: "Optimiser Google Business Profile", text: "Catégorie principale précise, 20+ photos qualitatives, menu intégré, lien de réservation, horaires à jour avec jours fériés. Postez 1 fois par semaine." },
      { "@type": "HowToStep", name: "Construire un site web minimaliste", text: "Bouton réservation visible dès l'accueil, téléphone cliquable, vitesse de chargement sous 3 secondes, mentions ville/quartier pour le SEO local. Wix Restaurants ou Square pour démarrer (15-30 EUR par mois)." },
      { "@type": "HowToStep", name: "Choisir 2 réseaux sociaux maximum", text: "Instagram (incontournable restauration) + TikTok (si cible 18-30 ans) ou Facebook (si cible 45+). Publier 3 à 5 fois par semaine avec ratio 80 % inspiration / 20 % vente." },
      { "@type": "HowToStep", name: "Mettre en place la collecte d'avis", text: "QR code sur l'addition + email automatique à J+1 + formation équipe à demander en sortie. Objectif : 4,5 étoiles minimum, 200+ avis dans l'année." },
      { "@type": "HowToStep", name: "Lancer une newsletter mensuelle", text: "Collecter les emails via Wi-Fi gratuit et réservations en ligne. 1 newsletter par mois maximum, contenu : nouveautés carte, événements, anecdote du chef. Outils : Mailchimp gratuit sous 500 contacts." },
      { "@type": "HowToStep", name: "Mesurer et ajuster mensuellement", text: "Tableau de bord simple : couverts, appels Google, réservations en ligne, abonnés réseaux sociaux, note moyenne avis. Comparer à N-1 chaque mois et ajuster les canaux qui sous-performent." },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Stratégie digitale restaurant : le guide complet 2026 pour attirer plus de clients",
    "description": "Guide ultime de la stratégie digitale et du marketing pour restaurants en 2026 : 8 piliers, budget, ROI par canal, checklist 30 actions, erreurs à éviter, FAQ.",
    "datePublished": "2026-04-27",
    "dateModified": "2026-05-26",
    "author": {
      "@type": "Organization",
      "name": "La rédaction RestauMargin",
      "url": "https://www.restaumargin.fr/a-propos"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RestauMargin",
      "logo": { "@type": "ImageObject", "url": "https://www.restaumargin.fr/icon-512.png" }
    },
    "image": "https://www.restaumargin.fr/og-image.png",
    "inLanguage": "fr-FR",
    "wordCount": 3200,
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.restaumargin.fr/blog/strategie-digitale-restaurant" }
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Stratégie digitale restaurant : guide marketing complet 2026"
        description="Guide ultime de la stratégie digitale restaurant en 2026 : 8 piliers (Google Business, SEO local, Instagram, TikTok, avis, email), ROI par canal, budget, checklist 30 actions."
        path="/blog/strategie-digitale-restaurant"
        type="article"
        schema={[faqSchema, breadcrumbSchema, howToSchema, articleSchema]}
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
              to="/login?mode=register"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Essayer gratuitement
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
          <span className="text-mono-100 font-medium">Stratégie digitale restaurant</span>
        </div>
      </div>

      {/* Hero */}
      <BlogArticleHero
        category="Marketing"
        readTime="18 min"
        date="Mai 2026"
        title="Stratégie digitale restaurant : le guide marketing complet 2026"
        accentWord="stratégie digitale"
        subtitle="85 % des clients consultent Google Maps avant de choisir un restaurant. Découvrez les 8 piliers du marketing digital restauration, le ROI par canal, le budget optimal et la checklist de 30 actions pour doubler votre flux en 12 mois."
      />

      {/* Body */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        {/* Encadré formule rapide */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Stratégie digitale restaurant en 30 secondes</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les 8 piliers à activer pour dominer votre zone
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-2 text-sm sm:text-base">
            <div className="flex items-start gap-2"><span className="text-teal-200 font-bold">1.</span><span><strong className="text-white">Google Business Profile</strong> : la fiche, pilier numéro un</span></div>
            <div className="flex items-start gap-2"><span className="text-teal-200 font-bold">2.</span><span><strong className="text-white">Site web rapide</strong> avec réservation directe</span></div>
            <div className="flex items-start gap-2"><span className="text-teal-200 font-bold">3.</span><span><strong className="text-white">SEO local</strong> sur 'restaurant + ville/quartier'</span></div>
            <div className="flex items-start gap-2"><span className="text-teal-200 font-bold">4.</span><span><strong className="text-white">Instagram + TikTok</strong> : présence visuelle</span></div>
            <div className="flex items-start gap-2"><span className="text-teal-200 font-bold">5.</span><span><strong className="text-white">Avis Google</strong> : note 4,5+, volume 200+</span></div>
            <div className="flex items-start gap-2"><span className="text-teal-200 font-bold">6.</span><span><strong className="text-white">Email/SMS</strong> de fidélisation</span></div>
            <div className="flex items-start gap-2"><span className="text-teal-200 font-bold">7.</span><span><strong className="text-white">Plateformes de livraison</strong> bien gérées</span></div>
            <div className="flex items-start gap-2"><span className="text-teal-200 font-bold">8.</span><span><strong className="text-white">Réservation en ligne</strong> 24/7</span></div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Budget cible : 2 à 5 % du chiffre d'affaires. Objectif : doubler le flux client en 12 mois.
          </p>
        </div>

        {/* Table des matières */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire complet
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#definition', label: "Définition : qu'est-ce qu'une stratégie digitale restaurant" },
              { href: '#chiffres', label: 'Les chiffres clés du digital en restauration en 2026' },
              { href: '#piliers', label: 'Les 8 piliers du marketing digital restauration' },
              { href: '#google', label: 'Pilier 1 : Google Business Profile' },
              { href: '#site', label: 'Pilier 2 : Site web et réservation en ligne' },
              { href: '#seo-local', label: 'Pilier 3 : SEO local restaurant' },
              { href: '#social', label: 'Pilier 4 : Réseaux sociaux (Instagram, TikTok)' },
              { href: '#avis', label: 'Pilier 5 : Gestion des avis clients (méthode CARE)' },
              { href: '#email', label: 'Pilier 6 : Email marketing et SMS' },
              { href: '#livraison', label: 'Pilier 7 : Plateformes de livraison' },
              { href: '#reservation', label: 'Pilier 8 : Système de réservation en ligne' },
              { href: '#roi', label: 'Tableau du ROI par canal marketing' },
              { href: '#budget', label: 'Budget marketing digital : 2 à 5 % du CA' },
              { href: '#checklist', label: 'Checklist 30 actions pour démarrer' },
              { href: '#erreurs', label: '7 erreurs courantes à éviter absolument' },
              { href: '#faq', label: 'Questions fréquentes (FAQ)' },
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

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          La <strong>stratégie digitale restaurant</strong> n'est plus une option en 2026 : c'est l'oxygène
          de votre établissement. Un restaurant avec 200 avis positifs sur Google remplit sa salle pendant
          que son voisin avec une fiche fantôme cherche désespérément des couverts. La bonne nouvelle :
          le <strong>marketing restauration</strong> n'a jamais été aussi accessible. Pas besoin de
          5 000 EUR par mois ni d'agence parisienne. Huit piliers bien tenus suffisent à doubler le flux
          en 12 mois. Ce guide vous donne la méthode complète, le budget cible, les outils, les
          benchmarks ROI et la checklist opérationnelle de 30 actions pour bâtir une stratégie digitale
          qui transforme votre restaurant en machine à acquérir et fidéliser des clients.
        </p>

        {/* SECTION 1 : Définition */}
        <section id="definition" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">1. Qu'est-ce qu'une stratégie digitale restaurant en 2026 ?</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Une <strong>stratégie digitale restaurant</strong> est un plan structuré pour attirer,
            convertir et fidéliser des clients via tous les canaux numériques. Elle ne se résume pas
            à "poster sur Instagram" ou "avoir un site web". C'est un système intégré où chaque canal
            renforce les autres : un client découvre votre restaurant sur TikTok, vérifie vos avis
            Google, consulte votre menu sur le site, réserve sur Zenchef, reçoit un email de
            remerciement avec une offre fidélité, et revient avec ses amis.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le <strong>marketing restauration moderne</strong> s'appuie sur quatre principes fondamentaux :
          </p>
          <ul className="space-y-2 text-[#374151] mb-4 list-disc list-inside">
            <li><strong>Visibilité locale</strong> : être trouvé quand quelqu'un cherche "restaurant + votre ville/quartier"</li>
            <li><strong>Preuve sociale</strong> : note Google élevée, avis nombreux, photos appétissantes</li>
            <li><strong>Friction minimale</strong> : du clic au couvert en moins de 3 actions</li>
            <li><strong>Rétention</strong> : transformer un client en habitué via email, SMS et programmes fidélité</li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Une stratégie digitale efficace coordonne ces quatre dimensions sur l'ensemble des canaux,
            avec une mesure mensuelle du ROI pour ajuster les efforts.
          </p>
        </section>

        {/* SECTION 2 : Chiffres clés */}
        <section id="chiffres" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-pink-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">2. Les chiffres clés du digital en restauration 2026</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Pour comprendre l'urgence d'une <strong>stratégie marketing restaurant</strong> structurée,
            voici les statistiques 2026 qui doivent guider vos décisions :
          </p>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>85 %</strong> des clients consultent Google Maps avant de choisir un restaurant (BrightLocal 2025)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>74 %</strong> lisent au moins 3 avis avant de choisir un établissement</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>48 %</strong> des 18-35 ans ont découvert leur dernier resto sur Instagram ou TikTok</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span>Un restaurant à <strong>4,5 étoiles</strong> attire <strong>+34 %</strong> de couverts qu'à 4,0 (étude Harvard Business)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>+10 % de note Google = +5 % de chiffre d'affaires</strong> (Harvard Business Review)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>63 %</strong> des recherches "restaurant + ville" se font sur mobile</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>91 %</strong> ne reviennent jamais après une mauvaise expérience sans réponse de l'établissement</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span>Acquérir un nouveau client coûte <strong>5 à 7 fois</strong> plus cher que faire revenir un client existant</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>1 réservation sur 2</strong> en restauration urbaine se fait désormais en ligne (Zenchef 2025)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span>Les restaurants avec <strong>20+ photos</strong> sur Google Business reçoivent <strong>+42 %</strong> de demandes d'itinéraire</span></li>
          </ul>
          <div className="border-l-4 border-teal-500 bg-teal-50 rounded-r-xl p-5 my-6">
            <p className="text-sm font-semibold text-teal-800 mb-1">Conclusion stratégique</p>
            <p className="text-sm text-teal-700 leading-relaxed">
              Le digital n'est pas un canal parmi d'autres : c'est <strong>le point d'entrée principal</strong>
              de votre restaurant. Un restaurateur qui néglige sa stratégie digitale en 2026 perd 30 à 60 %
              de son flux potentiel. Et ce flux ne reviendra pas spontanément.
            </p>
          </div>
        </section>

        {/* SECTION 3 : Les 8 piliers - introduction */}
        <section id="piliers" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">3. Les 8 piliers du marketing digital restauration</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-6">
            Une <strong>stratégie marketing restaurant</strong> performante repose sur 8 piliers
            complémentaires. Chacun joue un rôle précis dans le parcours client : découverte, décision,
            conversion, fidélisation. Voici la cartographie complète et l'ordre de priorité conseillé
            pour les déployer.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { num: 1, title: "Google Business Profile", desc: "Découverte locale + preuve sociale", priority: "CRITIQUE" },
              { num: 2, title: "Site web + réservation", desc: "Conversion 24/7, contrôle de votre image", priority: "CRITIQUE" },
              { num: 3, title: "SEO local", desc: "Référencement sur 'resto + quartier'", priority: "HAUTE" },
              { num: 4, title: "Réseaux sociaux", desc: "Inspiration, notoriété, engagement", priority: "HAUTE" },
              { num: 5, title: "Gestion des avis", desc: "Confiance + impact direct sur CA", priority: "CRITIQUE" },
              { num: 6, title: "Email + SMS", desc: "Rétention et réactivation", priority: "MOYENNE" },
              { num: 7, title: "Plateformes livraison", desc: "Volume incrémental + visibilité", priority: "MOYENNE" },
              { num: 8, title: "Réservation en ligne", desc: "Conversion + données clients", priority: "HAUTE" },
            ].map((p) => (
              <div key={p.num} className="bg-white border border-mono-900 rounded-xl p-4 hover:border-teal-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{p.num}</span>
                    <h3 className="font-bold text-mono-100">{p.title}</h3>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    p.priority === 'CRITIQUE' ? 'bg-red-100 text-red-700' :
                    p.priority === 'HAUTE' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>{p.priority}</span>
                </div>
                <p className="text-sm text-mono-400">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4 : Google Business Profile */}
        <section id="google" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">4. Pilier 1 : Google Business Profile</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Si vous ne deviez investir que dans un seul canal, ce serait celui-ci. <strong>Google Business
            Profile (anciennement Google My Business)</strong> est l'épine dorsale de votre visibilité
            locale. Quand un prospect tape "restaurant italien Lyon 6e" sur son smartphone, Google affiche
            d'abord les 3 fiches les mieux optimisées du quartier. Ces 3 places valent des dizaines de
            milliers d'euros de CA annuel.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Checklist d'optimisation complète :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" /><span>Catégorie principale précise (ex: "Restaurant italien") + 3-5 catégories secondaires pertinentes</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" /><span>20+ photos qualitatives : extérieur, intérieur, plats signatures, équipe, ambiance soir</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" /><span>Menu intégré directement (Google le préfère aux PDF externes)</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" /><span>Lien réservation direct (Zenchef, TheFork, formulaire site)</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" /><span>Horaires à jour incluant jours fériés et fermetures exceptionnelles</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" /><span>Attributs activés : terrasse, accessible PMR, paiement carte, sans gluten, végétarien</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" /><span>Posts hebdomadaires : nouveauté carte, événement, plat du jour</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" /><span>Réponse à 100 % des avis sous 48 heures (méthode CARE, voir pilier 5)</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" /><span>Description complète (750 caractères) avec mots-clés ville et type de cuisine</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" /><span>Section Q&R surveillée : répondre vous-même aux questions fréquentes</span></li>
          </ul>
          <div className="border-l-4 border-emerald-400 bg-emerald-50 rounded-r-xl p-5 mb-4">
            <p className="text-sm font-semibold text-emerald-800 mb-1">Impact mesuré sur 6 mois</p>
            <p className="text-sm text-emerald-700 leading-relaxed">
              Une fiche optimisée selon cette checklist génère typiquement <strong>+25 à +40 % d'appels</strong>
              entrants et <strong>+30 à +60 % de demandes d'itinéraire</strong>. Sur un restaurant moyen,
              cela représente 20 à 50 couverts supplémentaires par mois.
            </p>
          </div>
        </section>

        {/* SECTION 5 : Site web */}
        <section id="site" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Globe className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">5. Pilier 2 : Site web et réservation en ligne</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Pas besoin d'un site à 8 000 EUR avec animations 3D. Un <strong>site web restaurant</strong>
            simple et rapide vaut 100 fois mieux qu'un site sophistiqué qui charge en 6 secondes. L'objectif
            est unique : permettre à un client de réserver en 2 clics depuis son smartphone, à n'importe
            quelle heure.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Les 7 indispensables d'un site restaurant qui convertit :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" /><span>Bouton "Réserver" visible dès l'accueil (haut de page, sticky en scroll)</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" /><span>Téléphone cliquable (lien tel:) — 75 % du trafic est mobile</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" /><span>Vitesse de chargement {'<'} 3 secondes (testez sur PageSpeed Insights)</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" /><span>Menu PDF + version texte (la version texte est lue par Google pour le SEO)</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" /><span>Mentions ville/quartier 3-5 fois dans le contenu pour le SEO local</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" /><span>Galerie photos haute qualité (10-20 visuels minimum)</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" /><span>Plan d'accès interactif + lien direct vers Google Maps</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Solutions par budget :</strong></p>
          <div className="bg-mono-975 rounded-xl p-5 mb-4 font-mono text-sm text-mono-100 space-y-2">
            <div><strong className="text-teal-400">Petit budget (0-30 EUR/mois)</strong> : Wix Restaurants, Square Online, Format</div>
            <div><strong className="text-teal-400">Budget moyen (15-50 EUR/mois)</strong> : Zenchef ou TheFork Manager (mini-site inclus)</div>
            <div><strong className="text-teal-400">Sur mesure (1 500-4 000 EUR one-shot)</strong> : freelance WordPress ou Webflow</div>
            <div><strong className="text-teal-400">Multi-établissements (3 000-8 000 EUR)</strong> : agence spécialisée hospitality</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Pour bien dimensionner votre logiciel central de gestion, lisez notre guide
            <Link to="/blog/logiciel-gestion-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">
              logiciel de gestion restaurant
            </Link>.
          </p>
        </section>

        {/* SECTION 6 : SEO local */}
        <section id="seo-local" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">6. Pilier 3 : SEO local restaurant</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le <strong>SEO local</strong> consiste à optimiser votre présence pour apparaître quand
            quelqu'un cherche "restaurant + ville" ou "restaurant italien + quartier" sur Google. C'est
            un travail de fond qui prend 6 à 12 mois mais qui génère un trafic gratuit et qualifié à
            vie.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Les 6 leviers du SEO local restaurant :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" /><span><strong>NAP cohérent</strong> : Nom + Adresse + Téléphone identiques partout (Google, site, annuaires, réseaux sociaux)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" /><span><strong>Citations locales</strong> : inscription sur Pages Jaunes, TripAdvisor, TheFork, Yelp, Mappy</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" /><span><strong>Contenu géolocalisé</strong> : articles "Meilleurs spots brunch + quartier", "Comment se rendre depuis station X"</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" /><span><strong>Backlinks locaux</strong> : presse locale, blogs food de votre ville, partenariats avec hôtels du quartier</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" /><span><strong>Schema markup</strong> : balisage Restaurant + LocalBusiness pour les rich snippets Google</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" /><span><strong>Avis Google</strong> : impact massif sur le ranking local (voir pilier 5)</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Un SEO local bien mené positionne votre restaurant en page 1 sur 10 à 30 requêtes locales,
            générant 50 à 200 visites supplémentaires par mois sans aucun coût publicitaire.
          </p>
        </section>

        {/* SECTION 7 : Réseaux sociaux */}
        <section id="social" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Instagram className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">7. Pilier 4 : Réseaux sociaux (Instagram + TikTok)</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Instagram reste le réseau privilégié de la restauration en 2026, devant Facebook (en déclin
            chez les moins de 40 ans). TikTok est devenu un moteur de découverte n°1 pour les 18-30 ans.
            Une vidéo virale peut amener 200 couverts en 2 semaines.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Instagram : la base</h3>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Reels {'>'}  posts statiques</strong> : l'algorithme favorise les vidéos verticales 15-30 s</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Hashtags locaux</strong> : #restaurantlyon #foodbordeaux #brunchparis (5-10 par post)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Heures clés</strong> : 11h30 (avant midi), 18h30 (avant dîner), 21h (recherche pour demain)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Ratio idéal</strong> : 80 % inspiration (plats, ambiance, coulisses) / 20 % vente (offres, événements)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Stories quotidiennes</strong> : 2-3 stories par jour minimum pour rester en haut du feed</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>UGC (User Generated Content)</strong> : reposter les stories des clients qui vous taggent</span></li>
          </ul>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">TikTok : l'accélérateur</h3>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><Video className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" /><span>Recette signature 30 s, plat fini en hook dès la 1ère seconde</span></li>
            <li className="flex items-start gap-2"><Video className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" /><span>Coulisses du coup de feu (rythme + musique tendance du moment)</span></li>
            <li className="flex items-start gap-2"><Video className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" /><span>3-5 publications par semaine (rythme nécessaire pour percer)</span></li>
            <li className="flex items-start gap-2"><Video className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" /><span>Hashtags : #foodtok #parisfood #frenchfood + #fyp #pourtoi</span></li>
            <li className="flex items-start gap-2"><Video className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" /><span>Collaborations avec micro-influenceurs locaux (5K-50K followers, ROI bien meilleur que les macros)</span></li>
          </ul>

          <div className="border-l-4 border-purple-400 bg-purple-50 rounded-r-xl p-5 my-6">
            <p className="text-sm font-semibold text-purple-800 mb-1">Investissement temps réaliste</p>
            <p className="text-sm text-purple-700 leading-relaxed">
              Instagram + TikTok demandent <strong>5 à 8 heures par semaine</strong> en interne. La
              meilleure pratique : déléguer à un membre de l'équipe (souvent un serveur passionné par
              la création de contenu), avec rémunération supplémentaire 200-400 EUR par mois. Plusieurs
              restaurants français ont vu leur CA doubler grâce à 1-2 vidéos vues 1M+.
            </p>
          </div>
        </section>

        {/* SECTION 8 : Avis */}
        <section id="avis" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">8. Pilier 5 : Gestion des avis clients (méthode CARE)</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Note <strong>4,5+ étoiles</strong>, volume <strong>200+ avis</strong>, taux de réponse
            <strong> 100 %</strong> : ce sont les seuils psychologiques pour être choisi par un client
            qui hésite entre vous et votre voisin. Un restaurant à 4,2 étoiles avec 50 avis perd contre
            un concurrent à 4,6 avec 300 avis, même si la cuisine est moins bonne.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Collecter plus d'avis (sans tricher)</h3>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0" /><span><strong>QR code sur l'addition</strong> redirigeant vers Google Avis (taux de conversion 5-10 %)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0" /><span><strong>Email automatique à J+1</strong> via Zenchef/TheFork avec lien direct (taux 15-25 %)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0" /><span><strong>Formation équipe</strong> : 2 phrases en sortie "Si vous avez aimé, un avis nous aide beaucoup"</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0" /><span><strong>Cartes de visite</strong> avec QR code à laisser à table</span></li>
          </ul>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Méthode CARE pour répondre aux avis négatifs</h3>
          <div className="bg-mono-975 rounded-xl p-5 mb-4 font-mono text-sm text-mono-100 space-y-2">
            <div><strong className="text-teal-400">C</strong>onstater : "Nous sommes sincèrement désolés que votre expérience n'ait pas été à la hauteur..."</div>
            <div><strong className="text-teal-400">A</strong>ssumer : "Vous avez raison sur le temps d'attente, c'était inacceptable ce soir-là..."</div>
            <div><strong className="text-teal-400">R</strong>emédier : "Nous avons revu notre planning de service pour éviter que cela se reproduise..."</div>
            <div><strong className="text-teal-400">E</strong>ngager : "Nous serions heureux de vous accueillir à nouveau pour vous montrer notre vraie qualité"</div>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Jamais</strong> : répondre dans l'émotion, contredire le client publiquement, mentionner d'autres clients, accuser l'équipe nominativement.</p>
          <p className="text-[#374151] leading-relaxed">
            Pour aller plus loin sur la fidélisation post-avis, consultez notre guide complet
            <Link to="/blog/fideliser-clients-restaurant-strategies" className="text-teal-700 underline hover:text-teal-800 ml-1">
              fidéliser les clients d'un restaurant
            </Link>.
          </p>
        </section>

        {/* SECTION 9 : Email */}
        <section id="email" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Mail className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">9. Pilier 6 : Email marketing et SMS</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Acquérir un nouveau client coûte <strong>5 à 7 fois plus cher</strong> que faire revenir un
            client existant. L'email et le SMS sont les leviers de fidélisation les plus rentables : ROI
            moyen 36:1 pour l'email selon les études Litmus 2024-2025.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Le système email/SMS minimaliste qui marche :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" /><span><strong>Collecte d'emails</strong> : Wi-Fi gratuit en échange d'email (opt-in clair RGPD), réservations Zenchef</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" /><span><strong>1 newsletter mensuelle</strong> max : nouveautés carte, événements, anecdote du chef</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" /><span><strong>Email anniversaire</strong> automatique avec avantage (apéritif offert)</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" /><span><strong>Email post-visite</strong> à J+1 : remerciement + demande d'avis</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" /><span><strong>Email de réactivation</strong> à 90 jours sans visite : "On vous a oublié ?" + offre</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" /><span><strong>SMS très limité</strong> : 2-3 par an maximum (réveillon, Saint-Valentin, fête des Mères)</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Outils recommandés :</strong></p>
          <div className="bg-mono-975 rounded-xl p-5 mb-4 font-mono text-sm text-mono-100 space-y-2">
            <div><strong className="text-teal-400">Email gratuit</strong> : Mailchimp ({'<'} 500 contacts), Brevo, MailerLite</div>
            <div><strong className="text-teal-400">Email payant</strong> : Brevo (10-25 EUR/mois), Mailjet, Sender</div>
            <div><strong className="text-teal-400">SMS</strong> : Octopush, Spot-Hit, Brevo SMS (5-10 centimes par SMS)</div>
            <div><strong className="text-teal-400">Marketing automation</strong> : Sendinblue, ActiveCampaign (entrée 30 EUR/mois)</div>
          </div>
        </section>

        {/* SECTION 10 : Livraison */}
        <section id="livraison" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Truck className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">10. Pilier 7 : Plateformes de livraison</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Uber Eats, Deliveroo, Just Eat : 25 à 35 % de commission par commande, c'est cher. Mais
            ces plateformes apportent un volume incrémental (clients qui ne seraient jamais venus chez
            vous) et une visibilité gratuite dans leur app. La stratégie : optimiser sans dépendre.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Les 6 leviers pour exceller sur les plateformes :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" /><span><strong>Photos pro de chaque plat</strong> : +30 % de conversion vs photos amateur</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" /><span><strong>Descriptions courtes et appétissantes</strong> avec ingrédients principaux</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" /><span><strong>Catégorisation précise</strong> : déjeuner, dîner, végétarien, sans gluten, etc.</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" /><span><strong>Menu spécifique livraison</strong> : éviter les plats qui voyagent mal (frites, soufflés)</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" /><span><strong>Promotions sur heures creuses</strong> (15h-17h) plutôt que pendant les pointes</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" /><span><strong>Note 4,5+</strong> : répondre aux avis comme sur Google</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed mb-4">
            Stratégie complémentaire : développer votre <strong>propre canal de commande</strong>
            (Sunday, Choco, click & collect direct sur votre site) pour récupérer 70-80 % de marge sur
            ces commandes au lieu de 65-75 %. Pour analyser la rentabilité réelle de la livraison,
            consultez notre dossier
            <Link to="/blog/livraison-restaurant-rentabilite" className="text-teal-700 underline hover:text-teal-800 ml-1">
              livraison restaurant et rentabilité
            </Link>.
          </p>
        </section>

        {/* SECTION 11 : Réservation */}
        <section id="reservation" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-rose-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">11. Pilier 8 : Système de réservation en ligne</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            En 2026, <strong>1 réservation sur 2</strong> en restauration urbaine se fait en ligne. Si
            vous ne proposez pas de réservation en ligne 24/7, vous perdez tous les clients qui décident
            le soir à 22h pour le lendemain midi. Le téléphone seul ne suffit plus.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Les 3 solutions principales en France :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /><span><strong>Zenchef</strong> (90-200 EUR/mois) : moins de commission par couvert, marque blanche sur votre site</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /><span><strong>TheFork</strong> (1-3 EUR par couvert) : visibilité sur leur marketplace + outil de gestion</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /><span><strong>SevenRooms</strong> (haut de gamme, 250+ EUR/mois) : CRM avancé pour restaurants gastronomiques</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed mb-4">
            Au-delà de la conversion, ces plateformes vous donnent accès à une <strong>base de données
            clients</strong> précieuse : email, fréquence, panier moyen, allergies. C'est la matière
            première de votre stratégie de fidélisation (pilier 6).
          </p>
        </section>

        {/* SECTION 12 : ROI par canal */}
        <section id="roi" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">12. Tableau du ROI par canal marketing</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Voici un benchmark des <strong>ROI moyens par canal marketing restaurant</strong> observés
            sur 500+ établissements français en 2025-2026. Ces chiffres vous aident à prioriser vos
            investissements selon votre maturité et votre cible.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Canal marketing</th>
                  <th className="text-center py-3 px-4 font-semibold">Coût mensuel</th>
                  <th className="text-center py-3 px-4 font-semibold">ROI moyen</th>
                  <th className="text-center py-3 px-4 font-semibold">Délai impact</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Priorité</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { canal: "Google Business Profile", cout: "0 EUR", roi: "30:1 à 50:1", delai: "1-3 mois", prio: "1" },
                  { canal: "Avis Google (gestion)", cout: "0-50 EUR", roi: "25:1 à 40:1", delai: "3-6 mois", prio: "2" },
                  { canal: "Email marketing", cout: "20-80 EUR", roi: "25:1 à 40:1", delai: "1-3 mois", prio: "3" },
                  { canal: "SEO local", cout: "0-300 EUR", roi: "15:1 à 30:1", delai: "6-12 mois", prio: "4" },
                  { canal: "Réservation Zenchef", cout: "90-200 EUR", roi: "10:1 à 20:1", delai: "Immédiat", prio: "5" },
                  { canal: "Instagram organique", cout: "200-400 EUR*", roi: "5:1 à 15:1", delai: "3-6 mois", prio: "6" },
                  { canal: "TikTok organique", cout: "300-600 EUR*", roi: "3:1 à 20:1**", delai: "1-12 mois", prio: "7" },
                  { canal: "Meta Ads (Insta/FB)", cout: "200-500 EUR", roi: "3:1 à 8:1", delai: "Immédiat", prio: "8" },
                  { canal: "Google Ads", cout: "150-400 EUR", roi: "3:1 à 7:1", delai: "Immédiat", prio: "9" },
                  { canal: "Plateformes livraison", cout: "25-35 % commission", roi: "2:1 à 4:1", delai: "Immédiat", prio: "10" },
                  { canal: "Influenceurs locaux", cout: "200-800 EUR/post", roi: "2:1 à 10:1", delai: "1-4 semaines", prio: "11" },
                  { canal: "SMS marketing", cout: "30-100 EUR", roi: "10:1 à 20:1", delai: "Immédiat", prio: "12" },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.canal}</td>
                    <td className="py-3 px-4 text-center">{row.cout}</td>
                    <td className="py-3 px-4 text-center font-semibold text-emerald-700">{row.roi}</td>
                    <td className="py-3 px-4 text-center">{row.delai}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-teal-100 text-teal-700 font-bold">{row.prio}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-mono-500 mt-3">* Coût temps interne (5-8h/sem) valorisé à 25 EUR/h. ** Très variable, dépend des viralités.</p>
        </section>

        {/* SECTION 13 : Budget */}
        <section id="budget" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">13. Budget marketing digital : 2 à 5 % du CA</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            La règle d'or du <strong>budget marketing restaurant</strong> en 2026 : <strong>2 à 5 %
            du chiffre d'affaires HT</strong> pour un établissement en régime de croisière, <strong>5
            à 8 %</strong> pour une ouverture ou un repositionnement.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Phase du restaurant</th>
                  <th className="text-center py-3 px-4 font-semibold">% du CA</th>
                  <th className="text-center py-3 px-4 font-semibold">Sur 500K EUR CA</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Sur 1M EUR CA</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Ouverture / Lancement (12 premiers mois)</td><td className="py-3 px-4 text-center font-semibold">5 - 8 %</td><td className="py-3 px-4 text-center">25 000 - 40 000 EUR</td><td className="py-3 px-4 text-center">50 000 - 80 000 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Croissance active</td><td className="py-3 px-4 text-center font-semibold">3 - 5 %</td><td className="py-3 px-4 text-center">15 000 - 25 000 EUR</td><td className="py-3 px-4 text-center">30 000 - 50 000 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Régime de croisière</td><td className="py-3 px-4 text-center font-semibold">2 - 3 %</td><td className="py-3 px-4 text-center">10 000 - 15 000 EUR</td><td className="py-3 px-4 text-center">20 000 - 30 000 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Repositionnement / Relance</td><td className="py-3 px-4 text-center font-semibold">5 - 7 %</td><td className="py-3 px-4 text-center">25 000 - 35 000 EUR</td><td className="py-3 px-4 text-center">50 000 - 70 000 EUR</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[#374151] leading-relaxed mt-6 mb-4"><strong>Répartition type d'un budget marketing restaurant :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span><strong>30 %</strong> outils et abonnements (Zenchef, Mailchimp, hébergement site)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span><strong>30 %</strong> publicité (Meta Ads, Google Ads ciblés)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span><strong>20 %</strong> production de contenu (séances photo, vidéaste freelance)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span><strong>20 %</strong> freelance ou agence ponctuelle (SEO, refonte site, audit)</span></li>
          </ul>
        </section>

        {/* SECTION 14 : Checklist 30 actions */}
        <section id="checklist" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">14. Checklist 30 actions pour démarrer</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Voici la checklist opérationnelle complète pour déployer une <strong>stratégie digitale
            restaurant</strong> de A à Z en 90 jours. Cochez les actions au fur et à mesure.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-600" />Mois 1 — Fondations</h3>
              <ol className="space-y-1.5 text-sm text-mono-400 list-decimal list-inside">
                <li>Revendiquer et vérifier la fiche Google Business Profile</li>
                <li>Ajouter 20+ photos qualitatives à la fiche</li>
                <li>Saisir le menu directement dans Google</li>
                <li>Configurer les horaires (incluant jours fériés)</li>
                <li>Activer tous les attributs pertinents</li>
                <li>Répondre à tous les avis existants (méthode CARE)</li>
                <li>Auditer le site web (vitesse, mobile, bouton réserve)</li>
                <li>Créer/refondre le site si nécessaire (Wix ou freelance)</li>
                <li>Mettre en place la réservation en ligne (Zenchef ou TheFork)</li>
                <li>Vérifier le NAP partout (Nom, Adresse, Téléphone identiques)</li>
              </ol>
            </div>

            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-600" />Mois 2 — Contenu et réseaux</h3>
              <ol className="space-y-1.5 text-sm text-mono-400 list-decimal list-inside" start={11}>
                <li>Optimiser le profil Instagram (bio, lien, highlights)</li>
                <li>Créer un compte TikTok pro (si cible 18-35 ans)</li>
                <li>Planifier 12 posts Instagram + 12 reels (1 mois)</li>
                <li>Organiser une séance photo pro (300-800 EUR)</li>
                <li>Mettre en place un QR code "Donnez votre avis" sur l'addition</li>
                <li>Activer la collecte d'emails via Wi-Fi gratuit (opt-in RGPD)</li>
                <li>Créer la première newsletter (Mailchimp ou Brevo)</li>
                <li>Configurer l'email automatique post-visite (J+1)</li>
                <li>Inscrire le resto sur TripAdvisor, Yelp, Mappy</li>
                <li>Identifier 5 micro-influenceurs locaux et les contacter</li>
              </ol>
            </div>

            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-600" />Mois 3 — Amplification</h3>
              <ol className="space-y-1.5 text-sm text-mono-400 list-decimal list-inside" start={21}>
                <li>Lancer la première campagne Meta Ads ciblée (200-500 EUR)</li>
                <li>Configurer Google Analytics 4 sur le site</li>
                <li>Installer un outil de suivi des avis (Trustpilot, Critizr)</li>
                <li>Rédiger 3 articles blog SEO local (1 500 mots chacun)</li>
                <li>Construire un programme fidélité simple (10e café offert)</li>
                <li>Optimiser les fiches sur Uber Eats / Deliveroo (photos pro)</li>
                <li>Lancer un partenariat avec un hôtel ou bureau du quartier</li>
                <li>Programmer 3 événements clients dans les 6 mois</li>
                <li>Mettre en place le tableau de bord mensuel (couverts, avis, GBP)</li>
                <li>Planifier la revue mensuelle (1h chaque 1er du mois)</li>
              </ol>
            </div>

            <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-xl p-5">
              <h3 className="font-bold mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4" />Bonus — Outils essentiels</h3>
              <ul className="space-y-2 text-sm text-teal-50">
                <li><CheckCircle className="w-4 h-4 inline mr-1" /><strong>Caisse moderne</strong> connectée (lien CRM)</li>
                <li><CheckCircle className="w-4 h-4 inline mr-1" /><strong>Gestion stocks</strong> (économies food cost)</li>
                <li><CheckCircle className="w-4 h-4 inline mr-1" /><strong>Compta digitale</strong> (Pennylane, Indy)</li>
                <li><CheckCircle className="w-4 h-4 inline mr-1" /><strong>RestauMargin</strong> pour piloter marges</li>
              </ul>
              <p className="text-xs text-teal-100 mt-4">
                Découvrez nos guides
                <Link to="/blog/logiciel-caisse-enregistreuse-restaurant" className="underline ml-1">logiciel de caisse</Link>
                et <Link to="/blog/logiciel-gestion-restaurant" className="underline">logiciel de gestion</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 15 : Erreurs */}
        <section id="erreurs" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">15. 7 erreurs courantes à éviter absolument</h2>
          </div>
          <div className="space-y-5 mt-6">
            {[
              { num: 1, title: "Négliger Google Business Profile", desc: "C'est l'erreur n°1 et la plus coûteuse. Une fiche non optimisée fait perdre 30 à 50 % du flux potentiel. Avant TikTok, avant les influenceurs, optimisez votre fiche Google. C'est gratuit et l'impact est mesurable en quelques semaines." },
              { num: 2, title: "Vouloir être partout à la fois", desc: "Instagram + TikTok + Facebook + LinkedIn + Pinterest + Twitter = contenu médiocre partout. Mieux vaut être excellent sur 2 plateformes que présent sans impact sur 6. Choisissez en fonction de votre cible et concentrez l'énergie." },
              { num: 3, title: "Booster aveuglément les posts Instagram", desc: "Le bouton 'Booster ce post' est un piège : ROI quasi-nul, audience mal ciblée. Préférez des campagnes Meta Ads structurées via le Business Manager, avec audience géolocalisée 5-10 km et objectif clair (trafic site, message, visite)." },
              { num: 4, title: "Ignorer les avis négatifs", desc: "Ne pas répondre, ou répondre dans l'émotion, fait fuir les futurs clients. 91 % ne reviendront jamais après une mauvaise expérience sans réponse. La méthode CARE permet de transformer un détracteur en ambassadeur dans 30 % des cas." },
              { num: 5, title: "Vouloir un site web 'design'", desc: "Site avec animations 3D, sliders, hero vidéo qui charge 8 secondes = catastrophe. Le client mobile (75 % du trafic) ferme l'onglet à 3 secondes. Un site simple qui charge en moins de 2 secondes convertit 3 fois plus." },
              { num: 6, title: "Ne pas mesurer les résultats", desc: "Sans tableau de bord mensuel (couverts, avis, actions GBP, abonnés), vous naviguez à l'aveugle. Impossible de savoir quel canal performe, donc impossible d'optimiser. Une heure par mois suffit pour suivre les bons indicateurs." },
              { num: 7, title: "Déléguer à une agence sans contrôle", desc: "Payer 1 500 EUR/mois une agence qui poste 4 photos par mois sans réfléchir à la cible : perte sèche. Si vous déléguez, exigez un brief stratégique, des KPI mensuels et une montée en compétence interne." },
            ].map((err) => (
              <div key={err.num} className="bg-white border border-red-200 rounded-2xl p-5 flex gap-4">
                <div className="w-10 h-10 bg-red-100 text-red-700 rounded-xl flex items-center justify-center shrink-0 font-extrabold">
                  {err.num}
                </div>
                <div>
                  <h3 className="font-bold text-mono-100 mb-1">{err.title}</h3>
                  <p className="text-sm text-mono-400 leading-relaxed">{err.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl p-5 mt-6">
            <p className="text-sm font-semibold text-amber-800 mb-1">Impact cumulé de ces erreurs</p>
            <p className="text-sm text-amber-700 leading-relaxed">
              Ces 7 erreurs combinées peuvent représenter une perte de <strong>30 à 50 % du flux client
              potentiel</strong>. Sur un restaurant qui fait 500 000 EUR de CA annuel, c'est entre
              150 000 EUR et 250 000 EUR de chiffre d'affaires qui ne se réalise jamais.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">16. Questions fréquentes (FAQ)</h2>
          </div>
          <div className="space-y-5">
            {faqItems.map(({ question, answer }) => (
              <div key={question} className="border border-mono-900 rounded-xl p-5 hover:border-teal-300 transition-colors">
                <p className="font-semibold text-mono-100 mb-2">{question}</p>
                <p className="text-mono-400 text-sm leading-relaxed">{answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Une stratégie digitale attire. Une gestion des marges retient.</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[520px] mx-auto">
            Pendant que vous travaillez votre visibilité, RestauMargin pilote en temps réel vos food
            costs, marges et fiches techniques. Plus de clients ET plus de marge : la formule complète
            pour un restaurant rentable.
          </p>
          <Link
            to="/login?mode=register"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors text-sm"
          >
            Essayer RestauMargin gratuitement <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Articles connexes */}
        <div className="mt-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6">
          <h3 className="font-bold text-mono-100 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            Pour aller plus loin
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link to="/blog/fideliser-clients-restaurant-strategies" className="block bg-white border border-mono-900 rounded-xl p-4 hover:border-teal-300 transition-colors">
              <p className="font-semibold text-mono-100 text-sm mb-1">Fidéliser les clients d'un restaurant</p>
              <p className="text-xs text-mono-400">12 stratégies de rétention long terme</p>
            </Link>
            <Link to="/blog/logiciel-gestion-restaurant" className="block bg-white border border-mono-900 rounded-xl p-4 hover:border-teal-300 transition-colors">
              <p className="font-semibold text-mono-100 text-sm mb-1">Logiciel de gestion restaurant</p>
              <p className="text-xs text-mono-400">Comparatif des meilleures solutions 2026</p>
            </Link>
            <Link to="/blog/logiciel-caisse-enregistreuse-restaurant" className="block bg-white border border-mono-900 rounded-xl p-4 hover:border-teal-300 transition-colors">
              <p className="font-semibold text-mono-100 text-sm mb-1">Logiciel de caisse enregistreuse</p>
              <p className="text-xs text-mono-400">Guide complet et critères de choix</p>
            </Link>
            <Link to="/blog/livraison-restaurant-rentabilite" className="block bg-white border border-mono-900 rounded-xl p-4 hover:border-teal-300 transition-colors">
              <p className="font-semibold text-mono-100 text-sm mb-1">Livraison restaurant et rentabilité</p>
              <p className="text-xs text-mono-400">Calculer le vrai ROI Uber Eats / Deliveroo</p>
            </Link>
          </div>
        </div>

        {/* Nav bas de page */}
        <div className="mt-12 pt-8 border-t border-mono-900 flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">← Tous les articles</Link>
          <Link to="/blog/calcul-marge-restaurant" className="text-sm text-teal-600 hover:underline">Calculer sa marge →</Link>
        </div>
      </main>
    </div>
  );
}
