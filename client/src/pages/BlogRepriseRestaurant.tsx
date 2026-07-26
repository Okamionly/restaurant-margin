import { Link } from 'react-router-dom';
import {
  Building2,
  Calculator,
  AlertTriangle,
  TrendingUp,
  Banknote,
  CheckCircle,
  ArrowRight,
  FileText,
  Users,
  ShieldCheck,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Reprise de restaurant : guide acheteur 2026"
   Mot-clé principal : reprise restaurant, racheter un restaurant
   ~1 500 mots — light/dark mode, W&B, Tailwind
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Peut-on reprendre un restaurant en liquidation judiciaire ?",
    answer:
      "Oui, via un appel d'offres auprès du liquidateur. Le prix peut être 30 à 50 % sous la valeur de marché, mais sans garantie d'actif-passif. Réservé aux repreneurs expérimentés avec des fonds propres solides.",
  },
  {
    question: "Faut-il obligatoirement reprendre les salariés en place ?",
    answer:
      "En cas de cession de fonds de commerce, oui. L'Article L.1224-1 impose le transfert automatique des contrats avec toutes leurs caractéristiques : ancienneté, salaire et statut.",
  },
  {
    question: "Quelle est la durée moyenne d'une reprise de fonds de commerce ?",
    answer:
      "De la première visite à la signature, comptez 3 à 6 mois : 1 mois de due diligence, 1 mois de montage financier, puis délais légaux (préemption mairie, purge) avant signature chez le notaire.",
  },
  {
    question: "Vaut-il mieux reprendre un fonds ou créer son restaurant from scratch ?",
    answer:
      "La reprise coûte plus cher à l'entrée mais offre une clientèle existante. La création part sur des bases saines mais demande 12 à 18 mois avant d'atteindre le seuil de rentabilité.",
  },
];

const tocItems = [
  { id: "valorisation", label: "Valorisation d'un fonds de commerce" },
  { id: "audit", label: "L'audit comptable indispensable" },
  { id: "pieges", label: "Les pièges cachés" },
  { id: "negociation", label: "Négocier le prix" },
  { id: "financement", label: "Financement et aides disponibles" },
];

export default function BlogRepriseRestaurant() {
  const pageTitle = "Reprise de restaurant : comment éviter les pièges — Guide acheteur 2026";
  const pageDescription =
    "Audit comptable, valorisation fonds de commerce, dettes cachées, négociation et financement : tout ce qu'il faut savoir avant de racheter un restaurant en 2026.";
  const slug = "reprise-restaurant-guide-acheteur";
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
    dateModified: "2026-07-25",
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
            { name: "Reprise de restaurant", url: canonicalUrl },
          ]),
        ]}
      />

      <div className="min-h-screen bg-white dark:bg-black">
        <BlogArticleHero
          category="Gestion & Finances"
          title="Reprise de restaurant : comment éviter les pièges"
          subtitle="Guide acheteur 2026"
          readTime="7 min"
          date="25 juillet 2026"
        />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <BlogAuthor publishedDate="2026-07-25" readTime="7 min" variant="header" />

          {/* Intro */}
          <p className="text-lg text-[#111111] dark:text-white leading-relaxed mb-6">
            Vous avez trouvé le restaurant de vos rêves à reprendre. L'emplacement est idéal, le
            gérant parle de "clientèle fidèle". Mais entre la présentation du vendeur et la
            réalité comptable, il peut y avoir un abîme.{" "}
            <strong>35 % des reprises de fonds de commerce en restauration se soldent par
            une cessation d'activité dans les 3 ans</strong>, souvent faute d'audit préalable.
            Ce guide vous donne les outils pour reprendre sereinement — ou renoncer à temps.
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
                  <a
                    href={`#${item.id}`}
                    className="text-teal-600 hover:text-teal-500 text-sm transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Section 1 */}
          <section id="valorisation" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                1. Comprendre la valorisation d'un fonds de commerce
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              La valeur d'un fonds se calcule à partir du <strong className="text-[#111111] dark:text-white">chiffre d'affaires annuel TTC</strong> et
              de l'<strong className="text-[#111111] dark:text-white">EBE (Excédent Brut d'Exploitation)</strong>. La règle empirique
              applique un coefficient entre 0,5 et 1,5× le CA TTC selon l'emplacement, l'état
              du matériel et la notoriété.
            </p>
            <div className="bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800 rounded-xl p-4 mb-4">
              <p className="text-sm text-teal-800 dark:text-teal-300">
                <strong>Exemple :</strong> Un restaurant à 400 000 € de CA TTC avec un EBE de
                60 000 € (15 %) vaut entre 180 000 € et 280 000 €. Si le vendeur demande
                400 000 €, le multiple sur EBE dépasse 6× — la norme du secteur est 3 à 4×.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
                <p className="text-xs font-semibold text-emerald-600 uppercase mb-2">Valorise</p>
                <ul className="space-y-1 text-sm text-[#737373] dark:text-[#A3A3A3]">
                  <li>✓ Bail long avec loyer &lt; 8 % du CA</li>
                  <li>✓ Matériel récent (&lt; 5 ans)</li>
                  <li>✓ Marque déposée + présence digitale</li>
                  <li>✓ Équipe stable</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
                <p className="text-xs font-semibold text-red-500 uppercase mb-2">Déprécie</p>
                <ul className="space-y-1 text-sm text-[#737373] dark:text-[#A3A3A3]">
                  <li>✗ Bail &lt; 3 ans restants</li>
                  <li>✗ Matériel vétuste à remplacer</li>
                  <li>✗ Litiges fournisseurs / sociaux</li>
                  <li>✗ Dépendance totale au gérant actuel</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section id="audit" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                2. L'audit comptable indispensable
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Ne signez jamais une promesse sans avoir analysé <strong className="text-[#111111] dark:text-white">3 années de bilans complets</strong>.
              Voici les indicateurs clés à scruter :
            </p>
            <ul className="space-y-3 mb-4">
              {[
                { label: "Food cost réel", detail: "Achats matières / CA HT. Au-dessus de 35 % sur 3 ans = problème structurel." },
                { label: "Masse salariale", detail: "Ratio charges personnel / CA HT : idéalement sous 35 %. Au-delà de 40 %, alerte rouge." },
                { label: "Dettes fournisseurs", detail: "Fournisseurs non payés > 90 jours = difficultés chroniques. Ce passif peut vous incomber." },
                { label: "Trésorerie mensuelle", detail: "Reconstituez mois par mois sur 2 ans. Des mois négatifs hors saisonnalité sont un signal d'alarme." },
              ].map((item) => (
                <li key={item.label} className="flex gap-3 bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#111111] dark:text-white">{item.label} : </span>
                    <span className="text-[#737373] dark:text-[#A3A3A3] text-sm">{item.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <strong>Conseil :</strong> Mandatez un expert-comptable indépendant (pas celui du vendeur).
                Comptez 1 500 à 3 000 € — c'est la meilleure assurance avant un achat à 6 chiffres.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section id="pieges" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                3. Les pièges cachés
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              La comptabilité ne révèle pas tout. Voici les zones d'ombre à investiguer
              systématiquement avant toute signature :
            </p>
            <div className="space-y-4">
              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <h3 className="font-semibold text-[#111111] dark:text-white">Le bail commercial</h3>
                </div>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
                  Vérifiez la durée restante (idéalement &gt; 6 ans), les clauses de destination,
                  le montant du loyer (ratio loyer/CA &lt; 8 %), l'accord du bailleur pour la cession
                  et les travaux à charge locataire.
                </p>
              </div>
              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-teal-600" />
                  <h3 className="font-semibold text-[#111111] dark:text-white">Les contrats de travail</h3>
                </div>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
                  En reprenant un fonds, vous reprenez <strong>tous les contrats</strong> (Article
                  L.1224-1). Demandez la liste complète avec ancienneté, statut et salaire. Un
                  salarié avec 15 ans d'ancienneté représente plusieurs mois d'indemnités potentielles.
                </p>
              </div>
              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <h3 className="font-semibold text-[#111111] dark:text-white">Normes sanitaires et litiges</h3>
                </div>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
                  Consultez le registre de sécurité et les derniers rapports d'inspection. Une mise
                  aux normes ERP peut coûter 20 000 à 80 000 €. Faites inclure une{" "}
                  <strong>clause de garantie d'actif et de passif</strong> dans l'acte de cession.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="negociation" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                4. Négocier le prix : méthodes et leviers
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Après l'audit, vous avez des arguments concrets. Voici comment structurer votre offre :
            </p>
            <ul className="space-y-3">
              {[
                {
                  title: "Chiffrez les travaux",
                  detail: "Si la hotte doit être remplacée (6 000 à 15 000 €), déduisez-le du prix. Des devis sont vos pièces justificatives.",
                },
                {
                  title: "Utilisez l'EBE comme ancre",
                  detail: "EBE moyen 50 000 €, prix demandé 300 000 € = multiple 6×. Argumentez qu'un multiple de 3,5 à 4× est la norme, soit 175 000 à 200 000 €.",
                },
                {
                  title: "Proposez un crédit-vendeur",
                  detail: "Demandez que le vendeur finance 20 à 30 % du prix sur 3 ans. Sa prise de risque l'incitera à vous accompagner.",
                },
                {
                  title: "Négociez la passation",
                  detail: "Exigez 1 à 3 mois de présence du cédant pour présenter l'équipe, les fournisseurs et les clients réguliers.",
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-3 bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                  <ArrowRight className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#111111] dark:text-white">{item.title} : </span>
                    <span className="text-[#737373] dark:text-[#A3A3A3] text-sm">{item.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 5 */}
          <section id="financement" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                5. Financement et aides disponibles en 2026
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Reprendre un restaurant n'est pas réservé aux acheteurs avec 100 % de fonds propres.
              Les dispositifs d'aide sont nombreux :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Prêt bancaire professionnel",
                  detail: "Jusqu'à 70 % du prix, apport 20-30 %, durée 5 à 7 ans. Indispensable : 3 ans de bilans positifs + prévisionnel crédible.",
                },
                {
                  title: "France Active / Initiative France",
                  detail: "Garantie jusqu'à 65 % du prêt et prêts d'honneur à taux zéro de 5 000 à 50 000 € pour renforcer votre apport.",
                },
                {
                  title: "BPI France",
                  detail: "Pour des reprises > 300 000 €. Prêt participatif ou garantie bancaire renforcée. Contacter votre délégation régionale.",
                },
                {
                  title: "ACRE",
                  detail: "Si vous étiez demandeur d'emploi, exonération partielle de charges sociales la 1ère année (5 000 à 8 000 € d'économie).",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
                  <h3 className="font-semibold text-[#111111] dark:text-white text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-6">
              Questions fréquentes
            </h2>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <div
                  key={item.question}
                  className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5"
                >
                  <h3 className="font-semibold text-[#111111] dark:text-white mb-2">
                    {item.question}
                  </h3>
                  <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-[#111111] dark:bg-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white dark:text-[#111111] mb-3">
              Simulez la rentabilité de votre reprise
            </h2>
            <p className="text-[#A3A3A3] dark:text-[#737373] mb-6 max-w-md mx-auto">
              RestauMargin vous permet de modéliser food cost, prime cost et seuil de rentabilité
              sur vos propres hypothèses — avant même de signer.
            </p>
            <a
              href="https://www.restaumargin.fr/pricing"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <BlogAuthor publishedDate="2026-07-25" readTime="7 min" variant="footer" />

          <div className="mt-8 pt-6 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
            <Link
              to="/blog"
              className="text-sm text-teal-600 hover:text-teal-500 transition-colors"
            >
              ← Retour au blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
