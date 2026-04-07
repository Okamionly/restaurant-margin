import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, ArrowRight, ArrowLeft, Clock, User, Target, TrendingDown, ShoppingCart, BarChart3, LineChart } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — 5 methodes pour reduire votre food cost de 15 %
   ═══════════════════════════════════════════════════════════════ */

export default function BlogFoodCost() {
  useEffect(() => {
    document.title = '5 methodes pour reduire votre food cost de 15 % | RestauMargin';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', 'Decouvrez 5 methodes eprouvees pour reduire votre food cost de 15 % sans sacrifier la qualite. Fiches techniques, negociation, gaspillage, menu engineering.');
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
            Guide pratique
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-slate-900 leading-tight mb-6" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
            5 methodes pour reduire votre food cost de 15 %
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
          Un food cost de 35 % au lieu de 30 % peut sembler anodin. Pourtant, pour un restaurant qui fait 500 000 EUR de chiffre d'affaires annuel, cette difference represente <strong>25 000 EUR de marge brute perdue</strong>. Chaque annee.
        </p>

        {/* ── Methode 1 ── */}
        <div className="flex items-center gap-3 mt-10 mb-4">
          <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5 text-teal-600" />
          </div>
          <h2 className="!mt-0 !mb-0">Methode 1 : Fiches techniques systematiques</h2>
        </div>
        <p>
          La fiche technique est le document de reference qui decrit chaque plat : ingredients, quantites exactes, cout unitaire, etapes. Sans elle, vous devinez vos couts. Et en restauration, on se trompe toujours dans le mauvais sens.
        </p>
        <p>
          <strong>Pourquoi ca marche :</strong> elles eliminent les approximations, garantissent la constance des portions, et permettent de calculer le vrai food cost plat par plat.
        </p>
        <p>
          <strong>Exemple :</strong> un cuisinier qui dose "a l'oeil" ajoute 10 a 15 % de matiere en plus. Sur 80 couverts par service, c'est 8 a 12 portions offertes gratuitement. Plus de <strong>8 000 EUR par an</strong> sur un seul plat.
        </p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 my-4 text-sm text-emerald-800">
          <strong>Impact :</strong> reduction de 5 a 8 % du food cost dans les 3 premiers mois.
        </div>

        {/* ── Methode 2 ── */}
        <div className="flex items-center gap-3 mt-10 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="!mt-0 !mb-0">Methode 2 : Negocier avec vos fournisseurs</h2>
        </div>
        <p>
          La negociation ne se resume pas a "vous pouvez faire un effort ?". C'est un travail structure : volumes exacts, prix du marche, historique, devis concurrents.
        </p>
        <p><strong>Les 7 leviers :</strong> volume garanti, regroupement de commandes, paiement anticipe, produits de saison, produits generiques, revision contractuelle annuelle, clause de prix indexe.</p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 my-4 text-sm text-blue-800">
          <strong>Impact :</strong> reduction de 3 a 7 % sur les couts d'achat.
        </div>

        {/* ── Methode 3 ── */}
        <div className="flex items-center gap-3 mt-10 mb-4">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingDown className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="!mt-0 !mb-0">Methode 3 : Reduire le gaspillage alimentaire</h2>
        </div>
        <p>
          Un restaurant gaspille en moyenne 14 % de ses achats. Sur 15 000 EUR/mois, c'est <strong>2 100 EUR a la poubelle</strong>. Les 4 sources : surproduction, portions trop genereuses, stockage defaillant, chutes non valorisees.
        </p>
        <p>
          <strong>Plan d'action en 4 semaines :</strong> poubelle de tri + pesee (S1), identifier les 5 produits les plus gaspilles (S2), ajuster commandes (S3), former l'equipe FIFO (S4).
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-4 text-sm text-amber-800">
          <strong>Impact :</strong> baisse directe du food cost de 2 a 4 points.
        </div>

        {/* ── Methode 4 ── */}
        <div className="flex items-center gap-3 mt-10 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="!mt-0 !mb-0">Methode 4 : Menu engineering (matrice BCG)</h2>
        </div>
        <p>
          Analysez chaque plat selon sa popularite et sa marge brute. Classez-les en Stars, Puzzles, Chevaux de labour et Poids morts. Puis agissez : promouvoir les Stars, augmenter le prix des Chevaux, retirer les Poids morts.
        </p>
        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Categorie</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Popularite</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Marge</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Star','Haute','Haute','Maintenir, mettre en avant'],
                ['Puzzle','Basse','Haute','Promouvoir, repositionner'],
                ['Cheval de labour','Haute','Basse','Optimiser le cout matiere'],
                ['Poids mort','Basse','Basse','Reformuler ou retirer'],
              ].map(([cat, pop, marge, action]) => (
                <tr key={cat} className="border-t border-slate-100">
                  <td className="px-4 py-2.5 font-medium text-slate-900">{cat}</td>
                  <td className="px-4 py-2.5 text-slate-700">{pop}</td>
                  <td className="px-4 py-2.5 text-slate-700">{marge}</td>
                  <td className="px-4 py-2.5 text-slate-500">{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 my-4 text-sm text-purple-800">
          <strong>Impact :</strong> gain de 2 a 5 points de food cost par l'effet de mix.
        </div>

        {/* ── Methode 5 ── */}
        <div className="flex items-center gap-3 mt-10 mb-4">
          <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <LineChart className="w-5 h-5 text-rose-600" />
          </div>
          <h2 className="!mt-0 !mb-0">Methode 5 : Mercuriale (suivi des prix du marche)</h2>
        </div>
        <p>
          Une mercuriale est un releve regulier des prix fournisseurs. Le beurre a varie de 4 a 7 EUR/kg en deux ans. Le saumon peut doubler entre l'ete et les fetes. Sans mercuriale, vous subissez ces variations.
        </p>
        <p>
          <strong>Methode :</strong> identifiez vos 20 ingredients les plus chers (en valeur), collectez les prix chaque semaine, construisez un historique, ajustez vos achats (achats d'opportunite, substitution saisonniere, revision de carte).
        </p>
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 my-4 text-sm text-rose-800">
          <strong>Impact :</strong> economie de 2 a 5 % sur les achats annuels.
        </div>

        {/* ── Recap ── */}
        <h2>Combien representent ces 15 % ?</h2>
        <p>Pour un restaurant a 500 000 EUR HT/an avec un food cost de 33 % :</p>
        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Methode</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Reduction</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Economies/an</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Fiches techniques','-5 a -8 %','8 250 - 13 200 EUR'],
                ['Negociation fournisseurs','-3 a -7 %','4 950 - 11 550 EUR'],
                ['Reduction gaspillage','-2 a -4 %','3 300 - 6 600 EUR'],
                ['Menu engineering','-2 a -5 %','3 300 - 8 250 EUR'],
                ['Mercuriale','-2 a -5 %','3 300 - 8 250 EUR'],
              ].map(([m, r, e]) => (
                <tr key={m} className="border-t border-slate-100">
                  <td className="px-4 py-2.5 font-medium text-slate-900">{m}</td>
                  <td className="px-4 py-2.5 text-slate-700">{r}</td>
                  <td className="px-4 py-2.5 text-slate-700">{e}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-300 bg-teal-50">
                <td className="px-4 py-2.5 font-bold text-slate-900">Total cumule</td>
                <td className="px-4 py-2.5 font-bold text-teal-700">-14 a -29 %</td>
                <td className="px-4 py-2.5 font-bold text-teal-700">~24 750 EUR</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Plan d'action ── */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-8">
          <h3 className="text-base font-bold text-slate-900 mb-3">Votre plan d'action en 5 etapes</h3>
          <ol className="space-y-1.5 text-sm text-slate-700">
            <li>1. <strong>Semaine 1-2 :</strong> Creez les fiches techniques de vos 10 plats les plus vendus.</li>
            <li>2. <strong>Semaine 3 :</strong> Demandez des devis a 2 fournisseurs alternatifs.</li>
            <li>3. <strong>Semaine 4 :</strong> Systeme de pesee des dechets + top 5 des produits gaspilles.</li>
            <li>4. <strong>Mois 2 :</strong> Premiere analyse menu engineering et ajustement de carte.</li>
            <li>5. <strong>En continu :</strong> Suivi mercuriale hebdomadaire de vos ingredients cles.</li>
          </ol>
        </div>
      </article>

      {/* ── CTA ── */}
      <section className="bg-teal-50 py-14 px-4 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
            Automatisez ces 5 methodes avec RestauMargin
          </h2>
          <p className="text-slate-600 mb-6">
            Fiches techniques, menu engineering, mercuriale, alertes : tout est integre dans un seul outil.
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
