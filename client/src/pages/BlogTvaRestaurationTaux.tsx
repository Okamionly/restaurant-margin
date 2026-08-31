import { Link } from 'react-router-dom';
import {
  Percent,
  Receipt,
  Wine,
  ShoppingBag,
  Calculator,
  AlertTriangle,
  CheckCircle,
  FileText,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "TVA en restauration 2026 : 5,5 %, 10 % ou 20 %"
   Mot-clé principal : tva restauration, taux tva restaurant
   ~2 600 mots — light/dark mode, W&B, Tailwind
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Quel taux de TVA pour un plat à emporter ?",
    answer:
      "S'il est prêt à être consommé immédiatement (chaud, ou froid mais prêt à manger), c'est 10 %. S'il est conditionné pour être conservé et consommé plus tard (sous vide, en bocal, en conserve), c'est 5,5 %. La forme sous laquelle le produit quitte votre comptoir fait le taux.",
  },
  {
    question: "Le vin et la bière sont-ils toujours à 20 % ?",
    answer:
      "Oui. Toute boisson alcoolisée relève du taux normal de 20 %, qu'elle soit servie au verre en salle, en bouteille à emporter, ou incluse dans une formule. C'est la règle la plus stable de la TVA en restauration.",
  },
  {
    question: "Comment gérer un ticket avec plusieurs taux ?",
    answer:
      "Chaque ligne porte son propre taux : la nourriture immédiate à 10 %, les produits conservables à 5,5 %, l'alcool à 20 %. Une caisse certifiée ventile automatiquement le total par taux, et cette ventilation alimente votre déclaration de TVA. Ne jamais appliquer un taux unique « moyen » à l'ensemble du ticket.",
  },
  {
    question: "Puis-je appliquer un seul taux pour simplifier ma comptabilité ?",
    answer:
      "Non. Il n'existe pas de forfait légal autorisant un taux unique. Tout coller à 10 % vous fait surpayer sur les produits à 5,5 % et sous-collecter sur l'alcool à 20 % — ce dernier point étant directement sanctionnable en cas de contrôle.",
  },
  {
    question: "La TVA change-t-elle si je vends via une plateforme de livraison ?",
    answer:
      "Non. Le taux dépend du produit et de sa destination de consommation, pas du canal. Un plat chaud livré prêt à manger reste à 10 %. La commission de la plateforme est un sujet distinct : vous restez redevable de la TVA au taux du produit, sur le prix payé par le client.",
  },
];

const tocItems = [
  { id: "trois-taux", label: "Les trois taux en un coup d'œil" },
  { id: "regle-reelle", label: "La vraie règle : immédiat ou différé" },
  { id: "destination", label: "Sur place, à emporter, en livraison" },
  { id: "boissons", label: "Les boissons : le piège de l'alcool" },
  { id: "ticket-multi-taux", label: "Le ticket à taux multiples" },
  { id: "erreurs", label: "Les erreurs qui déclenchent un redressement" },
  { id: "marge-ht", label: "L'impact sur votre marge" },
];

export default function BlogTvaRestaurationTaux() {
  const pageTitle = "TVA en restauration 2026 : 5,5 %, 10 % ou 20 % — quel taux appliquer ?";
  const pageDescription =
    "Le guide complet de la TVA en restauration : la vraie règle (consommation immédiate ou différée), le piège de l'alcool, le ticket à taux multiples, et l'impact sur votre marge.";
  const slug = "tva-restauration-taux-guide";
  const canonicalUrl = `https://www.restaumargin.fr/blog/${slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pageTitle,
    description: pageDescription,
    author: { "@type": "Organization", name: "RestauMargin" },
    publisher: {
      "@type": "Organization",
      name: "RestauMargin",
      logo: { "@type": "ImageObject", url: "https://www.restaumargin.fr/logo.png" },
    },
    datePublished: "2026-07-25",
    dateModified: "2026-08-31",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };

  return (
    <>
      <SEOHead
        title={`${pageTitle} | RestauMargin`}
        description={pageDescription}
        path={`/blog/${slug}`}
        schema={[
          articleSchema,
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: "Accueil", url: "https://www.restaumargin.fr/" },
            { name: "Blog", url: "https://www.restaumargin.fr/blog" },
            { name: "TVA en restauration", url: canonicalUrl },
          ]),
        ]}
      />

      <div className="min-h-screen bg-white dark:bg-black">
        <BlogArticleHero
          category="Fiscalité"
          title="TVA en restauration : 5,5 %, 10 % ou 20 %"
          subtitle="Quel taux appliquer sur chaque ligne de votre ticket ?"
          readTime="12 min"
          date="31 août 2026"
        />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <BlogAuthor publishedDate="2026-08-31" readTime="12 min" variant="header" />

          {/* Intro */}
          <p className="text-lg text-[#111111] dark:text-white leading-relaxed mb-6">
            Un même croque-monsieur peut être taxé à trois taux différents. Servi à votre table,
            il relève de 10 %. Vendu scellé au rayon frais pour être réchauffé le lendemain, il
            tombe à 5,5 %. Accompagné d'un verre de vin, ce dernier grimpe à 20 %.{" "}
            <strong>La TVA en restauration n'est pas une histoire de produit, c'est une histoire
            de destination</strong> — et c'est précisément ce que la plupart des restaurateurs
            ratent, jusqu'au jour où un contrôle fiscal reconstitue leurs ventilations.
          </p>

          {/* Table des matières */}
          <nav className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 mb-10">
            <h2 className="font-semibold text-[#111111] dark:text-white mb-3">Sommaire</h2>
            <ol className="space-y-2">
              {tocItems.map((item, i) => (
                <li key={item.id} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold shrink-0">
                    {i + 1}
                  </span>
                  <a href={`#${item.id}`} className="text-teal-600 hover:text-teal-500 text-sm transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Section 1 */}
          <section id="trois-taux" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <Percent className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                1. Les trois taux en un coup d'œil
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              En restauration, trois taux de TVA cohabitent. Contrairement à la plupart des
              secteurs qui n'en manient qu'un, vous devez presque toujours les faire coexister
              sur un même service.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F5] dark:bg-[#0A0A0A] text-left">
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-l-lg">Taux</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white">Ce qu'il vise</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-r-lg">Exemples</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
                  <tr>
                    <td className="p-3 font-bold text-teal-600">10 %</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Consommation immédiate, sur place ou à emporter</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Plat servi en salle, pizza chaude à emporter, café servi</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-teal-600">5,5 %</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Produits alimentaires à consommation différée, conditionnés</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Bouteille d'eau scellée, plat sous vide, pain, conserve</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-teal-600">20 %</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Boissons alcoolisées, quel que soit le mode de consommation</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Vin, bière, cidre, spiritueux, cocktails</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800 rounded-xl p-4">
              <p className="text-sm text-teal-800 dark:text-teal-300">
                Retenez la hiérarchie logique : <strong>l'alcool est toujours à 20 %</strong>, le
                reste bascule entre 10 % et 5,5 % selon un seul critère — le moment auquel le
                produit est destiné à être consommé.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="regle-reelle" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                2. La vraie règle : consommation immédiate ou différée
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Voici le point que 90 % des articles survolent. <strong className="text-[#111111] dark:text-white">Le taux ne dépend
              pas de ce que vous vendez, mais de quand le client est censé le consommer.</strong> Un
              produit destiné à être mangé sans préparation supplémentaire, dans un délai court, est
              taxé à 10 %. Dès que le conditionnement permet la conservation, on retombe à 5,5 %.
            </p>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-4">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <strong>L'astuce mentale qui ne trompe pas :</strong> « Est-ce que ce produit peut
                passer la nuit dans un placard sans danger et être consommé demain ? » Si oui,
                consommation différée (5,5 %). Si le produit doit être mangé maintenant,
                consommation immédiate (10 %).
              </p>
            </div>
            <ul className="space-y-2 text-sm text-[#737373] dark:text-[#A3A3A3]">
              <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" /> Une crêpe chaude pliée, à manger tout de suite : <strong className="text-[#111111] dark:text-white">10 %</strong></li>
              <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" /> Un pot de pâte à tartiner vendu dans la même crêperie : <strong className="text-[#111111] dark:text-white">5,5 %</strong></li>
              <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" /> Un plat du jour servi à table : <strong className="text-[#111111] dark:text-white">10 %</strong></li>
              <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" /> Le même plat sous vide en vitrine « à réchauffer » : <strong className="text-[#111111] dark:text-white">5,5 %</strong></li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="destination" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                3. Sur place, à emporter, en livraison
              </h2>
            </div>
            <div className="space-y-4">
              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                <h3 className="font-semibold text-[#111111] dark:text-white mb-2">Vente sur place</h3>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
                  Toute prestation servie et consommée sur place relève de 10 % (nourriture et
                  boissons non alcoolisées), l'alcool restant à 20 %. Le service à table est par
                  nature une consommation immédiate.
                </p>
              </div>
              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                <h3 className="font-semibold text-[#111111] dark:text-white mb-2">Vente à emporter</h3>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
                  Produit chaud ou prêt à consommer → 10 %. Produit conditionné pour être conservé
                  (sous vide, bocal, bouteille scellée) → 5,5 %. Boisson alcoolisée → 20 %, sans
                  exception. Un même point de vente peut donc facturer ses barquettes chaudes à
                  10 % et ses conserves maison à 5,5 % sur le même ticket.
                </p>
              </div>
              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                <h3 className="font-semibold text-[#111111] dark:text-white mb-2">Livraison</h3>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
                  La livraison suit la même logique que la vente à emporter : c'est la nature du
                  produit qui commande, pas le fait qu'il soit livré. Attention aux plateformes
                  (Uber Eats, Deliveroo) : la commission et la TVA sur vos ventes sont deux sujets
                  distincts — vous restez redevable de la TVA au taux du produit, sur le prix payé
                  par le client.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="boissons" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <Wine className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                4. Les boissons : le piège de l'alcool et de l'eau
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Les boissons concentrent à elles seules la moitié des erreurs de TVA en
              restauration. <strong className="text-[#111111] dark:text-white">Toute boisson alcoolisée est à 20 %</strong>, peu
              importe qu'elle soit servie au verre en salle ou vendue en bouteille à emporter.
              Les boissons non alcoolisées, elles, oscillent entre 10 % et 5,5 % selon la
              logique immédiate/différée.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F5] dark:bg-[#0A0A0A] text-left">
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-l-lg">Situation</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white">Taux</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-r-lg">Pourquoi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
                  <tr>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Soda servi au verre, à table</td>
                    <td className="p-3 font-bold text-teal-600">10 %</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Consommation immédiate</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Canette ou bouteille scellée, à emporter</td>
                    <td className="p-3 font-bold text-teal-600">5,5 %</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Contenant conservable → différée</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Toute boisson alcoolisée</td>
                    <td className="p-3 font-bold text-teal-600">20 %</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Taux normal, sans exception</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5 — ticket multi-taux */}
          <section id="ticket-multi-taux" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                5. Le ticket à taux multiples : l'exemple qui débloque tout
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Prenons une commande click &amp; collect typique — 3 lignes, 3 taux :
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F5] dark:bg-[#0A0A0A] text-left">
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-l-lg">Produit</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white">TTC</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white">Taux</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-r-lg">TVA collectée</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
                  <tr>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Menu burger-frites (chaud)</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">13,00 €</td>
                    <td className="p-3 font-bold text-teal-600">10 %</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">1,18 €</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Bouteille d'eau 50 cl scellée</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">1,50 €</td>
                    <td className="p-3 font-bold text-teal-600">5,5 %</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">0,08 €</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Canette de bière 33 cl</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">3,50 €</td>
                    <td className="p-3 font-bold text-teal-600">20 %</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">0,58 €</td>
                  </tr>
                  <tr className="font-semibold text-[#111111] dark:text-white">
                    <td className="p-3">Total ticket</td>
                    <td className="p-3">18,00 €</td>
                    <td className="p-3">—</td>
                    <td className="p-3">1,84 €</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-sm text-red-800 dark:text-red-300">
                Si votre caisse avait tout collé à 10 % par défaut, vous auriez{" "}
                <strong>sous-estimé la TVA due sur la bière</strong> (0,32 € au lieu de 0,58 €). C'est
                exactement ce qu'un vérificateur reconstitue, majorations et intérêts de retard en
                prime. Multipliez l'écart par bière sur des milliers de tickets annuels pour mesurer
                l'enjeu.
              </p>
            </div>
          </section>

          {/* Section 6 — erreurs */}
          <section id="erreurs" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                6. Les erreurs qui déclenchent un redressement
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Les vérificateurs connaissent les points faibles du secteur. Voici les cinq erreurs
              les plus coûteuses.
            </p>
            <ul className="space-y-3">
              {[
                { title: "Coller l'alcool au taux de la nourriture", detail: "Un cocktail « inclus dans la formule » reste à 20 %. Toute formule « boisson comprise » avec alcool doit ventiler la part alcool à 20 %." },
                { title: "Traiter toute la vente à emporter à 10 %", detail: "Vos conserves, plats sous vide et bouteilles scellées relèvent de 5,5 %. Un paramétrage négligé sur ce point sera étendu par le contrôleur aux erreurs en votre défaveur." },
                { title: "Oublier la ventilation des menus et formules", detail: "Un menu à 22 € avec un verre de vin doit séparer les 10 % (nourriture) des 20 % (vin). Un prix « tout compris » sans ventilation est un signal d'alerte." },
                { title: "Utiliser une caisse non certifiée ou modifiée", detail: "L'inaltérabilité des données est au cœur du dispositif anti-fraude ; une caisse « bidouillée » est le premier motif de sanction." },
                { title: "Ne pas conserver les justificatifs", detail: "Tickets Z, journaux de ventes : sans traçabilité, le vérificateur reconstitue vos ventilations sur ses propres bases — rarement à votre avantage." },
              ].map((item) => (
                <li key={item.title} className="flex gap-3 bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                  <FileText className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#111111] dark:text-white">{item.title} : </span>
                    <span className="text-[#737373] dark:text-[#A3A3A3] text-sm">{item.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 7 — marge HT */}
          <section id="marge-ht" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                7. L'impact sur votre marge : raisonner en HT, toujours
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Vous affichez vos prix en TTC sur la carte, mais vous ne gagnez que le HT. Prenons
              un plat vendu <strong className="text-[#111111] dark:text-white">15,00 € TTC</strong>, TVA à 10 % :
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: "CA encaissé (HT)", value: "13,64 €" },
                { label: "Coût matières", value: "4,50 €" },
                { label: "Marge brute réelle", value: "9,14 €" },
                { label: "Coefficient", value: "3,03" },
              ].map((s) => (
                <div key={s.label} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-teal-600">{s.value}</p>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
              L'erreur classique consiste à comparer le prix TTC (15 €) au coût matières HT
              (4,50 €) et à conclure « 70 % de marge ». Faux : vous venez d'inclure dans votre
              marge une TVA que vous devez reverser à l'État — un écart de 3 points de marge
              affichée sur ce seul plat. C'est exactement ce que <strong className="text-[#111111] dark:text-white">RestauMargin</strong> automatise :
              vous saisissez vos prix de carte en TTC, l'outil applique le bon taux à chaque
              produit et affiche votre marge réelle.
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-6">
              Questions fréquentes
            </h2>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <div key={item.question} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                  <h3 className="font-semibold text-[#111111] dark:text-white mb-2">{item.question}</h3>
                  <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Maillage interne */}
          <section className="mb-10">
            <div className="flex flex-wrap gap-2">
              <Link to="/blog/reprise-restaurant-guide-acheteur" className="text-sm text-teal-600 hover:text-teal-500 underline underline-offset-2">
                Reprise de restaurant : guide acheteur
              </Link>
              <span className="text-[#737373] dark:text-[#A3A3A3]">·</span>
              <Link to="/blog/licence-iv-restaurant-guide" className="text-sm text-teal-600 hover:text-teal-500 underline underline-offset-2">
                Licence IV : l'obtenir, la transférer, l'exploiter
              </Link>
            </div>
          </section>

          {/* CTA */}
          <div className="bg-[#111111] dark:bg-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white dark:text-[#111111] mb-3">
              Calculez votre vraie marge, TVA comprise
            </h2>
            <p className="text-[#A3A3A3] dark:text-[#737373] mb-6 max-w-md mx-auto">
              RestauMargin gère la conversion HT/TTC au bon taux pour chaque produit et vous
              affiche la marge réelle plat par plat — celle qui reste vraiment dans votre caisse.
            </p>
            <a
              href="https://www.restaumargin.fr/pricing"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <BlogAuthor publishedDate="2026-08-31" readTime="12 min" variant="footer" />

          <div className="mt-8 pt-6 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
            <Link to="/blog" className="text-sm text-teal-600 hover:text-teal-500 transition-colors">
              ← Retour au blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
