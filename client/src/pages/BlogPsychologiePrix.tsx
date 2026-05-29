import { Link } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  Eye,
  BarChart3,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Target,
  Lightbulb,
  ChefHat,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';

const faqItems = [
  {
    question: 'Quels sont les 3 biais psychologiques les plus importants pour fixer ses prix au restaurant ?',
    answer: "L'ancrage (un plat cher rend les autres abordables), l'effet de contraste (l'option du milieu est choisie dans 67 % des cas), et la réduction de la douleur du paiement (supprimer le symbole €). Ces trois biais appliqués ensemble peuvent augmenter votre ticket moyen de 15 à 25 %.",
  },
  {
    question: 'Est-il légal de supprimer le symbole € sur la carte en France ?',
    answer: "Oui, à condition que les prix TTC soient lisiblement affichés et qu'une mention « Prix TTC » figure sur la carte. L'arrêté du 27 mars 1987 impose l'affichage des prix, pas le format exact du symbole monétaire.",
  },
  {
    question: "Combien de plats maximum par catégorie pour éviter la paralysie du choix ?",
    answer: "7 plats par catégorie (±2) selon la loi de Hick-Hyman. Au-delà de 9 options, le temps de décision augmente et la satisfaction post-achat diminue. Pour les restaurants gastronomiques, 4 à 6 plats par section est l'idéal.",
  },
  {
    question: 'Le prix psychologique fonctionne-t-il aussi pour les boissons ?',
    answer: "Absolument. La technique du « vin ancre » positionne une bouteille premium en tête de carte et augmente le prix moyen de la bouteille commandée de 12 à 18 %. Appliquez l'effet de contraste : proposez vos vins en 3 gammes de prix.",
  },
];

const techniques = [
  { icon: Target, title: 'Prix ancrage', desc: 'Un plat premium rend les autres abordables' },
  { icon: DollarSign, title: 'Supprimer le €', desc: 'Réduit la douleur psychologique du paiement' },
  { icon: BarChart3, title: 'Effet de contraste', desc: "67 % des clients choisissent l'option du milieu" },
  { icon: TrendingUp, title: 'Prix de charme', desc: '.95 et .90 selon votre segment de marché' },
  { icon: Eye, title: 'Golden Triangle', desc: "Positionnez vos Stars dans la zone d'attention" },
  { icon: ChefHat, title: 'Bundling', desc: 'Formules pour augmenter le ticket moyen' },
];

export default function BlogPsychologiePrix() {
  const slug = 'psychologie-des-prix-restaurant';
  const title = 'Psychologie des prix en restauration : 7 techniques pour vendre plus (2026)';
  const description =
    'Découvrez 7 techniques de psychologie des prix prouvées pour augmenter votre ticket moyen de 15 à 25 % sans toucher à vos recettes ni à vos charges.';
  const url = `https://www.restaumargin.fr/blog/${slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: { '@type': 'Organization', name: 'RestauMargin' },
    publisher: {
      '@type': 'Organization',
      name: 'RestauMargin',
      logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/logo.png' },
    },
    datePublished: '2026-05-29',
    dateModified: '2026-05-29',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        path={`/blog/${slug}`}
        schema={[articleSchema, buildFAQSchema(faqItems), buildBreadcrumbSchema([
          { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
          { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
          { name: 'Psychologie des prix restaurant', url },
        ])]}
      />

      <div className="min-h-screen bg-white dark:bg-black text-[#111111] dark:text-white">
        {/* Hero */}
        <div className="bg-gradient-to-br from-teal-50 to-white dark:from-teal-950/20 dark:to-black border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="max-w-3xl mx-auto px-4 py-14">
            <nav className="flex items-center gap-2 text-sm text-[#737373] dark:text-[#A3A3A3] mb-6">
              <Link to="/" className="hover:text-teal-600 transition-colors">Accueil</Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-teal-600 transition-colors">Blog</Link>
              <span>/</span>
              <span>Psychologie des prix</span>
            </nav>
            <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Lightbulb className="w-3.5 h-3.5" />
              Stratégie de prix
            </div>
            <h1 className="font-satoshi text-3xl sm:text-4xl font-bold leading-tight mb-4">
              Psychologie des prix en restauration : 7 techniques pour vendre plus sans baisser vos marges
            </h1>
            <p className="text-lg text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
              Augmentez votre ticket moyen de 15 à 25 % grâce aux biais cognitifs prouvés. Des techniques utilisées par les plus grands groupes, applicables dès ce soir.
            </p>
            <p className="mt-4 text-sm text-[#737373] dark:text-[#A3A3A3]">Par l'équipe RestauMargin · 29 mai 2026 · 7 min de lecture</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">

          {/* Intro */}
          <p className="text-lg leading-relaxed text-[#737373] dark:text-[#A3A3A3]">
            Vous avez des plats délicieux, une salle pleine le week-end... et pourtant votre marge nette stagne autour de 5 %. Souvent, le problème ne vient pas du coût des matières ou du personnel : il vient de la façon dont vous <strong className="text-[#111111] dark:text-white">présentez vos prix</strong>. La psychologie des prix en restauration est une science éprouvée qui permet d'augmenter le ticket moyen de 10 à 25 % sans toucher à vos recettes ni à vos charges.
          </p>

          {/* Techniques grid */}
          <div>
            <h2 className="font-satoshi text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-teal-600" />
              Les 6 techniques clés
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {techniques.map(({ icon: Icon, title: t, desc }) => (
                <div key={t} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t}</p>
                    <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 1 */}
          <section>
            <h2 className="font-satoshi text-2xl font-bold mb-4">1. Le prix ancrage : mettre vos plats chers en vitrine</h2>
            <p className="leading-relaxed text-[#737373] dark:text-[#A3A3A3] mb-3">
              L'ancrage de prix est le biais cognitif le plus puissant en restauration. Quand un client voit un plat à 42 € en haut de la carte, tous les autres plats à 22–28 € lui semblent raisonnables, voire bon marché.
            </p>
            <div className="bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800 rounded-xl p-5 my-5">
              <p className="font-semibold text-teal-700 dark:text-teal-400 text-sm mb-1">Exemple concret</p>
              <p className="text-sm leading-relaxed text-[#737373] dark:text-[#A3A3A3]">
                Un bistrot parisien a ajouté un "Wagyu A5 poêlé" à 68 €. Résultat : ses entrecôtes à 32 € sont passées de 18 % à 31 % des commandes en 6 semaines. Le plat à 68 € représentait moins de 3 % des ventes — mais son rôle était accompli.
              </p>
            </div>
            <p className="leading-relaxed text-[#737373] dark:text-[#A3A3A3]">
              L'ancre doit être visible immédiatement à l'ouverture de la carte, paraître premium (description détaillée, origine, label), et son prix doit être au moins 2,5× supérieur à votre plat phare.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-satoshi text-2xl font-bold mb-4">2. Supprimer le symbole € pour réduire la "douleur du paiement"</h2>
            <p className="leading-relaxed text-[#737373] dark:text-[#A3A3A3] mb-3">
              Des recherches de l'Université Cornell ont démontré que le symbole monétaire (€, $) active les zones cérébrales associées à la douleur. Résultat : le client commande moins ou choisit des plats moins chers.
            </p>
            <ul className="space-y-2 pl-4">
              {[
                'Remplacez "Entrecôte ... 28 €" par "Entrecôte ... 28"',
                'Évitez les colonnes de prix alignées à droite',
                'Utilisez une police légèrement plus petite pour le prix',
                'Mention "Prix TTC" en bas de menu suffit légalement',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#737373] dark:text-[#A3A3A3]">
                  <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-medium text-teal-700 dark:text-teal-400">
              Impact mesuré : +8 % de ticket moyen (étude Cornell, 398 restaurants)
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-satoshi text-2xl font-bold mb-4">3. L'effet de contraste : la règle du plat du milieu</h2>
            <p className="leading-relaxed text-[#737373] dark:text-[#A3A3A3] mb-3">
              Lorsqu'on présente 3 options de prix (bas, moyen, élevé), les clients choisissent l'option du milieu dans <strong className="text-[#111111] dark:text-white">67 % des cas</strong>. C'est le "compromis effect" de Simonson et Tversky.
            </p>
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-5 space-y-2">
              <p className="text-sm font-medium mb-2">Exemple — section Desserts :</p>
              <div className="flex justify-between text-sm"><span className="text-[#737373] dark:text-[#A3A3A3]">Mousse au chocolat maison</span><span>6,50</span></div>
              <div className="flex justify-between text-sm font-semibold bg-teal-50 dark:bg-teal-900/20 rounded-lg px-2 py-1"><span>Île flottante pralinée et son coulis caramel ⭐ votre star</span><span className="text-teal-600">9,50</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#737373] dark:text-[#A3A3A3]">Assiette de mignardises du chef (min 2 pers.)</span><span>14,00</span></div>
            </div>
            <p className="mt-4 text-sm text-[#737373] dark:text-[#A3A3A3]">
              Une chaîne de pizzerias a restructuré ses 7 formules en 3 niveaux. La formule milieu est passée de 31 % à 54 % des commandes, augmentant le ticket moyen de 2,40 € par couvert.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-satoshi text-2xl font-bold mb-4">4. Les prix en ".95" et ".90" : mythe ou réalité ?</h2>
            <p className="leading-relaxed text-[#737373] dark:text-[#A3A3A3] mb-4">
              Les prix de charme sont efficaces... mais seulement dans certains contextes. La règle d'or dépend de votre segment :
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <th className="text-left py-2 pr-4 font-semibold">Segment</th>
                    <th className="text-left py-2 pr-4 font-semibold">Format prix</th>
                    <th className="text-left py-2 font-semibold">Raison</th>
                  </tr>
                </thead>
                <tbody className="text-[#737373] dark:text-[#A3A3A3]">
                  <tr className="border-b border-[#E5E7EB]/50 dark:border-[#1A1A1A]/50">
                    <td className="py-2 pr-4">Fast-casual, brasserie</td>
                    <td className="py-2 pr-4">.95 / .90</td>
                    <td className="py-2">Signal prix bas</td>
                  </tr>
                  <tr className="border-b border-[#E5E7EB]/50 dark:border-[#1A1A1A]/50">
                    <td className="py-2 pr-4">Bistrot traditionnel</td>
                    <td className="py-2 pr-4">Ronds ou .50</td>
                    <td className="py-2">Honnêteté, artisanat</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Gastronomique</td>
                    <td className="py-2 pr-4">Ronds obligatoires</td>
                    <td className="py-2">Confiance, qualité</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-satoshi text-2xl font-bold mb-4">5. Le Golden Triangle et la présentation visuelle</h2>
            <p className="leading-relaxed text-[#737373] dark:text-[#A3A3A3] mb-3">
              Les études d'eye-tracking identifient 3 zones prioritaires sur une carte A4 :
            </p>
            <ul className="space-y-2 pl-4 mb-4">
              {[
                'Zone 1 (regard en premier) : milieu de la page droite',
                'Zone 2 : coin supérieur droit',
                'Zone 3 : coin supérieur gauche',
              ].map((z) => (
                <li key={z} className="flex items-start gap-2 text-sm text-[#737373] dark:text-[#A3A3A3]">
                  <Eye className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                  {z}
                </li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed text-[#737373] dark:text-[#A3A3A3]">
              Un encadré augmente les commandes de 30 %. Une photo de qualité : +25 à 40 %. La mention "Coup de cœur du chef" : +27 %. Limitez à 7 plats par catégorie pour éviter la paralysie du choix.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-satoshi text-2xl font-bold mb-4">6. Bundling : augmenter la valeur perçue avec les formules</h2>
            <p className="leading-relaxed text-[#737373] dark:text-[#A3A3A3] mb-3">
              Le bundling crée une perception d'économie tout en augmentant votre ticket moyen. La clé : toujours compenser un élément à food cost élevé (viande noble) par deux éléments à très forte marge (entrée légère, dessert maison).
            </p>
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-5">
              <p className="text-sm font-semibold mb-3">Exemple de formule équilibrée :</p>
              <div className="space-y-1 text-sm text-[#737373] dark:text-[#A3A3A3]">
                <div className="flex justify-between"><span>Salade César (food cost 26 %)</span><span>8,50</span></div>
                <div className="flex justify-between"><span>Magret canard (food cost 35 %)</span><span>24,00</span></div>
                <div className="flex justify-between border-b border-[#E5E7EB] dark:border-[#1A1A1A] pb-1"><span>Fondant chocolat (food cost 26 %)</span><span>7,50</span></div>
                <div className="flex justify-between font-semibold text-[#111111] dark:text-white pt-1"><span>Menu formule (food cost 36 %)</span><span className="text-teal-600">34,50</span></div>
              </div>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-2">Le client économise 5,50 € ; votre ticket moyen augmente si 40 %+ des clients prennent la formule complète.</p>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="font-satoshi text-2xl font-bold mb-6">Questions fréquentes</h2>
            <div className="space-y-4">
              {faqItems.map(({ question, answer }) => (
                <div key={question} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                  <p className="font-semibold text-sm mb-2">{question}</p>
                  <p className="text-sm text-[#737373] dark:text-[#A3A3A3] leading-relaxed">{answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 text-white text-center">
            <h2 className="font-satoshi text-2xl font-bold mb-3">Prêt à optimiser vos prix ?</h2>
            <p className="text-teal-100 mb-6 max-w-md mx-auto text-sm">
              RestauMargin calcule automatiquement votre food cost, identifie vos plats Stars vs Chiens, et génère des recommandations de prix pour maximiser votre marge nette.
            </p>
            <a
              href="https://www.restaumargin.fr/pricing"
              className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors"
            >
              Essayer gratuitement
              <ArrowRight className="w-4 h-4" />
            </a>
          </section>

          {/* Back to blog */}
          <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-500 transition-colors font-medium">
              ← Retour au blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
