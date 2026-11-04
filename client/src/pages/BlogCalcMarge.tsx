import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calculator, AlertTriangle, CheckCircle, ArrowRight, BarChart3, DollarSign, Percent, Target, BookOpen, Lightbulb, Users, Pizza, Beef, Zap, Award, ListChecks, Sparkles, Table as TableIcon, FileSpreadsheet, Download, ExternalLink, Landmark } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Comment calculer la marge de votre restaurant en 2026"
   Mot-clé principal : calcul marge restaurant
   ~3 200 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quel est le food cost idéal pour un restaurant ?',
    answer: "Le food cost idéal dépend de votre type de restaurant. En règle générale, il se situe entre 25 % et 35 %. Une pizzeria peut viser 22-25 %, un restaurant gastronomique acceptera 35-40 %. L'essentiel est qu'il soit cohérent avec votre structure de charges globale.",
  },
  {
    question: "Comment calculer la marge brute d'un plat ?",
    answer: "Soustrayez le coût total des ingrédients du prix de vente HT du plat. Par exemple, si un plat se vend 18 EUR et que les ingrédients coûtent 5,40 EUR, la marge brute est de 12,60 EUR, soit 70 %. Formule : Marge brute (%) = (Prix de vente - Coût matières) / Prix de vente x 100.",
  },
  {
    question: 'Quelle est la différence entre marge brute et marge nette ?',
    answer: 'La marge brute ne déduit que le coût des matières premières (food cost). La marge nette déduit en plus toutes les charges : personnel, loyer, énergie, assurances, taxes, amortissements. La marge brute en restauration tourne autour de 65-75 % tandis que la marge nette se situe entre 5 et 15 %.',
  },
  {
    question: 'À quelle fréquence faut-il recalculer ses marges ?',
    answer: "Idéalement chaque semaine pour le food cost global, et à chaque changement de prix fournisseur pour les fiches techniques individuelles. Les variations de prix sur les produits frais peuvent être rapides. Un outil comme RestauMargin automatise ce suivi en continu.",
  },
  {
    question: 'Comment calculer le coefficient multiplicateur en restauration ?',
    answer: "Le coefficient multiplicateur se calcule en divisant le prix de vente HT par le coût matières. Inversement : Coefficient = 1 / Food cost cible. Pour un food cost cible de 30 %, le coefficient est de 3,33. Multipliez votre coût matière par ce coefficient pour obtenir le prix de vente HT.",
  },
  {
    question: 'Quel est le ratio personnel idéal en restauration ?',
    answer: "Le ratio personnel (masse salariale / chiffre d'affaires) se situe idéalement entre 30 % et 40 % en restauration traditionnelle. En ajoutant le food cost (25-35 %), ces deux postes représentent le prime cost qui ne devrait pas dépasser 65-70 % du CA pour garantir une marge nette viable.",
  },
  {
    question: 'Faut-il calculer sa marge en HT ou en TTC ?',
    answer: "Toujours en HT (hors taxes). La TVA collectée ne vous appartient pas, elle est reversée à l'État. Calculer votre food cost sur un prix TTC donnerait un ratio artificiellement bas et fausserait votre analyse. En France, la TVA en restauration sur place est de 10 %.",
  },
  {
    question: 'Comment améliorer sa marge sans augmenter les prix ?',
    answer: "Plusieurs leviers : optimiser les portions avec des fiches techniques précises, négocier les fournisseurs, réduire le gaspillage (FIFO, pesée des déchets), utiliser le menu engineering pour promouvoir les plats à forte marge, substituer certains ingrédients sans sacrifier la qualité. RestauMargin identifie ces opportunités automatiquement.",
  },
];

export default function BlogCalcMarge() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Marge restaurant 2026 : taux moyen, calcul et formules"
        description="Quelle marge pour un restaurant ? Taux de marge brute moyen, marge nette, food cost : formules de calcul, exemples chiffrés et repères par type d'établissement."
        path="/blog/calcul-marge-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Calcul marge restaurant', url: 'https://www.restaumargin.fr/blog/calcul-marge-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Comment calculer la marge de votre restaurant en 5 étapes',
            description: 'Méthode pas-à-pas pour calculer la marge brute et le food cost d\'un plat de restaurant.',
            totalTime: 'PT15M',
            tool: ['Balance de cuisine', 'Calculatrice', 'Tableur ou logiciel RestauMargin'],
            step: [
              { '@type': 'HowToStep', name: 'Lister les ingrédients et grammages', text: 'Listez chaque ingrédient du plat avec sa quantité exacte en grammes. Pesez systématiquement plutôt que d\'estimer.' },
              { '@type': 'HowToStep', name: 'Calculer le coût matières total', text: 'Pour chaque ingrédient, multipliez le grammage par le prix au gramme. Additionnez pour obtenir le coût matières total.' },
              { '@type': 'HowToStep', name: 'Calculer le food cost', text: 'Divisez le coût matières par le prix de vente HT, multipliez par 100. Résultat exprimé en pourcentage.' },
              { '@type': 'HowToStep', name: 'Calculer la marge brute', text: 'Soustrayez le coût matières du prix de vente HT pour obtenir la marge brute en euros, ou utilisez la formule (PV - CM) / PV x 100 pour le pourcentage.' },
              { '@type': 'HowToStep', name: 'Comparer aux benchmarks', text: 'Comparez votre food cost à la fourchette cible de votre type de restaurant (25-35 % en moyenne) et ajustez prix ou portions si besoin.' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Marge restaurant 2026 : taux moyen, calcul et formules',
            description: 'Taux de marge moyen d\'un restaurant et guide complet du calcul : marge brute, marge nette, food cost, formules, exemples chiffrés et repères par type d\'établissement.',
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-04-14',
            dateModified: '2026-11-04',
            wordCount: 4200,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/calcul-marge-restaurant' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: 'Comment calculer la marge de votre restaurant en 5 minutes',
            description: 'Tutoriel pas à pas du calcul de marge en restauration : food cost, marge brute, coefficient multiplicateur et marge nette.',
            thumbnailUrl: 'https://www.restaumargin.fr/og-image.png',
            uploadDate: '2026-05-27',
            contentUrl: 'https://www.restaumargin.fr/video/calcul-marge-restaurant',
            publisher: { '@type': 'Organization', name: 'RestauMargin' },
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
          <span className="text-mono-100 font-medium">Calcul marge restaurant</span>
        </div>
      </div>

      {/* ── Hero / H1 — BlogArticleHero (theme cinematic Curves) ── */}
      <BlogArticleHero
        category="Marges"
        readTime="15 min"
        date="Mai 2026"
        title="Marge restaurant 2026 : taux moyen, calcul et formules"
        accentWord="Marge"
        subtitle="Quelle marge fait un restaurant, et comment la calculer ? Taux de marge moyen, formules, cas pratiques chiffrés, repères par type d'établissement et erreurs qui plombent vos bénéfices."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-14" updatedDate="2026-11-04" readTime="15 min" variant="header" />

        {/* ── Reponse directe : marge moyenne (intention dominante de la requete « marge restaurant », mesuree le 04/11) ── */}
        <section id="marge-moyenne" className="mt-10 scroll-mt-24 bg-white border border-mono-900 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 mb-4">
            Quelle est la marge moyenne d'un restaurant ?
          </h2>
          <p className="text-base text-mono-200 leading-relaxed mb-6">
            En restauration, le <strong>taux de marge brute</strong> (prix de vente HT moins le coût des matières
            premières) se situe le plus souvent <strong>entre 65 % et 75 %</strong>, soit un food cost de 25 à 35 %.
            Une fois le personnel, le loyer et les autres charges payés, la <strong>marge nette médiane</strong> d'un
            restaurant en France tombe <strong>entre 4 % et 8 %</strong> du chiffre d'affaires.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-teal-600 text-white">
                  <th className="text-left p-3 font-bold">Indicateur</th>
                  <th className="text-left p-3 font-bold">Repère en restauration</th>
                  <th className="text-left p-3 font-bold hidden sm:table-cell">Ce qu'il mesure</th>
                </tr>
              </thead>
              <tbody className="text-mono-200">
                <tr className="border-b border-mono-900">
                  <td className="p-3 font-semibold">Taux de marge brute</td>
                  <td className="p-3">65 % à 75 %</td>
                  <td className="p-3 hidden sm:table-cell">Ce qui reste du prix de vente HT après les matières premières</td>
                </tr>
                <tr className="border-b border-mono-900 bg-mono-1000/40">
                  <td className="p-3 font-semibold">Food cost</td>
                  <td className="p-3">25 % à 35 %</td>
                  <td className="p-3 hidden sm:table-cell">Part du prix de vente HT consacrée aux matières</td>
                </tr>
                <tr className="border-b border-mono-900">
                  <td className="p-3 font-semibold">Coefficient multiplicateur</td>
                  <td className="p-3">3 à 4</td>
                  <td className="p-3 hidden sm:table-cell">Prix de vente HT divisé par le coût matières</td>
                </tr>
                <tr className="bg-mono-1000/40">
                  <td className="p-3 font-semibold">Marge nette</td>
                  <td className="p-3">4 % à 8 % (médiane)</td>
                  <td className="p-3 hidden sm:table-cell">Bénéfice restant après toutes les charges</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm text-mono-400 leading-relaxed">
            Ces repères varient selon le format : une pizzeria se situe plutôt entre 72 % et 85 % de marge brute,
            un restaurant gastronomique entre 60 % et 70 % (<a href="#benchmarks" className="text-teal-700 underline hover:text-teal-800">repères par type de restaurant</a>).
            Pour savoir quelle marge nette viser et si la vôtre est bonne, lisez notre guide sur la{' '}
            <Link to="/blog/marge-beneficiaire-restaurant-ideal" className="text-teal-700 underline hover:text-teal-800">marge bénéficiaire idéale d'un restaurant</Link>.
          </p>
        </section>

        {/* ── Encadre formule rapide (featured snippet) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Formule rapide marge restaurant</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            La formule essentielle à retenir
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Food cost (%)</strong> = (Coût matières / Prix de vente HT) x 100</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Marge brute (%)</strong> = 100 - Food cost</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Coefficient multiplicateur</strong> = Prix de vente / Coût matières</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Marge nette (%)</strong> = (Résultat net / CA) x 100</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Objectif standard restauration : food cost entre 25 % et 35 %, marge brute entre 65 % et 75 %, marge nette entre 5 % et 15 %.
          </p>
        </div>

        {/* ── Tableau KPIs 2026 (bloc featured snippet table) ── */}
        <div className="mt-10 bg-white border border-mono-900 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 mb-2">
            Tableau des KPIs marge restaurant 2026 (cibles à viser)
          </h2>
          <p className="text-sm text-mono-400 mb-6">
            Repères chiffrés à jour 2026 par indicateur, avec fréquence de suivi recommandée.
            Comparez chaque ligne à vos chiffres réels pour savoir où agir en priorité.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-teal-600 text-white">
                  <th className="text-left p-3 font-bold">Indicateur</th>
                  <th className="text-left p-3 font-bold">Cible 2026</th>
                  <th className="text-left p-3 font-bold">Zone alerte</th>
                  <th className="text-left p-3 font-bold">Fréquence</th>
                </tr>
              </thead>
              <tbody className="text-mono-200">
                <tr className="border-b border-mono-900">
                  <td className="p-3 font-semibold">Food cost (% CA)</td>
                  <td className="p-3">25 % à 32 %</td>
                  <td className="p-3 text-red-600">supérieur à 35 %</td>
                  <td className="p-3">Hebdomadaire</td>
                </tr>
                <tr className="border-b border-mono-900 bg-mono-1000/40">
                  <td className="p-3 font-semibold">Marge brute</td>
                  <td className="p-3">68 % à 75 %</td>
                  <td className="p-3 text-red-600">inférieure à 65 %</td>
                  <td className="p-3">Hebdomadaire</td>
                </tr>
                <tr className="border-b border-mono-900">
                  <td className="p-3 font-semibold">Marge brute boisson</td>
                  <td className="p-3">80 % à 88 %</td>
                  <td className="p-3 text-red-600">inférieure à 78 %</td>
                  <td className="p-3">Hebdomadaire</td>
                </tr>
                <tr className="border-b border-mono-900 bg-mono-1000/40">
                  <td className="p-3 font-semibold">Coût personnel (% CA)</td>
                  <td className="p-3">30 % à 38 %</td>
                  <td className="p-3 text-red-600">supérieur à 42 %</td>
                  <td className="p-3">Mensuelle</td>
                </tr>
                <tr className="border-b border-mono-900">
                  <td className="p-3 font-semibold">Prime cost (food + personnel)</td>
                  <td className="p-3">55 % à 65 %</td>
                  <td className="p-3 text-red-600">supérieur à 70 %</td>
                  <td className="p-3">Mensuelle</td>
                </tr>
                <tr className="border-b border-mono-900 bg-mono-1000/40">
                  <td className="p-3 font-semibold">Loyer (% CA)</td>
                  <td className="p-3">6 % à 10 %</td>
                  <td className="p-3 text-red-600">supérieur à 12 %</td>
                  <td className="p-3">Trimestrielle</td>
                </tr>
                <tr className="border-b border-mono-900">
                  <td className="p-3 font-semibold">Énergie (% CA)</td>
                  <td className="p-3">3 % à 5 %</td>
                  <td className="p-3 text-red-600">supérieur à 7 %</td>
                  <td className="p-3">Mensuelle</td>
                </tr>
                <tr className="border-b border-mono-900 bg-mono-1000/40">
                  <td className="p-3 font-semibold">Ticket moyen</td>
                  <td className="p-3">Suit l'inflation</td>
                  <td className="p-3 text-red-600">Stagne 12 mois</td>
                  <td className="p-3">Mensuelle</td>
                </tr>
                <tr className="border-b border-mono-900">
                  <td className="p-3 font-semibold">Gaspillage cuisine (% achats)</td>
                  <td className="p-3">inférieur à 4 %</td>
                  <td className="p-3 text-red-600">supérieur à 8 %</td>
                  <td className="p-3">Hebdomadaire</td>
                </tr>
                <tr className="bg-mono-1000/40">
                  <td className="p-3 font-semibold">Marge nette</td>
                  <td className="p-3">8 % à 15 %</td>
                  <td className="p-3 text-red-600">inférieure à 5 %</td>
                  <td className="p-3">Mensuelle / annuelle</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-mono-500">
            Sources : INSEE 2026, Fédération nationale de l'industrie hôtelière (FNIH). Les fourchettes varient selon type d'établissement (voir benchmark détaillé section 8).
          </p>
        </div>

        {/* ═════════════ Modèle de tableau de calcul de marge (à copier) ═════════════ */}
        <section id="modele-tableau" className="mt-12 scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center shrink-0">
              <TableIcon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100">
              Modèle de tableau de calcul de marge (à copier)
            </h2>
          </div>

          <div className="prose-content mb-6">
            <p>
              Voici un <strong>modèle de tableau de calcul de marge</strong> prêt à l'emploi que vous pouvez copier
              directement dans Excel ou Google Sheets. Cette <strong>feuille de calcul food cost</strong> reproduit
              la structure d'une fiche technique : vous saisissez vos ingrédients, grammages et prix, et le tableau
              calcule automatiquement le coût matière, le food cost, la marge brute et le coefficient. C'est le
              <strong> modèle Excel marge restaurant</strong> le plus simple pour démarrer sans installer de logiciel.
            </p>
          </div>

          {/* Tableau modele reproductible */}
          <div className="bg-white border border-mono-900 rounded-2xl p-5 sm:p-7 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileSpreadsheet className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-mono-100 text-lg">Tableau de calcul de marge — exemple burger maison</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-teal-600 text-white">
                    <th className="text-left p-3 font-bold">Ingrédient</th>
                    <th className="text-right p-3 font-bold">Quantité</th>
                    <th className="text-right p-3 font-bold">Prix unitaire</th>
                    <th className="text-right p-3 font-bold">Coût</th>
                  </tr>
                </thead>
                <tbody className="text-mono-200">
                  <tr className="border-b border-mono-900">
                    <td className="p-3">Pain burger brioche</td>
                    <td className="p-3 text-right">1 pièce</td>
                    <td className="p-3 text-right">0,45 EUR/pièce</td>
                    <td className="p-3 text-right font-medium">0,45 EUR</td>
                  </tr>
                  <tr className="border-b border-mono-900 bg-mono-1000/40">
                    <td className="p-3">Steak haché 15 % MG</td>
                    <td className="p-3 text-right">150 g</td>
                    <td className="p-3 text-right">9,50 EUR/kg</td>
                    <td className="p-3 text-right font-medium">1,43 EUR</td>
                  </tr>
                  <tr className="border-b border-mono-900">
                    <td className="p-3">Cheddar affiné</td>
                    <td className="p-3 text-right">30 g</td>
                    <td className="p-3 text-right">11,00 EUR/kg</td>
                    <td className="p-3 text-right font-medium">0,33 EUR</td>
                  </tr>
                  <tr className="border-b border-mono-900 bg-mono-1000/40">
                    <td className="p-3">Salade, tomate, oignon</td>
                    <td className="p-3 text-right">60 g</td>
                    <td className="p-3 text-right">4,00 EUR/kg</td>
                    <td className="p-3 text-right font-medium">0,24 EUR</td>
                  </tr>
                  <tr className="border-b border-mono-900">
                    <td className="p-3">Sauce maison + assaisonnement</td>
                    <td className="p-3 text-right">30 g</td>
                    <td className="p-3 text-right">5,00 EUR/kg</td>
                    <td className="p-3 text-right font-medium">0,15 EUR</td>
                  </tr>
                  <tr className="border-t-2 border-mono-900 bg-amber-50">
                    <td className="p-3 font-bold text-mono-100">Coût matière total</td>
                    <td className="p-3 text-right">-</td>
                    <td className="p-3 text-right">-</td>
                    <td className="p-3 text-right font-bold text-amber-900">2,60 EUR</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Lignes de calcul automatique */}
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody className="text-mono-200">
                  <tr className="border-b border-mono-900 bg-mono-1000/60">
                    <td className="p-3 font-semibold text-mono-100">Prix de vente HT</td>
                    <td className="p-3 text-right">Saisi (ex. 11,90 EUR TTC / 1,10)</td>
                    <td className="p-3 text-right font-bold text-mono-100">10,82 EUR</td>
                  </tr>
                  <tr className="border-b border-mono-900">
                    <td className="p-3 font-semibold text-mono-100">Food cost %</td>
                    <td className="p-3 text-right text-mono-500">Coût matière / Prix vente HT x 100</td>
                    <td className="p-3 text-right font-bold text-teal-700">24,0 %</td>
                  </tr>
                  <tr className="border-b border-mono-900 bg-mono-1000/60">
                    <td className="p-3 font-semibold text-mono-100">Marge brute (EUR)</td>
                    <td className="p-3 text-right text-mono-500">Prix vente HT - Coût matière</td>
                    <td className="p-3 text-right font-bold text-emerald-700">8,22 EUR</td>
                  </tr>
                  <tr className="border-b border-mono-900">
                    <td className="p-3 font-semibold text-mono-100">Marge brute %</td>
                    <td className="p-3 text-right text-mono-500">Marge brute / Prix vente HT x 100</td>
                    <td className="p-3 text-right font-bold text-emerald-700">76,0 %</td>
                  </tr>
                  <tr className="bg-mono-1000/60">
                    <td className="p-3 font-semibold text-mono-100">Coefficient</td>
                    <td className="p-3 text-right text-mono-500">Prix vente HT / Coût matière</td>
                    <td className="p-3 text-right font-bold text-mono-100">4,16</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Formules Excel exactes */}
          <div className="mt-8 bg-mono-100 rounded-2xl p-6 sm:p-7 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-teal-300" />
              <h3 className="font-bold text-lg">Les formules Excel exactes à recopier</h3>
            </div>
            <p className="text-sm text-mono-700 mb-4">
              Supposons : colonne <strong className="text-white">B</strong> = Coût matière total (cellule B7),
              colonne <strong className="text-white">C</strong> = Prix de vente HT (cellule C7). Recopiez ces
              formules dans votre feuille de calcul food cost :
            </p>
            <div className="space-y-2.5 font-mono text-xs sm:text-sm">
              <div className="bg-black/30 rounded-lg px-4 py-2.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="text-teal-300 font-bold sm:w-40 shrink-0">Food cost %</span>
                <code className="text-mono-950">=B7/C7*100</code>
              </div>
              <div className="bg-black/30 rounded-lg px-4 py-2.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="text-teal-300 font-bold sm:w-40 shrink-0">Marge brute (EUR)</span>
                <code className="text-mono-950">=C7-B7</code>
              </div>
              <div className="bg-black/30 rounded-lg px-4 py-2.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="text-teal-300 font-bold sm:w-40 shrink-0">Marge brute %</span>
                <code className="text-mono-950">=(C7-B7)/C7*100</code>
              </div>
              <div className="bg-black/30 rounded-lg px-4 py-2.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="text-teal-300 font-bold sm:w-40 shrink-0">Coefficient</span>
                <code className="text-mono-950">=C7/B7</code>
              </div>
              <div className="bg-black/30 rounded-lg px-4 py-2.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="text-teal-300 font-bold sm:w-40 shrink-0">Prix vente HT depuis TTC</span>
                <code className="text-mono-950">=PrixTTC/1,1</code>
              </div>
              <div className="bg-black/30 rounded-lg px-4 py-2.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="text-teal-300 font-bold sm:w-40 shrink-0">Coût d'une ligne</span>
                <code className="text-mono-950">=Quantite*PrixUnitaire</code>
              </div>
            </div>
            <p className="text-xs text-mono-700 mt-4">
              Astuce : formatez les cellules de pourcentage avec le format Nombre puis ajoutez le symbole %, et
              arrondissez le prix de vente avec <code className="text-mono-950 bg-black/30 px-1.5 py-0.5 rounded">=ARRONDI(valeur;2)</code> pour rester lisible.
            </p>
          </div>

          {/* Encadre : 4 etapes Excel / Google Sheets */}
          <div className="mt-8 bg-teal-50 border border-teal-200 rounded-2xl p-6 sm:p-7">
            <div className="flex items-center gap-2 mb-4">
              <FileSpreadsheet className="w-5 h-5 text-teal-700" />
              <h3 className="font-bold text-mono-100 text-lg">Comment utiliser ce modèle dans Excel ou Google Sheets en 4 étapes</h3>
            </div>
            <ol className="space-y-3 text-sm text-mono-350">
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center shrink-0 font-bold text-xs">1</span>
                <span>Créez 4 colonnes <strong>Ingrédient</strong>, <strong>Quantité</strong>, <strong>Prix unitaire</strong>, <strong>Coût</strong>, puis recopiez la structure du tableau de calcul de marge ci-dessus, ligne par ligne.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center shrink-0 font-bold text-xs">2</span>
                <span>Dans la colonne Coût, saisissez la formule <code className="bg-white px-1.5 py-0.5 rounded text-mono-100">=Quantite*PrixUnitaire</code> sur chaque ligne, puis additionnez le tout avec <code className="bg-white px-1.5 py-0.5 rounded text-mono-100">=SOMME(...)</code> pour obtenir le coût matière total.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center shrink-0 font-bold text-xs">3</span>
                <span>Ajoutez une cellule Prix de vente HT, puis recopiez les formules food cost, marge brute et coefficient données au-dessus. Les résultats se mettent à jour automatiquement.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center shrink-0 font-bold text-xs">4</span>
                <span>Dupliquez l'onglet pour chaque plat. Dès qu'un prix fournisseur change, modifiez la cellule Prix unitaire : tout le modèle Excel marge restaurant se recalcule en cascade.</span>
              </li>
            </ol>
          </div>

          {/* CTA vers calculateur */}
          <div className="mt-8 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-center text-white shadow-lg">
            <Download className="w-8 h-8 mx-auto mb-3 text-teal-100" />
            <h3 className="text-xl sm:text-2xl font-extrabold mb-2">
              Ou utilisez notre calculateur automatique, sans Excel
            </h3>
            <p className="text-teal-100 max-w-xl mx-auto mb-6 text-sm sm:text-base">
              Pas envie de bâtir votre feuille de calcul à la main ? Notre calculateur de marge restaurant fait
              tous ces calculs pour vous : saisissez vos ingrédients et obtenez food cost, marge brute et
              coefficient en 30 secondes, sans formule à recopier.
            </p>
            <Link
              to="/outils/calculateur-marge-restaurant"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 font-bold rounded-full hover:bg-teal-50 transition-colors text-lg shadow-md"
            >
              <Calculator className="w-5 h-5" />
              Ouvrir le calculateur gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* ── Table des matieres ── */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#marge-moyenne', label: 'Quelle est la marge moyenne d\'un restaurant ?' },
              { href: '#modele-tableau', label: 'Modèle de tableau de calcul de marge (à copier)' },
              { href: '#pourquoi', label: 'Pourquoi la marge est critique pour votre restaurant' },
              { href: '#trois-marges', label: 'Les 3 types de marges à connaître' },
              { href: '#howto', label: 'Comment calculer la marge en 5 étapes' },
              { href: '#brute-vs-nette', label: 'Marge brute vs marge nette : la différence' },
              { href: '#formules', label: 'Formules de calcul avec exemples chiffrés' },
              { href: '#cas-pizza', label: 'Cas pratique chiffré : pizza margherita' },
              { href: '#cas-entrecote', label: 'Cas pratique chiffré : entrecôte grillée' },
              { href: '#benchmarks', label: 'Benchmarks marge brute par type de restaurant' },
              { href: '#comparatif-cards', label: 'Comparatif marge brute par type d\'établissement' },
              { href: '#france-vs-international', label: 'Marge restaurant France vs international' },
              { href: '#logiciel-automatique', label: 'Calcul marge automatique avec un logiciel' },
              { href: '#food-cost-tableau', label: 'Tableau du food cost par type de restaurant' },
              { href: '#erreurs', label: 'Les 5 erreurs courantes qui détruisent votre marge' },
              { href: '#automatiser', label: 'Comment RestauMargin automatise le calcul' },
              { href: '#faq', label: 'Questions fréquentes' },
              { href: '#cta', label: 'Calculez votre marge gratuitement' },
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

        {/* ═════════════ SECTION 1 : Introduction ═════════════ */}
        <section id="pourquoi" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="1">
            Pourquoi la marge est critique pour votre restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Dans la restauration, la différence entre un établissement rentable et un établissement
              qui ferme ses portes se joue souvent à quelques points de marge. Selon les chiffres de
              l'INSEE, près de 30 % des restaurants ferment dans les trois premières années. La cause
              numéro un ? Une mauvaise maîtrise des coûts et, par extension, du calcul de marge restaurant.
            </p>
            <p>
              Votre marge, c'est ce qui reste une fois que vous avez payé vos matières premières,
              votre personnel, votre loyer et toutes vos charges. C'est votre oxygène financier.
              Sans un suivi rigoureux, vous naviguez à l'aveugle — et les mauvaises surprises
              arrivent toujours au pire moment : hausse du prix du beurre, augmentation du SMIC,
              inflation sur l'énergie.
            </p>
            <p>
              En 2026, la pression est plus forte que jamais. L'inflation alimentaire a cumulé
              plus de 20 % sur trois ans. Les salaires minimums ont été revalorisés plusieurs fois.
              Les coûts énergétiques restent volatils. Dans ce contexte, maîtriser le calcul de marge
              de votre restaurant n'est plus un luxe : c'est une question de survie.
            </p>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> Un restaurant qui améliore son food cost de seulement
              2 points (par exemple de 32 % à 30 %) sur un chiffre d'affaires de 500 000 EUR gagne
              10 000 EUR de bénéfice net supplémentaire par an.
            </Callout>

            <p>
              Ce guide vous donne toutes les formules, les benchmarks et les outils pour reprendre
              le contrôle de vos marges. Que vous dirigiez un bistrot, une brasserie ou un restaurant
              gastronomique, les principes sont les mêmes — seuls les ratios cibles diffèrent.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Les 3 types de marges ═════════════ */}
        <section id="trois-marges" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="2">
            Les 3 types de marges à connaître
          </SectionHeading>

          <div className="prose-content">
            <p>
              Quand on parle de "marge" en restauration, on mélange souvent trois notions différentes.
              Chacune répond à une question précise et vous donne une vision complémentaire de votre
              rentabilité. Voici les trois indicateurs que tout restaurateur doit maîtriser.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 mt-8">
            <MargeCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Marge brute"
              color="emerald"
              desc="C'est la différence entre votre chiffre d'affaires et le coût des matières premières. Elle mesure votre capacité à transformer des ingrédients en valeur. C'est le premier indicateur à surveiller au quotidien."
              formula="CA - Coût matières"
              target="65 % à 75 %"
            />
            <MargeCard
              icon={<Percent className="w-6 h-6" />}
              title="Coût matière (Food Cost)"
              color="amber"
              desc="Le ratio entre le coût de vos ingrédients et votre prix de vente. C'est l'indicateur largement répandu dans la profession. Un food cost maîtrisé signifie des achats optimisés et des fiches techniques respectées."
              formula="Coût ingrédients / Prix de vente x 100"
              target="25 % à 35 %"
            />
            <MargeCard
              icon={<Target className="w-6 h-6" />}
              title="Marge nette"
              color="blue"
              desc="Ce qui reste réellement dans votre poche après toutes les charges : matières, personnel, loyer, énergie, assurances, impôts. C'est la mesure ultime de votre rentabilité globale."
              formula="CA - Toutes charges"
              target="5 % à 15 %"
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              La marge brute et le food cost sont les deux faces d'une même pièce : si votre food cost
              est de 30 %, votre marge brute est automatiquement de 70 %. La marge nette, elle, intègre
              tout le reste — c'est pourquoi elle est nettement plus basse.
            </p>
            <p>
              Attention à ne pas confondre ces trois indicateurs. Un restaurant peut avoir un excellent
              food cost (28 %) mais une marge nette catastrophique (2 %) si ses charges de personnel
              ou son loyer sont démesurés. Le calcul de marge restaurant doit donc toujours être
              multi-dimensionnel.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION HOWTO : 5 etapes ═════════════ */}
        <section id="howto" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="3">
            Comment calculer la marge en 5 étapes
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la méthode pas-à-pas pour calculer la marge brute et le food cost d'un plat,
              applicable à toute fiche technique. Comptez 10 à 15 minutes par recette la première fois,
              puis 2-3 minutes une fois le pli pris.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Lister tous les ingrédients et leurs grammages',
                body: "Pour chaque plat, listez chaque ingrédient avec sa quantité exacte en grammes ou en millilitres. N'oubliez pas les ingrédients de garniture, les sauces, les huiles de cuisson, les épices, les herbes. Plus la fiche est complète, plus le calcul est juste. Pesez systématiquement plutôt que d'estimer à l'oeil.",
              },
              {
                title: 'Calculer le coût matières total',
                body: "Pour chaque ligne, multipliez le grammage par le prix au gramme (ou au millilitre). Exemple : 150 g de bavette à 18 EUR/kg = 0,150 x 18 = 2,70 EUR. Additionnez tous les coûts ligne par ligne. Intégrez les rendements : un kilo de carottes brutes ne donne que 800 g de carottes épluchées.",
              },
              {
                title: 'Déterminer le prix de vente HT',
                body: "Le prix de vente HT s'obtient en retirant la TVA du prix affiché TTC. En France : Prix HT = Prix TTC / 1,10 pour la restauration sur place. Calculez toujours votre marge en HT, jamais en TTC, sinon vous biaisez le ratio.",
              },
              {
                title: 'Calculer le food cost et la marge brute',
                body: "Food cost (%) = (Coût matières / Prix de vente HT) x 100. Marge brute (%) = 100 - Food cost. Marge brute (EUR) = Prix de vente HT - Coût matières. Comparez votre ratio à la fourchette cible de votre type d'établissement.",
              },
              {
                title: 'Comparer, ajuster, répéter',
                body: "Comparez votre food cost aux benchmarks (tableau plus bas). Si vous êtes au-dessus de la cible, plusieurs leviers : réduire les portions, négocier avec les fournisseurs, substituer un ingrédient, ajuster le prix de vente. Refaites le calcul à chaque changement de prix fournisseur.",
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
            <strong>Astuce gain de temps :</strong> au lieu de refaire ce calcul à la main pour chaque plat,
            utilisez le <Link to="/outils/calculateur-food-cost" className="underline font-semibold hover:text-teal-700">calculateur de food cost gratuit RestauMargin</Link>.
            Vous saisissez ingrédients, grammages et prix : le food cost et la marge brute s'affichent instantanément.
          </Callout>
        </section>

        {/* ═════════════ SECTION : Marge brute vs marge nette ═════════════ */}
        <section id="brute-vs-nette" className="mb-16">
          <SectionHeading icon={<Award className="w-6 h-6" />} number="4">
            Marge brute vs marge nette : la différence
          </SectionHeading>

          <div className="prose-content">
            <p>
              C'est la confusion la plus fréquente chez les restaurateurs débutants. Et c'est aussi
              celle qui coûte le plus cher. Imaginez un restaurant avec un excellent food cost à 28 % :
              la marge brute est de 72 %. Le propriétaire pense gagner 72 cents sur chaque euro vendu.
              En réalité, sa marge nette est peut-être de 4 %. Voici pourquoi.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Marge brute</h3>
              </div>
              <p className="text-sm text-emerald-800 leading-relaxed mb-4">
                <strong>Formule :</strong> CA - Coût matières premières
              </p>
              <p className="text-sm text-emerald-800 leading-relaxed mb-4">
                <strong>Ce qu'elle mesure :</strong> votre capacité à transformer des ingrédients en valeur. Elle ignore toutes les autres charges.
              </p>
              <p className="text-sm text-emerald-800 leading-relaxed">
                <strong>Cible restauration :</strong> 65 % à 75 % du CA HT.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-blue-900">Marge nette</h3>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed mb-4">
                <strong>Formule :</strong> Résultat net / CA HT x 100
              </p>
              <p className="text-sm text-blue-800 leading-relaxed mb-4">
                <strong>Ce qu'elle mesure :</strong> ce qui reste après TOUTES les charges (personnel, loyer, énergie, taxes, amortissements, frais financiers).
              </p>
              <p className="text-sm text-blue-800 leading-relaxed">
                <strong>Cible restauration :</strong> 5 % à 15 % du CA HT.
              </p>
            </div>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Exemple concret de passage marge brute -- marge nette</h3>
            <p>
              Prenons un bistrot avec 600 000 EUR de CA HT et un food cost à 30 %. Voici la répartition typique :
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Poste</th>
                  <th className="text-right py-3 px-4 font-semibold">Montant</th>
                  <th className="text-right py-3 px-4 font-semibold">% du CA</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Cumul</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Chiffre d'affaires HT</td><td className="py-3 px-4 text-right">600 000 EUR</td><td className="py-3 px-4 text-right">100 %</td><td className="py-3 px-4 text-right">100 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Coût matières</td><td className="py-3 px-4 text-right text-red-700">-180 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-30 %</td><td className="py-3 px-4 text-right">70 %</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-4 font-bold text-emerald-900">= Marge brute</td><td className="py-3 px-4 text-right font-bold text-emerald-900">420 000 EUR</td><td className="py-3 px-4 text-right font-bold text-emerald-900">70 %</td><td className="py-3 px-4 text-right">70 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-red-700">- Personnel (charges incluses)</td><td className="py-3 px-4 text-right text-red-700">-210 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-35 %</td><td className="py-3 px-4 text-right">35 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Loyer + charges locatives</td><td className="py-3 px-4 text-right text-red-700">-60 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-10 %</td><td className="py-3 px-4 text-right">25 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-red-700">- Énergie + fluides</td><td className="py-3 px-4 text-right text-red-700">-30 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-5 %</td><td className="py-3 px-4 text-right">20 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Marketing + assurances + divers</td><td className="py-3 px-4 text-right text-red-700">-48 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-8 %</td><td className="py-3 px-4 text-right">12 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-red-700">- Amortissements + frais financiers</td><td className="py-3 px-4 text-right text-red-700">-24 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-4 %</td><td className="py-3 px-4 text-right">8 %</td></tr>
                <tr className="bg-blue-50"><td className="py-3 px-4 font-bold text-blue-900">= Marge nette</td><td className="py-3 px-4 text-right font-bold text-blue-900">48 000 EUR</td><td className="py-3 px-4 text-right font-bold text-blue-900">8 %</td><td className="py-3 px-4 text-right">8 %</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Vous voyez la différence ? La marge brute est de 70 % (420 000 EUR), la marge nette
              n'est que de 8 % (48 000 EUR). Si vous prenez vos décisions de gestion uniquement sur
              la marge brute, vous risquez de surestimer votre rentabilité réelle d'un facteur 9.
            </p>
            <p>
              <strong>Règle d'or :</strong> pilotez vos prix au quotidien sur le food cost et la marge brute,
              mais validez votre stratégie globale (loyer, recrutement, investissement) sur la marge nette.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Formules de calcul ═════════════ */}
        <section id="formules" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="5">
            Formules de calcul avec exemples chiffrés
          </SectionHeading>

          <div className="prose-content">
            <p>
              Passons à la pratique. Voici les formules essentielles pour maîtriser le calcul de marge
              de votre restaurant, illustrées avec un exemple concret.
            </p>
          </div>

          {/* Exemple concret */}
          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Exemple : Entrecôte grillée</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-mono-350 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full" />
                Prix de vente HT : <strong className="text-mono-100">24,00 EUR</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full" />
                Coût matières premières : <strong className="text-mono-100">7,20 EUR</strong>
              </div>
            </div>

            <div className="space-y-6">
              <FormulaBlock
                label="Food Cost (%)"
                formula="(Coût matières / Prix de vente) x 100"
                calcul="(7,20 / 24,00) x 100"
                resultat="30 %"
                verdict="Objectif atteint"
                color="emerald"
              />
              <FormulaBlock
                label="Marge brute (EUR)"
                formula="Prix de vente - Coût matières"
                calcul="24,00 - 7,20"
                resultat="16,80 EUR"
                verdict="Bonne marge unitaire"
                color="emerald"
              />
              <FormulaBlock
                label="Marge brute (%)"
                formula="(Marge brute / Prix de vente) x 100"
                calcul="(16,80 / 24,00) x 100"
                resultat="70 %"
                verdict="Excellent ratio"
                color="emerald"
              />
              <FormulaBlock
                label="Coefficient multiplicateur"
                formula="Prix de vente / Coût matières"
                calcul="24,00 / 7,20"
                resultat="3,33"
                verdict="Standard restauration"
                color="amber"
              />
            </div>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">
              La méthode du coefficient multiplicateur
            </h3>
            <p>
              Le coefficient multiplicateur est un raccourci très utilisé en restauration.
              Il permet de fixer rapidement un prix de vente à partir du coût matière.
              Le principe est simple : vous multipliez le coût de vos ingrédients par un coefficient
              (généralement entre 3 et 4) pour obtenir votre prix de vente HT.
            </p>
            <p>
              <strong>Formule :</strong> Prix de vente HT = Coût matières x Coefficient multiplicateur
            </p>
            <p>
              Un coefficient de 3,0 correspond à un food cost de 33 %. Un coefficient de 4,0 correspond
              à un food cost de 25 %. Plus le coefficient est élevé, plus votre marge est confortable —
              mais attention à ne pas déconnecter vos prix du marché et des attentes clients. Pour
              approfondir, lisez notre <Link to="/blog/coefficient-multiplicateur" className="text-teal-700 underline hover:text-teal-800">guide complet du coefficient multiplicateur</Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION : Cas pratique pizza ═════════════ */}
        <section id="cas-pizza" className="mb-16">
          <SectionHeading icon={<Pizza className="w-6 h-6" />} number="6">
            Cas pratique chiffré : pizza margherita
          </SectionHeading>

          <div className="prose-content">
            <p>
              Calculons la marge sur une pizza margherita classique vendue 11 EUR TTC dans une pizzeria
              parisienne. La TVA restauration sur place est de 10 %, donc le prix HT est de 10 EUR.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Décomposition du coût matières</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Ingrédient</th>
                  <th className="text-right py-2 px-3 font-semibold">Quantité</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix au kg/L</th>
                  <th className="text-right py-2 px-3 font-semibold">Coût</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr><td className="py-2 px-3">Pâte (farine, eau, levure, sel, huile)</td><td className="py-2 px-3 text-right">230 g</td><td className="py-2 px-3 text-right">1,20 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,28 EUR</td></tr>
                <tr><td className="py-2 px-3">Sauce tomate</td><td className="py-2 px-3 text-right">80 g</td><td className="py-2 px-3 text-right">3,50 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,28 EUR</td></tr>
                <tr><td className="py-2 px-3">Mozzarella fior di latte</td><td className="py-2 px-3 text-right">100 g</td><td className="py-2 px-3 text-right">8,80 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,88 EUR</td></tr>
                <tr><td className="py-2 px-3">Basilic frais</td><td className="py-2 px-3 text-right">3 feuilles</td><td className="py-2 px-3 text-right">25 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,05 EUR</td></tr>
                <tr><td className="py-2 px-3">Huile d'olive vierge</td><td className="py-2 px-3 text-right">5 ml</td><td className="py-2 px-3 text-right">7 EUR/L</td><td className="py-2 px-3 text-right font-medium">0,04 EUR</td></tr>
                <tr><td className="py-2 px-3">Sel + origan + assaisonnement</td><td className="py-2 px-3 text-right">~</td><td className="py-2 px-3 text-right">~</td><td className="py-2 px-3 text-right font-medium">0,05 EUR</td></tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50"><td className="py-3 px-3 font-bold text-mono-100">Total coût matières</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-amber-900">1,58 EUR</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p><strong>Calculs :</strong></p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350">
              <li>Food cost = 1,58 / 10,00 x 100 = <strong>15,8 %</strong></li>
              <li>Marge brute (EUR) = 10,00 - 1,58 = <strong>8,42 EUR</strong></li>
              <li>Marge brute (%) = 8,42 / 10,00 x 100 = <strong>84,2 %</strong></li>
              <li>Coefficient multiplicateur = 10,00 / 1,58 = <strong>6,33</strong></li>
            </ul>
            <p className="mt-4">
              Avec un food cost de 15,8 % et une marge brute de 84,2 %, cette pizza est extrêmement rentable.
              C'est typique de la pizzeria : les ingrédients de base (farine, tomate, mozzarella) coûtent peu
              et le client est habitué à un certain prix. Le défi réel d'une pizzeria n'est pas le food cost
              mais la productivité (nombre de pizzas à l'heure) et le prime cost combiné personnel + matières.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION : Cas pratique entrecote ═════════════ */}
        <section id="cas-entrecote" className="mb-16">
          <SectionHeading icon={<Beef className="w-6 h-6" />} number="7">
            Cas pratique chiffré : entrecôte grillée
          </SectionHeading>

          <div className="prose-content">
            <p>
              Maintenant l'entrecôte grillée servie dans une brasserie à 28 EUR TTC, soit environ 25,45 EUR HT.
              Cas opposé à la pizza : un produit nobre, cher au kilo, avec une marge plus serrée.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Décomposition du coût matières</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Ingrédient</th>
                  <th className="text-right py-2 px-3 font-semibold">Quantité</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix au kg/L</th>
                  <th className="text-right py-2 px-3 font-semibold">Coût</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr><td className="py-2 px-3">Entrecôte bovin charolais (parage 92 %)</td><td className="py-2 px-3 text-right">220 g</td><td className="py-2 px-3 text-right">28 EUR/kg</td><td className="py-2 px-3 text-right font-medium">6,70 EUR</td></tr>
                <tr><td className="py-2 px-3">Frites maison</td><td className="py-2 px-3 text-right">200 g</td><td className="py-2 px-3 text-right">2,80 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,56 EUR</td></tr>
                <tr><td className="py-2 px-3">Beurre de cuisson</td><td className="py-2 px-3 text-right">15 g</td><td className="py-2 px-3 text-right">8 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,12 EUR</td></tr>
                <tr><td className="py-2 px-3">Sauce au poivre (crème + cognac + poivre)</td><td className="py-2 px-3 text-right">60 g</td><td className="py-2 px-3 text-right">~6 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,36 EUR</td></tr>
                <tr><td className="py-2 px-3">Salade verte + tomate cerise</td><td className="py-2 px-3 text-right">50 g</td><td className="py-2 px-3 text-right">5 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,25 EUR</td></tr>
                <tr><td className="py-2 px-3">Sel, poivre, fleur de sel</td><td className="py-2 px-3 text-right">~</td><td className="py-2 px-3 text-right">~</td><td className="py-2 px-3 text-right font-medium">0,06 EUR</td></tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50"><td className="py-3 px-3 font-bold text-mono-100">Total coût matières</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-amber-900">8,05 EUR</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p><strong>Calculs :</strong></p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350">
              <li>Food cost = 8,05 / 25,45 x 100 = <strong>31,6 %</strong></li>
              <li>Marge brute (EUR) = 25,45 - 8,05 = <strong>17,40 EUR</strong></li>
              <li>Marge brute (%) = 17,40 / 25,45 x 100 = <strong>68,4 %</strong></li>
              <li>Coefficient multiplicateur = 25,45 / 8,05 = <strong>3,16</strong></li>
            </ul>
            <p className="mt-4">
              Food cost de 31,6 %, marge brute de 68,4 % : conforme aux benchmarks brasserie (28-33 % de food cost).
              La marge brute en valeur absolue (17,40 EUR) est supérieure à celle de la pizza (8,42 EUR), mais
              le coefficient multiplicateur est presque deux fois plus faible. Conclusion : ne jugez jamais
              la rentabilité d'un plat sur un seul indicateur. Un plat haut de gamme avec coefficient bas peut
              être très rentable en valeur absolue.
            </p>
          </div>

          <Callout type="info">
            <strong>Comparaison pizza vs entrecôte :</strong> la pizza a un meilleur ratio (84 % de marge brute)
            mais ne rapporte que 8,42 EUR par vente. L'entrecôte rapporte 17,40 EUR par vente. Si vous vendez
            50 pizzas et 30 entrecôtes par jour, marge brute pizza = 421 EUR, marge brute entrecôte = 522 EUR.
            Le menu engineering vous aide à piloter ce mix correctement.
          </Callout>
        </section>

        {/* ═════════════ SECTION : Benchmarks par type ═════════════ */}
        <section id="benchmarks" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="8">
            Benchmarks marge brute par type de restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici les ratios de marge brute couramment observés en France sur 6 types d'établissement.
              Ce sont des ordres de grandeur de la profession, à comparer à vos propres chiffres : ils
              servent de repère, pas de norme.
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            {[
              { type: 'Pizzeria', mb: '72 - 85 %', fc: '15 - 28 %', notes: 'Marge la plus forte. Ingrédients peu coûteux, ticket moyen 12-18 EUR.' },
              { type: 'Brasserie', mb: '67 - 72 %', fc: '28 - 33 %', notes: 'Standard de la profession. Carte large, food cost moyen, volume important.' },
              { type: 'Restaurant gastronomique', mb: '60 - 70 %', fc: '30 - 40 %', notes: 'Produits premium (truffe, foie gras, poisson noble). Marge nette fragile.' },
              { type: 'Food truck', mb: '70 - 78 %', fc: '22 - 30 %', notes: 'Faibles charges fixes mais volume contraint par la mobilité et les emplacements.' },
              { type: 'Coffee shop', mb: '78 - 88 %', fc: '12 - 22 %', notes: 'Boisson + snacking. Marge très élevée mais ticket moyen bas (4-8 EUR).' },
              { type: 'Bistrot', mb: '65 - 72 %', fc: '28 - 35 %', notes: 'Cuisine traditionnelle. Carte courte, ticket moyen 18-30 EUR.' },
            ].map((b, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-5 hover:border-teal-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-mono-100">{b.type}</h3>
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold">{b.mb}</span>
                </div>
                <div className="text-xs text-mono-500 mb-2"><strong>Food cost cible :</strong> {b.fc}</div>
                <p className="text-sm text-mono-400 leading-relaxed">{b.notes}</p>
              </div>
            ))}
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Interprétation :</strong> ces fourchettes ne sont pas des vérités absolues. Un restaurant
              gastronomique parisien avec un excellent menu engineering peut dépasser 75 % de marge brute. Une
              brasserie en zone touristique peut tomber à 60 % si elle ne maîtrise pas ses approvisionnements.
              L'objectif n'est pas d'être dans la moyenne mais d'être dans le top tier de votre catégorie.
            </p>
            <p>
              Selon votre type d'établissement, des guides spécialisés complètent cette analyse :
              {' '}<Link to="/logiciel-marge-bistrot" className="text-teal-700 underline hover:text-teal-800">logiciel marge bistrot</Link>,
              {' '}<Link to="/logiciel-marge-pizzeria" className="text-teal-700 underline hover:text-teal-800">logiciel marge pizzeria</Link>,
              {' '}<Link to="/logiciel-marge-boulangerie" className="text-teal-700 underline hover:text-teal-800">logiciel marge boulangerie</Link>,
              {' '}<Link to="/logiciel-marge-gastronomique" className="text-teal-700 underline hover:text-teal-800">logiciel marge gastronomique</Link>,
              {' '}<Link to="/logiciel-marge-burger" className="text-teal-700 underline hover:text-teal-800">logiciel marge burger</Link>.
              Chaque format a ses propres ratios cibles et leviers d'optimisation.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION : Comparatif cards par type ═════════════ */}
        <section id="comparatif-cards" className="mb-16">
          <SectionHeading icon={<Users className="w-6 h-6" />} number="9">
            Comparatif marge brute par type d'établissement
          </SectionHeading>

          <div className="prose-content">
            <p>
              Vue d'ensemble visuelle des marges brutes cibles par format de restauration. Utilisez ces repères
              pour situer votre établissement et identifier rapidement votre potentiel d'amélioration.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { type: 'Bistrot', mb: 70, color: 'bg-teal-600' },
              { type: 'Brasserie', mb: 73, color: 'bg-teal-700' },
              { type: 'Gastronomique', mb: 65, color: 'bg-amber-600' },
              { type: 'Pizzeria', mb: 75, color: 'bg-emerald-600' },
              { type: 'Fast-food', mb: 68, color: 'bg-teal-600' },
              { type: 'Burger', mb: 70, color: 'bg-teal-700' },
              { type: 'Sushi', mb: 65, color: 'bg-amber-600' },
              { type: 'Food truck', mb: 70, color: 'bg-emerald-600' },
            ].map((c, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-5 text-center hover:border-teal-300 transition-colors">
                <div className={`w-14 h-14 ${c.color} text-white rounded-full mx-auto flex items-center justify-center font-extrabold text-lg shadow-md mb-3`}>
                  {c.mb}%
                </div>
                <h3 className="font-bold text-mono-100 text-sm sm:text-base">{c.type}</h3>
                <p className="text-xs text-mono-500 mt-1">Marge brute médiane</p>
              </div>
            ))}
          </div>

          <div className="prose-content mt-8">
            <p>
              Les ratios affichés sont des médianes sectorielles 2026. Un <strong>sushi</strong> à 65 % paraît
              faible mais s'explique par le coût du poisson frais (saumon, thon) et du riz japonais importé.
              Une <strong>pizzeria</strong> à 75 % bénéficie d'ingrédients peu chers (farine, tomate, mozzarella)
              et de prix de vente élevés grâce au positionnement perpu.
            </p>
            <p>
              Si vous êtes en-dessous de la médiane, le diagnostic doit être rapide : fiches techniques, pertes,
              prix fournisseurs, mix menu. Si vous êtes au-dessus, vérifiez que votre positionnement prix ne
              décroche pas par rapport au marché local. Notre {' '}
              <Link to="/comparatif-logiciels-restaurant" className="text-teal-700 underline hover:text-teal-800">comparatif logiciels restaurant</Link>
              {' '}vous aide à choisir l'outil adapté à votre format.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION : France vs international ═════════════ */}
        <section id="france-vs-international" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="10">
            Marge restaurant France vs international
          </SectionHeading>

          <div className="prose-content">
            <p>
              La marge restaurant en France est structurellement plus faible que dans d'autres pays. La raison
              tient à deux poids macroéconomiques majeurs : la TVA et le coût du travail. Comprendre ces
              spécificités est essentiel avant de comparer ses ratios à ceux d'enseignes anglo-saxonnes.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">TVA et taxes de vente</h3>
            <p>
              En France, la <strong>TVA restauration sur place est de 10 %</strong>, mais elle grimpe à 20 %
              sur les boissons alcoolisées. À New York, la sales tax est de 8,875 %. Au Royaume-Uni, la VAT
              standard est de 20 % (avec un taux réduit à 5 % en période de crise). En Espagne, la TVA
              restauration est de 10 %, et en Italie de 10 % également. La France se situe donc dans la
              moyenne basse, mais combinée aux autres charges, l'avantage est marginal.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Charges sociales et coût du travail</h3>
            <p>
              C'est ici que la France décroche. Le coût total du travail en restauration française représente
              <strong> 35 à 45 % du chiffre d'affaires</strong> (salaire brut + charges patronales d'environ 42 %).
              Aux États-Unis, ce ratio descend à 25-30 % grâce à un SMIC fédéral à 7,25 $/h (souvent complété
              par les tips, pourboires). Au Royaume-Uni, le ratio est autour de 28-32 %. Résultat : sur un
              même chiffre d'affaires, un restaurant français conserve 10-15 points de moins en marge brute
              après personnel par rapport à son équivalent américain.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Marge nette comparée</h3>
            <p>
              Cette pression explique pourquoi la <strong>marge nette médiane en restauration française se
              situe entre 4 et 8 %</strong>, alors qu'aux États-Unis elle atteint 10-15 % dans des conditions
              équivalentes. Un restaurateur français doit donc compenser par une productivité plus élevée,
              un menu engineering plus rigoureux et un contrôle des achats plus serré. C'est exactement la
              philosophie de RestauMargin : transformer chaque point de marge gagné en oxygène financier
              durable. Pour les enseignes qui hésitent entre solutions, consultez notre {' '}
              <Link to="/alternative-zenchef" className="text-teal-700 underline hover:text-teal-800">comparatif vs Zenchef</Link>.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Spécificités réglementaires françaises</h3>
            <p>
              La France impose aussi des contraintes additionnelles : convention collective HCR, congés payés
              majorée restauration, prime d'ancienneté, contributions formation, taxes spécifiques (CVAE,
              CET, taxe sur les salaires). Ces postes représentent 2 à 4 points supplémentaires de charges
              qui n'existent pas à l'identique à l'étranger. C'est pourquoi un food cost à 30 % en France
              n'a pas la même signification économique qu'un food cost à 30 % aux USA.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION : Logiciel automatique ═════════════ */}
        <section id="logiciel-automatique" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="11">
            Calcul marge automatique avec un logiciel
          </SectionHeading>

          <div className="prose-content">
            <p>
              Calculer manuellement chaque fiche technique sur tableur est faisable pour 10 ou 15 plats.
              Au-delà, c'est chronophage et source d'erreurs. Un <strong>logiciel de calcul de marge restaurant</strong>
              comme RestauMargin automatise l'intégralité du flux : saisie des ingrédients, mise à jour des
              prix fournisseurs, calcul instantané du food cost, marge brute et coefficient multiplicateur,
              alertes en cas de dérive.
            </p>
            <p>
              Concrètement, un tel outil vous fait gagner du temps sur la gestion administrative et
              détecte automatiquement les hausses de prix fournisseurs. Les fiches techniques sont synchronisées
              avec les factures (OCR), ce qui élimine la double saisie. Pour comprendre comment choisir,
              consultez notre {' '}
              <Link to="/comparatif-logiciels-restaurant" className="text-teal-700 underline hover:text-teal-800">comparatif logiciels restaurant</Link>
              {' '}ou notre {' '}
              <Link to="/alternative-zenchef" className="text-teal-700 underline hover:text-teal-800">alternative Zenchef</Link>.
            </p>
          </div>

          <div className="mt-8 bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-6 sm:p-8 text-center">
            <h3 className="text-xl sm:text-2xl font-extrabold text-mono-100 mb-3">
              Essayez RestauMargin gratuitement 7 jours
            </h3>
            <p className="text-mono-400 mb-6 max-w-xl mx-auto">
              Importez vos fiches techniques, connectez vos fournisseurs et voyez votre marge en temps réel.
              Sans engagement, sans carte bancaire.
            </p>
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full transition-colors text-lg shadow-lg"
            >
              Démarrer l'essai gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* ═════════════ SECTION 12 : Tableau food cost ═════════════ */}
        <section id="food-cost-tableau" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="12">
            Tableau du food cost par type de restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Tableau complet des benchmarks pour le calcul de marge restaurant en France, 2026.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Type de restaurant</th>
                  <th className="text-center py-3 px-4 font-semibold">Food Cost cible</th>
                  <th className="text-center py-3 px-4 font-semibold">Marge brute cible</th>
                  <th className="text-center py-3 px-4 font-semibold">Coefficient</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Marge nette</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { type: 'Restauration rapide / Fast-food', fc: '25 - 30 %', mb: '70 - 75 %', coef: '3,3 - 4,0', mn: '8 - 15 %' },
                  { type: 'Bistrot / Brasserie', fc: '28 - 33 %', mb: '67 - 72 %', coef: '3,0 - 3,6', mn: '5 - 12 %' },
                  { type: 'Restaurant traditionnel', fc: '30 - 35 %', mb: '65 - 70 %', coef: '2,9 - 3,3', mn: '5 - 10 %' },
                  { type: 'Pizzeria / Crêperie', fc: '15 - 28 %', mb: '72 - 85 %', coef: '3,6 - 6,5', mn: '10 - 18 %' },
                  { type: 'Coffee shop', fc: '12 - 22 %', mb: '78 - 88 %', coef: '4,5 - 8,0', mn: '8 - 16 %' },
                  { type: 'Restaurant gastronomique', fc: '30 - 40 %', mb: '60 - 70 %', coef: '2,5 - 3,3', mn: '3 - 10 %' },
                  { type: 'Food truck', fc: '22 - 30 %', mb: '70 - 78 %', coef: '3,3 - 4,5', mn: '8 - 18 %' },
                  { type: 'Dark kitchen / Livraison', fc: '28 - 35 %', mb: '65 - 72 %', coef: '2,9 - 3,6', mn: '5 - 12 %' },
                  { type: 'Traiteur / Banquet', fc: '30 - 38 %', mb: '62 - 70 %', coef: '2,6 - 3,3', mn: '8 - 15 %' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.type}</td>
                    <td className="py-3 px-4 text-center">{row.fc}</td>
                    <td className="py-3 px-4 text-center">{row.mb}</td>
                    <td className="py-3 px-4 text-center">{row.coef}</td>
                    <td className="py-3 px-4 text-center">{row.mn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Quelques observations clés :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Pizzerias et coffee shops</strong> ont les meilleurs ratios mais des tickets
                moyens bas. Le défi est le volume.
              </li>
              <li>
                <strong>Le gastronomique</strong> a un food cost plus élevé (produits premium) mais
                compensé par des prix de vente élevés. Marge nette fragile (charges personnel à 40-50 %).
              </li>
              <li>
                <strong>Les dark kitchens</strong> économisent sur le loyer et le service mais cèdent
                25-35 % de commission aux plateformes (Uber Eats, Deliveroo). Marge nette comprimée.
              </li>
              <li>
                <strong>Le traiteur</strong> bénéficie d'économies d'échelle mais doit absorber des
                coûts logistiques (transport, matériel, personnel extra).
              </li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 13 : Erreurs courantes ═════════════ */}
        <section id="erreurs" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="13">
            Les 5 erreurs courantes qui détruisent votre marge
          </SectionHeading>

          <div className="space-y-6 mt-8">
            <ErreurCard
              number={1}
              title="Ne pas peser les ingrédients"
              desc="C'est l'erreur la plus répandue et la plus coûteuse. Sans pesée systématique, vos portions varient d'un service à l'autre. Un cuisinier généreux peut facilement ajouter 20 % de matière première en trop sur chaque assiette. Sur un mois, cela représente des milliers d'euros de marge envolée. La solution : des fiches techniques avec des grammages précis et une balance dans chaque poste de travail."
            />
            <ErreurCard
              number={2}
              title="Ignorer les pertes et le gaspillage"
              desc="Épluchures, parures, invendus, casse, vol — ces pertes invisibles peuvent représenter 5 à 10 % de vos achats. Si vous n'intégrez pas ces pertes dans votre calcul de marge restaurant, vous sous-estimez systématiquement votre food cost réel. Chaque ingrédient a un rendement (un kilo de carottes brutes ne donne que 800 g de carottes épluchées). Intégrer ces rendements dans vos fiches techniques est indispensable."
            />
            <ErreurCard
              number={3}
              title="Ne pas mettre à jour les prix fournisseurs"
              desc="Les prix des matières premières changent chaque semaine, parfois chaque jour pour les produits frais. Si votre fiche technique indique un prix de beurre à 4 EUR/kg alors qu'il est passé à 6 EUR/kg, votre calcul de marge est faux de 50 % sur cet ingrédient. Idéalement, votre outil de gestion doit être connecté à vos factures fournisseurs pour mettre à jour les prix en temps réel."
            />
            <ErreurCard
              number={4}
              title="Confondre marge brute et marge nette"
              desc="Un food cost de 28 % ne signifie pas que vous gagnez 72 centimes sur chaque euro. Il vous reste encore à payer le personnel (30 à 45 % du CA), le loyer (8 à 12 %), l'énergie (3 à 6 %), les assurances, les taxes et les frais divers. Beaucoup de restaurateurs fixent leurs prix uniquement sur le food cost et découvrent trop tard que leur marge nette est quasi nulle."
            />
            <ErreurCard
              number={5}
              title="Ne pas analyser la rentabilité plat par plat"
              desc="Tous vos plats ne se valent pas. Certains ont une marge de 80 %, d'autres de 50 %. Si vous ne faites pas le menu engineering (analyse croisée popularité / rentabilité), vous risquez de promouvoir vos plats les moins rentables. Une carte bien construite met en avant les plats à forte marge et accompagne stratégiquement les plats d'appel à faible marge."
            />
          </div>

          <Callout type="warning">
            <strong>Impact cumulé :</strong> ces cinq erreurs combinées peuvent représenter
            une perte de 8 à 15 points de marge brute. Sur un restaurant qui fait 600 000 EUR
            de CA annuel, c'est entre 48 000 EUR et 90 000 EUR de bénéfice potentiel qui disparaît.
          </Callout>

          <div className="prose-content mt-6">
            <p>
              Pour aller plus loin sur la réduction de food cost, lisez notre article dédié :
              <Link to="/blog/reduire-food-cost" className="text-teal-700 underline hover:text-teal-800 ml-1">
                10 stratégies pour réduire le food cost
              </Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 14 : RestauMargin automatise ═════════════ */}
        <section id="automatiser" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="14">
            Comment RestauMargin automatise le calcul de marge
          </SectionHeading>

          <div className="prose-content">
            <p>
              Faire tous ces calculs à la main, sur un tableur Excel, c'est possible — mais
              extrêmement chronophage et source d'erreurs. C'est exactement pour cela que
              RestauMargin a été conçu : automatiser le calcul de marge restaurant de bout en bout.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              {
                icon: <Calculator className="w-5 h-5" />,
                title: 'Fiches techniques automatiques',
                desc: 'Créez vos recettes avec les grammages exacts. Le food cost se calcule automatiquement à partir des prix fournisseurs en temps réel.'
              },
              {
                icon: <TrendingUp className="w-5 h-5" />,
                title: 'Suivi de marge en temps réel',
                desc: 'Visualisez votre marge brute, votre food cost et votre marge nette au jour le jour, par plat, par catégorie ou sur l\'ensemble du menu.'
              },
              {
                icon: <BarChart3 className="w-5 h-5" />,
                title: 'Menu Engineering intégré',
                desc: 'Identifiez vos stars, chevaux de labour, énigmes et poids morts. Optimisez votre carte pour maximiser la marge globale.'
              },
              {
                icon: <AlertTriangle className="w-5 h-5" />,
                title: 'Alertes de déviation',
                desc: 'Recevez une alerte quand un prix fournisseur augmente et impacte votre marge au-delà du seuil que vous avez défini.'
              },
              {
                icon: <DollarSign className="w-5 h-5" />,
                title: 'Scan de factures (OCR)',
                desc: 'Photographiez vos factures fournisseurs : les prix sont extraits automatiquement et vos fiches techniques sont mises à jour.'
              },
              {
                icon: <Target className="w-5 h-5" />,
                title: 'Simulateur de prix',
                desc: 'Testez l\'impact d\'un changement de prix ou de fournisseur sur votre marge avant de prendre la décision.'
              },
            ].map((feat, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-3">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-mono-100 mb-1.5">{feat.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          <div className="prose-content mt-8">
            <p>
              L'objectif de RestauMargin est de vous faire passer du calcul manuel (tableur,
              calculette, estimations approximatives) à un système automatisé, précis et en temps
              réel. Vous gagnez du temps, vous gagnez en précision, et surtout vous gagnez
              en marge.
            </p>
            <p>
              RestauMargin est un outil récent : il vous aide à mieux maîtriser vos portions, vos
              achats et la construction de votre menu, trois leviers qui pèsent directement sur la
              marge brute. Découvrez nos
              <Link to="/pricing" className="text-teal-700 underline hover:text-teal-800 ml-1">tarifs RestauMargin</Link>
              ou commencez tout de suite avec le
              <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline hover:text-teal-800 ml-1">calculateur de food cost gratuit</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-04-14" updatedDate="2026-11-04" readTime="15 min" variant="footer" />

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
              Automatiser ce calcul avec RestauMargin
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Stop au tableur. RestauMargin calcule votre food cost, votre marge brute et votre
              coefficient en temps réel, sur tous vos plats, automatiquement.
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
          <h2 className="text-2xl font-bold text-mono-100 mb-6">À lire aussi</h2>
          <p className="text-sm text-mono-500 mb-6">
            Ressources complémentaires pour approfondir le calcul de marge et choisir le bon outil selon votre type d'établissement.
          </p>

          <h3 className="text-lg font-bold text-mono-100 mb-4">Approfondir le calcul de marge</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h4 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Réduire le food cost en 10 stratégies</h4>
              <p className="text-xs text-mono-500">Fiches techniques, négociation, gaspillage, menu engineering.</p>
            </Link>
            <Link to="/blog/coefficient-multiplicateur" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h4 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Le coefficient multiplicateur</h4>
              <p className="text-xs text-mono-500">Tableaux par catégorie, erreurs courantes et cas pratique.</p>
            </Link>
            <Link to="/blog/prix-de-vente-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h4 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calculer le prix de vente d'un plat</h4>
              <p className="text-xs text-mono-500">Méthodes coefficient, marge cible, pricing psychologique.</p>
            </Link>
            <Link to="/blog/regle-30-30-30-10-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h4 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">La règle 30-30-30-10 en restauration</h4>
              <p className="text-xs text-mono-500">Répartition idéale des charges et marge cible expliquées.</p>
            </Link>
            <Link to="/blog/faq-marge-restaurant-25-questions" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h4 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">FAQ marge restaurant : 25 questions</h4>
              <p className="text-xs text-mono-500">Réponses précises aux questions les plus posées.</p>
            </Link>
            <Link to="/glossaire-restauration" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h4 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Glossaire restauration</h4>
              <p className="text-xs text-mono-500">Tous les termes techniques expliqués (food cost, prime cost, etc.).</p>
            </Link>
            <Link to="/outils/calculateur-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h4 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calculateur food cost gratuit</h4>
              <p className="text-xs text-mono-500">Outil en ligne pour calculer votre marge en 30 secondes.</p>
            </Link>
            <Link to="/outils/calculateur-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h4 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calculateur marge restaurant</h4>
              <p className="text-xs text-mono-500">Le simulateur complet : food cost + marge brute + nette.</p>
            </Link>
          </div>

          <h3 className="text-lg font-bold text-mono-100 mb-4">Logiciel de marge par type de restaurant</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Link to="/logiciel-marge-bistrot" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h4 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Logiciel marge bistrot</h4>
              <p className="text-xs text-mono-500">Cible food cost 28-33 %, optimisé pour cartes courtes traditionnelles.</p>
            </Link>
            <Link to="/logiciel-marge-pizzeria" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h4 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Logiciel marge pizzeria</h4>
              <p className="text-xs text-mono-500">Coefficient multiplicateur 4 à 6, gestion pâtons, garnitures, four.</p>
            </Link>
            <Link to="/logiciel-marge-boulangerie" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h4 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Logiciel marge boulangerie</h4>
              <p className="text-xs text-mono-500">Marges viennoiseries, ratios farine, gestion invendus, snacking.</p>
            </Link>
            <Link to="/logiciel-marge-gastronomique" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h4 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Logiciel marge gastronomique</h4>
              <p className="text-xs text-mono-500">Produits nobles, fiches techniques complexes, allergènes, accords mets-vins.</p>
            </Link>
            <Link to="/logiciel-marge-burger" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h4 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Logiciel marge burger</h4>
              <p className="text-xs text-mono-500">Optimisation steak, buns, sauces maison, options vegan et menus combo.</p>
            </Link>
            <Link to="/comparatif-logiciels-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h4 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Comparatif logiciels restaurant</h4>
              <p className="text-xs text-mono-500">Tableau comparatif des 8 principales solutions du marché en 2026.</p>
            </Link>
            <Link to="/alternative-zenchef" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h4 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Alternative Zenchef</h4>
              <p className="text-xs text-mono-500">Pourquoi RestauMargin est la meilleure alternative pour les marges.</p>
            </Link>
          </div>
        </section>

        {/* ═════════════ Sources & references (E-E-A-T Trust) ═════════════ */}
        <section className="mb-16" aria-labelledby="sources-references">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <h2 id="sources-references" className="text-2xl font-bold text-mono-100">Sources &amp; références</h2>
          </div>
          <p className="text-sm text-mono-500 mb-6 max-w-3xl">
            Les taux de TVA cités dans ce guide viennent des sources officielles ci-dessous. Les seuils de marge
            et fourchettes de food cost sont des ordres de grandeur de la profession, donnés comme repères :
            comparez-les toujours à vos propres chiffres.
          </p>

          <ul className="grid sm:grid-cols-2 gap-4 mb-6">
            <li>
              <a
                href="https://www.economie.gouv.fr/particuliers/impots-et-fiscalite/gerer-mes-autres-impots-et-taxes/tva-quels-sont-les-taux-de-votre-quotidien"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group h-full"
              >
                <ExternalLink className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span>
                  <span className="block font-semibold text-mono-100 group-hover:text-teal-700 transition-colors">economie.gouv.fr — Taux de TVA</span>
                  <span className="block text-xs text-mono-500 mt-1">Source officielle des taux 5,5 % / 10 % / 20 % appliqués en restauration (repas, boissons, alcool).</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href="https://www.insee.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group h-full"
              >
                <ExternalLink className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span>
                  <span className="block font-semibold text-mono-100 group-hover:text-teal-700 transition-colors">INSEE</span>
                  <span className="block text-xs text-mono-500 mt-1">Statistiques nationales sur la restauration, la démographie des entreprises et les taux de défaillance.</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href="https://www.umih.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group h-full"
              >
                <ExternalLink className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span>
                  <span className="block font-semibold text-mono-100 group-hover:text-teal-700 transition-colors">UMIH</span>
                  <span className="block text-xs text-mono-500 mt-1">Union des Métiers et des Industries de l'Hôtellerie — référence des usages et ratios du secteur CHR.</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href="https://www.lhotellerie-restauration.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group h-full"
              >
                <ExternalLink className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span>
                  <span className="block font-semibold text-mono-100 group-hover:text-teal-700 transition-colors">L'Hôtellerie-Restauration</span>
                  <span className="block text-xs text-mono-500 mt-1">Presse professionnelle de référence (marges brutes, coefficients, pratiques métier).</span>
                </span>
              </a>
            </li>
          </ul>

          <p className="text-xs text-mono-500 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              Méthodologie éditoriale, sources internes et responsable de la publication détaillés sur notre page{' '}
              <Link to="/a-propos" className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">Qui sommes-nous</Link>.
            </span>
          </p>
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

function MargeCard({ icon, title, color, desc, formula, target }: {
  icon: React.ReactNode; title: string; color: string; desc: string; formula: string; target: string;
}) {
  const colors: Record<string, { bg: string; text: string; badge: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
  };
  const c = colors[color] || colors.emerald;

  return (
    <div className={`${c.bg} rounded-2xl p-6 border border-mono-975`}>
      <div className={`w-10 h-10 ${c.badge} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <h3 className="font-bold text-mono-100 mb-2">{title}</h3>
      <p className="text-sm text-mono-400 leading-relaxed mb-4">{desc}</p>
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-mono-500 font-medium">Formule :</span>
          <code className="bg-white/70 px-2 py-0.5 rounded text-mono-350">{formula}</code>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-mono-500 font-medium">Objectif :</span>
          <span className={`${c.badge} px-2 py-0.5 rounded font-semibold`}>{target}</span>
        </div>
      </div>
    </div>
  );
}

function FormulaBlock({ label, formula, calcul, resultat, verdict, color }: {
  label: string; formula: string; calcul: string; resultat: string; verdict: string; color: string;
}) {
  const verdictColor = color === 'emerald' ? 'text-emerald-600' : 'text-amber-600';
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-4 sm:p-5">
      <h4 className="font-semibold text-mono-100 mb-2">{label}</h4>
      <div className="text-sm text-mono-500 mb-1">
        <span className="font-medium">Formule :</span> {formula}
      </div>
      <div className="text-sm text-mono-500 mb-2">
        <span className="font-medium">Calcul :</span> {calcul}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xl font-extrabold text-mono-100">{resultat}</span>
        <span className={`text-sm font-semibold ${verdictColor} flex items-center gap-1`}>
          <CheckCircle className="w-4 h-4" />
          {verdict}
        </span>
      </div>
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
