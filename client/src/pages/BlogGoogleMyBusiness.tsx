import { Link } from 'react-router-dom';
import { ChefHat, Calculator, ChevronRight, Star, MapPin, Camera, MessageSquare, TrendingUp, ArrowRight, ExternalLink } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';

const faqItems = [
  {
    question: "Mon restaurant est récent, combien de temps avant d'apparaître dans le Pack Local ?",
    answer: "Comptez 3 à 6 mois avec une fiche optimisée et une stratégie d'avis active. La proximité géographique est immédiate, mais la pertinence algorithmique se construit progressivement avec les avis, posts et interactions régulières.",
  },
  {
    question: "Puis-je avoir plusieurs fiches Google pour un même restaurant ?",
    answer: "Non, Google interdit les fiches en double. Si deux fiches existent pour votre établissement, fusionnez-les via le support Business Profile. Les doublons pénalisent votre classement local.",
  },
  {
    question: "Les avis TripAdvisor et TheFork influencent-ils Google My Business ?",
    answer: "Non directement. Google ne lit pas les avis d'autres plateformes. Cependant, la cohérence de votre réputation en ligne (même nom, même adresse partout) renforce votre autorité locale — les citations NAP (Name, Address, Phone).",
  },
  {
    question: "Comment supprimer un avis négatif injuste sur Google ?",
    answer: "Vous ne pouvez pas supprimer un avis vous-même. Signalez-le à Google s'il viole les règles (faux avis, spam). Sinon, répondez professionnellement et compensez avec de nouveaux avis positifs — c'est la stratégie la plus efficace.",
  },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: "Google My Business pour restaurant : guide complet 2026",
  description: "Comment créer, optimiser et exploiter votre fiche Google My Business pour remplir votre salle : photos, avis, posts, métriques et stratégie avancée.",
  image: 'https://www.restaumargin.fr/og-image.png',
  author: { '@type': 'Organization', name: 'La rédaction RestauMargin', url: 'https://www.restaumargin.fr/a-propos' },
  publisher: {
    '@type': 'Organization',
    name: 'RestauMargin',
    logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
  },
  datePublished: '2026-08-21',
  dateModified: '2026-08-21',
  wordCount: 1500,
  inLanguage: 'fr-FR',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/google-my-business-restaurant' },
};

const SECTIONS = [
  { id: 'pourquoi', icon: <TrendingUp className="w-5 h-5" />, label: "Pourquoi GMB est indispensable" },
  { id: 'creer', icon: <MapPin className="w-5 h-5" />, label: "Créer et revendiquer sa fiche" },
  { id: 'optimiser', icon: <Star className="w-5 h-5" />, label: "Les 8 éléments clés d'optimisation" },
  { id: 'photos', icon: <Camera className="w-5 h-5" />, label: "Photos et vidéos" },
  { id: 'avis', icon: <MessageSquare className="w-5 h-5" />, label: "Gérer les avis clients" },
  { id: 'avance', icon: <TrendingUp className="w-5 h-5" />, label: "Stratégie avancée 2026" },
  { id: 'faq', icon: <Star className="w-5 h-5" />, label: "FAQ" },
];

export default function BlogGoogleMyBusiness() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Google My Business pour restaurant : guide complet 2026"
        description="Comment créer, optimiser et exploiter votre fiche Google My Business pour remplir votre salle : photos, avis, posts, métriques et stratégie avancée 2026."
        path="/blog/google-my-business-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Google My Business restaurant', url: 'https://www.restaumargin.fr/blog/google-my-business-restaurant' },
          ]),
          articleSchema,
        ]}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 font-bold text-[#111111]">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/outils/calculateur-food-cost" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-full transition-colors">
              <Calculator className="w-4 h-4" />
              Calculer ma rentabilité
            </Link>
            <Link to="/login" className="text-sm font-medium text-[#737373] hover:text-teal-600 transition-colors">Connexion</Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-[#F5F5F5] border-b border-[#E5E7EB] py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-[#737373] flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#111111] font-medium">Google My Business restaurant</span>
        </div>
      </div>

      {/* Hero */}
      <header className="bg-gradient-to-br from-teal-600 to-teal-700 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">Marketing Local</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
            Google My Business pour restaurant :<br className="hidden sm:block" /> guide complet 2026
          </h1>
          <p className="text-teal-100 text-base sm:text-lg max-w-2xl leading-relaxed">
            76 % des clients cherchent un restaurant sur Google avant de réserver. Si votre fiche est incomplète,
            vous offrez vos couverts à la concurrence. Voici la méthode complète pour dominer les résultats locaux.
          </p>
          <p className="mt-4 text-sm text-teal-200">Août 2026 · 8 min de lecture</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 sm:px-10 pb-24 pt-8">

        {/* Encadré stats */}
        <div className="my-8 bg-teal-50 border border-teal-200 rounded-2xl p-6 grid sm:grid-cols-3 gap-4 text-center">
          {[
            { stat: '7×', label: 'plus de visites avec une fiche complète' },
            { stat: '76 %', label: 'des clients cherchent sur Google avant de réserver' },
            { stat: '100 %', label: 'gratuit — investissement = votre temps' },
          ].map((item) => (
            <div key={item.stat}>
              <div className="text-3xl font-extrabold text-teal-700">{item.stat}</div>
              <div className="text-sm text-teal-800 mt-1">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Sommaire */}
        <nav className="my-8 bg-[#F5F5F5] border border-[#E5E7EB] rounded-2xl p-6">
          <h2 className="text-base font-bold text-[#111111] mb-3">Sommaire</h2>
          <ol className="space-y-1.5 text-sm text-[#737373]">
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="hover:text-teal-600 transition-colors flex items-center gap-2">
                  <span className="text-teal-600 font-semibold w-5">{i + 1}.</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="prose max-w-none">

          {/* SECTION 1 */}
          <section id="pourquoi" className="mb-12">
            <h2 className="flex items-center gap-3 text-2xl font-extrabold text-[#111111] mb-4">
              <span className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0"><TrendingUp className="w-5 h-5" /></span>
              Pourquoi Google My Business est indispensable
            </h2>
            <p className="text-[#737373] leading-relaxed">
              Le référencement local sur Google fonctionne différemment du SEO classique. Quand un internaute tape
              "restaurant italien Paris 11" ou "meilleur burger près de moi", Google affiche en priorité le <strong className="text-[#111111]">Pack Local</strong> :
              les 3 fiches d'établissements qui apparaissent sous la carte, avant tous les sites web.
            </p>
            <ul className="mt-4 space-y-2 text-[#737373]">
              {[
                "3 à 5× plus de clics que les résultats organiques",
                "28 % des recherches locales aboutissent à un achat dans les 24 heures",
                "56 % des actions sur une fiche GMB = appels ou demandes d'itinéraire",
                "7× plus de visites pour un restaurant avec fiche complète vs sans fiche (BrightLocal 2025)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* SECTION 2 */}
          <section id="creer" className="mb-12">
            <h2 className="flex items-center gap-3 text-2xl font-extrabold text-[#111111] mb-4">
              <span className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0"><MapPin className="w-5 h-5" /></span>
              Créer et revendiquer sa fiche en 5 étapes
            </h2>
            <ol className="space-y-4">
              {[
                { titre: "Vérifier si votre fiche existe", desc: "Cherchez votre restaurant sur Google Maps. Si une fiche existe, cliquez sur « Revendiquer cet établissement »." },
                { titre: "Créer votre compte Business Profile", desc: "Rendez-vous sur business.google.com, cliquez « Ajouter votre établissement » et renseignez le nom exact de votre restaurant." },
                { titre: "Choisir la bonne catégorie principale", desc: "C'est le signal SEO local le plus puissant : Restaurant français, Pizzeria, Brasserie, etc. Ajoutez 2-3 catégories secondaires." },
                { titre: "Vérifier votre établissement", desc: "Google envoie une carte postale avec un code (5-14 jours). Sans vérification, votre fiche ne s'affiche pas." },
                { titre: "Renseigner les informations de base", desc: "Adresse exacte, téléphone direct, site web, horaires complets (jours fériés inclus), zone de livraison si applicable." },
              ].map((step, i) => (
                <li key={i} className="flex gap-4 bg-[#F5F5F5] border border-[#E5E7EB] rounded-xl p-4">
                  <div className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0 font-bold">{i + 1}</div>
                  <div>
                    <p className="font-semibold text-[#111111]">{step.titre}</p>
                    <p className="text-sm text-[#737373] mt-1">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* SECTION 3 */}
          <section id="optimiser" className="mb-12">
            <h2 className="flex items-center gap-3 text-2xl font-extrabold text-[#111111] mb-4">
              <span className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0"><Star className="w-5 h-5" /></span>
              Les 8 éléments clés d'optimisation
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { num: "1", titre: "Nom exact", desc: "Votre nom réel, sans mots-clés artificiels. Les noms optimisés (ex: « Meilleur Bistrot Paris ») violent les CGU et risquent une suspension." },
                { num: "2", titre: "Description 750 car.", desc: "Texte naturel avec mots-clés : type de cuisine, spécialités, ambiance, quartier. Intégrez vos différenciateurs." },
                { num: "3", titre: "Horaires à jour", desc: "Mettez à jour pour les congés et jours fériés. Un restaurant marqué ouvert mais fermé génère 1 étoile et un client perdu définitivement." },
                { num: "4", titre: "Menu en ligne", desc: "Un menu intégré avec prix augmente le taux de conversion de 23 % (SinglePlatform 2025). Ajoutez photos + allergènes." },
                { num: "5", titre: "Attributs complets", desc: "Terrasse, PMR, WiFi, réservation, végétarien, halal, brunch, happy hour — cochez tout ce qui vous correspond." },
                { num: "6", titre: "Lien de réservation", desc: "Connectez TheFork, OpenTable ou votre formulaire direct. Le bouton Réserver dans Maps est un accélérateur de conversion." },
                { num: "7", titre: "Plats vedettes", desc: "Ajoutez vos 3-5 plats stars en tant que Produits avec photo, description et prix. Ils s'affichent en vedette." },
                { num: "8", titre: "Q&R anticipées", desc: "Ajoutez vous-même les questions fréquentes (terrasse ?, parking ?, chiens ?) et répondez-y avant que les clients posent." },
              ].map((item) => (
                <div key={item.num} className="border border-[#E5E7EB] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 bg-teal-600 text-white rounded-lg flex items-center justify-center text-xs font-bold shrink-0">{item.num}</span>
                    <p className="font-semibold text-[#111111] text-sm">{item.titre}</p>
                  </div>
                  <p className="text-xs text-[#737373] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4 */}
          <section id="photos" className="mb-12">
            <h2 className="flex items-center gap-3 text-2xl font-extrabold text-[#111111] mb-4">
              <span className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0"><Camera className="w-5 h-5" /></span>
              Photos et vidéos : l'arme secrète
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
              <p className="text-amber-900 font-semibold">Les restaurants avec +100 photos reçoivent <strong>1 065 % plus de visites</strong> que ceux avec moins de 10 photos (source : Google Internal Data 2024).</p>
            </div>
            <ul className="space-y-2 text-[#737373] text-sm">
              {[
                "Photo de couverture : salle en ambiance, lumière naturelle, service en cours",
                "Logo de l'établissement en haute résolution",
                "Extérieur de jour et de nuit (façade, terrasse)",
                "Intérieur : salle, bar, décoration",
                "10 à 20 photos de plats (fond neutre, lumière naturelle, appétissantes)",
                "Équipe en action en cuisine et en salle",
                "Menu photographié lisible",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Camera className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[#737373] text-sm">
              <strong className="text-[#111111]">Fréquence :</strong> visez minimum 4 nouvelles photos par mois. Format JPG/PNG, min 720×720 px. Chaque ajout relance l'algorithme local.
            </p>
          </section>

          {/* SECTION 5 */}
          <section id="avis" className="mb-12">
            <h2 className="flex items-center gap-3 text-2xl font-extrabold text-[#111111] mb-4">
              <span className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0"><MessageSquare className="w-5 h-5" /></span>
              Gérer les avis clients
            </h2>
            <p className="text-[#737373] leading-relaxed mb-4">
              Les avis Google sont le 2ème facteur de classement local après la proximité géographique.
              Un restaurant avec <strong className="text-[#111111]">4,5 étoiles sur 200 avis</strong> écrase systématiquement un concurrent à 4,8 étoiles sur 12 avis.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { titre: "Collecter", desc: "QR code sur chaque table et addition. Formez l'équipe à demander verbalement. SMS de suivi avec lien direct." },
                { titre: "Répondre", desc: "Répondez à TOUS les avis sous 48h. Personnalisez, citez le plat mentionné, invitez à revenir." },
                { titre: "Objectif", desc: "Minimum 50 avis avec une note ≥ 4,4 pour apparaître régulièrement dans le Pack Local." },
              ].map((item) => (
                <div key={item.titre} className="bg-[#F5F5F5] border border-[#E5E7EB] rounded-xl p-4">
                  <p className="font-semibold text-[#111111] mb-2">{item.titre}</p>
                  <p className="text-xs text-[#737373] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 6 */}
          <section id="avance" className="mb-12">
            <h2 className="flex items-center gap-3 text-2xl font-extrabold text-[#111111] mb-4">
              <span className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0"><TrendingUp className="w-5 h-5" /></span>
              Stratégie avancée 2026
            </h2>
            <ul className="space-y-3 text-[#737373] text-sm">
              <li><strong className="text-[#111111]">Google Posts :</strong> publiez 2 à 4 posts/mois (événements, nouveau menu, promotion). Ils apparaissent directement dans votre fiche sur mobile.</li>
              <li><strong className="text-[#111111]">Offres spéciales :</strong> utilisez les posts "Offre" pour relancer les périodes creuses : "Menu déjeuner 2 plats à 18 EUR du lundi au vendredi".</li>
              <li><strong className="text-[#111111]">Insights :</strong> suivez les recherches qui affichent votre fiche, les actions (appels, itinéraire), les performances photos vs concurrents.</li>
              <li><strong className="text-[#111111]">Score de complétude :</strong> visez 100 %. Google favorise les fiches complètes algorithmiquement.</li>
              <li><strong className="text-[#111111]">Google Reserve :</strong> connectez-le pour la réservation directe depuis Maps. Activez le chat pour répondre avant la réservation.</li>
            </ul>
          </section>

          {/* FAQ */}
          <section id="faq" className="mb-12">
            <h2 className="text-2xl font-extrabold text-[#111111] mb-6">Questions fréquentes</h2>
            <div className="space-y-4">
              {faqItems.map(({ question, answer }) => (
                <div key={question} className="border border-[#E5E7EB] rounded-xl p-5">
                  <p className="font-semibold text-[#111111] mb-2">{question}</p>
                  <p className="text-sm text-[#737373] leading-relaxed">{answer}</p>
                </div>
              ))}
            </div>
          </section>

        </article>

        {/* CTA */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Pilotez la rentabilité de chaque couvert</h2>
          <p className="text-teal-100 mb-6 text-sm max-w-lg mx-auto leading-relaxed">
            Google My Business remplit votre salle. RestauMargin vous aide à rentabiliser chaque couvert :
            food cost automatique, marges par plat, tableau de bord en temps réel.
          </p>
          <a
            href="https://www.restaumargin.fr/pricing"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors text-sm"
          >
            Essayer gratuitement <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Articles connexes */}
        <div className="mt-12 pt-8 border-t border-[#E5E7EB]">
          <h3 className="text-lg font-bold text-[#111111] mb-4">Articles connexes</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { to: '/blog/strategie-digitale-restaurant', titre: 'Stratégie digitale restaurant : le guide', desc: 'Site web, réseaux sociaux, e-réputation.' },
              { to: '/blog/fideliser-clients-restaurant-strategies', titre: 'Fidéliser ses clients restaurant', desc: 'Programmes de fidélité, CRM, email marketing.' },
              { to: '/blog/kpi-restaurateur', titre: 'KPI essentiels pour piloter un restaurant', desc: 'Food cost, prime cost, ticket moyen et benchmarks.' },
              { to: '/blog/seuil-rentabilite-restaurant', titre: 'Seuil de rentabilité restaurant', desc: 'Formules, exemples et tableau de bord.' },
            ].map((art) => (
              <Link key={art.to} to={art.to} className="block p-4 border border-[#E5E7EB] rounded-xl hover:border-teal-300 transition-colors">
                <p className="font-semibold text-[#111111] mb-1 text-sm">{art.titre}</p>
                <p className="text-xs text-[#737373]">{art.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-between text-sm">
          <Link to="/blog" className="text-teal-600 hover:underline">← Tous les articles</Link>
          <a href="https://www.restaumargin.fr/pricing" className="text-teal-600 hover:underline flex items-center gap-1">Voir les tarifs <ExternalLink className="w-3 h-3" /></a>
        </div>
      </main>
    </div>
  );
}
