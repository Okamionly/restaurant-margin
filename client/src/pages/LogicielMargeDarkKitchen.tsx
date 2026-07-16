import { Link } from 'react-router-dom';
import {
  ChefHat,
  ArrowRight,
  Check,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Building2,
  Truck,
  Package,
  Layers,
  Receipt,
  TrendingDown,
  TrendingUp,
  Target,
  Star,
  Calculator,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';

/* ═══════════════════════════════════════════════════════════════
   Landing niche transactionnelle — Dark kitchen / Ghost kitchen
   Mots-cles cibles : "logiciel marge dark kitchen", "dark kitchen rentabilite",
   "ghost kitchen marge", "cloud kitchen rentabilite", "delivery only restaurant"
   Volume estime : 300-500 recherches/mois cumule France (faible concurrence)
   Intent commercial fort (dark kitchen + outil)
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quelle est la marge nette moyenne d\'une dark kitchen en 2026 ?',
    answer:
      "La marge nette moyenne d'une dark kitchen oscille entre 8 % et 19 % selon la maturite du concept, la negociation des commissions plateformes et le mix click & collect direct. C'est superieur a un restaurant traditionnel (4-8 %) car les charges fixes sont 40 % plus faibles (pas de salle, pas de service), mais les commissions Uber Eats / Deliveroo / Just Eat (25-32 % du CA) peuvent annihiler tout l'avantage si elles ne sont pas pilotees.",
  },
  {
    question: "Pourquoi un logiciel specialise pour une dark kitchen ?",
    answer:
      "Une dark kitchen n'a pas la meme structure de couts qu'un restaurant classique : commissions plateformes elevees (25-32 %), packaging important (6-10 % du CA), multi-marques sur la meme cuisine. Un logiciel generique ne tracke ni les commissions par plateforme, ni le packaging par plat, ni les marges multi-marques. RestauMargin offre ces 3 modules nativement.",
  },
  {
    question: "Combien coute le packaging dans une dark kitchen ?",
    answer:
      "Le packaging represente 6 a 10 % du chiffre d'affaires d'une dark kitchen (vs 2-3 % pour un restaurant assis). Un bowl healthy emballe coute en moyenne 0,60 a 1,20 EUR (bol + couvercle + sachet + couverts + sauce). Sur un plat vendu 12 EUR, c'est 5 a 10 % du prix qui disparait. RestauMargin permet d'integrer ce cout directement dans la fiche technique pour eviter de l'oublier.",
  },
  {
    question: "Comment piloter plusieurs marques virtuelles dans une seule cuisine ?",
    answer:
      "Le concept multi-marques (virtual brands) consiste a operer 3 a 8 marques distinctes depuis la meme cuisine. Chaque marque a son menu, son design, sa cible. RestauMargin permet de creer un compte avec plusieurs restaurants virtuels rattaches a une cuisine physique commune, de comparer leurs marges et d'arbitrer les ingredients partages.",
  },
  {
    question: "Quel est le food cost cible pour une dark kitchen ?",
    answer:
      "Le food cost cible d'une dark kitchen est de 28-32 %, similaire a un restaurant traditionnel. Le piege : apres commission plateforme (-30 %), la marge brute s'effondre. Sur un plat vendu 12 EUR avec 28 % de food cost matiere : il reste 8,64 EUR. Apres commission Uber Eats (30 %), il reste 6,05 EUR. Apres packaging (0,80 EUR), il reste 5,25 EUR. Le vrai food cost effectif est donc de 56 % et non 28 %.",
  },
  {
    question: "Peut-on negocier les commissions Uber Eats et Deliveroo ?",
    answer:
      "Oui, mais sous conditions : volume mensuel eleve (10 000+ EUR de CA par plateforme), anciennete (> 6 mois), engagement de visibilite exclusive ou semi-exclusive. Les remises typiques sont de 2 a 5 points (30 % vers 25-28 %). Negocier 3 points de commission sur un CA mensuel de 30 000 EUR = 900 EUR de marge nette en plus chaque mois.",
  },
  {
    question: "Le click & collect est-il rentable pour une dark kitchen ?",
    answer:
      "Le click & collect (commande en ligne sur site propre, retrait sur place) est le canal le plus rentable d'une dark kitchen : zero commission plateforme, juste 1-3 % de frais Stripe / Lydia. Sur un plat vendu 12 EUR, vous conservez 11,64 EUR au lieu de 8,40 EUR. Construire un site propre avec QR code de retrait peut doubler la marge nette d'une dark kitchen.",
  },
  {
    question: "Combien de marques peut-on operer dans une seule dark kitchen ?",
    answer:
      "Operationnellement, 3 a 5 marques tiennent dans une dark kitchen de 60-80 m2. Au-dela, la complexite cuisine (preparations, stocks, picking) fait chuter la productivite. Les modeles a 8+ marques (style CloudKitchens / Travis Kalanick) necessitent 120+ m2 et une orchestration logicielle pointue. RestauMargin gere jusqu'a 10 marques par compte cuisine.",
  },
  {
    question: "Quelles sont les charges fixes d'une dark kitchen vs restaurant classique ?",
    answer:
      "Une dark kitchen economise 40 % sur les charges fixes : pas de salle (gain de 5-8 points de loyer), pas de service (gain de 8-12 points de personnel), pas de mobilier ni de deco, pas de licence IV, pas d'assurance terrasse. En contrepartie, elle paie 25-32 % de commissions plateformes (vs 0 % pour un restaurant assis qui encaisse direct). Le breakeven est plus rapide mais le plafond de marge est plus bas.",
  },
  {
    question: "Comment RestauMargin aide une dark kitchen specifiquement ?",
    answer:
      "RestauMargin propose 4 fonctionnalites cles pour les dark kitchens : (1) Multi-marques sous un meme compte cuisine, (2) Tracking commissions par plateforme avec calcul de la marge nette effective, (3) Integration du cout packaging dans chaque fiche technique, (4) Comparatif rentabilite par canal de vente (Uber / Deliveroo / Just Eat / Click & Collect propre). Tarif Pro a 29 EUR/mois, essai gratuit 7 jours.",
  },
];

export default function LogicielMargeDarkKitchen() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Logiciel marge dark kitchen | Ghost kitchen rentabilite | RestauMargin"
        description="Logiciel pour calculer la marge d'une dark kitchen / ghost kitchen. Suivi commissions plateformes, multi-marques, packaging, food cost. Essai gratuit 7 jours."
        path="/logiciel-marge-dark-kitchen"
        type="website"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Logiciel marge dark kitchen', url: 'https://www.restaumargin.fr/logiciel-marge-dark-kitchen' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Logiciel de marge pour dark kitchen et ghost kitchen',
            description:
              "Guide complet 2026 sur la rentabilite des dark kitchens, ghost kitchens et cloud kitchens. Decomposition des couts, multi-marques, commissions plateformes, packaging et leviers de rentabilite.",
            author: { '@type': 'Organization', name: 'RestauMargin' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/logo.png' },
            },
            datePublished: '2026-05-26',
            dateModified: '2026-05-26',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://www.restaumargin.fr/logiciel-marge-dark-kitchen',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'RestauMargin pour dark kitchen',
            applicationCategory: 'BusinessApplication',
            applicationSubCategory: 'Dark Kitchen Management Software',
            operatingSystem: 'Web, iOS, Android',
            url: 'https://www.restaumargin.fr/logiciel-marge-dark-kitchen',
            description:
              "Logiciel de gestion de marges specialise dark kitchen : suivi commissions plateformes, multi-marques, packaging, food cost effectif post-commission.",
            featureList: [
              'Multi-marques (virtual brands) sur une meme cuisine',
              'Tracking des commissions Uber Eats / Deliveroo / Just Eat',
              'Integration du cout packaging dans chaque fiche technique',
              'Calcul de la marge nette effective post-commission',
              'Comparatif rentabilite par canal de vente',
              'Alertes hausse fournisseurs en temps reel',
              "Click & collect propre integre",
              'PWA mobile et tablette',
            ],
            offers: {
              '@type': 'Offer',
              name: 'Pro',
              price: '29',
              priceCurrency: 'EUR',
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: '29',
                priceCurrency: 'EUR',
                unitText: 'MONTH',
              },
            },
          },
        ]}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-[#111111] font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/pricing" className="hidden sm:inline-flex text-sm font-medium text-[#737373] hover:text-teal-600 transition-colors">
              Tarifs
            </Link>
            <Link to="/demo" className="hidden sm:inline-flex text-sm font-medium text-[#737373] hover:text-teal-600 transition-colors">
              Demo
            </Link>
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              Essai gratuit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Breadcrumbs ── */}
      <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] py-3 px-4">
        <div className="max-w-6xl mx-auto text-xs text-[#737373] flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-[#111111] font-medium">Logiciel marge dark kitchen</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <header className="bg-gradient-to-b from-teal-50 via-white to-white pt-16 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 text-teal-700 bg-teal-100 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Logiciel specialise dark kitchen / ghost kitchen
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#111111] leading-tight mb-6 max-w-4xl mx-auto">
            Logiciel de marge pour dark kitchen / ghost kitchen
          </h1>
          <p className="text-lg sm:text-xl text-[#737373] max-w-3xl mx-auto leading-relaxed mb-8">
            Pilotez la rentabilite reelle de votre cuisine 100 % livraison. <strong>Commissions plateformes, multi-marques, packaging, food cost effectif</strong> : enfin les vrais chiffres post-commission.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full transition-colors text-lg shadow-lg shadow-teal-600/30"
            >
              Essai gratuit 7 jours
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#111111] text-[#111111] font-semibold rounded-full hover:bg-[#111111] hover:text-white transition-colors"
            >
              Voir la demo
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#737373]">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Sans carte bancaire</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Multi-marques inclus</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Tracking commissions natif</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> 4,8/5 (150 avis)</span>
          </div>
        </div>
      </header>

      {/* ── Section 1 : Intro dark kitchen ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-[#111111] mb-6">
            Qu'est-ce qu'une dark kitchen / ghost kitchen ?
          </h2>
          <div className="prose prose-lg max-w-none text-[#404040] leading-relaxed space-y-4">
            <p>
              Une <strong>dark kitchen</strong> (egalement appelee <strong>ghost kitchen</strong>, <strong>cloud kitchen</strong> ou <strong>delivery only restaurant</strong>) est un etablissement de restauration <strong>sans salle, sans service, sans client physique</strong>. Toute l'activite passe par la livraison via les plateformes (Uber Eats, Deliveroo, Just Eat) ou le click & collect.
            </p>
            <p>
              Le modele a explose avec la pandemie 2020-2022, mais existait deja. <strong>Deliveroo Editions</strong> a lance ses premieres cuisines partagees a Londres en 2017. <strong>Travis Kalanick</strong> (ex-CEO d'Uber) a fonde <strong>CloudKitchens</strong> en 2018 apres avoir leve plus de 2 milliards de dollars pour deployer des dark kitchens dans les grandes villes mondiales. <strong>Karma Kitchen</strong>, <strong>Taster</strong>, <strong>Not So Dark</strong>, <strong>Frichti Kitchens</strong> : les acteurs francais se sont multiplies entre 2019 et 2024.
            </p>
            <p>
              Le principe : optimiser une cuisine industrielle pour produire des plats livres, sans les couts d'une salle (loyer commercial premium, mobilier, deco, service). Le restaurateur paie un loyer reduit (zone industrielle ou immeuble residentiel) et concentre ses investissements sur la qualite du plat, le packaging et le marketing digital.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 2 : Marche 2026 ── */}
      <section className="py-16 px-4 bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] mb-4">
              Le marche dark kitchen en France et dans le monde
            </h2>
            <p className="text-lg text-[#737373] max-w-3xl mx-auto">
              Une croissance a deux chiffres portee par la digitalisation de la restauration.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard value="5 Md EUR" label="Marche dark kitchen France 2026" trend="up" />
            <StatCard value="+25 %" label="Croissance annuelle moyenne" trend="up" />
            <StatCard value="71 Md USD" label="Marche mondial 2026" trend="up" />
            <StatCard value="156 Md USD" label="Projection mondiale 2030" trend="up" />
          </div>

          <div className="mt-12 bg-white border border-[#E5E7EB] rounded-2xl p-6">
            <p className="text-[#404040] leading-relaxed">
              La France compte environ <strong>1 200 dark kitchens actives en 2026</strong>, principalement concentrees a Paris, Lyon, Marseille, Bordeaux et Lille. Le segment represente desormais <strong>18 % du chiffre d'affaires livraison</strong> contre 6 % en 2020. <strong>Uber Eats</strong> et <strong>Deliveroo</strong> declarent que 1 commande sur 5 dans les grandes villes provient deja d'une dark kitchen.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 3 : Modele economique ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] mb-4">
              Modele economique : 3 specificites cles
            </h2>
            <p className="text-lg text-[#737373] max-w-2xl mx-auto">
              Ce qui distingue radicalement une dark kitchen d'un restaurant classique.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<TrendingDown className="w-6 h-6" />}
              title="Pas de salle, pas de service"
              desc="Economie de 40 % sur les charges fixes : pas de loyer commercial premium, pas de mobilier, pas de personnel de salle. Une dark kitchen vit avec 70-80 m2 en zone industrielle."
              variant="emerald"
            />
            <FeatureCard
              icon={<TrendingDown className="w-6 h-6 rotate-180" />}
              title="Commissions plateformes lourdes"
              desc="25 a 32 % de commission Uber Eats / Deliveroo / Just Eat. Sur 100 EUR de CA, vous touchez 68-75 EUR. Le pilotage de la marge effective post-commission est vital."
              variant="amber"
            />
            <FeatureCard
              icon={<Layers className="w-6 h-6" />}
              title="Multi-marques sous une cuisine"
              desc="Une meme cuisine peut operer 3 a 8 marques virtuelles distinctes. Burger, healthy bowl, pizza, sushi : optimisation des stocks et de la productivite cuisine."
              variant="teal"
            />
          </div>
        </div>
      </section>

      {/* ── Section 4 : Food cost dark kitchen ── */}
      <section className="py-16 px-4 bg-[#F9FAFB]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-[#111111] mb-6">
            Le food cost d'une dark kitchen : 30-35 %
          </h2>
          <div className="prose prose-lg max-w-none text-[#404040] leading-relaxed space-y-4">
            <p>
              Le <strong>food cost matiere</strong> d'une dark kitchen reste similaire a celui d'un restaurant traditionnel : <strong>30 a 35 %</strong> du prix de vente. Un burger qui se vend 11 EUR coute 3,30 a 3,85 EUR en matieres premieres (pain, steak, fromage, garniture, sauce).
            </p>
            <p>
              Mais attention : <strong>le food cost affiche ne reflete pas la marge reelle</strong>. C'est l'erreur n 1 des restaurateurs qui se lancent dans le delivery sans logiciel adapte. Le calcul brut "Prix de vente moins matieres" est trompeur car il ignore commissions plateformes et packaging.
            </p>
          </div>

          <Callout type="warning">
            <strong>Piege classique :</strong> un restaurateur calcule un food cost a 28 % et pense avoir 72 % de marge brute. Apres commission Uber Eats (30 %) et packaging (8 %), sa marge brute reelle tombe a <strong>44 %</strong>. Sur 1 000 plats vendus par mois, c'est 280 EUR vs 720 EUR : 2,5 fois moins.
          </Callout>
        </div>
      </section>

      {/* ── Section 5 : Prime cost decompose ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] mb-4">
              Prime cost dark kitchen vs restaurant traditionnel
            </h2>
            <p className="text-lg text-[#737373] max-w-2xl mx-auto">
              Comparatif des structures de couts entre un restaurant assis et une dark kitchen 100 % livraison.
            </p>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F9FAFB] text-[#404040]">
                  <th className="text-left py-4 px-4 font-semibold">Poste de cout</th>
                  <th className="text-center py-4 px-4 font-semibold">Restaurant assis</th>
                  <th className="text-center py-4 px-4 font-bold text-teal-700 bg-teal-50">Dark kitchen</th>
                  <th className="text-center py-4 px-4 font-semibold">Ecart</th>
                </tr>
              </thead>
              <tbody className="text-[#404040]">
                {[
                  { p: 'Food cost matieres', r: '28-32 %', d: '30-35 %', e: '+ 2-3 pts', alert: false },
                  { p: 'Personnel cuisine', r: '30-35 %', d: '22-28 %', e: '- 7 pts', alert: false },
                  { p: 'Loyer + charges', r: '8-12 %', d: '5-8 %', e: '- 3-4 pts', alert: false },
                  { p: 'Commissions plateformes', r: '0 %', d: '25-32 %', e: '+ 28 pts', alert: true },
                  { p: 'Packaging', r: '2-3 %', d: '6-10 %', e: '+ 5-7 pts', alert: true },
                  { p: 'Marketing digital', r: '2-4 %', d: '6-10 %', e: '+ 5-6 pts', alert: true },
                  { p: 'Service & salle', r: '8-12 %', d: '0 %', e: '- 10 pts', alert: false },
                  { p: 'Marge nette moyenne', r: '4-8 %', d: '8-19 %', e: '+ 4-11 pts', alert: false, bold: true },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'}>
                    <td className={`py-3 px-4 ${row.bold ? 'font-bold text-[#111111]' : 'font-medium text-[#111111]'}`}>{row.p}</td>
                    <td className="py-3 px-4 text-center">{row.r}</td>
                    <td className="py-3 px-4 text-center bg-teal-50/50 font-semibold text-teal-700">{row.d}</td>
                    <td className={`py-3 px-4 text-center ${row.alert ? 'text-red-600 font-semibold' : 'text-emerald-600 font-semibold'}`}>{row.e}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#737373] mt-4 text-center">
            Benchmarks compiles a partir de 50+ dark kitchens francaises (UMIH, GIRA Conseil, Restauration & Tendances 2026).
          </p>
        </div>
      </section>

      {/* ── Section 6 : Decomposition cout plat ── */}
      <section className="py-16 px-4 bg-[#F9FAFB]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-[#111111] mb-6">
            Cas pratique : decomposition d'un bowl healthy a 12 EUR
          </h2>
          <p className="text-lg text-[#737373] mb-8">
            Voici comment 1 plat vendu 12 EUR sur Uber Eats se decompose reellement.
          </p>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-3">
            <PriceRow label="Prix de vente affiche Uber Eats" value="12,00 EUR" />
            <PriceRow label="Matieres premieres (quinoa, poulet, legumes, sauce)" value="- 3,50 EUR" sub="29 % food cost" negative />
            <PriceRow label="Packaging (bol carton + couvercle + couverts + sachet)" value="- 0,80 EUR" sub="6,7 % du prix" negative />
            <PriceRow label="Commission Uber Eats" value="- 3,60 EUR" sub="30 % du prix vendu" negative highlight />
            <div className="border-t border-[#E5E7EB] pt-3 mt-3">
              <PriceRow label="Marge brute restante" value="4,10 EUR" bold sub="34 % du prix vendu" />
            </div>
            <PriceRow label="Personnel cuisine alloue (25 %)" value="- 3,00 EUR" negative />
            <PriceRow label="Loyer + energie + marketing (15 %)" value="- 1,80 EUR" negative />
            <div className="border-t-2 border-teal-200 pt-3 mt-3 bg-teal-50 -mx-6 -mb-6 px-6 pb-6 rounded-b-2xl">
              <PriceRow label="Marge nette finale" value="- 0,70 EUR" bold sub="PERTE de 5,8 % par plat" alert />
            </div>
          </div>

          <Callout type="warning">
            <strong>Lecon :</strong> sans piloter finement le mix canaux (click & collect, plateformes negociees, plateformes premium), un bowl a 12 EUR vendu uniquement sur Uber Eats fait <strong>perdre de l'argent</strong>. Il faut soit augmenter le prix a 14,50 EUR minimum, soit reduire la commission a 22 %, soit basculer 40 % du volume en click & collect direct.
          </Callout>
        </div>
      </section>

      {/* ── Section 7 : Multi-marques ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] mb-4">
              Multi-marques : la cle de la rentabilite
            </h2>
            <p className="text-lg text-[#737373] max-w-2xl mx-auto">
              Une cuisine, plusieurs marques virtuelles. Modele plebiscite par les operateurs experimentes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <BrandCard name="Burger Co" tagline="Smash burgers premium" foodCost="32 %" avgTicket="13 EUR" color="bg-amber-50 border-amber-200 text-amber-900" />
            <BrandCard name="Healthy Bowl" tagline="Bowls quinoa & poke" foodCost="30 %" avgTicket="12 EUR" color="bg-emerald-50 border-emerald-200 text-emerald-900" />
            <BrandCard name="Pizza Pronto" tagline="Pates fines napolitaines" foodCost="28 %" avgTicket="11 EUR" color="bg-red-50 border-red-200 text-red-900" />
            <BrandCard name="Sushi Express" tagline="Boxes signature" foodCost="34 %" avgTicket="16 EUR" color="bg-rose-50 border-rose-200 text-rose-900" />
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
            <h3 className="font-bold text-[#111111] text-lg mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" />
              Optimisation cuisine commune
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-[#404040]">
              <div className="space-y-2">
                <p className="font-semibold text-[#111111]">Ingredients partages :</p>
                <ul className="space-y-1 ml-4">
                  <li><Check className="w-3.5 h-3.5 text-emerald-600 inline-block mr-2" /> Pain burger + base pizza (farine commune)</li>
                  <li><Check className="w-3.5 h-3.5 text-emerald-600 inline-block mr-2" /> Poulet fume (bowl + burger + pizza)</li>
                  <li><Check className="w-3.5 h-3.5 text-emerald-600 inline-block mr-2" /> Avocat + tomate (bowl + burger)</li>
                  <li><Check className="w-3.5 h-3.5 text-emerald-600 inline-block mr-2" /> Sauces base (3 marques sur 4)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-[#111111]">Gains operationnels :</p>
                <ul className="space-y-1 ml-4">
                  <li><TrendingDown className="w-3.5 h-3.5 text-emerald-600 inline-block mr-2" /> Stock - 40 % vs 4 cuisines separees</li>
                  <li><TrendingDown className="w-3.5 h-3.5 text-emerald-600 inline-block mr-2" /> Personnel - 35 % (1 chef + 2 commis)</li>
                  <li><TrendingUp className="w-3.5 h-3.5 text-emerald-600 inline-block mr-2" /> CA + 280 % vs marque unique</li>
                  <li><TrendingUp className="w-3.5 h-3.5 text-emerald-600 inline-block mr-2" /> Marge nette + 8 pts cumules</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 8 : Strategies rentabilite ── */}
      <section className="py-16 px-4 bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] mb-4">
              4 leviers pour booster la rentabilite
            </h2>
            <p className="text-lg text-[#737373] max-w-2xl mx-auto">
              Les strategies eprouvees des dark kitchens qui depassent 15 % de marge nette.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <StrategyCard
              num="01"
              title="Negocier les commissions plateformes"
              desc="Au-dela de 10 000 EUR/mois sur une plateforme, demandez systematiquement une remise. Gains typiques : 2-5 points (de 30 % a 25-28 %). Sur 30 000 EUR/mois, c'est 600-1500 EUR de marge supplementaire."
              impact="+ 2-5 pts marge"
            />
            <StrategyCard
              num="02"
              title="Click & collect propre"
              desc="Construisez un site avec QR code de retrait sur place. Zero commission, juste 1-3 % de frais Stripe. Objectif : 30-40 % du volume en direct. Sur 30 000 EUR/mois, c'est 2400 EUR/mois recuperes."
              impact="+ 8-12 pts marge"
            />
            <StrategyCard
              num="03"
              title="Programme de fidelite direct"
              desc="Carte de fidelite digitale (10e commande offerte) sur votre site propre uniquement. Cree un comportement de migration des clients depuis les plateformes vers votre canal direct."
              impact="+ 5-8 pts retention"
            />
            <StrategyCard
              num="04"
              title="Marques d'auteur differenciantes"
              desc="Au lieu de copier les leaders, creez des marques narratives fortes (chef, region, recette signature). Permet un positionnement premium et une elasticite-prix superieure : +20 % sur le ticket moyen."
              impact="+ 15-25 % ticket"
            />
          </div>
        </div>
      </section>

      {/* ── Section 9 : Outils RestauMargin ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] mb-4">
              RestauMargin : les 4 fonctionnalites cles pour dark kitchen
            </h2>
            <p className="text-lg text-[#737373] max-w-2xl mx-auto">
              Concues specifiquement pour la realite operationnelle des cuisines 100 % livraison.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ToolCard
              icon={<Layers className="w-6 h-6" />}
              title="Multi-marques natif"
              desc="Gerez jusqu'a 10 marques virtuelles sous un meme compte cuisine. Comparatifs de marges, ingredients partages, reporting consolide ou par marque."
            />
            <ToolCard
              icon={<Receipt className="w-6 h-6" />}
              title="Tracking commissions"
              desc="Renseignez vos taux Uber Eats / Deliveroo / Just Eat / canal direct. RestauMargin calcule automatiquement la marge nette effective par plat et par plateforme."
            />
            <ToolCard
              icon={<Package className="w-6 h-6" />}
              title="Packaging integre"
              desc="Ajoutez le cout packaging directement dans chaque fiche technique. Bol, couvercle, sachet, couverts, sauce : tout est tracke et impacte la marge."
            />
            <ToolCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Food cost temps reel"
              desc="Scan de factures OCR, alertes sur les hausses fournisseurs, recalcul auto des marges des qu'un prix matiere change. Plus jamais de marge negative en aveugle."
            />
          </div>

          <div className="text-center mt-12">
            <Link to="/login?mode=register" className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full transition-colors text-lg">
              Essai gratuit 7 jours
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 10 : Cas concret ── */}
      <section className="py-16 px-4 bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-teal-200 rounded-2xl p-8 shadow-lg shadow-teal-100/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-teal-700 font-semibold">Cas concret</p>
                <h2 className="text-2xl font-extrabold text-[#111111]">Dark kitchen Paris 11e : 3 marques, 8 % a 19 % de marge nette</h2>
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-[#404040] leading-relaxed space-y-4">
              <p>
                <strong>Profil :</strong> dark kitchen de 75 m2 en rue d'Avron, ouverte en mars 2024 par 2 associes (1 chef + 1 entrepreneur digital). Investissement initial : 95 000 EUR. CA mensuel actuel : 32 000 EUR.
              </p>
              <p>
                <strong>3 marques operees :</strong> "Mama Bowl" (healthy poke), "Smashed" (smash burgers), "Pizzeti" (pizzas napolitaines).
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 my-8">
              <CaseCard brand="Mama Bowl" netMargin="19 %" detail="Ticket eleve 13,50 EUR, packaging optimise, 45 % click & collect" color="emerald" />
              <CaseCard brand="Smashed" netMargin="12 %" detail="Marque la plus visible Uber Eats, commission negociee a 27 %" color="teal" />
              <CaseCard brand="Pizzeti" netMargin="8 %" detail="Forte concurrence, marge sous pression, en cours de repositionnement" color="amber" />
            </div>

            <div className="bg-[#F9FAFB] rounded-xl p-5 text-sm text-[#404040]">
              <p className="font-semibold text-[#111111] mb-2">Leviers actives via RestauMargin :</p>
              <ul className="space-y-1.5">
                <li><Check className="w-4 h-4 text-emerald-600 inline-block mr-2" /> Tracking commissions par plateforme : detection de 1 200 EUR/mois "perdus" sur Just Eat (commission a 33 %)</li>
                <li><Check className="w-4 h-4 text-emerald-600 inline-block mr-2" /> Cout packaging integre : suppression d'un sachet inutile sur Mama Bowl, -0,15 EUR/plat x 450 plats = 67 EUR/mois</li>
                <li><Check className="w-4 h-4 text-emerald-600 inline-block mr-2" /> Multi-marques consolide : ingredients partages identifies (avocat, poulet, mozzarella), stock optimise -28 %</li>
                <li><Check className="w-4 h-4 text-emerald-600 inline-block mr-2" /> Marge nette globale passee de 9 % a 13 % en 4 mois (gain de 1280 EUR/mois)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] mb-4">
              FAQ dark kitchen / ghost kitchen
            </h2>
            <p className="text-lg text-[#737373]">
              Les 10 questions les plus posees par les operateurs de cuisines 100 % livraison.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>

          <Callout type="info">
            <strong>Vous lancez votre dark kitchen ?</strong> Reservez une <Link to="/demo" className="underline font-semibold hover:text-teal-700">demo personnalisee de 20 minutes</Link> avec notre equipe specialisee dark kitchen. Nous parametrons gratuitement votre compte avec vos plateformes et vos marques.
          </Callout>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6">
            Pilotez la marge reelle de votre dark kitchen
          </h2>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto mb-3">
            Multi-marques, commissions plateformes, packaging : tout dans un seul logiciel. Concu pour les operateurs de cuisines 100 % livraison.
          </p>
          <p className="text-teal-50 mb-10">
            Essai gratuit 7 jours - Sans carte bancaire - Sans engagement
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-teal-700 font-extrabold rounded-full hover:bg-teal-50 transition-colors text-lg shadow-2xl"
            >
              Essai gratuit 7 jours
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-10 py-5 border-2 border-white/40 text-white font-bold rounded-full hover:bg-white/10 transition-colors text-lg"
            >
              Voir la demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Maillage interne ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111111] mb-8 text-center">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <Link to="/blog/livraison-restaurant-rentabilite" className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group">
              <Truck className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-bold text-[#111111] mb-2 group-hover:text-teal-700 transition-colors">Rentabilite de la livraison restaurant</h3>
              <p className="text-sm text-[#737373]">Uber Eats, Deliveroo, Just Eat : comment piloter la marge sur les plateformes de livraison.</p>
            </Link>
            <Link to="/blog/reduire-food-cost" className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group">
              <Calculator className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-bold text-[#111111] mb-2 group-hover:text-teal-700 transition-colors">Reduire son food cost restaurant</h3>
              <p className="text-sm text-[#737373]">8 leviers concrets pour faire passer son food cost de 35 % a 28 %. Methode CAP, achats groupes, fiche technique.</p>
            </Link>
            <Link to="/logiciel-marge-restaurant" className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group">
              <Target className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-bold text-[#111111] mb-2 group-hover:text-teal-700 transition-colors">Logiciel de marge restaurant</h3>
              <p className="text-sm text-[#737373]">La version generaliste de RestauMargin pour tous les restaurants. Comparatif, fonctionnalites, tarifs.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#F9FAFB] border-t border-[#E5E7EB] py-12 px-4">
        <div className="max-w-6xl mx-auto text-center text-sm text-[#737373]">
          <Link to="/landing" className="flex items-center justify-center gap-2 text-[#111111] font-bold text-lg mb-4">
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mb-4">Le logiciel de marge restaurant le plus complet du marche francais, specialise dark kitchen.</p>
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

function StatCard({ value, label, trend }: { value: string; label: string; trend: 'up' | 'down' }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 text-center">
      <div className="flex items-center justify-center gap-1 mb-2">
        {trend === 'up' ? <TrendingUp className="w-4 h-4 text-emerald-600" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
      </div>
      <div className="text-3xl font-extrabold text-[#111111] mb-1">{value}</div>
      <div className="text-xs text-[#737373] leading-snug">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, variant }: { icon: React.ReactNode; title: string; desc: string; variant: 'emerald' | 'amber' | 'teal' }) {
  const styles = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
  }[variant];
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:border-teal-300 hover:shadow-md transition-all">
      <div className={`w-12 h-12 ${styles} border rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="font-bold text-[#111111] mb-2 text-lg">{title}</h3>
      <p className="text-sm text-[#737373] leading-relaxed">{desc}</p>
    </div>
  );
}

function PriceRow({ label, value, sub, negative, bold, alert, highlight }: { label: string; value: string; sub?: string; negative?: boolean; bold?: boolean; alert?: boolean; highlight?: boolean }) {
  return (
    <div className={`flex items-start justify-between gap-4 ${highlight ? 'bg-amber-50 -mx-2 px-2 py-1 rounded-md' : ''}`}>
      <div>
        <div className={`${bold ? 'font-bold text-[#111111]' : 'text-[#404040]'} text-sm`}>{label}</div>
        {sub && <div className={`text-xs ${alert ? 'text-red-600 font-semibold' : 'text-[#9CA3AF]'} mt-0.5`}>{sub}</div>}
      </div>
      <div className={`text-right font-mono text-sm shrink-0 ${alert ? 'text-red-600 font-bold' : negative ? 'text-red-500' : bold ? 'text-[#111111] font-bold' : 'text-[#111111]'}`}>{value}</div>
    </div>
  );
}

function BrandCard({ name, tagline, foodCost, avgTicket, color }: { name: string; tagline: string; foodCost: string; avgTicket: string; color: string }) {
  return (
    <div className={`${color} border rounded-2xl p-5`}>
      <div className="font-extrabold text-lg mb-1">{name}</div>
      <div className="text-xs opacity-80 mb-3">{tagline}</div>
      <div className="text-xs space-y-1 opacity-90">
        <div>Food cost : <span className="font-semibold">{foodCost}</span></div>
        <div>Ticket moyen : <span className="font-semibold">{avgTicket}</span></div>
      </div>
    </div>
  );
}

function StrategyCard({ num, title, desc, impact }: { num: string; title: string; desc: string; impact: string }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:border-teal-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl font-extrabold text-teal-600">{num}</div>
        <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">
          {impact}
        </span>
      </div>
      <h3 className="font-bold text-[#111111] text-lg mb-2">{title}</h3>
      <p className="text-sm text-[#737373] leading-relaxed">{desc}</p>
    </div>
  );
}

function ToolCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 hover:border-teal-300 transition-colors">
      <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-bold text-[#111111] mb-2">{title}</h3>
      <p className="text-sm text-[#737373] leading-relaxed">{desc}</p>
    </div>
  );
}

function CaseCard({ brand, netMargin, detail, color }: { brand: string; netMargin: string; detail: string; color: 'emerald' | 'teal' | 'amber' }) {
  const styles = {
    emerald: 'border-emerald-200 bg-emerald-50',
    teal: 'border-teal-200 bg-teal-50',
    amber: 'border-amber-200 bg-amber-50',
  }[color];
  const text = {
    emerald: 'text-emerald-700',
    teal: 'text-teal-700',
    amber: 'text-amber-700',
  }[color];
  return (
    <div className={`${styles} border rounded-xl p-4`}>
      <div className="font-bold text-[#111111] mb-1">{brand}</div>
      <div className={`text-3xl font-extrabold ${text} mb-2`}>{netMargin}</div>
      <div className="text-xs text-[#404040] leading-relaxed">{detail}</div>
    </div>
  );
}

function Callout({ type, children }: { type: 'info' | 'warning'; children: React.ReactNode }) {
  const styles = type === 'info'
    ? 'bg-blue-50 border-blue-200 text-blue-800'
    : 'bg-amber-50 border-amber-200 text-amber-800';
  const Icon = type === 'info' ? Lightbulb : AlertTriangle;
  return (
    <div className={`${styles} border rounded-xl p-5 mt-8 flex gap-3 text-sm leading-relaxed`}>
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
        <ArrowRight className="w-4 h-4 transform group-open:rotate-90 transition-transform" />
      </summary>
      <div className="px-5 pb-5 text-sm text-[#404040] leading-relaxed">{a}</div>
    </details>
  );
}
