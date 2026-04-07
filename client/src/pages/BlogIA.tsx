import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, ArrowRight, ArrowLeft, Clock, User, Scan, Mic, AlertTriangle, BarChart3, ShoppingCart, DollarSign, Heart, Sparkles, ShieldAlert } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — L'IA en restauration : gadget ou revolution ?
   ═══════════════════════════════════════════════════════════════ */

export default function BlogIA() {
  useEffect(() => {
    document.title = "L'IA en restauration : gadget ou revolution ? | RestauMargin";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', "Intelligence artificielle en restauration : decouvrez ce que l'IA peut vraiment faire pour votre restaurant et ce qu'elle ne remplacera jamais.");
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
            Innovation
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-slate-900 leading-tight mb-6" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
            L'IA en restauration : gadget ou revolution ?
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> RestauMargin</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 10 min de lecture</span>
          </div>
        </div>
      </header>

      {/* ── Article ── */}
      <article className="max-w-[720px] mx-auto px-4 sm:px-6 py-12 prose-article">

        <p className="text-lg text-slate-600 leading-relaxed mb-8">
          L'intelligence artificielle est partout. Mais dans votre cuisine ? Derriere vos fourneaux ? Cet article fait le tri entre les promesses marketing et la realite du terrain.
        </p>

        <h2>Ce que l'IA peut faire en restauration (et fait deja)</h2>

        {/* 1 */}
        <div className="flex items-start gap-3 mt-8 mb-3">
          <div className="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <Scan className="w-4.5 h-4.5 text-teal-600" />
          </div>
          <h3 className="!mt-0 !mb-0">1. Scanner vos factures automatiquement</h3>
        </div>
        <p>
          Prenez une photo de la facture. En quelques secondes, l'IA extrait le fournisseur, chaque ligne de produit, les quantites, les prix unitaires. Une tache de 3 heures/semaine se fait en 10 minutes.
        </p>

        {/* 2 */}
        <div className="flex items-start gap-3 mt-8 mb-3">
          <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <Mic className="w-4.5 h-4.5 text-blue-600" />
          </div>
          <h3 className="!mt-0 !mb-0">2. Creer des fiches techniques a la voix</h3>
        </div>
        <p>
          Dictez votre recette en cuisine. L'IA transcrit, identifie chaque ingredient, recupere le prix fournisseur, calcule le food cost. Fiche technique creee en 30 secondes.
        </p>

        {/* 3 */}
        <div className="flex items-start gap-3 mt-8 mb-3">
          <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />
          </div>
          <h3 className="!mt-0 !mb-0">3. Detecter les anomalies dans vos achats</h3>
        </div>
        <p>
          L'IA croise ventes, fiches techniques et achats pour identifier : ingredient dont le prix a grimpe, plat sur-portionne, achats inhabituels, tendances saisonnieres. Alerte en temps reel au lieu de la decouverte en fin de mois.
        </p>

        {/* 4 */}
        <div className="flex items-start gap-3 mt-8 mb-3">
          <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <BarChart3 className="w-4.5 h-4.5 text-purple-600" />
          </div>
          <h3 className="!mt-0 !mb-0">4. Menu engineering automatise</h3>
        </div>
        <p>
          Collecte automatique des donnees de vente, croisement avec le cout matiere, classement BCG (Star, Puzzle, Cheval de labour, Poids mort) et recommandations concretes. Une analyse qui prenait une demi-journee est disponible en permanence.
        </p>

        {/* 5 */}
        <div className="flex items-start gap-3 mt-8 mb-3">
          <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShoppingCart className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <h3 className="!mt-0 !mb-0">5. Prevoir la demande</h3>
        </div>
        <p>
          En analysant historiques de vente, meteo, evenements locaux et vacances, l'IA prevoit les couverts et genere une suggestion de commande fournisseur. Reduction du gaspillage de 20 a 30 %.
        </p>

        {/* 6 */}
        <div className="flex items-start gap-3 mt-8 mb-3">
          <div className="w-9 h-9 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <DollarSign className="w-4.5 h-4.5 text-rose-600" />
          </div>
          <h3 className="!mt-0 !mb-0">6. Suggerer des prix de vente optimaux</h3>
        </div>
        <p>
          Analyse de votre carte, des prix de votre zone, du cout matiere et de la sensibilite prix de vos clients pour une fourchette de prix fondee sur des donnees.
        </p>

        {/* ── Ce que l'IA ne remplace PAS ── */}
        <h2>Ce que l'IA ne remplace PAS (et ne remplacera jamais)</h2>

        <div className="grid sm:grid-cols-2 gap-4 my-6">
          {[
            { icon: <Heart className="w-5 h-5 text-rose-500" />, title: 'Le gout et la sensibilite culinaire', desc: "L'IA ne peut pas gouter une sauce ou imaginer des associations de saveurs." },
            { icon: <Sparkles className="w-5 h-5 text-purple-500" />, title: "La creativite et l'identite", desc: "Ce qui fait la difference, c'est la personnalite du chef, pas le food cost." },
            { icon: <User className="w-5 h-5 text-blue-500" />, title: "Le contact humain", desc: "Un sourire, une recommandation personnalisee : l'hospitalite est humaine." },
            { icon: <ShieldAlert className="w-5 h-5 text-amber-500" />, title: "La gestion d'equipe", desc: "Manager une brigade, gerer un coup de feu : competences irreductiblement humaines." },
          ].map((item) => (
            <div key={item.title} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                {item.icon}
                <h3 className="text-sm font-bold text-slate-900 !mt-0 !mb-0">{item.title}</h3>
              </div>
              <p className="text-sm text-slate-500 !mb-0">{item.desc}</p>
            </div>
          ))}
        </div>

        <p>
          L'IA doit etre <strong>invisible pour le client</strong>. Elle travaille en coulisses pour que le restaurateur ait plus de temps, plus de marge et plus de serenite.
        </p>

        {/* ── Fausses promesses ── */}
        <h2>Les fausses promesses a eviter</h2>
        <ul className="space-y-3">
          <li><strong>"L'IA va remplacer vos cuisiniers"</strong> — Non. Les robots ne remplacent pas le savoir-faire d'un cuisinier.</li>
          <li><strong>"Notre algorithme garantit +30 % de CA"</strong> — Aucun outil ne peut garantir cela. Les resultats dependent de vous.</li>
          <li><strong>"Tout est automatique"</strong> — L'IA a besoin de donnees. Elle amplifie votre rigueur, elle ne la cree pas.</li>
          <li><strong>"Il faut 500 EUR/mois minimum"</strong> — Faux. Des outils comme RestauMargin sont accessibles des le premier jour.</li>
        </ul>

        {/* ── Cas concrets ── */}
        <h2>Exemples concrets avec RestauMargin</h2>

        <div className="space-y-6 my-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-base font-bold text-slate-900 !mt-0 mb-2">Bistrot parisien : -7 points de food cost</h3>
            <p className="text-sm !mb-1">Food cost estime a 30 %, reel a 36 %. Causes : hausse du beurre non repercutee, portions de frites 40 % trop genereuses, entrecote-frites a 42 % de food cost.</p>
            <p className="text-sm font-semibold text-emerald-600 !mb-0">Resultat : food cost de 36 % a 29 % en 8 semaines. Gain : ~25 000 EUR/an.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-base font-bold text-slate-900 !mt-0 mb-2">Traiteur : formule cocktail a 45 % de food cost</h3>
            <p className="text-sm !mb-1">Reformulation de 3 pieces couteuses + augmentation de prix de 8 %.</p>
            <p className="text-sm font-semibold text-emerald-600 !mb-0">Resultat : food cost de 45 % a 28 %. Marge par evenement +35 %.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-base font-bold text-slate-900 !mt-0 mb-2">Dark kitchen : de 2 % a 11 % de marge nette</h3>
            <p className="text-sm !mb-1">4 plats deficitaires identifies et remplaces par des plats a food cost &lt; 22 %.</p>
            <p className="text-sm font-semibold text-emerald-600 !mb-0">Resultat : marge nette x5 sur le canal livraison en 6 semaines.</p>
          </div>
        </div>

        {/* ── Conviction ── */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-8">
          <h3 className="text-base font-bold text-slate-900 mb-3">Notre conviction</h3>
          <p className="text-sm text-slate-700 !mb-0">
            L'IA n'est ni un gadget ni une revolution. C'est un outil puissant quand il est bien utilise. La vraie revolution, c'est le passage d'une gestion intuitive a une gestion informee. Les restaurateurs qui reussiront ne seront pas ceux qui auront le plus de technologie, mais ceux qui utiliseront la bonne technologie pour se liberer du temps et de l'energie mentale.
          </p>
        </div>
      </article>

      {/* ── CTA ── */}
      <section className="bg-teal-50 py-14 px-4 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
            Essayez l'IA gratuitement avec RestauMargin
          </h2>
          <p className="text-slate-600 mb-6">
            Notre IA fait le travail ingrat (saisie, calcul, analyse) pour que vous puissiez faire le travail noble (cuisiner, accueillir, creer).
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-7 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors"
          >
            Tester gratuitement — sans engagement
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
        .prose-article li {
          margin-bottom: 0.25rem;
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
