import { Link } from 'react-router-dom';
import {
  ChefHat,
  TrendingUp,
  Calculator,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  ShoppingCart,
  Handshake,
  FileText,
  Users,
  BarChart3,
  AlertTriangle,
  Target,
  Zap,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Négocier avec ses fournisseurs en restauration"
   Mot-clé principal : négocier fournisseurs restaurant
   ~1 500 mots — light/dark mode, W&B, Tailwind
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Peut-on négocier avec Metro ou Transgourmet comme un grand compte ?",
    answer:
      "Oui, via leurs programmes dédiés aux indépendants. Metro propose la Carte Pro Restaurateurs avec des tarifs négociés sur certaines familles. L'astuce : adressez-vous au directeur régional de l'enseigne, pas au commercial de terrain, qui a souvent moins de marge de manœuvre. Préparez vos volumes annuels pour justifier un traitement différencié.",
  },
  {
    question: "Combien de temps faut-il pour préparer une négociation annuelle ?",
    answer:
      "Comptez 4 à 6 heures : 2h pour compiler vos données d'achats, 1h pour benchmarker les prix du marché, 1h pour préparer l'argumentaire, et 30 à 60 min pour la réunion. Cet investissement est rentabilisé dès les premières semaines si vous obtenez 3 à 5 % de baisse sur 100 000 EUR d'achats annuels — soit 3 000 à 5 000 EUR de marge récupérée.",
  },
  {
    question: "Faut-il dire à un fournisseur qu'on a une offre concurrente moins chère ?",
    answer:
      "Oui, mais sans nommer le concurrent. Dites : 'J'ai reçu une offre à X EUR/kg sur ce produit. Pouvez-vous m'expliquer la différence ou vous aligner ?' Cette formulation est honnête et pose la pression nécessaire. En revanche, mentir sur un devis fictif se retourne toujours contre vous à moyen terme et détruit la confiance.",
  },
  {
    question: "Quand est-ce qu'un changement de fournisseur est justifié ?",
    answer:
      "Quand le différentiel dépasse 8 à 10 % sur un produit équivalent après négociation, ou quand la qualité/service est systématiquement insatisfaisante malgré deux rappels. Le changement a un coût caché (adaptation des recettes, risques de rupture) qui dépasse souvent 3 à 5 % du prix d'achat — donc un fournisseur 4 % moins cher ne justifie pas toujours de partir.",
  },
];

const slug = 'negocier-fournisseurs-restaurant';
const title = 'Négocier avec ses fournisseurs en restauration : 7 techniques pour réduire ses coûts matières';
const description =
  'Apprenez à négocier efficacement avec vos fournisseurs de restauration : mise en concurrence, contrats-cadres, RFA, regroupement d\'achats. Guide pratique 2026 pour réduire votre food cost de 5 à 10 %.';
const publishDate = '2026-07-17';
const heroIcon = <Handshake className="w-10 h-10 text-teal-400" />;

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  description,
  datePublished: publishDate,
  dateModified: publishDate,
  author: { '@type': 'Organization', name: 'RestauMargin' },
  publisher: {
    '@type': 'Organization',
    name: 'RestauMargin',
    url: 'https://www.restaumargin.fr',
  },
  mainEntityOfPage: `https://www.restaumargin.fr/blog/${slug}`,
};

export default function BlogNegocierFournisseurs() {
  const faqSchema = buildFAQSchema(faqItems);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Accueil', url: 'https://www.restaumargin.fr' },
    { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
    { name: 'Négocier fournisseurs restaurant', url: `https://www.restaumargin.fr/blog/${slug}` },
  ]);

  return (
    <>
      <SEOHead
        title={`${title} | RestauMargin`}
        description={description}
        canonical={`https://www.restaumargin.fr/blog/${slug}`}
        schemas={[articleSchema, faqSchema, breadcrumbSchema]}
      />

      <div className="min-h-screen bg-white dark:bg-black">
        <BlogArticleHero
          category="Achats & Marges"
          title={title}
          subtitle="Avec un food cost cible entre 28 et 32 %, chaque point gagné à l'achat se retrouve directement en marge nette. 7 techniques éprouvées pour reprendre l'avantage face à vos fournisseurs."
          icon={heroIcon}
          publishDate={publishDate}
          readTime="7 min"
        />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

          {/* Intro */}
          <p className="text-lg text-[#111111] dark:text-white leading-relaxed mb-8">
            Vous achetez des marchandises chaque semaine à des fournisseurs qui, eux, négocient à plein temps.
            Résultat : la plupart des restaurateurs paient <strong>10 à 20 % de trop</strong> sur leurs approvisionnements sans même le savoir.
            Sur 144 000 EUR d'achats annuels, une économie de 8 % représente <strong>11 500 EUR de marge brute additionnelle</strong> — l'équivalent de 2 points de food cost.
          </p>

          {/* Table des matières */}
          <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 mb-10">
            <h2 className="text-sm font-semibold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider mb-3">Sommaire</h2>
            <ol className="space-y-2 text-[#111111] dark:text-white">
              {[
                'Préparer la négociation : connaître ses chiffres',
                'Jouer la concurrence entre fournisseurs',
                'Négocier les conditions de paiement et les remises',
                'Regrouper ses achats pour obtenir des volumes',
                'Fixer des contrats-cadres et des engagements annuels',
                'FAQ',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          {/* Section 1 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">1. Préparer la négociation : connaître ses chiffres</h2>
            </div>
            <p className="text-[#111111] dark:text-[#D4D4D4] leading-relaxed mb-4">
              Un fournisseur respecte le restaurateur qui arrive chiffres en main. Avant toute réunion d'achat, compilez vos données des 12 derniers mois :
              volume acheté par famille de produits (viandes, épicerie, boissons), montant total HT par fournisseur, et évolution des tarifs.
            </p>
            <div className="bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800 rounded-xl p-4 mb-4">
              <p className="text-sm text-teal-800 dark:text-teal-300">
                <strong>Exemple :</strong> Un restaurant de 80 couverts dépense en moyenne 12 000 EUR/mois en marchandises. Sur 12 mois : 144 000 EUR — un volume qui justifie une négociation annuelle formelle.
              </p>
            </div>
            <ul className="space-y-2 text-[#111111] dark:text-[#D4D4D4]">
              {[
                'Calculez votre taux de dépendance : si un fournisseur dépasse 40 % d\'une catégorie, vous êtes en position de faiblesse',
                'Identifiez vos produits locomotives : les 5 à 10 articles en plus grande quantité sont vos meilleurs leviers',
                'Benchmarkez les tarifs : catalogues Metro, Transgourmet, Brake France servent de référence plancher',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">2. Jouer la concurrence entre fournisseurs</h2>
            </div>
            <p className="text-[#111111] dark:text-[#D4D4D4] leading-relaxed mb-4">
              La mise en concurrence est le levier le plus puissant — et le moins utilisé. La majorité des restaurateurs restent fidèles par habitude à un fournisseur historique sans jamais demander d'offre concurrente.
            </p>
            <div className="space-y-4">
              <div className="border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                <h3 className="font-semibold text-[#111111] dark:text-white mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-teal-600" /> La règle des 3 devis
                </h3>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
                  Pour tout produit représentant plus de 500 EUR/mois, obtenez 3 offres différentes. Comparez à produit équivalent — pas seulement au prix facial.
                </p>
              </div>
              <div className="border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                <h3 className="font-semibold text-[#111111] dark:text-white mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-teal-600" /> La technique de la contre-offre
                </h3>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
                  Revenez vers votre fournisseur avec la meilleure offre concurrente (sans nommer le concurrent). Dans 60 à 70 % des cas, il s'alignera.
                </p>
              </div>
              <div className="border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                <h3 className="font-semibold text-[#111111] dark:text-white mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Attention au service
                </h3>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
                  Un fournisseur 5 % moins cher qui livre en retard ou ne reprend pas les non-conformes coûte souvent plus cher au final. Intégrez la valeur du service.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">3. Négocier les conditions de paiement et les remises</h2>
            </div>
            <p className="text-[#111111] dark:text-[#D4D4D4] leading-relaxed mb-4">
              Le prix unitaire n'est pas le seul paramètre. Les conditions de paiement et les remises commerciales peuvent représenter une économie équivalente ou supérieure.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Délais de paiement', value: '30-45 jours', desc: 'Libère 16 000 EUR de trésorerie en permanence sur 12 000 EUR/mois d\'achats', icon: <FileText className="w-5 h-5 text-teal-600" /> },
                { label: 'RFA annuelles', value: '1-2 %', desc: '2 880 EUR récupérés/an sur 144 000 EUR d\'achats avec une RFA de 2 %', icon: <Calculator className="w-5 h-5 text-teal-600" /> },
                { label: 'Remises volume commande', value: '-3 %', desc: 'À partir de 500 EUR par commande chez certains grossistes', icon: <ShoppingCart className="w-5 h-5 text-teal-600" /> },
                { label: 'Contreparties en nature', value: 'Valeur réelle', desc: 'Verres, formations produits, dégustations — sans toucher au budget prix', icon: <Lightbulb className="w-5 h-5 text-teal-600" /> },
              ].map((item) => (
                <div key={item.label} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {item.icon}
                    <span className="font-semibold text-[#111111] dark:text-white text-sm">{item.label}</span>
                  </div>
                  <p className="text-teal-600 font-bold text-lg mb-1">{item.value}</p>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">4. Regrouper ses achats pour obtenir des volumes</h2>
            </div>
            <p className="text-[#111111] dark:text-[#D4D4D4] leading-relaxed mb-4">
              Seul, un restaurant indépendant n'a pas le même poids qu'une chaîne de 50 établissements. La solution : créer ou rejoindre des groupements d'achat.
            </p>
            <ul className="space-y-3">
              {[
                { title: 'Groupements informels', desc: '3 à 5 restaurateurs voisins non concurrents → 600 000 EUR/an d\'achats mutualisés = pouvoir d\'une mini-chaîne' },
                { title: 'Centrales professionnelles', desc: 'GNI, UMIH : accords-cadres nationaux avec tarifs négociés collectivement, sans contrainte de volume individuel' },
                { title: 'Spécialisation par fournisseur', desc: 'Un spécialiste viandes, un primeur, un épicier fine — vous êtes client important de leur cœur de métier' },
                { title: 'Timing saisonnier', desc: 'Tomates en juillet : 3× moins chères qu\'en décembre. Adaptez les menus à la saisonnalité pour des économies immédiates' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 p-4 bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl">
                  <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#111111] dark:text-white text-sm">{item.title}</p>
                    <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">5. Fixer des contrats-cadres et des engagements annuels</h2>
            </div>
            <p className="text-[#111111] dark:text-[#D4D4D4] leading-relaxed mb-4">
              La relation fournisseur la plus efficace est construite sur des engagements mutuels formalisés, pas sur des commandes au coup par coup.
            </p>
            <div className="space-y-3">
              <div className="border-l-4 border-teal-600 pl-4">
                <h3 className="font-semibold text-[#111111] dark:text-white mb-1">Le contrat d'approvisionnement</h3>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
                  1 à 2 pages : volumes minimaux garantis, prix contractuels sur 6 ou 12 mois, clause de révision indexée sur l'IPA INSEE (plafonnée à +3 %/an), délais et pénalités.
                </p>
              </div>
              <div className="border-l-4 border-teal-600 pl-4">
                <h3 className="font-semibold text-[#111111] dark:text-white mb-1">Le bilan annuel fournisseur</h3>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
                  Volumes réels vs engagés, taux de non-conformité, respect des délais, évolution tarifaire. Ce bilan est votre base de négociation pour l'année suivante.
                </p>
              </div>
              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="font-semibold text-[#111111] dark:text-white mb-1">L'outil indispensable</h3>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
                  Utilisez RestauMargin pour centraliser vos prix fournisseurs, comparer les devis et être alerté quand un tarif dépasse votre seuil. Sans outil, les écarts passent inaperçus pendant des mois.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-6">Questions fréquentes</h2>
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <div key={i} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                  <h3 className="font-semibold text-[#111111] dark:text-white mb-2 text-sm">{item.question}</h3>
                  <p className="text-sm text-[#737373] dark:text-[#A3A3A3] leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-[#111111] dark:bg-white rounded-2xl p-8 text-center">
            <ChefHat className="w-10 h-10 text-teal-400 dark:text-teal-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white dark:text-[#111111] mb-3">
              Centralisez tous vos prix fournisseurs avec RestauMargin
            </h2>
            <p className="text-[#A3A3A3] dark:text-[#737373] text-sm mb-6 max-w-md mx-auto">
              Module Mercuriale inclus : comparaison automatique des devis, alertes dérive tarifaire, historique des prix sur 24 mois. Essai 14 jours gratuit, sans CB.
            </p>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Démarrer gratuitement <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <BlogAuthor />
        </div>
      </div>
    </>
  );
}
