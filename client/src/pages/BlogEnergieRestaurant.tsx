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
    question: "Quel est le budget energie moyen d'un restaurant en 2026 ?",
    answer: "Le budget energie represente 3 a 7 % du chiffre d'affaires HT pour un restaurant traditionnel, et peut grimper a 8-10 % pour les pizzerias (four a forte conso) ou les restaurants avec climatisation intensive. Pour un restaurant de 500 000 EUR de CA, comptez 15 000 a 35 000 EUR par an. Les hausses 2022-2025 ont fait basculer ce poste dans le top 3 des charges variables, juste derriere matieres premieres et personnel.",
  },
  {
    question: "Comment se repartit la consommation energetique en cuisine professionnelle ?",
    answer: "Repartition typique : cuisson 60 % (fours, plaques, friteuses, salamandres), froid 20 % (chambres froides, frigos, congelateurs), eau chaude sanitaire 10 %, eclairage 5 %, divers 5 % (caisse, audio, ventilation, climatisation). En pizzeria, la cuisson peut monter a 70 %. En restauration rapide, le froid grimpe a 30 % du fait du stockage des produits prets.",
  },
  {
    question: "Quels sont les tarifs electricite et gaz pour un restaurant en 2026 ?",
    answer: "Electricite professionnelle (tarif jaune, puissance 36-250 kVA) : 0,18 a 0,24 EUR/kWh HTVA selon le fournisseur et le contrat. Gaz naturel professionnel : 0,08 a 0,12 EUR/kWh HTVA. Eau : 4,50 a 5,50 EUR/m3 (incluant assainissement). Ces tarifs ont baisse depuis le pic 2022 mais restent 40 a 60 % plus eleves qu'avant la crise energetique.",
  },
  {
    question: "Combien consomme un four professionnel en restauration ?",
    answer: "Un four mixte 6 niveaux electrique consomme 8 a 12 kWh/h en pleine charge, soit 60 a 90 kWh/jour pour un service de 8 heures actives. A 0,20 EUR/kWh, cela represente 4 400 a 6 600 EUR par an. Un four a pizza gaz : 12 a 18 kWh/h. Une friteuse pro : 6 a 10 kWh/h. Un lave-vaisselle pro : 3 a 5 kWh/cycle de 90 secondes plus 12 a 20 L d'eau chaude.",
  },
  {
    question: "Combien d'economie cumulee en appliquant les 25 actions de ce guide ?",
    answer: "Realiste : 25 a 40 % de reduction de la facture totale d'energie sur 12 mois. Pour un restaurant qui paye 25 000 EUR/an : 6 250 a 10 000 EUR d'economie annuelle recurrente. Les actions sans investissement (extinction, regulation, formation equipe) apportent deja 8 a 15 %. Les actions avec investissement modere (LED, joints, variateurs) ajoutent 10 a 15 %. Les actions structurelles (heat recovery, photovoltaique) completent jusqu'a 40 %.",
  },
  {
    question: "Quelles aides energie sont disponibles pour les restaurants en 2026 ?",
    answer: "Trois principaux dispositifs : 1) Certificats d'Economies d'Energie (CEE), qui financent 20 a 70 % des travaux d'efficacite (hotte, eclairage LED, chambre froide neuve). 2) France 2030, volet decarbonation industrie et tertiaire (jusqu'a 50 % de subvention pour heat recovery, recuperation de chaleur). 3) Aides regionales : par exemple AURA en Auvergne-Rhone-Alpes, Bretagne Energie, Ile-de-France TPE Verte. Passer par un installateur RGE est obligatoire pour la majorite des aides.",
  },
  {
    question: "Le passage du gaz a l'induction est-il rentable ?",
    answer: "Si votre materiel gaz a plus de 10 ans : oui, ROI typique 3 a 5 ans. L'induction a un rendement de 90 % contre 50 a 55 % pour le gaz. Une plaque induction pro 5 kW consomme reellement 60 a 70 % d'energie en moins qu'une plaque gaz equivalente. Inconvenient : l'investissement (3 000 a 8 000 EUR par plaque) et la necessite d'avoir des casseroles compatibles. Si votre gaz est recent (moins de 5 ans), attendez la fin de vie pour amortir l'existant.",
  },
  {
    question: "Le tarif Heures Creuses est-il interessant pour un restaurant ?",
    answer: "Rarement, car la consommation principale d'un restaurant tombe sur le creneau midi-soir (11h-15h et 18h-23h), classes en heures pleines. Le tarif HC peut etre interessant uniquement si vous avez un gros lave-vaisselle nocturne, une production matinale (boulangerie integree), ou un ballon d'eau chaude programmable. Demandez un audit tarifaire a votre fournisseur avant de souscrire un contrat HP/HC qui peut s'averer plus cher au final.",
  },
  {
    question: "Peut-on installer du photovoltaique sur un restaurant ?",
    answer: "Oui, si vous etes proprietaire ou avec accord ecrit du bailleur, et si la toiture fait plus de 50 m2. Investissement typique 8 000 a 25 000 EUR pour 5 a 12 kWc. Production attendue : 5 000 a 14 000 kWh/an dans le sud, 4 000 a 11 000 kWh/an dans le nord. Autoconsommation possible (priorite midi quand restaurant consomme le plus), revente du surplus a EDF OA. ROI 7 a 12 ans, garantie 25 ans sur les panneaux. Subventions France 2030 et prime a l'autoconsommation.",
  },
  {
    question: "Faut-il faire un audit energetique professionnel ?",
    answer: "Oui des que votre facture energie depasse 20 000 EUR/an. Cout d'un audit reglementaire NF EN 16247 : 1 500 a 3 500 EUR. ROI typique : moins de 18 mois. L'audit identifie precisement les pertes (releve de consommation poste par poste, thermographie infrarouge, analyse du contrat) et chiffre les economies potentielles. Obligatoire tous les 4 ans pour les entreprises de plus de 250 salaries ou 50 M EUR de CA, mais tres recommande des le seuil des 20 kEUR de facture.",
  },
];

export default function BlogEnergieRestaurant() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Cout energie restaurant 2026 : budget, repartition et 25 actions d'economie"
        description="Guide complet du cout energie en restauration 2026 : budget moyen 3-7 % du CA, repartition cuisine 60 %, tarifs elec/gaz/eau, 25 actions concretes pour reduire la facture de 25 a 40 %, aides CEE et France 2030."
        path="/blog/cout-energie-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Cout energie restaurant', url: 'https://www.restaumargin.fr/blog/cout-energie-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Comment realiser un audit energetique de restaurant en 7 etapes',
            description: "Methode pas-a-pas pour identifier les sources de gaspillage energetique en cuisine professionnelle et chiffrer les economies.",
            totalTime: 'PT4H',
            tool: ['Pince amperemetrique', 'Thermometre infrarouge', 'Compteur communicant', 'Tableur ou logiciel RestauMargin'],
            step: [
              { '@type': 'HowToStep', name: 'Collecter les 12 dernieres factures', text: 'Reunissez vos 12 dernieres factures electricite, gaz et eau pour etablir une consommation de reference mensuelle et identifier la saisonnalite.' },
              { '@type': 'HowToStep', name: 'Cartographier les equipements', text: 'Listez chaque equipement consommateur avec sa puissance nominale en kW et son temps de fonctionnement quotidien estime.' },
              { '@type': 'HowToStep', name: 'Mesurer les consommations reelles', text: 'Utilisez une pince amperemetrique pour mesurer la consommation reelle de chaque equipement majeur sur un service complet.' },
              { '@type': 'HowToStep', name: 'Detecter les pertes thermiques', text: "Avec un thermometre infrarouge, controlez les joints de chambres froides, l'isolation des conduits d'eau chaude et la dispersion thermique des hottes." },
              { '@type': 'HowToStep', name: 'Analyser les courbes de charge', text: "Demandez a votre fournisseur la courbe de charge horaire (compteur Linky pro). Identifiez les pics et les consommations nocturnes inexpliquees." },
              { '@type': 'HowToStep', name: 'Calculer le ratio kWh/couvert', text: 'Divisez la consommation mensuelle totale par le nombre de couverts servis. Cible : 8-12 kWh/couvert restaurant traditionnel, 5-8 kWh/couvert restauration rapide.' },
              { '@type': 'HowToStep', name: 'Prioriser les actions par ROI', text: "Classez les actions identifiees par retour sur investissement decroissant : commencez par les quick wins gratuits, puis les investissements a ROI < 24 mois." },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: "Cout energie restaurant 2026 : guide complet + 25 actions d'economie",
            description: 'Budget energie 3-7 % du CA en 2026, repartition par poste, tarifs elec/gaz/eau, conso par equipement, 25 actions concretes pour reduire la facture de 25 a 40 %, aides CEE et France 2030.',
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
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/cout-energie-restaurant' },
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
          <span className="text-mono-100 font-medium">Cout energie restaurant 2026</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Economies"
        readTime="14 min"
        date="Mai 2026"
        title="Cout energie restaurant 2026 : guide complet + 25 actions"
        accentWord="energie"
        subtitle="Le budget energie pese 3 a 7 % du CA en restauration en 2026. Decouvrez la repartition par poste, les tarifs actuels elec/gaz/eau, la consommation reelle de vos equipements et 25 actions concretes pour reduire votre facture de 25 a 40 % par an."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="14 min" variant="header" />

        {/* ── Encadre chiffres cles ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Chiffres cles energie restauration 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">Les 4 indicateurs a retenir</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 grid grid-cols-2 gap-4 text-sm sm:text-base">
            <div>
              <div className="text-3xl font-extrabold text-white">3-7 %</div>
              <div className="text-teal-100 text-xs mt-1">Part du CA en energie</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">60 %</div>
              <div className="text-teal-100 text-xs mt-1">Conso liee a la cuisson</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">25-40 %</div>
              <div className="text-teal-100 text-xs mt-1">Economie possible/an</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">10 kWh</div>
              <div className="text-teal-100 text-xs mt-1">Conso moy./couvert</div>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Source : agregation donnees ADEME, Atee, GIRA Conseil et base RestauMargin 2026.
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
              { href: '#budget', label: 'Budget moyen energie restaurant en 2026' },
              { href: '#repartition', label: 'Repartition consommation : cuisine 60 %, salle 20 %' },
              { href: '#tarifs', label: 'Tarifs 2026 : electricite, gaz, eau' },
              { href: '#equipements', label: 'Consommation par equipement (four, friteuse, frigo)' },
              { href: '#audit', label: 'Audit energetique : 7 etapes concretes' },
              { href: '#actions', label: '25 actions concretes pour reduire la facture' },
              { href: '#aides', label: 'Aides 2026 : CEE, France 2030, regionales' },
              { href: '#roi', label: "ROI : quels investissements rentables en 24 mois ?" },
              { href: '#faq', label: 'Questions frequentes' },
              { href: '#cta', label: 'Suivez vos charges energie avec RestauMargin' },
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
              Budget moyen energie restaurant en 2026
            </SectionHeading>

            <div className="prose-content">
              <p>
                En 2026, le cout energie d'un restaurant represente entre 3 et 7 % du chiffre
                d'affaires HT, avec une mediane autour de 5 %. Cette fourchette varie fortement
                selon le type d'etablissement, l'anciennete du materiel et la zone geographique.
                Pour mettre cela en perspective, c'est devenu le 3e poste de charges variables,
                juste apres les matieres premieres (25-35 %) et le personnel (30-40 %).
              </p>
              <p>
                Avant la crise energetique de 2022, ce poste pesait 2 a 4 % du CA. La hausse des
                tarifs reglementes electricite (plus de 60 % cumules sur 2022-2024) et du gaz
                naturel (plus de 80 % en pic) a fait basculer l'energie dans une categorie a
                surveiller mensuellement, au meme titre que le food cost.
              </p>
            </div>

            <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
              <h3 className="font-bold text-mono-100 mb-4 text-lg">Budget energie selon type d'etablissement</h3>
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
                  <tr><td className="py-2 px-3">Coffee shop / Salon de the</td><td className="py-2 px-3 text-right">3 - 5 %</td><td className="py-2 px-3 text-right">8 000 - 18 000 EUR</td><td className="py-2 px-3 text-right">3 - 6</td></tr>
                  <tr><td className="py-2 px-3">Food truck</td><td className="py-2 px-3 text-right">2 - 4 %</td><td className="py-2 px-3 text-right">3 000 - 9 000 EUR</td><td className="py-2 px-3 text-right">4 - 7</td></tr>
                </tbody>
              </table>
            </div>

            <Callout type="info">
              <strong>A retenir :</strong> pour bien piloter votre cout energie restaurant,
              calculez votre ratio kWh par couvert servi. C'est l'indicateur de productivite
              energetique le plus fiable, independant de la taille de l'etablissement.
            </Callout>
          </section>

          {/* ═════════════ SECTION 2 : Repartition ═════════════ */}
          <section id="repartition" className="mb-16">
            <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="2">
              Repartition consommation : cuisine 60 %, salle 20 %
            </SectionHeading>

            <div className="prose-content">
              <p>
                Avant de chercher a economiser, il faut comprendre OU part votre energie.
                Voici la repartition moyenne pour un restaurant traditionnel 80 couverts en
                France, basee sur les donnees ADEME et nos propres mesures.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mt-8">
              {[
                { icon: <Flame className="w-5 h-5" />, label: 'Cuisson (cuisine)', pct: '60 %', desc: 'Fours, plaques, friteuses, salamandres, plonge. Le poste numero 1, ecrasant.' },
                { icon: <Snowflake className="w-5 h-5" />, label: 'Salle + climatisation', pct: '20 %', desc: 'Climatisation, chauffage salle, vitrines refrigerees, machines a cafe.' },
                { icon: <Droplets className="w-5 h-5" />, label: 'Eau chaude sanitaire', pct: '10 %', desc: 'Ballon eau chaude, lavabos, plonge manuelle, lave-vaisselle pro.' },
                { icon: <Lightbulb className="w-5 h-5" />, label: 'Eclairage', pct: '5 %', desc: 'Salle, cuisine, sanitaires, exterieur, vitrines. Variable selon LED/halogene.' },
                { icon: <Wind className="w-5 h-5" />, label: 'Hotte + extraction', pct: '3 %', desc: 'Ventilateur d air vicie. Souvent tourne 100 % en continu (mauvais reflexe).' },
                { icon: <Power className="w-5 h-5" />, label: 'Divers (caisse, audio)', pct: '2 %', desc: 'Tablettes, ordinateurs, audio, ecrans menu, frigos de bureau.' },
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
                <strong>Variations selon le type :</strong> en pizzeria, la cuisson grimpe a
                70 % (four toujours allume). En coffee shop, la machine a cafe pro represente
                40 a 50 % de la facture. En restauration rapide, le froid (stockage produits
                prets) monte a 30 %. Adaptez votre plan d'action a votre profil reel.
              </p>
              <p>
                Levier #1 : si vous voulez vraiment baisser votre cout energie restaurant,
                attaquez-vous d'abord a la cuisson. Une optimisation de 10 % sur ce poste
                rapporte plus qu'une division par 2 de l'eclairage.
              </p>
            </div>
          </section>

          {/* ═════════════ SECTION 3 : Tarifs 2026 ═════════════ */}
          <section id="tarifs" className="mb-16">
            <SectionHeading icon={<FileText className="w-6 h-6" />} number="3">
              Tarifs energie 2026 : electricite, gaz, eau
            </SectionHeading>

            <div className="prose-content">
              <p>
                Connaitre les tarifs en vigueur est essentiel pour negocier votre contrat
                fournisseur. Voici les fourchettes constatees sur le marche francais en mai 2026,
                hors taxes (CSPE, CTA, TICGN). La TVA sur l'energie pro reste a 20 %.
              </p>
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-mono-975 text-mono-350">
                    <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Energie</th>
                    <th className="text-center py-3 px-4 font-semibold">Tarif moyen HT 2026</th>
                    <th className="text-center py-3 px-4 font-semibold">Fourchette marche</th>
                    <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Evolution vs 2022</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Electricite tarif bleu pro (less than 36 kVA)</td><td className="py-3 px-4 text-center">0,22 EUR/kWh</td><td className="py-3 px-4 text-center">0,20 - 0,28 EUR/kWh</td><td className="py-3 px-4 text-center text-red-700">+ 65 %</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Electricite tarif jaune (36-250 kVA)</td><td className="py-3 px-4 text-center">0,20 EUR/kWh</td><td className="py-3 px-4 text-center">0,18 - 0,24 EUR/kWh</td><td className="py-3 px-4 text-center text-red-700">+ 55 %</td></tr>
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Gaz naturel pro</td><td className="py-3 px-4 text-center">0,10 EUR/kWh</td><td className="py-3 px-4 text-center">0,08 - 0,12 EUR/kWh</td><td className="py-3 px-4 text-center text-red-700">+ 70 %</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Eau (avec assainissement)</td><td className="py-3 px-4 text-center">4,80 EUR/m3</td><td className="py-3 px-4 text-center">3,80 - 6,20 EUR/m3</td><td className="py-3 px-4 text-center text-red-700">+ 18 %</td></tr>
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Bouteille gaz propane 13 kg</td><td className="py-3 px-4 text-center">42 EUR/bouteille</td><td className="py-3 px-4 text-center">38 - 48 EUR</td><td className="py-3 px-4 text-center text-red-700">+ 35 %</td></tr>
                </tbody>
              </table>
            </div>

            <Callout type="warning">
              <strong>Negociation contrat :</strong> demandez un comparatif a 3 fournisseurs
              alternatifs (Plum Energie, ekWateur, Mint, Ohm Energie, Engie Pro, TotalEnergies Pro).
              L'ecart entre le moins cher et le plus cher peut atteindre 20 a 30 % sur l'electricite.
              Privilegiez un prix fixe sur 1 a 2 ans pour vous proteger des hausses.
            </Callout>
          </section>

          {/* ═════════════ SECTION 4 : Equipements ═════════════ */}
          <section id="equipements" className="mb-16">
            <SectionHeading icon={<Power className="w-6 h-6" />} number="4">
              Consommation par equipement de cuisine professionnelle
            </SectionHeading>

            <div className="prose-content">
              <p>
                Pour identifier vos sources de gaspillage, il faut connaitre la consommation
                reelle de chaque equipement. Voici les references chiffrees pour les principaux
                materiels de cuisine pro, en pleine utilisation et en veille.
              </p>
            </div>

            <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
              <h3 className="font-bold text-mono-100 mb-4 text-lg">Consommation des equipements de cuisine pro</h3>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-white text-mono-350 border-b border-mono-900">
                    <th className="text-left py-2 px-3 font-semibold">Equipement</th>
                    <th className="text-right py-2 px-3 font-semibold">Puissance</th>
                    <th className="text-right py-2 px-3 font-semibold">Conso/h actif</th>
                    <th className="text-right py-2 px-3 font-semibold">Cout annuel typique</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  <tr><td className="py-2 px-3">Four mixte 6 niveaux electrique</td><td className="py-2 px-3 text-right">12 kW</td><td className="py-2 px-3 text-right">8 - 12 kWh</td><td className="py-2 px-3 text-right font-medium">4 400 - 6 600 EUR</td></tr>
                  <tr><td className="py-2 px-3">Four a pizza electrique 2 chambres</td><td className="py-2 px-3 text-right">18 kW</td><td className="py-2 px-3 text-right">10 - 14 kWh</td><td className="py-2 px-3 text-right font-medium">6 000 - 8 500 EUR</td></tr>
                  <tr><td className="py-2 px-3">Four a pizza gaz</td><td className="py-2 px-3 text-right">25 kW</td><td className="py-2 px-3 text-right">15 - 20 kWh</td><td className="py-2 px-3 text-right font-medium">4 500 - 6 000 EUR</td></tr>
                  <tr><td className="py-2 px-3">Friteuse pro electrique 2 bacs</td><td className="py-2 px-3 text-right">14 kW</td><td className="py-2 px-3 text-right">6 - 10 kWh</td><td className="py-2 px-3 text-right font-medium">3 200 - 5 200 EUR</td></tr>
                  <tr><td className="py-2 px-3">Plaque induction 4 zones</td><td className="py-2 px-3 text-right">10 kW</td><td className="py-2 px-3 text-right">3 - 6 kWh</td><td className="py-2 px-3 text-right font-medium">1 800 - 3 600 EUR</td></tr>
                  <tr><td className="py-2 px-3">Plaque gaz 4 feux pro</td><td className="py-2 px-3 text-right">18 kW</td><td className="py-2 px-3 text-right">8 - 12 kWh</td><td className="py-2 px-3 text-right font-medium">2 400 - 3 600 EUR</td></tr>
                  <tr><td className="py-2 px-3">Salamandre / grille</td><td className="py-2 px-3 text-right">5 kW</td><td className="py-2 px-3 text-right">3 - 5 kWh</td><td className="py-2 px-3 text-right font-medium">1 500 - 2 500 EUR</td></tr>
                  <tr><td className="py-2 px-3">Chambre froide positive 8 m3</td><td className="py-2 px-3 text-right">1,8 kW (compresseur)</td><td className="py-2 px-3 text-right">0,5 - 0,9 kWh</td><td className="py-2 px-3 text-right font-medium">1 200 - 2 000 EUR</td></tr>
                  <tr><td className="py-2 px-3">Chambre froide negative 6 m3</td><td className="py-2 px-3 text-right">2,5 kW</td><td className="py-2 px-3 text-right">0,8 - 1,4 kWh</td><td className="py-2 px-3 text-right font-medium">1 800 - 3 000 EUR</td></tr>
                  <tr><td className="py-2 px-3">Frigo positif sous plan</td><td className="py-2 px-3 text-right">0,5 kW</td><td className="py-2 px-3 text-right">0,15 - 0,30 kWh</td><td className="py-2 px-3 text-right font-medium">320 - 700 EUR</td></tr>
                  <tr><td className="py-2 px-3">Lave-vaisselle a capot pro</td><td className="py-2 px-3 text-right">10 kW</td><td className="py-2 px-3 text-right">3 - 5 kWh/cycle</td><td className="py-2 px-3 text-right font-medium">2 500 - 4 500 EUR</td></tr>
                  <tr><td className="py-2 px-3">Hotte extraction motorisee</td><td className="py-2 px-3 text-right">1,5 kW</td><td className="py-2 px-3 text-right">1,2 - 1,5 kWh</td><td className="py-2 px-3 text-right font-medium">1 800 - 2 400 EUR</td></tr>
                  <tr><td className="py-2 px-3">Machine cafe pro 2 groupes</td><td className="py-2 px-3 text-right">3,5 kW</td><td className="py-2 px-3 text-right">1,5 - 2,5 kWh</td><td className="py-2 px-3 text-right font-medium">2 000 - 3 500 EUR</td></tr>
                  <tr><td className="py-2 px-3">Ballon eau chaude 300 L</td><td className="py-2 px-3 text-right">3 kW</td><td className="py-2 px-3 text-right">2 - 3 kWh</td><td className="py-2 px-3 text-right font-medium">1 600 - 2 800 EUR</td></tr>
                </tbody>
              </table>
              <p className="text-xs text-mono-500 mt-3">Hypothese : 250 jours d'ouverture/an, electricite a 0,20 EUR/kWh, gaz a 0,10 EUR/kWh. Cout annuel inclut periodes actives et veille.</p>
            </div>

            <div className="prose-content mt-8">
              <p>
                <strong>Trois enseignements cles :</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-mono-350 mt-3">
                <li>Le <strong>four mixte</strong> est souvent le poste numero 1 en valeur absolue. Investir dans un modele recent classe A+++ peut couper la facture de 30 %.</li>
                <li>L'<strong>induction</strong> consomme 50 a 60 % de moins que le gaz pour le meme service. ROI 3 a 5 ans si vous remplacez du materiel age.</li>
                <li>Les <strong>chambres froides</strong> sont des goulots invisibles : un joint abime ou 5 mm de givre fait exploser la conso de 30 a 40 %.</li>
              </ul>
            </div>
          </section>

          {/* ═════════════ SECTION 5 : Audit ═════════════ */}
          <section id="audit" className="mb-16">
            <SectionHeading icon={<FileText className="w-6 h-6" />} number="5">
              Audit energetique restaurant : 7 etapes concretes
            </SectionHeading>

            <div className="prose-content">
              <p>
                Avant de lancer des actions, faites un diagnostic complet. Vous pouvez le
                realiser en interne (gratuit, 4 a 6 heures de travail) ou faire appel a un
                auditeur certifie (1 500 a 3 500 EUR, indispensable au-dela de 25 000 EUR/an
                de facture energie).
              </p>
            </div>

            <ol className="mt-8 space-y-5">
              {[
                {
                  title: 'Collecter les 12 dernieres factures',
                  body: "Reunissez 12 mois de factures electricite, gaz, eau. Sortez la conso totale annuelle (kWh, m3) et le cout total. Identifiez les pics mensuels (ete/hiver, periodes touristiques). Calculez le cout au kWh reel (cout total / conso totale)."
                },
                {
                  title: 'Cartographier tous les equipements',
                  body: "Listez chaque equipement avec sa puissance (etiquette CE, plaque signaletique), son age et son temps de fonctionnement quotidien. Un tableur a 4 colonnes suffit. C'est l'inventaire de base."
                },
                {
                  title: 'Mesurer les consommations reelles',
                  body: "Pince amperemetrique (50 a 150 EUR) pour mesurer la puissance reelle absorbee par chaque equipement. Comparez avec la puissance nominale. Un equipement encrasse peut surconsommer de 20 a 40 %."
                },
                {
                  title: 'Detecter les pertes thermiques',
                  body: "Thermometre infrarouge (30 a 80 EUR). Verifiez joints chambres froides, isolation conduits eau chaude, dispersion thermique hotte. Un point chaud non explique = perte."
                },
                {
                  title: 'Analyser la courbe de charge horaire',
                  body: "Demandez a votre fournisseur la courbe de charge horaire (compteur Linky Pro). Vous verrez precisement les pics consommation. Une consommation nocturne de plus de 5 % du pic diurne = appareils oublies en veille."
                },
                {
                  title: 'Calculer ratio kWh par couvert',
                  body: "Divisez la conso mensuelle totale par le nombre de couverts servis. Cible : 8-12 kWh/couvert restaurant traditionnel, 12-18 kWh/couvert pizzeria, 5-8 kWh/couvert restauration rapide."
                },
                {
                  title: 'Prioriser les actions par ROI',
                  body: "Classez les actions par retour sur investissement. Commencez par les quick wins gratuits (extinction, regulation), puis les investissements ROI < 24 mois (LED, joints, variateurs), enfin les actions structurelles (heat recovery, photovoltaique)."
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
              en temps reel. Vous voyez immediatement si vous derivez vs vos objectifs.
            </Callout>
          </section>

          {/* ═════════════ SECTION 6 : 25 actions ═════════════ */}
          <section id="actions" className="mb-16">
            <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="6">
              25 actions concretes pour reduire votre facture energie
            </SectionHeading>

            <div className="prose-content">
              <p>
                Voici 25 actions concretes classees par categorie. Chacune indique
                l'investissement, l'economie attendue et le ROI. Combinez 10 a 15 actions
                pour atteindre l'objectif de 25 a 40 % d'economie annuelle.
              </p>
            </div>

            {/* Eclairage */}
            <ActionCategory icon={<Lightbulb className="w-5 h-5" />} title="Eclairage (5 actions)" color="amber">
              <ActionItem n={1} title="Remplacer toutes les ampoules par du LED" invest="200-800 EUR" eco="60-80 % sur eclairage" roi="6-12 mois">Halogenes 50W deviennent LED 5W. Garantie 5 ans (Philips, Osram). LED dimmable 2700-3000K en salle, 4000K en cuisine.</ActionItem>
              <ActionItem n={2} title="Installer des detecteurs de presence" invest="80-200 EUR/piece" eco="30-50 % sur zones intermittentes" roi="8-15 mois">Sanitaires, vestiaires, couloirs, reserves. Eclairage qui s'eteint seul apres 5 minutes sans mouvement.</ActionItem>
              <ActionItem n={3} title="Crepusculaire vitrines et eclairage exterieur" invest="50-150 EUR" eco="20-30 % sur eclairage exterieur" roi="6-12 mois">Cellule qui allume/eteint l'enseigne selon la luminosite naturelle, plus precis qu'un horaire fixe.</ActionItem>
              <ActionItem n={4} title="Maximiser la lumiere naturelle en salle" invest="0 EUR (rideaux/tissus clairs)" eco="10-20 % sur eclairage diurne" roi="immediat">Rideaux clairs, miroirs strategiques, tables plus proches des baies vitrees. La lumiere naturelle est gratuite.</ActionItem>
              <ActionItem n={5} title="Eclairage zone reduit hors service" invest="0 EUR (planification)" eco="5-10 % sur eclairage" roi="immediat">Salle eclairage 50 % entre les services. Cuisine eclairage 100 % seulement quand brigade active.</ActionItem>
            </ActionCategory>

            {/* Cuisson */}
            <ActionCategory icon={<Flame className="w-5 h-5" />} title="Cuisson (6 actions)" color="red">
              <ActionItem n={6} title="Mettre des couvercles sur les casseroles" invest="50-200 EUR (lot couvercles)" eco="25-30 % sur cuisson eau bouillante" roi="immediat">L'eau bout 3 fois plus vite avec couvercle. Reflex automatique a former en brigade.</ActionItem>
              <ActionItem n={7} title="Passer du gaz a l'induction (renouvellement)" invest="3 000-8 000 EUR/plaque" eco="40-50 % vs gaz" roi="3-5 ans si gaz > 10 ans">Rendement induction 90 % vs 50-55 % gaz. ROI rapide si materiel age. Casseroles compatibles requises.</ActionItem>
              <ActionItem n={8} title="Detartrer friteuse + changer huile au bon moment" invest="0 EUR (process)" eco="20-30 % sur friteuse" roi="immediat">Friteuse encrassee chauffe moins bien. Huile usagee = surconsommation. Filtration quotidienne, changement complet selon usage.</ActionItem>
              <ActionItem n={9} title="Detartrer four a vapeur + entretien annuel pro" invest="200-500 EUR/an" eco="5-15 % sur four" roi="immediat">Calcaire isole les resistances. Entretien pro inclut buses, joints, sondes. Garantie etendue souvent.</ActionItem>
              <ActionItem n={10} title="Adapter taille casseroles aux plaques induction" invest="0 EUR (sensibilisation)" eco="5-10 % sur cuisson" roi="immediat">Casserole 18 cm sur plaque 22 cm = 30 % d'energie perdue. Choisir le bon couple casserole-zone.</ActionItem>
              <ActionItem n={11} title="Pre-chauffage juste avant service" invest="0 EUR (procedure)" eco="10-15 % sur four" roi="immediat">Allumer le four 20-30 min avant et non 1h. Beaucoup de fours pro montent en T en 15 min.</ActionItem>
            </ActionCategory>

            {/* Froid */}
            <ActionCategory icon={<Snowflake className="w-5 h-5" />} title="Froid et chambres froides (5 actions)" color="blue">
              <ActionItem n={12} title="Verifier et changer les joints" invest="50-200 EUR/joint" eco="20-30 % sur la chambre" roi="2-6 mois">Test feuille de papier : si elle glisse, joint a changer. Chaque mm de fuite = compresseur qui tourne plus.</ActionItem>
              <ActionItem n={13} title="Degivrage trimestriel manuel" invest="0 EUR" eco="15-25 % sur conso froid" roi="immediat">5 mm de givre = 30 % de surconso. Degivrage complet tous les 3 mois minimum.</ActionItem>
              <ActionItem n={14} title="Regler thermostat a la bonne temperature" invest="0 EUR" eco="5-7 % par degre gagne" roi="immediat">Chambre positive a +3 degC (pas 0), chambre negative a -18 degC (pas -25). Conforme HACCP.</ActionItem>
              <ActionItem n={15} title="Installer rideaux a lanieres" invest="80-200 EUR/m" eco="15-20 % sur chambres a ouverture frequente" roi="6-12 mois">PVC souple. Limite l'echange thermique a chaque ouverture. Indispensable cuisine active.</ActionItem>
              <ActionItem n={16} title="Eviter de surcharger les chambres" invest="0 EUR (organisation)" eco="5-10 %" roi="immediat">Air doit circuler. 10 cm de degagement autour des produits. Une chambre pleine consomme 20 % de plus.</ActionItem>
            </ActionCategory>

            {/* Eau chaude */}
            <ActionCategory icon={<Droplets className="w-5 h-5" />} title="Eau chaude et plonge (4 actions)" color="cyan">
              <ActionItem n={17} title="Regler ballon a 55-60 degC (pas 80)" invest="0 EUR" eco="15-25 % sur ECS" roi="immediat">60 degC suffit pour eviter legionellose. Au-dela, perte pure. Reglage en 2 minutes sur le boitier.</ActionItem>
              <ActionItem n={18} title="Isoler les conduits eau chaude" invest="50-150 EUR (manchons mousse)" eco="10-15 % sur ECS" roi="6-12 mois">Mousse polyethylene a 2 EUR/m. Pertes thermiques tuyaux nus = 20 % de la chaleur produite.</ActionItem>
              <ActionItem n={19} title="Installer mitigeurs economiques sur lavabos" invest="40-80 EUR/lavabo" eco="20-40 % sur eau chaude lavabos" roi="6-12 mois">Aerateurs + limiteurs de debit. Reduit conso eau de 30-50 % sans baisser le confort.</ActionItem>
              <ActionItem n={20} title="Recuperateur de chaleur plonge industrielle" invest="1 500-3 000 EUR" eco="20-30 % sur ECS" roi="18-36 mois">Heat recovery sur l'eau de rincage chaude du lave-vaisselle. Prechauffe l'eau froide entrante.</ActionItem>
            </ActionCategory>

            {/* Hotte et ventilation */}
            <ActionCategory icon={<Wind className="w-5 h-5" />} title="Hotte et ventilation (3 actions)" color="teal">
              <ActionItem n={21} title="Installer un variateur de vitesse sur la hotte" invest="300-600 EUR" eco="20-30 % sur extraction" roi="12-18 mois">Hotte a 3 vitesses au lieu de 100 %. Capteur de chaleur intelligent disponible pour 800-1500 EUR (ROI 18-24 mois).</ActionItem>
              <ActionItem n={22} title="Nettoyer filtres a graisses tous les 15 jours" invest="0 EUR (process)" eco="20-25 % sur moteur hotte" roi="immediat">Filtre encrasse = +25 % conso moteur + risque incendie. Trempage dans degraissant alcalin 1h.</ActionItem>
              <ActionItem n={23} title="Eteindre la hotte 30 min apres fin du service" invest="0 EUR (procedure)" eco="5-10 % sur hotte" roi="immediat">Ne pas laisser tourner toute la soiree par habitude. Process ecrit + checklist fermeture.</ActionItem>
            </ActionCategory>

            {/* Structurel */}
            <ActionCategory icon={<Sun className="w-5 h-5" />} title="Actions structurelles (2 actions)" color="emerald">
              <ActionItem n={24} title="Installer du photovoltaique en autoconsommation" invest="8 000-25 000 EUR (5-12 kWc)" eco="30-50 % sur facture elec" roi="7-12 ans">Toiture sup. a 50 m2 requise. Autoconsommation prioritaire midi = parfait pour restaurant. Garantie 25 ans.</ActionItem>
              <ActionItem n={25} title="Souscrire un contrat heures creuses si pertinent" invest="0 EUR (changement contrat)" eco="5-15 % sur elec" roi="immediat">Uniquement si gros lave-vaisselle nocturne, ballon ECS programmable ou production matinale. Demander audit tarifaire fournisseur d'abord.</ActionItem>
            </ActionCategory>

            <Callout type="success">
              <strong>Plan d'action recommande :</strong> commencez par les 10 actions a ROI
              immediat ou inferieur a 6 mois (actions 4, 5, 6, 8, 10, 11, 13, 14, 16, 17, 22, 23).
              Vous economisez deja 15-20 % sans gros investissement. Puis enchainez sur les
              actions ROI 6-24 mois (LED, joints, variateurs). En 12 mois, vous etes a -30 %.
            </Callout>
          </section>

          {/* ═════════════ SECTION 7 : Aides ═════════════ */}
          <section id="aides" className="mb-16">
            <SectionHeading icon={<Gift className="w-6 h-6" />} number="7">
              Aides 2026 : CEE, France 2030, regionales
            </SectionHeading>

            <div className="prose-content">
              <p>
                Pour vos investissements energie, ne payez jamais le prix plein. Plusieurs
                dispositifs financent 20 a 70 % de vos travaux d'efficacite energetique en 2026.
                Voici la cartographie a jour.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mt-8">
              <div className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-mono-100">CEE (Certificats Economies Energie)</h3>
                </div>
                <p className="text-sm text-mono-400 leading-relaxed mb-3">
                  Dispositif obligatoire impose par l'Etat aux fournisseurs d'energie.
                  Financent jusqu'a 70 % de vos travaux : LED, hotte a variateur, chambre
                  froide neuve A+++, isolation, pompe a chaleur.
                </p>
                <div className="text-xs text-mono-500"><strong>Montants typiques :</strong> 500-3 000 EUR par projet. Cumul possible plusieurs CEE.</div>
              </div>

              <div className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-mono-100">France 2030 (decarbonation)</h3>
                </div>
                <p className="text-sm text-mono-400 leading-relaxed mb-3">
                  Plan d'investissement etatique. Volet decarbonation industrie et tertiaire.
                  Subventionne jusqu'a 50 % les investissements de recuperation de chaleur,
                  electrification (gaz vers induction), photovoltaique en autoconsommation.
                </p>
                <div className="text-xs text-mono-500"><strong>Montants :</strong> 5 000-50 000 EUR. Dossier ADEME, depot en ligne.</div>
              </div>

              <div className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-mono-100">Aide regionale AURA TPE</h3>
                </div>
                <p className="text-sm text-mono-400 leading-relaxed mb-3">
                  Auvergne-Rhone-Alpes : aide aux TPE pour audit + travaux. Jusqu'a 5 000 EUR.
                  Existe aussi en Bretagne, Ile-de-France (TPE Verte), Nouvelle-Aquitaine,
                  Occitanie. Cumulable avec CEE.
                </p>
                <div className="text-xs text-mono-500"><strong>Demande :</strong> portail region, avant travaux.</div>
              </div>

              <div className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-mono-100">Pret BPI Eco-Energie</h3>
                </div>
                <p className="text-sm text-mono-400 leading-relaxed mb-3">
                  Pret a taux bonifie de BPI France pour financer la transition energetique.
                  Jusqu'a 75 000 EUR sans garantie personnelle. Taux preferentiel vs marche
                  bancaire. Cumulable avec subventions.
                </p>
                <div className="text-xs text-mono-500"><strong>Conditions :</strong> moins de 50 salaries, projet sup. a 5 000 EUR.</div>
              </div>
            </div>

            <Callout type="warning">
              <strong>Attention RGE :</strong> la majorite des aides exigent un installateur
              RGE (Reconnu Garant de l'Environnement). Verifiez le label sur france-renov.gouv.fr
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
                Tous les investissements energie ne se valent pas. Voici un classement par
                retour sur investissement, pour orienter votre budget travaux 2026. Hypotheses :
                restaurant 200 000-500 000 EUR de CA, facture energie 15 000-25 000 EUR/an.
              </p>
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-mono-975 text-mono-350">
                    <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Investissement</th>
                    <th className="text-right py-3 px-4 font-semibold">Cout typique</th>
                    <th className="text-right py-3 px-4 font-semibold">Economie/an</th>
                    <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">ROI</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Remplacement joints chambre froide</td><td className="py-3 px-4 text-right">200 EUR</td><td className="py-3 px-4 text-right">400-800 EUR</td><td className="py-3 px-4 text-right font-bold text-emerald-700">3-6 mois</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">LED salle + cuisine</td><td className="py-3 px-4 text-right">500 EUR</td><td className="py-3 px-4 text-right">800-1 200 EUR</td><td className="py-3 px-4 text-right font-bold text-emerald-700">5-8 mois</td></tr>
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Detecteurs presence (5 zones)</td><td className="py-3 px-4 text-right">600 EUR</td><td className="py-3 px-4 text-right">600-1 000 EUR</td><td className="py-3 px-4 text-right font-bold text-emerald-700">7-12 mois</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Variateur hotte extraction</td><td className="py-3 px-4 text-right">500 EUR</td><td className="py-3 px-4 text-right">400-700 EUR</td><td className="py-3 px-4 text-right font-bold text-emerald-700">9-15 mois</td></tr>
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Mitigeurs economiques lavabos</td><td className="py-3 px-4 text-right">300 EUR</td><td className="py-3 px-4 text-right">200-400 EUR</td><td className="py-3 px-4 text-right font-bold text-emerald-700">10-18 mois</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Heat recovery plonge</td><td className="py-3 px-4 text-right">2 500 EUR</td><td className="py-3 px-4 text-right">1 000-1 800 EUR</td><td className="py-3 px-4 text-right font-bold text-amber-700">18-30 mois</td></tr>
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Remplacement chambre froide A+++</td><td className="py-3 px-4 text-right">6 000 EUR</td><td className="py-3 px-4 text-right">1 800-2 500 EUR</td><td className="py-3 px-4 text-right font-bold text-amber-700">30-40 mois</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Passage gaz vers induction</td><td className="py-3 px-4 text-right">10 000 EUR</td><td className="py-3 px-4 text-right">2 500-3 500 EUR</td><td className="py-3 px-4 text-right font-bold text-amber-700">3-5 ans</td></tr>
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Photovoltaique 8 kWc</td><td className="py-3 px-4 text-right">15 000 EUR</td><td className="py-3 px-4 text-right">1 500-2 500 EUR</td><td className="py-3 px-4 text-right font-bold text-orange-700">7-12 ans</td></tr>
                </tbody>
              </table>
            </div>

            <div className="prose-content mt-8">
              <p>
                <strong>Strategie d'investissement recommandee :</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-mono-350 mt-3">
                <li><strong>Mois 1-3 :</strong> actions a ROI moins de 6 mois (joints, LED, formation equipe, reglage thermostats).</li>
                <li><strong>Mois 4-12 :</strong> actions ROI 6-18 mois (detecteurs presence, variateur hotte, mitigeurs).</li>
                <li><strong>Annee 2 :</strong> actions structurelles ROI 18-36 mois (heat recovery, isolation, chambre froide).</li>
                <li><strong>Annee 3+ :</strong> photovoltaique et passage induction si gaz a remplacer.</li>
              </ul>
              <p className="mt-4">
                Cumulees, ces actions vous amenent a une baisse de 25 a 40 % de la facture
                energie sur 24 mois, avec un investissement total de 5 000 a 15 000 EUR (hors
                photovoltaique et induction). Avec les aides CEE et France 2030, le reste a
                charge tombe souvent a 2 000 a 6 000 EUR.
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
                <div className="font-semibold text-mono-100 text-sm">Budget previsionnel restaurant : la methode complete</div>
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
              Questions frequentes sur le cout energie restaurant
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
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Suivez vos charges energie avec RestauMargin</h2>
        <p className="text-teal-50 max-w-xl mx-auto mb-8 leading-relaxed">
          Notre module suivi des charges enregistre vos consommations electricite, gaz et eau,
          calcule votre ratio kWh/couvert en temps reel et alerte des qu'une derive depasse votre seuil.
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
        <Link to="/landing" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4">
          <ChefHat className="w-6 h-6 text-teal-600" />
          RestauMargin
        </Link>
        <p className="mt-6 text-xs text-mono-700">&copy; {new Date().getFullYear()} RestauMargin. Tous droits reserves.</p>
      </div>
    </footer>
  );
}
