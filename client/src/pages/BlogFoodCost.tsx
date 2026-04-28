import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, ArrowRight, ArrowLeft, Clock, User, Target, TrendingDown, ShoppingCart, BarChart3, LineChart } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — 5 methodes pour reduire votre food cost de 15 %
   ═══════════════════════════════════════════════════════════════ */

export default function BlogFoodCost() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead title="Réduire le food cost de votre restaurant : 10 stratégies" description="Stratégies concrètes pour réduire le food cost de votre restaurant : gestion des stocks, fiches techniques, négociation fournisseurs, réduction du gaspillage." path="/blog/reduire-food-cost" type="article" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Réduire le food cost de votre restaurant : 10 stratégies",
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
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
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
        category="Food Cost"
        readTime="10 min"
        date="Avril 2026"
        title="5 methodes pour reduire votre food cost de 15 %"
        accentWord="food cost"
        subtitle="Un food cost de 35 % au lieu de 30 % peut faire perdre 25 000 EUR de marge brute par an. Decouvrez 5 methodes eprouvees : fiches techniques, negociation fournisseurs, reduction du gaspillage, menu engineering, mercuriale."
      />

      {/* ── Article ── */}
      <article className="max-w-[720px] mx-auto px-6 sm:px-10 lg:px-12 py-12 prose-article bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-14" readTime="10 min" variant="header" />

        <p className="text-lg text-mono-400 leading-relaxed mb-8">
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
              <tr className="bg-mono-1000">
                <th className="text-left px-4 py-2.5 font-semibold text-mono-400">Categorie</th>
                <th className="text-left px-4 py-2.5 font-semibold text-mono-400">Popularite</th>
                <th className="text-left px-4 py-2.5 font-semibold text-mono-400">Marge</th>
                <th className="text-left px-4 py-2.5 font-semibold text-mono-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Star','Haute','Haute','Maintenir, mettre en avant'],
                ['Puzzle','Basse','Haute','Promouvoir, repositionner'],
                ['Cheval de labour','Haute','Basse','Optimiser le cout matiere'],
                ['Poids mort','Basse','Basse','Reformuler ou retirer'],
              ].map(([cat, pop, marge, action]) => (
                <tr key={cat} className="border-t border-mono-975">
                  <td className="px-4 py-2.5 font-medium text-mono-100">{cat}</td>
                  <td className="px-4 py-2.5 text-mono-350">{pop}</td>
                  <td className="px-4 py-2.5 text-mono-350">{marge}</td>
                  <td className="px-4 py-2.5 text-mono-500">{action}</td>
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
              <tr className="bg-mono-1000">
                <th className="text-left px-4 py-2.5 font-semibold text-mono-400">Methode</th>
                <th className="text-left px-4 py-2.5 font-semibold text-mono-400">Reduction</th>
                <th className="text-left px-4 py-2.5 font-semibold text-mono-400">Economies/an</th>
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
                <tr key={m} className="border-t border-mono-975">
                  <td className="px-4 py-2.5 font-medium text-mono-100">{m}</td>
                  <td className="px-4 py-2.5 text-mono-350">{r}</td>
                  <td className="px-4 py-2.5 text-mono-350">{e}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-mono-800 bg-teal-50">
                <td className="px-4 py-2.5 font-bold text-mono-100">Total cumule</td>
                <td className="px-4 py-2.5 font-bold text-teal-700">-14 a -29 %</td>
                <td className="px-4 py-2.5 font-bold text-teal-700">~24 750 EUR</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Plan d'action ── */}
        <div className="bg-mono-1000 border border-mono-900 rounded-xl p-6 my-8">
          <h3 className="text-base font-bold text-mono-100 mb-3">Votre plan d'action en 5 etapes</h3>
          <ol className="space-y-1.5 text-sm text-mono-350">
            <li>1. <strong>Semaine 1-2 :</strong> Creez les fiches techniques de vos 10 plats les plus vendus.</li>
            <li>2. <strong>Semaine 3 :</strong> Demandez des devis a 2 fournisseurs alternatifs.</li>
            <li>3. <strong>Semaine 4 :</strong> Systeme de pesee des dechets + top 5 des produits gaspilles.</li>
            <li>4. <strong>Mois 2 :</strong> Premiere analyse menu engineering et ajustement de carte.</li>
            <li>5. <strong>En continu :</strong> Suivi mercuriale hebdomadaire de vos ingredients cles.</li>
          </ol>
        </div>

        {/* ── Guide pas a pas : calculer votre food cost ── */}
        <h2>Guide pas a pas : calculer le food cost d'un plat</h2>
        <p>Voici la methode en 6 etapes pour calculer le food cost reel d'un plat, en tenant compte des rendements et des pertes.</p>

        <div className="space-y-4 my-6">
          {[
            { step: '1', title: 'Listez tous les ingredients', desc: 'Pour chaque plat, dressez la liste exhaustive des ingredients, y compris huile de cuisson, assaisonnement, garniture et sauce.' },
            { step: '2', title: 'Pesez les quantites nettes', desc: 'Utilisez une balance de precision. Notez le poids net (apres epluchage, parage, desossage). Un kilo de carottes brutes donne environ 800 g net.' },
            { step: '3', title: 'Relevez les prix fournisseurs', desc: 'Recuperez le prix unitaire de chaque ingredient sur votre derniere facture. Attention : utilisez le prix au kilo net, pas au kilo brut.' },
            { step: '4', title: 'Calculez le cout par ingredient', desc: 'Multipliez la quantite nette par le prix unitaire. Exemple : 200 g de saumon a 22 EUR/kg = 4,40 EUR.' },
            { step: '5', title: 'Additionnez pour obtenir le cout total', desc: 'La somme de tous les couts ingredients donne le cout matiere total du plat. N\'oubliez pas les petits ingredients (epices, beurre, herbes).' },
            { step: '6', title: 'Divisez par le prix de vente HT', desc: 'Food cost (%) = (Cout matiere total / Prix de vente HT) x 100. Si le resultat depasse votre objectif, ajustez les portions ou le prix.' },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 bg-white border border-mono-900 rounded-xl p-4">
              <div className="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 text-teal-700 font-bold text-sm">
                {item.step}
              </div>
              <div>
                <h3 className="text-sm font-bold text-mono-100 !mt-0 !mb-1">{item.title}</h3>
                <p className="text-sm text-mono-400 !mb-0">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Exemple interactif ── */}
        <h2>Exemple concret : plat de saumon grille</h2>
        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-mono-1000">
                <th className="text-left px-4 py-2.5 font-semibold text-mono-400">Ingredient</th>
                <th className="text-left px-4 py-2.5 font-semibold text-mono-400">Quantite nette</th>
                <th className="text-left px-4 py-2.5 font-semibold text-mono-400">Prix/kg</th>
                <th className="text-left px-4 py-2.5 font-semibold text-mono-400">Cout</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Pave de saumon','180 g','22,00 EUR','3,96 EUR'],
                ['Riz basmati','120 g','2,50 EUR','0,30 EUR'],
                ['Beurre','20 g','12,00 EUR','0,24 EUR'],
                ['Citron','1/4 piece','3,00 EUR/kg','0,15 EUR'],
                ['Haricots verts','80 g','4,50 EUR','0,36 EUR'],
                ['Epices + sel','5 g','—','0,10 EUR'],
              ].map(([ing, qty, prix, cout]) => (
                <tr key={ing} className="border-t border-mono-975">
                  <td className="px-4 py-2.5 font-medium text-mono-100">{ing}</td>
                  <td className="px-4 py-2.5 text-mono-350">{qty}</td>
                  <td className="px-4 py-2.5 text-mono-350">{prix}</td>
                  <td className="px-4 py-2.5 text-mono-350">{cout}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-mono-800 bg-teal-50">
                <td className="px-4 py-2.5 font-bold text-mono-100" colSpan={3}>Cout matiere total</td>
                <td className="px-4 py-2.5 font-bold text-teal-700">5,11 EUR</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 my-6">
          <p className="text-center text-sm text-teal-800 mb-1"><strong>Prix de vente HT :</strong> 17,00 EUR</p>
          <p className="text-center text-lg font-bold text-teal-800">Food cost = 5,11 / 17,00 x 100 = 30,1 %</p>
          <p className="text-center text-sm text-teal-600">Coefficient multiplicateur : 3,33 — Marge brute : 11,89 EUR (69,9 %)</p>
        </div>

        {/* ── Benchmarks food cost par type de cuisine ── */}
        <h2>Benchmarks du food cost par type de cuisine</h2>
        <p>Les objectifs de food cost varient selon le type d'etablissement. Voici les fourchettes recommandees en France en 2026 :</p>
        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-mono-1000">
                <th className="text-left px-4 py-2.5 font-semibold text-mono-400">Type d'etablissement</th>
                <th className="text-left px-4 py-2.5 font-semibold text-mono-400">Food cost cible</th>
                <th className="text-left px-4 py-2.5 font-semibold text-mono-400">Explication</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Pizzeria / Creperie','20-25 %','Ingredients de base peu couteux (farine, oeufs)'],
                ['Fast-food / Snack','25-30 %','Produits standardises, gros volumes'],
                ['Bistrot / Brasserie','28-33 %','Carte variee, produits de marche'],
                ['Restaurant traditionnel','30-35 %','Produits frais, travail de preparation'],
                ['Gastronomique','32-40 %','Produits premium, portions travaillees'],
                ['Dark kitchen','28-35 %','Commissions plateformes a ajouter (25-35 %)'],
                ['Traiteur / Evenementiel','30-38 %','Economies d\'echelle mais logistique'],
              ].map(([type, fc, expl]) => (
                <tr key={type} className="border-t border-mono-975">
                  <td className="px-4 py-2.5 font-medium text-mono-100">{type}</td>
                  <td className="px-4 py-2.5 text-teal-700 font-semibold">{fc}</td>
                  <td className="px-4 py-2.5 text-mono-500">{expl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── CTA intermediaire ── */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 my-8 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Calculez votre food cost en 2 minutes</h3>
          <p className="text-teal-100 text-sm mb-4">Notre calculateur gratuit fait le travail pour vous. Ajoutez vos ingredients et obtenez instantanement votre food cost, votre marge et votre coefficient.</p>
          <Link
            to="/outils/calculateur-food-cost"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-colors text-sm"
          >
            Utiliser le calculateur gratuit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Articles complementaires ── */}
        <h2>Articles complementaires</h2>
        <div className="grid sm:grid-cols-3 gap-4 my-6">
          <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-4 hover:border-teal-300 hover:shadow-sm transition-all group">
            <h3 className="text-sm font-bold text-mono-100 mb-1 group-hover:text-teal-700 transition-colors !mt-0">Calcul de marge restaurant : guide complet 2026</h3>
            <p className="text-xs text-mono-500 !mb-0">Formules, benchmarks et erreurs courantes.</p>
          </Link>
          <Link to="/blog/coefficient-multiplicateur" className="bg-mono-1000 border border-mono-900 rounded-xl p-4 hover:border-teal-300 hover:shadow-sm transition-all group">
            <h3 className="text-sm font-bold text-mono-100 mb-1 group-hover:text-teal-700 transition-colors !mt-0">Coefficient multiplicateur en restauration</h3>
            <p className="text-xs text-mono-500 !mb-0">Tableaux complets par categorie de plat.</p>
          </Link>
          <Link to="/blog/ia-restauration" className="bg-mono-1000 border border-mono-900 rounded-xl p-4 hover:border-teal-300 hover:shadow-sm transition-all group">
            <h3 className="text-sm font-bold text-mono-100 mb-1 group-hover:text-teal-700 transition-colors !mt-0">L'IA en restauration</h3>
            <p className="text-xs text-mono-500 !mb-0">Comment l'IA optimise vos couts automatiquement.</p>
          </Link>
        </div>

        {/* ── FAQ ── */}
        <h2>Questions frequentes sur le food cost</h2>
        <div className="space-y-3 my-6">
          {[
            { q: 'Qu\'est-ce que le food cost en restauration ?', a: 'Le food cost est le ratio entre le cout des matieres premieres et le chiffre d\'affaires HT. Il s\'exprime en pourcentage. Un food cost de 30 % signifie que pour chaque euro de vente, 30 centimes vont aux ingredients. C\'est l\'indicateur numero un pour piloter la rentabilite d\'un restaurant.' },
            { q: 'Comment calculer le food cost d\'un plat ?', a: 'Additionnez le cout de tous les ingredients (quantites nettes x prix unitaire), puis divisez par le prix de vente HT du plat et multipliez par 100. Formule : Food cost (%) = (Cout matiere total / Prix de vente HT) x 100.' },
            { q: 'Quel food cost viser pour etre rentable ?', a: 'En restauration traditionnelle, visez un food cost entre 28 % et 33 %. Pour une pizzeria, 20-25 % est atteignable. Pour le gastronomique, 32-40 % est courant. L\'essentiel est que le food cost + le ratio personnel (prime cost) ne depasse pas 65-70 % du CA.' },
            { q: 'Quelle est la difference entre food cost theorique et food cost reel ?', a: 'Le food cost theorique est calcule a partir des fiches techniques (quantites ideales). Le food cost reel est calcule a partir des achats effectifs. La difference revele le gaspillage, les sur-portions, le vol ou les erreurs d\'inventaire. Idealement, l\'ecart ne devrait pas depasser 2 points.' },
            { q: 'Comment reduire son food cost sans baisser la qualite ?', a: 'Cinq leviers principaux : 1) fiches techniques avec grammages precis, 2) negociation fournisseurs, 3) reduction du gaspillage (FIFO, pesee des dechets), 4) menu engineering pour promouvoir les plats rentables, 5) suivi mercuriale pour acheter au meilleur moment.' },
            { q: 'Quelle est la formule du coefficient multiplicateur ?', a: 'Coefficient = 1 / Food cost cible. Pour un food cost de 30 %, le coefficient est 3,33. Multipliez le cout matiere par ce coefficient pour obtenir le prix de vente HT. Consultez notre guide complet du coefficient multiplicateur pour plus de details.' },
            { q: 'A quelle frequence recalculer le food cost ?', a: 'Le food cost global doit etre suivi chaque semaine minimum. Les fiches techniques doivent etre mises a jour a chaque changement de prix fournisseur. Avec un outil comme RestauMargin, ce suivi est automatise en temps reel grace au scan des factures.' },
            { q: 'Le food cost inclut-il les boissons ?', a: 'En general, on distingue le food cost (nourriture seule) du beverage cost (boissons). Le food cost se situe entre 25-35 % tandis que le beverage cost est plus bas (18-25 % pour les boissons, 20-30 % pour les vins). Pour une vision globale, calculez le cost of goods sold (COGS) qui combine les deux.' },
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
        <BlogAuthor publishedDate="2026-04-14" readTime="10 min" variant="footer" />
      </article>

      {/* ── CTA ── */}
      <section className="bg-teal-50 py-14 px-4 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-mono-100 mb-3 font-satoshi">
            Automatisez ces 5 methodes avec RestauMargin
          </h2>
          <p className="text-mono-400 mb-6">
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
      <footer className="border-t border-mono-900 py-8 px-4">
        <div className="max-w-[720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-mono-700">
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
            headline: '5 methodes pour reduire votre food cost de 15 %',
            description: 'Decouvrez 5 methodes eprouvees pour reduire votre food cost de 15 % sans sacrifier la qualite. Fiches techniques, negociation, gaspillage, menu engineering.',
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-03-15',
            dateModified: '2026-04-08',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/reduire-food-cost' },
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
                name: "Qu'est-ce que le food cost en restauration ?",
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "Le food cost est le ratio entre le cout des matieres premieres et le chiffre d'affaires HT. Un food cost de 30 % signifie que pour chaque euro de vente, 30 centimes vont aux ingredients.",
                },
              },
              {
                '@type': 'Question',
                name: "Comment calculer le food cost d'un plat ?",
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "Additionnez le cout de tous les ingredients, puis divisez par le prix de vente HT et multipliez par 100. Formule : Food cost (%) = (Cout matiere total / Prix de vente HT) x 100.",
                },
              },
              {
                '@type': 'Question',
                name: 'Quel food cost viser pour etre rentable ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "En restauration traditionnelle, visez 28-33 %. Pizzeria : 20-25 %. Gastronomique : 32-40 %. Le prime cost (food cost + ratio personnel) ne doit pas depasser 65-70 % du CA.",
                },
              },
              {
                '@type': 'Question',
                name: 'Quelle est la difference entre food cost theorique et food cost reel ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "Le food cost theorique vient des fiches techniques. Le reel vient des achats effectifs. La difference revele gaspillage, sur-portions ou vol. L'ecart ideal est inferieur a 2 points.",
                },
              },
              {
                '@type': 'Question',
                name: 'Comment reduire son food cost sans baisser la qualite ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Cinq leviers : fiches techniques precises, negociation fournisseurs, reduction gaspillage, menu engineering, suivi mercuriale.',
                },
              },
              {
                '@type': 'Question',
                name: 'Quelle est la formule du coefficient multiplicateur ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Coefficient = 1 / Food cost cible. Pour un food cost de 30 %, le coefficient est 3,33.',
                },
              },
              {
                '@type': 'Question',
                name: 'A quelle frequence recalculer le food cost ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Chaque semaine minimum pour le food cost global. A chaque changement de prix fournisseur pour les fiches techniques.',
                },
              },
              {
                '@type': 'Question',
                name: 'Le food cost inclut-il les boissons ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'En general, on distingue food cost (nourriture, 25-35 %) et beverage cost (boissons, 18-25 %). Le COGS combine les deux.',
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
