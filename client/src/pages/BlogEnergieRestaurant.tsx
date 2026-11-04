import { Link } from 'react-router-dom';
import { ChefHat, ArrowRight, Zap, Lightbulb, Snowflake, Wind, Power, Flame, Droplets, FileText, Award, Users, Gift, BookOpen, TrendingUp, AlertTriangle, BarChart3, Sparkles, Sun, Calculator } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Cout energie restaurant 2026 : guide complet + 25 actions"
   Mots-cles : cout energie restaurant, economie energie cuisine pro
   ~3 200 mots — mode clair, fond blanc, theme W&B teal-600
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Quel est le budget énergie moyen d'un restaurant en 2026 ?",
    answer: "Le budget énergie représente 3 à 7 % du chiffre d'affaires HT pour un restaurant traditionnel, et peut grimper à 8-10 % pour les pizzerias (four à forte conso) ou les restaurants avec climatisation intensive. Pour un restaurant de 500 000 EUR de CA, comptez 15 000 à 35 000 EUR par an. Les hausses 2022-2025 ont fait basculer ce poste dans le top 3 des charges variables, juste derrière matières premières et personnel.",
  },
  {
    question: "Comment se répartit la consommation énergétique en cuisine professionnelle ?",
    answer: "Répartition typique : cuisson 60 % (fours, plaques, friteuses, salamandres), froid 20 % (chambres froides, frigos, congélateurs), eau chaude sanitaire 10 %, éclairage 5 %, divers 5 % (caisse, audio, ventilation, climatisation). En pizzeria, la cuisson peut monter à 70 %. En restauration rapide, le froid grimpe à 30 % du fait du stockage des produits prêts.",
  },
  {
    question: "Quels sont les tarifs électricité et gaz pour un restaurant en 2026 ?",
    answer: "Électricité professionnelle (tarif jaune, puissance 36-250 kVA) : 0,18 à 0,24 EUR/kWh HTVA selon le fournisseur et le contrat. Gaz naturel professionnel : 0,08 à 0,12 EUR/kWh HTVA. Eau : 4,50 à 5,50 EUR/m3 (incluant assainissement). Ces tarifs ont baissé depuis le pic 2022 mais restent 40 à 60 % plus élevés qu'avant la crise énergétique.",
  },
  {
    question: "Combien consomme un four professionnel en restauration ?",
    answer: "Un four mixte 6 niveaux électrique consomme 8 à 12 kWh/h en pleine charge, soit 60 à 90 kWh/jour pour un service de 8 heures actives. À 0,20 EUR/kWh, cela représente 4 400 à 6 600 EUR par an. Un four à pizza gaz : 12 à 18 kWh/h. Une friteuse pro : 6 à 10 kWh/h. Un lave-vaisselle pro : 3 à 5 kWh/cycle de 90 secondes plus 12 à 20 L d'eau chaude.",
  },
  {
    question: "Combien d'économie cumulée en appliquant les 25 actions de ce guide ?",
    answer: "Réaliste : 25 à 40 % de réduction de la facture totale d'énergie sur 12 mois. Pour un restaurant qui paye 25 000 EUR/an : 6 250 à 10 000 EUR d'économie annuelle récurrente. Les actions sans investissement (extinction, régulation, formation équipe) apportent déjà 8 à 15 %. Les actions avec investissement modéré (LED, joints, variateurs) ajoutent 10 à 15 %. Les actions structurelles (heat recovery, photovoltaïque) complètent jusqu'à 40 %.",
  },
  {
    question: "Quelles aides énergie sont disponibles pour les restaurants en 2026 ?",
    answer: "Trois principaux dispositifs : 1) Certificats d'Économies d'Énergie (CEE), qui financent 20 à 70 % des travaux d'efficacité (hotte, éclairage LED, chambre froide neuve). 2) France 2030, volet decarbonation industrie et tertiaire (jusqu'à 50 % de subvention pour heat recovery, récupération de chaleur). 3) Aides régionales : par exemple AURA en Auvergne-Rhone-Alpes, Bretagne Énergie, Île-de-France TPE Verte. Passer par un installateur RGE est obligatoire pour la majorité des aides.",
  },
  {
    question: "Le passage du gaz à l'induction est-il rentable ?",
    answer: "Si votre matériel gaz a plus de 10 ans : oui, ROI typique 3 à 5 ans. L'induction a un rendement de 90 % contre 50 à 55 % pour le gaz. Une plaque induction pro 5 kW consomme réellement 60 à 70 % d'énergie en moins qu'une plaque gaz équivalente. Inconvénient : l'investissement (3 000 à 8 000 EUR par plaque) et la nécessité d'avoir des casseroles compatibles. Si votre gaz est récent (moins de 5 ans), attendez la fin de vie pour amortir l'existant.",
  },
  {
    question: "Le tarif Heures Creuses est-il intéressant pour un restaurant ?",
    answer: "Rarement, car la consommation principale d'un restaurant tombe sur le créneau midi-soir (11h-15h et 18h-23h), classés en heures pleines. Le tarif HC peut être intéressant uniquement si vous avez un gros lave-vaisselle nocturne, une production matinale (boulangerie intégrée), ou un ballon d'eau chaude programmable. Demandez un audit tarifaire à votre fournisseur avant de souscrire un contrat HP/HC qui peut s'avérer plus cher au final.",
  },
  {
    question: "Peut-on installer du photovoltaïque sur un restaurant ?",
    answer: "Oui, si vous êtes propriétaire ou avec accord écrit du bailleur, et si la toiture fait plus de 50 m2. Investissement typique 8 000 à 25 000 EUR pour 5 à 12 kWc. Production attendue : 5 000 à 14 000 kWh/an dans le sud, 4 000 à 11 000 kWh/an dans le nord. Autoconsommation possible (priorité midi quand restaurant consomme le plus), revente du surplus à EDF OA. ROI 7 à 12 ans, garantie 25 ans sur les panneaux. Subventions France 2030 et prime à l'autoconsommation.",
  },
  {
    question: "Faut-il faire un audit énergétique professionnel ?",
    answer: "Oui dès que votre facture énergie dépasse 20 000 EUR/an. Coût d'un audit réglementaire NF EN 16247 : 1 500 à 3 500 EUR. ROI typique : moins de 18 mois. L'audit identifie précisément les pertes (relevé de consommation poste par poste, thermographie infrarouge, analyse du contrat) et chiffre les économies potentielles. Obligatoire tous les 4 ans pour les entreprises de plus de 250 salariés ou 50 M EUR de CA, mais très recommandé dès le seuil dès 20 kEUR de facture.",
  },
];

export default function BlogEnergieRestaurant() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Coût énergie restaurant 2026 : budget, répartition et 25 actions d'économie"
        description="Guide complet du coût énergie en restauration 2026 : budget moyen 3-7 % du CA, répartition cuisine 60 %, tarifs élec/gaz/eau, 25 actions concrètes pour réduire la facture de 25 à 40 %, aides CEE et France 2030."
        path="/blog/reduire-facture-energie-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Coût énergie restaurant', url: 'https://www.restaumargin.fr/blog/reduire-facture-energie-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Comment réaliser un audit énergétique de restaurant en 7 étapes',
            description: "Méthode pas-à-pas pour identifier les sources de gaspillage énergétique en cuisine professionnelle et chiffrer les économies.",
            totalTime: 'PT4H',
            tool: ['Pince ampèremétrique', 'Thermomètre infrarouge', 'Compteur communicant', 'Tableur ou logiciel RestauMargin'],
            step: [
              { '@type': 'HowToStep', name: 'Collecter les 12 dernières factures', text: 'Réunissez vos 12 dernières factures électricité, gaz et eau pour établir une consommation de référence mensuelle et identifier la saisonnalité.' },
              { '@type': 'HowToStep', name: 'Cartographier les équipements', text: 'Listez chaque équipement consommateur avec sa puissance nominale en kW et son temps de fonctionnement quotidien estimé.' },
              { '@type': 'HowToStep', name: 'Mesurer les consommations réelles', text: 'Utilisez une pince ampèremétrique pour mesurer la consommation réelle de chaque équipement majeur sur un service complet.' },
              { '@type': 'HowToStep', name: 'Détecter les pertes thermiques', text: "Avec un thermomètre infrarouge, contrôlez les joints de chambres froides, l'isolation des conduits d'eau chaude et la dispersion thermique des hottes." },
              { '@type': 'HowToStep', name: 'Analyser les courbes de charge', text: "Demandez à votre fournisseur la courbe de charge horaire (compteur Linky pro). Identifiez les pics et les consommations nocturnes inexpliquées." },
              { '@type': 'HowToStep', name: 'Calculer le ratio kWh/couvert', text: 'Divisez la consommation mensuelle totale par le nombre de couverts servis. Cible : 8-12 kWh/couvert restaurant traditionnel, 5-8 kWh/couvert restauration rapide.' },
              { '@type': 'HowToStep', name: 'Prioriser les actions par ROI', text: "Classez les actions identifiées par retour sur investissement décroissant : commencez par les quick wins gratuits, puis les investissements à ROI < 24 mois." },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: "Coût énergie restaurant 2026 : guide complet + 25 actions d'économie",
            description: 'Budget énergie 3-7 % du CA en 2026, répartition par poste, tarifs élec/gaz/eau, conso par équipement, 25 actions concrètes pour réduire la facture de 25 à 40 %, aides CEE et France 2030.',
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-05-26',
            dateModified: '2026-05-26',
            wordCount: 3200,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/reduire-facture-energie-restaurant' },
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
              to="/login?mode=register"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Zap className="w-4 h-4" />
              Suivre mes charges
            </Link>
            <Link to="/login" className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">Connexion</Link>
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
          <span className="text-mono-100 font-medium">Coût énergie restaurant 2026</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Économies"
        readTime="14 min"
        date="Mai 2026"
        title="Coût énergie restaurant 2026 : guide complet + 25 actions"
        accentWord="énergie"
        subtitle="Le budget énergie pèse 3 à 7 % du CA en restauration en 2026. Découvrez la répartition par poste, les tarifs actuels élec/gaz/eau, la consommation réelle de vos équipements et 25 actions concrètes pour réduire votre facture de 25 à 40 % par an."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="14 min" variant="header" />

        {/* ── Encadre chiffres cles ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Chiffres clés énergie restauration 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">Les 4 indicateurs à retenir</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 grid grid-cols-2 gap-4 text-sm sm:text-base">
            <div>
              <div className="text-3xl font-extrabold text-white">3-7 %</div>
              <div className="text-teal-100 text-xs mt-1">Part du CA en énergie</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">60 %</div>
              <div className="text-teal-100 text-xs mt-1">Conso liée à la cuisson</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">25-40 %</div>
              <div className="text-teal-100 text-xs mt-1">Économie possible/an</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">10 kWh</div>
              <div className="text-teal-100 text-xs mt-1">Conso moy./couvert</div>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Source : agrégation données ADEME, Atee, GIRA Conseil.
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
              { href: '#budget', label: 'Budget moyen énergie restaurant en 2026' },
              { href: '#repartition', label: 'Répartition consommation : cuisine 60 %, salle 20 %' },
              { href: '#tarifs', label: 'Tarifs 2026 : électricité, gaz, eau' },
              { href: '#equipements', label: 'Consommation par équipement (four, friteuse, frigo)' },
              { href: '#audit', label: 'Audit énergétique : 7 étapes concrètes' },
              { href: '#actions', label: '25 actions concrètes pour réduire la facture' },
              { href: '#aides', label: 'Aides 2026 : CEE, France 2030, régionales' },
              { href: '#roi', label: "ROI : quels investissements rentables en 24 mois ?" },
              { href: '#faq', label: 'Questions fréquentes' },
              { href: '#cta', label: 'Suivez vos charges énergie avec RestauMargin' },
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

          {/* ═════════════ SECTION 1 : Budget moyen ═════════════ */}
          <section id="budget" className="mb-16">
            <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="1">
              Budget moyen énergie restaurant en 2026
            </SectionHeading>

            <div className="prose-content">
              <p>
                En 2026, le coût énergie d'un restaurant représente entre 3 et 7 % du chiffre
                d'affaires HT, avec une médiane autour de 5 %. Cette fourchette varie fortement
                selon le type d'établissement, l'ancienneté du matériel et la zone géographique.
                Pour mettre cela en perspective, c'est devenu le 3e poste de charges variables,
                juste après les matières premières (25-35 %) et le personnel (30-40 %).
              </p>
              <p>
                Avant la crise énergétique de 2022, ce poste pesait 2 à 4 % du CA. La hausse des
                tarifs réglementés électricité (plus de 60 % cumulés sur 2022-2024) et du gaz
                naturel (plus de 80 % en pic) a fait basculer l'énergie dans une catégorie à
                surveiller mensuellement, au même titre que le food cost.
              </p>
            </div>

            <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
              <h3 className="font-bold text-mono-100 mb-4 text-lg">Budget énergie selon type d'établissement</h3>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-white text-mono-350 border-b border-mono-900">
                    <th className="text-left py-2 px-3 font-semibold">Type de restaurant</th>
                    <th className="text-right py-2 px-3 font-semibold">% du CA</th>
                    <th className="text-right py-2 px-3 font-semibold">Budget annuel typique</th>
                    <th className="text-right py-2 px-3 font-semibold">Ratio kWh/couvert</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  <tr><td className="py-2 px-3">Restauration rapide / Fast-food</td><td className="py-2 px-3 text-right">4 - 6 %</td><td className="py-2 px-3 text-right">12 000 - 25 000 EUR</td><td className="py-2 px-3 text-right">5 - 8</td></tr>
                  <tr><td className="py-2 px-3">Bistrot / Brasserie</td><td className="py-2 px-3 text-right">4 - 6 %</td><td className="py-2 px-3 text-right">20 000 - 40 000 EUR</td><td className="py-2 px-3 text-right">8 - 12</td></tr>
                  <tr><td className="py-2 px-3">Restaurant traditionnel</td><td className="py-2 px-3 text-right">5 - 7 %</td><td className="py-2 px-3 text-right">25 000 - 45 000 EUR</td><td className="py-2 px-3 text-right">10 - 14</td></tr>
                  <tr><td className="py-2 px-3">Pizzeria</td><td className="py-2 px-3 text-right">6 - 10 %</td><td className="py-2 px-3 text-right">18 000 - 35 000 EUR</td><td className="py-2 px-3 text-right">12 - 18</td></tr>
                  <tr><td className="py-2 px-3">Restaurant gastronomique</td><td className="py-2 px-3 text-right">5 - 8 %</td><td className="py-2 px-3 text-right">35 000 - 80 000 EUR</td><td className="py-2 px-3 text-right">15 - 22</td></tr>
                  <tr><td className="py-2 px-3">Coffee shop / Salon de thé</td><td className="py-2 px-3 text-right">3 - 5 %</td><td className="py-2 px-3 text-right">8 000 - 18 000 EUR</td><td className="py-2 px-3 text-right">3 - 6</td></tr>
                  <tr><td className="py-2 px-3">Food truck</td><td className="py-2 px-3 text-right">2 - 4 %</td><td className="py-2 px-3 text-right">3 000 - 9 000 EUR</td><td className="py-2 px-3 text-right">4 - 7</td></tr>
                </tbody>
              </table>
            </div>

            <Callout type="info">
              <strong>À retenir :</strong> pour bien piloter votre coût énergie restaurant,
              calculez votre ratio kWh par couvert servi. C'est l'indicateur de productivité
              énergétique le plus fiable, indépendant de la taille de l'établissement.
            </Callout>
          </section>

          {/* ═════════════ SECTION 2 : Repartition ═════════════ */}
          <section id="repartition" className="mb-16">
            <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="2">
              Répartition consommation : cuisine 60 %, salle 20 %
            </SectionHeading>

            <div className="prose-content">
              <p>
                Avant de chercher à économiser, il faut comprendre OÙ part votre énergie.
                Voici la répartition moyenne pour un restaurant traditionnel 80 couverts en
                France, basée sur les données ADEME et nos propres mesures.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mt-8">
              {[
                { icon: <Flame className="w-5 h-5" />, label: 'Cuisson (cuisine)', pct: '60 %', desc: 'Fours, plaques, friteuses, salamandres, plonge. Le poste numéro 1, écrasant.' },
                { icon: <Snowflake className="w-5 h-5" />, label: 'Salle + climatisation', pct: '20 %', desc: 'Climatisation, chauffage salle, vitrines réfrigérées, machines à café.' },
                { icon: <Droplets className="w-5 h-5" />, label: 'Eau chaude sanitaire', pct: '10 %', desc: 'Ballon eau chaude, lavabos, plonge manuelle, lave-vaisselle pro.' },
                { icon: <Lightbulb className="w-5 h-5" />, label: 'Éclairage', pct: '5 %', desc: 'Salle, cuisine, sanitaires, extérieur, vitrines. Variable selon LED/halogène.' },
                { icon: <Wind className="w-5 h-5" />, label: 'Hotte + extraction', pct: '3 %', desc: 'Ventilateur d air vicié. Souvent tourne 100 % en continu (mauvais réflexe).' },
                { icon: <Power className="w-5 h-5" />, label: 'Divers (caisse, audio)', pct: '2 %', desc: 'Tablettes, ordinateurs, audio, écrans menu, frigos de bureau.' },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-mono-900 rounded-2xl p-5 hover:border-teal-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600">{item.icon}</div>
                      <h3 className="font-bold text-mono-100">{item.label}</h3>
                    </div>
                    <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold">{item.pct}</span>
                  </div>
                  <p className="text-sm text-mono-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="prose-content mt-8">
              <p>
                <strong>Variations selon le type :</strong> en pizzeria, la cuisson grimpe à
                70 % (four toujours allumé). En coffee shop, la machine à café pro représente
                40 à 50 % de la facture. En restauration rapide, le froid (stockage produits
                prêts) monte à 30 %. Adaptez votre plan d'action à votre profil réel.
              </p>
              <p>
                Levier #1 : si vous voulez vraiment baisser votre coût énergie restaurant,
                attaquez-vous d'abord à la cuisson. Une optimisation de 10 % sur ce poste
                rapporte plus qu'une division par 2 de l'éclairage.
              </p>
            </div>
          </section>

          {/* ═════════════ SECTION 3 : Tarifs 2026 ═════════════ */}
          <section id="tarifs" className="mb-16">
            <SectionHeading icon={<FileText className="w-6 h-6" />} number="3">
              Tarifs énergie 2026 : électricité, gaz, eau
            </SectionHeading>

            <div className="prose-content">
              <p>
                Connaître les tarifs en vigueur est essentiel pour négocier votre contrat
                fournisseur. Voici les fourchettes constatées sur le marché français en mai 2026,
                hors taxes (CSPE, CTA, TICGN). La TVA sur l'énergie pro reste à 20 %.
              </p>
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-mono-975 text-mono-350">
                    <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Énergie</th>
                    <th className="text-center py-3 px-4 font-semibold">Tarif moyen HT 2026</th>
                    <th className="text-center py-3 px-4 font-semibold">Fourchette marché</th>
                    <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Évolution vs 2022</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Électricité tarif bleu pro (less than 36 kVA)</td><td className="py-3 px-4 text-center">0,22 EUR/kWh</td><td className="py-3 px-4 text-center">0,20 - 0,28 EUR/kWh</td><td className="py-3 px-4 text-center text-red-700">+ 65 %</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Électricité tarif jaune (36-250 kVA)</td><td className="py-3 px-4 text-center">0,20 EUR/kWh</td><td className="py-3 px-4 text-center">0,18 - 0,24 EUR/kWh</td><td className="py-3 px-4 text-center text-red-700">+ 55 %</td></tr>
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Gaz naturel pro</td><td className="py-3 px-4 text-center">0,10 EUR/kWh</td><td className="py-3 px-4 text-center">0,08 - 0,12 EUR/kWh</td><td className="py-3 px-4 text-center text-red-700">+ 70 %</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Eau (avec assainissement)</td><td className="py-3 px-4 text-center">4,80 EUR/m3</td><td className="py-3 px-4 text-center">3,80 - 6,20 EUR/m3</td><td className="py-3 px-4 text-center text-red-700">+ 18 %</td></tr>
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Bouteille gaz propane 13 kg</td><td className="py-3 px-4 text-center">42 EUR/bouteille</td><td className="py-3 px-4 text-center">38 - 48 EUR</td><td className="py-3 px-4 text-center text-red-700">+ 35 %</td></tr>
                </tbody>
              </table>
            </div>

            <Callout type="warning">
              <strong>Négociation contrat :</strong> demandez un comparatif à 3 fournisseurs
              alternatifs (Plum Énergie, ekWateur, Mint, Ohm Énergie, Engie Pro, TotalEnergies Pro).
              L'écart entre le moins cher et le plus cher peut atteindre 20 à 30 % sur l'électricité.
              Privilégiez un prix fixe sur 1 à 2 ans pour vous protéger des hausses.
            </Callout>
          </section>

          {/* ═════════════ SECTION 4 : Equipements ═════════════ */}
          <section id="equipements" className="mb-16">
            <SectionHeading icon={<Power className="w-6 h-6" />} number="4">
              Consommation par équipement de cuisine professionnelle
            </SectionHeading>

            <div className="prose-content">
              <p>
                Pour identifier vos sources de gaspillage, il faut connaître la consommation
                réelle de chaque équipement. Voici les références chiffrées pour les principaux
                matériels de cuisine pro, en pleine utilisation et en veille.
              </p>
            </div>

            <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
              <h3 className="font-bold text-mono-100 mb-4 text-lg">Consommation des équipements de cuisine pro</h3>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-white text-mono-350 border-b border-mono-900">
                    <th className="text-left py-2 px-3 font-semibold">Équipement</th>
                    <th className="text-right py-2 px-3 font-semibold">Puissance</th>
                    <th className="text-right py-2 px-3 font-semibold">Conso/h actif</th>
                    <th className="text-right py-2 px-3 font-semibold">Coût annuel typique</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  <tr><td className="py-2 px-3">Four mixte 6 niveaux électrique</td><td className="py-2 px-3 text-right">12 kW</td><td className="py-2 px-3 text-right">8 - 12 kWh</td><td className="py-2 px-3 text-right font-medium">4 400 - 6 600 EUR</td></tr>
                  <tr><td className="py-2 px-3">Four à pizza électrique 2 chambres</td><td className="py-2 px-3 text-right">18 kW</td><td className="py-2 px-3 text-right">10 - 14 kWh</td><td className="py-2 px-3 text-right font-medium">6 000 - 8 500 EUR</td></tr>
                  <tr><td className="py-2 px-3">Four à pizza gaz</td><td className="py-2 px-3 text-right">25 kW</td><td className="py-2 px-3 text-right">15 - 20 kWh</td><td className="py-2 px-3 text-right font-medium">4 500 - 6 000 EUR</td></tr>
                  <tr><td className="py-2 px-3">Friteuse pro électrique 2 bacs</td><td className="py-2 px-3 text-right">14 kW</td><td className="py-2 px-3 text-right">6 - 10 kWh</td><td className="py-2 px-3 text-right font-medium">3 200 - 5 200 EUR</td></tr>
                  <tr><td className="py-2 px-3">Plaque induction 4 zones</td><td className="py-2 px-3 text-right">10 kW</td><td className="py-2 px-3 text-right">3 - 6 kWh</td><td className="py-2 px-3 text-right font-medium">1 800 - 3 600 EUR</td></tr>
                  <tr><td className="py-2 px-3">Plaque gaz 4 feux pro</td><td className="py-2 px-3 text-right">18 kW</td><td className="py-2 px-3 text-right">8 - 12 kWh</td><td className="py-2 px-3 text-right font-medium">2 400 - 3 600 EUR</td></tr>
                  <tr><td className="py-2 px-3">Salamandre / grille</td><td className="py-2 px-3 text-right">5 kW</td><td className="py-2 px-3 text-right">3 - 5 kWh</td><td className="py-2 px-3 text-right font-medium">1 500 - 2 500 EUR</td></tr>
                  <tr><td className="py-2 px-3">Chambre froide positive 8 m3</td><td className="py-2 px-3 text-right">1,8 kW (compresseur)</td><td className="py-2 px-3 text-right">0,5 - 0,9 kWh</td><td className="py-2 px-3 text-right font-medium">1 200 - 2 000 EUR</td></tr>
                  <tr><td className="py-2 px-3">Chambre froide négative 6 m3</td><td className="py-2 px-3 text-right">2,5 kW</td><td className="py-2 px-3 text-right">0,8 - 1,4 kWh</td><td className="py-2 px-3 text-right font-medium">1 800 - 3 000 EUR</td></tr>
                  <tr><td className="py-2 px-3">Frigo positif sous plan</td><td className="py-2 px-3 text-right">0,5 kW</td><td className="py-2 px-3 text-right">0,15 - 0,30 kWh</td><td className="py-2 px-3 text-right font-medium">320 - 700 EUR</td></tr>
                  <tr><td className="py-2 px-3">Lave-vaisselle à capot pro</td><td className="py-2 px-3 text-right">10 kW</td><td className="py-2 px-3 text-right">3 - 5 kWh/cycle</td><td className="py-2 px-3 text-right font-medium">2 500 - 4 500 EUR</td></tr>
                  <tr><td className="py-2 px-3">Hotte extraction motorisée</td><td className="py-2 px-3 text-right">1,5 kW</td><td className="py-2 px-3 text-right">1,2 - 1,5 kWh</td><td className="py-2 px-3 text-right font-medium">1 800 - 2 400 EUR</td></tr>
                  <tr><td className="py-2 px-3">Machine café pro 2 groupes</td><td className="py-2 px-3 text-right">3,5 kW</td><td className="py-2 px-3 text-right">1,5 - 2,5 kWh</td><td className="py-2 px-3 text-right font-medium">2 000 - 3 500 EUR</td></tr>
                  <tr><td className="py-2 px-3">Ballon eau chaude 300 L</td><td className="py-2 px-3 text-right">3 kW</td><td className="py-2 px-3 text-right">2 - 3 kWh</td><td className="py-2 px-3 text-right font-medium">1 600 - 2 800 EUR</td></tr>
                </tbody>
              </table>
              <p className="text-xs text-mono-500 mt-3">Hypothèse : 250 jours d'ouverture/an, électricité à 0,20 EUR/kWh, gaz à 0,10 EUR/kWh. Coût annuel inclut périodes actives et veille.</p>
            </div>

            <div className="prose-content mt-8">
              <p>
                <strong>Trois enseignements clés :</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-mono-350 mt-3">
                <li>Le <strong>four mixte</strong> est souvent le poste numéro 1 en valeur absolue. Investir dans un modèle récent classe A+++ peut couper la facture de 30 %.</li>
                <li>L'<strong>induction</strong> consomme 50 à 60 % de moins que le gaz pour le même service. ROI 3 à 5 ans si vous remplacez du matériel âgé.</li>
                <li>Les <strong>chambres froides</strong> sont des goulots invisibles : un joint abîmé ou 5 mm de givre fait exploser la conso de 30 à 40 %.</li>
              </ul>
            </div>
          </section>

          {/* ═════════════ SECTION 5 : Audit ═════════════ */}
          <section id="audit" className="mb-16">
            <SectionHeading icon={<FileText className="w-6 h-6" />} number="5">
              Audit énergétique restaurant : 7 étapes concrètes
            </SectionHeading>

            <div className="prose-content">
              <p>
                Avant de lancer des actions, faites un diagnostic complet. Vous pouvez le
                réaliser en interne (gratuit, 4 à 6 heures de travail) ou faire appel à un
                auditeur certifié (1 500 à 3 500 EUR, indispensable au-delà de 25 000 EUR/an
                de facture énergie).
              </p>
            </div>

            <ol className="mt-8 space-y-5">
              {[
                {
                  title: 'Collecter les 12 dernières factures',
                  body: "Réunissez 12 mois de factures électricité, gaz, eau. Sortez la conso totale annuelle (kWh, m3) et le coût total. Identifiez les pics mensuels (été/hiver, périodes touristiques). Calculez le coût au kWh réel (coût total / conso totale)."
                },
                {
                  title: 'Cartographier tous les équipements',
                  body: "Listez chaque équipement avec sa puissance (étiquette CE, plaque signalétique), son âge et son temps de fonctionnement quotidien. Un tableur à 4 colonnes suffit. C'est l'inventaire de base."
                },
                {
                  title: 'Mesurer les consommations réelles',
                  body: "Pince ampèremétrique (50 à 150 EUR) pour mesurer la puissance réelle absorbée par chaque équipement. Comparez avec la puissance nominale. Un équipement encrassé peut surconsommer de 20 à 40 %."
                },
                {
                  title: 'Détecter les pertes thermiques',
                  body: "Thermomètre infrarouge (30 à 80 EUR). Vérifiez joints chambres froides, isolation conduits eau chaude, dispersion thermique hotte. Un point chaud non expliqué = perte."
                },
                {
                  title: 'Analyser la courbe de charge horaire',
                  body: "Demandez à votre fournisseur la courbe de charge horaire (compteur Linky Pro). Vous verrez précisément les pics consommation. Une consommation nocturne de plus de 5 % du pic diurne = appareils oubliés en veille."
                },
                {
                  title: 'Calculer ratio kWh par couvert',
                  body: "Divisez la conso mensuelle totale par le nombre de couverts servis. Cible : 8-12 kWh/couvert restaurant traditionnel, 12-18 kWh/couvert pizzeria, 5-8 kWh/couvert restauration rapide."
                },
                {
                  title: 'Prioriser les actions par ROI',
                  body: "Classez les actions par retour sur investissement. Commencez par les quick wins gratuits (extinction, régulation), puis les investissements ROI < 24 mois (LED, joints, variateurs), enfin les actions structurelles (heat recovery, photovoltaïque)."
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
              <strong>Outil RestauMargin :</strong> notre module suivi des charges enregistre
              automatiquement vos consommations mensuelles et calcule votre ratio kWh/couvert
              en temps réel. Vous voyez immédiatement si vous dérivez vs vos objectifs.
            </Callout>
          </section>

          {/* ═════════════ SECTION 6 : 25 actions ═════════════ */}
          <section id="actions" className="mb-16">
            <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="6">
              25 actions concrètes pour réduire votre facture énergie
            </SectionHeading>

            <div className="prose-content">
              <p>
                Voici 25 actions concrètes classées par catégorie. Chacune indique
                l'investissement, l'économie attendue et le ROI. Combinez 10 à 15 actions
                pour atteindre l'objectif de 25 à 40 % d'économie annuelle.
              </p>
            </div>

            {/* Eclairage */}
            <ActionCategory icon={<Lightbulb className="w-5 h-5" />} title="Éclairage (5 actions)" color="amber">
              <ActionItem n={1} title="Remplacer toutes les ampoules par du LED" invest="200-800 EUR" eco="60-80 % sur éclairage" roi="6-12 mois">Halogènes 50W deviennent LED 5W. Garantie 5 ans (Philips, Osram). LED dimmable 2700-3000K en salle, 4000K en cuisine.</ActionItem>
              <ActionItem n={2} title="Installer des détecteurs de présence" invest="80-200 EUR/pièce" eco="30-50 % sur zones intermittentes" roi="8-15 mois">Sanitaires, vestiaires, couloirs, réserves. Éclairage qui s'éteint seul après 5 minutes sans mouvement.</ActionItem>
              <ActionItem n={3} title="Crépusculaire vitrines et éclairage extérieur" invest="50-150 EUR" eco="20-30 % sur éclairage extérieur" roi="6-12 mois">Cellule qui allume/éteint l'enseigne selon la luminosité naturelle, plus précis qu'un horaire fixe.</ActionItem>
              <ActionItem n={4} title="Maximiser la lumière naturelle en salle" invest="0 EUR (rideaux/tissus clairs)" eco="10-20 % sur éclairage diurne" roi="immédiat">Rideaux clairs, miroirs stratégiques, tables plus proches des baies vitrées. La lumière naturelle est gratuite.</ActionItem>
              <ActionItem n={5} title="Éclairage zone réduit hors service" invest="0 EUR (planification)" eco="5-10 % sur éclairage" roi="immédiat">Salle éclairage 50 % entre les services. Cuisine éclairage 100 % seulement quand brigade active.</ActionItem>
            </ActionCategory>

            {/* Cuisson */}
            <ActionCategory icon={<Flame className="w-5 h-5" />} title="Cuisson (6 actions)" color="red">
              <ActionItem n={6} title="Mettre des couvercles sur les casseroles" invest="50-200 EUR (lot couvercles)" eco="25-30 % sur cuisson eau bouillante" roi="immédiat">L'eau bout 3 fois plus vite avec couvercle. Reflex automatique à former en brigade.</ActionItem>
              <ActionItem n={7} title="Passer du gaz à l'induction (renouvellement)" invest="3 000-8 000 EUR/plaque" eco="40-50 % vs gaz" roi="3-5 ans si gaz > 10 ans">Rendement induction 90 % vs 50-55 % gaz. ROI rapide si matériel âgé. Casseroles compatibles requises.</ActionItem>
              <ActionItem n={8} title="Détartrer friteuse + changer huile au bon moment" invest="0 EUR (process)" eco="20-30 % sur friteuse" roi="immédiat">Friteuse encrassée chauffe moins bien. Huile usagée = surconsommation. Filtration quotidienne, changement complet selon usage.</ActionItem>
              <ActionItem n={9} title="Détartrer four à vapeur + entretien annuel pro" invest="200-500 EUR/an" eco="5-15 % sur four" roi="immédiat">Calcaire isole les résistances. Entretien pro inclut buses, joints, sondes. Garantie étendue souvent.</ActionItem>
              <ActionItem n={10} title="Adapter taille casseroles aux plaques induction" invest="0 EUR (sensibilisation)" eco="5-10 % sur cuisson" roi="immédiat">Casserole 18 cm sur plaque 22 cm = 30 % d'énergie perdue. Choisir le bon couple casserole-zone.</ActionItem>
              <ActionItem n={11} title="Pré-chauffage juste avant service" invest="0 EUR (procédure)" eco="10-15 % sur four" roi="immédiat">Allumer le four 20-30 min avant et non 1h. Beaucoup de fours pro montent en T en 15 min.</ActionItem>
            </ActionCategory>

            {/* Froid */}
            <ActionCategory icon={<Snowflake className="w-5 h-5" />} title="Froid et chambres froides (5 actions)" color="blue">
              <ActionItem n={12} title="Vérifier et changer les joints" invest="50-200 EUR/joint" eco="20-30 % sur la chambre" roi="2-6 mois">Test feuille de papier : si elle glisse, joint à changer. Chaque mm de fuite = compresseur qui tourne plus.</ActionItem>
              <ActionItem n={13} title="Dégivrage trimestriel manuel" invest="0 EUR" eco="15-25 % sur conso froid" roi="immédiat">5 mm de givre = 30 % de surconso. Dégivrage complet tous les 3 mois minimum.</ActionItem>
              <ActionItem n={14} title="Régler thermostat à la bonne température" invest="0 EUR" eco="5-7 % par degré gagné" roi="immédiat">Chambre positive à +3 degC (pas 0), chambre négative à -18 degC (pas -25). Conforme HACCP.</ActionItem>
              <ActionItem n={15} title="Installer rideaux à lanières" invest="80-200 EUR/m" eco="15-20 % sur chambres à ouverture fréquente" roi="6-12 mois">PVC souple. Limite l'échange thermique à chaque ouverture. Indispensable cuisine active.</ActionItem>
              <ActionItem n={16} title="Éviter de surcharger les chambres" invest="0 EUR (organisation)" eco="5-10 %" roi="immédiat">Air doit circuler. 10 cm de dégagement autour des produits. Une chambre pleine consomme 20 % de plus.</ActionItem>
            </ActionCategory>

            {/* Eau chaude */}
            <ActionCategory icon={<Droplets className="w-5 h-5" />} title="Eau chaude et plonge (4 actions)" color="cyan">
              <ActionItem n={17} title="Régler ballon à 55-60 degC (pas 80)" invest="0 EUR" eco="15-25 % sur ECS" roi="immédiat">60 degC suffit pour éviter légionellose. Au-delà, perte pure. Réglage en 2 minutes sur le boîtier.</ActionItem>
              <ActionItem n={18} title="Isoler les conduits eau chaude" invest="50-150 EUR (manchons mousse)" eco="10-15 % sur ECS" roi="6-12 mois">Mousse polyéthylène à 2 EUR/m. Pertes thermiques tuyaux nus = 20 % de la chaleur produite.</ActionItem>
              <ActionItem n={19} title="Installer mitigeurs économiques sur lavabos" invest="40-80 EUR/lavabo" eco="20-40 % sur eau chaude lavabos" roi="6-12 mois">Aérateurs + limiteurs de débit. Réduit conso eau de 30-50 % sans baisser le confort.</ActionItem>
              <ActionItem n={20} title="Récupérateur de chaleur plonge industrielle" invest="1 500-3 000 EUR" eco="20-30 % sur ECS" roi="18-36 mois">Heat recovery sur l'eau de rinçage chaude du lave-vaisselle. Préchauffe l'eau froide entrante.</ActionItem>
            </ActionCategory>

            {/* Hotte et ventilation */}
            <ActionCategory icon={<Wind className="w-5 h-5" />} title="Hotte et ventilation (3 actions)" color="teal">
              <ActionItem n={21} title="Installer un variateur de vitesse sur la hotte" invest="300-600 EUR" eco="20-30 % sur extraction" roi="12-18 mois">Hotte à 3 vitesses au lieu de 100 %. Capteur de chaleur intelligent disponible pour 800-1500 EUR (ROI 18-24 mois).</ActionItem>
              <ActionItem n={22} title="Nettoyer filtres à graisses tous les 15 jours" invest="0 EUR (process)" eco="20-25 % sur moteur hotte" roi="immédiat">Filtre encrassé = +25 % conso moteur + risque incendie. Trempage dans dégraissant alcalin 1h.</ActionItem>
              <ActionItem n={23} title="Éteindre la hotte 30 min après fin du service" invest="0 EUR (procédure)" eco="5-10 % sur hotte" roi="immédiat">Ne pas laisser tourner toute la soirée par habitude. Process écrit + checklist fermeture.</ActionItem>
            </ActionCategory>

            {/* Structurel */}
            <ActionCategory icon={<Sun className="w-5 h-5" />} title="Actions structurelles (2 actions)" color="emerald">
              <ActionItem n={24} title="Installer du photovoltaïque en autoconsommation" invest="8 000-25 000 EUR (5-12 kWc)" eco="30-50 % sur facture élec" roi="7-12 ans">Toiture sup. à 50 m2 requise. Autoconsommation prioritaire midi = parfait pour restaurant. Garantie 25 ans.</ActionItem>
              <ActionItem n={25} title="Souscrire un contrat heures creuses si pertinent" invest="0 EUR (changement contrat)" eco="5-15 % sur élec" roi="immédiat">Uniquement si gros lave-vaisselle nocturne, ballon ECS programmable ou production matinale. Demander audit tarifaire fournisseur d'abord.</ActionItem>
            </ActionCategory>

            <Callout type="success">
              <strong>Plan d'action recommandé :</strong> commencez par les 10 actions à ROI
              immédiat ou inférieur à 6 mois (actions 4, 5, 6, 8, 10, 11, 13, 14, 16, 17, 22, 23).
              Vous économisez déjà 15-20 % sans gros investissement. Puis enchaînez sur les
              actions ROI 6-24 mois (LED, joints, variateurs). En 12 mois, vous êtes à -30 %.
            </Callout>
          </section>

          {/* ═════════════ SECTION 7 : Aides ═════════════ */}
          <section id="aides" className="mb-16">
            <SectionHeading icon={<Gift className="w-6 h-6" />} number="7">
              Aides 2026 : CEE, France 2030, régionales
            </SectionHeading>

            <div className="prose-content">
              <p>
                Pour vos investissements énergie, ne payez jamais le prix plein. Plusieurs
                dispositifs financent 20 à 70 % de vos travaux d'efficacité énergétique en 2026.
                Voici la cartographie à jour.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mt-8">
              <div className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-mono-100">CEE (Certificats Économies Énergie)</h3>
                </div>
                <p className="text-sm text-mono-400 leading-relaxed mb-3">
                  Dispositif obligatoire imposé par l'État aux fournisseurs d'énergie.
                  Financent jusqu'à 70 % de vos travaux : LED, hotte à variateur, chambre
                  froide neuve A+++, isolation, pompe à chaleur.
                </p>
                <div className="text-xs text-mono-500"><strong>Montants typiques :</strong> 500-3 000 EUR par projet. Cumul possible plusieurs CEE.</div>
              </div>

              <div className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-mono-100">France 2030 (decarbonation)</h3>
                </div>
                <p className="text-sm text-mono-400 leading-relaxed mb-3">
                  Plan d'investissement étatique. Volet decarbonation industrie et tertiaire.
                  Subventionne jusqu'à 50 % les investissements de récupération de chaleur,
                  électrification (gaz vers induction), photovoltaïque en autoconsommation.
                </p>
                <div className="text-xs text-mono-500"><strong>Montants :</strong> 5 000-50 000 EUR. Dossier ADEME, dépôt en ligne.</div>
              </div>

              <div className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-mono-100">Aide régionale AURA TPE</h3>
                </div>
                <p className="text-sm text-mono-400 leading-relaxed mb-3">
                  Auvergne-Rhone-Alpes : aide aux TPE pour audit + travaux. Jusqu'à 5 000 EUR.
                  Existe aussi en Bretagne, Île-de-France (TPE Verte), Nouvelle-Aquitaine,
                  Occitanie. Cumulable avec CEE.
                </p>
                <div className="text-xs text-mono-500"><strong>Demande :</strong> portail région, avant travaux.</div>
              </div>

              <div className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-mono-100">Prêt BPI Eco-Énergie</h3>
                </div>
                <p className="text-sm text-mono-400 leading-relaxed mb-3">
                  Prêt à taux bonifié de BPI France pour financer la transition énergétique.
                  Jusqu'à 75 000 EUR sans garantie personnelle. Taux préférentiel vs marché
                  bancaire. Cumulable avec subventions.
                </p>
                <div className="text-xs text-mono-500"><strong>Conditions :</strong> moins de 50 salariés, projet sup. à 5 000 EUR.</div>
              </div>
            </div>

            <Callout type="warning">
              <strong>Attention RGE :</strong> la majorité des aides exigent un installateur
              RGE (Reconnu Garant de l'Environnement). Vérifiez le label sur france-renov.gouv.fr
              avant de signer un devis. Sans RGE, pas de CEE, pas de France 2030.
            </Callout>
          </section>

          {/* ═════════════ SECTION 8 : ROI ═════════════ */}
          <section id="roi" className="mb-16">
            <SectionHeading icon={<Calculator className="w-6 h-6" />} number="8">
              ROI : quels investissements sont rentables en moins de 24 mois ?
            </SectionHeading>

            <div className="prose-content">
              <p>
                Tous les investissements énergie ne se valent pas. Voici un classement par
                retour sur investissement, pour orienter votre budget travaux 2026. Hypothèses :
                restaurant 200 000-500 000 EUR de CA, facture énergie 15 000-25 000 EUR/an.
              </p>
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-mono-975 text-mono-350">
                    <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Investissement</th>
                    <th className="text-right py-3 px-4 font-semibold">Coût typique</th>
                    <th className="text-right py-3 px-4 font-semibold">Économie/an</th>
                    <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">ROI</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Remplacement joints chambre froide</td><td className="py-3 px-4 text-right">200 EUR</td><td className="py-3 px-4 text-right">400-800 EUR</td><td className="py-3 px-4 text-right font-bold text-emerald-700">3-6 mois</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">LED salle + cuisine</td><td className="py-3 px-4 text-right">500 EUR</td><td className="py-3 px-4 text-right">800-1 200 EUR</td><td className="py-3 px-4 text-right font-bold text-emerald-700">5-8 mois</td></tr>
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Détecteurs présence (5 zones)</td><td className="py-3 px-4 text-right">600 EUR</td><td className="py-3 px-4 text-right">600-1 000 EUR</td><td className="py-3 px-4 text-right font-bold text-emerald-700">7-12 mois</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Variateur hotte extraction</td><td className="py-3 px-4 text-right">500 EUR</td><td className="py-3 px-4 text-right">400-700 EUR</td><td className="py-3 px-4 text-right font-bold text-emerald-700">9-15 mois</td></tr>
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Mitigeurs économiques lavabos</td><td className="py-3 px-4 text-right">300 EUR</td><td className="py-3 px-4 text-right">200-400 EUR</td><td className="py-3 px-4 text-right font-bold text-emerald-700">10-18 mois</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Heat recovery plonge</td><td className="py-3 px-4 text-right">2 500 EUR</td><td className="py-3 px-4 text-right">1 000-1 800 EUR</td><td className="py-3 px-4 text-right font-bold text-amber-700">18-30 mois</td></tr>
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Remplacement chambre froide A+++</td><td className="py-3 px-4 text-right">6 000 EUR</td><td className="py-3 px-4 text-right">1 800-2 500 EUR</td><td className="py-3 px-4 text-right font-bold text-amber-700">30-40 mois</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Passage gaz vers induction</td><td className="py-3 px-4 text-right">10 000 EUR</td><td className="py-3 px-4 text-right">2 500-3 500 EUR</td><td className="py-3 px-4 text-right font-bold text-amber-700">3-5 ans</td></tr>
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Photovoltaïque 8 kWc</td><td className="py-3 px-4 text-right">15 000 EUR</td><td className="py-3 px-4 text-right">1 500-2 500 EUR</td><td className="py-3 px-4 text-right font-bold text-orange-700">7-12 ans</td></tr>
                </tbody>
              </table>
            </div>

            <div className="prose-content mt-8">
              <p>
                <strong>Stratégie d'investissement recommandée :</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-mono-350 mt-3">
                <li><strong>Mois 1-3 :</strong> actions à ROI moins de 6 mois (joints, LED, formation équipe, réglage thermostats).</li>
                <li><strong>Mois 4-12 :</strong> actions ROI 6-18 mois (détecteurs présence, variateur hotte, mitigeurs).</li>
                <li><strong>Année 2 :</strong> actions structurelles ROI 18-36 mois (heat recovery, isolation, chambre froide).</li>
                <li><strong>Année 3+ :</strong> photovoltaïque et passage induction si gaz à remplacer.</li>
              </ul>
              <p className="mt-4">
                Cumulées, ces actions vous amènent à une baisse de 25 à 40 % de la facture
                énergie sur 24 mois, avec un investissement total de 5 000 à 15 000 EUR (hors
                photovoltaïque et induction). Avec les aides CEE et France 2030, le reste à
                charge tombe souvent à 2 000 à 6 000 EUR.
              </p>
            </div>
          </section>

          {/* ═════════════ Articles lies ═════════════ */}
          <section className="mb-16 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-mono-100 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              Pour aller plus loin
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link to="/blog/budget-previsionnel-restaurant" className="bg-white border border-mono-900 hover:border-teal-300 rounded-xl p-4 transition-colors">
                <div className="text-xs text-teal-600 font-semibold mb-1">Gestion</div>
                <div className="font-semibold text-mono-100 text-sm">Budget prévisionnel restaurant : la méthode complète</div>
                <div className="text-xs text-mono-500 mt-2 flex items-center gap-1">Lire <ArrowRight className="w-3 h-3" /></div>
              </Link>
              <Link to="/blog/calcul-marge-restaurant" className="bg-white border border-mono-900 hover:border-teal-300 rounded-xl p-4 transition-colors">
                <div className="text-xs text-teal-600 font-semibold mb-1">Marges</div>
                <div className="font-semibold text-mono-100 text-sm">Calcul de marge restaurant : guide 2026 + formules</div>
                <div className="text-xs text-mono-500 mt-2 flex items-center gap-1">Lire <ArrowRight className="w-3 h-3" /></div>
              </Link>
              <Link to="/blog/comment-ouvrir-restaurant-guide-complet" className="bg-white border border-mono-900 hover:border-teal-300 rounded-xl p-4 transition-colors">
                <div className="text-xs text-teal-600 font-semibold mb-1">Ouverture</div>
                <div className="font-semibold text-mono-100 text-sm">Ouvrir un restaurant : guide complet 2026</div>
                <div className="text-xs text-mono-500 mt-2 flex items-center gap-1">Lire <ArrowRight className="w-3 h-3" /></div>
              </Link>
            </div>
          </section>

          {/* ═════════════ FAQ ═════════════ */}
          <section id="faq" className="mb-16">
            <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="9">
              Questions fréquentes sur le coût énergie restaurant
            </SectionHeading>
            <div className="space-y-3 mt-8">
              {faqItems.map((item, i) => (
                <details key={i} className="bg-mono-1000 border border-mono-900 rounded-xl group">
                  <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors">
                    {item.question}
                    <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform shrink-0 ml-3" />
                  </summary>
                  <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

        </article>

        <BlogAuthor publishedDate="2026-05-26" readTime="14 min" variant="footer" />
        <CTABlock />
      </main>

      <SiteFooter />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Composants
   ═══════════════════════════════════════════════════════════════ */

function SectionHeading({ icon, number, children }: { icon: React.ReactNode; number: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center shrink-0">{icon}</div>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100">{number}. {children}</h2>
    </div>
  );
}

function Callout({ type = 'info', children }: { type?: 'info' | 'warning' | 'success'; children: React.ReactNode }) {
  const styles = {
    info: 'bg-teal-50 border-teal-200 text-teal-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  };
  return (
    <div className={`my-6 border rounded-xl p-5 text-sm leading-relaxed ${styles[type]}`}>
      {children}
    </div>
  );
}

function ActionCategory({ icon, title, color, children }: { icon: React.ReactNode; title: string; color: string; children: React.ReactNode }) {
  const colorMap: Record<string, string> = {
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
    blue: 'bg-blue-50 text-blue-700',
    cyan: 'bg-cyan-50 text-cyan-700',
    teal: 'bg-teal-50 text-teal-700',
    emerald: 'bg-emerald-50 text-emerald-700',
  };
  return (
    <div className="mt-8">
      <h3 className="flex items-center gap-2 text-lg font-bold text-mono-100 mb-4">
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color] ?? 'bg-teal-50 text-teal-700'}`}>{icon}</span>
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ActionItem({ n, title, invest, eco, roi, children }: { n: number; title: string; invest: string; eco: string; roi: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-teal-600 text-white rounded-lg flex items-center justify-center shrink-0 font-bold text-sm shadow-sm">{n}</div>
        <div className="flex-1">
          <h4 className="font-bold text-mono-100 mb-2">{title}</h4>
          <p className="text-sm text-mono-400 leading-relaxed mb-3">{children}</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-mono-1000 border border-mono-900 px-2 py-1 rounded-md text-mono-500"><strong className="text-mono-100">Invest :</strong> {invest}</span>
            <span className="bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md text-emerald-800"><strong>Eco :</strong> {eco}</span>
            <span className="bg-teal-50 border border-teal-200 px-2 py-1 rounded-md text-teal-800"><strong>ROI :</strong> {roi}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CTABlock() {
  return (
    <section id="cta" className="mb-16">
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-white text-center">
        <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Suivez vos charges énergie avec RestauMargin</h2>
        <p className="text-teal-50 max-w-xl mx-auto mb-8 leading-relaxed">
          Notre module suivi des charges enregistre vos consommations électricité, gaz et eau,
          calcule votre ratio kWh/couvert en temps réel et alerte dès qu'une dérive dépasse votre seuil.
        </p>
        <Link to="/login?mode=register" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 font-bold rounded-full hover:bg-teal-50 transition-colors">
          Essayer gratuitement
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center text-sm text-mono-500">
        <Link to="/" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4">
          <ChefHat className="w-6 h-6 text-teal-600" />
          RestauMargin
        </Link>
        <p className="mt-6 text-xs text-mono-700">&copy; {new Date().getFullYear()} RestauMargin. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
