import React from 'react';
import SEOHead from '../components/SEOHead';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Calcul du prix de vente d\'un menu restaurant : la méthode rentable',
  description: 'Comment calculer le prix d\'une formule entrée-plat-dessert avec le food cost pondéré, la règle des trois contraintes et la psychologie du prix fixe.',
  datePublished: '2026-09-25',
  author: { '@type': 'Organization', name: 'RestauMargin' },
  publisher: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quel food cost cible pour une formule à moins de 15 € ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'À 14,90 € HT, votre budget matières est 4,47 € (30 %). C\'est faisable avec une entrée froide simple (1,20 €), un plat bistro sans protéine noble (2,80 €) et un dessert basique (0,90 €). Négociez vos volumes avec vos fournisseurs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Faut-il changer le prix de la formule selon les saisons ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Plutôt que de changer le prix affiché, adaptez les composantes de la formule en substituant les ingrédients hors-saison par des produits au coût bas en ce moment.',
      },
    },
    {
      '@type': 'Question',
      name: 'Comment gérer un fournisseur qui augmente ses tarifs en cours d\'année ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Recalculez le food cost pondéré à chaque hausse tarifaire > 5 %. Si le food cost dépasse 32 %, ajustez sous 30 jours : reformuler, renégocier ou répercuter la hausse sur le prix.',
      },
    },
    {
      '@type': 'Question',
      name: 'Puis-je inclure le fromage comme composante d\'une formule 4 temps ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui, mais un plateau de fromages représente souvent 2,00-2,80 € de coût matière. Intégrez-le dans le calcul : une formule à 4 temps n\'est rentable que si le prix de vente absorbe ce surcoût.',
      },
    },
  ],
};

export default function BlogPrixVenteMenu() {
  return (
    <>
      <SEOHead
        title="Calcul du prix de vente d'un menu restaurant : la méthode rentable | RestauMargin"
        description="Comment calculer le prix d'une formule entrée-plat-dessert avec le food cost pondéré, la règle des trois contraintes et la psychologie du prix fixe. Méthode pratique avec exemples chiffrés."
        path="/blog/prix-vente-menu-restaurant-methode"
        type="article"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="min-h-screen bg-white dark:bg-black text-[#111111] dark:text-white">
        <div className="max-w-3xl mx-auto px-4 py-16">

          {/* Breadcrumb */}
          <nav className="text-sm text-[#737373] dark:text-[#A3A3A3] mb-8">
            <a href="/" className="hover:text-teal-600">Accueil</a>
            {' / '}
            <a href="/blog" className="hover:text-teal-600">Blog</a>
            {' / '}
            <span>Prix de vente d'un menu</span>
          </nav>

          <h1 className="font-satoshi text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Calcul du prix de vente d'un menu restaurant : la méthode rentable
          </h1>

          <p className="text-[#737373] dark:text-[#A3A3A3] text-sm mb-8">
            Publié le 25 septembre 2026 · 8 min de lecture
          </p>

          {/* Intro */}
          <p className="text-lg leading-relaxed mb-10">
            Proposer une formule entrée-plat-dessert semble simple : on additionne trois prix et on fait une remise. En réalité, cette logique détruit la marge de dizaines de restaurants chaque année. Le calcul d'un menu rentable repose sur un <strong>food cost pondéré</strong> de ses trois composantes, une lecture fine de la perception client et un arbitrage entre attractivité tarifaire et marge brute cible.
          </p>

          {/* Sommaire */}
          <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 mb-10">
            <p className="font-semibold mb-3">Table des matières</p>
            <ol className="space-y-1 text-teal-600 dark:text-teal-400 list-decimal list-inside text-sm">
              <li><a href="#section1" className="hover:underline">Pourquoi le prix d'un menu n'est pas la somme des plats</a></li>
              <li><a href="#section2" className="hover:underline">Calculer le food cost pondéré d'une formule</a></li>
              <li><a href="#section3" className="hover:underline">Fixer le prix de vente : la règle des trois contraintes</a></li>
              <li><a href="#section4" className="hover:underline">Effet d'ancrage et psychologie du menu à prix fixe</a></li>
              <li><a href="#section5" className="hover:underline">Carte vs formule : quel format protège mieux la marge ?</a></li>
            </ol>
          </div>

          {/* Section 1 */}
          <section id="section1" className="mb-10">
            <h2 className="font-satoshi text-2xl font-bold mb-4">
              1. Pourquoi le prix d'un menu n'est pas la somme des plats
            </h2>
            <p className="mb-4">
              Beaucoup de restaurateurs calculent leur formule ainsi : entrée à 8 €, plat à 16 €, dessert à 6 € = 30 € à la carte → formule à 26 € (remise de 4 €). Erreur classique.
            </p>
            <p className="mb-4">
              Ce raisonnement ignore que <strong>chaque composante a un food cost différent</strong>. L'entrée (salade, velouté, terrine) tourne souvent autour de 18-22 % de food cost. Le plat principal (viande, poisson) grimpe facilement à 35-40 %. Le dessert redescend à 15-20 %.
            </p>
            <p className="mb-4">
              Si vous appliquez une remise uniforme sur la formule, vous réduisez mécaniquement votre marge sur le plat — le poste qui coûte déjà le plus cher. Résultat : un menu du jour à 14,90 € avec un plat du jour bœuf peut afficher un food cost global de <strong>34 % alors que votre cible est 30 %</strong>, soit 4 points de marge perdus sur chaque couvert.
            </p>
            <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4">
              <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">La règle d'or</p>
              <p className="text-sm mt-1">Calculez le food cost de la formule comme un tout, pas plat par plat.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section2" className="mb-10">
            <h2 className="font-satoshi text-2xl font-bold mb-4">
              2. Calculer le food cost pondéré d'une formule
            </h2>
            <p className="mb-4">
              La méthode correcte consiste à additionner les coûts matières réels de chaque composante, puis à diviser par le prix de vente HT de la formule.
            </p>
            <p className="font-semibold mb-3">Exemple concret :</p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F5] dark:bg-[#1A1A1A]">
                    <th className="text-left p-3 border border-[#E5E7EB] dark:border-[#262626]">Composante</th>
                    <th className="text-right p-3 border border-[#E5E7EB] dark:border-[#262626]">Coût matière</th>
                    <th className="text-right p-3 border border-[#E5E7EB] dark:border-[#262626]">Food cost seul</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-[#E5E7EB] dark:border-[#262626]">Entrée : velouté de potimarron</td>
                    <td className="p-3 border border-[#E5E7EB] dark:border-[#262626] text-right">1,40 €</td>
                    <td className="p-3 border border-[#E5E7EB] dark:border-[#262626] text-right">17,5 %</td>
                  </tr>
                  <tr className="bg-[#FAFAFA] dark:bg-[#0A0A0A]">
                    <td className="p-3 border border-[#E5E7EB] dark:border-[#262626]">Plat : pavé de saumon + légumes</td>
                    <td className="p-3 border border-[#E5E7EB] dark:border-[#262626] text-right">5,20 €</td>
                    <td className="p-3 border border-[#E5E7EB] dark:border-[#262626] text-right">32,5 %</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-[#E5E7EB] dark:border-[#262626]">Dessert : fondant chocolat</td>
                    <td className="p-3 border border-[#E5E7EB] dark:border-[#262626] text-right">0,90 €</td>
                    <td className="p-3 border border-[#E5E7EB] dark:border-[#262626] text-right">15,0 %</td>
                  </tr>
                  <tr className="font-bold bg-teal-50 dark:bg-teal-900/20">
                    <td className="p-3 border border-[#E5E7EB] dark:border-[#262626]">Total matières</td>
                    <td className="p-3 border border-[#E5E7EB] dark:border-[#262626] text-right">7,50 €</td>
                    <td className="p-3 border border-[#E5E7EB] dark:border-[#262626] text-right">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mb-4">
              Prix de vente HT de la formule : <strong>25,00 €</strong><br />
              <strong>Food cost pondéré : 7,50 / 25,00 = 30 %</strong> ✓
            </p>
            <p className="mb-4">
              Ce calcul vous permet de vérifier que la formule respecte votre objectif de 30 % <em>avant</em> de l'afficher sur l'ardoise. Si le total matières dépasse votre seuil, vous avez trois leviers : remplacer un ingrédient, ajuster la portion, ou revoir le prix de vente.
            </p>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
              Point de vigilance : intégrez le coût du pain, du beurre d'accueil, de la mise en bouche. Ces à-côtés représentent 0,40 à 0,80 € par couvert — soit 2 à 3 points de food cost sur une formule à 15 €.
            </p>
          </section>

          {/* Section 3 */}
          <section id="section3" className="mb-10">
            <h2 className="font-satoshi text-2xl font-bold mb-4">
              3. Fixer le prix de vente : la règle des trois contraintes
            </h2>
            <p className="mb-4">Un bon prix de vente est l'intersection de trois contraintes simultanées.</p>

            <div className="space-y-4 mb-6">
              <div className="border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                <p className="font-semibold mb-1">Contrainte 1 — Le coût</p>
                <p className="text-sm">Votre food cost cible vous donne un plancher de prix. Pour un food cost de 30 %, le prix de vente HT minimum est : total matières ÷ 0,30. Si le total matières est 7,50 €, le plancher est 25,00 € HT (27,50 € TTC avec TVA 10 %).</p>
              </div>
              <div className="border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                <p className="font-semibold mb-1">Contrainte 2 — Le marché</p>
                <p className="text-sm">Observez les formules proposées dans votre zone de chalandise pour un positionnement comparable. Si la concurrence directe affiche des menus à 22-28 €, un menu à 35 € sera perçu comme hors-marché même s'il est objectivement justifié.</p>
              </div>
              <div className="border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                <p className="font-semibold mb-1">Contrainte 3 — La perception client</p>
                <p className="text-sm">La question n'est pas "combien ça vaut ?" mais "combien mon client est prêt à payer sans friction ?". Le ticket moyen historique de votre établissement est votre meilleur indicateur.</p>
              </div>
            </div>

            <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
              <p className="text-sm font-mono">Prix cible = max(plancher coût, médiane marché) × ajustement perception (0,9 à 1,1)</p>
            </div>
            <p className="mt-4 text-sm text-[#737373] dark:text-[#A3A3A3]">
              Si vos trois contraintes convergent autour de 25-27 €, caler à 25,90 € ou 26,50 € est souvent plus efficace que 27,00 € (seuil psychologique du palier des 30 €).
            </p>
          </section>

          {/* Section 4 */}
          <section id="section4" className="mb-10">
            <h2 className="font-satoshi text-2xl font-bold mb-4">
              4. Effet d'ancrage et psychologie du menu à prix fixe
            </h2>
            <p className="mb-4">
              Le prix fixe d'une formule tire son attractivité d'un mécanisme cognitif bien documenté : <strong>l'effet d'ancrage</strong>. Lorsque le client voit "Formule midi 26 € — Entrée + Plat + Dessert", il compare mentalement à la somme des prix à la carte et perçoit une économie, même si la formule est en réalité aussi rentable.
            </p>
            <p className="font-semibold mb-3">Trois techniques pour amplifier cet effet :</p>
            <ul className="list-disc list-inside space-y-2 mb-4 text-sm">
              <li><strong>Affichez les prix à la carte à côté de la formule</strong> — pas pour inciter à commander à la carte, mais pour ancrer la valeur perçue.</li>
              <li><strong>Nommez les composantes</strong> — "Velouté du moment / Pavé de saumon Label Rouge, écrasé de pommes de terre / Fondant chocolat maison" se vend mieux que "Entrée + Plat + Dessert".</li>
              <li><strong>Proposez deux niveaux de formule</strong> — une formule à 19,90 € (entrée+plat ou plat+dessert) et une à 26,90 € (les trois). La première sert d'ancrage bas et augmente les prises de formule complète.</li>
            </ul>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
              Une étude publiée en 2023 dans le <em>Journal of Hospitality & Tourism Research</em> montrait que les restaurants qui affichent explicitement l'économie réalisée par rapport à la carte (+3,50 € économisés) augmentent le taux de prise de formule complète de 18 points en moyenne.
            </p>
          </section>

          {/* Section 5 */}
          <section id="section5" className="mb-10">
            <h2 className="font-satoshi text-2xl font-bold mb-4">
              5. Carte vs formule : quel format protège mieux la marge ?
            </h2>
            <p className="mb-4">La réponse dépend de votre flux de clients et de votre rapport main-d'œuvre/matières.</p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                <p className="font-semibold text-teal-600 dark:text-teal-400 mb-2">La formule gagne sur :</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>La vitesse de service (cuisine optimisée → rotation plus rapide)</li>
                  <li>La gestion des stocks (achat précis)</li>
                  <li>Le food cost contrôlable (28-30 % cible)</li>
                </ul>
              </div>
              <div className="border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                <p className="font-semibold mb-2">La carte gagne sur :</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>La marge unitaire des plats signatures</li>
                  <li>La fidélisation (variété perçue)</li>
                  <li>L'upsell (boissons, suppléments)</li>
                </ul>
              </div>
            </div>

            <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4">
              <p className="font-semibold text-teal-700 dark:text-teal-300 mb-1">Stratégie optimale</p>
              <p className="text-sm">Formule midi imposée (vitesse + maîtrise des coûts) + carte le soir (marge unitaire + expérience). Le déjeuner finance l'exploitation ; le dîner construit la marge.</p>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="mb-12">
            <h2 className="font-satoshi text-2xl font-bold mb-6">FAQ</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Quel food cost cible pour une formule à moins de 15 € ?',
                  a: 'À 14,90 € HT, votre budget matières est 4,47 € (30 %). C\'est faisable avec une entrée froide simple (1,20 €), un plat bistro sans protéine noble (2,80 €) et un dessert basique (0,90 €). Négociez vos volumes avec vos fournisseurs.',
                },
                {
                  q: 'Faut-il changer le prix de la formule selon les saisons ?',
                  a: 'Plutôt que de changer le prix affiché, adaptez les composantes : substituez les ingrédients hors-saison par des produits au coût bas en ce moment. Le prix reste stable ; le food cost reste maîtrisé.',
                },
                {
                  q: 'Comment gérer un fournisseur qui augmente ses tarifs en cours d\'année ?',
                  a: 'Recalculez le food cost pondéré à chaque hausse > 5 %. Si le food cost dépasse 32 %, ajustez sous 30 jours : reformuler, renégocier ou répercuter la hausse sur le prix.',
                },
                {
                  q: 'Puis-je inclure le fromage comme composante d\'une formule 4 temps ?',
                  a: 'Oui, mais un plateau de fromages représente souvent 2,00-2,80 € de coût matière. Intégrez-le dans le calcul : une formule à 4 temps n\'est rentable que si le prix de vente absorbe ce surcoût ou si les autres composantes sont allégées.',
                },
              ].map(({ q, a }) => (
                <details key={q} className="border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                  <summary className="font-semibold cursor-pointer">{q}</summary>
                  <p className="mt-3 text-sm text-[#737373] dark:text-[#A3A3A3]">{a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-[#111111] dark:bg-white rounded-2xl p-8 text-center">
            <h3 className="font-satoshi text-xl font-bold text-white dark:text-[#111111] mb-3">
              Calculez le food cost de vos formules automatiquement
            </h3>
            <p className="text-[#A3A3A3] dark:text-[#737373] mb-6 text-sm">
              RestauMargin calcule le food cost pondéré de chaque formule, simule l'impact d'un changement d'ingrédient et compare carte vs formule sur votre marge nette.
            </p>
            <a
              href="https://www.restaumargin.fr/pricing"
              className="inline-block bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Essai gratuit 7 jours — sans carte bancaire
            </a>
          </div>

        </div>
      </main>
    </>
  );
}
