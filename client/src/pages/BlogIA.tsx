import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, ArrowRight, ArrowLeft, Clock, User, Scan, Mic, AlertTriangle, BarChart3, ShoppingCart, DollarSign, Heart, Sparkles, ShieldAlert } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — L'IA en restauration : gadget ou revolution ?
   ═══════════════════════════════════════════════════════════════ */

export default function BlogIA() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead title="L'intelligence artificielle en restauration : guide 2026" description="Comment l'IA transforme la restauration : gestion des marges, prévisions de ventes, optimisation des menus, commandes automatisées." path="/blog/ia-restauration" type="article" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "L'intelligence artificielle en restauration : guide 2026",
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
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">Connexion</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <BlogArticleHero
        category="IA"
        readTime="15 min"
        date="Avril 2026"
        title="L'IA en restauration : gadget ou révolution ?"
        accentWord="IA"
        subtitle="L'intelligence artificielle est partout. Mais dans votre cuisine ? Derrière vos fourneaux ? Cet article fait le tri entre les promesses marketing et la réalité du terrain."
      />

      {/* ── Article ── */}
      <article className="max-w-[720px] mx-auto px-6 sm:px-10 lg:px-12 py-12 prose-article bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-14" readTime="15 min" variant="header" />

        <p className="text-lg text-mono-400 leading-relaxed mb-8">
          L'intelligence artificielle est partout. Mais dans votre cuisine ? Derrière vos fourneaux ? Cet article fait le tri entre les promesses marketing et la réalité du terrain.
        </p>

        <h2>Ce que l'IA peut faire en restauration (et fait déjà)</h2>

        {/* 1 */}
        <div className="flex items-start gap-3 mt-8 mb-3">
          <div className="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <Scan className="w-4.5 h-4.5 text-teal-600" />
          </div>
          <h3 className="!mt-0 !mb-0">1. Scanner vos factures automatiquement</h3>
        </div>
        <p>
          Prenez une photo de la facture. En quelques secondes, l'IA extrait le fournisseur, chaque ligne de produit, les quantités, les prix unitaires. Une tâche de 3 heures/semaine se fait en 10 minutes.
        </p>

        {/* 2 */}
        <div className="flex items-start gap-3 mt-8 mb-3">
          <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <Mic className="w-4.5 h-4.5 text-blue-600" />
          </div>
          <h3 className="!mt-0 !mb-0">2. Créer des fiches techniques à la voix</h3>
        </div>
        <p>
          Dictez votre recette en cuisine. L'IA transcrit, identifie chaque ingrédient, récupère le prix fournisseur, calcule le food cost. Fiche technique créée en 30 secondes.
        </p>

        {/* 3 */}
        <div className="flex items-start gap-3 mt-8 mb-3">
          <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />
          </div>
          <h3 className="!mt-0 !mb-0">3. Détecter les anomalies dans vos achats</h3>
        </div>
        <p>
          L'IA croise ventes, fiches techniques et achats pour identifier : ingrédient dont le prix a grimpé, plat sur-portionné, achats inhabituels, tendances saisonnières. Alerte en temps réel au lieu de la découverte en fin de mois.
        </p>

        {/* 4 */}
        <div className="flex items-start gap-3 mt-8 mb-3">
          <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <BarChart3 className="w-4.5 h-4.5 text-purple-600" />
          </div>
          <h3 className="!mt-0 !mb-0">4. Menu engineering automatisé</h3>
        </div>
        <p>
          Collecte automatique des données de vente, croisement avec le coût matière, classement BCG (Star, Puzzle, Cheval de labour, Poids mort) et recommandations concrètes. Une analyse qui prenait une demi-journée est disponible en permanence.
        </p>

        {/* 5 */}
        <div className="flex items-start gap-3 mt-8 mb-3">
          <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShoppingCart className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <h3 className="!mt-0 !mb-0">5. Prévoir la demande</h3>
        </div>
        <p>
          En analysant historiques de vente, météo, événements locaux et vacances, l'IA prévoit les couverts et génère une suggestion de commande fournisseur. Réduction du gaspillage de 20 à 30 %.
        </p>

        {/* 6 */}
        <div className="flex items-start gap-3 mt-8 mb-3">
          <div className="w-9 h-9 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <DollarSign className="w-4.5 h-4.5 text-rose-600" />
          </div>
          <h3 className="!mt-0 !mb-0">6. Suggérer des prix de vente optimaux</h3>
        </div>
        <p>
          Analyse de votre carte, des prix de votre zone, du coût matière et de la sensibilité prix de vos clients pour une fourchette de prix fondée sur des données.
        </p>

        {/* ── Ce que l'IA ne remplace PAS ── */}
        <h2>Ce que l'IA ne remplace PAS (et ne remplacera jamais)</h2>

        <div className="grid sm:grid-cols-2 gap-4 my-6">
          {[
            { icon: <Heart className="w-5 h-5 text-rose-500" />, title: 'Le goût et la sensibilité culinaire', desc: "L'IA ne peut pas goûter une sauce ou imaginer des associations de saveurs." },
            { icon: <Sparkles className="w-5 h-5 text-purple-500" />, title: "La créativité et l'identité", desc: "Ce qui fait la différence, c'est la personnalité du chef, pas le food cost." },
            { icon: <User className="w-5 h-5 text-blue-500" />, title: "Le contact humain", desc: "Un sourire, une recommandation personnalisée : l'hospitalité est humaine." },
            { icon: <ShieldAlert className="w-5 h-5 text-amber-500" />, title: "La gestion d'équipe", desc: "Manager une brigade, gérer un coup de feu : compétences irréductiblement humaines." },
          ].map((item) => (
            <div key={item.title} className="bg-mono-1000 border border-mono-900 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                {item.icon}
                <h3 className="text-sm font-bold text-mono-100 !mt-0 !mb-0">{item.title}</h3>
              </div>
              <p className="text-sm text-mono-500 !mb-0">{item.desc}</p>
            </div>
          ))}
        </div>

        <p>
          L'IA doit être <strong>invisible pour le client</strong>. Elle travaille en coulisses pour que le restaurateur ait plus de temps, plus de marge et plus de sérénité.
        </p>

        {/* ── Fausses promesses ── */}
        <h2>Les fausses promesses à éviter</h2>
        <ul className="space-y-3">
          <li><strong>"L'IA va remplacer vos cuisiniers"</strong> — Non. Les robots ne remplacent pas le savoir-faire d'un cuisinier.</li>
          <li><strong>"Notre algorithme garantit +30 % de CA"</strong> — Aucun outil ne peut garantir cela. Les résultats dépendent de vous.</li>
          <li><strong>"Tout est automatique"</strong> — L'IA a besoin de données. Elle amplifie votre rigueur, elle ne la crée pas.</li>
          <li><strong>"Il faut 500 EUR/mois minimum"</strong> — Faux. Des outils comme RestauMargin sont accessibles dès le premier jour.</li>
        </ul>

        {/* ── Cas concrets ── */}
        <h2>Exemples concrets avec RestauMargin</h2>

        <div className="space-y-6 my-6">
          <div className="bg-white border border-mono-900 rounded-xl p-5">
            <h3 className="text-base font-bold text-mono-100 !mt-0 mb-2">Bistrot parisien : -7 points de food cost</h3>
            <p className="text-sm !mb-1">Food cost estimé à 30 %, réel à 36 %. Causes : hausse du beurre non répercutée, portions de frites 40 % trop généreuses, entrecôte-frites à 42 % de food cost.</p>
            <p className="text-sm font-semibold text-emerald-600 !mb-0">Résultat : food cost de 36 % à 29 % en 8 semaines. Gain : ~25 000 EUR/an.</p>
          </div>
          <div className="bg-white border border-mono-900 rounded-xl p-5">
            <h3 className="text-base font-bold text-mono-100 !mt-0 mb-2">Traiteur : formule cocktail à 45 % de food cost</h3>
            <p className="text-sm !mb-1">Reformulation de 3 pièces coûteuses + augmentation de prix de 8 %.</p>
            <p className="text-sm font-semibold text-emerald-600 !mb-0">Résultat : food cost de 45 % à 28 %. Marge par événement +35 %.</p>
          </div>
          <div className="bg-white border border-mono-900 rounded-xl p-5">
            <h3 className="text-base font-bold text-mono-100 !mt-0 mb-2">Dark kitchen : de 2 % à 11 % de marge nette</h3>
            <p className="text-sm !mb-1">4 plats déficitaires identifiés et remplacés par des plats à food cost &lt; 22 %.</p>
            <p className="text-sm font-semibold text-emerald-600 !mb-0">Résultat : marge nette x5 sur le canal livraison en 6 semaines.</p>
          </div>
        </div>

        {/* ── Avant / Apres ── */}
        <h2>Avant / Après : la gestion avec et sans IA</h2>
        <p>Voici des comparaisons concrètes entre la gestion traditionnelle et la gestion assistée par IA :</p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-mono-1000">
                <th className="text-left px-4 py-2.5 font-semibold text-mono-400">Tâche</th>
                <th className="text-left px-4 py-2.5 font-semibold text-mono-400">Avant (manuel)</th>
                <th className="text-left px-4 py-2.5 font-semibold text-mono-400">Après (avec IA)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Saisie factures','3h/semaine, erreurs de saisie','10 min/semaine, OCR automatique'],
                ['Création fiche technique','30 min par fiche','30 secondes (dictée vocale)'],
                ['Suivi food cost','Excel, calcul mensuel','Temps réel, alerte automatique'],
                ['Menu engineering','Demi-journée d\'analyse','Disponible en permanence'],
                ['Détection anomalies','Découverte en fin de mois','Alerte immédiate'],
                ['Commande fournisseur','Estimation au feeling','Suggestion basée sur l\'historique'],
                ['Révision des prix','Annuelle, au doigt mouillé','Continue, basée sur les données'],
              ].map(([tache, avant, apres]) => (
                <tr key={tache} className="border-t border-mono-975">
                  <td className="px-4 py-2.5 font-medium text-mono-100">{tache}</td>
                  <td className="px-4 py-2.5 text-red-600">{avant}</td>
                  <td className="px-4 py-2.5 text-emerald-600">{apres}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 my-6">
          <p className="text-sm text-emerald-800 !mb-0">
            <strong>Gain de temps estimé :</strong> 8 à 12 heures par semaine sur les tâches administratives. Soit l'équivalent d'un jour et demi de travail redirigé vers la cuisine, le service et la créativité.
          </p>
        </div>

        {/* ── 5 cas d'usage concrets ── */}
        <h2>5 cas d'usage concrets de l'IA en restaurant</h2>

        <div className="space-y-4 my-6">
          <div className="bg-white border border-mono-900 rounded-xl p-5">
            <h3 className="text-base font-bold text-mono-100 !mt-0 mb-2">1. Optimisation des achats</h3>
            <p className="text-sm !mb-1">L'IA analyse vos historiques de consommation, croise avec les prix du marché et les saisons pour vous suggérer le meilleur moment d'acheter chaque ingrédient. Résultat : <strong>économies de 5 à 10 % sur le poste achats</strong>.</p>
          </div>
          <div className="bg-white border border-mono-900 rounded-xl p-5">
            <h3 className="text-base font-bold text-mono-100 !mt-0 mb-2">2. Prévision de fréquentation</h3>
            <p className="text-sm !mb-1">En croisant météo, événements locaux, vacances scolaires et historique, l'IA prévoit le nombre de couverts à +/- 10 %. Vous commandez juste ce qu'il faut. Résultat : <strong>réduction du gaspillage de 20 à 30 %</strong>.</p>
          </div>
          <div className="bg-white border border-mono-900 rounded-xl p-5">
            <h3 className="text-base font-bold text-mono-100 !mt-0 mb-2">3. Contrôle des portions</h3>
            <p className="text-sm !mb-1">L'IA compare le food cost théorique (fiches techniques) et le food cost réel (achats). Un écart anormal déclenche une alerte : sur-portions, pertes anormales, erreurs de recette. Résultat : <strong>food cost réel aligné sur le théorique à 2 points près</strong>.</p>
          </div>
          <div className="bg-white border border-mono-900 rounded-xl p-5">
            <h3 className="text-base font-bold text-mono-100 !mt-0 mb-2">4. Pricing dynamique intelligent</h3>
            <p className="text-sm !mb-1">L'IA analyse la sensibilité prix de vos clients, les prix de votre zone de chalandise et votre structure de coûts pour suggérer des ajustements de prix. Résultat : <strong>augmentation du ticket moyen de 3 à 8 %</strong> sans perte de fréquentation.</p>
          </div>
          <div className="bg-white border border-mono-900 rounded-xl p-5">
            <h3 className="text-base font-bold text-mono-100 !mt-0 mb-2">5. Analyse de rentabilité en temps réel</h3>
            <p className="text-sm !mb-1">Chaque plat est suivi en continu : food cost, marge, popularité, tendance. L'IA génère un tableau de bord avec des recommandations actionnables (retirer un poids mort, promouvoir une énigme). Résultat : <strong>+3 à 5 points de marge brute globale</strong>.</p>
          </div>
        </div>

        {/* ── CTA intermediaire ── */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 my-8 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Testez l'IA de RestauMargin gratuitement</h3>
          <p className="text-teal-100 text-sm mb-4">Scan de factures, fiches techniques vocales, menu engineering automatique. Tout est inclus dans l'essai gratuit.</p>
          <Link
            to="/login?mode=register"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-colors text-sm"
          >
            Créer mon compte gratuit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Articles complementaires ── */}
        <h2>Articles complémentaires</h2>
        <div className="grid sm:grid-cols-3 gap-4 my-6">
          <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-4 hover:border-teal-300 hover:shadow-sm transition-all group">
            <h3 className="text-sm font-bold text-mono-100 mb-1 group-hover:text-teal-700 transition-colors !mt-0">Calcul de marge restaurant : guide 2026</h3>
            <p className="text-xs text-mono-500 !mb-0">Formules, benchmarks et erreurs courantes.</p>
          </Link>
          <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-4 hover:border-teal-300 hover:shadow-sm transition-all group">
            <h3 className="text-sm font-bold text-mono-100 mb-1 group-hover:text-teal-700 transition-colors !mt-0">5 méthodes pour réduire le food cost de 15 %</h3>
            <p className="text-xs text-mono-500 !mb-0">Fiches techniques, négociation, gaspillage.</p>
          </Link>
          <Link to="/blog/coefficient-multiplicateur" className="bg-mono-1000 border border-mono-900 rounded-xl p-4 hover:border-teal-300 hover:shadow-sm transition-all group">
            <h3 className="text-sm font-bold text-mono-100 mb-1 group-hover:text-teal-700 transition-colors !mt-0">Coefficient multiplicateur en restauration</h3>
            <p className="text-xs text-mono-500 !mb-0">Tableaux complets, exemples et erreurs à éviter.</p>
          </Link>
        </div>

        {/* ── FAQ ── */}
        <h2>Questions fréquentes sur l'IA en restauration</h2>
        <div className="space-y-3 my-6">
          {[
            { q: 'L\'IA peut-elle vraiment aider un petit restaurant ?', a: 'Oui. L\'IA n\'est pas réservée aux grandes chaînes. Un petit restaurant avec 40-80 couverts/jour bénéficie énormément de l\'automatisation des tâches répétitives : saisie de factures, calcul de food cost, suivi des prix fournisseurs. Le gain de temps et la précision des calculs s\'appliquent quelle que soit la taille de l\'établissement.' },
            { q: 'Combien coûte un outil de gestion IA pour restaurant ?', a: 'Les prix varient énormément. Certains outils comme RestauMargin proposent un essai gratuit et des formules accessibles dès le premier jour. Le retour sur investissement est généralement atteint en 1 à 3 mois grâce aux économies réalisées sur le food cost (3 à 5 points de marge en plus).' },
            { q: 'L\'IA va-t-elle remplacer les cuisiniers ?', a: 'Non. L\'IA excelle dans le calcul, l\'analyse de données et la détection d\'anomalies. Elle ne peut pas goûter une sauce, créer une recette originale ou gérer un coup de feu. Son rôle est de libérer le restaurateur des tâches administratives pour qu\'il puisse se concentrer sur la cuisine et le service.' },
            { q: 'Comment l\'IA détecte-t-elle les anomalies dans les achats ?', a: 'L\'IA compare les achats réels avec les consommations théoriques (calculées à partir des ventes x fiches techniques). Un écart anormal (par exemple, achat de 50 kg de saumon pour 30 kg de consommation théorique) déclenche une alerte : gaspillage, sur-portions, vol ou erreur de commande.' },
            { q: 'Faut-il des compétences techniques pour utiliser l\'IA ?', a: 'Non. Les outils modernes comme RestauMargin sont conçus pour être utilisés par des restaurateurs, pas des informaticiens. L\'interface est simple : photographiez vos factures, dictez vos recettes, consultez vos tableaux de bord. L\'IA travaille en coulisses.' },
            { q: 'Quels sont les résultats concrets de l\'IA en restauration ?', a: 'D\'après les cas clients de RestauMargin : réduction du food cost de 3 à 7 points, gain de 8 à 12 heures/semaine sur les tâches administratives, augmentation du ticket moyen de 3 à 8 %, réduction du gaspillage de 20 à 30 %. Le ROI est généralement atteint en 2-3 mois.' },
          ].map((item) => (
            <details key={item.q} className="bg-mono-1000 border border-mono-900 rounded-xl group">
              <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors text-sm">
                {item.q}
                <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform flex-shrink-0 ml-2" />
              </summary>
              <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>

        {/* ── Conviction ── */}
        <div className="bg-mono-1000 border border-mono-900 rounded-xl p-6 my-8">
          <h3 className="text-base font-bold text-mono-100 mb-3">Notre conviction</h3>
          <p className="text-sm text-mono-350 !mb-0">
            L'IA n'est ni un gadget ni une révolution. C'est un outil puissant quand il est bien utilisé. La vraie révolution, c'est le passage d'une gestion intuitive à une gestion informée. Les restaurateurs qui réussiront ne seront pas ceux qui auront le plus de technologie, mais ceux qui utiliseront la bonne technologie pour se libérer du temps et de l'énergie mentale.
          </p>
        </div>
        <BlogAuthor publishedDate="2026-04-14" readTime="15 min" variant="footer" />
      </article>

      {/* ── CTA ── */}
      <section className="bg-teal-50 py-14 px-4 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-mono-100 mb-3 font-satoshi">
            Essayez l'IA gratuitement avec RestauMargin
          </h2>
          <p className="text-mono-400 mb-6">
            Notre IA fait le travail ingrat (saisie, calcul, analyse) pour que vous puissiez faire le travail noble (cuisiner, accueillir, créer).
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
      <footer className="border-t border-mono-900 py-8 px-4">
        <div className="max-w-[720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-mono-700">
          <Link to="/" className="flex items-center gap-1.5 hover:text-teal-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
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
            headline: "L'IA en restauration : gadget ou révolution ?",
            description: "Intelligence artificielle en restauration : découvrez ce que l'IA peut vraiment faire pour votre restaurant et ce qu'elle ne remplacera jamais.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-03-25',
            dateModified: '2026-04-08',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/ia-restauration' },
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
                name: "L'IA peut-elle vraiment aider un petit restaurant ?",
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "Oui. L'IA n'est pas réservée aux grandes chaînes. Un petit restaurant bénéficie de l'automatisation des tâches répétitives : saisie factures, calcul food cost, suivi prix fournisseurs.",
                },
              },
              {
                '@type': 'Question',
                name: "Combien coûte un outil de gestion IA pour restaurant ?",
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "Les prix varient. RestauMargin propose un essai gratuit. Le ROI est atteint en 1 à 3 mois grâce aux économies sur le food cost.",
                },
              },
              {
                '@type': 'Question',
                name: "L'IA va-t-elle remplacer les cuisiniers ?",
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "Non. L'IA excelle dans le calcul et l'analyse. Elle ne peut pas goûter une sauce ou créer une recette originale. Son rôle est de libérer le restaurateur des tâches administratives.",
                },
              },
              {
                '@type': 'Question',
                name: "Comment l'IA détecte-t-elle les anomalies dans les achats ?",
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "L'IA compare achats réels et consommations théoriques. Un écart anormal déclenche une alerte : gaspillage, sur-portions, vol ou erreur de commande.",
                },
              },
              {
                '@type': 'Question',
                name: "Faut-il des compétences techniques pour utiliser l'IA ?",
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "Non. Les outils modernes sont conçus pour des restaurateurs. Photographiez vos factures, dictez vos recettes, consultez vos tableaux de bord.",
                },
              },
              {
                '@type': 'Question',
                name: "Quels sont les résultats concrets de l'IA en restauration ?",
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "Réduction food cost 3-7 points, gain 8-12h/semaine, ticket moyen +3-8 %, gaspillage -20-30 %. ROI en 2-3 mois.",
                },
              },
            ],
          }),
        }}
      />

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
