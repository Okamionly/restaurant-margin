import { Link } from 'react-router-dom';
import {
  Wine,
  ScrollText,
  Scale,
  GraduationCap,
  ArrowRightLeft,
  Euro,
  AlertTriangle,
  Building2,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Licence IV en restauration : l'obtenir, la transferer, l'exploiter"
   Mot-clé principal : licence iv restaurant
   ~3 000 mots — light/dark mode, W&B, Tailwind
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Un restaurant peut-il servir du whisky sans licence IV ?",
    answer:
      "Oui. La licence restaurant autorise toutes les catégories de boissons, spiritueux compris, dès lors qu'elles sont servies à l'occasion des repas. Le digestif au dessert est parfaitement légal ; servir ce même whisky à un client au comptoir qui ne mange pas ne l'est pas.",
  },
  {
    question: "Combien de temps faut-il pour obtenir une licence IV ?",
    answer:
      "Une mutation (reprise d'un fonds existant) se règle en 15 jours, le temps de la déclaration en mairie. Un transfert depuis une autre commune demande une décision préfectorale : comptez environ deux mois d'instruction, plus le délai de recherche d'une licence disponible.",
  },
  {
    question: "Peut-on acheter une licence IV et la garder de côté ?",
    answer:
      "Techniquement oui, mais le calendrier commande : cinq années consécutives sans exploitation la rendent périmée, donc invendable. Stocker une licence est une stratégie risquée.",
  },
  {
    question: "La licence IV est-elle amortissable comptablement ?",
    answer:
      "En principe non, car sa durée d'utilisation n'est pas limitée dans le temps. Elle s'inscrit en immobilisation incorporelle sans amortissement, avec possibilité de dépréciation en cas d'indice de perte de valeur.",
  },
  {
    question: "Que devient la licence IV si je ferme six mois pour travaux ?",
    answer:
      "Aucun risque à cette échelle : le seuil de péremption est de cinq ans consécutifs de non-exploitation. Travaux, saison creuse ou congé prolongé ne mettent pas la licence en danger.",
  },
];

const tocItems = [
  { id: "groupes", label: "Les groupes de boissons" },
  { id: "quatre-licences", label: "Les quatre licences en un tableau" },
  { id: "besoin-reel", label: "Avez-vous vraiment besoin d'une licence IV ?" },
  { id: "permis-exploitation", label: "Le permis d'exploitation" },
  { id: "obtenir", label: "Mutation, translation, transfert, création" },
  { id: "prix", label: "Combien coûte une licence IV en 2026" },
  { id: "pieges", label: "Les quatre pièges qui font perdre une licence" },
  { id: "marge", label: "Ce que la licence change sur votre marge" },
];

export default function BlogLicenceIV() {
  const pageTitle = "Licence IV en restauration : l'obtenir, la transférer, l'exploiter (guide 2026)";
  const pageDescription =
    "Groupes de boissons, licence restaurant vs licence IV, permis d'exploitation, mutation et transfert, prix 2026, comptabilisation et les 4 pièges qui font perdre une licence.";
  const slug = "licence-iv-restaurant-guide";
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
    datePublished: "2026-08-02",
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
            { name: "Licence IV", url: canonicalUrl },
          ]),
        ]}
      />

      <div className="min-h-screen bg-white dark:bg-black">
        <BlogArticleHero
          category="Réglementation"
          title="Licence IV en restauration"
          subtitle="L'obtenir, la transférer, l'exploiter — guide 2026"
          readTime="14 min"
          date="31 août 2026"
        />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <BlogAuthor publishedDate="2026-08-31" readTime="14 min" variant="header" />

          {/* Intro */}
          <p className="text-lg text-[#111111] dark:text-white leading-relaxed mb-6">
            Chaque année, des restaurateurs dépensent 15 000 € pour une licence dont ils n'ont pas
            besoin. Le scénario est toujours le même : on ouvre une table, on veut servir du vin
            et un digestif, quelqu'un dit « il te faut une licence IV », et l'on part en chasse
            d'une licence à racheter dans le département.{" "}
            <strong>Sauf qu'un restaurant qui sert de l'alcool pendant les repas relève de la
            licence restaurant — gratuite.</strong> La licence IV, elle, ne devient indispensable
            que le jour où un client s'installe au comptoir pour boire un cocktail sans commander
            de repas.
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
          <section id="groupes" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <Wine className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                1. Les groupes de boissons : la base du système
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Le droit français ne classe pas les licences par type d'établissement, mais par{" "}
              <strong className="text-[#111111] dark:text-white">catégorie de boisson</strong>. Chaque licence donne accès à
              certains groupes, pas à d'autres.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F5] dark:bg-[#0A0A0A] text-left">
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-l-lg">Groupe</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white">Contenu</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-r-lg">Exemples</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
                  <tr>
                    <td className="p-3 font-bold text-teal-600">Groupe 1</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Boissons sans alcool</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Eau, jus, sodas, café, thé</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-teal-600">Groupe 3</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Fermentées non distillées, vins doux naturels</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Vin, bière, cidre, poiré, crème de cassis</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-teal-600">Groupes 4 et 5</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Distillées, spiritueux, tous les autres alcools</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Whisky, vodka, rhum, gin, cognac, cocktails</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
              Le « groupe 2 » a disparu en 2016, fusionné avec le groupe 1. La ligne de fracture
              passe entre le groupe 3 et les groupes 4-5 : entre ce qui fermente (vin, bière) et
              ce qui se distille (spiritueux). C'est cette frontière qui sépare une licence
              gratuite d'une licence à cinq chiffres.
            </p>
          </section>

          {/* Section 2 */}
          <section id="quatre-licences" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <ScrollText className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                2. Les quatre licences en un tableau
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Deux familles coexistent : les licences de <strong className="text-[#111111] dark:text-white">débit de boissons</strong> (on
              peut boire sans manger) et les licences <strong className="text-[#111111] dark:text-white">restaurant</strong> (l'alcool
              accompagne un repas).
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F5] dark:bg-[#0A0A0A] text-left">
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-l-lg">Licence</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white">Boissons</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white">Condition</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-r-lg">Coût</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
                  <tr>
                    <td className="p-3 font-semibold text-[#111111] dark:text-white">Petite licence restaurant</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Groupes 1 et 3</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">À l'occasion des repas</td>
                    <td className="p-3 font-bold text-teal-600">Gratuite</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#111111] dark:text-white">Licence restaurant</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Tous groupes</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">À l'occasion des repas</td>
                    <td className="p-3 font-bold text-teal-600">Gratuite</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#111111] dark:text-white">Licence III</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Groupes 1 et 3</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Sans obligation de repas</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Gratuite, création contingentée</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#111111] dark:text-white">Licence IV</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Tous groupes</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Sans obligation de repas</td>
                    <td className="p-3 font-bold text-amber-600">7 500 – 50 000 €</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
              La <strong className="text-[#111111] dark:text-white">licence restaurant autorise le whisky, le cognac et le
              cocktail</strong>, exactement comme la licence IV. La seule différence tient à un mot :
              repas.
            </p>
          </section>

          {/* Section 3 */}
          <section id="besoin-reel" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <Scale className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                3. La question à 20 000 € : en avez-vous vraiment besoin ?
              </h2>
            </div>
            <div className="bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800 rounded-xl p-4 mb-4">
              <p className="text-sm text-teal-800 dark:text-teal-300">
                <strong>La règle :</strong> la licence restaurant suffit tant que l'alcool est
                servi comme accessoire d'un repas. La licence IV devient obligatoire dès que vous
                servez de l'alcool sans repas.
              </p>
            </div>
            <ul className="space-y-2 text-sm mb-4">
              <li className="flex items-start gap-2 text-[#737373] dark:text-[#A3A3A3]">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                Un client commande une bouteille de bordeaux avec son repas — licence restaurant suffit
              </li>
              <li className="flex items-start gap-2 text-[#737373] dark:text-[#A3A3A3]">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                Digestif servi au dessert d'une formule du midi — licence restaurant suffit
              </li>
              <li className="flex items-start gap-2 text-[#737373] dark:text-[#A3A3A3]">
                <span className="text-red-500 font-bold shrink-0">✗</span>
                Un client s'assoit au bar à 18 h 30, commande une bière, repart sans manger — licence III ou IV requise
              </li>
              <li className="flex items-start gap-2 text-[#737373] dark:text-[#A3A3A3]">
                <span className="text-red-500 font-bold shrink-0">✗</span>
                Afterwork tapas-cocktails sans service de table — licence III ou IV requise
              </li>
            </ul>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
              Une licence IV se négocie entre <strong className="text-[#111111] dark:text-white">12 000 et 24 000 €</strong> en
              moyenne en 2026 pour une cession isolée : si votre concept est une table classique —
              service assis, pas de comptoir — cette dépense n'achète rien de plus que ce que la
              licence restaurant vous donne gratuitement. Trois profils en ont un besoin réel : le
              bar-restaurant, le restaurant avec happy hour, et le repreneur d'un fonds qui en
              possède déjà une.
            </p>
          </section>

          {/* Section 4 */}
          <section id="permis-exploitation" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                4. Le permis d'exploitation : obligatoire dans tous les cas
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Confusion la plus fréquente du secteur : la <strong className="text-[#111111] dark:text-white">licence</strong> est
              attachée à l'établissement, le <strong className="text-[#111111] dark:text-white">permis d'exploitation</strong> est
              attaché à la personne. Le permis est exigé pour la licence restaurant comme pour la
              licence IV.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: "Obtention initiale", detail: "20 heures (2,5 à 3 jours). Cadre légal, protection des mineurs, ordre public." },
                { title: "Plus de 10 ans d'expérience", detail: "6 heures (1 journée), version condensée." },
                { title: "Renouvellement", detail: "7 heures, tous les 10 ans." },
              ].map((item) => (
                <div key={item.title} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
                  <h3 className="font-semibold text-[#111111] dark:text-white text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">{item.detail}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mt-4">
              Budget : 350 à 500 € TTC auprès d'un organisme agréé. Anticipez deux mois — les
              sessions sont souvent complètes — et vérifiez la date du permis lors d'une reprise :
              celui du cédant ne se transmet pas, il est personnel.
            </p>
          </section>

          {/* Section 5 */}
          <section id="obtenir" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                5. Mutation, translation, transfert, création
              </h2>
            </div>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F5] dark:bg-[#0A0A0A] text-left">
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-l-lg">Opération</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white">Ce qui change</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-r-lg">Difficulté</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
                  <tr>
                    <td className="p-3 font-semibold text-[#111111] dark:text-white">Mutation</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Exploitant, même lieu</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Simple : déclaration en mairie</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#111111] dark:text-white">Translation</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Adresse, même commune</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Simple, sous réserve des zones protégées</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#111111] dark:text-white">Transfert</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Changement de commune</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Complexe : autorisation préfectorale</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#111111] dark:text-white">Création</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Nouvelle licence ex nihilo</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Interdite en principe, dérogations limitées</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-3">
              La <strong className="text-[#111111] dark:text-white">mutation</strong> est le cas standard d'une reprise : la
              licence est comprise dans le fonds, déclaration en mairie 15 jours avant
              l'exploitation.
            </p>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
              Le <strong className="text-[#111111] dark:text-white">transfert</strong> est possible à l'intérieur du même
              département, de la même région, ou entre départements limitrophes de la même région.
              Dossier en préfecture, avis des maires, décision préfectorale — comptez environ deux
              mois d'instruction. Ne signez jamais un compromis sans clause suspensive d'obtention
              du transfert.
            </p>
          </section>

          {/* Section 6 */}
          <section id="prix" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <Euro className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                6. Combien coûte une licence IV en 2026
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Aucun tarif officiel : le prix résulte d'une négociation de gré à gré et reflète la
              rareté locale.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {[
                { zone: "Zone rurale à faible demande", price: "4 000 – 7 500 €" },
                { zone: "Ville moyenne (moyenne du marché)", price: "12 000 – 24 000 €" },
                { zone: "Grande ville, zone touristique", price: "30 000 – 50 000 € et +" },
              ].map((z) => (
                <div key={z.zone} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 text-center">
                  <p className="text-lg font-bold text-teal-600">{z.price}</p>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-1">{z.zone}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
              Ajoutez le permis d'exploitation (350-500 €) et les frais d'acte : comptez{" "}
              <strong className="text-[#111111] dark:text-white">13 000 à 25 000 € de budget d'entrée réaliste</strong> pour un
              projet qui nécessite vraiment une licence IV. Elle n'est en principe pas
              amortissable comptablement : c'est une immobilisation de trésorerie, non une charge
              déductible étalée — à faire valider par votre expert-comptable.
            </p>
          </section>

          {/* Section 7 — pièges */}
          <section id="pieges" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                7. Les quatre pièges qui font perdre une licence
              </h2>
            </div>
            <div className="space-y-4">
              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                <h3 className="font-semibold text-[#111111] dark:text-white mb-2">1. La péremption au bout de 5 ans</h3>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
                  Une licence non exploitée pendant cinq années consécutives est considérée comme
                  périmée : elle ne peut plus être ni transmise, ni vendue. Côté repreneur, exigez
                  la preuve d'une exploitation continue avant d'acheter.
                </p>
              </div>
              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                <h3 className="font-semibold text-[#111111] dark:text-white mb-2">2. Les zones protégées</h3>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
                  Installation interdite dans certains périmètres autour d'établissements sensibles
                  (écoles, hôpitaux, lieux de culte). Demandez l'arrêté préfectoral applicable
                  avant de signer le bail.
                </p>
              </div>
              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                <h3 className="font-semibold text-[#111111] dark:text-white mb-2">3. Le quota de population</h3>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
                  Une commune ne peut pas dépasser un débit de boissons pour 450 habitants (licences
                  III et IV cumulées) — ce qui explique pourquoi les licences existantes se
                  revendent si cher dans les zones saturées.
                </p>
              </div>
              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                <h3 className="font-semibold text-[#111111] dark:text-white mb-2">4. Confondre licence et permis</h3>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
                  Le permis d'exploitation ne se transmet pas avec le fonds : il est personnel.
                  Racheter un fonds avec sa licence IV sans avoir passé la formation vous laisse
                  dans l'impossibilité juridique d'ouvrir.
                </p>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4 mt-4">
              <p className="text-sm text-red-800 dark:text-red-300">
                Exploiter un débit de boissons sans déclaration préalable est un délit puni de{" "}
                <strong>3 750 € d'amende</strong>, infraction qui se renouvelle aussi longtemps que
                dure l'exploitation irrégulière.
              </p>
            </div>
          </section>

          {/* Section 8 — marge */}
          <section id="marge" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                8. Ce que la licence change réellement sur votre marge
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Les boissons alcoolisées sont, de loin, le poste le plus margé d'un établissement.
              Là où un plat tourne autour de 30 % de coût matière, une boisson se situe
              généralement entre 15 et 25 %.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F5] dark:bg-[#0A0A0A] text-left">
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-l-lg">Produit</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white">Prix TTC</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-r-lg">Coût matière</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
                  <tr>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Plat du jour</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">16,00 €</td>
                    <td className="p-3 font-bold text-teal-600">31 %</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Verre de vin (12 cl)</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">6,50 €</td>
                    <td className="p-3 font-bold text-teal-600">22 %</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Cocktail spiritueux</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">12,00 €</td>
                    <td className="p-3 font-bold text-teal-600">18 %</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Bière pression (25 cl)</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">4,50 €</td>
                    <td className="p-3 font-bold text-teal-600">15 %</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
              Sur un bar-restaurant qui ouvre son comptoir de 18 h à 19 h 30, 5 jours sur 7, avec
              15 consommations supplémentaires par service à 80 % de marge brute :{" "}
              <strong className="text-[#111111] dark:text-white">environ 18 000 € de marge brute annuelle</strong>. Une licence
              IV à 20 000 € se rembourse alors en un peu plus d'un an. Le calcul bascule dans
              l'autre sens si votre concept ne prévoit aucun service hors repas — cet arbitrage se
              tranche avec trois chiffres : coût matière réel, prix de vente HT, volume plausible
              hors repas.
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
            <div className="flex flex-wrap gap-2 items-center">
              <Building2 className="w-4 h-4 text-[#737373] dark:text-[#A3A3A3]" />
              <Link to="/blog/reprise-restaurant-guide-acheteur" className="text-sm text-teal-600 hover:text-teal-500 underline underline-offset-2">
                Reprise de restaurant : guide acheteur
              </Link>
              <span className="text-[#737373] dark:text-[#A3A3A3]">·</span>
              <Link to="/blog/tva-restauration-taux-guide" className="text-sm text-teal-600 hover:text-teal-500 underline underline-offset-2">
                TVA en restauration : 5,5 %, 10 % ou 20 %
              </Link>
              <span className="text-[#737373] dark:text-[#A3A3A3]">·</span>
              <Link to="/blog/comment-ouvrir-restaurant-guide-complet" className="text-sm text-teal-600 hover:text-teal-500 underline underline-offset-2">
                Comment ouvrir un restaurant
              </Link>
            </div>
          </section>

          {/* CTA */}
          <div className="bg-[#111111] dark:bg-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white dark:text-[#111111] mb-3">
              Passez des règles aux chiffres
            </h2>
            <p className="text-[#A3A3A3] dark:text-[#737373] mb-6 max-w-md mx-auto">
              RestauMargin calcule le coût de revient exact de chaque plat et de chaque boisson de
              votre carte, en HT, pour arbitrer votre besoin réel de licence IV avec vos propres chiffres.
            </p>
            <a
              href="https://www.restaumargin.fr/pricing"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <BlogAuthor publishedDate="2026-08-31" readTime="14 min" variant="footer" />

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
