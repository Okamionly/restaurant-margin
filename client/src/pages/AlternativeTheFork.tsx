import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, DollarSign, Target, BookOpen, Lightbulb, Users, Zap, Sparkles, Scale, XCircle, Star, Quote, Building2 } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Comparatif SEO — "Alternative à TheFork Manager : RestauMargin pour gérer vos marges"
   Mot-clé principal : alternative thefork manager
   Mots-clés secondaires : thefork manager vs, restaumargin vs thefork, thefork manager prix
   ~2 600 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Peut-on utiliser RestauMargin et TheFork Manager en parallele ?",
    answer: "Oui, c'est meme la combinaison la plus frequente sur le marche francais. Pres de 90 % de nos clients qui utilisent un module reservation passent par TheFork (LaFourchette) pour le visible : reservations en ligne, fiche restaurant, marketing client. Ils utilisent ensuite RestauMargin pour la partie operationnelle : food cost, fiches techniques, mercuriale, marges par plat. Les deux outils n'ont pas besoin d'echanger de donnees, ils repondent a des besoins differents et coexistent sans probleme.",
  },
  {
    question: "Combien coute RestauMargin par rapport a TheFork Manager ?",
    answer: "RestauMargin commence a 29 EUR/mois (formule Pro). TheFork Manager propose plusieurs formules : Basic autour de 39 EUR/mois + commission de 2 EUR par couvert reserve, Premium autour de 69-89 EUR/mois + commission. Sur un an, RestauMargin coute 348 EUR contre 468 a 1 068 EUR pour TheFork (hors commissions par couvert). La difference de positionnement explique l'ecart : TheFork est un outil de visibilite et d'acquisition, RestauMargin un outil de pilotage des marges.",
  },
  {
    question: "TheFork Manager gere-t-il le food cost et les fiches techniques ?",
    answer: "Non. TheFork Manager est specialise dans la gestion des reservations en ligne, l'optimisation du remplissage de salle (plan de salle, gestion des no-show, listes d'attente), le marketing client (emails, promotions, fidelisation) et la presence sur l'annuaire TheFork (1.7 million d'utilisateurs en France). Il n'inclut ni calcul de food cost, ni gestion de mercuriale fournisseurs, ni fiches techniques de recettes. Pour ces fonctions, il faut un outil specialise comme RestauMargin.",
  },
  {
    question: "Quelle est la commission TheFork Manager par couvert ?",
    answer: "TheFork facture historiquement entre 2 EUR HT et 6 EUR HT par couvert reserve via leur plateforme, selon le type de programme. Le programme TheFork PAY (paiement integre) modifie legerement ces tarifs. A ces commissions s'ajoute l'abonnement mensuel Manager (39 EUR a 89 EUR/mois selon la formule). Pour un restaurant qui realise 800 couverts via TheFork par mois, la commission seule peut atteindre 1 600 EUR. RestauMargin n'a aucune commission par couvert puisque ce n'est pas un outil de reservation.",
  },
  {
    question: "Puis-je migrer mes donnees de TheFork vers RestauMargin ?",
    answer: "Les deux outils ne stockent pas les memes donnees, donc la question de migration ne se pose pas. TheFork conserve vos reservations, votre base clients et votre historique de couverts. RestauMargin gere vos ingredients, fiches techniques, factures fournisseurs et marges. Vous pouvez tout a fait garder TheFork pour les reservations et ajouter RestauMargin par-dessus sans rien casser, ni dans un sens, ni dans l'autre.",
  },
  {
    question: "RestauMargin propose-t-il un module reservation en ligne ?",
    answer: "Non, ce n'est volontairement pas dans notre scope. Nous nous concentrons sur la gestion operationnelle et la rentabilite (marges, food cost, fiches techniques, IA d'optimisation, mercuriale). Pour la reservation, TheFork (le plus utilise en France), Zenchef ou Resy sont des choix solides. La grande majorite de nos clients combinent TheFork (reservations) + RestauMargin (operations) et trouvent cette combinaison parfaitement complementaire.",
  },
  {
    question: "Y a-t-il un essai gratuit chez RestauMargin et chez TheFork Manager ?",
    answer: "RestauMargin offre 7 jours d'essai gratuit, sans carte bancaire, avec acces a toutes les fonctionnalites (food cost, IA, mercuriale, multi-restaurant). TheFork Manager ne propose pas d'essai gratuit standard mais une demo commerciale. RestauMargin permet donc de tester reellement le produit avant de payer, sans interaction commerciale obligatoire. Pour TheFork, il faut generalement passer par un commercial pour obtenir un acces de test.",
  },
  {
    question: "Quelle alternative a TheFork Manager est la plus adaptee a un restaurant independant ?",
    answer: "Pour un restaurant independant, la verite est qu'il n'existe pas vraiment d'alternative a TheFork pour la partie reservation : leur reseau de 1.7 million d'utilisateurs en France constitue une vraie barriere a l'entree. Mais pour la partie gestion operationnelle, qui n'est pas le coeur de TheFork, RestauMargin est un excellent choix (29 EUR/mois, sans commission par couvert, gestion complete des marges). La combinaison TheFork + RestauMargin est la plus repandue sur le marche.",
  },
  {
    question: "Comment RestauMargin se compare-t-il a TheFork sur la qualite du support ?",
    answer: "Les deux outils proposent un support en francais par email et chat. RestauMargin inclut le support dans toutes les formules, y compris la formule Pro a 29 EUR, avec un temps de reponse moyen inferieur a 4 heures en jours ouvres. TheFork dispose d'un service client structure (heritage du groupe TripAdvisor) avec accompagnement commercial dedie pour les formules superieures. Les deux equipes sont reactives sur leur scope respectif.",
  },
  {
    question: "Existe-t-il une integration directe entre RestauMargin et TheFork Manager ?",
    answer: "Il n'existe pas d'integration native entre RestauMargin et TheFork Manager, mais elle n'est pas necessaire. TheFork gere vos couverts et vos reservations cote front, RestauMargin gere vos couts et vos marges cote back. Les deux mondes n'ont pas besoin d'echanger en temps reel : vous pouvez tres bien suivre votre nombre de couverts servis dans RestauMargin via la saisie quotidienne ou la connexion avec votre logiciel de caisse, sans dependre de TheFork pour cela.",
  },
];

export default function AlternativeTheFork() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Alternative TheFork Manager | RestauMargin food cost | 2026"
        description="TheFork Manager = réservations + marketing. RestauMargin = gestion food cost + marges + IA. Comparatif 2026 honnête : tableau 18 critères, pricing, cas d'usage."
        path="/alternative-thefork"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Comparatifs', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Alternative TheFork Manager', url: 'https://www.restaumargin.fr/alternative-thefork' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Alternative à TheFork Manager : RestauMargin pour gérer vos marges',
            description: "Comparatif honnête entre RestauMargin (29 EUR/mois, gestion des marges + IA) et TheFork Manager (39-89 EUR/mois + commission/couvert, réservations + marketing). Tableau 18 critères, pricing 1 an, cas d'usage, FAQ.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-05-26',
            dateModified: '2026-05-26',
            wordCount: 2600,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/alternative-thefork' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Comparatif TheFork Manager vs RestauMargin',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                item: {
                  '@type': 'SoftwareApplication',
                  name: 'RestauMargin',
                  applicationCategory: 'BusinessApplication',
                  operatingSystem: 'Web, iOS, Android (PWA)',
                  offers: {
                    '@type': 'Offer',
                    price: '29',
                    priceCurrency: 'EUR',
                    priceSpecification: {
                      '@type': 'UnitPriceSpecification',
                      price: '29',
                      priceCurrency: 'EUR',
                      unitText: 'MONTH',
                    },
                  },

                  description: "Gestion des marges, food cost, fiches techniques, mercuriale fournisseurs et IA d'optimisation pour restaurateurs independants et groupes.",
                },
              },
              {
                '@type': 'ListItem',
                position: 2,
                item: {
                  '@type': 'SoftwareApplication',
                  name: 'TheFork Manager',
                  applicationCategory: 'BusinessApplication',
                  operatingSystem: 'Web, iOS, Android',
                  offers: {
                    '@type': 'Offer',
                    price: '39',
                    priceCurrency: 'EUR',
                    priceSpecification: {
                      '@type': 'UnitPriceSpecification',
                      price: '39',
                      priceCurrency: 'EUR',
                      unitText: 'MONTH',
                    },
                  },
                  description: "Plateforme de reservation en ligne, gestion de salle, marketing client et visibilite sur l'annuaire TheFork (1.7M utilisateurs France).",
                },
              },
            ],
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
              Essai gratuit 7 jours
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

      {/* ── Breadcrumbs visibles ── */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">Comparatifs</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Alternative TheFork Manager</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Comparatif"
        readTime="11 min"
        date="Mai 2026"
        title="Alternative à TheFork Manager : RestauMargin pour gérer vos marges"
        accentWord="RestauMargin"
        subtitle="TheFork Manager domine la réservation en ligne en France (1,7 million d'utilisateurs), mais ne gère ni votre food cost ni vos fiches techniques. Voici un comparatif honnête pour comprendre où TheFork excelle, ce que RestauMargin apporte en complément, et pourquoi 90 % des restaurateurs utilisent les deux."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="11 min" variant="header" />

        {/* ── Encadre TL;DR (featured snippet) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">En 30 secondes</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            TheFork Manager vs RestauMargin : la réponse rapide
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 space-y-3 text-sm sm:text-base">
            <p className="leading-relaxed">
              <strong className="text-white">TheFork Manager</strong> est un excellent outil pour <strong>la réservation en ligne, le remplissage de salle et le marketing client</strong>. Tarif : 39 à 89 EUR/mois + commission 2 EUR par couvert. Il ne gère ni food cost, ni fiches techniques, ni marges.
            </p>
            <p className="leading-relaxed">
              <strong className="text-white">RestauMargin</strong> est l'outil complémentaire pour <strong>la gestion opérationnelle : food cost, marges, fiches techniques, mercuriale, IA</strong>, à 29 EUR/mois sans commission par couvert. Pas de module réservation.
            </p>
            <p className="leading-relaxed pt-2 border-t border-white/20">
              <strong className="text-white">Verdict :</strong> les deux outils ne sont pas concurrents, ils sont complémentaires. 90 % de nos clients utilisent TheFork pour le front (réservations) et RestauMargin pour le back (pilotage des marges).
            </p>
          </div>
        </div>

        {/* ── Table des matieres ── */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#positionnement', label: "Pourquoi parler d'alternative à TheFork Manager ?" },
              { href: '#thefork', label: "Vue d'ensemble : TheFork Manager en 2026" },
              { href: '#restaumargin', label: "Vue d'ensemble : RestauMargin en 2026" },
              { href: '#tableau', label: 'Tableau comparatif détaillé (18 critères)' },
              { href: '#cas-usage', label: "Quel outil pour quel besoin ?" },
              { href: '#prix', label: 'Comparaison de prix sur 12 mois' },
              { href: '#temoignages', label: 'Témoignages de restaurateurs' },
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
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="1">
            Pourquoi parler d'alternative à TheFork Manager ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              TheFork Manager (anciennement LaFourchette Manager) est l'outil de gestion des
              restaurants côté professionnels du groupe TheFork, racheté par TripAdvisor en 2014.
              Avec <strong>1,7 million d'utilisateurs actifs en France</strong> côté grand public,
              c'est aujourd'hui la première plateforme de réservation en ligne pour la restauration
              dans l'Hexagone, devant Google Réservation et Zenchef. Si vous êtes restaurateur en
              France, il y a de fortes chances que vous utilisiez ou ayez utilisé TheFork Manager.
            </p>
            <p>
              Alors pourquoi tant de recherches autour des termes "alternative TheFork Manager",
              "TheFork Manager vs" ou "TheFork Manager prix" ? Parce que TheFork Manager couvre
              un périmètre très précis – la réservation, le marketing client et la visibilité –
              et qu'il laisse <strong>plusieurs blocs critiques de la gestion de restaurant non
              couverts</strong>. C'est ce vide que comble RestauMargin.
            </p>
            <p>
              Cet article n'est pas un article "anti-TheFork". TheFork est un produit solide pour
              ce qu'il fait. Mais il y a une confusion fréquente : beaucoup de restaurateurs
              pensent qu'un outil aussi populaire que TheFork Manager couvre aussi la rentabilité
              et le food cost. Spoiler : ce n'est pas le cas. Voyons précisément qui fait quoi.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 mt-8">
            <ReasonCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Le coût caché"
              desc="L'abonnement Manager (39-89 EUR/mois) n'est qu'une partie du coût. La commission de 2 EUR par couvert peut représenter 800 à 2 000 EUR/mois pour un restaurant qui dépend fortement de TheFork."
            />
            <ReasonCard
              icon={<XCircle className="w-6 h-6" />}
              title="Le scope limité"
              desc="TheFork Manager gère brillamment les réservations, mais ne couvre ni food cost, ni fiches techniques, ni mercuriale fournisseurs, ni marges par plat. La rentabilité opérationnelle est hors scope."
            />
            <ReasonCard
              icon={<AlertTriangle className="w-6 h-6" />}
              title="La dépendance"
              desc="Plus de 30 % de vos couverts viennent parfois de TheFork. C'est un canal d'acquisition puissant mais aussi une dépendance forte : variation de visibilité = variation de couverts directe."
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              Encore une fois, ces points ne disqualifient pas TheFork Manager. Pour beaucoup de
              restaurants, la commission est largement compensée par les couverts apportés. La
              question n'est pas "TheFork ou RestauMargin", c'est "que faire pour <strong>combler
              le vide entre la réservation et la rentabilité</strong> ?". La réponse honnête est
              simple : utiliser un outil dédié à la gestion opérationnelle, en plus de votre
              système de réservation. C'est exactement le rôle de RestauMargin.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Vue d'ensemble TheFork ═════════════ */}
        <section id="thefork" className="mb-16">
          <SectionHeading icon={<Building2 className="w-6 h-6" />} number="2">
            Vue d'ensemble : TheFork Manager en 2026
          </SectionHeading>

          <div className="prose-content">
            <p>
              TheFork Manager est positionné comme une <strong>plateforme tout-en-un pour la
              gestion de la visibilité et des réservations</strong> des restaurants. Le cœur du
              produit est le module de réservation en ligne connecté à l'annuaire TheFork, complété
              par un plan de salle digital, un CRM clientèle et des outils marketing. Selon les
              données publiques du groupe TheFork (filiale de Tripadvisor), <strong>plus de
              60 000 restaurants en Europe</strong> utilisent leur plateforme, dont une part
              significative en France.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Points forts de TheFork Manager</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-emerald-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Réseau de 1,7 million d'utilisateurs actifs en France (acquisition réelle)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Module réservation en ligne mature et connecté à TripAdvisor</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Plan de salle digital avec gestion temps réel des tables</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Marketing client : emails de relance, promotions, programme Yums (fidélité)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Gestion des no-show et listes d'attente avancée</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Support en français, équipe commerciale dédiée pour les comptes premium</span></li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">Limites de TheFork Manager</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-amber-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Aucun calcul de food cost ni gestion de marges par plat</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de fiches techniques pour les recettes</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de mercuriale fournisseurs ni d'historique de prix matières premières</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de menu engineering ni d'analyse de rentabilité de la carte</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Commission de 2 EUR par couvert qui s'ajoute à l'abonnement mensuel</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas d'essai gratuit standard, démo commerciale obligatoire</span></li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>À noter :</strong> TheFork a annoncé en 2023-2024 des partenariats étendus
            avec plusieurs solutions de caisse (Lightspeed, Tiller, L'Addition) pour intégrer le
            suivi des ventes, mais l'analyse de marge plat par plat et la gestion du food cost
            restent hors de leur scope produit. Leur promesse n'est pas la rentabilité
            opérationnelle, c'est le remplissage de salle.
          </Callout>
        </section>

        {/* ═════════════ SECTION 3 : Vue d'ensemble RestauMargin ═════════════ */}
        <section id="restaumargin" className="mb-16">
          <SectionHeading icon={<ChefHat className="w-6 h-6" />} number="3">
            Vue d'ensemble : RestauMargin en 2026
          </SectionHeading>

          <div className="prose-content">
            <p>
              RestauMargin est positionné comme la <strong>solution de référence pour la gestion
              opérationnelle et la rentabilité</strong> en restauration. Notre promesse est simple :
              chaque plat servi doit être rentable, et vous devez le savoir en temps réel. Notre
              cœur métier couvre les marges, le food cost, les fiches techniques, la mercuriale
              fournisseurs et l'optimisation par IA (19 actions intelligentes intégrées).
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Points forts de RestauMargin</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-emerald-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Calcul automatique du food cost et de la marge brute, par plat et global</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Fiches techniques digitales illimitées, avec ingrédients pesés et rendements</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Mercuriale fournisseurs intégrée, avec historique de prix et alertes sur hausses</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>19 actions IA pour suggérer recettes, optimiser marges, détecter anomalies</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Multi-restaurant natif avec vue consolidée du food cost groupe</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>PWA mobile + mode kiosk + scan de factures par OCR</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>29 EUR/mois, essai 7 jours sans carte bancaire, aucune commission</span></li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">Ce que RestauMargin ne fait pas</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-amber-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de module de réservation en ligne (utilisez TheFork, Zenchef ou Resy)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de plan de salle digital ni gestion des no-show</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de présence sur l'annuaire TheFork ni de génération de couverts</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de marketing email automatisé (campagnes anniversaire, fidélité)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de programme de fidélité grand public type Yums</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de gestion centralisée des avis Google et TripAdvisor</span></li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>Notre conviction :</strong> un bon outil fait une chose excellemment.
            RestauMargin est conçu pour la gestion des marges et la rentabilité opérationnelle.
            Si vous avez besoin de couverts via la réservation en ligne, TheFork ou Zenchef sont
            plus adaptés. Pour la grande majorité des restaurants, l'idéal est de combiner les
            deux types d'outils : un pour l'acquisition, un pour l'opération.
          </Callout>
        </section>

        {/* ═════════════ SECTION 4 : Tableau comparatif ═════════════ */}
        <section id="tableau" className="mb-16">
          <SectionHeading icon={<Scale className="w-6 h-6" />} number="4">
            Tableau comparatif détaillé (18 critères)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici une comparaison point par point entre TheFork Manager et RestauMargin,
              organisée par catégorie fonctionnelle. Les croix et les coches reflètent uniquement
              la présence d'une fonctionnalité dans le produit, pas un jugement de valeur. Les
              deux outils sont excellents sur leur scope respectif.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-mono-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-950 text-mono-100">
                  <th className="text-left py-4 px-4 font-bold w-[40%]">Critère</th>
                  <th className="text-center py-4 px-4 font-bold w-[30%]">
                    <div className="flex items-center justify-center gap-2">
                      <ChefHat className="w-4 h-4 text-teal-400" />
                      RestauMargin
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 font-bold w-[30%]">
                    <div className="flex items-center justify-center gap-2">
                      <ForkLogo />
                      TheFork Manager
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <ComparisonRow label="Prix mensuel (entry)" rm="29 EUR/mois" zc="39 EUR/mois" winner="rm" />
                <ComparisonRow label="Prix mensuel (top)" rm="79 EUR/mois (Business)" zc="89 EUR/mois (Premium)" winner="rm" />
                <ComparisonRow label="Commission par couvert" rm="0 EUR" zc="2-6 EUR HT/couvert" winner="rm" />
                <ComparisonRow label="Essai gratuit" rm="7 jours, sans CB" zc="Démo commerciale" winner="rm" />
                <ComparisonRow label="Calcul food cost" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="Fiches techniques" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="Gestion des stocks" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="Mercuriale fournisseurs" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="IA + suggestions" rm="19 actions IA" zc="Limitée au marketing" winner="rm" />
                <ComparisonRow label="Menu engineering" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="HACCP digital" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="Réservations en ligne" rm={false} zc={true} winner="zc" />
                <ComparisonRow label="Annuaire grand public" rm={false} zc="1,7M users France" winner="zc" />
                <ComparisonRow label="Plan de salle digital" rm={false} zc={true} winner="zc" />
                <ComparisonRow label="Gestion no-show" rm={false} zc={true} winner="zc" />
                <ComparisonRow label="Programme fidélité Yums" rm={false} zc={true} winner="zc" />
                <ComparisonRow label="Marketing email/SMS" rm={false} zc={true} winner="zc" />
                <ComparisonRow label="Multi-restaurant" rm={true} zc={true} winner="tie" />
                <ComparisonRow label="Mobile / PWA kiosk" rm="PWA + mode kiosk balance" zc="App mobile classique" winner="rm" />
                <ComparisonRow label="Scan de factures (OCR)" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="Support client" rm="Email + chat, < 4h" zc="Email + tel (premium)" winner="tie" />
              </tbody>
            </table>
          </div>

          <Callout type="info">
            <strong>Lecture du tableau :</strong> la victoire d'un outil sur un critère reflète
            la présence d'une fonctionnalité native, pas une note qualitative. TheFork gagne
            logiquement sur tous les critères "acquisition client" et "remplissage de salle" ;
            RestauMargin gagne sur tous les critères "gestion opérationnelle et rentabilité".
            C'est précisément la complémentarité que la majorité des restaurateurs exploitent
            au quotidien.
          </Callout>
        </section>

        {/* ═════════════ SECTION 5 : Cas d'usage ═════════════ */}
        <section id="cas-usage" className="mb-16">
          <SectionHeading icon={<Users className="w-6 h-6" />} number="5">
            Quel outil pour quel besoin ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              Plutôt qu'un verdict unique, voici les trois scénarios les plus fréquents observés
              chez nos clients. Identifiez le profil le plus proche du vôtre pour faire le bon
              choix.
            </p>
          </div>

          <div className="grid gap-6 mt-8">
            <ScenarioCard
              badge="Profil 1"
              title="Vous avez besoin de réservations en ligne et de visibilité"
              recommendation="TheFork Manager uniquement (pour l'instant)"
              recoColor="blue"
              desc="Vous démarrez ou votre priorité numéro un est de remplir votre salle. TheFork est légitime : 1,7 million d'utilisateurs en France et une présence forte sur Google. Démarrez avec TheFork Manager seul, puis ajoutez RestauMargin quand vous voudrez maîtriser vos marges (la majorité de nos clients franchissent ce cap au bout de 6-12 mois)."
            />
            <ScenarioCard
              badge="Profil 2"
              title="Vous avez TheFork mais vous ne maîtrisez pas vos marges"
              recommendation="TheFork + RestauMargin en complément"
              recoColor="emerald"
              desc="C'est le cas le plus fréquent. Vous générez des couverts via TheFork, mais vous ne savez pas exactement combien rapporte chaque plat, comment vos coûts évoluent, où sont vos fuites de marge. Ajoutez RestauMargin (29 EUR/mois) en parallèle : aucune intégration à faire, les deux outils répondent à des besoins différents. ROI typique : récupération des 29 EUR en moins d'un mois grâce aux optimisations identifiées."
            />
            <ScenarioCard
              badge="Profil 3"
              title="Vous êtes un groupe de plusieurs restaurants"
              recommendation="RestauMargin Business + TheFork Premium"
              recoColor="purple"
              desc="Vous avez besoin d'une vue consolidée des marges et d'un benchmarking entre établissements (RestauMargin Business à 79 EUR/mois). Vous avez aussi besoin de centraliser la gestion de salle et d'optimiser le remplissage sur tous vos sites (TheFork Premium). C'est la combinaison la plus puissante du marché pour cette taille, totalisant environ 170 EUR/mois pour un système complet acquisition + opération."
            />
          </div>

          <Callout type="info">
            <strong>Notre engagement :</strong> nous ne cherchons pas à remplacer TheFork. Au
            contraire, nous travaillons à 100 % en complémentarité avec votre système de
            réservation, quel qu'il soit. Si vous testez RestauMargin pendant les 7 jours d'essai
            et que vous réalisez que votre vrai besoin du moment est la réservation (pas la
            marge), nous vous recommanderons honnêtement TheFork ou Zenchef.
          </Callout>
        </section>

        {/* ═════════════ SECTION 6 : Prix sur 12 mois ═════════════ */}
        <section id="prix" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="6">
            Comparaison de prix sur 12 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le coût total annuel dépend fortement du nombre de couverts générés via TheFork.
              Pour comparer objectivement, voici une simulation avec différents volumes de
              couverts TheFork (la commission étant facturée sur chaque couvert réservé via la
              plateforme).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-mono-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-950 text-mono-100">
                  <th className="text-left py-4 px-4 font-bold">Formule</th>
                  <th className="text-right py-4 px-4 font-bold">Abonnement /an</th>
                  <th className="text-right py-4 px-4 font-bold">Commission /an</th>
                  <th className="text-right py-4 px-4 font-bold">Total /an</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-emerald-50 border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-emerald-900">RestauMargin Pro</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">348 EUR</td>
                  <td className="py-3 px-4 text-right text-emerald-700">0 EUR</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">348 EUR</td>
                </tr>
                <tr className="bg-emerald-50/40 border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-emerald-900">RestauMargin Business</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">948 EUR</td>
                  <td className="py-3 px-4 text-right text-emerald-700">0 EUR</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">948 EUR</td>
                </tr>
                <tr className="bg-white border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-mono-100">TheFork Basic (300 couv/mois)</td>
                  <td className="py-3 px-4 text-right">468 EUR</td>
                  <td className="py-3 px-4 text-right text-amber-700">+ 7 200 EUR</td>
                  <td className="py-3 px-4 text-right font-semibold">7 668 EUR</td>
                </tr>
                <tr className="bg-mono-1000 border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-mono-100">TheFork Standard (500 couv/mois)</td>
                  <td className="py-3 px-4 text-right">828 EUR</td>
                  <td className="py-3 px-4 text-right text-amber-700">+ 12 000 EUR</td>
                  <td className="py-3 px-4 text-right font-semibold">12 828 EUR</td>
                </tr>
                <tr className="bg-white border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-mono-100">TheFork Premium (800 couv/mois)</td>
                  <td className="py-3 px-4 text-right">1 068 EUR</td>
                  <td className="py-3 px-4 text-right text-amber-700">+ 19 200 EUR</td>
                  <td className="py-3 px-4 text-right font-semibold">20 268 EUR</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Attention à la lecture :</strong> ce tableau ne signifie pas que TheFork
              "coûte cher". Les commissions sont à mettre en regard du chiffre d'affaires
              généré par TheFork. Sur un ticket moyen de 35 EUR, 800 couverts TheFork = 28 000
              EUR de CA mensuel, soit 336 000 EUR/an. La commission représente alors environ
              5,7 % du CA généré par ce canal, ce qui reste compétitif vs la publicité Google
              Ads.
            </p>
            <p>
              En revanche, le tableau illustre <strong>pourquoi il est crucial d'optimiser ses
              marges quand on dépend fortement de TheFork</strong>. Plus la commission ronge votre
              marge brute, plus chaque point gagné sur le food cost compte. C'est exactement le
              rôle de RestauMargin : pour 29 EUR/mois (soit 0,1 % d'un CA de 336 000 EUR), vous
              récupérez en moyenne 2 à 4 points de marge brute, ce qui représente 6 720 à 13 440
              EUR par an dans ce scénario.
            </p>
            <p>
              Combinaison gagnante : <strong>TheFork (acquisition) + RestauMargin
              (rentabilité)</strong>. Le ROI est mathématiquement positif dès le premier mois
              d'utilisation sérieuse.
            </p>
          </div>

          <Callout type="info">
            <strong>Le saviez-vous ?</strong> Un restaurant qui améliore son food cost de 2 points
            (par exemple de 32 % à 30 %) sur un CA de 400 000 EUR gagne <strong>8 000 EUR de
            marge brute supplémentaire par an</strong>. RestauMargin se rentabilise donc dès le
            premier mois d'utilisation sérieuse, même si vous continuez à payer vos commissions
            TheFork.
          </Callout>
        </section>

        {/* ═════════════ SECTION 7 : Témoignages ═════════════ */}
        <section id="temoignages" className="mb-16">
          <SectionHeading icon={<Quote className="w-6 h-6" />} number="7">
            Témoignages de restaurateurs
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici quelques retours représentatifs de clients qui utilisent RestauMargin en
              complément de TheFork Manager. Les prénoms ont été modifiés pour préserver
              l'anonymat des établissements.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 mt-8">
            <TestimonialCard
              quote="On a TheFork depuis 5 ans et ça marche très bien pour le remplissage. Le problème, c'est qu'avec les commissions, on a vu notre marge fondre sans comprendre où ça fuyait. RestauMargin a tout révélé en 2 semaines : food cost, plats déficitaires, fournisseurs qui ont augmenté en douce. On a récupéré 6 points de marge."
              author="Julien P."
              role="Brasserie, Toulouse"
              rating={5}
            />
            <TestimonialCard
              quote="Pour mon petit bistrot, je n'ai jamais pu me passer de TheFork (c'est 30 % de mes couverts). Mais j'avais besoin d'un outil de gestion en complément, pas d'un deuxième système de réservation à 90 EUR/mois. RestauMargin à 29 EUR/mois, c'est exactement ce qu'il me fallait, sans doublon."
              author="Marie-Claire D."
              role="Bistrot indépendant, Nantes"
              rating={5}
            />
            <TestimonialCard
              quote="Le scan de factures et la mercuriale m'ont fait gagner 4 heures par semaine. Aucun équivalent chez TheFork qui n'a pas vocation à gérer mes fournisseurs. L'IA suggère même quand un fournisseur a augmenté ses prix de plus de 5 %. C'est complémentaire à 100 %, jamais un conflit avec TheFork."
              author="Hadrien L."
              role="Chef-propriétaire, Marseille"
              rating={5}
            />
            <TestimonialCard
              quote="Pour notre groupe de 6 restaurants, on utilise RestauMargin Business pour le pilotage des marges (vue consolidée) et TheFork Premium pour les réservations sur tous les sites. Les deux outils n'ont jamais eu à dialoguer entre eux, et c'est très bien comme ça : chacun excelle dans son scope."
              author="Antoine R."
              role="Directeur d'exploitation, groupe Île-de-France"
              rating={5}
            />
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="11 min" variant="footer" />

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
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Testez RestauMargin gratuitement pendant 7 jours
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Continuez à utiliser TheFork Manager pour vos réservations, et ajoutez RestauMargin
              pour reprendre la main sur vos marges. Sans carte bancaire, sans engagement.
            </p>
            <p className="text-teal-50 text-base max-w-xl mx-auto mb-8">
              <strong>29 EUR/mois</strong> à partir du 8e jour si vous décidez de continuer.
              Annulation en un clic. Aucune commission par couvert.
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
                to="/pricing"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
              >
                <DollarSign className="w-5 h-5" />
                Voir les tarifs
              </Link>
            </div>
          </div>
        </section>

        {/* ═════════════ Articles complementaires ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/livraison-restaurant-rentabilite" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Livraison et rentabilité</h3>
              <p className="text-xs text-mono-500">Comment calculer la rentabilité réelle d'un canal de distribution comme TheFork ou Uber Eats.</p>
            </Link>
            <Link to="/blog/fideliser-clients-restaurant-strategies" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Fidéliser ses clients</h3>
              <p className="text-xs text-mono-500">10 stratégies concrètes pour réduire la dépendance aux plateformes et fidéliser en direct.</p>
            </Link>
            <Link to="/alternative-zenchef" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Alternative Zenchef</h3>
              <p className="text-xs text-mono-500">Comparatif complémentaire entre Zenchef et RestauMargin pour la gestion d'un restaurant.</p>
            </Link>
            <Link to="/pricing" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Tarifs RestauMargin</h3>
              <p className="text-xs text-mono-500">Formules Pro et Business, comparaison détaillée des fonctionnalités.</p>
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
          <p className="mb-4">
            La plateforme de gestion de marge pour les restaurateurs.
          </p>
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

function ReasonCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-6">
      <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-bold text-mono-100 mb-2">{title}</h3>
      <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function ForkLogo() {
  return (
    <div className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center text-[10px] font-bold text-white">F</div>
  );
}

function ComparisonRow({ label, rm, zc, winner }: {
  label: string;
  rm: boolean | string;
  zc: boolean | string;
  winner: 'rm' | 'zc' | 'tie';
}) {
  const renderCell = (val: boolean | string, isWinner: boolean) => {
    if (typeof val === 'boolean') {
      return val ? (
        <CheckCircle className={`w-5 h-5 mx-auto ${isWinner ? 'text-emerald-600' : 'text-emerald-500'}`} />
      ) : (
        <XCircle className="w-5 h-5 mx-auto text-mono-700" />
      );
    }
    return <span className={`text-sm ${isWinner ? 'font-bold text-mono-100' : 'text-mono-400'}`}>{val}</span>;
  };

  return (
    <tr className="border-t border-mono-900 hover:bg-mono-1000 transition-colors">
      <td className="py-3.5 px-4 text-mono-100 font-medium">{label}</td>
      <td className={`py-3.5 px-4 text-center ${winner === 'rm' ? 'bg-emerald-50' : ''}`}>
        {renderCell(rm, winner === 'rm')}
      </td>
      <td className={`py-3.5 px-4 text-center ${winner === 'zc' ? 'bg-green-50' : ''}`}>
        {renderCell(zc, winner === 'zc')}
      </td>
    </tr>
  );
}

function ScenarioCard({ badge, title, recommendation, recoColor, desc }: {
  badge: string;
  title: string;
  recommendation: string;
  recoColor: 'emerald' | 'blue' | 'purple';
  desc: string;
}) {
  const colors = {
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', badge: 'bg-emerald-600' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', badge: 'bg-blue-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', badge: 'bg-purple-600' },
  };
  const c = colors[recoColor];

  return (
    <div className={`${c.bg} border ${c.border} rounded-3xl p-6 sm:p-8`}>
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className={`${c.badge} text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full`}>
          {badge}
        </span>
        <span className={`${c.text} text-xs font-semibold flex items-center gap-1.5`}>
          <Target className="w-3.5 h-3.5" />
          Reco : {recommendation}
        </span>
      </div>
      <h3 className={`font-bold text-lg ${c.text} mb-3`}>{title}</h3>
      <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, role, rating }: {
  quote: string;
  author: string;
  role: string;
  rating: number;
}) {
  return (
    <div className="bg-white border border-mono-900 rounded-3xl p-6 sm:p-7">
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <Quote className="w-6 h-6 text-teal-600 mb-3 opacity-50" />
      <p className="text-sm text-mono-350 leading-relaxed mb-4 italic">"{quote}"</p>
      <div className="flex items-center gap-3 pt-3 border-t border-mono-900">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-sm">
          {author.split(' ').map((n) => n[0]).join('')}
        </div>
        <div>
          <div className="font-bold text-mono-100 text-sm">{author}</div>
          <div className="text-xs text-mono-500">{role}</div>
        </div>
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
    <details className="bg-mono-1000 border border-mono-900 rounded-2xl group">
      <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors">
        {q}
        <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform" />
      </summary>
      <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{a}</p>
    </details>
  );
}
