import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Calculator, ArrowRight, ArrowLeft, Clock, User } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — Coefficient multiplicateur restaurant
   ═══════════════════════════════════════════════════════════════ */

export default function BlogCoefficient() {
  useEffect(() => {
    document.title = 'Comment calculer le coefficient multiplicateur de vos plats | RestauMargin';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', 'Apprenez a calculer le coefficient multiplicateur en restauration pour fixer vos prix de vente et maximiser vos marges. Guide complet avec exemples.');
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-slate-900 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Connexion</Link>
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
          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-slate-900 leading-tight mb-6" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
            Comment calculer le coefficient multiplicateur de vos plats
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> RestauMargin</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 12 min de lecture</span>
          </div>
        </div>
      </header>

      {/* ── Article ── */}
      <article className="max-w-[720px] mx-auto px-4 sm:px-6 py-12 prose-article">

        <p className="text-lg text-slate-600 leading-relaxed mb-8">
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
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 my-6">
          <p className="text-center text-lg font-bold text-slate-800">Coefficient = 1 / Food cost</p>
        </div>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Food cost cible</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Coefficient multiplicateur</th>
              </tr>
            </thead>
            <tbody>
              {[['20 %','5,00'],['25 %','4,00'],['28 %','3,57'],['30 %','3,33'],['33 %','3,03'],['35 %','2,86']].map(([fc, coef]) => (
                <tr key={fc} className="border-t border-slate-100">
                  <td className="px-4 py-2.5 text-slate-700">{fc}</td>
                  <td className="px-4 py-2.5 font-semibold text-slate-900">{coef}</td>
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
              <tr className="bg-slate-50">
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Categorie</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Coefficient</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Food cost</th>
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
                <tr key={cat} className="border-t border-slate-100">
                  <td className="px-4 py-2.5 font-medium text-slate-900">{cat}</td>
                  <td className="px-4 py-2.5 text-slate-700">{coef}</td>
                  <td className="px-4 py-2.5 text-slate-500">{fc}</td>
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
              <tr className="bg-slate-50">
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Element</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Budget matiere</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Coefficient</th>
              </tr>
            </thead>
            <tbody>
              {[['Entree','2,00 EUR','x 3,5'],['Plat principal','5,50 EUR','x 3,0'],['Dessert','1,41 EUR','x 5,9'],['Total','8,91 EUR','x 3,57 (moyen)']].map(([el, budget, coef]) => (
                <tr key={el} className="border-t border-slate-100">
                  <td className={`px-4 py-2.5 ${el === 'Total' ? 'font-bold' : 'font-medium'} text-slate-900`}>{el}</td>
                  <td className="px-4 py-2.5 text-slate-700">{budget}</td>
                  <td className="px-4 py-2.5 text-slate-700">{coef}</td>
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

        {/* ── Points cles ── */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-8">
          <h3 className="text-base font-bold text-slate-900 mb-3">Points cles a retenir</h3>
          <ol className="space-y-1.5 text-sm text-slate-700">
            <li>1. Le coefficient convertit le cout matiere en prix de vente HT.</li>
            <li>2. N'appliquez jamais un coefficient unique a toute la carte.</li>
            <li>3. Les desserts et boissons meritent les coefficients les plus eleves.</li>
            <li>4. Calculez a partir du cout matiere net (apres rendement).</li>
            <li>5. Revisez vos coefficients au minimum chaque trimestre.</li>
            <li>6. Combinez avec le menu engineering pour maximiser vos marges.</li>
          </ol>
        </div>
      </article>

      {/* ── CTA ── */}
      <section className="bg-teal-50 py-14 px-4 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
            Calculez vos coefficients en 5 minutes
          </h2>
          <p className="text-slate-600 mb-6">
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
      <footer className="border-t border-slate-200 py-8 px-4">
        <div className="max-w-[720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <Link to="/landing" className="flex items-center gap-1.5 hover:text-teal-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour a l'accueil
          </Link>
          <p>&copy; {new Date().getFullYear()} RestauMargin</p>
        </div>
      </footer>

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
