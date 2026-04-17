import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Calculator, ArrowRight, ArrowLeft, Clock, User } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — Coefficient multiplicateur restaurant
   ═══════════════════════════════════════════════════════════════ */

export default function BlogCoefficient() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead title="Le coefficient multiplicateur en restauration : guide complet" description="Comprendre et appliquer le coefficient multiplicateur pour fixer vos prix de vente en restaurant. Formules, exemples et erreurs a eviter." path="/blog/coefficient-multiplicateur" type="article" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Le coefficient multiplicateur en restauration : guide complet",
            "datePublished": "2026-04-14",
            "dateModified": "2026-04-14",
            "author": {
              "@type": "Organization",
              "name": "La rédaction RestauMargin",
              "url": "https://www.restaumargin.fr/a-propos"
            },
            "publisher": {
              "@type": "Organization",
              "name": "RestauMargin",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.restaumargin.fr/icon-512.png"
              }
            },
            "image": "https://www.restaumargin.fr/og-image.png",
            "inLanguage": "fr-FR"
          })
        }}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-[#111111] font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-[#525252] hover:text-teal-600 transition-colors">Connexion</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="bg-gradient-to-b from-teal-50 to-white pt-16 pb-12 px-4">
        <div className="max-w-[720px] mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 text-teal-700 bg-teal-100 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            Guide complet
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#111111] leading-tight mb-6" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
            Comment calculer le coefficient multiplicateur de vos plats
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-[#737373]">
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> RestauMargin</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 12 min de lecture</span>
          </div>
        </div>
      </header>

      {/* ── Article ── */}
      <article className="max-w-[720px] mx-auto px-4 sm:px-6 py-12 prose-article">

        <BlogAuthor publishedDate="2026-04-14" readTime="8 min" variant="header" />

        <p className="text-lg text-[#525252] leading-relaxed mb-8">
          Fixer le prix de vente de vos plats au hasard est la premiere cause de faillite en restauration. En France, un restaurant sur deux ferme dans les trois premieres annees. Le point commun de ceux qui survivent ? Ils maitrisent leur coefficient multiplicateur.
        </p>

        <h2>Qu'est-ce que le coefficient multiplicateur en restauration ?</h2>
        <p>
          Le coefficient multiplicateur est un chiffre que vous appliquez au cout matiere de votre plat pour obtenir son prix de vente hors taxes. C'est la methode la plus directe pour passer du cout de vos ingredients a un prix qui couvre vos charges et degage un benefice.
        </p>

        <h3>La formule de base</h3>
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 my-6">
          <p className="text-center text-lg font-bold text-teal-800 mb-2">Prix de vente HT = Cout matiere x Coefficient multiplicateur</p>
          <p className="text-center text-sm text-teal-600">Exemple : 3,50 EUR x 3,5 = 12,25 EUR HT &rarr; 13,48 EUR TTC &rarr; 13,50 EUR sur la carte</p>
        </div>

        <h3>La relation entre coefficient et food cost</h3>
        <p>Le coefficient multiplicateur et le food cost sont inversement lies :</p>
        <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-5 my-6">
          <p className="text-center text-lg font-bold text-[#262626]">Coefficient = 1 / Food cost</p>
        </div>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAFAFA]">
                <th className="text-left px-4 py-2.5 font-semibold text-[#525252]">Food cost cible</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#525252]">Coefficient multiplicateur</th>
              </tr>
            </thead>
            <tbody>
              {[['20 %','5,00'],['25 %','4,00'],['28 %','3,57'],['30 %','3,33'],['33 %','3,03'],['35 %','2,86']].map(([fc, coef]) => (
                <tr key={fc} className="border-t border-[#F5F5F5]">
                  <td className="px-4 py-2.5 text-[#404040]">{fc}</td>
                  <td className="px-4 py-2.5 font-semibold text-[#111111]">{coef}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Les coefficients par categorie de plat</h2>
        <p>Tous les plats ne meritent pas le meme coefficient. Voici les coefficients recommandes par la profession :</p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAFAFA]">
                <th className="text-left px-4 py-2.5 font-semibold text-[#525252]">Categorie</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#525252]">Coefficient</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#525252]">Food cost</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Amuse-bouche','x 5,0 a 6,0','17-20 %'],
                ['Entrees froides','x 3,0 a 3,5','29-33 %'],
                ['Entrees chaudes','x 3,5 a 4,0','25-29 %'],
                ['Plats poisson','x 3,0 a 3,5','29-33 %'],
                ['Plats viande','x 3,5 a 4,0','25-29 %'],
                ['Plats vegetariens','x 4,0 a 5,0','20-25 %'],
                ['Desserts','x 4,0 a 5,0','20-25 %'],
                ['Boissons chaudes','x 8,0 a 12,0','8-13 %'],
                ['Cocktails','x 4,0 a 6,0','17-25 %'],
                ['Vins au verre','x 3,0 a 4,0','25-33 %'],
                ['Vins en bouteille','x 2,5 a 3,5','29-40 %'],
              ].map(([cat, coef, fc]) => (
                <tr key={cat} className="border-t border-[#F5F5F5]">
                  <td className="px-4 py-2.5 font-medium text-[#111111]">{cat}</td>
                  <td className="px-4 py-2.5 text-[#404040]">{coef}</td>
                  <td className="px-4 py-2.5 text-[#737373]">{fc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Exemples concrets</h2>

        <h3>Veloute de butternut</h3>
        <p>Cout matiere : 1,75 EUR &times; coefficient 3,5 = <strong>6,13 EUR HT</strong> &rarr; prix carte : <strong>7,00 EUR</strong></p>

        <h3>Filet de bar, risotto aux petits legumes</h3>
        <p>Cout matiere : 5,80 EUR &times; coefficient 3,2 = <strong>18,56 EUR HT</strong> &rarr; prix carte : <strong>20,50 EUR</strong></p>

        <h3>Creme brulee a la vanille</h3>
        <p>Cout matiere : 1,20 EUR &times; coefficient 4,5 = <strong>5,40 EUR HT</strong> &rarr; prix carte : <strong>6,00 EUR</strong></p>

        <h2>Les 6 erreurs courantes qui detruisent vos marges</h2>

        <ol className="space-y-4">
          <li><strong>Appliquer un coefficient unique a toute la carte.</strong> Adaptez par categorie et par plat selon la valeur percue.</li>
          <li><strong>Oublier les pertes et dechets.</strong> Utilisez toujours le cout matiere net (apres rendement).</li>
          <li><strong>Ignorer la volatilite des prix fournisseurs.</strong> Revisez vos fiches techniques au minimum chaque trimestre.</li>
          <li><strong>Ne pas tenir compte de la TVA.</strong> Calculez en HT, puis ajoutez la TVA.</li>
          <li><strong>Se focaliser sur le coefficient sans regarder la marge en euros.</strong> Analysez en combinant coefficient, marge et popularite.</li>
          <li><strong>Copier les prix de la concurrence.</strong> Partez toujours de VOS couts reels.</li>
        </ol>

        <h2>Coefficient et menu engineering : le duo gagnant</h2>
        <p>
          Le coefficient seul ne suffit pas. Combine avec le menu engineering (matrice BCG), il permet de classer vos plats en Stars, Puzzles, Chevaux de labour et Poids morts, puis d'agir sur chaque categorie pour maximiser votre marge globale.
        </p>

        <h2>Cas pratique : menu complet a 35 EUR</h2>
        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAFAFA]">
                <th className="text-left px-4 py-2.5 font-semibold text-[#525252]">Element</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#525252]">Budget matiere</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#525252]">Coefficient</th>
              </tr>
            </thead>
            <tbody>
              {[['Entree','2,00 EUR','x 3,5'],['Plat principal','5,50 EUR','x 3,0'],['Dessert','1,41 EUR','x 5,9'],['Total','8,91 EUR','x 3,57 (moyen)']].map(([el, budget, coef]) => (
                <tr key={el} className="border-t border-[#F5F5F5]">
                  <td className={`px-4 py-2.5 ${el === 'Total' ? 'font-bold' : 'font-medium'} text-[#111111]`}>{el}</td>
                  <td className="px-4 py-2.5 text-[#404040]">{budget}</td>
                  <td className="px-4 py-2.5 text-[#404040]">{coef}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Avec un coefficient optimise par categorie plutot qu'un coefficient uniforme de 3, la difference est de <strong>2 316 EUR de marge brute en plus chaque mois</strong>, soit <strong>27 792 EUR par an</strong>.
        </p>

        <h2>Automatisez vos calculs avec RestauMargin</h2>
        <p>
          RestauMargin calcule automatiquement le coefficient et le food cost de chaque plat, vous alerte quand les prix fournisseurs changent, et genere votre matrice de menu engineering en temps reel. Plus besoin d'Excel.
        </p>

        {/* ── Benchmarks par type de cuisine ── */}
        <h2>Coefficients recommandes par type de cuisine</h2>
        <p>Le coefficient multiplicateur varie aussi selon le type de cuisine. Voici les fourchettes constatees en France en 2026 :</p>
        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAFAFA]">
                <th className="text-left px-4 py-2.5 font-semibold text-[#525252]">Type de cuisine</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#525252]">Coefficient moyen</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#525252]">Food cost resultant</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#525252]">Pourquoi</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Pizzeria','x 4,0 a 5,0','20-25 %','Ingredients de base tres peu couteux'],
                ['Creperie','x 4,5 a 6,0','17-22 %','Farine, oeufs, lait : cout minimal'],
                ['Cuisine asiatique','x 3,5 a 4,5','22-29 %','Riz, nouilles, legumes accessibles'],
                ['Cuisine italienne','x 3,0 a 4,0','25-33 %','Pates peu couteuses, fromages plus chers'],
                ['Bistrot francais','x 3,0 a 3,5','29-33 %','Produits de marche, viandes'],
                ['Cuisine de la mer','x 2,8 a 3,5','29-36 %','Poissons et fruits de mer couteux'],
                ['Gastronomique','x 2,5 a 3,3','30-40 %','Produits premium, travail technique'],
                ['Burger gourmet','x 3,5 a 4,5','22-29 %','Cout viande modere, vente additionnelle'],
                ['Cuisine vegetarienne','x 4,0 a 5,0','20-25 %','Legumes, legumineuses accessibles'],
                ['Sushi / Japonais','x 3,0 a 4,0','25-33 %','Poisson cru de qualite, riz peu couteux'],
              ].map(([type, coef, fc, why]) => (
                <tr key={type} className="border-t border-[#F5F5F5]">
                  <td className="px-4 py-2.5 font-medium text-[#111111]">{type}</td>
                  <td className="px-4 py-2.5 text-teal-700 font-semibold">{coef}</td>
                  <td className="px-4 py-2.5 text-[#404040]">{fc}</td>
                  <td className="px-4 py-2.5 text-[#737373] text-xs">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Table des coefficients de 1.5x a 5.0x ── */}
        <h2>Table de conversion : coefficient, food cost et marge brute</h2>
        <p>Ce tableau de reference vous permet de convertir instantanement entre coefficient multiplicateur, food cost et marge brute :</p>
        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAFAFA]">
                <th className="text-left px-3 py-2.5 font-semibold text-[#525252]">Coefficient</th>
                <th className="text-left px-3 py-2.5 font-semibold text-[#525252]">Food cost</th>
                <th className="text-left px-3 py-2.5 font-semibold text-[#525252]">Marge brute</th>
                <th className="text-left px-3 py-2.5 font-semibold text-[#525252]">Exemple (cout 5 EUR)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['x 1,5','66,7 %','33,3 %','7,50 EUR'],
                ['x 2,0','50,0 %','50,0 %','10,00 EUR'],
                ['x 2,5','40,0 %','60,0 %','12,50 EUR'],
                ['x 3,0','33,3 %','66,7 %','15,00 EUR'],
                ['x 3,33','30,0 %','70,0 %','16,65 EUR'],
                ['x 3,5','28,6 %','71,4 %','17,50 EUR'],
                ['x 4,0','25,0 %','75,0 %','20,00 EUR'],
                ['x 4,5','22,2 %','77,8 %','22,50 EUR'],
                ['x 5,0','20,0 %','80,0 %','25,00 EUR'],
              ].map(([coef, fc, mb, ex]) => (
                <tr key={coef} className="border-t border-[#F5F5F5]">
                  <td className="px-3 py-2.5 font-bold text-teal-700">{coef}</td>
                  <td className="px-3 py-2.5 text-[#404040]">{fc}</td>
                  <td className="px-3 py-2.5 text-[#404040]">{mb}</td>
                  <td className="px-3 py-2.5 text-[#737373]">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── CTA intermediaire ── */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 my-8 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Calculez vos coefficients automatiquement</h3>
          <p className="text-teal-100 text-sm mb-4">Creez un compte gratuit et obtenez le coefficient, le food cost et la marge de chaque plat en temps reel.</p>
          <Link
            to="/login?mode=register"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-colors text-sm"
          >
            Creer mon compte gratuit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Points cles ── */}
        <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-6 my-8">
          <h3 className="text-base font-bold text-[#111111] mb-3">Points cles a retenir</h3>
          <ol className="space-y-1.5 text-sm text-[#404040]">
            <li>1. Le coefficient convertit le cout matiere en prix de vente HT.</li>
            <li>2. N'appliquez jamais un coefficient unique a toute la carte.</li>
            <li>3. Les desserts et boissons meritent les coefficients les plus eleves.</li>
            <li>4. Calculez a partir du cout matiere net (apres rendement).</li>
            <li>5. Revisez vos coefficients au minimum chaque trimestre.</li>
            <li>6. Combinez avec le menu engineering pour maximiser vos marges.</li>
          </ol>
        </div>

        {/* ── Articles complementaires ── */}
        <h2>Articles complementaires</h2>
        <div className="grid sm:grid-cols-3 gap-4 my-6">
          <Link to="/blog/calcul-marge-restaurant" className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-4 hover:border-teal-300 hover:shadow-sm transition-all group">
            <h3 className="text-sm font-bold text-[#111111] mb-1 group-hover:text-teal-700 transition-colors !mt-0">Calcul de marge restaurant : guide 2026</h3>
            <p className="text-xs text-[#737373] !mb-0">Marge brute, marge nette, food cost — toutes les formules.</p>
          </Link>
          <Link to="/blog/reduire-food-cost" className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-4 hover:border-teal-300 hover:shadow-sm transition-all group">
            <h3 className="text-sm font-bold text-[#111111] mb-1 group-hover:text-teal-700 transition-colors !mt-0">5 methodes pour reduire le food cost de 15 %</h3>
            <p className="text-xs text-[#737373] !mb-0">Fiches techniques, negociation, gaspillage.</p>
          </Link>
          <Link to="/blog/ia-restauration" className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-4 hover:border-teal-300 hover:shadow-sm transition-all group">
            <h3 className="text-sm font-bold text-[#111111] mb-1 group-hover:text-teal-700 transition-colors !mt-0">L'IA en restauration</h3>
            <p className="text-xs text-[#737373] !mb-0">Scanner de factures, fiches techniques vocales, alertes.</p>
          </Link>
        </div>

        {/* ── FAQ ── */}
        <h2>Questions frequentes sur le coefficient multiplicateur</h2>
        <div className="space-y-3 my-6">
          {[
            { q: 'Qu\'est-ce que le coefficient multiplicateur en restauration ?', a: 'C\'est un chiffre que vous multipliez par le cout matiere de votre plat pour obtenir le prix de vente HT. Par exemple, un cout de 4 EUR x coefficient 3,5 = 14 EUR HT. C\'est la methode la plus directe pour fixer vos prix en partant de vos couts reels.' },
            { q: 'Comment calculer le coefficient multiplicateur ?', a: 'Deux methodes : 1) A partir du food cost cible : Coefficient = 1 / Food cost. Pour un food cost de 30 %, coefficient = 1/0,30 = 3,33. 2) A partir des donnees reelles : Coefficient = Prix de vente HT / Cout matiere.' },
            { q: 'Quel est le coefficient multiplicateur moyen en restauration ?', a: 'Le coefficient moyen en restauration traditionnelle se situe entre 3,0 et 3,5, soit un food cost de 29 a 33 %. Mais il varie enormement par categorie : x 4-5 pour les desserts, x 8-12 pour les boissons chaudes, x 2,5-3,5 pour les vins.' },
            { q: 'Pourquoi ne pas appliquer un coefficient unique a toute la carte ?', a: 'Chaque categorie de plat a une valeur percue differente. Les boissons chaudes (cafe, the) ont des couts tres bas et acceptent des coefficients de x 8 a x 12. Les plats de poisson, plus chers, necessitent des coefficients plus faibles (x 3,0) pour rester dans les prix du marche. Un coefficient unique produirait des prix aberrants.' },
            { q: 'Coefficient multiplicateur : avec ou sans TVA ?', a: 'Le coefficient s\'applique au cout matiere HT pour donner un prix de vente HT. La TVA est ajoutee ensuite. En France, la TVA sur la restauration sur place est de 10 %. Si votre calcul donne 15,00 EUR HT, le prix TTC sera 16,50 EUR (arrondi a 16,50 EUR sur la carte).' },
            { q: 'Comment optimiser son coefficient multiplicateur ?', a: 'Trois strategies : 1) Augmenter la valeur percue du plat (presentation, garniture, storytelling menu) pour justifier un prix plus eleve. 2) Reduire le cout matiere en negociant fournisseurs ou en optimisant les rendements. 3) Utiliser le menu engineering pour promouvoir les plats a fort coefficient.' },
          ].map((item) => (
            <details key={item.q} className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl group">
              <summary className="px-5 py-4 font-semibold text-[#111111] cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors text-sm">
                {item.q}
                <ArrowRight className="w-4 h-4 text-[#A3A3A3] group-open:rotate-90 transition-transform flex-shrink-0 ml-2" />
              </summary>
              <p className="px-5 pb-4 text-sm text-[#525252] leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
        <BlogAuthor publishedDate="2026-04-14" readTime="8 min" variant="footer" />
      </article>

      {/* ── CTA ── */}
      <section className="bg-teal-50 py-14 px-4 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-[#111111] mb-3" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
            Calculez vos coefficients en 5 minutes
          </h2>
          <p className="text-[#525252] mb-6">
            Testez RestauMargin gratuitement et voyez la marge reelle de chacun de vos plats.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-7 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors"
          >
            Essayer gratuitement
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#E5E7EB] py-8 px-4">
        <div className="max-w-[720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#A3A3A3]">
          <Link to="/landing" className="flex items-center gap-1.5 hover:text-teal-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour a l'accueil
          </Link>
          <p>&copy; {new Date().getFullYear()} RestauMargin</p>
        </div>
      </footer>

      {/* ── JSON-LD Article Schema ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Comment calculer le coefficient multiplicateur de vos plats',
            description: 'Apprenez a calculer le coefficient multiplicateur en restauration pour fixer vos prix de vente et maximiser vos marges. Guide complet avec exemples.',
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-03-20',
            dateModified: '2026-04-08',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/coefficient-multiplicateur' },
          }),
        }}
      />
      {/* ── JSON-LD FAQ Schema ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: "Qu'est-ce que le coefficient multiplicateur en restauration ?",
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "C'est un chiffre que vous multipliez par le cout matiere de votre plat pour obtenir le prix de vente HT. Exemple : cout 4 EUR x coefficient 3,5 = 14 EUR HT.",
                },
              },
              {
                '@type': 'Question',
                name: 'Comment calculer le coefficient multiplicateur ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Coefficient = 1 / Food cost cible. Pour un food cost de 30 %, coefficient = 3,33. Ou bien : Coefficient = Prix de vente HT / Cout matiere.',
                },
              },
              {
                '@type': 'Question',
                name: 'Quel est le coefficient multiplicateur moyen en restauration ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Entre 3,0 et 3,5 en restauration traditionnelle (food cost 29-33 %). Desserts : x 4-5. Boissons chaudes : x 8-12. Vins : x 2,5-3,5.',
                },
              },
              {
                '@type': 'Question',
                name: 'Pourquoi ne pas appliquer un coefficient unique a toute la carte ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Chaque categorie a une valeur percue differente. Un coefficient unique produirait des prix aberrants (boissons trop bon marche, poissons trop chers).',
                },
              },
              {
                '@type': 'Question',
                name: 'Coefficient multiplicateur : avec ou sans TVA ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "Le coefficient s'applique au cout matiere HT pour donner un prix de vente HT. La TVA (10 % en restauration sur place) est ajoutee ensuite.",
                },
              },
              {
                '@type': 'Question',
                name: 'Comment optimiser son coefficient multiplicateur ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Augmenter la valeur percue (presentation, storytelling), reduire le cout matiere (negociation, rendements), utiliser le menu engineering.',
                },
              },
            ],
          }),
        }}
      />

      {/* ── Inline styles for article prose ── */}
      <style>{`
        .prose-article h2 {
          font-family: 'Satoshi', 'Inter', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        .prose-article h3 {
          font-family: 'Satoshi', 'Inter', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #1e293b;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
        }
        .prose-article p {
          color: #475569;
          line-height: 1.75;
          margin-bottom: 1rem;
        }
        .prose-article ol, .prose-article ul {
          color: #475569;
          line-height: 1.75;
          padding-left: 1.25rem;
        }
        .prose-article strong {
          color: #0f172a;
        }
        .prose-article table {
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          overflow: hidden;
          width: 100%;
        }
        .prose-article th, .prose-article td {
          border-bottom: 1px solid #f1f5f9;
        }
      `}</style>
    </div>
  );
}
