import SEOHead from '../components/SEOHead';

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Carte des vins restaurant : comment la construire pour maximiser la marge",
  "description": "Guide complet pour construire une carte des vins rentable : nombre de références, coefficients multiplicateurs, rotation de cave et présentation.",
  "datePublished": "2026-05-22",
  "dateModified": "2026-05-22",
  "author": { "@type": "Organization", "name": "RestauMargin" },
  "publisher": { "@type": "Organization", "name": "RestauMargin", "url": "https://www.restaumargin.fr" }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Faut-il avoir une cave à vins physique pour un restaurant ?",
      "acceptedAnswer": { "@type": "Answer", "text": "Non, une cave physique est justifiée seulement pour plus de 80 références ou un positionnement gastronomique fort. Un cellier de service avec livraisons fréquentes suffit pour la majorité des restaurants." }
    },
    {
      "@type": "Question",
      "name": "Peut-on vendre ses propres vins au restaurant ?",
      "acceptedAnswer": { "@type": "Answer", "text": "Oui, c'est légal avec la licence boissons appropriée. Un vin maison crée un lien fort avec votre identité et peut générer une marge supérieure à 70 %." }
    },
    {
      "@type": "Question",
      "name": "Comment gérer les vins bio et nature sur la carte ?",
      "acceptedAnswer": { "@type": "Answer", "text": "Réservez 15 à 20 % des références aux vins bio et nature. Leur prix d'achat légèrement supérieur est compensé par une valeur perçue élevée permettant de maintenir le coefficient habituel." }
    },
    {
      "@type": "Question",
      "name": "À quelle fréquence renouveler sa carte des vins ?",
      "acceptedAnswer": { "@type": "Answer", "text": "Faites une révision complète 2 fois par an (avril et octobre) en lien avec les nouvelles sorties millésimes, et remplacez les références épuisées ou à faible rotation au fil de l'eau." }
    }
  ]
};

export default function BlogCarteVins() {
  return (
    <>
      <SEOHead
        title="Carte des vins restaurant : guide pour maximiser la marge 2026"
        description="Comment construire une carte des vins rentable : nombre de références, coefficients multiplicateurs, rotation cave et présentation. Guide complet pour restaurateurs."
        path="/blog/construire-carte-vins-restaurant"
        type="article"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="min-h-screen bg-white dark:bg-black">
        <div className="max-w-3xl mx-auto px-4 py-12">

          {/* Breadcrumb */}
          <nav className="text-sm text-[#737373] dark:text-[#A3A3A3] mb-8">
            <a href="/" className="hover:text-teal-600">Accueil</a>
            <span className="mx-2">/</span>
            <a href="/blog" className="hover:text-teal-600">Blog</a>
            <span className="mx-2">/</span>
            <span>Carte des vins restaurant</span>
          </nav>

          {/* Header */}
          <header className="mb-10">
            <div className="inline-block bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Boissons & Rentabilité
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#111111] dark:text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Carte des vins restaurant : comment la construire pour maximiser la marge
            </h1>
            <p className="text-[#737373] dark:text-[#A3A3A3] text-sm">
              Publié le 22 mai 2026 · Lecture 7 min
            </p>
          </header>

          {/* Intro */}
          <p className="text-lg text-[#111111] dark:text-white mb-8 leading-relaxed">
            Vous perdez de l'argent sur votre carte des vins sans le savoir. Un restaurateur sur deux sous-évalue ses vins et laisse sa cave tourner trop lentement. La carte des vins représente pourtant <strong>25 à 40 % du chiffre d'affaires boissons</strong> — bien construite, elle peut atteindre des marges brutes de 65 à 75 %.
          </p>

          {/* Table des matières */}
          <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 mb-10">
            <h2 className="text-base font-semibold text-[#111111] dark:text-white mb-3" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Au sommaire
            </h2>
            <ol className="space-y-2 text-teal-600 dark:text-teal-400 text-sm">
              <li><a href="#references" className="hover:underline">1. Combien de références mettre sur votre carte ?</a></li>
              <li><a href="#marge" className="hover:underline">2. Calculer la marge et fixer les prix</a></li>
              <li><a href="#selection" className="hover:underline">3. Sélectionner les bons vins et accords mets-vins</a></li>
              <li><a href="#rotation" className="hover:underline">4. Rotation de cave : éviter les stocks morts</a></li>
              <li><a href="#presentation" className="hover:underline">5. Présenter votre carte pour vendre plus</a></li>
            </ol>
          </div>

          {/* Section 1 */}
          <section id="references" className="mb-10">
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              1. Combien de références mettre sur votre carte des vins ?
            </h2>
            <p className="text-[#111111] dark:text-[#E5E5E5] mb-4">
              Une étude de Cornell University montre que <strong>les cartes de 20 à 40 références génèrent plus de ventes</strong> que les listes de 100 vins. Au-delà, le client est paralysé et commande la bouteille qu'il connaît déjà — souvent la moins rentable.
            </p>
            <p className="text-[#111111] dark:text-[#E5E5E5] mb-4">
              Bonnes proportions pour une carte de 25 références :
            </p>
            <ul className="list-disc pl-6 space-y-1 text-[#111111] dark:text-[#E5E5E5] mb-4">
              <li>40 % vins rouges (10 références)</li>
              <li>30 % vins blancs (8 références)</li>
              <li>15 % effervescents — champagne, crémant, pétillant (4 références)</li>
              <li>10 % vins rosés (2 références)</li>
              <li>5 % vins liquoreux, orange ou nature selon positionnement (1 référence)</li>
            </ul>
            <p className="text-[#111111] dark:text-[#E5E5E5]">
              Répartissez vos références en trois gammes de prix (entrée / milieu / premium), chaque tiers représentant environ un tiers de votre stock en valeur. Un bistrot de 30 couverts n'a pas besoin de plus de 20 références ; un gastronomique avec sommelier peut monter à 80-100.
            </p>
          </section>

          {/* Section 2 */}
          <section id="marge" className="mb-10">
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              2. Comment calculer la marge sur les vins et fixer les prix
            </h2>
            <p className="text-[#111111] dark:text-[#E5E5E5] mb-4">
              Le coefficient multiplicateur sur les vins va de <strong>3× à 5×</strong> le prix d'achat HT selon le positionnement.
            </p>
            <div className="bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800/30 rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] dark:text-[#E5E5E5]">
              Prix de vente TTC = Prix d'achat HT × Coefficient × 1,20 (TVA)
            </div>
            <p className="text-[#111111] dark:text-[#E5E5E5] mb-4">
              <strong>Exemple :</strong> Bouteille à 8 € HT × 3,5 = 28 € HT → 33,60 € TTC → marge brute <strong>71,4 %</strong>.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F5] dark:bg-[#1A1A1A]">
                    <th className="text-left p-3 text-[#111111] dark:text-white border border-[#E5E7EB] dark:border-[#262626]">Gamme</th>
                    <th className="text-left p-3 text-[#111111] dark:text-white border border-[#E5E7EB] dark:border-[#262626]">Prix achat HT</th>
                    <th className="text-left p-3 text-[#111111] dark:text-white border border-[#E5E7EB] dark:border-[#262626]">Coefficient</th>
                    <th className="text-left p-3 text-[#111111] dark:text-white border border-[#E5E7EB] dark:border-[#262626]">Prix vente TTC</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Entrée de gamme', '5-8 €', '4× à 5×', '24-48 €'],
                    ['Milieu de gamme', '10-18 €', '3× à 3,5×', '36-75 €'],
                    ['Premium', '20-50 €', '2,5× à 3×', '60-180 €'],
                    ['Très haute gamme', '50 €+', '2× à 2,5×', '120 €+'],
                  ].map(([gamme, achat, coeff, vente]) => (
                    <tr key={gamme} className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                      <td className="p-3 text-[#111111] dark:text-[#E5E5E5] border border-[#E5E7EB] dark:border-[#262626]">{gamme}</td>
                      <td className="p-3 text-[#737373] dark:text-[#A3A3A3] border border-[#E5E7EB] dark:border-[#262626]">{achat}</td>
                      <td className="p-3 text-[#737373] dark:text-[#A3A3A3] border border-[#E5E7EB] dark:border-[#262626]">{coeff}</td>
                      <td className="p-3 text-teal-600 dark:text-teal-400 font-medium border border-[#E5E7EB] dark:border-[#262626]">{vente}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[#111111] dark:text-[#E5E5E5]">
              Pour le <strong>vin au verre</strong>, appliquez un prix équivalent à 1/4 du prix de la bouteille (et non 1/5) pour compenser les 10-20 % de pertes liées à l'oxydation.
            </p>
          </section>

          {/* Section 3 */}
          <section id="selection" className="mb-10">
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              3. Sélectionner les bons vins et accords mets-vins
            </h2>
            <p className="text-[#111111] dark:text-[#E5E5E5] mb-4">
              Un vin qui reste en cave plus de 45 jours est un vin mal sélectionné. <strong>Chaque référence doit se vendre au minimum 2 fois par semaine</strong> pour un restaurant de 50 couverts en service du soir.
            </p>
            <p className="text-[#111111] dark:text-[#E5E5E5] mb-3">Les 4 critères de sélection :</p>
            <ul className="list-disc pl-6 space-y-2 text-[#111111] dark:text-[#E5E5E5] mb-4">
              <li><strong>Adéquation avec votre cuisine</strong> : un restaurant méditerranéen a besoin de blancs frais et de rouges du sud, pas de bordeaux tanniques.</li>
              <li><strong>Prix d'achat &lt; 15 % du ticket moyen hors boisson</strong> : si votre ticket moyen est 35 €, vos entrées de gamme ne doivent pas dépasser 5,25 € d'achat.</li>
              <li><strong>Fournisseur fiable</strong> : privilégiez les négociants garantissant 6 mois de stock pour éviter les ruptures.</li>
              <li><strong>Lisibilité pour le client</strong> : étiquettes claires, appellations connues ou cépages évidents (Chardonnay, Merlot, Syrah).</li>
            </ul>
            <p className="text-[#111111] dark:text-[#E5E5E5]">
              Formez votre équipe de salle à maîtriser <strong>5 accords clés</strong>. Un serveur capable de recommander "le Côtes-du-Rhône blanc avec le bar" augmente les ventes au verre de 15 à 20 % mécaniquement.
            </p>
          </section>

          {/* Section 4 */}
          <section id="rotation" className="mb-10">
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              4. Rotation de cave : éviter les stocks morts et optimiser le cash-flow
            </h2>
            <p className="text-[#111111] dark:text-[#E5E5E5] mb-4">
              Un restaurateur qui commande 200 bouteilles pour 2 mois immobilise souvent 2 000 à 4 000 € inutilement.
            </p>
            <div className="bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800/30 rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] dark:text-[#E5E5E5]">
              Taux de rotation = Ventes annuelles (valeur) ÷ Stock moyen (valeur)
            </div>
            <p className="text-[#111111] dark:text-[#E5E5E5] mb-4">
              Un bon taux se situe entre <strong>8× et 12× par an</strong>, soit 4 à 6 semaines de stock maximum. Méthode pour assainir votre cave :
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-[#111111] dark:text-[#E5E5E5] mb-4">
              <li>Listez toutes vos bouteilles avec leur date d'entrée en stock.</li>
              <li>Identifiez les références immobiles depuis 60 jours.</li>
              <li>Proposez-les en "sélection du sommelier" ou en accord avec le menu du jour.</li>
              <li>Ne recommandez jamais une référence lente sans écouler le stock existant.</li>
            </ol>
            <p className="text-[#111111] dark:text-[#E5E5E5]">
              Travaillez avec 2-3 fournisseurs maximum, négociez des délais de 48-72h et appliquez la règle FIFO : le vin le plus ancien est servi en premier. Marquez vos clayettes avec les dates d'entrée.
            </p>
          </section>

          {/* Section 5 */}
          <section id="presentation" className="mb-10">
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              5. Présenter votre carte des vins pour vendre plus
            </h2>
            <p className="text-[#111111] dark:text-[#E5E5E5] mb-4">
              La position d'un vin sur la carte influence jusqu'à <strong>30 % de la décision d'achat</strong> selon les études en neuromarketing restauration.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#111111] dark:text-[#E5E5E5] mb-4">
              <li><strong>Ne mettez jamais les prix en colonne</strong> : intégrez le prix dans la description pour que l'œil lise l'ensemble, pas uniquement le montant.</li>
              <li><strong>Mettez votre vin le plus rentable en deuxième position</strong> : 40 % des clients qui hésitent choisissent la deuxième option.</li>
              <li><strong>Descriptions courtes</strong> : 1-2 lignes. "Bordeaux charnu, notes de fruits rouges, idéal avec nos pièces de bœuf" suffit et vend mieux qu'une fiche de dégustation.</li>
              <li><strong>Encadré "Coup de cœur"</strong> : 3-4 vins à forte marge mis en avant font monter le prix moyen de la bouteille vendue.</li>
            </ul>
            <p className="text-[#111111] dark:text-[#E5E5E5]">
              Formez l'équipe de salle à la suggestion active : dès la commande des plats, recommander un vin peut augmenter le taux d'attachement boissons de <strong>15 points</strong>. L'idéal : carte courte sur papier + carte digitale complète via QR code.
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-6" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              FAQ — Carte des vins restaurant
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "Faut-il avoir une cave à vins physique pour un restaurant ?",
                  a: "Non, une cave physique est justifiée seulement au-delà de 80 références ou pour un positionnement gastronomique fort. Un cellier de service avec livraisons fréquentes suffit pour la plupart des restaurants."
                },
                {
                  q: "Peut-on vendre ses propres vins (domaine familial) au restaurant ?",
                  a: "Oui, avec la licence boissons appropriée (licence IV). Un vin maison crée un lien fort avec votre identité de marque et peut générer une marge supérieure à 70 %."
                },
                {
                  q: "Comment intégrer les vins bio et nature sur la carte ?",
                  a: "Réservez 15 à 20 % des références aux vins bio et nature. Leur valeur perçue plus élevée permet de maintenir le coefficient habituel malgré un prix d'achat légèrement supérieur."
                },
                {
                  q: "À quelle fréquence renouveler sa carte des vins ?",
                  a: "Revision complète 2 fois par an (avril et octobre, en lien avec les nouvelles sorties millésimes). Remplacez les références épuisées ou à faible rotation au fil de l'eau."
                }
              ].map(({ q, a }) => (
                <div key={q} className="border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-5">
                  <h3 className="font-semibold text-[#111111] dark:text-white mb-2">{q}</h3>
                  <p className="text-[#737373] dark:text-[#A3A3A3] text-sm">{a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-teal-600 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Optimisez toute la rentabilité de votre restaurant
            </h2>
            <p className="text-teal-100 mb-6">
              Calculez vos marges en temps réel, analysez vos ventes par catégorie et identifiez les produits qui tirent votre profit vers le bas — vins inclus.
            </p>
            <a
              href="https://www.restaumargin.fr/pricing"
              className="inline-block bg-white text-teal-700 font-semibold px-8 py-3 rounded-xl hover:bg-teal-50 transition-colors"
            >
              Essayer RestauMargin gratuitement
            </a>
          </section>

        </div>
      </main>
    </>
  );
}
